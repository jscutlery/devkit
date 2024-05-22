import { Options } from '@swc/core';
import { expectTypeOf, test } from 'vitest';
import { swcAngularPreset } from './index';
import swcAngularPresetLegacy from './index';

test('swcAngularPreset should return a valid jest config', () => {
  expectTypeOf(swcAngularPreset()).toMatchTypeOf<Record<string, unknown>>();
});

test('swcAngularPreset should return a valid SWC options', () => {
  expectTypeOf(swcAngularPreset()).toMatchTypeOf<Options>();
});

test('swcAngularPresetLegacy should be a valid jest config', () => {
  expectTypeOf(swcAngularPresetLegacy).toMatchTypeOf<Record<string, unknown>>();
});

test('swcAngularPresetLegacy should be a valid SWC options', () => {
  expectTypeOf(swcAngularPresetLegacy).toMatchTypeOf<Options>();
});
