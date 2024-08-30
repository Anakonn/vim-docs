---
description: Este documento explora variáveis em Vim, abordando variáveis mutáveis
  e imutáveis, além das fontes e escopos disponíveis para seu uso.
title: Ch27. Vimscript Variable Scopes
---

Antes de mergulhar nas funções do Vimscript, vamos aprender sobre as diferentes fontes e escopos das variáveis do Vim.

## Variáveis Mutáveis e Imutáveis

Você pode atribuir um valor a uma variável no Vim com `let`:

```shell
let pancake = "pancake"
```

Mais tarde, você pode chamar essa variável a qualquer momento.

```shell
echo pancake
" retorna "pancake"
```

`let` é mutável, o que significa que você pode mudar o valor a qualquer momento no futuro.

```shell
let pancake = "pancake"
let pancake = "not waffles"

echo pancake
" retorna "not waffles"
```

Observe que quando você deseja mudar o valor de uma variável definida, ainda precisa usar `let`.

```shell
let beverage = "milk"

beverage = "orange juice"
" gera um erro
```

Você pode definir uma variável imutável com `const`. Sendo imutável, uma vez que um valor de variável é atribuído, você não pode reatribuí-lo com um valor diferente.

```shell
const waffle = "waffle"
const waffle = "pancake"
" gera um erro
```

## Fontes de Variáveis

Existem três fontes para variáveis: variável de ambiente, variável de opção e variável de registro.

### Variável de Ambiente

O Vim pode acessar sua variável de ambiente do terminal. Por exemplo, se você tiver a variável de ambiente `SHELL` disponível em seu terminal, pode acessá-la do Vim com:

```shell
echo $SHELL
" retorna o valor de $SHELL. No meu caso, retorna /bin/bash
```

### Variável de Opção

Você pode acessar as opções do Vim com `&` (essas são as configurações que você acessa com `set`).

Por exemplo, para ver qual fundo o Vim usa, você pode executar:

```shell
echo &background
" retorna "light" ou "dark"
```

Alternativamente, você pode sempre executar `set background?` para ver o valor da opção `background`.

### Variável de Registro

Você pode acessar os registros do Vim (Cap. 08) com `@`.

Suponha que o valor "chocolate" já esteja salvo no registro a. Para acessá-lo, você pode usar `@a`. Você também pode atualizá-lo com `let`.

```shell
echo @a
" retorna chocolate

let @a .= " donut"

echo @a
" retorna "chocolate donut"
```

Agora, quando você colar do registro `a` (`"ap`), ele retornará "chocolate donut". O operador `.=` concatena duas strings. A expressão `let @a .= " donut"` é a mesma que `let @a = @a . " donut"`

## Escopos de Variáveis

Existem 9 escopos diferentes de variáveis no Vim. Você pode reconhecê-los pela letra que os precede:

```shell
g:           Variável global
{nothing}    Variável global
b:           Variável local do buffer
w:           Variável local da janela
t:           Variável local da aba
s:           Variável do Vimscript fonte
l:           Variável local da função
a:           Variável de parâmetro formal da função
v:           Variável interna do Vim
```

### Variável Global

Quando você declara uma variável "regular":

```shell
let pancake = "pancake"
```

`pancake` é na verdade uma variável global. Quando você define uma variável global, pode chamá-la de qualquer lugar.

Preceder `g:` a uma variável também cria uma variável global.

```shell
let g:waffle = "waffle"
```

Nesse caso, tanto `pancake` quanto `g:waffle` têm o mesmo escopo. Você pode chamar cada uma delas com ou sem `g:`.

```shell
echo pancake
" retorna "pancake"

echo g:pancake
" retorna "pancake"

echo waffle
" retorna "waffle"

echo g:waffle
" retorna "waffle"
```

### Variável de Buffer

Uma variável precedida por `b:` é uma variável de buffer. Uma variável de buffer é uma variável que é local ao buffer atual (Cap. 02). Se você tiver vários buffers abertos, cada buffer terá sua própria lista separada de variáveis de buffer.

No buffer 1:

```shell
const b:donut = "chocolate donut"
```

No buffer 2:

```shell
const b:donut = "blueberry donut"
```

Se você executar `echo b:donut` do buffer 1, retornará "chocolate donut". Se você executar do buffer 2, retornará "blueberry donut".

Por outro lado, o Vim tem uma variável de buffer *especial* `b:changedtick` que rastreia todas as mudanças feitas no buffer atual.

1. Execute `echo b:changedtick` e anote o número que ele retorna.
2. Faça alterações no Vim.
3. Execute `echo b:changedtick` novamente e anote o número que ele agora retorna.

### Variável de Janela

Uma variável precedida por `w:` é uma variável de janela. Ela existe apenas naquela janela.

Na janela 1:

```shell
const w:donut = "chocolate donut"
```

Na janela 2:

```shell
const w:donut = "raspberry donut"
```

Em cada janela, você pode chamar `echo w:donut` para obter valores únicos.

### Variável de Aba

Uma variável precedida por `t:` é uma variável de aba. Ela existe apenas naquela aba.

Na aba 1:

```shell
const t:donut = "chocolate donut"
```

Na aba 2:

```shell
const t:donut = "blackberry donut"
```

Em cada aba, você pode chamar `echo t:donut` para obter valores únicos.

### Variável de Script

Uma variável precedida por `s:` é uma variável de script. Essas variáveis só podem ser acessadas de dentro desse script.

Se você tiver um arquivo arbitrário `dozen.vim` e dentro dele você tiver:

```shell
let s:dozen = 12

function Consume()
  let s:dozen -= 1
  echo s:dozen " é o restante"
endfunction
```

Fonte o arquivo com `:source dozen.vim`. Agora chame a função `Consume`:

```shell
:call Consume()
" retorna "11 é o restante"

:call Consume()
" retorna "10 é o restante"

:echo s:dozen
" Erro de variável indefinida
```

Quando você chama `Consume`, vê que ele decrementa o valor de `s:dozen` como esperado. Quando você tenta obter o valor de `s:dozen` diretamente, o Vim não o encontrará porque você está fora do escopo. `s:dozen` só é acessível de dentro de `dozen.vim`.

Cada vez que você fonte o arquivo `dozen.vim`, ele reinicia o contador `s:dozen`. Se você estiver no meio de decrementar o valor de `s:dozen` e executar `:source dozen.vim`, o contador reinicia para 12. Isso pode ser um problema para usuários desavisados. Para corrigir esse problema, refatore o código:

```shell
if !exists("s:dozen")
  let s:dozen = 12
endif

function Consume()
  let s:dozen -= 1
  echo s:dozen
endfunction
```

Agora, quando você fonte `dozen.vim` enquanto está no meio de decrementar, o Vim lê `!exists("s:dozen")`, encontra que é verdadeiro e não reinicia o valor de volta para 12.

### Variável Local da Função e Variável de Parâmetro Formal da Função

Tanto a variável local da função (`l:`) quanto a variável formal da função (`a:`) serão abordadas no próximo capítulo.

### Variáveis Internas do Vim

Uma variável precedida por `v:` é uma variável interna especial do Vim. Você não pode definir essas variáveis. Você já viu algumas delas.
- `v:version` informa qual versão do Vim você está usando.
- `v:key` contém o valor do item atual ao iterar através de um dicionário.
- `v:val` contém o valor do item atual ao executar uma operação `map()` ou `filter()`.
- `v:true`, `v:false`, `v:null` e `v:none` são tipos de dados especiais.

Existem outras variáveis. Para uma lista de variáveis internas do Vim, confira `:h vim-variable` ou `:h v:`.

## Usando Escopos de Variáveis do Vim de Forma Inteligente

Ser capaz de acessar rapidamente variáveis de ambiente, opção e registro oferece uma ampla flexibilidade para personalizar seu editor e ambiente de terminal. Você também aprendeu que o Vim tem 9 escopos diferentes de variáveis, cada um existindo sob certas restrições. Você pode aproveitar esses tipos únicos de variáveis para desacoplar seu programa.

Você chegou até aqui. Aprendeu sobre tipos de dados, meios de combinações e escopos de variáveis. Apenas uma coisa resta: funções.