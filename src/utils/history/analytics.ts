import type { RequestHistoryRecord } from '@/utils/supabase/history';

export type HistoryAnalytics = {
  totalRequests: number;
  averageDurationMs: number;
  successRate: number;
  byMethod: Record<string, number>;
  byStatus: Record<string, number>;
};

const isSuccessfulStatus = (status: number): boolean => {
  return status >= 200 && status < 400;
};

export const computeHistoryAnalytics = (
  entries: RequestHistoryRecord[]
): HistoryAnalytics => {
  if (entries.length === 0) {
    return {
      totalRequests: 0,
      averageDurationMs: 0,
      successRate: 0,
      byMethod: {},
      byStatus: {},
    };
  }

  const byMethod: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  let totalDuration = 0;
  let successCount = 0;

  entries.forEach((entry) => {
    byMethod[entry.method] = (byMethod[entry.method] ?? 0) + 1;
    const statusKey = entry.error ? 'error' : String(entry.status);
    byStatus[statusKey] = (byStatus[statusKey] ?? 0) + 1;
    totalDuration += entry.durationMs;

    if (!entry.error && isSuccessfulStatus(entry.status)) {
      successCount += 1;
    }
  });

  return {
    totalRequests: entries.length,
    averageDurationMs: Math.round(totalDuration / entries.length),
    successRate: Math.round((successCount / entries.length) * 100),
    byMethod,
    byStatus,
  };
};
