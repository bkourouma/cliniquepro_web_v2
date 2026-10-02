// Reçoit les demandes de démonstration et les transmet au webhook configuré (n8n, Zapier, etc.).
// L'URL du webhook reste côté serveur : N8N_WEBHOOK_URL (jamais exposée au navigateur).

const FIELDS = ["structure", "volume", "need", "role", "name", "company", "email", "phone"] as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
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

  const webhook = process.env.N8N_WEBHOOK_URL;
  if (!webhook) {
    console.warn("[lead] N8N_WEBHOOK_URL non défini : demande reçue mais non transmise.");
    return Response.json({ ok: true, forwarded: false });
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
