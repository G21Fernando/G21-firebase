import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) throw new Error('Missing VITE_SUPABASE_URL');
if (!SUPABASE_ANON_KEY) throw new Error('Missing VITE_SUPABASE_ANON_KEY');

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: localStorage,
      detectSessionInUrl: true,
    },
    db: {
      schema: 'public'
    },
    global: {
      fetch: (url, options) => {
        const headers = new Headers(options?.headers || {});
        headers.set('Cache-Control', 'no-cache');
        return fetch(url, {
          ...options,
          headers,
          credentials: 'include',
        });
      }
    }
  }
);