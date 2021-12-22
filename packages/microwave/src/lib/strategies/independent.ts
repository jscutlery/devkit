import { Observable } from 'rxjs';
import { Strategy } from '../devkit';

/**
 * @deprecated 🚧 Work in progress.
 */
export const createIndependentStrategy =
  (args: { coalesce?: Observable<void> } = {}): Strategy<unknown> =>
  () => {
    throw new Error('🚧 Work in progress!');
  };
