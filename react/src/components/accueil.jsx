import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Accueil({ sites = [], theme = 'sombre', onChangerTheme }) {
  const [siteAafficher, setSiteAafficher] = useState(null);
  const [recherche, setRecherche] = useState('');

  const estSombre = theme === 'sombre';

  // Filtrer les sites publics uniquement
  const sitesPublics = sites.filter((site) => site.visibilite === 'public');

  // 2. Filtrer selon la saisie dans la barre de recherche
  const sitesFiltres = sitesPublics.filter((site) =>
    site.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: estSombre ? '#000000' : '#f5f5f7',
      color: estSombre ? '#ffffff' : '#1d1d1f',
      fontFamily: 'sans-serif',
      paddingBottom: '60px',
      transition: 'all 0.3s ease'
    },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px',
      borderBottom: `1px solid ${estSombre ? '#111111' : '#e5e5e5'}`,
      backgroundColor: estSombre ? '#000000' : '#ffffff'
    },
    logo: { fontSize: '1.4rem', fontWeight: '700', color: '#00bcd4', textDecoration: 'none' },
    navLinks: { display: 'flex', gap: '25px', alignItems: 'center' },
    navItem: { color: estSombre ? '#ffffff' : '#1d1d1f', textDecoration: 'none', fontSize: '0.95rem' },
    btnTheme: {
      backgroundColor: 'transparent',
      border: `1px solid ${estSombre ? '#333333' : '#cccccc'}`,
      color: estSombre ? '#ffffff' : '#1d1d1f',
      padding: '6px 12px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.85rem'
    },

    mainContent: { padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' },
    
    // Section texte explicatif
    textSection: {
      marginBottom: '40px',
      lineHeight: '1.6'
    },
    pageTitle: { fontSize: '2rem', fontWeight: '800', marginBottom: '15px' },
    paragraph: { color: estSombre ? '#aaaaaa' : '#555555', fontSize: '1.05rem', marginBottom: '10px' },

    // Barre supérieure de recherche
    topBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px',
      flexWrap: 'wrap',
      gap: '15px',
      paddingTop: '20px',
      borderTop: `1px solid ${estSombre ? '#111111' : '#e5e5e5'}`
    },
    sectionTitle: { fontSize: '1.4rem', fontWeight: '700', margin: 0 },
    searchInput: {
      padding: '10px 16px',
      borderRadius: '8px',
      border: `1px solid ${estSombre ? '#333333' : '#cccccc'}`,
      backgroundColor: estSombre ? '#121212' : '#ffffff',
      color: estSombre ? '#ffffff' : '#000000',
      fontSize: '0.9rem',
      width: '280px',
      outline: 'none'
    },

    // Liste des cartes
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
    card: {
      backgroundColor: estSombre ? '#0a0a0a' : '#ffffff',
      borderRadius: '12px',
      border: `1px solid ${estSombre ? '#1a1a1a' : '#e5e5e5'}`,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    cardTitle: { fontSize: '1.1rem', fontWeight: '700', margin: 0 },
    cardDate: { fontSize: '0.8rem', color: estSombre ? '#666666' : '#888888', margin: 0 },
    btnVoirSite: { color: '#00bcd4', background: 'none', border: 'none', textAlign: 'left', padding: 0, cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' },

    modalPleinEcran: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#000000', zIndex: 2000, display: 'flex', flexDirection: 'column' },
    modalBarreNav: { padding: '12px 24px', backgroundColor: '#121212', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    btnFermer: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
  };

  return (
    <div style={styles.container}>
      {/* Barre de navigation */}
      <header style={styles.navbar}>
        <Link to="/accueil" style={styles.logo}>CloudInst</Link>
        <nav style={styles.navLinks}>
          <Link to="/creersite" style={styles.navItem}>Créer un site</Link>
          <Link to="/profil" style={styles.navItem}>Profil</Link>
          <button style={styles.btnTheme} onClick={onChangerTheme}>
            {estSombre ? '☀️' : '🌙'}
          </button>
        </nav>
      </header>

      {/* Contenu principal */}
      <main style={styles.mainContent}>
        
        {/* Section Texte de présentation */}
        <section style={styles.textSection}>
          <h1 style={styles.pageTitle}>Bienvenue sur CloudInst</h1>
          <p style={styles.paragraph}>
            CloudInst est une plateforme dédiée à l'hébergement et au partage de projets web statiques (HTML, CSS, JavaScript).
          </p>
          <p style={styles.paragraph}>
            Parcourez ci-dessous la liste des projets publics publiés par la communauté. Vous pouvez rechercher un projet par son nom ou créer le vôtre depuis la rubrique dédiée.
          </p>
        </section>

        {/* Barre de recherche & Titre de section */}
        <div style={styles.topBar}>
          <h2 style={styles.sectionTitle}>Liste des sites publics</h2>
          
          <input
            type="text"
            placeholder="Rechercher un site..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Liste des sites */}
        {sitesFiltres.length === 0 ? (
          <p style={{ color: estSombre ? '#666666' : '#888888' }}>
            {recherche ? `Aucun projet ne correspond à "${recherche}".` : 'Aucun site public disponible pour le moment.'}
          </p>
        ) : (
          <div style={styles.grid}>
            {sitesFiltres.map((site) => (
              <div key={site.id} style={styles.card}>
                <h3 style={styles.cardTitle}>{site.nom}</h3>
                <p style={styles.cardDate}>Publié le : {site.dateCreation}</p>
                <button style={styles.btnVoirSite} onClick={() => setSiteAafficher(site)}>
                  Consulter le projet →
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Aperçu du site sélectionné */}
      {siteAafficher && (
        <div style={styles.modalPleinEcran}>
          <div style={styles.modalBarreNav}>
            <span style={{ color: '#00bcd4', fontWeight: 'bold' }}>Aperçu : {siteAafficher.nom}</span>
            <button style={styles.btnFermer} onClick={() => setSiteAafficher(null)}>Fermer ✕</button>
          </div>
          <iframe srcDoc={siteAafficher.code} title={siteAafficher.nom} sandbox="allow-scripts" style={{ width: '100%', height: '100%', border: 'none', backgroundColor: '#ffffff' }} />
        </div>
      )}
    </div>
  );
}

export default Accueil;