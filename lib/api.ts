import axios from 'axios';
import { getSession } from 'next-auth/react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

export default api;

// Server-side API helper
export async function serverApi(accessToken: string) {
  return axios.create({
    baseURL: process.env.BACKEND_URL + '/api',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
