---
description: Aprende a crear tu propio plugin de Vim con el ejemplo de `totitle-vim`,
  un operador para convertir texto a formato de título de manera eficiente.
title: 'Ch29. Write a Plugin: Creating a Titlecase Operator'
---

Cuando comienzas a mejorar en Vim, es posible que desees escribir tus propios complementos. Recientemente escribí mi primer complemento de Vim, [totitle-vim](https://github.com/iggredible/totitle-vim). Es un complemento operador de título, similar a los operadores de mayúsculas `gU`, minúsculas `gu` y alternar mayúsculas `g~` de Vim.

En este capítulo, presentaré el desglose del complemento `totitle-vim`. ¡Espero arrojar algo de luz sobre el proceso y tal vez inspirarte a crear tu propio complemento único!

## El Problema

Uso Vim para escribir mis artículos, incluyendo esta misma guía.

Un problema principal era crear un título adecuado para los encabezados. Una forma de automatizar esto es capitalizar cada palabra en el encabezado con `g/^#/ s/\<./\u\0/g`. Para un uso básico, este comando era lo suficientemente bueno, pero aún no es tan bueno como tener un título real. Las palabras "The" y "Of" en "Capitalize The First Letter Of Each Word" deberían estar capitalizadas. Sin una capitalización adecuada, la oración se ve un poco extraña.

Al principio, no planeaba escribir un complemento. También resulta que ya existe un complemento de título: [vim-titlecase](https://github.com/christoomey/vim-titlecase). Sin embargo, había algunas cosas que no funcionaban de la manera que quería. La principal era el comportamiento del modo visual por bloques. Si tengo la frase:

```shell
test title one
test title two
test title three
```

Si uso un resaltado visual por bloques en el "tle":

```shell
test ti[tle] one
test ti[tle] two
test ti[tle] three
```

Si presiono `gt`, el complemento no lo capitalizará. Lo encuentro inconsistente con los comportamientos de `gu`, `gU` y `g~`. Así que decidí trabajar a partir de ese repositorio del complemento de título y usarlo para crear un complemento de título que sea consistente con `gu`, `gU` y `g~`!. Nuevamente, el complemento vim-titlecase en sí es un excelente complemento y digno de ser utilizado por sí solo (la verdad es que, tal vez en el fondo, solo quería escribir mi propio complemento de Vim. No puedo ver realmente que la función de capitalización por bloques se use tan a menudo en la vida real, más allá de casos extremos).

### Planificación del Complemento

Antes de escribir la primera línea de código, necesito decidir cuáles son las reglas de capitalización. Encontré una tabla interesante de diferentes reglas de capitalización en el [sitio titlecaseconverter](https://titlecaseconverter.com/rules/). ¿Sabías que hay al menos 8 reglas diferentes de capitalización en el idioma inglés? *¡Increíble!*

Al final, utilicé los denominadores comunes de esa lista para llegar a una regla básica lo suficientemente buena para el complemento. Además, dudo que la gente se queje: "Oye, hombre, estás usando AMA, ¿por qué no usas APA?". Aquí están las reglas básicas:
- La primera palabra siempre se escribe en mayúsculas.
- Algunos adverbios, conjunciones y preposiciones se escriben en minúsculas.
- Si la palabra de entrada está completamente en mayúsculas, entonces no se hace nada (podría ser una abreviatura).

En cuanto a qué palabras se escriben en minúsculas, diferentes reglas tienen diferentes listas. Decidí quedarme con `a an and at but by en for in nor of off on or out per so the to up yet vs via`.

### Planificación de la Interfaz de Usuario

Quiero que el complemento sea un operador para complementar los operadores de caso existentes de Vim: `gu`, `gU` y `g~`. Siendo un operador, debe aceptar ya sea un movimiento o un objeto de texto (`gtw` debería capitalizar la siguiente palabra, `gtiw` debería capitalizar la palabra interna, `gt$` debería capitalizar las palabras desde la ubicación actual hasta el final de la línea, `gtt` debería capitalizar la línea actual, `gti(` debería capitalizar las palabras dentro de paréntesis, etc.). También quiero que esté mapeado a `gt` para facilitar la memorización. Además, también debería funcionar con todos los modos visuales: `v`, `V` y `Ctrl-V`. Debería poder resaltarlo en *cualquier* modo visual, presionar `gt`, y luego todos los textos resaltados serán capitalizados.

## Tiempo de Ejecución de Vim

Lo primero que ves cuando miras el repositorio es que tiene dos directorios: `plugin/` y `doc/`. Cuando inicias Vim, busca archivos y directorios especiales dentro del directorio `~/.vim` y ejecuta todos los archivos de script dentro de ese directorio. Para más información, revisa el capítulo de Tiempo de Ejecución de Vim.

El complemento utiliza dos directorios de tiempo de ejecución de Vim: `doc/` y `plugin/`. `doc/` es un lugar para poner la documentación de ayuda (así puedes buscar palabras clave más tarde, como `:h totitle`). Más adelante, explicaré cómo crear una página de ayuda. Por ahora, centrémonos en `plugin/`. El directorio `plugin/` se ejecuta una vez cuando Vim se inicia. Hay un archivo dentro de este directorio: `totitle.vim`. El nombre no importa (podría haberlo llamado `whatever.vim` y aún funcionaría). Todo el código responsable de que el complemento funcione está dentro de este archivo.

## Mapeos

¡Vamos a revisar el código!

Al inicio del archivo, tienes:

```shell
if !exists('g:totitle_default_keys')
  let g:totitle_default_keys = 1
endif
```

Cuando inicias Vim, `g:totitle_default_keys` aún no existirá, por lo que `!exists(...)` devuelve verdadero. En ese caso, define `g:totitle_default_keys` para que sea igual a 1. En Vim, 0 es falso y cualquier número distinto de cero es verdadero (usa 1 para indicar verdadero).

Saltemos al final del archivo. Verás esto:

```shell
if g:totitle_default_keys
  nnoremap <expr> gt ToTitle()
  xnoremap <expr> gt ToTitle()
  nnoremap <expr> gtt ToTitle() .. '_'
endif
```

Aquí es donde se define el mapeo principal `gt`. En este caso, para cuando llegues a las condiciones `if` al final del archivo, `if g:totitle_default_keys` devolvería 1 (verdadero), así que Vim realiza los siguientes mapeos:
- `nnoremap <expr> gt ToTitle()` mapea el *operador* en modo normal. Esto te permite ejecutar operador + movimiento/objeto de texto como `gtw` para capitalizar la siguiente palabra o `gtiw` para capitalizar la palabra interna. Más adelante explicaré los detalles de cómo funciona el mapeo del operador.
- `xnoremap <expr> gt ToTitle()` mapea los operadores en modo visual. Esto te permite capitalizar los textos que están resaltados visualmente.
- `nnoremap <expr> gtt ToTitle() .. '_'` mapea el operador de línea en modo normal (análogo a `guu` y `gUU`). Te preguntarás qué hace `.. '_'` al final. `..` es el operador de interpolación de cadenas de Vim. `_` se usa como un movimiento con un operador. Si miras en `:help _`, dice que el guion bajo se usa para contar 1 línea hacia abajo. Realiza un operador en la línea actual (pruébalo con otros operadores, intenta ejecutar `gU_` o `d_`, notarás que hace lo mismo que `gUU` o `dd`).
- Finalmente, el argumento `<expr>` te permite especificar la cuenta, así que puedes hacer `3gtw` para capitalizar las siguientes 3 palabras.

¿Qué pasa si no quieres usar el mapeo predeterminado `gt`? Después de todo, estás sobrescribiendo el mapeo predeterminado de Vim `gt` (tab siguiente). ¿Qué pasa si quieres usar `gz` en lugar de `gt`? Recuerda antes cómo pasaste por el problema de verificar `if !exists('g:totitle_default_keys')` y `if g:totitle_default_keys`? Si pones `let g:totitle_default_keys = 0` en tu vimrc, entonces `g:totitle_default_keys` ya existiría cuando se ejecute el complemento (los códigos en tu vimrc se ejecutan antes de los archivos de tiempo de ejecución de `plugin/`), así que `!exists('g:totitle_default_keys')` devuelve falso. Además, `if g:totitle_default_keys` sería falso (porque tendría el valor de 0), ¡así que tampoco se realizará el mapeo `gt`! Esto te permite definir tu propio mapeo personalizado en Vimrc.

Para definir tu propio mapeo de capitalización a `gz`, agrega esto en tu vimrc:

```shell
let g:totitle_default_keys = 0

nnoremap <expr> gz ToTitle()
xnoremap <expr> gz ToTitle()
nnoremap <expr> gzz ToTitle() .. '_'
```

Fácil, ¿verdad?

## La Función ToTitle

La función `ToTitle()` es fácilmente la función más larga en este archivo.

```shell
 function! ToTitle(type = '')
  if a:type ==# ''
    set opfunc=ToTitle
    return 'g@'
  endif

  " invocar esto al llamar a la función ToTitle()
  if a:type != 'block' && a:type != 'line' && a:type != 'char'
    let l:words = a:type
    let l:wordsArr = trim(l:words)->split('\s\+')
    call map(l:wordsArr, 's:capitalize(v:val)')
    return l:wordsArr->join(' ')
  endif

  " guardar la configuración actual
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

    " cuando el usuario llama a una operación por bloque
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

    " cuando el usuario llama a una operación por carácter o línea
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

    " restaurar la configuración
    call setreg('"', l:reg_save)
    call setpos("'<", l:visual_marks_save[0])
    call setpos("'>", l:visual_marks_save[1])
    let &clipboard = l:cb_save
    let &selection = l:sel_save
  endtry
  return
endfunction
```

Esto es muy largo, así que vamos a desglosarlo.

*Podría refactorizar esto en secciones más pequeñas, pero para completar este capítulo, lo dejé tal como está.*
## La Función Operador

Aquí está la primera parte del código:

```shell
if a:type ==# ''
  set opfunc=ToTitle
  return 'g@'
endif
```

¿Qué demonios es `opfunc`? ¿Por qué está devolviendo `g@`?

Vim tiene un operador especial, la función operador, `g@`. Este operador te permite usar *cualquier* función asignada a la opción `opfunc`. Si tengo la función `Foo()` asignada a `opfunc`, entonces cuando ejecuto `g@w`, estoy ejecutando `Foo()` en la siguiente palabra. Si ejecuto `g@i(`, entonces estoy ejecutando `Foo()` en los paréntesis internos. Esta función operador es crítica para crear tu propio operador de Vim.

La siguiente línea asigna `opfunc` a la función `ToTitle`.

```shell
set opfunc=ToTitle
```

La siguiente línea está literalmente devolviendo `g@`:

```shell
return g@
```

Entonces, ¿exactamente cómo funcionan estas dos líneas y por qué está devolviendo `g@`?

Supongamos que tienes el siguiente mapa:

```shell
nnoremap <expr> gt ToTitle()`
```

Entonces presionas `gtw` (título en mayúsculas la siguiente palabra). La primera vez que ejecutas `gtw`, Vim llama al método `ToTitle()`. Pero en este momento `opfunc` todavía está vacío. También no estás pasando ningún argumento a `ToTitle()`, por lo que tendrá un valor de `a:type` de `''`. Esto hace que la expresión condicional verifique el argumento `a:type`, `if a:type ==# ''`, para ser verdadera. Dentro, asignas `opfunc` a la función `ToTitle` con `set opfunc=ToTitle`. Ahora `opfunc` está asignado a `ToTitle`. Finalmente, después de que asignaste `opfunc` a la función `ToTitle`, devuelves `g@`. Explicaré por qué devuelve `g@` a continuación.

Aún no has terminado. Recuerda, acabas de presionar `gtw`. Presionar `gt` hizo todas las cosas anteriores, pero todavía tienes `w` que procesar. Al devolver `g@`, en este punto, ahora técnicamente tienes `g@w` (por eso tienes `return g@`). Dado que `g@` es el operador de función, le estás pasando el movimiento `w`. Así que Vim, al recibir `g@w`, llama a `ToTitle` *una vez más* (no te preocupes, no terminarás en un bucle infinito como verás en un momento).

Para recapitular, al presionar `gtw`, Vim verifica si `opfunc` está vacío o no. Si está vacío, entonces Vim lo asignará con `ToTitle`. Luego devuelve `g@`, esencialmente llamando a `ToTitle` una vez más para que ahora puedas usarlo como un operador. Esta es la parte más complicada de crear un operador personalizado y ¡lo hiciste! A continuación, necesitas construir la lógica para que `ToTitle()` realmente convierta a mayúsculas el texto.

## Procesando la Entrada

Ahora tienes `gt` funcionando como un operador que ejecuta `ToTitle()`. Pero, ¿qué haces a continuación? ¿Cómo conviertes realmente a mayúsculas el texto?

Cada vez que ejecutas cualquier operador en Vim, hay tres tipos diferentes de movimientos de acción: carácter, línea y bloque. `g@w` (palabra) es un ejemplo de una operación de carácter. `g@j` (una línea abajo) es un ejemplo de una operación de línea. La operación de bloque es rara, pero típicamente cuando haces una operación de `Ctrl-V` (bloque visual), se contará como una operación de bloque. Las operaciones que apuntan a algunos caracteres hacia adelante / hacia atrás generalmente se consideran operaciones de carácter (`b`, `e`, `w`, `ge`, etc). Las operaciones que apuntan a algunas líneas hacia abajo / hacia arriba generalmente se consideran operaciones de línea (`j`, `k`). Las operaciones que apuntan a columnas hacia adelante, hacia atrás, hacia arriba o hacia abajo generalmente se consideran operaciones de bloque (normalmente son un movimiento forzado columnar o un modo visual por bloques; para más: `:h forced-motion`).

Esto significa que, si presionas `g@w`, `g@` pasará una cadena literal `"char"` como argumento a `ToTitle()`. Si haces `g@j`, `g@` pasará una cadena literal `"line"` como argumento a `ToTitle()`. Esta cadena es lo que se pasará a la función `ToTitle` como el argumento `type`.

## Creando Tu Propio Operador de Función Personalizado

Paremos y juguemos con `g@` escribiendo una función de prueba:

```shell
function! Test(some_arg)
  echom a:some_arg 
endfunction
```

Ahora asigna esa función a `opfunc` ejecutando:

```shell
:set opfunc=Test
```

El operador `g@` ejecutará `Test(some_arg)` y le pasará ya sea `"char"`, `"line"` o `"block"` dependiendo de qué operación realices. Ejecuta diferentes operaciones como `g@iw` (palabra interna), `g@j` (una línea abajo), `g@$` (hasta el final de la línea), etc. Observa qué diferentes valores se están mostrando. Para probar la operación de bloque, puedes usar el movimiento forzado de Vim para operaciones de bloque: `g@Ctrl-Vj` (operación de bloque una columna abajo).

También puedes usarlo con el modo visual. Usa los diferentes resaltados visuales como `v`, `V` y `Ctrl-V` y luego presiona `g@` (ten cuidado, el eco de salida parpadeará muy rápido, así que necesitas tener un ojo rápido - pero el eco definitivamente está ahí. Además, como estás usando `echom`, puedes verificar los mensajes de eco grabados con `:messages`).

Bastante genial, ¿no? ¡Las cosas que puedes programar con Vim! ¿Por qué no enseñaron esto en la escuela? Continuemos con nuestro plugin.

## ToTitle Como Función

Pasando a las siguientes líneas:

```shell
if a:type != 'block' && a:type != 'line' && a:type != 'char'
  let l:words = a:type
  let l:wordsArr = trim(l:words)->split('\s\+')
  call map(l:wordsArr, 's:capitalize(v:val)')
  return l:wordsArr->join(' ')
endif
```

Esta línea en realidad no tiene nada que ver con el comportamiento de `ToTitle()` como operador, sino que lo habilita como una función callable TitleCase (sí, sé que estoy violando el Principio de Responsabilidad Única). La motivación es que Vim tiene funciones nativas `toupper()` y `tolower()` que convertirán a mayúsculas y minúsculas cualquier cadena dada. Ej: `:echo toupper('hello')` devuelve `'HELLO'` y `:echo tolower('HELLO')` devuelve `'hello'`. Quiero que este plugin tenga la capacidad de ejecutar `ToTitle` para que puedas hacer `:echo ToTitle('una vez había un tiempo')` y obtener un valor de retorno `'Una Vez Había Un Tiempo'`.

Para este momento, sabes que cuando llamas a `ToTitle(type)` con `g@`, el argumento `type` tendrá un valor de ya sea `'block'`, `'line'`, o `'char'`. Si el argumento no es ni `'block'`, ni `'line'`, ni `'char'`, puedes asumir con seguridad que `ToTitle()` está siendo llamado fuera de `g@`. En ese caso, los divides por espacios en blanco (`\s\+`) con:

```shell
let l:wordsArr = trim(l:words)->split('\s\+')
```

Luego capitalizas cada elemento:

```shell
call map(l:wordsArr, 's:capitalize(v:val)')
```

Antes de unirlos de nuevo:

```shell
l:wordsArr->join(' ')
```

La función `capitalize()` se cubrirá más adelante.

## Variables Temporales

Las siguientes líneas:

```shell
let l:sel_save = &selection
let l:reg_save = getreginfo('"')
let l:cb_save = &clipboard
let l:visual_marks_save = [getpos("'<"), getpos("'>")]
```

Estas líneas preservan varios estados actuales en variables temporales. Más adelante en esto usarás modos visuales, marcas y registros. Hacer esto alterará algunos estados. Dado que no quieres revisar el historial, necesitas guardarlos en variables temporales para que puedas restaurar los estados más tarde.
## Capitalizando las Selecciones

Las siguientes líneas son importantes:

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
Vamos a revisarlas en pequeños fragmentos. Esta línea:

```shell
set clipboard= selection=inclusive
```

Primero estableces la opción `selection` como inclusiva y el `clipboard` como vacío. El atributo de selección se utiliza típicamente con el modo visual y hay tres valores posibles: `old`, `inclusive` y `exclusive`. Establecerlo como inclusivo significa que el último carácter de la selección está incluido. No lo cubriré aquí, pero el punto es que elegirlo como inclusivo hace que se comporte de manera consistente en el modo visual. Por defecto, Vim lo establece como inclusivo, pero lo estableces aquí de todos modos por si alguno de tus plugins lo establece en un valor diferente. Consulta `:h 'clipboard'` y `:h 'selection'` si tienes curiosidad sobre lo que realmente hacen.

A continuación, tienes este hash de aspecto extraño seguido de un comando de ejecución:

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
```

Primero, la sintaxis `#{}` es el tipo de dato diccionario de Vim. La variable local `l:commands` es un hash con 'lines', 'char' y 'block' como sus claves. El comando `silent exe '...'` ejecuta cualquier comando dentro de la cadena de forma silenciosa (de lo contrario, mostrará notificaciones en la parte inferior de tu pantalla).

En segundo lugar, los comandos ejecutados son `'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')`. El primero, `noautocmd`, ejecutará el comando subsiguiente sin activar ningún autocomando. El segundo, `keepjumps`, es para no registrar el movimiento del cursor mientras te mueves. En Vim, ciertos movimientos se registran automáticamente en la lista de cambios, la lista de saltos y la lista de marcas. Esto previene eso. El objetivo de tener `noautocmd` y `keepjumps` es prevenir efectos secundarios. Finalmente, el comando `normal` ejecuta las cadenas como comandos normales. El `..` es la sintaxis de interpolación de cadenas de Vim. `get()` es un método getter que acepta una lista, blob o diccionario. En este caso, le estás pasando el diccionario `l:commands`. La clave es `a:type`. Aprendiste anteriormente que `a:type` es uno de los tres valores de cadena: 'char', 'line' o 'block'. Así que si `a:type` es 'line', estarás ejecutando `"noautocmd keepjumps normal! '[V']y"` (para más información, consulta `:h silent`, `:h :exe`, `:h :noautocmd`, `:h :keepjumps`, `:h :normal`, y `:h get()`).

Veamos qué hace `'[V']y`. Primero, supón que tienes este cuerpo de texto:

```shell
el segundo desayuno
es mejor que el primer desayuno
```
Supón que tu cursor está en la primera línea. Luego presionas `g@j` (ejecutar la función del operador, `g@`, una línea abajo, con `j`). `'[` mueve el cursor al inicio del texto previamente cambiado o yankado. Aunque técnicamente no cambiaste ni yankaste ningún texto con `g@j`, Vim recuerda las ubicaciones de los movimientos de inicio y fin del comando `g@` con `'[` y `']` (para más, consulta `:h g@`). En tu caso, presionar `'[` mueve tu cursor a la primera línea porque ahí es donde comenzaste cuando ejecutaste `g@`. `V` es un comando del modo visual por líneas. Finalmente, `']` mueve tu cursor al final del texto previamente cambiado o yankado, pero en este caso, mueve tu cursor al final de tu última operación `g@`. Finalmente, `y` yankea el texto seleccionado.

Lo que acabas de hacer fue yankear el mismo cuerpo de texto sobre el que realizaste `g@`.

Si miras los otros dos comandos aquí:

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
```

Todos realizan acciones similares, excepto que en lugar de usar acciones por líneas, estarías usando acciones por caracteres o por bloques. Voy a sonar redundante, pero en cualquiera de los tres casos, efectivamente estás yankando el mismo cuerpo de texto sobre el que realizaste `g@`.

Veamos la siguiente línea:

```shell
let l:selected_phrase = getreg('"')
```

Esta línea obtiene el contenido del registro no nombrado (`"`) y lo almacena dentro de la variable `l:selected_phrase`. Espera un momento... ¿no acabas de yankear un cuerpo de texto? El registro no nombrado contiene actualmente el texto que acabas de yankear. Así es como este plugin puede obtener una copia del texto.

La siguiente línea es un patrón de expresión regular:

```shell
let l:WORD_PATTERN = '\<\k*\>'
```

`\<` y `\>` son patrones de límite de palabra. El carácter que sigue a `\<` coincide con el inicio de una palabra y el carácter que precede a `\>` coincide con el final de una palabra. `\k` es el patrón de palabra clave. Puedes verificar qué caracteres acepta Vim como palabras clave con `:set iskeyword?`. Recuerda que el movimiento `w` en Vim mueve tu cursor palabra por palabra. Vim viene con una noción preconcebida de lo que es una "palabra clave" (incluso puedes editarlas alterando la opción `iskeyword`). Consulta `:h /\<`, `:h /\>`, `:h /\k`, y `:h 'iskeyword'` para más información. Finalmente, `*` significa cero o más del patrón subsiguiente.

En términos generales, `'\<\k*\>'` coincide con una palabra. Si tienes una cadena:

```shell
uno dos tres
```

Coincidirla con el patrón te dará tres coincidencias: "uno", "dos" y "tres".

Finalmente, tienes otro patrón:

```shell
let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'
```

Recuerda que el comando de sustitución de Vim puede ser utilizado con una expresión con `\={tu-expresión}`. Por ejemplo, si deseas poner en mayúsculas la cadena "donut" en la línea actual, puedes usar la función `toupper()` de Vim. Puedes lograr esto ejecutando `:%s/donut/\=toupper(submatch(0))/g`. `submatch(0)` es una expresión especial utilizada en el comando de sustitución. Devuelve todo el texto coincidente.

Las siguientes dos líneas:

```shell
let l:startLine = line("'<")
let l:startCol = virtcol(".")
```

La expresión `line()` devuelve un número de línea. Aquí le pasas la marca `'<`, que representa la primera línea del último área visual seleccionada. Recuerda que usaste el modo visual para yankear el texto. `'<` devuelve el número de línea del comienzo de esa selección de área visual. La expresión `virtcol()` devuelve un número de columna del cursor actual. Te estarás moviendo por todas partes en un momento, así que necesitas almacenar la ubicación de tu cursor para poder regresar aquí más tarde.

Tómate un descanso aquí y revisa todo hasta ahora. Asegúrate de que todavía estás siguiendo. Cuando estés listo, continuemos.
## Manejo de una Operación de Bloque

Vamos a repasar esta sección:

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

Es hora de capitalizar tu texto. Recuerda que tienes `a:type` que puede ser 'char', 'line' o 'block'. En la mayoría de los casos, probablemente obtendrás 'char' y 'line'. Pero ocasionalmente puedes obtener un bloque. Es raro, pero debe ser abordado de todos modos. Desafortunadamente, manejar un bloque no es tan sencillo como manejar caracteres y líneas. Tomará un poco de esfuerzo adicional, pero es factible.

Antes de comenzar, tomemos un ejemplo de cómo podrías obtener un bloque. Supón que tienes este texto:

```shell
pancake for breakfast
pancake for lunch
pancake for dinner
```

Supón que tu cursor está en "c" de "pancake" en la primera línea. Luego usas el bloque visual (`Ctrl-V`) para seleccionar hacia abajo y hacia adelante para seleccionar el "cake" en las tres líneas:

```shell
pan[cake] for breakfast
pan[cake] for lunch
pan[cake] for dinner
```

Cuando presionas `gt`, quieres obtener:

```shell
panCake for breakfast
panCake for lunch
panCake for dinner

```
Aquí están tus suposiciones básicas: cuando resaltas los tres "cakes" en "pancakes", le estás diciendo a Vim que tienes tres líneas de palabras que deseas resaltar. Estas palabras son "cake", "cake" y "cake". Esperas obtener "Cake", "Cake" y "Cake".

Pasemos a los detalles de implementación. Las siguientes líneas tienen:

```shell
sil! keepj norm! gv"ad
keepj $
keepj pu_
let l:lastLine = line("$")
sil! keepj norm "ap
let l:curLine = line(".")
```

La primera línea:

```shell
sil! keepj norm! gv"ad
```

Recuerda que `sil!` se ejecuta en silencio y `keepj` mantiene el historial de saltos al moverte. Luego ejecutas el comando normal `gv"ad`. `gv` selecciona el último texto resaltado visualmente (en el ejemplo de los pancakes, volverá a resaltar los tres 'cakes'). `"ad` elimina los textos resaltados visualmente y los almacena en el registro a. Como resultado, ahora tienes:

```shell
pan for breakfast
pan for lunch
pan for dinner
```

Ahora tienes 3 *bloques* (no líneas) de 'cakes' almacenados en el registro a. Esta distinción es importante. Copiar un texto con modo visual de línea es diferente de copiar un texto con modo visual de bloque. Ten esto en cuenta porque lo verás de nuevo más tarde.

A continuación tienes:

```shell
keepj $
keepj pu_
```

`$` te mueve a la última línea de tu archivo. `pu_` inserta una línea debajo de donde está tu cursor. Quieres ejecutarlos con `keepj` para no alterar el historial de saltos.

Luego almacenas el número de línea de tu última línea (`line("$")`) en la variable local `lastLine`.

```shell
let l:lastLine = line("$")
```

Luego pegas el contenido del registro con `norm "ap`.

```shell
sil! keepj norm "ap
```

Ten en cuenta que esto está sucediendo en la nueva línea que creaste debajo de la última línea del archivo - actualmente estás en la parte inferior del archivo. Pegar te da estos textos *de bloque*:

```shell
cake
cake
cake
```

A continuación, almacenas la ubicación de la línea actual donde está tu cursor.

```shell
let l:curLine = line(".")
```

Ahora pasemos a las siguientes líneas:

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

Esta línea:

```shell
sil! keepj norm! VGg@
```

`VG` resalta visualmente desde la línea actual hasta el final del archivo en modo visual de línea. Así que aquí estás resaltando los tres bloques de textos 'cake' con resaltado de línea (recuerda la distinción entre bloque y línea). Ten en cuenta que la primera vez que pegaste los tres textos "cake", los estabas pegando como bloques. Ahora los estás resaltando como líneas. Pueden parecer iguales desde el exterior, pero internamente, Vim conoce la diferencia entre pegar bloques de textos y pegar líneas de textos.

```shell
cake
cake
cake
```

`g@` es el operador de función, así que esencialmente estás haciendo una llamada recursiva a sí mismo. Pero, ¿por qué? ¿Qué logra esto?

Estás haciendo una llamada recursiva a `g@` y pasándole las 3 líneas (después de ejecutarlo con `V`, ahora tienes líneas, no bloques) de textos 'cake' para que sean manejadas por la otra parte del código (esto lo revisarás más tarde). El resultado de ejecutar `g@` son tres líneas de textos correctamente capitalizados:

```shell
Cake
Cake
Cake
```

La siguiente línea:

```shell
exe "keepj norm! 0\<c-v>G$h\"ad"
```

Esto ejecuta el comando de modo normal para ir al principio de la línea (`0`), usar el resaltado visual de bloque para ir a la última línea y al último carácter en esa línea (`<c-v>G$`). El `h` es para ajustar el cursor (cuando haces `$`, Vim se mueve una línea extra a la derecha). Finalmente, eliminas el texto resaltado y lo almacenas en el registro a (`"ad`).

La siguiente línea:

```shell
exe "keepj " . l:startLine
```

Mueves tu cursor de vuelta a donde estaba `startLine`.

A continuación:

```shell
exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
```

Estando en la ubicación de `startLine`, ahora saltas a la columna marcada por `startCol`. `\<bar>\` es el movimiento de barra `|`. El movimiento de barra en Vim mueve tu cursor a la enésima columna (digamos que `startCol` era 4. Ejecutar `4|` hará que tu cursor salte a la posición de columna 4). Recuerda que `startCol` era la ubicación donde almacenaste la posición de columna del texto que querías capitalizar. Finalmente, `"aP` pega los textos almacenados en el registro a. Esto coloca el texto de vuelta donde fue eliminado antes.

Veamos las siguientes 4 líneas:

```shell
exe "keepj " . l:lastLine
sil! keepj norm! "_dG
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

`exe "keepj " . l:lastLine` mueve tu cursor de vuelta a la ubicación de `lastLine` de antes. `sil! keepj norm! "_dG` elimina el/los espacio(s) extra que se crearon usando el registro de agujero negro (`"_dG`) para que tu registro no nombrado se mantenga limpio. `exe "keepj " . l:startLine` mueve tu cursor de vuelta a `startLine`. Finalmente, `exe "sil! keepj norm! " . l:startCol . "\<bar>"` mueve tu cursor a la columna `startCol`.

Estas son todas las acciones que podrías haber hecho manualmente en Vim. Sin embargo, el beneficio de convertir estas acciones en funciones reutilizables es que te ahorrarán ejecutar más de 30 líneas de instrucciones cada vez que necesites capitalizar algo. La lección aquí es que cualquier cosa que puedas hacer manualmente en Vim, puedes convertirla en una función reutilizable, ¡por lo tanto, en un plugin!

Así es como se vería.

Dado un texto:

```shell
pancake for breakfast
pancake for lunch
pancake for dinner

... algún texto
```

Primero, lo resaltas visualmente de manera bloqueada:

```shell
pan[cake] for breakfast
pan[cake] for lunch
pan[cake] for dinner

... algún texto
```

Luego lo eliminas y almacenas ese texto en el registro a:

```shell
pan for breakfast
pan for lunch
pan for dinner

... algún texto
```

Luego lo pegas en la parte inferior del archivo:

```shell
pan for breakfast
pan for lunch
pan for dinner

... algún texto
cake
cake
cake
```

Luego lo capitalizas:

```shell
pan for breakfast
pan for lunch
pan for dinner

... algún texto
Cake
Cake
Cake
```

Finalmente, colocas el texto capitalizado de vuelta:

```shell
panCake for breakfast
panCake for lunch
panCake for dinner

... algún texto
```

## Manejo de Operaciones de Línea y Carácter

Aún no has terminado. Solo has abordado el caso límite cuando ejecutas `gt` en textos de bloque. Aún necesitas manejar las operaciones de 'línea' y 'carácter'. Veamos el código `else` para ver cómo se hace esto.

Aquí están los códigos:

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

Repasemos línea por línea. La clave de este plugin está en esta línea:

```shell
let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
```

`@@` contiene el texto del registro no nombrado que se va a capitalizar. `l:WORD_PATTERN` es la coincidencia de palabra individual. `l:UPCASE_REPLACEMENT` es la llamada al comando `capitalize()` (que verás más adelante). La `'g'` es la bandera global que instruye al comando de sustitución a sustituir todas las palabras dadas, no solo la primera.

La siguiente línea:

```shell
let l:titlecased = s:capitalizeFirstWord(l:titlecased)
```

Esto garantiza que la primera palabra siempre esté capitalizada. Si tienes una frase como "una manzana al día mantiene alejado al doctor", dado que la primera palabra, "una", es una palabra especial, tu comando de sustitución no la capitalizará. Necesitas un método que siempre capitalice el primer carácter sin importar qué. Esta función hace exactamente eso (verás los detalles de esta función más adelante). El resultado de estos métodos de capitalización se almacena en la variable local `l:titlecased`.

La siguiente línea:

```shell
call setreg('"', l:titlecased)
```

Esto coloca la cadena capitalizada en el registro no nombrado (`"`).

A continuación, las siguientes dos líneas:

```shell
let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
```

¡Oye, eso se ve familiar! Has visto un patrón similar antes con `l:commands`. En lugar de yank, aquí usas pegar (`p`). Revisa la sección anterior donde revisé los `l:commands` para un recordatorio.

Finalmente, estas dos líneas:

```shell
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Estás moviendo tu cursor de vuelta a la línea y columna donde comenzaste. ¡Eso es todo!

Recapitulemos. El método de sustitución anterior es lo suficientemente inteligente como para capitalizar los textos dados y omitir las palabras especiales (más sobre esto más adelante). Después de tener una cadena capitalizada, las almacenas en el registro no nombrado. Luego resaltas visualmente el mismo texto sobre el que operaste `g@` antes, luego pegas desde el registro no nombrado (esto efectivamente reemplaza los textos no capitalizados con la versión capitalizada). Finalmente, mueves tu cursor de vuelta a donde comenzaste.
## Limpiezas

Técnicamente has terminado. Los textos ahora están en mayúsculas. Solo queda restaurar los registros y configuraciones.

```shell
call setreg('"', l:reg_save)
call setpos("'<", l:visual_marks_save[0])
call setpos("'>", l:visual_marks_save[1])
let &clipboard = l:cb_save
let &selection = l:sel_save
```

Estos restauran:
- el registro sin nombre.
- las marcas `<` y `>`.
- las opciones `'clipboard'` y `'selection'`.

Uf, has terminado. Esa fue una función larga. Podría haber hecho la función más corta dividiéndola en partes más pequeñas, pero por ahora, eso tendrá que ser suficiente. Ahora revisemos brevemente las funciones de capitalización.

## La Función de Capitalización

En esta sección, revisemos la función `s:capitalize()`. Así es como se ve la función:

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

Recuerda que el argumento para la función `capitalize()`, `a:string`, es la palabra individual pasada por el operador `g@`. Así que si estoy ejecutando `gt` en el texto "pancake for breakfast", `ToTitle` llamará a `capitalize(string)` *tres* veces, una para "pancake", una para "for" y una para "breakfast".

La primera parte de la función es:

```shell
if(toupper(a:string) ==# a:string && a:string != 'A')
  return a:string
endif
```

La primera condición (`toupper(a:string) ==# a:string`) verifica si la versión en mayúsculas del argumento es la misma que la cadena y si la cadena en sí es "A". Si esto es cierto, entonces devuelve esa cadena. Esto se basa en la suposición de que si una palabra dada ya está completamente en mayúsculas, entonces es una abreviatura. Por ejemplo, la palabra "CEO" de otro modo se convertiría en "Ceo". Hmm, tu CEO no estará feliz. Así que es mejor dejar cualquier palabra completamente en mayúsculas como está. La segunda condición, `a:string != 'A'`, aborda un caso especial para un carácter "A" capitalizado. Si `a:string` ya es una "A" capitalizada, habría pasado accidentalmente la prueba `toupper(a:string) ==# a:string`. Debido a que "a" es un artículo indefinido en inglés, necesita estar en minúsculas.

La siguiente parte obliga a que la cadena esté en minúsculas:

```shell
let l:str = tolower(a:string)
```

La siguiente parte es una expresión regular de una lista de todas las exclusiones de palabras. Las obtuve de https://titlecaseconverter.com/rules/ :

```shell
let l:exclusions = '^\(a\|an\|and\|at\|but\|by\|en\|for\|in\|nor\|of\|off\|on\|or\|out\|per\|so\|the\|to\|up\|yet\|v\.?\|vs\.?\|via\)$'
```

La siguiente parte:

```shell
if (match(l:str, l:exclusions) >= 0) || (index(s:local_exclusion_list, l:str) >= 0)
  return l:str
endif
```

Primero, verifica si tu cadena es parte de la lista de palabras excluidas (`l:exclusions`). Si lo es, no la capitalices. Luego verifica si tu cadena es parte de la lista de exclusión local (`s:local_exclusion_list`). Esta lista de exclusión es una lista personalizada que el usuario puede agregar en vimrc (en caso de que el usuario tenga requisitos adicionales para palabras especiales).

La última parte devuelve la versión capitalizada de la palabra. El primer carácter se pone en mayúsculas mientras que el resto permanece igual.

```shell
return toupper(l:str[0]) . l:str[1:]
```

Revisemos la segunda función de capitalización. La función se ve así:

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

Esta función fue creada para manejar un caso especial si tienes una oración que comienza con una palabra excluida, como "an apple a day keeps the doctor away". Según las reglas de capitalización del idioma inglés, todas las primeras palabras en una oración, independientemente de si es una palabra especial o no, deben ser capitalizadas. Con tu comando `substitute()`, el "an" en tu oración se pondría en minúsculas. Necesitas forzar que el primer carácter esté en mayúsculas.

En esta función `capitalizeFirstWord`, el argumento `a:string` no es una palabra individual como `a:string` dentro de la función `capitalize`, sino el texto completo. Así que si tienes "pancake for breakfast", el valor de `a:string` es "pancake for breakfast". Solo ejecuta `capitalizeFirstWord` una vez para todo el texto.

Un escenario que debes tener en cuenta es si tienes una cadena de múltiples líneas como `"an apple a day\nkeeps the doctor away"`. Quieres poner en mayúsculas el primer carácter de todas las líneas. Si no tienes saltos de línea, entonces simplemente pon en mayúsculas el primer carácter.

```shell
return toupper(a:string[0]) . a:string[1:]
```

Si tienes saltos de línea, necesitas capitalizar todos los primeros caracteres en cada línea, así que las divides en un arreglo separado por saltos de línea:

```shell
let l:lineArr = trim(a:string)->split('\n')
```

Luego mapeas cada elemento en el arreglo y capitalizas la primera palabra de cada elemento:

```shell
let l:lineArr = map(l:lineArr, 'toupper(v:val[0]) . v:val[1:]')
```

Finalmente, juntas los elementos del arreglo:

```shell
return l:lineArr->join("\n")
```

¡Y has terminado!

## Documentos

El segundo directorio en el repositorio es el directorio `docs/`. Es bueno proporcionar al plugin una documentación completa. En esta sección, revisaré brevemente cómo hacer la documentación de tu propio plugin.

El directorio `docs/` es uno de los caminos de tiempo de ejecución especiales de Vim. Vim lee todos los archivos dentro de `docs/`, así que cuando buscas una palabra clave especial y esa palabra clave se encuentra en uno de los archivos en el directorio `docs/`, se mostrará en la página de ayuda. Aquí tienes un `totitle.txt`. Lo nombré así porque ese es el nombre del plugin, pero puedes nombrarlo como quieras.

Un archivo de documentos de Vim es un archivo de texto en su esencia. La diferencia entre un archivo de texto regular y un archivo de ayuda de Vim es que este último utiliza sintaxis especiales de "ayuda". Pero primero, necesitas decirle a Vim que lo trate no como un tipo de archivo de texto, sino como un tipo de archivo de `help`. Para decirle a Vim que interprete este `totitle.txt` como un archivo *de ayuda*, ejecuta `:set ft=help` (`:h 'filetype'` para más). Por cierto, si quieres decirle a Vim que interprete este `totitle.txt` como un archivo de texto *regular*, ejecuta `:set ft=txt`.

### La Sintaxis Especial del Archivo de Ayuda

Para hacer que una palabra clave sea descubrible, rodea esa palabra clave con asteriscos. Para hacer que la palabra clave `totitle` sea descubrible cuando el usuario busca `:h totitle`, escríbela como `*totitle*` en el archivo de ayuda.

Por ejemplo, tengo estas líneas en la parte superior de mi tabla de contenidos:

```shell
TABLE OF CONTENTS                                     *totitle*  *totitle-toc*

// más cosas de TOC
```

Ten en cuenta que usé dos palabras clave: `*totitle*` y `*totitle-toc*` para marcar la sección de la tabla de contenidos. Puedes usar tantas palabras clave como desees. Esto significa que cada vez que busques `:h totitle` o `:h totitle-toc`, Vim te llevará a esta ubicación.

Aquí hay otro ejemplo, en algún lugar del archivo:

```shell
2. Uso                                                       *totitle-usage*

// uso
```

Si buscas `:h totitle-usage`, Vim te llevará a esta sección.

También puedes usar enlaces internos para referirte a otra sección en el archivo de ayuda rodeando una palabra clave con la sintaxis de barra `|`. En la sección de TOC, verás palabras clave rodeadas por las barras, como `|totitle-intro|`, `|totitle-usage|`, etc.

```shell
TABLE OF CONTENTS                                     *totitle*  *totitle-toc*

    1. Introducción ........................... |totitle-intro|
    2. Uso ................................. |totitle-usage|
    3. Palabras a capitalizar ............. |totitle-words|
    4. Operador ............................ |totitle-operator|
    5. Asignación de teclas ................ |totitle-keybinding|
    6. Errores .............................. |totitle-bug-report|
    7. Contribuyendo ....................... |totitle-contributing|
    8. Créditos ............................ |totitle-credits|

```
Esto te permite saltar a la definición. Si pones el cursor en algún lugar de `|totitle-intro|` y presionas `Ctrl-]`, Vim saltará a la definición de esa palabra. En este caso, saltará a la ubicación de `*totitle-intro*`. Así es como puedes vincular diferentes palabras clave en un documento de ayuda.

No hay una forma correcta o incorrecta de escribir un archivo de documentos en Vim. Si miras diferentes plugins de diferentes autores, muchos de ellos usan diferentes formatos. El punto es hacer un documento de ayuda fácil de entender para tus usuarios.

Finalmente, si estás escribiendo tu propio plugin localmente al principio y quieres probar la página de documentación, simplemente agregar un archivo de texto dentro de `~/.vim/docs/` no hará que tus palabras clave sean automáticamente buscables. Necesitas instruir a Vim para que agregue tu página de documentos. Ejecuta el comando helptags: `:helptags ~/.vim/doc` para crear nuevos archivos de etiquetas. Ahora puedes comenzar a buscar tus palabras clave.

## Conclusión

¡Has llegado al final! Este capítulo es la amalgama de todos los capítulos de Vimscript. Aquí finalmente estás poniendo en práctica lo que has aprendido hasta ahora. Espero que al haber leído esto, no solo hayas entendido cómo crear plugins de Vim, sino que también te haya animado a escribir tu propio plugin.

Siempre que te encuentres repitiendo la misma secuencia de acciones múltiples veces, ¡deberías intentar crear el tuyo propio! Se ha dicho que no deberías reinventar la rueda. Sin embargo, creo que puede ser beneficioso reinventar la rueda por el bien del aprendizaje. Lee los plugins de otras personas. Recréalos. Aprende de ellos. ¡Escribe el tuyo propio! Quién sabe, tal vez escribas el próximo plugin increíble y súper popular después de leer esto. Tal vez seas el próximo legendario Tim Pope. Cuando eso suceda, ¡házmelo saber!