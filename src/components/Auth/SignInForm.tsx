'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { createSignInSchema, SignInFormData } from './schema';
import { useTranslations } from 'next-intl';
import { AuthFieldError } from './AuthFieldError';
import { AuthInput } from './AuthInput';
import { AuthSubmitButton } from './AuthSubmitButton';

export const SignInForm = () => {
  const t = useTranslations('Auth');
  const schema = useMemo(
    () =>
      createSignInSchema({
        emailRequired: t('validation.emailRequired'),
        invalidEmail: t('validation.invalidEmail'),
        passwordRequired: t('validation.passwordRequired'),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: yupResolver(schema),
  });

  const supabaseClient = createClient();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (formData: SignInFormData) => {
    setError(null);
    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : t('unknownError'));
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 justify-center w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <form
        onSubmit={handleSubmit(handleSignIn)}
        className="flex flex-col items-center justify-center gap-4 w-full"
      >
        <AuthInput
          type="email"
          {...register('email')}
          placeholder={t('email')}
        />
        <AuthFieldError message={errors.email?.message} />

        <AuthInput
          type="password"
          {...register('password')}
          placeholder={t('password')}
        />
        <AuthFieldError message={errors.password?.message} />

        <AuthSubmitButton
          isSubmitting={isSubmitting}
          idleText={t('signIn')}
          loadingText={t('signingIn')}
        />
      </form>
      <AuthFieldError message={error ?? undefined} />
    </div>
  );
};
