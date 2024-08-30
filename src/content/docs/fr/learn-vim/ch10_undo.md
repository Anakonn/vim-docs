---
description: Ce document explique le système d'annulation de Vim, permettant d'annuler,
  de rétablir et de naviguer dans les états de texte pour un meilleur contrôle.
title: Ch10. Undo
---

Nous faisons tous toutes sortes d'erreurs de frappe. C'est pourquoi l'annulation est une fonctionnalité essentielle dans tout logiciel moderne. Le système d'annulation de Vim est non seulement capable d'annuler et de rétablir des erreurs simples, mais aussi d'accéder à différents états de texte, vous donnant le contrôle sur tous les textes que vous avez jamais tapés. Dans ce chapitre, vous apprendrez comment annuler, rétablir, naviguer dans une branche d'annulation, persister l'annulation et voyager à travers le temps.

## Annuler, Rétablir et ANNULER

Pour effectuer une annulation de base, vous pouvez utiliser `u` ou exécuter `:undo`.

Si vous avez ce texte (notez la ligne vide sous "un") :

```shell
un

```

Puis vous ajoutez un autre texte :

```shell
un
deux
```

Si vous appuyez sur `u`, Vim annule le texte "deux".

Comment Vim sait-il combien annuler ? Vim annule un seul "changement" à la fois, similaire au changement de la commande point (contrairement à la commande point, la commande de ligne de commande compte également comme un changement).

Pour rétablir le dernier changement, appuyez sur `Ctrl-R` ou exécutez `:redo`. Après avoir annulé le texte ci-dessus pour supprimer "deux", exécuter `Ctrl-R` ramènera le texte supprimé.

Vim a également ANNULER que vous pouvez exécuter avec `U`. Cela annule tous les derniers changements.

En quoi `U` est-il différent de `u` ? Premièrement, `U` supprime *tous* les changements sur la dernière ligne modifiée, tandis que `u` ne supprime qu'un changement à la fois. Deuxièmement, alors que faire `u` ne compte pas comme un changement, faire `U` compte comme un changement.

Revenons à cet exemple :

```shell
un
deux
```

Changez la deuxième ligne en "trois" :

```shell
un
trois
```

Changez à nouveau la deuxième ligne et remplacez-la par "quatre" :

```shell
un
quatre
```

Si vous appuyez sur `u`, vous verrez "trois". Si vous appuyez à nouveau sur `u`, vous verrez "deux". Si au lieu d'appuyer sur `u` lorsque vous aviez encore le texte "quatre", vous aviez appuyé sur `U`, vous verrez :

```shell
un

```

`U` contourne tous les changements intermédiaires et revient à l'état original lorsque vous avez commencé (une ligne vide). De plus, puisque l'ANNULATION crée en fait un nouveau changement dans Vim, vous pouvez ANNULER votre ANNULATION. `U` suivi de `U` annulera lui-même. Vous pouvez appuyer sur `U`, puis `U`, puis `U`, etc. Vous verrez les mêmes deux états de texte basculer d'avant en arrière.

Personnellement, je n'utilise pas `U` car il est difficile de se souvenir de l'état original (je n'en ai que rarement besoin).

Vim fixe un nombre maximum de fois que vous pouvez annuler dans la variable d'option `undolevels`. Vous pouvez le vérifier avec `:echo &undolevels`. J'ai le mien réglé sur 1000. Pour changer le vôtre à 1000, exécutez `:set undolevels=1000`. N'hésitez pas à le régler sur n'importe quel nombre que vous aimez.

## Briser les Blocs

J'ai mentionné plus tôt que `u` annule un seul "changement" similaire au changement de la commande point : les textes insérés depuis que vous entrez en mode insertion jusqu'à ce que vous en sortiez comptent comme un changement.

Si vous faites `ione deux trois<Esc>` puis appuyez sur `u`, Vim supprime tout le texte "un deux trois" car l'ensemble compte comme un changement. Ce n'est pas un gros problème si vous avez écrit des textes courts, mais que faire si vous avez écrit plusieurs paragraphes dans une seule session de mode insertion sans sortir et que vous réalisez plus tard que vous avez fait une erreur ? Si vous appuyez sur `u`, tout ce que vous aviez écrit serait supprimé. Ne serait-il pas utile de pouvoir appuyer sur `u` pour supprimer seulement une section de votre texte ?

Heureusement, vous pouvez briser les blocs d'annulation. Lorsque vous tapez en mode insertion, appuyer sur `Ctrl-G u` crée un point d'arrêt d'annulation. Par exemple, si vous faites `ione <Ctrl-G u>deux <Ctrl-G u>trois<Esc>`, puis appuyez sur `u`, vous ne perdrez que le texte "trois" (appuyez sur `u` une fois de plus pour supprimer "deux"). Lorsque vous écrivez un long texte, utilisez `Ctrl-G u` de manière stratégique. La fin de chaque phrase, entre deux paragraphes ou après chaque ligne de code sont des endroits idéaux pour ajouter des points d'arrêt d'annulation afin de faciliter l'annulation de vos erreurs si jamais vous en faites une.

Il est également utile de créer un point d'arrêt d'annulation lors de la suppression de morceaux en mode insertion avec `Ctrl-W` (supprimer le mot avant le curseur) et `Ctrl-U` (supprimer tout le texte avant le curseur). Un ami a suggéré d'utiliser les mappages suivants :

```shell
inoremap <c-u> <c-g>u<c-u>
inoremap <c-w> <c-g>u<c-w>
```

Avec ceux-ci, vous pouvez facilement récupérer les textes supprimés.

## Arbre d'Annulation

Vim stocke chaque changement jamais écrit dans un arbre d'annulation. Commencez un nouveau fichier vide. Puis ajoutez un nouveau texte :

```shell
un

```

Ajoutez un nouveau texte :

```shell
un
deux
```

Annulez une fois :

```shell
un

```

Ajoutez un texte différent :

```shell
un
trois
```

Annulez à nouveau :

```shell
un

```

Et ajoutez un autre texte différent :

```shell
un
quatre
```

Maintenant, si vous annulez, vous perdrez le texte "quatre" que vous venez d'ajouter :

```shell
un

```

Si vous annulez une fois de plus :

```shell

```

Vous perdrez le texte "un". Dans la plupart des éditeurs de texte, récupérer les textes "deux" et "trois" aurait été impossible, mais pas avec Vim ! Appuyez sur `g+` et vous récupérerez votre texte "un" :

```shell
un

```

Tapez `g+` à nouveau et vous verrez un vieil ami :

```shell
un
deux
```

Continuons. Appuyez sur `g+` à nouveau :

```shell
un
trois
```

Appuyez sur `g+` une fois de plus :

```shell
un
quatre
```

Dans Vim, chaque fois que vous appuyez sur `u` puis effectuez un changement différent, Vim stocke le texte de l'état précédent en créant une "branche d'annulation". Dans cet exemple, après avoir tapé "deux", puis appuyé sur `u`, puis tapé "trois", vous avez créé une branche feuille qui stocke l'état contenant le texte "deux". À ce moment-là, l'arbre d'annulation contenait au moins deux nœuds feuilles : le nœud principal contenant le texte "trois" (le plus récent) et le nœud de branche d'annulation contenant le texte "deux". Si vous aviez fait une autre annulation et tapé le texte "quatre", vous auriez eu trois nœuds : un nœud principal contenant le texte "quatre" et deux nœuds contenant les textes "trois" et "deux".

Pour parcourir chaque nœud de l'arbre d'annulation, vous pouvez utiliser `g+` pour aller à un état plus récent et `g-` pour aller à un état plus ancien. La différence entre `u`, `Ctrl-R`, `g+` et `g-` est que `u` et `Ctrl-R` ne parcourent que les *nœuds principaux* dans l'arbre d'annulation tandis que `g+` et `g-` parcourent *tous* les nœuds dans l'arbre d'annulation.

L'arbre d'annulation n'est pas facile à visualiser. Je trouve que le plugin [vim-mundo](https://github.com/simnalamburt/vim-mundo) est très utile pour aider à visualiser l'arbre d'annulation de Vim. Prenez le temps de jouer avec.

## Annulation Persistante

Si vous démarrez Vim, ouvrez un fichier et appuyez immédiatement sur `u`, Vim affichera probablement un avertissement "*Déjà au changement le plus ancien*". Il n'y a rien à annuler car vous n'avez pas effectué de changements.

Pour faire rouler l'historique d'annulation de la dernière session d'édition, Vim peut préserver votre historique d'annulation avec un fichier d'annulation avec `:wundo`.

Créez un fichier `mynumbers.txt`. Tapez :

```shell
un
```

Puis tapez une autre ligne (assurez-vous que chaque ligne compte comme un changement) :

```shell
un
deux
```

Tapez une autre ligne :

```shell
un
deux
trois
```

Maintenant, créez votre fichier d'annulation avec `:wundo {mon-fichier-annulation}`. Si vous devez écraser un fichier d'annulation existant, vous pouvez ajouter `!` après `wundo`.

```shell
:wundo! mynumbers.undo
```

Puis quittez Vim.

À ce stade, vous devriez avoir les fichiers `mynumbers.txt` et `mynumbers.undo` dans votre répertoire. Ouvrez à nouveau `mynumbers.txt` et essayez d'appuyer sur `u`. Vous ne pouvez pas. Vous n'avez pas effectué de changements depuis que vous avez ouvert le fichier. Maintenant, chargez votre historique d'annulation en lisant le fichier d'annulation avec `:rundo` :

```shell
:rundo mynumbers.undo
```

Maintenant, si vous appuyez sur `u`, Vim supprime "trois". Appuyez sur `u` à nouveau pour supprimer "deux". C'est comme si vous n'aviez même jamais fermé Vim !

Si vous souhaitez avoir une persistance d'annulation automatique, une façon de le faire est d'ajouter ceci dans vimrc :

```shell
set undodir=~/.vim/undo_dir
set undofile
```

Le paramètre ci-dessus mettra tous les fichiers d'annulation dans un répertoire centralisé, le répertoire `~/.vim`. Le nom `undo_dir` est arbitraire. `set undofile` indique à Vim d'activer la fonctionnalité `undofile` car elle est désactivée par défaut. Maintenant, chaque fois que vous enregistrez, Vim crée et met à jour automatiquement le fichier pertinent dans le répertoire `undo_dir` (assurez-vous de créer le répertoire `undo_dir` réel dans le répertoire `~/.vim` avant d'exécuter cela).

## Voyage dans le Temps

Qui dit que le voyage dans le temps n'existe pas ? Vim peut voyager à un état de texte dans le passé avec la commande de ligne `:earlier`.

Si vous avez ce texte :

```shell
un

```
Puis plus tard, vous ajoutez :

```shell
un
deux
```

Si vous avez tapé "deux" il y a moins de dix secondes, vous pouvez revenir à l'état où "deux" n'existait pas il y a dix secondes avec :

```shell
:earlier 10s
```

Vous pouvez utiliser `:undolist` pour voir quand le dernier changement a été effectué. `:earlier` accepte également différents arguments :

```shell
:earlier 10s    Aller à l'état 10 secondes avant
:earlier 10m    Aller à l'état 10 minutes avant
:earlier 10h    Aller à l'état 10 heures avant
:earlier 10d    Aller à l'état 10 jours avant
```

De plus, il accepte également un `compte` régulier comme argument pour dire à Vim d'aller à l'état plus ancien `compte` fois. Par exemple, si vous faites `:earlier 2`, Vim reviendra à un état de texte plus ancien il y a deux changements. C'est la même chose que de faire `g-` deux fois. Vous pouvez également lui dire d'aller à l'état de texte plus ancien il y a 10 sauvegardes avec `:earlier 10f`.

Le même ensemble d'arguments fonctionne avec le contrepartie de `:earlier` : `:later`.

```shell
:later 10s    aller à l'état 10 secondes plus tard
:later 10m    aller à l'état 10 minutes plus tard
:later 10h    aller à l'état 10 heures plus tard
:later 10d    aller à l'état 10 jours plus tard
:later 10     aller à l'état plus récent 10 fois
:later 10f    aller à l'état 10 sauvegardes plus tard
```

## Apprenez l'Annulation de Manière Intelligente

`u` et `Ctrl-R` sont deux commandes Vim indispensables pour corriger les erreurs. Apprenez-les d'abord. Ensuite, apprenez à utiliser `:earlier` et `:later` en utilisant d'abord les arguments de temps. Après cela, prenez le temps de comprendre l'arbre d'annulation. Le plugin [vim-mundo](https://github.com/simnalamburt/vim-mundo) m'a beaucoup aidé. Tapez le long des textes dans ce chapitre et vérifiez l'arbre d'annulation à chaque changement que vous effectuez. Une fois que vous l'aurez compris, vous ne verrez plus jamais le système d'annulation de la même manière.

Avant ce chapitre, vous avez appris à trouver n'importe quel texte dans un espace de projet, avec l'annulation, vous pouvez maintenant trouver n'importe quel texte dans une dimension temporelle. Vous êtes maintenant capable de rechercher n'importe quel texte par son emplacement et le temps écrit. Vous avez atteint l'omniprésence de Vim.