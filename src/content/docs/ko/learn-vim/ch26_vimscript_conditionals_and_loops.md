---
description: 이 문서는 Vimscript 데이터 유형을 사용하여 조건문과 반복문을 작성하는 방법을 배우는 내용을 다룹니다. 기본적인 관계
  연산자도 포함됩니다.
title: Ch26. Vimscript Conditionals and Loops
---

기본 데이터 유형이 무엇인지 배운 후, 다음 단계는 이들을 결합하여 기본 프로그램을 작성하는 방법을 배우는 것입니다. 기본 프로그램은 조건문과 반복문으로 구성됩니다.

이 장에서는 Vimscript 데이터 유형을 사용하여 조건문과 반복문을 작성하는 방법을 배웁니다.

## 관계 연산자

Vimscript 관계 연산자는 많은 프로그래밍 언어와 유사합니다:

```shell
a == b		equal to
a != b		not equal to
a >  b		greater than
a >= b		greater than or equal to
a <  b		less than
a <= b		less than or equal to
```

예를 들어:

```shell
:echo 5 == 5
:echo 5 != 5
:echo 10 > 5
:echo 10 >= 5
:echo 10 < 5
:echo 5 <= 5
```

산술 표현식에서 문자열이 숫자로 강제 변환된다는 점을 기억하세요. 여기서 Vim도 동등성 표현식에서 문자열을 숫자로 강제 변환합니다. "5foo"는 5로 변환됩니다 (참):

```shell
:echo 5 == "5foo"
" returns true
```

또한 "foo5"와 같은 비숫자 문자로 문자열을 시작하면 문자열이 숫자 0으로 변환된다는 점을 기억하세요 (거짓).

```shell
echo 5 == "foo5"
" returns false
```

### 문자열 논리 연산자

Vim은 문자열을 비교하기 위한 더 많은 관계 연산자를 제공합니다:

```shell
a =~ b
a !~ b
```

예를 들어:

```shell
let str = "hearty breakfast"

echo str =~ "hearty"
" returns true

echo str =~ "dinner"
" returns false

echo str !~ "dinner"
" returns true
```

`=~` 연산자는 주어진 문자열에 대해 정규 표현식 일치를 수행합니다. 위의 예에서 `str =~ "hearty"`는 `str`이 "hearty" 패턴을 *포함*하고 있기 때문에 true를 반환합니다. 항상 `==`와 `!=`를 사용할 수 있지만, 이를 사용하면 표현식이 전체 문자열과 비교됩니다. `=~`와 `!~`는 더 유연한 선택입니다.

```shell
echo str == "hearty"
" returns false

echo str == "hearty breakfast"
" returns true
```

이것을 시도해 보세요. 대문자 "H"에 주목하세요:

```shell
echo str =~ "Hearty"
" true
```

"Hearty"가 대문자로 되어 있음에도 true를 반환합니다. 흥미롭습니다... 내 Vim 설정이 대소문자를 무시하도록 설정되어 있기 때문에 (`set ignorecase`), Vim이 동등성을 확인할 때 내 Vim 설정을 사용하고 대소문자를 무시합니다. 만약 대소문자 무시를 끈다면 (`set noignorecase`), 비교는 이제 false를 반환합니다.

```shell
set noignorecase
echo str =~ "Hearty"
" returns false because case matters

set ignorecase
echo str =~ "Hearty"
" returns true because case doesn't matter
```

다른 사람을 위한 플러그인을 작성하는 경우, 이는 까다로운 상황입니다. 사용자가 `ignorecase`를 사용하나요, 아니면 `noignorecase`를 사용하나요? 사용자가 대소문자 무시 옵션을 변경하도록 강요하고 싶지 않습니다. 그렇다면 어떻게 해야 할까요?

다행히도, Vim에는 항상 대소문자를 무시하거나 일치시킬 수 있는 연산자가 있습니다. 항상 대소문자를 일치시키려면 끝에 `#`를 추가하세요.

```shell
set ignorecase
echo str =~# "hearty"
" returns true

echo str =~# "HearTY"
" returns false

set noignorecase
echo str =~# "hearty"
" true

echo str =~# "HearTY"
" false

echo str !~# "HearTY"
" true
```

비교할 때 항상 대소문자를 무시하려면 `?`를 추가하세요:

```shell
set ignorecase
echo str =~? "hearty"
" true

echo str =~? "HearTY"
" true

set noignorecase
echo str =~? "hearty"
" true

echo str =~? "HearTY"
" true

echo str !~? "HearTY"
" false
```

나는 항상 대소문자를 일치시키기 위해 `#`를 사용하는 것을 선호합니다.

## If

이제 Vim의 동등성 표현식을 보았으니, 기본 조건 연산자인 `if` 문에 대해 알아봅시다.

최소한의 구문은 다음과 같습니다:

```shell
if {clause}
  {some expression}
endif
```

`elseif`와 `else`로 경우 분석을 확장할 수 있습니다.

```shell
if {predicate1}
  {expression1}
elseif {predicate2}
  {expression2}
elseif {predicate3}
  {expression3}
else
  {expression4}
endif
```

예를 들어, 플러그인 [vim-signify](https://github.com/mhinz/vim-signify)는 Vim 설정에 따라 다른 설치 방법을 사용합니다. 아래는 `if` 문을 사용한 그들의 `readme`에서의 설치 지침입니다:

```shell
if has('nvim') || has('patch-8.0.902')
  Plug 'mhinz/vim-signify'
else
  Plug 'mhinz/vim-signify', { 'branch': 'legacy' }
endif
```

## 삼항 표현식

Vim에는 한 줄로 경우 분석을 할 수 있는 삼항 표현식이 있습니다:

```shell
{predicate} ? expressiontrue : expressionfalse
```

예를 들어:

```shell
echo 1 ? "I am true" : "I am false"
```

1이 참이므로 Vim은 "I am true"를 출력합니다. 특정 시간 이후에 Vim을 사용하고 있다면 `background`를 어둡게 설정하고 싶다고 가정해 보겠습니다. vimrc에 다음을 추가하세요:

```shell
let &background = strftime("%H") < 18 ? "light" : "dark"
```

`&background`는 Vim의 `'background'` 옵션입니다. `strftime("%H")`는 현재 시간을 시간 단위로 반환합니다. 오후 6시가 되지 않았다면 밝은 배경을 사용하고, 그렇지 않으면 어두운 배경을 사용합니다.

## or

논리 "or" (`||`)는 많은 프로그래밍 언어와 유사하게 작동합니다.

```shell
{Falsy expression}  || {Falsy expression}   false
{Falsy expression}  || {Truthy expression}  true
{Truthy expression} || {Falsy expression}   true
{Truthy expression} || {Truthy expression}  true
```

Vim은 표현식을 평가하고 1 (참) 또는 0 (거짓)을 반환합니다.

```shell
echo 5 || 0
" returns 1

echo 5 || 5
" returns 1

echo 0 || 0
" returns 0

echo "foo5" || "foo5"
" returns 0

echo "5foo" || "foo5"
" returns 1
```

현재 표현식이 참으로 평가되면, 후속 표현식은 평가되지 않습니다.

```shell
let one_dozen = 12

echo one_dozen || two_dozen
" returns 1

echo two_dozen || one_dozen
" returns error
```

`two_dozen`은 정의되지 않았음을 주의하세요. 표현식 `one_dozen || two_dozen`은 `one_dozen`이 먼저 평가되어 참으로 판별되기 때문에 오류를 발생시키지 않습니다. 그래서 Vim은 `two_dozen`을 평가하지 않습니다.

## and

논리 "and" (`&&`)는 논리 or의 보완입니다.

```shell
{Falsy Expression}  && {Falsy Expression}   false
{Falsy expression}  && {Truthy expression}  false
{Truthy Expression} && {Falsy Expression}   false
{Truthy expression} && {Truthy expression}  true
```

예를 들어:

```shell
echo 0 && 0
" returns 0

echo 0 && 10
" returns 0
```

`&&`는 첫 번째 거짓 표현식을 볼 때까지 표현식을 평가합니다. 예를 들어, `true && true`가 있으면 두 개 모두 평가하고 `true`를 반환합니다. `true && false && true`가 있다면, 첫 번째 `true`를 평가하고 첫 번째 `false`에서 멈춥니다. 세 번째 `true`는 평가하지 않습니다.

```shell
let one_dozen = 12
echo one_dozen && 10
" returns 1

echo one_dozen && v:false
" returns 0

echo one_dozen && two_dozen
" returns error

echo exists("one_dozen") && one_dozen == 12
" returns 1
```

## for

`for` 루프는 일반적으로 리스트 데이터 유형과 함께 사용됩니다.

```shell
let breakfasts = ["pancakes", "waffles", "eggs"]

for breakfast in breakfasts
  echo breakfast
endfor
```

중첩 리스트와 함께 작동합니다:

```shell
let meals = [["breakfast", "pancakes"], ["lunch", "fish"], ["dinner", "pasta"]]

for [meal_type, food] in meals
  echo "I am having " . food . " for " . meal_type
endfor
```

기술적으로 `keys()` 메서드를 사용하여 사전과 함께 `for` 루프를 사용할 수 있습니다.

```shell
let beverages = #{breakfast: "milk", lunch: "orange juice", dinner: "water"}
for beverage_type in keys(beverages)
  echo "I am drinking " . beverages[beverage_type] . " for " . beverage_type
endfor
```

## While

또 다른 일반적인 루프는 `while` 루프입니다.

```shell
let counter = 1
while counter < 5
  echo "Counter is: " . counter
  let counter += 1
endwhile
```

현재 줄의 내용을 마지막 줄까지 가져오려면:

```shell
let current_line = line(".")
let last_line = line("$")

while current_line <= last_line
  echo getline(current_line)
  let current_line += 1
endwhile
```

## 오류 처리

종종 프로그램이 예상대로 실행되지 않습니다. 그 결과, 당신은 혼란스러워질 수 있습니다 (말장난). 필요한 것은 적절한 오류 처리입니다.

### Break

`while` 또는 `for` 루프 내에서 `break`를 사용하면 루프가 중단됩니다.

파일의 시작부터 현재 줄까지의 텍스트를 가져오되, "donut"라는 단어를 보았을 때 중단합니다:

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

텍스트가 다음과 같다면:

```shell
one
two
three
donut
four
five
```

위의 `while` 루프를 실행하면 "one two three"를 출력하고 나머지 텍스트는 출력하지 않습니다. 루프는 "donut"와 일치할 때 중단되기 때문입니다.

### Continue

`continue` 메서드는 `break`와 유사하게 루프 중에 호출됩니다. 차이점은 루프를 중단하는 대신 현재 반복을 건너뛴다는 것입니다.

같은 텍스트가 있지만 `break` 대신 `continue`를 사용한다고 가정해 보겠습니다:

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

이번에는 `one two three four five`를 반환합니다. "donut"라는 단어가 있는 줄을 건너뛰지만, 루프는 계속 진행됩니다.
### try, finally, and catch

Vim은 오류 처리를 위해 `try`, `finally`, 및 `catch`를 제공합니다. 오류를 시뮬레이션하려면 `throw` 명령어를 사용할 수 있습니다.

```shell
try
  echo "Try"
  throw "Nope"
endtry
```

이 코드를 실행하세요. Vim은 `"Exception not caught: Nope` 오류로 불평할 것입니다.

이제 catch 블록을 추가해 보겠습니다:

```shell
try
  echo "Try"
  throw "Nope"
catch
  echo "Caught it"
endtry
```

이제 더 이상 오류가 없습니다. "Try"와 "Caught it"이 표시되어야 합니다.

`catch`를 제거하고 `finally`를 추가해 보겠습니다:

```shell
try
  echo "Try"
  throw "Nope"
  echo "You won't see me"
finally
  echo "Finally"
endtry
```

이 코드를 실행하세요. 이제 Vim은 오류와 "Finally"를 표시합니다.

모든 것을 함께 넣어 보겠습니다:

```shell
try
  echo "Try"
  throw "Nope"
catch
  echo "Caught it"
finally
  echo "Finally"
endtry
```

이번에는 Vim이 "Caught it"과 "Finally"를 모두 표시합니다. 오류는 표시되지 않는데, Vim이 이를 포착했기 때문입니다.

오류는 다양한 곳에서 발생할 수 있습니다. 또 다른 오류의 원인은 존재하지 않는 함수를 호출하는 것입니다. 아래의 `Nope()`와 같이:

```shell
try
  echo "Try"
  call Nope()
catch
  echo "Caught it"
finally
  echo "Finally"
endtry
```

`catch`와 `finally`의 차이점은 `finally`는 오류 여부와 관계없이 항상 실행되며, `catch`는 코드에서 오류가 발생했을 때만 실행된다는 것입니다.

특정 오류를 `:catch`로 포착할 수 있습니다. `:h :catch`에 따르면:

```shell
catch /^Vim:Interrupt$/.             " 인터럽트 포착 (CTRL-C)
catch /^Vim\\%((\\a\\+)\\)\\=:E/.    " 모든 Vim 오류 포착
catch /^Vim\\%((\\a\\+)\\)\\=:/.     " 오류 및 인터럽트 포착
catch /^Vim(write):/.                " :write에서 모든 오류 포착
catch /^Vim\\%((\\a\\+)\\)\\=:E123:/ " 오류 E123 포착
catch /my-exception/.                " 사용자 예외 포착
catch /.*/                           " 모든 것 포착
catch.                               " /.*/와 동일
```

`try` 블록 내부에서 인터럽트는 포착 가능한 오류로 간주됩니다.

```shell
try
  catch /^Vim:Interrupt$/
  sleep 100
endtry
```

vimrc에서 [gruvbox](https://github.com/morhetz/gruvbox)와 같은 사용자 정의 색상 테마를 사용하는 경우, 색상 테마 디렉토리를 실수로 삭제했지만 여전히 vimrc에 `colorscheme gruvbox` 라인이 남아 있다면, `source`할 때 Vim은 오류를 발생시킵니다. 이를 수정하기 위해, 저는 vimrc에 다음을 추가했습니다:

```shell
try
  colorscheme gruvbox
catch
  colorscheme default
endtry
```

이제 `gruvbox` 디렉토리 없이 vimrc를 `source`하면, Vim은 `colorscheme default`를 사용합니다.

## 스마트한 방법으로 조건문 배우기

이전 장에서는 Vim 기본 데이터 유형에 대해 배웠습니다. 이번 장에서는 조건문과 루프를 사용하여 기본 프로그램을 작성하는 방법을 배웠습니다. 이것들은 프로그래밍의 기본 요소입니다.

다음으로 변수 범위에 대해 배워보겠습니다.