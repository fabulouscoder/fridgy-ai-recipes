Master Prompt for Vibe Coding Tool
==================================

**Build a full-stack web app called “Fridgy – Smart Fridge Buddy.”**

* * *

### 🔹 Core Idea

Fridgy helps users reduce food waste by generating recipes from ingredients they already have.  
Users enter ingredients → AI generates recipes → Users can save recipes (if premium).

* * *

### 🔹 Features

1. **Landing Page**
   
   * Clean, modern design with logo/name.
   
   * Tagline: _“Turn your leftovers into delicious meals. Save money. Reduce waste. Stay healthy.”_
   
   * CTA button: _“Start Cooking with Fridgy.”_

2. **Ingredient Input Page**
   
   * Textbox for comma-separated ingredients (placeholder: _“e.g., rice, beans, onion”_).
   
   * “Generate Recipes” button.

3. **AI Recipe Generator**
   
   * On submit: send user input to **OpenAI API** with this prompt:  
     _“Suggest 3 simple, budget-friendly recipes using [ingredients]. Each recipe should include: title, cooking time, ingredients, and step-by-step instructions.”_
   
   * Display recipes as **cards** with:
     
     * Title
     
     * Cooking time
     
     * Ingredients
     
     * Steps

4. **User Authentication (Supabase Auth)**
   
   * Sign up/login with email + password.
   
   * Users can save recipes to their account.

5. **Saved Recipes Page**
   
   * Display all saved recipes.
   
   * Option to delete or re-generate recipes.

* * *

### 🔹 Monetization (Paystack Integration)

1. **Pricing Page**
   
   * Two subscription tiers:
     
     * **₦1,000/month ($5/month)** → Unlimited recipes + Save recipes.
     
     * **₦10,000/year ($50/year)** → Same benefits, discounted price.
   
   * “Subscribe with Paystack” button on each plan.

2. **Payment Flow**
   
   * Integrate **Paystack inline checkout**.
   
   * On successful payment:
     
     * Save transaction in Supabase.
     
     * Update user `plan_status` (monthly or yearly).
     
     * Add `subscription_expiry` field.
   
   * If expired → revert user back to free plan.

3. **Access Control**
   
   * Free users → 3 recipe generations/day, no save option.
   
   * Premium users → Unlimited generations + save recipes.

4. **User Dashboard**
   
   * Show current plan, expiry date, upgrade/cancel option.

* * *

### 🔹 Tech Stack

* **Frontend:** React + TailwindCSS (mobile responsive, clean design).

* **Backend:** Next.js or Node.js/Express (API routes).

* **Database:** Supabase (users, recipes, subscriptions).

* **AI:** OpenAI API (recipe generation).

* **Payments:** Paystack inline JS SDK or server SDK.

* **Deployment:** Vercel or Bolt.new.

* * *

### 🔹 Design Guidelines

* Minimal, modern UI.

* Use fresh green + orange as primary colors (food/freshness theme).

* Rounded recipe cards with shadows.

* Clear, mobile-friendly navigation.

* * *

### 🔹 Stretch Goals (Optional if time allows)

* “Suggest Missing Ingredients” (AI suggests items to buy).

* Nutrition info (calories estimate per recipe).

* Share recipe link/social media integration.

* * *

### 🔹 Documentation

* Generate **README.md** with:
  
  * Overview of Fridgy.
  
  * Features list.
  
  * Tech stack.
  
  * Setup & run instructions.
  
  * Hackathon team section (names, roles, emails).
