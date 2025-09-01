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
    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    const today = new Date().toISOString().split('T')[0];

    // Use admin client to bypass RLS for upsert
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

    // Increment usage count
    const { error } = await supabaseAdmin
      .rpc('increment_usage', {
        p_user_id: user.id,
        p_date: today
      });

    if (error) {
      // If RPC doesn't exist, fallback to upsert
      const { data: existing } = await supabaseAdmin
        .from('usage_tracking')
        .select('recipe_generations')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      const newCount = (existing?.recipe_generations || 0) + 1;

      await supabaseAdmin
        .from('usage_tracking')
        .upsert({
          user_id: user.id,
          date: today,
          recipe_generations: newCount,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,date'
        });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Usage tracking error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});