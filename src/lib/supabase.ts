/* ============================================================
   SUPABASE CLIENT - Palais Mauricien (app React)
   Mêmes URL / clé publique / storageKey que public/supabase-client.js
   pour rester compatible avec le panel admin statique.
   ============================================================ */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yslsuzzcqwapzledszjw.supabase.co';
// Clé "publishable" : publique par design (protégée par les RLS Supabase).
const SUPABASE_KEY = 'sb_publishable_i39oBoggK7FN6AWlXzYpDg_8hUwuocU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: 'pm_auth' },
});
