---
description: Deze hoofdstuk biedt een introductie in snel zoeken met Vim, inclusief
  methoden zonder plugins en met de fzf.vim-plugin voor verhoogde productiviteit.
title: Ch03. Searching Files
---

Het doel van dit hoofdstuk is om je een introductie te geven over hoe je snel kunt zoeken in Vim. Snel kunnen zoeken is een geweldige manier om je Vim-productiviteit een boost te geven. Toen ik ontdekte hoe ik snel in bestanden kon zoeken, maakte ik de overstap om Vim fulltime te gebruiken.

Dit hoofdstuk is verdeeld in twee delen: hoe te zoeken zonder plugins en hoe te zoeken met de [fzf.vim](https://github.com/junegunn/fzf.vim) plugin. Laten we beginnen!

## Bestanden Openen en Bewerken

Om een bestand in Vim te openen, kun je `:edit` gebruiken.

```shell
:edit file.txt
```

Als `file.txt` bestaat, opent het de `file.txt` buffer. Als `file.txt` niet bestaat, wordt er een nieuwe buffer voor `file.txt` aangemaakt.

Autocompleteren met `<Tab>` werkt met `:edit`. Bijvoorbeeld, als je bestand zich in een [Rails](https://rubyonrails.org/) *a*pp *c*ontroller *u*sers controller directory `./app/controllers/users_controllers.rb` bevindt, kun je `<Tab>` gebruiken om de termen snel uit te breiden:

```shell
:edit a<Tab>c<Tab>u<Tab>
```

`:edit` accepteert wildcard-argumenten. `*` komt overeen met elk bestand in de huidige directory. Als je alleen op zoek bent naar bestanden met de extensie `.yml` in de huidige directory:

```shell
:edit *.yml<Tab>
```

Vim geeft je een lijst van alle `.yml` bestanden in de huidige directory om uit te kiezen.

Je kunt `**` gebruiken om recursief te zoeken. Als je naar alle `*.md` bestanden in je project wilt zoeken, maar niet zeker weet in welke directories, kun je dit doen:

```shell
:edit **/*.md<Tab>
```

`:edit` kan worden gebruikt om `netrw`, de ingebouwde bestandsverkenner van Vim, uit te voeren. Om dat te doen, geef je `:edit` een directory-argument in plaats van een bestand:

```shell
:edit .
:edit test/unit/
```

## Bestanden Zoeken Met Find

Je kunt bestanden vinden met `:find`. Bijvoorbeeld:

```shell
:find package.json
:find app/controllers/users_controller.rb
```

Autocompleteren werkt ook met `:find`:

```shell
:find p<Tab>                " om package.json te vinden
:find a<Tab>c<Tab>u<Tab>    " om app/controllers/users_controller.rb te vinden
```

Je zult opmerken dat `:find` lijkt op `:edit`. Wat is het verschil?

## Find en Path

Het verschil is dat `:find` bestanden vindt in `path`, `:edit` niet. Laten we een beetje leren over `path`. Zodra je leert hoe je je paden kunt aanpassen, kan `:find` een krachtig zoekhulpmiddel worden. Om te controleren wat je paden zijn, doe:

```shell
:set path?
```

Standaard zien ze er waarschijnlijk zo uit:

```shell
path=.,/usr/include,,
```

- `.` betekent zoeken in de directory van het momenteel geopende bestand.
- `,` betekent zoeken in de huidige directory.
- `/usr/include` is de typische directory voor C-bibliotheken headerbestanden.

De eerste twee zijn belangrijk in onze context en de derde kan voorlopig worden genegeerd. Het belangrijkste punt hier is dat je je eigen paden kunt aanpassen, waar Vim naar bestanden zal zoeken. Laten we aannemen dat dit je projectstructuur is:

```shell
app/
  assets/
  controllers/
    application_controller.rb
    comments_controller.rb
    users_controller.rb
    ...
```

Als je naar `users_controller.rb` wilt gaan vanaf de rootdirectory, moet je door verschillende directories (en een aanzienlijke hoeveelheid tabs indrukken). Vaak, wanneer je met een framework werkt, breng je 90% van je tijd door in een bepaalde directory. In deze situatie wil je alleen naar de `controllers/` directory gaan met de minste toetsaanslagen. De `path` instelling kan die reis verkorten.

Je moet `app/controllers/` aan de huidige `path` toevoegen. Hier is hoe je dat kunt doen:

```shell
:set path+=app/controllers/
```

Nu je pad is bijgewerkt, wanneer je `:find u<Tab>` typt, zal Vim nu binnen de `app/controllers/` directory zoeken naar bestanden die beginnen met "u".

Als je een geneste `controllers/` directory hebt, zoals `app/controllers/account/users_controller.rb`, zal Vim `users_controllers` niet vinden. In plaats daarvan moet je `:set path+=app/controllers/**` toevoegen zodat autocompleteren `users_controller.rb` kan vinden. Dit is geweldig! Nu kun je de users controller vinden met 1 druk op de tab in plaats van 3.

Je zou kunnen denken om de hele projectdirectories toe te voegen, zodat wanneer je op `tab` drukt, Vim overal naar dat bestand zoekt, zoals dit:

```shell
:set path+=$PWD/**
```

`$PWD` is de huidige werkdirectory. Als je probeert je hele project aan `path` toe te voegen in de hoop dat alle bestanden bereikbaar zijn bij een `tab` druk, hoewel dit kan werken voor een klein project, zal dit je zoekopdracht aanzienlijk vertragen als je een groot aantal bestanden in je project hebt. Ik raad aan alleen het `path` van je meest bezochte bestanden/directories toe te voegen.

Je kunt `set path+={jouw-pad-hier}` in je vimrc toevoegen. Het bijwerken van `path` duurt slechts een paar seconden en kan je veel tijd besparen.

## Zoeken in Bestanden Met Grep

Als je in bestanden moet zoeken (zinnen in bestanden vinden), kun je grep gebruiken. Vim heeft twee manieren om dat te doen:

- Interne grep (`:vim`. Ja, het is gespeld als `:vim`. Het is een afkorting voor `:vimgrep`).
- Externe grep (`:grep`).

Laten we eerst de interne grep doornemen. `:vim` heeft de volgende syntaxis:

```shell
:vim /pattern/ file
```

- `/pattern/` is een regex patroon van je zoekterm.
- `file` is het bestandargument. Je kunt meerdere argumenten doorgeven. Vim zal naar het patroon binnen het bestandargument zoeken. Vergelijkbaar met `:find`, kun je het `*` en `**` wildcards doorgeven.

Bijvoorbeeld, om naar alle voorkomens van de string "breakfast" te zoeken in alle ruby-bestanden (`.rb`) binnen de `app/controllers/` directory:

```shell
:vim /breakfast/ app/controllers/**/*.rb
```

Na het uitvoeren daarvan, word je omgeleid naar het eerste resultaat. De `vim` zoekopdracht van Vim gebruikt de `quickfix` operatie. Om alle zoekresultaten te zien, voer `:copen` uit. Dit opent een `quickfix` venster. Hier zijn enkele nuttige quickfix-commando's om je onmiddellijk productief te maken:

```shell
:copen        Open het quickfix venster
:cclose       Sluit het quickfix venster
:cnext        Ga naar de volgende fout
:cprevious    Ga naar de vorige fout
:colder       Ga naar de oudere foutlijst
:cnewer       Ga naar de nieuwere foutlijst
```

Om meer te leren over quickfix, kijk naar `:h quickfix`.

Je zult opmerken dat het uitvoeren van interne grep (`:vim`) traag kan worden als je een groot aantal overeenkomsten hebt. Dit komt omdat Vim elk overeenkomend bestand in het geheugen laadt, alsof het wordt bewerkt. Als Vim een groot aantal bestanden vindt die overeenkomen met je zoekopdracht, laadt het ze allemaal en verbruikt daardoor een grote hoeveelheid geheugen.

Laten we het hebben over externe grep. Standaard gebruikt het het `grep` terminalcommando. Om naar "lunch" te zoeken in een ruby-bestand binnen de `app/controllers/` directory, kun je dit doen:

```shell
:grep -R "lunch" app/controllers/
```

Let op dat in plaats van `/pattern/` het de terminal grep-syntaxis `"pattern"` volgt. Het toont ook alle overeenkomsten met behulp van `quickfix`.

Vim definieert de `grepprg` variabele om te bepalen welk extern programma moet worden uitgevoerd wanneer je het `:grep` Vim-commando uitvoert, zodat je Vim niet hoeft te sluiten en het terminal `grep` commando hoeft aan te roepen. Later zal ik je laten zien hoe je het standaardprogramma kunt wijzigen dat wordt aangeroepen bij het gebruik van het `:grep` Vim-commando.

## Bestanden Bladeren Met Netrw

`netrw` is de ingebouwde bestandsverkenner van Vim. Het is nuttig om de hiërarchie van een project te zien. Om `netrw` uit te voeren, heb je deze twee instellingen in je `.vimrc` nodig:

```shell
set nocp
filetype plugin on
```

Aangezien `netrw` een uitgebreid onderwerp is, zal ik alleen de basisgebruik behandelen, maar het zou genoeg moeten zijn om je op weg te helpen. Je kunt `netrw` starten wanneer je Vim opstart door het een directory als parameter door te geven in plaats van een bestand. Bijvoorbeeld:

```shell
vim .
vim src/client/
vim app/controllers/
```

Om `netrw` vanuit Vim te starten, kun je het `:edit` commando gebruiken en het een directoryparameter geven in plaats van een bestandsnaam:

```shell
:edit .
:edit src/client/
:edit app/controllers/
```

Er zijn andere manieren om het `netrw` venster te starten zonder een directory door te geven:

```shell
:Explore     Start netrw op het huidige bestand
:Sexplore    Geen grap. Start netrw op de bovenste helft van het scherm
:Vexplore    Start netrw op de linkerhelft van het scherm
```

Je kunt `netrw` navigeren met Vim-bewegingen (bewegingen worden in detail behandeld in een later hoofdstuk). Als je een bestand of directory wilt maken, verwijderen of hernoemen, hier is een lijst van nuttige `netrw` commando's:

```shell
%    Maak een nieuw bestand
d    Maak een nieuwe directory
R    Hernoem een bestand of directory
D    Verwijder een bestand of directory
```

`:h netrw` is zeer uitgebreid. Kijk ernaar als je tijd hebt.

Als je `netrw` te saai vindt en meer smaak nodig hebt, is [vim-vinegar](https://github.com/tpope/vim-vinegar) een goede plugin om `netrw` te verbeteren. Als je op zoek bent naar een andere bestandsverkenner, is [NERDTree](https://github.com/preservim/nerdtree) een goed alternatief. Kijk ernaar!

## Fzf

Nu je hebt geleerd hoe je bestanden in Vim kunt zoeken met ingebouwde tools, laten we leren hoe je dit met plugins kunt doen.

Een ding dat moderne teksteditors goed doen en dat Vim niet doet, is hoe gemakkelijk het is om bestanden te vinden, vooral via fuzzy search. In de tweede helft van dit hoofdstuk zal ik je laten zien hoe je [fzf.vim](https://github.com/junegunn/fzf.vim) kunt gebruiken om zoeken in Vim eenvoudig en krachtig te maken.

## Setup

Zorg er eerst voor dat je [fzf](https://github.com/junegunn/fzf) en [ripgrep](https://github.com/BurntSushi/ripgrep) hebt gedownload. Volg de instructies op hun github-repo. De commando's `fzf` en `rg` zouden nu beschikbaar moeten zijn na succesvolle installaties.

Ripgrep is een zoektool die veel lijkt op grep (vandaar de naam). Het is over het algemeen sneller dan grep en heeft veel nuttige functies. Fzf is een algemene commandoregel fuzzy finder. Je kunt het met elke commando gebruiken, inclusief ripgrep. Samen vormen ze een krachtige combinatie van zoektools.

Fzf gebruikt standaard geen ripgrep, dus we moeten fzf vertellen om ripgrep te gebruiken door een `FZF_DEFAULT_COMMAND` variabele te definiëren. In mijn `.zshrc` (`.bashrc` als je bash gebruikt), heb ik deze:

```shell
if type rg &> /dev/null; then
  export FZF_DEFAULT_COMMAND='rg --files'
  export FZF_DEFAULT_OPTS='-m'
fi
```

Let op `-m` in `FZF_DEFAULT_OPTS`. Deze optie stelt ons in staat om meerdere selecties te maken met `<Tab>` of `<Shift-Tab>`. Je hebt deze regel niet nodig om fzf met Vim te laten werken, maar ik denk dat het een nuttige optie is om te hebben. Het zal van pas komen wanneer je zoek- en vervangingen in meerdere bestanden wilt uitvoeren, waar ik zo meteen op terugkom. Het fzf-commando accepteert nog veel meer opties, maar ik zal ze hier niet behandelen. Om meer te leren, kijk naar [fzf's repo](https://github.com/junegunn/fzf#usage) of `man fzf`. Minimaal zou je `export FZF_DEFAULT_COMMAND='rg'` moeten hebben.

Na het installeren van fzf en ripgrep, laten we de fzf-plugin instellen. Ik gebruik [vim-plug](https://github.com/junegunn/vim-plug) plugin manager in dit voorbeeld, maar je kunt elke plugin manager gebruiken.

Voeg deze toe in je `.vimrc` plugins. Je moet de [fzf.vim](https://github.com/junegunn/fzf.vim) plugin gebruiken (gemaakt door dezelfde fzf-auteur).

```shell
call plug#begin()
Plug 'junegunn/fzf.vim'
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
call plug#end()
```

Na het toevoegen van deze regels, moet je `vim` openen en `:PlugInstall` uitvoeren. Het installeert alle plugins die zijn gedefinieerd in je `vimrc` bestand en die nog niet zijn geïnstalleerd. In ons geval zal het `fzf.vim` en `fzf` installeren.

Voor meer informatie over deze plugin, kun je de [fzf.vim repo](https://github.com/junegunn/fzf/blob/master/README-VIM.md) bekijken.
## Fzf-syntaxis

Om fzf efficiënt te gebruiken, moet je enkele basis fzf-syntaxis leren. Gelukkig is de lijst kort:

- `^` is een prefix exacte overeenkomst. Om te zoeken naar een zin die begint met "welkom": `^welkom`.
- `$` is een suffix exacte overeenkomst. Om te zoeken naar een zin die eindigt met "mijn vrienden": `vrienden$`.
- `'` is een exacte overeenkomst. Om te zoeken naar de zin "welkom mijn vrienden": `'welkom mijn vrienden`.
- `|` is een "of" overeenkomst. Om te zoeken naar "vrienden" of "vijanden": `vrienden | vijanden`.
- `!` is een inverse overeenkomst. Om te zoeken naar een zin die "welkom" bevat en niet "vrienden": `welkom !vrienden`

Je kunt deze opties combineren. Bijvoorbeeld, `^hallo | ^welkom vrienden$` zal zoeken naar de zin die begint met "welkom" of "hallo" en eindigt met "vrienden".

## Bestanden Vinden

Om bestanden binnen Vim te zoeken met de fzf.vim-plugin, kun je de `:Files`-methode gebruiken. Voer `:Files` uit vanuit Vim en je krijgt een fzf-zoekprompt.

Aangezien je deze opdracht vaak zult gebruiken, is het goed om deze aan een sneltoets te koppelen. Ik heb de mijne gekoppeld aan `Ctrl-f`. In mijn vimrc heb ik dit:

```shell
nnoremap <silent> <C-f> :Files<CR>
```

## Zoeken in Bestanden

Om binnen bestanden te zoeken, kun je de `:Rg`-opdracht gebruiken.

Nogmaals, aangezien je dit waarschijnlijk vaak zult gebruiken, laten we het aan een sneltoets koppelen. Ik heb de mijne gekoppeld aan `<Leader>f`. De `<Leader>`-toets is standaard gekoppeld aan `\`.

```shell
nnoremap <silent> <Leader>f :Rg<CR>
```

## Andere Zoekopdrachten

Fzf.vim biedt veel andere zoekopdrachten. Ik zal hier niet elk van hen doornemen, maar je kunt ze [hier](https://github.com/junegunn/fzf.vim#commands) bekijken.

Hier is hoe mijn fzf-koppelingen eruitzien:

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

## Vervangen van Grep met Rg

Zoals eerder vermeld, heeft Vim twee manieren om in bestanden te zoeken: `:vim` en `:grep`. `:grep` gebruikt een externe zoektool die je kunt herconfigureren met het `grepprg`-sleutelwoord. Ik zal je laten zien hoe je Vim configureert om ripgrep te gebruiken in plaats van terminal grep bij het uitvoeren van de `:grep`-opdracht.

Laten we nu `grepprg` instellen zodat de `:grep`-opdracht in Vim ripgrep gebruikt. Voeg dit toe aan je vimrc:

```shell
set grepprg=rg\ --vimgrep\ --smart-case\ --follow
```

Voel je vrij om enkele van de bovenstaande opties aan te passen! Voor meer informatie over wat de bovenstaande opties betekenen, kijk in `man rg`.

Nadat je `grepprg` hebt bijgewerkt, voert `:grep` nu `rg --vimgrep --smart-case --follow` uit in plaats van `grep`. Als je "donut" wilt zoeken met ripgrep, kun je nu een beknoptere opdracht uitvoeren `:grep "donut"` in plaats van `:grep "donut" . -R`.

Net als de oude `:grep`, gebruikt deze nieuwe `:grep` ook quickfix om resultaten weer te geven.

Je vraagt je misschien af: "Nou, dit is leuk, maar ik heb `:grep` nooit in Vim gebruikt, plus kan ik niet gewoon `:Rg` gebruiken om zinnen in bestanden te vinden? Wanneer heb ik ooit `:grep` nodig?"

Dat is een zeer goede vraag. Je moet mogelijk `:grep` in Vim gebruiken om zoeken en vervangen in meerdere bestanden uit te voeren, wat ik hierna zal behandelen.

## Zoeken en Vervangen in Meerdere Bestanden

Moderne teksteditors zoals VSCode maken het heel gemakkelijk om een tekenreeks in meerdere bestanden te zoeken en te vervangen. In deze sectie laat ik je twee verschillende methoden zien om dit gemakkelijk in Vim te doen.

De eerste methode is om *alle* overeenkomende zinnen in je project te vervangen. Je moet `:grep` gebruiken. Als je alle instanties van "pizza" wilt vervangen door "donut", doe je het volgende:

```shell
:grep "pizza"
:cfdo %s/pizza/donut/g | update
```

Laten we de opdrachten opsplitsen:

1. `:grep pizza` gebruikt ripgrep om alle instanties van "pizza" te zoeken (overigens zou dit nog steeds werken, zelfs als je `grepprg` niet opnieuw had toegewezen om ripgrep te gebruiken. Je zou `:grep "pizza" . -R` in plaats van `:grep "pizza"` moeten doen).
2. `:cfdo` voert elke opdracht die je doorgeeft uit op alle bestanden in je quickfix-lijst. In dit geval is je opdracht de vervangopdracht `%s/pizza/donut/g`. De pipe (`|`) is een ketenoperator. De `update`-opdracht slaat elk bestand op na vervanging. Ik zal de vervangopdracht in meer detail behandelen in een later hoofdstuk.

De tweede methode is om te zoeken en te vervangen in geselecteerde bestanden. Met deze methode kun je handmatig kiezen welke bestanden je wilt selecteren en vervangen. Hier is wat je doet:

1. Maak eerst je buffers leeg. Het is van cruciaal belang dat je bufferlijst alleen de bestanden bevat waarop je de vervangingen wilt toepassen. Je kunt Vim opnieuw opstarten of de opdracht `:%bd | e#` uitvoeren (`%bd` verwijdert alle buffers en `e#` opent het bestand waar je net op zat).
2. Voer `:Files` uit.
3. Selecteer alle bestanden waarop je zoeken en vervangen wilt uitvoeren. Om meerdere bestanden te selecteren, gebruik `<Tab>` / `<Shift-Tab>`. Dit is alleen mogelijk als je de meerdere vlag (`-m`) in `FZF_DEFAULT_OPTS` hebt.
4. Voer `:bufdo %s/pizza/donut/g | update` uit. De opdracht `:bufdo %s/pizza/donut/g | update` lijkt op de eerdere `:cfdo %s/pizza/donut/g | update` opdracht. Het verschil is dat je in plaats van alle quickfix-invoer (`:cfdo`) nu alle bufferinvoer (`:bufdo`) vervangt.

## Leer Slim Zoeken

Zoeken is het brood en de boter van tekstbewerking. Leren hoe je goed kunt zoeken in Vim zal je tekstbewerkingsworkflow aanzienlijk verbeteren.

Fzf.vim is een game-changer. Ik kan me niet voorstellen Vim zonder het te gebruiken. Ik denk dat het erg belangrijk is om een goede zoektool te hebben bij het starten van Vim. Ik heb mensen gezien die moeite hebben om over te stappen naar Vim omdat het lijkt te ontbreken aan kritieke functies die moderne teksteditors hebben, zoals een gemakkelijke en krachtige zoekfunctie. Ik hoop dat dit hoofdstuk je zal helpen de overstap naar Vim gemakkelijker te maken.

Je hebt ook net de uitbreidbaarheid van Vim in actie gezien - de mogelijkheid om de zoekfunctionaliteit uit te breiden met een plugin en een extern programma. Houd in de toekomst rekening met welke andere functies je Vim wilt uitbreiden. De kans is groot dat het al in Vim zit, iemand heeft een plugin gemaakt of er is al een programma voor. Als volgende leer je over een zeer belangrijk onderwerp in Vim: Vim-syntaxis.