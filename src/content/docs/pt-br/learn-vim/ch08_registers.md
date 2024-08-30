---
description: Aprenda sobre os 10 tipos de registros do Vim e como usá-los eficientemente
  para evitar digitação repetitiva e melhorar sua produtividade.
title: Ch08. Registers
---

Aprender os registros do Vim é como aprender álgebra pela primeira vez. Você não achava que precisava até precisar.

Você provavelmente usou os registros do Vim quando copiou ou deletou um texto e depois colou com `p` ou `P`. No entanto, você sabia que o Vim tem 10 tipos diferentes de registros? Usados corretamente, os registros do Vim podem te salvar de digitações repetitivas.

Neste capítulo, vou abordar todos os tipos de registros do Vim e como usá-los de forma eficiente.

## Os Dez Tipos de Registro

Aqui estão os 10 tipos de registro do Vim:

1. O registro sem nome (`""`).
2. Os registros numerados (`"0-9`).
3. O registro de exclusão pequeno (`"-`).
4. Os registros nomeados (`"a-z`).
5. Os registros somente leitura (`":`, `".`, e `"%`).
6. O registro de arquivo alternativo (`"#`).
7. O registro de expressão (`"=`).
8. Os registros de seleção (`"*` e `"+`).
9. O registro buraco negro (`"_`).
10. O registro do último padrão de busca (`"/`).

## Operadores de Registro

Para usar registros, você precisa primeiro armazená-los com operadores. Aqui estão alguns operadores que armazenam valores em registros:

```shell
y    Yank (copiar)
c    Deletar texto e iniciar o modo de inserção
d    Deletar texto
```

Existem mais operadores (como `s` ou `x`), mas os acima são os mais úteis. A regra geral é que, se um operador pode remover um texto, provavelmente ele armazena o texto em registros.

Para colar um texto dos registros, você pode usar:

```shell
p    Cola o texto após o cursor
P    Cola o texto antes do cursor
```

Tanto `p` quanto `P` aceitam uma contagem e um símbolo de registro como argumentos. Por exemplo, para colar dez vezes, faça `10p`. Para colar o texto do registro a, faça `"ap`. Para colar o texto do registro a dez vezes, faça `10"ap`. A propósito, o `p` na verdade significa "put", não "paste", mas eu acho que colar é uma palavra mais convencional.

A sintaxe geral para obter o conteúdo de um registro específico é `"a`, onde `a` é o símbolo do registro.

## Chamando Registros do Modo de Inserção

Tudo que você aprende neste capítulo também pode ser executado no modo de inserção. Para obter o texto do registro a, normalmente você faz `"ap`. Mas se você estiver no modo de inserção, execute `Ctrl-R a`. A sintaxe para chamar registros do modo de inserção é:

```shell
Ctrl-R a
```

Onde `a` é o símbolo do registro. Agora que você sabe como armazenar e recuperar registros, vamos mergulhar!

## O Registro Sem Nome

Para obter o texto do registro sem nome, faça `""p`. Ele armazena o último texto que você copiou, alterou ou deletou. Se você fizer outro yank, alteração ou exclusão, o Vim substituirá automaticamente o texto antigo. O registro sem nome é como a operação padrão de copiar / colar de um computador.

Por padrão, `p` (ou `P`) está conectado ao registro sem nome (de agora em diante, me referirei ao registro sem nome com `p` em vez de `""p`).

## Os Registros Numerados

Os registros numerados se preenchem automaticamente em ordem crescente. Existem 2 registros numerados diferentes: o registro copiado (`0`) e os registros numerados (`1-9`). Vamos discutir primeiro o registro copiado.

### O Registro Copiado

Se você copiar uma linha inteira de texto (`yy`), o Vim na verdade salva esse texto em dois registros:

1. O registro sem nome (`p`).
2. O registro copiado (`"0p`).

Quando você copia um texto diferente, o Vim atualizará tanto o registro copiado quanto o registro sem nome. Qualquer outra operação (como deletar) não será armazenada no registro 0. Isso pode ser usado a seu favor, porque a menos que você faça outro yank, o texto copiado sempre estará lá, não importa quantas alterações e exclusões você faça.

Por exemplo, se você:
1. Copia uma linha (`yy`)
2. Deleta uma linha (`dd`)
3. Deleta outra linha (`dd`)

O registro copiado terá o texto do passo um.

Se você:
1. Copia uma linha (`yy`)
2. Deleta uma linha (`dd`)
3. Copia outra linha (`yy`)

O registro copiado terá o texto do passo três.

Uma última dica, enquanto estiver no modo de inserção, você pode colar rapidamente o texto que acabou de copiar usando `Ctrl-R 0`.

### Os Registros Numerados Não-Zero

Quando você altera ou deleta um texto que tem pelo menos uma linha de comprimento, esse texto será armazenado nos registros numerados de 1 a 9, ordenados pelo mais recente.

Por exemplo, se você tiver estas linhas:

```shell
linha três
linha dois
linha um
```

Com o cursor na "linha três", delete uma por uma com `dd`. Uma vez que todas as linhas estejam deletadas, o registro 1 deve conter "linha um" (mais recente), o registro dois "linha dois" (segundo mais recente) e o registro três "linha três" (mais antigo). Para obter o conteúdo do registro um, faça `"1p`.

Como nota lateral, esses registros numerados são automaticamente incrementados ao usar o comando ponto. Se seu registro numerado um (`"1`) contém "linha um", o registro dois (`"2`) "linha dois" e o registro três (`"3`) "linha três", você pode colá-los sequencialmente com este truque:
- Faça `"1P` para colar o conteúdo do registro numerado um ("1).
- Faça `.` para colar o conteúdo do registro numerado dois ("2).
- Faça `.` para colar o conteúdo do registro numerado três ("3).

Esse truque funciona com qualquer registro numerado. Se você começou com `"5P`,  `.`  faria `"6P`, `.` novamente faria `"7P`, e assim por diante.

Deleções pequenas como a exclusão de uma palavra (`dw`) ou alteração de palavra (`cw`) não são armazenadas nos registros numerados. Elas são armazenadas no registro de exclusão pequeno (`"-`), que discutirei a seguir.

## O Registro de Exclusão Pequeno

Alterações ou deleções de menos de uma linha não são armazenadas nos registros numerados 0-9, mas no registro de exclusão pequeno (`"-`).

Por exemplo:
1. Deletar uma palavra (`diw`)
2. Deletar uma linha (`dd`)
3. Deletar uma linha (`dd`)

`"-p` lhe dá a palavra deletada do passo um.

Outro exemplo:
1. Eu deleto uma palavra (`diw`)
2. Eu deleto uma linha (`dd`)
3. Eu deleto uma palavra (`diw`)

`"-p` lhe dá a palavra deletada do passo três. `"1p` lhe dá a linha deletada do passo dois. Infelizmente, não há como recuperar a palavra deletada do passo um porque o registro de exclusão pequeno armazena apenas um item. No entanto, se você quiser preservar o texto do passo um, pode fazê-lo com os registros nomeados.

## O Registro Nomeado

Os registros nomeados são o registro mais versátil do Vim. Ele pode armazenar textos copiados, alterados e deletados nos registros a-z. Ao contrário dos 3 tipos de registro anteriores que você viu, que armazenam automaticamente textos em registros, você precisa dizer explicitamente ao Vim para usar o registro nomeado, dando-lhe controle total.

Para copiar uma palavra no registro a, você pode fazer isso com `"ayiw`.
- `"a` diz ao Vim que a próxima ação (deletar / alterar / copiar) será armazenada no registro a.
- `yiw` copia a palavra.

Para obter o texto do registro a, execute `"ap`. Você pode usar todas as vinte e seis letras do alfabeto para armazenar vinte e seis textos diferentes com registros nomeados.

Às vezes, você pode querer adicionar ao seu registro nomeado existente. Nesse caso, você pode anexar seu texto em vez de começar tudo de novo. Para fazer isso, você pode usar a versão maiúscula desse registro. Por exemplo, suponha que você tenha a palavra "Olá " já armazenada no registro a. Se você quiser adicionar "mundo" ao registro a, pode encontrar o texto "mundo" e copiá-lo usando o registro A (`"Ayiw`).

## Os Registros Somente Leitura

O Vim tem três registros somente leitura: `.`, `:`, e `%`. Eles são bem simples de usar:

```shell
.    Armazena o último texto inserido
:    Armazena o último comando executado
%    Armazena o nome do arquivo atual
```

Se o último texto que você escreveu foi "Olá Vim", executar `".p` imprimirá o texto "Olá Vim". Se você quiser obter o nome do arquivo atual, execute `"%p`. Se você executar o comando `:s/foo/bar/g`, executar `":p` imprimirá o texto literal "s/foo/bar/g".

## O Registro de Arquivo Alternativo

No Vim, `#` geralmente representa o arquivo alternativo. Um arquivo alternativo é o último arquivo que você abriu. Para inserir o nome do arquivo alternativo, você pode usar `"#p`.

## O Registro de Expressão

O Vim tem um registro de expressão, `"=`, para avaliar expressões.

Para avaliar expressões matemáticas `1 + 1`, execute:

```shell
"=1+1<Enter>p
```

Aqui, você está dizendo ao Vim que está usando o registro de expressão com `"=`. Sua expressão é (`1 + 1`). Você precisa digitar `p` para obter o resultado. Como mencionado anteriormente, você também pode acessar o registro do modo de inserção. Para avaliar uma expressão matemática do modo de inserção, você pode fazer:

```shell
Ctrl-R =1+1
```

Você também pode obter os valores de qualquer registro através do registro de expressão quando anexado com `@`. Se você deseja obter o texto do registro a:

```shell
"=@a
```

Então pressione `<Enter>`, depois `p`. Da mesma forma, para obter valores do registro a enquanto estiver no modo de inserção:

```shell
Ctrl-r =@a
```

Expressão é um tópico vasto no Vim, então eu só cobrirei o básico aqui. Vou abordar expressões em mais detalhes em capítulos futuros sobre Vimscript.

## Os Registros de Seleção

Você não gostaria às vezes de poder copiar um texto de programas externos e colá-lo localmente no Vim, e vice-versa? Com os registros de seleção do Vim, você pode. O Vim tem dois registros de seleção: `quotestar` (`"*`) e `quoteplus` (`"+`). Você pode usá-los para acessar textos copiados de programas externos.

Se você estiver em um programa externo (como o navegador Chrome) e copiar um bloco de texto com `Ctrl-C` (ou `Cmd-C`, dependendo do seu sistema operacional), normalmente você não conseguiria usar `p` para colar o texto no Vim. No entanto, tanto o `"+` quanto o `"*` do Vim estão conectados à sua área de transferência, então você pode realmente colar o texto com `"+p` ou `"*p`. Da mesma forma, se você copiar uma palavra do Vim com `"+yiw` ou `"*yiw`, você pode colar esse texto no programa externo com `Ctrl-V` (ou `Cmd-V`). Observe que isso só funciona se o seu programa Vim vier com a opção `+clipboard` (para verificar, execute `:version`).

Você pode se perguntar se `"*` e `"+` fazem a mesma coisa, por que o Vim tem dois registros diferentes? Algumas máquinas usam o sistema de janelas X11. Este sistema tem 3 tipos de seleções: primária, secundária e área de transferência. Se sua máquina usa X11, o Vim usa a seleção *primária* do X11 com o registro `quotestar` (`"*`) e a seleção *área de transferência* do X11 com o registro `quoteplus` (`"+`). Isso só se aplica se você tiver a opção `+xterm_clipboard` disponível na sua compilação do Vim. Se o seu Vim não tiver `xterm_clipboard`, não é um grande problema. Isso apenas significa que tanto `quotestar` quanto `quoteplus` são intercambiáveis (o meu também não tem).

Eu acho que fazer `=*p` ou `=+p` (ou `"*p` ou `"+p`) é complicado. Para fazer o Vim colar o texto copiado do programa externo apenas com `p`, você pode adicionar isso no seu vimrc:

```shell
set clipboard=unnamed
```

Agora, quando eu copio um texto de um programa externo, posso colá-lo com o registro sem nome, `p`. Também posso copiar um texto do Vim e colá-lo em um programa externo. Se você tiver `+xterm_clipboard` ativado, pode querer usar as opções de área de transferência `unnamed` e `unnamedplus`.

## O Registro Buraco Negro

Cada vez que você deleta ou altera um texto, esse texto é armazenado automaticamente no registro do Vim. Haverá momentos em que você não quer salvar nada no registro. Como você pode fazer isso?

Você pode usar o registro buraco negro (`"_`). Para deletar uma linha e não ter o Vim armazenando a linha deletada em nenhum registro, use `"_dd`.

O registro buraco negro é como o `/dev/null` dos registros.

## O Registro do Último Padrão de Busca

Para colar sua última busca (`/` ou `?`), você pode usar o registro do último padrão de busca (`"/`). Para colar o último termo de busca, use `"/p`.

## Visualizando os Registros

Para visualizar todos os seus registros, use o comando `:register`. Para visualizar apenas os registros "a, "1, e "-, use `:register a 1 -`.

Há um plugin chamado [vim-peekaboo](https://github.com/junegunn/vim-peekaboo) que permite que você dê uma olhada no conteúdo dos registros quando você pressiona `"` ou `@` no modo normal e `Ctrl-R` no modo de inserção. Eu acho esse plugin muito útil porque na maioria das vezes, não consigo lembrar o conteúdo dos meus registros. Experimente!

## Executando um Registro

Os registros nomeados não são apenas para armazenar textos. Eles também podem executar macros com `@`. Eu vou abordar macros no próximo capítulo.

Lembre-se de que, como as macros são armazenadas dentro dos registros do Vim, você pode acidentalmente sobrescrever o texto armazenado com macros. Se você armazenar o texto "Olá Vim" no registro a e depois gravar uma macro no mesmo registro (`qa{sequência-da-macro}q`), essa macro irá sobrescrever seu texto "Olá Vim" armazenado anteriormente.
## Limpando um Registro

Tecnicamente, não há necessidade de limpar nenhum registro porque o próximo texto que você armazenar sob o mesmo nome de registro irá sobrescrevê-lo. No entanto, você pode limpar rapidamente qualquer registro nomeado gravando uma macro vazia. Por exemplo, se você executar `qaq`, o Vim gravará uma macro vazia no registro a.

Outra alternativa é executar o comando `:call setreg('a', 'hello register a')`, onde a é o registro a e "hello register a" é o texto que você deseja armazenar.

Mais uma maneira de limpar o registro é definir o conteúdo do "registro a" como uma string vazia com a expressão `:let @a = ''`.

## Colocando o Conteúdo de um Registro

Você pode usar o comando `:put` para colar o conteúdo de qualquer registro. Por exemplo, se você executar `:put a`, o Vim imprimirá o conteúdo do registro a abaixo da linha atual. Isso se comporta muito como `"ap`, com a diferença de que o comando de modo normal `p` imprime o conteúdo do registro após o cursor e o comando `:put` imprime o conteúdo do registro em uma nova linha.

Como `:put` é um comando de linha de comando, você pode passar um endereço. `:10put a` colará o texto do registro a abaixo da linha 10.

Um truque legal para passar `:put` com o registro buraco negro (`"_`). Como o registro buraco negro não armazena nenhum texto, `:put _` irá inserir uma linha em branco em vez disso. Você pode combinar isso com o comando global para inserir várias linhas em branco. Por exemplo, para inserir linhas em branco abaixo de todas as linhas que contêm o texto "end", execute `:g/end/put _`. Você aprenderá sobre o comando global mais tarde.

## Aprendendo Registros da Maneira Inteligente

Você chegou ao final. Parabéns! Se você está se sentindo sobrecarregado pela quantidade de informações, você não está sozinho. Quando comecei a aprender sobre os registros do Vim, havia informação demais para absorver de uma só vez.

Não acho que você deva memorizar todos os registros imediatamente. Para se tornar produtivo, você pode começar usando apenas esses 3 registros:
1. O registro não nomeado (`""`).
2. Os registros nomeados (`"a-z`).
3. Os registros numerados (`"0-9`).

Como o registro não nomeado padrão é `p` e `P`, você só precisa aprender dois registros: os registros nomeados e os registros numerados. Gradualmente aprenda mais registros quando precisar deles. Leve o seu tempo.

O ser humano médio tem uma capacidade limitada de memória de curto prazo, cerca de 5 - 7 itens de cada vez. É por isso que, na minha edição diária, eu uso apenas cerca de 5 - 7 registros nomeados. Não há como eu lembrar de todos os vinte e seis na minha cabeça. Normalmente, começo com o registro a, depois b, subindo na ordem alfabética. Experimente e faça testes para ver qual técnica funciona melhor para você.

Os registros do Vim são poderosos. Usados estrategicamente, podem poupá-lo de digitar textos repetidos inúmeras vezes. A seguir, vamos aprender sobre macros.