import { CommonModule } from '@angular/common';
import { Component, ContentChild, effect, inject, input, signal, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { DrawerService } from '@/common/services/drawer.service';
import { BaseDrawerComponent } from '@/common/components/base-drawer.component';
import { DebtsService } from '../debts.service';

@Component({
    selector: 'drawer-debt', // Selector limpio
    standalone: true,
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, 
        InputGroupModule, InputGroupAddonModule, DrawerModule, 
        ButtonModule, ToastModule, TagModule
    ],
    template: `
        <p-drawer 
            [visible]="isDrawerVisible()" 
            position="right" 
            [header]="getDrawerState().title()" 
            [modal]="true" 
            styleClass="!w-full md:!w-80 lg:!w-[30rem]" 
            (onHide)="onClose()">
            
            <ng-template #content>
                <form class="flex flex-col gap-6 p-4" *ngIf="formGroup" [formGroup]="formGroup">
                    <div *ngIf="isEditMode()" class="flex justify-between items-center bg-surface-50 dark:bg-surface-800 p-3 rounded-lg">
                        <span class="text-sm font-medium">Estado actual:</span>
                        <p-tag 
                            [severity]="formGroup.get('isPaid')?.value ? 'success' : 'warn'" 
                            [value]="formGroup.get('isPaid')?.value ? 'PAGADA' : 'PENDIENTE'">
                        </p-tag>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="description" class="font-bold text-surface-700 dark:text-surface-200">Descripción *</label>
                        <input pInputText id="description" formControlName="description" type="text" placeholder="Ej. Pago de servicios" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="amount" class="font-bold text-surface-700 dark:text-surface-200">Monto *</label>
                        <p-inputGroup>
                            <p-inputGroupAddon>$</p-inputGroupAddon>
                            <input pInputText id="amount" formControlName="amount" type="number" placeholder="0.00" />
                        </p-inputGroup>
                        <small class="text-red-500" *ngIf="formGroup.get('amount')?.invalid && formGroup.get('amount')?.dirty">
                            El monto debe ser un valor positivo mayor a 0.
                        </small>
                    </div>

                    <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg" *ngIf="formGroup.disabled">
                        <p class="text-sm text-blue-700 dark:text-blue-300">
                            <i class="pi pi-info-circle mr-2"></i>
                            Esta deuda ya ha sido pagada y no puede ser modificada.
                        </p>
                    </div>
                </form>
            </ng-template>

            <ng-template #footer>
                <div class="flex gap-4 w-full">
                    <p-button label="Descartar" [rounded]="true" (click)="onClose()" severity="secondary" class="flex-1" />
                    
                    <ng-container *ngIf="isEditMode(); else createBtn">
                         <ng-container *ngTemplateOutlet="actionsTemplate ?? null"></ng-container>
                    </ng-container>

                    <ng-template #createBtn>
                        <p-button 
                            label="Guardar Deuda" 
                            [rounded]="true" 
                            styleClass="!bg-orange-500 !border-orange-500"
                            class="flex-1" 
                            [disabled]="formGroup.invalid"
                            (onClick)="saveDebt()" />
                    </ng-template>
                </div>
            </ng-template>
        </p-drawer>
    `,
})
export class DrawerDebt extends BaseDrawerComponent<any> {
    @ContentChild('actionsTemplate') actionsTemplate?: TemplateRef<any>;

    drawerService = inject(DrawerService);
    messageService = inject(MessageService);
    debtsService = inject(DebtsService);
    fb = inject(FormBuilder);

    formGroup!: FormGroup;
    isDrawerVisible = signal(false);
    isEditMode = signal(false);
    key = input<string | undefined>(undefined);

    constructor() {
        super();
        this.destroyEffect = effect(() => {
            if (!this.isInitialized() || !this.key()) return;

            const state = this.drawerService.getState<any>(this.key());
            this.isDrawerVisible.set(state.visible());

            if (state.visible()) {
                this.onDataReceived(state.data());
            }
        });
    }

    protected override initializeForm(): void {
        this.formGroup = this.fb.group({
            id: [null],
            description: ['', [Validators.required, Validators.minLength(3)]],
            amount: [null, [Validators.required, Validators.min(0.01)]], // Validación de monto positivo
            isPaid: [false]
        });
    }

    protected override onDataReceived(data: any): void {
        const debtId = this.getMetadataValue('Id');

        if (debtId) {
            this.isEditMode.set(true);
            this.loadDebtData(debtId);
        } else {
            this.isEditMode.set(false);
            this.formGroup.reset({ isPaid: false });
            this.formGroup.enable();
        }
    }

    private loadDebtData(id: number) {
        this.debtsService.getDebtById(id).subscribe({
            next: (data: any) => {
                this.formGroup.patchValue(data);
                // REGLA: Si la deuda está pagada, se deshabilita el formulario
                if (data.isPaid) {
                    this.formGroup.disable();
                } else {
                    this.formGroup.enable();
                }
            },
            error: (err) => console.error('Error al cargar la deuda:', err)
        });
    }

    saveDebt() {
        if (this.formGroup.invalid) return;
        
        const payload = this.formGroup.getRawValue();
        this.debtsService.createDebt(payload).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Deuda registrada correctamente' });
                this.onClose();
                // Aquí deberías refrescar la tabla en el container
            },
            error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message })
        });
    }

    protected override validateForm(): boolean { return this.formGroup?.valid; }
    protected override getFormData(): any { return this.formGroup?.getRawValue(); }
}