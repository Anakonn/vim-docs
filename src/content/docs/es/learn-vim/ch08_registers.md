---
description: Aprende sobre los tipos de registros en Vim y cómo utilizarlos eficientemente
  para evitar la escritura repetitiva y mejorar tu flujo de trabajo.
title: Ch08. Registers
---

Aprender los registros de Vim es como aprender álgebra por primera vez. No pensabas que lo necesitarías hasta que lo necesitaste.

Probablemente has utilizado los registros de Vim cuando copiaste o eliminaste un texto y luego lo pegaste con `p` o `P`. Sin embargo, ¿sabías que Vim tiene 10 tipos diferentes de registros? Usados correctamente, los registros de Vim pueden salvarte de escribir repetitivamente.

En este capítulo, repasaré todos los tipos de registros de Vim y cómo usarlos de manera eficiente.

## Los Diez Tipos de Registros

Aquí están los 10 tipos de registros de Vim:

1. El registro sin nombre (`""`).
2. Los registros numerados (`"0-9`).
3. El registro de eliminación pequeña (`"-`).
4. Los registros nombrados (`"a-z`).
5. Los registros de solo lectura (`":`, `".`, y `"%`).
6. El registro de archivo alternativo (`"#`).
7. El registro de expresión (`"=`).
8. Los registros de selección (`"*` y `"+`).
9. El registro de agujero negro (`"_`).
10. El registro del último patrón de búsqueda (`"/`).

## Operadores de Registro

Para usar registros, primero necesitas almacenarlos con operadores. Aquí hay algunos operadores que almacenan valores en registros:

```shell
y    Yank (copiar)
c    Eliminar texto y comenzar el modo de inserción
d    Eliminar texto
```

Hay más operadores (como `s` o `x`), pero los anteriores son los útiles. La regla general es que, si un operador puede eliminar un texto, probablemente almacene el texto en los registros.

Para pegar un texto de los registros, puedes usar:

```shell
p    Pegar el texto después del cursor
P    Pegar el texto antes del cursor
```

Tanto `p` como `P` aceptan un conteo y un símbolo de registro como argumentos. Por ejemplo, para pegar diez veces, haz `10p`. Para pegar el texto del registro a, haz `"ap`. Para pegar el texto del registro a diez veces, haz `10"ap`. Por cierto, el `p` en realidad significa "poner", no "pegar", pero creo que "pegar" es una palabra más convencional.

La sintaxis general para obtener el contenido de un registro específico es `"a`, donde `a` es el símbolo del registro.

## Llamando Registros Desde el Modo de Inserción

Todo lo que aprendas en este capítulo también se puede ejecutar en el modo de inserción. Para obtener el texto del registro a, normalmente haces `"ap`. Pero si estás en modo de inserción, ejecuta `Ctrl-R a`. La sintaxis para llamar registros desde el modo de inserción es:

```shell
Ctrl-R a
```

Donde `a` es el símbolo del registro. Ahora que sabes cómo almacenar y recuperar registros, ¡vamos a profundizar!

## El Registro Sin Nombre

Para obtener el texto del registro sin nombre, haz `""p`. Almacena el último texto que copiaste, cambiaste o eliminaste. Si haces otro yank, cambio o eliminación, Vim reemplazará automáticamente el texto antiguo. El registro sin nombre es como la operación estándar de copiar / pegar de una computadora.

Por defecto, `p` (o `P`) está conectado al registro sin nombre (a partir de ahora me referiré al registro sin nombre con `p` en lugar de `""p`).

## Los Registros Numerados

Los registros numerados se llenan automáticamente en orden ascendente. Hay 2 tipos diferentes de registros numerados: el registro yanked (`0`) y los registros numerados (`1-9`). Vamos a discutir primero el registro yanked.

### El Registro Yanked

Si yankeas una línea completa de texto (`yy`), Vim en realidad guarda ese texto en dos registros:

1. El registro sin nombre (`p`).
2. El registro yanked (`"0p`).

Cuando yankeas un texto diferente, Vim actualizará tanto el registro yanked como el registro sin nombre. Cualquier otra operación (como eliminar) no se almacenará en el registro 0. Esto puede ser utilizado a tu favor, porque a menos que hagas otro yank, el texto yanked siempre estará allí, sin importar cuántos cambios y eliminaciones hagas.

Por ejemplo, si:
1. Yankeas una línea (`yy`)
2. Eliminas una línea (`dd`)
3. Eliminas otra línea (`dd`)

El registro yanked tendrá el texto del paso uno.

Si:
1. Yankeas una línea (`yy`)
2. Eliminas una línea (`dd`)
3. Yankeas otra línea (`yy`)

El registro yanked tendrá el texto del paso tres.

Un último consejo, mientras estás en modo de inserción, puedes pegar rápidamente el texto que acabas de yankar usando `Ctrl-R 0`.

### Los Registros Numerados No Cero

Cuando cambias o eliminas un texto que tiene al menos una línea de largo, ese texto se almacenará en los registros numerados 1-9 ordenados por el más reciente.

Por ejemplo, si tienes estas líneas:

```shell
línea tres
línea dos
línea uno
```

Con tu cursor en "línea tres", elimínalas una por una con `dd`. Una vez que todas las líneas estén eliminadas, el registro 1 debería contener "línea uno" (más reciente), el registro dos "línea dos" (segundo más reciente), y el registro tres "línea tres" (más antiguo). Para obtener el contenido del registro uno, haz `"1p`.

Como nota al margen, estos registros numerados se incrementan automáticamente al usar el comando de punto. Si tu registro numerado uno (`"1`) contiene "línea uno", el registro dos (`"2`) "línea dos", y el registro tres (`"3`) "línea tres", puedes pegarlos secuencialmente con este truco:
- Haz `"1P` para pegar el contenido del registro numerado uno ("1).
- Haz `.` para pegar el contenido del registro numerado dos ("2).
- Haz `.` para pegar el contenido del registro numerado tres ("3).

Este truco funciona con cualquier registro numerado. Si comenzaste con `"5P`, `.` haría `"6P`, `.` nuevamente haría `"7P`, y así sucesivamente.

Eliminaciones pequeñas como la eliminación de una palabra (`dw`) o el cambio de una palabra (`cw`) no se almacenan en los registros numerados. Se almacenan en el registro de eliminación pequeña (`"-`), que discutiré a continuación.

## El Registro de Eliminación Pequeña

Los cambios o eliminaciones de menos de una línea no se almacenan en los registros numerados 0-9, sino en el registro de eliminación pequeña (`"-`).

Por ejemplo:
1. Elimina una palabra (`diw`)
2. Elimina una línea (`dd`)
3. Elimina una línea (`dd`)

`"-p` te dará la palabra eliminada del paso uno.

Otro ejemplo:
1. Elimino una palabra (`diw`)
2. Elimino una línea (`dd`)
3. Elimino una palabra (`diw`)

`"-p` te dará la palabra eliminada del paso tres. `"1p` te dará la línea eliminada del paso dos. Desafortunadamente, no hay forma de recuperar la palabra eliminada del paso uno porque el registro de eliminación pequeña solo almacena un elemento. Sin embargo, si deseas preservar el texto del paso uno, puedes hacerlo con los registros nombrados.

## El Registro Nombrado

Los registros nombrados son el registro más versátil de Vim. Pueden almacenar textos yanked, cambiados y eliminados en los registros a-z. A diferencia de los 3 tipos de registros anteriores que has visto, que almacenan automáticamente textos en los registros, debes decirle explícitamente a Vim que use el registro nombrado, dándote control total.

Para yankar una palabra en el registro a, puedes hacerlo con `"ayiw`.
- `"a` le dice a Vim que la próxima acción (eliminar / cambiar / yankar) se almacenará en el registro a.
- `yiw` yanka la palabra.

Para obtener el texto del registro a, ejecuta `"ap`. Puedes usar los veintiséis caracteres alfabéticos para almacenar veintiséis textos diferentes con registros nombrados.

A veces, puede que desees agregar a tu registro nombrado existente. En este caso, puedes agregar tu texto en lugar de comenzar de nuevo. Para hacer eso, puedes usar la versión en mayúscula de ese registro. Por ejemplo, supongamos que ya tienes la palabra "Hola " almacenada en el registro a. Si deseas agregar "mundo" al registro a, puedes encontrar el texto "mundo" y yankar usando el registro A (`"Ayiw`).

## Los Registros de Solo Lectura

Vim tiene tres registros de solo lectura: `.`, `:`, y `%`. Son bastante simples de usar:

```shell
.    Almacena el último texto insertado
:    Almacena el último comando ejecutado
%    Almacena el nombre del archivo actual
```

Si el último texto que escribiste fue "Hola Vim", ejecutar `".p` imprimirá el texto "Hola Vim". Si deseas obtener el nombre del archivo actual, ejecuta `"%p`. Si ejecutas el comando `:s/foo/bar/g`, ejecutar `":p` imprimirá el texto literal "s/foo/bar/g".

## El Registro de Archivo Alternativo

En Vim, `#` generalmente representa el archivo alternativo. Un archivo alternativo es el último archivo que abriste. Para insertar el nombre del archivo alternativo, puedes usar `"#p`.

## El Registro de Expresión

Vim tiene un registro de expresión, `"=`, para evaluar expresiones.

Para evaluar expresiones matemáticas `1 + 1`, ejecuta:

```shell
"=1+1<Enter>p
```

Aquí, le estás diciendo a Vim que estás usando el registro de expresión con `"=`. Tu expresión es (`1 + 1`). Necesitas escribir `p` para obtener el resultado. Como se mencionó anteriormente, también puedes acceder al registro desde el modo de inserción. Para evaluar una expresión matemática desde el modo de inserción, puedes hacer:

```shell
Ctrl-R =1+1
```

También puedes obtener los valores de cualquier registro a través del registro de expresión cuando se le añade `@`. Si deseas obtener el texto del registro a:

```shell
"=@a
```

Luego presiona `<Enter>`, luego `p`. De manera similar, para obtener valores del registro a mientras estás en modo de inserción:

```shell
Ctrl-r =@a
```

La expresión es un tema vasto en Vim, así que solo cubriré lo básico aquí. Abordaré expresiones con más detalle en capítulos posteriores de Vimscript.

## Los Registros de Selección

¿No deseas a veces poder copiar un texto de programas externos y pegarlo localmente en Vim, y viceversa? Con los registros de selección de Vim, puedes. Vim tiene dos registros de selección: `quotestar` (`"*`) y `quoteplus` (`"+`). Puedes usarlos para acceder al texto copiado de programas externos.

Si estás en un programa externo (como el navegador Chrome) y copias un bloque de texto con `Ctrl-C` (o `Cmd-C`, dependiendo de tu sistema operativo), normalmente no podrías usar `p` para pegar el texto en Vim. Sin embargo, tanto `"+` como `"*` de Vim están conectados a tu portapapeles, por lo que en realidad puedes pegar el texto con `"+p` o `"*p`. Inversamente, si yankeas una palabra de Vim con `"+yiw` o `"*yiw`, puedes pegar ese texto en el programa externo con `Ctrl-V` (o `Cmd-V`). Ten en cuenta que esto solo funciona si tu programa Vim viene con la opción `+clipboard` (para verificarlo, ejecuta `:version`).

Puedes preguntarte si `"*` y `"+` hacen lo mismo, ¿por qué Vim tiene dos registros diferentes? Algunas máquinas utilizan el sistema de ventanas X11. Este sistema tiene 3 tipos de selecciones: primaria, secundaria y portapapeles. Si tu máquina utiliza X11, Vim utiliza la selección *primaria* de X11 con el registro `quotestar` (`"*`) y la selección *portapapeles* de X11 con el registro `quoteplus` (`"+`). Esto solo es aplicable si tienes la opción `+xterm_clipboard` disponible en tu compilación de Vim. Si tu Vim no tiene `xterm_clipboard`, no es un gran problema. Simplemente significa que tanto `quotestar` como `quoteplus` son intercambiables (el mío tampoco lo tiene).

Encuentro que hacer `=*p` o `=+p` (o `"*p` o `"+p`) es engorroso. Para hacer que Vim pegue el texto copiado de un programa externo con solo `p`, puedes agregar esto en tu vimrc:

```shell
set clipboard=unnamed
```

Ahora, cuando copio un texto de un programa externo, puedo pegarlo con el registro sin nombre, `p`. También puedo copiar un texto de Vim y pegarlo en un programa externo. Si tienes `+xterm_clipboard` activado, es posible que desees usar ambas opciones de portapapeles, `unnamed` y `unnamedplus`.

## El Registro de Agujero Negro

Cada vez que eliminas o cambias un texto, ese texto se almacena automáticamente en el registro de Vim. Habrá ocasiones en las que no desees guardar nada en el registro. ¿Cómo puedes hacer eso?

Puedes usar el registro de agujero negro (`"_`). Para eliminar una línea y no hacer que Vim almacene la línea eliminada en ningún registro, usa `"_dd`.

El registro de agujero negro es como el `/dev/null` de los registros.

## El Registro del Último Patrón de Búsqueda

Para pegar tu última búsqueda (`/` o `?`), puedes usar el registro del último patrón de búsqueda (`"/`). Para pegar el último término de búsqueda, usa `"/p`.

## Visualizando los Registros

Para ver todos tus registros, usa el comando `:register`. Para ver solo los registros "a, "1, y "-", usa `:register a 1 -`.

Hay un plugin llamado [vim-peekaboo](https://github.com/junegunn/vim-peekaboo) que te permite echar un vistazo al contenido de los registros cuando presionas `"` o `@` en modo normal y `Ctrl-R` en modo de inserción. Encuentro que este plugin es muy útil porque la mayoría de las veces, no puedo recordar el contenido de mis registros. ¡Dale una oportunidad!

## Ejecutando un Registro

Los registros nombrados no son solo para almacenar textos. También pueden ejecutar macros con `@`. Revisaré las macros en el próximo capítulo.

Ten en cuenta que, dado que las macros se almacenan dentro de los registros de Vim, puedes sobrescribir accidentalmente el texto almacenado con macros. Si almacenas el texto "Hola Vim" en el registro a y luego grabas una macro en el mismo registro (`qa{secuencia-de-macro}q`), esa macro sobrescribirá tu texto "Hola Vim" almacenado anteriormente.
## Limpiando un Registro

Técnicamente, no hay necesidad de limpiar ningún registro porque el siguiente texto que almacenes bajo el mismo nombre de registro lo sobrescribirá. Sin embargo, puedes limpiar rápidamente cualquier registro nombrado grabando una macro vacía. Por ejemplo, si ejecutas `qaq`, Vim grabará una macro vacía en el registro a.

Otra alternativa es ejecutar el comando `:call setreg('a', 'hola registro a')` donde a es el registro a y "hola registro a" es el texto que deseas almacenar.

Una forma más de limpiar un registro es establecer el contenido del registro "a" a una cadena vacía con la expresión `:let @a = ''`.

## Colocando el Contenido de un Registro

Puedes usar el comando `:put` para pegar el contenido de cualquier registro. Por ejemplo, si ejecutas `:put a`, Vim imprimirá el contenido del registro a debajo de la línea actual. Esto se comporta de manera similar a `"ap`, con la diferencia de que el comando de modo normal `p` imprime el contenido del registro después del cursor y el comando `:put` imprime el contenido del registro en una nueva línea.

Dado que `:put` es un comando de línea de comandos, puedes pasarle una dirección. `:10put a` pegará el texto del registro a debajo de la línea 10.

Un truco interesante es pasar `:put` con el registro de agujero negro (`"_`). Dado que el registro de agujero negro no almacena ningún texto, `:put _` insertará una línea en blanco en su lugar. Puedes combinar esto con el comando global para insertar múltiples líneas en blanco. Por ejemplo, para insertar líneas en blanco debajo de todas las líneas que contienen el texto "fin", ejecuta `:g/end/put _`. Aprenderás sobre el comando global más adelante.

## Aprendiendo Registros de Manera Inteligente

Has llegado al final. ¡Felicidades! Si te sientes abrumado por la gran cantidad de información, no estás solo. Cuando comencé a aprender sobre los registros de Vim, había demasiada información para asimilar de una vez.

No creo que debas memorizar todos los registros de inmediato. Para volverte productivo, puedes comenzar usando solo estos 3 registros:
1. El registro sin nombre (`""`).
2. Los registros nombrados (`"a-z`).
3. Los registros numerados (`"0-9`).

Dado que el registro sin nombre se predetermina a `p` y `P`, solo tienes que aprender dos registros: los registros nombrados y los registros numerados. Aprende gradualmente más registros cuando los necesites. Tómate tu tiempo.

El humano promedio tiene una capacidad limitada de memoria a corto plazo, alrededor de 5 a 7 elementos a la vez. Por eso, en mi edición diaria, solo uso alrededor de 5 a 7 registros nombrados. No hay forma de que pueda recordar los veintiséis en mi cabeza. Normalmente empiezo con el registro a, luego b, ascendiendo en orden alfabético. Pruébalo y experimenta para ver qué técnica funciona mejor para ti.

Los registros de Vim son poderosos. Usados estratégicamente, pueden salvarte de escribir innumerables textos repetidos. A continuación, aprendamos sobre macros.