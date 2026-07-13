'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations('Errors');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-bold text-zinc-950">{t('genericTitle')}</h1>
      <p className="text-zinc-600">{t('genericDescription')}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        {t('tryAgain')}
      </button>
    </main>
  );
}
