---
description: Lär dig hur du använder Vim-taggar för att snabbt navigera till definitioner
  i kod, vilket underlättar förståelsen av okända kodbaser.
title: Ch16. Tags
---

En användbar funktion i textredigering är att snabbt kunna gå till vilken definition som helst. I detta kapitel kommer du att lära dig hur man använder Vim-taggar för att göra det.

## Taggöversikt

Anta att någon gav dig en ny kodbas:

```shell
one = One.new
one.donut
```

`One`? `donut`? Tja, dessa kanske var uppenbara för utvecklarna som skrev koden för länge sedan, men nu är de utvecklarna inte längre här och det är upp till dig att förstå dessa obskyra koder. Ett sätt att hjälpa till att förstå detta är att följa källkoden där `One` och `donut` är definierade.

Du kan söka efter dem med antingen `fzf` eller `grep` (eller `vimgrep`), men i det här fallet är taggar snabbare.

Tänk på taggar som en adressbok:

```shell
Namn    Adress
Iggy1   1234 Cool St, 11111
Iggy2   9876 Awesome Ave, 2222
```

Istället för att ha ett namn-adresspar lagrar taggar definitioner kopplade till adresser.

Låt oss anta att du har dessa två Ruby-filer i samma katalog:

```shell
## one.rb
class One
  def initialize
    puts "Initierad"
  end

  def donut
    puts "Bar"
  end
end
```

och

```shell
## two.rb
require './one'

one = One.new
one.donut
```

För att hoppa till en definition kan du använda `Ctrl-]` i normal läge. Inuti `two.rb`, gå till raden där `one.donut` är och flytta markören över `donut`. Tryck på `Ctrl-]`.

Oj, Vim kunde inte hitta taggfilen. Du behöver generera taggfilen först.

## Tagggenerator

Moderna Vim kommer inte med tagggenerator, så du måste ladda ner en extern tagggenerator. Det finns flera alternativ att välja mellan:

- ctags = Endast C. Finns nästan överallt.
- exuberant ctags = En av de mest populära. Har stöd för många språk.
- universal ctags = Liknande exuberant ctags, men nyare.
- etags = För Emacs. Hmm...
- JTags = Java
- ptags.py = Python
- ptags = Perl
- gnatxref = Ada

Om du tittar på Vim-tutorials online, kommer många att rekommendera [exuberant ctags](http://ctags.sourceforge.net/). Det stöder [41 programmeringsspråk](http://ctags.sourceforge.net/languages.html). Jag använde det och det fungerade bra. Men eftersom det inte har underhållits sedan 2009, skulle Universal ctags vara ett bättre val. Det fungerar liknande exuberant ctags och underhålls för närvarande.

Jag kommer inte att gå in på detaljer om hur man installerar universal ctags. Kolla in [universal ctags](https://github.com/universal-ctags/ctags) för mer information.

Anta att du har universal ctags installerat, låt oss generera en grundläggande taggfil. Kör:

```shell
ctags -R .
```

`R`-alternativet säger till ctags att köra en rekursiv skanning från din nuvarande plats (`.`). Du bör se en `tags`-fil i din nuvarande katalog. Inuti kommer du att se något som detta:

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

Din kan se lite annorlunda ut beroende på dina Vim-inställningar och tagggeneratorn. En taggfil består av två delar: taggmetadata och tagglista. Dessa metadata (`!TAG_FILE...`) kontrolleras vanligtvis av tagggeneratorn. Jag kommer inte att diskutera det här, men känn dig fri att kolla deras dokumentation för mer! Tagglistan är en lista över alla definitioner som indexerats av ctags.

Nu gå till `two.rb`, placera markören på `donut`, och skriv `Ctrl-]`. Vim kommer att ta dig till filen `one.rb` på raden där `def donut` är. Framgång! Men hur gjorde Vim detta?

## Taggar Anatom

Låt oss titta på taggobjektet `donut`:

```shell
donut	one.rb	/^  def donut$/;"	f	class:One
```

Det ovanstående taggobjektet består av fyra komponenter: ett `taggnamn`, en `taggfil`, en `taggadress` och taggalternativ.
- `donut` är `taggnamnet`. När din markör är på "donut", söker Vim i taggfilen efter en rad som har strängen "donut".
- `one.rb` är `taggfilen`. Vim letar efter en fil `one.rb`.
- `/^ def donut$/` är `taggadressen`. `/.../` är en mönsterindikator. `^` är ett mönster för det första elementet på en rad. Det följs av två mellanslag, sedan strängen `def donut`. Slutligen, `$` är ett mönster för det sista elementet på en rad.
- `f class:One` är taggalternativet som säger till Vim att funktionen `donut` är en funktion (`f`) och är en del av klassen `One`.

Låt oss titta på ett annat objekt i tagglistan:

```shell
One	one.rb	/^class One$/;"	c
```

Denna rad fungerar på samma sätt som `donut`-mönstret:

- `One` är `taggnamnet`. Observera att med taggar är den första skanningen skiftlägeskänslig. Om du har `One` och `one` på listan, kommer Vim att prioritera `One` över `one`.
- `one.rb` är `taggfilen`. Vim letar efter en fil `one.rb`.
- `/^class One$/` är `taggadressen` mönstret. Vim letar efter en rad som börjar med (`^`) `class` och slutar med (`$`) `One`.
- `c` är ett av de möjliga taggalternativen. Eftersom `One` är en Ruby-klass och inte en procedur, markerar den den med en `c`.

Beroende på vilken tagggenerator du använder kan innehållet i din taggfil se annorlunda ut. Minst måste en taggfil ha antingen ett av dessa format:

```shell
1.  {taggnamn} {TAB} {taggfil} {TAB} {taggadress}
2.  {taggnamn} {TAB} {taggfil} {TAB} {taggadress} {term} {fält} ..
```

## Taggfilen

Du har lärt dig att en ny fil, `tags`, skapas efter att ha kört `ctags -R .`. Hur vet Vim var den ska leta efter taggfilen?

Om du kör `:set tags?`, kan du se `tags=./tags,tags` (beroende på dina Vim-inställningar kan det vara annorlunda). Här letar Vim efter alla taggar i sökvägen till den aktuella filen i fallet `./tags` och den aktuella katalogen (din projektrot) i fallet `tags`.

Även i fallet `./tags`, kommer Vim först att leta efter en taggfil inuti sökvägen till din aktuella fil oavsett hur nästlad den är, sedan kommer den att leta efter en taggfil i den aktuella katalogen (projektroten). Vim slutar efter att den hittar den första matchningen.

Om din `'tags'`-fil hade sagt `tags=./tags,tags,/user/iggy/mytags/tags`, skulle Vim också titta på `/user/iggy/mytags`-katalogen efter en taggfil efter att Vim har avslutat sökningen i `./tags` och `tags`-katalogen. Du behöver inte lagra din taggfil inuti ditt projekt, du kan hålla dem separata.

För att lägga till en ny taggfilplats, använd följande:

```shell
set tags+=path/to/my/tags/file
```

## Generera taggar för ett stort projekt

Om du försöker köra ctags i ett stort projekt kan det ta lång tid eftersom Vim också letar inuti varje nästlad katalog. Om du är en Javascript-utvecklare vet du att `node_modules` kan vara mycket stora. Tänk dig att du har fem underprojekt och varje innehåller sin egen `node_modules`-katalog. Om du kör `ctags -R .`, kommer ctags att försöka skanna genom alla 5 `node_modules`. Du behöver förmodligen inte köra ctags på `node_modules`.

För att köra ctags utan att inkludera `node_modules`, kör:

```shell
ctags -R --exclude=node_modules .
```

Denna gång bör det ta mindre än en sekund. Förresten, du kan använda `exclude`-alternativet flera gånger:

```shell
ctags -R --exclude=.git --exclude=vendor --exclude=node_modules --exclude=db --exclude=log .
```

Poängen är, om du vill utelämna en katalog, är `--exclude` din bästa vän.

## Taggnavigering

Du kan få bra användning av att bara använda `Ctrl-]`, men låt oss lära oss några fler tricks. Tagghoppnyckeln `Ctrl-]` har ett alternativ i kommandoradsläge: `:tag {taggnamn}`. Om du kör:

```shell
:tag donut
```

Vim kommer att hoppa till `donut`-metoden, precis som att göra `Ctrl-]` på "donut"-strängen. Du kan också autocompleta argumentet med `<Tab>`:

```shell
:tag d<Tab>
```

Vim listar alla taggar som börjar med "d". I det här fallet, "donut".

I ett riktigt projekt kan du stöta på flera metoder med samma namn. Låt oss uppdatera de två ruby-filerna från tidigare. Inuti `one.rb`:

```shell
## one.rb
class One
  def initialize
    puts "Initierad"
  end

  def donut
    puts "en donut"
  end

  def pancake
    puts "en pannkaka"
  end
end
```

Inuti `two.rb`:

```shell
## two.rb
require './one.rb'

def pancake
  "Två pannkakor"
end

one = One.new
one.donut
puts pancake
```

Om du kodar med, glöm inte att köra `ctags -R .` igen eftersom du nu har flera nya procedurer. Du har två instanser av `pancake`-proceduren. Om du är inne i `two.rb` och trycker på `Ctrl-]`, vad skulle hända?

Vim kommer att hoppa till `def pancake` inuti `two.rb`, inte `def pancake` inuti `one.rb`. Detta beror på att Vim ser `pancake`-proceduren inuti `two.rb` som att ha högre prioritet än den andra `pancake`-proceduren.

## Taggprioritet

Inte alla taggar är lika. Vissa taggar har högre prioritet. Om Vim presenteras med dubblettnamn kontrollerar Vim prioriteten för nyckelordet. Ordningen är:

1. En helt matchad statisk tagg i den aktuella filen.
2. En helt matchad global tagg i den aktuella filen.
3. En helt matchad global tagg i en annan fil.
4. En helt matchad statisk tagg i en annan fil.
5. En skiftlägesokänsligt matchad statisk tagg i den aktuella filen.
6. En skiftlägesokänsligt matchad global tagg i den aktuella filen.
7. En skiftlägesokänsligt matchad global tagg i en annan fil.
8. En skiftlägesokänsligt matchad statisk tagg i den aktuella filen.

Enligt prioriteringslistan prioriterar Vim den exakta matchningen som hittas i samma fil. Det är därför Vim väljer `pancake`-proceduren inuti `two.rb` över `pancake`-proceduren inuti `one.rb`. Det finns vissa undantag från prioriteringslistan ovan beroende på dina inställningar för `'tagcase'`, `'ignorecase'` och `'smartcase'`, men jag kommer inte att diskutera dem här. Om du är intresserad, kolla in `:h tag-priority`.

## Selektiva tagghopp

Det skulle vara trevligt om du kunde välja vilka taggobjekt du vill hoppa till istället för att alltid gå till det högst prioriterade taggobjektet. Kanske behöver du faktiskt hoppa till `pancake`-metoden i `one.rb` och inte den i `two.rb`. För att göra det kan du använda `:tselect`. Kör:

```shell
:tselect pancake
```

Du kommer att se, längst ner på skärmen:
## pri kind tag               fil
1 F C f    pancake           two.rb
             def pancake
2 F   f    pancake           one.rb
             class:One
             def pancake
```

Om du skriver 2, kommer Vim att hoppa till proceduren i `one.rb`. Om du skriver 1, kommer Vim att hoppa till proceduren i `two.rb`.

Observera `pri`-kolumnen. Du har `F C` på den första matchningen och `F` på den andra matchningen. Detta är vad Vim använder för att bestämma tagprioritet. `F C` betyder en fullt matchad (`F`) global tag i den aktuella (`C`) filen. `F` betyder endast en fullt matchad (`F`) global tag. `F C` har alltid en högre prioritet än `F`.

Om du kör `:tselect donut`, kommer Vim också att be dig välja vilket tagobjekt du vill hoppa till, även om det bara finns ett alternativ att välja mellan. Finns det ett sätt för Vim att bara be om taglistan om det finns flera matchningar och att hoppa direkt om det bara finns en tagg som hittas?

Självklart! Vim har en `:tjump`-metod. Kör:

```shell
:tjump donut
```

Vim kommer omedelbart att hoppa till `donut`-proceduren i `one.rb`, mycket som att köra `:tag donut`. Kör nu:

```shell
:tjump pancake
```

Vim kommer att be dig välja tagalternativ, mycket som att köra `:tselect pancake`. Med `tjump` får du det bästa av båda metoderna.

Vim har en normal läge-tangent för `tjump`: `g Ctrl-]`. Jag personligen gillar `g Ctrl-]` bättre än `Ctrl-]`.

## Automatisk komplettering med taggar

Taggar kan hjälpa till med automatisk komplettering. Kom ihåg från kapitel 6, Insättningsläge, att du kan använda `Ctrl-X` subläge för att göra olika automatisk kompletteringar. Ett automatisk kompletterings subläge som jag inte nämnde var `Ctrl-]`. Om du gör `Ctrl-X Ctrl-]` medan du är i insättningsläge, kommer Vim att använda taggfilen för automatisk komplettering.

Om du går in i insättningsläge och skriver `Ctrl-x Ctrl-]`, kommer du att se:

```shell
One
donut
initialize
pancake
```

## Taggstack

Vim håller en lista över alla taggar du har hoppat till och från i en taggstack. Du kan se denna stack med `:tags`. Om du först har tagghoppat till `pancake`, följt av `donut`, och kör `:tags`, kommer du att se:

```shell
  # TILL tag         FRÅN rad  i fil/text
  1  1 pancake            10  ch16_tags/two.rb
  2  1 donut               9  ch16_tags/two.rb
>
```

Observera `>`-symbolen ovan. Den visar din nuvarande position i stacken. För att "poppa" stacken för att gå tillbaka till en tidigare stack, kan du köra `:pop`. Prova det, kör sedan `:tags` igen:

```shell
  # TILL tag         FRÅN rad  i fil/text
  1  1 pancake            10  puts pancake
> 2  1 donut               9  one.donut

```

Observera att `>`-symbolen nu är på rad två, där `donut` är. Poppa en gång till, kör sedan `:tags` igen:

```shell
  # TILL tag         FRÅN rad  i fil/text
> 1  1 pancake            10  puts pancake
  2  1 donut               9  one.donut
```

I normalt läge kan du köra `Ctrl-t` för att uppnå samma effekt som `:pop`.

## Automatisk tagggenerering

En av de största nackdelarna med Vim-taggar är att varje gång du gör en betydande ändring, måste du regenerera taggfilen. Om du nyligen har döpt om `pancake`-proceduren till `waffle`-proceduren, visste inte taggfilen att `pancake`-proceduren hade döpts om. Den lagrade fortfarande `pancake` i listan över taggar. Du måste köra `ctags -R .` för att skapa en uppdaterad taggfil. Att återskapa en ny taggfil på detta sätt kan vara besvärligt.

Lyckligtvis finns det flera metoder du kan använda för att generera taggar automatiskt.

## Generera en tagg vid sparande

Vim har en autokommandon (`autocmd`) metod för att utföra ett kommando vid en händelseutlösare. Du kan använda detta för att generera taggar vid varje sparande. Kör:

```shell
:autocmd BufWritePost *.rb silent !ctags -R .
```

Genomgång:
- `autocmd` är ett kommandorads kommando. Det accepterar en händelse, filmönster och ett kommando.
- `BufWritePost` är en händelse för att spara en buffert. Varje gång du sparar en fil, utlöser du en `BufWritePost`-händelse.
- `.rb` är ett filmönster för ruby-filer.
- `silent` är faktiskt en del av kommandot du skickar. Utan detta kommer Vim att visa `tryck ENTER eller skriv kommando för att fortsätta` varje gång du utlöser autokommandot.
- `!ctags -R .` är kommandot som ska utföras. Kom ihåg att `!cmd` från inne i Vim utför terminalkommandot.

Nu varje gång du sparar från en ruby-fil, kommer Vim att köra `ctags -R .`.

## Använda plugins

Det finns flera plugins för att generera ctags automatiskt:

- [vim-gutentags](https://github.com/ludovicchabant/vim-gutentags)
- [vim-tags](https://github.com/szw/vim-tags)
- [vim-easytags](https://github.com/xolox/vim-easytags)
- [vim-autotag](https://github.com/craigemery/vim-autotag)

Jag använder vim-gutentags. Det är enkelt att använda och fungerar direkt ur lådan.

## Ctags och Git Hooks

Tim Pope, författare till många fantastiska Vim-plugins, skrev en blogg som föreslog att använda git hooks. [Kolla in det](https://tbaggery.com/2011/08/08/effortless-ctags-with-git.html).

## Lär dig taggar på det smarta sättet

En tagg är användbar när den är korrekt konfigurerad. Anta att du står inför en ny kodbas och vill förstå vad `functionFood` gör, kan du enkelt läsa den genom att hoppa till dess definition. Inuti lär du dig att den också anropar `functionBreakfast`. Du följer den och lär dig att den anropar `functionPancake`. Din funktionsanropsgraf ser ut som följande:

```shell
functionFood -> functionBreakfast -> functionPancake
```

Detta ger dig insikt om att detta kodflöde är relaterat till att ha en pannkaka till frukost.

För att lära dig mer om taggar, kolla in `:h tags`. Nu när du vet hur man använder taggar, låt oss utforska en annan funktion: vikning.