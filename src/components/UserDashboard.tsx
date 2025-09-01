import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button-enhanced";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Crown, 
  Calendar, 
  TrendingUp, 
  Settings, 
  LogOut,
  ChefHat,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface Subscription {
  plan_status: string;
  subscription_expiry: string;
  created_at: string;
}

interface Usage {
  recipe_generations: number;
  date: string;
}

const UserDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [todayUsage, setTodayUsage] = useState<Usage | null>(null);
  const [savedRecipesCount, setSavedRecipesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Not authenticated");
      
      setUser(user);

      // Get subscription data
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      setSubscription(subData);

      // Get today's usage
      const today = new Date().toISOString().split('T')[0];
      const { data: usageData } = await supabase
        .from('usage_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();
      
      setTodayUsage(usageData);

      // Get saved recipes count
      const { count } = await supabase
        .from('saved_recipes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      setSavedRecipesCount(count || 0);

    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load your dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign Out Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPlanBadge = (planStatus: string) => {
    switch (planStatus) {
      case 'monthly':
        return <Badge variant="default" className="bg-gradient-fresh"><Crown className="w-3 h-3 mr-1" />Monthly Premium</Badge>;
      case 'yearly':
        return <Badge variant="default" className="bg-gradient-fresh"><Crown className="w-3 h-3 mr-1" />Yearly Premium</Badge>;
      default:
        return <Badge variant="secondary">Free Plan</Badge>;
    }
  };

  const getUsageProgress = () => {
    if (!subscription || subscription.plan_status === 'free') {
      const used = todayUsage?.recipe_generations || 0;
      return {
        value: (used / 3) * 100,
        text: `${used}/3 recipes today`,
        remaining: Math.max(0, 3 - used)
      };
    }
    return {
      value: 0,
      text: "Unlimited recipes",
      remaining: -1
    };
  };

  const isSubscriptionActive = () => {
    if (!subscription || subscription.plan_status === 'free') return false;
    return new Date(subscription.subscription_expiry) > new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to view your dashboard.</CardDescription>
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

  const usage = getUsageProgress();
  const isActive = isSubscriptionActive();

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.email}!</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Plan Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                {getPlanBadge(subscription?.plan_status || 'free')}
              </div>
              {isActive && subscription?.subscription_expiry && (
                <p className="text-xs text-muted-foreground">
                  Expires: {formatDate(subscription.subscription_expiry)}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Usage Today */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Usage</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary mb-2">
                {usage.remaining === -1 ? '∞' : usage.remaining}
              </div>
              <Progress value={usage.value} className="mb-2" />
              <p className="text-xs text-muted-foreground">{usage.text}</p>
            </CardContent>
          </Card>

          {/* Saved Recipes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Recipes</CardTitle>
              <ChefHat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{savedRecipesCount}</div>
              <p className="text-xs text-muted-foreground">
                {subscription?.plan_status === 'free' ? 'Upgrade to save recipes' : 'Recipes in your collection'}
              </p>
            </CardContent>
          </Card>

          {/* Member Since */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Member Since</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatDate(user.created_at).split(',')[0]}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDate(user.created_at)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Account Status
              </CardTitle>
              <CardDescription>Manage your subscription and account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Email:</span>
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Status:</span>
                {getPlanBadge(subscription?.plan_status || 'free')}
              </div>
              {!isActive && (
                <div className="pt-4">
                  <Button variant="hero" className="w-full" onClick={() => window.location.href = '/pricing'}>
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Usage Statistics
              </CardTitle>
              <CardDescription>Your Fridgy usage overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Today's Generations:</span>
                <span className="text-sm font-medium">
                  {todayUsage?.recipe_generations || 0}
                  {subscription?.plan_status === 'free' ? '/3' : ''}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Saved Recipes:</span>
                <span className="text-sm font-medium">{savedRecipesCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Plan Type:</span>
                <span className="text-sm font-medium capitalize">
                  {subscription?.plan_status || 'Free'}
                </span>
              </div>
              {isActive && subscription?.subscription_expiry && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Next Billing:</span>
                  <span className="text-sm font-medium">
                    {formatDate(subscription.subscription_expiry)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex-col" onClick={() => window.location.href = '/'}>
                  <ChefHat className="w-6 h-6 mb-2" />
                  <span>Generate Recipes</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col" onClick={() => window.location.href = '/saved-recipes'}>
                  <User className="w-6 h-6 mb-2" />
                  <span>View Saved Recipes</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col" onClick={() => window.location.href = '/pricing'}>
                  <Crown className="w-6 h-6 mb-2" />
                  <span>Manage Subscription</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;