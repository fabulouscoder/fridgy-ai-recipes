import { useState } from "react";
import { Button } from "@/components/ui/button-enhanced";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

const PricingPage = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const plans = [
    {
      name: "Free",
      price: "₦0",
      globalPrice: "$0",
      period: "forever",
      description: "Get started with basic recipe generation",
      features: [
        "3 recipe generations per day",
        "Basic ingredient suggestions",
        "Simple recipe cards",
        "Mobile responsive design"
      ],
      buttonText: "Current Plan",
      planId: "free",
      disabled: true,
      popular: false
    },
    {
      name: "Monthly Premium",
      price: "₦1,000",
      globalPrice: "$5",
      period: "per month",
      description: "Perfect for regular cooking enthusiasts",
      features: [
        "Unlimited recipe generations",
        "Save unlimited recipes",
        "Advanced ingredient suggestions",
        "Nutrition information",
        "Recipe sharing",
        "Priority support"
      ],
      buttonText: "Subscribe Monthly",
      planId: "monthly",
      disabled: false,
      popular: true
    },
    {
      name: "Yearly Premium",
      price: "₦10,000",
      globalPrice: "$50",
      period: "per year",
      description: "Best value for serious home chefs",
      features: [
        "Everything in Monthly Premium",
        "2 months free (save ₦2,000)",
        "Exclusive recipe collections",
        "Advanced meal planning",
        "Export recipes to PDF",
        "Priority customer support"
      ],
      buttonText: "Subscribe Yearly",
      planId: "yearly",
      disabled: false,
      popular: false
    }
  ];

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') return;
    
    setLoading(planId);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to subscribe to a premium plan.",
          variant: "destructive",
        });
        return;
      }

      // Determine pricing based on plan
      const isMonthly = planId === 'monthly';
      const amount = isMonthly ? 100000 : 1000000; // in kobo (₦1,000 or ₦10,000)
      
      // Initialize Paystack
      if (!window.PaystackPop) {
        // Load Paystack script if not already loaded
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.onload = () => initializePayment();
        document.head.appendChild(script);
      } else {
        initializePayment();
      }

      function initializePayment() {
        const handler = window.PaystackPop.setup({
          key: 'pk_test_your_public_key_here', // Replace with your Paystack public key
          email: user.email,
          amount: amount,
          currency: 'NGN',
          ref: `fridgy_${planId}_${Date.now()}`,
          callback: async function(response: any) {
            try {
              // Verify payment on backend
              const { error } = await supabase.functions.invoke('verify-payment', {
                body: {
                  reference: response.reference,
                  plan: planId,
                  email: user.email
                }
              });

              if (error) throw error;

              toast({
                title: "Payment Successful! 🎉",
                description: `Welcome to Fridgy ${isMonthly ? 'Monthly' : 'Yearly'} Premium! Your subscription is now active.`,
              });

              // Refresh the page or redirect
              window.location.reload();
            } catch (error) {
              console.error('Payment verification failed:', error);
              toast({
                title: "Payment Verification Failed",
                description: "Please contact support if you were charged.",
                variant: "destructive",
              });
            }
          },
          onClose: function() {
            toast({
              title: "Payment Cancelled",
              description: "You can try again anytime.",
            });
          },
        });
        handler.openIframe();
      }

    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Crown className="w-4 h-4 mr-2" />
            Pricing Plans
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Fridgy Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade anytime. No hidden fees, cancel whenever you want.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.planId} 
              className={`relative transition-all duration-300 hover:shadow-fresh ${
                plan.popular ? 'border-primary shadow-fresh scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge variant="default" className="bg-gradient-fresh text-primary-foreground">
                    <Zap className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-primary">
                    {plan.price}
                    <span className="text-sm text-muted-foreground ml-1">
                      {plan.period}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Global: {plan.globalPrice} {plan.period}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  variant={plan.popular ? "hero" : plan.disabled ? "secondary" : "outline"}
                  size="lg"
                  className="w-full"
                  onClick={() => handleSubscribe(plan.planId)}
                  disabled={plan.disabled || loading === plan.planId}
                >
                  {loading === plan.planId ? "Processing..." : plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            All plans include our 7-day money-back guarantee. 
            <br />
            Need help choosing? <span className="text-primary cursor-pointer hover:underline">Contact our support team</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;