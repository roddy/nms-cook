import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';

import {DEFAULT_PAGE_SIZE, JsonBackedDataSource, Recipe, RecipeRecord, resolveIcon} from '../models';
import {RecipesService} from '../services';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy, AfterViewInit {

  readonly PAGE_SIZE = DEFAULT_PAGE_SIZE;

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

  resolveIcon(recipe: Recipe): string {
    const icons = this.icons.getValue();
    return `..${resolveIcon(icons, recipe)}`;
  }
}

class RecipeDataSource extends JsonBackedDataSource<Recipe> {
  constructor(private svc: RecipesService) {
    super();
  }

  protected getAllData(): Observable<Recipe[]> {
    return this.svc.getRecipes$();
  }
}
