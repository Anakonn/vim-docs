---
description: In diesem Kapitel erfahren Sie mehr über die Laufzeitpfade von Vim, deren
  Bedeutung und wie Sie Vim anpassen können, um Ihre Arbeitsweise zu optimieren.
title: Ch24. Vim Runtime
---

In den vorherigen Kapiteln habe ich erwähnt, dass Vim automatisch nach speziellen Pfaden wie `pack/` (Kap. 22) und `compiler/` (Kap. 19) im Verzeichnis `~/.vim/` sucht. Dies sind Beispiele für Vim-Laufzeitpfade.

Vim hat mehr Laufzeitpfade als nur diese beiden. In diesem Kapitel werden Sie einen Überblick über diese Laufzeitpfade erhalten. Das Ziel dieses Kapitels ist es, Ihnen zu zeigen, wann sie aufgerufen werden. Dieses Wissen ermöglicht es Ihnen, Vim weiter zu verstehen und anzupassen.

## Laufzeitpfad

Auf einem Unix-Rechner ist einer Ihrer Vim-Laufzeitpfade `$HOME/.vim/` (wenn Sie ein anderes Betriebssystem wie Windows haben, könnte Ihr Pfad anders sein). Um zu sehen, welche Laufzeitpfade für verschiedene Betriebssysteme existieren, schauen Sie sich `:h 'runtimepath'` an. In diesem Kapitel werde ich `~/.vim/` als den Standardlaufzeitpfad verwenden.

## Plugin-Skripte

Vim hat einen Plugin-Laufzeitpfad, der alle Skripte in diesem Verzeichnis jedes Mal ausführt, wenn Vim gestartet wird. Verwechseln Sie den Namen "Plugin" nicht mit externen Vim-Plugins (wie NERDTree, fzf.vim usw.).

Gehen Sie in das Verzeichnis `~/.vim/` und erstellen Sie ein Verzeichnis `plugin/`. Erstellen Sie zwei Dateien: `donut.vim` und `chocolate.vim`.

In `~/.vim/plugin/donut.vim`:

```shell
echo "donut!"
```

In `~/.vim/plugin/chocolate.vim`:

```shell
echo "chocolate!"
```

Schließen Sie nun Vim. Beim nächsten Start von Vim sehen Sie sowohl `"donut!"` als auch `"chocolate!"` ausgegeben. Der Plugin-Laufzeitpfad kann für Initialisierungsskripte verwendet werden.

## Dateitypenerkennung

Bevor Sie beginnen, stellen Sie sicher, dass Ihre vimrc mindestens die folgende Zeile enthält:

```shell
filetype plugin indent on
```

Schauen Sie sich `:h filetype-overview` für mehr Kontext an. Im Wesentlichen aktiviert dies die Dateitypenerkennung von Vim.

Wenn Sie eine neue Datei öffnen, weiß Vim normalerweise, um welchen Dateityp es sich handelt. Wenn Sie eine Datei `hello.rb` haben, gibt der Befehl `:set filetype?` die korrekte Antwort `filetype=ruby` zurück.

Vim weiß, wie man "gewöhnliche" Dateitypen (Ruby, Python, Javascript usw.) erkennt. Aber was ist, wenn Sie eine benutzerdefinierte Datei haben? Sie müssen Vim beibringen, sie zu erkennen und den richtigen Dateityp zuzuweisen.

Es gibt zwei Methoden zur Erkennung: Verwendung des Dateinamens und des Dateiinhalts.

### Dateinamensenerkennung

Die Dateinamensenerkennung erkennt einen Dateityp anhand des Namens dieser Datei. Wenn Sie die Datei `hello.rb` öffnen, weiß Vim, dass es sich um eine Ruby-Datei handelt, aufgrund der `.rb`-Erweiterung.

Es gibt zwei Möglichkeiten, die Dateinamensenerkennung durchzuführen: Verwendung des Laufzeitverzeichnisses `ftdetect/` und Verwendung der Laufzeitdatei `filetype.vim`. Lassen Sie uns beide erkunden.

#### `ftdetect/`

Lassen Sie uns eine obskure (aber schmackhafte) Datei erstellen, `hello.chocodonut`. Wenn Sie sie öffnen und `:set filetype?` ausführen, weiß Vim aufgrund der ungewöhnlichen Dateinamensendung nicht, was es damit anfangen soll. Es gibt `filetype=` zurück.

Sie müssen Vim anweisen, alle Dateien, die mit `.chocodonut` enden, als "chocodonut" Dateityp zu setzen. Erstellen Sie ein Verzeichnis namens `ftdetect/` im Laufzeitstammverzeichnis (`~/.vim/`). Erstellen Sie darin eine Datei und benennen Sie sie `chocodonut.vim` (`~/.vim/ftdetect/chocodonut.vim`). Fügen Sie in diese Datei Folgendes ein:

```shell
autocmd BufNewFile,BufRead *.chocodonut set filetype=chocodonut
```

`BufNewFile` und `BufRead` werden ausgelöst, wenn Sie einen neuen Puffer erstellen und einen neuen Puffer öffnen. `*.chocodonut` bedeutet, dass dieses Ereignis nur ausgelöst wird, wenn der geöffnete Puffer eine `.chocodonut`-Dateinamensendung hat. Schließlich setzt der Befehl `set filetype=chocodonut` den Dateityp auf den chocodonut-Typ.

Starten Sie Vim neu. Öffnen Sie nun die Datei `hello.chocodonut` und führen Sie `:set filetype?` aus. Es gibt `filetype=chocodonut` zurück.

Lecker! Sie können so viele Dateien wie gewünscht in `ftdetect/` ablegen. In Zukunft können Sie vielleicht `ftdetect/strawberrydonut.vim`, `ftdetect/plaindonut.vim` usw. hinzufügen, wenn Sie jemals entscheiden, Ihre Donut-Dateitypen zu erweitern.

Es gibt tatsächlich zwei Möglichkeiten, einen Dateityp in Vim festzulegen. Eine ist das, was Sie gerade verwendet haben: `set filetype=chocodonut`. Die andere Möglichkeit ist, `setfiletype chocodonut` auszuführen. Der erste Befehl `set filetype=chocodonut` setzt *immer* den Dateityp auf den chocodonut-Typ, während der zweite Befehl `setfiletype chocodonut` den Dateityp nur setzt, wenn noch kein Dateityp festgelegt wurde.

#### Dateitypdatei

Die zweite Methode zur Dateierkennung erfordert, dass Sie eine `filetype.vim` im Stammverzeichnis (`~/.vim/filetype.vim`) erstellen. Fügen Sie Folgendes hinzu:

```shell
autocmd BufNewFile,BufRead *.plaindonut set filetype=plaindonut
```

Erstellen Sie eine Datei `hello.plaindonut`. Wenn Sie sie öffnen und `:set filetype?` ausführen, zeigt Vim den korrekten benutzerdefinierten Dateityp `filetype=plaindonut` an.

Heilige Backware, es funktioniert! Übrigens, wenn Sie mit `filetype.vim` herumspielen, werden Sie möglicherweise feststellen, dass diese Datei mehrmals ausgeführt wird, wenn Sie `hello.plaindonut` öffnen. Um dies zu verhindern, können Sie einen Schutz hinzufügen, sodass das Hauptskript nur einmal ausgeführt wird. Aktualisieren Sie die `filetype.vim`:

```shell
if exists("did_load_filetypes")
  finish
endif

augroup donutfiletypedetection
  autocmd! BufRead,BufNewFile *.plaindonut setfiletype plaindonut
augroup END
```

`finish` ist ein Vim-Befehl, um die Ausführung des restlichen Skripts zu stoppen. Der Ausdruck `"did_load_filetypes"` ist *keine* eingebaute Vim-Funktion. Es ist tatsächlich eine globale Variable aus `$VIMRUNTIME/filetype.vim`. Wenn Sie neugierig sind, führen Sie `:e $VIMRUNTIME/filetype.vim` aus. Sie werden diese Zeilen darin finden:

```shell
if exists("did_load_filetypes")
  finish
endif

let did_load_filetypes = 1
```

Wenn Vim diese Datei aufruft, definiert es die Variable `did_load_filetypes` und setzt sie auf 1. 1 ist in Vim wahrhaftig. Sie sollten auch den Rest der `filetype.vim` lesen. Sehen Sie, ob Sie verstehen, was es tut, wenn Vim es aufruft.

### Dateitypskript

Lassen Sie uns lernen, wie man einen Dateityp basierend auf dem Dateiinhalts erkennt und zuweist.

Angenommen, Sie haben eine Sammlung von Dateien ohne eine akzeptable Erweiterung. Das einzige, was diese Dateien gemeinsam haben, ist, dass sie alle mit dem Wort "donutify" in der ersten Zeile beginnen. Sie möchten diesen Dateien den Dateityp `donut` zuweisen. Erstellen Sie neue Dateien mit den Namen `sugardonut`, `glazeddonut` und `frieddonut` (ohne Erweiterung). Fügen Sie in jede Datei diese Zeile ein:

```shell
donutify
```

Wenn Sie den Befehl `:set filetype?` in `sugardonut` ausführen, weiß Vim nicht, welchen Dateityp es dieser Datei zuweisen soll. Es gibt `filetype=` zurück.

Fügen Sie im Laufzeitstammverzeichnis eine Datei `scripts.vim` hinzu (`~/.vim/scripts.vim`). Fügen Sie darin Folgendes hinzu:

```shell
if did_filetype()
  finish
endif

if getline(1) =~ '^\\<donutify\\>'
  setfiletype donut
endif
```

Die Funktion `getline(1)` gibt den Text in der ersten Zeile zurück. Sie überprüft, ob die erste Zeile mit dem Wort "donutify" beginnt. Die Funktion `did_filetype()` ist eine eingebaute Vim-Funktion. Sie gibt true zurück, wenn ein dateitypspezifisches Ereignis mindestens einmal ausgelöst wurde. Sie wird als Schutz verwendet, um das erneute Ausführen des Dateitypereignisses zu stoppen.

Öffnen Sie die Datei `sugardonut` und führen Sie `:set filetype?` aus, Vim gibt jetzt `filetype=donut` zurück. Wenn Sie andere Donut-Dateien (`glazeddonut` und `frieddonut`) öffnen, erkennt Vim auch deren Dateitypen als `donut`-Typen.

Beachten Sie, dass `scripts.vim` nur ausgeführt wird, wenn Vim eine Datei mit einem unbekannten Dateityp öffnet. Wenn Vim eine Datei mit einem bekannten Dateityp öffnet, wird `scripts.vim` nicht ausgeführt.

## Dateityp-Plugin

Was ist, wenn Sie möchten, dass Vim spezifische Skripte für chocodonut ausführt, wenn Sie eine chocodonut-Datei öffnen, und diese Skripte nicht ausführt, wenn Sie eine plaindonut-Datei öffnen?

Sie können dies mit dem Laufzeitpfad für Dateityp-Plugins (`~/.vim/ftplugin/`) tun. Vim sucht in diesem Verzeichnis nach einer Datei mit dem gleichen Namen wie der gerade geöffneten Dateityp. Erstellen Sie eine `chocodonut.vim` (`~/.vim/ftplugin/chocodonut.vim`):

```shell
echo "Calling from chocodonut ftplugin"
```

Erstellen Sie eine weitere ftplugin-Datei, `plaindonut.vim` (`~/.vim/ftplugin/plaindonut.vim`):

```shell
echo "Calling from plaindonut ftplugin"
```

Jetzt führt Vim jedes Mal, wenn Sie einen chocodonut-Dateityp öffnen, die Skripte aus `~/.vim/ftplugin/chocodonut.vim` aus. Jedes Mal, wenn Sie einen plaindonut-Dateityp öffnen, führt Vim die Skripte aus `~/.vim/ftplugin/plaindonut.vim` aus.

Eine Warnung: Diese Dateien werden jedes Mal ausgeführt, wenn ein Puffer-Dateityp festgelegt wird (`set filetype=chocodonut` zum Beispiel). Wenn Sie 3 verschiedene chocodonut-Dateien öffnen, werden die Skripte insgesamt dreimal ausgeführt.

## Einrückdateien

Vim hat einen Einrücklaufzeitpfad, der ähnlich wie ftplugin funktioniert, wobei Vim nach einer Datei mit dem gleichen Namen wie der geöffneten Dateityp sucht. Der Zweck dieser Einrücklaufzeitpfade besteht darin, einrückungsbezogene Codes zu speichern. Wenn Sie die Datei `~/.vim/indent/chocodonut.vim` haben, wird sie nur ausgeführt, wenn Sie einen chocodonut-Dateityp öffnen. Sie können hier einrückungsbezogene Codes für chocodonut-Dateien speichern.

## Farben

Vim hat einen Farb-Laufzeitpfad (`~/.vim/colors/`), um Farbschemata zu speichern. Jede Datei, die in dieses Verzeichnis gelegt wird, wird im Befehl `:color` angezeigt.

Wenn Sie eine Datei `~/.vim/colors/beautifulprettycolors.vim` haben, sehen Sie beim Ausführen von `:color` und Drücken von Tab `beautifulprettycolors` als eine der Farboptionen. Wenn Sie Ihr eigenes Farbschema hinzufügen möchten, ist dies der richtige Ort dafür.

Wenn Sie die Farbschemata anderer Leute ansehen möchten, ist eine gute Anlaufstelle [vimcolors](https://vimcolors.com/).

## Syntaxhervorhebung

Vim hat einen Syntax-Laufzeitpfad (`~/.vim/syntax/`), um die Syntaxhervorhebung zu definieren.

Angenommen, Sie haben eine Datei `hello.chocodonut`, in der die folgenden Ausdrücke enthalten sind:

```shell
(donut "tasty")
(donut "savory")
```

Obwohl Vim jetzt den korrekten Dateityp kennt, haben alle Texte die gleiche Farbe. Lassen Sie uns eine Regel zur Syntaxhervorhebung hinzufügen, um das Schlüsselwort "donut" hervorzuheben. Erstellen Sie eine neue Chocodonut-Syntaxdatei, `~/.vim/syntax/chocodonut.vim`. Fügen Sie darin Folgendes hinzu:

```shell
syntax keyword donutKeyword donut

highlight link donutKeyword Keyword
```

Öffnen Sie nun die Datei `hello.chocodonut` erneut. Die Schlüsselwörter `donut` sind jetzt hervorgehoben.

Dieses Kapitel wird nicht ausführlich auf die Syntaxhervorhebung eingehen. Es ist ein umfangreiches Thema. Wenn Sie neugierig sind, schauen Sie sich `:h syntax.txt` an.

Das Plugin [vim-polyglot](https://github.com/sheerun/vim-polyglot) ist ein großartiges Plugin, das Hervorhebungen für viele beliebte Programmiersprachen bietet.

## Dokumentation

Wenn Sie ein Plugin erstellen, müssen Sie Ihre eigene Dokumentation erstellen. Sie verwenden den doc-Laufzeitpfad dafür.

Lassen Sie uns eine grundlegende Dokumentation für die Schlüsselwörter chocodonut und plaindonut erstellen. Erstellen Sie eine Datei `donut.txt` (`~/.vim/doc/donut.txt`). Fügen Sie darin diese Texte hinzu:

```shell
*chocodonut* Leckere Schokoladendonut

*plaindonut* Kein Schoko-Geschmack, aber trotzdem lecker
```

Wenn Sie versuchen, nach `chocodonut` und `plaindonut` zu suchen (`:h chocodonut` und `:h plaindonut`), werden Sie nichts finden.

Zuerst müssen Sie `:helptags` ausführen, um neue Hilfeeinträge zu generieren. Führen Sie `:helptags ~/.vim/doc/` aus.

Jetzt, wenn Sie `:h chocodonut` und `:h plaindonut` ausführen, werden Sie diese neuen Hilfeeinträge finden. Beachten Sie, dass die Datei jetzt schreibgeschützt ist und einen "Hilfe"-Dateityp hat.
## Lazy Loading Scripts

Alle Laufzeitpfade, die Sie in diesem Kapitel gelernt haben, wurden automatisch ausgeführt. Wenn Sie ein Skript manuell laden möchten, verwenden Sie den Autoload-Laufzeitpfad.

Erstellen Sie ein Autoload-Verzeichnis (`~/.vim/autoload/`). Erstellen Sie in diesem Verzeichnis eine neue Datei und benennen Sie sie `tasty.vim` (`~/.vim/autoload/tasty.vim`). Darin:

```shell
echo "tasty.vim global"

function tasty#donut()
  echo "tasty#donut"
endfunction
```

Beachten Sie, dass der Funktionsname `tasty#donut` ist, nicht `donut()`. Das Rautezeichen (`#`) ist erforderlich, wenn Sie die Autoload-Funktion verwenden. Die Namenskonvention für Funktionen im Autoload ist:

```shell
function fileName#functionName()
  ...
endfunction
```

In diesem Fall ist der Dateiname `tasty.vim` und der Funktionsname ist (technisch gesehen) `donut`.

Um eine Funktion aufzurufen, benötigen Sie den Befehl `call`. Lassen Sie uns diese Funktion mit `:call tasty#donut()` aufrufen.

Beim ersten Aufruf der Funktion sollten Sie *beide* Echo-Nachrichten sehen ("tasty.vim global" und "tasty#donut"). Die nachfolgenden Aufrufe der Funktion `tasty#donut` zeigen nur die Echo-Nachricht "testy#donut".

Wenn Sie eine Datei in Vim öffnen, werden im Gegensatz zu den vorherigen Laufzeitpfaden Autoload-Skripte nicht automatisch geladen. Nur wenn Sie explizit `tasty#donut()` aufrufen, sucht Vim nach der Datei `tasty.vim` und lädt alles darin, einschließlich der Funktion `tasty#donut()`. Autoload ist der perfekte Mechanismus für Funktionen, die umfangreiche Ressourcen verwenden, die Sie jedoch nicht oft nutzen.

Sie können so viele verschachtelte Verzeichnisse mit Autoload hinzufügen, wie Sie möchten. Wenn Sie den Laufzeitpfad `~/.vim/autoload/one/two/three/tasty.vim` haben, können Sie die Funktion mit `:call one#two#three#tasty#donut()` aufrufen.

## After Scripts

Vim hat einen After-Laufzeitpfad (`~/.vim/after/`), der die Struktur von `~/.vim/` widerspiegelt. Alles in diesem Pfad wird zuletzt ausgeführt, daher verwenden Entwickler normalerweise diese Pfade für Skriptüberschreibungen.

Wenn Sie beispielsweise die Skripte von `plugin/chocolate.vim` überschreiben möchten, können Sie `~/.vim/after/plugin/chocolate.vim` erstellen, um die Überschreibungsskripte zu platzieren. Vim führt `~/.vim/after/plugin/chocolate.vim` *nach* `~/.vim/plugin/chocolate.vim` aus.

## $VIMRUNTIME

Vim hat eine Umgebungsvariable `$VIMRUNTIME` für Standardskripte und Unterstützungsdateien. Sie können es überprüfen, indem Sie `:e $VIMRUNTIME` ausführen.

Die Struktur sollte Ihnen vertraut vorkommen. Sie enthält viele Laufzeitpfade, die Sie in diesem Kapitel gelernt haben.

Erinnern Sie sich, dass Sie in Kapitel 21 gelernt haben, dass Vim beim Öffnen nach vimrc-Dateien an sieben verschiedenen Orten sucht. Ich sagte, dass der letzte Ort, den Vim überprüft, `$VIMRUNTIME/defaults.vim` ist. Wenn Vim keine Benutzer-vimrc-Dateien findet, verwendet Vim eine `defaults.vim` als vimrc.

Haben Sie jemals versucht, Vim ohne ein Syntax-Plugin wie vim-polyglot auszuführen, und dennoch wird Ihre Datei weiterhin syntaktisch hervorgehoben? Das liegt daran, dass Vim, wenn es keine Syntaxdatei aus dem Laufzeitpfad findet, nach einer Syntaxdatei im `$VIMRUNTIME`-Syntaxverzeichnis sucht.

Um mehr zu erfahren, schauen Sie sich `:h $VIMRUNTIME` an.

## Runtimepath Option

Um Ihren Runtimepath zu überprüfen, führen Sie `:set runtimepath?` aus.

Wenn Sie Vim-Plug oder beliebte externe Plugin-Manager verwenden, sollte eine Liste von Verzeichnissen angezeigt werden. Zum Beispiel zeigt meine:

```shell
runtimepath=~/.vim,~/.vim/plugged/vim-signify,~/.vim/plugged/base16-vim,~/.vim/plugged/fzf.vim,~/.vim/plugged/fzf,~/.vim/plugged/vim-gutentags,~/.vim/plugged/tcomment_vim,~/.vim/plugged/emmet-vim,~/.vim/plugged/vim-fugitive,~/.vim/plugged/vim-sensible,~/.vim/plugged/lightline.vim, ...
```

Eine der Aufgaben von Plugin-Managern besteht darin, jedes Plugin in den Laufzeitpfad einzufügen. Jeder Laufzeitpfad kann eine eigene Verzeichnisstruktur ähnlich wie `~/.vim/` haben.

Wenn Sie ein Verzeichnis `~/box/of/donuts/` haben und dieses Verzeichnis zu Ihrem Laufzeitpfad hinzufügen möchten, können Sie dies in Ihre vimrc einfügen:

```shell
set rtp+=$HOME/box/of/donuts/
```

Wenn sich im Verzeichnis `~/box/of/donuts/` ein Plugin-Verzeichnis (`~/box/of/donuts/plugin/hello.vim`) und ein ftplugin (`~/box/of/donuts/ftplugin/chocodonut.vim`) befinden, führt Vim alle Skripte aus `plugin/hello.vim` aus, wenn Sie Vim öffnen. Vim führt auch `ftplugin/chocodonut.vim` aus, wenn Sie eine Chocodonut-Datei öffnen.

Versuchen Sie es selbst: Erstellen Sie einen beliebigen Pfad und fügen Sie ihn zu Ihrem Runtimepath hinzu. Fügen Sie einige der Laufzeitpfade hinzu, die Sie in diesem Kapitel gelernt haben. Stellen Sie sicher, dass sie wie erwartet funktionieren.

## Lernen Sie Runtime auf die smarte Art

Nehmen Sie sich Zeit, um es zu lesen und mit diesen Laufzeitpfaden zu experimentieren. Um zu sehen, wie Laufzeitpfade in der Praxis verwendet werden, gehen Sie zum Repository eines Ihrer Lieblings-Vim-Plugins und studieren Sie dessen Verzeichnisstruktur. Sie sollten jetzt in der Lage sein, die meisten von ihnen zu verstehen. Versuchen Sie, mitzufolgen und das große Ganze zu erkennen. Jetzt, da Sie die Verzeichnisstruktur von Vim verstehen, sind Sie bereit, Vimscript zu lernen.