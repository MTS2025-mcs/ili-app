import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { scoring } from '@/config/scoring';
import type { AreaCode } from '@/types/scoring';
import type { Database } from '@/types/database';

export default async function AdminAssessments() {
  const cookieStore = await cookies();
  const token = cookieStore.get('ili-admin-token')?.value;
  if (!token) redirect('/admin/login');

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from('assessments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  const assessments = data as Database['public']['Tables']['assessments']['Row'][];

  return (
    <main className="flex-1 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold">Assessment completati</h1>
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="p-4">Data</th>
                <th className="p-4">Nome</th>
                <th className="p-4">Azienda</th>
                <th className="p-4">ILI</th>
                <th className="p-4">IAR</th>
                <th className="p-4">Criticità</th>
                <th className="p-4">Stato</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((a) => (
                <tr key={a.id} className="border-t border-slate-100">
                  <td className="p-4">{new Date(a.created_at).toLocaleDateString('it-IT')}</td>
                  <td className="p-4">{a.first_name} {a.last_name}</td>
                  <td className="p-4">{a.company_name}</td>
                  <td className="p-4">{a.ili}</td>
                  <td className="p-4">{a.iar}</td>
                  <td className="p-4">
                    {a.bottleneck ? scoring.areas[a.bottleneck as AreaCode]?.name ?? a.bottleneck : '—'}
                  </td>
                  <td className="p-4">{a.followup_status}</td>
                  <td className="p-4">
                    <Link href={`/admin/assessments/${a.id}`} className="text-blue-600 hover:underline">
                      Apri
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
