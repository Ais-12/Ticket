# serializers.py
from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import Movie, MovieType, Actor, Language , Theater, Show
from .models import ContactMessage

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'
        
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'mobile', 'gender', 'role', 'is_staff', 'is_active']  # Add more if needed
        read_only_fields = ['id']

class UserRegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'mobile', 'gender', 'role', 'password', 'confirm_password')
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password') # checking pass and conpass crt or not
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims from your User model
        token['role'] = user.role
        token['username'] = user.username
        token['is_superuser'] = user.is_superuser
        return token
    

class ActorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actor
        fields = '__all__'

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'

class MovieTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieType
        fields = '__all__'
        

class MovieSerializer(serializers.ModelSerializer):
    actors = ActorSerializer(many=True, read_only=True)
    actor_ids = serializers.PrimaryKeyRelatedField(
        queryset=Actor.objects.all(), many=True, write_only=True, source='actors'
    )
    languages = LanguageSerializer(many=True, read_only=True)
    language_ids = serializers.PrimaryKeyRelatedField(
        queryset=Language.objects.all(), many=True, write_only=True, source='languages'
    )
    type = MovieTypeSerializer(many=True, read_only=True)
    type_ids = serializers.PrimaryKeyRelatedField(
        queryset=MovieType.objects.all(), many=True, write_only=True, source='type'
    )

    class Meta:
        model = Movie
        fields = [
            'id', 'name', 'rating', 'description', 'category', 'poster', 'released_date',
            'actors', 'actor_ids',
            'languages', 'language_ids',
            'type', 'type_ids'
        ]
class TheaterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theater
        fields = '__all__'
        
# serializers.py
class ShowSerializer(serializers.ModelSerializer):
    movie = serializers.PrimaryKeyRelatedField(queryset=Movie.objects.all())
    theater = serializers.PrimaryKeyRelatedField(queryset=Theater.objects.all())
    movie_obj = MovieSerializer(source='movie', read_only=True)
    theater_obj = TheaterSerializer(source='theater', read_only=True)

    class Meta:
        model = Show
        fields = ['id', 'movie', 'theater', 'date', 'time', 'languages', 'movie_obj', 'theater_obj']

