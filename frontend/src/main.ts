import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent, appConfig).catch((err) => {
  if (typeof ngDevMode !== 'undefined' && ngDevMode) {
    console.error(err);
  }
});
