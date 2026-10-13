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
| Gestion opérationnelle | 25 000 FCFA HT / mois |
| Gestion financière et comptable | 35 000 FCFA HT / mois |

La grille tarifaire est dans `src/lib/pricing.ts` (source de vérité : cartes, tableau comparatif, total combiné).
Le découpage des modules entre les deux packs est dans `src/lib/features.ts` (hypothèse à valider, voir `docs/PROMPTS-CONTENU.md`).

## Modifier le contenu

Les textes vivent dans `src/lib/`, pas dans les composants :

- `content.ts` : cartes du carrousel (7), rôles (4 onglets), bandeau, problèmes résolus, journée type, navigation.
- `features.ts` : les 14 modules et le pack qui les couvre.
- `faq.ts` : questions fréquentes.
- `site.ts` : coordonnées et mentions légales (**valeurs « À renseigner » à compléter**).

Règle éditoriale : ne présenter que ce que l'application fait réellement ; aucune date de livraison, aucun chiffre ou témoignage inventé.

## Référencement (SEO et moteurs de réponse IA)

- `src/lib/seo.ts` : `pageMetadata()` pose titre, description, canonical, Open Graph (url et image) et Twitter pour chaque page. Les titres prennent le gabarit « … — CliniquePro » défini dans `layout.tsx`.
- `src/components/json-ld.tsx` : données structurées (Organization, WebSite, SoftwareApplication avec prix mensuels HT, WebPage avec `dateModified`, BreadcrumbList, FAQPage). Elles se lisent dans `src/lib/` : un prix ou un module modifié se répercute partout.
- `src/app/robots.ts` : accès explicite des robots d'IA (recherche et entraînement) ; la liste et la façon de la restreindre sont commentées dans le fichier.
- `src/app/llms.txt/route.ts` : `/llms.txt`, résumé Markdown du site généré à partir des mêmes données.
- `src/app/sitemap.ts` : `lastmod` seulement. **À chaque mise à jour réelle du contenu, changer `SITE_UPDATED` dans `src/lib/site.ts`** (et régénérer le wiki, dont la date alimente ses pages).
- `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` (voir `.env.example`) : balises de vérification Search Console et Bing, posées seulement si renseignées.

## Pages

`/` (accueil) · `/fonctionnalites` · `/tarifs` · `/faq` · `/a-propos` · `/contact` · `/mentions-legales` · `/confidentialite`

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

## Déploiement (serveur `alliance`)

Le site tourne dans le conteneur Docker `cliniquepro-site` (image `cliniquepro-site:latest`, port local `127.0.0.1:3030`),
derrière nginx (`/etc/nginx/sites-available/cliniquepro-web.allianceconsultants.net`). Dossier sur le serveur :
`/home/deployer/apps/cliniquepro-web-v2` (utilisateur `deployer`).

### Déploiement automatique (procédure normale)

Chaque fusion d'une pull request dans la branche `main` (branche par défaut) déploie le site :

1. `.github/workflows/deploy.yml` lance d'abord les vérifications de `ci.yml` (types, lint, build) sur GitHub.
   Les mêmes vérifications tournent sur chaque pull request ;
2. si elles passent, le job « Déployer sur alliance » tourne sur le runner auto-hébergé `cliniquepro-site`
   (utilisateur `deployer`, service systemd `actions.runner.bkourouma-cliniquepro_web_v2.cliniquepro-site-runner`) :
   il garde l'image actuelle sous l'étiquette `cliniquepro-site:avant-ci-<date>-<commit>`, synchronise le code dans
   `/home/deployer/apps/cliniquepro-web-v2` (`rsync`, sans toucher à un éventuel `.env` ni au dépôt `.git` du dossier),
   lance `docker compose up -d --build`, puis vérifie `http://127.0.0.1:3030/robots.txt` et `/`
   (30 tentatives, 5 s d'écart) ;
3. si le contrôle de santé échoue, le job remet automatiquement l'image précédente et se termine en échec (visible
   dans l'onglet Actions). Si la construction elle-même échoue, l'ancien conteneur reste en service.

Un seul déploiement à la fois (`concurrency`). On peut aussi relancer un déploiement sans nouveau commit :
onglet Actions, « Déploiement », « Run workflow », branche `main`. Aucun secret GitHub n'est nécessaire.

Les variables d'environnement du conteneur (`N8N_WEBHOOK_URL`, `NEXT_PUBLIC_*`) viennent de `docker-compose.yml`
(valeurs par défaut) ou d'un `.env` placé dans le dossier du serveur ; il n'y en a pas aujourd'hui.

### Retour arrière et secours manuel

- Retour arrière automatique : voir ci-dessus (contrôle de santé en échec).
- Retour arrière à la main sur une version précédente (sur le serveur, utilisateur `deployer`) :
  `docker image ls cliniquepro-site` pour repérer l'étiquette `avant-ci-…`, puis
  `docker tag cliniquepro-site:avant-ci-… cliniquepro-site:latest && cd ~/apps/cliniquepro-web-v2 && docker compose up -d --no-build`.
  (Le dossier du serveur contient le code déployé en dernier : un redéploiement du `main` précédent via
  « Run workflow » sur le bon commit est l'autre voie.)
- Secours si GitHub Actions est indisponible : copier le dépôt dans le dossier du serveur puis
  `docker compose up -d --build`.

### Installation du runner

`deploy/install-runner.sh` (une seule fois, en une connexion SSH ; le jeton vient de
`gh api -X POST repos/bkourouma/cliniquepro_web_v2/actions/runners/registration-token --jq .token`).
Le runner `cliniquepro-site-runner` est installé dans `~/actions-runner-cliniquepro-site`, avec le label `cliniquepro-site`.
