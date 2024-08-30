---
description: Dieser Leitfaden erklärt die verschiedenen Vim-Registertypen und deren
  effiziente Nutzung, um wiederholtes Tippen zu vermeiden und die Produktivität zu
  steigern.
title: Ch08. Registers
---

Lernen von Vim-Register ist wie das erste Mal Algebra lernen. Du hast nicht gedacht, dass du es brauchst, bis du es gebraucht hast.

Du hast wahrscheinlich Vim-Register verwendet, als du einen Text kopiert oder gelöscht hast und ihn dann mit `p` oder `P` eingefügt hast. Wusstest du jedoch, dass Vim 10 verschiedene Arten von Registern hat? Richtig verwendet, können Vim-Register dir das wiederholte Tippen ersparen.

In diesem Kapitel werde ich alle Vim-Registertypen und deren effiziente Nutzung durchgehen.

## Die Zehn Registertypen

Hier sind die 10 Vim-Registertypen:

1. Das unbenannte Register (`""`).
2. Die nummerierten Register (`"0-9`).
3. Das kleine Löschregister (`"-`).
4. Die benannten Register (`"a-z`).
5. Die schreibgeschützten Register (`":`, `".`, und `"%`).
6. Das alternative Datei-Register (`"#`).
7. Das Ausdrucksregister (`"=`).
8. Die Auswahlregister (`"*` und `"+`).
9. Das schwarze Loch-Register (`"_`).
10. Das letzte Suchmuster-Register (`"/`).

## Registeroperatoren

Um Register zu verwenden, musst du sie zuerst mit Operatoren speichern. Hier sind einige Operatoren, die Werte in Register speichern:

```shell
y    Yank (kopieren)
c    Text löschen und den Einfügemodus starten
d    Text löschen
```

Es gibt weitere Operatoren (wie `s` oder `x`), aber die oben genannten sind die nützlichen. Die Faustregel ist: Wenn ein Operator einen Text entfernen kann, speichert er wahrscheinlich den Text in Registern.

Um einen Text aus Registern einzufügen, kannst du verwenden:

```shell
p    Füge den Text nach dem Cursor ein
P    Füge den Text vor dem Cursor ein
```

Sowohl `p` als auch `P` akzeptieren eine Anzahl und ein Registrarsymbol als Argumente. Zum Beispiel, um zehnmal einzufügen, mache `10p`. Um den Text aus dem Register a einzufügen, mache `"ap`. Um den Text aus dem Register a zehnmal einzufügen, mache `10"ap`. Übrigens steht das `p` technisch gesehen für "put", nicht für "paste", aber ich denke, "paste" ist ein gebräuchlicheres Wort.

Die allgemeine Syntax, um den Inhalt aus einem bestimmten Register zu erhalten, ist `"a`, wobei `a` das Registrarsymbol ist.

## Aufrufen von Registern aus dem Einfügemodus

Alles, was du in diesem Kapitel lernst, kann auch im Einfügemodus ausgeführt werden. Um den Text aus dem Register a zu erhalten, machst du normalerweise `"ap`. Aber wenn du im Einfügemodus bist, führe `Ctrl-R a` aus. Die Syntax zum Aufrufen von Registern aus dem Einfügemodus ist:

```shell
Ctrl-R a
```

Wobei `a` das Registrarsymbol ist. Jetzt, da du weißt, wie man Register speichert und abruft, lass uns eintauchen!

## Das unbenannte Register

Um den Text aus dem unbenannten Register zu erhalten, mache `""p`. Es speichert den letzten Text, den du kopiert, geändert oder gelöscht hast. Wenn du einen weiteren Yank, eine Änderung oder Löschung machst, wird Vim automatisch den alten Text ersetzen. Das unbenannte Register ist wie die Standard-Copy/Paste-Operation eines Computers.

Standardmäßig ist `p` (oder `P`) mit dem unbenannten Register verbunden (von nun an werde ich auf das unbenannte Register mit `p` anstelle von `""p` verweisen).

## Die nummerierten Register

Nummerierte Register füllen sich automatisch in aufsteigender Reihenfolge. Es gibt 2 verschiedene nummerierte Register: das yankte Register (`0`) und die nummerierten Register (`1-9`). Lass uns zuerst das yankte Register besprechen.

### Das yankte Register

Wenn du eine gesamte Zeile Text yankst (`yy`), speichert Vim diesen Text tatsächlich in zwei Registern:

1. Das unbenannte Register (`p`).
2. Das yankte Register (`"0p`).

Wenn du einen anderen Text yankst, aktualisiert Vim sowohl das yankte Register als auch das unbenannte Register. Alle anderen Operationen (wie löschen) werden nicht im Register 0 gespeichert. Dies kann zu deinem Vorteil genutzt werden, denn solange du keinen weiteren Yank machst, wird der yankte Text immer vorhanden sein, egal wie viele Änderungen und Löschungen du vornimmst.

Wenn du zum Beispiel:
1. Eine Zeile yankst (`yy`)
2. Eine Zeile löschst (`dd`)
3. Eine weitere Zeile löschst (`dd`)

Hat das yankte Register den Text aus Schritt eins.

Wenn du:
1. Eine Zeile yankst (`yy`)
2. Eine Zeile löschst (`dd`)
3. Eine andere Zeile yankst (`yy`)

Hat das yankte Register den Text aus Schritt drei.

Ein letzter Tipp: Während du im Einfügemodus bist, kannst du den Text, den du gerade yankst, schnell mit `Ctrl-R 0` einfügen.

### Die nummerierten Register ungleich Null

Wenn du einen Text änderst oder löschst, der mindestens eine Zeile lang ist, wird dieser Text in den nummerierten Registern 1-9 nach dem zuletzt verwendeten gespeichert.

Wenn du zum Beispiel diese Zeilen hast:

```shell
Zeile drei
Zeile zwei
Zeile eins
```

Mit dem Cursor auf "Zeile drei", lösche sie nacheinander mit `dd`. Sobald alle Zeilen gelöscht sind, sollte Register 1 "Zeile eins" (die aktuellste), Register zwei "Zeile zwei" (die zweitaktuellste) und Register drei "Zeile drei" (die älteste) enthalten. Um den Inhalt aus Register eins zu erhalten, mache `"1p`.

Als Anmerkung: Diese nummerierten Register werden automatisch erhöht, wenn der Punktbefehl verwendet wird. Wenn dein nummeriertes Register eins (`"1`) "Zeile eins" enthält, Register zwei (`"2`) "Zeile zwei" und Register drei (`"3`) "Zeile drei", kannst du sie nacheinander mit diesem Trick einfügen:
- Mache `"1P`, um den Inhalt aus dem nummerierten Register eins ("1) einzufügen.
- Mache `.` um den Inhalt aus dem nummerierten Register zwei ("2) einzufügen.
- Mache `.` um den Inhalt aus dem nummerierten Register drei ("3) einzufügen.

Dieser Trick funktioniert mit jedem nummerierten Register. Wenn du mit `"5P` begonnen hast, würde `.` `"6P` machen, `.` erneut würde `"7P` machen, und so weiter.

Kleine Löschungen wie das Löschen eines Wortes (`dw`) oder das Ändern eines Wortes (`cw`) werden nicht in den nummerierten Registern gespeichert. Sie werden im kleinen Löschregister (`"-`) gespeichert, das ich als nächstes besprechen werde.

## Das kleine Löschregister

Änderungen oder Löschungen, die weniger als eine Zeile lang sind, werden nicht in den nummerierten Registern 0-9 gespeichert, sondern im kleinen Löschregister (`"-`).

Zum Beispiel:
1. Lösche ein Wort (`diw`)
2. Lösche eine Zeile (`dd`)
3. Lösche eine Zeile (`dd`)

`"-p` gibt dir das gelöschte Wort aus Schritt eins.

Ein weiteres Beispiel:
1. Ich lösche ein Wort (`diw`)
2. Ich lösche eine Zeile (`dd`)
3. Ich lösche ein Wort (`diw`)

`"-p` gibt dir das gelöschte Wort aus Schritt drei. `"1p` gibt dir die gelöschte Zeile aus Schritt zwei. Leider gibt es keine Möglichkeit, das gelöschte Wort aus Schritt eins wiederherzustellen, da das kleine Löschregister nur einen Artikel speichert. Wenn du jedoch den Text aus Schritt eins bewahren möchtest, kannst du dies mit den benannten Registern tun.

## Das benannte Register

Die benannten Register sind das vielseitigste Register von Vim. Es kann yankte, geänderte und gelöschte Texte in die Register a-z speichern. Im Gegensatz zu den vorherigen 3 Registertypen, die automatisch Texte in Registern speichern, musst du Vim explizit mitteilen, dass du das benannte Register verwenden möchtest, was dir die volle Kontrolle gibt.

Um ein Wort in das Register a zu yankten, kannst du es mit `"ayiw` tun.
- `"a` sagt Vim, dass die nächste Aktion (löschen / ändern / yankten) im Register a gespeichert wird.
- `yiw` yankte das Wort.

Um den Text aus Register a zu erhalten, führe `"ap` aus. Du kannst alle sechsundzwanzig Buchstaben des Alphabets verwenden, um sechsundzwanzig verschiedene Texte mit benannten Registern zu speichern.

Manchmal möchtest du vielleicht zu deinem bestehenden benannten Register hinzufügen. In diesem Fall kannst du deinen Text anhängen, anstatt alles neu zu beginnen. Um dies zu tun, kannst du die Großbuchstabenversion dieses Registers verwenden. Zum Beispiel, nehmen wir an, du hast das Wort "Hallo " bereits im Register a gespeichert. Wenn du "Welt" in das Register a hinzufügen möchtest, kannst du den Text "Welt" finden und ihn mit dem A-Register yankten (`"Ayiw`).

## Die schreibgeschützten Register

Vim hat drei schreibgeschützte Register: `.`, `:`, und `%`. Sie sind ziemlich einfach zu verwenden:

```shell
.    Speichert den zuletzt eingefügten Text
:    Speichert den zuletzt ausgeführten Befehl
%    Speichert den Namen der aktuellen Datei
```

Wenn der letzte Text, den du geschrieben hast, "Hallo Vim" war, gibt `".p` den Text "Hallo Vim" aus. Wenn du den Namen der aktuellen Datei erhalten möchtest, führe `"%p` aus. Wenn du den Befehl `:s/foo/bar/g` ausführst, gibt `":p` den wörtlichen Text "s/foo/bar/g" aus.

## Das alternative Datei-Register

In Vim steht `#` normalerweise für die alternative Datei. Eine alternative Datei ist die letzte Datei, die du geöffnet hast. Um den Namen der alternativen Datei einzufügen, kannst du `"#p` verwenden.

## Das Ausdrucksregister

Vim hat ein Ausdrucksregister, `"=`, um Ausdrücke auszuwerten.

Um mathematische Ausdrücke wie `1 + 1` auszuwerten, führe aus:

```shell
"=1+1<Enter>p
```

Hier sagst du Vim, dass du das Ausdrucksregister mit `"=` verwendest. Dein Ausdruck ist (`1 + 1`). Du musst `p` eingeben, um das Ergebnis zu erhalten. Wie bereits erwähnt, kannst du auch im Einfügemodus auf das Register zugreifen. Um mathematische Ausdrücke im Einfügemodus auszuwerten, kannst du Folgendes tun:

```shell
Ctrl-R =1+1
```

Du kannst auch die Werte aus jedem Register über das Ausdrucksregister abrufen, wenn du `@` anhängst. Wenn du den Text aus Register a erhalten möchtest:

```shell
"=@a
```

Drücke dann `<Enter>`, dann `p`. Ähnlich, um Werte aus Register a im Einfügemodus zu erhalten:

```shell
Ctrl-r =@a
```

Ausdrücke sind ein weites Thema in Vim, daher werde ich hier nur die Grundlagen behandeln. Ich werde in späteren Vimscript-Kapiteln ausführlicher auf Ausdrücke eingehen.

## Die Auswahlregister

Wünscht du dir nicht manchmal, dass du einen Text aus externen Programmen kopieren und lokal in Vim einfügen kannst, und umgekehrt? Mit Vims Auswahlregistern kannst du das. Vim hat zwei Auswahlregister: `quotestar` (`"*`) und `quoteplus` (`"+`). Du kannst sie verwenden, um kopierten Text aus externen Programmen zuzugreifen.

Wenn du in einem externen Programm (wie dem Chrome-Browser) bist und einen Textblock mit `Ctrl-C` (oder `Cmd-C`, je nach deinem Betriebssystem) kopierst, kannst du normalerweise `p` nicht verwenden, um den Text in Vim einzufügen. Allerdings sind sowohl Vims `"+` als auch `"*` mit deiner Zwischenablage verbunden, sodass du den Text tatsächlich mit `"+p` oder `"*p` einfügen kannst. Umgekehrt, wenn du ein Wort aus Vim mit `"+yiw` oder `"*yiw` yankst, kannst du diesen Text im externen Programm mit `Ctrl-V` (oder `Cmd-V`) einfügen. Beachte, dass dies nur funktioniert, wenn dein Vim-Programm die Option `+clipboard` hat (um dies zu überprüfen, führe `:version` aus).

Du fragst dich vielleicht, wenn `"*` und `"+` dasselbe tun, warum hat Vim dann zwei verschiedene Register? Einige Maschinen verwenden das X11-Fenstersystem. Dieses System hat 3 Arten von Auswahlen: primär, sekundär und Zwischenablage. Wenn deine Maschine X11 verwendet, verwendet Vim X11s *primäre* Auswahl mit dem `quotestar` (`"*`) Register und X11s *Zwischenablage* Auswahl mit dem `quoteplus` (`"+`) Register. Dies gilt nur, wenn du die Option `+xterm_clipboard` in deinem Vim-Build verfügbar hast. Wenn dein Vim kein `xterm_clipboard` hat, ist das kein großes Problem. Es bedeutet nur, dass sowohl `quotestar` als auch `quoteplus` austauschbar sind (meiner hat das auch nicht).

Ich finde es umständlich, `=*p` oder `=+p` (oder `"*p` oder `"+p`) zu machen. Um Vim zu ermöglichen, kopierten Text aus dem externen Programm einfach mit `p` einzufügen, kannst du dies in deiner vimrc hinzufügen:

```shell
set clipboard=unnamed
```

Jetzt, wenn ich einen Text aus einem externen Programm kopiere, kann ich ihn mit dem unbenannten Register `p` einfügen. Ich kann auch einen Text aus Vim kopieren und in ein externes Programm einfügen. Wenn du `+xterm_clipboard` hast, möchtest du vielleicht sowohl die Optionen `unnamed` als auch `unnamedplus` verwenden.

## Das schwarze Loch-Register

Jedes Mal, wenn du einen Text löschst oder änderst, wird dieser Text automatisch im Vim-Register gespeichert. Es wird Zeiten geben, in denen du nichts in das Register speichern möchtest. Wie kannst du das tun?

Du kannst das schwarze Loch-Register (`"_`) verwenden. Um eine Zeile zu löschen und zu verhindern, dass Vim die gelöschte Zeile in ein Register speichert, verwende `"_dd`.

Das schwarze Loch-Register ist wie das `/dev/null` der Register.

## Das letzte Suchmuster-Register

Um deine letzte Suche (`/` oder `?`) einzufügen, kannst du das letzte Suchmuster-Register (`"/`) verwenden. Um den letzten Suchbegriff einzufügen, verwende `"/p`.

## Anzeigen der Register

Um alle deine Register anzuzeigen, verwende den Befehl `:register`. Um nur die Register "a, "1 und "-", anzuzeigen, verwende `:register a 1 -`.

Es gibt ein Plugin namens [vim-peekaboo](https://github.com/junegunn/vim-peekaboo), das es dir ermöglicht, den Inhalt der Register zu sehen, wenn du im normalen Modus `"` oder `@` und im Einfügemodus `Ctrl-R` drückst. Ich finde dieses Plugin sehr nützlich, da ich mir meistens nicht an den Inhalt meiner Register erinnern kann. Probiere es aus!

## Ausführen eines Registers

Die benannten Register sind nicht nur zum Speichern von Texten gedacht. Sie können auch Makros mit `@` ausführen. Ich werde im nächsten Kapitel auf Makros eingehen.

Beachte, dass Makros in Vim-Registern gespeichert sind, sodass du versehentlich den gespeicherten Text mit Makros überschreiben kannst. Wenn du den Text "Hallo Vim" im Register a speicherst und später ein Makro im selben Register aufzeichnest (`qa{macro-sequence}q`), wird dieses Makro deinen zuvor gespeicherten "Hallo Vim"-Text überschreiben.
## Löschen eines Registers

Technisch gesehen ist es nicht notwendig, ein Register zu löschen, da der nächste Text, den Sie unter demselben Registrierungsnamen speichern, es überschreibt. Sie können jedoch schnell ein benanntes Register löschen, indem Sie ein leeres Makro aufzeichnen. Wenn Sie beispielsweise `qaq` ausführen, wird Vim ein leeres Makro im Register a aufzeichnen.

Eine weitere Möglichkeit ist, den Befehl `:call setreg('a', 'hello register a')` auszuführen, wobei a das Register a ist und "hello register a" der Text ist, den Sie speichern möchten.

Eine weitere Möglichkeit, ein Register zu löschen, besteht darin, den Inhalt von "a" auf einen leeren String mit dem Ausdruck `:let @a = ''` zu setzen.

## Den Inhalt eines Registers einfügen

Sie können den Befehl `:put` verwenden, um den Inhalt eines beliebigen Registers einzufügen. Wenn Sie beispielsweise `:put a` ausführen, wird der Inhalt des Registers a unter der aktuellen Zeile ausgegeben. Dies verhält sich ähnlich wie `"ap`, mit dem Unterschied, dass der Normalmodus-Befehl `p` den Registerinhalt nach dem Cursor ausgibt und der Befehl `:put` den Registerinhalt am Zeilenumbruch ausgibt.

Da `:put` ein Befehlszeilenbefehl ist, können Sie ihm eine Adresse übergeben. `:10put a` fügt den Text aus dem Register a unter Zeile 10 ein.

Ein cooler Trick ist, `:put` mit dem schwarzen Loch-Register (`"_`) zu verwenden. Da das schwarze Loch-Register keinen Text speichert, wird `:put _` stattdessen eine Leerzeile einfügen. Sie können dies mit dem globalen Befehl kombinieren, um mehrere Leerzeilen einzufügen. Zum Beispiel, um Leerzeilen unter allen Zeilen einzufügen, die den Text "end" enthalten, führen Sie `:g/end/put _` aus. Sie werden später über den globalen Befehl lernen.

## Lernen von Registern auf die smarte Art

Sie haben es bis zum Ende geschafft. Herzlichen Glückwunsch! Wenn Sie sich von der schieren Informationsmenge überwältigt fühlen, sind Sie nicht allein. Als ich anfing, über Vim-Register zu lernen, gab es viel zu viele Informationen auf einmal.

Ich denke nicht, dass Sie alle Register sofort auswendig lernen sollten. Um produktiv zu werden, können Sie mit diesen 3 Registern beginnen:
1. Das unbenannte Register (`""`).
2. Die benannten Register (`"a-z`).
3. Die nummerierten Register (`"0-9`).

Da das unbenannte Register standardmäßig `p` und `P` verwendet, müssen Sie nur zwei Register lernen: die benannten Register und die nummerierten Register. Lernen Sie allmählich weitere Register, wenn Sie sie benötigen. Nehmen Sie sich Zeit.

Der durchschnittliche Mensch hat eine begrenzte Kapazität für das Kurzzeitgedächtnis, etwa 5 - 7 Elemente auf einmal. Deshalb verwende ich in meinem täglichen Editing nur etwa 5 - 7 benannte Register. Es gibt keine Möglichkeit, dass ich mir alle sechsundzwanzig im Kopf merken kann. Normalerweise beginne ich mit Register a, dann b, aufsteigend in alphabetischer Reihenfolge. Probieren Sie es aus und experimentieren Sie, um herauszufinden, welche Technik am besten für Sie funktioniert.

Vim-Register sind mächtig. Strategisch eingesetzt, können sie Ihnen helfen, unzählige sich wiederholende Texte zu vermeiden. Als Nächstes lernen wir über Makros.