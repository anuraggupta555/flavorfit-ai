import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PantryItem {
  id: string;
  name: string;
  quantity: string;
  expiresIn: string;
  isLow: boolean;
  icon: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity?: string;
  checked: boolean;
}

interface PantryState {
  pantryItems: PantryItem[];
  shoppingList: ShoppingListItem[];
  
  addPantryItem: (item: Omit<PantryItem, 'id'>) => void;
  removePantryItem: (id: string) => void;
  updatePantryItem: (id: string, updates: Partial<PantryItem>) => void;
  
  addShoppingItem: (item: Omit<ShoppingListItem, 'id'>) => void;
  removeShoppingItem: (id: string) => void;
  toggleShoppingItem: (id: string) => void;
  setShoppingList: (items: ShoppingListItem[]) => void;
  clearCheckedItems: () => void;
}

export const usePantryStore = create<PantryState>()(
  persist(
    (set) => ({
      pantryItems: [
        { id: '1', name: "Chicken Breast", quantity: "500g", expiresIn: "3 days", isLow: false, icon: "🍗" },
        { id: '2', name: "Brown Rice", quantity: "200g", expiresIn: "2 months", isLow: true, icon: "🍚" },
        { id: '3', name: "Eggs", quantity: "6 pcs", expiresIn: "1 week", isLow: false, icon: "🥚" },
        { id: '4', name: "Spinach", quantity: "100g", expiresIn: "2 days", isLow: true, icon: "🥬" },
        { id: '5', name: "Greek Yogurt", quantity: "500ml", expiresIn: "5 days", isLow: false, icon: "🥛" },
        { id: '6', name: "Olive Oil", quantity: "250ml", expiresIn: "6 months", isLow: false, icon: "🫒" },
      ],
      
      shoppingList: [
        { id: '1', name: "Avocados", quantity: "3", checked: false },
        { id: '2', name: "Salmon fillet", quantity: "400g", checked: false },
        { id: '3', name: "Cherry tomatoes", quantity: "200g", checked: false },
        { id: '4', name: "Fresh basil", checked: false },
        { id: '5', name: "Lemon", quantity: "2", checked: false },
      ],

      addPantryItem: (item) =>
        set((state) => ({
          pantryItems: [...state.pantryItems, { ...item, id: crypto.randomUUID() }],
        })),

      removePantryItem: (id) =>
        set((state) => ({
          pantryItems: state.pantryItems.filter((item) => item.id !== id),
        })),

      updatePantryItem: (id, updates) =>
        set((state) => ({
          pantryItems: state.pantryItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),

      addShoppingItem: (item) =>
        set((state) => ({
          shoppingList: [...state.shoppingList, { ...item, id: crypto.randomUUID() }],
        })),

      removeShoppingItem: (id) =>
        set((state) => ({
          shoppingList: state.shoppingList.filter((item) => item.id !== id),
        })),

      toggleShoppingItem: (id) =>
        set((state) => ({
          shoppingList: state.shoppingList.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        })),

      setShoppingList: (items) =>
        set(() => ({
          shoppingList: items,
        })),

      clearCheckedItems: () =>
        set((state) => ({
          shoppingList: state.shoppingList.filter((item) => !item.checked),
        })),
    }),
    {
      name: 'nutri-pantry',
    }
  )
);
