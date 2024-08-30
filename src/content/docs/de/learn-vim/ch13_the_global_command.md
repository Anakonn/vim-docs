---
description: In diesem Kapitel lernen Sie, wie Sie mit dem globalen Befehl in Vim
  mehrere Zeilen gleichzeitig bearbeiten können. Entdecken Sie die Syntax und Anwendung.
title: Ch13. the Global Command
---

Bisher haben Sie gelernt, wie man die letzte Änderung mit dem Punktbefehl (`.`) wiederholt, Aktionen mit Makros (`q`) abspielt und Texte in den Registern (`"`) speichert.

In diesem Kapitel lernen Sie, wie man einen Befehl aus der Befehlszeile mit dem globalen Befehl wiederholt.

## Übersicht über den Globalen Befehl

Der globale Befehl von Vim wird verwendet, um einen Befehl aus der Befehlszeile gleichzeitig auf mehreren Zeilen auszuführen.

Übrigens haben Sie vielleicht schon einmal den Begriff "Ex-Befehle" gehört. In diesem Leitfaden bezeichne ich sie als Befehle aus der Befehlszeile. Sowohl Ex-Befehle als auch Befehle aus der Befehlszeile sind dasselbe. Es sind die Befehle, die mit einem Doppelpunkt (`:`) beginnen. Der Ersetzungsbefehl im letzten Kapitel war ein Beispiel für einen Ex-Befehl. Sie werden Ex genannt, weil sie ursprünglich aus dem Ex-Texteditor stammen. Ich werde sie in diesem Leitfaden weiterhin als Befehle aus der Befehlszeile bezeichnen. Für eine vollständige Liste der Ex-Befehle schauen Sie sich `:h ex-cmd-index` an.

Der globale Befehl hat die folgende Syntax:

```shell
:g/pattern/command
```

Das `pattern` entspricht allen Zeilen, die dieses Muster enthalten, ähnlich dem Muster im Ersetzungsbefehl. Der `command` kann jeder Befehl aus der Befehlszeile sein. Der globale Befehl funktioniert, indem er den `command` gegen jede Zeile ausführt, die dem `pattern` entspricht.

Wenn Sie die folgenden Ausdrücke haben:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Um alle Zeilen zu entfernen, die "console" enthalten, können Sie Folgendes ausführen:

```shell
:g/console/d
```

Ergebnis:

```shell
const one = 1;

const two = 2;

const three = 3;
```

Der globale Befehl führt den Löschbefehl (`d`) auf allen Zeilen aus, die dem "console"-Muster entsprechen.

Beim Ausführen des `g`-Befehls scannt Vim die Datei zweimal. Beim ersten Durchlauf scannt es jede Zeile und markiert die Zeile, die dem `/console/`-Muster entspricht. Sobald alle übereinstimmenden Zeilen markiert sind, wird ein zweiter Durchlauf durchgeführt und der `d`-Befehl auf den markierten Zeilen ausgeführt.

Wenn Sie stattdessen alle Zeilen löschen möchten, die "const" enthalten, führen Sie Folgendes aus:

```shell
:g/const/d
```

Ergebnis:

```shell
console.log("one: ", one);

console.log("two: ", two);

console.log("three: ", three);
```

## Inverses Muster

Um den globalen Befehl auf nicht übereinstimmende Zeilen auszuführen, können Sie Folgendes ausführen:

```shell
:g!/pattern/command
```

oder

```shell
:v/pattern/command
```

Wenn Sie `:v/console/d` ausführen, werden alle Zeilen gelöscht, die *nicht* "console" enthalten.

## Muster

Der globale Befehl verwendet dasselbe Mustersystem wie der Ersetzungsbefehl, sodass dieser Abschnitt als Auffrischung dient. Fühlen Sie sich frei, zum nächsten Abschnitt zu springen oder weiterzulesen!

Wenn Sie diese Ausdrücke haben:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Um die Zeilen zu löschen, die entweder "one" oder "two" enthalten, führen Sie Folgendes aus:

```shell
:g/one\|two/d
```

Um die Zeilen zu löschen, die eine einzelne Ziffer enthalten, führen Sie entweder Folgendes aus:

```shell
:g/[0-9]/d
```

oder

```shell
:g/\d/d
```

Wenn Sie den Ausdruck haben:

```shell
const oneMillion = 1000000;
const oneThousand = 1000;
const one = 1;
```

Um die Zeilen zu finden, die zwischen drei und sechs Nullen enthalten, führen Sie Folgendes aus:

```shell
:g/0\{3,6\}/d
```

## Bereich übergeben

Sie können einen Bereich vor dem `g`-Befehl übergeben. Hier sind einige Möglichkeiten, wie Sie dies tun können:
- `:1,5g/console/d`  entspricht der Zeichenfolge "console" zwischen den Zeilen 1 und 5 und löscht sie.
- `:,5g/console/d` wenn vor dem Komma keine Adresse angegeben ist, beginnt es von der aktuellen Zeile. Es sucht nach der Zeichenfolge "console" zwischen der aktuellen Zeile und Zeile 5 und löscht sie.
- `:3,g/console/d` wenn nach dem Komma keine Adresse angegeben ist, endet es an der aktuellen Zeile. Es sucht nach der Zeichenfolge "console" zwischen Zeile 3 und der aktuellen Zeile und löscht sie.
- `:3g/console/d` wenn Sie nur eine Adresse ohne Komma übergeben, wird der Befehl nur auf Zeile 3 ausgeführt. Es sucht in Zeile 3 und löscht sie, wenn sie die Zeichenfolge "console" enthält.

Neben Zahlen können Sie auch diese Symbole als Bereich verwenden:
- `.` bedeutet die aktuelle Zeile. Ein Bereich von `.,3` bedeutet zwischen der aktuellen Zeile und Zeile 3.
- `$` bedeutet die letzte Zeile in der Datei. Der Bereich `3,$` bedeutet zwischen Zeile 3 und der letzten Zeile.
- `+n` bedeutet n Zeilen nach der aktuellen Zeile. Sie können es mit `.` oder ohne verwenden. `3,+1` oder `3,.+1` bedeutet zwischen Zeile 3 und der Zeile nach der aktuellen Zeile.

Wenn Sie keinen Bereich angeben, betrifft es standardmäßig die gesamte Datei. Dies ist tatsächlich nicht die Norm. Die meisten Befehle aus der Befehlszeile von Vim werden nur auf die aktuelle Zeile ausgeführt, wenn Sie keinen Bereich angeben. Die beiden bemerkenswerten Ausnahmen sind die globalen (`:g`) und die Speicherbefehle (`:w`).

## Normalbefehl

Sie können einen Normalbefehl mit dem globalen Befehl mit dem Befehl `:normal` aus der Befehlszeile ausführen.

Wenn Sie diesen Text haben:
```shell
const one = 1
console.log("one: ", one)

const two = 2
console.log("two: ", two)

const three = 3
console.log("three: ", three)
```

Um ein ";" am Ende jeder Zeile hinzuzufügen, führen Sie Folgendes aus:

```shell
:g/./normal A;
```

Lassen Sie uns das aufschlüsseln:
- `:g` ist der globale Befehl.
- `/./` ist ein Muster für "nicht leere Zeilen". Es entspricht den Zeilen mit mindestens einem Zeichen, sodass es den Zeilen mit "const" und "console" entspricht und leere Zeilen nicht entspricht.
- `normal A;` führt den Befehl `:normal` aus der Befehlszeile aus. `A;` ist der Normalmodusbefehl, um ein ";" am Ende der Zeile einzufügen.

## Ausführen eines Makros

Sie können auch ein Makro mit dem globalen Befehl ausführen. Ein Makro kann mit dem `normal`-Befehl ausgeführt werden. Wenn Sie die Ausdrücke haben:

```shell
const one = 1
console.log("one: ", one);

const two = 2
console.log("two: ", two);

const three = 3
console.log("three: ", three);
```

Beachten Sie, dass die Zeilen mit "const" keine Semikolons haben. Lassen Sie uns ein Makro erstellen, um ein Semikolon am Ende dieser Zeilen im Register a hinzuzufügen:

```shell
qaA;<Esc>q
```

Wenn Sie eine Auffrischung benötigen, schauen Sie sich das Kapitel über Makros an. Führen Sie nun Folgendes aus:

```shell
:g/const/normal @a
```

Jetzt haben alle Zeilen mit "const" ein ";" am Ende.

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Wenn Sie diesen Schritt für Schritt befolgt haben, haben Sie zwei Semikolons in der ersten Zeile. Um dies zu vermeiden, führen Sie den globalen Befehl ab Zeile zwei aus: `:2,$g/const/normal @a`.

## Rekursiver Globaler Befehl

Der globale Befehl selbst ist eine Art Befehl aus der Befehlszeile, sodass Sie technisch den globalen Befehl innerhalb eines globalen Befehls ausführen können.

Gegeben die folgenden Ausdrücke, wenn Sie die zweite `console.log`-Anweisung löschen möchten:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Wenn Sie Folgendes ausführen:

```shell
:g/console/g/two/d
```

Zuerst sucht `g` nach den Zeilen, die das Muster "console" enthalten und findet 3 Übereinstimmungen. Dann sucht der zweite `g` nach der Zeile, die das Muster "two" aus diesen drei Übereinstimmungen enthält. Schließlich wird diese Übereinstimmung gelöscht.

Sie können `g` auch mit `v` kombinieren, um positive und negative Muster zu finden. Zum Beispiel:

```shell
:g/console/v/two/d
```

Anstatt nach der Zeile zu suchen, die das Muster "two" enthält, sucht es nach den Zeilen, die *nicht* das Muster "two" enthalten.

## Ändern des Trennzeichens

Sie können das Trennzeichen des globalen Befehls wie beim Ersetzungsbefehl ändern. Die Regeln sind dieselben: Sie können jedes einzelne Byte-Zeichen verwenden, außer Buchstaben, Zahlen, `"`, `|` und `\`.

Um die Zeilen zu löschen, die "console" enthalten:

```shell
:g@console@d
```

Wenn Sie den Ersetzungsbefehl mit dem globalen Befehl verwenden, können Sie zwei verschiedene Trennzeichen haben:

```shell
g@one@s+const+let+g
```

Hier sucht der globale Befehl nach allen Zeilen, die "one" enthalten. Der Ersetzungsbefehl ersetzt aus diesen Übereinstimmungen die Zeichenfolge "const" durch "let".

## Der Standardbefehl

Was passiert, wenn Sie keinen Befehl aus der Befehlszeile im globalen Befehl angeben?

Der globale Befehl verwendet den Druckbefehl (`:p`), um den Text der aktuellen Zeile auszugeben. Wenn Sie Folgendes ausführen:

```shell
:g/console
```

Wird am unteren Bildschirmrand alle Zeilen ausgegeben, die "console" enthalten.

Übrigens, hier ist eine interessante Tatsache. Da der Standardbefehl, der vom globalen Befehl verwendet wird, `p` ist, macht dies die `g`-Syntax zu:

```shell
:g/re/p
```

- `g` = der globale Befehl
- `re` = das Regex-Muster
- `p` = der Druckbefehl

Es buchstabiert *"grep"*, dasselbe `grep` aus der Befehlszeile. Dies ist **kein** Zufall. Der Befehl `g/re/p` stammt ursprünglich vom Ed-Editor, einem der ursprünglichen Zeilen-Texteditoren. Der Befehl `grep` hat seinen Namen von Ed.

Ihr Computer hat wahrscheinlich immer noch den Ed-Editor. Führen Sie `ed` aus dem Terminal aus (Hinweis: Um zu beenden, geben Sie `q` ein).

## Umkehren des gesamten Puffers

Um die gesamte Datei umzukehren, führen Sie Folgendes aus:

```shell
:g/^/m 0
```

`^` ist ein Muster für den Anfang einer Zeile. Verwenden Sie `^`, um alle Zeilen zu entsprechen, einschließlich leerer Zeilen.

Wenn Sie nur einige Zeilen umkehren möchten, übergeben Sie einen Bereich. Um die Zeilen zwischen Zeile fünf und Zeile zehn umzukehren, führen Sie Folgendes aus:

```shell
:5,10g/^/m 0
```

Um mehr über den Verschiebebefehl zu erfahren, schauen Sie sich `:h :move` an.

## Aggregieren aller Todos

Beim Programmieren schreibe ich manchmal TODOs in die Datei, die ich bearbeite:

```shell
const one = 1;
console.log("one: ", one);
// TODO: den Welpen füttern

const two = 2;
// TODO: den Welpen automatisch füttern
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: ein Startup gründen, das einen automatischen Welpenfütterer verkauft
```

Es kann schwierig sein, den Überblick über alle erstellten TODOs zu behalten. Vim hat eine `:t` (kopieren) Methode, um alle Übereinstimmungen an eine Adresse zu kopieren. Um mehr über die Kopiermethode zu erfahren, schauen Sie sich `:h :copy` an.

Um alle TODOs ans Ende der Datei zu kopieren, um eine einfachere Einsicht zu erhalten, führen Sie Folgendes aus:

```shell
:g/TODO/t $
```

Ergebnis:

```shell
const one = 1;
console.log("one: ", one);
// TODO: den Welpen füttern

const two = 2;
// TODO: den Welpen automatisch füttern
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: ein Startup gründen, das einen automatischen Welpenfütterer verkauft

// TODO: den Welpen füttern
// TODO: den Welpen automatisch füttern
// TODO: ein Startup gründen, das einen automatischen Welpenfütterer verkauft
```

Jetzt kann ich alle TODOs, die ich erstellt habe, überprüfen, einen Zeitpunkt finden, um sie zu erledigen oder sie jemand anderem zu delegieren und mit meiner nächsten Aufgabe fortfahren.

Wenn Sie stattdessen alle TODOs ans Ende verschieben möchten, verwenden Sie den Verschiebebefehl, `:m`:

```shell
:g/TODO/m $
```

Ergebnis:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);

// TODO: den Welpen füttern
// TODO: den Welpen automatisch füttern
// TODO: ein Startup gründen, das einen automatischen Welpenfütterer verkauft
```

## Schwarzes Loch Löschen

Erinnern Sie sich aus dem Kapitel über Register, dass gelöschte Texte in den nummerierten Registern gespeichert werden (vorausgesetzt, sie sind groß genug). Jedes Mal, wenn Sie `:g/console/d` ausführen, speichert Vim die gelöschten Zeilen in den nummerierten Registern. Wenn Sie viele Zeilen löschen, können Sie schnell alle nummerierten Register füllen. Um dies zu vermeiden, können Sie immer das schwarze Loch-Register (`"_`) verwenden, um *nicht* Ihre gelöschten Zeilen in den Registern zu speichern. Führen Sie Folgendes aus:

```shell
:g/console/d_
```

Indem Sie `_` nach `d` übergeben, wird Vim Ihre Scratch-Register nicht verwenden.
## Mehrere Leerzeilen auf eine Leerzeile reduzieren

Wenn Sie einen Text mit mehreren Leerzeilen haben:

```shell
const one = 1;
console.log("one: ", one);


const two = 2;
console.log("two: ", two);





const three = 3;
console.log("three: ", three);
```

Sie können die Leerzeilen schnell auf eine Leerzeile reduzieren mit:

```shell
:g/^$/,/./-1j
```

Ergebnis:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Normalerweise akzeptiert der globale Befehl die folgende Form: `:g/pattern/command`. Sie können den globalen Befehl jedoch auch mit der folgenden Form ausführen: `:g/pattern1/,/pattern2/command`. Damit wendet Vim den `command` innerhalb von `pattern1` und `pattern2` an.

Mit diesem Wissen lassen Sie uns den Befehl `:g/^$/,/./-1j` gemäß `:g/pattern1/,/pattern2/command` aufschlüsseln:
- `/pattern1/` ist `/^$/`. Es steht für eine Leerzeile (eine Zeile mit null Zeichen).
- `/pattern2/` ist `/./` mit dem Modifikator `-1`. `/./` steht für eine nicht-leere Zeile (eine Zeile mit mindestens einem Zeichen). Das `-1` bedeutet die Zeile darüber.
- `command` ist `j`, der Verbindungsbefehl (`:j`). In diesem Kontext verbindet dieser globale Befehl alle angegebenen Zeilen.

Übrigens, wenn Sie mehrere Leerzeilen auf keine Zeilen reduzieren möchten, führen Sie stattdessen dies aus:

```shell
:g/^$/,/./j
```

Eine einfachere Alternative:

```shell
:g/^$/-j
```

Ihr Text ist jetzt reduziert auf:

```shell
const one = 1;
console.log("one: ", one);
const two = 2;
console.log("two: ", two);
const three = 3;
console.log("three: ", three);
```

## Erweiterte Sortierung

Vim hat einen `:sort` Befehl, um die Zeilen innerhalb eines Bereichs zu sortieren. Zum Beispiel:

```shell
d
b
a
e
c
```

Sie können sie sortieren, indem Sie `:sort` ausführen. Wenn Sie einen Bereich angeben, wird nur die Zeilen innerhalb dieses Bereichs sortiert. Zum Beispiel sortiert `:3,5sort` nur die Zeilen drei und fünf.

Wenn Sie die folgenden Ausdrücke haben:

```shell
const arrayB = [
  "i",
  "g",
  "h",
  "b",
  "f",
  "d",
  "e",
  "c",
  "a",
]

const arrayA = [
  "h",
  "b",
  "f",
  "d",
  "e",
  "a",
  "c",
]
```

Wenn Sie die Elemente innerhalb der Arrays sortieren müssen, aber nicht die Arrays selbst, können Sie dies ausführen:

```shell
:g/\[/+1,/\]/-1sort
```

Ergebnis:

```shell
const arrayB = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
]

const arrayA = [
  "a"
  "b",
  "c",
  "d",
  "e",
  "f",
  "h",
]
```

Das ist großartig! Aber der Befehl sieht kompliziert aus. Lassen Sie uns das aufschlüsseln. Dieser Befehl folgt ebenfalls der Form `:g/pattern1/,/pattern2/command`.

- `:g` ist das Muster des globalen Befehls.
- `/\[/+1` ist das erste Muster. Es entspricht einer literalen linken eckigen Klammer "[". Das `+1` bezieht sich auf die Zeile darunter.
- `/\]/-1` ist das zweite Muster. Es entspricht einer literalen rechten eckigen Klammer "]". Das `-1` bezieht sich auf die Zeile darüber.
- `/\[/+1,/\]/-1` bezieht sich dann auf alle Zeilen zwischen "[" und "]".
- `sort` ist ein Befehlszeilenbefehl zum Sortieren.

## Lernen Sie den globalen Befehl auf die smarte Weise

Der globale Befehl führt den Befehlszeilenbefehl gegen alle übereinstimmenden Zeilen aus. Damit müssen Sie einen Befehl nur einmal ausführen und Vim erledigt den Rest für Sie. Um im globalen Befehl versiert zu werden, sind zwei Dinge erforderlich: ein gutes Vokabular von Befehlszeilenbefehlen und ein Wissen über reguläre Ausdrücke. Je mehr Zeit Sie mit Vim verbringen, desto mehr Befehlszeilenbefehle werden Sie natürlich lernen. Ein Wissen über reguläre Ausdrücke erfordert einen aktivere Ansatz. Aber sobald Sie sich mit regulären Ausdrücken wohlfühlen, werden Sie vielen voraus sein.

Einige der Beispiele hier sind kompliziert. Lassen Sie sich nicht einschüchtern. Nehmen Sie sich wirklich Zeit, um sie zu verstehen. Lernen Sie, die Muster zu lesen. Geben Sie nicht auf.

Wann immer Sie mehrere Befehle ausführen müssen, halten Sie inne und sehen Sie, ob Sie den `g` Befehl verwenden können. Identifizieren Sie den besten Befehl für die Aufgabe und schreiben Sie ein Muster, um so viele Dinge wie möglich auf einmal anzusprechen.

Jetzt, da Sie wissen, wie mächtig der globale Befehl ist, lernen wir, wie man die externen Befehle verwendet, um Ihre Werkzeugarsenale zu erweitern.