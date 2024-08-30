---
description: Niniejszy dokument przedstawia, jak korzystać z tagów w Vimie do szybkiego
  przechodzenia do definicji w kodzie, ułatwiając zrozumienie nieznanych fragmentów.
title: Ch16. Tags
---

Jedną z przydatnych funkcji w edytorach tekstu jest możliwość szybkiego przechodzenia do dowolnej definicji. W tym rozdziale nauczysz się, jak używać tagów Vim do tego celu.

## Przegląd tagów

Załóżmy, że ktoś przekazał ci nową bazę kodu:

```shell
one = One.new
one.donut
```

`One`? `donut`? Cóż, dla programistów piszących ten kod mogło to być oczywiste, ale teraz ci programiści już tu nie są i to do ciebie należy zrozumienie tych niejasnych kodów. Jednym ze sposobów, aby to zrozumieć, jest śledzenie źródła, w którym zdefiniowane są `One` i `donut`.

Możesz ich szukać za pomocą `fzf` lub `grep` (lub `vimgrep`), ale w tym przypadku tagi są szybsze.

Pomyśl o tagach jak o książce adresowej:

```shell
Name    Address
Iggy1   1234 Cool St, 11111
Iggy2   9876 Awesome Ave, 2222
```

Zamiast pary nazwa-adres, tagi przechowują definicje sparowane z adresami.

Załóżmy, że masz te dwa pliki Ruby w tym samym katalogu:

```shell
## one.rb
class One
  def initialize
    puts "Initialized"
  end

  def donut
    puts "Bar"
  end
end
```

i

```shell
## two.rb
require './one'

one = One.new
one.donut
```

Aby przejść do definicji, możesz użyć `Ctrl-]` w trybie normalnym. W pliku `two.rb`, przejdź do linii, w której znajduje się `one.donut` i przesuń kursor nad `donut`. Naciśnij `Ctrl-]`.

Ups, Vim nie mógł znaleźć pliku tagów. Musisz najpierw wygenerować plik tagów.

## Generator tagów

Nowoczesny Vim nie ma wbudowanego generatora tagów, więc będziesz musiał pobrać zewnętrzny generator tagów. Jest kilka opcji do wyboru:

- ctags = Tylko C. Dostępny prawie wszędzie.
- exuberant ctags = Jeden z najpopularniejszych. Ma wsparcie dla wielu języków.
- universal ctags = Podobny do exuberant ctags, ale nowszy.
- etags = Dla Emacsa. Hmm...
- JTags = Java
- ptags.py = Python
- ptags = Perl
- gnatxref = Ada

Jeśli spojrzysz na samouczki Vim w Internecie, wiele z nich poleca [exuberant ctags](http://ctags.sourceforge.net/). Obsługuje [41 języków programowania](http://ctags.sourceforge.net/languages.html). Używałem go i działał świetnie. Jednak ponieważ nie był utrzymywany od 2009 roku, Universal ctags będzie lepszym wyborem. Działa podobnie do exuberant ctags i jest obecnie utrzymywany.

Nie będę wchodził w szczegóły dotyczące instalacji universal ctags. Sprawdź repozytorium [universal ctags](https://github.com/universal-ctags/ctags) po więcej instrukcji.

Zakładając, że masz zainstalowane universal ctags, wygenerujmy podstawowy plik tagów. Uruchom:

```shell
ctags -R .
```

Opcja `R` mówi ctags, aby przeprowadził skanowanie rekurencyjne z twojej bieżącej lokalizacji (`.`). Powinieneś zobaczyć plik `tags` w swoim bieżącym katalogu. Wewnątrz zobaczysz coś takiego:

```shell
!_TAG_FILE_FORMAT	2	/extended format; --format=1 will not append ;" to lines/
!_TAG_FILE_SORTED	1	/0=unsorted, 1=sorted, 2=foldcase/
!_TAG_OUTPUT_FILESEP	slash	/slash or backslash/
!_TAG_OUTPUT_MODE	u-ctags	/u-ctags or e-ctags/
!_TAG_PATTERN_LENGTH_LIMIT	96	/0 for no limit/
!_TAG_PROGRAM_AUTHOR	Universal Ctags Team	//
!_TAG_PROGRAM_NAME	Universal Ctags	/Derived from Exuberant Ctags/
!_TAG_PROGRAM_URL	<https://ctags.io/>	/official site/
!_TAG_PROGRAM_VERSION	0.0.0	/b43eb39/
One	one.rb	/^class One$/;"	c
donut	one.rb	/^  def donut$/;"	f	class:One
initialize	one.rb	/^  def initialize$/;"	f	class:One
```

Twój może wyglądać nieco inaczej w zależności od ustawień Vim i generatora ctags. Plik tagów składa się z dwóch części: metadanych tagów i listy tagów. Te metadane (`!TAG_FILE...`) są zazwyczaj kontrolowane przez generator ctags. Nie będę o tym dyskutować tutaj, ale śmiało sprawdź ich dokumentację po więcej informacji! Lista tagów to lista wszystkich definicji zindeksowanych przez ctags.

Teraz przejdź do `two.rb`, umieść kursor na `donut` i wpisz `Ctrl-]`. Vim przeniesie cię do pliku `one.rb` w linii, gdzie znajduje się `def donut`. Sukces! Ale jak Vim to zrobił?

## Anatomia tagów

Przyjrzyjmy się elementowi tagu `donut`:

```shell
donut	one.rb	/^  def donut$/;"	f	class:One
```

Powyższy element tagu składa się z czterech komponentów: `tagname`, `tagfile`, `tagaddress` i opcji tagu.
- `donut` to `tagname`. Gdy kursor znajduje się na "donut", Vim przeszukuje plik tagów w poszukiwaniu linii, która zawiera ciąg "donut".
- `one.rb` to `tagfile`. Vim szuka pliku `one.rb`.
- `/^ def donut$/` to `tagaddress`. `/.../` to wskaźnik wzorca. `^` to wzorzec dla pierwszego elementu w linii. Następnie są dwa spacje, potem ciąg `def donut`. Na końcu `$` to wzorzec dla ostatniego elementu w linii.
- `f class:One` to opcja tagu, która mówi Vim, że funkcja `donut` jest funkcją (`f`) i jest częścią klasy `One`.

Przyjrzyjmy się innemu elementowi na liście tagów:

```shell
One	one.rb	/^class One$/;"	c
```

Ta linia działa w ten sam sposób, co wzorzec `donut`:

- `One` to `tagname`. Zauważ, że przy tagach pierwsze skanowanie jest wrażliwe na wielkość liter. Jeśli masz `One` i `one` na liście, Vim nada priorytet `One` nad `one`.
- `one.rb` to `tagfile`. Vim szuka pliku `one.rb`.
- `/^class One$/` to wzorzec `tagaddress`. Vim szuka linii, która zaczyna się od (`^`) `class` i kończy na (`$`) `One`.
- `c` to jedna z możliwych opcji tagu. Ponieważ `One` jest klasą ruby, a nie procedurą, oznacza to jako `c`.

W zależności od używanego generatora tagów, zawartość twojego pliku tagów może wyglądać inaczej. Minimalnie plik tagów musi mieć jeden z tych formatów:

```shell
1.  {tagname} {TAB} {tagfile} {TAB} {tagaddress}
2.  {tagname} {TAB} {tagfile} {TAB} {tagaddress} {term} {field} ..
```

## Plik tagów

Nauczyłeś się, że nowy plik, `tags`, jest tworzony po uruchomieniu `ctags -R .`. Jak Vim wie, gdzie szukać pliku tagów?

Jeśli uruchomisz `:set tags?`, możesz zobaczyć `tags=./tags,tags` (w zależności od ustawień Vim, może być inaczej). Tutaj Vim szuka wszystkich tagów w ścieżce bieżącego pliku w przypadku `./tags` oraz w bieżącym katalogu (korzeniu projektu) w przypadku `tags`.

Również w przypadku `./tags`, Vim najpierw szuka pliku tagów w ścieżce bieżącego pliku, niezależnie od tego, jak bardzo jest zagnieżdżony, a następnie szuka pliku tagów w bieżącym katalogu (korzeniu projektu). Vim zatrzymuje się po znalezieniu pierwszego dopasowania.

Jeśli twój plik `'tags'` powiedziałby `tags=./tags,tags,/user/iggy/mytags/tags`, to Vim również spojrzy na katalog `/user/iggy/mytags` w poszukiwaniu pliku tagów po zakończeniu przeszukiwania katalogów `./tags` i `tags`. Nie musisz przechowywać pliku tagów wewnątrz swojego projektu, możesz je trzymać osobno.

Aby dodać nową lokalizację pliku tagów, użyj następującego:

```shell
set tags+=path/to/my/tags/file
```

## Generowanie tagów dla dużego projektu

Jeśli próbujesz uruchomić ctags w dużym projekcie, może to zająć dużo czasu, ponieważ Vim również przeszukuje wszystkie zagnieżdżone katalogi. Jeśli jesteś programistą JavaScript, wiesz, że `node_modules` może być bardzo duży. Wyobraź sobie, że masz pięć podprojektów, a każdy z nich zawiera własny katalog `node_modules`. Jeśli uruchomisz `ctags -R .`, ctags spróbuje przeskanować wszystkie 5 `node_modules`. Prawdopodobnie nie musisz uruchamiać ctags na `node_modules`.

Aby uruchomić ctags, wykluczając `node_modules`, uruchom:

```shell
ctags -R --exclude=node_modules .
```

Tym razem powinno to zająć mniej niż sekundę. Przy okazji, możesz użyć opcji `exclude` wiele razy:

```shell
ctags -R --exclude=.git --exclude=vendor --exclude=node_modules --exclude=db --exclude=log .
```

Chodzi o to, że jeśli chcesz pominąć katalog, `--exclude` jest twoim najlepszym przyjacielem.

## Nawigacja po tagach

Możesz uzyskać dobrą wydajność używając tylko `Ctrl-]`, ale nauczmy się kilku dodatkowych sztuczek. Klawisz skoku tagu `Ctrl-]` ma alternatywę w trybie linii poleceń: `:tag {tag-name}`. Jeśli uruchomisz:

```shell
:tag donut
```

Vim przeskoczy do metody `donut`, tak jakbyś użył `Ctrl-]` na ciągu "donut". Możesz również autouzupełnić argument, używając `<Tab>`:

```shell
:tag d<Tab>
```

Vim wyświetli wszystkie tagi, które zaczynają się na "d". W tym przypadku, "donut".

W prawdziwym projekcie możesz napotkać wiele metod o tej samej nazwie. Zaktualizujmy dwa pliki ruby z wcześniejszego przykładu. Wewnątrz `one.rb`:

```shell
## one.rb
class One
  def initialize
    puts "Initialized"
  end

  def donut
    puts "one donut"
  end

  def pancake
    puts "one pancake"
  end
end
```

Wewnątrz `two.rb`:

```shell
## two.rb
require './one.rb'

def pancake
  "Two pancakes"
end

one = One.new
one.donut
puts pancake
```

Jeśli kodujesz równolegle, nie zapomnij ponownie uruchomić `ctags -R .`, ponieważ masz teraz kilka nowych procedur. Masz dwie instancje procedury `pancake`. Jeśli jesteś w `two.rb` i naciśniesz `Ctrl-]`, co się stanie?

Vim przeskoczy do `def pancake` wewnątrz `two.rb`, a nie do `def pancake` wewnątrz `one.rb`. Dzieje się tak, ponieważ Vim widzi procedurę `pancake` wewnątrz `two.rb` jako mającą wyższy priorytet niż inna procedura `pancake`.

## Priorytet tagów

Nie wszystkie tagi są równe. Niektóre tagi mają wyższe priorytety. Jeśli Vim napotka zduplikowane nazwy elementów, sprawdza priorytet słowa kluczowego. Kolejność jest następująca:

1. W pełni dopasowany statyczny tag w bieżącym pliku.
2. W pełni dopasowany globalny tag w bieżącym pliku.
3. W pełni dopasowany globalny tag w innym pliku.
4. W pełni dopasowany statyczny tag w innym pliku.
5. Wrażliwy na wielkość liter statyczny tag w bieżącym pliku.
6. Wrażliwy na wielkość liter globalny tag w bieżącym pliku.
7. Wrażliwy na wielkość liter globalny tag w innym pliku.
8. Wrażliwy na wielkość liter statyczny tag w bieżącym pliku.

Zgodnie z listą priorytetów, Vim nadaje priorytet dokładnemu dopasowaniu znalezionemu w tym samym pliku. Dlatego Vim wybiera procedurę `pancake` wewnątrz `two.rb` zamiast procedury `pancake` wewnątrz `one.rb`. Istnieją pewne wyjątki od powyższej listy priorytetów w zależności od ustawień `'tagcase'`, `'ignorecase'` i `'smartcase'`, ale nie będę ich tutaj omawiać. Jeśli jesteś zainteresowany, sprawdź `:h tag-priority`.

## Selektywne skoki do tagów

Byłoby miło, gdybyś mógł wybierać, do których elementów tagów przeskoczyć, zamiast zawsze przechodzić do elementu tagu o najwyższym priorytecie. Może naprawdę potrzebujesz przeskoczyć do metody `pancake` w `one.rb`, a nie tej w `two.rb`. Aby to zrobić, możesz użyć `:tselect`. Uruchom:

```shell
:tselect pancake
```

Zobaczysz na dole ekranu:
## pri kind tag               plik
1 F C f    pancake           two.rb
             def pancake
2 F   f    pancake           one.rb
             class:One
             def pancake
```

Jeśli wpiszesz 2, Vim przejdzie do procedury w `one.rb`. Jeśli wpiszesz 1, Vim przejdzie do procedury w `two.rb`.

Zwróć uwagę na kolumnę `pri`. Masz `F C` w pierwszym dopasowaniu i `F` w drugim dopasowaniu. To jest to, co Vim używa do określenia priorytetu tagu. `F C` oznacza w pełni dopasowany (`F`) globalny tag w bieżącym (`C`) pliku. `F` oznacza tylko w pełni dopasowany (`F`) globalny tag. `F C` zawsze ma wyższy priorytet niż `F`.

Jeśli uruchomisz `:tselect donut`, Vim również poprosi cię o wybór, do którego elementu tagu chcesz przejść, nawet jeśli jest tylko jedna opcja do wyboru. Czy jest sposób, aby Vim wyświetlił listę tagów tylko wtedy, gdy jest wiele dopasowań i natychmiast przeszedł, jeśli znaleziono tylko jeden tag?

Oczywiście! Vim ma metodę `:tjump`. Uruchom:

```shell
:tjump donut
```

Vim natychmiast przejdzie do procedury `donut` w `one.rb`, podobnie jak uruchomienie `:tag donut`. Teraz uruchom:

```shell
:tjump pancake
```

Vim poprosi cię o opcje tagów do wyboru, podobnie jak uruchomienie `:tselect pancake`. Dzięki `tjump` zyskujesz to, co najlepsze z obu metod.

Vim ma klawisz w trybie normalnym dla `tjump`: `g Ctrl-]`. Osobiście wolę `g Ctrl-]` od `Ctrl-]`.

## Autouzupełnianie z Tagami

Tagi mogą wspierać autouzupełnianie. Przypomnij sobie z rozdziału 6, Tryb Wstawiania, że możesz użyć podtrybu `Ctrl-X` do różnych autouzupełnień. Jednym z podtrybów autouzupełniania, o którym nie wspomniałem, był `Ctrl-]`. Jeśli zrobisz `Ctrl-X Ctrl-]` podczas w trybie wstawiania, Vim użyje pliku tagów do autouzupełniania.

Jeśli przejdziesz do trybu wstawiania i wpiszesz `Ctrl-x Ctrl-]`, zobaczysz:

```shell
One
donut
initialize
pancake
```

## Stos Tagów

Vim przechowuje listę wszystkich tagów, do których przeszedłeś i z których wróciłeś, w stosie tagów. Możesz zobaczyć ten stos za pomocą `:tags`. Jeśli najpierw przeskoczyłeś do `pancake`, a następnie do `donut`, i uruchomisz `:tags`, zobaczysz:

```shell
  # DO tag         Z Linii  w pliku/tekście
  1  1 pancake            10  ch16_tags/two.rb
  2  1 donut               9  ch16_tags/two.rb
>
```

Zauważ symbol `>`. Pokazuje on twoją aktualną pozycję w stosie. Aby "zdjąć" stos, aby wrócić do jednego poprzedniego stosu, możesz uruchomić `:pop`. Spróbuj, a następnie uruchom `:tags` ponownie:

```shell
  # DO tag         Z Linii  w pliku/tekście
  1  1 pancake            10  puts pancake
> 2  1 donut               9  one.donut

```

Zauważ, że symbol `>` jest teraz w drugiej linii, gdzie znajduje się `donut`. Zrób `pop` jeszcze raz, a następnie uruchom `:tags` ponownie:

```shell
  # DO tag         Z Linii  w pliku/tekście
> 1  1 pancake            10  puts pancake
  2  1 donut               9  one.donut
```

W trybie normalnym możesz uruchomić `Ctrl-t`, aby osiągnąć ten sam efekt co `:pop`.

## Automatyczne Generowanie Tagów

Jednym z największych wad tagów Vim jest to, że za każdym razem, gdy dokonasz znaczącej zmiany, musisz ponownie wygenerować plik tagów. Jeśli niedawno zmieniłeś nazwę procedury `pancake` na `waffle`, plik tagów nie wiedział, że procedura `pancake` została zmieniona. Nadal przechowywał `pancake` na liście tagów. Musisz uruchomić `ctags -R .`, aby stworzyć zaktualizowany plik tagów. Ponowne tworzenie nowego pliku tagów w ten sposób może być uciążliwe.

Na szczęście istnieje kilka metod, które możesz zastosować, aby generować tagi automatycznie.

## Generowanie Taga przy Zapisie

Vim ma metodę autokomendy (`autocmd`), aby wykonać dowolne polecenie na wyzwalaczu zdarzenia. Możesz użyć tego, aby generować tagi przy każdym zapisie. Uruchom:

```shell
:autocmd BufWritePost *.rb silent !ctags -R .
```

Rozbicie:
- `autocmd` to polecenie w linii poleceń. Przyjmuje zdarzenie, wzór pliku i polecenie.
- `BufWritePost` to zdarzenie zapisu bufora. Za każdym razem, gdy zapisujesz plik, wyzwalasz zdarzenie `BufWritePost`.
- `.rb` to wzór pliku dla plików ruby.
- `silent` jest w rzeczywistości częścią polecenia, które przekazujesz. Bez tego Vim wyświetli `naciśnij ENTER lub wpisz polecenie, aby kontynuować` za każdym razem, gdy wyzwolisz autokomendę.
- `!ctags -R .` to polecenie do wykonania. Przypomnij sobie, że `!cmd` z wnętrza Vima wykonuje polecenie terminalowe.

Teraz za każdym razem, gdy zapisujesz z wnętrza pliku ruby, Vim uruchomi `ctags -R .`.

## Używanie Wtyczek

Istnieje kilka wtyczek do automatycznego generowania ctags:

- [vim-gutentags](https://github.com/ludovicchabant/vim-gutentags)
- [vim-tags](https://github.com/szw/vim-tags)
- [vim-easytags](https://github.com/xolox/vim-easytags)
- [vim-autotag](https://github.com/craigemery/vim-autotag)

Używam vim-gutentags. Jest prosty w użyciu i działa od razu po zainstalowaniu.

## Ctags i Hooki Gita

Tim Pope, autor wielu świetnych wtyczek do Vima, napisał bloga sugerującego użycie hooków gita. [Sprawdź to](https://tbaggery.com/2011/08/08/effortless-ctags-with-git.html).

## Ucz się Tagów w Inteligentny Sposób

Tag jest użyteczny, gdy jest odpowiednio skonfigurowany. Załóżmy, że stoisz przed nową bazą kodu i chcesz zrozumieć, co robi `functionFood`, możesz łatwo to przeczytać, przeskakując do jego definicji. Wewnątrz dowiadujesz się, że wywołuje również `functionBreakfast`. Śledzisz to i dowiadujesz się, że wywołuje `functionPancake`. Twój wykres wywołań funkcji wygląda mniej więcej tak:

```shell
functionFood -> functionBreakfast -> functionPancake
```

To daje ci wgląd, że ten przepływ kodu jest związany z jedzeniem naleśnika na śniadanie.

Aby dowiedzieć się więcej o tagach, sprawdź `:h tags`. Teraz, gdy wiesz, jak używać tagów, zbadajmy inną funkcję: składanie.