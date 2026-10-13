// Reçoit les demandes de démonstration et les transmet au webhook configuré (n8n, Zapier, etc.).
// L'URL du webhook reste côté serveur : N8N_WEBHOOK_URL (jamais exposée au navigateur).
// Sans webhook, rien ne peut être transmis : la route refuse la demande (503) au lieu de la perdre en silence,
// et le formulaire n'est pas proposé (voir GET ci-dessous et components/demo-modal.tsx).

import { contact } from "@/lib/site";

// Lu à chaque requête, jamais figé au build : l'URL du webhook se règle sur le serveur, sans reconstruire le site.
export const dynamic = "force-dynamic";

const FIELDS = ["structure", "volume", "need", "role", "name", "company", "email", "phone"] as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Dit au navigateur si le formulaire peut être proposé (webhook configuré). Ne renvoie jamais l'URL. */
export async function GET() {
  return Response.json({ formulaire: Boolean(process.env.N8N_WEBHOOK_URL) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const webhook = process.env.N8N_WEBHOOK_URL;
  if (!webhook) {
    return Response.json(
      { error: `Le formulaire n'est pas disponible pour le moment. Écrivez-nous à ${contact.email} ou sur WhatsApp.` },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }

  // Champ piège rempli = robot : on répond « ok » sans rien transmettre
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  const lead: Record<string, string> = {};
  for (const f of FIELDS) {
    const v = body[f];
    if (typeof v !== "string" || v.trim() === "" || v.length > 200) {
      return Response.json({ error: `Champ manquant ou invalide : ${f}` }, { status: 400 });
    }
    lead[f] = v.trim();
  }
  if (!EMAIL.test(lead.email)) {
    return Response.json({ error: "E-mail invalide" }, { status: 400 });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, source: "site-vitrine-cliniquepro", receivedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Le webhook a répondu ${res.status}`);
  } catch (err) {
    console.error("[lead] Échec de transmission :", err);
    return Response.json({ error: "Transmission impossible" }, { status: 502 });
  }

  return Response.json({ ok: true, forwarded: true });
}
