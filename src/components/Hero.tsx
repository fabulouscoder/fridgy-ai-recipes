import { Button } from "@/components/ui/button-enhanced"
import { ArrowRight, Leaf, Users, DollarSign } from "lucide-react"
import heroImage from "@/assets/fridgy-hero.jpg"

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-subtle">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-soft/30 to-secondary-soft/30" />
      
      <div className="container relative mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary-soft/50 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Leaf className="w-4 h-4" />
                Smart Food Management
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Turn Your
                <span className="bg-gradient-fresh bg-clip-text text-transparent"> Leftovers</span>
                <br />
                Into Delicious Meals
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg">
                Save money. Reduce waste. Stay healthy. Fridgy transforms your ingredients into amazing recipes with AI-powered suggestions.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">40%</div>
                <div className="text-sm text-muted-foreground">Less Food Waste</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">$200</div>
                <div className="text-sm text-muted-foreground">Saved Monthly</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Happy Users</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="group">
                Try Fridgy Now
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="soft" size="xl">
                Watch Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                50,000+ users
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                Free to start
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative animate-float">
              <img
                src={heroImage}
                alt="Fresh ingredients and vegetables arranged beautifully"
                className="rounded-2xl shadow-fresh w-full h-auto"
              />
              
              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 bg-card rounded-xl shadow-warm p-4 animate-pulse-glow hidden md:block">
                <div className="text-sm font-medium text-primary">Recipe Found!</div>
                <div className="text-xs text-muted-foreground">Veggie Stir Fry</div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-card rounded-xl shadow-fresh p-4 animate-bounce hidden md:block">
                <div className="text-sm font-medium text-secondary">$5 Saved</div>
                <div className="text-xs text-muted-foreground">This week</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero