import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CalendarModule } from 'primeng/calendar';
import { DatePickerModule } from 'primeng/datepicker';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'filter-group',
    standalone: true,
    imports: [SelectModule, CommonModule, FormsModule, Button, DatePickerModule, SliderModule, InputTextModule, IconFieldModule, InputIconModule],
    template: `
        <div class="flex flex-wrap gap-4 w-full justify-between items-center">
            <div class="flex gap-4 flex-wrap items-center flex-1">
                <p-iconfield iconPosition="left" class="w-full md:w-72">
                    <p-inputicon styleClass="pi pi-search" />
                    <input 
                        type="text" 
                        pInputText 
                        [(ngModel)]="searchQuery" 
                        (ngModelChange)="onSearchChange($event)" 
                        placeholder="Buscar por descripción..." 
                        class="w-full !rounded-full" 
                    />
                </p-iconfield>

                @for (filter of filters(); track $index) {
                    @if (filter.type === 'slider') {
                        <div class="flex flex-col gap-1 px-4 py-2 border border-surface-300 dark:border-surface-700 rounded-[24px] bg-surface-0 dark:bg-surface-900 min-w-[220px]">
                            <label class="text-[10px] font-bold uppercase text-surface-500">
                                {{ filter.name }}: {{ getSelectedRange(filter) }}
                            </label>
                            <div class="px-1 py-1">
                                <p-slider 
                                    [min]="filter.min" 
                                    [max]="filter.max" 
                                    [range]="true" 
                                    [(ngModel)]="selectedRanges[filter.queryParam]" 
                                    (onSlideEnd)="onFilterRangeSelect(filter.queryParam, selectedRanges[filter.queryParam])">
                                </p-slider>
                            </div>
                        </div>
                    } @else if (filter.values) {
                        <p-select
                            [options]="filter.values"
                            optionLabel="name"
                            [placeholder]="filter.name"
                            [filter]="true"
                            filterBy="name"
                            [showClear]="true"
                            (onChange)="onFilterSelect(filter.queryParam, $event.value)"
                            [ngModel]="getSelectedValue(filter)"
                            [dt]="pillSelect"
                        ></p-select>
                    }
                }

                @if (useDateFilters()) {
                    <p-datepicker
                        selectionMode="range"
                        [placeholder]="'Rango de fechas'"
                        [readonlyInput]="true"
                        [showClear]="true"
                        [(ngModel)]="dateRange"
                        (onSelect)="onDateRangeSelect()"
                        (onClear)="onDateRangeClear()"
                        dateFormat="yy-mm-dd"
                        [dt]="pillSelect"
                    />
                }
            </div>

            <p-button 
                *ngIf="hasSelectedFilters()" 
                label="Borrar Filtros" 
                icon="pi pi-filter-slash"
                styleClass="p-button-text p-button-secondary ml-auto" 
                (onClick)="onClearFilters()">
            </p-button>
        </div>
    `,
    styles: [
        `
            :host ::ng-deep {
                /* Quitamos height fijo, usamos padding natural de PrimeNG */
                .p-datepicker-input, .p-select, .p-inputtext {
                    border-radius: 24px !important;
                }
                .p-select {
                    min-width: 180px;
                }
            }
        `,
    ],
})
export class FilterGroup implements OnInit {
    // TODO: remove when we have global configurations
    pillSelect = {
        root: {
            borderRadius: '24px',
        },
    };

    filters = input([], {
        // Trigger updateSelectedValues whenever filters change
        transform: (value: any) => {
            setTimeout(() => this.updateSelectedValues(), 0);
            return value;
        },
    });

    selectedFilters = output<any>();
    clearFilters = output();
    searchQuery: string = '';
    private searchSubject = new Subject<string>();
    private destroy$ = new Subject<void>();
    // Add input for preselected values from query params
    queryParams = input(
        {},
        {
            // Trigger updateSelectedValues whenever queryParams change
            transform: (value) => {
                setTimeout(() => this.updateSelectedValues(), 0);
                return value;
            },
        },
    );

    useDateFilters = input(false);

    protected selectedValues = signal<Record<string, any>>({});

    // Date range model
    dateRange: Date[] | null = null;

    selectedRanges: Record<string, [number, number]> = {};

    ngOnInit() {
        // Initialize selected values from query params
        this.updateSelectedValues();
        this.initDateRangeFromQueryParams();

        const params: any = this.queryParams();
        if (params?.query) this.searchQuery = params.query;

        // Configurar Debounce para el buscador
        this.searchSubject.pipe(
            debounceTime(400),
            takeUntil(this.destroy$)
        ).subscribe(value => {
            this.selectedFilters.emit({ queryParam: 'query', selectedItem: value ? { id: value } : null });
        });
    }

    onSearchChange(value: string) {
        this.searchSubject.next(value);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    // Initialize date range from query params if they exist
    private initDateRangeFromQueryParams() {
        const params: any = this.queryParams();
        if (!params) {
            return;
        }

        const dateFrom = params['dateFrom'];
        const dateTo = params['dateTo'];

        if (dateFrom && dateTo) {
            try {
                // Parse dates with explicit parts to avoid timezone issues
                const fromParts = dateFrom.split('-').map(Number);
                const toParts = dateTo.split('-').map(Number);

                // Create dates with year, month (0-indexed), day to preserve the exact day
                this.dateRange = [new Date(fromParts[0], fromParts[1] - 1, fromParts[2]), new Date(toParts[0], toParts[1] - 1, toParts[2])];

                // Add to selected values for tracking
                this.selectedValues.update((current) => ({
                    ...current,
                    dateRange: { dateFrom, dateTo },
                }));
            } catch (e) {
                console.error('Error parsing dates from URL', e);
                this.dateRange = null;
            }
        }
    }

    // This is called when the queryParams input changes
    private updateSelectedValues() {
        const params: any = this.queryParams();
        const filtersArray: any = this.filters();

        if (!filtersArray || !params) {
            return;
        }

        // For each filter, find its preselected value if exists in query params
        filtersArray.forEach((filter: any) => {
            // Si es un filtro con opciones (dropdown)
            if (filter.values) {
                const paramValue = params[filter.queryParam];
                if (paramValue !== undefined && paramValue !== null) {
                    const selectedOption = filter.values.find((value: any) => value.id.toString() === paramValue.toString());

                    if (selectedOption) {
                        this.selectedValues.update((current) => ({
                            ...current,
                            [filter.queryParam]: selectedOption,
                        }));
                    }
                }
            } else {
                // Si es un filtro tipo rango (slider)
                const minParam = params[`${filter.queryParam}Min`];
                const maxParam = params[`${filter.queryParam}Max`];

                if (minParam !== undefined && maxParam !== undefined) {
                    const min = Number(minParam);
                    const max = Number(maxParam);

                    if (!isNaN(min) && !isNaN(max)) {
                        this.selectedRanges[filter.queryParam] = [min, max];

                        this.selectedValues.update((current) => ({
                            ...current,
                            [filter.queryParam]: [min, max],
                        }));
                    }
                } else {
                    // Si no hay valores en query params, usa rango completo
                    this.selectedRanges[filter.queryParam] = [filter.min, filter.max];
                }
            }
        });
    }

    // Get the selected value for a specific filter
    getSelectedValue(filter: any) {
        const values = this.selectedValues();
        return values[filter.queryParam] || null;
    }

    // Check if there are any selected filters or date range
    hasSelectedFilters(): boolean {
        return Object.keys(this.selectedValues()).length > 0 || (this.dateRange !== null && this.dateRange.length > 0);
    }

    onFilterSelect(queryParam: string, selectedItem: any) {
        // Update internal state
        this.selectedValues.update((current) => ({
            ...current,
            [queryParam]: selectedItem,
        }));

        if (!selectedItem) {
            this.selectedValues.update((current) => {
                const updated = { ...current };
                delete updated[queryParam];
                return updated;
            });
        }

        // Emit the change
        this.selectedFilters.emit({ queryParam, selectedItem });
    }

    // Handle date range selection
    onDateRangeSelect() {
        if (this.dateRange && this.dateRange.length === 2 && this.dateRange[0] && this.dateRange[1]) {
            // Let the calendar handle the formatting through its dateFormat property
            // We just need to get the dates in ISO format for the API
            const dateFrom = this.dateToISO(this.dateRange[0]);
            const dateTo = this.dateToISO(this.dateRange[1]);

            // Store in selected values for tracking
            this.selectedValues.update((current) => ({
                ...current,
                dateRange: { dateFrom, dateTo },
            }));

            // Emit both date parameters in a single event
            this.selectedFilters.emit({
                queryParam: 'dateRange',
                selectedItem: { dateFrom, dateTo },
            });
        }
    }

    // Convert date to ISO format string (YYYY-MM-DD)
    private dateToISO(date: Date | null): string {
        if (!date) {
            return '';
        }
        // Use local date parts to avoid timezone issues
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Handle date range clear
    onDateRangeClear() {
        this.dateRange = null;

        // Remove from selected values
        this.selectedValues.update((current) => {
            const updated = { ...current };
            delete updated['dateRange'];
            return updated;
        });

        // Emit clear event
        this.selectedFilters.emit({
            queryParam: 'dateRange',
            selectedItem: null,
        });
    }

    // Handle clear filters button click
    onClearFilters() {
        this.searchQuery = '';
        this.dateRange = null;
        
        // Resetear los sliders a su rango original
        this.filters().forEach((filter: any) => {
            if (filter.type === 'slider') {
                this.selectedRanges[filter.queryParam] = [filter.min, filter.max];
            }
        });
    
        this.selectedValues.set({});
        this.clearFilters.emit();
    }

    getSelectedRange(filter: any): string {
        const range = this.selectedRanges[filter.queryParam];
        const currency = '$'; 
        return range ? `${currency}${range[0]} - ${currency}${range[1]}` : `${currency}${filter.min} - ${currency}${filter.max}`;
    }

    onFilterRangeSelect(queryParam: string, range: [number, number]) {
        this.selectedValues.update((current) => ({
            ...current,
            [queryParam]: range,
        }));

        this.selectedFilters.emit({ queryParam, selectedItem: range });
    }
}
