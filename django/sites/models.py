from django.db import models
from django.contrib.auth.models import User

class Site(models.Model):
    utilisateur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sites')
    sous_domaine = models.CharField(max_length=30, unique=True)
    titre = models.CharField(max_length=100)
    publication = models.BooleanField(default=False)
    date_publication = models.DateTimeField(null=True, blank=True)
    nb_visites = models.PositiveIntegerField(default=0)
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sous_domaine} ({self.utilisateur.username})"

class SiteFile(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='files')
    filename = models.CharField(max_length=255)
    contenu = models.TextField(blank=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('site', 'filename') # Empêche d'avoir deux fichiers du même nom sur le même site

    def __str__(self):
        return f"{self.site.sous_domaine} - {self.filename}"