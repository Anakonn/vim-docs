---
description: Aprenda a usar o sistema de desfazer do Vim, que permite reverter alterações,
  navegar em ramificações de desfazer e persistir estados de texto.
title: Ch10. Undo
---

Todos nós cometemos todo tipo de erros de digitação. É por isso que o desfazer é um recurso essencial em qualquer software moderno. O sistema de desfazer do Vim não só é capaz de desfazer e refazer erros simples, mas também de acessar diferentes estados de texto, dando a você controle sobre todos os textos que você já digitou. Neste capítulo, você aprenderá como desfazer, refazer, navegar em um ramo de desfazer, persistir o desfazer e viajar no tempo.

## Desfazer, Refazer e DESFIZER

Para realizar um desfazer básico, você pode usar `u` ou executar `:undo`.

Se você tiver este texto (note a linha vazia abaixo de "um"):

```shell
um

```

Então você adiciona outro texto:

```shell
um
dois
```

Se você pressionar `u`, o Vim desfaz o texto "dois".

Como o Vim sabe quanto desfazer? O Vim desfaz uma única "mudança" por vez, semelhante à mudança de um comando de ponto (diferente do comando de ponto, comandos de linha de comando também contam como uma mudança).

Para refazer a última mudança, pressione `Ctrl-R` ou execute `:redo`. Depois de desfazer o texto acima para remover "dois", executar `Ctrl-R` trará o texto removido de volta.

O Vim também tem DESFIZER que você pode executar com `U`. Ele desfaz todas as últimas mudanças.

Como `U` é diferente de `u`? Primeiro, `U` remove *todas* as mudanças na linha mais recentemente alterada, enquanto `u` remove apenas uma mudança por vez. Segundo, enquanto fazer `u` não conta como uma mudança, fazer `U` conta como uma mudança.

Voltando a este exemplo:

```shell
um
dois
```

Altere a segunda linha para "três":

```shell
um
três
```

Altere a segunda linha novamente e substitua-a por "quatro":

```shell
um
quatro
```

Se você pressionar `u`, verá "três". Se você pressionar `u` novamente, verá "dois". Se em vez de pressionar `u` quando ainda tinha o texto "quatro", você tivesse pressionado `U`, você verá:

```shell
um

```

`U` ignora todas as mudanças intermediárias e vai para o estado original quando você começou (uma linha vazia). Além disso, como o DESFIZER na verdade cria uma nova mudança no Vim, você pode DESFIZER seu DESFIZER. `U` seguido de `U` irá desfazer a si mesmo. Você pode pressionar `U`, depois `U`, depois `U`, etc. Você verá os mesmos dois estados de texto alternando de volta e para frente.

Pessoalmente, não uso `U` porque é difícil lembrar do estado original (raramente preciso dele).

O Vim define um número máximo de quantas vezes você pode desfazer na variável de opção `undolevels`. Você pode verificar com `:echo &undolevels`. O meu está configurado para 1000. Para alterar o seu para 1000, execute `:set undolevels=1000`. Sinta-se à vontade para configurá-lo para qualquer número que você desejar.

## Quebrando os Blocos

Mencionei anteriormente que `u` desfaz uma única "mudança" semelhante à mudança do comando de ponto: os textos inseridos desde que você entra no modo de inserção até que você saia contam como uma mudança.

Se você fizer `ione dois três<Esc>` e depois pressionar `u`, o Vim remove todo o texto "um dois três" porque tudo conta como uma mudança. Isso não é um grande problema se você escreveu textos curtos, mas e se você escreveu vários parágrafos dentro de uma sessão de modo de inserção sem sair e depois percebeu que cometeu um erro? Se você pressionar `u`, tudo o que você escreveu seria removido. Não seria útil se você pudesse pressionar `u` para remover apenas uma seção do seu texto?

Felizmente, você pode quebrar os blocos de desfazer. Quando você está digitando no modo de inserção, pressionar `Ctrl-G u` cria um ponto de interrupção de desfazer. Por exemplo, se você fizer `ione <Ctrl-G u>dois <Ctrl-G u>três<Esc>`, então pressionar `u`, você só perderá o texto "três" (pressione `u` mais uma vez para remover "dois"). Quando você escreve um texto longo, use `Ctrl-G u` estrategicamente. O final de cada frase, entre dois parágrafos ou após cada linha de código são locais primários para adicionar pontos de interrupção de desfazer para facilitar o desfazer de seus erros, se você algum dia cometer um.

Também é útil criar um ponto de interrupção de desfazer ao excluir blocos no modo de inserção com `Ctrl-W` (excluir a palavra antes do cursor) e `Ctrl-U` (excluir todo o texto antes do cursor). Um amigo sugeriu usar os seguintes mapeamentos:

```shell
inoremap <c-u> <c-g>u<c-u>
inoremap <c-w> <c-g>u<c-w>
```

Com esses, você pode facilmente recuperar os textos excluídos.

## Árvore de Desfazer

O Vim armazena cada mudança já escrita em uma árvore de desfazer. Comece um novo arquivo vazio. Depois adicione um novo texto:

```shell
um

```

Adicione um novo texto:

```shell
um
dois
```

Desfaça uma vez:

```shell
um

```

Adicione um texto diferente:

```shell
um
três
```

Desfaça novamente:

```shell
um

```

E adicione outro texto diferente:

```shell
um
quatro
```

Agora, se você desfizer, perderá o texto "quatro" que acabou de adicionar:

```shell
um

```

Se você desfizer mais uma vez:

```shell

```

Você perderá o texto "um". Na maioria dos editores de texto, recuperar os textos "dois" e "três" seria impossível, mas não com o Vim! Pressione `g+` e você terá seu texto "um" de volta:

```shell
um

```

Digite `g+` novamente e você verá um velho amigo:

```shell
um
dois
```

Vamos continuar. Pressione `g+` novamente:

```shell
um
três
```

Pressione `g+` mais uma vez:

```shell
um
quatro
```

No Vim, toda vez que você pressiona `u` e depois faz uma mudança diferente, o Vim armazena o texto do estado anterior criando um "ramo de desfazer". Neste exemplo, depois de digitar "dois", então pressionar `u`, depois digitar "três", você criou um ramo folha que armazena o estado contendo o texto "dois". Nesse momento, a árvore de desfazer continha pelo menos dois nós folha: o nó principal contendo o texto "três" (mais recente) e o nó do ramo de desfazer contendo o texto "dois". Se você tivesse feito outro desfazer e digitado o texto "quatro", você teria três nós: um nó principal contendo o texto "quatro" e dois nós contendo os textos "três" e "dois".

Para percorrer cada nó da árvore de desfazer, você pode usar `g+` para ir a um estado mais novo e `g-` para ir a um estado mais antigo. A diferença entre `u`, `Ctrl-R`, `g+` e `g-` é que tanto `u` quanto `Ctrl-R` percorrem apenas os *nós principais* na árvore de desfazer, enquanto `g+` e `g-` percorrem *todos* os nós na árvore de desfazer.

A árvore de desfazer não é fácil de visualizar. Eu acho o plugin [vim-mundo](https://github.com/simnalamburt/vim-mundo) muito útil para ajudar a visualizar a árvore de desfazer do Vim. Dê um tempo para brincar com isso.

## Desfazer Persistente

Se você iniciar o Vim, abrir um arquivo e imediatamente pressionar `u`, o Vim provavelmente exibirá o aviso "*Já na mudança mais antiga*". Não há nada para desfazer porque você não fez nenhuma alteração.

Para rolar o histórico de desfazer da última sessão de edição, o Vim pode preservar seu histórico de desfazer com um arquivo de desfazer usando `:wundo`.

Crie um arquivo `mynumbers.txt`. Digite:

```shell
um
```

Então digite outra linha (certifique-se de que cada linha conta como uma mudança):

```shell
um
dois
```

Digite outra linha:

```shell
um
dois
três
```

Agora crie seu arquivo de desfazer com `:wundo {meu-arquivo-de-desfazer}`. Se você precisar sobrescrever um arquivo de desfazer existente, pode adicionar `!` após `wundo`.

```shell
:wundo! mynumbers.undo
```

Então saia do Vim.

Agora você deve ter os arquivos `mynumbers.txt` e `mynumbers.undo` em seu diretório. Abra `mynumbers.txt` novamente e tente pressionar `u`. Você não pode. Você não fez nenhuma alteração desde que abriu o arquivo. Agora carregue seu histórico de desfazer lendo o arquivo de desfazer com `:rundo`:

```shell
:rundo mynumbers.undo
```

Agora, se você pressionar `u`, o Vim remove "três". Pressione `u` novamente para remover "dois". É como se você nunca tivesse fechado o Vim!

Se você quiser ter uma persistência de desfazer automática, uma maneira de fazer isso é adicionando isso no vimrc:

```shell
set undodir=~/.vim/undo_dir
set undofile
```

A configuração acima colocará todos os arquivos de desfazer em um diretório centralizado, o diretório `~/.vim`. O nome `undo_dir` é arbitrário. `set undofile` diz ao Vim para ativar o recurso `undofile` porque ele está desativado por padrão. Agora, sempre que você salvar, o Vim cria e atualiza automaticamente o arquivo relevante dentro do diretório `undo_dir` (certifique-se de criar o diretório `undo_dir` dentro do diretório `~/.vim` antes de executar isso).

## Viagem no Tempo

Quem disse que a viagem no tempo não existe? O Vim pode viajar para um estado de texto no passado com o comando de linha `:earlier`.

Se você tiver este texto:

```shell
um

```
Então mais tarde você adiciona:

```shell
um
dois
```

Se você digitou "dois" há menos de dez segundos, você pode voltar ao estado onde "dois" não existia há dez segundos com:

```shell
:earlier 10s
```

Você pode usar `:undolist` para ver quando a última mudança foi feita. `:earlier` também aceita diferentes argumentos:

```shell
:earlier 10s    Vá para o estado 10 segundos antes
:earlier 10m    Vá para o estado 10 minutos antes
:earlier 10h    Vá para o estado 10 horas antes
:earlier 10d    Vá para o estado 10 dias antes
```

Além disso, ele também aceita um `count` regular como argumento para dizer ao Vim para ir ao estado mais antigo `count` vezes. Por exemplo, se você fizer `:earlier 2`, o Vim voltará a um estado de texto mais antigo duas mudanças atrás. É o mesmo que fazer `g-` duas vezes. Você também pode dizer para ir ao estado de texto mais antigo 10 salvamentos atrás com `:earlier 10f`.

O mesmo conjunto de argumentos funciona com o contraparte de `:earlier`: `:later`.

```shell
:later 10s    vá para o estado 10 segundos depois
:later 10m    vá para o estado 10 minutos depois
:later 10h    vá para o estado 10 horas depois
:later 10d    vá para o estado 10 dias depois
:later 10     vá para o estado mais novo 10 vezes
:later 10f    vá para o estado 10 salvamentos depois
```

## Aprenda a Desfazer da Maneira Inteligente

`u` e `Ctrl-R` são dois comandos indispensáveis do Vim para corrigir erros. Aprenda-os primeiro. Em seguida, aprenda como usar `:earlier` e `:later` usando os argumentos de tempo primeiro. Depois disso, reserve um tempo para entender a árvore de desfazer. O plugin [vim-mundo](https://github.com/simnalamburt/vim-mundo) me ajudou muito. Digite junto com os textos neste capítulo e verifique a árvore de desfazer à medida que você faz cada mudança. Uma vez que você compreenda, nunca mais verá o sistema de desfazer da mesma maneira.

Antes deste capítulo, você aprendeu como encontrar qualquer texto em um espaço de projeto, com o desfazer, agora você pode encontrar qualquer texto em uma dimensão temporal. Você agora é capaz de procurar qualquer texto por sua localização e tempo escrito. Você alcançou a onipresença do Vim.