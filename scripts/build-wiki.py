#!/usr/bin/env python3
"""Génère src/lib/wiki/wiki.generated.json à partir de l'inventaire Excel des fonctionnalités.

Usage : python scripts/build-wiki.py docs/sources/OphtaClinic_Wiki_Fonctionnalites.xlsx
Dépendance : openpyxl.

Le wiki est destiné aux visiteurs : on ne garde que les domaines métier, on retire les codes internes,
les routes, les noms de permissions et les lignes purement techniques. Ce qui est en cours de
développement est signalé comme tel (jamais de date).
"""
import json, re, sys, unicodedata
from collections import OrderedDict
import openpyxl

SRC = sys.argv[1] if len(sys.argv) > 1 else "docs/sources/OphtaClinic_Wiki_Fonctionnalites.xlsx"
OUT = "src/lib/wiki/wiki.generated.json"

# Domaine du classeur -> domaine public
DOMAIN_MAP = {
    "Patients": "patients",
    "Réception / Accueil patient": "reception",
    "Clinique médicale": "clinique",
    "Constantes (signes vitaux)": "clinique",
    "Assurances": "assurances",
    "Médecins": "medecins",
    "Spécialités": "medecins",
    "Argent": "argent",
    "Documents et impressions": "documents",
    "Communication": "communication",
    "Tableau de bord": "pilotage",
    "Analyse IA (stats-ia)": "pilotage",
    "Administration de la clinique": "administration",
}

DOMAINS = [
    ("patients", "Patients", "Un dossier administratif unique par patient : identité, contacts, assurances, historique.", "operationnel"),
    ("reception", "Réception et accueil", "L'arrivée du patient, les prestations du jour, le lien avec l'assurance, la consultation et la caisse.", "operationnel"),
    ("clinique", "Clinique médicale", "Consultations, examens, dossiers médicaux, constantes, ordonnances, certificats et rendez-vous.", "operationnel"),
    ("assurances", "Assurances et prise en charge", "Catalogue des assurances, validation des prises en charge, portail assureur sécurisé.", "operationnel"),
    ("medecins", "Médecins et spécialités", "Référentiel des médecins, spécialités, plannings et profils d'impression.", "operationnel"),
    ("argent", "Caisse, facturation et comptabilité", "Prestations et tarifs, facturation, caisse, honoraires des médecins et comptabilité.", "financier"),
    ("documents", "Documents et impressions", "Centre d'impression, papier à en-tête, gabarits et aperçus des documents.", "commun"),
    ("communication", "Communication", "Messagerie WhatsApp et notifications automatiques.", "commun"),
    ("pilotage", "Pilotage et analyse", "Tableaux de bord par rôle, statistiques et assistant analytique.", "commun"),
    ("administration", "Administration de la clinique", "Utilisateurs, journal d'audit et configuration.", "commun"),
]

# Pack par module quand il diffère de celui du domaine
MODULE_PACK = {
    ("argent", "Prestations"): "operationnel",
}

MODULE_RENAME = {
    "Constantes": "Constantes (signes vitaux)",
    "Approbations assurance (compte connecté)": "Approbations assurance",
    "Portail assureur (validation par jeton)": "Portail assureur",
    "Réceptions (dossiers d'accueil)": "Dossiers d'accueil",
}

ROLES = {
    "ADMIN": "Administrateur", "DOCTOR": "Médecin", "NURSE": "Infirmier(ère)", "SECRETARY": "Secrétaire",
    "ORTHOPTIST": "Orthoptiste", "LAB_TECHNICIAN": "Technicien d'examens", "CAISSIERE": "Caissier(ère)",
    "STAFF": "Personnel", "COMPTA": "Comptabilité", "OWNER": "Direction", "INSURANCE": "Assureur",
    "AUDITOR": "Auditeur (lecture seule)", "SUPER_ADMIN": "",
}

TECH = re.compile(r"(/[a-z\[_]|\b(navigateur|paramètre|sessionstorage|localstorage|aucun appel|stubs?|branche|commit|plafond|requête|champ piège|limiteur|debounce|différé|cache|pagin\w+ côté|api|jwt|json|csv ?\(|cookie|httponly|smtp|endpoint|route|prisma|sql|webhook|middleware|backfill|stub|tenantid|isactive|insuranceid|payload|http|uuid|sha-?256|migration|cron|docker|ci/cd|npm|redis))", re.I)
ENUM = re.compile(r"\b[A-Z][A-Z0-9]{2,}(?:_[A-Z0-9]+)+\b")
ENUM_PAREN = re.compile(r"\s*\([^()]*\b[A-Z][A-Z0-9]{2,}(?:_[A-Z0-9]+)+[^()]*\)")


def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def clean(s):
    s = (s or "").strip()
    s = ENUM_PAREN.sub("", s)
    s = ENUM.sub("", s)
    s = s.replace("(tenant)", "").replace("tenant", "clinique")
    s = re.sub(r"\s{2,}", " ", s).replace(" ,", ",").replace(" .", ".").strip(" ;,")
    return s


def roles(raw):
    out = []
    for tok in re.split(r"[,;]", raw or ""):
        t = tok.strip()
        if t in ROLES:
            if ROLES[t] and ROLES[t] not in out:
                out.append(ROLES[t])
    return out


wb = openpyxl.load_workbook(SRC)
rows = [r for r in list(wb["Sous-fonctionnalites"].iter_rows(values_only=True))[1:] if r[0]]

data = OrderedDict((d[0], OrderedDict()) for d in DOMAINS)
kept = dropped = 0
for r in rows:
    dom = DOMAIN_MAP.get(r[0])
    portal = r[10] or ""
    mod_raw = r[2] or ""
    if re.search(r"\((API|assess|SMTP)\)|Évaluations|Route no-insurance|Aides à la saisie", mod_raw):
        dropped += 1
        continue
    if not dom or not (portal.startswith(("Clinique", "Assureur", "Portail assureur")) or (dom == "assurances" and portal == "Public")):
        dropped += 1
        continue
    module, feature, title, goal = clean(r[2]), clean(r[3]), clean(r[4]), clean(r[5])
    module = MODULE_RENAME.get(module, module)
    if not (title and goal) or TECH.search(title + " " + goal) or "/api" in (r[11] or "") and not portal.startswith("Clinique"):
        dropped += 1
        continue
    status = "developpement" if (r[13] or "").startswith("En développement") else "disponible"
    menu = (r[14] or "").strip()
    menu = "" if menu.startswith(("(", "/", "Aucun")) or "hors menu" in menu or "hors groupe" in menu else menu.replace(" > ", " › ")
    mods = data[dom].setdefault(module, OrderedDict())
    feats = mods.setdefault(feature, [])
    item = {"title": title, "goal": goal, "status": status}
    p = roles(r[9])
    if p:
        item["profiles"] = p
    if menu:
        item["menu"] = menu
    feats.append(item)
    kept += 1

domains = []
for sl, title, summary, pack in DOMAINS:
    modules = []
    for mname, feats in data[sl].items():
        modules.append({
            "slug": slug(mname),
            "title": mname,
            "pack": MODULE_PACK.get((sl, mname), pack),
            "features": [{"title": f, "items": items} for f, items in feats.items()],
        })
    domains.append({"slug": sl, "title": title, "summary": summary, "pack": pack, "modules": modules})

with open(OUT, "w", encoding="utf-8") as fh:
    json.dump({"updatedOn": "2 octobre 2026", "domains": domains}, fh, ensure_ascii=False, indent=1)
print(f"{kept} sous-fonctionnalités retenues, {dropped} écartées")
for d in domains:
    print(d["slug"], sum(len(f["items"]) for m in d["modules"] for f in m["features"]), [m["title"] for m in d["modules"]])
