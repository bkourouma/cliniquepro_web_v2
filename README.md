# CliniquePro — Site vitrine

Site marketing de l'application [CliniquePro](https://github.com/bkourouma/cliniqueprosas) (gestion de clinique ophtalmologique).
Même layout que le site ImmoTopia (`immotopia_website_v2`) : Next.js 16 (App Router) · Tailwind CSS 4 · Framer Motion · GSAP.
Thème tiré du logo : bleu marine, bleu hôpital et vert.

## Lancer le site

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # version production
npm run lint
```

## Offre : deux packs

| Pack | Prix |
| --- | --- |
| Gestion opérationnelle | 35 000 FCFA / mois |
| Gestion financière et comptable | 45 000 FCFA / mois |

La grille tarifaire est dans `src/lib/pricing.ts` (source de vérité : cartes, tableau comparatif, total combiné).
Le découpage des modules entre les deux packs est dans `src/lib/features.ts` (hypothèse à valider, voir `docs/PROMPTS-CONTENU.md`).

## Modifier le contenu

Les textes vivent dans `src/lib/`, pas dans les composants :

- `content.ts` : cartes du carrousel (7), rôles (4 onglets), bandeau, problèmes résolus, journée type, navigation.
- `features.ts` : les 14 modules et le pack qui les couvre.
- `faq.ts` : questions fréquentes.
- `site.ts` : coordonnées et mentions légales (**valeurs « À renseigner » à compléter**).

Règle éditoriale : ne présenter que ce que l'application fait réellement ; aucune date de livraison, aucun chiffre ou témoignage inventé.

## Pages

`/` (accueil) · `/fonctionnalites` · `/tarifs` · `/faq` · `/contact` · `/mentions-legales` · `/confidentialite`

## Demande de démonstration

Copiez `.env.example` en `.env.local` :

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Adresse publique du site (sitemap, données structurées). |
| `NEXT_PUBLIC_APP_URL` | Lien du bouton « Connexion ». |
| `NEXT_PUBLIC_BOOKING_URL` | Lien Calendly (par défaut `https://calendly.com/immotopia/demo-cliniquepro`). Rempli : la fenêtre de démo affiche le calendrier. Vide : formulaire intégré. |
| `N8N_WEBHOOK_URL` | Webhook (n8n, Zapier, Make…) qui reçoit le formulaire intégré. Lu côté serveur uniquement. |

## Images

Le logo est dans `public/images/logo/`. Les cartes du carrousel acceptent une photo facultative
(`image` dans `src/lib/content.ts`, format 3:4, à déposer dans `public/images/hero/`) ; sans photo, un fond dégradé est affiché.
Les prompts pour générer ces images sont dans `docs/PROMPTS-CONTENU.md`.

## Déploiement

```bash
docker compose up -d --build   # écoute sur 127.0.0.1:3030, à placer derrière nginx
```
