import { Sparkles, Clock, Users, ChefHat, Heart, ArrowRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface MealCardProps {
  title: string;
  description: string;
  image: string;
  calories: number;
  time: string;
  servings: number;
  tags: string[];
  matchScore: number;
  index: number;
}

const MealCard = ({ title, description, image, calories, time, servings, tags, matchScore, index }: MealCardProps) => {
  return (
    <Card 
      variant="interactive" 
      className="overflow-hidden group animate-fade-up"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        
        {/* Match score badge */}
        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          {matchScore}% Match
        </div>

        {/* Favorite button */}
        <button className="absolute top-3 left-3 h-9 w-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors">
          <Heart className="h-4 w-4 text-foreground" />
        </button>

        {/* Quick info overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 text-primary-foreground text-xs">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {time}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {servings} servings
          </span>
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>
          <span className="text-sm font-medium text-accent whitespace-nowrap">
            {calories} kcal
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <Button variant="soft" className="w-full group/btn">
          View Recipe
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

const MenuSuggestions = () => {
  const meals = [
    {
      title: "Mediterranean Quinoa Bowl",
      description: "Fresh vegetables, feta cheese, olives, and lemon herb dressing over fluffy quinoa.",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
      calories: 485,
      time: "25 min",
      servings: 2,
      tags: ["High Protein", "Vegetarian"],
      matchScore: 98,
    },
    {
      title: "Grilled Salmon with Asparagus",
      description: "Omega-3 rich salmon with roasted asparagus and garlic mashed cauliflower.",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
      calories: 520,
      time: "30 min",
      servings: 2,
      tags: ["High Protein", "Keto"],
      matchScore: 94,
    },
    {
      title: "Asian Chicken Stir-Fry",
      description: "Colorful bell peppers, snap peas, and tender chicken in a savory ginger sauce.",
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
      calories: 410,
      time: "20 min",
      servings: 3,
      tags: ["Quick", "Low Carb"],
      matchScore: 91,
    },
    {
      title: "Avocado Toast Stack",
      description: "Multi-grain toast with smashed avocado, poached eggs, and microgreens.",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80",
      calories: 380,
      time: "15 min",
      servings: 1,
      tags: ["Breakfast", "Vegetarian"],
      matchScore: 87,
    },
  ];

  return (
    <section className="py-12 bg-secondary/30">
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
          <Button variant="outline">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {meals.map((meal, index) => (
            <MealCard key={meal.title} {...meal} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSuggestions;
