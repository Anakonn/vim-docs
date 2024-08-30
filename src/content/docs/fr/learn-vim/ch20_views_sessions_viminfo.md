---
description: Ce document explique comment utiliser View, Session et Viminfo pour préserver
  l'état de vos projets dans Vim, afin de retrouver vos paramètres facilement.
title: Ch20. Views, Sessions, and Viminfo
---

Après avoir travaillé sur un projet pendant un certain temps, vous pouvez constater que le projet prend progressivement forme avec ses propres paramètres, plis, tampons, mises en page, etc. C'est comme décorer votre appartement après y avoir vécu un certain temps. Le problème est que lorsque vous fermez Vim, vous perdez ces modifications. Ne serait-il pas agréable de pouvoir conserver ces modifications afin que la prochaine fois que vous ouvrez Vim, cela ressemble à si vous n'étiez jamais parti ?

Dans ce chapitre, vous apprendrez à utiliser View, Session et Viminfo pour préserver un "instantané" de vos projets.

## View

Une View est le plus petit sous-ensemble des trois (View, Session, Viminfo). C'est une collection de paramètres pour une fenêtre. Si vous passez beaucoup de temps à travailler sur une fenêtre et que vous souhaitez préserver les mappages et les plis, vous pouvez utiliser une View.

Créons un fichier appelé `foo.txt` :

```shell
foo1
foo2
foo3
foo4
foo5
foo6
foo7
foo8
foo9
foo10
```

Dans ce fichier, créez trois modifications :
1. Sur la ligne 1, créez un pli manuel `zf4j` (pliez les 4 lignes suivantes).
2. Changez le paramètre `number` : `setlocal nonumber norelativenumber`. Cela supprimera les indicateurs de numéro sur le côté gauche de la fenêtre.
3. Créez un mappage local pour descendre de deux lignes chaque fois que vous appuyez sur `j` au lieu d'une : `:nnoremap <buffer> j jj`.

Votre fichier devrait ressembler à ceci :

```shell
+-- 5 lines: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

### Configurer les Attributs de View

Exécutez :

```shell
:set viewoptions?
```

Par défaut, cela devrait dire (le vôtre peut sembler différent selon votre vimrc) :

```shell
viewoptions=folds,cursor,curdir
```

Configurons `viewoptions`. Les trois attributs que vous souhaitez préserver sont les plis, les mappages et les options de configuration locales. Si votre paramètre ressemble au mien, vous avez déjà l'option `folds`. Vous devez dire à View de se souvenir des `localoptions`. Exécutez :

```shell
:set viewoptions+=localoptions
```

Pour apprendre quelles autres options sont disponibles pour `viewoptions`, consultez `:h viewoptions`. Maintenant, si vous exécutez `:set viewoptions?`, vous devriez voir :

```shell
viewoptions=folds,cursor,curdir,localoptions
```

### Sauvegarder la View

Avec la fenêtre `foo.txt` correctement pliée et ayant les options `nonumber norelativenumber`, sauvegardons la View. Exécutez :

```shell
:mkview
```

Vim crée un fichier View.

### Fichiers View

Vous vous demandez peut-être : "Où Vim a-t-il sauvegardé ce fichier View ?" Pour voir où Vim le sauvegarde, exécutez :

```shell
:set viewdir?
```

Dans les systèmes d'exploitation basés sur Unix, le défaut devrait dire `~/.vim/view` (si vous avez un système d'exploitation différent, cela pourrait montrer un chemin différent. Consultez `:h viewdir` pour plus). Si vous utilisez un système d'exploitation basé sur Unix et que vous souhaitez le changer pour un autre chemin, ajoutez ceci dans votre vimrc :

```shell
set viewdir=$HOME/else/where
```

### Charger le Fichier View

Fermez `foo.txt` si ce n'est pas déjà fait, puis ouvrez à nouveau `foo.txt`. **Vous devriez voir le texte original sans les modifications.** C'est attendu.

Pour restaurer l'état, vous devez charger le fichier View. Exécutez :

```shell
:loadview
```

Maintenant, vous devriez voir :

```shell
+-- 5 lines: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

Les plis, les paramètres locaux et les mappages locaux sont restaurés. Si vous remarquez, votre curseur devrait également être sur la ligne où vous l'avez laissé lorsque vous avez exécuté `:mkview`. Tant que vous avez l'option `cursor`, View se souvient également de votre position de curseur.

### Plusieurs Views

Vim vous permet de sauvegarder 9 Views numérotées (1-9).

Supposons que vous souhaitiez faire un pli supplémentaire (disons que vous voulez plier les deux dernières lignes) avec `:9,10 fold`. Sauvegardons cela comme View 1. Exécutez :

```shell
:mkview 1
```

Si vous souhaitez faire un pli supplémentaire avec `:6,7 fold` et le sauvegarder comme une View différente, exécutez :

```shell
:mkview 2
```

Fermez le fichier. Lorsque vous ouvrez `foo.txt` et que vous souhaitez charger la View 1, exécutez :

```shell
:loadview 1
```

Pour charger la View 2, exécutez :

```shell
:loadview 2
```

Pour charger la View originale, exécutez :

```shell
:loadview
```

### Automatiser la Création de View

Une des pires choses qui peuvent arriver est qu'après avoir passé d'innombrables heures à organiser un grand fichier avec des plis, vous fermez accidentellement la fenêtre et perdez toutes les informations de pli. Pour éviter cela, vous pourriez vouloir créer automatiquement une View chaque fois que vous fermez un tampon. Ajoutez ceci dans votre vimrc :

```shell
autocmd BufWinLeave *.txt mkview
```

De plus, il pourrait être agréable de charger la View lorsque vous ouvrez un tampon :

```shell
autocmd BufWinEnter *.txt silent loadview
```

Maintenant, vous n'avez plus à vous soucier de créer et de charger des Views lorsque vous travaillez avec des fichiers `txt`. Gardez à l'esprit qu'avec le temps, votre `~/.vim/view` pourrait commencer à accumuler des fichiers View. Il est bon de le nettoyer une fois tous les quelques mois.

## Sessions

Si une View sauvegarde les paramètres d'une fenêtre, une Session sauvegarde les informations de toutes les fenêtres (y compris la mise en page).

### Créer une Nouvelle Session

Supposons que vous travaillez avec ces 3 fichiers dans un projet `foobarbaz` :

Dans `foo.txt` :

```shell
foo1
foo2
foo3
foo4
foo5
foo6
foo7
foo8
foo9
foo10
```

Dans `bar.txt` :

```shell
bar1
bar2
bar3
bar4
bar5
bar6
bar7
bar8
bar9
bar10
```

Dans `baz.txt` :

```shell
baz1
baz2
baz3
baz4
baz5
baz6
baz7
baz8
baz9
baz10
```

Maintenant, disons que vous avez divisé vos fenêtres avec `:split` et `:vsplit`. Pour préserver cet aspect, vous devez sauvegarder la Session. Exécutez :

```shell
:mksession
```

Contrairement à `mkview` qui sauvegarde par défaut dans `~/.vim/view`, `mksession` sauvegarde un fichier de Session (`Session.vim`) dans le répertoire actuel. Jetez un œil au fichier si vous êtes curieux de savoir ce qu'il contient.

Si vous souhaitez sauvegarder le fichier de Session ailleurs, vous pouvez passer un argument à `mksession` :

```shell
:mksession ~/some/where/else.vim
```

Si vous souhaitez écraser le fichier de Session existant, appelez la commande avec un `!` (`:mksession! ~/some/where/else.vim`).

### Charger une Session

Pour charger une Session, exécutez :

```shell
:source Session.vim
```

Maintenant, Vim ressemble exactement à ce que vous avez laissé, y compris les fenêtres divisées ! Alternativement, vous pouvez également charger un fichier de Session depuis le terminal :

```shell
vim -S Session.vim
```

### Configurer les Attributs de Session

Vous pouvez configurer les attributs que la Session sauvegarde. Pour voir ce qui est actuellement sauvegardé, exécutez :

```shell
:set sessionoptions?
```

Le mien dit :

```shell
blank,buffers,curdir,folds,help,tabpages,winsize,terminal
```

Si vous ne souhaitez pas sauvegarder `terminal` lorsque vous sauvegardez une Session, retirez-le des options de session. Exécutez :

```shell
:set sessionoptions-=terminal
```

Si vous souhaitez ajouter une `options` lors de la sauvegarde d'une Session, exécutez :

```shell
:set sessionoptions+=options
```

Voici quelques attributs que `sessionoptions` peut stocker :
- `blank` stocke des fenêtres vides
- `buffers` stocke des tampons
- `folds` stocke des plis
- `globals` stocke des variables globales (doivent commencer par une lettre majuscule et contenir au moins une lettre minuscule)
- `options` stocke des options et des mappages
- `resize` stocke les lignes et colonnes de la fenêtre
- `winpos` stocke la position de la fenêtre
- `winsize` stocke les tailles de fenêtre
- `tabpages` stocke des onglets
- `unix` stocke des fichiers au format Unix

Pour la liste complète, consultez `:h 'sessionoptions'`.

La Session est un outil utile pour préserver les attributs externes de votre projet. Cependant, certains attributs internes ne sont pas sauvegardés par la Session, comme les marques locales, les registres, les historiques, etc. Pour les sauvegarder, vous devez utiliser Viminfo !

## Viminfo

Si vous remarquez, après avoir copié un mot dans le registre a et quitté Vim, la prochaine fois que vous ouvrez Vim, vous avez toujours ce texte stocké dans le registre a. C'est en fait le travail de Viminfo. Sans cela, Vim ne se souviendrait pas du registre après que vous ayez fermé Vim.

Si vous utilisez Vim 8 ou une version supérieure, Vim active Viminfo par défaut, donc vous avez peut-être utilisé Viminfo tout ce temps sans le savoir !

Vous pourriez demander : "Que sauvegarde Viminfo ? En quoi cela diffère-t-il de Session ?"

Pour utiliser Viminfo, vous devez d'abord avoir la fonctionnalité `+viminfo` disponible (`:version`). Viminfo stocke :
- L'historique des commandes.
- L'historique des chaînes de recherche.
- L'historique des lignes d'entrée.
- Le contenu des registres non vides.
- Les marques pour plusieurs fichiers.
- Les marques de fichiers, pointant vers des emplacements dans les fichiers.
- Le dernier motif de recherche / substitution (pour 'n' et '&').
- La liste des tampons.
- Les variables globales.

En général, la Session stocke les attributs "externes" et Viminfo les attributs "internes".

Contrairement à la Session où vous pouvez avoir un fichier de Session par projet, vous utiliserez normalement un fichier Viminfo par ordinateur. Viminfo est agnostique au projet.

L'emplacement par défaut de Viminfo pour Unix est `$HOME/.viminfo` (`~/.viminfo`). Si vous utilisez un système d'exploitation différent, votre emplacement Viminfo pourrait être différent. Consultez `:h viminfo-file-name`. Chaque fois que vous effectuez des modifications "internes", comme copier un texte dans un registre, Vim met automatiquement à jour le fichier Viminfo.

*Assurez-vous que vous avez l'option `nocompatible` définie (`set nocompatible`), sinon votre Viminfo ne fonctionnera pas.*

### Écrire et Lire Viminfo

Bien que vous n'utilisiez qu'un seul fichier Viminfo, vous pouvez créer plusieurs fichiers Viminfo. Pour écrire un fichier Viminfo, utilisez la commande `:wviminfo` (`:wv` pour abréger).

```shell
:wv ~/.viminfo_extra
```

Pour écraser un fichier Viminfo existant, ajoutez un bang à la commande `wv` :

```shell
:wv! ~/.viminfo_extra
```

Par défaut, Vim lira à partir du fichier `~/.viminfo`. Pour lire à partir d'un fichier Viminfo différent, exécutez `:rviminfo`, ou `:rv` pour abréger :

```shell
:rv ~/.viminfo_extra
```

Pour démarrer Vim avec un fichier Viminfo différent depuis le terminal, utilisez le drapeau `i` :

```shell
vim -i viminfo_extra
```

Si vous utilisez Vim pour différentes tâches, comme coder et écrire, vous pouvez créer un Viminfo optimisé pour l'écriture et un autre pour le codage.

```shell
vim -i viminfo_writing

vim -i viminfo_coding
```

### Démarrer Vim Sans Viminfo

Pour démarrer Vim sans Viminfo, vous pouvez exécuter depuis le terminal :

```shell
vim -i NONE
```

Pour le rendre permanent, vous pouvez ajouter ceci dans votre fichier vimrc :

```shell
set viminfo="NONE"
```

### Configurer les Attributs de Viminfo

Semblable à `viewoptions` et `sessionoptions`, vous pouvez indiquer quels attributs sauvegarder avec l'option `viminfo`. Exécutez :

```shell
:set viminfo?
```

Vous obtiendrez :

```shell
!,'100,<50,s10,h
```

Cela semble cryptique. Décomposons-le :
- `!` sauvegarde les variables globales qui commencent par une lettre majuscule et ne contiennent pas de lettres minuscules. Rappelez-vous que `g:` indique une variable globale. Par exemple, si à un moment donné vous avez écrit l'affectation `let g:FOO = "foo"`, Viminfo sauvegardera la variable globale `FOO`. Cependant, si vous avez fait `let g:Foo = "foo"`, Viminfo ne sauvegardera pas cette variable globale car elle contient des lettres minuscules. Sans `!`, Vim ne sauvegardera pas ces variables globales.
- `'100` représente les marques. Dans ce cas, Viminfo sauvegardera les marques locales (a-z) des 100 derniers fichiers. Soyez conscient que si vous demandez à Viminfo de sauvegarder trop de fichiers, Vim peut commencer à ralentir. 1000 est un bon nombre à avoir.
- `<50` indique à Viminfo combien de lignes maximum sont sauvegardées pour chaque registre (50 dans ce cas). Si je copie 100 lignes de texte dans le registre a (`"ay99j`) et que je ferme Vim, la prochaine fois que j'ouvre Vim et colle depuis le registre a (`"ap`), Vim ne collera que 50 lignes maximum. Si vous ne donnez pas de nombre de lignes maximum, *toutes* les lignes seront sauvegardées. Si vous donnez 0, rien ne sera sauvegardé.
- `s10` fixe une limite de taille (en ko) pour un registre. Dans ce cas, tout registre supérieur à 10 ko sera exclu.
- `h` désactive la mise en surbrillance (de `hlsearch`) lorsque Vim démarre.

Il existe d'autres options que vous pouvez passer. Pour en savoir plus, consultez `:h 'viminfo'`.
## Utiliser les Vues, Sessions et Viminfo de manière intelligente

Vim dispose de Vues, Sessions et Viminfo pour prendre différents niveaux d'instantanés de votre environnement Vim. Pour les micro projets, utilisez les Vues. Pour les projets plus importants, utilisez les Sessions. Vous devriez prendre le temps d'explorer toutes les options que Vues, Sessions et Viminfo offrent.

Créez votre propre Vue, Session et Viminfo pour votre propre style d'édition. Si jamais vous devez utiliser Vim en dehors de votre ordinateur, vous pouvez simplement charger vos paramètres et vous vous sentirez immédiatement chez vous !