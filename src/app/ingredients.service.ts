import {HttpClient} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

import {Ingredient} from "./models";

/**
 * The Ingredients Service fetches all of the ingredients from the application assets and makes them available to other
 * components.
 */
@Injectable({
  providedIn: 'root'
})
export class IngredientsService {

  constructor(private http: HttpClient) { }

  getIngredients$(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>('/assets/ingredients.json')
      .pipe(
        map( (ingredients: Ingredient[]) => ingredients.filter(ingredient => ingredient.value > 0))
      );
  }
}
