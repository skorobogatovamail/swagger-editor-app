import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthSubmitButton } from './AuthSubmitButton';

describe('AuthSubmitButton', () => {
  it('renders idle text when form is not submitting', () => {
    render(
      <AuthSubmitButton
        idleText="Sign In"
        isSubmitting={false}
        loadingText="Signing in..."
      />
    );

    expect(screen.getByRole('button', { name: 'Sign In' })).toBeEnabled();
  });

  it('renders loading text and disables button while submitting', () => {
    render(
      <AuthSubmitButton
        idleText="Sign In"
        isSubmitting
        loadingText="Signing in..."
      />
    );

    expect(screen.getByRole('button', { name: 'Signing in...' })).toBeDisabled();
  });
});
