import { useState } from "react";
import { Package, AlertTriangle, Plus, ShoppingCart, Trash2, Check, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
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
import { usePantryStore, PantryItem } from "@/stores/pantryStore";
import { useGenerateShoppingList } from "@/hooks/useAI";

interface PantryItemCardProps {
  item: PantryItem;
  onDelete: () => void;
}

const PantryItemCard = ({ item, onDelete }: PantryItemCardProps) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group">
      <div className="h-10 w-10 rounded-lg bg-card flex items-center justify-center text-xl shadow-soft">
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground truncate">{item.name}</p>
          {item.isLow && (
            <Badge variant="destructive" className="text-xs px-1.5 py-0">
              Low
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{item.quantity} · Expires {item.expiresIn}</p>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
      </Button>
    </div>
  );
};

const PantryOverview = () => {
  const { 
    pantryItems, 
    shoppingList, 
    addPantryItem, 
    removePantryItem, 
    toggleShoppingItem,
    addShoppingItem,
    clearCheckedItems 
  } = usePantryStore();
  
  const { generateShoppingList, isLoading: isGeneratingList } = useGenerateShoppingList();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", expiresIn: "", icon: "🥫" });

  const expiringSoon = pantryItems.filter(item => {
    const days = parseInt(item.expiresIn);
    return !isNaN(days) && days <= 3;
  });

  const handleDeleteItem = (item: PantryItem) => {
    removePantryItem(item.id);
    toast.success("Item removed", {
      description: `${item.name} has been removed from your pantry.`,
    });
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.quantity) {
      toast.error("Please fill in required fields");
      return;
    }

    addPantryItem({
      name: newItem.name,
      quantity: newItem.quantity,
      expiresIn: newItem.expiresIn || "1 week",
      isLow: false,
      icon: newItem.icon,
    });

    toast.success("Item added!", {
      description: `${newItem.name} has been added to your pantry.`,
    });

    setNewItem({ name: "", quantity: "", expiresIn: "", icon: "🥫" });
    setAddDialogOpen(false);
  };

  const handleUseInRecipe = () => {
    toast.success("Finding recipes...", {
      description: "Looking for recipes using your expiring items.",
    });
    
    const element = document.getElementById("menu-suggestions");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleGenerateList = async () => {
    try {
      await generateShoppingList(7);
    } catch {
      // Error handled in hook
    }
  };

  const handleAddLowStockToList = () => {
    const lowItems = pantryItems.filter(item => item.isLow);
    let addedCount = 0;
    
    lowItems.forEach(item => {
      const exists = shoppingList.some(si => si.name.toLowerCase() === item.name.toLowerCase());
      if (!exists) {
        addShoppingItem({ name: item.name, checked: false });
        addedCount++;
      }
    });

    if (addedCount > 0) {
      toast.success("Shopping list updated!", {
        description: `Added ${addedCount} low-stock items to your list.`,
      });
    } else {
      toast.info("All stocked up!", {
        description: "All low-stock items are already in your list.",
      });
    }
  };

  const handleClearChecked = () => {
    const checkedCount = shoppingList.filter(i => i.checked).length;
    if (checkedCount > 0) {
      clearCheckedItems();
      toast.success("Items cleared", {
        description: `Removed ${checkedCount} checked items.`,
      });
    }
  };

  const iconOptions = ["🥫", "🍗", "🥚", "🥬", "🥛", "🫒", "🍎", "🥩", "🧀", "🍞", "🥕", "🍋"];

  return (
    <section id="pantry" className="py-12">
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
              <Button variant="soft" size="sm" onClick={() => setAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {pantryItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="animate-fade-up" 
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <PantryItemCard item={item} onDelete={() => handleDeleteItem(item)} />
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
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span>{item.icon}</span>
                          <span className="text-foreground">{item.name}</span>
                        </span>
                        <span className="text-warning font-medium">{item.expiresIn}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="soft" 
                    size="sm" 
                    className="w-full mt-4 bg-warning/10 text-warning hover:bg-warning/20"
                    onClick={handleUseInRecipe}
                  >
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
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Shopping List</p>
                    <p className="text-sm text-muted-foreground">{shoppingList.filter(i => !i.checked).length} items to buy</p>
                  </div>
                  {shoppingList.some(i => i.checked) && (
                    <Button variant="ghost" size="sm" onClick={handleClearChecked}>
                      Clear done
                    </Button>
                  )}
                </div>
                <div className="space-y-2 text-sm max-h-64 overflow-y-auto">
                  {shoppingList.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleShoppingItem(item.id)}
                      className={`flex items-center gap-2 w-full text-left transition-colors ${
                        item.checked ? "text-muted-foreground line-through" : "text-foreground"
                      }`}
                    >
                      <div className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                        item.checked 
                          ? "bg-primary border-primary" 
                          : "border-border hover:border-primary"
                      }`}>
                        {item.checked && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      {item.name}
                      {item.quantity && <span className="text-muted-foreground">({item.quantity})</span>}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="soft" 
                    size="sm" 
                    className="flex-1"
                    onClick={handleAddLowStockToList}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Low Stock
                  </Button>
                  <Button 
                    variant="accent" 
                    size="sm" 
                    className="flex-1"
                    onClick={handleGenerateList}
                    disabled={isGeneratingList}
                  >
                    {isGeneratingList ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-1" />
                    )}
                    AI Generate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Pantry Item</DialogTitle>
            <DialogDescription>
              Add a new item to track in your pantry.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <div className="flex flex-wrap gap-2">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setNewItem(prev => ({ ...prev, icon }))}
                    className={`h-10 w-10 rounded-lg text-xl flex items-center justify-center transition-colors ${
                      newItem.icon === icon 
                        ? "bg-primary/20 ring-2 ring-primary" 
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Chicken Breast"
                value={newItem.name}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                placeholder="e.g., 500g, 6 pcs"
                value={newItem.quantity}
                onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires">Expires In</Label>
              <Input
                id="expires"
                placeholder="e.g., 3 days, 1 week"
                value={newItem.expiresIn}
                onChange={(e) => setNewItem(prev => ({ ...prev, expiresIn: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={handleAddItem}>
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PantryOverview;
