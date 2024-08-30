---
description: Denna dokumentation förklarar hur buffertar, fönster och flikar fungerar
  i Vim, samt hur man konfigurerar inställningar för effektiv användning.
title: Ch02. Buffers, Windows, and Tabs
---

Om du har använt en modern textredigerare tidigare, är du förmodligen bekant med fönster och flikar. Vim använder tre visningsabstraktioner istället för två: buffertar, fönster och flikar. I detta kapitel kommer jag att förklara vad buffertar, fönster och flikar är och hur de fungerar i Vim.

Innan du börjar, se till att du har alternativet `set hidden` i vimrc. Utan det, när du byter buffertar och din aktuella buffert inte är sparad, kommer Vim att be dig spara filen (du vill inte ha det om du vill röra dig snabbt). Jag har ännu inte täckt vimrc. Om du inte har en vimrc, skapa en. Den placeras vanligtvis i din hemkatalog och heter `.vimrc`. Jag har min på `~/.vimrc`. För att se var du ska skapa din vimrc, kolla in `:h vimrc`. Inuti den, lägg till:

```shell
set hidden
```

Spara den, och källan den sedan (kör `:source %` från vimrc).

## Buffertar

Vad är en *buffert*?

En buffert är ett minnesutrymme där du kan skriva och redigera text. När du öppnar en fil i Vim, är datan kopplad till en buffert. När du öppnar 3 filer i Vim, har du 3 buffertar.

Ha två tomma filer, `file1.js` och `file2.js`, tillgängliga (om möjligt, skapa dem med Vim). Kör detta i terminalen:

```bash
vim file1.js
```

Det du ser är `file1.js` *buffert*. När du öppnar en ny fil, skapar Vim en ny buffert.

Avsluta Vim. Denna gång, öppna två nya filer:

```bash
vim file1.js file2.js
```

Vim visar för närvarande `file1.js` buffert, men det skapar faktiskt två buffertar: `file1.js` buffert och `file2.js` buffert. Kör `:buffers` för att se alla buffertar (alternativt kan du använda `:ls` eller `:files` också). Du bör se *båda* `file1.js` och `file2.js` listade. Att köra `vim file1 file2 file3 ... filen` skapar n antal buffertar. Varje gång du öppnar en ny fil, skapar Vim en ny buffert för den filen.

Det finns flera sätt att navigera mellan buffertar:
- `:bnext` för att gå till nästa buffert (`:bprevious` för att gå till föregående buffert).
- `:buffer` + filnamn. Vim kan autocompleta filnamn med `<Tab>`.
- `:buffer` + `n`, där `n` är buffertnumret. Till exempel, genom att skriva `:buffer 2` kommer du till buffert #2.
- Hoppa till den äldre positionen i hopp-listan med `Ctrl-O` och till den nyare positionen med `Ctrl-I`. Dessa är inte buffertspecifika metoder, men de kan användas för att hoppa mellan olika buffertar. Jag kommer att förklara hopp i mer detalj i kapitel 5.
- Gå till den senast redigerade bufferten med `Ctrl-^`.

När Vim skapar en buffert, kommer den att förbli i din buffertlista. För att ta bort den kan du skriva `:bdelete`. Den kan också ta emot ett buffertnummer som parameter (`:bdelete 3` för att ta bort buffert #3) eller ett filnamn (`:bdelete` och använd sedan `<Tab>` för att autocompleta).

Det svåraste för mig när jag lärde mig om buffertar var att visualisera hur de fungerade eftersom mitt sinne var vant vid fönster från när jag använde en mainstream textredigerare. En bra analogi är en kortlek. Om jag har 2 buffertar, har jag en hög med 2 kort. Kortet överst är det enda kortet jag ser, men jag vet att det finns kort under det. Om jag ser `file1.js` buffert visas, då är `file1.js` kortet överst i högen. Jag kan inte se det andra kortet, `file2.js` här, men det är där. Om jag byter buffertar till `file2.js`, är det `file2.js` kortet nu överst i högen och `file1.js` kortet är under det.

Om du inte har använt Vim tidigare, är detta ett nytt koncept. Ta din tid att förstå det.

## Avsluta Vim

Förresten, om du har flera buffertar öppna, kan du stänga alla med quit-all:

```shell
:qall
```

Om du vill stänga utan att spara dina ändringar, lägg bara till `!` i slutet:

```shell
:qall!
```

För att spara och avsluta alla, kör:

```shell
:wqall
```

## Fönster

Ett fönster är en vy på en buffert. Om du kommer från en mainstream redigerare kan detta koncept vara bekant för dig. De flesta textredigerare har förmågan att visa flera fönster. I Vim kan du också ha flera fönster.

Låt oss öppna `file1.js` från terminalen igen:

```bash
vim file1.js
```

Tidigare skrev jag att du tittar på `file1.js` buffert. Även om det var korrekt, var det uttalandet ofullständigt. Du tittar på `file1.js` buffert, visad genom **ett fönster**. Ett fönster är hur du ser en buffert genom.

Sluta inte Vim än. Kör:

```shell
:split file2.js
```

Nu ser du två buffertar genom **två fönster**. Det övre fönstret visar `file2.js` buffert. Det undre fönstret visar `file1.js` buffert.

Om du vill navigera mellan fönster, använd dessa genvägar:

```shell
Ctrl-W H    Flyttar markören till det vänstra fönstret
Ctrl-W J    Flyttar markören till fönstret nedanför
Ctrl-W K    Flyttar markören till fönstret ovanför
Ctrl-W L    Flyttar markören till det högra fönstret
```

Kör nu:

```shell
:vsplit file3.js
```

Du ser nu tre fönster som visar tre buffertar. Ett fönster visar `file3.js` buffert, ett annat fönster visar `file2.js` buffert, och ett annat fönster visar `file1.js` buffert.

Du kan ha flera fönster som visar samma buffert. Medan du är i det övre vänstra fönstret, skriv:

```shell
:buffer file2.js
```

Nu visar båda fönsterna `file2.js` buffert. Om du börjar skriva i ett `file2.js` fönster, kommer du att se att båda fönsterna som visar `file2.js` buffertar uppdateras i realtid.

För att stänga det aktuella fönstret kan du köra `Ctrl-W C` eller skriva `:quit`. När du stänger ett fönster, kommer bufferten fortfarande att finnas där (kör `:buffers` för att bekräfta detta).

Här är några användbara normal-läge fönsterkommandon:

```shell
Ctrl-W V    Öppnar en ny vertikal split
Ctrl-W S    Öppnar en ny horisontell split
Ctrl-W C    Stänger ett fönster
Ctrl-W O    Gör det aktuella fönstret till det enda på skärmen och stänger andra fönster
```

Och här är en lista över användbara fönster kommandorads kommandon:

```shell
:vsplit filename    Dela fönster vertikalt
:split filename     Dela fönster horisontellt
:new filename       Skapa nytt fönster
```

Ta din tid att förstå dem. För mer information, kolla in `:h window`.

## Flikar

En flik är en samling av fönster. Tänk på det som en layout för fönster. I de flesta moderna textredigerare (och moderna webbläsare) betyder en flik en öppen fil / sida och när du stänger den, försvinner den filen / sidan. I Vim representerar en flik inte en öppen fil. När du stänger en flik i Vim, stänger du inte en fil. Du stänger bara layouten. Filen som öppnats i den layouten är fortfarande inte stängd, de är fortfarande öppna i sina buffertar.

Låt oss se Vim-flikar i aktion. Öppna `file1.js`:

```bash
vim file1.js
```

För att öppna `file2.js` i en ny flik:

```shell
:tabnew file2.js
```

Du kan också låta Vim autocompleta filen du vill öppna i en *ny flik* genom att trycka på `<Tab>` (utan dubbeltydigheter).

Nedan är en lista över användbara fliknavigeringar:

```shell
:tabnew file.txt    Öppna file.txt i en ny flik
:tabclose           Stäng den aktuella fliken
:tabnext            Gå till nästa flik
:tabprevious        Gå till föregående flik
:tablast            Gå till sista fliken
:tabfirst           Gå till första fliken
```

Du kan också köra `gt` för att gå till nästa flik (du kan gå till föregående flik med `gT`). Du kan skicka ett antal som argument till `gt`, där antalet är fliknumret. För att gå till den tredje fliken, gör `3gt`.

En fördel med att ha flera flikar är att du kan ha olika fönsterarrangemang i olika flikar. Kanske vill du att din första flik ska ha 3 vertikala fönster och den andra fliken ska ha en blandad horisontell och vertikal fönsterlayout. Flik är det perfekta verktyget för jobbet!

För att starta Vim med flera flikar, kan du göra detta från terminalen:

```bash
vim -p file1.js file2.js file3.js
```

## Rörelse i 3D

Att röra sig mellan fönster är som att resa tvådimensionellt längs X-Y-axeln i kartesiska koordinater. Du kan flytta till det övre, högra, nedre och vänstra fönstret med `Ctrl-W H/J/K/L`.

Att röra sig mellan buffertar är som att resa över Z-axeln i kartesiska koordinater. Föreställ dig att dina buffertfiler radades upp längs Z-axeln. Du kan korsa Z-axeln en buffert i taget med `:bnext` och `:bprevious`. Du kan hoppa till vilken koordinat som helst på Z-axeln med `:buffer filename/buffernumber`.

Du kan röra dig i *tredimensionellt utrymme* genom att kombinera fönster- och buffetrörelser. Du kan röra dig till det övre, högra, nedre eller vänstra fönstret (X-Y-navigeringar) med fönsterrörelser. Eftersom varje fönster innehåller buffertar, kan du röra dig framåt och bakåt (Z-navigeringar) med buffetrörelser.

## Använda Buffertar, Fönster och Flikar på ett Smart Sätt

Du har lärt dig vad buffertar, fönster och flikar är och hur de fungerar i Vim. Nu när du förstår dem bättre, kan du använda dem i ditt eget arbetsflöde.

Alla har ett annat arbetsflöde, här är mitt till exempel:
- Först använder jag buffertar för att lagra alla nödvändiga filer för den aktuella uppgiften. Vim kan hantera många öppna buffertar innan det börjar sakta ner. Dessutom kommer många öppna buffertar inte att tränga ihop min skärm. Jag ser bara en buffert (förutsatt att jag bara har ett fönster) vid varje tidpunkt, vilket gör att jag kan fokusera på en skärm. När jag behöver gå någonstans kan jag snabbt flyga till vilken öppen buffert som helst när som helst.
- Jag använder flera fönster för att visa flera buffertar samtidigt, vanligtvis när jag jämför filer, läser dokument eller följer en kodflöde. Jag försöker hålla antalet öppna fönster till högst tre eftersom min skärm blir trång (jag använder en liten laptop). När jag är klar stänger jag eventuella extra fönster. Färre fönster betyder mindre distraktioner.
- Istället för flikar använder jag [tmux](https://github.com/tmux/tmux/wiki) fönster. Jag brukar använda flera tmux-fönster samtidigt. Till exempel, ett tmux-fönster för klientsideskoder och ett annat för backend-koder.

Mitt arbetsflöde kan se annorlunda ut än ditt baserat på din redigeringsstil och det är okej. Experimentera för att upptäcka ditt eget flöde, som passar din kodningsstil.