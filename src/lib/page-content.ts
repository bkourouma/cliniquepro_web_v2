// Briques communes aux pages d'intention et aux guides : sections, questions, bloc « prix et mise en route ».
// Les montants viennent de pricing.ts, jamais d'un texte écrit à la main.
//
// Balisage minimal dans les textes : [libellé](/chemin) devient un lien interne ; **gras** n'est pas géré (on évite).

import { fcfa } from "./format";
import { COMBO_DISCOUNT, comboPrice, packs, TRIAL_TEXT } from "./pricing";

export type FaqItem = { q: string; a: string };

export type PriceFocus = "operationnel" | "financier" | "both";

export type Section = {
  h2: string;
  paragraphs?: string[];
  bullets?: string[];
  /** Bloc « prix et mise en route » généré depuis pricing.ts (ajoute ses paragraphes après `paragraphs`). */
  price?: PriceFocus;
};

const [operationnel, financier] = packs;
const hors = (n: number) => `${fcfa(n)} HT par mois`;

/** Paragraphes de prix : tout est lu dans pricing.ts. */
export function priceParagraphs(focus: PriceFocus): string[] {
  const both = comboPrice(packs);
  const included =
    "La formation de votre équipe, l'import de vos données existantes et le support par WhatsApp sont inclus, ainsi que la sauvegarde quotidienne de vos données, assurée par Alliance Consultants.";
  const common = `${TRIAL_TEXT} : vous n'avez pas à vous engager pour essayer. Les prix sont hors taxes, en FCFA ; seul le devis ou le contrat signé fait foi.`;
  if (focus === "operationnel") {
    return [
      `La ${operationnel.name} (${operationnel.audience.toLowerCase()}) coûte ${hors(operationnel.monthly)}. Si vous voulez aussi piloter la caisse, la facturation, les honoraires et la comptabilité dans le même outil, la ${financier.name} s'y ajoute pour ${hors(financier.monthly)}.`,
      `${common} ${included} Le détail des deux packs est sur la page des [tarifs](/tarifs).`,
    ];
  }
  if (focus === "financier") {
    return [
      `La ${financier.name} (${financier.audience.toLowerCase()}) coûte ${hors(financier.monthly)}. Elle se complète avec la ${operationnel.name} (${hors(operationnel.monthly)}), qui couvre le parcours patient, médical et assurance : souscrits ensemble, les deux packs bénéficient de ${Math.round(COMBO_DISCOUNT * 100)} % de remise sur le moins cher, soit ${hors(both.total)} au lieu de ${hors(both.subtotal)}.`,
      `${common} ${included} Le détail des deux packs est sur la page des [tarifs](/tarifs).`,
    ];
  }
  return [
    `Deux packs, publiés sans devis préalable : la ${operationnel.name} à ${hors(operationnel.monthly)} et la ${financier.name} à ${hors(financier.monthly)}. Souscrits ensemble, ils bénéficient de ${Math.round(COMBO_DISCOUNT * 100)} % de remise sur le moins cher : ${hors(both.total)} au lieu de ${hors(both.subtotal)}.`,
    `${common} ${included} Le détail des deux packs est sur la page des [tarifs](/tarifs).`,
  ];
}

/** Prix d'appel pour les descriptions (titre ≤ 155 caractères) : « Dès 25 000 FCFA HT/mois ». */
export const fromPrice = `Dès ${fcfa(Math.min(...packs.map((p) => p.monthly)))} HT/mois`;

/** Retire le balisage des liens : [libellé](/chemin) → libellé (données structurées, comptage de mots). */
export function stripLinks(text: string) {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
}
