import { TestBed } from '@angular/core/testing';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { createTestingBowl } from '../../../testing/testing-bowl';
import { decorateComponent, DecoratorHooks } from './decorator';
describe(decorateComponent.name, () => {
  const bowl = createTestingBowl(setUp);
  it('should trigger real ngOnInit', () => {
    const { cmp, ngOnInit } = bowl;
    cmp.ngOnInit();
    expect(ngOnInit).toHaveBeenCalledTimes(1);
    /* Make sure instance is bound to the wrapped method. */
    expect(ngOnInit).toHaveBeenCalledWith(cmp);
  });
  it('should trigger real ngOnDestroy', () => {
    const { cmp, ngOnDestroy } = bowl;
    cmp.ngOnDestroy();
    expect(ngOnDestroy).toHaveBeenCalledTimes(1);
    /* Make sure instance is bound to the wrapped method. */
    expect(ngOnDestroy).toHaveBeenCalledWith(cmp);
  });
  it('should trigger onCreate', () => {
    const { mockHooks } = bowl;
    expect(mockHooks.onCreate).toHaveBeenCalledTimes(1);
  });
  it('should trigger onInit', () => {
    const { cmp, mockHooks } = bowl;
    cmp.ngOnInit();
    expect(mockHooks.onInit).toHaveBeenCalledTimes(1);
  });
  it('should trigger onDestroy', () => {
    const { cmp, mockHooks } = bowl;
    cmp.ngOnDestroy();
    expect(mockHooks.onDestroy).toHaveBeenCalledTimes(1);
  });
  it('should trigger onPropertyDeclare', () => {
    const { cmp, mockHooks } = bowl;
    expect(mockHooks.onPropertyDeclare).toHaveBeenCalledTimes(1);
    expect(mockHooks.onPropertyDeclare).toHaveBeenCalledWith(
      cmp,
      'something',
      undefined,
    );
  });
  it('should trigger onPropertyGet', () => {
    const { cmp, mockHooks } = bowl;
    mockHooks.onPropertyGet.mockReturnValue(42);
    expect(cmp.something).toEqual(42);
    expect(mockHooks.onPropertyGet).toHaveBeenCalledTimes(1);
    expect(mockHooks.onPropertyGet).toHaveBeenCalledWith(cmp, 'something');
  });
  it('should trigger onPropertySet', () => {
    const { cmp, mockHooks } = bowl;
    cmp.something = 42;
    expect(mockHooks.onPropertySet).toHaveBeenCalledTimes(1);
    expect(mockHooks.onPropertySet).toHaveBeenCalledWith(cmp, 'something', 42);
  });
  it('should not call any hook except onCreate & onPropertyDeclare when created', () => {
    const { mockHooks } = bowl;
    expect(mockHooks.onDestroy).not.toHaveBeenCalled();
    expect(mockHooks.onPropertyGet).not.toHaveBeenCalled();
    expect(mockHooks.onPropertySet).not.toHaveBeenCalled();
  });
  function setUp() {
    const ngOnInit = jest.fn();
    const ngOnDestroy = jest.fn();
    @Component({
      template: '',
      standalone: false,
    })
    class MyComponent implements OnInit, OnDestroy {
      something?: number = undefined;
      ngOnInit() {
        /* Passing the instance to make sure that the method is bound properly. */
        ngOnInit(this);
      }
      ngOnDestroy() {
        /* Passing the instance to make sure that the method is bound properly. */
        ngOnDestroy(this);
      }
    }
    const mockHooks: jest.Mocked<DecoratorHooks<MyComponent>> = {
      onCreate: jest.fn(),
      onInit: jest.fn(),
      onDestroy: jest.fn(),
      onPropertyDeclare: jest.fn(),
      onPropertyGet: jest.fn(),
      onPropertySet: jest.fn(),
    };
    decorateComponent(MyComponent, mockHooks);
    TestBed.configureTestingModule({
      providers: [MyComponent, { provide: ChangeDetectorRef, useValue: {} }],
    });
    const cmp = TestBed.inject(MyComponent);
    return {
      cmp,
      mockHooks,
      ngOnInit,
      ngOnDestroy,
    };
  }
});
