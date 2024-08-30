---
description: Vim 플러그인 작성 경험을 공유하며, `totitle-vim` 플러그인의 구조와 제목 대문자 변환 기능을 소개합니다.
title: 'Ch29. Write a Plugin: Creating a Titlecase Operator'
---

Vim을 잘 사용하기 시작하면, 자신만의 플러그인을 작성하고 싶어질 수 있습니다. 최근에 저는 첫 번째 Vim 플러그인인 [totitle-vim](https://github.com/iggredible/totitle-vim)을 작성했습니다. 이것은 Vim의 대문자 `gU`, 소문자 `gu`, 그리고 토글 대소문자 `g~` 연산자와 유사한 제목 대문자 연산자 플러그인입니다.

이 장에서는 `totitle-vim` 플러그인의 구조를 설명하겠습니다. 이 과정을 통해 여러분에게 영감을 주고, 여러분만의 독특한 플러그인을 만들도록 도와주기를 바랍니다!

## 문제

저는 이 가이드를 포함하여 제 기사를 작성하기 위해 Vim을 사용합니다.

주요 문제 중 하나는 제목에 적절한 제목 대문자를 만드는 것이었습니다. 이를 자동화하는 한 가지 방법은 `g/^#/ s/\<./\u\0/g`를 사용하여 헤더의 각 단어를 대문자로 만드는 것입니다. 기본 사용에는 이 명령이 충분했지만, 실제 제목 대문자만큼 좋지는 않았습니다. "Capitalize The First Letter Of Each Word"에서 "The"와 "Of"는 대문자로 시작해야 합니다. 적절한 대문자가 없으면 문장이 약간 어색해 보입니다.

처음에는 플러그인을 작성할 계획이 없었습니다. 또한 이미 제목 대문자 플러그인이 있다는 것도 알게 되었습니다: [vim-titlecase](https://github.com/christoomey/vim-titlecase). 그러나 제가 원하는 방식으로 작동하지 않는 몇 가지 문제가 있었습니다. 가장 큰 문제는 블록 비주얼 모드 동작이었습니다. 제가 다음과 같은 문구를 가지고 있다면:

```shell
test title one
test title two
test title three
```

"tle"에 블록 비주얼 하이라이트를 사용하면:

```shell
test ti[tle] one
test ti[tle] two
test ti[tle] three
```

`gt`를 누르면 플러그인이 대문자로 만들지 않습니다. 이는 `gu`, `gU`, `g~`의 동작과 일관성이 없다고 생각했습니다. 그래서 저는 그 제목 대문자 플러그인 리포지토리에서 작업을 시작하고, `gu`, `gU`, `g~`와 일관된 제목 대문자 플러그인을 만들기로 결정했습니다. 다시 말해, vim-titlecase 플러그인 자체는 훌륭한 플러그인이며 독립적으로 사용하기에 가치가 있습니다 (사실, 제 마음속 깊은 곳에서는 단순히 제 자신의 Vim 플러그인을 작성하고 싶었던 것일 수도 있습니다. 블록 대문자 기능이 실제로 자주 사용될 것 같지는 않습니다).

### 플러그인 계획

첫 번째 코드를 작성하기 전에 제목 대문자 규칙이 무엇인지 결정해야 합니다. [titlecaseconverter 사이트](https://titlecaseconverter.com/rules/)에서 다양한 대문자 규칙에 대한 멋진 표를 찾았습니다. 영어에는 최소 8개의 다양한 대문자 규칙이 있다는 것을 알고 계셨나요? *헉!*

결국 저는 그 목록에서 공통 분모를 사용하여 플러그인에 적합한 기본 규칙을 만들었습니다. 또한 사람들이 "이봐, 너 AMA를 사용하고 있는데, 왜 APA를 사용하지 않니?"라고 불평할 것 같지는 않습니다. 기본 규칙은 다음과 같습니다:
- 첫 번째 단어는 항상 대문자로 시작합니다.
- 일부 부사, 접속사 및 전치사는 소문자로 시작합니다.
- 입력 단어가 완전히 대문자인 경우 아무 것도 하지 않습니다 (약어일 수 있습니다).

어떤 단어가 소문자로 시작하는지에 대한 규칙은 서로 다른 목록이 있습니다. 저는 `a an and at but by en for in nor of off on or out per so the to up yet vs via`를 사용하기로 결정했습니다.

### 사용자 인터페이스 계획

플러그인이 Vim의 기존 대소문자 연산자 `gu`, `gU`, `g~`를 보완하는 연산자가 되기를 원합니다. 연산자이기 때문에 동작이나 텍스트 객체를 받아야 합니다 (`gtw`는 다음 단어를 제목 대문자로 만들고, `gtiw`는 내부 단어를 제목 대문자로 만들고, `gt$`는 현재 위치에서 줄 끝까지의 단어를 제목 대문자로 만들고, `gtt`는 현재 줄을 제목 대문자로 만들고, `gti(`는 괄호 안의 단어를 제목 대문자로 만들어야 합니다). 또한, 쉽게 기억할 수 있도록 `gt`에 매핑되기를 원합니다. 게다가 모든 비주얼 모드에서도 작동해야 합니다: `v`, `V`, `Ctrl-V`. 저는 어떤 비주얼 모드에서든지 강조 표시를 하고 `gt`를 누르면 모든 강조된 텍스트가 제목 대문자로 변환되기를 원합니다.

## Vim 런타임

리포지토리를 살펴보면 가장 먼저 보이는 것은 두 개의 디렉토리: `plugin/`과 `doc/`입니다. Vim을 시작하면 `~/.vim` 디렉토리 내의 특별한 파일과 디렉토리를 찾고 해당 디렉토리 내의 모든 스크립트 파일을 실행합니다. 더 많은 정보는 Vim 런타임 장을 참조하세요.

플러그인은 두 개의 Vim 런타임 디렉토리인 `doc/`와 `plugin/`을 사용합니다. `doc/`는 도움말 문서를 넣는 곳입니다 (나중에 키워드를 검색할 수 있습니다, 예: `:h totitle`). 나중에 도움말 페이지를 만드는 방법에 대해 설명하겠습니다. 지금은 `plugin/`에 집중합시다. `plugin/` 디렉토리는 Vim이 부팅될 때 한 번 실행됩니다. 이 디렉토리 안에는 하나의 파일이 있습니다: `totitle.vim`. 이름은 중요하지 않습니다 (저는 `whatever.vim`이라고 이름을 지어도 여전히 작동할 것입니다). 플러그인이 작동하는 데 필요한 모든 코드는 이 파일 안에 있습니다.

## 매핑

코드를 살펴보겠습니다!

파일의 시작 부분에는 다음과 같은 코드가 있습니다:

```shell
if !exists('g:totitle_default_keys')
  let g:totitle_default_keys = 1
endif
```

Vim을 시작할 때 `g:totitle_default_keys`는 아직 존재하지 않으므로 `!exists(...)`는 true를 반환합니다. 이 경우 `g:totitle_default_keys`를 1로 정의합니다. Vim에서 0은 거짓이고, 0이 아닌 값은 참입니다 (1을 사용하여 참을 나타냅니다).

파일의 하단으로 점프해 보겠습니다. 다음과 같은 코드가 있습니다:

```shell
if g:totitle_default_keys
  nnoremap <expr> gt ToTitle()
  xnoremap <expr> gt ToTitle()
  nnoremap <expr> gtt ToTitle() .. '_'
endif
```

여기서 주요 `gt` 매핑이 정의됩니다. 이 경우, 파일 하단의 `if` 조건에 도달할 때 `if g:totitle_default_keys`는 1(참)을 반환하므로 Vim은 다음과 같은 매핑을 수행합니다:
- `nnoremap <expr> gt ToTitle()`는 일반 모드 *연산자*를 매핑합니다. 이를 통해 `gtw`와 같은 연산자 + 동작/텍스트 객체를 실행하여 다음 단어를 제목 대문자로 만들거나 `gtiw`를 사용하여 내부 단어를 제목 대문자로 만들 수 있습니다. 연산자 매핑이 어떻게 작동하는지에 대한 세부 사항은 나중에 설명하겠습니다.
- `xnoremap <expr> gt ToTitle()`는 비주얼 모드 연산자를 매핑합니다. 이를 통해 시각적으로 강조된 텍스트를 제목 대문자로 만들 수 있습니다.
- `nnoremap <expr> gtt ToTitle() .. '_'`는 일반 모드 줄 단위 연산자를 매핑합니다 (이는 `guu` 및 `gUU`와 유사합니다). `.. '_'`가 끝에 있는 이유는 무엇일까요? `..`는 Vim의 문자열 보간 연산자입니다. `_`는 연산자와 함께 사용하는 동작입니다. `:help _`를 보면 언더스코어는 1줄 아래로 이동하는 데 사용된다고 나와 있습니다. 현재 줄에서 연산자를 수행합니다 (다른 연산자와 함께 시도해 보세요, `gU_` 또는 `d_`를 실행해 보세요, `gUU` 또는 `dd`와 동일한 동작을 수행하는 것을 확인할 수 있습니다).
- 마지막으로 `<expr>` 인수를 사용하면 카운트를 지정할 수 있으므로 `3gtw`를 사용하여 다음 3개의 단어를 제목 대문자로 만들 수 있습니다.

기본 `gt` 매핑을 사용하고 싶지 않다면 어떻게 될까요? 결국, Vim의 기본 `gt` (다음 탭) 매핑을 덮어쓰고 있는 것입니다. `gt` 대신 `gz`를 사용하고 싶다면 어떻게 해야 할까요? 앞서 `if !exists('g:totitle_default_keys')`와 `if g:totitle_default_keys`를 확인했던 것을 기억하시나요? vimrc에 `let g:totitle_default_keys = 0`를 추가하면 플러그인이 실행될 때 `g:totitle_default_keys`는 이미 존재하게 됩니다 (vimrc의 코드는 `plugin/` 런타임 파일보다 먼저 실행됩니다), 그래서 `!exists('g:totitle_default_keys')`는 false를 반환합니다. 게다가 `if g:totitle_default_keys`는 거짓이 될 것이므로 (0의 값을 가지게 되므로) `gt` 매핑도 수행되지 않을 것입니다! 이렇게 하면 Vimrc에서 자신의 사용자 정의 매핑을 정의할 수 있습니다.

자신의 제목 대문자 매핑을 `gz`로 정의하려면 vimrc에 다음을 추가하세요:

```shell
let g:totitle_default_keys = 0

nnoremap <expr> gz ToTitle()
xnoremap <expr> gz ToTitle()
nnoremap <expr> gzz ToTitle() .. '_'
```

아주 간단합니다.

## ToTitle 함수

`ToTitle()` 함수는 이 파일에서 가장 긴 함수입니다.

```shell
 function! ToTitle(type = '')
  if a:type ==# ''
    set opfunc=ToTitle
    return 'g@'
  endif

  " ToTitle() 함수를 호출할 때 이 부분을 실행합니다
  if a:type != 'block' && a:type != 'line' && a:type != 'char'
    let l:words = a:type
    let l:wordsArr = trim(l:words)->split('\s\+')
    call map(l:wordsArr, 's:capitalize(v:val)')
    return l:wordsArr->join(' ')
  endif

  " 현재 설정을 저장합니다
  let l:sel_save = &selection
  let l:reg_save = getreginfo('"')
  let l:cb_save = &clipboard
  let l:visual_marks_save = [getpos("'<"), getpos("'>")]

  try
    set clipboard= selection=inclusive
    let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}

    silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
    let l:selected_phrase = getreg('"')
    let l:WORD_PATTERN = '\<\k*\>'
    let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'

    let l:startLine = line("'<")
    let l:startCol = virtcol(".")

    " 사용자가 블록 작업을 호출할 때
    if a:type ==# "block"
      sil! keepj norm! gv"ad
      keepj $
      keepj pu_

      let l:lastLine = line("$")

      sil! keepj norm "ap

      let l:curLine = line(".")

      sil! keepj norm! VGg@
      exe "keepj norm! 0\<c-v>G$h\"ad"
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
      exe "keepj " . l:lastLine
      sil! keepj norm! "_dG
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>"

    " 사용자가 문자 또는 줄 작업을 호출할 때
    else
      let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
      let l:titlecased = s:capitalizeFirstWord(l:titlecased)
      call setreg('"', l:titlecased)
      let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
      silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>"
    endif
  finally

    " 설정을 복원합니다
    call setreg('"', l:reg_save)
    call setpos("'<", l:visual_marks_save[0])
    call setpos("'>", l:visual_marks_save[1])
    let &clipboard = l:cb_save
    let &selection = l:sel_save
  endtry
  return
endfunction
```

이것은 매우 길기 때문에 나누어 보겠습니다.

*이것을 더 작은 섹션으로 리팩토링할 수 있지만, 이 장을 완성하기 위해 그냥 두었습니다.*
## 연산자 함수

코드의 첫 번째 부분은 다음과 같습니다:

```shell
if a:type ==# ''
  set opfunc=ToTitle
  return 'g@'
endif
```

`opfunc`는 도대체 무엇인가요? 왜 `g@`를 반환하나요?

Vim에는 특별한 연산자인 연산자 함수 `g@`가 있습니다. 이 연산자는 `opfunc` 옵션에 할당된 *모든* 함수를 사용할 수 있게 해줍니다. 만약 `Foo()` 함수를 `opfunc`에 할당하면, `g@w`를 실행할 때 다음 단어에 대해 `Foo()`를 실행하는 것입니다. `g@i(`를 실행하면 내부 괄호에 대해 `Foo()`를 실행하는 것입니다. 이 연산자 함수는 자신만의 Vim 연산자를 만드는 데 매우 중요합니다.

다음 줄은 `opfunc`를 `ToTitle` 함수에 할당합니다.

```shell
set opfunc=ToTitle
```

다음 줄은 문자 그대로 `g@`를 반환합니다:

```shell
return g@
```

그렇다면 이 두 줄은 정확히 어떻게 작동하며 왜 `g@`를 반환하나요?

다음과 같은 매핑이 있다고 가정해 보겠습니다:

```shell
nnoremap <expr> gt ToTitle()`
```

그런 다음 `gtw`를 누릅니다 (다음 단어를 제목 형식으로 변환). `gtw`를 처음 실행하면 Vim은 `ToTitle()` 메서드를 호출합니다. 하지만 지금 `opfunc`는 여전히 비어 있습니다. 또한 `ToTitle()`에 인수를 전달하지 않으므로 `a:type` 값은 `''`입니다. 이로 인해 조건 표현식 `if a:type ==# ''`이 참이 됩니다. 내부에서 `set opfunc=ToTitle`로 `opfunc`를 `ToTitle` 함수에 할당합니다. 이제 `opfunc`는 `ToTitle`에 할당되었습니다. 마지막으로 `opfunc`를 `ToTitle` 함수에 할당한 후 `g@`를 반환합니다. 왜 `g@`를 반환하는지 아래에서 설명하겠습니다.

아직 끝나지 않았습니다. 기억하세요, 방금 `gtw`를 눌렀습니다. `gt`를 눌렀을 때 위의 모든 작업이 수행되었지만 여전히 처리해야 할 `w`가 있습니다. `g@`를 반환함으로써, 현재 기술적으로 `g@w`가 있습니다 (이것이 `return g@`의 이유입니다). `g@`는 함수 연산자이므로 `w` 동작을 전달하고 있습니다. 따라서 Vim은 `g@w`를 받으면 `ToTitle`을 *한 번 더* 호출합니다 (걱정하지 마세요, 곧 무한 루프에 빠지지 않을 것입니다).

요약하자면, `gtw`를 눌러서 Vim은 `opfunc`가 비어 있는지 확인합니다. 비어 있다면 Vim은 이를 `ToTitle`로 할당합니다. 그런 다음 `g@`를 반환하여 본질적으로 `ToTitle`을 한 번 더 호출하여 이제 이를 연산자로 사용할 수 있게 합니다. 이것이 사용자 정의 연산자를 만드는 가장 까다로운 부분이며, 당신은 이를 해냈습니다! 다음으로 `ToTitle()`의 입력을 실제로 제목 형식으로 변환하는 로직을 구축해야 합니다.

## 입력 처리

이제 `gt`가 `ToTitle()`를 실행하는 연산자로 작동하고 있습니다. 하지만 다음에는 무엇을 해야 할까요? 실제로 텍스트를 제목 형식으로 변환하려면 어떻게 해야 할까요?

Vim에서 어떤 연산자를 실행할 때마다 세 가지 다른 동작 유형이 있습니다: 문자, 줄 및 블록. `g@w` (단어)는 문자 연산의 예입니다. `g@j` (한 줄 아래)는 줄 연산의 예입니다. 블록 연산은 드물지만 일반적으로 `Ctrl-V` (비주얼 블록) 연산을 수행할 때 블록 연산으로 간주됩니다. 몇 개의 문자를 앞으로/뒤로 타겟팅하는 연산은 일반적으로 문자 연산으로 간주됩니다 (`b`, `e`, `w`, `ge` 등). 몇 개의 줄을 아래/위로 타겟팅하는 연산은 일반적으로 줄 연산으로 간주됩니다 (`j`, `k`). 열을 앞으로, 뒤로, 위로 또는 아래로 타겟팅하는 연산은 일반적으로 블록 연산으로 간주됩니다 (보통 열 강제 이동 또는 블록 비주얼 모드입니다; 자세한 내용은 `:h forced-motion` 참조).

즉, `g@w`를 누르면 `g@`는 `"char"`라는 리터럴 문자열을 `ToTitle()`에 인수로 전달합니다. `g@j`를 하면 `g@`는 `"line"`이라는 리터럴 문자열을 `ToTitle()`에 인수로 전달합니다. 이 문자열은 `ToTitle` 함수에 `type` 인수로 전달됩니다.

## 나만의 사용자 정의 함수 연산자 만들기

잠시 멈추고 더미 함수를 작성하여 `g@`로 실험해 봅시다:

```shell
function! Test(some_arg)
  echom a:some_arg 
endfunction
```

이제 다음 명령을 실행하여 해당 함수를 `opfunc`에 할당합니다:

```shell
:set opfunc=Test
```

`g@` 연산자는 `Test(some_arg)`를 실행하고, 수행하는 연산에 따라 `"char"`, `"line"` 또는 `"block"`을 전달합니다. `g@iw` (내부 단어), `g@j` (한 줄 아래), `g@$` (줄 끝까지) 등 다양한 연산을 실행해 보세요. 어떤 값이 에코되는지 확인해 보세요. 블록 연산을 테스트하려면 Vim의 블록 연산 강제 이동을 사용할 수 있습니다: `g@Ctrl-Vj` (한 열 아래로 블록 연산).

비주얼 모드에서도 사용할 수 있습니다. `v`, `V`, `Ctrl-V`와 같은 다양한 비주얼 하이라이트를 사용한 다음 `g@`를 누릅니다 (주의하세요, 출력 에코가 정말 빠르게 깜박이므로 빠른 눈이 필요합니다 - 하지만 에코는 확실히 존재합니다. 또한 `echom`을 사용하고 있으므로 `:messages`로 기록된 에코 메시지를 확인할 수 있습니다).

정말 멋지지 않나요? Vim으로 프로그래밍할 수 있는 것들! 왜 학교에서 이런 것을 가르치지 않았을까요? 플러그인 작업을 계속해 봅시다.

## ToTitle 함수로서

다음 몇 줄로 넘어갑니다:

```shell
if a:type != 'block' && a:type != 'line' && a:type != 'char'
  let l:words = a:type
  let l:wordsArr = trim(l:words)->split('\s\+')
  call map(l:wordsArr, 's:capitalize(v:val)')
  return l:wordsArr->join(' ')
endif
```

이 줄은 실제로 `ToTitle()`의 연산자 동작과는 관련이 없지만, 호출 가능한 TitleCase 함수로 활성화하기 위한 것입니다 (네, 단일 책임 원칙을 위반하고 있다는 것을 압니다). 동기는, Vim에는 주어진 문자열을 대문자와 소문자로 변환하는 기본 `toupper()` 및 `tolower()` 함수가 있습니다. 예: `:echo toupper('hello')`는 `'HELLO'`를 반환하고, `:echo tolower('HELLO')`는 `'hello'`를 반환합니다. 이 플러그인이 `ToTitle`을 실행할 수 있는 기능을 갖추어 `:echo ToTitle('once upon a time')`를 실행하면 `'Once Upon a Time'` 반환 값을 얻을 수 있기를 원합니다.

이제 `g@`로 `ToTitle(type)`를 호출할 때 `type` 인수는 `'block'`, `'line'`, 또는 `'char'` 중 하나의 값을 갖는다는 것을 알고 있습니다. 인수가 `'block'`, `'line'`, 또는 `'char'`가 아닌 경우, `ToTitle()`가 `g@` 외부에서 호출되고 있다고 안전하게 가정할 수 있습니다. 이 경우, 공백(`\s\+`)으로 나누게 됩니다:

```shell
let l:wordsArr = trim(l:words)->split('\s\+')
```

그런 다음 각 요소를 대문자로 변환합니다:

```shell
call map(l:wordsArr, 's:capitalize(v:val)')
```

다시 결합하기 전에:

```shell
l:wordsArr->join(' ')
```

`capitalize()` 함수는 나중에 다룰 것입니다.

## 임시 변수

다음 몇 줄은:

```shell
let l:sel_save = &selection
let l:reg_save = getreginfo('"')
let l:cb_save = &clipboard
let l:visual_marks_save = [getpos("'<"), getpos("'>")]
```

이 줄들은 다양한 현재 상태를 임시 변수에 저장합니다. 나중에 비주얼 모드, 마크 및 레지스터를 사용할 것입니다. 이러한 작업은 몇 가지 상태를 변경할 것입니다. 이력을 수정하고 싶지 않으므로, 나중에 상태를 복원할 수 있도록 임시 변수에 저장해야 합니다.
## 선택한 내용 대문자화

다음 줄은 중요합니다:

```shell
try
  set clipboard= selection=inclusive
  let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}

  silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
  let l:selected_phrase = getreg('"')
  let l:WORD_PATTERN = '\<\k*\>'
  let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'

  let l:startLine = line("'<")
  let l:startCol = virtcol(".")
```
작게 나누어 살펴보겠습니다. 이 줄:

```shell
set clipboard= selection=inclusive
```

먼저 `selection` 옵션을 포함적으로 설정하고 `clipboard`를 비워둡니다. 선택 속성은 일반적으로 비주얼 모드와 함께 사용되며 세 가지 가능한 값이 있습니다: `old`, `inclusive`, `exclusive`. 포함적으로 설정하면 선택의 마지막 문자가 포함됩니다. 여기서는 다루지 않겠지만, 포함적으로 선택하는 것이 비주얼 모드에서 일관되게 작동하게 만듭니다. 기본적으로 Vim은 이를 포함적으로 설정하지만, 플러그인 중 하나가 다른 값으로 설정할 경우를 대비해 여기서 다시 설정합니다. 그들이 실제로 무엇을 하는지 궁금하다면 `:h 'clipboard'`와 `:h 'selection'`을 확인하세요.

다음으로 이 이상하게 보이는 해시와 실행 명령이 있습니다:

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
```

첫째, `#{}` 구문은 Vim의 딕셔너리 데이터 유형입니다. 로컬 변수 `l:commands`는 'lines', 'char', 'block'을 키로 가진 해시입니다. `silent exe '...'` 명령은 문자열 안의 어떤 명령이든 조용히 실행합니다(그렇지 않으면 화면 하단에 알림이 표시됩니다).

둘째, 실행된 명령은 `'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')`입니다. 첫 번째인 `noautocmd`는 이후 명령을 자동 명령 없이 실행합니다. 두 번째인 `keepjumps`는 이동 중에 커서 이동을 기록하지 않도록 합니다. Vim에서는 특정 동작이 변경 목록, 점프 목록 및 마크 목록에 자동으로 기록됩니다. 이는 이를 방지합니다. `noautocmd`와 `keepjumps`를 사용하는 목적은 부작용을 방지하는 것입니다. 마지막으로 `normal` 명령은 문자열을 일반 명령으로 실행합니다. `..`는 Vim의 문자열 보간 구문입니다. `get()`은 리스트, 블롭 또는 딕셔너리를 수용하는 getter 메서드입니다. 이 경우, 딕셔너리 `l:commands`를 전달하고 있습니다. 키는 `a:type`입니다. 이전에 `a:type`이 'char', 'line' 또는 'block' 중 하나라는 것을 배웠습니다. 따라서 `a:type`이 'line'이면 `"noautocmd keepjumps normal! '[V']y"`를 실행하게 됩니다(자세한 내용은 `:h silent`, `:h :exe`, `:h :noautocmd`, `:h :keepjumps`, `:h :normal`, 및 `:h get()`을 확인하세요).

`'[V']y`가 하는 일을 살펴보겠습니다. 먼저 다음과 같은 텍스트가 있다고 가정합니다:

```shell
두 번째 아침식사
첫 번째 아침식사보다 낫다
```
커서가 첫 번째 줄에 있다고 가정합니다. 그런 다음 `g@j`를 누릅니다(연산자 함수 `g@`를 한 줄 아래에서 실행). `'[`는 이전에 변경되거나 복사된 텍스트의 시작으로 커서를 이동합니다. `g@j`로 텍스트를 변경하거나 복사하지 않았지만, Vim은 `g@` 명령의 시작 및 끝 동작 위치를 `'[`와 `']`로 기억합니다(자세한 내용은 `:h g@`를 확인하세요). 이 경우, `'[`를 누르면 커서가 첫 번째 줄로 이동합니다. `V`는 줄 단위 비주얼 모드 명령입니다. 마지막으로 `']`는 이전에 변경되거나 복사된 텍스트의 끝으로 커서를 이동하지만, 이 경우에는 마지막 `g@` 작업의 끝으로 이동합니다. 마지막으로 `y`는 선택한 텍스트를 복사합니다.

당신이 방금 한 일은 `g@`에서 수행한 것과 동일한 텍스트를 복사한 것입니다.

여기 다른 두 명령을 살펴보면:

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
```

모두 유사한 작업을 수행하지만, 줄 단위 작업 대신 문자 단위 또는 블록 단위 작업을 사용합니다. 반복적으로 들릴 수 있지만, 세 가지 경우 모두 `g@`에서 수행한 동일한 텍스트를 복사하고 있습니다.

다음 줄을 살펴보겠습니다:

```shell
let l:selected_phrase = getreg('"')
```

이 줄은 이름 없는 레지스터(`"`)의 내용을 가져와 변수 `l:selected_phrase`에 저장합니다. 잠깐만... 방금 텍스트를 복사하지 않았나요? 이름 없는 레지스터는 현재 방금 복사한 텍스트를 포함하고 있습니다. 이것이 이 플러그인이 텍스트의 복사본을 가져오는 방법입니다.

다음 줄은 정규 표현식 패턴입니다:

```shell
let l:WORD_PATTERN = '\<\k*\>'
```

`\<`와 `\>`는 단어 경계 패턴입니다. `\<` 뒤의 문자는 단어의 시작과 일치하고 `\>` 앞의 문자는 단어의 끝과 일치합니다. `\k`는 키워드 패턴입니다. Vim이 키워드로 허용하는 문자를 확인하려면 `:set iskeyword?`를 확인하세요. Vim에서 `w` 동작은 커서를 단어 단위로 이동합니다. Vim은 "키워드"에 대한 선입견을 가지고 있습니다(이를 수정하려면 `iskeyword` 옵션을 변경할 수 있습니다). `:h /\<`, `:h /\>`, `:h /\k`, 및 `:h 'iskeyword'`를 확인하세요. 마지막으로 `*`는 후속 패턴이 0개 이상임을 의미합니다.

큰 그림에서 `'\<\k*\>'`는 단어와 일치합니다. 문자열이 다음과 같다고 가정해 보겠습니다:

```shell
하나 둘 셋
```

패턴과 일치하면 세 개의 일치 항목이 생성됩니다: "하나", "둘", "셋".

마지막으로 또 다른 패턴이 있습니다:

```shell
let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'
```

Vim의 치환 명령은 `\={your-expression}`과 함께 표현식으로 사용할 수 있습니다. 예를 들어, 현재 줄에서 문자열 "도넛"을 대문자로 만들고 싶다면 Vim의 `toupper()` 함수를 사용할 수 있습니다. 이를 위해 `:%s/donut/\=toupper(submatch(0))/g`를 실행하면 됩니다. `submatch(0)`은 치환 명령에서 사용되는 특별한 표현식입니다. 전체 일치 텍스트를 반환합니다.

다음 두 줄:

```shell
let l:startLine = line("'<")
let l:startCol = virtcol(".")
```

`line()` 표현식은 줄 번호를 반환합니다. 여기서는 마지막으로 선택된 비주얼 영역의 첫 번째 줄을 나타내는 마크 `'<`를 전달합니다. 비주얼 모드를 사용하여 텍스트를 복사했음을 기억하세요. `'<`는 해당 비주얼 영역 선택의 시작 줄 번호를 반환합니다. `virtcol()` 표현식은 현재 커서의 열 번호를 반환합니다. 곧 커서를 여기저기 이동할 것이므로 나중에 돌아올 수 있도록 커서 위치를 저장해야 합니다.

여기서 잠시 쉬고 지금까지의 모든 내용을 검토하세요. 여전히 따라오고 있는지 확인하세요. 준비가 되면 계속 진행합시다.
## 블록 작업 처리

이 섹션을 살펴보겠습니다:

```shell
if a:type ==# "block"
  sil! keepj norm! gv"ad
  keepj $
  keepj pu_

  let l:lastLine = line("$")

  sil! keepj norm "ap

  let l:curLine = line(".")

  sil! keepj norm! VGg@
  exe "keepj norm! 0\<c-v>G$h\"ad" 
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
  exe "keepj " . l:lastLine
  sil! keepj norm! "_dG
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

이제 실제로 텍스트를 대문자로 바꿀 시간입니다. `a:type`이 'char', 'line' 또는 'block' 중 하나라는 것을 기억하세요. 대부분의 경우 'char'와 'line'을 받을 것입니다. 하지만 가끔 블록을 받을 수도 있습니다. 이는 드물지만 반드시 다뤄야 합니다. 불행히도 블록을 처리하는 것은 문자와 줄을 처리하는 것만큼 간단하지 않습니다. 약간의 추가 노력이 필요하지만 가능하긴 합니다.

시작하기 전에 블록을 얻는 방법의 예를 살펴보겠습니다. 다음과 같은 텍스트가 있다고 가정해 보겠습니다:

```shell
아침에 팬케이크
점심에 팬케이크
저녁에 팬케이크
```

커서가 첫 번째 줄의 "팬케이크"의 "c"에 있다고 가정합니다. 그런 다음 비주얼 블록(`Ctrl-V`)을 사용하여 아래로 선택하여 세 줄 모두의 "케이크"를 선택합니다:

```shell
판[cake] 아침에
판[cake] 점심에
판[cake] 저녁에
```

`gt`를 누르면 다음과 같이 되기를 원합니다:

```shell
판케이크 아침에
판케이크 점심에
판케이크 저녁에
```
여기서 기본 가정은 다음과 같습니다: "팬케이크"의 세 "케이크"를 강조 표시할 때, Vim에게 강조 표시할 세 줄의 단어가 있음을 알리는 것입니다. 이 단어는 "케이크", "케이크", "케이크"입니다. "케이크", "케이크", "케이크"를 얻을 것으로 기대합니다.

구현 세부 사항으로 넘어가겠습니다. 다음 몇 줄은 다음과 같습니다:

```shell
sil! keepj norm! gv"ad
keepj $
keepj pu_
let l:lastLine = line("$")
sil! keepj norm "ap
let l:curLine = line(".")
```

첫 번째 줄:

```shell
sil! keepj norm! gv"ad
```

`sil!`는 조용히 실행되고 `keepj`는 이동할 때 점프 기록을 유지합니다. 그런 다음 일반 명령 `gv"ad`를 실행합니다. `gv`는 마지막으로 시각적으로 강조 표시된 텍스트를 선택합니다(팬케이크 예제에서는 세 개의 '케이크'를 다시 강조 표시합니다). `"ad`는 시각적으로 강조 표시된 텍스트를 삭제하고 이를 레지스터 a에 저장합니다. 결과적으로 이제 다음과 같습니다:

```shell
판 아침에
판 점심에
판 저녁에
```

이제 레지스터 a에 저장된 '케이크'의 3 *블록*이 있습니다(줄이 아님). 이 구분은 중요합니다. 줄 단위 비주얼 모드로 텍스트를 복사하는 것은 블록 단위 비주얼 모드로 텍스트를 복사하는 것과 다릅니다. 이 점을 명심하세요. 나중에 다시 보게 될 것입니다.

다음으로:

```shell
keepj $
keepj pu_
```

`$`는 파일의 마지막 줄로 이동합니다. `pu_`는 커서 아래에 한 줄을 삽입합니다. 점프 기록을 변경하지 않기 위해 `keepj`와 함께 실행하려고 합니다.

그런 다음 마지막 줄의 줄 번호(`line("$")`)를 지역 변수 `lastLine`에 저장합니다.

```shell
let l:lastLine = line("$")
```

그런 다음 레지스터의 내용을 `norm "ap`로 붙여넣습니다.

```shell
sil! keepj norm "ap
```

이것은 파일의 마지막 줄 아래에 생성한 새 줄에서 발생하고 있습니다 - 현재 파일의 맨 아래에 있습니다. 붙여넣기는 다음과 같은 *블록* 텍스트를 제공합니다:

```shell
케이크
케이크
케이크
```

다음으로, 커서가 있는 현재 줄의 위치를 저장합니다.

```shell
let l:curLine = line(".")
```

이제 다음 몇 줄로 넘어가겠습니다:

```shell
sil! keepj norm! VGg@
exe "keepj norm! 0\<c-v>G$h\"ad"
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
exe "keepj " . l:lastLine
sil! keepj norm! "_dG
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

이 줄:

```shell
sil! keepj norm! VGg@
```

`VG`는 현재 줄에서 파일 끝까지 줄 비주얼 모드로 강조 표시합니다. 따라서 여기서 세 개의 '케이크' 텍스트 블록을 줄 단위로 강조 표시하고 있습니다(블록과 줄 구분을 기억하세요). 처음 세 "케이크" 텍스트를 붙여넣었을 때는 블록으로 붙여넣었습니다. 이제는 줄로 강조 표시하고 있습니다. 외관상으로는 같아 보일 수 있지만, 내부적으로 Vim은 텍스트 블록을 붙여넣는 것과 줄을 붙여넣는 것의 차이를 알고 있습니다.

```shell
케이크
케이크
케이크
```

`g@`는 함수 연산자이므로 본질적으로 자신에게 재귀 호출을 하고 있습니다. 하지만 왜 그럴까요? 이것이 무엇을 달성하나요?

당신은 `g@`에 재귀 호출을 하고 있으며, '케이크' 텍스트의 3줄을 전달하고 있습니다(이제 `V`로 실행한 후 줄이 되었으므로 블록이 아닙니다) 다른 코드 부분에서 처리되도록 합니다(이 부분은 나중에 다룰 것입니다). `g@`를 실행한 결과는 적절하게 제목이 대문자로 된 3줄의 텍스트입니다:

```shell
케이크
케이크
케이크
```

다음 줄:

```shell
exe "keepj norm! 0\<c-v>G$h\"ad"
```

이것은 일반 모드 명령을 실행하여 줄의 시작으로 이동(`0`), 블록 비주얼 강조를 사용하여 마지막 줄과 그 줄의 마지막 문자로 이동합니다(`<c-v>G$`). `h`는 커서를 조정합니다(할 때 `$` Vim은 오른쪽으로 한 줄 더 이동합니다). 마지막으로, 강조 표시된 텍스트를 삭제하고 레지스터 a에 저장합니다(`"ad`).

다음 줄:

```shell
exe "keepj " . l:startLine
```

`startLine`이 있던 곳으로 커서를 다시 이동합니다.

다음:

```shell
exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
```

`startLine` 위치에 있으므로 이제 `startCol`로 표시된 열로 점프합니다. `\<bar>\`는 바 `|` 동작입니다. Vim에서 바 동작은 커서를 n번째 열로 이동시킵니다(예를 들어 `startCol`이 4였다면, `4|`를 실행하면 커서가 4의 열 위치로 점프합니다). `startCol`은 제목 대문자로 바꾸고자 하는 텍스트의 열 위치를 저장한 곳이었습니다. 마지막으로, `"aP`는 레지스터 a에 저장된 텍스트를 붙여넣습니다. 이는 이전에 삭제된 텍스트를 원래 위치로 되돌립니다.

다음 4줄을 살펴보겠습니다:

```shell
exe "keepj " . l:lastLine
sil! keepj norm! "_dG
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

`exe "keepj " . l:lastLine`는 이전에 `lastLine` 위치로 커서를 다시 이동합니다. `sil! keepj norm! "_dG`는 블랙홀 레지스터(`"_dG`)를 사용하여 생성된 여분의 공백을 삭제하여 이름 없는 레지스터를 깨끗하게 유지합니다. `exe "keepj " . l:startLine`은 `startLine`으로 커서를 다시 이동합니다. 마지막으로, `exe "sil! keepj norm! " . l:startCol . "\<bar>"`는 `startCol` 열로 커서를 이동합니다.

이 모든 작업은 Vim에서 수동으로 수행할 수 있는 작업입니다. 그러나 이러한 작업을 재사용 가능한 함수로 변환하는 이점은 매번 제목 대문자를 바꿀 때마다 30줄 이상의 명령을 실행하는 것을 피할 수 있다는 것입니다. 여기서 중요한 점은, Vim에서 수동으로 할 수 있는 모든 것을 재사용 가능한 함수로 변환할 수 있다는 것입니다. 따라서 플러그인이 됩니다!

다음과 같은 텍스트가 주어졌다고 가정해 보겠습니다:

```shell
팬케이크 아침에
팬케이크 점심에
팬케이크 저녁에

... 일부 텍스트
```

먼저 블록 단위로 시각적으로 강조 표시합니다:

```shell
판[cake] 아침에
판[cake] 점심에
판[cake] 저녁에

... 일부 텍스트
```

그런 다음 삭제하고 해당 텍스트를 레지스터 a에 저장합니다:

```shell
판 아침에
판 점심에
판 저녁에

... 일부 텍스트
```

그런 다음 파일의 맨 아래에 붙여넣습니다:

```shell
판 아침에
판 점심에
판 저녁에

... 일부 텍스트
케이크
케이크
케이크
```

그런 다음 대문자로 바꿉니다:

```shell
판 아침에
판 점심에
판 저녁에

... 일부 텍스트
케이크
케이크
케이크
```

마지막으로 대문자로 바뀐 텍스트를 다시 넣습니다:

```shell
판케이크 아침에
판케이크 점심에
판케이크 저녁에

... 일부 텍스트
```

## 줄 및 문자 작업 처리

아직 끝나지 않았습니다. 블록 텍스트에서 `gt`를 실행할 때의 엣지 케이스만 다뤘습니다. 이제 '줄' 및 '문자' 작업을 처리해야 합니다. 이를 수행하는 방법을 보기 위해 `else` 코드를 살펴보겠습니다.

코드는 다음과 같습니다:

```shell
if a:type ==# "block"
  # ... 
else
  let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
  let l:titlecased = s:capitalizeFirstWord(l:titlecased)
  call setreg('"', l:titlecased)
  let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
  silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>"
endif
```

줄 단위로 살펴보겠습니다. 이 플러그인의 비밀 소스는 실제로 이 줄에 있습니다:

```shell
let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
```

`@@`는 제목 대문자로 바꿀 텍스트를 포함합니다. `l:WORD_PATTERN`은 개별 키워드 일치입니다. `l:UPCASE_REPLACEMENT`는 `capitalize()` 명령에 대한 호출입니다(나중에 보게 될 것입니다). `'g'`는 주어진 단어를 모두 대체하라는 지시를 내리는 글로벌 플래그입니다.

다음 줄:

```shell
let l:titlecased = s:capitalizeFirstWord(l:titlecased)
```

이는 첫 번째 단어가 항상 대문자로 시작되도록 보장합니다. "하루에 사과 하나가 의사를 멀리한다"는 문구가 있을 때, 첫 번째 단어인 "하나"는 특별한 단어이므로 대체 명령이 이를 대문자로 만들지 않습니다. 첫 번째 문자를 항상 대문자로 만드는 방법이 필요합니다. 이 함수가 바로 그것을 수행합니다(이 함수의 세부 사항은 나중에 보게 될 것입니다). 이러한 대문자화 방법의 결과는 지역 변수 `l:titlecased`에 저장됩니다.

다음 줄:

```shell
call setreg('"', l:titlecased)
```

이는 대문자로 변환된 문자열을 이름 없는 레지스터(`"`)에 넣습니다.

다음 두 줄:

```shell
let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
```

이것은 익숙하게 보입니다! 이전에 `l:commands`와 유사한 패턴을 보았습니다. 여기서는 복사 대신 붙여넣기(`p`)를 사용합니다. 이전 섹션에서 `l:commands`를 살펴보았던 내용을 확인하세요.

마지막으로, 다음 두 줄:

```shell
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

시작했던 줄과 열로 커서를 다시 이동하고 있습니다. 그게 전부입니다!

요약하자면, 위의 대체 방법은 주어진 텍스트를 대문자로 바꾸고 특별한 단어를 건너뛰는 데 충분히 똑똑합니다(자세한 내용은 나중에 다룰 것입니다). 제목 대문자로 된 문자열을 얻은 후, 이를 이름 없는 레지스터에 저장합니다. 그런 다음 이전에 `g@`를 실행한 동일한 텍스트를 시각적으로 강조 표시한 다음, 이름 없는 레지스터에서 붙여넣습니다(이는 비대문자 텍스트를 대문자 버전으로 효과적으로 교체합니다). 마지막으로 시작했던 위치로 커서를 이동합니다.
## 정리

기술적으로 완료되었습니다. 텍스트는 이제 제목 형식으로 변경되었습니다. 남은 것은 레지스터와 설정을 복원하는 것입니다.

```shell
call setreg('"', l:reg_save)
call setpos("'<", l:visual_marks_save[0])
call setpos("'>", l:visual_marks_save[1])
let &clipboard = l:cb_save
let &selection = l:sel_save
```

이것은 다음을 복원합니다:
- 이름 없는 레지스터.
- `<` 및 `>` 마크.
- `'clipboard'` 및 `'selection'` 옵션.

휴, 당신은 끝났습니다. 긴 함수였습니다. 더 작은 함수로 나누어 짧게 만들 수도 있었지만, 지금은 이 정도면 충분할 것입니다. 이제 대문자화 함수에 대해 간략히 살펴보겠습니다.

## 대문자화 함수

이 섹션에서는 `s:capitalize()` 함수에 대해 살펴보겠습니다. 이 함수는 다음과 같습니다:

```shell
function! s:capitalize(string)
    if(toupper(a:string) ==# a:string && a:string != 'A')
        return a:string
    endif

    let l:str = tolower(a:string)
    let l:exclusions = '^\(a\|an\|and\|at\|but\|by\|en\|for\|in\|nor\|of\|off\|on\|or\|out\|per\|so\|the\|to\|up\|yet\|v\.?\|vs\.?\|via\)$'
    if (match(l:str, l:exclusions) >= 0) || (index(s:local_exclusion_list, l:str) >= 0)
      return l:str
    endif

    return toupper(l:str[0]) . l:str[1:]
endfunction
```

`capitalize()` 함수의 인수인 `a:string`은 `g@` 연산자를 통해 전달된 개별 단어입니다. 따라서 "pancake for breakfast"라는 텍스트에서 `gt`를 실행하면 `ToTitle`은 "pancake", "for", "breakfast"에 대해 각각 *세 번* `capitalize(string)`을 호출합니다.

함수의 첫 번째 부분은 다음과 같습니다:

```shell
if(toupper(a:string) ==# a:string && a:string != 'A')
  return a:string
endif
```

첫 번째 조건(`toupper(a:string) ==# a:string`)은 인수의 대문자 버전이 문자열과 동일한지, 그리고 문자열 자체가 "A"가 아닌지를 확인합니다. 이 두 조건이 참이면 해당 문자열을 반환합니다. 이는 주어진 단어가 이미 완전히 대문자인 경우 약어라고 가정하기 때문입니다. 예를 들어, "CEO"라는 단어는 "Ceo"로 변환될 수 있습니다. 음, 당신의 CEO는 기뻐하지 않을 것입니다. 따라서 완전히 대문자인 단어는 그대로 두는 것이 가장 좋습니다. 두 번째 조건인 `a:string != 'A'`는 대문자 "A" 문자의 엣지 케이스를 다룹니다. 만약 `a:string`이 이미 대문자 "A"라면, 그것은 우연히 `toupper(a:string) ==# a:string` 테스트를 통과했을 것입니다. "a"는 영어에서 부정관사이므로 소문자로 변환되어야 합니다.

다음 부분은 문자열을 소문자로 변환합니다:

```shell
let l:str = tolower(a:string)
```

다음 부분은 모든 단어 제외 목록의 정규 표현식입니다. 이는 https://titlecaseconverter.com/rules/ 에서 가져왔습니다:

```shell
let l:exclusions = '^\(a\|an\|and\|at\|but\|by\|en\|for\|in\|nor\|of\|off\|on\|or\|out\|per\|so\|the\|to\|up\|yet\|v\.?\|vs\.?\|via\)$'
```

다음 부분:

```shell
if (match(l:str, l:exclusions) >= 0) || (index(s:local_exclusion_list, l:str) >= 0)
  return l:str
endif
```

먼저, 문자열이 제외된 단어 목록(`l:exclusions`)의 일부인지 확인합니다. 만약 그렇다면 대문자로 만들지 않습니다. 그런 다음 문자열이 로컬 제외 목록(`s:local_exclusion_list`)의 일부인지 확인합니다. 이 제외 목록은 사용자가 vimrc에 추가할 수 있는 사용자 정의 목록입니다(사용자가 특별한 단어에 대한 추가 요구 사항이 있는 경우).

마지막 부분은 단어의 대문자화된 버전을 반환합니다. 첫 번째 문자는 대문자로 변환되고 나머지는 그대로 유지됩니다.

```shell
return toupper(l:str[0]) . l:str[1:]
```

두 번째 대문자화 함수에 대해 살펴보겠습니다. 함수는 다음과 같습니다:

```shell
function! s:capitalizeFirstWord(string)
  if (a:string =~ "\n")
    let l:lineArr = trim(a:string)->split('\n')
    let l:lineArr = map(l:lineArr, 'toupper(v:val[0]) . v:val[1:]')
    return l:lineArr->join("\n")
  endif
  return toupper(a:string[0]) . a:string[1:]
endfunction
```

이 함수는 제외된 단어로 시작하는 문장이 있는 경우를 처리하기 위해 만들어졌습니다. 예를 들어, "an apple a day keeps the doctor away"와 같은 경우입니다. 영어의 대문자화 규칙에 따르면 문장의 첫 번째 단어는 특별한 단어인지 여부와 관계없이 대문자로 시작해야 합니다. `substitute()` 명령만으로는 문장 내의 "an"이 소문자로 변환될 것입니다. 따라서 첫 번째 문자를 강제로 대문자로 만들어야 합니다.

이 `capitalizeFirstWord` 함수에서 `a:string` 인수는 `capitalize` 함수 내의 `a:string`처럼 개별 단어가 아니라 전체 텍스트입니다. 따라서 "pancake for breakfast"가 있을 경우 `a:string`의 값은 "pancake for breakfast"입니다. 전체 텍스트에 대해 `capitalizeFirstWord`를 한 번만 실행합니다.

주의해야 할 시나리오는 `"an apple a day\nkeeps the doctor away"`와 같은 다중 행 문자열이 있는 경우입니다. 모든 행의 첫 번째 문자를 대문자로 만들어야 합니다. 줄 바꿈이 없으면 첫 번째 문자만 대문자로 변환합니다.

```shell
return toupper(a:string[0]) . a:string[1:]
```

줄 바꿈이 있는 경우, 각 행의 첫 번째 문자를 대문자로 만들어야 하므로 줄 바꿈으로 구분된 배열로 분할합니다:

```shell
let l:lineArr = trim(a:string)->split('\n')
```

그런 다음 배열의 각 요소를 매핑하여 각 요소의 첫 번째 단어를 대문자로 만듭니다:

```shell
let l:lineArr = map(l:lineArr, 'toupper(v:val[0]) . v:val[1:]')
```

마지막으로 배열 요소를 함께 합칩니다:

```shell
return l:lineArr->join("\n")
```

그리고 당신은 끝났습니다!

## 문서

저장소의 두 번째 디렉토리는 `docs/` 디렉토리입니다. 플러그인에 대한 철저한 문서를 제공하는 것이 좋습니다. 이 섹션에서는 자신의 플러그인 문서를 만드는 방법에 대해 간략히 살펴보겠습니다.

`docs/` 디렉토리는 Vim의 특별한 런타임 경로 중 하나입니다. Vim은 `docs/` 내의 모든 파일을 읽으므로, 특정 키워드를 검색할 때 그 키워드가 `docs/` 디렉토리의 파일 중 하나에서 발견되면 도움말 페이지에 표시됩니다. 여기에는 `totitle.txt`가 있습니다. 플러그인 이름 때문에 그렇게 이름을 지었지만, 원하는 대로 이름을 지을 수 있습니다.

Vim 문서 파일은 본질적으로 txt 파일입니다. 일반 txt 파일과 Vim 도움말 파일의 차이점은 후자가 특별한 "도움말" 구문을 사용한다는 것입니다. 그러나 먼저 Vim에게 이를 텍스트 파일 유형이 아닌 `help` 파일 유형으로 처리하도록 알려야 합니다. 이 `totitle.txt`를 *도움말* 파일로 해석하도록 Vim에게 지시하려면 `:set ft=help`를 실행합니다(`:h 'filetype'`에 대한 자세한 내용은 더 많은 정보를 참조하세요). 참고로, 이 `totitle.txt`를 *일반* txt 파일로 해석하도록 Vim에게 지시하려면 `:set ft=txt`를 실행합니다.

### 도움말 파일 특별 구문

키워드를 검색 가능하게 만들려면 해당 키워드를 별표로 둘러싸야 합니다. 사용자가 `:h totitle`를 검색할 때 키워드 `totitle`이 검색 가능하도록 하려면 도움말 파일에 `*totitle*`로 작성합니다.

예를 들어, 목차의 맨 위에 다음과 같은 줄이 있습니다:

```shell
TABLE OF CONTENTS                                     *totitle*  *totitle-toc*

// 더 많은 TOC 내용
```

여기서 두 개의 키워드 `*totitle*` 및 `*totitle-toc*`를 사용하여 목차 섹션을 표시했습니다. 원하는 만큼 많은 키워드를 사용할 수 있습니다. 이는 사용자가 `:h totitle` 또는 `:h totitle-toc`를 검색할 때마다 Vim이 이 위치로 이동하도록 합니다.

다음은 파일의 어딘가에 있는 또 다른 예입니다:

```shell
2. Usage                                                       *totitle-usage*

// 사용법
```

`:h totitle-usage`를 검색하면 Vim이 이 섹션으로 이동합니다.

또한 키워드를 바 구문 `|`로 둘러싸서 도움말 파일의 다른 섹션을 참조할 수 있습니다. TOC 섹션에서는 `|totitle-intro|`, `|totitle-usage|`와 같은 바로 둘러싸인 키워드를 볼 수 있습니다.

```shell
TABLE OF CONTENTS                                     *totitle*  *totitle-toc*

    1. Intro ........................... |totitle-intro|
    2. Usage ........................... |totitle-usage|
    3. Words to capitalize ............. |totitle-words|
    4. Operator ........................ |totitle-operator|
    5. Key-binding ..................... |totitle-keybinding|
    6. Bugs ............................ |totitle-bug-report|
    7. Contributing .................... |totitle-contributing|
    8. Credits ......................... |totitle-credits|

```
이렇게 하면 정의로 점프할 수 있습니다. `|totitle-intro|` 위에 커서를 두고 `Ctrl-]`를 누르면 Vim이 해당 단어의 정의로 점프합니다. 이 경우 `*totitle-intro*` 위치로 점프합니다. 이렇게 하면 도움말 문서에서 서로 다른 키워드에 링크할 수 있습니다.

Vim에서 문서 파일을 작성하는 데 정답이나 오답은 없습니다. 다양한 저자가 작성한 다양한 플러그인을 살펴보면 많은 사람들이 서로 다른 형식을 사용합니다. 중요한 것은 사용자에게 이해하기 쉬운 도움말 문서를 만드는 것입니다.

마지막으로, 처음에 로컬에서 자신의 플러그인을 작성하고 문서 페이지를 테스트하려는 경우, 단순히 `~/.vim/docs/`에 txt 파일을 추가하는 것만으로는 키워드가 자동으로 검색 가능해지지 않습니다. Vim에게 문서 페이지를 추가하도록 지시해야 합니다. `:helptags ~/.vim/doc` 명령을 실행하여 새 태그 파일을 생성합니다. 이제 키워드를 검색할 수 있습니다.

## 결론

끝까지 오셨습니다! 이 장은 모든 Vimscript 장의 집합체입니다. 이제까지 배운 내용을 실제로 적용하는 것입니다. 이 글을 읽고 Vim 플러그인을 만드는 방법뿐만 아니라 자신의 플러그인을 작성하도록 격려받았기를 바랍니다.

동일한 작업 시퀀스를 여러 번 반복하게 된다면, 자신의 것을 만들어 보세요! 바퀴를 다시 발명하지 말라는 말이 있습니다. 그러나 학습을 위해 바퀴를 다시 발명하는 것이 유익할 수 있다고 생각합니다. 다른 사람의 플러그인을 읽고, 재구성하고, 배우고, 자신의 것을 작성하세요! 누가 알겠습니까, 아마도 이 글을 읽고 나서 다음 멋지고 인기 있는 플러그인을 작성할 수도 있습니다. 아마도 당신은 다음 전설적인 Tim Pope가 될 것입니다. 그런 일이 생기면 저에게 알려주세요!