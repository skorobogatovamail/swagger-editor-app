import { parse } from 'yaml';

export type SchemaFormat = 'json' | 'yaml';

const isSchemaObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const detectFormat = (source: string): SchemaFormat | null => {
  const trimmedSource = source.trim();

  if (!trimmedSource) {
    return null;
  }

  try {
    const parsedJson = JSON.parse(trimmedSource) as unknown;

    if (isSchemaObject(parsedJson)) {
      return 'json';
    }
  } catch {}

  try {
    const parsedYaml = parse(trimmedSource);

    if (isSchemaObject(parsedYaml)) {
      return 'yaml';
    }
  } catch {
    return null;
  }

  return null;
};
