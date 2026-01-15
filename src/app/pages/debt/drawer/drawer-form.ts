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
import { AuthService } from '@/pages/auth/auth.service';

@Component({
    selector: 'drawer-debt',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, InputGroupModule, InputGroupAddonModule, DrawerModule, ButtonModule, ToastModule, TagModule],
    template: `
        <p-drawer [visible]="isDrawerVisible()" position="right" [header]="getDrawerState().title()" [modal]="true" styleClass="!w-full md:!w-80 lg:!w-[30rem]" (onHide)="onClose()">
            <ng-template #content>
                <form class="flex flex-col gap-6 p-4" *ngIf="formGroup" [formGroup]="formGroup">
                    <div *ngIf="isEditMode()" class="flex justify-between items-center ...">
                        <span class="text-sm font-medium">Estado actual:</span>
                        <p-tag [severity]="formGroup.get('isPaid')?.value ? 'success' : 'warn'" [value]="formGroup.get('isPaid')?.value ? 'PAGADA' : 'PENDIENTE'"> </p-tag>
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
                        <small class="text-red-500" *ngIf="formGroup.get('amount')?.invalid && formGroup.get('amount')?.dirty"> El monto debe ser un valor positivo mayor a 0. </small>
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
                <div class="flex gap-4 w-full justify-end">
                    <p-button label="Cerrar" [rounded]="true" (click)="onClose()" severity="secondary" />

                    <ng-container *ngIf="isEditMode() && formGroup.disabled">
                        <ng-container *ngTemplateOutlet="actionsTemplate ?? null"></ng-container>
                    </ng-container>

                    <ng-container *ngIf="isEditMode() && !formGroup.disabled">
                        <ng-container *ngTemplateOutlet="actionsTemplate ?? null"></ng-container>
                        <p-button label="Actualizar" [rounded]="true" styleClass="!bg-orange-500 !border-orange-500" [disabled]="formGroup.invalid" (onClick)="saveDebt()" />
                    </ng-container>

                    <p-button *ngIf="!isEditMode()" label="Guardar Deuda" [rounded]="true" styleClass="!bg-orange-500 !border-orange-500" [disabled]="formGroup.invalid" (onClick)="saveDebt()" />
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
    authService = inject(AuthService);
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
            amount: [null, [Validators.required, Validators.min(0.01)]],
            isPaid: [false],
        });
    }

    protected override onDataReceived(data: any): void {
        const debtId = this.getMetadataValue('Id');
        const mode = this.getMetadataValue('mode');
        if (debtId) {
            this.isEditMode.set(true);
            this.loadDebtData(debtId, mode);
        } else {
            this.isEditMode.set(false);
            this.formGroup.reset({ isPaid: false });
            this.formGroup.enable();
        }
    }

    private loadDebtData(id: string, mode?: string) {
        this.debtsService.getDebtById(id).subscribe({
            next: (data: any) => {
                this.formGroup.patchValue(data);

                if (data.isPaid || mode === 'view') {
                    this.formGroup.disable();
                } else {
                    this.formGroup.enable();
                }
            },
            error: (err) => console.error('Error al cargar la deuda:', err),
        });
    }

    saveDebt() {
        if (this.formGroup.invalid) return;

        const rawValue = this.formGroup.getRawValue();
        const id = rawValue.id;

        const payload = {
            ...rawValue,
            userId: id ? rawValue.user?.userId || rawValue.userId : this.authService.getCurrentUserId(),
        };

        delete payload.user;
        delete payload.paidByUser;

        const request = id ? this.debtsService.updateDebt(id, payload) : this.debtsService.createDebt(payload);

        request.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: id ? 'Deuda actualizada' : 'Deuda registrada',
                });
                this.onClose();
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error.message || 'Error al procesar la solicitud',
                });
            },
        });
    }

    protected override validateForm(): boolean {
        return this.formGroup?.valid;
    }
    protected override getFormData(): any {
        return this.formGroup?.getRawValue();
    }
}
