import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import NutritionInsights from "@/components/NutritionInsights";
import MenuSuggestions from "@/components/MenuSuggestions";
import PantryOverview from "@/components/PantryOverview";
import PreferencesSection from "@/components/PreferencesSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <NutritionInsights />
        <MenuSuggestions />
        <PantryOverview />
        <PreferencesSection />
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-bold">N</span>
              </div>
              <span className="font-semibold text-foreground">NutriAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 NutriAI. Personalized nutrition powered by AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
