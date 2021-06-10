import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

import {Ingredient} from "../models";

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private _selectedIngredients$ = new BehaviorSubject<IngredientWithQuantity[]>([]);
  selectedIngredients$: Observable<IngredientWithQuantity[]> = this._selectedIngredients$.asObservable();

  constructor() { }

  addIngredient(ingredient: Ingredient, quantity: number = 1): void {
    const current = this._selectedIngredients$.getValue();
    current.push({...ingredient, quantity});
    this._selectedIngredients$.next(current);
  }

  removeIngredient(ingredient: Ingredient): void {
    const current = this._selectedIngredients$.getValue();
    const idx = current.findIndex(i => i.name === ingredient.name);
    if (idx >= 0) {
      current.splice(idx, 1);
    }
    this._selectedIngredients$.next(current);
  }

  reset() {
    this._selectedIngredients$.next([]);
  }
}

export interface IngredientWithQuantity extends Ingredient {
  quantity: number;
}
