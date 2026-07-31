import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Accueil from './components/accueil';
import Connexion from './components/connexion';
import Inscription from './components/inscription';
import Profil from './components/profil';
import CreerSite from './components/Creersite';
import { fetchMesSites } from './api';

function App() {
  const [estConnecte, setEstConnecte] = useState(false);
  const [theme, setTheme] = useState('sombre');
  const [sites, setSites] = useState([]);
  const [chargement, setChargement] = useState(true);

  // ✅ NOUVEAU : Charger les sites au démarrage
  const chargerSites = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setChargement(false);
      return;
    }

    try {
      const data = await fetchMesSites();
      if (data.sites) {
        setSites(data.sites);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des sites:", error);
    } finally {
      setChargement(false);
    }
  };

  // ✅ NOUVEAU : Vérifier si l'utilisateur est connecté au démarrage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setEstConnecte(true);
      chargerSites();
    } else {
      setChargement(false);
    }
  }, []);

  const changerTheme = () => {
    setTheme((prev) => (prev === 'sombre' ? 'clair' : 'sombre'));
  };

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
    setSites([]);
  };

  // Si chargement, afficher un écran de chargement
  if (chargement) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#fff'
      }}>
        <p>Chargement...</p>
      </div>
    );
  }

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
                utilisateur={{ nom: localStorage.getItem('username') || 'Utilisateur' }}
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