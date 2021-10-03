/* Import jest functions manually as they conflict with cypress
 * because @cypress/webpack-dev-server references cypress types */
import { describe, expect, it } from '@jest/globals';

import { findTargetOptions } from './find-target-options';

import * as fs from 'fs';

jest.mock('fs');

describe(findTargetOptions.name, () => {
  it('should throw if no workspace def found', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    expect(() => findTargetOptions('./', 'test:build')).toThrow();
  });

  it('should throw if workspace def is not JSON compliant', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.readFileSync as jest.Mock).mockResolvedValue(undefined);
    expect(() => findTargetOptions('./', 'test:build')).toThrow();
  });

  it('should return undefined if no options found in workspace def', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockResolvedValue('{ "version": 0 }');
    expect(findTargetOptions('./', 'test:build')).toBeUndefined();
  });

  it('should find target options', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockResolvedValue(`{
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

    expect(findTargetOptions('./', 'test:build')).toEqual({ value: 42 });
  });

  it('should find target options with configuration', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockResolvedValue(`{
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

    expect(findTargetOptions('./', 'test:build:production')).toEqual({
      value: 42,
    });
  });

  it('should find target for Angular CLI projects', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockResolvedValue(`{
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

    expect(findTargetOptions('./', 'test:build')).toEqual({
      value: 42,
    });
  });

  it('should find target with configuration for Angular CLI projects', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockResolvedValue(`{
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

    expect(findTargetOptions('./', 'test:build:production')).toEqual({
      value: 42,
    });
  });

  it('should find target options for standalone project', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockResolvedValueOnce(`{
      "projects": {
        "test": "libs/test"
      }
    }`);
    (fs.readFileSync as jest.Mock).mockResolvedValueOnce(`{
      "targets": {
        "build": {
          "options": {
            "value": 42
          }
        }
      }
    }`);

    expect(findTargetOptions('./', 'test:build')).toEqual({
      value: 42,
    });
  });

  it('should find target options with configuration for standalone project', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockResolvedValueOnce(`{
      "projects": {
        "test": "libs/test"
      }
    }`);
    (fs.readFileSync as jest.Mock).mockResolvedValueOnce(`{
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

    expect(findTargetOptions('./', 'test:build:production')).toEqual({
      value: 42,
    });
  });

  it.todo('should recursively find workspace def');
});
