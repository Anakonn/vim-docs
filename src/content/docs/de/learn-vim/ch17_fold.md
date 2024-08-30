---
description: In diesem Kapitel lernen Sie, wie Sie in Vim Falten verwenden, um irrelevante
  Texte zu verbergen und die Lesbarkeit von Dateien zu verbessern.
title: Ch17. Fold
---

Wenn Sie eine Datei lesen, gibt es oft viele irrelevante Texte, die es Ihnen erschweren, zu verstehen, was diese Datei tut. Um den unnötigen Lärm zu verbergen, verwenden Sie Vim-Faltung.

In diesem Kapitel lernen Sie verschiedene Möglichkeiten, eine Datei zu falten.

## Manuelle Faltung

Stellen Sie sich vor, Sie falten ein Blatt Papier, um einen Text zu verdecken. Der eigentliche Text verschwindet nicht, er ist immer noch da. Vim-Faltung funktioniert auf die gleiche Weise. Es faltet einen Textbereich und verbirgt ihn vor der Anzeige, ohne ihn tatsächlich zu löschen.

Der Faltungsoperator ist `z` (wenn ein Papier gefaltet ist, hat es die Form des Buchstabens z).

Angenommen, Sie haben diesen Text:

```shell
Falte mich
Halte mich
```

Mit dem Cursor in der ersten Zeile, tippen Sie `zfj`. Vim faltet beide Zeilen in eine. Sie sollten etwas sehen wie:

```shell
+-- 2 Zeilen: Falte mich -----
```

Hier ist die Aufschlüsselung:
- `zf` ist der Faltungsoperator.
- `j` ist die Bewegung für den Faltungsoperator.

Sie können einen gefalteten Text mit `zo` öffnen. Um die Faltung zu schließen, verwenden Sie `zc`.

Faltung ist ein Operator, daher folgt es der Grammatikregel (`Verb + Substantiv`). Sie können den Faltungsoperator mit einer Bewegung oder einem Textelement übergeben. Um einen inneren Absatz zu falten, führen Sie `zfip` aus. Um bis zum Ende einer Datei zu falten, führen Sie `zfG` aus. Um die Texte zwischen `{` und `}` zu falten, führen Sie `zfa{` aus.

Sie können aus dem visuellen Modus falten. Markieren Sie den Bereich, den Sie falten möchten (`v`, `V` oder `Ctrl-v`), und führen Sie dann `zf` aus.

Sie können eine Faltung im Befehlszeilenmodus mit dem Befehl `:fold` ausführen. Um die aktuelle Zeile und die folgende Zeile zu falten, führen Sie aus:

```shell
:,+1fold
```

`,+1` ist der Bereich. Wenn Sie keine Parameter für den Bereich übergeben, wird standardmäßig die aktuelle Zeile verwendet. `+1` ist der Bereichsindikator für die nächste Zeile. Um die Zeilen 5 bis 10 zu falten, führen Sie `:5,10fold` aus. Um von der aktuellen Position bis zum Ende der Zeile zu falten, führen Sie `:,$fold` aus.

Es gibt viele andere Faltungs- und Entfaltungskommandos. Ich finde, es sind zu viele, um sie sich beim Einstieg zu merken. Die nützlichsten sind:
- `zR`, um alle Faltungen zu öffnen.
- `zM`, um alle Faltungen zu schließen.
- `za`, um eine Faltung umzuschalten.

Sie können `zR` und `zM` in jeder Zeile ausführen, aber `za` funktioniert nur, wenn Sie sich auf einer gefalteten / entfalteten Zeile befinden. Um mehr über Faltungsbefehle zu erfahren, schauen Sie sich `:h fold-commands` an.

## Verschiedene Faltmethoden

Der obige Abschnitt behandelt die manuelle Faltung von Vim. Es gibt sechs verschiedene Faltmethoden in Vim:
1. Manuell
2. Einrückung
3. Ausdruck
4. Syntax
5. Diff
6. Marker

Um zu sehen, welche Faltmethode Sie derzeit verwenden, führen Sie `:set foldmethod?` aus. Standardmäßig verwendet Vim die Methode `manual`.

Im Rest des Kapitels lernen Sie die anderen fünf Faltmethoden kennen. Lassen Sie uns mit der Einrückungsfaltung beginnen.

## Einrückungsfaltung

Um eine Einrückungsfaltung zu verwenden, ändern Sie die `'foldmethod'` auf Einrückung:

```shell
:set foldmethod=indent
```

Angenommen, Sie haben den Text:

```shell
Eins
  Zwei
  Zwei erneut
```

Wenn Sie `:set foldmethod=indent` ausführen, sehen Sie:

```shell
Eins
+-- 2 Zeilen: Zwei -----
```

Bei der Einrückungsfaltung betrachtet Vim, wie viele Leerzeichen jede Zeile am Anfang hat, und vergleicht dies mit der Option `'shiftwidth'`, um ihre Faltbarkeit zu bestimmen. `'shiftwidth'` gibt die Anzahl der Leerzeichen zurück, die für jeden Schritt der Einrückung erforderlich sind. Wenn Sie ausführen:

```shell
:set shiftwidth?
```

Vims Standardwert für `'shiftwidth'` ist 2. Im obigen Text gibt es zwei Leerzeichen zwischen dem Zeilenanfang und dem Text "Zwei" und "Zwei erneut". Wenn Vim die Anzahl der Leerzeichen sieht und der Wert von `'shiftwidth'` 2 ist, betrachtet Vim diese Zeile als eine Einrückungsfaltungsebene von eins.

Angenommen, diesmal haben Sie nur ein Leerzeichen zwischen dem Zeilenanfang und dem Text:

```shell
Eins
 Zwei
 Zwei erneut
```

Wenn Sie jetzt `:set foldmethod=indent` ausführen, faltet Vim die eingerückte Zeile nicht, da nicht genügend Platz in jeder Zeile vorhanden ist. Ein Leerzeichen wird nicht als Einrückung betrachtet. Wenn Sie jedoch `'shiftwidth'` auf 1 ändern:

```shell
:set shiftwidth=1
```

Ist der Text jetzt faltbar. Es wird jetzt als Einrückung betrachtet.

Stellen Sie den `shiftwidth` wieder auf 2 und die Leerzeichen zwischen den Texten wieder auf zwei zurück. Fügen Sie außerdem zwei zusätzliche Texte hinzu:

```shell
Eins
  Zwei
  Zwei erneut
    Drei
    Drei erneut
```

Führen Sie die Faltung aus (`zM`), Sie werden sehen:

```shell
Eins
+-- 4 Zeilen: Zwei -----
```

Entfalten Sie die gefalteten Zeilen (`zR`), setzen Sie dann den Cursor auf "Drei" und schalten Sie den Faltungszustand des Textes um (`za`):

```shell
Eins
  Zwei
  Zwei erneut
+-- 2 Zeilen: Drei -----
```

Was ist das? Eine Faltung innerhalb einer Faltung?

Verschachtelte Faltungen sind gültig. Der Text "Zwei" und "Zwei erneut" haben eine Faltungsebene von eins. Der Text "Drei" und "Drei erneut" haben eine Faltungsebene von zwei. Wenn Sie einen faltbaren Text mit einer höheren Faltungsebene innerhalb eines faltbaren Textes haben, haben Sie mehrere Faltungsschichten.

## Ausdrucksfaltung

Die Ausdrucksfaltung ermöglicht es Ihnen, einen Ausdruck zu definieren, nach dem für eine Faltung gesucht wird. Nachdem Sie die Falt-Ausdrücke definiert haben, durchsucht Vim jede Zeile nach dem Wert von `'foldexpr'`. Dies ist die Variable, die Sie konfigurieren müssen, um den entsprechenden Wert zurückzugeben. Wenn `'foldexpr'` 0 zurückgibt, wird die Zeile nicht gefaltet. Wenn es 1 zurückgibt, hat diese Zeile eine Faltungsebene von 1. Wenn es 2 zurückgibt, hat diese Zeile eine Faltungsebene von 2. Es gibt mehr Werte als ganze Zahlen, aber ich werde nicht darauf eingehen. Wenn Sie neugierig sind, schauen Sie sich `:h fold-expr` an.

Zuerst ändern wir die Faltmethode:

```shell
:set foldmethod=expr
```

Angenommen, Sie haben eine Liste von Frühstückslebensmitteln und möchten alle Frühstücksartikel, die mit "p" beginnen, falten:

```shell
Donut
Pfannkuchen
Pop-Tarts
Proteinriegel
Lachs
Rührei
```

Ändern Sie als Nächstes `foldexpr`, um die Ausdrücke zu erfassen, die mit "p" beginnen:

```shell
:set foldexpr=getline(v:lnum)[0]==\\"p\\"
```

Der obige Ausdruck sieht kompliziert aus. Lassen Sie uns das aufschlüsseln:
- `:set foldexpr` richtet die Option `'foldexpr'` ein, um einen benutzerdefinierten Ausdruck zu akzeptieren.
- `getline()` ist eine Vimscript-Funktion, die den Inhalt einer beliebigen gegebenen Zeile zurückgibt. Wenn Sie `:echo getline(5)` ausführen, gibt es den Inhalt der Zeile 5 zurück.
- `v:lnum` ist Vims spezielle Variable für den Ausdruck `'foldexpr'`. Vim durchsucht jede Zeile und speichert in diesem Moment die Nummer jeder Zeile in der Variable `v:lnum`. In Zeile 5 hat `v:lnum` den Wert 5. In Zeile 10 hat `v:lnum` den Wert 10.
- `[0]` im Kontext von `getline(v:lnum)[0]` ist das erste Zeichen jeder Zeile. Wenn Vim eine Zeile durchsucht, gibt `getline(v:lnum)` den Inhalt jeder Zeile zurück. `getline(v:lnum)[0]` gibt das erste Zeichen jeder Zeile zurück. In der ersten Zeile unserer Liste, "Donut", gibt `getline(v:lnum)[0]` "d" zurück. In der zweiten Zeile unserer Liste, "Pfannkuchen", gibt `getline(v:lnum)[0]` "p" zurück.
- `==\\"p\\"` ist die zweite Hälfte des Gleichheitsausdrucks. Es überprüft, ob der gerade bewertete Ausdruck gleich "p" ist. Wenn dies wahr ist, gibt es 1 zurück. Wenn es falsch ist, gibt es 0 zurück. In Vim ist 1 wahr und 0 falsch. Also gibt es in den Zeilen, die mit einem "p" beginnen, 1 zurück. Denken Sie daran, wenn ein `'foldexpr'` den Wert 1 hat, hat es eine Faltungsebene von 1.

Nachdem Sie diesen Ausdruck ausgeführt haben, sollten Sie sehen:

```shell
Donut
+-- 3 Zeilen: Pfannkuchen -----
Lachs
Rührei
```

## Syntaxfaltung

Die Syntaxfaltung wird durch die Syntax-Hervorhebung der Sprache bestimmt. Wenn Sie ein Sprachsyntax-Plugin wie [vim-polyglot](https://github.com/sheerun/vim-polyglot) verwenden, funktioniert die Syntaxfaltung sofort. Ändern Sie einfach die Faltmethode auf Syntax:

```shell
:set foldmethod=syntax
```

Angenommen, Sie bearbeiten eine JavaScript-Datei und haben vim-polyglot installiert. Wenn Sie ein Array wie das folgende haben:

```shell
const nums = [
  eins,
  zwei,
  drei,
  vier
]
```

Wird es mit einer Syntaxfaltung gefaltet. Wenn Sie eine Syntaxhervorhebung für eine bestimmte Sprache definieren (typischerweise im Verzeichnis `syntax/`), können Sie ein `fold`-Attribut hinzufügen, um es faltbar zu machen. Unten ist ein Ausschnitt aus der JavaScript-Syntaxdatei von vim-polyglot. Beachten Sie das `fold`-Schlüsselwort am Ende.

```shell
syntax region  jsBracket                      matchgroup=jsBrackets            start=/\[/ end=/\]/ contains=@jsExpression,jsSpreadExpression extend fold
```

Dieser Leitfaden behandelt nicht die `syntax`-Funktion. Wenn Sie neugierig sind, schauen Sie sich `:h syntax.txt` an.

## Diff-Faltung

Vim kann ein Diff-Verfahren durchführen, um zwei oder mehr Dateien zu vergleichen.

Wenn Sie `file1.txt` haben:

```shell
vim ist großartig
vim ist großartig
vim ist großartig
vim ist großartig
vim ist großartig
vim ist großartig
vim ist großartig
vim ist großartig
vim ist großartig
vim ist großartig
```

Und `file2.txt`:

```shell
vim ist großartig
vim ist großartig
vim ist großartig
vim ist großartig
vim ist großartig
vim ist großartig
vim ist großartig
vim ist großartig
emacs ist ok
```

Führen Sie `vimdiff file1.txt file2.txt` aus:

```shell
+-- 3 Zeilen: vim ist großartig -----
vim ist großartig
vim ist großartig
vim ist großartig
vim ist großartig
vim ist großartig
vim ist großartig
[vim ist großartig] / [emacs ist ok]
```

Vim faltet automatisch einige der identischen Zeilen. Wenn Sie den Befehl `vimdiff` ausführen, verwendet Vim automatisch `foldmethod=diff`. Wenn Sie `:set foldmethod?` ausführen, wird `diff` zurückgegeben.

## Markerfaltung

Um eine Markerfaltung zu verwenden, führen Sie aus:

```shell
:set foldmethod=marker
```

Angenommen, Sie haben den Text:

```shell
Hallo

{{{
Welt
Vim
}}}
```

Führen Sie `zM` aus, Sie werden sehen:

```shell
Hallo

+-- 4 Zeilen: -----
```

Vim sieht `{{{` und `}}}` als Faltindikatoren und faltet die Texte dazwischen. Bei der Markerfaltung sucht Vim nach speziellen Markierungen, die durch die Option `'foldmarker'` definiert sind, um Faltungsbereiche zu kennzeichnen. Um zu sehen, welche Marker Vim verwendet, führen Sie aus:

```shell
:set foldmarker?
```

Standardmäßig verwendet Vim `{{{` und `}}}` als Indikatoren. Wenn Sie den Indikator auf andere Texte ändern möchten, wie "coffee1" und "coffee2":

```shell
:set foldmarker=coffee1,coffee2
```

Wenn Sie den Text haben:

```shell
Hallo

coffee1
Welt
Vim
coffee2
```

Verwendet Vim jetzt `coffee1` und `coffee2` als neue Faltungsmarker. Als Randnotiz muss ein Indikator ein Literalstring sein und kann kein Regex sein.

## Faltung speichern

Sie verlieren alle Faltinformationen, wenn Sie die Vim-Sitzung schließen. Wenn Sie diese Datei `count.txt` haben:

```shell
eins
zwei
drei
vier
fünf
```

Führen Sie dann eine manuelle Faltung von der Zeile "drei" nach unten aus (`:3,$fold`):

```shell
eins
zwei
+-- 3 Zeilen: drei ---
```

Wenn Sie Vim verlassen und `count.txt` erneut öffnen, sind die Faltungen nicht mehr vorhanden!

Um die Faltungen zu erhalten, führen Sie nach dem Falten aus:

```shell
:mkview
```

Wenn Sie dann `count.txt` öffnen, führen Sie aus:

```shell
:loadview
```

Ihre Faltungen werden wiederhergestellt. Sie müssen jedoch `mkview` und `loadview` manuell ausführen. Ich weiß, dass ich eines Tages vergessen werde, `mkview` vor dem Schließen der Datei auszuführen, und ich werde alle Faltungen verlieren. Wie können wir diesen Prozess automatisieren?

Um `mkview` automatisch auszuführen, wenn Sie eine `.txt`-Datei schließen, und `loadview`, wenn Sie eine `.txt`-Datei öffnen, fügen Sie dies in Ihre vimrc ein:

```shell
autocmd BufWinLeave *.txt mkview
autocmd BufWinEnter *.txt silent loadview
```

Denken Sie daran, dass `autocmd` verwendet wird, um einen Befehl bei einem Ereignis auszuführen. Die beiden Ereignisse hier sind:
- `BufWinLeave`, wenn Sie einen Puffer aus einem Fenster entfernen.
- `BufWinEnter`, wenn Sie einen Puffer in ein Fenster laden.

Jetzt, nachdem Sie innerhalb einer `.txt`-Datei gefaltet haben und Vim verlassen, wird beim nächsten Öffnen dieser Datei Ihre Faltungsinformation wiederhergestellt.

Standardmäßig speichert Vim die Faltinformationen, wenn `mkview` innerhalb von `~/.vim/view` für das Unix-System ausgeführt wird. Für weitere Informationen siehe `:h 'viewdir'`.
## Lernen Sie Falten auf die smarte Art

Als ich zum ersten Mal mit Vim anfing, vernachlässigte ich das Lernen von Falten, weil ich dachte, es sei nicht nützlich. Je länger ich jedoch programmiere, desto nützlicher finde ich das Falten. Strategisch platzierte Falten können Ihnen einen besseren Überblick über die Textstruktur geben, ähnlich wie das Inhaltsverzeichnis eines Buches.

Wenn Sie das Falten lernen, beginnen Sie mit der manuellen Faltung, da diese unterwegs verwendet werden kann. Lernen Sie dann nach und nach verschiedene Tricks für Einrückungs- und Markierungsfalten. Schließlich lernen Sie, wie man Syntax- und Ausdrucksfalten erstellt. Sie können sogar die letzten beiden verwenden, um Ihre eigenen Vim-Plugins zu schreiben.