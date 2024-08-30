---
description: Aprenda a usar o comando global no Vim para executar comandos em várias
  linhas simultaneamente, facilitando a edição e manipulação de texto.
title: Ch13. the Global Command
---

Até agora, você aprendeu como repetir a última alteração com o comando de ponto (`.`), reproduzir ações com macros (`q`) e armazenar textos nos registros (`"`).

Neste capítulo, você aprenderá como repetir um comando de linha de comando com o comando global.

## Visão Geral do Comando Global

O comando global do Vim é usado para executar um comando de linha de comando em várias linhas simultaneamente.

A propósito, você pode ter ouvido o termo "Comandos Ex" antes. Neste guia, eu os chamo de comandos de linha de comando. Tanto os comandos Ex quanto os comandos de linha de comando são os mesmos. Eles são os comandos que começam com dois pontos (`:`). O comando de substituição no último capítulo foi um exemplo de um comando Ex. Eles são chamados de Ex porque originalmente vieram do editor de texto Ex. Continuarei a me referir a eles como comandos de linha de comando neste guia. Para uma lista completa de comandos Ex, consulte `:h ex-cmd-index`.

O comando global tem a seguinte sintaxe:

```shell
:g/padrão/comando
```

O `padrão` corresponde a todas as linhas que contêm esse padrão, semelhante ao padrão no comando de substituição. O `comando` pode ser qualquer comando de linha de comando. O comando global funciona executando `comando` em cada linha que corresponde ao `padrão`.

Se você tiver as seguintes expressões:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Para remover todas as linhas contendo "console", você pode executar:

```shell
:g/console/d
```

Resultado:

```shell
const one = 1;

const two = 2;

const three = 3;
```

O comando global executa o comando de exclusão (`d`) em todas as linhas que correspondem ao padrão "console".

Ao executar o comando `g`, o Vim faz duas varreduras no arquivo. Na primeira execução, ele verifica cada linha e marca a linha que corresponde ao padrão `/console/`. Depois que todas as linhas correspondentes são marcadas, ele vai pela segunda vez e executa o comando `d` nas linhas marcadas.

Se você quiser excluir todas as linhas contendo "const" em vez disso, execute:

```shell
:g/const/d
```

Resultado:

```shell
console.log("one: ", one);

console.log("two: ", two);

console.log("three: ", three);
```

## Correspondência Inversa

Para executar o comando global em linhas que não correspondem, você pode executar:

```shell
:g!/padrão/comando
```

ou

```shell
:v/padrão/comando
```

Se você executar `:v/console/d`, ele excluirá todas as linhas *não* contendo "console".

## Padrão

O comando global usa o mesmo sistema de padrões que o comando de substituição, então esta seção servirá como um lembrete. Sinta-se à vontade para pular para a próxima seção ou ler junto!

Se você tiver essas expressões:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Para excluir as linhas contendo "one" ou "two", execute:

```shell
:g/one\|two/d
```

Para excluir as linhas contendo qualquer dígito único, execute:

```shell
:g/[0-9]/d
```

ou

```shell
:g/\d/d
```

Se você tiver a expressão:

```shell
const oneMillion = 1000000;
const oneThousand = 1000;
const one = 1;
```

Para corresponder às linhas contendo entre três a seis zeros, execute:

```shell
:g/0\{3,6\}/d
```

## Passando um Intervalo

Você pode passar um intervalo antes do comando `g`. Aqui estão algumas maneiras de fazer isso:
- `:1,5g/console/d` corresponde à string "console" entre as linhas 1 e 5 e as exclui.
- `:,5g/console/d` se não houver endereço antes da vírgula, então começa a partir da linha atual. Ele procura pela string "console" entre a linha atual e a linha 5 e as exclui.
- `:3,g/console/d` se não houver endereço após a vírgula, então termina na linha atual. Ele procura pela string "console" entre a linha 3 e a linha atual e as exclui.
- `:3g/console/d` se você passar apenas um endereço sem uma vírgula, ele executa o comando apenas na linha 3. Ele verifica a linha 3 e a exclui se tiver a string "console".

Além de números, você também pode usar esses símbolos como intervalo:
- `.` significa a linha atual. Um intervalo de `.,3` significa entre a linha atual e a linha 3.
- `$` significa a última linha do arquivo. O intervalo `3,$` significa entre a linha 3 e a última linha.
- `+n` significa n linhas após a linha atual. Você pode usá-lo com `.` ou sem. `3,+1` ou `3,.+1` significa entre a linha 3 e a linha após a linha atual.

Se você não fornecer nenhum intervalo, por padrão, ele afeta o arquivo inteiro. Isso na verdade não é a norma. A maioria dos comandos de linha de comando do Vim é executada apenas na linha atual se você não passar nenhum intervalo. As duas exceções notáveis são os comandos global (`:g`) e de salvar (`:w`).

## Comando Normal

Você pode executar um comando normal com o comando global com o comando de linha de comando `:normal`.

Se você tiver este texto:
```shell
const one = 1
console.log("one: ", one)

const two = 2
console.log("two: ", two)

const three = 3
console.log("three: ", three)
```

Para adicionar um ";" ao final de cada linha, execute:

```shell
:g/./normal A;
```

Vamos detalhar:
- `:g` é o comando global.
- `/./` é um padrão para "linhas não vazias". Ele corresponde às linhas com pelo menos um caractere, então corresponde às linhas com "const" e "console" e não corresponde a linhas vazias.
- `normal A;` executa o comando de linha de comando `:normal`. `A;` é o comando do modo normal para inserir um ";" no final da linha.

## Executando uma Macro

Você também pode executar uma macro com o comando global. Uma macro pode ser executada com o comando `normal`. Se você tiver as expressões:

```shell
const one = 1
console.log("one: ", one);

const two = 2
console.log("two: ", two);

const three = 3
console.log("three: ", three);
```

Observe que as linhas com "const" não têm ponto e vírgula. Vamos criar uma macro para adicionar um ponto e vírgula ao final dessas linhas no registro a:

```shell
qaA;<Esc>q
```

Se você precisar de um lembrete, consulte o capítulo sobre macros. Agora execute:

```shell
:g/const/normal @a
```

Agora todas as linhas com "const" terão um ";" no final.

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Se você seguiu este passo a passo, você terá dois ponto e vírgulas na primeira linha. Para evitar isso, execute o comando global da linha dois em diante, `:2,$g/const/normal @a`.

## Comando Global Recursivo

O comando global em si é um tipo de comando de linha de comando, então você pode tecnicamente executar o comando global dentro de um comando global.

Dadas as seguintes expressões, se você quiser excluir a segunda declaração `console.log`:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Se você executar:

```shell
:g/console/g/two/d
```

Primeiro, `g` procurará as linhas contendo o padrão "console" e encontrará 3 correspondências. Então o segundo `g` procurará a linha contendo o padrão "two" entre essas três correspondências. Finalmente, ele excluirá essa correspondência.

Você também pode combinar `g` com `v` para encontrar padrões positivos e negativos. Por exemplo:

```shell
:g/console/v/two/d
```

Em vez de procurar a linha contendo o padrão "two", ele procurará as linhas *não* contendo o padrão "two".

## Mudando o Delimitador

Você pode mudar o delimitador do comando global como o comando de substituição. As regras são as mesmas: você pode usar qualquer caractere de byte único, exceto letras, números, `"`, `|` e `\`.

Para excluir as linhas contendo "console":

```shell
:g@console@d
```

Se você estiver usando o comando de substituição com o comando global, pode ter dois delimitadores diferentes:

```shell
g@one@s+const+let+g
```

Aqui o comando global procurará todas as linhas contendo "one". O comando de substituição substituirá, entre essas correspondências, a string "const" por "let".

## O Comando Padrão

O que acontece se você não especificar nenhum comando de linha de comando no comando global?

O comando global usará o comando de impressão (`:p`) para imprimir o texto da linha atual. Se você executar:

```shell
:g/console
```

Ele imprimirá na parte inferior da tela todas as linhas contendo "console".

A propósito, aqui está um fato interessante. Como o comando padrão usado pelo comando global é `p`, isso faz com que a sintaxe `g` seja:

```shell
:g/re/p
```

- `g` = o comando global
- `re` = o padrão regex
- `p` = o comando de impressão

Ele soletra *"grep"*, o mesmo `grep` da linha de comando. Isso **não** é uma coincidência. O comando `g/re/p` originalmente veio do Editor Ed, um dos editores de texto de linha originais. O comando `grep` recebeu seu nome do Ed.

Seu computador provavelmente ainda tem o editor Ed. Execute `ed` a partir do terminal (dica: para sair, digite `q`).

## Revertendo o Buffer Inteiro

Para reverter o arquivo inteiro, execute:

```shell
:g/^/m 0
```

`^` é um padrão para o início de uma linha. Use `^` para corresponder a todas as linhas, incluindo linhas vazias.

Se você precisar reverter apenas algumas linhas, passe um intervalo. Para reverter as linhas entre a linha cinco e a linha dez, execute:

```shell
:5,10g/^/m 0
```

Para saber mais sobre o comando de mover, consulte `:h :move`.

## Agregando Todos os Todos

Ao codificar, às vezes eu escreveria TODOs no arquivo que estou editando:

```shell
const one = 1;
console.log("one: ", one);
// TODO: alimentar o filhote

const two = 2;
// TODO: alimentar o filhote automaticamente
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: criar uma startup vendendo um alimentador automático para filhotes
```

Pode ser difícil acompanhar todos os TODOs criados. O Vim tem um método `:t` (copiar) para copiar todas as correspondências para um endereço. Para saber mais sobre o método de cópia, consulte `:h :copy`.

Para copiar todos os TODOs para o final do arquivo para uma inspeção mais fácil, execute:

```shell
:g/TODO/t $
```

Resultado:

```shell
const one = 1;
console.log("one: ", one);
// TODO: alimentar o filhote

const two = 2;
// TODO: alimentar o filhote automaticamente
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: criar uma startup vendendo um alimentador automático para filhotes

// TODO: alimentar o filhote
// TODO: alimentar o filhote automaticamente
// TODO: criar uma startup vendendo um alimentador automático para filhotes
```

Agora eu posso revisar todos os TODOs que criei, encontrar um tempo para fazê-los ou delegá-los a alguém, e continuar a trabalhar na minha próxima tarefa.

Se em vez de copiá-los você quiser mover todos os TODOs para o final, use o comando de mover, `:m`:

```shell
:g/TODO/m $
```

Resultado:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);

// TODO: alimentar o filhote
// TODO: alimentar o filhote automaticamente
// TODO: criar uma startup vendendo um alimentador automático para filhotes
```

## Exclusão do Buraco Negro

Lembre-se do capítulo sobre registros que textos excluídos são armazenados dentro dos registros numerados (desde que sejam suficientemente grandes). Sempre que você executa `:g/console/d`, o Vim armazena as linhas excluídas nos registros numerados. Se você excluir muitas linhas, pode rapidamente preencher todos os registros numerados. Para evitar isso, você pode sempre usar o registro do buraco negro (`"_`) para *não* armazenar suas linhas excluídas nos registros. Execute:

```shell
:g/console/d_
```

Ao passar `_` após `d`, o Vim não usará seus registros de rascunho.
## Reduzir Múltiplas Linhas Vazias para Uma Linha Vazia

Se você tem um texto com várias linhas vazias:

```shell
const one = 1;
console.log("one: ", one);


const two = 2;
console.log("two: ", two);





const three = 3;
console.log("three: ", three);
```

Você pode rapidamente reduzir as linhas vazias para uma linha vazia com:

```shell
:g/^$/,/./-1j
```

Resultado:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Normalmente, o comando global aceita a seguinte forma: `:g/pattern/command`. No entanto, você também pode executar o comando global com a seguinte forma: `:g/pattern1/,/pattern2/command`. Com isso, o Vim aplicará o `command` dentro de `pattern1` e `pattern2`.

Tendo isso em mente, vamos analisar o comando `:g/^$/,/./-1j` de acordo com `:g/pattern1/,/pattern2/command`:
- `/pattern1/` é `/^$/`. Representa uma linha vazia (uma linha sem caracteres).
- `/pattern2/` é `/./` com o modificador de linha `-1`. `/./` representa uma linha não vazia (uma linha com pelo menos um caractere). O `-1` significa a linha acima.
- `command` é `j`, o comando de junção (`:j`). Neste contexto, este comando global une todas as linhas dadas.

A propósito, se você quiser reduzir várias linhas vazias para nenhuma linha, execute isso em vez disso:

```shell
:g/^$/,/./j
```

Uma alternativa mais simples:

```shell
:g/^$/-j
```

Seu texto agora foi reduzido para:

```shell
const one = 1;
console.log("one: ", one);
const two = 2;
console.log("two: ", two);
const three = 3;
console.log("three: ", three);
```

## Ordenação Avançada

O Vim possui um comando `:sort` para ordenar as linhas dentro de um intervalo. Por exemplo:

```shell
d
b
a
e
c
```

Você pode ordená-las executando `:sort`. Se você der um intervalo, ele ordenará apenas as linhas dentro desse intervalo. Por exemplo, `:3,5sort` ordena apenas as linhas três e cinco.

Se você tiver as seguintes expressões:

```shell
const arrayB = [
  "i",
  "g",
  "h",
  "b",
  "f",
  "d",
  "e",
  "c",
  "a",
]

const arrayA = [
  "h",
  "b",
  "f",
  "d",
  "e",
  "a",
  "c",
]
```

Se você precisar ordenar os elementos dentro dos arrays, mas não os próprios arrays, você pode executar isso:

```shell
:g/\[/+1,/\]/-1sort
```

Resultado:

```shell
const arrayB = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
]

const arrayA = [
  "a"
  "b",
  "c",
  "d",
  "e",
  "f",
  "h",
]
```

Isso é ótimo! Mas o comando parece complicado. Vamos analisá-lo. Este comando também segue a forma `:g/pattern1/,/pattern2/command`.

- `:g` é o padrão do comando global.
- `/\[/+1` é o primeiro padrão. Ele corresponde a um colchete esquerdo literal "[". O `+1` refere-se à linha abaixo dele.
- `/\]/-1` é o segundo padrão. Ele corresponde a um colchete direito literal "]". O `-1` refere-se à linha acima dele.
- `/\[/+1,/\]/-1` refere-se então a qualquer linha entre "[" e "]".
- `sort` é um comando de linha de comando para ordenar.

## Aprenda o Comando Global da Maneira Inteligente

O comando global executa o comando de linha de comando contra todas as linhas correspondentes. Com ele, você só precisa executar um comando uma vez e o Vim fará o resto por você. Para se tornar proficiente no comando global, duas coisas são necessárias: um bom vocabulário de comandos de linha de comando e um conhecimento de expressões regulares. À medida que você passa mais tempo usando o Vim, você naturalmente aprenderá mais comandos de linha de comando. O conhecimento de expressões regulares exigirá uma abordagem mais ativa. Mas uma vez que você se sinta confortável com expressões regulares, você estará à frente de muitos.

Alguns dos exemplos aqui são complicados. Não se intimide. Realmente leve seu tempo para entendê-los. Aprenda a ler os padrões. Não desista.

Sempre que você precisar executar vários comandos, pause e veja se pode usar o comando `g`. Identifique o melhor comando para o trabalho e escreva um padrão para direcionar o maior número de coisas de uma só vez.

Agora que você sabe quão poderoso é o comando global, vamos aprender a usar os comandos externos para aumentar seu arsenal de ferramentas.