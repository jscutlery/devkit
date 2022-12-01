import { Component, inject, Input } from '@angular/core';
import { Recipe } from './recipe';
import { RecipeRepository } from './recipe-repository.service';
import { RecipeSearchComponent } from './recipe-search.component';
import { RecipeRepositoryFake } from './testing/recipe-repository.fake';

@Component({
  standalone: true,
  imports: [RecipeSearchComponent],
  template: '<wm-recipe-search></wm-recipe-search>',
  providers: [
    RecipeRepositoryFake,
    {
      provide: RecipeRepository,
      useExisting: RecipeRepositoryFake
    }
  ]
})
export class RecipeSearchTestContainer {
  private _repo = inject(RecipeRepositoryFake);

  @Input() set recipes(recipes: Recipe[]) {
    this._repo.setRecipes(recipes);
  }
}
