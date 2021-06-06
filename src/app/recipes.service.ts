import {HttpClient} from "@angular/common/http";
import { Injectable } from '@angular/core';
import {Observable,zip} from "rxjs";
import {map} from "rxjs/operators";

import {IngredientsService} from "./ingredients.service";
import {GenericIconStorage, Ingredient, Recipe, RecipeRecord} from "./models";

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(private ingredientsSvc: IngredientsService,
              private httpClient: HttpClient) {
  }

  getRecipes$(): Observable<Recipe[]> {
    const ingredients$ = this.ingredientsSvc.getIngredients$();
    const recipes$ = this.httpClient.get<RecipeRecord[]>('/assets/recipes.json');

    return zip(recipes$, ingredients$)
      .pipe(
        map(([recipeRecords, ingredients]) =>
          recipeRecords
            .map(record => this.convertRecordToRecipe(record, ingredients))
            .filter(recipe => !!recipe)
            .sort(sortRecipe)
        ),
      );
  }

  getIconMap$(): Observable<Map<string, string>> {
    return this.httpClient.get<GenericIconStorage>('/assets/icons.json')
      .pipe(
        map(generic => generic.recipes)
      );
  }

  // Debug method
  print(): Observable<RecipeRecord[]> {
    return this.httpClient.get<RecipeRecord[]>('/assets/recipes.json')
      .pipe(
        map(records => {
          const clean: RecipeRecord[] = [];
          records.forEach((r, idx) => {
            const existing = clean.find(existing => isDuplicateRecord(existing, r));
            if (!existing) {
              clean.push(r);
            }
          });
          return clean.sort(sortRecord);
        })
      );
  }

  convertRecordToRecipe(record: RecipeRecord, allIngredients: Ingredient[]): Recipe {
    let invalidRecord = false;
    const ingredients: { ingredient: Ingredient, quantity: number }[] = [];
    record.ingredients.forEach(i => {
      const found = allIngredients.find(ingredient => ingredient.name === i.name);
      if (!found) {
        invalidRecord = true;
        return;
      }

      // if the ingredients list already includes this ingredient, just increment the quantity
      const existing = ingredients.findIndex(j => j.ingredient.name === found.name);
      if (existing > -1) {
        ingredients[existing].quantity = ingredients[existing].quantity + 1;
      } else {
        ingredients.push({ingredient: found, quantity: i.quantity});
      }
    });

    if (invalidRecord) {
      return null;
    }

    return {
      name: record.name,
      yield: record.quantity,
      verified: record.verified,
      ingredients: ingredients.sort((a, b) => compareStrings(a.ingredient.name, b.ingredient.name)),
      value: record.value
    };
  }
}

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : 1
}


function sortRecipe(a: Recipe, b: Recipe): number {
  if (a.name == b.name) {
    // find the first ingredient, in order, which doesn't match; if the lists are different lengths, the shorter wins
    let idx = 0;
    for (; idx < a.ingredients.length && idx < b.ingredients.length; idx++) {
      if (a.ingredients[idx].ingredient.name !== b.ingredients[idx].ingredient.name) {
        break;
      }
    }
    if (idx < a.ingredients.length && idx < b.ingredients.length) {
      return compareStrings(a.ingredients[idx].ingredient.name, b.ingredients[idx].ingredient.name);
    } else if (a.ingredients.length < b.ingredients.length) {
      return -1;
    }
    return 1;
  }
  return compareStrings(a.name.replace(/'/g, ""), b.name.replace(/'/g, ""));
}

function isDuplicateRecord(a: RecipeRecord, b: RecipeRecord): boolean {
  if (a.name !== b.name || a.ingredients.length != b.ingredients.length) {
    return false;
  }

  const ingredientsA = a.ingredients.map(i => i.name).sort();
  const ingredientsB = b.ingredients.map(i => i.name).sort();

  for(let idx = 0; idx < ingredientsA.length && idx < ingredientsB.length; idx++) {
    if (ingredientsA[idx] !== ingredientsB[idx]) {
      return false;
    }
  }
  return true;
}

function sortRecord(a: RecipeRecord, b: RecipeRecord): number {
  if (a.name == b.name) {
    // find the first ingredient, in order, which doesn't match; if the lists are different lengths, the shorter wins
    let idx = 0;
    for (; idx < a.ingredients.length && idx < b.ingredients.length; idx++) {
      if (a.ingredients[idx].name !== b.ingredients[idx].name) {
        break;
      }
    }
    if (idx < a.ingredients.length && idx < b.ingredients.length) {
      return compareStrings(a.ingredients[idx].name, b.ingredients[idx].name);
    } else if (a.ingredients.length < b.ingredients.length) {
      return -1;
    }
    return 1;
  }
  return compareStrings(a.name.replace(/'/g, ""), b.name.replace(/'/g, ""));
}
