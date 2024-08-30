---
description: Aprende a preservar la configuración de tus proyectos en Vim utilizando
  View, Session y Viminfo, para que tu entorno se mantenga como lo dejaste.
title: Ch20. Views, Sessions, and Viminfo
---

Después de trabajar en un proyecto durante un tiempo, es posible que encuentres que el proyecto comienza a tomar forma con sus propias configuraciones, pliegues, búferes, diseños, etc. Es como decorar tu apartamento después de haber vivido en él durante un tiempo. El problema es que, cuando cierras Vim, pierdes esos cambios. ¿No sería genial poder mantener esos cambios para que la próxima vez que abras Vim, se vea como si nunca te hubieras ido?

En este capítulo, aprenderás a usar View, Session y Viminfo para preservar una "instantánea" de tus proyectos.

## View

Una View es el subconjunto más pequeño de los tres (View, Session, Viminfo). Es una colección de configuraciones para una ventana. Si pasas mucho tiempo trabajando en una ventana y deseas preservar los mapas y pliegues, puedes usar una View.

Vamos a crear un archivo llamado `foo.txt`:

```shell
foo1
foo2
foo3
foo4
foo5
foo6
foo7
foo8
foo9
foo10
```

En este archivo, crea tres cambios:
1. En la línea 1, crea un pliegue manual `zf4j` (pliega las siguientes 4 líneas).
2. Cambia la configuración `number`: `setlocal nonumber norelativenumber`. Esto eliminará los indicadores de número en el lado izquierdo de la ventana.
3. Crea un mapeo local para bajar dos líneas cada vez que presiones `j` en lugar de una: `:nnoremap <buffer> j jj`.

Tu archivo debería verse así:

```shell
+-- 5 lines: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

### Configurando Atributos de View

Ejecuta:

```shell
:set viewoptions?
```

Por defecto debería decir (el tuyo puede verse diferente dependiendo de tu vimrc):

```shell
viewoptions=folds,cursor,curdir
```

Vamos a configurar `viewoptions`. Los tres atributos que deseas preservar son los pliegues, los mapas y las opciones de configuración locales. Si tu configuración se parece a la mía, ya tienes la opción `folds`. Necesitas decirle a View que recuerde las `localoptions`. Ejecuta:

```shell
:set viewoptions+=localoptions
```

Para aprender qué otras opciones están disponibles para `viewoptions`, consulta `:h viewoptions`. Ahora si ejecutas `:set viewoptions?`, deberías ver:

```shell
viewoptions=folds,cursor,curdir,localoptions
```

### Guardando la View

Con la ventana `foo.txt` correctamente plegada y teniendo las opciones `nonumber norelativenumber`, vamos a guardar la View. Ejecuta:

```shell
:mkview
```

Vim crea un archivo de View.

### Archivos de View

Podrías preguntarte, "¿Dónde guardó Vim este archivo de View?" Para ver dónde guarda Vim, ejecuta:

```shell
:set viewdir?
```

En sistemas operativos basados en Unix, el valor por defecto debería decir `~/.vim/view` (si tienes un sistema operativo diferente, podría mostrar una ruta diferente. Consulta `:h viewdir` para más información). Si estás ejecutando un sistema operativo basado en Unix y deseas cambiarlo a una ruta diferente, agrega esto a tu vimrc:

```shell
set viewdir=$HOME/else/where
```

### Cargando el Archivo de View

Cierra `foo.txt` si no lo has hecho, luego abre `foo.txt` de nuevo. **Deberías ver el texto original sin los cambios.** Eso es lo esperado.

Para restaurar el estado, necesitas cargar el archivo de View. Ejecuta:

```shell
:loadview
```

Ahora deberías ver:

```shell
+-- 5 lines: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

Los pliegues, configuraciones locales y mapeos locales se han restaurado. Si te das cuenta, tu cursor también debería estar en la línea donde lo dejaste cuando ejecutaste `:mkview`. Siempre que tengas la opción `cursor`, View también recuerda la posición de tu cursor.

### Múltiples Views

Vim te permite guardar 9 Views numeradas (1-9).

Supongamos que deseas hacer un pliegue adicional (digamos que quieres plegar las dos últimas líneas) con `:9,10 fold`. Vamos a guardar esto como View 1. Ejecuta:

```shell
:mkview 1
```

Si deseas hacer un pliegue más con `:6,7 fold` y guardarlo como una View diferente, ejecuta:

```shell
:mkview 2
```

Cierra el archivo. Cuando abras `foo.txt` y quieras cargar la View 1, ejecuta:

```shell
:loadview 1
```

Para cargar la View 2, ejecuta:

```shell
:loadview 2
```

Para cargar la View original, ejecuta:

```shell
:loadview
```

### Automatizando la Creación de Views

Una de las peores cosas que pueden suceder es que, después de pasar incontables horas organizando un archivo grande con pliegues, accidentalmente cierres la ventana y pierdas toda la información de los pliegues. Para prevenir esto, podrías querer crear automáticamente una View cada vez que cierres un búfer. Agrega esto a tu vimrc:

```shell
autocmd BufWinLeave *.txt mkview
```

Además, podría ser útil cargar la View cuando abras un búfer:

```shell
autocmd BufWinEnter *.txt silent loadview
```

Ahora no tienes que preocuparte por crear y cargar Views más cuando trabajas con archivos `txt`. Ten en cuenta que con el tiempo, tu `~/.vim/view` podría comenzar a acumular archivos de View. Es bueno limpiarlo una vez cada pocos meses.

## Sessions

Si una View guarda las configuraciones de una ventana, una Session guarda la información de todas las ventanas (incluido el diseño).

### Creando una Nueva Session

Supongamos que estás trabajando con estos 3 archivos en un proyecto `foobarbaz`:

Dentro de `foo.txt`:

```shell
foo1
foo2
foo3
foo4
foo5
foo6
foo7
foo8
foo9
foo10
```

Dentro de `bar.txt`:

```shell
bar1
bar2
bar3
bar4
bar5
bar6
bar7
bar8
bar9
bar10
```

Dentro de `baz.txt`:

```shell
baz1
baz2
baz3
baz4
baz5
baz6
baz7
baz8
baz9
baz10
```

Ahora digamos que dividiste tus ventanas con `:split` y `:vsplit`. Para preservar este aspecto, necesitas guardar la Session. Ejecuta:

```shell
:mksession
```

A diferencia de `mkview`, que guarda en `~/.vim/view` por defecto, `mksession` guarda un archivo de Session (`Session.vim`) en el directorio actual. Echa un vistazo al archivo si tienes curiosidad por saber qué hay dentro.

Si deseas guardar el archivo de Session en otro lugar, puedes pasar un argumento a `mksession`:

```shell
:mksession ~/some/where/else.vim
```

Si deseas sobrescribir el archivo de Session existente, llama al comando con un `!` (`:mksession! ~/some/where/else.vim`).

### Cargando una Session

Para cargar una Session, ejecuta:

```shell
:source Session.vim
```

¡Ahora Vim se verá exactamente como lo dejaste, incluyendo las ventanas divididas! Alternativamente, también puedes cargar un archivo de Session desde la terminal:

```shell
vim -S Session.vim
```

### Configurando Atributos de Session

Puedes configurar los atributos que guarda la Session. Para ver qué se está guardando actualmente, ejecuta:

```shell
:set sessionoptions?
```

El mío dice:

```shell
blank,buffers,curdir,folds,help,tabpages,winsize,terminal
```

Si no deseas guardar `terminal` cuando guardas una Session, elimínalo de las opciones de sesión. Ejecuta:

```shell
:set sessionoptions-=terminal
```

Si deseas agregar una `options` al guardar una Session, ejecuta:

```shell
:set sessionoptions+=options
```

Aquí hay algunos atributos que `sessionoptions` puede almacenar:
- `blank` almacena ventanas vacías
- `buffers` almacena búferes
- `folds` almacena pliegues
- `globals` almacena variables globales (deben comenzar con una letra mayúscula y contener al menos una letra minúscula)
- `options` almacena opciones y mapeos
- `resize` almacena líneas y columnas de ventana
- `winpos` almacena la posición de la ventana
- `winsize` almacena los tamaños de ventana
- `tabpages` almacena pestañas
- `unix` almacena archivos en formato Unix

Para la lista completa, consulta `:h 'sessionoptions'`.

Session es una herramienta útil para preservar los atributos externos de tu proyecto. Sin embargo, algunos atributos internos no se guardan con Session, como marcas locales, registros, historiales, etc. Para guardarlos, ¡necesitas usar Viminfo!

## Viminfo

Si te das cuenta, después de copiar una palabra en el registro a y salir de Vim, la próxima vez que abras Vim, todavía tendrás ese texto almacenado en el registro a. Esto es en realidad obra de Viminfo. Sin él, Vim no recordará el registro después de cerrar Vim.

Si usas Vim 8 o superior, Vim habilita Viminfo por defecto, ¡así que podrías haber estado usando Viminfo todo este tiempo sin saberlo!

Podrías preguntar: "¿Qué guarda Viminfo? ¿Cómo se diferencia de Session?"

Para usar Viminfo, primero necesitas tener la característica `+viminfo` disponible (`:version`). Viminfo almacena:
- El historial de la línea de comandos.
- El historial de cadenas de búsqueda.
- El historial de líneas de entrada.
- Contenidos de registros no vacíos.
- Marcas para varios archivos.
- Marcas de archivo, que apuntan a ubicaciones en archivos.
- Última búsqueda / patrón de sustitución (para 'n' y '&').
- La lista de búferes.
- Variables globales.

En general, Session almacena los atributos "externos" y Viminfo los atributos "internos".

A diferencia de Session, donde puedes tener un archivo de Session por proyecto, normalmente usarás un archivo de Viminfo por computadora. Viminfo es agnóstico al proyecto.

La ubicación por defecto de Viminfo para Unix es `$HOME/.viminfo` (`~/.viminfo`). Si usas un sistema operativo diferente, tu ubicación de Viminfo podría ser diferente. Consulta `:h viminfo-file-name`. Cada vez que haces cambios "internos", como copiar un texto en un registro, Vim actualiza automáticamente el archivo de Viminfo.

*Asegúrate de tener la opción `nocompatible` configurada (`set nocompatible`), de lo contrario, tu Viminfo no funcionará.*

### Escribiendo y Leyendo Viminfo

Aunque solo usarás un archivo de Viminfo, puedes crear múltiples archivos de Viminfo. Para escribir un archivo de Viminfo, usa el comando `:wviminfo` (`:wv` para abreviar).

```shell
:wv ~/.viminfo_extra
```

Para sobrescribir un archivo de Viminfo existente, agrega un signo de exclamación al comando `wv`:

```shell
:wv! ~/.viminfo_extra
```

Por defecto, Vim leerá del archivo `~/.viminfo`. Para leer de un archivo de Viminfo diferente, ejecuta `:rviminfo`, o `:rv` para abreviar:

```shell
:rv ~/.viminfo_extra
```

Para iniciar Vim con un archivo de Viminfo diferente desde la terminal, usa la bandera `i`:

```shell
vim -i viminfo_extra
```

Si usas Vim para diferentes tareas, como codificación y escritura, puedes crear un Viminfo optimizado para escribir y otro para codificar.

```shell
vim -i viminfo_writing

vim -i viminfo_coding
```

### Iniciando Vim Sin Viminfo

Para iniciar Vim sin Viminfo, puedes ejecutar desde la terminal:

```shell
vim -i NONE
```

Para hacerlo permanente, puedes agregar esto a tu archivo vimrc:

```shell
set viminfo="NONE"
```

### Configurando Atributos de Viminfo

Similar a `viewoptions` y `sessionoptions`, puedes indicar qué atributos guardar con la opción `viminfo`. Ejecuta:

```shell
:set viminfo?
```

Recibirás:

```shell
!,'100,<50,s10,h
```

Esto parece críptico. Vamos a desglosarlo:
- `!` guarda variables globales que comienzan con una letra mayúscula y no contienen letras minúsculas. Recuerda que `g:` indica una variable global. Por ejemplo, si en algún momento escribiste la asignación `let g:FOO = "foo"`, Viminfo guardará la variable global `FOO`. Sin embargo, si hiciste `let g:Foo = "foo"`, Viminfo no guardará esta variable global porque contiene letras minúsculas. Sin `!`, Vim no guardará esas variables globales.
- `'100` representa marcas. En este caso, Viminfo guardará las marcas locales (a-z) de los últimos 100 archivos. Ten en cuenta que si le dices a Viminfo que guarde demasiados archivos, Vim puede comenzar a ralentizarse. 1000 es un buen número a tener.
- `<50` le dice a Viminfo cuántas líneas máximas se guardan para cada registro (50 en este caso). Si copio 100 líneas de texto en el registro a (`"ay99j`) y cierro Vim, la próxima vez que abra Vim y pegue desde el registro a (`"ap`), Vim solo pegará un máximo de 50 líneas. Si no das un número máximo de líneas, *todas* las líneas se guardarán. Si le das 0, no se guardará nada.
- `s10` establece un límite de tamaño (en kb) para un registro. En este caso, cualquier registro mayor de 10kb será excluido.
- `h` desactiva el resaltado (de `hlsearch`) cuando Vim se inicia.

Hay otras opciones que puedes pasar. Para aprender más, consulta `:h 'viminfo'`.
## Usando Vistas, Sesiones y Viminfo de Manera Inteligente

Vim tiene Vista, Sesión y Viminfo para tomar diferentes niveles de instantáneas de tu entorno Vim. Para micro proyectos, usa Vistas. Para proyectos más grandes, usa Sesiones. Debes tomarte tu tiempo para revisar todas las opciones que ofrecen Vista, Sesión y Viminfo.

Crea tu propia Vista, Sesión y Viminfo para tu propio estilo de edición. Si alguna vez necesitas usar Vim fuera de tu computadora, ¡puedes cargar tus configuraciones y te sentirás inmediatamente como en casa!