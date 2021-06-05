import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {RouterTestingModule} from "@angular/router/testing";

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

  it('should have three categories', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.categories).toEqual(['ingredients', 'recipes', 'tools']);
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.title').textContent).toContain('NMS Cook');
    expect(compiled.querySelector('.subtitle').textContent).toContain("Tools for your No Man's Sky cooking needs.");
  });

  it('should render three categories', () => {
    const fixture = TestBed.createComponent(AppComponent);
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
