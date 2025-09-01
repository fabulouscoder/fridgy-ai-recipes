import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button-enhanced";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ChefHat, 
  Clock, 
  Users, 
  Trash2, 
  Search, 
  Heart,
  ArrowLeft,
  Share2,
  BookOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface SavedRecipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  cooking_time: string;
  servings: number;
  difficulty: string;
  nutrition: any;
  created_at: string;
}

const SavedRecipes = () => {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkUserAndLoadRecipes();
  }, []);

  useEffect(() => {
    // Filter recipes based on search term
    const filtered = recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some(ingredient =>
        ingredient.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredRecipes(filtered);
  }, [recipes, searchTerm]);

  const checkUserAndLoadRecipes = async () => {
    setLoading(true);
    try {
      // Check if user is authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("Please sign in to view saved recipes");
      }
      setUser(user);

      // Load saved recipes for the user
      const { data: recipesData, error: recipesError } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (recipesError) throw recipesError;

      setRecipes(recipesData || []);
    } catch (error: any) {
      console.error('Error loading recipes:', error);
      toast({
        title: "Error Loading Recipes",
        description: error.message || "Failed to load your saved recipes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      const { error } = await supabase
        .from('saved_recipes')
        .delete()
        .eq('id', recipeId)
        .eq('user_id', user.id);

      if (error) throw error;

      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      
      toast({
        title: "Recipe Deleted",
        description: "The recipe has been removed from your collection.",
      });
    } catch (error: any) {
      console.error('Error deleting recipe:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete the recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShareRecipe = async (recipe: SavedRecipe) => {
    try {
      const shareText = `Check out this recipe: ${recipe.title}\n\nIngredients: ${recipe.ingredients.join(', ')}\n\nCooking Time: ${recipe.cooking_time}\nServings: ${recipe.servings}`;
      
      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Recipe Copied",
          description: "Recipe details have been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error('Error sharing recipe:', error);
      toast({
        title: "Share Failed",
        description: "Failed to share the recipe.",
        variant: "destructive",
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your saved recipes...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to view your saved recipes collection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="hero" className="w-full" onClick={() => window.location.href = '/'}>
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = '/'}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <Heart className="w-8 h-8 text-primary mr-3" />
                My Saved Recipes
              </h1>
              <p className="text-muted-foreground">
                {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} in your collection
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recipes or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {recipes.length === 0 
                  ? "No Saved Recipes Yet" 
                  : "No Recipes Match Your Search"
                }
              </h3>
              <p className="text-muted-foreground mb-6">
                {recipes.length === 0 
                  ? "Start generating recipes and save your favorites to see them here."
                  : `Try searching for something else. You have ${recipes.length} total recipes.`
                }
              </p>
              <Button variant="hero" onClick={() => window.location.href = '/'}>
                <ChefHat className="w-4 h-4 mr-2" />
                Generate Recipes
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card key={recipe.id} className="group hover:shadow-fresh transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                      {recipe.title}
                    </CardTitle>
                    <div className="flex space-x-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShareRecipe(recipe)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRecipe(recipe.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {recipe.cooking_time}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-1" />
                      {recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}
                    </div>
                    {recipe.difficulty && (
                      <Badge 
                        variant="outline" 
                        className={getDifficultyColor(recipe.difficulty)}
                      >
                        {recipe.difficulty}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-medium text-sm mb-2">Ingredients:</h4>
                    <div className="flex flex-wrap gap-1">
                      {recipe.ingredients.slice(0, 4).map((ingredient, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {ingredient}
                        </Badge>
                      ))}
                      {recipe.ingredients.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{recipe.ingredients.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-sm mb-2">Instructions:</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {recipe.instructions}
                    </p>
                  </div>

                  {recipe.nutrition && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Nutrition:</span> 
                      {recipe.nutrition.calories && ` ${recipe.nutrition.calories} cal`}
                      {recipe.nutrition.protein && ` • ${recipe.nutrition.protein}g protein`}
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
                    Saved on {new Date(recipe.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRecipes;