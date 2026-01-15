import { Routes } from '@angular/router';
import { DebtsContainer } from './debt/container';

export default [
    { path: '', redirectTo: 'debts', pathMatch: 'full' },
    { path: 'debts', data: { breadcrumb: 'Debts' }, component: DebtsContainer },
] as Routes;
