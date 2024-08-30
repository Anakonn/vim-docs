---
description: Ce document explique les variables dans Vim, y compris les variables
  mutables et immuables, ainsi que leurs sources et portées.
title: Ch27. Vimscript Variable Scopes
---

Avant de plonger dans les fonctions Vimscript, apprenons les différentes sources et portées des variables Vim.

## Variables Mutables et Immutables

Vous pouvez assigner une valeur à une variable dans Vim avec `let` :

```shell
let pancake = "pancake"
```

Plus tard, vous pouvez appeler cette variable à tout moment.

```shell
echo pancake
" renvoie "pancake"
```

`let` est mutable, ce qui signifie que vous pouvez changer la valeur à tout moment dans le futur.

```shell
let pancake = "pancake"
let pancake = "not waffles"

echo pancake
" renvoie "not waffles"
```

Remarquez que lorsque vous souhaitez changer la valeur d'une variable définie, vous devez toujours utiliser `let`.

```shell
let beverage = "milk"

beverage = "orange juice"
" génère une erreur
```

Vous pouvez définir une variable immuable avec `const`. Étant immuable, une fois qu'une valeur de variable est assignée, vous ne pouvez pas la réassigner avec une valeur différente.

```shell
const waffle = "waffle"
const waffle = "pancake"
" génère une erreur
```

## Sources de Variables

Il existe trois sources pour les variables : variable d'environnement, variable d'option et variable d'enregistrement.

### Variable d'Environnement

Vim peut accéder à votre variable d'environnement de terminal. Par exemple, si vous avez la variable d'environnement `SHELL` disponible dans votre terminal, vous pouvez y accéder depuis Vim avec :

```shell
echo $SHELL
" renvoie la valeur de $SHELL. Dans mon cas, cela renvoie /bin/bash
```

### Variable d'Option

Vous pouvez accéder aux options Vim avec `&` (ce sont les paramètres que vous accédez avec `set`).

Par exemple, pour voir quel arrière-plan Vim utilise, vous pouvez exécuter :

```shell
echo &background
" renvoie soit "light" soit "dark"
```

Alternativement, vous pouvez toujours exécuter `set background?` pour voir la valeur de l'option `background`.

### Variable d'Enregistrement

Vous pouvez accéder aux enregistrements Vim (Ch. 08) avec `@`.

Supposons que la valeur "chocolate" soit déjà enregistrée dans l'enregistrement a. Pour y accéder, vous pouvez utiliser `@a`. Vous pouvez également le mettre à jour avec `let`.

```shell
echo @a
" renvoie chocolate

let @a .= " donut"

echo @a
" renvoie "chocolate donut"
```

Maintenant, lorsque vous collez depuis l'enregistrement `a` (`"ap`), cela renverra "chocolate donut". L'opérateur `.=` concatène deux chaînes. L'expression `let @a .= " donut"` est la même que `let @a = @a . " donut"`

## Portées de Variables

Il existe 9 portées de variables différentes dans Vim. Vous pouvez les reconnaître par leur lettre préfixée :

```shell
g:           Variable globale
{nothing}    Variable globale
b:           Variable locale au tampon
w:           Variable locale à la fenêtre
t:           Variable locale à l'onglet
s:           Variable Vimscript source
l:           Variable locale à la fonction
a:           Variable de paramètre formel de la fonction
v:           Variable intégrée de Vim
```

### Variable Globale

Lorsque vous déclarez une variable "régulière" :

```shell
let pancake = "pancake"
```

`pancake` est en fait une variable globale. Lorsque vous définissez une variable globale, vous pouvez les appeler de n'importe où.

Préfixer `g:` à une variable crée également une variable globale.

```shell
let g:waffle = "waffle"
```

Dans ce cas, `pancake` et `g:waffle` ont la même portée. Vous pouvez appeler chacun d'eux avec ou sans `g:`.

```shell
echo pancake
" renvoie "pancake"

echo g:pancake
" renvoie "pancake"

echo waffle
" renvoie "waffle"

echo g:waffle
" renvoie "waffle"
```

### Variable de Tampon

Une variable précédée de `b:` est une variable de tampon. Une variable de tampon est une variable qui est locale au tampon actuel (Ch. 02). Si vous avez plusieurs tampons ouverts, chaque tampon aura sa propre liste séparée de variables de tampon.

Dans le tampon 1 :

```shell
const b:donut = "chocolate donut"
```

Dans le tampon 2 :

```shell
const b:donut = "blueberry donut"
```

Si vous exécutez `echo b:donut` depuis le tampon 1, cela renverra "chocolate donut". Si vous l'exécutez depuis le tampon 2, cela renverra "blueberry donut".

En passant, Vim a une variable de tampon *spéciale* `b:changedtick` qui suit tous les changements effectués dans le tampon actuel.

1. Exécutez `echo b:changedtick` et notez le nombre qu'il renvoie.
2. Apportez des modifications dans Vim.
3. Exécutez à nouveau `echo b:changedtick` et notez le nombre qu'il renvoie maintenant.

### Variable de Fenêtre

Une variable précédée de `w:` est une variable de fenêtre. Elle n'existe que dans cette fenêtre.

Dans la fenêtre 1 :

```shell
const w:donut = "chocolate donut"
```

Dans la fenêtre 2 :

```shell
const w:donut = "raspberry donut"
```

Dans chaque fenêtre, vous pouvez appeler `echo w:donut` pour obtenir des valeurs uniques.

### Variable d'Onglet

Une variable précédée de `t:` est une variable d'onglet. Elle n'existe que dans cet onglet.

Dans l'onglet 1 :

```shell
const t:donut = "chocolate donut"
```

Dans l'onglet 2 :

```shell
const t:donut = "blackberry donut"
```

Dans chaque onglet, vous pouvez appeler `echo t:donut` pour obtenir des valeurs uniques.

### Variable de Script

Une variable précédée de `s:` est une variable de script. Ces variables ne peuvent être accessibles que depuis l'intérieur de ce script.

Si vous avez un fichier arbitraire `dozen.vim` et à l'intérieur, vous avez :

```shell
let s:dozen = 12

function Consume()
  let s:dozen -= 1
  echo s:dozen " reste"
endfunction
```

Sourcez le fichier avec `:source dozen.vim`. Maintenant, appelez la fonction `Consume` :

```shell
:call Consume()
" renvoie "11 reste"

:call Consume()
" renvoie "10 reste"

:echo s:dozen
" Erreur de variable indéfinie
```

Lorsque vous appelez `Consume`, vous voyez qu'il décrémente la valeur de `s:dozen` comme prévu. Lorsque vous essayez d'obtenir la valeur de `s:dozen` directement, Vim ne la trouvera pas car vous êtes hors de portée. `s:dozen` n'est accessible que depuis l'intérieur de `dozen.vim`.

Chaque fois que vous sourcez le fichier `dozen.vim`, il réinitialise le compteur `s:dozen`. Si vous êtes en train de décrémenter la valeur de `s:dozen` et que vous exécutez `:source dozen.vim`, le compteur se réinitialise à 12. Cela peut poser problème pour les utilisateurs inattentifs. Pour corriger ce problème, refactorisez le code :

```shell
if !exists("s:dozen")
  let s:dozen = 12
endif

function Consume()
  let s:dozen -= 1
  echo s:dozen
endfunction
```

Maintenant, lorsque vous sourcez `dozen.vim` tout en étant en train de décrémenter, Vim lit `!exists("s:dozen")`, trouve que c'est vrai, et ne réinitialise pas la valeur à 12.

### Variable Locale à la Fonction et Variable de Paramètre Formel de la Fonction

La variable locale à la fonction (`l:`) et la variable formelle de la fonction (`a:`) seront couvertes dans le prochain chapitre.

### Variables Intégrées de Vim

Une variable précédée de `v:` est une variable intégrée spéciale de Vim. Vous ne pouvez pas définir ces variables. Vous en avez déjà vu certaines.
- `v:version` vous indique quelle version de Vim vous utilisez.
- `v:key` contient la valeur de l'élément actuel lors de l'itération à travers un dictionnaire.
- `v:val` contient la valeur de l'élément actuel lors de l'exécution d'une opération `map()` ou `filter()`.
- `v:true`, `v:false`, `v:null`, et `v:none` sont des types de données spéciaux.

Il existe d'autres variables. Pour une liste des variables intégrées de Vim, consultez `:h vim-variable` ou `:h v:`.

## Utiliser les Portées de Variables Vim de Manière Intelligente

Être capable d'accéder rapidement aux variables d'environnement, d'option et d'enregistrement vous donne une grande flexibilité pour personnaliser votre éditeur et votre environnement de terminal. Vous avez également appris que Vim a 9 portées de variables différentes, chacune existant sous certaines contraintes. Vous pouvez tirer parti de ces types de variables uniques pour découpler votre programme.

Vous êtes arrivé jusqu'ici. Vous avez appris sur les types de données, les moyens de combinaisons, et les portées de variables. Il ne reste qu'une chose : les fonctions.