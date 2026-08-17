/** Constantes et helpers SEO partagés (séparés de Seo.tsx pour le Fast Refresh). */

export const SITE_URL = 'https://www.palaismauricien.re';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/brochette%20de%20mauricien%20v2.png`;

export type JsonLd = Record<string, unknown>;

/** Construit un BreadcrumbList schema.org à partir de [nom, chemin]. */
export function breadcrumbLd(items: [name: string, path: string][]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: `${SITE_URL}${path}`,
    })),
  };
}
