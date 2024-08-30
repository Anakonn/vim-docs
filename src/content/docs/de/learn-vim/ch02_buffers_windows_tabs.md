---
description: In diesem Kapitel werden die Konzepte von Buffern, Fenstern und Tabs
  in Vim erklärt und wie sie das effiziente Arbeiten mit Textdateien unterstützen.
title: Ch02. Buffers, Windows, and Tabs
---

Wenn Sie zuvor einen modernen Texteditor verwendet haben, sind Sie wahrscheinlich mit Fenstern und Tabs vertraut. Vim verwendet drei Anzeigeabstraktionen anstelle von zwei: Puffer, Fenster und Tabs. In diesem Kapitel werde ich erklären, was Puffer, Fenster und Tabs sind und wie sie in Vim funktionieren.

Bevor Sie beginnen, stellen Sie sicher, dass Sie die Option `set hidden` in vimrc haben. Ohne sie wird Vim Sie auffordern, die Datei zu speichern, wann immer Sie die Puffer wechseln und Ihr aktueller Puffer nicht gespeichert ist (das wollen Sie nicht, wenn Sie schnell arbeiten möchten). Ich habe vimrc noch nicht behandelt. Wenn Sie kein vimrc haben, erstellen Sie eines. Es wird normalerweise in Ihrem Home-Verzeichnis abgelegt und heißt `.vimrc`. Ich habe meines unter `~/.vimrc`. Um zu sehen, wo Sie Ihr vimrc erstellen sollten, schauen Sie sich `:h vimrc` an. Fügen Sie darin hinzu:

```shell
set hidden
```

Speichern Sie es, und laden Sie es dann (führen Sie `:source %` von innerhalb des vimrc aus).

## Puffer

Was ist ein *Puffer*?

Ein Puffer ist ein Speicherplatz im Arbeitsspeicher, in dem Sie Text schreiben und bearbeiten können. Wenn Sie eine Datei in Vim öffnen, wird die Daten an einen Puffer gebunden. Wenn Sie 3 Dateien in Vim öffnen, haben Sie 3 Puffer.

Halten Sie zwei leere Dateien, `file1.js` und `file2.js`, bereit (wenn möglich, erstellen Sie sie mit Vim). Führen Sie dies im Terminal aus:

```bash
vim file1.js
```

Was Sie sehen, ist der *Puffer* von `file1.js`. Jedes Mal, wenn Sie eine neue Datei öffnen, erstellt Vim einen neuen Puffer.

Verlassen Sie Vim. Öffnen Sie diesmal zwei neue Dateien:

```bash
vim file1.js file2.js
```

Vim zeigt derzeit den `file1.js` Puffer an, aber tatsächlich werden zwei Puffer erstellt: den `file1.js` Puffer und den `file2.js` Puffer. Führen Sie `:buffers` aus, um alle Puffer zu sehen (alternativ können Sie auch `:ls` oder `:files` verwenden). Sie sollten *beide* `file1.js` und `file2.js` aufgelistet sehen. Das Ausführen von `vim file1 file2 file3 ... filen` erstellt n Puffer. Jedes Mal, wenn Sie eine neue Datei öffnen, erstellt Vim einen neuen Puffer für diese Datei.

Es gibt mehrere Möglichkeiten, Puffer zu durchlaufen:
- `:bnext`, um zum nächsten Puffer zu wechseln (`:bprevious`, um zum vorherigen Puffer zu wechseln).
- `:buffer` + Dateiname. Vim kann den Dateinamen mit `<Tab>` automatisch vervollständigen.
- `:buffer` + `n`, wobei `n` die Puffer-Nummer ist. Zum Beispiel bringt Sie die Eingabe von `:buffer 2` zu Puffer #2.
- Springen Sie zur älteren Position in der Sprungliste mit `Ctrl-O` und zur neueren Position mit `Ctrl-I`. Dies sind keine puffer-spezifischen Methoden, aber sie können verwendet werden, um zwischen verschiedenen Puffern zu springen. Ich werde Sprünge in Kapitel 5 näher erläutern.
- Gehen Sie zum zuletzt bearbeiteten Puffer mit `Ctrl-^`.

Sobald Vim einen Puffer erstellt, bleibt er in Ihrer Pufferliste. Um ihn zu entfernen, können Sie `:bdelete` eingeben. Es kann auch eine Puffer-Nummer als Parameter akzeptieren (`:bdelete 3`, um Puffer #3 zu löschen) oder einen Dateinamen (`:bdelete`, dann verwenden Sie `<Tab>`, um zu vervollständigen).

Das Schwierigste für mich beim Lernen über Puffer war, mir vorzustellen, wie sie funktionierten, da mein Verstand an Fenster gewöhnt war, als ich einen gängigen Texteditor verwendete. Eine gute Analogie ist ein Stapel Spielkarten. Wenn ich 2 Puffer habe, habe ich einen Stapel von 2 Karten. Die Karte oben ist die einzige Karte, die ich sehe, aber ich weiß, dass Karten darunter liegen. Wenn ich den `file1.js` Puffer angezeigt sehe, dann liegt die `file1.js` Karte oben auf dem Stapel. Ich kann die andere Karte, `file2.js`, hier nicht sehen, aber sie ist da. Wenn ich die Puffer zu `file2.js` wechsle, ist diese `file2.js` Karte jetzt oben auf dem Stapel und die `file1.js` Karte darunter.

Wenn Sie Vim noch nie verwendet haben, ist dies ein neues Konzept. Nehmen Sie sich Zeit, um es zu verstehen.

## Vim verlassen

Übrigens, wenn Sie mehrere Puffer geöffnet haben, können Sie alle mit quit-all schließen:

```shell
:qall
```

Wenn Sie ohne Speichern Ihrer Änderungen schließen möchten, fügen Sie einfach `!` am Ende hinzu:

```shell
:qall!
```

Um alle zu speichern und zu beenden, führen Sie aus:

```shell
:wqall
```

## Fenster

Ein Fenster ist ein Sichtfenster auf einen Puffer. Wenn Sie von einem gängigen Editor kommen, könnte Ihnen dieses Konzept vertraut sein. Die meisten Texteditoren haben die Fähigkeit, mehrere Fenster anzuzeigen. In Vim können Sie auch mehrere Fenster haben.

Lassen Sie uns `file1.js` erneut aus dem Terminal öffnen:

```bash
vim file1.js
```

Früher habe ich geschrieben, dass Sie den `file1.js` Puffer betrachten. Während das korrekt war, war diese Aussage unvollständig. Sie betrachten den `file1.js` Puffer, der durch **ein Fenster** angezeigt wird. Ein Fenster ist, wie Sie einen Puffer betrachten.

Verlassen Sie Vim noch nicht. Führen Sie aus:

```shell
:split file2.js
```

Jetzt sehen Sie zwei Puffer durch **zwei Fenster**. Das obere Fenster zeigt den `file2.js` Puffer an. Das untere Fenster zeigt den `file1.js` Puffer an.

Wenn Sie zwischen Fenstern navigieren möchten, verwenden Sie diese Tastenkombinationen:

```shell
Ctrl-W H    Bewegt den Cursor zum linken Fenster
Ctrl-W J    Bewegt den Cursor zum Fenster darunter
Ctrl-W K    Bewegt den Cursor zum oberen Fenster
Ctrl-W L    Bewegt den Cursor zum rechten Fenster
```

Führen Sie jetzt aus:

```shell
:vsplit file3.js
```

Jetzt sehen Sie drei Fenster, die drei Puffer anzeigen. Ein Fenster zeigt den `file3.js` Puffer an, ein anderes Fenster zeigt den `file2.js` Puffer an, und ein weiteres Fenster zeigt den `file1.js` Puffer an.

Sie können mehrere Fenster haben, die denselben Puffer anzeigen. Während Sie im oberen linken Fenster sind, geben Sie ein:

```shell
:buffer file2.js
```

Jetzt zeigen beide Fenster den `file2.js` Puffer an. Wenn Sie in einem `file2.js` Fenster zu tippen beginnen, werden Sie sehen, dass beide Fenster, die `file2.js` Puffer anzeigen, in Echtzeit aktualisiert werden.

Um das aktuelle Fenster zu schließen, können Sie `Ctrl-W C` ausführen oder `:quit` eingeben. Wenn Sie ein Fenster schließen, bleibt der Puffer weiterhin vorhanden (führen Sie `:buffers` aus, um dies zu bestätigen).

Hier sind einige nützliche Befehle im Normalmodus für Fenster:

```shell
Ctrl-W V    Öffnet einen neuen vertikalen Split
Ctrl-W S    Öffnet einen neuen horizontalen Split
Ctrl-W C    Schließt ein Fenster
Ctrl-W O    Macht das aktuelle Fenster zum einzigen auf dem Bildschirm und schließt andere Fenster
```

Und hier ist eine Liste nützlicher Befehle in der Befehlszeile für Fenster:

```shell
:vsplit dateiname    Fenster vertikal teilen
:split dateiname     Fenster horizontal teilen
:new dateiname       Neues Fenster erstellen
```

Nehmen Sie sich Zeit, um sie zu verstehen. Für weitere Informationen schauen Sie sich `:h window` an.

## Tabs

Ein Tab ist eine Sammlung von Fenstern. Denken Sie daran wie an ein Layout für Fenster. In den meisten modernen Texteditoren (und modernen Internetbrowsern) bedeutet ein Tab eine geöffnete Datei / Seite, und wenn Sie ihn schließen, verschwindet diese Datei / Seite. In Vim repräsentiert ein Tab keine geöffnete Datei. Wenn Sie einen Tab in Vim schließen, schließen Sie keine Datei. Sie schließen nur das Layout. Die in diesem Layout geöffneten Dateien sind weiterhin nicht geschlossen, sie sind weiterhin in ihren Puffern geöffnet.

Lassen Sie uns die Vim-Tabs in Aktion sehen. Öffnen Sie `file1.js`:

```bash
vim file1.js
```

Um `file2.js` in einem neuen Tab zu öffnen:

```shell
:tabnew file2.js
```

Sie können auch Vim den Dateinamen, den Sie in einem *neuen Tab* öffnen möchten, automatisch vervollständigen lassen, indem Sie `<Tab>` drücken (kein Wortspiel beabsichtigt).

Unten finden Sie eine Liste nützlicher Tab-Navigationen:

```shell
:tabnew datei.txt    Öffnet datei.txt in einem neuen Tab
:tabclose            Schließt den aktuellen Tab
:tabnext             Gehe zum nächsten Tab
:tabprevious         Gehe zum vorherigen Tab
:tablast             Gehe zum letzten Tab
:tabfirst            Gehe zum ersten Tab
```

Sie können auch `gt` ausführen, um zum nächsten Tab zu wechseln (Sie können mit `gT` zum vorherigen Tab wechseln). Sie können eine Zahl als Argument an `gt` übergeben, wobei die Zahl die Tab-Nummer ist. Um zum dritten Tab zu gelangen, geben Sie `3gt` ein.

Ein Vorteil von mehreren Tabs ist, dass Sie unterschiedliche Fensteranordnungen in verschiedenen Tabs haben können. Vielleicht möchten Sie, dass Ihr erster Tab 3 vertikale Fenster hat und der zweite Tab eine gemischte horizontale und vertikale Fensteranordnung hat. Ein Tab ist das perfekte Werkzeug dafür!

Um Vim mit mehreren Tabs zu starten, können Sie dies vom Terminal aus tun:

```bash
vim -p file1.js file2.js file3.js
```

## Bewegung in 3D

Die Bewegung zwischen Fenstern ist wie das Reisen zweidimensional entlang der X-Y-Achse in kartesischen Koordinaten. Sie können zum oberen, rechten, unteren und linken Fenster mit `Ctrl-W H/J/K/L` wechseln.

Die Bewegung zwischen Puffern ist wie das Reisen entlang der Z-Achse in kartesischen Koordinaten. Stellen Sie sich vor, Ihre Pufferdateien reihen sich entlang der Z-Achse auf. Sie können die Z-Achse einen Puffer nach dem anderen mit `:bnext` und `:bprevious` durchqueren. Sie können zu jeder Koordinate auf der Z-Achse mit `:buffer dateiname/puffernummer` springen.

Sie können sich im *dreidimensionalen Raum* bewegen, indem Sie Fenster- und Pufferbewegungen kombinieren. Sie können zum oberen, rechten, unteren oder linken Fenster (X-Y-Navigationen) mit Fensterbewegungen wechseln. Da jedes Fenster Puffer enthält, können Sie vorwärts und rückwärts (Z-Navigationen) mit Pufferbewegungen wechseln.

## Puffer, Fenster und Tabs auf intelligente Weise nutzen

Sie haben gelernt, was Puffer, Fenster und Tabs sind und wie sie in Vim funktionieren. Jetzt, da Sie sie besser verstehen, können Sie sie in Ihrem eigenen Workflow verwenden.

Jeder hat einen anderen Workflow, hier ist meiner zum Beispiel:
- Zuerst verwende ich Puffer, um alle erforderlichen Dateien für die aktuelle Aufgabe zu speichern. Vim kann viele geöffnete Puffer handhaben, bevor es anfängt, langsamer zu werden. Außerdem wird das Öffnen vieler Puffer meinen Bildschirm nicht überladen. Ich sehe immer nur einen Puffer (vorausgesetzt, ich habe nur ein Fenster), was es mir ermöglicht, mich auf einen Bildschirm zu konzentrieren. Wenn ich irgendwohin gehen muss, kann ich jederzeit schnell zu einem offenen Puffer wechseln.
- Ich benutze mehrere Fenster, um mehrere Puffer gleichzeitig anzuzeigen, normalerweise beim Vergleichen von Dateien, beim Lesen von Dokumenten oder beim Verfolgen eines Codeflusses. Ich versuche, die Anzahl der geöffneten Fenster auf nicht mehr als drei zu beschränken, da mein Bildschirm überladen wird (ich benutze ein kleines Laptop). Wenn ich fertig bin, schließe ich alle zusätzlichen Fenster. Weniger Fenster bedeuten weniger Ablenkungen.
- Anstelle von Tabs verwende ich [tmux](https://github.com/tmux/tmux/wiki) Fenster. Ich benutze normalerweise mehrere tmux-Fenster gleichzeitig. Zum Beispiel ein tmux-Fenster für clientseitige Codes und ein anderes für Backend-Codes.

Mein Workflow kann sich von Ihrem unterscheiden, basierend auf Ihrem Bearbeitungsstil, und das ist in Ordnung. Experimentieren Sie, um Ihren eigenen Flow zu entdecken, der zu Ihrem Programmierstil passt.