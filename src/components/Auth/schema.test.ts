import { describe, expect, it } from 'vitest';
import {
  AuthValidationMessages,
  createSignInSchema,
  createSignUpSchema,
  SignInValidationMessages,
} from './schema';

const signUpMessages: AuthValidationMessages = {
  emailRequired: 'Email is required',
  invalidEmail: 'Invalid email format',
  passwordRequired: 'Password is required',
  passwordMin: 'Password must be at least 8 characters',
  passwordLetter: 'Password must contain at least one letter',
  passwordDigit: 'Password must contain at least one digit',
  passwordSpecial: 'Password must contain at least one special character',
  passwordsMatch: 'Passwords must match',
  confirmPasswordRequired: 'Confirm password is required',
};

const signInMessages: SignInValidationMessages = {
  emailRequired: signUpMessages.emailRequired,
  invalidEmail: signUpMessages.invalidEmail,
  passwordRequired: signUpMessages.passwordRequired,
};

describe('createSignUpSchema', () => {
  const schema = createSignUpSchema(signUpMessages);

  it('accepts a valid form with Unicode letters', async () => {
    await expect(
      schema.validate({
        email: 'user@example.com',
        password: 'Пароль123!',
        confirmPassword: 'Пароль123!',
      })
    ).resolves.toBeTruthy();
  });

  it('rejects an invalid email', async () => {
    await expect(
      schema.validate({
        email: 'invalid-email',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      })
    ).rejects.toThrow(signUpMessages.invalidEmail);
  });

  it('rejects a password shorter than 8 characters', async () => {
    await expect(
      schema.validate({
        email: 'user@example.com',
        password: 'Pwd1!',
        confirmPassword: 'Pwd1!',
      })
    ).rejects.toThrow(signUpMessages.passwordMin);
  });

  it('rejects a password without a letter', async () => {
    await expect(
      schema.validate({
        email: 'user@example.com',
        password: '12345678!',
        confirmPassword: '12345678!',
      })
    ).rejects.toThrow(signUpMessages.passwordLetter);
  });

  it('rejects a password without a digit', async () => {
    await expect(
      schema.validate({
        email: 'user@example.com',
        password: 'Password!',
        confirmPassword: 'Password!',
      })
    ).rejects.toThrow(signUpMessages.passwordDigit);
  });

  it('rejects a password without a special character', async () => {
    await expect(
      schema.validate({
        email: 'user@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      })
    ).rejects.toThrow(signUpMessages.passwordSpecial);
  });

  it('rejects mismatched passwords', async () => {
    await expect(
      schema.validate({
        email: 'user@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123?',
      })
    ).rejects.toThrow(signUpMessages.passwordsMatch);
  });
});

describe('createSignInSchema', () => {
  const schema = createSignInSchema(signInMessages);

  it('accepts valid sign in credentials', async () => {
    await expect(
      schema.validate({
        email: 'user@example.com',
        password: 'password',
      })
    ).resolves.toBeTruthy();
  });

  it('rejects missing password', async () => {
    await expect(
      schema.validate({
        email: 'user@example.com',
        password: '',
      })
    ).rejects.toThrow(signInMessages.passwordRequired);
  });
});
