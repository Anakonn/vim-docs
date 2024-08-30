---
description: 이 문서는 Vimscript의 기본 요소와 데이터 유형에 대해 설명하며, Ex 모드를 활용한 실습 방법도 안내합니다.
title: Ch25. Vimscript Basic Data Types
---

다음 몇 개의 장에서는 Vimscript, Vim의 내장 프로그래밍 언어에 대해 배울 것입니다.

새로운 언어를 배울 때, 찾아야 할 세 가지 기본 요소가 있습니다:
- 원시 데이터 타입
- 조합 수단
- 추상화 수단

이번 장에서는 Vim의 원시 데이터 타입에 대해 배울 것입니다.

## 데이터 타입

Vim에는 10가지의 서로 다른 데이터 타입이 있습니다:
- 숫자
- 부동 소수점
- 문자열
- 리스트
- 사전
- 특수
- Funcref
- 작업
- 채널
- Blob

여기서는 처음 여섯 가지 데이터 타입을 다룰 것입니다. 27장에서 Funcref에 대해 배울 것입니다. Vim 데이터 타입에 대한 더 많은 정보는 `:h variables`를 확인하세요.

## Ex 모드와 함께 따라하기

Vim은 기술적으로 내장 REPL이 없지만, REPL처럼 사용할 수 있는 Ex 모드가 있습니다. `Q` 또는 `gQ`로 Ex 모드로 이동할 수 있습니다. Ex 모드는 확장된 명령줄 모드와 같으며(명령줄 모드 명령을 중단 없이 입력하는 것과 같습니다) Ex 모드를 종료하려면 `:visual`을 입력하세요.

이 장과 이후의 Vimscript 장에서는 `:echo` 또는 `:echom`을 사용하여 코딩할 수 있습니다. 이들은 JS의 `console.log` 또는 Python의 `print`와 같습니다. `:echo` 명령은 제공된 표현식을 평가하여 출력합니다. `:echom` 명령도 동일하지만, 추가로 결과를 메시지 기록에 저장합니다.

```viml
:echom "hello echo message"
```

메시지 기록을 보려면:

```shell
:messages
```

메시지 기록을 지우려면 다음을 실행하세요:

```shell
:messages clear
```

## 숫자

Vim에는 4가지의 서로 다른 숫자 타입이 있습니다: 십진수, 육진수, 이진수, 팔진수. 숫자 데이터 타입이라고 할 때, 이는 종종 정수 데이터 타입을 의미합니다. 이 가이드에서는 숫자와 정수를 서로 바꿔 사용합니다.

### 십진수

십진수 시스템에 익숙해야 합니다. Vim은 양수와 음수 십진수를 허용합니다. 1, -1, 10 등. Vimscript 프로그래밍에서는 대부분의 경우 십진수 타입을 사용하게 될 것입니다.

### 육진수

육진수는 `0x` 또는 `0X`로 시작합니다. 기억법: He**x**adecimal.

### 이진수

이진수는 `0b` 또는 `0B`로 시작합니다. 기억법: **B**inary.

### 팔진수

팔진수는 `0`, `0o`, `0O`로 시작합니다. 기억법: **O**ctal.

### 숫자 출력

십진수, 육진수 또는 이진수를 `echo`하면, Vim은 자동으로 이를 십진수로 변환합니다.

```viml
:echo 42
" 42를 반환합니다.

:echo 052
" 42를 반환합니다.

:echo 0b101010
" 42를 반환합니다.

:echo 0x2A
" 42를 반환합니다.
```

### 진리값과 거짓값

Vim에서 0 값은 거짓이며, 모든 비-0 값은 진리입니다.

다음은 아무것도 출력하지 않습니다.

```viml
:if 0
:  echo "Nope"
:endif
```

하지만, 다음은 출력합니다:

```viml
:if 1
:  echo "Yes"
:endif
```

0이 아닌 모든 값은 진리이며, 음수도 포함됩니다. 100은 진리입니다. -1도 진리입니다.

### 숫자 산술

숫자는 산술 표현식을 실행하는 데 사용할 수 있습니다:

```viml
:echo 3 + 1
" 4를 반환합니다.

: echo 5 - 3
" 2를 반환합니다.

:echo 2 * 2
" 4를 반환합니다.

:echo 4 / 2
" 2를 반환합니다.
```

나머지가 있는 숫자를 나눌 때, Vim은 나머지를 버립니다.

```viml
:echo 5 / 2
" 2.5 대신 2를 반환합니다.
```

더 정확한 결과를 얻으려면 부동 소수점 숫자를 사용해야 합니다.

## 부동 소수점

부동 소수점은 소수점 이하가 있는 숫자입니다. 부동 소수점을 나타내는 두 가지 방법이 있습니다: 점 표기법(예: 31.4)과 지수 표기법(3.14e01). 숫자와 마찬가지로 양수와 음수 기호를 사용할 수 있습니다:

```viml
:echo +123.4
" 123.4를 반환합니다.

:echo -1.234e2
" -123.4를 반환합니다.

:echo 0.25
" 0.25를 반환합니다.

:echo 2.5e-1
" 0.25를 반환합니다.
```

부동 소수점에는 점과 소수점 이하 숫자를 제공해야 합니다. `25e-2`(점 없음)와 `1234.`(점은 있지만 소수점 이하 숫자 없음)는 모두 유효하지 않은 부동 소수점 숫자입니다.

### 부동 소수점 산술

숫자와 부동 소수점 간의 산술 표현식을 수행할 때, Vim은 결과를 부동 소수점으로 변환합니다.

```viml
:echo 5 / 2.0
" 2.5를 반환합니다.
```

부동 소수점과 부동 소수점 산술은 또 다른 부동 소수점을 제공합니다.

```shell
:echo 1.0 + 1.0
" 2.0을 반환합니다.
```

## 문자열

문자열은 이중 따옴표(`""`) 또는 단일 따옴표(`''`)로 둘러싸인 문자입니다. "Hello", "123", '123.4'는 문자열의 예입니다.

### 문자열 연결

Vim에서 문자열을 연결하려면 `.` 연산자를 사용하세요.

```viml
:echo "Hello" . " world"
" "Hello world"를 반환합니다.
```

### 문자열 산술

숫자와 문자열 간에 산술 연산자(`+ - * /`)를 실행하면, Vim은 문자열을 숫자로 변환합니다.

```viml
:echo "12 donuts" + 3
" 15를 반환합니다.
```

Vim은 "12 donuts"를 보고 문자열에서 12를 추출하여 숫자 12로 변환합니다. 그런 다음 덧셈을 수행하여 15를 반환합니다. 이 문자열-숫자 변환이 작동하려면 숫자 문자가 문자열의 *첫 번째 문자*여야 합니다.

다음은 문자열의 첫 번째 문자가 12가 아니기 때문에 작동하지 않습니다:

```viml
:echo "donuts 12" + 3
" 3을 반환합니다.
```

빈 공백이 문자열의 첫 번째 문자이기 때문에 이것도 작동하지 않습니다:

```viml
:echo " 12 donuts" + 3
" 3을 반환합니다.
```

이 변환은 두 문자열 간에도 작동합니다:

```shell
:echo "12 donuts" + "6 pastries"
" 18을 반환합니다.
```

이것은 `+`뿐만 아니라 모든 산술 연산자와 함께 작동합니다:

```viml
:echo "12 donuts" * "5 boxes"
" 60을 반환합니다.

:echo "12 donuts" - 5
" 7을 반환합니다.

:echo "12 donuts" / "3 people"
" 4를 반환합니다.
```

문자열-숫자 변환을 강제로 수행하는 간단한 요령은 0을 더하거나 1로 곱하는 것입니다:

```viml
:echo "12" + 0
" 12를 반환합니다.

:echo "12" * 1
" 12를 반환합니다.
```

문자열의 부동 소수점에 대해 산술을 수행하면, Vim은 이를 부동 소수점이 아닌 정수로 처리합니다:

```shell
:echo "12.0 donuts" + 12
" 24를 반환하며, 24.0이 아닙니다.
```

### 숫자와 문자열 연결

숫자를 문자열로 변환하려면 점 연산자(`.`)를 사용할 수 있습니다:

```viml
:echo 12 . "donuts"
" "12donuts"를 반환합니다.
```

이 변환은 숫자 데이터 타입에만 작동하며, 부동 소수점에는 작동하지 않습니다. 이것은 작동하지 않습니다:

```shell
:echo 12.0 . "donuts"
" "12.0donuts"를 반환하지 않고 오류를 발생시킵니다.
```

### 문자열 조건문

0은 거짓이며 모든 비-0 숫자는 진리입니다. 문자열을 조건문으로 사용할 때도 마찬가지입니다.

다음 if 문에서, Vim은 "12donuts"를 12로 변환하며, 이는 진리입니다:

```viml
:if "12donuts"
:  echo "Yum"
:endif
" "Yum"을 반환합니다.
```

반면, 다음은 거짓입니다:

```viml
:if "donuts12"
:  echo "Nope"
:endif
" 아무것도 반환하지 않습니다.
```

Vim은 "donuts12"를 0으로 변환하는데, 첫 번째 문자가 숫자가 아니기 때문입니다.

### 이중 따옴표와 단일 따옴표

이중 따옴표는 단일 따옴표와 다르게 동작합니다. 단일 따옴표는 문자를 문자 그대로 표시하는 반면, 이중 따옴표는 특수 문자를 허용합니다.

특수 문자는 무엇인가요? 줄 바꿈과 이중 따옴표 표시를 확인하세요:

```viml
:echo "hello\nworld"
" 다음을 반환합니다.
" hello
" world

:echo "hello \"world\""
" "hello "world""를 반환합니다.
```

단일 따옴표와 비교해 보세요:

```shell
:echo 'hello\nworld'
" 'hello\nworld'를 반환합니다.

:echo 'hello \"world\"'
" 'hello \"world\"'를 반환합니다.
```

특수 문자는 이스케이프되었을 때 다르게 동작하는 특수 문자열 문자입니다. `\n`은 줄 바꿈처럼 작동합니다. `\"`는 문자 `"처럼 작동합니다. 다른 특수 문자 목록은 `:h expr-quote`를 확인하세요.

### 문자열 절차

내장 문자열 절차를 살펴보겠습니다.

`strlen()`을 사용하여 문자열의 길이를 얻을 수 있습니다.

```shell
:echo strlen("choco")
" 5를 반환합니다.
```

`str2nr()`를 사용하여 문자열을 숫자로 변환할 수 있습니다:

```shell
:echo str2nr("12donuts")
" 12를 반환합니다.

:echo str2nr("donuts12")
" 0을 반환합니다.
```

이전의 문자열-숫자 변환과 유사하게, 숫자가 첫 번째 문자가 아닐 경우 Vim은 이를 인식하지 않습니다.

좋은 소식은 Vim에 문자열을 부동 소수점으로 변환하는 메서드인 `str2float()`가 있다는 것입니다:

```shell
:echo str2float("12.5donuts")
" 12.5를 반환합니다.
```

`substitute()` 메서드를 사용하여 문자열의 패턴을 대체할 수 있습니다:

```shell
:echo substitute("sweet", "e", "o", "g")
" "swoot"를 반환합니다.
```

마지막 매개변수인 "g"는 전역 플래그입니다. 이를 사용하면 Vim은 모든 일치하는 항목을 대체합니다. 이를 사용하지 않으면 Vim은 첫 번째 일치 항목만 대체합니다.

```shell
:echo substitute("sweet", "e", "o", "")
" "swoet"를 반환합니다.
```

대체 명령은 `getline()`과 결합할 수 있습니다. `getline()` 함수는 주어진 줄 번호의 텍스트를 가져옵니다. 예를 들어, 5번 줄에 "chocolate donut"라는 텍스트가 있다고 가정해 보겠습니다. 다음 절차를 사용할 수 있습니다:

```shell
:echo substitute(getline(5), "chocolate", "glazed", "g")
" glazed donut을 반환합니다.
```

다른 많은 문자열 절차가 있습니다. `:h string-functions`를 확인하세요.

## 리스트

Vimscript 리스트는 Javascript의 배열이나 Python의 리스트와 같습니다. 이는 *정렬된* 항목의 시퀀스입니다. 다양한 데이터 타입으로 내용을 혼합할 수 있습니다:

```shell
[1,2,3]
['a', 'b', 'c']
[1,'a', 3.14]
[1,2,[3,4]]
```

### 하위 리스트

Vim 리스트는 0부터 인덱싱됩니다. `[n]`을 사용하여 리스트의 특정 항목에 접근할 수 있으며, 여기서 n은 인덱스입니다.

```shell
:echo ["a", "sweet", "dessert"][0]
" "a"를 반환합니다.

:echo ["a", "sweet", "dessert"][2]
" "dessert"를 반환합니다.
```

최대 인덱스 번호를 초과하면, Vim은 인덱스가 범위를 초과했다는 오류를 발생시킵니다:

```shell
:echo ["a", "sweet", "dessert"][999]
" 오류를 반환합니다.
```

0보다 아래로 가면, Vim은 마지막 요소부터 인덱스를 시작합니다. 최소 인덱스 번호를 초과하면 오류가 발생합니다:

```shell
:echo ["a", "sweet", "dessert"][-1]
" "dessert"를 반환합니다.

:echo ["a", "sweet", "dessert"][-3]
" "a"를 반환합니다.

:echo ["a", "sweet", "dessert"][-999]
" 오류를 반환합니다.
```

`[n:m]`을 사용하여 리스트에서 여러 요소를 "슬라이스"할 수 있으며, 여기서 `n`은 시작 인덱스이고 `m`은 종료 인덱스입니다.

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:4]
" ["plain", "strawberry", "lemon"]을 반환합니다.
```

`m`을 전달하지 않으면(` [n:]`), Vim은 n번째 요소부터 나머지 요소를 반환합니다. `n`을 전달하지 않으면(`[:m]`), Vim은 m번째 요소까지 첫 번째 요소를 반환합니다.

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:]
" ['plain', 'strawberry', 'lemon', 'sugar', 'cream']을 반환합니다.

:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][:4]
" ['chocolate', 'glazed', 'plain', 'strawberry', 'lemon']을 반환합니다.
```

배열을 슬라이스할 때 최대 항목 수를 초과하는 인덱스를 전달할 수 있습니다.

```viml
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:999]
" ['plain', 'strawberry', 'lemon', 'sugar', 'cream']을 반환합니다.
```
### 문자열 슬라이싱

리스트처럼 문자열을 슬라이스하고 타겟팅할 수 있습니다:

```viml
:echo "choco"[0]
" 반환 "c"

:echo "choco"[1:3]
" 반환 "hoc"

:echo "choco"[:3]
" 반환 choc

:echo "choco"[1:]
" 반환 hoco
```

### 리스트 산술

`+`를 사용하여 리스트를 연결하고 변형할 수 있습니다:

```viml
:let sweetList = ["chocolate", "strawberry"]
:let sweetList += ["sugar"]
:echo sweetList
" 반환 ["chocolate", "strawberry", "sugar"]
```

### 리스트 함수

Vim의 내장 리스트 함수를 살펴보겠습니다.

리스트의 길이를 얻으려면 `len()`을 사용하세요:

```shell
:echo len(["chocolate", "strawberry"])
" 반환 2
```

리스트에 요소를 추가하려면 `insert()`를 사용할 수 있습니다:

```shell
:let sweetList = ["chocolate", "strawberry"]
:call insert(sweetList, "glazed")

:echo sweetList
" 반환 ["glazed", "chocolate", "strawberry"]
```

`insert()`에 요소를 추가할 인덱스를 전달할 수도 있습니다. 두 번째 요소(인덱스 1) 앞에 아이템을 추가하려면:

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call insert(sweeterList, "cream", 1)

:echo sweeterList
" 반환 ['glazed', 'cream', 'chocolate', 'strawberry']
```

리스트 항목을 제거하려면 `remove()`를 사용하세요. 리스트와 제거할 요소의 인덱스를 받습니다.

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call remove(sweeterList, 1)

:echo sweeterList
" 반환 ['glazed', 'strawberry']
```

`map()`과 `filter()`를 리스트에 사용할 수 있습니다. "choco"라는 구문이 포함된 요소를 필터링하려면:

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call filter(sweeterList, 'v:val !~ "choco"')
:echo sweeterList
" 반환 ["glazed", "strawberry"]

:let sweetestList = ["chocolate", "glazed", "sugar"]
:call map(sweetestList, 'v:val . " donut"')
:echo sweetestList
" 반환 ['chocolate donut', 'glazed donut', 'sugar donut']
```

`v:val` 변수는 Vim의 특수 변수입니다. `map()` 또는 `filter()`를 사용하여 리스트나 딕셔너리를 반복할 때 사용할 수 있으며, 각 반복 항목을 나타냅니다.

자세한 내용은 `:h list-functions`를 참조하세요.

### 리스트 언팩킹

리스트를 언팩하고 변수에 리스트 항목을 할당할 수 있습니다:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let [flavor1, flavor2, flavor3] = favoriteFlavor

:echo flavor1
" 반환 "chocolate"

:echo flavor2
" 반환 "glazed"
```

나머지 리스트 항목을 할당하려면 `;` 다음에 변수 이름을 사용할 수 있습니다:

```shell
:let favoriteFruits = ["apple", "banana", "lemon", "blueberry", "raspberry"]
:let [fruit1, fruit2; restFruits] = favoriteFruits

:echo fruit1
" 반환 "apple"

:echo restFruits
" 반환 ['lemon', 'blueberry', 'raspberry']
```

### 리스트 수정

리스트 항목을 직접 수정할 수 있습니다:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[0] = "sugar"
:echo favoriteFlavor
" 반환 ['sugar', 'glazed', 'plain']
```

여러 리스트 항목을 직접 변형할 수 있습니다:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[2:] = ["strawberry", "chocolate"]
:echo favoriteFlavor
" 반환 ['chocolate', 'glazed', 'strawberry', 'chocolate']
```

## 딕셔너리

Vimscript 딕셔너리는 연관된 비순서 리스트입니다. 비어 있지 않은 딕셔너리는 최소한 하나의 키-값 쌍으로 구성됩니다.

```shell
{"breakfast": "waffles", "lunch": "pancakes"}
{"meal": ["breakfast", "second breakfast", "third breakfast"]}
{"dinner": 1, "dessert": 2}
```

Vim 딕셔너리 데이터 객체는 키에 문자열을 사용합니다. 숫자를 사용하려고 하면 Vim은 이를 문자열로 변환합니다.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}

:echo breakfastNo
" 반환 {'1': '7am', '2': '9am', '11ses': '11am'}
```

각 키에 따옴표를 넣는 것이 귀찮다면 `#{}` 표기법을 사용할 수 있습니다:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo mealPlans
" 반환 {'lunch': 'pancakes', 'breakfast': 'waffles', 'dinner': 'donuts'}
```

`#{}` 구문을 사용하기 위한 유일한 요구 사항은 각 키가 다음 중 하나여야 한다는 것입니다:

- ASCII 문자.
- 숫자.
- 언더스코어(`_`).
- 하이픈(`-`).

리스트와 마찬가지로 모든 데이터 유형을 값으로 사용할 수 있습니다.

```shell
:let mealPlan = {"breakfast": ["pancake", "waffle", "hash brown"], "lunch": WhatsForLunch(), "dinner": {"appetizer": "gruel", "entree": "more gruel"}}
```

### 딕셔너리 접근

딕셔너리에서 값을 접근하려면, 대괄호(`['key']`) 또는 점 표기법(`.key`)을 사용하여 키를 호출할 수 있습니다.

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches", "dinner": "more gruel"}

:let breakfast = meal['breakfast']
:let lunch = meal.lunch

:echo breakfast
" 반환 "gruel omelettes"

:echo lunch
" 반환 "gruel sandwiches"
```

### 딕셔너리 수정

딕셔너리 내용을 수정하거나 추가할 수 있습니다:

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches"}

:let meal.breakfast = "breakfast tacos"
:let meal["lunch"] = "tacos al pastor"
:let meal["dinner"] = "quesadillas"

:echo meal
" 반환 {'lunch': 'tacos al pastor', 'breakfast': 'breakfast tacos', 'dinner': 'quesadillas'}
```

### 딕셔너리 함수

딕셔너리를 처리하기 위한 Vim의 내장 함수 몇 가지를 살펴보겠습니다.

딕셔너리의 길이를 확인하려면 `len()`을 사용하세요.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo len(mealPlans)
" 반환 3
```

딕셔너리에 특정 키가 포함되어 있는지 확인하려면 `has_key()`를 사용하세요.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo has_key(mealPlans, "breakfast")
" 반환 1

:echo has_key(mealPlans, "dessert")
" 반환 0
```

딕셔너리에 항목이 있는지 확인하려면 `empty()`를 사용하세요. `empty()` 프로시저는 모든 데이터 유형: 리스트, 딕셔너리, 문자열, 숫자, 부동 소수점 등에서 작동합니다.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:let noMealPlan = {}

:echo empty(noMealPlan)
" 반환 1

:echo empty(mealPlans)
" 반환 0
```

딕셔너리에서 항목을 제거하려면 `remove()`를 사용하세요.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo "removing breakfast: " . remove(mealPlans, "breakfast")
" 반환 "removing breakfast: 'waffles'""

:echo mealPlans
" 반환 {'lunch': 'pancakes', 'dinner': 'donuts'}
```

딕셔너리를 리스트의 리스트로 변환하려면 `items()`를 사용하세요:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo items(mealPlans)
" 반환 [['lunch', 'pancakes'], ['breakfast', 'waffles'], ['dinner', 'donuts']]
```

`filter()`와 `map()`도 사용할 수 있습니다.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}
:call filter(breakfastNo, 'v:key > 1')

:echo breakfastNo
" 반환 {'2': '9am', '11ses': '11am'}
```

딕셔너리는 키-값 쌍을 포함하므로, Vim은 `v:key` 특수 변수를 제공합니다. 이는 `v:val`과 유사하게 작동합니다. 딕셔너리를 반복할 때 `v:key`는 현재 반복 중인 키의 값을 보유합니다.

`mealPlans` 딕셔너리가 있는 경우, `v:key`를 사용하여 매핑할 수 있습니다.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:key . " and milk"')

:echo mealPlans
" 반환 {'lunch': 'lunch and milk', 'breakfast': 'breakfast and milk', 'dinner': 'dinner and milk'}
```

유사하게, `v:val`을 사용하여 매핑할 수 있습니다:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:val . " and milk"')

:echo mealPlans
" 반환 {'lunch': 'pancakes and milk', 'breakfast': 'waffles and milk', 'dinner': 'donuts and milk'}
```

더 많은 딕셔너리 함수를 보려면 `:h dict-functions`를 확인하세요.

## 특수 원시값

Vim에는 특수 원시값이 있습니다:

- `v:false`
- `v:true`
- `v:none`
- `v:null`

그런데 `v:`는 Vim의 내장 변수입니다. 이들은 이후 장에서 더 다룰 것입니다.

제 경험상, 이러한 특수 원시값을 자주 사용하지는 않을 것입니다. 진리값 / 거짓값이 필요하면 0(거짓)과 비-0(진리)을 사용하면 됩니다. 빈 문자열이 필요하면 `""`를 사용하세요. 하지만 아는 것이 좋으므로 빠르게 살펴보겠습니다.

### 진리

이는 `true`와 동일합니다. 비-0 값의 숫자와 같습니다. `json_encode()`로 JSON을 디코딩할 때 "true"로 해석됩니다.

```shell
:echo json_encode({"test": v:true})
" 반환 {"test": true}
```

### 거짓

이는 `false`와 동일합니다. 0 값의 숫자와 같습니다. `json_encode()`로 JSON을 디코딩할 때 "false"로 해석됩니다.

```shell
:echo json_encode({"test": v:false})
" 반환 {"test": false}
```

### 없음

빈 문자열과 동일합니다. `json_encode()`로 JSON을 디코딩할 때 빈 항목(`null`)으로 해석됩니다.

```shell
:echo json_encode({"test": v:none})
" 반환 {"test": null}
```

### 널

`v:none`과 유사합니다.

```shell
:echo json_encode({"test": v:null})
" 반환 {"test": null}
```

## 스마트하게 데이터 유형 배우기

이 장에서는 Vimscript의 기본 데이터 유형: 숫자, 부동 소수점, 문자열, 리스트, 딕셔너리 및 특수 유형에 대해 배웠습니다. 이를 배우는 것은 Vimscript 프로그래밍을 시작하는 첫 번째 단계입니다.

다음 장에서는 이들을 결합하여 동등성, 조건문 및 루프와 같은 표현식을 작성하는 방법을 배웁니다.