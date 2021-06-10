import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

import {ToolsRoutingModule} from "./tools-routing.module";
import { RecipeFinderComponent } from './recipe-finder/recipe-finder.component';
import { ToolsComponent } from './tools.component';
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [RecipeFinderComponent, ToolsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ToolsRoutingModule,

    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
  ]
})
export class ToolsModule { }
