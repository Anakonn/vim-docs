---
description: Aprende a navegar eficientemente en Vim con movimientos esenciales. Mejora
  tu productividad y familiarízate con el uso del teclado en lugar del ratón.
title: Ch05. Moving in a File
---

Al principio, moverse con un teclado se siente lento y torpe, ¡pero no te rindas! Una vez que te acostumbres, puedes ir a cualquier parte de un archivo más rápido que usando un ratón.

En este capítulo, aprenderás los movimientos esenciales y cómo usarlos de manera eficiente. Ten en cuenta que **no** es todo el movimiento que tiene Vim. El objetivo aquí es introducir movimientos útiles para volverse productivo rápidamente. Si necesitas aprender más, consulta `:h motion.txt`.

## Navegación por Caracteres

La unidad de movimiento más básica es mover un carácter a la izquierda, abajo, arriba y a la derecha.

```shell
h   Izquierda
j   Abajo
k   Arriba
l   Derecha
gj  Abajo en una línea envuelta suavemente
gk  Arriba en una línea envuelta suavemente
```

También puedes moverte con las flechas direccionales. Si estás comenzando, siéntete libre de usar cualquier método con el que te sientas más cómodo.

Prefiero `hjkl` porque mi mano derecha puede permanecer en la fila de inicio. Hacer esto me da un alcance más corto a las teclas circundantes. Para acostumbrarme a `hjkl`, de hecho, deshabilité los botones de flecha al comenzar agregando esto en `~/.vimrc`:

```shell
noremap <Up> <NOP>
noremap <Down> <NOP>
noremap <Left> <NOP>
noremap <Right> <NOP>
```

También hay complementos para ayudar a romper este mal hábito. Uno de ellos es [vim-hardtime](https://github.com/takac/vim-hardtime). Para mi sorpresa, me tomó menos de una semana acostumbrarme a `hjkl`.

Si te preguntas por qué Vim usa `hjkl` para moverse, es porque el terminal Lear-Siegler ADM-3A donde Bill Joy escribió Vi, no tenía teclas de flecha y usó `hjkl` como izquierda/abajo/arriba/derecha.*

## Numeración Relativa

Creo que es útil tener `number` y `relativenumber configurados. Puedes hacerlo teniendo esto en `.vimrc`:

```shell
set relativenumber number
```

Esto muestra mi número de línea actual y números de línea relativos.

Es fácil entender por qué tener un número en la columna izquierda es útil, pero algunos de ustedes pueden preguntar cómo tener números relativos en la columna izquierda puede ser útil. Tener un número relativo me permite ver rápidamente cuántas líneas separan mi cursor del texto objetivo. Con esto, puedo ver fácilmente que mi texto objetivo está 12 líneas por debajo de mí, así que puedo hacer `d12j` para borrarlas. De lo contrario, si estoy en la línea 69 y mi objetivo está en la línea 81, tengo que hacer un cálculo mental (81 - 69 = 12). Hacer matemáticas mientras edito consume demasiados recursos mentales. Cuanto menos tenga que pensar sobre dónde necesito ir, mejor.

Esto es 100% preferencia personal. ¡Experimenta con `relativenumber` / `norelativenumber`, `number` / `nonumber` y usa lo que encuentres más útil!

## Cuenta Tu Movimiento

Hablemos del argumento "cuenta". Los movimientos de Vim aceptan un argumento numérico precedente. Mencioné anteriormente que puedes bajar 12 líneas con `12j`. El 12 en `12j` es el número de cuenta.

La sintaxis para usar la cuenta con tu movimiento es:

```shell
[count] + motion
```

Puedes aplicar esto a todos los movimientos. Si deseas mover 9 caracteres a la derecha, en lugar de presionar `l` 9 veces, puedes hacer `9l`.

## Navegación por Palabras

Pasemos a una unidad de movimiento más grande: *palabra*. Puedes moverte al comienzo de la siguiente palabra (`w`), al final de la siguiente palabra (`e`), al comienzo de la palabra anterior (`b`), y al final de la palabra anterior (`ge`).

Además, hay *WORD*, distinto de palabra. Puedes moverte al comienzo de la siguiente WORD (`W`), al final de la siguiente WORD (`E`), al comienzo de la WORD anterior (`B`), y al final de la WORD anterior (`gE`). Para hacerlo fácil de recordar, WORD usa las mismas letras que palabra, solo en mayúsculas.

```shell
w     Mover hacia adelante al comienzo de la siguiente palabra
W     Mover hacia adelante al comienzo de la siguiente WORD
e     Mover hacia adelante una palabra al final de la siguiente palabra
E     Mover hacia adelante una palabra al final de la siguiente WORD
b     Mover hacia atrás al comienzo de la palabra anterior
B     Mover hacia atrás al comienzo de la WORD anterior
ge    Mover hacia atrás al final de la palabra anterior
gE    Mover hacia atrás al final de la WORD anterior
```

Entonces, ¿cuáles son las similitudes y diferencias entre una palabra y una WORD? Tanto palabra como WORD están separadas por caracteres en blanco. Una palabra es una secuencia de caracteres que contiene *solo* `a-zA-Z0-9_`. Una WORD es una secuencia de todos los caracteres excepto espacios en blanco (un espacio en blanco significa espacio, tabulación y EOL). Para aprender más, consulta `:h word` y `:h WORD`.

Por ejemplo, supongamos que tienes:

```shell
const hello = "world";
```

Con tu cursor al inicio de la línea, ir al final de la línea con `l` te llevará 21 pulsaciones de tecla. Usando `w`, tomará 6. Usando `W`, solo tomará 4. Tanto palabra como WORD son buenas opciones para viajar distancias cortas.

Sin embargo, puedes llegar de "c" a ";" en una pulsación de tecla con la navegación de la línea actual.

## Navegación por la Línea Actual

Al editar, a menudo necesitas navegar horizontalmente en una línea. Para saltar al primer carácter en la línea actual, usa `0`. Para ir al último carácter en la línea actual, usa `$`. Además, puedes usar `^` para ir al primer carácter no en blanco en la línea actual y `g_` para ir al último carácter no en blanco en la línea actual. Si deseas ir a la columna `n` en la línea actual, puedes usar `n|`.

```shell
0     Ir al primer carácter en la línea actual
^     Ir al primer carácter no en blanco en la línea actual
g_    Ir al último carácter no en blanco en la línea actual
$     Ir al último carácter en la línea actual
n|    Ir a la columna n en la línea actual
```

Puedes hacer búsqueda en la línea actual con `f` y `t`. La diferencia entre `f` y `t` es que `f` te lleva a la primera letra de la coincidencia y `t` te lleva hasta (justo antes de) la primera letra de la coincidencia. Así que si deseas buscar "h" y aterrizar en "h", usa `fh`. Si deseas buscar la primera "h" y aterrizar justo antes de la coincidencia, usa `th`. Si deseas ir a la *siguiente* ocurrencia de la última búsqueda en la línea actual, usa `;`. Para ir a la ocurrencia anterior de la última coincidencia en la línea actual, usa `,`.

`F` y `T` son los contrapartes hacia atrás de `f` y `t`. Para buscar hacia atrás "h", ejecuta `Fh`. Para seguir buscando "h" en la misma dirección, usa `;`. Ten en cuenta que `;` después de un `Fh` busca hacia atrás y `,` después de `Fh` busca hacia adelante.

```shell
f    Buscar hacia adelante una coincidencia en la misma línea
F    Buscar hacia atrás una coincidencia en la misma línea
t    Buscar hacia adelante una coincidencia en la misma línea, deteniéndose antes de la coincidencia
T    Buscar hacia atrás una coincidencia en la misma línea, deteniéndose antes de la coincidencia
;    Repetir la última búsqueda en la misma línea usando la misma dirección
,    Repetir la última búsqueda en la misma línea usando la dirección opuesta
```

Volviendo al ejemplo anterior:

```shell
const hello = "world";
```

Con tu cursor al inicio de la línea, puedes ir al último carácter en la línea actual (";") con una pulsación de tecla: `$`. Si deseas ir a "w" en "world", puedes usar `fw`. Un buen consejo para ir a cualquier parte en una línea es buscar letras menos comunes como "j", "x", "z" cerca de tu objetivo.

## Navegación por Oraciones y Párrafos

Las siguientes dos unidades de navegación son oración y párrafo.

Hablemos primero de lo que es una oración. Una oración termina con `. ! ?` seguido de un EOL, un espacio o una tabulación. Puedes saltar a la siguiente oración con `)` y a la oración anterior con `(`.

```shell
(    Saltar a la oración anterior
)    Saltar a la siguiente oración
```

Veamos algunos ejemplos. ¿Qué frases crees que son oraciones y cuáles no? ¡Intenta navegar con `(` y `)` en Vim!

```shell
Soy una oración. Soy otra oración porque termino con un punto. Sigo siendo una oración cuando termino con un signo de exclamación! ¿Qué pasa con el signo de interrogación? No soy del todo una oración debido al guion - y tampoco el punto y coma ; ni el dos puntos :

Hay una línea vacía encima de mí.
```

Por cierto, si tienes un problema con Vim que no cuenta una oración para frases separadas por `.` seguido de una sola línea, podrías estar en modo `'compatible'`. Agrega `set nocompatible` en vimrc. En Vi, una oración es un `.` seguido de **dos** espacios. Debes tener `nocompatible` configurado en todo momento.

Hablemos de lo que es un párrafo. Un párrafo comienza después de cada línea vacía y también en cada conjunto de un macro de párrafo especificado por los pares de caracteres en la opción de párrafos.

```shell
{    Saltar al párrafo anterior
}    Saltar al siguiente párrafo
```

Si no estás seguro de lo que es un macro de párrafo, no te preocupes. Lo importante es que un párrafo comienza y termina después de una línea vacía. Esto debería ser cierto la mayor parte del tiempo.

Veamos este ejemplo. ¡Intenta navegar con `}` y `{` (además, juega con las navegaciones de oraciones `( )` para moverte también!)

```shell
¡Hola! ¿Cómo estás? Estoy genial, ¡gracias!
Vim es increíble.
Puede que no sea fácil aprenderlo al principio...- pero estamos en esto juntos. ¡Buena suerte!

Hola de nuevo.

Intenta moverte con ), (, }, y {. Siente cómo funcionan.
Tú puedes hacerlo.
```

Consulta `:h sentence` y `:h paragraph` para aprender más.

## Navegación por Coincidencias

Los programadores escriben y editan códigos. Los códigos típicamente usan paréntesis, llaves y corchetes. Puedes perderte fácilmente en ellos. Si estás dentro de uno, puedes saltar al otro par (si existe) con `%`. También puedes usar esto para averiguar si tienes paréntesis, llaves y corchetes coincidentes.

```shell
%    Navegar a otra coincidencia, generalmente funciona para (), [], {}
```

Veamos un ejemplo de código en Scheme porque utiliza paréntesis extensivamente. Muévete con `%` dentro de diferentes paréntesis.

```shell
(define (fib n)
  (cond ((= n 0) 0)
        ((= n 1) 1)
        (else
          (+ (fib (- n 1)) (fib (- n 2)))
        )))
```

Personalmente, me gusta complementar `%` con complementos de indicadores visuales como [vim-rainbow](https://github.com/frazrepo/vim-rainbow). Para más, consulta `:h %`.

## Navegación por Números de Línea

Puedes saltar al número de línea `n` con `nG`. Por ejemplo, si deseas saltar a la línea 7, usa `7G`. Para saltar a la primera línea, usa `1G` o `gg`. Para saltar a la última línea, usa `G`.

A menudo no sabes exactamente qué número de línea es tu objetivo, pero sabes que está aproximadamente al 70% del archivo completo. En este caso, puedes hacer `70%`. Para saltar a la mitad del archivo, puedes hacer `50%`.

```shell
gg    Ir a la primera línea
G     Ir a la última línea
nG    Ir a la línea n
n%    Ir a n% en el archivo
```

Por cierto, si deseas ver el total de líneas en un archivo, puedes usar `Ctrl-g`.

## Navegación por Ventanas

Para ir rápidamente a la parte superior, media o inferior de tu *ventana*, puedes usar `H`, `M`, y `L`.

También puedes pasar una cuenta a `H` y `L`. Si usas `10H`, irás a 10 líneas por debajo de la parte superior de la ventana. Si usas `3L`, irás a 3 líneas por encima de la última línea de la ventana.

```shell
H     Ir a la parte superior de la pantalla
M     Ir a la pantalla media
L     Ir a la parte inferior de la pantalla
nH    Ir n líneas desde la parte superior
nL    Ir n líneas desde la parte inferior
```

## Desplazamiento

Para desplazarte, tienes 3 incrementos de velocidad: pantalla completa (`Ctrl-F/Ctrl-B`), media pantalla (`Ctrl-D/Ctrl-U`), y línea (`Ctrl-E/Ctrl-Y`).

```shell
Ctrl-E    Desplazar hacia abajo una línea
Ctrl-D    Desplazar hacia abajo media pantalla
Ctrl-F    Desplazar hacia abajo toda la pantalla
Ctrl-Y    Desplazar hacia arriba una línea
Ctrl-U    Desplazar hacia arriba media pantalla
Ctrl-B    Desplazar hacia arriba toda la pantalla
```

También puedes desplazarte relativamente a la línea actual (aumentar la vista de la pantalla):

```shell
zt    Llevar la línea actual cerca de la parte superior de tu pantalla
zz    Llevar la línea actual al medio de tu pantalla
zb    Llevar la línea actual cerca de la parte inferior de tu pantalla
```
## Navegación de Búsqueda

A menudo sabes que una frase existe dentro de un archivo. Puedes usar la navegación de búsqueda para llegar muy rápido a tu objetivo. Para buscar una frase, puedes usar `/` para buscar hacia adelante y `?` para buscar hacia atrás. Para repetir la última búsqueda puedes usar `n`. Para repetir la última búsqueda en la dirección opuesta, puedes usar `N`.

```shell
/    Buscar hacia adelante por una coincidencia
?    Buscar hacia atrás por una coincidencia
n    Repetir la última búsqueda en la misma dirección de la búsqueda anterior
N    Repetir la última búsqueda en la dirección opuesta de la búsqueda anterior
```

Supón que tienes este texto:

```shell
let one = 1;
let two = 2;
one = "01";
one = "one";
let onetwo = 12;
```

Si estás buscando "let", ejecuta `/let`. Para buscar rápidamente "let" de nuevo, solo puedes hacer `n`. Para buscar "let" de nuevo en la dirección opuesta, ejecuta `N`. Si ejecutas `?let`, buscará "let" hacia atrás. Si usas `n`, ahora buscará "let" hacia atrás (`N` buscará "let" hacia adelante ahora).

Puedes habilitar el resaltado de búsqueda con `set hlsearch`. Ahora, cuando busques `/let`, resaltará *todas* las frases coincidentes en el archivo. Además, puedes establecer la búsqueda incremental con `set incsearch`. Esto resaltará el patrón mientras escribes. Por defecto, tus frases coincidentes permanecerán resaltadas hasta que busques otra frase. Esto puede convertirse rápidamente en una molestia. Para deshabilitar el resaltado, puedes ejecutar `:nohlsearch` o simplemente `:noh`. Debido a que uso esta función de no resaltado con frecuencia, creé un mapa en vimrc:

```shell
nnoremap <esc><esc> :noh<return><esc>
```

Puedes buscar rápidamente el texto bajo el cursor con `*` para buscar hacia adelante y `#` para buscar hacia atrás. Si tu cursor está sobre la cadena "one", presionar `*` será lo mismo que si hubieras hecho `/\<one\>`.

Tanto `\<` como `\>` en `/\<one\>` significan búsqueda de palabra completa. No coincide con "one" si es parte de una palabra más grande. Coincidirá con la palabra "one" pero no con "onetwo". Si tu cursor está sobre "one" y quieres buscar hacia adelante para coincidir con palabras completas o parciales como "one" y "onetwo", necesitas usar `g*` en lugar de `*`.

```shell
*     Buscar palabra completa bajo el cursor hacia adelante
#     Buscar palabra completa bajo el cursor hacia atrás
g*    Buscar palabra bajo el cursor hacia adelante
g#    Buscar palabra bajo el cursor hacia atrás
```

## Marcando Posición

Puedes usar marcas para guardar tu posición actual y volver a esta posición más tarde. Es como un marcador para la edición de texto. Puedes establecer una marca con `mx`, donde `x` puede ser cualquier letra alfabética `a-zA-Z`. Hay dos formas de volver a la marca: exacta (línea y columna) con `` `x `` y por línea (`'x`).

```shell
ma    Marcar posición con la marca "a"
`a    Saltar a la línea y columna "a"
'a    Saltar a la línea "a"
```

Hay una diferencia entre marcar con letras minúsculas (a-z) y letras mayúsculas (A-Z). Las letras minúsculas son marcas locales y las letras mayúsculas son marcas globales (a veces conocidas como marcas de archivo).

Hablemos de marcas locales. Cada búfer puede tener su propio conjunto de marcas locales. Si tengo dos archivos abiertos, puedo establecer una marca "a" (`ma`) en el primer archivo y otra marca "a" (`ma`) en el segundo archivo.

A diferencia de las marcas locales, donde puedes tener un conjunto de marcas en cada búfer, solo obtienes un conjunto de marcas globales. Si estableces `mA` dentro de `myFile.txt`, la próxima vez que ejecutes `mA` en un archivo diferente, sobrescribirá la primera marca "A". Una ventaja de las marcas globales es que puedes saltar a cualquier marca global incluso si estás dentro de un proyecto completamente diferente. Las marcas globales pueden viajar entre archivos.

Para ver todas las marcas, usa `:marks`. Puedes notar en la lista de marcas que hay más marcas además de `a-zA-Z`. Algunas de ellas son:

```shell
''    Saltar de vuelta a la última línea en el búfer actual antes del salto
``    Saltar de vuelta a la última posición en el búfer actual antes del salto
`[    Saltar al principio del texto previamente cambiado / copiado
`]    Saltar al final del texto previamente cambiado / copiado
`<    Saltar al principio de la última selección visual
`>    Saltar al final de la última selección visual
`0    Saltar de vuelta al último archivo editado al salir de vim
```

Hay más marcas que las que se enumeran arriba. No las cubriré aquí porque creo que se utilizan raramente, pero si tienes curiosidad, consulta `:h marks`.

## Salto

En Vim, puedes "saltar" a un archivo diferente o a una parte diferente de un archivo con algunos movimientos. Sin embargo, no todos los movimientos cuentan como un salto. Bajar con `j` no cuenta como un salto. Ir a la línea 10 con `10G` cuenta como un salto.

Aquí están los comandos que Vim considera como comandos de "salto":

```shell
'       Ir a la línea marcada
`       Ir a la posición marcada
G       Ir a la línea
/       Buscar hacia adelante
?       Buscar hacia atrás
n       Repetir la última búsqueda, misma dirección
N       Repetir la última búsqueda, dirección opuesta
%       Encontrar coincidencia
(       Ir a la última oración
)       Ir a la siguiente oración
{       Ir al último párrafo
}       Ir al siguiente párrafo
L       Ir a la última línea de la ventana mostrada
M       Ir a la línea media de la ventana mostrada
H       Ir a la línea superior de la ventana mostrada
[[      Ir a la sección anterior
]]      Ir a la siguiente sección
:s      Sustituir
:tag    Saltar a la definición de etiqueta
```

No recomiendo memorizar esta lista. Una buena regla general es que cualquier movimiento que se mueva más allá de una palabra y la navegación de la línea actual probablemente sea un salto. Vim lleva un registro de dónde has estado cuando te mueves y puedes ver esta lista dentro de `:jumps`.

Para más, consulta `:h jump-motions`.

¿Por qué son útiles los saltos? Porque puedes navegar por la lista de saltos con `Ctrl-O` para moverte hacia arriba en la lista de saltos y `Ctrl-I` para moverte hacia abajo en la lista de saltos. `hjkl` no son comandos de "salto", pero puedes agregar manualmente la ubicación actual a la lista de saltos con `m'` antes del movimiento. Por ejemplo, `m'5j` agrega la ubicación actual a la lista de saltos y baja 5 líneas, y puedes volver con `Ctrl-O`. Puedes saltar entre diferentes archivos, lo cual discutiré más en la siguiente parte.

## Aprende Navegación de la Manera Inteligente

Si eres nuevo en Vim, esto es mucho para aprender. No espero que nadie recuerde todo de inmediato. Toma tiempo antes de que puedas ejecutarlos sin pensar.

Creo que la mejor manera de comenzar es memorizar algunos movimientos esenciales. Recomiendo comenzar con estos 10 movimientos: `h, j, k, l, w, b, G, /, ?, n`. Repítelos lo suficiente hasta que puedas usarlos sin pensar.

Para mejorar tu habilidad de navegación, aquí están mis sugerencias:
1. Observa las acciones repetidas. Si te encuentras haciendo `l` repetidamente, busca un movimiento que te lleve hacia adelante más rápido. Descubrirás que puedes usar `w`. Si te encuentras haciendo `w` repetidamente, busca si hay un movimiento que te lleve a través de la línea actual rápidamente. Descubrirás que puedes usar `f`. Si puedes describir tu necesidad de manera concisa, hay una buena posibilidad de que Vim tenga una forma de hacerlo.
2. Siempre que aprendas un nuevo movimiento, pasa un tiempo hasta que puedas hacerlo sin pensar.

Finalmente, date cuenta de que no necesitas conocer cada comando de Vim para ser productivo. La mayoría de los usuarios de Vim no lo hacen. Yo no lo hago. Aprende los comandos que te ayudarán a lograr tu tarea en ese momento.

Tómate tu tiempo. La habilidad de navegación es una habilidad muy importante en Vim. Aprende una pequeña cosa cada día y apréndela bien.