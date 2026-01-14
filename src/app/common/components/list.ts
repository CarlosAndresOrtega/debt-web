import { LayoutService } from '@/layout/service/layout.service';
import { CommonModule } from '@angular/common';
import { Component, ContentChild, inject, input, Input, OnInit, output, Signal, signal, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DataViewModule } from 'primeng/dataview';
import { QueryParamsService } from '@/common/services/query-params.service';
import { MenuModule } from 'primeng/menu';
import { MenuItem, SortEvent } from 'primeng/api';

@Component({
    selector: 'debts-list',
    imports: [CommonModule, ButtonModule, TableModule, InputIconModule, IconFieldModule, FormsModule, TagModule, TooltipModule, DataViewModule, MenuModule],
    standalone: true,
    template: `
        <ng-container *ngIf="!layoutService.isMobile()">
            <p-table #dt [value]="debts()" [columns]="cols" [rowHover]="true" [size]="'large'" styleClass="p-datatable-gridlines p-datatable-sm" responsiveLayout="scroll">
                <ng-template #header let-columns>
                    <tr>
                        @for (col of columns; track col.field) {
                            <th [pSortableColumn]="col.field" class="bg-surface-50 dark:bg-surface-900 py-3 text-sm uppercase">
                                {{ col.header }}
                                <p-sortIcon [field]="col.field" />
                            </th>
                        }
                        <th *ngIf="hasContextualMenu()" class="w-16 bg-surface-50 dark:bg-surface-900 sticky right-0"></th>
                    </tr>
                </ng-template>

                <ng-template #body let-rowData let-columns="columns">
                    <tr class="hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                        @for (col of columns; track col.field) {
                            <td class="py-3">
                                @if (col.customComponent === 'owner') {
                                    <div class="flex items-center gap-2">
                                        <div class="flex flex-col">
                                            <span class="font-semibold text-sm">{{ rowData.user?.firstName }} {{ rowData.user?.lastName }}</span>
                                            <span class="text-xs text-surface-500">{{ rowData.user?.email }}</span>
                                        </div>
                                    </div>
                                }

                                @if (!col.customComponent) {
                                    <span class="text-surface-700 dark:text-surface-200 font-medium">{{ rowData[col.field] }}</span>
                                }

                                @if (col.customComponent === 'currency') {
                                    <span class="font-bold text-base" [ngClass]="rowData.isPaid ? 'text-green-600' : 'text-orange-600'">
                                        {{ rowData[col.field] | currency: 'USD' }}
                                    </span>
                                }

                                @if (col.customComponent === 'status') {
                                    <div class="flex flex-col gap-1">
                                        <p-tag [severity]="rowData[col.field] ? 'success' : 'warn'" [value]="rowData[col.field] ? 'PAGADA' : 'PENDIENTE'" styleClass="!text-[9px] px-2"> </p-tag>
                                    </div>
                                }

                                @if (col.customComponent === 'date') {
                                    <span class="text-xs font-mono text-surface-600">
                                        {{ rowData[col.field] | date: 'MMM d, y, h:mm a' }}
                                    </span>
                                }
                            </td>
                        }

                        @if (hasContextualMenu()) {
                            <td class="bg-surface-0 dark:bg-surface-900 sticky right-0 z-10 text-center py-3 border-l border-surface-200 dark:border-surface-700">
                                <div class="flex justify-center">
                                    <button pButton type="button" icon="pi pi-ellipsis-v" class="p-button-rounded p-button-text p-button-plain" (click)="onMenuToggle($event, rowData)"></button>
                                </div>

                                <ng-container *ngIf="menuTemplate">
                                    <ng-container *ngTemplateOutlet="menuTemplate; context: { $implicit: rowData }"></ng-container>
                                </ng-container>
                            </td>
                        }
                    </tr>
                </ng-template>
            </p-table>
        </ng-container>

        <ng-container *ngIf="layoutService.isMobile()">
            <p-dataview #dv [value]="debts()" [rows]="debts().length">
                <ng-template #list let-items>
                    <div class="grid grid-cols-12 gap-4 grid-nogutter">
                        <div class="col-span-12" *ngFor="let item of items; let first = first">
                            <ng-container *ngTemplateOutlet="customItemTemplate; context: { $implicit: item, first: first }"></ng-container>
                        </div>
                    </div>
                </ng-template>
            </p-dataview>
        </ng-container>
    `,
})
export class debtList {
    @ContentChild('listItem') customItemTemplate!: TemplateRef<any>;
    @ContentChild('menuTemplate') menuTemplate!: TemplateRef<any>;
    isSorted: boolean = false;

    layoutService = inject(LayoutService);

    @Input() showCheckbox = false;
    @Input() cols!: any;

    debts = input<any>([]);
    pagination = input({ currentPage: 1, pageSize: 10, totalItems: 0 });
    hasContextualMenu = input(false);
    onSort = output();
    lastSort = signal<string[]>([]);
    menuClick = output<{ event: Event; item: any }>();

    openItem = output();
    /**
     * Signal output for selected items
     */
    selectedItems = output<any[]>();
    /**
     * Signal holding current selected rows
     */
    selectedRows = signal<any[]>([]);

    // TODO: add removable sorting
    onSortHandler(event: any) {
        const sort = event.multisortmeta.map((elem: any) => {
            return `${elem.field}:${elem.order === 1 ? 'ASC' : 'DESC'}`;
        });

        if (JSON.stringify(sort) !== JSON.stringify(this.lastSort())) {
            this.lastSort.set(sort);
            this.onSort.emit(sort);
        }
    }
    /**
     * Handler for selection changes in the table.
     * Emits selected rows to parent component.
     */
    onSelectionChange(selection: any[]) {
        this.selectedRows.set(selection);
        this.selectedItems.emit(selection);
    }

    /**
     * Handles the menu toggle event
     */
    onMenuToggle(event: Event, item: any) {
        event.stopPropagation();
        this.menuClick.emit({ event, item });
    }
}
