---
description: W tym rozdziale poznasz różne wskazówki dotyczące trybu wiersza poleceń
  w Vimie, w tym wchodzenie, wychodzenie oraz używanie poleceń.
title: Ch15. Command-line Mode
---

W ostatnich trzech rozdziałach nauczyłeś się, jak używać poleceń wyszukiwania (`/`, `?`), polecenia zamiany (`:s`), polecenia globalnego (`:g`) oraz polecenia zewnętrznego (`!`). To są przykłady poleceń w trybie wiersza poleceń.

W tym rozdziale nauczysz się różnych wskazówek i trików dotyczących trybu wiersza poleceń.

## Wchodzenie i wychodzenie z trybu wiersza poleceń

Tryb wiersza poleceń jest trybem samym w sobie, tak jak tryb normalny, tryb wstawiania i tryb wizualny. Kiedy jesteś w tym trybie, kursor przemieszcza się na dół ekranu, gdzie możesz wpisywać różne polecenia.

Istnieją 4 różne polecenia, które możesz użyć, aby wejść w tryb wiersza poleceń:
- Wzory wyszukiwania (`/`, `?`)
- Polecenia wiersza poleceń (`:`)
- Polecenia zewnętrzne (`!`)

Możesz wejść w tryb wiersza poleceń z trybu normalnego lub trybu wizualnego.

Aby opuścić tryb wiersza poleceń, możesz użyć `<Esc>`, `Ctrl-C` lub `Ctrl-[`.

*Inne publikacje mogą odnosić się do "polecenia wiersza poleceń" jako "polecenia Ex" oraz do "polecenia zewnętrznego" jako "polecenia filtrującego" lub "operatora bang".*

## Powtarzanie poprzedniego polecenia

Możesz powtórzyć poprzednie polecenie wiersza poleceń lub polecenie zewnętrzne za pomocą `@:`.

Jeśli właśnie wykonałeś `:s/foo/bar/g`, uruchomienie `@:` powtarza tę zamianę. Jeśli właśnie wykonałeś `:.!tr '[a-z]' '[A-Z]'`, uruchomienie `@:` powtarza ostatnie polecenie zewnętrzne filtra tłumaczenia.

## Skróty w trybie wiersza poleceń

Będąc w trybie wiersza poleceń, możesz poruszać się w lewo lub w prawo, jeden znak na raz, za pomocą strzałek `Left` lub `Right`.

Jeśli musisz poruszać się słowo po słowie, użyj `Shift-Left` lub `Shift-Right` (w niektórych systemach operacyjnych możesz musieć użyć `Ctrl` zamiast `Shift`).

Aby przejść na początek linii, użyj `Ctrl-B`. Aby przejść na koniec linii, użyj `Ctrl-E`.

Podobnie jak w trybie wstawiania, w trybie wiersza poleceń masz trzy sposoby na usunięcie znaków:

```shell
Ctrl-H    Usuń jeden znak
Ctrl-W    Usuń jedno słowo
Ctrl-U    Usuń całą linię
```
Na koniec, jeśli chcesz edytować polecenie tak, jakbyś edytował normalny plik tekstowy, użyj `Ctrl-F`.

To również pozwala na przeszukiwanie poprzednich poleceń, edytowanie ich i ponowne uruchamianie, naciskając `<Enter>` w "normalnym trybie edytowania wiersza poleceń".

## Rejestr i autouzupełnianie

Będąc w trybie wiersza poleceń, możesz wstawiać teksty z rejestru Vim za pomocą `Ctrl-R`, tak jak w trybie wstawiania. Jeśli masz ciąg "foo" zapisany w rejestrze a, możesz go wstawić, uruchamiając `Ctrl-R a`. Wszystko, co możesz uzyskać z rejestru w trybie wstawiania, możesz zrobić to samo w trybie wiersza poleceń.

Dodatkowo, możesz również uzyskać słowo pod kursorem za pomocą `Ctrl-R Ctrl-W` (`Ctrl-R Ctrl-A` dla WORD pod kursorem). Aby uzyskać linię pod kursorem, użyj `Ctrl-R Ctrl-L`. Aby uzyskać nazwę pliku pod kursorem, użyj `Ctrl-R Ctrl-F`.

Możesz także autouzupełniać istniejące polecenia. Aby autouzupełnić polecenie `echo`, będąc w trybie wiersza poleceń, wpisz "ec", a następnie naciśnij `<Tab>`. Powinieneś zobaczyć w lewym dolnym rogu polecenia Vim zaczynające się na "ec" (przykład: `echo echoerr echohl echomsg econ`). Aby przejść do następnej opcji, naciśnij `<Tab>` lub `Ctrl-N`. Aby przejść do poprzedniej opcji, naciśnij `<Shift-Tab>` lub `Ctrl-P`.

Niektóre polecenia wiersza poleceń akceptują nazwy plików jako argumenty. Przykładem jest `edit`. Możesz również tutaj autouzupełniać. Po wpisaniu polecenia `:e ` (nie zapomnij o spacji), naciśnij `<Tab>`. Vim wyświetli wszystkie odpowiednie nazwy plików, z których możesz wybierać, więc nie musisz wpisywać ich od nowa.

## Okno historii i okno wiersza poleceń

Możesz przeglądać historię poleceń wiersza poleceń i terminów wyszukiwania (to wymaga funkcji `+cmdline_hist`).

Aby otworzyć historię wiersza poleceń, uruchom `:his :`. Powinieneś zobaczyć coś takiego:

```shell
## Historia poleceń
2  e file1.txt
3  g/foo/d
4  s/foo/bar/g
```

Vim wyświetla historię wszystkich poleceń `:` które wykonałeś. Domyślnie Vim przechowuje ostatnie 50 poleceń. Aby zmienić liczbę wpisów, które Vim zapamiętuje na 100, uruchom `set history=100`.

Bardziej użytecznym zastosowaniem historii wiersza poleceń jest okno wiersza poleceń, `q:`. To otworzy okno historii, które można przeszukiwać i edytować. Załóżmy, że masz te wyrażenia w historii, gdy naciśniesz `q:`:

```shell
51  s/verylongsubstitutionpattern/pancake/g
52  his :
53  wq
```

Jeśli twoim aktualnym zadaniem jest wykonanie `s/verylongsubstitutionpattern/donut/g`, zamiast wpisywać polecenie od nowa, dlaczego nie wykorzystać `s/verylongsubstitutionpattern/pancake/g`? W końcu jedyną różnicą jest słowo, które ma być zamienione, "donut" vs "pancake". Wszystko inne jest takie samo.

Po uruchomieniu `q:`, znajdź `s/verylongsubstitutionpattern/pancake/g` w historii (możesz użyć nawigacji Vim w tym środowisku) i edytuj to bezpośrednio! Zmień "pancake" na "donut" w oknie historii, a następnie naciśnij `<Enter>`. Boom! Vim wykona `s/verylongsubstitutionpattern/donut/g` za Ciebie. Super wygodne!

Podobnie, aby przeglądać historię wyszukiwania, uruchom `:his /` lub `:his ?`. Aby otworzyć okno historii wyszukiwania, w którym możesz przeszukiwać i edytować przeszłą historię, uruchom `q/` lub `q?`.

Aby zamknąć to okno, naciśnij `Ctrl-C`, `Ctrl-W C` lub wpisz `:quit`.

## Więcej poleceń wiersza poleceń

Vim ma setki wbudowanych poleceń. Aby zobaczyć wszystkie polecenia, które ma Vim, sprawdź `:h ex-cmd-index` lub `:h :index`.

## Ucz się trybu wiersza poleceń w inteligentny sposób

W porównaniu do pozostałych trzech trybów, tryb wiersza poleceń jest jak scyzoryk szwajcarski edytowania tekstu. Możesz edytować tekst, modyfikować pliki i wykonywać polecenia, żeby wymienić tylko kilka. Ten rozdział to zbiór różnych rzeczy dotyczących trybu wiersza poleceń. Zamyka również tryby Vim. Teraz, gdy wiesz, jak używać trybu normalnego, wstawiania, wizualnego i wiersza poleceń, możesz edytować tekst w Vim szybciej niż kiedykolwiek.

Czas odejść od trybów Vim i nauczyć się, jak jeszcze szybciej nawigować za pomocą tagów Vim.