# Réception durable des demandes de démonstration

Source fixe : `site-form-clinique-v1`. Le visiteur peut conserver le calendrier existant ou choisir « Préférer être recontacté » dans la modale. Aucun secret ni endpoint N8N n'est envoyé au navigateur.

## Chaîne de réception

`UI → POST /api/lead → workflow N8N dédié et authentifié → boîte de demandes Mission Control`.

Le site n'annonce un enregistrement qu'après un reçu durable corrélé : version1, accepted=true, sourceId, submissionId, receiptId, receivedAt, duplicate et isTest. Une réponse HTTP200 vide ou non corrélée n'est pas un succès. L'absence de configuration répond503 ; l'absence de reçu après les essais répond502, en conservant les champs et l'identité technique pour réessayer. Aucune promesse de rappel sous24h n'est faite par ce reçu.

Le navigateur conserve seulement UUID, date et empreinte pendant24h au plus dans l'onglet. Les coordonnées ne sont pas copiées en sessionStorage. UUID canoniques en minuscules ; une nouvelle tentative du même contenu réutilise la même identité. N8N/MC dédupliquent sans doubler la demande. Trois essais maximum de16s, avec le même corps ; pas de redirection portant les credentials.

## Configuration privée du serveur

- N8N_WEBHOOK_URL et N8N_WEBHOOK_SECRET : entrée production et credential HeaderAuth dédié.
- N8N_WEBHOOK_TEST_URL et N8N_WEBHOOK_TEST_SECRET : entrée recette distincte.
- FORM_RECIPE_AUTH_TOKEN : authentification de recette côté site, distincte des credentials N8N et MC.
- MC_FORM_SOURCE_ID : `site-form-clinique-v1`.

Ces valeurs sont lues à chaque requête par la route serveur et propagées par compose. Elles n'utilisent jamais NEXT_PUBLIC. Les exports de workflow et `.env.example` ne contiennent aucune valeur secrète. Toute rotation doit conserver les correspondances site/workflow/credential, et maintenir une réponse d'erreur explicite si le raccordement n'est pas prêt.

## Recette contrôlée

Le header x-mc-form-test est accepté uniquement s'il correspond au secret serveur. Un header incorrect, même avec honeypot, répond401 ; un champ ou une query publics ne sélectionnent jamais la recette. Le header d'ACK x-mc-form-recipe reflète uniquement le mode déjà authentifié par le serveur. La recette ne prépare ni ne confirme aucune mesure SEO et ne déclenche aucune notification.

Le navigateur de recette ajoute le secret exclusivement par interception du POST same-origin /api/lead ; ne pas utiliser extraHTTPHeaders global, car la modale peut charger Calendly. Les collecteurs analytics et les tiers sont bloqués avant navigation. Les pannes sont injectées dans les tests isolés ou dans la réponse du navigateur après réception, sans désactiver le service production.

La boîte MC est distincte des contacts qualifiés : état NOUVEAU/À TRAITER, sans qualification automatique, e-mail ou WhatsApp. Les tests sont séparés et retenus7jours ; les demandes réelles en cours restent jusqu'au traitement, puis seules les demandes DONE sont supprimées90jours après leur dernière modification.

## Contrôles

`npm test` inclut tests/unit/form-reception.test.ts : ACK, auth, mode test, timeout/retry, doublons, origine/type/taille, délai, rate-limit et metadata privée. `scripts/test-seo-business-hooks.mjs` exerce la vraie route et vérifie les exclusions statistiques. Types, lint, build et parcours UI réels restent des portes de livraison. Les résultats de production doivent être ajoutés seulement après les preuves E2E du coordinateur.
