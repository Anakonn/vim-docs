---
description: Ce document couvre les concepts de recherche et de substitution dans
  Vim, en mettant l'accent sur l'utilisation des expressions régulières et la sensibilité
  à la casse.
title: Ch12. Search and Substitute
---

Ce chapitre couvre deux concepts séparés mais liés : rechercher et substituer. Souvent, lors de l'édition, vous devez rechercher plusieurs textes en fonction de leurs motifs de dénominateur commun le plus bas. En apprenant à utiliser des expressions régulières dans la recherche et la substitution au lieu de chaînes littérales, vous serez en mesure de cibler rapidement n'importe quel texte.

En passant, dans ce chapitre, j'utiliserai `/` lorsque je parlerai de recherche. Tout ce que vous pouvez faire avec `/` peut également être fait avec `?`.

## Sensibilité à la casse intelligente

Il peut être délicat d'essayer de faire correspondre la casse du terme de recherche. Si vous recherchez le texte "Learn Vim", vous pouvez facilement mal saisir la casse d'une lettre et obtenir un faux résultat de recherche. Ne serait-il pas plus facile et plus sûr de pouvoir faire correspondre n'importe quelle casse ? C'est là que l'option `ignorecase` brille. Il suffit d'ajouter `set ignorecase` dans votre vimrc et tous vos termes de recherche deviennent insensibles à la casse. Maintenant, vous n'avez plus besoin de faire `/Learn Vim`, `/learn vim` fonctionnera.

Cependant, il y a des moments où vous devez rechercher une phrase spécifique à la casse. Une façon de le faire est de désactiver l'option `ignorecase` en exécutant `set noignorecase`, mais cela demande beaucoup de travail pour l'activer et la désactiver chaque fois que vous devez rechercher une phrase sensible à la casse.

Pour éviter de basculer `ignorecase`, Vim a une option `smartcase` pour rechercher une chaîne insensible à la casse si le motif de recherche *contient au moins un caractère majuscule*. Vous pouvez combiner à la fois `ignorecase` et `smartcase` pour effectuer une recherche insensible à la casse lorsque vous entrez tous les caractères en minuscules et une recherche sensible à la casse lorsque vous entrez un ou plusieurs caractères majuscules.

Dans votre vimrc, ajoutez :

```shell
set ignorecase smartcase
```

Si vous avez ces textes :

```shell
hello
HELLO
Hello
```

- `/hello` correspond à "hello", "HELLO" et "Hello".
- `/HELLO` correspond uniquement à "HELLO".
- `/Hello` correspond uniquement à "Hello".

Il y a un inconvénient. Que faire si vous devez rechercher uniquement une chaîne en minuscules ? Lorsque vous faites `/hello`, Vim effectue maintenant une recherche insensible à la casse. Vous pouvez utiliser le motif `\C` n'importe où dans votre terme de recherche pour indiquer à Vim que le terme de recherche suivant sera sensible à la casse. Si vous faites `/\Chello`, cela correspondra strictement à "hello", pas à "HELLO" ou "Hello".

## Premier et dernier caractère dans une ligne

Vous pouvez utiliser `^` pour faire correspondre le premier caractère d'une ligne et `$` pour faire correspondre le dernier caractère d'une ligne.

Si vous avez ce texte :

```shell
hello hello
```

Vous pouvez cibler le premier "hello" avec `/^hello`. Le caractère qui suit `^` doit être le premier caractère d'une ligne. Pour cibler le dernier "hello", exécutez `/hello$`. Le caractère avant `$` doit être le dernier caractère d'une ligne.

Si vous avez ce texte :

```shell
hello hello friend
```

Exécuter `/hello$` ne correspondra à rien car "friend" est le dernier terme de cette ligne, pas "hello".

## Recherche répétée

Vous pouvez répéter la recherche précédente avec `//`. Si vous venez de rechercher `/hello`, exécuter `//` équivaut à exécuter `/hello`. Ce raccourci peut vous faire gagner quelques frappes, surtout si vous venez de rechercher une longue chaîne. Rappelez-vous également que vous pouvez utiliser `n` et `N` pour répéter la dernière recherche dans la même direction et dans la direction opposée, respectivement.

Que faire si vous voulez rappeler rapidement les *n* derniers termes de recherche ? Vous pouvez parcourir rapidement l'historique des recherches en appuyant d'abord sur `/`, puis en appuyant sur les flèches `haut`/`bas` (ou `Ctrl-N`/`Ctrl-P`) jusqu'à ce que vous trouviez le terme de recherche dont vous avez besoin. Pour voir tout votre historique de recherche, vous pouvez exécuter `:history /`.

Lorsque vous atteignez la fin d'un fichier lors de la recherche, Vim lance une erreur : `"Search hit the BOTTOM without match for: {your-search}"`. Parfois, cela peut être une bonne protection contre la recherche excessive, mais d'autres fois, vous souhaitez faire défiler la recherche vers le haut à nouveau. Vous pouvez utiliser l'option `set wrapscan` pour faire en sorte que Vim recherche à nouveau en haut du fichier lorsque vous atteignez la fin du fichier. Pour désactiver cette fonctionnalité, faites `set nowrapscan`.

## Recherche de mots alternatifs

Il est courant de rechercher plusieurs mots à la fois. Si vous devez rechercher *soit* "hello vim" *soit* "hola vim", mais pas "salve vim" ou "bonjour vim", vous pouvez utiliser le motif `|`.

Étant donné ce texte :

```shell
hello vim
hola vim
salve vim
bonjour vim
```

Pour faire correspondre à la fois "hello" et "hola", vous pouvez faire `/hello\|hola`. Vous devez échapper (`\`) l'opérateur ou (`|`), sinon Vim recherchera littéralement la chaîne "|".

Si vous ne voulez pas taper `\|` à chaque fois, vous pouvez utiliser la syntaxe `magic` (`\v`) au début de la recherche : `/\vhello|hola`. Je ne couvrirai pas `magic` dans ce guide, mais avec `\v`, vous n'avez plus besoin d'échapper les caractères spéciaux. Pour en savoir plus sur `\v`, n'hésitez pas à consulter `:h \v`.

## Définir le début et la fin d'une correspondance

Peut-être avez-vous besoin de rechercher un texte qui fait partie d'un mot composé. Si vous avez ces textes :

```shell
11vim22
vim22
11vim
vim
```

Si vous devez sélectionner "vim" mais uniquement lorsqu'il commence par "11" et se termine par "22", vous pouvez utiliser les opérateurs `\zs` (début de correspondance) et `\ze` (fin de correspondance). Exécutez :

```shell
/11\zsvim\ze22
```

Vim doit toujours faire correspondre l'ensemble du motif "11vim22", mais ne met en surbrillance que le motif coincé entre `\zs` et `\ze`. Un autre exemple :

```shell
foobar
foobaz
```

Si vous devez faire correspondre le "foo" dans "foobaz" mais pas dans "foobar", exécutez :

```shell
/foo\zebaz
```

## Recherche de plages de caractères

Tous vos termes de recherche jusqu'à présent ont été une recherche de mots littéraux. Dans la vie réelle, vous devrez peut-être utiliser un motif général pour trouver votre texte. Le motif le plus basique est la plage de caractères, `[ ]`.

Si vous devez rechercher un chiffre, vous ne voulez probablement pas taper `/0\|1\|2\|3\|4\|5\|6\|7\|8\|9\|0` à chaque fois. Au lieu de cela, utilisez `/[0-9]` pour correspondre à un seul chiffre. L'expression `0-9` représente une plage de nombres de 0 à 9 que Vim essaiera de faire correspondre, donc si vous recherchez des chiffres entre 1 et 5, utilisez `/[1-5]`.

Les chiffres ne sont pas les seuls types de données que Vim peut rechercher. Vous pouvez également faire `/[a-z]` pour rechercher des lettres minuscules et `/[A-Z]` pour rechercher des lettres majuscules.

Vous pouvez combiner ces plages ensemble. Si vous devez rechercher des chiffres de 0 à 9 et des lettres minuscules et majuscules de "a" à "f" (comme en hexadécimal), vous pouvez faire `/[0-9a-fA-F]`.

Pour effectuer une recherche négative, vous pouvez ajouter `^` à l'intérieur des crochets de plage de caractères. Pour rechercher un non-chiffre, exécutez `/[^0-9]`. Vim fera correspondre n'importe quel caractère tant qu'il n'est pas un chiffre. Attention, le caret (`^`) à l'intérieur des crochets est différent du caret de début de ligne (ex : `/^hello`). Si un caret est à l'extérieur d'une paire de crochets et est le premier caractère du terme de recherche, cela signifie "le premier caractère d'une ligne". Si un caret est à l'intérieur d'une paire de crochets et est le premier caractère à l'intérieur des crochets, cela signifie un opérateur de recherche négatif. `/^abc` correspond au premier "abc" dans une ligne et `/[^abc]` correspond à tout caractère sauf un "a", "b" ou "c".

## Recherche de caractères répétés

Si vous devez rechercher des chiffres doubles dans ce texte :

```shell
1aa
11a
111
```

Vous pouvez utiliser `/[0-9][0-9]` pour faire correspondre un caractère à deux chiffres, mais cette méthode n'est pas évolutive. Que faire si vous devez faire correspondre vingt chiffres ? Taper `[0-9]` vingt fois n'est pas une expérience agréable. C'est pourquoi vous avez besoin d'un argument `count`.

Vous pouvez passer `count` à votre recherche. Il a la syntaxe suivante :

```shell
{n,m}
```

Au fait, ces accolades `count` doivent être échappées lorsque vous les utilisez dans Vim. L'opérateur `count` est placé après un seul caractère que vous souhaitez incrémenter.

Voici les quatre variations différentes de la syntaxe `count` :
- `{n}` est une correspondance exacte. `/[0-9]\{2\}` correspond aux nombres à deux chiffres : "11" et le "11" dans "111".
- `{n,m}` est une correspondance de plage. `/[0-9]\{2,3\}` correspond aux nombres de 2 à 3 chiffres : "11" et "111".
- `{,m}` est une correspondance jusqu'à. `/[0-9]\{,3\}` correspond aux nombres jusqu'à 3 chiffres : "1", "11" et "111".
- `{n,}` est une correspondance d'au moins. `/[0-9]\{2,\}` correspond à au moins 2 chiffres ou plus : "11" et "111".

Les arguments de count `\{0,\}` (zéro ou plus) et `\{1,\}` (un ou plus) sont des motifs de recherche courants et Vim a des opérateurs spéciaux pour eux : `*` et `+` (`+` doit être échappé tandis que `*` fonctionne sans échappement). Si vous faites `/[0-9]*`, c'est la même chose que `/[0-9]\{0,\}`. Cela recherche zéro ou plusieurs chiffres. Cela correspondra à "", "1", "123". Au fait, cela correspondra également à des non-chiffres comme "a", car il y a techniquement zéro chiffre dans la lettre "a". Réfléchissez bien avant d'utiliser `*`. Si vous faites `/[0-9]\+`, c'est la même chose que `/[0-9]\{1,\}`. Cela recherche un ou plusieurs chiffres. Cela correspondra à "1" et "12".

## Plages de caractères prédéfinies

Vim a des plages prédéfinies pour des caractères courants comme les chiffres et les lettres. Je ne vais pas passer en revue chacune ici, mais vous pouvez trouver la liste complète dans `:h /character-classes`. Voici celles qui sont utiles :

```shell
\d    Chiffre [0-9]
\D    Non-chiffre [^0-9]
\s    Caractère d'espace (espace et tabulation)
\S    Caractère non-espace (tout sauf espace et tabulation)
\w    Caractère de mot [0-9A-Za-z_]
\l    Lettres minuscules [a-z]
\u    Caractère majuscule [A-Z]
```

Vous pouvez les utiliser comme vous utiliseriez des plages de caractères. Pour rechercher n'importe quel chiffre unique, au lieu d'utiliser `/[0-9]`, vous pouvez utiliser `/\d` pour une syntaxe plus concise.

## Exemple de recherche : Capturer un texte entre une paire de caractères similaires

Si vous souhaitez rechercher une phrase entourée d'une paire de guillemets doubles :

```shell
"Vim is awesome!"
```

Exécutez ceci :

```shell
/"[^"]\+"
```

Décomposons-le :
- `"` est un guillemet double littéral. Il correspond au premier guillemet double.
- `[^"]` signifie tout caractère sauf un guillemet double. Il correspond à tout caractère alphanumérique et d'espace tant qu'il n'est pas un guillemet double.
- `\+` signifie un ou plusieurs. Comme il est précédé par `[^"]`, Vim recherche un ou plusieurs caractères qui ne sont pas un guillemet double.
- `"` est un guillemet double littéral. Il correspond au guillemet double de fermeture.

Lorsque Vim voit le premier `"`, il commence la capture du motif. Dès qu'il voit le deuxième guillemet double dans une ligne, il correspond au deuxième motif `"` et arrête la capture du motif. Pendant ce temps, tous les caractères qui ne sont pas des guillemets doubles entre les deux sont capturés par le motif `[^"]\+`, dans ce cas, la phrase `Vim is awesome!`. C'est un motif courant pour capturer une phrase entourée d'une paire de délimiteurs similaires.

- Pour capturer une phrase entourée de guillemets simples, vous pouvez utiliser `/'[^']\+'`.
- Pour capturer une phrase entourée de zéros, vous pouvez utiliser `/0[^0]\+0`.

## Exemple de recherche : Capturer un numéro de téléphone

Si vous souhaitez faire correspondre un numéro de téléphone américain séparé par un tiret (`-`), comme `123-456-7890`, vous pouvez utiliser :

```shell
/\d\{3\}-\d\{3\}-\d\{4\}
```

Un numéro de téléphone américain se compose d'un ensemble de trois chiffres, suivi d'autres trois chiffres, et enfin de quatre chiffres. Décomposons-le :
- `\d\{3\}` correspond à un chiffre répété exactement trois fois
- `-` est un tiret littéral

Vous pouvez éviter de taper des échappements avec `\v` :

```shell
/\v\d{3}-\d{3}-\d{4}
```

Ce motif est également utile pour capturer des chiffres répétés, tels que des adresses IP et des codes postaux.

Cela couvre la partie recherche de ce chapitre. Passons maintenant à la substitution.

## Substitution de base

La commande de substitution de Vim est une commande utile pour trouver et remplacer rapidement n'importe quel motif. La syntaxe de substitution est :

```shell
:s/{ancien-motif}/{nouveau-motif}/
```

Commençons par une utilisation de base. Si vous avez ce texte :

```shell
vim is good
```

Substituons "good" par "awesome" parce que Vim est génial. Exécutez `:s/good/awesome/`. Vous devriez voir :

```shell
vim is awesome
```
## Répéter la Dernière Substitution

Vous pouvez répéter la dernière commande de substitution avec soit la commande normale `&`, soit en exécutant `:s`. Si vous venez d'exécuter `:s/good/awesome/`, exécuter soit `&` soit `:s` la répétera.

De plus, plus tôt dans ce chapitre, j'ai mentionné que vous pouvez utiliser `//` pour répéter le motif de recherche précédent. Cette astuce fonctionne avec la commande de substitution. Si `/good` a été fait récemment et que vous laissez le premier argument de motif de substitution vide, comme dans `:s//awesome/`, cela fonctionne de la même manière que d'exécuter `:s/good/awesome/`.

## Plage de Substitution

Tout comme de nombreuses commandes Ex, vous pouvez passer un argument de plage à la commande de substitution. La syntaxe est :

```shell
:[plage]s/ancien/nouveau/
```

Si vous avez ces expressions :

```shell
let one = 1;
let two = 2;
let three = 3;
let four = 4;
let five = 5;
```

Pour substituer "let" par "const" sur les lignes trois à cinq, vous pouvez faire :

```shell
:3,5s/let/const/
```

Voici quelques variations de plage que vous pouvez passer :

- `:,3s/let/const/` - si rien n'est donné avant la virgule, cela représente la ligne actuelle. Substituez de la ligne actuelle à la ligne 3.
- `:1,s/let/const/` - si rien n'est donné après la virgule, cela représente également la ligne actuelle. Substituez de la ligne 1 à la ligne actuelle.
- `:3s/let/const/` - si une seule valeur est donnée comme plage (pas de virgule), cela effectue la substitution uniquement sur cette ligne.

Dans Vim, `%` signifie généralement le fichier entier. Si vous exécutez `:%s/let/const/`, cela effectuera la substitution sur toutes les lignes. Gardez à l'esprit cette syntaxe de plage. De nombreuses commandes de ligne de commande que vous apprendrez dans les chapitres à venir suivront cette forme.

## Correspondance de Motifs

Les prochaines sections couvriront les expressions régulières de base. Une bonne connaissance des motifs est essentielle pour maîtriser la commande de substitution.

Si vous avez les expressions suivantes :

```shell
let one = 1;
let two = 2;
let three = 3;
let four = 4;
let five = 5;
```

Pour ajouter une paire de guillemets autour des chiffres :

```shell
:%s/\d/"\0"/
```

Le résultat :

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Décomposons la commande :
- `:%s` cible l'ensemble du fichier pour effectuer la substitution.
- `\d` est la plage prédéfinie de Vim pour les chiffres (similaire à l'utilisation de `[0-9]`).
- `"\0"` ici, les guillemets doubles sont des guillemets littéraux. `\0` est un caractère spécial représentant "le motif entier correspondant". Le motif correspondant ici est un chiffre unique, `\d`.

Alternativement, `&` représente également le motif entier correspondant comme `\0`. `:s/\d/"&"/` aurait également fonctionné.

Considérons un autre exemple. Étant donné ces expressions et vous devez échanger tous les "let" avec les noms de variables.

```shell
one let = "1";
two let = "2";
three let = "3";
four let = "4";
five let = "5";
```

Pour cela, exécutez :

```shell
:%s/\(\w\+\) \(\w\+\)/\2 \1/
```

La commande ci-dessus contient trop de barres obliques inverses et est difficile à lire. Dans ce cas, il est plus pratique d'utiliser l'opérateur `\v` :

```shell
:%s/\v(\w+) (\w+)/\2 \1/
```

Le résultat :

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Super ! Décomposons cette commande :
- `:%s` cible toutes les lignes du fichier pour effectuer la substitution.
- `(\w+) (\w+)` est une correspondance de groupe. `\w` est l'une des plages prédéfinies de Vim pour un caractère de mot (`[0-9A-Za-z_]`). Les `( )` qui l'entourent capturent une correspondance de caractère de mot dans un groupe. Remarquez l'espace entre les deux groupements. `(\w+) (\w+)` capture deux groupes. Le premier groupe capture "one" et le deuxième groupe capture "two".
- `\2 \1` renvoie le groupe capturé dans un ordre inversé. `\2` contient la chaîne capturée "let" et `\1` la chaîne "one". Avoir `\2 \1` renvoie la chaîne "let one".

Rappelez-vous que `\0` représente le motif entier correspondant. Vous pouvez diviser la chaîne correspondante en groupes plus petits avec `( )`. Chaque groupe est représenté par `\1`, `\2`, `\3`, etc.

Faisons un exemple de plus pour solidifier ce concept de correspondance de groupe. Si vous avez ces chiffres :

```shell
123
456
789
```

Pour inverser l'ordre, exécutez :

```shell
:%s/\v(\d)(\d)(\d)/\3\2\1/
```

Le résultat est :

```shell
321
654
987
```

Chaque `(\d)` correspond à chaque chiffre et crée un groupe. Sur la première ligne, le premier `(\d)` a une valeur de 1, le deuxième `(\d)` a une valeur de 2, et le troisième `(\d)` a une valeur de 3. Ils sont stockés dans les variables `\1`, `\2`, et `\3`. Dans la seconde moitié de votre substitution, le nouveau motif `\3\2\1` donne la valeur "321" sur la première ligne.

Si vous aviez exécuté cela à la place :

```shell
:%s/\v(\d\d)(\d)/\2\1/
```
Vous auriez obtenu un résultat différent :

```shell
312
645
978
```

C'est parce que vous n'avez maintenant que deux groupes. Le premier groupe, capturé par `(\d\d)`, est stocké dans `\1` et a la valeur de 12. Le deuxième groupe, capturé par `(\d)`, est stocké dans `\2` et a la valeur de 3. `\2\1` renvoie alors 312.

## Indicateurs de Substitution

Si vous avez la phrase :

```shell
chocolate pancake, strawberry pancake, blueberry pancake
```

Pour substituer tous les pancakes par des donuts, vous ne pouvez pas simplement exécuter :

```shell
:s/pancake/donut
```

La commande ci-dessus ne substituera que la première correspondance, vous donnant :

```shell
chocolate donut, strawberry pancake, blueberry pancake
```

Il y a deux façons de résoudre cela. Vous pouvez soit exécuter la commande de substitution deux fois de plus, soit lui passer un indicateur global (`g`) pour substituer toutes les correspondances dans une ligne.

Parlons de l'indicateur global. Exécutez :

```shell
:s/pancake/donut/g
```

Vim substitue tous les pancakes par des donuts en une seule commande rapide. La commande globale est l'un des plusieurs indicateurs que la commande de substitution accepte. Vous passez des indicateurs à la fin de la commande de substitution. Voici une liste d'indicateurs utiles :

```shell
&    Réutiliser les indicateurs de la commande de substitution précédente.
g    Remplacer toutes les correspondances dans la ligne.
c    Demander une confirmation de substitution.
e    Empêcher l'affichage d'un message d'erreur lorsque la substitution échoue.
i    Effectuer une substitution insensible à la casse.
I    Effectuer une substitution sensible à la casse.
```

Il y a d'autres indicateurs que je ne liste pas ci-dessus. Pour lire tous les indicateurs, consultez `:h s_flags`.

Au fait, les commandes de répétition de substitution (`&` et `:s`) ne conservent pas les indicateurs. Exécuter `&` répétera uniquement `:s/pancake/donut/` sans `g`. Pour répéter rapidement la dernière commande de substitution avec tous les indicateurs, exécutez `:&&`.

## Changer le Délimiteur

Si vous devez remplacer une URL par un long chemin :

```shell
https://mysite.com/a/b/c/d/e
```

Pour le substituer par le mot "hello", exécutez :

```shell
:s/https:\/\/mysite.com\/a\/b\/c\/d\/e/hello/
```

Cependant, il est difficile de dire quelles barres obliques (`/`) font partie du motif de substitution et lesquelles sont les délimiteurs. Vous pouvez changer le délimiteur avec n'importe quel caractère à un octet (sauf pour les alphabets, les chiffres, ou `"`, `|`, et `\`). Remplaçons-les par `+`. La commande de substitution ci-dessus peut alors être réécrite comme suit :

```shell
:s+https:\/\/mysite.com\/a\/b\/c\/d\/e+hello+
```

Il est maintenant plus facile de voir où se trouvent les délimiteurs.

## Remplacement Spécial

Vous pouvez également modifier la casse du texte que vous substituez. Étant donné les expressions suivantes et votre tâche est de mettre en majuscule les variables "one", "two", "three", etc.

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Exécutez :

```shell
:%s/\v(\w+) (\w+)/\1 \U\2/
```

Vous obtiendrez :

```shell
let ONE = "1";
let TWO = "2";
let THREE = "3";
let FOUR = "4";
let FIVE = "5";
```

La décomposition :
- `(\w+) (\w+)` capture les deux premiers groupes correspondants, tels que "let" et "one".
- `\1` renvoie la valeur du premier groupe, "let".
- `\U\2` met en majuscule (`\U`) le deuxième groupe (`\2`).

Le truc de cette commande est l'expression `\U\2`. `\U` indique que le caractère suivant doit être mis en majuscule.

Faisons un exemple de plus. Supposons que vous écriviez un guide Vim et que vous deviez capitaliser la première lettre de chaque mot dans une ligne.

```shell
vim is the greatest text editor in the whole galaxy
```

Vous pouvez exécuter :

```shell
:s/\<./\U&/g
```

Le résultat :

```shell
Vim Is The Greatest Text Editor In The Whole Galaxy
```

Voici les décompositions :
- `:s` substitue la ligne actuelle.
- `\<.` est composé de deux parties : `\<` pour correspondre au début d'un mot et `.` pour correspondre à n'importe quel caractère. L'opérateur `\<` fait en sorte que le caractère suivant soit le premier caractère d'un mot. Puisque `.` est le caractère suivant, il correspondra au premier caractère de n'importe quel mot.
- `\U&` met en majuscule le symbole suivant, `&`. Rappelez-vous que `&` (ou `\0`) représente la correspondance entière. Il correspond au premier caractère de n'importe quel mot.
- `g` l'indicateur global. Sans lui, cette commande ne substitue que la première correspondance. Vous devez substituer chaque correspondance sur cette ligne.

Pour en savoir plus sur les symboles de remplacement spéciaux de la substitution comme `\U`, consultez `:h sub-replace-special`.

## Motifs Alternatifs

Parfois, vous devez correspondre à plusieurs motifs simultanément. Si vous avez les salutations suivantes :

```shell
hello vim
hola vim
salve vim
bonjour vim
```

Vous devez substituer le mot "vim" par "ami" mais uniquement sur les lignes contenant le mot "hello" ou "hola". Rappelez-vous qu'au début de ce chapitre, vous pouvez utiliser `|` pour plusieurs motifs alternatifs.

```shell
:%s/\v(hello|hola) vim/\1 friend/g
```

Le résultat :

```shell
hello friend
hola friend
salve vim
bonjour vim
```

Voici la décomposition :
- `%s` exécute la commande de substitution sur chaque ligne d'un fichier.
- `(hello|hola)` correspond à *soit* "hello" *soit* "hola" et le considère comme un groupe.
- `vim` est le mot littéral "vim".
- `\1` est le premier groupe, qui est soit le texte "hello" soit "hola".
- `friend` est le mot littéral "ami".

## Substituer le Début et la Fin d'un Motif

Rappelez-vous que vous pouvez utiliser `\zs` et `\ze` pour définir le début et la fin d'une correspondance. Cette technique fonctionne également dans la substitution. Si vous avez :

```shell
chocolate pancake
strawberry sweetcake
blueberry hotcake
```

Pour substituer le "cake" dans "hotcake" par "dog" pour obtenir un "hotdog" :

```shell
:%s/hot\zscake/dog/g
```

Résultat :

```shell
chocolate pancake
strawberry sweetcake
blueberry hotdog
```
## Avide et Non-avide

Vous pouvez substituer le nième match dans une ligne avec cette astuce :

```shell
One Mississippi, two Mississippi, three Mississippi, four Mississippi, five Mississippi.
```

Pour substituer le troisième "Mississippi" par "Arkansas", exécutez :

```shell
:s/\v(.{-}\zsMississippi){3}/Arkansas/g
```

La décomposition :
- `:s/` la commande de substitution.
- `\v` est le mot clé magique afin que vous n'ayez pas à échapper les mots clés spéciaux.
- `.` correspond à n'importe quel caractère unique.
- `{-}` effectue une correspondance non avide de 0 ou plus de l'atome précédent.
- `\zsMississippi` fait de "Mississippi" le début de la correspondance.
- `(...){3}` recherche le troisième match.

Vous avez vu la syntaxe `{3}` plus tôt dans ce chapitre. Dans ce cas, `{3}` correspond exactement au troisième match. Le nouvel élément ici est `{-}`. C'est une correspondance non avide. Elle trouve la correspondance la plus courte du motif donné. Dans ce cas, `(.{-}Mississippi)` correspond à la plus petite quantité de "Mississippi" précédée de n'importe quel caractère. Contrairement à `(.*Mississippi)` où elle trouve la correspondance la plus longue du motif donné.

Si vous utilisez `(.{-}Mississippi)`, vous obtenez cinq correspondances : "One Mississippi", "Two Mississippi", etc. Si vous utilisez `(.*Mississippi)`, vous obtenez une correspondance : le dernier "Mississippi". `*` est un correspondance avide et `{-}` est une correspondance non avide. Pour en savoir plus, consultez `:h /\{-` et `:h non-greedy`.

Faisons un exemple plus simple. Si vous avez la chaîne :

```shell
abc1de1
```

Vous pouvez correspondre "abc1de1" (avide) avec :

```shell
/a.*1
```

Vous pouvez correspondre "abc1" (non avide) avec :

```shell
/a.\{-}1
```

Donc, si vous devez mettre en majuscule la correspondance la plus longue (avide), exécutez :

```shell
:s/a.*1/\U&/g
```

Pour obtenir :

```shell
ABC1DEFG1
```

Si vous devez mettre en majuscule la correspondance la plus courte (non avide), exécutez :

```shell
:s/a.\{-}1/\U&/g
```

Pour obtenir :

```shell
ABC1defg1
```

Si vous êtes nouveau dans le concept avide vs non avide, cela peut être difficile à comprendre. Expérimentez avec différentes combinaisons jusqu'à ce que vous compreniez.

## Substitution à Travers Plusieurs Fichiers

Enfin, apprenons à substituer des phrases à travers plusieurs fichiers. Pour cette section, supposons que vous avez deux fichiers : `food.txt` et `animal.txt`.

À l'intérieur de `food.txt` :

```shell
corndog
hotdog
chilidog
```

À l'intérieur de `animal.txt` :

```shell
large dog
medium dog
small dog
```

Supposons que votre structure de répertoire ressemble à ceci :

```shell
- food.txt
- animal.txt
```

Tout d'abord, capturez les deux `food.txt` et `animal.txt` à l'intérieur de `:args`. Rappelez-vous des chapitres précédents que `:args` peut être utilisé pour créer une liste de noms de fichiers. Il existe plusieurs façons de faire cela depuis Vim, l'une d'elles est d'exécuter ceci depuis Vim :

```shell
:args *.txt                  capture tous les fichiers txt dans l'emplacement actuel
```

Pour tester, lorsque vous exécutez `:args`, vous devriez voir :

```shell
[food.txt] animal.txt
```

Maintenant que tous les fichiers pertinents sont stockés dans la liste des arguments, vous pouvez effectuer une substitution multi-fichiers avec la commande `:argdo`. Exécutez :

```shell
:argdo %s/dog/chicken/
```

Cela effectue la substitution sur tous les fichiers de la liste `:args`. Enfin, enregistrez les fichiers modifiés avec :

```shell
:argdo update
```

`:args` et `:argdo` sont des outils utiles pour appliquer des commandes de ligne de commande à travers plusieurs fichiers. Essayez-le avec d'autres commandes !

## Substitution à Travers Plusieurs Fichiers Avec des Macros

Alternativement, vous pouvez également exécuter la commande de substitution à travers plusieurs fichiers avec des macros. Exécutez :

```shell
:args *.txt
qq
:%s/dog/chicken/g
:wnext
q
99@q
```

La décomposition :
- `:args *.txt` ajoute tous les fichiers texte dans la liste `:args`.
- `qq` commence la macro dans le registre "q".
- `:%s/dog/chicken/g` substitue "dog" par "chicken" sur toutes les lignes du fichier actuel.
- `:wnext` enregistre le fichier puis passe au fichier suivant de la liste `args`.
- `q` arrête l'enregistrement de la macro.
- `99@q` exécute la macro quatre-vingt-dix-neuf fois. Vim arrêtera l'exécution de la macro après avoir rencontré la première erreur, donc Vim n'exécutera pas réellement la macro quatre-vingt-dix-neuf fois.

## Apprendre la Recherche et la Substitution de Manière Intelligente

La capacité à bien rechercher est une compétence nécessaire en édition. Maîtriser la recherche vous permet d'utiliser la flexibilité des expressions régulières pour rechercher n'importe quel motif dans un fichier. Prenez le temps d'apprendre cela. Pour vous améliorer avec les expressions régulières, vous devez les utiliser activement. J'ai une fois lu un livre sur les expressions régulières sans réellement le faire et j'ai presque tout oublié après. Le codage actif est le meilleur moyen de maîtriser une compétence.

Une bonne façon d'améliorer votre compétence en correspondance de motifs est chaque fois que vous devez rechercher un motif (comme "hello 123"), au lieu de demander le terme de recherche littéral (`/hello 123`), essayez de trouver un motif pour cela (quelque chose comme `/\v(\l+) (\d+)`). Beaucoup de ces concepts d'expressions régulières sont également applicables en programmation générale, pas seulement lors de l'utilisation de Vim.

Maintenant que vous avez appris sur la recherche avancée et la substitution dans Vim, apprenons l'une des commandes les plus polyvalentes, la commande globale.