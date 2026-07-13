import type { SupabaseClient } from '@supabase/supabase-js';

export type RequestHistoryRecord = {
  id: string;
  method: string;
  url: string;
  endpointMethod: string | null;
  endpointPath: string | null;
  status: number;
  durationMs: number;
  requestSize: number;
  responseSize: number;
  error: string | null;
  createdAt: string;
};

export type RequestHistoryInsert = {
  method: string;
  url: string;
  endpointMethod?: string;
  endpointPath?: string;
  status: number;
  durationMs: number;
  requestSize: number;
  responseSize: number;
  error?: string;
};

export const recordRequestHistory = async (
  supabase: SupabaseClient,
  userId: string,
  entry: RequestHistoryInsert
): Promise<void> => {
  await supabase.from('request_history').insert({
    user_id: userId,
    method: entry.method,
    url: entry.url,
    endpoint_method: entry.endpointMethod ?? null,
    endpoint_path: entry.endpointPath ?? null,
    status: entry.status,
    duration_ms: entry.durationMs,
    request_size: entry.requestSize,
    response_size: entry.responseSize,
    error: entry.error ?? null,
  });
};

export const getRequestHistory = async (
  supabase: SupabaseClient,
  userId: string,
  limit = 100
): Promise<RequestHistoryRecord[]> => {
  const { data, error } = await supabase
    .from('request_history')
    .select(
      'id, method, url, endpoint_method, endpoint_path, status, duration_ms, request_size, response_size, error, created_at'
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    method: row.method,
    url: row.url,
    endpointMethod: row.endpoint_method,
    endpointPath: row.endpoint_path,
    status: row.status,
    durationMs: row.duration_ms,
    requestSize: row.request_size,
    responseSize: row.response_size,
    error: row.error,
    createdAt: row.created_at,
  }));
};
