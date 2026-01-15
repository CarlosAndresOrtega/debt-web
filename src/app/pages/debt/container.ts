import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { PageHeader } from '../../common/components/header';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { LayoutService } from '@/layout/service/layout.service';
import { ListboxModule } from 'primeng/listbox';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { TabsModule } from 'primeng/tabs';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TimelineModule } from 'primeng/timeline';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { QueryParamsService } from '@/common/services/query-params.service';
import { FilterGroup } from '../../common/components/filter-group';
import { MenuModule } from 'primeng/menu';
import { Menu } from 'primeng/menu';
import { Column } from '@/common/utils/column.interface';
import { ConfirmationModalService } from '@/common/services/confirmation-modal.service';
import { DrawerService } from '@/common/services/drawer.service';
import { DrawerFactory } from '@/common/services/drawer-factory.service';
import { DebtsService } from './debts.service';
import { Book } from './interface/book.model';
import { DrawerDebt } from './drawer/drawer-form';
import { debtList } from '@/common/components/list';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'debts-container',
    standalone: true,
    providers: [MessageService],
    template: `<div class="grid grid-cols-12 gap-4 h-screen overflow-hidden">
        <div class="col-span-12 h-full">
            <div class="card max-md:rounded-b-none max-md:mb-0">
                <page-header [title]="'Deudas'">
                    <ng-template #actionsTemplate>
                        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                            <p-button label="Exportar CSV" icon="pi pi-file-excel" rounded="true" severity="secondary" (onClick)="downloadCsv()" />
                            <p-button label="Nueva Deuda" icon="pi pi-plus" rounded="true" styleClass="p-button-primary !bg-orange-500 !border-orange-500 !text-white w-full sm:w-auto" (onClick)="openCreateDebt()"> </p-button>
                        </div>
                    </ng-template>

                    <ng-template #filtersTemplate>
                        <filter-group style="width: 100%" [filters]="filters()" [queryParams]="qpService.queryParams()" (selectedFilters)="onFilterSelect($event)" (clearFilters)="onClearFilters()" [useDateFilters]="true"></filter-group>
                    </ng-template>
                </page-header>
            </div>

            <div class="card h-[calc(100vh-12rem)] flex flex-col">
                <p-toast />
                <div class="flex-1 overflow-auto">
                    <debts-list [debts]="debts()" [cols]="cols" [hasContextualMenu]="true" (onSort)="onSort($event)" (menuClick)="handleMenuClick($event)">
                        <ng-template #listItem let-item let-first="first">
                            <div class="flex flex-col p-6 gap-4" [ngClass]="{ 'border-t border-surface-200 dark:border-surface-700': !first }">
                                <div class="flex justify-between items-center flex-1 gap-6">
                                    <div class="flex flex-col justify-between items-start gap-1">
                                        <span class="font-medium text-secondary text-lg">{{ item.description }}</span>
                                        <span class="text-sm text-surface-500 italic">{{ item.createdAt | date: 'short' }}</span>
                                    </div>

                                    <div class="flex items-center gap-6">
                                        <div class="flex flex-col items-end gap-1">
                                            <span class="text-lg font-bold" [ngClass]="item.isPaid ? 'text-green-500' : 'text-orange-500'">
                                                {{ item.amount | currency }}
                                            </span>
                                            <p-tag [severity]="item.isPaid ? 'success' : 'warn'" [value]="item.isPaid ? 'Pagada' : 'Pendiente'"></p-tag>
                                        </div>

                                        <button type="button" (click)="openDebt(item)">
                                            <i class="pi pi-chevron-right text-xl"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </ng-template>

                        <ng-template #menuTemplate>
                            <p-menu #menu [popup]="true" appendTo="body"></p-menu>
                        </ng-template>
                    </debts-list>
                </div>

                <div class="sticky bottom-0 bg-white dark:bg-surface-900">
                    <p-paginator (onPageChange)="onPageChange($event)" [first]="first" [rows]="pagination().pageSize" [totalRecords]="pagination().totalItems" [rowsPerPageOptions]="[10, 20, 30]" />
                </div>

                <drawer-debt [key]="'debt-drawer'">
                    <!-- <ng-template #actionsTemplate>
                        <div class="w-full flex justify-end gap-5">
                            <p-button label="Eliminar" [rounded]="true" (click)="confirmDeleteDebt(debtselected())" severity="danger" />
                        </div>
                    </ng-template> -->
                </drawer-debt>
            </div>
        </div>
    </div>`,
    imports: [
        debtList,
        CommonModule,
        ButtonModule,
        TableModule,
        InputIconModule,
        IconFieldModule,
        FormsModule,
        ToolbarModule,
        InputTextModule,
        DrawerModule,
        ReactiveFormsModule,
        ListboxModule,
        TagModule,
        DataViewModule,
        DialogModule,
        TabsModule,
        CheckboxModule,
        FileUploadModule,
        ToastModule,
        InputGroupModule,
        InputGroupAddonModule,
        TimelineModule,
        DrawerDebt,
        PaginatorModule,
        FilterGroup,
        PageHeader,
        MenuModule,
        DropdownModule,
    ],
})
export class DebtsContainer implements OnInit {
    searchInputStyles = {
        root: {
            borderRadius: '24px',
        },
    };

    @ViewChild('dt') dt!: Table;
    @ViewChild('menu') menu!: Menu;

    layoutService = inject(LayoutService);
    debtsService = inject(DebtsService);
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);
    qpService = inject(QueryParamsService);
    messageService = inject(MessageService);
    confirmationModalService = inject(ConfirmationModalService);
    drawerService = inject(DrawerService);
    drawerFactory = inject(DrawerFactory);
    usersService = inject(UsersService);
    private authService = inject(AuthService);

    debts = signal<Book[]>([]);
    debtselected = signal<Book>({} as Book);

    pagination = signal({ currentPage: 1, pageSize: 10, totalItems: 0 });
    filters = signal<any[]>([]);

    first: number = 0;

    cols = [
        { field: 'description', header: 'Descripción' },
        { field: 'amount', header: 'Monto', customComponent: 'currency' },
        { field: 'user', header: 'Dueño', customComponent: 'owner' },
        { field: 'paidByUser', header: 'Pagado por', customComponent: 'payer' },
        { field: 'isPaid', header: 'Estado', customComponent: 'status' },
        { field: 'createdAt', header: 'Fecha Registro', customComponent: 'date' },
    ];

    bookToDelete = signal<any>(undefined);
    deletebookDialog = false;
    deleteSelecteddebtsDialog = false;

    pageOptions = Array.from({ length: 50 }, (_, i) => ({
        label: `Página ${i + 1}`,
        value: i + 1,
    }));

    selectedPage = 1;
    users = signal<any[]>([]);

    constructor() {
        effect(() => {
            const isVisible = this.drawerService.getState('debt-drawer').visible();
            if (!isVisible) {
                this.getData();
            }
        });
    }

    ngOnInit() {
        this.qpService.clearParams();
        this.loadInitialData();
    }

    async loadInitialData() {
        this.usersService.getAll().subscribe({
            next: (data) => {
                this.users.set(data);
                this.getFilters();
            },
        });
        setTimeout(() => {
            this.getData();
        }, 0);
    }
    async getData() {
        if (this.qpService.isEmpty()) {
            await this.qpService.updateParams({ page: 1, size: 10 });
            this.first = 1;
        }

        this.debtsService.getAll(this.qpService.queryParams()).subscribe({
            next: (data) => {
                this.debts.set(data.items);
                this.pagination.set(data.pagination);

                if (data.items.length > 0) {
                    const maxAmount = Math.max(...data.items.map((item: any) => item.amount));
                    this.updateSliderMax(maxAmount);
                }
            },
            error: (error) => console.error(error),
        });
    }
    updateSliderMax(newMax: number) {
        this.filters.update((currentFilters) => currentFilters.map((f) => (f.queryParam === 'amount' ? { ...f, max: Math.ceil(newMax) } : f)));
    }

    getFilters() {
        const userOptions = this.users().map((u) => ({
            id: u.userId,
            name: `${u.firstName} ${u.lastName}`,
        }));

        const staticFilters = [
            {
                name: 'Estado',
                queryParam: 'isPaid',
                values: [
                    { id: 'true', name: 'Pagadas' },
                    { id: 'false', name: 'Pendientes' },
                ],
            },
            {
                name: 'Monto',
                queryParam: 'amount',
                type: 'slider',
                min: 0,
                max: 5000,
            },
            {
                name: 'Dueño',
                queryParam: 'userId',
                values: userOptions,
            },
            {
                name: 'Pagado por',
                queryParam: 'paidByUserId',
                values: userOptions,
            },
        ];

        const preparedFilters = this.qpService.prepareFilters(staticFilters);
        this.filters.set(preparedFilters);
    }

    private searchTimeout: any;

    onSearch(event: any) {
        const value = event.target.value;
        if (this.searchTimeout) clearTimeout(this.searchTimeout);

        this.searchTimeout = setTimeout(async () => {
            await this.qpService.updateParams({ description: value, page: 1 });
            this.getData();
        }, 400);
    }

    openBook(item: any) {
        this.debtselected.set(item);
    }

    confirmDeleteDebt(item: any) {
        this.bookToDelete.set(item);
        this.confirmationModalService
            .confirm({
                header: 'Confirmar Eliminación',
                message: `¿Estás seguro de eliminar la deuda "${item.description}"?`,
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Si, eliminar',
                rejectLabel: 'No',
                severity: 'error',
            })
            .then((confirmed) => {
                if (confirmed) {
                    this.debtsService.delete(item.id).subscribe({
                        next: () => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Eliminada',
                                detail: 'La deuda ha sido removida',
                            });
                            this.getData();
                        },
                    });
                }
            });
    }

    deleteSingleBook() {
        if (!this.bookToDelete()) return;
    }

    async onPageChange(event: PaginatorState) {
        this.first = event.first!;
        await this.qpService.updateParams({ page: event.page! + 1, size: event.rows });
        this.getData();
    }

    async onSort(sort: any) {
        await this.qpService.updateParams({ sort });
        this.getData();
    }

    async onFilterSelect(event: any) {
        const { queryParam, selectedItem } = event;

        if (!selectedItem) {
            if (queryParam === 'amount') {
                await this.qpService.removeParams(['amountMin', 'amountMax']);
            } else if (queryParam === 'dateRange') {
                await this.qpService.removeParams(['dateFrom', 'dateTo']);
            } else {
                await this.qpService.removeParams([queryParam]);
            }
        } else {
            if (queryParam === 'amount' && Array.isArray(selectedItem)) {
                await this.qpService.updateParams({
                    amountMin: selectedItem[0],
                    amountMax: selectedItem[1],
                });
            } else if (queryParam === 'dateRange') {
                await this.qpService.updateParams({
                    dateFrom: selectedItem.dateFrom,
                    dateTo: selectedItem.dateTo,
                });
            } else {
                await this.qpService.updateParams({
                    [queryParam]: selectedItem.id || selectedItem,
                });
            }
        }

        await this.qpService.updateParams({ page: 1 });
        this.getData();
    }

    async onClearFilters() {
        const rangeParams = this.filters()
            .filter((f) => f.type === 'slider' || !f.values)
            .flatMap((f) => [`${f.queryParam}Min`, `${f.queryParam}Max`]);

        const selectParams = this.filters()
            .filter((f) => f.values)
            .map((f) => f.queryParam);

        const manualParams = ['query', 'dateFrom', 'dateTo', 'userId', 'paidByUserId'];

        const allFilterParams = [...rangeParams, ...selectParams, ...manualParams];

        await this.qpService.removeParams(allFilterParams);
        await this.qpService.updateParams({ page: 1 });

        this.getData();
        this.getFilters();
    }

    openCreateDebt() {
        this.debtselected.set({} as any);
        this.drawerFactory.openDebtCreate();
    }

    openDebt(item: any) {
        this.debtselected.set(item);
        this.drawerFactory.openDebtView(item);
    }
    openEditDebt(item: any) {
        this.debtselected.set(item);
        this.drawerService.open<any>({
            key: 'debt-drawer',
            title: `Editar: ${item.description}`,
            data: item,
            metadata: {
                Id: item.id,
                mode: 'edit',
            },
        });
    }

    markAsPaid(item: any) {
        if (item.isPaid) return;
        const currentUserId = this.authService.getCurrentUserId();

        this.debtsService.markAsPaid(item.id, currentUserId).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Pagada',
                    detail: 'La deuda se marcó como pagada',
                });
                this.getData();
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo procesar el pago',
                });
            },
        });
    }

    handleMenuClick(event: { event: Event; item: any }) {
        const isPaid = event.item.isPaid;
        let allItems = [];
        if (!isPaid) {
            allItems = [
                {
                    label: 'Editar',
                    icon: 'pi pi-pencil',
                    visible: !isPaid,
                    command: () => this.openEditDebt(event.item),
                },
                {
                    label: 'Marcar como Pagada',
                    icon: 'pi pi-check',
                    visible: !isPaid,
                    styleClass: 'text-green-500',
                    command: () => this.markAsPaid(event.item),
                },
                {
                    label: 'Eliminar',
                    icon: 'pi pi-trash',
                    visible: !isPaid,
                    styleClass: 'text-red-500',
                    command: () => this.confirmDeleteDebt(event.item),
                },
            ];
        } else {
            allItems = [
                {
                    label: 'Ver Detalle',
                    icon: 'pi pi-eye',
                    command: () => this.openDebt(event.item),
                },
            ];
        }

        this.menu.model = allItems;
        this.menu.toggle(event.event);
    }
    downloadCsv() {
        this.debtsService.exportCsv(this.qpService.queryParams()).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `reporte_deudas_${Date.now()}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: () => this.messageService.add({ severity: 'error', detail: 'Error al exportar' }),
        });
    }
}
