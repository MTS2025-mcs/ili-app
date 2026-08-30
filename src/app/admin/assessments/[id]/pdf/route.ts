import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { createILIPDFDocument } from '@/lib/pdf-generator';
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

  const areaScores = (areaData ?? []).reduce<Record<AreaCode, number>>((acc, row) => {
    acc[row.area as AreaCode] = Number(row.score);
    return acc;
  }, {} as Record<AreaCode, number>);

  const doc = createILIPDFDocument({
    firstName: assessment.first_name,
    lastName: assessment.last_name,
    company: assessment.company_name,
    ili: assessment.ili,
    iar: assessment.iar,
    dependency: assessment.dependency_index,
    bottleneck: assessment.bottleneck,
    areaScores,
  });

  const buffer = await renderToBuffer(doc);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="ili-${id}.pdf"`,
    },
  });
}
