import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { createILIPDFDocument } from '@/lib/pdf-generator';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = getSupabaseAdminClient();
  const { data: assessment, error } = await admin.from('assessments').select('*').eq('id', id).single();

  if (error || !assessment) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const doc = createILIPDFDocument({
    firstName: assessment.first_name,
    lastName: assessment.last_name,
    company: assessment.company_name,
    ili: assessment.ili,
    iar: assessment.iar,
    dependency: assessment.dependency_index,
    bottleneck: assessment.bottleneck,
  });

  const buffer = await renderToBuffer(doc);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="ili-${id}.pdf"`,
    },
  });
}
