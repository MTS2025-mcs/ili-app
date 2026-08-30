'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { demographicSchema } from '@/lib/validation-schemas';
import type { z } from 'zod';
import { diagnosticQuestions, contextQuestions, reliabilityQuestions } from '@/question-bank/questions';
import { ProgressBar } from '@/components/ProgressBar';
import { LikertScale } from '@/components/LikertScale';

type DemographicForm = z.infer<typeof demographicSchema>;
type AnswerMap = Record<string, { value: number | string; timestamp: number }>;

const sections = [
  { id: 'demographic', label: 'Dati' },
  { id: 'context', label: 'Contesto' },
  { id: 'HR', label: 'Risorse umane' },
  { id: 'SE', label: 'Tono emotivo' },
  { id: 'FI', label: 'Finanza' },
  { id: 'MK', label: 'Marketing' },
  { id: 'TI', label: 'Tempo' },
  { id: 'reliability', label: 'Controllo' },
];

const revenueBands = [
  'Fino a 100.000 €',
  '100.001 - 300.000 €',
  '300.001 - 700.000 €',
  '700.001 - 1.500.000 €',
  'Oltre 1.500.000 €',
];

export default function AssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [startedAt] = useState(() => Date.now());
  const [lastActive, setLastActive] = useState(() => Date.now());
  const [activeMs, setActiveMs] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<DemographicForm>({
    defaultValues: {
      marketingConsent: false,
    },
  });

  useEffect(() => {
    const onActivity = () => setLastActive(Date.now());
    window.addEventListener('click', onActivity);
    window.addEventListener('keydown', onActivity);
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastActive <= 5 * 60 * 1000) {
        setActiveMs((prev) => prev + 1000);
      }
    }, 1000);
    return () => {
      window.removeEventListener('click', onActivity);
      window.removeEventListener('keydown', onActivity);
      clearInterval(interval);
    };
  }, [lastActive]);

  const section = sections[step];

  const sectionQuestions = useMemo(() => {
    if (section.id === 'context') return contextQuestions;
    if (section.id === 'reliability') return reliabilityQuestions;
    return diagnosticQuestions.filter((q) => q.area === section.id);
  }, [section]);

  const setAnswer = (id: string, value: number | string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: { questionId: id, value, timestamp: Date.now() },
    }));
  };

  const [demographic, setDemographic] = useState<DemographicForm | null>(null);

  const onDemographicSubmit = (data: DemographicForm) => {
    const parsed = demographicSchema.safeParse(data);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = String(issue.path[0]) as keyof DemographicForm;
        setError(field, { message: issue.message });
      });
      return;
    }
    setDemographic(parsed.data);
    setStep(1);
  };

  const onSubmit = async () => {
    if (!allAnswered() || !demographic) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          demographic,
          answers,
          startedAt,
          activeMs,
        }),
      });
      if (res.ok) {
        router.push('/assessment/thank-you');
      } else {
        const text = await res.text();
        alert('Errore server: ' + text);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const allAnswered = () => {
    return sectionQuestions.every((q) => answers[q.id]?.value !== undefined);
  };

  const progress = ((step + 1) / sections.length) * 100;

  const next = () => {
    if (section.id === 'demographic') {
      handleSubmit(onDemographicSubmit)();
      return;
    }
    if (!allAnswered()) return;
    setStep((s) => Math.min(s + 1, sections.length - 1));
  };

  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <ProgressBar progress={progress} label={section.label} />

        {section.id === 'demographic' && (
          <form className="space-y-4 rounded-2xl bg-white p-6 shadow-sm" onSubmit={handleSubmit(onDemographicSubmit)}>
            <h2 className="text-xl font-semibold">I tuoi dati</h2>
            {[
              ['firstName', 'Nome'],
              ['lastName', 'Cognome'],
              ['companyName', 'Ragione sociale'],
              ['role', 'Ruolo'],
              ['sector', 'Settore'],
              ['city', 'Città'],
              ['province', 'Provincia'],
              ['email', 'Email'],
              ['phone', 'Telefono'],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="block text-sm font-medium text-slate-700">{label}</label>
                <input
                  {...register(name as keyof DemographicForm)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
                {errors[name as keyof DemographicForm] && (
                  <p className="mt-1 text-sm text-red-600">{errors[name as keyof DemographicForm]?.message}</p>
                )}
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-slate-700">Anni di attività</label>
              <select {...register('yearsInBusiness')} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
                <option value="">Seleziona</option>
                <option value="0-2">0-2</option>
                <option value="3-5">3-5</option>
                <option value="6-10">6-10</option>
                <option value="11-20">11-20</option>
                <option value="oltre 20">Oltre 20</option>
              </select>
              {errors.yearsInBusiness && <p className="mt-1 text-sm text-red-600">{errors.yearsInBusiness.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Numero collaboratori</label>
              <select {...register('employees')} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
                <option value="">Seleziona</option>
                <option value="0">0</option>
                <option value="1-5">1-5</option>
                <option value="6-15">6-15</option>
                <option value="16-50">16-50</option>
                <option value="oltre 50">Oltre 50</option>
              </select>
              {errors.employees && <p className="mt-1 text-sm text-red-600">{errors.employees.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Fascia fatturato annuo</label>
              <select {...register('revenueBand')} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
                <option value="">Seleziona</option>
                {revenueBands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              {errors.revenueBand && <p className="mt-1 text-sm text-red-600">{errors.revenueBand.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Consulente di riferimento (opzionale)</label>
              <input {...register('referringConsultant')} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
            <div className="flex items-start gap-2">
              <input type="checkbox" {...register('privacyConsent')} className="mt-1" />
              <label className="text-sm text-slate-700">
                Dichiaro di aver letto e accettato l&apos;informativa privacy.
              </label>
            </div>
            {errors.privacyConsent && <p className="text-sm text-red-600">{errors.privacyConsent.message}</p>}
            <div className="flex items-start gap-2">
              <input type="checkbox" {...register('marketingConsent')} className="mt-1" />
              <label className="text-sm text-slate-700">
                Acconsento a ricevere comunicazioni marketing (facoltativo).
              </label>
            </div>
            <button type="submit" className="w-full rounded-full bg-slate-900 py-3 text-white hover:bg-slate-800">
              Continua
            </button>
          </form>
        )}

        {section.id !== 'demographic' && (
          <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">{section.label}</h2>
            {sectionQuestions.map((q) => (
              <div key={q.id}>
                {q.type === 'diagnostic' || q.type === 'reliability' ? (
                  <LikertScale
                    question={q.text}
                    selected={Number(answers[q.id]?.value ?? 0)}
                    onSelect={(v) => setAnswer(q.id, v)}
                  />
                ) : (
                  <div>
                    <p className="mb-3 font-medium text-slate-800">{q.text}</p>
                    {'options' in q && q.options && q.options.length > 0 ? (
                      <div className="grid gap-2">
                        {q.options.map((opt) => (
                          <button
                            key={String(opt.value)}
                            type="button"
                            onClick={() => setAnswer(q.id, opt.value)}
                            className={`rounded-lg border px-4 py-3 text-left transition ${
                              answers[q.id]?.value === opt.value
                                ? 'border-slate-900 bg-slate-100'
                                : 'border-slate-300 hover:border-slate-500'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    ) : 'allowText' in q && q.allowText ? (
                      <textarea
                        maxLength={q.maxLength ?? 500}
                        value={String(answers[q.id]?.value ?? '')}
                        onChange={(e) => setAnswer(q.id, e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        rows={4}
                      />
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {section.id !== 'demographic' && (
          <div className="mt-8 flex justify-between">
            <button onClick={prev} className="rounded-full border border-slate-300 px-6 py-2 hover:bg-slate-100" type="button">
              Indietro
            </button>
            {step < sections.length - 1 ? (
              <button
                onClick={next}
                disabled={!allAnswered()}
                className="rounded-full bg-slate-900 px-6 py-2 text-white disabled:opacity-50"
                type="button"
              >
                Avanti
              </button>
            ) : (
              <button
                onClick={onSubmit}
                disabled={!allAnswered() || submitting}
                className="rounded-full bg-slate-900 px-6 py-2 text-white disabled:opacity-50"
                type="button"
              >
                {submitting ? 'Invio...' : 'Invia'}
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
