import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

import {ToolsRoutingModule} from "./tools-routing.module";
import { RecipeFinderComponent } from './recipe-finder/recipe-finder.component';
import { ToolsComponent } from './tools.component';

@NgModule({
  declarations: [RecipeFinderComponent, ToolsComponent],
  imports: [
    CommonModule,
    ToolsRoutingModule,

    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ]
})
export class ToolsModule { }
