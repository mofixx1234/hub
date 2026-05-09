import axios from 'axios';

/** Base URL : vide = même origine + proxy Vite (`/api` → localhost:4000). */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

/** Jeton JWT depuis le stockage (clé alignée sur AuthContext : `hub_token`). */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hub_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Garde les appels existants qui mettent à jour axios après login / logout. */
export function definirJeton(jeton) {
  if (jeton) {
    api.defaults.headers.common.Authorization = `Bearer ${jeton}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('[API] Serveur inaccessible', error.message || error);
      const path = typeof window !== 'undefined' ? window.location.pathname : '';
      if (path && !path.startsWith('/erreur-serveur')) {
        window.location.assign('/erreur-serveur');
      }
    }
    return Promise.reject(error);
  }
);
