from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom User model with additional fields for NourishNest.
    Uses email as the primary identifier for authentication.
    """
    
    class SubscriptionType(models.TextChoices):
        FREE = 'free', 'Free'
        PREMIUM = 'premium', 'Premium'
        PRO = 'pro', 'Pro'
    
    email = models.EmailField(unique=True)
    subscription_type = models.CharField(
        max_length=20,
        choices=SubscriptionType.choices,
        default=SubscriptionType.FREE,
    )
    health_profile = models.JSONField(
        default=dict,
        blank=True,
        help_text="User dietary preferences: allergies, diet type, health goals, etc."
    )
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'
    
    def __str__(self):
        return self.email
    
    @property
    def is_premium(self):
        return self.subscription_type in [self.SubscriptionType.PREMIUM, self.SubscriptionType.PRO]


class SubscriptionPlan(models.Model):
    """Available subscription plans with features and pricing."""
    
    name = models.CharField(max_length=100, unique=True)
    features = models.JSONField(
        default=list,
        help_text="List of features included in this plan"
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['price']
    
    def __str__(self):
        return f"{self.name} - ${self.price}"
