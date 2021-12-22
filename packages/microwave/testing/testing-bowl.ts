/**
 * Schedules a beforeEach & afterEach to initialize and destroy
 * a context named "bowl".
 *
 * @param setUp a function that will run before each test to create the bowl context
 * @param args.tearDown a tear down function to reset the bowl
 * @returns a testinb owl
 */
export function createTestingBowl<T>(
  setUp: () => T | Promise<T>,
  {
    tearDown,
  }: {
    tearDown?: () => void | Promise<void> | Partial<T> | Promise<Partial<T>>;
  } = {}
): T {
  const bowl: Partial<T> = {};

  beforeEach(async () => {
    Object.assign(bowl, await setUp());
  });

  afterEach(async () => {
    if (tearDown == null) {
      return;
    }

    Object.assign(bowl, await tearDown());
  });

  /* We force the type to T as we are quite sure that beforeEach
   * will run before any usage.
   * This will avoid optional chaining and type hinting. */
  return bowl as T;
}
