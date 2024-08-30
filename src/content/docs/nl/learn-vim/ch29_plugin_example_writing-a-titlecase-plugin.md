---
description: Leer hoe je je eigen Vim-plugin kunt maken met de `totitle-vim` plugin,
  die titelcase ondersteunt voor betere koppen in je artikelen.
title: 'Ch29. Write a Plugin: Creating a Titlecase Operator'
---

Wanneer je goed begint te worden in Vim, wil je misschien je eigen plugins schrijven. Onlangs heb ik mijn eerste Vim-plugin geschreven, [totitle-vim](https://github.com/iggredible/totitle-vim). Het is een titlecase operator plugin, vergelijkbaar met Vim's uppercase `gU`, lowercase `gu`, en togglecase `g~` operators.

In dit hoofdstuk zal ik de opbouw van de `totitle-vim` plugin presenteren. Ik hoop wat licht te werpen op het proces en je misschien te inspireren om je eigen unieke plugin te maken!

## Het Probleem

Ik gebruik Vim om mijn artikelen te schrijven, inclusief deze gids.

Een belangrijk probleem was om een goede titelcase voor de koppen te creëren. Een manier om dit te automatiseren is door elk woord in de kop te kapitaliseren met `g/^#/ s/\<./\u\0/g`. Voor basisgebruik was deze opdracht goed genoeg, maar het is nog steeds niet zo goed als een echte titelcase. De woorden "The" en "Of" in "Capitalize The First Letter Of Each Word" zouden gecapitaliseerd moeten worden. Zonder een goede kapitalisatie lijkt de zin een beetje off.

In het begin was ik niet van plan om een plugin te schrijven. Ook blijkt dat er al een titlecase plugin is: [vim-titlecase](https://github.com/christoomey/vim-titlecase). Echter, er waren een paar dingen die niet helemaal functioneerden zoals ik wilde. De belangrijkste was het blockwise visual mode gedrag. Als ik de zin heb:

```shell
test title one
test title two
test title three
```

Als ik een block visual highlight gebruik op de "tle":

```shell
test ti[tle] one
test ti[tle] twee
test ti[tle] drie
```

Als ik `gt` druk, zal de plugin het niet kapitaliseren. Ik vind het inconsistent met het gedrag van `gu`, `gU`, en `g~`. Dus besloot ik om vanaf die titlecase plugin repo te werken en die te gebruiken om zelf een titlecase plugin te maken die consistent is met `gu`, `gU`, en `g~`!. Nogmaals, de vim-titlecase plugin zelf is een uitstekende plugin en het is de moeite waard om op zichzelf te gebruiken (de waarheid is, misschien wilde ik diep van binnen gewoon mijn eigen Vim-plugin schrijven. Ik kan me de blockwise titlecasing functie in het echte leven niet zo vaak voorstellen, behalve in uitzonderlijke gevallen).

### Planning voor de Plugin

Voordat ik de eerste regel code schrijf, moet ik beslissen wat de regels voor titlecase zijn. Ik vond een nette tabel met verschillende kapitalisatie regels op de [titlecaseconverter site](https://titlecaseconverter.com/rules/). Wist je dat er minstens 8 verschillende kapitalisatie regels in de Engelse taal zijn? *Gasp!*

Uiteindelijk gebruikte ik de gemeenschappelijke noemers uit die lijst om een goede basisregel voor de plugin te bedenken. Bovendien betwijfel ik of mensen zullen klagen: "Hé man, je gebruikt AMA, waarom gebruik je geen APA?". Hier zijn de basisregels:
- Het eerste woord is altijd met een hoofdletter.
- Sommige bijwoorden, voegwoorden en voorzetsels zijn met kleine letters.
- Als het invoerwoord volledig met hoofdletters is, doe dan niets (het kan een afkorting zijn).

Wat betreft welke woorden met kleine letters zijn, hebben verschillende regels verschillende lijsten. Ik besloot te blijven bij `a an and at but by en for in nor of off on or out per so the to up yet vs via`.

### Planning voor de Gebruikersinterface

Ik wil dat de plugin een operator is om de bestaande case operators van Vim aan te vullen: `gu`, `gU`, en `g~`. Als operator moet het een beweging of een tekstobject accepteren (`gtw` zou het volgende woord in titlecase moeten zetten, `gtiw` zou het binnenste woord in titlecase moeten zetten, `gt$` zou de woorden van de huidige locatie tot het einde van de regel in titlecase moeten zetten, `gtt` zou de huidige regel in titlecase moeten zetten, `gti(` zou de woorden binnen haakjes in titlecase moeten zetten, enzovoort). Ik wil ook dat het is toegewezen aan `gt` voor gemakkelijke geheugensteuntjes. Bovendien zou het ook moeten werken met alle visual modes: `v`, `V`, en `Ctrl-V`. Ik zou het in *elke* visual mode moeten kunnen markeren, `gt` drukken, en dan zullen alle gemarkeerde teksten in titlecase worden gezet.

## Vim Runtime

Het eerste dat je ziet wanneer je naar de repo kijkt, is dat het twee mappen heeft: `plugin/` en `doc/`. Wanneer je Vim start, zoekt het naar speciale bestanden en mappen in de `~/.vim` map en voert het alle scriptbestanden in die map uit. Voor meer informatie, bekijk het Vim Runtime hoofdstuk.

De plugin maakt gebruik van twee Vim runtime mappen: `doc/` en `plugin/`. `doc/` is een plek om de helpdocumentatie te plaatsen (zodat je later op zoek kunt gaan naar trefwoorden, zoals `:h totitle`). Ik zal later uitleggen hoe je een help-pagina maakt. Voor nu, laten we ons concentreren op `plugin/`. De `plugin/` map wordt één keer uitgevoerd wanneer Vim opstart. Er is één bestand in deze map: `totitle.vim`. De naam doet er niet toe (ik had het `whatever.vim` kunnen noemen en het zou nog steeds werken). Alle code die verantwoordelijk is voor het functioneren van de plugin bevindt zich in dit bestand.

## Mappings

Laten we door de code gaan!

Aan het begin van het bestand heb je:

```shell
if !exists('g:totitle_default_keys')
  let g:totitle_default_keys = 1
endif
```

Wanneer je Vim start, bestaat `g:totitle_default_keys` nog niet, dus `!exists(...)` retourneert waar. In dat geval definieer je `g:totitle_default_keys` om gelijk te zijn aan 1. In Vim is 0 vals en niet-nul is waar (gebruik 1 om waar aan te geven).

Laten we naar de onderkant van het bestand springen. Je zult dit zien:

```shell
if g:totitle_default_keys
  nnoremap <expr> gt ToTitle()
  xnoremap <expr> gt ToTitle()
  nnoremap <expr> gtt ToTitle() .. '_'
endif
```

Dit is waar de belangrijkste `gt` mapping wordt gedefinieerd. In dit geval, tegen de tijd dat je bij de `if` voorwaarden aan de onderkant van het bestand komt, zou `if g:totitle_default_keys` 1 retourneren (waar), dus Vim voert de volgende mappings uit:
- `nnoremap <expr> gt ToTitle()` map de normale mode *operator*. Dit laat je operator + beweging/tekst-object uitvoeren zoals `gtw` om het volgende woord in titlecase te zetten of `gtiw` om het binnenste woord in titlecase te zetten. Ik zal later de details van hoe de operator mapping werkt uitleggen.
- `xnoremap <expr> gt ToTitle()` map de visual mode operators. Dit laat je toe om de teksten die visueel zijn gemarkeerd in titlecase te zetten.
- `nnoremap <expr> gtt ToTitle() .. '_'` map de normale mode linewise operator (vergelijkbaar met `guu` en `gUU`). Je vraagt je misschien af wat `.. '_'` aan het einde doet. `..` is de string interpolatie operator van Vim. `_` wordt gebruikt als een beweging met een operator. Als je kijkt in `:help _`, staat er dat de underscore wordt gebruikt om 1 regel naar beneden te tellen. Het voert een operator uit op de huidige regel (probeer het met andere operators, probeer `gU_` of `d_` uit, merk op dat het hetzelfde doet als `gUU` of `dd`).
- Ten slotte laat het `<expr>` argument je de telling specificeren, zodat je `3gtw` kunt doen om de volgende 3 woorden in titlecase te zetten.

Wat als je de standaard `gt` mapping niet wilt gebruiken? Tenslotte overschrijf je de standaard `gt` (tab volgende) mapping van Vim. Wat als je `gz` in plaats van `gt` wilt gebruiken? Vergeet niet eerder hoe je de moeite nam om te controleren `if !exists('g:totitle_default_keys')` en `if g:totitle_default_keys`? Als je `let g:totitle_default_keys = 0` in je vimrc plaatst, dan zou `g:totitle_default_keys` al bestaan wanneer de plugin wordt uitgevoerd (codes in je vimrc worden uitgevoerd voordat de `plugin/` runtime bestanden), dus `!exists('g:totitle_default_keys')` retourneert vals. Bovendien zou `if g:totitle_default_keys` vals zijn (omdat het de waarde 0 zou hebben), dus het zal ook de `gt` mapping niet uitvoeren! Dit laat je effectief je eigen aangepaste mapping in Vimrc definiëren.

Om je eigen titlecase mapping naar `gz` te definiëren, voeg dit toe aan je vimrc:

```shell
let g:totitle_default_keys = 0

nnoremap <expr> gz ToTitle()
xnoremap <expr> gz ToTitle()
nnoremap <expr> gzz ToTitle() .. '_'
```

Eenvoudig zat.

## De ToTitle Functie

De `ToTitle()` functie is gemakkelijk de langste functie in dit bestand.

```shell
 function! ToTitle(type = '')
  if a:type ==# ''
    set opfunc=ToTitle
    return 'g@'
  endif

  " roep dit aan wanneer je de ToTitle() functie aanroept
  if a:type != 'block' && a:type != 'line' && a:type != 'char'
    let l:words = a:type
    let l:wordsArr = trim(l:words)->split('\s\+')
    call map(l:wordsArr, 's:capitalize(v:val)')
    return l:wordsArr->join(' ')
  endif

  " sla de huidige instellingen op
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

    " wanneer de gebruiker een block operatie aanroept
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

    " wanneer de gebruiker een char of line operatie aanroept
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

    " herstel de instellingen
    call setreg('"', l:reg_save)
    call setpos("'<", l:visual_marks_save[0])
    call setpos("'>", l:visual_marks_save[1])
    let &clipboard = l:cb_save
    let &selection = l:sel_save
  endtry
  return
endfunction
```

Dit is erg lang, dus laten we het opsplitsen.

*Ik zou dit in kleinere secties kunnen refactoren, maar om deze hoofdstuk te voltooien, heb ik het gewoon zo gelaten.*
## De Operatorfunctie

Hier is het eerste deel van de code:

```shell
if a:type ==# ''
  set opfunc=ToTitle
  return 'g@'
endif
```

Wat is `opfunc`? Waarom retourneert het `g@`?

Vim heeft een speciale operator, de operatorfunctie, `g@`. Deze operator stelt je in staat om *elke* functie die aan de `opfunc`-optie is toegewezen te gebruiken. Als ik de functie `Foo()` aan `opfunc` heb toegewezen, dan voer ik `Foo()` uit op het volgende woord wanneer ik `g@w` uitvoer. Als ik `g@i(` uitvoer, dan voer ik `Foo()` uit op de binnenste haakjes. Deze operatorfunctie is cruciaal om je eigen Vim-operator te creëren.

De volgende regel wijst de `opfunc` toe aan de `ToTitle`-functie.

```shell
set opfunc=ToTitle
```

De volgende regel retourneert letterlijk `g@`:

```shell
return g@
```

Dus hoe werken deze twee regels precies en waarom retourneert het `g@`?

Laten we aannemen dat je de volgende map hebt:

```shell
nnoremap <expr> gt ToTitle()`
```

Dan druk je op `gtw` (zet de eerste letter van het volgende woord in hoofdletters). De eerste keer dat je `gtw` uitvoert, roept Vim de `ToTitle()`-methode aan. Maar op dit moment is `opfunc` nog steeds leeg. Je geeft ook geen argument door aan `ToTitle()`, dus het zal een waarde van `a:type` van `''` hebben. Dit zorgt ervoor dat de voorwaardelijke expressie om het argument `a:type`, `if a:type ==# ''`, waarachtig te zijn. Binnenin wijs je `opfunc` toe aan de `ToTitle`-functie met `set opfunc=ToTitle`. Nu is `opfunc` toegewezen aan `ToTitle`. Uiteindelijk, nadat je `opfunc` aan de `ToTitle`-functie hebt toegewezen, retourneer je `g@`. Ik zal uitleggen waarom het `g@` retourneert hieronder.

Je bent nog niet klaar. Vergeet niet, je hebt net op `gtw` gedrukt. Het indrukken van `gt` heeft al deze dingen gedaan, maar je hebt nog steeds `w` te verwerken. Door `g@` te retourneren, heb je op dit moment technisch gezien `g@w` (dit is waarom je `return g@` hebt). Aangezien `g@` de functieoperator is, geef je de `w`-beweging door. Dus Vim, bij het ontvangen van `g@w`, roept de `ToTitle` *nog een keer* aan (maak je geen zorgen, je komt niet in een oneindige lus terecht zoals je zo meteen zult zien).

Om samen te vatten, door op `gtw` te drukken, controleert Vim of `opfunc` leeg is of niet. Als het leeg is, dan zal Vim het toewijzen aan `ToTitle`. Dan retourneert het `g@`, wat in wezen de `ToTitle` nog een keer aanroept, zodat je het nu als een operator kunt gebruiken. Dit is het moeilijkste deel van het maken van een aangepaste operator en je hebt het gedaan! Vervolgens moet je de logica voor `ToTitle()` bouwen om de invoer daadwerkelijk in hoofdletters te zetten.

## De Invoer Verwerken

Je hebt nu `gt` dat functioneert als een operator die `ToTitle()` uitvoert. Maar wat doe je daarna? Hoe zet je de tekst daadwerkelijk in hoofdletters?

Wanneer je een operator in Vim uitvoert, zijn er drie verschillende actiebewegingstypes: teken, regel en blok. `g@w` (woord) is een voorbeeld van een tekenbewerking. `g@j` (één regel naar beneden) is een voorbeeld van een regelbewerking. Blokbewerkingen zijn zeldzaam, maar meestal wanneer je een `Ctrl-V` (visuele blok) operatie uitvoert, wordt dit geteld als een blokbewerking. Bewerkingen die een paar tekens vooruit / achteruit richten, worden over het algemeen beschouwd als tekenbewerkingen (`b`, `e`, `w`, `ge`, enz.). Bewerkingen die een paar regels naar beneden / omhoog richten, worden over het algemeen beschouwd als regelbewerkingen (`j`, `k`). Bewerkingen die kolommen vooruit, achteruit, omhoog of omlaag richten, worden over het algemeen beschouwd als blokbewerkingen (ze zijn meestal ofwel een kolomgewijze geforceerde beweging of een blokgewijze visuele modus; voor meer: `:h forced-motion`).

Dit betekent dat als je `g@w` indrukt, `g@` een letterlijke string `"char"` als argument aan `ToTitle()` doorgeeft. Als je `g@j` doet, zal `g@` een letterlijke string `"line"` als argument aan `ToTitle()` doorgeven. Deze string is wat als het `type`-argument in de `ToTitle`-functie zal worden doorgegeven.

## Je Eigen Aangepaste Functieoperator Maken

Laten we pauzeren en spelen met `g@` door een dummyfunctie te schrijven:

```shell
function! Test(some_arg)
  echom a:some_arg 
endfunction
```

Wijs nu die functie toe aan `opfunc` door uit te voeren:

```shell
:set opfunc=Test
```

De `g@`-operator zal `Test(some_arg)` uitvoeren en het doorgeven met ofwel `"char"`, `"line"` of `"block"` afhankelijk van welke bewerking je doet. Voer verschillende bewerkingen uit zoals `g@iw` (binnenste woord), `g@j` (één regel naar beneden), `g@$` (tot het einde van de regel), enz. Kijk welke verschillende waarden worden weergegeven. Om de blokbewerking te testen, kun je de geforceerde beweging van Vim voor blokbewerkingen gebruiken: `g@Ctrl-Vj` (blokbewerking één kolom naar beneden).

Je kunt het ook gebruiken met de visuele modus. Gebruik de verschillende visuele markeringen zoals `v`, `V`, en `Ctrl-V` en druk dan op `g@` (wees gewaarschuwd, het zal de uitvoer snel flitsen, dus je moet een snelle blik hebben - maar de echo is er zeker. Ook, omdat je `echom` gebruikt, kun je de geregistreerde echo-berichten controleren met `:messages`).

Best cool, nietwaar? De dingen die je kunt programmeren met Vim! Waarom hebben ze dit niet op school geleerd? Laten we verder gaan met onze plugin.

## ToTitle Als Een Functie

Laten we verder gaan met de volgende paar regels:

```shell
if a:type != 'block' && a:type != 'line' && a:type != 'char'
  let l:words = a:type
  let l:wordsArr = trim(l:words)->split('\s\+')
  call map(l:wordsArr, 's:capitalize(v:val)')
  return l:wordsArr->join(' ')
endif
```

Deze regel heeft eigenlijk niets te maken met het gedrag van `ToTitle()` als een operator, maar om het in een oproepbare TitleCase-functie te activeren (ja, ik weet dat ik het Single Responsibility Principle schend). De motivatie is, Vim heeft native `toupper()` en `tolower()` functies die elke gegeven string in hoofdletters of kleine letters zullen zetten. Bijv: `:echo toupper('hello')` retourneert `'HELLO'` en `:echo tolower('HELLO')` retourneert `'hello'`. Ik wil dat deze plugin de mogelijkheid heeft om `ToTitle` uit te voeren, zodat je `:echo ToTitle('once upon a time')` kunt doen en een `'Once Upon a Time'` retourwaarde krijgt.

Tegenwoordig weet je dat wanneer je `ToTitle(type)` aanroept met `g@`, het `type`-argument een waarde zal hebben van ofwel `'block'`, `'line'`, of `'char'`. Als het argument noch `'block'`, noch `'line'`, noch `'char'` is, kun je veilig aannemen dat `ToTitle()` buiten `g@` wordt aangeroepen. In dat geval split je ze op witruimtes (`\s\+`) met:

```shell
let l:wordsArr = trim(l:words)->split('\s\+')
```

Vervolgens kapitaliseer je elk element:

```shell
call map(l:wordsArr, 's:capitalize(v:val)')
```

Voordat je ze weer samenvoegt:

```shell
l:wordsArr->join(' ')
```

De `capitalize()`-functie zal later worden behandeld.

## Tijdelijke Variabelen

De volgende paar regels:

```shell
let l:sel_save = &selection
let l:reg_save = getreginfo('"')
let l:cb_save = &clipboard
let l:visual_marks_save = [getpos("'<"), getpos("'>")]
```

Deze regels behouden verschillende huidige staten in tijdelijke variabelen. Later in dit proces zul je visuele modi, markeringen en registers gebruiken. Dit zal een paar staten beïnvloeden. Aangezien je de geschiedenis niet wilt herzien, moet je ze opslaan in tijdelijke variabelen zodat je de staten later kunt herstellen.
## Hoofdlettergebruik van de Selecties

De volgende regels zijn belangrijk:

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
Laten we ze in kleine stukjes doornemen. Deze regel:

```shell
set clipboard= selection=inclusive
```

Je stelt eerst de `selection` optie in op inclusief en de `clipboard` op leeg. De selectie-attribuut wordt meestal gebruikt met de visuele modus en er zijn drie mogelijke waarden: `old`, `inclusive` en `exclusive`. Het instellen op inclusief betekent dat het laatste teken van de selectie is inbegrepen. Ik zal ze hier niet behandelen, maar het punt is dat het kiezen van inclusief ervoor zorgt dat het consistent werkt in de visuele modus. Standaard stelt Vim het in op inclusief, maar je stelt het hier toch in voor het geval een van je plugins het op een andere waarde instelt. Bekijk `:h 'clipboard'` en `:h 'selection'` als je nieuwsgierig bent naar wat ze echt doen.

Vervolgens heb je deze vreemd uitziende hash gevolgd door een uitvoercommando:

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
```

Eerst is de `#{}` syntaxis het woordenboek datatype van Vim. De lokale variabele `l:commands` is een hash met 'lines', 'char' en 'block' als zijn sleutels. De opdracht `silent exe '...'` voert elke opdracht binnen de string stilletjes uit (anders worden er meldingen onderaan je scherm weergegeven). 

Ten tweede zijn de uitgevoerde opdrachten `'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')`. De eerste, `noautocmd`, voert de daaropvolgende opdracht uit zonder enige autocommand te activeren. De tweede, `keepjumps`, is om de cursorbeweging niet vast te leggen tijdens het bewegen. In Vim worden bepaalde bewegingen automatisch vastgelegd in de wijzigingslijst, de springlijst en de markeerlijst. Dit voorkomt dat. Het doel van `noautocmd` en `keepjumps` is om bijeffecten te voorkomen. Ten slotte voert het `normal` commando de strings uit als normale commando's. De `..` is de string interpolatie syntaxis van Vim. `get()` is een getter-methode die een lijst, blob of woordenboek accepteert. In dit geval geef je het woordenboek `l:commands` door. De sleutel is `a:type`. Je hebt eerder geleerd dat `a:type` een van de drie stringwaarden is: 'char', 'line' of 'block'. Dus als `a:type` 'line' is, voer je `"noautocmd keepjumps normal! '[V']y"` uit (voor meer, kijk naar `:h silent`, `:h :exe`, `:h :noautocmd`, `:h :keepjumps`, `:h :normal`, en `:h get()`).

Laten we bekijken wat `'[V']y` doet. Stel eerst dat je deze tekst hebt:

```shell
de tweede ontbijt
is beter dan het eerste ontbijt
```
Stel dat je cursor op de eerste regel staat. Dan druk je op `g@j` (voer de operatorfunctie `g@` één regel naar beneden uit, met `j`). `'[` verplaatst de cursor naar het begin van de eerder gewijzigde of gekopieerde tekst. Hoewel je technisch gezien geen tekst hebt gewijzigd of gekopieerd met `g@j`, onthoudt Vim de locaties van de begin- en eindbewegingen van het `g@` commando met `'[` en `']` (voor meer, kijk naar `:h g@`). In jouw geval verplaatst het indrukken van `'[` je cursor naar de eerste regel omdat dat is waar je begon toen je `g@` uitvoerde. `V` is een lijngewijze visuele modusopdracht. Ten slotte verplaatst `']` je cursor naar het einde van de vorige gewijzigde of gekopieerde tekst, maar in dit geval verplaatst het je cursor naar het einde van je laatste `g@` operatie. Ten slotte kopieert `y` de geselecteerde tekst. 

Wat je net deed was het kopiëren van dezelfde tekst waar je `g@` op hebt uitgevoerd.

Als je naar de andere twee opdrachten hier kijkt:

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
```

Ze voeren allemaal vergelijkbare acties uit, behalve dat je in plaats van lijngewijze acties, karaktergewijze of blokgewijze acties zou gebruiken. Ik ga redundant klinken, maar in alle drie gevallen kopieer je effectief dezelfde tekst waar je `g@` op hebt uitgevoerd.

Laten we de volgende regel bekijken:

```shell
let l:selected_phrase = getreg('"')
```

Deze regel haalt de inhoud van het ongebruikte register (`"`) op en slaat deze op in de variabele `l:selected_phrase`. Wacht even... heb je net een stuk tekst gekopieerd? Het ongebruikte register bevat momenteel de tekst die je net hebt gekopieerd. Dit is hoe deze plugin een kopie van de tekst kan krijgen.

De volgende regel is een reguliere expressiepatroon:

```shell
let l:WORD_PATTERN = '\<\k*\>'
```

`\<` en `\>` zijn woordgrenspatronen. Het teken dat volgt op `\<` komt overeen met het begin van een woord en het teken dat voorafgaat aan `\>` komt overeen met het einde van een woord. `\k` is het sleutelwoordpatroon. Je kunt controleren welke tekens Vim accepteert als sleutelwoorden met `:set iskeyword?`. Herinner je dat de `w` beweging in Vim je cursor woordgewijs verplaatst. Vim heeft een vooraf bepaalde opvatting van wat een "sleutelwoord" is (je kunt ze zelfs bewerken door de `iskeyword` optie te wijzigen). Bekijk `:h /\<`, `:h /\>`, en `:h /\k`, en `:h 'iskeyword'` voor meer. Ten slotte betekent `*` nul of meer van het daaropvolgende patroon.

In grote lijnen komt `'\<\k*\>'` overeen met een woord. Als je een string hebt:

```shell
een twee drie
```

Het vergelijken met het patroon zal drie overeenkomsten opleveren: "een", "twee" en "drie".

Ten slotte heb je nog een patroon:

```shell
let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'
```

Vergeet niet dat de vervangopdracht van Vim kan worden gebruikt met een expressie met `\={jouw-expressie}`. Bijvoorbeeld, als je de string "donut" in de huidige regel wilt hoofdletteren, kun je de `toupper()` functie van Vim gebruiken. Je kunt dit bereiken door `:%s/donut/\=toupper(submatch(0))/g` uit te voeren. `submatch(0)` is een speciale expressie die wordt gebruikt in de vervangopdracht. Het retourneert de hele gematchte tekst.

De volgende twee regels:

```shell
let l:startLine = line("'<")
let l:startCol = virtcol(".")
```

De `line()` expressie retourneert een regelnummer. Hier geef je het door met de markering `'<`, die de eerste regel van het laatst geselecteerde visuele gebied vertegenwoordigt. Herinner je dat je visuele modus gebruikte om de tekst te kopiëren. `'<` retourneert het regelnummer van het begin van die visuele gebiedselectie. De `virtcol()` expressie retourneert een kolomnummer van de huidige cursor. Je zult je cursor straks overal verplaatsen, dus je moet je cursorlocatie opslaan zodat je hier later kunt terugkeren.

Neem hier een pauze en bekijk alles tot nu toe. Zorg ervoor dat je nog steeds volgt. Wanneer je er klaar voor bent, laten we verder gaan.
## Omgaan met een Blokoperatie

Laten we deze sectie doornemen:

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

Het is tijd om je tekst daadwerkelijk te kapitaliseren. Vergeet niet dat je `a:type` moet zijn 'char', 'line' of 'block'. In de meeste gevallen krijg je waarschijnlijk 'char' en 'line'. Maar af en toe kun je een blok krijgen. Het is zeldzaam, maar het moet toch worden aangepakt. Helaas is het omgaan met een blok niet zo eenvoudig als het omgaan met char en line. Het kost wat extra moeite, maar het is haalbaar.

Voordat je begint, laten we een voorbeeld bekijken van hoe je een blok kunt krijgen. Stel dat je deze tekst hebt:

```shell
pancake for breakfast
pancake for lunch
pancake for dinner
```

Stel dat je cursor op de "c" van "pancake" op de eerste regel staat. Je gebruikt dan de visuele blok (`Ctrl-V`) om naar beneden en vooruit te selecteren om de "cake" in alle drie de regels te selecteren:

```shell
pan[cake] for breakfast
pan[cake] for lunch
pan[cake] for dinner
```

Wanneer je `gt` indrukt, wil je krijgen:

```shell
panCake for breakfast
panCake for lunch
panCake for dinner

```
Hier zijn je basisveronderstellingen: wanneer je de drie "cakes" in "pancakes" markeert, vertel je Vim dat je drie regels woorden hebt die je wilt markeren. Deze woorden zijn "cake", "cake" en "cake". Je verwacht "Cake", "Cake" en "Cake" te krijgen.

Laten we verder gaan met de implementatiedetails. De volgende paar regels hebben:

```shell
sil! keepj norm! gv"ad
keepj $
keepj pu_
let l:lastLine = line("$")
sil! keepj norm "ap
let l:curLine = line(".")
```

De eerste regel:

```shell
sil! keepj norm! gv"ad
```

Vergeet niet dat `sil!` stilletjes draait en `keepj` de spronggeschiedenis bijhoudt bij het verplaatsen. Je voert dan de normale opdracht `gv"ad` uit. `gv` selecteert de laatst visueel gemarkeerde tekst (in het voorbeeld van de pannenkoeken, zal het alle drie de 'cakes' opnieuw markeren). `"ad` verwijdert de visueel gemarkeerde teksten en slaat ze op in register a. Als resultaat heb je nu:

```shell
pan for breakfast
pan for lunch
pan for dinner
```

Nu heb je 3 *blokken* (geen regels) van 'cakes' opgeslagen in register a. Dit onderscheid is belangrijk. Het yanken van een tekst met regelgewijze visuele modus is anders dan het yanken van een tekst met blokgewijze visuele modus. Houd hier rekening mee, want je zult dit later weer zien.

Vervolgens heb je:

```shell
keepj $
keepj pu_
```

`$` verplaatst je naar de laatste regel in je bestand. `pu_` voegt één regel onder de plaats in waar je cursor zich bevindt in. Je wilt ze uitvoeren met `keepj` zodat je de spronggeschiedenis niet verstoort.

Dan sla je het regelnummer van je laatste regel (`line("$")`) op in de lokale variabele `lastLine`.

```shell
let l:lastLine = line("$")
```

Plak vervolgens de inhoud van het register met `norm "ap`.

```shell
sil! keepj norm "ap
```

Houd er rekening mee dat dit gebeurt op de nieuwe regel die je onder de laatste regel van het bestand hebt gemaakt - je bevindt je momenteel onderaan het bestand. Plakken geeft je deze *blok* teksten:

```shell
cake
cake
cake
```

Vervolgens sla je de locatie van de huidige regel waar je cursor zich bevindt op.

```shell
let l:curLine = line(".")
```

Laten we nu naar de volgende paar regels gaan:

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

Deze regel:

```shell
sil! keepj norm! VGg@
```

`VG` markeert ze visueel met regelgewijze modus van de huidige regel tot het einde van het bestand. Dus hier markeer je de drie blokken van 'cake' teksten met regelgewijze markering (vergeet het onderscheid tussen blok en regel niet). Merk op dat de eerste keer dat je de drie "cake" teksten plakte, je ze als blokken plakte. Nu markeer je ze als regels. Ze lijken misschien hetzelfde van buitenaf, maar intern weet Vim het verschil tussen het plakken van blokken teksten en het plakken van regels teksten.

```shell
cake
cake
cake
```

`g@` is de functieoperator, dus je doet in wezen een recursieve oproep naar zichzelf. Maar waarom? Wat bereikt dit?

Je doet een recursieve oproep naar `g@` en geeft het alle 3 regels (na het uitvoeren met `V`, heb je nu regels, geen blokken) van 'cake' teksten zodat het door het andere deel van de code kan worden afgehandeld (je zult dit later doornemen). Het resultaat van het uitvoeren van `g@` is drie regels van correct gekapitaliseerde teksten:

```shell
Cake
Cake
Cake
```

De volgende regel:

```shell
exe "keepj norm! 0\<c-v>G$h\"ad"
```

Dit voert de normale modusopdracht uit om naar het begin van de regel te gaan (`0`), gebruik de blokvisuele markering om naar de laatste regel en het laatste teken op die regel te gaan (`<c-v>G$`). De `h` is om de cursor aan te passen (wanneer je `$` doet, verplaatst Vim zich één extra regel naar rechts). Ten slotte verwijder je de gemarkeerde tekst en sla je deze op in register a (`"ad`).

De volgende regel:

```shell
exe "keepj " . l:startLine
```

Je verplaatst je cursor terug naar waar de `startLine` was.

Vervolgens:

```shell
exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
```

Zijnde in de `startLine` locatie, spring je nu naar de kolom gemarkeerd door `startCol`. `\<bar>\` is de balk `|` beweging. De balkbeweging in Vim verplaatst je cursor naar de nth kolom (laten we zeggen dat de `startCol` 4 was. Het uitvoeren van `4|` zal je cursor naar de kolompositie van 4 springen). Vergeet niet dat je `startCol` de locatie was waar je de kolompositie van de tekst die je wilde kapitaliseren had opgeslagen. Ten slotte plakt `"aP` de teksten die in register a zijn opgeslagen. Dit plaatst de tekst terug naar waar deze eerder was verwijderd.

Laten we de volgende 4 regels bekijken:

```shell
exe "keepj " . l:lastLine
sil! keepj norm! "_dG
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

`exe "keepj " . l:lastLine` verplaatst je cursor terug naar de `lastLine` locatie van eerder. `sil! keepj norm! "_dG` verwijdert de extra ruimte(s) die zijn gemaakt met het blackhole-register (`"_dG`) zodat je ongebruikte register schoon blijft. `exe "keepj " . l:startLine` verplaatst je cursor terug naar `startLine`. Ten slotte, `exe "sil! keepj norm! " . l:startCol . "\<bar>"` verplaatst je cursor naar de `startCol` kolom.

Dit zijn allemaal acties die je handmatig in Vim had kunnen uitvoeren. De voordelen van het omzetten van deze acties in herbruikbare functies is dat ze je zullen besparen van het uitvoeren van 30+ regels instructies elke keer dat je iets moet kapitaliseren. Het belangrijkste punt hier is, alles wat je handmatig in Vim kunt doen, kun je omzetten in een herbruikbare functie, en dus een plugin!

Hier is hoe het eruit zou zien.

Gegeven wat tekst:

```shell
pancake for breakfast
pancake for lunch
pancake for dinner

... wat tekst
```

Eerst markeer je het visueel blokgewijs:

```shell
pan[cake] for breakfast
pan[cake] for lunch
pan[cake] for dinner

... wat tekst
```

Dan verwijder je het en sla je die tekst op in register a:

```shell
pan for breakfast
pan for lunch
pan for dinner

... wat tekst
```

Vervolgens plak je het onderaan het bestand:

```shell
pan for breakfast
pan for lunch
pan for dinner

... wat tekst
cake
cake
cake
```

Dan kapitaliseer je het:

```shell
pan for breakfast
pan for lunch
pan for dinner

... wat tekst
Cake
Cake
Cake
```

Ten slotte plaats je de gekapitaliseerde tekst terug:

```shell
panCake for breakfast
panCake for lunch
panCake for dinner

... wat tekst
```

## Omgaan met Regel- en Charoperaties

Je bent nog niet klaar. Je hebt alleen de randgeval behandeld wanneer je `gt` uitvoert op blok teksten. Je moet nog steeds de 'regel' en 'char' operaties afhandelen. Laten we de `else` code bekijken om te zien hoe dit wordt gedaan.

Hier zijn de codes:

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

Laten we ze regel voor regel doornemen. De geheime saus van deze plugin zit eigenlijk op deze regel:

```shell
let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
```

`@@` bevat de tekst uit het ongebruikte register die gekapitaliseerd moet worden. `l:WORD_PATTERN` is de individuele sleutelwoordmatch. `l:UPCASE_REPLACEMENT` is de oproep naar de `capitalize()` opdracht (die je later zult zien). De `'g'` is de globale vlag die de vervangopdracht instrueert om alle gegeven woorden te vervangen, niet alleen het eerste woord.

De volgende regel:

```shell
let l:titlecased = s:capitalizeFirstWord(l:titlecased)
```

Dit garandeert dat het eerste woord altijd wordt gekapitaliseerd. Als je een zin hebt zoals "een appel per dag houdt de dokter weg", aangezien het eerste woord, "een", een speciaal woord is, zal je vervangopdracht het niet kapitaliseren. Je hebt een methode nodig die altijd het eerste teken kapitaliseert, ongeacht wat. Deze functie doet precies dat (je zult deze functie later in detail zien). Het resultaat van deze kapitalisatiemethoden wordt opgeslagen in de lokale variabele `l:titlecased`.

De volgende regel:

```shell
call setreg('"', l:titlecased)
```

Dit plaatst de gekapitaliseerde string in het ongebruikte register (`"`).

Vervolgens, de volgende twee regels:

```shell
let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
```

Hé, dat ziet er bekend uit! Je hebt eerder een vergelijkbaar patroon gezien met `l:commands`. In plaats van yank, gebruik je hier plakken (`p`). Bekijk de vorige sectie waar ik de `l:commands` heb doorgenomen voor een opfrisser.

Ten slotte, deze twee regels:

```shell
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Je verplaatst je cursor terug naar de regel en kolom waar je begon. Dat is het!

Laten we samenvatten. De bovenstaande vervangmethode is slim genoeg om de gegeven teksten te kapitaliseren en de speciale woorden over te slaan (meer hierover later). Nadat je een gekapitaliseerde string hebt, sla je deze op in het ongebruikte register. Vervolgens markeer je dezelfde tekst die je eerder op `g@` hebt bewerkt visueel, en plak je vanuit het ongebruikte register (dit vervangt effectief de niet-gekapitaliseerde teksten met de gekapitaliseerde versie). Ten slotte verplaats je je cursor terug naar waar je begon.
## Opruimingen

Je bent technisch gezien klaar. De teksten zijn nu in titelcase. Het enige wat nog resteert is het herstellen van de registers en instellingen.

```shell
call setreg('"', l:reg_save)
call setpos("'<", l:visual_marks_save[0])
call setpos("'>", l:visual_marks_save[1])
let &clipboard = l:cb_save
let &selection = l:sel_save
```

Deze herstellen:
- het ongebruikte register.
- de `<` en `>` markeringen.
- de `'clipboard'` en `'selection'` opties.

Poeh, je bent klaar. Dat was een lange functie. Ik had de functie korter kunnen maken door deze op te splitsen in kleinere functies, maar voor nu moet dit maar voldoende zijn. Laten we nu kort de hoofdletterfunctie doornemen.

## De Hoofdletterfunctie

In deze sectie gaan we de `s:capitalize()` functie doornemen. Zo ziet de functie eruit:

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

Vergeet niet dat het argument voor de `capitalize()` functie, `a:string`, het individuele woord is dat door de `g@` operator wordt doorgegeven. Dus als ik `gt` uitvoer op de tekst "pancake for breakfast", zal `ToTitle` de functie `capitalize(string)` *drie* keer aanroepen, eenmaal voor "pancake", eenmaal voor "for", en eenmaal voor "breakfast".

Het eerste deel van de functie is:

```shell
if(toupper(a:string) ==# a:string && a:string != 'A')
  return a:string
endif
```

De eerste voorwaarde (`toupper(a:string) ==# a:string`) controleert of de hoofdletterversie van het argument hetzelfde is als de string en of de string zelf "A" is. Als deze waar zijn, retourneer dan die string. Dit is gebaseerd op de veronderstelling dat als een bepaald woord al volledig in hoofdletters is, het een afkorting is. Bijvoorbeeld, het woord "CEO" zou anders worden omgezet in "Ceo". Hmm, je CEO zal daar niet blij mee zijn. Dus het is het beste om elk volledig in hoofdletters geschreven woord met rust te laten. De tweede voorwaarde, `a:string != 'A'`, behandelt een randgeval voor een gecapitaliseerde "A" letter. Als `a:string` al een gecapitaliseerde "A" is, zou het per ongeluk de test `toupper(a:string) ==# a:string` hebben doorstaan. Omdat "a" een onbepaald lidwoord in het Engels is, moet het in kleine letters worden geschreven.

Het volgende deel dwingt de string om in kleine letters te worden geschreven:

```shell
let l:str = tolower(a:string)
```

Het volgende deel is een regex van een lijst van alle uitgesloten woorden. Ik heb ze van https://titlecaseconverter.com/rules/ gehaald:

```shell
let l:exclusions = '^\(a\|an\|and\|at\|but\|by\|en\|for\|in\|nor\|of\|off\|on\|or\|out\|per\|so\|the\|to\|up\|yet\|v\.?\|vs\.?\|via\)$'
```

Het volgende deel:

```shell
if (match(l:str, l:exclusions) >= 0) || (index(s:local_exclusion_list, l:str) >= 0)
  return l:str
endif
```

Eerst, controleer of je string deel uitmaakt van de uitgesloten woordenlijst (`l:exclusions`). Als dat zo is, kapitaliseer het dan niet. Controleer vervolgens of je string deel uitmaakt van de lokale uitsluitingslijst (`s:local_exclusion_list`). Deze uitsluitingslijst is een aangepaste lijst die de gebruiker kan toevoegen in vimrc (voor het geval de gebruiker aanvullende vereisten heeft voor speciale woorden).

Het laatste deel retourneert de gecapitaliseerde versie van het woord. Het eerste teken wordt in hoofdletters geschreven terwijl de rest hetzelfde blijft.

```shell
return toupper(l:str[0]) . l:str[1:]
```

Laten we de tweede hoofdletterfunctie doornemen. De functie ziet er als volgt uit:

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

Deze functie is gemaakt om een randgeval te behandelen als je een zin hebt die begint met een uitgesloten woord, zoals "an apple a day keeps the doctor away". Op basis van de hoofdletterregels van de Engelse taal moeten alle eerste woorden in een zin, ongeacht of het een speciaal woord is of niet, worden gecapitaliseerd. Met alleen je `substitute()` commando zou de "an" in je zin in kleine letters worden geschreven. Je moet het eerste teken dwingen om in hoofdletters te worden geschreven.

In deze `capitalizeFirstWord` functie is het argument `a:string` geen individueel woord zoals `a:string` binnen de `capitalize` functie, maar in plaats daarvan de hele tekst. Dus als je "pancake for breakfast" hebt, is de waarde van `a:string` "pancake for breakfast". Het voert `capitalizeFirstWord` slechts één keer uit voor de hele tekst.

Een scenario waar je op moet letten is als je een meerregelige string hebt zoals `"an apple a day\nkeeps the doctor away"`. Je wilt het eerste teken van alle regels in hoofdletters schrijven. Als je geen nieuwe regels hebt, schrijf dan eenvoudig het eerste teken in hoofdletters.

```shell
return toupper(a:string[0]) . a:string[1:]
```

Als je nieuwe regels hebt, moet je alle eerste tekens in elke regel in hoofdletters schrijven, dus je splitst ze in een array gescheiden door nieuwe regels:

```shell
let l:lineArr = trim(a:string)->split('\n')
```

Daarna map je elk element in de array en kapitaliseer je het eerste woord van elk element:

```shell
let l:lineArr = map(l:lineArr, 'toupper(v:val[0]) . v:val[1:]')
```

Ten slotte zet je de array-elementen samen:

```shell
return l:lineArr->join("\n")
```

En je bent klaar!

## Documentatie

De tweede directory in de repository is de `docs/` directory. Het is goed om de plugin van grondige documentatie te voorzien. In deze sectie ga ik kort in op hoe je je eigen plugin-documentatie kunt maken.

De `docs/` directory is een van de speciale runtime-paden van Vim. Vim leest alle bestanden in de `docs/`, dus wanneer je zoekt naar een speciaal trefwoord en dat trefwoord wordt gevonden in een van de bestanden in de `docs/` directory, wordt het weergegeven op de help-pagina. Hier heb je een `totitle.txt`. Ik noem het zo omdat dat de naam van de plugin is, maar je kunt het noemen wat je wilt.

Een Vim-docs bestand is in wezen een txt-bestand. Het verschil tussen een regulier txt-bestand en een Vim-helpbestand is dat de laatste speciale "help"-syntaxis gebruikt. Maar eerst moet je Vim vertellen dat het het niet als een tekstbestandstype moet behandelen, maar als een `help` bestandstype. Om Vim te vertellen dit `totitle.txt` als een *help* bestand te interpreteren, voer je `:set ft=help` uit (`:h 'filetype'` voor meer). Trouwens, als je Vim wilt vertellen dit `totitle.txt` als een *regulier* txt-bestand te interpreteren, voer je `:set ft=txt` uit.

### De Speciale Syntax van het Helpbestand

Om een trefwoord vindbaar te maken, omring je dat trefwoord met sterretjes. Om het trefwoord `totitle` vindbaar te maken wanneer de gebruiker zoekt naar `:h totitle`, schrijf je het als `*totitle*` in het helpbestand.

Bijvoorbeeld, ik heb deze regels bovenaan mijn inhoudsopgave:

```shell
INHOUDSOPGAVE                                     *totitle*  *totitle-toc*

// meer TOC-spullen
```

Merk op dat ik twee trefwoorden heb gebruikt: `*totitle*` en `*totitle-toc*` om de sectie inhoudsopgave te markeren. Je kunt zoveel trefwoorden gebruiken als je wilt. Dit betekent dat wanneer je zoekt naar `:h totitle` of `:h totitle-toc`, Vim je naar deze locatie brengt.

Hier is een ander voorbeeld, ergens verderop in het bestand:

```shell
2. Gebruik                                                       *totitle-usage*

// gebruik
```

Als je zoekt naar `:h totitle-usage`, brengt Vim je naar deze sectie.

Je kunt ook interne links gebruiken om naar een andere sectie in het helpbestand te verwijzen door een trefwoord met de bar-syntaxis `|` te omringen. In de TOC-sectie zie je trefwoorden omringd door de staven, zoals `|totitle-intro|`, `|totitle-usage|`, enzovoort.

```shell
INHOUDSOPGAVE                                     *totitle*  *totitle-toc*

    1. Intro ........................... |totitle-intro|
    2. Gebruik ........................... |totitle-usage|
    3. Woorden om te kapitaliseren ............. |totitle-words|
    4. Operator ........................ |totitle-operator|
    5. Toetsbinding ..................... |totitle-keybinding|
    6. Bugs ............................ |totitle-bug-report|
    7. Bijdragen .................... |totitle-contributing|
    8. Credits ......................... |totitle-credits|

```
Dit stelt je in staat om naar de definitie te springen. Als je je cursor ergens op `|totitle-intro|` plaatst en `Ctrl-]` indrukt, springt Vim naar de definitie van dat woord. In dit geval springt het naar de locatie `*totitle-intro*`. Dit is hoe je naar verschillende trefwoorden in een helpdoc kunt linken.

Er is geen goede of foute manier om een doc-bestand in Vim te schrijven. Als je naar verschillende plugins van verschillende auteurs kijkt, gebruiken velen van hen verschillende formaten. Het punt is om een gemakkelijk te begrijpen helpdoc voor je gebruikers te maken.

Tot slot, als je in eerste instantie je eigen plugin lokaal schrijft en je wilt de documentatiepagina testen, zal het simpelweg toevoegen van een txt-bestand in de `~/.vim/docs/` niet automatisch je trefwoorden doorzoekbaar maken. Je moet Vim instrueren om je doc-pagina toe te voegen. Voer het helptags-commando uit: `:helptags ~/.vim/doc` om nieuwe tagbestanden te maken. Nu kun je beginnen met het zoeken naar je trefwoorden.

## Conclusie

Je hebt het einde bereikt! Dit hoofdstuk is de samensmelting van alle Vimscript-hoofdstukken. Hier pas je eindelijk toe wat je tot nu toe hebt geleerd. Hopelijk heb je, door dit te lezen, niet alleen begrepen hoe je Vim-plugins maakt, maar ben je ook aangemoedigd om je eigen plugin te schrijven.

Telkens wanneer je jezelf herhaaldelijk dezelfde reeks acties ziet uitvoeren, zou je moeten proberen je eigen te creëren! Er werd gezegd dat je het wiel niet opnieuw moet uitvinden. Echter, ik denk dat het voordelig kan zijn om het wiel opnieuw uit te vinden voor de leerervaring. Lees de plugins van anderen. Reproduceer ze. Leer van hen. Schrijf je eigen! Wie weet, misschien schrijf je de volgende geweldige, super-populaire plugin na het lezen hiervan. Misschien word je de volgende legendarische Tim Pope. Wanneer dat gebeurt, laat het me weten!