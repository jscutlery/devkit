import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Recipe } from './recipe';
import { RecipeFilter } from './recipe-filter';
import { RecipeRepository } from './recipe-repository.service';
import { AsyncPipe, NgFor, NgForOf } from '@angular/common';
import { RecipeFilterComponent } from './recipe-filter.component';
import { CatalogComponent } from './shared-ui/catalog.component';
import { RecipePreviewComponent } from './recipe-preview.component';
import { MealPlanner } from './meal-planner.service';
import { MatButton, MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-search',
  imports: [
    AsyncPipe,
    CatalogComponent,
    MatButtonModule,
    NgForOf,
    RecipeFilterComponent,
    RecipePreviewComponent,
  ],
  template: ` <wm-recipe-filter
      (filterChange)="onFilterChange($event)"
    ></wm-recipe-filter>
    <wm-catalog>
      <wm-recipe-preview
        *ngFor="let item of items$ | async; trackBy: trackById"
        [recipe]="item.recipe"
      >
        <button
          [disabled]="(item.canAdd$ | async) === false"
          (click)="addRecipe(item.recipe)"
          class="add-recipe-button"
          color="primary"
          data-role="add-recipe"
          mat-stroked-button
        >
          ADD
        </button>
      </wm-recipe-preview>
    </wm-catalog>`,
  styles: [
    `
      .add-recipe-button {
        display: block;
        margin: auto;
      }
    `,
  ],
})
export class RecipeSearchComponent {
  filter$ = new BehaviorSubject<RecipeFilter>({});
  items$ = this.filter$.pipe(
    switchMap((filter) => this._recipeRepository.search(filter)),
    map((recipes) =>
      recipes.map((recipe) => ({
        canAdd$: this._mealPlanner.watchCanAddRecipe(recipe),
        recipe,
      }))
    )
  );

  private _mealPlanner = inject(MealPlanner);
  private _recipeRepository = inject(RecipeRepository);

  addRecipe(recipe: Recipe) {
    this._mealPlanner.addRecipe(recipe);
  }

  onFilterChange(filter: RecipeFilter) {
    this.filter$.next(filter);
  }

  trackById(_: number, { recipe }: { recipe: Recipe }) {
    return recipe.id;
  }
}
