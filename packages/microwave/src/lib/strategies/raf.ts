import { audit, animationFrames } from 'rxjs';
import { Strategy } from '../devkit';
import { createLocalStrategy } from './local';
/**
 * A strategy that coalesces changes using requestAnimationFrame scheduler.
 */
export const rafStrategy: Strategy<unknown> = createLocalStrategy({
  coalescer: audit(() => animationFrames()),
});
