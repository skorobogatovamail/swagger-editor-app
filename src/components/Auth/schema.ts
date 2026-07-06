import * as yup from 'yup';

export type AuthValidationMessages = {
  emailRequired: string;
  invalidEmail: string;
  passwordRequired: string;
  passwordMin: string;
  passwordLetter: string;
  passwordDigit: string;
  passwordSpecial: string;
  passwordsMatch: string;
  confirmPasswordRequired: string;
};

export type SignInValidationMessages = Pick<
  AuthValidationMessages,
  'emailRequired' | 'invalidEmail' | 'passwordRequired'
>;

export const createSignUpSchema = (messages: AuthValidationMessages) =>
  yup.object({
    email: yup
      .string()
      .required(messages.emailRequired)
      .email(messages.invalidEmail),
    password: yup
      .string()
      .required(messages.passwordRequired)
      .min(8, messages.passwordMin)
      .matches(/\p{L}/u, messages.passwordLetter)
      .matches(/\p{N}/u, messages.passwordDigit)
      .matches(/[^\p{L}\p{N}\s]/u, messages.passwordSpecial),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], messages.passwordsMatch)
      .required(messages.confirmPasswordRequired),
  });

export const createSignInSchema = (messages: SignInValidationMessages) =>
  yup.object({
    email: yup
      .string()
      .required(messages.emailRequired)
      .email(messages.invalidEmail),
    password: yup.string().required(messages.passwordRequired),
  });

export type SignUpFormData = yup.InferType<
  ReturnType<typeof createSignUpSchema>
>;
export type SignInFormData = yup.InferType<
  ReturnType<typeof createSignInSchema>
>;
