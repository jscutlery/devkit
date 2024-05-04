import '@angular/compiler';
import 'zone.js';

import { getTestBed, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { Subscription } from 'rxjs';
import { Component, reflectComponentType } from '@angular/core';

/**
 * @typedef {{type: string} & import('./index').MountTemplateOptions} TemplateInfo
 * @typedef {{type: import('@angular/core').Type<unknown>} & import('./index').MountOptions | TemplateInfo} ComponentInfo
 */

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

window.playwrightMount = async (component, rootElement, hooksConfig) => {
  for (const hook of window.__pw_hooks_before_mount || [])
    await hook({ hooksConfig, TestBed });

  const fixture = await __pwRenderComponent(component);

  fixture.autoDetectChanges();
  await fixture.whenStable();

  for (const hook of window.__pw_hooks_after_mount || [])
    await hook({ hooksConfig });

  __pwFixtureRegistry.set(rootElement.id, fixture);
};

window.playwrightUnmount = async (rootElement) => {
  const fixture = __pwFixtureRegistry.get(rootElement.id);
  if (!fixture)
    throw new Error('Component was not mounted');

  /* Unsubscribe from all outputs. */
  for (const subscription of Object.values(__pwOutputSubscriptionRegistry.get(fixture) ?? {}))
    subscription?.unsubscribe();
  __pwOutputSubscriptionRegistry.delete(fixture);

  fixture.destroy();
  fixture.nativeElement.replaceChildren();
};

/**
 * @param {{type: import('@angular/core').Type<unknown>} & import('./index').MountOptions | {type: string} & import('./index').MountTemplateOptions} component
 */
window.playwrightUpdate = async (rootElement, component) => {
  const fixture = __pwFixtureRegistry.get(rootElement.id);
  if (!fixture)
    throw new Error('Component was not mounted');

  __pwUpdateProps(fixture, component);
  __pwUpdateEvents(fixture, component.on);

  fixture.autoDetectChanges();
  await fixture.whenStable();
};

/** @type {WeakMap<import('@angular/core/testing').ComponentFixture, Record<string, import('rxjs').Subscription>>} */
const __pwOutputSubscriptionRegistry = new WeakMap();

/** @type {Map<string, import('@angular/core/testing').ComponentFixture>} */
const __pwFixtureRegistry = new Map();

/**
 * @param {ComponentInfo} component
 */
async function __pwRenderComponent(component) {
  /** @type {import('@angular/core').Type<unknown>} */
  let componentClass;

  if (__pwIsTemplate(component)) {
    const templateInfo = /** @type {TemplateInfo} */(component);
    componentClass = Component({
      standalone: true,
      selector: 'pw-template-component',
      imports: templateInfo.imports,
      template: templateInfo.type
    })(class {
    });
  } else {
    componentClass = /** @type {import('@angular/core').Type<unknown>} */(component.type);
  }

  const componentMetadata = reflectComponentType(componentClass);
  if (!componentMetadata?.isStandalone)
    throw new Error('Only standalone components are supported');

  TestBed.configureTestingModule({
    imports: [componentClass],
    providers: component.providers
  });

  const fixture = TestBed.createComponent(componentClass);
  fixture.nativeElement.id = 'root';

  __pwUpdateProps(fixture, component);
  __pwUpdateEvents(fixture, component.on);

  return fixture;
}

/**
 * @param {import('@angular/core/testing').ComponentFixture} fixture
 * @param {ComponentInfo} componentInfo
 */
function __pwUpdateProps(fixture, componentInfo) {
  if (!componentInfo.props)
    return;

  if (__pwIsTemplate(componentInfo)) {
    Object.assign(fixture.componentInstance, componentInfo.props);
  } else {
    for (const [name, value] of Object.entries(componentInfo.props))
      fixture.componentRef.setInput(name, value);
  }
}

/**
 * @param {import('@angular/core/testing').ComponentFixture} fixture
 */
function __pwUpdateEvents(fixture, events = {}) {
  const outputSubscriptionRecord =
    __pwOutputSubscriptionRegistry.get(fixture) ?? {};
  for (const [name, listener] of Object.entries(events)) {
    /* Unsubscribe previous listener. */
    outputSubscriptionRecord[name]?.unsubscribe();

    /* Store new subscription. */
    outputSubscriptionRecord[name] = fixture.componentInstance[
      name
      ].subscribe((/** @type {unknown} */ event) => listener(event));
  }

  /* Update output subscription registry. */
  __pwOutputSubscriptionRegistry.set(fixture, outputSubscriptionRecord);
}

/**
 * @param {ComponentInfo} component
 */
function __pwIsTemplate(component) {
  return typeof component.type === 'string';
}
