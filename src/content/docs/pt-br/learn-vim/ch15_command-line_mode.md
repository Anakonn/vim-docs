---
description: Este documento ensina dicas e truques para o modo de linha de comando
  no Vim, incluindo como entrar e sair desse modo e usar comandos eficazmente.
title: Ch15. Command-line Mode
---

Nos últimos três capítulos, você aprendeu como usar os comandos de busca (`/`, `?`), o comando de substituição (`:s`), o comando global (`:g`) e o comando externo (`!`). Estes são exemplos de comandos do modo de linha de comando.

Neste capítulo, você aprenderá várias dicas e truques para o modo de linha de comando.

## Entrando e Saindo do Modo de Linha de Comando

O modo de linha de comando é um modo em si, assim como o modo normal, o modo de inserção e o modo visual. Quando você está neste modo, o cursor vai para a parte inferior da tela, onde você pode digitar diferentes comandos.

Existem 4 comandos diferentes que você pode usar para entrar no modo de linha de comando:
- Padrões de busca (`/`, `?`)
- Comandos de linha de comando (`:`)
- Comandos externos (`!`)

Você pode entrar no modo de linha de comando a partir do modo normal ou do modo visual.

Para sair do modo de linha de comando, você pode usar `<Esc>`, `Ctrl-C` ou `Ctrl-[`.

*Outras literaturas podem se referir ao "Comando de linha de comando" como "Comando Ex" e ao "Comando externo" como "comando de filtro" ou "operador bang".*

## Repetindo o Comando Anterior

Você pode repetir o comando de linha de comando anterior ou o comando externo com `@:`.

Se você acabou de executar `:s/foo/bar/g`, executar `@:` repete essa substituição. Se você acabou de executar `:.!tr '[a-z]' '[A-Z]'`, executar `@:` repete o último filtro de tradução do comando externo.

## Atalhos do Modo de Linha de Comando

Enquanto estiver no modo de linha de comando, você pode se mover para a esquerda ou para a direita, um caractere de cada vez, com a seta `Esquerda` ou `Direita`.

Se você precisar se mover palavra por palavra, use `Shift-Esquerda` ou `Shift-Direita` (em alguns sistemas operacionais, você pode ter que usar `Ctrl` em vez de `Shift`).

Para ir ao início da linha, use `Ctrl-B`. Para ir ao final da linha, use `Ctrl-E`.

Semelhante ao modo de inserção, dentro do modo de linha de comando, você tem três maneiras de deletar caracteres:

```shell
Ctrl-H    Deletar um caractere
Ctrl-W    Deletar uma palavra
Ctrl-U    Deletar a linha inteira
```
Finalmente, se você quiser editar o comando como faria em um arquivo de texto normal, use `Ctrl-F`.

Isso também permite que você pesquise entre os comandos anteriores, edite-os e os execute novamente pressionando `<Enter>` no "modo normal de edição de linha de comando".

## Registro e Autocompletar

Enquanto estiver no modo de linha de comando, você pode inserir textos do registro do Vim com `Ctrl-R`, da mesma forma que no modo de inserção. Se você tiver a string "foo" salva no registro a, você pode inseri-la executando `Ctrl-R a`. Tudo que você pode obter do registro no modo de inserção, você pode fazer o mesmo no modo de linha de comando.

Além disso, você também pode obter a palavra sob o cursor com `Ctrl-R Ctrl-W` (`Ctrl-R Ctrl-A` para a WORD sob o cursor). Para obter a linha sob o cursor, use `Ctrl-R Ctrl-L`. Para obter o nome do arquivo sob o cursor, use `Ctrl-R Ctrl-F`.

Você também pode autocompletar comandos existentes. Para autocompletar o comando `echo`, enquanto estiver no modo de linha de comando, digite "ec", e depois pressione `<Tab>`. Você deve ver no canto inferior esquerdo os comandos do Vim começando com "ec" (exemplo: `echo echoerr echohl echomsg econ`). Para ir à próxima opção, pressione `<Tab>` ou `Ctrl-N`. Para ir à opção anterior, pressione `<Shift-Tab>` ou `Ctrl-P`.

Alguns comandos de linha de comando aceitam nomes de arquivos como argumentos. Um exemplo é `edit`. Você pode autocompletar aqui também. Após digitar o comando, `:e ` (não esqueça do espaço), pressione `<Tab>`. O Vim listará todos os nomes de arquivos relevantes que você pode escolher, para que você não precise digitá-los do zero.

## Janela de Histórico e Janela de Linha de Comando

Você pode visualizar o histórico de comandos de linha de comando e termos de busca (isso requer o recurso `+cmdline_hist`).

Para abrir o histórico de linha de comando, execute `:his :`. Você deve ver algo como o seguinte:

```shell
## Histórico de Cmd
2  e file1.txt
3  g/foo/d
4  s/foo/bar/g
```

O Vim lista o histórico de todos os comandos `:` que você executou. Por padrão, o Vim armazena os últimos 50 comandos. Para mudar a quantidade de entradas que o Vim lembra para 100, você executa `set history=100`.

Um uso mais útil do histórico de linha de comando é através da janela de linha de comando, `q:`. Isso abrirá uma janela de histórico editável e pesquisável. Suponha que você tenha essas expressões no histórico quando pressionar `q:`:

```shell
51  s/verylongsubstitutionpattern/pancake/g
52  his :
53  wq
```

Se sua tarefa atual é fazer `s/verylongsubstitutionpattern/donut/g`, em vez de digitar o comando do zero, por que não reutilizar `s/verylongsubstitutionpattern/pancake/g`? Afinal, a única coisa que é diferente é a palavra substituta, "donut" vs "pancake". Tudo o mais é o mesmo.

Depois de executar `q:`, encontre `s/verylongsubstitutionpattern/pancake/g` no histórico (você pode usar a navegação do Vim neste ambiente) e edite-o diretamente! Mude "pancake" para "donut" dentro da janela de histórico, então pressione `<Enter>`. Boom! O Vim executa `s/verylongsubstitutionpattern/donut/g` para você. Super conveniente!

Da mesma forma, para visualizar o histórico de busca, execute `:his /` ou `:his ?`. Para abrir a janela de histórico de busca onde você pode pesquisar e editar o histórico passado, execute `q/` ou `q?`.

Para sair desta janela, pressione `Ctrl-C`, `Ctrl-W C`, ou digite `:quit`.

## Mais Comandos de Linha de Comando

O Vim tem centenas de comandos embutidos. Para ver todos os comandos que o Vim possui, consulte `:h ex-cmd-index` ou `:h :index`.

## Aprenda o Modo de Linha de Comando da Maneira Inteligente

Comparado aos outros três modos, o modo de linha de comando é como o canivete suíço da edição de texto. Você pode editar texto, modificar arquivos e executar comandos, apenas para citar alguns. Este capítulo é uma coleção de detalhes do modo de linha de comando. Ele também traz os modos do Vim para um fechamento. Agora que você sabe como usar os modos normal, de inserção, visual e de linha de comando, você pode editar texto com o Vim mais rápido do que nunca.

É hora de se afastar dos modos do Vim e aprender como fazer uma navegação ainda mais rápida com as tags do Vim.