---
description: Dieses Kapitel behandelt die Konzepte Suche und Ersetzen in Vim, einschließlich
  der Verwendung von regulären Ausdrücken und der intelligenten Groß-/Kleinschreibung.
title: Ch12. Search and Substitute
---

Dieses Kapitel behandelt zwei separate, aber verwandte Konzepte: Suchen und Ersetzen. Oft müssen Sie beim Bearbeiten mehrere Texte basierend auf ihren am wenigsten gemeinsamen Nenner-Mustern durchsuchen. Wenn Sie lernen, wie man reguläre Ausdrücke beim Suchen und Ersetzen anstelle von wörtlichen Zeichenfolgen verwendet, können Sie schnell jeden Text anvisieren.

Als Randnotiz werde ich in diesem Kapitel `/` verwenden, wenn ich über das Suchen spreche. Alles, was Sie mit `/` tun können, kann auch mit `?` getan werden.

## Intelligente Groß-/Kleinschreibung

Es kann knifflig sein, die Groß-/Kleinschreibung des Suchbegriffs abzugleichen. Wenn Sie nach dem Text "Learn Vim" suchen, können Sie leicht den Fall eines Buchstabens falsch eingeben und ein falsches Suchergebnis erhalten. Wäre es nicht einfacher und sicherer, wenn Sie jede Groß-/Kleinschreibung abgleichen könnten? Hier kommt die Option `ignorecase` ins Spiel. Fügen Sie einfach `set ignorecase` in Ihre vimrc ein und alle Ihre Suchbegriffe werden groß-/kleinschreibungsunempfindlich. Jetzt müssen Sie nicht mehr `/Learn Vim` eingeben, `/learn vim` funktioniert.

Es gibt jedoch Zeiten, in denen Sie nach einem fallenspezifischen Ausdruck suchen müssen. Eine Möglichkeit, dies zu tun, besteht darin, die `ignorecase`-Option auszuschalten, indem Sie `set noignorecase` ausführen, aber das ist viel Arbeit, um sie jedes Mal ein- und auszuschalten, wenn Sie nach einem fallenspezifischen Ausdruck suchen müssen.

Um das Umschalten von `ignorecase` zu vermeiden, hat Vim eine `smartcase`-Option, um nach einer groß-/kleinschreibungsunempfindlichen Zeichenfolge zu suchen, wenn das Suchmuster *mindestens ein Großbuchstaben enthält*. Sie können sowohl `ignorecase` als auch `smartcase` kombinieren, um eine groß-/kleinschreibungsunempfindliche Suche durchzuführen, wenn Sie nur Kleinbuchstaben eingeben, und eine fallenspezifische Suche, wenn Sie einen oder mehrere Großbuchstaben eingeben.

Fügen Sie in Ihrer vimrc hinzu:

```shell
set ignorecase smartcase
```

Wenn Sie diese Texte haben:

```shell
hello
HELLO
Hello
```

- `/hello` entspricht "hello", "HELLO" und "Hello".
- `/HELLO` entspricht nur "HELLO".
- `/Hello` entspricht nur "Hello".

Es gibt einen Nachteil. Was ist, wenn Sie nur nach einer Kleinbuchstaben-Zeichenfolge suchen müssen? Wenn Sie `/hello` eingeben, führt Vim jetzt eine groß-/kleinschreibungsunempfindliche Suche durch. Sie können das Muster `\C` überall in Ihrem Suchbegriff verwenden, um Vim mitzuteilen, dass der folgende Suchbegriff groß-/kleinschreibungsabhängig sein wird. Wenn Sie `/\Chello` eingeben, wird es strikt "hello" entsprechen, nicht "HELLO" oder "Hello".

## Erster und letzter Charakter in einer Zeile

Sie können `^` verwenden, um das erste Zeichen in einer Zeile zu finden, und `$`, um das letzte Zeichen in einer Zeile zu finden.

Wenn Sie diesen Text haben:

```shell
hello hello
```

Können Sie das erste "hello" mit `/^hello` anvisieren. Das Zeichen, das `^` folgt, muss das erste Zeichen in einer Zeile sein. Um das letzte "hello" anzusprechen, führen Sie `/hello$` aus. Das Zeichen vor `$` muss das letzte Zeichen in einer Zeile sein.

Wenn Sie diesen Text haben:

```shell
hello hello friend
```

Wird `/hello$` nichts finden, weil "friend" der letzte Begriff in dieser Zeile ist, nicht "hello".

## Wiederholtes Suchen

Sie können die vorherige Suche mit `//` wiederholen. Wenn Sie gerade nach `/hello` gesucht haben, ist das Ausführen von `//` gleichbedeutend mit dem Ausführen von `/hello`. Diese Abkürzung kann Ihnen einige Tastenanschläge sparen, insbesondere wenn Sie gerade nach einer langen Zeichenfolge gesucht haben. Denken Sie auch daran, dass Sie `n` und `N` verwenden können, um die letzte Suche in derselben Richtung und in entgegengesetzter Richtung zu wiederholen.

Was ist, wenn Sie schnell den *n* letzten Suchbegriff abrufen möchten? Sie können schnell durch den Suchverlauf navigieren, indem Sie zuerst `/` drücken und dann die Pfeiltasten `hoch`/`runter` (oder `Ctrl-N`/`Ctrl-P`) drücken, bis Sie den benötigten Suchbegriff finden. Um Ihren gesamten Suchverlauf anzuzeigen, können Sie `:history /` ausführen.

Wenn Sie das Ende einer Datei beim Suchen erreichen, wirft Vim einen Fehler: `"Search hit the BOTTOM without match for: {your-search}"`. Manchmal kann dies ein guter Schutz gegen Über-Suchen sein, aber manchmal möchten Sie die Suche wieder nach oben zirkulieren. Sie können die Option `set wrapscan` verwenden, um Vim zu veranlassen, beim Erreichen des Endes der Datei wieder oben in der Datei zu suchen. Um diese Funktion auszuschalten, führen Sie `set nowrapscan` aus.

## Suchen nach alternativen Wörtern

Es ist üblich, nach mehreren Wörtern gleichzeitig zu suchen. Wenn Sie nach *entweder* "hello vim" oder "hola vim" suchen müssen, aber nicht nach "salve vim" oder "bonjour vim", können Sie das Muster `|` verwenden.

Gegebenenfalls dieser Text:

```shell
hello vim
hola vim
salve vim
bonjour vim
```

Um sowohl "hello" als auch "hola" zu finden, können Sie `/hello\|hola` verwenden. Sie müssen den Oder-Operator (`|`) escapen (`\`), andernfalls sucht Vim wörtlich nach der Zeichenfolge "|".

Wenn Sie nicht jedes Mal `\|` eingeben möchten, können Sie die `magic`-Syntax (`\v`) am Anfang der Suche verwenden: `/\vhello|hola`. Ich werde `magic` in diesem Leitfaden nicht behandeln, aber mit `\v` müssen Sie keine Sonderzeichen mehr escapen. Um mehr über `\v` zu erfahren, können Sie `:h \v` überprüfen.

## Festlegen des Starts und Endes eines Treffers

Vielleicht müssen Sie nach einem Text suchen, der Teil eines zusammengesetzten Wortes ist. Wenn Sie diese Texte haben:

```shell
11vim22
vim22
11vim
vim
```

Wenn Sie "vim" auswählen müssen, aber nur, wenn es mit "11" beginnt und mit "22" endet, können Sie die Operatoren `\zs` (Starttreffer) und `\ze` (Endtreffer) verwenden. Führen Sie aus:

```shell
/11\zsvim\ze22
```

Vim muss immer noch das gesamte Muster "11vim22" abgleichen, hebt jedoch nur das Muster hervor, das zwischen `\zs` und `\ze` eingeschlossen ist. Ein weiteres Beispiel:

```shell
foobar
foobaz
```

Wenn Sie das "foo" in "foobaz" abgleichen müssen, aber nicht in "foobar", führen Sie aus:

```shell
/foo\zebaz
```

## Suchen nach Zeichenbereichen

Alle Ihre Suchbegriffe bis zu diesem Punkt waren eine wörtliche Wortsuche. Im wirklichen Leben müssen Sie möglicherweise ein allgemeines Muster verwenden, um Ihren Text zu finden. Das grundlegendste Muster ist der Zeichenbereich, `[ ]`.

Wenn Sie nach einer Ziffer suchen müssen, möchten Sie wahrscheinlich nicht jedes Mal `/0\|1\|2\|3\|4\|5\|6\|7\|8\|9\|0` eingeben. Verwenden Sie stattdessen `/[0-9]`, um eine einzelne Ziffer zu finden. Der Ausdruck `0-9` stellt einen Bereich von Zahlen von 0-9 dar, den Vim versuchen wird abzugleichen. Wenn Sie stattdessen nach Ziffern zwischen 1 und 5 suchen, verwenden Sie `/[1-5]`.

Ziffern sind nicht die einzigen Datentypen, die Vim nachschlagen kann. Sie können auch `/[a-z]` verwenden, um nach Kleinbuchstaben zu suchen, und `/[A-Z]`, um nach Großbuchstaben zu suchen.

Sie können diese Bereiche kombinieren. Wenn Sie nach Ziffern von 0-9 und sowohl Klein- als auch Großbuchstaben von "a" bis "f" (wie in einer Hexadezimalzahl) suchen müssen, können Sie `/[0-9a-fA-F]` verwenden.

Um eine negative Suche durchzuführen, können Sie `^` innerhalb der Zeichenbereichs-Klammern hinzufügen. Um nach einer Nicht-Ziffer zu suchen, führen Sie `/[^0-9]` aus. Vim wird jedes Zeichen abgleichen, solange es keine Ziffer ist. Beachten Sie, dass das Caret (`^`) innerhalb der Bereichsklammern anders ist als das Caret am Anfang einer Zeile (z. B. `/^hello`). Wenn ein Caret außerhalb eines Klammernpaares steht und das erste Zeichen im Suchbegriff ist, bedeutet es "das erste Zeichen in einer Zeile". Wenn ein Caret innerhalb eines Klammernpaares steht und das erste Zeichen innerhalb der Klammern ist, bedeutet es einen negativen Suchoperator. `/^abc` entspricht dem ersten "abc" in einer Zeile und `/[^abc]` entspricht jedem Zeichen außer einem "a", "b" oder "c".

## Suchen nach wiederholten Zeichen

Wenn Sie nach zweistelligen Ziffern in diesem Text suchen müssen:

```shell
1aa
11a
111
```

Können Sie `/[0-9][0-9]` verwenden, um ein zweistelliges Zeichen abzugleichen, aber diese Methode ist nicht skalierbar. Was ist, wenn Sie zwanzig Ziffern abgleichen müssen? `[0-9]` zwanzig Mal einzugeben, ist kein angenehmes Erlebnis. Deshalb benötigen Sie ein `count`-Argument.

Sie können `count` an Ihre Suche übergeben. Es hat die folgende Syntax:

```shell
{n,m}
```

Übrigens müssen diese `count`-Klammern escaped werden, wenn Sie sie in Vim verwenden. Der `count`-Operator wird nach einem einzelnen Zeichen platziert, das Sie erhöhen möchten.

Hier sind die vier verschiedenen Variationen der `count`-Syntax:
- `{n}` ist ein exakter Treffer. `/[0-9]\{2\}` entspricht den zweistelligen Zahlen: "11" und der "11" in "111".
- `{n,m}` ist ein Bereichstreffer. `/[0-9]\{2,3\}` entspricht Zahlen mit 2 bis 3 Ziffern: "11" und "111".
- `{,m}` ist ein bis zu Treffer. `/[0-9]\{,3\}` entspricht bis zu 3 Ziffern: "1", "11" und "111".
- `{n,}` ist ein mindestens Treffer. `/[0-9]\{2,\}` entspricht mindestens 2 oder mehr Ziffern: "11" und "111".

Die Zählargumente `\{0,\}` (null oder mehr) und `\{1,\}` (eins oder mehr) sind gängige Suchmuster, und Vim hat spezielle Operatoren dafür: `*` und `+` ( `+` muss escaped werden, während `*` ohne Escape funktioniert). Wenn Sie `/[0-9]*` eingeben, ist es dasselbe wie `/[0-9]\{0,\}`. Es sucht nach null oder mehr Ziffern. Es wird "", "1", "123" abgleichen. Übrigens wird es auch Nicht-Ziffern wie "a" abgleichen, da es technisch gesehen null Ziffern im Buchstaben "a" gibt. Denken Sie sorgfältig nach, bevor Sie `*` verwenden. Wenn Sie `/[0-9]\+` eingeben, ist es dasselbe wie `/[0-9]\{1,\}`. Es sucht nach einer oder mehr Ziffern. Es wird "1" und "12" abgleichen.

## Vorgegebene Zeichenbereiche

Vim hat vordefinierte Bereiche für gängige Zeichen wie Ziffern und Buchstaben. Ich werde hier nicht jeden einzelnen durchgehen, aber Sie finden die vollständige Liste in `:h /character-classes`. Hier sind die nützlichen:

```shell
\d    Ziffer [0-9]
\D    Nicht-Ziffer [^0-9]
\s    Leerzeichenzeichen (Leerzeichen und Tabulator)
\S    Nicht-Leerzeichenzeichen (alles außer Leerzeichen und Tabulator)
\w    Wortzeichen [0-9A-Za-z_]
\l    Kleinbuchstaben [a-z]
\u    Großbuchstaben [A-Z]
```

Sie können sie verwenden, wie Sie Zeichenbereiche verwenden würden. Um nach einer einzelnen Ziffer zu suchen, anstatt `/[0-9]` zu verwenden, können Sie `/\d` für eine prägnantere Syntax verwenden.

## Suchbeispiel: Erfassen eines Textes zwischen einem Paar ähnlicher Zeichen

Wenn Sie nach einem Satz suchen möchten, der von einem Paar doppelter Anführungszeichen umgeben ist:

```shell
"Vim ist großartig!"
```

Führen Sie dies aus:

```shell
/"[^"]\+"
```

Lassen Sie uns das aufschlüsseln:
- `"` ist ein literales doppeltes Anführungszeichen. Es entspricht dem ersten doppelten Anführungszeichen.
- `[^"]` bedeutet jedes Zeichen außer einem doppelten Anführungszeichen. Es entspricht jedem alphanumerischen und Leerzeichenzeichen, solange es kein doppeltes Anführungszeichen ist.
- `\+` bedeutet eins oder mehr. Da es von `[^"]` vorangeht, sucht Vim nach einem oder mehreren Zeichen, die kein doppeltes Anführungszeichen sind.
- `"` ist ein literales doppeltes Anführungszeichen. Es entspricht dem schließenden doppelten Anführungszeichen.

Wenn Vim das erste `"` sieht, beginnt es mit der Mustererfassung. In dem Moment, in dem es das zweite doppelte Anführungszeichen in einer Zeile sieht, entspricht es dem zweiten `"`-Muster und stoppt die Mustererfassung. In der Zwischenzeit werden alle Nicht-doppelten Anführungszeichen-Zeichen dazwischen durch das Muster `[^"]\+` erfasst, in diesem Fall der Satz `Vim ist großartig!`. Dies ist ein gängiges Muster, um einen Satz zu erfassen, der von einem Paar ähnlicher Trennzeichen umgeben ist.

- Um einen Satz zu erfassen, der von einfachen Anführungszeichen umgeben ist, können Sie `/'[^']\+'` verwenden.
- Um einen Satz zu erfassen, der von Nullen umgeben ist, können Sie `/0[^0]\+0` verwenden.

## Suchbeispiel: Erfassen einer Telefonnummer

Wenn Sie eine US-Telefonnummer erfassen möchten, die durch einen Bindestrich (`-`) getrennt ist, wie `123-456-7890`, können Sie verwenden:

```shell
/\d\{3\}-\d\{3\}-\d\{4\}
```

Eine US-Telefonnummer besteht aus einer Gruppe von drei Ziffern, gefolgt von weiteren drei Ziffern und schließlich von vier Ziffern. Lassen Sie uns das aufschlüsseln:
- `\d\{3\}` entspricht einer Ziffer, die genau dreimal wiederholt wird
- `-` ist ein literaler Bindestrich

Sie können das Tippen von Escapes mit `\v` vermeiden:

```shell
/\v\d{3}-\d{3}-\d{4}
```

Dieses Muster ist auch nützlich, um wiederholte Ziffern zu erfassen, wie IP-Adressen und Postleitzahlen.

Das deckt den Suchteil dieses Kapitels ab. Lassen Sie uns nun zum Ersetzen übergehen.

## Grundlegendes Ersetzen

Der Ersetzen-Befehl von Vim ist ein nützlicher Befehl, um schnell ein Muster zu finden und zu ersetzen. Die Ersetzungssyntax lautet:

```shell
:s/{altes-muster}/{neues-muster}/
```

Lassen Sie uns mit einer grundlegenden Verwendung beginnen. Wenn Sie diesen Text haben:

```shell
vim ist gut
```

Lassen Sie uns "gut" durch "großartig" ersetzen, denn Vim ist großartig. Führen Sie `:s/gut/großartig/` aus. Sie sollten sehen:

```shell
vim ist großartig
```
## Wiederholung der letzten Ersetzung

Sie können den letzten Ersetzungsbefehl entweder mit dem normalen Befehl `&` oder durch Ausführen von `:s` wiederholen. Wenn Sie gerade `:s/good/awesome/` ausgeführt haben, wird sowohl `&` als auch `:s` es wiederholen.

Außerdem habe ich früher in diesem Kapitel erwähnt, dass Sie `//` verwenden können, um das vorherige Suchmuster zu wiederholen. Dieser Trick funktioniert mit dem Ersetzungsbefehl. Wenn `/good` kürzlich ausgeführt wurde und Sie das erste Ersetzungsmuster-Argument leer lassen, wie in `:s//awesome/`, funktioniert es genauso wie `:s/good/awesome/` auszuführen.

## Ersetzungsbereich

Genau wie viele Ex-Befehle können Sie ein Bereichsargument in den Ersetzungsbefehl übergeben. Die Syntax ist:

```shell
:[range]s/old/new/
```

Wenn Sie diese Ausdrücke haben:

```shell
let one = 1;
let two = 2;
let three = 3;
let four = 4;
let five = 5;
```

Um "let" in "const" in den Zeilen drei bis fünf zu ersetzen, können Sie Folgendes tun:

```shell
:3,5s/let/const/
```

Hier sind einige Bereichsvariationen, die Sie übergeben können:

- `:,3s/let/const/` - Wenn nichts vor dem Komma angegeben ist, steht es für die aktuelle Zeile. Ersetzen Sie von der aktuellen Zeile bis zur Zeile 3.
- `:1,s/let/const/` - Wenn nach dem Komma nichts angegeben ist, steht es ebenfalls für die aktuelle Zeile. Ersetzen Sie von Zeile 1 bis zur aktuellen Zeile.
- `:3s/let/const/` - Wenn nur ein Wert als Bereich angegeben ist (kein Komma), wird die Ersetzung nur in dieser Zeile durchgeführt.

In Vim bedeutet `%` normalerweise die gesamte Datei. Wenn Sie `:%s/let/const/` ausführen, wird die Ersetzung in allen Zeilen durchgeführt. Beachten Sie diese Bereichssyntax. Viele Befehlszeilenbefehle, die Sie in den kommenden Kapiteln lernen werden, folgen dieser Form.

## Mustererkennung

Die nächsten Abschnitte behandeln grundlegende reguläre Ausdrücke. Ein starkes Musterwissen ist entscheidend, um den Ersetzungsbefehl zu meistern.

Wenn Sie die folgenden Ausdrücke haben:

```shell
let one = 1;
let two = 2;
let three = 3;
let four = 4;
let five = 5;
```

Um ein Paar doppelte Anführungszeichen um die Ziffern hinzuzufügen:

```shell
:%s/\d/"\0"/
```

Das Ergebnis:

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Lassen Sie uns den Befehl aufschlüsseln:
- `:%s` zielt auf die gesamte Datei ab, um die Ersetzung durchzuführen.
- `\d` ist Vims vordefinierter Bereich für Ziffern (ähnlich wie die Verwendung von `[0-9]`).
- `"\0"` hier sind die doppelten Anführungszeichen literale doppelte Anführungszeichen. `\0` ist ein Sonderzeichen, das "das gesamte übereinstimmende Muster" darstellt. Das übereinstimmende Muster hier ist eine einzelne Ziffer, `\d`.

Alternativ stellt `&` auch das gesamte übereinstimmende Muster wie `\0` dar. `:s/\d/"&"/` hätte ebenfalls funktioniert.

Betrachten wir ein weiteres Beispiel. Gegeben sind diese Ausdrücke und Sie müssen alle "let" mit den Variablennamen vertauschen.

```shell
one let = "1";
two let = "2";
three let = "3";
four let = "4";
five let = "5";
```

Um das zu tun, führen Sie Folgendes aus:

```shell
:%s/\(\w\+\) \(\w\+\)/\2 \1/
```

Der obige Befehl enthält zu viele Rückwärtsschläge und ist schwer zu lesen. In diesem Fall ist es praktischer, den `\v`-Operator zu verwenden:

```shell
:%s/\v(\w+) (\w+)/\2 \1/
```

Das Ergebnis:

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Großartig! Lassen Sie uns diesen Befehl aufschlüsseln:
- `:%s` zielt auf alle Zeilen in der Datei ab, um die Ersetzung durchzuführen.
- `(\w+) (\w+)` ist ein Gruppenvergleich. `\w` ist einer von Vims vordefinierten Bereichen für ein Wortzeichen (`[0-9A-Za-z_]`). Die `( )` umgeben es, um einen Wortzeichenvergleich in einer Gruppe zu erfassen. Beachten Sie den Abstand zwischen den beiden Gruppierungen. `(\w+) (\w+)` erfasst zwei Gruppen. Die erste Gruppe erfasst "one" und die zweite Gruppe erfasst "two".
- `\2 \1` gibt die erfasste Gruppe in umgekehrter Reihenfolge zurück. `\2` enthält den erfassten String "let" und `\1` den String "one". Mit `\2 \1` wird der String "let one" zurückgegeben.

Denken Sie daran, dass `\0` das gesamte übereinstimmende Muster darstellt. Sie können den übereinstimmenden String in kleinere Gruppen mit `( )` aufteilen. Jede Gruppe wird durch `\1`, `\2`, `\3` usw. dargestellt.

Lassen Sie uns ein weiteres Beispiel machen, um dieses Konzept der Gruppenübereinstimmung zu festigen. Wenn Sie diese Zahlen haben:

```shell
123
456
789
```

Um die Reihenfolge umzukehren, führen Sie Folgendes aus:

```shell
:%s/\v(\d)(\d)(\d)/\3\2\1/
```

Das Ergebnis ist:

```shell
321
654
987
```

Jedes `(\d)` entspricht jeder Ziffer und erstellt eine Gruppe. In der ersten Zeile hat das erste `(\d)` den Wert 1, das zweite `(\d)` hat den Wert 2 und das dritte `(\d)` hat den Wert 3. Sie werden in den Variablen `\1`, `\2` und `\3` gespeichert. In der zweiten Hälfte Ihrer Ersetzung ergibt das neue Muster `\3\2\1` den Wert "321" in Zeile eins.

Wenn Sie stattdessen Folgendes ausgeführt hätten:

```shell
:%s/\v(\d\d)(\d)/\2\1/
```
Hätten Sie ein anderes Ergebnis erhalten:

```shell
312
645
978
```

Dies liegt daran, dass Sie jetzt nur zwei Gruppen haben. Die erste Gruppe, die durch `(\d\d)` erfasst wird, wird in `\1` gespeichert und hat den Wert 12. Die zweite Gruppe, die durch `(\d)` erfasst wird, wird in `\2` gespeichert und hat den Wert 3. `\2\1` ergibt dann 312.

## Ersetzungsflags

Wenn Sie den Satz haben:

```shell
chocolate pancake, strawberry pancake, blueberry pancake
```

Um alle Pfannkuchen in Donuts zu ersetzen, können Sie nicht einfach Folgendes ausführen:

```shell
:s/pancake/donut
```

Der obige Befehl ersetzt nur das erste Vorkommen und gibt Ihnen:

```shell
chocolate donut, strawberry pancake, blueberry pancake
```

Es gibt zwei Möglichkeiten, dies zu lösen. Sie können entweder den Ersetzungsbefehl zweimal mehr ausführen oder ihm ein globales (`g`) Flag übergeben, um alle Vorkommen in einer Zeile zu ersetzen.

Lassen Sie uns über das globale Flag sprechen. Führen Sie Folgendes aus:

```shell
:s/pancake/donut/g
```

Vim ersetzt alle Pfannkuchen mit Donuts in einem schnellen Befehl. Der globale Befehl ist eines der mehreren Flags, die der Ersetzungsbefehl akzeptiert. Sie übergeben Flags am Ende des Ersetzungsbefehls. Hier ist eine Liste nützlicher Flags:

```shell
&    Wiederverwendung der Flags des vorherigen Ersetzungsbefehls.
g    Ersetzt alle Vorkommen in der Zeile.
c    Fragt nach einer Bestätigung für die Ersetzung.
e    Verhindert, dass eine Fehlermeldung angezeigt wird, wenn die Ersetzung fehlschlägt.
i    Führt eine nicht fall-sensitive Ersetzung durch.
I    Führt eine fall-sensitive Ersetzung durch.
```

Es gibt noch weitere Flags, die ich oben nicht aufgelistet habe. Um mehr über alle Flags zu erfahren, schauen Sie sich `:h s_flags` an.

Übrigens behalten die Wiederholungsersetzungsbefehle (`&` und `:s`) die Flags nicht bei. Das Ausführen von `&` wiederholt nur `:s/pancake/donut/` ohne `g`. Um den letzten Ersetzungsbefehl schnell mit allen Flags zu wiederholen, führen Sie `:&&` aus.

## Ändern des Trennzeichens

Wenn Sie eine URL mit einem langen Pfad ersetzen müssen:

```shell
https://mysite.com/a/b/c/d/e
```

Um es mit dem Wort "hello" zu ersetzen, führen Sie Folgendes aus:

```shell
:s/https:\/\/mysite.com\/a\/b\/c\/d\/e/hello/
```

Es ist jedoch schwer zu erkennen, welche Schrägstriche (`/`) Teil des Ersetzungsmusters sind und welche die Trennzeichen sind. Sie können das Trennzeichen mit beliebigen einbyte-Zeichen (außer Buchstaben, Zahlen oder `"`, `|` und `\`) ändern. Lassen Sie uns sie durch `+` ersetzen. Der obige Ersetzungsbefehl kann dann umgeschrieben werden als:

```shell
:s+https:\/\/mysite.com\/a\/b\/c\/d\/e+hello+
```

Es ist jetzt einfacher zu sehen, wo die Trennzeichen sind.

## Besondere Ersetzung

Sie können auch die Groß- und Kleinschreibung des Textes, den Sie ersetzen, ändern. Gegeben sind die folgenden Ausdrücke und Ihre Aufgabe ist es, die Variablen "one", "two", "three" usw. großzuschreiben.

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Führen Sie Folgendes aus:

```shell
:%s/\v(\w+) (\w+)/\1 \U\2/
```

Sie erhalten:

```shell
let ONE = "1";
let TWO = "2";
let THREE = "3";
let FOUR = "4";
let FIVE = "5";
```

Die Aufschlüsselung:
- `(\w+) (\w+)` erfasst die ersten beiden übereinstimmenden Gruppen, wie "let" und "one".
- `\1` gibt den Wert der ersten Gruppe, "let", zurück.
- `\U\2` macht die zweite Gruppe (`\2`) groß.

Der Trick dieses Befehls ist der Ausdruck `\U\2`. `\U` weist an, dass das folgende Zeichen großgeschrieben werden soll.

Lassen Sie uns ein weiteres Beispiel machen. Angenommen, Sie schreiben einen Vim-Leitfaden und müssen den ersten Buchstaben jedes Wortes in einer Zeile großschreiben.

```shell
vim is the greatest text editor in the whole galaxy
```

Sie können Folgendes ausführen:

```shell
:s/\<./\U&/g
```

Das Ergebnis:

```shell
Vim Is The Greatest Text Editor In The Whole Galaxy
```

Hier sind die Aufschlüsselungen:
- `:s` ersetzt die aktuelle Zeile.
- `\<.` besteht aus zwei Teilen: `\<`, um den Anfang eines Wortes zu erfassen, und `.` um ein beliebiges Zeichen zu erfassen. Der `\<`-Operator bewirkt, dass das folgende Zeichen das erste Zeichen eines Wortes ist. Da `.` das nächste Zeichen ist, wird es das erste Zeichen jedes Wortes erfassen.
- `\U&` macht das nachfolgende Symbol, `&`, groß. Denken Sie daran, dass `&` (oder `\0`) das gesamte Übereinstimmen darstellt. Es erfasst das erste Zeichen jedes Wortes.
- `g` das globale Flag. Ohne es ersetzt dieser Befehl nur das erste Vorkommen. Sie müssen jedes Vorkommen in dieser Zeile ersetzen.

Um mehr über die speziellen Ersetzungssymbole von Ersetzungen wie `\U` zu erfahren, schauen Sie sich `:h sub-replace-special` an.

## Alternative Muster

Manchmal müssen Sie mehrere Muster gleichzeitig erfassen. Wenn Sie die folgenden Grüße haben:

```shell
hello vim
hola vim
salve vim
bonjour vim
```

Müssen Sie das Wort "vim" durch "friend" ersetzen, aber nur in den Zeilen, die das Wort "hello" oder "hola" enthalten. Denken Sie daran, dass Sie aus früherem Kapitel `|` für mehrere alternative Muster verwenden können.

```shell
:%s/\v(hello|hola) vim/\1 friend/g
```

Das Ergebnis:

```shell
hello friend
hola friend
salve vim
bonjour vim
```

Hier ist die Aufschlüsselung:
- `%s` führt den Ersetzungsbefehl in jeder Zeile einer Datei aus.
- `(hello|hola)` erfasst *entweder* "hello" oder "hola" und betrachtet es als Gruppe.
- `vim` ist das wörtliche Wort "vim".
- `\1` ist die erste Gruppe, die entweder den Text "hello" oder "hola" ist.
- `friend` ist das wörtliche Wort "friend".

## Ersetzen des Anfangs und des Endes eines Musters

Denken Sie daran, dass Sie `\zs` und `\ze` verwenden können, um den Anfang und das Ende eines Treffers zu definieren. Diese Technik funktioniert auch bei Ersetzungen. Wenn Sie haben:

```shell
chocolate pancake
strawberry sweetcake
blueberry hotcake
```

Um das "cake" in "hotcake" durch "dog" zu ersetzen, um einen "hotdog" zu erhalten:

```shell
:%s/hot\zscake/dog/g
```

Ergebnis:

```shell
chocolate pancake
strawberry sweetcake
blueberry hotdog
```
## Gierig und Nicht-gierig

Sie können den n-ten Treffer in einer Zeile mit diesem Trick ersetzen:

```shell
One Mississippi, two Mississippi, three Mississippi, four Mississippi, five Mississippi.
```

Um das dritte "Mississippi" durch "Arkansas" zu ersetzen, führen Sie aus:

```shell
:s/\v(.{-}\zsMississippi){3}/Arkansas/g
```

Die Aufschlüsselung:
- `:s/` der Ersetzungsbefehl.
- `\v` ist das magische Schlüsselwort, sodass Sie spezielle Schlüsselwörter nicht escapen müssen.
- `.` entspricht jedem einzelnen Zeichen.
- `{-}` führt einen nicht-gierigen Treffer von 0 oder mehr des vorhergehenden Atoms durch.
- `\zsMississippi` macht "Mississippi" zum Anfang des Treffers.
- `(...){3}` sucht nach dem dritten Treffer.

Sie haben die `{3}`-Syntax bereits in diesem Kapitel gesehen. In diesem Fall wird `{3}` genau den dritten Treffer erfassen. Der neue Trick hier ist `{-}`. Es ist ein nicht-gieriger Treffer. Es findet den kürzesten Treffer des gegebenen Musters. In diesem Fall entspricht `(.{-}Mississippi)` der geringsten Menge an "Mississippi", die von einem beliebigen Zeichen vorangeht. Im Gegensatz dazu findet `(.*Mississippi)` den längsten Treffer des gegebenen Musters.

Wenn Sie `(.{-}Mississippi)` verwenden, erhalten Sie fünf Treffer: "One Mississippi", "Two Mississippi" usw. Wenn Sie `(.*Mississippi)` verwenden, erhalten Sie einen Treffer: das letzte "Mississippi". `*` ist ein gieriger Matcher und `{-}` ist ein nicht-gieriger Matcher. Um mehr zu erfahren, schauen Sie sich `:h /\{-` und `:h non-greedy` an.

Lassen Sie uns ein einfacheres Beispiel machen. Wenn Sie den String haben:

```shell
abc1de1
```

Sie können "abc1de1" (gierig) mit folgendem Muster erfassen:

```shell
/a.*1
```

Sie können "abc1" (nicht-gierig) mit folgendem Muster erfassen:

```shell
/a.\{-}1
```

Wenn Sie also den längsten Treffer (gierig) in Großbuchstaben umwandeln müssen, führen Sie aus:

```shell
:s/a.*1/\U&/g
```

Um zu erhalten:

```shell
ABC1DEFG1
```

Wenn Sie den kürzesten Treffer (nicht-gierig) in Großbuchstaben umwandeln müssen, führen Sie aus:

```shell
:s/a.\{-}1/\U&/g
```

Um zu erhalten:

```shell
ABC1defg1
```

Wenn Sie neu im Konzept von gierig vs. nicht-gierig sind, kann es schwierig sein, es zu verstehen. Experimentieren Sie mit verschiedenen Kombinationen, bis Sie es verstehen.

## Ersetzen über mehrere Dateien

Lernen wir schließlich, wie man Phrasen über mehrere Dateien ersetzt. Für diesen Abschnitt nehmen wir an, dass Sie zwei Dateien haben: `food.txt` und `animal.txt`.

In `food.txt`:

```shell
corndog
hotdog
chilidog
```

In `animal.txt`:

```shell
large dog
medium dog
small dog
```

Nehmen Sie an, Ihre Verzeichnisstruktur sieht so aus:

```shell
- food.txt
- animal.txt
```

Zuerst erfassen Sie sowohl `food.txt` als auch `animal.txt` in `:args`. Erinnern Sie sich aus früheren Kapiteln, dass `:args` verwendet werden kann, um eine Liste von Dateinamen zu erstellen. Es gibt mehrere Möglichkeiten, dies innerhalb von Vim zu tun, eine davon ist, dies von innerhalb von Vim auszuführen:

```shell
:args *.txt                  erfasst alle txt-Dateien im aktuellen Verzeichnis
```

Um es zu testen, wenn Sie `:args` ausführen, sollten Sie sehen:

```shell
[food.txt] animal.txt
```

Jetzt, da alle relevanten Dateien in der Argumentliste gespeichert sind, können Sie eine Mehrfachdatei-Ersetzung mit dem Befehl `:argdo` durchführen. Führen Sie aus:

```shell
:argdo %s/dog/chicken/
```

Dies führt die Ersetzung für alle Dateien in der `:args`-Liste durch. Schließlich speichern Sie die geänderten Dateien mit:

```shell
:argdo update
```

`:args` und `:argdo` sind nützliche Werkzeuge, um Befehlszeilenbefehle über mehrere Dateien anzuwenden. Probieren Sie es mit anderen Befehlen aus!

## Ersetzen über mehrere Dateien mit Makros

Alternativ können Sie auch den Ersetzungsbefehl über mehrere Dateien mit Makros ausführen. Führen Sie aus:

```shell
:args *.txt
qq
:%s/dog/chicken/g
:wnext
q
99@q
```

Die Aufschlüsselung:
- `:args *.txt` fügt alle Textdateien in die `:args`-Liste ein.
- `qq` startet das Makro im "q"-Register.
- `:%s/dog/chicken/g` ersetzt "dog" durch "chicken" in allen Zeilen der aktuellen Datei.
- `:wnext` speichert die Datei und wechselt zur nächsten Datei in der `args`-Liste.
- `q` stoppt die Makroaufzeichnung.
- `99@q` führt das Makro neunundneunzig Mal aus. Vim stoppt die Makroausführung, nachdem es den ersten Fehler gefunden hat, sodass Vim das Makro tatsächlich nicht neunundneunzig Mal ausführt.

## Lernen Sie die Suche und Ersetzung auf die smarte Art

Die Fähigkeit, gut zu suchen, ist eine notwendige Fähigkeit beim Bearbeiten. Das Beherrschen der Suche ermöglicht es Ihnen, die Flexibilität regulärer Ausdrücke zu nutzen, um nach jedem Muster in einer Datei zu suchen. Nehmen Sie sich Zeit, um diese zu lernen. Um besser mit regulären Ausdrücken zu werden, müssen Sie aktiv reguläre Ausdrücke verwenden. Ich habe einmal ein Buch über reguläre Ausdrücke gelesen, ohne es tatsächlich zu tun, und ich habe fast alles vergessen, was ich danach gelesen habe. Aktives Programmieren ist der beste Weg, um jede Fähigkeit zu meistern.

Ein guter Weg, Ihre Mustererkennung zu verbessern, besteht darin, wann immer Sie nach einem Muster suchen müssen (wie "hello 123"), anstatt nach dem wörtlichen Suchbegriff (`/hello 123`) zu fragen, versuchen Sie, ein Muster dafür zu entwickeln (etwas wie `/\v(\l+) (\d+)`). Viele dieser Konzepte regulärer Ausdrücke sind auch in der allgemeinen Programmierung anwendbar, nicht nur bei der Verwendung von Vim.

Jetzt, da Sie über erweiterte Suche und Ersetzung in Vim gelernt haben, lassen Sie uns einen der vielseitigsten Befehle lernen, den globalen Befehl.