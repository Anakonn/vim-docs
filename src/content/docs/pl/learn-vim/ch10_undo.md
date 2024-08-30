---
description: Poznaj system cofania w Vimie, który umożliwia nie tylko prostą korektę
  błędów, ale także nawigację po różnych stanach tekstu.
title: Ch10. Undo
---

Wszyscy popełniamy różne błędy podczas pisania. Dlatego cofanie zmian jest niezbędną funkcją w każdym nowoczesnym oprogramowaniu. System cofania w Vimie nie tylko potrafi cofać i ponawiać proste błędy, ale także uzyskiwać dostęp do różnych stanów tekstu, dając Ci kontrolę nad wszystkimi tekstami, które kiedykolwiek wpisałeś. W tym rozdziale nauczysz się, jak cofać, ponawiać, nawigować po gałęzi cofania, utrzymywać cofanie i podróżować w czasie.

## Cofanie, Ponawianie i COFANIE

Aby wykonać podstawowe cofnięcie, możesz użyć `u` lub uruchomić `:undo`.

Jeśli masz ten tekst (zauważ pustą linię poniżej "one"):

```shell
one

```

Następnie dodajesz inny tekst:

```shell
one
two
```

Jeśli naciśniesz `u`, Vim cofa tekst "two".

Jak Vim wie, ile cofnąć? Vim cofa pojedynczą "zmianę" na raz, podobnie jak zmiana polecenia kropki (w przeciwieństwie do polecenia kropki, polecenia w wierszu poleceń również liczą się jako zmiana).

Aby ponowić ostatnią zmianę, naciśnij `Ctrl-R` lub uruchom `:redo`. Po cofnięciu tekstu powyżej, aby usunąć "two", uruchomienie `Ctrl-R` przywróci usunięty tekst.

Vim ma również COFANIE, które możesz uruchomić za pomocą `U`. Cofnie wszystkie ostatnie zmiany.

Jak `U` różni się od `u`? Po pierwsze, `U` usuwa *wszystkie* zmiany na ostatnio zmienionej linii, podczas gdy `u` usuwa tylko jedną zmianę na raz. Po drugie, podczas gdy wykonanie `u` nie liczy się jako zmiana, wykonanie `U` liczy się jako zmiana.

Wracając do tego przykładu:

```shell
one
two
```

Zmień drugą linię na "three":

```shell
one
three
```

Zmień drugą linię ponownie i zastąp ją "four":

```shell
one
four
```

Jeśli naciśniesz `u`, zobaczysz "three". Jeśli naciśniesz `u` ponownie, zobaczysz "two". Jeśli zamiast naciskać `u`, gdy nadal miałeś tekst "four", nacisnąłbyś `U`, zobaczysz:

```shell
one

```

`U` omija wszystkie pośrednie zmiany i wraca do pierwotnego stanu, kiedy zaczynałeś (pusta linia). Dodatkowo, ponieważ COFANIE faktycznie tworzy nową zmianę w Vimie, możesz COFNIĆ swoje COFANIE. `U` po `U` cofa samo siebie. Możesz nacisnąć `U`, następnie `U`, następnie `U` itd. Zobaczysz te same dwa stany tekstu przełączające się tam i z powrotem.

Osobiście nie używam `U`, ponieważ trudno jest zapamiętać pierwotny stan (rzadko go potrzebuję).

Vim ustawia maksymalną liczbę, ile razy możesz cofnąć w zmiennej opcji `undolevels`. Możesz to sprawdzić za pomocą `:echo &undolevels`. Ustawiłem swoją na 1000. Aby zmienić swoją na 1000, uruchom `:set undolevels=1000`. Możesz ustawić to na dowolną liczbę, którą chcesz.

## Łamanie bloków

Wspomniałem wcześniej, że `u` cofa pojedynczą "zmianę" podobnie jak zmiana polecenia kropki: teksty wstawione od momentu wejścia w tryb wstawiania do momentu wyjścia z niego liczą się jako zmiana.

Jeśli zrobisz `ione two three<Esc>` a następnie naciśniesz `u`, Vim usunie cały tekst "one two three", ponieważ całość liczy się jako zmiana. To nie jest wielka sprawa, jeśli napisałeś krótkie teksty, ale co jeśli napisałeś kilka akapitów w jednej sesji trybu wstawiania bez wychodzenia i później zdałeś sobie sprawę, że popełniłeś błąd? Jeśli naciśniesz `u`, wszystko, co napisałeś, zostanie usunięte. Czyż nie byłoby użyteczne, gdybyś mógł nacisnąć `u`, aby usunąć tylko sekcję swojego tekstu?

Na szczęście możesz łamać bloki cofania. Kiedy piszesz w trybie wstawiania, naciśnięcie `Ctrl-G u` tworzy punkt przerwania cofania. Na przykład, jeśli zrobisz `ione <Ctrl-G u>two <Ctrl-G u>three<Esc>`, a następnie naciśniesz `u`, stracisz tylko tekst "three" (naciśnij `u` jeszcze raz, aby usunąć "two"). Kiedy piszesz długi tekst, używaj `Ctrl-G u` strategicznie. Koniec każdego zdania, między dwoma akapitami lub po każdej linii kodu to doskonałe miejsca, aby dodać punkty przerwania cofania, aby ułatwić cofanie swoich błędów, jeśli kiedykolwiek je popełnisz.

Przydatne jest również stworzenie punktu przerwania cofania podczas usuwania fragmentów w trybie wstawiania za pomocą `Ctrl-W` (usuń słowo przed kursorem) i `Ctrl-U` (usuń cały tekst przed kursorem). Przyjaciel zasugerował użycie następujących map:

```shell
inoremap <c-u> <c-g>u<c-u>
inoremap <c-w> <c-g>u<c-w>
```

Dzięki nim możesz łatwo odzyskać usunięte teksty.

## Drzewo cofania

Vim przechowuje każdą zmianę, która kiedykolwiek została napisana w drzewie cofania. Rozpocznij nowy pusty plik. Następnie dodaj nowy tekst:

```shell
one

```

Dodaj nowy tekst:

```shell
one
two
```

Cofnij raz:

```shell
one

```

Dodaj inny tekst:

```shell
one
three
```

Cofnij ponownie:

```shell
one

```

I dodaj kolejny inny tekst:

```shell
one
four
```

Teraz, jeśli cofniesz, stracisz tekst "four", który właśnie dodałeś:

```shell
one

```

Jeśli cofniesz jeszcze raz:

```shell

```

Stracisz tekst "one". W większości edytorów tekstu odzyskanie tekstów "two" i "three" byłoby niemożliwe, ale nie w Vimie! Naciśnij `g+`, a odzyskasz swój tekst "one":

```shell
one

```

Napisz `g+` ponownie, a zobaczysz starego znajomego:

```shell
one
two
```

Kontynuuj. Naciśnij `g+` ponownie:

```shell
one
three
```

Naciśnij `g+` jeszcze raz:

```shell
one
four
```

W Vimie, za każdym razem, gdy naciskasz `u`, a następnie dokonujesz innej zmiany, Vim przechowuje tekst poprzedniego stanu, tworząc "gałąź cofania". W tym przykładzie, po wpisaniu "two", a następnie naciśnięciu `u`, a następnie wpisaniu "three", stworzyłeś gałąź liści, która przechowuje stan zawierający tekst "two". W tym momencie drzewo cofania zawierało co najmniej dwa węzły liściaste: główny węzeł zawierający tekst "three" (najbardziej aktualny) i węzeł gałęzi cofania zawierający tekst "two". Gdybyś wykonał kolejne cofnięcie i wpisał tekst "four", miałbyś trzy węzły: główny węzeł zawierający tekst "four" oraz dwa węzły zawierające teksty "three" i "two".

Aby przechodzić przez każdy węzeł drzewa cofania, możesz użyć `g+`, aby przejść do nowszego stanu, i `g-`, aby przejść do starszego stanu. Różnica między `u`, `Ctrl-R`, `g+` i `g-` polega na tym, że zarówno `u`, jak i `Ctrl-R` przechodzą tylko przez *główne* węzły w drzewie cofania, podczas gdy `g+` i `g-` przechodzą przez *wszystkie* węzły w drzewie cofania.

Drzewo cofania nie jest łatwe do zwizualizowania. Uważam, że wtyczka [vim-mundo](https://github.com/simnalamburt/vim-mundo) jest bardzo przydatna do wizualizacji drzewa cofania w Vimie. Daj sobie trochę czasu, aby się z tym zapoznać.

## Trwałe cofanie

Jeśli uruchomisz Vima, otworzysz plik i natychmiast naciśniesz `u`, Vim prawdopodobnie wyświetli ostrzeżenie "*Już na najstarszej zmianie*". Nie ma nic do cofnięcia, ponieważ nie wprowadziłeś żadnych zmian.

Aby przenieść historię cofania z ostatniej sesji edycyjnej, Vim może zachować Twoją historię cofania w pliku cofania za pomocą `:wundo`.

Utwórz plik `mynumbers.txt`. Wpisz:

```shell
one
```

Następnie wpisz kolejną linię (upewnij się, że każda linia liczy się jako zmiana):

```shell
one
two
```

Wpisz kolejną linię:

```shell
one
two
three
```

Teraz utwórz swój plik cofania za pomocą `:wundo {my-undo-file}`. Jeśli musisz nadpisać istniejący plik cofania, możesz dodać `!` po `wundo`.

```shell
:wundo! mynumbers.undo
```

Następnie wyjdź z Vima.

Do tej pory powinieneś mieć pliki `mynumbers.txt` i `mynumbers.undo` w swoim katalogu. Otwórz ponownie `mynumbers.txt` i spróbuj nacisnąć `u`. Nie możesz. Nie wprowadziłeś żadnych zmian od momentu otwarcia pliku. Teraz załaduj swoją historię cofania, odczytując plik cofania za pomocą `:rundo`:

```shell
:rundo mynumbers.undo
```

Teraz, jeśli naciśniesz `u`, Vim usunie "three". Naciśnij `u` ponownie, aby usunąć "two". To tak, jakbyś nigdy nie zamykał Vima!

Jeśli chcesz mieć automatyczne zachowanie cofania, jednym ze sposobów jest dodanie tych ustawień do vimrc:

```shell
set undodir=~/.vim/undo_dir
set undofile
```

Powyższe ustawienie umieści wszystkie pliki cofania w jednym scentralizowanym katalogu, w katalogu `~/.vim`. Nazwa `undo_dir` jest dowolna. `set undofile` mówi Vimowi, aby włączył funkcję `undofile`, ponieważ jest ona domyślnie wyłączona. Teraz, gdy tylko zapiszesz, Vim automatycznie tworzy i aktualizuje odpowiedni plik w katalogu `undo_dir` (upewnij się, że utworzyłeś rzeczywisty katalog `undo_dir` w katalogu `~/.vim` przed uruchomieniem tego).

## Podróż w czasie

Kto powiedział, że podróże w czasie nie istnieją? Vim może podróżować do stanu tekstu w przeszłości za pomocą polecenia wiersza poleceń `:earlier`.

Jeśli masz ten tekst:

```shell
one

```
Następnie później dodasz:

```shell
one
two
```

Jeśli wpisałeś "two" mniej niż dziesięć sekund temu, możesz wrócić do stanu, w którym "two" nie istniało, dziesięć sekund temu za pomocą:

```shell
:earlier 10s
```

Możesz użyć `:undolist`, aby zobaczyć, kiedy dokonano ostatniej zmiany. `:earlier` akceptuje również różne argumenty:

```shell
:earlier 10s    Przejdź do stanu 10 sekund wcześniej
:earlier 10m    Przejdź do stanu 10 minut wcześniej
:earlier 10h    Przejdź do stanu 10 godzin wcześniej
:earlier 10d    Przejdź do stanu 10 dni wcześniej
```

Dodatkowo akceptuje również zwykły `count` jako argument, aby powiedzieć Vimowi, aby przeszedł do starszego stanu `count` razy. Na przykład, jeśli zrobisz `:earlier 2`, Vim wróci do starszego stanu tekstu sprzed dwóch zmian. To to samo, co wykonanie `g-` dwa razy. Możesz również powiedzieć mu, aby przeszedł do starszego stanu tekstu sprzed 10 zapisów za pomocą `:earlier 10f`.

Ten sam zestaw argumentów działa z odpowiednikiem `:earlier`: `:later`.

```shell
:later 10s    przejdź do stanu 10 sekund później
:later 10m    przejdź do stanu 10 minut później
:later 10h    przejdź do stanu 10 godzin później
:later 10d    przejdź do stanu 10 dni później
:later 10     przejdź do nowszego stanu 10 razy
:later 10f    przejdź do stanu 10 zapisów później
```

## Naucz się cofania w inteligentny sposób

`u` i `Ctrl-R` to dwa niezbędne polecenia Vima do poprawiania błędów. Naucz się ich najpierw. Następnie naucz się, jak używać `:earlier` i `:later`, używając najpierw argumentów czasowych. Po tym poświęć czas na zrozumienie drzewa cofania. Wtyczka [vim-mundo](https://github.com/simnalamburt/vim-mundo) bardzo mi pomogła. Wpisuj teksty w tym rozdziale i sprawdzaj drzewo cofania, gdy dokonujesz każdej zmiany. Gdy to zrozumiesz, nigdy nie spojrzysz na system cofania w ten sam sposób.

Przed tym rozdziałem nauczyłeś się, jak znaleźć dowolny tekst w przestrzeni projektu, a dzięki cofaniu możesz teraz znaleźć dowolny tekst w wymiarze czasowym. Teraz możesz wyszukiwać dowolny tekst według jego lokalizacji i czasu napisania. Osiągnąłeś wszechobecność w Vimie.