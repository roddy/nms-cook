import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {RecipeFinderComponent} from './recipe-finder/recipe-finder.component';
import {ToolsComponent} from './tools.component';

const ROUTES: Routes = [
  { path: '', pathMatch: 'full', component: ToolsComponent },
  { path: 'recipe-finder', component: RecipeFinderComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class ToolsRoutingModule { }
