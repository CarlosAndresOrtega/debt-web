import { Routes } from '@angular/router';
import { DebtsContainer } from './debt/container';
import { DebtsStatsComponent } from './dashboard/container';

export default [
    { path: '', redirectTo: 'debts', pathMatch: 'full' },
    { path: 'debts', data: { breadcrumb: 'Debts' }, component: DebtsContainer },
    { path: 'dashboard', data: { breadcrumb: 'Dashboard' }, component: DebtsStatsComponent },

] as Routes;
