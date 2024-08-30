---
description: Ce document présente les types de données Vimscript et explique comment
  les utiliser pour écrire des conditionnels et des boucles dans un programme basique.
title: Ch26. Vimscript Conditionals and Loops
---

Après avoir appris quels sont les types de données de base, l'étape suivante consiste à apprendre comment les combiner pour commencer à écrire un programme de base. Un programme de base se compose de conditionnelles et de boucles.

Dans ce chapitre, vous apprendrez comment utiliser les types de données Vimscript pour écrire des conditionnelles et des boucles.

## Opérateurs Relationnels

Les opérateurs relationnels Vimscript sont similaires à ceux de nombreux langages de programmation :

```shell
a == b		égal à
a != b		pas égal à
a >  b		plus grand que
a >= b		plus grand ou égal à
a <  b		moins que
a <= b		moins ou égal à
```

Par exemple :

```shell
:echo 5 == 5
:echo 5 != 5
:echo 10 > 5
:echo 10 >= 5
:echo 10 < 5
:echo 5 <= 5
```

Rappelez-vous que les chaînes sont converties en nombres dans une expression arithmétique. Ici, Vim convertit également les chaînes en nombres dans une expression d'égalité. "5foo" est converti en 5 (vrai) :

```shell
:echo 5 == "5foo"
" renvoie vrai
```

Rappelez-vous également que si vous commencez une chaîne par un caractère non numérique comme "foo5", la chaîne est convertie en nombre 0 (faux).

```shell
echo 5 == "foo5"
" renvoie faux
```

### Opérateurs Logiques de Chaînes

Vim a d'autres opérateurs relationnels pour comparer des chaînes :

```shell
a =~ b
a !~ b
```

Par exemple :

```shell
let str = "petit déjeuner copieux"

echo str =~ "petit"
" renvoie vrai

echo str =~ "dîner"
" renvoie faux

echo str !~ "dîner"
" renvoie vrai
```

L'opérateur `=~` effectue une correspondance regex contre la chaîne donnée. Dans l'exemple ci-dessus, `str =~ "petit"` renvoie vrai car `str` *contient* le motif "petit". Vous pouvez toujours utiliser `==` et `!=`, mais les utiliser comparera l'expression à la chaîne entière. `=~` et `!~` sont des choix plus flexibles.

```shell
echo str == "petit"
" renvoie faux

echo str == "petit déjeuner copieux"
" renvoie vrai
```

Essayons celui-ci. Notez le "P" majuscule :

```shell
echo str =~ "Petit"
" vrai
```

Il renvoie vrai même si "Petit" est en majuscule. Intéressant... Il s'avère que mon paramètre Vim est réglé pour ignorer la casse (`set ignorecase`), donc lorsque Vim vérifie l'égalité, il utilise mon paramètre Vim et ignore la casse. Si je désactive l'ignorance de la casse (`set noignorecase`), la comparaison renvoie maintenant faux.

```shell
set noignorecase
echo str =~ "Petit"
" renvoie faux car la casse compte

set ignorecase
echo str =~ "Petit"
" renvoie vrai car la casse ne compte pas
```

Si vous écrivez un plugin pour d'autres, c'est une situation délicate. L'utilisateur utilise-t-il `ignorecase` ou `noignorecase` ? Vous ne voulez certainement pas forcer vos utilisateurs à changer leur option d'ignorance de la casse. Que faites-vous alors ?

Heureusement, Vim a un opérateur qui peut *toujours* ignorer ou faire correspondre la casse. Pour toujours faire correspondre la casse, ajoutez un `#` à la fin.

```shell
set ignorecase
echo str =~# "petit"
" renvoie vrai

echo str =~# "PeTiT"
" renvoie faux

set noignorecase
echo str =~# "petit"
" vrai

echo str =~# "PeTiT"
" faux

echo str !~# "PeTiT"
" vrai
```

Pour toujours ignorer la casse lors de la comparaison, ajoutez `?` :

```shell
set ignorecase
echo str =~? "petit"
" vrai

echo str =~? "PeTiT"
" vrai

set noignorecase
echo str =~? "petit"
" vrai

echo str =~? "PeTiT"
" vrai

echo str !~? "PeTiT"
" faux
```

Je préfère utiliser `#` pour toujours faire correspondre la casse et être du bon côté.

## If

Maintenant que vous avez vu les expressions d'égalité de Vim, abordons un opérateur conditionnel fondamental, l'instruction `if`.

Au minimum, la syntaxe est :

```shell
if {clause}
  {certaines expressions}
endif
```

Vous pouvez étendre l'analyse de cas avec `elseif` et `else`.

```shell
if {prédicat1}
  {expression1}
elseif {prédicat2}
  {expression2}
elseif {prédicat3}
  {expression3}
else
  {expression4}
endif
```

Par exemple, le plugin [vim-signify](https://github.com/mhinz/vim-signify) utilise une méthode d'installation différente selon vos paramètres Vim. Voici l'instruction d'installation de leur `readme`, utilisant l'instruction `if` :

```shell
if has('nvim') || has('patch-8.0.902')
  Plug 'mhinz/vim-signify'
else
  Plug 'mhinz/vim-signify', { 'branch': 'legacy' }
endif
```

## Expression Tertiaire

Vim a une expression ternaire pour une analyse de cas en une seule ligne :

```shell
{prédicat} ? expressionvraie : expressionfausse
```

Par exemple :

```shell
echo 1 ? "Je suis vrai" : "Je suis faux"
```

Puisque 1 est vrai, Vim affiche "Je suis vrai". Supposons que vous souhaitiez définir conditionnellement le `background` sur sombre si vous utilisez Vim après une certaine heure. Ajoutez ceci à vimrc :

```shell
let &background = strftime("%H") < 18 ? "clair" : "sombre"
```

`&background` est l'option `'background'` dans Vim. `strftime("%H")` renvoie l'heure actuelle en heures. S'il n'est pas encore 18 heures, utilisez un fond clair. Sinon, utilisez un fond sombre.

## ou

Le "ou" logique (`||`) fonctionne comme dans de nombreux langages de programmation.

```shell
{Expression fausse}  || {Expression fausse}   faux
{Expression fausse}  || {Expression vraie}    vrai
{Expression vraie}   || {Expression fausse}   vrai
{Expression vraie}   || {Expression vraie}    vrai
```

Vim évalue l'expression et renvoie soit 1 (vrai) soit 0 (faux).

```shell
echo 5 || 0
" renvoie 1

echo 5 || 5
" renvoie 1

echo 0 || 0
" renvoie 0

echo "foo5" || "foo5"
" renvoie 0

echo "5foo" || "foo5"
" renvoie 1
```

Si l'expression actuelle est évaluée comme vraie, l'expression suivante ne sera pas évaluée.

```shell
let une_douzaine = 12

echo une_douzaine || deux_douzaine
" renvoie 1

echo deux_douzaine || une_douzaine
" renvoie erreur
```

Notez que `deux_douzaine` n'est jamais défini. L'expression `une_douzaine || deux_douzaine` ne génère pas d'erreur car `une_douzaine` est évaluée en premier et trouvée vraie, donc Vim n'évalue pas `deux_douzaine`.

## et

Le "et" logique (`&&`) est le complément de l'"ou" logique.

```shell
{Expression fausse}  && {Expression fausse}   faux
{Expression fausse}  && {Expression vraie}    faux
{Expression vraie}   && {Expression fausse}   faux
{Expression vraie}   && {Expression vraie}    vrai
```

Par exemple :

```shell
echo 0 && 0
" renvoie 0

echo 0 && 10
" renvoie 0
```

`&&` évalue une expression jusqu'à ce qu'elle voit la première expression fausse. Par exemple, si vous avez `vrai && vrai`, il évaluera les deux et renverra `vrai`. Si vous avez `vrai && faux && vrai`, il évaluera le premier `vrai` et s'arrêtera à la première `faux`. Il ne va pas évaluer le troisième `vrai`.

```shell
let une_douzaine = 12
echo une_douzaine && 10
" renvoie 1

echo une_douzaine && v:false
" renvoie 0

echo une_douzaine && deux_douzaine
" renvoie erreur

echo exists("une_douzaine") && une_douzaine == 12
" renvoie 1
```

## pour

La boucle `for` est couramment utilisée avec le type de données liste.

```shell
let petits_dejeuners = ["crêpes", "gaufres", "œufs"]

for petit_dejeuner in petits_dejeuners
  echo petit_dejeuner
endfor
```

Elle fonctionne avec des listes imbriquées :

```shell
let repas = [["petit déjeuner", "crêpes"], ["déjeuner", "poisson"], ["dîner", "pâtes"]]

for [type_repas, nourriture] in repas
  echo "Je prends " . nourriture . " pour " . type_repas
endfor
```

Vous pouvez techniquement utiliser la boucle `for` avec un dictionnaire en utilisant la méthode `keys()`.

```shell
let boissons = #{petit_dejeuner: "lait", déjeuner: "jus d'orange", dîner: "eau"}
for type_boisson in keys(boissons)
  echo "Je bois " . boissons[type_boisson] . " pour " . type_boisson
endfor
```

## Tant que

Une autre boucle courante est la boucle `while`.

```shell
let compteur = 1
while compteur < 5
  echo "Le compteur est : " . compteur
  let compteur += 1
endwhile
```

Pour obtenir le contenu de la ligne actuelle à la dernière ligne :

```shell
let ligne_actuelle = line(".")
let derniere_ligne = line("$")

while ligne_actuelle <= derniere_ligne
  echo getline(ligne_actuelle)
  let ligne_actuelle += 1
endwhile
```

## Gestion des Erreurs

Souvent, votre programme ne s'exécute pas comme vous l'attendez. En conséquence, il vous fait tourner en bourrique (jeu de mots). Ce dont vous avez besoin, c'est d'une gestion des erreurs appropriée.

### Break

Lorsque vous utilisez `break` à l'intérieur d'une boucle `while` ou `for`, cela arrête la boucle.

Pour obtenir les textes du début du fichier jusqu'à la ligne actuelle, mais s'arrêter lorsque vous voyez le mot "beignet" :

```shell
let ligne = 0
let derniere_ligne = line("$")
let total_mots = ""

while ligne <= derniere_ligne
  let ligne += 1
  let texte_ligne = getline(ligne)
  if texte_ligne =~# "beignet"
    break
  endif
  echo texte_ligne
  let total_mots .= texte_ligne . " "
endwhile

echo total_mots
```

Si vous avez le texte :

```shell
un
deux
trois
beignet
quatre
cinq
```

L'exécution de la boucle `while` ci-dessus donne "un deux trois" et pas le reste du texte car la boucle se brise une fois qu'elle correspond à "beignet".

### Continue

La méthode `continue` est similaire à `break`, où elle est invoquée pendant une boucle. La différence est qu'au lieu de sortir de la boucle, elle saute simplement cette itération actuelle.

Supposons que vous ayez le même texte mais au lieu de `break`, vous utilisez `continue` :

```shell
let ligne = 0
let derniere_ligne = line("$")
let total_mots = ""

while ligne <= derniere_ligne
  let ligne += 1
  let texte_ligne = getline(ligne)
  if texte_ligne =~# "beignet"
    continue
  endif
  echo texte_ligne
  let total_mots .= texte_ligne . " "
endwhile

echo total_mots
```

Cette fois, cela renvoie `un deux trois quatre cinq`. Il saute la ligne avec le mot "beignet", mais la boucle continue.
### essayer, enfin et attraper

Vim a un `essayer`, `enfin` et `attraper` pour gérer les erreurs. Pour simuler une erreur, vous pouvez utiliser la commande `lancer`.

```shell
essayer
  echo "Essayer"
  lancer "Non"
finessayer
```

Exécutez ceci. Vim se plaindra avec l'erreur `"Exception non capturée : Non`.

Ajoutons maintenant un bloc `attraper` :

```shell
essayer
  echo "Essayer"
  lancer "Non"
attraper
  echo "Attrapé"
finessayer
```

Maintenant, il n'y a plus d'erreur. Vous devriez voir "Essayer" et "Attrapé" affichés.

Retirons le `attraper` et ajoutons un `enfin` :

```shell
essayer
  echo "Essayer"
  lancer "Non"
  echo "Vous ne me verrez pas"
enfin
  echo "Enfin"
finessayer
```

Exécutez ceci. Maintenant, Vim affiche l'erreur et "Enfin".

Mettons-les tous ensemble :

```shell
essayer
  echo "Essayer"
  lancer "Non"
attraper
  echo "Attrapé"
enfin
  echo "Enfin"
finessayer
```

Cette fois, Vim affiche à la fois "Attrapé" et "Enfin". Aucune erreur n'est affichée car Vim l'a capturée.

Les erreurs proviennent de différents endroits. Une autre source d'erreur est d'appeler une fonction inexistante, comme `Non()` ci-dessous :

```shell
essayer
  echo "Essayer"
  appeler Non()
attraper
  echo "Attrapé"
enfin
  echo "Enfin"
finessayer
```

La différence entre `attraper` et `enfin` est que `enfin` est toujours exécuté, erreur ou non, tandis qu'un `attraper` n'est exécuté que lorsque votre code rencontre une erreur.

Vous pouvez capturer une erreur spécifique avec `:attraper`. Selon `:h :attraper` :

```shell
attraper /^Vim:Interruption$/.             " attraper les interruptions (CTRL-C)
attraper /^Vim\\%((\\a\\+)\\)\\=:E/.    " attraper toutes les erreurs Vim
attraper /^Vim\\%((\\a\\+)\\)\\=:/.     " attraper les erreurs et les interruptions
attraper /^Vim(write):/.                " attraper toutes les erreurs dans :write
attraper /^Vim\\%((\\a\\+)\\)\\=:E123:/ " attraper l'erreur E123
attraper /mon-exception/.                " attraper l'exception utilisateur
attraper /.*/                           " attraper tout
attraper.                               " même que /.*/
```

À l'intérieur d'un bloc `essayer`, une interruption est considérée comme une erreur capturable.

```shell
essayer
  attraper /^Vim:Interruption$/
  dormir 100
finessayer
```

Dans votre vimrc, si vous utilisez un thème de couleurs personnalisé, comme [gruvbox](https://github.com/morhetz/gruvbox), et que vous supprimez accidentellement le répertoire du thème de couleurs mais que vous avez toujours la ligne `colorscheme gruvbox` dans votre vimrc, Vim lancera une erreur lorsque vous le `source`. Pour corriger cela, j'ai ajouté ceci dans mon vimrc :

```shell
essayer
  colorscheme gruvbox
attraper
  colorscheme par défaut
finessayer
```

Maintenant, si vous `source` le vimrc sans le répertoire `gruvbox`, Vim utilisera le `colorscheme par défaut`.

## Apprendre les conditionnels de manière intelligente

Dans le chapitre précédent, vous avez appris les types de données de base de Vim. Dans ce chapitre, vous avez appris à les combiner pour écrire des programmes de base en utilisant des conditionnels et des boucles. Ce sont les éléments de base de la programmation.

Ensuite, apprenons les portées des variables.