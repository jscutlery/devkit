import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { createRecipe, Recipe } from './recipe';
import { RecipeFilter } from './recipe-filter';

export interface RecipeRepositoryDef {
  search(filter?: RecipeFilter): Observable<Recipe[]>;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeRepository implements RecipeRepositoryDef {
  private _recipes = [
    createRecipe({
      id: 'cauliflower-pomegranate-and-pistachio-salad',
      description:
        'It was a little moment of revelation, I remember, when I first combined roasted cauliflower and raw grated cauliflower in the same dish. So different from one another, but working so well combined. This is lovely as it is, served as part of a spread, or spooned alongside some roast chicken or lamb. Don’t throw away the leaves of the cauliflower here. They’re lovely to eat, roasted and crisp, or grated raw as you would the rest of the cauliflower. If you want to get ahead, roast the cauliflower up to 4–6 hours in advance. Keep at room temperature and then just combine with the remaining ingredients when ready to serve.',
      name: 'Cauliflower, pomegranate and pistachio salad',
      ingredients: [
        {
          quantity: { amount: 1, unit: 'unit' },
          name: 'large cauliflower (800g)',
        },
        {
          quantity: { amount: 1, unit: 'unit' },
          name: 'medium onion, roughly sliced (130g)',
        },
        { quantity: { amount: 80, unit: 'ml' }, name: 'olive oil' },
        {
          quantity: { amount: 25, unit: 'g' },
          name: 'parsley, roughly chopped',
        },
        { quantity: { amount: 10, unit: 'g' }, name: 'mint, roughly chopped' },
        {
          quantity: { amount: 10, unit: 'g' },
          name: 'tarragon, roughly chopped',
        },
        { name: 'seeds from ½ medium pomegranate (80g)' },
        {
          quantity: { amount: 40, unit: 'g' },
          name: 'pistachio kernels, lightly toasted and roughly chopped',
        },
        { quantity: { amount: 1, unit: 'tsp' }, name: 'ground cumin' },
        { quantity: { amount: 1, unit: 'unit' }, name: '½ tbsp lemon juice' },
        { name: 'salt' },
      ],
      pictureUri: this._getPictureUri(
        'Cauliflower,-pomegranate-and-pistachio-salad.jpg'
      ),
      steps: [
        'Preheat the oven to 200°C fan.',
        'Coarsely grate a third of the cauliflower and set aside in a bowl. Break the remaining cauliflower into florets, roughly 3cm wide, and add these to a separate bowl with the cauliflower leaves, if you have any, and onion. Toss everything together with 2 tablespoons of oil and ¼ teaspoon of salt, then spread out on a large parchment-lined baking tray. Roast for about 20 minutes, until cooked through and golden-brown. Remove from the oven and set aside to cool.',
        'Once cool, put the roasted vegetables into a large bowl with the 50ml oil, the grated cauliflower and the remaining ingredients, along with ¼ teaspoon of salt. Toss gently, just to combine, then transfer to a platter and serve.',
      ],
    }),
    createRecipe({
      id: 'braised-eggs-with-leek-and-za-atar',
      description:
        'This is a quick way to get a very comforting meal on the table in a wonderfully short amount of time. It’s a dish as happily eaten for brunch, with coffee, as it is for a light supper with some crusty white bread and a glass of wine. The leeks and spinach can be made up to a day ahead and kept in the fridge, ready for the eggs to be cracked in and braised.',
      name: 'Braised eggs with leek and za’atar',
      ingredients: [
        { quantity: { amount: 30, unit: 'g' }, name: 'unsalted butter' },
        { quantity: { amount: 2, unit: 'tbsp' }, name: 'olive oil' },
        {
          quantity: { amount: 2, unit: 'unit' },
          name: 'large leeks (or 4 smaller), trimmed and cut into ½ cm slices (530g)',
        },
        {
          quantity: { amount: 1, unit: 'tsp' },
          name: 'cumin seeds, toasted and lightly crushed',
        },
        {
          quantity: { amount: 2, unit: 'unit' },
          name: 'small preserved lemons, pips discarded, skin and flesh finely chopped (30g)',
        },
        {
          quantity: { amount: 300, unit: 'ml' },
          name: 'vegetable stock 200g baby spinach leaves',
        },
        { quantity: { amount: 6, unit: 'unit' }, name: 'large eggs' },
        {
          quantity: { amount: 90, unit: 'g' },
          name: 'feta, broken into 2cm pieces',
        },
        { quantity: { amount: 1, unit: 'tbsp' }, name: "za'atar" },
        { name: 'salt and black pepper' },
      ],
      pictureUri: this._getPictureUri('Braised-eggs-with-leek-and-zaatar.jpg'),
      steps: [
        'Put the butter and 1 tablespoon of oil into a large sauté pan, for which you have a lid, and place on a medium high heat. Once the butter starts to foam, add the leeks, ½ teaspoon of salt and plenty of pepper. Fry for 3 minutes, stirring frequently, until the leeks are soft. Add the cumin, lemon and vegetable stock and boil rapidly for 4–5 minutes, until most of the stock has evaporated. Fold in the spinach and cook for a minute, until wilted, then reduce the heat to medium.',
        'Use a large spoon to make 6 indentations in the mixture and break one egg into each space. Sprinkle the eggs with a pinch of salt, dot the feta around the eggs, then cover the pan. Simmer for 4–5 minutes, until the egg whites are cooked but the yolks are still runny.',
        'Mix the za’atar with the remaining tablespoon of oil and brush over the eggs. Serve at once, straight from the pan.',
      ],
    }),
    createRecipe({
      id: 'buckwheat-and-ricotta-hotcakes-with-preserved-lemon-salsa',
      description:
        'I prefer to use buckwheat groats for this batter, rather than buckwheat flour: they have a more intense flavour, as well as a more interesting texture. Pickle the onions the night before serving, if you can: their flavour and colour will both get more vibrant with time. If you want, top with a fried egg, though if you do so, you won’t need the extra ricotta to serve.',
      name: 'Buckwheat and ricotta hotcakes with preserved lemon salsa',
      ingredients: [
        { name: 'For the hotcakes' },
        {
          quantity: { amount: 150, unit: 'g' },
          name: 'raw buckwheat groats, soaked in plenty of cold water for 3-4 hours (any less, and they won&rsquo;t soften enough, longer and they will disintegrate)',
        },
        { quantity: { amount: 150, unit: 'ml' }, name: 'whole milk' },
        {
          quantity: { amount: 20, unit: 'g' },
          name: 'parmesan, finely grated',
        },
        { quantity: { amount: 50, unit: 'g' }, name: 'basil leaves' },
        { quantity: { amount: 30, unit: 'g' }, name: 'dill' },
        {
          quantity: { amount: 2, unit: 'unit' },
          name: 'eggs, whites and yolks separated',
        },
        { name: 'Salt and black pepper' },
        {
          quantity: { amount: 140, unit: 'g' },
          name: 'ricotta (or just 60g if serving with fried eggs: see introduction)',
        },
        {
          quantity: { amount: 40, unit: 'g' },
          name: 'unsalted butter, for frying',
        },
        { name: 'For the pickled onion salsa' },
        { quantity: { amount: 60, unit: 'ml' }, name: 'white-wine vinegar' },
        { quantity: { amount: 2, unit: 'tsp' }, name: 'sumac' },
        { name: '¾ tsp caster sugar' },
        { name: 'Finely shaved peel of 1 lime' },
        {
          quantity: { amount: 1, unit: 'unit' },
          name: 'garlic clove, roughly bashed with the flat of a knife but left unpeeled',
        },
        { name: '½ red onion, peeled and cut into 2- to 3mm-thick slices' },
        {
          quantity: { amount: 1, unit: 'unit' },
          name: '½ tbsp olive oil, plus extra to serve',
        },
        {
          quantity: { amount: 1, unit: 'unit' },
          name: '-2 small preserved lemons, flesh cut off and discarded, skin chopped into 0.5cm dice',
        },
        {
          quantity: { amount: 10, unit: 'g' },
          name: 'coriander leaves, chopped',
        },
      ],
      pictureUri: this._getPictureUri(
        'Buckwheat-and-ricotta-hotcakes-with-preserved-lemon-salsa.jpg'
      ),
      steps: [
        'Start with the salsa. Combine the vinegar, sumac, sugar, lime peel, garlic and onion in a medium bowl with half a teaspoon of salt, then leave to pickle for at least three hours (and preferably overnight).',
        'To make the hotcake batter, put the buckwheat groats, milk, parmesan, basil, dill and egg yolks in a food processor with half a teaspoon of salt. Whizz on high speed until you have a uniform batter, then tip into a large bowl, stir in 60g ricotta and set to one side. Don&rsquo;t worry if the batter discolours after a few minutes: it will brighten up again once fried.',
        'Whisk the egg whites to stiff peaks, then, using a spatula, gradually and gently fold them into the batter: you want to keep as much air in the mixture as possible, so take care not to overwork it.',
        'Drain the pickled onions, discarding the lime peel and garlic, and put them in a medium bowl with the oil, preserved lemon, coriander and a generous grind of pepper. Stir to combine and set aside.',
        'Melt 10g butter in a large, nonstick frying pan on a medium-high heat. You&rsquo;ll need about three tablespoons of batter per pancake, and you&rsquo;ll need to cook them in batches of two or three at a time, spaced well apart. Once the pancakes are in the pan, fry them for about four minutes, turning halfway, until golden on both sides, then transfer to a plate lined with kitchen towel to drain. Keep warm while you repeat with the remaining batter, adding more butter as and when you need it. (If you plan to top your hotcakes with fried eggs, make these once all the batter is cooked.)',
        'Serve two or three warm pancakes a portion with the salsa and remaining ricotta (if you&rsquo;re not adding an egg) alongside. Add a final drizzle of olive oil and a generous grind of pepper, and serve hot.',
      ],
    }),
    createRecipe({
      id: 'stuffed-romano-peppers-with-ricotta-and-mascarpone',
      description: 'Use the best quality ricotta you can find for this.',
      name: 'Stuffed Romano peppers with ricotta and mascarpone',
      ingredients: [
        {
          quantity: { amount: 6, unit: 'unit' },
          name: 'Romano peppers (650g)',
        },
        { quantity: { amount: 200, unit: 'g' }, name: 'ricotta' },
        {
          quantity: { amount: 100, unit: 'g' },
          name: 'mascarpone or cream cheese',
        },
        {
          quantity: { amount: 40, unit: 'g' },
          name: 'pine nuts, lightly toasted',
        },
        {
          quantity: { amount: 10, unit: 'g' },
          name: 'fresh oregano leaves, roughly chopped',
        },
        {
          quantity: { amount: 1, unit: 'tsp' },
          name: 'grated lemon zest, plus 1 tsp juice',
        },
        { quantity: { amount: 3, unit: 'tbsp' }, name: 'olive oil' },
        {
          quantity: { amount: 1, unit: 'tsp' },
          name: 'best-quality balsamic vinegar',
        },
        {
          quantity: { amount: 1, unit: 'unit' },
          name: 'small green chilli, cut into paper-thin slices',
        },
        { name: 'Salt and black pepper' },
      ],
      pictureUri: this._getPictureUri(
        'Stuffed-Romano-peppers-with-ricotta-and-mascarpone.jpg'
      ),
      steps: [
        'Preheat the oven to 180C.',
        'Use a little knife to make a small vertical incision – about 6 centimeters long – from the top towards the end of each pepper. You will use this incision to scoop out the seeds later. Arrange the pepper on a roasting tray and place in the oven for 30 minutes, until soft. Remove and set aside to cool before using a small spoon to carefully extract and discard the seeds. The aim is to leave the stem on the peppers when they are stuffed so take your time here: it’s a fiddly job. Peel the skin off the peppers – again, don’t rush here – and set aside on a kitchen paper-lined plate to dry.',
        'To make the filling place the cheeses, nuts, oregano, lemon zest, lemon juice and 1 teaspoon of olive oil in a large bowl. Add half a teaspoon of salt and a good grind of black pepper and whisk well. Spoon about 2 tablespoons of the cheese mixture into each pepper and press evenly inside. Don’t worry if the incision increases in the process: you can use your hands to seal the pepper.',
        'Wipe the peppers clean and place them on individual serving plates. Drizzle 2 teaspoons of olive oil around each pepper and then dot the oil with a few drops of the balsamic. Sprinkle over a few slices of the green chilli and serve.',
      ],
    }),
    createRecipe({
      id: 'slow-cooked-chicken-with-a-crisp-corn-crust',
      description:
        'This is a wonderful meal on an autumn day, served with a crisp green salad. The slow-cooked chicken is packed full of flavour and the crust – gluten-free, rich and corny – makes for a welcome (and lighter) change to a heavier mash.\nYou can make the chicken well in advance if you want to get ahead: it keeps in the fridge for up to 3 days or can be frozen for 1 month. You want it to go into the oven defrosted, though, so it will need thawing out of the freezer. The batter needs to be made fresh and spooned on top of the chicken just before the dish gets baked, but it then can just go back in the oven. It can also be baked a few hours in advance – just warm through for 10 minutes, covered in foil, before serving. I love the combination of the chicken and the corn, but the chicken also works well as it is, served on top of rice, in a wrap or with a buttery jacket potato.',
      name: 'Slow-cooked chicken with a crisp corn crust',
      ingredients: [
        { quantity: { amount: 3, unit: 'tbsp' }, name: 'olive oil' },
        {
          quantity: { amount: 3, unit: 'unit' },
          name: 'red onions, thinly sliced (500g)',
        },
        {
          quantity: { amount: 2, unit: 'unit' },
          name: 'garlic cloves, crushed',
        },
        { quantity: { amount: 3, unit: 'tbsp' }, name: 'rose harissa (60g)' },
        { quantity: { amount: 2, unit: 'tsp' }, name: 'sweet smoked paprika' },
        {
          quantity: { amount: 850, unit: 'g' },
          name: 'chicken thighs, skinless and boneless (about 9&ndash;10 thighs)',
        },
        { quantity: { amount: 200, unit: 'ml' }, name: 'passata' },
        {
          quantity: { amount: 5, unit: 'unit' },
          name: 'large tomatoes, quartered (400g)',
        },
        {
          quantity: { amount: 200, unit: 'g' },
          name: 'jarred roasted red peppers, drained and cut into 2cm thick rounds',
        },
        {
          quantity: { amount: 15, unit: 'g' },
          name: 'dark chocolate (70% cocoa solids)',
        },
        {
          quantity: { amount: 20, unit: 'g' },
          name: 'coriander, roughly chopped',
        },
        { name: 'salt and black pepper' },
        { name: 'SWEETCORN BATTER' },
        {
          quantity: { amount: 70, unit: 'g' },
          name: 'unsalted butter, melted',
        },
        {
          quantity: { amount: 500, unit: 'g' },
          name: 'corn kernels, fresh or frozen and defrosted (shaved corn kernels from 4 large corn cobs, if starting from fresh)',
        },
        { quantity: { amount: 3, unit: 'tbsp' }, name: 'whole milk' },
        {
          quantity: { amount: 3, unit: 'unit' },
          name: 'eggs, yolks and whites separated',
        },
      ],
      pictureUri: this._getPictureUri(
        'Slow-cooked-chicken-with-a-crisp-corn-crust.jpg'
      ),
      steps: [
        'Heat the oil in a large sauté pan, for which you have a lid, on a medium high heat. Add the onions and fry for 8–9 minutes, stirring a few times, until caramelised and soft. Reduce the heat to medium and add the garlic, harissa, paprika, chicken, 1 teaspoon of salt and a good grind of black pepper. Cook for 5 minutes, stirring frequently, then add the passata and tomatoes. Pour over 350ml of water, bring to the boil, then simmer on a medium heat, covered, for 30 minutes, stirring every once in a while.',
        'Add the peppers and chocolate and continue to simmer for another 35–40 minutes, with the pan now uncovered, stirring frequently, until the sauce is getting thick and the chicken is falling apart. Remove from the heat and stir in the coriander. If you are serving the chicken as it is (as a stew without the batter), it’s ready to serve (or freeze, once it’s come to room temperature) at this stage. If you are making the corn topping, spoon the chicken into a ceramic baking dish – one with high sides that measures about 20 x 30cm – and set aside.',
        'Preheat the oven to 180°C fan.',
        'Pour the butter into a blender with the corn, milk, egg yolks and ¾ teaspoon salt. Blitz for a few seconds, to form a rough paste, then spoon into a large bowl. Place the egg whites in a separate clean bowl and whisk to form firm peaks. Fold these gently into the runny corn mixture until just combined, then pour the mix evenly over the chicken.',
        'Bake for 35 minutes, until the top is golden-brown: keep an eye on it after 25 minutes to make sure the top is not taking on too much colour: you might need to cover it with tin foil for the final 10 minutes. Remove from the oven and set aside for 10 minutes before serving.',
      ],
    }),
    createRecipe({
      id: 'pappardelle-with-rose-harissa-black-olives-and-capers',
      description:
        'Pappare means ‘to gobble up’, in Italian, which is the destiny of this dish (particularly in Tara’s house, where her husband Chris makes it most Sunday nights). I like it spicy, but the quantity of harissa can easily be reduced. Make the sauce 3 days ahead if you like and keep in the fridge until needed.',
      name: 'Pappardelle with rose harissa, black olives and capers',
      ingredients: [
        { quantity: { amount: 2, unit: 'tbsp' }, name: 'olive oil' },
        {
          quantity: { amount: 1, unit: 'unit' },
          name: 'large onion, thinly sliced (220g)',
        },
        { quantity: { amount: 3, unit: 'tbsp' }, name: 'rose harissa' },
        {
          name: '(or 50% more or less, depending on variety: see p.301) (45g)',
        },
        {
          quantity: { amount: 400, unit: 'g' },
          name: 'cherry tomatoes, halved',
        },
        {
          quantity: { amount: 55, unit: 'g' },
          name: 'pitted Kalamata olives, torn in half',
        },
        { quantity: { amount: 20, unit: 'g' }, name: 'baby capers' },
        {
          quantity: { amount: 500, unit: 'g' },
          name: 'dried pappardelle pasta (or another wide, flat pasta)',
        },
        {
          quantity: { amount: 15, unit: 'g' },
          name: 'parsley, roughly chopped',
        },
        { quantity: { amount: 120, unit: 'g' }, name: 'Greek-style yoghurt' },
        { name: 'salt' },
      ],
      pictureUri: this._getPictureUri(
        'Pappardelle-with-rose-harissa,-black-olives-and-capers.jpg'
      ),
      steps: [
        'Put the oil into a large sauté pan, for which you have a lid, and place on a medium high heat. Once hot, add the onion and fry for 8 minutes, stirring every once in a while, until soft and caramelised. Add the harissa, tomatoes, olives, capers and ½ teaspoon of salt and continue to fry for 3–4 minutes, stirring frequently, until the tomatoes start to break down. Add 200ml of water and stir through. Once boiling, reduce the heat to medium low, cover the pan and simmer for 10 minutes. Remove the lid of the sauce and continue to cook for 4–5 minutes, until the sauce is thick and rich. Stir in 10g of the parsley and set aside.',
        'Meanwhile, fill a large pot with plenty of salted water and place on a high heat. Once boiling, add the pappardelle and cook according to the packet instructions, until al dente. Drain well.',
        'Return the pasta to the pot along with the harissa sauce and 1/8 teaspoon of salt. Mix together well, then divide between four shallow bowls. Serve hot, with a spoonful of yoghurt and a final sprinkle of parsley.',
      ],
    }),
    createRecipe({
      id: 'baked-ricotta-with-figs-and-lavender-honey',
      description:
        "Here's an elegant starter that is almost effortless. Choose ripe figs and adjust the amount of honey to their sweetness. Garnish the plate with fresh or dried lavender if you have some and want a visually impressive result.",
      name: 'Baked ricotta with figs and lavender honey',
      ingredients: [
        { quantity: { amount: 500, unit: 'g' }, name: 'good quality ricotta' },
        { name: '½ tsp salt' },
        { name: 'Freshly ground black pepper' },
        { quantity: { amount: 3, unit: 'tbsp' }, name: 'olive oil' },
        {
          quantity: { amount: 1, unit: 'tsp' },
          name: 'chopped rosemary, plus extra sprigs for garnish',
        },
        {
          quantity: { amount: 4, unit: 'unit' },
          name: 'fresh figs, cut into quarters or six',
        },
        {
          quantity: { amount: 3, unit: 'tbsp' },
          name: 'lavender honey or heather honey',
        },
        {
          quantity: { amount: 120, unit: 'g' },
          name: 'mixed bitter salad leaves',
        },
        {
          quantity: { amount: 4, unit: 'unit' },
          name: 'slices sourdough bread, toasted',
        },
        { name: 'For the dressing:' },
        { quantity: { amount: 3, unit: 'tbsp' }, name: 'olive oil' },
        {
          quantity: { amount: 1, unit: 'tbsp' },
          name: 'lavender honey or heather honey',
        },
        { quantity: { amount: 1, unit: 'unit' }, name: 'tbsp' },
        { name: 'red wine vinegar' },
        { name: 'Pinch salt' },
      ],
      pictureUri: this._getPictureUri(
        'Baked-ricotta-with-figs-and-lavender-honey.jpg'
      ),
      steps: [
        'Preheat the oven to 180C/350F/ gas mark 4. Put the ricotta in the centre of a clean tea towel, squeeze to get rid of some of the liquid, then transfer the cheese to a bowl, season and mix well.',
        'Lightly oil four individual ramekins or one round ovenproof dish about 15cm in diameter (this dish looks great in a brown terracotta one). Spread the ricotta inside and level with a palette knife or a spoon - the cheese should come about 2.5cm up the sides.',
        'Drizzle half the olive oil over the cheese, sprinkle with chopped rosemary and lay a small rosemary sprig on top. Bake for about 20 minutes for individual ramekins, 28 minutes for a large dish, then remove from the oven, top with the figs, drizzle over half the honey and bake again for eight minutes longer. At this point the figs should be semi-cooked but retain their shape.',
        'Remove from the oven and allow to cool down slightly. You can serve the cheese slightly warm or at room temperature.',
        'When ready to serve, whisk together the dressing ingredients in a large bowl. Add the salad leaves and toss. If using individual ramekins, carefully remove the cheese, keeping the figs on top, place on a plate, drizzle the remaining oil and honey on top, and serve with the salad and bread on the side. With the large dish, simply use a large spoon to scoop out a generous portion of cheese and place on the bread slice, making sure some figs are left on top, then drizzle with honey and oil. Place a mound of salad on the side.',
      ],
    }),
    createRecipe({
      id: 'irish-stew',
      description: '',
      name: "Irish' stew",
      ingredients: [
        {
          quantity: { amount: 300, unit: 'g' },
          name: 'whole wheat, soaked overnight in water',
        },
        {
          quantity: { amount: 2, unit: 'unit' },
          name: 'kg lamb loin chops, boned, trimmed and cut into 3cm cubes',
        },
        { name: 'Salt and black pepper' },
        { quantity: { amount: 120, unit: 'ml' }, name: 'olive oil' },
        {
          quantity: { amount: 24, unit: 'unit' },
          name: 'shallots, skinned but left whole',
        },
        {
          quantity: { amount: 4, unit: 'unit' },
          name: 'large carrots, cut into 2.5cm x 5cm batons',
        },
        {
          quantity: { amount: 2, unit: 'unit' },
          name: 'turnips, peeled and cut into 3cm wedges',
        },
        {
          quantity: { amount: 1, unit: 'unit' },
          name: 'celeriac, peeled and cut into 2.5cm x 5cm batons',
        },
        {
          quantity: { amount: 350, unit: 'g' },
          name: 'baby charlotte potatoes, halved',
        },
        { quantity: { amount: 150, unit: 'ml' }, name: 'white wine' },
        { quantity: { amount: 1, unit: 'tsp' }, name: 'caster sugar' },
        {
          quantity: { amount: 4, unit: 'unit' },
          name: 'sprigs of fresh thyme, 4 of oregano and 2 of parsley, tied with string, plus extra parsley to serve',
        },
        { quantity: { amount: 450, unit: 'ml' }, name: 'chicken stock' },
        { name: 'For the paste:' },
        {
          quantity: { amount: 2, unit: 'unit' },
          name: 'garlic cloves, peeled and roughly chopped',
        },
        { quantity: { amount: 30, unit: 'g' }, name: 'parsley, chopped' },
        {
          quantity: { amount: 1, unit: 'unit' },
          name: '½ tsp grated orange zest',
        },
        { quantity: { amount: 60, unit: 'ml' }, name: 'olive oil' },
      ],
      pictureUri: this._getPictureUri('Irish-stew.jpg'),
      steps: [
        'Heat the oven to 180C/350F/gas mark 4. Drain and rinse the soaked wheat, put it in a medium pan with lots of water, bring to a boil and simmer for an hour, until cooked. Drain and set aside.',
        "Season the lamb with a teaspoon of salt and some black pepper. Put one tablespoon of oil in a large, deep sauté pan for which you have a lid; place on a medium-high heat. Add some of the lamb – don't overcrowd the pan – and sear for four minutes on all sides. Transfer to a bowl, and repeat with the remaining lamb, adding oil as needed.",
        'Lower the heat to medium and add a tablespoon of oil to the pan. Add the shallots and fry for four minutes, until caramelised. Tip these into the lamb bowl, and repeat with the remaining vegetables until they are all nice and brown, adding more oil as you need it.',
        'Once all the vegetables are seared and removed from the pan, add the wine along with the sugar, herbs, a teaspoon of salt and a good grind of black pepper. Boil on a high heat for about three minutes.',
        'Tip the lamb, vegetables and whole wheat back into the pot, and add the stock. Cover and boil for five minutes, then transfer to the oven for an hour and a half.',
        'Meanwhile, make the paste. Put all the ingredients in a food processor with a pinch of salt and work to a rough paste.',
        'Remove the stew from the oven and check the liquid; if there is a lot, remove the lid and boil for a few minutes. Divide between plates, drizzle over the paste, scatter on the parsley and serve.',
      ],
    }),
    createRecipe({
      id: 'chermoula-basted-halibut-with-farro',
      description:
        "Farro is an old Italian wheat variety that's said to be the same as emmer or spelt, though I'm not so sure. It can be eaten by some people who are normally intolerant of wheat and is sold pearled or whole.",
      name: 'Chermoula-basted halibut with farro',
      ingredients: [
        { quantity: { amount: 120, unit: 'g' }, name: 'farro' },
        {
          quantity: { amount: 380, unit: 'g' },
          name: 'podded broad beans, fresh or frozen',
        },
        {
          quantity: { amount: 4, unit: 'unit' },
          name: 'halibut fillets, about 150g each',
        },
        { quantity: { amount: 1, unit: 'tbsp' }, name: 'dried lime powder' },
        { quantity: { amount: 5, unit: 'tbsp' }, name: 'olive oil' },
        { name: 'Juice of ½ lemon' },
        { name: 'Salt and black pepper' },
        { quantity: { amount: 1, unit: 'unit' }, name: '½ tbsp picked dill' },
        {
          quantity: { amount: 4, unit: 'unit' },
          name: 'lemon wedges, to serve',
        },
        { name: 'For the chermoula:' },
        { quantity: { amount: 1, unit: 'tsp' }, name: 'ground cumin' },
        { name: '½ tsp paprika' },
        { name: '½ tsp dried lime powder' },
        {
          quantity: { amount: 1, unit: 'unit' },
          name: 'small garlic, crushed',
        },
        {
          quantity: { amount: 2, unit: 'tsp' },
          name: 'finely chopped preserved lemon skin',
        },
        {
          quantity: { amount: 1, unit: 'tbsp' },
          name: 'chopped flat-leaf parsley',
        },
        {
          quantity: { amount: 1, unit: 'tbsp' },
          name: 'chopped fresh coriander leaves',
        },
        { quantity: { amount: 2, unit: 'unit' }, name: '½ tbsp olive oil' },
      ],
      pictureUri: this._getPictureUri(
        'Chermoula-basted-halibut-with-farro.jpg'
      ),
      steps: [
        'Simmer the farro in plenty of water for 20 minutes to an hour – the cooking time will depend on the brand; you want it tender with just a little bite. Drain and set aside.',
        'Cook the broad beans in salted boiling water for two minutes, drain, refresh under cold water, then remove and discard the skins.',
        'Preheat the oven to 200C/400F/gas mark 6. Mix the chermoula ingredients and season well. Put the fish in a heatproof dish or oven tray lined with baking paper, brush with the chermoula, and roast for eight to 10 minutes, until just done.',
        'Mix the farro, beans, Iranian lime, olive oil, lemon juice, salt and pepper in a medium pan, heat up gently and divide among four plates. Top with the fish, garnish with dill and serve with a lemon wedge',
      ],
    }),
    createRecipe({
      id: 'roasted-chicken-legs-with-dates-olives-and-capers',
      description:
        "The Silver Palate, by Julee Rosso and Sheila Lukins, is one of the best cookbooks I know and a classic of the 1980s, listing recipes from the first modern quality take-out food shop in New York. Many of the dishes in the book have become legendary. One of them, Chicken Marbella, is the inspiration for this recipe. The chicken needs marinading for at least a day, preferably two, to soften and flavour properly; I wouldn't cut corners here.",
      name: 'Roast chicken with dates, olives and capers',
      ingredients: [
        {
          quantity: { amount: 8, unit: 'unit' },
          name: 'chicken legs, drumstick and thigh attached, skin on (2kg net)',
        },
        {
          quantity: { amount: 5, unit: 'unit' },
          name: 'garlic cloves, crushed',
        },
        {
          quantity: { amount: 15, unit: 'g' },
          name: 'fresh oregano, torn, plus extra for garnish',
        },
        { quantity: { amount: 3, unit: 'tbsp' }, name: 'red wine vinegar' },
        { quantity: { amount: 3, unit: 'tbsp' }, name: 'olive oil' },
        { quantity: { amount: 100, unit: 'g' }, name: 'pitted green olives' },
        {
          quantity: { amount: 60, unit: 'g' },
          name: 'capers, plus 2 tbsp of their juices',
        },
        {
          quantity: { amount: 70, unit: 'g' },
          name: ', pitted and quartered lengthways Medjoul dates',
        },
        { quantity: { amount: 2, unit: 'unit' }, name: 'bay leaves' },
        { quantity: { amount: 120, unit: 'ml' }, name: 'dry white wine' },
        {
          quantity: { amount: 1, unit: 'tbsp' },
          name: 'date syrup or treacle',
        },
        { name: 'Salt and black pepper' },
      ],
      pictureUri: this._getPictureUri(
        'Roast-chicken-with-dates,-olives-and-capers.jpg'
      ),
      steps: [
        'Place the chicken in a large, non-reactive bowl and add all of the ingredients, apart from the wine and date molasses, along with ¾ teaspoon of salt and a good grind of black pepper. Gently mix everything together, cover the bowl and leave in the fridge to marinate for 1 to 2 days, stirring the ingredients a few times during the process.',
        'Preheat the oven to 180C.',
        'Spread out the chicken legs on a large baking tray, along with all the marinade ingredients. Whisk together the wine and molasses and pour over the meat. Place in the oven and cook for 50 minutes, basting 2 or 3 times, until the meat is golden brown on top and cooked through.',
        'Remove from the oven, transfer everything to a large platter, sprinkle over some freshly picked oregano leaves and serve.',
      ],
    }),
  ];

  search({
    keywords,
    maxIngredientCount,
    maxStepCount,
  }: RecipeFilter = {}): Observable<Recipe[]> {
    const recipes = this._recipes.filter((recipe) => {
      const conditions = [
        /* Filter by keywords. */
        () => (keywords ? recipe.name.includes(keywords) : true),
        /* Filter by max ingredients. */
        () =>
          maxIngredientCount != null
            ? recipe.ingredients.length <= maxIngredientCount
            : true,
        /* Filter by max steps. */
        () =>
          maxStepCount != null ? recipe.steps.length <= maxStepCount : true,
      ];

      /* Return true if all conditions are true. */
      return conditions.every((condition) => condition());
    });

    return of(recipes);
  }

  private _getPictureUri(pictureName: string): string {
    return `/assets/pics/${encodeURIComponent(pictureName)}`;
  }
}
