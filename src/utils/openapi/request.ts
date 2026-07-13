import type { OpenApiMethod } from './getEndpoints';

export type HeaderMap = Record<string, string>;

export type ProxyEndpointMeta = {
  method: string;
  path: string;
};

export type ProxyRequestPayload = {
  method: OpenApiMethod;
  url: string;
  headers: HeaderMap;
  body?: string;
  endpoint?: ProxyEndpointMeta;
};

export type ProxyResponsePayload = {
  ok: boolean;
  status: number;
  statusText: string;
  headers: HeaderMap;
  body: string;
  durationMs: number;
  requestSize: number;
  responseSize: number;
  error?: string;
};
