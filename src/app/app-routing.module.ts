import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {IngredientListComponent} from "./ingredient-list/ingredient-list.component";
import {LandingComponent} from "./landing/landing.component";
import {RecipeListComponent} from "./recipe-list/recipe-list.component";

const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full'},
  { path: 'ingredients', component: IngredientListComponent },
  { path: 'recipes', component: RecipeListComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
