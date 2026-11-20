import { prepareBusinessSubmission, confirmBusinessSubmission, submissionDevice } from '@/lib/seo-business-outbox.mjs';
import { createLeadHandler, formReceptionConfigured } from '@/lib/lead-reception-server.mjs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const config = {
  source: 'site-vitrine-cliniquepro',
  sourceId: 'site-form-clinique-v1',
  siteOrigin: 'https://cliniquepro-web.allianceconsultants.net',
  fields: ['structure', 'volume', 'need', 'role', 'name', 'company', 'email', 'phone'],
};
const environment = () => ({
  N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL,
  N8N_WEBHOOK_SECRET: process.env.N8N_WEBHOOK_SECRET,
  N8N_WEBHOOK_TEST_URL: process.env.N8N_WEBHOOK_TEST_URL,
  N8N_WEBHOOK_TEST_SECRET: process.env.N8N_WEBHOOK_TEST_SECRET,
  FORM_RECIPE_AUTH_TOKEN: process.env.FORM_RECIPE_AUTH_TOKEN,
  MC_FORM_SOURCE_ID: process.env.MC_FORM_SOURCE_ID,
});
const receive = createLeadHandler(config, {
  env: environment,
  measure: async (receipt, { request, locale }) => {
    const ticket = await prepareBusinessSubmission({ language: locale, device: submissionDevice(request.headers.get('user-agent')) });
    await confirmBusinessSubmission(ticket, receipt.receiptId);
  },
});

/** Availability exposes no endpoint or credential, and requires the full production configuration. */
export async function GET() {
  return Response.json({ formulaire: formReceptionConfigured(config, environment()) }, { headers: { 'Cache-Control': 'no-store' } });
}
export async function POST(request: Request) { return receive(request); }
