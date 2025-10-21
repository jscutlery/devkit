import 'reflect-metadata';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import { it } from '@jest/globals';

(globalThis as any).it.fails = it.failing;
setupZoneTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});
