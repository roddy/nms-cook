import {HttpClientModule} from "@angular/common/http";
import {NgModule} from '@angular/core';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {IngredientListComponent} from './ingredient-list/ingredient-list.component';
import {RecipeListComponent} from './recipe-list/recipe-list.component';

@NgModule({
  declarations: [
    AppComponent,
    IngredientListComponent,
    RecipeListComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,

    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
