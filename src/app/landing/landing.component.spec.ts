import { ComponentFixture, TestBed } from '@angular/core/testing';
import {RouterTestingModule} from "@angular/router/testing";

import { LandingComponent } from './landing.component';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingComponent ],
      imports: [RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });it('should have three categories', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    const app = fixture.componentInstance;
    expect(app.categories).toEqual(['ingredients', 'recipes', 'tools']);
  });

  it('should render three categories', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    for( let category of app.categories) {
      const selector = `a#nav-${category}`;
      expect(compiled.querySelector(selector)).toBeDefined(`Unable to find nav link for ${category}`);
      expect(compiled.querySelector(selector).textContent.toLowerCase()).toContain(category.toLowerCase(), `Nav link for ${category} did not contain the expect content`);
    }
  });
});
