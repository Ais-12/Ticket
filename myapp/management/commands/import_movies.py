from django.core.management.base import BaseCommand
from myapp.models import Movie, MovieType, Actor, Language, Theater, Show
import json
from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.get(username='adminusername')
user.is_staff = True
user.is_superuser = True  # if you want full admin rights
user.save()
class Command(BaseCommand):
    help = 'Import movies and theaters from JSON files'

    def handle(self, *args, **kwargs):
        # Import Movies
        with open('movies.json') as f:
            movies_data = json.load(f)
        for movie in movies_data:
            movie_obj, created = Movie.objects.get_or_create(
                name=movie['name'],
                defaults={
                    'rating': movie.get('rating', 0),
                    'description': movie.get('description', ''),
                    'category': movie.get('category', ''),
                    'poster': f"movie_posters/{movie['poster'].split('/')[-1]}",
                    'released_date': movie.get('released_date', None),
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created Movie: {movie_obj.name}"))
            else:
                self.stdout.write(self.style.WARNING(f"Movie already exists: {movie_obj.name}"))

            # ManyToMany relationships
            for type_name in movie.get('type', []):
                movie_type, _ = MovieType.objects.get_or_create(name=type_name)
                movie_obj.type.add(movie_type)
            for lang_name in movie.get('languages', []):
                language, _ = Language.objects.get_or_create(name=lang_name)
                movie_obj.languages.add(language)
            for actor_name in movie.get('actors', []):
                actor, _ = Actor.objects.get_or_create(name=actor_name)
                movie_obj.actors.add(actor)
            movie_obj.save()

        self.stdout.write(self.style.SUCCESS('Movies imported!'))

        # Import Theaters and Shows
        with open('theater_details.json') as f:
            theaters_data = json.load(f)

        for theater_data in theaters_data:
            theater_obj, created = Theater.objects.get_or_create(
                name=theater_data['theater_name'],
                location=theater_data['location']
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created Theater: {theater_obj.name}"))
            else:
                self.stdout.write(self.style.WARNING(f"Theater already exists: {theater_obj.name}"))

            for show in theater_data['shows']:
                date = show['date']
                for showtime in show['showtimes']:
                    movie_name = showtime['movie']
                    try:
                        movie_obj = Movie.objects.get(name=movie_name)
                    except Movie.DoesNotExist:
                        self.stdout.write(self.style.ERROR(f"Movie '{movie_name}' not found for show at {theater_obj.name}!"))
                        continue
                    show_obj, created = Show.objects.get_or_create(
                        theater=theater_obj,
                        movie=movie_obj,
                        date=date,
                        time=showtime['time'],
                        defaults={'languages': showtime['languages']}
                    )
                    if created:
                        self.stdout.write(self.style.SUCCESS(
                            f"Added Show: {movie_obj.name} at {theater_obj.name} on {date} {showtime['time']}"
                        ))
                    else:
                        self.stdout.write(self.style.WARNING(
                            f"Show already exists: {movie_obj.name} at {theater_obj.name} on {date} {showtime['time']}"
                        ))

        self.stdout.write(self.style.SUCCESS('Theaters and Shows imported!'))
