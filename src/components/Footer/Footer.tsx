import Link from 'next/link';
import { useTranslations } from 'next-intl';

export const Footer = () => {
  const t = useTranslations('Footer');

  return (
    <footer className="w-full border-t bg-white">
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
      </nav>
    </footer>
  );
};
