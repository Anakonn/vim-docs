---
description: Niniejszy dokument wprowadza do używania typów danych Vimscript, operatorów
  relacyjnych oraz pisania podstawowych programów z wykorzystaniem warunków i pętli.
title: Ch26. Vimscript Conditionals and Loops
---

Po nauczeniu się, jakie są podstawowe typy danych, następnym krokiem jest nauczenie się, jak je łączyć, aby rozpocząć pisanie podstawowego programu. Podstawowy program składa się z warunków i pętli.

W tym rozdziale nauczysz się, jak używać typów danych Vimscript do pisania warunków i pętli.

## Operatory relacyjne

Operatory relacyjne Vimscript są podobne do wielu języków programowania:

```shell
a == b		równe
a != b		nierówne
a >  b		większe niż
a >= b		większe lub równe
a <  b		mniejsze niż
a <= b		mniejsze lub równe
```

Na przykład:

```shell
:echo 5 == 5
:echo 5 != 5
:echo 10 > 5
:echo 10 >= 5
:echo 10 < 5
:echo 5 <= 5
```

Przypomnij, że ciągi znaków są przekształcane na liczby w wyrażeniu arytmetycznym. Tutaj Vim również przekształca ciągi znaków na liczby w wyrażeniu równości. "5foo" jest przekształcane na 5 (prawda):

```shell
:echo 5 == "5foo"
" zwraca true
```

Przypomnij też, że jeśli rozpoczniesz ciąg od znaku nienumerycznego, takiego jak "foo5", ciąg jest konwertowany na liczbę 0 (fałsz).

```shell
echo 5 == "foo5"
" zwraca false
```

### Operatory logiki ciągów

Vim ma więcej operatorów relacyjnych do porównywania ciągów:

```shell
a =~ b
a !~ b
```

Na przykład:

```shell
let str = "obfity śniadanie"

echo str =~ "obfity"
" zwraca true

echo str =~ "kolacja"
" zwraca false

echo str !~ "kolacja"
" zwraca true
```

Operator `=~` wykonuje dopasowanie regex do podanego ciągu. W powyższym przykładzie `str =~ "obfity"` zwraca true, ponieważ `str` *zawiera* wzór "obfity". Zawsze możesz używać `==` i `!=`, ale ich użycie porównuje wyrażenie z całym ciągiem. `=~` i `!~` są bardziej elastycznymi wyborami.

```shell
echo str == "obfity"
" zwraca false

echo str == "obfity śniadanie"
" zwraca true
```

Spróbujmy tego. Zauważ wielką literę "O":

```shell
echo str =~ "Obfity"
" true
```

Zwraca true, mimo że "Obfity" jest napisane wielką literą. Interesujące... Okazuje się, że moje ustawienie Vim jest ustawione na ignorowanie wielkości liter (`set ignorecase`), więc gdy Vim sprawdza równość, używa mojego ustawienia i ignoruje wielkość liter. Gdybym wyłączył ignorowanie wielkości liter (`set noignorecase`), porównanie teraz zwraca false.

```shell
set noignorecase
echo str =~ "Obfity"
" zwraca false, ponieważ wielkość liter ma znaczenie

set ignorecase
echo str =~ "Obfity"
" zwraca true, ponieważ wielkość liter nie ma znaczenia
```

Jeśli piszesz wtyczkę dla innych, to jest trudna sytuacja. Czy użytkownik używa `ignorecase`, czy `noignorecase`? Zdecydowanie nie chcesz zmuszać swoich użytkowników do zmiany opcji ignorowania wielkości liter. Co więc robisz?

Na szczęście Vim ma operator, który może *zawsze* ignorować lub dopasowywać wielkość liter. Aby zawsze dopasować wielkość liter, dodaj `#` na końcu.

```shell
set ignorecase
echo str =~# "obfity"
" zwraca true

echo str =~# "ObfITY"
" zwraca false

set noignorecase
echo str =~# "obfity"
" true

echo str =~# "ObfITY"
" false

echo str !~# "ObfITY"
" true
```

Aby zawsze ignorować wielkość liter podczas porównywania, dodaj `?`:

```shell
set ignorecase
echo str =~? "obfity"
" true

echo str =~? "ObfITY"
" true

set noignorecase
echo str =~? "obfity"
" true

echo str =~? "ObfITY"
" true

echo str !~? "ObfITY"
" false
```

Wolę używać `#`, aby zawsze dopasować wielkość liter i być bezpiecznym.

## If

Teraz, gdy widziałeś wyrażenia równości Vim, dotknijmy fundamentalnego operatora warunkowego, instrukcji `if`.

Minimalna składnia to:

```shell
if {klauzula}
  {jakieś wyrażenie}
endif
```

Możesz rozszerzyć analizę przypadków za pomocą `elseif` i `else`.

```shell
if {predykat1}
  {wyrażenie1}
elseif {predykat2}
  {wyrażenie2}
elseif {predykat3}
  {wyrażenie3}
else
  {wyrażenie4}
endif
```

Na przykład, wtyczka [vim-signify](https://github.com/mhinz/vim-signify) używa innej metody instalacji w zależności od ustawień Vim. Poniżej znajduje się instrukcja instalacji z ich `readme`, używając instrukcji `if`:

```shell
if has('nvim') || has('patch-8.0.902')
  Plug 'mhinz/vim-signify'
else
  Plug 'mhinz/vim-signify', { 'branch': 'legacy' }
endif
```

## Wyrażenie trójargumentowe

Vim ma wyrażenie trójargumentowe do analizy przypadków w jednej linii:

```shell
{predykat} ? wyrażenietru : wyrażeniefałszywe
```

Na przykład:

```shell
echo 1 ? "Jestem prawdziwy" : "Jestem fałszywy"
```

Ponieważ 1 jest prawdziwe, Vim wyświetla "Jestem prawdziwy". Załóżmy, że chcesz warunkowo ustawić `background` na ciemny, jeśli używasz Vima po pewnej godzinie. Dodaj to do vimrc:

```shell
let &background = strftime("%H") < 18 ? "jasny" : "ciemny"
```

`&background` to opcja `'background'` w Vimie. `strftime("%H")` zwraca aktualny czas w godzinach. Jeśli nie jest jeszcze 18:00, użyj jasnego tła. W przeciwnym razie użyj ciemnego tła.

## lub

Logiczne "lub" (`||`) działa jak w wielu językach programowania.

```shell
{fałszywe wyrażenie}  || {fałszywe wyrażenie}   false
{fałszywe wyrażenie}  || {prawdziwe wyrażenie}  true
{prawdziwe wyrażenie} || {fałszywe wyrażenie}   true
{prawdziwe wyrażenie} || {prawdziwe wyrażenie}  true
```

Vim ocenia wyrażenie i zwraca albo 1 (prawda), albo 0 (fałsz).

```shell
echo 5 || 0
" zwraca 1

echo 5 || 5
" zwraca 1

echo 0 || 0
" zwraca 0

echo "foo5" || "foo5"
" zwraca 0

echo "5foo" || "foo5"
" zwraca 1
```

Jeśli bieżące wyrażenie ocenia się jako prawdziwe, następne wyrażenie nie zostanie ocenione.

```shell
let one_dozen = 12

echo one_dozen || two_dozen
" zwraca 1

echo two_dozen || one_dozen
" zwraca błąd
```

Zauważ, że `two_dozen` nigdy nie jest zdefiniowane. Wyrażenie `one_dozen || two_dozen` nie zgłasza żadnego błędu, ponieważ `one_dozen` jest oceniane jako pierwsze i uznawane za prawdziwe, więc Vim nie ocenia `two_dozen`.

## i

Logiczne "i" (`&&`) jest dopełnieniem logicznego lub.

```shell
{fałszywe wyrażenie}  && {fałszywe wyrażenie}   false
{fałszywe wyrażenie}  && {prawdziwe wyrażenie}  false
{prawdziwe wyrażenie} && {fałszywe wyrażenie}   false
{prawdziwe wyrażenie} && {prawdziwe wyrażenie}  true
```

Na przykład:

```shell
echo 0 && 0
" zwraca 0

echo 0 && 10
" zwraca 0
```

`&&` ocenia wyrażenie, aż zobaczy pierwsze fałszywe wyrażenie. Na przykład, jeśli masz `true && true`, oceni obie i zwróci `true`. Jeśli masz `true && false && true`, oceni pierwsze `true` i zatrzyma się na pierwszym `false`. Nie oceni trzeciego `true`.

```shell
let one_dozen = 12
echo one_dozen && 10
" zwraca 1

echo one_dozen && v:false
" zwraca 0

echo one_dozen && two_dozen
" zwraca błąd

echo exists("one_dozen") && one_dozen == 12
" zwraca 1
```

## dla

Pętla `for` jest powszechnie używana z typem danych listy.

```shell
let breakfasts = ["naleśniki", "gofry", "jajka"]

for breakfast in breakfasts
  echo breakfast
endfor
```

Działa z zagnieżdżoną listą:

```shell
let meals = [["śniadanie", "naleśniki"], ["lunch", "ryba"], ["kolacja", "makaron"]]

for [meal_type, food] in meals
  echo "Mam " . food . " na " . meal_type
endfor
```

Technicznie możesz używać pętli `for` z słownikiem, używając metody `keys()`.

```shell
let beverages = #{śniadanie: "mleko", lunch: "sok pomarańczowy", kolacja: "woda"}
for beverage_type in keys(beverages)
  echo "Piję " . beverages[beverage_type] . " na " . beverage_type
endfor
```

## Podczas

Inną powszechną pętlą jest pętla `while`.

```shell
let counter = 1
while counter < 5
  echo "Licznik to: " . counter
  let counter += 1
endwhile
```

Aby uzyskać zawartość bieżącej linii do ostatniej linii:

```shell
let current_line = line(".")
let last_line = line("$")

while current_line <= last_line
  echo getline(current_line)
  let current_line += 1
endwhile
```

## Obsługa błędów

Często twój program nie działa tak, jak się tego spodziewasz. W rezultacie wprowadza cię w błąd (gra słów). To, czego potrzebujesz, to odpowiednia obsługa błędów.

### Przerwij

Gdy używasz `break` wewnątrz pętli `while` lub `for`, zatrzymuje to pętlę.

Aby uzyskać teksty od początku pliku do bieżącej linii, ale zatrzymać się, gdy zobaczysz słowo "donut":

```shell
let line = 0
let last_line = line("$")
let total_word = ""

while line <= last_line
  let line += 1
  let line_text = getline(line)
  if line_text =~# "donut"
    break
  endif
  echo line_text
  let total_word .= line_text . " "
endwhile

echo total_word
```

Jeśli masz tekst:

```shell
jeden
dwa
trzy
donut
cztery
pięć
```

Uruchomienie powyższej pętli `while` daje "jeden dwa trzy" i nie resztę tekstu, ponieważ pętla przerywa, gdy dopasowuje "donut".

### Kontynuuj

Metoda `continue` jest podobna do `break`, gdzie jest wywoływana podczas pętli. Różnica polega na tym, że zamiast przerywać pętlę, po prostu pomija bieżącą iterację.

Załóżmy, że masz ten sam tekst, ale zamiast `break` używasz `continue`:

```shell
let line = 0
let last_line = line("$")
let total_word = ""

while line <= last_line
  let line += 1
  let line_text = getline(line)
  if line_text =~# "donut"
    continue
  endif
  echo line_text
  let total_word .= line_text . " "
endwhile

echo total_word
```

Tym razem zwraca `jeden dwa trzy cztery pięć`. Pomija linię ze słowem "donut", ale pętla trwa.
### try, finally i catch

Vim ma `try`, `finally` i `catch`, aby obsługiwać błędy. Aby zasymulować błąd, możesz użyć polecenia `throw`.

```shell
try
  echo "Spróbuj"
  throw "Nie"
endtry
```

Uruchom to. Vim zgłosi błąd `"Exception not caught: Nie`.

Teraz dodaj blok catch:

```shell
try
  echo "Spróbuj"
  throw "Nie"
catch
  echo "Złapano to"
endtry
```

Teraz nie ma już błędu. Powinieneś zobaczyć "Spróbuj" i "Złapano to".

Usuńmy `catch` i dodajmy `finally`:

```shell
try
  echo "Spróbuj"
  throw "Nie"
  echo "Nie zobaczysz mnie"
finally
  echo "Na koniec"
endtry
```

Uruchom to. Teraz Vim wyświetla błąd i "Na koniec".

Złóżmy to wszystko razem:

```shell
try
  echo "Spróbuj"
  throw "Nie"
catch
  echo "Złapano to"
finally
  echo "Na koniec"
endtry
```

Tym razem Vim wyświetla zarówno "Złapano to", jak i "Na koniec". Żaden błąd nie jest wyświetlany, ponieważ Vim go złapał.

Błędy pochodzą z różnych miejsc. Innym źródłem błędu jest wywołanie nieistniejącej funkcji, jak `Nie()` poniżej:

```shell
try
  echo "Spróbuj"
  call Nie()
catch
  echo "Złapano to"
finally
  echo "Na koniec"
endtry
```

Różnica między `catch` a `finally` polega na tym, że `finally` jest zawsze wykonywane, niezależnie od błędu, podczas gdy `catch` jest wykonywane tylko wtedy, gdy twój kod napotka błąd.

Możesz złapać konkretny błąd za pomocą `:catch`. Zgodnie z `:h :catch`:

```shell
catch /^Vim:Interrupt$/.             " złap przerwania (CTRL-C)
catch /^Vim\\%((\\a\\+)\\)\\=:E/.    " złap wszystkie błędy Vim
catch /^Vim\\%((\\a\\+)\\)\\=:/.     " złap błędy i przerwania
catch /^Vim(write):/.                " złap wszystkie błędy w :write
catch /^Vim\\%((\\a\\+)\\)\\=:E123:/ " złap błąd E123
catch /my-exception/.                " złap wyjątek użytkownika
catch /.*/                           " złap wszystko
catch.                               " to samo co /.*/
```

Wewnątrz bloku `try`, przerwanie jest uważane za błąd, który można złapać.

```shell
try
  catch /^Vim:Interrupt$/
  sleep 100
endtry
```

W swoim vimrc, jeśli używasz niestandardowego schematu kolorów, jak [gruvbox](https://github.com/morhetz/gruvbox), i przypadkowo usuniesz katalog schematu kolorów, ale nadal masz linię `colorscheme gruvbox` w swoim vimrc, Vim zgłosi błąd, gdy go `source`. Aby to naprawić, dodałem to do mojego vimrc:

```shell
try
  colorscheme gruvbox
catch
  colorscheme default
endtry
```

Teraz, jeśli `source` vimrc bez katalogu `gruvbox`, Vim użyje `colorscheme default`.

## Ucz się warunków w inteligentny sposób

W poprzednim rozdziale nauczyłeś się podstawowych typów danych w Vim. W tym rozdziale nauczyłeś się, jak je łączyć, aby pisać podstawowe programy z użyciem warunków i pętli. To są podstawowe elementy programowania.

Następnie, nauczmy się o zakresach zmiennych.