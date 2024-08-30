---
description: W tym rozdziale poznasz podstawowe typy danych w Vimscript, w tym liczby,
  ciągi, listy i słowniki, oraz jak korzystać z trybu Ex do eksperymentowania.
title: Ch25. Vimscript Basic Data Types
---

W następnych kilku rozdziałach nauczysz się o Vimscript, wbudowanym języku programowania Vima.

Podczas nauki nowego języka, istnieją trzy podstawowe elementy, na które warto zwrócić uwagę:
- Prymitywy
- Środki kombinacji
- Środki abstrakcji

W tym rozdziale nauczysz się prymitywnych typów danych Vima.

## Typy danych

Vim ma 10 różnych typów danych:
- Liczba
- Float
- String
- Lista
- Słownik
- Specjalny
- Funcref
- Praca
- Kanał
- Blob

Omówię tutaj pierwsze sześć typów danych. W rozdziale 27 nauczysz się o Funcref. Aby uzyskać więcej informacji na temat typów danych Vima, sprawdź `:h variables`.

## Śledzenie w trybie Ex

Vim technicznie nie ma wbudowanego REPL, ale ma tryb, tryb Ex, który można używać jak REPL. Możesz przejść do trybu Ex za pomocą `Q` lub `gQ`. Tryb Ex jest jak rozszerzony tryb wiersza poleceń (to tak, jakby nieprzerwanie wpisywać polecenia w trybie wiersza poleceń). Aby wyjść z trybu Ex, wpisz `:visual`.

Możesz używać zarówno `:echo`, jak i `:echom` w tym rozdziale oraz kolejnych rozdziałach Vimscript, aby kodować równolegle. Są one jak `console.log` w JS lub `print` w Pythonie. Polecenie `:echo` drukuje wyrażenie, które podajesz. Polecenie `:echom` robi to samo, ale dodatkowo zapisuje wynik w historii wiadomości.

```viml
:echom "hello echo message"
```

Możesz zobaczyć historię wiadomości za pomocą:

```shell
:messages
```

Aby wyczyścić historię wiadomości, uruchom:

```shell
:messages clear
```

## Liczba

Vim ma 4 różne typy liczb: dziesiętny, szesnastkowy, binarny i ósemkowy. Przy okazji, gdy mówię o typie danych liczbowych, często oznacza to typ danych całkowitych. W tym przewodniku będę używał terminów liczba i całkowita zamiennie.

### Dziesiętny

Powinieneś być zaznajomiony z systemem dziesiętnym. Vim akceptuje dodatnie i ujemne liczby dziesiętne. 1, -1, 10, itd. W programowaniu Vimscript prawdopodobnie będziesz najczęściej używać typu dziesiętnego.

### Szesnastkowy

Liczby szesnastkowe zaczynają się od `0x` lub `0X`. Mnemonik: He**x**adecymalny.

### Binarny

Liczby binarne zaczynają się od `0b` lub `0B`. Mnemonik: **B**inarny.

### Ósemkowy

Liczby ósemkowe zaczynają się od `0`, `0o` i `0O`. Mnemonik: **O**semkowy.

### Drukowanie liczb

Jeśli `echo` liczby szesnastkowej, binarnej lub ósemkowej, Vim automatycznie konwertuje je na liczby dziesiętne.

```viml
:echo 42
" zwraca 42

:echo 052
" zwraca 42

:echo 0b101010
" zwraca 42

:echo 0x2A
" zwraca 42
```

### Prawdziwe i fałszywe

W Vimie wartość 0 jest fałszywa, a wszystkie wartości różne od 0 są prawdziwe.

Poniższe nie wyświetli nic.

```viml
:if 0
:  echo "Nie"
:endif
```

Jednak to wyświetli:

```viml
:if 1
:  echo "Tak"
:endif
```

Wszystkie wartości inne niż 0 są prawdziwe, w tym liczby ujemne. 100 jest prawdziwe. -1 jest prawdziwe.

### Aritmetyka liczb

Liczby mogą być używane do wykonywania wyrażeń arytmetycznych:

```viml
:echo 3 + 1
" zwraca 4

: echo 5 - 3
" zwraca 2

:echo 2 * 2
" zwraca 4

:echo 4 / 2
" zwraca 2
```

Podczas dzielenia liczby z resztą, Vim pomija resztę.

```viml
:echo 5 / 2
" zwraca 2 zamiast 2.5
```

Aby uzyskać dokładniejszy wynik, musisz użyć liczby zmiennoprzecinkowej.

## Float

Liczby zmiennoprzecinkowe to liczby z cyframi po przecinku. Istnieją dwa sposoby reprezentacji liczb zmiennoprzecinkowych: notacja kropkowa (jak 31.4) i wykładnik (3.14e01). Podobnie jak w przypadku liczb, możesz używać znaków dodatnich i ujemnych:

```viml
:echo +123.4
" zwraca 123.4

:echo -1.234e2
" zwraca -123.4

:echo 0.25
" zwraca 0.25

:echo 2.5e-1
" zwraca 0.25
```

Musisz podać float z kropką i cyframi po niej. `25e-2` (bez kropki) i `1234.` (ma kropkę, ale nie ma cyfr po niej) są obydwoma nieprawidłowymi liczbami zmiennoprzecinkowymi.

### Aritmetyka float

Podczas wykonywania wyrażenia arytmetycznego między liczbą a float, Vim przekształca wynik na float.

```viml
:echo 5 / 2.0
" zwraca 2.5
```

Aritmetyka float i float daje ci inny float.

```shell
:echo 1.0 + 1.0
" zwraca 2.0
```

## String

Stringi to znaki otoczone albo podwójnymi cudzysłowami (`""`), albo pojedynczymi cudzysłowami (`''`). "Hello", "123" i '123.4' to przykłady stringów.

### Konkatenacja stringów

Aby połączyć string w Vimie, użyj operatora `.`.

```viml
:echo "Hello" . " world"
" zwraca "Hello world"
```

### Aritmetyka stringów

Gdy używasz operatorów arytmetycznych (`+ - * /`) z liczbą i stringiem, Vim przekształca string w liczbę.

```viml
:echo "12 donuts" + 3
" zwraca 15
```

Gdy Vim widzi "12 donuts", wyodrębnia 12 ze stringa i konwertuje go na liczbę 12. Następnie wykonuje dodawanie, zwracając 15. Aby ta konwersja string-na-liczbę zadziałała, znak liczbowy musi być *pierwszym znakiem* w stringu.

Poniższe nie zadziała, ponieważ 12 nie jest pierwszym znakiem w stringu:

```viml
:echo "donuts 12" + 3
" zwraca 3
```

To również nie zadziała, ponieważ pusty znak jest pierwszym znakiem stringu:

```viml
:echo " 12 donuts" + 3
" zwraca 3
```

Ta konwersja działa nawet z dwoma stringami:

```shell
:echo "12 donuts" + "6 pastries"
" zwraca 18
```

To działa z każdym operatorem arytmetycznym, nie tylko `+`:

```viml
:echo "12 donuts" * "5 boxes"
" zwraca 60

:echo "12 donuts" - 5
" zwraca 7

:echo "12 donuts" / "3 people"
" zwraca 4
```

Sprytnym trikiem, aby wymusić konwersję string-na-liczbę, jest po prostu dodanie 0 lub pomnożenie przez 1:

```viml
:echo "12" + 0
" zwraca 12

:echo "12" * 1
" zwraca 12
```

Gdy arytmetyka jest wykonywana w stosunku do float w stringu, Vim traktuje to jak liczbę całkowitą, a nie float:

```shell
:echo "12.0 donuts" + 12
" zwraca 24, a nie 24.0
```

### Konkatenacja liczby i stringu

Możesz przekształcić liczbę w string za pomocą operatora kropki (`.`):

```viml
:echo 12 . "donuts"
" zwraca "12donuts"
```

Konwersja działa tylko z typem danych liczbowych, a nie float. To nie zadziała:

```shell
:echo 12.0 . "donuts"
" nie zwraca "12.0donuts", ale zgłasza błąd
```

### Warunki stringów

Przypomnij, że 0 jest fałszywe, a wszystkie liczby różne od 0 są prawdziwe. To również prawda, gdy używasz stringów jako warunków.

W poniższym if statement, Vim przekształca "12donuts" w 12, co jest prawdziwe:

```viml
:if "12donuts"
:  echo "Pycha"
:endif
" zwraca "Pycha"
```

Z drugiej strony, to jest fałszywe:

```viml
:if "donuts12"
:  echo "Nie"
:endif
" nie zwraca nic
```

Vim przekształca "donuts12" w 0, ponieważ pierwszy znak nie jest liczbą.

### Podwójne vs pojedyncze cudzysłowy

Podwójne cudzysłowy zachowują się inaczej niż pojedyncze cudzysłowy. Pojedyncze cudzysłowy wyświetlają znaki dosłownie, podczas gdy podwójne cudzysłowy akceptują znaki specjalne.

Czym są znaki specjalne? Sprawdź wyświetlanie nowej linii i podwójnych cudzysłowów:

```viml
:echo "hello\nworld"
" zwraca
" hello
" world

:echo "hello \"world\""
" zwraca "hello "world""
```

Porównaj to z pojedynczymi cudzysłowami:

```shell
:echo 'hello\nworld'
" zwraca 'hello\nworld'

:echo 'hello \"world\"'
" zwraca 'hello \"world\"'
```

Znaki specjalne to specjalne znaki stringów, które po ucieczce zachowują się inaczej. `\n` działa jak nowa linia. `\"` zachowuje się jak dosłowny `"`. Aby uzyskać listę innych znaków specjalnych, sprawdź `:h expr-quote`.

### Procedury stringów

Przyjrzyjmy się kilku wbudowanym procedurom stringów.

Możesz uzyskać długość stringa za pomocą `strlen()`.

```shell
:echo strlen("choco")
" zwraca 5
```

Możesz przekształcić string w liczbę za pomocą `str2nr()`:

```shell
:echo str2nr("12donuts")
" zwraca 12

:echo str2nr("donuts12")
" zwraca 0
```

Podobnie jak wcześniejsza konwersja string-na-liczbę, jeśli liczba nie jest pierwszym znakiem, Vim tego nie uchwyci.

Dobrą wiadomością jest to, że Vim ma metodę, która przekształca string w float, `str2float()`:

```shell
:echo str2float("12.5donuts")
" zwraca 12.5
```

Możesz zastąpić wzór w stringu za pomocą metody `substitute()`:

```shell
:echo substitute("sweet", "e", "o", "g")
" zwraca "swoot"
```

Ostatni parametr, "g", to flaga globalna. Dzięki niej Vim zastąpi wszystkie pasujące wystąpienia. Bez niej Vim zastąpi tylko pierwsze dopasowanie.

```shell
:echo substitute("sweet", "e", "o", "")
" zwraca "swoet"
```

Polecenie substitute można połączyć z `getline()`. Przypomnij, że funkcja `getline()` pobiera tekst na podanym numerze linii. Załóżmy, że masz tekst "chocolate donut" w linii 5. Możesz użyć procedury:

```shell
:echo substitute(getline(5), "chocolate", "glazed", "g")
" zwraca glazed donut
```

Jest wiele innych procedur stringów. Sprawdź `:h string-functions`.

## Lista

Lista Vimscript jest jak tablica w Javascript lub lista w Pythonie. Jest to *uporządkowana* sekwencja elementów. Możesz mieszać i dopasowywać zawartość z różnymi typami danych:

```shell
[1,2,3]
['a', 'b', 'c']
[1,'a', 3.14]
[1,2,[3,4]]
```

### Podlisty

Lista Vim jest indeksowana od zera. Możesz uzyskać dostęp do konkretnego elementu w liście za pomocą `[n]`, gdzie n to indeks.

```shell
:echo ["a", "sweet", "dessert"][0]
" zwraca "a"

:echo ["a", "sweet", "dessert"][2]
" zwraca "dessert"
```

Jeśli przekroczysz maksymalny numer indeksu, Vim zgłosi błąd mówiący, że indeks jest poza zakresem:

```shell
:echo ["a", "sweet", "dessert"][999]
" zwraca błąd
```

Gdy przejdziesz poniżej zera, Vim zacznie indeksować od ostatniego elementu. Przekroczenie minimalnego numeru indeksu również zgłosi błąd:

```shell
:echo ["a", "sweet", "dessert"][-1]
" zwraca "dessert"

:echo ["a", "sweet", "dessert"][-3]
" zwraca "a"

:echo ["a", "sweet", "dessert"][-999]
" zwraca błąd
```

Możesz "pokroić" kilka elementów z listy za pomocą `[n:m]`, gdzie `n` to indeks początkowy, a `m` to indeks końcowy.

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:4]
" zwraca ["plain", "strawberry", "lemon"]
```

Jeśli nie przekażesz `m` (`[n:]`), Vim zwróci pozostałe elementy zaczynając od n-tego elementu. Jeśli nie przekażesz `n` (`[:m]`), Vim zwróci pierwszy element aż do m-tego elementu.

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:]
" zwraca ['plain', 'strawberry', 'lemon', 'sugar', 'cream']

:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][:4]
" zwraca ['chocolate', 'glazed', 'plain', 'strawberry', 'lemon']
```

Możesz przekazać indeks, który przekracza maksymalną liczbę elementów podczas krojenia tablicy.

```viml
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:999]
" zwraca ['plain', 'strawberry', 'lemon', 'sugar', 'cream']
```
### Slicing String

Możesz kroić i celować w ciągi tak jak w listy:

```viml
:echo "choco"[0]
" zwraca "c"

:echo "choco"[1:3]
" zwraca "hoc"

:echo "choco"[:3]
" zwraca choc

:echo "choco"[1:]
" zwraca hoco
```

### List Arithmetic

Możesz użyć `+` do konkatenacji i modyfikacji listy:

```viml
:let sweetList = ["chocolate", "strawberry"]
:let sweetList += ["sugar"]
:echo sweetList
" zwraca ["chocolate", "strawberry", "sugar"]
```

### List Functions

Zbadajmy wbudowane funkcje list w Vimie.

Aby uzyskać długość listy, użyj `len()`:

```shell
:echo len(["chocolate", "strawberry"])
" zwraca 2
```

Aby dodać element na początku listy, możesz użyć `insert()`:

```shell
:let sweetList = ["chocolate", "strawberry"]
:call insert(sweetList, "glazed")

:echo sweetList
" zwraca ["glazed", "chocolate", "strawberry"]
```

Możesz również przekazać `insert()` indeks, w którym chcesz dodać element. Jeśli chcesz dodać element przed drugim elementem (indeks 1):

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call insert(sweeterList, "cream", 1)

:echo sweeterList
" zwraca ['glazed', 'cream', 'chocolate', 'strawberry']
```

Aby usunąć element z listy, użyj `remove()`. Akceptuje listę i indeks elementu, który chcesz usunąć.

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call remove(sweeterList, 1)

:echo sweeterList
" zwraca ['glazed', 'strawberry']
```

Możesz użyć `map()` i `filter()` na liście. Aby odfiltrować elementy zawierające frazę "choco":

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call filter(sweeterList, 'v:val !~ "choco"')
:echo sweeterList
" zwraca ["glazed", "strawberry"]

:let sweetestList = ["chocolate", "glazed", "sugar"]
:call map(sweetestList, 'v:val . " donut"')
:echo sweetestList
" zwraca ['chocolate donut', 'glazed donut', 'sugar donut']
```

Zmienna `v:val` jest specjalną zmienną Vima. Jest dostępna podczas iteracji po liście lub słowniku za pomocą `map()` lub `filter()`. Reprezentuje każdy iterowany element.

Aby uzyskać więcej informacji, sprawdź `:h list-functions`.

### List Unpacking

Możesz rozpakować listę i przypisać zmienne do elementów listy:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let [flavor1, flavor2, flavor3] = favoriteFlavor

:echo flavor1
" zwraca "chocolate"

:echo flavor2
" zwraca "glazed"
```

Aby przypisać pozostałe elementy listy, możesz użyć `;` po którym następuje nazwa zmiennej:

```shell
:let favoriteFruits = ["apple", "banana", "lemon", "blueberry", "raspberry"]
:let [fruit1, fruit2; restFruits] = favoriteFruits

:echo fruit1
" zwraca "apple"

:echo restFruits
" zwraca ['lemon', 'blueberry', 'raspberry']
```

### Modifying List

Możesz bezpośrednio modyfikować element listy:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[0] = "sugar"
:echo favoriteFlavor
" zwraca ['sugar', 'glazed', 'plain']
```

Możesz modyfikować wiele elementów listy bezpośrednio:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[2:] = ["strawberry", "chocolate"]
:echo favoriteFlavor
" zwraca ['chocolate', 'glazed', 'strawberry', 'chocolate']
```

## Dictionary

Słownik Vimscript to asocjacyjna, nieuporządkowana lista. Niepusty słownik składa się z co najmniej jednej pary klucz-wartość.

```shell
{"breakfast": "waffles", "lunch": "pancakes"}
{"meal": ["breakfast", "second breakfast", "third breakfast"]}
{"dinner": 1, "dessert": 2}
```

Obiekt danych słownika Vim używa ciągu jako klucza. Jeśli spróbujesz użyć liczby, Vim przekształci ją w ciąg.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}

:echo breakfastNo
" zwraca {'1': '7am', '2': '9am', '11ses': '11am'}
```

Jeśli jesteś zbyt leniwy, aby umieszczać cudzysłowy wokół każdego klucza, możesz użyć notacji `#{}`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo mealPlans
" zwraca {'lunch': 'pancakes', 'breakfast': 'waffles', 'dinner': 'donuts'}
```

Jedynym wymogiem użycia składni `#{}` jest to, że każdy klucz musi być:

- znakiem ASCII.
- cyfrą.
- podkreśleniem (`_`).
- myślnikiem (`-`).

Podobnie jak w przypadku listy, możesz używać dowolnego typu danych jako wartości.

```shell
:let mealPlan = {"breakfast": ["pancake", "waffle", "hash brown"], "lunch": WhatsForLunch(), "dinner": {"appetizer": "gruel", "entree": "more gruel"}}
```

### Accessing Dictionary

Aby uzyskać dostęp do wartości w słowniku, możesz wywołać klucz za pomocą nawiasów kwadratowych (`['key']`) lub notacji kropkowej (`.key`).

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches", "dinner": "more gruel"}

:let breakfast = meal['breakfast']
:let lunch = meal.lunch

:echo breakfast
" zwraca "gruel omelettes"

:echo lunch
" zwraca "gruel sandwiches"
```

### Modifying Dictionary

Możesz modyfikować lub nawet dodawać zawartość słownika:

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches"}

:let meal.breakfast = "breakfast tacos"
:let meal["lunch"] = "tacos al pastor"
:let meal["dinner"] = "quesadillas"

:echo meal
" zwraca {'lunch': 'tacos al pastor', 'breakfast': 'breakfast tacos', 'dinner': 'quesadillas'}
```

### Dictionary Functions

Zbadajmy niektóre z wbudowanych funkcji Vima do obsługi słowników.

Aby sprawdzić długość słownika, użyj `len()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo len(mealPlans)
" zwraca 3
```

Aby sprawdzić, czy słownik zawiera określony klucz, użyj `has_key()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo has_key(mealPlans, "breakfast")
" zwraca 1

:echo has_key(mealPlans, "dessert")
" zwraca 0
```

Aby sprawdzić, czy słownik ma jakikolwiek element, użyj `empty()`. Procedura `empty()` działa ze wszystkimi typami danych: listą, słownikiem, ciągiem, liczbą, zmiennoprzecinkową itp.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:let noMealPlan = {}

:echo empty(noMealPlan)
" zwraca 1

:echo empty(mealPlans)
" zwraca 0
```

Aby usunąć wpis ze słownika, użyj `remove()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo "usuwanie śniadania: " . remove(mealPlans, "breakfast")
" zwraca "usuwanie śniadania: 'waffles'"

:echo mealPlans
" zwraca {'lunch': 'pancakes', 'dinner': 'donuts'}
```

Aby przekonwertować słownik na listę list, użyj `items()`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo items(mealPlans)
" zwraca [['lunch', 'pancakes'], ['breakfast', 'waffles'], ['dinner', 'donuts']]
```

`filter()` i `map()` są również dostępne.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}
:call filter(breakfastNo, 'v:key > 1')

:echo breakfastNo
" zwraca {'2': '9am', '11ses': '11am'}
```

Ponieważ słownik zawiera pary klucz-wartość, Vim udostępnia specjalną zmienną `v:key`, która działa podobnie do `v:val`. Podczas iteracji przez słownik `v:key` będzie przechowywać wartość aktualnie iterowanego klucza.

Jeśli masz słownik `mealPlans`, możesz go mapować za pomocą `v:key`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:key . " and milk"')

:echo mealPlans
" zwraca {'lunch': 'lunch and milk', 'breakfast': 'breakfast and milk', 'dinner': 'dinner and milk'}
```

Podobnie, możesz mapować go za pomocą `v:val`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:val . " and milk"')

:echo mealPlans
" zwraca {'lunch': 'pancakes and milk', 'breakfast': 'waffles and milk', 'dinner': 'donuts and milk'}
```

Aby zobaczyć więcej funkcji słowników, sprawdź `:h dict-functions`.

## Special Primitives

Vim ma specjalne prymitywy:

- `v:false`
- `v:true`
- `v:none`
- `v:null`

Przy okazji, `v:` to wbudowana zmienna Vima. Zostaną one omówione bardziej szczegółowo w późniejszym rozdziale.

Z mojego doświadczenia, rzadko będziesz używać tych specjalnych prymitywów. Jeśli potrzebujesz wartości prawdziwej/fałszywej, możesz po prostu użyć 0 (fałszywe) i różne od 0 (prawdziwe). Jeśli potrzebujesz pustego ciągu, po prostu użyj `""`. Ale warto to wiedzieć, więc szybko je omówmy.

### True

To jest równoważne `true`. Jest równoważne liczbie o wartości różnej od 0. Podczas dekodowania json za pomocą `json_encode()` jest interpretowane jako "true".

```shell
:echo json_encode({"test": v:true})
" zwraca {"test": true}
```

### False

To jest równoważne `false`. Jest równoważne liczbie o wartości 0. Podczas dekodowania json za pomocą `json_encode()` jest interpretowane jako "false".

```shell
:echo json_encode({"test": v:false})
" zwraca {"test": false}
```

### None

Jest równoważne pustemu ciągowi. Podczas dekodowania json za pomocą `json_encode()` jest interpretowane jako pusty element (`null`).

```shell
:echo json_encode({"test": v:none})
" zwraca {"test": null}
```

### Null

Podobnie jak `v:none`.

```shell
:echo json_encode({"test": v:null})
" zwraca {"test": null}
```

## Learn Data Types the Smart Way

W tym rozdziale nauczyłeś się o podstawowych typach danych Vimscript: liczba, zmiennoprzecinkowa, ciąg, lista, słownik i specjalne. Nauka tych typów to pierwszy krok do rozpoczęcia programowania w Vimscript.

W następnym rozdziale nauczysz się, jak je łączyć, aby pisać wyrażenia takie jak równości, warunki i pętle.