---
description: Ce document explique les concepts de buffers, fenêtres et onglets dans
  Vim, ainsi que la configuration nécessaire pour une utilisation efficace.
title: Ch02. Buffers, Windows, and Tabs
---

Si vous avez utilisé un éditeur de texte moderne auparavant, vous êtes probablement familier avec les fenêtres et les onglets. Vim utilise trois abstractions d'affichage au lieu de deux : les tampons, les fenêtres et les onglets. Dans ce chapitre, je vais expliquer ce que sont les tampons, les fenêtres et les onglets et comment ils fonctionnent dans Vim.

Avant de commencer, assurez-vous d'avoir l'option `set hidden` dans vimrc. Sans cela, chaque fois que vous changez de tampon et que votre tampon actuel n'est pas enregistré, Vim vous demandera de sauvegarder le fichier (vous ne voulez pas cela si vous souhaitez vous déplacer rapidement). Je n'ai pas encore abordé vimrc. Si vous n'avez pas de vimrc, créez-en un. Il est généralement placé dans votre répertoire personnel et est nommé `.vimrc`. J'ai le mien sur `~/.vimrc`. Pour voir où vous devez créer votre vimrc, consultez `:h vimrc`. À l'intérieur, ajoutez :

```shell
set hidden
```

Enregistrez-le, puis sourcez-le (exécutez `:source %` depuis l'intérieur du vimrc).

## Tampons

Qu'est-ce qu'un *tampon* ?

Un tampon est un espace en mémoire où vous pouvez écrire et éditer du texte. Lorsque vous ouvrez un fichier dans Vim, les données sont liées à un tampon. Lorsque vous ouvrez 3 fichiers dans Vim, vous avez 3 tampons.

Ayez deux fichiers vides, `file1.js` et `file2.js`, disponibles (si possible, créez-les avec Vim). Exécutez ceci dans le terminal :

```bash
vim file1.js
```

Ce que vous voyez est le *tampon* `file1.js`. Chaque fois que vous ouvrez un nouveau fichier, Vim crée un nouveau tampon.

Quittez Vim. Cette fois, ouvrez deux nouveaux fichiers :

```bash
vim file1.js file2.js
```

Vim affiche actuellement le tampon `file1.js`, mais il crée en réalité deux tampons : le tampon `file1.js` et le tampon `file2.js`. Exécutez `:buffers` pour voir tous les tampons (alternativement, vous pouvez utiliser `:ls` ou `:files` aussi). Vous devriez voir *les deux* `file1.js` et `file2.js` listés. Exécuter `vim file1 file2 file3 ... filen` crée n tampons. Chaque fois que vous ouvrez un nouveau fichier, Vim crée un nouveau tampon pour ce fichier.

Il existe plusieurs façons de naviguer entre les tampons :
- `:bnext` pour aller au tampon suivant (`:bprevious` pour aller au tampon précédent).
- `:buffer` + nom de fichier. Vim peut compléter le nom de fichier avec `<Tab>`.
- `:buffer` + `n`, où `n` est le numéro du tampon. Par exemple, taper `:buffer 2` vous amènera au tampon #2.
- Sautez à l'ancienne position dans la liste de saut avec `Ctrl-O` et à la nouvelle position avec `Ctrl-I`. Ce ne sont pas des méthodes spécifiques aux tampons, mais elles peuvent être utilisées pour sauter entre différents tampons. J'expliquerai les sauts plus en détail dans le Chapitre 5.
- Allez au tampon précédemment édité avec `Ctrl-^`.

Une fois que Vim crée un tampon, il restera dans votre liste de tampons. Pour le supprimer, vous pouvez taper `:bdelete`. Il peut également accepter un numéro de tampon comme paramètre (`:bdelete 3` pour supprimer le tampon #3) ou un nom de fichier (`:bdelete` puis utilisez `<Tab>` pour compléter).

La chose la plus difficile pour moi en apprenant les tampons était de visualiser comment ils fonctionnaient parce que mon esprit était habitué aux fenêtres d'un éditeur de texte classique. Une bonne analogie est un jeu de cartes. Si j'ai 2 tampons, j'ai une pile de 2 cartes. La carte du dessus est la seule carte que je vois, mais je sais qu'il y a des cartes en dessous. Si je vois le tampon `file1.js` affiché, alors la carte `file1.js` est sur le dessus de la pile. Je ne peux pas voir l'autre carte, `file2.js`, ici, mais elle est là. Si je change de tampon pour `file2.js`, cette carte `file2.js` est maintenant sur le dessus de la pile et la carte `file1.js` est en dessous.

Si vous n'avez jamais utilisé Vim auparavant, c'est un nouveau concept. Prenez votre temps pour le comprendre.

## Quitter Vim

Au fait, si vous avez plusieurs tampons ouverts, vous pouvez tous les fermer avec quitter-tous :

```shell
:qall
```

Si vous souhaitez fermer sans enregistrer vos modifications, ajoutez simplement `!` à la fin :

```shell
:qall!
```

Pour enregistrer et quitter tous, exécutez :

```shell
:wqall
```

## Fenêtres

Une fenêtre est un champ de vision sur un tampon. Si vous venez d'un éditeur classique, ce concept peut vous être familier. La plupart des éditeurs de texte ont la capacité d'afficher plusieurs fenêtres. Dans Vim, vous pouvez également avoir plusieurs fenêtres.

Ouvrons `file1.js` depuis le terminal à nouveau :

```bash
vim file1.js
```

Plus tôt, j'ai écrit que vous regardiez le tampon `file1.js`. Bien que cela soit correct, cette affirmation était incomplète. Vous regardez le tampon `file1.js`, affiché à travers **une fenêtre**. Une fenêtre est la façon dont vous visualisez un tampon.

Ne quittez pas encore Vim. Exécutez :

```shell
:split file2.js
```

Maintenant, vous regardez deux tampons à travers **deux fenêtres**. La fenêtre du haut affiche le tampon `file2.js`. La fenêtre du bas affiche le tampon `file1.js`.

Si vous souhaitez naviguer entre les fenêtres, utilisez ces raccourcis :

```shell
Ctrl-W H    Déplace le curseur vers la fenêtre de gauche
Ctrl-W J    Déplace le curseur vers la fenêtre du bas
Ctrl-W K    Déplace le curseur vers la fenêtre du haut
Ctrl-W L    Déplace le curseur vers la fenêtre de droite
```

Exécutez maintenant :

```shell
:vsplit file3.js
```

Vous voyez maintenant trois fenêtres affichant trois tampons. Une fenêtre affiche le tampon `file3.js`, une autre fenêtre affiche le tampon `file2.js`, et une autre fenêtre affiche le tampon `file1.js`.

Vous pouvez avoir plusieurs fenêtres affichant le même tampon. Pendant que vous êtes dans la fenêtre en haut à gauche, tapez :

```shell
:buffer file2.js
```

Maintenant, les deux fenêtres affichent le tampon `file2.js`. Si vous commencez à taper dans une fenêtre `file2.js`, vous verrez que les deux fenêtres affichant les tampons `file2.js` sont mises à jour en temps réel.

Pour fermer la fenêtre actuelle, vous pouvez exécuter `Ctrl-W C` ou taper `:quit`. Lorsque vous fermez une fenêtre, le tampon sera toujours là (exécutez `:buffers` pour le confirmer).

Voici quelques commandes utiles en mode normal pour les fenêtres :

```shell
Ctrl-W V    Ouvre un nouveau split vertical
Ctrl-W S    Ouvre un nouveau split horizontal
Ctrl-W C    Ferme une fenêtre
Ctrl-W O    Fait de la fenêtre actuelle la seule à l'écran et ferme les autres fenêtres
```

Et voici une liste de commandes utiles pour la ligne de commande des fenêtres :

```shell
:vsplit filename    Divise la fenêtre verticalement
:split filename     Divise la fenêtre horizontalement
:new filename       Crée une nouvelle fenêtre
```

Prenez votre temps pour les comprendre. Pour plus d'informations, consultez `:h window`.

## Onglets

Un onglet est une collection de fenêtres. Pensez-y comme à une mise en page pour les fenêtres. Dans la plupart des éditeurs de texte modernes (et des navigateurs Internet modernes), un onglet signifie un fichier / page ouvert et lorsque vous le fermez, ce fichier / page disparaît. Dans Vim, un onglet ne représente pas un fichier ouvert. Lorsque vous fermez un onglet dans Vim, vous ne fermez pas un fichier. Vous fermez simplement la mise en page. Les fichiers ouverts dans cette mise en page ne sont toujours pas fermés, ils sont toujours ouverts dans leurs tampons.

Voyons les onglets Vim en action. Ouvrez `file1.js` :

```bash
vim file1.js
```

Pour ouvrir `file2.js` dans un nouvel onglet :

```shell
:tabnew file2.js
```

Vous pouvez également laisser Vim compléter le fichier que vous souhaitez ouvrir dans un *nouvel onglet* en appuyant sur `<Tab>` (sans jeu de mots).

Voici une liste de navigations utiles pour les onglets :

```shell
:tabnew file.txt    Ouvre file.txt dans un nouvel onglet
:tabclose           Ferme l'onglet actuel
:tabnext            Va au prochain onglet
:tabprevious        Va à l'onglet précédent
:tablast            Va au dernier onglet
:tabfirst           Va au premier onglet
```

Vous pouvez également exécuter `gt` pour aller au prochain onglet (vous pouvez aller à l'onglet précédent avec `gT`). Vous pouvez passer un nombre comme argument à `gt`, où le nombre est le numéro de l'onglet. Pour aller au troisième onglet, faites `3gt`.

Un avantage d'avoir plusieurs onglets est que vous pouvez avoir différentes dispositions de fenêtres dans différents onglets. Peut-être que vous voulez que votre premier onglet ait 3 fenêtres verticales et que le deuxième onglet ait une disposition de fenêtres horizontales et verticales mélangées. L'onglet est l'outil parfait pour le travail !

Pour démarrer Vim avec plusieurs onglets, vous pouvez faire cela depuis le terminal :

```bash
vim -p file1.js file2.js file3.js
```

## Se déplacer en 3D

Se déplacer entre les fenêtres est comme voyager en deux dimensions le long de l'axe X-Y dans des coordonnées cartésiennes. Vous pouvez vous déplacer vers la fenêtre du haut, à droite, en bas et à gauche avec `Ctrl-W H/J/K/L`.

Se déplacer entre les tampons est comme voyager le long de l'axe Z dans des coordonnées cartésiennes. Imaginez vos fichiers tampon s'alignant le long de l'axe Z. Vous pouvez traverser l'axe Z un tampon à la fois avec `:bnext` et `:bprevious`. Vous pouvez sauter à n'importe quelle coordonnée sur l'axe Z avec `:buffer filename/buffernumber`.

Vous pouvez vous déplacer dans *l'espace tridimensionnel* en combinant les mouvements de fenêtres et de tampons. Vous pouvez vous déplacer vers la fenêtre du haut, à droite, en bas ou à gauche (navigations X-Y) avec les mouvements de fenêtres. Puisque chaque fenêtre contient des tampons, vous pouvez avancer et reculer (navigations Z) avec les mouvements de tampons.

## Utiliser les Tampons, Fenêtres et Onglets de Manière Intelligente

Vous avez appris ce que sont les tampons, les fenêtres et les onglets et comment ils fonctionnent dans Vim. Maintenant que vous les comprenez mieux, vous pouvez les utiliser dans votre propre flux de travail.

Tout le monde a un flux de travail différent, voici le mien par exemple :
- Tout d'abord, j'utilise des tampons pour stocker tous les fichiers nécessaires pour la tâche actuelle. Vim peut gérer de nombreux tampons ouverts avant de commencer à ralentir. De plus, avoir de nombreux tampons ouverts ne surchargera pas mon écran. Je ne vois qu'un seul tampon (en supposant que je n'ai qu'une seule fenêtre) à la fois, ce qui me permet de me concentrer sur un écran. Lorsque j'ai besoin d'aller quelque part, je peux rapidement me rendre à n'importe quel tampon ouvert à tout moment.
- J'utilise plusieurs fenêtres pour voir plusieurs tampons à la fois, généralement lors de la comparaison de fichiers, de la lecture de documents ou du suivi d'un flux de code. J'essaie de garder le nombre de fenêtres ouvertes à pas plus de trois car mon écran sera encombré (j'utilise un petit ordinateur portable). Lorsque j'ai terminé, je ferme toutes les fenêtres supplémentaires. Moins de fenêtres signifie moins de distractions.
- Au lieu des onglets, j'utilise des fenêtres [tmux](https://github.com/tmux/tmux/wiki). J'utilise généralement plusieurs fenêtres tmux à la fois. Par exemple, une fenêtre tmux pour le code côté client et une autre pour le code backend.

Mon flux de travail peut sembler différent du vôtre en fonction de votre style d'édition et c'est très bien. Expérimentez pour découvrir votre propre flux, adapté à votre style de codage.