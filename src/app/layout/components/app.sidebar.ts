/* eslint-disable @typescript-eslint/member-ordering */
import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';

import { AppMenu } from './app.menu';

import { LayoutService } from '@/layout/service/layout.service';
import { AuthService } from '@/pages/auth/auth.service';

@Component({
    selector: '[app-sidebar]',
    standalone: true,
    imports: [AppMenu, ButtonModule, RouterModule, CommonModule, StyleClassModule, FormsModule],
    template: `
        <div class="pt-8 pr-6 md:pr-4 md:pt-4">
            <ul class="topbar-menu">
                <li>
                    <button
                        pButton
                        pRipple
                        type="button"
                        [icon]="darkTheme() ? 'pi pi-sun' : 'pi pi-moon'"
                        class="flex-shrink-0 config-button"
                        size="large"
                        text
                        rounded
                        (click)="toggleDarkMode()"
                        [ngModel]="darkTheme()"
                        (ngModelChange)="toggleDarkMode()"
                    ></button>
                </li>

                <li class="profile-item topbar-item">
                    <button
                        pButton
                        pRipple
                        type="button"
                        icon="pi pi-fw pi-cog"
                        class="text-surface-500 dark:text-surface-400 flex-shrink-0"
                        severity="secondary"
                        text
                        rounded
                        pStyleClass="@next"
                        enterFromClass="!hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="!hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    ></button>

                    <ul class="topbar-menu active-topbar-menu !p-6 w-60 z-50 !hidden rounded shadow-md !bg-white dark:!bg-surface-800">
                        <li role="menuitem" class="!m-0">
                            <a
                                (click)="authService.signOut()"
                                href="auth/login"
                                class="flex items-center hover:text-primary-500 duration-200"
                                pStyleClass="@grandparent"
                                enterFromClass="!hidden"
                                enterActiveClass="animate-scalein"
                                leaveToClass="!hidden"
                                leaveActiveClass="animate-fadeout"
                                [hideOnOutsideClick]="true"
                            >
                                <i class="pi pi-fw pi-sign-out mr-2"></i>
                                <span>Cerrar sesión</span>
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>

            <button class="layout-sidebar-anchor z-20" type="button" (click)="onAnchorToggle()"></button>
        </div>
        <div class="flex flex-col justify-center items-center w-full gap-4 mt-4">
            <img class="rounded-full h-48 w-48 object-cover border-4 border-orange-500 shadow-lg" src="/images/avatar-m-1.jpg" />

            @if (currentUser()) {
                <div class="flex flex-col items-center gap-1">
                    <span class="text-xl font-extrabold text-orange-500 uppercase tracking-wider"> {{ currentUser().firstName }} {{ currentUser().lastName }} </span>

                    <span class="text-sm font-medium text-surface-600 dark:text-surface-400">
                        {{ currentUser().email }}
                    </span>
                </div>
            }
        </div>
        <div app-menu></div>
    `,
    host: {
        class: 'layout-sidebar',
    },
})
export class AppSidebar {
    el = inject(ElementRef);

    router = inject(Router);

    layoutService = inject(LayoutService);
    authService = inject(AuthService);

    currentUser = computed(() => this.authService.user);
    @ViewChild(AppMenu) appMenu!: AppMenu;

    logo = computed(() => (this.layoutService.isDarkTheme() ? 'light' : 'dark'));
    darkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);

    timeout!: any;

    onAnchorToggle() {
        this.layoutService.layoutState.update((val) => ({ ...val, anchored: !val.anchored }));
    }

    @HostListener('mouseenter', ['$event'])
    onMouseEnter(event: MouseEvent) {
        if (!this.layoutService.layoutState().anchored) {
            if (this.timeout) {
                this.timeout = null;
            }
            this.layoutService.layoutState.update((val) => ({ ...val, sidebarActive: true }));
        }
    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(event: MouseEvent) {
        if (!this.layoutService.layoutState().anchored) {
            if (!this.timeout) {
                this.timeout = setTimeout(() => {
                    this.layoutService.layoutState.update((val) => ({ ...val, sidebarActive: false }));
                    this.timeout = null;
                }, 300);
            }
        }
    }

    toggleDarkMode() {
        this.executeDarkModeToggle();
    }

    executeDarkModeToggle() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme,
        }));
    }
}
