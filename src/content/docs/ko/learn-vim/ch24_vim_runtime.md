---
description: 이 문서는 Vim의 런타임 경로에 대한 개요를 제공하며, 사용자 정의 및 플러그인 스크립트 실행 방법을 설명합니다.
title: Ch24. Vim Runtime
---

이전 장에서 Vim이 `~/.vim/` 디렉토리 내에서 `pack/` (22장) 및 `compiler/` (19장)와 같은 특별한 경로를 자동으로 찾는다고 언급했습니다. 이들은 Vim 런타임 경로의 예입니다.

Vim에는 이 두 가지보다 더 많은 런타임 경로가 있습니다. 이 장에서는 이러한 런타임 경로에 대한 고급 개요를 배웁니다. 이 장의 목표는 이러한 경로가 언제 호출되는지를 보여주는 것입니다. 이를 알면 Vim을 더 잘 이해하고 사용자 정의할 수 있습니다.

## 런타임 경로

Unix 머신에서 Vim의 런타임 경로 중 하나는 `$HOME/.vim/`입니다 (Windows와 같은 다른 OS를 사용하는 경우 경로가 다를 수 있습니다). 다양한 OS의 런타임 경로를 보려면 `:h 'runtimepath'`를 확인하세요. 이 장에서는 기본 런타임 경로로 `~/.vim/`를 사용하겠습니다.

## 플러그인 스크립트

Vim에는 이 디렉토리의 스크립트를 Vim이 시작할 때마다 한 번 실행하는 플러그인 런타임 경로가 있습니다. "플러그인"이라는 이름을 Vim 외부 플러그인(NERDTree, fzf.vim 등)과 혼동하지 마세요.

`~/.vim/` 디렉토리로 가서 `plugin/` 디렉토리를 만드세요. 두 개의 파일을 만드세요: `donut.vim`과 `chocolate.vim`.

`~/.vim/plugin/donut.vim` 내부:

```shell
echo "donut!"
```

`~/.vim/plugin/chocolate.vim` 내부:

```shell
echo "chocolate!"
```

이제 Vim을 닫으세요. 다음 번에 Vim을 시작하면 `"donut!"`와 `"chocolate!"`가 모두 출력되는 것을 볼 수 있습니다. 플러그인 런타임 경로는 초기화 스크립트에 사용할 수 있습니다.

## 파일 유형 탐지

시작하기 전에 이러한 탐지가 작동하는지 확인하려면 vimrc에 다음 줄이 포함되어 있는지 확인하세요:

```shell
filetype plugin indent on
```

더 많은 맥락을 보려면 `:h filetype-overview`를 확인하세요. 본질적으로 이는 Vim의 파일 유형 탐지를 활성화합니다.

새 파일을 열면 Vim은 일반적으로 파일의 종류를 알고 있습니다. `hello.rb` 파일이 있는 경우 `:set filetype?`를 실행하면 올바른 응답 `filetype=ruby`가 반환됩니다.

Vim은 "일반적인" 파일 유형(Ruby, Python, Javascript 등)을 탐지하는 방법을 알고 있습니다. 그러나 사용자 정의 파일이 있는 경우 어떻게 해야 할까요? Vim에게 이를 탐지하고 올바른 파일 유형을 할당하도록 가르쳐야 합니다.

탐지 방법에는 두 가지가 있습니다: 파일 이름을 사용하는 방법과 파일 내용을 사용하는 방법입니다.

### 파일 이름 탐지

파일 이름 탐지는 파일 이름을 사용하여 파일 유형을 탐지합니다. `hello.rb` 파일을 열면 Vim은 `.rb` 확장자를 통해 Ruby 파일임을 알 수 있습니다.

파일 이름 탐지를 수행하는 방법은 두 가지가 있습니다: `ftdetect/` 런타임 디렉토리를 사용하는 방법과 `filetype.vim` 런타임 파일을 사용하는 방법입니다. 두 가지를 모두 살펴보겠습니다.

#### `ftdetect/`

모호하지만 맛있는 파일 `hello.chocodonut`을 만들어 보겠습니다. 이 파일을 열고 `:set filetype?`를 실행하면, 일반적인 파일 이름 확장이 아니기 때문에 Vim은 이를 어떻게 처리해야 할지 모릅니다. `filetype=`가 반환됩니다.

Vim에게 `.chocodonut`로 끝나는 모든 파일을 "chocodonut" 파일 유형으로 설정하도록 지시해야 합니다. 런타임 루트(`~/.vim/`)에 `ftdetect/`라는 디렉토리를 만들고 그 안에 `chocodonut.vim`이라는 파일을 만드세요 (`~/.vim/ftdetect/chocodonut.vim`). 이 파일에 다음을 추가하세요:

```shell
autocmd BufNewFile,BufRead *.chocodonut set filetype=chocodonut
```

`BufNewFile`과 `BufRead`는 새 버퍼를 생성하거나 새 버퍼를 열 때마다 트리거됩니다. `*.chocodonut`은 열린 버퍼의 파일 이름 확장이 `.chocodonut`일 때만 이 이벤트가 트리거됨을 의미합니다. 마지막으로, `set filetype=chocodonut` 명령은 파일 유형을 chocodonut 유형으로 설정합니다.

Vim을 재시작하세요. 이제 `hello.chocodonut` 파일을 열고 `:set filetype?`를 실행하면 `filetype=chocodonut`이 반환됩니다.

맛있군요! 원하는 만큼 파일을 `ftdetect/`에 넣을 수 있습니다. 앞으로 `ftdetect/strawberrydonut.vim`, `ftdetect/plaindonut.vim` 등을 추가할 수 있습니다. 도넛 파일 유형을 확장하기로 결정하면 말이죠.

실제로 Vim에서 파일 유형을 설정하는 방법은 두 가지가 있습니다. 하나는 방금 사용한 `set filetype=chocodonut`입니다. 다른 방법은 `setfiletype chocodonut`을 실행하는 것입니다. 첫 번째 명령인 `set filetype=chocodonut`은 *항상* 파일 유형을 chocodonut 유형으로 설정하는 반면, 두 번째 명령인 `setfiletype chocodonut`은 파일 유형이 아직 설정되지 않은 경우에만 파일 유형을 설정합니다.

#### 파일 유형 파일

두 번째 파일 탐지 방법은 루트 디렉토리(`~/.vim/filetype.vim`)에 `filetype.vim`을 만드는 것입니다. 여기에 다음을 추가하세요:

```shell
autocmd BufNewFile,BufRead *.plaindonut set filetype=plaindonut
```

`hello.plaindonut` 파일을 만드세요. 이 파일을 열고 `:set filetype?`를 실행하면 Vim은 올바른 사용자 정의 파일 유형 `filetype=plaindonut`을 표시합니다.

신의 과자, 작동하네요! 참고로, `filetype.vim`을 가지고 놀다 보면 `hello.plaindonut`을 열 때 이 파일이 여러 번 실행되는 것을 알 수 있습니다. 이를 방지하기 위해 메인 스크립트가 한 번만 실행되도록 가드를 추가할 수 있습니다. `filetype.vim`을 업데이트하세요:

```shell
if exists("did_load_filetypes")
  finish
endif

augroup donutfiletypedetection
  autocmd! BufRead,BufNewFile *.plaindonut setfiletype plaindonut
augroup END
```

`finish`는 나머지 스크립트 실행을 중단하는 Vim 명령입니다. `"did_load_filetypes"` 표현식은 *내장된* Vim 함수가 아닙니다. 사실 `$VIMRUNTIME/filetype.vim` 내부의 전역 변수입니다. 궁금하다면 `:e $VIMRUNTIME/filetype.vim`을 실행해 보세요. 그 안에 다음과 같은 줄을 찾을 수 있습니다:

```shell
if exists("did_load_filetypes")
  finish
endif

let did_load_filetypes = 1
```

Vim이 이 파일을 호출할 때, `did_load_filetypes` 변수를 정의하고 1로 설정합니다. 1은 Vim에서 참으로 간주됩니다. `filetype.vim`의 나머지 부분도 읽어보세요. Vim이 호출할 때 어떤 일을 하는지 이해할 수 있는지 확인해 보세요.

### 파일 유형 스크립트

파일 내용을 기반으로 파일 유형을 탐지하고 할당하는 방법을 배워봅시다.

동의할 수 없는 확장자를 가진 파일 모음이 있다고 가정해 보겠습니다. 이 파일들이 공통적으로 가지고 있는 유일한 점은 모두 첫 번째 줄에 "donutify"라는 단어로 시작한다는 것입니다. 이러한 파일들을 `donut` 파일 유형으로 할당하고 싶습니다. 확장자 없이 `sugardonut`, `glazeddonut`, `frieddonut`라는 새 파일을 만드세요. 각 파일에 다음 줄을 추가하세요:

```shell
donutify
```

`sugardonut` 내부에서 `:set filetype?`를 실행하면 Vim은 이 파일에 어떤 파일 유형을 할당해야 할지 모릅니다. `filetype=`가 반환됩니다.

런타임 루트 경로에 `scripts.vim` 파일을 추가하세요 (`~/.vim/scripts.vim`). 그 안에 다음을 추가하세요:

```shell
if did_filetype()
  finish
endif

if getline(1) =~ '^\\<donutify\\>'
  setfiletype donut
endif
```

함수 `getline(1)`은 첫 번째 줄의 텍스트를 반환합니다. 첫 번째 줄이 "donutify"라는 단어로 시작하는지 확인합니다. 함수 `did_filetype()`은 Vim의 내장 함수입니다. 파일 유형 관련 이벤트가 최소한 한 번 트리거되면 true를 반환합니다. 이는 파일 유형 이벤트가 다시 실행되지 않도록 하는 가드로 사용됩니다.

`sugardonut` 파일을 열고 `:set filetype?`를 실행하면 이제 Vim은 `filetype=donut`을 반환합니다. 다른 도넛 파일(`glazeddonut` 및 `frieddonut`)을 열면 Vim도 이들의 파일 유형을 `donut` 유형으로 식별합니다.

`scripts.vim`은 Vim이 알려지지 않은 파일 유형의 파일을 열 때만 실행됩니다. Vim이 알려진 파일 유형의 파일을 열면 `scripts.vim`은 실행되지 않습니다.

## 파일 유형 플러그인

도넛 파일을 열 때 chocodonut 전용 스크립트를 실행하고 plaindonut 파일을 열 때는 실행하지 않도록 하려면 어떻게 해야 할까요?

파일 유형 플러그인 런타임 경로(`~/.vim/ftplugin/`)를 사용하여 이를 수행할 수 있습니다. Vim은 이 디렉토리에서 방금 열린 파일 유형과 동일한 이름의 파일을 찾습니다. `chocodonut.vim`을 만드세요 (`~/.vim/ftplugin/chocodonut.vim`):

```shell
echo "Calling from chocodonut ftplugin"
```

또 다른 ftplugin 파일인 `plaindonut.vim`을 만드세요 (`~/.vim/ftplugin/plaindonut.vim`):

```shell
echo "Calling from plaindonut ftplugin"
```

이제 chocodonut 파일 유형을 열 때마다 Vim은 `~/.vim/ftplugin/chocodonut.vim`의 스크립트를 실행합니다. plaindonut 파일 유형을 열 때마다 Vim은 `~/.vim/ftplugin/plaindonut.vim`의 스크립트를 실행합니다.

한 가지 경고: 이러한 파일은 버퍼 파일 유형이 설정될 때마다 실행됩니다(`set filetype=chocodonut`와 같은). 서로 다른 3개의 chocodonut 파일을 열면 스크립트가 총 3번 실행됩니다.

## 들여쓰기 파일

Vim에는 ftplugin과 유사하게 작동하는 들여쓰기 런타임 경로가 있습니다. Vim은 열린 파일 유형과 동일한 이름의 파일을 찾습니다. 이러한 들여쓰기 런타임 경로의 목적은 들여쓰기 관련 코드를 저장하는 것입니다. `~/.vim/indent/chocodonut.vim` 파일이 있으면 chocodonut 파일 유형을 열 때만 실행됩니다. 여기에서 chocodonut 파일에 대한 들여쓰기 관련 코드를 저장할 수 있습니다.

## 색상

Vim에는 색상 스킴을 저장하기 위한 색상 런타임 경로(`~/.vim/colors/`)가 있습니다. 이 디렉토리에 들어가는 모든 파일은 `:color` 명령줄 명령에서 표시됩니다.

`~/.vim/colors/beautifulprettycolors.vim` 파일이 있는 경우 `:color`를 실행하고 Tab을 누르면 `beautifulprettycolors`가 색상 옵션 중 하나로 표시됩니다. 자신만의 색상 스킴을 추가하고 싶다면 이곳이 적합합니다.

다른 사람들이 만든 색상 스킴을 확인하고 싶다면 [vimcolors](https://vimcolors.com/)를 방문해 보세요.

## 구문 강조

Vim에는 구문 강조를 정의하기 위한 구문 런타임 경로(`~/.vim/syntax/`)가 있습니다.

`hello.chocodonut` 파일이 있다고 가정해 보겠습니다. 그 안에는 다음과 같은 표현식이 있습니다:

```shell
(donut "tasty")
(donut "savory")
```

Vim이 이제 올바른 파일 유형을 알고 있지만 모든 텍스트가 동일한 색상입니다. "donut" 키워드를 강조하기 위해 구문 강조 규칙을 추가해 보겠습니다. 새로운 chocodonut 구문 파일인 `~/.vim/syntax/chocodonut.vim`을 만드세요. 그 안에 다음을 추가하세요:

```shell
syntax keyword donutKeyword donut

highlight link donutKeyword Keyword
```

이제 `hello.chocodonut` 파일을 다시 열어보세요. 이제 `donut` 키워드가 강조 표시됩니다.

이 장에서는 구문 강조에 대해 깊이 다루지 않습니다. 이는 방대한 주제입니다. 궁금하다면 `:h syntax.txt`를 확인해 보세요.

[vim-polyglot](https://github.com/sheerun/vim-polyglot) 플러그인은 많은 인기 프로그래밍 언어에 대한 강조 표시를 제공하는 훌륭한 플러그인입니다.

## 문서화

플러그인을 만들면 자신의 문서를 만들어야 합니다. 이를 위해 doc 런타임 경로를 사용합니다.

chocodonut 및 plaindonut 키워드에 대한 기본 문서를 만들어 보겠습니다. `donut.txt`를 만드세요 (`~/.vim/doc/donut.txt`). 그 안에 다음 텍스트를 추가하세요:

```shell
*chocodonut* Delicious chocolate donut

*plaindonut* No choco goodness but still delicious nonetheless
```

`chocodonut` 및 `plaindonut`을 검색해 보세요 (`:h chocodonut` 및 `:h plaindonut`). 아무것도 찾을 수 없습니다.

먼저 `:helptags`를 실행하여 새 도움말 항목을 생성해야 합니다. `:helptags ~/.vim/doc/`를 실행하세요.

이제 `:h chocodonut` 및 `:h plaindonut`을 실행하면 이러한 새 도움말 항목을 찾을 수 있습니다. 파일이 이제 읽기 전용이며 "도움말" 파일 유형이 있음을 확인하세요.
## 지연 로딩 스크립트

이 장에서 배운 모든 런타임 경로는 자동으로 실행되었습니다. 스크립트를 수동으로 로드하려면 자동 로드 런타임 경로를 사용하세요.

자동 로드 디렉토리(`~/.vim/autoload/`)를 만드세요. 그 디렉토리 안에 새 파일을 만들고 이름을 `tasty.vim`(`~/.vim/autoload/tasty.vim`)으로 지정하세요. 그 안에:

```shell
echo "tasty.vim global"

function tasty#donut()
  echo "tasty#donut"
endfunction
```

함수 이름은 `tasty#donut`이며, `donut()`가 아닙니다. 자동 로드 기능을 사용할 때는 샵 기호(`#`)가 필요합니다. 자동 로드 기능의 함수 명명 규칙은 다음과 같습니다:

```shell
function fileName#functionName()
  ...
endfunction
```

이 경우 파일 이름은 `tasty.vim`이고 함수 이름은 (정확히 말하면) `donut`입니다.

함수를 호출하려면 `call` 명령이 필요합니다. `:call tasty#donut()`으로 그 함수를 호출해 보세요.

함수를 처음 호출할 때는 *두 개*의 에코 메시지("tasty.vim global" 및 "tasty#donut")가 표시되어야 합니다. 이후의 `tasty#donut` 함수 호출은 "testy#donut" 에코만 표시됩니다.

Vim에서 파일을 열 때, 이전 런타임 경로와 달리 자동 로드 스크립트는 자동으로 로드되지 않습니다. `tasty#donut()`를 명시적으로 호출할 때만 Vim은 `tasty.vim` 파일을 찾아 그 안의 모든 것을 로드합니다. 자동 로드는 자원을 많이 사용하는 함수에 적합하지만 자주 사용하지 않는 경우에 유용합니다.

원하는 만큼 중첩된 디렉토리를 자동 로드로 추가할 수 있습니다. 런타임 경로가 `~/.vim/autoload/one/two/three/tasty.vim`인 경우, `:call one#two#three#tasty#donut()`으로 함수를 호출할 수 있습니다.

## 후처리 스크립트

Vim에는 `~/.vim/after/`라는 후처리 런타임 경로가 있으며, 이는 `~/.vim/`의 구조를 반영합니다. 이 경로의 모든 것은 마지막에 실행되므로 개발자들은 일반적으로 스크립트 오버라이드를 위해 이러한 경로를 사용합니다.

예를 들어, `plugin/chocolate.vim`의 스크립트를 덮어쓰고 싶다면, `~/.vim/after/plugin/chocolate.vim`을 만들어 오버라이드 스크립트를 넣을 수 있습니다. Vim은 `~/.vim/plugin/chocolate.vim` *후에* `~/.vim/after/plugin/chocolate.vim`을 실행합니다.

## $VIMRUNTIME

Vim에는 기본 스크립트 및 지원 파일을 위한 환경 변수 `$VIMRUNTIME`가 있습니다. `:e $VIMRUNTIME`을 실행하여 확인할 수 있습니다.

구조는 익숙할 것입니다. 이곳에는 이 장에서 배운 많은 런타임 경로가 포함되어 있습니다.

21장에서 Vim을 열 때, Vim이 일곱 개의 서로 다른 위치에서 vimrc 파일을 찾는다는 것을 배웠습니다. Vim이 마지막으로 확인하는 위치는 `$VIMRUNTIME/defaults.vim`이라고 말했습니다. Vim이 사용자 vimrc 파일을 찾지 못하면, Vim은 `defaults.vim`을 vimrc로 사용합니다.

vim-polyglot과 같은 구문 플러그인 없이 Vim을 실행해 본 적이 있나요? 그럼에도 불구하고 파일이 여전히 구문 강조가 되는 이유는, Vim이 런타임 경로에서 구문 파일을 찾지 못할 경우, `$VIMRUNTIME` 구문 디렉토리에서 구문 파일을 찾기 때문입니다.

더 알아보려면 `:h $VIMRUNTIME`을 확인하세요.

## 런타임 경로 옵션

런타임 경로를 확인하려면 `:set runtimepath?`를 실행하세요.

Vim-Plug 또는 인기 있는 외부 플러그인 관리자를 사용하는 경우, 디렉토리 목록이 표시됩니다. 예를 들어, 제 경우는 다음과 같이 표시됩니다:

```shell
runtimepath=~/.vim,~/.vim/plugged/vim-signify,~/.vim/plugged/base16-vim,~/.vim/plugged/fzf.vim,~/.vim/plugged/fzf,~/.vim/plugged/vim-gutentags,~/.vim/plugged/tcomment_vim,~/.vim/plugged/emmet-vim,~/.vim/plugged/vim-fugitive,~/.vim/plugged/vim-sensible,~/.vim/plugged/lightline.vim, ...
```

플러그인 관리자가 하는 일 중 하나는 각 플러그인을 런타임 경로에 추가하는 것입니다. 각 런타임 경로는 `~/.vim/`와 유사한 자체 디렉토리 구조를 가질 수 있습니다.

`~/box/of/donuts/`라는 디렉토리가 있고 그 디렉토리를 런타임 경로에 추가하고 싶다면, vimrc에 다음을 추가할 수 있습니다:

```shell
set rtp+=$HOME/box/of/donuts/
```

`~/box/of/donuts/` 안에 플러그인 디렉토리(`~/box/of/donuts/plugin/hello.vim`)와 ftplugin(`~/box/of/donuts/ftplugin/chocodonut.vim`)이 있다면, Vim을 열 때 `plugin/hello.vim`의 모든 스크립트를 실행합니다. 또한, chocodonut 파일을 열 때 `ftplugin/chocodonut.vim`도 실행합니다.

직접 시도해 보세요: 임의의 경로를 만들고 런타임 경로에 추가하세요. 이 장에서 배운 런타임 경로 중 일부를 추가하세요. 예상대로 작동하는지 확인하세요.

## 스마트한 방법으로 런타임 배우기

시간을 들여 읽고 이러한 런타임 경로를 가지고 놀아보세요. 런타임 경로가 실제로 어떻게 사용되는지 보려면, 좋아하는 Vim 플러그인의 리포지토리로 가서 그 디렉토리 구조를 연구하세요. 이제 대부분을 이해할 수 있어야 합니다. 따라가며 큰 그림을 파악해 보세요. 이제 Vim 디렉토리 구조를 이해했으니, Vimscript를 배울 준비가 되었습니다.