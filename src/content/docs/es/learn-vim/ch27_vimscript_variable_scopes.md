---
description: Este documento explica las variables en Vim, incluyendo su mutabilidad,
  inmutabilidad y las diferentes fuentes y ámbitos de las variables en Vimscript.
title: Ch27. Vimscript Variable Scopes
---

Antes de sumergirnos en las funciones de Vimscript, aprendamos sobre las diferentes fuentes y ámbitos de las variables de Vim.

## Variables Mutables e Inmutables

Puedes asignar un valor a una variable en Vim con `let`:

```shell
let pancake = "pancake"
```

Más tarde puedes llamar a esa variable en cualquier momento.

```shell
echo pancake
" devuelve "pancake"
```

`let` es mutable, lo que significa que puedes cambiar el valor en cualquier momento en el futuro.

```shell
let pancake = "pancake"
let pancake = "not waffles"

echo pancake
" devuelve "not waffles"
```

Observa que cuando quieres cambiar el valor de una variable establecida, aún necesitas usar `let`.

```shell
let beverage = "milk"

beverage = "orange juice"
" lanza un error
```

Puedes definir una variable inmutable con `const`. Siendo inmutable, una vez que se asigna un valor a una variable, no puedes reasignarlo con un valor diferente.

```shell
const waffle = "waffle"
const waffle = "pancake"
" lanza un error
```

## Fuentes de Variables

Hay tres fuentes para las variables: variable de entorno, variable de opción y variable de registro.

### Variable de Entorno

Vim puede acceder a tu variable de entorno del terminal. Por ejemplo, si tienes la variable de entorno `SHELL` disponible en tu terminal, puedes acceder a ella desde Vim con:

```shell
echo $SHELL
" devuelve el valor de $SHELL. En mi caso, devuelve /bin/bash
```

### Variable de Opción

Puedes acceder a las opciones de Vim con `&` (estas son las configuraciones que accedes con `set`).

Por ejemplo, para ver qué fondo usa Vim, puedes ejecutar:

```shell
echo &background
" devuelve "light" o "dark"
```

Alternativamente, siempre puedes ejecutar `set background?` para ver el valor de la opción `background`.

### Variable de Registro

Puedes acceder a los registros de Vim (Cap. 08) con `@`.

Supongamos que el valor "chocolate" ya está guardado en el registro a. Para acceder a él, puedes usar `@a`. También puedes actualizarlo con `let`.

```shell
echo @a
" devuelve chocolate

let @a .= " donut"

echo @a
" devuelve "chocolate donut"
```

Ahora, cuando pegues desde el registro `a` (`"ap`), devolverá "chocolate donut". El operador `.=` concatena dos cadenas. La expresión `let @a .= " donut"` es lo mismo que `let @a = @a . " donut"`

## Ámbitos de Variables

Hay 9 ámbitos diferentes de variables en Vim. Puedes reconocerlos por su letra precedida:

```shell
g:           Variable global
{nada}       Variable global
b:           Variable local de buffer
w:           Variable local de ventana
t:           Variable local de pestaña
s:           Variable de Vimscript fuente
l:           Variable local de función
a:           Variable de parámetro formal de función
v:           Variable incorporada de Vim
```

### Variable Global

Cuando declaras una variable "regular":

```shell
let pancake = "pancake"
```

`pancake` es en realidad una variable global. Cuando defines una variable global, puedes llamarla desde cualquier lugar.

Anteponer `g:` a una variable también crea una variable global.

```shell
let g:waffle = "waffle"
```

En este caso, tanto `pancake` como `g:waffle` tienen el mismo ámbito. Puedes llamar a cada uno de ellos con o sin `g:`.

```shell
echo pancake
" devuelve "pancake"

echo g:pancake
" devuelve "pancake"

echo waffle
" devuelve "waffle"

echo g:waffle
" devuelve "waffle"
```

### Variable de Buffer

Una variable precedida con `b:` es una variable de buffer. Una variable de buffer es una variable que es local al buffer actual (Cap. 02). Si tienes múltiples buffers abiertos, cada buffer tendrá su propia lista separada de variables de buffer.

En el buffer 1:

```shell
const b:donut = "chocolate donut"
```

En el buffer 2:

```shell
const b:donut = "blueberry donut"
```

Si ejecutas `echo b:donut` desde el buffer 1, devolverá "chocolate donut". Si lo ejecutas desde el buffer 2, devolverá "blueberry donut".

Aparte, Vim tiene una variable de buffer *especial* `b:changedtick` que realiza un seguimiento de todos los cambios realizados en el buffer actual.

1. Ejecuta `echo b:changedtick` y anota el número que devuelve.
2. Realiza cambios en Vim.
3. Ejecuta `echo b:changedtick` nuevamente y anota el número que ahora devuelve.

### Variable de Ventana

Una variable precedida con `w:` es una variable de ventana. Existe solo en esa ventana.

En la ventana 1:

```shell
const w:donut = "chocolate donut"
```

En la ventana 2:

```shell
const w:donut = "raspberry donut"
```

En cada ventana, puedes llamar a `echo w:donut` para obtener valores únicos.

### Variable de Pestaña

Una variable precedida con `t:` es una variable de pestaña. Existe solo en esa pestaña.

En la pestaña 1:

```shell
const t:donut = "chocolate donut"
```

En la pestaña 2:

```shell
const t:donut = "blackberry donut"
```

En cada pestaña, puedes llamar a `echo t:donut` para obtener valores únicos.

### Variable de Script

Una variable precedida con `s:` es una variable de script. Estas variables solo pueden ser accedidas desde dentro de ese script.

Si tienes un archivo arbitrario `dozen.vim` y dentro de él tienes:

```shell
let s:dozen = 12

function Consume()
  let s:dozen -= 1
  echo s:dozen " queda"
endfunction
```

Fuente el archivo con `:source dozen.vim`. Ahora llama a la función `Consume`:

```shell
:call Consume()
" devuelve "11 queda"

:call Consume()
" devuelve "10 queda"

:echo s:dozen
" Error de variable indefinida
```

Cuando llamas a `Consume`, ves que decrementa el valor de `s:dozen` como se esperaba. Cuando intentas obtener el valor de `s:dozen` directamente, Vim no lo encontrará porque estás fuera de ámbito. `s:dozen` solo es accesible desde dentro de `dozen.vim`.

Cada vez que fuentes el archivo `dozen.vim`, reinicia el contador `s:dozen`. Si estás en medio de decrementar el valor de `s:dozen` y ejecutas `:source dozen.vim`, el contador se reinicia a 12. Esto puede ser un problema para los usuarios desprevenidos. Para solucionar este problema, refactoriza el código:

```shell
if !exists("s:dozen")
  let s:dozen = 12
endif

function Consume()
  let s:dozen -= 1
  echo s:dozen
endfunction
```

Ahora, cuando fuentes `dozen.vim` mientras estás en medio de decrementar, Vim lee `!exists("s:dozen")`, encuentra que es verdadero y no reinicia el valor a 12.

### Variable Local de Función y Variable de Parámetro Formal de Función

Tanto la variable local de función (`l:`) como la variable formal de función (`a:`) se cubrirán en el próximo capítulo.

### Variables Incorporadas de Vim

Una variable precedida con `v:` es una variable incorporada especial de Vim. No puedes definir estas variables. Ya has visto algunas de ellas.
- `v:version` te dice qué versión de Vim estás usando.
- `v:key` contiene el valor del elemento actual al iterar a través de un diccionario.
- `v:val` contiene el valor del elemento actual al ejecutar una operación `map()` o `filter()`.
- `v:true`, `v:false`, `v:null` y `v:none` son tipos de datos especiales.

Hay otras variables. Para una lista de variables incorporadas de Vim, consulta `:h vim-variable` o `:h v:`.

## Usando los Ámbitos de Variables de Vim de Manera Inteligente

Poder acceder rápidamente a variables de entorno, opción y registro te brinda una amplia flexibilidad para personalizar tu editor y entorno de terminal. También aprendiste que Vim tiene 9 ámbitos diferentes de variables, cada uno existiendo bajo ciertas restricciones. Puedes aprovechar estos tipos de variables únicas para desacoplar tu programa.

Has llegado hasta aquí. Has aprendido sobre tipos de datos, medios de combinaciones y ámbitos de variables. Solo queda una cosa: funciones.