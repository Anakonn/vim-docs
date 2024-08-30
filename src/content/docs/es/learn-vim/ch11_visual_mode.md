---
description: Este documento enseña cómo utilizar los modos visuales en Vim para manipular
  texto de manera eficiente, destacando sus tres tipos y funciones.
title: Ch11. Visual Mode
---

Resaltar y aplicar cambios a un cuerpo de texto es una característica común en muchos editores de texto y procesadores de palabras. Vim puede hacer esto utilizando el modo visual. En este capítulo, aprenderás a usar el modo visual para manipular textos de manera eficiente.

## Los Tres Tipos de Modos Visuales

Vim tiene tres modos visuales diferentes. Son:

```shell
v         Modo visual por caracteres
V         Modo visual por líneas
Ctrl-V    Modo visual por bloques
```

Si tienes el texto:

```shell
uno
dos
tres
```

El modo visual por caracteres trabaja con caracteres individuales. Presiona `v` en el primer carácter. Luego baja a la siguiente línea con `j`. Resalta todo el texto desde "uno" hasta la ubicación de tu cursor. Si presionas `gU`, Vim convierte en mayúsculas los caracteres resaltados.

El modo visual por líneas trabaja con líneas. Presiona `V` y observa cómo Vim selecciona toda la línea en la que está tu cursor. Al igual que en el modo visual por caracteres, si ejecutas `gU`, Vim convierte en mayúsculas los caracteres resaltados.

El modo visual por bloques trabaja con filas y columnas. Te da más libertad de movimiento que los otros dos modos. Si presionas `Ctrl-V`, Vim resalta el carácter bajo el cursor, al igual que el modo visual por caracteres, excepto que en lugar de resaltar cada carácter hasta el final de la línea antes de bajar a la siguiente línea, baja a la siguiente línea con un resaltado mínimo. Intenta moverte con `h/j/k/l` y observa cómo se mueve el cursor.

En la parte inferior izquierda de tu ventana de Vim, verás `-- VISUAL --`, `-- VISUAL LINE --`, o `-- VISUAL BLOCK --` para indicar en qué modo visual te encuentras.

Mientras estés en un modo visual, puedes cambiar a otro modo visual presionando `v`, `V`, o `Ctrl-V`. Por ejemplo, si estás en el modo visual por líneas y deseas cambiar al modo visual por bloques, ejecuta `Ctrl-V`. ¡Inténtalo!

Hay tres formas de salir del modo visual: `<Esc>`, `Ctrl-C`, y la misma tecla que tu modo visual actual. Lo que esto significa es que si actualmente estás en el modo visual por líneas (`V`), puedes salir presionando `V` nuevamente. Si estás en el modo visual por caracteres, puedes salir presionando `v`.

De hecho, hay una forma más de ingresar al modo visual:

```shell
gv    Ir al modo visual anterior
```

Esto comenzará el mismo modo visual en el mismo bloque de texto resaltado que usaste la última vez.

## Navegación en el Modo Visual

Mientras estés en un modo visual, puedes expandir el bloque de texto resaltado con los movimientos de Vim.

Usaremos el mismo texto que usaste anteriormente:

```shell
uno
dos
tres
```

Esta vez comencemos desde la línea "dos". Presiona `v` para ir al modo visual por caracteres (aquí los corchetes cuadrados `[]` representan los caracteres resaltados):

```shell
uno
[d]os
tres
```

Presiona `j` y Vim resaltará todo el texto desde la línea "dos" hasta el primer carácter de la línea "tres".

```shell
uno
[dos
t]res
```

Supongamos que desde esta posición, deseas agregar también la línea "uno". Si presionas `k`, para tu desagrado, el resaltado se aleja de la línea "tres".

```shell
uno
[d]os
tres
```

¿Hay alguna forma de expandir libremente la selección visual para moverte en cualquier dirección que desees? Definitivamente. Retrocedamos un poco hasta donde tienes resaltadas las líneas "dos" y "tres".

```shell
uno
[dos
t]res    <-- cursor
```

El resaltado visual sigue el movimiento del cursor. Si deseas expandirlo hacia arriba hasta la línea "uno", necesitas mover el cursor hacia arriba hasta la línea "dos". Ahora mismo el cursor está en la línea "tres". Puedes alternar la ubicación del cursor con `o` o `O`.

```shell
uno
[dos     <-- cursor
t]res
```

Ahora cuando presiones `k`, ya no reduce la selección, sino que la expande hacia arriba.

```shell
[uno
dos
t]res
```

Con `o` o `O` en el modo visual, el cursor salta del principio al final del bloque resaltado, permitiéndote expandir el área de resaltado.

## Gramática del Modo Visual

El modo visual comparte muchas operaciones con el modo normal.

Por ejemplo, si tienes el siguiente texto y deseas eliminar las primeras dos líneas desde el modo visual:

```shell
uno
dos
tres
```

Resalta las líneas "uno" y "dos" con el modo visual por líneas (`V`):

```shell
[uno
dos]
tres
```

Presionar `d` eliminará la selección, similar al modo normal. Nota que la regla gramatical del modo normal, verbo + sustantivo, no se aplica. El mismo verbo sigue ahí (`d`), pero no hay sustantivo en el modo visual. La regla gramatical en el modo visual es sustantivo + verbo, donde el sustantivo es el texto resaltado. Selecciona primero el bloque de texto, luego sigue el comando.

En el modo normal, hay algunos comandos que no requieren un movimiento, como `x` para eliminar un solo carácter bajo el cursor y `r` para reemplazar el carácter bajo el cursor (`rx` reemplaza el carácter bajo el cursor con "x"). En el modo visual, estos comandos ahora se aplican a todo el texto resaltado en lugar de a un solo carácter. Volviendo al texto resaltado:

```shell
[uno
dos]
tres
```

Ejecutar `x` elimina todos los textos resaltados.

Puedes usar este comportamiento para crear rápidamente un encabezado en texto markdown. Supongamos que necesitas convertir rápidamente el siguiente texto en un encabezado de primer nivel en markdown ("==="):

```shell
Capítulo Uno
```

Primero, copia el texto con `yy`, luego pégalo con `p`:

```shell
Capítulo Uno
Capítulo Uno
```

Ahora, ve a la segunda línea y selecciónala con el modo visual por líneas:

```shell
Capítulo Uno
[Capítulo Uno]
```

Un encabezado de primer nivel es una serie de "=" debajo de un texto. Ejecuta `r=`, ¡voilà! Esto te ahorra escribir "=" manualmente.

```shell
Capítulo Uno
===========
```

Para aprender más sobre operadores en el modo visual, consulta `:h visual-operators`.

## Modo Visual y Comandos de Línea de Comando

Puedes aplicar selectivamente comandos de línea de comando en un bloque de texto resaltado. Si tienes estas declaraciones y deseas sustituir "const" por "let" solo en las primeras dos líneas:

```shell
const uno = "uno";
const dos = "dos";
const tres = "tres";
```

Resalta las primeras dos líneas con *cualquier* modo visual y ejecuta el comando de sustitución `:s/const/let/g`:

```shell
let uno = "uno";
let dos = "dos";
const tres = "tres";
```

Nota que dije que puedes hacer esto con *cualquier* modo visual. No tienes que resaltar toda la línea para ejecutar el comando en esa línea. Siempre que selecciones al menos un carácter en cada línea, el comando se aplica.

## Agregar Texto en Múltiples Líneas

Puedes agregar texto en múltiples líneas en Vim usando el modo visual por bloques. Si necesitas agregar un punto y coma al final de cada línea:

```shell
const uno = "uno"
const dos = "dos"
const tres = "tres"
```

Con tu cursor en la primera línea:
- Ejecuta el modo visual por bloques y baja dos líneas (`Ctrl-V jj`).
- Resalta hasta el final de la línea (`$`).
- Agrega (`A`) y luego escribe ";".
- Sal del modo visual (`<Esc>`).

Ahora deberías ver el ";" agregado en cada línea. ¡Bastante genial! Hay dos formas de ingresar al modo de inserción desde el modo visual por bloques: `A` para ingresar el texto después del cursor o `I` para ingresar el texto antes del cursor. No los confundas con `A` (agregar texto al final de la línea) e `I` (insertar texto antes de la primera línea no vacía) del modo normal.

Alternativamente, también puedes usar el comando `:normal` para agregar texto en múltiples líneas:
- Resalta las 3 líneas (`vjj`).
- Escribe `:normal! A;`.

Recuerda, el comando `:normal` ejecuta comandos del modo normal. Puedes indicarle que ejecute `A;` para agregar el texto ";" al final de la línea.

## Incrementar Números

Vim tiene los comandos `Ctrl-X` y `Ctrl-A` para decrementar e incrementar números. Cuando se usan con el modo visual, puedes incrementar números en múltiples líneas.

Si tienes estos elementos HTML:

```shell
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
```

Es una mala práctica tener varios ids con el mismo nombre, así que incrementémoslos para hacerlos únicos:
- Mueve tu cursor al "1" en la segunda línea.
- Comienza el modo visual por bloques y baja 3 líneas (`Ctrl-V 3j`). Esto resalta los "1" restantes. Ahora todos los "1" deberían estar resaltados (excepto la primera línea).
- Ejecuta `g Ctrl-A`.

Deberías ver este resultado:

```shell
<div id="app-1"></div>
<div id="app-2"></div>
<div id="app-3"></div>
<div id="app-4"></div>
<div id="app-5"></div>
```

`g Ctrl-A` incrementa números en múltiples líneas. `Ctrl-X/Ctrl-A` también puede incrementar letras, con la opción de formatos numéricos:

```shell
set nrformats+=alpha
```

La opción `nrformats` indica a Vim qué bases se consideran como "números" para que `Ctrl-A` y `Ctrl-X` puedan incrementar y decrementar. Al agregar `alpha`, un carácter alfabético ahora se considera como un número. Si tienes los siguientes elementos HTML:

```shell
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
```

Coloca tu cursor en el segundo "app-a". Usa la misma técnica que antes (`Ctrl-V 3j` y luego `g Ctrl-A`) para incrementar los ids.

```shell
<div id="app-a"></div>
<div id="app-b"></div>
<div id="app-c"></div>
<div id="app-d"></div>
<div id="app-e"></div>
```

## Seleccionando el Último Área de Modo Visual

Antes en este capítulo, mencioné que `gv` puede resaltar rápidamente el último resaltado del modo visual. También puedes ir a la ubicación del inicio y el final del último modo visual con estas dos marcas especiales:

```shell
`<    Ir al primer lugar del resaltado anterior del modo visual
`>    Ir al último lugar del resaltado anterior del modo visual
```

Antes, también mencioné que puedes ejecutar selectivamente comandos de línea de comando en un texto resaltado, como `:s/const/let/g`. Cuando hiciste eso, verías esto a continuación:

```shell
:`<,`>s/const/let/g
```

En realidad, estabas ejecutando un comando `s/const/let/g` *rango* (con las dos marcas como las direcciones). ¡Interesante!

Siempre puedes editar estas marcas en cualquier momento que desees. Si en cambio necesitas sustituir desde el inicio del texto resaltado hasta el final del archivo, solo cambia el comando a:

```shell
:`<,$s/const/let/g
```

## Entrando al Modo Visual Desde el Modo de Inserción

También puedes ingresar al modo visual desde el modo de inserción. Para ir al modo visual por caracteres mientras estás en el modo de inserción:

```shell
Ctrl-O v
```

Recuerda que ejecutar `Ctrl-O` mientras estás en el modo de inserción te permite ejecutar un comando del modo normal. Mientras estés en este modo de comando del modo normal pendiente, ejecuta `v` para ingresar al modo visual por caracteres. Nota que en la parte inferior izquierda de la pantalla dice `--(insert) VISUAL--`. Este truco funciona con cualquier operador del modo visual: `v`, `V`, y `Ctrl-V`.

## Modo de Selección

Vim tiene un modo similar al modo visual llamado modo de selección. Al igual que el modo visual, también tiene tres modos diferentes:

```shell
gh         Modo de selección por caracteres
gH         Modo de selección por líneas
gCtrl-h    Modo de selección por bloques
```

El modo de selección emula el comportamiento de resaltado de texto de un editor regular más cercano que el modo visual de Vim.

En un editor regular, después de resaltar un bloque de texto y escribir una letra, digamos la letra "y", eliminará el texto resaltado e insertará la letra "y". Si resaltas una línea con el modo de selección por líneas (`gH`) y escribes "y", eliminará el texto resaltado e insertará la letra "y".

Contrasta este modo de selección con el modo visual: si resaltas una línea de texto con el modo visual por líneas (`V`) y escribes "y", el texto resaltado no será eliminado y reemplazado por la letra literal "y", será copiado. No puedes ejecutar comandos del modo normal en texto resaltado en el modo de selección.

Personalmente, nunca he usado el modo de selección, pero es bueno saber que existe.

## Aprende el Modo Visual de la Manera Inteligente

El modo visual es la representación de Vim del procedimiento de resaltado de texto.

Si te encuentras usando operaciones del modo visual con mucha más frecuencia que las operaciones del modo normal, ten cuidado. Este es un anti-patrón. Se requieren más pulsaciones de teclas para ejecutar una operación del modo visual que su contraparte del modo normal. Por ejemplo, si necesitas eliminar una palabra interna, ¿por qué usar cuatro pulsaciones de teclas, `viwd` (resaltar visualmente una palabra interna y luego eliminar), si puedes lograrlo con solo tres pulsaciones de teclas (`diw`)? Este último es más directo y conciso. Por supuesto, habrá momentos en que los modos visuales son apropiados, pero en general, favorece un enfoque más directo.