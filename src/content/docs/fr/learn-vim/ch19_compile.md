---
description: Ce document explique comment compiler des fichiers depuis Vim, en utilisant
  la commande `:make` et en créant un makefile pour simplifier le processus.
title: Ch19. Compile
---

Compiler est un sujet important pour de nombreux langages. Dans ce chapitre, vous apprendrez comment compiler depuis Vim. Vous examinerez également des moyens de tirer parti de la commande `:make` de Vim.

## Compiler depuis la ligne de commande

Vous pouvez utiliser l'opérateur bang (`!`) pour compiler. Si vous devez compiler votre fichier `.cpp` avec `g++`, exécutez :

```shell
:!g++ hello.cpp -o hello
```

Cependant, devoir taper manuellement le nom du fichier et le nom du fichier de sortie à chaque fois est sujet à des erreurs et fastidieux. Un makefile est la solution.

## La commande Make

Vim dispose d'une commande `:make` pour exécuter un makefile. Lorsque vous l'exécutez, Vim recherche un makefile dans le répertoire actuel à exécuter.

Créez un fichier nommé `makefile` dans le répertoire actuel et mettez-y ceci :

```shell
all:
	echo "Hello all"
foo:
	echo "Hello foo"
list_pls:
	ls
```

Exécutez ceci depuis Vim :

```shell
:make
```

Vim l'exécute de la même manière que lorsque vous l'exécutez depuis le terminal. La commande `:make` accepte des paramètres tout comme la commande make du terminal. Exécutez :

```shell
:make foo
" Affiche "Hello foo"

:make list_pls
" Affiche le résultat de la commande ls
```

La commande `:make` utilise le quickfix de Vim pour stocker toute erreur si vous exécutez une mauvaise commande. Exécutons une cible non existante :

```shell
:make dontexist
```

Vous devriez voir une erreur en exécutant cette commande. Pour voir cette erreur, exécutez la commande quickfix `:copen` pour afficher la fenêtre quickfix :

```shell
|| make: *** No rule to make target `dontexist'.  Stop.
```

## Compiler avec Make

Utilisons le makefile pour compiler un programme `.cpp` basique. Tout d'abord, créons un fichier `hello.cpp` :

```shell
#include <iostream>

int main() {
    std::cout << "Hello!\n";
    return 0;
}
```

Mettez à jour votre makefile pour construire et exécuter un fichier `.cpp` :

```shell
all:
	echo "build, run"
build:
	g++ hello.cpp -o hello
run:
	./hello
```

Maintenant exécutez :

```shell
:make build
```

Le `g++` compile `./hello.cpp` et crée `./hello`. Ensuite, exécutez :

```shell
:make run
```

Vous devriez voir `"Hello!"` affiché dans le terminal.

## Différent programme Make

Lorsque vous exécutez `:make`, Vim exécute en réalité n'importe quelle commande qui est définie sous l'option `makeprg`. Si vous exécutez `:set makeprg?`, vous verrez :

```shell
makeprg=make
```

La commande `:make` par défaut est la commande externe `make`. Pour changer la commande `:make` pour exécuter `g++ {votre-nom-de-fichier}` chaque fois que vous l'exécutez, exécutez :

```shell
:set makeprg=g++\ %
```

Le `\` est pour échapper l'espace après `g++`. Le symbole `%` dans Vim représente le fichier actuel. La commande `g++\\ %` est équivalente à exécuter `g++ hello.cpp`.

Allez dans `./hello.cpp` puis exécutez `:make`. Vim compile `hello.cpp` et crée `a.out` car vous n'avez pas spécifié la sortie. Refactorisons-le pour qu'il nomme la sortie compilée avec le nom du fichier original sans l'extension. Exécutez ou ajoutez ceci à vimrc :

```shell
set makeprg=g++\ %\ -o\ %<
```

La décomposition :
- `g++\ %` est la même que ci-dessus. Cela équivaut à exécuter `g++ <votre-fichier>`.
- `-o` est l'option de sortie.
- `%<` dans Vim représente le nom du fichier actuel sans extension (`hello.cpp` devient `hello`).

Lorsque vous exécutez `:make` depuis `./hello.cpp`, il est compilé en `./hello`. Pour exécuter rapidement `./hello` depuis `./hello.cpp`, exécutez `:!./%<`. Encore une fois, c'est la même chose que d'exécuter `:!./{nom-du-fichier-actuel-sans-l-extension}`.

Pour plus d'informations, consultez `:h :compiler` et `:h write-compiler-plugin`.

## Auto-compiler à la sauvegarde

Vous pouvez rendre la vie encore plus facile en automatisant la compilation. Rappelez-vous que vous pouvez utiliser `autocmd` de Vim pour déclencher des actions automatiques en fonction de certains événements. Pour compiler automatiquement les fichiers `.cpp` à chaque sauvegarde, ajoutez ceci à votre vimrc :

```shell
autocmd BufWritePost *.cpp make
```

Chaque fois que vous sauvegardez dans un fichier `.cpp`, Vim exécute la commande `make`.

## Changer de compilateur

Vim a une commande `:compiler` pour changer rapidement de compilateurs. Votre build Vim vient probablement avec plusieurs configurations de compilateurs pré-construites. Pour vérifier quels compilateurs vous avez, exécutez :

```shell
:e $VIMRUNTIME/compiler/<Tab>
```

Vous devriez voir une liste de compilateurs pour différents langages de programmation.

Pour utiliser la commande `:compiler`, supposons que vous avez un fichier ruby, `hello.rb` et qu'il contient :

```shell
puts "Hello ruby"
```

Rappelez-vous que si vous exécutez `:make`, Vim exécute n'importe quelle commande assignée à `makeprg` (par défaut `make`). Si vous exécutez :

```shell
:compiler ruby
```

Vim exécute le script `$VIMRUNTIME/compiler/ruby.vim` et change le `makeprg` pour utiliser la commande `ruby`. Maintenant, si vous exécutez `:set makeprg?`, cela devrait dire `makeprg=ruby` (cela dépend de ce qu'il y a dans votre fichier `$VIMRUNTIME/compiler/ruby.vim` ou si vous avez d'autres compilateurs ruby personnalisés. Les vôtres peuvent être différents). La commande `:compiler {votre-lang}` vous permet de passer rapidement à différents compilateurs. C'est utile si votre projet utilise plusieurs langages.

Vous n'êtes pas obligé d'utiliser `:compiler` et `makeprg` pour compiler un programme. Vous pouvez exécuter un script de test, lint un fichier, envoyer un signal, ou tout ce que vous voulez.

## Créer un compilateur personnalisé

Créons un compilateur Typescript simple. Installez Typescript (`npm install -g typescript`) sur votre machine. Vous devriez maintenant avoir la commande `tsc`. Si vous n'avez jamais utilisé Typescript auparavant, `tsc` compile un fichier Typescript en un fichier Javascript. Supposons que vous ayez un fichier, `hello.ts` :

```shell
const hello = "hello";
console.log(hello);
```

Si vous exécutez `tsc hello.ts`, cela sera compilé en `hello.js`. Cependant, si vous avez les expressions suivantes dans `hello.ts` :

```shell
const hello = "hello";
hello = "hello again";
console.log(hello);
```

Cela générera une erreur car vous ne pouvez pas muter une variable `const`. Exécuter `tsc hello.ts` générera une erreur :

```shell
hello.ts:2:1 - error TS2588: Cannot assign to 'person' because it is a constant.

2 person = "hello again";
  ~~~~~~


Found 1 error.
```

Pour créer un compilateur Typescript simple, dans votre répertoire `~/.vim/`, ajoutez un répertoire `compiler` (`~/.vim/compiler/`), puis créez un fichier `typescript.vim` (`~/.vim/compiler/typescript.vim`). Mettez ceci à l'intérieur :

```shell
CompilerSet makeprg=tsc
CompilerSet errorformat=%f:\ %m
```

La première ligne définit le `makeprg` pour exécuter la commande `tsc`. La deuxième ligne définit le format d'erreur pour afficher le fichier (`%f`), suivi d'un deux-points littéral (`:`) et d'un espace échappé (`\ `), suivi du message d'erreur (`%m`). Pour en savoir plus sur le formatage des erreurs, consultez `:h errorformat`.

Vous devriez également lire certains des compilateurs pré-fabriqués pour voir comment les autres le font. Consultez `:e $VIMRUNTIME/compiler/<certain-langage>.vim`.

Comme certains plugins peuvent interférer avec le fichier Typescript, ouvrons `hello.ts` sans aucun plugin, en utilisant le drapeau `--noplugin` :

```shell
vim --noplugin hello.ts
```

Vérifiez le `makeprg` :

```shell
:set makeprg?
```

Cela devrait dire le programme `make` par défaut. Pour utiliser le nouveau compilateur Typescript, exécutez :

```shell
:compiler typescript
```

Lorsque vous exécutez `:set makeprg?`, cela devrait dire `tsc` maintenant. Mettons-le à l'épreuve. Exécutez :

```shell
:make %
```

Rappelez-vous que `%` signifie le fichier actuel. Regardez votre compilateur Typescript fonctionner comme prévu ! Pour voir la liste des erreurs, exécutez `:copen`.

## Compilateur asynchrone

Parfois, la compilation peut prendre beaucoup de temps. Vous ne voulez pas rester devant un Vim gelé en attendant que votre processus de compilation se termine. Ne serait-il pas agréable de pouvoir compiler de manière asynchrone afin que vous puissiez continuer à utiliser Vim pendant la compilation ?

Heureusement, il existe des plugins pour exécuter des processus asynchrones. Les deux principaux sont :

- [vim-dispatch](https://github.com/tpope/vim-dispatch)
- [asyncrun.vim](https://github.com/skywind3000/asyncrun.vim)

Dans le reste de ce chapitre, je vais aborder vim-dispatch, mais je vous encourage fortement à essayer tous ceux qui sont disponibles.

*Vim et NeoVim prennent en réalité en charge les travaux asynchrones, mais cela dépasse le cadre de ce chapitre. Si vous êtes curieux, consultez `:h job-channel-overview.txt`.*

## Plugin : Vim-dispatch

Vim-dispatch a plusieurs commandes, mais les deux principales sont les commandes `:Make` et `:Dispatch`.

### Make asynchrone

La commande `:Make` de Vim-dispatch est similaire à `:make` de Vim, mais elle s'exécute de manière asynchrone. Si vous êtes dans un projet Javascript et que vous devez exécuter `npm t`, vous pourriez essayer de définir votre makeprg comme suit :

```shell
:set makeprg=npm\\ t
```

Si vous exécutez :

```shell
:make
```

Vim exécutera `npm t`, mais vous serez devant un écran gelé pendant que votre test JavaScript s'exécute. Avec vim-dispatch, vous pouvez simplement exécuter :

```shell
:Make
```

Vim exécutera `npm t` de manière asynchrone. De cette façon, pendant que `npm t` s'exécute en arrière-plan, vous pouvez continuer à faire ce que vous faisiez. Génial !

### Dispatch asynchrone

La commande `:Dispatch` est comme la commande `:compiler` et la commande `:!`. Elle peut exécuter n'importe quelle commande externe de manière asynchrone dans Vim.

Supposons que vous soyez dans un fichier de spécification ruby et que vous devez exécuter un test. Exécutez :

```shell
:Dispatch bundle exec rspec %
```

Vim exécutera de manière asynchrone la commande `rspec` contre le fichier actuel (`%`).

### Automatiser Dispatch

Vim-dispatch a la variable de tampon `b:dispatch` que vous pouvez configurer pour évaluer automatiquement une commande spécifique. Vous pouvez l'exploiter avec `autocmd`. Si vous ajoutez ceci dans votre vimrc :

```shell
autocmd BufEnter *_spec.rb let b:dispatch = 'bundle exec rspec %'
```

Maintenant, chaque fois que vous entrez dans un fichier (`BufEnter`) qui se termine par `_spec.rb`, l'exécution de `:Dispatch` exécute automatiquement `bundle exec rspec {votre-fichier-de-spécification-ruby-actuel}`.

## Apprendre à compiler de manière intelligente

Dans ce chapitre, vous avez appris que vous pouvez utiliser les commandes `make` et `compiler` pour exécuter *n'importe quel* processus depuis l'intérieur de Vim de manière asynchrone pour compléter votre flux de travail de programmation. La capacité de Vim à s'étendre avec d'autres programmes le rend puissant.