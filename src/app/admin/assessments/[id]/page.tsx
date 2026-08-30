import Link from 'next/link';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getSupabaseAdminClient } from '@/lib/supabase';

export default async function AdminAssessmentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('ili-admin-token')?.value;
  if (!token) redirect('/admin/login');

  const admin = getSupabaseAdminClient();
  const { data: assessment } = await admin.from('assessments').select('*').eq('id', id).single();
  if (!assessment) notFound();

  return (
    <main className="flex-1 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold">{assessment.company_name}</h1>
        <p className="text-slate-700">
          {assessment.first_name} {assessment.last_name} — {assessment.email}
        </p>
        <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">ILI</p>
            <p className="text-2xl font-semibold">{assessment.ili}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Dipendenza</p>
            <p className="text-2xl font-semibold">{assessment.dependency_index}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">IAR</p>
            <p className="text-2xl font-semibold">{assessment.iar}</p>
          </div>
        </div>
        <a
          href={`/admin/assessments/${id}/pdf`}
          target="_blank"
          className="inline-block rounded-full bg-slate-900 px-6 py-3 text-white hover:bg-slate-800"
        >
          Scarica PDF
        </a>
        <div className="flex gap-4">
          <Link
            href="/admin/assessments"
            className="rounded-full border border-slate-300 px-6 py-3 text-slate-700 hover:bg-slate-100"
          >
            Torna all&apos;elenco
          </Link>
          <Link
            href="/"
            className="rounded-full border border-slate-300 px-6 py-3 text-slate-700 hover:bg-slate-100"
          >
            Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
