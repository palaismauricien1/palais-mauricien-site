# Palais Mauricien - Site web

Site officiel du restaurant **Palais Mauricien**, Le Port - La Réunion.

🌐 [www.palaismauricien.re](https://www.palaismauricien.re)

---

## 🏗️ Stack

- **React 18 + Vite + TypeScript** (SPA, React Router)
- **Tailwind CSS** + styles custom (boutons chanfreinés, curseur, preloader)
- **Supabase** : configuration du site (`site_config`), statistiques de visites (`visits`), authentification admin
- **Vercel** pour l'hébergement et le déploiement continu (`vercel.json` : redirections, headers de sécurité, CSP)

---

## 📁 Structure

```
.
├── index.html              # Entrée Vite (meta SEO par défaut)
├── src/
│   ├── App.tsx             # Routes + pages (accueil, aujourd'hui, menu, galerie, à propos, contact)
│   ├── pages/              # Mentions légales, pages plats, 404
│   ├── lib/                # Client Supabase, config du site, helpers métier
│   ├── cursor.tsx          # Curseur personnalisé + effet magnétique
│   ├── preloader.tsx       # Animation de chargement
│   └── index.css           # Styles custom
├── public/
│   ├── admin.html/js/css   # Panel admin (statique, autonome, noindex)
│   ├── data.js             # Données par défaut + helpers admin
│   ├── supabase-client.js  # Client Supabase du panel admin
│   ├── images/             # Photos des plats et du restaurant
│   ├── robots.txt / sitemap.xml / llms.txt
├── vercel.json             # Redirections, rewrite SPA, headers sécurité
└── supabase-fix-visits-rls.sql  # Politique RLS de la table visits
```

## 🔄 Données dynamiques

Le contenu éditable (menu, plats du jour + portions restantes, horaires,
fermetures exceptionnelles, lien TikTok) vit dans Supabase `site_config` (id=1)
et est édité via `/admin.html`. Le front React lit ce config au chargement
(cache `localStorage.pm_data`, clé publishable Supabase — publique par design).

## 🚀 Développement

```bash
npm install
npm run dev        # serveur local
npm run typecheck  # tsc --noEmit
npm run lint
npm run build      # build de production (dist/)
```
