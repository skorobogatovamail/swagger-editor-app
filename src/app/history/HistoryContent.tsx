'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { RequestHistoryRecord } from '@/utils/supabase/history';
import type { HistoryAnalytics } from '@/utils/history/analytics';

type HistoryContentProps = {
  entries: RequestHistoryRecord[];
  analytics: HistoryAnalytics;
};

const formatDate = (value: string): string => {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-zinc-950">{value}</p>
    </div>
  );
};

const DistributionList = ({
  title,
  items,
}: {
  title: string;
  items: Record<string, number>;
}) => {
  const entries = Object.entries(items);

  if (entries.length === 0) {
    return null;
  }

  const maxValue = Math.max(...entries.map(([, count]) => count));

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-zinc-950">{title}</h2>
      <ul className="mt-4 flex flex-col gap-3">
        {entries.map(([key, count]) => (
          <li key={key}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium uppercase text-zinc-700">{key}</span>
              <span className="text-zinc-500">{count}</span>
            </div>
            <div className="h-2 rounded-full bg-zinc-100">
              <div
                className="h-2 rounded-full bg-blue-600"
                style={{ width: `${(count / maxValue) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export const HistoryContent = ({
  entries,
  analytics,
}: HistoryContentProps) => {
  const t = useTranslations('History');

  if (entries.length === 0) {
    return (
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-6 py-10">
        <h1 className="text-2xl font-bold text-zinc-950">{t('title')}</h1>
        <p className="text-zinc-600">{t('emptyDescription')}</p>
        <Link
          href="/"
          className="inline-flex w-fit rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {t('goToEditor')}
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <div>
        <h1 className="text-2xl font-bold text-zinc-950">{t('title')}</h1>
        <p className="mt-2 text-zinc-600">{t('description')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t('totalRequests')} value={analytics.totalRequests} />
        <StatCard
          label={t('averageDuration')}
          value={`${analytics.averageDurationMs} ms`}
        />
        <StatCard
          label={t('successRate')}
          value={`${analytics.successRate}%`}
        />
        <StatCard label={t('recentRequests')} value={entries.length} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DistributionList title={t('byMethod')} items={analytics.byMethod} />
        <DistributionList title={t('byStatus')} items={analytics.byStatus} />
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-4 py-3">
          <h2 className="text-lg font-semibold text-zinc-950">
            {t('recentRequests')}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-600">
              <tr>
                <th className="px-4 py-3 font-medium">{t('timestamp')}</th>
                <th className="px-4 py-3 font-medium">{t('method')}</th>
                <th className="px-4 py-3 font-medium">{t('url')}</th>
                <th className="px-4 py-3 font-medium">{t('status')}</th>
                <th className="px-4 py-3 font-medium">{t('duration')}</th>
                <th className="px-4 py-3 font-medium">{t('sizes')}</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-t border-zinc-100">
                  <td className="px-4 py-3 whitespace-nowrap text-zinc-600">
                    {formatDate(entry.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-semibold uppercase text-zinc-950">
                    {entry.method}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-zinc-700">
                    {entry.endpointPath ?? entry.url}
                  </td>
                  <td className="px-4 py-3">
                    {entry.error ? (
                      <span className="text-red-600">{t('error')}</span>
                    ) : (
                      entry.status
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {entry.durationMs} ms
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {entry.requestSize}/{entry.responseSize}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
};

export default HistoryContent;
