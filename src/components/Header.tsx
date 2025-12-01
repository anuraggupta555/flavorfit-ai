import { Sparkles, User, Settings } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">NutriAI</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Dashboard
          </a>
          <a href="#" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Meal Plans
          </a>
          <a href="#" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Pantry
          </a>
          <a href="#" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Insights
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="soft" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
