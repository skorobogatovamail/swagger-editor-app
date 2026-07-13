import { describe, expect, it } from 'vitest';
import { getEndpoints } from './getEndpoints';

describe('getEndpoints', () => {
  it('returns an empty array when schema has no paths', () => {
    expect(getEndpoints({ openapi: '3.0.0' })).toEqual([]);
    expect(getEndpoints(null)).toEqual([]);
  });

  it('extracts endpoint method, path, summary and responses', () => {
    const endpoints = getEndpoints({
      paths: {
        '/users': {
          get: {
            summary: 'Get users',
            responses: {
              '200': {
                description: 'OK',
              },
            },
          },
        },
      },
    });

    expect(endpoints).toEqual([
      {
        method: 'get',
        path: '/users',
        summary: 'Get users',
        description: undefined,
        parameters: [],
        parametersByLocation: {
          path: [],
          query: [],
          header: [],
          cookie: [],
        },
        requestBody: undefined,
        responses: [
          {
            statusCode: '200',
            description: 'OK',
            content: [],
          },
        ],
        serverUrls: [],
      },
    ]);
  });

  it('extracts request body content and response content details', () => {
    const endpoints = getEndpoints({
      paths: {
        '/users': {
          post: {
            requestBody: {
              required: true,
              description: 'User payload',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                  },
                  example: {
                    name: 'Elena',
                  },
                },
              },
            },
            responses: {
              '201': {
                description: 'Created',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    expect(endpoints[0].requestBody).toEqual({
      required: true,
      description: 'User payload',
      content: [
        {
          contentType: 'application/json',
          schema: {
            type: 'object',
          },
          example: {
            name: 'Elena',
          },
          examples: undefined,
        },
      ],
    });
    expect(endpoints[0].responses).toEqual([
      {
        statusCode: '201',
        description: 'Created',
        content: [
          {
            contentType: 'application/json',
            schema: {
              type: 'object',
            },
            example: undefined,
            examples: undefined,
          },
        ],
      },
    ]);
  });

  it('extracts multiple methods for one path', () => {
    const endpoints = getEndpoints({
      paths: {
        '/users': {
          get: {
            responses: {},
          },
          post: {
            requestBody: {
              content: {
                'application/json': {},
              },
            },
            responses: {},
          },
        },
      },
    });

    expect(endpoints).toHaveLength(2);
    expect(endpoints.map((endpoint) => endpoint.method)).toEqual([
      'get',
      'post',
    ]);
  });

  it('ignores non-HTTP keys inside path item', () => {
    const endpoints = getEndpoints({
      paths: {
        '/users/{id}': {
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
            },
          ],
          get: {
            responses: {},
          },
        },
      },
    });

    expect(endpoints).toHaveLength(1);
    expect(endpoints[0].method).toBe('get');
  });

  it('combines path-level and operation-level parameters', () => {
    const endpoints = getEndpoints({
      paths: {
        '/users/{id}': {
          parameters: [
            {
              name: 'id',
              in: 'path',
            },
          ],
          get: {
            parameters: [
              {
                name: 'includePosts',
                in: 'query',
              },
            ],
            responses: {},
          },
        },
      },
    });

    expect(endpoints[0].parameters).toEqual([
      {
        name: 'id',
        in: 'path',
        required: false,
        description: undefined,
        schema: undefined,
        example: undefined,
        examples: undefined,
      },
      {
        name: 'includePosts',
        in: 'query',
        required: false,
        description: undefined,
        schema: undefined,
        example: undefined,
        examples: undefined,
      },
    ]);
    expect(endpoints[0].parametersByLocation.path).toHaveLength(1);
    expect(endpoints[0].parametersByLocation.query).toHaveLength(1);
    expect(endpoints[0].parametersByLocation.header).toHaveLength(0);
    expect(endpoints[0].parametersByLocation.cookie).toHaveLength(0);
  });

  it('extracts root servers for endpoints', () => {
    const endpoints = getEndpoints({
      servers: [
        {
          url: 'https://api.example.com',
        },
      ],
      paths: {
        '/users': {
          get: {
            responses: {},
          },
        },
      },
    });

    expect(endpoints[0].serverUrls).toEqual(['https://api.example.com']);
  });
});
