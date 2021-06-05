/**
 * Describes the type of an ingredient.
 */
export enum IngredientType {
  // Plant ingredients are harvested from planetary flora, but cannot be grown.
  PLANT = "plant",

  // Cultivated ingredients are harvested from flora that can be grown.
  CULTIVATED = "cultivated",

  // Husbandry ingredients are obtained by interacting peacefully with planetary fauna.
  HUSBANDRY = "husbandry",

  // Animal ingredients are harvested by killing planetary fauna.
  ANIMAL = "animal",
}

/**
 * An ingredient is anything that can be used in a recipe.
 */
export interface Ingredient {
  /**
   * The ingredient name.
   */
  name: string;

  /**
   * The ingredient type.
   */
  type: IngredientType;

  /**
   * The verified ingredient value. If no value exists, this indicates that a verified value hasn't been obtained.
   */
  value?: number;

  verified: boolean;
  icon?: string;
}
