import { TestBed } from '@angular/core/testing';
import {RouterTestingModule} from "@angular/router/testing";

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      imports: [ RouterTestingModule ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.title').textContent).toContain('NMS Cook');
  });

  it("should resolve accurately when we're on the landing page", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    (app as any).currentUrl$.next('/');
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(app.isLanding()).toBeTrue();
    expect(compiled.querySelector('nav')).toBeNull();
  });

  it("should resolve accurately when we're NOT on the landing page", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    (app as any).currentUrl$.next('/recipes');
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(app.isLanding()).toBeFalse();
    expect(compiled.querySelector('nav')).not.toBeNull();
  });
});
