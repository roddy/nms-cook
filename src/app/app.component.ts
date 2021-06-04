import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  categories = [ "ingredients", "recipes", "tools" ];
}

interface Category {
  name: string;
  target: string[];
  image?: string;
}
