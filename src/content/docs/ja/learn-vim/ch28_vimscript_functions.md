---
description: Vimscriptの関数の基本構文とルールについて学び、関数の使い方を深く理解するための章です。
title: Ch28. Vimscript Functions
---

関数は抽象化の手段であり、新しい言語を学ぶ際の第三の要素です。

前の章では、Vimscriptのネイティブ関数（`len()`、`filter()`、`map()`など）やカスタム関数を実際に見てきました。この章では、関数がどのように機能するかをさらに深く学びます。

## 関数の構文ルール

Vimscriptの関数は、基本的に以下の構文を持っています。

```shell
function {FunctionName}()
  {do-something}
endfunction
```

関数の定義は、大文字で始まる必要があります。`function`キーワードで始まり、`endfunction`で終わります。以下は有効な関数の例です。

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

以下は、大文字で始まらないため無効な関数です。

```shell
function tasty()
  echo "Tasty"
endfunction
```

関数の前にスクリプト変数（`s:`）を付けると、小文字で使用できます。`function s:tasty()`は有効な名前です。Vimが大文字の名前を使用することを要求する理由は、Vimの組み込み関数（すべて小文字）との混同を防ぐためです。

関数名は数字で始めることはできません。`1Tasty()`は無効な関数名ですが、`Tasty1()`は有効です。また、関数名には`_`以外の非英数字文字を含めることはできません。`Tasty-food()`、`Tasty&food()`、および`Tasty.food()`は無効な関数名です。`Tasty_food()`は有効です。

同じ名前の関数を2つ定義すると、Vimは関数`Tasty`がすでに存在するとエラーを出します。同じ名前の以前の関数を上書きするには、`function`キーワードの後に`!`を追加します。

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

## 利用可能な関数の一覧表示

Vimのすべての組み込みおよびカスタム関数を表示するには、`:function`コマンドを実行します。`Tasty`関数の内容を確認するには、`:function Tasty`を実行します。

`:function /pattern`を使用して、パターンで関数を検索することもできます。これはVimの検索ナビゲーション（`/pattern`）と似ています。「map」というフレーズを含むすべての関数を検索するには、`:function /map`を実行します。外部プラグインを使用している場合、Vimはそれらのプラグインで定義された関数を表示します。

関数の起源を確認したい場合は、`:function`コマンドと一緒に`:verbose`コマンドを使用できます。「map」という単語を含むすべての関数の起源を確認するには、次のように実行します。

```shell
:verbose function /map
```

私がこれを実行したとき、いくつかの結果が得られました。この結果は、関数`fzf#vim#maps`の自動ロード関数（復習するには、Ch. 23を参照）が`~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim`ファイルの1263行目に書かれていることを示しています。これはデバッグに役立ちます。

```shell
function fzf#vim#maps(mode, ...)
        Last set from ~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim line 1263
```

## 関数の削除

既存の関数を削除するには、`:delfunction {Function_name}`を使用します。`Tasty`を削除するには、`:delfunction Tasty`を実行します。

## 関数の戻り値

関数が値を返すには、明示的な`return`値を渡す必要があります。そうしないと、Vimは自動的に暗黙の値0を返します。

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

空の`return`も0の値と同等です。

```shell
function! Tasty()
  echo "Tasty"
  return
endfunction
```

上記の関数を使用して`:echo Tasty()`を実行すると、Vimが「Tasty」を表示した後、暗黙の戻り値0を返します。`Tasty()`が「Tasty」値を返すようにするには、次のようにします。

```shell
function! Tasty()
  return "Tasty"
endfunction
```

これで、`:echo Tasty()`を実行すると、「Tasty」文字列が返されます。

式の中で関数を使用できます。Vimはその関数の戻り値を使用します。式`:echo Tasty() . " Food!"`は「Tasty Food!」を出力します。

## 形式的引数

`Tasty`関数に形式的引数`food`を渡すには、次のようにします。

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

echo Tasty("pastry")
" returns "Tasty pastry"
```

`a:`は前の章で言及した変数スコープの1つです。これは形式的パラメータ変数です。これは、Vimが関数内で形式的パラメータ値を取得する方法です。これがないと、Vimはエラーを出します。

```shell
function! Tasty(food)
  return "Tasty " . food
endfunction

echo Tasty("pasta")
" returns "undefined variable name" error
```

## 関数ローカル変数

前の章で学ばなかったもう1つの変数、関数ローカル変数（`l:`）について説明します。

関数を書くときに、内部で変数を定義できます。

```shell
function! Yummy()
  let location = "tummy"
  return "Yummy in my " . location
endfunction

echo Yummy()
" returns "Yummy in my tummy"
```

この文脈では、変数`location`は`l:location`と同じです。関数内で変数を定義すると、その変数はその関数に*ローカル*になります。ユーザーが`location`を見ると、それがグローバル変数と間違えられる可能性があります。私はあまり省略せずに、これは関数変数であることを示すために`l:`を付けることを好みます。

`l:count`を使用するもう1つの理由は、Vimには通常の変数のように見えるエイリアスを持つ特別な変数があります。`v:count`はその一例です。これは`count`のエイリアスを持っています。Vimでは、`count`を呼び出すことは`v:count`を呼び出すことと同じです。これらの特別な変数の1つを誤って呼び出すのは簡単です。

```shell
function! Calories()
  let count = "count"
  return "I do not " . count . " my calories"
endfunction

echo Calories()
" throws an error
```

上記の実行はエラーを投げます。なぜなら、`let count = "Count"`は暗黙的にVimの特別な変数`v:count`を再定義しようとするからです。特別な変数（`v:`）は読み取り専用であり、変更することはできません。これを修正するには、`l:count`を使用します。

```shell
function! Calories()
  let l:count = "count"
  return "I do not " . l:count . " my calories"
endfunction

echo Calories()
" returns "I do not count my calories"
```

## 関数の呼び出し

Vimには関数を呼び出すための`:call`コマンドがあります。

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

call Tasty("gravy")
```

`call`コマンドは戻り値を出力しません。`echo`で呼び出してみましょう。

```shell
echo call Tasty("gravy")
```

おっと、エラーが出ます。上記の`call`コマンドはコマンドラインコマンド（`:call`）です。上記の`echo`コマンドもコマンドラインコマンド（`:echo`）です。コマンドラインコマンドを別のコマンドラインコマンドで呼び出すことはできません。`call`コマンドの別の形式を試してみましょう。

```shell
echo call("Tasty", ["gravy"])
" returns "Tasty gravy"
```

混乱を避けるために、2つの異なる`call`コマンドを使用しました：`:call`コマンドラインコマンドと`call()`関数です。`call()`関数は、最初の引数として関数名（文字列）を受け取り、2番目の引数として形式的パラメータ（リスト）を受け取ります。

`:call`と`call()`についてもっと知りたい場合は、`:h call()`と`:h :call`を確認してください。

## デフォルト引数

関数パラメータにデフォルト値を`=`で提供できます。`Breakfast`を1つの引数だけで呼び出すと、`beverage`引数は「milk」のデフォルト値を使用します。

```shell
function! Breakfast(meal, beverage = "Milk")
  return "I had " . a:meal . " and " . a:beverage . " for breakfast"
endfunction

echo Breakfast("Hash Browns")
" returns I had hash browns and milk for breakfast

echo Breakfast("Cereal", "Orange Juice")
" returns I had Cereal and Orange Juice for breakfast
```

## 可変引数

可変引数は、三点リーダー（`...`）を使用して渡すことができます。可変引数は、ユーザーがいくつの変数を渡すかわからないときに便利です。

たとえば、食べ放題のビュッフェを作成しているとします（お客様がどれだけ食べるかわからない）：

```shell
function! Buffet(...)
  return a:1
endfunction
```

`echo Buffet("Noodles")`を実行すると、「Noodles」と出力されます。Vimは`...`に渡された*最初の*引数を表示するために`a:1`を使用します（`a:1`は最初の引数、`a:2`は2番目の引数、など）。`echo Buffet("Noodles", "Sushi")`を実行しても、やはり「Noodles」だけが表示されます。これを更新してみましょう。

```shell
function! Buffet(...)
  return a:1 . " " . a:2
endfunction

echo Buffet("Noodles", "Sushi")
" returns "Noodles Sushi"
```

このアプローチの問題は、`echo Buffet("Noodles")`（1つの変数だけで）を実行すると、Vimが未定義の変数`a:2`があると文句を言うことです。ユーザーが渡したものを正確に表示できるようにするにはどうすればよいでしょうか？

幸いなことに、Vimには`...`に渡された引数の*数*を表示するための特別な変数`a:0`があります。

```shell
function! Buffet(...)
  return a:0
endfunction

echo Buffet("Noodles")
" returns 1

echo Buffet("Noodles", "Sushi")
" returns 2

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returns 5
```

これにより、引数の長さを使用して反復処理できます。

```shell
function! Buffet(...)
  let l:food_counter = 1
  let l:foods = ""
  while l:food_counter <= a:0
    let l:foods .= a:{l:food_counter} . " "
    let l:food_counter += 1
  endwhile
  return l:foods
endfunction
```

波括弧`a:{l:food_counter}`は文字列補間であり、`food_counter`カウンターの値を使用して形式的パラメータ引数`a:1`、`a:2`、`a:3`などを呼び出します。

```shell
echo Buffet("Noodles")
" returns "Noodles"

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returns everything you passed: "Noodles Sushi Ice cream Tofu Mochi"
```

可変引数にはもう1つ特別な変数があります：`a:000`。これは、すべての可変引数の値をリスト形式で持っています。

```shell
function! Buffet(...)
  return a:000
endfunction

echo Buffet("Noodles")
" returns ["Noodles"]

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returns ["Noodles", "Sushi", "Ice cream", "Tofu", "Mochi"]
```

関数を`for`ループを使用してリファクタリングしましょう。

```shell
function! Buffet(...)
  let l:foods = ""
  for food_item in a:000
    let l:foods .= food_item . " "
  endfor
  return l:foods
endfunction

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returns Noodles Sushi Ice cream Tofu Mochi
```
## 範囲

*範囲*のあるVimscript関数を定義するには、関数定義の最後に`range`キーワードを追加します。範囲のある関数には、2つの特別な変数が利用可能です：`a:firstline`と`a:lastline`。

```shell
function! Breakfast() range
  echo a:firstline
  echo a:lastline
endfunction
```

行100にいるときに`call Breakfast()`を実行すると、`firstline`と`lastline`の両方に100が表示されます。行101から105を視覚的にハイライト（`v`、`V`、または`Ctrl-V`）して`call Breakfast()`を実行すると、`firstline`は101、`lastline`は105が表示されます。`firstline`と`lastline`は、関数が呼び出された最小および最大の範囲を表示します。

`:call`を使用して範囲を渡すこともできます。`：11,20call Breakfast()`を実行すると、`firstline`に11、`lastline`に20が表示されます。

「Vimscript関数が範囲を受け入れるのは良いけれど、`line(".")`で行番号を取得できないの？同じことにならない？」と聞くかもしれません。

良い質問です。もしこれがあなたの意味するところなら：

```shell
function! Breakfast()
  echo line(".")
endfunction
```

`:11,20call Breakfast()`を呼び出すと、`Breakfast`関数は範囲内の各行に対して10回（各行ごとに1回）実行されます。範囲引数を渡した場合と比較してください：

```shell
function! Breakfast() range
  echo line(".")
endfunction
```

`11,20call Breakfast()`を呼び出すと、`Breakfast`関数は*1回*実行されます。

`range`キーワードを渡し、`call`で数値範囲（例えば`11,20`）を渡すと、Vimはその関数を1回だけ実行します。`range`キーワードを渡さずに数値範囲（例えば`11,20`）を`call`で渡すと、Vimは範囲に応じてその関数をN回実行します（この場合、N = 10）。

## 辞書

関数を辞書項目として追加するには、関数を定義する際に`dict`キーワードを追加します。

`breakfast`項目を返す関数`SecondBreakfast`があるとします：

```shell
function! SecondBreakfast() dict
  return self.breakfast
endfunction
```

この関数を`meals`辞書に追加しましょう：

```shell
let meals = {"breakfast": "pancakes", "second_breakfast": function("SecondBreakfast"), "lunch": "pasta"}

echo meals.second_breakfast()
" returns "pancakes"
```

`dict`キーワードを使用すると、キー変数`self`は関数が格納されている辞書（この場合は`meals`辞書）を指します。式`self.breakfast`は`meals.breakfast`と等しいです。

関数を辞書オブジェクトに追加する別の方法は、名前空間を使用することです。

```shell
function! meals.second_lunch()
  return self.lunch
endfunction

echo meals.second_lunch()
" returns "pasta"
```

名前空間を使用すると、`dict`キーワードを使用する必要はありません。

## Funcref

Funcrefは関数への参照です。これはVimscriptの基本データ型の1つで、Ch. 24で言及されています。

上記の`function("SecondBreakfast")`はfuncrefの例です。Vimには、関数名（文字列）を渡すとfuncrefを返す組み込み関数`function()`があります。

```shell
function! Breakfast(item)
  return "I am having " . a:item . " for breakfast"
endfunction

let Breakfastify = Breakfast
" returns error

let Breakfastify = function("Breakfast")

echo Breakfastify("oatmeal")
" returns "I am having oatmeal for breakfast"

echo Breakfastify("pancake")
" returns "I am having pancake for breakfast"
```

Vimでは、関数を変数に割り当てる場合、`let MyVar = MyFunc`のように直接割り当てることはできません。`let MyVar = function("MyFunc")`のように、`function()`関数を使用する必要があります。

funcrefはmapやfilterと一緒に使用できます。mapやfilterは、最初の引数としてインデックスを、2番目の引数として反復値を渡すことに注意してください。

```shell
function! Breakfast(index, item)
  return "I am having " . a:item . " for breakfast"
endfunction

let breakfast_items = ["pancakes", "hash browns", "waffles"]
let first_meals = map(breakfast_items, function("Breakfast"))

for meal in first_meals
  echo meal
endfor
```

## ラムダ

mapやfilterで関数を使用するより良い方法は、ラムダ式（時には無名関数として知られる）を使用することです。例えば：

```shell
let Plus = {x,y -> x + y}
echo Plus(1,2)
" returns 3

let Tasty = { -> 'tasty'}
echo Tasty()
" returns "tasty"
```

ラムダ式の内部から関数を呼び出すこともできます：

```shell
function! Lunch(item)
  return "I am having " . a:item . " for lunch"
endfunction

let lunch_items = ["sushi", "ramen", "sashimi"]

let day_meals = map(lunch_items, {index, item -> Lunch(item)})

for meal in day_meals
  echo meal
endfor
```

ラムダ内部から関数を呼び出したくない場合は、リファクタリングできます：

```shell
let day_meals = map(lunch_items, {index, item -> "I am having " . item . " for lunch"})
```

## メソッドチェーン

複数のVimscript関数やラムダ式を`->`で順次チェーンすることができます。`->`の後にはスペースなしでメソッド名を続ける必要があります。

```shell
Source->Method1()->Method2()->...->MethodN()
```

メソッドチェーンを使用して浮動小数点数を数値に変換する：

```shell
echo 3.14->float2nr()
" returns 3
```

より複雑な例を見てみましょう。リストの各アイテムの最初の文字を大文字にし、リストをソートし、リストを結合して文字列を形成する必要があるとします。

```shell
function! Capitalizer(word)
  return substitute(a:word, "\^\.", "\\u&", "g")
endfunction

function! CapitalizeList(word_list)
  return map(a:word_list, {index, word -> Capitalizer(word)})
endfunction

let dinner_items = ["bruschetta", "antipasto", "calzone"]

echo dinner_items->CapitalizeList()->sort()->join(", ")
" returns "Antipasto, Bruschetta, Calzone"
```

メソッドチェーンを使用すると、シーケンスがより簡単に読みやすく、理解しやすくなります。`dinner_items->CapitalizeList()->sort()->join(", ")`を一目見ただけで、何が起こっているのかがわかります。

## クロージャ

関数内で変数を定義すると、その変数はその関数の境界内に存在します。これをレキシカルスコープと呼びます。

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch()
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

`appetizer`は`Lunch`関数内で定義されており、`SecondLunch` funcrefを返します。`SecondLunch`は`appetizer`を使用していますが、Vimscriptではその変数にアクセスできません。`echo Lunch()()`を実行しようとすると、Vimは未定義の変数エラーをスローします。

この問題を解決するには、`closure`キーワードを使用します。リファクタリングしてみましょう：

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch() closure
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

これで`echo Lunch()()`を実行すると、Vimは"shrimp"を返します。

## 賢い方法でVimscript関数を学ぶ

この章では、Vim関数の構造について学びました。関数の動作を変更するために、`range`、`dict`、`closure`という異なる特別なキーワードを使用する方法を学びました。また、ラムダを使用し、複数の関数をチェーンする方法も学びました。関数は複雑な抽象を作成するための重要なツールです。

次に、学んだすべてをまとめて、自分自身のプラグインを作成しましょう。