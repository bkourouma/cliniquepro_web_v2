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


# --- Libellés français à la place des codes techniques --------------------------------------------------------
# L'inventaire source est écrit pour les développeurs : statuts (IN_PROGRESS), champs (deletedAt), composants, etc.
# Ces règles les remplacent par des mots français AVANT la suppression générique des codes en majuscules (ENUM),
# qui sinon laisserait des phrases trouées. Les règles précises passent d'abord, puis la table des statuts.
PHRASES = [
    (r"\s*\(force=true\)", ""),
    (r"; désactivable par \w+=false", "; désactivable"),
    (r"\s*\((?:tag )?AUTO_CANCELLED_72H\)", ""),
    (r"\(409 TEMPLATE_IN_USE sinon\)", "(refusé sinon)"),
    (r"Marquer le certificat imprimé \(PENDING_PRINT vers PRINTED, compteur d'impressions\)", "Marquer le certificat comme imprimé (avec compteur d'impressions)"),
    (r"Traduire les codes \([^)]*\) en français", "Afficher les erreurs en français"),
    (r"Méthodes CARD, BANK_TRANSFER, CHECK, INSURANCE_DIRECT à l'écran", "Autres moyens de paiement à l'écran d'encaissement"),
    (r"Proposer les 4 autres méthodes dans", "Proposer les 4 autres moyens (carte, virement, chèque, paiement direct par l'assurance) dans"),
    (r"Mode \(CASH, MOBILE_MONEY, CARD, BANK_TRANSFER, CHECK\)", "Mode (espèces, mobile money, carte, virement, chèque)"),
    (r"NURSE : ([^;]*); ORTHOPTIST et LAB_TECHNICIAN :", r"Infirmier(ère) : \1; orthoptiste et technicien d'examens :"),
    (r"\s*\(gravité high\)", " (gravité élevée)"),
    (r"\s*\(gravité medium\)", " (gravité moyenne)"),
    (r"\s*\(gravité critical\)", " (gravité critique)"),
    (r"\s*\(gravité info\)", " (gravité d'information)"),
    (r"les patients ARCHIVED sont masqués", "les patients archivés sont masqués"),
    (r"statut ARCHIVED", "statut « archivé »"),
    (r"la réception est APPROVED d'office", "la réception est approuvée d'office"),
    (r"de DRAFT à SENT", "de « brouillon » à « envoyé »"),
    (r"tant que DRAFT", "tant qu'il est en brouillon"),
    (r"refusé si la consultation est COMPLETED", "refusé si la consultation est terminée"),
    (r"Passer la consultation à COMPLETED après enregistrement \(idempotent\)", "Marquer la consultation comme terminée après enregistrement (sans effet si elle l'est déjà)"),
    (r"Clôturer en COMPLETED les consultations IN_PROGRESS", "Clôturer (statut « terminée ») les consultations en cours"),
    (r"\(job vers minuit", "(traitement planifié vers minuit"),
    (r"Annuler une consultation en cours \(CANCELLED\)", "Annuler une consultation en cours"),
    (r"Annulation logique \(CANCELLED\)", "Annulation logique (statut « annulé »)"),
    (r"passer l'examen en COMPLETED", "marquer l'examen comme terminé"),
    (r"les examens COMPLETED du patient", "les examens terminés du patient"),
    (r"Faire évoluer PENDING, APPROVED, REJECTED, COMPLETED, CANCELLED selon", "Faire évoluer le statut (en attente, approuvé, rejeté, terminé, annulé) selon"),
    (r"\(COMPLETED, CANCELLED, NO_SHOW sont terminaux\)", "(terminé, annulé et absent sont des statuts finaux)"),
    (r"statut RESCHEDULED", "statut « reporté »"),
    (r"Passer des lignes en INVOICED \(", "Marquer des lignes comme facturées ("),
    (r"ou PAID \(date de paiement\)", "ou payées (date de paiement)"),
    (r"Passer une prestation en INVOICED ou PAID", "Marquer une prestation comme facturée ou payée"),
    (r"Assurance spéciale NO_INS", "Assurance « sans assurance »"),
    (r"la compagnie système NO_INS", "la compagnie système « sans assurance »"),
    (r"\s*\(code USR-hash\)", ""),
    (r"une entrée \(IN\) ou sortie \(OUT\)", "une entrée ou une sortie"),
    (r"\(défaut XOF\)", "(défaut : franc CFA)"),
    (r"\s*\(HTML\.xls\)", ""),
    (r"\s*\(jsPDF\)", ""),
    (r"\bpar ID\b", "par identifiant"),
    (r"\bson ID\b", "son identifiant"),
    (r"\(patientId en URL ou depuis la fiche patient\)", "(ou ouvrir directement depuis la fiche patient)"),
    (r" dans l'URL", ""),
    (r"passables par l'URL", "pouvant être préremplis"),
    (r"Marquer un dossier supprimé \(deletedAt\)", "Marquer un dossier comme supprimé (suppression logique)"),
    (r"\(enregistré dans chiefComplaint et hpi\)", "(enregistré comme motif et histoire de la maladie)"),
    (r"\(actives, ou toutes avec includeInactive\)", "(actives, ou toutes, y compris inactives)"),
    (r"Aide contextuelle expliquant schemaJson et uiJson", "Aide contextuelle expliquant la structure et l'affichage d'un modèle"),
    (r"Onglet Modèles \(schemaJson, uiJson, statut, version\)", "Onglet Modèles (structure, affichage, statut, version)"),
    (r"Composant PrestationSelector", "Sélecteur de prestations"),
    (r"Composant FileDuJour", "File du jour"),
    (r"PatientContextBar \(", "Bandeau patient ("),
    (r"\s*\(MedicineManager\)", ""),
    (r"Fenêtre VisionPrescriptionModal", "Fenêtre de l'ordonnance de lunettes"),
    (r"printableDocument \(", "Document imprimable ("),
    (r"\s*\(DoctorSchedule\)", ""),
    (r"et mettre à jour photoUrl", "et l'associer au profil du médecin"),
    (r"Schéma PaymentUpdateSchema défini \(statut, notes\)", "Statut et notes modifiables sur un paiement"),
    (r"Mise à jour de paiement \(schéma\)", "Mise à jour d'un paiement"),
    (r"Marquer insuranceApproved = true sur la prestation de réception", "Marquer la prestation de réception comme approuvée par l'assurance"),
    (r"\s*\(DataRetentionPolicy\) créées à l'amorçage", " des données"),
    (r"cleanupOldAuditTrails \(plus d'un an\)", "Purge du journal d'audit ancien (plus d'un an)"),
    (r"code technique MAJUSCULES", "code technique en majuscules"),
    (r"Indicateurs MÉDECIN", "Indicateurs du médecin"),
    (r"Indicateurs SECRÉTAIRE", "Indicateurs de la secrétaire"),
    (r"Indicateurs INFIRMIER / ORTHOPTISTE / TECHNICIEN LABO", "Indicateurs de l'infirmier, de l'orthoptiste et du technicien d'examens"),
    (r"Indicateurs CAISSIÈRE", "Indicateurs du caissier"),
    (r"Indicateurs PROPRIÉTAIRE", "Indicateurs de la direction"),
    (r"Indicateurs ADMIN", "Indicateurs de l'administrateur"),
    (r"Widgets ADMIN", "Widgets de l'administrateur"),
    (r"Indicateurs COMPTA", "Indicateurs de la comptabilité"),
    (r"Indicateurs STAFF", "Indicateurs du personnel"),
    (r"Tableau de bord AUDITOR", "Tableau de bord de l'auditeur"),
    (r"Le rôle AUDITOR a", "Le rôle d'auditeur a"),
    (r"Lecture seule pour OWNER et AUDITOR", "Lecture seule pour la direction et l'auditeur"),
]
CONTROLS = {
    "MISSING_PAYMENT_ENTRIES": "des encaissements sans écriture",
    "MISSING_REFUND_ENTRIES": "des remboursements sans écriture",
    "MISSING_CASH_DISCREPANCY_ENTRIES": "des écarts de caisse sans écriture",
    "MISSING_DOCTOR_PAYMENT_ENTRIES": "des honoraires sans écriture",
    "MISSING_EXPENSE_ENTRIES": "des dépenses sans écriture",
    "EXPENSES_SELF_APPROVED": "des dépenses approuvées par leur saisisseur",
    "EXPENSES_DUPLICATE_SUSPECTED": "des dépenses en double",
    "EXPENSES_UNPAID_OLD": "des dépenses approuvées non payées",
    "PAYABLES_RECONCILIATION": "du rapprochement des dettes fournisseurs",
    "ORPHAN_ENTRIES": "des écritures orphelines",
    "JOURNAL_NUMBER_GAPS": "de la numérotation du journal",
    "UNBALANCED_ENTRIES": "des écritures déséquilibrées",
    "PERIOD_INTEGRITY": "de l'intégrité des périodes clôturées",
    "TREASURY_RECONCILIATION": "du rapprochement de trésorerie",
    "REFUNDS_SELF_APPROVED": "des remboursements sans séparation des tâches",
    "ENTRY_REVERSED_BY_CREATOR": "des contre-passations faites par leur auteur",
    "PAYMENTS_DELETED": "des paiements supprimés",
    "CASH_DISCREPANCIES": "des écarts de caisse à la clôture",
    "CASH_CHANGE_NOT_DEDUCTED": "des écarts faussés par la monnaie rendue",
    "STALE_OPEN_CASH_SESSIONS": "des caisses restées ouvertes",
    "PAYMENTS_OFF_HOURS": "des encaissements hors horaires",
    "MANUAL_ENTRIES": "des écritures manuelles",
}
# Statuts et rôles restants : mot français équivalent (les plus longs d'abord).
TOKENS = {
    "IN_PROGRESS": "en cours", "NO_SHOW": "absent", "COMPLETED": "terminé", "CANCELLED": "annulé", "SCHEDULED": "planifié",
    "CONFIRMED": "confirmé", "RESCHEDULED": "reporté", "DRAFT": "brouillon", "SENT": "envoyé", "APPROVED": "approuvé",
    "REJECTED": "rejeté", "PARTIAL": "partiellement approuvé", "PENDING": "en attente", "PUBLISHED": "publié",
    "ARCHIVED": "archivé", "OPEN": "ouverte", "INVOICED": "facturé", "PAID": "payé", "INSURANCE": "assureur",
    "ADMIN": "administrateur", "COMPTA": "comptabilité", "OWNER": "direction", "AUDITOR": "auditeur", "STAFF": "personnel",
    "NURSE": "infirmier(ère)", "ORTHOPTIST": "orthoptiste", "MAJUSCULES": "majuscules", "CHECK": "chèque",
}
TOKEN_RE = re.compile(r"(?<![A-Za-z_])(" + "|".join(sorted(TOKENS, key=len, reverse=True)) + r")(?![A-Za-z_])")


def humanize(s):
    """Remplace les codes techniques par des libellés français (voir PHRASES, CONTROLS, TOKENS)."""
    m = re.match(r"^Contrôle ([A-Z_]+)$", s)
    if m and m.group(1) in CONTROLS:
        return "Contrôle " + CONTROLS[m.group(1)]
    for pat, rep in PHRASES:
        s = re.sub(pat, rep, s)
    return TOKEN_RE.sub(lambda t: TOKENS[t.group(1)], s)


def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def clean(s):
    s = humanize((s or "").strip())
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
    if re.search(r"ANTHROPIC|backend", (r[4] or "") + " " + (r[5] or "")):
        dropped += 1
        continue
    if not (title and goal) or TECH.search(title + " " + goal) or "/api" in (r[11] or "") and not portal.startswith("Clinique"):
        dropped += 1
        continue
    status = "developpement" if (r[13] or "").startswith("En développement") else "disponible"
    menu = humanize((r[14] or "").strip())
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
