const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const api = async (path, options = {}) => {
  const token = localStorage.getItem('labseek-token');
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Unable to complete the request.');
  return payload;
};

export const money = (value) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(value);

