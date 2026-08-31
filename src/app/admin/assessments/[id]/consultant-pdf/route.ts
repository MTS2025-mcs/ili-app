import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { createConsultantPDFDocument } from '@/lib/consultant-pdf';
import type { AreaCode } from '@/types/scoring';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = getSupabaseAdminClient();

  const { data: assessment, error } = await admin.from('assessments').select('*').eq('id', id).single();
  if (error || !assessment) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { data: areaData } = await admin
    .from('area_scores')
    .select('area, score')
    .eq('assessment_id', id);

  const { data: subData } = await admin
    .from('subdimension_scores')
    .select('area, subdimension, score')
    .eq('assessment_id', id);

  const areaScores = (areaData ?? []).reduce<Record<AreaCode, number>>((acc, row) => {
    acc[row.area as AreaCode] = Number(row.score);
    return acc;
  }, {} as Record<AreaCode, number>);

  const subdimensionScores = (subData ?? []).map((row) => ({
    area: row.area,
    subdimension: row.subdimension,
    score: Number(row.score),
  }));

  const doc = createConsultantPDFDocument({
    assessment,
    areaScores,
    subdimensionScores,
  });

  const buffer = await renderToBuffer(doc);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="ili-consulente-${id}.pdf"`,
    },
  });
}
