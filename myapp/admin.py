from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import Movie, Actor, Language, MovieType , Theater , Show , ContactMessage
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role', 'mobile', 'gender')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('role', 'mobile', 'gender')}),
    )

admin.site.register(User, UserAdmin)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "mobile", "created_at")
    search_fields = ("name", "email", "mobile", "message")
    list_filter = ("created_at",)

User = get_user_model()

try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    pass

@admin.register(Actor)
class ActorAdmin(admin.ModelAdmin):
    search_fields = ['name']

@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    search_fields = ['name']

@admin.register(MovieType)
class MovieTypeAdmin(admin.ModelAdmin):
    search_fields = ['name']

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    autocomplete_fields = ['actors', 'languages', 'type']
    list_display = ['name', 'poster_preview']  # add your other fields as needed

    def poster_preview(self, obj):
        if obj.poster:
            return mark_safe(f'<img src="{obj.poster.url}" width="80" height="120" />')
        return "No Image"

    poster_preview.short_description = 'Poster'
    

@admin.register(Theater)
class TheaterAdmin(admin.ModelAdmin):
    search_fields = ['name', 'location']

@admin.register(Show)
class ShowAdmin(admin.ModelAdmin):
    list_display = ['movie', 'theater', 'date', 'time']
    list_filter = ['date', 'theater', 'movie']
    search_fields = ['movie__name', 'theater__name']

    
    