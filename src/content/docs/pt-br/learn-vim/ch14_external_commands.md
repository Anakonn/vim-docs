---
description: Aprenda a integrar comandos externos no Vim usando o comando bang (`!`),
  permitindo ler, escrever e executar comandos diretamente no editor.
title: Ch14. External Commands
---

Dentro do sistema Unix, você encontrará muitos pequenos comandos hiper-especializados que fazem uma coisa (e fazem bem). Você pode encadear esses comandos para trabalhar juntos e resolver um problema complexo. Não seria ótimo se você pudesse usar esses comandos de dentro do Vim?

Definitivamente. Neste capítulo, você aprenderá como estender o Vim para trabalhar perfeitamente com comandos externos.

## O Comando Bang

O Vim tem um comando bang (`!`) que pode fazer três coisas:

1. Ler o STDOUT de um comando externo no buffer atual.
2. Escrever o conteúdo do seu buffer como STDIN para um comando externo.
3. Executar um comando externo de dentro do Vim.

Vamos passar por cada um deles.

## Lendo o STDOUT de um Comando no Vim

A sintaxe para ler o STDOUT de um comando externo no buffer atual é:

```shell
:r !cmd
```

`:r` é o comando de leitura do Vim. Se você usá-lo sem `!`, pode usá-lo para obter o conteúdo de um arquivo. Se você tiver um arquivo `file1.txt` no diretório atual e executar:

```shell
:r file1.txt
```

O Vim colocará o conteúdo de `file1.txt` no buffer atual.

Se você executar o comando `:r` seguido de um `!` e um comando externo, a saída desse comando será inserida no buffer atual. Para obter o resultado do comando `ls`, execute:

```shell
:r !ls
```

Ele retorna algo como:

```shell
file1.txt
file2.txt
file3.txt
```

Você pode ler os dados do comando `curl`:

```shell
:r !curl -s 'https://jsonplaceholder.typicode.com/todos/1'
```

O comando `r` também aceita um endereço:

```shell
:10r !cat file1.txt
```

Agora o STDOUT da execução de `cat file1.txt` será inserido após a linha 10.

## Escrevendo o Conteúdo do Buffer em um Comando Externo

O comando `:w`, além de salvar um arquivo, pode ser usado para passar o texto no buffer atual como STDIN para um comando externo. A sintaxe é:

```shell
:w !cmd
```

Se você tiver essas expressões:

```shell
console.log("Hello Vim");
console.log("Vim is awesome");
```

Certifique-se de ter o [node](https://nodejs.org/en/) instalado na sua máquina, então execute:

```shell
:w !node
```

O Vim usará `node` para executar as expressões JavaScript e imprimir "Hello Vim" e "Vim is awesome".

Ao usar o comando `:w`, o Vim usa todos os textos no buffer atual, semelhante ao comando global (a maioria dos comandos de linha de comando, se você não passar um intervalo, executa o comando apenas na linha atual). Se você passar `:w` um endereço específico:

```shell
:2w !node
```

O Vim usará apenas o texto da segunda linha no interpretador `node`.

Há uma diferença sutil, mas significativa, entre `:w !node` e `:w! node`. Com `:w !node`, você está "escrevendo" o texto no buffer atual no comando externo `node`. Com `:w! node`, você está forçando a gravação de um arquivo e nomeando o arquivo como "node".

## Executando um Comando Externo

Você pode executar um comando externo de dentro do Vim com o comando bang. A sintaxe é:

```shell
:!cmd
```

Para ver o conteúdo do diretório atual no formato longo, execute:

```shell
:!ls -ls
```

Para matar um processo que está rodando no PID 3456, você pode executar:

```shell
:!kill -9 3456
```

Você pode executar qualquer comando externo sem sair do Vim, para que possa se manter focado em sua tarefa.

## Filtrando Textos

Se você der a `!` um intervalo, ele pode ser usado para filtrar textos. Suponha que você tenha os seguintes textos:

```shell
hello vim
hello vim
```

Vamos colocar a linha atual em maiúsculas usando o comando `tr` (traduzir). Execute:

```shell
:.!tr '[:lower:]' '[:upper:]'
```

O resultado:

```shell
HELLO VIM
hello vim
```

A explicação:
- `.!` executa o comando de filtro na linha atual.
- `tr '[:lower:]' '[:upper:]'` chama o comando `tr` para substituir todos os caracteres minúsculos por maiúsculos.

É imperativo passar um intervalo para executar o comando externo como um filtro. Se você tentar executar o comando acima sem o `.` (`:!tr '[:lower:]' '[:upper:]'`), verá um erro.

Vamos supor que você precise remover a segunda coluna em ambas as linhas com o comando `awk`:

```shell
:%!awk "{print $1}"
```

O resultado:

```shell
hello
hello
```

A explicação:
- `:%!` executa o comando de filtro em todas as linhas (`%`).
- `awk "{print $1}"` imprime apenas a primeira coluna da correspondência.

Você pode encadear vários comandos com o operador de encadeamento (`|`) assim como no terminal. Vamos supor que você tenha um arquivo com esses deliciosos itens de café da manhã:

```shell
name price
chocolate pancake 10
buttermilk pancake 9
blueberry pancake 12
```

Se você precisar classificá-los com base no preço e exibir apenas o menu com espaçamento uniforme, pode executar:

```shell
:%!awk 'NR > 1' | sort -nk 3 | column -t
```

O resultado:
```shell
buttermilk pancake 9
chocolate pancake 10
blueberry pancake 12
```

A explicação:
- `:%!` aplica o filtro a todas as linhas (`%`).
- `awk 'NR > 1'` exibe os textos apenas a partir da linha número dois.
- `|` encadeia o próximo comando.
- `sort -nk 3` classifica numericamente (`n`) usando os valores da coluna 3 (`k 3`).
- `column -t` organiza o texto com espaçamento uniforme.

## Comando do Modo Normal

O Vim tem um operador de filtro (`!`) no modo normal. Se você tiver as seguintes saudações:

```shell
hello vim
hola vim
bonjour vim
salve vim
```

Para colocar a linha atual e a linha abaixo em maiúsculas, você pode executar:
```shell
!jtr '[a-z]' '[A-Z]'
```

A explicação:
- `!j` executa o operador de filtro de comando normal (`!`) direcionando a linha atual e a linha abaixo. Lembre-se de que, como é um operador do modo normal, a regra gramatical `verbo + substantivo` se aplica. `!` é o verbo e `j` é o substantivo.
- `tr '[a-z]' '[A-Z]'` substitui as letras minúsculas por letras maiúsculas.

O comando de filtro normal só funciona em movimentos / objetos de texto que têm pelo menos uma linha ou mais. Se você tivesse tentado executar `!iwtr '[a-z]' '[A-Z]'` (executar `tr` na palavra interna), descobriria que ele aplica o comando `tr` na linha inteira, não na palavra em que o cursor está.

## Aprenda Comandos Externos da Maneira Inteligente

O Vim não é um IDE. É um editor modal leve que é altamente extensível por design. Por causa dessa extensibilidade, você tem fácil acesso a qualquer comando externo em seu sistema. Armado com esses comandos externos, o Vim está um passo mais perto de se tornar um IDE. Alguém disse que o sistema Unix é o primeiro IDE de todos os tempos.

O comando bang é tão útil quanto quantos comandos externos você conhece. Não se preocupe se seu conhecimento sobre comandos externos for limitado. Eu também ainda tenho muito a aprender. Veja isso como uma motivação para o aprendizado contínuo. Sempre que você precisar modificar um texto, veja se há um comando externo que pode resolver seu problema. Não se preocupe em dominar tudo, apenas aprenda os que você precisa para completar a tarefa atual.