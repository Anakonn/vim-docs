---
description: Neste capítulo, aprenda a iniciar o Vim a partir do terminal e descubra
  informações sobre a instalação e o uso básico do editor modal.
title: Ch01. Starting Vim
---

Neste capítulo, você aprenderá diferentes maneiras de iniciar o Vim a partir do terminal. Eu estava usando o Vim 8.2 ao escrever este guia. Se você usar o Neovim ou uma versão mais antiga do Vim, você deve estar basicamente bem, mas esteja ciente de que alguns comandos podem não estar disponíveis.

## Instalando

Não vou passar pelas instruções detalhadas de como instalar o Vim em uma máquina específica. A boa notícia é que a maioria dos computadores baseados em Unix deve vir com o Vim instalado. Se não, a maioria das distribuições deve ter algumas instruções para instalar o Vim.

Para baixar mais informações sobre o processo de instalação do Vim, confira o site oficial de downloads do Vim ou o repositório oficial do Vim no github:
- [Site do Vim](https://www.vim.org/download.php)
- [Vim github](https://github.com/vim/vim)

## O Comando Vim

Agora que você tem o Vim instalado, execute isto a partir do terminal:

```bash
vim
```

Você deve ver uma tela de introdução. Este é o lugar onde você estará trabalhando em seu novo arquivo. Ao contrário da maioria dos editores de texto e IDEs, o Vim é um editor modal. Se você quiser digitar "hello", precisa mudar para o modo de inserção com `i`. Pressione `ihello<Esc>` para inserir o texto "hello".

## Saindo do Vim

Existem várias maneiras de sair do Vim. A mais comum é digitar:

```shell
:quit
```

Você pode digitar `:q` para encurtar. Esse comando é um comando do modo de linha de comando (outro dos modos do Vim). Se você digitar `:` no modo normal, o cursor se moverá para a parte inferior da tela, onde você pode digitar alguns comandos. Você aprenderá sobre o modo de linha de comando mais tarde no capítulo 15. Se você estiver no modo de inserção, digitar `:` produzirá literalmente o caractere ":" na tela. Nesse caso, você precisa voltar ao modo normal. Digite `<Esc>` para mudar para o modo normal. A propósito, você também pode retornar ao modo normal a partir do modo de linha de comando pressionando `<Esc>`. Você notará que pode "escapar" de vários modos do Vim de volta ao modo normal pressionando `<Esc>`.

## Salvando um Arquivo

Para salvar suas alterações, digite:

```shell
:write
```

Você também pode digitar `:w` para encurtar. Se este for um novo arquivo, você precisa dar um nome a ele antes de poder salvá-lo. Vamos nomeá-lo `file.txt`. Execute:

```shell
:w file.txt
```

Para salvar e sair, você pode combinar os comandos `:w` e `:q`:

```shell
:wq
```

Para sair sem salvar nenhuma alteração, adicione `!` após `:q` para forçar a saída:

```shell
:q!
```

Existem outras maneiras de sair do Vim, mas estas são as que você usará diariamente.

## Ajuda

Ao longo deste guia, eu o direcionarei para várias páginas de ajuda do Vim. Você pode acessar a página de ajuda digitando `:help {algum-comando}` (`:h` para encurtar). Você pode passar ao comando `:h` um tópico ou um nome de comando como argumento. Por exemplo, para aprender sobre diferentes maneiras de sair do Vim, digite:

```shell
:h write-quit
```

Como eu soube para procurar "write-quit"? Na verdade, eu não soube. Eu apenas digitei `:h`, depois "quit", e então `<Tab>`. O Vim exibiu palavras-chave relevantes para escolher. Se você precisar procurar algo ("Eu gostaria que o Vim pudesse fazer isso..."), basta digitar `:h` e tentar algumas palavras-chave, depois `<Tab>`.

## Abrindo um Arquivo

Para abrir um arquivo (`hello1.txt`) no Vim a partir do terminal, execute:

```bash
vim hello1.txt
```

Você também pode abrir vários arquivos ao mesmo tempo:

```bash
vim hello1.txt hello2.txt hello3.txt
```

O Vim abre `hello1.txt`, `hello2.txt` e `hello3.txt` em buffers separados. Você aprenderá sobre buffers no próximo capítulo.

## Argumentos

Você pode passar o comando do terminal `vim` com diferentes flags e opções.

Para verificar a versão atual do Vim, execute:

```bash
vim --version
```

Isso informa a versão atual do Vim e todos os recursos disponíveis marcados com `+` ou `-`. Alguns desses recursos neste guia requerem que certos recursos estejam disponíveis. Por exemplo, você explorará o histórico de linha de comando do Vim em um capítulo posterior com o comando `:history`. Seu Vim precisa ter o recurso `+cmdline_history` para que o comando funcione. Há uma boa chance de que o Vim que você acabou de instalar tenha todos os recursos necessários, especialmente se for de uma fonte de download popular.

Muitas coisas que você faz a partir do terminal também podem ser feitas de dentro do Vim. Para ver a versão de *dentro* do Vim, você pode executar isto:

```shell
:version
```

Se você quiser abrir o arquivo `hello.txt` e imediatamente executar um comando do Vim, você pode passar ao comando `vim` a opção `+{cmd}`.

No Vim, você pode substituir strings com o comando `:s` (abreviação de `:substitute`). Se você quiser abrir `hello.txt` e substituir todos os "pancake" por "bagel", execute:

```bash
vim +%s/pancake/bagel/g hello.txt
```

Esses comandos do Vim podem ser empilhados:

```bash
vim +%s/pancake/bagel/g +%s/bagel/egg/g +%s/egg/donut/g hello.txt
```

O Vim substituirá todas as instâncias de "pancake" por "bagel", depois substituirá "bagel" por "egg", e então substituirá "egg" por "donut" (você aprenderá sobre substituição em um capítulo posterior).

Você também pode passar a opção `-c` seguida de um comando do Vim em vez da sintaxe `+`:

```bash
vim -c %s/pancake/bagel/g hello.txt
vim -c %s/pancake/bagel/g -c %s/bagel/egg/g -c %s/egg/donut/g hello.txt
```

## Abrindo Múltiplas Janelas

Você pode iniciar o Vim em janelas horizontais e verticais divididas com as opções `-o` e `-O`, respectivamente.

Para abrir o Vim com duas janelas horizontais, execute:

```bash
vim -o2
```

Para abrir o Vim com 5 janelas horizontais, execute:

```bash
vim -o5
```

Para abrir o Vim com 5 janelas horizontais e preencher as duas primeiras com `hello1.txt` e `hello2.txt`, execute:

```bash
vim -o5 hello1.txt hello2.txt
```

Para abrir o Vim com duas janelas verticais, 5 janelas verticais, e 5 janelas verticais com 2 arquivos:

```bash
vim -O2
vim -O5
vim -O5 hello1.txt hello2.txt
```

## Suspendendo

Se você precisar suspender o Vim enquanto edita, pode pressionar `Ctrl-z`. Você também pode executar o comando `:stop` ou `:suspend`. Para retornar ao Vim suspenso, execute `fg` a partir do terminal.

## Iniciando o Vim da Forma Inteligente

O comando `vim` pode aceitar muitas opções diferentes, assim como qualquer outro comando de terminal. Duas opções permitem que você passe um comando do Vim como parâmetro: `+{cmd}` e `-c cmd`. À medida que você aprende mais comandos ao longo deste guia, veja se consegue aplicá-los ao iniciar o Vim. Sendo também um comando de terminal, você pode combinar `vim` com muitos outros comandos de terminal. Por exemplo, você pode redirecionar a saída do comando `ls` para ser editada no Vim com `ls -l | vim -`.

Para aprender mais sobre o comando `vim` no terminal, confira `man vim`. Para aprender mais sobre o editor Vim, continue lendo este guia junto com o comando `:help`.