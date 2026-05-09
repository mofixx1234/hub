import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api/client';
import { AdminStatsNav } from './AdminStatsNav.jsx';
import { Alert } from '../../components/ui/Alert.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Spinner } from '../../components/ui/Spinner.jsx';

export function BaremesAdmin() {
  const [resume, setResume] = useState(null);
  const [historique, setHistorique] = useState([]);
  const [jsonCi, setJsonCi] = useState('');
  const [jsonEcoleId, setJsonEcoleId] = useState('');
  const [jsonEcoleVal, setJsonEcoleVal] = useState('');
  const [erreur, setErreur] = useState('');
  const [msg, setMsg] = useState('');
  const [chargement, setChargement] = useState(true);
  const [confirmeCi, setConfirmeCi] = useState(false);
  const [confirmeEcole, setConfirmeEcole] = useState(false);

  const charger = useCallback(async () => {
    setErreur('');
    setMsg('');
    setChargement(true);
    try {
      const [r, h] = await Promise.all([
        api.get('/api/admin/baremes'),
        api.get('/api/admin/baremes/historique'),
      ]);
      setResume(r.data);
      setHistorique(h.data.modifications ?? []);
      setJsonCi(JSON.stringify(r.data?.baremes_ci?.valeur ?? {}, null, 2));
    } catch (err) {
      setErreur(err.response?.data?.erreur || err.message || 'Erreur chargement.');
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  async function enregistrerCi(e) {
    e.preventDefault();
    setErreur('');
    setMsg('');
    try {
      const valeur = JSON.parse(jsonCi);
      await api.put('/api/admin/baremes/ci', {
        valeur,
        confirmer_impact: true,
      });
      setMsg('Barème CI enregistré. Les notes déjà saisies ne sont pas recalculées.');
      setConfirmeCi(false);
      await charger();
    } catch (err) {
      if (err instanceof SyntaxError) {
        setErreur('JSON invalide.');
      } else {
        setErreur(err.response?.data?.erreur || err.message);
      }
    }
  }

  async function enregistrerEcole(e) {
    e.preventDefault();
    setErreur('');
    setMsg('');
    if (!jsonEcoleId.trim()) {
      setErreur('Choisissez une école par son identifiant.');
      return;
    }
    try {
      const baremes = JSON.parse(jsonEcoleVal || '{}');
      await api.put(`/api/admin/baremes/ecoles/${jsonEcoleId.trim()}`, {
        baremes,
        confirmer_impact: true,
      });
      setMsg('Barème école enregistré.');
      setConfirmeEcole(false);
      await charger();
    } catch (err) {
      if (err instanceof SyntaxError) {
        setErreur('JSON école invalide.');
      } else {
        setErreur(err.response?.data?.erreur || err.message);
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <AdminStatsNav />
        <h1 className="text-2xl font-bold text-slate-900">Barèmes EPS</h1>
        <p className="mt-2 text-sm text-slate-600">
          Modifier les barèmes n’affecte que les{' '}
          <strong>nouvelles</strong> notes calculées après la modification.
        </p>

        {chargement && (
          <div className="mt-12 flex justify-center">
            <Spinner className="h-10 w-10" />
          </div>
        )}

        {!chargement && (
          <>
            {erreur && (
              <Alert type="danger" className="mt-6">
                {erreur}
              </Alert>
            )}
            {msg && (
              <Alert type="success" className="mt-6">
                {msg}
              </Alert>
            )}
            {resume?.avertissement && (
              <Alert type="warning" className="mt-6">
                {resume.avertissement}
              </Alert>
            )}

            <form onSubmit={enregistrerCi} className="mt-8 space-y-4">
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-slate-900">Barème officiel CI (global)</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Clé : {resume?.baremes_ci?.cle} — mis à jour :{' '}
                  {resume?.baremes_ci?.updated_at
                    ? new Date(resume.baremes_ci.updated_at).toLocaleString('fr-FR')
                    : '—'}
                </p>
                <textarea
                  value={jsonCi}
                  onChange={(e) => setJsonCi(e.target.value)}
                  rows={18}
                  className="mt-4 w-full rounded-lg border border-slate-300 bg-white font-mono text-xs text-slate-900"
                />
                <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={confirmeCi}
                    onChange={(e) => setConfirmeCi(e.target.checked)}
                  />
                  Je comprends que seules les nouvelles notes utiliseront ce barème.
                </label>
                <Button type="submit" className="mt-4" disabled={!confirmeCi}>
                  Enregistrer le barème CI
                </Button>
              </Card>
            </form>

            <form onSubmit={enregistrerEcole} className="mt-10 space-y-4">
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-slate-900">Barème par école</h2>
                <label className="mt-2 block text-sm text-slate-600">
                  ID école (UUID)
                  <input
                    value={jsonEcoleId}
                    onChange={(e) => setJsonEcoleId(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
                    placeholder="Collez l’UUID depuis la liste ci-dessous"
                  />
                </label>
                <textarea
                  value={jsonEcoleVal}
                  onChange={(e) => setJsonEcoleVal(e.target.value)}
                  rows={10}
                  placeholder='{"source":"...","epreuves":{}}'
                  className="mt-4 w-full rounded-lg border border-slate-300 bg-white font-mono text-xs text-slate-900"
                />
                <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={confirmeEcole}
                    onChange={(e) => setConfirmeEcole(e.target.checked)}
                  />
                  Je confirme la mise à jour du barème pour cette école.
                </label>
                <Button type="submit" className="mt-4" variant="outline" disabled={!confirmeEcole}>
                  Enregistrer barème école
                </Button>
              </Card>
            </form>

            <Card className="mt-10 p-6">
              <h2 className="text-lg font-semibold text-slate-900">Écoles connues</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {(resume?.ecoles ?? []).map((ec) => (
                  <li key={ec.id} className="rounded-lg border border-slate-200 bg-white p-3">
                    <strong>{ec.nom}</strong>
                    <span className="ml-2 font-mono text-xs text-slate-500">{ec.id}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="mt-10 p-6">
              <h2 className="text-lg font-semibold text-slate-900">Historique (audit)</h2>
              <ul className="mt-4 max-h-96 space-y-3 overflow-y-auto text-xs">
                {historique.map((h) => (
                  <li key={h.id} className="rounded border border-slate-200 bg-white p-3 font-mono">
                    <div className="text-slate-500">
                      {h.created_at ? new Date(h.created_at).toLocaleString('fr-FR') : ''} —{' '}
                      {h.user_id}
                    </div>
                    <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap text-slate-800">
                      {JSON.stringify(h.metadata, null, 2)}
                    </pre>
                  </li>
                ))}
              </ul>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
