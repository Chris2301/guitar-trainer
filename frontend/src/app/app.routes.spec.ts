import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { HomeComponent } from './home/home';
import { LearnComponent } from './learn/learn';
import { FretboardFlashPageComponent } from './learn/fretboard-flash';

describe('App routes', () => {
  let harness: RouterTestingHarness;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
    harness = await RouterTestingHarness.create();
    router = TestBed.inject(Router);
  });

  it('should load HomeComponent when navigating to /', async () => {
    const component = await harness.navigateByUrl('/');
    expect(component).toBeInstanceOf(HomeComponent);
    expect(router.url).toBe('/');
  });

  it('should load LearnComponent when navigating to /learn', async () => {
    const component = await harness.navigateByUrl('/learn');
    expect(component).toBeInstanceOf(LearnComponent);
    expect(router.url).toBe('/learn');
  });

  it('should lazy-load FretboardFlashPageComponent at /learn/fretboard-flash', async () => {
    const component = await harness.navigateByUrl('/learn/fretboard-flash');
    expect(component).toBeInstanceOf(FretboardFlashPageComponent);
    expect(router.url).toBe('/learn/fretboard-flash');
  });

  it('should redirect unknown paths to home', async () => {
    const component = await harness.navigateByUrl('/nonexistent');
    expect(component).toBeInstanceOf(HomeComponent);
    expect(router.url).toBe('/');
  });
});
