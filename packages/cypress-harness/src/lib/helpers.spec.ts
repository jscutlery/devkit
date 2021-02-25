import { getClassMethods } from './helpers';

describe(getClassMethods.name, () => {
  it('should return all class methods with inheritance', () => {
    class A {
      a() {
        throw new Error('Not implemented');
      }
    }

    class B extends A {
      b() {
        throw new Error('Not implemented');
      }
    }

    expect(getClassMethods(B)).toEqual(['b', 'a']);
  });
});
