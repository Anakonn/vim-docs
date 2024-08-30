---
description: Aprenda a usar o recurso de dobradura no Vim para ocultar textos irrelevantes,
  facilitando a leitura e compreensão de arquivos.
title: Ch17. Fold
---

Quando você lê um arquivo, muitas vezes há muitos textos irrelevantes que dificultam a compreensão do que esse arquivo faz. Para ocultar o ruído desnecessário, use o fold do Vim.

Neste capítulo, você aprenderá diferentes maneiras de dobrar um arquivo.

## Dobra Manual

Imagine que você está dobrando uma folha de papel para cobrir algum texto. O texto real não desaparece, ele ainda está lá. O fold do Vim funciona da mesma maneira. Ele dobra um intervalo de texto, ocultando-o da exibição sem realmente excluí-lo.

O operador de dobra é `z` (quando um papel é dobrado, ele tem a forma da letra z).

Suponha que você tenha este texto:

```shell
Dobre-me
Segure-me
```

Com o cursor na primeira linha, digite `zfj`. O Vim dobra ambas as linhas em uma. Você deve ver algo como isto:

```shell
+-- 2 linhas: Dobre-me -----
```

Aqui está a explicação:
- `zf` é o operador de dobra.
- `j` é o movimento para o operador de dobra.

Você pode abrir um texto dobrado com `zo`. Para fechar a dobra, use `zc`.

A dobra é um operador, então segue a regra gramatical (`verbo + substantivo`). Você pode passar o operador de dobra com um movimento ou objeto de texto. Para dobrar um parágrafo interno, execute `zfip`. Para dobrar até o final de um arquivo, execute `zfG`. Para dobrar os textos entre `{` e `}`, execute `zfa{`.

Você pode dobrar a partir do modo visual. Destaque a área que deseja dobrar (`v`, `V` ou `Ctrl-v`), então execute `zf`.

Você pode executar uma dobra a partir do modo de linha de comando com o comando `:fold`. Para dobrar a linha atual e a linha seguinte, execute:

```shell
:,+1fold
```

`,+1` é o intervalo. Se você não passar parâmetros para o intervalo, ele padrão para a linha atual. `+1` é o indicador de intervalo para a próxima linha. Para dobrar as linhas de 5 a 10, execute `:5,10fold`. Para dobrar da posição atual até o final da linha, execute `:,$fold`.

Existem muitos outros comandos de dobra e desdobramento. Eu os considero muitos para lembrar quando estou começando. Os mais úteis são:
- `zR` para abrir todas as dobras.
- `zM` para fechar todas as dobras.
- `za` alternar uma dobra.

Você pode executar `zR` e `zM` em qualquer linha, mas `za` só funciona quando você está em uma linha dobrada / desdobrada. Para aprender mais comandos de dobra, confira `:h fold-commands`.

## Diferentes Métodos de Dobra

A seção acima cobre a dobra manual do Vim. Existem seis métodos de dobra diferentes no Vim:
1. Manual
2. Indentação
3. Expressão
4. Sintaxe
5. Diferença
6. Marcador

Para ver qual método de dobra você está usando atualmente, execute `:set foldmethod?`. Por padrão, o Vim usa o método `manual`.

No restante do capítulo, você aprenderá os outros cinco métodos de dobra. Vamos começar com a dobra por indentação.

## Dobra por Indentação

Para usar uma dobra por indentação, mude o `'foldmethod'` para indentação:

```shell
:set foldmethod=indent
```

Suponha que você tenha o texto:

```shell
Um
  Dois
  Dois novamente
```

Se você executar `:set foldmethod=indent`, você verá:

```shell
Um
+-- 2 linhas: Dois -----
```

Com a dobra por indentação, o Vim observa quantos espaços cada linha tem no início e compara isso com a opção `'shiftwidth'` para determinar sua dobrabilidade. `'shiftwidth'` retorna o número de espaços necessários para cada passo da indentação. Se você executar:

```shell
:set shiftwidth?
```

O valor padrão de `'shiftwidth'` do Vim é 2. No texto acima, há dois espaços entre o início da linha e o texto "Dois" e "Dois novamente". Quando o Vim vê o número de espaços e que o valor de `'shiftwidth'` é 2, o Vim considera que essa linha tem um nível de dobra de indentação de um.

Suponha que desta vez você tenha apenas um espaço entre o início da linha e o texto:

```shell
Um
 Dois
 Dois novamente
```

Neste momento, se você executar `:set foldmethod=indent`, o Vim não dobra a linha indentada porque não há espaço suficiente em cada linha. Um espaço não é considerado uma indentação. No entanto, se você mudar o `'shiftwidth'` para 1:

```shell
:set shiftwidth=1
```

O texto agora é dobrável. Agora é considerado uma indentação.

Restaure o `shiftwidth` de volta para 2 e os espaços entre os textos para dois novamente. Além disso, adicione dois textos adicionais:

```shell
Um
  Dois
  Dois novamente
    Três
    Três novamente
```

Execute a dobra (`zM`), você verá:

```shell
Um
+-- 4 linhas: Dois -----
```

Desdobre as linhas dobradas (`zR`), então coloque o cursor em "Três" e alterne o estado de dobra do texto (`za`):

```shell
Um
  Dois
  Dois novamente
+-- 2 linhas: Três -----
```

O que é isso? Uma dobra dentro de uma dobra?

Dobra aninhada é válida. O texto "Dois" e "Dois novamente" têm nível de dobra um. O texto "Três" e "Três novamente" têm nível de dobra dois. Se você tiver um texto dobrável com um nível de dobra mais alto dentro de um texto dobrável, você terá várias camadas de dobra.

## Dobra por Expressão

A dobra por expressão permite que você defina uma expressão para corresponder a uma dobra. Depois de definir as expressões de dobra, o Vim escaneia cada linha em busca do valor de `'foldexpr'`. Esta é a variável que você deve configurar para retornar o valor apropriado. Se o `'foldexpr'` retornar 0, então a linha não é dobrada. Se retornar 1, então essa linha tem um nível de dobra de 1. Se retornar 2, então essa linha tem um nível de dobra de 2. Existem mais valores além de inteiros, mas não vou abordá-los. Se você estiver curioso, confira `:h fold-expr`.

Primeiro, vamos mudar o método de dobra:

```shell
:set foldmethod=expr
```

Suponha que você tenha uma lista de alimentos para o café da manhã e queira dobrar todos os itens de café da manhã que começam com "p":

```shell
donut
panqueca
pop-tarts
barra de proteína
salmão
ovos mexidos
```

Em seguida, mude o `foldexpr` para capturar as expressões que começam com "p":

```shell
:set foldexpr=getline(v:lnum)[0]==\\"p\\"
```

A expressão acima parece complicada. Vamos dividi-la:
- `:set foldexpr` configura a opção `'foldexpr'` para aceitar uma expressão personalizada.
- `getline()` é uma função do Vimscript que retorna o conteúdo de qualquer linha dada. Se você executar `:echo getline(5)`, ele retornará o conteúdo da linha 5.
- `v:lnum` é a variável especial do Vim para a expressão `'foldexpr'`. O Vim escaneia cada linha e, naquele momento, armazena o número de cada linha na variável `v:lnum`. Na linha 5, `v:lnum` tem o valor de 5. Na linha 10, `v:lnum` tem o valor de 10.
- `[0]` no contexto de `getline(v:lnum)[0]` é o primeiro caractere de cada linha. Quando o Vim escaneia uma linha, `getline(v:lnum)` retorna o conteúdo de cada linha. `getline(v:lnum)[0]` retorna o primeiro caractere de cada linha. Na primeira linha da nossa lista, "donut", `getline(v:lnum)[0]` retorna "d". Na segunda linha da nossa lista, "panqueca", `getline(v:lnum)[0]` retorna "p".
- `==\\"p\\"` é a segunda metade da expressão de igualdade. Ela verifica se a expressão que você acabou de avaliar é igual a "p". Se for verdadeira, retorna 1. Se for falsa, retorna 0. No Vim, 1 é verdadeiro e 0 é falso. Portanto, nas linhas que começam com "p", retorna 1. Lembre-se de que se um `'foldexpr'` tem um valor de 1, então tem um nível de dobra de 1.

Após executar essa expressão, você deve ver:

```shell
donut
+-- 3 linhas: panqueca -----
salmão
ovos mexidos
```

## Dobra por Sintaxe

A dobra por sintaxe é determinada pela realce de sintaxe da linguagem. Se você usar um plugin de sintaxe de linguagem como [vim-polyglot](https://github.com/sheerun/vim-polyglot), a dobra por sintaxe funcionará imediatamente. Basta mudar o método de dobra para sintaxe:

```shell
:set foldmethod=syntax
```

Vamos supor que você esteja editando um arquivo JavaScript e tenha o vim-polyglot instalado. Se você tiver um array como o seguinte:

```shell
const nums = [
  um,
  dois,
  três,
  quatro
]
```

Ele será dobrado com uma dobra por sintaxe. Quando você define um realce de sintaxe para uma linguagem específica (normalmente dentro do diretório `syntax/`), você pode adicionar um atributo `fold` para torná-lo dobrável. Abaixo está um trecho do arquivo de sintaxe JavaScript do vim-polyglot. Note a palavra-chave `fold` no final.

```shell
syntax region  jsBracket                      matchgroup=jsBrackets            start=/\[/ end=/\]/ contains=@jsExpression,jsSpreadExpression extend fold
```

Este guia não cobrirá o recurso `sintaxe`. Se você estiver curioso, confira `:h syntax.txt`.

## Dobra por Diferença

O Vim pode realizar um procedimento de diferença para comparar dois ou mais arquivos.

Se você tiver `file1.txt`:

```shell
vim é incrível
vim é incrível
vim é incrível
vim é incrível
vim é incrível
vim é incrível
vim é incrível
vim é incrível
vim é incrível
vim é incrível
```

E `file2.txt`:

```shell
vim é incrível
vim é incrível
vim é incrível
vim é incrível
vim é incrível
vim é incrível
vim é incrível
vim é incrível
emacs é ok
```

Execute `vimdiff file1.txt file2.txt`:

```shell
+-- 3 linhas: vim é incrível -----
vim é incrível
vim é incrível
vim é incrível
vim é incrível
vim é incrível
vim é incrível
[vim é incrível] / [emacs é ok]
```

O Vim dobra automaticamente algumas das linhas idênticas. Quando você executa o comando `vimdiff`, o Vim usa automaticamente `foldmethod=diff`. Se você executar `:set foldmethod?`, ele retornará `diff`.

## Dobra por Marcador

Para usar uma dobra por marcador, execute:

```shell
:set foldmethod=marker
```

Suponha que você tenha o texto:

```shell
Olá

{{{
mundo
vim
}}}
```

Execute `zM`, você verá:

```shell
olá

+-- 4 linhas: -----
```

O Vim vê `{{{` e `}}}` como indicadores de dobra e dobra os textos entre eles. Com a dobra por marcador, o Vim procura marcadores especiais, definidos pela opção `'foldmarker'`, para marcar áreas de dobra. Para ver quais marcadores o Vim usa, execute:

```shell
:set foldmarker?
```

Por padrão, o Vim usa `{{{` e `}}}` como indicadores. Se você quiser mudar o indicador para outros textos, como "café1" e "café2":

```shell
:set foldmarker=café1,café2
```

Se você tiver o texto:

```shell
olá

café1
mundo
vim
café2
```

Agora o Vim usa `café1` e `café2` como os novos marcadores de dobra. Como observação, um indicador deve ser uma string literal e não pode ser uma regex.

## Persistindo Dobra

Você perde todas as informações de dobra quando fecha a sessão do Vim. Se você tiver este arquivo, `count.txt`:

```shell
um
dois
três
quatro
cinco
```

Então faça uma dobra manual da linha "três" para baixo (`:3,$fold`):

```shell
um
dois
+-- 3 linhas: três ---
```

Quando você sair do Vim e reabrir `count.txt`, as dobras não estarão mais lá!

Para preservar as dobras, após dobrar, execute:

```shell
:mkview
```

Então, quando você abrir `count.txt`, execute:

```shell
:loadview
```

Suas dobras são restauradas. No entanto, você deve executar manualmente `mkview` e `loadview`. Eu sei que um dia desses, vou esquecer de executar `mkview` antes de fechar o arquivo e vou perder todas as dobras. Como podemos automatizar esse processo?

Para executar automaticamente `mkview` quando você fechar um arquivo `.txt` e executar `loadview` quando abrir um arquivo `.txt`, adicione isso no seu vimrc:

```shell
autocmd BufWinLeave *.txt mkview
autocmd BufWinEnter *.txt silent loadview
```

Lembre-se de que `autocmd` é usado para executar um comando em um evento de gatilho. Os dois eventos aqui são:
- `BufWinLeave` para quando você remove um buffer de uma janela.
- `BufWinEnter` para quando você carrega um buffer em uma janela.

Agora, depois de dobrar dentro de um arquivo `.txt` e sair do Vim, na próxima vez que você abrir esse arquivo, suas informações de dobra serão restauradas.

Por padrão, o Vim salva as informações de dobra ao executar `mkview` dentro de `~/.vim/view` para o sistema Unix. Para mais informações, confira `:h 'viewdir'`.
## Aprenda a Dobra da Maneira Inteligente

Quando comecei a usar o Vim, negligenciei aprender a dobrar porque não achava que fosse útil. No entanto, quanto mais eu programo, mais útil eu acho que a dobra é. Dobra estrategicamente posicionada pode te dar uma visão melhor da estrutura do texto, como o índice de um livro.

Quando você aprender a dobrar, comece com a dobra manual porque isso pode ser usado em movimento. Depois, gradualmente aprenda diferentes truques para fazer dobras de indentação e de marcadores. Finalmente, aprenda a fazer dobras de sintaxe e de expressão. Você pode até usar essas duas últimas para escrever seus próprios plugins do Vim.