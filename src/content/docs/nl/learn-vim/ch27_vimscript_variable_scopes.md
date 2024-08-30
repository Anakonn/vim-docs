---
description: Dit document behandelt de verschillende soorten en scopes van Vim-variabelen,
  inclusief mutabele en immutabele variabelen en hun gebruik in Vimscript.
title: Ch27. Vimscript Variable Scopes
---

Voordat we in Vimscript-functies duiken, laten we leren over de verschillende bronnen en scopes van Vim-variabelen.

## Veranderlijke en Onveranderlijke Variabelen

Je kunt een waarde toewijzen aan een variabele in Vim met `let`:

```shell
let pancake = "pancake"
```

Later kun je die variabele op elk moment aanroepen.

```shell
echo pancake
" retourneert "pancake"
```

`let` is veranderlijk, wat betekent dat je de waarde op elk moment in de toekomst kunt wijzigen.

```shell
let pancake = "pancake"
let pancake = "geen wafels"

echo pancake
" retourneert "geen wafels"
```

Merk op dat wanneer je de waarde van een ingestelde variabele wilt wijzigen, je nog steeds `let` moet gebruiken.

```shell
let beverage = "melk"

beverage = "sinaasappelsap"
" geeft een foutmelding
```

Je kunt een onveranderlijke variabele definiëren met `const`. Als onveranderlijk, zodra een variabele waarde is toegewezen, kun je deze niet opnieuw toewijzen met een andere waarde.

```shell
const waffle = "wafel"
const waffle = "pancake"
" geeft een foutmelding
```

## Variabele Bronnen

Er zijn drie bronnen voor variabelen: omgevingsvariabele, optievariabele en registervariabele.

### Omgevingsvariabele

Vim kan toegang krijgen tot je terminal omgevingsvariabele. Bijvoorbeeld, als je de omgevingsvariabele `SHELL` beschikbaar hebt in je terminal, kun je deze vanuit Vim benaderen met:

```shell
echo $SHELL
" retourneert de waarde van $SHELL. In mijn geval retourneert het /bin/bash
```

### Optievariabele

Je kunt Vim-opties benaderen met `&` (dit zijn de instellingen die je met `set` benadert).

Bijvoorbeeld, om te zien welke achtergrond Vim gebruikt, kun je uitvoeren:

```shell
echo &background
" retourneert ofwel "licht" of "donker"
```

Alternatief kun je altijd `set background?` uitvoeren om de waarde van de `background` optie te zien.

### Registervariabele

Je kunt Vim-registers (Hoofdstuk 08) benaderen met `@`.

Stel dat de waarde "chocolade" al is opgeslagen in register a. Om het te benaderen, kun je `@a` gebruiken. Je kunt het ook bijwerken met `let`.

```shell
echo @a
" retourneert chocolade

let @a .= " donut"

echo @a
" retourneert "chocolade donut"
```

Nu, wanneer je plakt vanuit register `a` (`"ap`), zal het "chocolade donut" retourneren. De operator `.=` voegt twee strings samen. De expressie `let @a .= " donut"` is hetzelfde als `let @a = @a . " donut"`

## Variabele Scopes

Er zijn 9 verschillende variabele scopes in Vim. Je kunt ze herkennen aan hun voorafgaande letter:

```shell
g:           Globale variabele
{nothing}    Globale variabele
b:           Buffer-lokale variabele
w:           Venster-lokale variabele
t:           Tab-lokale variabele
s:           Geïmporteerde Vimscript-variabele
l:           Functie-lokale variabele
a:           Formele parameter variabele van de functie
v:           Ingebouwde Vim-variabele
```

### Globale Variabele

Wanneer je een "gewone" variabele declareert:

```shell
let pancake = "pancake"
```

is `pancake` eigenlijk een globale variabele. Wanneer je een globale variabele definieert, kun je deze overal aanroepen.

Het voorafgaande `g:` aan een variabele creëert ook een globale variabele.

```shell
let g:waffle = "wafel"
```

In dit geval hebben zowel `pancake` als `g:waffle` dezelfde scope. Je kunt elk van hen aanroepen met of zonder `g:`.

```shell
echo pancake
" retourneert "pancake"

echo g:pancake
" retourneert "pancake"

echo waffle
" retourneert "wafel"

echo g:waffle
" retourneert "wafel"
```

### Buffer Variabele

Een variabele voorafgegaan door `b:` is een buffer variabele. Een buffer variabele is een variabele die lokaal is voor de huidige buffer (Hoofdstuk 02). Als je meerdere buffers open hebt, heeft elke buffer zijn eigen aparte lijst van buffer variabelen.

In buffer 1:

```shell
const b:donut = "chocolade donut"
```

In buffer 2:

```shell
const b:donut = "blauwe bessen donut"
```

Als je `echo b:donut` uitvoert vanuit buffer 1, retourneert het "chocolade donut". Als je het vanuit buffer 2 uitvoert, retourneert het "blauwe bessen donut".

Terzijde, Vim heeft een *speciale* buffer variabele `b:changedtick` die alle wijzigingen bijhoudt die aan de huidige buffer zijn aangebracht.

1. Voer `echo b:changedtick` uit en noteer het nummer dat het retourneert.
2. Breng wijzigingen aan in Vim.
3. Voer `echo b:changedtick` opnieuw uit en noteer het nummer dat het nu retourneert.

### Venster Variabele

Een variabele voorafgegaan door `w:` is een venster variabele. Het bestaat alleen in dat venster.

In venster 1:

```shell
const w:donut = "chocolade donut"
```

In venster 2:

```shell
const w:donut = "frambozen donut"
```

In elk venster kun je `echo w:donut` aanroepen om unieke waarden te krijgen.

### Tab Variabele

Een variabele voorafgegaan door `t:` is een tab variabele. Het bestaat alleen in die tab.

In tab 1:

```shell
const t:donut = "chocolade donut"
```

In tab 2:

```shell
const t:donut = "zwarte bessen donut"
```

In elke tab kun je `echo t:donut` aanroepen om unieke waarden te krijgen.

### Script Variabele

Een variabele voorafgegaan door `s:` is een script variabele. Deze variabelen kunnen alleen vanuit dat script worden benaderd.

Als je een willekeurig bestand `dozen.vim` hebt en daarin heb je:

```shell
let s:dozen = 12

function Consume()
  let s:dozen -= 1
  echo s:dozen " is over"
endfunction
```

Bron het bestand met `:source dozen.vim`. Roep nu de `Consume` functie aan:

```shell
:call Consume()
" retourneert "11 is over"

:call Consume()
" retourneert "10 is over"

:echo s:dozen
" Foutmelding: Onbepaalde variabele
```

Wanneer je `Consume` aanroept, zie je dat het de waarde van `s:dozen` zoals verwacht vermindert. Wanneer je probeert de waarde van `s:dozen` direct te krijgen, kan Vim het niet vinden omdat je buiten de scope bent. `s:dozen` is alleen toegankelijk vanuit `dozen.vim`.

Elke keer dat je het `dozen.vim` bestand laadt, reset het de `s:dozen` teller. Als je halverwege het verminderen van de waarde van `s:dozen` bent en je voert `:source dozen.vim` uit, wordt de teller teruggezet naar 12. Dit kan een probleem zijn voor nietsvermoedende gebruikers. Om dit probleem op te lossen, refactor de code:

```shell
if !exists("s:dozen")
  let s:dozen = 12
endif

function Consume()
  let s:dozen -= 1
  echo s:dozen
endfunction
```

Nu, wanneer je `dozen.vim` laadt terwijl je halverwege het verminderen bent, leest Vim `!exists("s:dozen")`, vindt dat het waar is, en reset de waarde niet terug naar 12.

### Functie Lokale en Functie Formele Parameter Variabele

Zowel de functie lokale variabele (`l:`) als de formele functie variabele (`a:`) worden in het volgende hoofdstuk behandeld.

### Ingebouwde Vim Variabelen

Een variabele voorafgegaan door `v:` is een speciale ingebouwde Vim variabele. Je kunt deze variabelen niet definiëren. Je hebt er al enkele gezien.
- `v:version` vertelt je welke Vim-versie je gebruikt.
- `v:key` bevat de huidige itemwaarde bij het itereren door een woordenboek.
- `v:val` bevat de huidige itemwaarde bij het uitvoeren van een `map()` of `filter()` operatie.
- `v:true`, `v:false`, `v:null`, en `v:none` zijn speciale gegevenstypen.

Er zijn andere variabelen. Voor een lijst van ingebouwde Vim-variabelen, kijk naar `:h vim-variable` of `:h v:`.

## Het Slim Gebruik van Vim Variabele Scopes

In staat zijn om snel toegang te krijgen tot omgevings-, optie- en registervariabelen geeft je een brede flexibiliteit om je editor en terminalomgeving aan te passen. Je hebt ook geleerd dat Vim 9 verschillende variabele scopes heeft, die elk onder bepaalde beperkingen bestaan. Je kunt profiteren van deze unieke variabele types om je programma los te koppelen.

Je hebt het tot hier gehaald. Je hebt geleerd over gegevenstypen, combinatiemethoden en variabele scopes. Slechts één ding is nog over: functies.