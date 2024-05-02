/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import path from 'node:path';
import { NodePath, types as t, type PluginObj } from '@babel/core';
import { declare } from '@babel/helper-plugin-utils';
import { setTransformData } from 'playwright/lib/transform/transform';

let classComponentNames: Set<string>;
let importInfos: Map<string, ImportInfo>;

export default declare((api) => {
  api.assertVersion(7);

  return {
    name: 'jscutlery-playwright-angular-transform',
    visitor: {
      Program: {
        enter(path) {
          classComponentNames = collectClassMountUsages(path);
          importInfos = new Map();
        },
        exit(path) {
          // @eslint-disable-next-line @typescript-eslint/no-explicit-any
          let firstDeclaration: any;
          // @eslint-disable-next-line @typescript-eslint/no-explicit-any
          let lastImportDeclaration: any;
          path.get('body').forEach((p) => {
            if (p.isImportDeclaration()) lastImportDeclaration = p;
            else if (!firstDeclaration) firstDeclaration = p;
          });
          const insertionPath = lastImportDeclaration || firstDeclaration;
          if (!insertionPath) return;

          for (const [localName, componentImport] of [
            ...importInfos.entries(),
          ].reverse()) {
            insertionPath.insertAfter(
              t.variableDeclaration('const', [
                t.variableDeclarator(
                  t.identifier(localName),
                  t.objectExpression([
                    t.objectProperty(
                      t.identifier('__pw_type'),
                      t.stringLiteral('importRef'),
                    ),
                    t.objectProperty(
                      t.identifier('id'),
                      t.stringLiteral(componentImport.id),
                    ),
                  ]),
                ),
              ]),
            );
          }
          setTransformData('playwright-ct-core', [...importInfos.values()]);
        },
      },
      ImportDeclaration(p) {
        const importNode = p.node;
        if (!t.isStringLiteral(importNode.source)) {
          return;
        }

        // Convert JS imports that are used as components in JSX expressions into refs.
        let importCount = 0;
        for (const specifier of importNode.specifiers) {
          if (t.isImportNamespaceSpecifier(specifier)) continue;
          const { localName, info } = importInfo(
            importNode,
            specifier as t.ImportSpecifier | t.ImportDefaultSpecifier,
            // @eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.filename!,
          );
          if (classComponentNames.has(localName)) {
            importInfos.set(localName, info);
            ++importCount;
          }
        }

        // All the imports were from JSX => delete.
        if (importCount && importCount === importNode.specifiers.length) {
          p.skip();
          p.remove();
        }
      },
    },
  } satisfies PluginObj;
});

function collectClassMountUsages(path: NodePath<t.Program>): Set<string> {
  const names = new Set<string>();
  let isInMountCall = false;
  path.traverse({
    CallExpression: {
      enter(p) {
        if (t.isIdentifier(p.node.callee) && p.node.callee.name === 'mount') {
          isInMountCall = true;
          return;
        }

        /* Ignore any function or method calls in `mount` args.
         * e.g. {inputs: {recipe: recipeMother.withBasicInfo()}}. */
        if (isInMountCall) {
          p.skip();
        }
      },
      exit() {
        isInMountCall = false;
      },
    },
    Identifier(p) {
      if (isInMountCall) {
        names.add(p.node.name);
      }
    },
  });
  return names;
}

type ImportInfo = {
  id: string;
  filename: string;
  importSource: string;
  remoteName: string | undefined;
};

function importInfo(
  importNode: t.ImportDeclaration,
  specifier: t.ImportSpecifier | t.ImportDefaultSpecifier,
  filename: string,
): {
  localName: string;
  info: ImportInfo;
} {
  const importSource = importNode.source.value;
  const idPrefix = path
    .join(filename, '..', importSource)
    .replace(/[^\w_\d]/g, '_');

  const result: ImportInfo = {
    id: idPrefix,
    filename,
    importSource,
    remoteName: undefined,
  };

  // @eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imported = (specifier as any).imported;

  if (!t.isImportDefaultSpecifier(specifier)) {
    if (t.isIdentifier(imported)) {
      result.remoteName = imported.name;
    } else {
      result.remoteName = imported.value;
    }
  }

  if (result.remoteName) result.id += '_' + result.remoteName;
  return { localName: specifier.local.name, info: result };
}
