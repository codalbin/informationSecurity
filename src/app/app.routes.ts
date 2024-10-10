import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AllDataComponent } from './all-data/all-data.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login-page', pathMatch: 'full'},
    { path: 'login-page', component: LoginPageComponent },
    { path: 'signIn', component: SignInComponent },
    { path: 'homepage', component: HomepageComponent },
    { path: 'visualiseData', component: AllDataComponent },
];
