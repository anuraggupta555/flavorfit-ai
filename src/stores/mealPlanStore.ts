import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Meal {
  id: string;
  title: string;
  description: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: string;
  servings: number;
  tags: string[];
  matchScore: number;
  ingredients: string[];
  instructions: string[];
  inPantry?: string[];
}

export interface SelectedMeals {
  breakfast: Meal | null;
  lunch: Meal | null;
  dinner: Meal | null;
  snacks: Meal | null;
}

interface MealPlanState {
  recommendations: Meal[];
  selectedMeals: SelectedMeals;
  favorites: Set<string>;
  isLoading: boolean;
  error: string | null;
  
  setRecommendations: (meals: Meal[]) => void;
  selectMeal: (mealType: keyof SelectedMeals, meal: Meal | null) => void;
  toggleFavorite: (mealId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getTotalNutrition: () => { calories: number; protein: number; carbs: number; fats: number };
}

export const useMealPlanStore = create<MealPlanState>()(
  persist(
    (set, get) => ({
      recommendations: [],
      selectedMeals: {
        breakfast: null,
        lunch: null,
        dinner: null,
        snacks: null,
      },
      favorites: new Set<string>(),
      isLoading: false,
      error: null,

      setRecommendations: (meals) =>
        set(() => ({
          recommendations: meals,
        })),

      selectMeal: (mealType, meal) =>
        set((state) => ({
          selectedMeals: {
            ...state.selectedMeals,
            [mealType]: meal,
          },
        })),

      toggleFavorite: (mealId) =>
        set((state) => {
          const newFavorites = new Set(state.favorites);
          if (newFavorites.has(mealId)) {
            newFavorites.delete(mealId);
          } else {
            newFavorites.add(mealId);
          }
          return { favorites: newFavorites };
        }),

      setLoading: (loading) =>
        set(() => ({
          isLoading: loading,
        })),

      setError: (error) =>
        set(() => ({
          error,
        })),

      getTotalNutrition: () => {
        const { selectedMeals } = get();
        const meals = Object.values(selectedMeals).filter(Boolean) as Meal[];
        
        return meals.reduce(
          (acc, meal) => ({
            calories: acc.calories + meal.calories,
            protein: acc.protein + meal.protein,
            carbs: acc.carbs + meal.carbs,
            fats: acc.fats + meal.fats,
          }),
          { calories: 0, protein: 0, carbs: 0, fats: 0 }
        );
      },
    }),
    {
      name: 'nutri-meal-plan',
      partialize: (state) => ({
        selectedMeals: state.selectedMeals,
        favorites: Array.from(state.favorites),
      }),
      merge: (persisted, current) => {
        const persistedState = persisted as { favorites?: string[]; selectedMeals?: typeof current.selectedMeals } | undefined;
        return {
          ...current,
          selectedMeals: persistedState?.selectedMeals ?? current.selectedMeals,
          favorites: new Set(persistedState?.favorites || []),
        };
      },
    }
  )
);
