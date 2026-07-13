import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SignOutButton } from './SignOutButton';

const push = vi.fn();
const refresh = vi.fn();
const signOut = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push,
    refresh,
  }),
}));

vi.mock('@/utils/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signOut,
    },
  }),
}));

describe('SignOutButton', () => {
  it('signs user out and refreshes route', async () => {
    signOut.mockResolvedValue({ error: null });

    render(<SignOutButton label="Sign Out" />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign Out' }));

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledOnce();
    });
    expect(push).toHaveBeenCalledWith('/');
    expect(refresh).toHaveBeenCalledOnce();
  });
});
