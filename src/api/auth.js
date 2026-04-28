import { featureFlags } from '../config/featureFlags';

// Mock auth. Phone number becomes the user identity. Any 4-digit OTP works.
// Token is a fake nonce — backend will issue a real JWT later.

const OTP_REGEX = /^\d{4}$/;

export async function requestOtp({ phone }) {
  if (featureFlags.useRealAuthApi) throw new Error('Real auth API not wired');
  if (!phone || phone.replace(/\D/g, '').length < 7) {
    throw new Error('Enter a valid phone number');
  }
  // Pretend to dispatch SMS. Devs see this in logs.
  // eslint-disable-next-line no-console
  console.log('[mock-auth] OTP requested for', phone, '— accept any 4 digits');
  return { phone, sentAt: Date.now() };
}

export async function verifyOtp({ phone, code, name }) {
  if (featureFlags.useRealAuthApi) throw new Error('Real auth API not wired');
  if (!OTP_REGEX.test(code || '')) throw new Error('Enter the 4-digit code');
  return {
    phone,
    token: `mock_${Date.now().toString(36)}`,
    user: {
      id: `u_${phone}`,
      phone,
      name: name || phone,
    },
  };
}
