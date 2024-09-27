import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { NgxIndexedDBService, DBConfig, CONFIG_TOKEN } from 'ngx-indexed-db';
import { dbConfig } from './database.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    { provide: CONFIG_TOKEN, useValue: dbConfig },  // Fournir la configuration via DBConfigToken
    NgxIndexedDBService  // Fournir le service IndexedDB
  ]
};
