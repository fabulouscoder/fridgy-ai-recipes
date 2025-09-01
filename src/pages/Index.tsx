import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import IngredientInput from "@/components/IngredientInput";
import RecipeResults from "@/components/RecipeResults";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <IngredientInput />
        <RecipeResults />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
