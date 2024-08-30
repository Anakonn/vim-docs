---
description: In diesem Kapitel lernen Sie die Funktionssyntax in Vimscript kennen,
  einschließlich der Regeln zur Benennung und Definition von Funktionen.
title: Ch28. Vimscript Functions
---

Funktionen sind Mittel der Abstraktion, das dritte Element beim Erlernen einer neuen Sprache.

In den vorherigen Kapiteln haben Sie die nativen Vimscript-Funktionen (`len()`, `filter()`, `map()`, usw.) und benutzerdefinierte Funktionen in Aktion gesehen. In diesem Kapitel werden Sie tiefer eintauchen, um zu lernen, wie Funktionen funktionieren.

## Funktionssyntaxregeln

Im Kern hat eine Vimscript-Funktion die folgende Syntax:

```shell
function {FunctionName}()
  {do-something}
endfunction
```

Eine Funktionsdefinition muss mit einem Großbuchstaben beginnen. Sie beginnt mit dem Schlüsselwort `function` und endet mit `endfunction`. Unten ist eine gültige Funktion:

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

Die folgende Funktion ist nicht gültig, da sie nicht mit einem Großbuchstaben beginnt.

```shell
function tasty()
  echo "Tasty"
endfunction
```

Wenn Sie einer Funktion die Skriptvariable (`s:`) voranstellen, können Sie sie mit einem Kleinbuchstaben verwenden. `function s:tasty()` ist ein gültiger Name. Der Grund, warum Vim von Ihnen verlangt, einen Großbuchstaben zu verwenden, ist, um Verwirrung mit Vims integrierten Funktionen (alle Kleinbuchstaben) zu vermeiden.

Ein Funktionsname darf nicht mit einer Zahl beginnen. `1Tasty()` ist kein gültiger Funktionsname, aber `Tasty1()` ist es. Eine Funktion darf auch keine nicht-alphanumerischen Zeichen außer `_` enthalten. `Tasty-food()`, `Tasty&food()` und `Tasty.food()` sind keine gültigen Funktionsnamen. `Tasty_food()` *ist*.

Wenn Sie zwei Funktionen mit demselben Namen definieren, wird Vim einen Fehler ausgeben, der sich darüber beschwert, dass die Funktion `Tasty` bereits existiert. Um die vorherige Funktion mit demselben Namen zu überschreiben, fügen Sie ein `!` nach dem Schlüsselwort `function` hinzu.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

## Auflisten verfügbarer Funktionen

Um alle integrierten und benutzerdefinierten Funktionen in Vim zu sehen, können Sie den Befehl `:function` ausführen. Um den Inhalt der Funktion `Tasty` anzusehen, können Sie `:function Tasty` ausführen.

Sie können auch nach Funktionen mit einem Muster suchen mit `:function /pattern`, ähnlich wie bei Vims Suchnavigation (`/pattern`). Um nach allen Funktionen zu suchen, die den Ausdruck "map" enthalten, führen Sie `:function /map` aus. Wenn Sie externe Plugins verwenden, zeigt Vim die in diesen Plugins definierten Funktionen an.

Wenn Sie sehen möchten, woher eine Funktion stammt, können Sie den Befehl `:verbose` mit dem Befehl `:function` verwenden. Um zu sehen, woher alle Funktionen stammen, die das Wort "map" enthalten, führen Sie aus:

```shell
:verbose function /map
```

Als ich es ausgeführt habe, erhielt ich eine Reihe von Ergebnissen. Dieses hier sagt mir, dass die Funktion `fzf#vim#maps` eine Autoload-Funktion ist (um es zusammenzufassen, siehe Kap. 23) und in der Datei `~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim` in Zeile 1263 geschrieben ist. Dies ist nützlich für das Debugging.

```shell
function fzf#vim#maps(mode, ...)
        Last set from ~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim line 1263
```

## Entfernen einer Funktion

Um eine vorhandene Funktion zu entfernen, verwenden Sie `:delfunction {Function_name}`. Um `Tasty` zu löschen, führen Sie `:delfunction Tasty` aus.

## Rückgabewert einer Funktion

Damit eine Funktion einen Wert zurückgibt, müssen Sie ihr einen expliziten `return`-Wert übergeben. Andernfalls gibt Vim automatisch einen impliziten Wert von 0 zurück.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

Ein leerer `return` ist ebenfalls gleichwertig zu einem Wert von 0.

```shell
function! Tasty()
  echo "Tasty"
  return
endfunction
```

Wenn Sie `:echo Tasty()` mit der obigen Funktion ausführen, gibt Vim nach der Anzeige von "Tasty" 0 zurück, den impliziten Rückgabewert. Um `Tasty()` dazu zu bringen, den Wert "Tasty" zurückzugeben, können Sie Folgendes tun:

```shell
function! Tasty()
  return "Tasty"
endfunction
```

Jetzt, wenn Sie `:echo Tasty()` ausführen, gibt es den String "Tasty" zurück.

Sie können eine Funktion innerhalb eines Ausdrucks verwenden. Vim wird den Rückgabewert dieser Funktion verwenden. Der Ausdruck `:echo Tasty() . " Food!"` gibt "Tasty Food!" aus.

## Formale Argumente

Um ein formales Argument `food` an Ihre Funktion `Tasty` zu übergeben, können Sie Folgendes tun:

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

echo Tasty("pastry")
" gibt "Tasty pastry" zurück
```

`a:` ist einer der Variablenbereiche, die im letzten Kapitel erwähnt wurden. Es ist die formale Parameter-Variable. Es ist Vims Weg, einen formalen Parameterwert in einer Funktion zu erhalten. Ohne es wird Vim einen Fehler ausgeben:

```shell
function! Tasty(food)
  return "Tasty " . food
endfunction

echo Tasty("pasta")
" gibt "undefined variable name" Fehler zurück
```

## Funktion lokale Variable

Lassen Sie uns die andere Variable ansprechen, die Sie im vorherigen Kapitel nicht gelernt haben: die funktionale lokale Variable (`l:`).

Beim Schreiben einer Funktion können Sie eine Variable innerhalb definieren:

```shell
function! Yummy()
  let location = "tummy"
  return "Yummy in my " . location
endfunction

echo Yummy()
" gibt "Yummy in my tummy" zurück
```

In diesem Kontext ist die Variable `location` dasselbe wie `l:location`. Wenn Sie eine Variable in einer Funktion definieren, ist diese Variable *lokal* für diese Funktion. Wenn ein Benutzer `location` sieht, könnte es leicht als globale Variable missverstanden werden. Ich bevorzuge es, präziser zu sein, daher ziehe ich es vor, `l:` zu verwenden, um anzuzeigen, dass dies eine Funktionsvariable ist.

Ein weiterer Grund, `l:count` zu verwenden, ist, dass Vim spezielle Variablen mit Aliassen hat, die wie reguläre Variablen aussehen. `v:count` ist ein Beispiel. Es hat einen Alias von `count`. In Vim ist es dasselbe, `count` wie `v:count` aufzurufen. Es ist leicht, versehentlich eine dieser speziellen Variablen aufzurufen.

```shell
function! Calories()
  let count = "count"
  return "I do not " . count . " my calories"
endfunction

echo Calories()
" wirft einen Fehler
```

Die obige Ausführung wirft einen Fehler, weil `let count = "Count"` implizit versucht, Vims spezielle Variable `v:count` neu zu definieren. Denken Sie daran, dass spezielle Variablen (`v:`) schreibgeschützt sind. Sie können sie nicht ändern. Um es zu beheben, verwenden Sie `l:count`:

```shell
function! Calories()
  let l:count = "count"
  return "I do not " . l:count . " my calories"
endfunction

echo Calories()
" gibt "I do not count my calories" zurück
```

## Aufrufen einer Funktion

Vim hat einen Befehl `:call`, um eine Funktion aufzurufen.

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

call Tasty("gravy")
```

Der Befehl `call` gibt den Rückgabewert nicht aus. Lassen Sie uns es mit `echo` aufrufen.

```shell
echo call Tasty("gravy")
```

Ups, Sie erhalten einen Fehler. Der oben genannte `call`-Befehl ist ein Befehlszeilenbefehl (`:call`). Der oben genannte `echo`-Befehl ist ebenfalls ein Befehlszeilenbefehl (`:echo`). Sie können einen Befehlszeilenbefehl nicht mit einem anderen Befehlszeilenbefehl aufrufen. Lassen Sie uns eine andere Variante des `call`-Befehls ausprobieren:

```shell
echo call("Tasty", ["gravy"])
" gibt "Tasty gravy" zurück
```

Um Verwirrung zu vermeiden, haben Sie gerade zwei verschiedene `call`-Befehle verwendet: den `:call`-Befehlszeilenbefehl und die `call()`-Funktion. Die `call()`-Funktion akzeptiert als erstes Argument den Funktionsnamen (String) und als zweites Argument die formalen Parameter (Liste).

Um mehr über `:call` und `call()` zu erfahren, schauen Sie sich `:h call()` und `:h :call` an.

## Standardargument

Sie können einem Funktionsparameter einen Standardwert mit `=` zuweisen. Wenn Sie `Breakfast` nur mit einem Argument aufrufen, wird das Argument `beverage` den Standardwert "milk" verwenden.

```shell
function! Breakfast(meal, beverage = "Milk")
  return "I had " . a:meal . " and " . a:beverage . " for breakfast"
endfunction

echo Breakfast("Hash Browns")
" gibt "I had hash browns and milk for breakfast" zurück

echo Breakfast("Cereal", "Orange Juice")
" gibt "I had Cereal and Orange Juice for breakfast" zurück
```

## Variable Argumente

Sie können ein variables Argument mit drei Punkten (`...`) übergeben. Ein variables Argument ist nützlich, wenn Sie nicht wissen, wie viele Variablen ein Benutzer angeben wird.

Angenommen, Sie erstellen ein All-you-can-eat-Buffet (Sie werden nie wissen, wie viel Essen Ihr Kunde essen wird):

```shell
function! Buffet(...)
  return a:1
endfunction
```

Wenn Sie `echo Buffet("Noodles")` ausführen, gibt es "Noodles" aus. Vim verwendet `a:1`, um das *erste* Argument, das an `...` übergeben wurde, bis zu 20 auszugeben (`a:1` ist das erste Argument, `a:2` ist das zweite Argument usw.). Wenn Sie `echo Buffet("Noodles", "Sushi")` ausführen, wird immer noch nur "Noodles" angezeigt, lassen Sie uns das aktualisieren:

```shell
function! Buffet(...)
  return a:1 . " " . a:2
endfunction

echo Buffet("Noodles", "Sushi")
" gibt "Noodles Sushi" zurück
```

Das Problem mit diesem Ansatz ist, dass, wenn Sie jetzt `echo Buffet("Noodles")` (mit nur einer Variablen) ausführen, Vim sich darüber beschwert, dass es eine undefinierte Variable `a:2` gibt. Wie können Sie es flexibel genug gestalten, um genau das anzuzeigen, was der Benutzer angibt?

Glücklicherweise hat Vim eine spezielle Variable `a:0`, um die *Anzahl* der Argumente anzuzeigen, die in `...` übergeben wurden.

```shell
function! Buffet(...)
  return a:0
endfunction

echo Buffet("Noodles")
" gibt 1 zurück

echo Buffet("Noodles", "Sushi")
" gibt 2 zurück

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" gibt 5 zurück
```

Damit können Sie mit der Länge des Arguments iterieren.

```shell
function! Buffet(...)
  let l:food_counter = 1
  let l:foods = ""
  while l:food_counter <= a:0
    let l:foods .= a:{l:food_counter} . " "
    let l:food_counter += 1
  endwhile
  return l:foods
endfunction
```

Die geschweiften Klammern `a:{l:food_counter}` ist eine String-Interpolation, die den Wert des Zählers `food_counter` verwendet, um die formalen Parameterargumente `a:1`, `a:2`, `a:3` usw. aufzurufen.

```shell
echo Buffet("Noodles")
" gibt "Noodles" zurück

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" gibt alles zurück, was Sie übergeben haben: "Noodles Sushi Ice cream Tofu Mochi"
```

Das variable Argument hat eine weitere spezielle Variable: `a:000`. Sie hat den Wert aller variablen Argumente in Listenformat.

```shell
function! Buffet(...)
  return a:000
endfunction

echo Buffet("Noodles")
" gibt ["Noodles"] zurück

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" gibt ["Noodles", "Sushi", "Ice cream", "Tofu", "Mochi"] zurück
```

Lassen Sie uns die Funktion umgestalten, um eine `for`-Schleife zu verwenden:

```shell
function! Buffet(...)
  let l:foods = ""
  for food_item in a:000
    let l:foods .= food_item . " "
  endfor
  return l:foods
endfunction

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" gibt Noodles Sushi Ice cream Tofu Mochi zurück
```
## Bereich

Sie können eine *bereichsbezogene* Vimscript-Funktion definieren, indem Sie ein `range`-Schlüsselwort am Ende der Funktionsdefinition hinzufügen. Eine Bereichsfunktion hat zwei spezielle Variablen verfügbar: `a:firstline` und `a:lastline`.

```shell
function! Breakfast() range
  echo a:firstline
  echo a:lastline
endfunction
```

Wenn Sie sich in Zeile 100 befinden und `call Breakfast()` ausführen, wird 100 sowohl für `firstline` als auch für `lastline` angezeigt. Wenn Sie die Zeilen 101 bis 105 visuell markieren (`v`, `V` oder `Ctrl-V`) und `call Breakfast()` ausführen, zeigt `firstline` 101 und `lastline` 105 an. `firstline` und `lastline` zeigen den minimalen und maximalen Bereich an, in dem die Funktion aufgerufen wird.

Sie können auch `:call` verwenden und einen Bereich übergeben. Wenn Sie `:11,20call Breakfast()` ausführen, wird 11 für `firstline` und 20 für `lastline` angezeigt.

Sie könnten fragen: "Es ist schön, dass die Vimscript-Funktion einen Bereich akzeptiert, aber kann ich die Zeilennummer nicht mit `line(".")` bekommen? Macht das nicht dasselbe?"

Gute Frage. Wenn das das ist, was Sie meinen:

```shell
function! Breakfast()
  echo line(".")
endfunction
```

Das Aufrufen von `:11,20call Breakfast()` führt die Funktion `Breakfast` 10 Mal aus (einmal für jede Zeile im Bereich). Vergleichen Sie das, wenn Sie das `range`-Argument übergeben hätten:

```shell
function! Breakfast() range
  echo line(".")
endfunction
```

Das Aufrufen von `11,20call Breakfast()` führt die Funktion `Breakfast` *einmal* aus.

Wenn Sie ein `range`-Schlüsselwort übergeben und einen numerischen Bereich (wie `11,20`) bei `call` übergeben, führt Vim diese Funktion nur einmal aus. Wenn Sie kein `range`-Schlüsselwort übergeben und einen numerischen Bereich (wie `11,20`) bei `call` übergeben, führt Vim diese Funktion N Mal aus, abhängig vom Bereich (in diesem Fall, N = 10).

## Wörterbuch

Sie können eine Funktion als Wörterbuch-Element hinzufügen, indem Sie ein `dict`-Schlüsselwort bei der Definition einer Funktion hinzufügen.

Wenn Sie eine Funktion `SecondBreakfast` haben, die das zurückgibt, was auch immer Sie für `breakfast` haben:

```shell
function! SecondBreakfast() dict
  return self.breakfast
endfunction
```

Lassen Sie uns diese Funktion zum `meals`-Wörterbuch hinzufügen:

```shell
let meals = {"breakfast": "pancakes", "second_breakfast": function("SecondBreakfast"), "lunch": "pasta"}

echo meals.second_breakfast()
" gibt "pancakes" zurück
```

Mit dem `dict`-Schlüsselwort bezieht sich die Schlüsselvariable `self` auf das Wörterbuch, in dem die Funktion gespeichert ist (in diesem Fall das `meals`-Wörterbuch). Der Ausdruck `self.breakfast` entspricht `meals.breakfast`.

Eine alternative Möglichkeit, eine Funktion in ein Wörterbuchobjekt hinzuzufügen, besteht darin, einen Namensraum zu verwenden.

```shell
function! meals.second_lunch()
  return self.lunch
endfunction

echo meals.second_lunch()
" gibt "pasta" zurück
```

Mit dem Namensraum müssen Sie das `dict`-Schlüsselwort nicht verwenden.

## Funcref

Ein Funcref ist ein Verweis auf eine Funktion. Es ist einer der grundlegenden Datentypen von Vimscript, die in Kap. 24 erwähnt werden.

Der Ausdruck `function("SecondBreakfast")` oben ist ein Beispiel für einen Funcref. Vim hat eine eingebaute Funktion `function()`, die einen Funcref zurückgibt, wenn Sie ihr einen Funktionsnamen (String) übergeben.

```shell
function! Breakfast(item)
  return "Ich habe " . a:item . " zum Frühstück"
endfunction

let Breakfastify = Breakfast
" gibt einen Fehler zurück

let Breakfastify = function("Breakfast")

echo Breakfastify("oatmeal")
" gibt "Ich habe oatmeal zum Frühstück" zurück

echo Breakfastify("pancake")
" gibt "Ich habe pancake zum Frühstück" zurück
```

In Vim, wenn Sie eine Funktion einer Variablen zuweisen möchten, können Sie sie nicht einfach direkt zuweisen wie `let MyVar = MyFunc`. Sie müssen die Funktion `function()` verwenden, wie `let MyVar = function("MyFunc")`.

Sie können Funcref mit Maps und Filtern verwenden. Beachten Sie, dass Maps und Filter einen Index als erstes Argument und den iterierten Wert als zweites Argument übergeben.

```shell
function! Breakfast(index, item)
  return "Ich habe " . a:item . " zum Frühstück"
endfunction

let breakfast_items = ["pancakes", "hash browns", "waffles"]
let first_meals = map(breakfast_items, function("Breakfast"))

for meal in first_meals
  echo meal
endfor
```

## Lambda

Eine bessere Möglichkeit, Funktionen in Maps und Filtern zu verwenden, besteht darin, Lambda-Ausdrücke (manchmal als unbenannte Funktionen bekannt) zu verwenden. Zum Beispiel:

```shell
let Plus = {x,y -> x + y}
echo Plus(1,2)
" gibt 3 zurück

let Tasty = { -> 'tasty'}
echo Tasty()
" gibt "tasty" zurück
```

Sie können eine Funktion von innerhalb eines Lambda-Ausdrucks aufrufen:

```shell
function! Lunch(item)
  return "Ich habe " . a:item . " zum Mittagessen"
endfunction

let lunch_items = ["sushi", "ramen", "sashimi"]

let day_meals = map(lunch_items, {index, item -> Lunch(item)})

for meal in day_meals
  echo meal
endfor
```

Wenn Sie die Funktion nicht von innerhalb des Lambdas aufrufen möchten, können Sie sie umstrukturieren:

```shell
let day_meals = map(lunch_items, {index, item -> "Ich habe " . item . " zum Mittagessen"})
```

## Methodenverkettung

Sie können mehrere Vimscript-Funktionen und Lambda-Ausdrücke sequenziell mit `->` verketten. Beachten Sie, dass `->` von einem Methodennamen *ohne Leerzeichen* gefolgt werden muss.

```shell
Source->Method1()->Method2()->...->MethodN()
```

Um eine Fließkommazahl in eine Zahl mit Methodenverkettung zu konvertieren:

```shell
echo 3.14->float2nr()
" gibt 3 zurück
```

Lassen Sie uns ein komplizierteres Beispiel machen. Angenommen, Sie müssen den ersten Buchstaben jedes Elements in einer Liste großschreiben, dann die Liste sortieren und schließlich die Liste zu einem String zusammenfügen.

```shell
function! Capitalizer(word)
  return substitute(a:word, "\^\.", "\\u&", "g")
endfunction

function! CapitalizeList(word_list)
  return map(a:word_list, {index, word -> Capitalizer(word)})
endfunction

let dinner_items = ["bruschetta", "antipasto", "calzone"]

echo dinner_items->CapitalizeList()->sort()->join(", ")
" gibt "Antipasto, Bruschetta, Calzone" zurück
```

Mit der Methodenverkettung ist die Reihenfolge leichter zu lesen und zu verstehen. Ich kann nur einen Blick auf `dinner_items->CapitalizeList()->sort()->join(", ")` werfen und genau wissen, was vor sich geht.

## Closure

Wenn Sie eine Variable innerhalb einer Funktion definieren, existiert diese Variable innerhalb der Grenzen dieser Funktion. Dies wird als lexikalischer Geltungsbereich bezeichnet.

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch()
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

`appetizer` wird innerhalb der Funktion `Lunch` definiert, die den Funcref `SecondLunch` zurückgibt. Beachten Sie, dass `SecondLunch` die `appetizer` verwendet, aber in Vimscript hat sie keinen Zugriff auf diese Variable. Wenn Sie versuchen, `echo Lunch()()` auszuführen, wird Vim einen Fehler wegen einer undefinierten Variablen ausgeben.

Um dieses Problem zu beheben, verwenden Sie das `closure`-Schlüsselwort. Lassen Sie uns umstrukturieren:

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch() closure
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

Jetzt, wenn Sie `echo Lunch()()` ausführen, gibt Vim "shrimp" zurück.

## Lernen Sie Vimscript-Funktionen auf die smarte Weise

In diesem Kapitel haben Sie die Anatomie der Vim-Funktion gelernt. Sie haben gelernt, wie Sie verschiedene spezielle Schlüsselwörter `range`, `dict` und `closure` verwenden, um das Verhalten von Funktionen zu ändern. Sie haben auch gelernt, wie man Lambda verwendet und mehrere Funktionen miteinander verkettet. Funktionen sind wichtige Werkzeuge zur Erstellung komplexer Abstraktionen.

Als Nächstes lassen Sie uns alles, was Sie gelernt haben, zusammenbringen, um Ihr eigenes Plugin zu erstellen.