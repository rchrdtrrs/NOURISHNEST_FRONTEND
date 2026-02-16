from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import RecipeViewSet, UserForkedRecipesView
from . import views

router = DefaultRouter()
router.register(r'', RecipeViewSet, basename='recipe')

urlpatterns = [
    path('my-forks/', UserForkedRecipesView.as_view(), name='user-forks'),
    path('', include(router.urls)),
    path('paypal/create/', views.paypal_create_payment, name='paypal_create_payment'),
    path('paypal/execute/', views.paypal_execute_payment, name='paypal_execute_payment'),
]
