'use client';

import { useTranslations } from 'next-intl';
import { getEndpoints } from '@/utils/openapi/getEndpoints';
import { EndpointCard } from './EndpointCard';

type SwaggerViewerProps = {
  schema: unknown | null;
};

export const SwaggerViewer = ({ schema }: SwaggerViewerProps) => {
  const t = useTranslations('SwaggerViewer');
  const endpoints = schema ? getEndpoints(schema) : [];

  return (
    <aside className="flex min-h-[560px] flex-1 flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-950">{t('title')}</h2>
      <p className="mt-2 text-sm text-zinc-500">
        {endpoints.length > 0
          ? t('endpointCount', { count: endpoints.length })
          : t('empty')}
      </p>

      <div className="mt-4 flex flex-col gap-3 overflow-auto">
        {endpoints.map((endpoint) => (
          <EndpointCard
            key={`${endpoint.method}-${endpoint.path}`}
            endpoint={endpoint}
          />
        ))}
      </div>
    </aside>
  );
};
