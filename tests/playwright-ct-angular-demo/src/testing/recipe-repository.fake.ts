import { RecipeRepositoryDef } from '../recipe-repository.service';
import { RecipeFilter } from '../recipe-filter';
import { defer, Observable, of } from 'rxjs';
import { Recipe } from '../recipe';

/**
 * Fake implementation that only supports keywords filtering.
 */
export class RecipeRepositoryFake implements RecipeRepositoryDef {
  private _recipes: Recipe[] = [];

  setRecipes(recipes: Recipe[]) {
    this._recipes = recipes;
  }

  search(filter?: RecipeFilter): Observable<Recipe[]> {
    return defer(() =>
      of(
        this._recipes.filter((recipe) =>
          filter?.keywords != null
            ? recipe.name.includes(filter?.keywords)
            : true
        )
      )
    );
  }
}
