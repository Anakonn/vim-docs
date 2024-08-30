---
description: Bu belge, Vimscript veri türlerini kullanarak temel programlar yazmayı,
  koşullu ifadeler ve döngüler ile karşılaştırmalı operatörleri öğretmektedir.
title: Ch26. Vimscript Conditionals and Loops
---

Temel veri türlerinin ne olduğunu öğrendikten sonra, bir temel program yazmaya başlamak için bunları bir araya getirmeyi öğrenmek bir sonraki adımdır. Temel bir program, koşullu ifadeler ve döngülerden oluşur.

Bu bölümde, koşullu ifadeler ve döngüler yazmak için Vimscript veri türlerini nasıl kullanacağınızı öğreneceksiniz.

## İlişkisel Operatörler

Vimscript ilişkisel operatörleri, birçok programlama diline benzer:

```shell
a == b		eşit
a != b		eşit değil
a >  b		büyüktür
a >= b		büyük veya eşit
a <  b		küçüktür
a <= b		küçük veya eşit
```

Örneğin:

```shell
:echo 5 == 5
:echo 5 != 5
:echo 10 > 5
:echo 10 >= 5
:echo 10 < 5
:echo 5 <= 5
```

Aritmetik bir ifadede dizelerin sayılara dönüştürüldüğünü hatırlayın. Burada Vim de eşitlik ifadesinde dizeleri sayılara dönüştürür. "5foo" 5'e (doğru) dönüştürülür:

```shell
:echo 5 == "5foo"
" true döner
```

Ayrıca, "foo5" gibi sayısal olmayan bir karakterle başlayan bir dize yazarsanız, dize 0 (yanlış) sayısına dönüştürülür.

```shell
echo 5 == "foo5"
" false döner
```

### Dize Mantık Operatörleri

Vim, dizeleri karşılaştırmak için daha fazla ilişkisel operatöre sahiptir:

```shell
a =~ b
a !~ b
```

Örnekler:

```shell
let str = "zengin kahvaltı"

echo str =~ "zengin"
" true döner

echo str =~ "akşam yemeği"
" false döner

echo str !~ "akşam yemeği"
" true döner
```

`=~` operatörü, verilen dizeye karşı bir regex eşleşmesi yapar. Yukarıdaki örnekte, `str =~ "zengin"` true döner çünkü `str` "zengin" desenini *içerir*. Her zaman `==` ve `!=` kullanabilirsiniz, ancak bunları kullanmak, ifadeyi tüm dizeye karşı karşılaştırır. `=~` ve `!~` daha esnek seçeneklerdir.

```shell
echo str == "zengin"
" false döner

echo str == "zengin kahvaltı"
" true döner
```

Bunu deneyelim. Büyük "Z" harfine dikkat edin:

```shell
echo str =~ "Zengin"
" true
```

"Büyük Z" olmasına rağmen true döner. İlginç... Görünüşe göre Vim ayarım büyük/küçük harf duyarsız olacak şekilde ayarlanmış (`set ignorecase`), bu yüzden Vim eşitlik kontrolü yaparken ayarlarımı kullanır ve büyük/küçük harf duyarlılığını göz ardı eder. Eğer büyük/küçük harf duyarsızlığını kapatırsam (`set noignorecase`), karşılaştırma artık false döner.

```shell
set noignorecase
echo str =~ "Zengin"
" büyük/küçük harf önemli olduğu için false döner

set ignorecase
echo str =~ "Zengin"
" büyük/küçük harf önemli olmadığı için true döner
```

Eğer başkaları için bir eklenti yazıyorsanız, bu zor bir durumdur. Kullanıcı `ignorecase` mi yoksa `noignorecase` mi kullanıyor? Kesinlikle kullanıcılarınızı büyük/küçük harf seçeneğini değiştirmeye zorlamak istemezsiniz. Peki ne yapmalısınız?

Neyse ki, Vim her zaman büyük/küçük harfi göz ardı edebilen veya eşleştirebilen bir operatöre sahiptir. Her zaman büyük/küçük harf eşleştirmek için sonuna `#` ekleyin.

```shell
set ignorecase
echo str =~# "zengin"
" true döner

echo str =~# "ZENGİN"
" false döner

set noignorecase
echo str =~# "zengin"
" true döner

echo str =~# "ZENGİN"
" false döner

echo str !~# "ZENGİN"
" true döner
```

Karşılaştırma yaparken her zaman büyük/küçük harfi göz ardı etmek için sonuna `?` ekleyin:

```shell
set ignorecase
echo str =~? "zengin"
" true döner

echo str =~? "ZENGİN"
" true döner

set noignorecase
echo str =~? "zengin"
" true döner

echo str =~? "ZENGİN"
" true döner

echo str !~? "ZENGİN"
" false döner
```

Her zaman büyük/küçük harfi eşleştirmek için `#` kullanmayı tercih ederim ve güvenli tarafta kalırım.

## If

Artık Vim'in eşitlik ifadelerini gördüğünüze göre, temel bir koşullu operatör olan `if` ifadesine değinelim.

En azından, sözdizimi şöyle:

```shell
if {clause}
  {some expression}
endif
```

Durum analizini `elseif` ve `else` ile genişletebilirsiniz.

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

Örneğin, [vim-signify](https://github.com/mhinz/vim-signify) eklentisi, Vim ayarlarınıza bağlı olarak farklı bir kurulum yöntemi kullanır. Aşağıda, `if` ifadesini kullanarak `readme` dosyalarından kurulum talimatı verilmiştir:

```shell
if has('nvim') || has('patch-8.0.902')
  Plug 'mhinz/vim-signify'
else
  Plug 'mhinz/vim-signify', { 'branch': 'legacy' }
endif
```

## Üçlü İfade

Vim, tek satırlık bir durum analizi için bir üçlü ifade sunar:

```shell
{predicate} ? expressiontrue : expressionfalse
```

Örneğin:

```shell
echo 1 ? "Ben doğrudurum" : "Ben yanlışımdır"
```

1 doğru olduğu için, Vim "Ben doğrudurum" yazar. Diyelim ki, belirli bir saatten sonra Vim kullanıyorsanız arka planı karanlık olarak ayarlamak istiyorsunuz. Bunu vimrc'ye ekleyin:

```shell
let &background = strftime("%H") < 18 ? "açık" : "karanlık"
```

`&background`, Vim'deki `'background'` seçeneğidir. `strftime("%H")` mevcut saati saat cinsinden döndürür. Eğer saat 18:00 olmamışsa, açık bir arka plan kullanın. Aksi takdirde, karanlık bir arka plan kullanın.

## veya

Mantıksal "veya" (`||`), birçok programlama dilinde olduğu gibi çalışır.

```shell
{Yanlış ifade}  || {Yanlış ifade}   false
{Yanlış ifade}  || {Doğru ifade}    true
{Doğru ifade} || {Yanlış ifade}   true
{Doğru ifade} || {Doğru ifade}    true
```

Vim ifadeyi değerlendirir ve ya 1 (doğru) ya da 0 (yanlış) döner.

```shell
echo 5 || 0
" 1 döner

echo 5 || 5
" 1 döner

echo 0 || 0
" 0 döner

echo "foo5" || "foo5"
" 0 döner

echo "5foo" || "foo5"
" 1 döner
```

Eğer mevcut ifade doğru olarak değerlendirilirse, sonraki ifade değerlendirilmeyecek.

```shell
let bir_düzine = 12

echo bir_düzine || iki_düzine
" 1 döner

echo iki_düzine || bir_düzine
" hata döner
```

Not edin ki `iki_düzine` asla tanımlanmadı. `bir_düzine || iki_düzine` ifadesi hata vermez çünkü `bir_düzine` önce değerlendirilir ve doğru olduğu bulunur, bu yüzden Vim `iki_düzine`'yi değerlendirmez.

## ve

Mantıksal "ve" (`&&`), mantıksal veya'nın tamamlayıcısıdır.

```shell
{Yanlış İfade}  && {Yanlış İfade}   false
{Yanlış ifade}  && {Doğru ifade}    false
{Doğru İfade} && {Yanlış İfade}   false
{Doğru ifade} && {Doğru ifade}    true
```

Örneğin:

```shell
echo 0 && 0
" 0 döner

echo 0 && 10
" 0 döner
```

`&&` bir ifadeyi, ilk yanlış ifadeyi gördüğünde değerlendirir. Örneğin, `doğru && doğru` ifadesi her ikisini de değerlendirir ve `doğru` döner. Eğer `doğru && yanlış && doğru` ifadesi varsa, ilk `doğru`yu değerlendirir ve ilk `yanlış`ta durur. Üçüncü `doğru`yu değerlendirmez.

```shell
let bir_düzine = 12
echo bir_düzine && 10
" 1 döner

echo bir_düzine && v:false
" 0 döner

echo bir_düzine && iki_düzine
" hata döner

echo exists("bir_düzine") && bir_düzine == 12
" 1 döner
```

## için

`for` döngüsü genellikle liste veri türü ile birlikte kullanılır.

```shell
let kahvaltılar = ["pankek", "waffle", "yumurta"]

for kahvaltı in kahvaltılar
  echo kahvaltı
endfor
```

İç içe liste ile çalışır:

```shell
let öğünler = [["kahvaltı", "pankek"], ["öğle", "balık"], ["akşam", "makarna"]]

for [öğün_türü, yiyecek] in öğünler
  echo "Ben " . yiyecek . " için " . öğün_türü yiyorum
endfor
```

Teknik olarak, `for` döngüsünü `keys()` yöntemi ile bir sözlük ile kullanabilirsiniz.

```shell
let içecekler = #{kahvaltı: "süt", öğle: "portakal suyu", akşam: "su"}
for içecek_türü in keys(içecekler)
  echo "Ben " . içecekler[içecek_türü] . " için " . içecek_türü içiyorum
endfor
```

## While

Diğer bir yaygın döngü `while` döngüsüdür.

```shell
let sayıcı = 1
while sayıcı < 5
  echo "Sayaç: " . sayıcı
  let sayıcı += 1
endwhile
```

Mevcut satırdan son satıra kadar içeriği almak için:

```shell
let mevcut_satır = line(".")
let son_satır = line("$")

while mevcut_satır <= son_satır
  echo getline(mevcut_satır)
  let mevcut_satır += 1
endwhile
```

## Hata Yönetimi

Çoğu zaman programınız beklediğiniz gibi çalışmaz. Sonuç olarak, sizi bir döngüye sokar (kelime oyunu). İhtiyacınız olan şey doğru bir hata yönetimidir.

### Break

`while` veya `for` döngüsü içinde `break` kullandığınızda, döngüyü durdurur.

Dosyanın başından mevcut satıra kadar metinleri almak için, ancak "donut" kelimesini gördüğünüzde durun:

```shell
let satır = 0
let son_satır = line("$")
let toplam_kelime = ""

while satır <= son_satır
  let satır += 1
  let satır_metni = getline(satır)
  if satır_metni =~# "donut"
    break
  endif
  echo satır_metni
  let toplam_kelime .= satır_metni . " "
endwhile

echo toplam_kelime
```

Eğer metniniz şöyleyse:

```shell
bir
iki
üç
donut
dört
beş
```

Yukarıdaki `while` döngüsünü çalıştırmak "bir iki üç" verir ve geri kalan metni vermez çünkü döngü "donut" ile eşleştiğinde kırılır.

### Continue

`continue` yöntemi, bir döngü sırasında çağrıldığında `break` ile benzer. Fark, döngüden çıkmak yerine, sadece mevcut yinelemeyi atlamasıdır.

Diyelim ki aynı metne sahipsiniz ama `break` yerine `continue` kullanıyorsunuz:

```shell
let satır = 0
let son_satır = line("$")
let toplam_kelime = ""

while satır <= son_satır
  let satır += 1
  let satır_metni = getline(satır)
  if satır_metni =~# "donut"
    continue
  endif
  echo satır_metni
  let toplam_kelime .= satır_metni . " "
endwhile

echo toplam_kelime
```

Bu sefer `bir iki üç dört beş` döner. "donut" kelimesinin bulunduğu satırı atlar, ancak döngü devam eder.
### try, finally ve catch

Vim, hataları yönetmek için `try`, `finally` ve `catch` kullanır. Bir hatayı simüle etmek için `throw` komutunu kullanabilirsiniz.

```shell
try
  echo "Try"
  throw "Nope"
endtry
```

Bunu çalıştırın. Vim, `"Exception not caught: Nope` hatasıyla şikayet edecektir.

Şimdi bir catch bloğu ekleyelim:

```shell
try
  echo "Try"
  throw "Nope"
catch
  echo "Caught it"
endtry
```

Artık hiçbir hata yok. "Try" ve "Caught it" ifadelerini görmelisiniz.

`catch`'i kaldırıp bir `finally` ekleyelim:

```shell
try
  echo "Try"
  throw "Nope"
  echo "You won't see me"
finally
  echo "Finally"
endtry
```

Bunu çalıştırın. Artık Vim hatayı ve "Finally" ifadesini gösterir.

Hepsini bir araya getirelim:

```shell
try
  echo "Try"
  throw "Nope"
catch
  echo "Caught it"
finally
  echo "Finally"
endtry
```

Bu sefer Vim hem "Caught it" hem de "Finally" ifadelerini gösterir. Hata gösterilmez çünkü Vim hatayı yakalamıştır.

Hatalar farklı yerlerden gelir. Bir diğer hata kaynağı, aşağıdaki gibi var olmayan bir fonksiyonu çağırmaktır: `Nope()`:

```shell
try
  echo "Try"
  call Nope()
catch
  echo "Caught it"
finally
  echo "Finally"
endtry
```

`catch` ile `finally` arasındaki fark, `finally`'nin her zaman çalışmasıdır, hata olsun ya da olmasın; `catch` ise yalnızca kodunuz bir hata aldığında çalışır.

Belirli bir hatayı `:catch` ile yakalayabilirsiniz. `:h :catch`'e göre:

```shell
catch /^Vim:Interrupt$/.             " kesintileri yakala (CTRL-C)
catch /^Vim\\%((\\a\\+)\\)\\=:E/.    " tüm Vim hatalarını yakala
catch /^Vim\\%((\\a\\+)\\)\\=:/.     " hataları ve kesintileri yakala
catch /^Vim(write):/.                " :write içindeki tüm hataları yakala
catch /^Vim\\%((\\a\\+)\\)\\=:E123:/ " hata E123'ü yakala
catch /my-exception/.                " kullanıcı istisnasını yakala
catch /.*/                           " her şeyi yakala
catch.                               " /.*/ ile aynı
```

Bir `try` bloğu içinde, bir kesinti yakalanabilir bir hata olarak kabul edilir.

```shell
try
  catch /^Vim:Interrupt$/
  sleep 100
endtry
```

Vimrc'nizde, [gruvbox](https://github.com/morhetz/gruvbox) gibi özel bir renk şeması kullanıyorsanız ve renk şeması dizinini yanlışlıkla silerseniz ama yine de vimrc'nizde `colorscheme gruvbox` satırı varsa, `source` ettiğinizde Vim bir hata verecektir. Bunu düzeltmek için vimrc'ime şunu ekledim:

```shell
try
  colorscheme gruvbox
catch
  colorscheme default
endtry
```

Artık `gruvbox` dizini olmadan vimrc'yi `source` ederseniz, Vim `colorscheme default` kullanacaktır.

## Koşullu İfadeleri Akıllıca Öğrenin

Önceki bölümde, Vim temel veri türlerini öğrendiniz. Bu bölümde, bunları birleştirerek koşullu ifadeler ve döngüler kullanarak temel programlar yazmayı öğrendiniz. Bunlar programlamanın yapı taşlarıdır.

Sonraki adımda, değişken kapsamlarını öğrenelim.