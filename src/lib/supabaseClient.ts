import { createClient } from '@supabase/supabase-js';

// Supabase project URL and anon public key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kdtsxwlpxhsbihwgkuvu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkdHN4d2xweGhzYmlod2drdXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NzM2ODIsImV4cCI6MjEwMTM0OTY4Mn0.jFuuOYt_-K0wVpaflyFj-8qsc0V1P_31rLWS5mFFlT4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Supabase Auth: Sign Up with Email and Password
 */
export async function signUpWithEmail(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });
  if (error) throw error;
  return data;
}

/**
 * Supabase Auth: Sign In with Email and Password
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

/**
 * Supabase Auth: Sign Out
 */
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Syncs user CRM application data to Supabase Database
 */
export async function syncApplicationsToSupabase(applications: any[]) {
  if (!applications || applications.length === 0) return;
  try {
    const { data, error } = await supabase
      .from('applications')
      .upsert(applications, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase sync notice:', error.message);
    } else {
      console.log('Successfully synced applications to Supabase cloud database.');
    }
  } catch (err) {
    console.warn('Supabase network exception:', err);
  }
}

/**
 * Fetches user CRM application data from Supabase Database
 */
export async function fetchApplicationsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*');

    if (error) {
      console.warn('Supabase fetch notice:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase fetch network exception:', err);
    return null;
  }
}
