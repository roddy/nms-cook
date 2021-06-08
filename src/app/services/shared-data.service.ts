import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

import {Ingredient} from "../models";

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private selectedIngredients$ = new BehaviorSubject<Ingredient[]>([]);

  constructor() { }

  getSelectedIngredients(): Ingredient[] {
    return this.selectedIngredients$.getValue();
  }

  addIngredient(ingredient: Ingredient): void {
    const current = this.selectedIngredients$.getValue();
    current.push(ingredient);
    this.selectedIngredients$.next(current);
  }

  addIngredients(... ingredients: Ingredient[]): void {
    const current = this.selectedIngredients$.getValue();
    current.push(...ingredients);
    this.selectedIngredients$.next(current);
  }

  reset() {
    this.selectedIngredients$.next([]);
  }
}
