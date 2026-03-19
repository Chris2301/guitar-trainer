import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';
import { RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { TUI_DARK_MODE } from '@taiga-ui/core';
import { appConfig } from './app.config';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        ...appConfig.providers,
        { provide: TUI_DARK_MODE, useValue: signal(false) },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should contain a router-outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutlet).toBeTruthy();
  });
});
