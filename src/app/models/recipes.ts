import {Ingredient} from "./ingredients";

/**
 * A RecipeRecord is a raw recipe as read from the JSON.
 */
export interface RecipeRecord {
  name: string;
  quantity: number;
  value?: number;
  verified: boolean;

  ingredients: {name: string, quantity: number}[];
}

/**
 * A recipe.
 */
export interface Recipe {
  name: string;
  yield: number;
  value?: number;
  verified: boolean;
  ingredients: { ingredient: Ingredient, quantity: number}[];
}
