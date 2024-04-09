import { Config } from '@swc/core';
import { expectTypeOf, test } from 'vitest';
import { swcAngularPreset } from './index';
import swcAngularPresetLegacy from './index';

test('swcAngularPreset should return a valid jest config', () => {
  expectTypeOf(swcAngularPreset()).toMatchTypeOf<Record<string, unknown>>();
});

test('swcAngularPreset should return a valid SWC config', () => {
  expectTypeOf(swcAngularPreset()).toMatchTypeOf<Config>();
});

test('swcAngularPresetLegacy should be a valid jest config', () => {
  expectTypeOf(swcAngularPresetLegacy).toMatchTypeOf<Record<string, unknown>>();
});

test('swcAngularPresetLegacy should be a valid SWC config', () => {
  expectTypeOf(swcAngularPresetLegacy).toMatchTypeOf<Config>();
});
