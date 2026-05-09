import { useEffect } from 'react';

/** Applique la classe `dark` sur <html> selon localStorage (synchronisé depuis Préférences). */
export function ThemeSync() {
  useEffect(() => {
    const t = localStorage.getItem('hub_theme');
    const root = document.documentElement;
    if (t === 'light') root.classList.remove('dark');
    else root.classList.add('dark');
  }, []);
  return null;
}
