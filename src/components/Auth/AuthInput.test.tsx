import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthInput } from './AuthInput';

describe('AuthInput', () => {
  it('renders input with provided attributes', () => {
    render(<AuthInput placeholder="Email" type="email" />);

    const input = screen.getByPlaceholderText('Email');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'email');
  });

  it('merges custom className with default styles', () => {
    render(<AuthInput className="custom-class" placeholder="Password" />);

    expect(screen.getByPlaceholderText('Password')).toHaveClass('custom-class');
  });
});
