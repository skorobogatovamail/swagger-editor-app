'use client';

import { useMemo, useState } from 'react';
import type {
  OpenApiEndpoint,
  OpenApiParameter,
  ParameterLocation,
} from '@/utils/openapi/getEndpoints';
import { generateCurl } from '@/utils/openapi/generateCurl';
import type {
  HeaderMap,
  ProxyRequestPayload,
  ProxyResponsePayload,
} from '@/utils/openapi/request';
import { ResponsePanel } from './ResponsePanel';

type RequestFormProps = {
  endpoint: OpenApiEndpoint;
};

type ParameterValues = Record<string, string>;

const PARAMETER_LOCATIONS: ParameterLocation[] = [
  'path',
  'query',
  'header',
  'cookie',
];

const getParameterKey = (parameter: OpenApiParameter): string => {
  return `${parameter.in}:${parameter.name}`;
};

const getInitialParameterValues = (
  parameters: OpenApiParameter[]
): ParameterValues => {
  return Object.fromEntries(
    parameters.map((parameter) => {
      const example =
        typeof parameter.example === 'string' ? parameter.example : '';

      return [getParameterKey(parameter), example];
    })
  );
};

const getRequestBodyExample = (endpoint: OpenApiEndpoint): string => {
  const firstContent = endpoint.requestBody?.content[0];

  if (!firstContent) {
    return '';
  }

  if (firstContent.example !== undefined) {
    return typeof firstContent.example === 'string'
      ? firstContent.example
      : JSON.stringify(firstContent.example, null, 2);
  }

  return '';
};

const joinBaseUrlAndPath = (baseUrl: string, path: string): string => {
  if (!baseUrl.trim()) {
    return path;
  }

  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

const replacePathParameters = (
  path: string,
  parameters: OpenApiParameter[],
  values: ParameterValues
): string => {
  return parameters.reduce((resolvedPath, parameter) => {
    const value = values[getParameterKey(parameter)];

    if (!value) {
      return resolvedPath;
    }

    return resolvedPath.replaceAll(
      `{${parameter.name}}`,
      encodeURIComponent(value)
    );
  }, path);
};

const appendQueryParameters = (
  url: string,
  parameters: OpenApiParameter[],
  values: ParameterValues
): string => {
  const [base, existingQuery = ''] = url.split('?');
  const searchParams = new URLSearchParams(existingQuery);

  parameters.forEach((parameter) => {
    const value = values[getParameterKey(parameter)];

    if (value) {
      searchParams.set(parameter.name, value);
    }
  });

  const query = searchParams.toString();

  return query ? `${base}?${query}` : base;
};

const buildHeaders = (
  endpoint: OpenApiEndpoint,
  parameterValues: ParameterValues,
  requestBody: string
): HeaderMap => {
  const headers: HeaderMap = {};

  endpoint.parametersByLocation.header.forEach((parameter) => {
    const value = parameterValues[getParameterKey(parameter)];

    if (value) {
      headers[parameter.name] = value;
    }
  });

  const cookies = endpoint.parametersByLocation.cookie
    .map((parameter) => {
      const value = parameterValues[getParameterKey(parameter)];

      return value ? `${parameter.name}=${value}` : null;
    })
    .filter((cookie): cookie is string => Boolean(cookie));

  if (cookies.length > 0) {
    headers.Cookie = cookies.join('; ');
  }

  const firstContentType = endpoint.requestBody?.content[0]?.contentType;

  if (requestBody.trim() && firstContentType && !headers['Content-Type']) {
    headers['Content-Type'] = firstContentType;
  }

  return headers;
};

const buildRequest = (
  endpoint: OpenApiEndpoint,
  baseUrl: string,
  parameterValues: ParameterValues,
  requestBody: string
): ProxyRequestPayload => {
  const path = replacePathParameters(
    endpoint.path,
    endpoint.parametersByLocation.path,
    parameterValues
  );
  const urlWithoutQuery = joinBaseUrlAndPath(baseUrl, path);
  const url = appendQueryParameters(
    urlWithoutQuery,
    endpoint.parametersByLocation.query,
    parameterValues
  );

  return {
    method: endpoint.method,
    url,
    headers: buildHeaders(endpoint, parameterValues, requestBody),
    body: requestBody.trim() ? requestBody : undefined,
  };
};

export const RequestForm = ({ endpoint }: RequestFormProps) => {
  const [baseUrl, setBaseUrl] = useState(endpoint.serverUrls[0] ?? '');
  const [parameterValues, setParameterValues] = useState<ParameterValues>(() =>
    getInitialParameterValues(endpoint.parameters)
  );
  const [requestBody, setRequestBody] = useState(() =>
    getRequestBodyExample(endpoint)
  );
  const [response, setResponse] = useState<ProxyResponsePayload | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copyState, setCopyState] = useState<string | null>(null);

  const request = useMemo(
    () => buildRequest(endpoint, baseUrl, parameterValues, requestBody),
    [baseUrl, endpoint, parameterValues, requestBody]
  );
  const curl = useMemo(() => generateCurl(request), [request]);

  const handleParameterChange = (
    parameter: OpenApiParameter,
    value: string
  ) => {
    setParameterValues((currentValues) => ({
      ...currentValues,
      [getParameterKey(parameter)]: value,
    }));
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    setResponse(null);

    try {
      const proxyResponse = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      const payload = (await proxyResponse.json()) as ProxyResponsePayload;

      setResponse(payload);
    } catch (error) {
      setResponse({
        ok: false,
        status: 0,
        statusText: 'Client Error',
        headers: {},
        body: '',
        durationMs: 0,
        requestSize: 0,
        responseSize: 0,
        error:
          error instanceof Error ? error.message : 'Unable to execute request',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyCurl = async () => {
    try {
      await navigator.clipboard.writeText(curl);
      setCopyState('Copied');
    } catch {
      setCopyState('Unable to copy');
    }
  };

  return (
    <section className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <h3 className="text-base font-semibold text-zinc-950">Try It Out</h3>

      <label className="mt-3 flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-700">Base URL</span>
        <input
          value={baseUrl}
          onChange={(event) => setBaseUrl(event.target.value)}
          placeholder="https://api.example.com"
          className="rounded-md border border-zinc-300 px-3 py-2"
        />
      </label>

      {PARAMETER_LOCATIONS.map((location) => {
        const parameters = endpoint.parametersByLocation[location];

        if (parameters.length === 0) {
          return null;
        }

        return (
          <fieldset key={location} className="mt-4 flex flex-col gap-2">
            <legend className="text-sm font-semibold capitalize text-zinc-950">
              {location} parameters
            </legend>
            {parameters.map((parameter) => (
              <label
                key={getParameterKey(parameter)}
                className="flex flex-col gap-1 text-sm"
              >
                <span className="font-medium text-zinc-700">
                  {parameter.name}
                  {parameter.required ? ' *' : ''}
                </span>
                <input
                  value={parameterValues[getParameterKey(parameter)] ?? ''}
                  onChange={(event) =>
                    handleParameterChange(parameter, event.target.value)
                  }
                  className="rounded-md border border-zinc-300 px-3 py-2"
                />
              </label>
            ))}
          </fieldset>
        );
      })}

      {endpoint.requestBody && (
        <label className="mt-4 flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700">Request body</span>
          <textarea
            value={requestBody}
            onChange={(event) => setRequestBody(event.target.value)}
            className="min-h-32 rounded-md border border-zinc-300 px-3 py-2 font-mono text-xs"
          />
        </label>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleExecute}
          disabled={isExecuting || !baseUrl.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isExecuting ? 'Executing...' : 'Execute'}
        </button>
        <button
          type="button"
          onClick={handleCopyCurl}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-white"
        >
          Generate cURL
        </button>
        {copyState && <span className="text-sm text-zinc-500">{copyState}</span>}
      </div>

      <pre className="mt-4 overflow-auto rounded-lg bg-zinc-950 p-3 text-xs text-zinc-100">
        {curl}
      </pre>

      <ResponsePanel response={response} />
    </section>
  );
};
