import { Type } from '@angular/core';
import { fixtures as mountFixtures } from '@playwright/experimental-ct-core/lib/mount';
import * as playwright from '@playwright/test';
import { fn, MockedFunction } from 'jest-mock';
import type { Observable } from 'rxjs';
import { InlineConfig } from 'vite';

const mountTest = playwright.test.extend(mountFixtures);
export const test = mountTest.extend<{
  mount: ComponentFixtures['mount'];
}>({
  /**
   * Override mount to return output spies and enjoy type inference.
   * This allows this:
   *
   * const { spies } = mount(..., {outputs: {citySelect: jest.fn()}})
   *
   * instead of this:
   *
   * const citySelectSpy: jest.MockedFunction<(city: string) => void> = jest.fn();
   * mount(..., {outputs: {citySelect: citySelectSpy}});
   *
   * @hack we are willingly not using `async mount(...)` syntax here
   * because it would be transpiled to `_async(function mount() { ... }`
   * by Nx's default rollout config.
   * Playwright dynamically parses the given function so converting
   * async / await to a wrapped function would simply break the library causing
   * a `TypeError: mount is not a function` error.
   */
  mount({ mount, page }, use) {
    return use(async (component, options = {}) => {
      /* 1. Create a spy for each output in `spyOutputs`... */
      const spies =
        options.spyOutputs?.reduce((acc, key) => {
          return {
            ...acc,
            [key]: fn(),
          };
        }, {}) ?? {};

      /* 2. ...then use it as an output... */
      await mount(component, {
        ...options,
        outputs: {
          ...options.outputs,
          ...spies,
        },
      });

      /* Grab a locator to the TestBed's root element.
       * We are loading a fresh new page for each test
       * so the id should always be "root0".
       * Otherwise, we'd have to hack our way and somehow grab all
       * the `#root*`, sort them and grab the last one.
       * As a matter of fact, we can't grab a reference to the fixture. */
      const locator = page.locator('#root0');

      /* Add spies to the returned locator. */
      return Object.assign(locator, { spies });
    });
  },
});

export const expect = playwright.expect;

export const devices = playwright.devices;

export interface ComponentFixtures {
  mount<COMPONENT, SPIED_OUTPUT extends keyof COMPONENT>(
    component: Type<COMPONENT>,
    options?: MountOptions<COMPONENT, SPIED_OUTPUT>
  ): Promise<MountResult<COMPONENT, SPIED_OUTPUT>>;
}

export interface MountOptions<COMPONENT, SPIED_OUTPUT> {
  inputs?: Partial<COMPONENT>;
  outputs?: Outputs<COMPONENT>;
  spyOutputs?: Array<SPIED_OUTPUT>;
}

export type Outputs<COMPONENT> = Partial<{
  /* For each field or method... is this an observable? */
  [K in keyof COMPONENT]: COMPONENT[K] extends Observable<unknown>
    ? /* It's an observable, so let's change the return type. */
      (value: Emitted<COMPONENT[K]>) => void
    : /* It's something else. */
      COMPONENT[K];
}>;

export interface MountResult<COMPONENT, SPIED_OUTPUT extends keyof COMPONENT>
  extends playwright.Locator {
  spies: Spies<COMPONENT, SPIED_OUTPUT>;
}

export type Spies<COMPONENT, SPIED_OUTPUT extends keyof COMPONENT> = Partial<{
  /* For each field or method... is this an observable? */
  [K in SPIED_OUTPUT]: COMPONENT[K] extends Observable<unknown>
    ? /* It's an observable, so let's change the return type. */
      MockedFunction<(value: Emitted<COMPONENT[K]>) => void>
    : /* It's something else. */
      COMPONENT[K];
}>;

export type PlaywrightTestConfig = Omit<
  playwright.PlaywrightTestConfig,
  'use'
> & {
  use?: playwright.PlaywrightTestConfig['use'] & {
    ctPort?: number;
    ctTemplateDir?: string;
    ctCacheDir?: string;
    ctViteConfig?: InlineConfig;
  };
};

type Emitted<OBSERVABLE> = OBSERVABLE extends Observable<infer EMITTED>
  ? EMITTED
  : OBSERVABLE;

/**
 * Fixing matchers typing to add Jest spy matchers.
 Cf. https://github.com/microsoft/playwright/tree/20957f820d34a53003ab0722fa149c80fedec846/packages/playwright-test/types */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace PlaywrightTest {
    export interface Matchers<R> {
      lastCalledWith(...args: Array<unknown>): R;

      lastReturnedWith(value: unknown): R;

      not: Matchers<R>;

      nthCalledWith(nthCall: number, ...args: Array<unknown>): R;

      nthReturnedWith(n: number, value: unknown): R;

      toBeCalled(): R;

      toBeCalledTimes(expected: number): R;

      toBeCalledWith(...args: Array<unknown>): R;

      toHaveBeenCalled(): R;

      toHaveBeenCalledTimes(expected: number): R;

      toHaveBeenCalledWith(...args: Array<unknown>): R;

      toHaveBeenNthCalledWith(nthCall: number, ...args: Array<unknown>): R;

      toHaveBeenLastCalledWith(...args: Array<unknown>): R;

      toHaveLastReturnedWith(expected: unknown): R;

      toHaveNthReturnedWith(nthCall: number, expected: unknown): R;

      toHaveReturned(): R;

      toHaveReturnedTimes(expected: number): R;

      toHaveReturnedWith(expected: unknown): R;

      toReturn(): R;

      toReturnTimes(count: number): R;

      toReturnWith(value: unknown): R;
    }
  }
}
