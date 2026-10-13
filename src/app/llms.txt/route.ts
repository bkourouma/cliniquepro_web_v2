// /llms.txt : résumé du site en Markdown pour les assistants IA (convention llmstxt.org).
// Généré depuis les mêmes données que les pages (prix, modules, wiki, positionnement) : il ne peut pas diverger du site.

import { features } from "@/lib/features";
import { fcfa } from "@/lib/format";
import { COMBO_DISCOUNT, packs, TRIAL_TEXT } from "@/lib/pricing";
import { AUDIENCE, DATA_LAW, EXTRA_CAPABILITIES, NOT_COVERED, PUBLISHED_BY, SERVICE_POINTS } from "@/lib/positionnement";
import { absoluteUrl, contact, legal, SITE_NAME, SITE_UPDATED, social } from "@/lib/site";
import { countItems, wikiDomains, wikiTotal } from "@/lib/wiki";

export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_NAME} est un logiciel web de gestion pour ${AUDIENCE}, toutes spécialités, édité à Abidjan (Côte d'Ivoire) par ${legal.publisher}. Il réunit dans une seule application les patients, l'agenda, les consultations, les examens, l'assurance, la facturation, la caisse, les honoraires des médecins et la comptabilité. L'ophtalmologie est la spécialité la plus détaillée.`,
    "",
    `${PUBLISHED_BY}. Pour le distinguer des logiciels de nom proche ou identique : éditeur ${legal.publisher} (Abidjan), site ${absoluteUrl("/").replace("https://", "")}.`,
    "",
    "## Pour qui",
    "",
    `- ${AUDIENCE.charAt(0).toUpperCase()}${AUDIENCE.slice(1)}, de toutes spécialités. Côte d'Ivoire d'abord.`,
    "- Modèles de consultation paramétrables pour toutes les spécialités ; l'ophtalmologie (acuité, pression intraoculaire, réfraction, fond d'œil, OCT, champ visuel, biométrie, ordonnances de lunettes) est la plus détaillée.",
    "",
    "## Ce que fait CliniquePro",
    "",
    ...features.map((f) => `- ${f.title} : ${f.summary}`),
    ...EXTRA_CAPABILITIES.map((c) => `- ${c}`),
    "- Les fonctions d'intelligence artificielle sont optionnelles, reposent sur un service tiers et servent d'aide : elles ne posent aucun diagnostic.",
    "",
    "## Ce que CliniquePro ne fait pas",
    "",
    `- ${NOT_COVERED.map((n, i) => (i === 0 ? n.charAt(0).toUpperCase() + n.slice(1) : n)).join(", ")} : ces trois domaines ne sont pas couverts (le catalogue de médicaments sert à rédiger les ordonnances).`,
    "",
    "## Offre et tarifs",
    "",
    ...packs.map((p) => `- **${p.name}** : ${fcfa(p.monthly)} HT par mois. ${p.audience}.`),
    `- ${TRIAL_TEXT}. Les deux packs sont complémentaires : souscrits ensemble, ${Math.round(COMBO_DISCOUNT * 100)} % de remise sur le moins cher des deux.`,
    `- ${SERVICE_POINTS.join(" ; ")}.`,
    "- Prix hors taxes, en FCFA, par mois. Seul le devis ou le contrat signé fait foi.",
    "",
    "## Données et conformité",
    "",
    "- Hébergement au choix du client : cloud ou serveur local installé dans la clinique.",
    "- Saisie possible hors connexion (par exemple consultations et paiements), puis synchronisation au retour du réseau.",
    `- Respect de la ${DATA_LAW}.`,
    "",
    "## Pages principales",
    "",
    `- [Fonctionnalités](${absoluteUrl("/fonctionnalites")}): les ${features.length} modules et le pack qui les couvre`,
    `- [Tarifs](${absoluteUrl("/tarifs")}): détail et comparaison des deux packs`,
    `- [FAQ](${absoluteUrl("/faq")}): packs, structures concernées, spécialités, hors connexion, hébergement, assurance, caisse, ce que CliniquePro ne fait pas`,
    `- [À propos](${absoluteUrl("/a-propos")}): qui édite CliniquePro, à qui il s'adresse, ce qu'il couvre et ce qui est encore en développement`,
    `- [Contact et démonstration](${absoluteUrl("/contact")}): démonstration de 30 minutes`,
    "",
    `## Wiki des fonctionnalités (${wikiTotal} actions détaillées)`,
    "",
    ...wikiDomains.map((d) => `- [${d.title}](${absoluteUrl(`/wiki/${d.slug}`)}): ${d.summary} (${countItems(d)} actions)`),
    "",
    "## Informations légales et contact",
    "",
    `- [Mentions légales](${absoluteUrl("/mentions-legales")}) · [Confidentialité](${absoluteUrl("/confidentialite")})`,
    `- Éditeur : ${legal.publisher} (RCCM ${legal.rccm}), ${contact.city}`,
    `- Téléphone / WhatsApp : ${contact.phone} · E-mail : ${contact.email}`,
    `- Page Facebook : ${social.facebook}`,
    `- Dernière mise à jour du contenu : ${SITE_UPDATED}`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
