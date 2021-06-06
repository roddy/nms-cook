import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {TestBed} from '@angular/core/testing';

import {Ingredient, IngredientType, RecipeRecord} from "./models";
import {RecipesService} from './recipes.service';

describe('RecipesService', () => {
  let service: RecipesService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(RecipesService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get recipes', async done => {
    const records: RecipeRecord[] = [{
      name: "My Recipe",
      verified: false,
      value: 666,
      quantity: 1,
      icon: "pretty",
      ingredients: [{ name: "Bananas", quantity: 69 }]
    }];
    const ingredients: Ingredient[] = [
      { name: "Bananas", type: IngredientType.CULTIVATED, verified: true, value: 666 }
    ];

    service.getRecipes$()
      .subscribe(result => {
        expect(result).toBeDefined();
        expect(result.length).toEqual(1);
        expect(result[0].name).toEqual(records[0].name);
        done();
      })

    const reqIngredients = http.expectOne("/assets/ingredients.json");
    expect(reqIngredients.request.method).toEqual("GET");
    reqIngredients.flush(ingredients);

    const reqRecipes = http.expectOne("/assets/recipes.json");
    expect(reqRecipes.request.method).toEqual("GET");
    reqRecipes.flush(records);
  });

  it('can convert a recipe record to a recipe', () => {
    const record: RecipeRecord = {
      name: "My Recipe",
      verified: false,
      value: 666,
      quantity: 1,
      icon: "pretty",
      ingredients: [{ name: "Bananas", quantity: 69 }]
    };
    const ingredients: Ingredient[] = [
      { name: "Bananas", type: IngredientType.CULTIVATED, verified: true }
    ];

    const result = service.convertRecordToRecipe(record, ingredients);
    expect(result).not.toBeNull();
    expect(result.name).toEqual(record.name);
    expect(result.verified).toEqual(record.verified);
    expect(result.value).toEqual(record.value);
    expect(result.yield).toEqual(record.quantity);
    expect(result.icon).toEqual(record.icon);
    expect(result.ingredients.length).toEqual(1)
    expect(result.ingredients[0].ingredient).toEqual(ingredients[0]);
    expect(result.ingredients[0].quantity).toEqual(record.ingredients[0].quantity);
  });

  it('can fail to convert an invalid recipe', () => {
    const record: RecipeRecord = {
      name: "My Recipe",
      verified: false,
      value: 666,
      quantity: 1,
      icon: "pretty",
      ingredients: [{ name: "Coconuts", quantity: 69 }]
    };
    const ingredients: Ingredient[] = [
      { name: "Bananas", type: IngredientType.CULTIVATED, verified: true }
    ];

    expect(service.convertRecordToRecipe(record, ingredients)).toBeNull();
  });
});
