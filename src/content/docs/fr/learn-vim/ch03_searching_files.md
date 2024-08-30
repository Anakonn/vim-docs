---
description: Ce chapitre présente une introduction à la recherche rapide dans Vim,
  sans plugins et avec le plugin fzf.vim, pour améliorer votre productivité.
title: Ch03. Searching Files
---

L'objectif de ce chapitre est de vous donner une introduction sur la façon de rechercher rapidement dans Vim. Être capable de rechercher rapidement est un excellent moyen de dynamiser votre productivité avec Vim. Lorsque j'ai compris comment rechercher des fichiers rapidement, j'ai décidé d'utiliser Vim à plein temps.

Ce chapitre est divisé en deux parties : comment rechercher sans plugins et comment rechercher avec le plugin [fzf.vim](https://github.com/junegunn/fzf.vim). Commençons !

## Ouverture et Édition de Fichiers

Pour ouvrir un fichier dans Vim, vous pouvez utiliser `:edit`.

```shell
:edit file.txt
```

Si `file.txt` existe, cela ouvre le tampon `file.txt`. Si `file.txt` n'existe pas, cela crée un nouveau tampon pour `file.txt`.

L'autocomplétion avec `<Tab>` fonctionne avec `:edit`. Par exemple, si votre fichier se trouve dans un répertoire de contrôleur *a*pp *c*ontroller *u*sers de [Rails](https://rubyonrails.org/) `./app/controllers/users_controllers.rb`, vous pouvez utiliser `<Tab>` pour développer les termes rapidement :

```shell
:edit a<Tab>c<Tab>u<Tab>
```

`:edit` accepte des arguments avec des jokers. `*` correspond à n'importe quel fichier dans le répertoire actuel. Si vous recherchez uniquement des fichiers avec l'extension `.yml` dans le répertoire actuel :

```shell
:edit *.yml<Tab>
```

Vim vous donnera une liste de tous les fichiers `.yml` dans le répertoire actuel parmi lesquels choisir.

Vous pouvez utiliser `**` pour rechercher de manière récursive. Si vous souhaitez rechercher tous les fichiers `*.md` dans votre projet, mais que vous n'êtes pas sûr dans quels répertoires, vous pouvez faire ceci :

```shell
:edit **/*.md<Tab>
```

`:edit` peut être utilisé pour exécuter `netrw`, l'explorateur de fichiers intégré de Vim. Pour ce faire, donnez à `:edit` un argument de répertoire au lieu d'un fichier :

```shell
:edit .
:edit test/unit/
```

## Recherche de Fichiers Avec Find

Vous pouvez trouver des fichiers avec `:find`. Par exemple :

```shell
:find package.json
:find app/controllers/users_controller.rb
```

L'autocomplétion fonctionne également avec `:find` :

```shell
:find p<Tab>                " pour trouver package.json
:find a<Tab>c<Tab>u<Tab>    " pour trouver app/controllers/users_controller.rb
```

Vous remarquerez peut-être que `:find` ressemble à `:edit`. Quelle est la différence ?

## Find et Path

La différence est que `:find` trouve des fichiers dans `path`, `:edit` ne le fait pas. Apprenons un peu sur `path`. Une fois que vous avez appris à modifier vos chemins, `:find` peut devenir un outil de recherche puissant. Pour vérifier quels sont vos chemins, faites :

```shell
:set path?
```

Par défaut, les vôtres ressemblent probablement à ceci :

```shell
path=.,/usr/include,,
```

- `.` signifie rechercher dans le répertoire du fichier actuellement ouvert.
- `,` signifie rechercher dans le répertoire actuel.
- `/usr/include` est le répertoire typique pour les fichiers d'en-tête des bibliothèques C.

Les deux premiers sont importants dans notre contexte et le troisième peut être ignoré pour l'instant. L'essentiel ici est que vous pouvez modifier vos propres chemins, où Vim cherchera des fichiers. Supposons que ceci soit la structure de votre projet :

```shell
app/
  assets/
  controllers/
    application_controller.rb
    comments_controller.rb
    users_controller.rb
    ...
```

Si vous voulez aller à `users_controller.rb` depuis le répertoire racine, vous devez passer par plusieurs répertoires (et appuyer sur un nombre considérable de tabulations). Souvent, lorsque vous travaillez avec un framework, vous passez 90 % de votre temps dans un répertoire particulier. Dans cette situation, vous ne vous souciez que d'aller au répertoire `controllers/` avec le moins de frappes possible. Le paramètre `path` peut raccourcir ce trajet.

Vous devez ajouter `app/controllers/` au `path` actuel. Voici comment vous pouvez le faire :

```shell
:set path+=app/controllers/
```

Maintenant que votre chemin est mis à jour, lorsque vous tapez `:find u<Tab>`, Vim recherchera maintenant dans le répertoire `app/controllers/` pour les fichiers commençant par "u".

Si vous avez un répertoire `controllers/` imbriqué, comme `app/controllers/account/users_controller.rb`, Vim ne trouvera pas `users_controllers`. Au lieu de cela, vous devez ajouter `:set path+=app/controllers/**` afin que l'autocomplétion trouve `users_controller.rb`. C'est génial ! Maintenant, vous pouvez trouver le contrôleur des utilisateurs avec 1 pression de tab au lieu de 3.

Vous pourriez penser à ajouter tous les répertoires du projet afin que lorsque vous appuyez sur `tab`, Vim recherche partout ce fichier, comme ceci :

```shell
:set path+=$PWD/**
```

`$PWD` est le répertoire de travail actuel. Si vous essayez d'ajouter l'ensemble de votre projet au `path` en espérant rendre tous les fichiers accessibles lors d'une pression sur `tab`, bien que cela puisse fonctionner pour un petit projet, cela ralentira considérablement votre recherche si vous avez un grand nombre de fichiers dans votre projet. Je recommande d'ajouter uniquement le `path` de vos fichiers / répertoires les plus visités.

Vous pouvez ajouter `set path+={votre-chemin-ici}` dans votre vimrc. Mettre à jour `path` ne prend que quelques secondes et le faire peut vous faire gagner beaucoup de temps.

## Recherche dans les Fichiers Avec Grep

Si vous devez rechercher dans des fichiers (trouver des phrases dans des fichiers), vous pouvez utiliser grep. Vim a deux façons de le faire :

- Grep interne (`:vim`. Oui, cela s'écrit `:vim`. C'est l'abréviation de `:vimgrep`).
- Grep externe (`:grep`).

Commençons par le grep interne. `:vim` a la syntaxe suivante :

```shell
:vim /pattern/ file
```

- `/pattern/` est un motif regex de votre terme de recherche.
- `file` est l'argument de fichier. Vous pouvez passer plusieurs arguments. Vim recherchera le motif à l'intérieur de l'argument de fichier. Comme avec `:find`, vous pouvez lui passer des jokers `*` et `**`.

Par exemple, pour rechercher toutes les occurrences de la chaîne "breakfast" dans tous les fichiers ruby (`.rb`) dans le répertoire `app/controllers/` :

```shell
:vim /breakfast/ app/controllers/**/*.rb
```

Après avoir exécuté cela, vous serez redirigé vers le premier résultat. La commande de recherche `vim` de Vim utilise l'opération `quickfix`. Pour voir tous les résultats de recherche, exécutez `:copen`. Cela ouvre une fenêtre `quickfix`. Voici quelques commandes `quickfix` utiles pour vous rendre productif immédiatement :

```shell
:copen        Ouvrir la fenêtre quickfix
:cclose       Fermer la fenêtre quickfix
:cnext        Aller à l'erreur suivante
:cprevious    Aller à l'erreur précédente
:colder       Aller à l'ancienne liste d'erreurs
:cnewer       Aller à la nouvelle liste d'erreurs
```

Pour en savoir plus sur quickfix, consultez `:h quickfix`.

Vous remarquerez peut-être que l'exécution de grep interne (`:vim`) peut devenir lente si vous avez un grand nombre de correspondances. Cela est dû au fait que Vim charge chaque fichier correspondant en mémoire, comme s'il était en cours d'édition. Si Vim trouve un grand nombre de fichiers correspondant à votre recherche, il les chargera tous et consommera donc une grande quantité de mémoire.

Parlons maintenant de grep externe. Par défaut, il utilise la commande terminal `grep`. Pour rechercher "lunch" dans un fichier ruby dans le répertoire `app/controllers/`, vous pouvez faire ceci :

```shell
:grep -R "lunch" app/controllers/
```

Notez qu'au lieu d'utiliser `/pattern/`, il suit la syntaxe de grep terminal `"pattern"`. Il affiche également toutes les correspondances en utilisant `quickfix`.

Vim définit la variable `grepprg` pour déterminer quel programme externe exécuter lors de l'exécution de la commande `:grep` de Vim afin que vous n'ayez pas à quitter Vim et à invoquer la commande terminal `grep`. Plus tard, je vous montrerai comment changer le programme par défaut invoqué lors de l'utilisation de la commande `:grep` de Vim.

## Navigation dans les Fichiers Avec Netrw

`netrw` est l'explorateur de fichiers intégré de Vim. Il est utile pour voir la hiérarchie d'un projet. Pour exécuter `netrw`, vous avez besoin de ces deux paramètres dans votre `.vimrc` :

```shell
set nocp
filetype plugin on
```

Comme `netrw` est un sujet vaste, je ne couvrirai que l'utilisation de base, mais cela devrait suffire pour vous aider à démarrer. Vous pouvez démarrer `netrw` lorsque vous lancez Vim en lui passant un répertoire comme paramètre au lieu d'un fichier. Par exemple :

```shell
vim .
vim src/client/
vim app/controllers/
```

Pour lancer `netrw` depuis l'intérieur de Vim, vous pouvez utiliser la commande `:edit` et lui passer un paramètre de répertoire au lieu d'un nom de fichier :

```shell
:edit .
:edit src/client/
:edit app/controllers/
```

Il existe d'autres façons de lancer la fenêtre `netrw` sans passer de répertoire :

```shell
:Explore     Démarre netrw sur le fichier actuel
:Sexplore    Pas de blague. Démarre netrw sur la moitié supérieure de l'écran
:Vexplore    Démarre netrw sur la moitié gauche de l'écran
```

Vous pouvez naviguer dans `netrw` avec les mouvements Vim (les mouvements seront couverts en profondeur dans un chapitre ultérieur). Si vous devez créer, supprimer ou renommer un fichier ou un répertoire, voici une liste de commandes `netrw` utiles :

```shell
%    Créer un nouveau fichier
d    Créer un nouveau répertoire
R    Renommer un fichier ou un répertoire
D    Supprimer un fichier ou un répertoire
```

`:h netrw` est très complet. Consultez-le si vous avez le temps.

Si vous trouvez `netrw` trop fade et avez besoin de plus de saveur, [vim-vinegar](https://github.com/tpope/vim-vinegar) est un bon plugin pour améliorer `netrw`. Si vous recherchez un autre explorateur de fichiers, [NERDTree](https://github.com/preservim/nerdtree) est une bonne alternative. Consultez-les !

## Fzf

Maintenant que vous avez appris à rechercher des fichiers dans Vim avec des outils intégrés, apprenons à le faire avec des plugins.

Une chose que les éditeurs de texte modernes font bien et que Vim n'a pas, c'est la facilité de trouver des fichiers, en particulier via la recherche floue. Dans cette seconde moitié du chapitre, je vais vous montrer comment utiliser [fzf.vim](https://github.com/junegunn/fzf.vim) pour rendre la recherche dans Vim facile et puissante.

## Configuration

Tout d'abord, assurez-vous d'avoir téléchargé [fzf](https://github.com/junegunn/fzf) et [ripgrep](https://github.com/BurntSushi/ripgrep). Suivez les instructions sur leur dépôt github. Les commandes `fzf` et `rg` devraient maintenant être disponibles après des installations réussies.

Ripgrep est un outil de recherche très similaire à grep (d'où son nom). Il est généralement plus rapide que grep et possède de nombreuses fonctionnalités utiles. Fzf est un outil de recherche floue en ligne de commande polyvalent. Vous pouvez l'utiliser avec n'importe quelle commande, y compris ripgrep. Ensemble, ils forment une combinaison d'outils de recherche puissante.

Fzf n'utilise pas ripgrep par défaut, donc nous devons dire à fzf d'utiliser ripgrep en définissant une variable `FZF_DEFAULT_COMMAND`. Dans mon `.zshrc` (`.bashrc` si vous utilisez bash), j'ai ceci :

```shell
if type rg &> /dev/null; then
  export FZF_DEFAULT_COMMAND='rg --files'
  export FZF_DEFAULT_OPTS='-m'
fi
```

Faites attention à `-m` dans `FZF_DEFAULT_OPTS`. Cette option nous permet de faire plusieurs sélections avec `<Tab>` ou `<Shift-Tab>`. Vous n'avez pas besoin de cette ligne pour faire fonctionner fzf avec Vim, mais je pense que c'est une option utile à avoir. Elle sera pratique lorsque vous voudrez effectuer une recherche et un remplacement dans plusieurs fichiers, ce que je vais couvrir dans un instant. La commande fzf accepte de nombreuses autres options, mais je ne les couvrirais pas ici. Pour en savoir plus, consultez [le dépôt de fzf](https://github.com/junegunn/fzf#usage) ou `man fzf`. Au minimum, vous devriez avoir `export FZF_DEFAULT_COMMAND='rg'`.

Après avoir installé fzf et ripgrep, configurons le plugin fzf. J'utilise le gestionnaire de plugins [vim-plug](https://github.com/junegunn/vim-plug) dans cet exemple, mais vous pouvez utiliser n'importe quel gestionnaire de plugins.

Ajoutez ceci dans vos plugins `.vimrc`. Vous devez utiliser le plugin [fzf.vim](https://github.com/junegunn/fzf.vim) (créé par le même auteur que fzf).

```shell
call plug#begin()
Plug 'junegunn/fzf.vim'
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
call plug#end()
```

Après avoir ajouté ces lignes, vous devrez ouvrir `vim` et exécuter `:PlugInstall`. Cela installera tous les plugins qui sont définis dans votre fichier `vimrc` et qui ne sont pas installés. Dans notre cas, cela installera `fzf.vim` et `fzf`.

Pour plus d'informations sur ce plugin, vous pouvez consulter [le dépôt de fzf.vim](https://github.com/junegunn/fzf/blob/master/README-VIM.md).
## Syntaxe Fzf

Pour utiliser fzf efficacement, vous devez apprendre quelques syntaxes de base de fzf. Heureusement, la liste est courte :

- `^` est une correspondance exacte par préfixe. Pour rechercher une phrase commençant par "welcome" : `^welcome`.
- `$` est une correspondance exacte par suffixe. Pour rechercher une phrase se terminant par "my friends" : `friends$`.
- `'` est une correspondance exacte. Pour rechercher la phrase "welcome my friends" : `'welcome my friends`.
- `|` est une correspondance "ou". Pour rechercher soit "friends" soit "foes" : `friends | foes`.
- `!` est une correspondance inverse. Pour rechercher une phrase contenant "welcome" et non "friends" : `welcome !friends`

Vous pouvez combiner ces options. Par exemple, `^hello | ^welcome friends$` recherchera la phrase commençant par "welcome" ou "hello" et se terminant par "friends".

## Recherche de fichiers

Pour rechercher des fichiers dans Vim en utilisant le plugin fzf.vim, vous pouvez utiliser la méthode `:Files`. Exécutez `:Files` depuis Vim et vous serez invité avec l'invite de recherche fzf.

Puisque vous utiliserez cette commande fréquemment, il est bon de l'associer à un raccourci clavier. Je l'associe à `Ctrl-f`. Dans mon vimrc, j'ai ceci :

```shell
nnoremap <silent> <C-f> :Files<CR>
```

## Recherche dans les fichiers

Pour rechercher à l'intérieur des fichiers, vous pouvez utiliser la commande `:Rg`.

Encore une fois, puisque vous l'utiliserez probablement fréquemment, associons-la à un raccourci clavier. Je l'associe à `<Leader>f`. La touche `<Leader>` est mappée par défaut sur `\`.

```shell
nnoremap <silent> <Leader>f :Rg<CR>
```

## Autres recherches

Fzf.vim fournit de nombreuses autres commandes de recherche. Je ne vais pas passer en revue chacune d'elles ici, mais vous pouvez les consulter [ici](https://github.com/junegunn/fzf.vim#commands).

Voici à quoi ressemblent mes mappages fzf :

```shell
nnoremap <silent> <Leader>b :Buffers<CR>
nnoremap <silent> <C-f> :Files<CR>
nnoremap <silent> <Leader>f :Rg<CR>
nnoremap <silent> <Leader>/ :BLines<CR>
nnoremap <silent> <Leader>' :Marks<CR>
nnoremap <silent> <Leader>g :Commits<CR>
nnoremap <silent> <Leader>H :Helptags<CR>
nnoremap <silent> <Leader>hh :History<CR>
nnoremap <silent> <Leader>h: :History:<CR>
nnoremap <silent> <Leader>h/ :History/<CR>
```

## Remplacer Grep par Rg

Comme mentionné précédemment, Vim a deux façons de rechercher dans les fichiers : `:vim` et `:grep`. `:grep` utilise un outil de recherche externe que vous pouvez réaffecter à l'aide du mot-clé `grepprg`. Je vais vous montrer comment configurer Vim pour utiliser ripgrep au lieu de grep terminal lors de l'exécution de la commande `:grep`.

Maintenant, configurons `grepprg` afin que la commande `:grep` de Vim utilise ripgrep. Ajoutez ceci dans votre vimrc :

```shell
set grepprg=rg\ --vimgrep\ --smart-case\ --follow
```

N'hésitez pas à modifier certaines des options ci-dessus ! Pour plus d'informations sur ce que signifient les options ci-dessus, consultez `man rg`.

Après avoir mis à jour `grepprg`, maintenant lorsque vous exécutez `:grep`, cela exécute `rg --vimgrep --smart-case --follow` au lieu de `grep`. Si vous voulez rechercher "donut" en utilisant ripgrep, vous pouvez maintenant exécuter une commande plus succincte `:grep "donut"` au lieu de `:grep "donut" . -R`.

Tout comme l'ancien `:grep`, ce nouveau `:grep` utilise également quickfix pour afficher les résultats.

Vous vous demandez peut-être : "Eh bien, c'est bien mais je n'ai jamais utilisé `:grep` dans Vim, de plus, ne puis-je pas simplement utiliser `:Rg` pour trouver des phrases dans les fichiers ? Quand aurais-je besoin d'utiliser `:grep` ?

C'est une très bonne question. Vous pourriez avoir besoin d'utiliser `:grep` dans Vim pour effectuer des recherches et des remplacements dans plusieurs fichiers, ce que je vais couvrir ensuite.

## Rechercher et remplacer dans plusieurs fichiers

Les éditeurs de texte modernes comme VSCode rendent très facile la recherche et le remplacement d'une chaîne dans plusieurs fichiers. Dans cette section, je vais vous montrer deux méthodes différentes pour le faire facilement dans Vim.

La première méthode consiste à remplacer *toutes* les phrases correspondantes dans votre projet. Vous devrez utiliser `:grep`. Si vous souhaitez remplacer toutes les occurrences de "pizza" par "donut", voici ce que vous devez faire :

```shell
:grep "pizza"
:cfdo %s/pizza/donut/g | update
```

Décomposons les commandes :

1. `:grep pizza` utilise ripgrep pour rechercher toutes les occurrences de "pizza" (au fait, cela fonctionnerait toujours même si vous n'aviez pas réaffecté `grepprg` pour utiliser ripgrep. Vous devriez faire `:grep "pizza" . -R` au lieu de `:grep "pizza"`).
2. `:cfdo` exécute toute commande que vous passez à tous les fichiers de votre liste quickfix. Dans ce cas, votre commande est la commande de substitution `%s/pizza/donut/g`. Le pipe (`|`) est un opérateur de chaîne. La commande `update` enregistre chaque fichier après substitution. Je couvrirais la commande de substitution plus en profondeur dans un chapitre ultérieur.

La deuxième méthode consiste à rechercher et remplacer dans des fichiers sélectionnés. Avec cette méthode, vous pouvez choisir manuellement les fichiers sur lesquels vous souhaitez effectuer la sélection et le remplacement. Voici ce que vous devez faire :

1. Effacez d'abord vos tampons. Il est impératif que votre liste de tampons contienne uniquement les fichiers sur lesquels vous souhaitez appliquer le remplacement. Vous pouvez soit redémarrer Vim, soit exécuter la commande `:%bd | e#` (`%bd` supprime tous les tampons et `e#` ouvre le fichier sur lequel vous étiez juste avant).
2. Exécutez `:Files`.
3. Sélectionnez tous les fichiers sur lesquels vous souhaitez effectuer la recherche et le remplacement. Pour sélectionner plusieurs fichiers, utilisez `<Tab>` / `<Shift-Tab>`. Cela n'est possible que si vous avez le drapeau multiple (`-m`) dans `FZF_DEFAULT_OPTS`.
4. Exécutez `:bufdo %s/pizza/donut/g | update`. La commande `:bufdo %s/pizza/donut/g | update` ressemble à la commande précédente `:cfdo %s/pizza/donut/g | update`. La différence est qu'au lieu de substituer toutes les entrées quickfix (`:cfdo`), vous substituez toutes les entrées de tampon (`:bufdo`).

## Apprendre à rechercher de manière intelligente

La recherche est la base de l'édition de texte. Apprendre à bien rechercher dans Vim améliorera considérablement votre flux de travail d'édition de texte.

Fzf.vim est un changeur de jeu. Je ne peux pas imaginer utiliser Vim sans cela. Je pense qu'il est très important d'avoir un bon outil de recherche lorsque vous commencez avec Vim. J'ai vu des gens avoir du mal à passer à Vim parce qu'il semble manquer des fonctionnalités critiques que les éditeurs de texte modernes ont, comme une fonction de recherche facile et puissante. J'espère que ce chapitre vous aidera à faciliter la transition vers Vim.

Vous venez également de voir l'extensibilité de Vim en action - la capacité d'étendre la fonctionnalité de recherche avec un plugin et un programme externe. À l'avenir, gardez à l'esprit quelles autres fonctionnalités vous souhaitez étendre dans Vim. Il y a de fortes chances que ce soit déjà dans Vim, que quelqu'un ait créé un plugin ou qu'il existe déjà un programme pour cela. Ensuite, vous apprendrez un sujet très important dans Vim : la grammaire de Vim.