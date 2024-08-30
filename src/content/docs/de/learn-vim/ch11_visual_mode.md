---
description: In diesem Kapitel lernen Sie, wie Sie den visuellen Modus in Vim nutzen,
  um Texte effizient zu markieren und zu bearbeiten. Entdecken Sie die drei Modi!
title: Ch11. Visual Mode
---

Das Hervorheben und Anwenden von Änderungen an einem Textkörper ist eine gängige Funktion in vielen Texteditoren und Textverarbeitungsprogrammen. Vim kann dies im visuellen Modus tun. In diesem Kapitel lernen Sie, wie Sie den visuellen Modus effizient nutzen, um Texte zu manipulieren.

## Die drei Arten von visuellen Modi

Vim hat drei verschiedene visuelle Modi. Sie sind:

```shell
v         Zeichenweiser visueller Modus
V         Zeilenweiser visueller Modus
Ctrl-V    Blockweiser visueller Modus
```

Wenn Sie den Text haben:

```shell
eins
zwei
drei
```

Der zeichenweise visuelle Modus arbeitet mit einzelnen Zeichen. Drücken Sie `v` auf dem ersten Zeichen. Gehen Sie dann mit `j` zur nächsten Zeile. Es hebt alle Texte von "eins" bis zu Ihrer Cursorposition hervor. Wenn Sie `gU` drücken, macht Vim die hervorgehobenen Zeichen groß.

Der zeilenweise visuelle Modus arbeitet mit Zeilen. Drücken Sie `V` und beobachten Sie, wie Vim die gesamte Zeile auswählt, auf der sich Ihr Cursor befindet. Genau wie im zeichenweisen visuellen Modus, wenn Sie `gU` ausführen, macht Vim die hervorgehobenen Zeichen groß.

Der blockweise visuelle Modus arbeitet mit Zeilen und Spalten. Er gibt Ihnen mehr Bewegungsfreiheit als die anderen beiden Modi. Wenn Sie `Ctrl-V` drücken, hebt Vim das Zeichen unter dem Cursor hervor, genau wie im zeichenweisen visuellen Modus, aber anstatt jedes Zeichen bis zum Ende der Zeile hervorzuheben, bevor es zur nächsten Zeile geht, wechselt es zur nächsten Zeile mit minimaler Hervorhebung. Versuchen Sie, sich mit `h/j/k/l` zu bewegen und beobachten Sie, wie sich der Cursor bewegt.

Unten links in Ihrem Vim-Fenster sehen Sie entweder `-- VISUAL --`, `-- VISUAL LINE --` oder `-- VISUAL BLOCK --`, um anzuzeigen, in welchem visuellen Modus Sie sich befinden.

Während Sie sich im visuellen Modus befinden, können Sie zu einem anderen visuellen Modus wechseln, indem Sie entweder `v`, `V` oder `Ctrl-V` drücken. Wenn Sie beispielsweise im zeilenweisen visuellen Modus sind und zum blockweisen visuellen Modus wechseln möchten, führen Sie `Ctrl-V` aus. Probieren Sie es aus!

Es gibt drei Möglichkeiten, den visuellen Modus zu verlassen: `<Esc>`, `Ctrl-C` und die gleiche Taste wie Ihr aktueller visueller Modus. Was letzteres bedeutet, ist, dass Sie, wenn Sie sich derzeit im zeilenweisen visuellen Modus (`V`) befinden, ihn verlassen können, indem Sie `V` erneut drücken. Wenn Sie sich im zeichenweisen visuellen Modus befinden, können Sie ihn verlassen, indem Sie `v` drücken.

Es gibt tatsächlich noch eine Möglichkeit, in den visuellen Modus zu gelangen:

```shell
gv    Gehe zum vorherigen visuellen Modus
```

Es wird den gleichen visuellen Modus auf demselben hervorgehobenen Textblock starten, wie beim letzten Mal.

## Navigation im visuellen Modus

Während Sie sich im visuellen Modus befinden, können Sie den hervorgehobenen Textblock mit Vim-Bewegungen erweitern.

Lassen Sie uns denselben Text verwenden, den Sie zuvor verwendet haben:

```shell
eins
zwei
drei
```

Lassen Sie uns diesmal von der Zeile "zwei" aus starten. Drücken Sie `v`, um in den zeichenweisen visuellen Modus zu gelangen (hier stellen die eckigen Klammern `[]` die Zeichenhervorhebungen dar):

```shell
eins
[z]wei
drei
```

Drücken Sie `j` und Vim hebt den gesamten Text von der Zeile "zwei" bis zum ersten Zeichen der Zeile "drei" hervor.

```shell
eins
[zwei
z]wei
```

Angenommen, Sie möchten von dieser Position aus auch die Zeile "eins" hinzufügen. Wenn Sie `k` drücken, wird die Hervorhebung zu Ihrem Bedauern von der Zeile "drei" entfernt.

```shell
eins
[z]wei
drei
```

Gibt es eine Möglichkeit, die visuelle Auswahl frei zu erweitern, um sich in jede gewünschte Richtung zu bewegen? Definitiv. Lassen Sie uns ein wenig zurückgehen, bis Sie die Zeilen "zwei" und "drei" hervorgehoben haben.

```shell
eins
[zwei
z]wei    <-- Cursor
```

Die visuelle Hervorhebung folgt der Cursorbewegung. Wenn Sie sie nach oben zur Zeile "eins" erweitern möchten, müssen Sie den Cursor zur Zeile "zwei" bewegen. Derzeit befindet sich der Cursor auf der Zeile "drei". Sie können die Cursorposition mit `o` oder `O` umschalten.

```shell
eins
[zwei     <-- Cursor
z]wei
```

Jetzt, wenn Sie `k` drücken, reduziert es nicht mehr die Auswahl, sondern erweitert sie nach oben.

```shell
[eins
zwei
z]wei
```

Mit `o` oder `O` im visuellen Modus springt der Cursor vom Anfang bis zum Ende des hervorgehobenen Blocks, sodass Sie den Hervorhebungsbereich erweitern können.

## Grammatik im visuellen Modus

Der visuelle Modus teilt viele Operationen mit dem normalen Modus.

Wenn Sie beispielsweise den folgenden Text haben und die ersten beiden Zeilen im visuellen Modus löschen möchten:

```shell
eins
zwei
drei
```

Heben Sie die Zeilen "eins" und "zwei" mit dem zeilenweisen visuellen Modus (`V`) hervor:

```shell
[eins
zwei]
drei
```

Das Drücken von `d` löscht die Auswahl, ähnlich wie im normalen Modus. Beachten Sie, dass die Grammatikregel aus dem normalen Modus, Verb + Nomen, nicht zutrifft. Das gleiche Verb ist immer noch da (`d`), aber es gibt kein Nomen im visuellen Modus. Die Grammatikregel im visuellen Modus ist Nomen + Verb, wobei das Nomen der hervorgehobene Text ist. Wählen Sie zuerst den Textblock aus, dann folgt der Befehl.

Im normalen Modus gibt es einige Befehle, die keine Bewegung erfordern, wie `x`, um ein einzelnes Zeichen unter dem Cursor zu löschen, und `r`, um das Zeichen unter dem Cursor zu ersetzen (`rx` ersetzt das Zeichen unter dem Cursor durch "x"). Im visuellen Modus werden diese Befehle jetzt auf den gesamten hervorgehobenen Text anstelle eines einzelnen Zeichens angewendet. Zurück zum hervorgehobenen Text:

```shell
[eins
zwei]
drei
```

Das Ausführen von `x` löscht alle hervorgehobenen Texte.

Sie können dieses Verhalten nutzen, um schnell eine Überschrift im Markdown-Text zu erstellen. Angenommen, Sie müssen den folgenden Text schnell in eine Überschrift der ersten Ebene im Markdown ("===") umwandeln:

```shell
Kapitel Eins
```

Zuerst kopieren Sie den Text mit `yy`, dann fügen Sie ihn mit `p` ein:

```shell
Kapitel Eins
Kapitel Eins
```

Gehen Sie jetzt zur zweiten Zeile und wählen Sie sie mit dem zeilenweisen visuellen Modus aus:

```shell
Kapitel Eins
[Kapitel Eins]
```

Eine Überschrift der ersten Ebene ist eine Reihe von "=" unter einem Text. Führen Sie `r=`, voila! Das erspart Ihnen das manuelle Tippen von "=".

```shell
Kapitel Eins
===========
```

Um mehr über Operatoren im visuellen Modus zu erfahren, schauen Sie sich `:h visual-operators` an.

## Visueller Modus und Befehle der Befehlszeile

Sie können selektiv Befehle der Befehlszeile auf einen hervorgehobenen Textblock anwenden. Wenn Sie diese Anweisungen haben und "const" nur in den ersten beiden Zeilen durch "let" ersetzen möchten:

```shell
const eins = "eins";
const zwei = "zwei";
const drei = "drei";
```

Heben Sie die ersten beiden Zeilen mit *irgendeinem* visuellen Modus hervor und führen Sie den Ersetzungsbefehl `:s/const/let/g` aus:

```shell
let eins = "eins";
let zwei = "zwei";
const drei = "drei";
```

Beachten Sie, dass ich gesagt habe, Sie können dies mit *irgendeinem* visuellen Modus tun. Sie müssen die gesamte Zeile nicht hervorheben, um den Befehl auf dieser Zeile auszuführen. Solange Sie mindestens ein Zeichen in jeder Zeile auswählen, wird der Befehl angewendet.

## Text in mehreren Zeilen hinzufügen

Sie können Text in mehreren Zeilen in Vim mit dem blockweisen visuellen Modus hinzufügen. Wenn Sie am Ende jeder Zeile ein Semikolon hinzufügen müssen:

```shell
const eins = "eins"
const zwei = "zwei"
const drei = "drei"
```

Mit Ihrem Cursor auf der ersten Zeile:
- Führen Sie den blockweisen visuellen Modus aus und gehen Sie zwei Zeilen nach unten (`Ctrl-V jj`).
- Heben Sie bis zum Ende der Zeile hervor (`$`).
- Fügen Sie hinzu (`A`), dann tippen Sie ";".
- Verlassen Sie den visuellen Modus (`<Esc>`).

Jetzt sollten Sie das angehängte ";" an jeder Zeile sehen. Ziemlich cool! Es gibt zwei Möglichkeiten, in den Einfügemodus vom blockweisen visuellen Modus aus zu gelangen: `A`, um den Text nach dem Cursor einzugeben, oder `I`, um den Text vor dem Cursor einzugeben. Verwechseln Sie sie nicht mit `A` (Text am Ende der Zeile anhängen) und `I` (Text vor der ersten nicht-leeren Zeile) im normalen Modus.

Alternativ können Sie auch den Befehl `:normal` verwenden, um Text in mehreren Zeilen hinzuzufügen:
- Heben Sie alle 3 Zeilen hervor (`vjj`).
- Tippen Sie `:normal! A;`.

Denken Sie daran, dass der Befehl `:normal` Befehle im normalen Modus ausführt. Sie können ihm befehlen, `A;` auszuführen, um den Text ";" am Ende der Zeile hinzuzufügen.

## Zahlen inkrementieren

Vim hat die Befehle `Ctrl-X` und `Ctrl-A`, um Zahlen zu dekrementieren und zu inkrementieren. Wenn sie mit dem visuellen Modus verwendet werden, können Sie Zahlen über mehrere Zeilen hinweg inkrementieren.

Wenn Sie diese HTML-Elemente haben:

```shell
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
```

Es ist eine schlechte Praxis, mehrere IDs mit demselben Namen zu haben, also lassen Sie uns sie inkrementieren, um sie einzigartig zu machen:
- Bewegen Sie Ihren Cursor zur "1" in der zweiten Zeile.
- Starten Sie den blockweisen visuellen Modus und gehen Sie 3 Zeilen nach unten (`Ctrl-V 3j`). Dies hebt die verbleibenden "1"s hervor. Jetzt sollten alle "1" hervorgehoben sein (außer der ersten Zeile).
- Führen Sie `g Ctrl-A` aus.

Sie sollten dieses Ergebnis sehen:

```shell
<div id="app-1"></div>
<div id="app-2"></div>
<div id="app-3"></div>
<div id="app-4"></div>
<div id="app-5"></div>
```

`g Ctrl-A` inkrementiert Zahlen über mehrere Zeilen hinweg. `Ctrl-X/Ctrl-A` kann auch Buchstaben inkrementieren, mit der Option für Zahlenformate:

```shell
set nrformats+=alpha
```

Die Option `nrformats` weist Vim an, welche Basen als "Zahlen" für `Ctrl-A` und `Ctrl-X` zum Inkrementieren und Dekrementieren betrachtet werden. Durch das Hinzufügen von `alpha` wird ein alphabetisches Zeichen jetzt als Zahl betrachtet. Wenn Sie die folgenden HTML-Elemente haben:

```shell
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
```

Setzen Sie Ihren Cursor auf das zweite "app-a". Verwenden Sie dieselbe Technik wie oben (`Ctrl-V 3j` und dann `g Ctrl-A`), um die IDs zu inkrementieren.

```shell
<div id="app-a"></div>
<div id="app-b"></div>
<div id="app-c"></div>
<div id="app-d"></div>
<div id="app-e"></div>
```

## Den letzten Bereich des visuellen Modus auswählen

Früher in diesem Kapitel habe ich erwähnt, dass `gv` schnell die letzte visuelle Modus-Hervorhebung hervorheben kann. Sie können auch zu den Positionen des Anfangs und des Endes des letzten visuellen Modus mit diesen beiden speziellen Markierungen gehen:

```shell
`<    Gehe zum ersten Ort der vorherigen visuellen Modus-Hervorhebung
`>    Gehe zum letzten Ort der vorherigen visuellen Modus-Hervorhebung
```

Früher habe ich auch erwähnt, dass Sie selektiv Befehle der Befehlszeile auf einen hervorgehobenen Text ausführen können, wie `:s/const/let/g`. Wenn Sie das getan haben, würden Sie Folgendes sehen:

```shell
:`<,`>s/const/let/g
```

Sie haben tatsächlich einen *bereichsbezogenen* `s/const/let/g`-Befehl ausgeführt (mit den beiden Markierungen als Adressen). Interessant!

Sie können diese Markierungen jederzeit bearbeiten, wenn Sie möchten. Wenn Sie stattdessen von Anfang des hervorgehobenen Textes bis zum Ende der Datei substituieren müssten, ändern Sie einfach den Befehl in:

```shell
:`<,$s/const/let/g
```

## Den visuellen Modus aus dem Einfügemodus betreten

Sie können auch den visuellen Modus aus dem Einfügemodus betreten. Um in den zeichenweisen visuellen Modus zu gelangen, während Sie sich im Einfügemodus befinden:

```shell
Ctrl-O v
```

Denken Sie daran, dass das Ausführen von `Ctrl-O`, während Sie sich im Einfügemodus befinden, es Ihnen ermöglicht, einen Befehl im normalen Modus auszuführen. Während Sie sich in diesem Modus befinden, der auf einen normalen Modus-Befehl wartet, führen Sie `v` aus, um in den zeichenweisen visuellen Modus zu gelangen. Beachten Sie, dass unten links auf dem Bildschirm steht `--(insert) VISUAL--`. Dieser Trick funktioniert mit jedem visuellen Modusoperator: `v`, `V` und `Ctrl-V`.

## Auswahlmodus

Vim hat einen Modus, der dem visuellen Modus ähnlich ist, der Auswahlmodus genannt wird. Wie der visuelle Modus hat er ebenfalls drei verschiedene Modi:

```shell
gh         Zeichenweiser Auswahlmodus
gH         Zeilenweiser Auswahlmodus
gCtrl-h    Blockweiser Auswahlmodus
```

Der Auswahlmodus emuliert das Textmarkierungsverhalten eines regulären Editors näher als der visuelle Modus von Vim.

In einem regulären Editor, nachdem Sie einen Textblock hervorgehoben haben und einen Buchstaben eingeben, sagen wir den Buchstaben "y", wird der hervorgehobene Text gelöscht und der Buchstabe "y" eingefügt. Wenn Sie eine Zeile mit dem zeilenweisen Auswahlmodus (`gH`) hervorheben und "y" eingeben, wird der hervorgehobene Text gelöscht und der Buchstabe "y" eingefügt.

Vergleichen Sie diesen Auswahlmodus mit dem visuellen Modus: Wenn Sie eine Zeile Text mit dem zeilenweisen visuellen Modus (`V`) hervorheben und "y" eingeben, wird der hervorgehobene Text nicht gelöscht und durch den Buchstaben "y" ersetzt, sondern er wird kopiert. Sie können im Auswahlmodus keine normalen Modus-Befehle auf hervorgehobenen Text ausführen.

Ich persönlich habe den Auswahlmodus nie verwendet, aber es ist gut zu wissen, dass er existiert.

## Lernen Sie den visuellen Modus auf die smarte Weise

Der visuelle Modus ist Vims Darstellung des Textmarkierungsverfahrens.

Wenn Sie feststellen, dass Sie den visuellen Modus viel häufiger verwenden als die normalen Modusoperationen, seien Sie vorsichtig. Dies ist ein Anti-Muster. Es erfordert mehr Tastenschläge, um eine visuelle Modusoperation auszuführen als die entsprechende normale Modusoperation. Wenn Sie beispielsweise ein inneres Wort löschen müssen, warum vier Tastenschläge verwenden, `viwd` (inneres Wort visuell hervorheben und dann löschen), wenn Sie es mit nur drei Tastenschlägen (`diw`) erreichen können? Letzteres ist direkter und prägnanter. Natürlich wird es Zeiten geben, in denen visuelle Modi angemessen sind, aber im Allgemeinen sollten Sie einen direkteren Ansatz bevorzugen.