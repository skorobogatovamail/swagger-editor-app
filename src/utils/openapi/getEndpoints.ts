export type OpenApiMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'options'
  | 'head'
  | 'trace';

export type ParameterLocation = 'path' | 'query' | 'header' | 'cookie';

export type OpenApiParameter = {
  name: string;
  in: ParameterLocation;
  required: boolean;
  description?: string;
  schema?: unknown;
  example?: unknown;
  examples?: unknown;
};

export type OpenApiContent = {
  contentType: string;
  schema?: unknown;
  example?: unknown;
  examples?: unknown;
};

export type OpenApiRequestBody = {
  description?: string;
  required: boolean;
  content: OpenApiContent[];
};

export type OpenApiResponse = {
  statusCode: string;
  description?: string;
  content: OpenApiContent[];
};

export type ParametersByLocation = Record<ParameterLocation, OpenApiParameter[]>;

export type OpenApiEndpoint = {
  method: OpenApiMethod;
  path: string;
  summary?: string;
  description?: string;
  parameters: OpenApiParameter[];
  parametersByLocation: ParametersByLocation;
  requestBody?: OpenApiRequestBody;
  responses: OpenApiResponse[];
  serverUrls: string[];
};

const HTTP_METHODS: OpenApiMethod[] = [
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'options',
  'head',
  'trace',
];

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const isOpenApiMethod = (value: string): value is OpenApiMethod => {
  return HTTP_METHODS.includes(value as OpenApiMethod);
};

const isParameterLocation = (value: unknown): value is ParameterLocation => {
  return (
    value === 'path' ||
    value === 'query' ||
    value === 'header' ||
    value === 'cookie'
  );
};

const getString = (value: unknown): string | undefined => {
  return typeof value === 'string' ? value : undefined;
};

const normalizeContent = (content: unknown): OpenApiContent[] => {
  if (!isRecord(content)) {
    return [];
  }

  return Object.entries(content).flatMap(([contentType, mediaType]) => {
    if (!isRecord(mediaType)) {
      return [];
    }

    return {
      contentType,
      schema: mediaType.schema,
      example: mediaType.example,
      examples: mediaType.examples,
    };
  });
};

const normalizeParameter = (parameter: unknown): OpenApiParameter | null => {
  if (!isRecord(parameter)) {
    return null;
  }

  const name = getString(parameter.name);

  if (!name || !isParameterLocation(parameter.in)) {
    return null;
  }

  return {
    name,
    in: parameter.in,
    required: parameter.required === true,
    description: getString(parameter.description),
    schema: parameter.schema,
    example: parameter.example,
    examples: parameter.examples,
  };
};

const normalizeParameters = (parameters: unknown): OpenApiParameter[] => {
  if (!Array.isArray(parameters)) {
    return [];
  }

  return parameters.flatMap((parameter) => {
    const normalizedParameter = normalizeParameter(parameter);

    return normalizedParameter ? [normalizedParameter] : [];
  });
};

const groupParameters = (
  parameters: OpenApiParameter[]
): ParametersByLocation => {
  return {
    path: parameters.filter((parameter) => parameter.in === 'path'),
    query: parameters.filter((parameter) => parameter.in === 'query'),
    header: parameters.filter((parameter) => parameter.in === 'header'),
    cookie: parameters.filter((parameter) => parameter.in === 'cookie'),
  };
};

const normalizeRequestBody = (
  requestBody: unknown
): OpenApiRequestBody | undefined => {
  if (!isRecord(requestBody)) {
    return undefined;
  }

  return {
    description: getString(requestBody.description),
    required: requestBody.required === true,
    content: normalizeContent(requestBody.content),
  };
};

const normalizeResponses = (responses: unknown): OpenApiResponse[] => {
  if (!isRecord(responses)) {
    return [];
  }

  return Object.entries(responses).flatMap(([statusCode, response]) => {
    if (!isRecord(response)) {
      return [];
    }

    return {
      statusCode,
      description: getString(response.description),
      content: normalizeContent(response.content),
    };
  });
};

const normalizeServers = (servers: unknown): string[] => {
  if (!Array.isArray(servers)) {
    return [];
  }

  return servers.flatMap((server) => {
    if (!isRecord(server) || typeof server.url !== 'string') {
      return [];
    }

    return server.url;
  });
};

export const getEndpoints = (schema: unknown): OpenApiEndpoint[] => {
  if (!isRecord(schema) || !isRecord(schema.paths)) {
    return [];
  }

  const rootServerUrls = normalizeServers(schema.servers);

  return Object.entries(schema.paths).flatMap(([path, pathItem]) => {
    if (!isRecord(pathItem)) {
      return [];
    }

    const pathParameters = normalizeParameters(pathItem.parameters);

    return Object.entries(pathItem)
      .filter((entry): entry is [OpenApiMethod, unknown] =>
        isOpenApiMethod(entry[0])
      )
      .flatMap(([method, operation]) => {
        if (!isRecord(operation)) {
          return [];
        }

        const operationParameters = normalizeParameters(operation.parameters);
        const parameters = [...pathParameters, ...operationParameters];
        const operationServerUrls = normalizeServers(operation.servers);

        return {
          method,
          path,
          summary:
            typeof operation.summary === 'string' ? operation.summary : undefined,
          description:
            typeof operation.description === 'string'
              ? operation.description
              : undefined,
          parameters,
          parametersByLocation: groupParameters(parameters),
          requestBody: normalizeRequestBody(operation.requestBody),
          responses: normalizeResponses(operation.responses),
          serverUrls:
            operationServerUrls.length > 0 ? operationServerUrls : rootServerUrls,
        };
      });
  });
};
