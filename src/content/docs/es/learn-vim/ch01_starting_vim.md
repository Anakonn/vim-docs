---
description: Aprende a iniciar Vim desde la terminal, instalarlo y familiarizarte
  con su interfaz y características como un editor modal en este capítulo.
title: Ch01. Starting Vim
---

En este capítulo, aprenderás diferentes formas de iniciar Vim desde la terminal. Estaba usando Vim 8.2 cuando escribí esta guía. Si usas Neovim o una versión anterior de Vim, deberías estar mayormente bien, pero ten en cuenta que algunos comandos pueden no estar disponibles.

## Instalación

No voy a detallar las instrucciones sobre cómo instalar Vim en una máquina específica. La buena noticia es que la mayoría de las computadoras basadas en Unix deberían venir con Vim instalado. Si no, la mayoría de las distribuciones deberían tener algunas instrucciones para instalar Vim.

Para descargar más información sobre el proceso de instalación de Vim, consulta el sitio web oficial de descargas de Vim o el repositorio oficial de github de Vim:
- [Sitio web de Vim](https://www.vim.org/download.php)
- [Github de Vim](https://github.com/vim/vim)

## El Comando Vim

Ahora que tienes Vim instalado, ejecuta esto desde la terminal:

```bash
vim
```

Deberías ver una pantalla de introducción. Este es el lugar donde estarás trabajando en tu nuevo archivo. A diferencia de la mayoría de los editores de texto e IDEs, Vim es un editor modal. Si quieres escribir "hola", necesitas cambiar a modo de inserción con `i`. Presiona `ihola<Esc>` para insertar el texto "hola".

## Salir de Vim

Hay varias formas de salir de Vim. La más común es escribir:

```shell
:quit
```

Puedes escribir `:q` para abreviar. Ese comando es un comando de modo de línea de comandos (otro de los modos de Vim). Si escribes `:` en modo normal, el cursor se moverá a la parte inferior de la pantalla donde puedes escribir algunos comandos. Aprenderás sobre el modo de línea de comandos más adelante en el capítulo 15. Si estás en modo de inserción, escribir `:` producirá literalmente el carácter ":" en la pantalla. En este caso, necesitas volver al modo normal. Escribe `<Esc>` para cambiar al modo normal. Por cierto, también puedes volver al modo normal desde el modo de línea de comandos presionando `<Esc>`. Notarás que puedes "escapar" de varios modos de Vim de vuelta al modo normal presionando `<Esc>`.

## Guardar un Archivo

Para guardar tus cambios, escribe:

```shell
:write
```

También puedes escribir `:w` para abreviar. Si este es un nuevo archivo, necesitas darle un nombre antes de poder guardarlo. Llamémoslo `archivo.txt`. Ejecuta:

```shell
:w archivo.txt
```

Para guardar y salir, puedes combinar los comandos `:w` y `:q`:

```shell
:wq
```

Para salir sin guardar ningún cambio, agrega `!` después de `:q` para forzar la salida:

```shell
:q!
```

Hay otras formas de salir de Vim, pero estas son las que usarás a diario.

## Ayuda

A lo largo de esta guía, te referiré a varias páginas de ayuda de Vim. Puedes ir a la página de ayuda escribiendo `:help {algún-comando}` (`:h` para abreviar). Puedes pasar al comando `:h` un tema o un nombre de comando como argumento. Por ejemplo, para aprender sobre diferentes formas de salir de Vim, escribe:

```shell
:h write-quit
```

¿Cómo supe que buscar "write-quit"? En realidad, no lo sabía. Simplemente escribí `:h`, luego "quit", y luego `<Tab>`. Vim mostró palabras clave relevantes para elegir. Si alguna vez necesitas buscar algo ("Desearía que Vim pudiera hacer esto..."), solo escribe `:h` y prueba algunas palabras clave, luego `<Tab>`.

## Abrir un Archivo

Para abrir un archivo (`hola1.txt`) en Vim desde la terminal, ejecuta:

```bash
vim hola1.txt
```

También puedes abrir múltiples archivos a la vez:

```bash
vim hola1.txt hola2.txt hola3.txt
```

Vim abre `hola1.txt`, `hola2.txt` y `hola3.txt` en búferes separados. Aprenderás sobre búferes en el próximo capítulo.

## Argumentos

Puedes pasar el comando de terminal `vim` con diferentes banderas y opciones.

Para verificar la versión actual de Vim, ejecuta:

```bash
vim --version
```

Esto te dice la versión actual de Vim y todas las características disponibles marcadas con `+` o `-`. Algunas de estas características en esta guía requieren que ciertas características estén disponibles. Por ejemplo, explorarás el historial de línea de comandos de Vim en un capítulo posterior con el comando `:history`. Tu Vim necesita tener la característica `+cmdline_history` para que el comando funcione. Hay una buena probabilidad de que el Vim que acabas de instalar tenga todas las características necesarias, especialmente si es de una fuente de descarga popular.

Muchas cosas que haces desde la terminal también se pueden hacer desde dentro de Vim. Para ver la versión desde *dentro* de Vim, puedes ejecutar esto:

```shell
:version
```

Si deseas abrir el archivo `hola.txt` y ejecutar inmediatamente un comando de Vim, puedes pasar al comando `vim` la opción `+{cmd}`.

En Vim, puedes sustituir cadenas con el comando `:s` (abreviatura de `:substitute`). Si deseas abrir `hola.txt` y sustituir todos "panqueques" por "bagel", ejecuta:

```bash
vim +%s/panqueque/bagel/g hola.txt
```

Estos comandos de Vim se pueden apilar:

```bash
vim +%s/panqueque/bagel/g +%s/bagel/huevo/g +%s/huevo/donut/g hola.txt
```

Vim reemplazará todas las instancias de "panqueque" por "bagel", luego reemplazará "bagel" por "huevo", luego reemplazará "huevo" por "donut" (aprenderás sobre sustitución en un capítulo posterior).

También puedes pasar la opción `-c` seguida de un comando de Vim en lugar de la sintaxis `+`:

```bash
vim -c %s/panqueque/bagel/g hola.txt
vim -c %s/panqueque/bagel/g -c %s/bagel/huevo/g -c %s/huevo/donut/g hola.txt
```

## Abrir Múltiples Ventanas

Puedes iniciar Vim en ventanas horizontales y verticales divididas con las opciones `-o` y `-O`, respectivamente.

Para abrir Vim con dos ventanas horizontales, ejecuta:

```bash
vim -o2
```

Para abrir Vim con 5 ventanas horizontales, ejecuta:

```bash
vim -o5
```

Para abrir Vim con 5 ventanas horizontales y llenar las primeras dos con `hola1.txt` y `hola2.txt`, ejecuta:

```bash
vim -o5 hola1.txt hola2.txt
```

Para abrir Vim con dos ventanas verticales, 5 ventanas verticales y 5 ventanas verticales con 2 archivos:

```bash
vim -O2
vim -O5
vim -O5 hola1.txt hola2.txt
```

## Suspender

Si necesitas suspender Vim mientras editas, puedes presionar `Ctrl-z`. También puedes ejecutar el comando `:stop` o `:suspend`. Para volver a Vim suspendido, ejecuta `fg` desde la terminal.

## Iniciar Vim de Manera Inteligente

El comando `vim` puede aceptar muchas opciones diferentes, al igual que cualquier otro comando de terminal. Dos opciones te permiten pasar un comando de Vim como parámetro: `+{cmd}` y `-c cmd`. A medida que aprendas más comandos a lo largo de esta guía, verifica si puedes aplicarlo al iniciar Vim. También siendo un comando de terminal, puedes combinar `vim` con muchos otros comandos de terminal. Por ejemplo, puedes redirigir la salida del comando `ls` para ser editada en Vim con `ls -l | vim -`.

Para aprender más sobre el comando `vim` en la terminal, consulta `man vim`. Para aprender más sobre el editor Vim, continúa leyendo esta guía junto con el comando `:help`.