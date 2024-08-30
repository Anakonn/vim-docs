---
description: このドキュメントでは、Vimscriptの基本要素とデータ型について学び、Exモードを使った実践的なコーディング方法を紹介します。
title: Ch25. Vimscript Basic Data Types
---

次の章では、Vimscript、Vimの組み込みプログラミング言語について学びます。

新しい言語を学ぶときに探すべき基本的な要素は3つあります：
- プリミティブ
- 組み合わせの手段
- 抽象化の手段

この章では、Vimのプリミティブデータ型について学びます。

## データ型

Vimには10種類の異なるデータ型があります：
- 数値
- 浮動小数点
- 文字列
- リスト
- 辞書
- 特殊
- Funcref
- ジョブ
- チャンネル
- バイナリ大きなオブジェクト（Blob）

ここでは最初の6つのデータ型を扱います。第27章ではFuncrefについて学びます。Vimのデータ型についての詳細は `:h variables` を確認してください。

## Exモードでの追従

Vimには技術的には組み込みのREPLはありませんが、Exモードというモードがあり、REPLのように使用できます。 `Q` または `gQ` でExモードに入ることができます。Exモードは拡張されたコマンドラインモードのようなもので（コマンドラインモードのコマンドをノンストップで入力するようなものです）、Exモードを終了するには `:visual` と入力します。

この章や次のVimscriptの章では、 `:echo` または `:echom` を使用してコードを実行できます。これはJSの `console.log` やPythonの `print` のようなものです。 `:echo` コマンドは与えられた式を評価して出力します。 `:echom` コマンドも同様ですが、結果をメッセージ履歴に保存します。

```viml
:echom "hello echo message"
```

メッセージ履歴は次のように表示できます：

```shell
:messages
```

メッセージ履歴をクリアするには、次のコマンドを実行します：

```shell
:messages clear
```

## 数値

Vimには4種類の異なる数値型があります：10進数、16進数、2進数、8進数。ちなみに、数値データ型と言うと、しばしば整数データ型を指します。このガイドでは、数値と整数という用語を同じ意味で使います。

### 10進数

10進数システムには慣れているはずです。Vimは正の数と負の数の10進数を受け入れます。1、-1、10など。Vimscriptプログラミングでは、ほとんどの場合10進数型を使用することになるでしょう。

### 16進数

16進数は `0x` または `0X` で始まります。記憶法：He**x**adecimal。

### 2進数

2進数は `0b` または `0B` で始まります。記憶法：**B**inary。

### 8進数

8進数は `0`、`0o`、および `0O` で始まります。記憶法：**O**ctal。

### 数値の印刷

16進数、2進数、または8進数の数値を `echo` すると、Vimは自動的にそれらを10進数に変換します。

```viml
:echo 42
" 42を返します

:echo 052
" 42を返します

:echo 0b101010
" 42を返します

:echo 0x2A
" 42を返します
```

### 真偽値

Vimでは、0の値は偽であり、すべての非0の値は真です。

次のコードは何も出力しません。

```viml
:if 0
:  echo "Nope"
:endif
```

しかし、次のコードは出力します：

```viml
:if 1
:  echo "Yes"
:endif
```

0以外の値はすべて真であり、負の数も含まれます。100は真です。-1も真です。

### 数値の算術

数値を使用して算術式を実行できます：

```viml
:echo 3 + 1
" 4を返します

: echo 5 - 3
" 2を返します

:echo 2 * 2
" 4を返します

:echo 4 / 2
" 2を返します
```

余りのある数値を割ると、Vimは余りを切り捨てます。

```viml
:echo 5 / 2
" 2.5ではなく2を返します
```

より正確な結果を得るには、浮動小数点数を使用する必要があります。

## 浮動小数点

浮動小数点は小数点以下の数字を持つ数値です。浮動小数点数を表す方法は2つあります：ドットポイント表記（31.4のように）と指数表記（3.14e01のように）。数値と同様に、正の符号と負の符号を使用できます：

```viml
:echo +123.4
" 123.4を返します

:echo -1.234e2
" -123.4を返します

:echo 0.25
" 0.25を返します

:echo 2.5e-1
" 0.25を返します
```

浮動小数点にはドットと小数点以下の数字を与える必要があります。 `25e-2`（ドットなし）や `1234.`（ドットはあるが小数点以下の数字なし）は無効な浮動小数点数です。

### 浮動小数点の算術

数値と浮動小数点の間で算術式を行うと、Vimは結果を浮動小数点に強制変換します。

```viml
:echo 5 / 2.0
" 2.5を返します
```

浮動小数点と浮動小数点の算術は別の浮動小数点を返します。

```shell
:echo 1.0 + 1.0
" 2.0を返します
```

## 文字列

文字列はダブルクォート（`""`）またはシングルクォート（`''`）で囲まれた文字です。"Hello"、"123"、および '123.4' は文字列の例です。

### 文字列の連結

Vimで文字列を連結するには、 `.` 演算子を使用します。

```viml
:echo "Hello" . " world"
" "Hello world"を返します
```

### 文字列の算術

数値と文字列で算術演算子（`+ - * /`）を実行すると、Vimは文字列を数値に変換します。

```viml
:echo "12 donuts" + 3
" 15を返します
```

Vimが "12 donuts" を見ると、文字列から12を抽出し、数値12に変換します。次に加算を行い、15を返します。この文字列から数値への変換が機能するためには、数値の文字が文字列の*最初の文字*である必要があります。

次のコードは機能しません。なぜなら、12が文字列の最初の文字ではないからです：

```viml
:echo "donuts 12" + 3
" 3を返します
```

次のコードも機能しません。なぜなら、空白が文字列の最初の文字だからです：

```viml
:echo " 12 donuts" + 3
" 3を返します
```

この変換は、2つの文字列でも機能します：

```shell
:echo "12 donuts" + "6 pastries"
" 18を返します
```

この変換は、 `+` だけでなく、任意の算術演算子でも機能します：

```viml
:echo "12 donuts" * "5 boxes"
" 60を返します

:echo "12 donuts" - 5
" 7を返します

:echo "12 donuts" / "3 people"
" 4を返します
```

文字列から数値への変換を強制する便利なトリックは、単に0を加えるか1で掛けることです：

```viml
:echo "12" + 0
" 12を返します

:echo "12" * 1
" 12を返します
```

文字列内の浮動小数点に対して算術を行うと、Vimはそれを浮動小数点ではなく整数として扱います：

```shell
:echo "12.0 donuts" + 12
" 24を返します、24.0ではなく
```

### 数値と文字列の連結

数値を文字列に変換するには、ドット演算子（`.`）を使用します：

```viml
:echo 12 . "donuts"
" "12donuts"を返します
```

この変換は数値データ型にのみ機能し、浮動小数点には機能しません。次のコードは機能しません：

```shell
:echo 12.0 . "donuts"
" "12.0donuts"を返さず、エラーを発生させます
```

### 文字列の条件

0は偽であり、すべての非0の数値は真であることを思い出してください。これは文字列を条件として使用する場合にも当てはまります。

次のif文では、Vimは "12donuts" を12に変換し、これは真です：

```viml
:if "12donuts"
:  echo "Yum"
:endif
" "Yum"を返します
```

一方、次のコードは偽です：

```viml
:if "donuts12"
:  echo "Nope"
:endif
" 何も返しません
```

Vimは "donuts12" を0に変換します。最初の文字が数字ではないためです。

### ダブルクォートとシングルクォート

ダブルクォートはシングルクォートとは異なる動作をします。シングルクォートは文字をそのまま表示し、ダブルクォートは特殊文字を受け入れます。

特殊文字とは何でしょうか？改行とダブルクォートの表示を確認してください：

```viml
:echo "hello\nworld"
" 返します
" hello
" world

:echo "hello \"world\""
" "hello "world""を返します
```

シングルクォートと比較してください：

```shell
:echo 'hello\nworld'
" 'hello\nworld'を返します

:echo 'hello \"world\"'
" 'hello \"world\"'を返します
```

特殊文字は、エスケープされたときに異なる動作をする特殊な文字列文字です。 `\n` は改行のように動作します。 `\"` はリテラルの `"` のように動作します。他の特殊文字のリストについては、 `:h expr-quote` を確認してください。

### 文字列の手続き

いくつかの組み込みの文字列手続きを見てみましょう。

文字列の長さは `strlen()` で取得できます。

```shell
:echo strlen("choco")
" 5を返します
```

文字列を数値に変換するには `str2nr()` を使用します：

```shell
:echo str2nr("12donuts")
" 12を返します

:echo str2nr("donuts12")
" 0を返します
```

先ほどの文字列から数値への変換と同様に、数値が最初の文字でない場合、Vimはそれを捕まえません。

良いニュースは、Vimには文字列を浮動小数点に変換するメソッド `str2float()` があることです：

```shell
:echo str2float("12.5donuts")
" 12.5を返します
```

文字列内のパターンを `substitute()` メソッドで置き換えることができます：

```shell
:echo substitute("sweet", "e", "o", "g")
" "swoot"を返します
```

最後のパラメータ "g" はグローバルフラグです。これを使用すると、Vimはすべての一致する出現を置き換えます。これがない場合、Vimは最初の一致のみを置き換えます。

```shell
:echo substitute("sweet", "e", "o", "")
" "swoet"を返します
```

置換コマンドは `getline()` と組み合わせることができます。関数 `getline()` は指定された行番号のテキストを取得します。例えば、行5に "chocolate donut" というテキストがあるとします。次の手続きを使用できます：

```shell
:echo substitute(getline(5), "chocolate", "glazed", "g")
" glazed donutを返します
```

他にも多くの文字列手続きがあります。 `:h string-functions` を確認してください。

## リスト

Vimscriptのリストは、JavaScriptの配列やPythonのリストのようなものです。アイテムの*順序付けられた*シーケンスです。異なるデータ型のコンテンツを混ぜ合わせることができます：

```shell
[1,2,3]
['a', 'b', 'c']
[1,'a', 3.14]
[1,2,[3,4]]
```

### サブリスト

Vimのリストはゼロインデックスです。特定のアイテムにアクセスするには、 `[n]` を使用します。ここで、nはインデックスです。

```shell
:echo ["a", "sweet", "dessert"][0]
" "a"を返します

:echo ["a", "sweet", "dessert"][2]
" "dessert"を返します
```

最大インデックス番号を超えると、Vimはインデックスが範囲外であるというエラーをスローします：

```shell
:echo ["a", "sweet", "dessert"][999]
" エラーを返します
```

ゼロ未満に行くと、Vimは最後の要素からインデックスを開始します。最小インデックス番号を超えると、エラーが発生します：

```shell
:echo ["a", "sweet", "dessert"][-1]
" "dessert"を返します

:echo ["a", "sweet", "dessert"][-3]
" "a"を返します

:echo ["a", "sweet", "dessert"][-999]
" エラーを返します
```

リストから複数の要素を「スライス」するには、 `[n:m]` を使用します。ここで、 `n` は開始インデックス、 `m` は終了インデックスです。

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:4]
" ["plain", "strawberry", "lemon"]を返します
```

`m` を渡さない場合（ `[n:]` ）、Vimはn番目の要素から残りの要素を返します。 `n` を渡さない場合（ `[:m]` ）、Vimは最初の要素からm番目の要素までを返します。

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:]
" ['plain', 'strawberry', 'lemon', 'sugar', 'cream']を返します

:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][:4]
" ['chocolate', 'glazed', 'plain', 'strawberry', 'lemon']を返します
```

配列をスライスする際に、最大アイテムを超えるインデックスを渡すことができます。

```viml
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:999]
" ['plain', 'strawberry', 'lemon', 'sugar', 'cream']を返します
```
### 文字列のスライス

リストのように文字列をスライスしてターゲットにできます：

```viml
:echo "choco"[0]
" returns "c"

:echo "choco"[1:3]
" returns "hoc"

:echo "choco"[:3]
" returns choc

:echo "choco"[1:]
" returns hoco
```

### リストの算術

`+`を使ってリストを連結したり変更したりできます：

```viml
:let sweetList = ["chocolate", "strawberry"]
:let sweetList += ["sugar"]
:echo sweetList
" returns ["chocolate", "strawberry", "sugar"]
```

### リスト関数

Vimの組み込みリスト関数を探ってみましょう。

リストの長さを取得するには、`len()`を使用します：

```shell
:echo len(["chocolate", "strawberry"])
" returns 2
```

リストに要素を先頭に追加するには、`insert()`を使用できます：

```shell
:let sweetList = ["chocolate", "strawberry"]
:call insert(sweetList, "glazed")

:echo sweetList
" returns ["glazed", "chocolate", "strawberry"]
```

`insert()`に先頭に追加したい要素のインデックスを渡すこともできます。2番目の要素の前にアイテムを追加したい場合（インデックス1）：

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call insert(sweeterList, "cream", 1)

:echo sweeterList
" returns ['glazed', 'cream', 'chocolate', 'strawberry']
```

リストアイテムを削除するには、`remove()`を使用します。リストと削除したい要素のインデックスを受け取ります。

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call remove(sweeterList, 1)

:echo sweeterList
" returns ['glazed', 'strawberry']
```

`map()`と`filter()`をリストに使用できます。"choco"というフレーズを含む要素をフィルタリングするには：

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call filter(sweeterList, 'v:val !~ "choco"')
:echo sweeterList
" returns ["glazed", "strawberry"]

:let sweetestList = ["chocolate", "glazed", "sugar"]
:call map(sweetestList, 'v:val . " donut"')
:echo sweetestList
" returns ['chocolate donut', 'glazed donut', 'sugar donut']
```

`v:val`変数はVimの特別な変数です。`map()`や`filter()`を使用してリストや辞書を反復処理する際に利用できます。各反復アイテムを表します。

詳細については、`:h list-functions`を確認してください。

### リストのアンパック

リストをアンパックして変数にリストアイテムを割り当てることができます：

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let [flavor1, flavor2, flavor3] = favoriteFlavor

:echo flavor1
" returns "chocolate"

:echo flavor2
" returns "glazed"
```

残りのリストアイテムを割り当てるには、`;`の後に変数名を使用できます：

```shell
:let favoriteFruits = ["apple", "banana", "lemon", "blueberry", "raspberry"]
:let [fruit1, fruit2; restFruits] = favoriteFruits

:echo fruit1
" returns "apple"

:echo restFruits
" returns ['lemon', 'blueberry', 'raspberry']
```

### リストの変更

リストアイテムを直接変更できます：

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[0] = "sugar"
:echo favoriteFlavor
" returns ['sugar', 'glazed', 'plain']
```

複数のリストアイテムを直接変更できます：

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[2:] = ["strawberry", "chocolate"]
:echo favoriteFlavor
" returns ['chocolate', 'glazed', 'strawberry', 'chocolate']
```

## 辞書

Vimscriptの辞書は、連想配列であり、順序のないリストです。空でない辞書は、少なくとも1つのキー-バリューペアで構成されています。

```shell
{"breakfast": "waffles", "lunch": "pancakes"}
{"meal": ["breakfast", "second breakfast", "third breakfast"]}
{"dinner": 1, "dessert": 2}
```

Vimの辞書データオブジェクトは、キーに文字列を使用します。数字を使用しようとすると、Vimはそれを文字列に変換します。

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}

:echo breakfastNo
" returns {'1': '7am', '2': '9am', '11ses': '11am'}
```

各キーの周りに引用符を置くのが面倒な場合は、`#{}`表記を使用できます：

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo mealPlans
" returns {'lunch': 'pancakes', 'breakfast': 'waffles', 'dinner': 'donuts'}
```

`#{}`構文を使用する唯一の要件は、各キーが次のいずれかである必要があります：

- ASCII文字。
- 数字。
- アンダースコア（`_`）。
- ハイフン（`-`）。

リストと同様に、任意のデータ型を値として使用できます。

```shell
:let mealPlan = {"breakfast": ["pancake", "waffle", "hash brown"], "lunch": WhatsForLunch(), "dinner": {"appetizer": "gruel", "entree": "more gruel"}}
```

### 辞書へのアクセス

辞書から値にアクセスするには、キーを角括弧（`['key']`）またはドット表記（`.key`）で呼び出します。

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches", "dinner": "more gruel"}

:let breakfast = meal['breakfast']
:let lunch = meal.lunch

:echo breakfast
" returns "gruel omelettes"

:echo lunch
" returns "gruel sandwiches"
```

### 辞書の変更

辞書の内容を変更したり追加したりできます：

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches"}

:let meal.breakfast = "breakfast tacos"
:let meal["lunch"] = "tacos al pastor"
:let meal["dinner"] = "quesadillas"

:echo meal
" returns {'lunch': 'tacos al pastor', 'breakfast': 'breakfast tacos', 'dinner': 'quesadillas'}
```

### 辞書関数

辞書を扱うためのVimの組み込み関数をいくつか探ってみましょう。

辞書の長さを確認するには、`len()`を使用します。

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo len(mealPlans)
" returns 3
```

辞書が特定のキーを含んでいるかどうかを確認するには、`has_key()`を使用します。

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo has_key(mealPlans, "breakfast")
" returns 1

:echo has_key(mealPlans, "dessert")
" returns 0
```

辞書にアイテムがあるかどうかを確認するには、`empty()`を使用します。`empty()`プロシージャは、リスト、辞書、文字列、数値、浮動小数点数など、すべてのデータ型で機能します。

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:let noMealPlan = {}

:echo empty(noMealPlan)
" returns 1

:echo empty(mealPlans)
" returns 0
```

辞書からエントリを削除するには、`remove()`を使用します。

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo "removing breakfast: " . remove(mealPlans, "breakfast")
" returns "removing breakfast: 'waffles'""

:echo mealPlans
" returns {'lunch': 'pancakes', 'dinner': 'donuts'}
```

辞書をリストのリストに変換するには、`items()`を使用します：

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo items(mealPlans)
" returns [['lunch', 'pancakes'], ['breakfast', 'waffles'], ['dinner', 'donuts']]
```

`filter()`と`map()`も使用できます。

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}
:call filter(breakfastNo, 'v:key > 1')

:echo breakfastNo
" returns {'2': '9am', '11ses': '11am'}
```

辞書はキー-バリューペアを含むため、Vimは`v:key`特別変数を提供します。これは`v:val`と似たように機能します。辞書を反復処理する際、`v:key`は現在反復中のキーの値を保持します。

`mealPlans`辞書がある場合、`v:key`を使用してマッピングできます。

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:key . " and milk"')

:echo mealPlans
" returns {'lunch': 'lunch and milk', 'breakfast': 'breakfast and milk', 'dinner': 'dinner and milk'}
```

同様に、`v:val`を使用してマッピングできます：

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:val . " and milk"')

:echo mealPlans
" returns {'lunch': 'pancakes and milk', 'breakfast': 'waffles and milk', 'dinner': 'donuts and milk'}
```

より多くの辞書関数については、`:h dict-functions`を確認してください。

## 特殊プリミティブ

Vimには特殊なプリミティブがあります：

- `v:false`
- `v:true`
- `v:none`
- `v:null`

ちなみに、`v:`はVimの組み込み変数です。これらについては後の章で詳しく説明します。

私の経験では、これらの特殊プリミティブを頻繁に使用することはありません。真偽値が必要な場合は、単に0（偽）と非0（真）を使用できます。空の文字列が必要な場合は、`""`を使用してください。しかし、知っておくのは良いことなので、簡単に説明します。

### 真

これは`true`に相当します。非0の値を持つ数値に相当します。`json_encode()`でjsonをデコードする際には、「true」と解釈されます。

```shell
:echo json_encode({"test": v:true})
" returns {"test": true}
```

### 偽

これは`false`に相当します。0の値を持つ数値に相当します。`json_encode()`でjsonをデコードする際には、「false」と解釈されます。

```shell
:echo json_encode({"test": v:false})
" returns {"test": false}
```

### None

これは空の文字列に相当します。`json_encode()`でjsonをデコードする際には、空のアイテム（`null`）として解釈されます。

```shell
:echo json_encode({"test": v:none})
" returns {"test": null}
```

### Null

`v:none`に似ています。

```shell
:echo json_encode({"test": v:null})
" returns {"test": null}
```

## スマートにデータ型を学ぶ

この章では、Vimscriptの基本データ型：数値、浮動小数点数、文字列、リスト、辞書、特殊について学びました。これらを学ぶことは、Vimscriptプログラミングを始める第一歩です。

次の章では、等式、条件文、ループのような式を書くためにそれらを組み合わせる方法を学びます。