---
description: Vimプラグイン「totitle-vim」の解説。タイトルケースを自動化し、見出しの適切な大文字化を実現する方法を紹介します。
title: 'Ch29. Write a Plugin: Creating a Titlecase Operator'
---

Vimに慣れてくると、自分自身のプラグインを書きたくなるかもしれません。最近、私は初めてのVimプラグインである[totitle-vim](https://github.com/iggredible/totitle-vim)を書きました。これは、Vimの大文字化`gU`、小文字化`gu`、トグルケース`g~`オペレーターに似たタイトルケースオペレーターのプラグインです。

この章では、`totitle-vim`プラグインの内訳を紹介します。このプロセスについて少しでも理解を深め、あなた自身のユニークなプラグインを作成するインスピレーションを与えられればと思います！

## 問題

私はこのガイドを含む記事を書くためにVimを使用しています。

主な問題の一つは、見出しの適切なタイトルケースを作成することでした。これを自動化する一つの方法は、ヘッダー内の各単語を`g/^#/ s/\<./\u\0/g`で大文字にすることです。基本的な使用にはこのコマンドで十分でしたが、実際のタイトルケースには及びません。「Capitalize The First Letter Of Each Word」の「The」と「Of」は大文字にすべきです。適切な大文字化がないと、文が少し不自然に見えます。

最初はプラグインを書くつもりはありませんでした。また、すでにタイトルケースプラグインが存在することもわかりました：[vim-titlecase](https://github.com/christoomey/vim-titlecase)。しかし、いくつかの点で私が望んでいたようには機能しませんでした。主な問題は、ブロック単位のビジュアルモードの動作でした。もし私が以下のフレーズを持っていた場合：

```shell
test title one
test title two
test title three
```

「tle」をブロックビジュアルハイライトで選択すると：

```shell
test ti[tle] one
test ti[tle] two
test ti[tle] three
```

`gt`を押すと、プラグインはそれを大文字にしません。これは`gu`、`gU`、`g~`の動作と一貫性がないと感じました。そこで、私はそのタイトルケースプラグインのリポジトリを基にして、`gu`、`gU`、`g~`と一貫性のあるタイトルケースプラグインを作成することにしました。再度言いますが、vim-titlecaseプラグイン自体は素晴らしいプラグインであり、単独で使用する価値があります（実際には、深層では自分自身のVimプラグインを書きたかっただけかもしれません。実際の生活でブロック単位のタイトルケース機能がそれほど使われるとは思えません）。

### プラグインの計画

最初のコード行を書く前に、タイトルケースのルールを決める必要があります。[titlecaseconverterサイト](https://titlecaseconverter.com/rules/)から異なる大文字化ルールのきれいな表を見つけました。英語には少なくとも8つの異なる大文字化ルールがあることをご存知でしたか？ *驚き！*

最終的に、私はそのリストから共通の要素を使って、プラグイン用の十分に良い基本ルールを考え出しました。さらに、人々が「おい、君はAMAを使っているのに、なぜAPAを使わないの？」と文句を言うとは思えません。基本的なルールは次のとおりです：
- 最初の単語は常に大文字。
- 一部の副詞、接続詞、前置詞は小文字。
- 入力単語が完全に大文字の場合は、何もしない（略語の可能性があります）。

どの単語が小文字になるかについては、異なるルールには異なるリストがあります。私は`a an and at but by en for in nor of off on or out per so the to up yet vs via`に従うことにしました。

### ユーザーインターフェースの計画

プラグインをVimの既存のケースオペレーター`gu`、`gU`、`g~`を補完するオペレーターにしたいと思います。オペレーターであるため、動作またはテキストオブジェクトを受け入れる必要があります（`gtw`は次の単語をタイトルケースにし、`gtiw`は内側の単語をタイトルケースにし、`gt$`は現在の位置から行の終わりまでの単語をタイトルケースにし、`gtt`は現在の行をタイトルケースにし、`gti(`は括弧内の単語をタイトルケースにする、など）。また、簡単な記憶法のために`gt`にマッピングしたいと思います。さらに、すべてのビジュアルモード（`v`、`V`、`Ctrl-V`）でも機能する必要があります。どのビジュアルモードでもハイライトし、`gt`を押すと、すべてのハイライトされたテキストがタイトルケースになります。

## Vimランタイム

リポジトリを見たときに最初に目にするのは、`plugin/`と`doc/`の2つのディレクトリがあることです。Vimを起動すると、`~/.vim`ディレクトリ内の特別なファイルとディレクトリを探し、そのディレクトリ内のすべてのスクリプトファイルを実行します。詳細については、Vimランタイム章を参照してください。

プラグインは2つのVimランタイムディレクトリ`doc/`と`plugin/`を利用します。`doc/`はヘルプドキュメントを置く場所です（後でキーワードを検索できるように、例えば`:h totitle`のように）。後でヘルプページの作成方法を説明します。今は`plugin/`に焦点を当てましょう。`plugin/`ディレクトリはVimが起動する際に一度実行されます。このディレクトリ内には1つのファイル`totitle.vim`があります。名前は重要ではありません（`whatever.vim`と名付けても動作します）。プラグインが機能するためのすべてのコードはこのファイル内にあります。

## マッピング

コードを見ていきましょう！

ファイルの最初に次のようなコードがあります：

```shell
if !exists('g:totitle_default_keys')
  let g:totitle_default_keys = 1
endif
```

Vimを起動すると、`g:totitle_default_keys`はまだ存在しないため、`!exists(...)`はtrueを返します。この場合、`g:totitle_default_keys`を1に設定します。Vimでは、0は偽、非ゼロは真です（真を示すために1を使用します）。

ファイルの最後にジャンプしましょう。次のようなコードが見えます：

```shell
if g:totitle_default_keys
  nnoremap <expr> gt ToTitle()
  xnoremap <expr> gt ToTitle()
  nnoremap <expr> gtt ToTitle() .. '_'
endif
```

ここで、主要な`gt`マッピングが定義されています。この場合、ファイルの最後にある`if`条件に到達する頃には、`if g:totitle_default_keys`は1（真）を返すため、Vimは次のマッピングを実行します：
- `nnoremap <expr> gt ToTitle()`は通常モードの*オペレーター*をマッピングします。これにより、`gtw`のようにオペレーター+動作/テキストオブジェクトを実行して次の単語をタイトルケースにしたり、`gtiw`で内側の単語をタイトルケースにしたりできます。オペレーターのマッピングの詳細については後で説明します。
- `xnoremap <expr> gt ToTitle()`はビジュアルモードのオペレーターをマッピングします。これにより、視覚的にハイライトされたテキストをタイトルケースにできます。
- `nnoremap <expr> gtt ToTitle() .. '_'`は通常モードの行単位オペレーターをマッピングします（`guu`や`gUU`に類似しています）。最後の`.. '_'`が何をするのか不思議に思うかもしれません。`..`はVimの文字列補間オペレーターです。`_`はオペレーターの動作として使用されます。`:help _`を見てみると、アンダースコアは1行下にカウントするために使用されると書かれています。これは現在の行に対してオペレーターを実行します（他のオペレーターで試してみてください、`gU_`や`d_`を実行すると、`gUU`や`dd`と同じ動作をします）。
- 最後に、`<expr>`引数を使用するとカウントを指定できるため、`3gtw`のように次の3単語をトグルケースにできます。

デフォルトの`gt`マッピングを使用したくない場合はどうしますか？結局のところ、Vimのデフォルトの`gt`（次のタブ）マッピングを上書きしています。`gt`の代わりに`gz`を使用したい場合はどうしますか？以前に`if !exists('g:totitle_default_keys')`と`if g:totitle_default_keys`を確認していたことを思い出してください。もし`let g:totitle_default_keys = 0`をvimrcに追加すると、プラグインが実行されるときに`g:totitle_default_keys`はすでに存在します（vimrc内のコードは`plugin/`ランタイムファイルの前に実行されるため）、そのため`!exists('g:totitle_default_keys')`はfalseを返します。さらに、`if g:totitle_default_keys`は偽（0の値を持つため）になるため、`gt`マッピングも実行されません！これにより、Vimrc内で独自のカスタムマッピングを定義することができます。

独自のタイトルケースマッピングを`gz`に定義するには、vimrcに次のように追加します：

```shell
let g:totitle_default_keys = 0

nnoremap <expr> gz ToTitle()
xnoremap <expr> gz ToTitle()
nnoremap <expr> gzz ToTitle() .. '_'
```

簡単ですね。

## ToTitle関数

`ToTitle()`関数は、このファイルの中で最も長い関数です。

```shell
 function! ToTitle(type = '')
  if a:type ==# ''
    set opfunc=ToTitle
    return 'g@'
  endif

  " ToTitle()関数を呼び出すときにこれを呼び出します
  if a:type != 'block' && a:type != 'line' && a:type != 'char'
    let l:words = a:type
    let l:wordsArr = trim(l:words)->split('\s\+')
    call map(l:wordsArr, 's:capitalize(v:val)')
    return l:wordsArr->join(' ')
  endif

  " 現在の設定を保存
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

    " ユーザーがブロック操作を呼び出すとき
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

    " ユーザーが文字または行操作を呼び出すとき
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

    " 設定を復元
    call setreg('"', l:reg_save)
    call setpos("'<", l:visual_marks_save[0])
    call setpos("'>", l:visual_marks_save[1])
    let &clipboard = l:cb_save
    let &selection = l:sel_save
  endtry
  return
endfunction
```

これは非常に長いので、分解してみましょう。

*私はこれを小さなセクションにリファクタリングすることもできますが、この章を完成させるためにそのままにしておきました。*
## オペレータ関数

ここにコードの最初の部分があります：

```shell
if a:type ==# ''
  set opfunc=ToTitle
  return 'g@'
endif
```

`opfunc` とは一体何ですか？ なぜ `g@` を返しているのですか？

Vim には特別なオペレータ、オペレータ関数 `g@` があります。このオペレータを使うことで、`opfunc` オプションに割り当てられた *任意の* 関数を使用できます。もし `Foo()` 関数が `opfunc` に割り当てられている場合、`g@w` を実行すると、次の単語に対して `Foo()` を実行します。`g@i(` を実行すると、内側の括弧に対して `Foo()` を実行します。このオペレータ関数は、自分自身の Vim オペレータを作成するために重要です。

次の行は `opfunc` を `ToTitle` 関数に割り当てます。

```shell
set opfunc=ToTitle
```

次の行は文字通り `g@` を返しています：

```shell
return g@
```

では、これらの二行は正確にどのように機能し、なぜ `g@` を返しているのでしょうか？

次のマップがあると仮定しましょう：

```shell
nnoremap <expr> gt ToTitle()`
```

次に `gtw` を押すと（次の単語をタイトルケースにします）。最初に `gtw` を実行すると、Vim は `ToTitle()` メソッドを呼び出します。しかし、今のところ `opfunc` はまだ空白です。また、`ToTitle()` に引数を渡していないため、`a:type` の値は `''` になります。これにより、条件式が引数 `a:type` をチェックし、`if a:type ==# ''` が真になります。その中で、`set opfunc=ToTitle` で `opfunc` に `ToTitle` 関数を割り当てます。これで `opfunc` は `ToTitle` に割り当てられました。最後に、`opfunc` を `ToTitle` 関数に割り当てた後、`g@` を返します。なぜそれが `g@` を返すのかを以下で説明します。

まだ終わっていません。`gtw` を押したことを思い出してください。`gt` を押すことで上記のすべてのことが行われましたが、まだ処理する `w` があります。`g@` を返すことで、現時点で技術的には `g@w` を持っています（これが `return g@` の理由です）。`g@` は関数オペレータなので、`w` モーションをそれに渡しています。したがって、Vim は `g@w` を受け取ると、`ToTitle` を *もう一度* 呼び出します（心配しないでください、すぐに無限ループにはなりません）。

要約すると、`gtw` を押すことで、Vim は `opfunc` が空かどうかをチェックします。もし空であれば、Vim はそれを `ToTitle` に割り当てます。そして `g@` を返すことで、実質的に `ToTitle` をもう一度呼び出し、オペレータとして使用できるようにします。これがカスタムオペレータを作成する際の最も難しい部分で、あなたはそれを成し遂げました！次に、`ToTitle()` の入力を実際にタイトルケースにするロジックを構築する必要があります。

## 入力の処理

今、`gt` は `ToTitle()` を実行するオペレータとして機能しています。しかし、次はどうしますか？ 実際にテキストをタイトルケースにするにはどうすればよいですか？

Vim でオペレータを実行するたびに、3つの異なるアクションモーションタイプがあります：文字、行、ブロック。`g@w`（単語）は文字操作の例です。`g@j`（1行下）は行操作の例です。ブロック操作は珍しいですが、通常 `Ctrl-V`（ビジュアルブロック）操作を行うと、ブロック操作としてカウントされます。数文字前後をターゲットにする操作は一般的に文字操作と見なされます（`b`、`e`、`w`、`ge` など）。数行下または上をターゲットにする操作は一般的に行操作と見なされます（`j`、`k`）。前方、後方、上方、または下方の列をターゲットにする操作は一般的にブロック操作と見なされます（通常は列強制モーションまたはブロックビジュアルモードです；詳細は `:h forced-motion` を参照）。

つまり、`g@w` を押すと、`g@` はリテラル文字列 `"char"` を `ToTitle()` に引数として渡します。`g@j` を実行すると、`g@` はリテラル文字列 `"line"` を `ToTitle()` に引数として渡します。この文字列が `ToTitle` 関数に `type` 引数として渡されます。

## 自分自身のカスタム関数オペレータを作成する

少し休憩して、ダミー関数を書いて `g@` を遊んでみましょう：

```shell
function! Test(some_arg)
  echom a:some_arg 
endfunction
```

次に、その関数を `opfunc` に割り当てるために、次のコマンドを実行します：

```shell
:set opfunc=Test
```

`g@` オペレータは `Test(some_arg)` を実行し、操作に応じて `"char"`、`"line"`、または `"block"` を渡します。`g@iw`（内側の単語）、`g@j`（1行下）、`g@$`（行の終わりまで）など、さまざまな操作を実行して、異なる値がエコーされるのを確認してください。ブロック操作をテストするには、Vim の強制モーションを使用します：`g@Ctrl-Vj`（ブロック操作で1列下）。

ビジュアルモードでも使用できます。さまざまなビジュアルハイライト（`v`、`V`、`Ctrl-V`）を使用してから `g@` を押してください（注意してください、出力エコーが非常に速く点滅するので、目を凝らす必要があります - しかし、エコーは確実にあります。また、`echom` を使用しているため、記録されたエコーメッセージは `:messages` で確認できます）。

すごいですね、Vim でプログラムできること！ なぜ学校でこれを教えなかったのでしょうか？ プラグインを続けましょう。

## ToTitle 関数として

次の数行に進みます：

```shell
if a:type != 'block' && a:type != 'line' && a:type != 'char'
  let l:words = a:type
  let l:wordsArr = trim(l:words)->split('\s\+')
  call map(l:wordsArr, 's:capitalize(v:val)')
  return l:wordsArr->join(' ')
endif
```

この行は実際には `ToTitle()` のオペレータとしての動作とは関係ありませんが、呼び出し可能な TitleCase 関数にするためのものです（はい、私は単一責任原則に違反していることを知っています）。動機は、Vim には与えられた文字列を大文字または小文字にする `toupper()` と `tolower()` のネイティブ関数があるからです。例：`:echo toupper('hello')` は `'HELLO'` を返し、`:echo tolower('HELLO')` は `'hello'` を返します。このプラグインには、`ToTitle` を実行する機能が必要です。そうすれば、`:echo ToTitle('once upon a time')` を実行して `'Once Upon a Time'` の戻り値を得ることができます。

今や、`g@` で `ToTitle(type)` を呼び出すと、`type` 引数は `'block'`、`'line'`、または `'char'` のいずれかの値を持つことがわかります。引数が `'block'`、`'line'`、`'char'` のいずれでもない場合、`ToTitle()` は `g@` の外部で呼び出されていると安全に仮定できます。その場合、空白で分割します（`\s\+`）：

```shell
let l:wordsArr = trim(l:words)->split('\s\+')
```

次に、各要素を大文字にします：

```shell
call map(l:wordsArr, 's:capitalize(v:val)')
```

そして、再び結合します：

```shell
l:wordsArr->join(' ')
```

`capitalize()` 関数については後で説明します。

## 一時変数

次の数行：

```shell
let l:sel_save = &selection
let l:reg_save = getreginfo('"')
let l:cb_save = &clipboard
let l:visual_marks_save = [getpos("'<"), getpos("'>")]
```

これらの行は、さまざまな現在の状態を一時変数に保存します。後でビジュアルモード、マーク、レジスタを使用します。これを行うと、いくつかの状態が変更されます。履歴を修正したくないので、一時変数に保存して、後で状態を復元できるようにします。
## 選択範囲の大文字化

次の行は重要です：

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
これらを小さな部分に分けて見ていきましょう。この行：

```shell
set clipboard= selection=inclusive
```

最初に `selection` オプションをインクルーシブに設定し、`clipboard` を空にします。選択属性は通常、ビジュアルモードで使用され、3つの可能な値があります：`old`、`inclusive`、および `exclusive`。インクルーシブに設定すると、選択の最後の文字が含まれます。ここでは詳しく説明しませんが、インクルーシブに選択することでビジュアルモードで一貫して動作します。デフォルトではVimはこれをインクルーシブに設定しますが、プラグインのいずれかが異なる値に設定する場合に備えて、ここで設定しています。興味があれば、`:h 'clipboard'` と `:h 'selection'` をチェックしてください。

次に、奇妙に見えるハッシュと実行コマンドがあります：

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
```

まず、`#{}` 構文はVimの辞書データ型です。ローカル変数 `l:commands` は、'lines'、'char'、および 'block' をキーとするハッシュです。コマンド `silent exe '...'` は、文字列内のコマンドを静かに実行します（そうでなければ、画面の下部に通知が表示されます）。

次に、実行されるコマンドは `'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')` です。最初の `noautocmd` は、後続のコマンドを自動コマンドをトリガーせずに実行します。2番目の `keepjumps` は、移動中にカーソルの動きを記録しないようにします。Vimでは、特定の動作が変更リスト、ジャンプリスト、およびマークリストに自動的に記録されます。これを防ぎます。`noautocmd` と `keepjumps` を使用する目的は、副作用を防ぐことです。最後に、`normal` コマンドは文字列を通常のコマンドとして実行します。`..` はVimの文字列補間構文です。`get()` は、リスト、バイナリ、または辞書を受け入れるゲッターメソッドです。この場合、辞書 `l:commands` を渡しています。キーは `a:type` です。以前に学んだように、`a:type` は 'char'、'line'、または 'block' のいずれかの文字列値です。したがって、`a:type` が 'line' の場合、`"noautocmd keepjumps normal! '[V']y"` を実行します（詳細については、`:h silent`、`:h :exe`、`:h :noautocmd`、`:h :keepjumps`、`:h :normal`、および `:h get()` をチェックしてください）。

`'[V']y` が何をするか見てみましょう。まず、次のテキストがあると仮定します：

```shell
the second breakfast
is better than the first breakfast
```
カーソルが最初の行にあると仮定します。次に `g@j` を押します（演算子関数 `g@` を1行下に実行します）。`'[` は、前回変更またはヤンクしたテキストの開始位置にカーソルを移動します。技術的には `g@j` でテキストを変更またはヤンクしていませんが、Vimは `g@` コマンドの開始と終了の動作の位置を `'[` と `']` で記憶します（詳細については、`:h g@` をチェックしてください）。この場合、`'[` を押すとカーソルが最初の行に移動します。`V` は行単位のビジュアルモードコマンドです。最後に、`']` は前回変更またはヤンクしたテキストの終了位置にカーソルを移動しますが、この場合、最後の `g@` 操作の終了位置に移動します。最後に、`y` は選択したテキストをヤンクします。

あなたが行ったことは、`g@` を実行したのと同じテキストをヤンクすることでした。

ここにある他の2つのコマンドを見てみましょう：

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
```

これらはすべて似たような動作を行いますが、行単位の動作の代わりに文字単位またはブロック単位の動作を使用します。繰り返しになりますが、3つのケースすべてで、実際には `g@` を実行したのと同じテキストをヤンクしています。

次の行を見てみましょう：

```shell
let l:selected_phrase = getreg('"')
```

この行は、無名レジスタ (`"`) の内容を取得し、変数 `l:selected_phrase` に格納します。ちょっと待ってください… さっきテキストをヤンクしませんでしたか？無名レジスタには、ちょうどヤンクしたテキストが含まれています。これが、このプラグインがテキストのコピーを取得できる理由です。

次の行は正規表現パターンです：

```shell
let l:WORD_PATTERN = '\<\k*\>'
```

`\<` と `\>` は単語境界パターンです。`\<` に続く文字は単語の始まりに一致し、`\>` に続く文字は単語の終わりに一致します。`\k` はキーワードパターンです。Vimがキーワードとして受け入れる文字を確認するには、`:set iskeyword?` を使用できます。Vimの `w` 動作はカーソルを単語単位で移動させます。Vimには「キーワード」の概念があらかじめ定義されています（`iskeyword` オプションを変更することで編集できます）。`:h /\<`、`:h /\>`、`:h /\k`、および `:h 'iskeyword'` をチェックしてください。最後に、`*` はその後のパターンの0回以上の出現を意味します。

全体として、`'\<\k*\>'` は単語に一致します。次の文字列があるとします：

```shell
one two three
```

このパターンに対して一致させると、"one"、"two"、"three" の3つの一致が得られます。

最後に、別のパターンがあります：

```shell
let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'
```

Vimの置換コマンドは、`\={your-expression}` を使用して式とともに使用できます。たとえば、現在の行で文字列 "donut" を大文字にしたい場合、Vimの `toupper()` 関数を使用できます。これを実行するには、`:%s/donut/\=toupper(submatch(0))/g` を実行します。`submatch(0)` は置換コマンドで使用される特別な式です。これは、一致したテキスト全体を返します。

次の2行：

```shell
let l:startLine = line("'<")
let l:startCol = virtcol(".")
```

`line()` 式は行番号を返します。ここでは、`'<` マークを渡して、最後に選択されたビジュアルエリアの最初の行を表します。テキストをヤンクするためにビジュアルモードを使用したことを思い出してください。`'<` はそのビジュアルエリア選択の開始位置の行番号を返します。`virtcol()` 式は現在のカーソルの列番号を返します。しばらくしてカーソルをあちこち移動させるので、後で戻るためにカーソルの位置を保存する必要があります。

ここで一息入れて、これまでの内容を振り返ってください。まだついてきていることを確認してください。準備ができたら、続けましょう。
## ブロック操作の処理

このセクションを見ていきましょう：

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

実際にテキストを大文字にする時間です。`a:type`は「char」、「line」、または「block」のいずれかであることを思い出してください。ほとんどの場合、「char」と「line」を取得することになるでしょう。しかし、時折ブロックを取得することもあります。これは稀ですが、無視するわけにはいきません。残念ながら、ブロックの処理は文字や行の処理ほど簡単ではありません。少し余分な努力が必要ですが、実行可能です。

始める前に、ブロックを取得する方法の例を見てみましょう。このテキストがあると仮定します：

```shell
pancake for breakfast
pancake for lunch
pancake for dinner
```

カーソルが最初の行の「pancake」の「c」にあると仮定します。次に、ビジュアルブロック（`Ctrl-V`）を使用して、すべての行の「cake」を選択するために下に進みます：

```shell
pan[cake] for breakfast
pan[cake] for lunch
pan[cake] for dinner
```

`gt`を押すと、次のようになります：

```shell
panCake for breakfast
panCake for lunch
panCake for dinner

```
基本的な前提は次のとおりです：「pancakes」の3つの「cakes」を強調表示すると、Vimに3行の単語を強調表示したいことを伝えています。これらの単語は「cake」、「cake」、および「cake」です。結果として「Cake」、「Cake」、および「Cake」を得ることを期待しています。

実装の詳細に進みましょう。次の数行には次のように書かれています：

```shell
sil! keepj norm! gv"ad
keepj $
keepj pu_
let l:lastLine = line("$")
sil! keepj norm "ap
let l:curLine = line(".")
```

最初の行：

```shell
sil! keepj norm! gv"ad
```

`sil!`は静かに実行され、`keepj`は移動時にジャンプ履歴を保持します。次に、通常のコマンド`gv"ad`を実行します。`gv`は最後に視覚的に強調表示されたテキストを選択します（パンケーキの例では、すべての3つの「cake」を再強調表示します）。`"ad`は視覚的に強調表示されたテキストを削除し、レジスタaに保存します。その結果、次のようになります：

```shell
pan for breakfast
pan for lunch
pan for dinner
```

これで、レジスタaに3つの「cake」の*ブロック*（行ではない）が保存されました。この区別は重要です。行単位の視覚モードでテキストをヤンクすることは、ブロック単位の視覚モードでテキストをヤンクすることとは異なります。このことを心に留めておいてください。後で再び目にすることになります。

次に、次のように続きます：

```shell
keepj $
keepj pu_
```

`$`はファイルの最後の行に移動します。`pu_`はカーソルの下に1行挿入します。ジャンプ履歴を変更しないように`keepj`で実行したいです。

次に、最後の行の行番号（`line("$")`）をローカル変数`lastLine`に保存します。

```shell
let l:lastLine = line("$")
```

次に、レジスタから内容をペーストします。

```shell
sil! keepj norm "ap
```

これは、ファイルの最後の行の下に作成した新しい行で発生していることを忘れないでください - 現在、ファイルの一番下にいます。ペーストすると、次のような*ブロック*テキストが得られます：

```shell
cake
cake
cake
```

次に、カーソルの現在の行の位置を保存します。

```shell
let l:curLine = line(".")
```

次に、次の数行に進みましょう：

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

この行：

```shell
sil! keepj norm! VGg@
```

`VG`は、現在の行からファイルの終わりまでを行単位で視覚的に強調表示します。したがって、ここでは行単位の強調表示で3つの「cake」テキストのブロックを強調表示しています（ブロックと行の区別を思い出してください）。最初に3つの「cake」テキストをペーストしたとき、ブロックとしてペーストしていました。今、行として強調表示しています。外見上は同じに見えるかもしれませんが、内部的にVimはテキストのブロックをペーストすることと行をペーストすることの違いを知っています。

```shell
cake
cake
cake
```

`g@`は関数オペレーターであるため、実際には自己再帰呼び出しを行っています。しかし、なぜでしょうか？これは何を達成するのでしょうか？

`g@`にすべての3行（`V`で実行した後、今はブロックではなく行になっています）の「cake」テキストを渡して、コードの他の部分で処理されるように再帰呼び出しを行っています（この後に説明します）。`g@`を実行した結果は、適切にタイトルケースにされた3行のテキストです：

```shell
Cake
Cake
Cake
```

次の行：

```shell
exe "keepj norm! 0\<c-v>G$h\"ad"
```

これは、通常モードコマンドを実行して行の先頭に移動し（`0`）、ブロック視覚強調表示を使用して最後の行とその行の最後の文字に移動します（`<c-v>G$`）。`h`はカーソルを調整します（`$`を実行すると、Vimは右に1行余分に移動します）。最後に、強調表示されたテキストを削除し、レジスタaに保存します（`"ad`）。

次の行：

```shell
exe "keepj " . l:startLine
```

カーソルを`startLine`の位置に戻します。

次に：

```shell
exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
```

`startLine`の位置にいるので、`startCol`でマークされた列にジャンプします。`\<bar>\`はバー`|`モーションです。Vimのバー動作はカーソルをn列目に移動させます（`startCol`が4だったとしましょう。`4|`を実行すると、カーソルが4の列位置にジャンプします）。`startCol`はタイトルケースにしたいテキストの列位置を保存していた場所です。最後に、`"aP`はレジスタaに保存されたテキストをペーストします。これにより、以前に削除されたテキストが元の位置に戻ります。

次の4行を見てみましょう：

```shell
exe "keepj " . l:lastLine
sil! keepj norm! "_dG
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

`exe "keepj " . l:lastLine`は、以前の`lastLine`の位置にカーソルを戻します。`sil! keepj norm! "_dG`は、ブラックホールレジスタ（`"_dG`）を使用して作成された余分なスペースを削除します。これにより、名前のないレジスタがクリーンな状態に保たれます。`exe "keepj " . l:startLine`はカーソルを`startLine`に戻します。最後に、`exe "sil! keepj norm! " . l:startCol . "\<bar>"`はカーソルを`startCol`の列に移動させます。

これらはすべて、Vimで手動で行うことができたアクションです。しかし、これらのアクションを再利用可能な関数に変える利点は、タイトルケースにする必要があるたびに30行以上の指示を実行する必要がなくなることです。ここでのポイントは、Vimで手動でできることはすべて再利用可能な関数に変えることができるということです。つまり、プラグインにすることができるのです！

以下のようになります。

いくつかのテキストがあるとします：

```shell
pancake for breakfast
pancake for lunch
pancake for dinner

... いくつかのテキスト
```

まず、ビジュアルブロックで強調表示します：

```shell
pan[cake] for breakfast
pan[cake] for lunch
pan[cake] for dinner

... いくつかのテキスト
```

次に、それを削除してレジスタaに保存します：

```shell
pan for breakfast
pan for lunch
pan for dinner

... いくつかのテキスト
```

次に、ファイルの下にペーストします：

```shell
pan for breakfast
pan for lunch
pan for dinner

... いくつかのテキスト
cake
cake
cake
```

次に、それを大文字にします：

```shell
pan for breakfast
pan for lunch
pan for dinner

... いくつかのテキスト
Cake
Cake
Cake
```

最後に、大文字にしたテキストを元に戻します：

```shell
panCake for breakfast
panCake for lunch
panCake for dinner

... いくつかのテキスト
```

## 行と文字の操作の処理

まだ終わっていません。ブロックテキストで`gt`を実行したときのエッジケースにのみ対処しました。「行」と「文字」の操作も処理する必要があります。これがどのように行われるかを見るために、`else`コードを見てみましょう。

コードは次のとおりです：

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

行ごとに見ていきましょう。このプラグインの秘密のソースは実際にはこの行にあります：

```shell
let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
```

`@@`には、タイトルケースにするための名前のないレジスタからのテキストが含まれています。`l:WORD_PATTERN`は個々のキーワードの一致です。`l:UPCASE_REPLACEMENT`は`capitalize()`コマンドへの呼び出しです（これは後で見ることになります）。`'g'`は、与えられたすべての単語を置き換えるように指示するグローバルフラグです。

次の行：

```shell
let l:titlecased = s:capitalizeFirstWord(l:titlecased)
```

これは、最初の単語が常に大文字になることを保証します。「an apple a day keeps the doctor away」のようなフレーズがある場合、最初の単語「an」は特別な単語であるため、置換コマンドはそれを大文字にしません。最初の文字を常に大文字にするメソッドが必要です。この関数がそれを実現します（この関数の詳細は後で見ます）。これらの大文字化メソッドの結果は、ローカル変数`l:titlecased`に保存されます。

次の行：

```shell
call setreg('"', l:titlecased)
```

これにより、大文字にされた文字列が名前のないレジスタ（`"`）に格納されます。

次に、次の2行：

```shell
let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
```

おや、見覚えがありますね！以前に`l:commands`で見たのと似たパターンです。ヤンクの代わりに、ここではペースト（`p`）を使用します。リフレッシュのために、前のセクションで`l:commands`について説明した部分を確認してください。

最後に、次の2行：

```shell
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

カーソルを開始した行と列に戻しています。それだけです！

要約しましょう。上記の置換メソッドは、与えられたテキストを大文字にし、特別な単語をスキップするのに十分賢いです（この後の詳細については後で説明します）。タイトルケースの文字列を取得した後、それを名前のないレジスタに保存します。次に、以前に`g@`を実行したのと同じテキストを視覚的に強調表示し、名前のないレジスタからペーストします（これにより、非タイトルケースのテキストがタイトルケースのバージョンに置き換えられます）。最後に、カーソルを開始した位置に戻します。
## クリーンアップ

技術的には完了しました。テキストはすでにタイトルケースになっています。残るのは、レジスタと設定を復元することだけです。

```shell
call setreg('"', l:reg_save)
call setpos("'<", l:visual_marks_save[0])
call setpos("'>", l:visual_marks_save[1])
let &clipboard = l:cb_save
let &selection = l:sel_save
```

これにより復元されるもの：
- 無名レジスタ。
- `<` および `>` マーク。
- `'clipboard'` および `'selection'` オプション。

ふぅ、これで終わりです。長い関数でした。関数を小さく分けて短くすることもできましたが、今はこれで十分です。では、キャピタライズ関数について簡単に見ていきましょう。

## キャピタライズ関数

このセクションでは、`s:capitalize()` 関数について見ていきます。この関数は次のようになります：

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

`capitalize()` 関数の引数 `a:string` は、`g@` 演算子によって渡される個々の単語です。したがって、テキスト "pancake for breakfast" に対して `gt` を実行すると、`ToTitle` は `capitalize(string)` を *3* 回呼び出します。一度は "pancake" に、次は "for" に、最後は "breakfast" に対してです。

関数の最初の部分は次の通りです：

```shell
if(toupper(a:string) ==# a:string && a:string != 'A')
  return a:string
endif
```

最初の条件（`toupper(a:string) ==# a:string`）は、引数の大文字バージョンが文字列と同じかどうか、そしてその文字列自体が "A" でないかを確認します。これらが真であれば、その文字列を返します。これは、特定の単語がすでに完全に大文字である場合、それが略語であるという仮定に基づいています。例えば、"CEO" という単語は、そうでなければ "Ceo" に変換されてしまいます。うーん、あなたのCEOは喜ばないでしょう。したがって、完全に大文字の単語はそのままにしておくのが最善です。2つ目の条件 `a:string != 'A'` は、大文字の "A" 文字に対するエッジケースに対処します。もし `a:string` がすでに大文字の "A" であれば、`toupper(a:string) ==# a:string` テストを誤って通過してしまいます。英語では "a" は不定冠詞であるため、小文字にする必要があります。

次の部分では、文字列を小文字に強制します：

```shell
let l:str = tolower(a:string)
```

次の部分は、すべての単語の除外リストの正規表現です。これらは https://titlecaseconverter.com/rules/ から取得しました：

```shell
let l:exclusions = '^\(a\|an\|and\|at\|but\|by\|en\|for\|in\|nor\|of\|off\|on\|or\|out\|per\|so\|the\|to\|up\|yet\|v\.?\|vs\.?\|via\)$'
```

次の部分：

```shell
if (match(l:str, l:exclusions) >= 0) || (index(s:local_exclusion_list, l:str) >= 0)
  return l:str
endif
```

まず、文字列が除外単語リスト（`l:exclusions`）の一部であるかどうかを確認します。もしそうであれば、大文字にしません。次に、文字列がローカル除外リスト（`s:local_exclusion_list`）の一部であるかどうかを確認します。この除外リストは、ユーザーが特別な単語に対する追加要件を持っている場合に、vimrc に追加できるカスタムリストです。

最後の部分は、単語の大文字化されたバージョンを返します。最初の文字が大文字になり、残りはそのままです。

```shell
return toupper(l:str[0]) . l:str[1:]
```

次に、2つ目のキャピタライズ関数を見ていきましょう。この関数は次のようになります：

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

この関数は、除外単語で始まる文がある場合のエッジケースを処理するために作成されました。例えば "an apple a day keeps the doctor away" のようにです。英語の大文字化ルールに基づくと、文の最初の単語は特別な単語であっても大文字にする必要があります。`substitute()` コマンドだけでは、文中の "an" は小文字になってしまいます。最初の文字を強制的に大文字にする必要があります。

この `capitalizeFirstWord` 関数では、`a:string` 引数は `capitalize` 関数内の `a:string` のような個々の単語ではなく、全体のテキストです。したがって、"pancake for breakfast" がある場合、`a:string` の値は "pancake for breakfast" です。全体のテキストに対して `capitalizeFirstWord` は一度だけ実行されます。

注意すべきシナリオの一つは、"an apple a day\nkeeps the doctor away" のような複数行の文字列を持つ場合です。すべての行の最初の文字を大文字にしたいです。改行がない場合は、単に最初の文字を大文字にします。

```shell
return toupper(a:string[0]) . a:string[1:]
```

改行がある場合は、各行の最初の文字を大文字にする必要があるため、改行で区切って配列に分割します：

```shell
let l:lineArr = trim(a:string)->split('\n')
```

次に、配列内の各要素をマッピングし、各要素の最初の単語を大文字にします：

```shell
let l:lineArr = map(l:lineArr, 'toupper(v:val[0]) . v:val[1:]')
```

最後に、配列の要素を結合します：

```shell
return l:lineArr->join("\n")
```

これで完了です！

## ドキュメント

リポジトリ内の2番目のディレクトリは `docs/` ディレクトリです。プラグインに徹底したドキュメントを提供することは良いことです。このセクションでは、自分のプラグインドキュメントを作成する方法について簡単に説明します。

`docs/` ディレクトリは、Vim の特別なランタイムパスの一つです。Vim は `docs/` 内のすべてのファイルを読み込むため、特定のキーワードを検索し、そのキーワードが `docs/` ディレクトリ内のファイルのいずれかに見つかると、ヘルプページに表示されます。ここに `totitle.txt` があります。プラグイン名にちなんでそのように名付けましたが、好きな名前を付けることができます。

Vim ドキュメントファイルは本質的にはテキストファイルです。通常のテキストファイルと Vim ヘルプファイルの違いは、後者が特別な「ヘルプ」構文を使用することです。しかしまず、Vim にこのファイルをテキストファイルタイプとしてではなく、`help` ファイルタイプとして扱うように指示する必要があります。この `totitle.txt` を *ヘルプ* ファイルとして解釈させるには、`:set ft=help` を実行します（詳細は `:h 'filetype'` を参照）。ちなみに、この `totitle.txt` を *通常の* テキストファイルとして解釈させたい場合は、`:set ft=txt` を実行します。

### ヘルプファイルの特別な構文

キーワードを発見可能にするには、そのキーワードをアスタリスクで囲みます。ユーザーが `:h totitle` を検索したときにキーワード `totitle` を発見可能にするには、ヘルプファイル内で `*totitle*` と書きます。

例えば、目次の上部に次の行があります：

```shell
目次                                     *totitle*  *totitle-toc*

// 目次の他の内容
```

ここで、目次セクションをマークするために、`*totitle*` と `*totitle-toc*` の2つのキーワードを使用したことに注意してください。これにより、`：h totitle` または `：h totitle-toc` のいずれかを検索すると、Vim はこの位置に移動します。

ファイルのどこかに別の例があります：

```shell
2. 使用法                                                       *totitle-usage*

// 使用法
```

`：h totitle-usage` を検索すると、Vim はこのセクションに移動します。

また、バー構文 `|` で囲まれたキーワードを使用して、ヘルプファイル内の別のセクションを参照する内部リンクを作成できます。目次セクションでは、`|totitle-intro|`、`|totitle-usage|` などのバーで囲まれたキーワードが見られます。

```shell
目次                                     *totitle*  *totitle-toc*

    1. はじめに ........................... |totitle-intro|
    2. 使用法 ........................... |totitle-usage|
    3. 大文字にする単語 ............. |totitle-words|
    4. 演算子 ........................ |totitle-operator|
    5. キーバインディング ..................... |totitle-keybinding|
    6. バグ ............................ |totitle-bug-report|
    7. 貢献 ............................ |totitle-contributing|
    8. クレジット ......................... |totitle-credits|

```
これにより、定義にジャンプできます。`|totitle-intro|` の上にカーソルを置いて `Ctrl-]` を押すと、Vim はその単語の定義にジャンプします。この場合、`*totitle-intro*` の位置にジャンプします。これが、ヘルプドキュメント内の異なるキーワードにリンクする方法です。

Vim でドキュメントファイルを書く正しい方法や間違った方法はありません。異なる著者によるさまざまなプラグインを見てみると、多くの異なる形式が使用されています。重要なのは、ユーザーにとって理解しやすいヘルプドキュメントを作成することです。

最後に、最初にローカルで自分のプラグインを書いていて、ドキュメントページをテストしたい場合、単に `~/.vim/docs/` 内にテキストファイルを追加するだけでは、自動的にキーワードが検索可能になるわけではありません。Vim にドキュメントページを追加するよう指示する必要があります。`：helptags ~/.vim/doc` コマンドを実行して新しいタグファイルを作成します。これで、キーワードの検索を開始できます。

## 結論

あなたは最後までたどり着きました！この章は、すべての Vimscript 章の統合です。ここで、これまで学んだことを実践に移しています。これを読んで、Vim プラグインの作成方法だけでなく、自分自身のプラグインを書くことを奨励できたら幸いです。

同じアクションのシーケンスを何度も繰り返すことがあれば、自分自身のものを作成してみてください！車輪を再発明すべきではないと言われています。しかし、学習のために車輪を再発明することは有益だと思います。他の人のプラグインを読み、それを再現し、学び、自分自身のものを書いてください！もしかしたら、これを読んだ後、次の素晴らしい、超人気のプラグインを書くことになるかもしれません。もしかしたら、次の伝説的な Tim Pope になるかもしれません。その時は教えてください！