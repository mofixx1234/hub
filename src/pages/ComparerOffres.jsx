import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Layout/Navbar.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Spinner } from '../components/ui/Spinner.jsx';

const PUBLIC_API = '/api/public/comparaison-offres';

/**
 * Tableau comparatif public — avant inscription (MODULE 18).
 */
export function ComparerOffres() {
  const [donnees, setDonnees] = useState(null);
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setErreur('');
      setChargement(true);
      try {
        const res = await fetch(PUBLIC_API);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!ignore) setDonnees(json);
      } catch (e) {
        if (!ignore) setErreur(e.message || 'Impossible de charger les tarifs.');
      } finally {
        if (!ignore) setChargement(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const fmt = (n) =>
    typeof n === 'number' && !Number.isNaN(n) ? `${n.toLocaleString('fr-CI')} FCFA` : '—';

  return (
    <div className="flex min-h-screen flex-col bg-hub-dark font-sans text-hub-text">
      <Navbar variant="public" connecte={false} />
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
        <Link to="/" className="text-sm font-medium text-hub-primary hover:underline">
          ← Accueil
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-white">Comparer les offres</h1>
        <p className="mt-2 max-w-2xl text-sm text-hub-muted">
          Tarifs indicatifs « formule complète » (somme des applications du catalogue pour chaque
          famille). Le montant exact est recalculé au paiement (Wave).
        </p>

        {chargement && (
          <div className="mt-12 flex justify-center">
            <Spinner className="h-10 w-10" />
          </div>
        )}

        {erreur && (
          <p className="mt-8 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {erreur}
          </p>
        )}

        {donnees && !chargement && (
          <Card className="mt-8 overflow-x-auto p-0">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-hub-border bg-hub-surface2">
                  <th className="p-4 font-semibold text-white">Fonctionnalité</th>
                  <th className="p-4 text-center font-semibold text-white">Sport</th>
                  <th className="p-4 text-center font-semibold text-white">Ens. CI</th>
                  <th className="p-4 text-center font-semibold text-white">Français</th>
                </tr>
              </thead>
              <tbody className="text-hub-text">
                <tr className="border-b border-hub-border">
                  <td className="p-4">Gestion équipe</td>
                  <td className="p-4 text-center">✅</td>
                  <td className="p-4 text-center">❌</td>
                  <td className="p-4 text-center">❌</td>
                </tr>
                <tr className="border-b border-hub-border">
                  <td className="p-4">Statistiques sport</td>
                  <td className="p-4 text-center">✅</td>
                  <td className="p-4 text-center">❌</td>
                  <td className="p-4 text-center">❌</td>
                </tr>
                <tr className="border-b border-hub-border">
                  <td className="p-4">Évaluation BAC</td>
                  <td className="p-4 text-center">❌</td>
                  <td className="p-4 text-center">✅</td>
                  <td className="p-4 text-center">✅</td>
                </tr>
                <tr className="border-b border-hub-border">
                  <td className="p-4">Barèmes officiels CI</td>
                  <td className="p-4 text-center">❌</td>
                  <td className="p-4 text-center">✅</td>
                  <td className="p-4 text-center">❌</td>
                </tr>
                <tr className="border-b border-hub-border">
                  <td className="p-4">Barèmes spécifiques école</td>
                  <td className="p-4 text-center">❌</td>
                  <td className="p-4 text-center">❌</td>
                  <td className="p-4 text-center">✅ (école)</td>
                </tr>
                <tr className="border-b border-hub-border">
                  <td className="p-4">Bulletins élèves</td>
                  <td className="p-4 text-center">❌</td>
                  <td className="p-4 text-center">✅</td>
                  <td className="p-4 text-center">✅</td>
                </tr>
                <tr className="border-b border-hub-border">
                  <td className="p-4">Export PDF officiel</td>
                  <td className="p-4 text-center">✅</td>
                  <td className="p-4 text-center">✅</td>
                  <td className="p-4 text-center">✅</td>
                </tr>
                <tr className="border-b border-hub-border">
                  <td className="p-4">Paiement Wave</td>
                  <td className="p-4 text-center">✅</td>
                  <td className="p-4 text-center">✅</td>
                  <td className="p-4 text-center">✅</td>
                </tr>
                <tr className="border-b border-hub-border">
                  <td className="p-4">Validation requise</td>
                  <td className="p-4 text-center">❌</td>
                  <td className="p-4 text-center">❌</td>
                  <td className="p-4 text-center text-xs text-hub-muted">
                    École homologuée uniquement
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        )}

        {donnees && (
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Card className="p-6 text-center">
              <p className="text-xs uppercase tracking-wide text-hub-muted">Sport</p>
              <p className="mt-2 font-mono text-xl font-bold text-hub-primary">
                {fmt(donnees.prix_formule_sport_fcfa)}
              </p>
              <Link to="/inscription" className="mt-4 inline-block">
                <Button type="button" className="w-full">
                  Choisir ce plan
                </Button>
              </Link>
            </Card>
            <Card className="p-6 text-center">
              <p className="text-xs uppercase tracking-wide text-hub-muted">Enseignement CI</p>
              <p className="mt-2 font-mono text-xl font-bold text-hub-primary">
                {fmt(donnees.prix_formule_enseignement_ci_fcfa)}
              </p>
              <Link to="/inscription" className="mt-4 inline-block">
                <Button type="button" className="w-full">
                  Choisir ce plan
                </Button>
              </Link>
            </Card>
            <Card className="p-6 text-center">
              <p className="text-xs uppercase tracking-wide text-hub-muted">Français</p>
              <p className="mt-1 text-[11px] text-hub-muted">
                Candidat libre : {fmt(donnees.prix_formule_fr_candidat_libre_fcfa)}
              </p>
              <p className="text-[11px] text-hub-muted">
                École homologuée : {fmt(donnees.prix_formule_fr_ecole_homologuee_fcfa)}
              </p>
              <Link to="/inscription" className="mt-4 inline-block">
                <Button type="button" variant="outline" className="w-full">
                  Choisir ce plan
                </Button>
              </Link>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
