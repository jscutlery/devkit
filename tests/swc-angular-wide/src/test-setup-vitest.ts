import '@analogjs/vite-plugin-angular/setup-vitest';
import { getTestBed } from '@angular/core/testing';

import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { it } from 'vitest';

import 'reflect-metadata';

(globalThis as any).it.fails = it.fails;

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
