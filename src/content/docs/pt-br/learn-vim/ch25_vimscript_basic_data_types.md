---
description: Neste capítulo, você aprenderá sobre os tipos de dados primitivos do
  Vimscript, a linguagem de programação integrada do Vim.
title: Ch25. Vimscript Basic Data Types
---

Nos próximos capítulos, você aprenderá sobre Vimscript, a linguagem de programação integrada do Vim.

Ao aprender uma nova linguagem, há três elementos básicos a serem observados:
- Primitivas
- Meios de Combinação
- Meios de Abstração

Neste capítulo, você aprenderá os tipos de dados primitivos do Vim.

## Tipos de Dados

O Vim possui 10 tipos de dados diferentes:
- Número
- Float
- String
- Lista
- Dicionário
- Especial
- Funcref
- Job
- Canal
- Blob

Eu abordarei os primeiros seis tipos de dados aqui. No Cap. 27, você aprenderá sobre Funcref. Para mais informações sobre os tipos de dados do Vim, consulte `:h variables`.

## Acompanhando Com o Modo Ex

O Vim tecnicamente não possui um REPL integrado, mas tem um modo, o modo Ex, que pode ser usado como um. Você pode acessar o modo Ex com `Q` ou `gQ`. O modo Ex é como um modo de linha de comando estendido (é como digitar comandos do modo de linha de comando sem parar). Para sair do modo Ex, digite `:visual`.

Você pode usar `:echo` ou `:echom` neste capítulo e nos capítulos subsequentes de Vimscript para codificar junto. Eles são como `console.log` em JS ou `print` em Python. O comando `:echo` imprime a expressão avaliada que você fornecer. O comando `:echom` faz o mesmo, mas, além disso, armazena o resultado no histórico de mensagens.

```viml
:echom "mensagem de eco hello"
```

Você pode visualizar o histórico de mensagens com:

```shell
:messages
```

Para limpar seu histórico de mensagens, execute:

```shell
:messages clear
```

## Número

O Vim possui 4 tipos diferentes de números: decimal, hexadecimal, binário e octal. A propósito, quando digo tipo de dado número, muitas vezes isso significa um tipo de dado inteiro. Neste guia, usarei os termos número e inteiro de forma intercambiável.

### Decimal

Você deve estar familiarizado com o sistema decimal. O Vim aceita decimais positivos e negativos. 1, -1, 10, etc. Na programação Vimscript, você provavelmente usará o tipo decimal na maior parte do tempo.

### Hexadecimal

Hexadecimais começam com `0x` ou `0X`. Mnemônico: He**x**adecimal.

### Binário

Binários começam com `0b` ou `0B`. Mnemônico: **B**inário.

### Octal

Octais começam com `0`, `0o` e `0O`. Mnemônico: **O**ctal.

### Imprimindo Números

Se você `echo` um número hexadecimal, binário ou octal, o Vim os converte automaticamente para decimais.

```viml
:echo 42
" retorna 42

:echo 052
" retorna 42

:echo 0b101010
" retorna 42

:echo 0x2A
" retorna 42
```

### Verdadeiro e Falso

No Vim, um valor 0 é falso e todos os valores não 0 são verdadeiros.

O seguinte não irá ecoar nada.

```viml
:if 0
:  echo "Não"
:endif
```

No entanto, isso irá:

```viml
:if 1
:  echo "Sim"
:endif
```

Qualquer valor diferente de 0 é verdadeiro, incluindo números negativos. 100 é verdadeiro. -1 é verdadeiro.

### Aritmética de Números

Números podem ser usados para executar expressões aritméticas:

```viml
:echo 3 + 1
" retorna 4

: echo 5 - 3
" retorna 2

:echo 2 * 2
" retorna 4

:echo 4 / 2
" retorna 2
```

Ao dividir um número com um resto, o Vim descarta o resto.

```viml
:echo 5 / 2
" retorna 2 em vez de 2.5
```

Para obter um resultado mais preciso, você precisa usar um número float.

## Float

Floats são números com decimais finais. Existem duas maneiras de representar números flutuantes: notação de ponto (como 31.4) e expoente (3.14e01). Semelhante aos números, você pode usar sinais positivos e negativos:

```viml
:echo +123.4
" retorna 123.4

:echo -1.234e2
" retorna -123.4

:echo 0.25
" retorna 0.25

:echo 2.5e-1
" retorna 0.25
```

Você precisa fornecer um ponto e dígitos finais para um float. `25e-2` (sem ponto) e `1234.` (tem um ponto, mas sem dígitos finais) são ambos números float inválidos.

### Aritmética Float

Ao fazer uma expressão aritmética entre um número e um float, o Vim converte o resultado para um float.

```viml
:echo 5 / 2.0
" retorna 2.5
```

Aritmética float e float lhe dá outro float.

```shell
:echo 1.0 + 1.0
" retorna 2.0
```

## String

Strings são caracteres cercados por aspas duplas (`""`) ou aspas simples (`''`). "Olá", "123" e '123.4' são exemplos de strings.

### Concatenação de Strings

Para concatenar uma string no Vim, use o operador `.`.

```viml
:echo "Olá" . " mundo"
" retorna "Olá mundo"
```

### Aritmética de Strings

Quando você executa operadores aritméticos (`+ - * /`) com um número e uma string, o Vim converte a string em um número.

```viml
:echo "12 donuts" + 3
" retorna 15
```

Quando o Vim vê "12 donuts", ele extrai o 12 da string e o converte no número 12. Em seguida, realiza a adição, retornando 15. Para que essa conversão de string para número funcione, o caractere numérico precisa ser o *primeiro caractere* na string.

O seguinte não funcionará porque 12 não é o primeiro caractere na string:

```viml
:echo "donuts 12" + 3
" retorna 3
```

Isso também não funcionará porque um espaço vazio é o primeiro caractere da string:

```viml
:echo " 12 donuts" + 3
" retorna 3
```

Essa conversão funciona até mesmo com duas strings:

```shell
:echo "12 donuts" + "6 pastries"
" retorna 18
```

Isso funciona com qualquer operador aritmético, não apenas `+`:

```viml
:echo "12 donuts" * "5 boxes"
" retorna 60

:echo "12 donuts" - 5
" retorna 7

:echo "12 donuts" / "3 people"
" retorna 4
```

Um truque interessante para forçar uma conversão de string para número é simplesmente adicionar 0 ou multiplicar por 1:

```viml
:echo "12" + 0
" retorna 12

:echo "12" * 1
" retorna 12
```

Quando a aritmética é feita contra um float em uma string, o Vim trata como um inteiro, não como um float:

```shell
:echo "12.0 donuts" + 12
" retorna 24, não 24.0
```

### Concatenação de Número e String

Você pode converter um número em uma string com um operador de ponto (`.`):

```viml
:echo 12 . "donuts"
" retorna "12donuts"
```

A conversão só funciona com o tipo de dado número, não float. Isso não funcionará:

```shell
:echo 12.0 . "donuts"
" não retorna "12.0donuts", mas gera um erro
```

### Condicionais de String

Lembre-se de que 0 é falso e todos os números não 0 são verdadeiros. Isso também é verdade ao usar strings como condicionais.

Na seguinte instrução if, o Vim converte "12donuts" em 12, que é verdadeiro:

```viml
:if "12donuts"
:  echo "Delicioso"
:endif
" retorna "Delicioso"
```

Por outro lado, isso é falso:

```viml
:if "donuts12"
:  echo "Não"
:endif
" não retorna nada
```

O Vim converte "donuts12" em 0, porque o primeiro caractere não é um número.

### Aspas Duplas vs Aspas Simples

Aspas duplas se comportam de maneira diferente das aspas simples. Aspas simples exibem caracteres literalmente, enquanto aspas duplas aceitam caracteres especiais.

Quais são os caracteres especiais? Confira a exibição de nova linha e aspas duplas:

```viml
:echo "hello\nworld"
" retorna
" hello
" world

:echo "hello \"world\""
" retorna "hello "world""
```

Compare isso com aspas simples:

```shell
:echo 'hello\nworld'
" retorna 'hello\nworld'

:echo 'hello \"world\"'
" retorna 'hello \"world\"'
```

Caracteres especiais são caracteres de string especiais que, quando escapados, se comportam de maneira diferente. `\n` age como uma nova linha. `\"` se comporta como um literal `"`. Para uma lista de outros caracteres especiais, consulte `:h expr-quote`.

### Procedimentos de String

Vamos olhar alguns procedimentos de string integrados.

Você pode obter o comprimento de uma string com `strlen()`.

```shell
:echo strlen("choco")
" retorna 5
```

Você pode converter uma string em um número com `str2nr()`:

```shell
:echo str2nr("12donuts")
" retorna 12

:echo str2nr("donuts12")
" retorna 0
```

Semelhante à conversão de string para número anterior, se o número não for o primeiro caractere, o Vim não o capturará.

A boa notícia é que o Vim tem um método que transforma uma string em um float, `str2float()`:

```shell
:echo str2float("12.5donuts")
" retorna 12.5
```

Você pode substituir um padrão em uma string com o método `substitute()`:

```shell
:echo substitute("doce", "e", "o", "g")
" retorna "dooc"
```

O último parâmetro, "g", é a flag global. Com ele, o Vim substituirá todas as ocorrências correspondentes. Sem ele, o Vim substituirá apenas a primeira correspondência.

```shell
:echo substitute("doce", "e", "o", "")
" retorna "doc"
```

O comando de substituição pode ser combinado com `getline()`. Lembre-se de que a função `getline()` obtém o texto na linha dada. Suponha que você tenha o texto "donut de chocolate" na linha 5. Você pode usar o procedimento:

```shell
:echo substitute(getline(5), "chocolate", "glazed", "g")
" retorna donut glazed
```

Existem muitos outros procedimentos de string. Consulte `:h string-functions`.

## Lista

Uma lista do Vimscript é como um Array em Javascript ou Lista em Python. É uma sequência *ordenada* de itens. Você pode misturar e combinar o conteúdo com diferentes tipos de dados:

```shell
[1,2,3]
['a', 'b', 'c']
[1,'a', 3.14]
[1,2,[3,4]]
```

### Sublists

A lista do Vim é indexada a partir de zero. Você pode acessar um item específico em uma lista com `[n]`, onde n é o índice.

```shell
:echo ["a", "doce", "sobremesa"][0]
" retorna "a"

:echo ["a", "doce", "sobremesa"][2]
" retorna "sobremesa"
```

Se você ultrapassar o número máximo do índice, o Vim lançará um erro dizendo que o índice está fora do intervalo:

```shell
:echo ["a", "doce", "sobremesa"][999]
" retorna um erro
```

Quando você vai abaixo de zero, o Vim começará o índice a partir do último elemento. Ultrapassar o número mínimo do índice também lançará um erro:

```shell
:echo ["a", "doce", "sobremesa"][-1]
" retorna "sobremesa"

:echo ["a", "doce", "sobremesa"][-3]
" retorna "a"

:echo ["a", "doce", "sobremesa"][-999]
" retorna um erro
```

Você pode "fatiar" vários elementos de uma lista com `[n:m]`, onde `n` é o índice inicial e `m` é o índice final.

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:4]
" retorna ["plain", "strawberry", "lemon"]
```

Se você não passar `m` (`[n:]`), o Vim retornará o restante dos elementos a partir do enésimo elemento. Se você não passar `n` (`[:m]`), o Vim retornará o primeiro elemento até o m-ésimo elemento.

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:]
" retorna ['plain', 'strawberry', 'lemon', 'sugar', 'cream']

:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][:4]
" retorna ['chocolate', 'glazed', 'plain', 'strawberry', 'lemon']
```

Você pode passar um índice que excede o número máximo de itens ao fatiar um array.

```viml
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:999]
" retorna ['plain', 'strawberry', 'lemon', 'sugar', 'cream']
```
### Fatiando String

Você pode fatiar e direcionar strings assim como listas:

```viml
:echo "choco"[0]
" retorna "c"

:echo "choco"[1:3]
" retorna "hoc"

:echo "choco"[:3]
" retorna choc

:echo "choco"[1:]
" retorna hoco
```

### Aritmética de Listas

Você pode usar `+` para concatenar e modificar uma lista:

```viml
:let sweetList = ["chocolate", "strawberry"]
:let sweetList += ["sugar"]
:echo sweetList
" retorna ["chocolate", "strawberry", "sugar"]
```

### Funções de Lista

Vamos explorar as funções de lista integradas do Vim.

Para obter o comprimento de uma lista, use `len()`:

```shell
:echo len(["chocolate", "strawberry"])
" retorna 2
```

Para adicionar um elemento no início de uma lista, você pode usar `insert()`:

```shell
:let sweetList = ["chocolate", "strawberry"]
:call insert(sweetList, "glazed")

:echo sweetList
" retorna ["glazed", "chocolate", "strawberry"]
```

Você também pode passar para `insert()` o índice onde deseja adicionar o elemento. Se você quiser adicionar um item antes do segundo elemento (índice 1):

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call insert(sweeterList, "cream", 1)

:echo sweeterList
" retorna ['glazed', 'cream', 'chocolate', 'strawberry']
```

Para remover um item de lista, use `remove()`. Ele aceita uma lista e o índice do elemento que você deseja remover.

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call remove(sweeterList, 1)

:echo sweeterList
" retorna ['glazed', 'strawberry']
```

Você pode usar `map()` e `filter()` em uma lista. Para filtrar elementos que contêm a frase "choco":

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call filter(sweeterList, 'v:val !~ "choco"')
:echo sweeterList
" retorna ["glazed", "strawberry"]

:let sweetestList = ["chocolate", "glazed", "sugar"]
:call map(sweetestList, 'v:val . " donut"')
:echo sweetestList
" retorna ['chocolate donut', 'glazed donut', 'sugar donut']
```

A variável `v:val` é uma variável especial do Vim. Ela está disponível ao iterar uma lista ou um dicionário usando `map()` ou `filter()`. Ela representa cada item iterado.

Para mais, confira `:h list-functions`.

### Desempacotando Lista

Você pode desempacotar uma lista e atribuir variáveis aos itens da lista:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let [flavor1, flavor2, flavor3] = favoriteFlavor

:echo flavor1
" retorna "chocolate"

:echo flavor2
" retorna "glazed"
```

Para atribuir o restante dos itens da lista, você pode usar `;` seguido de um nome de variável:

```shell
:let favoriteFruits = ["apple", "banana", "lemon", "blueberry", "raspberry"]
:let [fruit1, fruit2; restFruits] = favoriteFruits

:echo fruit1
" retorna "apple"

:echo restFruits
" retorna ['lemon', 'blueberry', 'raspberry']
```

### Modificando Lista

Você pode modificar um item de lista diretamente:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[0] = "sugar"
:echo favoriteFlavor
" retorna ['sugar', 'glazed', 'plain']
```

Você pode modificar múltiplos itens de lista diretamente:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[2:] = ["strawberry", "chocolate"]
:echo favoriteFlavor
" retorna ['chocolate', 'glazed', 'strawberry', 'chocolate']
```

## Dicionário

Um dicionário Vimscript é uma lista associativa e não ordenada. Um dicionário não vazio consiste em pelo menos um par chave-valor.

```shell
{"breakfast": "waffles", "lunch": "pancakes"}
{"meal": ["breakfast", "second breakfast", "third breakfast"]}
{"dinner": 1, "dessert": 2}
```

Um objeto de dados de dicionário Vim usa string como chave. Se você tentar usar um número, o Vim irá convertê-lo em uma string.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}

:echo breakfastNo
" retorna {'1': '7am', '2': '9am', '11ses': '11am'}
```

Se você estiver muito preguiçoso para colocar aspas em torno de cada chave, pode usar a notação `#{}`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo mealPlans
" retorna {'lunch': 'pancakes', 'breakfast': 'waffles', 'dinner': 'donuts'}
```

A única exigência para usar a sintaxe `#{}` é que cada chave deve ser:

- Caractere ASCII.
- Dígito.
- Um sublinhado (`_`).
- Um hífen (`-`).

Assim como na lista, você pode usar qualquer tipo de dado como valores.

```shell
:let mealPlan = {"breakfast": ["pancake", "waffle", "hash brown"], "lunch": WhatsForLunch(), "dinner": {"appetizer": "gruel", "entree": "more gruel"}}
```

### Acessando Dicionário

Para acessar um valor de um dicionário, você pode chamar a chave com colchetes (`['key']`) ou a notação de ponto (`.key`).

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches", "dinner": "more gruel"}

:let breakfast = meal['breakfast']
:let lunch = meal.lunch

:echo breakfast
" retorna "gruel omelettes"

:echo lunch
" retorna "gruel sandwiches"
```

### Modificando Dicionário

Você pode modificar ou até adicionar um conteúdo ao dicionário:

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches"}

:let meal.breakfast = "breakfast tacos"
:let meal["lunch"] = "tacos al pastor"
:let meal["dinner"] = "quesadillas"

:echo meal
" retorna {'lunch': 'tacos al pastor', 'breakfast': 'breakfast tacos', 'dinner': 'quesadillas'}
```

### Funções de Dicionário

Vamos explorar algumas das funções integradas do Vim para manipular dicionários.

Para verificar o comprimento de um dicionário, use `len()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo len(mealPlans)
" retorna 3
```

Para ver se um dicionário contém uma chave específica, use `has_key()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo has_key(mealPlans, "breakfast")
" retorna 1

:echo has_key(mealPlans, "dessert")
" retorna 0
```

Para ver se um dicionário tem algum item, use `empty()`. O procedimento `empty()` funciona com todos os tipos de dados: lista, dicionário, string, número, float, etc.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:let noMealPlan = {}

:echo empty(noMealPlan)
" retorna 1

:echo empty(mealPlans)
" retorna 0
```

Para remover uma entrada de um dicionário, use `remove()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo "removendo breakfast: " . remove(mealPlans, "breakfast")
" retorna "removendo breakfast: 'waffles'""

:echo mealPlans
" retorna {'lunch': 'pancakes', 'dinner': 'donuts'}
```

Para converter um dicionário em uma lista de listas, use `items()`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo items(mealPlans)
" retorna [['lunch', 'pancakes'], ['breakfast', 'waffles'], ['dinner', 'donuts']]
```

`filter()` e `map()` também estão disponíveis.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}
:call filter(breakfastNo, 'v:key > 1')

:echo breakfastNo
" retorna {'2': '9am', '11ses': '11am'}
```

Como um dicionário contém pares chave-valor, o Vim fornece a variável especial `v:key` que funciona de forma semelhante a `v:val`. Ao iterar através de um dicionário, `v:key` conterá o valor da chave atualmente iterada.

Se você tiver um dicionário `mealPlans`, pode mapeá-lo usando `v:key`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:key . " and milk"')

:echo mealPlans
" retorna {'lunch': 'lunch and milk', 'breakfast': 'breakfast and milk', 'dinner': 'dinner and milk'}
```

Da mesma forma, você pode mapeá-lo usando `v:val`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:val . " and milk"')

:echo mealPlans
" retorna {'lunch': 'pancakes and milk', 'breakfast': 'waffles and milk', 'dinner': 'donuts and milk'}
```

Para ver mais funções de dicionário, confira `:h dict-functions`.

## Primitivos Especiais

O Vim tem primitivos especiais:

- `v:false`
- `v:true`
- `v:none`
- `v:null`

A propósito, `v:` é a variável interna do Vim. Elas serão abordadas mais adiante em um capítulo posterior.

Na minha experiência, você não usará esses primitivos especiais com frequência. Se você precisar de um valor verdadeiro/falso, pode usar apenas 0 (falso) e não-0 (verdadeiro). Se precisar de uma string vazia, use apenas `""`. Mas ainda é bom saber, então vamos passar rapidamente por eles.

### Verdadeiro

Isso é equivalente a `true`. É equivalente a um número com valor diferente de 0. Ao decodificar json com `json_encode()`, é interpretado como "true".

```shell
:echo json_encode({"test": v:true})
" retorna {"test": true}
```

### Falso

Isso é equivalente a `false`. É equivalente a um número com valor de 0. Ao decodificar json com `json_encode()`, é interpretado como "false".

```shell
:echo json_encode({"test": v:false})
" retorna {"test": false}
```

### Nenhum

É equivalente a uma string vazia. Ao decodificar json com `json_encode()`, é interpretado como um item vazio (`null`).

```shell
:echo json_encode({"test": v:none})
" retorna {"test": null}
```

### Nulo

Semelhante a `v:none`.

```shell
:echo json_encode({"test": v:null})
" retorna {"test": null}
```

## Aprenda Tipos de Dados da Maneira Inteligente

Neste capítulo, você aprendeu sobre os tipos de dados básicos do Vimscript: número, float, string, lista, dicionário e especial. Aprender isso é o primeiro passo para começar a programar em Vimscript.

No próximo capítulo, você aprenderá como combiná-los para escrever expressões como igualdades, condicionais e loops.