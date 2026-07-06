import { getEndpoints } from '@/utils/openapi/getEndpoints';
import { EndpointCard } from './EndpointCard';

type SwaggerViewerProps = {
  schema: unknown | null;
};

export const SwaggerViewer = ({ schema }: SwaggerViewerProps) => {
  const endpoints = schema ? getEndpoints(schema) : [];

  return (
    <aside className="flex min-h-[560px] flex-1 flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-950">Swagger Viewer</h2>
      <p className="mt-2 text-sm text-zinc-500">
        {endpoints.length > 0
          ? `${endpoints.length} endpoint${endpoints.length === 1 ? '' : 's'} found`
          : 'Valid endpoints will appear here after schema validation.'}
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
