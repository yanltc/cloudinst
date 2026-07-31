from django.urls import path
from . import views

urlpatterns = [
    # Authentification & Compte
    path('inscription/', views.inscription, name='inscription'),
    path('connexion/', views.connexion, name='connexion'),
    path('deconnexion/', views.deconnexion, name='deconnexion'),
    path('profil/', views.profil, name='profil'),
    path('supprimer_compte/', views.supprimer_compte, name='supprimer_compte'),
    
    # Gestion des Sites
    path('sites/mes-sites/', views.mes_sites, name='mes_sites'),
    path('sites/creer/', views.creer_site, name='creer_site'),
    path('sites/<int:site_id>/supprimer/', views.supprimer_site, name='supprimer_site'),
    path('sites/<int:site_id>/publication/', views.publier_site, name='publication_site'),
    path('sites/<int:site_id>/exporter/', views.exporter_site, name='exporter_site'),
    path('sites/importer/', views.importer_site, name='importer_site'),
    path('sites/<int:site_id>/statistiques/', views.statistiques_site, name='statistiques_site'),
    
    # Gestion des Fichiers d'un site
    path('sites/<int:site_id>/fichiers/', views.fichiers_site, name='liste_fichiers'),
    path('sites/fichiers/enregistrer/', views.enregistrer_fichier, name='enregistrer_fichier'),
    path('fichiers/<int:file_id>/supprimer/', views.supprimer_fichier, name='supprimer_fichier'),
    
    # Explorateur Public & Aperçu dynamique HTML/CSS/JS
    path('explorateur/', views.explorateur, name='explorateur_sites'),
    path('recherche/', views.recherche_sites, name='recherche_sites'),
    path('populaires/', views.sites_populaires, name='sites_populaires'),
    path('recents/', views.sites_recents, name='sites_recents'),
    path('apercu/<str:sous_domaine>/', views.apercu, name='apercu_index'),
    path('apercu/<str:sous_domaine>/<path:filename>', views.apercu, name='apercu_fichier'),
]