import type { RoleId } from "./content";

export const ROLE_EVENT = "cliniquepro:select-role";

/** Défilement fluide vers une ancre, sans rechargement. « #roles-caisse » ouvre aussi l'onglet correspondant. */
export function goTo(href: string) {
  if (!href.startsWith("#")) return;
  let target = href.slice(1);
  const role = target.match(/^roles-(direction|medecin|accueil|caisse)$/)?.[1] as RoleId | undefined;
  if (role) {
    window.dispatchEvent(new CustomEvent<RoleId>(ROLE_EVENT, { detail: role }));
    target = "roles";
  }
  document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${target}`);
}
