import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { PageHeader } from '../../common/components/header';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { MenuModule } from 'primeng/menu';
import { DropdownModule } from 'primeng/dropdown';
import { DebtsService } from '../debt/debts.service';

@Component({
    selector: 'debts-container',
    standalone: true,
    providers: [],
    template: ` 
    <div class="flex flex-col h-screen overflow-hidden bg-surface-50 dark:bg-surface-950">
        <div class="card !mb-0 shrink-0 max-md:rounded-none">
            <page-header [title]="'Dashboard'"> </page-header>
        </div>

        <div class="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div class="bg-white dark:bg-surface-900 shadow-xl rounded-2xl p-6 border-b-4 border-blue-500 transition-all hover:shadow-2xl">
                    <div class="flex items-center justify-between">
                        <div class="min-w-0">
                            <p class="text-sm font-semibold text-surface-500 uppercase tracking-wider truncate">Monto Total Acumulado</p>
                            <h3 class="text-xl md:text-2xl lg:text-3xl font-black mt-2 text-surface-900 dark:text-surface-0 break-words">
                                {{ stats().totalAmount | currency: 'USD' : 'symbol' : '1.2-2' }}
                            </h3>
                        </div>
                        <div class="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-xl shrink-0">
                            <i class="pi pi-wallet text-2xl text-blue-600"></i>
                        </div>
                    </div>
                    <p class="text-xs text-surface-400 mt-4 italic">Suma total de deudas registradas</p>
                </div>

                <div class="bg-white dark:bg-surface-900 shadow-xl rounded-2xl p-6 border-b-4 border-green-500 transition-all hover:shadow-2xl">
                    <div class="flex items-center justify-between">
                        <div class="min-w-0">
                            <p class="text-sm font-semibold text-surface-500 uppercase tracking-wider truncate">Total Recuperado</p>
                            <h3 class="text-xl md:text-2xl lg:text-3xl font-black mt-2 text-green-600 break-words">
                                {{ stats().totalPaid | currency: 'USD' : 'symbol' : '1.2-2' }}
                            </h3>
                        </div>
                        <div class="bg-green-100 dark:bg-green-900/30 p-4 rounded-xl shrink-0">
                            <i class="pi pi-check-circle text-2xl text-green-600"></i>
                        </div>
                    </div>
                    <div class="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2 mt-4">
                        <div class="bg-green-500 h-2 rounded-full transition-all duration-500" [style.width.%]="calculatePercentage()"></div>
                    </div>
                </div>

                <div class="bg-white dark:bg-surface-900 shadow-xl rounded-2xl p-6 border-b-4 border-orange-500 transition-all hover:shadow-2xl sm:col-span-2 lg:col-span-1">
                    <div class="flex items-center justify-between">
                        <div class="min-w-0">
                            <p class="text-sm font-semibold text-surface-500 uppercase tracking-wider truncate">Monto Pendiente</p>
                            <h3 class="text-xl md:text-2xl lg:text-3xl font-black mt-2 text-orange-600 break-words">
                                {{ stats().pendingBalance | currency: 'USD' : 'symbol' : '1.2-2' }}
                            </h3>
                        </div>
                        <div class="bg-orange-100 dark:bg-orange-900/30 p-4 rounded-xl shrink-0">
                            <i class="pi pi-clock text-2xl text-orange-600"></i>
                        </div>
                    </div>
                    <p class="text-xs text-surface-400 mt-4 italic">Dinero por cobrar actualmente</p>
                </div>

            </div>
        </div>
    </div>`,
    imports: [
        CommonModule,
        ButtonModule,
        TableModule,
        FormsModule,
        InputTextModule,
        DrawerModule,
        ReactiveFormsModule,
        TagModule,
        DataViewModule,
        DialogModule,
        ToastModule,
        PaginatorModule,
        MenuModule,
        DropdownModule,
        PageHeader,
    ],
})
export class DebtsStatsComponent implements OnInit {
    private debtsService = inject(DebtsService);

    stats = signal({
        totalPaid: 0,
        pendingBalance: 0,
        totalAmount: 0 
    });

    ngOnInit() {
        this.loadStats();
    }

    loadStats() {
        this.debtsService.getStats().subscribe({
            next: (data: any) => {
                this.stats.set({
                    totalPaid: data.totalPaid,
                    pendingBalance: data.pendingBalance,
                    totalAmount: (data.totalPaid + data.pendingBalance) 
                });
            },
            error: (err) => console.error('Error cargando stats', err),
        });
    }

    calculatePercentage(): number {
        const total = this.stats().totalAmount;
        return total > 0 ? (this.stats().totalPaid / total) * 100 : 0;
    }
}