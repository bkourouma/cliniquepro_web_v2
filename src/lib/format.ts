/** Montant en FCFA avec espaces insécables : 35 000 FCFA */
export function fcfa(n: number) {
  return `${Math.round(n).toLocaleString("fr-FR").replace(/[  ]/g, " ")} FCFA`;
}

/** Nombre seul, espaces fins remplacés par des espaces ordinaires (rendu identique serveur / client) */
export function num(n: number) {
  return Math.round(n).toLocaleString("fr-FR").replace(/[  ]/g, " ");
}
