---
description: Ce document explore la syntaxe et les règles des fonctions en Vimscript,
  illustrant leur utilisation et leur importance dans l'apprentissage du langage.
title: Ch28. Vimscript Functions
---

Les fonctions sont des moyens d'abstraction, le troisième élément dans l'apprentissage d'une nouvelle langue.

Dans les chapitres précédents, vous avez vu des fonctions natives de Vimscript (`len()`, `filter()`, `map()`, etc.) et des fonctions personnalisées en action. Dans ce chapitre, vous allez approfondir vos connaissances sur le fonctionnement des fonctions.

## Règles de syntaxe des fonctions

Au cœur, une fonction Vimscript a la syntaxe suivante :

```shell
function {FunctionName}()
  {do-something}
endfunction
```

Une définition de fonction doit commencer par une lettre majuscule. Elle commence par le mot-clé `function` et se termine par `endfunction`. Voici une fonction valide :

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

La suivante n'est pas une fonction valide car elle ne commence pas par une lettre majuscule.

```shell
function tasty()
  echo "Tasty"
endfunction
```

Si vous préfixez une fonction avec la variable de script (`s:`), vous pouvez l'utiliser en minuscules. `function s:tasty()` est un nom valide. La raison pour laquelle Vim exige que vous utilisiez un nom en majuscule est d'éviter toute confusion avec les fonctions intégrées de Vim (toutes en minuscules).

Un nom de fonction ne peut pas commencer par un chiffre. `1Tasty()` n'est pas un nom de fonction valide, mais `Tasty1()` l'est. Une fonction ne peut également pas contenir de caractères non alphanumériques à part `_`. `Tasty-food()`, `Tasty&food()` et `Tasty.food()` ne sont pas des noms de fonction valides. `Tasty_food()` *l'est*.

Si vous définissez deux fonctions avec le même nom, Vim renverra une erreur en se plaignant que la fonction `Tasty` existe déjà. Pour écraser la fonction précédente avec le même nom, ajoutez un `!` après le mot-clé `function`.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

## Lister les fonctions disponibles

Pour voir toutes les fonctions intégrées et personnalisées dans Vim, vous pouvez exécuter la commande `:function`. Pour voir le contenu de la fonction `Tasty`, vous pouvez exécuter `:function Tasty`.

Vous pouvez également rechercher des fonctions avec un motif avec `:function /pattern`, similaire à la navigation de recherche de Vim (`/pattern`). Pour rechercher toutes les fonctions contenant le mot "map", exécutez `:function /map`. Si vous utilisez des plugins externes, Vim affichera les fonctions définies dans ces plugins.

Si vous voulez voir d'où provient une fonction, vous pouvez utiliser la commande `:verbose` avec la commande `:function`. Pour voir d'où proviennent toutes les fonctions contenant le mot "map", exécutez :

```shell
:verbose function /map
```

Lorsque je l'ai exécuté, j'ai obtenu plusieurs résultats. Celui-ci me dit que la fonction `fzf#vim#maps` (pour récapituler, voir le Ch. 23) est écrite dans le fichier `~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim`, à la ligne 1263. C'est utile pour le débogage.

```shell
function fzf#vim#maps(mode, ...)
        Last set from ~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim line 1263
```

## Supprimer une fonction

Pour supprimer une fonction existante, utilisez `:delfunction {Function_name}`. Pour supprimer `Tasty`, exécutez `:delfunction Tasty`.

## Valeur de retour d'une fonction

Pour qu'une fonction renvoie une valeur, vous devez lui passer une valeur de retour explicite `return`. Sinon, Vim renvoie automatiquement une valeur implicite de 0.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

Un `return` vide est également équivalent à une valeur de 0.

```shell
function! Tasty()
  echo "Tasty"
  return
endfunction
```

Si vous exécutez `:echo Tasty()` en utilisant la fonction ci-dessus, après que Vim affiche "Tasty", il renvoie 0, la valeur de retour implicite. Pour faire en sorte que `Tasty()` renvoie la valeur "Tasty", vous pouvez faire ceci :

```shell
function! Tasty()
  return "Tasty"
endfunction
```

Maintenant, lorsque vous exécutez `:echo Tasty()`, cela renvoie la chaîne "Tasty".

Vous pouvez utiliser une fonction à l'intérieur d'une expression. Vim utilisera la valeur de retour de cette fonction. L'expression `:echo Tasty() . " Food!"` affiche "Tasty Food!"

## Arguments formels

Pour passer un argument formel `food` à votre fonction `Tasty`, vous pouvez faire ceci :

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

echo Tasty("pâtisserie")
" renvoie "Tasty pâtisserie"
```

`a:` est l'un des scopes de variables mentionnés dans le dernier chapitre. C'est la variable de paramètre formel. C'est la façon de Vim d'obtenir une valeur de paramètre formel dans une fonction. Sans cela, Vim renverra une erreur :

```shell
function! Tasty(food)
  return "Tasty " . food
endfunction

echo Tasty("pasta")
" renvoie une erreur "nom de variable indéfini"
```

## Variable locale de fonction

Abordons l'autre variable que vous n'avez pas apprise dans le chapitre précédent : la variable locale de fonction (`l:`).

Lorsque vous écrivez une fonction, vous pouvez définir une variable à l'intérieur :

```shell
function! Yummy()
  let location = "ventre"
  return "Yummy in my " . location
endfunction

echo Yummy()
" renvoie "Yummy in my ventre"
```

Dans ce contexte, la variable `location` est la même que `l:location`. Lorsque vous définissez une variable dans une fonction, cette variable est *locale* à cette fonction. Lorsqu'un utilisateur voit `location`, cela pourrait facilement être confondu avec une variable globale. Je préfère être plus explicite que pas, donc je préfère mettre `l:` pour indiquer qu'il s'agit d'une variable de fonction.

Une autre raison d'utiliser `l:count` est que Vim a des variables spéciales avec des alias qui ressemblent à des variables normales. `v:count` en est un exemple. Il a un alias de `count`. Dans Vim, appeler `count` est la même chose que d'appeler `v:count`. Il est facile d'appeler accidentellement l'une de ces variables spéciales.

```shell
function! Calories()
  let count = "count"
  return "Je ne " . count . " pas mes calories"
endfunction

echo Calories()
" renvoie une erreur
```

L'exécution ci-dessus renvoie une erreur car `let count = "Count"` tente implicitement de redéfinir la variable spéciale de Vim `v:count`. Rappelez-vous que les variables spéciales (`v:`) sont en lecture seule. Vous ne pouvez pas les muter. Pour corriger cela, utilisez `l:count` :

```shell
function! Calories()
  let l:count = "count"
  return "Je ne " . l:count . " pas mes calories"
endfunction

echo Calories()
" renvoie "Je ne compte pas mes calories"
```

## Appeler une fonction

Vim a une commande `:call` pour appeler une fonction.

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

call Tasty("sauce")
```

La commande `call` n'affiche pas la valeur de retour. Appelons-la avec `echo`.

```shell
echo call Tasty("sauce")
```

Oups, vous obtenez une erreur. La commande `call` ci-dessus est une commande de ligne de commande (`:call`). La commande `echo` ci-dessus est également une commande de ligne de commande (`:echo`). Vous ne pouvez pas appeler une commande de ligne de commande avec une autre commande de ligne de commande. Essayons une autre variante de la commande `call` :

```shell
echo call("Tasty", ["sauce"])
" renvoie "Tasty sauce"
```

Pour clarifier toute confusion, vous avez juste utilisé deux commandes `call` différentes : la commande de ligne de commande `:call` et la fonction `call()`. La fonction `call()` accepte comme premier argument le nom de la fonction (chaîne) et comme deuxième argument les paramètres formels (liste).

Pour en savoir plus sur `:call` et `call()`, consultez `:h call()` et `:h :call`.

## Argument par défaut

Vous pouvez fournir un paramètre de fonction avec une valeur par défaut avec `=`. Si vous appelez `Breakfast` avec un seul argument, l'argument `beverage` utilisera la valeur par défaut "lait".

```shell
function! Breakfast(meal, beverage = "Lait")
  return "J'ai eu " . a:meal . " et " . a:beverage . " pour le petit déjeuner"
endfunction

echo Breakfast("Pommes de terre rissolées")
" renvoie J'ai eu des pommes de terre rissolées et du lait pour le petit déjeuner

echo Breakfast("Céréales", "Jus d'orange")
" renvoie J'ai eu des céréales et du jus d'orange pour le petit déjeuner
```

## Arguments variables

Vous pouvez passer un argument variable avec trois points (`...`). L'argument variable est utile lorsque vous ne savez pas combien de variables un utilisateur va donner.

Supposons que vous créiez un buffet à volonté (vous ne saurez jamais combien de nourriture votre client va manger) :

```shell
function! Buffet(...)
  return a:1
endfunction
```

Si vous exécutez `echo Buffet("Nouilles")`, cela affichera "Nouilles". Vim utilise `a:1` pour imprimer le *premier* argument passé à `...`, jusqu'à 20 (`a:1` est le premier argument, `a:2` est le deuxième argument, etc.). Si vous exécutez `echo Buffet("Nouilles", "Sushi")`, cela affichera toujours juste "Nouilles", mettons à jour :

```shell
function! Buffet(...)
  return a:1 . " " . a:2
endfunction

echo Buffet("Nouilles", "Sushi")
" renvoie "Nouilles Sushi"
```

Le problème avec cette approche est que si vous exécutez maintenant `echo Buffet("Nouilles")` (avec une seule variable), Vim se plaint qu'il a une variable indéfinie `a:2`. Comment pouvez-vous le rendre suffisamment flexible pour afficher exactement ce que l'utilisateur donne ?

Heureusement, Vim a une variable spéciale `a:0` pour afficher le *nombre* d'arguments passés dans `...`.

```shell
function! Buffet(...)
  return a:0
endfunction

echo Buffet("Nouilles")
" renvoie 1

echo Buffet("Nouilles", "Sushi")
" renvoie 2

echo Buffet("Nouilles", "Sushi", "Crème glacée", "Tofu", "Mochi")
" renvoie 5
```

Avec cela, vous pouvez itérer en utilisant la longueur de l'argument.

```shell
function! Buffet(...)
  let l:food_counter = 1
  let l:foods = ""
  while l:food_counter <= a:0
    let l:foods .= a:{l:food_counter} . " "
    let l:food_counter += 1
  endwhile
  return l:foods
endfunction
```

Les accolades `a:{l:food_counter}` sont une interpolation de chaîne, elles utilisent la valeur du compteur `food_counter` pour appeler les arguments de paramètres formels `a:1`, `a:2`, `a:3`, etc.

```shell
echo Buffet("Nouilles")
" renvoie "Nouilles"

echo Buffet("Nouilles", "Sushi", "Crème glacée", "Tofu", "Mochi")
" renvoie tout ce que vous avez passé : "Nouilles Sushi Crème glacée Tofu Mochi"
```

L'argument variable a une autre variable spéciale : `a:000`. Elle a la valeur de tous les arguments variables sous forme de liste.

```shell
function! Buffet(...)
  return a:000
endfunction

echo Buffet("Nouilles")
" renvoie ["Nouilles"]

echo Buffet("Nouilles", "Sushi", "Crème glacée", "Tofu", "Mochi")
" renvoie ["Nouilles", "Sushi", "Crème glacée", "Tofu", "Mochi"]
```

Refaisons la fonction pour utiliser une boucle `for` :

```shell
function! Buffet(...)
  let l:foods = ""
  for food_item in a:000
    let l:foods .= food_item . " "
  endfor
  return l:foods
endfunction

echo Buffet("Nouilles", "Sushi", "Crème glacée", "Tofu", "Mochi")
" renvoie Nouilles Sushi Crème glacée Tofu Mochi
```
## Plage

Vous pouvez définir une fonction Vimscript *ranged* en ajoutant un mot-clé `range` à la fin de la définition de la fonction. Une fonction rangée a deux variables spéciales disponibles : `a:firstline` et `a:lastline`.

```shell
function! Breakfast() range
  echo a:firstline
  echo a:lastline
endfunction
```

Si vous êtes à la ligne 100 et que vous exécutez `call Breakfast()`, cela affichera 100 pour `firstline` et `lastline`. Si vous mettez en surbrillance visuellement (`v`, `V`, ou `Ctrl-V`) les lignes 101 à 105 et exécutez `call Breakfast()`, `firstline` affichera 101 et `lastline` affichera 105. `firstline` et `lastline` affichent la plage minimale et maximale où la fonction est appelée.

Vous pouvez également utiliser `:call` et lui passer une plage. Si vous exécutez `:11,20call Breakfast()`, cela affichera 11 pour `firstline` et 20 pour `lastline`.

Vous pourriez demander : "C'est bien que la fonction Vimscript accepte une plage, mais ne puis-je pas obtenir le numéro de ligne avec `line(".")` ? Ne fera-t-il pas la même chose ?"

Bonne question. Si c'est ce que vous voulez dire :

```shell
function! Breakfast()
  echo line(".")
endfunction
```

Appeler `:11,20call Breakfast()` exécute la fonction `Breakfast` 10 fois (une pour chaque ligne dans la plage). Comparez cela si vous aviez passé l'argument `range` :

```shell
function! Breakfast() range
  echo line(".")
endfunction
```

Appeler `11,20call Breakfast()` exécute la fonction `Breakfast` *une fois*.

Si vous passez un mot-clé `range` et que vous passez une plage numérique (comme `11,20`) sur `call`, Vim n'exécute cette fonction qu'une seule fois. Si vous ne passez pas un mot-clé `range` et que vous passez une plage numérique (comme `11,20`) sur `call`, Vim exécute cette fonction N fois en fonction de la plage (dans ce cas, N = 10).

## Dictionnaire

Vous pouvez ajouter une fonction comme élément de dictionnaire en ajoutant un mot-clé `dict` lors de la définition d'une fonction.

Si vous avez une fonction `SecondBreakfast` qui retourne n'importe quel élément `breakfast` que vous avez :

```shell
function! SecondBreakfast() dict
  return self.breakfast
endfunction
```

Ajoutons cette fonction au dictionnaire `meals` :

```shell
let meals = {"breakfast": "pancakes", "second_breakfast": function("SecondBreakfast"), "lunch": "pasta"}

echo meals.second_breakfast()
" retourne "pancakes"
```

Avec le mot-clé `dict`, la variable clé `self` fait référence au dictionnaire où la fonction est stockée (dans ce cas, le dictionnaire `meals`). L'expression `self.breakfast` est égale à `meals.breakfast`.

Une autre façon d'ajouter une fonction dans un objet dictionnaire est d'utiliser un espace de noms.

```shell
function! meals.second_lunch()
  return self.lunch
endfunction

echo meals.second_lunch()
" retourne "pasta"
```

Avec un espace de noms, vous n'avez pas besoin d'utiliser le mot-clé `dict`.

## Funcref

Un funcref est une référence à une fonction. C'est l'un des types de données de base de Vimscript mentionnés dans le Ch. 24.

L'expression `function("SecondBreakfast")` ci-dessus est un exemple de funcref. Vim a une fonction intégrée `function()` qui retourne un funcref lorsque vous lui passez un nom de fonction (chaîne).

```shell
function! Breakfast(item)
  return "I am having " . a:item . " for breakfast"
endfunction

let Breakfastify = Breakfast
" retourne une erreur

let Breakfastify = function("Breakfast")

echo Breakfastify("oatmeal")
" retourne "I am having oatmeal for breakfast"

echo Breakfastify("pancake")
" retourne "I am having pancake for breakfast"
```

Dans Vim, si vous voulez assigner une fonction à une variable, vous ne pouvez pas simplement l'assigner directement comme `let MyVar = MyFunc`. Vous devez utiliser la fonction `function()`, comme `let MyVar = function("MyFunc")`.

Vous pouvez utiliser funcref avec des maps et des filtres. Notez que les maps et les filtres passeront un index comme premier argument et la valeur itérée comme deuxième argument.

```shell
function! Breakfast(index, item)
  return "I am having " . a:item . " for breakfast"
endfunction

let breakfast_items = ["pancakes", "hash browns", "waffles"]
let first_meals = map(breakfast_items, function("Breakfast"))

for meal in first_meals
  echo meal
endfor
```

## Lambda

Une meilleure façon d'utiliser des fonctions dans des maps et des filtres est d'utiliser une expression lambda (parfois connue sous le nom de fonction sans nom). Par exemple :

```shell
let Plus = {x,y -> x + y}
echo Plus(1,2)
" retourne 3

let Tasty = { -> 'tasty'}
echo Tasty()
" retourne "tasty"
```

Vous pouvez appeler une fonction depuis l'intérieur d'une expression lambda :

```shell
function! Lunch(item)
  return "I am having " . a:item . " for lunch"
endfunction

let lunch_items = ["sushi", "ramen", "sashimi"]

let day_meals = map(lunch_items, {index, item -> Lunch(item)})

for meal in day_meals
  echo meal
endfor
```

Si vous ne voulez pas appeler la fonction depuis l'intérieur de la lambda, vous pouvez la refactoriser :

```shell
let day_meals = map(lunch_items, {index, item -> "I am having " . item . " for lunch"})
```

## Chaînage de Méthodes

Vous pouvez chaîner plusieurs fonctions Vimscript et expressions lambda séquentiellement avec `->`. Gardez à l'esprit que `->` doit être suivi d'un nom de méthode *sans espace*.

```shell
Source->Method1()->Method2()->...->MethodN()
```

Pour convertir un float en nombre en utilisant le chaînage de méthodes :

```shell
echo 3.14->float2nr()
" retourne 3
```

Faisons un exemple plus compliqué. Supposons que vous devez capitaliser la première lettre de chaque élément d'une liste, puis trier la liste, puis joindre la liste pour former une chaîne.

```shell
function! Capitalizer(word)
  return substitute(a:word, "\^\.", "\\u&", "g")
endfunction

function! CapitalizeList(word_list)
  return map(a:word_list, {index, word -> Capitalizer(word)})
endfunction

let dinner_items = ["bruschetta", "antipasto", "calzone"]

echo dinner_items->CapitalizeList()->sort()->join(", ")
" retourne "Antipasto, Bruschetta, Calzone"
```

Avec le chaînage de méthodes, la séquence est plus facilement lisible et compréhensible. Je peux juste jeter un coup d'œil à `dinner_items->CapitalizeList()->sort()->join(", ")` et savoir exactement ce qui se passe.

## Fermeture

Lorsque vous définissez une variable à l'intérieur d'une fonction, cette variable existe dans les limites de cette fonction. C'est ce qu'on appelle une portée lexicale.

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch()
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

`appetizer` est défini à l'intérieur de la fonction `Lunch`, qui retourne le funcref `SecondLunch`. Remarquez que `SecondLunch` utilise l'`appetizer`, mais dans Vimscript, il n'a pas accès à cette variable. Si vous essayez d'exécuter `echo Lunch()()`, Vim renverra une erreur de variable indéfinie.

Pour résoudre ce problème, utilisez le mot-clé `closure`. Refactorisons :

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch() closure
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

Maintenant, si vous exécutez `echo Lunch()()`, Vim renverra "shrimp".

## Apprendre les Fonctions Vimscript de Manière Intelligente

Dans ce chapitre, vous avez appris l'anatomie d'une fonction Vim. Vous avez appris comment utiliser différents mots-clés spéciaux `range`, `dict` et `closure` pour modifier le comportement des fonctions. Vous avez également appris à utiliser des lambdas et à chaîner plusieurs fonctions ensemble. Les fonctions sont des outils importants pour créer des abstractions complexes.

Ensuite, mettons tout ce que vous avez appris ensemble pour créer votre propre plugin.