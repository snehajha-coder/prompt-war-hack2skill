export interface Meal {
  title: string;
  prepTime: string;
  ingredients: string[];
  instructions: string[];
  co2e: string;
  ecoTip: string;
}

export interface Meals {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
}

export interface GroceryItem {
  name: string;
  category: string;
  estimatedCost: number;
  co2Level: 'Low' | 'Medium' | 'High' | string;
}

export interface Substitution {
  originalItem: string;
  ecoReplacement: string;
  reason: string;
  costDifference: number;
}

export interface BudgetAnalysis {
  totalEstimatedCost: number;
  feasibilityStatus: 'under_budget' | 'on_target' | 'over_budget' | string;
  savingTips: string[];
  feasibilityDetails: string;
}

export interface TodoItem {
  task: string;
  type: 'shopping' | 'prep' | 'cooking' | 'cleanup' | string;
  points: number;
}

export interface Plan {
  levelTitle: string;
  xpEarned: number;
  co2SavedKg: number;
  ecoScore: number;
  meals: Meals;
  groceryList: GroceryItem[];
  substitutions: Substitution[];
  budgetAnalysis: BudgetAnalysis;
  todoList: TodoItem[];
  _debug_warning?: string;
}
