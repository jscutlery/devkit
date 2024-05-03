import { readFileSync } from 'node:fs';

export class FileSystem {
  readJsonFile<T>(path: string): T {
    const content = readFileSync(path, 'utf-8');
    return JSON.parse(content);
  }
}

export const fileSystem = new FileSystem();
