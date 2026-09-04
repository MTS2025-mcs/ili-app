import {
  calculateILI,
  calculateIAR,
  getAreaScore,
  getCoherencePoints,
  getAttentionScore,
  getPlausibilityScore,
  getAccuracyScore,
  getProcessScore,
  normalizeValue,
} from '@/lib/scoring-engine';
import { diagnosticQuestions } from '@/question-bank/questions';
import type { Answer, AreaCode } from '@/types/scoring';

function buildDiagnosticAnswers(value: number): Record<string, Answer> {
  const answers: Record<string, Answer> = {};
  for (const q of diagnosticQuestions) {
    answers[q.id] = { questionId: q.id, value, timestamp: 0 };
  }
  return answers;
}

function buildDiagnosticExtremes(positive: number, reverse: number): Record<string, Answer> {
  const answers: Record<string, Answer> = {};
  for (const q of diagnosticQuestions) {
    answers[q.id] = { questionId: q.id, value: q.direction === 'positive' ? positive : reverse, timestamp: 0 };
  }
  return answers;
}

function buildAllAnswers(diagnosticValue: number, reliability: Partial<Record<string, number>> = {}): Record<string, Answer> {
  const answers = buildDiagnosticAnswers(diagnosticValue);
  for (const [id, value] of Object.entries(reliability)) {
    answers[id] = { questionId: id, value: value ?? 0, timestamp: 0 };
  }
  return answers;
}

describe('Normalizzazione', () => {
  it('converte 1-5 diretto in 0,25,50,75,100', () => {
    expect(normalizeValue(1, 'positive')).toBe(0);
    expect(normalizeValue(2, 'positive')).toBe(25);
    expect(normalizeValue(3, 'positive')).toBe(50);
    expect(normalizeValue(4, 'positive')).toBe(75);
    expect(normalizeValue(5, 'positive')).toBe(100);
  });

  it('converte 1-5 inverso in 100,75,50,25,0', () => {
    expect(normalizeValue(1, 'reverse')).toBe(100);
    expect(normalizeValue(2, 'reverse')).toBe(75);
    expect(normalizeValue(3, 'reverse')).toBe(50);
    expect(normalizeValue(4, 'reverse')).toBe(25);
    expect(normalizeValue(5, 'reverse')).toBe(0);
  });
});

describe('Punteggio area', () => {
  it('risposte massime autonomia: ogni area = 100', () => {
    const answers = buildDiagnosticExtremes(5, 1);
    for (const code of ['HR', 'SE', 'FI', 'MK', 'TI'] as AreaCode[]) {
      expect(getAreaScore(answers, code)).toBe(100);
    }
  });

  it('risposte minime autonomia: ogni area = 0', () => {
    const answers = buildDiagnosticExtremes(1, 5);
    for (const code of ['HR', 'SE', 'FI', 'MK', 'TI'] as AreaCode[]) {
      expect(getAreaScore(answers, code)).toBe(0);
    }
  });

  it('tutte 3: ogni area = 50', () => {
    const answers = buildDiagnosticAnswers(3);
    for (const code of ['HR', 'SE', 'FI', 'MK', 'TI'] as AreaCode[]) {
      expect(getAreaScore(answers, code)).toBe(50);
    }
  });
});

describe('ILI', () => {
  it('minima autonomia => ILI = 0, dipendenza = 100', () => {
    const result = calculateILI(buildDiagnosticExtremes(1, 5));
    expect(result.ili).toBe(0);
    expect(result.dependencyIndex).toBe(100);
  });

  it('massima autonomia => ILI = 100, dipendenza = 0', () => {
    const result = calculateILI(buildDiagnosticExtremes(5, 1));
    expect(result.ili).toBe(100);
    expect(result.dependencyIndex).toBe(0);
  });

  it('tutte 3 => ILI = 50, livello corretto', () => {
    const result = calculateILI(buildDiagnosticAnswers(3));
    expect(result.ili).toBe(50);
    expect(result.level).toBe('Libertà fragile');
  });

  it('valori sulle soglie', () => {
    expect(calculateILI(buildDiagnosticExtremes(1, 5)).ili).toBe(0);
    expect(calculateILI(buildDiagnosticExtremes(5, 1)).ili).toBe(100);
  });
});

describe('Coppie di coerenza', () => {
  it('risposta identica al parallel normalizzato => 10', () => {
    // HR02 positive, risposta 4. VA01 reverse, risposta 2 -> normalizzati sono 75 e 75.
    expect(getCoherencePoints(4, 2, 'positive', 'reverse')).toBe(10);
  });

  it('differenza di 1 step => 8', () => {
    // HR02 = 4 (75), VA01 = 3 (50). diff=25 => 1 step.
    expect(getCoherencePoints(4, 3, 'positive', 'reverse')).toBe(8);
  });

  it('differenza di 4 step => 0', () => {
    // HR02 = 5 (100), VA01 = 5 (0). diff=100 => 4 step.
    expect(getCoherencePoints(5, 5, 'positive', 'reverse')).toBe(0);
  });
});

describe('IAR componenti', () => {
  it('VA08 corretto dà 15 punti', () => {
    const answers: Record<string, Answer> = {
      VA08: { questionId: 'VA08', value: 2, timestamp: 0 },
    };
    expect(getAttentionScore(answers)).toBe(15);
  });

  it('VA08 errato dà 0 punti', () => {
    const answers: Record<string, Answer> = {
      VA08: { questionId: 'VA08', value: 1, timestamp: 0 },
    };
    expect(getAttentionScore(answers)).toBe(0);
  });

  it('plausibilità massima', () => {
    const answers: Record<string, Answer> = {
      VA06: { questionId: 'VA06', value: 2, timestamp: 0 },
      VA07: { questionId: 'VA07', value: 1, timestamp: 0 },
    };
    expect(getPlausibilityScore(answers)).toBe(15);
  });

  it('VA06 "Nessuna" non assegna punti di plausibilità', () => {
    const answers: Record<string, Answer> = {
      VA06: { questionId: 'VA06', value: 1, timestamp: 0 },
      VA07: { questionId: 'VA07', value: 1, timestamp: 0 },
    };
    expect(getPlausibilityScore(answers)).toBe(7.5);
  });

  it('VA06: le risposte oltre "Nessuna" valgono tutte uguale', () => {
    for (const value of [2, 3, 4, 5]) {
      const answers: Record<string, Answer> = {
        VA06: { questionId: 'VA06', value, timestamp: 0 },
      };
      expect(getPlausibilityScore(answers)).toBe(7.5);
    }
  });

  it('accuratezza massima', () => {
    const answers: Record<string, Answer> = {
      VA09: { questionId: 'VA09', value: 5, timestamp: 0 },
      VA10: { questionId: 'VA10', value: 1, timestamp: 0 },
    };
    expect(getAccuracyScore(answers)).toBe(10);
  });

  it('qualità processo: 5-30 minuti con varietà => 10', () => {
    const answers: Record<string, Answer> = {};
    let value = 1;
    for (const q of diagnosticQuestions) {
      answers[q.id] = { questionId: q.id, value: (value % 5) + 1, timestamp: 0 };
      value += 1;
    }
    expect(getProcessScore(answers, 15 * 60 * 1000)).toBe(10);
  });

  it('qualità processo: troppo rapido e uniforme => 2', () => {
    const answers = buildDiagnosticAnswers(5); // tutti 5
    expect(getProcessScore(answers, 2 * 60 * 1000)).toBe(2);
  });
});

describe('IAR totale', () => {
  it('tutte 5 coerente e plausibile restituisce punteggio', () => {
    const answers = buildAllAnswers(5, {
      VA01: 1,
      VA02: 1,
      VA03: 1,
      VA04: 1,
      VA05: 1,
      VA06: 2,
      VA07: 1,
      VA08: 2,
      VA09: 5,
      VA10: 1,
    });
    const iar = calculateIAR(answers, 20 * 60 * 1000);
    expect(iar.total).toBeGreaterThan(0);
    expect(iar.status).toBe('high');
  });
});
