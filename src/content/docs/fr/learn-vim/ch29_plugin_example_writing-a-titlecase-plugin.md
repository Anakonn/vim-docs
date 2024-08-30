---
description: Découvrez le plugin Vim `totitle-vim`, un opérateur de mise en majuscules
  pour automatiser la capitalisation des titres dans vos articles.
title: 'Ch29. Write a Plugin: Creating a Titlecase Operator'
---

Lorsque vous commencez à bien maîtriser Vim, vous voudrez peut-être écrire vos propres plugins. J'ai récemment écrit mon premier plugin Vim, [totitle-vim](https://github.com/iggredible/totitle-vim). C'est un plugin d'opérateur de titre, semblable aux opérateurs en majuscules `gU`, en minuscules `gu` et de changement de casse `g~` de Vim.

Dans ce chapitre, je vais présenter la décomposition du plugin `totitle-vim`. J'espère éclairer le processus et peut-être vous inspirer à créer votre propre plugin unique !

## Le Problème

J'utilise Vim pour écrire mes articles, y compris ce guide.

Un problème principal était de créer une bonne casse de titre pour les en-têtes. Une façon d'automatiser cela est de mettre en majuscule chaque mot dans l'en-tête avec `g/^#/ s/\<./\u\0/g`. Pour une utilisation basique, cette commande était suffisante, mais ce n'est toujours pas aussi bon que d'avoir une véritable casse de titre. Les mots "Le" et "De" dans "Mettre en Majuscule La Première Lettre De Chaque Mot" devraient être en majuscule. Sans une bonne capitalisation, la phrase semble légèrement décalée.

Au début, je ne prévoyais pas d'écrire un plugin. Il s'avère également qu'il existe déjà un plugin de casse de titre : [vim-titlecase](https://github.com/christoomey/vim-titlecase). Cependant, il y avait quelques éléments qui ne fonctionnaient pas tout à fait comme je le voulais. Le principal était le comportement du mode visuel par bloc. Si j'ai la phrase :

```shell
test title one
test title two
test title three
```

Si j'utilise une mise en surbrillance visuelle par bloc sur "tle" :

```shell
test ti[tle] one
test ti[tle] two
test ti[tle] three
```

Si j'appuie sur `gt`, le plugin ne le mettra pas en majuscule. Je trouve cela incohérent avec les comportements de `gu`, `gU` et `g~`. J'ai donc décidé de partir de ce dépôt de plugin de casse de titre et de l'utiliser pour créer un plugin de casse de titre moi-même qui soit cohérent avec `gu`, `gU` et `g~` ! Encore une fois, le plugin vim-titlecase lui-même est un excellent plugin et mérite d'être utilisé seul (la vérité est que, peut-être au fond de moi, je voulais juste écrire mon propre plugin Vim. Je ne peux vraiment pas voir la fonctionnalité de mise en majuscule par bloc être utilisée si souvent dans la vie réelle, sauf dans des cas particuliers).

### Planification du Plugin

Avant d'écrire la première ligne de code, je dois décider quelles sont les règles de casse de titre. J'ai trouvé un joli tableau de différentes règles de capitalisation sur le site [titlecaseconverter](https://titlecaseconverter.com/rules/). Saviez-vous qu'il existe au moins 8 règles de capitalisation différentes en anglais ? *Gasp !*

En fin de compte, j'ai utilisé les dénominateurs communs de cette liste pour élaborer une règle de base suffisamment bonne pour le plugin. De plus, je doute que les gens se plaignent : "Hé mec, tu utilises AMA, pourquoi n'utilises-tu pas APA ?". Voici les règles de base :
- Le premier mot est toujours en majuscule.
- Certains adverbes, conjonctions et prépositions sont en minuscules.
- Si le mot d'entrée est entièrement en majuscules, alors ne rien faire (cela pourrait être une abréviation).

Quant aux mots qui sont en minuscules, différentes règles ont différentes listes. J'ai décidé de m'en tenir à `a an and at but by en for in nor of off on or out per so the to up yet vs via`.

### Planification de l'Interface Utilisateur

Je veux que le plugin soit un opérateur pour compléter les opérateurs de casse existants de Vim : `gu`, `gU` et `g~`. En tant qu'opérateur, il doit accepter soit un mouvement, soit un objet texte (`gtw` devrait mettre en majuscule le mot suivant, `gtiw` devrait mettre en majuscule le mot intérieur, `gt$` devrait mettre en majuscule les mots de l'emplacement actuel jusqu'à la fin de la ligne, `gtt` devrait mettre en majuscule la ligne actuelle, `gti(` devrait mettre en majuscule les mots à l'intérieur des parenthèses, etc.). Je veux également qu'il soit mappé à `gt` pour une mnémotechnique facile. De plus, il devrait également fonctionner avec tous les modes visuels : `v`, `V` et `Ctrl-V`. Je devrais pouvoir le mettre en surbrillance dans *n'importe quel* mode visuel, appuyer sur `gt`, puis tous les textes surlignés seront mis en majuscule.

## Runtime Vim

La première chose que vous voyez lorsque vous regardez le dépôt, c'est qu'il a deux répertoires : `plugin/` et `doc/`. Lorsque vous démarrez Vim, il recherche des fichiers et des répertoires spéciaux dans le répertoire `~/.vim` et exécute tous les fichiers de script à l'intérieur de ce répertoire. Pour plus d'informations, consultez le chapitre sur le Runtime Vim.

Le plugin utilise deux répertoires de runtime Vim : `doc/` et `plugin/`. `doc/` est un endroit pour mettre la documentation d'aide (afin que vous puissiez rechercher des mots-clés plus tard, comme `:h totitle`). Je vais expliquer comment créer une page d'aide plus tard. Pour l'instant, concentrons-nous sur `plugin/`. Le répertoire `plugin/` est exécuté une fois lorsque Vim démarre. Il y a un fichier à l'intérieur de ce répertoire : `totitle.vim`. Le nom n'a pas d'importance (j'aurais pu l'appeler `whatever.vim` et cela aurait toujours fonctionné). Tout le code responsable du fonctionnement du plugin se trouve dans ce fichier.

## Mappages

Passons au code !

Au début du fichier, vous avez :

```shell
if !exists('g:totitle_default_keys')
  let g:totitle_default_keys = 1
endif
```

Lorsque vous démarrez Vim, `g:totitle_default_keys` n'existe pas encore, donc `!exists(...)` renvoie vrai. Dans ce cas, définissez `g:totitle_default_keys` pour qu'il soit égal à 1. Dans Vim, 0 est faux et non nul est vrai (utilisez 1 pour indiquer vrai).

Passons à la fin du fichier. Vous verrez ceci :

```shell
if g:totitle_default_keys
  nnoremap <expr> gt ToTitle()
  xnoremap <expr> gt ToTitle()
  nnoremap <expr> gtt ToTitle() .. '_'
endif
```

C'est ici que le mappage principal `gt` est défini. Dans ce cas, au moment où vous arrivez aux conditions `if` en bas du fichier, `if g:totitle_default_keys` renverrait 1 (vrai), donc Vim effectue les mappages suivants :
- `nnoremap <expr> gt ToTitle()` mappe l'opérateur du mode normal. Cela vous permet d'exécuter l'opérateur + mouvement/objet texte comme `gtw` pour mettre en majuscule le mot suivant ou `gtiw` pour mettre en majuscule le mot intérieur. Je vais expliquer les détails de la façon dont le mappage de l'opérateur fonctionne plus tard.
- `xnoremap <expr> gt ToTitle()` mappe les opérateurs du mode visuel. Cela vous permet de mettre en majuscule les textes qui sont visuellement surlignés.
- `nnoremap <expr> gtt ToTitle() .. '_'` mappe l'opérateur de ligne du mode normal (analogue à `guu` et `gUU`). Vous vous demandez peut-être ce que fait `.. '_'` à la fin. `..` est l'opérateur d'interpolation de chaînes de Vim. `_` est utilisé comme mouvement avec un opérateur. Si vous regardez dans `:help _`, il est dit que le soulignement est utilisé pour compter 1 ligne vers le bas. Cela effectue un opérateur sur la ligne actuelle (essayez-le avec d'autres opérateurs, essayez d'exécuter `gU_` ou `d_`, remarquez que cela fait la même chose que `gUU` ou `dd`).
- Enfin, l'argument `<expr>` vous permet de spécifier le compte, donc vous pouvez faire `3gtw` pour mettre en majuscule les 3 mots suivants.

Que faire si vous ne voulez pas utiliser le mappage par défaut `gt` ? Après tout, vous remplacez le mappage par défaut de Vim `gt` (onglet suivant). Que faire si vous voulez utiliser `gz` au lieu de `gt` ? Rappelez-vous plus tôt comment vous avez traversé le problème de vérifier `if !exists('g:totitle_default_keys')` et `if g:totitle_default_keys` ? Si vous mettez `let g:totitle_default_keys = 0` dans votre vimrc, alors `g:totitle_default_keys` existerait déjà lorsque le plugin est exécuté (les codes dans votre vimrc sont exécutés avant les fichiers de runtime `plugin/`), donc `!exists('g:totitle_default_keys')` renvoie faux. De plus, `if g:totitle_default_keys` serait faux (car il aurait la valeur de 0), donc il ne fera pas non plus le mappage `gt` ! Cela vous permet effectivement de définir votre propre mappage personnalisé dans Vimrc.

Pour définir votre propre mappage de casse de titre à `gz`, ajoutez ceci dans votre vimrc :

```shell
let g:totitle_default_keys = 0

nnoremap <expr> gz ToTitle()
xnoremap <expr> gz ToTitle()
nnoremap <expr> gzz ToTitle() .. '_'
```

Facile comme tout.

## La Fonction ToTitle

La fonction `ToTitle()` est de loin la plus longue fonction de ce fichier.

```shell
 function! ToTitle(type = '')
  if a:type ==# ''
    set opfunc=ToTitle
    return 'g@'
  endif

  " invoquer ceci lors de l'appel de la fonction ToTitle()
  if a:type != 'block' && a:type != 'line' && a:type != 'char'
    let l:words = a:type
    let l:wordsArr = trim(l:words)->split('\s\+')
    call map(l:wordsArr, 's:capitalize(v:val)')
    return l:wordsArr->join(' ')
  endif

  " sauvegarder les paramètres actuels
  let l:sel_save = &selection
  let l:reg_save = getreginfo('"')
  let l:cb_save = &clipboard
  let l:visual_marks_save = [getpos("'<"), getpos("'>")]

  try
    set clipboard= selection=inclusive
    let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}

    silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
    let l:selected_phrase = getreg('"')
    let l:WORD_PATTERN = '\<\k*\>'
    let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'

    let l:startLine = line("'<")
    let l:startCol = virtcol(".")

    " lorsque l'utilisateur appelle une opération par bloc
    if a:type ==# "block"
      sil! keepj norm! gv"ad
      keepj $
      keepj pu_

      let l:lastLine = line("$")

      sil! keepj norm "ap

      let l:curLine = line(".")

      sil! keepj norm! VGg@
      exe "keepj norm! 0\<c-v>G$h\"ad"
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
      exe "keepj " . l:lastLine
      sil! keepj norm! "_dG
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>"

    " lorsque l'utilisateur appelle une opération par caractère ou ligne
    else
      let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
      let l:titlecased = s:capitalizeFirstWord(l:titlecased)
      call setreg('"', l:titlecased)
      let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
      silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>"
    endif
  finally

    " restaurer les paramètres
    call setreg('"', l:reg_save)
    call setpos("'<", l:visual_marks_save[0])
    call setpos("'>", l:visual_marks_save[1])
    let &clipboard = l:cb_save
    let &selection = l:sel_save
  endtry
  return
endfunction
```

C'est très long, alors décomposons-le.

*Je pourrais le refactoriser en sections plus petites, mais pour le bien de la complétion de ce chapitre, je l'ai laissé tel quel.*
## La Fonction Opérateur

Voici la première partie du code :

```shell
if a:type ==# ''
  set opfunc=ToTitle
  return 'g@'
endif
```

Qu'est-ce que `opfunc` ? Pourquoi renvoie-t-il `g@` ?

Vim a un opérateur spécial, la fonction opérateur, `g@`. Cet opérateur vous permet d'utiliser *n'importe quelle* fonction assignée à l'option `opfunc`. Si j'ai la fonction `Foo()` assignée à `opfunc`, alors lorsque j'exécute `g@w`, j'exécute `Foo()` sur le mot suivant. Si j'exécute `g@i(`, alors j'exécute `Foo()` sur les parenthèses intérieures. Cette fonction opérateur est essentielle pour créer votre propre opérateur Vim.

La ligne suivante assigne `opfunc` à la fonction `ToTitle`.

```shell
set opfunc=ToTitle
```

La ligne suivante renvoie littéralement `g@` :

```shell
return g@
```

Alors, comment ces deux lignes fonctionnent-elles et pourquoi renvoie-t-elle `g@` ?

Supposons que vous ayez la map suivante :

```shell
nnoremap <expr> gt ToTitle()`
```

Ensuite, vous appuyez sur `gtw` (mettre en majuscule le mot suivant). La première fois que vous exécutez `gtw`, Vim appelle la méthode `ToTitle()`. Mais pour l'instant, `opfunc` est encore vide. Vous ne passez également aucun argument à `ToTitle()`, donc il aura une valeur `a:type` de `''`. Cela fait que l'expression conditionnelle vérifie l'argument `a:type`, `if a:type ==# ''`, pour être vraie. À l'intérieur, vous assignez `opfunc` à la fonction `ToTitle` avec `set opfunc=ToTitle`. Maintenant, `opfunc` est assigné à `ToTitle`. Enfin, après avoir assigné `opfunc` à la fonction `ToTitle`, vous renvoyez `g@`. Je vais expliquer pourquoi cela renvoie `g@` ci-dessous.

Vous n'avez pas encore terminé. Rappelez-vous, vous venez d'appuyer sur `gtw`. Appuyer sur `gt` a fait toutes les choses ci-dessus, mais vous avez encore `w` à traiter. En renvoyant `g@`, à ce stade, vous avez maintenant techniquement `g@w` (c'est pourquoi vous avez `return g@`). Puisque `g@` est l'opérateur de fonction, vous lui passez le mouvement `w`. Donc Vim, en recevant `g@w`, appelle la fonction `ToTitle` *une fois de plus* (ne vous inquiétez pas, vous ne finirez pas avec une boucle infinie comme vous le verrez un peu plus tard).

Pour résumer, en appuyant sur `gtw`, Vim vérifie si `opfunc` est vide ou non. Si elle est vide, alors Vim l'assignera à `ToTitle`. Ensuite, elle renvoie `g@`, appelant essentiellement `ToTitle` une fois de plus afin que vous puissiez maintenant l'utiliser comme un opérateur. C'est la partie la plus délicate de la création d'un opérateur personnalisé et vous l'avez fait ! Ensuite, vous devez construire la logique pour que `ToTitle()` mette réellement en majuscule l'entrée.

## Traitement de l'Entrée

Vous avez maintenant `gt` fonctionnant comme un opérateur qui exécute `ToTitle()`. Mais que faites-vous ensuite ? Comment mettez-vous réellement en majuscule le texte ?

Chaque fois que vous exécutez un opérateur dans Vim, il existe trois types de mouvements d'action différents : caractère, ligne et bloc. `g@w` (mot) est un exemple d'opération de caractère. `g@j` (une ligne en dessous) est un exemple d'opération de ligne. L'opération de bloc est rare, mais typiquement lorsque vous faites une opération de `Ctrl-V` (bloc visuel), elle sera comptée comme une opération de bloc. Les opérations qui ciblent quelques caractères en avant / en arrière sont généralement considérées comme des opérations de caractère (`b`, `e`, `w`, `ge`, etc). Les opérations qui ciblent quelques lignes vers le bas / vers le haut sont généralement considérées comme des opérations de ligne (`j`, `k`). Les opérations qui ciblent des colonnes en avant, en arrière, vers le haut ou vers le bas sont généralement considérées comme des opérations de bloc (elles sont généralement soit un mouvement forcé en colonne, soit un mode visuel en bloc ; pour plus : `:h forced-motion`).

Cela signifie que si vous appuyez sur `g@w`, `g@` passera une chaîne littérale `"char"` comme argument à `ToTitle()`. Si vous faites `g@j`, `g@` passera une chaîne littérale `"line"` comme argument à `ToTitle()`. Cette chaîne est ce qui sera passé à la fonction `ToTitle` en tant qu'argument `type`.

## Création de Votre Propre Fonction Opérateur Personnalisée

Faisons une pause et jouons avec `g@` en écrivant une fonction fictive :

```shell
function! Test(some_arg)
  echom a:some_arg 
endfunction
```

Maintenant, assignez cette fonction à `opfunc` en exécutant :

```shell
:set opfunc=Test
```

L'opérateur `g@` exécutera `Test(some_arg)` et lui passera soit `"char"`, soit `"line"`, soit `"block"` en fonction de l'opération que vous effectuez. Exécutez différentes opérations comme `g@iw` (mot intérieur), `g@j` (une ligne en dessous), `g@$` (jusqu'à la fin de la ligne), etc. Voyez quelles valeurs différentes sont affichées. Pour tester l'opération de bloc, vous pouvez utiliser le mouvement forcé de Vim pour les opérations de bloc : `g@Ctrl-Vj` (opération de bloc une colonne en dessous).

Vous pouvez également l'utiliser avec le mode visuel. Utilisez les différents surlignages visuels comme `v`, `V` et `Ctrl-V` puis appuyez sur `g@` (soyez averti, cela affichera rapidement la sortie d'écho, donc vous devez avoir un œil rapide - mais l'écho est définitivement là. De plus, comme vous utilisez `echom`, vous pouvez vérifier les messages d'écho enregistrés avec `:messages`).

Assez cool, n'est-ce pas ? Les choses que vous pouvez programmer avec Vim ! Pourquoi ne l'ont-ils pas enseigné à l'école ? Continuons avec notre plugin.

## ToTitle Comme Fonction

Passons aux prochaines lignes :

```shell
if a:type != 'block' && a:type != 'line' && a:type != 'char'
  let l:words = a:type
  let l:wordsArr = trim(l:words)->split('\s\+')
  call map(l:wordsArr, 's:capitalize(v:val)')
  return l:wordsArr->join(' ')
endif
```

Cette ligne n'a en fait rien à voir avec le comportement de `ToTitle()` en tant qu'opérateur, mais pour l'activer en tant que fonction TitleCase appelable (oui, je sais que je viole le principe de responsabilité unique). La motivation est que Vim a des fonctions natives `toupper()` et `tolower()` qui mettront en majuscule et en minuscule toute chaîne donnée. Ex : `:echo toupper('hello')` renvoie `'HELLO'` et `:echo tolower('HELLO')` renvoie `'hello'`. Je veux que ce plugin ait la capacité d'exécuter `ToTitle` afin que vous puissiez faire `:echo ToTitle('il était une fois')` et obtenir une valeur de retour `'Il Était Une Fois'`.

À ce stade, vous savez que lorsque vous appelez `ToTitle(type)` avec `g@`, l'argument `type` aura une valeur soit `'block'`, soit `'line'`, soit `'char'`. Si l'argument n'est ni `'block'`, ni `'line'`, ni `'char'`, vous pouvez supposer en toute sécurité que `ToTitle()` est appelé en dehors de `g@`. Dans ce cas, vous les divisez par des espaces (`\s\+`) avec :

```shell
let l:wordsArr = trim(l:words)->split('\s\+')
```

Puis, vous mettez en majuscule chaque élément :

```shell
call map(l:wordsArr, 's:capitalize(v:val)')
```

Avant de les rassembler :

```shell
l:wordsArr->join(' ')
```

La fonction `capitalize()` sera couverte plus tard.

## Variables Temporaires

Les prochaines lignes :

```shell
let l:sel_save = &selection
let l:reg_save = getreginfo('"')
let l:cb_save = &clipboard
let l:visual_marks_save = [getpos("'<"), getpos("'>")]
```

Ces lignes préservent divers états actuels dans des variables temporaires. Plus tard, vous utiliserez des modes visuels, des marques et des registres. Faire cela modifiera quelques états. Comme vous ne voulez pas réviser l'historique, vous devez les sauvegarder dans des variables temporaires afin de pouvoir restaurer les états plus tard.
## Capitaliser les Sélections

Les lignes suivantes sont importantes :

```shell
try
  set clipboard= selection=inclusive
  let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}

  silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
  let l:selected_phrase = getreg('"')
  let l:WORD_PATTERN = '\<\k*\>'
  let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'

  let l:startLine = line("'<")
  let l:startCol = virtcol(".")
```
Passons en revue ces lignes par petites étapes. Cette ligne :

```shell
set clipboard= selection=inclusive
```

Vous définissez d'abord l'option `selection` comme étant inclusive et le `clipboard` comme étant vide. L'attribut de sélection est généralement utilisé avec le mode visuel et il y a trois valeurs possibles : `old`, `inclusive` et `exclusive`. Le fait de le définir comme inclusif signifie que le dernier caractère de la sélection est inclus. Je ne vais pas les couvrir ici, mais l'idée est que le choix de le rendre inclusif le fait se comporter de manière cohérente en mode visuel. Par défaut, Vim le définit comme inclusif, mais vous le définissez ici de toute façon au cas où l'un de vos plugins le définirait à une valeur différente. Consultez `:h 'clipboard'` et `:h 'selection'` si vous êtes curieux de savoir ce qu'ils font réellement.

Ensuite, vous avez ce hash qui semble étrange suivi d'une commande d'exécution :

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
```

Tout d'abord, la syntaxe `#{}` est le type de données dictionnaire de Vim. La variable locale `l:commands` est un hash avec 'lines', 'char' et 'block' comme clés. La commande `silent exe '...'` exécute silencieusement la commande contenue dans la chaîne (sinon, elle affichera des notifications en bas de votre écran).

Deuxièmement, les commandes exécutées sont `'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')`. La première, `noautocmd`, exécutera la commande suivante sans déclencher aucune auto-commande. La seconde, `keepjumps`, sert à ne pas enregistrer le mouvement du curseur pendant le déplacement. Dans Vim, certains mouvements sont automatiquement enregistrés dans la liste des changements, la liste des sauts et la liste des marques. Cela empêche cela. L'objectif d'avoir `noautocmd` et `keepjumps` est d'éviter les effets secondaires. Enfin, la commande `normal` exécute les chaînes comme des commandes normales. Le `..` est la syntaxe d'interpolation de chaînes de Vim. `get()` est une méthode d'accès qui accepte soit une liste, un blob ou un dictionnaire. Dans ce cas, vous lui passez le dictionnaire `l:commands`. La clé est `a:type`. Vous avez appris plus tôt que `a:type` est l'une des trois valeurs de chaîne : 'char', 'line' ou 'block'. Donc, si `a:type` est 'line', vous exécuterez `"noautocmd keepjumps normal! '[V']y"` (pour plus d'informations, consultez `:h silent`, `:h :exe`, `:h :noautocmd`, `:h :keepjumps`, `:h :normal`, et `:h get()`).

Voyons ce que fait `'[V']y`. Supposons d'abord que vous ayez ce corps de texte :

```shell
le deuxième petit déjeuner
est meilleur que le premier petit déjeuner
```
Supposons que votre curseur soit sur la première ligne. Ensuite, vous appuyez sur `g@j` (exécutez la fonction opérateur, `g@`, une ligne en dessous, avec `j`). `'[` déplace le curseur au début du texte précédemment changé ou copié. Bien que vous n'ayez techniquement pas changé ou copié de texte avec `g@j`, Vim se souvient des emplacements des mouvements de début et de fin de la commande `g@` avec `'[` et `']` (pour plus d'informations, consultez `:h g@`). Dans votre cas, appuyer sur `'[` déplace votre curseur à la première ligne car c'est là que vous avez commencé lorsque vous avez exécuté `g@`. `V` est une commande de mode visuel par ligne. Enfin, `']` déplace votre curseur à la fin du texte précédemment changé ou copié, mais dans ce cas, il déplace votre curseur à la fin de votre dernière opération `g@`. Enfin, `y` copie le texte sélectionné.

Ce que vous venez de faire, c'est copier le même corps de texte sur lequel vous avez effectué `g@`.

Si vous regardez les deux autres commandes ici :

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
```

Elles effectuent toutes des actions similaires, sauf qu'au lieu d'utiliser des actions par ligne, vous utiliseriez des actions par caractère ou par bloc. Je vais avoir l'air redondant, mais dans les trois cas, vous copiez effectivement le même corps de texte sur lequel vous avez effectué `g@`.

Regardons la ligne suivante :

```shell
let l:selected_phrase = getreg('"')
```

Cette ligne obtient le contenu du registre non nommé (`"`) et le stocke dans la variable `l:selected_phrase`. Attendez une minute... n'avez-vous pas juste copié un corps de texte ? Le registre non nommé contient actuellement le texte que vous venez de copier. C'est ainsi que ce plugin est capable d'obtenir une copie du texte.

La ligne suivante est un motif d'expression régulière :

```shell
let l:WORD_PATTERN = '\<\k*\>'
```

`\<` et `\>` sont des motifs de frontière de mot. Le caractère suivant `\<` correspond au début d'un mot et le caractère précédant `\>` correspond à la fin d'un mot. `\k` est le motif de mot-clé. Vous pouvez vérifier quels caractères Vim accepte comme mots-clés avec `:set iskeyword?`. Rappelez-vous que le mouvement `w` dans Vim déplace votre curseur par mot. Vim a une notion préconçue de ce qu'est un "mot-clé" (vous pouvez même les modifier en modifiant l'option `iskeyword`). Consultez `:h /\<`, `:h /\>`, et `:h /\k`, et `:h 'iskeyword'` pour plus d'informations. Enfin, `*` signifie zéro ou plusieurs du motif suivant.

Dans l'ensemble, `'\<\k*\>'` correspond à un mot. Si vous avez une chaîne :

```shell
un deux trois
```

La correspondance avec le motif vous donnera trois correspondances : "un", "deux" et "trois".

Enfin, vous avez un autre motif :

```shell
let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'
```

Rappelez-vous que la commande de substitution de Vim peut être utilisée avec une expression avec `\={votre-expression}`. Par exemple, si vous souhaitez mettre en majuscule la chaîne "beignet" dans la ligne actuelle, vous pouvez utiliser la fonction `toupper()` de Vim. Vous pouvez y parvenir en exécutant `:%s/beignet/\=toupper(submatch(0))/g`. `submatch(0)` est une expression spéciale utilisée dans la commande de substitution. Elle renvoie tout le texte correspondant.

Les deux lignes suivantes :

```shell
let l:startLine = line("'<")
let l:startCol = virtcol(".")
```

L'expression `line()` renvoie un numéro de ligne. Ici, vous lui passez la marque `'<`, représentant la première ligne de la dernière zone visuelle sélectionnée. Rappelez-vous que vous avez utilisé le mode visuel pour copier le texte. `'<` renvoie le numéro de ligne du début de cette sélection de zone visuelle. L'expression `virtcol()` renvoie un numéro de colonne du curseur actuel. Vous allez déplacer votre curseur un peu partout dans un instant, donc vous devez stocker votre position de curseur pour pouvoir revenir ici plus tard.

Faites une pause ici et passez en revue tout ce qui a été dit jusqu'à présent. Assurez-vous que vous suivez toujours. Lorsque vous êtes prêt, continuons.
## Gestion d'une opération de bloc

Passons en revue cette section :

```shell
if a:type ==# "block"
  sil! keepj norm! gv"ad
  keepj $
  keepj pu_

  let l:lastLine = line("$")

  sil! keepj norm "ap

  let l:curLine = line(".")

  sil! keepj norm! VGg@
  exe "keepj norm! 0\<c-v>G$h\"ad" 
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
  exe "keepj " . l:lastLine
  sil! keepj norm! "_dG
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Il est temps de mettre en majuscule votre texte. Rappelez-vous que vous avez `a:type` qui peut être soit 'char', 'line', ou 'block'. Dans la plupart des cas, vous obtiendrez probablement 'char' et 'line'. Mais occasionnellement, vous pouvez obtenir un bloc. C'est rare, mais cela doit être traité néanmoins. Malheureusement, gérer un bloc n'est pas aussi simple que de gérer un caractère ou une ligne. Cela demandera un peu d'effort supplémentaire, mais c'est faisable.

Avant de commencer, prenons un exemple de la façon dont vous pourriez obtenir un bloc. Supposons que vous ayez ce texte :

```shell
crêpe pour le petit déjeuner
crêpe pour le déjeuner
crêpe pour le dîner
```

Supposons que votre curseur soit sur "c" de "crêpe" sur la première ligne. Vous utilisez ensuite le bloc visuel (`Ctrl-V`) pour sélectionner vers le bas et en avant pour sélectionner le "êpe" dans les trois lignes :

```shell
cr[êpe] pour le petit déjeuner
cr[êpe] pour le déjeuner
cr[êpe] pour le dîner
```

Lorsque vous appuyez sur `gt`, vous souhaitez obtenir :

```shell
crêPe pour le petit déjeuner
crêPe pour le déjeuner
crêPe pour le dîner

```
Voici vos hypothèses de base : lorsque vous mettez en surbrillance les trois "êpes" dans "crêpes", vous dites à Vim que vous avez trois lignes de mots que vous souhaitez mettre en surbrillance. Ces mots sont "êpe", "êpe" et "êpe". Vous vous attendez à obtenir "Êpe", "Êpe" et "Êpe".

Passons maintenant aux détails de l'implémentation. Les prochaines lignes contiennent :

```shell
sil! keepj norm! gv"ad
keepj $
keepj pu_
let l:lastLine = line("$")
sil! keepj norm "ap
let l:curLine = line(".")
```

La première ligne :

```shell
sil! keepj norm! gv"ad
```

Rappelez-vous que `sil!` s'exécute silencieusement et `keepj` conserve l'historique des sauts lors du déplacement. Vous exécutez ensuite la commande normale `gv"ad`. `gv` sélectionne le dernier texte mis en surbrillance visuellement (dans l'exemple des crêpes, cela remettra en surbrillance les trois 'êpes'). `"ad` supprime les textes mis en surbrillance visuellement et les stocke dans le registre a. En conséquence, vous avez maintenant :

```shell
cr pour le petit déjeuner
cr pour le déjeuner
cr pour le dîner
```

Maintenant, vous avez 3 *blocs* (pas de lignes) de 'êpes' stockés dans le registre a. Cette distinction est importante. Copier un texte avec le mode visuel par ligne est différent de copier un texte avec le mode visuel par bloc. Gardez cela à l'esprit car vous le verrez à nouveau plus tard.

Ensuite, vous avez :

```shell
keepj $
keepj pu_
```

`$` vous déplace à la dernière ligne de votre fichier. `pu_` insère une ligne en dessous de l'endroit où se trouve votre curseur. Vous souhaitez les exécuter avec `keepj` afin de ne pas altérer l'historique des sauts.

Ensuite, vous stockez le numéro de ligne de votre dernière ligne (`line("$")`) dans la variable locale `lastLine`.

```shell
let l:lastLine = line("$")
```

Puis collez le contenu du registre avec `norm "ap`.

```shell
sil! keepj norm "ap
```

Gardez à l'esprit que cela se produit sur la nouvelle ligne que vous avez créée en dessous de la dernière ligne du fichier - vous êtes actuellement en bas du fichier. Le collage vous donne ces textes *blocs* :

```shell
êpe
êpe
êpe
```

Ensuite, vous stockez l'emplacement de la ligne actuelle où se trouve votre curseur.

```shell
let l:curLine = line(".")
```

Passons maintenant aux prochaines lignes :

```shell
sil! keepj norm! VGg@
exe "keepj norm! 0\<c-v>G$h\"ad"
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
exe "keepj " . l:lastLine
sil! keepj norm! "_dG
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Cette ligne :

```shell
sil! keepj norm! VGg@
```

`VG` met visuellement en surbrillance avec le mode visuel par ligne depuis la ligne actuelle jusqu'à la fin du fichier. Donc ici, vous mettez en surbrillance les trois blocs de textes 'êpe' avec une surbrillance par ligne (rappelez-vous la distinction entre bloc et ligne). Notez que la première fois que vous avez collé les trois textes "êpe", vous les colliez en tant que blocs. Maintenant, vous les mettez en surbrillance en tant que lignes. Ils peuvent sembler identiques de l'extérieur, mais en interne, Vim connaît la différence entre coller des blocs de textes et coller des lignes de textes.

```shell
êpe
êpe
êpe
```

`g@` est l'opérateur de fonction, donc vous faites essentiellement un appel récursif à lui-même. Mais pourquoi ? Qu'est-ce que cela accomplit ?

Vous faites un appel récursif à `g@` et lui passez les 3 lignes (après l'avoir exécuté avec `V`, vous avez maintenant des lignes, pas des blocs) de textes 'êpe' afin qu'il soit traité par l'autre partie du code (vous passerez en revue cela plus tard). Le résultat de l'exécution de `g@` est trois lignes de textes correctement mises en majuscule :

```shell
Êpe
Êpe
Êpe
```

La ligne suivante :

```shell
exe "keepj norm! 0\<c-v>G$h\"ad"
```

Cela exécute la commande en mode normal pour aller au début de la ligne (`0`), utilise la surbrillance visuelle par bloc pour aller à la dernière ligne et au dernier caractère de cette ligne (`<c-v>G$`). Le `h` est pour ajuster le curseur (lorsque vous faites `$`, Vim se déplace d'une ligne supplémentaire vers la droite). Enfin, vous supprimez le texte mis en surbrillance et le stockez dans le registre a (`"ad`).

La ligne suivante :

```shell
exe "keepj " . l:startLine
```

Vous déplacez votre curseur à l'endroit où se trouvait `startLine`.

Ensuite :

```shell
exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
```

Étant dans l'emplacement `startLine`, vous sautez maintenant à la colonne marquée par `startCol`. `\<bar>\` est le mouvement de barre `|`. Le mouvement de barre dans Vim déplace votre curseur à la n-ième colonne (disons que `startCol` était 4. Exécuter `4|` fera sauter votre curseur à la position de colonne 4). Rappelez-vous que vous avez stocké `startCol` à l'endroit où vous vouliez mettre en majuscule le texte. Enfin, `"aP` colle les textes stockés dans le registre a. Cela remet le texte à l'endroit où il a été supprimé auparavant.

Examinons les 4 lignes suivantes :

```shell
exe "keepj " . l:lastLine
sil! keepj norm! "_dG
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

`exe "keepj " . l:lastLine` déplace votre curseur à l'emplacement `lastLine` d'auparavant. `sil! keepj norm! "_dG` supprime l'espace(s) supplémentaire(s) qui ont été créés en utilisant le registre de trou noir (`"_dG`) afin que votre registre sans nom reste propre. `exe "keepj " . l:startLine` déplace votre curseur à `startLine`. Enfin, `exe "sil! keepj norm! " . l:startCol . "\<bar>"` déplace votre curseur à la colonne `startCol`.

Ce sont toutes les actions que vous auriez pu faire manuellement dans Vim. Cependant, le bénéfice de transformer ces actions en fonctions réutilisables est qu'elles vous éviteront d'exécuter 30+ lignes d'instructions chaque fois que vous devez mettre en majuscule quoi que ce soit. La leçon ici est que tout ce que vous pouvez faire manuellement dans Vim, vous pouvez le transformer en une fonction réutilisable, donc un plugin !

Voici à quoi cela ressemblerait.

Étant donné un texte :

```shell
crêpe pour le petit déjeuner
crêpe pour le déjeuner
crêpe pour le dîner

... du texte
```

Tout d'abord, vous le mettez en surbrillance visuellement par blocs :

```shell
cr[êpe] pour le petit déjeuner
cr[êpe] pour le déjeuner
cr[êpe] pour le dîner

... du texte
```

Ensuite, vous le supprimez et stockez ce texte dans le registre a :

```shell
cr pour le petit déjeuner
cr pour le déjeuner
cr pour le dîner

... du texte
```

Puis vous le collez en bas du fichier :

```shell
cr pour le petit déjeuner
cr pour le déjeuner
cr pour le dîner

... du texte
êpe
êpe
êpe
```

Ensuite, vous le mettez en majuscule :

```shell
cr pour le petit déjeuner
cr pour le déjeuner
cr pour le dîner

... du texte
Êpe
Êpe
Êpe
```

Enfin, vous remettez le texte en majuscule :

```shell
crêPe pour le petit déjeuner
crêPe pour le déjeuner
crêPe pour le dîner

... du texte
```

## Gestion des opérations de ligne et de caractère

Vous n'avez pas encore terminé. Vous n'avez abordé que le cas particulier lorsque vous exécutez `gt` sur des textes de bloc. Vous devez encore gérer les opérations 'line' et 'char'. Voyons le code `else` pour voir comment cela se fait.

Voici les codes :

```shell
if a:type ==# "block"
  # ... 
else
  let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
  let l:titlecased = s:capitalizeFirstWord(l:titlecased)
  call setreg('"', l:titlecased)
  let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
  silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>"
endif
```

Passons-les ligne par ligne. Le secret de ce plugin se trouve en fait sur cette ligne :

```shell
let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
```

`@@` contient le texte du registre sans nom à mettre en majuscule. `l:WORD_PATTERN` est le motif de correspondance des mots individuels. `l:UPCASE_REPLACEMENT` est l'appel à la commande `capitalize()` (que vous verrez plus tard). Le `'g'` est le drapeau global qui indique à la commande de substitution de substituer tous les mots donnés, pas seulement le premier mot.

La ligne suivante :

```shell
let l:titlecased = s:capitalizeFirstWord(l:titlecased)
```

Cela garantit que le premier mot sera toujours en majuscule. Si vous avez une phrase comme "une pomme par jour éloigne le médecin", puisque le premier mot, "une", est un mot spécial, votre commande de substitution ne le mettra pas en majuscule. Vous avez besoin d'une méthode qui met toujours en majuscule le premier caractère peu importe quoi. Cette fonction fait exactement cela (vous verrez le détail de cette fonction plus tard). Le résultat de ces méthodes de mise en majuscule est stocké dans la variable locale `l:titlecased`.

La ligne suivante :

```shell
call setreg('"', l:titlecased)
```

Cela met la chaîne mise en majuscule dans le registre sans nom (`"`).

Ensuite, les deux lignes suivantes :

```shell
let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
```

Hé, cela semble familier ! Vous avez vu un modèle similaire auparavant avec `l:commands`. Au lieu de yank, ici vous utilisez paste (`p`). Consultez la section précédente où j'ai passé en revue `l:commands` pour un rappel.

Enfin, ces deux lignes :

```shell
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Vous déplacez votre curseur à la ligne et à la colonne où vous avez commencé. C'est tout !

Récapitulons. La méthode de substitution ci-dessus est suffisamment intelligente pour mettre en majuscule les textes donnés et ignorer les mots spéciaux (plus à ce sujet plus tard). Après avoir obtenu une chaîne mise en majuscule, vous les stockez dans le registre sans nom. Ensuite, vous mettez visuellement en surbrillance le même texte sur lequel vous avez opéré `g@` auparavant, puis collez à partir du registre sans nom (cela remplace effectivement les textes non mis en majuscule par la version mise en majuscule). Enfin, vous déplacez votre curseur à l'endroit où vous avez commencé.
## Nettoyages

Vous avez techniquement terminé. Les textes sont maintenant en casse de titre. Tout ce qui reste à faire est de restaurer les registres et les paramètres.

```shell
call setreg('"', l:reg_save)
call setpos("'<", l:visual_marks_save[0])
call setpos("'>", l:visual_marks_save[1])
let &clipboard = l:cb_save
let &selection = l:sel_save
```

Cela restaure :
- le registre sans nom.
- les marques `<` et `>`.
- les options `'clipboard'` et `'selection'`.

Ouf, vous avez terminé. C'était une longue fonction. J'aurais pu rendre la fonction plus courte en la divisant en plus petites, mais pour l'instant, cela devra suffire. Passons maintenant brièvement en revue les fonctions de capitalisation.

## La Fonction de Capitalisation

Dans cette section, passons en revue la fonction `s:capitalize()`. Voici à quoi ressemble la fonction :

```shell
function! s:capitalize(string)
    if(toupper(a:string) ==# a:string && a:string != 'A')
        return a:string
    endif

    let l:str = tolower(a:string)
    let l:exclusions = '^\(a\|an\|and\|at\|but\|by\|en\|for\|in\|nor\|of\|off\|on\|or\|out\|per\|so\|the\|to\|up\|yet\|v\.?\|vs\.?\|via\)$'
    if (match(l:str, l:exclusions) >= 0) || (index(s:local_exclusion_list, l:str) >= 0)
      return l:str
    endif

    return toupper(l:str[0]) . l:str[1:]
endfunction
```

Rappelez-vous que l'argument de la fonction `capitalize()`, `a:string`, est le mot individuel passé par l'opérateur `g@`. Donc, si j'exécute `gt` sur le texte "pancake for breakfast", `ToTitle` appellera `capitalize(string)` *trois* fois, une fois pour "pancake", une fois pour "for", et une fois pour "breakfast".

La première partie de la fonction est :

```shell
if(toupper(a:string) ==# a:string && a:string != 'A')
  return a:string
endif
```

La première condition (`toupper(a:string) ==# a:string`) vérifie si la version en majuscules de l'argument est la même que la chaîne et si la chaîne elle-même est "A". Si ces conditions sont vraies, alors renvoyez cette chaîne. Cela repose sur l'hypothèse que si un mot donné est déjà totalement en majuscules, alors c'est une abréviation. Par exemple, le mot "CEO" serait sinon converti en "Ceo". Hmm, votre CEO ne sera pas content. Il est donc préférable de laisser tout mot entièrement en majuscules tel quel. La deuxième condition, `a:string != 'A'`, traite un cas particulier pour un caractère "A" en majuscules. Si `a:string` est déjà un "A" en majuscules, il aurait accidentellement passé le test `toupper(a:string) ==# a:string`. Parce que "a" est un article indéfini en anglais, il doit être en minuscules.

La partie suivante force la chaîne à être en minuscules :

```shell
let l:str = tolower(a:string)
```

La partie suivante est une regex d'une liste de toutes les exclusions de mots. Je les ai obtenues sur https://titlecaseconverter.com/rules/ :

```shell
let l:exclusions = '^\(a\|an\|and\|at\|but\|by\|en\|for\|in\|nor\|of\|off\|on\|or\|out\|per\|so\|the\|to\|up\|yet\|v\.?\|vs\.?\|via\)$'
```

La partie suivante :

```shell
if (match(l:str, l:exclusions) >= 0) || (index(s:local_exclusion_list, l:str) >= 0)
  return l:str
endif
```

D'abord, vérifiez si votre chaîne fait partie de la liste de mots exclus (`l:exclusions`). Si c'est le cas, ne la capitalisez pas. Ensuite, vérifiez si votre chaîne fait partie de la liste d'exclusion locale (`s:local_exclusion_list`). Cette liste d'exclusion est une liste personnalisée que l'utilisateur peut ajouter dans vimrc (au cas où l'utilisateur aurait des exigences supplémentaires pour des mots spéciaux).

La dernière partie renvoie la version capitalisée du mot. Le premier caractère est mis en majuscules tandis que le reste reste tel quel.

```shell
return toupper(l:str[0]) . l:str[1:]
```

Passons à la deuxième fonction de capitalisation. La fonction ressemble à ceci :

```shell
function! s:capitalizeFirstWord(string)
  if (a:string =~ "\n")
    let l:lineArr = trim(a:string)->split('\n')
    let l:lineArr = map(l:lineArr, 'toupper(v:val[0]) . v:val[1:]')
    return l:lineArr->join("\n")
  endif
  return toupper(a:string[0]) . a:string[1:]
endfunction
```

Cette fonction a été créée pour gérer un cas particulier si vous avez une phrase qui commence par un mot exclu, comme "an apple a day keeps the doctor away". Selon les règles de capitalisation de la langue anglaise, tous les premiers mots d'une phrase, qu'il s'agisse ou non d'un mot spécial, doivent être capitalisés. Avec votre commande `substitute()`, le "an" dans votre phrase serait mis en minuscules. Vous devez forcer le premier caractère à être en majuscules.

Dans cette fonction `capitalizeFirstWord`, l'argument `a:string` n'est pas un mot individuel comme `a:string` à l'intérieur de la fonction `capitalize`, mais plutôt tout le texte. Donc, si vous avez "pancake for breakfast", la valeur de `a:string` est "pancake for breakfast". Elle n'exécute `capitalizeFirstWord` qu'une seule fois pour tout le texte.

Un scénario dont vous devez vous méfier est si vous avez une chaîne multi-lignes comme `"an apple a day\nkeeps the doctor away"`. Vous souhaitez mettre en majuscules le premier caractère de toutes les lignes. Si vous n'avez pas de nouvelles lignes, alors il suffit de mettre en majuscules le premier caractère.

```shell
return toupper(a:string[0]) . a:string[1:]
```

Si vous avez des nouvelles lignes, vous devez capitaliser tous les premiers caractères de chaque ligne, donc vous les divisez en un tableau séparé par des nouvelles lignes :

```shell
let l:lineArr = trim(a:string)->split('\n')
```

Ensuite, vous mappez chaque élément du tableau et capitalisez le premier mot de chaque élément :

```shell
let l:lineArr = map(l:lineArr, 'toupper(v:val[0]) . v:val[1:]')
```

Enfin, vous assemblez les éléments du tableau :

```shell
return l:lineArr->join("\n")
```

Et vous avez terminé !

## Docs

Le deuxième répertoire du dépôt est le répertoire `docs/`. Il est bon de fournir au plugin une documentation complète. Dans cette section, je vais brièvement passer en revue comment créer votre propre documentation de plugin.

Le répertoire `docs/` est l'un des chemins d'exécution spéciaux de Vim. Vim lit tous les fichiers à l'intérieur de `docs/`, donc lorsque vous recherchez un mot-clé spécial et que ce mot-clé est trouvé dans l'un des fichiers du répertoire `docs/`, il s'affichera dans la page d'aide. Ici, vous avez un `totitle.txt`. Je l'ai nommé ainsi parce que c'est le nom du plugin, mais vous pouvez le nommer comme vous le souhaitez.

Un fichier de documentation Vim est un fichier txt à la base. La différence entre un fichier txt ordinaire et un fichier d'aide Vim est que ce dernier utilise des syntaxes "d'aide" spéciales. Mais d'abord, vous devez dire à Vim de le traiter non pas comme un type de fichier texte, mais comme un type de fichier `help`. Pour dire à Vim d'interpréter ce `totitle.txt` comme un fichier *d'aide*, exécutez `:set ft=help` (`:h 'filetype'` pour plus d'informations). Au fait, si vous voulez dire à Vim d'interpréter ce `totitle.txt` comme un fichier txt *ordinaire*, exécutez `:set ft=txt`.

### La Syntaxe Spéciale du Fichier d'Aide

Pour rendre un mot-clé découvrable, entourez ce mot-clé d'astérisques. Pour rendre le mot-clé `totitle` découvrable lorsque l'utilisateur recherche `:h totitle`, écrivez-le comme `*totitle*` dans le fichier d'aide.

Par exemple, j'ai ces lignes en haut de ma table des matières :

```shell
TABLE OF CONTENTS                                     *totitle*  *totitle-toc*

// plus de trucs TOC
```

Notez que j'ai utilisé deux mots-clés : `*totitle*` et `*totitle-toc*` pour marquer la section de la table des matières. Vous pouvez utiliser autant de mots-clés que vous le souhaitez. Cela signifie que chaque fois que vous recherchez `:h totitle` ou `:h totitle-toc`, Vim vous amène à cet emplacement.

Voici un autre exemple, quelque part dans le fichier :

```shell
2. Usage                                                       *totitle-usage*

// utilisation
```

Si vous recherchez `:h totitle-usage`, Vim vous amène à cette section.

Vous pouvez également utiliser des liens internes pour faire référence à une autre section dans le fichier d'aide en entourant un mot-clé de la syntaxe de barre `|`. Dans la section TOC, vous voyez des mots-clés entourés de barres, comme `|totitle-intro|`, `|totitle-usage|`, etc.

```shell
TABLE OF CONTENTS                                     *totitle*  *totitle-toc*

    1. Intro ........................... |totitle-intro|
    2. Usage ........................... |totitle-usage|
    3. Mots à capitaliser ............. |totitle-words|
    4. Opérateur ........................ |totitle-operator|
    5. Raccourci-clavier ................ |totitle-keybinding|
    6. Bugs ............................ |totitle-bug-report|
    7. Contribuer .................... |totitle-contributing|
    8. Crédits ......................... |totitle-credits|

```
Cela vous permet de sauter à la définition. Si vous placez votre curseur quelque part sur `|totitle-intro|` et que vous appuyez sur `Ctrl-]`, Vim sautera à la définition de ce mot. Dans ce cas, il sautera à l'emplacement `*totitle-intro*`. C'est ainsi que vous pouvez lier différents mots-clés dans un document d'aide.

Il n'y a pas de bonne ou de mauvaise façon d'écrire un fichier de documentation dans Vim. Si vous regardez différents plugins d'auteurs différents, beaucoup d'entre eux utilisent des formats différents. L'essentiel est de créer un document d'aide facile à comprendre pour vos utilisateurs.

Enfin, si vous écrivez votre propre plugin localement au début et que vous souhaitez tester la page de documentation, simplement ajouter un fichier txt à l'intérieur de `~/.vim/docs/` ne rendra pas automatiquement vos mots-clés recherchables. Vous devez indiquer à Vim d'ajouter votre page de documentation. Exécutez la commande helptags : `:helptags ~/.vim/doc` pour créer de nouveaux fichiers de balises. Maintenant, vous pouvez commencer à rechercher vos mots-clés.

## Conclusion

Vous êtes arrivé à la fin ! Ce chapitre est l'amalgame de tous les chapitres de Vimscript. Ici, vous mettez enfin en pratique ce que vous avez appris jusqu'à présent. J'espère qu'après avoir lu cela, vous avez compris non seulement comment créer des plugins Vim, mais aussi que cela vous a encouragé à écrire votre propre plugin.

Chaque fois que vous vous retrouvez à répéter la même séquence d'actions plusieurs fois, vous devriez essayer de créer le vôtre ! On dit qu'il ne faut pas réinventer la roue. Cependant, je pense qu'il peut être bénéfique de réinventer la roue pour le bien de l'apprentissage. Lisez les plugins des autres. Recréez-les. Apprenez d'eux. Écrivez le vôtre ! Qui sait, peut-être que vous écrirez le prochain plugin génial et super populaire après avoir lu cela. Peut-être que vous serez le prochain légendaire Tim Pope. Quand cela arrivera, faites-le moi savoir !