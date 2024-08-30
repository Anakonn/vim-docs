---
description: Ce document explique comment utiliser les plis dans Vim pour masquer
  des textes inutiles, en détaillant les commandes manuelles pour créer et gérer les
  plis.
title: Ch17. Fold
---

Lorsque vous lisez un fichier, il y a souvent de nombreux textes non pertinents qui vous empêchent de comprendre ce que fait ce fichier. Pour cacher le bruit inutile, utilisez le pliage Vim.

Dans ce chapitre, vous apprendrez différentes manières de plier un fichier.

## Pliage Manuel

Imaginez que vous pliez une feuille de papier pour couvrir un texte. Le texte réel ne disparaît pas, il est toujours là. Le pliage Vim fonctionne de la même manière. Il plie une plage de texte, la cachant de l'affichage sans réellement la supprimer.

L'opérateur de pliage est `z` (lorsqu'un papier est plié, il a la forme de la lettre z).

Supposons que vous ayez ce texte :

```shell
Plie-moi
Tiens-moi
```

Avec le curseur sur la première ligne, tapez `zfj`. Vim plie les deux lignes en une seule. Vous devriez voir quelque chose comme ceci :

```shell
+-- 2 lignes : Plie-moi -----
```

Voici le détail :
- `zf` est l'opérateur de pliage.
- `j` est le mouvement pour l'opérateur de pliage.

Vous pouvez ouvrir un texte plié avec `zo`. Pour fermer le pli, utilisez `zc`.

Le pli est un opérateur, donc il suit la règle grammaticale (`verbe + nom`). Vous pouvez passer l'opérateur de pliage avec un mouvement ou un objet texte. Pour plier un paragraphe intérieur, exécutez `zfip`. Pour plier jusqu'à la fin d'un fichier, exécutez `zfG`. Pour plier les textes entre `{` et `}`, exécutez `zfa{`.

Vous pouvez plier depuis le mode visuel. Mettez en surbrillance la zone que vous souhaitez plier (`v`, `V`, ou `Ctrl-v`), puis exécutez `zf`.

Vous pouvez exécuter un pliage depuis le mode ligne de commande avec la commande `:fold`. Pour plier la ligne actuelle et la ligne suivante, exécutez :

```shell
:,+1fold
```

`,+1` est la plage. Si vous ne passez pas de paramètres à la plage, elle par défaut à la ligne actuelle. `+1` est l'indicateur de plage pour la ligne suivante. Pour plier les lignes 5 à 10, exécutez `:5,10fold`. Pour plier de la position actuelle à la fin de la ligne, exécutez `:,$fold`.

Il existe de nombreuses autres commandes de pliage et de dépliage. Je les trouve trop nombreuses à retenir lorsque je commence. Les plus utiles sont :
- `zR` pour ouvrir tous les plis.
- `zM` pour fermer tous les plis.
- `za` pour basculer un pli.

Vous pouvez exécuter `zR` et `zM` sur n'importe quelle ligne, mais `za` ne fonctionne que lorsque vous êtes sur une ligne pliée / dépliée. Pour en savoir plus sur les commandes de pliage, consultez `:h fold-commands`.

## Différentes Méthodes de Pliage

La section ci-dessus couvre le pliage manuel de Vim. Il existe six méthodes de pliage différentes dans Vim :
1. Manuel
2. Indentation
3. Expression
4. Syntaxe
5. Diff
6. Marqueur

Pour voir quelle méthode de pliage vous utilisez actuellement, exécutez `:set foldmethod?`. Par défaut, Vim utilise la méthode `manuelle`.

Dans le reste du chapitre, vous apprendrez les cinq autres méthodes de pliage. Commençons par le pliage par indentation.

## Pliage par Indentation

Pour utiliser un pliage par indentation, changez le `'foldmethod'` en indentation :

```shell
:set foldmethod=indent
```

Supposons que vous ayez le texte :

```shell
Un
  Deux
  Deux encore
```

Si vous exécutez `:set foldmethod=indent`, vous verrez :

```shell
Un
+-- 2 lignes : Deux -----
```

Avec le pliage par indentation, Vim regarde combien d'espaces chaque ligne a au début et les compare avec l'option `'shiftwidth'` pour déterminer sa pliabilité. `'shiftwidth'` renvoie le nombre d'espaces requis pour chaque étape de l'indentation. Si vous exécutez :

```shell
:set shiftwidth?
```

La valeur par défaut de `'shiftwidth'` de Vim est 2. Sur le texte ci-dessus, il y a deux espaces entre le début de la ligne et le texte "Deux" et "Deux encore". Lorsque Vim voit le nombre d'espaces et que la valeur de `'shiftwidth'` est 2, Vim considère que cette ligne a un niveau de pliage d'indentation d'un.

Supposons cette fois que vous n'ayez qu'un espace entre le début de la ligne et le texte :

```shell
Un
 Deux
 Deux encore
```

En ce moment, si vous exécutez `:set foldmethod=indent`, Vim ne plie pas la ligne indentée car il n'y a pas suffisamment d'espace sur chaque ligne. Un espace n'est pas considéré comme une indentation. Cependant, si vous changez le `'shiftwidth'` à 1 :

```shell
:set shiftwidth=1
```

Le texte est maintenant pliable. Il est maintenant considéré comme une indentation.

Restaurez le `shiftwidth` à 2 et les espaces entre les textes à deux à nouveau. De plus, ajoutez deux textes supplémentaires :

```shell
Un
  Deux
  Deux encore
    Trois
    Trois encore
```

Exécutez le pliage (`zM`), vous verrez :

```shell
Un
+-- 4 lignes : Deux -----
```

Dépliez les lignes pliées (`zR`), puis placez votre curseur sur "Trois" et basculez l'état de pliage du texte (`za`) :

```shell
Un
  Deux
  Deux encore
+-- 2 lignes : Trois -----
```

Qu'est-ce que c'est ? Un pli à l'intérieur d'un pli ?

Les plis imbriqués sont valides. Les textes "Deux" et "Deux encore" ont un niveau de pliage d'un. Les textes "Trois" et "Trois encore" ont un niveau de pliage de deux. Si vous avez un texte pliable avec un niveau de pliage plus élevé à l'intérieur d'un texte pliable, vous aurez plusieurs couches de pliage.

## Pliage par Expression

Le pliage par expression vous permet de définir une expression à correspondre pour un pli. Après avoir défini les expressions de pliage, Vim parcourt chaque ligne pour la valeur de `'foldexpr'`. C'est la variable que vous devez configurer pour renvoyer la valeur appropriée. Si le `'foldexpr'` renvoie 0, alors la ligne n'est pas pliée. Si elle renvoie 1, alors cette ligne a un niveau de pliage de 1. Si elle renvoie 2, alors cette ligne a un niveau de pliage de 2. Il existe plus de valeurs autres que des entiers, mais je ne vais pas les aborder. Si vous êtes curieux, consultez `:h fold-expr`.

Tout d'abord, changeons la méthode de pliage :

```shell
:set foldmethod=expr
```

Supposons que vous ayez une liste de nourritures pour le petit déjeuner et que vous souhaitiez plier tous les éléments du petit déjeuner commençant par "p" :

```shell
beignet
crêpe
pop-tarts
barre protéinée
saumon
œufs brouillés
```

Ensuite, changez le `foldexpr` pour capturer les expressions commençant par "p" :

```shell
:set foldexpr=getline(v:lnum)[0]==\\"p\\"
```

L'expression ci-dessus semble compliquée. Décomposons-la :
- `:set foldexpr` configure l'option `'foldexpr'` pour accepter une expression personnalisée.
- `getline()` est une fonction Vimscript qui renvoie le contenu de n'importe quelle ligne donnée. Si vous exécutez `:echo getline(5)`, cela renverra le contenu de la ligne 5.
- `v:lnum` est la variable spéciale de Vim pour l'expression `'foldexpr'`. Vim parcourt chaque ligne et à ce moment-là, stocke le numéro de chaque ligne dans la variable `v:lnum`. À la ligne 5, `v:lnum` a la valeur de 5. À la ligne 10, `v:lnum` a la valeur de 10.
- `[0]` dans le contexte de `getline(v:lnum)[0]` est le premier caractère de chaque ligne. Lorsque Vim parcourt une ligne, `getline(v:lnum)` renvoie le contenu de chaque ligne. `getline(v:lnum)[0]` renvoie le premier caractère de chaque ligne. Sur la première ligne de notre liste, "beignet", `getline(v:lnum)[0]` renvoie "b". Sur la deuxième ligne de notre liste, "crêpe", `getline(v:lnum)[0]` renvoie "c".
- `==\\"p\\"` est la seconde moitié de l'expression d'égalité. Elle vérifie si l'expression que vous venez d'évaluer est égale à "p". Si c'est vrai, elle renvoie 1. Si c'est faux, elle renvoie 0. Dans Vim, 1 est vrai et 0 est faux. Donc sur les lignes qui commencent par un "p", cela renvoie 1. Rappelez-vous que si un `'foldexpr'` a une valeur de 1, alors il a un niveau de pliage de 1.

Après avoir exécuté cette expression, vous devriez voir :

```shell
beignet
+-- 3 lignes : crêpe -----
saumon
œufs brouillés
```

## Pliage par Syntaxe

Le pliage par syntaxe est déterminé par la coloration syntaxique du langage. Si vous utilisez un plugin de syntaxe de langage comme [vim-polyglot](https://github.com/sheerun/vim-polyglot), le pliage par syntaxe fonctionnera immédiatement. Il suffit de changer la méthode de pliage en syntaxe :

```shell
:set foldmethod=syntax
```

Supposons que vous modifiez un fichier JavaScript et que vous ayez vim-polyglot installé. Si vous avez un tableau comme le suivant :

```shell
const nums = [
  un,
  deux,
  trois,
  quatre
]
```

Il sera plié avec un pliage par syntaxe. Lorsque vous définissez une coloration syntaxique pour un langage particulier (généralement dans le répertoire `syntax/`), vous pouvez ajouter un attribut `fold` pour le rendre pliable. Voici un extrait du fichier de syntaxe JavaScript de vim-polyglot. Remarquez le mot-clé `fold` à la fin.

```shell
syntax region  jsBracket                      matchgroup=jsBrackets            start=/\[/ end=/\]/ contains=@jsExpression,jsSpreadExpression extend fold
```

Ce guide ne couvrira pas la fonctionnalité `syntax`. Si vous êtes curieux, consultez `:h syntax.txt`.

## Pliage Diff

Vim peut effectuer une procédure de diff pour comparer deux fichiers ou plus.

Si vous avez `file1.txt` :

```shell
vim est génial
vim est génial
vim est génial
vim est génial
vim est génial
vim est génial
vim est génial
vim est génial
vim est génial
```

Et `file2.txt` :

```shell
vim est génial
vim est génial
vim est génial
vim est génial
vim est génial
vim est génial
vim est génial
vim est génial
emacs est ok
```

Exécutez `vimdiff file1.txt file2.txt` :

```shell
+-- 3 lignes : vim est génial -----
vim est génial
vim est génial
vim est génial
vim est génial
vim est génial
vim est génial
[vim est génial] / [emacs est ok]
```

Vim plie automatiquement certaines des lignes identiques. Lorsque vous exécutez la commande `vimdiff`, Vim utilise automatiquement `foldmethod=diff`. Si vous exécutez `:set foldmethod?`, cela renverra `diff`.

## Pliage par Marqueur

Pour utiliser un pliage par marqueur, exécutez :

```shell
:set foldmethod=marker
```

Supposons que vous ayez le texte :

```shell
Bonjour

{{{
monde
vim
}}}
```

Exécutez `zM`, vous verrez :

```shell
bonjour

+-- 4 lignes : -----
```

Vim voit `{{{` et `}}}` comme des indicateurs de pliage et plie les textes entre eux. Avec le pliage par marqueur, Vim recherche des marqueurs spéciaux, définis par l'option `'foldmarker'`, pour marquer les zones de pliage. Pour voir quels marqueurs Vim utilise, exécutez :

```shell
:set foldmarker?
```

Par défaut, Vim utilise `{{{` et `}}}` comme indicateurs. Si vous souhaitez changer l'indicateur en d'autres textes, comme "coffee1" et "coffee2" :

```shell
:set foldmarker=coffee1,coffee2
```

Si vous avez le texte :

```shell
bonjour

coffee1
monde
vim
coffee2
```

Maintenant, Vim utilise `coffee1` et `coffee2` comme nouveaux marqueurs de pliage. À titre de remarque, un indicateur doit être une chaîne littérale et ne peut pas être une regex.

## Persistance des Plis

Vous perdez toutes les informations de pliage lorsque vous fermez la session Vim. Si vous avez ce fichier, `count.txt` :

```shell
un
deux
trois
quatre
cinq
```

Ensuite, effectuez un pliage manuel à partir de la ligne "trois" vers le bas (`:3,$fold`) :

```shell
un
deux
+-- 3 lignes : trois ---
```

Lorsque vous quittez Vim et rouvrez `count.txt`, les plis ne sont plus là !

Pour préserver les plis, après avoir plié, exécutez :

```shell
:mkview
```

Ensuite, lorsque vous ouvrez `count.txt`, exécutez :

```shell
:loadview
```

Vos plis sont restaurés. Cependant, vous devez exécuter manuellement `mkview` et `loadview`. Je sais qu'un de ces jours, j'oublierai d'exécuter `mkview` avant de fermer le fichier et je perdrai tous les plis. Comment pouvons-nous automatiser ce processus ?

Pour exécuter automatiquement `mkview` lorsque vous fermez un fichier `.txt` et exécuter `loadview` lorsque vous ouvrez un fichier `.txt`, ajoutez ceci dans votre vimrc :

```shell
autocmd BufWinLeave *.txt mkview
autocmd BufWinEnter *.txt silent loadview
```

Rappelez-vous que `autocmd` est utilisé pour exécuter une commande lors d'un déclenchement d'événement. Les deux événements ici sont :
- `BufWinLeave` pour lorsque vous retirez un tampon d'une fenêtre.
- `BufWinEnter` pour lorsque vous chargez un tampon dans une fenêtre.

Maintenant, après avoir plié à l'intérieur d'un fichier `.txt` et quitté Vim, la prochaine fois que vous ouvrirez ce fichier, vos informations de pliage seront restaurées.

Par défaut, Vim enregistre les informations de pliage lors de l'exécution de `mkview` dans `~/.vim/view` pour le système Unix. Pour plus d'informations, consultez `:h 'viewdir'`.
## Apprendre à plier de manière intelligente

Lorsque j'ai commencé à utiliser Vim, j'ai négligé d'apprendre à plier car je ne pensais pas que c'était utile. Cependant, plus je code, plus je trouve que le pliage est utile. Des plis stratégiquement placés peuvent vous donner une meilleure vue d'ensemble de la structure du texte, comme la table des matières d'un livre.

Lorsque vous apprenez à plier, commencez par le pliage manuel car cela peut être utilisé en déplacement. Ensuite, apprenez progressivement différents trucs pour faire des plis d'indentation et de marqueur. Enfin, apprenez à faire des plis de syntaxe et d'expression. Vous pouvez même utiliser ces deux derniers pour écrire vos propres plugins Vim.