---
description: Aprenda a compilar arquivos no Vim usando o comando `:make` e descubra
  como simplificar o processo com um makefile para suas linguagens de programação.
title: Ch19. Compile
---

Compilar é um assunto importante para muitas linguagens. Neste capítulo, você aprenderá como compilar a partir do Vim. Você também verá maneiras de aproveitar o comando `:make` do Vim.

## Compilar a partir da Linha de Comando

Você pode usar o operador bang (`!`) para compilar. Se você precisar compilar seu arquivo `.cpp` com `g++`, execute:

```shell
:!g++ hello.cpp -o hello
```

No entanto, ter que digitar manualmente o nome do arquivo e o nome do arquivo de saída a cada vez é propenso a erros e tedioso. Um makefile é o caminho a seguir.

## O Comando Make

O Vim tem um comando `:make` para executar um makefile. Quando você o executa, o Vim procura um makefile no diretório atual para executar.

Crie um arquivo chamado `makefile` no diretório atual e coloque o seguinte dentro:

```shell
all:
	echo "Hello all"
foo:
	echo "Hello foo"
list_pls:
	ls
```

Execute isso a partir do Vim:

```shell
:make
```

O Vim o executa da mesma forma que quando você o está executando a partir do terminal. O comando `:make` aceita parâmetros assim como o comando make do terminal. Execute:

```shell
:make foo
" Saída "Hello foo"

:make list_pls
" Saída do resultado do comando ls
```

O comando `:make` usa o quickfix do Vim para armazenar qualquer erro se você executar um comando inválido. Vamos executar um alvo inexistente:

```shell
:make dontexist
```

Você deve ver um erro ao executar esse comando. Para visualizar esse erro, execute o comando quickfix `:copen` para ver a janela quickfix:

```shell
|| make: *** No rule to make target `dontexist'.  Stop.
```

## Compilando Com Make

Vamos usar o makefile para compilar um programa básico `.cpp`. Primeiro, vamos criar um arquivo `hello.cpp`:

```shell
#include <iostream>

int main() {
    std::cout << "Hello!\n";
    return 0;
}
```

Atualize seu makefile para construir e executar um arquivo `.cpp`:

```shell
all:
	echo "build, run"
build:
	g++ hello.cpp -o hello
run:
	./hello
```

Agora execute:

```shell
:make build
```

O `g++` compila `./hello.cpp` e cria `./hello`. Em seguida, execute:

```shell
:make run
```

Você deve ver `"Hello!"` impresso no terminal.

## Programa Make Diferente

Quando você executa `:make`, o Vim na verdade executa qualquer comando que esteja definido na opção `makeprg`. Se você executar `:set makeprg?`, verá:

```shell
makeprg=make
```

O comando `:make` padrão é o comando externo `make`. Para alterar o comando `:make` para executar `g++ {seu-nome-de-arquivo}` toda vez que você o executar, execute:

```shell
:set makeprg=g++\ %
```

O `\` é para escapar o espaço após `g++`. O símbolo `%` no Vim representa o arquivo atual. O comando `g++\\ %` é equivalente a executar `g++ hello.cpp`.

Vá para `./hello.cpp` e então execute `:make`. O Vim compila `hello.cpp` e cria `a.out` porque você não especificou a saída. Vamos refatorá-lo para que nomeie a saída compilada com o nome do arquivo original menos a extensão. Execute ou adicione isso ao vimrc:

```shell
set makeprg=g++\ %\ -o\ %<
```

A divisão:
- `g++\ %` é o mesmo que acima. É equivalente a executar `g++ <seu-arquivo>`.
- `-o` é a opção de saída.
- `%<` no Vim representa o nome do arquivo atual sem uma extensão (`hello.cpp` se torna `hello`).

Quando você executa `:make` de dentro de `./hello.cpp`, ele é compilado em `./hello`. Para executar rapidamente `./hello` de dentro de `./hello.cpp`, execute `:!./%<`. Novamente, isso é o mesmo que executar `:!./{nome-do-arquivo-atual-menos-a-extensão}`.

Para mais, confira `:h :compiler` e `:h write-compiler-plugin`.

## Compilação Automática ao Salvar

Você pode facilitar ainda mais a vida automatizando a compilação. Lembre-se de que você pode usar o `autocmd` do Vim para acionar ações automáticas com base em certos eventos. Para compilar automaticamente arquivos `.cpp` a cada salvamento, adicione isso ao seu vimrc:

```shell
autocmd BufWritePost *.cpp make
```

Cada vez que você salvar dentro de um arquivo `.cpp`, o Vim executa o comando `make`.

## Alternando Compilador

O Vim tem um comando `:compiler` para alternar rapidamente entre compiladores. Sua construção do Vim provavelmente vem com várias configurações de compilador pré-construídas. Para verificar quais compiladores você tem, execute:

```shell
:e $VIMRUNTIME/compiler/<Tab>
```

Você deve ver uma lista de compiladores para diferentes linguagens de programação.

Para usar o comando `:compiler`, suponha que você tenha um arquivo ruby, `hello.rb` e dentro dele tenha:

```shell
puts "Hello ruby"
```

Lembre-se de que se você executar `:make`, o Vim executa qualquer comando atribuído a `makeprg` (o padrão é `make`). Se você executar:

```shell
:compiler ruby
```

O Vim executará o script `$VIMRUNTIME/compiler/ruby.vim` e mudará o `makeprg` para usar o comando `ruby`. Agora, se você executar `:set makeprg?`, deve dizer `makeprg=ruby` (isso depende do que está dentro do seu arquivo `$VIMRUNTIME/compiler/ruby.vim` ou se você tem outros compiladores ruby personalizados. O seu pode ser diferente). O comando `:compiler {sua-linguagem}` permite que você mude rapidamente para diferentes compiladores. Isso é útil se seu projeto usa várias linguagens.

Você não precisa usar o `:compiler` e `makeprg` para compilar um programa. Você pode executar um script de teste, lintar um arquivo, enviar um sinal ou qualquer coisa que você quiser.

## Criando um Compilador Personalizado

Vamos criar um compilador Typescript simples. Instale o Typescript (`npm install -g typescript`) em sua máquina. Você agora deve ter o comando `tsc`. Se você nunca trabalhou com typescript antes, `tsc` compila um arquivo Typescript em um arquivo Javascript. Suponha que você tenha um arquivo, `hello.ts`:

```shell
const hello = "hello";
console.log(hello);
```

Se você executar `tsc hello.ts`, ele será compilado em `hello.js`. No entanto, se você tiver as seguintes expressões dentro de `hello.ts`:

```shell
const hello = "hello";
hello = "hello again";
console.log(hello);
```

Isso lançará um erro porque você não pode mutar uma variável `const`. Executar `tsc hello.ts` lançará um erro:

```shell
hello.ts:2:1 - error TS2588: Cannot assign to 'person' because it is a constant.

2 person = "hello again";
  ~~~~~~


Found 1 error.
```

Para criar um compilador Typescript simples, no seu diretório `~/.vim/`, adicione um diretório `compiler` (`~/.vim/compiler/`), depois crie um arquivo `typescript.vim` (`~/.vim/compiler/typescript.vim`). Coloque o seguinte dentro:

```shell
CompilerSet makeprg=tsc
CompilerSet errorformat=%f:\ %m
```

A primeira linha define o `makeprg` para executar o comando `tsc`. A segunda linha define o formato de erro para exibir o arquivo (`%f`), seguido por dois pontos literais (`:`) e um espaço escapado (`\ `), seguido pela mensagem de erro (`%m`). Para saber mais sobre o formato de erro, confira `:h errorformat`.

Você também deve ler alguns dos compiladores pré-fabricados para ver como outros fazem. Confira `:e $VIMRUNTIME/compiler/<alguma-linguagem>.vim`.

Como alguns plugins podem interferir com o arquivo Typescript, vamos abrir o `hello.ts` sem nenhum plugin, usando a flag `--noplugin`:

```shell
vim --noplugin hello.ts
```

Verifique o `makeprg`:

```shell
:set makeprg?
```

Deve dizer o programa `make` padrão. Para usar o novo compilador Typescript, execute:

```shell
:compiler typescript
```

Quando você executar `:set makeprg?`, deve dizer `tsc` agora. Vamos colocar à prova. Execute:

```shell
:make %
```

Lembre-se de que `%` significa o arquivo atual. Veja seu compilador Typescript funcionar como esperado! Para ver a lista de erro(s), execute `:copen`.

## Compilador Assíncrono

Às vezes, compilar pode levar muito tempo. Você não quer ficar olhando para um Vim congelado enquanto espera o seu processo de compilação terminar. Não seria bom se você pudesse compilar de forma assíncrona para que ainda pudesse usar o Vim durante a compilação?

Felizmente, existem plugins para executar processos assíncronos. Os dois principais são:

- [vim-dispatch](https://github.com/tpope/vim-dispatch)
- [asyncrun.vim](https://github.com/skywind3000/asyncrun.vim)

No restante deste capítulo, eu falarei sobre o vim-dispatch, mas eu encorajo fortemente você a experimentar todos eles.

*Vim e NeoVim na verdade suportam trabalhos assíncronos, mas eles estão além do escopo deste capítulo. Se você estiver curioso, confira `:h job-channel-overview.txt`.*

## Plugin: Vim-dispatch

O Vim-dispatch tem vários comandos, mas os dois principais são os comandos `:Make` e `:Dispatch`.

### Make Assíncrono

O comando `:Make` do Vim-dispatch é semelhante ao `:make` do Vim, mas é executado de forma assíncrona. Se você estiver em um projeto Javascript e precisar executar `npm t`, você pode tentar definir seu makeprg para:

```shell
:set makeprg=npm\\ t
```

Se você executar:

```shell
:make
```

O Vim executará `npm t`, mas você ficará olhando para a tela congelada enquanto seu teste JavaScript é executado. Com o vim-dispatch, você pode simplesmente executar:

```shell
:Make
```

O Vim executará `npm t` de forma assíncrona. Dessa forma, enquanto `npm t` está sendo executado em um processo em segundo plano, você pode continuar fazendo o que estava fazendo. Incrível!

### Dispatch Assíncrono

O comando `:Dispatch` é como o `:compiler` e o comando `:!`. Ele pode executar qualquer comando externo de forma assíncrona no Vim.

Suponha que você esteja dentro de um arquivo de especificação ruby e precise executar um teste. Execute:

```shell
:Dispatch bundle exec rspec %
```

O Vim executará assíncronamente o comando `rspec` contra o arquivo atual (`%`).

### Automatizando o Dispatch

O Vim-dispatch tem a variável de buffer `b:dispatch` que você pode configurar para avaliar um comando específico automaticamente. Você pode aproveitá-la com `autocmd`. Se você adicionar isso ao seu vimrc:

```shell
autocmd BufEnter *_spec.rb let b:dispatch = 'bundle exec rspec %'
```

Agora, cada vez que você entrar em um arquivo (`BufEnter`) que termina com `_spec.rb`, executar `:Dispatch` automaticamente executa `bundle exec rspec {seu-arquivo-especificação-ruby-atual}`.

## Aprenda a Compilar da Forma Inteligente

Neste capítulo, você aprendeu que pode usar os comandos `make` e `compiler` para executar *qualquer* processo de dentro do Vim de forma assíncrona para complementar seu fluxo de trabalho de programação. A capacidade do Vim de se estender com outros programas o torna poderoso.