---
description: این مستند به بررسی نحوه استفاده از حالت بصری در ویم برای ویرایش متن به
  طور مؤثر و معرفی سه نوع حالت بصری می‌پردازد.
title: Ch11. Visual Mode
---

برجسته‌سازی و اعمال تغییرات بر روی متن یک ویژگی رایج در بسیاری از ویرایشگرهای متن و پردازشگرهای کلمه است. Vim می‌تواند این کار را با استفاده از حالت بصری انجام دهد. در این فصل، شما یاد خواهید گرفت که چگونه از حالت بصری برای دستکاری متن‌ها به طور مؤثر استفاده کنید.

## سه نوع حالت بصری

Vim سه حالت بصری مختلف دارد. آنها عبارتند از:

```shell
v         حالت بصری کاراکتری
V         حالت بصری خطی
Ctrl-V    حالت بصری بلوکی
```

اگر متن شما این باشد:

```shell
one
two
three
```

حالت بصری کاراکتری با کاراکترهای فردی کار می‌کند. بر روی اولین کاراکتر `v` را فشار دهید. سپس با `j` به خط بعدی بروید. این کار تمام متن‌ها را از "one" تا مکان نشانگر شما برجسته می‌کند. اگر `gU` را فشار دهید، Vim کاراکترهای برجسته شده را به حروف بزرگ تبدیل می‌کند.

حالت بصری خطی با خطوط کار می‌کند. `V` را فشار دهید و ببینید که Vim تمام خطی را که نشانگر شما روی آن است انتخاب می‌کند. درست مانند حالت بصری کاراکتری، اگر `gU` را اجرا کنید، Vim کاراکترهای برجسته شده را به حروف بزرگ تبدیل می‌کند.

حالت بصری بلوکی با ردیف‌ها و ستون‌ها کار می‌کند. این حالت آزادی بیشتری در حرکت نسبت به دو حالت دیگر به شما می‌دهد. اگر `Ctrl-V` را فشار دهید، Vim کاراکتر زیر نشانگر را درست مانند حالت بصری کاراکتری برجسته می‌کند، با این تفاوت که به جای برجسته کردن هر کاراکتر تا انتهای خط قبل از رفتن به خط بعدی، با حداقل برجسته‌سازی به خط بعدی می‌رود. سعی کنید با `h/j/k/l` حرکت کنید و ببینید نشانگر چگونه حرکت می‌کند.

در گوشه پایین سمت چپ پنجره Vim شما، یکی از `-- VISUAL --`، `-- VISUAL LINE --` یا `-- VISUAL BLOCK --` نمایش داده می‌شود تا نشان دهد که در کدام حالت بصری هستید.

در حالی که در یک حالت بصری هستید، می‌توانید با فشار دادن `v`، `V` یا `Ctrl-V` به حالت بصری دیگری سوئیچ کنید. به عنوان مثال، اگر در حالت بصری خطی هستید و می‌خواهید به حالت بصری بلوکی سوئیچ کنید، `Ctrl-V` را اجرا کنید. امتحان کنید!

سه راه برای خروج از حالت بصری وجود دارد: `<Esc>`، `Ctrl-C` و همان کلید که در حالت بصری فعلی هستید. منظور از دومی این است که اگر در حالت بصری خطی (`V`) هستید، می‌توانید با فشار دادن دوباره `V` از آن خارج شوید. اگر در حالت بصری کاراکتری هستید، می‌توانید با فشار دادن `v` از آن خارج شوید.

در واقع یک راه دیگر برای ورود به حالت بصری وجود دارد:

```shell
gv    به حالت بصری قبلی بروید
```

این کار همان حالت بصری را بر روی همان بلوک متن برجسته شده که آخرین بار انجام داده‌اید، آغاز می‌کند.

## ناوبری در حالت بصری

در حالی که در حالت بصری هستید، می‌توانید بلوک متن برجسته شده را با حرکات Vim گسترش دهید.

بیایید از همان متنی که قبلاً استفاده کردید، استفاده کنیم:

```shell
one
two
three
```

این بار بیایید از خط "two" شروع کنیم. `v` را فشار دهید تا به حالت بصری کاراکتری بروید (در اینجا براکت‌های مربعی `[]` نمایانگر برجسته‌سازی کاراکتر هستند):

```shell
one
[t]wo
three
```

`j` را فشار دهید و Vim تمام متن را از خط "two" تا اولین کاراکتر خط "three" برجسته می‌کند.

```shell
one
[two
t]hree
```

فرض کنید از این موقعیت می‌خواهید خط "one" را نیز اضافه کنید. اگر `k` را فشار دهید، متأسفانه، برجسته‌سازی از خط "three" دور می‌شود.

```shell
one
[t]wo
three
```

آیا راهی وجود دارد که به راحتی انتخاب بصری را گسترش دهید و به هر سمتی که می‌خواهید حرکت کنید؟ قطعاً. بیایید کمی به عقب برگردیم به جایی که خط "two" و "three" برجسته شده‌اند.

```shell
one
[two
t]hree    <-- نشانگر
```

برجسته‌سازی بصری از حرکت نشانگر پیروی می‌کند. اگر می‌خواهید آن را به سمت بالا به خط "one" گسترش دهید، باید نشانگر را به خط "two" ببرید. در حال حاضر نشانگر روی خط "three" است. می‌توانید موقعیت نشانگر را با `o` یا `O` تغییر دهید.

```shell
one
[two     <-- نشانگر
t]hree
```

حالا وقتی `k` را فشار می‌دهید، دیگر انتخاب را کاهش نمی‌دهد، بلکه به سمت بالا گسترش می‌دهد.

```shell
[one
two
t]hree
```

با `o` یا `O` در حالت بصری، نشانگر از ابتدای بلوک برجسته شده به انتهای آن می‌پرد، که به شما اجازه می‌دهد منطقه برجسته‌سازی را گسترش دهید.

## گرامر حالت بصری

حالت بصری بسیاری از عملیات‌ها را با حالت عادی به اشتراک می‌گذارد.

به عنوان مثال، اگر متن زیر را داشته باشید و بخواهید دو خط اول را از حالت بصری حذف کنید:

```shell
one
two
three
```

خطوط "one" و "two" را با حالت بصری خطی (`V`) برجسته کنید:

```shell
[one
two]
three
```

فشار دادن `d` انتخاب را حذف می‌کند، مشابه حالت عادی. توجه داشته باشید که قاعده گرامری از حالت عادی، فعل + اسم، اعمال نمی‌شود. همان فعل هنوز وجود دارد (`d`)، اما در حالت بصری هیچ اسمی وجود ندارد. قاعده گرامری در حالت بصری اسم + فعل است، جایی که اسم متن برجسته شده است. ابتدا بلوک متن را انتخاب کنید، سپس دستور را دنبال کنید.

در حالت عادی، برخی از دستورات نیازی به حرکت ندارند، مانند `x` برای حذف یک کاراکتر واحد زیر نشانگر و `r` برای جایگزینی کاراکتر زیر نشانگر (`rx` کاراکتر زیر نشانگر را با "x" جایگزین می‌کند). در حالت بصری، این دستورات اکنون بر روی تمام متن برجسته شده به جای یک کاراکتر واحد اعمال می‌شوند. بازگشت به متن برجسته شده:

```shell
[one
two]
three
```

اجرای `x` تمام متن‌های برجسته شده را حذف می‌کند.

شما می‌توانید از این رفتار برای سریعاً ایجاد یک سرصفحه در متن markdown استفاده کنید. فرض کنید نیاز دارید که متن زیر را به یک سرصفحه سطح اول markdown ("===") سریعاً تبدیل کنید:

```shell
Chapter One
```

ابتدا متن را با `yy` کپی کنید، سپس با `p` آن را بچسبانید:

```shell
Chapter One
Chapter One
```

حالا به خط دوم بروید و آن را با حالت بصری خطی انتخاب کنید:

```shell
Chapter One
[Chapter One]
```

یک سرصفحه سطح اول یک سری از "=" زیر یک متن است. `r=` را اجرا کنید، voila! این شما را از تایپ دستی "=" نجات می‌دهد.

```shell
Chapter One
===========
```

برای یادگیری بیشتر در مورد عملگرها در حالت بصری، به `:h visual-operators` مراجعه کنید.

## حالت بصری و دستورات خط فرمان

شما می‌توانید دستورات خط فرمان را به طور انتخابی بر روی یک بلوک متن برجسته شده اعمال کنید. اگر این عبارات را داشته باشید و بخواهید "const" را فقط در دو خط اول با "let" جایگزین کنید:

```shell
const one = "one";
const two = "two";
const three = "three";
```

دو خط اول را با *هر* حالت بصری برجسته کنید و دستور جایگزینی `:s/const/let/g` را اجرا کنید:

```shell
let one = "one";
let two = "two";
const three = "three";
```

توجه داشته باشید که گفتم می‌توانید این کار را با *هر* حالت بصری انجام دهید. شما نیازی به برجسته‌سازی کل خط برای اجرای دستور بر روی آن خط ندارید. به محض اینکه حداقل یک کاراکتر را در هر خط انتخاب کنید، دستور اعمال می‌شود.

## افزودن متن در چند خط

شما می‌توانید در Vim با استفاده از حالت بصری بلوکی متن را در چند خط اضافه کنید. اگر نیاز دارید که یک نقطه‌ویرگول در انتهای هر خط اضافه کنید:

```shell
const one = "one"
const two = "two"
const three = "three"
```

با نشانگر خود روی خط اول:
- حالت بصری بلوکی را اجرا کنید و به دو خط پایین بروید (`Ctrl-V jj`).
- تا انتهای خط برجسته کنید (`$`).
- اضافه کنید (`A`) سپس ";" را تایپ کنید.
- از حالت بصری خارج شوید (`<Esc>`).

حالا باید ";" اضافه شده را در هر خط ببینید. خیلی جالب است! دو راه برای ورود به حالت درج از حالت بصری بلوکی وجود دارد: `A` برای ورود به متن بعد از نشانگر یا `I` برای ورود به متن قبل از نشانگر. آنها را با `A` (اضافه کردن متن در انتهای خط) و `I` (وارد کردن متن قبل از اولین خط غیر خالی) از حالت عادی اشتباه نگیرید.

به طور جایگزین، شما همچنین می‌توانید از دستور `:normal` برای افزودن متن در چند خط استفاده کنید:
- تمام ۳ خط را برجسته کنید (`vjj`).
- تایپ کنید `:normal! A;`.

به یاد داشته باشید، دستور `:normal` دستورات حالت عادی را اجرا می‌کند. شما می‌توانید به آن دستور دهید که `A;` را اجرا کند تا متن ";" را در انتهای خط اضافه کند.

## افزایش اعداد

Vim دستورات `Ctrl-X` و `Ctrl-A` را برای کاهش و افزایش اعداد دارد. وقتی با حالت بصری استفاده می‌شود، می‌توانید اعداد را در چند خط افزایش دهید.

اگر این عناصر HTML را داشته باشید:

```shell
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
```

این یک عمل بد است که چندین شناسه با همان نام داشته باشید، بنابراین بیایید آنها را افزایش دهیم تا منحصر به فرد شوند:
- نشانگر خود را به "1" در خط دوم ببرید.
- حالت بصری بلوکی را آغاز کنید و به ۳ خط پایین بروید (`Ctrl-V 3j`). این کار "1" های باقی‌مانده را برجسته می‌کند. حالا تمام "1" ها باید برجسته شده باشند (به جز خط اول).
- `g Ctrl-A` را اجرا کنید.

شما باید این نتیجه را ببینید:

```shell
<div id="app-1"></div>
<div id="app-2"></div>
<div id="app-3"></div>
<div id="app-4"></div>
<div id="app-5"></div>
```

`g Ctrl-A` اعداد را در چند خط افزایش می‌دهد. `Ctrl-X/Ctrl-A` همچنین می‌تواند حروف را نیز افزایش دهد، با گزینه فرمت‌های عددی:

```shell
set nrformats+=alpha
```

گزینه `nrformats` به Vim دستور می‌دهد که کدام مبناها به عنوان "اعداد" برای افزایش و کاهش با `Ctrl-A` و `Ctrl-X` در نظر گرفته شوند. با افزودن `alpha`، یک کاراکتر الفبایی اکنون به عنوان یک عدد در نظر گرفته می‌شود. اگر این عناصر HTML را داشته باشید:

```shell
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
```

نشانگر خود را روی "app-a" دوم قرار دهید. از همان تکنیک بالا (`Ctrl-V 3j` سپس `g Ctrl-A`) برای افزایش شناسه‌ها استفاده کنید.

```shell
<div id="app-a"></div>
<div id="app-b"></div>
<div id="app-c"></div>
<div id="app-d"></div>
<div id="app-e"></div>
```

## انتخاب آخرین ناحیه حالت بصری

قبلاً در این فصل ذکر کردم که `gv` می‌تواند به سرعت آخرین برجسته‌سازی حالت بصری را برجسته کند. شما همچنین می‌توانید به مکان شروع و پایان آخرین حالت بصری با این دو علامت ویژه بروید:

```shell
`<    به اولین مکان برجسته‌سازی حالت بصری قبلی بروید
`>    به آخرین مکان برجسته‌سازی حالت بصری قبلی بروید
```

قبلاً همچنین ذکر کردم که می‌توانید به طور انتخابی دستورات خط فرمان را بر روی متنی که برجسته شده است، اجرا کنید، مانند `:s/const/let/g`. وقتی این کار را انجام دادید، این را زیر می‌بینید:

```shell
:`<,`>s/const/let/g
```

شما در واقع یک دستور *محدوده‌ای* `s/const/let/g` را اجرا می‌کردید (با دو علامت به عنوان آدرس‌ها). جالب است!

شما همیشه می‌توانید این علامت‌ها را هر زمان که بخواهید ویرایش کنید. اگر به جای آن نیاز داشتید که از ابتدای متن برجسته شده تا انتهای فایل جایگزین کنید، فقط دستور را به این صورت تغییر دهید:

```shell
:`<,$s/const/let/g
```

## ورود به حالت بصری از حالت درج

شما همچنین می‌توانید از حالت درج به حالت بصری وارد شوید. برای رفتن به حالت بصری کاراکتری در حالی که در حالت درج هستید:

```shell
Ctrl-O v
```

به یاد داشته باشید که اجرای `Ctrl-O` در حالی که در حالت درج هستید به شما اجازه می‌دهد که یک دستور حالت عادی را اجرا کنید. در حالی که در این حالت انتظار اجرای دستور حالت عادی هستید، `v` را برای ورود به حالت بصری کاراکتری اجرا کنید. توجه داشته باشید که در گوشه پایین سمت چپ صفحه، نوشته شده است `--(insert) VISUAL--`. این ترفند با هر عملگر حالت بصری کار می‌کند: `v`، `V` و `Ctrl-V`.

## حالت انتخاب

Vim حالتی مشابه حالت بصری به نام حالت انتخاب دارد. مانند حالت بصری، آن نیز سه حالت مختلف دارد:

```shell
gh         حالت انتخاب کاراکتری
gH         حالت انتخاب خطی
gCtrl-h    حالت انتخاب بلوکی
```

حالت انتخاب رفتار برجسته‌سازی متن ویرایشگرهای معمولی را نزدیک‌تر به حالت بصری Vim شبیه‌سازی می‌کند.

در یک ویرایشگر معمولی، پس از اینکه یک بلوک متن را برجسته کردید و یک حرف تایپ کردید، مثلاً حرف "y"، متن برجسته شده حذف می‌شود و حرف "y" وارد می‌شود. اگر یک خط را با حالت انتخاب خطی (`gH`) برجسته کنید و "y" را تایپ کنید، متن برجسته شده حذف می‌شود و حرف "y" وارد می‌شود.

این حالت انتخاب را با حالت بصری مقایسه کنید: اگر یک خط متن را با حالت بصری خطی (`V`) برجسته کنید و "y" را تایپ کنید، متن برجسته شده حذف نمی‌شود و با حرف "y" جایگزین نمی‌شود، بلکه یانک می‌شود. شما نمی‌توانید دستورات حالت عادی را بر روی متن برجسته شده در حالت انتخاب اجرا کنید.

من شخصاً هرگز از حالت انتخاب استفاده نکرده‌ام، اما خوب است که بدانید که وجود دارد.

## یادگیری حالت بصری به روش هوشمند

حالت بصری نمایندگی Vim از روند برجسته‌سازی متن است.

اگر متوجه شدید که بیشتر از عملیات حالت بصری نسبت به عملیات حالت عادی استفاده می‌کنید، مراقب باشید. این یک الگوی ضد است. برای اجرای یک عملیات حالت بصری به تعداد کلیدهای بیشتری نیاز است تا معادل حالت عادی آن. به عنوان مثال، اگر نیاز دارید که یک کلمه داخلی را حذف کنید، چرا از چهار کلید، `viwd` (برجسته‌سازی بصری یک کلمه داخلی سپس حذف) استفاده کنید، اگر می‌توانید این کار را با فقط سه کلید (`diw`) انجام دهید؟ دومی مستقیم‌تر و مختصرتر است. البته، در برخی مواقع حالت‌های بصری مناسب خواهند بود، اما به طور کلی، به رویکردی مستقیم‌تر تمایل داشته باشید.