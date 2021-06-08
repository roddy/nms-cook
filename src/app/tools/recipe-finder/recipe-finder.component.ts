import {Component, OnInit} from '@angular/core';
import {IngredientsService, RecipesService, SharedDataService} from "../../services";
import {Ingredient, Recipe} from "../../models";
import {RecipeFinder} from "./finder";
import {forkJoin, zip} from "rxjs";

@Component({
  selector: 'app-recipe-finder',
  templateUrl: './recipe-finder.component.html',
  styleUrls: ['./recipe-finder.component.scss']
})
export class RecipeFinderComponent implements OnInit {

  private finder: RecipeFinder;

  ingredients: IngredientWithQuantity[];

  result: Recipe[] = [];


  constructor(private sds: SharedDataService,
              private ingredientSvc: IngredientsService,
              private recipeSvc: RecipesService) { }

  ngOnInit(): void {
    forkJoin([
      this.ingredientSvc.getIngredients$(),
      this.recipeSvc.getRecipes$()
    ]).subscribe(
      ([ingredients, recipes] ) => this.finder = new RecipeFinder(ingredients, recipes)
    );

    const existingIngredients: IngredientWithQuantity[] = [];
    this.sds.getSelectedIngredients()
      .forEach(i => existingIngredients.push({ ...i, quantity: 1, }));
    this.ingredients = existingIngredients;
  }

  find(): void {
    this.ingredientSvc.getIngredients$()
      .subscribe(allIngredients => {
        const ingredients: Ingredient[] = [];
        ingredients.push(allIngredients.find(i => i.name === "Impulse Beans"));
        ingredients.push(allIngredients.find(i => i.name === "Fireberry"));
        ingredients.push(allIngredients.find(i => i.name === "Cactus Flesh"));

        this.result = this.finder.findRecipes(ingredients);
      });

  }
}

interface IngredientWithQuantity extends Ingredient {
  quantity: number;
}
