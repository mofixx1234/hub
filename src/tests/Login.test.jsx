/**
 * Page Connexion (login) — interaction formulaire.
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Connexion } from '../pages/Connexion.jsx';

const mockConnexion = jest.fn();

jest.mock('../context/AuthContext.jsx', () => ({
  useAuth: () => ({
    connexion: mockConnexion,
    pret: true,
  }),
}));

describe('Connexion (Login)', () => {
  beforeEach(() => {
    mockConnexion.mockReset();
  });

  it('affiche le titre et le bouton de connexion', () => {
    render(
      <MemoryRouter initialEntries={['/connexion']}>
        <Routes>
          <Route path="/connexion" element={<Connexion />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /connexion/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('appelle connexion() avec e-mail et mot de passe', async () => {
    mockConnexion.mockResolvedValue({});

    render(
      <MemoryRouter initialEntries={['/connexion']}>
        <Routes>
          <Route path="/connexion" element={<Connexion />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'secret1234' },
    });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(mockConnexion).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'user@example.com',
          mot_de_passe: 'secret1234',
        })
      );
    });
  });
});
