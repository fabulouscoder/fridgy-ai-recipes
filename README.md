# Deployment Link 
https://fridgy-ai-recipes.lovable.app

# Fridgy - Smart Fridge Buddy 🥗

Turn your leftovers into delicious meals. Save money. Reduce waste. Stay healthy.

Fridgy is an AI-powered web application that helps users reduce food waste by generating personalized recipes from the ingredients they already have at home.

## 🚀 Features

### Current Features (Frontend)
- **Modern Landing Page** - Clean, responsive design with fresh food theme
- **Ingredient Input System** - Easy-to-use interface for entering available ingredients
- **Recipe Results Display** - Beautiful card-based layout for recipe presentation
- **Mobile-First Design** - Fully responsive across all devices
- **Fresh Design System** - Custom color palette with greens and oranges

### Planned Features (Requires Backend Integration)
- **AI Recipe Generation** - OpenAI API integration for personalized recipe suggestions
- **User Authentication** - Sign up/login via Supabase Auth
- **Save Recipes** - Store favorite recipes in user profiles
- **Recipe Management** - CRUD operations for saved recipes
- **Nutritional Information** - Calorie and macro estimates per recipe
- **Missing Ingredients Suggestions** - AI-powered shopping list generation
- **Social Sharing** - Share recipes via links or social media

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible UI components
- **Lucide React** - Consistent icon library
- **Vite** - Fast development and build tool

### Backend (To be implemented)
- **Supabase** - Database, authentication, and real-time features
- **OpenAI API** - AI-powered recipe generation
- **Supabase Edge Functions** - Serverless backend API

### Deployment
- **Vercel/Netlify** - Static site hosting
- **Supabase Cloud** - Backend-as-a-Service

## 🏃‍♂️ How to Run Locally

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd fridgy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:8080`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 🎨 Design System

Fridgy uses a custom design system with a fresh food theme:

- **Primary Colors**: Fresh greens for natural, healthy feeling
- **Secondary Colors**: Warm oranges for appetizing, energetic vibe
- **Typography**: Clean, modern fonts optimized for readability
- **Animations**: Subtle transitions and hover effects
- **Components**: Consistent, accessible UI components

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn)
│   ├── Hero.tsx        # Landing page hero section
│   ├── Features.tsx    # Features showcase
│   ├── IngredientInput.tsx  # Recipe input form
│   └── RecipeResults.tsx    # Recipe display cards
├── pages/              # Page components
├── lib/                # Utility functions
├── hooks/              # Custom React hooks
└── assets/             # Images and static files
```

### Adding New Features

1. **UI Components**: Add to `src/components/`
2. **Pages**: Add to `src/pages/` and update routing in `App.tsx`
3. **Styles**: Use Tailwind classes and design system tokens
4. **Types**: Define in component files or `src/types/`

## 🔐 Backend Integration

To enable full functionality (authentication, database, AI features), connect to Supabase:

1. Click the green Supabase button in the Lovable interface
2. Connect your Supabase account
3. The following features will then be available:
   - User authentication (email/password)
   - Recipe storage and management
   - OpenAI API integration for recipe generation
   - User profiles and preferences

## 🚀 Deployment

### Using Lovable (Recommended)
1. Click "Publish" in the top right of the Lovable editor
2. Your app will be deployed automatically

### Manual Deployment
1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npx vercel --prod
   ```

3. **Or deploy to Netlify**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

## 👥 Team

This project was built for Vibe Coding Hackathon Name. 

### Team Members
- **OBINNA OSAKWE** - Technical Lead - obinnaosakwe1@gmail.com - +2349134701358
- **RAMOTA OMOWUNMI OGUNDELE** - Project Manager - ogundele.ramo@gmail.com - +2348061444449

### Roles
- **Frontend Developer** - React/TypeScript development
- **UI/UX Designer** - Design system and user experience
- **Backend Developer** - Supabase integration and APIs
- **AI Integration Specialist** - OpenAI API integration

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributors
OBINNA OSAKWE
obinnaosakwe1@gmail.com
+2349134701358

RAMOTA OMOWUNMI OGUNDELE 
ogundele.ramo@gmail.com
+2348061444449

## 📞 Support

- **Documentation**: [Lovable Docs](https://docs.lovable.dev)
- **Issues**: Create an issue in this repository
- **Discord**: Join our [Lovable Community](https://discord.com/channels/1119885301872070706/1280461670979993613)

---

Built with ❤️ using [Lovable](https://lovable.dev) - The fastest way to build web applications.
