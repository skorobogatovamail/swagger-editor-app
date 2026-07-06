'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export const SignOutButton = ({ label }: { label: string }) => {
  const supabaseClient = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <button
      type="button"
      className="rounded-lg px-4 py-2 text-sm font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white"
      onClick={handleSignOut}
    >
      {label}
    </button>
  );
};
