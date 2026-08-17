import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { trackVisit } from '../lib/tracking';

/**
 * Bandeau cookies RGPD discret : uniquement des statistiques de visite
 * anonymes. S'affiche si `pm_cookies_ok` est absent du localStorage ;
 * "Accepter" → '1' + lance le tracking ; "Refuser" → '0'.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem('pm_cookies_ok')) setVisible(true);
    } catch {
      // localStorage inaccessible → pas de bandeau (rien à mémoriser)
    }
  }, []);

  if (!visible) return null;

  const choose = (value: '1' | '0') => {
    try {
      localStorage.setItem('pm_cookies_ok', value);
    } catch {
      // stockage indisponible : on ferme quand même le bandeau
    }
    setVisible(false);
    if (value === '1') void trackVisit();
  };

  return (
    <div
      role="dialog"
      aria-label="Consentement aux statistiques de visite"
      className="fixed z-[80] bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm bg-dark-800 border border-gold-500/40 rounded-xl shadow-2xl shadow-black/60 p-5 font-sans animate-fade-up"
    >
      <p className="text-white/80 text-xs leading-relaxed mb-4">
        Nous mesurons uniquement des <span className="text-gold-400">statistiques de visite anonymes</span>{' '}
        (aucune donnée personnelle, aucune publicité).{' '}
        <Link
          to="/mentions-legales"
          className="text-gold-400 underline underline-offset-2 hover:text-gold-300 transition-colors"
        >
          En savoir plus
        </Link>
      </p>
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => choose('0')}
          className="btn-chamfer btn-chamfer-outline text-white/70 px-4 py-2 text-[10px] tracking-wide font-semibold font-sans hover:text-white transition-colors"
        >
          REFUSER
        </button>
        <button
          onClick={() => choose('1')}
          className="btn-chamfer bg-gold-500 text-dark-900 px-4 py-2 text-[10px] tracking-wide font-semibold font-sans hover:bg-gold-400 transition-colors"
        >
          ACCEPTER
        </button>
      </div>
    </div>
  );
}
