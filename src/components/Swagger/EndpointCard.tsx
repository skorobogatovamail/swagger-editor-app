import type { OpenApiEndpoint } from '@/utils/openapi/getEndpoints';
import { EndpointDetails } from './EndpointDetails';
import { RequestForm } from './RequestForm';

type EndpointCardProps = {
  endpoint: OpenApiEndpoint;
};

export const EndpointCard = ({ endpoint }: EndpointCardProps) => {
  return (
    <article className="rounded-xl border border-zinc-200 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-bold uppercase text-blue-700">
          {endpoint.method}
        </span>
        <code className="text-sm font-semibold text-zinc-950">
          {endpoint.path}
        </code>
      </div>

      {endpoint.summary && (
        <p className="mt-3 text-sm text-zinc-600">{endpoint.summary}</p>
      )}

      <EndpointDetails endpoint={endpoint} />
      <RequestForm endpoint={endpoint} />
    </article>
  );
};
