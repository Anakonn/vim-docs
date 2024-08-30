---
description: Niniejszy dokument opisuje użycie polecenia kropki w Vimie, które umożliwia
  łatwe powtarzanie ostatnich zmian, co zwiększa efektywność edycji.
title: Ch07. the Dot Command
---

Ogólnie rzecz biorąc, powinieneś starać się unikać powtarzania tego, co właśnie zrobiłeś, kiedy tylko to możliwe. W tym rozdziale nauczysz się, jak używać polecenia kropki, aby łatwo powtórzyć ostatnią zmianę. To wszechstronne polecenie służy do redukcji prostych powtórzeń.

## Użycie

Tak jak jego nazwa, możesz używać polecenia kropki, naciskając klawisz kropki (`.`).

Na przykład, jeśli chcesz zastąpić wszystkie "let" "const" w następujących wyrażeniach:

```shell
let one = "1";
let two = "2";
let three = "3";
```

- Wyszukaj za pomocą `/let`, aby przejść do dopasowania.
- Zmień za pomocą `cwconst<Esc>`, aby zastąpić "let" "const".
- Nawiguj za pomocą `n`, aby znaleźć następne dopasowanie, używając poprzedniego wyszukiwania.
- Powtórz to, co właśnie zrobiłeś, za pomocą polecenia kropki (`.`).
- Kontynuuj naciskanie `n . n .`, aż zastąpisz każde słowo.

Tutaj polecenie kropki powtórzyło sekwencję `cwconst<Esc>`. Uratowało cię to od wpisywania ośmiu naciśnięć klawiszy w zamian za tylko jedno.

## Co to jest zmiana?

Jeśli spojrzysz na definicję polecenia kropki (`:h .`), mówi, że polecenie kropki powtarza ostatnią zmianę. Co to jest zmiana?

Za każdym razem, gdy aktualizujesz (dodajesz, modyfikujesz lub usuwasz) zawartość bieżącego bufora, dokonujesz zmiany. Wyjątki stanowią aktualizacje dokonane przez polecenia wiersza poleceń (polecenia zaczynające się od `:`), które nie są liczone jako zmiana.

W pierwszym przykładzie `cwconst<Esc>` była zmianą. Teraz załóżmy, że masz ten tekst:

```shell
pancake, potatoes, fruit-juice,
```

Aby usunąć tekst od początku linii do następnego wystąpienia przecinka, najpierw usuń do przecinka, a następnie powtórz to dwa razy za pomocą `df,..`. 

Spróbujmy innego przykładu:

```shell
pancake, potatoes, fruit-juice,
```

Tym razem twoim zadaniem jest usunięcie przecinka, a nie pozycji śniadaniowych. Z kursorem na początku linii, przejdź do pierwszego przecinka, usuń go, a następnie powtórz to jeszcze dwa razy za pomocą `f,x..` Łatwe, prawda? Poczekaj chwilę, to nie zadziałało! Dlaczego?

Zmiana wyklucza ruchy, ponieważ nie aktualizuje zawartości bufora. Polecenie `f,x` składało się z dwóch działań: polecenia `f,` do przesunięcia kursora do "," i `x` do usunięcia znaku. Tylko to ostatnie, `x`, spowodowało zmianę. W przeciwieństwie do `df,` z wcześniejszego przykładu. W nim `f,` jest dyrektywą dla operatora usuwania `d`, a nie ruchem do przesunięcia kursora. `f,` w `df,` i `f,x` mają dwie bardzo różne role.

Zakończmy ostatnie zadanie. Po uruchomieniu `f,` a następnie `x`, przejdź do następnego przecinka za pomocą `;`, aby powtórzyć ostatnie `f`. Na koniec użyj `.` do usunięcia znaku pod kursorem. Powtarzaj `; . ; .`, aż wszystko zostanie usunięte. Pełne polecenie to `f,x;.;.`.

Spróbujmy jeszcze jednego:

```shell
pancake
potatoes
fruit-juice
```

Dodajmy przecinek na końcu każdej linii. Zaczynając od pierwszej linii, zrób `A,<Esc>j`. Do tej pory zdajesz sobie sprawę, że `j` nie powoduje zmiany. Zmiana tutaj to tylko `A,`. Możesz się poruszać i powtarzać zmianę za pomocą `j . j .`. Pełne polecenie to `A,<Esc>j.j.`.

Każda akcja od momentu naciśnięcia operatora polecenia wstawiania (`A`) do momentu wyjścia z polecenia wstawiania (`<Esc>`) jest uważana za zmianę.

## Powtórzenie wieloliniowe

Załóżmy, że masz ten tekst:

```shell
let one = "1";
let two = "2";
let three = "3";
const foo = "bar';
let four = "4";
let five = "5";
let six = "6";
let seven = "7";
let eight = "8";
let nine = "9";
```

Twoim celem jest usunięcie wszystkich linii z wyjątkiem linii "foo". Najpierw usuń pierwsze trzy linie za pomocą `d2j`, a następnie przejdź do linii poniżej linii "foo". W następnej linii użyj polecenia kropki dwa razy. Pełne polecenie to `d2jj..`.

Tutaj zmiana to `d2j`. W tym kontekście `2j` nie było ruchem, ale częścią operatora usuwania.

Spójrzmy na inny przykład:

```shell
zlet zzone = "1";
zlet zztwo = "2";
zlet zzthree = "3";
let four = "4";
```

Usuńmy wszystkie z. Zaczynając od pierwszego znaku w pierwszej linii, wizualnie wybierz tylko pierwsze z z pierwszych trzech linii za pomocą trybu wizualnego blokowego (`Ctrl-Vjj`). Jeśli nie jesteś zaznajomiony z trybem wizualnym blokowym, omówię to w późniejszym rozdziale. Gdy masz wizualnie wybrane trzy z, usuń je za pomocą operatora usuwania (`d`). Następnie przejdź do następnego słowa (`w`) do następnego z. Powtórz zmianę jeszcze dwa razy (`..`). Pełne polecenie to `Ctrl-vjjdw..`.

Kiedy usunąłeś kolumnę trzech z (`Ctrl-vjjd`), zostało to policzone jako zmiana. Operacja w trybie wizualnym może być używana do celowania w wiele linii jako część zmiany.

## Uwzględnienie ruchu w zmianie

Wróćmy do pierwszego przykładu w tym rozdziale. Przypomnij sobie, że polecenie `/letcwconst<Esc>` następnie `n . n .` zastąpiło wszystkie "let" "const" w następujących wyrażeniach:

```shell
let one = "1";
let two = "2";
let three = "3";
```

Jest szybszy sposób, aby to osiągnąć. Po wyszukaniu `/let`, uruchom `cgnconst<Esc>`, a następnie `. .`.

`gn` to ruch, który przeszukuje do przodu ostatni wzór wyszukiwania (w tym przypadku `/let`) i automatycznie wykonuje wizualne podświetlenie. Aby zastąpić następne wystąpienie, nie musisz już się poruszać i powtarzać zmiany (`n . n .`), ale tylko powtarzać (`. .`). Nie musisz już używać ruchów wyszukiwania, ponieważ wyszukiwanie następnego dopasowania jest teraz częścią zmiany!

Podczas edytowania zawsze zwracaj uwagę na ruchy, które mogą robić kilka rzeczy jednocześnie, takie jak `gn`, kiedy tylko to możliwe.

## Naucz się polecenia kropki w mądry sposób

Siła polecenia kropki pochodzi z wymiany kilku naciśnięć klawiszy na jedno. Prawdopodobnie nie jest to opłacalna wymiana, aby używać polecenia kropki do pojedynczych operacji klawiszowych, takich jak `x`. Jeśli twoja ostatnia zmiana wymaga złożonej operacji, takiej jak `cgnconst<Esc>`, polecenie kropki redukuje dziewięć naciśnięć klawiszy do jednego, co jest bardzo opłacalną wymianą.

Podczas edytowania myśl o powtarzalności. Na przykład, jeśli muszę usunąć następne trzy słowa, czy bardziej opłacalne jest użycie `d3w`, czy zrobienie `dw`, a następnie `.` dwa razy? Czy będziesz usuwać słowo ponownie? Jeśli tak, to ma sens użycie `dw` i powtórzenie go kilka razy zamiast `d3w`, ponieważ `dw` jest bardziej wielokrotnego użytku niż `d3w`. 

Polecenie kropki to wszechstronne polecenie do automatyzacji pojedynczych zmian. W późniejszym rozdziale nauczysz się, jak automatyzować bardziej złożone działania za pomocą makr Vim. Ale najpierw nauczmy się o rejestrach do przechowywania i odzyskiwania tekstu.