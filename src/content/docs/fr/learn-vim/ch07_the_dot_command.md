---
description: Ce document explique comment utiliser la commande point dans Vim pour
  répéter facilement les modifications précédentes, simplifiant ainsi les répétitions.
title: Ch07. the Dot Command
---

En général, vous devriez essayer d'éviter de refaire ce que vous venez de faire chaque fois que cela est possible. Dans ce chapitre, vous apprendrez à utiliser la commande point pour refaire facilement le changement précédent. C'est une commande polyvalente pour réduire les répétitions simples.

## Utilisation

Tout comme son nom l'indique, vous pouvez utiliser la commande point en appuyant sur la touche point (`.`).

Par exemple, si vous souhaitez remplacer tous les "let" par "const" dans les expressions suivantes :

```shell
let one = "1";
let two = "2";
let three = "3";
```

- Recherchez avec `/let` pour aller à la correspondance.
- Changez avec `cwconst<Esc>` pour remplacer "let" par "const".
- Naviguez avec `n` pour trouver la correspondance suivante en utilisant la recherche précédente.
- Répétez ce que vous venez de faire avec la commande point (`.`).
- Continuez à appuyer sur `n . n .` jusqu'à ce que vous remplaciez chaque mot.

Ici, la commande point a répété la séquence `cwconst<Esc>`. Cela vous a évité de taper huit frappes de touches en échange d'une seule.

## Qu'est-ce qu'un changement ?

Si vous regardez la définition de la commande point (`:h .`), il est dit que la commande point répète le dernier changement. Qu'est-ce qu'un changement ?

Chaque fois que vous mettez à jour (ajoutez, modifiez ou supprimez) le contenu du tampon actuel, vous effectuez un changement. Les exceptions sont les mises à jour effectuées par des commandes en ligne de commande (les commandes commençant par `:`) qui ne comptent pas comme un changement.

Dans le premier exemple, `cwconst<Esc>` était le changement. Maintenant, supposons que vous ayez ce texte :

```shell
pancake, potatoes, fruit-juice,
```

Pour supprimer le texte du début de la ligne jusqu'à la prochaine occurrence d'une virgule, supprimez d'abord jusqu'à la virgule, puis répétez deux fois avec `df,..`. 

Essayons un autre exemple :

```shell
pancake, potatoes, fruit-juice,
```

Cette fois, votre tâche est de supprimer la virgule, pas les éléments du petit-déjeuner. Avec le curseur au début de la ligne, allez à la première virgule, supprimez-la, puis répétez deux fois avec `f,x..` Facile, non ? Attendez une minute, cela n'a pas fonctionné ! Pourquoi ?

Un changement exclut les mouvements car il ne met pas à jour le contenu du tampon. La commande `f,x` consistait en deux actions : la commande `f,` pour déplacer le curseur vers "," et `x` pour supprimer un caractère. Seule la dernière, `x`, a causé un changement. Contrairement à `df,` de l'exemple précédent. Dans celui-ci, `f,` est une directive pour l'opérateur de suppression `d`, pas un mouvement pour déplacer le curseur. Le `f,` dans `df,` et `f,x` ont deux rôles très différents.

Terminons la dernière tâche. Après avoir exécuté `f,` puis `x`, allez à la prochaine virgule avec `;` pour répéter le dernier `f`. Enfin, utilisez `.` pour supprimer le caractère sous le curseur. Répétez `; . ; .` jusqu'à ce que tout soit supprimé. La commande complète est `f,x;.;.`.

Essayons un autre :

```shell
pancake
potatoes
fruit-juice
```

Ajoutons une virgule à la fin de chaque ligne. En commençant par la première ligne, faites `A,<Esc>j`. À ce stade, vous réalisez que `j` ne cause pas de changement. Le changement ici est seulement `A,`. Vous pouvez vous déplacer et répéter le changement avec `j . j .`. La commande complète est `A,<Esc>j.j.`.

Chaque action depuis le moment où vous appuyez sur l'opérateur de commande d'insertion (`A`) jusqu'à ce que vous quittiez la commande d'insertion (`<Esc>`) est considérée comme un changement.

## Répétition sur plusieurs lignes

Supposons que vous ayez ce texte :

```shell
let one = "1";
let two = "2";
let three = "3";
const foo = "bar';
let four = "4";
let five = "5";
let six = "6";
let seven = "7";
let eight = "8";
let nine = "9";
```

Votre objectif est de supprimer toutes les lignes sauf la ligne "foo". D'abord, supprimez les trois premières lignes avec `d2j`, puis allez à la ligne en dessous de la ligne "foo". Sur la ligne suivante, utilisez la commande point deux fois. La commande complète est `d2jj..`.

Ici, le changement était `d2j`. Dans ce contexte, `2j` n'était pas un mouvement, mais une partie de l'opérateur de suppression.

Regardons un autre exemple :

```shell
zlet zzone = "1";
zlet zztwo = "2";
zlet zzthree = "3";
let four = "4";
```

Supprimons tous les z. En commençant par le premier caractère de la première ligne, sélectionnez visuellement seulement le premier z des trois premières lignes avec le mode visuel en bloc (`Ctrl-Vjj`). Si vous n'êtes pas familier avec le mode visuel en bloc, je les couvrirais dans un chapitre ultérieur. Une fois que vous avez les trois z visuellement sélectionnés, supprimez-les avec l'opérateur de suppression (`d`). Ensuite, déplacez-vous vers le mot suivant (`w`) pour le prochain z. Répétez le changement deux fois de plus (`..`). La commande complète est `Ctrl-vjjdw..`.

Lorsque vous avez supprimé une colonne de trois z (`Ctrl-vjjd`), cela a été compté comme un changement. L'opération en mode visuel peut être utilisée pour cibler plusieurs lignes dans le cadre d'un changement.

## Inclure un mouvement dans un changement

Revenons au premier exemple de ce chapitre. Rappelez-vous que la commande `/letcwconst<Esc>` suivie de `n . n .` a remplacé tous les "let" par "const" dans les expressions suivantes :

```shell
let one = "1";
let two = "2";
let three = "3";
```

Il existe un moyen plus rapide d'accomplir cela. Après avoir recherché `/let`, exécutez `cgnconst<Esc>` puis `. .`.

`gn` est un mouvement qui recherche en avant le dernier motif de recherche (dans ce cas, `/let`) et met automatiquement en surbrillance visuelle. Pour remplacer la prochaine occurrence, vous n'avez plus besoin de vous déplacer et de répéter le changement (`n . n .`), mais seulement de répéter (`. .`). Vous n'avez plus besoin d'utiliser des mouvements de recherche car la recherche de la prochaine correspondance fait maintenant partie du changement !

Lorsque vous éditez, soyez toujours à l'affût des mouvements qui peuvent faire plusieurs choses à la fois comme `gn` chaque fois que cela est possible.

## Apprenez la commande point de manière intelligente

La puissance de la commande point vient de l'échange de plusieurs frappes de touches pour une seule. Il n'est probablement pas rentable d'utiliser la commande point pour des opérations à touche unique comme `x`. Si votre dernier changement nécessite une opération complexe comme `cgnconst<Esc>`, la commande point réduit neuf frappes de touches à une, un échange très rentable.

Lorsque vous éditez, pensez à la répétabilité. Par exemple, si je dois supprimer les trois mots suivants, est-il plus économique d'utiliser `d3w` ou de faire `dw` puis `.` deux fois ? Allez-vous supprimer un mot à nouveau ? Si oui, alors cela a du sens d'utiliser `dw` et de le répéter plusieurs fois au lieu de `d3w` parce que `dw` est plus réutilisable que `d3w`. 

La commande point est une commande polyvalente pour automatiser des changements simples. Dans un chapitre ultérieur, vous apprendrez comment automatiser des actions plus complexes avec les macros Vim. Mais d'abord, apprenons à propos des registres pour stocker et récupérer du texte.