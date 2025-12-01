import { useState } from "react";
import { Settings2, Leaf, Clock, Users, Target, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const PreferencesSection = () => {
  const [dietaryPreferences, setDietaryPreferences] = useState([
    { label: "Vegetarian", active: false },
    { label: "Gluten-Free", active: true },
    { label: "Dairy-Free", active: false },
    { label: "Low-Carb", active: true },
    { label: "High-Protein", active: true },
    { label: "Keto", active: false },
  ]);

  const [quickSettings, setQuickSettings] = useState([
    { icon: <Clock className="h-4 w-4" />, label: "Quick meals only", sublabel: "Under 30 min", active: false },
    { icon: <Users className="h-4 w-4" />, label: "Family portions", sublabel: "4+ servings", active: true },
    { icon: <Leaf className="h-4 w-4" />, label: "Eco-friendly", sublabel: "Low footprint", active: true },
  ]);

  const [nutritionGoals, setNutritionGoals] = useState([
    { label: "Daily Calories", value: "2,400 kcal", rawValue: 2400, color: "bg-accent" },
    { label: "Protein Target", value: "120g", rawValue: 120, color: "bg-nutrition-protein" },
    { label: "Carb Limit", value: "250g", rawValue: 250, color: "bg-nutrition-carbs" },
    { label: "Fat Target", value: "80g", rawValue: 80, color: "bg-nutrition-fats" },
  ]);

  const [goalsDialogOpen, setGoalsDialogOpen] = useState(false);
  const [editedGoals, setEditedGoals] = useState(nutritionGoals);
  const [customRestriction, setCustomRestriction] = useState("");

  const toggleDietaryPreference = (label: string) => {
    setDietaryPreferences(prev => prev.map(pref => {
      if (pref.label === label) {
        const newState = !pref.active;
        toast.success(newState ? "Preference enabled" : "Preference disabled", {
          description: `${label} has been ${newState ? "added to" : "removed from"} your diet preferences.`,
        });
        return { ...pref, active: newState };
      }
      return pref;
    }));
  };

  const toggleQuickSetting = (label: string) => {
    setQuickSettings(prev => prev.map(setting => {
      if (setting.label === label) {
        const newState = !setting.active;
        toast.success(newState ? "Setting enabled" : "Setting disabled", {
          description: `${label} is now ${newState ? "on" : "off"}.`,
        });
        return { ...setting, active: newState };
      }
      return setting;
    }));
  };

  const handleAddCustomRestriction = () => {
    if (!customRestriction.trim()) {
      toast.error("Please enter a restriction name");
      return;
    }

    if (dietaryPreferences.some(p => p.label.toLowerCase() === customRestriction.toLowerCase())) {
      toast.error("This restriction already exists");
      return;
    }

    setDietaryPreferences(prev => [...prev, { label: customRestriction, active: true }]);
    toast.success("Custom restriction added!", {
      description: `${customRestriction} has been added to your preferences.`,
    });
    setCustomRestriction("");
  };

  const handleSaveGoals = () => {
    setNutritionGoals(editedGoals.map(goal => ({
      ...goal,
      value: goal.label === "Daily Calories" 
        ? `${goal.rawValue.toLocaleString()} kcal` 
        : `${goal.rawValue}g`
    })));
    
    toast.success("Goals updated!", {
      description: "Your nutrition targets have been saved.",
    });
    setGoalsDialogOpen(false);
  };

  const updateGoalValue = (label: string, value: number) => {
    setEditedGoals(prev => prev.map(goal => 
      goal.label === label ? { ...goal, rawValue: value } : goal
    ));
  };

  return (
    <section id="preferences" className="py-12 bg-secondary/20">
      <div className="container">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Settings2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Your Preferences</h2>
            <p className="text-muted-foreground">Customize your AI recommendations</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dietary preferences */}
          <Card variant="elevated" className="animate-fade-up">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                Dietary Restrictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {dietaryPreferences.map((pref) => (
                  <Badge
                    key={pref.label}
                    variant={pref.active ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      pref.active 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                        : "hover:bg-secondary"
                    }`}
                    onClick={() => toggleDietaryPreference(pref.label)}
                  >
                    {pref.label}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Input
                  placeholder="Add custom restriction"
                  value={customRestriction}
                  onChange={(e) => setCustomRestriction(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCustomRestriction()}
                  className="flex-1"
                />
                <Button variant="ghost" size="sm" onClick={handleAddCustomRestriction}>
                  + Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick settings */}
          <Card variant="elevated" className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-primary" />
                Quick Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickSettings.map((setting) => (
                <div key={setting.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                      {setting.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{setting.label}</p>
                      <p className="text-xs text-muted-foreground">{setting.sublabel}</p>
                    </div>
                  </div>
                  <Switch 
                    checked={setting.active} 
                    onCheckedChange={() => toggleQuickSetting(setting.label)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Nutrition goals */}
          <Card variant="elevated" className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Nutrition Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nutritionGoals.map((goal) => (
                  <div key={goal.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${goal.color}`} />
                      <span className="text-sm text-foreground">{goal.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{goal.value}</span>
                  </div>
                ))}
              </div>
              <Button 
                variant="soft" 
                size="sm" 
                className="w-full mt-4"
                onClick={() => {
                  setEditedGoals(nutritionGoals);
                  setGoalsDialogOpen(true);
                }}
              >
                Adjust Goals
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Goals Dialog */}
      <Dialog open={goalsDialogOpen} onOpenChange={setGoalsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Nutrition Goals</DialogTitle>
            <DialogDescription>
              Set your daily nutrition targets for personalized recommendations.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {editedGoals.map((goal) => (
              <div key={goal.label} className="space-y-2">
                <Label htmlFor={goal.label} className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${goal.color}`} />
                  {goal.label}
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id={goal.label}
                    type="number"
                    value={goal.rawValue}
                    onChange={(e) => updateGoalValue(goal.label, parseInt(e.target.value) || 0)}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-12">
                    {goal.label === "Daily Calories" ? "kcal" : "g"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setGoalsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={handleSaveGoals}>
              <Save className="h-4 w-4 mr-2" />
              Save Goals
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PreferencesSection;
