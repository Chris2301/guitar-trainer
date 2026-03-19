import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';
import { appConfig } from './app.config';

describe('Taiga UI Configuration', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [...appConfig.providers],
    }).compileComponents();
  });

  it('should wrap the application in tui-root', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const tuiRoot = fixture.nativeElement.querySelector('tui-root');
    expect(tuiRoot).toBeTruthy();
  });

  it('should render router-outlet inside tui-root', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const tuiRoot = fixture.nativeElement.querySelector('tui-root');
    const routerOutlet = tuiRoot?.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });
});
