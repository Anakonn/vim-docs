---
description: Leer hoe je Vim's ingebouwde pluginmanager, pakketten, kunt gebruiken
  om plugins te installeren en automatisch te laden bij het opstarten van Vim.
title: Ch23. Vim Packages
---

In het vorige hoofdstuk heb ik het gebruik van een externe pluginmanager genoemd om plugins te installeren. Sinds versie 8 heeft Vim zijn eigen ingebouwde pluginmanager genaamd *packages*. In dit hoofdstuk leer je hoe je Vim-packages kunt gebruiken om plugins te installeren.

Om te zien of jouw Vim-build de mogelijkheid heeft om packages te gebruiken, voer je `:version` uit en zoek je naar het attribuut `+packages`. Alternatief kun je ook `:echo has('packages')` uitvoeren (als het 1 retourneert, heeft het de packages-mogelijkheid).

## Pack Directory

Controleer of je een `~/.vim/`-directory hebt in het rootpad. Als je die niet hebt, maak er een aan. Maak daarin een directory genaamd `pack` (`~/.vim/pack/`). Vim weet automatisch dat het in deze directory naar packages moet zoeken.

## Twee Types van Laden

Vim-package heeft twee laadmechanismen: automatisch en handmatig laden.

### Automatisch Laden

Om plugins automatisch te laden wanneer Vim opstart, moet je ze in de `start/`-directory plaatsen. Het pad ziet er als volgt uit:

```shell
~/.vim/pack/*/start/
```

Nu vraag je je misschien af: "Wat is de `*` tussen `pack/` en `start/`?" `*` is een willekeurige naam en kan alles zijn wat je wilt. Laten we het `packdemo/` noemen:

```shell
~/.vim/pack/packdemo/start/
```

Houd er rekening mee dat als je het overslaat en in plaats daarvan iets als dit doet:

```shell
~/.vim/pack/start/
```

het packagesysteem niet zal werken. Het is van essentieel belang om een naam tussen `pack/` en `start/` te plaatsen.

Voor deze demo, laten we proberen de [NERDTree](https://github.com/preservim/nerdtree) plugin te installeren. Ga helemaal naar de `start/`-directory (`cd ~/.vim/pack/packdemo/start/`) en clone de NERDTree-repository:

```shell
git clone https://github.com/preservim/nerdtree.git
```

Dat is het! Je bent helemaal klaar. De volgende keer dat je Vim start, kun je onmiddellijk NERDTree-commando's zoals `:NERDTreeToggle` uitvoeren.

Je kunt zoveel plugin-repositories clonen als je wilt binnen het pad `~/.vim/pack/*/start/`. Vim zal automatisch elk van hen laden. Als je de gekloonde repository verwijdert (`rm -rf nerdtree/`), zal die plugin niet meer beschikbaar zijn.

### Handmatig Laden

Om plugins handmatig te laden wanneer Vim opstart, moet je ze in de `opt/`-directory plaatsen. Vergelijkbaar met automatisch laden, ziet het pad er als volgt uit:

```shell
~/.vim/pack/*/opt/
```

Laten we dezelfde `packdemo/`-directory van eerder gebruiken:

```shell
~/.vim/pack/packdemo/opt/
```

Deze keer laten we de [killersheep](https://github.com/vim/killersheep) game installeren (dit vereist Vim 8.2). Ga naar de `opt/`-directory (`cd ~/.vim/pack/packdemo/opt/`) en clone de repository:

```shell
git clone https://github.com/vim/killersheep.git
```

Start Vim. Het commando om de game uit te voeren is `:KillKillKill`. Probeer het uit te voeren. Vim zal klagen dat het geen geldig editorcommando is. Je moet de plugin eerst *handmatig* laden. Laten we dat doen:

```shell
:packadd killersheep
```

Probeer nu het commando opnieuw uit te voeren `:KillKillKill`. Het commando zou nu moeten werken.

Je vraagt je misschien af: "Waarom zou ik ooit packages handmatig willen laden? Is het niet beter om alles automatisch bij de start te laden?"

Geweldige vraag. Soms zijn er plugins die je niet de hele tijd gebruikt, zoals die KillerSheep-game. Je hoeft waarschijnlijk niet 10 verschillende games te laden en de opstarttijd van Vim te vertragen. Maar af en toe, als je je verveelt, wil je misschien een paar games spelen. Gebruik handmatig laden voor niet-essentiële plugins.

Je kunt dit ook gebruiken om plugins conditioneel toe te voegen. Misschien gebruik je zowel Neovim als Vim en zijn er plugins die geoptimaliseerd zijn voor Neovim. Je kunt iets als dit in je vimrc toevoegen:

```shell
if has('nvim')
  packadd! neovim-only-plugin
else
  packadd! generic-vim-plugin
endif
```

## Organiseren van Packages

Vergeet niet dat de vereiste om het package-systeem van Vim te gebruiken is om ofwel te hebben:

```shell
~/.vim/pack/*/start/
```

Of:

```shell
~/.vim/pack/*/opt/
```

Het feit dat `*` een *elke* naam kan zijn, kan worden gebruikt om je packages te organiseren. Stel dat je je plugins wilt groeperen op basis van categorieën (kleuren, syntaxis en games):

```shell
~/.vim/pack/colors/
~/.vim/pack/syntax/
~/.vim/pack/games/
```

Je kunt nog steeds `start/` en `opt/` binnen elk van de directories gebruiken.

```shell
~/.vim/pack/colors/start/
~/.vim/pack/colors/opt/

~/.vim/pack/syntax/start/
~/.vim/pack/syntax/opt/

~/.vim/pack/games/start/
~/.vim/pack/games/opt/
```

## Packages Toevoegen op de Slimme Manier

Je vraagt je misschien af of Vim packages populaire pluginmanagers zoals vim-pathogen, vundle.vim, dein.vim en vim-plug overbodig zullen maken.

Het antwoord is, zoals altijd, "het hangt ervan af".

Ik gebruik nog steeds vim-plug omdat het gemakkelijk is om plugins toe te voegen, te verwijderen of bij te werken. Als je veel plugins gebruikt, kan het handiger zijn om pluginmanagers te gebruiken omdat het gemakkelijk is om er veel tegelijk bij te werken. Sommige pluginmanagers bieden ook asynchrone functionaliteiten.

Als je een minimalist bent, probeer dan Vim-packages. Als je een zware plugin-gebruiker bent, wil je misschien overwegen om een pluginmanager te gebruiken.