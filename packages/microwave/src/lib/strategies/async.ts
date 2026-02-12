import { audit, timer } from 'rxjs';
import { Strategy } from '../devkit';
import { createLocalStrategy } from './local';
/**
 * A strategy that coalesces changes using macrotask scheduling.
 */
export const asyncStrategy: Strategy<unknown> = createLocalStrategy({
  coalescer: audit(() => timer(0)),
});
