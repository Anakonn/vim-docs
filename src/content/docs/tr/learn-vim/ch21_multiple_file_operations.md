---
description: Vim'de birden fazla dosyada komut çalıştırmanın farklı yollarını öğrenin.
  Bu yöntemlerle düzenleme işlemlerinizi daha verimli hale getirin.
title: Ch21. Multiple File Operations
---

Birden fazla dosyada güncelleme yapabilmek, sahip olunması gereken başka bir yararlı düzenleme aracıdır. Daha önce, `cfdo` ile birden fazla metni nasıl güncelleyeceğinizi öğrendiniz. Bu bölümde, Vim'de birden fazla dosyayı düzenlemenin farklı yollarını öğreneceksiniz.

## Birden Fazla Dosyada Komut Çalıştırmanın Farklı Yolları

Vim, birden fazla dosyada komut çalıştırmak için sekiz yol sunar:
- arg listesi (`argdo`)
- buffer listesi (`bufdo`)
- pencere listesi (`windo`)
- sekme listesi (`tabdo`)
- quickfix listesi (`cdo`)
- quickfix listesi dosya bazında (`cfdo`)
- konum listesi (`ldo`)
- konum listesi dosya bazında (`lfdo`)

Pratikte, muhtemelen çoğu zaman yalnızca bir veya iki tanesini kullanacaksınız (ben şahsen `cdo` ve `argdo`yu diğerlerinden daha fazla kullanıyorum), ancak mevcut tüm seçenekler hakkında bilgi edinmek ve düzenleme tarzınıza uyanları kullanmak iyidir.

Sekiz komut öğrenmek göz korkutucu görünebilir. Ancak gerçekte, bu komutlar benzer şekilde çalışır. Birini öğrendikten sonra, diğerlerini öğrenmek daha kolay olacaktır. Hepsi aynı büyük fikri paylaşır: kendi kategorilerinin bir listesini oluşturun ve ardından çalıştırmak istediğiniz komutu onlara geçirin.

## Argüman Listesi

Argüman listesi en temel listedir. Bir dosya listesi oluşturur. file1, file2 ve file3'ten oluşan bir liste oluşturmak için şunu çalıştırabilirsiniz:

```shell
:args file1 file2 file3
```

Ayrıca bir joker karakter (`*`) geçirebilirsiniz, bu nedenle mevcut dizindeki tüm `.js` dosyalarının bir listesini yapmak istiyorsanız, şunu çalıştırın:

```shell
:args *.js
```

Mevcut dizindeki "a" ile başlayan tüm Javascript dosyalarının bir listesini yapmak istiyorsanız, şunu çalıştırın:

```shell
:args a*.js
```

Joker karakter, mevcut dizindeki herhangi bir dosya adı karakterinin bir veya daha fazlasını eşleştirir, ancak herhangi bir dizinde özyinelemeli olarak arama yapmanız gerekiyorsa ne olur? Çift joker karakteri (`**`) kullanabilirsiniz. Mevcut konumunuzdaki dizinler içindeki tüm Javascript dosyalarını almak için şunu çalıştırın:

```shell
:args **/*.js
```

`args` komutunu çalıştırdığınızda, mevcut buffer'ınız listedeki ilk öğeye geçecektir. Yeni oluşturduğunuz dosya listesini görüntülemek için `:args` komutunu çalıştırın. Listenizi oluşturduktan sonra, bunlar arasında geçiş yapabilirsiniz. `:first` sizi listedeki ilk öğeye koyar. `:last` sizi son öğeye koyar. Listeyi bir dosya ileri taşımak için `:next` komutunu çalıştırın. Listeyi bir dosya geri taşımak için `:prev` komutunu çalıştırın. Bir dosya ileri / geri taşımak ve değişiklikleri kaydetmek için `:wnext` ve `:wprev` komutlarını çalıştırın. Daha fazla gezinme komutu vardır. Daha fazlası için `:h arglist`'e göz atın.

Arg listesi, belirli bir dosya türünü veya birkaç dosyayı hedeflemeniz gerektiğinde yararlıdır. Belki de tüm `yml` dosyaları içinde "donut"u "pancake" ile güncellemeniz gerekiyor, bunu yapabilirsiniz:

```shell
:args **/*.yml
:argdo %s/donut/pancake/g | update
```

`args` komutunu tekrar çalıştırırsanız, önceki listeyi değiştirecektir. Örneğin, daha önce şunu çalıştırdıysanız:

```shell
:args file1 file2 file3
```

Bu dosyaların mevcut olduğunu varsayarsak, artık `file1`, `file2` ve `file3` listesiniz var. Sonra bunu çalıştırırsınız:

```shell
:args file4 file5
```

`file1`, `file2` ve `file3` listesinin başlangıcı `file4` ve `file5` ile değiştirilir. Eğer arg listenizde `file1`, `file2` ve `file3` varsa ve başlangıç dosya listenize `file4` ve `file5` eklemek istiyorsanız, `:arga` komutunu kullanın. Şunu çalıştırın:

```shell
:arga file4 file5
```

Artık arg listenizde `file1`, `file2`, `file3`, `file4` ve `file5` var.

`:arga` komutunu herhangi bir argüman olmadan çalıştırırsanız, Vim mevcut buffer'ınızı mevcut arg listesine ekleyecektir. Eğer zaten `file1`, `file2` ve `file3` arg listenizde varsa ve mevcut buffer'ınız `file5` üzerindeyse, `:arga` komutunu çalıştırmak `file5`'i listeye ekler.

Listeyi oluşturduktan sonra, istediğiniz herhangi bir komut satırı komutuyla geçirebilirsiniz. Bunun, yer değiştirme ile yapıldığını gördünüz (`:argdo %s/donut/pancake/g`). Diğer bazı örnekler:
- Arg listesi boyunca "dessert" içeren tüm satırları silmek için `:argdo g/dessert/d`.
- Arg listesi boyunca makro a'yı çalıştırmak için (makro a'da bir şey kaydettiğinizi varsayıyoruz) `:argdo norm @a` komutunu çalıştırın.
- İlk satıra "hello " yazıp ardından dosya adını eklemek için `:argdo 0put='hello ' .. @:` komutunu çalıştırın.

İşiniz bittiğinde, bunları `:update` ile kaydetmeyi unutmayın.

Bazen komutları yalnızca argüman listesinin ilk n öğesi üzerinde çalıştırmanız gerekir. Eğer durum buysa, `argdo` komutuna bir adres geçirin. Örneğin, yalnızca listedeki ilk 3 öğe üzerinde yer değiştirme komutunu çalıştırmak için `:1,3argdo %s/donut/pancake/g` komutunu çalıştırın.

## Buffer Listesi

Buffer listesi, yeni dosyalar düzenlediğinizde organik olarak oluşturulacaktır çünkü her yeni dosya oluşturduğunuzda / bir dosya açtığınızda, Vim bunu bir buffer'da kaydeder (aksi belirtilmedikçe silmezsiniz). Yani eğer zaten 3 dosya açtıysanız: `file1.rb file2.rb file3.rb`, buffer listenizde zaten 3 öğe vardır. Buffer listesini görüntülemek için `:buffers` (alternatif olarak: `:ls` veya `:files`) komutunu çalıştırın. İleri ve geri geçiş yapmak için `:bnext` ve `:bprev` komutlarını kullanın. Listedeki ilk ve son buffer'a gitmek için `:bfirst` ve `:blast` komutlarını kullanın (şimdi eğleniyor musunuz? :D).

Bu arada, bu bölümle ilgili olmayan havalı bir buffer numarası: Eğer buffer listenizde bir dizi öğe varsa, hepsini `:ball` (tüm buffer) ile gösterebilirsiniz. `ball` komutu tüm buffer'ları yatay olarak görüntüler. Dikey olarak görüntülemek için `:vertical ball` komutunu çalıştırın.

Konuya dönecek olursak, tüm buffer'lar arasında işlem yürütme mekanizması arg listesine benzer. Buffer listenizi oluşturduktan sonra, çalıştırmak istediğiniz komut(lar)ı `:bufdo` ile `:argdo` yerine eklemeniz yeterlidir. Yani, tüm buffer'lar arasında "donut"u "pancake" ile değiştirmek ve ardından değişiklikleri kaydetmek istiyorsanız, `:bufdo %s/donut/pancake/g | update` komutunu çalıştırın.

## Pencere ve Sekme Listesi

Pencere ve sekme listeleri, arg ve buffer listesine de benzer. Tek fark, bağlamları ve sözdizimleridir.

Pencere işlemleri her açık pencere üzerinde gerçekleştirilir ve `:windo` ile yapılır. Sekme işlemleri ise açtığınız her sekme üzerinde gerçekleştirilir ve `:tabdo` ile yapılır. Daha fazlası için `:h list-repeat`, `:h :windo` ve `:h :tabdo`'ya göz atın.

Örneğin, üç pencere açtıysanız (yeni pencereleri `Ctrl-W v` ile dikey pencere ve `Ctrl-W s` ile yatay pencere açabilirsiniz) ve `:windo 0put ='hello' . @%` komutunu çalıştırırsanız, Vim "hello" + dosya adını tüm açık pencerelere yazdıracaktır.

## Quickfix Listesi

Önceki bölümlerde (Ch3 ve Ch19) quickfix'lerden bahsetmiştim. Quickfix'in birçok kullanımı vardır. Birçok popüler eklenti quickfix'leri kullanır, bu yüzden onları anlamak için daha fazla zaman harcamak iyidir.

Eğer Vim'e yeniyseniz, quickfix yeni bir kavram olabilir. Eski günlerde, kodunuzu açıkça derlemeniz gerektiğinde, derleme aşamasında hatalarla karşılaşırdınız. Bu hataları görüntülemek için özel bir pencereye ihtiyacınız vardı. İşte burada quickfix devreye girer. Kodunuzu derlediğinizde, Vim hata mesajlarını quickfix penceresinde görüntüler, böylece daha sonra düzeltebilirsiniz. Birçok modern dil artık açık bir derleme gerektirmiyor, ancak bu quickfix'i gereksiz hale getirmiyor. Günümüzde insanlar quickfix'i sanal terminal çıktısını görüntülemek ve arama sonuçlarını saklamak gibi her türlü şey için kullanıyor. Şimdi, arama sonuçlarını saklama konusuna odaklanalım.

Derleme komutlarına ek olarak, belirli Vim komutları quickfix arayüzlerine dayanır. Quickfix'leri yoğun bir şekilde kullanan bir komut türü arama komutlarıdır. Hem `:vimgrep` hem de `:grep` varsayılan olarak quickfix'leri kullanır.

Örneğin, tüm Javascript dosyalarında "donut" aramak istiyorsanız, şunu çalıştırabilirsiniz:

```shell
:vimgrep /donut/ **/*.js
```

"Donut" aramasının sonucu quickfix penceresinde saklanır. Bu eşleşme sonuçlarının quickfix penceresini görmek için şunu çalıştırın:

```shell
:copen
```

Kapatmak için şunu çalıştırın:

```shell
:cclose
```

Quickfix listesini ileri ve geri geçiş yapmak için şunları çalıştırın:

```shell
:cnext
:cprev
```

Eşleşmedeki ilk ve son öğeye gitmek için şunları çalıştırın:

```shell
:cfirst
:clast
```

Daha önce iki quickfix komutu olduğunu belirtmiştim: `cdo` ve `cfdo`. Aralarındaki fark nedir? `cdo`, quickfix listesindeki her öğe için komutu çalıştırırken, `cfdo` quickfix listesindeki her *dosya* için komutu çalıştırır.

Açıklayayım. Diyelim ki yukarıdaki `vimgrep` komutunu çalıştırdıktan sonra şunları buldunuz:
- `file1.js` dosyasında 1 sonuç
- `file2.js` dosyasında 10 sonuç

Eğer `:cfdo %s/donut/pancake/g` komutunu çalıştırırsanız, bu, `file1.js` dosyasında bir kez ve `file2.js` dosyasında bir kez `%s/donut/pancake/g` komutunu çalıştırır. Eşleşmedeki dosya sayısı kadar çalıştırır. Sonuçlarda iki dosya olduğundan, Vim, `file1.js` üzerinde bir kez ve `file2.js` üzerinde bir kez yer değiştirme komutunu çalıştırır, ikinci dosyada 10 eşleşme olmasına rağmen. `cfdo`, quickfix listesinde toplam kaç dosya olduğuna önem verir.

Eğer `:cdo %s/donut/pancake/g` komutunu çalıştırırsanız, bu, `file1.js` dosyasında bir kez ve `file2.js` dosyasında *on kez* `%s/donut/pancake/g` komutunu çalıştırır. Quickfix listesinde bulunan gerçek öğe sayısı kadar çalıştırır. `file1.js` dosyasında yalnızca bir eşleşme bulunduğundan ve `file2.js` dosyasında 10 eşleşme bulunduğundan, toplamda 11 kez çalıştırır.

`%s/donut/pancake/g` komutunu çalıştırdığınız için, `cfdo` kullanmak mantıklı olur. `cdo` kullanmak mantıklı olmaz çünkü bu, `file2.js` dosyasında `%s/donut/pancake/g` komutunu on kez çalıştırır (`%s` dosya genelinde bir yer değiştirmedir). Her dosya için bir kez `%s` çalıştırmak yeterlidir. Eğer `cdo` kullanırsanız, bunun yerine `s/donut/pancake/g` ile geçmek daha mantıklı olur.

`cfdo` veya `cdo` kullanmaya karar verirken, geçirdiğiniz komutun kapsamını düşünün. Bu, dosya genelinde bir komut mu (örneğin `:%s` veya `:g`) yoksa satır bazında bir komut mu (örneğin `:s` veya `:!`)?

## Konum Listesi

Konum listesi, quickfix listesine benzer bir şekilde, Vim'in mesajları görüntülemek için özel bir pencere kullandığı anlamına gelir. Quickfix listesi ile konum listesi arasındaki fark, her zaman yalnızca bir quickfix listesine sahip olabileceğinizdir; oysa istediğiniz kadar konum listesine sahip olabilirsiniz.

Diyelim ki iki pencere açtınız, bir pencere `food.txt` görüntülerken diğeri `drinks.txt` görüntülüyor. `food.txt` içinde, bir konum listesi arama komutu `:lvimgrep` (`:vimgrep` komutunun konum varyantı) çalıştırıyorsunuz:

```shell
:lvim /bagel/ **/*.md
```

Vim, o `food.txt` *penceresi* için tüm bagel arama eşleşmelerinin bir konum listesi oluşturur. Konum listesini `:lopen` ile görebilirsiniz. Şimdi diğer pencereye `drinks.txt` geçin ve şunu çalıştırın:

```shell
:lvimgrep /milk/ **/*.md
```

Vim, o `drinks.txt` *penceresi* için tüm süt arama sonuçlarının *ayrı* bir konum listesi oluşturur.

Her pencere içinde çalıştırdığınız her konum komutu için, Vim ayrı bir konum listesi oluşturur. Eğer 10 farklı pencereniz varsa, 10 farklı konum listesine kadar sahip olabilirsiniz. Bunu quickfix listesi ile karşılaştırdığınızda, her zaman yalnızca bir tane quickfix listesine sahip olabileceğinizi görebilirsiniz. Eğer 10 farklı pencereniz varsa, yine de yalnızca bir quickfix listesi alırsınız.

Konum listesi komutlarının çoğu, quickfix komutlarına benzer, ancak bunlar `l-` ile ön eklenmiştir. Örneğin: `:lvimgrep`, `:lgrep` ve `:lmake` ile `:vimgrep`, `:grep` ve `:make`. Konum listesi penceresini manipüle etmek için, yine, komutlar quickfix komutlarına benzer: `:lopen`, `:lclose`, `:lfirst`, `:llast`, `:lnext` ve `:lprev` ile `:copen`, `:cclose`, `:cfirst`, `:clast`, `:cnext` ve `:cprev`.

İki konum listesi çoklu dosya komutu da quickfix çoklu dosya komutlarına benzer: `:ldo` ve `:lfdo`. `:ldo`, her konum listesinde konum komutunu çalıştırırken, `:lfdo` konum listesi komutunu konum listesinde her dosya için çalıştırır. Daha fazlası için `:h location-list`'e göz atın.
## Vim'de Birden Fazla Dosya İşlemleri Yapmak

Birden fazla dosya işlemi yapmayı bilmek, düzenleme konusunda faydalı bir beceridir. Birden fazla dosya içinde bir değişken adını değiştirmek istediğinizde, bunları tek seferde yürütmek istersiniz. Vim, bunu yapmanın sekiz farklı yolunu sunar.

Pratikte, muhtemelen sekizinin hepsini eşit şekilde kullanmayacaksınız. Bir veya iki tanesine yöneleceksiniz. Başlarken, bir tane seçin (ben şahsen `:argdo` argüman listesini kullanarak başlamayı öneririm) ve onu ustalaşın. Birinde rahat hissettiğinizde, o zaman bir sonraki öğrenin. İkinci, üçüncü, dördüncü öğrenmenin daha kolay olduğunu göreceksiniz. Yaratıcı olun. Farklı kombinasyonlarla kullanın. Bunu zahmetsizce ve fazla düşünmeden yapabilene kadar pratik yapmaya devam edin. Bunu kas hafızanızın bir parçası haline getirin.

Bunu söyledikten sonra, Vim düzenlemesini ustalaştınız. Tebrikler!