import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Initializing Supabase client...');
console.log('Environment check:');
console.log('- SUPABASE_URL:', SUPABASE_URL ? '✓ Present' : '✗ Missing');
console.log('- SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '✓ Present' : '✗ Missing');

if (!SUPABASE_URL) throw new Error('Missing VITE_SUPABASE_URL');
if (!SUPABASE_ANON_KEY) throw new Error('Missing VITE_SUPABASE_ANON_KEY');

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      flowType: 'pkce',
      debug: true,
      storage: window.localStorage,
      storageKey: 'g21-supabase-auth',
    },
    global: {
      headers: {
        'X-Client-Info': 'g21-web-app'
      },
    },
    db: {
      schema: 'public'
    }
  }
);

// Add auth state change listener for debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event);
  console.log('Session:', session ? 'Present' : 'None');
  if (session) {
    console.log('User ID:', session.user.id);
    console.log('User Email:', session.user.email);
  }
});

// Test the connection
(async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Failed to get session:', error.message);
    } else {
      console.log('Session check:', data.session ? 'Active session found' : 'No active session');
    }
  } catch (err) {
    console.error('Error checking session:', err);
  }
})();