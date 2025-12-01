import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Flame, Beef, Wheat, Droplets } from "lucide-react";

interface MacroCardProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  icon: React.ReactNode;
}

const MacroCard = ({ label, current, target, unit, color, icon }: MacroCardProps) => {
  const percentage = Math.min((current / target) * 100, 100);
  
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="text-sm text-muted-foreground">
            {current}/{target}{unit}
          </span>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
    </div>
  );
};

const NutritionInsights = () => {
  const macros = [
    { 
      label: "Calories", 
      current: 1850, 
      target: 2400, 
      unit: " kcal", 
      color: "bg-accent/20 text-accent",
      icon: <Flame className="h-5 w-5" />
    },
    { 
      label: "Protein", 
      current: 95, 
      target: 120, 
      unit: "g", 
      color: "bg-nutrition-protein/20 text-nutrition-protein",
      icon: <Beef className="h-5 w-5" />
    },
    { 
      label: "Carbs", 
      current: 180, 
      target: 250, 
      unit: "g", 
      color: "bg-nutrition-carbs/20 text-nutrition-carbs",
      icon: <Wheat className="h-5 w-5" />
    },
    { 
      label: "Fats", 
      current: 55, 
      target: 80, 
      unit: "g", 
      color: "bg-nutrition-fats/20 text-nutrition-fats",
      icon: <Droplets className="h-5 w-5" />
    },
  ];

  return (
    <section className="py-12">
      <div className="container">
        <Card variant="elevated" className="overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Today's Nutrition</CardTitle>
              <span className="text-sm text-muted-foreground">December 1, 2025</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {macros.map((macro, index) => (
                <div 
                  key={macro.label} 
                  className="animate-fade-up" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <MacroCard {...macro} />
                </div>
              ))}
            </div>

            {/* Meal breakdown */}
            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="font-semibold text-foreground mb-4">Meal Breakdown</h4>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { name: "Breakfast", cal: 450, icon: "🍳" },
                  { name: "Lunch", cal: 650, icon: "🥗" },
                  { name: "Dinner", cal: 550, icon: "🍲" },
                  { name: "Snacks", cal: 200, icon: "🍎" },
                ].map((meal, index) => (
                  <div 
                    key={meal.name} 
                    className="text-center p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer animate-scale-in"
                    style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                  >
                    <span className="text-2xl mb-2 block">{meal.icon}</span>
                    <p className="text-sm font-medium text-foreground">{meal.name}</p>
                    <p className="text-xs text-muted-foreground">{meal.cal} kcal</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default NutritionInsights;
