---
description: Ce document présente un aperçu des chemins d'exécution de Vim, expliquant
  leur utilisation et leur personnalisation pour améliorer l'expérience utilisateur.
title: Ch24. Vim Runtime
---

Dans les chapitres précédents, j'ai mentionné que Vim recherche automatiquement des chemins spéciaux comme `pack/` (Ch. 22) et `compiler/` (Ch. 19) dans le répertoire `~/.vim/`. Ce sont des exemples de chemins d'exécution de Vim.

Vim a plus de chemins d'exécution que ces deux-là. Dans ce chapitre, vous apprendrez un aperçu général de ces chemins d'exécution. L'objectif de ce chapitre est de vous montrer quand ils sont appelés. Savoir cela vous permettra de comprendre et de personnaliser davantage Vim.

## Chemin d'exécution

Sur une machine Unix, l'un de vos chemins d'exécution Vim est `$HOME/.vim/` (si vous avez un autre système d'exploitation comme Windows, votre chemin pourrait être différent). Pour voir quels sont les chemins d'exécution pour différents systèmes d'exploitation, consultez `:h 'runtimepath'`. Dans ce chapitre, j'utiliserai `~/.vim/` comme chemin d'exécution par défaut.

## Scripts de plugin

Vim a un chemin d'exécution de plugin qui exécute tous les scripts dans ce répertoire une fois chaque fois que Vim démarre. Ne confondez pas le nom "plugin" avec les plugins externes de Vim (comme NERDTree, fzf.vim, etc).

Allez dans le répertoire `~/.vim/` et créez un répertoire `plugin/`. Créez deux fichiers : `donut.vim` et `chocolate.vim`.

À l'intérieur de `~/.vim/plugin/donut.vim` :

```shell
echo "donut!"
```

À l'intérieur de `~/.vim/plugin/chocolate.vim` :

```shell
echo "chocolate!"
```

Maintenant, fermez Vim. La prochaine fois que vous démarrez Vim, vous verrez à la fois `"donut!"` et `"chocolate!"` affichés. Le chemin d'exécution du plugin peut être utilisé pour des scripts d'initialisation.

## Détection de type de fichier

Avant de commencer, pour vous assurer que ces détections fonctionnent, assurez-vous que votre vimrc contient au moins la ligne suivante :

```shell
filetype plugin indent on
```

Consultez `:h filetype-overview` pour plus de contexte. Essentiellement, cela active la détection de type de fichier de Vim.

Lorsque vous ouvrez un nouveau fichier, Vim sait généralement de quel type de fichier il s'agit. Si vous avez un fichier `hello.rb`, exécuter `:set filetype?` renvoie la réponse correcte `filetype=ruby`.

Vim sait comment détecter les types de fichiers "courants" (Ruby, Python, Javascript, etc). Mais que faire si vous avez un fichier personnalisé ? Vous devez apprendre à Vim à le détecter et à lui attribuer le bon type de fichier.

Il existe deux méthodes de détection : utiliser le nom de fichier et le contenu du fichier.

### Détection par nom de fichier

La détection par nom de fichier détecte un type de fichier en utilisant le nom de ce fichier. Lorsque vous ouvrez le fichier `hello.rb`, Vim sait que c'est un fichier Ruby grâce à l'extension `.rb`.

Il y a deux façons de faire la détection par nom de fichier : en utilisant le répertoire d'exécution `ftdetect/` et en utilisant le fichier d'exécution `filetype.vim`. Explorons les deux.

#### `ftdetect/`

Créons un fichier obscur (mais savoureux), `hello.chocodonut`. Lorsque vous l'ouvrez et que vous exécutez `:set filetype?`, comme ce n'est pas une extension de nom de fichier courante, Vim ne sait pas quoi en faire. Il renvoie `filetype=`.

Vous devez instruire Vim à définir tous les fichiers se terminant par `.chocodonut` comme un type de fichier "chocodonut". Créez un répertoire nommé `ftdetect/` dans la racine d'exécution (`~/.vim/`). À l'intérieur, créez un fichier et nommez-le `chocodonut.vim` (`~/.vim/ftdetect/chocodonut.vim`). À l'intérieur de ce fichier, ajoutez :

```shell
autocmd BufNewFile,BufRead *.chocodonut set filetype=chocodonut
```

`BufNewFile` et `BufRead` sont déclenchés chaque fois que vous créez un nouveau tampon et ouvrez un nouveau tampon. `*.chocodonut` signifie que cet événement ne sera déclenché que si le tampon ouvert a une extension de nom de fichier `.chocodonut`. Enfin, la commande `set filetype=chocodonut` définit le type de fichier comme étant un type chocodonut.

Redémarrez Vim. Maintenant, ouvrez le fichier `hello.chocodonut` et exécutez `:set filetype?`. Il renvoie `filetype=chocodonut`.

Délicieux ! Vous pouvez mettre autant de fichiers que vous le souhaitez à l'intérieur de `ftdetect/`. À l'avenir, vous pourrez peut-être ajouter `ftdetect/strawberrydonut.vim`, `ftdetect/plaindonut.vim`, etc., si vous décidez un jour d'élargir vos types de fichiers de donut.

Il existe en fait deux façons de définir un type de fichier dans Vim. L'une est ce que vous venez d'utiliser `set filetype=chocodonut`. L'autre façon est d'exécuter `setfiletype chocodonut`. La première commande `set filetype=chocodonut` définira *toujours* le type de fichier comme étant un type chocodonut, tandis que la seconde commande `setfiletype chocodonut` ne définira le type de fichier que si aucun type de fichier n'a encore été défini.

#### Fichier de type de fichier

La deuxième méthode de détection de fichier nécessite que vous créiez un `filetype.vim` dans le répertoire racine (`~/.vim/filetype.vim`). Ajoutez ceci à l'intérieur :

```shell
autocmd BufNewFile,BufRead *.plaindonut set filetype=plaindonut
```

Créez un fichier `hello.plaindonut`. Lorsque vous l'ouvrez et exécutez `:set filetype?`, Vim affiche le bon type de fichier personnalisé `filetype=plaindonut`.

Sainte pâtisserie, ça fonctionne ! Au fait, si vous jouez avec `filetype.vim`, vous remarquerez peut-être que ce fichier est exécuté plusieurs fois lorsque vous ouvrez `hello.plaindonut`. Pour éviter cela, vous pouvez ajouter une protection afin que le script principal ne soit exécuté qu'une seule fois. Mettez à jour le `filetype.vim` :

```shell
if exists("did_load_filetypes")
  finish
endif

augroup donutfiletypedetection
  autocmd! BufRead,BufNewFile *.plaindonut setfiletype plaindonut
augroup END
```

`finish` est une commande Vim pour arrêter l'exécution du reste du script. L'expression `"did_load_filetypes"` n'est *pas* une fonction intégrée de Vim. C'est en fait une variable globale à l'intérieur de `$VIMRUNTIME/filetype.vim`. Si vous êtes curieux, exécutez `:e $VIMRUNTIME/filetype.vim`. Vous trouverez ces lignes à l'intérieur :

```shell
if exists("did_load_filetypes")
  finish
endif

let did_load_filetypes = 1
```

Lorsque Vim appelle ce fichier, il définit la variable `did_load_filetypes` et la fixe à 1. 1 est vrai dans Vim. Vous devriez lire le reste de `filetype.vim` aussi. Voyez si vous pouvez comprendre ce qu'il fait lorsque Vim l'appelle.

### Script de type de fichier

Apprenons comment détecter et attribuer un type de fichier en fonction du contenu du fichier.

Supposons que vous ayez une collection de fichiers sans extension convenable. La seule chose que ces fichiers ont en commun est qu'ils commencent tous par le mot "donutify" sur la première ligne. Vous voulez attribuer ces fichiers à un type de fichier `donut`. Créez de nouveaux fichiers nommés `sugardonut`, `glazeddonut` et `frieddonut` (sans extension). À l'intérieur de chaque fichier, ajoutez cette ligne :

```shell
donutify
```

Lorsque vous exécutez `:set filetype?` depuis `sugardonut`, Vim ne sait pas quel type de fichier attribuer à ce fichier. Il renvoie `filetype=`.

Dans le chemin racine d'exécution, ajoutez un fichier `scripts.vim` (`~/.vim/scripts.vim`). À l'intérieur, ajoutez ceci :

```shell
if did_filetype()
  finish
endif

if getline(1) =~ '^\\<donutify\\>'
  setfiletype donut
endif
```

La fonction `getline(1)` renvoie le texte de la première ligne. Elle vérifie si la première ligne commence par le mot "donutify". La fonction `did_filetype()` est une fonction intégrée de Vim. Elle renverra vrai lorsqu'un événement lié au type de fichier est déclenché au moins une fois. Elle est utilisée comme protection pour arrêter la réexécution de l'événement de type de fichier.

Ouvrez le fichier `sugardonut` et exécutez `:set filetype?`, Vim renvoie maintenant `filetype=donut`. Si vous ouvrez d'autres fichiers donut (`glazeddonut` et `frieddonut`), Vim identifie également leurs types de fichiers comme étant des types donut.

Notez que `scripts.vim` n'est exécuté que lorsque Vim ouvre un fichier avec un type de fichier inconnu. Si Vim ouvre un fichier avec un type de fichier connu, `scripts.vim` ne s'exécutera pas.

## Plugin de type de fichier

Que faire si vous voulez que Vim exécute des scripts spécifiques aux chocodonut lorsque vous ouvrez un fichier chocodonut et ne pas exécuter ces scripts lors de l'ouverture d'un fichier plaindonut ?

Vous pouvez le faire avec le chemin d'exécution de plugin de type de fichier (`~/.vim/ftplugin/`). Vim recherche dans ce répertoire un fichier portant le même nom que le type de fichier que vous venez d'ouvrir. Créez un `chocodonut.vim` (`~/.vim/ftplugin/chocodonut.vim`) :

```shell
echo "Appel depuis le ftplugin chocodonut"
```

Créez un autre fichier ftplugin, `plaindonut.vim` (`~/.vim/ftplugin/plaindonut.vim`) :

```shell
echo "Appel depuis le ftplugin plaindonut"
```

Maintenant, chaque fois que vous ouvrez un fichier de type chocodonut, Vim exécute les scripts de `~/.vim/ftplugin/chocodonut.vim`. Chaque fois que vous ouvrez un fichier de type plaindonut, Vim exécute les scripts de `~/.vim/ftplugin/plaindonut.vim`.

Un avertissement : ces fichiers sont exécutés chaque fois qu'un type de fichier de tampon est défini (`set filetype=chocodonut` par exemple). Si vous ouvrez 3 fichiers chocodonut différents, les scripts seront exécutés un *total* de trois fois.

## Fichiers d'indentation

Vim a un chemin d'exécution d'indentation qui fonctionne de manière similaire à ftplugin, où Vim recherche un fichier nommé de la même manière que le type de fichier ouvert. Le but de ces chemins d'exécution d'indentation est de stocker des codes liés à l'indentation. Si vous avez le fichier `~/.vim/indent/chocodonut.vim`, il sera exécuté uniquement lorsque vous ouvrez un fichier de type chocodonut. Vous pouvez y stocker des codes liés à l'indentation pour les fichiers chocodonut.

## Couleurs

Vim a un chemin d'exécution de couleurs (`~/.vim/colors/`) pour stocker des thèmes de couleurs. Tout fichier qui va à l'intérieur du répertoire sera affiché dans la commande en ligne `:color`.

Si vous avez un fichier `~/.vim/colors/beautifulprettycolors.vim`, lorsque vous exécutez `:color` et appuyez sur Tab, vous verrez `beautifulprettycolors` comme l'une des options de couleur. Si vous préférez ajouter votre propre thème de couleur, c'est l'endroit où aller.

Si vous voulez consulter les thèmes de couleur créés par d'autres personnes, un bon endroit à visiter est [vimcolors](https://vimcolors.com/).

## Mise en surbrillance de la syntaxe

Vim a un chemin d'exécution de syntaxe (`~/.vim/syntax/`) pour définir la mise en surbrillance de la syntaxe.

Supposons que vous ayez un fichier `hello.chocodonut`, à l'intérieur duquel vous avez les expressions suivantes :

```shell
(donut "savoureux")
(donut "délicieux")
```

Bien que Vim sache maintenant le bon type de fichier, tous les textes ont la même couleur. Ajoutons une règle de mise en surbrillance de la syntaxe pour mettre en surbrillance le mot clé "donut". Créez un nouveau fichier de syntaxe chocodonut, `~/.vim/syntax/chocodonut.vim`. À l'intérieur, ajoutez :

```shell
syntax keyword donutKeyword donut

highlight link donutKeyword Keyword
```

Maintenant, rouvrez le fichier `hello.chocodonut`. Les mots clés `donut` sont maintenant mis en surbrillance.

Ce chapitre ne couvrira pas la mise en surbrillance de la syntaxe en profondeur. C'est un vaste sujet. Si vous êtes curieux, consultez `:h syntax.txt`.

Le plugin [vim-polyglot](https://github.com/sheerun/vim-polyglot) est un excellent plugin qui fournit des mises en surbrillance pour de nombreux langages de programmation populaires.

## Documentation

Si vous créez un plugin, vous devrez créer votre propre documentation. Vous utilisez le chemin d'exécution doc pour cela.

Créons une documentation de base pour les mots clés chocodonut et plaindonut. Créez un `donut.txt` (`~/.vim/doc/donut.txt`). À l'intérieur, ajoutez ces textes :

```shell
*chocodonut* Délicieux donut au chocolat

*plaindonut* Pas de bonté chocolatée mais toujours délicieux néanmoins
```

Si vous essayez de rechercher `chocodonut` et `plaindonut` (`:h chocodonut` et `:h plaindonut`), vous ne trouverez rien.

Tout d'abord, vous devez exécuter `:helptags` pour générer de nouvelles entrées d'aide. Exécutez `:helptags ~/.vim/doc/`

Maintenant, si vous exécutez `:h chocodonut` et `:h plaindonut`, vous trouverez ces nouvelles entrées d'aide. Remarquez que le fichier est maintenant en lecture seule et a un type de fichier "aide".
## Chargement Paresseux des Scripts

Tous les chemins d'exécution que vous avez appris dans ce chapitre ont été exécutés automatiquement. Si vous souhaitez charger un script manuellement, utilisez le chemin d'exécution autoload.

Créez un répertoire autoload (`~/.vim/autoload/`). À l'intérieur de ce répertoire, créez un nouveau fichier et nommez-le `tasty.vim` (`~/.vim/autoload/tasty.vim`). À l'intérieur :

```shell
echo "tasty.vim global"

function tasty#donut()
  echo "tasty#donut"
endfunction
```

Notez que le nom de la fonction est `tasty#donut`, pas `donut()`. Le signe dièse (`#`) est requis lors de l'utilisation de la fonction autoload. La convention de nommage des fonctions pour la fonction autoload est :

```shell
function fileName#functionName()
  ...
endfunction
```

Dans ce cas, le nom du fichier est `tasty.vim` et le nom de la fonction est (techniquement) `donut`.

Pour invoquer une fonction, vous avez besoin de la commande `call`. Appelons cette fonction avec `:call tasty#donut()`.

La première fois que vous appelez la fonction, vous devriez voir *les deux* messages echo ("tasty.vim global" et "tasty#donut"). Les appels suivants à la fonction `tasty#donut` afficheront uniquement le message echo "testy#donut".

Lorsque vous ouvrez un fichier dans Vim, contrairement aux chemins d'exécution précédents, les scripts autoload ne sont pas chargés automatiquement. Ce n'est que lorsque vous appelez explicitement `tasty#donut()`, que Vim recherche le fichier `tasty.vim` et charge tout ce qu'il contient, y compris la fonction `tasty#donut()`. Autoload est le mécanisme parfait pour les fonctions qui utilisent des ressources importantes mais que vous n'utilisez pas souvent.

Vous pouvez ajouter autant de répertoires imbriqués avec autoload que vous le souhaitez. Si vous avez le chemin d'exécution `~/.vim/autoload/one/two/three/tasty.vim`, vous pouvez appeler la fonction avec `:call one#two#three#tasty#donut()`.

## Scripts Après

Vim a un chemin d'exécution après (`~/.vim/after/`) qui reflète la structure de `~/.vim/`. Tout ce qui se trouve dans ce chemin est exécuté en dernier, donc les développeurs utilisent généralement ces chemins pour les remplacements de scripts.

Par exemple, si vous souhaitez remplacer les scripts de `plugin/chocolate.vim`, vous pouvez créer `~/.vim/after/plugin/chocolate.vim` pour y mettre les scripts de remplacement. Vim exécutera `~/.vim/after/plugin/chocolate.vim` *après* `~/.vim/plugin/chocolate.vim`.

## $VIMRUNTIME

Vim a une variable d'environnement `$VIMRUNTIME` pour les scripts par défaut et les fichiers de support. Vous pouvez le vérifier en exécutant `:e $VIMRUNTIME`.

La structure devrait vous sembler familière. Elle contient de nombreux chemins d'exécution que vous avez appris dans ce chapitre.

Rappelez-vous au Chapitre 21, vous avez appris que lorsque vous ouvrez Vim, il recherche des fichiers vimrc dans sept emplacements différents. J'ai dit que le dernier emplacement que Vim vérifie est `$VIMRUNTIME/defaults.vim`. Si Vim ne trouve aucun fichier vimrc utilisateur, Vim utilise un `defaults.vim` comme vimrc.

Avez-vous déjà essayé d'exécuter Vim sans plugin de syntaxe comme vim-polyglot et pourtant votre fichier est toujours mis en surbrillance syntaxiquement ? C'est parce que lorsque Vim ne trouve pas de fichier de syntaxe dans le chemin d'exécution, Vim recherche un fichier de syntaxe dans le répertoire de syntaxe de `$VIMRUNTIME`.

Pour en savoir plus, consultez `:h $VIMRUNTIME`.

## Option Runtimepath

Pour vérifier votre runtimepath, exécutez `:set runtimepath?`

Si vous utilisez Vim-Plug ou des gestionnaires de plugins externes populaires, cela devrait afficher une liste de répertoires. Par exemple, le mien affiche :

```shell
runtimepath=~/.vim,~/.vim/plugged/vim-signify,~/.vim/plugged/base16-vim,~/.vim/plugged/fzf.vim,~/.vim/plugged/fzf,~/.vim/plugged/vim-gutentags,~/.vim/plugged/tcomment_vim,~/.vim/plugged/emmet-vim,~/.vim/plugged/vim-fugitive,~/.vim/plugged/vim-sensible,~/.vim/plugged/lightline.vim, ...
```

Une des choses que font les gestionnaires de plugins est d'ajouter chaque plugin au chemin d'exécution. Chaque chemin d'exécution peut avoir sa propre structure de répertoire similaire à `~/.vim/`.

Si vous avez un répertoire `~/box/of/donuts/` et que vous souhaitez ajouter ce répertoire à votre chemin d'exécution, vous pouvez ajouter ceci à votre vimrc :

```shell
set rtp+=$HOME/box/of/donuts/
```

Si à l'intérieur de `~/box/of/donuts/`, vous avez un répertoire de plugin (`~/box/of/donuts/plugin/hello.vim`) et un ftplugin (`~/box/of/donuts/ftplugin/chocodonut.vim`), Vim exécutera tous les scripts de `plugin/hello.vim` lorsque vous ouvrirez Vim. Vim exécutera également `ftplugin/chocodonut.vim` lorsque vous ouvrirez un fichier chocodonut.

Essayez cela vous-même : créez un chemin arbitraire et ajoutez-le à votre runtimepath. Ajoutez certains des chemins d'exécution que vous avez appris dans ce chapitre. Assurez-vous qu'ils fonctionnent comme prévu.

## Apprendre le Runtime de Manière Intelligente

Prenez votre temps pour le lire et jouez avec ces chemins d'exécution. Pour voir comment les chemins d'exécution sont utilisés dans la pratique, allez dans le dépôt de l'un de vos plugins Vim préférés et étudiez sa structure de répertoire. Vous devriez être capable de comprendre la plupart d'entre eux maintenant. Essayez de suivre et de discerner la vue d'ensemble. Maintenant que vous comprenez la structure des répertoires de Vim, vous êtes prêt à apprendre Vimscript.