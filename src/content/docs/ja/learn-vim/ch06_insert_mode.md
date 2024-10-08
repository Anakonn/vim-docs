---
description: このドキュメントでは、Vimの挿入モードにおける効率的なタイピングのための機能と、挿入モードへの移行方法を学びます。
title: Ch06. Insert Mode
---

挿入モードは、多くのテキストエディタのデフォルトモードです。このモードでは、入力したものがそのまま表示されます。

しかし、それは学ぶことがないというわけではありません。Vimの挿入モードには多くの便利な機能があります。この章では、Vimの挿入モード機能を使用して、タイピング効率を向上させる方法を学びます。

## 挿入モードに入る方法

通常モードから挿入モードに入る方法はいくつかあります。以下はその一部です：

```shell
i    カーソルの前にテキストを挿入
I    行の最初の非空白文字の前にテキストを挿入
a    カーソルの後にテキストを追加
A    行の最後にテキストを追加
o    カーソルの下に新しい行を開始し、テキストを挿入
O    カーソルの上に新しい行を開始し、テキストを挿入
s    カーソルの下の文字を削除し、テキストを挿入
S    現在の行を削除し、テキストを挿入（"cc"の同義語）
gi   最後の挿入モードが停止した位置にテキストを挿入
gI   行の先頭にテキストを挿入（カラム1）
```

小文字と大文字のパターンに注意してください。各小文字のコマンドには大文字の対応があります。初心者の場合、上記のリスト全体を覚えられなくても心配しないでください。`i` と `o` から始めてみてください。これらで十分に始めることができます。徐々に学んでいきましょう。

## 挿入モードから出る方法

挿入モードから通常モードに戻る方法はいくつかあります：

```shell
<Esc>     挿入モードを終了し、通常モードに戻る
Ctrl-[    挿入モードを終了し、通常モードに戻る
Ctrl-C    Ctrl-[ および <Esc> と同様だが、略語をチェックしない
```

私は `<Esc>` キーが遠すぎると感じるので、コンピュータの `<Caps-Lock>` を `<Esc>` のように動作するようにマッピングしています。Bill JoyのADM-3Aキーボード（Viの作成者）を調べると、現代のキーボードのように左上の遠い位置に `<Esc>` キーがあるのではなく、`q` キーの左側にあることがわかります。だからこそ、`<Caps lock>` を `<Esc>` にマッピングするのは理にかなっていると思います。

私が見たもう一つの一般的な慣習は、挿入モードで `<Esc>` を `jj` または `jk` にマッピングすることです。このオプションを好む場合は、vimrcファイルに以下のいずれかの行（または両方）を追加してください。

```shell
inoremap jj <Esc>
inoremap jk <Esc>
```

## 挿入モードの繰り返し

挿入モードに入る前にカウントパラメータを渡すことができます。例えば：

```shell
10i
```

「hello world!」と入力して挿入モードを終了すると、Vimはそのテキストを10回繰り返します。これは、任意の挿入モードの方法（例：`10I`、`11a`、`12o`）で機能します。

## 挿入モードでのチャンク削除

タイピングミスをしたとき、`<Backspace>` を繰り返し押すのは面倒です。通常モードに戻ってミスを削除する方が理にかなっているかもしれません。また、挿入モード中に複数の文字を一度に削除することもできます。

```shell
Ctrl-h    1文字削除
Ctrl-w    1単語削除
Ctrl-u    行全体を削除
```

## レジスタからの挿入

Vimのレジスタは、将来使用するためのテキストを保存できます。挿入モード中に任意の名前付きレジスタからテキストを挿入するには、`Ctrl-R` とレジスタシンボルを入力します。使用できるシンボルは多数ありますが、このセクションでは名前付きレジスタ（a-z）のみを扱います。

実際に見るためには、まず単語をレジスタaにヤンクする必要があります。カーソルを任意の単語に移動させて、次のように入力します：

```shell
"ayiw
```

- `"a` は、次のアクションのターゲットがレジスタaに行くことをVimに伝えます。
- `yiw` は内側の単語をヤンクします。リフレッシャーとしてVim文法の章を確認してください。

レジスタaには、今ヤンクした単語が含まれています。挿入モード中に、レジスタaに保存されたテキストを貼り付けるには：

```shell
Ctrl-R a
```

Vimには複数の種類のレジスタがあります。これについては後の章で詳しく説明します。

## スクロール

挿入モード中にスクロールできることをご存知でしたか？挿入モード中に `Ctrl-X` サブモードに入ると、追加の操作ができます。スクロールもその一つです。

```shell
Ctrl-X Ctrl-Y    上にスクロール
Ctrl-X Ctrl-E    下にスクロール
```

## 自動補完

上記のように、挿入モードから `Ctrl-X` を押すと、Vimはサブモードに入ります。この挿入モードサブモード中にテキストの自動補完を行うことができます。これは [intellisense](https://code.visualstudio.com/docs/editor/intellisense) や他の言語サーバープロトコル（LSP）ほど良くはありませんが、すぐに使える機能としては非常に優れています。

ここに自動補完を始めるためのいくつかの便利なコマンドがあります：

```shell
Ctrl-X Ctrl-L	   行全体を挿入
Ctrl-X Ctrl-N	   現在のファイルからテキストを挿入
Ctrl-X Ctrl-I	   含まれているファイルからテキストを挿入
Ctrl-X Ctrl-F	   ファイル名を挿入
```

自動補完をトリガーすると、Vimはポップアップウィンドウを表示します。ポップアップウィンドウを上下に移動するには、`Ctrl-N` と `Ctrl-P` を使用します。

Vimには、`Ctrl-X` サブモードを使用しない2つの自動補完ショートカットもあります：

```shell
Ctrl-N             次の単語の一致を見つける
Ctrl-P             前の単語の一致を見つける
```

一般的に、Vimは自動補完ソースとしてすべての利用可能なバッファ内のテキストを見ます。もし「Chocolate donuts are the best」と書かれた行を持つオープンバッファがある場合：
- 「Choco」と入力して `Ctrl-X Ctrl-L` を行うと、全行が一致して表示されます。
- 「Choco」と入力して `Ctrl-P` を行うと、「Chocolate」という単語が一致して表示されます。

自動補完はVimにおいて広範なトピックです。これは氷山の一角に過ぎません。詳細を学ぶには、`:h ins-completion` を確認してください。

## 通常モードコマンドの実行

挿入モード中に通常モードコマンドを実行できることをご存知でしたか？

挿入モード中に `Ctrl-O` を押すと、挿入-通常サブモードになります。左下のモードインジケーターを見ると、通常は `-- INSERT --` と表示されますが、`Ctrl-O` を押すと `-- (insert) --` に変わります。このモードでは、*1つの* 通常モードコマンドを実行できます。できることのいくつか：

**センタリングとジャンプ**

```shell
Ctrl-O zz       ウィンドウを中央に
Ctrl-O H/M/L    ウィンドウの上/中/下にジャンプ
Ctrl-O 'a       マークaにジャンプ
```

**テキストの繰り返し**

```shell
Ctrl-O 100ihello    "hello" を100回挿入
```

**ターミナルコマンドの実行**

```shell
Ctrl-O !! curl https://google.com    curlを実行
Ctrl-O !! pwd                        pwdを実行
```

**より速く削除**

```shell
Ctrl-O dtz    現在の位置から「z」まで削除
Ctrl-O D      現在の位置から行の終わりまで削除
```

## 賢い方法で挿入モードを学ぶ

もしあなたが私のように他のテキストエディタから来た場合、挿入モードに留まることが魅力的かもしれません。しかし、テキストを入力していないときに挿入モードに留まることはアンチパターンです。新しいテキストを入力していないときは、通常モードに戻る習慣を身につけましょう。

テキストを挿入する必要があるときは、まずそのテキストがすでに存在するか自問してください。存在する場合は、入力するのではなく、そのテキストをヤンクまたは移動させてみてください。挿入モードを使用しなければならない場合は、可能な限りそのテキストを自動補完できるか確認してください。同じ単語を複数回入力することは避けましょう。