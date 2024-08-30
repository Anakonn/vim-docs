---
description: Rozszerzanie Vima o zewnętrzne polecenia Unix, wykorzystując komendę
  bang (`!`) do odczytu, zapisu i wykonywania poleceń w edytorze.
title: Ch14. External Commands
---

W systemie Unix znajdziesz wiele małych, hiper-specjalizowanych poleceń, które robią jedną rzecz (i robią to dobrze). Możesz łączyć te polecenia, aby współpracowały ze sobą w celu rozwiązania złożonego problemu. Czyż nie byłoby świetnie, gdybyś mógł używać tych poleceń z poziomu Vima?

Zdecydowanie. W tym rozdziale nauczysz się, jak rozszerzyć Vima, aby działał bezproblemowo z zewnętrznymi poleceniami.

## Polecenie Bang

Vim ma polecenie bang (`!`), które może robić trzy rzeczy:

1. Odczytać STDOUT zewnętrznego polecenia do bieżącego bufora.
2. Zapisz zawartość swojego bufora jako STDIN do zewnętrznego polecenia.
3. Wykonać zewnętrzne polecenie z poziomu Vima.

Przejdźmy przez każde z nich.

## Odczytywanie STDOUT z polecenia do Vima

Składnia do odczytania STDOUT zewnętrznego polecenia do bieżącego bufora to:

```shell
:r !cmd
```

`:r` to polecenie odczytu Vima. Jeśli użyjesz go bez `!`, możesz go użyć do pobrania zawartości pliku. Jeśli masz plik `file1.txt` w bieżącym katalogu i uruchomisz:

```shell
:r file1.txt
```

Vim wstawi zawartość `file1.txt` do bieżącego bufora.

Jeśli uruchomisz polecenie `:r`, a następnie `!` i zewnętrzne polecenie, wynik tego polecenia zostanie wstawiony do bieżącego bufora. Aby uzyskać wynik polecenia `ls`, uruchom:

```shell
:r !ls
```

Zwraca coś takiego jak:

```shell
file1.txt
file2.txt
file3.txt
```

Możesz odczytać dane z polecenia `curl`:

```shell
:r !curl -s 'https://jsonplaceholder.typicode.com/todos/1'
```

Polecenie `r` akceptuje również adres:

```shell
:10r !cat file1.txt
```

Teraz STDOUT z uruchomienia `cat file1.txt` zostanie wstawiony po linii 10.

## Zapisanie zawartości bufora do zewnętrznego polecenia

Polecenie `:w`, oprócz zapisywania pliku, może być używane do przekazywania tekstu w bieżącym buforze jako STDIN dla zewnętrznego polecenia. Składnia to:

```shell
:w !cmd
```

Jeśli masz te wyrażenia:

```shell
console.log("Hello Vim");
console.log("Vim is awesome");
```

Upewnij się, że masz zainstalowany [node](https://nodejs.org/en/) na swoim komputerze, a następnie uruchom:

```shell
:w !node
```

Vim użyje `node`, aby wykonać wyrażenia JavaScript, aby wydrukować "Hello Vim" i "Vim is awesome".

Podczas używania polecenia `:w`, Vim używa całego tekstu w bieżącym buforze, podobnie jak polecenie globalne (większość poleceń wiersza poleceń, jeśli nie przekażesz mu zakresu, wykonuje polecenie tylko na bieżącej linii). Jeśli przekażesz `:w` konkretny adres:

```shell
:2w !node
```

Vim użyje tylko tekstu z drugiej linii w interpreterze `node`.

Istnieje subtelna, ale znacząca różnica między `:w !node` a `:w! node`. Przy `:w !node` "zapisujesz" tekst w bieżącym buforze do zewnętrznego polecenia `node`. Przy `:w! node` wymuszasz zapisanie pliku i nazywasz plik "node".

## Wykonywanie zewnętrznego polecenia

Możesz wykonać zewnętrzne polecenie z poziomu Vima za pomocą polecenia bang. Składnia to:

```shell
:!cmd
```

Aby zobaczyć zawartość bieżącego katalogu w długim formacie, uruchom:

```shell
:!ls -ls
```

Aby zabić proces, który działa na PID 3456, możesz uruchomić:

```shell
:!kill -9 3456
```

Możesz uruchomić dowolne zewnętrzne polecenie bez opuszczania Vima, aby móc skupić się na swoim zadaniu.

## Filtrowanie tekstów

Jeśli podasz `!` zakres, może być używane do filtrowania tekstów. Załóżmy, że masz następujące teksty:

```shell
hello vim
hello vim
```

Użyjmy polecenia `tr` (translate), aby zamienić bieżącą linię na wielkie litery. Uruchom:

```shell
:.!tr '[:lower:]' '[:upper:]'
```

Wynik:

```shell
HELLO VIM
hello vim
```

Rozbicie:
- `.!` wykonuje polecenie filtra na bieżącej linii.
- `tr '[:lower:]' '[:upper:]'` wywołuje polecenie `tr`, aby zamienić wszystkie małe litery na wielkie.

Niezwykle ważne jest, aby przekazać zakres, aby uruchomić zewnętrzne polecenie jako filtr. Jeśli spróbujesz uruchomić powyższe polecenie bez `.` (`:!tr '[:lower:]' '[:upper:]'`), zobaczysz błąd.

Załóżmy, że musisz usunąć drugą kolumnę w obu liniach za pomocą polecenia `awk`:

```shell
:%!awk "{print $1}"
```

Wynik:

```shell
hello
hello
```

Rozbicie:
- `:%!` wykonuje polecenie filtra na wszystkich liniach (`%`).
- `awk "{print $1}"` drukuje tylko pierwszą kolumnę dopasowania.

Możesz łączyć wiele poleceń za pomocą operatora łańcucha (`|`), tak jak w terminalu. Powiedzmy, że masz plik z tymi pysznymi pozycjami śniadaniowymi:

```shell
name price
chocolate pancake 10
buttermilk pancake 9
blueberry pancake 12
```

Jeśli musisz je posortować według ceny i wyświetlić tylko menu z równym odstępem, możesz uruchomić:

```shell
:%!awk 'NR > 1' | sort -nk 3 | column -t
```

Wynik:
```shell
buttermilk pancake 9
chocolate pancake 10
blueberry pancake 12
```

Rozbicie:
- `:%!` stosuje filtr do wszystkich linii (`%`).
- `awk 'NR > 1'` wyświetla teksty tylko od drugiego wiersza wzwyż.
- `|` łączy następne polecenie.
- `sort -nk 3` sortuje numerycznie (`n`) używając wartości z kolumny 3 (`k 3`).
- `column -t` organizuje tekst z równym odstępem.

## Polecenie w trybie normalnym

Vim ma operator filtra (`!`) w trybie normalnym. Jeśli masz następujące powitania:

```shell
hello vim
hola vim
bonjour vim
salve vim
```

Aby zamienić bieżącą linię i linię poniżej na wielkie litery, możesz uruchomić:
```shell
!jtr '[a-z]' '[A-Z]'
```

Rozbicie:
- `!j` uruchamia operator filtra polecenia normalnego (`!`), celując w bieżącą linię i linię poniżej. Przypomnij, że ponieważ jest to operator trybu normalnego, zasada gramatyczna `czasownik + rzeczownik` ma zastosowanie. `!` to czasownik, a `j` to rzeczownik.
- `tr '[a-z]' '[A-Z]'` zamienia małe litery na wielkie.

Polecenie filtra w trybie normalnym działa tylko na ruchach / obiektach tekstowych, które mają co najmniej jedną linię lub dłużej. Jeśli spróbujesz uruchomić `!iwtr '[a-z]' '[A-Z]'` (wykonaj `tr` na wewnętrznym słowie), odkryjesz, że polecenie `tr` zostanie zastosowane do całej linii, a nie do słowa, na którym znajduje się kursor.

## Ucz się zewnętrznych poleceń w inteligentny sposób

Vim nie jest IDE. To lekki edytor modalny, który jest wysoko rozszerzalny z natury. Dzięki tej rozszerzalności masz łatwy dostęp do dowolnego zewnętrznego polecenia w swoim systemie. Uzbrojony w te zewnętrzne polecenia, Vim jest o krok bliżej do stania się IDE. Ktoś powiedział, że system Unix to pierwsze IDE w historii.

Polecenie bang jest tak przydatne, jak wiele zewnętrznych poleceń znasz. Nie martw się, jeśli twoja wiedza o zewnętrznych poleceniach jest ograniczona. Ja również mam jeszcze wiele do nauki. Weź to jako motywację do ciągłego uczenia się. Kiedy musisz zmodyfikować tekst, sprawdź, czy istnieje zewnętrzne polecenie, które może rozwiązać twój problem. Nie martw się o opanowanie wszystkiego, po prostu ucz się tych, które potrzebujesz do wykonania bieżącego zadania.