from django.http import HttpResponse
from .models import Site, SiteFile

class SousDomaineMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Récupération de l'hôte sans le port
        host = request.get_host().split(':')[0]
        parts = host.split('.')

        # Vérifie si la requête provient d'un sous-domaine valide
        if len(parts) >= 3 and parts[0] not in ('www', 'localhost'):
            sous_domaine = parts[0]
            try:
                site = Site.objects.get(sous_domaine__iexact=sous_domaine, publication=True)
            except Site.DoesNotExist:
                site = None

            if site:
                chemin = request.path.strip('/')
                filename = chemin if chemin else 'index.html'

                # Incrémentation du compteur de visites pour la page d'accueil
                if filename == 'index.html':
                    site.nb_visites += 1
                    site.save()

                # Recherche du fichier associé au site
                try:
                    fichier = site.files.get(filename=filename)
                except SiteFile.DoesNotExist:
                    return HttpResponse("Fichier introuvable", status=404)

                # Détermination du Type MIME
                if filename.endswith('.css'):
                    content_type = 'text/css'
                elif filename.endswith('.js'):
                    content_type = 'application/javascript'
                elif filename.endswith('.png'):
                    content_type = 'image/png'
                elif filename.endswith('.jpg') or filename.endswith('.jpeg'):
                    content_type = 'image/jpeg'
                elif filename.endswith('.svg'):
                    content_type = 'image/svg+xml'
                else:
                    content_type = 'text/html'

                return HttpResponse(fichier.contenu, content_type=content_type)

        return self.get_response(request)