import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Accueil from './components/accueil';
import Connexion from './components/connexion';
import Inscription from './components/inscription';
import Profil from './components/profil';
import CreerSite from './components/Creersite';

function App() {
  const [estConnecte, setEstConnecte] = useState(false);

  // Gestion du thème global ('sombre' ou 'clair')
  const [theme, setTheme] = useState('sombre');

  const changerTheme = () => {
    setTheme((prev) => (prev === 'sombre' ? 'clair' : 'sombre'));
  };

  // Informations de l'utilisateur
  const [utilisateur] = useState({
    nom: 'Alexandre',
    email: 'alexandre@example.com',
  });

  // Liste globale des sites hébergés
  const [sites, setSites] = useState([]);

  // Ajouter un nouveau site à la liste
  const ajouterNouveauSite = (nouveauSite) => {
    setSites((prev) => [nouveauSite, ...prev]);
  };

  // Supprimer un site par son ID
  const supprimerSite = (idSite) => {
    setSites((prev) => prev.filter((s) => s.id !== idSite));
  };

  // Mettre à jour un site existant
  const modifierSite = (siteModifie) => {
    setSites((prev) =>
      prev.map((s) => (s.id === siteModifie.id ? siteModifie : s))
    );
  };

  // Gestion de la déconnexion
  const handleDeconnexion = () => {
    setEstConnecte(false);
  };

  // Route sécurisée exigeant d'être connecté
  const RouteProtegee = ({ children }) => {
    return estConnecte ? children : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Connexion onLogin={setEstConnecte} theme={theme} />} />
        <Route path="/inscription" element={<Inscription onLogin={setEstConnecte} theme={theme} />} />

        <Route
          path="/accueil"
          element={
            <RouteProtegee>
              <Accueil sites={sites} theme={theme} onChangerTheme={changerTheme} />
            </RouteProtegee>
          }
        />
        <Route
          path="/creersite"
          element={
            <RouteProtegee>
              <CreerSite
                sites={sites}
                onAjouterSite={ajouterNouveauSite}
                onSupprimerSite={supprimerSite}
                onModifierSite={modifierSite}
                theme={theme}
                onChangerTheme={changerTheme}
              />
            </RouteProtegee>
          }
        />
        <Route
          path="/profil"
          element={
            <RouteProtegee>
              <Profil
                utilisateur={utilisateur}
                nombreSites={sites.length}
                onDeconnexion={handleDeconnexion}
                theme={theme}
                onChangerTheme={changerTheme}
              />
            </RouteProtegee>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;