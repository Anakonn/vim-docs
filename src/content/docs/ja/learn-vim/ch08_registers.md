---
description: Vimのレジスタについて学び、効率的に使用する方法を解説します。10種類のレジスタを活用し、タイピングの手間を省きましょう。
title: Ch08. Registers
---

Vimのレジスタを学ぶことは、初めて代数を学ぶようなものです。必要になるまで、それが必要だとは思わなかったでしょう。

テキストをヤンクしたり削除したりしてから、`p`や`P`で貼り付けたときに、Vimのレジスタを使用したことがあるでしょう。しかし、Vimには10種類の異なるレジスタがあることを知っていましたか？正しく使用すれば、Vimのレジスタは繰り返しのタイピングからあなたを救ってくれます。

この章では、すべてのVimレジスタの種類と、それらを効率的に使用する方法について説明します。

## 10種類のレジスタ

以下が10種類のVimレジスタです：

1. 無名レジスタ (`""`)。
2. 番号付きレジスタ (`"0-9`)。
3. 小さな削除レジスタ (`"-`)。
4. 名前付きレジスタ (`"a-z`)。
5. 読み取り専用レジスタ (`":`, `".`, および `"%`)。
6. 代替ファイルレジスタ (`"#`)。
7. 式レジスタ (`"=`)。
8. 選択レジスタ (`"*` および `"+`)。
9. ブラックホールレジスタ (`"_`)。
10. 最後の検索パターンレジスタ (`"/`)。

## レジスタオペレーター

レジスタを使用するには、まずオペレーターでそれらを保存する必要があります。以下は、値をレジスタに保存するオペレーターのいくつかです：

```shell
y    ヤンク（コピー）
c    テキストを削除して挿入モードを開始
d    テキストを削除
```

他にもオペレーター（`s`や`x`など）がありますが、上記が便利なものです。一般的なルールとして、オペレーターがテキストを削除できる場合、それはおそらくテキストをレジスタに保存します。

レジスタからテキストを貼り付けるには、次のようにします：

```shell
p    カーソルの後にテキストを貼り付け
P    カーソルの前にテキストを貼り付け
```

`p`と`P`の両方は、カウントとレジスタシンボルを引数として受け取ります。たとえば、10回貼り付けるには、`10p`を実行します。レジスタaからテキストを貼り付けるには、`"ap`を実行します。レジスタaからテキストを10回貼り付けるには、`10"ap`を実行します。ちなみに、`p`は実際には「put」を意味し、「paste」ではありませんが、貼り付けという言葉の方が一般的だと思います。

特定のレジスタからコンテンツを取得するための一般的な構文は`"a`で、ここで`a`はレジスタシンボルです。

## 挿入モードからのレジスタ呼び出し

この章で学んだすべては、挿入モードでも実行できます。レジスタaからテキストを取得するには、通常は`"ap`を実行します。しかし、挿入モードにいる場合は、`Ctrl-R a`を実行します。挿入モードからレジスタを呼び出すための構文は：

```shell
Ctrl-R a
```

ここで`a`はレジスタシンボルです。レジスタを保存して取得する方法がわかったので、さっそく始めましょう！

## 無名レジスタ

無名レジスタからテキストを取得するには、`""p`を実行します。これは、最後にヤンクした、変更した、または削除したテキストを保存します。別のヤンク、変更、または削除を行うと、Vimは自動的に古いテキストを置き換えます。無名レジスタは、コンピュータの標準的なコピー/ペースト操作のようなものです。

デフォルトでは、`p`（または`P`）は無名レジスタに接続されています（これからは無名レジスタを`p`と呼ぶことにします）。

## 番号付きレジスタ

番号付きレジスタは、自動的に昇順に埋められます。番号付きレジスタには、ヤンクされたレジスタ（`0`）と番号付きレジスタ（`1-9`）の2種類があります。まずはヤンクされたレジスタについて説明します。

### ヤンクされたレジスタ

行全体をヤンクすると（`yy`）、Vimは実際にそのテキストを2つのレジスタに保存します：

1. 無名レジスタ (`p`)。
2. ヤンクされたレジスタ (`"0p`)。

異なるテキストをヤンクすると、Vimはヤンクされたレジスタと無名レジスタの両方を更新します。他の操作（削除など）はレジスタ0には保存されません。これはあなたの利点として利用でき、別のヤンクを行わない限り、ヤンクされたテキストは常にそこに存在します。変更や削除を何回行っても変わりません。

たとえば、次のようにします：
1. 行をヤンクする（`yy`）
2. 行を削除する（`dd`）
3. 別の行を削除する（`dd`）

ヤンクされたレジスタには、ステップ1のテキストが含まれます。

もしあなたが：
1. 行をヤンクする（`yy`）
2. 行を削除する（`dd`）
3. 別の行をヤンクする（`yy`）

ヤンクされたレジスタには、ステップ3のテキストが含まれます。

最後のヒントとして、挿入モードにいるときに、`Ctrl-R 0`を使用して、ヤンクしたばかりのテキストをすばやく貼り付けることができます。

### ゼロ以外の番号付きレジスタ

少なくとも1行の長さのテキストを変更または削除すると、そのテキストは最近の順に番号付きレジスタ1-9に保存されます。

たとえば、次の行があるとします：

```shell
line three
line two
line one
```

カーソルが「line three」にある状態で、`dd`で1行ずつ削除します。すべての行が削除されると、レジスタ1には「line one」（最も最近のもの）、レジスタ2には「line two」（2番目に最近のもの）、レジスタ3には「line three」（最も古いもの）が含まれるはずです。レジスタ1からコンテンツを取得するには、`"1p`を実行します。

ちなみに、これらの番号付きレジスタは、ドットコマンドを使用すると自動的にインクリメントされます。もしあなたの番号付きレジスタ1（`"1`）が「line one」を含み、レジスタ2（`"2`）が「line two」、レジスタ3（`"3`）が「line three」を含んでいる場合、次のトリックを使って順番に貼り付けることができます：
- `"1P`を実行して、番号付きレジスタ1の内容を貼り付けます（`"1`）。
- `.`を実行して、番号付きレジスタ2の内容を貼り付けます（`"2`）。
- `.`を実行して、番号付きレジスタ3の内容を貼り付けます（`"3`）。

このトリックは、任意の番号付きレジスタで機能します。もし`"5P`から始めた場合、`.`は`"6P`を実行し、再度`.`は`"7P`を実行します。

単語の削除（`dw`）や単語の変更（`cw`）のような小さな削除は、番号付きレジスタには保存されません。これらは小さな削除レジスタ（`"-`）に保存されます。次にそれについて説明します。

## 小さな削除レジスタ

1行未満の変更や削除は、番号付きレジスタ0-9には保存されず、小さな削除レジスタ（`"-`）に保存されます。

たとえば：
1. 単語を削除する（`diw`）
2. 行を削除する（`dd`）
3. 行を削除する（`dd`）

`"-p`は、ステップ1で削除した単語を返します。

別の例：
1. 単語を削除する（`diw`）
2. 行を削除する（`dd`）
3. 単語を削除する（`diw`）

`"-p`は、ステップ3で削除した単語を返します。`"1p`は、ステップ2で削除した行を返します。残念ながら、ステップ1で削除した単語を取得する方法はありません。なぜなら、小さな削除レジスタは1つのアイテムしか保存しないからです。しかし、ステップ1のテキストを保持したい場合は、名前付きレジスタを使用することができます。

## 名前付きレジスタ

名前付きレジスタは、Vimの最も多用途なレジスタです。ヤンクされた、変更された、削除されたテキストをレジスタa-zに保存できます。これまで見てきた3種類のレジスタとは異なり、名前付きレジスタを使用するようにVimに明示的に指示する必要があり、完全な制御が可能です。

単語をレジスタaにヤンクするには、`"ayiw`を実行します。
- `"a`は、次のアクション（削除/変更/ヤンク）がレジスタaに保存されることをVimに伝えます。
- `yiw`は単語をヤンクします。

レジスタaからテキストを取得するには、`"ap`を実行します。名前付きレジスタを使用して、26の異なるテキストを保存するために、すべての26のアルファベット文字を使用できます。

時には、既存の名前付きレジスタに追加したい場合があります。この場合、最初からやり直すのではなく、テキストを追加できます。そのためには、そのレジスタの大文字バージョンを使用します。たとえば、すでに「Hello 」という単語がレジスタaに保存されているとします。「world」をレジスタaに追加したい場合は、テキスト「world」を見つけて、Aレジスタ（`"Ayiw`）を使用してヤンクします。

## 読み取り専用レジスタ

Vimには3つの読み取り専用レジスタがあります：`.`、`:`、および`%`。これらは非常に簡単に使用できます：

```shell
.    最後に挿入したテキストを保存
:    最後に実行したコマンドラインを保存
%    現在のファイルの名前を保存
```

最後に書いたテキストが「Hello Vim」であれば、`".p`を実行すると「Hello Vim」と表示されます。現在のファイルの名前を取得するには、`"%p`を実行します。`：s/foo/bar/g`コマンドを実行した場合、`":p`を実行すると、リテラルテキスト「s/foo/bar/g」が表示されます。

## 代替ファイルレジスタ

Vimでは、`#`は通常代替ファイルを表します。代替ファイルとは、最後に開いたファイルのことです。代替ファイルの名前を挿入するには、`"#p`を使用できます。

## 式レジスタ

Vimには式を評価するための式レジスタ（`"=`）があります。

数学的な式`1 + 1`を評価するには、次のように実行します：

```shell
"=1+1<Enter>p
```

ここで、あなたはVimに式レジスタを使用していることを伝えています（`"=`）。あなたの式は（`1 + 1`）です。結果を得るためには`p`を入力する必要があります。前述のように、挿入モードからもレジスタにアクセスできます。挿入モードから数学的な式を評価するには、次のようにします：

```shell
Ctrl-R =1+1
```

また、`@`を付けて任意のレジスタから値を取得することもできます。レジスタaからテキストを取得したい場合：

```shell
"=@a
```

その後、`<Enter>`を押し、次に`p`を押します。同様に、挿入モードでレジスタaから値を取得するには：

```shell
Ctrl-r =@a
```

式はVimの広範なトピックなので、ここでは基本的な部分だけをカバーします。後のVimscriptの章で、式について詳しく説明します。

## 選択レジスタ

外部プログラムからテキストをコピーしてVimにローカルに貼り付けたり、その逆をしたりできるといいと思ったことはありませんか？Vimの選択レジスタを使えば、それができます。Vimには2つの選択レジスタがあります：`quotestar`（`"*`）と`quoteplus`（`"+`）。これらを使用して、外部プログラムからコピーしたテキストにアクセスできます。

外部プログラム（Chromeブラウザなど）でテキストのブロックを`Ctrl-C`（またはOSに応じて`Cmd-C`）でコピーすると、通常はVimで`p`を使ってそのテキストを貼り付けることはできません。しかし、Vimの`"+`と`"*`はクリップボードに接続されているため、実際に`"+p`や`"*p`でテキストを貼り付けることができます。逆に、Vimから単語を`"+yiw`や`"*yiw`でヤンクすると、そのテキストを外部プログラムで`Ctrl-V`（または`Cmd-V`）で貼り付けることができます。これは、Vimプログラムが`+clipboard`オプションを持っている場合にのみ機能します（確認するには、`:version`を実行します）。

`"*`と`"+`が同じことをするなら、なぜVimには2つの異なるレジスタがあるのか疑問に思うかもしれません。一部のマシンはX11ウィンドウシステムを使用しています。このシステムには、プライマリ、セカンダリ、クリップボードの3種類の選択があります。あなたのマシンがX11を使用している場合、VimはX11の*プライマリ*選択を`quotestar`（`"*`）レジスタで、X11の*クリップボード*選択を`quoteplus`（`"+`）レジスタで使用します。これは、Vimビルドに`+xterm_clipboard`オプションがある場合にのみ適用されます。もしあなたのVimに`xterm_clipboard`がない場合、それは大したことではありません。単に`quotestar`と`quoteplus`が互換性があるということです（私のもそうではありません）。

`=*p`や`=+p`（または`"*p`や`"+p`）を実行するのは面倒だと思います。外部プログラムからコピーしたテキストを`p`だけで貼り付けるようにVimを設定するには、vimrcに次のように追加できます：

```shell
set clipboard=unnamed
```

これで、外部プログラムからテキストをコピーすると、無名レジスタ`p`で貼り付けることができます。また、Vimからテキストをコピーして外部プログラムに貼り付けることもできます。もし`+xterm_clipboard`が有効であれば、`unnamed`と`unnamedplus`の両方のクリップボードオプションを使用することをお勧めします。

## ブラックホールレジスタ

テキストを削除または変更するたびに、そのテキストはVimレジスタに自動的に保存されます。何もレジスタに保存したくない場合もあります。どうすればそれができますか？

ブラックホールレジスタ（`"_`）を使用できます。行を削除してVimが削除した行をレジスタに保存しないようにするには、`"_dd`を使用します。

ブラックホールレジスタは、レジスタの`/dev/null`のようなものです。

## 最後の検索パターンレジスタ

最後の検索
## レジスタのクリア

技術的には、同じレジスタ名の下に保存する次のテキストが上書きされるため、レジスタをクリアする必要はありません。しかし、空のマクロを記録することで、任意の名前付きレジスタをすぐにクリアできます。例えば、`qaq`を実行すると、Vimはレジスタaに空のマクロを記録します。

別の方法は、コマンド`:call setreg('a', 'hello register a')`を実行することです。ここで、aはレジスタaで、「hello register a」は保存したいテキストです。

レジスタをクリアするもう一つの方法は、式`:let @a = ''`を使って「aレジスタの内容を空の文字列に設定する」ことです。

## レジスタの内容を挿入する

`:put`コマンドを使用して、任意のレジスタの内容を貼り付けることができます。例えば、`:put a`を実行すると、Vimはレジスタaの内容を現在の行の下に印刷します。これは`"ap`と非常に似ていますが、通常モードのコマンド`p`はカーソルの後にレジスタの内容を印刷し、コマンド`:put`は改行でレジスタの内容を印刷します。

`:put`はコマンドラインコマンドであるため、アドレスを渡すことができます。`:10put a`は、レジスタaからテキストを10行目の下に貼り付けます。

`:put`をブラックホールレジスタ(`"_`)で使用するクールなトリックがあります。ブラックホールレジスタはテキストを保存しないため、`:put _`は空の行を挿入します。これをグローバルコマンドと組み合わせて、複数の空行を挿入できます。例えば、「end」というテキストを含むすべての行の下に空行を挿入するには、`:g/end/put _`を実行します。グローバルコマンドについては後で学びます。

## スマートにレジスタを学ぶ

あなたは最後までたどり着きました。おめでとうございます！情報の多さに圧倒されているなら、あなたは一人ではありません。私が最初にVimのレジスタについて学び始めたとき、一度に受け取るには情報が多すぎました。

すべてのレジスタをすぐに暗記する必要はないと思います。生産的になるためには、最初にこれらの3つのレジスタだけを使用することから始めることができます：
1. 無名レジスタ（`""`）。
2. 名前付きレジスタ（`"a-z`）。
3. 番号付きレジスタ（`"0-9`）。

無名レジスタはデフォルトで`p`と`P`に設定されているため、学ぶ必要があるのは2つのレジスタ、すなわち名前付きレジスタと番号付きレジスタだけです。必要に応じて徐々に他のレジスタを学んでいきましょう。焦らずに。

平均的な人間の短期記憶容量は限られており、一度に約5〜7項目です。だから、私の日常的な編集では、約5〜7の名前付きレジスタしか使用しません。26個すべてを頭に入れておくことはできません。通常、レジスタaから始めて、b、アルファベット順に進みます。試してみて、自分に最適な技術を見つけてください。

Vimのレジスタは強力です。戦略的に使用すれば、無限に繰り返すテキストの入力からあなたを救うことができます。次に、マクロについて学びましょう。