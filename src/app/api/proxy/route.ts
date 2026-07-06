import { NextRequest, NextResponse } from 'next/server';
import type {
  HeaderMap,
  ProxyRequestPayload,
  ProxyResponsePayload,
} from '@/utils/openapi/request';

const ALLOWED_METHODS = [
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'options',
  'head',
  'trace',
] as const;

const encoder = new TextEncoder();

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const isAllowedMethod = (
  value: unknown
): value is ProxyRequestPayload['method'] => {
  return (
    typeof value === 'string' &&
    ALLOWED_METHODS.includes(value as ProxyRequestPayload['method'])
  );
};

const normalizeHeaders = (headers: unknown): HeaderMap => {
  if (!isRecord(headers)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(headers).flatMap(([name, value]) => {
      if (typeof value !== 'string' || value.trim().length === 0) {
        return [];
      }

      return [[name, value]];
    })
  );
};

const parsePayload = async (
  request: NextRequest
): Promise<ProxyRequestPayload> => {
  const payload = (await request.json()) as unknown;

  if (!isRecord(payload)) {
    throw new Error('Request payload must be an object');
  }

  if (!isAllowedMethod(payload.method)) {
    throw new Error('Unsupported HTTP method');
  }

  if (typeof payload.url !== 'string') {
    throw new Error('Request URL is required');
  }

  const url = new URL(payload.url);

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Only HTTP and HTTPS URLs are supported');
  }

  return {
    method: payload.method,
    url: url.toString(),
    headers: normalizeHeaders(payload.headers),
    body: typeof payload.body === 'string' ? payload.body : undefined,
  };
};

const createErrorResponse = (
  message: string,
  status = 400
): NextResponse<ProxyResponsePayload> => {
  return NextResponse.json(
    {
      ok: false,
      status,
      statusText: 'Proxy Error',
      headers: {},
      body: '',
      durationMs: 0,
      requestSize: 0,
      responseSize: 0,
      error: message,
    },
    { status }
  );
};

export const POST = async (request: NextRequest) => {
  let payload: ProxyRequestPayload;

  try {
    payload = await parsePayload(request);
  } catch (error) {
    return createErrorResponse(
      error instanceof Error ? error.message : 'Invalid proxy request'
    );
  }

  const method = payload.method.toUpperCase();
  const startedAt = performance.now();

  try {
    const response = await fetch(payload.url, {
      method,
      headers: payload.headers,
      body:
        method === 'GET' || method === 'HEAD' || !payload.body
          ? undefined
          : payload.body,
    });

    const responseBody = await response.text();
    const responseHeaders = Object.fromEntries(response.headers.entries());
    const durationMs = Math.round(performance.now() - startedAt);

    return NextResponse.json<ProxyResponsePayload>({
      ok: true,
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
      durationMs,
      requestSize: encoder.encode(payload.body ?? '').byteLength,
      responseSize: encoder.encode(responseBody).byteLength,
    });
  } catch (error) {
    return createErrorResponse(
      error instanceof Error ? error.message : 'Unable to execute request',
      502
    );
  }
};
