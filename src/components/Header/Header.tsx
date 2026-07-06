import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { User } from '@supabase/supabase-js';
import { SignOutButton } from '../Auth/SignOutButton';

export const Header = ({ user }: { user?: User }) => {
  const t = useTranslations('Header');

  const isAuthenticated = !!user;

  return (
    <header className="w-full sticky top-0 border-b bg-white">
      <nav className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <Link className="text-lg font-semibold text-zinc-950" href="/">
            {t('appName')}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            className="text-sm font-medium transition-colors hover:text-blue-600"
            href="/about"
          >
            {t('about')}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link
                className="text-sm font-medium transition-colors hover:text-blue-600"
                href="/sign-in"
              >
                {t('signIn')}
              </Link>
              <Link
                className="rounded-lg px-4 py-2 text-sm font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white"
                href="/sign-up"
              >
                {t('signUp')}
              </Link>
            </>
          ) : (
            <>
              <Link
                className="text-sm font-medium transition-colors hover:text-blue-600"
                href="/history"
              >
                {t('history')}
              </Link>
              <SignOutButton label={t('signOut')} />
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
