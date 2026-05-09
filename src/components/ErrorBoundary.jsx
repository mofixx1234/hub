import React from 'react';
import { Button } from './ui/Button.jsx';

/**
 * Capture les erreurs de rendu React — évite un écran blanc silencieux.
 */
export class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-hub-dark px-4 text-center text-hub-text">
          <p className="text-5xl" aria-hidden>
            ⚠️
          </p>
          <h1 className="mt-6 text-xl font-bold text-white">Une erreur s&apos;est produite</h1>
          <p className="mt-2 max-w-md text-sm text-hub-muted">
            Rechargez la page ou revenez à l&apos;accueil.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button type="button" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
            <Button type="button" variant="outline" onClick={() => (window.location.href = '/')}>
              Accueil
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
