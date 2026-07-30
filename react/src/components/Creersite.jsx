import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { createSite, saveFichier } from '../api';

function CreerSite({ sites = [], onAjouterSite, onSupprimerSite, onModifierSite, theme = 'sombre', onChangerTheme }) {
  const fileInputRef = useRef(null);
  const estSombre = theme === 'sombre';

  const [nomSite, setNomSite] = useState('');
  const [visibilite, setVisibilite] = useState('prive');
  const [code, setCode] = useState(
`<!DOCTYPE html>
<html lang="fr">
<head>
  <style>
    body { font-family: sans-serif; padding: 20px; background: #121212; color: #fff; }
    h1 { color: #00bcd4; }
  </style>
</head>
<body>
  <h1>Projet Statique</h1>
  <p>Bonjour, bienvenue sur votre nouveau site !</p>
</body>
</html>`
  );

  const [fichierImporte, setFichierImporte] = useState(null);
  const [modeRedaction, setModeRedaction] = useState(false);
  const [erreur, setErreur] = useState('');
  const [siteAafficher, setSiteAafficher] = useState(null);
  const [siteEnEdition, setSiteEnEdition] = useState(null);

  // Lecture du fichier téléversé localement
  const gererFichier = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFichierImporte(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        setCode(evt.target.result);
        setModeRedaction(true);
      };
      reader.readAsText(file);
    }
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!nomSite.trim()) {
    setErreur('Veuillez donner un nom à votre projet.');
    return;
  }

  // Le backend attend un "sous_domaine", pas juste un "nom" -- 
  // il faut en générer un (slug) à partir du nom du site
  const sousDomaine = nomSite
    .trim()
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // enlève les accents
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-');

  const resSite = await createSite(sousDomaine, nomSite);

  if (resSite.erreur) {
    setErreur(resSite.erreur);
    return;
  }

  // Une fois le site créé, on enregistre le code dans index.html
  await saveFichier(resSite.id, 'index.html', code);

  // On prévient le parent pour qu'il recharge la vraie liste depuis le serveur
  if (onAjouterSite) {
    onAjouterSite(resSite);
  }

  setNomSite('');
  setFichierImporte(null);
  setErreur('');
  setModeRedaction(false);
};

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: estSombre ? '#000000' : '#f5f5f7',
      color: estSombre ? '#ffffff' : '#1d1d1f',
      fontFamily: 'sans-serif',
      padding: '40px 20px',
      transition: 'all 0.3s ease'
    },
    wrapper: { maxWidth: '1100px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { fontSize: '1.8rem', fontWeight: '700', margin: 0 },
    btnTheme: {
      backgroundColor: 'transparent',
      border: `1px solid ${estSombre ? '#333333' : '#cccccc'}`,
      color: estSombre ? '#ffffff' : '#1d1d1f',
      padding: '6px 12px',
      borderRadius: '6px',
      cursor: 'pointer'
    },
    cardPanel: {
      backgroundColor: estSombre ? '#0a0a0a' : '#ffffff',
      padding: '25px',
      borderRadius: '12px',
      border: `1px solid ${estSombre ? '#1a1a1a' : '#e5e5e5'}`,
      marginBottom: '40px'
    },
    formFlex: { display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' },
    input: {
      flex: '2',
      minWidth: '220px',
      padding: '12px 16px',
      borderRadius: '8px',
      border: `1px solid ${estSombre ? '#333333' : '#cccccc'}`,
      backgroundColor: estSombre ? '#121212' : '#ffffff',
      color: estSombre ? '#ffffff' : '#000000',
      fontSize: '0.95rem',
      outline: 'none'
    },
    selectVisibilite: {
      padding: '12px 16px',
      borderRadius: '8px',
      border: `1px solid ${estSombre ? '#333333' : '#cccccc'}`,
      backgroundColor: estSombre ? '#121212' : '#ffffff',
      color: estSombre ? '#ffffff' : '#000000',
      fontSize: '0.95rem',
      cursor: 'pointer'
    },
    btnSecondary: { flex: '1', padding: '12px 20px', borderRadius: '8px', border: '1px solid #00bcd4', backgroundColor: 'transparent', color: '#00bcd4', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer' },
    btnPrimary: { padding: '12px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#00bcd4', color: '#000000', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer' },
    btnCancel: { padding: '12px 20px', borderRadius: '8px', border: '1px solid #333333', backgroundColor: 'transparent', color: '#888888', fontSize: '0.95rem', cursor: 'pointer' },
    editorGrid: { display: 'flex', gap: '20px', height: '480px', marginTop: '20px' },
    editorBox: { flex: 1, border: '1px solid #222222', borderRadius: '8px', overflow: 'hidden' },
    previewBox: { flex: 1, border: '1px solid #222222', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#ffffff' },
    erreurBox: { backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px' },
    sectionTitle: { fontSize: '1.4rem', marginBottom: '20px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' },
    card: {
      backgroundColor: estSombre ? '#0a0a0a' : '#ffffff',
      borderRadius: '12px',
      border: `1px solid ${estSombre ? '#1a1a1a' : '#e5e5e5'}`,
      padding: '25px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    cardTitle: { fontSize: '1.2rem', fontWeight: '700', margin: 0 },
    badgeVisibilite: (v) => ({
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      backgroundColor: v === 'public' ? 'rgba(0, 188, 212, 0.15)' : 'rgba(255, 152, 0, 0.15)',
      color: v === 'public' ? '#00bcd4' : '#ff9800',
      border: `1px solid ${v === 'public' ? '#00bcd4' : '#ff9800'}`
    }),
    actionsRow: { display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' },
    btnEdit: { padding: '8px 12px', borderRadius: '6px', border: `1px solid ${estSombre ? '#333' : '#ccc'}`, backgroundColor: estSombre ? '#121212' : '#f0f0f2', color: estSombre ? '#fff' : '#000', cursor: 'pointer', fontSize: '0.85rem' },
    btnDelete: { padding: '8px 12px', borderRadius: '6px', border: 'none', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' },
    btnToggleVis: { padding: '8px 12px', borderRadius: '6px', border: `1px solid ${estSombre ? '#333' : '#ccc'}`, backgroundColor: 'transparent', color: estSombre ? '#aaa' : '#666', cursor: 'pointer', fontSize: '0.85rem' },
    modalPleinEcran: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#000000', zIndex: 2000, display: 'flex', flexDirection: 'column' },
    modalBarreNav: { padding: '12px 24px', backgroundColor: '#121212', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Créer un projet statique</h1>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/accueil" style={{ color: estSombre ? '#888888' : '#666666', textDecoration: 'none' }}>Retour à l'accueil</Link>
            <button style={styles.btnTheme} onClick={onChangerTheme}>
              {estSombre ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {erreur && <div style={styles.erreurBox}>{erreur}</div>}

        {/* Panneau de saisie / importation */}
        <div style={styles.cardPanel}>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
            <label style={{ color: estSombre ? '#888' : '#666' }}>Visibilité du projet :</label>
            <select
              value={visibilite}
              onChange={(e) => setVisibilite(e.target.value)}
              style={styles.selectVisibilite}
            >
              <option value="prive">Privé (Visible uniquement ici)</option>
              <option value="public">Public (Visible sur l'Accueil et ici)</option>
            </select>
          </div>

          {!modeRedaction ? (
            <div style={styles.formFlex}>
              <input
                type="text"
                placeholder="Nom du projet (ex: Portfolio)"
                value={nomSite}
                onChange={(e) => setNomSite(e.target.value)}
                style={styles.input}
              />
              <input type="file" ref={fileInputRef} accept=".html,.css,.js,.txt" onChange={gererFichier} style={{ display: 'none' }} />
              <button style={styles.btnSecondary} onClick={() => fileInputRef.current.click()}>
                {fichierImporte ? fichierImporte : 'Importer un fichier'}
              </button>
              <button style={styles.btnPrimary} onClick={() => setModeRedaction(true)}>
                Rédiger du code
              </button>
            </div>
          ) : (
            <div>
              <div style={{ ...styles.formFlex, marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Nom du projet (ex: Portfolio)"
                  value={nomSite}
                  onChange={(e) => setNomSite(e.target.value)}
                  style={styles.input}
                />
                <button style={styles.btnCancel} onClick={() => setModeRedaction(false)}>Masquer l'éditeur</button>
                <button style={styles.btnPrimary} onClick={handleSubmit}>Enregistrer & Publier</button>
              </div>

              {/* Éditeur et aperçu en direct */}
              <div style={styles.editorGrid}>
                <div style={styles.editorBox}>
                  <Editor height="100%" defaultLanguage="html" theme={estSombre ? "vs-dark" : "light"} value={code} onChange={(val) => setCode(val || '')} />
                </div>
                <div style={styles.previewBox}>
                  <iframe srcDoc={code} title="Aperçu statique" sandbox="allow-scripts" style={{ width: '100%', height: '100%', border: 'none' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Liste personnelle des projets */}
        <h2 style={styles.sectionTitle}>Tous mes projets créés</h2>

        {sites.length === 0 ? (
          <p style={{ color: estSombre ? '#666666' : '#888888' }}>Vous n'avez pas encore créé de site.</p>
        ) : (
          <div style={styles.grid}>
            {sites.map((site) => (
              <div key={site.id} style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={styles.cardTitle}>{site.nom}</h3>
                  <span style={styles.badgeVisibilite(site.visibilite)}>
                    {site.visibilite === 'public' ? 'Public' : 'Privé'}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: estSombre ? '#666666' : '#888888', margin: 0 }}>Créé le : {site.dateCreation}</p>

                <button style={{ color: '#00bcd4', background: 'none', border: 'none', textAlign: 'left', padding: 0, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }} onClick={() => setSiteAafficher(site)}>
                  Voir le site
                </button>

                <div style={styles.actionsRow}>
                  <button
                    style={styles.btnToggleVis}
                    onClick={() => onModifierSite({ ...site, visibilite: site.visibilite === 'public' ? 'prive' : 'public' })}
                  >
                    Rendre {site.visibilite === 'public' ? 'Privé' : 'Public'}
                  </button>

                  <button style={styles.btnEdit} onClick={() => setSiteEnEdition(site)}>
                    Modifier
                  </button>

                  <button style={styles.btnDelete} onClick={() => onSupprimerSite(site.id)}>
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rendu modal plein écran */}
      {siteAafficher && (
        <div style={styles.modalPleinEcran}>
          <div style={styles.modalBarreNav}>
            <span style={{ color: '#00bcd4', fontWeight: 'bold' }}>Aperçu : {siteAafficher.nom}</span>
            <button style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }} onClick={() => setSiteAafficher(null)}>Fermer ✕</button>
          </div>
          <iframe srcDoc={siteAafficher.code} title={siteAafficher.nom} sandbox="allow-scripts" style={{ width: '100%', height: '100%', border: 'none', backgroundColor: '#fff' }} />
        </div>
      )}

      {/* Modal d'édition de projet */}
      {siteEnEdition && (
        <div style={styles.modalPleinEcran}>
          <div style={styles.modalBarreNav}>
            <span style={{ color: '#00bcd4', fontWeight: 'bold' }}>Modification du site : {siteEnEdition.nom}</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ backgroundColor: '#00bcd4', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => { onModifierSite(siteEnEdition); setSiteEnEdition(null); }}>Enregistrer les modifications</button>
              <button style={{ backgroundColor: '#333', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }} onClick={() => setSiteEnEdition(null)}>Annuler</button>
            </div>
          </div>
          <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ flex: 1 }}>
              <Editor height="100%" defaultLanguage="html" theme={estSombre ? "vs-dark" : "light"} value={siteEnEdition.code} onChange={(val) => setSiteEnEdition({ ...siteEnEdition, code: val || '' })} />
            </div>
            <div style={{ flex: 1, backgroundColor: '#fff' }}>
              <iframe srcDoc={siteEnEdition.code} title="Aperçu édition" sandbox="allow-scripts" style={{ width: '100%', height: '100%', border: 'none' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreerSite;