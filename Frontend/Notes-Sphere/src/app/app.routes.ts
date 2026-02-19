import { Routes } from '@angular/router';
import { LandingPage } from './landing-page/landing-page';
import { SignupComponent } from './signup/signup';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';


export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '' } // optional: catch-all route
];
