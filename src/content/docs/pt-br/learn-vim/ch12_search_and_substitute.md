---
description: Este capítulo aborda busca e substituição no Vim, utilizando expressões
  regulares para facilitar a edição de textos com sensibilidade a maiúsculas e minúsculas.
title: Ch12. Search and Substitute
---

Este capítulo aborda dois conceitos separados, mas relacionados: buscar e substituir. Muitas vezes, ao editar, você precisa buscar múltiplos textos com base em seus padrões de menor denominador comum. Ao aprender a usar expressões regulares em busca e substituição em vez de strings literais, você será capaz de direcionar qualquer texto rapidamente.

Como observação, neste capítulo, usarei `/` ao falar sobre busca. Tudo que você pode fazer com `/` também pode ser feito com `?`.

## Sensibilidade de Caso Inteligente

Pode ser complicado tentar corresponder ao caso do termo de busca. Se você está buscando o texto "Learn Vim", pode facilmente digitar incorretamente o caso de uma letra e obter um resultado de busca falso. Não seria mais fácil e seguro se você pudesse corresponder a qualquer caso? É aqui que a opção `ignorecase` brilha. Basta adicionar `set ignorecase` no seu vimrc e todos os seus termos de busca se tornam insensíveis a maiúsculas e minúsculas. Agora você não precisa mais fazer `/Learn Vim`, `/learn vim` funcionará.

No entanto, há momentos em que você precisa buscar uma frase específica em termos de caso. Uma maneira de fazer isso é desativar a opção `ignorecase` executando `set noignorecase`, mas isso dá muito trabalho para ligar e desligar toda vez que você precisa buscar uma frase sensível a maiúsculas e minúsculas.

Para evitar alternar `ignorecase`, o Vim tem uma opção `smartcase` para buscar uma string insensível a maiúsculas e minúsculas se o padrão de busca *contiver pelo menos um caractere maiúsculo*. Você pode combinar `ignorecase` e `smartcase` para realizar uma busca insensível a maiúsculas e minúsculas quando você digita todos os caracteres em minúsculas e uma busca sensível a maiúsculas e minúsculas quando você digita um ou mais caracteres maiúsculos.

Dentro do seu vimrc, adicione:

```shell
set ignorecase smartcase
```

Se você tiver esses textos:

```shell
hello
HELLO
Hello
```

- `/hello` corresponde a "hello", "HELLO" e "Hello".
- `/HELLO` corresponde apenas a "HELLO".
- `/Hello` corresponde apenas a "Hello".

Há uma desvantagem. E se você precisar buscar apenas uma string em minúsculas? Quando você faz `/hello`, o Vim agora faz uma busca insensível a maiúsculas e minúsculas. Você pode usar o padrão `\C` em qualquer lugar no seu termo de busca para dizer ao Vim que o termo de busca subsequente será sensível a maiúsculas e minúsculas. Se você fizer `/\Chello`, ele corresponderá estritamente a "hello", não a "HELLO" ou "Hello".

## Primeiro e Último Caractere em uma Linha

Você pode usar `^` para corresponder ao primeiro caractere em uma linha e `$` para corresponder ao último caractere em uma linha.

Se você tiver este texto:

```shell
hello hello
```

Você pode direcionar o primeiro "hello" com `/^hello`. O caractere que segue `^` deve ser o primeiro caractere em uma linha. Para direcionar o último "hello", execute `/hello$`. O caractere antes de `$` deve ser o último caractere em uma linha.

Se você tiver este texto:

```shell
hello hello friend
```

Executar `/hello$` não corresponderá a nada porque "friend" é o último termo naquela linha, não "hello".

## Repetindo Busca

Você pode repetir a busca anterior com `//`. Se você acabou de buscar por `/hello`, executar `//` é equivalente a executar `/hello`. Este atalho pode economizar algumas teclas, especialmente se você acabou de buscar uma string longa. Também lembre-se de que você pode usar `n` e `N` para repetir a última busca na mesma direção e na direção oposta, respectivamente.

E se você quiser lembrar rapidamente *n* termos de busca anteriores? Você pode percorrer rapidamente o histórico de busca pressionando primeiro `/`, depois pressionando as teclas de seta `cima`/`baixo` (ou `Ctrl-N`/`Ctrl-P`) até encontrar o termo de busca que você precisa. Para ver todo o seu histórico de busca, você pode executar `:history /`.

Quando você chega ao final de um arquivo enquanto busca, o Vim lança um erro: `"Search hit the BOTTOM without match for: {your-search}"`. Às vezes, isso pode ser uma boa proteção contra buscas excessivas, mas outras vezes você quer voltar a buscar do topo novamente. Você pode usar a opção `set wrapscan` para fazer o Vim buscar de volta ao topo do arquivo quando você chega ao final do arquivo. Para desativar esse recurso, faça `set nowrapscan`.

## Buscando Palavras Alternativas

É comum buscar por múltiplas palavras ao mesmo tempo. Se você precisar buscar *ou* "hello vim" ou "hola vim", mas não "salve vim" ou "bonjour vim", você pode usar o padrão `|`.

Dado este texto:

```shell
hello vim
hola vim
salve vim
bonjour vim
```

Para corresponder tanto "hello" quanto "hola", você pode fazer `/hello\|hola`. Você precisa escapar (`\`) o operador ou (`|`), caso contrário, o Vim buscará literalmente a string "|".

Se você não quiser digitar `\|` toda vez, você pode usar a sintaxe `magic` (`\v`) no início da busca: `/\vhello|hola`. Eu não abordarei `magic` neste guia, mas com `\v`, você não precisa escapar mais os caracteres especiais. Para saber mais sobre `\v`, sinta-se à vontade para conferir `:h \v`.

## Definindo o Início e o Fim de uma Correspondência

Talvez você precise buscar um texto que seja parte de uma palavra composta. Se você tiver esses textos:

```shell
11vim22
vim22
11vim
vim
```

Se você precisar selecionar "vim" mas apenas quando começa com "11" e termina com "22", você pode usar os operadores `\zs` (início da correspondência) e `\ze` (fim da correspondência). Execute:

```shell
/11\zsvim\ze22
```

O Vim ainda precisa corresponder ao padrão completo "11vim22", mas apenas destaca o padrão entre `\zs` e `\ze`. Outro exemplo:

```shell
foobar
foobaz
```

Se você precisar corresponder ao "foo" em "foobaz" mas não em "foobar", execute:

```shell
/foo\zebaz
```

## Buscando Intervalos de Caracteres

Todos os seus termos de busca até este ponto foram uma busca literal de palavras. Na vida real, você pode precisar usar um padrão geral para encontrar seu texto. O padrão mais básico é o intervalo de caracteres, `[ ]`.

Se você precisar buscar qualquer dígito, provavelmente não quer digitar `/0\|1\|2\|3\|4\|5\|6\|7\|8\|9\|0` toda vez. Em vez disso, use `/[0-9]` para corresponder a um único dígito. A expressão `0-9` representa um intervalo de números de 0 a 9 que o Vim tentará corresponder, então se você estiver procurando por dígitos entre 1 a 5, use `/[1-5]`.

Dígitos não são os únicos tipos de dados que o Vim pode procurar. Você também pode fazer `/[a-z]` para buscar alfas minúsculas e `/[A-Z]` para buscar alfas maiúsculas.

Você pode combinar esses intervalos. Se você precisar buscar dígitos de 0 a 9 e tanto alfas minúsculas quanto alfas maiúsculas de "a" a "f" (como um hexadecimal), você pode fazer `/[0-9a-fA-F]`.

Para fazer uma busca negativa, você pode adicionar `^` dentro dos colchetes de intervalo de caracteres. Para buscar um não-dígito, execute `/[^0-9]`. O Vim corresponderá a qualquer caractere desde que não seja um dígito. Cuidado que o acento circunflexo (`^`) dentro dos colchetes é diferente do acento circunflexo no início de uma linha (ex: `/^hello`). Se um acento circunflexo estiver fora de um par de colchetes e for o primeiro caractere no termo de busca, significa "o primeiro caractere em uma linha". Se um acento circunflexo estiver dentro de um par de colchetes e for o primeiro caractere dentro dos colchetes, significa um operador de busca negativa. `/^abc` corresponde ao primeiro "abc" em uma linha e `/[^abc]` corresponde a qualquer caractere exceto "a", "b" ou "c".

## Buscando Caracteres Repetidos

Se você precisar buscar por dígitos duplos neste texto:

```shell
1aa
11a
111
```

Você pode usar `/[0-9][0-9]` para corresponder a um caractere de dois dígitos, mas esse método não é escalável. E se você precisar corresponder a vinte dígitos? Digitar `[0-9]` vinte vezes não é uma experiência divertida. É por isso que você precisa de um argumento `count`.

Você pode passar `count` para sua busca. Ele tem a seguinte sintaxe:

```shell
{n,m}
```

A propósito, essas chaves de `count` precisam ser escapadas quando você as usa no Vim. O operador `count` é colocado após um único caractere que você deseja incrementar.

Aqui estão as quatro variações diferentes da sintaxe de `count`:
- `{n}` é uma correspondência exata. `/[0-9]\{2\}` corresponde aos números de dois dígitos: "11" e o "11" em "111".
- `{n,m}` é uma correspondência de intervalo. `/[0-9]\{2,3\}` corresponde a números de 2 a 3 dígitos: "11" e "111".
- `{,m}` é uma correspondência até. `/[0-9]\{,3\}` corresponde a números de até 3 dígitos: "1", "11" e "111".
- `{n,}` é uma correspondência de pelo menos. `/[0-9]\{2,\}` corresponde a números de 2 ou mais dígitos: "11" e "111".

Os argumentos de contagem `\{0,\}` (zero ou mais) e `\{1,\}` (um ou mais) são padrões de busca comuns e o Vim tem operadores especiais para eles: `*` e `+` (`+` precisa ser escapado enquanto `*` funciona bem sem a escapada). Se você fizer `/[0-9]*`, é o mesmo que `/[0-9]\{0,\}`. Ele busca por zero ou mais dígitos. Ele corresponderá a "", "1", "123". A propósito, também corresponderá a não-dígitos como "a", porque tecnicamente há zero dígito na letra "a". Pense cuidadosamente antes de usar `*`. Se você fizer `/[0-9]\+`, é o mesmo que `/[0-9]\{1,\}`. Ele busca por um ou mais dígitos. Ele corresponderá a "1" e "12".

## Intervalos de Caracteres Predefinidos

O Vim tem intervalos predefinidos para caracteres comuns, como dígitos e alfas. Eu não vou passar por todos aqui, mas você pode encontrar a lista completa dentro de `:h /character-classes`. Aqui estão os úteis:

```shell
\d    Dígito [0-9]
\D    Não-dígito [^0-9]
\s    Caractere de espaço em branco (espaço e tabulação)
\S    Caractere não-espaço em branco (tudo exceto espaço e tabulação)
\w    Caractere de palavra [0-9A-Za-z_]
\l    Alfas minúsculas [a-z]
\u    Caractere maiúsculo [A-Z]
```

Você pode usá-los como usaria intervalos de caracteres. Para buscar qualquer único dígito, em vez de usar `/[0-9]`, você pode usar `/\d` para uma sintaxe mais concisa.

## Exemplo de Busca: Capturando um Texto Entre um Par de Caracteres Similares

Se você quiser buscar uma frase cercada por um par de aspas duplas:

```shell
"Vim é incrível!"
```

Execute isto:

```shell
/"[^"]\+"
```

Vamos analisar:
- `"` é uma aspa dupla literal. Ela corresponde à primeira aspa dupla.
- `[^"]` significa qualquer caractere exceto uma aspa dupla. Ela corresponde a qualquer caractere alfanumérico e de espaço em branco, desde que não seja uma aspa dupla.
- `\+` significa um ou mais. Como é precedido por `[^"]`, o Vim procura por um ou mais caracteres que não sejam uma aspa dupla.
- `"` é uma aspa dupla literal. Ela corresponde à aspa dupla de fechamento.

Quando o Vim vê a primeira `"`, ele começa a captura do padrão. No momento em que vê a segunda aspa dupla em uma linha, ele corresponde ao segundo padrão `"` e para a captura do padrão. Enquanto isso, todos os caracteres que não são aspas duplas entre eles são capturados pelo padrão `[^"]\+`, neste caso, a frase `Vim é incrível!`. Este é um padrão comum para capturar uma frase cercada por um par de delimitadores semelhantes.

- Para capturar uma frase cercada por aspas simples, você pode usar `/'[^']\+'`.
- Para capturar uma frase cercada por zeros, você pode usar `/0[^0]\+0`.

## Exemplo de Busca: Capturando um Número de Telefone

Se você quiser corresponder a um número de telefone dos EUA separado por um hífen (`-`), como `123-456-7890`, você pode usar:

```shell
/\d\{3\}-\d\{3\}-\d\{4\}
```

Um número de telefone dos EUA consiste em um conjunto de três dígitos, seguido por mais três dígitos e, finalmente, por quatro dígitos. Vamos analisar:
- `\d\{3\}` corresponde a um dígito repetido exatamente três vezes
- `-` é um hífen literal

Você pode evitar digitar escapes com `\v`:

```shell
/\v\d{3}-\d{3}-\d{4}
```

Este padrão também é útil para capturar quaisquer dígitos repetidos, como endereços IP e códigos postais.

Isso cobre a parte de busca deste capítulo. Agora vamos passar para substituição.

## Substituição Básica

O comando de substituição do Vim é um comando útil para rapidamente encontrar e substituir qualquer padrão. A sintaxe de substituição é:

```shell
:s/{padrão-antigo}/{padrão-novo}/
```

Vamos começar com um uso básico. Se você tiver este texto:

```shell
vim é bom
```

Vamos substituir "bom" por "incrível" porque o Vim é incrível. Execute `:s/bom/incrível/`. Você deve ver:

```shell
vim é incrível
```
## Repetindo a Última Substituição

Você pode repetir o último comando de substituição com o comando normal `&` ou executando `:s`. Se você acabou de executar `:s/good/awesome/`, rodar `&` ou `:s` irá repeti-lo.

Além disso, anteriormente neste capítulo, mencionei que você pode usar `//` para repetir o padrão de busca anterior. Esse truque funciona com o comando de substituição. Se `/good` foi feito recentemente e você deixar o primeiro argumento do padrão de substituição em branco, como em `:s//awesome/`, funcionará da mesma forma que executar `:s/good/awesome/`.

## Intervalo de Substituição

Assim como muitos comandos Ex, você pode passar um argumento de intervalo para o comando de substituição. A sintaxe é:

```shell
:[range]s/old/new/
```

Se você tiver essas expressões:

```shell
let one = 1;
let two = 2;
let three = 3;
let four = 4;
let five = 5;
```

Para substituir "let" por "const" nas linhas três a cinco, você pode fazer:

```shell
:3,5s/let/const/
```

Aqui estão algumas variações de intervalo que você pode passar:

- `:,3s/let/const/` - se nada for dado antes da vírgula, representa a linha atual. Substitui da linha atual até a linha 3.
- `:1,s/let/const/` - se nada for dado após a vírgula, também representa a linha atual. Substitui da linha 1 até a linha atual.
- `:3s/let/const/` - se apenas um valor for dado como intervalo (sem vírgula), faz a substituição apenas nessa linha.

No Vim, `%` geralmente significa o arquivo inteiro. Se você executar `:%s/let/const/`, fará a substituição em todas as linhas. Lembre-se dessa sintaxe de intervalo. Muitos comandos de linha de comando que você aprenderá nos próximos capítulos seguirão essa forma.

## Correspondência de Padrões

As próximas seções cobrirão expressões regulares básicas. Um bom conhecimento de padrões é essencial para dominar o comando de substituição.

Se você tiver as seguintes expressões:

```shell
let one = 1;
let two = 2;
let three = 3;
let four = 4;
let five = 5;
```

Para adicionar um par de aspas duplas ao redor dos dígitos:

```shell
:%s/\d/"\0"/
```

O resultado:

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Vamos analisar o comando:
- `:%s` direciona o arquivo inteiro para realizar a substituição.
- `\d` é o intervalo pré-definido do Vim para dígitos (semelhante a usar `[0-9]`).
- `"\0"` aqui as aspas duplas são aspas duplas literais. `\0` é um caractere especial que representa "todo o padrão correspondente". O padrão correspondente aqui é um único dígito, `\d`.

Alternativamente, `&` também representa todo o padrão correspondente como `\0`. `:s/\d/"&"/` também funcionaria.

Vamos considerar outro exemplo. Dadas essas expressões e você precisa trocar todos os "let" pelos nomes das variáveis.

```shell
one let = "1";
two let = "2";
three let = "3";
four let = "4";
five let = "5";
```

Para fazer isso, execute:

```shell
:%s/\(\w\+\) \(\w\+\)/\2 \1/
```

O comando acima contém muitos barras invertidas e é difícil de ler. Nesse caso, é mais conveniente usar o operador `\v`:

```shell
:%s/\v(\w+) (\w+)/\2 \1/
```

O resultado:

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Ótimo! Vamos analisar esse comando:
- `:%s` direciona todas as linhas do arquivo para realizar a substituição.
- `(\w+) (\w+)` é uma correspondência de grupo. `\w` é um dos intervalos pré-definidos do Vim para um caractere de palavra (`[0-9A-Za-z_]`). Os `( )` ao redor capturam uma correspondência de caractere de palavra em um grupo. Note o espaço entre os dois agrupamentos. `(\w+) (\w+)` captura dois grupos. O primeiro grupo captura "one" e o segundo grupo captura "two".
- `\2 \1` retorna o grupo capturado em uma ordem invertida. `\2` contém a string capturada "let" e `\1` a string "one". Ter `\2 \1` retorna a string "let one".

Lembre-se que `\0` representa todo o padrão correspondente. Você pode dividir a string correspondente em grupos menores com `( )`. Cada grupo é representado por `\1`, `\2`, `\3`, etc.

Vamos fazer mais um exemplo para solidificar esse conceito de correspondência de grupo. Se você tiver esses números:

```shell
123
456
789
```

Para inverter a ordem, execute:

```shell
:%s/\v(\d)(\d)(\d)/\3\2\1/
```

O resultado é:

```shell
321
654
987
```

Cada `(\d)` corresponde a cada dígito e cria um grupo. Na primeira linha, o primeiro `(\d)` tem o valor de 1, o segundo `(\d)` tem o valor de 2, e o terceiro `(\d)` tem o valor de 3. Eles são armazenados nas variáveis `\1`, `\2`, e `\3`. Na segunda metade da sua substituição, o novo padrão `\3\2\1` resulta no valor "321" na linha um.

Se você tivesse executado isso em vez disso:

```shell
:%s/\v(\d\d)(\d)/\2\1/
```
Você teria obtido um resultado diferente:

```shell
312
645
978
```

Isso acontece porque agora você tem apenas dois grupos. O primeiro grupo, capturado por `(\d\d)`, é armazenado dentro de `\1` e tem o valor de 12. O segundo grupo, capturado por `(\d)`, é armazenado dentro de `\2` e tem o valor de 3. `\2\1` então, retorna 312.

## Flags de Substituição

Se você tiver a frase:

```shell
chocolate pancake, strawberry pancake, blueberry pancake
```

Para substituir todos os pancakes por donuts, você não pode apenas executar:

```shell
:s/pancake/donut
```

O comando acima substituirá apenas a primeira correspondência, resultando em:

```shell
chocolate donut, strawberry pancake, blueberry pancake
```

Existem duas maneiras de resolver isso. Você pode executar o comando de substituição mais duas vezes ou pode passar uma flag global (`g`) para substituir todas as correspondências em uma linha.

Vamos falar sobre a flag global. Execute:

```shell
:s/pancake/donut/g
```

O Vim substitui todos os pancakes por donuts em um único comando. O comando global é uma das várias flags que o comando de substituição aceita. Você passa flags no final do comando de substituição. Aqui está uma lista de flags úteis:

```shell
&    Reutiliza as flags do comando de substituição anterior.
g    Substitui todas as correspondências na linha.
c    Pergunta pela confirmação de substituição.
e    Impede que a mensagem de erro seja exibida quando a substituição falha.
i    Realiza a substituição sem diferenciar maiúsculas de minúsculas.
I    Realiza a substituição diferenciando maiúsculas de minúsculas.
```

Existem mais flags que não listei acima. Para ler sobre todas as flags, confira `:h s_flags`.

A propósito, os comandos de repetição de substituição (`&` e `:s`) não mantêm as flags. Executar `&` apenas repetirá `:s/pancake/donut/` sem `g`. Para repetir rapidamente o último comando de substituição com todas as flags, execute `:&&`.

## Mudando o Delimitador

Se você precisa substituir uma URL por um caminho longo:

```shell
https://mysite.com/a/b/c/d/e
```

Para substituí-lo pela palavra "hello", execute:

```shell
:s/https:\/\/mysite.com\/a\/b\/c\/d\/e/hello/
```

No entanto, é difícil saber quais barras (`/`) fazem parte do padrão de substituição e quais são os delimitadores. Você pode mudar o delimitador por qualquer caractere de byte único (exceto por letras, números, ou `"`, `|`, e `\`). Vamos substituí-los por `+`. O comando de substituição acima pode ser reescrito como:

```shell
:s+https:\/\/mysite.com\/a\/b\/c\/d\/e+hello+
```

Agora é mais fácil ver onde estão os delimitadores.

## Substituição Especial

Você também pode modificar a caixa do texto que está substituindo. Dadas as seguintes expressões e sua tarefa é colocar em maiúsculas as variáveis "one", "two", "three", etc.

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Execute:

```shell
:%s/\v(\w+) (\w+)/\1 \U\2/
```

Você obterá:

```shell
let ONE = "1";
let TWO = "2";
let THREE = "3";
let FOUR = "4";
let FIVE = "5";
```

A análise:
- `(\w+) (\w+)` captura os dois primeiros grupos correspondentes, como "let" e "one".
- `\1` retorna o valor do primeiro grupo, "let".
- `\U\2` coloca em maiúsculas (`\U`) o segundo grupo (`\2`).

O truque desse comando é a expressão `\U\2`. `\U` instrui o caractere seguinte a ser colocado em maiúsculas.

Vamos fazer mais um exemplo. Suponha que você esteja escrevendo um guia do Vim e precise capitalizar a primeira letra de cada palavra em uma linha.

```shell
vim is the greatest text editor in the whole galaxy
```

Você pode executar:

```shell
:s/\<./\U&/g
```

O resultado:

```shell
Vim Is The Greatest Text Editor In The Whole Galaxy
```

Aqui estão as análises:
- `:s` substitui a linha atual.
- `\<.` é composta por duas partes: `\<` para corresponder ao início de uma palavra e `.` para corresponder a qualquer caractere. O operador `\<` faz com que o caractere seguinte seja o primeiro caractere de uma palavra. Como `.` é o próximo caractere, ele corresponderá ao primeiro caractere de qualquer palavra.
- `\U&` coloca em maiúsculas o símbolo subsequente, `&`. Lembre-se que `&` (ou `\0`) representa toda a correspondência. Ele corresponde ao primeiro caractere de qualquer palavra.
- `g` a flag global. Sem ela, esse comando substitui apenas a primeira correspondência. Você precisa substituir cada correspondência nesta linha.

Para aprender mais sobre os símbolos de substituição especiais, como `\U`, confira `:h sub-replace-special`.

## Padrões Alternativos

Às vezes, você precisa corresponder a múltiplos padrões simultaneamente. Se você tiver as seguintes saudações:

```shell
hello vim
hola vim
salve vim
bonjour vim
```

Você precisa substituir a palavra "vim" por "friend", mas apenas nas linhas que contêm a palavra "hello" ou "hola". Lembre-se do que foi dito anteriormente neste capítulo, você pode usar `|` para múltiplos padrões alternativos.

```shell
:%s/\v(hello|hola) vim/\1 friend/g
```

O resultado:

```shell
hello friend
hola friend
salve vim
bonjour vim
```

Aqui está a análise:
- `%s` executa o comando de substituição em cada linha de um arquivo.
- `(hello|hola)` corresponde *a qualquer* "hello" ou "hola" e considera como um grupo.
- `vim` é a palavra literal "vim".
- `\1` é o primeiro grupo, que é o texto "hello" ou "hola".
- `friend` é a palavra literal "friend".

## Substituindo o Início e o Fim de um Padrão

Lembre-se que você pode usar `\zs` e `\ze` para definir o início e o fim de uma correspondência. Essa técnica também funciona na substituição. Se você tiver:

```shell
chocolate pancake
strawberry sweetcake
blueberry hotcake
```

Para substituir o "cake" em "hotcake" por "dog" para obter um "hotdog":

```shell
:%s/hot\zscake/dog/g
```

Resultado:

```shell
chocolate pancake
strawberry sweetcake
blueberry hotdog
```
## Ganancioso e Não Ganancioso

Você pode substituir a enésima correspondência em uma linha com este truque:

```shell
One Mississippi, two Mississippi, three Mississippi, four Mississippi, five Mississippi.
```

Para substituir o terceiro "Mississippi" por "Arkansas", execute:

```shell
:s/\v(.{-}\zsMississippi){3}/Arkansas/g
```

A explicação:
- `:s/` é o comando de substituição.
- `\v` é a palavra-chave mágica para que você não precise escapar palavras-chave especiais.
- `.` corresponde a qualquer caractere único.
- `{-}` realiza uma correspondência não gananciosa de 0 ou mais do átomo anterior.
- `\zsMississippi` faz com que "Mississippi" seja o início da correspondência.
- `(...){3}` procura a terceira correspondência.

Você já viu a sintaxe `{3}` anteriormente neste capítulo. Neste caso, `{3}` corresponderá exatamente à terceira correspondência. O novo truque aqui é `{-}`. É uma correspondência não gananciosa. Ela encontra a correspondência mais curta do padrão dado. Neste caso, `(.{-}Mississippi)` corresponde à menor quantidade de "Mississippi" precedida por qualquer caractere. Contraste isso com `(.*Mississippi)` onde encontra a correspondência mais longa do padrão dado.

Se você usar `(.{-}Mississippi)`, obterá cinco correspondências: "One Mississippi", "Two Mississippi", etc. Se você usar `(.*Mississippi)`, obterá uma correspondência: o último "Mississippi". `*` é um correspondedor ganancioso e `{-}` é um correspondedor não ganancioso. Para saber mais, consulte `:h /\{-` e `:h non-greedy`.

Vamos fazer um exemplo mais simples. Se você tiver a string:

```shell
abc1de1
```

Você pode corresponder "abc1de1" (ganancioso) com:

```shell
/a.*1
```

Você pode corresponder "abc1" (não ganancioso) com:

```shell
/a.\{-}1
```

Então, se você precisar colocar em maiúsculas a correspondência mais longa (gananciosa), execute:

```shell
:s/a.*1/\U&/g
```

Para obter:

```shell
ABC1DEFG1
```

Se você precisar colocar em maiúsculas a correspondência mais curta (não gananciosa), execute:

```shell
:s/a.\{-}1/\U&/g
```

Para obter:

```shell
ABC1defg1
```

Se você é novo no conceito de ganancioso vs não ganancioso, pode ser difícil entender. Experimente diferentes combinações até que você compreenda.

## Substituindo em Vários Arquivos

Finalmente, vamos aprender como substituir frases em vários arquivos. Para esta seção, suponha que você tenha dois arquivos: `food.txt` e `animal.txt`.

Dentro de `food.txt`:

```shell
corndog
hotdog
chilidog
```

Dentro de `animal.txt`:

```shell
large dog
medium dog
small dog
```

Suponha que sua estrutura de diretório pareça assim:

```shell
- food.txt
- animal.txt
```

Primeiro, capture ambos `food.txt` e `animal.txt` dentro de `:args`. Lembre-se dos capítulos anteriores que `:args` pode ser usado para criar uma lista de nomes de arquivos. Existem várias maneiras de fazer isso dentro do Vim, uma delas é executando isso de dentro do Vim:

```shell
:args *.txt                  captura todos os arquivos txt na localização atual
```

Para testar, quando você executar `:args`, deverá ver:

```shell
[food.txt] animal.txt
```

Agora que todos os arquivos relevantes estão armazenados na lista de argumentos, você pode realizar uma substituição em múltiplos arquivos com o comando `:argdo`. Execute:

```shell
:argdo %s/dog/chicken/
```

Isso realiza a substituição em todos os arquivos dentro da lista `:args`. Finalmente, salve os arquivos alterados com:

```shell
:argdo update
```

`:args` e `:argdo` são ferramentas úteis para aplicar comandos de linha de comando em vários arquivos. Experimente com outros comandos!

## Substituindo em Vários Arquivos Com Macros

Alternativamente, você também pode executar o comando de substituição em vários arquivos com macros. Execute:

```shell
:args *.txt
qq
:%s/dog/chicken/g
:wnext
q
99@q
```

A explicação:
- `:args *.txt` adiciona todos os arquivos de texto à lista `:args`.
- `qq` inicia a macro no registro "q".
- `:%s/dog/chicken/g` substitui "dog" por "chicken" em todas as linhas no arquivo atual.
- `:wnext` salva o arquivo e vai para o próximo arquivo na lista `args`.
- `q` para a gravação da macro.
- `99@q` executa a macro noventa e nove vezes. O Vim interromperá a execução da macro após encontrar o primeiro erro, então o Vim não executará a macro noventa e nove vezes.

## Aprendendo Busca e Substituição da Maneira Inteligente

A capacidade de fazer buscas bem é uma habilidade necessária na edição. Dominar a busca permite que você utilize a flexibilidade das expressões regulares para procurar qualquer padrão em um arquivo. Dedique seu tempo para aprender isso. Para melhorar com expressões regulares, você precisa estar ativamente usando expressões regulares. Uma vez li um livro sobre expressões regulares sem realmente praticar e esqueci quase tudo que li depois. Codificação ativa é a melhor maneira de dominar qualquer habilidade.

Uma boa maneira de melhorar sua habilidade de correspondência de padrões é sempre que você precisar buscar um padrão (como "hello 123"), em vez de consultar o termo de busca literal (`/hello 123`), tente criar um padrão para isso (algo como `/\v(\l+) (\d+)`). Muitos desses conceitos de expressões regulares também são aplicáveis em programação geral, não apenas ao usar o Vim.

Agora que você aprendeu sobre busca e substituição avançadas no Vim, vamos aprender um dos comandos mais versáteis, o comando global.