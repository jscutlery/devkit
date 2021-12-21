import {
  destroy as ɵdestroy,
  mount as ɵmount,
  mountStory as ɵmountStory,
} from './lib/cypress-mount';

/**
 * @deprecated import `mount` from `@jscutlery/cypress-angular` instead.
 */
export const mount = ɵmount;

/**
 * @deprecated import `mount` from `@jscutlery/cypress-angular` instead.
 */
export const mountStory = ɵmountStory;

export { ɵdestroy, ɵmount, ɵmountStory };
