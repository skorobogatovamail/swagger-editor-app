import { SignUpForm } from '@/components/Auth/SignUpForm';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function SignUp() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect('/');
  }
  return (
    <div className="flex flex-col items-center gap-6 justify-center h-screen">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      <SignUpForm />
    </div>
  );
}
