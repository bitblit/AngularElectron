// Polyfills
import 'core-js/es7/reflect';
import 'zone.js/dist/zone'; // Included with Angular CLI.

// require("zone.js/dist/zone");

// Vendor
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/router';
import 'rxjs';

// main

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';
import { No } from '@bitblit/ratchet/dist/common/no';

if (process.env.NODE_ENV === 'production') {
  enableProdMode();
}

// add base element for Angular Router support
const base: HTMLBaseElement = document.createElement('base');
// this is './' not '/' because electron uses file:// URLs
base.href = './';
document.head.appendChild(base);

platformBrowserDynamic().bootstrapModule(AppModule).then(No.op);
