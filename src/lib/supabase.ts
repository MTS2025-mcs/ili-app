import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

export const getSupabaseServerClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    requireEnv(supabaseUrl, 'supabaseUrl'),
    requireEnv(supabaseAnonKey, 'supabaseAnonKey'),
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
};

export const getSupabaseAdminClient = () =>
  createClient(
    requireEnv(supabaseUrl, 'supabaseUrl'),
    requireEnv(supabaseServiceRoleKey, 'supabaseServiceRoleKey'),
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
