import { request, ApiError } from './client';
import { buildApiHeaders } from './headers';
import { API_ECOMMERCE_BASE } from '../config/tenants';

// Real backend uses multipart/form-data for /login/send-otp, /login/verify-otp
// and /user. OTP from the sample collection is 5 digits (e.g. "53511").

export const OTP_REGEX = /^\d{5}$/;

function normalizePhone(phone) {
  if (!phone) return '';
  return String(phone).trim();
}

function formData(entries) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(entries)) {
    if (v != null) fd.append(k, String(v));
  }
  return fd;
}

export async function requestOtp({ credentials, phone }) {
  const mobile = normalizePhone(phone);
  if (mobile.replace(/\D/g, '').length < 7) {
    throw new Error('Enter a valid phone number');
  }
  const url = `${API_ECOMMERCE_BASE}/login/send-otp`;
  const json = await request(url, {
    method: 'POST',
    headers: buildApiHeaders(credentials),
    body: formData({ mobile }),
  });
  if (!json || (json.status !== 200 && json.status !== 201)) {
    throw new ApiError('http', json?.status ?? 0, json?.message || 'Could not send OTP');
  }
  return { phone: mobile, sentAt: Date.now(), raw: json };
}

export async function verifyOtp({ credentials, phone, code }) {
  const mobile = normalizePhone(phone);
  if (!OTP_REGEX.test(code || '')) throw new Error('Enter the 5-digit code');
  const url = `${API_ECOMMERCE_BASE}/login/verify-otp`;
  const json = await request(url, {
    method: 'POST',
    headers: buildApiHeaders(credentials),
    body: formData({ mobile, otp: code }),
  });
  if (!json || (json.status !== 200 && json.status !== 201)) {
    throw new ApiError('http', json?.status ?? 0, json?.message || 'OTP verification failed');
  }
  // Exact key for the returned user id isn't documented — probe common shapes.
  const data = json.data || {};
  const user = data.user || data;
  const userId =
    data.user_id ??
    data.id ??
    user?.id ??
    user?.user_id ??
    null;
  return {
    phone: mobile,
    userId: userId != null ? String(userId) : null,
    user: {
      id: userId != null ? String(userId) : `u_${mobile}`,
      phone: mobile,
      name: user?.name || user?.customer_name || mobile,
      raw: user,
    },
    token: data.token || json.token || null,
    raw: json,
  };
}

export async function createUser({ credentials, name, mobile, address }) {
  const phone = normalizePhone(mobile);
  if (!name) throw new Error('Name is required');
  if (phone.replace(/\D/g, '').length < 7) throw new Error('Enter a valid phone number');
  const url = `${API_ECOMMERCE_BASE}/user`;
  const json = await request(url, {
    method: 'POST',
    headers: buildApiHeaders(credentials),
    body: formData({ name, mobile: phone, address: address || '' }),
  });
  if (!json || (json.status !== 200 && json.status !== 201)) {
    throw new ApiError('http', json?.status ?? 0, json?.message || 'Could not create user');
  }
  return { raw: json };
}
