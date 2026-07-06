import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageSwitcher } from './LanguageSwitcher';

const refresh = vi.fn();

vi.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh,
  }),
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    refresh.mockClear();
    document.cookie = 'NEXT_LOCALE=; Max-Age=0; path=/';
  });

  it('renders available locales and current locale', () => {
    render(<LanguageSwitcher />);

    expect(screen.getByRole('combobox', { name: 'Select language' })).toHaveValue(
      'en'
    );
    expect(screen.getByRole('option', { name: 'EN' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'RU' })).toBeInTheDocument();
  });

  it('stores selected locale in cookie and refreshes route', () => {
    render(<LanguageSwitcher />);

    fireEvent.change(screen.getByRole('combobox', { name: 'Select language' }), {
      target: { value: 'ru' },
    });

    expect(document.cookie).toContain('NEXT_LOCALE=ru');
    expect(refresh).toHaveBeenCalledOnce();
  });
});
