import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { demographicSchema } from '@/lib/validation-schemas';
import { calculateILI, calculateIAR, getSubdimensionScores } from '@/lib/scoring-engine';
import { diagnosticQuestions } from '@/question-bank/questions';
import { sendConsultantNotification } from '@/lib/email-service';

const sectionIds = ['context', 'HR', 'SE', 'FI', 'MK', 'TI', 'reliability'];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const dem = demographicSchema.parse(body.demographic);
    const answers = body.answers as Record<string, { value: number | string; timestamp: number }>;

    const sessionToken = crypto.randomUUID();
    const admin = getSupabaseAdminClient();

    const startedAt = new Date(body.startedAt ?? Date.now()).toISOString();
    const completedAt = new Date().toISOString();
    const activeMs = Number(body.activeMs ?? 0);

    // Calcoli
    const diagnosticAnswers: Record<string, { questionId: string; value: number | string; timestamp: number }> = {};
    for (const q of diagnosticQuestions) {
      const a = answers[q.id];
      if (a) diagnosticAnswers[q.id] = { questionId: q.id, value: a.value, timestamp: a.timestamp };
    }

    const allAnswers: Record<string, { questionId: string; value: number | string; timestamp: number }> = {};
    for (const [id, a] of Object.entries(answers)) {
      allAnswers[id] = { questionId: id, value: a.value, timestamp: a.timestamp };
    }

    const ili = calculateILI(diagnosticAnswers);
    const iar = calculateIAR(allAnswers, activeMs);

    // Crea assessment
    const { data: assessment, error } = await admin
      .from('assessments')
      .insert({
        session_token: sessionToken,
        first_name: dem.firstName,
        last_name: dem.lastName,
        company_name: dem.companyName,
        role: dem.role,
        sector: dem.sector,
        city: dem.city,
        province: dem.province,
        email: dem.email,
        phone: dem.phone,
        years_in_business: dem.yearsInBusiness,
        employees: dem.employees,
        revenue_band: dem.revenueBand,
        referring_consultant: dem.referringConsultant,
        privacy_consent: dem.privacyConsent,
        privacy_version: 'v1.0',
        privacy_consented_at: new Date().toISOString(),
        marketing_consent: dem.marketingConsent,
        started_at: startedAt,
        completed_at: completedAt,
        active_ms: activeMs,
        status: 'completed',
        ili: ili.ili,
        dependency_index: ili.dependencyIndex,
        ili_level: ili.level,
        bottleneck: ili.bottleneck,
        iar: iar.total,
        iar_status: iar.status,
        metadata: { sections: sectionIds },
      })
      .select()
      .single();

    if (error || !assessment) {
      return new Response(JSON.stringify({ error: error?.message ?? 'Insert failed' }), { status: 500 });
    }

    // Inserisci risposte
    const answerRows = Object.values(allAnswers).map((a) => ({
      assessment_id: assessment.id,
      question_id: a.questionId,
      raw_value: String(a.value),
      normalized_value: null,
      answered_at: new Date(a.timestamp).toISOString(),
    }));
    await admin.from('answers').insert(answerRows);

    // Inserisci punteggi area
    const areaRows = Object.entries(ili.areaScores).map(([area, score]) => ({
      assessment_id: assessment.id,
      area,
      score,
      level: score < 50 ? 'critical' : score < 65 ? 'consolidate' : score < 80 ? 'functional' : 'strength',
    }));
    await admin.from('area_scores').insert(areaRows);

    // Inserisci sottodimensioni
    const subRows = getSubdimensionScores(diagnosticAnswers).map((s) => ({
      assessment_id: assessment.id,
      area: s.area,
      subdimension: s.subdimension,
      score: s.score,
    }));
    await admin.from('subdimension_scores').insert(subRows);

    // Inserisci IAR componenti
    const reliabilityRows = [
      { assessment_id: assessment.id, component: 'coherence', score: iar.coherence, alerts: iar.details.coherencePairs, details: { pairs: iar.details.coherencePairs } },
      { assessment_id: assessment.id, component: 'attention', score: iar.attention, alerts: [], details: { va08Correct: iar.details.va08Correct } },
      { assessment_id: assessment.id, component: 'plausibility', score: iar.plausibility, alerts: [], details: { va06: iar.details.va06Score, va07: iar.details.va07Score } },
      { assessment_id: assessment.id, component: 'process', score: iar.process, alerts: [], details: { activeMs, uniformRatio: iar.details.uniformRatio } },
      { assessment_id: assessment.id, component: 'accuracy', score: iar.accuracy, alerts: [], details: { va09: iar.details.va09Score, va10: iar.details.va10Score } },
    ];
    await admin.from('reliability_checks').insert(reliabilityRows);

    await sendConsultantNotification({
      id: assessment.id,
      company_name: assessment.company_name,
      first_name: assessment.first_name,
      last_name: assessment.last_name,
      ili: assessment.ili,
    });

    return Response.json({ success: true, token: sessionToken });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(JSON.stringify({ errors: err.issues }), { status: 400 });
    }
    if (err instanceof Error) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
    return new Response(JSON.stringify({ error: 'Unknown' }), { status: 500 });
  }
}
