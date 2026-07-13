import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthFieldError } from './AuthFieldError';

describe('AuthFieldError', () => {
  it('renders nothing when message is missing', () => {
    const { container } = render(<AuthFieldError />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders error message', () => {
    render(<AuthFieldError message="Email is required" />);

    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });
});
