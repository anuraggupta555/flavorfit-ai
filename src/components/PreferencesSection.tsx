import { Settings2, Leaf, Clock, Users, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";

const PreferencesSection = () => {
  const dietaryPreferences = [
    { label: "Vegetarian", active: false },
    { label: "Gluten-Free", active: true },
    { label: "Dairy-Free", active: false },
    { label: "Low-Carb", active: true },
    { label: "High-Protein", active: true },
    { label: "Keto", active: false },
  ];

  const quickSettings = [
    { icon: <Clock className="h-4 w-4" />, label: "Quick meals only", sublabel: "Under 30 min", active: false },
    { icon: <Users className="h-4 w-4" />, label: "Family portions", sublabel: "4+ servings", active: true },
    { icon: <Leaf className="h-4 w-4" />, label: "Eco-friendly", sublabel: "Low footprint", active: true },
  ];

  return (
    <section className="py-12 bg-secondary/20">
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
                  >
                    {pref.label}
                  </Badge>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="mt-4 w-full">
                + Add custom restriction
              </Button>
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
                  <Switch checked={setting.active} />
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
                {[
                  { label: "Daily Calories", value: "2,400 kcal", color: "bg-accent" },
                  { label: "Protein Target", value: "120g", color: "bg-nutrition-protein" },
                  { label: "Carb Limit", value: "250g", color: "bg-nutrition-carbs" },
                  { label: "Fat Target", value: "80g", color: "bg-nutrition-fats" },
                ].map((goal) => (
                  <div key={goal.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${goal.color}`} />
                      <span className="text-sm text-foreground">{goal.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{goal.value}</span>
                  </div>
                ))}
              </div>
              <Button variant="soft" size="sm" className="w-full mt-4">
                Adjust Goals
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PreferencesSection;
