import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function NotFoundPage() {
  const t = await getTranslations('Errors');

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-bold text-zinc-950">{t('notFoundTitle')}</h1>
      <p className="text-zinc-600">{t('notFoundDescription')}</p>
      <Link
        href="/"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        {t('goHome')}
      </Link>
    </main>
  );
}
