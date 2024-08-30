---
description: このドキュメントでは、Vimscriptのデータ型を使用して条件文とループを作成する方法を学びます。基本的なプログラムの構成要素を紹介します。
title: Ch26. Vimscript Conditionals and Loops
---

基本データ型が何であるかを学んだ後、次のステップはそれらを組み合わせて基本的なプログラムを書く方法を学ぶことです。基本的なプログラムは条件文とループで構成されています。

この章では、Vimscriptのデータ型を使用して条件文とループを書く方法を学びます。

## 関係演算子

Vimscriptの関係演算子は、多くのプログラミング言語と似ています：

```shell
a == b		equal to
a != b		not equal to
a >  b		greater than
a >= b		greater than or equal to
a <  b		less than
a <= b		less than or equal to
```

例えば：

```shell
:echo 5 == 5
:echo 5 != 5
:echo 10 > 5
:echo 10 >= 5
:echo 10 < 5
:echo 5 <= 5
```

文字列は算術式で数値に強制変換されることを思い出してください。ここでもVimは等式表現で文字列を数値に強制変換します。"5foo"は5（真）に強制変換されます：

```shell
:echo 5 == "5foo"
" returns true
```

また、"foo5"のように数値以外の文字で始まる文字列は、数値0（偽）に変換されることを思い出してください。

```shell
echo 5 == "foo5"
" returns false
```

### 文字列論理演算子

Vimには文字列を比較するための追加の関係演算子があります：

```shell
a =~ b
a !~ b
```

例えば：

```shell
let str = "hearty breakfast"

echo str =~ "hearty"
" returns true

echo str =~ "dinner"
" returns false

echo str !~ "dinner"
" returns true
```

`=~`演算子は、指定された文字列に対して正規表現マッチを行います。上記の例では、`str =~ "hearty"`は`str`が"hearty"パターンを*含む*ため、trueを返します。`==`や`!=`を常に使用できますが、それらを使用すると、表現が全体の文字列に対して比較されます。`=~`や`!~`はより柔軟な選択肢です。

```shell
echo str == "hearty"
" returns false

echo str == "hearty breakfast"
" returns true
```

これを試してみましょう。大文字の"H"に注意してください：

```shell
echo str =~ "Hearty"
" true
```

"Hearty"が大文字であるにもかかわらず、trueを返します。面白いことに、私のVim設定は大文字小文字を無視するように設定されているため（`set ignorecase`）、Vimが等価性をチェックする際に、私のVim設定を使用して大文字小文字を無視します。もし大文字小文字を無視しない設定にした場合（`set noignorecase`）、比較はfalseを返します。

```shell
set noignorecase
echo str =~ "Hearty"
" returns false because case matters

set ignorecase
echo str =~ "Hearty"
" returns true because case doesn't matter
```

他の人のためにプラグインを書く場合、これは厄介な状況です。ユーザーは`ignorecase`を使用していますか、それとも`noignorecase`ですか？ユーザーに大文字小文字の無視オプションを変更させたくはありません。では、どうすればよいでしょうか？

幸いなことに、Vimには*常に*大文字小文字を無視または一致させることができる演算子があります。常に大文字小文字を一致させるには、末尾に`#`を追加します。

```shell
set ignorecase
echo str =~# "hearty"
" returns true

echo str =~# "HearTY"
" returns false

set noignorecase
echo str =~# "hearty"
" true

echo str =~# "HearTY"
" false

echo str !~# "HearTY"
" true
```

比較する際に常に大文字小文字を無視するには、`?`を付け加えます：

```shell
set ignorecase
echo str =~? "hearty"
" true

echo str =~? "HearTY"
" true

set noignorecase
echo str =~? "hearty"
" true

echo str =~? "HearTY"
" true

echo str !~? "HearTY"
" false
```

私は常に大文字小文字を一致させるために`#`を使用することを好みます。

## If

Vimの等式表現を見たので、基本的な条件演算子である`if`文に触れましょう。

最低限、構文は次のようになります：

```shell
if {clause}
  {some expression}
endif
```

`elseif`や`else`を使ってケース分析を拡張できます。

```shell
if {predicate1}
  {expression1}
elseif {predicate2}
  {expression2}
elseif {predicate3}
  {expression3}
else
  {expression4}
endif
```

例えば、プラグイン[vim-signify](https://github.com/mhinz/vim-signify)は、Vimの設定に応じて異なるインストール方法を使用します。以下は、`if`文を使用した彼らの`readme`からのインストール手順です：

```shell
if has('nvim') || has('patch-8.0.902')
  Plug 'mhinz/vim-signify'
else
  Plug 'mhinz/vim-signify', { 'branch': 'legacy' }
endif
```

## 三項演算子

Vimにはワンライナーのケース分析のための三項演算子があります：

```shell
{predicate} ? expressiontrue : expressionfalse
```

例えば：

```shell
echo 1 ? "I am true" : "I am false"
```

1は真であるため、Vimは"I am true"を出力します。特定の時間を過ぎた場合に`background`を暗く設定したい場合は、これをvimrcに追加します：

```shell
let &background = strftime("%H") < 18 ? "light" : "dark"
```

`&background`はVimの`'background'`オプションです。`strftime("%H")`は現在の時間を時間単位で返します。午後6時前であれば、明るい背景を使用します。そうでなければ、暗い背景を使用します。

## or

論理の"or"（`||`）は、多くのプログラミング言語と同様に機能します。

```shell
{Falsy expression}  || {Falsy expression}   false
{Falsy expression}  || {Truthy expression}  true
{Truthy expression} || {Falsy expression}   true
{Truthy expression} || {Truthy expression}  true
```

Vimは表現を評価し、1（真）または0（偽）を返します。

```shell
echo 5 || 0
" returns 1

echo 5 || 5
" returns 1

echo 0 || 0
" returns 0

echo "foo5" || "foo5"
" returns 0

echo "5foo" || "foo5"
" returns 1
```

現在の表現が真と評価される場合、次の表現は評価されません。

```shell
let one_dozen = 12

echo one_dozen || two_dozen
" returns 1

echo two_dozen || one_dozen
" returns error
```

`two_dozen`は決して定義されません。`one_dozen || two_dozen`という表現はエラーを投げません。なぜなら、`one_dozen`が最初に評価されて真と見なされるため、Vimは`two_dozen`を評価しないからです。

## and

論理の"and"（`&&`）は論理のorの補完です。

```shell
{Falsy Expression}  && {Falsy Expression}   false
{Falsy expression}  && {Truthy expression}  false
{Truthy Expression} && {Falsy Expression}   false
{Truthy expression} && {Truthy expression}  true
```

例えば：

```shell
echo 0 && 0
" returns 0

echo 0 && 10
" returns 0
```

`&&`は最初の偽の表現を見るまで表現を評価します。例えば、`true && true`がある場合、両方を評価して`true`を返します。`true && false && true`がある場合、最初の`true`を評価し、最初の`false`で停止します。3番目の`true`は評価されません。

```shell
let one_dozen = 12
echo one_dozen && 10
" returns 1

echo one_dozen && v:false
" returns 0

echo one_dozen && two_dozen
" returns error

echo exists("one_dozen") && one_dozen == 12
" returns 1
```

## for

`for`ループはリストデータ型と一般的に使用されます。

```shell
let breakfasts = ["pancakes", "waffles", "eggs"]

for breakfast in breakfasts
  echo breakfast
endfor
```

ネストされたリストでも機能します：

```shell
let meals = [["breakfast", "pancakes"], ["lunch", "fish"], ["dinner", "pasta"]]

for [meal_type, food] in meals
  echo "I am having " . food . " for " . meal_type
endfor
```

技術的には、`keys()`メソッドを使用して辞書で`for`ループを使用できます。

```shell
let beverages = #{breakfast: "milk", lunch: "orange juice", dinner: "water"}
for beverage_type in keys(beverages)
  echo "I am drinking " . beverages[beverage_type] . " for " . beverage_type
endfor
```

## While

もう一つの一般的なループは`while`ループです。

```shell
let counter = 1
while counter < 5
  echo "Counter is: " . counter
  let counter += 1
endwhile
```

現在の行から最後の行までの内容を取得するには：

```shell
let current_line = line(".")
let last_line = line("$")

while current_line <= last_line
  echo getline(current_line)
  let current_line += 1
endwhile
```

## エラーハンドリング

プログラムが期待通りに動作しないことがよくあります。その結果、あなたを混乱させます（言葉遊び）。必要なのは適切なエラーハンドリングです。

### Break

`while`や`for`ループ内で`break`を使用すると、ループが停止します。

ファイルの先頭から現在の行までのテキストを取得しますが、"donut"という単語が見えたら停止します：

```shell
let line = 0
let last_line = line("$")
let total_word = ""

while line <= last_line
  let line += 1
  let line_text = getline(line)
  if line_text =~# "donut"
    break
  endif
  echo line_text
  let total_word .= line_text . " "
endwhile

echo total_word
```

もしテキストが以下のようであれば：

```shell
one
two
three
donut
four
five
```

上記の`while`ループを実行すると、"one two three"が返され、残りのテキストは返されません。なぜなら、ループは"donut"に一致した時点でブレークするからです。

### Continue

`continue`メソッドは`break`に似ており、ループ中に呼び出されます。違いは、ループから抜けるのではなく、その現在の反復をスキップすることです。

同じテキストを持っているが、`break`の代わりに`continue`を使用した場合：

```shell
let line = 0
let last_line = line("$")
let total_word = ""

while line <= last_line
  let line += 1
  let line_text = getline(line)
  if line_text =~# "donut"
    continue
  endif
  echo line_text
  let total_word .= line_text . " "
endwhile

echo total_word
```

この場合、`one two three four five`が返されます。"donut"という単語のある行をスキップしますが、ループは続行します。
### try, finally, and catch

Vimにはエラーを処理するための`try`、`finally`、および`catch`があります。エラーをシミュレートするには、`throw`コマンドを使用できます。

```shell
try
  echo "Try"
  throw "Nope"
endtry
```

これを実行します。Vimは`"Exception not caught: Nope`エラーで文句を言います。

次に、catchブロックを追加します：

```shell
try
  echo "Try"
  throw "Nope"
catch
  echo "Caught it"
endtry
```

これでエラーはなくなりました。「Try」と「Caught it」が表示されるはずです。

`catch`を削除して`finally`を追加しましょう：

```shell
try
  echo "Try"
  throw "Nope"
  echo "You won't see me"
finally
  echo "Finally"
endtry
```

これを実行します。今度はVimがエラーと「Finally」を表示します。

すべてを組み合わせてみましょう：

```shell
try
  echo "Try"
  throw "Nope"
catch
  echo "Caught it"
finally
  echo "Finally"
endtry
```

今回はVimが「Caught it」と「Finally」の両方を表示します。Vimがエラーをキャッチしたため、エラーは表示されません。

エラーはさまざまな場所から発生します。別のエラーの原因は、以下のように存在しない関数を呼び出すことです：`Nope()`：

```shell
try
  echo "Try"
  call Nope()
catch
  echo "Caught it"
finally
  echo "Finally"
endtry
```

`catch`と`finally`の違いは、`finally`はエラーの有無にかかわらず常に実行されるのに対し、`catch`はコードがエラーを取得したときのみ実行されることです。

特定のエラーを`:catch`でキャッチできます。`:h :catch`によれば：

```shell
catch /^Vim:Interrupt$/.             " 割り込みをキャッチ
catch /^Vim\\%((\\a\\+)\\)\\=:E/.    " すべてのVimエラーをキャッチ
catch /^Vim\\%((\\a\\+)\\)\\=:/.     " エラーと割り込みをキャッチ
catch /^Vim(write):/.                " :write内のすべてのエラーをキャッチ
catch /^Vim\\%((\\a\\+)\\)\\=:E123:/ " エラーE123をキャッチ
catch /my-exception/.                " ユーザー例外をキャッチ
catch /.*/                           " すべてをキャッチ
catch.                               " /.*/と同じ
```

`try`ブロック内では、割り込みはキャッチ可能なエラーと見なされます。

```shell
try
  catch /^Vim:Interrupt$/
  sleep 100
endtry
```

vimrcで、[gruvbox](https://github.com/morhetz/gruvbox)のようなカスタムカラースキームを使用していて、誤ってカラースキームディレクトリを削除したが、vimrcに`colorscheme gruvbox`の行が残っている場合、`source`するとVimはエラーをスローします。これを修正するために、vimrcに以下を追加しました：

```shell
try
  colorscheme gruvbox
catch
  colorscheme default
endtry
```

これで、`gruvbox`ディレクトリなしでvimrcを`source`すると、Vimは`colorscheme default`を使用します。

## スマートな方法で条件文を学ぶ

前の章では、Vimの基本データ型について学びました。この章では、それらを組み合わせて条件文やループを使用して基本的なプログラムを書く方法を学びました。これらはプログラミングの基本要素です。

次に、変数のスコープについて学びましょう。