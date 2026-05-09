import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, definirJeton } from '../api/client';

/** Clé locale du JWT — migrée depuis `hub_jeton` si besoin. */
const CLE_JETON = 'hub_token';
const CLE_JETON_LEGACY = 'hub_jeton';
const CLE_UTILISATEUR = 'hub_utilisateur';

function lireJetonStocke() {
  let t = localStorage.getItem(CLE_JETON);
  if (!t) {
    const legacy = localStorage.getItem(CLE_JETON_LEGACY);
    if (legacy) {
      localStorage.setItem(CLE_JETON, legacy);
      localStorage.removeItem(CLE_JETON_LEGACY);
      t = legacy;
    }
  }
  return t;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [jeton, setJetonState] = useState(() => lireJetonStocke());
  const [utilisateur, setUtilisateur] = useState(() => {
    const raw = localStorage.getItem(CLE_UTILISATEUR);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });
  /** false jusqu’à validation initiale du jeton (ou absence de jeton). */
  const [pret, setPret] = useState(false);

  useEffect(() => {
    definirJeton(jeton);
  }, [jeton]);

  useEffect(() => {
    let ignore = false;

    async function synchroniser() {
      const stocke = lireJetonStocke();
      if (!stocke) {
        setUtilisateur(null);
        if (!ignore) setPret(true);
        return;
      }

      definirJeton(stocke);
      try {
        const { data } = await api.get('/api/auth/moi');
        if (!ignore && data.utilisateur) {
          setJetonState(stocke);
          setUtilisateur(data.utilisateur);
          localStorage.setItem(CLE_UTILISATEUR, JSON.stringify(data.utilisateur));
        }
      } catch {
        if (!ignore) {
          setJetonState(null);
          setUtilisateur(null);
          localStorage.removeItem(CLE_JETON);
          localStorage.removeItem(CLE_JETON_LEGACY);
          localStorage.removeItem(CLE_UTILISATEUR);
          definirJeton(null);
        }
      } finally {
        if (!ignore) setPret(true);
      }
    }

    synchroniser();
    return () => {
      ignore = true;
    };
  }, []);

  const setJeton = useCallback((t, user) => {
    if (t) {
      localStorage.setItem(CLE_JETON, t);
      setJetonState(t);
      definirJeton(t);
    } else {
      localStorage.removeItem(CLE_JETON);
      localStorage.removeItem(CLE_JETON_LEGACY);
      setJetonState(null);
      definirJeton(null);
    }
    if (user) {
      localStorage.setItem(CLE_UTILISATEUR, JSON.stringify(user));
      setUtilisateur(user);
    } else {
      localStorage.removeItem(CLE_UTILISATEUR);
      setUtilisateur(null);
    }
  }, []);

  const inscription = useCallback(
    async (payload) => {
      const { data } = await api.post('/api/auth/inscription', payload);
      setJeton(data.jeton, data.utilisateur);
      return data;
    },
    [setJeton]
  );

  const connexion = useCallback(
    async (payload) => {
      const { data } = await api.post('/api/auth/connexion', payload);
      setJeton(data.jeton, data.utilisateur);
      return data;
    },
    [setJeton]
  );

  const deconnexion = useCallback(async () => {
    try {
      await api.post('/api/auth/deconnexion');
    } catch {
      /* session locale vidée même si l’API échoue */
    }
    setJeton(null, null);
  }, [setJeton]);

  /** Met à jour le profil en mémoire (ex. après onboarding) sans refaire toute la session. */
  const appliquerProfil = useCallback((u) => {
    if (!u) return;
    setUtilisateur(u);
    localStorage.setItem(CLE_UTILISATEUR, JSON.stringify(u));
  }, []);

  const rafraichirProfil = useCallback(async () => {
    const stocke = lireJetonStocke();
    if (!stocke) return;
    try {
      const { data } = await api.get('/api/auth/moi');
      if (data.utilisateur) appliquerProfil(data.utilisateur);
    } catch {
      /* ignore */
    }
  }, [appliquerProfil]);

  const valeur = useMemo(
    () => ({
      jeton,
      utilisateur,
      connecte: Boolean(jeton && utilisateur),
      pret,
      inscription,
      connexion,
      deconnexion,
      appliquerProfil,
      rafraichirProfil,
    }),
    [jeton, utilisateur, pret, inscription, connexion, deconnexion, appliquerProfil, rafraichirProfil]
  );

  return <AuthContext.Provider value={valeur}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé sous AuthProvider');
  return ctx;
}
