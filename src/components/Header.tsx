import { ChefHat, Menu, X, User, Crown } from "lucide-react";
import { Button } from "@/components/ui/button-enhanced";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        loadSubscription(user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        loadSubscription(session.user.id);
      } else {
        setSubscription(null);
      }
    });

    return () => {
      authSubscription.unsubscribe();
    };
  }, []);

  const loadSubscription = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();
      setSubscription(data);
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const isPremium = subscription && 
    subscription.plan_status !== 'free' && 
    new Date(subscription.subscription_expiry) > new Date();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-fresh rounded-full">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-fresh bg-clip-text text-transparent">
                Fridgy
              </h1>
              <p className="text-xs text-muted-foreground">Smart Fridge Buddy</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="/pricing" className="text-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            {user && (
              <a href="/saved-recipes" className="text-foreground hover:text-primary transition-colors">
                My Recipes
              </a>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {isPremium && (
                  <div className="flex items-center text-primary text-sm font-medium">
                    <Crown className="w-4 h-4 mr-1" />
                    Premium
                  </div>
                )}
                <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard'}>
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => window.location.href = '/auth'}>
                  Sign In
                </Button>
                <Button variant="fresh" size="sm" onClick={() => window.location.href = '/auth'}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-accent rounded-md transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4 mb-6">
              <a 
                href="/" 
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href="/pricing" 
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </a>
              {user && (
                <a 
                  href="/saved-recipes" 
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Recipes
                </a>
              )}
            </nav>

            <div className="flex flex-col space-y-3">
              {user ? (
                <>
                  {isPremium && (
                    <div className="flex items-center justify-center text-primary text-sm font-medium py-2">
                      <Crown className="w-4 h-4 mr-1" />
                      Premium Member
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full" onClick={() => {
                    window.location.href = '/dashboard';
                    setIsMenuOpen(false);
                  }}>
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => {
                    window.location.href = '/auth';
                    setIsMenuOpen(false);
                  }}>
                    Sign In
                  </Button>
                  <Button variant="fresh" size="sm" className="w-full" onClick={() => {
                    window.location.href = '/auth';
                    setIsMenuOpen(false);
                  }}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;