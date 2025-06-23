from django.urls import path, include
from .views import RegisterView
from .views import MyTokenObtainPairView
from rest_framework.routers import DefaultRouter
from .views import MovieViewSet , TheaterViewSet ,ShowViewSet ,UserViewSet
from .views import ContactMessageListCreateView

router = DefaultRouter()
router.register(r'movies', MovieViewSet)
router.register(r'theater',TheaterViewSet)
router.register(r'show',ShowViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('api/contact-messages/', ContactMessageListCreateView.as_view(), name='contact-messages'),
    path('api/token/', MyTokenObtainPairView.as_view(), name='api/token/'),
     path('api/', include(router.urls)),
]
