import {DataSource} from "@angular/cdk/collections";
import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable, Subject, Subscription} from "rxjs";

import {Ingredient, Recipe, resolveIcon} from "../../models";
import {IngredientWithQuantity, IngredientsService, RecipesService, SharedDataService} from "../../services";
import {RecipeFinder} from "./finder";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-recipe-finder',
  templateUrl: './recipe-finder.component.html',
  styleUrls: ['./recipe-finder.component.scss']
})
export class RecipeFinderComponent implements OnInit, OnDestroy, AfterViewInit {

  displayedColumns = [ 'name', 'qty', 'action'];

  result: Recipe[] = [];

  selectedIngredients: SelectedIngredientDataSource;

  private icons = new BehaviorSubject<Map<string, string>>(null);
  private finder: RecipeFinder;
  private subscriptions: Subscription[] = [];

  constructor(private sds: SharedDataService,
              private ingredientSvc: IngredientsService,
              private recipeSvc: RecipesService) { }

  ngOnInit(): void {
    this.selectedIngredients = new SelectedIngredientDataSource(this.sds);

    const finderInit = forkJoin([
      this.ingredientSvc.getIngredients$(),
      this.recipeSvc.getRecipes$()
    ])
      .pipe(
        switchMap(([ingredients, recipes]) => {
          // TODO remove: debugging only
          this.sds.reset();
          this.sds.addIngredient(ingredients.find(i => i.name === "Impulse Beans"));
          this.sds.addIngredient(ingredients.find(i => i.name === "Fireberry"));
          this.sds.addIngredient(ingredients.find(i => i.name === "Cactus Flesh"));
          // end todo

          this.finder = new RecipeFinder(ingredients, recipes)
          return this.sds.selectedIngredients$
        })
      ).subscribe((selected: IngredientWithQuantity[]) => this.result = this.finder.findRecipes(selected));

    this.subscriptions.push(finderInit);

    this.subscriptions.push(
      this.ingredientSvc.getIconMap$()
        .subscribe(icons => this.icons.next(icons))
    );
  }

  ngOnDestroy(): void {
    this.selectedIngredients.disconnect();
    this.subscriptions
      .filter(sub => !sub.closed)
      .forEach(sub => sub.unsubscribe());;
  }

  ngAfterViewInit(): void {

  }


  resolveIngredientIcon(ingredient: Ingredient): string {
    const icons = this.icons.getValue();
    return `../..${resolveIcon(icons, ingredient)}`;
  }

  removeIngredient(ingredient: Ingredient): void {
    this.sds.removeIngredient(ingredient);
  }
}

class SelectedIngredientDataSource extends DataSource<IngredientWithQuantity> {

  private data: Subject<IngredientWithQuantity[]> = new Subject<IngredientWithQuantity[]>();

  constructor(private sds: SharedDataService) {
    super();

    this.sds.selectedIngredients$
      .subscribe(data => this.data.next(data));

  }

  connect(): Observable<IngredientWithQuantity[]> {
    return this.data.asObservable();
  }

  disconnect(): void {
    this.data.complete();
  }

}
