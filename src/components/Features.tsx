import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, DollarSign, Leaf, Clock, Users, Smartphone } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Recipe Generation",
    description: "Advanced AI analyzes your ingredients and creates personalized recipes tailored to your preferences and dietary needs."
  },
  {
    icon: DollarSign,
    title: "Save Money",
    description: "Reduce food waste and grocery bills by using ingredients you already have. Users save an average of $200 per month."
  },
  {
    icon: Leaf,
    title: "Reduce Food Waste",
    description: "Help the environment by reducing food waste. Turn forgotten ingredients into delicious meals."
  },
  {
    icon: Clock,
    title: "Quick & Easy Recipes",
    description: "Get recipes that fit your schedule. Filter by cooking time, difficulty level, and available kitchen equipment."
  },
  {
    icon: Users,
    title: "Family-Friendly",
    description: "Create meals for any family size with automatic portion scaling and kid-friendly recipe suggestions."
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Access your recipes anywhere with our responsive design. Cook with confidence using step-by-step mobile instructions."
  }
]

const Features = () => {
  return (
    <section id="features" className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-soft/50 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Brain className="w-4 h-4" />
            Smart Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need for Smart Cooking
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fridgy combines artificial intelligence with practical cooking to help you create amazing meals while saving money and reducing waste.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card 
                key={index} 
                className="shadow-fresh hover:shadow-warm transition-all duration-300 transform hover:-translate-y-1 border-primary/10"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-subtle rounded-full">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features