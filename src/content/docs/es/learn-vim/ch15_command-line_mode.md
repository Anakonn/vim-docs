---
description: Este documento enseña comandos y trucos para el modo de línea de comandos
  en Vim, incluyendo cómo entrar y salir de este modo y sus diferentes comandos.
title: Ch15. Command-line Mode
---

En los últimos tres capítulos, aprendiste cómo usar los comandos de búsqueda (`/`, `?`), el comando de sustitución (`:s`), el comando global (`:g`) y el comando externo (`!`). Estos son ejemplos de comandos en modo de línea de comandos.

En este capítulo, aprenderás varios consejos y trucos para el modo de línea de comandos.

## Ingresar y Salir del Modo de Línea de Comandos

El modo de línea de comandos es un modo en sí mismo, al igual que el modo normal, el modo de inserción y el modo visual. Cuando estás en este modo, el cursor se mueve a la parte inferior de la pantalla donde puedes escribir diferentes comandos.

Hay 4 comandos diferentes que puedes usar para ingresar al modo de línea de comandos:
- Patrones de búsqueda (`/`, `?`)
- Comandos de línea de comandos (`:`)
- Comandos externos (`!`)

Puedes ingresar al modo de línea de comandos desde el modo normal o el modo visual.

Para salir del modo de línea de comandos, puedes usar `<Esc>`, `Ctrl-C` o `Ctrl-[`.

*Otras literaturas pueden referirse al "comando de línea de comandos" como "comando Ex" y al "comando externo" como "comando de filtro" o "operador bang".*

## Repetir el Comando Anterior

Puedes repetir el comando de línea de comandos anterior o el comando externo con `@:`.

Si acabas de ejecutar `:s/foo/bar/g`, ejecutar `@:` repite esa sustitución. Si acabas de ejecutar `:.!tr '[a-z]' '[A-Z]'`, ejecutar `@:` repite el último filtro de traducción de comando externo.

## Atajos del Modo de Línea de Comandos

Mientras estás en el modo de línea de comandos, puedes moverte a la izquierda o a la derecha, un carácter a la vez, con la flecha `Izquierda` o `Derecha`.

Si necesitas moverte por palabras, usa `Shift-Izquierda` o `Shift-Derecha` (en algunos sistemas operativos, es posible que debas usar `Ctrl` en lugar de `Shift`).

Para ir al inicio de la línea, usa `Ctrl-B`. Para ir al final de la línea, usa `Ctrl-E`.

Similar al modo de inserción, dentro del modo de línea de comandos, tienes tres formas de eliminar caracteres:

```shell
Ctrl-H    Eliminar un carácter
Ctrl-W    Eliminar una palabra
Ctrl-U    Eliminar toda la línea
```
Finalmente, si deseas editar el comando como lo harías con un archivo de texto normal, usa `Ctrl-F`.

Esto también te permite buscar entre los comandos anteriores, editarlos y volver a ejecutarlos presionando `<Enter>` en "modo normal de edición de línea de comandos".

## Registro y Autocompletar

Mientras estás en el modo de línea de comandos, puedes insertar textos desde el registro de Vim con `Ctrl-R` de la misma manera que en el modo de inserción. Si tienes la cadena "foo" guardada en el registro a, puedes insertarla ejecutando `Ctrl-R a`. Todo lo que puedes obtener del registro en el modo de inserción, puedes hacerlo también desde el modo de línea de comandos.

Además, también puedes obtener la palabra bajo el cursor con `Ctrl-R Ctrl-W` (`Ctrl-R Ctrl-A` para la PALABRA bajo el cursor). Para obtener la línea bajo el cursor, usa `Ctrl-R Ctrl-L`. Para obtener el nombre del archivo bajo el cursor, usa `Ctrl-R Ctrl-F`.

También puedes autocompletar comandos existentes. Para autocompletar el comando `echo`, mientras estás en el modo de línea de comandos, escribe "ec", luego presiona `<Tab>`. Deberías ver en la parte inferior izquierda los comandos de Vim que comienzan con "ec" (ejemplo: `echo echoerr echohl echomsg econ`). Para ir a la siguiente opción, presiona `<Tab>` o `Ctrl-N`. Para ir a la opción anterior, presiona `<Shift-Tab>` o `Ctrl-P`.

Algunos comandos de línea de comandos aceptan nombres de archivos como argumentos. Un ejemplo es `edit`. También puedes autocompletar aquí. Después de escribir el comando, `:e ` (no olvides el espacio), presiona `<Tab>`. Vim listará todos los nombres de archivos relevantes que puedes elegir, para que no tengas que escribirlo desde cero.

## Ventana de Historial y Ventana de Línea de Comandos

Puedes ver el historial de comandos de línea de comandos y términos de búsqueda (esto requiere la función `+cmdline_hist`).

Para abrir el historial de línea de comandos, ejecuta `:his :`. Deberías ver algo como lo siguiente:

```shell
## Historial de Cmd
2  e file1.txt
3  g/foo/d
4  s/foo/bar/g
```

Vim lista el historial de todos los comandos `:` que ejecutas. Por defecto, Vim almacena los últimos 50 comandos. Para cambiar la cantidad de entradas que Vim recuerda a 100, ejecuta `set history=100`.

Un uso más útil del historial de línea de comandos es a través de la ventana de línea de comandos, `q:`. Esto abrirá una ventana de historial editable y buscable. Supongamos que tienes estas expresiones en el historial cuando presionas `q:`:

```shell
51  s/verylongsubstitutionpattern/pancake/g
52  his :
53  wq
```

Si tu tarea actual es hacer `s/verylongsubstitutionpattern/donut/g`, en lugar de escribir el comando desde cero, ¿por qué no reutilizar `s/verylongsubstitutionpattern/pancake/g`? Después de todo, lo único que es diferente es la palabra sustituida, "donut" frente a "pancake". Todo lo demás es igual.

Después de ejecutar `q:`, encuentra `s/verylongsubstitutionpattern/pancake/g` en el historial (puedes usar la navegación de Vim en este entorno) y edítalo directamente. Cambia "pancake" por "donut" dentro de la ventana de historial, luego presiona `<Enter>`. ¡Boom! Vim ejecuta `s/verylongsubstitutionpattern/donut/g` por ti. ¡Súper conveniente!

De manera similar, para ver el historial de búsqueda, ejecuta `:his /` o `:his ?`. Para abrir la ventana de historial de búsqueda donde puedes buscar y editar el historial pasado, ejecuta `q/` o `q?`.

Para salir de esta ventana, presiona `Ctrl-C`, `Ctrl-W C`, o escribe `:quit`.

## Más Comandos de Línea de Comandos

Vim tiene cientos de comandos incorporados. Para ver todos los comandos que tiene Vim, consulta `:h ex-cmd-index` o `:h :index`.

## Aprende el Modo de Línea de Comandos de Manera Inteligente

Comparado con los otros tres modos, el modo de línea de comandos es como la navaja suiza de la edición de texto. Puedes editar texto, modificar archivos y ejecutar comandos, solo por nombrar algunos. Este capítulo es una colección de detalles del modo de línea de comandos. También cierra los modos de Vim. Ahora que sabes cómo usar el modo normal, el modo de inserción, el modo visual y el modo de línea de comandos, puedes editar texto con Vim más rápido que nunca.

Es hora de alejarse de los modos de Vim y aprender cómo hacer una navegación aún más rápida con las etiquetas de Vim.