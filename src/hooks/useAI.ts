import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePreferencesStore } from '@/stores/preferencesStore';
import { usePantryStore } from '@/stores/pantryStore';
import { useMealPlanStore, Meal } from '@/stores/mealPlanStore';
import { toast } from 'sonner';

export function useGenerateMeals() {
  const [isLoading, setIsLoading] = useState(false);
  
  const { dietaryPreferences, quickSettings, nutritionGoals } = usePreferencesStore();
  const { pantryItems } = usePantryStore();
  const { setRecommendations, setLoading, setError } = useMealPlanStore();

  const generateMeals = async () => {
    setIsLoading(true);
    setLoading(true);
    setError(null);

    try {
      const activePreferences = dietaryPreferences
        .filter((p) => p.active)
        .map((p) => p.label);

      const activeQuickSettings = quickSettings.reduce((acc, s) => {
        acc[s.id] = s.active;
        return acc;
      }, {} as Record<string, boolean>);

      const goals = nutritionGoals.reduce((acc, g) => {
        const key = g.label.toLowerCase().replace(/\s+/g, '_');
        acc[key === 'daily_calories' ? 'calories' : key.replace('_target', '').replace('_limit', '')] = g.rawValue;
        return acc;
      }, {} as Record<string, number>);

      const { data, error } = await supabase.functions.invoke('generate-meals', {
        body: {
          preferences: activePreferences,
          pantry: pantryItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            expiresIn: item.expiresIn,
          })),
          quickSettings: activeQuickSettings,
          nutritionGoals: goals,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const meals: Meal[] = data.meals;
      setRecommendations(meals);
      toast.success('Meals generated!', {
        description: `Found ${meals.length} personalized recommendations.`,
      });

      return meals;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate meals';
      setError(message);
      toast.error('Failed to generate meals', { description: message });
      throw err;
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return { generateMeals, isLoading };
}

export function useGenerateShoppingList() {
  const [isLoading, setIsLoading] = useState(false);
  
  const { dietaryPreferences, nutritionGoals } = usePreferencesStore();
  const { pantryItems, setShoppingList } = usePantryStore();
  const { recommendations } = useMealPlanStore();

  const generateShoppingList = async (daysToplan = 7) => {
    setIsLoading(true);

    try {
      const activePreferences = dietaryPreferences
        .filter((p) => p.active)
        .map((p) => p.label);

      const goals = nutritionGoals.reduce((acc, g) => {
        const key = g.label.toLowerCase().replace(/\s+/g, '_');
        acc[key === 'daily_calories' ? 'calories' : key.replace('_target', '').replace('_limit', '')] = g.rawValue;
        return acc;
      }, {} as Record<string, number>);

      // Pass recommended meals so AI can suggest their missing ingredients
      const selectedMeals = recommendations.map((meal) => ({
        title: meal.title,
        ingredients: meal.ingredients,
        missingIngredients: meal.ingredients.filter(
          (ing) => !meal.inPantry?.some((p) => p.toLowerCase().includes(ing.toLowerCase()))
        ),
      }));

      const { data, error } = await supabase.functions.invoke('generate-shopping-list', {
        body: {
          preferences: activePreferences,
          pantry: pantryItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
          })),
          nutritionGoals: goals,
          selectedMeals,
          daysToplan,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setShoppingList(data.shoppingList);
      
      toast.success('Shopping list generated!', {
        description: `${data.shoppingList.length} items for ${data.estimatedMeals} meals.`,
      });

      if (data.tips?.length > 0) {
        setTimeout(() => {
          toast.info('Shopping tip', { description: data.tips[0] });
        }, 2000);
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate shopping list';
      toast.error('Failed to generate list', { description: message });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateShoppingList, isLoading };
}
