---
description: Vimscript'te fonksiyonlar, dilin öğreniminde soyutlama sağlar. Bu bölümde,
  fonksiyonların nasıl çalıştığını ve yazım kurallarını keşfedeceksiniz.
title: Ch28. Vimscript Functions
---

Fonksiyonlar, soyutlama araçlarıdır ve yeni bir dil öğrenmenin üçüncü unsurudur.

Önceki bölümlerde, Vimscript yerel fonksiyonlarını (`len()`, `filter()`, `map()`, vb.) ve özel fonksiyonları görmüştünüz. Bu bölümde, fonksiyonların nasıl çalıştığını daha derinlemesine öğreneceksiniz.

## Fonksiyon Söz Dizimi Kuralları

Temelde, bir Vimscript fonksiyonu aşağıdaki söz dizimine sahiptir:

```shell
function {FonksiyonAdı}()
  {bir şey yap}
endfunction
```

Bir fonksiyon tanımı büyük harfle başlamalıdır. `function` anahtar kelimesi ile başlar ve `endfunction` ile biter. Aşağıda geçerli bir fonksiyon bulunmaktadır:

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

Aşağıdaki geçerli bir fonksiyon değildir çünkü büyük harfle başlamamaktadır.

```shell
function tasty()
  echo "Tasty"
endfunction
```

Bir fonksiyonu script değişkeni (`s:`) ile önceliklendirdiğinizde, küçük harfle kullanabilirsiniz. `function s:tasty()` geçerli bir isimdir. Vim'in büyük harfli isim kullanmanızı istemesinin nedeni, Vim'in yerleşik fonksiyonlarıyla (tamamen küçük harf) karışıklığı önlemektir.

Bir fonksiyon adı bir rakamla başlayamaz. `1Tasty()` geçerli bir fonksiyon adı değildir, ancak `Tasty1()` geçerlidir. Bir fonksiyon ayrıca `_` dışında alfasayısal olmayan karakterler içeremez. `Tasty-food()`, `Tasty&food()` ve `Tasty.food()` geçerli fonksiyon adları değildir. `Tasty_food()` *geçerlidir*.

Aynı isimde iki fonksiyon tanımlarsanız, Vim `Tasty` fonksiyonunun zaten mevcut olduğuna dair bir hata verecektir. Aynı isimdeki önceki fonksiyonu geçersiz kılmak için, `function` anahtar kelimesinden sonra bir `!` ekleyin.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

## Mevcut Fonksiyonları Listeleme

Vim'deki tüm yerleşik ve özel fonksiyonları görmek için `:function` komutunu çalıştırabilirsiniz. `Tasty` fonksiyonunun içeriğini görmek için `:function Tasty` komutunu çalıştırabilirsiniz.

Ayrıca, `:function /pattern` ile desenle fonksiyonları arayabilirsiniz, bu Vim'in arama navigasyonuna (`/pattern`) benzer. "map" ifadesini içeren tüm fonksiyonları aramak için `:function /map` komutunu çalıştırın. Harici eklentiler kullanıyorsanız, Vim bu eklentilerde tanımlı fonksiyonları gösterecektir.

Bir fonksiyonun nereden geldiğini görmek istiyorsanız, `:function` komutuyla birlikte `:verbose` komutunu kullanabilirsiniz. "map" kelimesini içeren tüm fonksiyonların nereden geldiğini görmek için:

```shell
:verbose function /map
```

Bunu çalıştırdığımda birçok sonuç aldım. Bu sonuç, `fzf#vim#maps` otomatik yükleme fonksiyonunun (özetlemek için, bkz. Bölüm 23) `~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim` dosyasının 1263. satırında yazıldığını gösteriyor. Bu, hata ayıklama için faydalıdır.

```shell
function fzf#vim#maps(mode, ...)
        Last set from ~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim line 1263
```

## Bir Fonksiyonu Kaldırma

Mevcut bir fonksiyonu kaldırmak için `:delfunction {Fonksiyon_adı}` komutunu kullanın. `Tasty` fonksiyonunu silmek için `:delfunction Tasty` komutunu çalıştırın.

## Fonksiyonun Dönüş Değeri

Bir fonksiyonun bir değer döndürmesi için, ona açık bir `return` değeri geçmelisiniz. Aksi takdirde, Vim otomatik olarak 0'lık bir örtük değer döndürür.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

Boş bir `return` da 0 değerine eşdeğerdir.

```shell
function! Tasty()
  echo "Tasty"
  return
endfunction
```

Yukarıdaki fonksiyonu kullanarak `:echo Tasty()` çalıştırırsanız, Vim "Tasty" yazdıktan sonra 0 döndürür, bu örtük dönüş değeridir. `Tasty()`'nin "Tasty" değerini döndürmesi için bunu yapabilirsiniz:

```shell
function! Tasty()
  return "Tasty"
endfunction
```

Artık `:echo Tasty()` çalıştırdığınızda "Tasty" dizesini döndürür.

Bir fonksiyonu bir ifadede kullanabilirsiniz. Vim, o fonksiyonun dönüş değerini kullanacaktır. İfade `:echo Tasty() . " Food!"` "Tasty Food!" çıktısını verir.

## Resmi Argümanlar

`Tasty` fonksiyonunuza bir resmi argüman `food` geçmek için bunu yapabilirsiniz:

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

echo Tasty("pastry")
" returns "Tasty pastry"
```

`a:` son bölümde bahsedilen değişken kapsamlarından biridir. Bu, resmi parametre değişkenidir. Bu, Vim'in bir fonksiyondaki resmi parametre değerini almanın yoludur. Olmadan, Vim bir hata verecektir:

```shell
function! Tasty(food)
  return "Tasty " . food
endfunction

echo Tasty("pasta")
" returns "undefined variable name" error
```

## Fonksiyon Yerel Değişkeni

Önceki bölümde öğrenmediğiniz diğer değişkeni ele alalım: fonksiyon yerel değişkeni (`l:`).

Bir fonksiyon yazarken, içinde bir değişken tanımlayabilirsiniz:

```shell
function! Yummy()
  let location = "tummy"
  return "Yummy in my " . location
endfunction

echo Yummy()
" returns "Yummy in my tummy"
```

Bu bağlamda, `location` değişkeni `l:location` ile aynıdır. Bir fonksiyon içinde bir değişken tanımladığınızda, o değişken o fonksiyona *yereldir*. Bir kullanıcı `location` gördüğünde, bu kolayca bir küresel değişken olarak yanlış anlaşılabilir. Daha açıklayıcı olmayı tercih ettiğim için, bunun bir fonksiyon değişkeni olduğunu belirtmek için `l:` koymayı tercih ederim.

`l:count` kullanmanın bir diğer nedeni, Vim'in normal değişkenler gibi görünen özel değişkenlere sahip olmasıdır. `v:count` bir örnektir. Bunun `count` takma adı vardır. Vim'de `count` çağırmak, `v:count` çağırmakla aynıdır. Bu özel değişkenlerden birini yanlışlıkla çağırmak kolaydır.

```shell
function! Calories()
  let count = "count"
  return "I do not " . count . " my calories"
endfunction

echo Calories()
" throws an error
```

Yukarıdaki yürütme, `let count = "Count"` ifadesinin Vim'in özel değişkeni `v:count`'ı yeniden tanımlamaya çalıştığı için bir hata verir. Özel değişkenlerin (`v:`) yalnızca okunabilir olduğunu hatırlayın. Bunu değiştiremezsiniz. Bunu düzeltmek için `l:count` kullanın:

```shell
function! Calories()
  let l:count = "count"
  return "I do not " . l:count . " my calories"
endfunction

echo Calories()
" returns "I do not count my calories"
```

## Bir Fonksiyonu Çağırma

Vim'de bir fonksiyonu çağırmak için `:call` komutu vardır.

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

call Tasty("gravy")
```

`call` komutu dönüş değerini çıktı olarak vermez. Bunu `echo` ile çağıralım.

```shell
echo call Tasty("gravy")
```

Hata alıyorsunuz. Yukarıdaki `call` komutu bir komut satırı komutudur (`:call`). Yukarıdaki `echo` komutu da bir komut satırı komutudur (`:echo`). Bir komut satırı komutunu başka bir komut satırı komutuyla çağırmak mümkün değildir. `call` komutunun farklı bir versiyonunu deneyelim:

```shell
echo call("Tasty", ["gravy"])
" returns "Tasty gravy"
```

Herhangi bir karışıklığı gidermek için, iki farklı `call` komutu kullandınız: `:call` komut satırı komutu ve `call()` fonksiyonu. `call()` fonksiyonu, ilk argüman olarak fonksiyon adını (dize) ve ikinci argüman olarak resmi parametreleri (liste) alır.

`:call` ve `call()` hakkında daha fazla bilgi edinmek için `:h call()` ve `:h :call`'a bakın.

## Varsayılan Argüman

Bir fonksiyon parametresine varsayılan bir değer sağlayabilirsiniz. Eğer `Breakfast` fonksiyonunu yalnızca bir argümanla çağırırsanız, `beverage` argümanı "milk" varsayılan değerini kullanacaktır.

```shell
function! Breakfast(meal, beverage = "Milk")
  return "I had " . a:meal . " and " . a:beverage . " for breakfast"
endfunction

echo Breakfast("Hash Browns")
" returns I had hash browns and milk for breakfast

echo Breakfast("Cereal", "Orange Juice")
" returns I had Cereal and Orange Juice for breakfast
```

## Değişken Argümanlar

Değişken bir argümanı üç nokta (`...`) ile geçebilirsiniz. Değişken argüman, kullanıcının ne kadar değişken vereceğini bilmediğinizde faydalıdır.

Varsayılan olarak bir sınırsız yemek büfesi oluşturduğunuzu varsayalım (müşterinizin ne kadar yiyecek yiyeceğini asla bilemezsiniz):

```shell
function! Buffet(...)
  return a:1
endfunction
```

`echo Buffet("Noodles")` çalıştırırsanız, "Noodles" çıktısını alırsınız. Vim, `...`'ye geçirilen *ilk* argümanı yazdırmak için `a:1` kullanır, 20'ye kadar (`a:1` birinci argüman, `a:2` ikinci argüman, vb.). `echo Buffet("Noodles", "Sushi")` çalıştırırsanız, yine sadece "Noodles" görüntülenir, bunu güncelleyelim:

```shell
function! Buffet(...)
  return a:1 . " " . a:2
endfunction

echo Buffet("Noodles", "Sushi")
" returns "Noodles Sushi"
```

Bu yaklaşımın sorunu, şimdi `echo Buffet("Noodles")` (sadece bir değişken ile) çalıştırdığınızda, Vim `a:2` değişkeninin tanımsız olduğu konusunda şikayet eder. Kullanıcının verdiği tam olarak neyi görüntüleyecek kadar esnek hale nasıl getirebilirsiniz?

Neyse ki, Vim, `...`'ye geçirilen argümanların *sayısını* göstermek için özel bir değişken `a:0` sağlar.

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

Bununla, argümanın uzunluğunu kullanarak yineleyebilirsiniz.

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

Küme parantezleri `a:{l:food_counter}` bir dize interpolasyonudur, `food_counter` sayacının değerini kullanarak resmi parametre argümanlarını `a:1`, `a:2`, `a:3`, vb. çağırır.

```shell
echo Buffet("Noodles")
" returns "Noodles"

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returns everything you passed: "Noodles Sushi Ice cream Tofu Mochi"
```

Değişken argümanın bir özel değişkeni daha vardır: `a:000`. Bu, tüm değişken argümanlarının liste formatındaki değeridir.

```shell
function! Buffet(...)
  return a:000
endfunction

echo Buffet("Noodles")
" returns ["Noodles"]

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returns ["Noodles", "Sushi", "Ice cream", "Tofu", "Mochi"]
```

Fonksiyonu bir `for` döngüsü kullanacak şekilde yeniden düzenleyelim:

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
## Aralık

Bir *aralıklı* Vimscript fonksiyonu tanımlamak için fonksiyon tanımının sonuna `range` anahtar kelimesini ekleyebilirsiniz. Aralıklı bir fonksiyonun iki özel değişkeni vardır: `a:firstline` ve `a:lastline`.

```shell
function! Breakfast() range
  echo a:firstline
  echo a:lastline
endfunction
```

Eğer 100. satırdaysanız ve `call Breakfast()` çalıştırırsanız, hem `firstline` hem de `lastline` için 100 görüntülenecektir. Eğer 101 ile 105 arasındaki satırları görsel olarak vurgularsanız (`v`, `V` veya `Ctrl-V`) ve `call Breakfast()` çalıştırırsanız, `firstline` 101 ve `lastline` 105 olarak görüntülenecektir. `firstline` ve `lastline`, fonksiyonun çağrıldığı minimum ve maksimum aralığı gösterir.

`:call` kullanarak bir aralık geçebilirsiniz. Eğer `:11,20call Breakfast()` çalıştırırsanız, `firstline` için 11 ve `lastline` için 20 görüntülenecektir.

"Vimscript fonksiyonu aralık kabul ediyor, ama `line(".")` ile satır numarasını alamaz mıyım? Aynı şeyi yapmaz mı?" diye sorabilirsiniz.

İyi bir soru. Eğer kastettiğiniz bu ise:

```shell
function! Breakfast()
  echo line(".")
endfunction
```

`:11,20call Breakfast()` çağrısı `Breakfast` fonksiyonunu 10 kez çalıştırır (aralıktaki her satır için bir kez). Eğer `range` argümanını geçseydiniz:

```shell
function! Breakfast() range
  echo line(".")
endfunction
```

`11,20call Breakfast()` çağrısı `Breakfast` fonksiyonunu *bir kez* çalıştırır.

Eğer bir `range` anahtar kelimesi geçerseniz ve `call` üzerinde sayısal bir aralık (örneğin `11,20`) geçerseniz, Vim yalnızca o fonksiyonu bir kez çalıştırır. Eğer `range` anahtar kelimesini geçmezseniz ve `call` üzerinde sayısal bir aralık (örneğin `11,20`) geçerseniz, Vim o fonksiyonu aralığa bağlı olarak N kez çalıştırır (bu durumda, N = 10).

## Sözlük

Bir fonksiyonu bir sözlük öğesi olarak eklemek için bir fonksiyon tanımlarken `dict` anahtar kelimesini ekleyebilirsiniz.

Eğer `breakfast` öğenizi döndüren bir `SecondBreakfast` fonksiyonunuz varsa:

```shell
function! SecondBreakfast() dict
  return self.breakfast
endfunction
```

Bu fonksiyonu `meals` sözlüğüne ekleyelim:

```shell
let meals = {"breakfast": "pankek", "second_breakfast": function("SecondBreakfast"), "lunch": "makarna"}

echo meals.second_breakfast()
" "pankek" döner
```

`dict` anahtar kelimesi ile, anahtar değişken `self`, fonksiyonun saklandığı sözlüğü ifade eder (bu durumda, `meals` sözlüğü). `self.breakfast` ifadesi, `meals.breakfast` ile eşittir.

Bir fonksiyonu bir sözlük nesnesine eklemenin alternatif bir yolu, bir ad alanı kullanmaktır.

```shell
function! meals.second_lunch()
  return self.lunch
endfunction

echo meals.second_lunch()
" "makarna" döner
```

Ad alanı ile, `dict` anahtar kelimesini kullanmanıza gerek yoktur.

## Funcref

Funcref, bir fonksiyona referanstır. Vimscript'in temel veri türlerinden biridir ve Ch. 24'te bahsedilmiştir.

Yukarıdaki `function("SecondBreakfast")` ifadesi bir funcref örneğidir. Vim, bir fonksiyon adı (string) geçirdiğinizde bir funcref döndüren yerleşik bir `function()` fonksiyonuna sahiptir.

```shell
function! Breakfast(item)
  return "Kahvaltıda " . a:item . " yiyorum"
endfunction

let Breakfastify = Breakfast
" hata döner

let Breakfastify = function("Breakfast")

echo Breakfastify("yulaf ezmesi")
" "Kahvaltıda yulaf ezmesi yiyorum" döner

echo Breakfastify("pankek")
" "Kahvaltıda pankek yiyorum" döner
```

Vim'de bir fonksiyonu bir değişkene atamak istiyorsanız, doğrudan `let MyVar = MyFunc` şeklinde atayamazsınız. `let MyVar = function("MyFunc")` şeklinde `function()` fonksiyonunu kullanmanız gerekir.

Funcref'i haritalar ve filtrelerle kullanabilirsiniz. Haritalar ve filtrelerin ilk argüman olarak bir indeks ve ikinci argüman olarak yinelemeli değeri geçeceğini unutmayın.

```shell
function! Breakfast(index, item)
  return "Kahvaltıda " . a:item . " yiyorum"
endfunction

let breakfast_items = ["pankek", "kızarmış patates", "waffle"]
let first_meals = map(breakfast_items, function("Breakfast"))

for meal in first_meals
  echo meal
endfor
```

## Lambda

Haritalar ve filtrelerde fonksiyonları kullanmanın daha iyi bir yolu lambda ifadesini kullanmaktır (bazen isimsiz fonksiyon olarak bilinir). Örneğin:

```shell
let Plus = {x,y -> x + y}
echo Plus(1,2)
" 3 döner

let Tasty = { -> 'lezzetli'}
echo Tasty()
" "lezzetli" döner
```

Bir lambda ifadesinin içinden bir fonksiyonu çağırabilirsiniz:

```shell
function! Lunch(item)
  return "Öğle yemeğinde " . a:item . " yiyorum"
endfunction

let lunch_items = ["sushi", "ramen", "sashimi"]

let day_meals = map(lunch_items, {index, item -> Lunch(item)})

for meal in day_meals
  echo meal
endfor
```

Eğer lambda içinden fonksiyonu çağırmak istemiyorsanız, onu yeniden yapılandırabilirsiniz:

```shell
let day_meals = map(lunch_items, {index, item -> "Öğle yemeğinde " . item . " yiyorum"})
```

## Metot Zincirleme

Birçok Vimscript fonksiyonunu ve lambda ifadelerini ardışık olarak `->` ile zincirleyebilirsiniz. `->`'den sonra bir metot adı *boşluk olmadan* gelmelidir.

```shell
Source->Method1()->Method2()->...->MethodN()
```

Bir float'ı metot zincirleme kullanarak bir sayıya dönüştürmek için:

```shell
echo 3.14->float2nr()
" 3 döner
```

Daha karmaşık bir örnek yapalım. Diyelim ki, bir listedeki her öğenin ilk harfini büyük yapmak, sonra listeyi sıralamak ve ardından listeyi bir dize oluşturmak için birleştirmek istiyorsunuz.

```shell
function! Capitalizer(word)
  return substitute(a:word, "\^\.", "\\u&", "g")
endfunction

function! CapitalizeList(word_list)
  return map(a:word_list, {index, word -> Capitalizer(word)})
endfunction

let dinner_items = ["bruschetta", "antipasto", "calzone"]

echo dinner_items->CapitalizeList()->sort()->join(", ")
" "Antipasto, Bruschetta, Calzone" döner
```

Metot zincirleme ile, sıra daha kolay okunur ve anlaşılır hale gelir. Sadece `dinner_items->CapitalizeList()->sort()->join(", ")`'e bakarak ne olduğunu tam olarak anlayabiliyorum.

## Kapatma

Bir fonksiyon içinde bir değişken tanımladığınızda, o değişken yalnızca o fonksiyonun sınırları içinde var olur. Buna sözel kapsam denir.

```shell
function! Lunch()
  let appetizer = "karides"

  function! SecondLunch()
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

`appetizer`, `Lunch` fonksiyonu içinde tanımlanmıştır ve `SecondLunch` funcref'ini döndürür. `SecondLunch`'in `appetizer`'ı kullandığını fark edin, ancak Vimscript'te o değişkene erişimi yoktur. `echo Lunch()()` çalıştırmaya çalışırsanız, Vim tanımsız değişken hatası verecektir.

Bu sorunu çözmek için `closure` anahtar kelimesini kullanın. Yeniden yapılandıralım:

```shell
function! Lunch()
  let appetizer = "karides"

  function! SecondLunch() closure
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

Artık `echo Lunch()()` çalıştırdığınızda, Vim "karides" döndürecektir.

## Vimscript Fonksiyonlarını Akıllı Bir Şekilde Öğrenin

Bu bölümde, Vim fonksiyonunun anatomisini öğrendiniz. Fonksiyon davranışını değiştirmek için `range`, `dict` ve `closure` gibi farklı özel anahtar kelimeleri nasıl kullanacağınızı öğrendiniz. Ayrıca lambda kullanmayı ve birden fazla fonksiyonu zincirlemeyi de öğrendiniz. Fonksiyonlar, karmaşık soyutlamalar oluşturmak için önemli araçlardır.

Sonraki bölümde, öğrendiklerinizi bir araya getirip kendi eklentinizi yapalım.