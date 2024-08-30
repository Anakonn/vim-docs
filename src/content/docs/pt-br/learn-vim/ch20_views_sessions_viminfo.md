---
description: Aprenda a usar View, Session e Viminfo no Vim para preservar as configurações
  e o estado do seu projeto, mantendo tudo como você deixou na última vez.
title: Ch20. Views, Sessions, and Viminfo
---

Após trabalhar em um projeto por um tempo, você pode perceber que o projeto começa a tomar forma com suas próprias configurações, dobras, buffers, layouts, etc. É como decorar seu apartamento depois de morar nele por um tempo. O problema é que, quando você fecha o Vim, você perde essas alterações. Não seria bom se você pudesse manter essas mudanças para que, na próxima vez que abrir o Vim, ele pareça como se você nunca tivesse saído?

Neste capítulo, você aprenderá como usar View, Session e Viminfo para preservar uma "imagem" dos seus projetos.

## View

Uma View é o menor subconjunto dos três (View, Session, Viminfo). É uma coleção de configurações para uma janela. Se você passar muito tempo trabalhando em uma janela e quiser preservar os mapas e dobras, pode usar uma View.

Vamos criar um arquivo chamado `foo.txt`:

```shell
foo1
foo2
foo3
foo4
foo5
foo6
foo7
foo8
foo9
foo10
```

Neste arquivo, faça três alterações:
1. Na linha 1, crie uma dobra manual `zf4j` (dobre as próximas 4 linhas).
2. Altere a configuração `number`: `setlocal nonumber norelativenumber`. Isso removerá os indicadores de número no lado esquerdo da janela.
3. Crie um mapeamento local para descer duas linhas cada vez que você pressionar `j` em vez de uma: `:nnoremap <buffer> j jj`.

Seu arquivo deve ficar assim:

```shell
+-- 5 lines: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

### Configurando Atributos da View

Execute:

```shell
:set viewoptions?
```

Por padrão, deve dizer (o seu pode parecer diferente dependendo do seu vimrc):

```shell
viewoptions=folds,cursor,curdir
```

Vamos configurar `viewoptions`. Os três atributos que você deseja preservar são as dobras, os mapas e as opções de configuração local. Se sua configuração parecer com a minha, você já tem a opção `folds`. Você precisa informar à View para lembrar das `localoptions`. Execute:

```shell
:set viewoptions+=localoptions
```

Para saber quais outras opções estão disponíveis para `viewoptions`, consulte `:h viewoptions`. Agora, se você executar `:set viewoptions?`, deve ver:

```shell
viewoptions=folds,cursor,curdir,localoptions
```

### Salvando a View

Com a janela `foo.txt` devidamente dobrada e com as opções `nonumber norelativenumber`, vamos salvar a View. Execute:

```shell
:mkview
```

O Vim cria um arquivo de View.

### Arquivos de View

Você pode se perguntar: "Onde o Vim salvou este arquivo de View?" Para ver onde o Vim o salva, execute:

```shell
:set viewdir?
```

Em sistemas operacionais baseados em Unix, o padrão deve dizer `~/.vim/view` (se você tiver um sistema operacional diferente, pode mostrar um caminho diferente. Consulte `:h viewdir` para mais informações). Se você estiver usando um sistema operacional baseado em Unix e quiser mudar para um caminho diferente, adicione isso ao seu vimrc:

```shell
set viewdir=$HOME/else/where
```

### Carregando o Arquivo de View

Feche o `foo.txt`, se ainda não o fez, e então abra `foo.txt` novamente. **Você deve ver o texto original sem as alterações.** Isso é esperado.

Para restaurar o estado, você precisa carregar o arquivo de View. Execute:

```shell
:loadview
```

Agora você deve ver:

```shell
+-- 5 lines: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

As dobras, configurações locais e mapeamentos locais são restaurados. Se você notar, seu cursor também deve estar na linha onde você o deixou quando executou `:mkview`. Desde que você tenha a opção `cursor`, a View também lembra a posição do seu cursor.

### Múltiplas Views

O Vim permite que você salve 9 Views numeradas (1-9).

Suponha que você queira fazer uma dobra adicional (digamos que você queira dobrar as duas últimas linhas) com `:9,10 fold`. Vamos salvar isso como View 1. Execute:

```shell
:mkview 1
```

Se você quiser fazer mais uma dobra com `:6,7 fold` e salvá-la como uma View diferente, execute:

```shell
:mkview 2
```

Feche o arquivo. Quando você abrir `foo.txt` e quiser carregar a View 1, execute:

```shell
:loadview 1
```

Para carregar a View 2, execute:

```shell
:loadview 2
```

Para carregar a View original, execute:

```shell
:loadview
```

### Automatizando a Criação de Views

Uma das piores coisas que pode acontecer é, após passar horas organizando um grande arquivo com dobras, você acidentalmente fechar a janela e perder todas as informações de dobra. Para evitar isso, você pode querer criar automaticamente uma View toda vez que fechar um buffer. Adicione isso ao seu vimrc:

```shell
autocmd BufWinLeave *.txt mkview
```

Além disso, pode ser interessante carregar a View ao abrir um buffer:

```shell
autocmd BufWinEnter *.txt silent loadview
```

Agora você não precisa se preocupar em criar e carregar Views quando estiver trabalhando com arquivos `txt`. Lembre-se de que, com o tempo, seu `~/.vim/view` pode começar a acumular arquivos de View. É bom limpá-lo uma vez a cada poucos meses.

## Sessions

Se uma View salva as configurações de uma janela, uma Session salva as informações de todas as janelas (incluindo o layout).

### Criando uma Nova Session

Suponha que você esteja trabalhando com esses 3 arquivos em um projeto `foobarbaz`:

Dentro de `foo.txt`:

```shell
foo1
foo2
foo3
foo4
foo5
foo6
foo7
foo8
foo9
foo10
```

Dentro de `bar.txt`:

```shell
bar1
bar2
bar3
bar4
bar5
bar6
bar7
bar8
bar9
bar10
```

Dentro de `baz.txt`:

```shell
baz1
baz2
baz3
baz4
baz5
baz6
baz7
baz8
baz9
baz10
```

Agora digamos que você dividiu suas janelas com `:split` e `:vsplit`. Para preservar essa aparência, você precisa salvar a Session. Execute:

```shell
:mksession
```

Diferente do `mkview`, que salva em `~/.vim/view` por padrão, `mksession` salva um arquivo de Session (`Session.vim`) no diretório atual. Confira o arquivo se você estiver curioso sobre o que há dentro.

Se você quiser salvar o arquivo de Session em outro lugar, pode passar um argumento para `mksession`:

```shell
:mksession ~/some/where/else.vim
```

Se você quiser sobrescrever o arquivo de Session existente, chame o comando com um `!` (`:mksession! ~/some/where/else.vim`).

### Carregando uma Session

Para carregar uma Session, execute:

```shell
:source Session.vim
```

Agora o Vim parece exatamente como você o deixou, incluindo as janelas divididas! Alternativamente, você também pode carregar um arquivo de Session a partir do terminal:

```shell
vim -S Session.vim
```

### Configurando Atributos da Session

Você pode configurar os atributos que a Session salva. Para ver o que está sendo salvo atualmente, execute:

```shell
:set sessionoptions?
```

O meu diz:

```shell
blank,buffers,curdir,folds,help,tabpages,winsize,terminal
```

Se você não quiser salvar `terminal` ao salvar uma Session, remova-o das opções de sessão. Execute:

```shell
:set sessionoptions-=terminal
```

Se você quiser adicionar uma `options` ao salvar uma Session, execute:

```shell
:set sessionoptions+=options
```

Aqui estão alguns atributos que `sessionoptions` pode armazenar:
- `blank` armazena janelas vazias
- `buffers` armazena buffers
- `folds` armazena dobras
- `globals` armazena variáveis globais (devem começar com uma letra maiúscula e conter pelo menos uma letra minúscula)
- `options` armazena opções e mapeamentos
- `resize` armazena linhas e colunas da janela
- `winpos` armazena a posição da janela
- `winsize` armazena os tamanhos das janelas
- `tabpages` armazena abas
- `unix` armazena arquivos no formato Unix

Para a lista completa, consulte `:h 'sessionoptions'`.

A Session é uma ferramenta útil para preservar os atributos externos do seu projeto. No entanto, alguns atributos internos não são salvos pela Session, como marcas locais, registros, históricos, etc. Para salvá-los, você precisa usar o Viminfo!

## Viminfo

Se você notar, após copiar uma palavra para o registro a e sair do Vim, na próxima vez que abrir o Vim, você ainda terá aquele texto armazenado no registro a. Isso é na verdade uma obra do Viminfo. Sem ele, o Vim não lembraria do registro após você fechar o Vim.

Se você usa o Vim 8 ou superior, o Vim ativa o Viminfo por padrão, então você pode ter estado usando o Viminfo todo esse tempo sem saber!

Você pode perguntar: "O que o Viminfo salva? Como ele difere da Session?"

Para usar o Viminfo, primeiro você precisa ter o recurso `+viminfo` disponível (`:version`). O Viminfo armazena:
- O histórico de linha de comando.
- O histórico de strings de busca.
- O histórico de linhas de entrada.
- Conteúdos de registros não vazios.
- Marcas para vários arquivos.
- Marcas de arquivo, apontando para locais nos arquivos.
- Última busca / padrão de substituição (para 'n' e '&').
- A lista de buffers.
- Variáveis globais.

Em geral, a Session armazena os atributos "externos" e o Viminfo os atributos "internos".

Diferente da Session, onde você pode ter um arquivo de Session por projeto, normalmente você usará um arquivo de Viminfo por computador. O Viminfo é agnóstico a projetos.

A localização padrão do Viminfo para Unix é `$HOME/.viminfo` (`~/.viminfo`). Se você usa um sistema operacional diferente, sua localização do Viminfo pode ser diferente. Consulte `:h viminfo-file-name`. Cada vez que você faz alterações "internas", como copiar um texto para um registro, o Vim atualiza automaticamente o arquivo Viminfo.

*Certifique-se de que você tenha a opção `nocompatible` definida (`set nocompatible`), caso contrário, seu Viminfo não funcionará.*

### Escrevendo e Lendo Viminfo

Embora você use apenas um arquivo de Viminfo, pode criar múltiplos arquivos de Viminfo. Para escrever um arquivo de Viminfo, use o comando `:wviminfo` (`:wv` para abreviar).

```shell
:wv ~/.viminfo_extra
```

Para sobrescrever um arquivo de Viminfo existente, adicione um ponto de exclamação ao comando `wv`:

```shell
:wv! ~/.viminfo_extra
```

Por padrão, o Vim lerá do arquivo `~/.viminfo`. Para ler de um arquivo de Viminfo diferente, execute `:rviminfo`, ou `:rv` para abreviar:

```shell
:rv ~/.viminfo_extra
```

Para iniciar o Vim com um arquivo de Viminfo diferente a partir do terminal, use a flag `i`:

```shell
vim -i viminfo_extra
```

Se você usa o Vim para diferentes tarefas, como codificação e escrita, pode criar um Viminfo otimizado para escrita e outro para codificação.

```shell
vim -i viminfo_writing

vim -i viminfo_coding
```

### Iniciando o Vim Sem Viminfo

Para iniciar o Vim sem Viminfo, você pode executar a partir do terminal:

```shell
vim -i NONE
```

Para torná-lo permanente, você pode adicionar isso ao seu arquivo vimrc:

```shell
set viminfo="NONE"
```

### Configurando Atributos do Viminfo

Semelhante a `viewoptions` e `sessionoptions`, você pode instruir quais atributos salvar com a opção `viminfo`. Execute:

```shell
:set viminfo?
```

Você obterá:

```shell
!,'100,<50,s10,h
```

Isso parece críptico. Vamos detalhar:
- `!` salva variáveis globais que começam com uma letra maiúscula e não contêm letras minúsculas. Lembre-se de que `g:` indica uma variável global. Por exemplo, se em algum momento você escreveu a atribuição `let g:FOO = "foo"`, o Viminfo salvará a variável global `FOO`. No entanto, se você fez `let g:Foo = "foo"`, o Viminfo não salvará essa variável global porque contém letras minúsculas. Sem `!`, o Vim não salvará essas variáveis globais.
- `'100` representa marcas. Neste caso, o Viminfo salvará as marcas locais (a-z) dos últimos 100 arquivos. Esteja ciente de que se você disser ao Viminfo para salvar muitos arquivos, o Vim pode começar a desacelerar. 1000 é um bom número a se ter.
- `<50` informa ao Viminfo quantas linhas máximas são salvas para cada registro (50 neste caso). Se eu copiar 100 linhas de texto para o registro a (`"ay99j`) e fechar o Vim, na próxima vez que eu abrir o Vim e colar do registro a (`"ap`), o Vim colará apenas 50 linhas no máximo. Se você não der um número máximo de linhas, *todas* as linhas serão salvas. Se você der 0, nada será salvo.
- `s10` define um limite de tamanho (em kb) para um registro. Neste caso, qualquer registro maior que 10kb será excluído.
- `h` desativa a realce (de `hlsearch`) quando o Vim inicia.

Existem outras opções que você pode passar. Para saber mais, consulte `:h 'viminfo'`.
## Usando Views, Sessions e Viminfo da Forma Inteligente

Vim tem View, Session e Viminfo para capturar diferentes níveis de instantâneas do seu ambiente Vim. Para micro projetos, use Views. Para projetos maiores, use Sessions. Você deve dedicar um tempo para conferir todas as opções que View, Session e Viminfo oferecem.

Crie sua própria View, Session e Viminfo para seu próprio estilo de edição. Se você precisar usar o Vim fora do seu computador, você pode simplesmente carregar suas configurações e imediatamente se sentirá em casa!