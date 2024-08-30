---
description: Leer hoe je Vim-tags gebruikt om snel naar definities in codebases te
  navigeren en de structuur van onbekende code te begrijpen.
title: Ch16. Tags
---

Een nuttige functie in tekstbewerking is de mogelijkheid om snel naar elke definitie te gaan. In dit hoofdstuk leer je hoe je Vim-tags hiervoor kunt gebruiken.

## Tag Overzicht

Stel je voor dat iemand je een nieuwe codebase geeft:

```shell
one = One.new
one.donut
```

`One`? `donut`? Nou, deze waren misschien voor de ontwikkelaars die de code destijds schreven voor de hand liggend, maar nu zijn die ontwikkelaars er niet meer en is het aan jou om deze obscure codes te begrijpen. Een manier om dit te begrijpen is door de broncode te volgen waar `One` en `donut` zijn gedefinieerd.

Je kunt ze zoeken met `fzf` of `grep` (of `vimgrep`), maar in dit geval zijn tags sneller.

Denk aan tags als een adresboek:

```shell
Naam    Adres
Iggy1   1234 Cool St, 11111
Iggy2   9876 Awesome Ave, 2222
```

In plaats van een naam-adres paar, slaan tags definities op die gekoppeld zijn aan adressen.

Laten we aannemen dat je deze twee Ruby-bestanden in dezelfde map hebt:

```shell
## one.rb
class One
  def initialize
    puts "Geïnitieerd"
  end

  def donut
    puts "Bar"
  end
end
```

en

```shell
## two.rb
require './one'

one = One.new
one.donut
```

Om naar een definitie te springen, kun je `Ctrl-]` gebruiken in de normale modus. Ga in `two.rb` naar de regel waar `one.donut` staat en beweeg de cursor over `donut`. Druk op `Ctrl-]`.

Oeps, Vim kon het tagbestand niet vinden. Je moet eerst het tagbestand genereren.

## Tag Generator

Moderne Vim wordt niet geleverd met een taggenerator, dus je moet een externe taggenerator downloaden. Er zijn verschillende opties om uit te kiezen:

- ctags = Alleen C. Bijna overal beschikbaar.
- exuberant ctags = Een van de meest populaire. Heeft ondersteuning voor veel talen.
- universal ctags = Vergelijkbaar met exuberant ctags, maar nieuwer.
- etags = Voor Emacs. Hmm...
- JTags = Java
- ptags.py = Python
- ptags = Perl
- gnatxref = Ada

Als je online Vim-tutorials bekijkt, zullen velen [exuberant ctags](http://ctags.sourceforge.net/) aanbevelen. Het ondersteunt [41 programmeertalen](http://ctags.sourceforge.net/languages.html). Ik heb het gebruikt en het werkte geweldig. Omdat het echter sinds 2009 niet meer is onderhouden, zou Universal ctags een betere keuze zijn. Het werkt vergelijkbaar met exuberant ctags en wordt momenteel onderhouden.

Ik ga niet in detail over hoe je de universal ctags installeert. Bekijk de [universal ctags](https://github.com/universal-ctags/ctags) repository voor meer instructies.

Laten we aannemen dat je de universal ctags hebt geïnstalleerd, laten we een basis tagbestand genereren. Voer uit:

```shell
ctags -R .
```

De `R` optie vertelt ctags om een recursieve scan uit te voeren vanuit je huidige locatie (`.`). Je zou een `tags` bestand in je huidige directory moeten zien. Binnenin zie je iets als dit:

```shell
!_TAG_FILE_FORMAT	2	/extended format; --format=1 will not append ;" to lines/
!_TAG_FILE_SORTED	1	/0=unsorted, 1=sorted, 2=foldcase/
!_TAG_OUTPUT_FILESEP	slash	/slash or backslash/
!_TAG_OUTPUT_MODE	u-ctags	/u-ctags or e-ctags/
!_TAG_PATTERN_LENGTH_LIMIT	96	/0 for no limit/
!_TAG_PROGRAM_AUTHOR	Universal Ctags Team	//
!_TAG_PROGRAM_NAME	Universal Ctags	/Derived from Exuberant Ctags/
!_TAG_PROGRAM_URL	<https://ctags.io/>	/official site/
!_TAG_PROGRAM_VERSION	0.0.0	/b43eb39/
One	one.rb	/^class One$/;"	c
donut	one.rb	/^  def donut$/;"	f	class:One
initialize	one.rb	/^  def initialize$/;"	f	class:One
```

Jouw versie kan er iets anders uitzien, afhankelijk van je Vim-instellingen en de ctags-generator. Een tagbestand bestaat uit twee delen: de tagmetadata en de taglijst. Deze metadata (`!TAG_FILE...`) worden meestal beheerd door de ctags-generator. Ik zal dit hier niet bespreken, maar voel je vrij om hun documentatie te bekijken voor meer informatie! De taglijst is een lijst van alle definities die door ctags zijn geïndexeerd.

Ga nu naar `two.rb`, zet de cursor op `donut`, en typ `Ctrl-]`. Vim brengt je naar het bestand `one.rb` op de regel waar `def donut` staat. Succes! Maar hoe deed Vim dit?

## Tags Anatomie

Laten we eens kijken naar het `donut` tagitem:

```shell
donut	one.rb	/^  def donut$/;"	f	class:One
```

Het bovenstaande tagitem bestaat uit vier componenten: een `tagname`, een `tagfile`, een `tagaddress`, en tagopties.
- `donut` is de `tagname`. Wanneer je cursor op "donut" staat, zoekt Vim in het tagbestand naar een regel die de string "donut" bevat.
- `one.rb` is de `tagfile`. Vim zoekt naar een bestand `one.rb`.
- `/^ def donut$/` is het `tagaddress`. `/.../` is een patroonindicator. `^` is een patroon voor het eerste element op een regel. Het wordt gevolgd door twee spaties, dan de string `def donut`. Ten slotte is `$` een patroon voor het laatste element op een regel.
- `f class:One` is de tagoptie die Vim vertelt dat de functie `donut` een functie (`f`) is en deel uitmaakt van de `One` klasse.

Laten we een ander item in de taglijst bekijken:

```shell
One	one.rb	/^class One$/;"	c
```

Deze regel werkt op dezelfde manier als het `donut` patroon:

- `One` is de `tagname`. Merk op dat bij tags de eerste scan hoofdlettergevoelig is. Als je `One` en `one` op de lijst hebt staan, zal Vim `One` boven `one` prioriteren.
- `one.rb` is de `tagfile`. Vim zoekt naar een bestand `one.rb`.
- `/^class One$/` is het `tagaddress` patroon. Vim zoekt naar een regel die begint met (`^`) `class` en eindigt met (`$`) `One`.
- `c` is een van de mogelijke tagopties. Aangezien `One` een Ruby-klasse is en geen procedure, markeert het dit met een `c`.

Afhankelijk van welke taggenerator je gebruikt, kan de inhoud van je tagbestand er anders uitzien. Minimaal moet een tagbestand een van deze formaten hebben:

```shell
1.  {tagname} {TAB} {tagfile} {TAB} {tagaddress}
2.  {tagname} {TAB} {tagfile} {TAB} {tagaddress} {term} {field} ..
```

## Het Tagbestand

Je hebt geleerd dat er een nieuw bestand, `tags`, wordt aangemaakt na het uitvoeren van `ctags -R .`. Hoe weet Vim waar het tagbestand moet zoeken?

Als je `:set tags?` uitvoert, zie je misschien `tags=./tags,tags` (afhankelijk van je Vim-instellingen kan dit anders zijn). Hier zoekt Vim naar alle tags in het pad van het huidige bestand in het geval van `./tags` en de huidige directory (je projectroot) in het geval van `tags`.

Ook in het geval van `./tags`, zal Vim eerst zoeken naar een tagbestand binnen het pad van je huidige bestand, ongeacht hoe genest het is, daarna zal het zoeken naar een tagbestand van de huidige directory (projectroot). Vim stopt nadat het de eerste overeenkomst heeft gevonden.

Als je `'tags'` bestand had gezegd `tags=./tags,tags,/user/iggy/mytags/tags`, dan zou Vim ook naar de `/user/iggy/mytags` directory zoeken naar een tagbestand nadat Vim klaar is met zoeken in de `./tags` en `tags` directory. Je hoeft je tagbestand niet binnen je project op te slaan, je kunt ze apart houden.

Om een nieuwe tagbestandlocatie toe te voegen, gebruik je het volgende:

```shell
set tags+=path/to/my/tags/file
```

## Tags Genereren voor een Groot Project

Als je probeert ctags uit te voeren in een groot project, kan het lang duren omdat Vim ook binnen elke geneste directory kijkt. Als je een Javascript-ontwikkelaar bent, weet je dat `node_modules` erg groot kan zijn. Stel je voor dat je vijf subprojecten hebt en elk bevat zijn eigen `node_modules` directory. Als je `ctags -R .` uitvoert, zal ctags proberen door alle 5 `node_modules` te scannen. Je hoeft waarschijnlijk geen ctags op `node_modules` uit te voeren.

Om ctags uit te voeren met uitsluiting van de `node_modules`, voer je uit:

```shell
ctags -R --exclude=node_modules .
```

Deze keer zou het minder dan een seconde moeten duren. Trouwens, je kunt de `exclude` optie meerdere keren gebruiken:

```shell
ctags -R --exclude=.git --exclude=vendor --exclude=node_modules --exclude=db --exclude=log .
```

Het punt is, als je een directory wilt omzeilen, is `--exclude` je beste vriend.

## Tags Navigatie

Je kunt goed gebruik maken van alleen `Ctrl-]`, maar laten we een paar meer trucs leren. De tag jump-toets `Ctrl-]` heeft een alternatief in de commandoregelmodus: `:tag {tag-name}`. Als je uitvoert:

```shell
:tag donut
```

Zal Vim springen naar de `donut` methode, net zoals je `Ctrl-]` zou doen op de string "donut". Je kunt het argument ook automatisch aanvullen met `<Tab>`:

```shell
:tag d<Tab>
```

Vim toont alle tags die beginnen met "d". In dit geval, "donut".

In een echt project kun je meerdere methoden met dezelfde naam tegenkomen. Laten we de twee Ruby-bestanden van eerder bijwerken. Binnen `one.rb`:

```shell
## one.rb
class One
  def initialize
    puts "Geïnitieerd"
  end

  def donut
    puts "een donut"
  end

  def pancake
    puts "een pannenkoek"
  end
end
```

Binnen `two.rb`:

```shell
## two.rb
require './one.rb'

def pancake
  "Twee pannenkoeken"
end

one = One.new
one.donut
puts pancake
```

Als je meeschrijft, vergeet dan niet om `ctags -R .` opnieuw uit te voeren, aangezien je nu verschillende nieuwe procedures hebt. Je hebt twee instanties van de `pancake` procedure. Als je in `two.rb` bent en je drukt op `Ctrl-]`, wat zou er dan gebeuren?

Vim zal springen naar `def pancake` binnen `two.rb`, niet de `def pancake` binnen `one.rb`. Dit komt omdat Vim de `pancake` procedure binnen `two.rb` als een hogere prioriteit beschouwt dan de andere `pancake` procedure.

## Tag Prioriteit

Niet alle tags zijn gelijk. Sommige tags hebben hogere prioriteiten. Als Vim wordt gepresenteerd met dubbele itemnamen, controleert Vim de prioriteit van het trefwoord. De volgorde is:

1. Een volledig gematchte statische tag in het huidige bestand.
2. Een volledig gematchte globale tag in het huidige bestand.
3. Een volledig gematchte globale tag in een ander bestand.
4. Een volledig gematchte statische tag in een ander bestand.
5. Een hoofdletterongevoelig gematchte statische tag in het huidige bestand.
6. Een hoofdletterongevoelig gematchte globale tag in het huidige bestand.
7. Een hoofdletterongevoelig gematchte globale tag in een ander bestand.
8. Een hoofdletterongevoelig gematchte statische tag in het huidige bestand.

Volgens de prioriteitenlijst geeft Vim prioriteit aan de exacte match die in hetzelfde bestand is gevonden. Daarom kiest Vim de `pancake` procedure binnen `two.rb` boven de `pancake` procedure binnen `one.rb`. Er zijn enkele uitzonderingen op de prioriteitenlijst hierboven, afhankelijk van je `'tagcase'`, `'ignorecase'`, en `'smartcase'` instellingen, maar ik zal ze hier niet bespreken. Als je geïnteresseerd bent, kijk dan naar `:h tag-priority`.

## Selectieve Tag Sprongen

Het zou fijn zijn als je kunt kiezen naar welke tagitems je wilt springen in plaats van altijd naar het hoogste prioriteitstagitem te gaan. Misschien moet je eigenlijk naar de `pancake` methode in `one.rb` springen en niet naar die in `two.rb`. Om dat te doen, kun je `:tselect` gebruiken. Voer uit:

```shell
:tselect pancake
```

Je zult zien, onderaan het scherm:
## pri kind tag               bestand
1 F C f    pancake           two.rb
             def pancake
2 F   f    pancake           one.rb
             class:One
             def pancake
```

Als je 2 typt, springt Vim naar de procedure in `one.rb`. Als je 1 typt, springt Vim naar de procedure in `two.rb`.

Let op de `pri` kolom. Je hebt `F C` bij de eerste match en `F` bij de tweede match. Dit is wat Vim gebruikt om de tagprioriteit te bepalen. `F C` betekent een volledig gematchte (`F`) globale tag in het huidige (`C`) bestand. `F` betekent alleen een volledig gematchte (`F`) globale tag. `F C` heeft altijd een hogere prioriteit dan `F`.

Als je `:tselect donut` uitvoert, vraagt Vim je ook om te selecteren welke tagitem je naartoe wilt springen, ook al is er maar één optie om uit te kiezen. Is er een manier voor Vim om alleen de taglijst op te vragen als er meerdere matches zijn en onmiddellijk te springen als er maar één tag is gevonden?

Natuurlijk! Vim heeft een `:tjump` methode. Voer uit:

```shell
:tjump donut
```

Vim springt onmiddellijk naar de `donut` procedure in `one.rb`, net zoals bij het uitvoeren van `:tag donut`. Voer nu uit:

```shell
:tjump pancake
```

Vim vraagt je om tagopties om uit te kiezen, net zoals bij het uitvoeren van `:tselect pancake`. Met `tjump` krijg je het beste van beide methoden.

Vim heeft een normale modus toets voor `tjump`: `g Ctrl-]`. Persoonlijk vind ik `g Ctrl-]` beter dan `Ctrl-]`.

## Automatische aanvulling met tags

Tags kunnen helpen bij automatische aanvullingen. Herinner je je uit hoofdstuk 6, Invoegmodus, dat je `Ctrl-X` submodus kunt gebruiken om verschillende automatische aanvullingen te doen. Een automatische aanvulling submodus die ik niet heb genoemd was `Ctrl-]`. Als je `Ctrl-X Ctrl-]` doet terwijl je in de invoegmodus bent, zal Vim het tagbestand gebruiken voor automatische aanvulling.

Als je in de invoegmodus gaat en `Ctrl-x Ctrl-]` typt, zie je:

```shell
One
donut
initialize
pancake
```

## Tag Stack

Vim houdt een lijst bij van alle tags waar je naartoe bent gesprongen en van waar je bent gekomen in een tagstack. Je kunt deze stack zien met `:tags`. Als je eerst naar `pancake` hebt gesprongen, gevolgd door `donut`, en `:tags` uitvoert, zie je:

```shell
  # NAAR tag         VAN regel  in bestand/tekst
  1  1 pancake            10  ch16_tags/two.rb
  2  1 donut               9  ch16_tags/two.rb
>
```

Let op het `>` symbool hierboven. Het toont je huidige positie in de stack. Om de stack te "poppen" en terug te gaan naar één vorige stack, kun je `:pop` uitvoeren. Probeer het, en voer dan `:tags` opnieuw uit:

```shell
  # NAAR tag         VAN regel  in bestand/tekst
  1  1 pancake            10  puts pancake
> 2  1 donut               9  one.donut

```

Let op dat het `>` symbool nu op regel twee staat, waar de `donut` is. Pop nog een keer, en voer dan `:tags` opnieuw uit:

```shell
  # NAAR tag         VAN regel  in bestand/tekst
> 1  1 pancake            10  puts pancake
  2  1 donut               9  one.donut
```

In de normale modus kun je `Ctrl-t` uitvoeren om hetzelfde effect te bereiken als `:pop`.

## Automatische taggeneratie

Een van de grootste nadelen van Vim-tags is dat je elke keer dat je een significante wijziging aanbrengt, het tagbestand opnieuw moet genereren. Als je onlangs de `pancake` procedure hebt hernoemd naar de `waffle` procedure, wist het tagbestand niet dat de `pancake` procedure was hernoemd. Het slaat nog steeds `pancake` op in de lijst van tags. Je moet `ctags -R .` uitvoeren om een bijgewerkt tagbestand te maken. Het opnieuw creëren van een nieuw tagbestand op deze manier kan omslachtig zijn.

Gelukkig zijn er verschillende methoden die je kunt gebruiken om tags automatisch te genereren.

## Genereer een tag bij opslaan

Vim heeft een autocommand (`autocmd`) methode om een commando uit te voeren bij een gebeurtenis-trigger. Je kunt dit gebruiken om tags bij elke opslag te genereren. Voer uit:

```shell
:autocmd BufWritePost *.rb silent !ctags -R .
```

Uiteenzetting:
- `autocmd` is een commandoregelcommando. Het accepteert een gebeurtenis, bestands patroon en een commando.
- `BufWritePost` is een gebeurtenis voor het opslaan van een buffer. Elke keer dat je een bestand opslaat, trigger je een `BufWritePost` gebeurtenis.
- `.rb` is een bestands patroon voor ruby-bestanden.
- `silent` is eigenlijk een deel van het commando dat je doorgeeft. Zonder dit zal Vim `druk op ENTER of typ een commando om door te gaan` tonen elke keer dat je de autocommand trigger.
- `!ctags -R .` is het commando dat moet worden uitgevoerd. Herinner je dat `!cmd` van binnen Vim een terminalcommando uitvoert.

Nu, elke keer dat je opslaat vanuit een ruby-bestand, zal Vim `ctags -R .` uitvoeren.

## Gebruik van plugins

Er zijn verschillende plugins om ctags automatisch te genereren:

- [vim-gutentags](https://github.com/ludovicchabant/vim-gutentags)
- [vim-tags](https://github.com/szw/vim-tags)
- [vim-easytags](https://github.com/xolox/vim-easytags)
- [vim-autotag](https://github.com/craigemery/vim-autotag)

Ik gebruik vim-gutentags. Het is eenvoudig te gebruiken en werkt meteen uit de doos.

## Ctags en Git Hooks

Tim Pope, auteur van vele geweldige Vim-plugins, schreef een blog waarin hij voorstelt om git hooks te gebruiken. [Bekijk het hier](https://tbaggery.com/2011/08/08/effortless-ctags-with-git.html).

## Leer tags op de slimme manier

Een tag is nuttig zodra deze goed is geconfigureerd. Stel dat je geconfronteerd wordt met een nieuwe codebase en je wilt begrijpen wat `functionFood` doet, dan kun je het gemakkelijk lezen door naar de definitie te springen. Binnenin leer je dat het ook `functionBreakfast` aanroept. Je volgt het en leert dat het `functionPancake` aanroept. Je functie-aanroepgrafiek ziet er ongeveer zo uit:

```shell
functionFood -> functionBreakfast -> functionPancake
```

Dit geeft je inzicht dat deze codeflow gerelateerd is aan het hebben van een pannenkoek voor het ontbijt.

Om meer over tags te leren, kijk naar `:h tags`. Nu je weet hoe je tags moet gebruiken, laten we een andere functie verkennen: vouwen.