---
description: این سند به بررسی نحوه کارکرد توابع در Vimscript می‌پردازد و قواعد نحوه
  تعریف توابع را به صورت دقیق توضیح می‌دهد.
title: Ch28. Vimscript Functions
---

توابع ابزارهای انتزاع هستند و سومین عنصر در یادگیری یک زبان جدید به شمار می‌روند.

در فصل‌های قبلی، شما توابع بومی Vimscript (`len()`, `filter()`, `map()`, و غیره) و توابع سفارشی را مشاهده کرده‌اید. در این فصل، عمیق‌تر به بررسی نحوه کار توابع خواهیم پرداخت.

## قوانین نحوی تابع

در هسته، یک تابع Vimscript دارای نحو زیر است:

```shell
function {FunctionName}()
  {do-something}
endfunction
```

تعریف یک تابع باید با حرف بزرگ آغاز شود. این تابع با کلیدواژه `function` شروع می‌شود و با `endfunction` به پایان می‌رسد. در زیر یک تابع معتبر آورده شده است:

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

تابع زیر معتبر نیست زیرا با حرف بزرگ شروع نمی‌شود.

```shell
function tasty()
  echo "Tasty"
endfunction
```

اگر یک تابع را با متغیر اسکریپت (`s:`) پیشوند بزنید، می‌توانید از آن با حروف کوچک استفاده کنید. `function s:tasty()` یک نام معتبر است. دلیل اینکه Vim از شما می‌خواهد که از نام‌های بزرگ استفاده کنید، جلوگیری از سردرگمی با توابع داخلی Vim (همه حروف کوچک) است.

نام تابع نمی‌تواند با یک عدد شروع شود. `1Tasty()` یک نام تابع معتبر نیست، اما `Tasty1()` معتبر است. یک تابع همچنین نمی‌تواند شامل کاراکترهای غیر الفبایی به جز `_` باشد. `Tasty-food()`, `Tasty&food()`, و `Tasty.food()` نام‌های تابع معتبری نیستند. `Tasty_food()` *هست*.

اگر دو تابع با همان نام تعریف کنید، Vim خطایی را نشان می‌دهد که می‌گوید تابع `Tasty` قبلاً وجود دارد. برای بازنویسی تابع قبلی با همان نام، یک `!` بعد از کلیدواژه `function` اضافه کنید.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

## فهرست توابع موجود

برای مشاهده تمام توابع داخلی و سفارشی در Vim، می‌توانید دستور `:function` را اجرا کنید. برای مشاهده محتوای تابع `Tasty`، می‌توانید دستور `:function Tasty` را اجرا کنید.

شما همچنین می‌توانید با الگو توابع را جستجو کنید با `:function /pattern`، مشابه ناوبری جستجوی Vim (`/pattern`). برای جستجوی تمام توابعی که شامل عبارت "map" هستند، دستور `:function /map` را اجرا کنید. اگر از پلاگین‌های خارجی استفاده می‌کنید، Vim توابع تعریف‌شده در آن پلاگین‌ها را نمایش می‌دهد.

اگر می‌خواهید ببینید یک تابع از کجا منشا می‌گیرد، می‌توانید از دستور `:verbose` با دستور `:function` استفاده کنید. برای مشاهده اینکه تمام توابع حاوی کلمه "map" از کجا منشا می‌گیرند، دستور زیر را اجرا کنید:

```shell
:verbose function /map
```

زمانی که من این را اجرا کردم، تعدادی نتیجه دریافت کردم. این یکی به من می‌گوید که تابع `fzf#vim#maps` تابع بارگذاری خودکار (برای یادآوری، به فصل 23 مراجعه کنید) در فایل `~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim`، در خط 1263 نوشته شده است. این برای اشکال‌زدایی مفید است.

```shell
function fzf#vim#maps(mode, ...)
        Last set from ~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim line 1263
```

## حذف یک تابع

برای حذف یک تابع موجود، از `:delfunction {Function_name}` استفاده کنید. برای حذف `Tasty`، دستور `:delfunction Tasty` را اجرا کنید.

## مقدار بازگشتی تابع

برای اینکه یک تابع مقداری را بازگرداند، باید یک مقدار `return` صریح به آن بدهید. در غیر این صورت، Vim به طور خودکار یک مقدار ضمنی 0 را باز می‌گرداند.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

یک `return` خالی نیز معادل با یک مقدار 0 است.

```shell
function! Tasty()
  echo "Tasty"
  return
endfunction
```

اگر شما `:echo Tasty()` را با استفاده از تابع بالا اجرا کنید، پس از اینکه Vim "Tasty" را نمایش می‌دهد، 0، مقدار بازگشتی ضمنی را باز می‌گرداند. برای اینکه `Tasty()` مقدار "Tasty" را بازگرداند، می‌توانید این کار را انجام دهید:

```shell
function! Tasty()
  return "Tasty"
endfunction
```

اکنون زمانی که شما `:echo Tasty()` را اجرا می‌کنید، رشته "Tasty" را باز می‌گرداند.

شما می‌توانید از یک تابع درون یک عبارت استفاده کنید. Vim از مقدار بازگشتی آن تابع استفاده خواهد کرد. عبارت `:echo Tasty() . " Food!"` خروجی "Tasty Food!" را تولید می‌کند.

## آرگومان‌های رسمی

برای ارسال یک آرگومان رسمی `food` به تابع `Tasty` خود، می‌توانید این کار را انجام دهید:

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

echo Tasty("pastry")
" returns "Tasty pastry"
```

`a:` یکی از دامنه‌های متغیر است که در فصل گذشته ذکر شد. این متغیر پارامتر رسمی است. این روش Vim برای دریافت مقدار پارامتر رسمی در یک تابع است. بدون آن، Vim خطایی را نشان می‌دهد:

```shell
function! Tasty(food)
  return "Tasty " . food
endfunction

echo Tasty("pasta")
" returns "undefined variable name" error
```

## متغیر محلی تابع

بیایید به متغیر دیگری که در فصل قبلی یاد نگرفته‌اید، بپردازیم: متغیر محلی تابع (`l:`).

هنگام نوشتن یک تابع، می‌توانید یک متغیر را درون آن تعریف کنید:

```shell
function! Yummy()
  let location = "tummy"
  return "Yummy in my " . location
endfunction

echo Yummy()
" returns "Yummy in my tummy"
```

در این زمینه، متغیر `location` همانند `l:location` است. وقتی شما یک متغیر را در یک تابع تعریف می‌کنید، آن متغیر *محلی* به آن تابع است. وقتی یک کاربر `location` را می‌بیند، ممکن است به راحتی آن را به عنوان یک متغیر جهانی اشتباه بگیرد. من ترجیح می‌دهم که بیشتر توضیح دهم، بنابراین ترجیح می‌دهم `l:` را قرار دهم تا نشان دهم که این یک متغیر تابع است.

دلیل دیگری برای استفاده از `l:count` این است که Vim متغیرهای خاصی با نام‌های مستعار دارد که شبیه متغیرهای معمولی به نظر می‌رسند. `v:count` یک مثال است. این دارای نام مستعار `count` است. در Vim، فراخوانی `count` همانند فراخوانی `v:count` است. به راحتی می‌توان یکی از این متغیرهای خاص را به اشتباه فراخوانی کرد.

```shell
function! Calories()
  let count = "count"
  return "I do not " . count . " my calories"
endfunction

echo Calories()
" throws an error
```

اجرای بالا یک خطا را نشان می‌دهد زیرا `let count = "Count"` به طور ضمنی سعی می‌کند متغیر خاص Vim `v:count` را دوباره تعریف کند. به یاد داشته باشید که متغیرهای خاص (`v:`) فقط خواندنی هستند. شما نمی‌توانید آن را تغییر دهید. برای اصلاح آن، از `l:count` استفاده کنید:

```shell
function! Calories()
  let l:count = "count"
  return "I do not " . l:count . " my calories"
endfunction

echo Calories()
" returns "I do not count my calories"
```

## فراخوانی یک تابع

Vim دارای دستور `:call` برای فراخوانی یک تابع است.

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

call Tasty("gravy")
```

دستور `call` مقدار بازگشتی را خروجی نمی‌دهد. بیایید آن را با `echo` فراخوانی کنیم.

```shell
echo call Tasty("gravy")
```

اوه، شما یک خطا دریافت می‌کنید. دستور `call` بالا یک دستور خط فرمان (`:call`) است. دستور `echo` بالا نیز یک دستور خط فرمان (`:echo`) است. شما نمی‌توانید یک دستور خط فرمان را با یک دستور خط فرمان دیگر فراخوانی کنید. بیایید یک طعم متفاوت از دستور `call` را امتحان کنیم:

```shell
echo call("Tasty", ["gravy"])
" returns "Tasty gravy"
```

برای روشن شدن هرگونه سردرگمی، شما در حال حاضر از دو دستور `call` متفاوت استفاده کرده‌اید: دستور خط فرمان `:call` و تابع `call()`. تابع `call()` به عنوان اولین آرگومان نام تابع (رشته) و به عنوان دومین آرگومان پارامترهای رسمی (لیست) را می‌پذیرد.

برای یادگیری بیشتر در مورد `:call` و `call()`، به `:h call()` و `:h :call` مراجعه کنید.

## آرگومان پیش‌فرض

شما می‌توانید یک پارامتر تابع را با یک مقدار پیش‌فرض با `=` فراهم کنید. اگر شما `Breakfast` را تنها با یک آرگومان فراخوانی کنید، آرگومان `beverage` از مقدار پیش‌فرض "milk" استفاده خواهد کرد.

```shell
function! Breakfast(meal, beverage = "Milk")
  return "I had " . a:meal . " and " . a:beverage . " for breakfast"
endfunction

echo Breakfast("Hash Browns")
" returns I had hash browns and milk for breakfast

echo Breakfast("Cereal", "Orange Juice")
" returns I had Cereal and Orange Juice for breakfast
```

## آرگومان‌های متغیر

شما می‌توانید یک آرگومان متغیر را با سه نقطه (`...`) ارسال کنید. آرگومان متغیر زمانی مفید است که شما نمی‌دانید چند متغیر را کاربر خواهد داد.

فرض کنید شما در حال ایجاد یک بوفه "هر چه می‌خواهید بخورید" هستید (هرگز نمی‌دانید مشتری شما چقدر غذا خواهد خورد):

```shell
function! Buffet(...)
  return a:1
endfunction
```

اگر شما `echo Buffet("Noodles")` را اجرا کنید، خروجی "Noodles" خواهد بود. Vim از `a:1` برای چاپ *اولین* آرگومان ارسال شده به `...` استفاده می‌کند، تا 20 (`a:1` اولین آرگومان، `a:2` دومین آرگومان و غیره). اگر شما `echo Buffet("Noodles", "Sushi")` را اجرا کنید، هنوز فقط "Noodles" را نمایش می‌دهد، بیایید آن را به‌روزرسانی کنیم:

```shell
function! Buffet(...)
  return a:1 . " " . a:2
endfunction

echo Buffet("Noodles", "Sushi")
" returns "Noodles Sushi"
```

مشکل با این روش این است که اگر اکنون `echo Buffet("Noodles")` را اجرا کنید (با تنها یک متغیر)، Vim شکایت می‌کند که متغیر `a:2` تعریف نشده است. چگونه می‌توانید آن را به اندازه کافی انعطاف‌پذیر کنید تا دقیقاً آنچه را که کاربر می‌دهد نمایش دهد؟

خوشبختانه، Vim یک متغیر خاص `a:0` دارد که *تعداد* آرگومان‌های ارسال شده به `...` را نمایش می‌دهد.

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

با این، شما می‌توانید با استفاده از طول آرگومان تکرار کنید.

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

آکولادهای `a:{l:food_counter}` یک رشته‌سازی است، که از مقدار شمارنده `food_counter` برای فراخوانی آرگومان‌های پارامتر رسمی `a:1`، `a:2`، `a:3` و غیره استفاده می‌کند.

```shell
echo Buffet("Noodles")
" returns "Noodles"

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returns everything you passed: "Noodles Sushi Ice cream Tofu Mochi"
```

آرگومان متغیر یک متغیر خاص دیگر نیز دارد: `a:000`. این دارای مقدار تمام آرگومان‌های متغیر در فرمت لیست است.

```shell
function! Buffet(...)
  return a:000
endfunction

echo Buffet("Noodles")
" returns ["Noodles"]

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returns ["Noodles", "Sushi", "Ice cream", "Tofu", "Mochi"]
```

بیایید تابع را برای استفاده از یک حلقه `for` بازنویسی کنیم:

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
## دامنه

شما می‌توانید یک تابع *دامنه‌دار* Vimscript را با افزودن کلمه کلیدی `range` در انتهای تعریف تابع تعریف کنید. یک تابع دامنه‌دار دو متغیر ویژه در دسترس دارد: `a:firstline` و `a:lastline`.

```shell
function! Breakfast() range
  echo a:firstline
  echo a:lastline
endfunction
```

اگر در خط 100 باشید و `call Breakfast()` را اجرا کنید، 100 برای هر دو `firstline` و `lastline` نمایش داده می‌شود. اگر خطوط 101 تا 105 را به صورت بصری هایلایت کنید (`v`، `V` یا `Ctrl-V`) و `call Breakfast()` را اجرا کنید، `firstline` 101 و `lastline` 105 را نمایش می‌دهد. `firstline` و `lastline` حداقل و حداکثر دامنه‌ای را که تابع در آن فراخوانی شده است نمایش می‌دهند.

شما همچنین می‌توانید از `:call` و ارسال یک دامنه استفاده کنید. اگر `:11,20call Breakfast()` را اجرا کنید، 11 برای `firstline` و 20 برای `lastline` نمایش داده می‌شود.

شاید بپرسید، "خوب است که تابع Vimscript دامنه را می‌پذیرد، اما آیا نمی‌توانم شماره خط را با `line(".")` بگیرم؟ آیا این کار همان کار را انجام نمی‌دهد؟"

سوال خوبی است. اگر منظور شما این باشد:

```shell
function! Breakfast()
  echo line(".")
endfunction
```

فراخوانی `:11,20call Breakfast()` تابع `Breakfast` را 10 بار اجرا می‌کند (یک بار برای هر خط در دامنه). مقایسه کنید اگر آرگومان `range` را ارسال کرده باشید:

```shell
function! Breakfast() range
  echo line(".")
endfunction
```

فراخوانی `11,20call Breakfast()` تابع `Breakfast` را *یک بار* اجرا می‌کند.

اگر کلمه کلیدی `range` را ارسال کنید و یک دامنه عددی (مانند `11,20`) را در `call` ارسال کنید، Vim تنها یک بار آن تابع را اجرا می‌کند. اگر کلمه کلیدی `range` را ارسال نکنید و یک دامنه عددی (مانند `11,20`) را در `call` ارسال کنید، Vim آن تابع را N بار بسته به دامنه اجرا می‌کند (در این مورد، N = 10).

## دیکشنری

شما می‌توانید یک تابع را به عنوان یک آیتم دیکشنری با افزودن کلمه کلیدی `dict` هنگام تعریف یک تابع اضافه کنید.

اگر تابعی به نام `SecondBreakfast` داشته باشید که هر آیتم `breakfast` را که دارید برمی‌گرداند:

```shell
function! SecondBreakfast() dict
  return self.breakfast
endfunction
```

بیایید این تابع را به دیکشنری `meals` اضافه کنیم:

```shell
let meals = {"breakfast": "pancakes", "second_breakfast": function("SecondBreakfast"), "lunch": "pasta"}

echo meals.second_breakfast()
" returns "pancakes"
```

با کلمه کلیدی `dict`، متغیر کلیدی `self` به دیکشنری که تابع در آن ذخیره شده است اشاره می‌کند (در این مورد، دیکشنری `meals`). عبارت `self.breakfast` برابر با `meals.breakfast` است.

یک روش جایگزین برای افزودن یک تابع به یک شیء دیکشنری استفاده از فضای نام است.

```shell
function! meals.second_lunch()
  return self.lunch
endfunction

echo meals.second_lunch()
" returns "pasta"
```

با فضای نام، نیازی به استفاده از کلمه کلیدی `dict` نیست.

## Funcref

یک funcref ارجاعی به یک تابع است. این یکی از انواع داده‌های پایه Vimscript است که در فصل 24 ذکر شده است.

عبارت `function("SecondBreakfast")` در بالا یک مثال از funcref است. Vim یک تابع داخلی به نام `function()` دارد که یک funcref را زمانی که نام تابع (رشته) را به آن ارسال کنید، برمی‌گرداند.

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

در Vim، اگر بخواهید یک تابع را به یک متغیر اختصاص دهید، نمی‌توانید به سادگی آن را مستقیماً مانند `let MyVar = MyFunc` اختصاص دهید. شما باید از تابع `function()` استفاده کنید، مانند `let MyVar = function("MyFunc")`.

شما می‌توانید از funcref با نقشه‌ها و فیلترها استفاده کنید. توجه داشته باشید که نقشه‌ها و فیلترها یک ایندکس را به عنوان آرگومان اول و مقدار تکرار شده را به عنوان آرگومان دوم ارسال می‌کنند.

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

یک روش بهتر برای استفاده از توابع در نقشه‌ها و فیلترها استفاده از عبارت لامبدا (گاهی اوقات به عنوان تابع بدون نام شناخته می‌شود) است. به عنوان مثال:

```shell
let Plus = {x,y -> x + y}
echo Plus(1,2)
" returns 3

let Tasty = { -> 'tasty'}
echo Tasty()
" returns "tasty"
```

شما می‌توانید یک تابع را از داخل یک عبارت لامبدا فراخوانی کنید:

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

اگر نمی‌خواهید تابع را از داخل لامبدا فراخوانی کنید، می‌توانید آن را بازنویسی کنید:

```shell
let day_meals = map(lunch_items, {index, item -> "I am having " . item . " for lunch"})
```

## زنجیره‌سازی متد

شما می‌توانید چندین تابع Vimscript و عبارات لامبدا را به صورت متوالی با `->` زنجیره کنید. به یاد داشته باشید که `->` باید به دنبال یک نام متد *بدون فاصله* باشد.

```shell
Source->Method1()->Method2()->...->MethodN()
```

برای تبدیل یک عدد اعشاری به عدد با استفاده از زنجیره‌سازی متد:

```shell
echo 3.14->float2nr()
" returns 3
```

بیایید یک مثال پیچیده‌تر انجام دهیم. فرض کنید که شما نیاز دارید تا حرف اول هر آیتم در یک لیست را بزرگ کنید، سپس لیست را مرتب کنید، سپس لیست را به یک رشته تبدیل کنید.

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

با زنجیره‌سازی متد، توالی به راحتی خوانده و درک می‌شود. من می‌توانم به سادگی به `dinner_items->CapitalizeList()->sort()->join(", ")` نگاه کنم و دقیقاً بدانم چه اتفاقی در حال وقوع است.

## بستن

زمانی که شما یک متغیر را در داخل یک تابع تعریف می‌کنید، آن متغیر در محدوده آن تابع وجود دارد. این به عنوان دامنه واژگانی شناخته می‌شود.

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch()
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

`appetizer` در داخل تابع `Lunch` تعریف شده است، که funcref `SecondLunch` را برمی‌گرداند. توجه داشته باشید که `SecondLunch` از `appetizer` استفاده می‌کند، اما در Vimscript، به آن متغیر دسترسی ندارد. اگر سعی کنید `echo Lunch()()` را اجرا کنید، Vim یک خطای متغیر تعریف‌نشده را پرتاب می‌کند.

برای حل این مشکل، از کلمه کلیدی `closure` استفاده کنید. بیایید بازنویسی کنیم:

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch() closure
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

حالا اگر `echo Lunch()()` را اجرا کنید، Vim "shrimp" را برمی‌گرداند.

## یادگیری توابع Vimscript به روش هوشمند

در این فصل، شما آناتومی تابع Vim را یاد گرفتید. شما یاد گرفتید که چگونه از کلمات کلیدی ویژه مختلف `range`، `dict` و `closure` برای تغییر رفتار تابع استفاده کنید. همچنین یاد گرفتید که چگونه از لامبدا استفاده کنید و چندین تابع را با هم زنجیره کنید. توابع ابزارهای مهمی برای ایجاد انتزاعات پیچیده هستند.

در مرحله بعد، بیایید همه چیزهایی را که یاد گرفته‌اید با هم ترکیب کنیم تا پلاگین خود را بسازید.