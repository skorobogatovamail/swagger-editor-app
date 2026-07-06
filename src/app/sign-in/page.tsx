import { SignInForm } from '@/components/Auth/SignInForm';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';

export default async function SignInPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const t = await getTranslations('Pages');

  if (user) {
    return redirect('/');
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">{t('signInTitle')}</h1>
      <SignInForm />
    </div>
  );
}
