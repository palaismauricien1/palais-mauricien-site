/* ============================================================
   VISIT TRACKING - porté de public/supabase-client.js
   1 visite max par session navigateur (sessionStorage `pm_visit_tracked`)
   ET au max 1 par 30 min (localStorage `pm_visit_last`), pour éviter les
   F5 en boucle ou les bots multi-onglets. Silencieux en cas d'erreur.
   ============================================================ */

import { supabase } from './supabase';

const SESSION_KEY = 'pm_visit_tracked';
const THROTTLE_KEY = 'pm_visit_last';
const THROTTLE_MS = 30 * 60 * 1000;

export async function trackVisit(): Promise<void> {
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return; // déjà compté pour cette session
    const last = parseInt(localStorage.getItem(THROTTLE_KEY) || '0', 10);
    const now = Date.now();
    if (now - last < THROTTLE_MS) {
      sessionStorage.setItem(SESSION_KEY, '1');
      return;
    }
    sessionStorage.setItem(SESSION_KEY, '1');
    localStorage.setItem(THROTTLE_KEY, String(now));
    await supabase.from('visits').insert({});
  } catch {
    // silent - pas grave si le tracking rate
  }
}

/** Ne compte la visite que si l'utilisateur a accepté les statistiques (RGPD). */
export function trackVisitIfConsented(): void {
  try {
    if (localStorage.getItem('pm_cookies_ok') === '1') void trackVisit();
  } catch {
    // localStorage inaccessible → pas de tracking
  }
}
