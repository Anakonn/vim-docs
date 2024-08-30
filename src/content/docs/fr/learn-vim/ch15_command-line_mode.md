---
description: Ce document présente des astuces pour utiliser le mode ligne de commande
  dans Vim, y compris l'entrée, la sortie et les différentes commandes disponibles.
title: Ch15. Command-line Mode
---

Dans les trois derniers chapitres, vous avez appris à utiliser les commandes de recherche (`/`, `?`), la commande de substitution (`:s`), la commande globale (`:g`) et la commande externe (`!`). Ce sont des exemples de commandes en mode ligne de commande.

Dans ce chapitre, vous apprendrez divers conseils et astuces pour le mode ligne de commande.

## Entrer et Sortir du Mode Ligne de Commande

Le mode ligne de commande est un mode à part entière, tout comme le mode normal, le mode insertion et le mode visuel. Lorsque vous êtes dans ce mode, le curseur se déplace vers le bas de l'écran où vous pouvez taper différentes commandes.

Il y a 4 commandes différentes que vous pouvez utiliser pour entrer dans le mode ligne de commande :
- Modèles de recherche (`/`, `?`)
- Commandes de ligne de commande (`:`)
- Commandes externes (`!`)

Vous pouvez entrer dans le mode ligne de commande depuis le mode normal ou le mode visuel.

Pour quitter le mode ligne de commande, vous pouvez utiliser `<Esc>`, `Ctrl-C` ou `Ctrl-[`.

*D'autres littératures peuvent faire référence à la "commande de ligne de commande" comme "commande Ex" et à la "commande externe" comme "commande de filtre" ou "opérateur bang".*

## Répéter la Commande Précédente

Vous pouvez répéter la commande de ligne de commande précédente ou la commande externe avec `@:`.

Si vous venez d'exécuter `:s/foo/bar/g`, exécuter `@:` répète cette substitution. Si vous venez d'exécuter `:.!tr '[a-z]' '[A-Z]'`, exécuter `@:` répète le dernier filtre de traduction de commande externe.

## Raccourcis du Mode Ligne de Commande

Tout en étant dans le mode ligne de commande, vous pouvez vous déplacer vers la gauche ou vers la droite, un caractère à la fois, avec les flèches `Gauche` ou `Droite`.

Si vous devez vous déplacer par mot, utilisez `Shift-Gauche` ou `Shift-Droite` (dans certains systèmes d'exploitation, vous devrez peut-être utiliser `Ctrl` au lieu de `Shift`).

Pour aller au début de la ligne, utilisez `Ctrl-B`. Pour aller à la fin de la ligne, utilisez `Ctrl-E`.

Similaire au mode insertion, à l'intérieur du mode ligne de commande, vous avez trois façons de supprimer des caractères :

```shell
Ctrl-H    Supprimer un caractère
Ctrl-W    Supprimer un mot
Ctrl-U    Supprimer toute la ligne
```
Enfin, si vous souhaitez éditer la commande comme vous le feriez avec un fichier texte normal, utilisez `Ctrl-F`.

Cela vous permet également de rechercher parmi les commandes précédentes, de les éditer et de les réexécuter en appuyant sur `<Enter>` en "mode normal d'édition de ligne de commande".

## Registre et Autocomplétion

Tout en étant dans le mode ligne de commande, vous pouvez insérer des textes du registre Vim avec `Ctrl-R` de la même manière que dans le mode insertion. Si vous avez la chaîne "foo" enregistrée dans le registre a, vous pouvez l'insérer en exécutant `Ctrl-R a`. Tout ce que vous pouvez obtenir du registre dans le mode insertion, vous pouvez le faire de la même manière dans le mode ligne de commande.

De plus, vous pouvez également obtenir le mot sous le curseur avec `Ctrl-R Ctrl-W` (`Ctrl-R Ctrl-A` pour le MOT sous le curseur). Pour obtenir la ligne sous le curseur, utilisez `Ctrl-R Ctrl-L`. Pour obtenir le nom de fichier sous le curseur, utilisez `Ctrl-R Ctrl-F`.

Vous pouvez également autocompléter des commandes existantes. Pour autocompléter la commande `echo`, tout en étant dans le mode ligne de commande, tapez "ec", puis appuyez sur `<Tab>`. Vous devriez voir en bas à gauche les commandes Vim commençant par "ec" (exemple : `echo echoerr echohl echomsg econ`). Pour passer à l'option suivante, appuyez sur `<Tab>` ou `Ctrl-N`. Pour revenir à l'option précédente, appuyez sur `<Shift-Tab>` ou `Ctrl-P`.

Certaines commandes de ligne de commande acceptent des noms de fichiers comme arguments. Un exemple est `edit`. Vous pouvez également autocompléter ici. Après avoir tapé la commande `:e ` (n'oubliez pas l'espace), appuyez sur `<Tab>`. Vim listera tous les noms de fichiers pertinents que vous pouvez choisir afin que vous n'ayez pas à les taper depuis le début.

## Fenêtre d'Historique et Fenêtre de Ligne de Commande

Vous pouvez voir l'historique des commandes de ligne de commande et des termes de recherche (cela nécessite la fonctionnalité `+cmdline_hist`).

Pour ouvrir l'historique de la ligne de commande, exécutez `:his :`. Vous devriez voir quelque chose comme ce qui suit :

```shell
## Historique des Cmd
2  e file1.txt
3  g/foo/d
4  s/foo/bar/g
```

Vim liste l'historique de toutes les commandes `:` que vous exécutez. Par défaut, Vim stocke les 50 dernières commandes. Pour changer le nombre d'entrées que Vim se souvient à 100, exécutez `set history=100`.

Une utilisation plus utile de l'historique de la ligne de commande est à travers la fenêtre de ligne de commande, `q:`. Cela ouvrira une fenêtre d'historique modifiable et consultable. Supposons que vous ayez ces expressions dans l'historique lorsque vous appuyez sur `q:` :

```shell
51  s/verylongsubstitutionpattern/pancake/g
52  his :
53  wq
```

Si votre tâche actuelle est de faire `s/verylongsubstitutionpattern/donut/g`, au lieu de taper la commande depuis le début, pourquoi ne pas réutiliser `s/verylongsubstitutionpattern/pancake/g` ? Après tout, la seule chose qui change est le mot substitué, "donut" contre "pancake". Tout le reste est identique.

Après avoir exécuté `q:`, trouvez `s/verylongsubstitutionpattern/pancake/g` dans l'historique (vous pouvez utiliser la navigation Vim dans cet environnement) et éditez-le directement ! Changez "pancake" en "donut" dans la fenêtre d'historique, puis appuyez sur `<Enter>`. Boum ! Vim exécute `s/verylongsubstitutionpattern/donut/g` pour vous. Super pratique !

De même, pour voir l'historique des recherches, exécutez `:his /` ou `:his ?`. Pour ouvrir la fenêtre d'historique de recherche où vous pouvez rechercher et éditer l'historique passé, exécutez `q/` ou `q?`.

Pour quitter cette fenêtre, appuyez sur `Ctrl-C`, `Ctrl-W C`, ou tapez `:quit`.

## Plus de Commandes de Ligne de Commande

Vim a des centaines de commandes intégrées. Pour voir toutes les commandes que Vim a, consultez `:h ex-cmd-index` ou `:h :index`.

## Apprendre le Mode Ligne de Commande de Manière Intelligente

Comparé aux trois autres modes, le mode ligne de commande est comme le couteau suisse de l'édition de texte. Vous pouvez éditer du texte, modifier des fichiers et exécuter des commandes, pour n'en nommer que quelques-uns. Ce chapitre est une collection de bric-à-brac du mode ligne de commande. Il clôt également les modes Vim. Maintenant que vous savez comment utiliser le mode normal, le mode insertion, le mode visuel et le mode ligne de commande, vous pouvez éditer du texte avec Vim plus rapidement que jamais.

Il est temps de s'éloigner des modes Vim et d'apprendre à naviguer encore plus rapidement avec les tags Vim.