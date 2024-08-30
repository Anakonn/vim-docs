---
description: Ce document présente les mouvements essentiels de Vim pour naviguer efficacement
  dans un fichier, en se concentrant sur les touches `hjkl` pour une utilisation rapide.
title: Ch05. Moving in a File
---

Au début, se déplacer avec un clavier semble lent et maladroit, mais n'abandonnez pas ! Une fois que vous vous y habituez, vous pouvez aller n'importe où dans un fichier plus rapidement qu'en utilisant une souris.

Dans ce chapitre, vous apprendrez les mouvements essentiels et comment les utiliser efficacement. Gardez à l'esprit que ce n'est **pas** l'ensemble des mouvements que Vim propose. L'objectif ici est d'introduire des mouvements utiles pour devenir productif rapidement. Si vous avez besoin d'en apprendre davantage, consultez `:h motion.txt`.

## Navigation par caractère

L'unité de mouvement la plus basique est de se déplacer d'un caractère à gauche, en bas, en haut et à droite.

```shell
h   Gauche
j   Bas
k   Haut
l   Droite
gj  Bas dans une ligne à retour à la ligne souple
gk  Haut dans une ligne à retour à la ligne souple
```

Vous pouvez également vous déplacer avec les flèches directionnelles. Si vous débutez, n'hésitez pas à utiliser la méthode avec laquelle vous êtes le plus à l'aise.

Je préfère `hjkl` parce que ma main droite peut rester sur la rangée de base. Cela me permet d'atteindre plus facilement les touches environnantes. Pour m'habituer à `hjkl`, j'ai en fait désactivé les boutons fléchés en ajoutant ceci dans `~/.vimrc` :

```shell
noremap <Up> <NOP>
noremap <Down> <NOP>
noremap <Left> <NOP>
noremap <Right> <NOP>
```

Il existe également des plugins pour aider à briser cette mauvaise habitude. L'un d'eux est [vim-hardtime](https://github.com/takac/vim-hardtime). À ma grande surprise, il m'a fallu moins d'une semaine pour m'habituer à `hjkl`.

Si vous vous demandez pourquoi Vim utilise `hjkl` pour se déplacer, c'est parce que le terminal Lear-Siegler ADM-3A, où Bill Joy a écrit Vi, n'avait pas de touches fléchées et utilisait `hjkl` comme gauche/bas/haut/droite.*

## Numérotation relative

Je pense qu'il est utile d'avoir `number` et `relativenumber` activés. Vous pouvez le faire en ajoutant ceci dans `.vimrc` :

```shell
set relativenumber number
```

Cela affiche mon numéro de ligne actuel et les numéros de ligne relatifs.

Il est facile de comprendre pourquoi avoir un numéro dans la colonne de gauche est utile, mais certains d'entre vous peuvent se demander comment avoir des numéros relatifs dans la colonne de gauche peut être utile. Avoir un numéro relatif me permet de voir rapidement combien de lignes mon curseur est éloigné du texte cible. Avec cela, je peux facilement repérer que mon texte cible est à 12 lignes en dessous de moi, donc je peux faire `d12j` pour les supprimer. Sinon, si je suis à la ligne 69 et que ma cible est à la ligne 81, je dois faire un calcul mental (81 - 69 = 12). Faire des calculs pendant l'édition prend trop de ressources mentales. Moins je dois réfléchir à l'endroit où je dois aller, mieux c'est.

C'est 100 % une question de préférence personnelle. Expérimentez avec `relativenumber` / `norelativenumber`, `number` / `nonumber` et utilisez ce que vous trouvez le plus utile !

## Comptez vos mouvements

Parlons de l'argument "compte". Les mouvements Vim acceptent un argument numérique précédent. J'ai mentionné ci-dessus que vous pouvez descendre de 12 lignes avec `12j`. Le 12 dans `12j` est le nombre de compte.

La syntaxe pour utiliser le compte avec votre mouvement est :

```shell
[count] + mouvement
```

Vous pouvez appliquer cela à tous les mouvements. Si vous voulez vous déplacer de 9 caractères vers la droite, au lieu d'appuyer sur `l` 9 fois, vous pouvez faire `9l`.

## Navigation par mot

Passons à une unité de mouvement plus grande : *mot*. Vous pouvez vous déplacer au début du mot suivant (`w`), à la fin du mot suivant (`e`), au début du mot précédent (`b`), et à la fin du mot précédent (`ge`).

De plus, il y a *WORD*, distinct de mot. Vous pouvez vous déplacer au début du mot suivant WORD (`W`), à la fin du mot suivant WORD (`E`), au début du mot précédent WORD (`B`), et à la fin du mot précédent WORD (`gE`). Pour faciliter la mémorisation, WORD utilise les mêmes lettres que mot, mais en majuscules.

```shell
w     Avancer jusqu'au début du mot suivant
W     Avancer jusqu'au début du mot suivant WORD
e     Avancer d'un mot jusqu'à la fin du mot suivant
E     Avancer d'un mot jusqu'à la fin du mot suivant WORD
b     Reculer jusqu'au début du mot précédent
B     Reculer jusqu'au début du mot précédent WORD
ge    Reculer jusqu'à la fin du mot précédent
gE    Reculer jusqu'à la fin du mot précédent WORD
```

Alors, quelles sont les similitudes et les différences entre un mot et un WORD ? Les mots et les WORD sont séparés par des caractères vides. Un mot est une séquence de caractères contenant *uniquement* `a-zA-Z0-9_`. Un WORD est une séquence de tous les caractères sauf les espaces blancs (un espace blanc signifie soit un espace, une tabulation, ou une fin de ligne). Pour en savoir plus, consultez `:h word` et `:h WORD`.

Par exemple, supposons que vous ayez :

```shell
const hello = "world";
```

Avec votre curseur au début de la ligne, pour aller à la fin de la ligne avec `l`, cela vous prendra 21 frappes de touche. En utilisant `w`, cela prendra 6. En utilisant `W`, cela ne prendra que 4. Les mots et les WORD sont de bonnes options pour parcourir de courtes distances.

Cependant, vous pouvez passer de "c" à ";" en une seule frappe avec la navigation dans la ligne actuelle.

## Navigation dans la ligne actuelle

Lors de l'édition, vous devez souvent naviguer horizontalement dans une ligne. Pour sauter au premier caractère de la ligne actuelle, utilisez `0`. Pour aller au dernier caractère de la ligne actuelle, utilisez `$`. De plus, vous pouvez utiliser `^` pour aller au premier caractère non blanc de la ligne actuelle et `g_` pour aller au dernier caractère non blanc de la ligne actuelle. Si vous souhaitez aller à la colonne `n` dans la ligne actuelle, vous pouvez utiliser `n|`.

```shell
0     Aller au premier caractère de la ligne actuelle
^     Aller au premier caractère non blanc de la ligne actuelle
g_    Aller au dernier caractère non blanc de la ligne actuelle
$     Aller au dernier caractère de la ligne actuelle
n|    Aller à la colonne n dans la ligne actuelle
```

Vous pouvez effectuer une recherche dans la ligne actuelle avec `f` et `t`. La différence entre `f` et `t` est que `f` vous amène à la première lettre de la correspondance et `t` vous amène jusqu'à (juste avant) la première lettre de la correspondance. Donc, si vous voulez chercher "h" et atterrir sur "h", utilisez `fh`. Si vous voulez chercher le premier "h" et atterrir juste avant la correspondance, utilisez `th`. Si vous voulez aller à la *prochaine* occurrence de la dernière recherche dans la ligne actuelle, utilisez `;`. Pour aller à l'occurrence précédente de la dernière correspondance dans la ligne actuelle, utilisez `,`.

`F` et `T` sont les équivalents inversés de `f` et `t`. Pour rechercher en arrière "h", exécutez `Fh`. Pour continuer à rechercher "h" dans la même direction, utilisez `;`. Notez que `;` après un `Fh` recherche en arrière et `,` après `Fh` recherche en avant.

```shell
f    Rechercher en avant une correspondance dans la même ligne
F    Rechercher en arrière une correspondance dans la même ligne
t    Rechercher en avant une correspondance dans la même ligne, s'arrêtant avant la correspondance
T    Rechercher en arrière une correspondance dans la même ligne, s'arrêtant avant la correspondance
;    Répéter la dernière recherche dans la même ligne en utilisant la même direction
,    Répéter la dernière recherche dans la même ligne en utilisant la direction opposée
```

Revenons à l'exemple précédent :

```shell
const hello = "world";
```

Avec votre curseur au début de la ligne, vous pouvez aller au dernier caractère de la ligne actuelle (";") avec une seule frappe : `$`. Si vous voulez aller à "w" dans "world", vous pouvez utiliser `fw`. Un bon conseil pour aller n'importe où dans une ligne est de chercher des lettres peu communes comme "j", "x", "z" près de votre cible.

## Navigation par phrase et paragraphe

Les deux prochaines unités de navigation sont la phrase et le paragraphe.

Commençons par parler de ce qu'est une phrase. Une phrase se termine par soit `. ! ?` suivi d'une fin de ligne, d'un espace ou d'une tabulation. Vous pouvez sauter à la phrase suivante avec `)` et à la phrase précédente avec `(`.

```shell
(    Sauter à la phrase précédente
)    Sauter à la phrase suivante
```

Examinons quelques exemples. Quelles phrases pensez-vous être des phrases et lesquelles ne le sont pas ? Essayez de naviguer avec `(` et `)` dans Vim !

```shell
Je suis une phrase. Je suis une autre phrase parce que je finis par un point. Je suis toujours une phrase quand je finis par un point d'exclamation ! Que dire du point d'interrogation ? Je ne suis pas tout à fait une phrase à cause du trait d'union - et ni le point-virgule ; ni le deux-points :

Il y a une ligne vide au-dessus de moi.
```

Au fait, si vous avez un problème avec Vim qui ne compte pas une phrase pour des phrases séparées par `.` suivi d'une seule ligne, vous pourriez être en mode `'compatible'`. Ajoutez `set nocompatible` dans vimrc. Dans Vi, une phrase est un `.` suivi de **deux** espaces. Vous devriez toujours avoir `nocompatible` activé.

Parlons de ce qu'est un paragraphe. Un paragraphe commence après chaque ligne vide et également à chaque ensemble de macro de paragraphe spécifié par les paires de caractères dans l'option des paragraphes.

```shell
{    Sauter au paragraphe précédent
}    Sauter au paragraphe suivant
```

Si vous n'êtes pas sûr de ce qu'est une macro de paragraphe, ne vous inquiétez pas. L'important est qu'un paragraphe commence et se termine après une ligne vide. Cela devrait être vrai la plupart du temps.

Examinons cet exemple. Essayez de naviguer avec `}` et `{` (de plus, jouez avec les navigations de phrase `( )` pour vous déplacer aussi !)

```shell
Bonjour. Comment ça va ? Je vais très bien, merci !
Vim est génial.
Il peut ne pas être facile de l'apprendre au début... mais nous sommes ensemble là-dedans. Bonne chance !

Bonjour encore.

Essayez de vous déplacer avec ), (, }, et {. Ressentez comment ils fonctionnent.
Vous pouvez le faire.
```

Consultez `:h sentence` et `:h paragraph` pour en savoir plus.

## Navigation par correspondance

Les programmeurs écrivent et modifient des codes. Les codes utilisent généralement des parenthèses, des accolades et des crochets. Vous pouvez facilement vous perdre dans eux. Si vous êtes à l'intérieur de l'un, vous pouvez sauter à l'autre paire (si elle existe) avec `%`. Vous pouvez également utiliser cela pour vérifier si vous avez des parenthèses, des accolades et des crochets correspondants.

```shell
%    Naviguer vers une autre correspondance, fonctionne généralement pour (), [], {}
```

Examinons un exemple de code Scheme car il utilise des parenthèses de manière extensive. Déplacez-vous avec `%` à l'intérieur de différentes parenthèses.

```shell
(define (fib n)
  (cond ((= n 0) 0)
        ((= n 1) 1)
        (else
          (+ (fib (- n 1)) (fib (- n 2)))
        )))
```

Personnellement, j'aime compléter `%` avec des plugins d'indicateurs visuels comme [vim-rainbow](https://github.com/frazrepo/vim-rainbow). Pour en savoir plus, consultez `:h %`.

## Navigation par numéro de ligne

Vous pouvez sauter au numéro de ligne `n` avec `nG`. Par exemple, si vous voulez sauter à la ligne 7, utilisez `7G`. Pour sauter à la première ligne, utilisez soit `1G` ou `gg`. Pour sauter à la dernière ligne, utilisez `G`.

Souvent, vous ne savez pas exactement quel est le numéro de ligne de votre cible, mais vous savez qu'il est approximativement à 70 % du fichier entier. Dans ce cas, vous pouvez faire `70%`. Pour sauter à mi-chemin dans le fichier, vous pouvez faire `50%`.

```shell
gg    Aller à la première ligne
G     Aller à la dernière ligne
nG    Aller à la ligne n
n%    Aller à n% dans le fichier
```

Au fait, si vous voulez voir le nombre total de lignes dans un fichier, vous pouvez utiliser `Ctrl-g`.

## Navigation dans la fenêtre

Pour aller rapidement en haut, au milieu ou en bas de votre *fenêtre*, vous pouvez utiliser `H`, `M`, et `L`.

Vous pouvez également passer un compte à `H` et `L`. Si vous utilisez `10H`, vous irez à 10 lignes en dessous du haut de la fenêtre. Si vous utilisez `3L`, vous irez à 3 lignes au-dessus de la dernière ligne de la fenêtre.

```shell
H     Aller en haut de l'écran
M     Aller au milieu de l'écran
L     Aller en bas de l'écran
nH    Aller n lignes depuis le haut
nL    Aller n lignes depuis le bas
```

## Défilement

Pour faire défiler, vous avez 3 incréments de vitesse : plein écran (`Ctrl-F/Ctrl-B`), demi-écran (`Ctrl-D/Ctrl-U`), et ligne (`Ctrl-E/Ctrl-Y`).

```shell
Ctrl-E    Faire défiler vers le bas d'une ligne
Ctrl-D    Faire défiler vers le bas d'un demi-écran
Ctrl-F    Faire défiler vers le bas d'un écran entier
Ctrl-Y    Faire défiler vers le haut d'une ligne
Ctrl-U    Faire défiler vers le haut d'un demi-écran
Ctrl-B    Faire défiler vers le haut d'un écran entier
```

Vous pouvez également faire défiler relativement à la ligne actuelle (zoom sur l'écran) :

```shell
zt    Amener la ligne actuelle près du haut de votre écran
zz    Amener la ligne actuelle au milieu de votre écran
zb    Amener la ligne actuelle près du bas de votre écran
```
## Navigation de Recherche

Souvent, vous savez qu'une phrase existe dans un fichier. Vous pouvez utiliser la navigation de recherche pour atteindre très rapidement votre cible. Pour rechercher une phrase, vous pouvez utiliser `/` pour rechercher vers l'avant et `?` pour rechercher vers l'arrière. Pour répéter la dernière recherche, vous pouvez utiliser `n`. Pour répéter la dernière recherche dans la direction opposée, vous pouvez utiliser `N`.

```shell
/    Rechercher vers l'avant une correspondance
?    Rechercher vers l'arrière une correspondance
n    Répéter la dernière recherche dans la même direction que la recherche précédente
N    Répéter la dernière recherche dans la direction opposée à la recherche précédente
```

Supposons que vous ayez ce texte :

```shell
let one = 1;
let two = 2;
one = "01";
one = "one";
let onetwo = 12;
```

Si vous recherchez "let", exécutez `/let`. Pour rechercher rapidement "let" à nouveau, vous pouvez simplement faire `n`. Pour rechercher "let" à nouveau dans la direction opposée, exécutez `N`. Si vous exécutez `?let`, cela recherchera "let" en arrière. Si vous utilisez `n`, cela recherchera maintenant "let" en arrière (`N` recherchera "let" en avant maintenant).

Vous pouvez activer la mise en surbrillance de la recherche avec `set hlsearch`. Maintenant, lorsque vous recherchez `/let`, cela mettra en surbrillance *toutes* les phrases correspondantes dans le fichier. De plus, vous pouvez définir la recherche incrémentale avec `set incsearch`. Cela mettra en surbrillance le motif pendant que vous tapez. Par défaut, vos phrases correspondantes resteront mises en surbrillance jusqu'à ce que vous recherchiez une autre phrase. Cela peut rapidement devenir une source d'ennui. Pour désactiver la mise en surbrillance, vous pouvez exécuter `:nohlsearch` ou simplement `:noh`. Comme j'utilise fréquemment cette fonctionnalité sans surbrillance, j'ai créé un mappage dans vimrc :

```shell
nnoremap <esc><esc> :noh<return><esc>
```

Vous pouvez rapidement rechercher le texte sous le curseur avec `*` pour rechercher vers l'avant et `#` pour rechercher vers l'arrière. Si votre curseur est sur la chaîne "one", appuyer sur `*` sera la même chose que si vous aviez fait `/\<one\>`.

Les deux `\<` et `\>` dans `/\<one\>` signifient recherche de mot entier. Cela ne correspond pas à "one" s'il fait partie d'un mot plus grand. Cela correspondra au mot "one" mais pas à "onetwo". Si votre curseur est sur "one" et que vous souhaitez rechercher vers l'avant pour correspondre à des mots entiers ou partiels comme "one" et "onetwo", vous devez utiliser `g*` au lieu de `*`.

```shell
*     Rechercher le mot entier sous le curseur vers l'avant
#     Rechercher le mot entier sous le curseur vers l'arrière
g*    Rechercher le mot sous le curseur vers l'avant
g#    Rechercher le mot sous le curseur vers l'arrière
```

## Marquage de Position

Vous pouvez utiliser des marques pour sauvegarder votre position actuelle et revenir à cette position plus tard. C'est comme un signet pour l'édition de texte. Vous pouvez définir une marque avec `mx`, où `x` peut être n'importe quelle lettre alphabétique `a-zA-Z`. Il existe deux façons de revenir à la marque : exacte (ligne et colonne) avec `` `x `` et par ligne (`'x`).

```shell
ma    Marquer la position avec la marque "a"
`a    Sauter à la ligne et colonne "a"
'a    Sauter à la ligne "a"
```

Il y a une différence entre le marquage avec des lettres minuscules (a-z) et des lettres majuscules (A-Z). Les alphabets minuscules sont des marques locales et les alphabets majuscules sont des marques globales (parfois connues sous le nom de marques de fichier).

Parlons des marques locales. Chaque tampon peut avoir son propre ensemble de marques locales. Si j'ai deux fichiers ouverts, je peux définir une marque "a" (`ma`) dans le premier fichier et une autre marque "a" (`ma`) dans le second fichier.

Contrairement aux marques locales où vous pouvez avoir un ensemble de marques dans chaque tampon, vous n'obtenez qu'un seul ensemble de marques globales. Si vous définissez `mA` à l'intérieur de `myFile.txt`, la prochaine fois que vous exécuterez `mA` dans un fichier différent, cela écrasera la première marque "A". Un avantage des marques globales est que vous pouvez sauter à n'importe quelle marque globale même si vous êtes dans un projet complètement différent. Les marques globales peuvent traverser les fichiers.

Pour voir toutes les marques, utilisez `:marks`. Vous remarquerez peut-être dans la liste des marques qu'il y a plus de marques autres que `a-zA-Z`. Certaines d'entre elles sont :

```shell
''    Revenir à la dernière ligne dans le tampon actuel avant le saut
``    Revenir à la dernière position dans le tampon actuel avant le saut
`[    Sauter au début du texte précédemment modifié / copié
`]    Sauter à la fin du texte précédemment modifié / copié
`<    Sauter au début de la dernière sélection visuelle
`>    Sauter à la fin de la dernière sélection visuelle
`0    Revenir au dernier fichier édité lors de la sortie de vim
```

Il y a plus de marques que celles énumérées ci-dessus. Je ne les couvrirais pas ici car je pense qu'elles sont rarement utilisées, mais si vous êtes curieux, consultez `:h marks`.

## Sauter

Dans Vim, vous pouvez "sauter" à un fichier différent ou à une partie différente d'un fichier avec certains mouvements. Tous les mouvements ne comptent pas comme un saut, cependant. Descendre avec `j` ne compte pas comme un saut. Aller à la ligne 10 avec `10G` compte comme un saut.

Voici les commandes que Vim considère comme des commandes de "saut" :

```shell
'       Aller à la ligne marquée
`       Aller à la position marquée
G       Aller à la ligne
/       Rechercher vers l'avant
?       Rechercher vers l'arrière
n       Répéter la dernière recherche, même direction
N       Répéter la dernière recherche, direction opposée
%       Trouver une correspondance
(       Aller à la dernière phrase
)       Aller à la phrase suivante
{       Aller au dernier paragraphe
}       Aller au paragraphe suivant
L       Aller à la dernière ligne de la fenêtre affichée
M       Aller à la ligne du milieu de la fenêtre affichée
H       Aller à la première ligne de la fenêtre affichée
[[      Aller à la section précédente
]]      Aller à la section suivante
:s      Substituer
:tag    Sauter à la définition de tag
```

Je ne recommande pas de mémoriser cette liste. Une bonne règle de base est que tout mouvement qui se déplace plus loin qu'un mot et la navigation actuelle dans la ligne est probablement un saut. Vim garde une trace de l'endroit où vous êtes allé lorsque vous vous déplacez et vous pouvez voir cette liste à l'intérieur de `:jumps`.

Pour plus d'informations, consultez `:h jump-motions`.

Pourquoi les sauts sont-ils utiles ? Parce que vous pouvez naviguer dans la liste des sauts avec `Ctrl-O` pour monter dans la liste des sauts et `Ctrl-I` pour descendre dans la liste des sauts. `hjkl` ne sont pas des commandes de "saut", mais vous pouvez ajouter manuellement l'emplacement actuel à la liste des sauts avec `m'` avant le mouvement. Par exemple, `m'5j` ajoute l'emplacement actuel à la liste des sauts et descend de 5 lignes, et vous pouvez revenir avec `Ctrl-O`. Vous pouvez sauter entre différents fichiers, ce que je discuterai plus en détail dans la prochaine partie.

## Apprendre la Navigation de Manière Intelligente

Si vous êtes nouveau dans Vim, il y a beaucoup à apprendre. Je ne m'attends pas à ce que quelqu'un se souvienne de tout immédiatement. Cela prend du temps avant que vous puissiez les exécuter sans réfléchir.

Je pense que la meilleure façon de commencer est de mémoriser quelques mouvements essentiels. Je recommande de commencer par ces 10 mouvements : `h, j, k, l, w, b, G, /, ?, n`. Répétez-les suffisamment jusqu'à ce que vous puissiez les utiliser sans réfléchir.

Pour améliorer votre compétence en navigation, voici mes suggestions :
1. Surveillez les actions répétées. Si vous vous retrouvez à faire `l` de manière répétée, cherchez un mouvement qui vous fera avancer plus rapidement. Vous constaterez que vous pouvez utiliser `w`. Si vous vous surprenez à faire `w` de manière répétée, vérifiez s'il existe un mouvement qui vous fera traverser la ligne actuelle rapidement. Vous constaterez que vous pouvez utiliser `f`. Si vous pouvez décrire votre besoin de manière succincte, il y a de fortes chances que Vim ait un moyen de le faire.
2. Chaque fois que vous apprenez un nouveau mouvement, passez du temps jusqu'à ce que vous puissiez le faire sans réfléchir.

Enfin, réalisez que vous n'avez pas besoin de connaître chaque commande Vim pour être productif. La plupart des utilisateurs de Vim ne le font pas. Moi non plus. Apprenez les commandes qui vous aideront à accomplir votre tâche à ce moment-là.

Prenez votre temps. La compétence en navigation est une compétence très importante dans Vim. Apprenez une petite chose chaque jour et apprenez-la bien.