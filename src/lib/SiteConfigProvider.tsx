import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from './supabase';
import { SiteConfigContext, loadLocalConfig, normalizeConfig } from './siteConfig';
import type { SiteConfig } from './siteConfig';

/**
 * Fournit le config du site à toute l'app :
 * - état initial : cache localStorage `pm_data` si présent, sinon défauts ;
 * - au montage : fetch de la table `site_config` (id=1) → setState + mise à
 *   jour du cache. Silencieux en cas d'erreur (fallback local), et sans
 *   reload de page (contrairement à l'ancien main.js).
 */
export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(loadLocalConfig);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('data')
          .eq('id', 1)
          .single();
        if (cancelled || error || !data || !data.data) return;
        setConfig(normalizeConfig(data.data));
        try {
          // Cache brut (même contenu que le cloud) pour compat admin / ancien site.
          localStorage.setItem('pm_data', JSON.stringify(data.data));
        } catch {
          // stockage plein / mode privé → on garde juste l'état mémoire
        }
      } catch {
        // réseau indisponible → on reste sur le cache local / les défauts
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return <SiteConfigContext.Provider value={config}>{children}</SiteConfigContext.Provider>;
}
