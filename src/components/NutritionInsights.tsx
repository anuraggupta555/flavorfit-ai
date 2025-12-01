import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Flame, Beef, Wheat, Droplets, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useMealPlanStore } from "@/stores/mealPlanStore";
import { usePreferencesStore } from "@/stores/preferencesStore";

interface MacroCardProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const MacroCard = ({ label, current, target, unit, color, icon, onClick }: MacroCardProps) => {
  const percentage = Math.min((current / target) * 100, 100);
  const isOver = current > target;
  
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors w-full text-left"
    >
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className={`text-sm ${isOver ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
            {current}/{target}{unit}
          </span>
        </div>
        <Progress value={percentage} className={`h-2 ${isOver ? '[&>div]:bg-destructive' : ''}`} />
      </div>
    </button>
  );
};

const NutritionInsights = () => {
  const { selectedMeals, getTotalNutrition, selectMeal } = useMealPlanStore();
  const { nutritionGoals } = usePreferencesStore();

  const totals = getTotalNutrition();
  
  const goals = {
    calories: nutritionGoals.find(g => g.label === "Daily Calories")?.rawValue || 2400,
    protein: nutritionGoals.find(g => g.label === "Protein Target")?.rawValue || 120,
    carbs: nutritionGoals.find(g => g.label === "Carb Limit")?.rawValue || 250,
    fats: nutritionGoals.find(g => g.label === "Fat Target")?.rawValue || 80,
  };

  const macros = [
    { 
      label: "Calories", 
      current: totals.calories, 
      target: goals.calories, 
      unit: " kcal", 
      color: "bg-accent/20 text-accent",
      icon: <Flame className="h-5 w-5" />
    },
    { 
      label: "Protein", 
      current: totals.protein, 
      target: goals.protein, 
      unit: "g", 
      color: "bg-nutrition-protein/20 text-nutrition-protein",
      icon: <Beef className="h-5 w-5" />
    },
    { 
      label: "Carbs", 
      current: totals.carbs, 
      target: goals.carbs, 
      unit: "g", 
      color: "bg-nutrition-carbs/20 text-nutrition-carbs",
      icon: <Wheat className="h-5 w-5" />
    },
    { 
      label: "Fats", 
      current: totals.fats, 
      target: goals.fats, 
      unit: "g", 
      color: "bg-nutrition-fats/20 text-nutrition-fats",
      icon: <Droplets className="h-5 w-5" />
    },
  ];

  const mealSlots: { key: keyof typeof selectedMeals; name: string; icon: string; defaultCal: number }[] = [
    { key: "breakfast", name: "Breakfast", icon: "🍳", defaultCal: 0 },
    { key: "lunch", name: "Lunch", icon: "🥗", defaultCal: 0 },
    { key: "dinner", name: "Dinner", icon: "🍲", defaultCal: 0 },
    { key: "snacks", name: "Snacks", icon: "🍎", defaultCal: 0 },
  ];

  const handleMacroClick = (label: string) => {
    const macro = macros.find(m => m.label === label);
    if (macro) {
      const percentage = Math.round((macro.current / macro.target) * 100);
      toast.info(`${label} Progress`, {
        description: `You've consumed ${percentage}% of your daily ${label.toLowerCase()} target.`,
      });
    }
  };

  const handleRemoveMeal = (mealType: keyof typeof selectedMeals) => {
    const meal = selectedMeals[mealType];
    if (meal) {
      selectMeal(mealType, null);
      toast.info("Meal removed", {
        description: `${meal.title} has been removed from your ${mealType}.`,
      });
    }
  };

  const handleMealSlotClick = (mealType: keyof typeof selectedMeals) => {
    const meal = selectedMeals[mealType];
    if (!meal) {
      toast.info("No meal selected", {
        description: `Click on a recipe and add it as your ${mealType}.`,
      });
      const element = document.getElementById("menu-suggestions");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <section id="nutrition" className="py-12">
      <div className="container">
        <Card variant="elevated" className="overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Today's Nutrition</CardTitle>
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
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
                  <MacroCard {...macro} onClick={() => handleMacroClick(macro.label)} />
                </div>
              ))}
            </div>

            {/* Meal breakdown */}
            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="font-semibold text-foreground mb-4">Meal Plan</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mealSlots.map((slot, index) => {
                  const meal = selectedMeals[slot.key];
                  return (
                    <div 
                      key={slot.key} 
                      onClick={() => handleMealSlotClick(slot.key)}
                      className={`relative text-center p-4 rounded-xl transition-all cursor-pointer animate-scale-in ${
                        meal 
                          ? "bg-primary/10 ring-2 ring-primary" 
                          : "bg-secondary/50 hover:bg-secondary border-2 border-dashed border-border"
                      }`}
                      style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                    >
                      {meal && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive hover:bg-destructive/90"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveMeal(slot.key);
                          }}
                        >
                          <X className="h-3 w-3 text-destructive-foreground" />
                        </Button>
                      )}
                      <span className="text-2xl mb-2 block">{slot.icon}</span>
                      <p className="text-sm font-medium text-foreground truncate">
                        {meal ? meal.title : slot.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {meal ? `${meal.calories} kcal` : "Not selected"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            {totals.calories > 0 && (
              <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Daily Total</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-accent font-semibold">{totals.calories} kcal</span>
                    <span className="text-nutrition-protein">{totals.protein}g P</span>
                    <span className="text-nutrition-carbs">{totals.carbs}g C</span>
                    <span className="text-nutrition-fats">{totals.fats}g F</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default NutritionInsights;
