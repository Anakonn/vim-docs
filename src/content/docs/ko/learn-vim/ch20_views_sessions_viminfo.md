---
description: 이 문서는 Vim에서 프로젝트의 설정, 폴드, 버퍼 등을 유지하기 위한 View, Session, Viminfo 사용법을 설명합니다.
title: Ch20. Views, Sessions, and Viminfo
---

프로젝트에서 작업을 한 후, 프로젝트가 점차적으로 자체 설정, 접기, 버퍼, 레이아웃 등을 갖추게 되는 것을 발견할 수 있습니다. 이는 마치 아파트에 살면서 꾸미는 것과 같습니다. 문제는 Vim을 닫으면 이러한 변경 사항을 잃게 된다는 것입니다. 다음 번에 Vim을 열 때, 마치 떠나지 않았던 것처럼 변경 사항을 유지할 수 있다면 좋지 않을까요?

이 장에서는 View, Session, 및 Viminfo를 사용하여 프로젝트의 "스냅샷"을 보존하는 방법을 배웁니다.

## View

View는 세 가지(View, Session, Viminfo) 중 가장 작은 하위 집합입니다. 하나의 창에 대한 설정 모음입니다. 창에서 오랜 시간을 작업하고 매핑과 접기를 보존하고 싶다면 View를 사용할 수 있습니다.

`foo.txt`라는 파일을 만들어 보겠습니다:

```shell
foo1
foo2
foo3
foo4
foo5
foo6
foo7
foo8
foo9
foo10
```

이 파일에서 세 가지 변경 사항을 만듭니다:
1. 1행에서 수동 접기 `zf4j`를 만듭니다(다음 4줄을 접습니다).
2. `number` 설정을 변경합니다: `setlocal nonumber norelativenumber`. 이렇게 하면 창의 왼쪽에 있는 숫자 표시가 제거됩니다.
3. `j`를 누를 때마다 한 줄이 아닌 두 줄 아래로 내려가는 로컬 매핑을 만듭니다: `:nnoremap <buffer> j jj`.

당신의 파일은 다음과 같아야 합니다:

```shell
+-- 5 lines: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

### View 속성 구성

다음 명령을 실행합니다:

```shell
:set viewoptions?
```

기본적으로 다음과 같이 표시되어야 합니다(당신의 vimrc에 따라 다르게 보일 수 있습니다):

```shell
viewoptions=folds,cursor,curdir
```

`viewoptions`를 구성해 보겠습니다. 보존하고 싶은 세 가지 속성은 접기, 매핑 및 로컬 설정 옵션입니다. 설정이 내 것과 같다면 이미 `folds` 옵션이 있습니다. View에게 `localoptions`를 기억하라고 알려야 합니다. 다음 명령을 실행합니다:

```shell
:set viewoptions+=localoptions
```

`viewoptions`에 대해 어떤 다른 옵션이 있는지 알아보려면 `:h viewoptions`를 확인하세요. 이제 `:set viewoptions?`를 실행하면 다음과 같이 표시되어야 합니다:

```shell
viewoptions=folds,cursor,curdir,localoptions
```

### View 저장

`foo.txt` 창이 올바르게 접혀 있고 `nonumber norelativenumber` 옵션이 설정되었으므로 View를 저장해 보겠습니다. 다음 명령을 실행합니다:

```shell
:mkview
```

Vim은 View 파일을 생성합니다.

### View 파일

"Vim이 이 View 파일을 어디에 저장했을까?" 궁금할 수 있습니다. Vim이 저장한 위치를 보려면 다음 명령을 실행합니다:

```shell
:set viewdir?
```

유닉스 기반 OS에서는 기본적으로 `~/.vim/view`라고 표시되어야 합니다(다른 OS를 사용하는 경우 다른 경로가 표시될 수 있습니다. 자세한 내용은 `:h viewdir`를 확인하세요). 유닉스 기반 OS를 사용하고 다른 경로로 변경하고 싶다면 vimrc에 다음을 추가하세요:

```shell
set viewdir=$HOME/else/where
```

### View 파일 로드

`foo.txt`를 닫지 않았다면 닫고 다시 엽니다. **변경 사항 없이 원래 텍스트가 보여야 합니다.** 이는 예상된 결과입니다.

상태를 복원하려면 View 파일을 로드해야 합니다. 다음 명령을 실행합니다:

```shell
:loadview
```

이제 다음과 같이 보여야 합니다:

```shell
+-- 5 lines: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

접기, 로컬 설정 및 로컬 매핑이 복원되었습니다. 주목할 점은, `:mkview`를 실행했을 때 커서가 있던 줄에 커서가 있어야 한다는 것입니다. `cursor` 옵션이 있는 한, View는 커서 위치도 기억합니다.

### 여러 View

Vim은 9개의 번호가 매겨진 View(1-9)를 저장할 수 있습니다.

예를 들어, 추가 접기를 만들고 싶다고 가정해 보겠습니다(예: 마지막 두 줄을 접고 싶다면) `:9,10 fold`를 사용합니다. 이를 View 1로 저장해 보겠습니다. 다음 명령을 실행합니다:

```shell
:mkview 1
```

`6,7 fold`로 또 다른 접기를 만들고 다른 View로 저장하고 싶다면 다음 명령을 실행합니다:

```shell
:mkview 2
```

파일을 닫습니다. `foo.txt`를 열고 View 1을 로드하려면 다음 명령을 실행합니다:

```shell
:loadview 1
```

View 2를 로드하려면 다음 명령을 실행합니다:

```shell
:loadview 2
```

원래 View를 로드하려면 다음 명령을 실행합니다:

```shell
:loadview
```

### View 생성 자동화

가장 최악의 상황 중 하나는, 수많은 시간을 들여 큰 파일을 접기로 정리한 후, 실수로 창을 닫고 모든 접기 정보를 잃는 것입니다. 이를 방지하기 위해, 버퍼를 닫을 때마다 View를 자동으로 생성하고 싶을 수 있습니다. vimrc에 다음을 추가하세요:

```shell
autocmd BufWinLeave *.txt mkview
```

또한, 버퍼를 열 때 View를 로드하는 것도 좋습니다:

```shell
autocmd BufWinEnter *.txt silent loadview
```

이제 `txt` 파일 작업 시 View를 생성하고 로드하는 것에 대해 걱정할 필요가 없습니다. 시간이 지나면서 `~/.vim/view`에 View 파일이 쌓일 수 있으니, 몇 달에 한 번 정리하는 것이 좋습니다.

## 세션

View가 창의 설정을 저장한다면, Session은 모든 창의 정보를 저장합니다(레이아웃 포함).

### 새 세션 만들기

`foobarbaz` 프로젝트에서 다음 3개의 파일로 작업하고 있다고 가정해 보겠습니다:

`foo.txt` 내부:

```shell
foo1
foo2
foo3
foo4
foo5
foo6
foo7
foo8
foo9
foo10
```

`bar.txt` 내부:

```shell
bar1
bar2
bar3
bar4
bar5
bar6
bar7
bar8
bar9
bar10
```

`baz.txt` 내부:

```shell
baz1
baz2
baz3
baz4
baz5
baz6
baz7
baz8
baz9
baz10
```

이제 `:split` 및 `:vsplit`로 창을 나누었다고 가정해 보겠습니다. 이 모양을 보존하려면 세션을 저장해야 합니다. 다음 명령을 실행합니다:

```shell
:mksession
```

`mkview`와 달리 기본적으로 `~/.vim/view`에 저장되는 것이 아니라, `mksession`은 현재 디렉토리에 세션 파일(`Session.vim`)을 저장합니다. 내부에 무엇이 있는지 궁금하다면 파일을 확인해 보세요.

세션 파일을 다른 곳에 저장하고 싶다면, `mksession`에 인수를 전달할 수 있습니다:

```shell
:mksession ~/some/where/else.vim
```

기존 세션 파일을 덮어쓰려면 `!`를 붙여서 명령을 호출합니다(`:mksession! ~/some/where/else.vim`).

### 세션 로드하기

세션을 로드하려면 다음 명령을 실행합니다:

```shell
:source Session.vim
```

이제 Vim은 당신이 떠났던 그대로 보입니다. 분할된 창도 포함되어 있습니다! 또는 터미널에서 세션 파일을 로드할 수도 있습니다:

```shell
vim -S Session.vim
```

### 세션 속성 구성

세션이 저장하는 속성을 구성할 수 있습니다. 현재 저장되고 있는 내용을 보려면 다음 명령을 실행합니다:

```shell
:set sessionoptions?
```

내 경우 다음과 같이 표시됩니다:

```shell
blank,buffers,curdir,folds,help,tabpages,winsize,terminal
```

세션을 저장할 때 `terminal`을 저장하고 싶지 않다면 세션 옵션에서 제거합니다. 다음 명령을 실행합니다:

```shell
:set sessionoptions-=terminal
```

세션을 저장할 때 `options`를 추가하고 싶다면 다음 명령을 실행합니다:

```shell
:set sessionoptions+=options
```

다음은 `sessionoptions`가 저장할 수 있는 몇 가지 속성입니다:
- `blank`는 빈 창을 저장합니다.
- `buffers`는 버퍼를 저장합니다.
- `folds`는 접기를 저장합니다.
- `globals`는 전역 변수를 저장합니다(대문자로 시작하고 소문자가 하나 이상 포함되어야 함).
- `options`는 옵션 및 매핑을 저장합니다.
- `resize`는 창의 줄과 열을 저장합니다.
- `winpos`는 창의 위치를 저장합니다.
- `winsize`는 창의 크기를 저장합니다.
- `tabpages`는 탭을 저장합니다.
- `unix`는 유닉스 형식으로 파일을 저장합니다.

전체 목록은 `:h 'sessionoptions'`를 확인하세요.

세션은 프로젝트의 외부 속성을 보존하는 유용한 도구입니다. 그러나 로컬 마크, 레지스터, 히스토리 등과 같은 일부 내부 속성은 세션에 의해 저장되지 않습니다. 이를 저장하려면 Viminfo를 사용해야 합니다!

## Viminfo

단어를 레지스터 a에 복사하고 Vim을 종료한 후, 다음 번에 Vim을 열면 여전히 레지스터 a에 그 텍스트가 저장되어 있는 것을 알 수 있습니다. 이는 실제로 Viminfo의 작업입니다. Vim을 닫은 후 레지스터를 기억하지 않으려면 Viminfo가 필요합니다.

Vim 8 이상을 사용하면 Viminfo가 기본적으로 활성화되어 있으므로, 이 모든 시간 동안 Viminfo를 사용하고 있었던 것일 수 있습니다!

"Viminfo는 무엇을 저장하나요? 세션과 어떻게 다르나요?"라고 물을 수 있습니다.

Viminfo를 사용하려면 먼저 `+viminfo` 기능이 사용 가능해야 합니다(`:version`). Viminfo는 다음을 저장합니다:
- 명령줄 기록.
- 검색 문자열 기록.
- 입력 줄 기록.
- 비어 있지 않은 레지스터의 내용.
- 여러 파일에 대한 마크.
- 파일 마크, 파일 내 위치를 가리킴.
- 마지막 검색 / 대체 패턴('n' 및 '&'에 대해).
- 버퍼 목록.
- 전역 변수.

일반적으로 세션은 "외부" 속성을 저장하고 Viminfo는 "내부" 속성을 저장합니다.

세션은 프로젝트당 하나의 세션 파일을 가질 수 있는 반면, 일반적으로 컴퓨터당 하나의 Viminfo 파일을 사용합니다. Viminfo는 프로젝트와 무관합니다.

유닉스의 기본 Viminfo 위치는 `$HOME/.viminfo`(`~/.viminfo`)입니다. 다른 OS를 사용하는 경우 Viminfo 위치가 다를 수 있습니다. `:h viminfo-file-name`을 확인하세요. "내부" 변경 사항(예: 텍스트를 레지스터에 복사하기)을 만들 때마다 Vim은 자동으로 Viminfo 파일을 업데이트합니다.

*`nocompatible` 옵션이 설정되어 있는지 확인하세요(`set nocompatible`), 그렇지 않으면 Viminfo가 작동하지 않습니다.*

### Viminfo 쓰기 및 읽기

하나의 Viminfo 파일만 사용할 수 있지만 여러 Viminfo 파일을 생성할 수 있습니다. Viminfo 파일을 쓰려면 `:wviminfo` 명령을 사용합니다(`:wv`로 단축 가능).

```shell
:wv ~/.viminfo_extra
```

기존 Viminfo 파일을 덮어쓰려면 `wv` 명령에 bang을 추가합니다:

```shell
:wv! ~/.viminfo_extra
```

기본적으로 Vim은 `~/.viminfo` 파일에서 읽습니다. 다른 Viminfo 파일에서 읽으려면 `:rviminfo`를 실행하거나 `:rv`로 단축합니다:

```shell
:rv ~/.viminfo_extra
```

터미널에서 다른 Viminfo 파일로 Vim을 시작하려면 `i` 플래그를 사용합니다:

```shell
vim -i viminfo_extra
```

코딩과 작문과 같은 다양한 작업에 Vim을 사용하는 경우, 작문에 최적화된 Viminfo와 코딩에 최적화된 Viminfo를 각각 생성할 수 있습니다.

```shell
vim -i viminfo_writing

vim -i viminfo_coding
```

### Viminfo 없이 Vim 시작하기

Vim을 Viminfo 없이 시작하려면 터미널에서 다음을 실행할 수 있습니다:

```shell
vim -i NONE
```

영구적으로 만들려면 vimrc 파일에 다음을 추가할 수 있습니다:

```shell
set viminfo="NONE"
```

### Viminfo 속성 구성

`viewoptions` 및 `sessionoptions`와 유사하게, 어떤 속성을 저장할지 `viminfo` 옵션으로 지시할 수 있습니다. 다음 명령을 실행합니다:

```shell
:set viminfo?
```

다음과 같은 결과를 얻습니다:

```shell
!,'100,<50,s10,h
```

이것은 암호처럼 보입니다. 다음과 같이 분해해 보겠습니다:
- `!`는 대문자로 시작하고 소문자가 포함되지 않은 전역 변수를 저장합니다. `g:`가 전역 변수를 나타내는 것을 기억하세요. 예를 들어, 어떤 시점에 `let g:FOO = "foo"`라는 할당을 했다면, Viminfo는 전역 변수 `FOO`를 저장합니다. 그러나 `let g:Foo = "foo"`를 했다면, 소문자가 포함되어 있기 때문에 Viminfo는 이 전역 변수를 저장하지 않습니다. `!` 없이 Vim은 이러한 전역 변수를 저장하지 않습니다.
- `'100`은 마크를 나타냅니다. 이 경우 Viminfo는 마지막 100개의 파일의 로컬 마크(a-z)를 저장합니다. 너무 많은 파일을 저장하라고 Viminfo에 지시하면 Vim이 느려질 수 있습니다. 1000이 좋은 숫자입니다.
- `<50`은 각 레지스터에 대해 저장할 최대 줄 수를 나타냅니다(이 경우 50). 100줄의 텍스트를 레지스터 a에 복사하고(`"ay99j`) Vim을 닫으면, 다음 번에 Vim을 열고 레지스터 a에서 붙여넣기(`"ap`)를 하면 Vim은 최대 50줄만 붙여넣습니다. 최대 줄 수를 지정하지 않으면 *모든* 줄이 저장됩니다. 0을 지정하면 아무 것도 저장되지 않습니다.
- `s10`은 레지스터의 크기 제한(킬로바이트 단위)을 설정합니다. 이 경우 10kb 크기를 초과하는 레지스터는 제외됩니다.
- `h`는 Vim이 시작할 때 하이라이팅(`hlsearch`)을 비활성화합니다.

전달할 수 있는 다른 옵션도 있습니다. 더 알아보려면 `:h 'viminfo'`를 확인하세요.
## 뷰, 세션 및 Viminfo를 스마트하게 사용하기

Vim은 다양한 수준의 Vim 환경 스냅샷을 찍기 위해 View, Session 및 Viminfo를 제공합니다. 소규모 프로젝트에는 Views를 사용하고, 대규모 프로젝트에는 Sessions를 사용하세요. View, Session 및 Viminfo가 제공하는 모든 옵션을 확인하는 데 시간을 투자해야 합니다.

자신의 편집 스타일에 맞는 View, Session 및 Viminfo를 만드세요. 컴퓨터 외부에서 Vim을 사용해야 할 경우, 설정을 불러오기만 하면 즉시 집에 있는 듯한 편안함을 느낄 수 있습니다!