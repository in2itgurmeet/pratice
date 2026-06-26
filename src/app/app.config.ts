import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';

import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';

import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

import { ModalModule } from 'ngx-bootstrap/modal';
import { NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';

const monacoConfig = {
  baseUrl: 'https://unpkg.com/monaco-editor@0.24.0/min/vs'
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),

    importProvidersFrom(FeatherModule.pick(allIcons)),
    importProvidersFrom(ModalModule.forRoot()),

    {
      provide: NGX_MONACO_EDITOR_CONFIG,
      useValue: monacoConfig
    }
  ]
};