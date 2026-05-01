# Palais Mauricien — Site web

Site officiel du restaurant **Palais Mauricien**, Le Port — La Réunion.

🌐 [palaismauricien.re](https://palaismauricien.re)

---

## 🏗️ Stack

- **HTML / CSS / JavaScript vanilla** (pas de framework)
- **Vercel** pour l'hébergement et le déploiement continu
- **Vercel Edge Middleware** pour la protection de l'admin
- Données stockées en **localStorage** (pas de base de données)

---

## 📁 Structure

```
.
├── index.html              # Accueil
├── menu.html               # Menu (5 catégories)
├── disponible-aujourdhui.html  # Plats du jour
├── galerie.html            # Galerie photos
├── a-propos.html           # À propos
├── contact.html            # Contact + horaires + Maps
├── mentions-legales.html   # Mentions légales / CGU
├── admin.html              # Espace admin (protégé)
│
├── style.css               # Styles site public
├── admin.css               # Styles admin
│
├── main.js                 # Logique site public
├── admin.js                # Logique admin
├── data.js                 # Données menu, horaires, mot de passe admin
├── middleware.js           # Vercel Edge - Basic Auth /admin
│
├── images/                 # Photos plats, logo, hero
├── robots.txt              # SEO crawlers
└── sitemap.xml             # SEO sitemap
```

---

## 🔐 Accès admin

URL : `/admin.html`

Protection en deux couches :
1. **Vercel Basic Auth** (couche serveur) — popup navigateur
2. **Formulaire JS** (couche app)

Mot de passe par défaut : voir documentation interne.

Pour changer le mot de passe :
- Couche 1 : modifier `middleware.js` (constante `PASSWORD`)
- Couche 2 : utiliser **Paramètres → Changer le mot de passe** dans l'admin (modifie le localStorage)

⚠️ Ces deux mots de passe **doivent être synchronisés** manuellement.

---

## 🚀 Déploiement

Push sur la branche `main` → Vercel déploie automatiquement.

```bash
git add .
git commit -m "Description du changement"
git push
```

Build : 30 secondes environ.

---

## 🛠️ Développement local

Serveur local Python :
```bash
python -m http.server 8000
```

Puis ouvrir http://localhost:8000

---

## 📝 Fonctionnalités admin

- Tableau de bord (stats visites)
- Gestion du menu (CRUD plats par catégorie)
- Plats du jour (sélection journalière)
- Gestion des horaires (par service midi/soir, par jour)
- Paramètres (changement mot de passe, reset)

---

## ⚠️ Limitation à connaître

Les données admin sont stockées en **localStorage** côté navigateur. Conséquence :
- Le client doit utiliser **toujours le même navigateur sur le même appareil** pour gérer le menu
- Effacer les cookies/cache du navigateur efface les modifs
- Pour une vraie persistance multi-appareils, ajouter un backend (Supabase, Firebase, etc.) — non implémenté

---

## 📞 Contact technique

Maintenance : à définir avec le développeur.
