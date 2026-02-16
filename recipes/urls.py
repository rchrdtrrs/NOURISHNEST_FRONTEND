from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import RecipeViewSet, UserForkedRecipesView

router = DefaultRouter()
router.register(r'', RecipeViewSet, basename='recipe')

urlpatterns = [
    path('my-forks/', UserForkedRecipesView.as_view(), name='user-forks'),
    path('', include(router.urls)),
]
