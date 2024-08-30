---
description: Découvrez les types de données primitifs de Vimscript, leur utilisation
  et comment explorer le mode Ex pour interagir avec le langage de programmation de
  Vim.
title: Ch25. Vimscript Basic Data Types
---

Dans les prochains chapitres, vous apprendrez le Vimscript, le langage de programmation intégré de Vim.

Lorsque vous apprenez un nouveau langage, il y a trois éléments de base à rechercher :
- Primitives
- Moyens de combinaison
- Moyens d'abstraction

Dans ce chapitre, vous apprendrez les types de données primitifs de Vim.

## Types de données

Vim a 10 types de données différents :
- Nombre
- Flottant
- Chaîne
- Liste
- Dictionnaire
- Spécial
- Funcref
- Job
- Canal
- Blob

Je vais couvrir les six premiers types de données ici. Dans le Chap. 27, vous apprendrez sur Funcref. Pour en savoir plus sur les types de données de Vim, consultez `:h variables`.

## Suivre avec le mode Ex

Vim n'a techniquement pas de REPL intégré, mais il a un mode, le mode Ex, qui peut être utilisé comme tel. Vous pouvez accéder au mode Ex avec `Q` ou `gQ`. Le mode Ex est comme un mode de ligne de commande étendu (c'est comme taper des commandes en mode ligne de commande sans interruption). Pour quitter le mode Ex, tapez `:visual`.

Vous pouvez utiliser soit `:echo` soit `:echom` dans ce chapitre et les chapitres suivants de Vimscript pour coder en parallèle. Ils sont comme `console.log` en JS ou `print` en Python. La commande `:echo` imprime l'expression évaluée que vous donnez. La commande `:echom` fait la même chose, mais en plus, elle stocke le résultat dans l'historique des messages.

```viml
:echom "message d'écho hello"
```

Vous pouvez voir l'historique des messages avec :

```shell
:messages
```

Pour effacer votre historique de messages, exécutez :

```shell
:messages clear
```

## Nombre

Vim a 4 types de nombres différents : décimal, hexadécimal, binaire et octal. Au fait, quand je parle de type de données nombre, cela signifie souvent un type de données entier. Dans ce guide, j'utiliserai les termes nombre et entier de manière interchangeable.

### Décimal

Vous devriez être familier avec le système décimal. Vim accepte les décimaux positifs et négatifs. 1, -1, 10, etc. En programmation Vimscript, vous utiliserez probablement le type décimal la plupart du temps.

### Hexadécimal

Les hexadécimaux commencent par `0x` ou `0X`. Mnémotechnique : He**x**adécimal.

### Binaire

Les binaires commencent par `0b` ou `0B`. Mnémotechnique : **B**inaire.

### Octal

Les octaux commencent par `0`, `0o`, et `0O`. Mnémotechnique : **O**ctal.

### Impression des Nombres

Si vous `echo` soit un nombre hexadécimal, un binaire, ou un octal, Vim les convertit automatiquement en décimaux.

```viml
:echo 42
" retourne 42

:echo 052
" retourne 42

:echo 0b101010
" retourne 42

:echo 0x2A
" retourne 42
```

### Véritable et Faux

Dans Vim, une valeur de 0 est fausse et toutes les valeurs non nulles sont vraies.

Ce qui suit ne fera pas d'écho.

```viml
:if 0
:  echo "Non"
:endif
```

Cependant, cela le fera :

```viml
:if 1
:  echo "Oui"
:endif
```

Toute valeur autre que 0 est vraie, y compris les nombres négatifs. 100 est vrai. -1 est vrai.

### Arithmétique des Nombres

Les nombres peuvent être utilisés pour exécuter des expressions arithmétiques :

```viml
:echo 3 + 1
" retourne 4

: echo 5 - 3
" retourne 2

:echo 2 * 2
" retourne 4

:echo 4 / 2
" retourne 2
```

Lors de la division d'un nombre avec un reste, Vim ignore le reste.

```viml
:echo 5 / 2
" retourne 2 au lieu de 2.5
```

Pour obtenir un résultat plus précis, vous devez utiliser un nombre flottant.

## Flottant

Les flottants sont des nombres avec des décimales. Il existe deux façons de représenter les nombres flottants : la notation décimale (comme 31.4) et l'exposant (3.14e01). Comme pour les nombres, vous pouvez utiliser des signes positifs et négatifs :

```viml
:echo +123.4
" retourne 123.4

:echo -1.234e2
" retourne -123.4

:echo 0.25
" retourne 0.25

:echo 2.5e-1
" retourne 0.25
```

Vous devez donner un point et des chiffres après un flottant. `25e-2` (sans point) et `1234.` (a un point, mais pas de chiffres après) sont tous deux des nombres flottants invalides.

### Arithmétique des Flottants

Lors de l'exécution d'une expression arithmétique entre un nombre et un flottant, Vim convertit le résultat en flottant.

```viml
:echo 5 / 2.0
" retourne 2.5
```

L'arithmétique flottante et flottante vous donne un autre flottant.

```shell
:echo 1.0 + 1.0
" retourne 2.0
```

## Chaîne

Les chaînes sont des caractères entourés soit de guillemets doubles (`""`) soit de guillemets simples (`''`). "Bonjour", "123", et '123.4' sont des exemples de chaînes.

### Concaténation de Chaînes

Pour concaténer une chaîne dans Vim, utilisez l'opérateur `.`.

```viml
:echo "Bonjour" . " monde"
" retourne "Bonjour monde"
```

### Arithmétique des Chaînes

Lorsque vous exécutez des opérateurs arithmétiques (`+ - * /`) avec un nombre et une chaîne, Vim convertit la chaîne en nombre.

```viml
:echo "12 donuts" + 3
" retourne 15
```

Lorsque Vim voit "12 donuts", il extrait le 12 de la chaîne et le convertit en nombre 12. Ensuite, il effectue l'addition, retournant 15. Pour que cette conversion de chaîne en nombre fonctionne, le caractère numérique doit être le *premier caractère* de la chaîne.

Ce qui suit ne fonctionnera pas car 12 n'est pas le premier caractère de la chaîne :

```viml
:echo "donuts 12" + 3
" retourne 3
```

Cela ne fonctionnera pas non plus car un espace vide est le premier caractère de la chaîne :

```viml
:echo " 12 donuts" + 3
" retourne 3
```

Cette conversion fonctionne même avec deux chaînes :

```shell
:echo "12 donuts" + "6 pastries"
" retourne 18
```

Cela fonctionne avec n'importe quel opérateur arithmétique, pas seulement `+` :

```viml
:echo "12 donuts" * "5 boxes"
" retourne 60

:echo "12 donuts" - 5
" retourne 7

:echo "12 donuts" / "3 people"
" retourne 4
```

Une astuce pratique pour forcer une conversion de chaîne en nombre est d'ajouter simplement 0 ou de multiplier par 1 :

```viml
:echo "12" + 0
" retourne 12

:echo "12" * 1
" retourne 12
```

Lorsque l'arithmétique est effectuée contre un flottant dans une chaîne, Vim le traite comme un entier, pas comme un flottant :

```shell
:echo "12.0 donuts" + 12
" retourne 24, pas 24.0
```

### Concaténation de Nombre et de Chaîne

Vous pouvez convertir un nombre en chaîne avec un opérateur point (`.`) :

```viml
:echo 12 . "donuts"
" retourne "12donuts"
```

La conversion ne fonctionne qu'avec le type de données nombre, pas flottant. Cela ne fonctionnera pas :

```shell
:echo 12.0 . "donuts"
" ne retourne pas "12.0donuts" mais génère une erreur
```

### Conditionnelles de Chaînes

Rappelez-vous que 0 est faux et que tous les nombres non nuls sont vrais. Cela est également vrai lors de l'utilisation de chaînes comme conditionnelles.

Dans l'instruction if suivante, Vim convertit "12donuts" en 12, qui est vrai :

```viml
:if "12donuts"
:  echo "Miam"
:endif
" retourne "Miam"
```

D'autre part, ceci est faux :

```viml
:if "donuts12"
:  echo "Non"
:endif
" ne retourne rien
```

Vim convertit "donuts12" en 0, car le premier caractère n'est pas un nombre.

### Guillemets Doubles vs Simples

Les guillemets doubles se comportent différemment des guillemets simples. Les guillemets simples affichent les caractères littéralement tandis que les guillemets doubles acceptent des caractères spéciaux.

Quels sont les caractères spéciaux ? Consultez l'affichage des nouvelles lignes et des guillemets doubles :

```viml
:echo "hello\nworld"
" retourne
" hello
" world

:echo "hello \"world\""
" retourne "hello "world""
```

Comparez cela avec les guillemets simples :

```shell
:echo 'hello\nworld'
" retourne 'hello\nworld'

:echo 'hello \"world\"'
" retourne 'hello \"world\"'
```

Les caractères spéciaux sont des caractères de chaîne spéciaux qui, lorsqu'ils sont échappés, se comportent différemment. `\n` agit comme une nouvelle ligne. `\"` se comporte comme un littéral `"`. Pour une liste d'autres caractères spéciaux, consultez `:h expr-quote`.

### Procédures de Chaînes

Examinons quelques procédures de chaîne intégrées.

Vous pouvez obtenir la longueur d'une chaîne avec `strlen()`.

```shell
:echo strlen("choco")
" retourne 5
```

Vous pouvez convertir une chaîne en nombre avec `str2nr()` :

```shell
:echo str2nr("12donuts")
" retourne 12

:echo str2nr("donuts12")
" retourne 0
```

Semblable à la conversion de chaîne en nombre précédemment, si le nombre n'est pas le premier caractère, Vim ne le capturera pas.

La bonne nouvelle est que Vim a une méthode qui transforme une chaîne en flottant, `str2float()` :

```shell
:echo str2float("12.5donuts")
" retourne 12.5
```

Vous pouvez substituer un motif dans une chaîne avec la méthode `substitute()` :

```shell
:echo substitute("sweet", "e", "o", "g")
" retourne "swoot"
```

Le dernier paramètre, "g", est le drapeau global. Avec cela, Vim substituera toutes les occurrences correspondantes. Sans cela, Vim ne substituera que la première correspondance.

```shell
:echo substitute("sweet", "e", "o", "")
" retourne "swoet"
```

La commande de substitution peut être combinée avec `getline()`. Rappelez-vous que la fonction `getline()` obtient le texte à un numéro de ligne donné. Supposons que vous ayez le texte "chocolate donut" à la ligne 5. Vous pouvez utiliser la procédure :

```shell
:echo substitute(getline(5), "chocolate", "glazed", "g")
" retourne glazed donut
```

Il existe de nombreuses autres procédures de chaîne. Consultez `:h string-functions`.

## Liste

Une liste Vimscript est comme un tableau en Javascript ou une liste en Python. C'est une séquence d'éléments *ordonnée*. Vous pouvez mélanger et assortir le contenu avec différents types de données :

```shell
[1,2,3]
['a', 'b', 'c']
[1,'a', 3.14]
[1,2,[3,4]]
```

### Sous-listes

La liste Vim est indexée à partir de zéro. Vous pouvez accéder à un élément particulier dans une liste avec `[n]`, où n est l'index.

```shell
:echo ["a", "sweet", "dessert"][0]
" retourne "a"

:echo ["a", "sweet", "dessert"][2]
" retourne "dessert"
```

Si vous dépassez le nombre d'index maximum, Vim générera une erreur indiquant que l'index est hors de portée :

```shell
:echo ["a", "sweet", "dessert"][999]
" retourne une erreur
```

Lorsque vous descendez en dessous de zéro, Vim commencera l'index à partir du dernier élément. Dépasser le nombre d'index minimum générera également une erreur :

```shell
:echo ["a", "sweet", "dessert"][-1]
" retourne "dessert"

:echo ["a", "sweet", "dessert"][-3]
" retourne "a"

:echo ["a", "sweet", "dessert"][-999]
" retourne une erreur
```

Vous pouvez "trancher" plusieurs éléments d'une liste avec `[n:m]`, où `n` est l'index de départ et `m` est l'index de fin.

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:4]
" retourne ["plain", "strawberry", "lemon"]
```

Si vous ne passez pas `m` (`[n:]`), Vim retournera le reste des éléments à partir du n-ième élément. Si vous ne passez pas `n` (`[:m]`), Vim retournera le premier élément jusqu'au m-ième élément.

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:]
" retourne ['plain', 'strawberry', 'lemon', 'sugar', 'cream']

:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][:4]
" retourne ['chocolate', 'glazed', 'plain', 'strawberry', 'lemon']
```

Vous pouvez passer un index qui dépasse le nombre maximum d'éléments lors de la découpe d'un tableau.

```viml
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:999]
" retourne ['plain', 'strawberry', 'lemon', 'sugar', 'cream']
```
### Découpage de Chaîne

Vous pouvez découper et cibler des chaînes tout comme des listes :

```viml
:echo "choco"[0]
" renvoie "c"

:echo "choco"[1:3]
" renvoie "hoc"

:echo "choco"[:3]
" renvoie choc

:echo "choco"[1:]
" renvoie hoco
```

### Arithmétique de Liste

Vous pouvez utiliser `+` pour concaténer et modifier une liste :

```viml
:let sweetList = ["chocolate", "strawberry"]
:let sweetList += ["sugar"]
:echo sweetList
" renvoie ["chocolate", "strawberry", "sugar"]
```

### Fonctions de Liste

Explorons les fonctions de liste intégrées de Vim.

Pour obtenir la longueur d'une liste, utilisez `len()` :

```shell
:echo len(["chocolate", "strawberry"])
" renvoie 2
```

Pour ajouter un élément au début d'une liste, vous pouvez utiliser `insert()` :

```shell
:let sweetList = ["chocolate", "strawberry"]
:call insert(sweetList, "glazed")

:echo sweetList
" renvoie ["glazed", "chocolate", "strawberry"]
```

Vous pouvez également passer à `insert()` l'index où vous souhaitez ajouter l'élément. Si vous souhaitez ajouter un élément avant le deuxième élément (index 1) :

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call insert(sweeterList, "cream", 1)

:echo sweeterList
" renvoie ['glazed', 'cream', 'chocolate', 'strawberry']
```

Pour supprimer un élément de la liste, utilisez `remove()`. Il accepte une liste et l'index de l'élément que vous souhaitez supprimer.

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call remove(sweeterList, 1)

:echo sweeterList
" renvoie ['glazed', 'strawberry']
```

Vous pouvez utiliser `map()` et `filter()` sur une liste. Pour filtrer les éléments contenant la phrase "choco" :

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call filter(sweeterList, 'v:val !~ "choco"')
:echo sweeterList
" renvoie ["glazed", "strawberry"]

:let sweetestList = ["chocolate", "glazed", "sugar"]
:call map(sweetestList, 'v:val . " donut"')
:echo sweetestList
" renvoie ['chocolate donut', 'glazed donut', 'sugar donut']
```

La variable `v:val` est une variable spéciale de Vim. Elle est disponible lors de l'itération sur une liste ou un dictionnaire en utilisant `map()` ou `filter()`. Elle représente chaque élément itéré.

Pour plus d'informations, consultez `:h list-functions`.

### Déballage de Liste

Vous pouvez déballer une liste et assigner des variables aux éléments de la liste :

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let [flavor1, flavor2, flavor3] = favoriteFlavor

:echo flavor1
" renvoie "chocolate"

:echo flavor2
" renvoie "glazed"
```

Pour assigner le reste des éléments de la liste, vous pouvez utiliser `;` suivi d'un nom de variable :

```shell
:let favoriteFruits = ["apple", "banana", "lemon", "blueberry", "raspberry"]
:let [fruit1, fruit2; restFruits] = favoriteFruits

:echo fruit1
" renvoie "apple"

:echo restFruits
" renvoie ['lemon', 'blueberry', 'raspberry']
```

### Modification de Liste

Vous pouvez modifier directement un élément de la liste :

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[0] = "sugar"
:echo favoriteFlavor
" renvoie ['sugar', 'glazed', 'plain']
```

Vous pouvez modifier plusieurs éléments de la liste directement :

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[2:] = ["strawberry", "chocolate"]
:echo favoriteFlavor
" renvoie ['chocolate', 'glazed', 'strawberry', 'chocolate']
```

## Dictionnaire

Un dictionnaire Vimscript est une liste associative et non ordonnée. Un dictionnaire non vide se compose d'au moins une paire clé-valeur.

```shell
{"breakfast": "waffles", "lunch": "pancakes"}
{"meal": ["breakfast", "second breakfast", "third breakfast"]}
{"dinner": 1, "dessert": 2}
```

Un objet de données de dictionnaire Vim utilise une chaîne pour la clé. Si vous essayez d'utiliser un nombre, Vim le convertira en chaîne.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}

:echo breakfastNo
" renvoie {'1': '7am', '2': '9am', '11ses': '11am'}
```

Si vous êtes trop paresseux pour mettre des guillemets autour de chaque clé, vous pouvez utiliser la notation `#{}` :

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo mealPlans
" renvoie {'lunch': 'pancakes', 'breakfast': 'waffles', 'dinner': 'donuts'}
```

La seule exigence pour utiliser la syntaxe `#{}` est que chaque clé doit être soit :

- Un caractère ASCII.
- Un chiffre.
- Un underscore (`_`).
- Un tiret (`-`).

Tout comme une liste, vous pouvez utiliser n'importe quel type de données comme valeurs.

```shell
:let mealPlan = {"breakfast": ["pancake", "waffle", "hash brown"], "lunch": WhatsForLunch(), "dinner": {"appetizer": "gruel", "entree": "more gruel"}}
```

### Accéder au Dictionnaire

Pour accéder à une valeur d'un dictionnaire, vous pouvez appeler la clé avec soit les crochets (`['key']`), soit la notation par point (`.key`).

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches", "dinner": "more gruel"}

:let breakfast = meal['breakfast']
:let lunch = meal.lunch

:echo breakfast
" renvoie "gruel omelettes"

:echo lunch
" renvoie "gruel sandwiches"
```

### Modification du Dictionnaire

Vous pouvez modifier ou même ajouter un contenu au dictionnaire :

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches"}

:let meal.breakfast = "breakfast tacos"
:let meal["lunch"] = "tacos al pastor"
:let meal["dinner"] = "quesadillas"

:echo meal
" renvoie {'lunch': 'tacos al pastor', 'breakfast': 'breakfast tacos', 'dinner': 'quesadillas'}
```

### Fonctions de Dictionnaire

Explorons certaines des fonctions intégrées de Vim pour gérer les dictionnaires.

Pour vérifier la longueur d'un dictionnaire, utilisez `len()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo len(mealPlans)
" renvoie 3
```

Pour voir si un dictionnaire contient une clé spécifique, utilisez `has_key()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo has_key(mealPlans, "breakfast")
" renvoie 1

:echo has_key(mealPlans, "dessert")
" renvoie 0
```

Pour voir si un dictionnaire a un élément, utilisez `empty()`. La procédure `empty()` fonctionne avec tous les types de données : liste, dictionnaire, chaîne, nombre, flottant, etc.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:let noMealPlan = {}

:echo empty(noMealPlan)
" renvoie 1

:echo empty(mealPlans)
" renvoie 0
```

Pour supprimer une entrée d'un dictionnaire, utilisez `remove()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo "suppression du petit-déjeuner : " . remove(mealPlans, "breakfast")
" renvoie "suppression du petit-déjeuner : 'waffles'"

:echo mealPlans
" renvoie {'lunch': 'pancakes', 'dinner': 'donuts'}
```

Pour convertir un dictionnaire en une liste de listes, utilisez `items()` :

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo items(mealPlans)
" renvoie [['lunch', 'pancakes'], ['breakfast', 'waffles'], ['dinner', 'donuts']]
```

`filter()` et `map()` sont également disponibles.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}
:call filter(breakfastNo, 'v:key > 1')

:echo breakfastNo
" renvoie {'2': '9am', '11ses': '11am'}
```

Puisqu'un dictionnaire contient des paires clé-valeur, Vim fournit la variable spéciale `v:key` qui fonctionne de manière similaire à `v:val`. Lors de l'itération à travers un dictionnaire, `v:key` contiendra la valeur de la clé actuellement itérée.

Si vous avez un dictionnaire `mealPlans`, vous pouvez le mapper en utilisant `v:key`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:key . " et du lait"')

:echo mealPlans
" renvoie {'lunch': 'lunch et du lait', 'breakfast': 'breakfast et du lait', 'dinner': 'dinner et du lait'}
```

De même, vous pouvez le mapper en utilisant `v:val` :

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:val . " et du lait"')

:echo mealPlans
" renvoie {'lunch': 'pancakes et du lait', 'breakfast': 'waffles et du lait', 'dinner': 'donuts et du lait'}
```

Pour voir plus de fonctions de dictionnaire, consultez `:h dict-functions`.

## Primitives Spéciales

Vim a des primitives spéciales :

- `v:false`
- `v:true`
- `v:none`
- `v:null`

Au fait, `v:` est la variable intégrée de Vim. Elles seront couvertes plus en détail dans un chapitre ultérieur.

D'après mon expérience, vous n'utiliserez pas souvent ces primitives spéciales. Si vous avez besoin d'une valeur vraie/fausse, vous pouvez simplement utiliser 0 (faux) et non-0 (vrai). Si vous avez besoin d'une chaîne vide, utilisez simplement `""`. Mais il est toujours bon de le savoir, alors passons rapidement en revue.

### Vrai

Ceci est équivalent à `true`. C'est équivalent à un nombre avec une valeur non nulle. Lors du décodage json avec `json_encode()`, il est interprété comme "true".

```shell
:echo json_encode({"test": v:true})
" renvoie {"test": true}
```

### Faux

Ceci est équivalent à `false`. C'est équivalent à un nombre avec une valeur de 0. Lors du décodage json avec `json_encode()`, il est interprété comme "false".

```shell
:echo json_encode({"test": v:false})
" renvoie {"test": false}
```

### Aucun

C'est équivalent à une chaîne vide. Lors du décodage json avec `json_encode()`, il est interprété comme un élément vide (`null`).

```shell
:echo json_encode({"test": v:none})
" renvoie {"test": null}
```

### Null

Similaire à `v:none`.

```shell
:echo json_encode({"test": v:null})
" renvoie {"test": null}
```

## Apprenez les Types de Données de Manière Intelligente

Dans ce chapitre, vous avez appris les types de données de base de Vimscript : nombre, flottant, chaîne, liste, dictionnaire et spécial. Apprendre cela est la première étape pour commencer la programmation Vimscript.

Dans le prochain chapitre, vous apprendrez comment les combiner pour écrire des expressions comme des égalités, des conditionnelles et des boucles.