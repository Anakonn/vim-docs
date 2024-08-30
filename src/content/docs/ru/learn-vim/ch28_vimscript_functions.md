---
description: В этой главе вы узнаете о функциях в Vimscript, их синтаксисе и правилах
  определения, включая использование заглавных букв и переменных скрипта.
title: Ch28. Vimscript Functions
---

Функции — это средства абстракции, третий элемент в изучении нового языка.

В предыдущих главах вы видели встроенные функции Vimscript (`len()`, `filter()`, `map()` и т.д.) и пользовательские функции в действии. В этой главе вы углубитесь в изучение того, как работают функции.

## Правила синтаксиса функции

В основе своей функция Vimscript имеет следующий синтаксис:

```shell
function {FunctionName}()
  {do-something}
endfunction
```

Определение функции должно начинаться с заглавной буквы. Оно начинается с ключевого слова `function` и заканчивается `endfunction`. Ниже приведена корректная функция:

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

Следующая функция некорректна, так как не начинается с заглавной буквы.

```shell
function tasty()
  echo "Tasty"
endfunction
```

Если вы добавите к функции префикс переменной скрипта (`s:`), вы сможете использовать её с маленькой буквы. `function s:tasty()` — это допустимое имя. Причина, по которой Vim требует использовать имя с заглавной буквы, заключается в том, чтобы избежать путаницы с встроенными функциями Vim (все с маленькой буквы).

Имя функции не может начинаться с цифры. `1Tasty()` — это недопустимое имя функции, но `Tasty1()` — допустимое. Функция также не может содержать неалфавитные символы, кроме `_`. `Tasty-food()`, `Tasty&food()` и `Tasty.food()` — это недопустимые имена функций. `Tasty_food()` *допустимо*.

Если вы определите две функции с одинаковым именем, Vim выдаст ошибку, сообщая, что функция `Tasty` уже существует. Чтобы перезаписать предыдущую функцию с тем же именем, добавьте `!` после ключевого слова `function`.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

## Список доступных функций

Чтобы увидеть все встроенные и пользовательские функции в Vim, вы можете выполнить команду `:function`. Чтобы посмотреть содержимое функции `Tasty`, выполните `:function Tasty`.

Вы также можете искать функции по шаблону с помощью `:function /pattern`, аналогично навигации поиска в Vim (`/pattern`). Чтобы найти все функции, содержащие фразу "map", выполните `:function /map`. Если вы используете внешние плагины, Vim отобразит функции, определенные в этих плагинах.

Если вы хотите узнать, откуда происходит функция, вы можете использовать команду `:verbose` с командой `:function`. Чтобы посмотреть, откуда происходят все функции, содержащие слово "map", выполните:

```shell
:verbose function /map
```

Когда я выполнил это, я получил ряд результатов. Этот сообщает мне, что функция `fzf#vim#maps` — функция автозагрузки (для справки смотрите гл. 23) написана в файле `~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim`, на строке 1263. Это полезно для отладки.

```shell
function fzf#vim#maps(mode, ...)
        Last set from ~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim line 1263
```

## Удаление функции

Чтобы удалить существующую функцию, используйте `:delfunction {Function_name}`. Чтобы удалить `Tasty`, выполните `:delfunction Tasty`.

## Возвращаемое значение функции

Чтобы функция возвращала значение, вам нужно передать ей явное значение `return`. В противном случае Vim автоматически возвращает неявное значение 0.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

Пустой `return` также эквивалентен значению 0.

```shell
function! Tasty()
  echo "Tasty"
  return
endfunction
```

Если вы выполните `:echo Tasty()` с использованием вышеуказанной функции, после того как Vim отобразит "Tasty", он вернет 0, неявное возвращаемое значение. Чтобы сделать так, чтобы `Tasty()` возвращала значение "Tasty", вы можете сделать это:

```shell
function! Tasty()
  return "Tasty"
endfunction
```

Теперь, когда вы выполните `:echo Tasty()`, он вернет строку "Tasty".

Вы можете использовать функцию внутри выражения. Vim будет использовать возвращаемое значение этой функции. Выражение `:echo Tasty() . " Food!"` выводит "Tasty Food!"

## Формальные аргументы

Чтобы передать формальный аргумент `food` вашей функции `Tasty`, вы можете сделать это:

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

echo Tasty("pastry")
" возвращает "Tasty pastry"
```

`a:` — это одна из областей переменных, упомянутых в предыдущей главе. Это переменная формального параметра. Это способ Vim получить значение формального параметра в функции. Без него Vim выдаст ошибку:

```shell
function! Tasty(food)
  return "Tasty " . food
endfunction

echo Tasty("pasta")
" возвращает ошибку "неопределенное имя переменной"
```

## Локальная переменная функции

Давайте рассмотрим другую переменную, которую вы не изучали в предыдущей главе: локальная переменная функции (`l:`).

При написании функции вы можете определить переменную внутри:

```shell
function! Yummy()
  let location = "tummy"
  return "Yummy in my " . location
endfunction

echo Yummy()
" возвращает "Yummy in my tummy"
```

В этом контексте переменная `location` такая же, как `l:location`. Когда вы определяете переменную в функции, эта переменная *локальна* для этой функции. Когда пользователь видит `location`, это может легко быть ошибочно воспринято как глобальная переменная. Я предпочитаю быть более многословным, чем нет, поэтому я предпочитаю добавлять `l:`, чтобы указать, что это переменная функции.

Еще одна причина использовать `l:count` заключается в том, что у Vim есть специальные переменные с псевдонимами, которые выглядят как обычные переменные. `v:count` — один из примеров. У него есть псевдоним `count`. В Vim вызов `count` эквивалентен вызову `v:count`. Легко случайно вызвать одну из этих специальных переменных.

```shell
function! Calories()
  let count = "count"
  return "I do not " . count . " my calories"
endfunction

echo Calories()
" вызывает ошибку
```

Вышеуказанное выполнение вызывает ошибку, потому что `let count = "Count"` неявно пытается переопределить специальную переменную Vim `v:count`. Напомню, что специальные переменные (`v:`) являются только для чтения. Вы не можете их изменять. Чтобы исправить это, используйте `l:count`:

```shell
function! Calories()
  let l:count = "count"
  return "I do not " . l:count . " my calories"
endfunction

echo Calories()
" возвращает "I do not count my calories"
```

## Вызов функции

В Vim есть команда `:call` для вызова функции.

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

call Tasty("gravy")
```

Команда `call` не выводит возвращаемое значение. Давайте вызовем её с помощью `echo`.

```shell
echo call Tasty("gravy")
```

Упс, вы получаете ошибку. Команда `call` выше является командой командной строки (`:call`). Команда `echo` выше также является командой командной строки (`:echo`). Вы не можете вызвать команду командной строки с помощью другой команды командной строки. Давайте попробуем другой вариант команды `call`:

```shell
echo call("Tasty", ["gravy"])
" возвращает "Tasty gravy"
```

Чтобы прояснить любую путаницу, вы только что использовали две разные команды `call`: команду командной строки `:call` и функцию `call()`. Функция `call()` принимает в качестве первого аргумента имя функции (строка) и в качестве второго аргумента формальные параметры (список).

Чтобы узнать больше о `:call` и `call()`, ознакомьтесь с `:h call()` и `:h :call`.

## Значение по умолчанию

Вы можете предоставить параметру функции значение по умолчанию с помощью `=`. Если вы вызовете `Breakfast` только с одним аргументом, аргумент `beverage` будет использовать значение по умолчанию "milk".

```shell
function! Breakfast(meal, beverage = "Milk")
  return "I had " . a:meal . " and " . a:beverage . " for breakfast"
endfunction

echo Breakfast("Hash Browns")
" возвращает I had hash browns and milk for breakfast

echo Breakfast("Cereal", "Orange Juice")
" возвращает I had Cereal and Orange Juice for breakfast
```

## Переменные аргументы

Вы можете передать переменный аргумент с помощью троеточия (`...`). Переменный аргумент полезен, когда вы не знаете, сколько переменных предоставит пользователь.

Предположим, вы создаете шведский стол (вы никогда не узнаете, сколько еды съест ваш клиент):

```shell
function! Buffet(...)
  return a:1
endfunction
```

Если вы выполните `echo Buffet("Noodles")`, он выведет "Noodles". Vim использует `a:1`, чтобы напечатать *первый* аргумент, переданный в `...`, до 20 (`a:1` — это первый аргумент, `a:2` — второй аргумент и т.д.). Если вы выполните `echo Buffet("Noodles", "Sushi")`, он все равно отобразит только "Noodles", давайте обновим это:

```shell
function! Buffet(...)
  return a:1 . " " . a:2
endfunction

echo Buffet("Noodles", "Sushi")
" возвращает "Noodles Sushi"
```

Проблема с этим подходом в том, что если вы теперь выполните `echo Buffet("Noodles")` (с только одной переменной), Vim сообщит, что у него есть неопределенная переменная `a:2`. Как сделать так, чтобы он был достаточно гибким, чтобы отображать именно то, что дает пользователь?

К счастью, у Vim есть специальная переменная `a:0`, чтобы отобразить *количество* аргументов, переданных в `...`.

```shell
function! Buffet(...)
  return a:0
endfunction

echo Buffet("Noodles")
" возвращает 1

echo Buffet("Noodles", "Sushi")
" возвращает 2

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" возвращает 5
```

С этим вы можете итерировать, используя длину аргумента.

```shell
function! Buffet(...)
  let l:food_counter = 1
  let l:foods = ""
  while l:food_counter <= a:0
    let l:foods .= a:{l:food_counter} . " "
    let l:food_counter += 1
  endwhile
  return l:foods
endfunction
```

Фигурные скобки `a:{l:food_counter}` — это интерполяция строки, она использует значение счетчика `food_counter`, чтобы вызвать формальные параметры `a:1`, `a:2`, `a:3` и т.д.

```shell
echo Buffet("Noodles")
" возвращает "Noodles"

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" возвращает все, что вы передали: "Noodles Sushi Ice cream Tofu Mochi"
```

Переменный аргумент имеет еще одну специальную переменную: `a:000`. У нее есть значение всех переменных аргументов в формате списка.

```shell
function! Buffet(...)
  return a:000
endfunction

echo Buffet("Noodles")
" возвращает ["Noodles"]

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" возвращает ["Noodles", "Sushi", "Ice cream", "Tofu", "Mochi"]
```

Давайте перепишем функцию, чтобы использовать цикл `for`:

```shell
function! Buffet(...)
  let l:foods = ""
  for food_item in a:000
    let l:foods .= food_item . " "
  endfor
  return l:foods
endfunction

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" возвращает Noodles Sushi Ice cream Tofu Mochi
```
## Диапазон

Вы можете определить *диапазонную* функцию Vimscript, добавив ключевое слово `range` в конце определения функции. Диапазонная функция имеет две специальные переменные: `a:firstline` и `a:lastline`.

```shell
function! Breakfast() range
  echo a:firstline
  echo a:lastline
endfunction
```

Если вы находитесь на строке 100 и выполните `call Breakfast()`, она отобразит 100 для обеих переменных `firstline` и `lastline`. Если вы визуально выделите (`v`, `V` или `Ctrl-V`) строки с 101 по 105 и выполните `call Breakfast()`, `firstline` отобразит 101, а `lastline` — 105. `firstline` и `lastline` отображают минимальный и максимальный диапазон, в котором вызывается функция.

Вы также можете использовать `:call` и передать ему диапазон. Если вы выполните `:11,20call Breakfast()`, она отобразит 11 для `firstline` и 20 для `lastline`.

Вы можете спросить: "Это здорово, что функция Vimscript принимает диапазон, но разве я не могу получить номер строки с помощью `line(".")`? Разве это не сделает то же самое?"

Хороший вопрос. Если это то, что вы имеете в виду:

```shell
function! Breakfast()
  echo line(".")
endfunction
```

Вызов `:11,20call Breakfast()` выполняет функцию `Breakfast` 10 раз (по одному для каждой строки в диапазоне). Сравните это с передачей аргумента `range`:

```shell
function! Breakfast() range
  echo line(".")
endfunction
```

Вызов `11,20call Breakfast()` выполняет функцию `Breakfast` *один раз*.

Если вы передаете ключевое слово `range` и передаете числовой диапазон (например, `11,20`) в `call`, Vim выполняет эту функцию только один раз. Если вы не передаете ключевое слово `range` и передаете числовой диапазон (например, `11,20`) в `call`, Vim выполняет эту функцию N раз в зависимости от диапазона (в данном случае N = 10).

## Словарь

Вы можете добавить функцию в качестве элемента словаря, добавив ключевое слово `dict` при определении функции.

Если у вас есть функция `SecondBreakfast`, которая возвращает любой элемент `breakfast`, который у вас есть:

```shell
function! SecondBreakfast() dict
  return self.breakfast
endfunction
```

Давайте добавим эту функцию в словарь `meals`:

```shell
let meals = {"breakfast": "pancakes", "second_breakfast": function("SecondBreakfast"), "lunch": "pasta"}

echo meals.second_breakfast()
" возвращает "pancakes"
```

С помощью ключевого слова `dict` переменная ключа `self` ссылается на словарь, в котором хранится функция (в данном случае, словарь `meals`). Выражение `self.breakfast` равно `meals.breakfast`.

Альтернативный способ добавить функцию в объект словаря — использовать пространство имен.

```shell
function! meals.second_lunch()
  return self.lunch
endfunction

echo meals.second_lunch()
" возвращает "pasta"
```

С помощью пространства имен вам не нужно использовать ключевое слово `dict`.

## Funcref

Funcref — это ссылка на функцию. Это один из основных типов данных Vimscript, упомянутых в главе 24.

Выражение `function("SecondBreakfast")` выше является примером funcref. Vim имеет встроенную функцию `function()`, которая возвращает funcref, когда вы передаете ей имя функции (строку).

```shell
function! Breakfast(item)
  return "I am having " . a:item . " for breakfast"
endfunction

let Breakfastify = Breakfast
" возвращает ошибку

let Breakfastify = function("Breakfast")

echo Breakfastify("oatmeal")
" возвращает "I am having oatmeal for breakfast"

echo Breakfastify("pancake")
" возвращает "I am having pancake for breakfast"
```

В Vim, если вы хотите присвоить функцию переменной, вы не можете просто присвоить ее напрямую, как `let MyVar = MyFunc`. Вам нужно использовать функцию `function()`, например, `let MyVar = function("MyFunc")`.

Вы можете использовать funcref с картами и фильтрами. Обратите внимание, что карты и фильтры передадут индекс в качестве первого аргумента и итерационное значение в качестве второго аргумента.

```shell
function! Breakfast(index, item)
  return "I am having " . a:item . " for breakfast"
endfunction

let breakfast_items = ["pancakes", "hash browns", "waffles"]
let first_meals = map(breakfast_items, function("Breakfast"))

for meal in first_meals
  echo meal
endfor
```

## Лямбда

Лучший способ использовать функции в картах и фильтрах — использовать лямбда-выражение (иногда известное как безымянная функция). Например:

```shell
let Plus = {x,y -> x + y}
echo Plus(1,2)
" возвращает 3

let Tasty = { -> 'tasty'}
echo Tasty()
" возвращает "tasty"
```

Вы можете вызывать функцию изнутри лямбда-выражения:

```shell
function! Lunch(item)
  return "I am having " . a:item . " for lunch"
endfunction

let lunch_items = ["sushi", "ramen", "sashimi"]

let day_meals = map(lunch_items, {index, item -> Lunch(item)})

for meal in day_meals
  echo meal
endfor
```

Если вы не хотите вызывать функцию изнутри лямбда, вы можете рефакторить ее:

```shell
let day_meals = map(lunch_items, {index, item -> "I am having " . item . " for lunch"})
```

## Цепочка методов

Вы можете последовательно связывать несколько функций Vimscript и лямбда-выражений с помощью `->`. Имейте в виду, что `->` должно следовать за именем метода *без пробела*.

```shell
Source->Method1()->Method2()->...->MethodN()
```

Чтобы преобразовать число с плавающей запятой в целое число с использованием цепочки методов:

```shell
echo 3.14->float2nr()
" возвращает 3
```

Давайте сделаем более сложный пример. Предположим, что вам нужно сделать заглавной первую букву каждого элемента в списке, затем отсортировать список, а затем объединить список в строку.

```shell
function! Capitalizer(word)
  return substitute(a:word, "\^\.", "\\u&", "g")
endfunction

function! CapitalizeList(word_list)
  return map(a:word_list, {index, word -> Capitalizer(word)})
endfunction

let dinner_items = ["bruschetta", "antipasto", "calzone"]

echo dinner_items->CapitalizeList()->sort()->join(", ")
" возвращает "Antipasto, Bruschetta, Calzone"
```

С помощью цепочки методов последовательность более легко читается и понимается. Я могу просто взглянуть на `dinner_items->CapitalizeList()->sort()->join(", ")` и точно знать, что происходит.

## Замыкание

Когда вы определяете переменную внутри функции, эта переменная существует в пределах этой функции. Это называется лексической областью видимости.

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch()
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

`appetizer` определяется внутри функции `Lunch`, которая возвращает funcref `SecondLunch`. Обратите внимание, что `SecondLunch` использует `appetizer`, но в Vimscript у нее нет доступа к этой переменной. Если вы попытаетесь выполнить `echo Lunch()()`, Vim выдаст ошибку неопределенной переменной.

Чтобы исправить эту проблему, используйте ключевое слово `closure`. Давайте рефакторим:

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch() closure
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

Теперь, если вы выполните `echo Lunch()()`, Vim вернет "shrimp".

## Изучите функции Vimscript умным способом

В этой главе вы узнали анатомию функции Vim. Вы узнали, как использовать различные специальные ключевые слова `range`, `dict` и `closure`, чтобы изменить поведение функции. Вы также узнали, как использовать лямбда-выражения и связывать несколько функций вместе. Функции являются важными инструментами для создания сложных абстракций.

Теперь давайте объединим все, что вы узнали, чтобы создать свой собственный плагин.