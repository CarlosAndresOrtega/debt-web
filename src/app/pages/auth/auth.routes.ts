import { Routes } from '@angular/router';
import { AccessDenied } from './accessdenied';
import { Error } from './error';
import { Login } from './login';
import { Register } from './register';

export default [
    { path: 'error', component: Error },
    { path: 'access', component: AccessDenied },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: '**', redirectTo: '/notfound' },
] as Routes;
