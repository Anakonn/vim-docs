---
description: Denna dokumentation beskriver hur man använder insättningsläget i Vim
  för att förbättra skrivhastighet och effektivitet med olika kommandon.
title: Ch06. Insert Mode
---

Insertläge är standardläget för många textredigerare. I detta läge är det du skriver det du får.

Men det betyder inte att det inte finns mycket att lära. Vims insertläge innehåller många användbara funktioner. I detta kapitel kommer du att lära dig hur du använder dessa insertläge-funktioner i Vim för att förbättra din skrivhastighet.

## Sätt att Gå till Insertläge

Det finns många sätt att komma in i insertläge från normalt läge. Här är några av dem:

```shell
i    Infoga text före markören
I    Infoga text före den första icke-tomma tecknet på raden
a    Lägg till text efter markören
A    Lägg till text i slutet av raden
o    Startar en ny rad under markören och infogar text
O    Startar en ny rad ovanför markören och infogar text
s    Ta bort tecknet under markören och infoga text
S    Ta bort den aktuella raden och infoga text, synonym för "cc"
gi   Infoga text på samma position där den senaste insertläget stoppades
gI   Infoga text i början av raden (kolumn 1)
```

Observera mönstret med små/stora bokstäver. För varje litet kommando finns det en stor motsvarighet. Om du är ny, oroa dig inte om du inte kommer ihåg hela listan ovan. Börja med `i` och `o`. De borde vara tillräckliga för att få dig igång. Lär dig gradvis mer över tid.

## Olika Sätt att Avsluta Insertläge

Det finns några olika sätt att återgå till normalt läge medan du är i insertläge:

```shell
<Esc>     Avsluta insertläge och gå till normalt läge
Ctrl-[    Avsluta insertläge och gå till normalt läge
Ctrl-C    Som Ctrl-[ och <Esc>, men kontrollerar inte för förkortningar
```

Jag tycker att `<Esc>`-tangenten är för långt bort, så jag mappar min dator `<Caps-Lock>` att bete sig som `<Esc>`. Om du söker efter Bill Joys ADM-3A-tangentbord (Vi-skaparen), kommer du att se att `<Esc>`-tangenten inte ligger långt uppe till vänster som moderna tangentbord, utan till vänster om `q`-tangenten. Det är därför jag tycker att det är rimligt att mappa `<Caps lock>` till `<Esc>`.

En annan vanlig konvention jag har sett Vim-användare göra är att mappa `<Esc>` till `jj` eller `jk` i insertläge. Om du föredrar detta alternativ, lägg till en av dessa rader (eller båda) i din vimrc-fil.

```shell
inoremap jj <Esc>
inoremap jk <Esc>
```

## Upprepa Insertläge

Du kan ange en räkneparameter innan du går in i insertläge. Till exempel:

```shell
10i
```

Om du skriver "hello world!" och avslutar insertläge, kommer Vim att upprepa texten 10 gånger. Detta fungerar med alla metoder för insertläge (ex: `10I`, `11a`, `12o`).

## Ta Bort Stycken i Insertläge

När du gör ett skrivfel kan det vara besvärligt att trycka på `<Backspace>` upprepade gånger. Det kan vara mer meningsfullt att gå till normalt läge och ta bort ditt misstag. Du kan också ta bort flera tecken åt gången medan du är i insertläge.

```shell
Ctrl-h    Ta bort ett tecken
Ctrl-w    Ta bort ett ord
Ctrl-u    Ta bort hela raden
```

## Infoga Från Register

Vim-register kan lagra texter för framtida användning. För att infoga en text från något namngivet register medan du är i insertläge, skriv `Ctrl-R` plus register-symbolen. Det finns många symboler du kan använda, men för denna sektion, låt oss bara täcka de namngivna registren (a-z).

För att se det i aktion, först behöver du yank ett ord till register a. Flytta din markör över ett ord. Skriv sedan:

```shell
"ayiw
```

- `"a` talar om för Vim att målet för din nästa åtgärd kommer att gå till register a.
- `yiw` yankar inre ord. Granska kapitlet om Vims grammatik för en uppfriskning.

Register a innehåller nu ordet du just yankade. Medan du är i insertläge, för att klistra in texten som lagras i register a:

```shell
Ctrl-R a
```

Det finns flera typer av register i Vim. Jag kommer att täcka dem mer i detalj i ett senare kapitel.

## Rullning

Visste du att du kan rulla medan du är i insertläge? Medan du är i insertläge, om du går till `Ctrl-X` sub-läge, kan du göra ytterligare operationer. Rullning är en av dem.

```shell
Ctrl-X Ctrl-Y    Rulla upp
Ctrl-X Ctrl-E    Rulla ner
```

## Autokomplettering

Som nämnts ovan, om du trycker på `Ctrl-X` från insertläge, kommer Vim att gå in i ett sub-läge. Du kan göra textautokomplettering medan du är i detta insertläge sub-läge. Även om det inte är lika bra som [intellisense](https://code.visualstudio.com/docs/editor/intellisense) eller något annat Language Server Protocol (LSP), är det en mycket kapabel funktion för något som finns tillgängligt direkt ur lådan.

Här är några användbara autokompletteringskommandon för att komma igång:

```shell
Ctrl-X Ctrl-L	   Infoga en hel rad
Ctrl-X Ctrl-N	   Infoga en text från nuvarande fil
Ctrl-X Ctrl-I	   Infoga en text från inkluderade filer
Ctrl-X Ctrl-F	   Infoga ett filnamn
```

När du utlöser autokomplettering kommer Vim att visa ett popup-fönster. För att navigera upp och ner i popup-fönstret, använd `Ctrl-N` och `Ctrl-P`.

Vim har också två autokompletteringsgenvägar som inte involverar `Ctrl-X` sub-läge:

```shell
Ctrl-N             Hitta nästa ordmatch
Ctrl-P             Hitta föregående ordmatch
```

Generellt sett tittar Vim på texten i alla tillgängliga buffertar för autokompletteringskälla. Om du har en öppen buffert med en rad som säger "Chocolate donuts are the best":
- När du skriver "Choco" och gör `Ctrl-X Ctrl-L`, kommer det att matcha och skriva ut hela raden.
- När du skriver "Choco" och gör `Ctrl-P`, kommer det att matcha och skriva ut ordet "Chocolate".

Autokomplettering är ett stort ämne i Vim. Detta är bara toppen av isberget. För att lära dig mer, kolla in `:h ins-completion`.

## Utföra ett Normalt Läge Kommando

Visste du att Vim kan utföra ett normalt läge kommando medan du är i insertläge?

Medan du är i insertläge, om du trycker på `Ctrl-O`, kommer du att vara i insert-normalt sub-läge. Om du tittar på lägesindikatorn längst ner till vänster, kommer du normalt att se `-- INSERT --`, men genom att trycka på `Ctrl-O` ändras det till `-- (insert) --`. I detta läge kan du göra *ett* normalt läge kommando. Några saker du kan göra:

**Centrera och hoppa**

```shell
Ctrl-O zz       Centrera fönstret
Ctrl-O H/M/L    Hoppa till topp/mitt/botten av fönstret
Ctrl-O 'a       Hoppa till markering a
```

**Upprepa text**

```shell
Ctrl-O 100ihello    Infoga "hello" 100 gånger
```

**Utföra terminalkommandon**

```shell
Ctrl-O !! curl https://google.com    Kör curl
Ctrl-O !! pwd                        Kör pwd
```

**Ta bort snabbare**

```shell
Ctrl-O dtz    Ta bort från nuvarande plats till bokstaven "z"
Ctrl-O D      Ta bort från nuvarande plats till slutet av raden
```

## Lär dig Insertläge på det Smartare Sättet

Om du är som jag och kommer från en annan textredigerare, kan det vara frestande att stanna i insertläge. Men att stanna i insertläge när du inte skriver en text är ett anti-mönster. Utveckla en vana att gå till normalt läge när dina fingrar inte skriver ny text.

När du behöver infoga en text, fråga först dig själv om den texten redan finns. Om den gör det, försök att yank eller flytta den texten istället för att skriva den. Om du måste använda insertläge, se om du kan autokomplettera den texten när det är möjligt. Undvik att skriva samma ord mer än en gång om du kan.