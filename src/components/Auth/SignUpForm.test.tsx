import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SignUpForm } from './SignUpForm';

const push = vi.fn();
const refresh = vi.fn();
const signUp = vi.fn();

const authTranslations: Record<string, string> = {
  email: 'Email',
  password: 'Password',
  confirmPassword: 'Confirm Password',
  signUp: 'Sign Up',
  signingUp: 'Signing up...',
  unknownError: 'An unknown error occurred',
  'validation.emailRequired': 'Email is required',
  'validation.invalidEmail': 'Invalid email format',
  'validation.passwordRequired': 'Password is required',
  'validation.passwordMin': 'Password must be at least 8 characters',
  'validation.passwordLetter': 'Password must contain at least one letter',
  'validation.passwordDigit': 'Password must contain at least one digit',
  'validation.passwordSpecial':
    'Password must contain at least one special character',
  'validation.passwordsMatch': 'Passwords must match',
  'validation.confirmPasswordRequired': 'Confirm password is required',
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
      signUp,
    },
  }),
}));

describe('SignUpForm', () => {
  beforeEach(() => {
    push.mockClear();
    refresh.mockClear();
    signUp.mockReset();
  });

  it('renders sign up fields', () => {
    render(<SignUpForm />);

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('shows validation errors for empty submit', async () => {
    render(<SignUpForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
    expect(
      await screen.findByText('Confirm password is required')
    ).toBeInTheDocument();
    expect(signUp).not.toHaveBeenCalled();
  });

  it('shows password mismatch validation error', async () => {
    render(<SignUpForm />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'Password123?' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(await screen.findByText('Passwords must match')).toBeInTheDocument();
    expect(signUp).not.toHaveBeenCalled();
  });

  it('signs user up and redirects to main page', async () => {
    signUp.mockResolvedValue({ error: null });
    render(<SignUpForm />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'Пароль123!' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'Пароль123!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(signUp).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'Пароль123!',
      });
    });
    expect(push).toHaveBeenCalledWith('/');
    expect(refresh).toHaveBeenCalledOnce();
  });

  it('shows Supabase error message', async () => {
    signUp.mockResolvedValue({
      error: new Error('User already registered'),
    });
    render(<SignUpForm />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(await screen.findByText('User already registered')).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
});
