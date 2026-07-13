import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { convertFormat } from './convertFormat';
import { detectFormat } from './detectFormat';
import { validateSchema } from './validateSchema';

const openApiObject = {
  openapi: '3.0.0',
  info: {
    title: 'Example API',
    version: '1.0.0',
  },
  paths: {
    '/users': {
      get: {
        responses: {
          '200': {
            description: 'OK',
          },
        },
      },
    },
  },
};

const openApiJson = JSON.stringify(openApiObject, null, 2);

const openApiYaml = `
openapi: 3.0.0
info:
  title: Example API
  version: 1.0.0
paths:
  /users:
    get:
      responses:
        '200':
          description: OK
`;

describe('detectFormat', () => {
  it('detects JSON object source', () => {
    expect(detectFormat(openApiJson)).toBe('json');
  });

  it('detects YAML object source', () => {
    expect(detectFormat(openApiYaml)).toBe('yaml');
  });

  it('returns null for empty source', () => {
    expect(detectFormat('   ')).toBeNull();
  });

  it('returns null for non-object JSON', () => {
    expect(detectFormat('"hello"')).toBeNull();
  });

  it('returns null for invalid source', () => {
    expect(detectFormat('[invalid')).toBeNull();
  });
});

describe('convertFormat', () => {
  it('converts JSON source to YAML', () => {
    const result = convertFormat(openApiJson, 'json', 'yaml');

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(parse(result.value)).toEqual(openApiObject);
    }
  });

  it('converts YAML source to formatted JSON', () => {
    const result = convertFormat(openApiYaml, 'yaml', 'json');

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(JSON.parse(result.value)).toEqual(openApiObject);
      expect(result.value).toContain('\n  "info"');
    }
  });

  it('returns an error for invalid JSON source', () => {
    const result = convertFormat('{invalid', 'json', 'yaml');

    expect(result.ok).toBe(false);
  });
});

describe('validateSchema', () => {
  it('accepts a valid JSON OpenAPI schema', async () => {
    const result = await validateSchema(openApiJson, 'json');

    expect(result.ok).toBe(true);
  });

  it('accepts a valid YAML OpenAPI schema', async () => {
    const result = await validateSchema(openApiYaml, 'yaml');

    expect(result.ok).toBe(true);
  });

  it('rejects a syntactically valid non-OpenAPI document', async () => {
    const result = await validateSchema('hello: world', 'yaml');

    expect(result.ok).toBe(false);
  });
});
