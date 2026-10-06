// /llms.txt : résumé du site en Markdown pour les assistants IA (convention llmstxt.org).
// Généré depuis les mêmes données que les pages (prix, modules, wiki) : il ne peut pas diverger du site.

import { features } from "@/lib/features";
import { fcfa } from "@/lib/format";
import { COMBO_DISCOUNT, packs, TRIAL_TEXT } from "@/lib/pricing";
import { absoluteUrl, contact, legal, SITE_NAME, SITE_UPDATED, social } from "@/lib/site";
import { countItems, wikiDomains, wikiTotal } from "@/lib/wiki";

export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_NAME} est un logiciel web de gestion de clinique ophtalmologique, édité à Abidjan (Côte d'Ivoire) par ${legal.publisher}. Il réunit dans une seule application les patients, l'agenda, les consultations, les examens, les assurances, la facturation, la caisse, les honoraires des médecins et la comptabilité.`,
    "",
    "## Offre et tarifs",
    "",
    ...packs.map((p) => `- **${p.name}** : ${fcfa(p.monthly)} HT par mois. ${p.audience}.`),
    `- ${TRIAL_TEXT}. Les deux packs sont complémentaires : souscrits ensemble, ${Math.round(COMBO_DISCOUNT * 100)} % de remise sur le moins cher des deux.`,
    "- Prix hors taxes, en FCFA, par mois. Seul le devis ou le contrat signé fait foi.",
    "",
    "## Pages principales",
    "",
    `- [Fonctionnalités](${absoluteUrl("/fonctionnalites")}): les ${features.length} modules et le pack qui les couvre`,
    `- [Tarifs](${absoluteUrl("/tarifs")}): détail et comparaison des deux packs`,
    `- [FAQ](${absoluteUrl("/faq")}): packs, essai, assurances, caisse, comptabilité, sécurité`,
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
