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

  // A Substance is a harvested substance, agricultural or otherwise.
  SUBSTANCE = "substance",

  // An element is a something that's mined or refined.
  ELEMENT = "element",

  // A raw ingredient is a primary material for edible products that doesn't fit in the other categories.
  RAW_INGREDIENT = "raw ingredient",

  // A refined ingredient is a previously refined food product that can be used in further recipes.
  REFINED_INGREDIENT = "refined",
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
}
