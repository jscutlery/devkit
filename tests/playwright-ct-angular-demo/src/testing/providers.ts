import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const TESTING_PROVIDERS = [importProvidersFrom(BrowserAnimationsModule)];
