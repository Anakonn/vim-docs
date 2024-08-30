---
description: Este documento explora las funciones en Vimscript, sus reglas de sintaxis
  y ejemplos de definición, destacando la importancia de la abstracción en el aprendizaje.
title: Ch28. Vimscript Functions
---

Las funciones son medios de abstracción, el tercer elemento en el aprendizaje de un nuevo lenguaje.

En los capítulos anteriores, has visto funciones nativas de Vimscript (`len()`, `filter()`, `map()`, etc.) y funciones personalizadas en acción. En este capítulo, profundizarás para aprender cómo funcionan las funciones.

## Reglas de Sintaxis de Funciones

En esencia, una función de Vimscript tiene la siguiente sintaxis:

```shell
function {FunctionName}()
  {do-something}
endfunction
```

Una definición de función debe comenzar con una letra mayúscula. Comienza con la palabra clave `function` y termina con `endfunction`. A continuación se muestra una función válida:

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

Lo siguiente no es una función válida porque no comienza con una letra mayúscula.

```shell
function tasty()
  echo "Tasty"
endfunction
```

Si precedes una función con la variable de script (`s:`), puedes usarla con una letra minúscula. `function s:tasty()` es un nombre válido. La razón por la que Vim requiere que uses un nombre en mayúscula es para evitar confusiones con las funciones integradas de Vim (todas en minúscula).

Un nombre de función no puede comenzar con un número. `1Tasty()` no es un nombre de función válido, pero `Tasty1()` sí lo es. Una función tampoco puede contener caracteres no alfanuméricos además de `_`. `Tasty-food()`, `Tasty&food()` y `Tasty.food()` no son nombres de función válidos. `Tasty_food()` *sí lo es*.

Si defines dos funciones con el mismo nombre, Vim lanzará un error quejándose de que la función `Tasty` ya existe. Para sobrescribir la función anterior con el mismo nombre, agrega un `!` después de la palabra clave `function`.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

## Listando Funciones Disponibles

Para ver todas las funciones integradas y personalizadas en Vim, puedes ejecutar el comando `:function`. Para ver el contenido de la función `Tasty`, puedes ejecutar `:function Tasty`.

También puedes buscar funciones con un patrón usando `:function /pattern`, similar a la navegación de búsqueda de Vim (`/pattern`). Para buscar todas las funciones que contienen la frase "map", ejecuta `:function /map`. Si usas plugins externos, Vim mostrará las funciones definidas en esos plugins.

Si deseas ver de dónde proviene una función, puedes usar el comando `:verbose` con el comando `:function`. Para ver de dónde provienen todas las funciones que contienen la palabra "map", ejecuta:

```shell
:verbose function /map
```

Cuando lo ejecuté, obtuve varios resultados. Este me dice que la función `fzf#vim#maps` es una función de autoload (para recapitular, consulta el Cap. 23) que está escrita dentro del archivo `~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim`, en la línea 1263. Esto es útil para depuración.

```shell
function fzf#vim#maps(mode, ...)
        Last set from ~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim line 1263
```

## Eliminando una Función

Para eliminar una función existente, usa `:delfunction {Function_name}`. Para eliminar `Tasty`, ejecuta `:delfunction Tasty`.

## Valor de Retorno de la Función

Para que una función devuelva un valor, necesitas pasarle un valor de `return` explícito. De lo contrario, Vim devuelve automáticamente un valor implícito de 0.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

Un `return` vacío también es equivalente a un valor de 0.

```shell
function! Tasty()
  echo "Tasty"
  return
endfunction
```

Si ejecutas `:echo Tasty()` usando la función anterior, después de que Vim muestre "Tasty", devuelve 0, el valor de retorno implícito. Para hacer que `Tasty()` devuelva el valor "Tasty", puedes hacer esto:

```shell
function! Tasty()
  return "Tasty"
endfunction
```

Ahora, cuando ejecutas `:echo Tasty()`, devuelve la cadena "Tasty".

Puedes usar una función dentro de una expresión. Vim usará el valor de retorno de esa función. La expresión `:echo Tasty() . " Food!"` produce "Tasty Food!"

## Argumentos Formales

Para pasar un argumento formal `food` a tu función `Tasty`, puedes hacer esto:

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

echo Tasty("pastry")
" devuelve "Tasty pastry"
```

`a:` es uno de los ámbitos de variable mencionados en el capítulo anterior. Es la variable de parámetro formal. Es la forma de Vim de obtener un valor de parámetro formal en una función. Sin él, Vim lanzará un error:

```shell
function! Tasty(food)
  return "Tasty " . food
endfunction

echo Tasty("pasta")
" devuelve "nombre de variable indefinido" error
```

## Variable Local de Función

Abordemos la otra variable que no aprendiste en el capítulo anterior: la variable local de función (`l:`).

Al escribir una función, puedes definir una variable dentro:

```shell
function! Yummy()
  let location = "tummy"
  return "Yummy in my " . location
endfunction

echo Yummy()
" devuelve "Yummy in my tummy"
```

En este contexto, la variable `location` es lo mismo que `l:location`. Cuando defines una variable en una función, esa variable es *local* a esa función. Cuando un usuario ve `location`, podría confundirse fácilmente con una variable global. Prefiero ser más explícito que no, así que prefiero poner `l:` para indicar que esta es una variable de función.

Otra razón para usar `l:count` es que Vim tiene variables especiales con alias que parecen variables regulares. `v:count` es un ejemplo. Tiene un alias de `count`. En Vim, llamar a `count` es lo mismo que llamar a `v:count`. Es fácil llamar accidentalmente a una de esas variables especiales.

```shell
function! Calories()
  let count = "count"
  return "I do not " . count . " my calories"
endfunction

echo Calories()
" lanza un error
```

La ejecución anterior lanza un error porque `let count = "Count"` intenta redefinir implícitamente la variable especial de Vim `v:count`. Recuerda que las variables especiales (`v:`) son de solo lectura. No puedes mutarlas. Para solucionarlo, usa `l:count`:

```shell
function! Calories()
  let l:count = "count"
  return "I do not " . l:count . " my calories"
endfunction

echo Calories()
" devuelve "I do not count my calories"
```

## Llamando a una Función

Vim tiene un comando `:call` para llamar a una función.

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

call Tasty("gravy")
```

El comando `call` no muestra el valor de retorno. Llamémoslo con `echo`.

```shell
echo call Tasty("gravy")
```

Ups, obtienes un error. El comando `call` anterior es un comando de línea de comandos (`:call`). El comando `echo` anterior también es un comando de línea de comandos (`:echo`). No puedes llamar a un comando de línea de comandos con otro comando de línea de comandos. Intentemos un sabor diferente del comando `call`:

```shell
echo call("Tasty", ["gravy"])
" devuelve "Tasty gravy"
```

Para aclarar cualquier confusión, acabas de usar dos comandos `call` diferentes: el comando de línea de comandos `:call` y la función `call()`. La función `call()` acepta como su primer argumento el nombre de la función (cadena) y su segundo argumento los parámetros formales (lista).

Para aprender más sobre `:call` y `call()`, consulta `:h call()` y `:h :call`.

## Argumento Predeterminado

Puedes proporcionar un parámetro de función con un valor predeterminado con `=`. Si llamas a `Breakfast` con solo un argumento, el argumento `beverage` usará el valor predeterminado "milk".

```shell
function! Breakfast(meal, beverage = "Milk")
  return "I had " . a:meal . " and " . a:beverage . " for breakfast"
endfunction

echo Breakfast("Hash Browns")
" devuelve I had hash browns and milk for breakfast

echo Breakfast("Cereal", "Orange Juice")
" devuelve I had Cereal and Orange Juice for breakfast
```

## Argumentos Variables

Puedes pasar un argumento variable con tres puntos (`...`). El argumento variable es útil cuando no sabes cuántas variables dará un usuario.

Supongamos que estás creando un buffet de todo lo que puedas comer (nunca sabrás cuánto comerá tu cliente):

```shell
function! Buffet(...)
  return a:1
endfunction
```

Si ejecutas `echo Buffet("Noodles")`, producirá "Noodles". Vim usa `a:1` para imprimir el *primer* argumento pasado a `...`, hasta 20 (`a:1` es el primer argumento, `a:2` es el segundo argumento, etc.). Si ejecutas `echo Buffet("Noodles", "Sushi")`, aún mostrará solo "Noodles", actualicémoslo:

```shell
function! Buffet(...)
  return a:1 . " " . a:2
endfunction

echo Buffet("Noodles", "Sushi")
" devuelve "Noodles Sushi"
```

El problema con este enfoque es que si ahora ejecutas `echo Buffet("Noodles")` (con solo una variable), Vim se queja de que tiene una variable indefinida `a:2`. ¿Cómo puedes hacerlo lo suficientemente flexible como para mostrar exactamente lo que el usuario da?

Afortunadamente, Vim tiene una variable especial `a:0` para mostrar el *número* de argumentos pasados a `...`.

```shell
function! Buffet(...)
  return a:0
endfunction

echo Buffet("Noodles")
" devuelve 1

echo Buffet("Noodles", "Sushi")
" devuelve 2

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" devuelve 5
```

Con esto, puedes iterar usando la longitud del argumento.

```shell
function! Buffet(...)
  let l:food_counter = 1
  let l:foods = ""
  while l:food_counter <= a:0
    let l:foods .= a:{l:food_counter} . " "
    let l:food_counter += 1
  endwhile
  return l:foods
endfunction
```

Las llaves `a:{l:food_counter}` son una interpolación de cadena, utilizan el valor del contador `food_counter` para llamar a los argumentos de parámetro formal `a:1`, `a:2`, `a:3`, etc.

```shell
echo Buffet("Noodles")
" devuelve "Noodles"

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" devuelve todo lo que pasaste: "Noodles Sushi Ice cream Tofu Mochi"
```

El argumento variable tiene una variable especial más: `a:000`. Tiene el valor de todos los argumentos variables en formato de lista.

```shell
function! Buffet(...)
  return a:000
endfunction

echo Buffet("Noodles")
" devuelve ["Noodles"]

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" devuelve ["Noodles", "Sushi", "Ice cream", "Tofu", "Mochi"]
```

Refactoricemos la función para usar un bucle `for`:

```shell
function! Buffet(...)
  let l:foods = ""
  for food_item in a:000
    let l:foods .= food_item . " "
  endfor
  return l:foods
endfunction

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" devuelve Noodles Sushi Ice cream Tofu Mochi
```
## Rango

Puedes definir una función de Vimscript *rango* añadiendo una palabra clave `range` al final de la definición de la función. Una función de rango tiene dos variables especiales disponibles: `a:firstline` y `a:lastline`.

```shell
function! Breakfast() range
  echo a:firstline
  echo a:lastline
endfunction
```

Si estás en la línea 100 y ejecutas `call Breakfast()`, mostrará 100 tanto para `firstline` como para `lastline`. Si seleccionas visualmente (`v`, `V`, o `Ctrl-V`) las líneas 101 a 105 y ejecutas `call Breakfast()`, `firstline` mostrará 101 y `lastline` mostrará 105. `firstline` y `lastline` muestran el rango mínimo y máximo donde se llama a la función.

También puedes usar `:call` y pasarle un rango. Si ejecutas `:11,20call Breakfast()`, mostrará 11 para `firstline` y 20 para `lastline`.

Podrías preguntar: "Es genial que la función de Vimscript acepte rango, pero ¿no puedo obtener el número de línea con `line(".")`? ¿No hará lo mismo?"

Buena pregunta. Si esto es lo que quieres decir:

```shell
function! Breakfast()
  echo line(".")
endfunction
```

Llamar a `:11,20call Breakfast()` ejecuta la función `Breakfast` 10 veces (una por cada línea en el rango). Compara eso si hubieras pasado el argumento `range`:

```shell
function! Breakfast() range
  echo line(".")
endfunction
```

Llamar a `11,20call Breakfast()` ejecuta la función `Breakfast` *una vez*.

Si pasas una palabra clave `range` y le pasas un rango numérico (como `11,20`) en `call`, Vim solo ejecuta esa función una vez. Si no pasas una palabra clave `range` y le pasas un rango numérico (como `11,20`) en `call`, Vim ejecuta esa función N veces dependiendo del rango (en este caso, N = 10).

## Diccionario

Puedes añadir una función como un elemento de diccionario añadiendo una palabra clave `dict` al definir una función.

Si tienes una función `SecondBreakfast` que devuelve cualquier elemento de `breakfast` que tengas:

```shell
function! SecondBreakfast() dict
  return self.breakfast
endfunction
```

Añadamos esta función al diccionario `meals`:

```shell
let meals = {"breakfast": "pancakes", "second_breakfast": function("SecondBreakfast"), "lunch": "pasta"}

echo meals.second_breakfast()
" devuelve "pancakes"
```

Con la palabra clave `dict`, la variable clave `self` se refiere al diccionario donde se almacena la función (en este caso, el diccionario `meals`). La expresión `self.breakfast` es igual a `meals.breakfast`.

Una forma alternativa de añadir una función a un objeto diccionario es usar un espacio de nombres.

```shell
function! meals.second_lunch()
  return self.lunch
endfunction

echo meals.second_lunch()
" devuelve "pasta"
```

Con el espacio de nombres, no tienes que usar la palabra clave `dict`.

## Funcref

Un funcref es una referencia a una función. Es uno de los tipos de datos básicos de Vimscript mencionados en el Cap. 24.

La expresión `function("SecondBreakfast")` arriba es un ejemplo de funcref. Vim tiene una función incorporada `function()` que devuelve un funcref cuando le pasas un nombre de función (cadena).

```shell
function! Breakfast(item)
  return "I am having " . a:item . " for breakfast"
endfunction

let Breakfastify = Breakfast
" devuelve error

let Breakfastify = function("Breakfast")

echo Breakfastify("oatmeal")
" devuelve "I am having oatmeal for breakfast"

echo Breakfastify("pancake")
" devuelve "I am having pancake for breakfast"
```

En Vim, si quieres asignar una función a una variable, no puedes simplemente asignarla directamente como `let MyVar = MyFunc`. Necesitas usar la función `function()`, como `let MyVar = function("MyFunc")`.

Puedes usar funcref con mapas y filtros. Ten en cuenta que los mapas y filtros pasarán un índice como el primer argumento y el valor iterado como el segundo argumento.

```shell
function! Breakfast(index, item)
  return "I am having " . a:item . " for breakfast"
endfunction

let breakfast_items = ["pancakes", "hash browns", "waffles"]
let first_meals = map(breakfast_items, function("Breakfast"))

for meal in first_meals
  echo meal
endfor
```

## Lambda

Una mejor manera de usar funciones en mapas y filtros es usar expresiones lambda (a veces conocidas como funciones sin nombre). Por ejemplo:

```shell
let Plus = {x,y -> x + y}
echo Plus(1,2)
" devuelve 3

let Tasty = { -> 'tasty'}
echo Tasty()
" devuelve "tasty"
```

Puedes llamar a una función desde dentro de una expresión lambda:

```shell
function! Lunch(item)
  return "I am having " . a:item . " for lunch"
endfunction

let lunch_items = ["sushi", "ramen", "sashimi"]

let day_meals = map(lunch_items, {index, item -> Lunch(item)})

for meal in day_meals
  echo meal
endfor
```

Si no quieres llamar a la función desde dentro de la lambda, puedes refactorizarla:

```shell
let day_meals = map(lunch_items, {index, item -> "I am having " . item . " for lunch"})
```

## Encadenamiento de Métodos

Puedes encadenar varias funciones de Vimscript y expresiones lambda secuencialmente con `->`. Ten en cuenta que `->` debe ser seguido por un nombre de método *sin espacio*.

```shell
Source->Method1()->Method2()->...->MethodN()
```

Para convertir un flotante a un número usando encadenamiento de métodos:

```shell
echo 3.14->float2nr()
" devuelve 3
```

Hagamos un ejemplo más complicado. Supongamos que necesitas capitalizar la primera letra de cada elemento en una lista, luego ordenar la lista, luego unir la lista para formar una cadena.

```shell
function! Capitalizer(word)
  return substitute(a:word, "\^\.", "\\u&", "g")
endfunction

function! CapitalizeList(word_list)
  return map(a:word_list, {index, word -> Capitalizer(word)})
endfunction

let dinner_items = ["bruschetta", "antipasto", "calzone"]

echo dinner_items->CapitalizeList()->sort()->join(", ")
" devuelve "Antipasto, Bruschetta, Calzone"
```

Con el encadenamiento de métodos, la secuencia es más fácil de leer y entender. Solo puedo echar un vistazo a `dinner_items->CapitalizeList()->sort()->join(", ")` y saber exactamente qué está pasando.

## Cierre

Cuando defines una variable dentro de una función, esa variable existe dentro de los límites de esa función. Esto se llama un ámbito léxico.

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch()
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

`appetizer` se define dentro de la función `Lunch`, que devuelve el funcref `SecondLunch`. Observa que `SecondLunch` usa el `appetizer`, pero en Vimscript, no tiene acceso a esa variable. Si intentas ejecutar `echo Lunch()()`, Vim lanzará un error de variable indefinida.

Para solucionar este problema, usa la palabra clave `closure`. Vamos a refactorizar:

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch() closure
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

Ahora, si ejecutas `echo Lunch()()`, Vim devolverá "shrimp".

## Aprende las Funciones de Vimscript de Manera Inteligente

En este capítulo, aprendiste la anatomía de la función de Vim. Aprendiste cómo usar diferentes palabras clave especiales `range`, `dict` y `closure` para modificar el comportamiento de la función. También aprendiste cómo usar lambda y encadenar múltiples funciones juntas. Las funciones son herramientas importantes para crear abstracciones complejas.

A continuación, pongamos todo lo que has aprendido junto para hacer tu propio plugin.