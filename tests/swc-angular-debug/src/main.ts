import { transform } from '@swc/core';
import { swcAngularPreset } from '@jscutlery/swc-angular';
import { readFile } from 'node:fs/promises';

async function main(filePath: string) {
  if (!filePath) {
    console.log(`
      Please provide the path to a file to transform.

      Usage:

        nx debug swc-angular-debug <file>

    `);
    process.exit(1);
  }

  const output = await transform(
    await readFile(process.argv[2], 'utf-8'),
    swcAngularPreset(),
  );
  console.log(output.code);
}

main(process.argv[2]);
