---
description: Niniejszy dokument opisuje, jak używać makr w Vimie do automatyzacji
  powtarzalnych zadań, co ułatwia edytowanie plików i zwiększa efektywność pracy.
title: Ch09. Macros
---

Kiedy edytujesz pliki, możesz zauważyć, że powtarzasz te same czynności. Czyż nie byłoby miło, gdybyś mógł wykonać te czynności raz i odtwarzać je, kiedy tylko ich potrzebujesz? Dzięki makrom Vim możesz nagrywać czynności i przechowywać je w rejestrach Vim, aby były wykonywane, kiedy tylko ich potrzebujesz.

W tym rozdziale nauczysz się, jak używać makr do automatyzacji nudnych zadań (a poza tym wygląda to fajnie, gdy twój plik edytuje się sam).

## Podstawowe Makra

Oto podstawowa składnia makra Vim:

```shell
qa                     Rozpocznij nagrywanie makra w rejestrze a
q (podczas nagrywania)  Zatrzymaj nagrywanie makra
```

Możesz wybrać dowolne małe litery (a-z), aby przechować makra. Oto jak możesz wykonać makro:

```shell
@a    Wykonaj makro z rejestru a
@@    Wykonaj ostatnio wykonane makra
```

Załóżmy, że masz ten tekst i chcesz zamienić wszystko na wielkie litery w każdej linii:

```shell
hello
vim
macros
are
awesome
```

Z kursorem na początku linii "hello", uruchom:

```shell
qa0gU$jq
```

Rozbicie:
- `qa` rozpoczyna nagrywanie makra w rejestrze a.
- `0` przechodzi do początku linii.
- `gU$` zamienia tekst od twojej aktualnej pozycji do końca linii na wielkie litery.
- `j` przechodzi w dół o jedną linię.
- `q` zatrzymuje nagrywanie.

Aby je odtworzyć, uruchom `@a`. Podobnie jak w wielu innych poleceniach Vim, możesz przekazać argument liczbowy do makr. Na przykład, uruchomienie `3@a` wykonuje makro trzy razy.

## Ochrona Bezpieczeństwa

Wykonanie makra automatycznie kończy się, gdy napotka błąd. Załóżmy, że masz ten tekst:

```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

Jeśli chcesz zamienić na wielkie litery pierwsze słowo w każdej linii, to makro powinno działać:

```shell
qa0W~jq
```

Oto rozbicie powyższego polecenia:
- `qa` rozpoczyna nagrywanie makra w rejestrze a.
- `0` przechodzi do początku linii.
- `W` przechodzi do następnego SŁOWA.
- `~` przełącza wielkość litery znaku pod kursorem.
- `j` przechodzi w dół o jedną linię.
- `q` zatrzymuje nagrywanie.

Wolę przeliczać moje wykonanie makra niż zaniżać, więc zazwyczaj wywołuję je dziewięćdziesiąt dziewięć razy (`99@a`). Dzięki temu poleceniu, Vim nie wykonuje faktycznie tego makra dziewięćdziesiąt dziewięć razy. Gdy Vim dotrze do ostatniej linii i wykona ruch `j`, nie znajdzie już więcej linii do przejścia w dół, zgłosi błąd i zatrzyma wykonanie makra.

Fakt, że wykonanie makra zatrzymuje się po napotkaniu pierwszego błędu, jest dobrą cechą, w przeciwnym razie Vim kontynuowałby wykonywanie tego makra dziewięćdziesiąt dziewięć razy, mimo że już dotarł do końca linii.

## Makro w Wierszu Poleceń

Uruchomienie `@a` w trybie normalnym to nie jedyny sposób, w jaki możesz wykonać makra w Vim. Możesz także uruchomić polecenie `:normal @a`. `:normal` pozwala użytkownikowi wykonać dowolne polecenie w trybie normalnym przekazane jako argument. W powyższym przypadku jest to to samo, co uruchomienie `@a` w trybie normalnym.

Polecenie `:normal` akceptuje zakres jako argumenty. Możesz użyć tego do uruchomienia makra w wybranych zakresach. Jeśli chcesz wykonać swoje makro między liniami 2 a 3, możesz uruchomić `:2,3 normal @a`.

## Wykonywanie Makra w Wielu Plikach

Załóżmy, że masz wiele plików `.txt`, z których każdy zawiera jakieś teksty. Twoim zadaniem jest zamienić na wielkie litery tylko pierwsze słowo w liniach zawierających słowo "donut". Załóżmy, że masz `0W~j` w rejestrze a (to samo makro co wcześniej). Jak możesz szybko to osiągnąć?

Pierwszy plik:

```shell
## savory.txt
a. cheddar jalapeno donut
b. mac n cheese donut
c. fried dumpling
```

Drugi plik:

```shell
## sweet.txt
a. chocolate donut
b. chocolate pancake
c. powdered sugar donut
```

Trzeci plik:

```shell
## plain.txt
a. wheat bread
b. plain donut
```

Oto jak możesz to zrobić:
- `:args *.txt` aby znaleźć wszystkie pliki `.txt` w swoim bieżącym katalogu.
- `:argdo g/donut/normal @a` wykonuje globalne polecenie `g/donut/normal @a` na każdym pliku w `:args`.
- `:argdo update` wykonuje polecenie `update`, aby zapisać każdy plik w `:args`, gdy bufor został zmodyfikowany.

Jeśli nie jesteś zaznajomiony z globalnym poleceniem `:g/donut/normal @a`, wykonuje ono polecenie, które podajesz (`normal @a`) na liniach, które pasują do wzorca (`/donut/`). Omówię globalne polecenie w późniejszym rozdziale.

## Rekurencyjne Makro

Możesz rekurencyjnie wykonać makro, wywołując ten sam rejestr makra podczas nagrywania tego makra. Załóżmy, że masz tę listę ponownie i musisz przełączyć wielkość litery pierwszego słowa:

```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

Tym razem zróbmy to rekurencyjnie. Uruchom:

```shell
qaqqa0W~j@aq
```

Oto rozbicie kroków:
- `qaq` nagrywa puste makro a. Konieczne jest rozpoczęcie od pustego rejestru, ponieważ gdy rekurencyjnie wywołasz makro, wykona ono wszystko, co znajduje się w tym rejestrze.
- `qa` rozpoczyna nagrywanie w rejestrze a.
- `0` przechodzi do pierwszego znaku w bieżącej linii.
- `W` przechodzi do następnego SŁOWA.
- `~` przełącza wielkość litery znaku pod kursorem.
- `j` przechodzi w dół o jedną linię.
- `@a` wykonuje makro a.
- `q` zatrzymuje nagrywanie.

Teraz możesz po prostu uruchomić `@a` i obserwować, jak Vim wykonuje makro rekurencyjnie.

Jak makro wiedziało, kiedy się zatrzymać? Gdy makro było na ostatniej linii, próbowało wykonać `j`, a ponieważ nie było już więcej linii do przejścia, zatrzymało wykonanie makra.

## Dodawanie do Makra

Jeśli musisz dodać czynności do istniejącego makra, zamiast tworzyć makro od nowa, możesz dodać czynności do istniejącego. W rozdziale o rejestrach nauczyłeś się, że możesz dodać do nazwanego rejestru, używając jego wielkiej litery. Ta sama zasada obowiązuje. Aby dodać czynności do rejestru makra, użyj rejestru A.

Nagraj makro w rejestrze a: `qa0W~q` (ta sekwencja przełącza wielkość litery następnego SŁOWA w linii). Jeśli chcesz dodać nową sekwencję, aby również dodać kropkę na końcu linii, uruchom:

```shell
qAA.<Esc>q
```

Rozbicie:
- `qA` rozpoczyna nagrywanie makra w rejestrze A.
- `A.<Esc>` wstawia na końcu linii (tutaj `A` to polecenie trybu wstawiania, nie mylić z makrem A) kropkę, a następnie wychodzi z trybu wstawiania.
- `q` zatrzymuje nagrywanie makra.

Teraz, gdy wykonasz `@a`, nie tylko przełącza wielkość litery następnego SŁOWA, ale także dodaje kropkę na końcu linii.

## Zmiana Makra

Co jeśli musisz dodać nowe czynności w środku makra?

Załóżmy, że masz makro, które przełącza pierwsze rzeczywiste słowo i dodaje kropkę na końcu linii, `0W~A.<Esc>` w rejestrze a. Załóżmy, że między zamianą pierwszego słowa na wielkie litery a dodaniem kropki na końcu linii, musisz dodać słowo "deep fried" tuż przed słowem "donut" *(bo jedyną rzeczą lepszą od zwykłych donutów są deep fried donuts)*.

Ponownie wykorzystam tekst z wcześniejszej sekcji:
```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

Najpierw wywołaj istniejące makro (załóżmy, że zachowałeś makro z poprzedniej sekcji w rejestrze a) za pomocą `:put a`:

```shell
0W~A.^[
```

Co to jest `^[`? Czy nie zrobiłeś `0W~A.<Esc>`? Gdzie jest `<Esc>`? `^[` to wewnętrzna reprezentacja kodu Vim dla `<Esc>`. Przy niektórych specjalnych klawiszach Vim drukuje reprezentację tych klawiszy w formie kodów wewnętrznych. Niektóre powszechne klawisze, które mają reprezentacje kodów wewnętrznych, to `<Esc>`, `<Backspace>` i `<Enter>`. Jest więcej specjalnych klawiszy, ale nie są one w zakresie tego rozdziału.

Wracając do makra, tuż po operatorze przełączania wielkości litery (`~`), dodajmy instrukcje, aby przejść do końca linii (`$`), cofnąć się o jedno słowo (`b`), przejść do trybu wstawiania (`i`), wpisać "deep fried " (nie zapomnij o spacji po "fried "), a następnie wyjść z trybu wstawiania (`<Esc>`).

Oto co będziesz miał na końcu:

```shell
0W~$bideep fried <Esc>A.^[
```

Jest mały problem. Vim nie rozumie `<Esc>`. Nie możesz dosłownie wpisać `<Esc>`. Musisz napisać wewnętrzną reprezentację kodu dla klawisza `<Esc>`. Będąc w trybie wstawiania, naciśnij `Ctrl-V`, a następnie `<Esc>`. Vim wydrukuje `^[`. `Ctrl-V` to operator trybu wstawiania, aby wstawić następny znak niecyfrowy *dosłownie*. Twój kod makra powinien teraz wyglądać tak:

```shell
0W~$bideep fried ^[A.^[
```

Aby dodać zmienioną instrukcję do rejestru a, możesz to zrobić tak samo, jak dodając nowy wpis do nazwanego rejestru. Na początku linii uruchom `"ay$`, aby przechować skopiowany tekst w rejestrze a.

Teraz, gdy wykonasz `@a`, twoje makro przełączy wielkość litery pierwszego słowa, doda "deep fried " przed "donut" i doda "." na końcu linii. Pycha!

Alternatywnym sposobem na zmianę makra jest użycie wyrażenia w wierszu poleceń. Wykonaj `:let @a="`, a następnie naciśnij `Ctrl-R a`, co dosłownie wkleja zawartość rejestru a. Na koniec nie zapomnij zamknąć podwójnych cudzysłowów (`"`). Możesz mieć coś takiego jak `:let @a="0W~$bideep fried ^[A.^["`.

## Redundancja Makra

Możesz łatwo duplikować makra z jednego rejestru do drugiego. Na przykład, aby skopiować makro z rejestru a do rejestru z, możesz wykonać `:let @z = @a`. `@a` reprezentuje zawartość rejestru a. Teraz, jeśli uruchomisz `@z`, wykona dokładnie te same czynności co `@a`.

Uważam, że tworzenie redundancji jest przydatne w przypadku moich najczęściej używanych makr. W moim przepływie pracy zazwyczaj nagrywam makra w pierwszych siedmiu literach alfabetu (a-g) i często je zastępuję bez większego zastanowienia. Jeśli przeniosę przydatne makra w kierunku końca alfabetu, mogę je zachować, nie martwiąc się, że przypadkowo je zastąpię.

## Makro Szeregowe vs Równoległe

Vim może wykonywać makra w sposób szeregowy i równoległy. Załóżmy, że masz ten tekst:

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

Jeśli chcesz nagrać makro, aby zamienić wszystkie wielkie litery "FUNC" na małe, to makro powinno działać:

```shell
qa0f{gui{jq
```

Rozbicie:
- `qa` rozpoczyna nagrywanie w rejestrze a.
- `0` przechodzi do pierwszej linii.
- `f{` znajduje pierwszą instancję "{".
- `gui{` zamienia na małe litery (`gu`) tekst wewnątrz obiektu tekstowego nawiasu (`i{`).
- `j` przechodzi w dół o jedną linię.
- `q` zatrzymuje nagrywanie makra.

Teraz możesz uruchomić `99@a`, aby wykonać to na pozostałych liniach. Jednak co jeśli masz ten wyraz importu w swoim pliku?

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import foo from "bar";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

Uruchomienie `99@a` wykonuje makro tylko trzy razy. Nie wykonuje makra na ostatnich dwóch liniach, ponieważ wykonanie nie udaje się na linii "foo". To jest oczekiwane podczas wykonywania makra w sposób szeregowy. Zawsze możesz przejść do następnej linii, gdzie jest "FUNC4", i ponownie odtworzyć to makro. Ale co jeśli chcesz wszystko załatwić za jednym razem?

Uruchom makro równolegle.

Przypomnij sobie z wcześniejszej sekcji, że makra mogą być wykonywane za pomocą polecenia w wierszu poleceń `:normal` (np. `:3,5 normal @a` wykonuje makro a na liniach 3-5). Jeśli uruchomisz `:1,$ normal @a`, zobaczysz, że makro jest wykonywane na wszystkich liniach z wyjątkiem linii "foo". Działa!

Chociaż wewnętrznie Vim faktycznie nie wykonuje makr równolegle, na zewnątrz zachowuje się jakby tak było. Vim wykonuje `@a` *niezależnie* na każdej linii od pierwszej do ostatniej linii (`1,$`). Ponieważ Vim wykonuje te makra niezależnie, każda linia nie wie, że jedno z wykonanych makr nie powiodło się na linii "foo".
## Ucz się makr w inteligentny sposób

Wiele rzeczy, które robisz podczas edytowania, jest powtarzalnych. Aby stać się lepszym w edytowaniu, przyzwyczaj się do wykrywania powtarzalnych działań. Używaj makr (lub polecenia kropkowego), aby nie musieć wykonywać tej samej akcji dwa razy. Prawie wszystko, co możesz zrobić w Vim, można powtórzyć za pomocą makr.

Na początku pisanie makr wydaje mi się bardzo niezręczne, ale nie poddawaj się. Przy wystarczającej praktyce przyzwyczaisz się do automatyzacji wszystkiego.

Możesz uznać za pomocne używanie mnemoników, aby zapamiętać swoje makra. Jeśli masz makro, które tworzy funkcję, użyj rejestru "f (`qf`). Jeśli masz makro do operacji numerycznych, powinien działać rejestr "n (`qn`). Nazwij je pierwszym rejestrem nazwanym, który przychodzi ci na myśl, gdy myślisz o tej operacji. Uważam również, że rejestr "q jest dobrym domyślnym rejestrem makr, ponieważ `qq` wymaga mniej wysiłku umysłowego, aby wymyślić. Na koniec lubię również zwiększać moje makra w porządku alfabetycznym, jak `qa`, potem `qb`, potem `qc` i tak dalej.

Znajdź metodę, która najlepiej działa dla ciebie.