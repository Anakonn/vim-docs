---
description: Aprende a usar la función de pliegue en Vim para ocultar texto irrelevante
  y mejorar la comprensión de tus archivos. Descubre diferentes métodos de plegado.
title: Ch17. Fold
---

Cuando lees un archivo, a menudo hay muchos textos irrelevantes que dificultan la comprensión de lo que hace ese archivo. Para ocultar el ruido innecesario, utiliza Vim fold.

En este capítulo, aprenderás diferentes formas de plegar un archivo.

## Plegado Manual

Imagina que estás plegando una hoja de papel para cubrir algún texto. El texto real no desaparece, sigue ahí. El plegado de Vim funciona de la misma manera. Pliega un rango de texto, ocultándolo de la vista sin eliminarlo realmente.

El operador de plegado es `z` (cuando un papel está plegado, tiene la forma de la letra z).

Supongamos que tienes este texto:

```shell
Plega me
Sostenme
```

Con el cursor en la primera línea, escribe `zfj`. Vim pliega ambas líneas en una. Deberías ver algo como esto:

```shell
+-- 2 líneas: Plega me -----
```

Aquí está el desglose:
- `zf` es el operador de plegado.
- `j` es el movimiento para el operador de plegado.

Puedes abrir un texto plegado con `zo`. Para cerrar el plegado, usa `zc`.

El plegado es un operador, por lo que sigue la regla gramatical (`verbo + sustantivo`). Puedes pasar el operador de plegado con un movimiento o un objeto de texto. Para plegar un párrafo interno, ejecuta `zfip`. Para plegar hasta el final de un archivo, ejecuta `zfG`. Para plegar los textos entre `{` y `}`, ejecuta `zfa{`.

Puedes plegar desde el modo visual. Resalta el área que deseas plegar (`v`, `V` o `Ctrl-v`), luego ejecuta `zf`.

Puedes ejecutar un plegado desde el modo de línea de comandos con el comando `:fold`. Para plegar la línea actual y la línea siguiente, ejecuta:

```shell
:,+1fold
```

`,+1` es el rango. Si no pasas parámetros al rango, se predetermina a la línea actual. `+1` es el indicador de rango para la siguiente línea. Para plegar las líneas de 5 a 10, ejecuta `:5,10fold`. Para plegar desde la posición actual hasta el final de la línea, ejecuta `:,$fold`.

Hay muchos otros comandos de plegado y desplegado. Encuentro que son demasiados para recordar al principio. Los más útiles son:
- `zR` para abrir todos los pliegues.
- `zM` para cerrar todos los pliegues.
- `za` para alternar un pliegue.

Puedes ejecutar `zR` y `zM` en cualquier línea, pero `za` solo funciona cuando estás en una línea plegada / desplegada. Para aprender más comandos de plegado, consulta `:h fold-commands`.

## Diferentes Métodos de Plegado

La sección anterior cubre el plegado manual de Vim. Hay seis métodos de plegado diferentes en Vim:
1. Manual
2. Indentación
3. Expresión
4. Sintaxis
5. Diferencia
6. Marcador

Para ver qué método de plegado estás utilizando actualmente, ejecuta `:set foldmethod?`. Por defecto, Vim utiliza el método `manual`.

En el resto del capítulo, aprenderás los otros cinco métodos de plegado. Comencemos con el plegado por indentación.

## Plegado por Indentación

Para usar un plegado por indentación, cambia el `'foldmethod'` a indentación:

```shell
:set foldmethod=indent
```

Supongamos que tienes el texto:

```shell
Uno
  Dos
  Dos de nuevo
```

Si ejecutas `:set foldmethod=indent`, verás:

```shell
Uno
+-- 2 líneas: Dos -----
```

Con el plegado por indentación, Vim observa cuántos espacios tiene cada línea al principio y lo compara con la opción `'shiftwidth'` para determinar su capacidad de plegado. `'shiftwidth'` devuelve el número de espacios requeridos para cada paso de la indentación. Si ejecutas:

```shell
:set shiftwidth?
```

El valor predeterminado de `'shiftwidth'` de Vim es 2. En el texto anterior, hay dos espacios entre el inicio de la línea y el texto "Dos" y "Dos de nuevo". Cuando Vim ve el número de espacios y que el valor de `'shiftwidth'` es 2, considera que esa línea tiene un nivel de plegado de indentación de uno.

Supongamos que esta vez solo hay un espacio entre el inicio de la línea y el texto:

```shell
Uno
 Dos
 Dos de nuevo
```

Ahora, si ejecutas `:set foldmethod=indent`, Vim no pliega la línea indentada porque no hay suficiente espacio en cada línea. Un espacio no se considera una indentación. Sin embargo, si cambias el `'shiftwidth'` a 1:

```shell
:set shiftwidth=1
```

El texto ahora es plegable. Ahora se considera una indentación.

Restaura el `shiftwidth` de nuevo a 2 y los espacios entre los textos a dos nuevamente. Además, agrega dos textos adicionales:

```shell
Uno
  Dos
  Dos de nuevo
    Tres
    Tres de nuevo
```

Ejecuta el plegado (`zM`), verás:

```shell
Uno
+-- 4 líneas: Dos -----
```

Despliega las líneas plegadas (`zR`), luego coloca el cursor en "Tres" y alterna el estado de plegado del texto (`za`):

```shell
Uno
  Dos
  Dos de nuevo
+-- 2 líneas: Tres -----
```

¿Qué es esto? ¿Un plegado dentro de un plegado?

Los pliegues anidados son válidos. El texto "Dos" y "Dos de nuevo" tienen un nivel de plegado de uno. El texto "Tres" y "Tres de nuevo" tienen un nivel de plegado de dos. Si tienes un texto plegable con un nivel de plegado más alto dentro de un texto plegable, tendrás múltiples capas de pliegue.

## Plegado por Expresión

El plegado por expresión te permite definir una expresión para coincidir con un pliegue. Después de definir las expresiones de pliegue, Vim escanea cada línea en busca del valor de `'foldexpr'`. Esta es la variable que debes configurar para devolver el valor apropiado. Si `'foldexpr'` devuelve 0, entonces la línea no está plegada. Si devuelve 1, entonces esa línea tiene un nivel de plegado de 1. Si devuelve 2, entonces esa línea tiene un nivel de plegado de 2. Hay más valores además de los enteros, pero no los cubriré. Si tienes curiosidad, consulta `:h fold-expr`.

Primero, cambiemos el método de plegado:

```shell
:set foldmethod=expr
```

Supongamos que tienes una lista de alimentos para el desayuno y deseas plegar todos los elementos del desayuno que comienzan con "p":

```shell
donut
pancake
pop-tarts
protein bar
salmon
scrambled eggs
```

A continuación, cambia el `foldexpr` para capturar las expresiones que comienzan con "p":

```shell
:set foldexpr=getline(v:lnum)[0]==\\"p\\"
```

La expresión anterior parece complicada. Desglosemos:
- `:set foldexpr` configura la opción `'foldexpr'` para aceptar una expresión personalizada.
- `getline()` es una función de Vimscript que devuelve el contenido de cualquier línea dada. Si ejecutas `:echo getline(5)`, devolverá el contenido de la línea 5.
- `v:lnum` es la variable especial de Vim para la expresión `'foldexpr'`. Vim escanea cada línea y en ese momento almacena el número de cada línea en la variable `v:lnum`. En la línea 5, `v:lnum` tiene un valor de 5. En la línea 10, `v:lnum` tiene un valor de 10.
- `[0]` en el contexto de `getline(v:lnum)[0]` es el primer carácter de cada línea. Cuando Vim escanea una línea, `getline(v:lnum)` devuelve el contenido de cada línea. `getline(v:lnum)[0]` devuelve el primer carácter de cada línea. En la primera línea de nuestra lista, "donut", `getline(v:lnum)[0]` devuelve "d". En la segunda línea de nuestra lista, "pancake", `getline(v:lnum)[0]` devuelve "p".
- `==\\"p\\"` es la segunda mitad de la expresión de igualdad. Verifica si la expresión que acabas de evaluar es igual a "p". Si es verdadero, devuelve 1. Si es falso, devuelve 0. En Vim, 1 es verdadero y 0 es falso. Así que en las líneas que comienzan con una "p", devuelve 1. Recuerda que si un `'foldexpr'` tiene un valor de 1, entonces tiene un nivel de plegado de 1.

Después de ejecutar esta expresión, deberías ver:

```shell
donut
+-- 3 líneas: pancake -----
salmon
scrambled eggs
```

## Plegado por Sintaxis

El plegado por sintaxis se determina por el resaltado de sintaxis del lenguaje. Si utilizas un complemento de sintaxis de lenguaje como [vim-polyglot](https://github.com/sheerun/vim-polyglot), el plegado por sintaxis funcionará directamente. Solo cambia el método de plegado a sintaxis:

```shell
:set foldmethod=syntax
```

Supongamos que estás editando un archivo de JavaScript y tienes vim-polyglot instalado. Si tienes un array como el siguiente:

```shell
const nums = [
  uno,
  dos,
  tres,
  cuatro
]
```

Se plegará con un plegado por sintaxis. Cuando defines un resaltado de sintaxis para un lenguaje particular (típicamente dentro del directorio `syntax/`), puedes agregar un atributo `fold` para hacerlo plegable. A continuación se muestra un fragmento del archivo de sintaxis de JavaScript de vim-polyglot. Nota la palabra clave `fold` al final.

```shell
syntax region  jsBracket                      matchgroup=jsBrackets            start=/\[/ end=/\]/ contains=@jsExpression,jsSpreadExpression extend fold
```

Esta guía no cubrirá la función `syntax`. Si tienes curiosidad, consulta `:h syntax.txt`.

## Plegado por Diferencia

Vim puede realizar un procedimiento de diferencia para comparar dos o más archivos.

Si tienes `file1.txt`:

```shell
vim es asombroso
vim es asombroso
vim es asombroso
vim es asombroso
vim es asombroso
vim es asombroso
vim es asombroso
vim es asombroso
vim es asombroso
vim es asombroso
```

Y `file2.txt`:

```shell
vim es asombroso
vim es asombroso
vim es asombroso
vim es asombroso
vim es asombroso
vim es asombroso
vim es asombroso
vim es asombroso
emacs está bien
```

Ejecuta `vimdiff file1.txt file2.txt`:

```shell
+-- 3 líneas: vim es asombroso -----
vim es asombroso
vim es asombroso
vim es asombroso
vim es asombroso
vim es asombroso
vim es asombroso
[vim es asombroso] / [emacs está bien]
```

Vim pliega automáticamente algunas de las líneas idénticas. Cuando ejecutas el comando `vimdiff`, Vim utiliza automáticamente `foldmethod=diff`. Si ejecutas `:set foldmethod?`, devolverá `diff`.

## Plegado por Marcador

Para usar un plegado por marcador, ejecuta:

```shell
:set foldmethod=marker
```

Supongamos que tienes el texto:

```shell
Hola

{{{
mundo
vim
}}}
```

Ejecuta `zM`, verás:

```shell
hola

+-- 4 líneas: -----
```

Vim ve `{{{` y `}}}` como indicadores de pliegue y pliega los textos entre ellos. Con el plegado por marcador, Vim busca marcadores especiales, definidos por la opción `'foldmarker'`, para marcar áreas de plegado. Para ver qué marcadores utiliza Vim, ejecuta:

```shell
:set foldmarker?
```

Por defecto, Vim utiliza `{{{` y `}}}` como indicadores. Si deseas cambiar el indicador a otros textos, como "cafe1" y "cafe2":

```shell
:set foldmarker=cafe1,cafe2
```

Si tienes el texto:

```shell
hola

cafe1
mundo
vim
cafe2
```

Ahora Vim utiliza `cafe1` y `cafe2` como los nuevos marcadores de plegado. Como nota al margen, un indicador debe ser una cadena literal y no puede ser una expresión regular.

## Persistiendo el Plegado

Pierdes toda la información de plegado cuando cierras la sesión de Vim. Si tienes este archivo, `count.txt`:

```shell
uno
dos
tres
cuatro
cinco
```

Luego haz un plegado manual desde la línea "tres" hacia abajo (`:3,$fold`):

```shell
uno
dos
+-- 3 líneas: tres ---
```

Cuando sales de Vim y vuelves a abrir `count.txt`, ¡los pliegues ya no están!

Para preservar los pliegues, después de plegar, ejecuta:

```shell
:mkview
```

Luego, cuando abras `count.txt`, ejecuta:

```shell
:loadview
```

Tus pliegues se restauran. Sin embargo, debes ejecutar manualmente `mkview` y `loadview`. Sé que uno de estos días, olvidaré ejecutar `mkview` antes de cerrar el archivo y perderé todos los pliegues. ¿Cómo podemos automatizar este proceso?

Para ejecutar automáticamente `mkview` cuando cierras un archivo `.txt` y ejecutar `loadview` cuando abres un archivo `.txt`, agrega esto en tu vimrc:

```shell
autocmd BufWinLeave *.txt mkview
autocmd BufWinEnter *.txt silent loadview
```

Recuerda que `autocmd` se utiliza para ejecutar un comando en un evento desencadenante. Los dos eventos aquí son:
- `BufWinLeave` para cuando quitas un búfer de una ventana.
- `BufWinEnter` para cuando cargas un búfer en una ventana.

Ahora, después de plegar dentro de un archivo `.txt` y salir de Vim, la próxima vez que abras ese archivo, tu información de plegado se restaurará.

Por defecto, Vim guarda la información de plegado al ejecutar `mkview` dentro de `~/.vim/view` para el sistema Unix. Para más información, consulta `:h 'viewdir'`.
## Aprende a Plegar de Manera Inteligente

Cuando comencé a usar Vim, descuidé aprender a plegar porque no pensaba que fuera útil. Sin embargo, cuanto más código escribo, más útil encuentro que el plegado es. Los pliegues colocados estratégicamente pueden darte una mejor visión general de la estructura del texto, como el índice de un libro.

Cuando aprendas a plegar, comienza con el plegado manual porque se puede usar sobre la marcha. Luego, aprende gradualmente diferentes trucos para hacer pliegues de indentación y marcadores. Finalmente, aprende a hacer pliegues de sintaxis y expresión. Incluso puedes usar estos dos últimos para escribir tus propios complementos de Vim.