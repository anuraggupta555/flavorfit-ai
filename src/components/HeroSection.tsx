import { Sparkles, TrendingUp, Leaf } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleGetStarted = () => {
    scrollToSection("menu-suggestions");
    toast.success("Let's find your perfect meal!", {
      description: "Check out our AI-powered recommendations below.",
    });
  };

  const handleLearnMore = () => {
    scrollToSection("nutrition");
    toast.info("Track your nutrition journey", {
      description: "View your daily insights and progress.",
    });
  };

  return (
    <section id="hero" className="relative overflow-hidden gradient-hero py-16 lg:py-24">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              AI-Powered Nutrition
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Personalized menus,
              <span className="text-primary"> powered by AI</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Get intelligent meal recommendations based on your pantry, preferences, and nutritional goals. Eat healthier with zero guesswork.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" onClick={handleGetStarted}>
                Get Started
              </Button>
              <Button variant="outline" size="xl" onClick={handleLearnMore}>
                Learn More
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">2,400</p>
                  <p className="text-xs text-muted-foreground">Daily calories</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Balanced</p>
                  <p className="text-xs text-muted-foreground">Nutrition score</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80" 
                alt="Healthy colorful meal bowl with fresh vegetables"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 z-20 p-4 rounded-2xl bg-card shadow-elevated border animate-float">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <span className="text-2xl">🥗</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Today's Pick</p>
                  <p className="text-sm text-muted-foreground">Mediterranean Bowl</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
