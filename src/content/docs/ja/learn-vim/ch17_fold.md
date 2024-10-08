---
description: Vimの折りたたみ機能を使って、ファイル内の不要なテキストを隠し、理解を深める方法を学びます。
title: Ch17. Fold
---

ファイルを読むとき、しばしばそのファイルが何をするのか理解するのを妨げる多くの無関係なテキストがあります。不要なノイズを隠すために、Vimの折りたたみ機能を使用します。

この章では、ファイルを折りたたむさまざまな方法を学びます。

## 手動折りたたみ

紙のシートを折りたたんでいくつかのテキストを隠すことを想像してください。実際のテキストは消えず、そこにまだ存在します。Vimの折りたたみ機能は同じように機能します。テキストの範囲を折りたたみ、表示から隠しますが、実際には削除されません。

折りたたみオペレーターは `z` です（紙が折りたたまれると、zの形になります）。

次のテキストがあるとします：

```shell
Fold me
Hold me
```

カーソルが最初の行にある状態で、`zfj` と入力します。Vimは両方の行を1つに折りたたみます。次のように表示されるはずです：

```shell
+-- 2 lines: Fold me -----
```

内訳は以下の通りです：
- `zf` は折りたたみオペレーターです。
- `j` は折りたたみオペレーターの動作です。

折りたたまれたテキストは `zo` で開くことができます。折りたたみを閉じるには `zc` を使用します。

折りたたみはオペレーターであるため、文法ルール（`動詞 + 名詞`）に従います。動作やテキストオブジェクトを使って折りたたみオペレーターを渡すことができます。内部段落を折りたたむには `zfip` を実行します。ファイルの最後まで折りたたむには `zfG` を実行します。`{` と `}` の間のテキストを折りたたむには `zfa{` を実行します。

ビジュアルモードから折りたたむこともできます。折りたたみたい範囲をハイライトし（`v`、`V`、または `Ctrl-v`）、次に `zf` を実行します。

コマンドラインモードから `:fold` コマンドを使って折りたたむこともできます。現在の行とその次の行を折りたたむには、次のように実行します：

```shell
:,+1fold
```

`,+1` は範囲です。範囲にパラメータを渡さない場合、デフォルトで現在の行になります。`+1` は次の行の範囲インジケーターです。行5から10を折りたたむには `:5,10fold` を実行します。現在の位置から行の終わりまで折りたたむには `:,$fold` を実行します。

他にも多くの折りたたみおよび展開コマンドがあります。始めたばかりの頃は、覚えるには多すぎると感じます。最も便利なものは：
- `zR` ですべての折りたたみを開く。
- `zM` ですべての折りたたみを閉じる。
- `za` で折りたたみを切り替える。

`zR` と `zM` は任意の行で実行できますが、`za` は折りたたまれた/展開された行にいるときのみ機能します。折りたたみコマンドについてもっと学ぶには、`:h fold-commands` を確認してください。

## 異なる折りたたみ方法

上のセクションでは、Vimの手動折りたたみについて説明しました。Vimには6つの異なる折りたたみ方法があります：
1. 手動
2. インデント
3. 式
4. 構文
5. 差分
6. マーカー

現在使用している折りたたみ方法を確認するには、`:set foldmethod?` を実行します。デフォルトでは、Vimは `manual` メソッドを使用します。

この章の残りでは、他の5つの折りたたみ方法を学びます。インデント折りたたみから始めましょう。

## インデント折りたたみ

インデント折りたたみを使用するには、`'foldmethod'` をインデントに変更します：

```shell
:set foldmethod=indent
```

次のテキストがあるとします：

```shell
One
  Two
  Two again
```

`:set foldmethod=indent` を実行すると、次のようになります：

```shell
One
+-- 2 lines: Two -----
```

インデント折りたたみでは、Vimは各行の先頭にあるスペースの数を見て、`'shiftwidth'` オプションと比較して折りたたみ可能かどうかを判断します。`'shiftwidth'` はインデントの各ステップに必要なスペースの数を返します。次のように実行すると：

```shell
:set shiftwidth?
```

Vimのデフォルトの `'shiftwidth'` 値は2です。上のテキストでは、行の先頭と "Two" および "Two again" の間に2つのスペースがあります。Vimはスペースの数を見て、`'shiftwidth'` の値が2であることを確認すると、その行はインデント折りたたみレベル1を持つと見なします。

今回は、行の先頭とテキストの間にスペースが1つだけあるとします：

```shell
One
 Two
 Two again
```

現在、`:set foldmethod=indent` を実行すると、Vimはインデントされた行を折りたたみません。各行に十分なスペースがないためです。1つのスペースはインデントとは見なされません。しかし、`'shiftwidth'` を1に変更すると：

```shell
:set shiftwidth=1
```

テキストは今や折りたたみ可能です。これでインデントと見なされます。

`shiftwidth` を再び2に戻し、テキストの間のスペースを再び2にします。さらに、2つの追加テキストを追加します：

```shell
One
  Two
  Two again
    Three
    Three again
```

折りたたみを実行すると（`zM`）、次のようになります：

```shell
One
+-- 4 lines: Two -----
```

折りたたまれた行を展開すると（`zR`）、次にカーソルを "Three" に置いてテキストの折りたたみ状態を切り替えます（`za`）：

```shell
One
  Two
  Two again
+-- 2 lines: Three -----
```

これは何ですか？折りたたみの中の折りたたみ？

ネストされた折りたたみは有効です。"Two" および "Two again" のテキストは折りたたみレベル1を持ち、"Three" および "Three again" のテキストは折りたたみレベル2を持ちます。折りたたみ可能なテキストの中により高い折りたたみレベルのテキストがある場合、複数の折りたたみ層があります。

## 式折りたたみ

式折りたたみでは、折りたたみのための式を定義できます。折りたたみ式を定義した後、Vimは各行の `'foldexpr'` の値をスキャンします。これは適切な値を返すように設定する必要がある変数です。`'foldexpr'` が0を返すと、その行は折りたたまれません。1を返すと、その行は折りたたみレベル1を持ちます。2を返すと、その行は折りたたみレベル2を持ちます。整数以外の値もありますが、それについては説明しません。興味があれば、`:h fold-expr` を確認してください。

まず、折りたたみ方法を変更しましょう：

```shell
:set foldmethod=expr
```

朝食の食品リストがあり、"p" で始まるすべての朝食アイテムを折りたたみたいとします：

```shell
donut
pancake
pop-tarts
protein bar
salmon
scrambled eggs
```

次に、`foldexpr` を変更して "p" で始まる式をキャプチャします：

```shell
:set foldexpr=getline(v:lnum)[0]==\\"p\\"
```

上記の式は複雑に見えます。分解してみましょう：
- `:set foldexpr` は `'foldexpr'` オプションをカスタム式を受け入れるように設定します。
- `getline()` は、任意の行の内容を返すVimscript関数です。`:echo getline(5)` を実行すると、行5の内容が返されます。
- `v:lnum` は、`'foldexpr'` 式のためのVimの特別な変数です。Vimは各行をスキャンし、その瞬間に各行の番号を `v:lnum` 変数に保存します。行5では、`v:lnum` の値は5です。行10では、`v:lnum` の値は10です。
- `getline(v:lnum)[0]` の `[0]` は、各行の最初の文字です。Vimが行をスキャンすると、`getline(v:lnum)` は各行の内容を返します。`getline(v:lnum)[0]` は各行の最初の文字を返します。リストの最初の行 "donut" の場合、`getline(v:lnum)[0]` は "d" を返します。リストの2行目 "pancake" の場合、`getline(v:lnum)[0]` は "p" を返します。
- `==\\"p\\"` は等式式の後半です。評価した式が "p" と等しいかどうかを確認します。もし真であれば、1を返します。偽であれば、0を返します。Vimでは、1は真、0は偽です。したがって、"p" で始まる行では1を返します。`'foldexpr'` が1の値を持つ場合、その行は折りたたみレベル1を持ちます。

この式を実行した後、次のように表示されるはずです：

```shell
donut
+-- 3 lines: pancake -----
salmon
scrambled eggs
```

## 構文折りたたみ

構文折りたたみは、構文言語のハイライトによって決まります。`[vim-polyglot](https://github.com/sheerun/vim-polyglot)` のような言語構文プラグインを使用すると、構文折りたたみはすぐに機能します。折りたたみ方法を構文に変更するだけです：

```shell
:set foldmethod=syntax
```

JavaScriptファイルを編集していて、次のような配列があると仮定します：

```shell
const nums = [
  one,
  two,
  three,
  four
]
```

これは構文折りたたみで折りたたまれます。特定の言語の構文ハイライトを定義するとき（通常は `syntax/` ディレクトリ内）、折りたたみ可能にするために `fold` 属性を追加できます。以下は、vim-polyglotのJavaScript構文ファイルからのスニペットです。最後の `fold` キーワードに注目してください。

```shell
syntax region  jsBracket                      matchgroup=jsBrackets            start=/\[/ end=/\]/ contains=@jsExpression,jsSpreadExpression extend fold
```

このガイドでは `syntax` 機能については説明しません。興味があれば、`:h syntax.txt` を確認してください。

## 差分折りたたみ

Vimは、2つ以上のファイルを比較するための差分手順を実行できます。

`file1.txt` があるとします：

```shell
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
```

そして `file2.txt` があるとします：

```shell
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
emacs is ok
```

`vimdiff file1.txt file2.txt` を実行します：

```shell
+-- 3 lines: vim is awesome -----
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
[vim is awesome] / [emacs is ok]
```

Vimは自動的に同一の行のいくつかを折りたたみます。`vimdiff` コマンドを実行しているとき、Vimは自動的に `foldmethod=diff` を使用します。`:set foldmethod?` を実行すると、`diff` が返されます。

## マーカー折りたたみ

マーカー折りたたみを使用するには、次のように実行します：

```shell
:set foldmethod=marker
```

次のテキストがあるとします：

```shell
Hello

{{{
world
vim
}}}
```

`zM` を実行すると、次のようになります：

```shell
hello

+-- 4 lines: -----
```

Vimは `{{{` と `}}}` を折りたたみインジケーターとして見なし、それらの間のテキストを折りたたみます。マーカー折りたたみでは、Vimは `'foldmarker'` オプションで定義された特別なマーカーを探して、折りたたみ領域をマークします。Vimが使用するマーカーを確認するには、次のように実行します：

```shell
:set foldmarker?
```

デフォルトでは、Vimは `{{{` と `}}}` をインジケーターとして使用します。インジケーターを "coffee1" と "coffee2" のような別のテキストに変更したい場合：

```shell
:set foldmarker=coffee1,coffee2
```

次のテキストがあるとします：

```shell
hello

coffee1
world
vim
coffee2
```

今、Vimは `coffee1` と `coffee2` を新しい折りたたみマーカーとして使用します。ちなみに、インジケーターはリテラル文字列でなければならず、正規表現ではありません。

## 折りたたみの永続化

Vimセッションを閉じると、すべての折りたたみ情報が失われます。このファイル `count.txt` があるとします：

```shell
one
two
three
four
five
```

次に、行 "three" から下を手動で折りたたみます（`:3,$fold`）：

```shell
one
two
+-- 3 lines: three ---
```

Vimを終了して `count.txt` を再度開くと、折りたたみはもうありません！

折りたたみを保持するには、折りたたんだ後に次のように実行します：

```shell
:mkview
```

次に `count.txt` を開くときは、次のように実行します：

```shell
:loadview
```

折りたたみが復元されます。ただし、`mkview` と `loadview` を手動で実行する必要があります。いつか、ファイルを閉じる前に `mkview` を実行するのを忘れて、すべての折りたたみを失うことになるでしょう。このプロセスを自動化するにはどうすればよいでしょうか？

`.txt` ファイルを閉じるときに自動的に `mkview` を実行し、`.txt` ファイルを開くときに `loadview` を実行するには、vimrcに次のように追加します：

```shell
autocmd BufWinLeave *.txt mkview
autocmd BufWinEnter *.txt silent loadview
```

`autocmd` は、イベントトリガーでコマンドを実行するために使用されることを思い出してください。ここでの2つのイベントは：
- `BufWinLeave` は、ウィンドウからバッファを削除するとき。
- `BufWinEnter` は、ウィンドウにバッファを読み込むとき。

これで、`.txt` ファイル内で折りたたみを行い、Vimを終了すると、次回そのファイルを開くと、折りたたみ情報が復元されます。

デフォルトでは、Vimは `mkview
## スマートな方法で折りたたみを学ぶ

私が最初にVimを始めたとき、折りたたみを学ぶことを怠りました。なぜなら、それが役に立つとは思わなかったからです。しかし、コーディングを続けるにつれて、折りたたみがどれほど役立つかを実感しています。戦略的に配置された折りたたみは、テキスト構造のより良い概要を提供してくれます。まるで本の目次のように。

折りたたみを学ぶときは、まず手動の折りたたみから始めてください。これは移動中にも使用できます。その後、インデントやマーカーの折りたたみを行うさまざまなトリックを徐々に学んでいきます。最後に、構文や式の折りたたみを学びます。後者の2つを使って、自分自身のVimプラグインを書くこともできます。