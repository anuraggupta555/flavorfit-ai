import { Package, AlertTriangle, Plus, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface PantryItemProps {
  name: string;
  quantity: string;
  expiresIn: string;
  isLow: boolean;
  icon: string;
}

const PantryItem = ({ name, quantity, expiresIn, isLow, icon }: PantryItemProps) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
      <div className="h-10 w-10 rounded-lg bg-card flex items-center justify-center text-xl shadow-soft">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground truncate">{name}</p>
          {isLow && (
            <Badge variant="destructive" className="text-xs px-1.5 py-0">
              Low
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{quantity} · Expires {expiresIn}</p>
      </div>
    </div>
  );
};

const PantryOverview = () => {
  const pantryItems = [
    { name: "Chicken Breast", quantity: "500g", expiresIn: "3 days", isLow: false, icon: "🍗" },
    { name: "Brown Rice", quantity: "200g", expiresIn: "2 months", isLow: true, icon: "🍚" },
    { name: "Eggs", quantity: "6 pcs", expiresIn: "1 week", isLow: false, icon: "🥚" },
    { name: "Spinach", quantity: "100g", expiresIn: "2 days", isLow: true, icon: "🥬" },
    { name: "Greek Yogurt", quantity: "500ml", expiresIn: "5 days", isLow: false, icon: "🥛" },
    { name: "Olive Oil", quantity: "250ml", expiresIn: "6 months", isLow: false, icon: "🫒" },
  ];

  const expiringSoon = pantryItems.filter(item => {
    const days = parseInt(item.expiresIn);
    return !isNaN(days) && days <= 3;
  });

  return (
    <section className="py-12">
      <div className="container">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main pantry card */}
          <Card variant="elevated" className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Your Pantry</CardTitle>
                  <p className="text-sm text-muted-foreground">{pantryItems.length} items tracked</p>
                </div>
              </div>
              <Button variant="soft" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {pantryItems.map((item, index) => (
                  <div 
                    key={item.name} 
                    className="animate-fade-up" 
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <PantryItem {...item} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick actions sidebar */}
          <div className="space-y-6">
            {/* Expiring soon alert */}
            {expiringSoon.length > 0 && (
              <Card variant="nutrition" className="border-warning/30 animate-fade-up">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-warning/20 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Expiring Soon</p>
                      <p className="text-sm text-muted-foreground">{expiringSoon.length} items need attention</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {expiringSoon.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span>{item.icon}</span>
                          <span className="text-foreground">{item.name}</span>
                        </span>
                        <span className="text-warning font-medium">{item.expiresIn}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="soft" size="sm" className="w-full mt-4 bg-warning/10 text-warning hover:bg-warning/20">
                    Use in Recipe
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Shopping list */}
            <Card variant="elevated" className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Shopping List</p>
                    <p className="text-sm text-muted-foreground">5 items to buy</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {["Avocados (3)", "Salmon fillet", "Cherry tomatoes", "Fresh basil", "Lemon"].map((item, index) => (
                    <div key={item} className="flex items-center gap-2 text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {item}
                    </div>
                  ))}
                </div>
                <Button variant="accent" size="sm" className="w-full mt-4">
                  Generate List
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PantryOverview;
