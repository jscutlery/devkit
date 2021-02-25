export function getClassMethods(klass) {
  let methods = [];
  let prototype = klass.prototype;

  do {
    const keys = Reflect.ownKeys(prototype);
    methods = [...methods, ...keys];

    /* Get parent prototype. */
    prototype = prototype.__proto__;
  } while (prototype !== null && prototype !== Object.prototype);

  return Array.from(new Set(methods)).filter(
    (method) => method !== 'constructor'
  );
}
