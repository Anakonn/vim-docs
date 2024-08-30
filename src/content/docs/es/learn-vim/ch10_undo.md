---
description: Este documento explora el sistema de deshacer y rehacer en Vim, enseñando
  cómo navegar entre estados de texto y gestionar cambios de manera efectiva.
title: Ch10. Undo
---

Todos cometemos todo tipo de errores de escritura. Por eso, deshacer es una función esencial en cualquier software moderno. El sistema de deshacer de Vim no solo es capaz de deshacer y rehacer errores simples, sino también de acceder a diferentes estados de texto, dándote control sobre todos los textos que has escrito. En este capítulo, aprenderás cómo deshacer, rehacer, navegar por una rama de deshacer, persistir deshacer y viajar a través del tiempo.

## Deshacer, Rehacer y DESHACER

Para realizar un deshacer básico, puedes usar `u` o ejecutar `:undo`.

Si tienes este texto (nota la línea vacía debajo de "uno"):

```shell
uno

```

Luego agregas otro texto:

```shell
uno
dos
```

Si presionas `u`, Vim deshace el texto "dos".

¿Cómo sabe Vim cuánto deshacer? Vim deshace un solo "cambio" a la vez, similar al cambio de un comando de punto (a diferencia del comando de punto, los comandos de línea de comando también cuentan como un cambio).

Para rehacer el último cambio, presiona `Ctrl-R` o ejecuta `:redo`. Después de deshacer el texto anterior para eliminar "dos", ejecutar `Ctrl-R` recuperará el texto eliminado.

Vim también tiene DESHACER que puedes ejecutar con `U`. Deshace todos los cambios recientes.

¿Cómo es diferente `U` de `u`? Primero, `U` elimina *todos* los cambios en la última línea cambiada, mientras que `u` solo elimina un cambio a la vez. Segundo, mientras que hacer `u` no cuenta como un cambio, hacer `U` cuenta como un cambio.

Volviendo a este ejemplo:

```shell
uno
dos
```

Cambia la segunda línea a "tres":

```shell
uno
tres
```

Cambia la segunda línea nuevamente y reemplázala con "cuatro":

```shell
uno
cuatro
```

Si presionas `u`, verás "tres". Si presionas `u` nuevamente, verás "dos". Si en lugar de presionar `u` cuando aún tenías el texto "cuatro", hubieras presionado `U`, verás:

```shell
uno

```

`U` omite todos los cambios intermedios y vuelve al estado original cuando comenzaste (una línea vacía). Además, dado que DESHACER en realidad crea un nuevo cambio en Vim, puedes DESHACER tu DESHACER. `U` seguido de `U` se deshará a sí mismo. Puedes presionar `U`, luego `U`, luego `U`, etc. Verás los mismos dos estados de texto alternando de un lado a otro.

Personalmente, no uso `U` porque es difícil recordar el estado original (raramente lo necesito).

Vim establece un número máximo de cuántas veces puedes deshacer en la variable de opción `undolevels`. Puedes comprobarlo con `:echo &undolevels`. Yo tengo el mío configurado en 1000. Para cambiar el tuyo a 1000, ejecuta `:set undolevels=1000`. Siéntete libre de configurarlo a cualquier número que desees.

## Rompiendo los Bloques

Mencioné anteriormente que `u` deshace un solo "cambio" similar al cambio de un comando de punto: los textos insertados desde que entras en el modo de inserción hasta que sales cuentan como un cambio.

Si haces `ione dos tres<Esc>` y luego presionas `u`, Vim elimina todo el texto "uno dos tres" porque todo cuenta como un cambio. Esto no es un gran problema si has escrito textos cortos, pero ¿qué pasa si has escrito varios párrafos dentro de una sesión de modo de inserción sin salir y luego te das cuenta de que cometiste un error? Si presionas `u`, todo lo que habías escrito se eliminaría. ¿No sería útil si pudieras presionar `u` para eliminar solo una sección de tu texto?

Afortunadamente, puedes romper los bloques de deshacer. Cuando estás escribiendo en modo de inserción, presionar `Ctrl-G u` crea un punto de ruptura de deshacer. Por ejemplo, si haces `ione <Ctrl-G u>dos <Ctrl-G u>tres<Esc>`, luego presionas `u`, solo perderás el texto "tres" (presiona `u` una vez más para eliminar "dos"). Cuando escribas un texto largo, usa `Ctrl-G u` estratégicamente. El final de cada oración, entre dos párrafos o después de cada línea de código son lugares ideales para agregar puntos de ruptura de deshacer para facilitar la corrección de tus errores si alguna vez cometes uno.

También es útil crear un punto de ruptura de deshacer al eliminar bloques en modo de inserción con `Ctrl-W` (eliminar la palabra antes del cursor) y `Ctrl-U` (eliminar todo el texto antes del cursor). Un amigo sugirió usar los siguientes mapas:

```shell
inoremap <c-u> <c-g>u<c-u>
inoremap <c-w> <c-g>u<c-w>
```

Con estos, puedes recuperar fácilmente los textos eliminados.

## Árbol de Deshacer

Vim almacena cada cambio que se haya escrito en un árbol de deshacer. Comienza un nuevo archivo vacío. Luego agrega un nuevo texto:

```shell
uno

```

Agrega un nuevo texto:

```shell
uno
dos
```

Deshazte una vez:

```shell
uno

```

Agrega un texto diferente:

```shell
uno
tres
```

Deshazte nuevamente:

```shell
uno

```

Y agrega otro texto diferente:

```shell
uno
cuatro
```

Ahora, si deshaces, perderás el texto "cuatro" que acabas de agregar:

```shell
uno

```

Si deshaces una vez más:

```shell

```

Perderás el texto "uno". En la mayoría de los editores de texto, recuperar los textos "dos" y "tres" habría sido imposible, ¡pero no con Vim! Presiona `g+` y recuperarás tu texto "uno":

```shell
uno

```

Escribe `g+` nuevamente y verás un viejo amigo:

```shell
uno
dos
```

Sigamos adelante. Presiona `g+` nuevamente:

```shell
uno
tres
```

Presiona `g+` una vez más:

```shell
uno
cuatro
```

En Vim, cada vez que presionas `u` y luego haces un cambio diferente, Vim almacena el texto del estado anterior creando una "rama de deshacer". En este ejemplo, después de escribir "dos", luego presionar `u`, luego escribir "tres", creaste una rama hoja que almacena el estado que contiene el texto "dos". En ese momento, el árbol de deshacer contenía al menos dos nodos hoja: el nodo principal que contiene el texto "tres" (el más reciente) y el nodo de la rama de deshacer que contiene el texto "dos". Si hubieras hecho otro deshacer y escrito el texto "cuatro", tendrías tres nodos: un nodo principal que contiene el texto "cuatro" y dos nodos que contienen los textos "tres" y "dos".

Para recorrer cada nodo del árbol de deshacer, puedes usar `g+` para ir a un estado más nuevo y `g-` para ir a un estado más antiguo. La diferencia entre `u`, `Ctrl-R`, `g+` y `g-` es que tanto `u` como `Ctrl-R` solo recorren los *nodos principales* en el árbol de deshacer, mientras que `g+` y `g-` recorren *todos* los nodos en el árbol de deshacer.

El árbol de deshacer no es fácil de visualizar. Encuentro que el plugin [vim-mundo](https://github.com/simnalamburt/vim-mundo) es muy útil para ayudar a visualizar el árbol de deshacer de Vim. Tómate un tiempo para jugar con él.

## Deshacer Persistente

Si inicias Vim, abres un archivo y presionas inmediatamente `u`, Vim probablemente mostrará la advertencia "*Ya en el cambio más antiguo*". No hay nada que deshacer porque no has realizado ningún cambio.

Para hacer un seguimiento del historial de deshacer de la última sesión de edición, Vim puede preservar tu historial de deshacer con un archivo de deshacer usando `:wundo`.

Crea un archivo `mynumbers.txt`. Escribe:

```shell
uno
```

Luego escribe otra línea (asegúrate de que cada línea cuente como un cambio):

```shell
uno
dos
```

Escribe otra línea:

```shell
uno
dos
tres
```

Ahora crea tu archivo de deshacer con `:wundo {mi-archivo-de-deshacer}`. Si necesitas sobrescribir un archivo de deshacer existente, puedes agregar `!` después de `wundo`.

```shell
:wundo! mynumbers.undo
```

Luego sal de Vim.

Para este momento deberías tener los archivos `mynumbers.txt` y `mynumbers.undo` en tu directorio. Abre nuevamente `mynumbers.txt` y prueba presionar `u`. No puedes. No has realizado ningún cambio desde que abriste el archivo. Ahora carga tu historial de deshacer leyendo el archivo de deshacer con `:rundo`:

```shell
:rundo mynumbers.undo
```

Ahora, si presionas `u`, Vim elimina "tres". Presiona `u` nuevamente para eliminar "dos". ¡Es como si nunca hubieras cerrado Vim!

Si deseas tener una persistencia de deshacer automática, una forma de hacerlo es agregando esto en vimrc:

```shell
set undodir=~/.vim/undo_dir
set undofile
```

La configuración anterior pondrá todos los archivos de deshacer en un directorio centralizado, el directorio `~/.vim`. El nombre `undo_dir` es arbitrario. `set undofile` le dice a Vim que active la función `undofile` porque está desactivada por defecto. Ahora, cada vez que guardes, Vim crea y actualiza automáticamente el archivo relevante dentro del directorio `undo_dir` (asegúrate de crear el directorio `undo_dir` dentro del directorio `~/.vim` antes de ejecutar esto).

## Viaje en el Tiempo

¿Quién dice que los viajes en el tiempo no existen? Vim puede viajar a un estado de texto en el pasado con el comando de línea `:earlier`.

Si tienes este texto:

```shell
uno

```
Luego más tarde agregas:

```shell
uno
dos
```

Si hubieras escrito "dos" hace menos de diez segundos, puedes volver al estado donde "dos" no existía hace diez segundos con:

```shell
:earlier 10s
```

Puedes usar `:undolist` para ver cuándo se realizó el último cambio. `:earlier` también acepta diferentes argumentos:

```shell
:earlier 10s    Ir al estado 10 segundos antes
:earlier 10m    Ir al estado 10 minutos antes
:earlier 10h    Ir al estado 10 horas antes
:earlier 10d    Ir al estado 10 días antes
```

Además, también acepta un `count` regular como argumento para decirle a Vim que vaya al estado más antiguo `count` veces. Por ejemplo, si haces `:earlier 2`, Vim volverá a un estado de texto más antiguo hace dos cambios. Es lo mismo que hacer `g-` dos veces. También puedes indicarle que vaya al estado de texto más antiguo hace 10 guardados con `:earlier 10f`.

El mismo conjunto de argumentos funciona con el contraparte de `:earlier`: `:later`.

```shell
:later 10s    ir al estado 10 segundos después
:later 10m    ir al estado 10 minutos después
:later 10h    ir al estado 10 horas después
:later 10d    ir al estado 10 días después
:later 10     ir al estado más nuevo 10 veces
:later 10f    ir al estado 10 guardados después
```

## Aprende a Deshacer de Manera Inteligente

`u` y `Ctrl-R` son dos comandos indispensables de Vim para corregir errores. Apréndelos primero. A continuación, aprende a usar `:earlier` y `:later` usando primero los argumentos de tiempo. Después de eso, tómate tu tiempo para entender el árbol de deshacer. El plugin [vim-mundo](https://github.com/simnalamburt/vim-mundo) me ayudó mucho. Escribe junto con los textos en este capítulo y verifica el árbol de deshacer a medida que haces cada cambio. Una vez que lo comprendas, nunca verás el sistema de deshacer de la misma manera nuevamente.

Antes de este capítulo, aprendiste cómo encontrar cualquier texto en un espacio de proyecto, con deshacer, ahora puedes encontrar cualquier texto en una dimensión temporal. Ahora eres capaz de buscar cualquier texto por su ubicación y el tiempo en que fue escrito. Has logrado la omnipresencia en Vim.