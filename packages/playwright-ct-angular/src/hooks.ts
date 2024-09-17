/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { TestBedStatic } from '@angular/core/testing';

const __pw_hooks_before_mount = [];
const __pw_hooks_after_mount = [];

window['__pw_hooks_before_mount'] = __pw_hooks_before_mount;
window['__pw_hooks_after_mount'] = __pw_hooks_after_mount;

export function beforeMount<HOOKS>(
  callback: (params: {
    hooksConfig?: HOOKS;
    TestBed: TestBedStatic;
  }) => Promise<void>,
): void {
  __pw_hooks_before_mount.push(callback);
}

export function afterMount<HOOKS>(
  callback: (params: { hooksConfig?: HOOKS }) => Promise<void>,
): void {
  __pw_hooks_after_mount.push(callback);
}
