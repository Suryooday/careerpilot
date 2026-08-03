import { PipelineStage } from '../types/crm';

/**
 * Normalizes any raw CSV or API stage string into one of the 7 official PipelineStages.
 */
export function normalizePipelineStage(rawStage?: string): PipelineStage {
  if (!rawStage || typeof rawStage !== 'string') return 'Companies';

  const clean = rawStage.trim().toLowerCase();

  if (clean.includes('draft')) return 'Mail Drafted';
  if (clean.includes('sent') || clean.includes('applied') || clean.includes('submit')) return 'Mail Sent';
  if (clean.includes('response') || clean.includes('recieved') || clean.includes('received') || clean.includes('reply')) return 'Response Recieved';
  if (clean.includes('interview') || clean.includes('screen') || clean.includes('round')) return 'Interview';
  if (clean.includes('accepted') || clean.includes('offer') || clean.includes('hired')) return 'Accepted';
  if (clean.includes('closed') || clean.includes('reject') || clean.includes('archive')) return 'Closed Selection';

  // Default fallback
  return 'Companies';
}
