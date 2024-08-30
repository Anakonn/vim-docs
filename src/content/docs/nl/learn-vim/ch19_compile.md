---
description: In dit hoofdstuk leer je hoe je kunt compileren vanuit Vim en gebruik
  kunt maken van de `:make`-opdracht voor efficiënte compilatie met makefiles.
title: Ch19. Compile
---

Compileren is een belangrijk onderwerp voor veel talen. In dit hoofdstuk leer je hoe je kunt compileren vanuit Vim. Je zult ook kijken naar manieren om gebruik te maken van de `:make` opdracht van Vim.

## Compileer vanuit de Opdrachtregel

Je kunt de bang-operator (`!`) gebruiken om te compileren. Als je je `.cpp`-bestand met `g++` moet compileren, voer dan uit:

```shell
:!g++ hello.cpp -o hello
```

Echter, elke keer handmatig de bestandsnaam en de uitvoerbestandsnaam typen is foutgevoelig en vervelend. Een makefile is de oplossing.

## De Make Opdracht

Vim heeft een `:make` opdracht om een makefile uit te voeren. Wanneer je deze uitvoert, zoekt Vim naar een makefile in de huidige directory om uit te voeren.

Maak een bestand genaamd `makefile` in de huidige directory en zet deze erin:

```shell
all:
	echo "Hallo allemaal"
foo:
	echo "Hallo foo"
list_pls:
	ls
```

Voer dit uit vanuit Vim:

```shell
:make
```

Vim voert het uit op dezelfde manier als wanneer je het vanuit de terminal uitvoert. De `:make` opdracht accepteert parameters net als de terminal make-opdracht. Voer uit:

```shell
:make foo
" Geeft "Hallo foo" weer

:make list_pls
" Geeft het resultaat van de ls-opdracht weer
```

De `:make` opdracht gebruikt Vim's quickfix om eventuele fouten op te slaan als je een verkeerde opdracht uitvoert. Laten we een niet-bestaand doel uitvoeren:

```shell
:make dontexist
```

Je zou een foutmelding moeten zien bij het uitvoeren van die opdracht. Om die fout te bekijken, voer de quickfix-opdracht `:copen` uit om het quickfix-venster te bekijken:

```shell
|| make: *** Geen regel om doel `dontexist' te maken. Stop.
```

## Compileren met Make

Laten we de makefile gebruiken om een basis `.cpp` programma te compileren. Eerst, laten we een `hello.cpp` bestand maken:

```shell
#include <iostream>

int main() {
    std::cout << "Hallo!\n";
    return 0;
}
```

Werk je makefile bij om een `.cpp` bestand te bouwen en uit te voeren:

```shell
all:
	echo "bouwen, uitvoeren"
build:
	g++ hello.cpp -o hello
run:
	./hello
```

Voer nu uit:

```shell
:make build
```

De `g++` compileert `./hello.cpp` en maakt `./hello`. Voer dan uit:

```shell
:make run
```

Je zou `"Hallo!"` op de terminal moeten zien verschijnen.

## Verschillende Make Programma

Wanneer je `:make` uitvoert, voert Vim eigenlijk de opdracht uit die is ingesteld onder de `makeprg` optie. Als je `:set makeprg?` uitvoert, zie je:

```shell
makeprg=make
```

De standaard `:make` opdracht is de externe opdracht `make`. Om de `:make` opdracht te wijzigen zodat deze `g++ {jouw-bestandsnaam}` elke keer uitvoert wanneer je het uitvoert, voer uit:

```shell
:set makeprg=g++\ %
```

De `\` is om de spatie na `g++` te ontsnappen. Het `%` symbool in Vim vertegenwoordigt het huidige bestand. De opdracht `g++\\ %` is gelijk aan het uitvoeren van `g++ hello.cpp`.

Ga naar `./hello.cpp` en voer dan `:make` uit. Vim compileert `hello.cpp` en maakt `a.out` omdat je de uitvoer niet hebt opgegeven. Laten we het refactoren zodat het de gecompileerde uitvoer de naam van het originele bestand zonder de extensie geeft. Voer of voeg dit toe aan vimrc:

```shell
set makeprg=g++\ %\ -o\ %<
```

De uitleg:
- `g++\ %` is hetzelfde als hierboven. Het is gelijk aan het uitvoeren van `g++ <jouw-bestand>`.
- `-o` is de uitvoeroptie.
- `%<` in Vim vertegenwoordigt de huidige bestandsnaam zonder extensie (`hello.cpp` wordt `hello`).

Wanneer je `:make` uitvoert vanuit `./hello.cpp`, wordt het gecompileerd naar `./hello`. Om snel `./hello` uit te voeren vanuit `./hello.cpp`, voer `:!./%<` uit. Nogmaals, dit is hetzelfde als het uitvoeren van `:!./{huidige-bestandsnaam-mins-de-extensie}`.

Voor meer, kijk naar `:h :compiler` en `:h write-compiler-plugin`.

## Automatisch Compileren bij Opslaan

Je kunt het leven nog gemakkelijker maken door compilatie te automatiseren. Vergeet niet dat je Vim's `autocmd` kunt gebruiken om automatische acties te triggeren op basis van bepaalde gebeurtenissen. Om automatisch `.cpp` bestanden bij elke opslag te compileren, voeg dit toe aan je vimrc:

```shell
autocmd BufWritePost *.cpp make
```

Elke keer dat je opslaat binnen een `.cpp` bestand, voert Vim de `make` opdracht uit.

## Wisselen van Compiler

Vim heeft een `:compiler` opdracht om snel van compiler te wisselen. Je Vim-build komt waarschijnlijk met verschillende vooraf gebouwde compilerconfiguraties. Om te controleren welke compilers je hebt, voer uit:

```shell
:e $VIMRUNTIME/compiler/<Tab>
```

Je zou een lijst van compilers voor verschillende programmeertalen moeten zien.

Om de `:compiler` opdracht te gebruiken, stel je voor dat je een ruby-bestand hebt, `hello.rb` en daarin staat:

```shell
puts "Hallo ruby"
```

Vergeet niet dat als je `:make` uitvoert, Vim alles uitvoert wat is toegewezen aan `makeprg` (standaard is `make`). Als je uitvoert:

```shell
:compiler ruby
```

Vim voert het `$VIMRUNTIME/compiler/ruby.vim` script uit en wijzigt de `makeprg` om de `ruby` opdracht te gebruiken. Nu, als je `:set makeprg?` uitvoert, zou het `makeprg=ruby` moeten zeggen (dit hangt af van wat er in je `$VIMRUNTIME/compiler/ruby.vim` bestand staat of als je andere aangepaste ruby-compilers hebt. De jouwe kan anders zijn). De `:compiler {jouw-taal}` opdracht stelt je in staat om snel van verschillende compilers te wisselen. Dit is nuttig als je project meerdere talen gebruikt.

Je hoeft de `:compiler` en `makeprg` niet te gebruiken om een programma te compileren. Je kunt een testscript uitvoeren, een bestand linten, een signaal verzenden of iets anders wat je wilt.

## Een Aangepaste Compiler Maken

Laten we een eenvoudige Typescript-compiler maken. Installeer Typescript (`npm install -g typescript`) op je machine. Je zou nu de `tsc` opdracht moeten hebben. Als je nog niet met typescript hebt gespeeld, compileert `tsc` een Typescript-bestand naar een Javascript-bestand. Stel dat je een bestand hebt, `hello.ts`:

```shell
const hello = "hello";
console.log(hello);
```

Als je `tsc hello.ts` uitvoert, wordt het gecompileerd naar `hello.js`. Echter, als je de volgende expressies in `hello.ts` hebt:

```shell
const hello = "hello";
hello = "hello again";
console.log(hello);
```

Dit zal een fout veroorzaken omdat je een `const` variabele niet kunt muteren. Het uitvoeren van `tsc hello.ts` zal een fout geven:

```shell
hello.ts:2:1 - error TS2588: Kan niet toewijzen aan 'persoon' omdat het een constante is.

2 persoon = "hello again";
  ~~~~~~


Gevonden 1 fout.
```

Om een eenvoudige Typescript-compiler te maken, voeg in je `~/.vim/` directory een `compiler` directory toe (`~/.vim/compiler/`), maak dan een `typescript.vim` bestand (`~/.vim/compiler/typescript.vim`). Zet dit erin:

```shell
CompilerSet makeprg=tsc
CompilerSet errorformat=%f:\ %m
```

De eerste regel stelt de `makeprg` in om de `tsc` opdracht uit te voeren. De tweede regel stelt het foutformaat in om het bestand (`%f`), gevolgd door een letterlijke dubbele punt (`:`) en een ontsnapte spatie (`\ `), gevolgd door de foutmelding (`%m`) weer te geven. Om meer te leren over het foutformaat, kijk naar `:h errorformat`.

Je zou ook enkele van de vooraf gemaakte compilers moeten lezen om te zien hoe anderen het doen. Kijk naar `:e $VIMRUNTIME/compiler/<some-language>.vim`.

Omdat sommige plugins mogelijk interfereren met het Typescript-bestand, laten we `hello.ts` zonder enige plugin openen, met de `--noplugin` vlag:

```shell
vim --noplugin hello.ts
```

Controleer de `makeprg`:

```shell
:set makeprg?
```

Het zou het standaard `make` programma moeten zeggen. Om de nieuwe Typescript-compiler te gebruiken, voer uit:

```shell
:compiler typescript
```

Wanneer je `:set makeprg?` uitvoert, zou het nu `tsc` moeten zeggen. Laten we het testen. Voer uit:

```shell
:make %
```

Vergeet niet dat `%` het huidige bestand betekent. Kijk hoe je Typescript-compiler werkt zoals verwacht! Om de lijst met fout(en) te zien, voer `:copen` uit.

## Async Compiler

Soms kan compileren lang duren. Je wilt niet naar een bevroren Vim staren terwijl je wacht tot je compilatieproces is voltooid. Zou het niet fijn zijn als je asynchroon kunt compileren zodat je Vim nog steeds kunt gebruiken tijdens de compilatie?

Gelukkig zijn er plugins om asynchrone processen uit te voeren. De twee grote zijn:

- [vim-dispatch](https://github.com/tpope/vim-dispatch)
- [asyncrun.vim](https://github.com/skywind3000/asyncrun.vim)

In de rest van dit hoofdstuk zal ik vim-dispatch behandelen, maar ik moedig je sterk aan om ze allemaal uit te proberen.

*Vim en NeoVim ondersteunen eigenlijk asynchrone taken, maar ze vallen buiten de reikwijdte van dit hoofdstuk. Als je nieuwsgierig bent, kijk naar `:h job-channel-overview.txt`.*

## Plugin: Vim-dispatch

Vim-dispatch heeft verschillende opdrachten, maar de twee belangrijkste zijn `:Make` en `:Dispatch` opdrachten.

### Async Make

De `:Make` opdracht van Vim-dispatch is vergelijkbaar met Vim's `:make`, maar het draait asynchroon. Als je in een Javascript-project bent en je moet `npm t` uitvoeren, zou je kunnen proberen om je makeprg in te stellen op:

```shell
:set makeprg=npm\\ t
```

Als je uitvoert:

```shell
:make
```

Vim zal `npm t` uitvoeren, maar je zult naar een bevroren scherm staren terwijl je JavaScript-test draait. Met vim-dispatch kun je gewoon uitvoeren:

```shell
:Make
```

Vim zal `npm t` asynchroon uitvoeren. Op deze manier kun je doorgaan met wat je aan het doen was terwijl `npm t` op een achtergrondproces draait. Geweldig!

### Async Dispatch

De `:Dispatch` opdracht is zoals de `:compiler` en de `:!` opdracht. Het kan elke externe opdracht asynchroon in Vim uitvoeren.

Stel dat je in een ruby spec-bestand bent en je moet een test uitvoeren. Voer uit:

```shell
:Dispatch bundle exec rspec %
```

Vim zal de `rspec` opdracht asynchroon uitvoeren tegen het huidige bestand (`%`).

### Automatiseren van Dispatch

Vim-dispatch heeft de `b:dispatch` buffer variabele die je kunt configureren om specifieke opdrachten automatisch te evalueren. Je kunt het gebruiken met `autocmd`. Als je dit in je vimrc toevoegt:

```shell
autocmd BufEnter *_spec.rb let b:dispatch = 'bundle exec rspec %'
```

Nu, elke keer dat je een bestand (`BufEnter`) opent dat eindigt op `_spec.rb`, voert het automatisch `bundle exec rspec {jouw-huidige-ruby-spec-bestand}` uit.

## Leer Slim Compileren

In dit hoofdstuk heb je geleerd dat je de `make` en `compiler` opdrachten kunt gebruiken om *elke* proces vanuit Vim asynchroon uit te voeren ter aanvulling van je programmeerworkflow. De mogelijkheid van Vim om zichzelf uit te breiden met andere programma's maakt het krachtig.