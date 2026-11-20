export interface LeadMetadata { submissionId: string; submittedAt: string }
export interface LeadReceipt { version: 1; accepted: true; sourceId: string; submissionId: string; receiptId: string; receivedAt: string; duplicate: boolean; isTest: boolean }
export function getSubmissionMetadata(source: string, lead: Record<string, unknown>, locale: string, options?: { storage?: Pick<Storage, 'getItem' | 'setItem'>; now?: number }): Promise<LeadMetadata>;
export function readLeadReceipt(value: unknown, expected: { sourceId: string; submissionId: string; isTest: boolean }): LeadReceipt | null;
