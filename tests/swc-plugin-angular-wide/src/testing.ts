import { Type } from '@angular/core';
import { TestBed, TestModuleMetadata } from '@angular/core/testing';

export function createComponent(cmpType: Type<unknown>, providers: TestModuleMetadata['providers'] = []) {
  const testingModule = TestBed.configureTestingModule({ providers });
  const fixture = testingModule.createComponent(cmpType);
  fixture.autoDetectChanges();

  return {
    fixture,
    nativeElement: fixture.nativeElement as HTMLElement,
  };
}
