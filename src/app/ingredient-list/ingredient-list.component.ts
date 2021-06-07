import {DataSource} from "@angular/cdk/collections";
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {BehaviorSubject, Observable, Subject, Subscription} from "rxjs";

import {IngredientsService} from "../services";
import {DEFAULT_PAGE_SIZE, Ingredient, JsonBackedDataSource, resolveIcon} from "../models";

@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.scss']
})
export class IngredientListComponent implements OnInit, OnDestroy, AfterViewInit {

  readonly PAGE_SIZE = DEFAULT_PAGE_SIZE;

  displayedColumns = ['icon', 'name', 'type', 'value'];
  dataSource: IngredientDataSource;

  private icons = new BehaviorSubject<Map<string, string>>(null);
  private subscriptions: Subscription[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private ingredientsSvc: IngredientsService) { }

  ngOnInit(): void {
    this.dataSource = new IngredientDataSource(this.ingredientsSvc);
    const sub = this.ingredientsSvc.getIconMap$()
      .subscribe(icons => this.icons.next(icons));
    this.subscriptions.push(sub);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.refresh();
  }

  ngOnDestroy(): void {
    this.dataSource.disconnect();
    this.subscriptions
      .filter(sub => !sub.closed)
      .forEach(sub => sub.unsubscribe());
  }

  resolveIcon(ingredient: Ingredient): string {
    const icons = this.icons.getValue();
    return `..${resolveIcon(icons, ingredient)}`;
  }
}

class IngredientDataSource extends JsonBackedDataSource<Ingredient> {

  constructor(private svc: IngredientsService) {
    super();
  }

  protected getAllData(): Observable<Ingredient[]> {
    return this.svc.getIngredients$();
  }
}
