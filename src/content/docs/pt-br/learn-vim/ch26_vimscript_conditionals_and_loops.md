---
description: Aprenda a usar tipos de dados do Vimscript para criar programas básicos
  com condicionais e loops, incluindo operadores relacionais e coerção de strings.
title: Ch26. Vimscript Conditionals and Loops
---

Após aprender quais são os tipos de dados básicos, o próximo passo é aprender como combiná-los para começar a escrever um programa básico. Um programa básico consiste em condicionais e loops.

Neste capítulo, você aprenderá como usar os tipos de dados do Vimscript para escrever condicionais e loops.

## Operadores Relacionais

Os operadores relacionais do Vimscript são semelhantes a muitas linguagens de programação:

```shell
a == b		igual a
a != b		diferente de
a >  b		maior que
a >= b		maior ou igual a
a <  b		menor que
a <= b		menor ou igual a
```

Por exemplo:

```shell
:echo 5 == 5
:echo 5 != 5
:echo 10 > 5
:echo 10 >= 5
:echo 10 < 5
:echo 5 <= 5
```

Lembre-se de que strings são convertidas em números em uma expressão aritmética. Aqui, o Vim também converte strings em números em uma expressão de igualdade. "5foo" é convertido em 5 (verdadeiro):

```shell
:echo 5 == "5foo"
" retorna verdadeiro
```

Além disso, lembre-se de que se você começar uma string com um caractere não numérico como "foo5", a string é convertida no número 0 (falso).

```shell
echo 5 == "foo5"
" retorna falso
```

### Operadores Lógicos de String

O Vim possui mais operadores relacionais para comparar strings:

```shell
a =~ b
a !~ b
```

Por exemplo:

```shell
let str = "café da manhã"

echo str =~ "café"
" retorna verdadeiro

echo str =~ "jantar"
" retorna falso

echo str !~ "jantar"
" retorna verdadeiro
```

O operador `=~` realiza uma correspondência regex contra a string dada. No exemplo acima, `str =~ "café"` retorna verdadeiro porque `str` *contém* o padrão "café". Você sempre pode usar `==` e `!=`, mas usá-los irá comparar a expressão contra a string inteira. `=~` e `!~` são escolhas mais flexíveis.

```shell
echo str == "café"
" retorna falso

echo str == "café da manhã"
" retorna verdadeiro
```

Vamos tentar este. Note o "C" maiúsculo:

```shell
echo str =~ "Café"
" verdadeiro
```

Retorna verdadeiro mesmo que "Café" esteja capitalizado. Interessante... Acontece que minha configuração do Vim está definida para ignorar maiúsculas (`set ignorecase`), então quando o Vim verifica a igualdade, ele usa minha configuração do Vim e ignora a capitalização. Se eu desligar a ignorância de maiúsculas (`set noignorecase`), a comparação agora retorna falso.

```shell
set noignorecase
echo str =~ "Café"
" retorna falso porque a capitalização importa

set ignorecase
echo str =~ "Café"
" retorna verdadeiro porque a capitalização não importa
```

Se você está escrevendo um plugin para outros, esta é uma situação complicada. O usuário usa `ignorecase` ou `noignorecase`? Você definitivamente *não* quer forçar seus usuários a mudar sua opção de ignorar maiúsculas. Então, o que você faz?

Felizmente, o Vim tem um operador que pode *sempre* ignorar ou corresponder a capitalização. Para sempre corresponder a capitalização, adicione um `#` no final.

```shell
set ignorecase
echo str =~# "café"
" retorna verdadeiro

echo str =~# "CafÉ"
" retorna falso

set noignorecase
echo str =~# "café"
" verdadeiro

echo str =~# "CafÉ"
" falso

echo str !~# "CafÉ"
" verdadeiro
```

Para sempre ignorar a capitalização ao comparar, anexe com `?`:

```shell
set ignorecase
echo str =~? "café"
" verdadeiro

echo str =~? "CafÉ"
" verdadeiro

set noignorecase
echo str =~? "café"
" verdadeiro

echo str =~? "CafÉ"
" verdadeiro

echo str !~? "CafÉ"
" falso
```

Eu prefiro usar `#` para sempre corresponder à capitalização e estar no lado seguro.

## If

Agora que você viu as expressões de igualdade do Vim, vamos tocar em um operador condicional fundamental, a instrução `if`.

No mínimo, a sintaxe é:

```shell
if {cláusula}
  {alguma expressão}
endif
```

Você pode estender a análise de casos com `elseif` e `else`.

```shell
if {predicado1}
  {expressão1}
elseif {predicado2}
  {expressão2}
elseif {predicado3}
  {expressão3}
else
  {expressão4}
endif
```

Por exemplo, o plugin [vim-signify](https://github.com/mhinz/vim-signify) usa um método de instalação diferente dependendo das suas configurações do Vim. Abaixo está a instrução de instalação do `readme` deles, usando a instrução `if`:

```shell
if has('nvim') || has('patch-8.0.902')
  Plug 'mhinz/vim-signify'
else
  Plug 'mhinz/vim-signify', { 'branch': 'legacy' }
endif
```

## Expressão Ternária

O Vim tem uma expressão ternária para uma análise de caso em uma linha:

```shell
{predicado} ? expressãoverdadeira : expressãofalsa
```

Por exemplo:

```shell
echo 1 ? "Eu sou verdadeiro" : "Eu sou falso"
```

Como 1 é verdadeiro, o Vim ecoa "Eu sou verdadeiro". Suponha que você queira definir condicionalmente o `background` para escuro se você estiver usando o Vim após uma certa hora. Adicione isso ao vimrc:

```shell
let &background = strftime("%H") < 18 ? "claro" : "escuro"
```

`&background` é a opção `'background'` no Vim. `strftime("%H")` retorna a hora atual em horas. Se ainda não for 6 PM, use um fundo claro. Caso contrário, use um fundo escuro.

## ou

O "ou" lógico (`||`) funciona como muitas linguagens de programação.

```shell
{Expressão Falsa}  || {Expressão Falsa}   falso
{Expressão Falsa}  || {Expressão Verdadeira}  verdadeiro
{Expressão Verdadeira} || {Expressão Falsa}   verdadeiro
{Expressão Verdadeira} || {Expressão Verdadeira}  verdadeiro
```

O Vim avalia a expressão e retorna 1 (verdadeiro) ou 0 (falso).

```shell
echo 5 || 0
" retorna 1

echo 5 || 5
" retorna 1

echo 0 || 0
" retorna 0

echo "foo5" || "foo5"
" retorna 0

echo "5foo" || "foo5"
" retorna 1
```

Se a expressão atual for avaliada como verdadeira, a expressão subsequente não será avaliada.

```shell
let uma_dozena = 12

echo uma_dozena || duas_dozena
" retorna 1

echo duas_dozena || uma_dozena
" retorna erro
```

Note que `duas_dozena` nunca é definida. A expressão `uma_dozena || duas_dozena` não gera nenhum erro porque `uma_dozena` é avaliada primeiro e considerada verdadeira, então o Vim não avalia `duas_dozena`.

## e

O "e" lógico (`&&`) é o complemento do "ou" lógico.

```shell
{Expressão Falsa}  && {Expressão Falsa}   falso
{Expressão Falsa}  && {Expressão Verdadeira}  falso
{Expressão Verdadeira} && {Expressão Falsa}   falso
{Expressão Verdadeira} && {Expressão Verdadeira}  verdadeiro
```

Por exemplo:

```shell
echo 0 && 0
" retorna 0

echo 0 && 10
" retorna 0
```

`&&` avalia uma expressão até ver a primeira expressão falsa. Por exemplo, se você tiver `verdadeiro && verdadeiro`, ele avaliará ambos e retornará `verdadeiro`. Se você tiver `verdadeiro && falso && verdadeiro`, ele avaliará o primeiro `verdadeiro` e parará no primeiro `falso`. Não avaliará o terceiro `verdadeiro`.

```shell
let uma_dozena = 12
echo uma_dozena && 10
" retorna 1

echo uma_dozena && v:false
" retorna 0

echo uma_dozena && duas_dozena
" retorna erro

echo exists("uma_dozena") && uma_dozena == 12
" retorna 1
```

## para

O loop `for` é comumente usado com o tipo de dado lista.

```shell
let cafés_da_manhã = ["panquecas", "waffles", "ovos"]

for café in cafés_da_manhã
  echo café
endfor
```

Funciona com listas aninhadas:

```shell
let refeições = [["café da manhã", "panquecas"], ["almoço", "peixe"], ["jantar", "massa"]]

for [tipo_refeição, comida] in refeições
  echo "Eu estou tendo " . comida . " para " . tipo_refeição
endfor
```

Você pode tecnicamente usar o loop `for` com um dicionário usando o método `keys()`.

```shell
let bebidas = #{café_da_manhã: "leite", almoço: "suco de laranja", jantar: "água"}
for tipo_bebida in keys(bebidas)
  echo "Eu estou bebendo " . bebidas[tipo_bebida] . " para " . tipo_bebida
endfor
```

## Enquanto

Outro loop comum é o loop `while`.

```shell
let contador = 1
while contador < 5
  echo "Contador é: " . contador
  let contador += 1
endwhile
```

Para obter o conteúdo da linha atual até a última linha:

```shell
let linha_atual = line(".")
let ultima_linha = line("$")

while linha_atual <= ultima_linha
  echo getline(linha_atual)
  let linha_atual += 1
endwhile
```

## Tratamento de Erros

Frequentemente, seu programa não é executado da maneira que você espera. Como resultado, ele te deixa em uma situação complicada (trocadilho intencional). O que você precisa é de um tratamento de erro adequado.

### Parar

Quando você usa `break` dentro de um loop `while` ou `for`, ele para o loop.

Para obter os textos do início do arquivo até a linha atual, mas parar quando você vê a palavra "donut":

```shell
let linha = 0
let ultima_linha = line("$")
let total_palavra = ""

while linha <= ultima_linha
  let linha += 1
  let texto_linha = getline(linha)
  if texto_linha =~# "donut"
    break
  endif
  echo texto_linha
  let total_palavra .= texto_linha . " "
endwhile

echo total_palavra
```

Se você tiver o texto:

```shell
um
dois
três
donut
quatro
cinco
```

Executar o loop `while` acima dá "um dois três" e não o restante do texto porque o loop para assim que encontra "donut".

### Continuar

O método `continue` é semelhante ao `break`, onde é invocado durante um loop. A diferença é que, em vez de sair do loop, ele apenas pula a iteração atual.

Suponha que você tenha o mesmo texto, mas em vez de `break`, você use `continue`:

```shell
let linha = 0
let ultima_linha = line("$")
let total_palavra = ""

while linha <= ultima_linha
  let linha += 1
  let texto_linha = getline(linha)
  if texto_linha =~# "donut"
    continue
  endif
  echo texto_linha
  let total_palavra .= texto_linha . " "
endwhile

echo total_palavra
```

Desta vez, ele retorna `um dois três quatro cinco`. Ele pula a linha com a palavra "donut", mas o loop continua.
### try, finally e catch

Vim tem um `try`, `finally` e `catch` para lidar com erros. Para simular um erro, você pode usar o comando `throw`.

```shell
try
  echo "Tente"
  throw "Não"
endtry
```

Execute isso. Vim reclamará com o erro `"Exceção não capturada: Não`.

Agora adicione um bloco catch:

```shell
try
  echo "Tente"
  throw "Não"
catch
  echo "Capturado"
endtry
```

Agora não há mais erro. Você deve ver "Tente" e "Capturado" exibidos.

Vamos remover o `catch` e adicionar um `finally`:

```shell
try
  echo "Tente"
  throw "Não"
  echo "Você não me verá"
finally
  echo "Finalmente"
endtry
```

Execute isso. Agora Vim exibe o erro e "Finalmente".

Vamos colocar todos juntos:

```shell
try
  echo "Tente"
  throw "Não"
catch
  echo "Capturado"
finally
  echo "Finalmente"
endtry
```

Desta vez, Vim exibe tanto "Capturado" quanto "Finalmente". Nenhum erro é exibido porque Vim o capturou.

Os erros vêm de diferentes lugares. Outra fonte de erro é chamar uma função inexistente, como `Não()` abaixo:

```shell
try
  echo "Tente"
  call Não()
catch
  echo "Capturado"
finally
  echo "Finalmente"
endtry
```

A diferença entre `catch` e `finally` é que `finally` é sempre executado, com erro ou não, enquanto um catch é executado apenas quando seu código gera um erro.

Você pode capturar erros específicos com `:catch`. De acordo com `:h :catch`:

```shell
catch /^Vim:Interrupt$/.             " capturar interrupções (CTRL-C)
catch /^Vim\\%((\\a\\+)\\)\\=:E/.    " capturar todos os erros do Vim
catch /^Vim\\%((\\a\\+)\\)\\=:/.     " capturar erros e interrupções
catch /^Vim(write):/.                " capturar todos os erros em :write
catch /^Vim\\%((\\a\\+)\\)\\=:E123:/ " capturar erro E123
catch /minha-exceção/.                " capturar exceção do usuário
catch /.*/                           " capturar tudo
catch.                               " o mesmo que /.*/
```

Dentro de um bloco `try`, uma interrupção é considerada um erro capturável.

```shell
try
  catch /^Vim:Interrupt$/
  sleep 100
endtry
```

No seu vimrc, se você usar um esquema de cores personalizado, como [gruvbox](https://github.com/morhetz/gruvbox), e acidentalmente excluir o diretório do esquema de cores, mas ainda tiver a linha `colorscheme gruvbox` no seu vimrc, Vim lançará um erro quando você `source` ele. Para corrigir isso, eu adicionei isso no meu vimrc:

```shell
try
  colorscheme gruvbox
catch
  colorscheme default
endtry
```

Agora, se você `source` o vimrc sem o diretório `gruvbox`, Vim usará o `colorscheme default`.

## Aprenda Condicionais da Maneira Inteligente

No capítulo anterior, você aprendeu sobre os tipos de dados básicos do Vim. Neste capítulo, você aprendeu como combiná-los para escrever programas básicos usando condicionais e loops. Estes são os blocos de construção da programação.

A seguir, vamos aprender sobre escopos de variáveis.