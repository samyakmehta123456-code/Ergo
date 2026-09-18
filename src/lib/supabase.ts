import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://your-supabase-project-id.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "your-supabase-anon-key-placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Supabase Auth Helpers
 */
export async function supabaseSignUp(email: string, password: string, name?: string) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });
}

export async function supabaseSignIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function supabaseSignOut() {
  return await supabase.auth.signOut();
}

export async function supabaseGetUser(token?: string) {
  if (token) {
    const { data, error } = await supabase.auth.getUser(token);
    if (!error && data.user) return data.user;
  }
  const { data } = await supabase.auth.getUser();
  return data.user || null;
}
