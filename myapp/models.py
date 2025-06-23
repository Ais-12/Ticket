from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICE =(
        ('admin','Admin'),
        ('customer','Customer'),
    )
    GENDER_CHOICE =(
        ('male','Male'),
        ('female','Female')
    )
    role = models.CharField(max_length =10,choices = ROLE_CHOICE , default ='customer')
    mobile = models.CharField(max_length = 15 , blank =True)
    gender = models.CharField(max_length=6 ,choices= GENDER_CHOICE , blank=True)

# Create your models here.

class Actor(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Language(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class MovieType(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Movie(models.Model):
    name = models.CharField(max_length=255)
    rating = models.FloatField()
    description = models.TextField()
    category = models.CharField(max_length=100)
    poster = models.ImageField(upload_to='movie_posters/')
 # Use URLField if always absolute URLs
    released_date = models.DateField()
    # Many-to-many fields for lists
    actors = models.ManyToManyField(Actor)
    languages = models.ManyToManyField(Language)
    type = models.ManyToManyField(MovieType)

    def __str__(self):
        return self.name
    
class Theater(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} ({self.location})"

class Show(models.Model):
    theater = models.ForeignKey(Theater,related_name="shows", on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie,on_delete=models.CASCADE,related_name="shows")
    date = models.DateField()
    time = models.TimeField()
    languages = models.JSONField()   
    
    def __str__(self):
        langs = ", ".join(self.languages) if isinstance(self.languages, list) else str(self.languages)
        return f"{self.movie.name} at {self.theater.name} on {self.date} {self.time} [{langs}]"


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    mobile = models.CharField(max_length=15)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.email})"

    