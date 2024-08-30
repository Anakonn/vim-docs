---
description: این سند به معرفی زبان برنامه‌نویسی Vimscript و انواع داده‌های آن می‌پردازد
  و روش‌های استفاده از آن را در ویم آموزش می‌دهد.
title: Ch25. Vimscript Basic Data Types
---

در چند فصل آینده، شما با Vimscript، زبان برنامه‌نویسی داخلی Vim آشنا خواهید شد.

هنگام یادگیری یک زبان جدید، سه عنصر اساسی وجود دارد که باید به آن‌ها توجه کنید:
- ابتدایی‌ها
- وسایل ترکیب
- وسایل انتزاع

در این فصل، شما با انواع داده‌های ابتدایی Vim آشنا خواهید شد.

## انواع داده

Vim دارای 10 نوع داده مختلف است:
- عدد
- اعشاری
- رشته
- لیست
- دیکشنری
- خاص
- Funcref
- کار
- کانال
- Blob

من در اینجا به شش نوع داده اول می‌پردازم. در فصل 27، شما با Funcref آشنا خواهید شد. برای اطلاعات بیشتر در مورد انواع داده‌های Vim، به `:h variables` مراجعه کنید.

## دنبال کردن با حالت Ex

Vim به طور فنی یک REPL داخلی ندارد، اما یک حالت به نام Ex mode دارد که می‌توان از آن مانند یک REPL استفاده کرد. شما می‌توانید با `Q` یا `gQ` به حالت Ex بروید. حالت Ex مانند یک حالت خط فرمان گسترش یافته است (مثل تایپ کردن دستورات خط فرمان به صورت مداوم). برای خروج از حالت Ex، تایپ کنید `:visual`.

شما می‌توانید از `:echo` یا `:echom` در این فصل و فصل‌های بعدی Vimscript برای کدنویسی استفاده کنید. آن‌ها مانند `console.log` در JS یا `print` در Python هستند. دستور `:echo` عبارت ارزیابی شده‌ای که ارائه می‌دهید را چاپ می‌کند. دستور `:echom` همین کار را انجام می‌دهد، اما علاوه بر آن، نتیجه را در تاریخچه پیام‌ها ذخیره می‌کند.

```viml
:echom "hello echo message"
```

شما می‌توانید تاریخچه پیام‌ها را با استفاده از:

```shell
:messages
```

مشاهده کنید.

برای پاک کردن تاریخچه پیام‌های خود، دستور زیر را اجرا کنید:

```shell
:messages clear
```

## عدد

Vim دارای 4 نوع عدد مختلف است: اعشاری، شانزده‌ای، باینری و هشتایی. به هر حال، وقتی من از نوع داده عدد صحبت می‌کنم، معمولاً این به معنای نوع داده صحیح است. در این راهنما، من از اصطلاحات عدد و صحیح به طور متناوب استفاده می‌کنم.

### اعشاری

شما باید با سیستم اعشاری آشنا باشید. Vim اعشارهای مثبت و منفی را می‌پذیرد. 1، -1، 10 و غیره. در برنامه‌نویسی Vimscript، شما احتمالاً بیشتر اوقات از نوع اعشاری استفاده خواهید کرد.

### شانزده‌ای

اعداد شانزده‌ای با `0x` یا `0X` شروع می‌شوند. یادآور: He**x**adecimal.

### باینری

اعداد باینری با `0b` یا `0B` شروع می‌شوند. یادآور: **B**inary.

### هشتایی

اعداد هشتایی با `0`، `0o` و `0O` شروع می‌شوند. یادآور: **O**ctal.

### چاپ اعداد

اگر شما `echo` کنید یک عدد شانزده‌ای، باینری یا هشتایی، Vim به طور خودکار آن‌ها را به اعشاری تبدیل می‌کند.

```viml
:echo 42
" returns 42

:echo 052
" returns 42

:echo 0b101010
" returns 42

:echo 0x2A
" returns 42
```

### حقیقت و کذب

در Vim، مقدار 0 کاذب و تمام مقادیر غیر 0 حقیقی هستند.

دستور زیر هیچ چیزی را چاپ نخواهد کرد.

```viml
:if 0
:  echo "Nope"
:endif
```

اما این دستور خواهد بود:

```viml
:if 1
:  echo "Yes"
:endif
```

هر مقداری به جز 0 حقیقی است، از جمله اعداد منفی. 100 حقیقی است. -1 نیز حقیقی است.

### حساب عددی

اعداد می‌توانند برای اجرای عبارات حسابی استفاده شوند:

```viml
:echo 3 + 1
" returns 4

: echo 5 - 3
" returns 2

:echo 2 * 2
" returns 4

:echo 4 / 2
" returns 2
```

هنگام تقسیم یک عدد با باقی‌مانده، Vim باقی‌مانده را حذف می‌کند.

```viml
:echo 5 / 2
" returns 2 instead of 2.5
```

برای به دست آوردن نتیجه دقیق‌تر، شما باید از یک عدد اعشاری استفاده کنید.

## اعشاری

اعداد اعشاری اعدادی هستند که دارای اعشار هستند. دو روش برای نمایش اعداد اعشاری وجود دارد: نوتیشن نقطه‌ای (مانند 31.4) و نمایی (3.14e01). مشابه اعداد، شما می‌توانید از علامت‌های مثبت و منفی استفاده کنید:

```viml
:echo +123.4
" returns 123.4

:echo -1.234e2
" returns -123.4

:echo 0.25
" returns 0.25

:echo 2.5e-1
" returns 0.25
```

شما باید به یک عدد اعشاری نقطه و ارقام بعد از آن بدهید. `25e-2` (بدون نقطه) و `1234.` (دارای نقطه، اما بدون ارقام بعد از آن) هر دو اعداد اعشاری نامعتبر هستند.

### حساب اعشاری

هنگام انجام یک عبارت حسابی بین یک عدد و یک عدد اعشاری، Vim نتیجه را به یک عدد اعشاری تبدیل می‌کند.

```viml
:echo 5 / 2.0
" returns 2.5
```

حساب عدد اعشاری و عدد اعشاری به شما یک عدد اعشاری دیگر می‌دهد.

```shell
:echo 1.0 + 1.0
" returns 2.0
```

## رشته

رشته‌ها کاراکترهایی هستند که با نقل‌قول‌های دوتایی (`""`) یا نقل‌قول‌های تکی (`''`) احاطه شده‌اند. "Hello"، "123" و '123.4' نمونه‌هایی از رشته‌ها هستند.

### الحاق رشته

برای الحاق یک رشته در Vim، از عملگر `.` استفاده کنید.

```viml
:echo "Hello" . " world"
" returns "Hello world"
```

### حساب رشته

هنگامی که شما عملگرهای حسابی (`+ - * /`) را با یک عدد و یک رشته اجرا می‌کنید، Vim رشته را به یک عدد تبدیل می‌کند.

```viml
:echo "12 donuts" + 3
" returns 15
```

زمانی که Vim "12 donuts" را می‌بیند، 12 را از رشته استخراج کرده و آن را به عدد 12 تبدیل می‌کند. سپس جمع را انجام می‌دهد و 15 را برمی‌گرداند. برای اینکه این تبدیل رشته به عدد کار کند، کاراکتر عددی باید *کاراکتر اول* در رشته باشد.

دستور زیر کار نخواهد کرد زیرا 12 کاراکتر اول در رشته نیست:

```viml
:echo "donuts 12" + 3
" returns 3
```

این دستور نیز کار نخواهد کرد زیرا یک فضای خالی کاراکتر اول رشته است:

```viml
:echo " 12 donuts" + 3
" returns 3
```

این تبدیل حتی با دو رشته نیز کار می‌کند:

```shell
:echo "12 donuts" + "6 pastries"
" returns 18
```

این با هر عملگر حسابی کار می‌کند، نه فقط `+`:

```viml
:echo "12 donuts" * "5 boxes"
" returns 60

:echo "12 donuts" - 5
" returns 7

:echo "12 donuts" / "3 people"
" returns 4
```

یک ترفند جالب برای مجبور کردن تبدیل رشته به عدد این است که فقط 0 را اضافه کنید یا در 1 ضرب کنید:

```viml
:echo "12" + 0
" returns 12

:echo "12" * 1
" returns 12
```

زمانی که حساب در برابر یک عدد اعشاری در یک رشته انجام می‌شود، Vim آن را مانند یک عدد صحیح، نه یک عدد اعشاری، در نظر می‌گیرد:

```shell
:echo "12.0 donuts" + 12
" returns 24, not 24.0
```

### الحاق عدد و رشته

شما می‌توانید یک عدد را با عملگر نقطه (`.`) به یک رشته تبدیل کنید:

```viml
:echo 12 . "donuts"
" returns "12donuts"
```

این تبدیل فقط با نوع داده عددی کار می‌کند، نه اعشاری. این کار نخواهد کرد:

```shell
:echo 12.0 . "donuts"
" does not return "12.0donuts" but throws an error
```

### شرطی‌های رشته

به یاد داشته باشید که 0 کاذب و تمام اعداد غیر 0 حقیقی هستند. این موضوع همچنین در هنگام استفاده از رشته به عنوان شرطی نیز صادق است.

در دستور if زیر، Vim "12donuts" را به 12 تبدیل می‌کند، که حقیقی است:

```viml
:if "12donuts"
:  echo "Yum"
:endif
" returns "Yum"
```

از طرف دیگر، این کاذب است:

```viml
:if "donuts12"
:  echo "Nope"
:endif
" rerturns nothing
```

Vim "donuts12" را به 0 تبدیل می‌کند، زیرا کاراکتر اول عدد نیست.

### نقل‌قول‌های دوتایی در مقابل نقل‌قول‌های تکی

نقل‌قول‌های دوتایی رفتار متفاوتی نسبت به نقل‌قول‌های تکی دارند. نقل‌قول‌های تکی کاراکترها را به طور واقعی نمایش می‌دهند در حالی که نقل‌قول‌های دوتایی کاراکترهای خاص را می‌پذیرند.

کاراکترهای خاص چیستند؟ به نمایش newline و نقل‌قول‌های دوتایی توجه کنید:

```viml
:echo "hello\nworld"
" returns
" hello
" world

:echo "hello \"world\""
" returns "hello "world""
```

این را با نقل‌قول‌های تکی مقایسه کنید:

```shell
:echo 'hello\nworld'
" returns 'hello\nworld'

:echo 'hello \"world\"'
" returns 'hello \"world\"'
```

کاراکترهای خاص کاراکترهای خاص رشته هستند که وقتی فرار می‌شوند، رفتار متفاوتی دارند. `\n` مانند یک newline عمل می‌کند. `\"` مانند یک `"`. برای لیستی از سایر کاراکترهای خاص، به `:h expr-quote` مراجعه کنید.

### رویه‌های رشته

بیایید به برخی از رویه‌های داخلی رشته نگاه کنیم.

شما می‌توانید طول یک رشته را با `strlen()` به دست آورید.

```shell
:echo strlen("choco")
" returns 5
```

شما می‌توانید رشته را به یک عدد با `str2nr()` تبدیل کنید:

```shell
:echo str2nr("12donuts")
" returns 12

:echo str2nr("donuts12")
" returns 0
```

مشابه تبدیل رشته به عدد قبلی، اگر عدد کاراکتر اول نباشد، Vim آن را نخواهد گرفت.

خبر خوب این است که Vim یک متد دارد که رشته را به یک عدد اعشاری تبدیل می‌کند، `str2float()`:

```shell
:echo str2float("12.5donuts")
" returns 12.5
```

شما می‌توانید یک الگو را در یک رشته با متد `substitute()` جایگزین کنید:

```shell
:echo substitute("sweet", "e", "o", "g")
" returns "swoot"
```

پارامتر آخر، "g"، پرچم جهانی است. با آن، Vim تمام موارد مطابقت را جایگزین خواهد کرد. بدون آن، Vim فقط اولین تطابق را جایگزین خواهد کرد.

```shell
:echo substitute("sweet", "e", "o", "")
" returns "swoet"
```

دستور جایگزینی می‌تواند با `getline()` ترکیب شود. به یاد داشته باشید که تابع `getline()` متن را در شماره خط داده شده می‌گیرد. فرض کنید شما متن "chocolate donut" را در خط 5 دارید. شما می‌توانید از رویه زیر استفاده کنید:

```shell
:echo substitute(getline(5), "chocolate", "glazed", "g")
" returns glazed donut
```

رویه‌های رشته دیگری نیز وجود دارد. به `:h string-functions` مراجعه کنید.

## لیست

یک لیست Vimscript مانند یک آرایه در جاوااسکریپت یا لیست در پایتون است. این یک توالی *ترتیبی* از آیتم‌ها است. شما می‌توانید محتوا را با انواع داده‌های مختلف ترکیب کنید:

```shell
[1,2,3]
['a', 'b', 'c']
[1,'a', 3.14]
[1,2,[3,4]]
```

### زیرلیست‌ها

لیست Vim از صفر ایندکس شده است. شما می‌توانید به یک آیتم خاص در یک لیست با `[n]` دسترسی پیدا کنید، جایی که n ایندکس است.

```shell
:echo ["a", "sweet", "dessert"][0]
" returns "a"

:echo ["a", "sweet", "dessert"][2]
" returns "dessert"
```

اگر از حداکثر شماره ایندکس فراتر بروید، Vim خطایی خواهد داد که می‌گوید ایندکس خارج از محدوده است:

```shell
:echo ["a", "sweet", "dessert"][999]
" returns an error
```

زمانی که به زیر صفر بروید، Vim ایندکس را از آخرین عنصر شروع می‌کند. عبور از حداقل شماره ایندکس نیز خطا خواهد داد:

```shell
:echo ["a", "sweet", "dessert"][-1]
" returns "dessert"

:echo ["a", "sweet", "dessert"][-3]
" returns "a"

:echo ["a", "sweet", "dessert"][-999]
" returns an error
```

شما می‌توانید چندین عنصر را از یک لیست با `[n:m]` برش دهید، جایی که `n` ایندکس شروع و `m` ایندکس پایان است.

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:4]
" returns ["plain", "strawberry", "lemon"]
```

اگر `m` را ندهید (`[n:]`)، Vim باقی‌مانده عناصر را از عنصر nth به بعد برمی‌گرداند. اگر `n` را ندهید (`[:m]`)، Vim اولین عنصر را تا عنصر mام برمی‌گرداند.

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:]
" returns ['plain', 'strawberry', 'lemon', 'sugar', 'cream']

:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][:4]
" returns ['chocolate', 'glazed', 'plain', 'strawberry', 'lemon']
```

شما می‌توانید یک ایندکس که از حداکثر تعداد آیتم‌ها فراتر می‌رود را هنگام برش یک آرایه بدهید.

```viml
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:999]
" returns ['plain', 'strawberry', 'lemon', 'sugar', 'cream']
```
### برش رشته

شما می‌توانید رشته‌ها را مانند لیست‌ها برش داده و هدف‌گذاری کنید:

```viml
:echo "choco"[0]
" برمی‌گرداند "c"

:echo "choco"[1:3]
" برمی‌گرداند "hoc"

:echo "choco"[:3]
" برمی‌گرداند choc

:echo "choco"[1:]
" برمی‌گرداند hoco
```

### حساب لیست

شما می‌توانید از `+` برای الحاق و تغییر یک لیست استفاده کنید:

```viml
:let sweetList = ["chocolate", "strawberry"]
:let sweetList += ["sugar"]
:echo sweetList
" برمی‌گرداند ["chocolate", "strawberry", "sugar"]
```

### توابع لیست

بیایید توابع داخلی لیست در Vim را بررسی کنیم.

برای به‌دست‌آوردن طول یک لیست، از `len()` استفاده کنید:

```shell
:echo len(["chocolate", "strawberry"])
" برمی‌گرداند 2
```

برای اضافه کردن یک عنصر به ابتدای لیست، می‌توانید از `insert()` استفاده کنید:

```shell
:let sweetList = ["chocolate", "strawberry"]
:call insert(sweetList, "glazed")

:echo sweetList
" برمی‌گرداند ["glazed", "chocolate", "strawberry"]
```

شما همچنین می‌توانید به `insert()` ایندکسی را که می‌خواهید عنصر را به آن اضافه کنید، پاس دهید. اگر می‌خواهید یک مورد را قبل از عنصر دوم (ایندکس 1) اضافه کنید:

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call insert(sweeterList, "cream", 1)

:echo sweeterList
" برمی‌گرداند ['glazed', 'cream', 'chocolate', 'strawberry']
```

برای حذف یک مورد از لیست، از `remove()` استفاده کنید. این تابع یک لیست و ایندکس عنصر مورد نظر برای حذف را می‌پذیرد.

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call remove(sweeterList, 1)

:echo sweeterList
" برمی‌گرداند ['glazed', 'strawberry']
```

شما می‌توانید از `map()` و `filter()` بر روی یک لیست استفاده کنید. برای فیلتر کردن عناصری که شامل عبارت "choco" هستند:

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call filter(sweeterList, 'v:val !~ "choco"')
:echo sweeterList
" برمی‌گرداند ["glazed", "strawberry"]

:let sweetestList = ["chocolate", "glazed", "sugar"]
:call map(sweetestList, 'v:val . " donut"')
:echo sweetestList
" برمی‌گرداند ['chocolate donut', 'glazed donut', 'sugar donut']
```

متغیر `v:val` یک متغیر خاص در Vim است. این متغیر هنگام تکرار یک لیست یا دیکشنری با استفاده از `map()` یا `filter()` در دسترس است. این متغیر نمایانگر هر مورد تکرار شده است.

برای اطلاعات بیشتر، به `:h list-functions` مراجعه کنید.

### باز کردن لیست

شما می‌توانید یک لیست را باز کرده و متغیرهایی را به عناصر لیست اختصاص دهید:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let [flavor1, flavor2, flavor3] = favoriteFlavor

:echo flavor1
" برمی‌گرداند "chocolate"

:echo flavor2
" برمی‌گرداند "glazed"
```

برای اختصاص دادن بقیه عناصر لیست، می‌توانید از `;` به همراه یک نام متغیر استفاده کنید:

```shell
:let favoriteFruits = ["apple", "banana", "lemon", "blueberry", "raspberry"]
:let [fruit1, fruit2; restFruits] = favoriteFruits

:echo fruit1
" برمی‌گرداند "apple"

:echo restFruits
" برمی‌گرداند ['lemon', 'blueberry', 'raspberry']
```

### تغییر لیست

شما می‌توانید یک عنصر لیست را به‌طور مستقیم تغییر دهید:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[0] = "sugar"
:echo favoriteFlavor
" برمی‌گرداند ['sugar', 'glazed', 'plain']
```

شما می‌توانید چندین عنصر لیست را به‌طور مستقیم تغییر دهید:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[2:] = ["strawberry", "chocolate"]
:echo favoriteFlavor
" برمی‌گرداند ['chocolate', 'glazed', 'strawberry', 'chocolate']
```

## دیکشنری

یک دیکشنری در Vimscript یک لیست وابسته و بدون ترتیب است. یک دیکشنری غیر خالی شامل حداقل یک جفت کلید-مقدار است.

```shell
{"breakfast": "waffles", "lunch": "pancakes"}
{"meal": ["breakfast", "second breakfast", "third breakfast"]}
{"dinner": 1, "dessert": 2}
```

یک شیء داده دیکشنری در Vim از رشته برای کلید استفاده می‌کند. اگر سعی کنید از یک عدد استفاده کنید، Vim آن را به رشته تبدیل می‌کند.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}

:echo breakfastNo
" برمی‌گرداند {'1': '7am', '2': '9am', '11ses': '11am'}
```

اگر خیلی تنبل هستید که دور هر کلید علامت نقل قول بگذارید، می‌توانید از نگارش `#{}` استفاده کنید:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo mealPlans
" برمی‌گرداند {'lunch': 'pancakes', 'breakfast': 'waffles', 'dinner': 'donuts'}
```

تنها شرط برای استفاده از نگارش `#{}` این است که هر کلید باید یکی از موارد زیر باشد:

- کاراکتر ASCII.
- عدد.
- یک زیرخط (`_`).
- یک خط تیره (`-`).

دقیقا مانند لیست، شما می‌توانید از هر نوع داده‌ای به عنوان مقادیر استفاده کنید.

```shell
:let mealPlan = {"breakfast": ["pancake", "waffle", "hash brown"], "lunch": WhatsForLunch(), "dinner": {"appetizer": "gruel", "entree": "more gruel"}}
```

### دسترسی به دیکشنری

برای دسترسی به یک مقدار از یک دیکشنری، می‌توانید کلید را با استفاده از یا براکت‌های مربع (`['key']`) یا نگارش نقطه (`.key`) فراخوانی کنید.

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches", "dinner": "more gruel"}

:let breakfast = meal['breakfast']
:let lunch = meal.lunch

:echo breakfast
" برمی‌گرداند "gruel omelettes"

:echo lunch
" برمی‌گرداند "gruel sandwiches"
```

### تغییر دیکشنری

شما می‌توانید محتوای یک دیکشنری را تغییر دهید یا حتی اضافه کنید:

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches"}

:let meal.breakfast = "breakfast tacos"
:let meal["lunch"] = "tacos al pastor"
:let meal["dinner"] = "quesadillas"

:echo meal
" برمی‌گرداند {'lunch': 'tacos al pastor', 'breakfast': 'breakfast tacos', 'dinner': 'quesadillas'}
```

### توابع دیکشنری

بیایید برخی از توابع داخلی Vim برای مدیریت دیکشنری‌ها را بررسی کنیم.

برای بررسی طول یک دیکشنری، از `len()` استفاده کنید.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo len(mealPlans)
" برمی‌گرداند 3
```

برای دیدن اینکه آیا یک دیکشنری شامل یک کلید خاص است، از `has_key()` استفاده کنید.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo has_key(mealPlans, "breakfast")
" برمی‌گرداند 1

:echo has_key(mealPlans, "dessert")
" برمی‌گرداند 0
```

برای دیدن اینکه آیا یک دیکشنری هیچ موردی دارد، از `empty()` استفاده کنید. تابع `empty()` با تمام انواع داده‌ها کار می‌کند: لیست، دیکشنری، رشته، عدد، اعشاری و غیره.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:let noMealPlan = {}

:echo empty(noMealPlan)
" برمی‌گرداند 1

:echo empty(mealPlans)
" برمی‌گرداند 0
```

برای حذف یک ورودی از یک دیکشنری، از `remove()` استفاده کنید.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo "حذف صبحانه: " . remove(mealPlans, "breakfast")
" برمی‌گرداند "حذف صبحانه: 'waffles'"

:echo mealPlans
" برمی‌گرداند {'lunch': 'pancakes', 'dinner': 'donuts'}
```

برای تبدیل یک دیکشنری به لیستی از لیست‌ها، از `items()` استفاده کنید:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo items(mealPlans)
" برمی‌گرداند [['lunch', 'pancakes'], ['breakfast', 'waffles'], ['dinner', 'donuts']]
```

`filter()` و `map()` نیز در دسترس هستند.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}
:call filter(breakfastNo, 'v:key > 1')

:echo breakfastNo
" برمی‌گرداند {'2': '9am', '11ses': '11am'}
```

از آنجا که یک دیکشنری شامل جفت‌های کلید-مقدار است، Vim متغیر خاص `v:key` را فراهم می‌کند که مشابه `v:val` عمل می‌کند. هنگام تکرار در یک دیکشنری، `v:key` مقدار کلید تکرار شده فعلی را نگه می‌دارد.

اگر شما یک دیکشنری `mealPlans` دارید، می‌توانید آن را با استفاده از `v:key` نگاشت کنید.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:key . " و شیر"')

:echo mealPlans
" برمی‌گرداند {'lunch': 'lunch و شیر', 'breakfast': 'breakfast و شیر', 'dinner': 'dinner و شیر'}
```

به‌طور مشابه، می‌توانید آن را با استفاده از `v:val` نگاشت کنید:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:val . " و شیر"')

:echo mealPlans
" برمی‌گرداند {'lunch': 'pancakes و شیر', 'breakfast': 'waffles و شیر', 'dinner': 'donuts و شیر'}
```

برای دیدن توابع بیشتر دیکشنری، به `:h dict-functions` مراجعه کنید.

## نوع‌های خاص

Vim نوع‌های خاصی دارد:

- `v:false`
- `v:true`
- `v:none`
- `v:null`

به‌هرحال، `v:` متغیر داخلی Vim است. این‌ها در فصل‌های بعدی بیشتر بررسی خواهند شد.

به تجربه من، شما این نوع‌های خاص را به‌طور مکرر استفاده نخواهید کرد. اگر به یک مقدار درست / نادرست نیاز دارید، می‌توانید فقط از 0 (نادرست) و غیر 0 (درست) استفاده کنید. اگر به یک رشته خالی نیاز دارید، فقط از `""` استفاده کنید. اما هنوز هم خوب است که بدانید، بنابراین بیایید به سرعت آن‌ها را مرور کنیم.

### درست

این معادل `true` است. این معادل یک عدد با مقدار غیر 0 است. هنگام رمزگشایی json با `json_encode()`، به عنوان "درست" تفسیر می‌شود.

```shell
:echo json_encode({"test": v:true})
" برمی‌گرداند {"test": true}
```

### نادرست

این معادل `false` است. این معادل یک عدد با مقدار 0 است. هنگام رمزگشایی json با `json_encode()`، به عنوان "نادرست" تفسیر می‌شود.

```shell
:echo json_encode({"test": v:false})
" برمی‌گرداند {"test": false}
```

### هیچ

این معادل یک رشته خالی است. هنگام رمزگشایی json با `json_encode()`، به عنوان یک مورد خالی (`null`) تفسیر می‌شود.

```shell
:echo json_encode({"test": v:none})
" برمی‌گرداند {"test": null}
```

### null

مشابه `v:none`.

```shell
:echo json_encode({"test": v:null})
" برمی‌گرداند {"test": null}
```

## یادگیری نوع‌های داده به روش هوشمند

در این فصل، شما با نوع‌های داده پایه Vimscript آشنا شدید: عدد، اعشاری، رشته، لیست، دیکشنری و خاص. یادگیری این‌ها اولین قدم برای شروع برنامه‌نویسی Vimscript است.

در فصل بعد، شما یاد خواهید گرفت که چگونه آن‌ها را برای نوشتن عبارات مانند برابری، شرطی‌ها و حلقه‌ها ترکیب کنید.