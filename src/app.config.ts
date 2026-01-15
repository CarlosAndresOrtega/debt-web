/* eslint-disable @typescript-eslint/naming-convention */
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { authInterceptor } from '@/interceptors/auth.interceptor';
import { definePreset } from '@primeng/themes';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

const myPreset = definePreset(Aura, {
    semantic: {
        button: {
            borderRadius: '1.5rem',
            roundedBorderRadius: '1.5rem',
        },
    },
});

registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
    providers: [
        
        provideRouter(
            appRoutes,
            withInMemoryScrolling({
                anchorScrolling: 'enabled',
                scrollPositionRestoration: 'enabled',
            }),
            withEnabledBlockingInitialNavigation(),
        ),
        provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
        provideAnimationsAsync(),
        { provide: LOCALE_ID, useValue: 'es-CO' },
        providePrimeNG({
            theme: { preset: myPreset, options: { darkModeSelector: '.app-dark' } },
        }),
        
    ],
};
