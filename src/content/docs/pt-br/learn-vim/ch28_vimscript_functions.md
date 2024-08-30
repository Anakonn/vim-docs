---
description: Este documento explora funções em Vimscript, detalhando regras de sintaxe
  e exemplos de definição, enfatizando a importância da abstração na programação.
title: Ch28. Vimscript Functions
---

Funções são meios de abstração, o terceiro elemento no aprendizado de uma nova linguagem.

Nos capítulos anteriores, você viu funções nativas do Vimscript (`len()`, `filter()`, `map()`, etc.) e funções personalizadas em ação. Neste capítulo, você irá se aprofundar para aprender como as funções funcionam.

## Regras de Sintaxe de Funções

No núcleo, uma função do Vimscript tem a seguinte sintaxe:

```shell
function {FunctionName}()
  {do-something}
endfunction
```

Uma definição de função deve começar com uma letra maiúscula. Começa com a palavra-chave `function` e termina com `endfunction`. Abaixo está uma função válida:

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

A seguinte não é uma função válida porque não começa com uma letra maiúscula.

```shell
function tasty()
  echo "Tasty"
endfunction
```

Se você preceder uma função com a variável de script (`s:`), pode usá-la com uma letra minúscula. `function s:tasty()` é um nome válido. A razão pela qual o Vim exige que você use um nome em maiúscula é para evitar confusão com as funções internas do Vim (todas em minúsculas).

Um nome de função não pode começar com um número. `1Tasty()` não é um nome de função válido, mas `Tasty1()` é. Uma função também não pode conter caracteres não alfanuméricos além de `_`. `Tasty-food()`, `Tasty&food()` e `Tasty.food()` não são nomes de função válidos. `Tasty_food()` *é*.

Se você definir duas funções com o mesmo nome, o Vim lançará um erro reclamando que a função `Tasty` já existe. Para sobrescrever a função anterior com o mesmo nome, adicione um `!` após a palavra-chave `function`.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

## Listando Funções Disponíveis

Para ver todas as funções internas e personalizadas no Vim, você pode executar o comando `:function`. Para olhar o conteúdo da função `Tasty`, você pode executar `:function Tasty`.

Você também pode procurar funções com padrão usando `:function /pattern`, semelhante à navegação de busca do Vim (`/pattern`). Para buscar todas as funções que contêm a frase "map", execute `:function /map`. Se você usar plugins externos, o Vim exibirá as funções definidas nesses plugins.

Se você quiser ver de onde uma função se origina, pode usar o comando `:verbose` com o comando `:function`. Para ver de onde todas as funções que contêm a palavra "map" se originam, execute:

```shell
:verbose function /map
```

Quando eu executei, obtive uma série de resultados. Este me diz que a função `fzf#vim#maps` é uma função de autoload (para recapitular, consulte o Cap. 23) escrita dentro do arquivo `~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim`, na linha 1263. Isso é útil para depuração.

```shell
function fzf#vim#maps(mode, ...)
        Last set from ~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim line 1263
```

## Removendo uma Função

Para remover uma função existente, use `:delfunction {Function_name}`. Para deletar `Tasty`, execute `:delfunction Tasty`.

## Valor de Retorno da Função

Para que uma função retorne um valor, você precisa passar um valor explícito de `return`. Caso contrário, o Vim automaticamente retorna um valor implícito de 0.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

Um `return` vazio também é equivalente a um valor 0.

```shell
function! Tasty()
  echo "Tasty"
  return
endfunction
```

Se você executar `:echo Tasty()` usando a função acima, após o Vim exibir "Tasty", ele retorna 0, o valor de retorno implícito. Para fazer `Tasty()` retornar o valor "Tasty", você pode fazer isso:

```shell
function! Tasty()
  return "Tasty"
endfunction
```

Agora, quando você executar `:echo Tasty()`, ele retorna a string "Tasty".

Você pode usar uma função dentro de uma expressão. O Vim usará o valor de retorno dessa função. A expressão `:echo Tasty() . " Food!"` produz "Tasty Food!"

## Argumentos Formais

Para passar um argumento formal `food` para sua função `Tasty`, você pode fazer isso:

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

echo Tasty("pastry")
" retorna "Tasty pastry"
```

`a:` é um dos escopos de variável mencionados no capítulo anterior. É a variável de parâmetro formal. É a maneira do Vim de obter um valor de parâmetro formal em uma função. Sem isso, o Vim lançará um erro:

```shell
function! Tasty(food)
  return "Tasty " . food
endfunction

echo Tasty("pasta")
" retorna erro "nome de variável indefinido"
```

## Variável Local da Função

Vamos abordar a outra variável que você não aprendeu no capítulo anterior: a variável local da função (`l:`).

Ao escrever uma função, você pode definir uma variável dentro:

```shell
function! Yummy()
  let location = "tummy"
  return "Yummy in my " . location
endfunction

echo Yummy()
" retorna "Yummy in my tummy"
```

Neste contexto, a variável `location` é a mesma que `l:location`. Quando você define uma variável em uma função, essa variável é *local* para essa função. Quando um usuário vê `location`, pode facilmente ser confundido como uma variável global. Eu prefiro ser mais explícito do que não, então prefiro colocar `l:` para indicar que esta é uma variável da função.

Outra razão para usar `l:count` é que o Vim tem variáveis especiais com aliases que se parecem com variáveis normais. `v:count` é um exemplo. Ele tem um alias de `count`. No Vim, chamar `count` é o mesmo que chamar `v:count`. É fácil acidentalmente chamar uma dessas variáveis especiais.

```shell
function! Calories()
  let count = "count"
  return "I do not " . count . " my calories"
endfunction

echo Calories()
" lança um erro
```

A execução acima lança um erro porque `let count = "Count"` tenta implicitamente redefinir a variável especial do Vim `v:count`. Lembre-se de que variáveis especiais (`v:`) são somente leitura. Você não pode mutá-las. Para corrigir isso, use `l:count`:

```shell
function! Calories()
  let l:count = "count"
  return "I do not " . l:count . " my calories"
endfunction

echo Calories()
" retorna "I do not count my calories"
```

## Chamando uma Função

O Vim tem um comando `:call` para chamar uma função.

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

call Tasty("gravy")
```

O comando `call` não exibe o valor de retorno. Vamos chamá-lo com `echo`.

```shell
echo call Tasty("gravy")
```

Oops, você recebe um erro. O comando `call` acima é um comando de linha de comando (`:call`). O comando `echo` acima também é um comando de linha de comando (`:echo`). Você não pode chamar um comando de linha de comando com outro comando de linha de comando. Vamos tentar um sabor diferente do comando `call`:

```shell
echo call("Tasty", ["gravy"])
" retorna "Tasty gravy"
```

Para esclarecer qualquer confusão, você acabou de usar dois comandos `call` diferentes: o comando de linha de comando `:call` e a função `call()`. A função `call()` aceita como seu primeiro argumento o nome da função (string) e seu segundo argumento os parâmetros formais (lista).

Para saber mais sobre `:call` e `call()`, consulte `:h call()` e `:h :call`.

## Argumento Padrão

Você pode fornecer um parâmetro de função com um valor padrão com `=`. Se você chamar `Breakfast` com apenas um argumento, o argumento `beverage` usará o valor padrão "milk".

```shell
function! Breakfast(meal, beverage = "Milk")
  return "I had " . a:meal . " and " . a:beverage . " for breakfast"
endfunction

echo Breakfast("Hash Browns")
" retorna I had hash browns and milk for breakfast

echo Breakfast("Cereal", "Orange Juice")
" retorna I had Cereal and Orange Juice for breakfast
```

## Argumentos Variáveis

Você pode passar um argumento variável com três pontos (`...`). O argumento variável é útil quando você não sabe quantas variáveis um usuário fornecerá.

Suponha que você esteja criando um buffet à vontade (você nunca saberá quanto comida seu cliente comerá):

```shell
function! Buffet(...)
  return a:1
endfunction
```

Se você executar `echo Buffet("Noodles")`, ele exibirá "Noodles". O Vim usa `a:1` para imprimir o *primeiro* argumento passado para `...`, até 20 (`a:1` é o primeiro argumento, `a:2` é o segundo argumento, etc). Se você executar `echo Buffet("Noodles", "Sushi")`, ele ainda exibirá apenas "Noodles", vamos atualizá-lo:

```shell
function! Buffet(...)
  return a:1 . " " . a:2
endfunction

echo Buffet("Noodles", "Sushi")
" retorna "Noodles Sushi"
```

O problema com essa abordagem é que se você agora executar `echo Buffet("Noodles")` (com apenas uma variável), o Vim reclama que tem uma variável indefinida `a:2`. Como você pode torná-lo flexível o suficiente para exibir exatamente o que o usuário fornece?

Felizmente, o Vim tem uma variável especial `a:0` para exibir o *número* de argumentos passados para `...`.

```shell
function! Buffet(...)
  return a:0
endfunction

echo Buffet("Noodles")
" retorna 1

echo Buffet("Noodles", "Sushi")
" retorna 2

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" retorna 5
```

Com isso, você pode iterar usando o comprimento do argumento.

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

As chaves `a:{l:food_counter}` são uma interpolação de string, usam o valor do contador `food_counter` para chamar os argumentos de parâmetro formal `a:1`, `a:2`, `a:3`, etc.

```shell
echo Buffet("Noodles")
" retorna "Noodles"

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" retorna tudo que você passou: "Noodles Sushi Ice cream Tofu Mochi"
```

O argumento variável tem mais uma variável especial: `a:000`. Ela tem o valor de todos os argumentos variáveis em formato de lista.

```shell
function! Buffet(...)
  return a:000
endfunction

echo Buffet("Noodles")
" retorna ["Noodles"]

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" retorna ["Noodles", "Sushi", "Ice cream", "Tofu", "Mochi"]
```

Vamos refatorar a função para usar um loop `for`:

```shell
function! Buffet(...)
  let l:foods = ""
  for food_item in a:000
    let l:foods .= food_item . " "
  endfor
  return l:foods
endfunction

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" retorna Noodles Sushi Ice cream Tofu Mochi
```
## Intervalo

Você pode definir uma função *ranged* em Vimscript adicionando a palavra-chave `range` no final da definição da função. Uma função ranged tem duas variáveis especiais disponíveis: `a:firstline` e `a:lastline`.

```shell
function! Breakfast() range
  echo a:firstline
  echo a:lastline
endfunction
```

Se você estiver na linha 100 e executar `call Breakfast()`, ele exibirá 100 para ambas `firstline` e `lastline`. Se você destacar visualmente (`v`, `V` ou `Ctrl-V`) as linhas 101 a 105 e executar `call Breakfast()`, `firstline` exibirá 101 e `lastline` exibirá 105. `firstline` e `lastline` exibem o intervalo mínimo e máximo onde a função é chamada.

Você também pode usar `:call` e passar um intervalo. Se você executar `:11,20call Breakfast()`, ele exibirá 11 para `firstline` e 20 para `lastline`.

Você pode perguntar: "É bom que a função Vimscript aceite intervalo, mas não posso obter o número da linha com `line(".")`? Não fará a mesma coisa?"

Boa pergunta. Se isso é o que você quer dizer:

```shell
function! Breakfast()
  echo line(".")
endfunction
```

Chamar `:11,20call Breakfast()` executa a função `Breakfast` 10 vezes (uma para cada linha no intervalo). Compare isso se você tivesse passado o argumento `range`:

```shell
function! Breakfast() range
  echo line(".")
endfunction
```

Chamar `11,20call Breakfast()` executa a função `Breakfast` *uma vez*.

Se você passar uma palavra-chave `range` e passar um intervalo numérico (como `11,20`) no `call`, o Vim executa essa função apenas uma vez. Se você não passar uma palavra-chave `range` e passar um intervalo numérico (como `11,20`) no `call`, o Vim executa essa função N vezes dependendo do intervalo (neste caso, N = 10).

## Dicionário

Você pode adicionar uma função como um item de dicionário adicionando a palavra-chave `dict` ao definir uma função.

Se você tiver uma função `SecondBreakfast` que retorna qualquer item de `breakfast` que você tiver:

```shell
function! SecondBreakfast() dict
  return self.breakfast
endfunction
```

Vamos adicionar essa função ao dicionário `meals`:

```shell
let meals = {"breakfast": "pancakes", "second_breakfast": function("SecondBreakfast"), "lunch": "pasta"}

echo meals.second_breakfast()
" retorna "pancakes"
```

Com a palavra-chave `dict`, a variável chave `self` refere-se ao dicionário onde a função está armazenada (neste caso, o dicionário `meals`). A expressão `self.breakfast` é igual a `meals.breakfast`.

Uma maneira alternativa de adicionar uma função a um objeto de dicionário é usar um namespace.

```shell
function! meals.second_lunch()
  return self.lunch
endfunction

echo meals.second_lunch()
" retorna "pasta"
```

Com namespace, você não precisa usar a palavra-chave `dict`.

## Funcref

Um funcref é uma referência a uma função. É um dos tipos de dados básicos do Vimscript mencionados no Cap. 24.

A expressão `function("SecondBreakfast")` acima é um exemplo de funcref. O Vim tem uma função embutida `function()` que retorna um funcref quando você passa o nome de uma função (string).

```shell
function! Breakfast(item)
  return "Eu estou tendo " . a:item . " no café da manhã"
endfunction

let Breakfastify = Breakfast
" retorna erro

let Breakfastify = function("Breakfast")

echo Breakfastify("aveia")
" retorna "Eu estou tendo aveia no café da manhã"

echo Breakfastify("panqueca")
" retorna "Eu estou tendo panqueca no café da manhã"
```

No Vim, se você quiser atribuir uma função a uma variável, não pode simplesmente atribuí-la diretamente como `let MyVar = MyFunc`. Você precisa usar a função `function()`, como `let MyVar = function("MyFunc")`.

Você pode usar funcref com maps e filters. Note que maps e filters passarão um índice como o primeiro argumento e o valor iterado como o segundo argumento.

```shell
function! Breakfast(index, item)
  return "Eu estou tendo " . a:item . " no café da manhã"
endfunction

let breakfast_items = ["panquecas", "batatas fritas", "waffles"]
let first_meals = map(breakfast_items, function("Breakfast"))

for meal in first_meals
  echo meal
endfor
```

## Lambda

Uma maneira melhor de usar funções em maps e filters é usar expressões lambda (às vezes conhecidas como funções sem nome). Por exemplo:

```shell
let Plus = {x,y -> x + y}
echo Plus(1,2)
" retorna 3

let Tasty = { -> 'saboroso'}
echo Tasty()
" retorna "saboroso"
```

Você pode chamar uma função de dentro de uma expressão lambda:

```shell
function! Lunch(item)
  return "Eu estou tendo " . a:item . " no almoço"
endfunction

let lunch_items = ["sushi", "ramen", "sashimi"]

let day_meals = map(lunch_items, {index, item -> Lunch(item)})

for meal in day_meals
  echo meal
endfor
```

Se você não quiser chamar a função de dentro da lambda, pode refatorá-la:

```shell
let day_meals = map(lunch_items, {index, item -> "Eu estou tendo " . item . " no almoço"})
```

## Encadeamento de Métodos

Você pode encadear várias funções Vimscript e expressões lambda sequencialmente com `->`. Lembre-se de que `->` deve ser seguido por um nome de método *sem espaço*.

```shell
Source->Method1()->Method2()->...->MethodN()
```

Para converter um float em um número usando encadeamento de métodos:

```shell
echo 3.14->float2nr()
" retorna 3
```

Vamos fazer um exemplo mais complicado. Suponha que você precise capitalizar a primeira letra de cada item em uma lista, depois classificar a lista, e então juntar a lista para formar uma string.

```shell
function! Capitalizer(word)
  return substitute(a:word, "\^\.", "\\u&", "g")
endfunction

function! CapitalizeList(word_list)
  return map(a:word_list, {index, word -> Capitalizer(word)})
endfunction

let dinner_items = ["bruschetta", "antipasto", "calzone"]

echo dinner_items->CapitalizeList()->sort()->join(", ")
" retorna "Antipasto, Bruschetta, Calzone"
```

Com o encadeamento de métodos, a sequência é mais facilmente lida e compreendida. Eu posso apenas olhar para `dinner_items->CapitalizeList()->sort()->join(", ")` e saber exatamente o que está acontecendo.

## Closure

Quando você define uma variável dentro de uma função, essa variável existe dentro dos limites dessa função. Isso é chamado de escopo lexical.

```shell
function! Lunch()
  let appetizer = "camarão"

  function! SecondLunch()
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

`appetizer` é definido dentro da função `Lunch`, que retorna o funcref `SecondLunch`. Observe que `SecondLunch` usa o `appetizer`, mas no Vimscript, ele não tem acesso a essa variável. Se você tentar executar `echo Lunch()()`, o Vim lançará um erro de variável indefinida.

Para corrigir esse problema, use a palavra-chave `closure`. Vamos refatorar:

```shell
function! Lunch()
  let appetizer = "camarão"

  function! SecondLunch() closure
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

Agora, se você executar `echo Lunch()()`, o Vim retornará "camarão".

## Aprenda Funções Vimscript da Maneira Inteligente

Neste capítulo, você aprendeu a anatomia da função Vim. Você aprendeu como usar diferentes palavras-chave especiais `range`, `dict` e `closure` para modificar o comportamento da função. Você também aprendeu como usar lambda e encadear várias funções juntas. Funções são ferramentas importantes para criar abstrações complexas.

A seguir, vamos juntar tudo o que você aprendeu para criar seu próprio plugin.