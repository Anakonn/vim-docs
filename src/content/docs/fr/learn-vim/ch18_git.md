---
description: Ce document explore l'intégration de Vim et Git, en mettant l'accent
  sur la comparaison de fichiers à l'aide de la commande `vimdiff`.
title: Ch18. Git
---

Vim et git sont deux excellents outils pour deux choses différentes. Git est un outil de contrôle de version. Vim est un éditeur de texte.

Dans ce chapitre, vous apprendrez différentes façons d'intégrer Vim et git ensemble.

## Différenciation

Rappelez-vous dans le chapitre précédent, vous pouvez exécuter une commande `vimdiff` pour montrer les différences entre plusieurs fichiers.

Supposons que vous ayez deux fichiers, `file1.txt` et `file2.txt`.

Dans `file1.txt` :

```shell
pancakes
waffles
apples

milk
apple juice

yogurt
```

Dans `file2.txt` :

```shell
pancakes
waffles
oranges

milk
orange juice

yogurt
```

Pour voir les différences entre les deux fichiers, exécutez :

```shell
vimdiff file1.txt file2.txt
```

Alternativement, vous pourriez exécuter :

```shell
vim -d file1.txt file2.txt
```

`vimdiff` affiche deux tampons côte à côte. À gauche se trouve `file1.txt` et à droite se trouve `file2.txt`. Les premières différences (apples et oranges) sont mises en surbrillance sur les deux lignes.

Supposons que vous souhaitiez que le deuxième tampon ait des pommes, pas des oranges. Pour transférer le contenu de votre position actuelle (vous êtes actuellement sur `file1.txt`) vers `file2.txt`, allez d'abord à la différence suivante avec `]c` (pour sauter à la fenêtre de différence précédente, utilisez `[c`). Le curseur devrait maintenant être sur apples. Exécutez `:diffput`. Les deux fichiers devraient maintenant avoir des pommes.

Si vous devez transférer le texte de l'autre tampon (orange juice, `file2.txt`) pour remplacer le texte dans le tampon actuel (apple juice, `file1.txt`), avec votre curseur toujours sur la fenêtre `file1.txt`, allez d'abord à la différence suivante avec `]c`. Votre curseur devrait maintenant être sur apple juice. Exécutez `:diffget` pour obtenir le orange juice d'un autre tampon afin de remplacer le apple juice dans notre tampon.

`:diffput` *met* le texte du tampon actuel dans un autre tampon. `:diffget` *obtient* le texte d'un autre tampon dans le tampon actuel.

Si vous avez plusieurs tampons, vous pouvez exécuter `:diffput fileN.txt` et `:diffget fileN.txt` pour cibler le tampon fileN.

## Vim Comme Outil de Fusion

> "J'adore résoudre les conflits de fusion !" - Personne

Je ne connais personne qui aime résoudre les conflits de fusion. Cependant, ils sont inévitables. Dans cette section, vous apprendrez comment tirer parti de Vim comme outil de résolution de conflits de fusion.

Tout d'abord, changez l'outil de fusion par défaut pour utiliser `vimdiff` en exécutant :

```shell
git config merge.tool vimdiff
git config merge.conflictstyle diff3
git config mergetool.prompt false
```

Alternativement, vous pouvez modifier directement le `~/.gitconfig` (par défaut, il devrait être dans le répertoire racine, mais le vôtre pourrait être à un autre endroit). Les commandes ci-dessus devraient modifier votre gitconfig pour ressembler à la configuration ci-dessous, si vous ne les avez pas déjà exécutées, vous pouvez également éditer manuellement votre gitconfig.

```shell
[core]
  editor = vim
[merge]
  tool = vimdiff
  conflictstyle = diff3
[difftool]
  prompt = false
```

Créons un faux conflit de fusion pour tester cela. Créez un répertoire `/food` et faites-en un dépôt git :

```shell
git init
```

Ajoutez un fichier, `breakfast.txt`. À l'intérieur :

```shell
pancakes
waffles
oranges
```

Ajoutez le fichier et validez-le :

```shell
git add .
git commit -m "Initial breakfast commit"
```

Ensuite, créez une nouvelle branche et appelez-la branche apples :

```shell
git checkout -b apples
```

Modifiez le `breakfast.txt` :

```shell
pancakes
waffles
apples
```

Enregistrez le fichier, puis ajoutez et validez le changement :

```shell
git add .
git commit -m "Apples not oranges"
```

Super. Maintenant, vous avez des oranges dans la branche master et des pommes dans la branche apples. Revenons à la branche master :

```shell
git checkout master
```

À l'intérieur de `breakfast.txt`, vous devriez voir le texte de base, oranges. Changeons-le en raisins parce qu'ils sont de saison en ce moment :

```shell
pancakes
waffles
grapes
```

Enregistrez, ajoutez et validez :

```shell
git add .
git commit -m "Grapes not oranges"
```

Maintenant, vous êtes prêt à fusionner la branche apples dans la branche master :

```shell
git merge apples
```

Vous devriez voir une erreur :

```shell
Auto-merging breakfast.txt
CONFLICT (content): Merge conflict in breakfast.txt
Automatic merge failed; fix conflicts and then commit the result.
```

Un conflit, super ! Résolvons le conflit en utilisant notre `mergetool` nouvellement configuré. Exécutez :

```shell
git mergetool
```

Vim affiche quatre fenêtres. Faites attention aux trois premières :

- `LOCAL` contient `grapes`. C'est le changement dans "local", ce que vous fusionnez.
- `BASE` contient `oranges`. C'est l'ancêtre commun entre `LOCAL` et `REMOTE` pour comparer comment ils divergent.
- `REMOTE` contient `apples`. C'est ce qui est en cours de fusion.

En bas (la quatrième fenêtre), vous voyez :

```shell
pancakes
waffles
<<<<<<< HEAD
grapes
||||||| db63958
oranges
=======
apples
>>>>>>> apples
```

La quatrième fenêtre contient les textes de conflit de fusion. Avec cette configuration, il est plus facile de voir quel changement chaque environnement a. Vous pouvez voir le contenu de `LOCAL`, `BASE` et `REMOTE` en même temps.

Votre curseur devrait être sur la quatrième fenêtre, sur la zone surlignée. Pour obtenir le changement de `LOCAL` (grapes), exécutez `:diffget LOCAL`. Pour obtenir le changement de `BASE` (oranges), exécutez `:diffget BASE` et pour obtenir le changement de `REMOTE` (apples), exécutez `:diffget REMOTE`.

Dans ce cas, obtenons le changement de `LOCAL`. Exécutez `:diffget LOCAL`. La quatrième fenêtre aura maintenant des raisins. Enregistrez et quittez tous les fichiers (`:wqall`) lorsque vous avez terminé. Ce n'était pas si mal, n'est-ce pas ?

Si vous remarquez, vous avez également maintenant un fichier `breakfast.txt.orig`. Git crée un fichier de sauvegarde au cas où les choses ne se passent pas bien. Si vous ne voulez pas que git crée une sauvegarde lors d'une fusion, exécutez :

```shell
git config --global mergetool.keepBackup false
```

## Git Dans Vim

Vim n'a pas de fonctionnalité git native intégrée. Une façon d'exécuter des commandes git depuis Vim est d'utiliser l'opérateur bang, `!`, en mode ligne de commande.

Toute commande git peut être exécutée avec `!` :

```shell
:!git status
:!git commit
:!git diff
:!git push origin master
```

Vous pouvez également utiliser les conventions `%` (tampon actuel) ou `#` (autre tampon) de Vim :

```shell
:!git add %         " git add fichier actuel
:!git checkout #    " git checkout l'autre fichier
```

Un truc Vim que vous pouvez utiliser pour ajouter plusieurs fichiers dans différentes fenêtres Vim est d'exécuter :

```shell
:windo !git add %
```

Ensuite, effectuez un commit :

```shell
:!git commit "Just git-added everything in my Vim window, cool"
```

La commande `windo` est l'une des commandes "faire" de Vim, similaire à `argdo` que vous avez vu précédemment. `windo` exécute la commande dans chaque fenêtre.

Alternativement, vous pouvez également utiliser `bufdo !git add %` pour git add tous les tampons ou `argdo !git add %` pour git add tous les arguments de fichier, selon votre flux de travail.

## Plugins

Il existe de nombreux plugins Vim pour le support de git. Voici une liste de certains des plugins liés à git les plus populaires pour Vim (il y en a probablement d'autres au moment où vous lisez ceci) :

- [vim-gitgutter](https://github.com/airblade/vim-gitgutter)
- [vim-signify](https://github.com/mhinz/vim-signify)
- [vim-fugitive](https://github.com/tpope/vim-fugitive)
- [gv.vim](https://github.com/junegunn/gv.vim)
- [vimagit](https://github.com/jreybert/vimagit)
- [vim-twiggy](https://github.com/sodapopcan/vim-twiggy)
- [rhubarb](https://github.com/tpope/vim-rhubarb)

L'un des plus populaires est vim-fugitive. Pour le reste du chapitre, je vais passer en revue plusieurs flux de travail git en utilisant ce plugin.

## Vim-fugitive

Le plugin vim-fugitive vous permet d'exécuter l'interface de ligne de commande git sans quitter l'éditeur Vim. Vous constaterez que certaines commandes sont meilleures lorsqu'elles sont exécutées depuis l'intérieur de Vim.

Pour commencer, installez vim-fugitive avec un gestionnaire de plugins Vim ([vim-plug](https://github.com/junegunn/vim-plug), [vundle](https://github.com/VundleVim/Vundle.vim), [dein.vim](https://github.com/Shougo/dein.vim), etc).

## Statut Git

Lorsque vous exécutez la commande `:Git` sans aucun paramètre, vim-fugitive affiche une fenêtre de résumé git. Elle montre les fichiers non suivis, non indexés et indexés. Pendant que vous êtes dans ce mode "`git status`", vous pouvez faire plusieurs choses :
- `Ctrl-N` / `Ctrl-P` pour monter ou descendre dans la liste des fichiers.
- `-` pour indexer ou désindexer le nom de fichier sous le curseur.
- `s` pour indexer le nom de fichier sous le curseur.
- `u` pour désindexer le nom de fichier sous le curseur.
- `>` / `<` pour afficher ou masquer un diff en ligne du nom de fichier sous le curseur.

Pour plus, consultez `:h fugitive-staging-maps`.

## Git Blame

Lorsque vous exécutez la commande `:Git blame` depuis le fichier actuel, vim-fugitive affiche une fenêtre de blame divisée. Cela peut être utile pour trouver la personne responsable de l'écriture de cette ligne de code boguée afin que vous puissiez lui crier dessus (je rigole).

Certaines choses que vous pouvez faire pendant ce mode `"git blame"` :
- `q` pour fermer la fenêtre de blame.
- `A` pour redimensionner la colonne de l'auteur.
- `C` pour redimensionner la colonne de commit.
- `D` pour redimensionner la colonne de date / heure.

Pour plus, consultez `:h :Git_blame`.

## Gdiffsplit

Lorsque vous exécutez la commande `:Gdiffsplit`, vim-fugitive exécute un `vimdiff` des dernières modifications du fichier actuel par rapport à l'index ou à l'arbre de travail. Si vous exécutez `:Gdiffsplit <commit>`, vim-fugitive exécute un `vimdiff` contre ce fichier à l'intérieur de `<commit>`.

Parce que vous êtes en mode `vimdiff`, vous pouvez *obtenir* ou *mettre* le diff avec `:diffput` et `:diffget`.

## Gwrite et Gread

Lorsque vous exécutez la commande `:Gwrite` dans un fichier après avoir effectué des modifications, vim-fugitive indexe les modifications. C'est comme exécuter `git add <fichier-actuel>`.

Lorsque vous exécutez la commande `:Gread` dans un fichier après avoir effectué des modifications, vim-fugitive restaure le fichier à l'état antérieur aux modifications. C'est comme exécuter `git checkout <fichier-actuel>`. Un avantage de l'exécution de `:Gread` est que l'action est annulable. Si, après avoir exécuté `:Gread`, vous changez d'avis et souhaitez conserver l'ancienne modification, vous pouvez simplement exécuter l'annulation (`u`) et Vim annulera l'action `:Gread`. Cela n'aurait pas été possible si vous aviez exécuté `git checkout <fichier-actuel>` depuis l'interface de ligne de commande.

## Gclog

Lorsque vous exécutez la commande `:Gclog`, vim-fugitive affiche l'historique des commits. C'est comme exécuter la commande `git log`. Vim-fugitive utilise le quickfix de Vim pour accomplir cela, vous pouvez donc utiliser `:cnext` et `:cprevious` pour naviguer vers les informations de log suivantes ou précédentes. Vous pouvez ouvrir et fermer la liste des logs avec `:copen` et `:cclose`.

Pendant que vous êtes dans ce mode `"git log"`, vous pouvez faire deux choses :
- Voir l'arbre.
- Visiter le parent (le commit précédent).

Vous pouvez passer des arguments à `:Gclog` tout comme la commande `git log`. Si votre projet a un long historique de commits et que vous n'avez besoin de voir que les trois derniers commits, vous pouvez exécuter `:Gclog -3`. Si vous devez le filtrer en fonction de la date du committer, vous pouvez exécuter quelque chose comme `:Gclog --after="1 janvier" --before="14 mars"`.

## Plus de Vim-fugitive

Ce ne sont que quelques exemples de ce que vim-fugitive peut faire. Pour en savoir plus sur vim-fugitive, consultez `:h fugitive.txt`. La plupart des commandes git populaires sont probablement optimisées avec vim-fugitive. Vous devez juste les chercher dans la documentation.

Si vous êtes dans l'un des "modes spéciaux" de vim-fugitive (par exemple, dans le mode `:Git` ou `:Git blame`) et que vous souhaitez savoir quels raccourcis sont disponibles, appuyez sur `g?`. Vim-fugitive affichera la fenêtre `:help` appropriée pour le mode dans lequel vous vous trouvez. Génial !
## Apprenez Vim et Git de manière intelligente

Vous pourriez trouver que vim-fugitive est un bon complément à votre flux de travail (ou pas). Quoi qu'il en soit, je vous encourage fortement à consulter tous les plugins listés ci-dessus. Il y en a probablement d'autres que je n'ai pas mentionnés. Allez les essayer.

Une façon évidente de s'améliorer avec l'intégration Vim-git est de lire davantage sur git. Git, en soi, est un sujet vaste et je ne montre qu'une fraction de celui-ci. Sur ce, commençons à *git going* (pardonnez le jeu de mots) et parlons de la façon d'utiliser Vim pour compiler votre code !