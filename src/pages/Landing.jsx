import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Navbar } from '../components/Layout/Navbar.jsx';
import { Footer } from '../components/Layout/Footer.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';

/** Page d'accueil publique — thème sombre, mobile-first. */
export function Landing() {
  const { connecte, pret } = useAuth();

  if (pret && connecte) {
    return <Navigate to="/tableau-de-bord" replace />;
  }

  const features = [
    { emoji: '🔐', titre: 'Compte unique, multi-accès', texte: 'Un seul login pour Sport et Enseignement.' },
    { emoji: '💳', titre: 'Paiement Wave', texte: 'Orange Money, Moov, Mobile Money CI.' },
    { emoji: '📊', titre: 'Statistiques temps réel', texte: 'Tableaux de bord et tendances.' },
    { emoji: '📄', titre: 'Export PDF officiel', texte: 'Bordereaux et rapports prêts à imprimer.' },
    { emoji: '🔒', titre: 'Données isolées', texte: 'Chaque prof et entraîneur reste propriétaire de ses données.' },
    { emoji: '📱', titre: 'Tous appareils', texte: 'Navigateur web, 4G/5G — rien à installer.' },
  ];

  return (
    <div className="hub-surface flex min-h-screen flex-col font-sans">
      <Navbar variant="public" connecte={false} />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(124,58,237,0.25),transparent)]" />
          <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-hub-primary">
                Côte d&apos;Ivoire 🇨🇮
              </p>
              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                La plateforme tout-en-un pour les clubs et enseignants EPS de Côte d&apos;Ivoire
              </h1>
              <p className="mt-6 text-lg text-hub-muted">
                Gérez vos équipes, évaluez vos élèves, suivez vos performances. Paiement Wave.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link to="/inscription" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">
                    Commencer gratuitement →
                  </Button>
                </Link>
                <a href="#fonctionnalites" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full border-hub-border sm:w-auto">
                    Voir les fonctionnalités
                  </Button>
                </a>
                <Link to="/comparer-offres" className="w-full sm:w-auto">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto text-hub-muted">
                    Comparer les offres
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mockup dashboard */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="rounded-2xl border border-hub-border bg-hub-surface p-3 shadow-2xl shadow-hub-secondary/10 sm:p-4">
                <div className="mb-3 flex items-center gap-2 border-b border-hub-border pb-3">
                  <div className="h-3 w-3 rounded-full bg-hub-danger/80" />
                  <div className="h-3 w-3 rounded-full bg-hub-warning/80" />
                  <div className="h-3 w-3 rounded-full bg-hub-success/80" />
                  <span className="ml-2 font-mono text-xs text-hub-muted">hub.ci / tableau-de-bord</span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="rounded-xl bg-hub-surface2 p-3 sm:p-4">
                    <p className="text-xs text-hub-muted">Revenue (démo)</p>
                    <p className="mt-1 font-mono text-lg font-bold text-hub-primary">842 000 F</p>
                  </div>
                  <div className="rounded-xl bg-hub-surface2 p-3 sm:p-4">
                    <p className="text-xs text-hub-muted">Abonnements</p>
                    <p className="mt-1 font-mono text-lg font-bold text-hub-secondary">12 actifs</p>
                  </div>
                  <div className="col-span-2 h-24 rounded-xl bg-gradient-to-r from-hub-primary/20 to-hub-secondary/20 p-3 sm:h-28">
                    <p className="text-xs font-medium text-hub-text">Activité</p>
                    <div className="mt-3 flex h-10 items-end gap-1">
                      {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-hub-primary/60"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rubriques */}
        <section id="rubriques" className="scroll-mt-20 border-t border-hub-border bg-hub-surface px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">Deux rubriques</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-hub-muted">
              Choisissez Sport ou Enseignement — plusieurs abonnements sur un même compte.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <Card className="hover:border-hub-primary/40">
                <div className="text-4xl">🏀</div>
                <h3 className="mt-4 text-xl font-bold text-white">Sport</h3>
                <p className="mt-2 text-sm text-hub-muted">Pour les clubs et entraîneurs</p>
                <ul className="mt-4 space-y-2 text-sm text-hub-text">
                  <li>✓ Gestion d&apos;équipe</li>
                  <li>✓ Statistiques & matchs</li>
                  <li>✓ Performances joueurs</li>
                </ul>
                <p className="mt-6 font-mono text-hub-primary">À partir de 5 000 FCFA / mois*</p>
              </Card>
              <Card className="hover:border-hub-secondary/40">
                <div className="text-4xl">🎓</div>
                <h3 className="mt-4 text-xl font-bold text-white">Enseignement</h3>
                <p className="mt-2 text-sm text-hub-muted">Pour les professeurs d&apos;EPS</p>
                <ul className="mt-4 space-y-2 text-sm text-hub-text">
                  <li>✓ Évaluation BAC</li>
                  <li>✓ Évaluation classe & bulletins</li>
                  <li>✓ Programmes CI & homologués</li>
                </ul>
                <p className="mt-6 font-mono text-hub-secondary">À partir de 5 000 FCFA / mois*</p>
              </Card>
            </div>
            <p className="mt-6 text-center text-xs text-hub-muted">
              *Tarifs indicatifs — le catalogue définit les montants finaux en FCFA.
            </p>
          </div>
        </section>

        {/* Fonctionnalités */}
        <section id="fonctionnalites" className="scroll-mt-20 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold text-white">Fonctionnalités clés</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <Card key={f.titre} className="!p-4">
                  <span className="text-2xl">{f.emoji}</span>
                  <h3 className="mt-2 font-semibold text-white">{f.titre}</h3>
                  <p className="mt-1 text-sm text-hub-muted">{f.texte}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="border-t border-hub-border bg-hub-surface px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold text-white">Comment ça marche</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                { n: '1', titre: 'Créez votre compte', desc: 'Inscription gratuite, une seule session sécurisée.' },
                { n: '2', titre: 'Choisissez votre abonnement', desc: 'Rubrique, formule ou à la carte, puis payez avec Wave.' },
                { n: '3', titre: 'Accédez aux applications', desc: 'Tableau de bord central avec toutes vos apps débloquées.' },
              ].map((s) => (
                <div key={s.n} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-hub-primary text-xl font-bold text-white">
                    {s.n}
                  </div>
                  <h3 className="mt-4 font-semibold text-white">{s.titre}</h3>
                  <p className="mt-2 text-sm text-hub-muted">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Écoles partenaires */}
        <section id="ecoles" className="scroll-mt-20 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-white">Écoles partenaires</h2>
            <p className="mt-4 text-hub-muted">
              Disponible pour <strong className="text-hub-text">Jules Verne</strong> et d&apos;autres écoles
              homologuées (programme français).
            </p>
            <p className="mt-4 text-sm text-hub-muted">
              Votre école n&apos;est pas listée ?{' '}
              <Link to="/contact" className="font-medium text-hub-primary hover:underline">
                Contactez-nous
              </Link>
              .
            </p>
          </div>
        </section>

        {/* CTA final */}
        <section className="border-t border-hub-border bg-gradient-to-br from-hub-secondary/20 to-hub-primary/10 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Rejoignez les clubs et enseignants qui nous font confiance
            </h2>
            <Link to="/inscription" className="mt-8 inline-block w-full sm:w-auto">
              <Button size="lg" className="w-full sm:min-w-[280px]">
                S&apos;inscrire maintenant — C&apos;est gratuit
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
