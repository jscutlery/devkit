/**
 * An alternative to ChangeDetectorRef to stay loosely coupled.
 * Plus, this functions can be destructured as they don't use `this`.
 * Let's try to reduce the surface and not expose all functions
 * if we don't need them.
 */
export interface ChangeDetectionFns {
  detach(): void;
  detectChanges(): void;
}
