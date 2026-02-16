from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from recipes.models import Recipe, RecipeFork
from recipes.serializers import RecipeListSerializer, RecipeSerializer, RecipeForkSerializer


class CommunityRecipeListView(generics.ListAPIView):
    """
    GET /api/v1/community/recipes/
    Browse public/shared recipes from the community.
    """
    permission_classes = [AllowAny]
    serializer_class = RecipeListSerializer
    
    def get_queryset(self):
        queryset = Recipe.objects.filter(is_public=True)
        
        # Filter by tags
        tag_ids = self.request.query_params.getlist('tags')
        if tag_ids:
            queryset = queryset.filter(tags__id__in=tag_ids).distinct()
        
        # Filter by difficulty
        difficulty = self.request.query_params.get('difficulty')
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        
        # Search by name
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        # Sort options
        sort = self.request.query_params.get('sort', '-created_at')
        valid_sorts = ['created_at', '-created_at', 'name', '-name', 'match_score', '-match_score']
        if sort in valid_sorts:
            queryset = queryset.order_by(sort)
        
        return queryset.prefetch_related('tags').select_related('created_by')


class CommunityRecipeDetailView(generics.RetrieveAPIView):
    """
    GET /api/v1/community/recipes/<id>/
    Get details of a public recipe.
    """
    permission_classes = [AllowAny]
    serializer_class = RecipeSerializer
    queryset = Recipe.objects.filter(is_public=True)


class CommunityRecipeForkView(APIView):
    """
    POST /api/v1/community/recipes/<id>/fork/
    Fork a community recipe into user's collection.
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        try:
            recipe = Recipe.objects.get(pk=pk, is_public=True)
        except Recipe.DoesNotExist:
            return Response(
                {'error': 'Recipe not found or not public'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if already forked
        existing = RecipeFork.objects.filter(
            original_recipe=recipe,
            forked_by=request.user
        ).first()
        
        if existing:
            return Response(
                {'error': 'You have already forked this recipe',
                 'fork': RecipeForkSerializer(existing).data},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create fork with original ingredients
        fork = RecipeFork.objects.create(
            original_recipe=recipe,
            forked_by=request.user,
            custom_ingredients=recipe.ingredients_text,
            custom_instructions='',
            notes='',
        )
        
        return Response(
            RecipeForkSerializer(fork).data,
            status=status.HTTP_201_CREATED
        )


class PopularRecipesView(generics.ListAPIView):
    """
    GET /api/v1/community/recipes/popular/
    Get most forked/popular recipes.
    """
    permission_classes = [AllowAny]
    serializer_class = RecipeListSerializer
    
    def get_queryset(self):
        from django.db.models import Count
        
        return Recipe.objects.filter(
            is_public=True
        ).annotate(
            fork_count=Count('forks')
        ).order_by('-fork_count')[:20]
