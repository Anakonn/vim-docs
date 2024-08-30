---
description: Ce document présente la commande globale de Vim, permettant d'exécuter
  des commandes sur plusieurs lignes simultanément, avec des exemples et une syntaxe
  claire.
title: Ch13. the Global Command
---

Jusqu'à présent, vous avez appris à répéter le dernier changement avec la commande point (`.`), à rejouer des actions avec des macros (`q`), et à stocker des textes dans les registres (`"`).

Dans ce chapitre, vous apprendrez à répéter une commande de ligne de commande avec la commande globale.

## Aperçu de la Commande Globale

La commande globale de Vim est utilisée pour exécuter une commande de ligne de commande sur plusieurs lignes simultanément.

Au fait, vous avez peut-être entendu parler du terme "Commandes Ex" auparavant. Dans ce guide, je les appelle des commandes de ligne de commande. Les commandes Ex et les commandes de ligne de commande sont les mêmes. Ce sont les commandes qui commencent par un deux-points (`:`). La commande de substitution dans le dernier chapitre était un exemple d'une commande Ex. Elles sont appelées Ex parce qu'elles proviennent à l'origine de l'éditeur de texte Ex. Je continuerai à les appeler commandes de ligne de commande dans ce guide. Pour une liste complète des commandes Ex, consultez `:h ex-cmd-index`.

La commande globale a la syntaxe suivante :

```shell
:g/pattern/command
```

Le `pattern` correspond à toutes les lignes contenant ce motif, similaire au motif dans la commande de substitution. La `command` peut être n'importe quelle commande de ligne de commande. La commande globale fonctionne en exécutant `command` sur chaque ligne qui correspond au `pattern`.

Si vous avez les expressions suivantes :

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Pour supprimer toutes les lignes contenant "console", vous pouvez exécuter :

```shell
:g/console/d
```

Résultat :

```shell
const one = 1;

const two = 2;

const three = 3;
```

La commande globale exécute la commande de suppression (`d`) sur toutes les lignes qui correspondent au motif "console".

Lors de l'exécution de la commande `g`, Vim effectue deux analyses à travers le fichier. Lors de la première exécution, il analyse chaque ligne et marque la ligne qui correspond au motif `/console/`. Une fois toutes les lignes correspondantes marquées, il effectue une seconde fois et exécute la commande `d` sur les lignes marquées.

Si vous souhaitez supprimer toutes les lignes contenant "const" à la place, exécutez :

```shell
:g/const/d
```

Résultat :

```shell
console.log("one: ", one);

console.log("two: ", two);

console.log("three: ", three);
```

## Correspondance Inverse

Pour exécuter la commande globale sur les lignes non correspondantes, vous pouvez exécuter :

```shell
:g!/pattern/command
```

ou

```shell
:v/pattern/command
```

Si vous exécutez `:v/console/d`, cela supprimera toutes les lignes *ne contenant pas* "console".

## Motif

La commande globale utilise le même système de motifs que la commande de substitution, donc cette section servira de rappel. N'hésitez pas à passer à la section suivante ou à lire en continu !

Si vous avez ces expressions :

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Pour supprimer les lignes contenant soit "one" soit "two", exécutez :

```shell
:g/one\|two/d
```

Pour supprimer les lignes contenant n'importe quel chiffre unique, exécutez soit :

```shell
:g/[0-9]/d
```

ou

```shell
:g/\d/d
```

Si vous avez l'expression :

```shell
const oneMillion = 1000000;
const oneThousand = 1000;
const one = 1;
```

Pour correspondre aux lignes contenant entre trois et six zéros, exécutez :

```shell
:g/0\{3,6\}/d
```

## Passer une Plage

Vous pouvez passer une plage avant la commande `g`. Voici quelques façons de le faire :
- `:1,5g/console/d` correspond à la chaîne "console" entre les lignes 1 et 5 et les supprime.
- `:,5g/console/d` s'il n'y a pas d'adresse avant la virgule, alors cela commence à partir de la ligne actuelle. Il recherche la chaîne "console" entre la ligne actuelle et la ligne 5 et les supprime.
- `:3,g/console/d` s'il n'y a pas d'adresse après la virgule, alors cela se termine à la ligne actuelle. Il recherche la chaîne "console" entre la ligne 3 et la ligne actuelle et les supprime.
- `:3g/console/d` si vous ne passez qu'une seule adresse sans virgule, cela exécute la commande uniquement sur la ligne 3. Il regarde la ligne 3 et la supprime si elle contient la chaîne "console".

En plus des numéros, vous pouvez également utiliser ces symboles comme plage :
- `.` signifie la ligne actuelle. Une plage de `.,3` signifie entre la ligne actuelle et la ligne 3.
- `$` signifie la dernière ligne du fichier. La plage `3,$` signifie entre la ligne 3 et la dernière ligne.
- `+n` signifie n lignes après la ligne actuelle. Vous pouvez l'utiliser avec `.` ou sans. `3,+1` ou `3,.+1` signifie entre la ligne 3 et la ligne après la ligne actuelle.

Si vous ne donnez aucune plage, par défaut, cela affecte l'ensemble du fichier. Ce n'est en fait pas la norme. La plupart des commandes de ligne de commande de Vim s'exécutent uniquement sur la ligne actuelle si vous ne lui passez aucune plage. Les deux exceptions notables sont les commandes globale (`:g`) et de sauvegarde (`:w`).

## Commande Normale

Vous pouvez exécuter une commande normale avec la commande globale avec la commande de ligne de commande `:normal`.

Si vous avez ce texte :
```shell
const one = 1
console.log("one: ", one)

const two = 2
console.log("two: ", two)

const three = 3
console.log("three: ", three)
```

Pour ajouter un ";" à la fin de chaque ligne, exécutez :

```shell
:g/./normal A;
```

Décomposons cela :
- `:g` est la commande globale.
- `/./` est un motif pour "lignes non vides". Il correspond aux lignes avec au moins un caractère, donc il correspond aux lignes avec "const" et "console" et ne correspond pas aux lignes vides.
- `normal A;` exécute la commande de ligne de commande `:normal`. `A;` est la commande en mode normal pour insérer un ";" à la fin de la ligne.

## Exécution d'une Macro

Vous pouvez également exécuter une macro avec la commande globale. Une macro peut être exécutée avec la commande `normal`. Si vous avez les expressions :

```shell
const one = 1
console.log("one: ", one);

const two = 2
console.log("two: ", two);

const three = 3
console.log("three: ", three);
```

Remarquez que les lignes avec "const" n'ont pas de points-virgules. Créons une macro pour ajouter une virgule à la fin de ces lignes dans le registre a :

```shell
qaA;<Esc>q
```

Si vous avez besoin d'un rappel, consultez le chapitre sur les macros. Maintenant, exécutez :

```shell
:g/const/normal @a
```

Maintenant, toutes les lignes avec "const" auront un ";" à la fin.

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Si vous avez suivi cette étape par étape, vous aurez deux points-virgules sur la première ligne. Pour éviter cela, exécutez la commande globale à partir de la ligne deux, `:2,$g/const/normal @a`.

## Commande Globale Récursive

La commande globale elle-même est un type de commande de ligne de commande, donc vous pouvez techniquement exécuter la commande globale à l'intérieur d'une commande globale.

Étant donné les expressions suivantes, si vous souhaitez supprimer la deuxième instruction `console.log` :

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Si vous exécutez :

```shell
:g/console/g/two/d
```

Tout d'abord, `g` recherchera les lignes contenant le motif "console" et trouvera 3 correspondances. Ensuite, le deuxième `g` recherchera la ligne contenant le motif "two" parmi ces trois correspondances. Enfin, il supprimera cette correspondance.

Vous pouvez également combiner `g` avec `v` pour trouver des motifs positifs et négatifs. Par exemple :

```shell
:g/console/v/two/d
```

Au lieu de rechercher la ligne contenant le motif "two", il recherchera les lignes *ne contenant pas* le motif "two".

## Changer le Délimiteur

Vous pouvez changer le délimiteur de la commande globale comme pour la commande de substitution. Les règles sont les mêmes : vous pouvez utiliser n'importe quel caractère de byte unique sauf les alphabets, les chiffres, `"`, `|`, et `\`.

Pour supprimer les lignes contenant "console" :

```shell
:g@console@d
```

Si vous utilisez la commande de substitution avec la commande globale, vous pouvez avoir deux délimiteurs différents :

```shell
g@one@s+const+let+g
```

Ici, la commande globale recherchera toutes les lignes contenant "one". La commande de substitution substituera, parmi ces correspondances, la chaîne "const" par "let".

## La Commande Par Défaut

Que se passe-t-il si vous ne spécifiez aucune commande de ligne de commande dans la commande globale ?

La commande globale utilisera la commande d'impression (`:p`) pour imprimer le texte de la ligne actuelle. Si vous exécutez :

```shell
:g/console
```

Cela imprimera en bas de l'écran toutes les lignes contenant "console".

Au fait, voici un fait intéressant. Parce que la commande par défaut utilisée par la commande globale est `p`, cela rend la syntaxe `g` :

```shell
:g/re/p
```

- `g` = la commande globale
- `re` = le motif regex
- `p` = la commande d'impression

Cela épelle *"grep"*, le même `grep` de la ligne de commande. Ce n'est **pas** une coïncidence. La commande `g/re/p` provient à l'origine de l'éditeur Ed, l'un des premiers éditeurs de texte en ligne. La commande `grep` a tiré son nom d'Ed.

Votre ordinateur a probablement encore l'éditeur Ed. Exécutez `ed` depuis le terminal (indice : pour quitter, tapez `q`).

## Inverser Tout le Tampon

Pour inverser l'ensemble du fichier, exécutez :

```shell
:g/^/m 0
```

`^` est un motif pour le début d'une ligne. Utilisez `^` pour correspondre à toutes les lignes, y compris les lignes vides.

Si vous devez inverser seulement quelques lignes, passez-lui une plage. Pour inverser les lignes entre la ligne cinq et la ligne dix, exécutez :

```shell
:5,10g/^/m 0
```

Pour en savoir plus sur la commande de déplacement, consultez `:h :move`.

## Agréger Tous les Todos

Lors de la programmation, il m'arrive parfois d'écrire des TODO dans le fichier que j'édite :

```shell
const one = 1;
console.log("one: ", one);
// TODO: nourrir le chiot

const two = 2;
// TODO: nourrir le chiot automatiquement
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: créer une startup vendant un nourrisseur automatique pour chiots
```

Il peut être difficile de garder une trace de tous les TODO créés. Vim a une méthode `:t` (copie) pour copier toutes les correspondances à une adresse. Pour en savoir plus sur la méthode de copie, consultez `:h :copy`.

Pour copier tous les TODO à la fin du fichier pour une introspection plus facile, exécutez :

```shell
:g/TODO/t $
```

Résultat :

```shell
const one = 1;
console.log("one: ", one);
// TODO: nourrir le chiot

const two = 2;
// TODO: nourrir le chiot automatiquement
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: créer une startup vendant un nourrisseur automatique pour chiots

// TODO: nourrir le chiot
// TODO: nourrir le chiot automatiquement
// TODO: créer une startup vendant un nourrisseur automatique pour chiots
```

Maintenant, je peux examiner tous les TODO que j'ai créés, trouver un moment pour les faire ou les déléguer à quelqu'un d'autre, et continuer à travailler sur ma prochaine tâche.

Si au lieu de les copier, vous souhaitez déplacer tous les TODO à la fin, utilisez la commande de déplacement, `:m` :

```shell
:g/TODO/m $
```

Résultat :

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);

// TODO: nourrir le chiot
// TODO: nourrir le chiot automatiquement
// TODO: créer une startup vendant un nourrisseur automatique pour chiots
```

## Suppression dans le Trou Noir

Rappelez-vous du chapitre sur les registres que les textes supprimés sont stockés dans les registres numérotés (à condition qu'ils soient suffisamment grands). Chaque fois que vous exécutez `:g/console/d`, Vim stocke les lignes supprimées dans les registres numérotés. Si vous supprimez de nombreuses lignes, vous pouvez rapidement remplir tous les registres numérotés. Pour éviter cela, vous pouvez toujours utiliser le registre trou noir (`"_`) pour *ne pas* stocker vos lignes supprimées dans les registres. Exécutez :

```shell
:g/console/d_
```

En passant `_` après `d`, Vim ne remplira pas vos registres de travail.
## Réduire plusieurs lignes vides à une seule ligne vide

Si vous avez un texte avec plusieurs lignes vides :

```shell
const one = 1;
console.log("one: ", one);


const two = 2;
console.log("two: ", two);





const three = 3;
console.log("three: ", three);
```

Vous pouvez rapidement réduire les lignes vides à une seule ligne vide avec :

```shell
:g/^$/,/./-1j
```

Résultat :

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Normalement, la commande globale accepte la forme suivante : `:g/pattern/command`. Cependant, vous pouvez également exécuter la commande globale avec la forme suivante : `:g/pattern1/,/pattern2/command`. Avec cela, Vim appliquera la `command` dans `pattern1` et `pattern2`.

Avec cela en tête, décomposons la commande `:g/^$/,/./-1j` selon `:g/pattern1/,/pattern2/command` :
- `/pattern1/` est `/^$/`. Cela représente une ligne vide (une ligne sans caractère).
- `/pattern2/` est `/./` avec le modificateur de ligne `-1`. `/./` représente une ligne non vide (une ligne avec au moins un caractère). Le `-1` signifie la ligne au-dessus de cela.
- `command` est `j`, la commande de jointure (`:j`). Dans ce contexte, cette commande globale joint toutes les lignes données.

Au fait, si vous souhaitez réduire plusieurs lignes vides à aucune ligne, exécutez ceci à la place :

```shell
:g/^$/,/./j
```

Une alternative plus simple :

```shell
:g/^$/-j
```

Votre texte est maintenant réduit à :

```shell
const one = 1;
console.log("one: ", one);
const two = 2;
console.log("two: ", two);
const three = 3;
console.log("three: ", three);
```

## Tri avancé

Vim a une commande `:sort` pour trier les lignes dans une plage. Par exemple :

```shell
d
b
a
e
c
```

Vous pouvez les trier en exécutant `:sort`. Si vous lui donnez une plage, il ne triera que les lignes dans cette plage. Par exemple, `:3,5sort` ne trie que les lignes trois et cinq.

Si vous avez les expressions suivantes :

```shell
const arrayB = [
  "i",
  "g",
  "h",
  "b",
  "f",
  "d",
  "e",
  "c",
  "a",
]

const arrayA = [
  "h",
  "b",
  "f",
  "d",
  "e",
  "a",
  "c",
]
```

Si vous devez trier les éléments à l'intérieur des tableaux, mais pas les tableaux eux-mêmes, vous pouvez exécuter ceci :

```shell
:g/\[/+1,/\]/-1sort
```

Résultat :

```shell
const arrayB = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
]

const arrayA = [
  "a"
  "b",
  "c",
  "d",
  "e",
  "f",
  "h",
]
```

C'est génial ! Mais la commande semble compliquée. Décomposons-la. Cette commande suit également la forme `:g/pattern1/,/pattern2/command`.

- `:g` est le modèle de commande globale.
- `/\[/+1` est le premier modèle. Il correspond à un crochet gauche littéral "[". Le `+1` fait référence à la ligne en dessous.
- `/\]/-1` est le deuxième modèle. Il correspond à un crochet droit littéral "]". Le `-1` fait référence à la ligne au-dessus.
- `/\[/+1,/\]/-1` fait alors référence à toutes les lignes entre "[" et "]".
- `sort` est une commande de ligne de commande pour trier.

## Apprenez la commande globale de manière intelligente

La commande globale exécute la commande de ligne de commande contre toutes les lignes correspondantes. Avec cela, vous n'avez besoin d'exécuter une commande qu'une seule fois et Vim fera le reste pour vous. Pour devenir compétent dans la commande globale, deux choses sont nécessaires : un bon vocabulaire de commandes de ligne de commande et une connaissance des expressions régulières. Au fur et à mesure que vous passez plus de temps à utiliser Vim, vous apprendrez naturellement plus de commandes de ligne de commande. Une connaissance des expressions régulières nécessitera une approche plus active. Mais une fois que vous serez à l'aise avec les expressions régulières, vous serez en avance sur beaucoup.

Certains des exemples ici sont compliqués. Ne soyez pas intimidé. Prenez vraiment le temps de les comprendre. Apprenez à lire les modèles. Ne renoncez pas.

Chaque fois que vous devez exécuter plusieurs commandes, faites une pause et voyez si vous pouvez utiliser la commande `g`. Identifiez la meilleure commande pour le travail et écrivez un modèle pour cibler autant de choses que possible en une seule fois.

Maintenant que vous savez à quel point la commande globale est puissante, apprenons à utiliser les commandes externes pour augmenter votre arsenal d'outils.