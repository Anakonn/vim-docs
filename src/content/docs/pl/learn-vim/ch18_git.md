---
description: Dokument przedstawia sposoby integracji Vim i Git, koncentrując się na
  porównywaniu plików za pomocą polecenia `vimdiff` oraz zarządzaniu różnicami.
title: Ch18. Git
---

Vim i git to dwa świetne narzędzia do dwóch różnych rzeczy. Git to narzędzie do kontroli wersji. Vim to edytor tekstu.

W tym rozdziale nauczysz się różnych sposobów integracji Vima i gita.

## Porównywanie

Przypomnij sobie z poprzedniego rozdziału, że możesz uruchomić polecenie `vimdiff`, aby pokazać różnice między wieloma plikami.

Załóżmy, że masz dwa pliki, `file1.txt` i `file2.txt`.

W `file1.txt`:

```shell
pancakes
waffles
apples

milk
apple juice

yogurt
```

W `file2.txt`:

```shell
pancakes
waffles
oranges

milk
orange juice

yogurt
```

Aby zobaczyć różnice między oboma plikami, uruchom:

```shell
vimdiff file1.txt file2.txt
```

Alternatywnie możesz uruchomić:

```shell
vim -d file1.txt file2.txt
```

`vimdiff` wyświetla dwa buforów obok siebie. Po lewej stronie jest `file1.txt`, a po prawej `file2.txt`. Pierwsze różnice (jabłka i pomarańcze) są podświetlone na obu liniach.

Załóżmy, że chcesz, aby drugi bufor miał jabłka, a nie pomarańcze. Aby przenieść zawartość z aktualnej pozycji (jesteś obecnie na `file1.txt`) do `file2.txt`, najpierw przejdź do następnej różnicy za pomocą `]c` (aby skoczyć do poprzedniego okna różnicy, użyj `[c`). Kursor powinien być teraz na jabłkach. Uruchom `:diffput`. Oba pliki powinny teraz mieć jabłka.

Jeśli musisz przenieść tekst z drugiego buforu (sok pomarańczowy, `file2.txt`), aby zastąpić tekst w bieżącym buforze (sok jabłkowy, `file1.txt`), z kursorem nadal w oknie `file1.txt`, najpierw przejdź do następnej różnicy za pomocą `]c`. Twój kursor powinien teraz być na soku jabłkowym. Uruchom `:diffget`, aby pobrać sok pomarańczowy z innego buforu, aby zastąpić sok jabłkowy w naszym buforze.

`:diffput` *przenosi* tekst z bieżącego buforu do innego buforu. `:diffget` *pobiera* tekst z innego buforu do bieżącego buforu.

Jeśli masz wiele buforów, możesz uruchomić `:diffput fileN.txt` i `:diffget fileN.txt`, aby celować w bufor fileN.

## Vim jako narzędzie do scalania

> "Uwielbiam rozwiązywać konflikty scalania!" - Nikt

Nie znam nikogo, kto lubi rozwiązywać konflikty scalania. Jednak są one nieuniknione. W tej sekcji nauczysz się, jak wykorzystać Vima jako narzędzie do rozwiązywania konfliktów scalania.

Najpierw zmień domyślne narzędzie do scalania, aby używało `vimdiff`, uruchamiając:

```shell
git config merge.tool vimdiff
git config merge.conflictstyle diff3
git config mergetool.prompt false
```

Alternatywnie możesz bezpośrednio zmodyfikować `~/.gitconfig` (domyślnie powinno być w katalogu głównym, ale może być w innym miejscu). Powyższe polecenia powinny zmodyfikować twój gitconfig, aby wyglądał jak poniższe ustawienie, jeśli ich jeszcze nie uruchomiłeś, możesz również ręcznie edytować swój gitconfig.

```shell
[core]
  editor = vim
[merge]
  tool = vimdiff
  conflictstyle = diff3
[difftool]
  prompt = false
```

Stwórzmy fałszywy konflikt scalania, aby to przetestować. Utwórz katalog `/food` i przekształć go w repozytorium gita:

```shell
git init
```

Dodaj plik `breakfast.txt`. Wewnątrz:

```shell
pancakes
waffles
oranges
```

Dodaj plik i zatwierdź go:

```shell
git add .
git commit -m "Initial breakfast commit"
```

Następnie utwórz nową gałąź i nazwij ją gałęzią jabłkową:

```shell
git checkout -b apples
```

Zmień `breakfast.txt`:

```shell
pancakes
waffles
apples
```

Zapisz plik, a następnie dodaj i zatwierdź zmianę:

```shell
git add .
git commit -m "Apples not oranges"
```

Świetnie. Teraz masz pomarańcze w gałęzi głównej i jabłka w gałęzi jabłkowej. Wróćmy do gałęzi głównej:

```shell
git checkout master
```

W `breakfast.txt` powinieneś zobaczyć bazowy tekst, pomarańcze. Zmień to na winogrona, ponieważ są teraz w sezonie:

```shell
pancakes
waffles
grapes
```

Zapisz, dodaj i zatwierdź:

```shell
git add .
git commit -m "Grapes not oranges"
```

Teraz jesteś gotowy, aby scalić gałąź jabłkową z gałęzią główną:

```shell
git merge apples
```

Powinieneś zobaczyć błąd:

```shell
Auto-merging breakfast.txt
CONFLICT (content): Merge conflict in breakfast.txt
Automatic merge failed; fix conflicts and then commit the result.
```

Konflikt, świetnie! Rozwiążmy konflikt za pomocą naszego nowo skonfigurowanego `mergetool`. Uruchom:

```shell
git mergetool
```

Vim wyświetla cztery okna. Zwróć uwagę na trzy górne:

- `LOCAL` zawiera `grapes`. To jest zmiana w "lokalnym", do czego scalasz.
- `BASE` zawiera `oranges`. To jest wspólny przodek między `LOCAL` a `REMOTE`, aby porównać, jak się różnią.
- `REMOTE` zawiera `apples`. To jest to, co jest scalane.

Na dole (czwarte okno) widzisz:

```shell
pancakes
waffles
<<<<<<< HEAD
grapes
||||||| db63958
oranges
=======
apples
>>>>>>> apples
```

Czwarte okno zawiera teksty konfliktu scalania. Dzięki temu ustawieniu łatwiej jest zobaczyć, jakie zmiany mają każde środowisko. Możesz zobaczyć zawartość z `LOCAL`, `BASE` i `REMOTE` w tym samym czasie.

Twój kursor powinien być w czwartym oknie, w podświetlonym obszarze. Aby pobrać zmianę z `LOCAL` (winogrona), uruchom `:diffget LOCAL`. Aby pobrać zmianę z `BASE` (pomarańcze), uruchom `:diffget BASE`, a aby pobrać zmianę z `REMOTE` (jabłka), uruchom `:diffget REMOTE`.

W tym przypadku pobierzmy zmianę z `LOCAL`. Uruchom `:diffget LOCAL`. Czwarte okno będzie teraz miało winogrona. Zapisz i wyjdź ze wszystkich plików (`:wqall`), gdy skończysz. To nie było złe, prawda?

Jeśli zauważysz, masz również plik `breakfast.txt.orig`. Git tworzy plik kopii zapasowej na wypadek, gdyby coś poszło nie tak. Jeśli nie chcesz, aby git tworzył kopię zapasową podczas scalania, uruchom:

```shell
git config --global mergetool.keepBackup false
```

## Git w VIMie

Vim nie ma wbudowanej funkcji gita. Jednym ze sposobów uruchamiania poleceń gita z Vima jest użycie operatora bang, `!`, w trybie wiersza poleceń.

Jakiekolwiek polecenie git można uruchomić z `!`:

```shell
:!git status
:!git commit
:!git diff
:!git push origin master
```

Możesz również użyć konwencji Vima `%` (bieżący bufor) lub `#` (inny bufor):

```shell
:!git add %         " git add bieżący plik
:!git checkout #    " git checkout inny plik
```

Jednym z trików Vima, które możesz użyć, aby dodać wiele plików w różnych oknach Vima, jest uruchomienie:

```shell
:windo !git add %
```

Następnie wykonaj commit:

```shell
:!git commit "Właśnie dodałem wszystko w moim oknie Vima, fajnie"
```

Polecenie `windo` jest jednym z "poleceń wykonawczych" Vima, podobnym do `argdo`, które widziałeś wcześniej. `windo` wykonuje polecenie w każdym oknie.

Alternatywnie możesz również użyć `bufdo !git add %`, aby dodać wszystkie bufory lub `argdo !git add %`, aby dodać wszystkie argumenty plików, w zależności od twojego przepływu pracy.

## Wtyczki

Istnieje wiele wtyczek Vima do wsparcia gita. Poniżej znajduje się lista niektórych popularnych wtyczek związanych z gitem dla Vima (prawdopodobnie jest ich więcej w momencie, gdy to czytasz):

- [vim-gitgutter](https://github.com/airblade/vim-gitgutter)
- [vim-signify](https://github.com/mhinz/vim-signify)
- [vim-fugitive](https://github.com/tpope/vim-fugitive)
- [gv.vim](https://github.com/junegunn/gv.vim)
- [vimagit](https://github.com/jreybert/vimagit)
- [vim-twiggy](https://github.com/sodapopcan/vim-twiggy)
- [rhubarb](https://github.com/tpope/vim-rhubarb)

Jedną z najpopularniejszych jest vim-fugitive. W pozostałej części rozdziału omówię kilka przepływów pracy gita z użyciem tej wtyczki.

## Vim-fugitive

Wtyczka vim-fugitive pozwala na uruchamianie interfejsu wiersza poleceń gita bez opuszczania edytora Vim. Zauważysz, że niektóre polecenia są lepsze, gdy są wykonywane z wnętrza Vima.

Aby rozpocząć, zainstaluj vim-fugitive za pomocą menedżera wtyczek Vima ([vim-plug](https://github.com/junegunn/vim-plug), [vundle](https://github.com/VundleVim/Vundle.vim), [dein.vim](https://github.com/Shougo/dein.vim) itp.).

## Status gita

Kiedy uruchomisz polecenie `:Git` bez żadnych parametrów, vim-fugitive wyświetli okno podsumowania gita. Pokazuje nieśledzone, niezarejestrowane i zarejestrowane pliki. Będąc w tym trybie "`git status`", możesz zrobić kilka rzeczy:
- `Ctrl-N` / `Ctrl-P`, aby przejść w górę lub w dół listy plików.
- `-`, aby zarejestrować lub wyrejestrować nazwę pliku pod kursorem.
- `s`, aby zarejestrować nazwę pliku pod kursorem.
- `u`, aby wyrejestrować nazwę pliku pod kursorem.
- `>` / `<`, aby wyświetlić lub ukryć wbudowane różnice dla nazwy pliku pod kursorem.

Aby uzyskać więcej informacji, sprawdź `:h fugitive-staging-maps`.

## Git Blame

Kiedy uruchomisz polecenie `:Git blame` z bieżącego pliku, vim-fugitive wyświetli podzielone okno z informacjami o autorze. Może to być przydatne, aby znaleźć osobę odpowiedzialną za napisanie tej błędnej linii kodu, aby móc na nią krzyczeć (żartuję).

Niektóre rzeczy, które możesz zrobić w tym trybie `"git blame"`:
- `q`, aby zamknąć okno z informacjami o autorze.
- `A`, aby zmienić rozmiar kolumny autora.
- `C`, aby zmienić rozmiar kolumny commit.
- `D`, aby zmienić rozmiar kolumny daty/czasu.

Aby uzyskać więcej informacji, sprawdź `:h :Git_blame`.

## Gdiffsplit

Kiedy uruchomisz polecenie `:Gdiffsplit`, vim-fugitive uruchamia `vimdiff` ostatnich zmian bieżącego pliku w porównaniu do indeksu lub drzewa roboczego. Jeśli uruchomisz `:Gdiffsplit <commit>`, vim-fugitive uruchomi `vimdiff` w porównaniu do tego pliku w `<commit>`.

Ponieważ jesteś w trybie `vimdiff`, możesz *pobierać* lub *przenosić* różnice za pomocą `:diffput` i `:diffget`.

## Gwrite i Gread

Kiedy uruchomisz polecenie `:Gwrite` w pliku po dokonaniu zmian, vim-fugitive rejestruje zmiany. To jak uruchomienie `git add <current-file>`.

Kiedy uruchomisz polecenie `:Gread` w pliku po dokonaniu zmian, vim-fugitive przywraca plik do stanu sprzed zmian. To jak uruchomienie `git checkout <current-file>`. Jedną z zalet uruchomienia `:Gread` jest to, że akcja jest odwracalna. Jeśli po uruchomieniu `:Gread` zmienisz zdanie i chcesz zachować starą zmianę, możesz po prostu uruchomić cofnięcie (`u`), a Vim cofnąłby akcję `:Gread`. To nie byłoby możliwe, gdybyś uruchomił `git checkout <current-file>` z interfejsu wiersza poleceń.

## Gclog

Kiedy uruchomisz polecenie `:Gclog`, vim-fugitive wyświetli historię commitów. To jak uruchomienie polecenia `git log`. Vim-fugitive używa szybkiej naprawy Vima, aby to osiągnąć, więc możesz używać `:cnext` i `:cprevious`, aby przechodzić do następnych lub poprzednich informacji o logach. Możesz otworzyć i zamknąć listę logów za pomocą `:copen` i `:cclose`.

Będąc w tym trybie `"git log"`, możesz zrobić dwie rzeczy:
- Wyświetlić drzewo.
- Odwiedzić rodzica (poprzedni commit).

Możesz przekazać do `:Gclog` argumenty tak samo jak w poleceniu `git log`. Jeśli twój projekt ma długą historię commitów i chcesz zobaczyć tylko ostatnie trzy commity, możesz uruchomić `:Gclog -3`. Jeśli musisz filtrować według daty commitera, możesz uruchomić coś takiego jak `:Gclog --after="January 1" --before="March 14"`.

## Więcej o Vim-fugitive

To tylko kilka przykładów tego, co może zrobić vim-fugitive. Aby dowiedzieć się więcej o vim-fugitive, sprawdź `:h fugitive.txt`. Większość popularnych poleceń gita jest prawdopodobnie zoptymalizowana z vim-fugitive. Musisz tylko poszukać ich w dokumentacji.

Jeśli jesteś w jednym z "specjalnych trybów" vim-fugitive (na przykład w trybie `:Git` lub `:Git blame`) i chcesz dowiedzieć się, jakie skróty są dostępne, naciśnij `g?`. Vim-fugitive wyświetli odpowiednie okno `:help` dla trybu, w którym się znajdujesz. Fajnie!
## Naucz się Vima i Gita w Mądry Sposób

Możesz uznać vim-fugitive za dobry dodatek do swojego przepływu pracy (lub nie). Niezależnie od tego, zdecydowanie zachęcam cię do sprawdzenia wszystkich wtyczek wymienionych powyżej. Prawdopodobnie są też inne, których nie wymieniłem. Wypróbuj je.

Jednym oczywistym sposobem na poprawę integracji Vima z Gitem jest przeczytanie więcej na temat gita. Git, sam w sobie, jest ogromnym tematem i pokazuję tylko jego ułamek. W związku z tym, zacznijmy *gitować* (przepraszam za grę słów) i porozmawiajmy o tym, jak używać Vima do kompilacji twojego kodu!