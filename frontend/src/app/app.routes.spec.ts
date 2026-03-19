import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { HomeComponent } from './home/home';
import { LearnComponent } from './learn/learn';

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

  it('should redirect unknown paths to home', async () => {
    const component = await harness.navigateByUrl('/nonexistent');
    expect(component).toBeInstanceOf(HomeComponent);
    expect(router.url).toBe('/');
  });
});
