import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from './supabase';
import { SiteConfigContext, loadLocalConfig, normalizeConfig } from './siteConfig';
import type { SiteConfig } from './siteConfig';

/** Polling de secours (ms) — surchargeable en test via window.__PM_POLL_MS. */
const DEFAULT_POLL_MS = 60_000;

declare global {
  interface Window {
    /** Test uniquement : raccourcit l'intervalle de polling. */
    __PM_POLL_MS?: number;
  }
}

/**
 * Fournit le config du site à toute l'app, avec mise à jour "temps réel" :
 * - état initial : cache localStorage `pm_data` si présent, sinon défauts ;
 * - au montage : fetch de la table `site_config` (id=1) ;
 * - Supabase Realtime : abonnement aux UPDATE de `site_config` id=1
 *   (nécessite que la table soit dans la publication `supabase_realtime`) ;
 * - polling de secours toutes les 60 s quand l'onglet est visible ;
 * - re-fetch quand l'onglet redevient visible (`visibilitychange`).
 * Le state n'est mis à jour que si le JSON a réellement changé (comparaison
 * sérialisée) pour éviter les re-renders inutiles. Silencieux en cas d'erreur
 * réseau (fallback cache local / défauts).
 */
export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(loadLocalConfig);
  // Dernière version brute sérialisée (celle du cloud / du cache local).
  const lastRawRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Point de départ : le cache local, pour ne pas re-setState si le cloud
    // renvoie exactement le même contenu.
    try {
      lastRawRef.current = localStorage.getItem('pm_data');
    } catch {
      lastRawRef.current = null;
    }

    /** Applique un JSON brut (cloud ou payload realtime) s'il a changé. */
    const applyRaw = (raw: unknown) => {
      if (cancelled || !raw || typeof raw !== 'object') return;
      let serialized: string;
      try {
        serialized = JSON.stringify(raw);
      } catch {
        return;
      }
      if (serialized === lastRawRef.current) return; // rien de neuf → pas de re-render
      lastRawRef.current = serialized;
      setConfig(normalizeConfig(raw));
      try {
        // Cache brut (même contenu que le cloud) pour compat admin / ancien site.
        localStorage.setItem('pm_data', serialized);
      } catch {
        // stockage plein / mode privé → on garde juste l'état mémoire
      }
    };

    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('data')
          .eq('id', 1)
          .single();
        if (cancelled || error || !data || !data.data) return;
        applyRaw(data.data);
      } catch {
        // réseau indisponible → on reste sur le cache local / les défauts
      }
    };

    // 1) Fetch initial
    void fetchConfig();

    // 2) Realtime : UPDATE sur site_config id=1 (si la publication est activée)
    const channel = supabase
      .channel('site_config_live')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'site_config', filter: 'id=eq.1' },
        (payload) => {
          const next = (payload.new as { data?: unknown } | null)?.data;
          if (next) applyRaw(next);
          else void fetchConfig(); // payload incomplet → re-fetch
        }
      )
      .subscribe();

    // 3) Polling de secours (uniquement onglet visible)
    const pollMs =
      typeof window.__PM_POLL_MS === 'number' && window.__PM_POLL_MS > 0
        ? window.__PM_POLL_MS
        : DEFAULT_POLL_MS;
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') void fetchConfig();
    }, pollMs);

    // 4) Re-fetch quand l'onglet redevient visible
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void fetchConfig();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibility);
      window.clearInterval(intervalId);
      void supabase.removeChannel(channel);
    };
  }, []);

  return <SiteConfigContext.Provider value={config}>{children}</SiteConfigContext.Provider>;
}
