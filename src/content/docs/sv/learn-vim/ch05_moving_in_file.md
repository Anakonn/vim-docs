---
description: Lär dig grundläggande navigationsrörelser i Vim för att bli mer produktiv.
  Få tips för att effektivt använda tangentbordet istället för musen.
title: Ch05. Moving in a File
---

I början känns det långsamt och klumpigt att röra sig med ett tangentbord, men ge inte upp! När du väl vänjer dig kan du gå var som helst i en fil snabbare än med en mus.

I det här kapitlet kommer du att lära dig de grundläggande rörelserna och hur du använder dem effektivt. Tänk på att detta **inte** är hela rörelsen som Vim har. Målet här är att introducera användbara rörelser för att bli produktiv snabbt. Om du behöver lära dig mer, kolla in `:h motion.txt`.

## Teckennavigering

Den mest grundläggande rörelseenheten är att flytta ett tecken åt vänster, ner, upp och höger.

```shell
h   Vänster
j   Ner
k   Upp
l   Höger
gj  Ner i en mjukt inlindad rad
gk  Upp i en mjukt inlindad rad
```

Du kan också röra dig med riktade pilar. Om du precis har börjat, känn dig fri att använda vilken metod du är mest bekväm med.

Jag föredrar `hjkl` eftersom min högra hand kan stanna på hemraden. Att göra detta ger mig kortare räckvidd till omgivande tangenter. För att vänja mig vid `hjkl` inaktiverade jag faktiskt piltangenterna när jag började genom att lägga till detta i `~/.vimrc`:

```shell
noremap <Up> <NOP>
noremap <Down> <NOP>
noremap <Left> <NOP>
noremap <Right> <NOP>
```

Det finns också plugins för att hjälpa till att bryta denna dåliga vana. En av dem är [vim-hardtime](https://github.com/takac/vim-hardtime). Till min förvåning tog det mig mindre än en vecka att vänja mig vid `hjkl`.

Om du undrar varför Vim använder `hjkl` för att röra sig, beror det på att Lear-Siegler ADM-3A-terminalen där Bill Joy skrev Vi, inte hade piltangenter och använde `hjkl` som vänster/ner/upp/höger.*

## Relativ numrering

Jag tycker att det är hjälpsamt att ha `number` och `relativenumber` inställt. Du kan göra det genom att ha detta i `.vimrc`:

```shell
set relativenumber number
```

Detta visar mitt aktuella radnummer och relativa radnummer.

Det är lätt att förstå varför det är användbart att ha ett nummer i den vänstra kolumnen, men några av er kanske undrar hur det kan vara användbart att ha relativa nummer i den vänstra kolumnen. Att ha ett relativt nummer gör att jag snabbt kan se hur många rader min kursort är från den målt texten. Med detta kan jag enkelt se att min målt text är 12 rader under mig så jag kan göra `d12j` för att ta bort dem. Annars, om jag är på rad 69 och min målt text är på rad 81, måste jag göra mental beräkning (81 - 69 = 12). Att göra matematik medan jag redigerar tar för mycket mentala resurser. Ju mindre jag behöver tänka på vart jag behöver gå, desto bättre.

Detta är 100% personlig preferens. Experimentera med `relativenumber` / `norelativenumber`, `number` / `nonumber` och använd vad du tycker är mest användbart!

## Räkna din rörelse

Låt oss prata om "räkna"-argumentet. Vim-rörelser accepterar ett föregående numeriskt argument. Jag nämnde ovan att du kan gå ner 12 rader med `12j`. Talen i `12j` är räkneantalet.

Syntaxen för att använda räkna med din rörelse är:

```shell
[count] + motion
```

Du kan tillämpa detta på alla rörelser. Om du vill flytta 9 tecken åt höger, istället för att trycka på `l` 9 gånger, kan du göra `9l`.

## Ordnavigering

Låt oss gå till en större rörelseenhet: *ord*. Du kan flytta till början av nästa ord (`w`), till slutet av nästa ord (`e`), till början av föregående ord (`b`), och till slutet av föregående ord (`ge`).

Dessutom finns det *WORD*, som är skild från ord. Du kan flytta till början av nästa WORD (`W`), till slutet av nästa WORD (`E`), till början av föregående WORD (`B`), och till slutet av föregående WORD (`gE`). För att göra det lättare att komma ihåg använder WORD samma bokstäver som ord, bara versaler.

```shell
w     Flytta framåt till början av nästa ord
W     Flytta framåt till början av nästa WORD
e     Flytta framåt ett ord till slutet av nästa ord
E     Flytta framåt ett ord till slutet av nästa WORD
b     Flytta bakåt till början av föregående ord
B     Flytta bakåt till början av föregående WORD
ge    Flytta bakåt till slutet av föregående ord
gE    Flytta bakåt till slutet av föregående WORD
```

Så vad är likheterna och skillnaderna mellan ett ord och en WORD? Både ord och WORD separeras av blanktecken. Ett ord är en sekvens av tecken som innehåller *endast* `a-zA-Z0-9_`. En WORD är en sekvens av alla tecken utom vita utrymmen (ett vitt utrymme betyder antingen mellanslag, tab och EOL). För att lära dig mer, kolla in `:h word` och `:h WORD`.

Till exempel, anta att du har:

```shell
const hello = "world";
```

Med din kursort i början av raden, för att gå till slutet av raden med `l`, kommer det att ta 21 tangentryck. Med `w` tar det 6. Med `W` tar det bara 4. Både ord och WORD är bra alternativ för att resa korta avstånd.

Men du kan komma från "c" till ";" med ett tangenttryck med nuvarande radnavigering.

## Nuvarande radnavigering

När du redigerar behöver du ofta navigera horisontellt i en rad. För att hoppa till det första tecknet i den aktuella raden, använd `0`. För att gå till det sista tecknet i den aktuella raden, använd `$`. Dessutom kan du använda `^` för att gå till det första icke-blanka tecknet i den aktuella raden och `g_` för att gå till det sista icke-blanka tecknet i den aktuella raden. Om du vill gå till kolumn `n` i den aktuella raden kan du använda `n|`.

```shell
0     Gå till det första tecknet i den aktuella raden
^     Gå till det första icke-blanka tecknet i den aktuella raden
g_    Gå till det sista icke-blanka tecknet i den aktuella raden
$     Gå till det sista tecknet i den aktuella raden
n|    Gå till kolumn n i den aktuella raden
```

Du kan göra nuvarande rad sökningar med `f` och `t`. Skillnaden mellan `f` och `t` är att `f` tar dig till den första bokstaven i matchningen och `t` tar dig till (precis före) den första bokstaven i matchningen. Så om du vill söka efter "h" och landa på "h", använd `fh`. Om du vill söka efter första "h" och landa precis före matchningen, använd `th`. Om du vill gå till den *nästa* förekomsten av den senaste sökningen i den aktuella raden, använd `;`. För att gå till den föregående förekomsten av den senaste matchningen i den aktuella raden, använd `,`.

`F` och `T` är de bakåtriktade motsvarigheterna till `f` och `t`. För att söka bakåt efter "h", kör `Fh`. För att fortsätta söka efter "h" i samma riktning, använd `;`. Observera att `;` efter en `Fh` söker bakåt och `,` efter `Fh` söker framåt.

```shell
f    Sök framåt efter en matchning i samma rad
F    Sök bakåt efter en matchning i samma rad
t    Sök framåt efter en matchning i samma rad, stoppa före matchning
T    Sök bakåt efter en matchning i samma rad, stoppa före matchning
;    Upprepa den senaste sökningen i samma rad med samma riktning
,    Upprepa den senaste sökningen i samma rad med motsatt riktning
```

Tillbaka till det tidigare exemplet:

```shell
const hello = "world";
```

Med din kursort i början av raden kan du gå till det sista tecknet i den aktuella raden (";") med ett tangenttryck: `$`. Om du vill gå till "w" i "world", kan du använda `fw`. Ett bra tips för att gå var som helst i en rad är att leta efter minst vanliga bokstäver som "j", "x", "z" nära ditt mål.

## Menings- och stycknavigering

De nästa två navigeringsenheterna är mening och stycke.

Låt oss först prata om vad en mening är. En mening avslutas med antingen `. ! ?` följt av en EOL, ett mellanslag eller en tabb. Du kan hoppa till nästa mening med `)` och föregående mening med `(`.

```shell
(    Hoppa till föregående mening
)    Hoppa till nästa mening
```

Låt oss titta på några exempel. Vilka fraser tror du är meningar och vilka är det inte? Försök navigera med `(` och `)` i Vim!

```shell
Jag är en mening. Jag är en annan mening eftersom jag slutar med en punkt. Jag är fortfarande en mening när jag slutar med ett utropstecken! Vad sägs om frågetecken? Jag är inte riktigt en mening på grund av bindestrecket - och varken semikolon ; eller kolon :

Det finns en tom rad ovanför mig.
```

Förresten, om du har problem med att Vim inte räknar en mening för fraser som separeras av `.` följt av en enda rad, kan du vara i `'compatible'` läge. Lägg till `set nocompatible` i vimrc. I Vi är en mening en `.` följt av **två** mellanslag. Du bör alltid ha `nocompatible` inställt.

Låt oss prata om vad ett stycke är. Ett stycke börjar efter varje tom rad och också vid varje uppsättning av en styckemakro specificerad av par av tecken i styckealternativet.

```shell
{    Hoppa till föregående stycke
}    Hoppa till nästa stycke
```

Om du inte är säker på vad en styckemakro är, oroa dig inte. Det viktiga är att ett stycke börjar och slutar efter en tom rad. Detta bör vara sant för det mesta.

Låt oss titta på detta exempel. Försök navigera runt med `}` och `{` (och lek också med meningsnavigeringarna `( )` för att röra dig runt också!)

```shell
Hej. Hur mår du? Jag mår bra, tack!
Vim är fantastiskt.
Det kan vara svårt att lära sig det i början...- men vi är i detta tillsammans. Lycka till!

Hej igen.

Försök att röra dig runt med ), (, }, och {. Känn hur de fungerar.
Du klarar det.
```

Kolla in `:h sentence` och `:h paragraph` för att lära dig mer.

## Matchnavigering

Programmerare skriver och redigerar kod. Koden använder typiskt parenteser, klamrar och hakparenteser. Du kan lätt gå vilse i dem. Om du är inne i en kan du hoppa till det andra paret (om det finns) med `%`. Du kan också använda detta för att ta reda på om du har matchande parenteser, klamrar och hakparenteser.

```shell
%    Navigera till en annan matchning, fungerar vanligtvis för (), [], {}
```

Låt oss titta på ett Scheme-kodexempel eftersom det använder parenteser i stor utsträckning. Rör dig runt med `%` inuti olika parenteser.

```shell
(define (fib n)
  (cond ((= n 0) 0)
        ((= n 1) 1)
        (else
          (+ (fib (- n 1)) (fib (- n 2)))
        )))
```

Jag personligen gillar att komplettera `%` med visuella indikatorplugins som [vim-rainbow](https://github.com/frazrepo/vim-rainbow). För mer, kolla in `:h %`.

## Radnummernavigering

Du kan hoppa till radnummer `n` med `nG`. Till exempel, om du vill hoppa till rad 7, använd `7G`. För att hoppa till den första raden, använd antingen `1G` eller `gg`. För att hoppa till den sista raden, använd `G`.

Ofta vet du inte exakt vilket radnummer din målt text har, men du vet att det är ungefär vid 70% av hela filen. I det här fallet kan du göra `70%`. För att hoppa halvvägs genom filen kan du göra `50%`.

```shell
gg    Gå till den första raden
G     Gå till den sista raden
nG    Gå till rad n
n%    Gå till n% i filen
```

Förresten, om du vill se totala rader i en fil, kan du använda `Ctrl-g`.

## Fönsternavigering

För att snabbt gå till toppen, mitten eller botten av ditt *fönster*, kan du använda `H`, `M`, och `L`.

Du kan också ange ett antal till `H` och `L`. Om du använder `10H`, kommer du att gå 10 rader under toppen av fönstret. Om du använder `3L`, kommer du att gå 3 rader ovanför den sista raden i fönstret.

```shell
H     Gå till toppen av skärmen
M     Gå till medel av skärmen
L     Gå till botten av skärmen
nH    Gå n rader från toppen
nL    Gå n rader från botten
```

## Skrollning

För att skrolla har du 3 hastighetsökningar: helskärm (`Ctrl-F/Ctrl-B`), halva skärmen (`Ctrl-D/Ctrl-U`), och rad (`Ctrl-E/Ctrl-Y`).

```shell
Ctrl-E    Skrolla ner en rad
Ctrl-D    Skrolla ner en halv skärm
Ctrl-F    Skrolla ner hela skärmen
Ctrl-Y    Skrolla upp en rad
Ctrl-U    Skrolla upp en halv skärm
Ctrl-B    Skrolla upp hela skärmen
```

Du kan också skrolla relativt till den aktuella raden (zoomskärmsyn):

```shell
zt    För upp den aktuella raden nära toppen av din skärm
zz    För den aktuella raden till mitten av din skärm
zb    För den aktuella raden nära botten av din skärm
```
## Sök Navigering

Ofta vet du att en fras finns i en fil. Du kan använda söknavigering för att snabbt nå ditt mål. För att söka efter en fras kan du använda `/` för att söka framåt och `?` för att söka bakåt. För att upprepa den senaste sökningen kan du använda `n`. För att upprepa den senaste sökningen i motsatt riktning kan du använda `N`.

```shell
/    Sök framåt efter en matchning
?    Sök bakåt efter en matchning
n    Upprepa senaste sökningen i samma riktning som föregående sökning
N    Upprepa senaste sökningen i motsatt riktning som föregående sökning
```

Anta att du har denna text:

```shell
let one = 1;
let two = 2;
one = "01";
one = "one";
let onetwo = 12;
```

Om du söker efter "let", kör `/let`. För att snabbt söka efter "let" igen kan du bara göra `n`. För att söka efter "let" igen i motsatt riktning, kör `N`. Om du kör `?let`, kommer det att söka efter "let" bakåt. Om du använder `n`, kommer det nu att söka efter "let" bakåt (`N` kommer nu att söka efter "let" framåt).

Du kan aktivera sökmarkering med `set hlsearch`. Nu när du söker efter `/let`, kommer det att markera *alla* matchande fraser i filen. Dessutom kan du ställa in inkrementell sökning med `set incsearch`. Detta kommer att markera mönstret medan du skriver. Som standard kommer dina matchande fraser att förbli markerade tills du söker efter en annan fras. Detta kan snabbt bli en irritation. För att inaktivera markering kan du köra `:nohlsearch` eller helt enkelt `:noh`. Eftersom jag använder denna ingen-markering-funktion ofta, skapade jag en karta i vimrc:

```shell
nnoremap <esc><esc> :noh<return><esc>
```

Du kan snabbt söka efter texten under markören med `*` för att söka framåt och `#` för att söka bakåt. Om din markör är på strängen "one", kommer tryckning på `*` att vara detsamma som om du hade gjort `/\<one\>`.

Både `\<` och `\>` i `/\<one\>` betyder hela ordsökning. Det matchar inte "one" om det är en del av ett större ord. Det kommer att matcha ordet "one" men inte "onetwo". Om din markör är över "one" och du vill söka framåt för att matcha hela eller delvisa ord som "one" och "onetwo", behöver du använda `g*` istället för `*`.

```shell
*     Sök efter hela ordet under markören framåt
#     Sök efter hela ordet under markören bakåt
g*    Sök efter ordet under markören framåt
g#    Sök efter ordet under markören bakåt
```

## Markera Position

Du kan använda markeringar för att spara din nuvarande position och återvända till denna position senare. Det är som ett bokmärke för textredigering. Du kan ställa in en markering med `mx`, där `x` kan vara vilken bokstav som helst `a-zA-Z`. Det finns två sätt att återvända till markeringen: exakt (rad och kolumn) med `` `x `` och radvis (`'x`).

```shell
ma    Markera position med markeringen "a"
`a    Hoppa till rad och kolumn "a"
'a    Hoppa till rad "a"
```

Det finns en skillnad mellan att markera med små bokstäver (a-z) och stora bokstäver (A-Z). Små bokstäver är lokala markeringar och stora bokstäver är globala markeringar (ibland kända som filmarkeringar).

Låt oss prata om lokala markeringar. Varje buffert kan ha sin egen uppsättning av lokala markeringar. Om jag har två filer öppna kan jag ställa in en markering "a" (`ma`) i den första filen och en annan markering "a" (`ma`) i den andra filen.

Till skillnad från lokala markeringar där du kan ha en uppsättning markeringar i varje buffert, får du bara en uppsättning globala markeringar. Om du ställer in `mA` inuti `myFile.txt`, kommer nästa gång du kör `mA` i en annan fil att skriva över den första "A"-markeringen. En fördel med globala markeringar är att du kan hoppa till vilken global markering som helst även om du är i ett helt annat projekt. Globala markeringar kan resa över filer.

För att visa alla markeringar, använd `:marks`. Du kan märka att det finns fler markeringar än `a-zA-Z`. Några av dem är:

```shell
''    Hoppa tillbaka till den senaste raden i den aktuella bufferten före hoppet
``    Hoppa tillbaka till den senaste positionen i den aktuella bufferten före hoppet
`[    Hoppa till början av tidigare ändrad / kopierad text
`]    Hoppa till slutet av tidigare ändrad / kopierad text
`<    Hoppa till början av senaste visuella markeringen
`>    Hoppa till slutet av senaste visuella markeringen
`0    Hoppa tillbaka till den senaste redigerade filen när du avslutar vim
```

Det finns fler markeringar än de som listas ovan. Jag kommer inte att täcka dem här eftersom jag tror att de sällan används, men om du är nyfiken, kolla in `:h marks`.

## Hoppa

I Vim kan du "hoppa" till en annan fil eller en annan del av en fil med vissa rörelser. Inte alla rörelser räknas som ett hopp, dock. Att gå ner med `j` räknas inte som ett hopp. Att gå till rad 10 med `10G` räknas som ett hopp.

Här är kommandona som Vim anser vara "hopp"-kommandon:

```shell
'       Gå till den markerade raden
`       Gå till den markerade positionen
G       Gå till raden
/       Sök framåt
?       Sök bakåt
n       Upprepa den senaste sökningen, samma riktning
N       Upprepa den senaste sökningen, motsatt riktning
%       Hitta matchning
(       Gå till den senaste meningen
)       Gå till nästa mening
{       Gå till det senaste stycket
}       Gå till nästa stycke
L       Gå till den sista raden i det visade fönstret
M       Gå till den mittersta raden i det visade fönstret
H       Gå till den översta raden i det visade fönstret
[[      Gå till den föregående sektionen
]]      Gå till nästa sektion
:s      Ersätt
:tag    Hoppa till taggdefinition
```

Jag rekommenderar inte att memorera denna lista. En bra tumregel är, varje rörelse som rör sig längre än ett ord och nuvarande radnavigering är förmodligen ett hopp. Vim håller reda på var du har varit när du rör dig runt och du kan se denna lista inuti `:jumps`.

För mer, kolla in `:h jump-motions`.

Varför är hopp användbara? För att du kan navigera i hopp-listan med `Ctrl-O` för att gå upp i hopp-listan och `Ctrl-I` för att gå ner i hopp-listan. `hjkl` är inte "hopp"-kommandon, men du kan manuellt lägga till den aktuella platsen i hopp-listan med `m'` före rörelsen. Till exempel, `m'5j` lägger till den aktuella platsen i hopp-listan och går ner 5 rader, och du kan komma tillbaka med `Ctrl-O`. Du kan hoppa över olika filer, vilket jag kommer att diskutera mer i nästa del.

## Lär dig Navigering på det Smarta Sättet

Om du är ny på Vim, är detta mycket att lära sig. Jag förväntar mig inte att någon ska komma ihåg allt direkt. Det tar tid innan du kan utföra dem utan att tänka.

Jag tycker att det bästa sättet att komma igång är att memorera några viktiga rörelser. Jag rekommenderar att du börjar med dessa 10 rörelser: `h, j, k, l, w, b, G, /, ?, n`. Upprepa dem tillräckligt tills du kan använda dem utan att tänka.

För att förbättra dina navigeringsfärdigheter, här är mina förslag:
1. Titta efter upprepade handlingar. Om du upptäcker att du gör `l` upprepade gånger, leta efter en rörelse som tar dig framåt snabbare. Du kommer att upptäcka att du kan använda `w`. Om du fångar dig själv som upprepade gånger gör `w`, se om det finns en rörelse som tar dig över den aktuella raden snabbt. Du kommer att upptäcka att du kan använda `f`. Om du kan beskriva ditt behov kortfattat, finns det en god chans att Vim har ett sätt att göra det.
2. När du lär dig en ny rörelse, spendera lite tid tills du kan göra det utan att tänka.

Slutligen, inse att du inte behöver känna till varje enda Vim-kommando för att vara produktiv. De flesta Vim-användare gör inte det. Jag gör inte det. Lär dig de kommandon som hjälper dig att utföra din uppgift för stunden.

Ta din tid. Navigeringsfärdigheter är en mycket viktig färdighet i Vim. Lär dig en liten sak varje dag och lär dig den väl.