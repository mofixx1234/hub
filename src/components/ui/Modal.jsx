import { useEffect } from 'react';
import { Button } from './Button.jsx';

/** Fenêtre modale accessible — fermeture Échap et clic overlay. */
export function Modal({
  ouvert,
  onFermer,
  titre,
  enfants,
  pied,
  taille = 'md',
  /** Si false : pas de fermeture overlay / Échap (ex. onboarding obligatoire). */
  fermable = true,
}) {
  useEffect(() => {
    if (!ouvert || !fermable) return;
    function onKey(e) {
      if (e.key === 'Escape') onFermer?.();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ouvert, onFermer, fermable]);

  if (!ouvert) return null;

  const maxW =
    taille === 'sm'
      ? 'max-w-md'
      : taille === 'lg'
        ? 'max-w-2xl'
        : 'max-w-lg';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titre ? 'hub-modal-titre' : undefined}
    >
      {fermable ? (
        <button
          type="button"
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          aria-label="Fermer"
          onClick={onFermer}
        />
      ) : (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden />
      )}
      <div
        className={`relative z-10 flex max-h-[90vh] w-full flex-col rounded-t-2xl border border-hub-border bg-hub-surface shadow-2xl sm:rounded-2xl ${maxW}`}
      >
        {titre && (
          <div className="border-b border-hub-border px-5 py-4">
            <h2 id="hub-modal-titre" className="text-lg font-bold text-hub-text">
              {titre}
            </h2>
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 text-hub-text">{enfants}</div>
        {pied && (
          <div className="flex flex-col-reverse gap-2 border-t border-hub-border px-5 py-4 sm:flex-row sm:justify-end">
            {pied}
          </div>
        )}
      </div>
    </div>
  );
}

export function ModalActions({ onAnnuler, onConfirmer, libelleConfirmer = 'OK', chargement }) {
  return (
    <>
      <Button type="button" variant="outline" onClick={onAnnuler}>
        Annuler
      </Button>
      <Button type="button" onClick={onConfirmer} disabled={chargement}>
        {chargement ? '…' : libelleConfirmer}
      </Button>
    </>
  );
}
