import { brand } from '@/config/brand';
import { scoring } from '@/config/scoring';
import { diagnosticQuestions, reliabilityQuestions } from '@/question-bank/questions';
import type { Answer, AreaCode, AreaScore, CoherenceResult, DiagnosticQuestion, ILIResult, ReliabilityScore, SubdimensionScore } from '@/types/scoring';

export function normalizeValue(value: number, direction: 'positive' | 'reverse'): number {
  if (direction === 'positive') {
    return (value - 1) * 25;
  }
  return (5 - value) * 25;
}

export function getAreaScore(answers: Record<string, Answer>, area: AreaCode): number {
  const items = diagnosticQuestions.filter((q) => q.area === area);
  const sum = items.reduce((acc, q) => {
    const v = Number(answers[q.id]?.value ?? 3);
    return acc + normalizeValue(v, q.direction);
  }, 0);
  return sum / items.length;
}

export function getSubdimensionScores(answers: Record<string, Answer>): SubdimensionScore[] {
  const map = new Map<string, number[]>();
  for (const q of diagnosticQuestions) {
    const v = Number(answers[q.id]?.value ?? 3);
    const norm = normalizeValue(v, q.direction);
    const key = `${q.area}:${q.subdimension}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(norm);
  }
  const results: SubdimensionScore[] = [];
  for (const [key, values] of map) {
    const [area, subdimension] = key.split(':');
    results.push({
      area: area as AreaCode,
      subdimension,
      score: values.reduce((a, b) => a + b, 0) / values.length,
    });
  }
  return results;
}

export function classifyArea(score: number): AreaScore['level'] {
  if (score < scoring.thresholds.area.critical) return 'critical';
  if (score < scoring.thresholds.area.consolidate) return 'consolidate';
  if (score < scoring.thresholds.area.functional) return 'functional';
  return 'strength';
}

export function getILILevel(ili: number): string {
  for (const band of scoring.thresholds.ili) {
    if (ili <= band.max) return band.label;
  }
  return scoring.thresholds.ili[scoring.thresholds.ili.length - 1].label;
}

export function calculateILI(answers: Record<string, Answer>): ILIResult {
  const areaScores = {} as Record<AreaCode, number>;
  for (const code of Object.keys(scoring.areas) as AreaCode[]) {
    areaScores[code] = getAreaScore(answers, code);
  }

  let ili = 0;
  for (const code of Object.keys(scoring.areas) as AreaCode[]) {
    ili += areaScores[code] * scoring.areas[code].weight;
  }

  const bottleneck = (Object.keys(areaScores) as AreaCode[]).reduce((a, b) =>
    areaScores[a] < areaScores[b] ? a : b
  );

  return {
    ili,
    dependencyIndex: 100 - ili,
    level: getILILevel(ili),
    areaScores,
    bottleneck,
  };
}

export function getCoherencePoints(original: number, parallel: number, originalDirection: 'positive' | 'reverse', parallelDirection: 'positive' | 'reverse'): number {
  // Normalizza entrambi nella stessa direzione dell'item originale.
  const originalNorm = normalizeValue(original, originalDirection);
  const parallelNorm = normalizeValue(parallel, parallelDirection);
  const diff = Math.abs(originalNorm - parallelNorm) / 25;
  const table = [10, 8, 5, 2, 0];
  return table[Math.min(diff, 4)];
}

export function getReliabilityCoherence(answers: Record<string, Answer>): CoherenceResult[] {
  return reliabilityQuestions
    .filter((q) => q.category === 'coherence')
    .map((q) => {
      const original = diagnosticQuestions.find((d) => d.id === q.compareWith) as DiagnosticQuestion;
      const originalAnswer = Number(answers[original.id]?.value ?? 3);
      const parallelAnswer = Number(answers[q.id]?.value ?? 3);
      const points = getCoherencePoints(originalAnswer, parallelAnswer, original.direction, q.direction);
      return {
        pair: [original.id, q.id] as [string, string],
        difference: Math.abs(originalAnswer - parallelAnswer),
        points,
      };
    });
}

export function getAttentionScore(answers: Record<string, Answer>): number {
  const va08 = Number(answers['VA08']?.value ?? 0);
  return va08 === 2 ? scoring.iar.maxAttention : 0;
}

export function getPlausibilityScore(answers: Record<string, Answer>): number {
  const va06 = Number(answers['VA06']?.value ?? 5);
  const va07 = Number(answers['VA07']?.value ?? 5);
  const score = (v: number) => {
    if (v <= 3) return 7.5;
    if (v === 4) return 3.5;
    return 0;
  };
  return score(va06) + score(va07);
}

export function getAccuracyScore(answers: Record<string, Answer>): number {
  const va09 = Number(answers['VA09']?.value ?? 1);
  const va09Score = { 1: 0, 2: 1, 3: 2, 4: 4, 5: 5 }[va09] ?? 0;
  const va10 = Number(answers['VA10']?.value ?? 1);
  const va10Score = (() => {
    if (va10 === 1) return 5; // 0-2
    if (va10 === 2) return 4; // 3-5
    if (va10 === 3) return 2; // 6-10
    return 0; // oltre 10
  })();
  return va09Score + va10Score;
}

export function getProcessScore(answers: Record<string, Answer>, activeMs: number): number {
  // Se i tempi non sono passati ma abbiamo activeMs lo usiamo.
  const time = activeMs > 0 ? activeMs : 0;
  const values = Object.values(answers)
    .filter((a) => diagnosticQuestions.some((q) => q.id === a.questionId))
    .map((a) => Number(a.value));
  const total = values.length;
  if (total === 0) return 0;
  const counts = new Map<number, number>();
  for (const v of values) {
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  const maxCount = Math.max(...counts.values());
  const uniformRatio = maxCount / total;

  // Compilazione troppo veloce con troppe risposte identiche.
  if (time < brand.assessment.minActiveMs && uniformRatio > brand.assessment.reliabilityUniformThreshold) {
    return 2;
  }

  // Meno di 3 minuti.
  if (time < brand.assessment.minActiveMs) return 0;

  // 5-30 minuti con buona variabilità.
  if (time >= 5 * 60 * 1000 && time <= 30 * 60 * 1000) {
    if (uniformRatio < 0.85) return 10;
    return 7;
  }

  // 3-5 minuti o 30-60 minuti.
  if ((time >= 3 * 60 * 1000 && time < 5 * 60 * 1000) || (time > 30 * 60 * 1000 && time <= 60 * 60 * 1000)) {
    return 7;
  }

  // Oltre 60 minuti.
  if (time > 60 * 60 * 1000) return 5;

  return 0;
}

export function calculateIAR(answers: Record<string, Answer>, activeMs: number): ReliabilityScore {
  const coherencePairs = getReliabilityCoherence(answers);
  const coherence = coherencePairs.reduce((s, p) => s + p.points, 0);
  const attention = getAttentionScore(answers);
  const plausibility = getPlausibilityScore(answers);
  const process = getProcessScore(answers, activeMs);
  const accuracy = getAccuracyScore(answers);
  const total = coherence + attention + plausibility + process + accuracy;

  const status = (() => {
    if (total >= 80) return 'high';
    if (total >= 65) return 'medium';
    return 'low';
  })();

  const alerts: string[] = [];
  if (coherence < 40) alerts.push('Alcune coppie di risposte sono incoerenti.');
  if (attention === 0) alerts.push('Controllo attenzione non superato.');
  if (plausibility < 12) alerts.push('Risposte poco plausibili.');
  if (process < 5) alerts.push('Compilazione troppo rapida o poco variata.');
  if (accuracy < 6) alerts.push('Accuratezza dichiarata bassa.');

  const values = Object.values(answers)
    .filter((a) => diagnosticQuestions.some((q) => q.id === a.questionId))
    .map((a) => Number(a.value));
  const totalAnswers = values.length;
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  const uniformRatio = totalAnswers > 0 ? Math.max(...counts.values()) / totalAnswers : 0;

  return {
    coherence,
    attention,
    plausibility,
    process,
    accuracy,
    total,
    status,
    alerts,
    details: {
      coherencePairs,
      va08Correct: Number(answers['VA08']?.value) === 2,
      va06Score: Number(answers['VA06']?.value ?? 5),
      va07Score: Number(answers['VA07']?.value ?? 5),
      va09Score: Number(answers['VA09']?.value ?? 1),
      va10Score: Number(answers['VA10']?.value ?? 1),
      activeMs,
      uniformRatio,
      answerCount: totalAnswers,
    },
  };
}

export { scoring, brand };
