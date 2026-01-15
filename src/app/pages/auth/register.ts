import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ButtonModule, InputTextModule, PasswordModule, RouterModule, RippleModule, ReactiveFormsModule, ToastModule, MessageModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="min-h-screen flex items-center justify-center p-0 lg:p-4 bg-white lg:bg-gray-50 dark:bg-gray-900 dark:lg:bg-gray-900 transition-colors duration-200">
            <div class="bg-white w-full lg:rounded-2xl lg:overflow-hidden lg:max-w-5xl flex flex-col lg:flex-row lg:shadow-lg dark:bg-gray-800 dark:text-white transition-colors duration-200">
                <div class="w-full lg:w-1/2 p-12 flex flex-col">
                    <h1 class="text-3xl font-bold text-gray-800 mb-8 dark:text-white transition-colors duration-200">Crear Cuenta</h1>

                    <form [formGroup]="registerForm" class="w-full">
                        <div class="flex gap-4 mb-6">
                            <div class="flex-1">
                                <label for="firstName" class="block text-gray-700 mb-2 text-sm dark:text-gray-300">Nombre *</label>
                                <input id="firstName" pInputText type="text" class="w-full p-3 border border-gray-300 rounded dark:bg-gray-700 dark:text-white" formControlName="firstName" />
                            </div>
                            <div class="flex-1">
                                <label for="lastName" class="block text-gray-700 mb-2 text-sm dark:text-gray-300">Apellido *</label>
                                <input id="lastName" pInputText type="text" class="w-full p-3 border border-gray-300 rounded dark:bg-gray-700 dark:text-white" formControlName="lastName" />
                            </div>
                        </div>
                        <div class="mb-6">
                            <label for="email" class="block text-gray-700 mb-2 text-sm dark:text-gray-300 transition-colors duration-200">User *</label>
                            <input
                                id="email"
                                pInputText
                                type="text"
                                class="w-full p-3 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200"
                                formControlName="email"
                                placeholder="correo@ejemplo.com"
                            />
                        </div>

                        <div class="mb-5">
                            <label for="password" class="block text-gray-700 mb-2 text-sm dark:text-gray-300 transition-colors duration-200">Contraseña *</label>
                            <div class="relative">
                                <p-password
                                    formControlName="password"
                                    [feedback]="true"
                                    toggleMask="true"
                                    styleClass="block w-full"
                                    inputStyleClass="w-full p-3 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200"
                                    placeholder="Mínimo 6 caracteres"
                                >
                                </p-password>
                            </div>
                        </div>

                        <button
                            type="button"
                            class="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-full transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-500"
                            [disabled]="isLoading() || registerForm.invalid"
                            (click)="signUp()"
                        >
                            <span *ngIf="!isLoading()">Registrarse</span>

                            <span *ngIf="isLoading()" class="flex items-center justify-center">
                                <i class="pi pi-spin pi-spinner mr-2"></i>
                                Cargando...
                            </span>
                        </button>
                    </form>
                    <div class="mt-6 text-center">
                        <span class="text-gray-600 dark:text-gray-400 text-sm">¿Ya tienes una cuenta? </span>
                        <a routerLink="/auth/login" class="text-orange-500 font-semibold hover:underline text-sm cursor-pointer"> Iniciar sesión </a>
                    </div>
                </div>

                <div class="w-full lg:w-1/2 bg-gray-900 text-white p-12 flex-col justify-center relative overflow-hidden hidden lg:flex dark:bg-gray-950 transition-colors duration-200">
                    <svg class="absolute inset-0 pointer-events-none" viewBox="0 0 960 540" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
                        <g class="text-gray-700 opacity-25 dark:text-gray-600 transition-colors duration-200" fill="none" stroke="currentColor" stroke-width="100">
                            <circle r="234" cx="196" cy="23"></circle>
                            <circle r="234" cx="790" cy="491"></circle>
                        </g>
                    </svg>

                    <div class="z-10">
                        <h1 class="text-5xl font-bold mb-6">Únete a la<br />Gestión de Deudas.</h1>
                        <p class="text-base mb-16 opacity-90">Crea tu cuenta para empezar a organizar tus deudas, visualizar tus estados financieros y exportar reportes detallados de forma segura y eficiente.</p>
                    </div>
                </div>
            </div>
        </div>
    `,
})
export class Register {
    authService = inject(AuthService);
    messageService = inject(MessageService);
    router = inject(Router);
    fb = inject(FormBuilder);

    isLoading = signal<boolean>(false);

    registerForm = this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    });

    signUp() {
        this.isLoading.set(true);

        this.authService.register(this.registerForm.value).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Registro exitoso',
                    detail: 'Cuenta creada correctamente. Redirigiendo al ingreso...',
                    life: 3000,
                });
                setTimeout(() => this.router.navigate(['/auth/login']), 2000);
            },
            error: (error) => {
                console.log(error);
                this.isLoading.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error en registro',
                    detail: error.error?.message || 'Ocurrió un error al intentar registrarse.',
                    life: 5000,
                });
            },
        });
    }
}
