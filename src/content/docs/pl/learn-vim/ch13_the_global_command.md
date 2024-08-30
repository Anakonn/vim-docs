---
description: Niniejszy dokument omawia użycie polecenia globalnego w Vimie, umożliwiającego
  wykonywanie poleceń na wielu liniach jednocześnie.
title: Ch13. the Global Command
---

Do tej pory nauczyłeś się, jak powtórzyć ostatnią zmianę za pomocą polecenia kropki (`.`), jak odtwarzać akcje za pomocą makr (`q`) oraz jak przechowywać teksty w rejestrach (`"`).

W tym rozdziale nauczysz się, jak powtórzyć polecenie wiersza poleceń za pomocą polecenia globalnego.

## Przegląd polecenia globalnego

Polecenie globalne Vim służy do uruchamiania polecenia wiersza poleceń na wielu liniach jednocześnie.

Przy okazji, mogłeś wcześniej słyszeć termin "polecenia Ex". W tym przewodniku odnoszę się do nich jako do poleceń wiersza poleceń. Zarówno polecenia Ex, jak i polecenia wiersza poleceń są tym samym. Są to polecenia, które zaczynają się od dwukropka (`:`). Polecenie zamiany z ostatniego rozdziału było przykładem polecenia Ex. Nazywają się Ex, ponieważ pierwotnie pochodziły z edytora tekstu Ex. Będę nadal odnosił się do nich jako do poleceń wiersza poleceń w tym przewodniku. Pełną listę poleceń Ex znajdziesz w `:h ex-cmd-index`.

Polecenie globalne ma następującą składnię:

```shell
:g/pattern/command
```

`pattern` pasuje do wszystkich linii zawierających ten wzór, podobnie jak wzór w poleceniu zamiany. `command` może być dowolnym poleceniem wiersza poleceń. Polecenie globalne działa, wykonując `command` na każdej linii, która pasuje do `pattern`.

Jeśli masz następujące wyrażenia:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Aby usunąć wszystkie linie zawierające "console", możesz uruchomić:

```shell
:g/console/d
```

Wynik:

```shell
const one = 1;

const two = 2;

const three = 3;
```

Polecenie globalne wykonuje polecenie usunięcia (`d`) na wszystkich liniach, które pasują do wzoru "console".

Podczas uruchamiania polecenia `g`, Vim wykonuje dwa skany w pliku. Podczas pierwszego uruchomienia skanuje każdą linię i oznacza linię, która pasuje do wzoru `/console/`. Gdy wszystkie pasujące linie są oznaczone, przechodzi do drugiego skanowania i wykonuje polecenie `d` na oznaczonych liniach.

Jeśli chcesz zamiast tego usunąć wszystkie linie zawierające "const", uruchom:

```shell
:g/const/d
```

Wynik:

```shell
console.log("one: ", one);

console.log("two: ", two);

console.log("three: ", three);
```

## Dopasowanie odwrotne

Aby uruchomić polecenie globalne na liniach, które nie pasują, możesz uruchomić:

```shell
:g!/pattern/command
```

lub

```shell
:v/pattern/command
```

Jeśli uruchomisz `:v/console/d`, usunie wszystkie linie *nie* zawierające "console".

## Wzór

Polecenie globalne używa tego samego systemu wzorów co polecenie zamiany, więc ta sekcja będzie służyć jako przypomnienie. Możesz pominąć tę sekcję lub czytać dalej!

Jeśli masz te wyrażenia:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Aby usunąć linie zawierające "one" lub "two", uruchom:

```shell
:g/one\|two/d
```

Aby usunąć linie zawierające jakiekolwiek pojedyncze cyfry, uruchom:

```shell
:g/[0-9]/d
```

lub

```shell
:g/\d/d
```

Jeśli masz wyrażenie:

```shell
const oneMillion = 1000000;
const oneThousand = 1000;
const one = 1;
```

Aby dopasować linie zawierające od trzech do sześciu zer, uruchom:

```shell
:g/0\{3,6\}/d
```

## Przekazywanie zakresu

Możesz przekazać zakres przed poleceniem `g`. Oto kilka sposobów, jak to zrobić:
- `:1,5g/console/d`  pasuje do ciągu "console" między liniami 1 a 5 i je usuwa.
- `:,5g/console/d` jeśli nie ma adresu przed przecinkiem, zaczyna od bieżącej linii. Szuka ciągu "console" między bieżącą linią a linią 5 i je usuwa.
- `:3,g/console/d` jeśli nie ma adresu po przecinku, kończy się na bieżącej linii. Szuka ciągu "console" między linią 3 a bieżącą linią i je usuwa.
- `:3g/console/d` jeśli przekazujesz tylko jeden adres bez przecinka, polecenie wykonuje się tylko na linii 3. Szuka w linii 3 i usuwa ją, jeśli zawiera ciąg "console".

Oprócz liczb możesz również używać tych symboli jako zakresu:
- `.` oznacza bieżącą linię. Zakres `.,3` oznacza między bieżącą linią a linią 3.
- `$` oznacza ostatnią linię w pliku. Zakres `3,$` oznacza między linią 3 a ostatnią linią.
- `+n` oznacza n linii po bieżącej linii. Możesz użyć tego z `.` lub bez. `3,+1` lub `3,.+1` oznacza między linią 3 a linią po bieżącej linii.

Jeśli nie podasz żadnego zakresu, domyślnie wpływa to na cały plik. To nie jest właściwie norma. Większość poleceń wiersza poleceń Vim działa tylko na bieżącej linii, jeśli nie podasz żadnego zakresu. Dwie znaczące wyjątki to polecenie globalne (`:g`) i polecenie zapisu (`:w`).

## Polecenie normalne

Możesz uruchomić polecenie normalne za pomocą polecenia globalnego z poleceniem `:normal`.

Jeśli masz ten tekst:
```shell
const one = 1
console.log("one: ", one)

const two = 2
console.log("two: ", two)

const three = 3
console.log("three: ", three)
```

Aby dodać ";" na końcu każdej linii, uruchom:

```shell
:g/./normal A;
```

Rozłóżmy to:
- `:g` to polecenie globalne.
- `/./` to wzór dla "niepustych linii". Pasuje do linii z co najmniej jednym znakiem, więc pasuje do linii z "const" i "console" i nie pasuje do pustych linii.
- `normal A;` uruchamia polecenie `:normal`. `A;` to polecenie w trybie normalnym, aby wstawić ";" na końcu linii.

## Wykonywanie makra

Możesz również wykonać makro za pomocą polecenia globalnego. Makro można wykonać za pomocą polecenia `normal`. Jeśli masz wyrażenia:

```shell
const one = 1
console.log("one: ", one);

const two = 2
console.log("two: ", two);

const three = 3
console.log("three: ", three);
```

Zauważ, że linie z "const" nie mają średników. Stwórzmy makro, aby dodać średnik na końcu tych linii w rejestrze a:

```shell
qaA;<Esc>q
```

Jeśli potrzebujesz przypomnienia, sprawdź rozdział o makrach. Teraz uruchom:

```shell
:g/const/normal @a
```

Teraz wszystkie linie z "const" będą miały ";" na końcu.

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Jeśli postępowałeś zgodnie z tym krok po kroku, będziesz miał dwa średniki w pierwszej linii. Aby tego uniknąć, uruchom polecenie globalne od drugiej linii, `:2,$g/const/normal @a`.

## Rekurencyjne polecenie globalne

Polecenie globalne samo w sobie jest rodzajem polecenia wiersza poleceń, więc technicznie możesz uruchomić polecenie globalne wewnątrz polecenia globalnego.

Mając następujące wyrażenia, jeśli chcesz usunąć drugie polecenie `console.log`:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Jeśli uruchomisz:

```shell
:g/console/g/two/d
```

Najpierw `g` będzie szukać linii zawierających wzór "console" i znajdzie 3 dopasowania. Następnie drugie `g` będzie szukać linii zawierającej wzór "two" spośród tych trzech dopasowań. Na koniec usunie to dopasowanie.

Możesz również połączyć `g` z `v`, aby znaleźć wzory pozytywne i negatywne. Na przykład:

```shell
:g/console/v/two/d
```

Zamiast szukać linii zawierającej wzór "two", będzie szukać linii *nie* zawierających wzoru "two".

## Zmiana delimitera

Możesz zmienić delimiter polecenia globalnego, podobnie jak w poleceniu zamiany. Zasady są takie same: możesz używać dowolnego pojedynczego znaku bajtowego, z wyjątkiem liter, cyfr, `"`, `|` i `\`.

Aby usunąć linie zawierające "console":

```shell
:g@console@d
```

Jeśli używasz polecenia zamiany z poleceniem globalnym, możesz mieć dwa różne delimitery:

```shell
g@one@s+const+let+g
```

Tutaj polecenie globalne będzie szukać wszystkich linii zawierających "one". Polecenie zamiany zastąpi, z tych dopasowań, ciąg "const" na "let".

## Domyślne polecenie

Co się stanie, jeśli nie określisz żadnego polecenia wiersza poleceń w poleceniu globalnym?

Polecenie globalne użyje polecenia wydruku (`:p`), aby wydrukować tekst bieżącej linii. Jeśli uruchomisz:

```shell
:g/console
```

Wydrukuje na dole ekranu wszystkie linie zawierające "console".

Przy okazji, oto jedna interesująca fakt. Ponieważ domyślne polecenie używane przez polecenie globalne to `p`, sprawia to, że składnia `g` to:

```shell
:g/re/p
```

- `g` = polecenie globalne
- `re` = wzór regex
- `p` = polecenie wydruku

Tworzy to słowo *"grep"*, to samo `grep` z wiersza poleceń. To **nie** jest przypadek. Polecenie `g/re/p` pierwotnie pochodziło z edytora Ed, jednego z oryginalnych edytorów tekstu wiersza. Polecenie `grep` otrzymało swoją nazwę od Ed.

Twój komputer prawdopodobnie nadal ma edytor Ed. Uruchom `ed` z terminala (podpowiedź: aby wyjść, wpisz `q`).

## Odwracanie całego bufora

Aby odwrócić cały plik, uruchom:

```shell
:g/^/m 0
```

`^` to wzór dla początku linii. Użyj `^`, aby dopasować wszystkie linie, w tym puste linie.

Jeśli potrzebujesz odwrócić tylko kilka linii, przekaż mu zakres. Aby odwrócić linie między piątą a dziesiątą, uruchom:

```shell
:5,10g/^/m 0
```

Aby dowiedzieć się więcej o poleceniu przenoszenia, sprawdź `:h :move`.

## Agregowanie wszystkich TODO

Podczas kodowania czasami piszę TODO w pliku, który edytuję:

```shell
const one = 1;
console.log("one: ", one);
// TODO: nakarmić szczeniaka

const two = 2;
// TODO: nakarmić szczeniaka automatycznie
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: stworzyć startup sprzedający automatyczną karmę dla szczeniąt
```

Może być trudno śledzić wszystkie stworzone TODO. Vim ma metodę `:t` (kopiowanie), aby skopiować wszystkie dopasowania do adresu. Aby dowiedzieć się więcej o metodzie kopiowania, sprawdź `:h :copy`.

Aby skopiować wszystkie TODO na koniec pliku dla łatwiejszej inspekcji, uruchom:

```shell
:g/TODO/t $
```

Wynik:

```shell
const one = 1;
console.log("one: ", one);
// TODO: nakarmić szczeniaka

const two = 2;
// TODO: nakarmić szczeniaka automatycznie
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: stworzyć startup sprzedający automatyczną karmę dla szczeniąt

// TODO: nakarmić szczeniaka
// TODO: nakarmić szczeniaka automatycznie
// TODO: stworzyć startup sprzedający automatyczną karmę dla szczeniąt
```

Teraz mogę przeglądać wszystkie TODO, które stworzyłem, znaleźć czas, aby je wykonać lub zlecić je komuś innemu, i kontynuować pracę nad moim następnym zadaniem.

Jeśli zamiast kopiowania chcesz przenieść wszystkie TODO na koniec, użyj polecenia przenoszenia, `:m`:

```shell
:g/TODO/m $
```

Wynik:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);

// TODO: nakarmić szczeniaka
// TODO: nakarmić szczeniaka automatycznie
// TODO: stworzyć startup sprzedający automatyczną karmę dla szczeniąt
```

## Usunięcie do czarnej dziury

Przypomnij sobie z rozdziału o rejestrach, że usunięte teksty są przechowywane w rejestrach numerowanych (pod warunkiem, że są wystarczająco duże). Kiedy uruchamiasz `:g/console/d`, Vim przechowuje usunięte linie w rejestrach numerowanych. Jeśli usuniesz wiele linii, możesz szybko zapełnić wszystkie rejestry numerowane. Aby temu zapobiec, zawsze możesz użyć rejestru czarnej dziury (`"_`), aby *nie* przechowywać usuniętych linii w rejestrach. Uruchom:

```shell
:g/console/d_
```

Przekazując `_` po `d`, Vim nie wykorzysta twoich rejestrów tymczasowych.
## Zmniejsz wiele pustych linii do jednej pustej linii

Jeśli masz tekst z wieloma pustymi liniami:

```shell
const one = 1;
console.log("one: ", one);


const two = 2;
console.log("two: ", two);





const three = 3;
console.log("three: ", three);
```

Możesz szybko zmniejszyć puste linie do jednej pustej linii za pomocą:

```shell
:g/^$/,/./-1j
```

Wynik:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Normalnie polecenie globalne przyjmuje następującą formę: `:g/pattern/command`. Możesz jednak również uruchomić polecenie globalne w następującej formie: `:g/pattern1/,/pattern2/command`. Dzięki temu Vim zastosuje `command` w obrębie `pattern1` i `pattern2`.

Mając to na uwadze, rozłóżmy polecenie `:g/^$/,/./-1j` zgodnie z `:g/pattern1/,/pattern2/command`:
- `/pattern1/` to `/^$/`. Reprezentuje pustą linię (linię z zerowym znakiem).
- `/pattern2/` to `/./` z modyfikatorem linii `-1`. `/./` reprezentuje linię niepustą (linię z co najmniej jednym znakiem). `-1` oznacza linię powyżej.
- `command` to `j`, polecenie łączenia (`:j`). W tym kontekście to polecenie globalne łączy wszystkie podane linie.

Swoją drogą, jeśli chcesz zmniejszyć wiele pustych linii do braku linii, uruchom to zamiast:

```shell
:g/^$/,/./j
```

Prostsza alternatywa:

```shell
:g/^$/-j
```

Twój tekst został teraz zmniejszony do:

```shell
const one = 1;
console.log("one: ", one);
const two = 2;
console.log("two: ", two);
const three = 3;
console.log("three: ", three);
```

## Zaawansowane sortowanie

Vim ma polecenie `:sort`, aby sortować linie w obrębie zakresu. Na przykład:

```shell
d
b
a
e
c
```

Możesz je posortować, uruchamiając `:sort`. Jeśli podasz zakres, posortuje tylko linie w tym zakresie. Na przykład, `:3,5sort` sortuje tylko linie trzy i pięć.

Jeśli masz następujące wyrażenia:

```shell
const arrayB = [
  "i",
  "g",
  "h",
  "b",
  "f",
  "d",
  "e",
  "c",
  "a",
]

const arrayA = [
  "h",
  "b",
  "f",
  "d",
  "e",
  "a",
  "c",
]
```

Jeśli musisz posortować elementy wewnątrz tablic, ale nie same tablice, możesz uruchomić to:

```shell
:g/\[/+1,/\]/-1sort
```

Wynik:

```shell
const arrayB = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
]

const arrayA = [
  "a"
  "b",
  "c",
  "d",
  "e",
  "f",
  "h",
]
```

To świetnie! Ale polecenie wygląda skomplikowanie. Rozłóżmy je. To polecenie również podąża za formą `:g/pattern1/,/pattern2/command`.

- `:g` to wzorzec polecenia globalnego.
- `/\[/+1` to pierwszy wzorzec. Dopasowuje dosłowny lewy nawias kwadratowy "[". `+1` odnosi się do linii poniżej.
- `/\]/-1` to drugi wzorzec. Dopasowuje dosłowny prawy nawias kwadratowy "]". `-1` odnosi się do linii powyżej.
- `/\[/+1,/\]/-1` odnosi się do wszystkich linii między "[" a "]".
- `sort` to polecenie wiersza poleceń do sortowania.

## Naucz się polecenia globalnego w mądry sposób

Polecenie globalne wykonuje polecenie wiersza poleceń na wszystkich dopasowanych liniach. Dzięki temu wystarczy uruchomić polecenie raz, a Vim zrobi resztę za Ciebie. Aby stać się biegłym w poleceniu globalnym, wymagane są dwie rzeczy: dobra znajomość poleceń wiersza poleceń oraz wiedza o wyrażeniach regularnych. Im więcej czasu spędzisz na korzystaniu z Vima, tym więcej poleceń wiersza poleceń naturalnie się nauczysz. Wiedza o wyrażeniach regularnych będzie wymagała bardziej aktywnego podejścia. Ale gdy już poczujesz się komfortowo z wyrażeniami regularnymi, będziesz przed wieloma.

Niektóre z przykładów tutaj są skomplikowane. Nie daj się zniechęcić. Naprawdę poświęć czas, aby je zrozumieć. Naucz się czytać wzorce. Nie poddawaj się.

Kiedy musisz uruchomić wiele poleceń, zatrzymaj się i zobacz, czy możesz użyć polecenia `g`. Zidentyfikuj najlepsze polecenie do wykonania zadania i napisz wzorzec, aby celować w jak najwięcej rzeczy jednocześnie.

Teraz, gdy wiesz, jak potężne jest polecenie globalne, nauczmy się, jak używać poleceń zewnętrznych, aby zwiększyć swoje zasoby narzędziowe.