import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';
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

  it('should render tui-root with light theme attribute by default', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const tuiRoot = fixture.nativeElement.querySelector('tui-root');
    expect(tuiRoot).toBeTruthy();
    expect(tuiRoot.getAttribute('tuitheme')).toBe('light');
  });
});
