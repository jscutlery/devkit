import { createLocalStrategy } from './local';
import { Strategy } from '../devkit';
export const syncStrategy: Strategy<unknown> = createLocalStrategy();
