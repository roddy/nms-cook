import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

import {Ingredient} from "../models";

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private _selectedIngredients$ = new BehaviorSubject<Ingredient[]>([]);
  selectedIngredients$ = this._selectedIngredients$.asObservable();

  constructor() { }

  addIngredient(ingredient: Ingredient): void {
    const current = this._selectedIngredients$.getValue();
    current.push(ingredient);
    this._selectedIngredients$.next(current);
  }

  addIngredients(... ingredients: Ingredient[]): void {
    const current = this._selectedIngredients$.getValue();
    current.push(...ingredients);
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
