---
description: In diesem Kapitel lernen Sie verschiedene Möglichkeiten, Vim über das
  Terminal zu starten, einschließlich Installationshinweisen und grundlegenden Befehlen.
title: Ch01. Starting Vim
---

In diesem Kapitel lernen Sie verschiedene Möglichkeiten, Vim aus dem Terminal zu starten. Ich habe Vim 8.2 verwendet, als ich diesen Leitfaden geschrieben habe. Wenn Sie Neovim oder eine ältere Version von Vim verwenden, sollten Sie größtenteils in Ordnung sein, aber beachten Sie, dass einige Befehle möglicherweise nicht verfügbar sind.

## Installation

Ich werde nicht die detaillierte Anleitung durchgehen, wie man Vim auf einem bestimmten Rechner installiert. Die gute Nachricht ist, dass die meisten Unix-basierten Computer mit Vim vorinstalliert sein sollten. Wenn nicht, sollten die meisten Distributionen einige Anweisungen zur Installation von Vim haben.

Um weitere Informationen über den Installationsprozess von Vim herunterzuladen, besuchen Sie die offizielle Download-Website von Vim oder das offizielle GitHub-Repository von Vim:
- [Vim-Website](https://www.vim.org/download.php)
- [Vim GitHub](https://github.com/vim/vim)

## Der Vim-Befehl

Jetzt, da Sie Vim installiert haben, führen Sie dies im Terminal aus:

```bash
vim
```

Sie sollten einen Einführungsscreen sehen. Hier werden Sie an Ihrer neuen Datei arbeiten. Im Gegensatz zu den meisten Texteditoren und IDEs ist Vim ein modaler Editor. Wenn Sie "hello" eingeben möchten, müssen Sie in den Einfügemodus wechseln mit `i`. Drücken Sie `ihello<Esc>`, um den Text "hello" einzufügen.

## Vim verlassen

Es gibt mehrere Möglichkeiten, Vim zu verlassen. Die gebräuchlichste ist, zu tippen:

```shell
:quit
```

Sie können auch kurz `:q` eingeben. Dieser Befehl ist ein Befehl im Befehlszeilenmodus (ein weiterer Modus von Vim). Wenn Sie `:` im normalen Modus eingeben, bewegt sich der Cursor zum unteren Bildschirmrand, wo Sie einige Befehle eingeben können. Sie werden später im Kapitel 15 mehr über den Befehlszeilenmodus erfahren. Wenn Sie sich im Einfügemodus befinden, erzeugt das Eingeben von `:` buchstäblich das Zeichen ":" auf dem Bildschirm. In diesem Fall müssen Sie in den normalen Modus zurückwechseln. Tippen Sie `<Esc>`, um in den normalen Modus zu wechseln. Übrigens können Sie auch aus dem Befehlszeilenmodus in den normalen Modus zurückkehren, indem Sie `<Esc>` drücken. Sie werden feststellen, dass Sie aus mehreren Vim-Modi zurück in den normalen Modus "entkommen" können, indem Sie `<Esc>` drücken.

## Eine Datei speichern

Um Ihre Änderungen zu speichern, geben Sie ein:

```shell
:write
```

Sie können auch kurz `:w` eingeben. Wenn dies eine neue Datei ist, müssen Sie ihr einen Namen geben, bevor Sie sie speichern können. Nennen wir sie `file.txt`. Führen Sie aus:

```shell
:w file.txt
```

Um zu speichern und zu beenden, können Sie die Befehle `:w` und `:q` kombinieren:

```shell
:wq
```

Um ohne Speichern von Änderungen zu beenden, fügen Sie `!` nach `:q` hinzu, um einen erzwungenen Quit durchzuführen:

```shell
:q!
```

Es gibt andere Möglichkeiten, Vim zu verlassen, aber dies sind die, die Sie täglich verwenden werden.

## Hilfe

Im Laufe dieses Leitfadens werde ich Sie auf verschiedene Vim-Hilfeseiten verweisen. Sie können zur Hilfeseite gelangen, indem Sie `:help {some-command}` eingeben (`:h` für kurz). Sie können dem `:h`-Befehl ein Thema oder einen Befehlsnamen als Argument übergeben. Um beispielsweise mehr über verschiedene Möglichkeiten zu erfahren, Vim zu beenden, geben Sie ein:

```shell
:h write-quit
```

Wie wusste ich, dass ich nach "write-quit" suchen sollte? Tatsächlich wusste ich es nicht. Ich habe einfach `:h` eingegeben, dann "quit", dann `<Tab>`. Vim zeigte relevante Schlüsselwörter zur Auswahl an. Wenn Sie jemals etwas nachschlagen müssen ("Ich wünschte, Vim könnte das tun..."), geben Sie einfach `:h` ein und versuchen Sie einige Schlüsselwörter, dann `<Tab>`.

## Eine Datei öffnen

Um eine Datei (`hello1.txt`) in Vim aus dem Terminal zu öffnen, führen Sie aus:

```bash
vim hello1.txt
```

Sie können auch mehrere Dateien gleichzeitig öffnen:

```bash
vim hello1.txt hello2.txt hello3.txt
```

Vim öffnet `hello1.txt`, `hello2.txt` und `hello3.txt` in separaten Puffern. Sie werden im nächsten Kapitel mehr über Puffer erfahren.

## Argumente

Sie können den `vim`-Terminalbefehl mit verschiedenen Flags und Optionen übergeben.

Um die aktuelle Vim-Version zu überprüfen, führen Sie aus:

```bash
vim --version
```

Dies zeigt Ihnen die aktuelle Vim-Version und alle verfügbaren Funktionen, die entweder mit `+` oder `-` gekennzeichnet sind. Einige dieser Funktionen in diesem Leitfaden erfordern, dass bestimmte Funktionen verfügbar sind. Zum Beispiel werden Sie in einem späteren Kapitel die Befehlszeilenhistorie von Vim mit dem Befehl `:history` erkunden. Ihr Vim muss die Funktion `+cmdline_history` haben, damit der Befehl funktioniert. Es besteht eine gute Chance, dass das Vim, das Sie gerade installiert haben, alle notwendigen Funktionen hat, insbesondere wenn es von einer beliebten Download-Quelle stammt.

Viele Dinge, die Sie vom Terminal aus tun, können auch innerhalb von Vim getan werden. Um die Version von *innerhalb* von Vim zu sehen, können Sie dies ausführen:

```shell
:version
```

Wenn Sie die Datei `hello.txt` öffnen und sofort einen Vim-Befehl ausführen möchten, können Sie dem `vim`-Befehl die Option `+{cmd}` übergeben.

In Vim können Sie Zeichenfolgen mit dem Befehl `:s` (kurz für `:substitute`) ersetzen. Wenn Sie `hello.txt` öffnen und alle "pancake" durch "bagel" ersetzen möchten, führen Sie aus:

```bash
vim +%s/pancake/bagel/g hello.txt
```

Diese Vim-Befehle können gestapelt werden:

```bash
vim +%s/pancake/bagel/g +%s/bagel/egg/g +%s/egg/donut/g hello.txt
```

Vim wird alle Vorkommen von "pancake" durch "bagel" ersetzen, dann "bagel" durch "egg" ersetzen und schließlich "egg" durch "donut" ersetzen (Sie werden im späteren Kapitel mehr über Ersetzungen lernen).

Sie können auch die Option `-c` gefolgt von einem Vim-Befehl anstelle der `+`-Syntax übergeben:

```bash
vim -c %s/pancake/bagel/g hello.txt
vim -c %s/pancake/bagel/g -c %s/bagel/egg/g -c %s/egg/donut/g hello.txt
```

## Mehrere Fenster öffnen

Sie können Vim in horizontalen und vertikalen geteilten Fenstern mit den Optionen `-o` und `-O` starten.

Um Vim mit zwei horizontalen Fenstern zu öffnen, führen Sie aus:

```bash
vim -o2
```

Um Vim mit 5 horizontalen Fenstern zu öffnen, führen Sie aus:

```bash
vim -o5
```

Um Vim mit 5 horizontalen Fenstern zu öffnen und die ersten beiden mit `hello1.txt` und `hello2.txt` zu füllen, führen Sie aus:

```bash
vim -o5 hello1.txt hello2.txt
```

Um Vim mit zwei vertikalen Fenstern, 5 vertikalen Fenstern und 5 vertikalen Fenstern mit 2 Dateien zu öffnen:

```bash
vim -O2
vim -O5
vim -O5 hello1.txt hello2.txt
```

## Aussetzen

Wenn Sie Vim während des Bearbeitens aussetzen müssen, können Sie `Ctrl-z` drücken. Sie können auch den Befehl `:stop` oder `:suspend` ausführen. Um zu dem ausgesetzten Vim zurückzukehren, führen Sie `fg` aus dem Terminal aus.

## Vim auf die smarte Weise starten

Der Befehl `vim` kann viele verschiedene Optionen annehmen, genau wie jeder andere Terminalbefehl. Zwei Optionen ermöglichen es Ihnen, einen Vim-Befehl als Parameter zu übergeben: `+{cmd}` und `-c cmd`. Während Sie im Laufe dieses Leitfadens mehr Befehle lernen, sehen Sie, ob Sie dies beim Starten von Vim anwenden können. Da es sich auch um einen Terminalbefehl handelt, können Sie `vim` mit vielen anderen Terminalbefehlen kombinieren. Zum Beispiel können Sie die Ausgabe des `ls`-Befehls umleiten, um sie in Vim mit `ls -l | vim -` zu bearbeiten.

Um mehr über den `vim`-Befehl im Terminal zu erfahren, schauen Sie sich `man vim` an. Um mehr über den Vim-Editor zu erfahren, lesen Sie diesen Leitfaden weiter und verwenden Sie den Befehl `:help`.