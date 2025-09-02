import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button-enhanced";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, ChefHat, Sparkles, Crown, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const IngredientInput = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [user, setUser] = useState<any>(null);
  const [canGenerate, setCanGenerate] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [remaining, setRemaining] = useState(3);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkUserAndUsage();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        checkUserAndUsage();
      } else {
        setUser(null);
        setCanGenerate(false);
        setIsPremium(false);
        setRemaining(0);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUserAndUsage = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setUser(null);
        setCanGenerate(false);
        setIsPremium(false);
        setRemaining(0);
        return;
      }

      setUser(user);

      // Check usage with edge function
      const { data, error } = await supabase.functions.invoke('check-usage');
      
      if (error) {
        console.error('Usage check error:', error);
        // Allow generation by default if check fails
        setCanGenerate(true);
        setIsPremium(false);
        setRemaining(3);
        return;
      }

      setCanGenerate(data.canGenerate);
      setIsPremium(data.isPremium);
      setRemaining(data.remaining || 0);
      
    } catch (error) {
      console.error('Error checking usage:', error);
    }
  };

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  // Function to handle recipe generation
  const handleGenerateRecipes = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to generate recipes.",
        variant: "destructive",
      });
      return;
    }

    if (!canGenerate && !isPremium) {
      toast({
        title: "Daily Limit Reached",
        description: "You've used your 3 free recipes today. Upgrade to Premium for unlimited access!",
        variant: "destructive",
      });
      return;
    }

    if (ingredients.length === 0) {
      toast({
        title: "Add Some Ingredients",
        description: "Please add at least one ingredient to generate recipes.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Track usage for non-premium users
      if (!isPremium) {
        await supabase.functions.invoke('track-usage');
      }

      // Generate recipes using AI
      const { data, error } = await supabase.functions.invoke('generate-recipes', {
        body: { ingredients }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate recipes');
      }

      if (data?.recipes) {
        // Update usage after successful generation
        await checkUserAndUsage();
        
        toast({
          title: "Recipes Generated! 🎉",
          description: `Created ${data.recipes.length} delicious recipes using your ingredients!`,
        });

        // Store recipes in localStorage for RecipeResults component to display
        localStorage.setItem('generatedRecipes', JSON.stringify(data.recipes));
        localStorage.setItem('usedIngredients', JSON.stringify(ingredients));
        
        // Scroll to recipe results section
        const resultsElement = document.getElementById('recipe-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }

    } catch (error) {
      console.error('Recipe generation error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate recipes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sampleCombos = [
    "Rice + Beans + Onion",
    "Pasta + Tomato + Garlic", 
    "Chicken + Vegetables + Herbs"
  ];

  return (
    <section className="py-16 px-4" id="ingredients">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <ChefHat className="w-4 h-4 mr-2" />
            AI Recipe Generator
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What's in Your Fridge?
          </h2>
          <p className="text-lg text-muted-foreground">
            Enter your ingredients and let our AI create amazing recipes just for you
          </p>
        </div>

        <Card className="shadow-fresh border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="w-5 h-5 text-secondary mr-2" />
              Your Ingredients
            </CardTitle>
            <CardDescription>
              Add ingredients one by one, then generate personalized recipes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="e.g., tomatoes, onions, chicken..."
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={loading}
              />
              <Button onClick={addIngredient} variant="outline" size="default" disabled={loading}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Usage Status */}
            {user && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {isPremium ? (
                      <>
                        <Crown className="w-4 h-4 text-primary mr-2" />
                        <span className="text-sm font-medium">Premium: Unlimited Recipes</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-muted-foreground mr-2" />
                        <span className="text-sm">Free Plan: {remaining}/3 recipes today</span>
                      </>
                    )}
                  </div>
                  {!isPremium && remaining === 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.location.href = '/pricing'}
                    >
                      <Crown className="w-3 h-3 mr-1" />
                      Upgrade
                    </Button>
                  )}
                </div>
              </div>
            )}

            {!user && (
              <div className="mt-4 p-3 bg-primary-soft rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 text-primary mr-2" />
                    <span className="text-sm text-primary">Sign in to generate recipes</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.location.href = '/auth'}
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            )}

            {/* Ingredients Display */}
            {ingredients.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">
                  Added Ingredients ({ingredients.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {ingredient}
                      <button
                        onClick={() => removeIngredient(ingredient)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

          {ingredients.length > 0 && (
            <Button 
              onClick={handleGenerateRecipes} 
              variant={!user || (!canGenerate && !isPremium) ? "secondary" : "hero"}
              size="lg" 
              className="w-full group"
              disabled={loading || (!user || (!canGenerate && !isPremium))}
            >
              {loading ? (
                <>
                  <ChefHat className="w-5 h-5 mr-2 animate-spin" />
                  Generating Recipes...
                </>
              ) : !user ? (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Sign In to Generate Recipes
                </>
              ) : !canGenerate && !isPremium ? (
                <>
                  <Crown className="w-5 h-5 mr-2" />
                  Upgrade for More Recipes
                </>
              ) : (
                <>
                  <ChefHat className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  Generate Delicious Recipes
                  <Sparkles className="w-4 h-4 ml-2 group-hover:animate-pulse" />
                </>
              )}
            </Button>
          )}
          </CardContent>
        </Card>

        {/* Sample Ingredients */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">Try these popular combinations:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {sampleCombos.map((combo, index) => (
              <button
                key={index}
                onClick={() => {
                  const newIngredients = combo.split(" + ").map(ing => ing.toLowerCase());
                  setIngredients(prev => [...new Set([...prev, ...newIngredients])]);
                }}
                className="text-xs bg-accent hover:bg-accent/80 text-accent-foreground px-3 py-1 rounded-full transition-colors"
              >
                {combo}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IngredientInput;