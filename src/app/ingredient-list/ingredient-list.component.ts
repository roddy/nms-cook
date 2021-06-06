import {DataSource} from "@angular/cdk/collections";
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {BehaviorSubject, Observable, Subject, Subscription} from "rxjs";

import {IngredientsService} from "../ingredients.service";
import {Ingredient} from "../models";

@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.scss']
})
export class IngredientListComponent implements OnInit, OnDestroy, AfterViewInit {

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

    let filename: string = null;
    if (icons !== null) {
      filename = icons[ingredient.name];
    }

    if (!filename) {
      filename = ingredient.name.toLowerCase()
        .replace(' ', '')
        .replace("'", '');
    }
    return `../assets/icons/${filename}.icon.png`;
  }
}

class IngredientDataSource extends DataSource<Ingredient> {

  private data$: Subject<Ingredient[]> = new Subject<Ingredient[]>();
  private paging: MatPaginator;
  private subscriptions: Subscription[] = []

  constructor(private svc: IngredientsService) {
    super()
  }

  set paginator(paginator: MatPaginator) {
    this.paging = paginator;
    const sub = paginator.page
      .subscribe( (pageEvent: PageEvent) => {
        this.refresh(pageEvent.pageIndex, pageEvent.pageSize);
      });
    this.subscriptions.push(sub);
  }

  connect(): Observable<Ingredient[]> {
    return this.data$.asObservable();
  }

  disconnect(): void {
    this.data$.complete();
    this.subscriptions
      .filter(sub => !sub.closed)
      .forEach(sub => sub.unsubscribe());
  }

  refresh(page: number = 0, pageSize: number = 5): void {
    this.svc.getIngredients$()
      .subscribe(all => {
        this.paging.length = all.length;
        this.paging.pageIndex = page;
        this.paging.pageSize = pageSize;

        const offset = page * pageSize;
        const data = all.slice(offset, offset+pageSize);
        this.data$.next(data);
      });
  }
}
