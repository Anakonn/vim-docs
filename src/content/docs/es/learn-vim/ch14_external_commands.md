---
description: Este documento explica cómo extender Vim para trabajar con comandos externos,
  utilizando el comando bang (`!`) para leer, escribir y ejecutar comandos.
title: Ch14. External Commands
---

Dentro del sistema Unix, encontrarás muchos comandos pequeños y hiper-especializados que hacen una cosa (y la hacen bien). Puedes encadenar estos comandos para trabajar juntos y resolver un problema complejo. ¿No sería genial si pudieras usar estos comandos desde dentro de Vim?

Definitivamente. En este capítulo, aprenderás cómo extender Vim para trabajar sin problemas con comandos externos.

## El Comando Bang

Vim tiene un comando bang (`!`) que puede hacer tres cosas:

1. Leer la STDOUT de un comando externo en el búfer actual.
2. Escribir el contenido de tu búfer como STDIN a un comando externo.
3. Ejecutar un comando externo desde dentro de Vim.

Vamos a revisar cada uno de ellos.

## Leer la STDOUT de un Comando en Vim

La sintaxis para leer la STDOUT de un comando externo en el búfer actual es:

```shell
:r !cmd
```

`:r` es el comando de lectura de Vim. Si lo usas sin `!`, puedes usarlo para obtener el contenido de un archivo. Si tienes un archivo `file1.txt` en el directorio actual y ejecutas:

```shell
:r file1.txt
```

Vim pondrá el contenido de `file1.txt` en el búfer actual.

Si ejecutas el comando `:r` seguido de un `!` y un comando externo, la salida de ese comando se insertará en el búfer actual. Para obtener el resultado del comando `ls`, ejecuta:

```shell
:r !ls
```

Devuelve algo como:

```shell
file1.txt
file2.txt
file3.txt
```

Puedes leer los datos del comando `curl`:

```shell
:r !curl -s 'https://jsonplaceholder.typicode.com/todos/1'
```

El comando `r` también acepta una dirección:

```shell
:10r !cat file1.txt
```

Ahora la STDOUT de ejecutar `cat file1.txt` se insertará después de la línea 10.

## Escribir el Contenido del Búfer en un Comando Externo

El comando `:w`, además de guardar un archivo, se puede usar para pasar el texto en el búfer actual como STDIN para un comando externo. La sintaxis es:

```shell
:w !cmd
```

Si tienes estas expresiones:

```shell
console.log("Hello Vim");
console.log("Vim is awesome");
```

Asegúrate de tener [node](https://nodejs.org/en/) instalado en tu máquina, luego ejecuta:

```shell
:w !node
```

Vim usará `node` para ejecutar las expresiones de JavaScript para imprimir "Hello Vim" y "Vim is awesome".

Al usar el comando `:w`, Vim usa todos los textos en el búfer actual, similar al comando global (la mayoría de los comandos de línea de comandos, si no le pasas un rango, solo ejecutan el comando contra la línea actual). Si pasas `:w` una dirección específica:

```shell
:2w !node
```

Vim solo usa el texto de la segunda línea en el intérprete `node`.

Hay una diferencia sutil pero significativa entre `:w !node` y `:w! node`. Con `:w !node`, estás "escribiendo" el texto en el búfer actual en el comando externo `node`. Con `:w! node`, estás forzando a guardar un archivo y nombrando el archivo "node".

## Ejecutar un Comando Externo

Puedes ejecutar un comando externo desde dentro de Vim con el comando bang. La sintaxis es:

```shell
:!cmd
```

Para ver el contenido del directorio actual en formato largo, ejecuta:

```shell
:!ls -ls
```

Para matar un proceso que se está ejecutando en PID 3456, puedes ejecutar:

```shell
:!kill -9 3456
```

Puedes ejecutar cualquier comando externo sin salir de Vim, así puedes mantenerte enfocado en tu tarea.

## Filtrar Textos

Si le das `!` un rango, se puede usar para filtrar textos. Supongamos que tienes los siguientes textos:

```shell
hello vim
hello vim
```

Vamos a poner en mayúsculas la línea actual usando el comando `tr` (traducir). Ejecuta:

```shell
:.!tr '[:lower:]' '[:upper:]'
```

El resultado:

```shell
HELLO VIM
hello vim
```

El desglose:
- `.!` ejecuta el comando de filtro en la línea actual.
- `tr '[:lower:]' '[:upper:]'` llama al comando `tr` para reemplazar todos los caracteres en minúsculas por mayúsculas.

Es imperativo pasar un rango para ejecutar el comando externo como un filtro. Si intentas ejecutar el comando anterior sin el `.` (`:!tr '[:lower:]' '[:upper:]'`), verás un error.

Supongamos que necesitas eliminar la segunda columna en ambas líneas con el comando `awk`:

```shell
:%!awk "{print $1}"
```

El resultado:

```shell
hello
hello
```

El desglose:
- `:%!` ejecuta el comando de filtro en todas las líneas (`%`).
- `awk "{print $1}"` imprime solo la primera columna de la coincidencia.

Puedes encadenar múltiples comandos con el operador de cadena (`|`) al igual que en la terminal. Supongamos que tienes un archivo con estos deliciosos elementos de desayuno:

```shell
name price
chocolate pancake 10
buttermilk pancake 9
blueberry pancake 12
```

Si necesitas ordenarlos según el precio y mostrar solo el menú con un espaciado uniforme, puedes ejecutar:

```shell
:%!awk 'NR > 1' | sort -nk 3 | column -t
```

El resultado:
```shell
buttermilk pancake 9
chocolate pancake 10
blueberry pancake 12
```

El desglose:
- `:%!` aplica el filtro a todas las líneas (`%`).
- `awk 'NR > 1'` muestra los textos solo desde la fila número dos en adelante.
- `|` encadena el siguiente comando.
- `sort -nk 3` ordena numéricamente (`n`) usando los valores de la columna 3 (`k 3`).
- `column -t` organiza el texto con un espaciado uniforme.

## Comando en Modo Normal

Vim tiene un operador de filtro (`!`) en el modo normal. Si tienes los siguientes saludos:

```shell
hello vim
hola vim
bonjour vim
salve vim
```

Para poner en mayúsculas la línea actual y la línea de abajo, puedes ejecutar:
```shell
!jtr '[a-z]' '[A-Z]'
```

El desglose:
- `!j` ejecuta el operador de filtro de comando normal (`!`) apuntando a la línea actual y la línea de abajo. Recuerda que, dado que es un operador de modo normal, se aplica la regla gramatical `verbo + sustantivo`. `!` es el verbo y `j` es el sustantivo.
- `tr '[a-z]' '[A-Z]'` reemplaza las letras en minúsculas por letras en mayúsculas.

El comando de filtro normal solo funciona en movimientos / objetos de texto que son al menos una línea o más. Si hubieras intentado ejecutar `!iwtr '[a-z]' '[A-Z]'` (ejecutar `tr` en la palabra interna), descubrirás que aplica el comando `tr` en toda la línea, no en la palabra en la que está tu cursor.

## Aprende Comandos Externos de la Manera Inteligente

Vim no es un IDE. Es un editor modal ligero que es altamente extensible por diseño. Debido a esta extensibilidad, tienes un fácil acceso a cualquier comando externo en tu sistema. Armado con estos comandos externos, Vim está un paso más cerca de convertirse en un IDE. Alguien dijo que el sistema Unix es el primer IDE de todos.

El comando bang es tan útil como la cantidad de comandos externos que conoces. No te preocupes si tu conocimiento de comandos externos es limitado. Yo también tengo mucho que aprender. Toma esto como una motivación para el aprendizaje continuo. Siempre que necesites modificar un texto, verifica si hay un comando externo que pueda resolver tu problema. No te preocupes por dominar todo, solo aprende los que necesitas para completar la tarea actual.