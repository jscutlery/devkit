import { beforeMount } from '@jscutlery/playwright-ct-angular/hooks';
import 'zone.js';
import { TOKEN } from '../src/inject.component';

export type HooksConfig = {
  provideToken?: boolean;
  overrideToken?: boolean;
};

beforeMount<HooksConfig>(async ({ hooksConfig, TestBed }) => {
  if (hooksConfig?.provideToken) {
    TestBed.configureTestingModule({
      providers: [{ provide: TOKEN, useValue: { value: '42' } }],
    });
  }

  if (hooksConfig?.overrideToken) {
    TestBed.inject(TOKEN).value = 'overriden';
  }
});
