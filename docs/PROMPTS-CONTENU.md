# Contenus manquants et prompts IA

Le site a été construit avec ce que contient le dépôt `cliniqueprosas` (`FONCTIONNALITES-SITE-INTERNET.md`, `FONCTIONNALITES.md`, `CHANGELOG.md`, routes backend).
Ce document liste **ce qui n'y figure pas** et donne, pour chaque point, un prompt à coller dans une IA (Claude, ChatGPT, un générateur d'images…).

> Règle : ne jamais publier un chiffre, un témoignage ou une promesse que vous ne pouvez pas prouver. Les prompts ci-dessous demandent à l'IA de **dire « inconnu »** plutôt que d'inventer.

---

## 0. Ce que j'ai supposé (à confirmer ou corriger)

| # | Hypothèse faite dans le site | Où la changer |
| --- | --- | --- |
| 1 | **Les deux packs sont complémentaires et cumulables** (total 80 000 FCFA/mois). Aucune remise de combinaison n'est annoncée. | `src/lib/pricing.ts`, `src/lib/faq.ts` |
| 2 | Découpage des modules : *Opérationnelle* = patients, agenda, réception, consultations, dossier médical, examens, ordonnances, assurances (prise en charge). *Financière et comptable* = facturation, caisse, honoraires médecins, comptabilité SYSCOHADA. *Socle commun aux deux* = tableaux de bord, WhatsApp, administration et sécurité. | `src/lib/features.ts` |
| 3 | Les prix sont affichés « FCFA / mois » **sans mention HT/TTC**, sans essai gratuit, sans frais de mise en route, sans facturation annuelle. | `src/lib/pricing.ts` |
| 4 | Aucune limite d'utilisateurs, de médecins ou de patients n'est annoncée. | `src/lib/pricing.ts` |
| 5 | Le pack « Gestion financière et comptable » est mis en avant (carte sombre, bandeau « Maîtrisez vos chiffres »). Simple choix de design, pas une affirmation commerciale. | `src/components/pricing.tsx` |
| 6 | Le multi-structure (tenants, super-administrateur) n'est pas présenté sur le site, faute de savoir à quel pack il appartient. | `src/lib/features.ts` |
| 7 | Les écrans animés du carrousel utilisent des **données fictives** (noms, montants). | `src/components/mockups.tsx` |

**Prompt pour valider les hypothèses 2 et 6 avec le code réel** (à exécuter dans une session Claude Code ouverte sur le dépôt `cliniqueprosas`) :

```text
Tu es l'analyste produit de CliniquePro. Je vends deux packs :
- Pack A « Gestion opérationnelle » (parcours patient, médical, assurance)
- Pack B « Gestion financière et comptable » (facturation, caisse, honoraires, comptabilité)

Parcours les routes backend (backend/src/routes), les pages frontend
(frontend/src/app/(authenticated)) et les rôles utilisateurs. Produis un tableau
« module ou page → pack A, pack B, ou les deux » en t'appuyant uniquement sur le code.
Signale toute dépendance technique forte (ex. : la caisse ne fonctionne pas sans la réception).
Liste à part les fonctions qui n'entrent clairement dans aucun des deux packs
(multi-structure, super-admin, assistant IA, WhatsApp, impressions…) et propose où les ranger.
N'invente rien : si le code ne permet pas de trancher, écris « à décider ».
```

---

## 1. Informations légales et coordonnées (obligatoires avant mise en ligne)

À renseigner dans `src/lib/site.ts` (actuellement « À renseigner » / numéros fictifs `+225 00 00 00 00 00`) :

- Raison sociale, forme juridique, RCCM, numéro de compte contribuable, directeur de la publication
- Adresse, téléphone, numéro WhatsApp, e-mail de contact
- Nom de domaine du site et de l'application (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_URL`)
- Hébergeur du site (nom, adresse)
- Lien Calendly / Cal.com éventuel (`NEXT_PUBLIC_BOOKING_URL`) et webhook de réception des demandes (`N8N_WEBHOOK_URL`)

**Prompt : rédiger les mentions légales et la politique de confidentialité**

```text
Tu es juriste spécialisé en droit du numérique en Côte d'Ivoire. Rédige, en français,
les « Mentions légales » et la « Politique de confidentialité » du site vitrine d'un
logiciel de gestion de clinique (SaaS) nommé CliniquePro.

Informations (remplace [..] par mes valeurs, ne devine rien) :
- Éditeur : [raison sociale], [forme juridique], RCCM [..], compte contribuable [..]
- Directeur de la publication : [..]
- Hébergeur du site : [..]
- Données collectées par le site : formulaire de demande de démonstration
  (structure, taille de l'équipe, pack, fonction, nom, clinique, e-mail, téléphone),
  transmis à [outil : n8n / Airtable / e-mail].
- Le site ne collecte aucune donnée de santé ; les données de santé sont traitées
  dans l'application par les cliniques clientes.

Contraintes : cite le cadre ivoirien applicable (loi n° 2013-450 du 19 juin 2013 sur la
protection des données à caractère personnel, autorité ARTCI) en indiquant que je dois
faire vérifier les références par un juriste ; prévois durée de conservation,
droits des personnes, sous-traitants, cookies. Structure en titres courts, phrases simples.
Signale par [À CONFIRMER] tout point qui dépend d'une information que je ne t'ai pas donnée.
```

---

## 2. Photos du carrousel (7 images, format 3:4)

Le carrousel fonctionne sans photo (fond dégradé + pictogramme). Pour ajouter une photo : déposer le fichier dans `public/images/hero/<id>.jpg` puis renseigner `image` et `imageAlt` dans `src/lib/content.ts`.

**Prompt de base (à ajouter au début de chacun des 7 prompts)**

```text
Photographie éditoriale réaliste, format portrait 3:4, lumière naturelle douce,
palette dominante bleu marine et vert, arrière-plan légèrement flou, personnes
d'Afrique de l'Ouest, ambiance professionnelle et chaleureuse d'une clinique
ophtalmologique moderne à Abidjan. Aucun texte, aucun logo, aucune marque visible.
Mains et visages naturels, sans déformation. Espace libre dans le tiers inférieur
(un titre sera superposé).
```

| Fichier | Sujet à ajouter au prompt de base |
| --- | --- |
| `agenda.jpg` | Une secrétaire souriante accueille une patiente à un comptoir de réception, écran d'ordinateur visible de dos. |
| `consultation.jpg` | Un ophtalmologue examine l'œil d'une patiente à la lampe à fente, regard attentif et rassurant. |
| `examens.jpg` | Un technicien prépare un examen OCT, patient installé devant l'appareil, écran de résultats flou. |
| `assurance.jpg` | Une assistante vérifie un dossier de prise en charge sur tablette, avec un patient en arrière-plan. |
| `caisse.jpg` | Un caissier encaisse un paiement par téléphone mobile, tablette de caisse sur le comptoir. |
| `comptabilite.jpg` | Une comptable analyse des tableaux sur deux écrans dans un bureau lumineux de clinique. |
| `pilotage.jpg` | La directrice d'une clinique consulte un tableau de bord sur tablette, équipe médicale floue au fond. |

Texte alternatif à fournir pour chaque image (`imageAlt`) : une phrase qui décrit la scène.

---

## 3. Captures d'écran réelles de l'application

Les écrans du carrousel sont des maquettes animées. Pour les remplacer ou les compléter par de vraies captures :

1. Lancer l'application avec le jeu de démonstration (`Seed-Dev-Full.bat`, comptes dans `COMPTES-TEST.md`).
2. Capturer, en 1440 px de large, fond clair, **données fictives uniquement** : agenda, réception, consultation (acuité/PIO/réfraction), examens, portail assurance, caisse (clôture), journal comptable + balance, tableau de bord direction, honoraires médecins.
3. Flouter tout nom ou numéro réel avant publication.

**Prompt pour rédiger les légendes**

```text
Voici la liste de mes captures d'écran CliniquePro : [liste fichier -> écran].
Pour chacune, écris une légende de 12 mots maximum, en français, qui décrit ce que
l'utilisateur accomplit (verbe d'action), sans jargon et sans fonction qui n'existe pas
dans la capture. Écris aussi le texte alternatif (une phrase) pour l'accessibilité.
```

---

## 4. Faits que le dépôt ne donne pas (FAQ, sécurité, offre)

Questions auxquelles le site ne peut pas répondre aujourd'hui. À poser à l'équipe technique avec le prompt ci-dessous, puis à intégrer dans `src/lib/faq.ts` :

- Hébergement des données (pays, prestataire), sauvegardes, chiffrement, disponibilité (SLA)
- Durée de conservation, export des données en fin de contrat, réversibilité
- Utilisation de l'assistant analytique IA : quelles données sont envoyées à quel fournisseur ?
- Utilisation sur mobile / tablette, fonctionnement avec connexion instable
- Formation, mise en route, support (horaires, canaux), migration depuis un logiciel existant
- Nombre d'utilisateurs inclus, limites de patients ou de médecins par pack
- Essai gratuit, durée d'engagement, mode de paiement de l'abonnement, TVA

**Prompt pour la session Claude Code ouverte sur `cliniqueprosas`**

```text
Audite le dépôt pour répondre à des questions de prospects, uniquement à partir du
code, des fichiers docker/, DEPLOIEMENT.md, des variables d'environnement et du schéma
Prisma. Pour chaque point, réponds « Confirmé par le code (fichier:ligne) », « Non
prévu » ou « Inconnu » :
1. Où et comment les données sont stockées (base, fichiers uploadés), sauvegardes ?
2. Chiffrement en base ou au repos ? Mots de passe, sessions, journal d'audit ?
3. Quelles données patients sont envoyées à un service tiers (assistant analytique,
   WhatsApp, e-mail) et à quel fournisseur ?
4. Politique de rétention (paramètres de conservation) : valeurs par défaut ?
5. L'interface est-elle utilisable sur tablette et téléphone ?
6. Existe-t-il une limite d'utilisateurs / de patients / de médecins dans le code ?
7. Export des données (CSV, PDF) disponible pour quelles entités ?
Termine par un paragraphe de 5 phrases maximum que je pourrais publier tel quel sur le
site, sans promesse que le code ne prouve pas.
```

---

## 5. Preuve sociale : chiffres clés et témoignages

Le site n'affiche **aucun** chiffre ni témoignage (rien dans le dépôt ne les prouve). À ajouter dès que vous disposez de données réelles : nombre de cliniques utilisatrices, patients gérés, temps gagné à la caisse, etc.

**Prompt pour recueillir un témoignage réel**

```text
Je dois obtenir un témoignage d'une clinique cliente de CliniquePro. Rédige :
1. un message WhatsApp de 5 lignes pour demander son accord (ton respectueux, direct) ;
2. cinq questions courtes et ouvertes (avant/après, gain concret, module préféré,
   point d'amélioration, conseil à un confrère) ;
3. un modèle d'autorisation écrite de publication (nom, fonction, clinique, citation).
N'invente aucune réponse : je te donnerai la citation exacte après l'entretien.
```

**Prompt pour transformer un témoignage en bloc de site**

```text
Voici la citation exacte, validée par le client : « [..] » — [nom, fonction, clinique].
Propose un titre court (8 mots) qui reprend ses propres mots, sans rien ajouter qu'il
n'ait pas dit, et un chiffre mis en avant uniquement s'il figure dans la citation.
```

---

## 6. Vidéo de démonstration (facultatif)

```text
Écris le script d'une vidéo de démonstration de 90 secondes pour CliniquePro, destinée
à des directeurs de cliniques ophtalmologiques en Afrique francophone. Structure :
accroche (10 s) sur un problème réel (dossiers dispersés, caisse non rapprochée),
puis un parcours patient en 5 écrans (accueil, consultation, examen, caisse,
comptabilité), puis appel à l'action « Demandez une démonstration ». Phrases courtes,
sans jargon. Pour chaque plan, indique l'écran à filmer. N'annonce aucune fonction
absente de cette liste : [coller la liste des modules de src/lib/features.ts].
```

---

## 7. Référencement (facultatif)

Le site de référence avait des pages thématiques (`landings.ts`). Pour en créer pour CliniquePro :

```text
Propose 8 pages d'atterrissage SEO pour un logiciel de gestion de clinique
ophtalmologique en Côte d'Ivoire (ex. « logiciel clinique ophtalmologique Abidjan »,
« facturation tiers payant assurance clinique »). Pour chaque page : slug, balise title
(60 caractères max), meta description (155 max), H1, 3 sections avec intertitres,
3 questions de FAQ. Utilise uniquement les fonctions listées ici : [coller
src/lib/features.ts]. Aucune statistique de marché inventée.
```

---

## 8. Éléments graphiques

- Logo en **SVG** (ou PNG haute définition à fond transparent) : les versions actuelles (`public/images/logo/`) ont été détourées à partir du PNG fourni.
- Favicon définitif (`src/app/icon.png`, `src/app/apple-icon.png`) : actuellement l'icône du bâtiment sur fond blanc.
- Image de partage réseaux sociaux : générée automatiquement (`src/app/opengraph-image.tsx`) ; à remplacer par un visuel dédié si souhaité.
