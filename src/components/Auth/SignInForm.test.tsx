import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SignInForm } from './SignInForm';

const push = vi.fn();
const refresh = vi.fn();
const signInWithPassword = vi.fn();

const authTranslations: Record<string, string> = {
  email: 'Email',
  password: 'Password',
  signIn: 'Sign In',
  signingIn: 'Signing in...',
  unknownError: 'An unknown error occurred',
  'validation.emailRequired': 'Email is required',
  'validation.invalidEmail': 'Invalid email format',
  'validation.passwordRequired': 'Password is required',
};

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => authTranslations[key],
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push,
    refresh,
  }),
}));

vi.mock('@/utils/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword,
    },
  }),
}));

describe('SignInForm', () => {
  beforeEach(() => {
    push.mockClear();
    refresh.mockClear();
    signInWithPassword.mockReset();
  });

  it('renders email and password fields', () => {
    render(<SignInForm />);

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('shows validation errors for empty submit', async () => {
    render(<SignInForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
    expect(signInWithPassword).not.toHaveBeenCalled();
  });

  it('signs user in and redirects to main page', async () => {
    signInWithPassword.mockResolvedValue({ error: null });
    render(<SignInForm />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(signInWithPassword).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password',
      });
    });
    expect(push).toHaveBeenCalledWith('/');
    expect(refresh).toHaveBeenCalledOnce();
  });

  it('shows Supabase error message', async () => {
    signInWithPassword.mockResolvedValue({
      error: new Error('Invalid login credentials'),
    });
    render(<SignInForm />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrong-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(
      await screen.findByText('Invalid login credentials')
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
});
