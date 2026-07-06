import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Header } from './Header';

const translations: Record<string, string> = {
  appName: 'Swagger Editor',
  about: 'About',
  signIn: 'Sign In',
  signUp: 'Sign Up',
  history: 'History',
  signOut: 'Sign Out',
};

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => translations[key],
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a className={className} href={href}>
      {children}
    </a>
  ),
}));

vi.mock('./LanguageSwitcher', () => ({
  LanguageSwitcher: () => <select aria-label="Select language" />,
}));

vi.mock('../Auth/SignOutButton', () => ({
  SignOutButton: ({ label }: { label: string }) => (
    <button type="button">{label}</button>
  ),
}));

describe('Header', () => {
  it('shows guest navigation for unauthenticated users', () => {
    render(<Header isAuthenticated={false} />);

    expect(screen.getByRole('link', { name: 'Swagger Editor' })).toHaveAttribute(
      'href',
      '/'
    );
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/about'
    );
    expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute(
      'href',
      '/sign-in'
    );
    expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute(
      'href',
      '/sign-up'
    );
    expect(screen.queryByText('History')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
  });

  it('shows authenticated navigation for authenticated users', () => {
    render(<Header isAuthenticated />);

    expect(screen.getByRole('link', { name: 'History' })).toHaveAttribute(
      'href',
      '/history'
    );
    expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument();
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
  });

  it('updates sticky styles after scroll', () => {
    const { container } = render(<Header isAuthenticated={false} />);
    const header = container.querySelector('header');

    expect(header).toHaveClass('border-transparent');

    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 20,
    });

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(header).toHaveClass('shadow-sm');
  });
});
