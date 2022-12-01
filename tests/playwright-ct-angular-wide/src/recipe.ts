export interface Recipe {
  id: string;
  description: string;
  ingredients: Ingredient[];
  name: string;
  pictureUri: string;
  steps: string[];
}

export interface Ingredient {
  quantity?: Quantity;
  name: string;
}

export interface Quantity {
  amount: number;
  unit: string;
}

export function createRecipe(recipe: Recipe): Recipe {
  return recipe;
}

export function createIngredient(ingredient: Ingredient): Ingredient {
  return ingredient;
}

export function createQuantity(quantity: Quantity): Quantity {
  return quantity;
}
