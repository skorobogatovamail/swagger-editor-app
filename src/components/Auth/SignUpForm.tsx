'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { createSignUpSchema, SignUpFormData } from './schema';
import { useTranslations } from 'next-intl';
import { AuthFieldError } from './AuthFieldError';
import { AuthInput } from './AuthInput';
import { AuthSubmitButton } from './AuthSubmitButton';

export const SignUpForm = () => {
  const t = useTranslations('Auth');
  const schema = useMemo(
    () =>
      createSignUpSchema({
        emailRequired: t('validation.emailRequired'),
        invalidEmail: t('validation.invalidEmail'),
        passwordRequired: t('validation.passwordRequired'),
        passwordMin: t('validation.passwordMin'),
        passwordLetter: t('validation.passwordLetter'),
        passwordDigit: t('validation.passwordDigit'),
        passwordSpecial: t('validation.passwordSpecial'),
        passwordsMatch: t('validation.passwordsMatch'),
        confirmPasswordRequired: t('validation.confirmPasswordRequired'),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(schema),
  });

  const supabaseClient = createClient();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (formData: SignUpFormData) => {
    setError(null);
    try {
      const { error } = await supabaseClient.auth.signUp({
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
        onSubmit={handleSubmit(handleSignUp)}
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

        <AuthInput
          type="password"
          {...register('confirmPassword')}
          placeholder={t('confirmPassword')}
        />
        <AuthFieldError message={errors.confirmPassword?.message} />

        <AuthSubmitButton
          isSubmitting={isSubmitting}
          idleText={t('signUp')}
          loadingText={t('signingUp')}
        />
      </form>
      <AuthFieldError message={error ?? undefined} />
    </div>
  );
};
