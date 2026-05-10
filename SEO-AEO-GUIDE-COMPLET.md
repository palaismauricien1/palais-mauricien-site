# 🎯 Guide complet SEO + AEO + e-réputation - Palais Mauricien

Référencement = se faire trouver. Aujourd'hui ça se joue sur 4 fronts :
1. **SEO Google** (recherche classique)
2. **SEO Local** (Google Maps, packs locaux, voice search "OK Google restaurant près de moi")
3. **AEO / GEO** (réponses générées par ChatGPT, Claude, Perplexity, Gemini, Bing Chat)
4. **E-réputation** (avis, réseaux, presse locale)

---

## 🔵 1. SEO Google classique

### ✅ Déjà fait (technique)
- [x] Sitemap.xml + robots.txt corrects
- [x] Canonical URLs sur toutes les pages
- [x] JSON-LD Restaurant complet (horaires, geo, menu, prix)
- [x] BreadcrumbList sur les pages internes
- [x] Open Graph + Twitter cards absolus
- [x] Mobile-friendly (viewport, lazy loading images)
- [x] HTTPS, HSTS, headers sécurité
- [x] Une seule h1 par page

### ⚠️ À faire toi-même
- [ ] **Soumettre sitemap.xml dans Google Search Console** *(5 min)* - voir `SEO-INSCRIPTIONS-PRETES-A-COLLER.md`
- [ ] **Soumettre dans Bing Webmaster Tools** *(5 min)* - Bing alimente aussi les réponses ChatGPT/Copilot
- [ ] Demander à 2-3 sites locaux (blog food Réunion, presse locale, association de quartier) un lien vers `palaismauricien.re` → backlinks de qualité
- [ ] Tous les 3 mois : vérifier les rapports Search Console (mots-clés qui rapportent du trafic, pages mal indexées)

### 🟡 Optimisations contenus (long terme)
- [ ] Créer une page par plat phare (`/masale-cabri.html`, `/vinday-poisson.html`) avec recette/histoire pour capter les recherches longue traîne du type "où manger un masalé cabri à La Réunion"
- [ ] Section "blog/actualités" du restaurant : 1 article par mois (nouvelles recettes, événements, fêtes mauriciennes) → contenu frais = signal de vie pour Google

---

## 🟢 2. SEO Local (le plus important pour un restau)

> **Règle d'or** : 80 % des clients d'un restau le trouvent via Google Maps / pack local. Pas via le site direct. Investis là-dessus en priorité absolue.

### À faire en priorité
- [ ] **Google Business Profile** revendiqué et complet à 100 % :
  - Photo de couverture pro (extérieur du resto)
  - Photo intérieur (3-5)
  - Photos des plats phares (10+)
  - Logo carré
  - Vidéo courte (30s) si possible
  - Description 750 car. (texte fourni dans `SEO-INSCRIPTIONS-PRETES-A-COLLER.md`)
  - Horaires *spéciaux* signalés (jours fériés, ramadan, fermetures imprévues)
  - Menu lié (URL `https://www.palaismauricien.re/menu.html`)
  - Lien commande Uber Eats activé
  - Catégories : 1 principale (`Restaurant mauricien`) + jusqu'à 9 secondaires
  - Attributs : halal, à emporter, livraison, sur place, paiement CB, etc.

### Citations cohérentes (NAP)
- [ ] Inscrire le resto sur les annuaires : Pages Jaunes, TripAdvisor, Yelp, 974.re, annuaires halal - **avec exactement le même nom, adresse, téléphone partout** (cf. fichier inscriptions)
- [ ] Vérifier qu'aucune ancienne fiche fantôme ne traîne avec un mauvais numéro ou adresse → demander la suppression

### Avis Google (algorithme)
- [ ] Demander aux clients satisfaits de poster un avis Google (objectif : passer de 43 → 100+ avis cette année)
- [ ] Répondre à **chaque** avis sous 48h, positif comme négatif, en français correct, en mentionnant le plat ou l'expérience → Google lit ces réponses
- [ ] Ne JAMAIS acheter d'avis : Google détecte et pénalise lourdement

---

## 🟣 3. AEO / GEO - Référencement IA (ChatGPT, Claude, Perplexity, Gemini)

C'est l'avenir : de plus en plus de gens demandent à ChatGPT "quel est le meilleur restaurant mauricien à La Réunion ?" au lieu de chercher sur Google.

### Comment les IA "voient" ton site
1. Elles crawlent le web via leurs bots (`GPTBot`, `ClaudeBot`, `Google-Extended`, `PerplexityBot`, `CCBot`)
2. Elles privilégient les sites avec **structure claire**, **données structurées**, **mentions sur d'autres sites** (Wikipedia, Reddit, blogs)

### ✅ Déjà bien
- [x] JSON-LD Restaurant + Menu complet → les IA savent exactement qui tu es, ta cuisine, tes prix
- [x] Mentions légales détaillées → confiance
- [x] Horaires structurés → réponses précises ("le restaurant est-il ouvert maintenant ?")

### ⚠️ À ajouter

#### 3.1 Autoriser explicitement les bots IA via robots.txt
```
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
```
**👉 Je peux le faire en 1 commit, dis-moi si tu valides.**

#### 3.2 Ajouter une section FAQ (FAQPage schema)
Les IA adorent les Q/R structurées. Crée une section "Questions fréquentes" en bas de l'accueil :
- "Le Palais Mauricien est-il halal ?" → "Oui, 100 % halal."
- "Acceptez-vous les commandes à emporter ?" → "Oui, sur place ou via Uber Eats."
- "Où êtes-vous situés ?" → "22 Av. de la Commune de Paris, Le Port 97420."
- "Quels sont vos horaires ?" → "Midi 10h30-14h30 et soir 18h30-21h30, du lundi au samedi."
- "Quelle est votre spécialité ?" → "Le masalé cabri, recette emblématique de l'Île Maurice."

**👉 Je peux générer la section + le JSON-LD FAQPage en 1 commit.**

#### 3.3 Fichier llms.txt (standard émergent)
Comme robots.txt mais pour les IA : un résumé du site en markdown. Adopté par Anthropic, OpenAI, Mistral.

```
# Palais Mauricien
> Restaurant halal mauricien au Port (La Réunion) - cuisine traditionnelle de l'Île Maurice.

## Adresse et contact
- 22 Av. de la Commune de Paris, 97420 Le Port, La Réunion
- +262 693 43 22 25
- palaismauricien@gmail.com

## Horaires
Lundi à samedi : midi 10h30-14h30, soir 18h30-21h30. Dimanche fermé.

## Spécialités
Masalé cabri, vinday poisson, sauté poulet au bred, halim, brochettes,
rotis, alouda, gulab jamun, rasgullah, napolitaine.

## Commande
À emporter au restaurant ou livraison Uber Eats.

## Pages
- /menu.html : carte complète avec prix
- /disponible-aujourdhui.html : sélection du jour
- /contact.html : adresse, horaires, plan
```
**👉 Je peux créer ce fichier maintenant.**

#### 3.4 Présence sur Wikipedia / Wikidata
Les IA puisent énormément dans Wikipedia. Sans entrée Wikipedia, ChatGPT te connaîtra mal. Pour un petit restau c'est dur d'être éligible (critères de notoriété), mais :
- [ ] **Wikidata** est plus accessible : créer une entité "Palais Mauricien" avec adresse, type, site web. https://www.wikidata.org/

#### 3.5 Mentions sur Reddit / forums
- [ ] Quand quelqu'un demande sur r/Reunion ou un groupe Facebook "où manger mauricien au Port ?" → réponse honnête mentionnant le restaurant. Les IA crawlent Reddit.

---

## 🟡 4. Contenu et réseaux sociaux

### Facebook
- [ ] Page Facebook complète : photos pro, horaires, lien site
- [ ] 2-3 posts par semaine : plat du jour, photo en cuisine, témoignage client, événement
- [ ] Activer la messagerie + temps de réponse < 1h → badge "Très réactif"

### Instagram
- [ ] Compte Instagram avec bio + lien vers le site
- [ ] Stories quotidiennes des plats du jour (5 min/jour)
- [ ] Reels courts (15-30s) : préparation, ambiance - **énorme reach gratuit en 2026**
- [ ] Hashtags locaux : `#PalaisMauricien #LePort974 #ReunionFood #CuisineMauricienne #HalalReunion`

### TikTok (optionnel mais ROI fou)
- [ ] Compte TikTok : 1 vidéo/jour pendant 30 jours pour percer (préparation, dégustation, "behind the scenes")
- [ ] Cible : 18-35 ans à La Réunion qui cherchent où manger

### Google Posts (depuis Google Business)
- [ ] 1 post par semaine via Google Business : nouveau plat, événement, promotion
- [ ] Apparaît directement dans la fiche Google Maps

---

## 🔴 5. E-réputation et avis

- [ ] **Avis Google** : objectif 100+ avis avec note ≥ 4,5/5
- [ ] **TripAdvisor** : viser le top 10 restos du Port
- [ ] **Carte de visite avec QR code** vers la fiche Google d'avis (à donner à chaque commande)
- [ ] Surveillance : alerte Google ("Palais Mauricien" en alerte mention) → réagir vite si commentaire négatif quelque part

---

## ⚪ 6. Performance technique (suivi)

À tester tous les 3 mois :
- [ ] **PageSpeed Insights** : https://pagespeed.web.dev/?url=https%3A%2F%2Fwww.palaismauricien.re - viser ≥ 90 mobile et desktop
- [ ] **Lighthouse** dans Chrome DevTools → tab "Lighthouse" → audit
- [ ] **Schema validator** : https://validator.schema.org/ - coller `https://www.palaismauricien.re/` et vérifier 0 erreur
- [ ] **Rich Results Test** : https://search.google.com/test/rich-results - vérifier que Restaurant + Menu + Breadcrumb sont reconnus

---

## 📊 7. Mesurer le succès

### Search Console (gratuit)
- Impressions et clics par mot-clé
- Position moyenne pour "restaurant mauricien Le Port"
- Pages avec trafic
- Erreurs d'indexation

### Google Analytics 4 (optionnel)
- À installer si tu veux des métriques détaillées (sessions, conversions Uber Eats…)
- ⚠️ RGPD : nécessite consentement explicite avant chargement → bandeau cookies à enrichir si activé. Aujourd'hui on a un tracking interne minimal qui suffit.

### KPI restau à suivre
- Position Google Maps pour "restaurant mauricien" + "restaurant halal Le Port"
- Nombre d'avis Google et note moyenne
- Volume d'appels téléphoniques (depuis fiche Google : statistique fournie)
- Trafic organique vers le site
- Commandes Uber Eats (si tu as accès aux stats vendeur)

---

## 🚀 Plan d'action concret - par ordre d'impact

| Priorité | Action | Temps | Impact attendu |
|---|---|---|---|
| 🔥 P0 | Revendiquer/compléter Google Business Profile | 30 min | Énorme - 80% du local |
| 🔥 P0 | Ajouter robots.txt IA + llms.txt + FAQ | (je peux faire) | Important - visibilité IA |
| 🔥 P0 | Search Console + sitemap submission | 5 min | Indexation rapide |
| 🟧 P1 | Inscription Pages Jaunes + TripAdvisor | 15 min | Citations + clients touristes |
| 🟧 P1 | Demander 30 nouveaux avis Google sur 1 mois | quotidien | Local pack ranking |
| 🟧 P1 | Page Facebook + Instagram actives | 30 min/sem | Trafic local + engagement |
| 🟨 P2 | Backlinks locaux (presse, blogs) | 1-2h | Autorité de domaine |
| 🟨 P2 | TikTok + Reels | 1h/jour | Notoriété 18-35 ans |
| 🟦 P3 | Pages dédiées par plat phare | 2-3h | Longue traîne SEO |
| 🟦 P3 | Wikidata + mentions Reddit | 1h | AEO/IA |

---

## ✋ Ce que je peux automatiser maintenant

Dis "go" et je fais en 1 commit :
1. ✅ Robots.txt avec les bots IA explicitement autorisés
2. ✅ Fichier `llms.txt` complet
3. ✅ Section FAQ visible sur l'accueil + JSON-LD FAQPage
4. ✅ Pages produits par plat signature (masalé cabri, vinday poisson, brochette mauricienne)
5. ✅ Bonus : meta tag Search Console quand tu m'auras donné le code

Tout le reste (Google Business, Pages Jaunes, Instagram, avis…) → toi, parce que c'est lié à ton identité commerciale.
