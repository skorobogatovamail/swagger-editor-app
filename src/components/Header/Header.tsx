'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { User } from '@supabase/supabase-js';
import { SignOutButton } from '../Auth/SignOutButton';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useEffect, useState } from 'react';

export const Header = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const t = useTranslations('Header');

  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled
          ? 'border-zinc-200 bg-white/90 shadow-sm backdrop-blur'
          : 'border-transparent bg-white'
      }`}
    >
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
        <LanguageSwitcher />
      </nav>
    </header>
  );
};
