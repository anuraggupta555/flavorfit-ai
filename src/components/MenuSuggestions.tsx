import { useState } from "react";
import { Sparkles, Clock, Users, ChefHat, Heart, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useMealPlanStore, Meal } from "@/stores/mealPlanStore";
import { useGenerateMeals } from "@/hooks/useAI";

interface MealCardProps {
  meal: Meal;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onViewRecipe: () => void;
}

const MealCard = ({ 
  meal,
  index,
  isFavorite,
  onToggleFavorite,
  onViewRecipe
}: MealCardProps) => {
  return (
    <Card 
      variant="interactive" 
      className="overflow-hidden group animate-fade-up"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={meal.image} 
          alt={meal.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        
        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          {meal.matchScore}% Match
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute top-3 left-3 h-9 w-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
            isFavorite 
              ? "bg-destructive text-destructive-foreground" 
              : "bg-card/80 hover:bg-card text-foreground"
          }`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
        </button>

        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 text-primary-foreground text-xs">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {meal.time}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {meal.servings} servings
          </span>
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {meal.title}
          </h3>
          <span className="text-sm font-medium text-accent whitespace-nowrap">
            {meal.calories} kcal
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {meal.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {meal.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <Button variant="soft" className="w-full group/btn" onClick={onViewRecipe}>
          View Recipe
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

const defaultMeals: Meal[] = [
  {
    id: "1",
    title: "Mediterranean Quinoa Bowl",
    description: "Fresh vegetables, feta cheese, olives, and lemon herb dressing over fluffy quinoa.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    calories: 485,
    protein: 32,
    carbs: 45,
    fats: 18,
    time: "25 min",
    servings: 2,
    tags: ["High Protein", "Vegetarian"],
    matchScore: 98,
    ingredients: ["Quinoa", "Cherry tomatoes", "Cucumber", "Feta cheese", "Kalamata olives", "Red onion", "Lemon", "Olive oil", "Fresh herbs"],
    instructions: ["Cook quinoa according to package directions and let cool", "Dice tomatoes, cucumber, and red onion", "Whisk together lemon juice, olive oil, and herbs for dressing", "Combine quinoa with vegetables", "Top with crumbled feta and olives", "Drizzle with dressing and serve"]
  },
  {
    id: "2",
    title: "Grilled Salmon with Asparagus",
    description: "Omega-3 rich salmon with roasted asparagus and garlic mashed cauliflower.",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
    calories: 520,
    protein: 42,
    carbs: 15,
    fats: 28,
    time: "30 min",
    servings: 2,
    tags: ["High Protein", "Keto"],
    matchScore: 94,
    ingredients: ["Salmon fillets", "Asparagus", "Cauliflower", "Garlic", "Butter", "Lemon", "Olive oil", "Salt", "Pepper"],
    instructions: ["Preheat grill to medium-high heat", "Season salmon with salt, pepper, and lemon", "Steam cauliflower until tender, then mash with garlic and butter", "Toss asparagus with olive oil and seasonings", "Grill salmon for 4-5 minutes per side", "Grill asparagus until tender-crisp", "Serve salmon over cauliflower mash with asparagus"]
  },
  {
    id: "3",
    title: "Asian Chicken Stir-Fry",
    description: "Colorful bell peppers, snap peas, and tender chicken in a savory ginger sauce.",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
    calories: 410,
    protein: 38,
    carbs: 22,
    fats: 16,
    time: "20 min",
    servings: 3,
    tags: ["Quick", "Low Carb"],
    matchScore: 91,
    ingredients: ["Chicken breast", "Bell peppers", "Snap peas", "Ginger", "Garlic", "Soy sauce", "Sesame oil", "Green onions"],
    instructions: ["Slice chicken breast into thin strips", "Prep vegetables - slice peppers, trim snap peas", "Heat oil in wok over high heat", "Stir-fry chicken until golden, set aside", "Stir-fry vegetables with ginger and garlic", "Return chicken to wok, add sauce", "Garnish with green onions and sesame seeds"]
  },
  {
    id: "4",
    title: "Avocado Toast Stack",
    description: "Multi-grain toast with smashed avocado, poached eggs, and microgreens.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80",
    calories: 380,
    protein: 18,
    carbs: 35,
    fats: 22,
    time: "15 min",
    servings: 1,
    tags: ["Breakfast", "Vegetarian"],
    matchScore: 87,
    ingredients: ["Multi-grain bread", "Avocado", "Eggs", "Microgreens", "Cherry tomatoes", "Lemon juice", "Red pepper flakes", "Salt"],
    instructions: ["Toast bread until golden and crispy", "Mash avocado with lemon juice and salt", "Poach eggs in simmering water for 3-4 minutes", "Spread avocado on toast", "Top with poached egg", "Garnish with microgreens, tomatoes, and red pepper flakes"]
  },
];

const MenuSuggestions = () => {
  const { recommendations, favorites, toggleFavorite, selectMeal, isLoading } = useMealPlanStore();
  const { generateMeals, isLoading: isGenerating } = useGenerateMeals();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mealTypeDialog, setMealTypeDialog] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<"breakfast" | "lunch" | "dinner" | "snacks">("lunch");

  const mealsToShow = recommendations.length > 0 ? recommendations : defaultMeals;

  const handleToggleFavorite = (meal: Meal) => {
    toggleFavorite(meal.id);
    if (favorites.has(meal.id)) {
      toast.info("Removed from favorites", {
        description: `${meal.title} has been removed from your favorites.`,
      });
    } else {
      toast.success("Added to favorites!", {
        description: `${meal.title} has been saved to your favorites.`,
      });
    }
  };

  const handleViewRecipe = (meal: Meal) => {
    setSelectedMeal(meal);
    setDialogOpen(true);
  };

  const handleAddToMealPlan = () => {
    if (selectedMeal) {
      setMealTypeDialog(true);
    }
  };

  const confirmAddToMealPlan = () => {
    if (selectedMeal) {
      selectMeal(selectedMealType, selectedMeal);
      toast.success("Added to meal plan!", {
        description: `${selectedMeal.title} has been added as your ${selectedMealType}.`,
      });
      setMealTypeDialog(false);
      setDialogOpen(false);
    }
  };

  const handleGenerateMeals = async () => {
    try {
      await generateMeals();
    } catch {
      // Error handled in hook
    }
  };

  return (
    <section id="menu-suggestions" className="py-12 bg-secondary/30">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ChefHat className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">AI Recommendations</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Personalized for You</h2>
            <p className="text-muted-foreground mt-1">Based on your pantry and nutritional goals</p>
          </div>
          <Button 
            variant="hero" 
            onClick={handleGenerateMeals}
            disabled={isGenerating || isLoading}
          >
            {isGenerating || isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Meals
              </>
            )}
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mealsToShow.map((meal, index) => (
            <MealCard 
              key={meal.id} 
              meal={meal}
              index={index}
              isFavorite={favorites.has(meal.id)}
              onToggleFavorite={() => handleToggleFavorite(meal)}
              onViewRecipe={() => handleViewRecipe(meal)}
            />
          ))}
        </div>
      </div>

      {/* Recipe Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedMeal && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedMeal.title}</DialogTitle>
                <DialogDescription>{selectedMeal.description}</DialogDescription>
              </DialogHeader>
              
              <div className="relative h-56 rounded-xl overflow-hidden my-4">
                <img 
                  src={selectedMeal.image} 
                  alt={selectedMeal.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {selectedMeal.time}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {selectedMeal.servings} servings
                </div>
              </div>

              {/* Nutrition breakdown */}
              <div className="grid grid-cols-4 gap-3 p-4 rounded-xl bg-secondary/50 mb-6">
                <div className="text-center">
                  <p className="text-lg font-bold text-accent">{selectedMeal.calories}</p>
                  <p className="text-xs text-muted-foreground">Calories</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-nutrition-protein">{selectedMeal.protein}g</p>
                  <p className="text-xs text-muted-foreground">Protein</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-nutrition-carbs">{selectedMeal.carbs}g</p>
                  <p className="text-xs text-muted-foreground">Carbs</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-nutrition-fats">{selectedMeal.fats}g</p>
                  <p className="text-xs text-muted-foreground">Fats</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Ingredients</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {selectedMeal.ingredients.map((ingredient, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className={`h-1.5 w-1.5 rounded-full ${
                          selectedMeal.inPantry?.includes(ingredient) ? 'bg-primary' : 'bg-muted-foreground'
                        }`} />
                        <span className={selectedMeal.inPantry?.includes(ingredient) ? 'text-primary font-medium' : ''}>
                          {ingredient}
                          {selectedMeal.inPantry?.includes(ingredient) && ' ✓'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Instructions</h4>
                  <ol className="space-y-3">
                    {selectedMeal.instructions.map((step, idx) => (
                      <li key={idx} className="flex gap-3 text-sm">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                          {idx + 1}
                        </span>
                        <span className="text-muted-foreground pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  variant="hero" 
                  className="flex-1"
                  onClick={handleAddToMealPlan}
                >
                  Add to Meal Plan
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleToggleFavorite(selectedMeal)}
                >
                  <Heart className={`h-4 w-4 ${favorites.has(selectedMeal.id) ? "fill-current text-destructive" : ""}`} />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Meal Type Selection Dialog */}
      <Dialog open={mealTypeDialog} onOpenChange={setMealTypeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Meal Plan</DialogTitle>
            <DialogDescription>
              Choose which meal slot to add "{selectedMeal?.title}" to.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Select value={selectedMealType} onValueChange={(v) => setSelectedMealType(v as typeof selectedMealType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">🍳 Breakfast</SelectItem>
                <SelectItem value="lunch">🥗 Lunch</SelectItem>
                <SelectItem value="dinner">🍲 Dinner</SelectItem>
                <SelectItem value="snacks">🍎 Snacks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setMealTypeDialog(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={confirmAddToMealPlan}>
              Add to {selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default MenuSuggestions;
