---
description: Ce document présente différentes manières de démarrer Vim depuis le terminal,
  ainsi que des informations sur l'installation et l'utilisation de l'éditeur.
title: Ch01. Starting Vim
---

Dans ce chapitre, vous apprendrez différentes façons de démarrer Vim à partir du terminal. J'utilisais Vim 8.2 lors de la rédaction de ce guide. Si vous utilisez Neovim ou une version antérieure de Vim, cela devrait généralement bien fonctionner, mais sachez que certaines commandes pourraient ne pas être disponibles.

## Installation

Je ne vais pas passer par les instructions détaillées sur la façon d'installer Vim sur une machine spécifique. La bonne nouvelle est que la plupart des ordinateurs basés sur Unix devraient avoir Vim installé. Si ce n'est pas le cas, la plupart des distributions devraient avoir des instructions pour installer Vim.

Pour télécharger plus d'informations sur le processus d'installation de Vim, consultez le site officiel de téléchargement de Vim ou le dépôt officiel GitHub de Vim :
- [Site de Vim](https://www.vim.org/download.php)
- [GitHub de Vim](https://github.com/vim/vim)

## La commande Vim

Maintenant que vous avez installé Vim, exécutez ceci depuis le terminal :

```bash
vim
```

Vous devriez voir un écran d'introduction. C'est ici que vous allez travailler sur votre nouveau fichier. Contrairement à la plupart des éditeurs de texte et des IDE, Vim est un éditeur modal. Si vous voulez taper "hello", vous devez passer en mode insertion avec `i`. Appuyez sur `ihello<Esc>` pour insérer le texte "hello".

## Quitter Vim

Il existe plusieurs façons de quitter Vim. La plus courante est de taper :

```shell
:quit
```

Vous pouvez taper `:q` pour faire court. Cette commande est une commande en mode ligne de commande (un autre des modes de Vim). Si vous tapez `:` en mode normal, le curseur se déplacera vers le bas de l'écran où vous pourrez taper certaines commandes. Vous apprendrez à propos du mode ligne de commande plus tard dans le chapitre 15. Si vous êtes en mode insertion, taper `:` produira littéralement le caractère ":" à l'écran. Dans ce cas, vous devez revenir en mode normal. Tapez `<Esc>` pour passer en mode normal. Au fait, vous pouvez également revenir en mode normal depuis le mode ligne de commande en appuyant sur `<Esc>`. Vous remarquerez que vous pouvez "échapper" de plusieurs modes Vim vers le mode normal en appuyant sur `<Esc>`.

## Sauvegarder un fichier

Pour sauvegarder vos modifications, tapez :

```shell
:write
```

Vous pouvez également taper `:w` pour faire court. Si c'est un nouveau fichier, vous devez lui donner un nom avant de pouvoir le sauvegarder. Appelons-le `file.txt`. Exécutez :

```shell
:w file.txt
```

Pour sauvegarder et quitter, vous pouvez combiner les commandes `:w` et `:q` :

```shell
:wq
```

Pour quitter sans sauvegarder les modifications, ajoutez `!` après `:q` pour forcer la sortie :

```shell
:q!
```

Il existe d'autres façons de quitter Vim, mais ce sont celles que vous utiliserez au quotidien.

## Aide

Tout au long de ce guide, je vous renverrai à diverses pages d'aide de Vim. Vous pouvez accéder à la page d'aide en tapant `:help {some-command}` (`:h` pour faire court). Vous pouvez passer au commandement `:h` un sujet ou un nom de commande comme argument. Par exemple, pour apprendre différentes façons de quitter Vim, tapez :

```shell
:h write-quit
```

Comment ai-je su chercher "write-quit" ? En fait, je ne l'ai pas fait. J'ai juste tapé `:h`, puis "quit", puis `<Tab>`. Vim a affiché des mots-clés pertinents parmi lesquels choisir. Si vous devez un jour chercher quelque chose ("J'aimerais que Vim puisse faire ça..."), tapez simplement `:h` et essayez quelques mots-clés, puis `<Tab>`.

## Ouvrir un fichier

Pour ouvrir un fichier (`hello1.txt`) sur Vim depuis le terminal, exécutez :

```bash
vim hello1.txt
```

Vous pouvez également ouvrir plusieurs fichiers à la fois :

```bash
vim hello1.txt hello2.txt hello3.txt
```

Vim ouvre `hello1.txt`, `hello2.txt` et `hello3.txt` dans des tampons séparés. Vous apprendrez à propos des tampons dans le prochain chapitre.

## Arguments

Vous pouvez passer la commande terminal `vim` avec différents drapeaux et options.

Pour vérifier la version actuelle de Vim, exécutez :

```bash
vim --version
```

Cela vous indique la version actuelle de Vim et toutes les fonctionnalités disponibles marquées par `+` ou `-`. Certaines de ces fonctionnalités dans ce guide nécessitent que certaines fonctionnalités soient disponibles. Par exemple, vous explorerez l'historique des commandes de Vim dans un chapitre ultérieur avec la commande `:history`. Votre Vim doit avoir la fonctionnalité `+cmdline_history` pour que la commande fonctionne. Il y a de bonnes chances que le Vim que vous venez d'installer ait toutes les fonctionnalités nécessaires, surtout s'il provient d'une source de téléchargement populaire.

Beaucoup de choses que vous faites depuis le terminal peuvent également être faites depuis l'intérieur de Vim. Pour voir la version depuis *l'intérieur* de Vim, vous pouvez exécuter ceci : 

```shell
:version
```

Si vous voulez ouvrir le fichier `hello.txt` et exécuter immédiatement une commande Vim, vous pouvez passer à la commande `vim` l'option `+{cmd}`.

Dans Vim, vous pouvez substituer des chaînes avec la commande `:s` (abréviation de `:substitute`). Si vous voulez ouvrir `hello.txt` et substituer tous les "pancakes" par "bagels", exécutez :

```bash
vim +%s/pancake/bagel/g hello.txt
```

Ces commandes Vim peuvent être empilées :

```bash
vim +%s/pancake/bagel/g +%s/bagel/egg/g +%s/egg/donut/g hello.txt
```

Vim remplacera toutes les instances de "pancake" par "bagel", puis remplacera "bagel" par "egg", puis remplacera "egg" par "donut" (vous apprendrez la substitution dans un chapitre ultérieur).

Vous pouvez également passer l'option `-c` suivie d'une commande Vim au lieu de la syntaxe `+` :

```bash
vim -c %s/pancake/bagel/g hello.txt
vim -c %s/pancake/bagel/g -c %s/bagel/egg/g -c %s/egg/donut/g hello.txt
```

## Ouvrir plusieurs fenêtres

Vous pouvez lancer Vim dans des fenêtres horizontales et verticales divisées avec les options `-o` et `-O`, respectivement.

Pour ouvrir Vim avec deux fenêtres horizontales, exécutez :

```bash
vim -o2
```

Pour ouvrir Vim avec 5 fenêtres horizontales, exécutez :

```bash
vim -o5
```

Pour ouvrir Vim avec 5 fenêtres horizontales et remplir les deux premières avec `hello1.txt` et `hello2.txt`, exécutez :

```bash
vim -o5 hello1.txt hello2.txt
```

Pour ouvrir Vim avec deux fenêtres verticales, 5 fenêtres verticales, et 5 fenêtres verticales avec 2 fichiers :

```bash
vim -O2
vim -O5
vim -O5 hello1.txt hello2.txt
```

## Suspendre

Si vous devez suspendre Vim pendant que vous éditez, vous pouvez appuyer sur `Ctrl-z`. Vous pouvez également exécuter la commande `:stop` ou `:suspend`. Pour revenir à Vim suspendu, exécutez `fg` depuis le terminal.

## Démarrer Vim de manière intelligente

La commande `vim` peut prendre de nombreuses options différentes, tout comme toute autre commande terminal. Deux options vous permettent de passer une commande Vim en tant que paramètre : `+{cmd}` et `-c cmd`. Au fur et à mesure que vous apprendrez plus de commandes tout au long de ce guide, voyez si vous pouvez les appliquer lors du démarrage de Vim. Étant également une commande terminal, vous pouvez combiner `vim` avec de nombreuses autres commandes terminal. Par exemple, vous pouvez rediriger la sortie de la commande `ls` pour être éditée dans Vim avec `ls -l | vim -`.

Pour en savoir plus sur la commande `vim` dans le terminal, consultez `man vim`. Pour en savoir plus sur l'éditeur Vim, continuez à lire ce guide avec la commande `:help`.