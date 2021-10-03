/* Import jest functions manually as they conflict with cypress
 * because @cypress/webpack-dev-server references cypress types */
import { describe, expect, it } from '@jest/globals';

import { findTargetOptions } from './find-target-options';

import * as fs from 'fs';
import * as fsAsync from 'fs/promises';

jest.mock('fs');
jest.mock('fs/promises');

describe('findTargetOptions', () => {
  it('should throw if no workspace def found', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    await expect(() => findTargetOptions('./', 'test:build')).rejects.toThrow();
  });

  it('should throw if workspace def is not JSON compliant', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fsAsync.readFile as jest.Mock).mockResolvedValue(undefined);
    await expect(() => findTargetOptions('./', 'test:build')).rejects.toThrow();
  });

  it('should return undefined if no options found in workspace def', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fsAsync.readFile as jest.Mock).mockResolvedValue('{ "version": 0 }');
    expect(await findTargetOptions('./', 'test:build')).toBeUndefined();
  });

  it('should find target options', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fsAsync.readFile as jest.Mock).mockResolvedValue(`{
      "projects": {
        "test": {
          "targets": {
            "build": {
              "options": {
                "value": 42
              }
            }
          }
        }
      }
    }
  `);

    expect(await findTargetOptions('./', 'test:build')).toEqual({ value: 42 });
  });

  it('should find target options with configuration', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fsAsync.readFile as jest.Mock).mockResolvedValue(`{
      "projects": {
        "test": {
          "targets": {
            "build": {
              "configurations": {
                "production": {
                  "value": 42
                }
              }
            }
          }
        }
      }
    }
  `);

    expect(await findTargetOptions('./', 'test:build:production')).toEqual({
      value: 42,
    });
  });

  it('should find target for Angular CLI projects', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fsAsync.readFile as jest.Mock).mockResolvedValue(`{
      "projects": {
        "test": {
          "architect": {
            "build": {
              "options": {
                "value": 42
              }
            }
          }
        }
      }
    }`);

    expect(await findTargetOptions('./', 'test:build')).toEqual({
      value: 42,
    });
  });

  it('should find target with configuration for Angular CLI projects', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fsAsync.readFile as jest.Mock).mockResolvedValue(`{
      "projects": {
        "test": {
          "architect": {
            "build": {
              "configurations": {
                "production": {
                  "value": 42
                }
              }
            }
          }
        }
      }
    }`);

    expect(await findTargetOptions('./', 'test:build:production')).toEqual({
      value: 42,
    });
  });

  it('should find target options for standalone project', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fsAsync.readFile as jest.Mock).mockResolvedValueOnce(`{
      "projects": {
        "test": "libs/test"
      }
    }`);
    (fsAsync.readFile as jest.Mock).mockResolvedValueOnce(`{
      "targets": {
        "build": {
          "options": {
            "value": 42
          }
        }
      }
    }`);

    expect(await findTargetOptions('./', 'test:build')).toEqual({
      value: 42,
    });
  });

  it('should find target options with configuration for standalone project', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fsAsync.readFile as jest.Mock).mockResolvedValueOnce(`{
      "projects": {
        "test": "libs/test"
      }
    }`);
    (fsAsync.readFile as jest.Mock).mockResolvedValueOnce(`{
      "targets": {
        "build": {
          "configurations": {
            "production": {
              "value": 42
            }
          }
        }
      }
    }`);

    expect(await findTargetOptions('./', 'test:build:production')).toEqual({
      value: 42,
    });
  });

  it.todo('should recursively find workspace def');
});
