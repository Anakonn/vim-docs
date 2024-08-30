---
description: In diesem Kapitel lernen Sie, wie Sie mit Vim-Tags schnell zu Definitionen
  im Code gelangen und so den Code besser verstehen können.
title: Ch16. Tags
---

Eine nützliche Funktion beim Textbearbeiten ist die Möglichkeit, schnell zu jeder Definition zu springen. In diesem Kapitel lernen Sie, wie Sie Vim-Tags dafür verwenden können.

## Tag-Übersicht

Angenommen, jemand hat Ihnen einen neuen Codebestand übergeben:

```shell
one = One.new
one.donut
```

`One`? `donut`? Nun, das mag für die Entwickler, die den Code damals geschrieben haben, offensichtlich gewesen sein, aber jetzt sind diese Entwickler nicht mehr hier und es liegt an Ihnen, diese obskuren Codes zu verstehen. Eine Möglichkeit, dies zu verstehen, besteht darin, den Quellcode zu verfolgen, wo `One` und `donut` definiert sind.

Sie können nach ihnen mit `fzf` oder `grep` (oder `vimgrep`) suchen, aber in diesem Fall sind Tags schneller.

Denken Sie an Tags wie an ein Adressbuch:

```shell
Name    Adresse
Iggy1   1234 Cool St, 11111
Iggy2   9876 Awesome Ave, 2222
```

Anstelle eines Namens-Adressen-Paares speichern Tags Definitionen, die mit Adressen gekoppelt sind.

Angenommen, Sie haben diese beiden Ruby-Dateien im selben Verzeichnis:

```shell
## one.rb
class One
  def initialize
    puts "Initialisiert"
  end

  def donut
    puts "Bar"
  end
end
```

und

```shell
## two.rb
require './one'

one = One.new
one.donut
```

Um zu einer Definition zu springen, können Sie im normalen Modus `Ctrl-]` verwenden. Gehen Sie in `two.rb` zu der Zeile, in der `one.donut` steht, und bewegen Sie den Cursor über `donut`. Drücken Sie `Ctrl-]`.

Ups, Vim konnte die Tag-Datei nicht finden. Sie müssen zuerst die Tag-Datei generieren.

## Tag-Generator

Modernes Vim kommt nicht mit einem Tag-Generator, daher müssen Sie einen externen Tag-Generator herunterladen. Es gibt mehrere Optionen zur Auswahl:

- ctags = Nur C. Überall verfügbar.
- exuberant ctags = Eines der beliebtesten. Unterstützt viele Programmiersprachen.
- universal ctags = Ähnlich wie exuberant ctags, aber neuer.
- etags = Für Emacs. Hmm...
- JTags = Java
- ptags.py = Python
- ptags = Perl
- gnatxref = Ada

Wenn Sie sich online Vim-Tutorials ansehen, werden viele [exuberant ctags](http://ctags.sourceforge.net/) empfehlen. Es unterstützt [41 Programmiersprachen](http://ctags.sourceforge.net/languages.html). Ich habe es verwendet und es hat großartig funktioniert. Da es jedoch seit 2009 nicht mehr gewartet wird, wäre Universal ctags die bessere Wahl. Es funktioniert ähnlich wie exuberant ctags und wird derzeit gewartet.

Ich werde nicht ins Detail gehen, wie man die universal ctags installiert. Schauen Sie sich das [universal ctags](https://github.com/universal-ctags/ctags) Repository für weitere Anweisungen an.

Angenommen, Sie haben die universal ctags installiert, lassen Sie uns eine grundlegende Tag-Datei generieren. Führen Sie aus:

```shell
ctags -R .
```

Die Option `R` sagt ctags, dass es einen rekursiven Scan von Ihrem aktuellen Standort (`.`) durchführen soll. Sie sollten eine `tags`-Datei in Ihrem aktuellen Verzeichnis sehen. Darin sehen Sie etwas wie dies:

```shell
!_TAG_FILE_FORMAT	2	/erweiterte Format; --format=1 wird nicht ;" zu Zeilen anhängen/
!_TAG_FILE_SORTED	1	/0=unsortiert, 1=sortiert, 2=foldcase/
!_TAG_OUTPUT_FILESEP	slash	/slash oder backslash/
!_TAG_OUTPUT_MODE	u-ctags	/u-ctags oder e-ctags/
!_TAG_PATTERN_LENGTH_LIMIT	96	/0 für kein Limit/
!_TAG_PROGRAM_AUTHOR	Universal Ctags Team	//
!_TAG_PROGRAM_NAME	Universal Ctags	/Abgeleitet von Exuberant Ctags/
!_TAG_PROGRAM_URL	<https://ctags.io/>	/offizielle Seite/
!_TAG_PROGRAM_VERSION	0.0.0	/b43eb39/
One	one.rb	/^class One$/;"	c
donut	one.rb	/^  def donut$/;"	f	class:One
initialize	one.rb	/^  def initialize$/;"	f	class:One
```

Ihre könnte etwas anders aussehen, abhängig von Ihrer Vim-Einstellung und dem ctags-Generator. Eine Tag-Datei besteht aus zwei Teilen: den Tag-Metadaten und der Tag-Liste. Diese Metadaten (`!TAG_FILE...`) werden normalerweise vom ctags-Generator gesteuert. Ich werde hier nicht darauf eingehen, aber Sie können gerne deren Dokumentation für mehr Informationen überprüfen! Die Tag-Liste ist eine Liste aller Definitionen, die von ctags indiziert werden.

Gehen Sie jetzt zu `two.rb`, setzen Sie den Cursor auf `donut` und tippen Sie `Ctrl-]`. Vim bringt Sie zur Datei `one.rb` auf der Zeile, wo `def donut` steht. Erfolg! Aber wie hat Vim das gemacht?

## Tags-Anatomie

Schauen wir uns das Tag-Element `donut` an:

```shell
donut	one.rb	/^  def donut$/;"	f	class:One
```

Das obige Tag-Element besteht aus vier Komponenten: einem `tagname`, einer `tagfile`, einer `tagaddress` und Tag-Optionen.
- `donut` ist der `tagname`. Wenn sich Ihr Cursor auf "donut" befindet, sucht Vim in der Tag-Datei nach einer Zeile, die den String "donut" enthält.
- `one.rb` ist die `tagfile`. Vim sucht nach einer Datei `one.rb`.
- `/^ def donut$/` ist die `tagaddress`. `/.../` ist ein Musterindikator. `^` ist ein Muster für das erste Element in einer Zeile. Es folgt zwei Leerzeichen, dann der String `def donut`. Schließlich ist `$` ein Muster für das letzte Element in einer Zeile.
- `f class:One` ist die Tag-Option, die Vim sagt, dass die Funktion `donut` eine Funktion (`f`) ist und Teil der Klasse `One` ist.

Schauen wir uns ein weiteres Element in der Tag-Liste an:

```shell
One	one.rb	/^class One$/;"	c
```

Diese Zeile funktioniert auf die gleiche Weise wie das `donut`-Muster:

- `One` ist der `tagname`. Beachten Sie, dass bei Tags der erste Scan großgeschrieben wird. Wenn Sie `One` und `one` in der Liste haben, priorisiert Vim `One` über `one`.
- `one.rb` ist die `tagfile`. Vim sucht nach einer Datei `one.rb`.
- `/^class One$/` ist das `tagaddress`-Muster. Vim sucht nach einer Zeile, die mit (`^`) `class` beginnt und mit (`$`) `One` endet.
- `c` ist eine der möglichen Tag-Optionen. Da `One` eine Ruby-Klasse und kein Verfahren ist, wird es mit einem `c` markiert.

Abhängig davon, welchen Tag-Generator Sie verwenden, kann der Inhalt Ihrer Tag-Datei unterschiedlich aussehen. Mindestens muss eine Tag-Datei eines dieser Formate haben:

```shell
1.  {tagname} {TAB} {tagfile} {TAB} {tagaddress}
2.  {tagname} {TAB} {tagfile} {TAB} {tagaddress} {term} {field} ..
```

## Die Tag-Datei

Sie haben gelernt, dass eine neue Datei, `tags`, nach dem Ausführen von `ctags -R .` erstellt wird. Wie weiß Vim, wo es nach der Tag-Datei suchen soll?

Wenn Sie `:set tags?` ausführen, sehen Sie möglicherweise `tags=./tags,tags` (abhängig von Ihren Vim-Einstellungen kann es anders sein). Hier sucht Vim nach allen Tags im Pfad der aktuellen Datei im Fall von `./tags` und im aktuellen Verzeichnis (Ihr Projektstamm) im Fall von `tags`.

Auch im Fall von `./tags` wird Vim zuerst nach einer Tag-Datei im Pfad Ihrer aktuellen Datei suchen, egal wie verschachtelt sie ist, dann wird es nach einer Tag-Datei im aktuellen Verzeichnis (Projektstamm) suchen. Vim stoppt, nachdem es die erste Übereinstimmung gefunden hat.

Wenn Ihre `'tags'`-Datei gesagt hätte `tags=./tags,tags,/user/iggy/mytags/tags`, würde Vim auch im Verzeichnis `/user/iggy/mytags` nach einer Tag-Datei suchen, nachdem Vim die Verzeichnisse `./tags` und `tags` durchsucht hat. Sie müssen Ihre Tag-Datei nicht in Ihrem Projekt speichern, Sie können sie separat aufbewahren.

Um einen neuen Tag-Dateispeicherort hinzuzufügen, verwenden Sie Folgendes:

```shell
set tags+=path/to/my/tags/file
```

## Generierung von Tags für ein großes Projekt

Wenn Sie versucht haben, ctags in einem großen Projekt auszuführen, kann es lange dauern, da Vim auch in jedem verschachtelten Verzeichnis nachsieht. Wenn Sie ein Javascript-Entwickler sind, wissen Sie, dass `node_modules` sehr groß sein kann. Stellen Sie sich vor, Sie haben fünf Unterprojekte und jedes enthält sein eigenes `node_modules`-Verzeichnis. Wenn Sie `ctags -R .` ausführen, wird ctags versuchen, alle 5 `node_modules` zu scannen. Wahrscheinlich müssen Sie ctags nicht auf `node_modules` ausführen.

Um ctags auszuführen und `node_modules` auszuschließen, führen Sie aus:

```shell
ctags -R --exclude=node_modules .
```

Diesmal sollte es weniger als eine Sekunde dauern. Übrigens können Sie die `exclude`-Option mehrmals verwenden:

```shell
ctags -R --exclude=.git --exclude=vendor --exclude=node_modules --exclude=db --exclude=log .
```

Der Punkt ist, wenn Sie ein Verzeichnis ausschließen möchten, ist `--exclude` Ihr bester Freund.

## Tags-Navigation

Sie können mit nur `Ctrl-]` gute Ergebnisse erzielen, aber lassen Sie uns noch ein paar Tricks lernen. Die Tag-Sprungtaste `Ctrl-]` hat eine Alternative im Befehlszeilenmodus: `:tag {tag-name}`. Wenn Sie ausführen:

```shell
:tag donut
```

Wird Vim zu der `donut`-Methode springen, genau wie bei `Ctrl-]` auf den String "donut". Sie können das Argument auch mit `<Tab>` vervollständigen:

```shell
:tag d<Tab>
```

Vim listet alle Tags auf, die mit "d" beginnen. In diesem Fall "donut".

In einem echten Projekt können Sie auf mehrere Methoden mit demselben Namen stoßen. Lassen Sie uns die beiden Ruby-Dateien von früher aktualisieren. In `one.rb`:

```shell
## one.rb
class One
  def initialize
    puts "Initialisiert"
  end

  def donut
    puts "eine donut"
  end

  def pancake
    puts "eine pancake"
  end
end
```

In `two.rb`:

```shell
## two.rb
require './one.rb'

def pancake
  "Zwei pancakes"
end

one = One.new
one.donut
puts pancake
```

Wenn Sie mit dem Programmieren fortfahren, vergessen Sie nicht, `ctags -R .` erneut auszuführen, da Sie jetzt mehrere neue Verfahren haben. Sie haben zwei Instanzen des Verfahrens `pancake`. Wenn Sie sich in `two.rb` befinden und `Ctrl-]` drücken, was würde passieren?

Vim wird zu `def pancake` in `two.rb` springen, nicht zu `def pancake` in `one.rb`. Dies liegt daran, dass Vim das Verfahren `pancake` in `two.rb` als höherpriorisiert ansieht als das andere Verfahren `pancake`.

## Tag-Priorität

Nicht alle Tags sind gleich. Einige Tags haben höhere Prioritäten. Wenn Vim mit doppelten Elementnamen konfrontiert wird, überprüft Vim die Priorität des Schlüsselworts. Die Reihenfolge ist:

1. Ein vollständig übereinstimmendes statisches Tag in der aktuellen Datei.
2. Ein vollständig übereinstimmendes globales Tag in der aktuellen Datei.
3. Ein vollständig übereinstimmendes globales Tag in einer anderen Datei.
4. Ein vollständig übereinstimmendes statisches Tag in einer anderen Datei.
5. Ein fallunempfindlich übereinstimmendes statisches Tag in der aktuellen Datei.
6. Ein fallunempfindlich übereinstimmendes globales Tag in der aktuellen Datei.
7. Ein fallunempfindlich übereinstimmendes globales Tag in einer anderen Datei.
8. Ein fallunempfindlich übereinstimmendes statisches Tag in der aktuellen Datei.

Laut der Prioritätenliste priorisiert Vim die exakte Übereinstimmung, die in derselben Datei gefunden wurde. Deshalb wählt Vim das Verfahren `pancake` in `two.rb` über das Verfahren `pancake` in `one.rb`. Es gibt einige Ausnahmen von der oben genannten Prioritätenliste, abhängig von Ihren Einstellungen `'tagcase'`, `'ignorecase'` und `'smartcase'`, aber ich werde hier nicht darauf eingehen. Wenn Sie interessiert sind, schauen Sie sich `:h tag-priority` an.

## Selektive Tag-Sprünge

Es wäre schön, wenn Sie auswählen könnten, zu welchen Tag-Elementen Sie springen möchten, anstatt immer zum Tag-Element mit der höchsten Priorität zu gehen. Vielleicht müssen Sie tatsächlich zur Methode `pancake` in `one.rb` und nicht zur in `two.rb`. Um dies zu tun, können Sie `:tselect` verwenden. Führen Sie aus:

```shell
:tselect pancake
```

Sie werden am unteren Bildschirmrand sehen:
## pri kind tag               datei
1 F C f    pancake           two.rb
             def pancake
2 F   f    pancake           one.rb
             class:One
             def pancake
```

Wenn Sie 2 eingeben, springt Vim zur Prozedur in `one.rb`. Wenn Sie 1 eingeben, springt Vim zur Prozedur in `two.rb`.

Achten Sie auf die `pri`-Spalte. Sie haben `F C` beim ersten Treffer und `F` beim zweiten Treffer. Das ist es, was Vim verwendet, um die Tag-Priorität zu bestimmen. `F C` bedeutet ein vollständig übereinstimmendes (`F`) globales Tag in der aktuellen (`C`) Datei. `F` bedeutet nur ein vollständig übereinstimmendes (`F`) globales Tag. `F C` hat immer eine höhere Priorität als `F`.

Wenn Sie `:tselect donut` ausführen, fordert Vim Sie auch auf, auszuwählen, zu welchem Tag-Element Sie springen möchten, obwohl es nur eine Option zur Auswahl gibt. Gibt es eine Möglichkeit für Vim, die Tag-Liste nur dann anzuzeigen, wenn es mehrere Übereinstimmungen gibt, und sofort zu springen, wenn nur ein Tag gefunden wird?

Natürlich! Vim hat eine `:tjump`-Methode. Führen Sie aus:

```shell
:tjump donut
```

Vim springt sofort zur `donut`-Prozedur in `one.rb`, ähnlich wie bei der Ausführung von `:tag donut`. Führen Sie jetzt aus:

```shell
:tjump pancake
```

Vim fordert Sie auf, Tag-Optionen auszuwählen, ähnlich wie bei der Ausführung von `:tselect pancake`. Mit `tjump` erhalten Sie das Beste aus beiden Methoden.

Vim hat einen normalen Modus-Taste für `tjump`: `g Ctrl-]`. Ich persönlich mag `g Ctrl-]` besser als `Ctrl-]`.

## Autovervollständigung mit Tags

Tags können bei Autovervollständigungen helfen. Erinnern Sie sich aus Kapitel 6, Einfügemodus, dass Sie `Ctrl-X`-Submodus verwenden können, um verschiedene Autovervollständigungen durchzuführen. Ein Autovervollständigungs-Submodus, den ich nicht erwähnt habe, war `Ctrl-]`. Wenn Sie `Ctrl-X Ctrl-]` im Einfügemodus ausführen, verwendet Vim die Tag-Datei zur Autovervollständigung.

Wenn Sie in den Einfügemodus gehen und `Ctrl-x Ctrl-]` eingeben, sehen Sie:

```shell
One
donut
initialize
pancake
```

## Tag-Stack

Vim führt eine Liste aller Tags, zu denen Sie gesprungen sind und von denen Sie gesprungen sind, in einem Tag-Stack. Sie können diesen Stack mit `:tags` anzeigen. Wenn Sie zuerst zu `pancake` gesprungen sind, gefolgt von `donut`, und `:tags` ausführen, sehen Sie:

```shell
  # ZU tag         VON Zeile  in datei/text
  1  1 pancake            10  ch16_tags/two.rb
  2  1 donut               9  ch16_tags/two.rb
>
```

Beachten Sie das `>`-Symbol oben. Es zeigt Ihre aktuelle Position im Stack an. Um den Stack "zu poppen", um zu einem vorherigen Stack zurückzukehren, können Sie `:pop` ausführen. Versuchen Sie es, und führen Sie dann erneut `:tags` aus:

```shell
  # ZU tag         VON Zeile  in datei/text
  1  1 pancake            10  puts pancake
> 2  1 donut               9  one.donut

```

Beachten Sie, dass das `>`-Symbol jetzt in Zeile zwei ist, wo sich `donut` befindet. Poppen Sie noch einmal, und führen Sie dann erneut `:tags` aus:

```shell
  # ZU tag         VON Zeile  in datei/text
> 1  1 pancake            10  puts pancake
  2  1 donut               9  one.donut
```

Im normalen Modus können Sie `Ctrl-t` ausführen, um denselben Effekt wie `:pop` zu erzielen.

## Automatische Tag-Generierung

Einer der größten Nachteile von Vim-Tags ist, dass Sie jedes Mal, wenn Sie eine wesentliche Änderung vornehmen, die Tag-Datei neu generieren müssen. Wenn Sie kürzlich die `pancake`-Prozedur in die `waffle`-Prozedur umbenannt haben, wusste die Tag-Datei nicht, dass die `pancake`-Prozedur umbenannt wurde. Sie speicherte weiterhin `pancake` in der Liste der Tags. Sie müssen `ctags -R .` ausführen, um eine aktualisierte Tag-Datei zu erstellen. Eine neue Tag-Datei auf diese Weise zu erstellen, kann umständlich sein.

Glücklicherweise gibt es mehrere Methoden, die Sie verwenden können, um Tags automatisch zu generieren.

## Tag beim Speichern generieren

Vim hat eine Autocommand (`autocmd`)-Methode, um einen Befehl bei einem Ereignis auszuführen. Sie können dies verwenden, um Tags bei jedem Speichern zu generieren. Führen Sie aus:

```shell
:autocmd BufWritePost *.rb silent !ctags -R .
```

Aufschlüsselung:
- `autocmd` ist ein Befehlszeilenbefehl. Es akzeptiert ein Ereignis, ein Dateimuster und einen Befehl.
- `BufWritePost` ist ein Ereignis zum Speichern eines Puffers. Jedes Mal, wenn Sie eine Datei speichern, lösen Sie ein `BufWritePost`-Ereignis aus.
- `.rb` ist ein Dateimuster für Ruby-Dateien.
- `silent` ist tatsächlich Teil des Befehls, den Sie übergeben. Ohne dies zeigt Vim bei jedem Auslösen des Autocommand `press ENTER or type command to continue` an.
- `!ctags -R .` ist der auszuführende Befehl. Denken Sie daran, dass `!cmd` von innerhalb von Vim einen Terminalbefehl ausführt.

Jetzt wird Vim jedes Mal, wenn Sie von einer Ruby-Datei aus speichern, `ctags -R .` ausführen.

## Verwendung von Plugins

Es gibt mehrere Plugins, um ctags automatisch zu generieren:

- [vim-gutentags](https://github.com/ludovicchabant/vim-gutentags)
- [vim-tags](https://github.com/szw/vim-tags)
- [vim-easytags](https://github.com/xolox/vim-easytags)
- [vim-autotag](https://github.com/craigemery/vim-autotag)

Ich benutze vim-gutentags. Es ist einfach zu bedienen und funktioniert sofort.

## Ctags und Git Hooks

Tim Pope, Autor vieler großartiger Vim-Plugins, schrieb einen Blog, in dem er vorschlug, Git-Hooks zu verwenden. [Schau es dir an](https://tbaggery.com/2011/08/08/effortless-ctags-with-git.html).

## Lernen Sie Tags auf die smarte Art

Ein Tag ist nützlich, wenn es richtig konfiguriert ist. Angenommen, Sie stehen vor einem neuen Codebasis und möchten verstehen, was `functionFood` tut, können Sie es leicht lesen, indem Sie zu seiner Definition springen. Dort lernen Sie, dass es auch `functionBreakfast` aufruft. Sie folgen ihm und erfahren, dass es `functionPancake` aufruft. Ihr Funktionsaufrufgraph sieht ungefähr so aus:

```shell
functionFood -> functionBreakfast -> functionPancake
```

Das gibt Ihnen Einblick, dass dieser Codefluss damit zusammenhängt, ein Pfannkuchen zum Frühstück zu haben.

Um mehr über Tags zu erfahren, schauen Sie sich `:h tags` an. Jetzt, da Sie wissen, wie man Tags verwendet, lassen Sie uns eine andere Funktion erkunden: Falten.