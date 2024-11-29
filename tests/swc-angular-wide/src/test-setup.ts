// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
globalThis.ngJest = {
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
};
import 'reflect-metadata';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import { it } from '@jest/globals';

(globalThis as any).it.fails = it.failing;
setupZoneTestEnv();
