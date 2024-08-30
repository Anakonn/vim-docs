---
description: 이 문서는 Vim 변수의 다양한 소스와 범위, 가변 및 불변 변수의 사용법에 대해 설명합니다. Vimscript 함수에 대한
  이해를 돕습니다.
title: Ch27. Vimscript Variable Scopes
---

Vimscript 함수에 들어가기 전에, Vim 변수의 다양한 출처와 범위에 대해 알아봅시다.

## 가변 변수와 불변 변수

Vim에서 `let`을 사용하여 변수에 값을 할당할 수 있습니다:

```shell
let pancake = "pancake"
```

나중에 언제든지 그 변수를 호출할 수 있습니다.

```shell
echo pancake
" returns "pancake"
```

`let`은 가변적이며, 이는 미래에 언제든지 값을 변경할 수 있음을 의미합니다.

```shell
let pancake = "pancake"
let pancake = "not waffles"

echo pancake
" returns "not waffles"
```

설정된 변수의 값을 변경하려면 여전히 `let`을 사용해야 한다는 점에 유의하세요.

```shell
let beverage = "milk"

beverage = "orange juice"
" throws an error
```

`const`를 사용하여 불변 변수를 정의할 수 있습니다. 불변적이므로, 변수 값이 할당된 후에는 다른 값으로 재할당할 수 없습니다.

```shell
const waffle = "waffle"
const waffle = "pancake"
" throws an error
```

## 변수 출처

변수의 출처는 세 가지입니다: 환경 변수, 옵션 변수, 레지스터 변수.

### 환경 변수

Vim은 터미널 환경 변수에 접근할 수 있습니다. 예를 들어, 터미널에서 `SHELL` 환경 변수가 사용 가능하다면, Vim에서 다음과 같이 접근할 수 있습니다:

```shell
echo $SHELL
" returns $SHELL value. In my case, it returns /bin/bash
```

### 옵션 변수

`&`를 사용하여 Vim 옵션에 접근할 수 있습니다 (이것들은 `set`으로 접근하는 설정입니다).

예를 들어, Vim이 사용하는 배경을 보려면 다음을 실행할 수 있습니다:

```shell
echo &background
" returns either "light" or "dark"
```

또는 항상 `set background?`를 실행하여 `background` 옵션의 값을 확인할 수 있습니다.

### 레지스터 변수

`@`를 사용하여 Vim 레지스터에 접근할 수 있습니다 (Ch. 08).

예를 들어, "chocolate" 값이 레지스터 a에 이미 저장되어 있다고 가정합시다. 이를 접근하려면 `@a`를 사용할 수 있습니다. 또한 `let`으로 업데이트할 수 있습니다.

```shell
echo @a
" returns chocolate

let @a .= " donut"

echo @a
" returns "chocolate donut"
```

이제 레지스터 `a`에서 붙여넣기를 하면 (`"ap`), "chocolate donut"가 반환됩니다. 연산자 `.=`는 두 문자열을 연결합니다. 표현식 `let @a .= " donut"`는 `let @a = @a . " donut"`와 같습니다.

## 변수 범위

Vim에는 9개의 서로 다른 변수 범위가 있습니다. 이들은 접두사로 구별할 수 있습니다:

```shell
g:           전역 변수
{nothing}    전역 변수
b:           버퍼 로컬 변수
w:           윈도우 로컬 변수
t:           탭 로컬 변수
s:           소스된 Vimscript 변수
l:           함수 로컬 변수
a:           함수 형식 매개변수 변수
v:           내장 Vim 변수
```

### 전역 변수

"일반" 변수를 선언할 때:

```shell
let pancake = "pancake"
```

`pancake`는 실제로 전역 변수입니다. 전역 변수를 정의하면 어디에서나 호출할 수 있습니다.

변수에 `g:`를 접두사로 붙이면 전역 변수가 생성됩니다.

```shell
let g:waffle = "waffle"
```

이 경우 `pancake`와 `g:waffle`은 동일한 범위를 가집니다. 두 변수 모두 `g:`를 붙이거나 붙이지 않고 호출할 수 있습니다.

```shell
echo pancake
" returns "pancake"

echo g:pancake
" returns "pancake"

echo waffle
" returns "waffle"

echo g:waffle
" returns "waffle"
```

### 버퍼 변수

`b:`로 시작하는 변수는 버퍼 변수입니다. 버퍼 변수는 현재 버퍼에 로컬한 변수입니다 (Ch. 02). 여러 개의 버퍼가 열려 있다면, 각 버퍼는 별도의 버퍼 변수 목록을 가집니다.

버퍼 1에서:

```shell
const b:donut = "chocolate donut"
```

버퍼 2에서:

```shell
const b:donut = "blueberry donut"
```

버퍼 1에서 `echo b:donut`을 실행하면 "chocolate donut"가 반환됩니다. 버퍼 2에서 실행하면 "blueberry donut"가 반환됩니다.

참고로, Vim에는 현재 버퍼에서 수행된 모든 변경 사항을 추적하는 *특별한* 버퍼 변수 `b:changedtick`이 있습니다.

1. `echo b:changedtick`을 실행하고 반환된 숫자를 기록합니다.
2. Vim에서 변경 사항을 만듭니다.
3. 다시 `echo b:changedtick`을 실행하고 지금 반환되는 숫자를 기록합니다.

### 윈도우 변수

`w:`로 시작하는 변수는 윈도우 변수입니다. 이 변수는 해당 윈도우에서만 존재합니다.

윈도우 1에서:

```shell
const w:donut = "chocolate donut"
```

윈도우 2에서:

```shell
const w:donut = "raspberry donut"
```

각 윈도우에서 `echo w:donut`을 호출하여 고유한 값을 얻을 수 있습니다.

### 탭 변수

`t:`로 시작하는 변수는 탭 변수입니다. 이 변수는 해당 탭에서만 존재합니다.

탭 1에서:

```shell
const t:donut = "chocolate donut"
```

탭 2에서:

```shell
const t:donut = "blackberry donut"
```

각 탭에서 `echo t:donut`을 호출하여 고유한 값을 얻을 수 있습니다.

### 스크립트 변수

`s:`로 시작하는 변수는 스크립트 변수입니다. 이러한 변수는 해당 스크립트 내부에서만 접근할 수 있습니다.

임의의 파일 `dozen.vim`이 있고 그 안에 다음이 있다고 가정합시다:

```shell
let s:dozen = 12

function Consume()
  let s:dozen -= 1
  echo s:dozen " is left"
endfunction
```

`:source dozen.vim`으로 파일을 소스합니다. 이제 `Consume` 함수를 호출합니다:

```shell
:call Consume()
" returns "11 is left"

:call Consume()
" returns "10 is left"

:echo s:dozen
" Undefined variable error
```

`Consume`을 호출하면 `s:dozen` 값이 예상대로 감소하는 것을 볼 수 있습니다. 그러나 `s:dozen` 값을 직접 가져오려고 하면 Vim은 범위를 벗어나기 때문에 찾지 못합니다. `s:dozen`은 `dozen.vim` 내부에서만 접근할 수 있습니다.

`dozen.vim` 파일을 매번 소스할 때마다 `s:dozen` 카운터가 리셋됩니다. 만약 `s:dozen` 값을 감소시키는 중에 `:source dozen.vim`을 실행하면 카운터가 다시 12로 리셋됩니다. 이는 예상치 못한 사용자에게 문제가 될 수 있습니다. 이 문제를 해결하기 위해 코드를 리팩토링합니다:

```shell
if !exists("s:dozen")
  let s:dozen = 12
endif

function Consume()
  let s:dozen -= 1
  echo s:dozen
endfunction
```

이제 감소 중에 `dozen.vim`을 소스하면 Vim은 `!exists("s:dozen")`를 읽고, 그것이 참임을 확인하여 값을 12로 리셋하지 않습니다.

### 함수 로컬 및 함수 형식 매개변수 변수

함수 로컬 변수(`l:`)와 함수 형식 변수(`a:`)는 다음 장에서 다룰 것입니다.

### 내장 Vim 변수

`v:`로 시작하는 변수는 특별한 내장 Vim 변수입니다. 이러한 변수를 정의할 수 없습니다. 이미 일부를 보았습니다.
- `v:version`은 사용 중인 Vim 버전을 알려줍니다.
- `v:key`는 사전을 순회할 때 현재 항목 값을 포함합니다.
- `v:val`은 `map()` 또는 `filter()` 작업을 실행할 때 현재 항목 값을 포함합니다.
- `v:true`, `v:false`, `v:null`, `v:none`은 특별한 데이터 유형입니다.

다른 변수들도 있습니다. 내장 Vim 변수 목록은 `:h vim-variable` 또는 `:h v:`를 확인하세요.

## 스마트하게 Vim 변수 범위 사용하기

환경, 옵션 및 레지스터 변수에 빠르게 접근할 수 있는 것은 편집기와 터미널 환경을 사용자화하는 데 넓은 유연성을 제공합니다. 또한 Vim에는 특정 제약 조건 하에 존재하는 9개의 서로 다른 변수 범위가 있다는 것을 배웠습니다. 이러한 고유한 변수 유형을 활용하여 프로그램을 분리할 수 있습니다.

여기까지 오셨습니다. 데이터 유형, 조합 방법 및 변수 범위에 대해 배웠습니다. 이제 남은 것은 함수입니다.