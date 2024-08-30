---
description: Découvrez les 10 types de registres Vim et apprenez à les utiliser efficacement
  pour améliorer votre productivité et éviter la saisie répétitive.
title: Ch08. Registers
---

Apprendre les registres Vim, c'est comme apprendre l'algèbre pour la première fois. Vous ne pensiez pas en avoir besoin jusqu'à ce que vous en ayez besoin.

Vous avez probablement utilisé les registres Vim lorsque vous avez copié ou supprimé un texte, puis que vous l'avez collé avec `p` ou `P`. Cependant, saviez-vous que Vim a 10 types différents de registres ? Utilisés correctement, les registres Vim peuvent vous éviter de taper de manière répétitive.

Dans ce chapitre, je vais passer en revue tous les types de registres Vim et comment les utiliser efficacement.

## Les Dix Types de Registres

Voici les 10 types de registres Vim :

1. Le registre sans nom (`""`).
2. Les registres numérotés (`"0-9`).
3. Le registre de suppression petite (`"-`).
4. Les registres nommés (`"a-z`).
5. Les registres en lecture seule (`":`, `".`, et `"%`).
6. Le registre de fichier alternatif (`"#`).
7. Le registre d'expression (`"=`).
8. Les registres de sélection (`"*` et `"+`).
9. Le registre trou noir (`"_`).
10. Le registre du dernier motif de recherche (`"/`).

## Opérateurs de Registre

Pour utiliser les registres, vous devez d'abord les stocker avec des opérateurs. Voici quelques opérateurs qui stockent des valeurs dans les registres :

```shell
y    Yank (copier)
c    Supprimer le texte et commencer le mode insertion
d    Supprimer le texte
```

Il existe d'autres opérateurs (comme `s` ou `x`), mais ceux ci-dessus sont les plus utiles. La règle générale est que si un opérateur peut supprimer un texte, il stocke probablement le texte dans les registres.

Pour coller un texte à partir des registres, vous pouvez utiliser :

```shell
p    Coller le texte après le curseur
P    Coller le texte avant le curseur
```

Les deux `p` et `P` acceptent un compte et un symbole de registre comme arguments. Par exemple, pour coller dix fois, faites `10p`. Pour coller le texte du registre a, faites `"ap`. Pour coller le texte du registre a dix fois, faites `10"ap`. Au fait, le `p` signifie en fait "mettre", pas "coller", mais je pense que coller est un mot plus conventionnel.

La syntaxe générale pour obtenir le contenu d'un registre spécifique est `"a`, où `a` est le symbole du registre.

## Appel des Registres Depuis le Mode Insertion

Tout ce que vous apprenez dans ce chapitre peut également être exécuté en mode insertion. Pour obtenir le texte du registre a, normalement vous faites `"ap`. Mais si vous êtes en mode insertion, exécutez `Ctrl-R a`. La syntaxe pour appeler des registres depuis le mode insertion est :

```shell
Ctrl-R a
```

Où `a` est le symbole du registre. Maintenant que vous savez comment stocker et récupérer des registres, plongeons-y !

## Le Registre Sans Nom

Pour obtenir le texte du registre sans nom, faites `""p`. Il stocke le dernier texte que vous avez copié, modifié ou supprimé. Si vous faites un autre yank, changement ou suppression, Vim remplacera automatiquement l'ancien texte. Le registre sans nom est comme l'opération standard de copier/coller d'un ordinateur.

Par défaut, `p` (ou `P`) est connecté au registre sans nom (désormais je ferai référence au registre sans nom avec `p` au lieu de `""p`).

## Les Registres Numérotés

Les registres numérotés se remplissent automatiquement dans l'ordre croissant. Il existe 2 types de registres numérotés différents : le registre yanked (`0`) et les registres numérotés (`1-9`). Discutons d'abord du registre yanked.

### Le Registre Yanked

Si vous copiez une ligne entière de texte (`yy`), Vim sauvegarde en fait ce texte dans deux registres :

1. Le registre sans nom (`p`).
2. Le registre yanked (`"0p`).

Lorsque vous copiez un texte différent, Vim mettra à jour à la fois le registre yanked et le registre sans nom. Toute autre opération (comme la suppression) ne sera pas stockée dans le registre 0. Cela peut être utilisé à votre avantage, car à moins que vous ne fassiez un autre yank, le texte yanked sera toujours là, peu importe combien de changements et de suppressions vous faites.

Par exemple, si vous :
1. Copiez une ligne (`yy`)
2. Supprimez une ligne (`dd`)
3. Supprimez une autre ligne (`dd`)

Le registre yanked contiendra le texte de l'étape un.

Si vous :
1. Copiez une ligne (`yy`)
2. Supprimez une ligne (`dd`)
3. Copiez une autre ligne (`yy`)

Le registre yanked contiendra le texte de l'étape trois.

Un dernier conseil, en mode insertion, vous pouvez rapidement coller le texte que vous venez de copier en utilisant `Ctrl-R 0`.

### Les Registres Numérotés Non-Zéro

Lorsque vous modifiez ou supprimez un texte d'au moins une ligne, ce texte sera stocké dans les registres numérotés 1-9 triés par le plus récent.

Par exemple, si vous avez ces lignes :

```shell
ligne trois
ligne deux
ligne un
```

Avec votre curseur sur "ligne trois", supprimez-les une par une avec `dd`. Une fois toutes les lignes supprimées, le registre 1 devrait contenir "ligne un" (le plus récent), le registre deux "ligne deux" (deuxième plus récent), et le registre trois "ligne trois" (le plus ancien). Pour obtenir le contenu du registre un, faites `"1p`.

En passant, ces registres numérotés s'incrémentent automatiquement lors de l'utilisation de la commande point. Si votre registre numéroté un (`"1`) contient "ligne un", le registre deux (`"2`) "ligne deux", et le registre trois (`"3`) "ligne trois", vous pouvez les coller séquentiellement avec cette astuce :
- Faites `"1P` pour coller le contenu du registre numéroté un ("1).
- Faites `.` pour coller le contenu du registre numéroté deux ("2).
- Faites `.` pour coller le contenu du registre numéroté trois ("3).

Cette astuce fonctionne avec n'importe quel registre numéroté. Si vous avez commencé avec `"5P`, `.` ferait `"6P`, `.` encore ferait `"7P`, et ainsi de suite.

Les petites suppressions comme une suppression de mot (`dw`) ou un changement de mot (`cw`) ne sont pas stockées dans les registres numérotés. Elles sont stockées dans le registre de suppression petite (`"-`), que je vais discuter ensuite.

## Le Registre de Suppression Petite

Les modifications ou suppressions de moins d'une ligne ne sont pas stockées dans les registres numérotés 0-9, mais dans le registre de suppression petite (`"-`).

Par exemple :
1. Supprimez un mot (`diw`)
2. Supprimez une ligne (`dd`)
3. Supprimez une ligne (`dd`)

`"-p` vous donne le mot supprimé de l'étape un.

Un autre exemple :
1. Je supprime un mot (`diw`)
2. Je supprime une ligne (`dd`)
3. Je supprime un mot (`diw`)

`"-p` vous donne le mot supprimé de l'étape trois. `"1p` vous donne la ligne supprimée de l'étape deux. Malheureusement, il n'y a pas de moyen de récupérer le mot supprimé de l'étape un car le registre de suppression petite ne stocke qu'un seul élément. Cependant, si vous souhaitez conserver le texte de l'étape un, vous pouvez le faire avec les registres nommés.

## Le Registre Nommé

Les registres nommés sont le registre le plus polyvalent de Vim. Il peut stocker des textes copiés, modifiés et supprimés dans les registres a-z. Contrairement aux 3 types de registres précédents que vous avez vus qui stockent automatiquement des textes dans les registres, vous devez explicitement dire à Vim d'utiliser le registre nommé, vous donnant un contrôle total.

Pour copier un mot dans le registre a, vous pouvez le faire avec `"ayiw`.
- `"a` dit à Vim que la prochaine action (supprimer / changer / copier) sera stockée dans le registre a.
- `yiw` copie le mot.

Pour obtenir le texte du registre a, exécutez `"ap`. Vous pouvez utiliser les vingt-six caractères alphabétiques pour stocker vingt-six textes différents avec des registres nommés.

Parfois, vous pouvez vouloir ajouter à votre registre nommé existant. Dans ce cas, vous pouvez ajouter votre texte au lieu de tout recommencer. Pour ce faire, vous pouvez utiliser la version majuscule de ce registre. Par exemple, supposons que vous ayez déjà le mot "Bonjour " stocké dans le registre a. Si vous voulez ajouter "monde" dans le registre a, vous pouvez trouver le texte "monde" et le copier en utilisant le registre A (`"Ayiw`).

## Les Registres en Lecture Seule

Vim a trois registres en lecture seule : `.`, `:`, et `%`. Ils sont assez simples à utiliser :

```shell
.    Stocke le dernier texte inséré
:    Stocke la dernière commande exécutée
%    Stocke le nom du fichier actuel
```

Si le dernier texte que vous avez écrit était "Bonjour Vim", exécuter `".p` affichera le texte "Bonjour Vim". Si vous souhaitez obtenir le nom du fichier actuel, exécutez `"%p`. Si vous exécutez la commande `:s/foo/bar/g`, exécuter `":p` affichera le texte littéral "s/foo/bar/g".

## Le Registre de Fichier Alternatif

Dans Vim, `#` représente généralement le fichier alternatif. Un fichier alternatif est le dernier fichier que vous avez ouvert. Pour insérer le nom du fichier alternatif, vous pouvez utiliser `"#p`.

## Le Registre d'Expression

Vim a un registre d'expression, `"=`, pour évaluer des expressions.

Pour évaluer des expressions mathématiques `1 + 1`, exécutez :

```shell
"=1+1<Enter>p
```

Ici, vous dites à Vim que vous utilisez le registre d'expression avec `"=`. Votre expression est (`1 + 1`). Vous devez taper `p` pour obtenir le résultat. Comme mentionné précédemment, vous pouvez également accéder au registre depuis le mode insertion. Pour évaluer une expression mathématique depuis le mode insertion, vous pouvez faire :

```shell
Ctrl-R =1+1
```

Vous pouvez également obtenir les valeurs de n'importe quel registre via le registre d'expression lorsqu'il est ajouté avec `@`. Si vous souhaitez obtenir le texte du registre a :

```shell
"=@a
```

Puis appuyez sur `<Enter>`, puis `p`. De même, pour obtenir des valeurs du registre a en mode insertion :

```shell
Ctrl-r =@a
```

L'expression est un sujet vaste dans Vim, donc je ne vais couvrir que les bases ici. Je traiterai des expressions plus en détail dans les prochains chapitres de Vimscript.

## Les Registres de Sélection

Ne souhaitez-vous pas parfois pouvoir copier un texte depuis des programmes externes et le coller localement dans Vim, et vice versa ? Avec les registres de sélection de Vim, vous pouvez. Vim a deux registres de sélection : `quotestar` (`"*`) et `quoteplus` (`"+`). Vous pouvez les utiliser pour accéder au texte copié depuis des programmes externes.

Si vous êtes sur un programme externe (comme le navigateur Chrome) et que vous copiez un bloc de texte avec `Ctrl-C` (ou `Cmd-C`, selon votre système d'exploitation), normalement vous ne pourriez pas utiliser `p` pour coller le texte dans Vim. Cependant, les deux registres de Vim `"+` et `"*` sont connectés à votre presse-papiers, vous pouvez donc réellement coller le texte avec `"+p` ou `"*p`. Inversement, si vous copiez un mot depuis Vim avec `"+yiw` ou `"*yiw`, vous pouvez coller ce texte dans le programme externe avec `Ctrl-V` (ou `Cmd-V`). Notez que cela ne fonctionne que si votre programme Vim est livré avec l'option `+clipboard` (pour le vérifier, exécutez `:version`).

Vous vous demandez peut-être si `"*` et `"+` font la même chose, pourquoi Vim a-t-il deux registres différents ? Certaines machines utilisent le système de fenêtres X11. Ce système a 3 types de sélections : primaire, secondaire et presse-papiers. Si votre machine utilise X11, Vim utilise la sélection *primaire* de X11 avec le registre `quotestar` (`"*`) et la sélection *presse-papiers* de X11 avec le registre `quoteplus` (`"+`). Cela ne s'applique que si vous avez l'option `+xterm_clipboard` disponible dans votre build Vim. Si votre Vim n'a pas `xterm_clipboard`, ce n'est pas un gros problème. Cela signifie simplement que les deux `quotestar` et `quoteplus` sont interchangeables (le mien ne l'a pas non plus).

Je trouve que faire `=*p` ou `=+p` (ou `"*p` ou `"+p`) est fastidieux. Pour faire en sorte que Vim colle le texte copié depuis le programme externe avec juste `p`, vous pouvez ajouter ceci dans votre vimrc :

```shell
set clipboard=unnamed
```

Maintenant, lorsque je copie un texte depuis un programme externe, je peux le coller avec le registre sans nom, `p`. Je peux également copier un texte depuis Vim et le coller dans un programme externe. Si vous avez `+xterm_clipboard` activé, vous voudrez peut-être utiliser les options de presse-papiers `unnamed` et `unnamedplus`.

## Le Registre Trou Noir

Chaque fois que vous supprimez ou modifiez un texte, ce texte est stocké dans le registre Vim automatiquement. Il y aura des moments où vous ne voudrez rien sauvegarder dans le registre. Comment pouvez-vous faire cela ?

Vous pouvez utiliser le registre trou noir (`"_`). Pour supprimer une ligne et ne pas avoir Vim stocker la ligne supprimée dans un registre, utilisez `"_dd`.

Le registre trou noir est comme le `/dev/null` des registres.

## Le Registre du Dernier Motif de Recherche

Pour coller votre dernière recherche (`/` ou `?`), vous pouvez utiliser le registre du dernier motif de recherche (`"/`). Pour coller le dernier terme de recherche, utilisez `"/p`.

## Affichage des Registres

Pour voir tous vos registres, utilisez la commande `:register`. Pour voir uniquement les registres "a, "1, et "-", utilisez `:register a 1 -`.

Il existe un plugin appelé [vim-peekaboo](https://github.com/junegunn/vim-peekaboo) qui vous permet de jeter un œil au contenu des registres lorsque vous appuyez sur `"` ou `@` en mode normal et `Ctrl-R` en mode insertion. Je trouve ce plugin très utile car la plupart du temps, je ne me souviens pas du contenu de mes registres. Essayez-le !

## Exécution d'un Registre

Les registres nommés ne sont pas seulement pour stocker des textes. Ils peuvent également exécuter des macros avec `@`. Je vais aborder les macros dans le prochain chapitre.

Gardez à l'esprit que comme les macros sont stockées dans les registres Vim, vous pouvez accidentellement écraser le texte stocké avec des macros. Si vous stockez le texte "Bonjour Vim" dans le registre a et que vous enregistrez plus tard une macro dans le même registre (`qa{séquence-de-macro}q`), cette macro écrasera votre texte "Bonjour Vim" stocké précédemment.
## Effacer un registre

Techniquement, il n'est pas nécessaire d'effacer un registre car le prochain texte que vous stockez sous le même nom de registre l'écrasera. Cependant, vous pouvez rapidement effacer n'importe quel registre nommé en enregistrant une macro vide. Par exemple, si vous exécutez `qaq`, Vim enregistrera une macro vide dans le registre a.

Une autre alternative est d'exécuter la commande `:call setreg('a', 'hello register a')` où a est le registre a et "hello register a" est le texte que vous souhaitez stocker.

Une autre façon d'effacer un registre est de définir le contenu du registre "a" sur une chaîne vide avec l'expression `:let @a = ''`.

## Mettre le contenu d'un registre

Vous pouvez utiliser la commande `:put` pour coller le contenu de n'importe quel registre. Par exemple, si vous exécutez `:put a`, Vim imprimera le contenu du registre a en dessous de la ligne actuelle. Cela se comporte beaucoup comme `"ap`, avec la différence que la commande en mode normal `p` imprime le contenu du registre après le curseur et la commande `:put` imprime le contenu du registre à la nouvelle ligne.

Puisque `:put` est une commande de ligne de commande, vous pouvez lui passer une adresse. `:10put a` collera le texte du registre a sous la ligne 10.

Un truc sympa pour passer `:put` avec le registre trou noir (`"_`). Puisque le registre trou noir ne stocke aucun texte, `:put _` insérera une ligne vide à la place. Vous pouvez combiner cela avec la commande globale pour insérer plusieurs lignes vides. Par exemple, pour insérer des lignes vides sous toutes les lignes contenant le texte "end", exécutez `:g/end/put _`. Vous apprendrez à propos de la commande globale plus tard.

## Apprendre les registres de manière intelligente

Vous êtes arrivé à la fin. Félicitations ! Si vous vous sentez submergé par la quantité d'informations, vous n'êtes pas seul. Quand j'ai commencé à apprendre sur les registres Vim, il y avait trop d'informations à assimiler d'un coup.

Je ne pense pas que vous devriez mémoriser tous les registres immédiatement. Pour devenir productif, vous pouvez commencer par utiliser seulement ces 3 registres :
1. Le registre sans nom (`""`).
2. Les registres nommés (`"a-z`).
3. Les registres numérotés (`"0-9`).

Puisque le registre sans nom par défaut utilise `p` et `P`, vous n'avez qu'à apprendre deux registres : les registres nommés et les registres numérotés. Apprenez progressivement plus de registres lorsque vous en avez besoin. Prenez votre temps.

L'être humain moyen a une capacité limitée de mémoire à court terme, environ 5 à 7 éléments à la fois. C'est pourquoi dans mon édition quotidienne, j'utilise seulement environ 5 à 7 registres nommés. Il n'y a pas moyen que je puisse me souvenir des vingt-six dans ma tête. Je commence normalement par le registre a, puis b, en suivant l'ordre alphabétique. Essayez et expérimentez pour voir quelle technique fonctionne le mieux pour vous.

Les registres Vim sont puissants. Utilisés stratégiquement, ils peuvent vous éviter de taper d'innombrables textes répétitifs. Ensuite, apprenons sur les macros.