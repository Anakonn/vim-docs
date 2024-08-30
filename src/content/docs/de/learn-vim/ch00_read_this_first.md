---
description: Dieser Leitfaden bietet eine kompakte Einführung in die wichtigsten Vim-Funktionen,
  um effizienter zu lernen und die nützlichsten Techniken zu meistern.
title: Ch00. Read This First
---

## Warum dieser Leitfaden geschrieben wurde

Es gibt viele Orte, um Vim zu lernen: der `vimtutor` ist ein großartiger Ausgangspunkt und das `:help`-Handbuch hat alle Referenzen, die Sie jemals benötigen werden.

Der durchschnittliche Benutzer benötigt jedoch etwas mehr als `vimtutor` und weniger als das `:help`-Handbuch. Dieser Leitfaden versucht, diese Lücke zu schließen, indem er nur die wichtigsten Funktionen hervorhebt, um die nützlichsten Teile von Vim in der kürzest möglichen Zeit zu lernen.

Die Chancen stehen gut, dass Sie nicht 100% der Vim-Funktionen benötigen. Wahrscheinlich müssen Sie nur etwa 20% davon kennen, um ein leistungsstarker Vimmer zu werden. Dieser Leitfaden zeigt Ihnen, welche Vim-Funktionen für Sie am nützlichsten sein werden.

Dies ist ein meinungsbasierter Leitfaden. Er behandelt Techniken, die ich häufig verwende, wenn ich Vim benutze. Die Kapitel sind in einer Reihenfolge angeordnet, die ich für die logischste für einen Anfänger halte, um Vim zu lernen.

Dieser Leitfaden ist beispielreich. Beim Erlernen einer neuen Fähigkeit sind Beispiele unverzichtbar; zahlreiche Beispiele werden diese Konzepte effektiver festigen.

Einige von Ihnen fragen sich vielleicht, warum Sie Vimscript lernen müssen? In meinem ersten Jahr mit Vim war ich zufrieden damit, nur zu wissen, wie man Vim benutzt. Die Zeit verging und ich begann, Vimscript immer mehr zu benötigen, um benutzerdefinierte Befehle für meine spezifischen Bearbeitungsbedürfnisse zu schreiben. Während Sie Vim meistern, werden Sie früher oder später Vimscript lernen müssen. Warum also nicht früher? Vimscript ist eine kleine Sprache. Sie können die Grundlagen in nur vier Kapiteln dieses Leitfadens lernen.

Sie können mit Vim weit kommen, ohne Vimscript zu kennen, aber es zu wissen, wird Ihnen helfen, noch weiter zu excelieren.

Dieser Leitfaden ist sowohl für Anfänger als auch für fortgeschrittene Vimmer geschrieben. Er beginnt mit breiten und einfachen Konzepten und endet mit spezifischen und fortgeschrittenen Konzepten. Wenn Sie bereits ein fortgeschrittener Benutzer sind, empfehle ich Ihnen dennoch, diesen Leitfaden von Anfang bis Ende zu lesen, denn Sie werden etwas Neues lernen!

## Wie man zu Vim wechselt, nachdem man einen anderen Texteditor verwendet hat

Vim zu lernen ist eine befriedigende Erfahrung, wenn auch schwierig. Es gibt zwei Hauptansätze, um Vim zu lernen:

1. Kalter Entzug
2. Allmählich

Kalter Entzug bedeutet, dass Sie aufhören, den Editor / die IDE zu verwenden, die Sie verwendet haben, und ab sofort ausschließlich Vim verwenden. Der Nachteil dieser Methode ist, dass Sie in der ersten Woche oder zwei einen ernsthaften Produktivitätsverlust erleiden werden. Wenn Sie ein Vollzeitprogrammierer sind, ist diese Methode möglicherweise nicht praktikabel. Deshalb glaube ich, dass der beste Weg für die meisten Menschen, zu Vim zu wechseln, darin besteht, es allmählich zu verwenden.

Um Vim allmählich zu verwenden, verbringen Sie in den ersten zwei Wochen eine Stunde am Tag mit Vim als Ihrem Editor, während Sie die restliche Zeit andere Editoren verwenden können. Viele moderne Editoren kommen mit Vim-Plugins. Als ich anfing, verwendete ich das beliebte Vim-Plugin von VSCode eine Stunde pro Tag. Ich erhöhte die Zeit mit dem Vim-Plugin allmählich, bis ich es schließlich den ganzen Tag verwendete. Beachten Sie, dass diese Plugins nur einen Bruchteil der Vim-Funktionen emulieren können. Um die volle Leistung von Vim wie Vimscript, Befehlszeilen (Ex) Befehle und die Integration externer Befehle zu erleben, müssen Sie Vim selbst verwenden.

Es gab zwei entscheidende Momente, die mich dazu brachten, Vim zu 100% zu verwenden: als ich begriff, dass Vim eine grammatikähnliche Struktur hat (siehe Kapitel 4) und das [fzf.vim](https://github.com/junegunn/fzf.vim) Plugin (siehe Kapitel 3).

Der erste Moment, als ich die grammatikähnliche Struktur von Vim erkannte, war der entscheidende Moment, in dem ich endlich verstand, worüber diese Vim-Benutzer sprachen. Ich musste nicht Hunderte von einzigartigen Befehlen lernen. Ich musste nur eine kleine Handvoll Befehle lernen, die ich auf sehr intuitive Weise verketten konnte, um viele Dinge zu tun.

Der zweite Moment, die Fähigkeit, schnell eine unscharfe Dateisuche durchzuführen, war die IDE-Funktion, die ich am häufigsten nutzte. Als ich lernte, wie man das in Vim macht, gewann ich einen erheblichen Geschwindigkeitsvorteil und habe seitdem nie zurückgeschaut.

Jeder programmiert anders. Bei der Introspektion werden Sie feststellen, dass es ein oder zwei Funktionen aus Ihrem bevorzugten Editor / IDE gibt, die Sie ständig verwenden. Vielleicht war es die unscharfe Suche, das Springen zur Definition oder die schnelle Kompilierung. Was auch immer es sein mag, identifizieren Sie diese schnell und lernen Sie, wie Sie diese in Vim implementieren können (die Chancen stehen gut, dass Vim sie wahrscheinlich auch kann). Ihre Bearbeitungsgeschwindigkeit wird einen enormen Schub erhalten.

Sobald Sie mit 50% der ursprünglichen Geschwindigkeit bearbeiten können, ist es Zeit, vollständig auf Vim umzusteigen.

## Wie man diesen Leitfaden liest

Dies ist ein praktischer Leitfaden. Um gut in Vim zu werden, müssen Sie Ihre Muskelgedächtnis entwickeln, nicht nur Wissen im Kopf.

Sie lernen nicht, wie man Fahrrad fährt, indem Sie einen Leitfaden darüber lesen, wie man Fahrrad fährt. Sie müssen tatsächlich Fahrrad fahren.

Sie müssen jeden Befehl, der in diesem Leitfaden erwähnt wird, eingeben. Nicht nur das, sondern Sie müssen sie mehrere Male wiederholen und verschiedene Kombinationen ausprobieren. Schauen Sie nach, welche anderen Funktionen der Befehl, den Sie gerade gelernt haben, hat. Der `:help`-Befehl und Suchmaschinen sind Ihre besten Freunde. Ihr Ziel ist es nicht, alles über einen Befehl zu wissen, sondern in der Lage zu sein, diesen Befehl natürlich und instinktiv auszuführen.

So sehr ich versuche, diesen Leitfaden linear zu gestalten, müssen einige Konzepte in diesem Leitfaden außerhalb der Reihenfolge präsentiert werden. Zum Beispiel erwähne ich im Kapitel 1 den Ersetzungsbefehl (`:s`), obwohl er erst im Kapitel 12 behandelt wird. Um dem entgegenzuwirken, werde ich, wann immer ein neues Konzept erwähnt wird, das noch nicht behandelt wurde, frühzeitig eine kurze Anleitung ohne detaillierte Erklärung bereitstellen. Also bitte haben Sie Nachsicht mit mir :).

## Mehr Hilfe

Hier ist ein zusätzlicher Tipp zur Verwendung des Hilfemanuals: Angenommen, Sie möchten mehr darüber erfahren, was `Ctrl-P` im Einfügemodus macht. Wenn Sie einfach nach `:h CTRL-P` suchen, werden Sie zum `Ctrl-P` des normalen Modus geleitet. Dies ist nicht die `Ctrl-P`-Hilfe, die Sie suchen. In diesem Fall suchen Sie stattdessen nach `:h i_CTRL-P`. Das angehängte `i_` steht für den Einfügemodus. Achten Sie darauf, zu welchem Modus es gehört.

## Syntax

Die meisten befehls- oder codebezogenen Phrasen sind im Code-Stil (`so`) geschrieben.

Strings sind von einem Paar doppelter Anführungszeichen ("so") umgeben.

Vim-Befehle können abgekürzt werden. Zum Beispiel kann `:join` als `:j` abgekürzt werden. Im gesamten Leitfaden werde ich die Kurzform und die Langform mischen. Für Befehle, die in diesem Leitfaden nicht häufig verwendet werden, werde ich die Langform verwenden. Für häufig verwendete Befehle werde ich die Kurzform verwenden. Ich entschuldige mich für die Inkonsistenzen. Im Allgemeinen sollten Sie, wann immer Sie einen neuen Befehl entdecken, ihn immer in `:help` überprüfen, um seine Abkürzungen zu sehen.

## Vimrc

An verschiedenen Stellen im Leitfaden werde ich auf vimrc-Optionen verweisen. Wenn Sie neu bei Vim sind, ist eine vimrc wie eine Konfigurationsdatei.

Die vimrc wird erst im Kapitel 21 behandelt. Um der Klarheit willen zeige ich hier kurz, wie man sie einrichtet.

Angenommen, Sie müssen die Nummernoptionen festlegen (`set number`). Wenn Sie noch keine vimrc haben, erstellen Sie eine. Sie wird normalerweise in Ihrem Home-Verzeichnis abgelegt und heißt `.vimrc`. Je nach Betriebssystem kann der Speicherort variieren. In macOS habe ich sie unter `~/.vimrc`. Um zu sehen, wo Sie Ihre ablegen sollten, schauen Sie sich `:h vimrc` an.

Fügen Sie darin `set number` hinzu. Speichern Sie es (`:w`), und dann laden Sie es (`:source %`). Sie sollten jetzt die Zeilennummern auf der linken Seite angezeigt bekommen.

Alternativ, wenn Sie keine dauerhafte Einstellung ändern möchten, können Sie den `set`-Befehl auch inline ausführen, indem Sie `:set number` ausführen. Der Nachteil dieses Ansatzes ist, dass diese Einstellung temporär ist. Wenn Sie Vim schließen, verschwindet die Option.

Da wir Vim lernen und nicht Vi, müssen Sie die Einstellung `nocompatible` haben. Fügen Sie `set nocompatible` in Ihre vimrc ein. Viele Vim-spezifische Funktionen sind deaktiviert, wenn es mit der `compatible`-Option läuft.

Im Allgemeinen, wann immer ein Abschnitt eine vimrc-Option erwähnt, fügen Sie einfach diese Option in die vimrc ein, speichern Sie sie und laden Sie sie.

## Zukunft, Fehler, Fragen

Erwarten Sie in Zukunft weitere Updates. Wenn Sie Fehler finden oder Fragen haben, zögern Sie bitte nicht, sich zu melden.

Ich habe auch noch einige weitere Kapitel geplant, also bleiben Sie dran!

## Ich möchte mehr Vim-Tricks

Um mehr über Vim zu lernen, folgen Sie bitte [@learnvim](https://twitter.com/learnvim).

## Dankeschön

Dieser Leitfaden wäre ohne Bram Moleenar, der Vim erstellt hat, meine Frau, die während der gesamten Reise sehr geduldig und unterstützend war, allen [Mitwirkenden](https://github.com/iggredible/Learn-Vim/graphs/contributors) des learn-vim-Projekts, der Vim-Community und vielen, vielen anderen, die nicht erwähnt wurden, nicht möglich gewesen.

Danke. Ihr alle helft, das Textbearbeiten spaßig zu machen :)