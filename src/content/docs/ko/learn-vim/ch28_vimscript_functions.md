---
description: 이 문서는 Vimscript 함수의 구문 규칙과 사용 방법을 설명하며, 함수 정의의 중요성을 강조합니다.
title: Ch28. Vimscript Functions
---

함수는 추상의 수단으로, 새로운 언어를 배우는 데 있어 세 번째 요소입니다.

이전 장에서는 Vimscript 기본 함수(`len()`, `filter()`, `map()` 등)와 사용자 정의 함수의 작동을 보았습니다. 이번 장에서는 함수가 어떻게 작동하는지 더 깊이 배워보겠습니다.

## 함수 문법 규칙

Vimscript 함수의 핵심 문법은 다음과 같습니다:

```shell
function {FunctionName}()
  {do-something}
endfunction
```

함수 정의는 대문자로 시작해야 합니다. `function` 키워드로 시작하고 `endfunction`으로 끝납니다. 아래는 유효한 함수입니다:

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

다음은 대문자로 시작하지 않기 때문에 유효하지 않은 함수입니다.

```shell
function tasty()
  echo "Tasty"
endfunction
```

함수 앞에 스크립트 변수를 붙이면 소문자로 사용할 수 있습니다. `function s:tasty()`는 유효한 이름입니다. Vim이 대문자 이름을 사용하도록 요구하는 이유는 Vim의 내장 함수(모두 소문자)와의 혼동을 방지하기 위해서입니다.

함수 이름은 숫자로 시작할 수 없습니다. `1Tasty()`는 유효하지 않은 함수 이름이지만 `Tasty1()`은 유효합니다. 함수는 `_`를 제외한 비알파벳 문자를 포함할 수 없습니다. `Tasty-food()`, `Tasty&food()`, 및 `Tasty.food()`는 유효하지 않은 함수 이름입니다. `Tasty_food()`는 유효합니다.

같은 이름의 두 개의 함수를 정의하면 Vim은 `Tasty` 함수가 이미 존재한다고 오류를 발생시킵니다. 같은 이름의 이전 함수를 덮어쓰려면 `function` 키워드 뒤에 `!`를 추가하십시오.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

## 사용 가능한 함수 나열

Vim의 모든 내장 및 사용자 정의 함수를 보려면 `:function` 명령을 실행할 수 있습니다. `Tasty` 함수의 내용을 보려면 `:function Tasty`를 실행하십시오.

`:function /pattern`을 사용하여 패턴으로 함수를 검색할 수도 있습니다. 이는 Vim의 검색 탐색(` /pattern`)과 유사합니다. "map"이라는 구문이 포함된 모든 함수를 검색하려면 `:function /map`을 실행하십시오. 외부 플러그인을 사용하는 경우 Vim은 해당 플러그인에서 정의된 함수를 표시합니다.

함수가 어디에서 유래했는지 보려면 `:function` 명령과 함께 `:verbose` 명령을 사용할 수 있습니다. "map"이라는 단어가 포함된 모든 함수의 출처를 보려면 다음을 실행하십시오:

```shell
:verbose function /map
```

내가 실행했을 때, 여러 결과가 나왔습니다. 이 중 하나는 `fzf#vim#maps` 자동 로드 함수(복습을 위해 23장을 참조)가 `~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim` 파일의 1263번째 줄에 작성되어 있다는 것을 알려줍니다. 이는 디버깅에 유용합니다.

```shell
function fzf#vim#maps(mode, ...)
        Last set from ~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim line 1263
```

## 함수 제거

기존 함수를 제거하려면 `:delfunction {Function_name}`을 사용하십시오. `Tasty`를 삭제하려면 `:delfunction Tasty`를 실행하십시오.

## 함수 반환 값

함수가 값을 반환하려면 명시적인 `return` 값을 전달해야 합니다. 그렇지 않으면 Vim은 자동으로 암시적 값 0을 반환합니다.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

빈 `return`도 0 값과 동일합니다.

```shell
function! Tasty()
  echo "Tasty"
  return
endfunction
```

위의 함수를 사용하여 `:echo Tasty()`를 실행하면 Vim이 "Tasty"를 표시한 후 암시적 반환 값인 0을 반환합니다. `Tasty()`가 "Tasty" 값을 반환하도록 하려면 다음과 같이 할 수 있습니다:

```shell
function! Tasty()
  return "Tasty"
endfunction
```

이제 `:echo Tasty()`를 실행하면 "Tasty" 문자열을 반환합니다.

함수 내부에서 표현식을 사용할 수 있습니다. Vim은 해당 함수의 반환 값을 사용합니다. 표현식 `:echo Tasty() . " Food!"`는 "Tasty Food!"를 출력합니다.

## 형식 인수

형식 인수 `food`를 `Tasty` 함수에 전달하려면 다음과 같이 할 수 있습니다:

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

echo Tasty("pastry")
" returns "Tasty pastry"
```

`a:`는 지난 장에서 언급한 변수 범위 중 하나입니다. 이는 형식 매개변수 변수입니다. Vim이 함수에서 형식 매개변수 값을 가져오는 방법입니다. 이를 사용하지 않으면 Vim은 오류를 발생시킵니다:

```shell
function! Tasty(food)
  return "Tasty " . food
endfunction

echo Tasty("pasta")
" returns "undefined variable name" error
```

## 함수 지역 변수

이제 이전 장에서 배우지 않은 다른 변수인 함수 지역 변수(`l:`)에 대해 다루겠습니다.

함수를 작성할 때 내부에 변수를 정의할 수 있습니다:

```shell
function! Yummy()
  let location = "tummy"
  return "Yummy in my " . location
endfunction

echo Yummy()
" returns "Yummy in my tummy"
```

이 문맥에서 변수 `location`은 `l:location`과 동일합니다. 함수 내에서 변수를 정의하면 해당 변수는 *지역* 변수입니다. 사용자가 `location`을 보면 쉽게 전역 변수로 오해할 수 있습니다. 나는 더 명확하게 표현하는 것을 선호하므로 `l:`를 붙여서 이것이 함수 변수임을 나타내는 것을 선호합니다.

`l:count`를 사용하는 또 다른 이유는 Vim에 일반 변수처럼 보이는 별도의 특수 변수가 있기 때문입니다. `v:count`가 그 예입니다. `count`의 별칭을 가지고 있습니다. Vim에서 `count`를 호출하는 것은 `v:count`를 호출하는 것과 동일합니다. 이러한 특수 변수를 실수로 호출하기 쉽습니다.

```shell
function! Calories()
  let count = "count"
  return "I do not " . count . " my calories"
endfunction

echo Calories()
" throws an error
```

위의 실행은 오류를 발생시킵니다. 왜냐하면 `let count = "Count"`가 암시적으로 Vim의 특수 변수 `v:count`를 재정의하려고 시도하기 때문입니다. 특수 변수(`v:`)는 읽기 전용입니다. 이를 변경할 수 없습니다. 이를 수정하려면 `l:count`를 사용하십시오:

```shell
function! Calories()
  let l:count = "count"
  return "I do not " . l:count . " my calories"
endfunction

echo Calories()
" returns "I do not count my calories"
```

## 함수 호출

Vim에는 함수를 호출하기 위한 `:call` 명령이 있습니다.

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

call Tasty("gravy")
```

`call` 명령은 반환 값을 출력하지 않습니다. `echo`로 호출해 보겠습니다.

```shell
echo call Tasty("gravy")
```

이런, 오류가 발생합니다. 위의 `call` 명령은 명령줄 명령(`:call`)입니다. 위의 `echo` 명령도 명령줄 명령(`:echo`)입니다. 명령줄 명령을 다른 명령줄 명령으로 호출할 수 없습니다. `call` 명령의 다른 형태를 시도해 보겠습니다:

```shell
echo call("Tasty", ["gravy"])
" returns "Tasty gravy"
```

혼동을 피하기 위해, 두 가지 다른 `call` 명령을 사용했습니다: `:call` 명령줄 명령과 `call()` 함수입니다. `call()` 함수는 첫 번째 인수로 함수 이름(문자열)을, 두 번째 인수로 형식 매개변수(리스트)를 받습니다.

`:call` 및 `call()`에 대해 더 알아보려면 `:h call()` 및 `:h :call`을 확인하십시오.

## 기본 인수

함수 매개변수에 기본값을 제공하려면 `=`를 사용하십시오. `Breakfast`를 하나의 인수로만 호출하면 `beverage` 인수는 "milk" 기본값을 사용합니다.

```shell
function! Breakfast(meal, beverage = "Milk")
  return "I had " . a:meal . " and " . a:beverage . " for breakfast"
endfunction

echo Breakfast("Hash Browns")
" returns I had hash browns and milk for breakfast

echo Breakfast("Cereal", "Orange Juice")
" returns I had Cereal and Orange Juice for breakfast
```

## 가변 인수

세 개의 점(`...`)으로 가변 인수를 전달할 수 있습니다. 가변 인수는 사용자가 제공할 변수의 수를 모를 때 유용합니다.

모든 것을 마음껏 먹을 수 있는 뷔페를 만들고 있다고 가정해 보십시오(고객이 얼마나 많은 음식을 먹을지 절대 알 수 없습니다):

```shell
function! Buffet(...)
  return a:1
endfunction
```

`echo Buffet("Noodles")`를 실행하면 "Noodles"가 출력됩니다. Vim은 `...`에 전달된 첫 번째 인수를 출력하기 위해 `a:1`을 사용합니다(최대 20개, `a:1`은 첫 번째 인수, `a:2`는 두 번째 인수 등). `echo Buffet("Noodles", "Sushi")`를 실행하면 여전히 "Noodles"만 표시됩니다. 이를 업데이트해 보겠습니다:

```shell
function! Buffet(...)
  return a:1 . " " . a:2
endfunction

echo Buffet("Noodles", "Sushi")
" returns "Noodles Sushi"
```

이 접근 방식의 문제는 이제 `echo Buffet("Noodles")`(하나의 변수만 있는 경우)를 실행하면 Vim이 정의되지 않은 변수 `a:2`에 대해 불평합니다. 사용자가 제공한 내용을 정확히 표시할 수 있도록 유연하게 만들려면 어떻게 해야 할까요?

다행히도 Vim에는 `...`에 전달된 인수의 *수*를 표시하는 특수 변수 `a:0`이 있습니다.

```shell
function! Buffet(...)
  return a:0
endfunction

echo Buffet("Noodles")
" returns 1

echo Buffet("Noodles", "Sushi")
" returns 2

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returns 5
```

이를 통해 인수의 길이를 사용하여 반복할 수 있습니다.

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

중괄호 `a:{l:food_counter}`는 문자열 보간으로, `food_counter` 카운터의 값을 사용하여 형식 매개변수 인수 `a:1`, `a:2`, `a:3` 등을 호출합니다.

```shell
echo Buffet("Noodles")
" returns "Noodles"

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returns everything you passed: "Noodles Sushi Ice cream Tofu Mochi"
```

가변 인수에는 하나의 특수 변수 `a:000`이 더 있습니다. 이는 모든 가변 인수를 리스트 형식으로 가지고 있습니다.

```shell
function! Buffet(...)
  return a:000
endfunction

echo Buffet("Noodles")
" returns ["Noodles"]

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returns ["Noodles", "Sushi", "Ice cream", "Tofu", "Mochi"]
```

함수를 리팩토링하여 `for` 루프를 사용해 보겠습니다:

```shell
function! Buffet(...)
  let l:foods = ""
  for food_item in a:000
    let l:foods .= food_item . " "
  endfor
  return l:foods
endfunction

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returns Noodles Sushi Ice cream Tofu Mochi
```
## 범위

*범위*가 있는 Vimscript 함수를 정의하려면 함수 정의 끝에 `range` 키워드를 추가하면 됩니다. 범위가 있는 함수는 두 개의 특별한 변수를 사용할 수 있습니다: `a:firstline`과 `a:lastline`.

```shell
function! Breakfast() range
  echo a:firstline
  echo a:lastline
endfunction
```

라인 100에 있을 때 `call Breakfast()`를 실행하면 `firstline`과 `lastline` 모두 100이 표시됩니다. 라인 101에서 105까지 시각적으로 강조 표시(`v`, `V`, 또는 `Ctrl-V`)하고 `call Breakfast()`를 실행하면 `firstline`은 101, `lastline`은 105가 표시됩니다. `firstline`과 `lastline`은 함수가 호출된 최소 및 최대 범위를 표시합니다.

`:call`을 사용하고 범위를 전달할 수도 있습니다. `:11,20call Breakfast()`를 실행하면 `firstline`은 11, `lastline`은 20이 표시됩니다.

"Vimscript 함수가 범위를 받아들이는 것은 좋지만, `line(".")`로 라인 번호를 얻을 수는 없나요? 같은 결과를 얻지 않나요?"라고 물어볼 수 있습니다.

좋은 질문입니다. 만약 당신이 이렇게 생각한다면:

```shell
function! Breakfast()
  echo line(".")
endfunction
```

`:11,20call Breakfast()`를 호출하면 `Breakfast` 함수가 10번 실행됩니다(범위의 각 라인마다 한 번씩). 범위 인수를 전달했다면:

```shell
function! Breakfast() range
  echo line(".")
endfunction
```

`11,20call Breakfast()`를 호출하면 `Breakfast` 함수가 *한 번* 실행됩니다.

`range` 키워드를 전달하고 `call`에서 숫자 범위(예: `11,20`)를 전달하면 Vim은 그 함수를 한 번만 실행합니다. `range` 키워드를 전달하지 않고 숫자 범위(예: `11,20`)를 `call`에 전달하면 Vim은 범위에 따라 N번 함수를 실행합니다(이 경우 N = 10).

## 사전

함수를 사전 항목으로 추가하려면 함수 정의 시 `dict` 키워드를 추가하면 됩니다.

`breakfast` 항목을 반환하는 `SecondBreakfast` 함수가 있다고 가정해 보겠습니다:

```shell
function! SecondBreakfast() dict
  return self.breakfast
endfunction
```

이 함수를 `meals` 사전에 추가해 보겠습니다:

```shell
let meals = {"breakfast": "pancakes", "second_breakfast": function("SecondBreakfast"), "lunch": "pasta"}

echo meals.second_breakfast()
" returns "pancakes"
```

`dict` 키워드를 사용하면 키 변수 `self`는 함수가 저장된 사전을 참조합니다(이 경우 `meals` 사전). 표현식 `self.breakfast`는 `meals.breakfast`와 같습니다.

사전 객체에 함수를 추가하는 또 다른 방법은 네임스페이스를 사용하는 것입니다.

```shell
function! meals.second_lunch()
  return self.lunch
endfunction

echo meals.second_lunch()
" returns "pasta"
```

네임스페이스를 사용하면 `dict` 키워드를 사용할 필요가 없습니다.

## Funcref

Funcref는 함수에 대한 참조입니다. 이것은 Ch. 24에서 언급된 Vimscript의 기본 데이터 유형 중 하나입니다.

위의 `function("SecondBreakfast")` 표현식은 funcref의 예입니다. Vim에는 함수 이름(문자열)을 전달할 때 funcref를 반환하는 내장 함수 `function()`이 있습니다.

```shell
function! Breakfast(item)
  return "I am having " . a:item . " for breakfast"
endfunction

let Breakfastify = Breakfast
" returns error

let Breakfastify = function("Breakfast")

echo Breakfastify("oatmeal")
" returns "I am having oatmeal for breakfast"

echo Breakfastify("pancake")
" returns "I am having pancake for breakfast"
```

Vim에서는 함수를 변수에 할당하려면 `let MyVar = MyFunc`처럼 직접 할당할 수 없습니다. `let MyVar = function("MyFunc")`처럼 `function()` 함수를 사용해야 합니다.

맵과 필터에서 funcref를 사용할 수 있습니다. 맵과 필터는 첫 번째 인수로 인덱스를, 두 번째 인수로 반복된 값을 전달합니다.

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

## 람다

맵과 필터에서 함수를 사용하는 더 나은 방법은 람다 표현식(때때로 이름 없는 함수라고도 함)을 사용하는 것입니다. 예를 들어:

```shell
let Plus = {x,y -> x + y}
echo Plus(1,2)
" returns 3

let Tasty = { -> 'tasty'}
echo Tasty()
" returns "tasty"
```

람다 표현식 내부에서 함수를 호출할 수 있습니다:

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

람다 내부에서 함수를 호출하고 싶지 않다면, 이를 리팩토링할 수 있습니다:

```shell
let day_meals = map(lunch_items, {index, item -> "I am having " . item . " for lunch"})
```

## 메서드 체이닝

여러 Vimscript 함수와 람다 표현식을 `->`로 순차적으로 체인할 수 있습니다. `->` 뒤에는 공백 없이 메서드 이름이 와야 합니다.

```shell
Source->Method1()->Method2()->...->MethodN()
```

메서드 체이닝을 사용하여 부동 소수를 숫자로 변환하는 방법:

```shell
echo 3.14->float2nr()
" returns 3
```

좀 더 복잡한 예를 들어 보겠습니다. 각 항목의 첫 글자를 대문자로 만들고, 리스트를 정렬한 다음, 리스트를 결합하여 문자열을 형성해야 한다고 가정해 보겠습니다.

```shell
function! Capitalizer(word)
  return substitute(a:word, "\^\.", "\\u&", "g")
endfunction

function! CapitalizeList(word_list)
  return map(a:word_list, {index, word -> Capitalizer(word)})
endfunction

let dinner_items = ["bruschetta", "antipasto", "calzone"]

echo dinner_items->CapitalizeList()->sort()->join(", ")
" returns "Antipasto, Bruschetta, Calzone"
```

메서드 체이닝을 사용하면 시퀀스가 더 쉽게 읽히고 이해됩니다. `dinner_items->CapitalizeList()->sort()->join(", ")`를 한눈에 보고 무슨 일이 일어나고 있는지 알 수 있습니다.

## 클로저

함수 내부에서 변수를 정의하면 해당 변수는 그 함수의 경계 내에서 존재합니다. 이를 렉시컬 스코프라고 합니다.

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch()
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

`appetizer`는 `Lunch` 함수 내부에 정의되어 있으며, 이는 `SecondLunch` funcref를 반환합니다. `SecondLunch`가 `appetizer`를 사용하지만, Vimscript에서는 해당 변수에 접근할 수 없습니다. `echo Lunch()()`를 실행하면 Vim은 정의되지 않은 변수 오류를 발생시킵니다.

이 문제를 해결하려면 `closure` 키워드를 사용합니다. 리팩토링해 보겠습니다:

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch() closure
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

이제 `echo Lunch()()`를 실행하면 Vim은 "shrimp"를 반환합니다.

## 스마트하게 Vimscript 함수 배우기

이 장에서는 Vim 함수의 구조를 배웠습니다. 함수 동작을 수정하기 위해 `range`, `dict`, `closure`와 같은 다양한 특별 키워드를 사용하는 방법을 배웠습니다. 또한 람다를 사용하고 여러 함수를 체인하는 방법도 배웠습니다. 함수는 복잡한 추상을 생성하는 중요한 도구입니다.

다음으로, 배운 모든 것을 모아 자신의 플러그인을 만들어 보겠습니다.