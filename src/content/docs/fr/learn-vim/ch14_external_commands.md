---
description: Découvrez comment étendre Vim pour utiliser des commandes Unix externes,
  en lisant leur sortie, en écrivant des entrées et en exécutant des commandes.
title: Ch14. External Commands
---

À l'intérieur du système Unix, vous trouverez de nombreuses petites commandes hyper-spécialisées qui font une chose (et le font bien). Vous pouvez enchaîner ces commandes pour travailler ensemble afin de résoudre un problème complexe. Ne serait-il pas génial de pouvoir utiliser ces commandes depuis Vim ?

Certainement. Dans ce chapitre, vous apprendrez comment étendre Vim pour travailler sans problème avec des commandes externes.

## La Commande Bang

Vim a une commande bang (`!`) qui peut faire trois choses :

1. Lire le STDOUT d'une commande externe dans le tampon actuel.
2. Écrire le contenu de votre tampon comme STDIN d'une commande externe.
3. Exécuter une commande externe depuis l'intérieur de Vim.

Passons en revue chacune d'elles.

## Lire le STDOUT d'une Commande Dans Vim

La syntaxe pour lire le STDOUT d'une commande externe dans le tampon actuel est :

```shell
:r !cmd
```

`:r` est la commande de lecture de Vim. Si vous l'utilisez sans `!`, vous pouvez l'utiliser pour obtenir le contenu d'un fichier. Si vous avez un fichier `file1.txt` dans le répertoire actuel et que vous exécutez :

```shell
:r file1.txt
```

Vim mettra le contenu de `file1.txt` dans le tampon actuel.

Si vous exécutez la commande `:r` suivie d'un `!` et d'une commande externe, la sortie de cette commande sera insérée dans le tampon actuel. Pour obtenir le résultat de la commande `ls`, exécutez :

```shell
:r !ls
```

Cela renvoie quelque chose comme :

```shell
file1.txt
file2.txt
file3.txt
```

Vous pouvez lire les données de la commande `curl` :

```shell
:r !curl -s 'https://jsonplaceholder.typicode.com/todos/1'
```

La commande `r` accepte également une adresse :

```shell
:10r !cat file1.txt
```

Maintenant, le STDOUT de l'exécution de `cat file1.txt` sera inséré après la ligne 10.

## Écrire le Contenu du Tampon Dans une Commande Externe

La commande `:w`, en plus de sauvegarder un fichier, peut être utilisée pour passer le texte dans le tampon actuel comme STDIN pour une commande externe. La syntaxe est :

```shell
:w !cmd
```

Si vous avez ces expressions :

```shell
console.log("Hello Vim");
console.log("Vim is awesome");
```

Assurez-vous d'avoir [node](https://nodejs.org/en/) installé sur votre machine, puis exécutez :

```shell
:w !node
```

Vim utilisera `node` pour exécuter les expressions JavaScript afin d'imprimer "Hello Vim" et "Vim is awesome".

Lors de l'utilisation de la commande `:w`, Vim utilise tous les textes dans le tampon actuel, similaire à la commande globale (la plupart des commandes en ligne de commande, si vous ne lui passez pas une plage, n'exécutent la commande que sur la ligne actuelle). Si vous passez `:w` une adresse spécifique :

```shell
:2w !node
```

Vim utilise uniquement le texte de la deuxième ligne dans l'interpréteur `node`.

Il y a une différence subtile mais significative entre `:w !node` et `:w! node`. Avec `:w !node`, vous "écrivez" le texte dans le tampon actuel dans la commande externe `node`. Avec `:w! node`, vous forcez la sauvegarde d'un fichier et nommez le fichier "node".

## Exécuter une Commande Externe

Vous pouvez exécuter une commande externe depuis l'intérieur de Vim avec la commande bang. La syntaxe est :

```shell
:!cmd
```

Pour voir le contenu du répertoire actuel au format long, exécutez :

```shell
:!ls -ls
```

Pour tuer un processus qui s'exécute sur le PID 3456, vous pouvez exécuter :

```shell
:!kill -9 3456
```

Vous pouvez exécuter n'importe quelle commande externe sans quitter Vim afin de rester concentré sur votre tâche.

## Filtrer les Textes

Si vous donnez `!` une plage, elle peut être utilisée pour filtrer des textes. Supposons que vous ayez les textes suivants :

```shell
hello vim
hello vim
```

Mettons la ligne actuelle en majuscules en utilisant la commande `tr` (translate). Exécutez :

```shell
:.!tr '[:lower:]' '[:upper:]'
```

Le résultat :

```shell
HELLO VIM
hello vim
```

La décomposition :
- `.!` exécute la commande de filtre sur la ligne actuelle.
- `tr '[:lower:]' '[:upper:]'` appelle la commande `tr` pour remplacer tous les caractères minuscules par des majuscules.

Il est impératif de passer une plage pour exécuter la commande externe comme filtre. Si vous essayez d'exécuter la commande ci-dessus sans le `.` (`:!tr '[:lower:]' '[:upper:]'`), vous verrez une erreur.

Supposons que vous deviez supprimer la deuxième colonne sur les deux lignes avec la commande `awk` :

```shell
:%!awk "{print $1}"
```

Le résultat :

```shell
hello
hello
```

La décomposition :
- `:%!` exécute la commande de filtre sur toutes les lignes (`%`).
- `awk "{print $1}"` imprime uniquement la première colonne de la correspondance.

Vous pouvez enchaîner plusieurs commandes avec l'opérateur de chaîne (`|`) tout comme dans le terminal. Disons que vous avez un fichier avec ces délicieux éléments de petit-déjeuner :

```shell
name price
chocolate pancake 10
buttermilk pancake 9
blueberry pancake 12
```

Si vous devez les trier en fonction du prix et afficher uniquement le menu avec un espacement uniforme, vous pouvez exécuter :

```shell
:%!awk 'NR > 1' | sort -nk 3 | column -t
```

Le résultat :
```shell
buttermilk pancake 9
chocolate pancake 10
blueberry pancake 12
```

La décomposition :
- `:%!` applique le filtre à toutes les lignes (`%`).
- `awk 'NR > 1'` affiche les textes uniquement à partir de la ligne numéro deux.
- `|` enchaîne la commande suivante.
- `sort -nk 3` trie numériquement (`n`) en utilisant les valeurs de la colonne 3 (`k 3`).
- `column -t` organise le texte avec un espacement uniforme.

## Commande en Mode Normal

Vim a un opérateur de filtre (`!`) en mode normal. Si vous avez les salutations suivantes :

```shell
hello vim
hola vim
bonjour vim
salve vim
```

Pour mettre en majuscules la ligne actuelle et la ligne en dessous, vous pouvez exécuter :
```shell
!jtr '[a-z]' '[A-Z]'
```

La décomposition :
- `!j` exécute l'opérateur de filtre de commande normale (`!`) ciblant la ligne actuelle et la ligne en dessous. Rappelez-vous qu'étant un opérateur en mode normal, la règle grammaticale `verbe + nom` s'applique. `!` est le verbe et `j` est le nom.
- `tr '[a-z]' '[A-Z]'` remplace les lettres minuscules par des lettres majuscules.

La commande de filtre normale ne fonctionne que sur des mouvements / objets texte qui font au moins une ligne ou plus. Si vous aviez essayé d'exécuter `!iwtr '[a-z]' '[A-Z]'` (exécuter `tr` sur le mot intérieur), vous constaterez qu'elle applique la commande `tr` sur toute la ligne, et non sur le mot sur lequel votre curseur se trouve.

## Apprendre les Commandes Externes de Manière Intelligente

Vim n'est pas un IDE. C'est un éditeur modal léger qui est hautement extensible par conception. Grâce à cette extensibilité, vous avez un accès facile à n'importe quelle commande externe dans votre système. Armé de ces commandes externes, Vim est un pas de plus vers le statut d'IDE. Quelqu'un a dit que le système Unix est le premier IDE jamais créé.

La commande bang est aussi utile que le nombre de commandes externes que vous connaissez. Ne vous inquiétez pas si vos connaissances en commandes externes sont limitées. J'ai encore beaucoup à apprendre aussi. Prenez cela comme une motivation pour un apprentissage continu. Chaque fois que vous devez modifier un texte, vérifiez s'il existe une commande externe qui peut résoudre votre problème. Ne vous inquiétez pas de maîtriser tout, apprenez simplement celles dont vous avez besoin pour accomplir la tâche actuelle.