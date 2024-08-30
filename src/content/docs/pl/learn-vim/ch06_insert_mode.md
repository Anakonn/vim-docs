---
description: W tym rozdziale poznasz funkcje trybu wstawiania w Vimie, które poprawią
  efektywność pisania oraz różne sposoby przechodzenia do tego trybu.
title: Ch06. Insert Mode
---

Tryb wstawiania jest domyślnym trybem wielu edytorów tekstu. W tym trybie to, co wpisujesz, jest tym, co otrzymujesz.

Jednak to nie oznacza, że nie ma wiele do nauczenia. Tryb wstawiania Vima zawiera wiele przydatnych funkcji. W tym rozdziale dowiesz się, jak korzystać z tych funkcji trybu wstawiania w Vimie, aby poprawić swoją wydajność pisania.

## Sposoby przejścia do trybu wstawiania

Istnieje wiele sposobów, aby przejść do trybu wstawiania z trybu normalnego. Oto niektóre z nich:

```shell
i    Wstaw tekst przed kursorem
I    Wstaw tekst przed pierwszym niepustym znakiem w linii
a    Dodaj tekst po kursorem
A    Dodaj tekst na końcu linii
o    Rozpoczyna nową linię poniżej kursora i wstawia tekst
O    Rozpoczyna nową linię powyżej kursora i wstawia tekst
s    Usuń znak pod kursorem i wstaw tekst
S    Usuń bieżącą linię i wstaw tekst, synonim dla "cc"
gi   Wstaw tekst w tej samej pozycji, w której ostatni tryb wstawiania został zatrzymany
gI   Wstaw tekst na początku linii (kolumna 1)
```

Zauważ wzór małych/dużych liter. Dla każdej małej komendy istnieje odpowiadająca jej duża. Jeśli jesteś nowy, nie martw się, jeśli nie zapamiętasz całej powyższej listy. Zacznij od `i` i `o`. Powinny wystarczyć, aby rozpocząć. Stopniowo ucz się więcej w miarę upływu czasu.

## Różne sposoby wyjścia z trybu wstawiania

Istnieje kilka różnych sposobów, aby wrócić do trybu normalnego podczas korzystania z trybu wstawiania:

```shell
<Esc>     Wychodzi z trybu wstawiania i przechodzi do trybu normalnego
Ctrl-[    Wychodzi z trybu wstawiania i przechodzi do trybu normalnego
Ctrl-C    Jak Ctrl-[ i <Esc>, ale nie sprawdza skrótów
```

Uważam, że klawisz `<Esc>` jest zbyt daleko, aby go dosięgnąć, więc mapuję mój komputerowy `<Caps-Lock>`, aby działał jak `<Esc>`. Jeśli poszukasz klawiatury Bill Joy'a ADM-3A (twórcy Vi), zobaczysz, że klawisz `<Esc>` nie znajduje się w dalekim lewym górnym rogu jak nowoczesne klawiatury, ale po lewej stronie klawisza `q`. Dlatego uważam, że ma sens mapowanie `<Caps lock>` na `<Esc>`.

Inną powszechną konwencją, którą widziałem u użytkowników Vima, jest mapowanie `<Esc>` na `jj` lub `jk` w trybie wstawiania. Jeśli wolisz tę opcję, dodaj jedną z tych linii (lub obie) do swojego pliku vimrc.

```shell
inoremap jj <Esc>
inoremap jk <Esc>
```

## Powtarzanie trybu wstawiania

Możesz przekazać parametr liczbowy przed wejściem w tryb wstawiania. Na przykład:

```shell
10i
```

Jeśli wpiszesz "hello world!" i wyjdziesz z trybu wstawiania, Vim powtórzy tekst 10 razy. To zadziała z każdą metodą trybu wstawiania (np. `10I`, `11a`, `12o`).

## Usuwanie fragmentów w trybie wstawiania

Kiedy popełnisz błąd podczas pisania, może być uciążliwe wielokrotne naciskanie `<Backspace>`. Może bardziej sensowne będzie przejście do trybu normalnego i usunięcie błędu. Możesz także usunąć kilka znaków jednocześnie, będąc w trybie wstawiania.

```shell
Ctrl-h    Usuń jeden znak
Ctrl-w    Usuń jedno słowo
Ctrl-u    Usuń całą linię
```

## Wstawianie z rejestru

Rejestry Vima mogą przechowywać teksty do przyszłego użycia. Aby wstawić tekst z dowolnego nazwanego rejestru podczas korzystania z trybu wstawiania, wpisz `Ctrl-R` plus symbol rejestru. Istnieje wiele symboli, których możesz użyć, ale w tej sekcji omówimy tylko nazwaną rejestry (a-z).

Aby zobaczyć to w akcji, najpierw musisz skopiować słowo do rejestru a. Przesuń kursor na dowolne słowo. Następnie wpisz:

```shell
"ayiw
```

- `"a` informuje Vim, że cel twojej następnej akcji trafi do rejestru a.
- `yiw` kopiuje wewnętrzne słowo. Przejrzyj rozdział o gramatyce Vima, aby odświeżyć wiedzę.

Rejestr a teraz zawiera słowo, które właśnie skopiowałeś. Będąc w trybie wstawiania, aby wkleić tekst przechowywany w rejestrze a:

```shell
Ctrl-R a
```

Istnieje wiele typów rejestrów w Vimie. Omówię je bardziej szczegółowo w późniejszym rozdziale.

## Przewijanie

Czy wiesz, że możesz przewijać, będąc w trybie wstawiania? Będąc w trybie wstawiania, jeśli przejdziesz do podtrybu `Ctrl-X`, możesz wykonać dodatkowe operacje. Przewijanie jest jedną z nich.

```shell
Ctrl-X Ctrl-Y    Przewiń w górę
Ctrl-X Ctrl-E    Przewiń w dół
```

## Autouzupełnianie

Jak wspomniano powyżej, jeśli naciśniesz `Ctrl-X` z trybu wstawiania, Vim wejdzie w podtryb. Możesz wykonać autouzupełnianie tekstu, będąc w tym podtrybie trybu wstawiania. Chociaż nie jest tak dobre jak [intellisense](https://code.visualstudio.com/docs/editor/intellisense) czy jakikolwiek inny protokół serwera językowego (LSP), to jako funkcja dostępna od razu, jest to bardzo zdolna funkcja.

Oto kilka przydatnych poleceń autouzupełniania, aby zacząć:

```shell
Ctrl-X Ctrl-L	   Wstaw całą linię
Ctrl-X Ctrl-N	   Wstaw tekst z bieżącego pliku
Ctrl-X Ctrl-I	   Wstaw tekst z plików dołączonych
Ctrl-X Ctrl-F	   Wstaw nazwę pliku
```

Gdy wywołasz autouzupełnianie, Vim wyświetli okno pop-up. Aby poruszać się w górę i w dół po oknie pop-up, użyj `Ctrl-N` i `Ctrl-P`.

Vim ma również dwa skróty autouzupełniania, które nie wymagają podtrybu `Ctrl-X`:

```shell
Ctrl-N             Znajdź następne dopasowanie słowa
Ctrl-P             Znajdź poprzednie dopasowanie słowa
```

Ogólnie rzecz biorąc, Vim przeszukuje tekst we wszystkich dostępnych buforach jako źródło autouzupełniania. Jeśli masz otwarty bufor z linią, która mówi "Czekoladowe pączki są najlepsze":
- Kiedy wpiszesz "Choco" i naciśniesz `Ctrl-X Ctrl-L`, dopasuje i wydrukuje całą linię.
- Kiedy wpiszesz "Choco" i naciśniesz `Ctrl-P`, dopasuje i wydrukuje słowo "Czekolada".

Autouzupełnianie to rozległy temat w Vimie. To tylko wierzchołek góry lodowej. Aby dowiedzieć się więcej, sprawdź `:h ins-completion`.

## Wykonywanie polecenia w trybie normalnym

Czy wiesz, że Vim może wykonać polecenie w trybie normalnym, będąc w trybie wstawiania?

Będąc w trybie wstawiania, jeśli naciśniesz `Ctrl-O`, znajdziesz się w podtrybie wstawiania-normalnego. Jeśli spojrzysz na wskaźnik trybu w lewym dolnym rogu, zazwyczaj zobaczysz `-- INSERT --`, ale naciśnięcie `Ctrl-O` zmienia to na `-- (insert) --`. W tym trybie możesz wykonać *jedno* polecenie w trybie normalnym. Oto niektóre rzeczy, które możesz zrobić:

**Centrowanie i skakanie**

```shell
Ctrl-O zz       Wyśrodkowanie okna
Ctrl-O H/M/L    Skok do góry/środka/dna okna
Ctrl-O 'a       Skok do znacznika a
```

**Powtarzanie tekstu**

```shell
Ctrl-O 100ihello    Wstaw "hello" 100 razy
```

**Wykonywanie poleceń terminalowych**

```shell
Ctrl-O !! curl https://google.com    Uruchom curl
Ctrl-O !! pwd                        Uruchom pwd
```

**Szybsze usuwanie**

```shell
Ctrl-O dtz    Usuń od bieżącej lokalizacji do litery "z"
Ctrl-O D      Usuń od bieżącej lokalizacji do końca linii
```

## Ucz się trybu wstawiania w inteligentny sposób

Jeśli jesteś jak ja i pochodzisz z innego edytora tekstu, może być kuszące, aby pozostać w trybie wstawiania. Jednak pozostawanie w trybie wstawiania, gdy nie wpisujesz tekstu, jest antywzorem. Rozwijaj nawyk przechodzenia do trybu normalnego, gdy twoje palce nie piszą nowego tekstu.

Kiedy musisz wstawić tekst, najpierw zapytaj siebie, czy ten tekst już istnieje. Jeśli tak, spróbuj skopiować lub przenieść ten tekst zamiast go wpisywać. Jeśli musisz użyć trybu wstawiania, sprawdź, czy możesz autouzupełnić ten tekst, kiedy tylko to możliwe. Unikaj wpisywania tego samego słowa więcej niż raz, jeśli to możliwe.