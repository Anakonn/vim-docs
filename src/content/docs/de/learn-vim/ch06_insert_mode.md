---
description: In diesem Dokument erfahren Sie, wie Sie den Insert-Modus in Vim nutzen
  können, um Ihre Tipp-Effizienz durch verschiedene Funktionen zu verbessern.
title: Ch06. Insert Mode
---

Der Einfügemodus ist der Standardmodus vieler Texteditoren. In diesem Modus gilt: Was du tippst, ist das, was du bekommst.

Das bedeutet jedoch nicht, dass es nicht viel zu lernen gibt. Der Einfügemodus von Vim enthält viele nützliche Funktionen. In diesem Kapitel wirst du lernen, wie du diese Funktionen im Einfügemodus von Vim nutzen kannst, um deine Tipp-Effizienz zu verbessern.

## Möglichkeiten, in den Einfügemodus zu gelangen

Es gibt viele Möglichkeiten, vom normalen Modus in den Einfügemodus zu gelangen. Hier sind einige davon:

```shell
i    Text vor dem Cursor einfügen
I    Text vor dem ersten nicht-leeren Zeichen der Zeile einfügen
a    Text nach dem Cursor anhängen
A    Text am Ende der Zeile anhängen
o    Beginnt eine neue Zeile unter dem Cursor und fügt Text ein
O    Beginnt eine neue Zeile über dem Cursor und fügt Text ein
s    Löscht das Zeichen unter dem Cursor und fügt Text ein
S    Löscht die aktuelle Zeile und fügt Text ein, Synonym für "cc"
gi   Fügt Text an der gleichen Position ein, an der der letzte Einfügemodus gestoppt wurde
gI   Fügt Text am Anfang der Zeile (Spalte 1) ein
```

Beachte das Muster aus Kleinbuchstaben / Großbuchstaben. Für jeden Kleinbuchstabenbefehl gibt es einen Großbuchstaben-Gegenpart. Wenn du neu bist, mach dir keine Sorgen, wenn du die gesamte Liste oben nicht auswendig weißt. Beginne mit `i` und `o`. Diese sollten ausreichen, um dir den Einstieg zu erleichtern. Lerne im Laufe der Zeit allmählich mehr.

## Verschiedene Möglichkeiten, den Einfügemodus zu verlassen

Es gibt einige verschiedene Möglichkeiten, während des Einfügemodus in den normalen Modus zurückzukehren:

```shell
<Esc>     Verlasst den Einfügemodus und geht in den normalen Modus
Ctrl-[    Verlasst den Einfügemodus und geht in den normalen Modus
Ctrl-C    Wie Ctrl-[ und <Esc>, aber überprüft nicht auf Abkürzungen
```

Ich finde die `<Esc>`-Taste zu weit entfernt, daher mappe ich meine `<Caps-Lock>`-Taste so, dass sie wie `<Esc>` funktioniert. Wenn du nach der ADM-3A-Tastatur von Bill Joy (Vi-Ersteller) suchst, wirst du sehen, dass die `<Esc>`-Taste nicht weit oben links wie bei modernen Tastaturen liegt, sondern links von der `q`-Taste. Deshalb halte ich es für sinnvoll, `<Caps lock>` auf `<Esc>` zu mappen.

Eine weitere gängige Konvention, die ich bei Vim-Nutzern gesehen habe, ist das Mappen von `<Esc>` auf `jj` oder `jk` im Einfügemodus. Wenn du diese Option bevorzugst, füge eine dieser Zeilen (oder beide) in deine vimrc-Datei ein.

```shell
inoremap jj <Esc>
inoremap jk <Esc>
```

## Wiederholen des Einfügemodus

Du kannst einen Zählerparameter eingeben, bevor du in den Einfügemodus wechselst. Zum Beispiel:

```shell
10i
```

Wenn du "hello world!" tippst und den Einfügemodus verlässt, wird Vim den Text 10 Mal wiederholen. Dies funktioniert mit jeder Methode des Einfügemodus (z.B.: `10I`, `11a`, `12o`).

## Löschen von Textstücken im Einfügemodus

Wenn du einen Tippfehler machst, kann es mühsam sein, wiederholt `<Backspace>` zu drücken. Es kann sinnvoller sein, in den normalen Modus zu wechseln und deinen Fehler zu löschen. Du kannst auch mehrere Zeichen gleichzeitig im Einfügemodus löschen.

```shell
Ctrl-h    Löscht ein Zeichen
Ctrl-w    Löscht ein Wort
Ctrl-u    Löscht die gesamte Zeile
```

## Einfügen aus dem Register

Vim-Register können Texte für die zukünftige Verwendung speichern. Um einen Text aus einem benannten Register im Einfügemodus einzufügen, tippe `Ctrl-R` gefolgt vom Register-Symbol. Es gibt viele Symbole, die du verwenden kannst, aber für diesen Abschnitt behandeln wir nur die benannten Register (a-z).

Um es in Aktion zu sehen, musst du zuerst ein Wort in das Register a yankieren. Bewege den Cursor auf ein beliebiges Wort. Tippe dann:

```shell
"ayiw
```

- `"a` sagt Vim, dass das Ziel deiner nächsten Aktion in das Register a gehen wird.
- `yiw` yankiert das innere Wort. Überprüfe das Kapitel über Vim-Grammatik für eine Auffrischung.

Das Register a enthält jetzt das Wort, das du gerade yankiert hast. Während du im Einfügemodus bist, um den Text aus dem Register a einzufügen:

```shell
Ctrl-R a
```

Es gibt mehrere Arten von Registern in Vim. Ich werde sie in einem späteren Kapitel ausführlicher behandeln.

## Scrollen

Wusstest du, dass du im Einfügemodus scrollen kannst? Wenn du im Einfügemodus bist, kannst du im `Ctrl-X`-Untermodus zusätzliche Operationen durchführen. Scrollen ist eine davon.

```shell
Ctrl-X Ctrl-Y    Nach oben scrollen
Ctrl-X Ctrl-E    Nach unten scrollen
```

## Autovervollständigung

Wie oben erwähnt, wenn du `Ctrl-X` im Einfügemodus drückst, wechselt Vim in einen Untermodus. Du kannst Text-Autovervollständigung im Einfügemodus dieses Untermodus durchführen. Obwohl es nicht so gut ist wie [IntelliSense](https://code.visualstudio.com/docs/editor/intellisense) oder ein anderer Language Server Protocol (LSP), ist es für etwas, das sofort verfügbar ist, eine sehr fähige Funktion.

Hier sind einige nützliche Autovervollständigungsbefehle, um zu beginnen:

```shell
Ctrl-X Ctrl-L	   Eine ganze Zeile einfügen
Ctrl-X Ctrl-N	   Text aus der aktuellen Datei einfügen
Ctrl-X Ctrl-I	   Text aus eingebundenen Dateien einfügen
Ctrl-X Ctrl-F	   Einen Dateinamen einfügen
```

Wenn du die Autovervollständigung auslöst, zeigt Vim ein Popup-Fenster an. Um im Popup-Fenster nach oben und unten zu navigieren, verwende `Ctrl-N` und `Ctrl-P`.

Vim hat auch zwei Autovervollständigungs-Shortcuts, die nicht den `Ctrl-X`-Untermodus beinhalten:

```shell
Ctrl-N             Nächstes Wort finden
Ctrl-P             Vorheriges Wort finden
```

Im Allgemeinen betrachtet Vim den Text in allen verfügbaren Buffern als Quelle für die Autovervollständigung. Wenn du einen offenen Buffer mit einer Zeile hast, die sagt "Schokoladendoughnuts sind die besten":
- Wenn du "Choco" tippst und `Ctrl-X Ctrl-L` machst, wird es die gesamte Zeile übereinstimmen und drucken.
- Wenn du "Choco" tippst und `Ctrl-P` machst, wird es das Wort "Chocolate" übereinstimmen und drucken.

Autovervollständigung ist ein weites Thema in Vim. Dies ist nur die Spitze des Eisbergs. Um mehr zu lernen, schau dir `:h ins-completion` an.

## Ausführen eines Befehls im normalen Modus

Wusstest du, dass Vim einen Befehl im normalen Modus ausführen kann, während du im Einfügemodus bist?

Wenn du im Einfügemodus bist und `Ctrl-O` drückst, befindest du dich im Einfügemodus-Normal-Untermodus. Wenn du auf den Modusanzeiger unten links schaust, wirst du normalerweise `-- INSERT --` sehen, aber das Drücken von `Ctrl-O` ändert es in `-- (insert) --`. In diesem Modus kannst du *einen* Befehl im normalen Modus ausführen. Einige Dinge, die du tun kannst:

**Zentrieren und Springen**

```shell
Ctrl-O zz       Fenster zentrieren
Ctrl-O H/M/L    Zum oberen/mittleren/unteren Fenster springen
Ctrl-O 'a       Zu Markierung a springen
```

**Text wiederholen**

```shell
Ctrl-O 100ihello    "hello" 100 Mal einfügen
```

**Terminalbefehle ausführen**

```shell
Ctrl-O !! curl https://google.com    curl ausführen
Ctrl-O !! pwd                        pwd ausführen
```

**Schneller löschen**

```shell
Ctrl-O dtz    Löscht vom aktuellen Standort bis zum Buchstaben "z"
Ctrl-O D      Löscht vom aktuellen Standort bis zum Ende der Zeile
```

## Lerne den Einfügemodus auf die smarte Weise

Wenn du wie ich bist und aus einem anderen Texteditor kommst, kann es verlockend sein, im Einfügemodus zu bleiben. Allerdings ist es ein Anti-Muster, im Einfügemodus zu bleiben, wenn du keinen Text eingibst. Entwickle die Gewohnheit, in den normalen Modus zu wechseln, wenn deine Finger keinen neuen Text eingeben.

Wenn du einen Text einfügen musst, frage dich zuerst, ob dieser Text bereits existiert. Wenn ja, versuche, diesen Text zu yankieren oder zu verschieben, anstatt ihn zu tippen. Wenn du den Einfügemodus verwenden musst, schaue, ob du diesen Text wann immer möglich autovervollständigen kannst. Vermeide es, dasselbe Wort mehr als einmal zu tippen, wenn du kannst.