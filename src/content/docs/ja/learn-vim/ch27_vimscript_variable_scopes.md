---
description: Vimの変数の異なるソースとスコープについて学び、可変および不変の変数の使い方を理解します。
title: Ch27. Vimscript Variable Scopes
---

Vimscript関数に入る前に、Vim変数の異なるソースとスコープについて学びましょう。

## 可変および不変変数

Vimで変数に値を割り当てるには`let`を使用します：

```shell
let pancake = "pancake"
```

その後、いつでもその変数を呼び出すことができます。

```shell
echo pancake
" returns "pancake"
```

`let`は可変であり、将来的にいつでも値を変更できます。

```shell
let pancake = "pancake"
let pancake = "not waffles"

echo pancake
" returns "not waffles"
```

設定された変数の値を変更したい場合でも、`let`を使用する必要があることに注意してください。

```shell
let beverage = "milk"

beverage = "orange juice"
" throws an error
```

不変変数は`const`で定義できます。不変であるため、一度変数の値が割り当てられると、異なる値で再割り当てすることはできません。

```shell
const waffle = "waffle"
const waffle = "pancake"
" throws an error
```

## 変数のソース

変数には、環境変数、オプション変数、レジスタ変数の3つのソースがあります。

### 環境変数

Vimはあなたのターミナル環境変数にアクセスできます。例えば、ターミナルに`SHELL`環境変数がある場合、Vimから次のようにアクセスできます：

```shell
echo $SHELL
" returns $SHELL value. In my case, it returns /bin/bash
```

### オプション変数

`&`を使ってVimのオプションにアクセスできます（これらは`set`でアクセスする設定です）。

例えば、Vimが使用している背景を確認するには、次のように実行します：

```shell
echo &background
" returns either "light" or "dark"
```

または、常に`set background?`を実行して`background`オプションの値を確認できます。

### レジスタ変数

`@`を使ってVimのレジスタにアクセスできます（Ch. 08）。

例えば、値「chocolate」がレジスタaに既に保存されているとします。それにアクセスするには`@a`を使用します。また、`let`で更新することもできます。

```shell
echo @a
" returns chocolate

let @a .= " donut"

echo @a
" returns "chocolate donut"
```

今、レジスタ`a`からペーストすると（`"ap`）、"chocolate donut"が返されます。演算子`.=`は2つの文字列を連結します。式`let @a .= " donut"`は`let @a = @a . " donut"`と同じです。

## 変数のスコープ

Vimには9つの異なる変数スコープがあります。それらは先頭の文字で識別できます：

```shell
g:           グローバル変数
{nothing}    グローバル変数
b:           バッファローカル変数
w:           ウィンドウローカル変数
t:           タブローカル変数
s:           ソースされたVimscript変数
l:           関数ローカル変数
a:           関数の形式パラメータ変数
v:           組み込みVim変数
```

### グローバル変数

「通常の」変数を宣言する場合：

```shell
let pancake = "pancake"
```

`pancake`は実際にはグローバル変数です。グローバル変数を定義すると、どこからでも呼び出すことができます。

変数の先頭に`g:`を付けることでもグローバル変数が作成されます。

```shell
let g:waffle = "waffle"
```

この場合、`pancake`と`g:waffle`は同じスコープを持っています。どちらも`g:`を付けても付けなくても呼び出すことができます。

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

### バッファ変数

`b:`が先頭に付いた変数はバッファ変数です。バッファ変数は現在のバッファにローカルな変数です（Ch. 02）。複数のバッファが開いている場合、各バッファには独自のバッファ変数のリストがあります。

バッファ1では：

```shell
const b:donut = "chocolate donut"
```

バッファ2では：

```shell
const b:donut = "blueberry donut"
```

バッファ1から`echo b:donut`を実行すると、"chocolate donut"が返されます。バッファ2から実行すると、"blueberry donut"が返されます。

ちなみに、Vimには現在のバッファに対するすべての変更を追跡する*特別な*バッファ変数`b:changedtick`があります。

1. `echo b:changedtick`を実行し、返される数をメモします。
2. Vimで変更を加えます。
3. 再度`echo b:changedtick`を実行し、今返される数をメモします。

### ウィンドウ変数

`w:`が先頭に付いた変数はウィンドウ変数です。それはそのウィンドウ内にのみ存在します。

ウィンドウ1では：

```shell
const w:donut = "chocolate donut"
```

ウィンドウ2では：

```shell
const w:donut = "raspberry donut"
```

各ウィンドウで`echo w:donut`を呼び出すと、ユニークな値が得られます。

### タブ変数

`t:`が先頭に付いた変数はタブ変数です。それはそのタブ内にのみ存在します。

タブ1では：

```shell
const t:donut = "chocolate donut"
```

タブ2では：

```shell
const t:donut = "blackberry donut"
```

各タブで`echo t:donut`を呼び出すと、ユニークな値が得られます。

### スクリプト変数

`s:`が先頭に付いた変数はスクリプト変数です。これらの変数はそのスクリプト内からのみアクセスできます。

任意のファイル`dozen.vim`があり、その中に次のようにあります：

```shell
let s:dozen = 12

function Consume()
  let s:dozen -= 1
  echo s:dozen " is left"
endfunction
```

`:source dozen.vim`でファイルをソースします。今、`Consume`関数を呼び出します：

```shell
:call Consume()
" returns "11 is left"

:call Consume()
" returns "10 is left"

:echo s:dozen
" Undefined variable error
```

`Consume`を呼び出すと、期待通りに`s:dozen`の値が減少するのがわかります。直接`s:dozen`の値を取得しようとすると、スコープ外のためVimは見つけられません。`s:dozen`は`dozen.vim`の内部からのみアクセス可能です。

`dozen.vim`ファイルをソースするたびに、`s:dozen`カウンターはリセットされます。もし`s:dozen`の値を減少させている途中で`:source dozen.vim`を実行すると、カウンターは12にリセットされます。これは予期しないユーザーにとって問題になる可能性があります。この問題を修正するために、コードをリファクタリングします：

```shell
if !exists("s:dozen")
  let s:dozen = 12
endif

function Consume()
  let s:dozen -= 1
  echo s:dozen
endfunction
```

これで、減少させている途中で`dozen.vim`をソースすると、Vimは`!exists("s:dozen")`を読み取り、それが真であることを確認し、値を12にリセットしません。

### 関数ローカルおよび関数形式パラメータ変数

関数ローカル変数（`l:`）と関数形式変数（`a:`）は次の章で扱います。

### 組み込みVim変数

`v:`が先頭に付いた変数は特別な組み込みVim変数です。これらの変数を定義することはできません。すでにいくつか見たことがあります。
- `v:version`は使用しているVimのバージョンを教えてくれます。
- `v:key`は辞書を反復処理しているときの現在のアイテムの値を含みます。
- `v:val`は`map()`または`filter()`操作を実行しているときの現在のアイテムの値を含みます。
- `v:true`、`v:false`、`v:null`、および`v:none`は特別なデータ型です。

他にも変数があります。Vimの組み込み変数のリストについては、`:h vim-variable`または`:h v:`を確認してください。

## スマートにVim変数スコープを使用する

環境、オプション、およびレジスタ変数に迅速にアクセスできることは、エディタとターミナル環境をカスタマイズするための広範な柔軟性を提供します。また、Vimには9つの異なる変数スコープがあり、それぞれ特定の制約の下に存在することも学びました。これらのユニークな変数タイプを活用して、プログラムを分離することができます。

ここまで来ました。データ型、組み合わせの手段、変数スコープについて学びました。残っているのは1つだけ：関数です。