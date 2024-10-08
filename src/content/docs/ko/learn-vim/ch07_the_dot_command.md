---
description: 이 문서는 Vim의 점(.) 명령어 사용법을 설명하며, 이전 변경 사항을 쉽게 반복하는 방법을 배울 수 있습니다.
title: Ch07. the Dot Command
---

일반적으로, 되도록이면 방금 한 일을 다시 하지 않도록 노력해야 합니다. 이 장에서는 점 명령을 사용하여 이전 변경 사항을 쉽게 다시 수행하는 방법을 배웁니다. 이는 간단한 반복을 줄이기 위한 다목적 명령입니다.

## 사용법

이름처럼, 점 명령은 점 키(`.`)를 눌러 사용할 수 있습니다.

예를 들어, 다음 표현식에서 모든 "let"을 "const"로 바꾸고 싶다면:

```shell
let one = "1";
let two = "2";
let three = "3";
```

- `/let`으로 검색하여 일치하는 항목으로 이동합니다.
- `cwconst<Esc>`로 변경하여 "let"을 "const"로 바꿉니다.
- 이전 검색을 사용하여 `n`으로 다음 일치 항목을 찾습니다.
- 점 명령(`.`)으로 방금 한 일을 반복합니다.
- 모든 단어를 교체할 때까지 `n . n .`을 계속 눌러줍니다.

여기서 점 명령은 `cwconst<Esc>` 시퀀스를 반복했습니다. 이는 단 한 번의 입력으로 여덟 번의 키 입력을 절약해 주었습니다.

## 변경 사항이란 무엇인가?

점 명령의 정의(`:h .`)를 보면 점 명령은 마지막 변경 사항을 반복한다고 나와 있습니다. 변경 사항이란 무엇인가요?

현재 버퍼의 내용을 업데이트(추가, 수정 또는 삭제)할 때마다 변경을 만드는 것입니다. 예외는 명령줄 명령(`:`로 시작하는 명령)으로 수행된 업데이트는 변경으로 간주되지 않습니다.

첫 번째 예에서 `cwconst<Esc>`가 변경 사항이었습니다. 이제 다음 텍스트가 있다고 가정해 보겠습니다:

```shell
pancake, potatoes, fruit-juice,
```

줄의 시작에서 다음 쉼표까지의 텍스트를 삭제하려면, 먼저 쉼표까지 삭제한 다음 `df,..`로 두 번 반복합니다.

또 다른 예를 시도해 보겠습니다:

```shell
pancake, potatoes, fruit-juice,
```

이번에는 쉼표를 삭제하는 것이고 아침 식사 항목은 삭제하지 않습니다. 커서를 줄의 시작으로 이동하여 첫 번째 쉼표로 가서 삭제한 다음 `f,x..`로 두 번 더 반복합니다. 쉽죠? 잠깐, 작동하지 않았습니다! 왜일까요?

변경 사항은 움직임을 제외합니다. 왜냐하면 버퍼 내용을 업데이트하지 않기 때문입니다. 명령 `f,x`는 두 가지 동작으로 구성되어 있습니다: 커서를 ","로 이동하는 명령 `f,`와 문자를 삭제하는 `x`. 변경을 일으킨 것은 후자의 `x`뿐입니다. 이전 예의 `df,`와 대조해 보세요. 여기서 `f,`는 삭제 연산자 `d`에 대한 지시일 뿐 커서를 이동하는 것이 아닙니다. `df,`의 `f,`와 `f,x`는 매우 다른 역할을 합니다.

마지막 작업을 마칩니다. `f,` 다음에 `x`를 실행한 후, `;`로 다음 쉼표로 가서 최신 `f`를 반복합니다. 마지막으로, 커서 아래의 문자를 삭제하기 위해 `.`를 사용합니다. 모든 것이 삭제될 때까지 `; . ; .`를 반복합니다. 전체 명령은 `f,x;.;.`입니다.

또 다른 예를 시도해 보겠습니다:

```shell
pancake
potatoes
fruit-juice
```

각 줄 끝에 쉼표를 추가해 보겠습니다. 첫 번째 줄에서 시작하여 `A,<Esc>j`를 수행합니다. 이제 `j`가 변경을 일으키지 않는다는 것을 깨달았을 것입니다. 여기서의 변경은 오직 `A,`입니다. 이동하고 `j . j .`로 변경을 반복할 수 있습니다. 전체 명령은 `A,<Esc>j.j.`입니다.

삽입 명령 연산자(`A`)를 누른 순간부터 삽입 명령을 종료할 때까지(`<Esc>`)의 모든 동작은 변경으로 간주됩니다.

## 다중 줄 반복

다음 텍스트가 있다고 가정해 보겠습니다:

```shell
let one = "1";
let two = "2";
let three = "3";
const foo = "bar';
let four = "4";
let five = "5";
let six = "6";
let seven = "7";
let eight = "8";
let nine = "9";
```

당신의 목표는 "foo" 줄을 제외한 모든 줄을 삭제하는 것입니다. 먼저 `d2j`로 첫 세 줄을 삭제한 다음, "foo" 줄 아래의 줄로 이동합니다. 다음 줄에서 점 명령을 두 번 사용합니다. 전체 명령은 `d2jj..`입니다.

여기서 변경은 `d2j`였습니다. 이 맥락에서 `2j`는 움직임이 아니라 삭제 연산자의 일부였습니다.

또 다른 예를 살펴보겠습니다:

```shell
zlet zzone = "1";
zlet zztwo = "2";
zlet zzthree = "3";
let four = "4";
```

모든 z를 제거해 보겠습니다. 첫 번째 줄의 첫 번째 문자에서 시작하여 블록 시각 모드(`Ctrl-Vjj`)로 첫 세 줄에서 첫 번째 z만 선택합니다. 블록 시각 모드에 익숙하지 않다면, 나중 장에서 다룰 것입니다. 세 개의 z가 시각적으로 선택되면 삭제 연산자(`d`)로 삭제합니다. 그런 다음 다음 z로 이동하기 위해 다음 단어(`w`)로 이동합니다. 변경을 두 번 더 반복합니다(`..`). 전체 명령은 `Ctrl-vjjdw..`입니다.

세 개의 z 열(`Ctrl-vjjd`)을 삭제했을 때, 이는 변경으로 간주되었습니다. 시각 모드 작업은 변경의 일환으로 여러 줄을 대상으로 사용할 수 있습니다.

## 변경에 움직임 포함하기

이 장의 첫 번째 예로 돌아가 보겠습니다. 명령 `/letcwconst<Esc>` 다음에 `n . n .`이 다음 표현식에서 모든 "let"을 "const"로 교체했습니다:

```shell
let one = "1";
let two = "2";
let three = "3";
```

이를 더 빠르게 수행하는 방법이 있습니다. `/let`을 검색한 후 `cgnconst<Esc>`를 실행한 다음 `.`을 두 번 누릅니다.

`gn`은 마지막 검색 패턴(이 경우 `/let`)을 앞으로 검색하고 자동으로 시각적으로 강조하는 움직임입니다. 다음 발생을 교체하려면 더 이상 이동하고 변경을 반복할 필요 없이(`n . n .`) 단지 반복하기만 하면 됩니다(`. .`). 다음 일치를 검색하는 것이 이제 변경의 일부이므로 더 이상 검색 움직임을 사용할 필요가 없습니다!

편집할 때는 가능한 한 여러 작업을 동시에 수행할 수 있는 움직임을 항상 주의 깊게 살펴보세요.

## 점 명령을 스마트하게 배우기

점 명령의 힘은 여러 키 입력을 하나로 교환하는 데서 옵니다. `x`와 같은 단일 키 작업에 점 명령을 사용하는 것은 아마도 이익이 되지 않을 것입니다. 마지막 변경이 `cgnconst<Esc>`와 같은 복잡한 작업을 요구한다면, 점 명령은 아홉 번의 키 입력을 하나로 줄여주며, 이는 매우 이익이 되는 거래입니다.

편집할 때는 반복 가능성을 고려하세요. 예를 들어, 다음 세 단어를 제거해야 한다면 `d3w`를 사용하는 것이 더 경제적인가요, 아니면 `dw`를 한 번 수행한 후 `.`를 두 번 수행하는 것이 더 경제적인가요? 다시 단어를 삭제할 것인가요? 그렇다면 `d3w`보다 `dw`를 사용하고 여러 번 반복하는 것이 더 의미가 있습니다. 

점 명령은 단일 변경을 자동화하는 다목적 명령입니다. 나중 장에서는 Vim 매크로로 더 복잡한 작업을 자동화하는 방법을 배울 것입니다. 하지만 먼저 텍스트를 저장하고 검색하기 위한 레지스터에 대해 배워봅시다.