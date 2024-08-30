---
description: 이 장에서는 Vim에서 빠르게 검색하는 방법을 소개합니다. 플러그인 없이와 fzf.vim 플러그인을 사용하여 검색하는 방법을
  배웁니다.
title: Ch03. Searching Files
---

이 장의 목표는 Vim에서 빠르게 검색하는 방법에 대한 소개를 제공하는 것입니다. 빠르게 검색할 수 있는 능력은 Vim 생산성을 높이는 훌륭한 방법입니다. 파일을 빠르게 검색하는 방법을 알아냈을 때, 저는 Vim을 전업으로 사용하기로 전환했습니다.

이 장은 두 부분으로 나뉩니다: 플러그인 없이 검색하는 방법과 [fzf.vim](https://github.com/junegunn/fzf.vim) 플러그인을 사용하여 검색하는 방법입니다. 시작해 보겠습니다!

## 파일 열기 및 편집하기

Vim에서 파일을 열려면 `:edit`를 사용할 수 있습니다.

```shell
:edit file.txt
```

`file.txt`가 존재하면 `file.txt` 버퍼가 열립니다. `file.txt`가 존재하지 않으면 `file.txt`에 대한 새로운 버퍼가 생성됩니다.

`<Tab>`를 사용한 자동 완성은 `:edit`와 함께 작동합니다. 예를 들어, 파일이 [Rails](https://rubyonrails.org/) *a*pp *c*ontroller *u*sers 컨트롤러 디렉토리 `./app/controllers/users_controllers.rb`에 있는 경우, `<Tab>`를 사용하여 용어를 빠르게 확장할 수 있습니다:

```shell
:edit a<Tab>c<Tab>u<Tab>
```

`:edit`는 와일드카드 인수를 허용합니다. `*`는 현재 디렉토리의 모든 파일과 일치합니다. 현재 디렉토리에서 `.yml` 확장자를 가진 파일만 찾고 싶다면:

```shell
:edit *.yml<Tab>
```

Vim은 현재 디렉토리의 모든 `.yml` 파일 목록을 제공합니다.

`**`를 사용하여 재귀적으로 검색할 수 있습니다. 프로젝트 내의 모든 `*.md` 파일을 찾고 싶지만 어떤 디렉토리에 있는지 확실하지 않은 경우, 다음과 같이 할 수 있습니다:

```shell
:edit **/*.md<Tab>
```

`:edit`는 Vim의 내장 파일 탐색기인 `netrw`를 실행하는 데 사용할 수 있습니다. 그렇게 하려면 파일 대신 디렉토리 인수를 `:edit`에 제공하면 됩니다:

```shell
:edit .
:edit test/unit/
```

## 파일 검색하기

`:find`를 사용하여 파일을 찾을 수 있습니다. 예를 들어:

```shell
:find package.json
:find app/controllers/users_controller.rb
```

자동 완성은 `:find`에서도 작동합니다:

```shell
:find p<Tab>                " package.json 찾기
:find a<Tab>c<Tab>u<Tab>    " app/controllers/users_controller.rb 찾기
```

`:find`가 `:edit`와 비슷하다는 것을 알 수 있습니다. 차이점은 무엇일까요?

## 찾기와 경로

차이점은 `:find`가 `path`에서 파일을 찾는 반면, `:edit`는 그렇지 않다는 것입니다. `path`를 수정하는 방법을 배우면 `:find`는 강력한 검색 도구가 될 수 있습니다. 현재 경로를 확인하려면:

```shell
:set path?
```

기본적으로 여러분의 경로는 아마 다음과 같을 것입니다:

```shell
path=.,/usr/include,,
```

- `.`는 현재 열려 있는 파일의 디렉토리에서 검색하라는 의미입니다.
- `,`는 현재 디렉토리에서 검색하라는 의미입니다.
- `/usr/include`는 C 라이브러리 헤더 파일의 일반적인 디렉토리입니다.

첫 번째 두 가지는 우리 맥락에서 중요하며, 세 번째는 지금은 무시할 수 있습니다. 여기서 중요한 점은 Vim이 파일을 찾을 경로를 수정할 수 있다는 것입니다. 다음과 같은 프로젝트 구조가 있다고 가정해 봅시다:

```shell
app/
  assets/
  controllers/
    application_controller.rb
    comments_controller.rb
    users_controller.rb
    ...
```

루트 디렉토리에서 `users_controller.rb`로 가려면 여러 디렉토리를 거쳐야 합니다(상당한 양의 탭을 눌러야 함). 프레임워크로 작업할 때는 특정 디렉토리에서 90%의 시간을 보내는 경우가 많습니다. 이 상황에서는 최소한의 키 입력으로 `controllers/` 디렉토리로 가는 것이 중요합니다. `path` 설정을 통해 그 여정을 단축할 수 있습니다.

현재 `path`에 `app/controllers/`를 추가해야 합니다. 다음과 같이 할 수 있습니다:

```shell
:set path+=app/controllers/
```

이제 경로가 업데이트되었으므로 `:find u<Tab>`를 입력하면 Vim은 이제 "u"로 시작하는 파일을 `app/controllers/` 디렉토리에서 검색합니다.

중첩된 `controllers/` 디렉토리가 있는 경우, 예를 들어 `app/controllers/account/users_controller.rb`, Vim은 `users_controllers`를 찾지 못합니다. 대신 자동 완성이 `users_controller.rb`를 찾을 수 있도록 `:set path+=app/controllers/**`를 추가해야 합니다. 이것은 훌륭합니다! 이제 3번의 탭을 눌러야 했던 `users_controller`를 1번의 탭으로 찾을 수 있습니다.

전체 프로젝트 디렉토리를 추가하여 탭을 누를 때 Vim이 모든 곳에서 해당 파일을 검색하도록 하려는 생각이 들 수 있습니다. 다음과 같이 할 수 있습니다:

```shell
:set path+=$PWD/**
```

`$PWD`는 현재 작업 디렉토리입니다. 전체 프로젝트를 `path`에 추가하여 탭을 누를 때 모든 파일에 접근할 수 있도록 하려는 경우, 이는 작은 프로젝트에서는 작동할 수 있지만, 프로젝트에 파일이 많으면 검색 속도가 크게 느려질 것입니다. 저는 가장 자주 방문하는 파일/디렉토리의 `path`만 추가하는 것을 추천합니다.

`set path+={your-path-here}`를 vimrc에 추가할 수 있습니다. 경로를 업데이트하는 데는 몇 초밖에 걸리지 않으며, 그렇게 하면 많은 시간을 절약할 수 있습니다.

## grep으로 파일 검색하기

파일 내에서 찾기(파일 내 구문 찾기)가 필요하다면 grep을 사용할 수 있습니다. Vim에는 이를 수행하는 두 가지 방법이 있습니다:

- 내부 grep (`:vim`. 네, `:vim`이라고 쓰입니다. `:vimgrep`의 약자입니다).
- 외부 grep (`:grep`).

먼저 내부 grep에 대해 살펴보겠습니다. `:vim`의 구문은 다음과 같습니다:

```shell
:vim /pattern/ file
```

- `/pattern/`은 검색어의 정규 표현식 패턴입니다.
- `file`은 파일 인수입니다. 여러 인수를 전달할 수 있습니다. Vim은 파일 인수 내에서 패턴을 검색합니다. `:find`와 유사하게 `*` 및 `**` 와일드카드를 전달할 수 있습니다.

예를 들어, `app/controllers/` 디렉토리 내의 모든 루비 파일(`.rb`)에서 "breakfast" 문자열의 모든 발생을 찾으려면:

```shell
:vim /breakfast/ app/controllers/**/*.rb
```

이 명령을 실행한 후 첫 번째 결과로 리디렉션됩니다. Vim의 `vim` 검색 명령은 `quickfix` 작업을 사용합니다. 모든 검색 결과를 보려면 `:copen`을 실행하십시오. 이는 `quickfix` 창을 엽니다. 다음은 즉시 생산성을 높이는 데 유용한 몇 가지 quickfix 명령입니다:

```shell
:copen        quickfix 창 열기
:cclose       quickfix 창 닫기
:cnext        다음 오류로 이동
:cprevious    이전 오류로 이동
:colder       이전 오류 목록으로 이동
:cnewer       최신 오류 목록으로 이동
```

quickfix에 대해 더 알아보려면 `:h quickfix`를 확인하십시오.

내부 grep(`:vim`)을 실행할 때 많은 일치 항목이 있을 경우 느려질 수 있다는 점에 유의하십시오. 이는 Vim이 편집 중인 것처럼 각 일치하는 파일을 메모리에 로드하기 때문입니다. Vim이 검색과 일치하는 파일이 많으면 모두 로드하여 많은 메모리를 소비하게 됩니다.

이제 외부 grep에 대해 이야기해 보겠습니다. 기본적으로 `grep` 터미널 명령을 사용합니다. `app/controllers/` 디렉토리 내의 루비 파일에서 "lunch"를 검색하려면 다음과 같이 할 수 있습니다:

```shell
:grep -R "lunch" app/controllers/
```

여기서 `/pattern/` 대신에 터미널 grep 구문 `"pattern"`을 사용합니다. 또한 모든 일치를 `quickfix`를 사용하여 표시합니다.

Vim은 `:grep` Vim 명령을 실행할 때 어떤 외부 프로그램을 실행할지를 결정하기 위해 `grepprg` 변수를 정의합니다. 이를 통해 Vim을 닫고 터미널 `grep` 명령을 호출할 필요가 없습니다. 나중에 `:grep` Vim 명령을 사용할 때 호출되는 기본 프로그램을 변경하는 방법을 보여드리겠습니다.

## Netrw로 파일 탐색하기

`netrw`는 Vim의 내장 파일 탐색기입니다. 프로젝트의 계층 구조를 보는 데 유용합니다. `netrw`를 실행하려면 `.vimrc`에 다음 두 가지 설정이 필요합니다:

```shell
set nocp
filetype plugin on
```

`netrw`는 방대한 주제이므로 기본 사용법만 다루겠지만, 시작하는 데 충분할 것입니다. 파일 대신 디렉토리를 매개변수로 전달하여 Vim을 시작할 때 `netrw`를 시작할 수 있습니다. 예를 들어:

```shell
vim .
vim src/client/
vim app/controllers/
```

Vim 내부에서 `netrw`를 시작하려면 `:edit` 명령을 사용하고 파일 이름 대신 디렉토리 매개변수를 전달할 수 있습니다:

```shell
:edit .
:edit src/client/
:edit app/controllers/
```

디렉토리를 전달하지 않고 `netrw` 창을 시작하는 다른 방법도 있습니다:

```shell
:Explore     현재 파일에서 netrw 시작
:Sexplore    농담이 아닙니다. 화면의 상단 절반에서 netrw 시작
:Vexplore    화면의 왼쪽 절반에서 netrw 시작
```

Vim 동작으로 `netrw`를 탐색할 수 있습니다(동작은 이후 장에서 자세히 다룰 것입니다). 파일이나 디렉토리를 생성, 삭제 또는 이름을 바꾸려면 다음은 유용한 `netrw` 명령 목록입니다:

```shell
%    새 파일 생성
d    새 디렉토리 생성
R    파일 또는 디렉토리 이름 바꾸기
D    파일 또는 디렉토리 삭제
```

`:h netrw`는 매우 포괄적입니다. 시간이 있으면 확인해 보세요.

`netrw`가 너무 밋밋하고 더 많은 기능이 필요하다면, [vim-vinegar](https://github.com/tpope/vim-vinegar) 플러그인은 `netrw`를 개선하는 데 좋은 플러그인입니다. 다른 파일 탐색기를 찾고 있다면, [NERDTree](https://github.com/preservim/nerdtree)도 좋은 대안입니다. 확인해 보세요!

## Fzf

이제 Vim에서 내장 도구로 파일을 검색하는 방법을 배웠으니, 플러그인을 사용하여 검색하는 방법을 배워보겠습니다.

현대 텍스트 편집기가 잘하는 것 중 하나는 파일을 찾는 것이며, 특히 퍼지 검색을 통해 Vim이 잘하지 못하는 부분입니다. 이 장의 후반부에서는 [fzf.vim](https://github.com/junegunn/fzf.vim)을 사용하여 Vim에서 검색을 쉽고 강력하게 만드는 방법을 보여드리겠습니다.

## 설정

먼저 [fzf](https://github.com/junegunn/fzf)와 [ripgrep](https://github.com/BurntSushi/ripgrep)을 다운로드했는지 확인하세요. 그들의 GitHub 리포지토리에서 지침을 따르세요. 성공적으로 설치한 후 `fzf`와 `rg` 명령을 사용할 수 있어야 합니다.

Ripgrep은 grep과 유사한 검색 도구입니다(따라서 이름이 붙었습니다). 일반적으로 grep보다 빠르며 많은 유용한 기능을 가지고 있습니다. Fzf는 범용 명령줄 퍼지 찾기 도구입니다. ripgrep을 포함한 모든 명령과 함께 사용할 수 있습니다. 함께 사용하면 강력한 검색 도구 조합이 됩니다.

Fzf는 기본적으로 ripgrep을 사용하지 않으므로, `FZF_DEFAULT_COMMAND` 변수를 정의하여 fzf가 ripgrep을 사용하도록 알려야 합니다. 제 `.zshrc`(`bash를 사용하는 경우 `.bashrc`)에는 다음과 같은 내용이 있습니다:

```shell
if type rg &> /dev/null; then
  export FZF_DEFAULT_COMMAND='rg --files'
  export FZF_DEFAULT_OPTS='-m'
fi
```

`FZF_DEFAULT_OPTS`의 `-m`에 주의하세요. 이 옵션은 `<Tab>` 또는 `<Shift-Tab>`으로 여러 선택을 할 수 있게 해줍니다. 이 줄은 fzf가 Vim과 함께 작동하도록 만드는 데 필요하지 않지만, 여러 파일에서 검색 및 바꾸기를 수행할 때 유용한 옵션이라고 생각합니다. fzf 명령은 더 많은 옵션을 허용하지만, 여기서는 다루지 않겠습니다. 더 알아보려면 [fzf의 리포지토리](https://github.com/junegunn/fzf#usage)나 `man fzf`를 확인하세요. 최소한 `export FZF_DEFAULT_COMMAND='rg'`를 설정해야 합니다.

fzf와 ripgrep을 설치한 후, fzf 플러그인을 설정해 보겠습니다. 이 예제에서는 [vim-plug](https://github.com/junegunn/vim-plug) 플러그인 관리자를 사용하고 있지만, 다른 플러그인 관리자도 사용할 수 있습니다.

다음 내용을 `.vimrc` 플러그인에 추가하세요. 동일한 fzf 작성자가 만든 [fzf.vim](https://github.com/junegunn/fzf.vim) 플러그인을 사용해야 합니다.

```shell
call plug#begin()
Plug 'junegunn/fzf.vim'
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
call plug#end()
```

이 줄을 추가한 후, `vim`을 열고 `:PlugInstall`을 실행해야 합니다. 그러면 `vimrc` 파일에 정의된 모든 플러그인이 설치됩니다. 이 경우 `fzf.vim`과 `fzf`가 설치됩니다.

이 플러그인에 대한 자세한 내용은 [fzf.vim 리포지토리](https://github.com/junegunn/fzf/blob/master/README-VIM.md)를 확인할 수 있습니다.
## Fzf 문법

fzf를 효율적으로 사용하려면 기본 fzf 문법을 배우는 것이 좋습니다. 다행히도 목록은 짧습니다:

- `^`는 접두사 정확 일치입니다. "welcome"으로 시작하는 구문을 검색하려면: `^welcome`.
- `$`는 접미사 정확 일치입니다. "my friends"로 끝나는 구문을 검색하려면: `friends$`.
- `'`는 정확 일치입니다. "welcome my friends" 구문을 검색하려면: `'welcome my friends`.
- `|`는 "또는" 일치입니다. "friends" 또는 "foes"를 검색하려면: `friends | foes`.
- `!`는 반전 일치입니다. "welcome"을 포함하고 "friends"는 포함하지 않는 구문을 검색하려면: `welcome !friends`.

이 옵션들을 조합할 수 있습니다. 예를 들어, `^hello | ^welcome friends$`는 "welcome" 또는 "hello"로 시작하고 "friends"로 끝나는 구문을 검색합니다.

## 파일 찾기

fzf.vim 플러그인을 사용하여 Vim 내에서 파일을 검색하려면 `:Files` 명령을 사용할 수 있습니다. Vim에서 `:Files`를 실행하면 fzf 검색 프롬프트가 표시됩니다.

이 명령을 자주 사용할 것이므로 키보드 단축키에 매핑하는 것이 좋습니다. 저는 `Ctrl-f`에 매핑했습니다. 제 vimrc에는 다음과 같이 설정되어 있습니다:

```shell
nnoremap <silent> <C-f> :Files<CR>
```

## 파일 내에서 찾기

파일 내에서 검색하려면 `:Rg` 명령을 사용할 수 있습니다.

다시 말하지만, 이 명령을 자주 사용할 것이므로 키보드 단축키에 매핑합시다. 저는 `<Leader>f`에 매핑했습니다. `<Leader>` 키는 기본적으로 `\`에 매핑되어 있습니다.

```shell
nnoremap <silent> <Leader>f :Rg<CR>
```

## 기타 검색

Fzf.vim은 많은 다른 검색 명령을 제공합니다. 여기서 각각을 설명하지는 않겠지만, [여기](https://github.com/junegunn/fzf.vim#commands)에서 확인할 수 있습니다.

제 fzf 매핑은 다음과 같습니다:

```shell
nnoremap <silent> <Leader>b :Buffers<CR>
nnoremap <silent> <C-f> :Files<CR>
nnoremap <silent> <Leader>f :Rg<CR>
nnoremap <silent> <Leader>/ :BLines<CR>
nnoremap <silent> <Leader>' :Marks<CR>
nnoremap <silent> <Leader>g :Commits<CR>
nnoremap <silent> <Leader>H :Helptags<CR>
nnoremap <silent> <Leader>hh :History<CR>
nnoremap <silent> <Leader>h: :History:<CR>
nnoremap <silent> <Leader>h/ :History/<CR>
```

## Grep을 Rg로 교체하기

앞서 언급했듯이, Vim에는 파일 내에서 검색하는 두 가지 방법이 있습니다: `:vim`과 `:grep`. `:grep`은 외부 검색 도구를 사용하며, `grepprg` 키워드를 사용하여 재지정할 수 있습니다. `:grep` 명령을 실행할 때 ripgrep을 사용하도록 Vim을 구성하는 방법을 보여드리겠습니다.

이제 `grepprg`를 설정하여 `:grep` Vim 명령이 ripgrep을 사용하도록 하겠습니다. vimrc에 다음을 추가하세요:

```shell
set grepprg=rg\ --vimgrep\ --smart-case\ --follow
```

위의 옵션을 자유롭게 수정하세요! 위의 옵션이 의미하는 바에 대한 자세한 정보는 `man rg`를 참조하세요.

`grepprg`를 업데이트한 후, 이제 `:grep`을 실행하면 `grep` 대신 `rg --vimgrep --smart-case --follow`가 실행됩니다. ripgrep을 사용하여 "donut"을 검색하려면 이제 `:grep "donut"`라는 더 간결한 명령을 실행할 수 있습니다. 

예전의 `:grep`처럼, 이 새로운 `:grep`도 결과를 표시하기 위해 quickfix를 사용합니다.

"음, 이건 좋지만, 나는 Vim에서 `:grep`을 사용한 적이 없고, 파일에서 구문을 찾기 위해 `:Rg`를 사용할 수 없나요? 언제 `:grep`을 사용할 필요가 있을까요?"라고 궁금할 수 있습니다.

그것은 매우 좋은 질문입니다. 여러 파일에서 검색 및 교체를 수행하기 위해 Vim에서 `:grep`을 사용할 필요가 있을 수 있으며, 다음에서 다룰 것입니다.

## 여러 파일에서 검색 및 교체

VSCode와 같은 현대 텍스트 편집기는 여러 파일에서 문자열을 검색하고 교체하는 것을 매우 쉽게 만듭니다. 이 섹션에서는 Vim에서 이를 쉽게 수행하는 두 가지 방법을 보여드리겠습니다.

첫 번째 방법은 프로젝트 내의 *모든* 일치하는 구문을 교체하는 것입니다. `:grep`을 사용해야 합니다. "pizza"의 모든 인스턴스를 "donut"으로 교체하려면 다음과 같이 하세요:

```shell
:grep "pizza"
:cfdo %s/pizza/donut/g | update
```

명령을 분해해 보겠습니다:

1. `:grep pizza`는 ripgrep을 사용하여 "pizza"의 모든 인스턴스를 검색합니다 (참고로, `grepprg`를 ripgrep으로 재지정하지 않아도 여전히 작동합니다. 대신 `:grep "pizza" . -R`을 사용해야 합니다).
2. `:cfdo`는 빠른 수정 목록에 있는 모든 파일에 대해 전달한 명령을 실행합니다. 이 경우, 명령은 치환 명령 `%s/pizza/donut/g`입니다. 파이프(`|`)는 체인 연산자입니다. `update` 명령은 치환 후 각 파일을 저장합니다. 치환 명령에 대해서는 나중 장에서 더 깊이 다룰 것입니다.

두 번째 방법은 선택한 파일에서 검색 및 교체하는 것입니다. 이 방법을 사용하면 수동으로 선택한 파일에서 선택 및 교체를 수행할 수 있습니다. 다음과 같이 하세요:

1. 먼저 버퍼를 지우세요. 버퍼 목록에 교체를 적용할 파일만 포함되어야 합니다. Vim을 다시 시작하거나 `:%bd | e#` 명령을 실행할 수 있습니다 (`%bd`는 모든 버퍼를 삭제하고 `e#`는 방금 열었던 파일을 엽니다).
2. `:Files`를 실행하세요.
3. 검색 및 교체를 수행할 모든 파일을 선택하세요. 여러 파일을 선택하려면 `<Tab>` / `<Shift-Tab>`을 사용하세요. 이는 `FZF_DEFAULT_OPTS`에 다중 플래그(`-m`)가 있을 경우에만 가능합니다.
4. `:bufdo %s/pizza/donut/g | update`를 실행하세요. 명령 `:bufdo %s/pizza/donut/g | update`는 이전의 `:cfdo %s/pizza/donut/g | update` 명령과 유사합니다. 차이점은 모든 빠른 수정 항목(`:cfdo`)을 치환하는 대신 모든 버퍼 항목(`:bufdo`)을 치환하는 것입니다.

## 스마트한 방법으로 검색 배우기

검색은 텍스트 편집의 기본입니다. Vim에서 잘 검색하는 방법을 배우면 텍스트 편집 워크플로우가 크게 향상됩니다.

Fzf.vim은 게임 체인저입니다. 저는 Vim 없이 사용하는 것을 상상할 수 없습니다. Vim을 시작할 때 좋은 검색 도구를 갖는 것이 매우 중요하다고 생각합니다. 현대 텍스트 편집기에서 제공하는 강력하고 쉬운 검색 기능이 부족해 보이기 때문에 Vim으로 전환하는 데 어려움을 겪는 사람들을 많이 보았습니다. 이 장이 Vim으로의 전환을 더 쉽게 만드는 데 도움이 되기를 바랍니다.

또한 Vim의 확장성을 직접 보셨습니다 - 플러그인과 외부 프로그램으로 검색 기능을 확장할 수 있는 능력입니다. 앞으로 Vim을 어떤 다른 기능으로 확장하고 싶은지 염두에 두세요. 아마도 이미 Vim에 있거나 누군가가 플러그인을 만들었거나 이미 프로그램이 있을 것입니다. 다음에는 Vim에서 매우 중요한 주제인 Vim 문법에 대해 배울 것입니다.