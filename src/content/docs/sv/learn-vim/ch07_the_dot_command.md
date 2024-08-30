---
description: Lär dig använda punktkommandot i Vim för att enkelt upprepa ändringar
  och effektivisera redigeringen av kod. Spara tid med smidiga repetitionstekniker.
title: Ch07. the Dot Command
---

I allmänhet bör du försöka undvika att göra om det du just gjorde när det är möjligt. I detta kapitel kommer du att lära dig hur du använder punktkommandot för att enkelt göra om den senaste ändringen. Det är ett mångsidigt kommando för att minska enkla upprepningar.

## Användning

Precis som namnet antyder kan du använda punktkommandot genom att trycka på punktknappen (`.`).

Till exempel, om du vill ersätta alla "let" med "const" i följande uttryck:

```shell
let one = "1";
let two = "2";
let three = "3";
```

- Sök med `/let` för att gå till matchningen.
- Ändra med `cwconst<Esc>` för att ersätta "let" med "const".
- Navigera med `n` för att hitta nästa match med hjälp av den tidigare sökningen.
- Upprepa det du just gjorde med punktkommandot (`.`).
- Fortsätt trycka på `n . n .` tills du ersätter varje ord.

Här upprepade punktkommandot sekvensen `cwconst<Esc>`. Det sparade dig från att skriva åtta tangentryckningar i utbyte mot bara en.

## Vad är en ändring?

Om du tittar på definitionen av punktkommandot (`:h .`), står det att punktkommandot upprepar den senaste ändringen. Vad är en ändring?

Varje gång du uppdaterar (lägger till, ändrar eller tar bort) innehållet i den aktuella bufferten gör du en ändring. Undantagen är uppdateringar som görs av kommandorads-kommandon (kommandon som börjar med `:`) räknas inte som en ändring.

I det första exemplet var `cwconst<Esc>` ändringen. Anta nu att du har denna text:

```shell
pancake, potatoes, fruit-juice,
```

För att ta bort texten från början av raden till nästa förekomst av ett kommatecken, ta först bort till kommatecknet, och upprepa sedan två gånger med `df,..`. 

Låt oss prova ett annat exempel:

```shell
pancake, potatoes, fruit-juice,
```

Denna gång är din uppgift att ta bort kommatecknet, inte frukostobjekten. Med markören i början av raden, gå till det första kommatecknet, ta bort det, och upprepa sedan två gånger med `f,x..` Lätt, eller hur? Vänta lite, det fungerade inte! Varför?

En ändring exkluderar rörelser eftersom den inte uppdaterar buffertinnehållet. Kommandot `f,x` bestod av två åtgärder: kommandot `f,` för att flytta markören till "," och `x` för att ta bort ett tecken. Endast den senare, `x`, orsakade en ändring. Jämför det med `df,` från det tidigare exemplet. I det, är `f,` en direktiv till ta bort-operatören `d`, inte en rörelse för att flytta markören. `f,` i `df,` och `f,x` har två mycket olika roller.

Låt oss avsluta den sista uppgiften. Efter att du har kört `f,` och sedan `x`, gå till nästa kommatecken med `;` för att upprepa den senaste `f`. Använd slutligen `.` för att ta bort tecknet under markören. Upprepa `; . ; .` tills allt är borttaget. Den fullständiga kommandot är `f,x;.;.`.

Låt oss prova en till:

```shell
pancake
potatoes
fruit-juice
```

Låt oss lägga till ett kommatecken i slutet av varje rad. Börja på den första raden, gör `A,<Esc>j`. Vid det här laget inser du att `j` inte orsakar en ändring. Ändringen här är endast `A,`. Du kan flytta och upprepa ändringen med `j . j .`. Den fullständiga kommandot är `A,<Esc>j.j.`.

Varje åtgärd från det ögonblick du trycker på infoga kommandooperatören (`A`) tills du avslutar infoga kommandot (`<Esc>`) betraktas som en ändring.

## Flera rader upprepning

Anta att du har denna text:

```shell
let one = "1";
let two = "2";
let three = "3";
const foo = "bar';
let four = "4";
let five = "5";
let six = "6";
let seven = "7";
let eight = "8";
let nine = "9";
```

Ditt mål är att ta bort alla rader utom "foo"-raden. Först, ta bort de första tre raderna med `d2j`, gå sedan till raden under "foo"-raden. På nästa rad, använd punktkommandot två gånger. Den fullständiga kommandot är `d2jj..`.

Här var ändringen `d2j`. I detta sammanhang var `2j` inte en rörelse, utan en del av ta bort-operatören.

Låt oss titta på ett annat exempel:

```shell
zlet zzone = "1";
zlet zztwo = "2";
zlet zzthree = "3";
let four = "4";
```

Låt oss ta bort alla z:er. Börja från det första tecknet på den första raden, visuellt välj endast den första z:en från de första tre raderna med blockvisuellt läge (`Ctrl-Vjj`). Om du inte är bekant med blockvisuellt läge, kommer jag att täcka dem i ett senare kapitel. När du har de tre z:erna visuellt valda, ta bort dem med ta bort-operatören (`d`). Flytta sedan till nästa ord (`w`) till nästa z. Upprepa ändringen två gånger till (`..`). Den fullständiga kommandot är `Ctrl-vjjdw..`.

När du tog bort en kolumn av tre z:er (`Ctrl-vjjd`), räknades det som en ändring. Visuellt läge kan användas för att rikta in sig på flera rader som en del av en ändring.

## Inkludera en rörelse i en ändring

Låt oss återbesöka det första exemplet i detta kapitel. Kom ihåg att kommandot `/letcwconst<Esc>` följt av `n . n .` ersatte alla "let" med "const" i följande uttryck:

```shell
let one = "1";
let two = "2";
let three = "3";
```

Det finns ett snabbare sätt att åstadkomma detta. Efter att du har sökt `/let`, kör `cgnconst<Esc>` och sedan `. .`.

`gn` är en rörelse som söker framåt efter det senaste sökmönstret (i detta fall, `/let`) och automatiskt gör en visuell markering. För att ersätta nästa förekomst behöver du inte längre flytta och upprepa ändringen (`n . n .`), utan bara upprepa (`. .`). Du behöver inte längre använda sökrörelser eftersom att söka nästa match nu är en del av ändringen!

När du redigerar, var alltid på utkik efter rörelser som kan göra flera saker på en gång som `gn` när det är möjligt.

## Lär dig punktkommandot på det smarta sättet

Punktkommandots kraft kommer från att byta flera tangentryckningar mot en. Det är förmodligen inte en lönsam utbyte att använda punktkommandot för enstaka tangentoperationer som `x`. Om din senaste ändring kräver en komplex operation som `cgnconst<Esc>`, reducerar punktkommandot nio tangentryckningar till en, en mycket lönsam affär.

När du redigerar, tänk på upprepbarhet. Till exempel, om jag behöver ta bort de nästa tre orden, är det mer ekonomiskt att använda `d3w` eller att göra `dw` och sedan `.` två gånger? Kommer du att ta bort ett ord igen? Om så är fallet, då är det meningsfullt att använda `dw` och upprepa det flera gånger istället för `d3w` eftersom `dw` är mer återanvändbar än `d3w`. 

Punktkommandot är ett mångsidigt kommando för att automatisera enskilda ändringar. I ett senare kapitel kommer du att lära dig hur man automatiserar mer komplexa åtgärder med Vim-makron. Men först, låt oss lära oss om register för att lagra och hämta text.