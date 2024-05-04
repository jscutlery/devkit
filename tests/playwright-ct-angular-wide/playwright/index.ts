import { beforeMount } from '@jscutlery/playwright-ct-angular/hooks';
import { TOKEN } from '../src/inject.component';

export type HooksConfig = {
  injectToken?: boolean;
};

beforeMount<HooksConfig>(async ({ hooksConfig, TestBed }) => {
  if (hooksConfig?.injectToken) {
    TestBed.configureTestingModule({
      providers: [{ provide: TOKEN, useValue: { value: 42 } }],
    });
  }
});
