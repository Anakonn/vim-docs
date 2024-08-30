---
description: Vim değişkenlerinin kaynakları ve kapsamları hakkında bilgi vererek,
  değişkenlerin nasıl tanımlanıp kullanıldığını açıklayan bir rehber.
title: Ch27. Vimscript Variable Scopes
---

Vimscript fonksiyonlarına dalmadan önce, Vim değişkenlerinin farklı kaynaklarını ve kapsamlarını öğrenelim.

## Değiştirilebilir ve Değiştirilemez Değişkenler

Vim'de bir değişkene `let` ile bir değer atayabilirsiniz:

```shell
let pancake = "pancake"
```

Daha sonra bu değişkeni istediğiniz zaman çağırabilirsiniz.

```shell
echo pancake
" "pancake" döner
```

`let` değiştirilebilir, yani gelecekte istediğiniz zaman değeri değiştirebilirsiniz.

```shell
let pancake = "pancake"
let pancake = "not waffles"

echo pancake
" "not waffles" döner
```

Bir ayarlanmış değişkenin değerini değiştirmek istediğinizde, hala `let` kullanmanız gerektiğini unutmayın.

```shell
let beverage = "milk"

beverage = "orange juice"
" bir hata fırlatır
```

Değiştirilemez bir değişkeni `const` ile tanımlayabilirsiniz. Değiştirilemez olduğundan, bir değişkenin değeri atandıktan sonra, onu farklı bir değerle yeniden atayamazsınız.

```shell
const waffle = "waffle"
const waffle = "pancake"
" bir hata fırlatır
```

## Değişken Kaynakları

Değişkenler için üç kaynak vardır: ortam değişkeni, seçenek değişkeni ve kayıt değişkeni.

### Ortam Değişkeni

Vim, terminal ortam değişkeninize erişebilir. Örneğin, terminalinizde `SHELL` ortam değişkeni mevcutsa, Vim'den buna şu şekilde erişebilirsiniz:

```shell
echo $SHELL
" $SHELL değerini döner. Benim durumumda, /bin/bash döner
```

### Seçenek Değişkeni

Vim seçeneklerine `&` ile erişebilirsiniz (bunlar `set` ile eriştiğiniz ayarlardır).

Örneğin, Vim'in hangi arka planı kullandığını görmek için şunu çalıştırabilirsiniz:

```shell
echo &background
" ya "light" ya da "dark" döner
```

Alternatif olarak, `background` seçeneğinin değerini görmek için her zaman `set background?` komutunu çalıştırabilirsiniz.

### Kayıt Değişkeni

Vim kayıtlarına (Bölüm 08) `@` ile erişebilirsiniz.

Diyelim ki "chocolate" değeri zaten a kaydında kaydedilmiş. Buna erişmek için `@a` kullanabilirsiniz. Ayrıca bunu `let` ile güncelleyebilirsiniz.

```shell
echo @a
" chocolate döner

let @a .= " donut"

echo @a
" "chocolate donut" döner
```

Artık `a` kaydından yapıştırdığınızda (`"ap`), "chocolate donut" dönecektir. Operatör `.=` iki dizeyi birleştirir. `let @a .= " donut"` ifadesi, `let @a = @a . " donut"` ile aynıdır.

## Değişken Kapsamları

Vim'de 9 farklı değişken kapsamı vardır. Bunları ön ek harflerinden tanıyabilirsiniz:

```shell
g:           Küresel değişken
{nothing}    Küresel değişken
b:           Tampon yerel değişken
w:           Pencere yerel değişken
t:           Sekme yerel değişken
s:           Kaynaklanmış Vimscript değişkeni
l:           Fonksiyon yerel değişkeni
a:           Fonksiyon resmi parametre değişkeni
v:           Yerleşik Vim değişkeni
```

### Küresel Değişken

"Normal" bir değişken tanımladığınızda:

```shell
let pancake = "pancake"
```

`pancake` aslında bir küresel değişkendir. Bir küresel değişken tanımladığınızda, bunları her yerden çağırabilirsiniz.

Bir değişkene `g:` ön eki eklemek de bir küresel değişken oluşturur.

```shell
let g:waffle = "waffle"
```

Bu durumda hem `pancake` hem de `g:waffle` aynı kapsamda bulunur. Her birini `g:` ile ya da onsuz çağırabilirsiniz.

```shell
echo pancake
" "pancake" döner

echo g:pancake
" "pancake" döner

echo waffle
" "waffle" döner

echo g:waffle
" "waffle" döner
```

### Tampon Değişkeni

`b:` ile ön eklenmiş bir değişken, bir tampon değişkenidir. Bir tampon değişkeni, mevcut tampona özgü bir değişkendir (Bölüm 02). Birden fazla tampon açık olduğunda, her tamponun kendi ayrı tampon değişkenleri listesi olacaktır.

Tampon 1'de:

```shell
const b:donut = "chocolate donut"
```

Tampon 2'de:

```shell
const b:donut = "blueberry donut"
```

Tampon 1'den `echo b:donut` çalıştırırsanız, "chocolate donut" döner. Tampon 2'den çalıştırırsanız, "blueberry donut" döner.

Bu arada, Vim'in mevcut tamponda yapılan tüm değişiklikleri takip eden *özel* bir tampon değişkeni `b:changedtick` vardır.

1. `echo b:changedtick` çalıştırın ve dönen sayıyı not edin.
2. Vim'de değişiklikler yapın.
3. Tekrar `echo b:changedtick` çalıştırın ve şimdi dönen sayıyı not edin.

### Pencere Değişkeni

`w:` ile ön eklenmiş bir değişken, bir pencere değişkenidir. Sadece o pencerede vardır.

Pencere 1'de:

```shell
const w:donut = "chocolate donut"
```

Pencere 2'de:

```shell
const w:donut = "raspberry donut"
```

Her pencerede, benzersiz değerler almak için `echo w:donut` çağırabilirsiniz.

### Sekme Değişkeni

`t:` ile ön eklenmiş bir değişken, bir sekme değişkenidir. Sadece o sekmede vardır.

Sekme 1'de:

```shell
const t:donut = "chocolate donut"
```

Sekme 2'de:

```shell
const t:donut = "blackberry donut"
```

Her sekmede, benzersiz değerler almak için `echo t:donut` çağırabilirsiniz.

### Script Değişkeni

`s:` ile ön eklenmiş bir değişken, bir script değişkenidir. Bu değişkenlere yalnızca o scriptin içinden erişilebilir.

Elinizde `dozen.vim` adında bir dosya varsa ve içinde:

```shell
let s:dozen = 12

function Consume()
  let s:dozen -= 1
  echo s:dozen " kaldı"
endfunction
```

Dosyayı `:source dozen.vim` ile kaynaklayın. Şimdi `Consume` fonksiyonunu çağırın:

```shell
:call Consume()
" "11 kaldı" döner

:call Consume()
" "10 kaldı" döner

:echo s:dozen
" Tanımsız değişken hatası
```

`Consume` çağırdığınızda, `s:dozen` değerinin beklendiği gibi azaldığını görürsünüz. `s:dozen` değerini doğrudan almaya çalıştığınızda, Vim bulamaz çünkü kapsam dışındasınız. `s:dozen` yalnızca `dozen.vim` içinden erişilebilir.

Her seferinde `dozen.vim` dosyasını kaynakladığınızda, `s:dozen` sayacı sıfırlanır. Eğer `s:dozen` değerini azaltma işlemi yapıyorsanız ve `:source dozen.vim` çalıştırırsanız, sayaç 12'ye sıfırlanır. Bu, dikkatsiz kullanıcılar için bir sorun olabilir. Bu durumu düzeltmek için kodu yeniden düzenleyin:

```shell
if !exists("s:dozen")
  let s:dozen = 12
endif

function Consume()
  let s:dozen -= 1
  echo s:dozen
endfunction
```

Artık `s:dozen` değerini azaltma işlemi yaparken `dozen.vim` dosyasını kaynakladığınızda, Vim `!exists("s:dozen")` ifadesini okur, bunun doğru olduğunu bulur ve değeri 12'ye sıfırlamaz.

### Fonksiyon Yerel ve Fonksiyon Resmi Parametre Değişkeni

Fonksiyon yerel değişkeni (`l:`) ve fonksiyon resmi değişkeni (`a:`) bir sonraki bölümde ele alınacaktır.

### Yerleşik Vim Değişkenleri

`v:` ile ön eklenmiş bir değişken, özel bir yerleşik Vim değişkenidir. Bu değişkenleri tanımlayamazsınız. Bazılarını zaten gördünüz.
- `v:version` hangi Vim sürümünü kullandığınızı söyler.
- `v:key` bir sözlükte gezinirken mevcut öğe değerini içerir.
- `v:val` bir `map()` veya `filter()` işlemi çalıştırırken mevcut öğe değerini içerir.
- `v:true`, `v:false`, `v:null` ve `v:none` özel veri türleridir.

Başka değişkenler de vardır. Vim yerleşik değişkenleri listesi için `:h vim-variable` veya `:h v:` kontrol edin.

## Vim Değişken Kapsamlarını Akıllıca Kullanma

Ortam, seçenek ve kayıt değişkenlerine hızlı bir şekilde erişebilmek, editörünüzü ve terminal ortamınızı özelleştirmek için geniş bir esneklik sağlar. Ayrıca, Vim'in belirli kısıtlamalar altında var olan 9 farklı değişken kapsamı olduğunu öğrendiniz. Bu benzersiz değişken türlerinden yararlanarak programınızı birbirinden ayırabilirsiniz.

Bu noktaya kadar geldiniz. Veri türleri, kombinasyon yolları ve değişken kapsamları hakkında bilgi edindiniz. Sadece bir şey kaldı: fonksiyonlar.