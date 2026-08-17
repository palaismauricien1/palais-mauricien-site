import 'react';

// React 18 ne reconnaît que l'attribut DOM en minuscules `fetchpriority`
// (le prop camelCase `fetchPriority` n'est supporté qu'à partir de React 19
// et déclenche un warning en dev). On étend donc les types JSX pour
// autoriser la forme minuscule, rendue telle quelle dans le HTML.
declare module 'react' {
  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    fetchpriority?: 'high' | 'low' | 'auto';
  }
}
