import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Profil({ utilisateur, nombreSites, onDeconnexion, theme = 'sombre', onChangerTheme }) {
  const navigate = useNavigate();
  const estSombre = theme === 'sombre';

const handleDeconnexionClick = async () => {
    // 1. On récupère le token du localStorage
    const token = localStorage.getItem('token');

    // 2. On appelle Django si le token existe
    if (token) {
      try {
        await fetch('http://127.0.0.1:8000/deconnexion/', { // Ajuste l'URL au besoin
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });
      } catch (error) {
        console.error("Erreur lors de la déconnexion :", error);
      }
    }

    // 3. On supprime le token localement
    localStorage.removeItem('token');

    // 4. Tes fonctions de redirection actuelles
    if (onDeconnexion) {
      onDeconnexion();
    }
    navigate('/');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: estSombre ? '#000000' : '#f5f5f7',
      color: estSombre ? '#ffffff' : '#1d1d1f',
      fontFamily: 'sans-serif',
      transition: 'all 0.3s ease'
    },
    navbar: {
      display: 'flex',
      justify: 'space-between',
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
    mainContent: { padding: '60px 20px', maxWidth: '600px', margin: '0 auto' },
    userCard: {
      backgroundColor: estSombre ? '#0a0a0a' : '#ffffff',
      border: `1px solid ${estSombre ? '#1a1a1a' : '#e5e5e5'}`,
      borderRadius: '16px',
      padding: '35px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px'
    },
    userName: { fontSize: '1.6rem', fontWeight: '700', margin: '0 0 5px 0' },
    userEmail: { color: estSombre ? '#888888' : '#666666', margin: 0, fontSize: '0.95rem' },
    statsBadge: {
      width: '100%',
      backgroundColor: estSombre ? '#121212' : '#f0f0f2',
      border: `1px solid ${estSombre ? '#222222' : '#e0e0e0'}`,
      color: '#00bcd4',
      padding: '15px',
      borderRadius: '10px',
      fontSize: '1.1rem',
      fontWeight: 'bold'
    },
    btnDeconnexion: { width: '100%', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '10px' }
  };

  return (
    <div style={styles.container}>
      <header style={styles.navbar}>
        <Link to="/accueil" style={styles.logo}>CloudInst</Link>
        <nav style={styles.navLinks}>
          <Link to="/accueil" style={styles.navItem}>Accueil</Link>
          <Link to="/creersite" style={styles.navItem}>Créer un site</Link>
          <button style={styles.btnTheme} onClick={onChangerTheme}>
            {estSombre ? '☀️' : '🌙'}
          </button>
        </nav>
      </header>

      <main style={styles.mainContent}>
        <div style={styles.userCard}>
          <div>
            <h1 style={styles.userName}>{utilisateur?.nom || 'Mon Profil'}</h1>
            <p style={styles.userEmail}>{utilisateur?.email || 'utilisateur@example.com'}</p>
          </div>

          <div style={styles.statsBadge}>
            {nombreSites} site{nombreSites > 1 ? 's' : ''} créé{nombreSites > 1 ? 's' : ''}
          </div>

          <button style={styles.btnDeconnexion} onClick={handleDeconnexionClick}>
            Déconnexion
          </button>
        </div>
      </main>
    </div>
  );
}

export default Profil;