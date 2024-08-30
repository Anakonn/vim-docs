---
description: Este capítulo enseña cómo compilar desde Vim, utilizando el comando `:make`
  y la línea de comandos para facilitar el proceso de compilación de archivos.
title: Ch19. Compile
---

Compilar es un tema importante para muchos lenguajes. En este capítulo, aprenderás cómo compilar desde Vim. También verás formas de aprovechar el comando `:make` de Vim.

## Compilar Desde la Línea de Comandos

Puedes usar el operador bang (`!`) para compilar. Si necesitas compilar tu archivo `.cpp` con `g++`, ejecuta:

```shell
:!g++ hello.cpp -o hello
```

Sin embargo, tener que escribir manualmente el nombre del archivo y el nombre del archivo de salida cada vez es propenso a errores y tedioso. Un makefile es el camino a seguir.

## El Comando Make

Vim tiene un comando `:make` para ejecutar un makefile. Cuando lo ejecutas, Vim busca un makefile en el directorio actual para ejecutar.

Crea un archivo llamado `makefile` en el directorio actual y pon esto dentro:

```shell
all:
	echo "Hola a todos"
foo:
	echo "Hola foo"
list_pls:
	ls
```

Ejecuta esto desde Vim:

```shell
:make
```

Vim lo ejecuta de la misma manera que cuando lo estás ejecutando desde la terminal. El comando `:make` acepta parámetros igual que el comando make de la terminal. Ejecuta:

```shell
:make foo
" Salida "Hola foo"

:make list_pls
" Salida del resultado del comando ls
```

El comando `:make` utiliza el quickfix de Vim para almacenar cualquier error si ejecutas un comando incorrecto. Vamos a ejecutar un objetivo inexistente:

```shell
:make dontexist
```

Deberías ver un error al ejecutar ese comando. Para ver ese error, ejecuta el comando quickfix `:copen` para ver la ventana de quickfix:

```shell
|| make: *** No hay regla para hacer el objetivo `dontexist'.  Detener.
```

## Compilando Con Make

Vamos a usar el makefile para compilar un programa básico en `.cpp`. Primero, vamos a crear un archivo `hello.cpp`:

```shell
#include <iostream>

int main() {
    std::cout << "¡Hola!\n";
    return 0;
}
```

Actualiza tu makefile para construir y ejecutar un archivo `.cpp`:

```shell
all:
	echo "compilar, ejecutar"
build:
	g++ hello.cpp -o hello
run:
	./hello
```

Ahora ejecuta:

```shell
:make build
```

El `g++` compila `./hello.cpp` y crea `./hello`. Luego ejecuta:

```shell
:make run
```

Deberías ver `"¡Hola!"` impreso en la terminal.

## Diferente Programa Make

Cuando ejecutas `:make`, Vim en realidad ejecuta cualquier comando que esté configurado bajo la opción `makeprg`. Si ejecutas `:set makeprg?`, verás:

```shell
makeprg=make
```

El comando `:make` por defecto es el comando externo `make`. Para cambiar el comando `:make` para ejecutar `g++ {tu-nombre-de-archivo}` cada vez que lo ejecutes, ejecuta:

```shell
:set makeprg=g++\ %
```

El `\` es para escapar el espacio después de `g++`. El símbolo `%` en Vim representa el archivo actual. El comando `g++\\ %` es equivalente a ejecutar `g++ hello.cpp`.

Ve a `./hello.cpp` y luego ejecuta `:make`. Vim compila `hello.cpp` y crea `a.out` porque no especificaste la salida. Vamos a refactorizarlo para que nombre la salida compilada con el nombre del archivo original menos la extensión. Ejecuta o agrega esto a vimrc:

```shell
set makeprg=g++\ %\ -o\ %<
```

El desglose:
- `g++\ %` es lo mismo que arriba. Es equivalente a ejecutar `g++ <tu-archivo>`.
- `-o` es la opción de salida.
- `%<` en Vim representa el nombre del archivo actual sin una extensión (`hello.cpp` se convierte en `hello`).

Cuando ejecutas `:make` desde dentro de `./hello.cpp`, se compila en `./hello`. Para ejecutar rápidamente `./hello` desde dentro de `./hello.cpp`, ejecuta `:!./%<`. Nuevamente, esto es lo mismo que ejecutar `:!./{nombre-del-archivo-actual-sin-la-extensión}`.

Para más, consulta `:h :compiler` y `:h write-compiler-plugin`.

## Compilación Automática al Guardar

Puedes hacer la vida aún más fácil automatizando la compilación. Recuerda que puedes usar `autocmd` de Vim para activar acciones automáticas basadas en ciertos eventos. Para compilar automáticamente archivos `.cpp` en cada guardado, agrega esto a tu vimrc:

```shell
autocmd BufWritePost *.cpp make
```

Cada vez que guardes dentro de un archivo `.cpp`, Vim ejecuta el comando `make`.

## Cambiando Compilador

Vim tiene un comando `:compiler` para cambiar rápidamente de compiladores. Tu construcción de Vim probablemente viene con varias configuraciones de compilador preconstruidas. Para verificar qué compiladores tienes, ejecuta:

```shell
:e $VIMRUNTIME/compiler/<Tab>
```

Deberías ver una lista de compiladores para diferentes lenguajes de programación.

Para usar el comando `:compiler`, supongamos que tienes un archivo ruby, `hello.rb` y dentro tiene:

```shell
puts "Hola ruby"
```

Recuerda que si ejecutas `:make`, Vim ejecuta cualquier comando asignado a `makeprg` (el predeterminado es `make`). Si ejecutas:

```shell
:compiler ruby
```

Vim ejecuta el script `$VIMRUNTIME/compiler/ruby.vim` y cambia el `makeprg` para usar el comando `ruby`. Ahora, si ejecutas `:set makeprg?`, debería decir `makeprg=ruby` (esto depende de lo que haya dentro de tu archivo `$VIMRUNTIME/compiler/ruby.vim` o si tienes otros compiladores ruby personalizados. El tuyo podría ser diferente). El comando `:compiler {tu-lenguaje}` te permite cambiar rápidamente a diferentes compiladores. Esto es útil si tu proyecto utiliza múltiples lenguajes.

No tienes que usar `:compiler` y `makeprg` para compilar un programa. Puedes ejecutar un script de prueba, lint un archivo, enviar una señal, o cualquier cosa que desees.

## Creando un Compilador Personalizado

Vamos a crear un compilador simple de Typescript. Instala Typescript (`npm install -g typescript`) en tu máquina. Ahora deberías tener el comando `tsc`. Si no has jugado con typescript antes, `tsc` compila un archivo Typescript en un archivo Javascript. Supongamos que tienes un archivo, `hello.ts`:

```shell
const hello = "hello";
console.log(hello);
```

Si ejecutas `tsc hello.ts`, se compilará en `hello.js`. Sin embargo, si tienes las siguientes expresiones dentro de `hello.ts`:

```shell
const hello = "hello";
hello = "hello again";
console.log(hello);
```

Esto lanzará un error porque no puedes mutar una variable `const`. Ejecutar `tsc hello.ts` lanzará un error:

```shell
hello.ts:2:1 - error TS2588: No se puede asignar a 'person' porque es una constante.

2 person = "hello again";
  ~~~~~~


Se encontró 1 error.
```

Para crear un compilador simple de Typescript, en tu directorio `~/.vim/`, agrega un directorio `compiler` (`~/.vim/compiler/`), luego crea un archivo `typescript.vim` (`~/.vim/compiler/typescript.vim`). Pon esto dentro:

```shell
CompilerSet makeprg=tsc
CompilerSet errorformat=%f:\ %m
```

La primera línea establece el `makeprg` para ejecutar el comando `tsc`. La segunda línea establece el formato de error para mostrar el archivo (`%f`), seguido de un dos puntos literal (`:`) y un espacio escapado (`\ `), seguido del mensaje de error (`%m`). Para aprender más sobre el formato de error, consulta `:h errorformat`.

También deberías leer algunos de los compiladores prehechos para ver cómo lo hacen otros. Consulta `:e $VIMRUNTIME/compiler/<algún-lenguaje>.vim`.

Debido a que algunos plugins pueden interferir con el archivo Typescript, abramos `hello.ts` sin ningún plugin, usando la bandera `--noplugin`:

```shell
vim --noplugin hello.ts
```

Verifica el `makeprg`:

```shell
:set makeprg?
```

Debería decir el programa `make` predeterminado. Para usar el nuevo compilador de Typescript, ejecuta:

```shell
:compiler typescript
```

Cuando ejecutes `:set makeprg?`, debería decir `tsc` ahora. Vamos a ponerlo a prueba. Ejecuta:

```shell
:make %
```

Recuerda que `%` significa el archivo actual. ¡Observa cómo tu compilador de Typescript funciona como se espera! Para ver la lista de error(es), ejecuta `:copen`.

## Compilador Asíncrono

A veces compilar puede llevar mucho tiempo. No quieres estar mirando un Vim congelado mientras esperas que tu proceso de compilación termine. ¿No sería genial si pudieras compilar de manera asíncrona para que aún puedas usar Vim durante la compilación?

Afortunadamente, hay plugins para ejecutar procesos asíncronos. Los dos principales son:

- [vim-dispatch](https://github.com/tpope/vim-dispatch)
- [asyncrun.vim](https://github.com/skywind3000/asyncrun.vim)

En el resto de este capítulo, hablaré sobre vim-dispatch, pero te animo a que pruebes todos los que hay.

*Vim y NeoVim en realidad soportan trabajos asíncronos, pero están más allá del alcance de este capítulo. Si tienes curiosidad, consulta `:h job-channel-overview.txt`.*

## Plugin: Vim-dispatch

Vim-dispatch tiene varios comandos, pero los dos principales son los comandos `:Make` y `:Dispatch`.

### Make Asíncrono

El comando `:Make` de vim-dispatch es similar al `:make` de Vim, pero se ejecuta de manera asíncrona. Si estás en un proyecto de Javascript y necesitas ejecutar `npm t`, podrías intentar establecer tu makeprg como:

```shell
:set makeprg=npm\\ t
```

Si ejecutas:

```shell
:make
```

Vim ejecutará `npm t`, pero estarás mirando la pantalla congelada mientras se ejecutan tus pruebas de JavaScript. Con vim-dispatch, simplemente puedes ejecutar:

```shell
:Make
```

Vim ejecutará `npm t` de manera asíncrona. De esta manera, mientras `npm t` se está ejecutando en un proceso en segundo plano, puedes continuar haciendo lo que estabas haciendo. ¡Increíble!

### Dispatch Asíncrono

El comando `:Dispatch` es como el `:compiler` y el comando `:!`. Puede ejecutar cualquier comando externo de manera asíncrona en Vim.

Supón que estás dentro de un archivo de especificación ruby y necesitas ejecutar una prueba. Ejecuta:

```shell
:Dispatch bundle exec rspec %
```

Vim ejecutará asíncronamente el comando `rspec` contra el archivo actual (`%`).

### Automatizando Dispatch

Vim-dispatch tiene la variable de buffer `b:dispatch` que puedes configurar para evaluar un comando específico automáticamente. Puedes aprovecharlo con `autocmd`. Si agregas esto en tu vimrc:

```shell
autocmd BufEnter *_spec.rb let b:dispatch = 'bundle exec rspec %'
```

Ahora cada vez que entres en un archivo (`BufEnter`) que termine con `_spec.rb`, ejecutar `:Dispatch` ejecutará automáticamente `bundle exec rspec {tu-archivo-especificación-ruby-actual}`.

## Aprende a Compilar de Manera Inteligente

En este capítulo, aprendiste que puedes usar los comandos `make` y `compiler` para ejecutar *cualquier* proceso desde dentro de Vim de manera asíncrona para complementar tu flujo de trabajo de programación. La capacidad de Vim para extenderse con otros programas lo hace poderoso.