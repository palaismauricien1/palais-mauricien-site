/* ============================================================
   SUPABASE CLIENT — Palais Mauricien
   Initialise le client Supabase + helpers de sync cloud
   ============================================================ */

const SUPABASE_URL = 'https://yslsuzzcqwapzledszjw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_i39oBoggK7FN6AWlXzYpDg_8hUwuocU';

const SB = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: 'pm_auth' }
});

window.SB = SB;

/* ============================================================
   SYNC CONFIG (menu, horaires, plats du jour)
   ============================================================ */

async function cloudLoadConfig() {
  try {
    const { data, error } = await SB
      .from('site_config')
      .select('data, updated_at')
      .eq('id', 1)
      .single();
    if (error) throw error;
    return data && data.data ? data.data : null;
  } catch (e) {
    console.warn('[Supabase] Load config failed:', e.message);
    return null;
  }
}

async function cloudSaveConfig(d) {
  try {
    const { error } = await SB
      .from('site_config')
      .update({ data: d })
      .eq('id', 1);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('[Supabase] Save config failed:', e.message);
    return false;
  }
}

/* Sync from cloud → localStorage. À appeler au chargement. */
async function syncFromCloud() {
  const cloud = await cloudLoadConfig();
  if (cloud && Object.keys(cloud).length > 0) {
    localStorage.setItem('pm_data', JSON.stringify(cloud));
    return cloud;
  }
  return null;
}

/* ============================================================
   VISIT TRACKING
   ============================================================ */

async function cloudTrackVisit() {
  try {
    await SB.from('visits').insert({});
  } catch (e) {
    // silent — pas grave si tracking rate
  }
}

async function cloudGetVisitStats() {
  try {
    const { data, error } = await SB
      .from('visits')
      .select('visited_at')
      .order('visited_at', { ascending: false })
      .limit(10000);
    if (error) throw error;

    const now = Date.now();
    const day = 86400000;
    const times = (data || []).map(v => new Date(v.visited_at).getTime());

    const today = times.filter(t => now - t < day).length;
    const week  = times.filter(t => now - t < 7 * day).length;
    const month = times.filter(t => now - t < 30 * day).length;
    const total = times.length;

    const chart = [];
    for (let i = 6; i >= 0; i--) {
      const label = new Date(now - i * day).toLocaleDateString('fr-FR', { weekday: 'short' });
      const count = times.filter(t => {
        const d = now - t;
        return d >= i * day && d < (i + 1) * day;
      }).length;
      chart.push({ label, count });
    }
    return { today, week, month, total, chart };
  } catch (e) {
    console.warn('[Supabase] Stats failed:', e.message);
    return { today: 0, week: 0, month: 0, total: 0, chart: [] };
  }
}

/* ============================================================
   AUTH ADMIN
   ============================================================ */

async function adminSignIn(email, password) {
  const { data, error } = await SB.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };
  return { ok: true, user: data.user };
}

async function adminSignOut() {
  await SB.auth.signOut();
}

async function adminIsLoggedIn() {
  const { data } = await SB.auth.getSession();
  return !!data.session;
}

window.cloudLoadConfig = cloudLoadConfig;
window.cloudSaveConfig = cloudSaveConfig;
window.syncFromCloud   = syncFromCloud;
window.cloudTrackVisit = cloudTrackVisit;
window.cloudGetVisitStats = cloudGetVisitStats;
window.adminSignIn     = adminSignIn;
window.adminSignOut    = adminSignOut;
window.adminIsLoggedIn = adminIsLoggedIn;
