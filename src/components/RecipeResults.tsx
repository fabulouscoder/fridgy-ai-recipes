import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button-enhanced"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, BookmarkPlus, Share2, ChefHat } from "lucide-react"

// Mock recipe data - this will come from the AI API
const mockRecipes = [
  {
    id: 1,
    title: "Mediterranean Vegetable Rice Bowl",
    cookingTime: "25 mins",
    servings: 4,
    difficulty: "Easy",
    ingredients: ["Rice", "Tomatoes", "Onions", "Bell peppers", "Olive oil", "Herbs"],
    instructions: [
      "Heat olive oil in a large pan over medium heat",
      "Sauté onions until translucent (3-4 minutes)",
      "Add bell peppers and cook for 5 minutes",
      "Stir in rice and tomatoes, season with herbs",
      "Add 2 cups water, bring to boil, then simmer for 15 minutes",
      "Let rest for 5 minutes before serving"
    ],
    nutrition: {
      calories: 320,
      protein: "8g",
      carbs: "65g",
      fat: "6g"
    }
  },
  {
    id: 2,
    title: "Quick Vegetable Stir-Fry",
    cookingTime: "15 mins",
    servings: 2,
    difficulty: "Easy",
    ingredients: ["Bell peppers", "Onions", "Garlic", "Soy sauce", "Oil", "Rice"],
    instructions: [
      "Heat oil in wok or large pan over high heat",
      "Add garlic and onions, stir-fry for 1 minute",
      "Add bell peppers, cook for 3-4 minutes until crisp-tender",
      "Add soy sauce and toss to combine",
      "Serve immediately over cooked rice"
    ],
    nutrition: {
      calories: 280,
      protein: "6g",
      carbs: "52g",
      fat: "8g"
    }
  },
  {
    id: 3,
    title: "Rustic Roasted Vegetable Medley",
    cookingTime: "35 mins",
    servings: 6,
    difficulty: "Medium",
    ingredients: ["Mixed vegetables", "Olive oil", "Herbs", "Salt", "Pepper"],
    instructions: [
      "Preheat oven to 425°F (220°C)",
      "Cut vegetables into uniform pieces",
      "Toss with olive oil, herbs, salt, and pepper",
      "Spread on baking sheet in single layer",
      "Roast for 25-30 minutes until tender and caramelized",
      "Serve hot as a side dish or main course"
    ],
    nutrition: {
      calories: 180,
      protein: "4g",
      carbs: "28g",
      fat: "7g"
    }
  }
]

const RecipeResults = () => {
  const handleSaveRecipe = (recipeId: number) => {
    // This will connect to Supabase once set up
    console.log("Saving recipe:", recipeId)
  }

  const handleShareRecipe = (recipeId: number) => {
    // Share functionality
    console.log("Sharing recipe:", recipeId)
  }

  return (
    <section className="py-16 px-4 bg-accent/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-secondary-soft/50 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <ChefHat className="w-4 h-4" />
            AI Generated Recipes
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Perfect Recipes for Your Ingredients
          </h2>
          <p className="text-lg text-muted-foreground">
            Here are personalized recipes created just for you
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockRecipes.map((recipe) => (
            <Card key={recipe.id} className="shadow-warm hover:shadow-fresh transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight mb-2">
                      {recipe.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      A delicious meal using your available ingredients
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {recipe.difficulty}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {recipe.cookingTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {recipe.servings} servings
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Ingredients */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Ingredients:</h4>
                  <div className="flex flex-wrap gap-1">
                    {recipe.ingredients.slice(0, 4).map((ingredient, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
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

                {/* Nutrition */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-accent/50 p-2 rounded text-center">
                    <div className="font-medium">{recipe.nutrition.calories}</div>
                    <div className="text-muted-foreground">calories</div>
                  </div>
                  <div className="bg-accent/50 p-2 rounded text-center">
                    <div className="font-medium">{recipe.nutrition.protein}</div>
                    <div className="text-muted-foreground">protein</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="fresh" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleSaveRecipe(recipe.id)}
                  >
                    <BookmarkPlus className="w-4 h-4" />
                    Save
                  </Button>
                  <Button 
                    variant="soft" 
                    size="sm"
                    onClick={() => handleShareRecipe(recipe.id)}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Generate More Button */}
        <div className="text-center mt-8">
          <Button variant="warm" size="lg">
            Generate More Recipes
          </Button>
        </div>
      </div>
    </section>
  )
}

export default RecipeResults