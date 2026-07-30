# serializers.py
from rest_framework import serializers
from .models import Site, SiteFile

class SiteSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Site
        fields = ['id', 'utilisateur', 'sous_domaine', 'titre', 'publication', 'date_publication', 'nb_visites', 'date_creation']
        read_only_fields = ['id', 'utilisateur', 'nb_visites', 'date_creation']


class SiteFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteFile
        fields = ['id', 'site', 'filename', 'contenu', 'date_modification']
        read_only_fields = ['id', 'site', 'date_modification']