---
description: هذا المستند يشرح كيفية تعريف واستخدام الدوال في Vimscript، مع التركيز
  على قواعد الصياغة وأهمية الأسماء الكبيرة في الدوال.
title: Ch28. Vimscript Functions
---

الدوال هي وسائل تجريد، العنصر الثالث في تعلم لغة جديدة.

في الفصول السابقة، رأيت دوال Vimscript الأصلية (`len()`, `filter()`, `map()`, إلخ) والدوال المخصصة في العمل. في هذا الفصل، ستتعمق لتتعلم كيف تعمل الدوال.

## قواعد بناء جملة الدوال

في جوهرها، تحتوي دالة Vimscript على بناء الجملة التالي:

```shell
function {FunctionName}()
  {do-something}
endfunction
```

يجب أن يبدأ تعريف الدالة بحرف كبير. يبدأ بكلمة `function` وينتهي بـ `endfunction`. أدناه دالة صالحة:

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

ما يلي ليس دالة صالحة لأنها لا تبدأ بحرف كبير.

```shell
function tasty()
  echo "Tasty"
endfunction
```

إذا قمت بإضافة متغير البرنامج النصي (`s:`) قبل الدالة، يمكنك استخدامها بحرف صغير. `function s:tasty()` هو اسم صالح. السبب في أن Vim يتطلب منك استخدام اسم بحرف كبير هو لتجنب الالتباس مع دوال Vim المدمجة (جميعها بحروف صغيرة).

لا يمكن أن يبدأ اسم الدالة برقم. `1Tasty()` ليس اسم دالة صالح، لكن `Tasty1()` هو. كما لا يمكن أن تحتوي الدالة على أحرف غير أبجدية بخلاف `_`. `Tasty-food()`, `Tasty&food()`, و `Tasty.food()` ليست أسماء دوال صالحة. `Tasty_food()` *هي*.

إذا قمت بتعريف دالتين بنفس الاسم، ستظهر Vim خطأ يشكو من أن الدالة `Tasty` موجودة بالفعل. لاستبدال الدالة السابقة بنفس الاسم، أضف `!` بعد كلمة `function`.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

## قائمة الدوال المتاحة

لرؤية جميع الدوال المدمجة والمخصصة في Vim، يمكنك تشغيل الأمر `:function`. للنظر في محتوى دالة `Tasty`، يمكنك تشغيل `:function Tasty`.

يمكنك أيضًا البحث عن الدوال باستخدام نمط مع `:function /pattern`، مشابهًا لتصفح البحث في Vim (`/pattern`). للبحث عن جميع الدوال التي تحتوي على عبارة "map"، قم بتشغيل `:function /map`. إذا كنت تستخدم إضافات خارجية، ستعرض Vim الدوال المعرفة في تلك الإضافات.

إذا كنت تريد أن ترى من أين تنشأ دالة، يمكنك استخدام الأمر `:verbose` مع الأمر `:function`. للنظر في مكان نشأة جميع الدوال التي تحتوي على كلمة "map"، قم بتشغيل:

```shell
:verbose function /map
```

عندما قمت بتشغيله، حصلت على عدد من النتائج. هذه تخبرني أن الدالة `fzf#vim#maps` هي دالة تحميل تلقائي (للتلخيص، راجع الفصل 23) مكتوبة داخل ملف `~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim`، في السطر 1263. هذا مفيد لأغراض تصحيح الأخطاء.

```shell
function fzf#vim#maps(mode, ...)
        Last set from ~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim line 1263
```

## إزالة دالة

لإزالة دالة موجودة، استخدم `:delfunction {Function_name}`. لحذف `Tasty`، قم بتشغيل `:delfunction Tasty`.

## قيمة إرجاع الدالة

لكي ترجع دالة قيمة، تحتاج إلى تمرير قيمة `return` صريحة لها. خلاف ذلك، ستعود Vim تلقائيًا بقيمة ضمنية قدرها 0.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

إرجاع فارغ أيضًا يعادل قيمة 0.

```shell
function! Tasty()
  echo "Tasty"
  return
endfunction
```

إذا قمت بتشغيل `:echo Tasty()` باستخدام الدالة أعلاه، بعد أن تعرض Vim "Tasty"، ستعود 0، وهي قيمة الإرجاع الضمنية. لجعل `Tasty()` ترجع قيمة "Tasty"، يمكنك القيام بذلك:

```shell
function! Tasty()
  return "Tasty"
endfunction
```

الآن عندما تقوم بتشغيل `:echo Tasty()`، ستعود سلسلة "Tasty".

يمكنك استخدام دالة داخل تعبير. ستستخدم Vim قيمة الإرجاع لتلك الدالة. التعبير `:echo Tasty() . " Food!"` ينتج "Tasty Food!"

## المعاملات الرسمية

لتمرير معامل رسمي `food` إلى دالتك `Tasty`، يمكنك القيام بذلك:

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

echo Tasty("pastry")
" returns "Tasty pastry"
```

`a:` هو أحد نطاقات المتغيرات المذكورة في الفصل السابق. إنه متغير المعامل الرسمي. إنها طريقة Vim للحصول على قيمة المعامل الرسمي في دالة. بدونه، ستظهر Vim خطأ:

```shell
function! Tasty(food)
  return "Tasty " . food
endfunction

echo Tasty("pasta")
" returns "undefined variable name" error
```

## المتغير المحلي للدالة

دعنا نتناول المتغير الآخر الذي لم تتعلمه في الفصل السابق: المتغير المحلي للدالة (`l:`).

عند كتابة دالة، يمكنك تعريف متغير داخلها:

```shell
function! Yummy()
  let location = "tummy"
  return "Yummy in my " . location
endfunction

echo Yummy()
" returns "Yummy in my tummy"
```

في هذا السياق، المتغير `location` هو نفسه `l:location`. عندما تعرف متغيرًا في دالة، يكون هذا المتغير *محليًا* لتلك الدالة. عندما يرى المستخدم `location`، قد يُخطئ بسهولة في اعتباره متغيرًا عالميًا. أفضل أن أكون أكثر وضوحًا من عدمه، لذلك أفضل وضع `l:` للإشارة إلى أن هذا متغير دالة.

سبب آخر لاستخدام `l:count` هو أن Vim لديها متغيرات خاصة بأسماء مستعارة تبدو مثل المتغيرات العادية. `v:count` هو أحد الأمثلة. لديه اسم مستعار لـ `count`. في Vim، استدعاء `count` هو نفسه استدعاء `v:count`. من السهل أن تستدعي عن طريق الخطأ أحد تلك المتغيرات الخاصة.

```shell
function! Calories()
  let count = "count"
  return "I do not " . count . " my calories"
endfunction

echo Calories()
" throws an error
```

التنفيذ أعلاه يثير خطأ لأن `let count = "Count"` يحاول ضمنيًا إعادة تعريف المتغير الخاص بـ Vim `v:count`. تذكر أن المتغيرات الخاصة (`v:`) هي للقراءة فقط. لا يمكنك تعديلها. لإصلاح ذلك، استخدم `l:count`:

```shell
function! Calories()
  let l:count = "count"
  return "I do not " . l:count . " my calories"
endfunction

echo Calories()
" returns "I do not count my calories"
```

## استدعاء دالة

يمتلك Vim أمر `:call` لاستدعاء دالة.

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

call Tasty("gravy")
```

أمر `call` لا يخرج قيمة الإرجاع. دعنا نستدعيها باستخدام `echo`.

```shell
echo call Tasty("gravy")
```

أوه، ستحصل على خطأ. الأمر `call` أعلاه هو أمر سطر الأوامر (`:call`). أمر `echo` أعلاه هو أيضًا أمر سطر الأوامر (`:echo`). لا يمكنك استدعاء أمر سطر الأوامر مع أمر سطر الأوامر آخر. دعنا نجرب نكهة مختلفة من أمر `call`:

```shell
echo call("Tasty", ["gravy"])
" returns "Tasty gravy"
```

لإزالة أي لبس، لقد استخدمت للتو نوعين مختلفين من أوامر `call`: أمر سطر الأوامر `:call` ودالة `call()`. دالة `call()` تقبل كأول معامل اسم الدالة (سلسلة) وكثاني معامل المعاملات الرسمية (قائمة).

لتعلم المزيد عن `:call` و `call()`، تحقق من `:h call()` و `:h :call`.

## المعامل الافتراضي

يمكنك توفير قيمة افتراضية لمعامل الدالة باستخدام `=`. إذا قمت باستدعاء `Breakfast` بمعامل واحد فقط، سيستخدم معامل `beverage` القيمة الافتراضية "الحليب".

```shell
function! Breakfast(meal, beverage = "Milk")
  return "I had " . a:meal . " and " . a:beverage . " for breakfast"
endfunction

echo Breakfast("Hash Browns")
" returns I had hash browns and milk for breakfast

echo Breakfast("Cereal", "Orange Juice")
" returns I had Cereal and Orange Juice for breakfast
```

## المعاملات المتغيرة

يمكنك تمرير معامل متغير باستخدام ثلاث نقاط (`...`). المعامل المتغير مفيد عندما لا تعرف عدد المتغيرات التي سيعطيها المستخدم.

افترض أنك تقوم بإنشاء بوفيه مفتوح (لن تعرف أبدًا كم من الطعام سيأكله عميلك):

```shell
function! Buffet(...)
  return a:1
endfunction
```

إذا قمت بتشغيل `echo Buffet("Noodles")`، سيظهر "Noodles". تستخدم Vim `a:1` لطباعة *أول* معامل تم تمريره إلى `...`، حتى 20 (`a:1` هو المعامل الأول، `a:2` هو المعامل الثاني، إلخ). إذا قمت بتشغيل `echo Buffet("Noodles", "Sushi")`، سيظل يعرض فقط "Noodles"، دعنا نقوم بتحديثه:

```shell
function! Buffet(...)
  return a:1 . " " . a:2
endfunction

echo Buffet("Noodles", "Sushi")
" returns "Noodles Sushi"
```

المشكلة في هذا النهج هي أنه إذا قمت الآن بتشغيل `echo Buffet("Noodles")` (مع متغير واحد فقط)، ستشكو Vim من أن لديها متغير غير معرف `a:2`. كيف يمكنك جعله مرنًا بما يكفي لعرض ما يقدمه المستخدم بالضبط؟

لحسن الحظ، تمتلك Vim متغيرًا خاصًا `a:0` لعرض *عدد* المعاملات الممررة إلى `...`.

```shell
function! Buffet(...)
  return a:0
endfunction

echo Buffet("Noodles")
" returns 1

echo Buffet("Noodles", "Sushi")
" returns 2

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returns 5
```

بهذا، يمكنك التكرار باستخدام طول المعامل.

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

الأقواس المعقوفة `a:{l:food_counter}` هي تداخل سلسلة، تستخدم قيمة عداد `food_counter` لاستدعاء معاملات المعامل الرسمية `a:1`، `a:2`، `a:3`، إلخ.

```shell
echo Buffet("Noodles")
" returns "Noodles"

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returns everything you passed: "Noodles Sushi Ice cream Tofu Mochi"
```

لدى المعامل المتغير متغير خاص آخر: `a:000`. له قيمة جميع المعاملات المتغيرة في تنسيق قائمة.

```shell
function! Buffet(...)
  return a:000
endfunction

echo Buffet("Noodles")
" returns ["Noodles"]

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returns ["Noodles", "Sushi", "Ice cream", "Tofu", "Mochi"]
```

دعنا نعيد هيكلة الدالة لاستخدام حلقة `for`:

```shell
function! Buffet(...)
  let l:foods = ""
  for food_item in a:000
    let l:foods .= food_item . " "
  endfor
  return l:foods
endfunction

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returns Noodles Sushi Ice cream Tofu Mochi
```
## النطاق

يمكنك تعريف دالة *محددة النطاق* في Vimscript عن طريق إضافة كلمة `range` في نهاية تعريف الدالة. تحتوي الدالة المحددة النطاق على متغيرين خاصين متاحين: `a:firstline` و `a:lastline`.

```shell
function! Breakfast() range
  echo a:firstline
  echo a:lastline
endfunction
```

إذا كنت على السطر 100 وقمت بتشغيل `call Breakfast()`، فسيظهر 100 لكل من `firstline` و `lastline`. إذا قمت بتحديد بصريًا (`v`، `V`، أو `Ctrl-V`) الأسطر من 101 إلى 105 وقمت بتشغيل `call Breakfast()`، فسيظهر `firstline` 101 و `lastline` 105. تعرض `firstline` و `lastline` الحد الأدنى والحد الأقصى للنطاق الذي تم استدعاء الدالة فيه.

يمكنك أيضًا استخدام `:call` وتمرير نطاق. إذا قمت بتشغيل `:11,20call Breakfast()`، فسيظهر 11 لـ `firstline` و 20 لـ `lastline`.

قد تسأل، "هذا جميل أن دالة Vimscript تقبل نطاق، لكن أليس بإمكاني الحصول على رقم السطر باستخدام `line(".")`؟ ألن يفعل نفس الشيء؟"

سؤال جيد. إذا كان هذا ما تعنيه:

```shell
function! Breakfast()
  echo line(".")
endfunction
```

استدعاء `:11,20call Breakfast()` ينفذ دالة `Breakfast` 10 مرات (مرة واحدة لكل سطر في النطاق). قارن ذلك إذا كنت قد مررت بحجة `range`:

```shell
function! Breakfast() range
  echo line(".")
endfunction
```

استدعاء `11,20call Breakfast()` ينفذ دالة `Breakfast` *مرة واحدة*.

إذا قمت بتمرير كلمة `range` ومررت نطاقًا عدديًا (مثل `11,20`) على `call`، فإن Vim ينفذ تلك الدالة مرة واحدة فقط. إذا لم تقم بتمرير كلمة `range` ومررت نطاقًا عدديًا (مثل `11,20`) على `call`، فإن Vim ينفذ تلك الدالة N مرات اعتمادًا على النطاق (في هذه الحالة، N = 10).

## القاموس

يمكنك إضافة دالة كعنصر في القاموس عن طريق إضافة كلمة `dict` عند تعريف دالة.

إذا كان لديك دالة `SecondBreakfast` التي تعيد أي عنصر من عناصر `breakfast` لديك:

```shell
function! SecondBreakfast() dict
  return self.breakfast
endfunction
```

دعنا نضيف هذه الدالة إلى قاموس `meals`:

```shell
let meals = {"breakfast": "pancakes", "second_breakfast": function("SecondBreakfast"), "lunch": "pasta"}

echo meals.second_breakfast()
" returns "pancakes"
```

مع كلمة `dict`، تشير المتغير الرئيسي `self` إلى القاموس الذي تم تخزين الدالة فيه (في هذه الحالة، قاموس `meals`). التعبير `self.breakfast` يساوي `meals.breakfast`.

طريقة بديلة لإضافة دالة إلى كائن القاموس هي استخدام مساحة الأسماء.

```shell
function! meals.second_lunch()
  return self.lunch
endfunction

echo meals.second_lunch()
" returns "pasta"
```

مع مساحة الأسماء، لا تحتاج إلى استخدام كلمة `dict`.

## Funcref

Funcref هو إشارة إلى دالة. إنه أحد الأنواع الأساسية للبيانات في Vimscript المذكورة في الفصل 24.

التعبير `function("SecondBreakfast")` أعلاه هو مثال على funcref. يحتوي Vim على دالة مدمجة `function()` التي تعيد funcref عند تمرير اسم دالة (سلسلة نصية) إليها.

```shell
function! Breakfast(item)
  return "I am having " . a:item . " for breakfast"
endfunction

let Breakfastify = Breakfast
" returns error

let Breakfastify = function("Breakfast")

echo Breakfastify("oatmeal")
" returns "I am having oatmeal for breakfast"

echo Breakfastify("pancake")
" returns "I am having pancake for breakfast"
```

في Vim، إذا كنت تريد تعيين دالة إلى متغير، لا يمكنك ببساطة تعيينها مباشرة مثل `let MyVar = MyFunc`. تحتاج إلى استخدام دالة `function()`، مثل `let MyVar = function("MyFunc")`.

يمكنك استخدام funcref مع الخرائط والفلاتر. لاحظ أن الخرائط والفلاتر ستمرر فهرسًا كأول حجة والقيمة المكررة كالحجة الثانية.

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

## لامبدا

طريقة أفضل لاستخدام الدوال في الخرائط والفلاتر هي استخدام تعبير لامبدا (المعروف أحيانًا بالدالة غير المسماة). على سبيل المثال:

```shell
let Plus = {x,y -> x + y}
echo Plus(1,2)
" returns 3

let Tasty = { -> 'tasty'}
echo Tasty()
" returns "tasty"
```

يمكنك استدعاء دالة من داخل تعبير لامبدا:

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

إذا كنت لا تريد استدعاء الدالة من داخل لامبدا، يمكنك إعادة هيكلتها:

```shell
let day_meals = map(lunch_items, {index, item -> "I am having " . item . " for lunch"})
```

## سلسلة الأساليب

يمكنك ربط عدة دوال Vimscript وتعبيرات لامبدا بالتتابع باستخدام `->`. تذكر أن `->` يجب أن يتبعها اسم دالة *بدون فراغ*.

```shell
Source->Method1()->Method2()->...->MethodN()
```

لتحويل عدد عشري إلى رقم باستخدام سلسلة الأساليب:

```shell
echo 3.14->float2nr()
" returns 3
```

دعنا نقوم بمثال أكثر تعقيدًا. افترض أنك بحاجة إلى تحويل الحرف الأول من كل عنصر في قائمة إلى حرف كبير، ثم ترتيب القائمة، ثم دمج القائمة لتشكيل سلسلة.

```shell
function! Capitalizer(word)
  return substitute(a:word, "\^\.", "\\u&", "g")
endfunction

function! CapitalizeList(word_list)
  return map(a:word_list, {index, word -> Capitalizer(word)})
endfunction

let dinner_items = ["bruschetta", "antipasto", "calzone"]

echo dinner_items->CapitalizeList()->sort()->join(", ")
" returns "Antipasto, Bruschetta, Calzone"
```

مع سلسلة الأساليب، يكون التسلسل أكثر سهولة في القراءة والفهم. يمكنني فقط إلقاء نظرة على `dinner_items->CapitalizeList()->sort()->join(", ")` وأعرف بالضبط ما يحدث.

## الإغلاق

عند تعريف متغير داخل دالة، يكون ذلك المتغير موجودًا ضمن حدود تلك الدالة. يُطلق على ذلك نطاقًا لغويًا.

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch()
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

`appetizer` يتم تعريفه داخل دالة `Lunch`، التي تعيد funcref لـ `SecondLunch`. لاحظ أن `SecondLunch` تستخدم `appetizer`، ولكن في Vimscript، ليس لديها وصول إلى ذلك المتغير. إذا حاولت تشغيل `echo Lunch()()`, فإن Vim سيظهر خطأ متغير غير معرف.

لإصلاح هذه المشكلة، استخدم كلمة `closure`. دعنا نعيد هيكلتها:

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch() closure
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

الآن إذا قمت بتشغيل `echo Lunch()()`, فإن Vim سيعيد "shrimp".

## تعلم دوال Vimscript بالطريقة الذكية

في هذا الفصل، تعلمت تشريح دالة Vim. تعلمت كيفية استخدام كلمات خاصة مختلفة `range`، `dict`، و `closure` لتعديل سلوك الدالة. كما تعلمت كيفية استخدام لامبدا وسلسلة دوال متعددة معًا. الدوال هي أدوات مهمة لإنشاء تجريدات معقدة.

التالي، دعنا نجمع كل ما تعلمته معًا لصنع ملحق خاص بك.