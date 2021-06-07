import {Recipe} from "./recipes";
import {Ingredient} from "./ingredients";

export * from './ingredients';
export * from './recipes';
export * from './icons';
export * from './datasource';

export function resolveIcon(icons: Map<string, string>, x: Ingredient | Recipe): string {
  let filename: string = null;
  if (icons !== null) {
    filename = icons[x.name];
  }

  if (!filename) {
    filename = x.name.toLowerCase()
      .replace(' ', '')
      .replace("'", '');
  }
  return `/assets/icons/${filename}.icon.png`;
}
