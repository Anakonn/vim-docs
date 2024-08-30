---
description: Aprenda a criar plugins no Vim com o `totitle-vim`, um operador de titlecase
  que melhora a formatação de títulos em seus artigos.
title: 'Ch29. Write a Plugin: Creating a Titlecase Operator'
---

Quando você começa a ficar bom no Vim, pode querer escrever seus próprios plugins. Recentemente, escrevi meu primeiro plugin para Vim, [totitle-vim](https://github.com/iggredible/totitle-vim). É um plugin operador de titlecase, semelhante aos operadores de maiúsculas `gU`, minúsculas `gu` e alternância `g~` do Vim.

Neste capítulo, apresentarei a análise do plugin `totitle-vim`. Espero esclarecer um pouco o processo e talvez inspirá-lo a criar seu próprio plugin único!

## O Problema

Eu uso o Vim para escrever meus artigos, incluindo este guia.

Um dos principais problemas era criar uma capitalização adequada para os títulos. Uma maneira de automatizar isso é capitalizar cada palavra no cabeçalho com `g/^#/ s/\<./\u\0/g`. Para uso básico, esse comando era bom o suficiente, mas ainda não é tão bom quanto ter uma capitalização real. As palavras "The" e "Of" em "Capitalize The First Letter Of Each Word" deveriam ser capitalizadas. Sem uma capitalização adequada, a frase parece um pouco estranha.

A princípio, eu não planejava escrever um plugin. Também descobri que já existe um plugin de titlecase: [vim-titlecase](https://github.com/christoomey/vim-titlecase). No entanto, havia algumas coisas que não funcionavam exatamente da maneira que eu queria. A principal era o comportamento do modo visual em bloco. Se eu tiver a frase:

```shell
test title one
test title two
test title three
```

Se eu usar um destaque visual em bloco na "tle":

```shell
test ti[tle] one
test ti[tle] two
test ti[tle] three
```

Se eu pressionar `gt`, o plugin não capitalizará. Eu acho isso inconsistente com os comportamentos de `gu`, `gU` e `g~`. Então, decidi trabalhar a partir desse repositório do plugin de titlecase e usar isso para criar meu próprio plugin de titlecase que seja consistente com `gu`, `gU` e `g~`!. Novamente, o plugin vim-titlecase em si é um excelente plugin e digno de ser usado por conta própria (a verdade é que, talvez, no fundo, eu só quisesse escrever meu próprio plugin para Vim. Eu realmente não consigo ver o recurso de titlecasing em bloco sendo usado com tanta frequência na vida real, exceto em casos extremos).

### Planejando o Plugin

Antes de escrever a primeira linha de código, preciso decidir quais são as regras de titlecase. Encontrei uma tabela interessante de diferentes regras de capitalização no site [titlecaseconverter](https://titlecaseconverter.com/rules/). Você sabia que existem pelo menos 8 regras diferentes de capitalização na língua inglesa? *Gasp!*

No final, usei os denominadores comuns daquela lista para chegar a uma regra básica boa o suficiente para o plugin. Além disso, duvido que as pessoas reclamem: "Ei cara, você está usando AMA, por que não está usando APA?". Aqui estão as regras básicas:
- A primeira palavra é sempre capitalizada.
- Alguns advérbios, conjunções e preposições são minúsculos.
- Se a palavra de entrada estiver totalmente em maiúsculas, então não faça nada (pode ser uma abreviação).

Quanto a quais palavras são minúsculas, diferentes regras têm listas diferentes. Decidi ficar com `a an and at but by en for in nor of off on or out per so the to up yet vs via`.

### Planejando a Interface do Usuário

Quero que o plugin seja um operador para complementar os operadores de caso existentes do Vim: `gu`, `gU` e `g~`. Sendo um operador, ele deve aceitar tanto um movimento quanto um objeto de texto (`gtw` deve capitalizar a próxima palavra, `gtiw` deve capitalizar a palavra interna, `gt$` deve capitalizar as palavras da localização atual até o final da linha, `gtt` deve capitalizar a linha atual, `gti(` deve capitalizar as palavras dentro dos parênteses, etc). Também quero que seja mapeado para `gt` para facilitar a memorização. Além disso, deve funcionar com todos os modos visuais: `v`, `V` e `Ctrl-V`. Eu deveria ser capaz de destacá-lo em *qualquer* modo visual, pressionar `gt`, então todos os textos destacados serão capitalizados.

## Tempo de Execução do Vim

A primeira coisa que você vê ao olhar para o repositório é que ele tem dois diretórios: `plugin/` e `doc/`. Quando você inicia o Vim, ele procura arquivos e diretórios especiais dentro do diretório `~/.vim` e executa todos os arquivos de script dentro desse diretório. Para mais informações, revise o capítulo de Tempo de Execução do Vim.

O plugin utiliza dois diretórios de tempo de execução do Vim: `doc/` e `plugin/`. `doc/` é um lugar para colocar a documentação de ajuda (para que você possa procurar palavras-chave depois, como `:h totitle`). Vou explicar como criar uma página de ajuda mais tarde. Por enquanto, vamos nos concentrar em `plugin/`. O diretório `plugin/` é executado uma vez quando o Vim é iniciado. Há um arquivo dentro desse diretório: `totitle.vim`. O nome não importa (eu poderia ter nomeado como `whatever.vim` e ainda funcionaria). Todo o código responsável pelo funcionamento do plugin está dentro deste arquivo.

## Mapeamentos

Vamos analisar o código!

No início do arquivo, você tem:

```shell
if !exists('g:totitle_default_keys')
  let g:totitle_default_keys = 1
endif
```

Quando você inicia o Vim, `g:totitle_default_keys` ainda não existirá, então `!exists(...)` retorna verdadeiro. Nesse caso, defina `g:totitle_default_keys` para igual a 1. No Vim, 0 é falso e não-zero é verdadeiro (use 1 para indicar verdadeiro).

Vamos pular para o final do arquivo. Você verá isso:

```shell
if g:totitle_default_keys
  nnoremap <expr> gt ToTitle()
  xnoremap <expr> gt ToTitle()
  nnoremap <expr> gtt ToTitle() .. '_'
endif
```

Aqui é onde o mapeamento principal `gt` é definido. Nesse caso, quando você chega às condicionais `if` no final do arquivo, `if g:totitle_default_keys` retornaria 1 (verdadeiro), então o Vim executa os seguintes mapeamentos:
- `nnoremap <expr> gt ToTitle()` mapeia o *operador* do modo normal. Isso permite que você execute operador + movimento/objeto de texto como `gtw` para capitalizar a próxima palavra ou `gtiw` para capitalizar a palavra interna. Vou explicar os detalhes de como o mapeamento do operador funciona mais tarde.
- `xnoremap <expr> gt ToTitle()` mapeia os operadores do modo visual. Isso permite que você capitaliza os textos que estão visualmente destacados.
- `nnoremap <expr> gtt ToTitle() .. '_'` mapeia o operador de linha do modo normal (análogo a `guu` e `gUU`). Você pode se perguntar o que `.. '_'` faz no final. `..` é o operador de interpolação de string do Vim. `_` é usado como um movimento com um operador. Se você olhar em `:help _`, verá que o sublinhado é usado para contar 1 linha para baixo. Ele executa um operador na linha atual (tente com outros operadores, tente executar `gU_` ou `d_`, note que faz o mesmo que `gUU` ou `dd`).
- Finalmente, o argumento `<expr>` permite que você especifique a contagem, então você pode fazer `3gtw` para alternar a capitalização das próximas 3 palavras.

E se você não quiser usar o mapeamento padrão `gt`? Afinal, você está sobrescrevendo o mapeamento padrão `gt` do Vim (próximo aba). E se você quiser usar `gz` em vez de `gt`? Lembra-se de como você passou pelo trabalho de verificar `if !exists('g:totitle_default_keys')` e `if g:totitle_default_keys`? Se você colocar `let g:totitle_default_keys = 0` no seu vimrc, então `g:totitle_default_keys` já existiria quando o plugin fosse executado (os códigos no seu vimrc são executados antes dos arquivos de tempo de execução `plugin/`), então `!exists('g:totitle_default_keys')` retorna falso. Além disso, `if g:totitle_default_keys` seria falso (porque teria o valor de 0), então também não executaria o mapeamento `gt`! Isso efetivamente permite que você defina seu próprio mapeamento personalizado no Vimrc.

Para definir seu próprio mapeamento de titlecase para `gz`, adicione isso no seu vimrc:

```shell
let g:totitle_default_keys = 0

nnoremap <expr> gz ToTitle()
xnoremap <expr> gz ToTitle()
nnoremap <expr> gzz ToTitle() .. '_'
```

Fácil, fácil.

## A Função ToTitle

A função `ToTitle()` é facilmente a função mais longa deste arquivo.

```shell
 function! ToTitle(type = '')
  if a:type ==# ''
    set opfunc=ToTitle
    return 'g@'
  endif

  " invoca isso ao chamar a função ToTitle()
  if a:type != 'block' && a:type != 'line' && a:type != 'char'
    let l:words = a:type
    let l:wordsArr = trim(l:words)->split('\s\+')
    call map(l:wordsArr, 's:capitalize(v:val)')
    return l:wordsArr->join(' ')
  endif

  " salva as configurações atuais
  let l:sel_save = &selection
  let l:reg_save = getreginfo('"')
  let l:cb_save = &clipboard
  let l:visual_marks_save = [getpos("'<"), getpos("'>")]

  try
    set clipboard= selection=inclusive
    let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}

    silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
    let l:selected_phrase = getreg('"')
    let l:WORD_PATTERN = '\<\k*\>'
    let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'

    let l:startLine = line("'<")
    let l:startCol = virtcol(".")

    " quando o usuário chama uma operação em bloco
    if a:type ==# "block"
      sil! keepj norm! gv"ad
      keepj $
      keepj pu_

      let l:lastLine = line("$")

      sil! keepj norm "ap

      let l:curLine = line(".")

      sil! keepj norm! VGg@
      exe "keepj norm! 0\<c-v>G$h\"ad"
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
      exe "keepj " . l:lastLine
      sil! keepj norm! "_dG
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>"

    " quando o usuário chama uma operação de caractere ou linha
    else
      let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
      let l:titlecased = s:capitalizeFirstWord(l:titlecased)
      call setreg('"', l:titlecased)
      let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
      silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>"
    endif
  finally

    " restaura as configurações
    call setreg('"', l:reg_save)
    call setpos("'<", l:visual_marks_save[0])
    call setpos("'>", l:visual_marks_save[1])
    let &clipboard = l:cb_save
    let &selection = l:sel_save
  endtry
  return
endfunction
```

Isso é muito longo, então vamos dividi-lo. 

*Eu poderia refatorar isso em seções menores, mas para completar este capítulo, deixei como está.*
## A Função Operadora

Aqui está a primeira parte do código:

```shell
if a:type ==# ''
  set opfunc=ToTitle
  return 'g@'
endif
```

O que é `opfunc`? Por que está retornando `g@`?

O Vim tem um operador especial, a função operadora, `g@`. Este operador permite que você use *qualquer* função atribuída à opção `opfunc`. Se eu tiver a função `Foo()` atribuída a `opfunc`, então quando eu executar `g@w`, estarei executando `Foo()` na próxima palavra. Se eu executar `g@i(`, então estou executando `Foo()` nos parênteses internos. Esta função operadora é crítica para criar seu próprio operador no Vim.

A linha seguinte atribui `opfunc` à função `ToTitle`.

```shell
set opfunc=ToTitle
```

A próxima linha está literalmente retornando `g@`:

```shell
return g@
```

Então, exatamente como essas duas linhas funcionam e por que está retornando `g@`?

Vamos supor que você tenha o seguinte mapeamento:

```shell
nnoremap <expr> gt ToTitle()`
```

Então você pressiona `gtw` (tornar a próxima palavra em título). A primeira vez que você executa `gtw`, o Vim chama o método `ToTitle()`. Mas neste momento `opfunc` ainda está em branco. Você também não está passando nenhum argumento para `ToTitle()`, então terá o valor de `a:type` como `''`. Isso faz com que a expressão condicional verifique o argumento `a:type`, `if a:type ==# ''`, e seja verdadeira. Dentro, você atribui `opfunc` à função `ToTitle` com `set opfunc=ToTitle`. Agora `opfunc` está atribuído a `ToTitle`. Finalmente, depois de atribuir `opfunc` à função `ToTitle`, você retorna `g@`. Vou explicar por que retorna `g@` abaixo.

Você ainda não terminou. Lembre-se, você acabou de pressionar `gtw`. Pressionar `gt` fez todas as coisas acima, mas você ainda tem `w` para processar. Ao retornar `g@`, neste ponto, você agora tecnicamente tem `g@w` (é por isso que você tem `return g@`). Como `g@` é o operador de função, você está passando a ele o movimento `w`. Assim, o Vim, ao receber `g@w`, chama `ToTitle` *mais uma vez* (não se preocupe, você não acabará em um loop infinito, como verá em um momento).

Para recapitular, ao pressionar `gtw`, o Vim verifica se `opfunc` está vazio ou não. Se estiver vazio, então o Vim o atribuirá a `ToTitle`. Então ele retorna `g@`, essencialmente chamando `ToTitle` mais uma vez para que você possa usá-lo como um operador. Esta é a parte mais complicada de criar um operador personalizado e você conseguiu! A seguir, você precisa construir a lógica para `ToTitle()` para realmente transformar o texto em título.

## Processando a Entrada

Agora você tem `gt` funcionando como um operador que executa `ToTitle()`. Mas o que você faz a seguir? Como você realmente transforma o texto em título?

Sempre que você executa qualquer operador no Vim, existem três tipos diferentes de movimento de ação: caractere, linha e bloco. `g@w` (palavra) é um exemplo de uma operação de caractere. `g@j` (uma linha abaixo) é um exemplo de uma operação de linha. A operação de bloco é rara, mas tipicamente quando você faz uma operação de `Ctrl-V` (bloco visual), será contada como uma operação de bloco. Operações que visam alguns caracteres para frente / para trás são geralmente consideradas operações de caractere (`b`, `e`, `w`, `ge`, etc). Operações que visam algumas linhas para baixo / para cima são geralmente consideradas operações de linha (`j`, `k`). Operações que visam colunas para frente, para trás, para cima ou para baixo são geralmente consideradas operações de bloco (normalmente são um movimento forçado em coluna ou um modo visual em bloco; para mais: `:h forced-motion`).

Isso significa que, se você pressionar `g@w`, `g@` passará uma string literal `"char"` como argumento para `ToTitle()`. Se você fizer `g@j`, `g@` passará uma string literal `"line"` como argumento para `ToTitle()`. Esta string é o que será passado para a função `ToTitle` como o argumento `type`.

## Criando Seu Próprio Operador de Função Personalizado

Vamos fazer uma pausa e brincar com `g@` escrevendo uma função dummy:

```shell
function! Test(some_arg)
  echom a:some_arg 
endfunction
```

Agora atribua essa função a `opfunc` executando:

```shell
:set opfunc=Test
```

O operador `g@` executará `Test(some_arg)` e passará com `"char"`, `"line"` ou `"block"` dependendo da operação que você fizer. Execute diferentes operações como `g@iw` (palavra interna), `g@j` (uma linha abaixo), `g@$` (até o final da linha), etc. Veja quais valores diferentes estão sendo ecoados. Para testar a operação de bloco, você pode usar o movimento forçado do Vim para operações de bloco: `g@Ctrl-Vj` (operação de bloco uma coluna abaixo).

Você também pode usá-lo com o modo visual. Use os vários destaques visuais como `v`, `V` e `Ctrl-V` e depois pressione `g@` (esteja avisado, ele irá piscar a saída do eco muito rapidamente, então você precisa ter um olho rápido - mas o eco definitivamente está lá. Além disso, como você está usando `echom`, pode verificar as mensagens de eco gravadas com `:messages`).

Bem legal, não é? As coisas que você pode programar com o Vim! Por que não ensinaram isso na escola? Vamos continuar com nosso plugin.

## ToTitle Como uma Função

Avançando para as próximas linhas:

```shell
if a:type != 'block' && a:type != 'line' && a:type != 'char'
  let l:words = a:type
  let l:wordsArr = trim(l:words)->split('\s\+')
  call map(l:wordsArr, 's:capitalize(v:val)')
  return l:wordsArr->join(' ')
endif
```

Esta linha na verdade não tem nada a ver com o comportamento de `ToTitle()` como um operador, mas para habilitá-lo como uma função TitleCase chamável (sim, eu sei que estou violando o Princípio da Responsabilidade Única). A motivação é que o Vim tem funções nativas `toupper()` e `tolower()` que transformarão em maiúsculas e minúsculas qualquer string dada. Ex: `:echo toupper('hello')` retorna `'HELLO'` e `:echo tolower('HELLO')` retorna `'hello'`. Eu quero que este plugin tenha a capacidade de executar `ToTitle` para que você possa fazer `:echo ToTitle('era uma vez')` e obter um valor de retorno `'Era Uma Vez'`.

Até agora, você sabe que quando está chamando `ToTitle(type)` com `g@`, o argumento `type` terá um valor de `'block'`, `'line'` ou `'char'`. Se o argumento não for `'block'`, nem `'line'`, nem `'char'`, você pode assumir com segurança que `ToTitle()` está sendo chamado fora de `g@`. Nesse caso, você os divide por espaços em branco (`\s\+`) com:

```shell
let l:wordsArr = trim(l:words)->split('\s\+')
```

Então você capitaliza cada elemento:

```shell
call map(l:wordsArr, 's:capitalize(v:val)')
```

Antes de juntá-los novamente:

```shell
l:wordsArr->join(' ')
```

A função `capitalize()` será abordada mais tarde.

## Variáveis Temporárias

As próximas linhas:

```shell
let l:sel_save = &selection
let l:reg_save = getreginfo('"')
let l:cb_save = &clipboard
let l:visual_marks_save = [getpos("'<"), getpos("'>")]
```

Essas linhas preservam vários estados atuais em variáveis temporárias. Mais tarde, você usará modos visuais, marcas e registros. Fazer isso irá alterar alguns estados. Como você não quer revisar o histórico, precisa salvá-los em variáveis temporárias para que possa restaurar os estados mais tarde.
## Capitalizando as Seleções

As próximas linhas são importantes:

```shell
try
  set clipboard= selection=inclusive
  let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}

  silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
  let l:selected_phrase = getreg('"')
  let l:WORD_PATTERN = '\<\k*\>'
  let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'

  let l:startLine = line("'<")
  let l:startCol = virtcol(".")
```
Vamos analisá-las em pequenos trechos. Esta linha:

```shell
set clipboard= selection=inclusive
```

Você primeiro define a opção `selection` como inclusiva e o `clipboard` como vazio. O atributo de seleção é tipicamente usado com o modo visual e existem três valores possíveis: `old`, `inclusive` e `exclusive`. Defini-lo como inclusivo significa que o último caractere da seleção está incluído. Não vou cobri-los aqui, mas o ponto é que escolher ser inclusivo faz com que se comporte de maneira consistente no modo visual. Por padrão, o Vim o define como inclusivo, mas você o define aqui de qualquer forma, caso um dos seus plugins o defina como um valor diferente. Confira `:h 'clipboard'` e `:h 'selection'` se você estiver curioso sobre o que eles realmente fazem.

Em seguida, você tem este hash de aparência estranha seguido de um comando de execução:

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
```

Primeiro, a sintaxe `#{}` é o tipo de dado dicionário do Vim. A variável local `l:commands` é um hash com 'lines', 'char' e 'block' como suas chaves. O comando `silent exe '...'` executa qualquer comando dentro da string silenciosamente (caso contrário, ele exibirá notificações na parte inferior da sua tela).

Em segundo lugar, os comandos executados são `'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')`. O primeiro, `noautocmd`, executará o comando subsequente sem acionar nenhum autocomando. O segundo, `keepjumps`, é para não registrar o movimento do cursor enquanto se move. No Vim, certos movimentos são automaticamente registrados na lista de mudanças, na lista de saltos e na lista de marcas. Isso evita isso. O objetivo de ter `noautocmd` e `keepjumps` é prevenir efeitos colaterais. Finalmente, o comando `normal` executa as strings como comandos normais. O `..` é a sintaxe de interpolação de string do Vim. `get()` é um método getter que aceita uma lista, blob ou dicionário. Neste caso, você está passando o dicionário `l:commands`. A chave é `a:type`. Você aprendeu anteriormente que `a:type` é um dos três valores de string: 'char', 'line' ou 'block'. Portanto, se `a:type` for 'line', você estará executando `"noautocmd keepjumps normal! '[V']y"` (para mais, confira `:h silent`, `:h :exe`, `:h :noautocmd`, `:h :keepjumps`, `:h :normal` e `:h get()`).

Vamos analisar o que `'[V']y` faz. Primeiro, suponha que você tenha este corpo de texto:

```shell
o segundo café da manhã
é melhor que o primeiro café da manhã
```
Suponha que seu cursor esteja na primeira linha. Então você pressiona `g@j` (executa a função do operador, `g@`, uma linha abaixo, com `j`). `'[` move o cursor para o início do texto alterado ou copiado anteriormente. Embora você tecnicamente não tenha alterado ou copiado nenhum texto com `g@j`, o Vim lembra as localizações dos movimentos de início e fim do comando `g@` com `'[` e `']` (para mais, confira `:h g@`). No seu caso, pressionar `'[` move seu cursor para a primeira linha porque é onde você começou quando executou `g@`. `V` é um comando do modo visual por linha. Finalmente, `']` move seu cursor para o final do texto alterado ou copiado anteriormente, mas neste caso, move seu cursor para o final da sua última operação `g@`. Finalmente, `y` copia o texto selecionado.

O que você acabou de fazer foi copiar o mesmo corpo de texto que você executou `g@`.

Se você olhar os outros dois comandos aqui:

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
```

Todos eles realizam ações semelhantes, exceto que, em vez de usar ações por linha, você estaria usando ações por caractere ou por bloco. Vou parecer redundante, mas em qualquer um dos três casos você está efetivamente copiando o mesmo corpo de texto que você executou `g@`.

Vamos olhar a próxima linha:

```shell
let l:selected_phrase = getreg('"')
```

Esta linha obtém o conteúdo do registro não nomeado (`"`) e o armazena na variável `l:selected_phrase`. Espere um minuto... você não acabou de copiar um corpo de texto? O registro não nomeado atualmente contém o texto que você acabou de copiar. É assim que este plugin consegue obter a cópia do texto.

A próxima linha é um padrão de expressão regular:

```shell
let l:WORD_PATTERN = '\<\k*\>'
```

`\<` e `\>` são padrões de limite de palavra. O caractere que segue `\<` corresponde ao início de uma palavra e o caractere que precede `\>` corresponde ao final de uma palavra. `\k` é o padrão de palavra-chave. Você pode verificar quais caracteres o Vim aceita como palavras-chave com `:set iskeyword?`. Lembre-se de que o movimento `w` no Vim move seu cursor palavra por palavra. O Vim vem com uma noção preconcebida do que é uma "palavra-chave" (você pode até editá-las alterando a opção `iskeyword`). Confira `:h /\<`, `:h /\>`, `:h /\k` e `:h 'iskeyword'` para mais. Finalmente, `*` significa zero ou mais do padrão subsequente.

Na visão geral, `'\<\k*\>'` corresponde a uma palavra. Se você tiver uma string:

```shell
um dois três
```

Corresponder a ela contra o padrão lhe dará três correspondências: "um", "dois" e "três".

Finalmente, você tem outro padrão:

```shell
let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'
```

Lembre-se de que o comando de substituição do Vim pode ser usado com uma expressão com `\={sua-expressão}`. Por exemplo, se você quiser colocar em maiúsculas a string "donut" na linha atual, você pode usar a função `toupper()` do Vim. Você pode conseguir isso executando `:%s/donut/\=toupper(submatch(0))/g`. `submatch(0)` é uma expressão especial usada no comando de substituição. Ela retorna o texto correspondente inteiro.

As próximas duas linhas:

```shell
let l:startLine = line("'<")
let l:startCol = virtcol(".")
```

A expressão `line()` retorna um número de linha. Aqui você a passa com a marca `'<`, representando a primeira linha da última área visual selecionada. Lembre-se de que você usou o modo visual para copiar o texto. `'<` retorna o número da linha do início daquela seleção de área visual. A expressão `virtcol()` retorna um número de coluna do cursor atual. Você estará movendo seu cursor por toda parte em um momento, então você precisa armazenar a localização do seu cursor para que possa retornar aqui mais tarde.

Faça uma pausa aqui e revise tudo até agora. Certifique-se de que você ainda está acompanhando. Quando estiver pronto, vamos continuar.
## Manipulando uma Operação de Bloco

Vamos passar por esta seção:

```shell
if a:type ==# "block"
  sil! keepj norm! gv"ad
  keepj $
  keepj pu_

  let l:lastLine = line("$")

  sil! keepj norm "ap

  let l:curLine = line(".")

  sil! keepj norm! VGg@
  exe "keepj norm! 0\<c-v>G$h\"ad" 
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
  exe "keepj " . l:lastLine
  sil! keepj norm! "_dG
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

É hora de realmente capitalizar seu texto. Lembre-se de que você tem o `a:type` que pode ser 'char', 'line' ou 'block'. Na maioria dos casos, você provavelmente receberá 'char' e 'line'. Mas ocasionalmente, você pode receber um bloco. É raro, mas deve ser tratado mesmo assim. Infelizmente, lidar com um bloco não é tão simples quanto lidar com char e line. Isso exigirá um pouco mais de esforço, mas é viável.

Antes de começar, vamos pegar um exemplo de como você pode obter um bloco. Suponha que você tenha este texto:

```shell
pancake for breakfast
pancake for lunch
pancake for dinner
```

Suponha que seu cursor esteja no "c" de "pancake" na primeira linha. Você então usa o bloco visual (`Ctrl-V`) para selecionar para baixo e para frente para selecionar o "cake" em todas as três linhas:

```shell
pan[cake] for breakfast
pan[cake] for lunch
pan[cake] for dinner
```

Quando você pressiona `gt`, você quer obter:

```shell
panCake for breakfast
panCake for lunch
panCake for dinner

```
Aqui estão suas suposições básicas: quando você destaca os três "cakes" em "pancakes", você está dizendo ao Vim que tem três linhas de palavras que deseja destacar. Essas palavras são "cake", "cake" e "cake". Você espera obter "Cake", "Cake" e "Cake".

Vamos passar para os detalhes da implementação. As próximas linhas têm:

```shell
sil! keepj norm! gv"ad
keepj $
keepj pu_
let l:lastLine = line("$")
sil! keepj norm "ap
let l:curLine = line(".")
```

A primeira linha:

```shell
sil! keepj norm! gv"ad
```

Lembre-se de que `sil!` executa silenciosamente e `keepj` mantém o histórico de saltos ao se mover. Você então executa o comando normal `gv"ad`. `gv` seleciona o último texto destacado visualmente (no exemplo das panquecas, ele irá re-destacar todos os três 'cakes'). `"ad` deleta os textos destacados visualmente e os armazena no registro a. Como resultado, você agora tem:

```shell
pan for breakfast
pan for lunch
pan for dinner
```

Agora você tem 3 *blocos* (não linhas) de 'cakes' armazenados no registro a. Essa distinção é importante. Copiar um texto com o modo visual por linha é diferente de copiar um texto com o modo visual por bloco. Lembre-se disso, pois você verá isso novamente mais tarde.

Em seguida, você tem:

```shell
keepj $
keepj pu_
```

`$` move você para a última linha do seu arquivo. `pu_` insere uma linha abaixo de onde seu cursor está. Você quer executá-los com `keepj` para não alterar o histórico de saltos.

Então você armazena o número da linha da sua última linha (`line("$")`) na variável local `lastLine`.

```shell
let l:lastLine = line("$")
```

Então cole o conteúdo do registro com `norm "ap`.

```shell
sil! keepj norm "ap
```

Lembre-se de que isso está acontecendo na nova linha que você criou abaixo da última linha do arquivo - você está atualmente na parte inferior do arquivo. Colar dá a você esses textos *de bloco*:

```shell
cake
cake
cake
```

Em seguida, você armazena a localização da linha atual onde seu cursor está.

```shell
let l:curLine = line(".")
```

Agora vamos para as próximas linhas:

```shell
sil! keepj norm! VGg@
exe "keepj norm! 0\<c-v>G$h\"ad"
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
exe "keepj " . l:lastLine
sil! keepj norm! "_dG
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Esta linha:

```shell
sil! keepj norm! VGg@
```

`VG` destaca visualmente com o modo visual por linha da linha atual até o final do arquivo. Então aqui você está destacando os três blocos de textos 'cake' com destaque por linha (lembre-se da distinção entre bloco e linha). Note que da primeira vez que você colou os três textos "cake", você os estava colando como blocos. Agora você está destacando-os como linhas. Eles podem parecer iguais do lado de fora, mas internamente, o Vim conhece a diferença entre colar blocos de textos e colar linhas de textos.

```shell
cake
cake
cake
```

`g@` é o operador de função, então você está essencialmente fazendo uma chamada recursiva para si mesmo. Mas por quê? O que isso realiza?

Você está fazendo uma chamada recursiva para `g@` e passando-a com todas as 3 linhas (depois de executá-la com `V`, você agora tem linhas, não blocos) de textos 'cake' para que sejam tratadas pela outra parte do código (você verá isso mais tarde). O resultado da execução de `g@` são três linhas de textos corretamente capitalizados:

```shell
Cake
Cake
Cake
```

A próxima linha:

```shell
exe "keepj norm! 0\<c-v>G$h\"ad"
```

Isso executa o comando do modo normal para ir ao início da linha (`0`), usa o destaque visual de bloco para ir até a última linha e o último caractere nessa linha (`<c-v>G$`). O `h` é para ajustar o cursor (quando se faz `$`, o Vim se move uma linha extra para a direita). Finalmente, você deleta o texto destacado e o armazena no registro a (`"ad`).

A próxima linha:

```shell
exe "keepj " . l:startLine
```

Você move seu cursor de volta para onde estava o `startLine`.

Em seguida:

```shell
exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
```

Estando na localização do `startLine`, você agora salta para a coluna marcada por `startCol`. `\<bar>\` é o movimento da barra `|`. O movimento da barra no Vim move seu cursor para a enésima coluna (digamos que o `startCol` era 4. Executar `4|` fará com que seu cursor salte para a posição da coluna 4). Lembre-se de que você `startCol` era a localização onde você armazenou a posição da coluna do texto que queria capitalizar. Finalmente, `"aP` cola os textos armazenados no registro a. Isso coloca o texto de volta onde foi deletado antes.

Vamos olhar as próximas 4 linhas:

```shell
exe "keepj " . l:lastLine
sil! keepj norm! "_dG
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

`exe "keepj " . l:lastLine` move seu cursor de volta para a localização `lastLine` de antes. `sil! keepj norm! "_dG` deleta o(s) espaço(s) extra(s) que foram criados usando o registro blackhole (`"_dG`) para que seu registro não nomeado permaneça limpo. `exe "keepj " . l:startLine` move seu cursor de volta para `startLine`. Finalmente, `exe "sil! keepj norm! " . l:startCol . "\<bar>"` move seu cursor para a coluna `startCol`.

Essas são todas as ações que você poderia ter feito manualmente no Vim. No entanto, o benefício de transformar essas ações em funções reutilizáveis é que elas o salvarão de executar mais de 30 linhas de instruções toda vez que você precisar capitalizar algo. A lição aqui é que qualquer coisa que você possa fazer manualmente no Vim, você pode transformá-la em uma função reutilizável, portanto, um plugin!

Aqui está como ficaria.

Dado algum texto:

```shell
pancake for breakfast
pancake for lunch
pancake for dinner

... algum texto
```

Primeiro, você destaca visualmente de forma bloqueada:

```shell
pan[cake] for breakfast
pan[cake] for lunch
pan[cake] for dinner

... algum texto
```

Então você o deleta e armazena esse texto no registro a:

```shell
pan for breakfast
pan for lunch
pan for dinner

... algum texto
```

Então você cola no final do arquivo:

```shell
pan for breakfast
pan for lunch
pan for dinner

... algum texto
cake
cake
cake
```

Então você capitaliza:

```shell
pan for breakfast
pan for lunch
pan for dinner

... algum texto
Cake
Cake
Cake
```

Finalmente, você coloca o texto capitalizado de volta:

```shell
panCake for breakfast
panCake for lunch
panCake for dinner

... algum texto
```

## Manipulando Operações de Linha e Caractere

Você ainda não terminou. Você apenas abordou o caso extremo quando executa `gt` em textos de bloco. Você ainda precisa lidar com as operações de 'linha' e 'caractere'. Vamos olhar o código `else` para ver como isso é feito.

Aqui estão os códigos:

```shell
if a:type ==# "block"
  # ... 
else
  let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
  let l:titlecased = s:capitalizeFirstWord(l:titlecased)
  call setreg('"', l:titlecased)
  let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
  silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>"
endif
```

Vamos passar por eles linha por linha. O segredo deste plugin está realmente nesta linha:

```shell
let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
```

`@@` contém o texto do registro não nomeado a ser capitalizado. `l:WORD_PATTERN` é a correspondência de palavra individual. `l:UPCASE_REPLACEMENT` é a chamada para o comando `capitalize()` (que você verá mais tarde). O `'g'` é a flag global que instrui o comando de substituição a substituir todas as palavras dadas, não apenas a primeira palavra.

A próxima linha:

```shell
let l:titlecased = s:capitalizeFirstWord(l:titlecased)
```

Isso garante que a primeira palavra será sempre capitalizada. Se você tiver uma frase como "uma maçã por dia mantém o médico longe", uma vez que a primeira palavra, "uma", é uma palavra especial, seu comando de substituição não a capitalizará. Você precisa de um método que sempre capitalize o primeiro caractere, não importa o que. Esta função faz exatamente isso (você verá os detalhes dessa função mais tarde). O resultado desses métodos de capitalização é armazenado na variável local `l:titlecased`.

A próxima linha:

```shell
call setreg('"', l:titlecased)
```

Isso coloca a string capitalizada no registro não nomeado (`"`).

Em seguida, as duas linhas seguintes:

```shell
let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
```

Ei, isso parece familiar! Você viu um padrão semelhante antes com `l:commands`. Em vez de yank, aqui você usa paste (`p`). Confira a seção anterior onde eu passei pelo `l:commands` para um refresco.

Finalmente, essas duas linhas:

```shell
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Você está movendo seu cursor de volta para a linha e coluna onde começou. É isso!

Vamos recapitular. O método de substituição acima é inteligente o suficiente para capitalizar os textos dados e pular as palavras especiais (mais sobre isso mais tarde). Depois de ter uma string capitalizada, você as armazena no registro não nomeado. Então você destaca visualmente o mesmo texto que operou `g@` antes, e então cola do registro não nomeado (isso efetivamente substitui os textos não capitalizados pela versão capitalizada). Finalmente, você move seu cursor de volta para onde começou.
## Limpezas

Você tecnicamente terminou. Os textos agora estão em caixa de título. Tudo o que resta a fazer é restaurar os registros e configurações.

```shell
call setreg('"', l:reg_save)
call setpos("'<", l:visual_marks_save[0])
call setpos("'>", l:visual_marks_save[1])
let &clipboard = l:cb_save
let &selection = l:sel_save
```

Isso restaura:
- o registro sem nome.
- as marcas `<` e `>`.
- as opções `'clipboard'` e `'selection'`.

Ufa, você terminou. Essa foi uma função longa. Eu poderia ter encurtado a função dividindo-a em partes menores, mas por enquanto, isso terá que ser suficiente. Agora vamos revisar brevemente as funções de capitalização.

## A Função de Capitalização

Nesta seção, vamos revisar a função `s:capitalize()`. Assim é que a função se parece:

```shell
function! s:capitalize(string)
    if(toupper(a:string) ==# a:string && a:string != 'A')
        return a:string
    endif

    let l:str = tolower(a:string)
    let l:exclusions = '^\(a\|an\|and\|at\|but\|by\|en\|for\|in\|nor\|of\|off\|on\|or\|out\|per\|so\|the\|to\|up\|yet\|v\.?\|vs\.?\|via\)$'
    if (match(l:str, l:exclusions) >= 0) || (index(s:local_exclusion_list, l:str) >= 0)
      return l:str
    endif

    return toupper(l:str[0]) . l:str[1:]
endfunction
```

Lembre-se de que o argumento para a função `capitalize()`, `a:string`, é a palavra individual passada pelo operador `g@`. Então, se eu estiver executando `gt` no texto "pancake for breakfast", `ToTitle` chamará `capitalize(string)` *três* vezes, uma para "pancake", uma para "for" e uma para "breakfast".

A primeira parte da função é:

```shell
if(toupper(a:string) ==# a:string && a:string != 'A')
  return a:string
endif
```

A primeira condição (`toupper(a:string) ==# a:string`) verifica se a versão em maiúsculas do argumento é a mesma que a string e se a string em si não é "A". Se isso for verdadeiro, então retorne essa string. Isso se baseia na suposição de que se uma determinada palavra já está totalmente em maiúsculas, então é uma abreviação. Por exemplo, a palavra "CEO" seria convertida em "Ceo". Hmm, seu CEO não ficará feliz. Portanto, é melhor deixar qualquer palavra totalmente em maiúsculas como está. A segunda condição, `a:string != 'A'`, aborda um caso especial para um caractere "A" capitalizado. Se `a:string` já é um "A" capitalizado, ele teria passado acidentalmente no teste `toupper(a:string) ==# a:string`. Como "a" é um artigo indefinido em inglês, precisa ser colocado em minúsculas.

A próxima parte força a string a ser convertida para minúsculas:

```shell
let l:str = tolower(a:string)
```

A próxima parte é uma regex de uma lista de todas as exclusões de palavras. Eu as obtive de https://titlecaseconverter.com/rules/ :

```shell
let l:exclusions = '^\(a\|an\|and\|at\|but\|by\|en\|for\|in\|nor\|of\|off\|on\|or\|out\|per\|so\|the\|to\|up\|yet\|v\.?\|vs\.?\|via\)$'
```

A próxima parte:

```shell
if (match(l:str, l:exclusions) >= 0) || (index(s:local_exclusion_list, l:str) >= 0)
  return l:str
endif
```

Primeiro, verifique se sua string é parte da lista de palavras excluídas (`l:exclusions`). Se for, não a capitalize. Em seguida, verifique se sua string é parte da lista de exclusão local (`s:local_exclusion_list`). Esta lista de exclusão é uma lista personalizada que o usuário pode adicionar no vimrc (caso o usuário tenha requisitos adicionais para palavras especiais).

A última parte retorna a versão capitalizada da palavra. O primeiro caractere é colocado em maiúsculas enquanto o restante permanece como está.

```shell
return toupper(l:str[0]) . l:str[1:]
```

Vamos revisar a segunda função de capitalização. A função se parece com isso:

```shell
function! s:capitalizeFirstWord(string)
  if (a:string =~ "\n")
    let l:lineArr = trim(a:string)->split('\n')
    let l:lineArr = map(l:lineArr, 'toupper(v:val[0]) . v:val[1:]')
    return l:lineArr->join("\n")
  endif
  return toupper(a:string[0]) . a:string[1:]
endfunction
```

Esta função foi criada para lidar com um caso especial se você tiver uma frase que começa com uma palavra excluída, como "an apple a day keeps the doctor away". Com base nas regras de capitalização da língua inglesa, todas as primeiras palavras em uma frase, independentemente de serem uma palavra especial ou não, devem ser capitalizadas. Com seu comando `substitute()` sozinho, o "an" em sua frase seria colocado em minúsculas. Você precisa forçar o primeiro caractere a ser colocado em maiúsculas.

Na função `capitalizeFirstWord`, o argumento `a:string` não é uma palavra individual como `a:string` dentro da função `capitalize`, mas sim o texto inteiro. Portanto, se você tiver "pancake for breakfast", o valor de `a:string` é "pancake for breakfast". Ele só executa `capitalizeFirstWord` uma vez para todo o texto.

Um cenário que você precisa observar é se você tiver uma string de várias linhas como `"an apple a day\nkeeps the doctor away"`. Você quer colocar em maiúsculas o primeiro caractere de todas as linhas. Se você não tiver quebras de linha, então simplesmente coloque em maiúsculas o primeiro caractere.

```shell
return toupper(a:string[0]) . a:string[1:]
```

Se você tiver quebras de linha, precisa capitalizar todos os primeiros caracteres em cada linha, então você os divide em um array separado por quebras de linha:

```shell
let l:lineArr = trim(a:string)->split('\n')
```

Então você mapeia cada elemento no array e capitaliza a primeira palavra de cada elemento:

```shell
let l:lineArr = map(l:lineArr, 'toupper(v:val[0]) . v:val[1:]')
```

Finalmente, você junta os elementos do array:

```shell
return l:lineArr->join("\n")
```

E você terminou!

## Docs

O segundo diretório no repositório é o diretório `docs/`. É bom fornecer ao plugin uma documentação completa. Nesta seção, vou revisar brevemente como fazer sua própria documentação de plugin.

O diretório `docs/` é um dos caminhos de tempo de execução especiais do Vim. O Vim lê todos os arquivos dentro do `docs/`, então quando você pesquisa por uma palavra-chave especial e essa palavra-chave é encontrada em um dos arquivos no diretório `docs/`, ela será exibida na página de ajuda. Aqui você tem um `totitle.txt`. Eu o nomeei assim porque esse é o nome do plugin, mas você pode nomeá-lo como quiser.

Um arquivo de docs do Vim é, em essência, um arquivo txt. A diferença entre um arquivo txt comum e um arquivo de ajuda do Vim é que este último usa sintaxes especiais de "ajuda". Mas primeiro, você precisa dizer ao Vim para tratá-lo não como um tipo de arquivo de texto, mas como um tipo de arquivo `help`. Para dizer ao Vim para interpretar este `totitle.txt` como um arquivo *de ajuda*, execute `:set ft=help` (`:h 'filetype'` para mais informações). A propósito, se você quiser dizer ao Vim para interpretar este `totitle.txt` como um arquivo txt *regular*, execute `:set ft=txt`.

### A Sintaxe Especial do Arquivo de Ajuda

Para tornar uma palavra-chave descobrível, envolva essa palavra-chave com asteriscos. Para tornar a palavra-chave `totitle` descobrível quando o usuário pesquisa por `:h totitle`, escreva-a como `*totitle*` no arquivo de ajuda.

Por exemplo, eu tenho essas linhas no topo do meu índice:

```shell
ÍNDICE                                               *totitle*  *totitle-toc*

// mais coisas do TOC
```

Note que eu usei duas palavras-chave: `*totitle*` e `*totitle-toc*` para marcar a seção do índice. Você pode usar quantas palavras-chave quiser. Isso significa que sempre que você pesquisar por `:h totitle` ou `:h totitle-toc`, o Vim o levará a esta localização.

Aqui está outro exemplo, em algum lugar do arquivo:

```shell
2. Uso                                                  *totitle-usage*

// uso
```

Se você pesquisar por `:h totitle-usage`, o Vim o levará a esta seção.

Você também pode usar links internos para se referir a outra seção no arquivo de ajuda envolvendo uma palavra-chave com a sintaxe de barra `|`. Na seção do TOC, você vê palavras-chave cercadas pelas barras, como `|totitle-intro|`, `|totitle-usage|`, etc.

```shell
ÍNDICE                                               *totitle*  *totitle-toc*

    1. Introdução ........................... |totitle-intro|
    2. Uso ................................. |totitle-usage|
    3. Palavras a capitalizar ............... |totitle-words|
    4. Operador .............................. |totitle-operator|
    5. Atalhos ............................... |totitle-keybinding|
    6. Bugs .................................. |totitle-bug-report|
    7. Contribuindo .......................... |totitle-contributing|
    8. Créditos ............................... |totitle-credits|

```
Isso permite que você salte para a definição. Se você colocar o cursor em algum lugar em `|totitle-intro|` e pressionar `Ctrl-]`, o Vim saltará para a definição dessa palavra. Neste caso, ele saltará para a localização `*totitle-intro*`. É assim que você pode vincular diferentes palavras-chave em um documento de ajuda.

Não há uma maneira certa ou errada de escrever um arquivo de docs no Vim. Se você olhar para diferentes plugins de diferentes autores, muitos deles usam formatos diferentes. O ponto é fazer um documento de ajuda fácil de entender para seus usuários.

Finalmente, se você estiver escrevendo seu próprio plugin localmente no início e quiser testar a página de documentação, simplesmente adicionar um arquivo txt dentro do `~/.vim/docs/` não tornará automaticamente suas palavras-chave pesquisáveis. Você precisa instruir o Vim a adicionar sua página de docs. Execute o comando helptags: `:helptags ~/.vim/doc` para criar novos arquivos de tags. Agora você pode começar a pesquisar suas palavras-chave.

## Conclusão

Você chegou ao final! Este capítulo é a amalgamação de todos os capítulos de Vimscript. Aqui você finalmente está colocando em prática o que aprendeu até agora. Espero que, ao ler isso, você tenha entendido não apenas como criar plugins do Vim, mas também tenha sido incentivado a escrever seu próprio plugin.

Sempre que você se encontrar repetindo a mesma sequência de ações várias vezes, você deve tentar criar o seu próprio! Dizem que você não deve reinventar a roda. No entanto, eu acho que pode ser benéfico reinventar a roda para fins de aprendizado. Leia os plugins de outras pessoas. Recrie-os. Aprenda com eles. Escreva o seu próprio! Quem sabe, talvez você escreva o próximo plugin incrível e super popular depois de ler isso. Talvez você se torne o próximo lendário Tim Pope. Quando isso acontecer, me avise!