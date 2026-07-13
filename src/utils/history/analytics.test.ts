import { describe, expect, it } from 'vitest';
import { computeHistoryAnalytics } from '@/utils/history/analytics';
import type { RequestHistoryRecord } from '@/utils/supabase/history';

const createEntry = (
  overrides: Partial<RequestHistoryRecord> = {}
): RequestHistoryRecord => ({
  id: '1',
  method: 'GET',
  url: 'https://api.example.com/users',
  endpointMethod: 'get',
  endpointPath: '/users',
  status: 200,
  durationMs: 100,
  requestSize: 0,
  responseSize: 256,
  error: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('computeHistoryAnalytics', () => {
  it('returns zeroed analytics for empty history', () => {
    expect(computeHistoryAnalytics([])).toEqual({
      totalRequests: 0,
      averageDurationMs: 0,
      successRate: 0,
      byMethod: {},
      byStatus: {},
    });
  });

  it('computes totals and distributions', () => {
    const analytics = computeHistoryAnalytics([
      createEntry({ method: 'GET', status: 200, durationMs: 100 }),
      createEntry({
        id: '2',
        method: 'POST',
        status: 500,
        durationMs: 300,
        error: 'Server error',
      }),
    ]);

    expect(analytics.totalRequests).toBe(2);
    expect(analytics.averageDurationMs).toBe(200);
    expect(analytics.successRate).toBe(50);
    expect(analytics.byMethod).toEqual({ GET: 1, POST: 1 });
    expect(analytics.byStatus).toEqual({ '200': 1, error: 1 });
  });
});
