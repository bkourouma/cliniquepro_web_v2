import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Politique d'accès : site vitrine commercial, donc visible partout, y compris des moteurs de réponse IA
// (ChatGPT, Perplexity, Claude, Gemini) et de l'entraînement des modèles. Pour fermer l'entraînement seulement,
// retirer GPTBot, ClaudeBot, Google-Extended, CCBot, Applebot-Extended et Meta-ExternalAgent de cette liste
// (et les déclarer avec `disallow: "/"`).
const AI_CRAWLERS = [
  // Recherche et réponses en direct
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-SearchBot",
  "Claude-User",
  // Entraînement des modèles
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Meta-ExternalAgent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: "/api/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
