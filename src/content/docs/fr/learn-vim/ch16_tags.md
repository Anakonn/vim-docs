---
description: Ce document explique comment utiliser les tags dans Vim pour naviguer
  rapidement vers les définitions de code, facilitant ainsi la compréhension des bases
  de code.
title: Ch16. Tags
---

Une fonctionnalité utile dans l'édition de texte est de pouvoir accéder rapidement à n'importe quelle définition. Dans ce chapitre, vous apprendrez à utiliser les tags Vim pour cela.

## Aperçu des Tags

Supposons que quelqu'un vous ait remis un nouveau code :

```shell
one = One.new
one.donut
```

`One` ? `donut` ? Eh bien, cela pouvait sembler évident pour les développeurs qui écrivaient le code à l'époque, mais maintenant ces développeurs ne sont plus là et il vous revient de comprendre ces codes obscurs. Une façon d'aider à comprendre cela est de suivre le code source où `One` et `donut` sont définis.

Vous pouvez les rechercher avec `fzf` ou `grep` (ou `vimgrep`), mais dans ce cas, les tags sont plus rapides.

Pensez aux tags comme à un annuaire :

```shell
Nom    Adresse
Iggy1   1234 Cool St, 11111
Iggy2   9876 Awesome Ave, 2222
```

Au lieu d'avoir une paire nom-adresse, les tags stockent des définitions associées à des adresses.

Supposons que vous ayez ces deux fichiers Ruby dans le même répertoire :

```shell
## one.rb
class One
  def initialize
    puts "Initialized"
  end

  def donut
    puts "Bar"
  end
end
```

et

```shell
## two.rb
require './one'

one = One.new
one.donut
```

Pour sauter à une définition, vous pouvez utiliser `Ctrl-]` en mode normal. Dans `two.rb`, allez à la ligne où se trouve `one.donut` et déplacez le curseur sur `donut`. Appuyez sur `Ctrl-]`.

Oups, Vim n'a pas pu trouver le fichier de tags. Vous devez d'abord générer le fichier de tags.

## Générateur de Tags

Vim moderne ne vient pas avec un générateur de tags, donc vous devrez télécharger un générateur de tags externe. Il y a plusieurs options à choisir :

- ctags = uniquement C. Disponible presque partout.
- exuberant ctags = l'un des plus populaires. A beaucoup de support pour les langages.
- universal ctags = similaire à exuberant ctags, mais plus récent.
- etags = pour Emacs. Hmm...
- JTags = Java
- ptags.py = Python
- ptags = Perl
- gnatxref = Ada

Si vous regardez des tutoriels Vim en ligne, beaucoup recommanderont [exuberant ctags](http://ctags.sourceforge.net/). Il prend en charge [41 langages de programmation](http://ctags.sourceforge.net/languages.html). Je l'ai utilisé et ça a très bien fonctionné. Cependant, comme il n'a pas été maintenu depuis 2009, Universal ctags serait un meilleur choix. Il fonctionne de manière similaire à exuberant ctags et est actuellement maintenu.

Je ne vais pas entrer dans les détails sur la façon d'installer universal ctags. Consultez le dépôt [universal ctags](https://github.com/universal-ctags/ctags) pour plus d'instructions.

En supposant que vous ayez installé universal ctags, générons un fichier de tags de base. Exécutez :

```shell
ctags -R .
```

L'option `R` indique à ctags d'effectuer une analyse récursive depuis votre emplacement actuel (`.`). Vous devriez voir un fichier `tags` dans votre répertoire actuel. À l'intérieur, vous verrez quelque chose comme ceci :

```shell
!_TAG_FILE_FORMAT	2	/format étendu; --format=1 n'ajoutera pas ;" aux lignes/
!_TAG_FILE_SORTED	1	/0=non trié, 1=trié, 2=insensible à la casse/
!_TAG_OUTPUT_FILESEP	barre oblique	/barre oblique ou barre oblique inversée/
!_TAG_OUTPUT_MODE	u-ctags	/u-ctags ou e-ctags/
!_TAG_PATTERN_LENGTH_LIMIT	96	/0 pour pas de limite/
!_TAG_PROGRAM_AUTHOR	Équipe Universal Ctags	//
!_TAG_PROGRAM_NAME	Universal Ctags	/Derivé de Exuberant Ctags/
!_TAG_PROGRAM_URL	<https://ctags.io/>	/site officiel/
!_TAG_PROGRAM_VERSION	0.0.0	/b43eb39/
One	one.rb	/^class One$/;"	c
donut	one.rb	/^  def donut$/;"	f	class:One
initialize	one.rb	/^  def initialize$/;"	f	class:One
```

Le vôtre pourrait avoir un aspect légèrement différent selon vos paramètres Vim et le générateur de tags. Un fichier de tags est composé de deux parties : les métadonnées des tags et la liste des tags. Ces métadonnées (`!TAG_FILE...`) sont généralement contrôlées par le générateur de tags. Je ne vais pas en discuter ici, mais n'hésitez pas à consulter leur documentation pour plus d'informations ! La liste des tags est une liste de toutes les définitions indexées par ctags.

Maintenant, allez dans `two.rb`, placez le curseur sur `donut`, et tapez `Ctrl-]`. Vim vous amènera au fichier `one.rb` à la ligne où se trouve `def donut`. Succès ! Mais comment Vim a-t-il fait cela ?

## Anatomie des Tags

Regardons l'élément de tag `donut` :

```shell
donut	one.rb	/^  def donut$/;"	f	class:One
```

L'élément de tag ci-dessus est composé de quatre composants : un `tagname`, un `tagfile`, une `tagaddress`, et des options de tag.
- `donut` est le `tagname`. Lorsque votre curseur est sur "donut", Vim recherche dans le fichier de tags une ligne contenant la chaîne "donut".
- `one.rb` est le `tagfile`. Vim cherche un fichier `one.rb`.
- `/^ def donut$/` est la `tagaddress`. `/.../` est un indicateur de motif. `^` est un motif pour le premier élément d'une ligne. Il est suivi de deux espaces, puis de la chaîne `def donut`. Enfin, `$` est un motif pour le dernier élément d'une ligne.
- `f class:One` est l'option de tag qui indique à Vim que la fonction `donut` est une fonction (`f`) et fait partie de la classe `One`.

Regardons un autre élément de la liste des tags :

```shell
One	one.rb	/^class One$/;"	c
```

Cette ligne fonctionne de la même manière que le motif `donut` :

- `One` est le `tagname`. Notez qu'avec les tags, la première recherche est sensible à la casse. Si vous avez `One` et `one` dans la liste, Vim privilégiera `One` par rapport à `one`.
- `one.rb` est le `tagfile`. Vim cherche un fichier `one.rb`.
- `/^class One$/` est le motif `tagaddress`. Vim recherche une ligne qui commence par (`^`) `class` et se termine par (`$`) `One`.
- `c` est l'une des options de tag possibles. Comme `One` est une classe Ruby et non une procédure, elle est marquée avec un `c`.

Selon le générateur de tags que vous utilisez, le contenu de votre fichier de tags peut avoir un aspect différent. Au minimum, un fichier de tags doit avoir l'un de ces formats :

```shell
1.  {tagname} {TAB} {tagfile} {TAB} {tagaddress}
2.  {tagname} {TAB} {tagfile} {TAB} {tagaddress} {term} {field} ..
```

## Le Fichier de Tags

Vous avez appris qu'un nouveau fichier, `tags`, est créé après avoir exécuté `ctags -R .`. Comment Vim sait-il où chercher le fichier de tags ?

Si vous exécutez `:set tags?`, vous pourriez voir `tags=./tags,tags` (selon vos paramètres Vim, cela pourrait être différent). Ici, Vim cherche tous les tags dans le chemin du fichier actuel dans le cas de `./tags` et dans le répertoire actuel (la racine de votre projet) dans le cas de `tags`.

Aussi dans le cas de `./tags`, Vim cherchera d'abord un fichier de tags à l'intérieur du chemin de votre fichier actuel, peu importe à quel point il est imbriqué, puis il cherchera un fichier de tags dans le répertoire actuel (racine du projet). Vim s'arrête après avoir trouvé la première correspondance.

Si votre fichier `'tags'` avait dit `tags=./tags,tags,/user/iggy/mytags/tags`, alors Vim cherchera également dans le répertoire `/user/iggy/mytags` pour un fichier de tags après avoir terminé de rechercher dans les répertoires `./tags` et `tags`. Vous n'avez pas besoin de stocker votre fichier de tags à l'intérieur de votre projet, vous pouvez les garder séparés.

Pour ajouter un nouvel emplacement de fichier de tags, utilisez ce qui suit :

```shell
set tags+=path/to/my/tags/file
```

## Génération de Tags pour un Grand Projet

Si vous essayez d'exécuter ctags dans un grand projet, cela peut prendre beaucoup de temps car Vim regarde également à l'intérieur de chaque répertoire imbriqué. Si vous êtes un développeur Javascript, vous savez que `node_modules` peut être très volumineux. Imaginez si vous avez cinq sous-projets et que chacun contient son propre répertoire `node_modules`. Si vous exécutez `ctags -R .`, ctags essaiera de scanner tous les 5 `node_modules`. Vous n'avez probablement pas besoin d'exécuter ctags sur `node_modules`.

Pour exécuter ctags en excluant `node_modules`, exécutez :

```shell
ctags -R --exclude=node_modules .
```

Cette fois, cela devrait prendre moins d'une seconde. Au fait, vous pouvez utiliser l'option `exclude` plusieurs fois :

```shell
ctags -R --exclude=.git --exclude=vendor --exclude=node_modules --exclude=db --exclude=log .
```

Le point est, si vous souhaitez omettre un répertoire, `--exclude` est votre meilleur ami.

## Navigation dans les Tags

Vous pouvez obtenir un bon kilométrage en utilisant uniquement `Ctrl-]`, mais apprenons quelques astuces supplémentaires. La touche de saut de tag `Ctrl-]` a une alternative en mode ligne de commande : `:tag {tag-name}`. Si vous exécutez :

```shell
:tag donut
```

Vim sautera à la méthode `donut`, tout comme en faisant `Ctrl-]` sur la chaîne "donut". Vous pouvez également compléter l'argument avec `<Tab>` :

```shell
:tag d<Tab>
```

Vim liste tous les tags qui commencent par "d". Dans ce cas, "donut".

Dans un projet réel, vous pouvez rencontrer plusieurs méthodes avec le même nom. Mettons à jour les deux fichiers Ruby de tout à l'heure. Dans `one.rb` :

```shell
## one.rb
class One
  def initialize
    puts "Initialized"
  end

  def donut
    puts "one donut"
  end

  def pancake
    puts "one pancake"
  end
end
```

Dans `two.rb` :

```shell
## two.rb
require './one.rb'

def pancake
  "Two pancakes"
end

one = One.new
one.donut
puts pancake
```

Si vous codez en même temps, n'oubliez pas d'exécuter à nouveau `ctags -R .` car vous avez maintenant plusieurs nouvelles procédures. Vous avez deux instances de la procédure `pancake`. Si vous êtes dans `two.rb` et que vous appuyez sur `Ctrl-]`, que se passera-t-il ?

Vim sautera à `def pancake` à l'intérieur de `two.rb`, pas à `def pancake` à l'intérieur de `one.rb`. Cela est dû au fait que Vim considère la procédure `pancake` à l'intérieur de `two.rb` comme ayant une priorité plus élevée que l'autre procédure `pancake`.

## Priorité des Tags

Tous les tags ne sont pas égaux. Certains tags ont des priorités plus élevées. Si Vim est confronté à des noms d'éléments en double, Vim vérifie la priorité du mot-clé. L'ordre est :

1. Un tag statique entièrement correspondant dans le fichier actuel.
2. Un tag global entièrement correspondant dans le fichier actuel.
3. Un tag global entièrement correspondant dans un fichier différent.
4. Un tag statique entièrement correspondant dans un autre fichier.
5. Un tag statique correspondant sans tenir compte de la casse dans le fichier actuel.
6. Un tag global correspondant sans tenir compte de la casse dans le fichier actuel.
7. Un tag global correspondant sans tenir compte de la casse dans un fichier différent.
8. Un tag statique correspondant sans tenir compte de la casse dans le fichier actuel.

Selon la liste de priorité, Vim privilégie la correspondance exacte trouvée dans le même fichier. C'est pourquoi Vim choisit la procédure `pancake` à l'intérieur de `two.rb` plutôt que la procédure `pancake` à l'intérieur de `one.rb`. Il existe certaines exceptions à la liste de priorité ci-dessus en fonction de vos paramètres `'tagcase'`, `'ignorecase'`, et `'smartcase'`, mais je ne vais pas en discuter ici. Si vous êtes intéressé, consultez `:h tag-priority`.

## Sauts de Tags Sélectifs

Il serait agréable de pouvoir choisir quels éléments de tag sauter au lieu d'aller toujours vers l'élément de tag de la plus haute priorité. Peut-être que vous avez réellement besoin de sauter à la méthode `pancake` dans `one.rb` et non à celle dans `two.rb`. Pour ce faire, vous pouvez utiliser `:tselect`. Exécutez :

```shell
:tselect pancake
```

Vous verrez, en bas de l'écran :
## étiquette de type pri               fichier
1 F C f    pancake           two.rb
             def pancake
2 F   f    pancake           one.rb
             class:One
             def pancake
```

Si vous tapez 2, Vim sautera à la procédure dans `one.rb`. Si vous tapez 1, Vim sautera à la procédure dans `two.rb`.

Faites attention à la colonne `pri`. Vous avez `F C` sur la première correspondance et `F` sur la deuxième correspondance. C'est ce que Vim utilise pour déterminer la priorité de l'étiquette. `F C` signifie une étiquette globale entièrement correspondante (`F`) dans le fichier actuel (`C`). `F` signifie seulement une étiquette globale entièrement correspondante (`F`). `F C` a toujours une priorité plus élevée que `F`.

Si vous exécutez `:tselect donut`, Vim vous invite également à sélectionner quel élément d'étiquette sauter, même s'il n'y a qu'une seule option à choisir. Y a-t-il un moyen pour Vim d'inviter la liste des étiquettes uniquement s'il y a plusieurs correspondances et de sauter immédiatement s'il n'y a qu'une seule étiquette trouvée ?

Bien sûr ! Vim a une méthode `:tjump`. Exécutez :

```shell
:tjump donut
```

Vim sautera immédiatement à la procédure `donut` dans `one.rb`, tout comme en exécutant `:tag donut`. Maintenant exécutez :

```shell
:tjump pancake
```

Vim vous demandera des options d'étiquettes à choisir, tout comme en exécutant `:tselect pancake`. Avec `tjump`, vous obtenez le meilleur des deux méthodes.

Vim a une touche en mode normal pour `tjump` : `g Ctrl-]`. Personnellement, je préfère `g Ctrl-]` à `Ctrl-]`.

## Autocomplétion avec des Étiquettes

Les étiquettes peuvent aider aux autocomplétions. Rappelez-vous du chapitre 6, Mode d'insertion, que vous pouvez utiliser le sous-mode `Ctrl-X` pour faire diverses autocomplétions. Un sous-mode d'autocomplétion que je n'ai pas mentionné était `Ctrl-]`. Si vous faites `Ctrl-X Ctrl-]` en mode d'insertion, Vim utilisera le fichier d'étiquettes pour l'autocomplétion.

Si vous entrez en mode d'insertion et tapez `Ctrl-x Ctrl-]`, vous verrez :

```shell
One
donut
initialize
pancake
```

## Pile d'Étiquettes

Vim garde une liste de toutes les étiquettes auxquelles vous avez sauté et d'où dans une pile d'étiquettes. Vous pouvez voir cette pile avec `:tags`. Si vous avez d'abord sauté à l'étiquette `pancake`, suivi de `donut`, et exécuté `:tags`, vous verrez :

```shell
  # À l'étiquette         DE la ligne  dans le fichier/texte
  1  1 pancake            10  ch16_tags/two.rb
  2  1 donut               9  ch16_tags/two.rb
>
```

Notez le symbole `>` ci-dessus. Il montre votre position actuelle dans la pile. Pour "pop" la pile afin de revenir à une pile précédente, vous pouvez exécuter `:pop`. Essayez-le, puis exécutez `:tags` à nouveau :

```shell
  # À l'étiquette         DE la ligne  dans le fichier/texte
  1  1 pancake            10  puts pancake
> 2  1 donut               9  one.donut

```

Notez que le symbole `>` est maintenant sur la ligne deux, où se trouve le `donut`. Faites un `pop` une fois de plus, puis exécutez `:tags` à nouveau :

```shell
  # À l'étiquette         DE la ligne  dans le fichier/texte
> 1  1 pancake            10  puts pancake
  2  1 donut               9  one.donut
```

En mode normal, vous pouvez exécuter `Ctrl-t` pour obtenir le même effet que `:pop`.

## Génération Automatique d'Étiquettes

Un des plus grands inconvénients des étiquettes Vim est qu'à chaque fois que vous apportez un changement significatif, vous devez régénérer le fichier d'étiquettes. Si vous avez récemment renommé la procédure `pancake` en procédure `waffle`, le fichier d'étiquettes ne savait pas que la procédure `pancake` avait été renommée. Il stockait toujours `pancake` dans la liste des étiquettes. Vous devez exécuter `ctags -R .` pour créer un fichier d'étiquettes mis à jour. Recréer un nouveau fichier d'étiquettes de cette manière peut être fastidieux.

Heureusement, il existe plusieurs méthodes que vous pouvez utiliser pour générer des étiquettes automatiquement.

## Générer une Étiquette à la Sauvegarde

Vim a une méthode d'autocommande (`autocmd`) pour exécuter n'importe quelle commande lors d'un déclenchement d'événement. Vous pouvez utiliser cela pour générer des étiquettes à chaque sauvegarde. Exécutez :

```shell
:autocmd BufWritePost *.rb silent !ctags -R .
```

Détails :
- `autocmd` est une commande en ligne de commande. Elle accepte un événement, un motif de fichier et une commande.
- `BufWritePost` est un événement pour sauvegarder un tampon. Chaque fois que vous sauvegardez un fichier, vous déclenchez un événement `BufWritePost`.
- `.rb` est un motif de fichier pour les fichiers ruby.
- `silent` fait en fait partie de la commande que vous passez. Sans cela, Vim affichera `appuyez sur ENTER ou tapez une commande pour continuer` chaque fois que vous déclenchez l'autocommande.
- `!ctags -R .` est la commande à exécuter. Rappelez-vous que `!cmd` depuis l'intérieur de Vim exécute une commande terminale.

Maintenant, chaque fois que vous sauvegardez depuis un fichier ruby, Vim exécutera `ctags -R .`.

## Utilisation de Plugins

Il existe plusieurs plugins pour générer des ctags automatiquement :

- [vim-gutentags](https://github.com/ludovicchabant/vim-gutentags)
- [vim-tags](https://github.com/szw/vim-tags)
- [vim-easytags](https://github.com/xolox/vim-easytags)
- [vim-autotag](https://github.com/craigemery/vim-autotag)

J'utilise vim-gutentags. Il est simple à utiliser et fonctionnera dès la sortie de la boîte.

## Ctags et Hooks Git

Tim Pope, auteur de nombreux excellents plugins Vim, a écrit un blog suggérant d'utiliser des hooks git. [Découvrez-le](https://tbaggery.com/2011/08/08/effortless-ctags-with-git.html).

## Apprendre les Étiquettes de Manière Intelligente

Une étiquette est utile une fois configurée correctement. Supposons que vous soyez confronté à une nouvelle base de code et que vous souhaitiez comprendre ce que fait `functionFood`, vous pouvez facilement le lire en sautant à sa définition. À l'intérieur, vous apprenez qu'il appelle également `functionBreakfast`. Vous le suivez et vous apprenez qu'il appelle `functionPancake`. Votre graphique d'appels de fonction ressemble à ceci :

```shell
functionFood -> functionBreakfast -> functionPancake
```

Cela vous donne un aperçu que ce flux de code est lié à avoir un pancake pour le petit déjeuner.

Pour en savoir plus sur les étiquettes, consultez `:h tags`. Maintenant que vous savez comment utiliser les étiquettes, explorons une fonctionnalité différente : le repli.