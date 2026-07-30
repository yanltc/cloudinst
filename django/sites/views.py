import mimetypes
import os
import re
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import F
from django.http import Http404, HttpResponse
from django.utils import timezone
from django.views.decorators.clickjacking import xframe_options_exempt
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Site, SiteFile
from .serializers import SiteFileSerializer, SiteSerializer

SOUS_DOMAINES = {'admin', 'api', 'www', 'static', 'media', 'help', 'login', 'register', 'dashboard'}
SUBDOMAIN_REGEX = r'^[a-z0-9-]{3,30}$'


@api_view(['POST'])
def inscription(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({"erreur": "Nom d'utilisateur et mot de passe requis"}, status=400)
    if User.objects.filter(username__iexact=username).exists(): 
        return Response({"erreur": "Ce nom d'utilisateur est déjà pris"}, status=400)
    
    User.objects.create_user(username=username, password=password)
    return Response({"message": "Compte créé"}, status=201)


@api_view(['POST'])
def connexion(request):
    username = request.data.get('username')
    password = request.data.get('password')
    utilisateur = authenticate(username=username, password=password)
    if utilisateur is None:
        return Response({"erreur": "Nom d'utilisateur ou mot de passe incorrect"}, status=401)
    
    token, _ = Token.objects.get_or_create(user=utilisateur)
    return Response({"token": token.key, "username": utilisateur.username})


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def deconnexion(request):
    Token.objects.filter(user=request.user).delete()
    return Response({"message": "Déconnecté"})


@api_view(['GET', 'PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def profil(request):
    if request.method == 'GET':
        return Response({
            "username": request.user.username,
            "email": request.user.email,
            "date_inscription": request.user.date_joined,
            "nombre_sites": request.user.sites.count(),
        })

    email = request.data.get('email')
    nouveau_username = request.data.get('username')
    if email is not None:
        request.user.email = email
    if nouveau_username and nouveau_username != request.user.username: 
        if User.objects.filter(username__iexact=nouveau_username).exists():
            return Response({"erreur": "Ce nom d'utilisateur est déjà pris"}, status=400)
        request.user.username = nouveau_username
    request.user.save()
    return Response({"message": "Profil mis à jour"})


@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def supprimer_compte(request):
    request.user.delete()
    return Response({"message": "Compte supprimé"})


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def mes_sites(request):
    sites = request.user.sites.all().order_by('-date_creation')
    serializer = SiteSerializer(sites, many=True)
    return Response({"sites": serializer.data})


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def creer_site(request):
    sous_domaine = (request.data.get('sous_domaine') or '').strip().lower()
    titre = request.data.get('titre') or sous_domaine

    if not sous_domaine:
        return Response({"erreur": "Le sous-domaine est requis"}, status=400)

    if not re.match(SUBDOMAIN_REGEX, sous_domaine):
        return Response({"erreur": "Le sous-domaine doit contenir entre 3 et 30 caractères (minuscules, chiffres, tirets)"}, status=400)

    if sous_domaine in SOUS_DOMAINES:
        return Response({"erreur": "Ce nom de sous-domaine est réservé par le système"}, status=400)

    if Site.objects.filter(sous_domaine=sous_domaine).exists():
        return Response({"erreur": "Ce sous-domaine est déjà pris"}, status=400)

    if request.user.sites.filter(titre__iexact=titre).exists():
        return Response({"erreur": "Ce titre de site est déjà pris"}, status=400)

    serializer = SiteSerializer(data={"sous_domaine": sous_domaine, "titre": titre})
    if serializer.is_valid():
        site = serializer.save(utilisateur=request.user)

        code_html_defaut = (
            "<!DOCTYPE html>\n"
            "<html lang=\"fr\">\n"
            "<head>\n"
            "  <meta charset=\"UTF-8\">\n"
            "  <title>" + titre + "</title>\n"
            "  <style>\n"
            "    body { font-family: sans-serif; padding: 40px; background: #121212; color: #fff; text-align: center; }\n"
            "    h1 { color: #00bcd4; }\n"
            "  </style>\n"
            "</head>\n"
            "<body>\n"
            "  <h1>" + titre + "</h1>\n"
            "  <p>Bienvenue sur CloudInst !</p>\n"
            "</body>\n"
            "</html>"
        )
        SiteFile.objects.create(site=site, filename='index.html', contenu=code_html_defaut)

        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def supprimer_site(request, site_id):
    try:
        site = request.user.sites.get(id=site_id)
    except Site.DoesNotExist:
        return Response({"erreur": "Site introuvable"}, status=404)
    site.delete()
    return Response({"message": "Site supprimé"})


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def fichiers_site(request, site_id):
    try:
        site = request.user.sites.get(id=site_id)
    except Site.DoesNotExist:
        return Response({"erreur": "Site introuvable"}, status=404)

    fichiers = site.files.all()
    site_serializer = SiteSerializer(site)
    fichiers_serializer = SiteFileSerializer(fichiers, many=True)

    return Response({
        "site": site_serializer.data,
        "fichiers": fichiers_serializer.data,
    })


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def enregistrer_fichier(request):
    site_id = request.data.get('site_id')
    raw_filename = request.data.get('filename')
    contenu = request.data.get('contenu', '')

    if not site_id or not raw_filename:
        return Response({"erreur": "site_id et filename sont requis"}, status=400)

    filename = os.path.basename(raw_filename.strip())

    try:
        site = request.user.sites.get(id=site_id)
    except Site.DoesNotExist:
        return Response({"erreur": "Site introuvable"}, status=404)

    fichier, created = SiteFile.objects.update_or_create(
        site=site, filename=filename, defaults={'contenu': contenu}
    )
    serializer = SiteFileSerializer(fichier)
    return Response({"message": "Fichier enregistré", "fichier": serializer.data})


@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def supprimer_fichier(request, file_id):
    try:
        fichier = SiteFile.objects.get(id=file_id, site__utilisateur=request.user)
    except SiteFile.DoesNotExist:
        return Response({"erreur": "Fichier introuvable"}, status=404)
    fichier.delete()
    return Response({"message": "Fichier supprimé"})


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def publier_site(request,site_id):
    site_id = request.data.get('site_id')
    if not site_id:
        return Response({"erreur": "site_id est requis"}, status=400)
    try:
        site = request.user.sites.get(id=site_id)
    except Site.DoesNotExist:
        return Response({"erreur": "Site introuvable"}, status=404)

    site.publication = not site.publication
    if site.publication:
        site.date_publication = timezone.now()
    site.save()
    serializer = SiteSerializer(site)
    return Response(serializer.data)


@xframe_options_exempt
def apercu(request, sous_domaine, filename='index.html'):
    try:
        site = Site.objects.get(sous_domaine=sous_domaine)
    except Site.DoesNotExist:
        raise Http404("Site introuvable")

    clean_filename = os.path.basename(filename)

    if not site.publication:
        token_str = request.GET.get('token')
        if not token_str:
            return HttpResponse("Ce site est privé. Token requis.", status=401)

        try:
            token = Token.objects.get(key=token_str)
            if site.utilisateur != token.user:
                return HttpResponse("Accès refusé : vous n'êtes pas le propriétaire", status=403)
        except Token.DoesNotExist:
            return HttpResponse("Token invalide", status=401)

    try:
        fichier = site.files.get(filename=clean_filename)
    except SiteFile.DoesNotExist:
        return HttpResponse(f"Le fichier '{clean_filename}' n'existe pas sur ce site.", status=404)

    if site.publication and clean_filename == 'index.html':
        Site.objects.filter(pk=site.pk).update(nb_visites=F('nb_visites') + 1)

    content_type, _ = mimetypes.guess_type(clean_filename)
    if not content_type:
        content_type = 'text/plain'

    return HttpResponse(fichier.contenu, content_type=content_type)


@api_view(['GET'])
def explorateur(request):
    try:
        limite = max(int(request.GET.get('limite', 12)), 0)
        depart = max(int(request.GET.get('depart', 0)), 0)
    except ValueError:
        return Response({"erreur": "limite et depart doivent être des nombres"}, status=400)

    sites_publics = Site.objects.filter(publication=True).order_by('-date_publication')
    total = sites_publics.count()
    page = sites_publics[depart:depart + limite]

    data = [
        {
            "id": s.id,
            "sous_domaine": s.sous_domaine,
            "titre": s.titre,
            "nb_visites": s.nb_visites,
            "date_publication": s.date_publication,
            "auteur": s.utilisateur.username
        }
        for s in page
    ]

    return Response({
        "sites": data,
        "total": total,
        "limite": limite,
        "depart": depart
    })