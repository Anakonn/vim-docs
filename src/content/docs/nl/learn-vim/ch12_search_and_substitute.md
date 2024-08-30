---
description: Deze hoofdstuk behandelt zoeken en vervangen in Vim met behulp van reguliere
  expressies en slimme hoofdlettergevoeligheid voor efficiënter tekstbeheer.
title: Ch12. Search and Substitute
---

Dit hoofdstuk behandelt twee afzonderlijke maar gerelateerde concepten: zoeken en vervangen. Vaak moet je bij het bewerken meerdere teksten doorzoeken op basis van hun minst gemeenschappelijke noemer patronen. Door te leren hoe je reguliere expressies kunt gebruiken bij zoeken en vervangen in plaats van letterlijke strings, kun je snel elke tekst targeten.

Als een zijopmerking, in dit hoofdstuk zal ik `/` gebruiken wanneer ik het over zoeken heb. Alles wat je met `/` kunt doen, kan ook met `?`.

## Slimme Hoofdlettergevoeligheid

Het kan lastig zijn om de hoofdlettergevoeligheid van de zoekterm te matchen. Als je zoekt naar de tekst "Leer Vim", kun je gemakkelijk de hoofdletter van één letter verkeerd typen en een fout zoekresultaat krijgen. Zou het niet gemakkelijker en veiliger zijn als je elke hoofdlettergevoeligheid kunt matchen? Dit is waar de optie `ignorecase` uitblinkt. Voeg gewoon `set ignorecase` toe in je vimrc en al je zoektermen worden hoofdletterongevoelig. Nu hoef je niet meer `/Leer Vim` te doen, `/leer vim` werkt ook.

Er zijn echter momenten waarop je moet zoeken naar een specifiek geval. Een manier om dat te doen is door de `ignorecase` optie uit te schakelen door `set noignorecase` uit te voeren, maar dat is veel werk om telkens in en uit te schakelen wanneer je moet zoeken naar een hoofdlettergevoelige zin.

Om het toggelen van `ignorecase` te vermijden, heeft Vim een `smartcase` optie om te zoeken naar een hoofdletterongevoelige string als het zoekpatroon *ten minste één hoofdletter bevat*. Je kunt zowel `ignorecase` als `smartcase` combineren om een hoofdletterongevoelige zoekopdracht uit te voeren wanneer je alleen kleine letters invoert en een hoofdlettergevoelige zoekopdracht wanneer je een of meer hoofdletters invoert.

Voeg in je vimrc toe:

```shell
set ignorecase smartcase
```

Als je deze teksten hebt:

```shell
hello
HELLO
Hello
```

- `/hello` matcht "hello", "HELLO" en "Hello".
- `/HELLO` matcht alleen "HELLO".
- `/Hello` matcht alleen "Hello".

Er is één nadeel. Wat als je alleen een kleine letter wilt zoeken? Wanneer je `/hello` doet, voert Vim nu een hoofdletterongevoelige zoekopdracht uit. Je kunt het `\C` patroon overal in je zoekterm gebruiken om Vim te vertellen dat de volgende zoekterm hoofdlettergevoelig zal zijn. Als je `/\Chello` doet, matcht het strikt "hello", niet "HELLO" of "Hello".

## Eerste en Laatste Karakter in een Regel

Je kunt `^` gebruiken om het eerste karakter in een regel te matchen en `$` om het laatste karakter in een regel te matchen.

Als je deze tekst hebt:

```shell
hello hello
```

Je kunt de eerste "hello" targeten met `/^hello`. Het karakter dat volgt op `^` moet het eerste karakter in een regel zijn. Om de laatste "hello" te targeten, voer je `/hello$` uit. Het karakter voor `$` moet het laatste karakter in een regel zijn.

Als je deze tekst hebt:

```shell
hello hello friend
```

Het uitvoeren van `/hello$` zal niets matchen omdat "friend" de laatste term in die regel is, niet "hello".

## Herhalend Zoeken

Je kunt de vorige zoekopdracht herhalen met `//`. Als je net hebt gezocht naar `/hello`, is het uitvoeren van `//` gelijk aan het uitvoeren van `/hello`. Deze snelkoppeling kan je wat toetsaanslagen besparen, vooral als je net hebt gezocht naar een lange string. Vergeet ook niet dat je `n` en `N` kunt gebruiken om de laatste zoekopdracht te herhalen in dezelfde richting en in de tegenovergestelde richting, respectievelijk.

Wat als je snel de *n* laatste zoektermen wilt oproepen? Je kunt snel door de zoekgeschiedenis navigeren door eerst `/` in te drukken, en vervolgens de `omhoog`/`omlaag` pijltoetsen (of `Ctrl-N`/`Ctrl-P`) in te drukken totdat je de zoekterm vindt die je nodig hebt. Om al je zoekgeschiedenis te zien, kun je `:history /` uitvoeren.

Wanneer je het einde van een bestand bereikt tijdens het zoeken, geeft Vim een foutmelding: `"Zoeken heeft de ONDERKANT bereikt zonder match voor: {je-zoekopdracht}"`. Soms kan dit een goede beveiliging zijn tegen overzoeken, maar andere keren wil je de zoekopdracht weer naar de bovenkant cykelen. Je kunt de optie `set wrapscan` gebruiken om Vim te laten zoeken vanaf de bovenkant van het bestand wanneer je het einde van het bestand bereikt. Om deze functie uit te schakelen, doe je `set nowrapscan`.

## Zoeken naar Alternatieve Woorden

Het is gebruikelijk om naar meerdere woorden tegelijk te zoeken. Als je moet zoeken naar *ofwel* "hello vim" of "hola vim", maar niet "salve vim" of "bonjour vim", kun je het `|` patroon gebruiken.

Gegeven deze tekst:

```shell
hello vim
hola vim
salve vim
bonjour vim
```

Om zowel "hello" als "hola" te matchen, kun je `/hello\|hola` doen. Je moet de of (`|`) operator escapen (`\`), anders zal Vim letterlijk zoeken naar de string "|".

Als je niet elke keer `\|` wilt typen, kun je de `magic` syntaxis (`\v`) aan het begin van de zoekopdracht gebruiken: `/\vhello|hola`. Ik zal `magic` niet in deze gids behandelen, maar met `\v` hoef je speciale karakters niet meer te escapen. Voor meer informatie over `\v`, voel je vrij om `:h \v` te bekijken.

## Instellen van het Begin en Einde van een Match

Misschien moet je zoeken naar een tekst die een deel is van een samenstelling. Als je deze teksten hebt:

```shell
11vim22
vim22
11vim
vim
```

Als je "vim" wilt selecteren, maar alleen wanneer het begint met "11" en eindigt met "22", kun je de `\zs` (begin match) en `\ze` (eind match) operatoren gebruiken. Voer uit:

```shell
/11\zsvim\ze22
```

Vim moet nog steeds het volledige patroon "11vim22" matchen, maar markeert alleen het patroon dat tussen `\zs` en `\ze` is ingeklemd. Een ander voorbeeld:

```shell
foobar
foobaz
```

Als je de "foo" in "foobaz" wilt matchen maar niet in "foobar", voer je uit:

```shell
/foo\zebaz
```

## Zoeken naar Karakterbereiken

Al je zoektermen tot nu toe zijn een letterlijke woordzoektocht geweest. In het echte leven moet je misschien een algemeen patroon gebruiken om je tekst te vinden. Het meest basale patroon is het karakterbereik, `[ ]`.

Als je naar een cijfer wilt zoeken, wil je waarschijnlijk niet elke keer `/0\|1\|2\|3\|4\|5\|6\|7\|8\|9\|0` typen. Gebruik in plaats daarvan `/[0-9]` om naar een enkel cijfer te matchen. De `0-9` expressie vertegenwoordigt een bereik van cijfers 0-9 dat Vim zal proberen te matchen, dus als je naar cijfers tussen 1 en 5 zoekt, gebruik je `/[1-5]`.

Cijfers zijn niet de enige datatypes die Vim kan opzoeken. Je kunt ook `/[a-z]` doen om naar kleine letters te zoeken en `/[A-Z]` om naar hoofdletters te zoeken.

Je kunt deze bereiken combineren. Als je wilt zoeken naar cijfers 0-9 en zowel kleine als hoofdletters van "a" tot "f" (zoals een hex), kun je `/[0-9a-fA-F]` doen.

Om een negatieve zoekopdracht uit te voeren, kun je `^` binnen de karakterbereik haakjes toevoegen. Om naar een niet-cijfer te zoeken, voer je `/[^0-9]` uit. Vim zal elk karakter matchen zolang het geen cijfer is. Wees voorzichtig dat de caret (`^`) binnen de bereik haakjes anders is dan de caret aan het begin van een regel (bijv: `/^hello`). Als een caret buiten een paar haakjes staat en het het eerste karakter in de zoekterm is, betekent het "het eerste karakter in een regel". Als een caret binnen een paar haakjes staat en het het eerste karakter binnen de haakjes is, betekent het een negatieve zoekoperator. `/^abc` matcht de eerste "abc" in een regel en `/[^abc]` matcht elk karakter behalve een "a", "b" of "c".

## Zoeken naar Herhalende Karakters

Als je moet zoeken naar dubbele cijfers in deze tekst:

```shell
1aa
11a
111
```

Kun je `/[0-9][0-9]` gebruiken om een twee-cijferig karakter te matchen, maar deze methode is niet schaalbaar. Wat als je twintig cijfers wilt matchen? Het twintig keer typen van `[0-9]` is geen leuke ervaring. Daarom heb je een `count` argument nodig.

Je kunt `count` aan je zoekopdracht doorgeven. Het heeft de volgende syntaxis:

```shell
{n,m}
```

Trouwens, deze `count` haakjes moeten worden geescaped wanneer je ze in Vim gebruikt. De `count` operator wordt geplaatst na een enkel karakter dat je wilt verhogen.

Hier zijn de vier verschillende variaties van de `count` syntaxis:
- `{n}` is een exacte match. `/[0-9]\{2\}` matcht de twee cijferige nummers: "11" en de "11" in "111".
- `{n,m}` is een bereik match. `/[0-9]\{2,3\}` matcht tussen 2 en 3 cijferige nummers: "11" en "111".
- `{,m}` is een tot match. `/[0-9]\{,3\}` matcht tot 3 cijferige nummers: "1", "11" en "111".
- `{n,}` is een ten minste match. `/[0-9]\{2,\}` matcht ten minste 2 of meer cijferige nummers: "11" en "111".

De count argumenten `\{0,\}` (nul of meer) en `\{1,\}` (één of meer) zijn veelvoorkomende zoekpatronen en Vim heeft speciale operatoren voor hen: `*` en `+` (`+` moet worden geescaped terwijl `*` goed werkt zonder de escape). Als je `/[0-9]*` doet, is het hetzelfde als `/[0-9]\{0,\}`. Het zoekt naar nul of meer cijfers. Het zal "", "1", "123" matchen. Trouwens, het zal ook niet-cijfers matchen zoals "a", omdat er technisch gezien nul cijfer in de letter "a" is. Denk goed na voordat je `*` gebruikt. Als je `/[0-9]\+` doet, is het hetzelfde als `/[0-9]\{1,\}`. Het zoekt naar één of meer cijfers. Het zal "1" en "12" matchen.

## Vooraf gedefinieerde Karakterbereiken

Vim heeft vooraf gedefinieerde bereiken voor veelvoorkomende karakters zoals cijfers en letters. Ik zal hier niet elke enkele doornemen, maar je kunt de volledige lijst vinden in `:h /character-classes`. Hier zijn de nuttige:

```shell
\d    Cijfer [0-9]
\D    Niet-cijfer [^0-9]
\s    Witruimte karakter (spatie en tab)
\S    Niet-witruimte karakter (alles behalve spatie en tab)
\w    Woord karakter [0-9A-Za-z_]
\l    Kleine letters [a-z]
\u    Hoofdletter karakter [A-Z]
```

Je kunt ze gebruiken zoals je karakterbereiken zou gebruiken. Om naar een enkel cijfer te zoeken, in plaats van `/[0-9]` te gebruiken, kun je `/\d` gebruiken voor een beknoptere syntaxis.

## Zoekvoorbeeld: Een Tekst Vangen Tussen een Paar Gelijkaardige Karakters

Als je wilt zoeken naar een zin omgeven door een paar dubbele aanhalingstekens:

```shell
"Vim is geweldig!"
```

Voer dit uit:

```shell
/"[^"]\+"
```

Laten we het opsplitsen:
- `"` is een letterlijke dubbele aanhalingsteken. Het matcht de eerste dubbele aanhalingsteken.
- `[^"]` betekent elk karakter behalve een dubbele aanhalingsteken. Het matcht elk alfanumeriek en witruimte karakter zolang het geen dubbele aanhalingsteken is.
- `\+` betekent één of meer. Aangezien het voorafgegaan wordt door `[^"]`, zoekt Vim naar één of meer karakters die geen dubbele aanhalingsteken zijn.
- `"` is een letterlijke dubbele aanhalingsteken. Het matcht de sluitende dubbele aanhalingsteken.

Wanneer Vim de eerste `"` ziet, begint het met het vastleggen van het patroon. Op het moment dat het de tweede dubbele aanhalingsteken in een regel ziet, matcht het het tweede `"` patroon en stopt het met het vastleggen van het patroon. Ondertussen worden alle niet-dubbele aanhalingstekens karakters daartussen vastgelegd door het `[^"]\+` patroon, in dit geval de zin `Vim is geweldig!`. Dit is een veelvoorkomend patroon om een zin te vangen die omgeven is door een paar gelijkaardige scheidingstekens.

- Om een zin te vangen die omgeven is door enkele aanhalingstekens, kun je `/'[^']\+'` gebruiken.
- Om een zin te vangen die omgeven is door nullen, kun je `/0[^0]\+0` gebruiken.

## Zoekvoorbeeld: Een Telefoonnummer Vangen

Als je een Amerikaans telefoonnummer wilt matchen dat gescheiden is door een koppelteken (`-`), zoals `123-456-7890`, kun je gebruiken:

```shell
/\d\{3\}-\d\{3\}-\d\{4\}
```

Een Amerikaans telefoonnummer bestaat uit een set van drie cijfers, gevolgd door nog eens drie cijfers, en tenslotte vier cijfers. Laten we het opsplitsen:
- `\d\{3\}` matcht een cijfer dat precies drie keer herhaald wordt
- `-` is een letterlijke koppelteken

Je kunt het typen van escapes vermijden met `\v`:

```shell
/\v\d{3}-\d{3}-\d{4}
```

Dit patroon is ook nuttig om herhalende cijfers vast te leggen, zoals IP-adressen en postcodes.

Dat dekt het zoekgedeelte van dit hoofdstuk. Laten we nu overgaan naar vervanging.

## Basis Vervanging

De vervangopdracht van Vim is een nuttige opdracht om snel een patroon te vinden en te vervangen. De syntaxis voor vervanging is:

```shell
:s/{oud-patroon}/{nieuw-patroon}/
```

Laten we beginnen met een basisgebruik. Als je deze tekst hebt:

```shell
vim is goed
```

Laten we "goed" vervangen door "geweldig" omdat Vim geweldig is. Voer `:s/goede/geweldig/` uit. Je zou moeten zien:

```shell
vim is geweldig
```
## Herhalen van de Laatste Vervanging

Je kunt het laatste vervangcommando herhalen met het normale commando `&` of door `:s` uit te voeren. Als je net `:s/good/awesome/` hebt uitgevoerd, zal het uitvoeren van `&` of `:s` het herhalen.

Ook heb ik eerder in dit hoofdstuk vermeld dat je `//` kunt gebruiken om het vorige zoekpatroon te herhalen. Deze truc werkt met het vervangcommando. Als `/good` recent is uitgevoerd en je laat het eerste vervangpatroon argument leeg, zoals in `:s//awesome/`, werkt het hetzelfde als het uitvoeren van `:s/good/awesome/`.

## Vervangingsbereik

Net als veel Ex-commando's, kun je een bereikargument doorgeven aan het vervangcommando. De syntaxis is:

```shell
:[bereik]s/oude/nieuwe/
```

Als je deze expressies hebt:

```shell
let one = 1;
let two = 2;
let three = 3;
let four = 4;
let five = 5;
```

Om "let" te vervangen door "const" op regels drie tot vijf, kun je doen:

```shell
:3,5s/let/const/
```

Hier zijn enkele variaties van het bereik die je kunt doorgeven:

- `:,3s/let/const/` - als er niets voor de komma wordt gegeven, vertegenwoordigt het de huidige regel. Vervang van de huidige regel naar regel 3.
- `:1,s/let/const/` - als er niets na de komma wordt gegeven, vertegenwoordigt het ook de huidige regel. Vervang van regel 1 naar de huidige regel.
- `:3s/let/const/` - als er slechts één waarde als bereik wordt gegeven (geen komma), wordt de vervangingen alleen op die regel uitgevoerd.

In Vim betekent `%` meestal het hele bestand. Als je `:%s/let/const/` uitvoert, zal het vervangingen op alle regels uitvoeren. Houd rekening met deze bereiksyntaxis. Veel commandoregelcommando's die je in de komende hoofdstukken zult leren, volgen deze vorm.

## Patroonherkenning

De volgende secties behandelen basis reguliere expressies. Een sterke patroonkennis is essentieel om het vervangcommando te beheersen.

Als je de volgende expressies hebt:

```shell
let one = 1;
let two = 2;
let three = 3;
let four = 4;
let five = 5;
```

Om een paar dubbele aanhalingstekens rond de cijfers toe te voegen:

```shell
:%s/\d/"\0"/
```

Het resultaat:

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Laten we het commando ontleden:
- `:%s` richt zich op het hele bestand om vervangingen uit te voeren.
- `\d` is Vim's vooraf gedefinieerde bereik voor cijfers (vergelijkbaar met het gebruik van `[0-9]`).
- `"\0"` hier zijn de dubbele aanhalingstekens letterlijke dubbele aanhalingstekens. `\0` is een speciaal teken dat "het hele overeenkomende patroon" vertegenwoordigt. Het overeenkomende patroon hier is een enkel cijfer, `\d`.

Alternatief vertegenwoordigt `&` ook het hele overeenkomende patroon zoals `\0`. `:s/\d/"&"/` zou ook gewerkt hebben.

Laten we een ander voorbeeld overwegen. Gegeven deze expressies en je moet alle "let" met de variabelen vervangen.

```shell
one let = "1";
two let = "2";
three let = "3";
four let = "4";
five let = "5";
```

Om dat te doen, voer je uit:

```shell
:%s/\(\w\+\) \(\w\+\)/\2 \1/
```

Het bovenstaande commando bevat te veel backslashes en is moeilijk te lezen. In dit geval is het handiger om de `\v` operator te gebruiken:

```shell
:%s/\v(\w+) (\w+)/\2 \1/
```

Het resultaat:

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Geweldig! Laten we dat commando ontleden:
- `:%s` richt zich op alle regels in het bestand om vervangingen uit te voeren.
- `(\w+) (\w+)` is een groepsmatch. `\w` is een van Vim's vooraf gedefinieerde bereiken voor een woordteken (`[0-9A-Za-z_]`). De `( )` eromheen vangt een woordtekenovereenkomst in een groep. Let op de spatie tussen de twee groeperingen. `(\w+) (\w+)` vangt twee groepen. De eerste groep vangt "one" en de tweede groep vangt "two".
- `\2 \1` retourneert de gevangen groep in omgekeerde volgorde. `\2` bevat de gevangen string "let" en `\1` de string "one". Het hebben van `\2 \1` retourneert de string "let one".

Vergeet niet dat `\0` het hele overeenkomende patroon vertegenwoordigt. Je kunt de overeenkomende string in kleinere groepen splitsen met `( )`. Elke groep wordt vertegenwoordigd door `\1`, `\2`, `\3`, enzovoort.

Laten we nog een voorbeeld doen om dit groepsmatchconcept te versterken. Als je deze nummers hebt:

```shell
123
456
789
```

Om de volgorde om te keren, voer je uit:

```shell
:%s/\v(\d)(\d)(\d)/\3\2\1/
```

Het resultaat is:

```shell
321
654
987
```

Elke `(\d)` matcht elk cijfer en creëert een groep. Op de eerste regel heeft de eerste `(\d)` een waarde van 1, de tweede `(\d)` heeft een waarde van 2, en de derde `(\d)` heeft een waarde van 3. Ze worden opgeslagen in de variabelen `\1`, `\2`, en `\3`. In de tweede helft van je vervangingen resulteert het nieuwe patroon `\3\2\1` in de waarde "321" op regel één.

Als je in plaats daarvan dit had uitgevoerd:

```shell
:%s/\v(\d\d)(\d)/\2\1/
```
Zou je een ander resultaat hebben gekregen:

```shell
312
645
978
```

Dit komt omdat je nu slechts twee groepen hebt. De eerste groep, gevangen door `(\d\d)`, wordt opgeslagen in `\1` en heeft de waarde van 12. De tweede groep, gevangen door `(\d)`, wordt opgeslagen in `\2` en heeft de waarde van 3. `\2\1` retourneert dan 312.

## Vervangingsvlaggen

Als je de zin hebt:

```shell
chocolate pancake, strawberry pancake, blueberry pancake
```

Om alle pannenkoeken in donuts te vervangen, kun je niet gewoon uitvoeren:

```shell
:s/pancake/donut
```

Het bovenstaande commando vervangt alleen de eerste overeenkomst, wat je geeft:

```shell
chocolate donut, strawberry pancake, blueberry pancake
```

Er zijn twee manieren om dit op te lossen. Je kunt ofwel het vervangcommando nog twee keer uitvoeren of je kunt het een globale (`g`) vlag meegeven om alle overeenkomsten in een regel te vervangen.

Laten we het over de globale vlag hebben. Voer uit:

```shell
:s/pancake/donut/g
```

Vim vervangt alle pannenkoeken met donuts in één snelle opdracht. De globale opdracht is een van de verschillende vlaggen die het vervangcommando accepteert. Je geeft vlaggen aan het einde van het vervangcommando door. Hier is een lijst van nuttige vlaggen:

```shell
&    Hergebruik de vlaggen van het vorige vervangcommando.
g    Vervang alle overeenkomsten in de regel.
c    Vraag om bevestiging voor vervangingen.
e    Voorkom dat foutmeldingen worden weergegeven wanneer de vervanging mislukt.
i    Voer een hoofdletterongevoelige vervanging uit.
I    Voer een hoofdlettergevoelige vervanging uit.
```

Er zijn meer vlaggen die ik hierboven niet heb vermeld. Om meer te lezen over alle vlaggen, kijk in `:h s_flags`.

Trouwens, de herhaalvervangingscommando's (`&` en `:s`) behouden de vlaggen niet. Het uitvoeren van `&` herhaalt alleen `:s/pancake/donut/` zonder `g`. Om snel het laatste vervangcommando met alle vlaggen te herhalen, voer `:&&` uit.

## Het Wijzigen van de Scheidingsteken

Als je een URL met een lang pad moet vervangen:

```shell
https://mysite.com/a/b/c/d/e
```

Om het te vervangen door het woord "hello", voer je uit:

```shell
:s/https:\/\/mysite.com\/a\/b\/c\/d\/e/hello/
```

Het is echter moeilijk te zeggen welke schuine strepen (`/`) deel uitmaken van het vervangpatroon en welke de scheidingstekens zijn. Je kunt de scheidingstekens wijzigen met elke enkel-byte teken (behalve voor letters, cijfers, of `"`, `|`, en `\`). Laten we ze vervangen door `+`. Het vervangcommando hierboven kan dan worden herschreven als:

```shell
:s+https:\/\/mysite.com\/a\/b\/c\/d\/e+hello+
```

Het is nu gemakkelijker te zien waar de scheidingstekens zijn.

## Speciale Vervangingen

Je kunt ook de hoofdletters van de tekst die je vervangt aanpassen. Gegeven de volgende expressies en je taak is om de variabelen "one", "two", "three", enz. in hoofdletters te zetten.

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Voer uit:

```shell
:%s/\v(\w+) (\w+)/\1 \U\2/
```

Je krijgt:

```shell
let ONE = "1";
let TWO = "2";
let THREE = "3";
let FOUR = "4";
let FIVE = "5";
```

De ontleding:
- `(\w+) (\w+)` vangt de eerste twee overeenkomende groepen, zoals "let" en "one".
- `\1` retourneert de waarde van de eerste groep, "let".
- `\U\2` zet de tweede groep (`\2`) in hoofdletters.

De truc van dit commando is de expressie `\U\2`. `\U` geeft de volgende teken aan om in hoofdletters te worden gezet.

Laten we nog een voorbeeld doen. Stel dat je een Vim-gids schrijft en je moet de eerste letter van elk woord in een regel hoofdletters geven.

```shell
vim is the greatest text editor in the whole galaxy
```

Je kunt uitvoeren:

```shell
:s/\<./\U&/g
```

Het resultaat:

```shell
Vim Is The Greatest Text Editor In The Whole Galaxy
```

Hier is de ontleding:
- `:s` vervangt de huidige regel.
- `\<.` bestaat uit twee delen: `\<` om het begin van een woord te matchen en `.` om elk teken te matchen. De `\<` operator maakt het volgende teken het eerste teken van een woord. Aangezien `.` het volgende teken is, zal het het eerste teken van elk woord matchen.
- `\U&` zet het volgende symbool, `&`, in hoofdletters. Vergeet niet dat `&` (of `\0`) het hele match vertegenwoordigt. Het matcht het eerste teken van elk woord.
- `g` de globale vlag. Zonder deze vervangt dit commando alleen de eerste overeenkomst. Je moet elke overeenkomst op deze regel vervangen.

Om meer te leren over speciale vervangsymbolen van vervangingen zoals `\U`, kijk in `:h sub-replace-special`.

## Alternatieve Patronen

Soms moet je meerdere patronen tegelijkertijd matchen. Als je de volgende begroetingen hebt:

```shell
hello vim
hola vim
salve vim
bonjour vim
```

Je moet het woord "vim" vervangen door "vriend", maar alleen op de regels die het woord "hello" of "hola" bevatten. Vergeet niet dat je eerder in dit hoofdstuk `|` kunt gebruiken voor meerdere alternatieve patronen.

```shell
:%s/\v(hello|hola) vim/\1 friend/g
```

Het resultaat:

```shell
hello friend
hola friend
salve vim
bonjour vim
```

Hier is de ontleding:
- `%s` voert het vervangcommando uit op elke regel in een bestand.
- `(hello|hola)` matcht *ofwel* "hello" of "hola" en beschouwt het als een groep.
- `vim` is het letterlijke woord "vim".
- `\1` is de eerste groep, die ofwel de tekst "hello" of "hola" is.
- `friend` is het letterlijke woord "vriend".

## Vervangen van het Begin en het Einde van een Patroon

Vergeet niet dat je `\zs` en `\ze` kunt gebruiken om het begin en het einde van een match te definiëren. Deze techniek werkt ook in vervangingen. Als je hebt:

```shell
chocolate pancake
strawberry sweetcake
blueberry hotcake
```

Om de "cake" in "hotcake" te vervangen door "dog" om een "hotdog" te krijgen:

```shell
:%s/hot\zscake/dog/g
```

Resultaat:

```shell
chocolate pancake
strawberry sweetcake
blueberry hotdog
```
## Gulzig en Niet-gulzig

Je kunt de nth match in een regel vervangen met deze truc:

```shell
One Mississippi, two Mississippi, three Mississippi, four Mississippi, five Mississippi.
```

Om de derde "Mississippi" te vervangen door "Arkansas", voer je uit:

```shell
:s/\v(.{-}\zsMississippi){3}/Arkansas/g
```

De uitleg:
- `:s/` het vervangcommando.
- `\v` is het magische trefwoord zodat je speciale trefwoorden niet hoeft te ontsnappen.
- `.` matcht elk enkel teken.
- `{-}` voert een niet-gulzige match uit van 0 of meer van de voorafgaande atoom.
- `\zsMississippi` maakt "Mississippi" het begin van de match.
- `(...){3}` zoekt naar de derde match.

Je hebt de `{3}` syntaxis eerder in dit hoofdstuk gezien. In dit geval zal `{3}` precies de derde match matchen. De nieuwe truc hier is `{-}`. Het is een niet-gulzige match. Het vindt de kortste match van het gegeven patroon. In dit geval matcht `(.{-}Mississippi)` de minste hoeveelheid "Mississippi" voorafgegaan door elk teken. Vergelijk dit met `(.*Mississippi)` waar het de langste match van het gegeven patroon vindt.

Als je `(.{-}Mississippi)` gebruikt, krijg je vijf matches: "One Mississippi", "Two Mississippi", enz. Als je `(.*Mississippi)` gebruikt, krijg je één match: de laatste "Mississippi". `*` is een gulzige matcher en `{-}` is een niet-gulzige matcher. Om meer te leren, kijk naar `:h /\{-` en `:h non-greedy`.

Laten we een eenvoudiger voorbeeld doen. Als je de string hebt:

```shell
abc1de1
```

Je kunt "abc1de1" (gulzig) matchen met:

```shell
/a.*1
```

Je kunt "abc1" (niet-gulzig) matchen met:

```shell
/a.\{-}1
```

Dus als je de langste match (gulzig) wilt hoofdletteren, voer je uit:

```shell
:s/a.*1/\U&/g
```

Om te krijgen:

```shell
ABC1DEFG1
```

Als je de kortste match (niet-gulzig) wilt hoofdletteren, voer je uit:

```shell
:s/a.\{-}1/\U&/g
```

Om te krijgen:

```shell
ABC1defg1
```

Als je nieuw bent met het concept gulzig versus niet-gulzig, kan het moeilijk zijn om het te begrijpen. Experimenteer met verschillende combinaties totdat je het begrijpt.

## Vervangen Over Meerdere Bestanden

Laten we eindelijk leren hoe we zinnen over meerdere bestanden kunnen vervangen. Voor deze sectie, neem aan dat je twee bestanden hebt: `food.txt` en `animal.txt`.

Binnen `food.txt`:

```shell
corndog
hotdog
chilidog
```

Binnen `animal.txt`:

```shell
large dog
medium dog
small dog
```

Neem aan dat je directorystructuur er als volgt uitziet:

```shell
- food.txt
- animal.txt
```

Eerst, vang zowel `food.txt` als `animal.txt` binnen `:args`. Herinner je je uit eerdere hoofdstukken dat `:args` kan worden gebruikt om een lijst van bestandsnamen te maken. Er zijn verschillende manieren om dit vanuit Vim te doen, een daarvan is door dit vanuit Vim uit te voeren:

```shell
:args *.txt                  vangt alle txt-bestanden in de huidige locatie
```

Om het te testen, wanneer je `:args` uitvoert, zou je moeten zien:

```shell
[food.txt] animal.txt
```

Nu alle relevante bestanden zijn opgeslagen in de argumentenlijst, kun je een vervanging over meerdere bestanden uitvoeren met het `:argdo` commando. Voer uit:

```shell
:argdo %s/dog/chicken/
```

Dit voert vervangingen uit tegen alle bestanden in de `:args` lijst. Sla ten slotte de gewijzigde bestanden op met:

```shell
:argdo update
```

`:args` en `:argdo` zijn nuttige tools om commandoregelcommando's over meerdere bestanden toe te passen. Probeer het met andere commando's!

## Vervangen Over Meerdere Bestanden Met Macro's

Alternatief kun je ook het vervangcommando over meerdere bestanden uitvoeren met macro's. Voer uit:

```shell
:args *.txt
qq
:%s/dog/chicken/g
:wnext
q
99@q
```

De uitleg:
- `:args *.txt` voegt alle tekstbestanden toe aan de `:args` lijst.
- `qq` start de macro in de "q" register.
- `:%s/dog/chicken/g` vervangt "dog" met "chicken" op alle regels in het huidige bestand.
- `:wnext` slaat het bestand op en gaat naar het volgende bestand in de `args` lijst.
- `q` stopt de macro-opname.
- `99@q` voert de macro negenennegentig keer uit. Vim stopt de macro-uitvoering nadat het de eerste fout tegenkomt, dus Vim zal de macro niet echt negenennegentig keer uitvoeren.

## Slim Leren Zoeken en Vervangen

De vaardigheid om goed te zoeken is een noodzakelijke vaardigheid in het bewerken. Het beheersen van de zoekfunctie stelt je in staat om de flexibiliteit van reguliere expressies te gebruiken om naar elk patroon in een bestand te zoeken. Neem de tijd om deze te leren. Om beter te worden met reguliere expressies moet je ze actief gebruiken. Ik heb ooit een boek over reguliere expressies gelezen zonder het daadwerkelijk te doen en ik vergat bijna alles wat ik daarna las. Actief coderen is de beste manier om elke vaardigheid te beheersen.

Een goede manier om je patroonherkenningsvaardigheden te verbeteren is, wanneer je een patroon moet zoeken (zoals "hello 123"), in plaats van te zoeken naar de letterlijke zoekterm (`/hello 123`), probeer een patroon voor te stellen (iets als `/\v(\l+) (\d+)`). Veel van deze concepten van reguliere expressies zijn ook toepasbaar in de algemene programmering, niet alleen bij het gebruik van Vim.

Nu je meer hebt geleerd over geavanceerd zoeken en vervangen in Vim, laten we een van de meest veelzijdige commando's leren, het globale commando.