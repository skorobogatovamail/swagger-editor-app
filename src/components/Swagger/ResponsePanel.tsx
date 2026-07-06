import type { ProxyResponsePayload } from '@/utils/openapi/request';
import { JsonPreview } from './JsonPreview';

type ResponsePanelProps = {
  response: ProxyResponsePayload | null;
};

const tryParseJson = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const ResponsePanel = ({ response }: ResponsePanelProps) => {
  if (!response) {
    return null;
  }

  return (
    <section className="mt-4 rounded-xl border border-zinc-200 bg-white p-4">
      <h4 className="text-sm font-semibold text-zinc-950">Response</h4>
      {response.error ? (
        <p className="mt-2 text-sm text-red-600">{response.error}</p>
      ) : (
        <>
          <dl className="mt-3 grid gap-2 text-sm text-zinc-600 sm:grid-cols-2">
            <div>
              <dt className="font-medium text-zinc-950">Status</dt>
              <dd>
                {response.status} {response.statusText}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-950">Duration</dt>
              <dd>{response.durationMs} ms</dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-950">Request size</dt>
              <dd>{response.requestSize} bytes</dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-950">Response size</dt>
              <dd>{response.responseSize} bytes</dd>
            </div>
          </dl>

          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium text-zinc-950">
              Headers
            </summary>
            <JsonPreview value={response.headers} />
          </details>

          <div className="mt-4">
            <p className="text-sm font-medium text-zinc-950">Body</p>
            <JsonPreview value={tryParseJson(response.body)} />
          </div>
        </>
      )}
    </section>
  );
};
