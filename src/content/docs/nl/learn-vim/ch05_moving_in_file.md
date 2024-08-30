---
description: Leer de essentiële bewegingen in Vim kennen om snel en efficiënt door
  bestanden te navigeren, met de focus op het gebruik van toetsenbordcommando's.
title: Ch05. Moving in a File
---

In het begin voelt het bewegen met een toetsenbord traag en ongemakkelijk aan, maar geef niet op! Zodra je eraan gewend bent, kun je sneller overal in een bestand komen dan met een muis.

In dit hoofdstuk leer je de essentiële bewegingen en hoe je ze efficiënt kunt gebruiken. Houd er rekening mee dat dit **niet** de volledige beweging is die Vim heeft. Het doel hier is om nuttige bewegingen te introduceren om snel productief te worden. Als je meer wilt leren, kijk dan naar `:h motion.txt`.

## Karakter Navigatie

De meest basale bewegingseenheid is het verplaatsen van één karakter naar links, naar beneden, naar boven en naar rechts.

```shell
h   Links
j   Beneden
k   Boven
l   Rechts
gj  Beneden in een zacht gewrapte regel
gk  Boven in een zacht gewrapte regel
```

Je kunt ook bewegen met de pijltjestoetsen. Als je net begint, voel je vrij om elke methode te gebruiken waarmee je het meest comfortabel bent.

Ik geef de voorkeur aan `hjkl` omdat mijn rechterhand op de startrij kan blijven. Dit geeft me een kortere reikwijdte naar de omliggende toetsen. Om aan `hjkl` te wennen, heb ik de pijltoetsen eigenlijk uitgeschakeld toen ik begon door deze toe te voegen in `~/.vimrc`:

```shell
noremap <Up> <NOP>
noremap <Down> <NOP>
noremap <Left> <NOP>
noremap <Right> <NOP>
```

Er zijn ook plugins om deze slechte gewoonte te doorbreken. Een daarvan is [vim-hardtime](https://github.com/takac/vim-hardtime). Tot mijn verbazing duurde het minder dan een week om aan `hjkl` te wennen.

Als je je afvraagt waarom Vim `hjkl` gebruikt om te bewegen, komt dat omdat de Lear-Siegler ADM-3A terminal waar Bill Joy Vi schreef, geen pijltoetsen had en `hjkl` gebruikte als links/beneden/boven/rechts.*

## Relatieve Nummering

Ik denk dat het nuttig is om `number` en `relativenumber` in te stellen. Je kunt dit doen door dit in `.vimrc` te zetten:

```shell
set relativenumber number
```

Dit toont mijn huidige regelnummer en relatieve regelnummer.

Het is gemakkelijk te begrijpen waarom het hebben van een nummer in de linker kolom nuttig is, maar sommigen van jullie vragen zich misschien af hoe het hebben van relatieve nummers in de linker kolom nuttig kan zijn. Een relatief nummer stelt me in staat om snel te zien hoeveel regels mijn cursor van de doeltekst verwijderd is. Hiermee kan ik gemakkelijk zien dat mijn doeltekst 12 regels onder me is, zodat ik `d12j` kan doen om ze te verwijderen. Anders, als ik op regel 69 ben en mijn doel op regel 81 staat, moet ik mentale berekeningen maken (81 - 69 = 12). Wiskunde doen tijdens het bewerken kost te veel mentale middelen. Hoe minder ik hoef na te denken over waar ik naartoe moet, hoe beter.

Dit is 100% persoonlijke voorkeur. Experimenteer met `relativenumber` / `norelativenumber`, `number` / `nonumber` en gebruik wat je het nuttigst vindt!

## Tel Je Beweging

Laten we het hebben over het "aantal" argument. Vim-bewegingen accepteren een voorafgaand numeriek argument. Ik noemde hierboven dat je 12 regels naar beneden kunt gaan met `12j`. De 12 in `12j` is het telnummer.

De syntaxis om het aantal met je beweging te gebruiken is:

```shell
[count] + motion
```

Je kunt dit op alle bewegingen toepassen. Als je 9 karakters naar rechts wilt bewegen, in plaats van `l` 9 keer in te drukken, kun je `9l` doen.

## Woord Navigatie

Laten we overstappen naar een grotere bewegingseenheid: *woord*. Je kunt naar het begin van het volgende woord (`w`), naar het einde van het volgende woord (`e`), naar het begin van het vorige woord (`b`), en naar het einde van het vorige woord (`ge`) bewegen.

Daarnaast is er *WORD*, dat verschilt van woord. Je kunt naar het begin van de volgende WORD (`W`), naar het einde van de volgende WORD (`E`), naar het begin van de vorige WORD (`B`), en naar het einde van de vorige WORD (`gE`) bewegen. Om het gemakkelijk te onthouden, gebruikt WORD dezelfde letters als woord, alleen in hoofdletters.

```shell
w     Beweeg vooruit naar het begin van het volgende woord
W     Beweeg vooruit naar het begin van de volgende WORD
e     Beweeg vooruit één woord naar het einde van het volgende woord
E     Beweeg vooruit één woord naar het einde van de volgende WORD
b     Beweeg achteruit naar het begin van het vorige woord
B     Beweeg achteruit naar het begin van de vorige WORD
ge    Beweeg achteruit naar het einde van het vorige woord
gE    Beweeg achteruit naar het einde van de vorige WORD
```

Wat zijn de overeenkomsten en verschillen tussen een woord en een WORD? Zowel woord als WORD worden gescheiden door spaties. Een woord is een reeks karakters die *alleen* `a-zA-Z0-9_` bevat. Een WORD is een reeks van alle karakters behalve witruimtes (een witruimte betekent ruimte, tab en EOL). Om meer te leren, kijk naar `:h word` en `:h WORD`.

Bijvoorbeeld, stel dat je hebt:

```shell
const hello = "world";
```

Met je cursor aan het begin van de regel, om naar het einde van de regel te gaan met `l`, kost het je 21 toetsaanslagen. Met `w` kost het 6. Met `W` kost het slechts 4. Zowel woord als WORD zijn goede opties om korte afstanden te reizen.

Echter, je kunt van "c" naar ";" gaan in één toetsaanslag met de navigatie van de huidige regel.

## Navigatie van de Huidige Regel

Bij het bewerken moet je vaak horizontaal in een regel navigeren. Om naar het eerste teken in de huidige regel te springen, gebruik je `0`. Om naar het laatste teken in de huidige regel te gaan, gebruik je `$`. Daarnaast kun je `^` gebruiken om naar het eerste niet-blanke teken in de huidige regel te gaan en `g_` om naar het laatste niet-blanke teken in de huidige regel te gaan. Als je naar kolom `n` in de huidige regel wilt gaan, kun je `n|` gebruiken.

```shell
0     Ga naar het eerste teken in de huidige regel
^     Ga naar het eerste niet-blanke teken in de huidige regel
g_    Ga naar het laatste niet-blanke teken in de huidige regel
$     Ga naar het laatste teken in de huidige regel
n|    Ga naar kolom n in de huidige regel
```

Je kunt een zoekopdracht in de huidige regel doen met `f` en `t`. Het verschil tussen `f` en `t` is dat `f` je naar de eerste letter van de overeenkomst brengt en `t` je tot (net voor) de eerste letter van de overeenkomst brengt. Dus als je wilt zoeken naar "h" en op "h" wilt landen, gebruik je `fh`. Als je naar de eerste "h" wilt zoeken en net voor de overeenkomst wilt landen, gebruik je `th`. Als je naar de *volgende* voorkoming van de laatste zoekopdracht in de huidige regel wilt gaan, gebruik je `;`. Om naar de vorige voorkoming van de laatste overeenkomst in de huidige regel te gaan, gebruik je `,`.

`F` en `T` zijn de achterwaartse tegenhangers van `f` en `t`. Om achterwaarts naar "h" te zoeken, voer je `Fh` uit. Om door te blijven zoeken naar "h" in dezelfde richting, gebruik je `;`. Let op dat `;` na een `Fh` achterwaarts zoekt en `,` na `Fh` voorwaarts zoekt.

```shell
f    Zoek vooruit naar een overeenkomst in dezelfde regel
F    Zoek achteruit naar een overeenkomst in dezelfde regel
t    Zoek vooruit naar een overeenkomst in dezelfde regel, stop vóór de overeenkomst
T    Zoek achteruit naar een overeenkomst in dezelfde regel, stop vóór de overeenkomst
;    Herhaal de laatste zoekopdracht in dezelfde regel met dezelfde richting
,    Herhaal de laatste zoekopdracht in dezelfde regel met de tegenovergestelde richting
```

Terug naar het vorige voorbeeld:

```shell
const hello = "world";
```

Met je cursor aan het begin van de regel, kun je naar het laatste teken in de huidige regel (";") gaan met één toetsaanslag: `$`. Als je naar "w" in "world" wilt gaan, kun je `fw` gebruiken. Een goede tip om overal in een regel te komen, is om te zoeken naar de minst voorkomende letters zoals "j", "x", "z" in de buurt van je doel.

## Zin en Paragraaf Navigatie

De volgende twee navigatie-eenheden zijn zin en paragraaf.

Laten we eerst bespreken wat een zin is. Een zin eindigt met een `. ! ?` gevolgd door een EOL, een spatie of een tab. Je kunt naar de volgende zin springen met `)` en de vorige zin met `(`.

```shell
(    Spring naar de vorige zin
)    Spring naar de volgende zin
```

Laten we enkele voorbeelden bekijken. Welke zinnen denk je dat zinnen zijn en welke niet? Probeer te navigeren met `(` en `)` in Vim!

```shell
Ik ben een zin. Ik ben een andere zin omdat ik eindig met een punt. Ik ben nog steeds een zin als ik eindig met een uitroepteken! Wat dacht je van vraagtekens? Ik ben geen echte zin vanwege het koppelteken - en ook niet vanwege de puntkomma ; of de dubbele punt :

Er is een lege regel boven me.
```

Trouwens, als je problemen hebt met Vim die een zin niet telt voor zinnen gescheiden door `.` gevolgd door een enkele regel, ben je misschien in de `'compatible'` modus. Voeg `set nocompatible` toe aan je vimrc. In Vi is een zin een `.` gevolgd door **twee** spaties. Je moet `nocompatible` altijd ingesteld hebben.

Laten we het hebben over wat een paragraaf is. Een paragraaf begint na elke lege regel en ook bij elke set van een paragraafmacro die is gespecificeerd door de paren van karakters in de paragrafenoptie.

```shell
{    Spring naar de vorige paragraaf
}    Spring naar de volgende paragraaf
```

Als je niet zeker weet wat een paragraafmacro is, maak je geen zorgen. Het belangrijkste is dat een paragraaf begint en eindigt na een lege regel. Dit zou meestal waar moeten zijn.

Laten we dit voorbeeld bekijken. Probeer rond te navigeren met `}` en `{` (speel ook met zin navigaties `( )` om ook rond te bewegen!)

```shell
Hallo. Hoe gaat het met je? Ik ben geweldig, bedankt!
Vim is geweldig.
Het kan in het begin moeilijk zijn om het te leren...- maar we zitten hier samen in. Veel succes!

Hallo nogmaals.

Probeer rond te bewegen met ), (, }, en {. Voel hoe ze werken.
Je kunt dit.
```

Bekijk `:h sentence` en `:h paragraph` om meer te leren.

## Match Navigatie

Programma's schrijven en bewerken codes. Codes gebruiken typisch haakjes, accolades en vierkante haken. Je kunt gemakkelijk verloren raken in hen. Als je binnen een paar bent, kun je naar het andere paar springen (als het bestaat) met `%`. Je kunt dit ook gebruiken om te ontdekken of je bijpassende haakjes, accolades en vierkante haken hebt.

```shell
%    Navigeer naar een andere overeenkomst, werkt meestal voor (), [], {}
```

Laten we een Scheme-codevoorbeeld bekijken omdat het haakjes veelvuldig gebruikt. Beweeg rond met `%` binnen verschillende haakjes.

```shell
(define (fib n)
  (cond ((= n 0) 0)
        ((= n 1) 1)
        (else
          (+ (fib (- n 1)) (fib (- n 2)))
        )))
```

Persoonlijk vind ik het leuk om `%` aan te vullen met visuele indicatoren plugins zoals [vim-rainbow](https://github.com/frazrepo/vim-rainbow). Voor meer, kijk naar `:h %`.

## Regel Nummer Navigatie

Je kunt naar regelnummer `n` springen met `nG`. Bijvoorbeeld, als je naar regel 7 wilt springen, gebruik je `7G`. Om naar de eerste regel te springen, gebruik je `1G` of `gg`. Om naar de laatste regel te springen, gebruik je `G`.

Vaak weet je niet precies wat het regelnummer van je doel is, maar je weet dat het ongeveer op 70% van het hele bestand is. In dit geval kun je `70%` doen. Om halverwege het bestand te springen, kun je `50%` doen.

```shell
gg    Ga naar de eerste regel
G     Ga naar de laatste regel
nG    Ga naar regel n
n%    Ga naar n% in bestand
```

Trouwens, als je het totale aantal regels in een bestand wilt zien, kun je `Ctrl-g` gebruiken.

## Venster Navigatie

Om snel naar de bovenkant, het midden of de onderkant van je *venster* te gaan, kun je `H`, `M` en `L` gebruiken.

Je kunt ook een aantal doorgeven aan `H` en `L`. Als je `10H` gebruikt, ga je 10 regels onder de bovenkant van het venster. Als je `3L` gebruikt, ga je 3 regels boven de laatste regel van het venster.

```shell
H     Ga naar de bovenkant van het scherm
M     Ga naar het midden van het scherm
L     Ga naar de onderkant van het scherm
nH    Ga n regels van boven
nL    Ga n regels van onder
```

## Scrollen

Om te scrollen, heb je 3 snelheidstoenames: volledig scherm (`Ctrl-F/Ctrl-B`), half scherm (`Ctrl-D/Ctrl-U`), en regel (`Ctrl-E/Ctrl-Y`).

```shell
Ctrl-E    Scroll naar beneden een regel
Ctrl-D    Scroll naar beneden een half scherm
Ctrl-F    Scroll naar beneden een volledig scherm
Ctrl-Y    Scroll naar boven een regel
Ctrl-U    Scroll naar boven een half scherm
Ctrl-B    Scroll naar boven een volledig scherm
```

Je kunt ook relatief scrollen ten opzichte van de huidige regel (zoom scherm zicht):

```shell
zt    Breng de huidige regel dichtbij de bovenkant van je scherm
zz    Breng de huidige regel naar het midden van je scherm
zb    Breng de huidige regel dichtbij de onderkant van je scherm
```
## Zoeknavigatie

Vaak weet je dat een zin in een bestand bestaat. Je kunt zoeknavigatie gebruiken om heel snel je doel te bereiken. Om naar een zin te zoeken, kun je `/` gebruiken om vooruit te zoeken en `?` om achteruit te zoeken. Om de laatste zoekopdracht te herhalen, kun je `n` gebruiken. Om de laatste zoekopdracht in de tegenovergestelde richting te herhalen, kun je `N` gebruiken.

```shell
/    Zoek vooruit naar een overeenkomst
?    Zoek achteruit naar een overeenkomst
n    Herhaal de laatste zoekopdracht in dezelfde richting als de vorige zoekopdracht
N    Herhaal de laatste zoekopdracht in de tegenovergestelde richting van de vorige zoekopdracht
```

Stel dat je deze tekst hebt:

```shell
let one = 1;
let two = 2;
one = "01";
one = "one";
let onetwo = 12;
```

Als je zoekt naar "let", voer je `/let` uit. Om snel opnieuw naar "let" te zoeken, kun je gewoon `n` doen. Om opnieuw naar "let" te zoeken in de tegenovergestelde richting, voer je `N` uit. Als je `?let` uitvoert, zoekt het achteruit naar "let". Als je `n` gebruikt, zoekt het nu achteruit naar "let" (`N` zal nu vooruit zoeken naar "let").

Je kunt zoekhighlighting inschakelen met `set hlsearch`. Nu, wanneer je zoekt naar `/let`, zal het *alle* overeenkomende zinnen in het bestand markeren. Bovendien kun je incrementele zoekopdracht instellen met `set incsearch`. Dit zal het patroon markeren terwijl je typt. Standaard blijven je overeenkomende zinnen gemarkeerd totdat je naar een andere zin zoekt. Dit kan snel vervelend worden. Om de highlight uit te schakelen, kun je `:nohlsearch` of simpelweg `:noh` uitvoeren. Omdat ik deze geen-highlight functie vaak gebruik, heb ik een map in vimrc gemaakt:

```shell
nnoremap <esc><esc> :noh<return><esc>
```

Je kunt snel zoeken naar de tekst onder de cursor met `*` om vooruit te zoeken en `#` om achteruit te zoeken. Als je cursor op de string "one" staat, is het indrukken van `*` hetzelfde als wanneer je `/\<one\>` had gedaan.

Zowel `\<` als `\>` in `/\<one\>` betekenen zoeken naar een heel woord. Het komt niet overeen met "one" als het een deel van een groter woord is. Het komt overeen met het woord "one" maar niet met "onetwo". Als je cursor over "one" staat en je wilt vooruit zoeken naar overeenkomsten met hele of gedeeltelijke woorden zoals "one" en "onetwo", moet je `g*` gebruiken in plaats van `*`.

```shell
*     Zoek naar heel woord onder cursor vooruit
#     Zoek naar heel woord onder cursor achteruit
g*    Zoek naar woord onder cursor vooruit
g#    Zoek naar woord onder cursor achteruit
```

## Markeren van Positie

Je kunt markeringen gebruiken om je huidige positie op te slaan en later naar deze positie terug te keren. Het is als een bladwijzer voor tekstbewerking. Je kunt een markering instellen met `mx`, waarbij `x` elke alfabetische letter `a-zA-Z` kan zijn. Er zijn twee manieren om naar een markering terug te keren: exact (regel en kolom) met `` `x `` en regelgewijs (`'x`).

```shell
ma    Markeer positie met markering "a"
`a    Spring naar regel en kolom "a"
'a    Spring naar regel "a"
```

Er is een verschil tussen markeren met kleine letters (a-z) en hoofdletters (A-Z). Kleine letters zijn lokale markeringen en hoofdletters zijn globale markeringen (soms bekend als bestandsmarkeringen).

Laten we het hebben over lokale markeringen. Elke buffer kan zijn eigen set lokale markeringen hebben. Als ik twee bestanden geopend heb, kan ik een markering "a" (`ma`) in het eerste bestand instellen en een andere markering "a" (`ma`) in het tweede bestand.

In tegenstelling tot lokale markeringen, waar je een set markeringen in elke buffer kunt hebben, krijg je slechts één set globale markeringen. Als je `mA` instelt in `myFile.txt`, zal de volgende keer dat je `mA` in een ander bestand uitvoert, de eerste "A" markering overschrijven. Een voordeel van globale markeringen is dat je naar elke globale markering kunt springen, zelfs als je in een totaal ander project bent. Globale markeringen kunnen tussen bestanden reizen.

Om alle markeringen te bekijken, gebruik je `:marks`. Je zult opmerken dat er meer markeringen zijn dan alleen `a-zA-Z`. Sommige daarvan zijn:

```shell
''    Spring terug naar de laatste regel in de huidige buffer voor de sprong
``    Spring terug naar de laatste positie in de huidige buffer voor de sprong
`[    Spring naar het begin van eerder gewijzigde / gekopieerde tekst
`]    Spring naar het einde van eerder gewijzigde / gekopieerde tekst
`<    Spring naar het begin van de laatste visuele selectie
`>    Spring naar het einde van de laatste visuele selectie
`0    Spring terug naar het laatst bewerkte bestand bij het verlaten van vim
```

Er zijn meer markeringen dan de hierboven vermelde. Ik zal ze hier niet behandelen omdat ik denk dat ze zelden worden gebruikt, maar als je nieuwsgierig bent, kijk dan naar `:h marks`.

## Springen

In Vim kun je "springen" naar een ander bestand of een ander deel van een bestand met enkele bewegingen. Niet alle bewegingen tellen echter als een sprongetje. Naar beneden gaan met `j` telt niet als een sprongetje. Naar regel 10 gaan met `10G` telt als een sprongetje.

Hier zijn de commando's die Vim beschouwt als "spring" commando's:

```shell
'       Ga naar de gemarkeerde regel
`       Ga naar de gemarkeerde positie
G       Ga naar de regel
/       Zoek vooruit
?       Zoek achteruit
n       Herhaal de laatste zoekopdracht, dezelfde richting
N       Herhaal de laatste zoekopdracht, tegenovergestelde richting
%       Vind overeenkomst
(       Ga naar de laatste zin
)       Ga naar de volgende zin
{       Ga naar de laatste alinea
}       Ga naar de volgende alinea
L       Ga naar de laatste regel van het weergegeven venster
M       Ga naar de middelste regel van het weergegeven venster
H       Ga naar de bovenste regel van het weergegeven venster
[[      Ga naar de vorige sectie
]]      Ga naar de volgende sectie
:s      Vervangen
:tag    Spring naar tagdefinitie
```

Ik raad niet aan om deze lijst uit je hoofd te leren. Een goede vuistregel is dat elke beweging die verder gaat dan een woord en de huidige lijnnavigatie waarschijnlijk een sprongetje is. Vim houdt bij waar je bent geweest wanneer je je verplaatst en je kunt deze lijst zien binnen `:jumps`.

Voor meer, kijk naar `:h jump-motions`.

Waarom zijn sprongetjes nuttig? Omdat je de sprongetjeslijst kunt navigeren met `Ctrl-O` om omhoog te bewegen in de sprongetjeslijst en `Ctrl-I` om omlaag te bewegen in de sprongetjeslijst. `hjkl` zijn geen "spring" commando's, maar je kunt de huidige locatie handmatig aan de sprongetjeslijst toevoegen met `m'` voor de beweging. Bijvoorbeeld, `m'5j` voegt de huidige locatie toe aan de sprongetjeslijst en gaat 5 regels naar beneden, en je kunt terugkomen met `Ctrl-O`. Je kunt springen tussen verschillende bestanden, waar ik meer over zal bespreken in het volgende deel.

## Leer Navigatie op de Slimme Manier

Als je nieuw bent in Vim, is dit veel om te leren. Ik verwacht niet dat iemand alles onmiddellijk onthoudt. Het kost tijd voordat je ze kunt uitvoeren zonder na te denken.

Ik denk dat de beste manier om te beginnen is om een paar essentiële bewegingen uit je hoofd te leren. Ik raad aan om te beginnen met deze 10 bewegingen: `h, j, k, l, w, b, G, /, ?, n`. Herhaal ze voldoende totdat je ze kunt gebruiken zonder na te denken.

Om je navigatievaardigheden te verbeteren, zijn hier mijn suggesties:
1. Let op herhaalde acties. Als je merkt dat je `l` herhaaldelijk doet, zoek dan naar een beweging die je sneller vooruit brengt. Je zult ontdekken dat je `w` kunt gebruiken. Als je jezelf herhaaldelijk `w` ziet doen, kijk dan of er een beweging is die je snel over de huidige regel kan brengen. Je zult ontdekken dat je `f` kunt gebruiken. Als je je behoefte beknopt kunt beschrijven, is de kans groot dat Vim een manier heeft om het te doen.
2. Wanneer je een nieuwe beweging leert, besteed dan wat tijd totdat je het zonder na te denken kunt doen.

Realiseer je tenslotte dat je niet elke enkele Vim-opdracht hoeft te kennen om productief te zijn. De meeste Vim-gebruikers doen dat niet. Ik ook niet. Leer de opdrachten die je helpen om je taak op dat moment te voltooien.

Neem je tijd. Navigatievaardigheid is een zeer belangrijke vaardigheid in Vim. Leer elke dag één klein ding en leer het goed.