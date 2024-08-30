---
description: Dit document biedt een overzicht van de runtime-paden in Vim, inclusief
  hun functie en hoe ze kunnen worden aangepast voor een betere gebruikerservaring.
title: Ch24. Vim Runtime
---

In de vorige hoofdstukken heb ik vermeld dat Vim automatisch zoekt naar speciale paden zoals `pack/` (Hoofdstuk 22) en `compiler/` (Hoofdstuk 19) binnen de `~/.vim/` directory. Dit zijn voorbeelden van Vim runtime-paden.

Vim heeft meer runtime-paden dan deze twee. In dit hoofdstuk leer je een hoog-overzicht van deze runtime-paden. Het doel van dit hoofdstuk is om je te laten zien wanneer ze worden aangeroepen. Dit zal je in staat stellen om Vim verder te begrijpen en aan te passen.

## Runtime Pad

Op een Unix-machine is een van je Vim runtime-paden `$HOME/.vim/` (als je een ander besturingssysteem zoals Windows hebt, kan je pad anders zijn). Om te zien wat de runtime-paden voor verschillende besturingssystemen zijn, kijk je naar `:h 'runtimepath'`. In dit hoofdstuk zal ik `~/.vim/` gebruiken als het standaard runtime-pad.

## Plugin Scripts

Vim heeft een plugin runtime-pad dat alle scripts in deze directory één keer uitvoert elke keer dat Vim start. Verwar de naam "plugin" niet met externe Vim-plugins (zoals NERDTree, fzf.vim, enz.).

Ga naar de `~/.vim/` directory en maak een `plugin/` directory aan. Maak twee bestanden aan: `donut.vim` en `chocolate.vim`.

Binnen `~/.vim/plugin/donut.vim`:

```shell
echo "donut!"
```

Binnen `~/.vim/plugin/chocolate.vim`:

```shell
echo "chocolate!"
```

Sluit nu Vim. De volgende keer dat je Vim start, zie je zowel `"donut!"` als `"chocolate!"` ge-echood. Het plugin runtime-pad kan worden gebruikt voor initialisatiescripts.

## Bestandsdetectie

Voordat je begint, zorg ervoor dat je vimrc ten minste de volgende regel bevat:

```shell
filetype plugin indent on
```

Bekijk `:h filetype-overview` voor meer context. In wezen schakelt dit de bestandsdetectie van Vim in.

Wanneer je een nieuw bestand opent, weet Vim meestal wat voor soort bestand het is. Als je een bestand `hello.rb` hebt, retourneert `:set filetype?` het juiste antwoord `filetype=ruby`.

Vim weet hoe het "gewone" bestandstypen (Ruby, Python, Javascript, enz.) moet detecteren. Maar wat als je een aangepast bestand hebt? Je moet Vim leren het te detecteren en het de juiste bestandstype toe te wijzen.

Er zijn twee methoden voor detectie: het gebruik van de bestandsnaam en de bestandsinhoud.

### Bestandsnaam Detectie

Bestandsnaamdetectie detecteert een bestandstype aan de hand van de naam van dat bestand. Wanneer je het bestand `hello.rb` opent, weet Vim dat het een Ruby-bestand is aan de hand van de `.rb` extensie.

Er zijn twee manieren waarop je bestandsnaamdetectie kunt doen: met behulp van de `ftdetect/` runtime-directory en met behulp van het `filetype.vim` runtime-bestand. Laten we beide verkennen.

#### `ftdetect/`

Laten we een obscure (maar smakelijke) bestand maken, `hello.chocodonut`. Wanneer je het opent en `:set filetype?` uitvoert, weet Vim niet wat het ermee aan moet. Het retourneert `filetype=`.

Je moet Vim instrueren om alle bestanden die eindigen op `.chocodonut` als een "chocodonut" bestandstype in te stellen. Maak een directory genaamd `ftdetect/` in de runtime root (`~/.vim/`). Maak daarin een bestand en noem het `chocodonut.vim` (`~/.vim/ftdetect/chocodonut.vim`). Voeg dit toe aan dit bestand:

```shell
autocmd BufNewFile,BufRead *.chocodonut set filetype=chocodonut
```

`BufNewFile` en `BufRead` worden geactiveerd telkens wanneer je een nieuwe buffer aanmaakt en een nieuwe buffer opent. `*.chocodonut` betekent dat deze gebeurtenis alleen wordt geactiveerd als de geopende buffer een `.chocodonut` bestandsnaam extensie heeft. Ten slotte stelt het commando `set filetype=chocodonut` het bestandstype in op een chocodonut-type.

Herstart Vim. Open nu het bestand `hello.chocodonut` en voer `:set filetype?` uit. Het retourneert `filetype=chocodonut`.

Heerlijk! Je kunt zoveel bestanden als je wilt in `ftdetect/` plaatsen. In de toekomst kun je misschien `ftdetect/strawberrydonut.vim`, `ftdetect/plaindonut.vim`, enz. toevoegen, als je ooit besluit om je donut-bestandstypen uit te breiden.

Er zijn eigenlijk twee manieren om een bestandstype in Vim in te stellen. De ene is wat je net hebt gebruikt `set filetype=chocodonut`. De andere manier is om `setfiletype chocodonut` uit te voeren. Het eerste commando `set filetype=chocodonut` zal *altijd* het bestandstype instellen op chocodonut-type, terwijl het laatste commando `setfiletype chocodonut` het bestandstype alleen zal instellen als er nog geen bestandstype was ingesteld.

#### Bestandstype Bestand

De tweede methode voor bestandsdetectie vereist dat je een `filetype.vim` in de rootdirectory maakt (`~/.vim/filetype.vim`). Voeg dit toe:

```shell
autocmd BufNewFile,BufRead *.plaindonut set filetype=plaindonut
```

Maak een bestand `hello.plaindonut`. Wanneer je het opent en `:set filetype?` uitvoert, toont Vim het juiste aangepaste bestandstype `filetype=plaindonut`.

Heilige gebakjes, het werkt! Trouwens, als je speelt met `filetype.vim`, merk je misschien dat dit bestand meerdere keren wordt uitgevoerd wanneer je `hello.plaindonut` opent. Om dit te voorkomen, kun je een guard toevoegen zodat het hoofdscript slechts één keer wordt uitgevoerd. Werk de `filetype.vim` bij:

```shell
if exists("did_load_filetypes")
  finish
endif

augroup donutfiletypedetection
  autocmd! BufRead,BufNewFile *.plaindonut setfiletype plaindonut
augroup END
```

`finish` is een Vim-commando om te stoppen met het uitvoeren van de rest van het script. De `"did_load_filetypes"` expressie is *geen* ingebouwde Vim-functie. Het is eigenlijk een globale variabele van binnen `$VIMRUNTIME/filetype.vim`. Als je nieuwsgierig bent, voer `:e $VIMRUNTIME/filetype.vim` uit. Je zult deze regels daarbinnen vinden:

```shell
if exists("did_load_filetypes")
  finish
endif

let did_load_filetypes = 1
```

Wanneer Vim dit bestand aanroept, definieert het de variabele `did_load_filetypes` en stelt deze in op 1. 1 is waarachtig in Vim. Je zou de rest van de `filetype.vim` ook moeten lezen. Kijk of je kunt begrijpen wat het doet wanneer Vim het aanroept.

### Bestandstype Script

Laten we leren hoe we een bestandstype kunnen detecteren en toewijzen op basis van de bestandsinhoud.

Stel dat je een verzameling bestanden hebt zonder een acceptabele extensie. Het enige wat deze bestanden gemeen hebben, is dat ze allemaal beginnen met het woord "donutify" op de eerste regel. Je wilt deze bestanden toewijzen aan een `donut` bestandstype. Maak nieuwe bestanden aan met de namen `sugardonut`, `glazeddonut`, en `frieddonut` (zonder extensie). Voeg in elk bestand deze regel toe:

```shell
donutify
```

Wanneer je `:set filetype?` uitvoert vanuit `sugardonut`, weet Vim niet welk bestandstype aan dit bestand moet worden toegewezen. Het retourneert `filetype=`.

Voeg in de runtime root pad een `scripts.vim` bestand toe (`~/.vim/scripts.vim`). Voeg hierin het volgende toe:

```shell
if did_filetype()
  finish
endif

if getline(1) =~ '^\\<donutify\\>'
  setfiletype donut
endif
```

De functie `getline(1)` retourneert de tekst op de eerste regel. Het controleert of de eerste regel begint met het woord "donutify". De functie `did_filetype()` is een ingebouwde Vim-functie. Het retourneert waarachtig wanneer een bestandstype gerelateerde gebeurtenis ten minste één keer is geactiveerd. Het wordt gebruikt als een guard om te voorkomen dat de bestandstype gebeurtenis opnieuw wordt uitgevoerd.

Open het bestand `sugardonut` en voer `:set filetype?` uit, Vim retourneert nu `filetype=donut`. Als je andere donut-bestanden opent (`glazeddonut` en `frieddonut`), identificeert Vim ook hun bestandstypen als `donut` types.

Let op dat `scripts.vim` alleen wordt uitgevoerd wanneer Vim een bestand opent met een onbekend bestandstype. Als Vim een bestand opent met een bekend bestandstype, wordt `scripts.vim` niet uitgevoerd.

## Bestandstype Plugin

Wat als je wilt dat Vim chocodonut-specifieke scripts uitvoert wanneer je een chocodonut-bestand opent en die scripts niet uitvoert bij het openen van een plaindonut-bestand?

Je kunt dit doen met het bestandstype plugin runtime-pad (`~/.vim/ftplugin/`). Vim kijkt in deze directory naar een bestand met dezelfde naam als het bestandstype dat je zojuist hebt geopend. Maak een `chocodonut.vim` aan (`~/.vim/ftplugin/chocodonut.vim`):

```shell
echo "Calling from chocodonut ftplugin"
```

Maak een ander ftplugin-bestand aan, `plaindonut.vim` (`~/.vim/ftplugin/plaindonut.vim`):

```shell
echo "Calling from plaindonut ftplugin"
```

Nu, elke keer dat je een chocodonut-bestandstype opent, voert Vim de scripts uit van `~/.vim/ftplugin/chocodonut.vim`. Elke keer dat je een plaindonut-bestandstype opent, voert Vim de scripts uit van `~/.vim/ftplugin/plaindonut.vim`.

Een waarschuwing: deze bestanden worden elke keer uitgevoerd wanneer een buffer-bestandstype wordt ingesteld (`set filetype=chocodonut` bijvoorbeeld). Als je 3 verschillende chocodonut-bestanden opent, worden de scripts in totaal *drie keer* uitgevoerd.

## Indent Bestanden

Vim heeft een indent runtime-pad dat werkt zoals ftplugin, waarbij Vim zoekt naar een bestand met dezelfde naam als het geopende bestandstype. Het doel van deze indent runtime-paden is om indent-gerelateerde codes op te slaan. Als je het bestand `~/.vim/indent/chocodonut.vim` hebt, wordt het alleen uitgevoerd wanneer je een chocodonut-bestandstype opent. Je kunt hier indent-gerelateerde codes voor chocodonut-bestanden opslaan.

## Kleuren

Vim heeft een kleuren runtime-pad (`~/.vim/colors/`) om kleurenschema's op te slaan. Elk bestand dat in de directory gaat, zal worden weergegeven in het `:color` commandoregelcommando.

Als je een `~/.vim/colors/beautifulprettycolors.vim` bestand hebt, wanneer je `:color` uitvoert en op Tab drukt, zie je `beautifulprettycolors` als een van de kleur opties. Als je je eigen kleurenschema wilt toevoegen, is dit de plek om te zijn.

Als je de kleurenschema's wilt bekijken die andere mensen hebben gemaakt, is een goede plek om te bezoeken [vimcolors](https://vimcolors.com/).

## Syntax Highlighting

Vim heeft een syntax runtime-pad (`~/.vim/syntax/`) om syntax highlighting te definiëren.

Stel dat je een `hello.chocodonut` bestand hebt, waarin je de volgende expressies hebt:

```shell
(donut "tasty")
(donut "savory")
```

Hoewel Vim nu het juiste bestandstype kent, hebben alle teksten dezelfde kleur. Laten we een syntax highlighting regel toevoegen om het "donut" sleutelwoord te markeren. Maak een nieuw chocodonut syntax-bestand, `~/.vim/syntax/chocodonut.vim`. Voeg hierin toe:

```shell
syntax keyword donutKeyword donut

highlight link donutKeyword Keyword
```

Heropen nu het `hello.chocodonut` bestand. De `donut` sleutelwoorden zijn nu gemarkeerd.

Dit hoofdstuk zal niet diep ingaan op syntax highlighting. Het is een uitgebreid onderwerp. Als je nieuwsgierig bent, kijk dan naar `:h syntax.txt`.

De [vim-polyglot](https://github.com/sheerun/vim-polyglot) plugin is een geweldige plugin die highlights biedt voor veel populaire programmeertalen.

## Documentatie

Als je een plugin maakt, moet je je eigen documentatie maken. Je gebruikt het doc runtime-pad daarvoor.

Laten we een basisdocumentatie voor chocodonut en plaindonut sleutelwoorden maken. Maak een `donut.txt` (`~/.vim/doc/donut.txt`). Voeg hierin deze teksten toe:

```shell
*chocodonut* Heerlijke chocolade donut

*plaindonut* Geen choco goedheid maar nog steeds heerlijk
```

Als je probeert te zoeken naar `chocodonut` en `plaindonut` (`:h chocodonut` en `:h plaindonut`), zul je niets vinden.

Eerst moet je `:helptags` uitvoeren om nieuwe help-items te genereren. Voer `:helptags ~/.vim/doc/` uit.

Nu, als je `:h chocodonut` en `:h plaindonut` uitvoert, vind je deze nieuwe help-items. Merk op dat het bestand nu alleen-lezen is en een "help" bestandstype heeft.
## Luie Laad Scripts

Alle runtime-paden die je in dit hoofdstuk hebt geleerd, werden automatisch uitgevoerd. Als je handmatig een script wilt laden, gebruik dan het autoload-runtimepad.

Maak een autoload-directory (`~/.vim/autoload/`). Maak binnen die directory een nieuw bestand aan en noem het `tasty.vim` (`~/.vim/autoload/tasty.vim`). Plaats hierin:

```shell
echo "tasty.vim global"

function tasty#donut()
  echo "tasty#donut"
endfunction
```

Let op dat de functienaam `tasty#donut` is, niet `donut()`. Het hekje (`#`) is vereist bij het gebruik van de autoload-functie. De naamgevingsconventie voor de autoload-functie is:

```shell
function fileName#functionName()
  ...
endfunction
```

In dit geval is de bestandsnaam `tasty.vim` en de functienaam is (technisch gezien) `donut`.

Om een functie aan te roepen, heb je het `call`-commando nodig. Laten we die functie aanroepen met `:call tasty#donut()`.

De eerste keer dat je de functie aanroept, zou je *beide* echo-berichten moeten zien ("tasty.vim global" en "tasty#donut"). De volgende aanroepen van de `tasty#donut` functie zullen alleen "testy#donut" echo weergeven.

Wanneer je een bestand opent in Vim, worden autoload-scripts, in tegenstelling tot de vorige runtime-paden, niet automatisch geladen. Alleen wanneer je expliciet `tasty#donut()` aanroept, zoekt Vim naar het `tasty.vim`-bestand en laadt alles erin, inclusief de `tasty#donut()` functie. Autoload is het perfecte mechanisme voor functies die veel middelen gebruiken, maar die je niet vaak gebruikt.

Je kunt zoveel geneste directories met autoload toevoegen als je wilt. Als je het runtime-pad `~/.vim/autoload/one/two/three/tasty.vim` hebt, kun je de functie aanroepen met `:call one#two#three#tasty#donut()`.

## Na Scripts

Vim heeft een after-runtime-pad (`~/.vim/after/`) dat de structuur van `~/.vim/` weerspiegelt. Alles in dit pad wordt als laatste uitgevoerd, dus ontwikkelaars gebruiken deze paden meestal voor scriptoverschrijvingen.

Bijvoorbeeld, als je de scripts van `plugin/chocolate.vim` wilt overschrijven, kun je `~/.vim/after/plugin/chocolate.vim` maken om de overschrijvingsscripts te plaatsen. Vim zal de `~/.vim/after/plugin/chocolate.vim` *na* `~/.vim/plugin/chocolate.vim` uitvoeren.

## $VIMRUNTIME

Vim heeft een omgevingsvariabele `$VIMRUNTIME` voor standaard scripts en ondersteuningsbestanden. Je kunt het bekijken door `:e $VIMRUNTIME` uit te voeren.

De structuur zou bekend moeten zijn. Het bevat veel runtime-paden die je in dit hoofdstuk hebt geleerd.

Vergeet niet dat je in Hoofdstuk 21 hebt geleerd dat wanneer je Vim opent, het zoekt naar vimrc-bestanden op zeven verschillende locaties. Ik zei dat de laatste locatie die Vim controleert `$VIMRUNTIME/defaults.vim` is. Als Vim geen gebruikers vimrc-bestanden kan vinden, gebruikt Vim een `defaults.vim` als vimrc.

Heb je ooit geprobeerd Vim uit te voeren zonder een syntax-plugin zoals vim-polyglot en toch is je bestand nog steeds syntactisch gemarkeerd? Dat komt omdat wanneer Vim geen syntax-bestand kan vinden vanuit het runtime-pad, Vim zoekt naar een syntax-bestand uit de `$VIMRUNTIME` syntax-directory.

Om meer te leren, kijk naar `:h $VIMRUNTIME`.

## Runtimepath Optie

Om je runtimepath te controleren, voer je `:set runtimepath?` uit.

Als je Vim-Plug of populaire externe pluginbeheerders gebruikt, zou het een lijst van directories moeten weergeven. Bijvoorbeeld, de mijne toont:

```shell
runtimepath=~/.vim,~/.vim/plugged/vim-signify,~/.vim/plugged/base16-vim,~/.vim/plugged/fzf.vim,~/.vim/plugged/fzf,~/.vim/plugged/vim-gutentags,~/.vim/plugged/tcomment_vim,~/.vim/plugged/emmet-vim,~/.vim/plugged/vim-fugitive,~/.vim/plugged/vim-sensible,~/.vim/plugged/lightline.vim, ...
```

Een van de dingen die pluginbeheerders doen, is het toevoegen van elke plugin aan het runtime-pad. Elk runtime-pad kan zijn eigen directorystructuur hebben, vergelijkbaar met `~/.vim/`.

Als je een directory `~/box/of/donuts/` hebt en je wilt die directory aan je runtime-pad toevoegen, kun je dit aan je vimrc toevoegen:

```shell
set rtp+=$HOME/box/of/donuts/
```

Als je binnen `~/box/of/donuts/` een plugin-directory hebt (`~/box/of/donuts/plugin/hello.vim`) en een ftplugin (`~/box/of/donuts/ftplugin/chocodonut.vim`), zal Vim alle scripts van `plugin/hello.vim` uitvoeren wanneer je Vim opent. Vim zal ook `ftplugin/chocodonut.vim` uitvoeren wanneer je een chocodonut-bestand opent.

Probeer dit zelf: maak een willekeurig pad aan en voeg het toe aan je runtimepath. Voeg enkele van de runtime-paden toe die je in dit hoofdstuk hebt geleerd. Zorg ervoor dat ze werken zoals verwacht.

## Leer Runtime de Slimme Manier

Neem de tijd om het te lezen en speel met deze runtime-paden. Om te zien hoe runtime-paden in de praktijk worden gebruikt, ga naar de repository van een van je favoriete Vim-plugins en bestudeer de directorystructuur. Je zou nu de meeste ervan moeten begrijpen. Probeer mee te volgen en het grote geheel te onderscheiden. Nu je de Vim-directorystructuur begrijpt, ben je klaar om Vimscript te leren.