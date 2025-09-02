import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user authentication
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Authentication required');
    }

    const { ingredients } = await req.json();

    if (!ingredients || ingredients.length === 0) {
      throw new Error('Ingredients are required');
    }

    // Generate recipes using OpenAI
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `Create 3 unique and delicious recipes using these ingredients: ${ingredients.join(', ')}. 
    
    For each recipe, provide:
    1. A creative and appealing title
    2. Complete ingredients list (including quantities)
    3. Step-by-step cooking instructions
    4. Estimated cooking time
    5. Number of servings
    6. Difficulty level (easy/medium/hard)
    7. Brief nutrition information (calories, protein, etc.)

    Format the response as a JSON array with each recipe having these exact fields:
    - title: string
    - ingredients: array of strings with quantities
    - instructions: array of strings (step by step)
    - cooking_time: string (e.g., "30 minutes")
    - servings: number
    - difficulty: string (easy/medium/hard)
    - nutrition: object with calories, protein, carbs, fat`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          {
            role: 'system',
            content: 'You are a professional chef and recipe developer. Always respond with valid JSON arrays containing recipe objects.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_completion_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    let recipes;
    
    try {
      // Try to parse the AI response as JSON
      const content = data.choices[0].message.content;
      recipes = JSON.parse(content);
    } catch (parseError) {
      // If parsing fails, create a fallback structure
      console.error('Failed to parse AI response as JSON:', parseError);
      recipes = [{
        title: "Custom Recipe with Your Ingredients",
        ingredients: ingredients.map(ing => `1 cup ${ing}`),
        instructions: [
          "Prepare and clean all ingredients",
          "Follow basic cooking principles for each ingredient",
          "Combine ingredients thoughtfully",
          "Cook until done and season to taste"
        ],
        cooking_time: "30 minutes",
        servings: 4,
        difficulty: "medium",
        nutrition: { calories: 300, protein: "15g", carbs: "30g", fat: "10g" }
      }];
    }

    console.log('Generated recipes:', recipes);

    return new Response(JSON.stringify({ recipes }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-recipes function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});