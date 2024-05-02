export interface RecipeFilter {
  keywords?: string;
  maxIngredientCount?: number;
  maxStepCount?: number;
}

export function createRecipeFilter(filter: RecipeFilter): RecipeFilter {
  return filter;
}
