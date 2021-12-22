import { TestBed } from '@angular/core/testing';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { createTestingBowl } from '../../../testing/testing-bowl';
import { decorateComponent, DecoratorHooks } from './decorator';

describe(decorateComponent.name, () => {
  const bowl = createTestingBowl(setUp);

  it('should trigger real ngOnInit', () => {
    const { cmp, ngOnInit } = bowl;
    cmp.ngOnInit();
    expect(ngOnInit).toBeCalledTimes(1);
  });

  it('should trigger real ngOnDestroy', () => {
    const { cmp, ngOnDestroy } = bowl;
    cmp.ngOnDestroy();
    expect(ngOnDestroy).toBeCalledTimes(1);
  });

  it('should trigger onCreate', () => {
    const { mockHooks } = bowl;
    expect(mockHooks.onCreate).toBeCalledTimes(1);
  });

  it.todo('🚧 should trigger onInit');

  it('should trigger onDestroy', () => {
    const { cmp, mockHooks } = bowl;
    cmp.ngOnDestroy();
    expect(mockHooks.onDestroy).toBeCalledTimes(1);
  });

  it('should trigger onPropertyDeclare', () => {
    const { cmp, mockHooks } = bowl;
    expect(mockHooks.onPropertyDeclare).toBeCalledTimes(1);
    expect(mockHooks.onPropertyDeclare).toBeCalledWith(
      cmp,
      'something',
      undefined
    );
  });

  it('should trigger onPropertyGet', () => {
    const { cmp, mockHooks } = bowl;

    mockHooks.onPropertyGet.mockReturnValue(42);

    expect(cmp.something).toEqual(42);

    expect(mockHooks.onPropertyGet).toBeCalledTimes(1);
    expect(mockHooks.onPropertyGet).toBeCalledWith(cmp, 'something');
  });

  it('should trigger onPropertySet', () => {
    const { cmp, mockHooks } = bowl;

    cmp.something = 42;

    expect(mockHooks.onPropertySet).toBeCalledTimes(1);
    expect(mockHooks.onPropertySet).toBeCalledWith(cmp, 'something', 42);
  });

  function setUp() {
    const ngOnInit = jest.fn();
    const ngOnDestroy = jest.fn();

    @Component({
      template: '',
    })
    class MyComponent implements OnInit, OnDestroy {
      something?: number = undefined;

      ngOnInit() {
        ngOnInit();
      }

      ngOnDestroy() {
        ngOnDestroy();
      }
    }

    const mockHooks: jest.Mocked<DecoratorHooks<MyComponent>> = {
      onCreate: jest.fn(),
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
