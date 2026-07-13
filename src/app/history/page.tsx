import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
import { unauthorized } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/utils/supabase/server';
import { getRequestHistory } from '@/utils/supabase/history';
import { computeHistoryAnalytics } from '@/utils/history/analytics';

const HistoryContent = dynamic(() => import('./HistoryContent'), {
  loading: () => (
    <div className="mx-auto max-w-4xl px-6 py-10 text-zinc-600">Loading...</div>
  ),
});

export default async function HistoryPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    unauthorized();
  }

  const entries = await getRequestHistory(supabase, user.id);
  const analytics = computeHistoryAnalytics(entries);

  return (
    <main className="flex flex-1 bg-zinc-50">
      <HistoryContent entries={entries} analytics={analytics} />
    </main>
  );
}

export const generateMetadata = async () => {
  const t = await getTranslations('History');

  return {
    title: t('title'),
  };
};
