import {Ingredient, Recipe} from "../../models";

export class RecipeFinder {

  constructor(public allIngredients: Ingredient[],
              public allRecipes: Recipe[]) {}

  findRecipes(ingredients: Ingredient[]): Recipe[] {
    // First, find all derived ingredient --> eg. if you can process the ingredients you have into other stuff.
    // This is effectively the list of all the things you can make with what you've got now, across a whole bunch of steps.
    const derivedIngredients = this.findDerivedIngredientsForIngredients(ingredients);

    // Now we find the full list of recipes that we can make from those derived ingredients. This will include the recipes
    // needed to make those derived ingredients themselves.
    return this.findRecipesForIngredients(derivedIngredients);
  }

  private findRecipesForIngredients(ingredients: Ingredient[]): Recipe[] {
    const resolved: Recipe[] = this.allRecipes
      .filter(r => this.areAllRecipeIngredientsInList(r, ingredients));
    return resolved;
  }

  private findDerivedIngredientsForIngredients(ingredients: Ingredient[]): Ingredient[] {
    const resolved: Ingredient[] = [... ingredients];

    const ingredientRecipes = this.allRecipes.filter(r => this.isIngredient(r));

    let previousCount: number = -1;
    let currentCount: number = resolved.length;

    while (currentCount > previousCount) {
      // Iterate through all ingredient recipes and pull out the ones all of whose ingredients are in our resolved list.
      ingredientRecipes
        .filter(r => this.areAllRecipeIngredientsInList(r,  resolved))
        .forEach(matchedRecipe => {
          if (resolved.findIndex((res => res.name === matchedRecipe.name)) < 0 ) {
            resolved.push(this.getIngredientForRecipe(matchedRecipe));
          }
        });

      previousCount = currentCount;
      currentCount = resolved.length;
    }
    return resolved;
  }

  /**
   * Resolves true if this recipe creates an item that is also an ingredient.
   *
   * @param recipe the Recipe to check
   * @returns true if the recipe creates an ingredient; false otherwise
   * @private
   */
  private isIngredient(recipe: Recipe): boolean {
    return this.getIngredientForRecipe(recipe) !== null;
  }

  private getIngredientForRecipe(recipe: Recipe): Ingredient {
    const idx = this.allIngredients.findIndex(i => i.name === recipe.name);
    return idx < 0 ? null : this.allIngredients[idx];
  }

  private areAllRecipeIngredientsInList(recipe: Recipe, list: Ingredient[]): boolean {
    const recipeIngredients = recipe.ingredients;

    // if our list contains fewer ingredients than the recipe calls for, it stands to reason that the answer to the
    // question is "no"
    if (list.length < recipeIngredients.length) {
      return false;
    }

    for( let idx = 0; idx < recipeIngredients.length; idx++ ) {
      if (list.findIndex(i => i.name === recipeIngredients[idx].ingredient.name) < 0) {
        return false;
      }
    }
    return true;
  }
}

