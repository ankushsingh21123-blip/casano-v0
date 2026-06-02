import { createClient } from '@supabase/supabase-js';

// Placeholder fallback ensures the build doesn't crash when env vars aren't set.
// At runtime, real values from .env.local / deployment env override these.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
