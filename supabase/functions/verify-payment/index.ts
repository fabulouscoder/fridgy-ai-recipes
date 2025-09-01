import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reference, plan, email } = await req.json();
    
    // Verify payment with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${Deno.env.get("PAYSTACK_SECRET_KEY")}`,
      },
    });
    
    const paymentData = await paystackResponse.json();
    
    if (!paymentData.status || paymentData.data.status !== 'success') {
      throw new Error('Payment verification failed');
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get user by email
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserByEmail(email);
    if (userError || !userData.user) {
      throw new Error('User not found');
    }

    // Calculate expiry date
    const now = new Date();
    const expiry = new Date(now);
    if (plan === 'monthly') {
      expiry.setMonth(expiry.getMonth() + 1);
    } else if (plan === 'yearly') {
      expiry.setFullYear(expiry.getFullYear() + 1);
    }

    // Update or create subscription
    const { error: subscriptionError } = await supabaseAdmin
      .from('subscriptions')
      .upsert({
        user_id: userData.user.id,
        email: email,
        plan_status: plan,
        subscription_expiry: expiry.toISOString(),
        paystack_reference: reference,
        amount_paid: paymentData.data.amount,
        currency: paymentData.data.currency,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (subscriptionError) {
      throw subscriptionError;
    }

    return new Response(
      JSON.stringify({ success: true, message: "Subscription activated successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Payment verification error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});