import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DietaryPreference {
  label: string;
  active: boolean;
}

export interface QuickSetting {
  id: string;
  label: string;
  sublabel: string;
  active: boolean;
}

export interface NutritionGoal {
  label: string;
  value: string;
  rawValue: number;
  color: string;
}

interface PreferencesState {
  dietaryPreferences: DietaryPreference[];
  quickSettings: QuickSetting[];
  nutritionGoals: NutritionGoal[];
  
  toggleDietaryPreference: (label: string) => void;
  addDietaryPreference: (label: string) => void;
  toggleQuickSetting: (id: string) => void;
  updateNutritionGoals: (goals: NutritionGoal[]) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      dietaryPreferences: [
        { label: "Vegetarian", active: false },
        { label: "Gluten-Free", active: true },
        { label: "Dairy-Free", active: false },
        { label: "Low-Carb", active: true },
        { label: "High-Protein", active: true },
        { label: "Keto", active: false },
      ],
      
      quickSettings: [
        { id: "quick-meals", label: "Quick meals only", sublabel: "Under 30 min", active: false },
        { id: "family-portions", label: "Family portions", sublabel: "4+ servings", active: true },
        { id: "eco-friendly", label: "Eco-friendly", sublabel: "Low footprint", active: true },
      ],
      
      nutritionGoals: [
        { label: "Daily Calories", value: "2,400 kcal", rawValue: 2400, color: "bg-accent" },
        { label: "Protein Target", value: "120g", rawValue: 120, color: "bg-nutrition-protein" },
        { label: "Carb Limit", value: "250g", rawValue: 250, color: "bg-nutrition-carbs" },
        { label: "Fat Target", value: "80g", rawValue: 80, color: "bg-nutrition-fats" },
      ],

      toggleDietaryPreference: (label) =>
        set((state) => ({
          dietaryPreferences: state.dietaryPreferences.map((pref) =>
            pref.label === label ? { ...pref, active: !pref.active } : pref
          ),
        })),

      addDietaryPreference: (label) =>
        set((state) => ({
          dietaryPreferences: [...state.dietaryPreferences, { label, active: true }],
        })),

      toggleQuickSetting: (id) =>
        set((state) => ({
          quickSettings: state.quickSettings.map((setting) =>
            setting.id === id ? { ...setting, active: !setting.active } : setting
          ),
        })),

      updateNutritionGoals: (goals) =>
        set(() => ({
          nutritionGoals: goals.map((goal) => ({
            ...goal,
            value: goal.label === "Daily Calories"
              ? `${goal.rawValue.toLocaleString()} kcal`
              : `${goal.rawValue}g`,
          })),
        })),
    }),
    {
      name: 'nutri-preferences',
    }
  )
);
