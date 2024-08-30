---
description: 이 문서는 Vim 사용법을 배우고, vimrc 파일을 구성하고 정리하는 방법에 대해 설명합니다. Vim 설정을 최적화하는 방법을
  알아보세요.
title: Ch22. Vimrc
---

이전 장에서는 Vim을 사용하는 방법을 배웠습니다. 이번 장에서는 vimrc를 구성하고 설정하는 방법을 배울 것입니다.

## Vim이 Vimrc를 찾는 방법

vimrc에 대한 일반적인 지침은 홈 디렉토리 `~/.vimrc`에 `.vimrc` 도트 파일을 추가하는 것입니다(운영 체제에 따라 다를 수 있습니다).

Vim은 비공식적으로 vimrc 파일을 찾기 위해 여러 위치를 확인합니다. Vim이 확인하는 위치는 다음과 같습니다:
- `$VIMINIT`
- `$HOME/.vimrc`
- `$HOME/.vim/vimrc`
- `$EXINIT`
- `$HOME/.exrc`
- `$VIMRUNTIME/defaults.vim`

Vim을 시작하면 위의 여섯 위치를 그 순서대로 vimrc 파일을 확인합니다. 처음 발견된 vimrc 파일이 사용되며 나머지는 무시됩니다.

먼저 Vim은 `$VIMINIT`를 찾습니다. 거기에 아무것도 없으면 Vim은 `$HOME/.vimrc`를 확인합니다. 거기에 아무것도 없으면 Vim은 `$HOME/.vim/vimrc`를 확인합니다. Vim이 그것을 찾으면 더 이상 찾지 않고 `$HOME/.vim/vimrc`를 사용합니다.

첫 번째 위치인 `$VIMINIT`는 환경 변수입니다. 기본적으로 정의되지 않습니다. `~/dotfiles/testvimrc`를 `$VIMINIT` 값으로 사용하려면 해당 vimrc의 경로를 포함하는 환경 변수를 생성할 수 있습니다. `export VIMINIT='let $MYVIMRC="$HOME/dotfiles/testvimrc" | source $MYVIMRC'`를 실행한 후, Vim은 이제 `~/dotfiles/testvimrc`를 vimrc 파일로 사용합니다.

두 번째 위치인 `$HOME/.vimrc`는 많은 Vim 사용자에게 일반적인 경로입니다. `$HOME`은 대부분의 경우 홈 디렉토리(`~`)입니다. `~/.vimrc` 파일이 있다면 Vim은 이를 vimrc 파일로 사용합니다.

세 번째 위치인 `$HOME/.vim/vimrc`는 `~/.vim` 디렉토리 안에 있습니다. 플러그인, 사용자 정의 스크립트 또는 뷰 파일을 위해 이미 `~/.vim` 디렉토리가 있을 수 있습니다. vimrc 파일 이름에 점이 없다는 점에 유의하세요(`$HOME/.vim/.vimrc`는 작동하지 않지만 `$HOME/.vim/vimrc`는 작동합니다).

네 번째 위치인 `$EXINIT`는 `$VIMINIT`와 유사하게 작동합니다.

다섯 번째 위치인 `$HOME/.exrc`는 `$HOME/.vimrc`와 유사하게 작동합니다.

여섯 번째 위치인 `$VIMRUNTIME/defaults.vim`은 Vim 빌드와 함께 제공되는 기본 vimrc입니다. 제 경우에는 Homebrew를 사용하여 Vim 8.2를 설치했으므로 경로는 (`/usr/local/share/vim/vim82`)입니다. Vim이 이전의 여섯 vimrc 파일을 찾지 못하면 이 파일을 사용합니다.

이번 장의 나머지 부분에서는 vimrc가 `~/.vimrc` 경로를 사용한다고 가정하겠습니다.

## 내 Vimrc에 무엇을 넣어야 하나요?

제가 시작할 때 했던 질문은 "내 vimrc에 무엇을 넣어야 하나요?"였습니다.

답은 "원하는 무엇이든"입니다. 다른 사람의 vimrc를 복사-붙여넣기 하고 싶은 유혹이 있지만, 이를 저항해야 합니다. 다른 사람의 vimrc를 사용하고 싶다면, 그것이 무엇을 하는지, 왜 그리고 어떻게 사용하는지, 그리고 가장 중요한 것은 그것이 당신과 관련이 있는지를 알아야 합니다. 누군가가 사용한다고 해서 당신도 사용할 것이라는 의미는 아닙니다.

## 기본 Vimrc 내용

간단히 말해, vimrc는 다음의 모음입니다:
- 플러그인
- 설정
- 사용자 정의 함수
- 사용자 정의 명령
- 매핑

위에서 언급되지 않은 다른 것들도 있지만, 일반적으로 이것이 대부분의 사용 사례를 포함합니다.

### 플러그인

이전 장에서는 [fzf.vim](https://github.com/junegunn/fzf.vim), [vim-mundo](https://github.com/simnalamburt/vim-mundo), [vim-fugitive](https://github.com/tpope/vim-fugitive)와 같은 다양한 플러그인에 대해 언급했습니다.

10년 전에는 플러그인 관리가 악몽이었습니다. 그러나 현대 플러그인 관리자의 출현으로 이제 플러그인을 몇 초 만에 설치할 수 있습니다. 현재 저는 [vim-plug](https://github.com/junegunn/vim-plug)를 플러그인 관리자로 사용하고 있으므로 이 섹션에서는 이를 사용할 것입니다. 다른 인기 있는 플러그인 관리자와 개념은 유사할 것입니다. 다음과 같은 다양한 플러그인 관리자를 확인해 보시기를 강력히 추천합니다:
- [vundle.vim](https://github.com/VundleVim/Vundle.vim)
- [vim-pathogen](https://github.com/tpope/vim-pathogen)
- [dein.vim](https://github.com/Shougo/dein.vim)

위에 나열된 것보다 더 많은 플러그인 관리자가 있으니 자유롭게 둘러보세요. vim-plug를 설치하려면 Unix 머신이 있다면 다음 명령을 실행하세요:

```shell
curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

새로운 플러그인을 추가하려면 `call plug#begin()`과 `call plug#end()` 줄 사이에 플러그인 이름(`Plug 'github-username/repository-name'`)을 넣습니다. 따라서 `emmet-vim`과 `nerdtree`를 설치하려면 vimrc에 다음 코드를 추가하세요:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

변경 사항을 저장하고, 소스(`:source %`)를 실행한 후 `:PlugInstall`을 실행하여 설치합니다.

앞으로 사용하지 않는 플러그인을 제거해야 할 경우, `call` 블록에서 플러그인 이름을 제거하고 저장한 후 소스를 실행하고 `:PlugClean` 명령을 실행하여 머신에서 제거하면 됩니다.

Vim 8에는 자체 내장 패키지 관리자가 있습니다. 자세한 내용은 `:h packages`를 확인하세요. 다음 장에서는 이를 사용하는 방법을 보여드리겠습니다.

### 설정

어떤 vimrc에서도 많은 `set` 옵션을 보는 것은 일반적입니다. 명령 모드에서 set 명령을 실행하면 영구적이지 않습니다. Vim을 닫으면 잃게 됩니다. 예를 들어, 매번 Vim을 실행할 때마다 `:set relativenumber number`를 실행하는 대신, vimrc에 다음을 넣을 수 있습니다:

```shell
set relativenumber number
```

일부 설정은 값이 필요합니다. 예를 들어, `set tabstop=2`와 같이요. 각 설정이 어떤 종류의 값을 허용하는지 알아보려면 도움말 페이지를 확인하세요.

`set` 대신 `let`을 사용할 수도 있습니다(앞에 `&`를 붙여야 합니다). `let`을 사용하면 표현식을 값으로 사용할 수 있습니다. 예를 들어, 경로가 존재할 경우에만 `'dictionary'` 옵션을 설정하려면:

```shell
let s:english_dict = "/usr/share/dict/words"

if filereadable(s:english_dict)
  let &dictionary=s:english_dict
endif
```

Vimscript 할당 및 조건문에 대해서는 후속 장에서 배울 것입니다.

Vim에서 가능한 모든 옵션 목록은 `:h E355`를 확인하세요.

### 사용자 정의 함수

vimrc는 사용자 정의 함수를 위한 좋은 장소입니다. 나중 장에서 자신만의 Vimscript 함수를 작성하는 방법을 배울 것입니다.

### 사용자 정의 명령

`command`를 사용하여 사용자 정의 명령줄 명령을 만들 수 있습니다.

오늘 날짜를 표시하는 기본 명령 `GimmeDate`를 만들려면:

```shell
:command! GimmeDate echo call("strftime", ["%F"])
```

`:GimmeDate`를 실행하면 Vim은 "2021-01-1"과 같은 날짜를 표시합니다.

입력이 있는 기본 명령을 만들려면 `<args>`를 사용할 수 있습니다. 특정 시간/날짜 형식을 `GimmeDate`에 전달하려면:

```shell
:command! GimmeDate echo call("strftime", [<args>])

:GimmeDate "%F"
" 2020-01-01

:GimmeDate "%H:%M"
" 11:30
```

인수의 수를 제한하려면 `-nargs` 플래그를 전달할 수 있습니다. 인수를 전달하지 않으려면 `-nargs=0`, 하나의 인수를 전달하려면 `-nargs=1`, 최소 하나의 인수를 전달하려면 `-nargs=+`, 임의의 수의 인수를 전달하려면 `-nargs=*`, 0 또는 하나의 인수를 전달하려면 `-nargs=?`를 사용합니다. n번째 인수를 전달하려면 `-nargs=n`(여기서 `n`은 정수)로 사용합니다.

`<args>`에는 두 가지 변형이 있습니다: `<f-args>`와 `<q-args>`. 전자는 Vimscript 함수에 인수를 전달하는 데 사용됩니다. 후자는 사용자 입력을 자동으로 문자열로 변환하는 데 사용됩니다.

`args` 사용하기:

```shell
:command! -nargs=1 Hello echo "Hello " . <args>
:Hello "Iggy"
" returns 'Hello Iggy'

:Hello Iggy
" Undefined variable error
```

`q-args` 사용하기:

```shell
:command! -nargs=1 Hello echo "Hello " . <q-args>
:Hello Iggy
" returns 'Hello Iggy'
```

`f-args` 사용하기:

```shell
:function! PrintHello(person1, person2)
:  echo "Hello " . a:person1 . " and " . a:person2
:endfunction

:command! -nargs=* Hello call PrintHello(<f-args>)

:Hello Iggy1 Iggy2
" returns "Hello Iggy1 and Iggy2"
```

위의 함수들은 Vimscript 함수 장에 도달하면 훨씬 더 의미가 있을 것입니다.

명령 및 인수에 대한 자세한 내용을 알아보려면 `:h command` 및 `:args`를 확인하세요.
### 맵

복잡한 작업을 반복적으로 수행해야 한다면, 해당 작업에 대한 매핑을 생성해야 한다는 좋은 지표입니다.

예를 들어, 저는 vimrc에 다음 두 개의 매핑을 가지고 있습니다:

```shell
nnoremap <silent> <C-f> :GFiles<CR>

nnoremap <Leader>tn :call ToggleNumber()<CR>
```

첫 번째 매핑에서는 `Ctrl-F`를 [fzf.vim](https://github.com/junegunn/fzf.vim) 플러그인의 `:Gfiles` 명령(빠르게 Git 파일 검색)으로 매핑합니다. 두 번째 매핑에서는 `<Leader>tn`을 사용자 정의 함수 `ToggleNumber`를 호출하도록 매핑합니다(`norelativenumber`와 `relativenumber` 옵션을 전환). `Ctrl-F` 매핑은 Vim의 기본 페이지 스크롤을 덮어씁니다. 매핑이 충돌할 경우, 귀하의 매핑이 Vim의 기본 제어를 덮어씁니다. 저는 그 기능을 거의 사용하지 않기 때문에 덮어쓰는 것이 안전하다고 판단했습니다.

그런데 `<Leader>tn`에서 이 "리더" 키는 무엇인가요?

Vim에는 매핑을 돕기 위한 리더 키가 있습니다. 예를 들어, 저는 `<Leader>tn`을 사용하여 `ToggleNumber()` 함수를 실행하도록 매핑했습니다. 리더 키가 없다면 `tn`을 사용했겠지만, Vim은 이미 `t`(탐색을 위한 "till")를 가지고 있습니다. 리더 키를 사용하면 기존 명령과 충돌하지 않고 리더로 지정된 키를 누른 다음 `tn`을 누를 수 있습니다. 리더 키는 매핑 조합을 시작하기 위해 설정할 수 있는 키입니다. 기본적으로 Vim은 백슬래시를 리더 키로 사용합니다(따라서 `<Leader>tn`은 "백슬래시-t-n"이 됩니다).

저는 개인적으로 백슬래시 기본값 대신 `<Space>`를 리더 키로 사용하는 것을 좋아합니다. 리더 키를 변경하려면 vimrc에 다음을 추가하세요:

```shell
let mapleader = "\<space>"
```

위에서 사용된 `nnoremap` 명령은 세 부분으로 나눌 수 있습니다:
- `n`은 일반 모드를 나타냅니다.
- `nore`는 비재귀적임을 의미합니다.
- `map`은 매핑 명령입니다.

최소한 `nmap`을 대신 사용할 수 있었습니다(`nmap <silent> <C-f> :Gfiles<CR>`). 그러나 잠재적인 무한 루프를 피하기 위해 비재귀 변형을 사용하는 것이 좋은 습관입니다.

비재귀적으로 매핑하지 않으면 어떤 일이 발생할 수 있는지 보겠습니다. 예를 들어, `B`에 매핑을 추가하여 줄 끝에 세미콜론을 추가한 다음 한 WORD 뒤로 돌아가고 싶다고 가정해 보겠습니다(기억하세요, Vim에서 `B`는 한 WORD 뒤로 가는 일반 모드 탐색 키입니다).

```shell
nmap B A;<esc>B
```

`B`를 누르면... 오, 안돼! Vim이 `;`를 제어할 수 없이 추가합니다(이를 `Ctrl-C`로 중단하세요). 왜 이런 일이 발생했을까요? 매핑 `A;<esc>B`에서 `B`는 Vim의 기본 `B` 기능(한 WORD 뒤로 가기)을 참조하는 것이 아니라 매핑된 함수를 참조하기 때문입니다. 실제로는 다음과 같습니다:

```shell
A;<esc>A;<esc>A;<esc>A;esc>...
```

이 문제를 해결하려면 비재귀 매핑을 추가해야 합니다:

```shell
nnoremap B A;<esc>B
```

이제 `B`를 다시 호출해 보세요. 이번에는 줄 끝에 `;`를 성공적으로 추가하고 한 WORD 뒤로 돌아갑니다. 이 매핑에서 `B`는 Vim의 원래 `B` 기능을 나타냅니다.

Vim은 모드에 따라 다른 매핑을 가지고 있습니다. 삽입 모드에서 `jk`를 눌러 삽입 모드를 종료하는 매핑을 만들고 싶다면:

```shell
inoremap jk <esc>
```

다른 매핑 모드는 다음과 같습니다: `map` (일반, 비주얼, 선택, 연산자 대기), `vmap` (비주얼 및 선택), `smap` (선택), `xmap` (비주얼), `omap` (연산자 대기), `map!` (삽입 및 명령줄), `lmap` (삽입, 명령줄, Lang-arg), `cmap` (명령줄), `tmap` (터미널 작업). 자세히 다루지는 않겠습니다. 더 알고 싶다면 `:h map.txt`를 확인하세요.

가장 직관적이고 일관되며 기억하기 쉬운 매핑을 만드세요.

## Vimrc 정리하기

시간이 지나면서 vimrc는 커지고 복잡해질 것입니다. vimrc를 깔끔하게 유지하는 방법은 두 가지가 있습니다:
- vimrc를 여러 파일로 나누기.
- vimrc 파일을 접기.

### vimrc 나누기

Vim의 `source` 명령을 사용하여 vimrc를 여러 파일로 나눌 수 있습니다. 이 명령은 주어진 파일 인수에서 명령줄 명령을 읽습니다.

`~/.vim` 디렉토리 안에 파일을 만들고 `/settings`(`~/.vim/settings`)라고 이름을 붙여 보겠습니다. 이름은 임의로 정할 수 있으며 원하는 대로 이름을 붙일 수 있습니다.

다음 네 가지 구성 요소로 나누겠습니다:
- 서드파티 플러그인 (`~/.vim/settings/plugins.vim`).
- 일반 설정 (`~/.vim/settings/configs.vim`).
- 사용자 정의 함수 (`~/.vim/settings/functions.vim`).
- 키 매핑 (`~/.vim/settings/mappings.vim`) .

`~/.vimrc` 안에:

```shell
source $HOME/.vim/settings/plugins.vim
source $HOME/.vim/settings/configs.vim
source $HOME/.vim/settings/functions.vim
source $HOME/.vim/settings/mappings.vim
```

경로 아래에 커서를 두고 `gf`를 눌러 이 파일들을 편집할 수 있습니다.

`~/.vim/settings/plugins.vim` 안에:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

`~/.vim/settings/configs.vim` 안에:

```shell
set nocompatible
set relativenumber
set number
```

`~/.vim/settings/functions.vim` 안에:

```shell
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
```

`~/.vim/settings/mappings.vim` 안에:

```shell
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
```

이제 vimrc는 평소처럼 작동해야 하지만, 이제는 단 4줄로 줄어들었습니다!

이 설정으로 인해 어디로 가야 할지 쉽게 알 수 있습니다. 더 많은 매핑을 추가해야 한다면 `/mappings.vim` 파일에 추가하세요. 앞으로 vimrc가 커짐에 따라 더 많은 디렉토리를 추가할 수 있습니다. 예를 들어, 색상 테마에 대한 설정을 생성해야 한다면 `~/.vim/settings/themes.vim`을 추가할 수 있습니다.

### 하나의 vimrc 파일 유지하기

하나의 vimrc 파일을 유지하여 휴대성을 원하신다면, 마커 접기를 사용하여 정리할 수 있습니다. vimrc의 맨 위에 다음을 추가하세요:

```shell
" setup folds {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}
```

Vim은 현재 버퍼의 파일 유형을 감지할 수 있습니다(`:set filetype?`). 만약 `vim` 파일 유형이라면, 마커 접기 방법을 사용할 수 있습니다. 마커 접기는 `{{{`와 `}}}`를 사용하여 시작 및 종료 접기를 나타냅니다.

vimrc의 나머지 부분에 `{{{`와 `}}}` 접기를 추가하세요(주석으로 `"`를 잊지 마세요):

```shell
" setup folds {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}

" plugins {{{
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
" }}}

" configs {{{
set nocompatible
set relativenumber
set number
" }}}

" functions {{{
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
" }}}

" mappings {{{
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
" }}}
```

당신의 vimrc는 다음과 같아야 합니다:

```shell
+-- 6 lines: setup folds -----

+-- 6 lines: plugins ---------

+-- 5 lines: configs ---------

+-- 9 lines: functions -------

+-- 5 lines: mappings --------
```

## Vim을 vimrc 및 플러그인 없이 실행하기

vimrc와 플러그인 없이 Vim을 실행해야 한다면, 다음을 실행하세요:

```shell
vim -u NONE
```

vimrc 없이 플러그인만으로 Vim을 실행해야 한다면, 다음을 실행하세요:

```shell
vim -u NORC
```

vimrc는 있지만 플러그인 없이 Vim을 실행해야 한다면, 다음을 실행하세요:

```shell
vim --noplugin
```

다른 vimrc, 예를 들어 `~/.vimrc-backup`으로 Vim을 실행해야 한다면, 다음을 실행하세요:

```shell
vim -u ~/.vimrc-backup
```

플러그인 없이 `defaults.vim`만으로 Vim을 실행해야 한다면, 이는 손상된 vimrc를 수정하는 데 유용합니다:

```shell
vim --clean
```

## 스마트하게 Vimrc 구성하기

Vimrc는 Vim 사용자 정의의 중요한 구성 요소입니다. vimrc를 구축하는 좋은 방법은 다른 사람들의 vimrc를 읽고 점진적으로 구축하는 것입니다. 최고의 vimrc는 개발자 X가 사용하는 것이 아니라, 당신의 사고 프레임워크와 편집 스타일에 정확히 맞춰진 것입니다.