/**
 * Tableau de bord — rendu minimal avec données mockées.
 */
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TableauDeBord } from '../pages/TableauDeBord.jsx';

jest.mock('../api/client', () => ({
  api: {
    get: jest.fn(() =>
      Promise.resolve({
        data: { abonnements: [], applications: [] },
      })
    ),
  },
  definirJeton: jest.fn(),
}));

jest.mock('../context/AuthContext.jsx', () => ({
  useAuth: () => ({
    utilisateur: {
      id: 'u1',
      prenom: 'Test',
      nom: 'User',
      email: 'test@example.com',
      type_utilisateur: 'entraineur',
      onboarding_complete: true,
    },
    deconnexion: jest.fn(),
    pret: true,
  }),
}));

describe('TableauDeBord', () => {
  it('affiche le titre après chargement', async () => {
    render(
      <MemoryRouter>
        <TableauDeBord />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /tableau de bord/i })).toBeInTheDocument();
    });
  });
});
