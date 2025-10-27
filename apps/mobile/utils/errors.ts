import { MockOfflineError } from '../services/mockApi';

export function isOfflineError(error: unknown): boolean {
  if (!error) return false;
  if (error instanceof MockOfflineError) return true;
  if (typeof error === 'object' && 'code' in (error as Record<string, unknown>)) {
    return (error as { code?: string }).code === 'OFFLINE';
  }
  return false;
}
