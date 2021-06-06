import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {TestBed} from '@angular/core/testing';

import {Ingredient, IngredientType} from "../models";
import {IngredientsService} from './ingredients.service';

describe('IngredientsService', () => {
  let service: IngredientsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(IngredientsService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return ingredients with values > 0', async done => {
    const all: Ingredient[] = [
      { name: "Bananas", type: IngredientType.CULTIVATED, verified: true, value: 1200},
      { name: "Escargot", type: IngredientType.ANIMAL, verified: false, value: -1}
    ];

    service.getIngredients$()
      .subscribe(results => {
        expect(results.length).toEqual(1);
        expect(results[0]).toBe(all[0]);
        expect(results[0]).not.toBe(all[1]);
        done();
      });

    const req = http.expectOne("/assets/ingredients.json");
    expect(req.request.method).toEqual("GET");
    req.flush(all);
  });

});
