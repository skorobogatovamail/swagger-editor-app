import SwaggerParser from '@apidevtools/swagger-parser';
import { parse } from 'yaml';
import type { SchemaFormat } from './detectFormat';

type SwaggerDocument = Parameters<typeof SwaggerParser.validate>[0];

type ValidateSchemaResult =
  | {
      ok: true;
      schema: unknown;
    }
  | {
      ok: false;
      error: string;
    };

const parseByFormat = (source: string, format: SchemaFormat): unknown => {
  if (format === 'json') {
    return JSON.parse(source);
  }

  return parse(source);
};

export const validateSchema = async (
  source: string,
  format: SchemaFormat
): Promise<ValidateSchemaResult> => {
  try {
    const schema = parseByFormat(source, format);

    await SwaggerParser.validate(schema as SwaggerDocument);

    return {
      ok: true,
      schema,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : 'Invalid OpenAPI schema',
    };
  }
};
