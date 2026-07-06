'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  detectFormat,
  type SchemaFormat,
} from '@/utils/openapi/detectFormat';
import { convertFormat } from '@/utils/openapi/convertFormat';
import { validateSchema } from '@/utils/openapi/validateSchema';

type ValidationState =
  | {
      status: 'idle';
      message: string | null;
    }
  | {
      status: 'validating';
      message: string | null;
    }
  | {
      status: 'valid';
      message: string;
    }
  | {
      status: 'invalid';
      message: string;
    };

const getOppositeFormat = (format: SchemaFormat): SchemaFormat => {
  return format === 'json' ? 'yaml' : 'json';
};

export const SwaggerEditor = () => {
  const t = useTranslations('SwaggerEditor');
  const [source, setSource] = useState('');
  const [format, setFormat] = useState<SchemaFormat | null>(null);
  const [schema, setSchema] = useState<unknown | null>(null);
  const [validationState, setValidationState] = useState<ValidationState>({
    status: 'idle',
    message: null,
  });

  const handleSourceChange = async (nextSource: string) => {
    setSource(nextSource);
    setSchema(null);

    if (!nextSource.trim()) {
      setFormat(null);
      setValidationState({
        status: 'idle',
        message: null,
      });
      return;
    }

    const detectedFormat = detectFormat(nextSource);
    setFormat(detectedFormat);

    if (!detectedFormat) {
      setValidationState({
        status: 'invalid',
        message: t('unsupportedFormat'),
      });
      return;
    }

    setValidationState({
      status: 'validating',
      message: t('validating'),
    });

    const result = await validateSchema(nextSource, detectedFormat);

    if (!result.ok) {
      setValidationState({
        status: 'invalid',
        message: result.error,
      });
      return;
    }

    setSchema(result.schema);
    setValidationState({
      status: 'valid',
      message: t('validSchema'),
    });
  };

  const handleConvert = async () => {
    if (!format) {
      setValidationState({
        status: 'invalid',
        message: t('unsupportedFormat'),
      });
      return;
    }

    const targetFormat = getOppositeFormat(format);
    const result = convertFormat(source, format, targetFormat);

    if (!result.ok) {
      setValidationState({
        status: 'invalid',
        message: result.error,
      });
      return;
    }

    await handleSourceChange(result.value);
  };

  return (
    <section className="flex w-full flex-1 flex-col gap-6 p-6 lg:flex-row">
      <div className="flex min-h-[560px] flex-1 flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-zinc-200 px-4 py-3">
          <div>
            <h1 className="text-lg font-semibold text-zinc-950">
              {t('title')}
            </h1>
            <p className="text-sm text-zinc-500">
              {format ? t('detectedFormat', { format: format.toUpperCase() }) : t('noFormat')}
            </p>
          </div>

          <button
            type="button"
            onClick={handleConvert}
            disabled={!format}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {format
              ? t('convertTo', {
                  format: getOppositeFormat(format).toUpperCase(),
                })
              : t('convert')}
          </button>
        </div>

        <textarea
          value={source}
          onChange={(event) => {
            void handleSourceChange(event.target.value);
          }}
          placeholder={t('placeholder')}
          spellCheck={false}
          className="min-h-[460px] flex-1 resize-none rounded-b-2xl bg-zinc-950 p-4 font-mono text-sm leading-6 text-zinc-100 outline-none"
        />

        {validationState.message && (
          <p
            className={`border-t px-4 py-3 text-sm ${
              validationState.status === 'valid'
                ? 'border-green-100 bg-green-50 text-green-700'
                : validationState.status === 'validating'
                  ? 'border-blue-100 bg-blue-50 text-blue-700'
                  : 'border-red-100 bg-red-50 text-red-700'
            }`}
          >
            {validationState.message}
          </p>
        )}
      </div>

      <aside className="flex min-h-[560px] flex-1 flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-950">
          {t('viewerTitle')}
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          {schema ? t('viewerReady') : t('viewerEmpty')}
        </p>
        {schema && (
          <pre className="mt-4 flex-1 overflow-auto rounded-xl bg-zinc-950 p-4 text-xs leading-5 text-zinc-100">
            {JSON.stringify(schema, null, 2)}
          </pre>
        )}
      </aside>
    </section>
  );
};
