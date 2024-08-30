---
description: Ce document explique comment utiliser le mode visuel dans Vim pour manipuler
  efficacement le texte, en détaillant les trois types de modes visuels.
title: Ch11. Visual Mode
---

Mettre en évidence et appliquer des modifications à un corps de texte est une fonctionnalité courante dans de nombreux éditeurs de texte et traitements de texte. Vim peut le faire en utilisant le mode visuel. Dans ce chapitre, vous apprendrez à utiliser le mode visuel pour manipuler les textes de manière efficace.

## Les Trois Types de Modes Visuels

Vim a trois modes visuels différents. Ils sont :

```shell
v         Mode visuel par caractère
V         Mode visuel par ligne
Ctrl-V    Mode visuel par bloc
```

Si vous avez le texte :

```shell
un
deux
trois
```

Le mode visuel par caractère fonctionne avec des caractères individuels. Appuyez sur `v` sur le premier caractère. Ensuite, descendez à la ligne suivante avec `j`. Cela met en surbrillance tout le texte de "un" jusqu'à l'emplacement de votre curseur. Si vous appuyez sur `gU`, Vim met en majuscule les caractères surlignés.

Le mode visuel par ligne fonctionne avec des lignes. Appuyez sur `V` et regardez Vim sélectionner toute la ligne sur laquelle se trouve votre curseur. Tout comme le mode visuel par caractère, si vous exécutez `gU`, Vim met en majuscule les caractères surlignés.

Le mode visuel par bloc fonctionne avec des lignes et des colonnes. Il vous donne plus de liberté de mouvement que les deux autres modes. Si vous appuyez sur `Ctrl-V`, Vim met en surbrillance le caractère sous le curseur tout comme le mode visuel par caractère, sauf qu'au lieu de surligner chaque caractère jusqu'à la fin de la ligne avant de descendre à la ligne suivante, il descend à la ligne suivante avec une surbrillance minimale. Essayez de vous déplacer avec `h/j/k/l` et regardez le curseur se déplacer.

En bas à gauche de votre fenêtre Vim, vous verrez soit `-- VISUAL --`, `-- VISUAL LINE --`, ou `-- VISUAL BLOCK --` affiché pour indiquer dans quel mode visuel vous vous trouvez.

Lorsque vous êtes dans un mode visuel, vous pouvez passer à un autre mode visuel en appuyant sur `v`, `V`, ou `Ctrl-V`. Par exemple, si vous êtes en mode visuel par ligne et que vous souhaitez passer au mode visuel par bloc, exécutez `Ctrl-V`. Essayez-le !

Il y a trois façons de quitter le mode visuel : `<Esc>`, `Ctrl-C`, et la même touche que votre mode visuel actuel. Ce que cela signifie, c'est que si vous êtes actuellement en mode visuel par ligne (`V`), vous pouvez en sortir en appuyant à nouveau sur `V`. Si vous êtes en mode visuel par caractère, vous pouvez en sortir en appuyant sur `v`.

Il y a en fait une autre façon d'entrer dans le mode visuel :

```shell
gv    Aller au mode visuel précédent
```

Cela démarrera le même mode visuel sur le même bloc de texte surligné que vous avez utilisé la dernière fois.

## Navigation dans le Mode Visuel

Tout en étant dans un mode visuel, vous pouvez étendre le bloc de texte surligné avec les mouvements Vim.

Utilisons le même texte que vous avez utilisé précédemment :

```shell
un
deux
trois
```

Cette fois, commençons à partir de la ligne "deux". Appuyez sur `v` pour aller au mode visuel par caractère (ici, les crochets carrés `[]` représentent les surlignages de caractères) :

```shell
un
[d]eux
trois
```

Appuyez sur `j` et Vim mettra en surbrillance tout le texte de la ligne "deux" jusqu'au premier caractère de la ligne "trois".

```shell
un
[deux
t]rois
```

Supposons qu'à partir de cette position, vous souhaitiez ajouter la ligne "un" également. Si vous appuyez sur `k`, à votre grand désespoir, la surbrillance s'éloigne de la ligne "trois". 

```shell
un
[d]eux
trois
```

Y a-t-il un moyen d'élargir librement la sélection visuelle pour se déplacer dans n'importe quelle direction ? Certainement. Revenons un peu en arrière là où vous avez la ligne "deux" et "trois" surlignées.

```shell
un
[deux
t]rois    <-- curseur
```

La surbrillance visuelle suit le mouvement du curseur. Si vous souhaitez l'étendre vers le haut jusqu'à la ligne "un", vous devez déplacer le curseur vers la ligne "deux". En ce moment, le curseur est sur la ligne "trois". Vous pouvez basculer l'emplacement du curseur avec `o` ou `O`.

```shell
un
[deux     <-- curseur
t]rois
```

Maintenant, lorsque vous appuyez sur `k`, cela n réduit plus la sélection, mais l'étend vers le haut.

```shell
[un
deux
t]rois
```

Avec `o` ou `O` en mode visuel, le curseur saute du début à la fin du bloc surligné, vous permettant d'élargir la zone de surbrillance.

## Grammaire du Mode Visuel

Le mode visuel partage de nombreuses opérations avec le mode normal.

Par exemple, si vous avez le texte suivant et que vous souhaitez supprimer les deux premières lignes depuis le mode visuel :

```shell
un
deux
trois
```

Surlignez les lignes "un" et "deux" avec le mode visuel par ligne (`V`) :

```shell
[un
deux]
trois
```

Appuyer sur `d` supprimera la sélection, similaire au mode normal. Remarquez que la règle de grammaire du mode normal, verbe + nom, ne s'applique pas. Le même verbe est toujours là (`d`), mais il n'y a pas de nom dans le mode visuel. La règle de grammaire dans le mode visuel est nom + verbe, où le nom est le texte surligné. Sélectionnez d'abord le bloc de texte, puis la commande suit.

En mode normal, il y a certaines commandes qui ne nécessitent pas de mouvement, comme `x` pour supprimer un seul caractère sous le curseur et `r` pour remplacer le caractère sous le curseur (`rx` remplace le caractère sous le curseur par "x"). En mode visuel, ces commandes s'appliquent maintenant à tout le texte surligné au lieu d'un seul caractère. De retour au texte surligné :

```shell
[un
deux]
trois
```

Exécuter `x` supprime tous les textes surlignés.

Vous pouvez utiliser ce comportement pour créer rapidement un en-tête dans un texte markdown. Supposons que vous ayez besoin de transformer rapidement le texte suivant en un en-tête markdown de premier niveau ("===") :

```shell
Chapitre Un
```

Tout d'abord, copiez le texte avec `yy`, puis collez-le avec `p` :

```shell
Chapitre Un
Chapitre Un
```

Maintenant, allez à la deuxième ligne et sélectionnez-la avec le mode visuel par ligne :

```shell
Chapitre Un
[Chapitre Un]
```

Un en-tête de premier niveau est une série de "=" en dessous d'un texte. Exécutez `r=`, voilà ! Cela vous évite de taper "=" manuellement.

```shell
Chapitre Un
===========
```

Pour en savoir plus sur les opérateurs en mode visuel, consultez `:h visual-operators`.

## Mode Visuel et Commandes en Ligne de Commande

Vous pouvez appliquer sélectivement des commandes en ligne de commande sur un bloc de texte surligné. Si vous avez ces déclarations et que vous souhaitez substituer "const" par "let" uniquement sur les deux premières lignes :

```shell
const un = "un";
const deux = "deux";
const trois = "trois";
```

Surlignez les deux premières lignes avec *n'importe quel* mode visuel et exécutez la commande de substitution `:s/const/let/g` :

```shell
let un = "un";
let deux = "deux";
const trois = "trois";
```

Remarquez que j'ai dit que vous pouvez faire cela avec *n'importe quel* mode visuel. Vous n'avez pas besoin de surligner toute la ligne pour exécuter la commande sur cette ligne. Tant que vous sélectionnez au moins un caractère sur chaque ligne, la commande est appliquée.

## Ajouter du Texte sur Plusieurs Lignes

Vous pouvez ajouter du texte sur plusieurs lignes dans Vim en utilisant le mode visuel par bloc. Si vous devez ajouter un point-virgule à la fin de chaque ligne :

```shell
const un = "un"
const deux = "deux"
const trois = "trois"
```

Avec votre curseur sur la première ligne :
- Exécutez le mode visuel par bloc et descendez de deux lignes (`Ctrl-V jj`).
- Surlignez jusqu'à la fin de la ligne (`$`).
- Ajoutez (`A`) puis tapez ";".
- Quittez le mode visuel (`<Esc>`).

Vous devriez voir le ";" ajouté à chaque ligne maintenant. Plutôt cool ! Il y a deux façons d'entrer en mode insertion depuis le mode visuel par bloc : `A` pour entrer le texte après le curseur ou `I` pour entrer le texte avant le curseur. Ne les confondez pas avec `A` (ajouter du texte à la fin de la ligne) et `I` (insérer du texte avant la première ligne non vide) du mode normal.

Alternativement, vous pouvez également utiliser la commande `:normal` pour ajouter du texte sur plusieurs lignes :
- Surlignez les 3 lignes (`vjj`).
- Tapez `:normal! A;`.

Rappelez-vous, la commande `:normal` exécute des commandes en mode normal. Vous pouvez lui indiquer d'exécuter `A;` pour ajouter le texte ";" à la fin de la ligne.

## Incrémenter des Nombres

Vim a les commandes `Ctrl-X` et `Ctrl-A` pour décrémenter et incrémenter des nombres. Lorsqu'elles sont utilisées avec le mode visuel, vous pouvez incrémenter des nombres sur plusieurs lignes.

Si vous avez ces éléments HTML :

```shell
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
```

Il est de mauvaise pratique d'avoir plusieurs identifiants ayant le même nom, alors incrémentons-les pour les rendre uniques :
- Déplacez votre curseur sur le "1" de la deuxième ligne.
- Commencez le mode visuel par bloc et descendez de 3 lignes (`Ctrl-V 3j`). Cela met en surbrillance les "1" restants. Maintenant, tous les "1" devraient être surlignés (sauf la première ligne).
- Exécutez `g Ctrl-A`.

Vous devriez voir ce résultat :

```shell
<div id="app-1"></div>
<div id="app-2"></div>
<div id="app-3"></div>
<div id="app-4"></div>
<div id="app-5"></div>
```

`g Ctrl-A` incrémente les nombres sur plusieurs lignes. `Ctrl-X/Ctrl-A` peut également incrémenter des lettres, avec l'option de formats numériques :

```shell
set nrformats+=alpha
```

L'option `nrformats` indique à Vim quels bases sont considérées comme des "nombres" pour que `Ctrl-A` et `Ctrl-X` puissent incrémenter et décrémenter. En ajoutant `alpha`, un caractère alphabétique est maintenant considéré comme un nombre. Si vous avez les éléments HTML suivants :

```shell
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
```

Mettez votre curseur sur le deuxième "app-a". Utilisez la même technique que ci-dessus (`Ctrl-V 3j` puis `g Ctrl-A`) pour incrémenter les identifiants.

```shell
<div id="app-a"></div>
<div id="app-b"></div>
<div id="app-c"></div>
<div id="app-d"></div>
<div id="app-e"></div>
```

## Sélectionner la Dernière Zone de Mode Visuel

Plus tôt dans ce chapitre, j'ai mentionné que `gv` peut rapidement mettre en surbrillance le dernier surlignage du mode visuel. Vous pouvez également aller à l'emplacement du début et de la fin du dernier mode visuel avec ces deux marques spéciales :

```shell
`<    Aller au premier endroit du surlignage précédent du mode visuel
`>    Aller au dernier endroit du surlignage précédent du mode visuel
```

Plus tôt, j'ai également mentionné que vous pouvez exécuter sélectivement des commandes en ligne de commande sur un texte surligné, comme `:s/const/let/g`. Lorsque vous avez fait cela, vous avez vu ceci ci-dessous :

```shell
:`<,`>s/const/let/g
```

Vous exécutiez en fait une commande `s/const/let/g` *de portée* (avec les deux marques comme adresses). Intéressant !

Vous pouvez toujours modifier ces marques à tout moment. Si vous aviez besoin de substituer du début du texte surligné à la fin du fichier, vous n'avez qu'à changer la commande en :

```shell
:`<,$s/const/let/g
```

## Entrer en Mode Visuel Depuis le Mode Insertion

Vous pouvez également entrer en mode visuel depuis le mode insertion. Pour aller au mode visuel par caractère pendant que vous êtes en mode insertion :

```shell
Ctrl-O v
```

Rappelez-vous que l'exécution de `Ctrl-O` pendant que vous êtes en mode insertion vous permet d'exécuter une commande en mode normal. Pendant ce temps, dans ce mode d'attente de commande en mode normal, exécutez `v` pour entrer en mode visuel par caractère. Remarquez qu'en bas à gauche de l'écran, il est écrit `--(insert) VISUAL--`. Ce truc fonctionne avec n'importe quel opérateur de mode visuel : `v`, `V`, et `Ctrl-V`.

## Mode Sélection

Vim a un mode similaire au mode visuel appelé le mode sélection. Comme le mode visuel, il a également trois modes différents :

```shell
gh         Mode de sélection par caractère
gH         Mode de sélection par ligne
gCtrl-h    Mode de sélection par bloc
```

Le mode sélection imite le comportement de surlignage de texte d'un éditeur classique plus près que le mode visuel de Vim.

Dans un éditeur classique, après avoir surligné un bloc de texte et tapé une lettre, disons la lettre "y", cela supprimera le texte surligné et insérera la lettre "y". Si vous surlignez une ligne avec le mode de sélection par ligne (`gH`) et tapez "y", cela supprimera le texte surligné et insérera la lettre "y".

Contrastez ce mode de sélection avec le mode visuel : si vous surlignez une ligne de texte avec le mode visuel par ligne (`V`) et tapez "y", le texte surligné ne sera pas supprimé et remplacé par la lettre littérale "y", il sera copié. Vous ne pouvez pas exécuter de commandes en mode normal sur le texte surligné en mode sélection.

Personnellement, je n'ai jamais utilisé le mode sélection, mais c'est bon de savoir qu'il existe.

## Apprendre le Mode Visuel de Manière Intelligente

Le mode visuel est la représentation par Vim de la procédure de surlignage de texte.

Si vous vous trouvez à utiliser l'opération du mode visuel beaucoup plus souvent que les opérations du mode normal, faites attention. C'est un anti-modèle. Cela prend plus de frappes pour exécuter une opération en mode visuel que son homologue en mode normal. Par exemple, si vous devez supprimer un mot intérieur, pourquoi utiliser quatre frappes, `viwd` (surligner visuellement un mot intérieur puis supprimer), si vous pouvez y parvenir avec juste trois frappes (`diw`) ? Ce dernier est plus direct et concis. Bien sûr, il y aura des moments où les modes visuels sont appropriés, mais en général, privilégiez une approche plus directe.