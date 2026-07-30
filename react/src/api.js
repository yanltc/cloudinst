const API_URL = 'http://127.0.0.1:8000';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Token ${token}` } : {})
  };
};

export const fetchMesSites = () => 
  fetch(`${API_URL}/sites/mes-sites/`, { headers: getHeaders() }).then(res => res.json());

export const createSite = (sousDomaine, titre) => 
  fetch(`${API_URL}/sites/creer/`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ sous_domaine: sousDomaine, titre }) }).then(res => res.json());

export const deleteSite = (siteId) => 
  fetch(`${API_URL}/sites/${siteId}/supprimer/`, { method: 'DELETE', headers: getHeaders() }).then(res => res.json());

export const togglePublishSite = (siteId) => 
  fetch(`${API_URL}/sites/${siteId}/publication/`, { method: 'POST', headers: getHeaders() }).then(res => res.json());

export const fetchFichiersSite = (siteId) => 
  fetch(`${API_URL}/sites/${siteId}/fichiers/`, { headers: getHeaders() }).then(res => res.json());

export const saveFichier = (siteId, filename, contenu) => 
  fetch(`${API_URL}/sites/fichiers/enregistrer/`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ site_id: siteId, filename, contenu }) }).then(res => res.json());