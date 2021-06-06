import {DataSource} from '@angular/cdk/collections';
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';

import {Ingredient, Recipe, RecipeRecord} from '../models';
import {RecipesService} from '../services';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy, AfterViewInit {

  displayedColumns = ['icon', 'name', 'ingredients', 'value' ];
  dataSource: RecipeDataSource;

  all: RecipeRecord[] = [];

  get allNames(): string[] {
    return this.all.map(r => r.name).filter((value, index, self)  => self.indexOf(value) === index);
  }

  private icons = new BehaviorSubject<Map<string, string>>(null);
  private subscriptions: Subscription[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public recipeSvc: RecipesService) { }

  ngOnInit(): void {
    this.dataSource = new RecipeDataSource(this.recipeSvc);
    this.recipeSvc.print().subscribe(all => this.all = all);
    const sub = this.recipeSvc.getIconMap$()
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

class RecipeDataSource extends DataSource<Recipe> {

  private data$: Subject<Recipe[]> = new Subject<Recipe[]>();
  private paging: MatPaginator;
  private subscription: Subscription[] = [];

  constructor(private svc: RecipesService) {
    super();
  }

  set paginator(paginator: MatPaginator) {
    this.paging = paginator;
    const sub = paginator.page
      .subscribe(pageEvent => {
        this.refresh(pageEvent.pageIndex, pageEvent.pageSize);
      });
    this.subscription.push(sub);
  }

  connect(): Observable<Recipe[]> {
    return this.data$.asObservable();
  }

  disconnect(): void {
    this.data$.complete();
    this.subscription
      .filter(sub => !sub.closed)
      .forEach(sub => sub.unsubscribe());
  }

  refresh(page: number = 0, pageSize: number = 5): void {
    this.svc.getRecipes$()
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
