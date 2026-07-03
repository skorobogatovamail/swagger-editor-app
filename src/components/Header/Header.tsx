import Link from 'next/link';
import { useTranslations } from 'next-intl';

export const Header = () => {
  const t = useTranslations('Header');

  return (
    <header className="w-full sticky top-0 border-b bg-white">
      <nav className="flex justify-between items-center px-6 py-4 max-w-6xl">
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
          <Link
            className="text-sm font-medium transition-colors hover:text-blue-600"
            href="/history"
          >
            {t('history')}
          </Link>
        </div>

        <div className="flex items-center gap-4">
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
        </div>
      </nav>
    </header>
  );
};
