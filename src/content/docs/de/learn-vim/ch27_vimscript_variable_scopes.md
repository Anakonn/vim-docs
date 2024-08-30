---
description: Dieser Dokument beschreibt die verschiedenen Quellen und Bereiche von
  Vim-Variablen sowie die Unterschiede zwischen veränderbaren und unveränderbaren
  Variablen.
title: Ch27. Vimscript Variable Scopes
---

Bevor wir in die Vimscript-Funktionen eintauchen, lernen wir die verschiedenen Quellen und Bereiche der Vim-Variablen kennen.

## Änderbare und Unveränderliche Variablen

Sie können einer Variablen in Vim mit `let` einen Wert zuweisen:

```shell
let pancake = "pancake"
```

Später können Sie diese Variable jederzeit aufrufen.

```shell
echo pancake
" gibt "pancake" zurück
```

`let` ist änderbar, was bedeutet, dass Sie den Wert jederzeit in der Zukunft ändern können.

```shell
let pancake = "pancake"
let pancake = "nicht waffles"

echo pancake
" gibt "nicht waffles" zurück
```

Beachten Sie, dass Sie, wenn Sie den Wert einer festgelegten Variablen ändern möchten, weiterhin `let` verwenden müssen.

```shell
let beverage = "milch"

beverage = "oranensaft"
" wirft einen Fehler
```

Sie können eine unveränderliche Variable mit `const` definieren. Da sie unveränderlich ist, können Sie, sobald ein Variablenwert zugewiesen ist, ihn nicht mit einem anderen Wert neu zuweisen.

```shell
const waffle = "waffle"
const waffle = "pancake"
" wirft einen Fehler
```

## Variablenquellen

Es gibt drei Quellen für Variablen: Umgebungsvariable, Optionsvariable und Registrierungsvariable.

### Umgebungsvariable

Vim kann auf Ihre Terminal-Umgebungsvariable zugreifen. Wenn Sie beispielsweise die Umgebungsvariable `SHELL` in Ihrem Terminal verfügbar haben, können Sie darauf von Vim aus zugreifen:

```shell
echo $SHELL
" gibt den Wert von $SHELL zurück. In meinem Fall gibt es /bin/bash zurück
```

### Optionsvariable

Sie können auf Vim-Optionen mit `&` zugreifen (das sind die Einstellungen, die Sie mit `set` aufrufen).

Zum Beispiel, um zu sehen, welchen Hintergrund Vim verwendet, können Sie Folgendes ausführen:

```shell
echo &background
" gibt entweder "light" oder "dark" zurück
```

Alternativ können Sie immer `set background?` ausführen, um den Wert der `background`-Option zu sehen.

### Registrierungsvariable

Sie können auf Vim-Register (Kap. 08) mit `@` zugreifen.

Angenommen, der Wert "chocolate" ist bereits im Register a gespeichert. Um darauf zuzugreifen, können Sie `@a` verwenden. Sie können es auch mit `let` aktualisieren.

```shell
echo @a
" gibt chocolate zurück

let @a .= " donut"

echo @a
" gibt "chocolate donut" zurück
```

Jetzt, wenn Sie aus dem Register `a` einfügen (`"ap`), wird "chocolate donut" zurückgegeben. Der Operator `.=` verknüpft zwei Zeichenfolgen. Der Ausdruck `let @a .= " donut"` ist dasselbe wie `let @a = @a . " donut"`

## Variablenbereiche

Es gibt 9 verschiedene Variablenbereiche in Vim. Sie können sie an ihrem vorangestellten Buchstaben erkennen:

```shell
g:           Globale Variable
{nothing}    Globale Variable
b:           Puffer-lokale Variable
w:           Fenster-lokale Variable
t:           Tab-lokale Variable
s:           Gelesene Vimscript-Variable
l:           Funktionslokale Variable
a:           Formale Parameter-Variable der Funktion
v:           Eingebaute Vim-Variable
```

### Globale Variable

Wenn Sie eine "normale" Variable deklarieren:

```shell
let pancake = "pancake"
```

ist `pancake` tatsächlich eine globale Variable. Wenn Sie eine globale Variable definieren, können Sie sie von überall aufrufen.

Das Voranstellen von `g:` zu einer Variablen erstellt ebenfalls eine globale Variable.

```shell
let g:waffle = "waffle"
```

In diesem Fall haben sowohl `pancake` als auch `g:waffle` den gleichen Bereich. Sie können jede von ihnen mit oder ohne `g:` aufrufen.

```shell
echo pancake
" gibt "pancake" zurück

echo g:pancake
" gibt "pancake" zurück

echo waffle
" gibt "waffle" zurück

echo g:waffle
" gibt "waffle" zurück
```

### Puffer-Variable

Eine Variable, die mit `b:` vorangestellt ist, ist eine Puffer-Variable. Eine Puffer-Variable ist eine Variable, die lokal zum aktuellen Puffer ist (Kap. 02). Wenn Sie mehrere Puffer geöffnet haben, hat jeder Puffer seine eigene separate Liste von Puffer-Variablen.

Im Puffer 1:

```shell
const b:donut = "chocolate donut"
```

Im Puffer 2:

```shell
const b:donut = "blueberry donut"
```

Wenn Sie `echo b:donut` aus Puffer 1 ausführen, gibt es "chocolate donut" zurück. Wenn Sie es aus Puffer 2 ausführen, gibt es "blueberry donut" zurück.

Nebenbei bemerkt, hat Vim eine *besondere* Puffer-Variable `b:changedtick`, die alle Änderungen verfolgt, die am aktuellen Puffer vorgenommen wurden.

1. Führen Sie `echo b:changedtick` aus und notieren Sie die Zahl, die zurückgegeben wird.
2. Nehmen Sie Änderungen in Vim vor.
3. Führen Sie `echo b:changedtick` erneut aus und notieren Sie die Zahl, die jetzt zurückgegeben wird.

### Fenster-Variable

Eine Variable, die mit `w:` vorangestellt ist, ist eine Fenster-Variable. Sie existiert nur in diesem Fenster.

Im Fenster 1:

```shell
const w:donut = "chocolate donut"
```

Im Fenster 2:

```shell
const w:donut = "raspberry donut"
```

In jedem Fenster können Sie `echo w:donut` aufrufen, um einzigartige Werte zu erhalten.

### Tab-Variable

Eine Variable, die mit `t:` vorangestellt ist, ist eine Tab-Variable. Sie existiert nur in diesem Tab.

Im Tab 1:

```shell
const t:donut = "chocolate donut"
```

Im Tab 2:

```shell
const t:donut = "blackberry donut"
```

In jedem Tab können Sie `echo t:donut` aufrufen, um einzigartige Werte zu erhalten.

### Skript-Variable

Eine Variable, die mit `s:` vorangestellt ist, ist eine Skript-Variable. Diese Variablen können nur von innerhalb dieses Skripts aufgerufen werden.

Wenn Sie eine beliebige Datei `dozen.vim` haben und darin Folgendes haben:

```shell
let s:dozen = 12

function Consume()
  let s:dozen -= 1
  echo s:dozen " ist übrig"
endfunction
```

Quellen Sie die Datei mit `:source dozen.vim`. Rufen Sie jetzt die Funktion `Consume` auf:

```shell
:call Consume()
" gibt "11 ist übrig" zurück

:call Consume()
" gibt "10 ist übrig" zurück

:echo s:dozen
" Fehler: Nicht definierte Variable
```

Wenn Sie `Consume` aufrufen, sehen Sie, dass der Wert von `s:dozen` wie erwartet verringert wird. Wenn Sie jedoch versuchen, den Wert von `s:dozen` direkt zu erhalten, findet Vim ihn nicht, da Sie außerhalb des Geltungsbereichs sind. `s:dozen` ist nur von innerhalb von `dozen.vim` zugänglich.

Jedes Mal, wenn Sie die Datei `dozen.vim` quellen, wird der Zähler `s:dozen` zurückgesetzt. Wenn Sie mitten im Verringern des Wertes von `s:dozen` sind und `:source dozen.vim` ausführen, wird der Zähler auf 12 zurückgesetzt. Dies kann ein Problem für ahnungslose Benutzer sein. Um dieses Problem zu beheben, refaktorisieren Sie den Code:

```shell
if !exists("s:dozen")
  let s:dozen = 12
endif

function Consume()
  let s:dozen -= 1
  echo s:dozen
endfunction
```

Jetzt, wenn Sie `dozen.vim` quellen, während Sie mitten im Verringern sind, liest Vim `!exists("s:dozen")`, stellt fest, dass es wahr ist, und setzt den Wert nicht auf 12 zurück.

### Funktionslokale und Formale Parameter-Variable der Funktion

Sowohl die funktionslokale Variable (`l:`) als auch die formale Variable der Funktion (`a:`) werden im nächsten Kapitel behandelt.

### Eingebaute Vim-Variablen

Eine Variable, die mit `v:` vorangestellt ist, ist eine spezielle eingebaute Vim-Variable. Sie können diese Variablen nicht definieren. Einige von ihnen haben Sie bereits gesehen.
- `v:version` sagt Ihnen, welche Vim-Version Sie verwenden.
- `v:key` enthält den aktuellen Elementwert, wenn Sie durch ein Wörterbuch iterieren.
- `v:val` enthält den aktuellen Elementwert, wenn Sie eine `map()`- oder `filter()`-Operation ausführen.
- `v:true`, `v:false`, `v:null` und `v:none` sind spezielle Datentypen.

Es gibt andere Variablen. Für eine Liste der eingebauten Vim-Variablen schauen Sie sich `:h vim-variable` oder `:h v:` an.

## Verwendung der Vim-Variablenbereiche auf intelligente Weise

Die Möglichkeit, schnell auf Umwelt-, Options- und Registrierungsvariablen zuzugreifen, gibt Ihnen eine breite Flexibilität, um Ihren Editor und Ihre Terminalumgebung anzupassen. Sie haben auch gelernt, dass Vim 9 verschiedene Variablenbereiche hat, die jeweils unter bestimmten Einschränkungen existieren. Sie können diese einzigartigen Variablentypen nutzen, um Ihr Programm zu entkoppeln.

Sie haben es bis hierher geschafft. Sie haben über Datentypen, Kombinationen und Variablenbereiche gelernt. Nur eine Sache bleibt noch: Funktionen.