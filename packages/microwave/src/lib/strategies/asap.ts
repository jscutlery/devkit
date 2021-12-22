import { audit } from 'rxjs';
import { Strategy } from '../devkit';
import { createLocalStrategy } from './local';

/**
 * A strategy that coalesces changes using micro task scheduling.
 */
export const asapStrategy: Strategy<unknown> = createLocalStrategy({
  coalescer: audit(() => Promise.resolve()),
});
