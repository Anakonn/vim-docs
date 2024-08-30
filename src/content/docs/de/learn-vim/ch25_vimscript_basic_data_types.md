---
description: In diesem Kapitel lernen Sie die primitiven Datentypen von Vimscript
  kennen, einschließlich Zahlen, Strings, Listen und mehr. Ideal für den Einstieg!
title: Ch25. Vimscript Basic Data Types
---

In den nächsten Kapiteln werden Sie über Vimscript, Vims integrierte Programmiersprache, lernen.

Beim Erlernen einer neuen Sprache gibt es drei grundlegende Elemente, auf die man achten sollte:
- Primitiven
- Kombinationsmittel
- Abstraktionsmittel

In diesem Kapitel lernen Sie die primitiven Datentypen von Vim kennen.

## Datentypen

Vim hat 10 verschiedene Datentypen:
- Zahl
- Float
- Zeichenkette
- Liste
- Wörterbuch
- Spezial
- Funcref
- Job
- Kanal
- Blob

Ich werde hier die ersten sechs Datentypen behandeln. In Kap. 27 lernen Sie über Funcref. Für weitere Informationen zu Vims Datentypen schauen Sie sich `:h variables` an.

## Mit Ex-Modus folgen

Vim hat technisch gesehen keinen integrierten REPL, aber es gibt einen Modus, den Ex-Modus, der wie einer verwendet werden kann. Sie können in den Ex-Modus mit `Q` oder `gQ` wechseln. Der Ex-Modus ist wie ein erweiterter Befehlszeilenmodus (es ist wie das ständige Eingeben von Befehlen im Befehlszeilenmodus). Um den Ex-Modus zu verlassen, geben Sie `:visual` ein.

Sie können entweder `:echo` oder `:echom` in diesem Kapitel und den folgenden Vimscript-Kapiteln verwenden, um mit zu programmieren. Sie sind wie `console.log` in JS oder `print` in Python. Der Befehl `:echo` gibt den ausgewerteten Ausdruck aus, den Sie angeben. Der Befehl `:echom` macht dasselbe, speichert jedoch zusätzlich das Ergebnis in der Nachrichtenhistorie.

```viml
:echom "Hallo Echo-Nachricht"
```

Sie können die Nachrichtenhistorie mit folgendem Befehl anzeigen:

```shell
:messages
```

Um Ihre Nachrichtenhistorie zu löschen, führen Sie aus:

```shell
:messages clear
```

## Zahl

Vim hat 4 verschiedene Zahlentypen: Dezimal, Hexadezimal, Binär und Oktal. Übrigens, wenn ich von einem Zahl-Datentyp spreche, bedeutet das oft einen Ganzzahl-Datentyp. In diesem Leitfaden werde ich die Begriffe Zahl und Ganzzahl austauschbar verwenden.

### Dezimal

Sie sollten mit dem Dezimalsystem vertraut sein. Vim akzeptiert positive und negative Dezimalzahlen. 1, -1, 10 usw. In der Vimscript-Programmierung werden Sie wahrscheinlich die Dezimalzahl am häufigsten verwenden.

### Hexadezimal

Hexadezimalzahlen beginnen mit `0x` oder `0X`. Merksatz: He**x**adezimal.

### Binär

Binärzahlen beginnen mit `0b` oder `0B`. Merksatz: **B**inär.

### Oktal

Oktalzahlen beginnen mit `0`, `0o` und `0O`. Merksatz: **O**ktal.

### Zahlen drucken

Wenn Sie eine hexadezimale, binäre oder oktale Zahl `echo`en, konvertiert Vim sie automatisch in Dezimalzahlen.

```viml
:echo 42
" gibt 42 zurück

:echo 052
" gibt 42 zurück

:echo 0b101010
" gibt 42 zurück

:echo 0x2A
" gibt 42 zurück
```

### Wahrheitswerte

In Vim ist ein Wert von 0 falsch und alle Werte ungleich 0 sind wahr.

Das Folgende wird nichts ausgeben.

```viml
:if 0
:  echo "Nein"
:endif
```

Dieses wird jedoch:

```viml
:if 1
:  echo "Ja"
:endif
```

Alle Werte außer 0 sind wahr, einschließlich negativer Zahlen. 100 ist wahr. -1 ist wahr.

### Zahlenarithmetik

Zahlen können verwendet werden, um arithmetische Ausdrücke auszuführen:

```viml
:echo 3 + 1
" gibt 4 zurück

: echo 5 - 3
" gibt 2 zurück

:echo 2 * 2
" gibt 4 zurück

:echo 4 / 2
" gibt 2 zurück
```

Bei der Division einer Zahl mit einem Rest verwirft Vim den Rest.

```viml
:echo 5 / 2
" gibt 2 zurück statt 2.5
```

Um ein genaueres Ergebnis zu erhalten, müssen Sie eine Fließkommazahl verwenden.

## Float

Fließkommazahlen sind Zahlen mit nachgestellten Dezimalstellen. Es gibt zwei Möglichkeiten, Fließkommazahlen darzustellen: Punktnotation (wie 31.4) und Exponent (3.14e01). Ähnlich wie bei Zahlen können Sie positive und negative Vorzeichen verwenden:

```viml
:echo +123.4
" gibt 123.4 zurück

:echo -1.234e2
" gibt -123.4 zurück

:echo 0.25
" gibt 0.25 zurück

:echo 2.5e-1
" gibt 0.25 zurück
```

Sie müssen einer Fließkommazahl einen Punkt und nachgestellte Ziffern geben. `25e-2` (kein Punkt) und `1234.` (hat einen Punkt, aber keine nachgestellten Ziffern) sind beide ungültige Fließkommazahlen.

### Float-Arithmetik

Bei einer arithmetischen Operation zwischen einer Zahl und einer Fließkommazahl zwingt Vim das Ergebnis in eine Fließkommazahl.

```viml
:echo 5 / 2.0
" gibt 2.5 zurück
```

Fließkommazahlen und Fließkomma-Arithmetik ergeben eine weitere Fließkommazahl.

```shell
:echo 1.0 + 1.0
" gibt 2.0 zurück
```

## Zeichenkette

Zeichenketten sind Zeichen, die entweder von doppelten Anführungszeichen (`""`) oder von einfachen Anführungszeichen (`''`) umgeben sind. "Hallo", "123" und '123.4' sind Beispiele für Zeichenketten.

### Zeichenkettenverkettung

Um eine Zeichenkette in Vim zu verketten, verwenden Sie den `.`-Operator.

```viml
:echo "Hallo" . " Welt"
" gibt "Hallo Welt" zurück
```

### Zeichenkettenarithmetik

Wenn Sie arithmetische Operatoren (`+ - * /`) mit einer Zahl und einer Zeichenkette ausführen, zwingt Vim die Zeichenkette in eine Zahl.

```viml
:echo "12 donuts" + 3
" gibt 15 zurück
```

Wenn Vim "12 donuts" sieht, extrahiert es die 12 aus der Zeichenkette und konvertiert sie in die Zahl 12. Dann wird die Addition durchgeführt, was 15 zurückgibt. Damit diese Umwandlung von Zeichenkette zu Zahl funktioniert, muss das Zahlenzeichen das *erste Zeichen* in der Zeichenkette sein.

Das Folgende wird nicht funktionieren, da 12 nicht das erste Zeichen in der Zeichenkette ist:

```viml
:echo "donuts 12" + 3
" gibt 3 zurück
```

Das wird auch nicht funktionieren, da ein Leerzeichen das erste Zeichen der Zeichenkette ist:

```viml
:echo " 12 donuts" + 3
" gibt 3 zurück
```

Diese Umwandlung funktioniert sogar mit zwei Zeichenketten:

```shell
:echo "12 donuts" + "6 pastries"
" gibt 18 zurück
```

Das funktioniert mit jedem arithmetischen Operator, nicht nur mit `+`:

```viml
:echo "12 donuts" * "5 boxes"
" gibt 60 zurück

:echo "12 donuts" - 5
" gibt 7 zurück

:echo "12 donuts" / "3 people"
" gibt 4 zurück
```

Ein praktischer Trick, um eine Umwandlung von Zeichenkette zu Zahl zu erzwingen, besteht darin, einfach 0 hinzuzufügen oder mit 1 zu multiplizieren:

```viml
:echo "12" + 0
" gibt 12 zurück

:echo "12" * 1
" gibt 12 zurück
```

Wenn Arithmetik gegen eine Fließkommazahl in einer Zeichenkette durchgeführt wird, behandelt Vim sie wie eine Ganzzahl, nicht wie eine Fließkommazahl:

```shell
:echo "12.0 donuts" + 12
" gibt 24 zurück, nicht 24.0
```

### Zahlen- und Zeichenkettenverkettung

Sie können eine Zahl mit einem Punktoperator (`.`) in eine Zeichenkette umwandeln:

```viml
:echo 12 . "donuts"
" gibt "12donuts" zurück
```

Die Umwandlung funktioniert nur mit dem Datentyp Zahl, nicht mit Float. Das wird nicht funktionieren:

```shell
:echo 12.0 . "donuts"
" gibt nicht "12.0donuts" zurück, sondern wirft einen Fehler
```

### Zeichenkettenbedingungen

Erinnern Sie sich daran, dass 0 falsch ist und alle nicht-0 Zahlen wahr sind. Dies gilt auch, wenn Zeichenketten als Bedingungen verwendet werden.

In der folgenden if-Anweisung zwingt Vim "12donuts" in 12, was wahr ist:

```viml
:if "12donuts"
:  echo "Lecker"
:endif
" gibt "Lecker" zurück
```

Andererseits ist dies falsch:

```viml
:if "donuts12"
:  echo "Nein"
:endif
" gibt nichts zurück
```

Vim zwingt "donuts12" in 0, da das erste Zeichen keine Zahl ist.

### Doppelte vs einfache Anführungszeichen

Doppelte Anführungszeichen verhalten sich anders als einfache Anführungszeichen. Einfache Anführungszeichen zeigen Zeichen wörtlich an, während doppelte Anführungszeichen spezielle Zeichen akzeptieren.

Was sind spezielle Zeichen? Schauen Sie sich die Anzeige von Zeilenumbrüchen und doppelten Anführungszeichen an:

```viml
:echo "hallo\nwelt"
" gibt
" hallo
" welt zurück

:echo "hallo \"welt\""
" gibt "hallo "welt"" zurück
```

Vergleichen Sie das mit einfachen Anführungszeichen:

```shell
:echo 'hallo\nwelt'
" gibt 'hallo\nwelt' zurück

:echo 'hallo \"welt\"'
" gibt 'hallo \"welt\"' zurück
```

Spezielle Zeichen sind spezielle Zeichen in Zeichenketten, die sich beim Escape anders verhalten. `\n` fungiert wie ein Zeilenumbruch. `\"` verhält sich wie ein literales `"`. Für eine Liste anderer spezieller Zeichen schauen Sie sich `:h expr-quote` an.

### Zeichenkettenverfahren

Schauen wir uns einige integrierte Zeichenkettenverfahren an.

Sie können die Länge einer Zeichenkette mit `strlen()` erhalten.

```shell
:echo strlen("choco")
" gibt 5 zurück
```

Sie können eine Zeichenkette in eine Zahl mit `str2nr()` umwandeln:

```shell
:echo str2nr("12donuts")
" gibt 12 zurück

:echo str2nr("donuts12")
" gibt 0 zurück
```

Ähnlich wie bei der Umwandlung von Zeichenkette zu Zahl zuvor wird Vim die Zahl nicht erfassen, wenn sie nicht das erste Zeichen ist.

Die gute Nachricht ist, dass Vim eine Methode hat, die eine Zeichenkette in eine Fließkommazahl umwandelt, `str2float()`:

```shell
:echo str2float("12.5donuts")
" gibt 12.5 zurück
```

Sie können ein Muster in einer Zeichenkette mit der Methode `substitute()` ersetzen:

```shell
:echo substitute("süß", "e", "o", "g")
" gibt "swoot" zurück
```

Der letzte Parameter, "g", ist das globale Flag. Damit wird Vim alle übereinstimmenden Vorkommen ersetzen. Ohne es wird Vim nur das erste Vorkommen ersetzen.

```shell
:echo substitute("süß", "e", "o", "")
" gibt "swoet" zurück
```

Der Ersetzungsbefehl kann mit `getline()` kombiniert werden. Erinnern Sie sich daran, dass die Funktion `getline()` den Text in der angegebenen Zeilennummer erhält. Angenommen, Sie haben den Text "Schokoladendonut" in Zeile 5. Sie können das Verfahren verwenden:

```shell
:echo substitute(getline(5), "Schokolade", "glasiert", "g")
" gibt glasiert donut zurück
```

Es gibt viele andere Zeichenkettenverfahren. Schauen Sie sich `:h string-functions` an.

## Liste

Eine Vimscript-Liste ist wie ein Array in Javascript oder eine Liste in Python. Es ist eine *geordnete* Sequenz von Elementen. Sie können den Inhalt mit verschiedenen Datentypen mischen:

```shell
[1,2,3]
['a', 'b', 'c']
[1,'a', 3.14]
[1,2,[3,4]]
```

### Unterlisten

Vim-Listen sind nullbasiert. Sie können auf ein bestimmtes Element in einer Liste mit `[n]` zugreifen, wobei n der Index ist.

```shell
:echo ["a", "süß", "dessert"][0]
" gibt "a" zurück

:echo ["a", "süß", "dessert"][2]
" gibt "dessert" zurück
```

Wenn Sie die maximale Indexnummer überschreiten, gibt Vim einen Fehler aus, der besagt, dass der Index außerhalb des Bereichs liegt:

```shell
:echo ["a", "süß", "dessert"][999]
" gibt einen Fehler zurück
```

Wenn Sie unter Null gehen, beginnt Vim den Index beim letzten Element. Wenn Sie die minimale Indexnummer überschreiten, wird ebenfalls ein Fehler ausgegeben:

```shell
:echo ["a", "süß", "dessert"][-1]
" gibt "dessert" zurück

:echo ["a", "süß", "dessert"][-3]
" gibt "a" zurück

:echo ["a", "süß", "dessert"][-999]
" gibt einen Fehler zurück
```

Sie können mehrere Elemente aus einer Liste mit `[n:m]` "schneiden", wobei `n` der Startindex und `m` der Endindex ist.

```shell
:echo ["Schokolade", "glasiert", "plain", "Erdbeere", "Zitrone", "Zucker", "Sahne"][2:4]
" gibt ["plain", "Erdbeere", "Zitrone"] zurück
```

Wenn Sie `m` nicht übergeben (`[n:]`), gibt Vim die restlichen Elemente ab dem n-ten Element zurück. Wenn Sie `n` nicht übergeben (`[:m]`), gibt Vim das erste Element bis zum m-ten Element zurück.

```shell
:echo ["Schokolade", "glasiert", "plain", "Erdbeere", "Zitrone", "Zucker", "Sahne"][2:]
" gibt ['plain', 'Erdbeere', 'Zitrone', 'Zucker', 'Sahne'] zurück

:echo ["Schokolade", "glasiert", "plain", "Erdbeere", "Zitrone", "Zucker", "Sahne"][:4]
" gibt ['Schokolade', 'glasiert', 'plain', 'Erdbeere', 'Zitrone'] zurück
```

Sie können einen Index über die maximale Anzahl von Elementen beim Schneiden eines Arrays übergeben.

```viml
:echo ["Schokolade", "glasiert", "plain", "Erdbeere", "Zitrone", "Zucker", "Sahne"][2:999]
" gibt ['plain', 'Erdbeere', 'Zitrone', 'Zucker', 'Sahne'] zurück
```
### String Slicing

Du kannst Strings genauso wie Listen schneiden und anvisieren:

```viml
:echo "choco"[0]
" gibt "c" zurück

:echo "choco"[1:3]
" gibt "hoc" zurück

:echo "choco"[:3]
" gibt choc zurück

:echo "choco"[1:]
" gibt hoco zurück
```

### Listenarithmetik

Du kannst `+` verwenden, um eine Liste zu verketten und zu verändern:

```viml
:let sweetList = ["chocolate", "strawberry"]
:let sweetList += ["sugar"]
:echo sweetList
" gibt ["chocolate", "strawberry", "sugar"] zurück
```

### Listenfunktionen

Lass uns die integrierten Listenfunktionen von Vim erkunden.

Um die Länge einer Liste zu erhalten, verwende `len()`:

```shell
:echo len(["chocolate", "strawberry"])
" gibt 2 zurück
```

Um ein Element zu einer Liste hinzuzufügen, kannst du `insert()` verwenden:

```shell
:let sweetList = ["chocolate", "strawberry"]
:call insert(sweetList, "glazed")

:echo sweetList
" gibt ["glazed", "chocolate", "strawberry"] zurück
```

Du kannst `insert()` auch den Index übergeben, an dem du das Element hinzufügen möchtest. Wenn du ein Element vor dem zweiten Element (Index 1) hinzufügen möchtest:

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call insert(sweeterList, "cream", 1)

:echo sweeterList
" gibt ['glazed', 'cream', 'chocolate', 'strawberry'] zurück
```

Um ein Listenelement zu entfernen, verwende `remove()`. Es akzeptiert eine Liste und den Elementindex, den du entfernen möchtest.

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call remove(sweeterList, 1)

:echo sweeterList
" gibt ['glazed', 'strawberry'] zurück
```

Du kannst `map()` und `filter()` auf einer Liste verwenden. Um Elemente mit dem Ausdruck "choco" herauszufiltern:

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call filter(sweeterList, 'v:val !~ "choco"')
:echo sweeterList
" gibt ["glazed", "strawberry"] zurück

:let sweetestList = ["chocolate", "glazed", "sugar"]
:call map(sweetestList, 'v:val . " donut"')
:echo sweetestList
" gibt ['chocolate donut', 'glazed donut', 'sugar donut'] zurück
```

Die Variable `v:val` ist eine spezielle Vim-Variable. Sie ist verfügbar, wenn du eine Liste oder ein Dictionary mit `map()` oder `filter()` durchläufst. Sie repräsentiert jedes iterierte Element.

Für mehr Informationen, schau dir `:h list-functions` an.

### Listenentpackung

Du kannst eine Liste entpacken und Variablen den Listenelementen zuweisen:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let [flavor1, flavor2, flavor3] = favoriteFlavor

:echo flavor1
" gibt "chocolate" zurück

:echo flavor2
" gibt "glazed" zurück
```

Um die restlichen Listenelemente zuzuweisen, kannst du `;` gefolgt von einem Variablennamen verwenden:

```shell
:let favoriteFruits = ["apple", "banana", "lemon", "blueberry", "raspberry"]
:let [fruit1, fruit2; restFruits] = favoriteFruits

:echo fruit1
" gibt "apple" zurück

:echo restFruits
" gibt ['lemon', 'blueberry', 'raspberry'] zurück
```

### Liste Modifizieren

Du kannst ein Listenelement direkt ändern:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[0] = "sugar"
:echo favoriteFlavor
" gibt ['sugar', 'glazed', 'plain'] zurück
```

Du kannst mehrere Listenelemente direkt ändern:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[2:] = ["strawberry", "chocolate"]
:echo favoriteFlavor
" gibt ['chocolate', 'glazed', 'strawberry', 'chocolate'] zurück
```

## Dictionary

Ein Vimscript-Dictionary ist eine assoziative, ungeordnete Liste. Ein nicht-leeres Dictionary besteht aus mindestens einem Schlüssel-Wert-Paar.

```shell
{"breakfast": "waffles", "lunch": "pancakes"}
{"meal": ["breakfast", "second breakfast", "third breakfast"]}
{"dinner": 1, "dessert": 2}
```

Ein Vim-Dictionary-Datenobjekt verwendet Strings für Schlüssel. Wenn du versuchst, eine Zahl zu verwenden, wird Vim sie in einen String umwandeln.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}

:echo breakfastNo
" gibt {'1': '7am', '2': '9am', '11ses': '11am'} zurück
```

Wenn du zu faul bist, um Anführungszeichen um jeden Schlüssel zu setzen, kannst du die `#{}`-Notation verwenden:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo mealPlans
" gibt {'lunch': 'pancakes', 'breakfast': 'waffles', 'dinner': 'donuts'} zurück
```

Die einzige Voraussetzung für die Verwendung der `#{}`-Syntax ist, dass jeder Schlüssel entweder sein muss:

- ASCII-Zeichen.
- Ziffer.
- Ein Unterstrich (`_`).
- Ein Bindestrich (`-`).

Genau wie bei Listen kannst du jeden Datentyp als Werte verwenden.

```shell
:let mealPlan = {"breakfast": ["pancake", "waffle", "hash brown"], "lunch": WhatsForLunch(), "dinner": {"appetizer": "gruel", "entree": "more gruel"}}
```

### Zugriff auf Dictionary

Um auf einen Wert aus einem Dictionary zuzugreifen, kannst du den Schlüssel entweder mit eckigen Klammern (`['key']`) oder der Punktnotation (`.key`) aufrufen.

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches", "dinner": "more gruel"}

:let breakfast = meal['breakfast']
:let lunch = meal.lunch

:echo breakfast
" gibt "gruel omelettes" zurück

:echo lunch
" gibt "gruel sandwiches" zurück
```

### Dictionary Modifizieren

Du kannst den Inhalt eines Dictionaries ändern oder sogar hinzufügen:

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches"}

:let meal.breakfast = "breakfast tacos"
:let meal["lunch"] = "tacos al pastor"
:let meal["dinner"] = "quesadillas"

:echo meal
" gibt {'lunch': 'tacos al pastor', 'breakfast': 'breakfast tacos', 'dinner': 'quesadillas'} zurück
```

### Dictionary Funktionen

Lass uns einige der integrierten Funktionen von Vim zur Handhabung von Dictionaries erkunden.

Um die Länge eines Dictionaries zu überprüfen, verwende `len()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo len(mealPlans)
" gibt 3 zurück
```

Um zu sehen, ob ein Dictionary einen bestimmten Schlüssel enthält, verwende `has_key()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo has_key(mealPlans, "breakfast")
" gibt 1 zurück

:echo has_key(mealPlans, "dessert")
" gibt 0 zurück
```

Um zu sehen, ob ein Dictionary ein Element hat, verwende `empty()`. Die `empty()`-Prozedur funktioniert mit allen Datentypen: Liste, Dictionary, String, Zahl, Float usw.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:let noMealPlan = {}

:echo empty(noMealPlan)
" gibt 1 zurück

:echo empty(mealPlans)
" gibt 0 zurück
```

Um einen Eintrag aus einem Dictionary zu entfernen, verwende `remove()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo "removing breakfast: " . remove(mealPlans, "breakfast")
" gibt "removing breakfast: 'waffles'" zurück

:echo mealPlans
" gibt {'lunch': 'pancakes', 'dinner': 'donuts'} zurück
```

Um ein Dictionary in eine Liste von Listen zu konvertieren, verwende `items()`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo items(mealPlans)
" gibt [['lunch', 'pancakes'], ['breakfast', 'waffles'], ['dinner', 'donuts']] zurück
```

`filter()` und `map()` sind ebenfalls verfügbar.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}
:call filter(breakfastNo, 'v:key > 1')

:echo breakfastNo
" gibt {'2': '9am', '11ses': '11am'} zurück
```

Da ein Dictionary Schlüssel-Wert-Paare enthält, bietet Vim die spezielle Variable `v:key`, die ähnlich wie `v:val` funktioniert. Wenn du durch ein Dictionary iterierst, hält `v:key` den Wert des aktuell iterierten Schlüssels.

Wenn du ein `mealPlans`-Dictionary hast, kannst du es mit `v:key` abbilden.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:key . " und Milch"')

:echo mealPlans
" gibt {'lunch': 'lunch und Milch', 'breakfast': 'breakfast und Milch', 'dinner': 'dinner und Milch'} zurück
```

Ähnlich kannst du es mit `v:val` abbilden:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:val . " und Milch"')

:echo mealPlans
" gibt {'lunch': 'pancakes und Milch', 'breakfast': 'waffles und Milch', 'dinner': 'donuts und Milch'} zurück
```

Um mehr über Dictionary-Funktionen zu erfahren, schau dir `:h dict-functions` an.

## Besondere Primitiven

Vim hat besondere Primitiven:

- `v:false`
- `v:true`
- `v:none`
- `v:null`

Übrigens, `v:` ist die eingebaute Variable von Vim. Sie werden in einem späteren Kapitel ausführlicher behandelt.

Nach meiner Erfahrung wirst du diese besonderen Primitiven nicht oft verwenden. Wenn du einen wahrheitsgemäßen / falschen Wert benötigst, kannst du einfach 0 (falsch) und ungleich 0 (wahr) verwenden. Wenn du einen leeren String benötigst, verwende einfach `""`. Aber es ist trotzdem gut zu wissen, also lass uns schnell darüber hinweggehen.

### Wahr

Das entspricht `true`. Es entspricht einer Zahl mit dem Wert ungleich 0. Beim Dekodieren von JSON mit `json_encode()` wird es als "true" interpretiert.

```shell
:echo json_encode({"test": v:true})
" gibt {"test": true} zurück
```

### Falsch

Das entspricht `false`. Es entspricht einer Zahl mit dem Wert 0. Beim Dekodieren von JSON mit `json_encode()` wird es als "false" interpretiert.

```shell
:echo json_encode({"test": v:false})
" gibt {"test": false} zurück
```

### Keine

Es entspricht einem leeren String. Beim Dekodieren von JSON mit `json_encode()` wird es als leeres Element (`null`) interpretiert.

```shell
:echo json_encode({"test": v:none})
" gibt {"test": null} zurück
```

### Null

Ähnlich wie `v:none`.

```shell
:echo json_encode({"test": v:null})
" gibt {"test": null} zurück
```

## Lerne Datentypen auf die smarte Weise

In diesem Kapitel hast du die grundlegenden Datentypen von Vimscript kennengelernt: Zahl, Float, String, Liste, Dictionary und speziell. Diese zu lernen ist der erste Schritt, um mit der Programmierung in Vimscript zu beginnen.

Im nächsten Kapitel wirst du lernen, wie man sie kombiniert, um Ausdrücke wie Gleichheiten, Bedingungen und Schleifen zu schreiben.