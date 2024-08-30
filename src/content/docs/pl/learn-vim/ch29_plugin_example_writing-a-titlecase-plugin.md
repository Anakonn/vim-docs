---
description: Niniejszy dokument przedstawia plugin Vim o nazwie totitle-vim, który
  automatyzuje formatowanie tytułów w stylu title case, inspirując do tworzenia własnych
  pluginów.
title: 'Ch29. Write a Plugin: Creating a Titlecase Operator'
---

Kiedy zaczynasz dobrze radzić sobie z Vimem, możesz chcieć napisać własne wtyczki. Niedawno napisałem swoją pierwszą wtyczkę do Vima, [totitle-vim](https://github.com/iggredible/totitle-vim). Jest to wtyczka operatora do tytułowania, podobna do operatorów wielkich liter `gU`, małych liter `gu` i zmiany wielkości liter `g~` w Vimie.

W tym rozdziale przedstawię szczegóły dotyczące wtyczki `totitle-vim`. Mam nadzieję, że rzucę nieco światła na ten proces i może zainspiruję cię do stworzenia własnej unikalnej wtyczki!

## Problem

Używam Vima do pisania moich artykułów, w tym tego przewodnika.

Jednym z głównych problemów było stworzenie odpowiedniego tytułowania dla nagłówków. Jednym ze sposobów automatyzacji tego jest kapitalizacja każdego słowa w nagłówku za pomocą `g/^#/ s/\<./\u\0/g`. Do podstawowego użytku ta komenda była wystarczająca, ale wciąż nie jest tak dobra, jak posiadanie rzeczywistego tytułowania. Słowa "The" i "Of" w "Capitalize The First Letter Of Each Word" powinny być napisane wielką literą. Bez odpowiedniej kapitalizacji zdanie wygląda nieco niepoprawnie.

Na początku nie planowałem pisać wtyczki. Okazało się również, że istnieje już wtyczka do tytułowania: [vim-titlecase](https://github.com/christoomey/vim-titlecase). Jednak kilka rzeczy nie działało dokładnie tak, jak chciałem. Głównym problemem było zachowanie trybu wizualnego blokowego. Jeśli mam frazę:

```shell
test title one
test title two
test title three
```

Jeśli użyję blokowego podświetlenia na "tle":

```shell
test ti[tle] one
test ti[tle] two
test ti[tle] three
```

Jeśli naciśniesz `gt`, wtyczka nie zcapitalizuje tego. Uważam to za niespójne z zachowaniem `gu`, `gU` i `g~`. Postanowiłem więc pracować na podstawie repozytorium tej wtyczki do tytułowania i użyć tego do stworzenia własnej wtyczki do tytułowania, która jest spójna z `gu`, `gU` i `g~`! Jeszcze raz, wtyczka vim-titlecase sama w sobie jest doskonałą wtyczką i zasługuje na samodzielne użycie (prawda jest taka, że może głęboko w sobie po prostu chciałem napisać swoją własną wtyczkę do Vima. Nie widzę, aby funkcja tytułowania blokowego była używana tak często w prawdziwym życiu, poza przypadkami skrajnymi).

### Planowanie wtyczki

Zanim napiszę pierwszy wiersz kodu, muszę zdecydować, jakie są zasady tytułowania. Znalazłem fajną tabelę różnych zasad kapitalizacji na stronie [titlecaseconverter](https://titlecaseconverter.com/rules/). Czy wiedziałeś, że w języku angielskim istnieje co najmniej 8 różnych zasad kapitalizacji? *Zdziwienie!*

Na końcu użyłem wspólnych mianowników z tej listy, aby stworzyć wystarczająco dobrą podstawową zasadę dla wtyczki. Poza tym wątpię, aby ludzie narzekali: "Hej, używasz AMA, dlaczego nie używasz APA?". Oto podstawowe zasady:
- Pierwsze słowo zawsze jest pisane wielką literą.
- Niektóre przysłówki, spójniki i przyimki są pisane małą literą.
- Jeśli wprowadzone słowo jest całkowicie pisane wielką literą, to nie rób nic (może to być skrót).

Jeśli chodzi o to, które słowa są pisane małą literą, różne zasady mają różne listy. Postanowiłem trzymać się `a an and at but by en for in nor of off on or out per so the to up yet vs via`.

### Planowanie interfejsu użytkownika

Chcę, aby wtyczka była operatorem, który uzupełnia istniejące operatory wielkości liter w Vimie: `gu`, `gU` i `g~`. Jako operator musi akceptować zarówno ruch, jak i obiekt tekstowy (`gtw` powinno tytułować następne słowo, `gtiw` powinno tytułować wewnętrzne słowo, `gt$` powinno tytułować słowa od bieżącej lokalizacji do końca linii, `gtt` powinno tytułować bieżącą linię, `gti(` powinno tytułować słowa w nawiasach itd.). Chcę również, aby było mapowane na `gt` dla łatwego zapamiętywania. Ponadto powinno działać we wszystkich trybach wizualnych: `v`, `V` i `Ctrl-V`. Powinienem być w stanie podświetlić to w *dowolnym* trybie wizualnym, nacisnąć `gt`, a następnie wszystkie podświetlone teksty będą tytułowane.

## Czas działania Vima

Pierwszą rzeczą, którą widzisz, gdy patrzysz na repozytorium, jest to, że ma dwa katalogi: `plugin/` i `doc/`. Kiedy uruchamiasz Vima, szuka specjalnych plików i katalogów w katalogu `~/.vim` i uruchamia wszystkie pliki skryptowe w tym katalogu. Aby dowiedzieć się więcej, zapoznaj się z rozdziałem o Czasie działania Vima.

Wtyczka wykorzystuje dwa katalogi czasu działania Vima: `doc/` i `plugin/`. `doc/` to miejsce na dokumentację pomocy (abyś mógł później wyszukiwać słowa kluczowe, takie jak `:h totitle`). Później omówię, jak stworzyć stronę pomocy. Na razie skupmy się na `plugin/`. Katalog `plugin/` jest wykonywany raz, gdy Vim się uruchamia. W tym katalogu znajduje się jeden plik: `totitle.vim`. Nazwa nie ma znaczenia (mógłbym nazwać go `whatever.vim` i wciąż by działał). Cały kod odpowiedzialny za działanie wtyczki znajduje się w tym pliku.

## Mapowania

Przejdźmy do kodu!

Na początku pliku masz:

```shell
if !exists('g:totitle_default_keys')
  let g:totitle_default_keys = 1
endif
```

Kiedy uruchamiasz Vima, `g:totitle_default_keys` jeszcze nie istnieje, więc `!exists(...)` zwraca prawdę. W takim przypadku zdefiniuj `g:totitle_default_keys`, aby równało się 1. W Vimie 0 jest fałszywe, a niezerowe jest prawdziwe (użyj 1, aby wskazać prawdę).

Przejdźmy do końca pliku. Zobaczysz to:

```shell
if g:totitle_default_keys
  nnoremap <expr> gt ToTitle()
  xnoremap <expr> gt ToTitle()
  nnoremap <expr> gtt ToTitle() .. '_'
endif
```

Tutaj definiowane jest główne mapowanie `gt`. W tym przypadku, gdy dojdziesz do warunków `if` na końcu pliku, `if g:totitle_default_keys` zwróci 1 (prawdziwe), więc Vim wykonuje następujące mapowania:
- `nnoremap <expr> gt ToTitle()` mapuje operator w trybie normalnym. To pozwala na uruchomienie operatora + ruch/obiekt tekstowy, jak `gtw`, aby tytułować następne słowo lub `gtiw`, aby tytułować wewnętrzne słowo. Później omówię szczegóły, jak działa mapowanie operatora.
- `xnoremap <expr> gt ToTitle()` mapuje operatory w trybie wizualnym. To pozwala na tytułowanie tekstów, które są wizualnie podświetlone.
- `nnoremap <expr> gtt ToTitle() .. '_'` mapuje operator w trybie normalnym w linii (analogicznie do `guu` i `gUU`). Możesz się zastanawiać, co robi `.. '_'` na końcu. `..` to operator interpolacji ciągów w Vimie. `_` jest używane jako ruch z operatorem. Jeśli spojrzysz w `:help _`, zobaczysz, że podkreślenie jest używane do zliczania 1 linii w dół. Wykonuje operator na bieżącej linii (spróbuj z innymi operatorami, spróbuj uruchomić `gU_` lub `d_`, zauważ, że działa to tak samo jak `gUU` lub `dd`).
- Na koniec argument `<expr>` pozwala określić liczbę, więc możesz użyć `3gtw`, aby tytułować następne 3 słowa.

Co jeśli nie chcesz używać domyślnego mapowania `gt`? W końcu nadpisujesz domyślne mapowanie `gt` Vima (przechodzenie do następnej karty). Co jeśli chcesz użyć `gz` zamiast `gt`? Pamiętaj, jak wcześniej przeszedłeś przez trudności sprawdzania `if !exists('g:totitle_default_keys')` i `if g:totitle_default_keys`? Jeśli w swoim vimrc umieścisz `let g:totitle_default_keys = 0`, to `g:totitle_default_keys` już będzie istniało, gdy wtyczka zostanie uruchomiona (kody w twoim vimrc są wykonywane przed plikami czasu działania `plugin/`), więc `!exists('g:totitle_default_keys')` zwraca fałsz. Ponadto `if g:totitle_default_keys` byłoby fałszywe (ponieważ miałoby wartość 0), więc również nie wykona mapowania `gt`! To skutecznie pozwala ci zdefiniować własne niestandardowe mapowanie w Vimrc.

Aby zdefiniować własne mapowanie tytułowania do `gz`, dodaj to do swojego vimrc:

```shell
let g:totitle_default_keys = 0

nnoremap <expr> gz ToTitle()
xnoremap <expr> gz ToTitle()
nnoremap <expr> gzz ToTitle() .. '_'
```

Łatwizna.

## Funkcja ToTitle

Funkcja `ToTitle()` jest zdecydowanie najdłuższą funkcją w tym pliku.

```shell
 function! ToTitle(type = '')
  if a:type ==# ''
    set opfunc=ToTitle
    return 'g@'
  endif

  " wywołaj to, gdy wywołujesz funkcję ToTitle()
  if a:type != 'block' && a:type != 'line' && a:type != 'char'
    let l:words = a:type
    let l:wordsArr = trim(l:words)->split('\s\+')
    call map(l:wordsArr, 's:capitalize(v:val)')
    return l:wordsArr->join(' ')
  endif

  " zapisz bieżące ustawienia
  let l:sel_save = &selection
  let l:reg_save = getreginfo('"')
  let l:cb_save = &clipboard
  let l:visual_marks_save = [getpos("'<"), getpos("'>")]

  try
    set clipboard= selection=inclusive
    let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}

    silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
    let l:selected_phrase = getreg('"')
    let l:WORD_PATTERN = '\<\k*\>'
    let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'

    let l:startLine = line("'<")
    let l:startCol = virtcol(".")

    " gdy użytkownik wywołuje operację blokową
    if a:type ==# "block"
      sil! keepj norm! gv"ad
      keepj $
      keepj pu_

      let l:lastLine = line("$")

      sil! keepj norm "ap

      let l:curLine = line(".")

      sil! keepj norm! VGg@
      exe "keepj norm! 0\<c-v>G$h\"ad"
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
      exe "keepj " . l:lastLine
      sil! keepj norm! "_dG
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>"

    " gdy użytkownik wywołuje operację znaku lub linii
    else
      let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
      let l:titlecased = s:capitalizeFirstWord(l:titlecased)
      call setreg('"', l:titlecased)
      let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
      silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>"
    endif
  finally

    " przywróć ustawienia
    call setreg('"', l:reg_save)
    call setpos("'<", l:visual_marks_save[0])
    call setpos("'>", l:visual_marks_save[1])
    let &clipboard = l:cb_save
    let &selection = l:sel_save
  endtry
  return
endfunction
```

To jest bardzo długie, więc rozbijmy to na części.

*Mógłbym to zrefaktoryzować na mniejsze sekcje, ale dla ukończenia tego rozdziału zostawiłem to tak, jak jest.*
## Funkcja Operatora

Oto pierwsza część kodu:

```shell
if a:type ==# ''
  set opfunc=ToTitle
  return 'g@'
endif
```

Co to do cholery jest `opfunc`? Dlaczego zwraca `g@`?

Vim ma specjalny operator, funkcję operatora, `g@`. Ten operator pozwala używać *dowolnej* funkcji przypisanej do opcji `opfunc`. Jeśli mam funkcję `Foo()` przypisaną do `opfunc`, to kiedy uruchamiam `g@w`, uruchamiam `Foo()` na następnym słowie. Jeśli uruchamiam `g@i(`, to uruchamiam `Foo()` na wewnętrznych nawiasach. Ta funkcja operatora jest kluczowa do stworzenia własnego operatora Vim.

Następna linia przypisuje `opfunc` do funkcji `ToTitle`.

```shell
set opfunc=ToTitle
```

Następna linia dosłownie zwraca `g@`:

```shell
return g@
```

Jak dokładnie działają te dwie linie i dlaczego zwraca `g@`?

Załóżmy, że masz następujący map:

```shell
nnoremap <expr> gt ToTitle()`
```

Następnie naciskasz `gtw` (zmień na wielkie litery następne słowo). Za pierwszym razem, gdy uruchamiasz `gtw`, Vim wywołuje metodę `ToTitle()`. Ale w tej chwili `opfunc` jest nadal pusty. Nie przekazujesz również żadnego argumentu do `ToTitle()`, więc będzie miał wartość `a:type` równą `''`. To powoduje, że wyrażenie warunkowe sprawdza argument `a:type`, `if a:type ==# ''`, co jest prawdziwe. Wewnątrz przypisujesz `opfunc` do funkcji `ToTitle` za pomocą `set opfunc=ToTitle`. Teraz `opfunc` jest przypisany do `ToTitle`. W końcu, po przypisaniu `opfunc` do funkcji `ToTitle`, zwracasz `g@`. Wyjaśnię, dlaczego zwraca `g@` poniżej.

Jeszcze nie skończyłeś. Pamiętaj, że właśnie nacisnąłeś `gtw`. Naciśnięcie `gt` wykonało wszystkie powyższe czynności, ale nadal masz `w` do przetworzenia. Zwracając `g@`, w tym momencie technicznie masz `g@w` (dlatego masz `return g@`). Ponieważ `g@` jest funkcją operatora, przekazujesz do niej ruch `w`. Więc Vim, po otrzymaniu `g@w`, wywołuje `ToTitle` *jeszcze raz* (nie martw się, nie skończysz w nieskończonej pętli, jak zobaczysz za chwilę).

Podsumowując, naciskając `gtw`, Vim sprawdza, czy `opfunc` jest pusty, czy nie. Jeśli jest pusty, Vim przypisze mu `ToTitle`. Następnie zwraca `g@`, zasadniczo wywołując `ToTitle` jeszcze raz, abyś mógł teraz użyć go jako operatora. To jest najtrudniejsza część tworzenia niestandardowego operatora i udało ci się to! Następnie musisz zbudować logikę dla `ToTitle()`, aby faktycznie zmienić tekst na wielkie litery.

## Przetwarzanie Wejścia

Masz teraz `gt` działający jako operator, który wykonuje `ToTitle()`. Ale co dalej? Jak właściwie zmienić tekst na wielkie litery?

Kiedy uruchamiasz dowolny operator w Vim, istnieją trzy różne typy ruchów akcji: znak, linia i blok. `g@w` (słowo) jest przykładem operacji znakowej. `g@j` (jedna linia poniżej) jest przykładem operacji liniowej. Operacja blokowa jest rzadka, ale zazwyczaj, gdy wykonujesz operację `Ctrl-V` (wizualny blok), będzie to liczone jako operacja blokowa. Operacje, które celują w kilka znaków do przodu / do tyłu, są zazwyczaj uważane za operacje znakowe (`b`, `e`, `w`, `ge` itp.). Operacje, które celują w kilka linii w dół / w górę, są zazwyczaj uważane za operacje liniowe (`j`, `k`). Operacje, które celują w kolumny do przodu, do tyłu, w górę lub w dół, są zazwyczaj uważane za operacje blokowe (zwykle są to albo wymuszone ruchy kolumnowe, albo wizualny tryb blokowy; więcej: `:h forced-motion`).

Oznacza to, że jeśli naciśniesz `g@w`, `g@` przekaże dosłowny ciąg `"char"` jako argument do `ToTitle()`. Jeśli zrobisz `g@j`, `g@` przekaże dosłowny ciąg `"line"` jako argument do `ToTitle()`. Ten ciąg będzie przekazany do funkcji `ToTitle` jako argument `type`.

## Tworzenie Własnego Niestandardowego Operatora Funkcji

Zatrzymajmy się i pobawmy się `g@`, pisząc funkcję testową:

```shell
function! Test(some_arg)
  echom a:some_arg 
endfunction
```

Teraz przypisz tę funkcję do `opfunc`, uruchamiając:

```shell
:set opfunc=Test
```

Operator `g@` wykona `Test(some_arg)` i przekaże mu albo `"char"`, `"line"`, albo `"block"` w zależności od tego, jaką operację wykonasz. Uruchom różne operacje, takie jak `g@iw` (wewnętrzne słowo), `g@j` (jedna linia poniżej), `g@$` (do końca linii) itp. Zobacz, jakie różne wartości są wyświetlane. Aby przetestować operację blokową, możesz użyć wymuszonego ruchu Vim dla operacji blokowych: `g@Ctrl-Vj` (operacja blokowa jedna kolumna w dół).

Możesz również użyć tego w trybie wizualnym. Użyj różnych zaznaczeń wizualnych, takich jak `v`, `V` i `Ctrl-V`, a następnie naciśnij `g@` (bądź ostrzeżony, wyświetli to wynik bardzo szybko, więc musisz mieć szybkie oko - ale echo na pewno tam jest. Ponadto, ponieważ używasz `echom`, możesz sprawdzić zapisane wiadomości echo za pomocą `:messages`).

Fajnie, prawda? Rzeczy, które możesz zaprogramować w Vim! Dlaczego nie uczono tego w szkole? Kontynuujmy naszą wtyczkę.

## ToTitle Jako Funkcja

Przechodząc do następnych kilku linii:

```shell
if a:type != 'block' && a:type != 'line' && a:type != 'char'
  let l:words = a:type
  let l:wordsArr = trim(l:words)->split('\s\+')
  call map(l:wordsArr, 's:capitalize(v:val)')
  return l:wordsArr->join(' ')
endif
```

Ta linia tak naprawdę nie ma nic wspólnego z zachowaniem `ToTitle()` jako operatora, ale umożliwia jej działanie jako wywoływalnej funkcji TitleCase (tak, wiem, że naruszam zasadę pojedynczej odpowiedzialności). Motywacją jest to, że Vim ma wbudowane funkcje `toupper()` i `tolower()`, które zamieniają dowolny dany ciąg na wielkie i małe litery. Przykład: `:echo toupper('hello')` zwraca `'HELLO'`, a `:echo tolower('HELLO')` zwraca `'hello'`. Chcę, aby ta wtyczka miała możliwość uruchomienia `ToTitle`, abyś mógł zrobić `:echo ToTitle('once upon a time')` i otrzymać wartość zwracaną `'Once Upon a Time'`.

Do tej pory wiesz, że kiedy wywołujesz `ToTitle(type)` z `g@`, argument `type` będzie miał wartość `'block'`, `'line'` lub `'char'`. Jeśli argument nie jest ani `'block'`, ani `'line'`, ani `'char'`, możesz bezpiecznie założyć, że `ToTitle()` jest wywoływane poza `g@`. W takim przypadku dzielisz je według białych znaków (`\s\+`) za pomocą:

```shell
let l:wordsArr = trim(l:words)->split('\s\+')
```

Następnie kapitalizujesz każdy element:

```shell
call map(l:wordsArr, 's:capitalize(v:val)')
```

Zanim połączysz je z powrotem:

```shell
l:wordsArr->join(' ')
```

Funkcja `capitalize()` zostanie omówiona później.

## Zmienne Tymczasowe

Następne kilka linii:

```shell
let l:sel_save = &selection
let l:reg_save = getreginfo('"')
let l:cb_save = &clipboard
let l:visual_marks_save = [getpos("'<"), getpos("'>")]
```

Te linie zachowują różne aktualne stany w zmiennych tymczasowych. Później w tym użyjesz trybów wizualnych, znaczników i rejestrów. Robienie tego wpłynie na kilka stanów. Ponieważ nie chcesz zmieniać historii, musisz je zapisać w zmiennych tymczasowych, aby móc później przywrócić stany.
## Ustalanie wielkości liter w wyborach

Następne linie są ważne:

```shell
try
  set clipboard= selection=inclusive
  let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}

  silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
  let l:selected_phrase = getreg('"')
  let l:WORD_PATTERN = '\<\k*\>'
  let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'

  let l:startLine = line("'<")
  let l:startCol = virtcol(".")
```
Przejdźmy przez nie w małych kawałkach. Ta linia:

```shell
set clipboard= selection=inclusive
```

Najpierw ustawiasz opcję `selection` na wartość inclusive, a `clipboard` na pustą. Atrybut selection jest zazwyczaj używany w trybie wizualnym i ma trzy możliwe wartości: `old`, `inclusive` i `exclusive`. Ustawienie go na wartość inclusive oznacza, że ostatni znak wyboru jest włączony. Nie będę ich tutaj omawiać, ale chodzi o to, że wybór wartości inclusive sprawia, że działa on konsekwentnie w trybie wizualnym. Domyślnie Vim ustawia go na wartość inclusive, ale ustawiasz go tutaj na wszelki wypadek, gdyby jedna z twoich wtyczek ustawiła go na inną wartość. Sprawdź `:h 'clipboard'` i `:h 'selection'`, jeśli jesteś ciekaw, co one naprawdę robią.

Następnie masz ten dziwnie wyglądający hash, po którym następuje polecenie wykonania:

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
```

Po pierwsze, składnia `#{}` to typ danych słownika w Vimie. Zmienna lokalna `l:commands` to hash z kluczami 'lines', 'char' i 'block'. Polecenie `silent exe '...'` wykonuje dowolne polecenie wewnątrz łańcucha cicho (w przeciwnym razie wyświetli powiadomienia na dole ekranu).

Po drugie, wykonywane polecenia to `'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')`. Pierwsze, `noautocmd`, wykona następne polecenie bez wywoływania jakiejkolwiek automatycznej komendy. Drugie, `keepjumps`, ma na celu nie rejestrowanie ruchu kursora podczas poruszania się. W Vimie niektóre ruchy są automatycznie rejestrowane w liście zmian, liście skoków i liście znaczników. To temu zapobiega. Celem posiadania `noautocmd` i `keepjumps` jest zapobieganie efektom ubocznym. Na koniec, polecenie `normal` wykonuje łańcuchy jako normalne polecenia. `..` to składnia interpolacji łańcuchów w Vimie. `get()` to metoda getter, która akceptuje listę, blob lub słownik. W tym przypadku przekazujesz jej słownik `l:commands`. Klucz to `a:type`. Dowiedziałeś się wcześniej, że `a:type` to jeden z trzech wartości łańcuchowych: 'char', 'line' lub 'block'. Więc jeśli `a:type` to 'line', wykonasz `"noautocmd keepjumps normal! '[V']y"` (więcej informacji znajdziesz w `:h silent`, `:h :exe`, `:h :noautocmd`, `:h :keepjumps`, `:h :normal` i `:h get()`).

Przyjrzyjmy się, co robi `'[V']y`. Najpierw załóżmy, że masz ten tekst:

```shell
druga śniadanie
jest lepsza niż pierwsze śniadanie
```
Załóżmy, że kursor znajduje się na pierwszej linii. Następnie naciskasz `g@j` (uruchamiasz funkcję operatora, `g@`, jeden wiersz w dół, z `j`). `'[` przenosi kursor na początek ostatnio zmienionego lub skopiowanego tekstu. Chociaż technicznie nie zmieniłeś ani nie skopiowałeś żadnego tekstu za pomocą `g@j`, Vim zapamiętuje lokalizacje początkowych i końcowych ruchów polecenia `g@` za pomocą `'[` i `']` (więcej informacji znajdziesz w `:h g@`). W twoim przypadku naciśnięcie `'[` przenosi kursor na pierwszą linię, ponieważ tam zaczynałeś, gdy uruchomiłeś `g@`. `V` to polecenie w trybie wizualnym dla linii. Na koniec, `']` przenosi kursor na koniec ostatnio zmienionego lub skopiowanego tekstu, ale w tym przypadku przenosi kursor na koniec twojej ostatniej operacji `g@`. Na koniec, `y` kopiuje wybrany tekst.

To, co właśnie zrobiłeś, to skopiowanie tego samego tekstu, na którym wykonałeś `g@`.

Jeśli spojrzysz na inne dwa polecenia tutaj:

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
```

Wszystkie wykonują podobne działania, z tą różnicą, że zamiast używać działań wierszowych, używasz działań znakowych lub blokowych. Będę brzmiał powtarzalnie, ale w każdym z trzech przypadków skutecznie kopiujesz ten sam tekst, na którym wykonałeś `g@`.

Przyjrzyjmy się następnej linii:

```shell
let l:selected_phrase = getreg('"')
```

Ta linia pobiera zawartość niezidentyfikowanego rejestru (`"`) i przechowuje ją w zmiennej `l:selected_phrase`. Chwileczkę... czyż nie skopiowałeś właśnie fragmentu tekstu? Niezidentyfikowany rejestr obecnie zawiera tekst, który właśnie skopiowałeś. W ten sposób ta wtyczka jest w stanie uzyskać kopię tekstu.

Następna linia to wzorzec wyrażenia regularnego:

```shell
let l:WORD_PATTERN = '\<\k*\>'
```

`\<` i `\>` to wzorce granic słów. Znak następujący po `\<` dopasowuje początek słowa, a znak poprzedzający `\>` dopasowuje koniec słowa. `\k` to wzorzec słowa kluczowego. Możesz sprawdzić, jakie znaki Vim akceptuje jako słowa kluczowe, używając `:set iskeyword?`. Przypomnij sobie, że ruch `w` w Vimie przesuwa kursor w sposób słowny. Vim ma wstępnie określone pojęcie tego, co jest "słowem kluczowym" (możesz nawet je edytować, zmieniając opcję `iskeyword`). Sprawdź `:h /\<`, `:h /\>`, `:h /\k` i `:h 'iskeyword'`, aby uzyskać więcej informacji. Na koniec, `*` oznacza zero lub więcej z następującego wzorca.

W szerszym kontekście, `'\<\k*\>'` dopasowuje słowo. Jeśli masz ciąg:

```shell
jeden dwa trzy
```

Dopasowanie go do wzorca da ci trzy dopasowania: "jeden", "dwa" i "trzy".

Na koniec masz inny wzorzec:

```shell
let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'
```

Przypomnij sobie, że polecenie zamiany w Vimie może być używane z wyrażeniem za pomocą `\={twoje-wyrażenie}`. Na przykład, jeśli chcesz zamienić "donut" na wielkie litery w bieżącej linii, możesz użyć funkcji `toupper()` w Vimie. Możesz to osiągnąć, uruchamiając `:%s/donut/\=toupper(submatch(0))/g`. `submatch(0)` to specjalne wyrażenie używane w poleceniu zamiany. Zwraca cały dopasowany tekst.

Dwie następne linie:

```shell
let l:startLine = line("'<")
let l:startCol = virtcol(".")
```

Wyrażenie `line()` zwraca numer linii. Tutaj przekazujesz mu znacznik `'<`, reprezentujący pierwszą linię ostatnio wybranego obszaru wizualnego. Przypomnij sobie, że użyłeś trybu wizualnego, aby skopiować tekst. `'<` zwraca numer linii początku tego wyboru wizualnego. Wyrażenie `virtcol()` zwraca numer kolumny bieżącego kursora. Będziesz poruszać się po kursorze wkrótce, więc musisz przechować lokalizację kursora, aby móc później wrócić tutaj.

Zrób przerwę i przemyśl wszystko, co do tej pory. Upewnij się, że nadal podążasz za tym. Kiedy będziesz gotowy, kontynuujmy.
## Obsługa operacji blokowych

Przejdźmy przez tę sekcję:

```shell
if a:type ==# "block"
  sil! keepj norm! gv"ad
  keepj $
  keepj pu_

  let l:lastLine = line("$")

  sil! keepj norm "ap

  let l:curLine = line(".")

  sil! keepj norm! VGg@
  exe "keepj norm! 0\<c-v>G$h\"ad" 
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
  exe "keepj " . l:lastLine
  sil! keepj norm! "_dG
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Czas na rzeczywiste zamienienie tekstu na wielkie litery. Pamiętaj, że masz `a:type`, który może być 'char', 'line' lub 'block'. W większości przypadków otrzymasz 'char' i 'line'. Ale czasami możesz otrzymać blok. To rzadkie, ale musi być obsłużone. Niestety, obsługa bloku nie jest tak prosta jak obsługa znaku i linii. Wymaga to trochę dodatkowego wysiłku, ale jest wykonalne.

Zanim zaczniesz, weźmy przykład, jak możesz uzyskać blok. Załóżmy, że masz ten tekst:

```shell
naleśnik na śniadanie
naleśnik na lunch
naleśnik na kolację
```

Załóżmy, że kursor znajduje się na "c" w "naleśnik" w pierwszej linii. Następnie używasz wizualnego bloku (`Ctrl-V`), aby zaznaczyć w dół i do przodu, aby zaznaczyć "leśnik" we wszystkich trzech liniach:

```shell
na[leśnik] na śniadanie
na[leśnik] na lunch
na[leśnik] na kolację
```

Kiedy naciśniesz `gt`, chcesz uzyskać:

```shell
naLeśnik na śniadanie
naLeśnik na lunch
naLeśnik na kolację
```

Oto twoje podstawowe założenia: kiedy zaznaczasz trzy "leśniki" w "naleśnikach", mówisz Vimowi, że masz trzy linie słów, które chcesz wyróżnić. Te słowa to "leśnik", "leśnik" i "leśnik". Oczekujesz, że otrzymasz "Leśnik", "Leśnik" i "Leśnik".

Przejdźmy do szczegółów implementacji. Następne kilka linii ma:

```shell
sil! keepj norm! gv"ad
keepj $
keepj pu_
let l:lastLine = line("$")
sil! keepj norm "ap
let l:curLine = line(".")
```

Pierwsza linia:

```shell
sil! keepj norm! gv"ad
```

Pamiętaj, że `sil!` działa cicho, a `keepj` zachowuje historię skoków podczas poruszania się. Następnie wykonujesz normalne polecenie `gv"ad`. `gv` zaznacza ostatnio wizualnie wyróżniony tekst (w przykładzie z naleśnikami, ponownie wyróżni wszystkie trzy 'leśniki'). `"ad` usuwa wizualnie wyróżnione teksty i przechowuje je w rejestrze a. W rezultacie masz teraz:

```shell
na na śniadanie
na na lunch
na na kolację
```

Teraz masz 3 *bloki* (nie linie) 'leśników' przechowywanych w rejestrze a. To rozróżnienie jest ważne. Zaznaczanie tekstu w trybie wizualnym linii różni się od zaznaczania tekstu w trybie wizualnym bloku. Pamiętaj o tym, ponieważ zobaczysz to ponownie później.

Następnie masz:

```shell
keepj $
keepj pu_
```

`$` przenosi cię do ostatniej linii w pliku. `pu_` wstawia jedną linię poniżej miejsca, w którym znajduje się kursor. Chcesz je uruchomić z `keepj`, aby nie zmieniać historii skoków.

Następnie przechowujesz numer linii ostatniej linii (`line("$")`) w lokalnej zmiennej `lastLine`.

```shell
let l:lastLine = line("$")
```

Następnie wklejasz zawartość z rejestru za pomocą `norm "ap`.

```shell
sil! keepj norm "ap
```

Pamiętaj, że to dzieje się w nowej linii, którą stworzyłeś poniżej ostatniej linii pliku - obecnie jesteś na końcu pliku. Wklejenie daje ci te *bloki* tekstów:

```shell
leśnik
leśnik
leśnik
```

Następnie przechowujesz lokalizację bieżącej linii, w której znajduje się kursor.

```shell
let l:curLine = line(".")
```

Teraz przejdźmy do następnych kilku linii:

```shell
sil! keepj norm! VGg@
exe "keepj norm! 0\<c-v>G$h\"ad"
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
exe "keepj " . l:lastLine
sil! keepj norm! "_dG
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Ta linia:

```shell
sil! keepj norm! VGg@
```

`VG` wizualnie wyróżnia je w trybie wizualnym linii od bieżącej linii do końca pliku. Więc tutaj zaznaczasz trzy bloki tekstów 'leśnik' za pomocą wyróżnienia w trybie linii (przypomnij sobie różnicę między blokiem a linią). Zauważ, że za pierwszym razem, gdy wkleiłeś trzy "leśniki", wklejałeś je jako bloki. Teraz zaznaczasz je jako linie. Mogą wyglądać tak samo z zewnątrz, ale wewnętrznie Vim zna różnicę między wklejaniem bloków tekstu a wklejaniem linii tekstu.

```shell
leśnik
leśnik
leśnik
```

`g@` to operator funkcji, więc zasadniczo wykonujesz rekurencyjne wywołanie do samego siebie. Ale dlaczego? Co to osiąga?

Dokonujesz rekurencyjnego wywołania do `g@` i przekazujesz mu wszystkie 3 linie (po uruchomieniu go z `V`, masz teraz linie, a nie bloki) tekstów 'leśnik', aby były obsługiwane przez inną część kodu (przejdziesz przez to później). Wynik uruchomienia `g@` to trzy linie poprawnie zapisanych tekstów:

```shell
Leśnik
Leśnik
Leśnik
```

Następna linia:

```shell
exe "keepj norm! 0\<c-v>G$h\"ad"
```

To uruchamia polecenie w trybie normalnym, aby przejść do początku linii (`0`), użyć wizualnego zaznaczenia bloku, aby przejść do ostatniej linii i ostatniego znaku w tej linii (`<c-v>G$`). `h` to dostosowanie kursora (gdy robisz `$`, Vim przesuwa się o jedną dodatkową linię w prawo). Na koniec usuwasz zaznaczony tekst i przechowujesz go w rejestrze a (`"ad`).

Następna linia:

```shell
exe "keepj " . l:startLine
```

Przenosisz kursor z powrotem do miejsca, w którym była `startLine`.

Następnie:

```shell
exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
```

Będąc w lokalizacji `startLine`, teraz przeskakujesz do kolumny oznaczonej przez `startCol`. `\<bar>\` to ruch w prawo `|`. Ruch w prawo w Vim przenosi kursor do n-tej kolumny (powiedzmy, że `startCol` wynosił 4. Uruchomienie `4|` spowoduje przeskoczenie kursora do pozycji kolumny 4). Przypomnij, że `startCol` to miejsce, w którym przechowałeś pozycję kolumny tekstu, który chciałeś zamienić na wielkie litery. Na koniec `"aP` wkleja teksty przechowywane w rejestrze a. To przywraca tekst tam, gdzie został wcześniej usunięty.

Przyjrzyjmy się następnych 4 liniom:

```shell
exe "keepj " . l:lastLine
sil! keepj norm! "_dG
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

`exe "keepj " . l:lastLine` przenosi kursor z powrotem do lokalizacji `lastLine` z wcześniejszego etapu. `sil! keepj norm! "_dG` usuwa dodatkowe spacje, które zostały utworzone przy użyciu rejestru czarnej dziury (`"_dG`), aby twój nieznany rejestr pozostał czysty. `exe "keepj " . l:startLine` przenosi kursor z powrotem do `startLine`. Na koniec `exe "sil! keepj norm! " . l:startCol . "\<bar>"` przenosi kursor do kolumny `startCol`.

To są wszystkie działania, które mogłeś wykonać ręcznie w Vimie. Jednak korzyścią z przekształcenia tych działań w funkcje wielokrotnego użytku jest to, że oszczędzają ci one wykonywania 30+ linii instrukcji za każdym razem, gdy musisz zamienić coś na wielkie litery. Kluczowe jest to, że wszystko, co możesz zrobić ręcznie w Vimie, możesz przekształcić w funkcję wielokrotnego użytku, a więc w wtyczkę!

Oto jak to by wyglądało.

Mając jakiś tekst:

```shell
naleśnik na śniadanie
naleśnik na lunch
naleśnik na kolację

... jakiś tekst
```

Najpierw wizualnie zaznaczasz go w trybie blokowym:

```shell
na[leśnik] na śniadanie
na[leśnik] na lunch
na[leśnik] na kolację

... jakiś tekst
```

Następnie usuwasz go i przechowujesz ten tekst w rejestrze a:

```shell
na na śniadanie
na na lunch
na na kolację

... jakiś tekst
```

Następnie wklejasz go na końcu pliku:

```shell
na na śniadanie
na na lunch
na na kolację

... jakiś tekst
leśnik
leśnik
leśnik
```

Następnie zamieniasz go na wielkie litery:

```shell
na na śniadanie
na na lunch
na na kolację

... jakiś tekst
Leśnik
Leśnik
Leśnik
```

Na koniec wstawiasz tekst z wielką literą z powrotem:

```shell
naLeśnik na śniadanie
naLeśnik na lunch
naLeśnik na kolację

... jakiś tekst
```

## Obsługa operacji linii i znaku

Jeszcze nie skończyłeś. Zajmowałeś się tylko przypadkiem brzegowym, gdy uruchamiasz `gt` na tekstach blokowych. Musisz jeszcze obsłużyć operacje 'line' i 'char'. Przyjrzyjmy się kodowi `else`, aby zobaczyć, jak to się robi.

Oto kody:

```shell
if a:type ==# "block"
  # ... 
else
  let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
  let l:titlecased = s:capitalizeFirstWord(l:titlecased)
  call setreg('"', l:titlecased)
  let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
  silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>"
endif
```

Przejdźmy przez nie linia po linii. Sekretem tej wtyczki jest tak naprawdę ta linia:

```shell
let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
```

`@@` zawiera tekst z nieznanego rejestru, który ma być zamieniony na wielkie litery. `l:WORD_PATTERN` to dopasowanie pojedynczego słowa. `l:UPCASE_REPLACEMENT` to wywołanie polecenia `capitalize()` (które zobaczysz później). `'g'` to flaga globalna, która instruuje polecenie zamiany, aby zastąpić wszystkie podane słowa, a nie tylko pierwsze słowo.

Następna linia:

```shell
let l:titlecased = s:capitalizeFirstWord(l:titlecased)
```

To zapewnia, że pierwsze słowo zawsze będzie pisane wielką literą. Jeśli masz frazę taką jak "jabłko dziennie trzyma doktora z daleka", ponieważ pierwsze słowo, "jabłko", jest specjalnym słowem, twoje polecenie zamiany nie zamieni go na wielką literę. Potrzebujesz metody, która zawsze zamienia pierwszą literę na wielką, niezależnie od tego, co. Ta funkcja to robi (zobaczysz szczegóły tej funkcji później). Wynik tych metod zamiany jest przechowywany w lokalnej zmiennej `l:titlecased`.

Następna linia:

```shell
call setreg('"', l:titlecased)
```

To umieszcza zamieniony na wielką literę ciąg w nieznanym rejestrze (`"`).

Następnie, dwie kolejne linie:

```shell
let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
```

Hej, to wygląda znajomo! Widziałeś podobny wzór wcześniej z `l:commands`. Zamiast yank, tutaj używasz wklejania (`p`). Sprawdź poprzednią sekcję, gdzie omówiłem `l:commands`, aby odświeżyć pamięć.

Na koniec, te dwie linie:

```shell
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Przenosisz kursor z powrotem do linii i kolumny, w której zaczynałeś. To wszystko!

Podsumujmy. Metoda zamiany powyżej jest na tyle inteligentna, aby zamienić podane teksty na wielkie litery i pominąć specjalne słowa (więcej na ten temat później). Po uzyskaniu zamienionego na wielką literę ciągu, przechowujesz go w nieznanym rejestrze. Następnie wizualnie zaznaczasz dokładnie ten sam tekst, na którym wcześniej operowałeś `g@`, a następnie wklejasz z nieznanego rejestru (to skutecznie zastępuje teksty, które nie były zamienione na wielkie litery, ich wersją zamienioną na wielkie litery). Na koniec przenosisz kursor z powrotem do miejsca, w którym zaczynałeś.
## Czyszczenia

Technicznie rzecz biorąc, jesteś już gotowy. Teksty są teraz zapisane z wielką literą. Wszystko, co pozostało, to przywrócenie rejestrów i ustawień.

```shell
call setreg('"', l:reg_save)
call setpos("'<", l:visual_marks_save[0])
call setpos("'>", l:visual_marks_save[1])
let &clipboard = l:cb_save
let &selection = l:sel_save
```

Te polecenia przywracają:
- rejestr bez nazwy.
- znaki `<` i `>`.
- opcje `'clipboard'` i `'selection'`.

Uff, skończyłeś. To była długa funkcja. Mogłem skrócić tę funkcję, dzieląc ją na mniejsze, ale na razie to musi wystarczyć. Teraz krótko omówmy funkcje kapitalizacji.

## Funkcja Kapitalizacji

W tej sekcji omówimy funkcję `s:capitalize()`. Oto jak wygląda ta funkcja:

```shell
function! s:capitalize(string)
    if(toupper(a:string) ==# a:string && a:string != 'A')
        return a:string
    endif

    let l:str = tolower(a:string)
    let l:exclusions = '^\(a\|an\|and\|at\|but\|by\|en\|for\|in\|nor\|of\|off\|on\|or\|out\|per\|so\|the\|to\|up\|yet\|v\.?\|vs\.?\|via\)$'
    if (match(l:str, l:exclusions) >= 0) || (index(s:local_exclusion_list, l:str) >= 0)
      return l:str
    endif

    return toupper(l:str[0]) . l:str[1:]
endfunction
```

Przypomnij, że argumentem funkcji `capitalize()`, `a:string`, jest pojedyncze słowo przekazywane przez operator `g@`. Więc jeśli uruchamiam `gt` na tekście "naleśnik na śniadanie", `ToTitle` wywoła `capitalize(string)` *trzy* razy, raz dla "naleśnik", raz dla "na", i raz dla "śniadanie".

Pierwsza część funkcji to:

```shell
if(toupper(a:string) ==# a:string && a:string != 'A')
  return a:string
endif
```

Pierwszy warunek (`toupper(a:string) ==# a:string`) sprawdza, czy wersja z wielką literą argumentu jest taka sama jak ciąg i czy sam ciąg to "A". Jeśli te warunki są prawdziwe, zwróć ten ciąg. Opiera się to na założeniu, że jeśli dane słowo jest już całkowicie zapisane wielkimi literami, to jest skrótem. Na przykład, słowo "CEO" w przeciwnym razie zostałoby przekształcone w "Ceo". Hmm, twój CEO nie będzie zadowolony. Dlatego najlepiej zostawić każde w pełni zapisane wielkimi literami słowo w spokoju. Drugi warunek, `a:string != 'A'`, dotyczy przypadku brzegowego dla dużej litery "A". Jeśli `a:string` to już wielka litera "A", to przypadkowo przeszedłby test `toupper(a:string) ==# a:string`. Ponieważ "a" jest nieokreślonym artykułem w języku angielskim, musi być zapisane małą literą.

Następna część wymusza, aby ciąg był zapisany małymi literami:

```shell
let l:str = tolower(a:string)
```

Następna część to regex z listą wszystkich wykluczeń słów. Otrzymałem je z https://titlecaseconverter.com/rules/ :

```shell
let l:exclusions = '^\(a\|an\|and\|at\|but\|by\|en\|for\|in\|nor\|of\|off\|on\|or\|out\|per\|so\|the\|to\|up\|yet\|v\.?\|vs\.?\|via\)$'
```

Następna część:

```shell
if (match(l:str, l:exclusions) >= 0) || (index(s:local_exclusion_list, l:str) >= 0)
  return l:str
endif
```

Najpierw sprawdź, czy twój ciąg jest częścią listy wykluczonych słów (`l:exclusions`). Jeśli tak, nie kapitalizuj go. Następnie sprawdź, czy twój ciąg jest częścią lokalnej listy wykluczeń (`s:local_exclusion_list`). Ta lista wykluczeń to niestandardowa lista, którą użytkownik może dodać w vimrc (w przypadku, gdy użytkownik ma dodatkowe wymagania dotyczące specjalnych słów).

Ostatnia część zwraca wersję z wielką literą słowa. Pierwszy znak jest zapisany wielką literą, podczas gdy reszta pozostaje bez zmian.

```shell
return toupper(l:str[0]) . l:str[1:]
```

Przejdźmy do drugiej funkcji kapitalizacji. Funkcja wygląda tak:

```shell
function! s:capitalizeFirstWord(string)
  if (a:string =~ "\n")
    let l:lineArr = trim(a:string)->split('\n')
    let l:lineArr = map(l:lineArr, 'toupper(v:val[0]) . v:val[1:]')
    return l:lineArr->join("\n")
  endif
  return toupper(a:string[0]) . a:string[1:]
endfunction
```

Ta funkcja została stworzona, aby obsłużyć przypadek brzegowy, jeśli masz zdanie, które zaczyna się od wykluczonego słowa, jak "jabłko dziennie trzyma lekarza z daleka". Na podstawie zasad kapitalizacji w języku angielskim, wszystkie pierwsze słowa w zdaniu, niezależnie od tego, czy są to specjalne słowa, muszą być zapisane wielką literą. Przy użyciu samego polecenia `substitute()`, "an" w twoim zdaniu zostałoby zapisane małą literą. Musisz wymusić, aby pierwszy znak był zapisany wielką literą.

W tej funkcji `capitalizeFirstWord` argument `a:string` nie jest pojedynczym słowem jak `a:string` w funkcji `capitalize`, ale całym tekstem. Więc jeśli masz "naleśnik na śniadanie", wartość `a:string` to "naleśnik na śniadanie". Uruchamia tylko `capitalizeFirstWord` raz dla całego tekstu.

Jednym ze scenariuszy, na które musisz uważać, jest sytuacja, gdy masz wieloliniowy ciąg, taki jak "jabłko dziennie\ntrzyma lekarza z daleka". Chcesz zapisać wielką literą pierwszy znak wszystkich linii. Jeśli nie masz nowych linii, po prostu zapisz wielką literą pierwszy znak.

```shell
return toupper(a:string[0]) . a:string[1:]
```

Jeśli masz nowe linie, musisz zapisać wielką literą wszystkie pierwsze znaki w każdej linii, więc dzielisz je na tablicę oddzieloną nowymi liniami:

```shell
let l:lineArr = trim(a:string)->split('\n')
```

Następnie mapujesz każdy element w tablicy i kapitalizujesz pierwsze słowo każdego elementu:

```shell
let l:lineArr = map(l:lineArr, 'toupper(v:val[0]) . v:val[1:]')
```

Na koniec łączysz elementy tablicy:

```shell
return l:lineArr->join("\n")
```

I skończyłeś!

## Dokumentacja

Drugim katalogiem w repozytorium jest katalog `docs/`. Dobrze jest dostarczyć wtyczce dokładną dokumentację. W tej sekcji krótko omówię, jak stworzyć własną dokumentację wtyczki.

Katalog `docs/` jest jednym z specjalnych ścieżek uruchomieniowych Vima. Vim odczytuje wszystkie pliki znajdujące się w `docs/`, więc gdy wyszukujesz specjalne słowo kluczowe i to słowo kluczowe znajduje się w jednym z plików w katalogu `docs/`, wyświetli je na stronie pomocy. Tutaj masz plik `totitle.txt`. Nazwałem go tak, ponieważ to nazwa wtyczki, ale możesz nazwać go jak chcesz.

Plik dokumentacji Vima to w zasadzie plik txt. Różnica między zwykłym plikiem txt a plikiem pomocy Vima polega na tym, że ten drugi używa specjalnych składni "pomocniczych". Ale najpierw musisz powiedzieć Vimowi, aby traktował go nie jako plik tekstowy, ale jako plik typu `help`. Aby powiedzieć Vimowi, aby zinterpretował ten `totitle.txt` jako plik *pomocy*, uruchom `:set ft=help` (`:h 'filetype'` dla więcej informacji). Przy okazji, jeśli chcesz powiedzieć Vimowi, aby zinterpretował ten `totitle.txt` jako *zwykły* plik txt, uruchom `:set ft=txt`.

### Specjalna składnia pliku pomocy

Aby uczynić słowo kluczowe dostępnym, otocz to słowo kluczowe gwiazdkami. Aby uczynić słowo kluczowe `totitle` dostępnym, gdy użytkownik wyszukuje `:h totitle`, zapisz je jako `*totitle*` w pliku pomocy.

Na przykład, mam te linie na początku mojego spisu treści:

```shell
SPIS TREŚCI                                     *totitle*  *totitle-toc*

// więcej rzeczy w TOC
```

Zauważ, że użyłem dwóch słów kluczowych: `*totitle*` i `*totitle-toc*`, aby oznaczyć sekcję spisu treści. Możesz używać tylu słów kluczowych, ile chcesz. Oznacza to, że gdykolwiek wyszukujesz `:h totitle` lub `:h totitle-toc`, Vim przeniesie cię do tej lokalizacji.

Oto kolejny przykład, gdzieś w pliku:

```shell
2. Użycie                                                       *totitle-usage*

// użycie
```

Jeśli wyszukasz `:h totitle-usage`, Vim przeniesie cię do tej sekcji.

Możesz również używać wewnętrznych linków, aby odwołać się do innej sekcji w pliku pomocy, otaczając słowo kluczowe składnią pionową `|`. W sekcji TOC widzisz słowa kluczowe otoczone pionowymi liniami, takie jak `|totitle-intro|`, `|totitle-usage|` itd.

```shell
SPIS TREŚCI                                     *totitle*  *totitle-toc*

    1. Wprowadzenie ........................... |totitle-intro|
    2. Użycie ........................... |totitle-usage|
    3. Słowa do kapitalizacji ............. |totitle-words|
    4. Operator ........................ |totitle-operator|
    5. Skróty ......................... |totitle-keybinding|
    6. Błędy ............................ |totitle-bug-report|
    7. Wkład ............................ |totitle-contributing|
    8. Podziękowania ......................... |totitle-credits|

```
To pozwala ci przeskoczyć do definicji. Jeśli umieścisz kursor gdzieś na `|totitle-intro|` i naciśniesz `Ctrl-]`, Vim przeskoczy do definicji tego słowa. W tym przypadku przeskoczy do lokalizacji `*totitle-intro*`. Tak możesz linkować różne słowa kluczowe w dokumencie pomocy.

Nie ma jednego słusznego lub błędnego sposobu pisania pliku dokumentacji w Vimie. Jeśli spojrzysz na różne wtyczki różnych autorów, wiele z nich używa różnych formatów. Chodzi o to, aby stworzyć łatwą do zrozumienia dokumentację pomocy dla swoich użytkowników.

Na koniec, jeśli piszesz swoją własną wtyczkę lokalnie na początku i chcesz przetestować stronę dokumentacji, po prostu dodanie pliku txt do `~/.vim/docs/` nie spowoduje automatycznego uczynienia twoich słów kluczowych wyszukiwalnymi. Musisz poinstruować Vim, aby dodał twoją stronę dokumentacji. Uruchom polecenie helptags: `:helptags ~/.vim/doc`, aby stworzyć nowe pliki tagów. Teraz możesz zacząć wyszukiwać swoje słowa kluczowe.

## Podsumowanie

Dotarłeś do końca! Ten rozdział to połączenie wszystkich rozdziałów Vimscript. Tutaj w końcu wprowadzasz w praktykę to, czego się do tej pory nauczyłeś. Mam nadzieję, że po przeczytaniu tego zrozumiałeś nie tylko, jak tworzyć wtyczki Vim, ale także zachęciło cię to do napisania własnej wtyczki.

Kiedy tylko znajdziesz się w sytuacji, w której wielokrotnie powtarzasz tę samą sekwencję działań, powinieneś spróbować stworzyć swoją własną! Powiedziano, że nie powinieneś wynajdować koła na nowo. Jednak uważam, że może być korzystne wynalezienie koła na nowo dla celów nauki. Czytaj wtyczki innych ludzi. Odtwarzaj je. Ucz się z nich. Napisz swoją własną! Kto wie, może napiszesz następną niesamowitą, superpopularną wtyczkę po przeczytaniu tego. Może będziesz następnym legendarnym Timem Pope'em. Kiedy to się stanie, daj mi znać!