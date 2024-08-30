---
description: 'Dokument opisuje trzy abstrakcje wyświetlania w Vim: bufory, okna i
  karty, oraz ich działanie, a także konfigurację pliku vimrc.'
title: Ch02. Buffers, Windows, and Tabs
---

Jeśli wcześniej korzystałeś z nowoczesnego edytora tekstu, prawdopodobnie znasz okna i zakładki. Vim używa trzech abstrakcji wyświetlania zamiast dwóch: buforów, okien i zakładek. W tym rozdziale wyjaśnię, czym są bufory, okna i zakładki oraz jak działają w Vimie.

Zanim zaczniesz, upewnij się, że masz opcję `set hidden` w vimrc. Bez niej, za każdym razem, gdy przełączasz bufory, a twój bieżący bufor nie jest zapisany, Vim poprosi cię o zapisanie pliku (nie chcesz tego, jeśli chcesz szybko się poruszać). Jeszcze nie omówiłem vimrc. Jeśli nie masz vimrc, stwórz go. Zwykle znajduje się w twoim katalogu domowym i nosi nazwę `.vimrc`. Mój znajduje się w `~/.vimrc`. Aby zobaczyć, gdzie powinieneś stworzyć swój vimrc, sprawdź `:h vimrc`. Wewnątrz dodaj:

```shell
set hidden
```

Zapisz go, a następnie załaduj (uruchom `:source %` z wnętrza vimrc).

## Buffery

Czym jest *bufor*?

Bufor to przestrzeń w pamięci, w której możesz pisać i edytować tekst. Kiedy otwierasz plik w Vimie, dane są powiązane z buforem. Kiedy otwierasz 3 pliki w Vimie, masz 3 bufory.

Miej dostępne dwa puste pliki, `file1.js` i `file2.js` (jeśli to możliwe, stwórz je w Vimie). Uruchom to w terminalu:

```bash
vim file1.js
```

To, co widzisz, to *bufor* `file1.js`. Za każdym razem, gdy otwierasz nowy plik, Vim tworzy nowy bufor.

Wyjdź z Vima. Tym razem otwórz dwa nowe pliki:

```bash
vim file1.js file2.js
```

Vim obecnie wyświetla bufor `file1.js`, ale tak naprawdę tworzy dwa bufory: bufor `file1.js` i bufor `file2.js`. Uruchom `:buffers`, aby zobaczyć wszystkie bufory (alternatywnie możesz użyć `:ls` lub `:files`). Powinieneś zobaczyć *oba* `file1.js` i `file2.js` na liście. Uruchomienie `vim file1 file2 file3 ... filen` tworzy n ilość buforów. Za każdym razem, gdy otwierasz nowy plik, Vim tworzy nowy bufor dla tego pliku.

Istnieje kilka sposobów na poruszanie się po buforach:
- `:bnext`, aby przejść do następnego bufora (`:bprevious`, aby przejść do poprzedniego bufora).
- `:buffer` + nazwa pliku. Vim może autouzupełniać nazwę pliku za pomocą `<Tab>`.
- `:buffer` + `n`, gdzie `n` to numer bufora. Na przykład, wpisując `:buffer 2`, przejdziesz do bufora #2.
- Skocz do starszej pozycji na liście skoków za pomocą `Ctrl-O` i do nowszej pozycji za pomocą `Ctrl-I`. To nie są metody specyficzne dla buforów, ale mogą być używane do skakania między różnymi buforami. Wyjaśnię skoki w dalszych szczegółach w Rozdziale 5.
- Przejdź do ostatnio edytowanego bufora za pomocą `Ctrl-^`.

Gdy Vim utworzy bufor, pozostanie on na liście twoich buforów. Aby go usunąć, możesz wpisać `:bdelete`. Może również przyjąć numer bufora jako parametr (`:bdelete 3`, aby usunąć bufor #3) lub nazwę pliku (`:bdelete`, a następnie użyj `<Tab>`, aby autouzupełnić).

Najtrudniejszą rzeczą dla mnie podczas nauki o buforach było wyobrażenie sobie, jak one działają, ponieważ mój umysł był przyzwyczajony do okien z używania mainstreamowego edytora tekstu. Dobrą analogią jest talia kart do gry. Jeśli mam 2 bufory, mam stos 2 kart. Karta na górze to jedyna karta, którą widzę, ale wiem, że są karty poniżej. Jeśli widzę wyświetlony bufor `file1.js`, to karta `file1.js` jest na górze stosu. Nie mogę zobaczyć drugiej karty, `file2.js`, ale ona tam jest. Jeśli przełączę bufory na `file2.js`, karta `file2.js` jest teraz na górze stosu, a karta `file1.js` jest poniżej.

Jeśli nie używałeś Vima wcześniej, to jest nowa koncepcja. Poświęć czas, aby to zrozumieć.

## Wyjście z Vima

Przy okazji, jeśli masz otwarte wiele buforów, możesz zamknąć je wszystkie za pomocą quit-all:

```shell
:qall
```

Jeśli chcesz zamknąć bez zapisywania zmian, po prostu dodaj `!` na końcu:

```shell
:qall!
```

Aby zapisać i zamknąć wszystko, uruchom:

```shell
:wqall
```

## Okna

Okno to widok na bufor. Jeśli przechodzisz z mainstreamowego edytora, ta koncepcja może być ci znana. Większość edytorów tekstowych ma możliwość wyświetlania wielu okien. W Vimie również możesz mieć wiele okien.

Otwórz ponownie `file1.js` z terminala:

```bash
vim file1.js
```

Wcześniej napisałem, że patrzysz na bufor `file1.js`. Choć to było poprawne, to stwierdzenie było niekompletne. Patrzysz na bufor `file1.js`, wyświetlany przez **okno**. Okno to sposób, w jaki widzisz bufor.

Nie zamykaj jeszcze Vima. Uruchom:

```shell
:split file2.js
```

Teraz patrzysz na dwa bufory przez **dwa okna**. Górne okno wyświetla bufor `file2.js`. Dolne okno wyświetla bufor `file1.js`.

Jeśli chcesz nawigować między oknami, użyj tych skrótów:

```shell
Ctrl-W H    Przesuwa kursor do lewego okna
Ctrl-W J    Przesuwa kursor do okna poniżej
Ctrl-W K    Przesuwa kursor do okna powyżej
Ctrl-W L    Przesuwa kursor do prawego okna
```

Teraz uruchom:

```shell
:vsplit file3.js
```

Teraz widzisz trzy okna wyświetlające trzy bufory. Jedno okno wyświetla bufor `file3.js`, inne okno wyświetla bufor `file2.js`, a kolejne okno wyświetla bufor `file1.js`.

Możesz mieć wiele okien wyświetlających ten sam bufor. Kiedy jesteś w lewym górnym oknie, wpisz:

```shell
:buffer file2.js
```

Teraz oba okna wyświetlają bufor `file2.js`. Jeśli zaczniesz pisać w oknie `file2.js`, zobaczysz, że oba okna wyświetlające bufory `file2.js` są aktualizowane w czasie rzeczywistym.

Aby zamknąć bieżące okno, możesz uruchomić `Ctrl-W C` lub wpisać `:quit`. Kiedy zamykasz okno, bufor nadal tam będzie (uruchom `:buffers`, aby to potwierdzić).

Oto kilka przydatnych poleceń okien w trybie normalnym:

```shell
Ctrl-W V    Otwiera nowe pionowe podział
Ctrl-W S    Otwiera nowe poziome podział
Ctrl-W C    Zamykaj okno
Ctrl-W O    Uczyń bieżące okno jedynym na ekranie i zamknij inne okna
```

A oto lista przydatnych poleceń wiersza poleceń okien:

```shell
:vsplit filename    Podziel okno pionowo
:split filename     Podziel okno poziomo
:new filename       Utwórz nowe okno
```

Poświęć czas, aby je zrozumieć. Aby uzyskać więcej informacji, sprawdź `:h window`.

## Zakładki

Zakładka to zbiór okien. Pomyśl o tym jak o układzie dla okien. W większości nowoczesnych edytorów tekstowych (i nowoczesnych przeglądarkach internetowych) zakładka oznacza otwarty plik / stronę, a kiedy ją zamykasz, ten plik / strona znika. W Vimie zakładka nie reprezentuje otwartego pliku. Kiedy zamykasz zakładkę w Vimie, nie zamykasz pliku. Po prostu zamykasz układ. Pliki otwarte w tym układzie nadal nie są zamknięte, są nadal otwarte w swoich buforach.

Zobaczmy zakładki Vima w akcji. Otwórz `file1.js`:

```bash
vim file1.js
```

Aby otworzyć `file2.js` w nowej zakładce:

```shell
:tabnew file2.js
```

Możesz również pozwolić Vimowi autouzupełnić plik, który chcesz otworzyć w *nowej zakładce*, naciskając `<Tab>` (bez podtekstów).

Poniżej znajduje się lista przydatnych nawigacji zakładek:

```shell
:tabnew file.txt    Otwórz file.txt w nowej zakładce
:tabclose           Zamknij bieżącą zakładkę
:tabnext            Przejdź do następnej zakładki
:tabprevious        Przejdź do poprzedniej zakładki
:tablast            Przejdź do ostatniej zakładki
:tabfirst           Przejdź do pierwszej zakładki
```

Możesz również uruchomić `gt`, aby przejść do następnej zakładki (możesz przejść do poprzedniej zakładki za pomocą `gT`). Możesz przekazać liczbę jako argument do `gt`, gdzie liczba to numer zakładki. Aby przejść do trzeciej zakładki, zrób `3gt`.

Jedną z zalet posiadania wielu zakładek jest to, że możesz mieć różne układy okien w różnych zakładkach. Może chcesz, aby twoja pierwsza zakładka miała 3 pionowe okna, a druga zakładka miała mieszany układ okien poziomych i pionowych. Zakładka to idealne narzędzie do tego zadania!

Aby uruchomić Vima z wieloma zakładkami, możesz to zrobić z terminala:

```bash
vim -p file1.js file2.js file3.js
```

## Poruszanie się w 3D

Poruszanie się między oknami jest jak podróżowanie dwuwymiarowo wzdłuż osi X-Y w układzie kartezjańskim. Możesz przejść do górnego, prawego, dolnego lub lewego okna za pomocą `Ctrl-W H/J/K/L`.

Poruszanie się między buforami jest jak podróżowanie wzdłuż osi Z w układzie kartezjańskim. Wyobraź sobie, że twoje pliki buforów ustawiają się wzdłuż osi Z. Możesz przechodzić wzdłuż osi Z jeden bufor na raz za pomocą `:bnext` i `:bprevious`. Możesz skakać do dowolnej współrzędnej na osi Z za pomocą `:buffer filename/buffernumber`.

Możesz poruszać się w *przestrzeni trójwymiarowej*, łącząc ruchy okien i buforów. Możesz przejść do górnego, prawego, dolnego lub lewego okna (nawigacje X-Y) za pomocą ruchów okien. Ponieważ każde okno zawiera bufory, możesz poruszać się do przodu i do tyłu (nawigacje Z) za pomocą ruchów buforów.

## Używanie buforów, okien i zakładek w mądry sposób

Nauczyłeś się, czym są bufory, okna i zakładki oraz jak działają w Vimie. Teraz, gdy lepiej je rozumiesz, możesz je wykorzystać w swoim własnym przepływie pracy.

Każdy ma inny przepływ pracy, oto mój na przykład:
- Najpierw używam buforów, aby przechować wszystkie wymagane pliki do bieżącego zadania. Vim może obsługiwać wiele otwartych buforów, zanim zacznie zwalniać. Poza tym, posiadanie wielu otwartych buforów nie zagraca mojego ekranu. Zawsze widzę tylko jeden bufor (zakładając, że mam tylko jedno okno) w danym momencie, co pozwala mi skupić się na jednym ekranie. Kiedy muszę gdzieś przejść, mogę szybko przelecieć do dowolnego otwartego bufora w każdej chwili.
- Używam wielu okien, aby jednocześnie wyświetlać wiele buforów, zazwyczaj podczas porównywania plików, czytania dokumentów lub śledzenia przepływu kodu. Staram się utrzymać liczbę otwartych okien na nie więcej niż trzech, ponieważ mój ekran stanie się zagracony (używam małego laptopa). Kiedy skończę, zamykam wszelkie dodatkowe okna. Mniej okien oznacza mniej rozproszeń.
- Zamiast zakładek, używam okien [tmux](https://github.com/tmux/tmux/wiki). Zazwyczaj używam wielu okien tmux jednocześnie. Na przykład, jedno okno tmux dla kodów po stronie klienta i inne dla kodów backendowych.

Mój przepływ pracy może wyglądać inaczej niż twój w zależności od twojego stylu edycji i to jest w porządku. Eksperymentuj, aby odkryć swój własny styl, dostosowany do twojego stylu kodowania.