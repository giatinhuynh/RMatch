// services/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';

// Retrieve these values from your Supabase dashboard
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
