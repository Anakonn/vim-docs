---
description: Este documento enseña cómo combinar tipos de datos en Vimscript, enfocándose
  en el uso de operadores relacionales, condicionales y bucles en programación básica.
title: Ch26. Vimscript Conditionals and Loops
---

Después de aprender cuáles son los tipos de datos básicos, el siguiente paso es aprender a combinarlos para comenzar a escribir un programa básico. Un programa básico consiste en condicionales y bucles.

En este capítulo, aprenderás a usar los tipos de datos de Vimscript para escribir condicionales y bucles.

## Operadores Relacionales

Los operadores relacionales de Vimscript son similares a muchos lenguajes de programación:

```shell
a == b		equal to
a != b		not equal to
a >  b		greater than
a >= b		greater than or equal to
a <  b		less than
a <= b		less than or equal to
```

Por ejemplo:

```shell
:echo 5 == 5
:echo 5 != 5
:echo 10 > 5
:echo 10 >= 5
:echo 10 < 5
:echo 5 <= 5
```

Recuerda que las cadenas se convierten en números en una expresión aritmética. Aquí Vim también convierte cadenas en números en una expresión de igualdad. "5foo" se convierte en 5 (verdadero):

```shell
:echo 5 == "5foo"
" returns true
```

También recuerda que si comienzas una cadena con un carácter no numérico como "foo5", la cadena se convierte en el número 0 (falso).

```shell
echo 5 == "foo5"
" returns false
```

### Operadores Lógicos de Cadenas

Vim tiene más operadores relacionales para comparar cadenas:

```shell
a =~ b
a !~ b
```

Por ejemplos:

```shell
let str = "hearty breakfast"

echo str =~ "hearty"
" returns true

echo str =~ "dinner"
" returns false

echo str !~ "dinner"
" returns true
```

El operador `=~` realiza una coincidencia regex contra la cadena dada. En el ejemplo anterior, `str =~ "hearty"` devuelve verdadero porque `str` *contiene* el patrón "hearty". Siempre puedes usar `==` y `!=`, pero usarlos comparará la expresión contra toda la cadena. `=~` y `!~` son opciones más flexibles.

```shell
echo str == "hearty"
" returns false

echo str == "hearty breakfast"
" returns true
```

Intentemos esto. Nota la "H" mayúscula:

```shell
echo str =~ "Hearty"
" true
```

Devuelve verdadero incluso si "Hearty" está capitalizado. Interesante... Resulta que mi configuración de Vim está configurada para ignorar mayúsculas (`set ignorecase`), así que cuando Vim verifica la igualdad, usa mi configuración de Vim e ignora las mayúsculas. Si desactivara la opción de ignorar mayúsculas (`set noignorecase`), la comparación ahora devolvería falso.

```shell
set noignorecase
echo str =~ "Hearty"
" returns false because case matters

set ignorecase
echo str =~ "Hearty"
" returns true because case doesn't matter
```

Si estás escribiendo un complemento para otros, esta es una situación complicada. ¿El usuario usa `ignorecase` o `noignorecase`? Definitivamente no quieres obligar a tus usuarios a cambiar su opción de ignorar mayúsculas. Entonces, ¿qué haces?

Afortunadamente, Vim tiene un operador que puede *siempre* ignorar o coincidir con mayúsculas. Para siempre coincidir con mayúsculas, agrega un `#` al final.

```shell
set ignorecase
echo str =~# "hearty"
" returns true

echo str =~# "HearTY"
" returns false

set noignorecase
echo str =~# "hearty"
" true

echo str =~# "HearTY"
" false

echo str !~# "HearTY"
" true
```

Para siempre ignorar mayúsculas al comparar, añádelo con `?`:

```shell
set ignorecase
echo str =~? "hearty"
" true

echo str =~? "HearTY"
" true

set noignorecase
echo str =~? "hearty"
" true

echo str =~? "HearTY"
" true

echo str !~? "HearTY"
" false
```

Prefiero usar `#` para siempre coincidir con las mayúsculas y estar del lado seguro.

## If

Ahora que has visto las expresiones de igualdad de Vim, toquemos un operador condicional fundamental, la declaración `if`.

Como mínimo, la sintaxis es:

```shell
if {clause}
  {some expression}
endif
```

Puedes extender el análisis de casos con `elseif` y `else`.

```shell
if {predicate1}
  {expression1}
elseif {predicate2}
  {expression2}
elseif {predicate3}
  {expression3}
else
  {expression4}
endif
```

Por ejemplo, el complemento [vim-signify](https://github.com/mhinz/vim-signify) utiliza un método de instalación diferente dependiendo de tus configuraciones de Vim. A continuación se muestra la instrucción de instalación de su `readme`, utilizando la declaración `if`:

```shell
if has('nvim') || has('patch-8.0.902')
  Plug 'mhinz/vim-signify'
else
  Plug 'mhinz/vim-signify', { 'branch': 'legacy' }
endif
```

## Expresión Ternaria

Vim tiene una expresión ternaria para un análisis de caso en una línea:

```shell
{predicate} ? expressiontrue : expressionfalse
```

Por ejemplo:

```shell
echo 1 ? "I am true" : "I am false"
```

Dado que 1 es verdadero, Vim imprime "I am true". Supongamos que deseas establecer condicionalmente el `background` en oscuro si estás usando Vim después de cierta hora. Agrega esto a vimrc:

```shell
let &background = strftime("%H") < 18 ? "light" : "dark"
```

`&background` es la opción `'background'` en Vim. `strftime("%H")` devuelve la hora actual en horas. Si aún no son las 6 PM, usa un fondo claro. De lo contrario, usa un fondo oscuro.

## or

El "o" lógico (`||`) funciona como en muchos lenguajes de programación.

```shell
{Falsy expression}  || {Falsy expression}   false
{Falsy expression}  || {Truthy expression}  true
{Truthy expression} || {Falsy expression}   true
{Truthy expression} || {Truthy expression}  true
```

Vim evalúa la expresión y devuelve 1 (verdadero) o 0 (falso).

```shell
echo 5 || 0
" returns 1

echo 5 || 5
" returns 1

echo 0 || 0
" returns 0

echo "foo5" || "foo5"
" returns 0

echo "5foo" || "foo5"
" returns 1
```

Si la expresión actual evalúa como verdadera, la expresión subsiguiente no se evaluará.

```shell
let one_dozen = 12

echo one_dozen || two_dozen
" returns 1

echo two_dozen || one_dozen
" returns error
```

Nota que `two_dozen` nunca está definido. La expresión `one_dozen || two_dozen` no lanza ningún error porque `one_dozen` se evalúa primero y se encuentra que es verdadero, por lo que Vim no evalúa `two_dozen`.

## and

El "y" lógico (`&&`) es el complemento del "o" lógico.

```shell
{Falsy Expression}  && {Falsy Expression}   false
{Falsy expression}  && {Truthy expression}  false
{Truthy Expression} && {Falsy Expression}   false
{Truthy expression} && {Truthy expression}  true
```

Por ejemplo:

```shell
echo 0 && 0
" returns 0

echo 0 && 10
" returns 0
```

`&&` evalúa una expresión hasta que ve una primera expresión falsa. Por ejemplo, si tienes `true && true`, evaluará ambas y devolverá `true`. Si tienes `true && false && true`, evaluará el primer `true` y se detendrá en el primer `false`. No evaluará el tercer `true`.

```shell
let one_dozen = 12
echo one_dozen && 10
" returns 1

echo one_dozen && v:false
" returns 0

echo one_dozen && two_dozen
" returns error

echo exists("one_dozen") && one_dozen == 12
" returns 1
```

## for

El bucle `for` se usa comúnmente con el tipo de datos de lista.

```shell
let breakfasts = ["pancakes", "waffles", "eggs"]

for breakfast in breakfasts
  echo breakfast
endfor
```

Funciona con listas anidadas:

```shell
let meals = [["breakfast", "pancakes"], ["lunch", "fish"], ["dinner", "pasta"]]

for [meal_type, food] in meals
  echo "I am having " . food . " for " . meal_type
endfor
```

Técnicamente puedes usar el bucle `for` con un diccionario usando el método `keys()`.

```shell
let beverages = #{breakfast: "milk", lunch: "orange juice", dinner: "water"}
for beverage_type in keys(beverages)
  echo "I am drinking " . beverages[beverage_type] . " for " . beverage_type
endfor
```

## While

Otro bucle común es el bucle `while`.

```shell
let counter = 1
while counter < 5
  echo "Counter is: " . counter
  let counter += 1
endwhile
```

Para obtener el contenido de la línea actual hasta la última línea:

```shell
let current_line = line(".")
let last_line = line("$")

while current_line <= last_line
  echo getline(current_line)
  let current_line += 1
endwhile
```

## Manejo de Errores

A menudo, tu programa no se ejecuta de la manera que esperas. Como resultado, te deja confundido (juego de palabras intencionado). Lo que necesitas es un manejo de errores adecuado.

### Break

Cuando usas `break` dentro de un bucle `while` o `for`, detiene el bucle.

Para obtener los textos desde el inicio del archivo hasta la línea actual, pero detenerte cuando veas la palabra "donut":

```shell
let line = 0
let last_line = line("$")
let total_word = ""

while line <= last_line
  let line += 1
  let line_text = getline(line)
  if line_text =~# "donut"
    break
  endif
  echo line_text
  let total_word .= line_text . " "
endwhile

echo total_word
```

Si tienes el texto:

```shell
one
two
three
donut
four
five
```

Ejecutar el bucle `while` anterior da "one two three" y no el resto del texto porque el bucle se interrumpe una vez que coincide con "donut".

### Continue

El método `continue` es similar a `break`, donde se invoca durante un bucle. La diferencia es que en lugar de salir del bucle, simplemente omite esa iteración actual.

Supongamos que tienes el mismo texto pero en lugar de `break`, usas `continue`:

```shell
let line = 0
let last_line = line("$")
let total_word = ""

while line <= last_line
  let line += 1
  let line_text = getline(line)
  if line_text =~# "donut"
    continue
  endif
  echo line_text
  let total_word .= line_text . " "
endwhile

echo total_word
```

Esta vez devuelve `one two three four five`. Omite la línea con la palabra "donut", pero el bucle continúa.
### try, finally, y catch

Vim tiene un `try`, `finally`, y `catch` para manejar errores. Para simular un error, puedes usar el comando `throw`.

```shell
try
  echo "Intenta"
  throw "Nope"
endtry
```

Ejecuta esto. Vim se quejará con el error `"Exception not caught: Nope`.

Ahora agrega un bloque catch:

```shell
try
  echo "Intenta"
  throw "Nope"
catch
  echo "Lo atrapé"
endtry
```

Ahora ya no hay ningún error. Deberías ver "Intenta" y "Lo atrapé" mostrados.

Vamos a eliminar el `catch` y agregar un `finally`:

```shell
try
  echo "Intenta"
  throw "Nope"
  echo "No me verás"
finally
  echo "Finalmente"
endtry
```

Ejecuta esto. Ahora Vim muestra el error y "Finalmente".

Juntémoslos todos:

```shell
try
  echo "Intenta"
  throw "Nope"
catch
  echo "Lo atrapé"
finally
  echo "Finalmente"
endtry
```

Esta vez Vim muestra tanto "Lo atrapé" como "Finalmente". No se muestra ningún error porque Vim lo atrapó.

Los errores provienen de diferentes lugares. Otra fuente de error es llamar a una función inexistente, como `Nope()` a continuación:

```shell
try
  echo "Intenta"
  call Nope()
catch
  echo "Lo atrapé"
finally
  echo "Finalmente"
endtry
```

La diferencia entre `catch` y `finally` es que `finally` siempre se ejecuta, con o sin error, mientras que un catch solo se ejecuta cuando tu código encuentra un error.

Puedes atrapar errores específicos con `:catch`. Según `:h :catch`:

```shell
catch /^Vim:Interrupt$/.             " atrapar interrupciones (CTRL-C)
catch /^Vim\\%((\\a\\+)\\)\\=:E/.    " atrapar todos los errores de Vim
catch /^Vim\\%((\\a\\+)\\)\\=:/.     " atrapar errores e interrupciones
catch /^Vim(write):/.                " atrapar todos los errores en :write
catch /^Vim\\%((\\a\\+)\\)\\=:E123:/ " atrapar error E123
catch /my-exception/.                " atrapar excepción de usuario
catch /.*/                           " atrapar todo
catch.                               " igual que /.*/
```

Dentro de un bloque `try`, una interrupción se considera un error atrapable.

```shell
try
  catch /^Vim:Interrupt$/
  sleep 100
endtry
```

En tu vimrc, si usas un esquema de colores personalizado, como [gruvbox](https://github.com/morhetz/gruvbox), y accidentalmente eliminas el directorio del esquema de colores pero aún tienes la línea `colorscheme gruvbox` en tu vimrc, Vim lanzará un error cuando lo `source`. Para solucionar esto, agregué esto en mi vimrc:

```shell
try
  colorscheme gruvbox
catch
  colorscheme default
endtry
```

Ahora, si `source` vimrc sin el directorio `gruvbox`, Vim usará el `colorscheme default`.

## Aprende Condicionales de la Manera Inteligente

En el capítulo anterior, aprendiste sobre los tipos de datos básicos de Vim. En este capítulo, aprendiste cómo combinarlos para escribir programas básicos utilizando condicionales y bucles. Estos son los bloques de construcción de la programación.

A continuación, aprendamos sobre los ámbitos de las variables.