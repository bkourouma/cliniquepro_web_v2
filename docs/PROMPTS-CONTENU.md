# Contenus manquants et prompts IA

Le site a été construit avec ce que contient le dépôt `cliniqueprosas` (`FONCTIONNALITES-SITE-INTERNET.md`, `FONCTIONNALITES.md`, `CHANGELOG.md`, routes backend).
Ce document liste **ce qui n'y figure pas** et donne, pour chaque point, un prompt à coller dans une IA (Claude, ChatGPT, un générateur d'images…).

> Règle : ne jamais publier un chiffre, un témoignage ou une promesse que vous ne pouvez pas prouver. Les prompts ci-dessous demandent à l'IA de **dire « inconnu »** plutôt que d'inventer.

---

## 0. Positionnement et décisions du 13 octobre 2026

CliniquePro n'est plus présenté comme « le logiciel des cliniques ophtalmologiques » mais comme **le logiciel de gestion des cliniques privées, des centres de santé privés et des cabinets médicaux, toutes spécialités**. L'ophtalmologie reste la spécialité la plus détaillée et sert d'exemple. Les phrases de positionnement vivent dans `src/lib/positionnement.ts` (titres, données structurées, `llms.txt`, FAQ et À propos s'en servent) : on les change là.

Décisions de l'éditeur, à respecter dans tout texte :

- **Cible** : cliniques privées, centres de santé **privés**, cabinets médicaux, toutes spécialités. Ne pas cibler les centres publics ou communautaires. Côte d'Ivoire d'abord (Abidjan) ; l'Afrique francophone peut être citée, sans page par pays.
- **Spécialités** : modèles de consultation **paramétrables pour toutes les spécialités** ; l'ophtalmologie est la plus détaillée. Ne pas écrire « prêt à l'emploi pour la cardiologie / la pédiatrie… ».
- **Hors connexion** : **saisie hors ligne puis synchronisation** au retour du réseau. Ne pas écrire que toute l'application fonctionne sans Internet, ni qu'on peut tout consulter hors ligne.
- **Hébergement** : **au choix du client** (cloud ou serveur local dans la clinique). Ne pas écrire « en Côte d'Ivoire ».
- **Fonctions affirmables** : prise en charge assurance (assureurs et mutuelles restent **génériques**, aucun nom), multi-sites / multi-cabinets, Mobile Money intégré (paiement intégré), fonctions d'IA **optionnelles** (service tiers, une aide, aucun diagnostic ni promesse médicale). Trois fonctions citables (décision du 16 octobre 2026) : questions en langage naturel sur ses données, extraction d'informations depuis un PDF de résultats, synthèse du dossier patient.
- **Sauvegarde** : la sauvegarde quotidienne est assurée par Alliance Consultants dans tous les cas (cloud ou serveur local).
- **Hors périmètre, écrit noir sur blanc** (FAQ « Que ne fait pas CliniquePro ? ») : hospitalisation, laboratoire, pharmacie.
- **MedicPro est un autre produit** (gestion réglementaire pharmaceutique) : ne jamais le confondre avec CliniquePro.
- **Conformité** : respect de la loi ivoirienne n° 2013-450. Ne pas écrire « conforme RGPD » ni annoncer de certification.
- **Offre publiable** : formation incluse, import des données existantes, support WhatsApp, abonnement sans engagement. Prix : uniquement `pricing.ts`. Pas de prix TTC, pas de frais de mise en route, pas de délai.
- **Éditeur** : « CliniquePro, édité par Alliance Consultants (Abidjan) » (lève la confusion avec les logiciels de nom proche). Auteur des futurs guides : « L'équipe CliniquePro — Alliance Consultants ».
- **Adresse** : celle d'Alliance Consultants publiée sur allianceconsultants.net, soit « Abidjan, Côte d'Ivoire » (ni rue ni quartier). Pas de `LocalBusiness` tant qu'aucune adresse de rue ni bureau ouvert au public n'est publié.

**Règle de contenu** : toute page cite sa source (module de `features.ts`, domaine du wiki ou décision ci-dessus). Une fonction absente de ces sources est marquée « à confirmer » et n'est pas publiée. Aucune page ne cite un chiffre, un client, un avis ou un témoignage non fourni et prouvé.

---

## 0 bis. Décisions antérieures et hypothèses restantes

**Confirmées par vous (2 octobre 2026)**

- Les deux packs se cumulent avec une remise de combinaison de **10 % sur le moins cher** (règle d'ImmoTopia, confirmée le 13 octobre 2026), soit 57 500 FCFA HT/mois pour les deux (25 000 + 35 000, remise de 2 500). Valeur dans `COMBO_DISCOUNT` (`src/lib/pricing.ts`) : la FAQ, les données structurées et `llms.txt` s'en déduisent.
- Prix affichés **hors taxes** ; **premier mois offert, sans engagement** ; aucune limite d'utilisateurs, de médecins ou de patients annoncée.
- FAQ : sauvegarde automatique quotidienne (affirmée par vous : le code ne contient aujourd'hui qu'une sauvegarde manuelle, la sauvegarde nocturne y est seulement prévue — à garder vraie), récupération des données à la fin du contrat sur demande, utilisation mobile/tablette.
- Photos du carrousel : vous les créez une par une avec les prompts de la section 2.
- Contact et éditeur repris de immotopia.cloud (Alliance Consultants, RCCM, compte contribuable, hébergeur Hostinger, téléphone, e-mail, depuis remplacé par `cliniquepro@allianceconsultants.net`). Mentions légales et confidentialité calquées sur celles d'ImmoTopia.
- Domaine du site : `https://cliniquepro-web.allianceconsultants.net`. Connexion à l'application : `https://cliniquepro.allianceconsultants.net/demo-login`.
- Remise de combinaison de 10 % et découpage des modules entre les deux packs : **confirmés**.
- Réservation de démo : même principe qu'ImmoTopia (calendrier Calendly dans la fenêtre « Demander une démo », via `NEXT_PUBLIC_BOOKING_URL`). Lien Calendly : `https://calendly.com/immotopia/demo-cliniquepro` (valeur par défaut de `NEXT_PUBLIC_BOOKING_URL`).
- Coordonnées d'ImmoTopia conservées ; sauvegarde quotidienne automatique confirmée en place.

**Encore à confirmer**

| # | Hypothèse | Où la changer |
| --- | --- | --- |
| 1 | (confirmé) Découpage des modules : *Opérationnelle* = patients, agenda, réception, consultations, dossier médical, examens, ordonnances, assurances. *Financière et comptable* = facturation, caisse, honoraires, comptabilité SYSCOHADA. *Socle commun* = tableaux de bord, WhatsApp, administration. | `src/lib/features.ts` |
| 3 | Pas de frais de mise en route ni de facturation annuelle annoncés. | `src/lib/pricing.ts` |
| 4 | Multi-sites / multi-cabinets : affirmé depuis le 13 octobre 2026 (socle commun, sans pack précis). Le pack qui le porte reste à confirmer. | `src/lib/features.ts` |
| 5 | Les écrans animés du carrousel utilisent des données fictives. | `src/components/mockups.tsx` |
| 6 | Mentions légales et confidentialité reprennent ImmoTopia (durée de conservation 3 ans, loi 2013-450, ARTCI) : à faire relire. | `src/app/mentions-legales`, `src/app/confidentialite` |

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

## 1. Informations légales et coordonnées

Renseignées dans `src/lib/site.ts` à partir de immotopia.cloud. L'adresse e-mail est désormais dédiée à CliniquePro (`cliniquepro@allianceconsultants.net`). Reste à décider : un numéro WhatsApp dédié (actuellement celui d'ImmoTopia), un lien Calendly (`NEXT_PUBLIC_BOOKING_URL`) et le webhook de réception des demandes (`N8N_WEBHOOK_URL`).

---

## 2. Photos du carrousel (7 images, format 3:4)

Le carrousel fonctionne sans photo (fond dégradé + pictogramme). Pour ajouter une photo : déposer le fichier dans `public/images/hero/<id>.jpg` puis renseigner `image` et `imageAlt` dans `src/lib/content.ts`.

Collez chaque prompt tel quel (un par image), format portrait 3:4 (ex. 1536 × 2048), puis enregistrez le fichier sous le nom indiqué dans `public/images/hero/`.

**1. `agenda.jpg`**
```text
Photographie éditoriale réaliste, format portrait 3:4, lumière naturelle douce, palette bleu marine et vert, arrière-plan légèrement flou. Dans une clinique moderne à Abidjan, une secrétaire d'Afrique de l'Ouest souriante accueille une patiente à un comptoir de réception ; un écran d'ordinateur est visible de dos. Ambiance professionnelle et chaleureuse. Aucun texte, aucun logo, aucune marque visible. Visages et mains naturels. Laisser libre le tiers inférieur de l'image.
```

**2. `consultation.jpg`**
```text
Photographie éditoriale réaliste, format portrait 3:4, lumière naturelle douce, palette bleu marine et vert, arrière-plan légèrement flou. Un ophtalmologue d'Afrique de l'Ouest examine l'œil d'une patiente à la lampe à fente, regard attentif et rassurant, cabinet moderne et lumineux. Aucun texte, aucun logo, aucune marque visible. Visages et mains naturels. Laisser libre le tiers inférieur de l'image.
```

**3. `examens.jpg`**
```text
Photographie éditoriale réaliste, format portrait 3:4, lumière naturelle douce, palette bleu marine et vert, arrière-plan légèrement flou. Un technicien d'Afrique de l'Ouest prépare un examen OCT ; le patient est installé devant l'appareil, l'écran de résultats est flou à l'arrière-plan. Clinique ophtalmologique moderne à Abidjan. Aucun texte, aucun logo, aucune marque visible. Visages et mains naturels. Laisser libre le tiers inférieur de l'image.
```

**4. `assurance.jpg`**
```text
Photographie éditoriale réaliste, format portrait 3:4, lumière naturelle douce, palette bleu marine et vert, arrière-plan légèrement flou. Une assistante administrative d'Afrique de l'Ouest vérifie un dossier de prise en charge sur une tablette, un patient attend en arrière-plan, accueil d'une clinique moderne. Aucun texte lisible, aucun logo, aucune marque visible. Visages et mains naturels. Laisser libre le tiers inférieur de l'image.
```

**5. `caisse.jpg`**
```text
Photographie éditoriale réaliste, format portrait 3:4, lumière naturelle douce, palette bleu marine et vert, arrière-plan légèrement flou. Un caissier d'Afrique de l'Ouest encaisse un paiement par téléphone mobile au comptoir d'une clinique, une tablette de caisse posée devant lui. Aucun texte lisible, aucun logo, aucune marque visible. Visages et mains naturels. Laisser libre le tiers inférieur de l'image.
```

**6. `comptabilite.jpg`**
```text
Photographie éditoriale réaliste, format portrait 3:4, lumière naturelle douce, palette bleu marine et vert, arrière-plan légèrement flou. Une comptable d'Afrique de l'Ouest analyse des tableaux sur deux écrans dans un bureau lumineux de clinique ; les écrans sont flous, sans texte lisible. Aucun logo, aucune marque visible. Visages et mains naturels. Laisser libre le tiers inférieur de l'image.
```

**7. `pilotage.jpg`**
```text
Photographie éditoriale réaliste, format portrait 3:4, lumière naturelle douce, palette bleu marine et vert, arrière-plan légèrement flou. La directrice d'une clinique, d'Afrique de l'Ouest, consulte un tableau de bord sur une tablette ; l'équipe médicale en blouse est floue au fond. Aucun texte lisible, aucun logo, aucune marque visible. Visages et mains naturels. Laisser libre le tiers inférieur de l'image.
```

Une fois les fichiers déposés, dites-le-moi : je renseigne `image` et `imageAlt` dans `src/lib/content.ts`.

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

- Hébergement : décidé (au choix du client, cloud ou serveur local). Restent à documenter : sauvegardes selon le mode d'hébergement, chiffrement, disponibilité (SLA)
- Durée de conservation, export des données en fin de contrat, réversibilité
- Utilisation de l'assistant analytique IA : quelles données sont envoyées à quel fournisseur ?
- Utilisation sur mobile / tablette ; connexion instable : décidé (saisie hors ligne puis synchronisation), périmètre exact à documenter
- Formation incluse, import des données et support WhatsApp : décidés. Restent à documenter : délais de mise en route, horaires du support
- Nombre d'utilisateurs inclus, limites de patients ou de médecins par pack
- Premier mois offert et abonnement sans engagement : décidés. Restent à documenter : mode de paiement de l'abonnement, TVA

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
à des directeurs de cliniques, de centres de santé et de cabinets médicaux en Côte d'Ivoire. Structure :
accroche (10 s) sur un problème réel (dossiers dispersés, caisse non rapprochée),
puis un parcours patient en 5 écrans (accueil, consultation, examen, caisse,
comptabilité), puis appel à l'action « Demandez une démonstration ». Phrases courtes,
sans jargon. Pour chaque plan, indique l'écran à filmer. N'annonce aucune fonction
absente de cette liste : [coller la liste des modules de src/lib/features.ts].
```

---

## 7. Référencement (facultatif)

Les pages d'intention (cabinet médical, centre de santé privé, ophtalmologie, rendez-vous, dossier patient, facturation et assurance, saisie hors connexion, page Côte d'Ivoire) et le premier guide existent depuis le 16 octobre 2026 : voir le README, section « Pages ». Le prompt ci-dessous sert à en proposer d'autres.

Le site de référence avait des pages thématiques (`landings.ts`). Pour en créer pour CliniquePro :

```text
Propose 8 pages d'atterrissage SEO pour un logiciel de gestion de clinique, de centre
de santé et de cabinet médical en Côte d'Ivoire (ex. « logiciel cabinet médical Abidjan »,
« facturation tiers payant assurance clinique », une page de niche « logiciel ophtalmologie »). Pour chaque page : slug, balise title
(60 caractères max), meta description (155 max), H1, 3 sections avec intertitres,
3 questions de FAQ. Utilise uniquement les fonctions listées ici : [coller
src/lib/features.ts]. Aucune statistique de marché inventée.
```

---

## 8. Éléments graphiques

- Logo en **SVG** (ou PNG haute définition à fond transparent) : les versions actuelles (`public/images/logo/`) ont été détourées à partir du PNG fourni.
- Favicon définitif (`src/app/icon.png`, `src/app/apple-icon.png`) : actuellement l'icône du bâtiment sur fond blanc.
- Image de partage réseaux sociaux : générée automatiquement (`src/app/opengraph-image.tsx`) ; à remplacer par un visuel dédié si souhaité.
