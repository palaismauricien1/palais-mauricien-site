import { useEffect } from 'react';
import { SITE_URL, DEFAULT_OG_IMAGE, type JsonLd } from './seoUtils';

/**
 * Composant SEO léger, sans dépendance externe (pas de react-helmet).
 * Met à jour à chaque changement de route : <title>, meta description,
 * canonical, Open Graph, Twitter Cards, meta robots et le JSON-LD par page
 * (injecté dans <script type="application/ld+json" data-seo-jsonld>).
 *
 * Le JSON-LD "Restaurant" + "WebSite" du site est statique dans index.html ;
 * ce composant gère uniquement les schémas propres à chaque page.
 */

type SeoProps = {
  /** Titre de la page (document.title, og:title, twitter:title). */
  title: string;
  /** Meta description (+ og:description, twitter:description). */
  description: string;
  /** Chemin canonique de la page, ex. "/menu" ("/" pour l'accueil). */
  path: string;
  /** og:type - "website" par défaut ("restaurant" sur l'accueil, "article" sur les pages plats). */
  ogType?: string;
  /** URL ABSOLUE de l'image Open Graph / Twitter. */
  ogImage?: string;
  /** true = meta robots "noindex, nofollow" (page 404). */
  noindex?: boolean;
  /** Schéma(s) JSON-LD propres à la page (BreadcrumbList, Menu, FAQPage, MenuItem...). */
  jsonLd?: JsonLd | JsonLd[];
};

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function removeJsonLd() {
  document.head
    .querySelectorAll('script[data-seo-jsonld]')
    .forEach((script) => script.remove());
}

export function Seo({
  title,
  description,
  path,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false,
  jsonLd,
}: SeoProps) {
  // Sérialisé pour servir de dépendance stable au useEffect (les objets
  // littéraux passés en prop changent d'identité à chaque rendu).
  const jsonLdString = jsonLd
    ? JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])
    : '';

  useEffect(() => {
    const url = `${SITE_URL}${path === '/' ? '/' : path}`;

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    upsertMeta('property', 'og:type', ogType);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:locale', 'fr_FR');
    upsertMeta('property', 'og:site_name', 'Palais Mauricien');

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', ogImage);

    // JSON-LD de la page : on remplace intégralement le bloc précédent.
    removeJsonLd();
    if (jsonLdString) {
      const blocks = JSON.parse(jsonLdString) as JsonLd[];
      blocks.forEach((block) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-jsonld', '');
        script.textContent = JSON.stringify(block);
        document.head.appendChild(script);
      });
    }

    return removeJsonLd;
  }, [title, description, path, ogType, ogImage, noindex, jsonLdString]);

  return null;
}
