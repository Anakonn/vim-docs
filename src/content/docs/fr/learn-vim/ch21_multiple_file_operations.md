---
description: Découvrez comment éditer plusieurs fichiers dans Vim en utilisant différentes
  commandes, telles que `argdo`, `bufdo`, et `cdo`, pour améliorer votre efficacité.
title: Ch21. Multiple File Operations
---

Être capable de mettre à jour plusieurs fichiers est un autre outil d'édition utile à avoir. Plus tôt, vous avez appris comment mettre à jour plusieurs textes avec `cfdo`. Dans ce chapitre, vous apprendrez les différentes manières d'éditer plusieurs fichiers dans Vim.

## Différentes manières d'exécuter une commande dans plusieurs fichiers

Vim a huit façons d'exécuter des commandes à travers plusieurs fichiers :
- liste d'arguments (`argdo`)
- liste de tampons (`bufdo`)
- liste de fenêtres (`windo`)
- liste d'onglets (`tabdo`)
- liste de corrections rapides (`cdo`)
- liste de corrections rapides par fichier (`cfdo`)
- liste de localisation (`ldo`)
- liste de localisation par fichier (`lfdo`)

En pratique, vous n'utiliserez probablement qu'une ou deux de ces options la plupart du temps (personnellement, j'utilise `cdo` et `argdo` plus que les autres), mais il est bon d'apprendre toutes les options disponibles et d'utiliser celles qui correspondent à votre style d'édition.

Apprendre huit commandes peut sembler décourageant. Mais en réalité, ces commandes fonctionnent de manière similaire. Après avoir appris une, apprendre les autres deviendra plus facile. Elles partagent toutes la même grande idée : faire une liste de leurs catégories respectives puis leur passer la commande que vous souhaitez exécuter.

## Liste d'arguments

La liste d'arguments est la liste la plus basique. Elle crée une liste de fichiers. Pour créer une liste de file1, file2 et file3, vous pouvez exécuter :

```shell
:args file1 file2 file3
```

Vous pouvez également lui passer un caractère générique (`*`), donc si vous souhaitez créer une liste de tous les fichiers `.js` dans le répertoire actuel, exécutez :

```shell
:args *.js
```

Si vous souhaitez créer une liste de tous les fichiers Javascript qui commencent par "a" dans le répertoire actuel, exécutez :

```shell
:args a*.js
```

Le caractère générique correspond à un ou plusieurs caractères de nom de fichier dans le répertoire actuel, mais que faire si vous devez rechercher de manière récursive dans n'importe quel répertoire ? Vous pouvez utiliser le double caractère générique (`**`). Pour obtenir tous les fichiers Javascript à l'intérieur des répertoires de votre emplacement actuel, exécutez :

```shell
:args **/*.js
```

Une fois que vous exécutez la commande `args`, votre tampon actuel sera changé pour le premier élément de la liste. Pour afficher la liste des fichiers que vous venez de créer, exécutez `:args`. Une fois que vous avez créé votre liste, vous pouvez les parcourir. `:first` vous mettra sur le premier élément de la liste. `:last` vous mettra sur le dernier élément de la liste. Pour avancer dans la liste un fichier à la fois, exécutez `:next`. Pour reculer dans la liste un fichier à la fois, exécutez `:prev`. Pour avancer / reculer un fichier à la fois et sauvegarder les modifications, exécutez `:wnext` et `:wprev`. Il y a beaucoup d'autres commandes de navigation. Consultez `:h arglist` pour plus d'informations.

La liste d'arguments est utile si vous devez cibler un type de fichier spécifique ou quelques fichiers. Peut-être devez-vous mettre à jour tous les "donuts" en "crêpes" dans tous les fichiers `yml`, vous pouvez faire :

```shell
:args **/*.yml
:argdo %s/donut/pancake/g | update
```

Si vous exécutez à nouveau la commande `args`, elle remplacera la liste précédente. Par exemple, si vous avez précédemment exécuté :

```shell
:args file1 file2 file3
```

En supposant que ces fichiers existent, vous avez maintenant une liste de `file1`, `file2` et `file3`. Ensuite, vous exécutez ceci :

```shell
:args file4 file5
```

Votre liste initiale de `file1`, `file2` et `file3` est remplacée par `file4` et `file5`. Si vous avez `file1`, `file2` et `file3` dans votre liste d'arguments et que vous souhaitez *ajouter* `file4` et `file5` à votre liste de fichiers initiale, utilisez la commande `:arga`. Exécutez :

```shell
:arga file4 file5
```

Maintenant, vous avez `file1`, `file2`, `file3`, `file4` et `file5` dans votre liste d'arguments.

Si vous exécutez `:arga` sans aucun argument, Vim ajoutera votre tampon actuel à la liste d'arguments actuelle. Si vous avez déjà `file1`, `file2` et `file3` dans votre liste d'arguments et que votre tampon actuel est sur `file5`, exécuter `:arga` ajoutera `file5` à la liste.

Une fois que vous avez la liste, vous pouvez la passer avec n'importe quelle commande de ligne de commande de votre choix. Vous l'avez vu être fait avec la substitution (`:argdo %s/donut/pancake/g`). Quelques autres exemples :
- Pour supprimer toutes les lignes contenant "dessert" dans la liste d'arguments, exécutez `:argdo g/dessert/d`.
- Pour exécuter la macro a (en supposant que vous avez enregistré quelque chose dans la macro a) dans la liste d'arguments, exécutez `:argdo norm @a`.
- Pour écrire "hello " suivi du nom de fichier sur la première ligne, exécutez `:argdo 0put='hello ' .. @:`.

Une fois que vous avez terminé, n'oubliez pas de les sauvegarder avec `:update`.

Parfois, vous devez exécuter les commandes uniquement sur les n premiers éléments de la liste d'arguments. Si c'est le cas, il suffit de passer à la commande `argdo` une adresse. Par exemple, pour exécuter la commande de substitution uniquement sur les 3 premiers éléments de la liste, exécutez `:1,3argdo %s/donut/pancake/g`.

## Liste de tampons

La liste de tampons sera créée de manière organique lorsque vous éditez de nouveaux fichiers, car chaque fois que vous créez un nouveau fichier / ouvrez un fichier, Vim l'enregistre dans un tampon (à moins que vous ne le supprimiez explicitement). Donc, si vous avez déjà ouvert 3 fichiers : `file1.rb file2.rb file3.rb`, vous avez déjà 3 éléments dans votre liste de tampons. Pour afficher la liste de tampons, exécutez `:buffers` (alternativement : `:ls` ou `:files`). Pour parcourir en avant et en arrière, utilisez `:bnext` et `:bprev`. Pour aller au premier et au dernier tampon de la liste, utilisez `:bfirst` et `:blast` (vous vous amusez bien ? :D).

Au fait, voici une astuce de tampon cool sans rapport avec ce chapitre : si vous avez un certain nombre d'éléments dans votre liste de tampons, vous pouvez tous les afficher avec `:ball` (tampon tout). La commande `ball` affiche tous les tampons horizontalement. Pour les afficher verticalement, exécutez `:vertical ball`.

Revenons au sujet, la mécanique pour exécuter une opération à travers tous les tampons est similaire à la liste d'arguments. Une fois que vous avez créé votre liste de tampons, vous devez simplement préfixer la ou les commandes que vous souhaitez exécuter avec `:bufdo` au lieu de `:argdo`. Donc, si vous souhaitez substituer tous les "donuts" par "crêpes" dans tous les tampons puis sauvegarder les modifications, exécutez `:bufdo %s/donut/pancake/g | update`.

## Liste de fenêtres et d'onglets

Les listes de fenêtres et d'onglets sont également similaires à la liste d'arguments et à la liste de tampons. Les seules différences sont leur contexte et leur syntaxe.

Les opérations sur les fenêtres sont effectuées sur chaque fenêtre ouverte et se font avec `:windo`. Les opérations sur les onglets sont effectuées sur chaque onglet que vous avez ouvert et se font avec `:tabdo`. Pour plus d'informations, consultez `:h list-repeat`, `:h :windo` et `:h :tabdo`.

Par exemple, si vous avez trois fenêtres ouvertes (vous pouvez ouvrir de nouvelles fenêtres avec `Ctrl-W v` pour une fenêtre verticale et `Ctrl-W s` pour une fenêtre horizontale) et que vous exécutez `:windo 0put ='hello' . @%`, Vim affichera "hello" + nom de fichier dans toutes les fenêtres ouvertes.

## Liste de corrections rapides

Dans les chapitres précédents (Ch3 et Ch19), j'ai parlé des corrections rapides. Les corrections rapides ont de nombreuses utilisations. De nombreux plugins populaires utilisent des corrections rapides, il est donc bon de passer plus de temps à les comprendre.

Si vous êtes nouveau dans Vim, les corrections rapides peuvent être un nouveau concept. Dans les vieux jours où vous deviez explicitement compiler votre code, pendant la phase de compilation, vous rencontreriez des erreurs. Pour afficher ces erreurs, vous avez besoin d'une fenêtre spéciale. C'est là que les corrections rapides entrent en jeu. Lorsque vous compilez votre code, Vim affiche les messages d'erreur dans la fenêtre de corrections rapides afin que vous puissiez les corriger plus tard. De nombreuses langues modernes ne nécessitent plus de compilation explicite, mais cela ne rend pas les corrections rapides obsolètes. De nos jours, les gens utilisent les corrections rapides pour toutes sortes de choses, comme afficher la sortie d'un terminal virtuel et stocker les résultats de recherche. Concentrons-nous sur ce dernier point, le stockage des résultats de recherche.

En plus des commandes de compilation, certaines commandes Vim s'appuient sur les interfaces de corrections rapides. Un type de commande qui utilise fortement les corrections rapides est les commandes de recherche. Tant `:vimgrep` que `:grep` utilisent les corrections rapides par défaut.

Par exemple, si vous devez rechercher "donut" dans tous les fichiers Javascript de manière récursive, vous pouvez exécuter :

```shell
:vimgrep /donut/ **/*.js
```

Le résultat de la recherche "donut" est stocké dans la fenêtre de corrections rapides. Pour voir les résultats de correspondance dans la fenêtre de corrections rapides, exécutez :

```shell
:copen
```

Pour la fermer, exécutez :

```shell
:cclose
```

Pour parcourir la liste de corrections rapides en avant et en arrière, exécutez :

```shell
:cnext
:cprev
```

Pour aller au premier et au dernier élément de la correspondance, exécutez :

```shell
:cfirst
:clast
```

Plus tôt, j'ai mentionné qu'il y avait deux commandes de corrections rapides : `cdo` et `cfdo`. Quelle est la différence ? `cdo` exécute la commande pour chaque élément de la liste de corrections rapides tandis que `cfdo` exécute la commande pour chaque *fichier* dans la liste de corrections rapides.

Laissez-moi clarifier. Supposons qu'après avoir exécuté la commande `vimgrep` ci-dessus, vous ayez trouvé :
- 1 résultat dans `file1.js`
- 10 résultats dans `file2.js`

Si vous exécutez `:cfdo %s/donut/pancake/g`, cela exécutera effectivement `%s/donut/pancake/g` une fois dans `file1.js` et une fois dans `file2.js`. Cela s'exécute *autant de fois qu'il y a de fichiers dans la correspondance.* Puisqu'il y a deux fichiers dans les résultats, Vim exécute la commande de substitution une fois sur `file1.js` et une fois de plus sur `file2.js`, malgré le fait qu'il y ait 10 correspondances dans le deuxième fichier. `cfdo` ne se soucie que du nombre total de fichiers dans la liste de corrections rapides.

Si vous exécutez `:cdo %s/donut/pancake/g`, cela exécutera effectivement `%s/donut/pancake/g` une fois dans `file1.js` et *dix fois* dans `file2.js`. Cela s'exécute autant de fois qu'il y a d'éléments réels dans la liste de corrections rapides. Puisqu'il n'y a qu'une seule correspondance trouvée dans `file1.js` et 10 correspondances trouvées dans `file2.js`, cela s'exécutera un total de 11 fois.

Puisque vous avez exécuté `%s/donut/pancake/g`, il serait logique d'utiliser `cfdo`. Il n'était pas logique d'utiliser `cdo` car cela exécuterait `%s/donut/pancake/g` dix fois dans `file2.js` (`%s` est une substitution à l'échelle du fichier). Exécuter `%s` une fois par fichier est suffisant. Si vous aviez utilisé `cdo`, il aurait été plus logique de le passer avec `s/donut/pancake/g` à la place.

Lorsque vous décidez d'utiliser `cfdo` ou `cdo`, pensez à la portée de la commande que vous lui passez. S'agit-il d'une commande à l'échelle du fichier (comme `:%s` ou `:g`) ou d'une commande ligne par ligne (comme `:s` ou `:!`) ?

## Liste de localisation

La liste de localisation est similaire à la liste de corrections rapides en ce sens que Vim utilise également une fenêtre spéciale pour afficher des messages. La différence entre une liste de corrections rapides et une liste de localisation est qu'à tout moment, vous ne pouvez avoir qu'une seule liste de corrections rapides, tandis que vous pouvez avoir autant de listes de localisation que de fenêtres.

Supposons que vous ayez deux fenêtres ouvertes, une fenêtre affichant `food.txt` et une autre affichant `drinks.txt`. Depuis `food.txt`, vous exécutez une commande de recherche de liste de localisation `:lvimgrep` (la variante de localisation pour la commande `:vimgrep`) :

```shell
:lvim /bagel/ **/*.md
```

Vim créera une liste de localisation de toutes les correspondances de recherche de bagels pour cette fenêtre `food.txt`. Vous pouvez voir la liste de localisation avec `:lopen`. Maintenant, allez à l'autre fenêtre `drinks.txt` et exécutez :

```shell
:lvimgrep /milk/ **/*.md
```

Vim créera une *liste de localisation distincte* avec tous les résultats de recherche de lait pour cette fenêtre `drinks.txt`.

Pour chaque commande de localisation que vous exécutez dans chaque fenêtre, Vim crée une liste de localisation distincte. Si vous avez 10 fenêtres différentes, vous pouvez avoir jusqu'à 10 listes de localisation différentes. Contrairement à la liste de corrections rapides où vous ne pouvez en avoir qu'une à la fois. Si vous avez 10 fenêtres différentes, vous n'obtenez toujours qu'une seule liste de corrections rapides.

La plupart des commandes de liste de localisation sont similaires aux commandes de corrections rapides, sauf qu'elles sont préfixées par `l-` à la place. Par exemple : `:lvimgrep`, `:lgrep` et `:lmake` contre `:vimgrep`, `:grep` et `:make`. Pour manipuler la fenêtre de liste de localisation, encore une fois, les commandes ressemblent à celles des commandes de corrections rapides `:lopen`, `:lclose`, `:lfirst`, `:llast`, `:lnext` et `:lprev` contre `:copen`, `:cclose`, `:cfirst`, `:clast`, `:cnext` et `:cprev`.

Les deux commandes multi-fichiers de la liste de localisation sont également similaires aux commandes multi-fichiers de corrections rapides : `:ldo` et `:lfdo`. `:ldo` exécute la commande de localisation dans chaque liste de localisation tandis que `:lfdo` exécute la commande de liste de localisation pour chaque fichier dans la liste de localisation. Pour plus d'informations, consultez `:h location-list`.
## Exécution d'opérations sur plusieurs fichiers dans Vim

Savoir comment effectuer une opération sur plusieurs fichiers est une compétence utile en édition. Chaque fois que vous devez changer le nom d'une variable dans plusieurs fichiers, vous souhaitez les exécuter d'un seul coup. Vim propose huit façons différentes de le faire.

Pratiquement parlant, vous ne utiliserez probablement pas les huit de manière égale. Vous vous tournerez vers une ou deux. Lorsque vous débutez, choisissez-en une (je suggère personnellement de commencer par la liste des arguments `:argdo`) et maîtrisez-la. Une fois que vous êtes à l'aise avec l'une, apprenez la suivante. Vous constaterez que l'apprentissage de la deuxième, troisième, quatrième devient plus facile. Soyez créatif. Utilisez-le avec différentes combinaisons. Continuez à pratiquer jusqu'à ce que vous puissiez le faire sans effort et sans trop réfléchir. Faites-en partie de votre mémoire musculaire.

Cela dit, vous avez maîtrisé l'édition dans Vim. Félicitations !