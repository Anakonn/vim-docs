---
description: W tym rozdziale dowiesz się, jak zorganizować i skonfigurować plik vimrc
  oraz jak Vim odnajduje ten plik w różnych lokalizacjach.
title: Ch22. Vimrc
---

W poprzednich rozdziałach nauczyłeś się, jak używać Vima. W tym rozdziale dowiesz się, jak zorganizować i skonfigurować vimrc.

## Jak Vim znajduje Vimrc

Konwencjonalna zasada dotycząca vimrc to dodanie pliku dotfile `.vimrc` w katalogu domowym `~/.vimrc` (może być inaczej w zależności od systemu operacyjnego).

Za kulisami Vim sprawdza wiele miejsc w poszukiwaniu pliku vimrc. Oto miejsca, które Vim sprawdza:
- `$VIMINIT`
- `$HOME/.vimrc`
- `$HOME/.vim/vimrc`
- `$EXINIT`
- `$HOME/.exrc`
- `$VIMRUNTIME/defaults.vim`

Kiedy uruchamiasz Vima, sprawdzi powyższe sześć lokalizacji w tej kolejności w poszukiwaniu pliku vimrc. Pierwszy znaleziony plik vimrc zostanie użyty, a reszta zostanie zignorowana.

Najpierw Vim sprawdzi `$VIMINIT`. Jeśli tam nic nie ma, Vim sprawdzi `$HOME/.vimrc`. Jeśli tam nic nie ma, Vim sprawdzi `$HOME/.vim/vimrc`. Jeśli Vim go znajdzie, przestanie szukać i użyje `$HOME/.vim/vimrc`.

Pierwsza lokalizacja, `$VIMINIT`, to zmienna środowiskowa. Domyślnie jest niezdefiniowana. Jeśli chcesz użyć `~/dotfiles/testvimrc` jako wartości `$VIMINIT`, możesz utworzyć zmienną środowiskową zawierającą ścieżkę do tego vimrc. Po uruchomieniu `export VIMINIT='let $MYVIMRC="$HOME/dotfiles/testvimrc" | source $MYVIMRC'`, Vim teraz użyje `~/dotfiles/testvimrc` jako pliku vimrc.

Druga lokalizacja, `$HOME/.vimrc`, to konwencjonalna ścieżka dla wielu użytkowników Vima. `$HOME` w wielu przypadkach to twój katalog domowy (`~`). Jeśli masz plik `~/.vimrc`, Vim użyje go jako pliku vimrc.

Trzecia, `$HOME/.vim/vimrc`, znajduje się w katalogu `~/.vim`. Możesz już mieć katalog `~/.vim` dla swoich wtyczek, niestandardowych skryptów lub plików View. Zauważ, że w nazwie pliku vimrc nie ma kropki (`$HOME/.vim/.vimrc` nie zadziała, ale `$HOME/.vim/vimrc` zadziała).

Czwarta, `$EXINIT`, działa podobnie do `$VIMINIT`.

Piąta, `$HOME/.exrc`, działa podobnie do `$HOME/.vimrc`.

Szósta, `$VIMRUNTIME/defaults.vim`, to domyślny vimrc, który jest dostarczany z twoją wersją Vima. W moim przypadku mam zainstalowanego Vima 8.2 za pomocą Homebrew, więc moja ścieżka to (`/usr/local/share/vim/vim82`). Jeśli Vim nie znajdzie żadnego z poprzednich sześciu plików vimrc, użyje tego pliku.

Na potrzeby reszty tego rozdziału zakładam, że vimrc używa ścieżki `~/.vimrc`.

## Co umieścić w moim Vimrc?

Pytaniem, które zadałem, gdy zaczynałem, było: "Co powinienem umieścić w moim vimrc?"

Odpowiedź brzmi: "cokolwiek chcesz". Pokusa, aby skopiować i wkleić vimrc innych ludzi, jest realna, ale powinieneś się jej oprzeć. Jeśli nalegasz na użycie czyjegoś vimrc, upewnij się, że wiesz, co on robi, dlaczego i jak on/ona go używa, a co najważniejsze, czy jest to dla ciebie istotne. To, że ktoś go używa, nie oznacza, że ty też będziesz go używać.

## Podstawowa zawartość Vimrc

W skrócie, vimrc to zbiór:
- Wtyczek
- Ustawień
- Niestandardowych funkcji
- Niestandardowych poleceń
- Mapowań

Są inne rzeczy, które nie zostały wymienione powyżej, ale ogólnie rzecz biorąc, to pokrywa większość przypadków użycia.

### Wtyczki

W poprzednich rozdziałach wspomniałem o różnych wtyczkach, takich jak [fzf.vim](https://github.com/junegunn/fzf.vim), [vim-mundo](https://github.com/simnalamburt/vim-mundo) i [vim-fugitive](https://github.com/tpope/vim-fugitive).

Dziesięć lat temu zarządzanie wtyczkami było koszmarem. Jednak wraz z pojawieniem się nowoczesnych menedżerów wtyczek, instalacja wtyczek może teraz zająć sekundy. Obecnie używam [vim-plug](https://github.com/junegunn/vim-plug) jako mojego menedżera wtyczek, więc użyję go w tej sekcji. Koncepcja powinna być podobna do innych popularnych menedżerów wtyczek. Zdecydowanie polecam sprawdzenie różnych, takich jak:
- [vundle.vim](https://github.com/VundleVim/Vundle.vim)
- [vim-pathogen](https://github.com/tpope/vim-pathogen)
- [dein.vim](https://github.com/Shougo/dein.vim)

Jest więcej menedżerów wtyczek niż te wymienione powyżej, więc śmiało poszukaj. Aby zainstalować vim-plug, jeśli masz maszynę Unix, uruchom:

```shell
curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

Aby dodać nowe wtyczki, umieść nazwy swoich wtyczek (`Plug 'github-username/repository-name'`) między liniami `call plug#begin()` a `call plug#end()`. Więc jeśli chcesz zainstalować `emmet-vim` i `nerdtree`, umieść następujący fragment w swoim vimrc:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

Zapisz zmiany, załaduj je (`:source %`), a następnie uruchom `:PlugInstall`, aby je zainstalować.

W przyszłości, jeśli będziesz musiał usunąć nieużywane wtyczki, wystarczy usunąć nazwy wtyczek z bloku `call`, zapisać i załadować, a następnie uruchomić polecenie `:PlugClean`, aby usunąć je z twojej maszyny.

Vim 8 ma własne wbudowane menedżery pakietów. Możesz sprawdzić `:h packages`, aby uzyskać więcej informacji. W następnym rozdziale pokażę, jak go używać.

### Ustawienia

Często można zobaczyć wiele opcji `set` w każdym vimrc. Jeśli uruchomisz polecenie set z trybu wiersza poleceń, nie będzie to trwałe. Stracisz to po zamknięciu Vima. Na przykład, zamiast uruchamiać `:set relativenumber number` z trybu wiersza poleceń za każdym razem, gdy uruchamiasz Vima, możesz po prostu umieścić to w vimrc:

```shell
set relativenumber number
```

Niektóre ustawienia wymagają podania wartości, jak `set tabstop=2`. Sprawdź stronę pomocy dla każdego ustawienia, aby dowiedzieć się, jakie wartości akceptuje.

Możesz także użyć `let` zamiast `set` (upewnij się, że poprzedzasz to `&`). Z `let` możesz użyć wyrażenia jako wartości. Na przykład, aby ustawić opcję `'dictionary'` na ścieżkę tylko wtedy, gdy ta ścieżka istnieje:

```shell
let s:english_dict = "/usr/share/dict/words"

if filereadable(s:english_dict)
  let &dictionary=s:english_dict
endif
```

Dowiesz się o przypisaniach i warunkach Vimscript w późniejszych rozdziałach.

Aby uzyskać listę wszystkich możliwych opcji w Vimie, sprawdź `:h E355`.

### Niestandardowe funkcje

Vimrc to dobre miejsce na niestandardowe funkcje. Nauczysz się, jak pisać własne funkcje Vimscript w późniejszym rozdziale.

### Niestandardowe polecenia

Możesz stworzyć niestandardowe polecenie wiersza poleceń za pomocą `command`.

Aby stworzyć podstawowe polecenie `GimmeDate`, które wyświetla dzisiejszą datę:

```shell
:command! GimmeDate echo call("strftime", ["%F"])
```

Kiedy uruchomisz `:GimmeDate`, Vim wyświetli datę w formacie "2021-01-1".

Aby stworzyć podstawowe polecenie z wejściem, możesz użyć `<args>`. Jeśli chcesz przekazać do `GimmeDate` konkretny format czasu/dat:

```shell
:command! GimmeDate echo call("strftime", [<args>])

:GimmeDate "%F"
" 2020-01-01

:GimmeDate "%H:%M"
" 11:30
```

Jeśli chcesz ograniczyć liczbę argumentów, możesz użyć flagi `-nargs`. Użyj `-nargs=0`, aby nie przekazywać argumentu, `-nargs=1`, aby przekazać jeden argument, `-nargs=+`, aby przekazać co najmniej jeden argument, `-nargs=*`, aby przekazać dowolną liczbę argumentów, oraz `-nargs=?`, aby przekazać 0 lub jeden argument. Jeśli chcesz przekazać n-ty argument, użyj `-nargs=n` (gdzie `n` to dowolna liczba całkowita).

`<args>` ma dwie odmiany: `<f-args>` i `<q-args>`. Pierwsza jest używana do przekazywania argumentów do funkcji Vimscript. Druga jest używana do automatycznej konwersji wejścia użytkownika na ciągi.

Używając `args`:

```shell
:command! -nargs=1 Hello echo "Hello " . <args>
:Hello "Iggy"
" zwraca 'Hello Iggy'

:Hello Iggy
" Błąd niezdefiniowanej zmiennej
```

Używając `q-args`:

```shell
:command! -nargs=1 Hello echo "Hello " . <q-args>
:Hello Iggy
" zwraca 'Hello Iggy'
```

Używając `f-args`:

```shell
:function! PrintHello(person1, person2)
:  echo "Hello " . a:person1 . " and " . a:person2
:endfunction

:command! -nargs=* Hello call PrintHello(<f-args>)

:Hello Iggy1 Iggy2
" zwraca "Hello Iggy1 and Iggy2"
```

Funkcje powyżej będą miały znacznie więcej sensu, gdy dojdziesz do rozdziału o funkcjach Vimscript.

Aby dowiedzieć się więcej o poleceniach i argumentach, sprawdź `:h command` i `:args`.
### Mapy

Jeśli często wykonujesz tę samą złożoną czynność, to dobry wskaźnik, że powinieneś stworzyć mapowanie dla tej czynności.

Na przykład, mam te dwa mapowania w moim vimrc:

```shell
nnoremap <silent> <C-f> :GFiles<CR>

nnoremap <Leader>tn :call ToggleNumber()<CR>
```

W pierwszym mapuję `Ctrl-F` do polecenia `:Gfiles` z wtyczki [fzf.vim](https://github.com/junegunn/fzf.vim) (szybkie wyszukiwanie plików Git). W drugim mapuję `<Leader>tn`, aby wywołać funkcję `ToggleNumber` (przełącza opcje `norelativenumber` i `relativenumber`). Mapowanie `Ctrl-F` nadpisuje natywne przewijanie strony w Vimie. Twoje mapowanie nadpisze kontrolki Vima, jeśli będą kolidować. Ponieważ prawie nigdy nie używałem tej funkcji, zdecydowałem, że bezpiecznie jest ją nadpisać.

Przy okazji, co to jest klawisz "leader" w `<Leader>tn`?

Vim ma klawisz leader, aby pomóc w mapowaniach. Na przykład, mapowałem `<Leader>tn`, aby uruchomić funkcję `ToggleNumber()`. Bez klawisza leader używałbym `tn`, ale Vim już ma `t` (nawigacja wyszukiwania "till"). Z klawiszem leader mogę teraz nacisnąć klawisz przypisany jako leader, a następnie `tn`, nie zakłócając istniejących poleceń. Klawisz leader to klawisz, który możesz ustawić, aby rozpocząć swój zestaw mapowań. Domyślnie Vim używa znaku ukośnika jako klawisza leader (więc `<Leader>tn` staje się "ukośnik-t-n").

Osobiście wolę używać `<Space>` jako klawisza leader zamiast domyślnego ukośnika. Aby zmienić klawisz leader, dodaj to do swojego vimrc:

```shell
let mapleader = "\<space>"
```

Polecenie `nnoremap` użyte powyżej można podzielić na trzy części:
- `n` reprezentuje tryb normalny.
- `nore` oznacza nienawrotne.
- `map` to polecenie mapowania.

W minimalnej wersji mógłbyś użyć `nmap` zamiast `nnoremap` (`nmap <silent> <C-f> :Gfiles<CR>`). Jednak dobrym zwyczajem jest używanie nienawrotnej wersji, aby uniknąć potencjalnej nieskończonej pętli.

Oto co może się zdarzyć, jeśli nie zmapujesz nienawrotnego. Załóżmy, że chcesz dodać mapowanie do `B`, aby dodać średnik na końcu linii, a następnie cofnąć się o jedno SŁOWO (przypomnij sobie, że `B` w Vimie to klawisz nawigacji w trybie normalnym, aby cofnąć się o jedno SŁOWO).

```shell
nmap B A;<esc>B
```

Kiedy naciśniesz `B`... o nie! Vim dodaje `;` niekontrolowanie (przerwij to za pomocą `Ctrl-C`). Dlaczego to się stało? Ponieważ w mapowaniu `A;<esc>B`, `B` nie odnosi się do natywnej funkcji `B` w Vimie (cofnij się o jedno SŁOWO), ale odnosi się do zmapowanej funkcji. To, co masz, to tak naprawdę to:

```shell
A;<esc>A;<esc>A;<esc>A;esc>...
```

Aby rozwiązać ten problem, musisz dodać nienawrotne mapowanie:

```shell
nnoremap B A;<esc>B
```

Teraz spróbuj ponownie wywołać `B`. Tym razem pomyślnie dodaje `;` na końcu linii i cofa się o jedno SŁOWO. `B` w tym mapowaniu reprezentuje oryginalną funkcjonalność `B` w Vimie.

Vim ma różne mapy dla różnych trybów. Jeśli chcesz stworzyć mapę dla trybu wstawiania, aby wyjść z trybu wstawiania, gdy naciśniesz `jk`:

```shell
inoremap jk <esc>
```

Inne tryby mapowania to: `map` (Normal, Visual, Select i Operator-pending), `vmap` (Visual i Select), `smap` (Select), `xmap` (Visual), `omap` (Operator-pending), `map!` (Insert i Command-line), `lmap` (Insert, Command-line, Lang-arg), `cmap` (Command-line) i `tmap` (terminal-job). Nie będę ich omawiać szczegółowo. Aby dowiedzieć się więcej, sprawdź `:h map.txt`.

Stwórz mapę, która jest najbardziej intuicyjna, spójna i łatwa do zapamiętania.

## Organizacja Vimrc

Z biegiem czasu twój vimrc stanie się duży i skomplikowany. Istnieją dwa sposoby, aby utrzymać twój vimrc w czystości:
- Podziel swój vimrc na kilka plików.
- Złóż swój plik vimrc.

### Podział Vimrc

Możesz podzielić swój vimrc na wiele plików, używając polecenia `source` w Vimie. To polecenie odczytuje polecenia z linii poleceń z podanego argumentu pliku.

Stwórzmy plik w katalogu `~/.vim` i nazwijmy go `/settings` (`~/.vim/settings`). Nazwa jest dowolna i możesz nazwać go jak chcesz.

Zamierzamy podzielić go na cztery komponenty:
- Wtyczki zewnętrzne (`~/.vim/settings/plugins.vim`).
- Ustawienia ogólne (`~/.vim/settings/configs.vim`).
- Funkcje niestandardowe (`~/.vim/settings/functions.vim`).
- Mapowania klawiszy (`~/.vim/settings/mappings.vim`).

Wewnątrz `~/.vimrc`:

```shell
source $HOME/.vim/settings/plugins.vim
source $HOME/.vim/settings/configs.vim
source $HOME/.vim/settings/functions.vim
source $HOME/.vim/settings/mappings.vim
```

Możesz edytować te pliki, umieszczając kursor pod ścieżką i naciskając `gf`.

Wewnątrz `~/.vim/settings/plugins.vim`:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

Wewnątrz `~/.vim/settings/configs.vim`:

```shell
set nocompatible
set relativenumber
set number
```

Wewnątrz `~/.vim/settings/functions.vim`:

```shell
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
```

Wewnątrz `~/.vim/settings/mappings.vim`:

```shell
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
```

Twój vimrc powinien działać jak zwykle, ale teraz ma tylko cztery linie!

Z tym ustawieniem łatwo wiesz, gdzie iść. Jeśli potrzebujesz dodać więcej mapowań, dodaj je do pliku `/mappings.vim`. W przyszłości zawsze możesz dodać więcej katalogów, gdy twój vimrc będzie się rozwijał. Na przykład, jeśli potrzebujesz stworzyć ustawienie dla swoich schematów kolorów, możesz dodać `~/.vim/settings/themes.vim`.

### Utrzymywanie jednego pliku Vimrc

Jeśli wolisz utrzymać jeden plik vimrc, aby był przenośny, możesz użyć złożonych znaczników, aby go zorganizować. Dodaj to na górze swojego vimrc:

```shell
" setup folds {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}
```

Vim może wykryć, jaki typ pliku ma bieżący bufor (`:set filetype?`). Jeśli jest to typ pliku `vim`, możesz użyć metody złożonych znaczników. Przypomnij sobie, że złożone znaczniki używają `{{{` i `}}}` do wskazania początku i końca złożenia.

Dodaj złożone znaczniki `{{{` i `}}}` do reszty swojego vimrc (nie zapomnij je skomentować za pomocą `"`):

```shell
" setup folds {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}

" plugins {{{
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
" }}}

" configs {{{
set nocompatible
set relativenumber
set number
" }}}

" functions {{{
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
" }}}

" mappings {{{
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
" }}}
```

Twój vimrc powinien wyglądać tak:

```shell
+-- 6 linii: setup folds -----

+-- 6 linii: plugins ---------

+-- 5 linii: configs ---------

+-- 9 linii: functions -------

+-- 5 linii: mappings --------
```

## Uruchamianie Vima z lub bez Vimrc i wtyczek

Jeśli musisz uruchomić Vima bez zarówno vimrc, jak i wtyczek, uruchom:

```shell
vim -u NONE
```

Jeśli musisz uruchomić Vima bez vimrc, ale z wtyczkami, uruchom:

```shell
vim -u NORC
```

Jeśli musisz uruchomić Vima z vimrc, ale bez wtyczek, uruchom:

```shell
vim --noplugin
```

Jeśli musisz uruchomić Vima z *innym* vimrc, powiedzmy `~/.vimrc-backup`, uruchom:

```shell
vim -u ~/.vimrc-backup
```

Jeśli musisz uruchomić Vima tylko z `defaults.vim` i bez wtyczek, co jest pomocne do naprawy uszkodzonego vimrc, uruchom:

```shell
vim --clean
```

## Konfiguracja Vimrc w inteligentny sposób

Vimrc jest ważnym elementem dostosowywania Vima. Dobrym sposobem na rozpoczęcie budowania swojego vimrc jest czytanie vimrc innych ludzi i stopniowe budowanie go w czasie. Najlepszy vimrc to nie ten, który używa deweloper X, ale ten, który jest dostosowany dokładnie do twojego sposobu myślenia i stylu edycji.