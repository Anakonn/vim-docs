---
description: Denna dokumentation ger en översikt över variabler i Vim, inklusive mutabla
  och immutabla variabler samt deras källor och omfattningar.
title: Ch27. Vimscript Variable Scopes
---

Innan vi dyker ner i Vimscript-funktioner, låt oss lära oss om de olika källorna och omfattningarna av Vim-variabler.

## Föränderliga och Oföränderliga Variabler

Du kan tilldela ett värde till en variabel i Vim med `let`:

```shell
let pancake = "pancake"
```

Senare kan du kalla på den variabeln när som helst.

```shell
echo pancake
" returnerar "pancake"
```

`let` är förändlig, vilket betyder att du kan ändra värdet när som helst i framtiden.

```shell
let pancake = "pancake"
let pancake = "not waffles"

echo pancake
" returnerar "not waffles"
```

Observera att när du vill ändra värdet på en inställd variabel, måste du fortfarande använda `let`.

```shell
let beverage = "milk"

beverage = "orange juice"
" kastar ett fel
```

Du kan definiera en oföränderlig variabel med `const`. Eftersom den är oföränderlig, när ett variabelvärde har tilldelats, kan du inte tilldela det med ett annat värde.

```shell
const waffle = "waffle"
const waffle = "pancake"
" kastar ett fel
```

## Variabelkällor

Det finns tre källor för variabler: miljövariabel, alternativvariabel och registervariabel.

### Miljövariabel

Vim kan komma åt din terminalmiljövariabel. Till exempel, om du har miljövariabeln `SHELL` tillgänglig i din terminal, kan du komma åt den från Vim med:

```shell
echo $SHELL
" returnerar $SHELL-värdet. I mitt fall returnerar det /bin/bash
```

### Alternativvariabel

Du kan komma åt Vim-alternativ med `&` (detta är inställningarna du kommer åt med `set`).

Till exempel, för att se vilken bakgrund Vim använder, kan du köra:

```shell
echo &background
" returnerar antingen "light" eller "dark"
```

Alternativt kan du alltid köra `set background?` för att se värdet på `background`-alternativet.

### Registervariabel

Du kan komma åt Vim-register (Kap. 08) med `@`.

Anta att värdet "chocolate" redan är sparat i register a. För att komma åt det kan du använda `@a`. Du kan också uppdatera det med `let`.

```shell
echo @a
" returnerar chocolate

let @a .= " donut"

echo @a
" returnerar "chocolate donut"
```

Nu när du klistrar in från register `a` (`"ap`), kommer det att returnera "chocolate donut". Operatören `.=` sammanfogar två strängar. Uttrycket `let @a .= " donut"` är detsamma som `let @a = @a . " donut"`

## Variabelomfång

Det finns 9 olika variabelomfång i Vim. Du kan känna igen dem från deras föregående bokstav:

```shell
g:           Global variabel
{nothing}    Global variabel
b:           Buffer-lokal variabel
w:           Fönster-lokal variabel
t:           Flik-lokal variabel
s:           Källad Vimscript variabel
l:           Funktionslokal variabel
a:           Funktionsformell parameter variabel
v:           Inbyggd Vim variabel
```

### Global Variabel

När du deklarerar en "vanlig" variabel:

```shell
let pancake = "pancake"
```

är `pancake` faktiskt en global variabel. När du definierar en global variabel kan du kalla på dem från var som helst.

Att föregå en variabel med `g:` skapar också en global variabel.

```shell
let g:waffle = "waffle"
```

I det här fallet har både `pancake` och `g:waffle` samma omfattning. Du kan kalla på var och en av dem med eller utan `g:`.

```shell
echo pancake
" returnerar "pancake"

echo g:pancake
" returnerar "pancake"

echo waffle
" returnerar "waffle"

echo g:waffle
" returnerar "waffle"
```

### Buffer Variabel

En variabel som föregås av `b:` är en buffer-variabel. En buffer-variabel är en variabel som är lokal till den aktuella buffern (Kap. 02). Om du har flera buffrar öppna, kommer varje buffer att ha sin egen separata lista av buffer-variabler.

I buffer 1:

```shell
const b:donut = "chocolate donut"
```

I buffer 2:

```shell
const b:donut = "blueberry donut"
```

Om du kör `echo b:donut` från buffer 1, kommer det att returnera "chocolate donut". Om du kör det från buffer 2, kommer det att returnera "blueberry donut".

Som en sidoanteckning har Vim en *speciell* buffer-variabel `b:changedtick` som håller reda på alla ändringar som görs i den aktuella buffern.

1. Kör `echo b:changedtick` och notera numret det returnerar.
2. Gör ändringar i Vim.
3. Kör `echo b:changedtick` igen och notera numret det nu returnerar.

### Fönster Variabel

En variabel som föregås av `w:` är en fönster-variabel. Den existerar endast i det fönstret.

I fönster 1:

```shell
const w:donut = "chocolate donut"
```

I fönster 2:

```shell
const w:donut = "raspberry donut"
```

I varje fönster kan du kalla på `echo w:donut` för att få unika värden.

### Flik Variabel

En variabel som föregås av `t:` är en flik-variabel. Den existerar endast i den fliken.

I flik 1:

```shell
const t:donut = "chocolate donut"
```

I flik 2:

```shell
const t:donut = "blackberry donut"
```

I varje flik kan du kalla på `echo t:donut` för att få unika värden.

### Skript Variabel

En variabel som föregås av `s:` är en skript-variabel. Dessa variabler kan endast nås från insidan av det skriptet.

Om du har en godtycklig fil `dozen.vim` och inuti den har du:

```shell
let s:dozen = 12

function Consume()
  let s:dozen -= 1
  echo s:dozen " är kvar"
endfunction
```

Källfilen med `:source dozen.vim`. Nu kalla på `Consume`-funktionen:

```shell
:call Consume()
" returnerar "11 är kvar"

:call Consume()
" returnerar "10 är kvar"

:echo s:dozen
" Odefinierad variabelfel
```

När du kallar på `Consume`, ser du att den minskar värdet av `s:dozen` som förväntat. När du försöker få värdet av `s:dozen` direkt, kommer Vim inte att hitta det eftersom du är utanför omfattningen. `s:dozen` är endast tillgänglig från insidan av `dozen.vim`.

Varje gång du källar `dozen.vim`-filen, återställs `s:dozen`-räknaren. Om du är mitt i att minska värdet av `s:dozen` och du kör `:source dozen.vim`, återställs räknaren tillbaka till 12. Detta kan vara ett problem för ovetande användare. För att åtgärda detta problem, refaktorera koden:

```shell
if !exists("s:dozen")
  let s:dozen = 12
endif

function Consume()
  let s:dozen -= 1
  echo s:dozen
endfunction
```

Nu när du källar `dozen.vim` medan du är mitt i att minska, läser Vim `!exists("s:dozen")`, finner att det är sant, och återställer inte värdet tillbaka till 12.

### Funktionslokal och Funktionsformell Parameter Variabel

Både funktionslokal variabel (`l:`) och funktionsformell variabel (`a:`) kommer att täckas i nästa kapitel.

### Inbyggda Vim Variabler

En variabel som föregås av `v:` är en speciell inbyggd Vim-variabel. Du kan inte definiera dessa variabler. Du har redan sett några av dem.
- `v:version` berättar vilken Vim-version du använder.
- `v:key` innehåller det aktuella objektvärdet när du itererar genom en ordbok.
- `v:val` innehåller det aktuella objektvärdet när du kör en `map()` eller `filter()` operation.
- `v:true`, `v:false`, `v:null`, och `v:none` är speciella datatyper.

Det finns andra variabler. För en lista över inbyggda Vim-variabler, kolla in `:h vim-variable` eller `:h v:`.

## Använda Vim Variabelomfång på ett Smart Sätt

Att snabbt kunna komma åt miljö-, alternativ- och registervariabler ger dig en bred flexibilitet att anpassa din redigerare och terminalmiljö. Du har också lärt dig att Vim har 9 olika variabelomfång, var och en existerande under vissa begränsningar. Du kan dra nytta av dessa unika variabeltyper för att avkoppla ditt program.

Du har kommit så här långt. Du har lärt dig om datatyper, sätt att kombinera, och variabelomfång. Endast en sak återstår: funktioner.