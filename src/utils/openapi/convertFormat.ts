import { parse, stringify } from 'yaml';
import type { SchemaFormat } from './detectFormat';

type ConvertFormatResult =
  | {
      ok: true;
      value: string;
    }
  | {
      ok: false;
      error: string;
    };

const parseSource = (source: string, sourceFormat: SchemaFormat): unknown => {
  if (sourceFormat === 'json') {
    return JSON.parse(source);
  }

  return parse(source);
};

export const convertFormat = (
  source: string,
  sourceFormat: SchemaFormat,
  targetFormat: SchemaFormat
): ConvertFormatResult => {
  try {
    const parsedSchema = parseSource(source, sourceFormat);

    if (targetFormat === 'json') {
      return {
        ok: true,
        value: JSON.stringify(parsedSchema, null, 2),
      };
    }

    return {
      ok: true,
      value: stringify(parsedSchema),
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : 'Unable to convert schema',
    };
  }
};
