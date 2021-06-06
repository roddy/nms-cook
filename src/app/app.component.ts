import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {BehaviorSubject, Subscription} from "rxjs";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy{
  private subscriptions: Subscription[] = [];
  private currentUrl$ = new BehaviorSubject<string>('/');

  constructor(private router: Router) {}

  ngOnInit(): void {
    const sub =  this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentUrl$.next(event.urlAfterRedirects)
      });
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.filter(sub => !sub.closed).forEach(sub => sub.unsubscribe());
  }

  isLanding(): boolean {
    console.log(this.currentUrl$.getValue());
    return this.currentUrl$.getValue() === '/';
  }

  getPageTitle(): string {
    const defaultTitle = "Tools for your No Man's Sky cooking needs.";
    switch(this.currentUrl$.getValue()) {
      case '/ingredients':
        return 'Ingredients';
      case '/recipes':
        return 'Recipes';
      case '/tools':
        return 'Tools';
    }
    return defaultTitle;
  }
}
