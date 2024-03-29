import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

export function createComponent(cmpType: Type<unknown>) {
  const fixture = TestBed.createComponent(cmpType);
  fixture.autoDetectChanges();

  return {
    fixture,
    nativeElement: fixture.nativeElement as HTMLElement,
  };
}
