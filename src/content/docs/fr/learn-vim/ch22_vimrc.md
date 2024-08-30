---
description: Ce document explique comment organiser et configurer le fichier vimrc
  dans Vim, en détaillant les emplacements où Vim recherche ce fichier de configuration.
title: Ch22. Vimrc
---

Dans les chapitres précédents, vous avez appris à utiliser Vim. Dans ce chapitre, vous apprendrez à organiser et configurer vimrc.

## Comment Vim Trouve Vimrc

La sagesse conventionnelle pour vimrc est d'ajouter un fichier dot `.vimrc` dans le répertoire personnel `~/.vimrc` (cela peut être différent selon votre système d'exploitation).

En arrière-plan, Vim vérifie plusieurs emplacements pour un fichier vimrc. Voici les emplacements que Vim vérifie :
- `$VIMINIT`
- `$HOME/.vimrc`
- `$HOME/.vim/vimrc`
- `$EXINIT`
- `$HOME/.exrc`
- `$VIMRUNTIME/defaults.vim`

Lorsque vous démarrez Vim, il vérifiera les six emplacements ci-dessus dans cet ordre pour un fichier vimrc. Le premier fichier vimrc trouvé sera utilisé et les autres seront ignorés.

D'abord, Vim cherchera un `$VIMINIT`. S'il n'y a rien là, Vim vérifiera `$HOME/.vimrc`. S'il n'y a rien là, Vim vérifiera `$HOME/.vim/vimrc`. Si Vim le trouve, il arrêtera de chercher et utilisera `$HOME/.vim/vimrc`.

Le premier emplacement, `$VIMINIT`, est une variable d'environnement. Par défaut, elle est indéfinie. Si vous souhaitez utiliser `~/dotfiles/testvimrc` comme valeur de votre `$VIMINIT`, vous pouvez créer une variable d'environnement contenant le chemin de ce vimrc. Après avoir exécuté `export VIMINIT='let $MYVIMRC="$HOME/dotfiles/testvimrc" | source $MYVIMRC'`, Vim utilisera maintenant `~/dotfiles/testvimrc` comme votre fichier vimrc.

Le deuxième emplacement, `$HOME/.vimrc`, est le chemin conventionnel pour de nombreux utilisateurs de Vim. `$HOME` est dans de nombreux cas votre répertoire personnel (`~`). Si vous avez un fichier `~/.vimrc`, Vim l'utilisera comme votre fichier vimrc.

Le troisième, `$HOME/.vim/vimrc`, est situé à l'intérieur du répertoire `~/.vim`. Vous pourriez déjà avoir le répertoire `~/.vim` pour vos plugins, scripts personnalisés ou fichiers View. Notez qu'il n'y a pas de point dans le nom du fichier vimrc (`$HOME/.vim/.vimrc` ne fonctionnera pas, mais `$HOME/.vim/vimrc` fonctionnera).

Le quatrième, `$EXINIT`, fonctionne de manière similaire à `$VIMINIT`.

Le cinquième, `$HOME/.exrc`, fonctionne de manière similaire à `$HOME/.vimrc`.

Le sixième, `$VIMRUNTIME/defaults.vim`, est le vimrc par défaut qui vient avec votre installation de Vim. Dans mon cas, j'ai installé Vim 8.2 en utilisant Homebrew, donc mon chemin est (`/usr/local/share/vim/vim82`). Si Vim ne trouve aucun des six fichiers vimrc précédents, il utilisera ce fichier.

Pour le reste de ce chapitre, je suppose que le vimrc utilise le chemin `~/.vimrc`.

## Que Mettre Dans Mon Vimrc ?

Une question que je me suis posée quand j'ai commencé était : "Que devrais-je mettre dans mon vimrc ?"

La réponse est : "tout ce que vous voulez". La tentation de copier-coller le vimrc des autres est réelle, mais vous devriez y résister. Si vous insistez pour utiliser le vimrc de quelqu'un d'autre, assurez-vous de savoir ce qu'il fait, pourquoi et comment il/elle l'utilise, et surtout, s'il est pertinent pour vous. Ce n'est pas parce que quelqu'un l'utilise que vous l'utiliserez aussi.

## Contenu de Base du Vimrc

En résumé, un vimrc est une collection de :
- Plugins
- Paramètres
- Fonctions Personnalisées
- Commandes Personnalisées
- Mappages

Il y a d'autres choses non mentionnées ci-dessus, mais en général, cela couvre la plupart des cas d'utilisation.

### Plugins

Dans les chapitres précédents, j'ai mentionné différents plugins, comme [fzf.vim](https://github.com/junegunn/fzf.vim), [vim-mundo](https://github.com/simnalamburt/vim-mundo), et [vim-fugitive](https://github.com/tpope/vim-fugitive).

Il y a dix ans, gérer des plugins était un cauchemar. Cependant, avec l'essor des gestionnaires de plugins modernes, l'installation de plugins peut désormais se faire en quelques secondes. J'utilise actuellement [vim-plug](https://github.com/junegunn/vim-plug) comme mon gestionnaire de plugins, donc je l'utiliserai dans cette section. Le concept devrait être similaire avec d'autres gestionnaires de plugins populaires. Je vous recommande fortement de jeter un œil à différents gestionnaires, tels que :
- [vundle.vim](https://github.com/VundleVim/Vundle.vim)
- [vim-pathogen](https://github.com/tpope/vim-pathogen)
- [dein.vim](https://github.com/Shougo/dein.vim)

Il existe plus de gestionnaires de plugins que ceux listés ci-dessus, n'hésitez pas à explorer. Pour installer vim-plug, si vous avez une machine Unix, exécutez :

```shell
curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

Pour ajouter de nouveaux plugins, placez vos noms de plugins (`Plug 'github-username/repository-name'`) entre les lignes `call plug#begin()` et `call plug#end()`. Donc, si vous souhaitez installer `emmet-vim` et `nerdtree`, mettez le snippet suivant dans votre vimrc :

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

Enregistrez les modifications, sourcez-le (`:source %`), et exécutez `:PlugInstall` pour les installer.

À l'avenir, si vous devez supprimer des plugins inutilisés, il vous suffit de retirer les noms des plugins du bloc `call`, d'enregistrer et de sourcer, puis d'exécuter la commande `:PlugClean` pour les supprimer de votre machine.

Vim 8 a ses propres gestionnaires de paquets intégrés. Vous pouvez consulter `:h packages` pour plus d'informations. Dans le prochain chapitre, je vous montrerai comment les utiliser.

### Paramètres

Il est courant de voir beaucoup d'options `set` dans n'importe quel vimrc. Si vous exécutez la commande set depuis le mode ligne de commande, ce n'est pas permanent. Vous le perdrez lorsque vous fermerez Vim. Par exemple, au lieu d'exécuter `:set relativenumber number` depuis le mode ligne de commande chaque fois que vous exécutez Vim, vous pourriez simplement mettre cela dans le vimrc :

```shell
set relativenumber number
```

Certaines options nécessitent que vous lui passiez une valeur, comme `set tabstop=2`. Consultez la page d'aide pour chaque option afin d'apprendre quels types de valeurs elle accepte.

Vous pouvez également utiliser un `let` au lieu de `set` (assurez-vous de le préfixer avec `&`). Avec `let`, vous pouvez utiliser une expression comme valeur. Par exemple, pour définir l'option `'dictionary'` à un chemin uniquement si le chemin existe :

```shell
let s:english_dict = "/usr/share/dict/words"

if filereadable(s:english_dict)
  let &dictionary=s:english_dict
endif
```

Vous apprendrez les affectations et conditionnelles Vimscript dans les chapitres suivants.

Pour une liste de toutes les options possibles dans Vim, consultez `:h E355`.

### Fonctions Personnalisées

Vimrc est un bon endroit pour les fonctions personnalisées. Vous apprendrez à écrire vos propres fonctions Vimscript dans un chapitre ultérieur.

### Commandes Personnalisées

Vous pouvez créer une commande de ligne de commande personnalisée avec `command`.

Pour créer une commande de base `GimmeDate` pour afficher la date d'aujourd'hui :

```shell
:command! GimmeDate echo call("strftime", ["%F"])
```

Lorsque vous exécutez `:GimmeDate`, Vim affichera une date comme "2021-01-1".

Pour créer une commande de base avec une entrée, vous pouvez utiliser `<args>`. Si vous souhaitez passer à `GimmeDate` un format de date/heure spécifique :

```shell
:command! GimmeDate echo call("strftime", [<args>])

:GimmeDate "%F"
" 2020-01-01

:GimmeDate "%H:%M"
" 11:30
```

Si vous souhaitez restreindre le nombre d'arguments, vous pouvez passer le drapeau `-nargs`. Utilisez `-nargs=0` pour ne passer aucun argument, `-nargs=1` pour passer un argument, `-nargs=+` pour passer au moins un argument, `-nargs=*` pour passer n'importe quel nombre d'arguments, et `-nargs=?` pour passer 0 ou un argument. Si vous souhaitez passer le n-ième argument, utilisez `-nargs=n` (où `n` est n'importe quel entier).

`<args>` a deux variantes : `<f-args>` et `<q-args>`. La première est utilisée pour passer des arguments aux fonctions Vimscript. La seconde est utilisée pour convertir automatiquement l'entrée utilisateur en chaînes.

Utilisation de `args` :

```shell
:command! -nargs=1 Hello echo "Hello " . <args>
:Hello "Iggy"
" renvoie 'Hello Iggy'

:Hello Iggy
" Erreur de variable indéfinie
```

Utilisation de `q-args` :

```shell
:command! -nargs=1 Hello echo "Hello " . <q-args>
:Hello Iggy
" renvoie 'Hello Iggy'
```

Utilisation de `f-args` :

```shell
:function! PrintHello(person1, person2)
:  echo "Hello " . a:person1 . " and " . a:person2
:endfunction

:command! -nargs=* Hello call PrintHello(<f-args>)

:Hello Iggy1 Iggy2
" renvoie "Hello Iggy1 and Iggy2"
```

Les fonctions ci-dessus auront beaucoup plus de sens une fois que vous arriverez au chapitre sur les fonctions Vimscript.

Pour en savoir plus sur les commandes et les args, consultez `:h command` et `:args`.
### Cartes

Si vous vous retrouvez à effectuer la même tâche complexe de manière répétée, c'est un bon indicateur que vous devriez créer un mappage pour cette tâche.

Par exemple, j'ai ces deux mappages dans mon vimrc :

```shell
nnoremap <silent> <C-f> :GFiles<CR>

nnoremap <Leader>tn :call ToggleNumber()<CR>
```

Pour le premier, je mappe `Ctrl-F` à la commande `:Gfiles` du plugin [fzf.vim](https://github.com/junegunn/fzf.vim) (recherche rapide de fichiers Git). Pour le second, je mappe `<Leader>tn` pour appeler une fonction personnalisée `ToggleNumber` (bascule les options `norelativenumber` et `relativenumber`). Le mappage `Ctrl-F` écrase le défilement de page natif de Vim. Votre mappage écrasera les contrôles de Vim s'ils entrent en collision. Comme je n'utilisais presque jamais cette fonctionnalité, j'ai décidé qu'il était sûr de l'écraser.

Au fait, qu'est-ce que cette touche "leader" dans `<Leader>tn` ?

Vim a une touche leader pour aider avec les mappages. Par exemple, j'ai mappé `<Leader>tn` pour exécuter la fonction `ToggleNumber()`. Sans la touche leader, j'utiliserais `tn`, mais Vim a déjà `t` (la navigation de recherche "till"). Avec la touche leader, je peux maintenant appuyer sur la touche assignée comme leader, puis `tn` sans interférer avec les commandes existantes. La touche leader est une touche que vous pouvez configurer pour commencer votre combinaison de mappage. Par défaut, Vim utilise la barre oblique inverse comme touche leader (donc `<Leader>tn` devient "barre oblique inverse-t-n").

Personnellement, j'aime utiliser `<Space>` comme touche leader au lieu de la barre oblique inverse par défaut. Pour changer votre touche leader, ajoutez ceci dans votre vimrc :

```shell
let mapleader = "\<space>"
```

La commande `nnoremap` utilisée ci-dessus peut être décomposée en trois parties :
- `n` représente le mode normal.
- `nore` signifie non-récursif.
- `map` est la commande de mappage.

Au minimum, vous auriez pu utiliser `nmap` au lieu de `nnoremap` (`nmap <silent> <C-f> :Gfiles<CR>`). Cependant, il est bon de pratiquer l'utilisation de la variante non-récursive pour éviter une boucle infinie potentielle.

Voici ce qui pourrait se passer si vous ne mappez pas de manière non-récursive. Supposons que vous souhaitiez ajouter un mappage à `B` pour ajouter un point-virgule à la fin de la ligne, puis revenir un MOT (rappelez-vous que `B` dans Vim est une touche de navigation en mode normal pour revenir en arrière d'un MOT).

```shell
nmap B A;<esc>B
```

Lorsque vous appuyez sur `B`... oh non ! Vim ajoute `;` de manière incontrôlable (interrompez-le avec `Ctrl-C`). Pourquoi cela est-il arrivé ? Parce que dans le mappage `A;<esc>B`, le `B` ne fait pas référence à la fonction native `B` de Vim (revenir en arrière d'un MOT), mais il fait référence à la fonction mappée. Ce que vous avez est en réalité ceci :

```shell
A;<esc>A;<esc>A;<esc>A;esc>...
```

Pour résoudre ce problème, vous devez ajouter un mappage non-récursif :

```shell
nnoremap B A;<esc>B
```

Essayez maintenant d'appeler `B` à nouveau. Cette fois, cela ajoute avec succès un `;` à la fin de la ligne et revient un MOT. Le `B` dans ce mappage représente la fonctionnalité originale de `B` de Vim.

Vim a différents mappages pour différents modes. Si vous souhaitez créer un mappage pour le mode insertion pour quitter le mode insertion lorsque vous appuyez sur `jk` :

```shell
inoremap jk <esc>
```

Les autres modes de mappage sont : `map` (Normal, Visuel, Sélection, et en attente d'Opérateur), `vmap` (Visuel et Sélection), `smap` (Sélection), `xmap` (Visuel), `omap` (en attente d'Opérateur), `map!` (Insertion et Ligne de commande), `lmap` (Insertion, Ligne de commande, Lang-arg), `cmap` (Ligne de commande), et `tmap` (travail terminal). Je ne les couvrirais pas en détail. Pour en savoir plus, consultez `:h map.txt`.

Créez un mappage qui soit le plus intuitif, cohérent et facile à retenir.

## Organisation du Vimrc

Avec le temps, votre vimrc deviendra grand et complexe. Il existe deux façons de garder votre vimrc propre :
- Divisez votre vimrc en plusieurs fichiers.
- Pliez votre fichier vimrc.

### Diviser Votre Vimrc

Vous pouvez diviser votre vimrc en plusieurs fichiers en utilisant la commande `source` de Vim. Cette commande lit les commandes de ligne de commande à partir de l'argument de fichier donné.

Créons un fichier dans le répertoire `~/.vim` et nommons-le `/settings` (`~/.vim/settings`). Le nom lui-même est arbitraire et vous pouvez le nommer comme vous le souhaitez.

Vous allez le diviser en quatre composants :
- Plugins tiers (`~/.vim/settings/plugins.vim`).
- Paramètres généraux (`~/.vim/settings/configs.vim`).
- Fonctions personnalisées (`~/.vim/settings/functions.vim`).
- Mappages de touches (`~/.vim/settings/mappings.vim`).

À l'intérieur de `~/.vimrc` :

```shell
source $HOME/.vim/settings/plugins.vim
source $HOME/.vim/settings/configs.vim
source $HOME/.vim/settings/functions.vim
source $HOME/.vim/settings/mappings.vim
```

Vous pouvez éditer ces fichiers en plaçant votre curseur sous le chemin et en appuyant sur `gf`.

À l'intérieur de `~/.vim/settings/plugins.vim` :

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

À l'intérieur de `~/.vim/settings/configs.vim` :

```shell
set nocompatible
set relativenumber
set number
```

À l'intérieur de `~/.vim/settings/functions.vim` :

```shell
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
```

À l'intérieur de `~/.vim/settings/mappings.vim` :

```shell
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
```

Votre vimrc devrait fonctionner comme d'habitude, mais maintenant il ne fait que quatre lignes !

Avec cette configuration, vous savez facilement où aller. Si vous avez besoin d'ajouter plus de mappages, ajoutez-les au fichier `/mappings.vim`. À l'avenir, vous pouvez toujours ajouter plus de répertoires à mesure que votre vimrc grandit. Par exemple, si vous devez créer un paramètre pour vos thèmes de couleurs, vous pouvez ajouter un `~/.vim/settings/themes.vim`.

### Garder Un Fichier Vimrc

Si vous préférez garder un seul fichier vimrc pour le rendre portable, vous pouvez utiliser les plis de marqueur pour le garder organisé. Ajoutez ceci en haut de votre vimrc :

```shell
" setup folds {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}
```

Vim peut détecter quel type de fichier le tampon actuel a (`:set filetype?`). S'il s'agit d'un type de fichier `vim`, vous pouvez utiliser une méthode de pliage de marqueur. Rappelez-vous qu'un pli de marqueur utilise `{{{` et `}}}` pour indiquer le début et la fin des plis.

Ajoutez des plis `{{{` et `}}}` au reste de votre vimrc (n'oubliez pas de les commenter avec `"`):

```shell
" setup folds {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}

" plugins {{{
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
" }}}

" configs {{{
set nocompatible
set relativenumber
set number
" }}}

" functions {{{
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
" }}}

" mappings {{{
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
" }}}
```

Votre vimrc devrait ressembler à ceci :

```shell
+-- 6 lignes : configuration des plis -----

+-- 6 lignes : plugins ---------

+-- 5 lignes : configurations ---------

+-- 9 lignes : fonctions -------

+-- 5 lignes : mappages --------
```

## Exécuter Vim Avec ou Sans Vimrc et Plugins

Si vous devez exécuter Vim sans vimrc ni plugins, exécutez :

```shell
vim -u NONE
```

Si vous devez lancer Vim sans vimrc mais avec des plugins, exécutez :

```shell
vim -u NORC
```

Si vous devez exécuter Vim avec vimrc mais sans plugins, exécutez :

```shell
vim --noplugin
```

Si vous devez exécuter Vim avec un vimrc *différent*, disons `~/.vimrc-backup`, exécutez :

```shell
vim -u ~/.vimrc-backup
```

Si vous devez exécuter Vim uniquement avec `defaults.vim` et sans plugins, ce qui est utile pour corriger un vimrc cassé, exécutez :

```shell
vim --clean
```

## Configurer Vimrc de Manière Intelligente

Vimrc est un composant important de la personnalisation de Vim. Une bonne façon de commencer à construire votre vimrc est de lire les vimrc d'autres personnes et de le construire progressivement au fil du temps. Le meilleur vimrc n'est pas celui que le développeur X utilise, mais celui qui est exactement adapté à votre cadre de pensée et à votre style d'édition.