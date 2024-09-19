import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomepageComponent } from './homepage/homepage.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login-page', pathMatch: 'full'},
    { path: 'login-page', component: LoginPageComponent },
    { path: 'homepage', component: HomepageComponent },
];
