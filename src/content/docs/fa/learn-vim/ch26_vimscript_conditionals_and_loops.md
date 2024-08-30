---
description: این سند به آموزش استفاده از انواع داده‌ها در Vimscript برای نوشتن شرط‌ها
  و حلقه‌ها می‌پردازد و اپراتورهای رابطه‌ای را معرفی می‌کند.
title: Ch26. Vimscript Conditionals and Loops
---

پس از یادگیری اینکه انواع داده‌های پایه چیستند، مرحله بعدی یادگیری نحوه ترکیب آن‌ها برای شروع نوشتن یک برنامه پایه است. یک برنامه پایه شامل شرط‌ها و حلقه‌ها می‌باشد.

در این فصل، شما یاد خواهید گرفت که چگونه از انواع داده‌های Vimscript برای نوشتن شرط‌ها و حلقه‌ها استفاده کنید.

## عملگرهای رابطه‌ای

عملگرهای رابطه‌ای Vimscript مشابه بسیاری از زبان‌های برنامه‌نویسی هستند:

```shell
a == b		equal to
a != b		not equal to
a >  b		greater than
a >= b		greater than or equal to
a <  b		less than
a <= b		less than or equal to
```

به عنوان مثال:

```shell
:echo 5 == 5
:echo 5 != 5
:echo 10 > 5
:echo 10 >= 5
:echo 10 < 5
:echo 5 <= 5
```

به یاد داشته باشید که رشته‌ها در یک عبارت حسابی به اعداد تبدیل می‌شوند. در اینجا نیز Vim رشته‌ها را در یک عبارت برابری به اعداد تبدیل می‌کند. "5foo" به 5 تبدیل می‌شود (درست):

```shell
:echo 5 == "5foo"
" returns true
```

همچنین به یاد داشته باشید که اگر یک رشته را با یک کاراکتر غیر عددی مانند "foo5" شروع کنید، رشته به عدد 0 (نادرست) تبدیل می‌شود.

```shell
echo 5 == "foo5"
" returns false
```

### عملگرهای منطقی رشته

Vim عملگرهای رابطه‌ای بیشتری برای مقایسه رشته‌ها دارد:

```shell
a =~ b
a !~ b
```

به عنوان مثال:

```shell
let str = "hearty breakfast"

echo str =~ "hearty"
" returns true

echo str =~ "dinner"
" returns false

echo str !~ "dinner"
" returns true
```

عملگر `=~` یک تطابق regex را در برابر رشته داده شده انجام می‌دهد. در مثال بالا، `str =~ "hearty"` درست است زیرا `str` *شامل* الگوی "hearty" است. شما همیشه می‌توانید از `==` و `!=` استفاده کنید، اما استفاده از آن‌ها عبارت را در برابر کل رشته مقایسه می‌کند. `=~` و `!~` انتخاب‌های انعطاف‌پذیرتری هستند.

```shell
echo str == "hearty"
" returns false

echo str == "hearty breakfast"
" returns true
```

بیایید این را امتحان کنیم. به حرف بزرگ "H" توجه کنید:

```shell
echo str =~ "Hearty"
" true
```

این درست است حتی اگر "Hearty" با حروف بزرگ نوشته شده باشد. جالب است... به نظر می‌رسد تنظیمات Vim من به گونه‌ای تنظیم شده که به حروف بزرگ و کوچک توجه نکند (`set ignorecase`)، بنابراین وقتی Vim برای برابری بررسی می‌کند، از تنظیمات Vim من استفاده می‌کند و به حروف بزرگ و کوچک توجه نمی‌کند. اگر بخواهم توجه به حروف بزرگ و کوچک را خاموش کنم (`set noignorecase`)، مقایسه اکنون نادرست است.

```shell
set noignorecase
echo str =~ "Hearty"
" returns false because case matters

set ignorecase
echo str =~ "Hearty"
" returns true because case doesn't matter
```

اگر شما یک پلاگین برای دیگران می‌نویسید، این یک وضعیت دشوار است. آیا کاربر از `ignorecase` یا `noignorecase` استفاده می‌کند؟ شما قطعاً نمی‌خواهید کاربران خود را مجبور کنید که گزینه توجه به حروف بزرگ و کوچک را تغییر دهند. پس چه کار می‌کنید؟

خوشبختانه، Vim یک عملگر دارد که می‌تواند *همیشه* به حروف بزرگ و کوچک توجه کند یا آن‌ها را نادیده بگیرد. برای همیشه توجه به حروف بزرگ و کوچک، یک `#` در انتها اضافه کنید.

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

برای اینکه همیشه به حروف بزرگ و کوچک توجه نکنید، آن را با `?` ضمیمه کنید:

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

من ترجیح می‌دهم از `#` برای همیشه توجه به حروف بزرگ و کوچک استفاده کنم و در سمت ایمن باشم.

## اگر

حالا که شما عبارات برابری Vim را دیده‌اید، بیایید به یک عملگر شرطی بنیادی، یعنی دستور `if` بپردازیم.

حداقل، نحو آن به این صورت است:

```shell
if {clause}
  {some expression}
endif
```

شما می‌توانید تحلیل حالت را با `elseif` و `else` گسترش دهید.

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

به عنوان مثال، پلاگین [vim-signify](https://github.com/mhinz/vim-signify) بسته به تنظیمات Vim شما از یک روش نصب متفاوت استفاده می‌کند. در زیر دستورالعمل نصب از `readme` آن‌ها با استفاده از دستور `if` آمده است:

```shell
if has('nvim') || has('patch-8.0.902')
  Plug 'mhinz/vim-signify'
else
  Plug 'mhinz/vim-signify', { 'branch': 'legacy' }
endif
```

## عبارت سه‌گانه

Vim یک عبارت سه‌گانه برای تحلیل حالت یک خطی دارد:

```shell
{predicate} ? expressiontrue : expressionfalse
```

به عنوان مثال:

```shell
echo 1 ? "I am true" : "I am false"
```

از آنجا که 1 درست است، Vim "I am true" را چاپ می‌کند. فرض کنید می‌خواهید به طور شرطی `background` را به تیره تنظیم کنید اگر از ساعت خاصی در Vim استفاده می‌کنید. این را به vimrc اضافه کنید:

```shell
let &background = strftime("%H") < 18 ? "light" : "dark"
```

`&background` گزینه `'background'` در Vim است. `strftime("%H")` زمان فعلی را به ساعت برمی‌گرداند. اگر هنوز ساعت 6 بعدازظهر نشده باشد، از پس‌زمینه روشن استفاده کنید. در غیر این صورت، از پس‌زمینه تیره استفاده کنید.

## یا

عملگر منطقی "یا" (`||`) مانند بسیاری از زبان‌های برنامه‌نویسی عمل می‌کند.

```shell
{عبارت نادرست}  || {عبارت نادرست}   false
{عبارت نادرست}  || {عبارت درست}  true
{عبارت درست} || {عبارت نادرست}   true
{عبارت درست} || {عبارت درست}  true
```

Vim عبارت را ارزیابی کرده و یا 1 (درست) یا 0 (نادرست) را برمی‌گرداند.

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

اگر عبارت فعلی به درستی ارزیابی شود، عبارت بعدی ارزیابی نخواهد شد.

```shell
let one_dozen = 12

echo one_dozen || two_dozen
" returns 1

echo two_dozen || one_dozen
" returns error
```

به یاد داشته باشید که `two_dozen` هرگز تعریف نشده است. عبارت `one_dozen || two_dozen` هیچ خطایی ایجاد نمی‌کند زیرا `one_dozen` ابتدا ارزیابی می‌شود و به عنوان درست شناخته می‌شود، بنابراین Vim `two_dozen` را ارزیابی نمی‌کند.

## و

عملگر منطقی "و" (`&&`) مکمل عملگر منطقی یا است.

```shell
{عبارت نادرست}  && {عبارت نادرست}   false
{عبارت نادرست}  && {عبارت درست}  false
{عبارت درست} && {عبارت نادرست}   false
{عبارت درست} && {عبارت درست}  true
```

به عنوان مثال:

```shell
echo 0 && 0
" returns 0

echo 0 && 10
" returns 0
```

`&&` یک عبارت را تا زمانی که اولین عبارت نادرست را ببیند، ارزیابی می‌کند. به عنوان مثال، اگر شما `true && true` داشته باشید، هر دو را ارزیابی کرده و `true` را برمی‌گرداند. اگر شما `true && false && true` داشته باشید، ابتدا `true` اول را ارزیابی کرده و در اولین `false` متوقف می‌شود. این سومین `true` را ارزیابی نخواهد کرد.

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

## برای

حلقه `for` معمولاً با نوع داده لیست استفاده می‌شود.

```shell
let breakfasts = ["pancakes", "waffles", "eggs"]

for breakfast in breakfasts
  echo breakfast
endfor
```

این با لیست‌های تو در تو کار می‌کند:

```shell
let meals = [["breakfast", "pancakes"], ["lunch", "fish"], ["dinner", "pasta"]]

for [meal_type, food] in meals
  echo "I am having " . food . " for " . meal_type
endfor
```

شما به طور تکنیکی می‌توانید از حلقه `for` با یک دیکشنری با استفاده از متد `keys()` استفاده کنید.

```shell
let beverages = #{breakfast: "milk", lunch: "orange juice", dinner: "water"}
for beverage_type in keys(beverages)
  echo "I am drinking " . beverages[beverage_type] . " for " . beverage_type
endfor
```

## در حالی که

حلقه رایج دیگر، حلقه `while` است.

```shell
let counter = 1
while counter < 5
  echo "Counter is: " . counter
  let counter += 1
endwhile
```

برای دریافت محتوای خط فعلی تا آخرین خط:

```shell
let current_line = line(".")
let last_line = line("$")

while current_line <= last_line
  echo getline(current_line)
  let current_line += 1
endwhile
```

## مدیریت خطا

اغلب برنامه شما به گونه‌ای که انتظار دارید اجرا نمی‌شود. در نتیجه، شما را به چالش می‌کشد (با عرض پوزش از بازی با کلمات). چیزی که شما نیاز دارید، یک مدیریت خطای مناسب است.

### شکستن

زمانی که شما از `break` در داخل یک حلقه `while` یا `for` استفاده می‌کنید، حلقه متوقف می‌شود.

برای دریافت متن‌ها از ابتدای فایل تا خط فعلی، اما متوقف شدن زمانی که کلمه "donut" را می‌بینید:

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

اگر شما متن زیر را داشته باشید:

```shell
one
two
three
donut
four
five
```

اجرای حلقه `while` بالا "one two three" را می‌دهد و نه بقیه متن را زیرا حلقه زمانی که "donut" را مطابقت می‌دهد، متوقف می‌شود.

### ادامه

روش `continue` مشابه `break` است، که در طول یک حلقه فراخوانی می‌شود. تفاوت این است که به جای اینکه از حلقه خارج شود، فقط آن تکرار فعلی را رد می‌کند.

فرض کنید شما همان متن را دارید اما به جای `break`، از `continue` استفاده می‌کنید:

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

این بار `one two three four five` را برمی‌گرداند. این خطی که کلمه "donut" را دارد، رد می‌شود، اما حلقه ادامه می‌یابد.
### تلاش، در نهایت و گرفتن

Vim دارای `try`، `finally` و `catch` برای مدیریت خطاها است. برای شبیه‌سازی یک خطا، می‌توانید از دستور `throw` استفاده کنید.

```shell
try
  echo "تلاش"
  throw "نه"
endtry
```

این را اجرا کنید. Vim با خطای `"Exception not caught: نه` شکایت خواهد کرد.

حالا یک بلوک catch اضافه کنید:

```shell
try
  echo "تلاش"
  throw "نه"
catch
  echo "گرفته شد"
endtry
```

حالا دیگر هیچ خطایی وجود ندارد. شما باید "تلاش" و "گرفته شد" را مشاهده کنید.

بیایید `catch` را حذف کنیم و یک `finally` اضافه کنیم:

```shell
try
  echo "تلاش"
  throw "نه"
  echo "شما من را نخواهید دید"
finally
  echo "در نهایت"
endtry
```

این را اجرا کنید. حالا Vim خطا و "در نهایت" را نمایش می‌دهد.

بیایید همه آنها را با هم قرار دهیم:

```shell
try
  echo "تلاش"
  throw "نه"
catch
  echo "گرفته شد"
finally
  echo "در نهایت"
endtry
```

این بار Vim هم "گرفته شد" و هم "در نهایت" را نمایش می‌دهد. هیچ خطایی نمایش داده نمی‌شود زیرا Vim آن را گرفت.

خطاها از مکان‌های مختلفی ناشی می‌شوند. منبع دیگری از خطا، فراخوانی یک تابع غیرموجود است، مانند `Nope()` در زیر:

```shell
try
  echo "تلاش"
  call Nope()
catch
  echo "گرفته شد"
finally
  echo "در نهایت"
endtry
```

تفاوت بین `catch` و `finally` این است که `finally` همیشه اجرا می‌شود، چه خطا باشد و چه نباشد، در حالی که `catch` فقط زمانی اجرا می‌شود که کد شما دچار خطا شود.

شما می‌توانید خطای خاصی را با `:catch` بگیرید. طبق `:h :catch`:

```shell
catch /^Vim:Interrupt$/.             " گرفتن وقفه‌ها (CTRL-C)
catch /^Vim\\%((\\a\\+)\\)\\=:E/.    " گرفتن تمام خطاهای Vim
catch /^Vim\\%((\\a\\+)\\)\\=:/.     " گرفتن خطاها و وقفه‌ها
catch /^Vim(write):/.                " گرفتن تمام خطاها در :write
catch /^Vim\\%((\\a\\+)\\)\\=:E123:/ " گرفتن خطای E123
catch /my-exception/.                " گرفتن استثنای کاربر
catch /.*/                           " گرفتن همه چیز
catch.                               " همانند /.*/
```

درون یک بلوک `try`، یک وقفه به عنوان یک خطای قابل گرفتن در نظر گرفته می‌شود.

```shell
try
  catch /^Vim:Interrupt$/
  sleep 100
endtry
```

در vimrc شما، اگر از یک رنگ‌ساز سفارشی استفاده کنید، مانند [gruvbox](https://github.com/morhetz/gruvbox)، و به طور تصادفی دایرکتوری رنگ‌ساز را حذف کنید اما هنوز خط `colorscheme gruvbox` را در vimrc خود داشته باشید، Vim هنگام `source` آن خطا خواهد داد. برای رفع این مشکل، من این را به vimrc خود اضافه کردم:

```shell
try
  colorscheme gruvbox
catch
  colorscheme default
endtry
```

حالا اگر شما vimrc را بدون دایرکتوری `gruvbox` `source` کنید، Vim از `colorscheme default` استفاده خواهد کرد.

## یادگیری شرط‌ها به شیوه هوشمند

در فصل قبلی، شما با انواع داده‌های پایه Vim آشنا شدید. در این فصل، شما یاد گرفتید که چگونه آنها را ترکیب کنید تا برنامه‌های پایه‌ای با استفاده از شرط‌ها و حلقه‌ها بنویسید. اینها بلوک‌های سازنده برنامه‌نویسی هستند.

حالا بیایید درباره دامنه‌های متغیرها یاد بگیریم.