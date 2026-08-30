import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getSupabaseServerClient } from '@/lib/supabase';

export default function AdminLogin() {
  async function login(formData: FormData) {
    'use server';
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      return;
    }
    const store = await cookies();
    store.set('ili-admin-token', data.session.access_token, { httpOnly: true, secure: true, path: '/' });
    redirect('/admin/assessments');
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <form action={login} className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold">Accesso consulente</h1>
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input name="email" type="email" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input name="password" type="password" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" required />
        </div>
        <button type="submit" className="w-full rounded-full bg-slate-900 py-3 text-white hover:bg-slate-800">
          Entra
        </button>
      </form>
    </main>
  );
}
