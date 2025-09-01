import { useState } from "react"
import { Button } from "@/components/ui/button-enhanced"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChefHat, Sparkles, Plus, X } from "lucide-react"

const IngredientInput = () => {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [currentIngredient, setCurrentIngredient] = useState("")

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()])
      setCurrentIngredient("")
    }
  }

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addIngredient()
    }
  }

  const handleGenerateRecipes = () => {
    // This will be connected to the AI API once Supabase is set up
    console.log("Generating recipes for:", ingredients)
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-soft/50 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <ChefHat className="w-4 h-4" />
            AI Recipe Generator
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What's in Your Fridge?
          </h2>
          <p className="text-lg text-muted-foreground">
            Enter your ingredients and let our AI create amazing recipes just for you
          </p>
        </div>

        <Card className="shadow-fresh border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              Your Ingredients
            </CardTitle>
            <CardDescription>
              Add ingredients one by one, then generate personalized recipes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input Section */}
            <div className="flex gap-2">
              <Input
                placeholder="Enter an ingredient (e.g., rice, chicken, tomato)"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                onClick={addIngredient} 
                variant="soft" 
                size="default"
                disabled={!currentIngredient.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Ingredients Display */}
            {ingredients.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">
                  Added Ingredients ({ingredients.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 bg-primary-soft text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {ingredient}
                      <button
                        onClick={() => removeIngredient(ingredient)}
                        className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generate Button */}
            <div className="pt-4">
              <Button
                onClick={handleGenerateRecipes}
                variant="fresh"
                size="lg"
                className="w-full"
                disabled={ingredients.length === 0}
              >
                <Sparkles className="w-5 h-5" />
                Generate Recipes ({ingredients.length} ingredients)
              </Button>
              
              {ingredients.length === 0 && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Add at least one ingredient to get started
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sample Ingredients */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">Try these popular combinations:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Rice + Beans + Onion", "Pasta + Tomato + Garlic", "Chicken + Vegetables + Herbs"].map((combo, index) => (
              <button
                key={index}
                onClick={() => {
                  const newIngredients = combo.split(" + ").map(ing => ing.toLowerCase())
                  setIngredients(prev => [...new Set([...prev, ...newIngredients])])
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
  )
}

export default IngredientInput