import type { ProxyRequestPayload } from './request';

const shellQuote = (value: string): string => {
  return `'${value.replaceAll("'", "'\\''")}'`;
};

export const generateCurl = (request: ProxyRequestPayload): string => {
  const parts = ['curl', '-X', request.method.toUpperCase(), shellQuote(request.url)];

  Object.entries(request.headers)
    .filter(([, value]) => value.trim().length > 0)
    .forEach(([name, value]) => {
      parts.push('-H', shellQuote(`${name}: ${value}`));
    });

  if (request.body && request.body.trim().length > 0) {
    parts.push('--data', shellQuote(request.body));
  }

  return parts.join(' ');
};
