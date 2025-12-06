import { createClient } from '@supabase/supabase-js';
import { supabaseCookieStorage } from '@/lib/utils';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, { auth: { storage: supabaseCookieStorage } });

export default supabase