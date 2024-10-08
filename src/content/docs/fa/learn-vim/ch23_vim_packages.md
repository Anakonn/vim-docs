---
description: این مستند به شما آموزش می‌دهد که چگونه از مدیریت بسته‌های داخلی Vim برای
  نصب و بارگذاری پلاگین‌ها استفاده کنید.
title: Ch23. Vim Packages
---

در فصل قبلی، من به استفاده از یک مدیر پلاگین خارجی برای نصب پلاگین‌ها اشاره کردم. از نسخه 8، Vim با یک مدیر پلاگین داخلی به نام *packages* ارائه می‌شود. در این فصل، شما یاد خواهید گرفت که چگونه از بسته‌های Vim برای نصب پلاگین‌ها استفاده کنید.

برای بررسی اینکه آیا نسخه Vim شما قابلیت استفاده از بسته‌ها را دارد یا خیر، دستور `:version` را اجرا کنید و به دنبال ویژگی `+packages` بگردید. به طور جایگزین، می‌توانید دستور `:echo has('packages')` را نیز اجرا کنید (اگر 1 برگرداند، پس قابلیت بسته‌ها را دارد).

## دایرکتوری بسته

بررسی کنید که آیا دایرکتوری `~/.vim/` در مسیر ریشه وجود دارد یا خیر. اگر وجود ندارد، یکی بسازید. درون آن، یک دایرکتوری به نام `pack` (`~/.vim/pack/`) ایجاد کنید. Vim به طور خودکار می‌داند که باید در این دایرکتوری به دنبال بسته‌ها بگردد.

## دو نوع بارگذاری

بسته Vim دارای دو مکانیزم بارگذاری است: بارگذاری خودکار و بارگذاری دستی.

### بارگذاری خودکار

برای بارگذاری پلاگین‌ها به صورت خودکار هنگام شروع Vim، شما باید آن‌ها را در دایرکتوری `start/` قرار دهید. مسیر به این شکل است:

```shell
~/.vim/pack/*/start/
```

حالا ممکن است بپرسید، "این `*` بین `pack/` و `start/` چیست؟" `*` یک نام دلخواه است و می‌تواند هر چیزی که می‌خواهید باشد. بیایید آن را `packdemo/` نام‌گذاری کنیم:

```shell
~/.vim/pack/packdemo/start/
```

به یاد داشته باشید که اگر این قسمت را نادیده بگیرید و به جای آن کاری مانند این انجام دهید:

```shell
~/.vim/pack/start/
```

سیستم بسته کار نخواهد کرد. ضروری است که یک نام بین `pack/` و `start/` قرار دهید.

برای این دمو، بیایید سعی کنیم پلاگین [NERDTree](https://github.com/preservim/nerdtree) را نصب کنیم. به دایرکتوری `start/` بروید (`cd ~/.vim/pack/packdemo/start/`) و مخزن NERDTree را کلون کنید:

```shell
git clone https://github.com/preservim/nerdtree.git
```

همین! شما آماده‌اید. دفعه بعد که Vim را شروع کنید، می‌توانید بلافاصله دستورات NERDTree مانند `:NERDTreeToggle` را اجرا کنید.

شما می‌توانید به تعداد دلخواه مخازن پلاگین را در مسیر `~/.vim/pack/*/start/` کلون کنید. Vim به طور خودکار هر کدام را بارگذاری خواهد کرد. اگر مخزن کلون شده را حذف کنید (`rm -rf nerdtree/`)، آن پلاگین دیگر در دسترس نخواهد بود.

### بارگذاری دستی

برای بارگذاری پلاگین‌ها به صورت دستی هنگام شروع Vim، شما باید آن‌ها را در دایرکتوری `opt/` قرار دهید. مشابه بارگذاری خودکار، مسیر به این شکل است:

```shell
~/.vim/pack/*/opt/
```

بیایید از همان دایرکتوری `packdemo/` که قبلاً استفاده کردیم، استفاده کنیم:

```shell
~/.vim/pack/packdemo/opt/
```

این بار، بیایید بازی [killersheep](https://github.com/vim/killersheep) را نصب کنیم (این نیاز به Vim 8.2 دارد). به دایرکتوری `opt/` بروید (`cd ~/.vim/pack/packdemo/opt/`) و مخزن را کلون کنید:

```shell
git clone https://github.com/vim/killersheep.git
```

Vim را شروع کنید. دستور برای اجرای بازی `:KillKillKill` است. سعی کنید آن را اجرا کنید. Vim شکایت خواهد کرد که این یک دستور ویرایشگر معتبر نیست. شما ابتدا باید پلاگین را *به صورت دستی* بارگذاری کنید. بیایید این کار را انجام دهیم:

```shell
:packadd killersheep
```

حالا دوباره سعی کنید دستور `:KillKillKill` را اجرا کنید. این دستور باید حالا کار کند.

شما ممکن است بپرسید، "چرا باید بخواهم بسته‌ها را به صورت دستی بارگذاری کنم؟ آیا بهتر نیست که همه چیز را به طور خودکار در شروع بارگذاری کنم؟"

سوال خوبی است. گاهی اوقات پلاگین‌هایی وجود دارند که شما همیشه از آن‌ها استفاده نمی‌کنید، مانند بازی KillerSheep. احتمالاً نیازی به بارگذاری 10 بازی مختلف و کند کردن زمان شروع Vim ندارید. با این حال، هر از گاهی، وقتی که خسته هستید، ممکن است بخواهید چند بازی انجام دهید. از بارگذاری دستی برای پلاگین‌های غیرضروری استفاده کنید.

شما همچنین می‌توانید از این برای افزودن شرطی پلاگین‌ها استفاده کنید. شاید شما هم از Neovim و هم از Vim استفاده می‌کنید و پلاگین‌هایی وجود دارند که برای Neovim بهینه‌سازی شده‌اند. می‌توانید چیزی شبیه به این را در vimrc خود اضافه کنید:

```shell
if has('nvim')
  packadd! neovim-only-plugin
else
  packadd! generic-vim-plugin
endif
```

## سازماندهی بسته‌ها

به یاد داشته باشید که شرط استفاده از سیستم بسته Vim این است که یکی از موارد زیر را داشته باشید:

```shell
~/.vim/pack/*/start/
```

یا:

```shell
~/.vim/pack/*/opt/
```

این واقعیت که `*` می‌تواند *هر* نامی باشد می‌تواند برای سازماندهی بسته‌های شما استفاده شود. فرض کنید می‌خواهید پلاگین‌های خود را بر اساس دسته‌ها (رنگ‌ها، نحو و بازی‌ها) گروه‌بندی کنید:

```shell
~/.vim/pack/colors/
~/.vim/pack/syntax/
~/.vim/pack/games/
```

شما هنوز می‌توانید از `start/` و `opt/` درون هر یک از دایرکتوری‌ها استفاده کنید.

```shell
~/.vim/pack/colors/start/
~/.vim/pack/colors/opt/

~/.vim/pack/syntax/start/
~/.vim/pack/syntax/opt/

~/.vim/pack/games/start/
~/.vim/pack/games/opt/
```

## افزودن بسته‌ها به روش هوشمند

شما ممکن است بپرسید آیا بسته‌های Vim مدیران پلاگین محبوبی مانند vim-pathogen، vundle.vim، dein.vim و vim-plug را منسوخ خواهند کرد.

پاسخ همیشه این است که "بستگی دارد".

من هنوز از vim-plug استفاده می‌کنم زیرا اضافه کردن، حذف کردن یا به‌روزرسانی پلاگین‌ها را آسان می‌کند. اگر از پلاگین‌های زیادی استفاده می‌کنید، ممکن است استفاده از مدیران پلاگین راحت‌تر باشد زیرا به راحتی می‌توانید بسیاری را به طور همزمان به‌روزرسانی کنید. برخی از مدیران پلاگین همچنین قابلیت‌های غیرهمزمان را ارائه می‌دهند.

اگر شما یک مینیمالیست هستید، بسته‌های Vim را امتحان کنید. اگر شما یک کاربر سنگین پلاگین هستید، ممکن است بخواهید به استفاده از یک مدیر پلاگین فکر کنید.