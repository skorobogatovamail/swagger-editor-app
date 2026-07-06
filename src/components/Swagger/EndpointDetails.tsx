import type {
  OpenApiEndpoint,
  OpenApiParameter,
  ParameterLocation,
} from '@/utils/openapi/getEndpoints';
import { JsonPreview } from './JsonPreview';

type EndpointDetailsProps = {
  endpoint: OpenApiEndpoint;
};

const PARAMETER_GROUPS: ParameterLocation[] = [
  'path',
  'query',
  'header',
  'cookie',
];

const ParameterList = ({
  title,
  parameters,
}: {
  title: string;
  parameters: OpenApiParameter[];
}) => {
  if (parameters.length === 0) {
    return null;
  }

  return (
    <section>
      <h4 className="text-sm font-semibold text-zinc-950">{title}</h4>
      <ul className="mt-2 flex flex-col gap-2">
        {parameters.map((parameter) => (
          <li
            key={`${parameter.in}-${parameter.name}`}
            className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 text-sm"
          >
            <div className="flex flex-wrap items-center gap-2">
              <code className="font-semibold text-zinc-950">
                {parameter.name}
              </code>
              {parameter.required && (
                <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                  required
                </span>
              )}
            </div>
            {parameter.description && (
              <p className="mt-1 text-zinc-600">{parameter.description}</p>
            )}
            {parameter.schema !== undefined && <JsonPreview value={parameter.schema} />}
          </li>
        ))}
      </ul>
    </section>
  );
};

export const EndpointDetails = ({ endpoint }: EndpointDetailsProps) => {
  return (
    <div className="mt-4 flex flex-col gap-5">
      {endpoint.description && (
        <p className="text-sm leading-6 text-zinc-600">{endpoint.description}</p>
      )}

      <section className="flex flex-col gap-4">
        <h3 className="text-base font-semibold text-zinc-950">Parameters</h3>
        {PARAMETER_GROUPS.some(
          (location) => endpoint.parametersByLocation[location].length > 0
        ) ? (
          PARAMETER_GROUPS.map((location) => (
            <ParameterList
              key={location}
              parameters={endpoint.parametersByLocation[location]}
              title={`${location} parameters`}
            />
          ))
        ) : (
          <p className="text-sm text-zinc-500">No parameters.</p>
        )}
      </section>

      <section>
        <h3 className="text-base font-semibold text-zinc-950">Request body</h3>
        {endpoint.requestBody ? (
          <div className="mt-2 flex flex-col gap-3">
            {endpoint.requestBody.description && (
              <p className="text-sm text-zinc-600">
                {endpoint.requestBody.description}
              </p>
            )}
            {endpoint.requestBody.content.map((content) => (
              <div
                key={content.contentType}
                className="rounded-lg border border-zinc-100 bg-zinc-50 p-3"
              >
                <p className="text-sm font-medium text-zinc-950">
                  {content.contentType}
                </p>
                {content.example !== undefined && (
                  <>
                    <p className="mt-2 text-xs font-medium uppercase text-zinc-500">
                      Example
                    </p>
                    <JsonPreview value={content.example} />
                  </>
                )}
                {content.schema !== undefined && (
                  <>
                    <p className="mt-2 text-xs font-medium uppercase text-zinc-500">
                      Schema
                    </p>
                    <JsonPreview value={content.schema} />
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-zinc-500">No request body.</p>
        )}
      </section>

      <section>
        <h3 className="text-base font-semibold text-zinc-950">Responses</h3>
        {endpoint.responses.length > 0 ? (
          <div className="mt-2 flex flex-col gap-3">
            {endpoint.responses.map((response) => (
              <div
                key={response.statusCode}
                className="rounded-lg border border-zinc-100 bg-zinc-50 p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-zinc-900 px-2 py-0.5 text-xs font-bold text-white">
                    {response.statusCode}
                  </span>
                  {response.description && (
                    <p className="text-sm text-zinc-600">
                      {response.description}
                    </p>
                  )}
                </div>
                {response.content.map((content) => (
                  <div key={content.contentType} className="mt-3">
                    <p className="text-sm font-medium text-zinc-950">
                      {content.contentType}
                    </p>
                    {content.example !== undefined && (
                      <JsonPreview value={content.example} />
                    )}
                    {content.schema !== undefined && (
                      <JsonPreview value={content.schema} />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-zinc-500">No responses.</p>
        )}
      </section>
    </div>
  );
};
