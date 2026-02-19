import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { LandingPage } from './app/landing-page/landing-page';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

bootstrapApplication(LandingPage, {
  providers: [
    provideRouter(routes)
  ]
});
