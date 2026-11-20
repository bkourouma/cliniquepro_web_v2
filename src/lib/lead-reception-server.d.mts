export interface LeadReceipt { version: 1; accepted: true; sourceId: string; submissionId: string; receiptId: string; receivedAt: string; duplicate: boolean; isTest: boolean }
export interface LeadHandlerConfig { source: string; sourceId: string; siteOrigin: string; fields: readonly string[] }
export interface LeadHandlerDependencies { env?: () => Record<string, string | undefined>; now?: () => number; sleep?: (ms: number) => Promise<void>; fetch?: typeof fetch; measure?: (receipt: LeadReceipt, context: { request: Request; locale: 'fr' | 'en' }) => Promise<void> }
export function formReceptionConfigured(config: LeadHandlerConfig, env?: Record<string, string | undefined>): boolean;
export function createLeadHandler(config: LeadHandlerConfig, dependencies?: LeadHandlerDependencies): (request: Request) => Promise<Response>;
