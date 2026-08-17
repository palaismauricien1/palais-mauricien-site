/* ============================================================
   SITE CONFIG - Palais Mauricien
   Types + config par défaut (copie fidèle de public/data.js)
   + helpers métier portés depuis _legacy/main.js.
   La source de vérité éditée par l'admin est la table Supabase
   `site_config` (id=1, colonne jsonb `data`), mise en cache dans
   localStorage sous la clé `pm_data` (compat admin / ancien site).
   ============================================================ */

import { createContext, useContext } from 'react';
import type { SyntheticEvent } from 'react';

/* ---------------- Types ---------------- */

export interface MenuVariant {
  name: string;
  price: string; // ex: "8 €"
}

export interface MenuItem {
  id: number;
  name: string;
  desc: string;
  /** Prix simple (ex: "8 €"). Absent si l'item a des `variants`. */
  price?: string;
  /** Chemin relatif "images/xxx.webp" OU data-URL base64 (upload admin). */
  img: string;
  visible: boolean;
  dispoToday: boolean;
  /** null = quantité non configurée, 0 = épuisé, >0 = portions restantes. */
  remaining?: number | null;
  variants?: MenuVariant[];
}

export const CAT_KEYS = ['plats', 'street', 'grillades', 'desserts', 'boissons'] as const;
export type CategoryKey = (typeof CAT_KEYS)[number];

export const CAT_LABELS: Record<CategoryKey, string> = {
  plats: 'Plats principaux',
  street: 'Street food',
  grillades: 'Grillades',
  desserts: 'Desserts',
  boissons: 'Boissons',
};

export interface ServiceHours {
  actif: boolean;
  open: string; // "10:30"
  close: string; // "14:30"
}

export interface DayHours {
  closed: boolean;
  midi: ServiceHours;
  soir: ServiceHours;
}

export const DAY_KEYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] as const;
export type DayKey = (typeof DAY_KEYS)[number];

export const DAY_LABELS: Record<DayKey, string> = {
  lundi: 'Lundi',
  mardi: 'Mardi',
  mercredi: 'Mercredi',
  jeudi: 'Jeudi',
  vendredi: 'Vendredi',
  samedi: 'Samedi',
  dimanche: 'Dimanche',
};

export interface ExceptionalClosure {
  date: string; // "YYYY-MM-DD"
  reason?: string;
}

export interface SiteConfig {
  menu: Record<CategoryKey, MenuItem[]>;
  /** "YYYY-MM-DD" de la dernière mise à jour des plats du jour, ou null. */
  dispoDate: string | null;
  hours: Record<DayKey, DayHours>;
  socials: { tiktok: string };
  exceptionalClosures: ExceptionalClosure[];
}

/* ---------------- Constantes site ---------------- */

export const UBER_EATS_URL =
  'https://www.ubereats.com/fr/store/palais-mauricien-le-port/_7jTtP06W32kgaXW9Nzmzw';
export const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/22+Av.+de+la+Commune+de+Paris+Le+Port+97420+La+Reunion';
export const PHONE_DISPLAY = '+262 693 43 22 25';
export const PHONE_TEL = 'tel:+262693432225';
export const CONTACT_EMAIL = 'palaismauricien@gmail.com';
export const TIKTOK_FALLBACK = 'https://www.tiktok.com/@palaismauricien97420';
export const FALLBACK_IMG = '/images/logo.png';

/* ---------------- Config par défaut (copie de public/data.js) ---------------- */

const defaultDay = (closed = false): DayHours => ({
  closed,
  midi: { actif: !closed, open: '10:30', close: '14:30' },
  soir: { actif: !closed, open: '18:30', close: '21:30' },
});

export const DEFAULT_CONFIG: SiteConfig = {
  menu: {
    plats: [
      {
        id: 1,
        name: 'Riz frit',
        desc: "Riz sauté à l'œuf, légumes et sauce soja, façon mauricienne.",
        img: 'images/riz frit v3.webp',
        visible: true,
        dispoToday: false,
        remaining: null,
        variants: [
          { name: 'Poulet', price: '8 €' },
          { name: 'Végétarien', price: '7 €' },
        ],
      },
      {
        id: 2,
        name: 'Sauté poulet fumé',
        desc: 'Poulet fumé sauté à la créole - goût intense et authentique.',
        price: '8 €',
        img: 'images/sauté poulet fumé v2.webp',
        visible: true,
        dispoToday: false,
        remaining: null,
      },
      {
        id: 3,
        name: 'Sauté poulet au Bred',
        desc: 'Poulet aux breds frais, parfumé aux épices locales.',
        price: '8 €',
        img: 'images/sauté poulet au bred v3.webp',
        visible: true,
        dispoToday: false,
        remaining: null,
      },
      {
        id: 4,
        name: 'Masalé cabri',
        desc: "Cabri mijoté lentement au massalé - la recette emblématique de l'Île Maurice.",
        price: '9 €',
        img: 'images/massalé cabri v2.webp',
        visible: true,
        dispoToday: false,
        remaining: null,
      },
      {
        id: 5,
        name: 'Vinday poisson',
        desc: 'Poisson mariné au vinaigre, curcuma et moutarde - un classique mauricien.',
        price: '9 €',
        img: 'images/vinday poisson v2.webp',
        visible: true,
        dispoToday: false,
        remaining: null,
      },
      {
        id: 6,
        name: 'Daube poulet pomme de terre',
        desc: 'Daube créole au poulet et pommes de terre, mijotée aux épices douces.',
        price: '8 €',
        img: 'images/daube pomme de terre poulet v2.webp',
        visible: true,
        dispoToday: false,
        remaining: null,
      },
      {
        id: 7,
        name: 'Halim',
        desc: 'Ragoût épicé de viande et lentilles, doux et savoureux.',
        price: '9 €',
        img: 'images/halim v2.webp',
        visible: true,
        dispoToday: false,
        remaining: null,
      },
      {
        id: 8,
        name: 'Mine bouille',
        desc: 'Nouilles en bouillon parfumé, garniture créole traditionnelle.',
        img: 'images/mine bouille v3.webp',
        visible: true,
        dispoToday: false,
        remaining: null,
        variants: [
          { name: 'Poulet', price: '9 €' },
          { name: 'Poulet œuf', price: '10 €' },
        ],
      },
    ],
    street: [
      {
        id: 9,
        name: 'Kebab mauricien',
        desc: "Kebab façon mauricienne, garni de chutneys frais et d'épices parfumées.",
        price: '6 €',
        img: 'images/kebab mauricien v2.webp',
        visible: true,
        dispoToday: false,
        remaining: null,
      },
      {
        id: 10,
        name: 'Brochette mauricienne',
        desc: 'Tendre brochette marinée aux épices créoles, grillée sur braise.',
        price: '3,50 €',
        img: 'images/brochette de mauricien v2.webp',
        visible: true,
        dispoToday: false,
        remaining: null,
      },
      {
        id: 11,
        name: 'Roti',
        desc: 'Pain plat moelleux fait maison, garni à votre choix.',
        img: 'images/roti v3.webp',
        visible: true,
        dispoToday: false,
        remaining: null,
        variants: [
          { name: 'Veg', price: '3 €' },
          { name: 'Poulet', price: '3,50 €' },
          { name: 'Poisson', price: '4,50 €' },
        ],
      },
    ],
    grillades: [
      {
        id: 12,
        name: 'Grillade mauricienne',
        desc: 'Viande grillée marinée aux aromates, servie avec salade et frites.',
        price: '10 €',
        img: 'images/Grillade mauricien v2.webp',
        visible: true,
        dispoToday: false,
        remaining: null,
      },
      {
        id: 13,
        name: 'Cuisses',
        desc: 'Cuisses de poulet grillées, marinées aux épices créoles.',
        price: '6 €',
        img: 'images/Grillade mauricien v2.webp',
        visible: true,
        dispoToday: false,
        remaining: null,
      },
      {
        id: 14,
        name: 'Foie de bœuf',
        desc: 'Foie de bœuf grillé, parfumé aux épices et aux herbes fraîches.',
        price: '9 €',
        img: 'images/foie-de-boeuf.png',
        visible: true,
        dispoToday: false,
        remaining: null,
      },
    ],
    desserts: [
      {
        id: 15,
        name: 'Gulab jamun',
        desc: 'Boulettes de lait concentré frites, imbibées de sirop à la rose.',
        price: '2 €',
        img: 'images/Gulab jamun (dessert).webp',
        visible: true,
        dispoToday: false,
        remaining: null,
      },
      {
        id: 16,
        name: 'Rasgullah',
        desc: 'Boules de fromage frais dans un sirop sucré à la cardamome.',
        price: '2 €',
        img: 'images/Rasgullah (dessert).webp',
        visible: true,
        dispoToday: false,
        remaining: null,
      },
      {
        id: 17,
        name: 'Napolitaine',
        desc: 'Biscuit sablé fourré à la confiture, enrobé de glaçage rose.',
        price: '2 €',
        img: 'images/Napolitaine (dessert).webp',
        visible: true,
        dispoToday: false,
        remaining: null,
      },
    ],
    boissons: [
      {
        id: 18,
        name: 'Alouda',
        desc: 'Boisson emblématique mauricienne, lait, graines de basilique, sirop coloré.',
        price: '3,50 €',
        img: 'images/alouda v2.webp',
        visible: true,
        dispoToday: false,
        remaining: null,
      },
    ],
  },
  dispoDate: null,
  hours: {
    lundi: defaultDay(),
    mardi: defaultDay(),
    mercredi: defaultDay(),
    jeudi: defaultDay(),
    vendredi: defaultDay(),
    samedi: defaultDay(),
    dimanche: defaultDay(true),
  },
  socials: {
    tiktok: 'https://www.tiktok.com/@palaismauricien97420?_r=1&_t=ZN-96DznweiNwE',
  },
  exceptionalClosures: [],
};

/* ---------------- Normalisation (mêmes migrations que public/data.js) ---------------- */

function cloneDefault(): SiteConfig {
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG)) as SiteConfig;
}

/**
 * Rend un JSON brut (cloud ou localStorage) conforme au type SiteConfig,
 * en répliquant les migrations de public/data.js (ancien format horaires,
 * dispoToday/remaining manquants, socials, exceptionalClosures).
 */
export function normalizeConfig(raw: unknown): SiteConfig {
  const base = cloneDefault();
  if (!raw || typeof raw !== 'object') return base;
  const d = raw as Record<string, unknown>;

  // Menu : si la nouvelle structure (street/grillades) n'existe pas → menu par défaut.
  const menu = d.menu as Record<string, unknown> | undefined;
  if (menu && menu.street && menu.grillades) {
    CAT_KEYS.forEach((cat) => {
      const items = Array.isArray(menu[cat]) ? (menu[cat] as MenuItem[]) : [];
      base.menu[cat] = items.map((item) => ({
        ...item,
        visible: item.visible !== false,
        dispoToday: item.dispoToday === true,
        remaining: typeof item.remaining === 'number' ? item.remaining : null,
      }));
    });
    base.dispoDate = typeof d.dispoDate === 'string' ? d.dispoDate : null;
  }

  // Horaires : migration ancien format { open, close, closed } → { midi, soir }.
  const hours = d.hours as Record<string, unknown> | undefined;
  if (hours) {
    DAY_KEYS.forEach((k) => {
      const h = hours[k] as Record<string, unknown> | undefined;
      if (!h) return;
      if (typeof h.open === 'string') {
        base.hours[k] = {
          closed: h.closed === true,
          midi: { actif: true, open: h.open as string, close: (h.close as string) || '14:30' },
          soir: { actif: true, open: '18:30', close: '21:30' },
        };
      } else if (h.midi && h.soir) {
        base.hours[k] = h as unknown as DayHours;
      }
    });
  }

  const socials = d.socials as { tiktok?: unknown } | undefined;
  if (socials && typeof socials.tiktok === 'string' && socials.tiktok) {
    base.socials.tiktok = socials.tiktok;
  }

  if (Array.isArray(d.exceptionalClosures)) {
    base.exceptionalClosures = (d.exceptionalClosures as unknown[])
      .map((c): ExceptionalClosure | null => {
        if (typeof c === 'string') return { date: c };
        if (c && typeof c === 'object' && typeof (c as ExceptionalClosure).date === 'string') {
          return c as ExceptionalClosure;
        }
        return null;
      })
      .filter((c): c is ExceptionalClosure => c !== null);
  }

  return base;
}

/** État initial : cache localStorage `pm_data` si présent, sinon défauts. */
export function loadLocalConfig(): SiteConfig {
  try {
    const saved = localStorage.getItem('pm_data');
    if (saved) return normalizeConfig(JSON.parse(saved));
  } catch {
    // stockage inaccessible ou JSON invalide → défauts
  }
  return cloneDefault();
}

/* ---------------- Contexte React ---------------- */

export const SiteConfigContext = createContext<SiteConfig>(DEFAULT_CONFIG);

export function useSiteConfig(): SiteConfig {
  return useContext(SiteConfigContext);
}

/* ---------------- Helpers images ---------------- */

/**
 * Résout un chemin d'image du config vers une URL utilisable :
 * data-URL (upload admin) → telle quelle ; sinon fichier de public/images/
 * (noms avec espaces/accents → encodeURI).
 */
export function resolveImg(img: string): string {
  const v = (img || '').trim();
  if (!v) return FALLBACK_IMG;
  if (v.startsWith('data:')) return v;
  if (/^https?:/i.test(v)) return v;
  return encodeURI('/' + v.replace(/^\.?\.?\//, ''));
}

/** onError d'<img> : bascule sur le logo (une seule fois, pas de boucle). */
export function onImgError(e: SyntheticEvent<HTMLImageElement>): void {
  const el = e.currentTarget;
  if (el.src.endsWith(FALLBACK_IMG)) return;
  el.src = FALLBACK_IMG;
}

/* ---------------- Helpers métier (portés de _legacy/main.js) ---------------- */

/** Date locale du jour au format "YYYY-MM-DD". */
export function getTodayKey(): string {
  const d = new Date();
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

/** Clé du jour courant ("lundi"..."dimanche"). */
export function getTodayDayKey(): DayKey {
  const jsMapped: DayKey[] = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  return jsMapped[new Date().getDay()];
}

/** Items visibles ET cochés "dispo aujourd'hui", groupés par catégorie. */
export function getDispoToday(config: SiteConfig): Record<CategoryKey, MenuItem[]> {
  const out = {} as Record<CategoryKey, MenuItem[]>;
  CAT_KEYS.forEach((cat) => {
    out[cat] = (config.menu[cat] || []).filter((i) => i.visible && i.dispoToday);
  });
  return out;
}

/** Prix affiché : prix simple, ou "à partir de X" si variantes. */
export function getDisplayPrice(item: MenuItem): string {
  if (item.price) return item.price;
  if (item.variants && item.variants.length) return 'à partir de ' + item.variants[0].price;
  return '';
}

/** Liste des variantes : "Poulet 8 € · Végétarien 7 €". */
export function formatVariants(item: MenuItem): string {
  if (!item.variants || !item.variants.length) return '';
  return item.variants.map((v) => `${v.name} ${v.price}`).join(' · ');
}

/** Prix "complet" : prix simple ou la liste des variantes. */
export function getPriceLine(item: MenuItem): string {
  if (item.price) return item.price;
  return formatVariants(item);
}

/** "2026-08-17" → "Dimanche 17 août". */
export function formatDateFR(dateKey: string): string {
  if (!dateKey) return '';
  const fmt = new Date(dateKey + 'T00:00').toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return fmt.charAt(0).toUpperCase() + fmt.slice(1);
}

/* ---------------- Horaires ---------------- */

/** Services actifs d'un jour, ou null si fermé. */
export function getDayServices(h: DayHours): { midi?: string; soir?: string } | null {
  const midi = h.midi || { actif: false, open: '10:30', close: '14:30' };
  const soir = h.soir || { actif: false, open: '18:30', close: '21:30' };
  if (h.closed || (!midi.actif && !soir.actif)) return null;
  const out: { midi?: string; soir?: string } = {};
  if (midi.actif) out.midi = `${midi.open}–${midi.close}`;
  if (soir.actif) out.soir = `${soir.open}–${soir.close}`;
  return out;
}

/** "10:30–14:30 / 18:30–21:30", ou "Fermé". */
export function formatDayHours(h: DayHours): string {
  const services = getDayServices(h);
  if (!services) return 'Fermé';
  return [services.midi, services.soir].filter(Boolean).join(' / ');
}

/** Ouvert maintenant ? (+ prochaine ouverture du jour le cas échéant). */
export function isOpenNow(h: DayHours): { open: boolean; next: string | null } {
  if (h.closed) return { open: false, next: null };
  const cur = new Date().getHours() * 60 + new Date().getMinutes();
  const toMin = (t: string) => {
    const [hh, mm] = t.split(':').map(Number);
    return hh * 60 + mm;
  };
  let next: string | null = null;
  for (const service of [h.midi, h.soir]) {
    if (!service || !service.actif) continue;
    if (cur >= toMin(service.open) && cur < toMin(service.close)) return { open: true, next: null };
    if (cur < toMin(service.open) && next === null) next = service.open;
  }
  return { open: false, next };
}

/* ---------------- Fermetures exceptionnelles ---------------- */

export function getExceptionalClosure(config: SiteConfig, dateKey: string): ExceptionalClosure | null {
  const list = Array.isArray(config.exceptionalClosures) ? config.exceptionalClosures : [];
  return list.find((c) => c.date === dateKey) || null;
}

export function getUpcomingClosures(config: SiteConfig, limit = 10): ExceptionalClosure[] {
  const list = Array.isArray(config.exceptionalClosures) ? config.exceptionalClosures : [];
  const today = getTodayKey();
  return list
    .filter((c) => c.date && c.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
}
