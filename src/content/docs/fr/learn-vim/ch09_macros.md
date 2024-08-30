---
description: Découvrez comment utiliser les macros dans Vim pour automatiser des tâches
  répétitives et rendre l'édition de fichiers plus efficace et impressionnante.
title: Ch09. Macros
---

Lorsque vous éditez des fichiers, vous pouvez vous retrouver à répéter les mêmes actions. Ne serait-il pas agréable de pouvoir effectuer ces actions une fois et de les rejouer chaque fois que vous en avez besoin ? Avec les macros Vim, vous pouvez enregistrer des actions et les stocker dans des registres Vim pour les exécuter chaque fois que vous en avez besoin.

Dans ce chapitre, vous apprendrez à utiliser des macros pour automatiser des tâches banales (de plus, c'est impressionnant de voir votre fichier s'éditer tout seul).

## Macros de base

Voici la syntaxe de base d'une macro Vim :

```shell
qa                     Commencer à enregistrer une macro dans le registre a
q (pendant l'enregistrement)    Arrêter l'enregistrement de la macro
```

Vous pouvez choisir n'importe quelle lettre minuscule (a-z) pour stocker des macros. Voici comment vous pouvez exécuter une macro :

```shell
@a    Exécuter la macro du registre a
@@    Exécuter la dernière macro exécutée
```

Supposons que vous ayez ce texte et que vous souhaitiez mettre en majuscules tout sur chaque ligne :

```shell
hello
vim
macros
are
awesome
```

Avec votre curseur au début de la ligne "hello", exécutez :

```shell
qa0gU$jq
```

La décomposition :
- `qa` commence à enregistrer une macro dans le registre a.
- `0` va au début de la ligne.
- `gU$` met en majuscules le texte de votre position actuelle jusqu'à la fin de la ligne.
- `j` descend d'une ligne.
- `q` arrête l'enregistrement.

Pour le rejouer, exécutez `@a`. Comme beaucoup d'autres commandes Vim, vous pouvez passer un argument de compte aux macros. Par exemple, exécuter `3@a` exécute la macro trois fois.

## Garde de sécurité

L'exécution de la macro se termine automatiquement lorsqu'elle rencontre une erreur. Supposons que vous ayez ce texte :

```shell
a. donut au chocolat
b. donut mochi
c. donut au sucre en poudre
d. donut nature
```

Si vous souhaitez mettre en majuscules le premier mot de chaque ligne, cette macro devrait fonctionner :

```shell
qa0W~jq
```

Voici la décomposition de la commande ci-dessus :
- `qa` commence à enregistrer une macro dans le registre a.
- `0` va au début de la ligne.
- `W` va au mot suivant.
- `~` bascule la casse du caractère sous le curseur.
- `j` descend d'une ligne.
- `q` arrête l'enregistrement.

Je préfère surévaluer l'exécution de ma macro plutôt que de la sous-évaluer, donc je l'appelle généralement quatre-vingt-dix-neuf fois (`99@a`). Avec cette commande, Vim n'exécute pas réellement cette macro quatre-vingt-dix-neuf fois. Lorsque Vim atteint la dernière ligne et exécute le mouvement `j`, il ne trouve plus de ligne à descendre, lance une erreur et arrête l'exécution de la macro.

Le fait que l'exécution de la macro s'arrête à la première rencontre d'une erreur est une bonne fonctionnalité, sinon Vim continuerait à exécuter cette macro quatre-vingt-dix-neuf fois même s'il a déjà atteint la fin de la ligne.

## Macro de ligne de commande

Exécuter `@a` en mode normal n'est pas la seule façon d'exécuter des macros dans Vim. Vous pouvez également exécuter la ligne de commande `:normal @a`. `:normal` permet à l'utilisateur d'exécuter n'importe quelle commande du mode normal passée en argument. Dans le cas ci-dessus, c'est la même chose que d'exécuter `@a` depuis le mode normal.

La commande `:normal` accepte des plages comme arguments. Vous pouvez l'utiliser pour exécuter une macro dans des plages sélectionnées. Si vous souhaitez exécuter votre macro entre les lignes 2 et 3, vous pouvez exécuter `:2,3 normal @a`.

## Exécution d'une macro sur plusieurs fichiers

Supposons que vous ayez plusieurs fichiers `.txt`, chacun contenant des textes. Votre tâche consiste à mettre en majuscules le premier mot uniquement sur les lignes contenant le mot "donut". Supposons que vous ayez `0W~j` dans le registre a (la même macro que précédemment). Comment pouvez-vous accomplir cela rapidement ?

Premier fichier :

```shell
## savory.txt
a. donut au cheddar jalapeño
b. donut mac n cheese
c. ravioli frit
```

Deuxième fichier :

```shell
## sweet.txt
a. donut au chocolat
b. crêpe au chocolat
c. donut au sucre en poudre
```

Troisième fichier :

```shell
## plain.txt
a. pain de blé
b. donut nature
```

Voici comment vous pouvez le faire :
- `:args *.txt` pour trouver tous les fichiers `.txt` dans votre répertoire actuel.
- `:argdo g/donut/normal @a` exécute la commande globale `g/donut/normal @a` sur chaque fichier dans `:args`.
- `:argdo update` exécute la commande `update` pour enregistrer chaque fichier dans `:args` lorsque le tampon a été modifié.

Si vous n'êtes pas familier avec la commande globale `:g/donut/normal @a`, elle exécute la commande que vous donnez (`normal @a`) sur les lignes qui correspondent au motif (`/donut/`). Je passerai en revue la commande globale dans un chapitre ultérieur.

## Macro récursive

Vous pouvez exécuter récursivement une macro en appelant le même registre de macro tout en enregistrant cette macro. Supposons que vous ayez cette liste à nouveau et que vous deviez basculer la casse du premier mot :

```shell
a. donut au chocolat
b. donut mochi
c. donut au sucre en poudre
d. donut nature
```

Cette fois, faisons-le de manière récursive. Exécutez :

```shell
qaqqa0W~j@aq
```

Voici la décomposition des étapes :
- `qaq` enregistre une macro vide a. Il est nécessaire de commencer avec un registre vide car lorsque vous appelez récursivement la macro, elle exécutera tout ce qui se trouve dans ce registre.
- `qa` commence à enregistrer dans le registre a.
- `0` va au premier caractère de la ligne actuelle.
- `W` va au mot suivant.
- `~` bascule la casse du caractère sous le curseur.
- `j` descend d'une ligne.
- `@a` exécute la macro a.
- `q` arrête l'enregistrement.

Maintenant, vous pouvez simplement exécuter `@a` et regarder Vim exécuter la macro de manière récursive.

Comment la macro savait-elle quand s'arrêter ? Lorsque la macro était sur la dernière ligne, elle a essayé d'exécuter `j`, et comme il n'y avait plus de ligne à descendre, elle a arrêté l'exécution de la macro.

## Ajouter une macro

Si vous devez ajouter des actions à une macro existante, au lieu de recréer la macro depuis le début, vous pouvez ajouter des actions à une existante. Dans le chapitre sur les registres, vous avez appris que vous pouvez ajouter à un registre nommé en utilisant son symbole en majuscule. La même règle s'applique. Pour ajouter des actions à une macro de registre, utilisez le registre A.

Enregistrez une macro dans le registre a : `qa0W~q` (cette séquence bascule la casse du prochain MOT dans une ligne). Si vous souhaitez ajouter une nouvelle séquence pour également ajouter un point à la fin de la ligne, exécutez :

```shell
qAA.<Esc>q
```

La décomposition :
- `qA` commence à enregistrer la macro dans le registre A.
- `A.<Esc>` insère à la fin de la ligne (ici `A` est la commande du mode insertion, à ne pas confondre avec la macro A) un point, puis quitte le mode insertion.
- `q` arrête l'enregistrement de la macro.

Maintenant, lorsque vous exécutez `@a`, cela non seulement bascule la casse du prochain MOT, mais ajoute également un point à la fin de la ligne.

## Modifier une macro

Que faire si vous devez ajouter de nouvelles actions au milieu d'une macro ?

Supposons que vous ayez une macro qui bascule le premier mot réel et ajoute un point à la fin de la ligne, `0W~A.<Esc>` dans le registre a. Supposons qu'entre la mise en majuscules du premier mot et l'ajout d'un point à la fin de la ligne, vous deviez ajouter le mot "deep fried" juste avant le mot "donut" *(car la seule chose meilleure que les donuts ordinaires sont les donuts frits)*.

Je vais réutiliser le texte de la section précédente :
```shell
a. donut au chocolat
b. donut mochi
c. donut au sucre en poudre
d. donut nature
```

D'abord, appelons la macro existante (supposons que vous ayez conservé la macro de la section précédente dans le registre a) avec `:put a` :

```shell
0W~A.^[
```

Qu'est-ce que ce `^[` ? N'avez-vous pas fait `0W~A.<Esc>` ? Où est le `<Esc>` ? `^[` est la représentation *interne* de Vim de `<Esc>`. Avec certaines touches spéciales, Vim imprime la représentation de ces touches sous forme de codes internes. Certaines touches courantes qui ont des représentations de codes internes sont `<Esc>`, `<Backspace>`, et `<Enter>`. Il y a d'autres touches spéciales, mais elles ne sont pas dans le champ de ce chapitre.

Revenons à la macro, juste après l'opérateur de basculement de casse (`~`), ajoutons les instructions pour aller à la fin de la ligne (`$`), revenir d'un mot (`b`), aller en mode insertion (`i`), taper "deep fried " (n'oubliez pas l'espace après "fried "), et quitter le mode insertion (`<Esc>`).

Voici ce que vous obtiendrez :

```shell
0W~$bideep fried <Esc>A.^[
```

Il y a un petit problème. Vim ne comprend pas `<Esc>`. Vous ne pouvez pas taper littéralement `<Esc>`. Vous devrez écrire la représentation de code interne pour la touche `<Esc>`. En mode insertion, vous appuyez sur `Ctrl-V` suivi de `<Esc>`. Vim imprimera `^[`. `Ctrl-V` est un opérateur du mode insertion pour insérer le prochain caractère non numérique *littéralement*. Votre code de macro devrait maintenant ressembler à ceci :

```shell
0W~$bideep fried ^[A.^[
```

Pour ajouter l'instruction modifiée dans le registre a, vous pouvez le faire de la même manière que l'ajout d'une nouvelle entrée dans un registre nommé. Au début de la ligne, exécutez `"ay$` pour stocker le texte copié dans le registre a.

Maintenant, lorsque vous exécutez `@a`, votre macro basculera la casse du premier mot, ajoutera "deep fried " avant "donut", et ajoutera un "." à la fin de la ligne. Miam !

Une autre façon de modifier une macro est d'utiliser une expression de ligne de commande. Faites `:let @a="`, puis faites `Ctrl-R a`, cela collera littéralement le contenu du registre a. Enfin, n'oubliez pas de fermer les guillemets doubles (`"`). Vous pourriez avoir quelque chose comme `:let @a="0W~$bideep fried ^[A.^["`.

## Redondance de macro

Vous pouvez facilement dupliquer des macros d'un registre à un autre. Par exemple, pour dupliquer une macro du registre a au registre z, vous pouvez faire `:let @z = @a`. `@a` représente le contenu du registre a. Maintenant, si vous exécutez `@z`, cela effectue exactement les mêmes actions que `@a`.

Je trouve utile de créer une redondance sur mes macros les plus fréquemment utilisées. Dans mon flux de travail, j'enregistre généralement des macros dans les sept premières lettres de l'alphabet (a-g) et je les remplace souvent sans trop réfléchir. Si je déplace les macros utiles vers la fin de l'alphabet, je peux les préserver sans m'inquiéter de les remplacer accidentellement.

## Macro en série vs parallèle

Vim peut exécuter des macros en série et en parallèle. Supposons que vous ayez ce texte :

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

Si vous souhaitez enregistrer une macro pour mettre en minuscules tous les "FUNC" en majuscules, cette macro devrait fonctionner :

```shell
qa0f{gui{jq
```

La décomposition :
- `qa` commence à enregistrer dans le registre a.
- `0` va à la première ligne.
- `f{` trouve la première instance de "{".
- `gui{` met en minuscules (`gu`) le texte à l'intérieur de l'objet texte entre crochets (`i{`).
- `j` descend d'une ligne.
- `q` arrête l'enregistrement de la macro.

Maintenant, vous pouvez exécuter `99@a` pour l'exécuter sur les lignes restantes. Cependant, que se passe-t-il si vous avez cette expression d'importation dans votre fichier ?

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import foo from "bar";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

L'exécution de `99@a` n'exécute la macro que trois fois. Elle n'exécute pas la macro sur les deux dernières lignes car l'exécution échoue à exécuter `f{` sur la ligne "foo". Cela est attendu lors de l'exécution de la macro en série. Vous pouvez toujours aller à la ligne suivante où se trouve "FUNC4" et rejouer cette macro. Mais que faire si vous souhaitez tout faire en une seule fois ?

Exécutez la macro en parallèle.

Rappelez-vous de la section précédente que les macros peuvent être exécutées en utilisant la commande de ligne de commande `:normal` (ex : `:3,5 normal @a` exécute la macro a sur les lignes 3-5). Si vous exécutez `:1,$ normal @a`, vous verrez que la macro est exécutée sur toutes les lignes sauf la ligne "foo". Ça marche !

Bien que, en interne, Vim n'exécute pas réellement les macros en parallèle, extérieurement, cela se comporte comme tel. Vim exécute `@a` *indépendamment* sur chaque ligne de la première à la dernière ligne (`1,$`). Puisque Vim exécute ces macros indépendamment, chaque ligne ne sait pas qu'une des exécutions de la macro a échoué sur la ligne "foo".
## Apprenez les macros de manière intelligente

De nombreuses actions que vous effectuez lors de l'édition sont répétitives. Pour vous améliorer en édition, habituez-vous à détecter les actions répétitives. Utilisez des macros (ou la commande point) afin de ne pas avoir à effectuer la même action deux fois. Presque tout ce que vous pouvez faire dans Vim peut être reproduit avec des macros.

Au début, je trouve qu'il est très difficile d'écrire des macros, mais ne vous découragez pas. Avec suffisamment de pratique, vous prendrez l'habitude d'automatiser tout.

Vous pourriez trouver utile d'utiliser des mnémoniques pour vous aider à vous souvenir de vos macros. Si vous avez une macro qui crée une fonction, utilisez le registre "f (`qf`). Si vous avez une macro pour des opérations numériques, le registre "n devrait fonctionner (`qn`). Nommez-la avec le *premier registre nommé* qui vous vient à l'esprit lorsque vous pensez à cette opération. Je trouve également que le registre "q est un bon registre de macro par défaut car `qq` nécessite moins de puissance cérébrale pour y penser. Enfin, j'aime aussi incrémenter mes macros par ordre alphabétique, comme `qa`, puis `qb`, puis `qc`, et ainsi de suite.

Trouvez une méthode qui fonctionne le mieux pour vous.