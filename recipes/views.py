from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from inventory.models import DietaryTag, InventoryItem
from .models import Recipe, RecipeFork
from .serializers import (
    RecipeSerializer,
    RecipeListSerializer,
    RecipeGenerateSerializer,
    RecipeForkSerializer,
    RecipeForkCreateSerializer,
)
from .services import generate_recipe_sync, calculate_match_score


class RecipeViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for recipes.
    
    GET /api/v1/recipes/ - List recipes
    POST /api/v1/recipes/ - Create recipe manually
    GET /api/v1/recipes/<id>/ - Get recipe details
    PATCH /api/v1/recipes/<id>/ - Update recipe
    DELETE /api/v1/recipes/<id>/ - Delete recipe
    POST /api/v1/recipes/generate/ - Generate recipe with AI
    POST /api/v1/recipes/<id>/fork/ - Fork a recipe
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Recipe.objects.filter(
            # User's own recipes or public recipes
            created_by=user
        ) | Recipe.objects.filter(is_public=True)
        
        queryset = queryset.distinct()
        
        # Filter by match_score
        min_score = self.request.query_params.get('min_score')
        if min_score:
            try:
                queryset = queryset.filter(match_score__gte=float(min_score))
            except ValueError:
                pass
        
        # Filter by dietary tags
        tag_ids = self.request.query_params.getlist('tags')
        if tag_ids:
            queryset = queryset.filter(tags__id__in=tag_ids).distinct()
        
        # Filter by difficulty
        difficulty = self.request.query_params.get('difficulty')
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        
        # Filter by generated_by_llm
        ai_generated = self.request.query_params.get('ai_generated')
        if ai_generated is not None:
            queryset = queryset.filter(generated_by_llm=ai_generated.lower() == 'true')
        
        return queryset.prefetch_related('tags')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return RecipeListSerializer
        return RecipeSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=False, methods=['post'])
    def generate(self, request):
        """
        POST /api/v1/recipes/generate/
        Generate a recipe using AI based on user's inventory and preferences.
        """
        serializer = RecipeGenerateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        
        # Get inventory items
        if data.get('use_inventory', True):
            if data.get('inventory_item_ids'):
                items = InventoryItem.objects.filter(
                    user=request.user,
                    id__in=data['inventory_item_ids']
                )
            else:
                # Get all non-expired items
                from django.utils import timezone
                items = InventoryItem.objects.filter(
                    user=request.user
                ).exclude(
                    expiry_date__lt=timezone.now().date()
                )
            
            inventory_data = [
                {'name': item.name, 'quantity': item.quantity}
                for item in items
            ]
        else:
            inventory_data = []
        
        if not inventory_data:
            return Response(
                {'error': 'No inventory items available for recipe generation'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get user health profile
        health_profile = request.user.health_profile or {}
        
        # Options for generation
        options = {
            'cuisine_preference': data.get('cuisine_preference', ''),
            'max_prep_time': data.get('max_prep_time'),
            'servings': data.get('servings', 2),
            'additional_instructions': data.get('additional_instructions', ''),
        }
        
        # Generate recipe
        result = generate_recipe_sync(inventory_data, health_profile, options)
        
        if 'error' in result:
            return Response(
                {'error': result['error']},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        
        # Calculate match score
        match_score = calculate_match_score(
            result.get('ingredients_text', []),
            inventory_data
        )
        
        # Create recipe in database
        tags_data = result.pop('tags', [])
        
        recipe = Recipe.objects.create(
            name=result.get('name', 'AI Generated Recipe'),
            description=result.get('description', ''),
            instructions=result.get('instructions', ''),
            ingredients_text=result.get('ingredients_text', []),
            generated_by_llm=True,
            nutrition_info=result.get('nutrition_info', {}),
            match_score=match_score,
            prep_time_minutes=result.get('prep_time_minutes'),
            cook_time_minutes=result.get('cook_time_minutes'),
            servings=result.get('servings', 2),
            difficulty=result.get('difficulty', 'medium'),
            created_by=request.user,
            is_public=False,
        )
        
        # Add tags
        if tags_data:
            for tag_name in tags_data:
                tag, _ = DietaryTag.objects.get_or_create(
                    name__iexact=tag_name,
                    defaults={'name': tag_name}
                )
                recipe.tags.add(tag)
        
        return Response(
            RecipeSerializer(recipe).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def fork(self, request, pk=None):
        """
        POST /api/v1/recipes/<id>/fork/
        Fork/customize an existing recipe.
        """
        recipe = self.get_object()
        
        # Check if user already forked this recipe
        existing_fork = RecipeFork.objects.filter(
            original_recipe=recipe,
            forked_by=request.user
        ).first()
        
        if existing_fork:
            return Response(
                {'error': 'You have already forked this recipe',
                 'fork': RecipeForkSerializer(existing_fork).data},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = RecipeForkCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        fork = RecipeFork.objects.create(
            original_recipe=recipe,
            forked_by=request.user,
            custom_ingredients=serializer.validated_data.get('custom_ingredients', []),
            custom_instructions=serializer.validated_data.get('custom_instructions', ''),
            notes=serializer.validated_data.get('notes', ''),
        )
        
        return Response(
            RecipeForkSerializer(fork).data,
            status=status.HTTP_201_CREATED
        )


class UserForkedRecipesView(generics.ListAPIView):
    """
    GET /api/v1/recipes/my-forks/
    List user's forked recipes.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = RecipeForkSerializer
    
    def get_queryset(self):
        return RecipeFork.objects.filter(
            forked_by=self.request.user
        ).select_related('original_recipe')
