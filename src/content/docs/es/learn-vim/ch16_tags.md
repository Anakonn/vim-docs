---
description: Aprende a usar las etiquetas en Vim para navegar rápidamente por definiciones
  en un código, facilitando la comprensión de bases de código desconocidas.
title: Ch16. Tags
---

Una característica útil en la edición de texto es poder ir rápidamente a cualquier definición. En este capítulo, aprenderás a usar las etiquetas de Vim para hacerlo.

## Visión General de las Etiquetas

Supongamos que alguien te entrega una nueva base de código:

```shell
one = One.new
one.donut
```

`One`? `donut`? Bueno, estos podrían haber sido obvios para los desarrolladores que escribieron el código en aquel entonces, pero ahora esos desarrolladores ya no están aquí y depende de ti entender estos códigos oscuros. Una forma de ayudar a entender esto es seguir el código fuente donde se definen `One` y `donut`.

Puedes buscarlos con `fzf` o `grep` (o `vimgrep`), pero en este caso, las etiquetas son más rápidas.

Piensa en las etiquetas como en una libreta de direcciones:

```shell
Nombre    Dirección
Iggy1     1234 Cool St, 11111
Iggy2     9876 Awesome Ave, 2222
```

En lugar de tener un par nombre-dirección, las etiquetas almacenan definiciones emparejadas con direcciones.

Supongamos que tienes estos dos archivos Ruby dentro del mismo directorio:

```shell
## one.rb
class One
  def initialize
    puts "Inicializado"
  end

  def donut
    puts "Bar"
  end
end
```

y

```shell
## two.rb
require './one'

one = One.new
one.donut
```

Para saltar a una definición, puedes usar `Ctrl-]` en el modo normal. Dentro de `two.rb`, ve a la línea donde está `one.donut` y mueve el cursor sobre `donut`. Presiona `Ctrl-]`.

¡Ups! Vim no pudo encontrar el archivo de etiquetas. Necesitas generar el archivo de etiquetas primero.

## Generador de Etiquetas

Vim moderno no viene con un generador de etiquetas, así que tendrás que descargar un generador de etiquetas externo. Hay varias opciones para elegir:

- ctags = Solo C. Disponible casi en todas partes.
- exuberant ctags = Uno de los más populares. Tiene soporte para muchos lenguajes.
- universal ctags = Similar a exuberant ctags, pero más nuevo.
- etags = Para Emacs. Hmm...
- JTags = Java
- ptags.py = Python
- ptags = Perl
- gnatxref = Ada

Si miras tutoriales de Vim en línea, muchos recomendarán [exuberant ctags](http://ctags.sourceforge.net/). Soporta [41 lenguajes de programación](http://ctags.sourceforge.net/languages.html). Yo lo usé y funcionó muy bien. Sin embargo, dado que no se ha mantenido desde 2009, Universal ctags sería una mejor opción. Funciona de manera similar a exuberant ctags y actualmente se está manteniendo.

No entraré en detalles sobre cómo instalar universal ctags. Consulta el repositorio de [universal ctags](https://github.com/universal-ctags/ctags) para más instrucciones.

Asumiendo que tienes universal ctags instalado, generemos un archivo de etiquetas básico. Ejecuta:

```shell
ctags -R .
```

La opción `R` le dice a ctags que realice un escaneo recursivo desde tu ubicación actual (`.`). Deberías ver un archivo `tags` en tu directorio actual. Dentro verás algo como esto:

```shell
!_TAG_FILE_FORMAT	2	/extended format; --format=1 will not append ;" to lines/
!_TAG_FILE_SORTED	1	/0=unsorted, 1=sorted, 2=foldcase/
!_TAG_OUTPUT_FILESEP	slash	/slash or backslash/
!_TAG_OUTPUT_MODE	u-ctags	/u-ctags or e-ctags/
!_TAG_PATTERN_LENGTH_LIMIT	96	/0 for no limit/
!_TAG_PROGRAM_AUTHOR	Universal Ctags Team	//
!_TAG_PROGRAM_NAME	Universal Ctags	/Derived from Exuberant Ctags/
!_TAG_PROGRAM_URL	<https://ctags.io/>	/official site/
!_TAG_PROGRAM_VERSION	0.0.0	/b43eb39/
One	one.rb	/^class One$/;"	c
donut	one.rb	/^  def donut$/;"	f	class:One
initialize	one.rb	/^  def initialize$/;"	f	class:One
```

El tuyo podría verse un poco diferente dependiendo de tu configuración de Vim y el generador de ctags. Un archivo de etiquetas se compone de dos partes: los metadatos de la etiqueta y la lista de etiquetas. Estos metadatos (`!TAG_FILE...`) son generalmente controlados por el generador de ctags. No lo discutiré aquí, pero siéntete libre de consultar su documentación para más información. La lista de etiquetas es una lista de todas las definiciones indexadas por ctags.

Ahora ve a `two.rb`, coloca el cursor en `donut`, y escribe `Ctrl-]`. Vim te llevará al archivo `one.rb` en la línea donde está `def donut`. ¡Éxito! Pero, ¿cómo hizo Vim esto?

## Anatomía de las Etiquetas

Veamos el elemento de etiqueta `donut`:

```shell
donut	one.rb	/^  def donut$/;"	f	class:One
```

El elemento de etiqueta anterior se compone de cuatro componentes: un `tagname`, un `tagfile`, una `tagaddress`, y opciones de etiqueta.
- `donut` es el `tagname`. Cuando tu cursor está en "donut", Vim busca en el archivo de etiquetas una línea que tenga la cadena "donut".
- `one.rb` es el `tagfile`. Vim busca un archivo `one.rb`.
- `/^ def donut$/` es la `tagaddress`. `/.../` es un indicador de patrón. `^` es un patrón para el primer elemento en una línea. Está seguido de dos espacios, luego la cadena `def donut`. Finalmente, `$` es un patrón para el último elemento en una línea.
- `f class:One` es la opción de etiqueta que le dice a Vim que la función `donut` es una función (`f`) y es parte de la clase `One`.

Veamos otro elemento en la lista de etiquetas:

```shell
One	one.rb	/^class One$/;"	c
```

Esta línea funciona de la misma manera que el patrón `donut`:

- `One` es el `tagname`. Ten en cuenta que con las etiquetas, el primer escaneo es sensible a mayúsculas. Si tienes `One` y `one` en la lista, Vim priorizará `One` sobre `one`.
- `one.rb` es el `tagfile`. Vim busca un archivo `one.rb`.
- `/^class One$/` es el patrón de `tagaddress`. Vim busca una línea que comience con (`^`) `class` y termine con (`$`) `One`.
- `c` es una de las posibles opciones de etiqueta. Dado que `One` es una clase Ruby y no un procedimiento, se marca con una `c`.

Dependiendo de qué generador de etiquetas uses, el contenido de tu archivo de etiquetas puede verse diferente. Como mínimo, un archivo de etiquetas debe tener uno de estos formatos:

```shell
1.  {tagname} {TAB} {tagfile} {TAB} {tagaddress}
2.  {tagname} {TAB} {tagfile} {TAB} {tagaddress} {term} {field} ..
```

## El Archivo de Etiquetas

Has aprendido que se crea un nuevo archivo, `tags`, después de ejecutar `ctags -R .`. ¿Cómo sabe Vim dónde buscar el archivo de etiquetas?

Si ejecutas `:set tags?`, podrías ver `tags=./tags,tags` (dependiendo de tu configuración de Vim, podría ser diferente). Aquí Vim busca todas las etiquetas en la ruta del archivo actual en el caso de `./tags` y en el directorio actual (la raíz de tu proyecto) en el caso de `tags`.

También en el caso de `./tags`, Vim primero buscará un archivo de etiquetas dentro de la ruta de tu archivo actual sin importar cuán anidado esté, luego buscará un archivo de etiquetas del directorio actual (raíz del proyecto). Vim se detiene después de encontrar la primera coincidencia.

Si tu archivo `'tags'` hubiera dicho `tags=./tags,tags,/user/iggy/mytags/tags`, entonces Vim también buscará en el directorio `/user/iggy/mytags` un archivo de etiquetas después de que Vim termine de buscar en los directorios `./tags` y `tags`. No tienes que almacenar tu archivo de etiquetas dentro de tu proyecto, puedes mantenerlos separados.

Para agregar una nueva ubicación de archivo de etiquetas, usa lo siguiente:

```shell
set tags+=path/to/my/tags/file
```

## Generando Etiquetas para un Proyecto Grande

Si intentaste ejecutar ctags en un proyecto grande, puede tardar mucho tiempo porque Vim también busca dentro de cada directorio anidado. Si eres un desarrollador de Javascript, sabes que `node_modules` puede ser muy grande. Imagina si tienes cinco subproyectos y cada uno contiene su propio directorio `node_modules`. Si ejecutas `ctags -R .`, ctags intentará escanear todos los 5 `node_modules`. Probablemente no necesites ejecutar ctags en `node_modules`.

Para ejecutar ctags excluyendo `node_modules`, ejecuta:

```shell
ctags -R --exclude=node_modules .
```

Esta vez debería tardar menos de un segundo. Por cierto, puedes usar la opción `exclude` varias veces:

```shell
ctags -R --exclude=.git --exclude=vendor --exclude=node_modules --exclude=db --exclude=log .
```

El punto es, si deseas omitir un directorio, `--exclude` es tu mejor amigo.

## Navegación de Etiquetas

Puedes obtener un buen rendimiento usando solo `Ctrl-]`, pero aprendamos algunos trucos más. La tecla de salto de etiqueta `Ctrl-]` tiene una alternativa en modo línea de comandos: `:tag {tag-name}`. Si ejecutas:

```shell
:tag donut
```

Vim saltará al método `donut`, igual que al hacer `Ctrl-]` en la cadena "donut". También puedes autocompletar el argumento, con `<Tab>`:

```shell
:tag d<Tab>
```

Vim lista todas las etiquetas que comienzan con "d". En este caso, "donut".

En un proyecto real, puedes encontrar múltiples métodos con el mismo nombre. Actualicemos los dos archivos Ruby de antes. Dentro de `one.rb`:

```shell
## one.rb
class One
  def initialize
    puts "Inicializado"
  end

  def donut
    puts "un donut"
  end

  def pancake
    puts "un pancake"
  end
end
```

Dentro de `two.rb`:

```shell
## two.rb
require './one.rb'

def pancake
  "Dos pancakes"
end

one = One.new
one.donut
puts pancake
```

Si estás programando junto, no olvides ejecutar `ctags -R .` de nuevo ya que ahora tienes varios nuevos procedimientos. Tienes dos instancias del procedimiento `pancake`. Si estás dentro de `two.rb` y presionas `Ctrl-]`, ¿qué pasará?

Vim saltará a `def pancake` dentro de `two.rb`, no al `def pancake` dentro de `one.rb`. Esto se debe a que Vim ve el procedimiento `pancake` dentro de `two.rb` como teniendo una prioridad más alta que el otro procedimiento `pancake`.

## Prioridad de Etiquetas

No todas las etiquetas son iguales. Algunas etiquetas tienen prioridades más altas. Si Vim se presenta con nombres de elementos duplicados, Vim verifica la prioridad de la palabra clave. El orden es:

1. Una etiqueta estática completamente coincidente en el archivo actual.
2. Una etiqueta global completamente coincidente en el archivo actual.
3. Una etiqueta global completamente coincidente en un archivo diferente.
4. Una etiqueta estática completamente coincidente en otro archivo.
5. Una etiqueta estática coincidente sin distinción de mayúsculas en el archivo actual.
6. Una etiqueta global coincidente sin distinción de mayúsculas en el archivo actual.
7. Una etiqueta global coincidente sin distinción de mayúsculas en un archivo diferente.
8. Una etiqueta estática coincidente sin distinción de mayúsculas en el archivo actual.

De acuerdo con la lista de prioridades, Vim prioriza la coincidencia exacta encontrada en el mismo archivo. Por eso Vim elige el procedimiento `pancake` dentro de `two.rb` sobre el procedimiento `pancake` dentro de `one.rb`. Hay algunas excepciones a la lista de prioridades anterior dependiendo de tus configuraciones `'tagcase'`, `'ignorecase'`, y `'smartcase'`, pero no lo discutiré aquí. Si estás interesado, consulta `:h tag-priority`.

## Saltos Selectivos de Etiquetas

Sería bueno si pudieras elegir qué elementos de etiqueta saltar en lugar de siempre ir al elemento de etiqueta de mayor prioridad. Tal vez realmente necesites saltar al método `pancake` en `one.rb` y no al de `two.rb`. Para hacer eso, puedes usar `:tselect`. Ejecuta:

```shell
:tselect pancake
```

Verás, en la parte inferior de la pantalla:
## etiqueta pri tipo               archivo
1 F C f    pancake           two.rb
             def pancake
2 F   f    pancake           one.rb
             class:One
             def pancake
```

Si escribes 2, Vim saltará al procedimiento en `one.rb`. Si escribes 1, Vim saltará al procedimiento en `two.rb`.

Presta atención a la columna `pri`. Tienes `F C` en la primera coincidencia y `F` en la segunda coincidencia. Esto es lo que Vim utiliza para determinar la prioridad de la etiqueta. `F C` significa una etiqueta global completamente coincidente (`F`) en el archivo actual (`C`). `F` significa solo una etiqueta global completamente coincidente (`F`). `F C` siempre tiene una prioridad más alta que `F`.

Si ejecutas `:tselect donut`, Vim también te pedirá que selecciones qué elemento de etiqueta saltar, aunque solo haya una opción para elegir. ¿Hay alguna forma de que Vim muestre la lista de etiquetas solo si hay múltiples coincidencias y salte inmediatamente si solo se encuentra una etiqueta?

¡Por supuesto! Vim tiene un método `:tjump`. Ejecuta:

```shell
:tjump donut
```

Vim saltará inmediatamente al procedimiento `donut` en `one.rb`, muy parecido a ejecutar `:tag donut`. Ahora ejecuta:

```shell
:tjump pancake
```

Vim te pedirá opciones de etiquetas para elegir, muy parecido a ejecutar `:tselect pancake`. Con `tjump` obtienes lo mejor de ambos métodos.

Vim tiene una tecla en modo normal para `tjump`: `g Ctrl-]`. Personalmente, prefiero `g Ctrl-]` a `Ctrl-]`.

## Autocompletado Con Etiquetas

Las etiquetas pueden ayudar con los autocompletados. Recuerda del capítulo 6, Modo de Inserción, que puedes usar el sub-modo `Ctrl-X` para hacer varios autocompletados. Un sub-modo de autocompletado que no mencioné fue `Ctrl-]`. Si haces `Ctrl-X Ctrl-]` mientras estás en el modo de inserción, Vim utilizará el archivo de etiquetas para el autocompletado.

Si entras en el modo de inserción y escribes `Ctrl-x Ctrl-]`, verás:

```shell
One
donut
initialize
pancake
```

## Pila de Etiquetas

Vim mantiene una lista de todas las etiquetas a las que has saltado y desde las que has saltado en una pila de etiquetas. Puedes ver esta pila con `:tags`. Si primero saltaste a la etiqueta `pancake`, seguida de `donut`, y ejecutas `:tags`, verás:

```shell
  # A etiqueta         DESDE línea  en archivo/texto
  1  1 pancake            10  ch16_tags/two.rb
  2  1 donut               9  ch16_tags/two.rb
>
```

Nota el símbolo `>` arriba. Muestra tu posición actual en la pila. Para "sacar" la pila y volver a una pila anterior, puedes ejecutar `:pop`. Inténtalo, luego ejecuta `:tags` nuevamente:

```shell
  # A etiqueta         DESDE línea  en archivo/texto
  1  1 pancake            10  puts pancake
> 2  1 donut               9  one.donut

```

Nota que el símbolo `>` ahora está en la línea dos, donde está `donut`. Haz `pop` una vez más, luego ejecuta `:tags` nuevamente:

```shell
  # A etiqueta         DESDE línea  en archivo/texto
> 1  1 pancake            10  puts pancake
  2  1 donut               9  one.donut
```

En modo normal, puedes ejecutar `Ctrl-t` para lograr el mismo efecto que `:pop`.

## Generación Automática de Etiquetas

Uno de los mayores inconvenientes de las etiquetas de Vim es que cada vez que haces un cambio significativo, debes regenerar el archivo de etiquetas. Si recientemente renombraste el procedimiento `pancake` a `waffle`, el archivo de etiquetas no sabía que el procedimiento `pancake` había sido renombrado. Aún almacenaba `pancake` en la lista de etiquetas. Tienes que ejecutar `ctags -R .` para crear un archivo de etiquetas actualizado. Recrear un nuevo archivo de etiquetas de esta manera puede ser engorroso.

Afortunadamente, hay varios métodos que puedes emplear para generar etiquetas automáticamente.

## Generar una Etiqueta al Guardar

Vim tiene un método de autocomando (`autocmd`) para ejecutar cualquier comando en un evento desencadenante. Puedes usar esto para generar etiquetas en cada guardado. Ejecuta:

```shell
:autocmd BufWritePost *.rb silent !ctags -R .
```

Desglose:
- `autocmd` es un comando de línea de comandos. Acepta un evento, patrón de archivo y un comando.
- `BufWritePost` es un evento para guardar un buffer. Cada vez que guardas un archivo, desencadenas un evento `BufWritePost`.
- `.rb` es un patrón de archivo para archivos ruby.
- `silent` es en realidad parte del comando que estás pasando. Sin esto, Vim mostrará `presiona ENTER o escribe un comando para continuar` cada vez que desencadenes el autocomando.
- `!ctags -R .` es el comando a ejecutar. Recuerda que `!cmd` desde dentro de Vim ejecuta un comando de terminal.

Ahora, cada vez que guardes desde dentro de un archivo ruby, Vim ejecutará `ctags -R .`.

## Usando Plugins

Hay varios plugins para generar ctags automáticamente:

- [vim-gutentags](https://github.com/ludovicchabant/vim-gutentags)
- [vim-tags](https://github.com/szw/vim-tags)
- [vim-easytags](https://github.com/xolox/vim-easytags)
- [vim-autotag](https://github.com/craigemery/vim-autotag)

Yo uso vim-gutentags. Es simple de usar y funcionará directamente.

## Ctags y Hooks de Git

Tim Pope, autor de muchos grandes plugins de Vim, escribió un blog sugiriendo usar hooks de git. [Échale un vistazo](https://tbaggery.com/2011/08/08/effortless-ctags-with-git.html).

## Aprende Etiquetas de la Manera Inteligente

Una etiqueta es útil una vez configurada correctamente. Supón que te enfrentas a una nueva base de código y quieres entender qué hace `functionFood`, puedes leerlo fácilmente saltando a su definición. Dentro de ella, aprendes que también llama a `functionBreakfast`. Lo sigues y aprendes que llama a `functionPancake`. Tu gráfico de llamadas de función se ve algo así:

```shell
functionFood -> functionBreakfast -> functionPancake
```

Esto te da una idea de que este flujo de código está relacionado con tener un pancake para el desayuno.

Para aprender más sobre etiquetas, consulta `:h tags`. Ahora que sabes cómo usar etiquetas, exploremos una característica diferente: el plegado.