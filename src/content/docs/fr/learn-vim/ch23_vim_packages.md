---
description: Ce document explique comment utiliser le gestionnaire de plugins intégré
  de Vim, appelé *packages*, pour installer et gérer des plugins efficacement.
title: Ch23. Vim Packages
---

Dans le chapitre précédent, j'ai mentionné l'utilisation d'un gestionnaire de plugins externe pour installer des plugins. Depuis la version 8, Vim est livré avec son propre gestionnaire de plugins intégré appelé *packages*. Dans ce chapitre, vous apprendrez à utiliser les packages Vim pour installer des plugins.

Pour vérifier si votre version de Vim a la capacité d'utiliser des packages, exécutez `:version` et recherchez l'attribut `+packages`. Alternativement, vous pouvez également exécuter `:echo has('packages')` (s'il retourne 1, alors il a la capacité de gérer des packages).

## Répertoire des Packages

Vérifiez si vous avez un répertoire `~/.vim/` dans le chemin racine. Si ce n'est pas le cas, créez-en un. À l'intérieur, créez un répertoire appelé `pack` (`~/.vim/pack/`). Vim sait automatiquement rechercher des packages dans ce répertoire.

## Deux Types de Chargement

Le package Vim a deux mécanismes de chargement : le chargement automatique et le chargement manuel.

### Chargement Automatique

Pour charger des plugins automatiquement lorsque Vim démarre, vous devez les placer dans le répertoire `start/`. Le chemin ressemble à ceci :

```shell
~/.vim/pack/*/start/
```

Vous pouvez maintenant demander : "Quel est le `*` entre `pack/` et `start/` ?" `*` est un nom arbitraire et peut être n'importe quoi que vous voulez. Appelons-le `packdemo/` :

```shell
~/.vim/pack/packdemo/start/
```

Gardez à l'esprit que si vous le sautez et faites quelque chose comme ceci à la place :

```shell
~/.vim/pack/start/
```

Le système de packages ne fonctionnera pas. Il est impératif de mettre un nom entre `pack/` et `start/`.

Pour cette démonstration, essayons d'installer le plugin [NERDTree](https://github.com/preservim/nerdtree). Allez jusqu'au répertoire `start/` (`cd ~/.vim/pack/packdemo/start/`) et clonez le dépôt NERDTree :

```shell
git clone https://github.com/preservim/nerdtree.git
```

C'est tout ! Vous êtes prêt. La prochaine fois que vous démarrez Vim, vous pouvez immédiatement exécuter des commandes NERDTree comme `:NERDTreeToggle`.

Vous pouvez cloner autant de dépôts de plugins que vous le souhaitez dans le chemin `~/.vim/pack/*/start/`. Vim chargera automatiquement chacun d'eux. Si vous supprimez le dépôt cloné (`rm -rf nerdtree/`), ce plugin ne sera plus disponible.

### Chargement Manuel

Pour charger des plugins manuellement lorsque Vim démarre, vous devez les placer dans le répertoire `opt/`. Semblable au chargement automatique, le chemin ressemble à ceci :

```shell
~/.vim/pack/*/opt/
```

Utilisons le même répertoire `packdemo/` que précédemment :

```shell
~/.vim/pack/packdemo/opt/
```

Cette fois, installons le jeu [killersheep](https://github.com/vim/killersheep) (cela nécessite Vim 8.2). Allez dans le répertoire `opt/` (`cd ~/.vim/pack/packdemo/opt/`) et clonez le dépôt :

```shell
git clone https://github.com/vim/killersheep.git
```

Démarrez Vim. La commande pour exécuter le jeu est `:KillKillKill`. Essayez de l'exécuter. Vim se plaindra que ce n'est pas une commande d'éditeur valide. Vous devez d'abord *charger manuellement* le plugin. Faisons cela :

```shell
:packadd killersheep
```

Essayez maintenant d'exécuter la commande à nouveau `:KillKillKill`. La commande devrait fonctionner maintenant.

Vous vous demandez peut-être : "Pourquoi voudrais-je jamais charger des packages manuellement ? N'est-il pas mieux de tout charger automatiquement au démarrage ?"

Bonne question. Parfois, il y a des plugins que vous n'utiliserez pas tout le temps, comme ce jeu KillerSheep. Vous n'avez probablement pas besoin de charger 10 jeux différents et de ralentir le temps de démarrage de Vim. Cependant, de temps en temps, lorsque vous vous ennuyez, vous pourriez vouloir jouer à quelques jeux. Utilisez le chargement manuel pour les plugins non essentiels.

Vous pouvez également utiliser cela pour ajouter des plugins de manière conditionnelle. Peut-être que vous utilisez à la fois Neovim et Vim et qu'il y a des plugins optimisés pour Neovim. Vous pouvez ajouter quelque chose comme ceci dans votre vimrc :

```shell
if has('nvim')
  packadd! neovim-only-plugin
else
  packadd! generic-vim-plugin
endif
```

## Organisation des Packages

Rappelez-vous que l'exigence pour utiliser le système de packages de Vim est d'avoir soit :

```shell
~/.vim/pack/*/start/
```

Ou :

```shell
~/.vim/pack/*/opt/
```

Le fait que `*` puisse être *n'importe quel* nom peut être utilisé pour organiser vos packages. Supposons que vous souhaitiez regrouper vos plugins par catégories (couleurs, syntaxe et jeux) :

```shell
~/.vim/pack/colors/
~/.vim/pack/syntax/
~/.vim/pack/games/
```

Vous pouvez toujours utiliser `start/` et `opt/` à l'intérieur de chacun des répertoires.

```shell
~/.vim/pack/colors/start/
~/.vim/pack/colors/opt/

~/.vim/pack/syntax/start/
~/.vim/pack/syntax/opt/

~/.vim/pack/games/start/
~/.vim/pack/games/opt/
```

## Ajouter des Packages de Manière Intelligente

Vous vous demandez peut-être si le package Vim rendra obsolètes des gestionnaires de plugins populaires comme vim-pathogen, vundle.vim, dein.vim et vim-plug.

La réponse est, comme toujours, "cela dépend".

J'utilise toujours vim-plug car il facilite l'ajout, la suppression ou la mise à jour des plugins. Si vous utilisez de nombreux plugins, il peut être plus pratique d'utiliser des gestionnaires de plugins car il est facile de mettre à jour plusieurs simultanément. Certains gestionnaires de plugins offrent également des fonctionnalités asynchrones.

Si vous êtes un minimaliste, essayez les packages Vim. Si vous êtes un utilisateur intensif de plugins, vous voudrez peut-être envisager d'utiliser un gestionnaire de plugins.