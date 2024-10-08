---
description: این راهنما به کاربران وی‌م به‌طور مختصر و مفید، ویژگی‌های کلیدی را آموزش
  می‌دهد تا در کمترین زمان، مهارت‌های لازم را کسب کنند.
title: Ch00. Read This First
---

## چرا این راهنما نوشته شده است

جایگاه‌های زیادی برای یادگیری Vim وجود دارد: `vimtutor` مکان خوبی برای شروع است و راهنمای `:help` تمام مراجع مورد نیاز شما را دارد.

با این حال، کاربر متوسط به چیزی بیشتر از `vimtutor` و کمتر از راهنمای `:help` نیاز دارد. این راهنما سعی دارد این شکاف را با برجسته کردن فقط ویژگی‌های کلیدی برای یادگیری مفیدترین بخش‌های Vim در کمترین زمان ممکن پر کند.

احتمالاً شما به ۱۰۰٪ ویژگی‌های Vim نیاز نخواهید داشت. احتمالاً فقط نیاز دارید که درباره ۲۰٪ از آن‌ها بدانید تا یک Vimmer قدرتمند شوید. این راهنما به شما نشان می‌دهد که کدام ویژگی‌های Vim برای شما مفیدتر خواهد بود.

این یک راهنمای نظر محور است. این تکنیک‌هایی را پوشش می‌دهد که من اغلب هنگام استفاده از Vim استفاده می‌کنم. فصل‌ها بر اساس آنچه که فکر می‌کنم منطقی‌ترین ترتیب برای یادگیری Vim برای یک مبتدی است، ترتیب‌بندی شده‌اند.

این راهنما پر از مثال است. هنگام یادگیری یک مهارت جدید، مثال‌ها ضروری هستند و داشتن مثال‌های متعدد این مفاهیم را به طور مؤثرتری تثبیت می‌کند.

برخی از شما ممکن است بپرسید چرا باید Vimscript را یاد بگیرید؟ در سال اول استفاده از Vim، من از فقط دانستن نحوه استفاده از Vim راضی بودم. زمان گذشت و من شروع به نیاز به Vimscript بیشتر و بیشتر برای نوشتن دستورات سفارشی برای نیازهای ویرایش خاص خود کردم. هنگامی که شما در حال تسلط بر Vim هستید، دیر یا زود نیاز به یادگیری Vimscript خواهید داشت. پس چرا زودتر نه؟ Vimscript یک زبان کوچک است. شما می‌توانید اصول آن را در فقط چهار فصل از این راهنما یاد بگیرید.

شما می‌توانید با استفاده از Vim بدون دانستن هیچ Vimscript به جلو بروید، اما دانستن آن به شما کمک می‌کند حتی بیشتر پیشرفت کنید.

این راهنما برای هر دو Vimmer مبتدی و پیشرفته نوشته شده است. این راهنما با مفاهیم گسترده و ساده شروع می‌شود و با مفاهیم خاص و پیشرفته به پایان می‌رسد. اگر شما یک کاربر پیشرفته هستید، من به شما توصیه می‌کنم که این راهنما را از ابتدا تا انتها بخوانید، زیرا شما چیزی جدید خواهید آموخت!

## چگونه از ویرایشگر متن دیگری به Vim منتقل شویم

یادگیری Vim یک تجربه رضایت‌بخش است، هرچند سخت. دو رویکرد اصلی برای یادگیری Vim وجود دارد:

1. ترک ناگهانی
2. تدریجی

ترک ناگهانی به معنای متوقف کردن استفاده از هر ویرایشگر / IDE که استفاده می‌کردید و استفاده از Vim به‌طور انحصاری از این لحظه به بعد است. نقطه ضعف این روش این است که شما در طول هفته یا دو هفته اول با کاهش شدید بهره‌وری مواجه خواهید شد. اگر شما یک برنامه‌نویس تمام‌وقت هستید، این روش ممکن است عملی نباشد. به همین دلیل برای بیشتر مردم، من معتقدم بهترین راه برای انتقال به Vim استفاده تدریجی از آن است.

برای استفاده تدریجی از Vim، در طول دو هفته اول، یک ساعت در روز از Vim به عنوان ویرایشگر خود استفاده کنید و در بقیه زمان می‌توانید از ویرایشگرهای دیگر استفاده کنید. بسیاری از ویرایشگرهای مدرن با پلاگین‌های Vim همراه هستند. زمانی که من شروع کردم، از پلاگین محبوب Vim در VSCode به مدت یک ساعت در روز استفاده می‌کردم. به تدریج زمان استفاده از پلاگین Vim را افزایش دادم تا اینکه بالاخره تمام روز از آن استفاده کردم. به خاطر داشته باشید که این پلاگین‌ها فقط می‌توانند بخشی از ویژگی‌های Vim را شبیه‌سازی کنند. برای تجربه قدرت کامل Vim مانند Vimscript، دستورات خط فرمان (Ex) و ادغام دستورات خارجی، شما باید خود Vim را استفاده کنید.

دو لحظه کلیدی وجود داشت که باعث شد من ۱۰۰٪ از Vim استفاده کنم: زمانی که فهمیدم Vim ساختاری شبیه به گرامر دارد (به فصل ۴ مراجعه کنید) و پلاگین [fzf.vim](https://github.com/junegunn/fzf.vim) (به فصل ۳ مراجعه کنید).

اولین مورد، زمانی که متوجه ساختار شبیه به گرامر Vim شدم، لحظه تعیین‌کننده‌ای بود که بالاخره فهمیدم این کاربران Vim درباره چه چیزی صحبت می‌کنند. من نیازی به یادگیری صدها دستور منحصر به فرد نداشتم. من فقط باید چند دستور کوچک یاد می‌گرفتم و می‌توانستم آن‌ها را به روشی بسیار شهودی زنجیره‌ای کنم تا کارهای زیادی انجام دهم.

دومین مورد، توانایی اجرای سریع جستجوی فایل مبهم، ویژگی IDE بود که من بیشتر از آن استفاده می‌کردم. وقتی یاد گرفتم چگونه این کار را در Vim انجام دهم، یک افزایش سرعت عمده به دست آوردم و از آن زمان هرگز به عقب نگاه نکردم.

هر کسی به طور متفاوت برنامه‌نویسی می‌کند. با تأمل، شما متوجه خواهید شد که یک یا دو ویژگی از ویرایشگر / IDE مورد علاقه‌تان وجود دارد که همیشه از آن استفاده می‌کنید. شاید این ویژگی جستجوی مبهم، پرش به تعریف یا کامپایل سریع بود. هر چه که باشد، آن‌ها را سریع شناسایی کنید و یاد بگیرید چگونه آن‌ها را در Vim پیاده‌سازی کنید (احتمالاً Vim نیز می‌تواند آن‌ها را انجام دهد). سرعت ویرایش شما به طرز چشمگیری افزایش خواهد یافت.

زمانی که می‌توانید با ۵۰٪ از سرعت اصلی ویرایش کنید، زمان آن است که به طور کامل به Vim بروید.

## چگونه این راهنما را بخوانیم

این یک راهنمای عملی است. برای خوب شدن در Vim شما نیاز دارید که حافظه عضلانی خود را توسعه دهید، نه دانش ذهنی.

شما با خواندن یک راهنما درباره نحوه دوچرخه‌سواری یاد نمی‌گیرید که چگونه دوچرخه‌سواری کنید. شما باید واقعاً دوچرخه‌سواری کنید.

شما باید هر دستوری که در این راهنما اشاره شده است را تایپ کنید. نه تنها این، بلکه باید آن‌ها را چندین بار تکرار کنید و ترکیب‌های مختلف را امتحان کنید. ببینید دستور جدیدی که یاد گرفته‌اید چه ویژگی‌های دیگری دارد. دستور `:help` و موتورهای جستجو بهترین دوستان شما هستند. هدف شما این نیست که همه چیز را درباره یک دستور بدانید، بلکه باید بتوانید آن دستور را به طور طبیعی و غریزی اجرا کنید.

هرچند که سعی می‌کنم این راهنما را به‌صورت خطی تنظیم کنم، برخی مفاهیم در این راهنما باید به‌صورت غیرترتیبی ارائه شوند. به عنوان مثال، در فصل ۱، من به دستور جایگزینی (`:s`) اشاره می‌کنم، حتی اگر تا فصل ۱۲ پوشش داده نشود. برای رفع این مشکل، هر زمان که یک مفهوم جدید که هنوز پوشش داده نشده است زودتر ذکر شود، من یک راهنمای سریع نحوه انجام آن را بدون توضیحات دقیق ارائه می‌دهم. بنابراین لطفاً با من همراه باشید :).

## کمک بیشتر

در اینجا یک نکته اضافی برای استفاده از راهنمای کمک وجود دارد: فرض کنید می‌خواهید بیشتر درباره اینکه `Ctrl-P` در حالت وارد کردن چه کاری انجام می‌دهد یاد بگیرید. اگر فقط برای `:h CTRL-P` جستجو کنید، به `Ctrl-P` حالت عادی هدایت خواهید شد. این همان کمکی نیست که شما به دنبال آن هستید. در این مورد، به جای آن، برای `:h i_CTRL-P` جستجو کنید. `i_` اضافه شده نمایانگر حالت وارد کردن است. به کدام حالت تعلق دارد توجه کنید.

## نحو

بیشتر عبارات مرتبط با دستورات یا کد در حالت کد (`like this`) هستند.

رشته‌ها با یک جفت علامت نقل قول دوتایی ("like this") احاطه شده‌اند.

دستورات Vim می‌توانند خلاصه شوند. به عنوان مثال، `:join` می‌تواند به صورت `:j` خلاصه شود. در سرتاسر راهنما، من توصیف‌های مختصر و طولانی را ترکیب خواهم کرد. برای دستورات که در این راهنما به‌ندرت استفاده می‌شوند، من از نسخه طولانی استفاده خواهم کرد. برای دستورات که به‌طور مکرر استفاده می‌شوند، من از نسخه مختصر استفاده خواهم کرد. از این عدم انسجام عذرخواهی می‌کنم. به طور کلی، هر زمان که یک دستور جدید را مشاهده کردید، همیشه آن را در `:help` بررسی کنید تا اختصارات آن را ببینید.

## Vimrc

در نقاط مختلف راهنما، به گزینه‌های vimrc اشاره می‌کنم. اگر شما تازه‌کار هستید، vimrc مانند یک فایل پیکربندی است.

Vimrc تا فصل ۲۱ پوشش داده نخواهد شد. برای وضوح، من به‌طور مختصر در اینجا نشان می‌دهم که چگونه آن را تنظیم کنید.

فرض کنید شما نیاز دارید گزینه شماره‌ها را تنظیم کنید (`set number`). اگر هنوز vimrc ندارید، یکی بسازید. معمولاً در دایرکتوری خانگی شما قرار دارد و نام آن `.vimrc` است. بسته به سیستم‌عامل شما، مکان ممکن است متفاوت باشد. در macOS، من آن را در `~/.vimrc` دارم. برای دیدن اینکه شما باید کجا آن را قرار دهید، به `:h vimrc` مراجعه کنید.

درون آن، `set number` را اضافه کنید. آن را ذخیره کنید (`:w`)، سپس منبع آن را بارگذاری کنید (`:source %`). اکنون باید شماره خطوط را در سمت چپ مشاهده کنید.

به‌طور متناوب، اگر نمی‌خواهید تغییر تنظیمات دائمی ایجاد کنید، می‌توانید همیشه دستور `set` را به‌صورت آنلاین اجرا کنید، با اجرای `:set number`. نقطه ضعف این روش این است که این تنظیم موقتی است. وقتی Vim را ببندید، گزینه ناپدید می‌شود.

از آنجا که ما در حال یادگیری درباره Vim و نه Vi هستیم، یک تنظیم که شما باید داشته باشید گزینه `nocompatible` است. `set nocompatible` را در vimrc خود اضافه کنید. بسیاری از ویژگی‌های خاص Vim زمانی که با گزینه `compatible` اجرا می‌شود غیرفعال هستند.

به‌طور کلی، هر زمان که یک بخش به گزینه vimrc اشاره کند، فقط آن گزینه را به vimrc اضافه کنید، آن را ذخیره کنید و منبع آن را بارگذاری کنید.

## آینده، خطاها، سوالات

انتظار می‌رود که در آینده به‌روزرسانی‌های بیشتری انجام شود. اگر هر گونه خطا یا سوالی دارید، لطفاً احساس راحتی کنید که با من تماس بگیرید.

من همچنین چند فصل دیگر را برنامه‌ریزی کرده‌ام، بنابراین در انتظار باشید!

## من می‌خواهم ترفندهای بیشتری از Vim یاد بگیرم

برای یادگیری بیشتر درباره Vim، لطفاً [@learnvim](https://twitter.com/learnvim) را دنبال کنید.

## تشکر و قدردانی

این راهنما بدون برام مولنار برای ایجاد Vim، همسرم که در طول این سفر بسیار صبور و حمایتگر بود، تمام [مشارکت‌کنندگان](https://github.com/iggredible/Learn-Vim/graphs/contributors) پروژه learn-vim، جامعه Vim و بسیاری دیگر که ذکر نشده‌اند، ممکن نبود.

متشکرم. شما همه به ویرایش متن لذت‌بخش کمک می‌کنید :)