import { createRecipe } from '../recipe';
import { Recipe } from '../recipe';

class RecipeMother {
  private _recipePictures = [
    {
      keyword: 'beer',
      pictureUri:
        'https://www.liquor.com/thmb/-BGrCOgQV6D2UV-qcqFRLHY7uhs=/2037x1471/filters:fill(auto,1)/GettyImages-519728153-7dca4b18c59f4b1fa3654e4d5c9db884.jpg',
    },
    {
      keyword: 'burger',
      pictureUri:
        'https://www.ninkasi.fr/wp-content/uploads/2022/06/header_burger.jpg',
    },
    {
      keyword: 'maultaschen',
      pictureUri:
        'https://images.lecker.de/schwaebische-maultaschen-mit-kraeutersahne-ueberbacke-F652701,id=40cad7ff,b=lecker,w=440,h=440,cg=c.jpg',
    },
  ];

  withBasicInfo(name: string): NestedRecipeMother {
    const slug = name
      .toLowerCase()
      .replace(/ +/g, '-')
      .replace(/([^\w-])/g, '');
    return new NestedRecipeMother(
      createRecipe({
        id: `rec_${slug}`,
        name,
        description: `A delicious ${name}.`,
        ingredients: [],
        pictureUri: this._derivatePictureUri(slug),
        steps: [],
      })
    );
  }

  private _derivatePictureUri(slug: string) {
    const recipePicture = this._recipePictures.find((recipePicture) =>
      slug.includes(recipePicture.keyword)
    );
    return recipePicture
      ? recipePicture.pictureUri
      : `https://placeholder.marmicode.io/${slug}.jpg`;
  }
}

class NestedRecipeMother {
  constructor(private _recipe: Readonly<Recipe>) {}

  build() {
    return this._recipe;
  }

  withSomeIngredients(): NestedRecipeMother {
    return this._extendWith({
      ingredients: [
        {
          name: 'Salt',
        },
        {
          name: 'Pepper',
        },
      ],
    });
  }

  private _extendWith(recipe: Partial<Recipe>) {
    return new NestedRecipeMother({ ...this._recipe, ...recipe });
  }
}

export const recipeMother = new RecipeMother();
