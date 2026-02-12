import '@angular/compiler';
import '@angular/material/prebuilt-themes/indigo-pink.css';
import { provideAnimations } from '@angular/platform-browser/animations';
import { beforeMount } from '@jscutlery/playwright-ct-angular/hooks';

beforeMount(async ({ TestBed }) => {
  TestBed.configureTestingModule({
    providers: [
      provideAnimations(),
    ],
  });
});
