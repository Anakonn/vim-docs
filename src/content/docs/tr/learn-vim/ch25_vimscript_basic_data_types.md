---
description: Bu belge, Vimscript'in temel veri türlerini ve Ex modunu kullanarak etkileşimli
  öğrenim yöntemlerini tanıtmaktadır.
title: Ch25. Vimscript Basic Data Types
---

Sonraki birkaç bölümde, Vim'in yerleşik programlama dili olan Vimscript hakkında bilgi edineceksiniz.

Yeni bir dil öğrenirken, dikkat etmeniz gereken üç temel unsur vardır:
- Temel Öğeler
- Birleştirme Yöntemleri
- Soyutlama Yöntemleri

Bu bölümde, Vim'in temel veri türlerini öğreneceksiniz.

## Veri Türleri

Vim'in 10 farklı veri türü vardır:
- Sayı
- Kesir
- Dize
- Liste
- Sözlük
- Özel
- Funcref
- İş
- Kanal
- Blob

Burada ilk altı veri türünü ele alacağım. Ch. 27'de Funcref hakkında bilgi edineceksiniz. Vim veri türleri hakkında daha fazla bilgi için `:h variables`'a bakın.

## Ex Modu ile Takip Etme

Vim teknik olarak yerleşik bir REPL'e sahip değildir, ancak bir REPL gibi kullanılabilecek bir mod olan Ex moduna sahiptir. Ex moduna `Q` veya `gQ` ile geçebilirsiniz. Ex modu, genişletilmiş bir komut satırı moduna benzer (komut satırı modundaki komutları durmaksızın yazmak gibidir). Ex modundan çıkmak için `:visual` yazın.

Bu bölümde ve sonraki Vimscript bölümlerinde kod yazmak için `:echo` veya `:echom` kullanabilirsiniz. Bunlar, JS'deki `console.log` veya Python'daki `print` gibi çalışır. `:echo` komutu verdiğiniz değerlendirilen ifadeyi yazdırır. `:echom` komutu aynı işlemi yapar, ancak ek olarak sonucu mesaj geçmişine kaydeder.

```viml
:echom "merhaba echo mesajı"
```

Mesaj geçmişini görüntülemek için:

```shell
:messages
```

Mesaj geçmişinizi temizlemek için:

```shell
:messages clear
```

## Sayı

Vim'in 4 farklı sayı türü vardır: ondalık, onaltılık, ikilik ve sekizlik. Bu arada, sayı veri türünden bahsettiğimde, genellikle bu bir tam sayı veri türü anlamına gelir. Bu kılavuzda, sayı ve tam sayı terimlerini birbirinin yerine kullanacağım.

### Ondalık

Ondalık sistemine aşina olmalısınız. Vim, pozitif ve negatif ondalıkları kabul eder. 1, -1, 10 vb. Vimscript programlamasında, muhtemelen çoğu zaman ondalık türünü kullanacaksınız.

### Onaltılık

Onaltılı sayılar `0x` veya `0X` ile başlar. Mnemonik: He**x**adecimal.

### İkilik

İkilik sayılar `0b` veya `0B` ile başlar. Mnemonik: **B**inary.

### Sekizlik

Sekizlik sayılar `0`, `0o` ve `0O` ile başlar. Mnemonik: **O**ctal.

### Sayıları Yazdırma

Eğer bir onaltılık, ikilik veya sekizlik sayıyı `echo` ile yazdırırsanız, Vim otomatik olarak bunları ondalıklara dönüştürür.

```viml
:echo 42
" 42 döner

:echo 052
" 42 döner

:echo 0b101010
" 42 döner

:echo 0x2A
" 42 döner
```

### Doğru ve Yanlış

Vim'de 0 değeri yanlıştır ve tüm 0 dışındaki değerler doğrudur.

Aşağıdakiler hiçbir şey yazdırmaz.

```viml
:if 0
:  echo "Hayır"
:endif
```

Ancak bu yazdırır:

```viml
:if 1
:  echo "Evet"
:endif
```

0 dışındaki herhangi bir değer doğrudur, negatif sayılar da dahil. 100 doğrudur. -1 doğrudur.

### Sayı Aritmetiği

Sayılardan aritmetik ifadeler çalıştırmak için kullanılabilir:

```viml
:echo 3 + 1
" 4 döner

: echo 5 - 3
" 2 döner

:echo 2 * 2
" 4 döner

:echo 4 / 2
" 2 döner
```

Bir sayıyı kalan ile böldüğünüzde, Vim kalanı atar.

```viml
:echo 5 / 2
" 2.5 yerine 2 döner
```

Daha doğru bir sonuç almak için, bir kesirli sayı kullanmalısınız.

## Kesir

Kesirler, ardışık ondalık sayılardır. Kesirli sayıları temsil etmenin iki yolu vardır: nokta notasyonu (31.4 gibi) ve üstel (3.14e01). Sayılarda olduğu gibi, pozitif ve negatif işaretler kullanabilirsiniz:

```viml
:echo +123.4
" 123.4 döner

:echo -1.234e2
" -123.4 döner

:echo 0.25
" 0.25 döner

:echo 2.5e-1
" 0.25 döner
```

Bir kesire bir nokta ve ardışık rakamlar vermeniz gerekir. `25e-2` (nokta yok) ve `1234.` (nokta var ama ardışık rakam yok) geçersiz kesirli sayılardır.

### Kesir Aritmetiği

Bir sayı ile bir kesir arasında aritmetik ifade yaparken, Vim sonucu bir kesire dönüştürür.

```viml
:echo 5 / 2.0
" 2.5 döner
```

Kesir ve kesir aritmetiği size başka bir kesir verir.

```shell
:echo 1.0 + 1.0
" 2.0 döner
```

## Dize

Dizeler, ya çift tırnak (`""`) ya da tek tırnak (`''`) ile çevrelenmiş karakterlerdir. "Merhaba", "123" ve '123.4' dize örnekleridir.

### Dize Birleştirme

Vim'de bir diziyi birleştirmek için `.` operatörünü kullanın.

```viml
:echo "Merhaba" . " dünya"
" "Merhaba dünya" döner
```

### Dize Aritmetiği

Bir sayı ve bir dize ile aritmetik operatörleri (`+ - * /`) çalıştırdığınızda, Vim diziyi bir sayıya dönüştürür.

```viml
:echo "12 donut" + 3
" 15 döner
```

Vim "12 donut" ifadesini gördüğünde, diziden 12'yi çıkarır ve bunu 12 sayısına dönüştürür. Sonra toplama işlemi yapar ve 15 döner. Bu dizi-sayı dönüşümünün çalışması için, sayı karakterinin dizideki *ilk karakter* olması gerekir.

Aşağıdaki çalışmaz çünkü 12 dizideki ilk karakter değildir:

```viml
:echo "donut 12" + 3
" 3 döner
```

Bu da çalışmaz çünkü dizinin ilk karakteri boşluktur:

```viml
:echo " 12 donut" + 3
" 3 döner
```

Bu dönüşüm, iki dize ile bile çalışır:

```shell
:echo "12 donut" + "6 pasta"
" 18 döner
```

Bu, yalnızca `+` ile değil, herhangi bir aritmetik operatörle çalışır:

```viml
:echo "12 donut" * "5 kutu"
" 60 döner

:echo "12 donut" - 5
" 7 döner

:echo "12 donut" / "3 kişi"
" 4 döner
```

Bir dizi-sayı dönüşümünü zorlamak için, sadece 0 ekleyebilir veya 1 ile çarpabilirsiniz:

```viml
:echo "12" + 0
" 12 döner

:echo "12" * 1
" 12 döner
```

Bir dize içindeki bir kesir ile aritmetik yapıldığında, Vim bunu bir tam sayı gibi değerlendirir, kesir gibi değil:

```shell
:echo "12.0 donut" + 12
" 24 döner, 24.0 değil
```

### Sayı ve Dize Birleştirme

Bir sayıyı dizeye dönüştürmek için nokta operatörünü (`.`) kullanabilirsiniz:

```viml
:echo 12 . "donut"
" "12donut" döner
```

Dönüşüm yalnızca sayı veri türü ile çalışır, kesir ile değil. Bu çalışmaz:

```shell
:echo 12.0 . "donut"
" "12.0donut" döndürmez, hata verir
```

### Dize Koşulları

0'ın yanlış ve tüm 0 dışındaki sayıların doğru olduğunu hatırlayın. Bu, dize koşulları kullanıldığında da doğrudur.

Aşağıdaki if ifadesinde, Vim "12donut"u 12'ye dönüştürür, bu da doğrudur:

```viml
:if "12donut"
:  echo "Lezzetli"
:endif
" "Lezzetli" döner
```

Diğer yandan, bu yanlıştır:

```viml
:if "donut12"
:  echo "Hayır"
:endif
" hiçbir şey döndürmez
```

Vim "donut12"yi 0'a dönüştürür, çünkü ilk karakter bir sayı değildir.

### Çift ve Tek Tırnak

Çift tırnaklar, tek tırnaklardan farklı davranır. Tek tırnaklar karakterleri kelime kelime gösterirken, çift tırnaklar özel karakterleri kabul eder.

Özel karakterler nelerdir? Yeni satır ve çift tırnak gösterimine bakın:

```viml
:echo "merhaba\ndünya"
" döner
" merhaba
" dünya

:echo "merhaba \"dünya\""
" "merhaba "dünya"" döner
```

Bunu tek tırnaklarla karşılaştırın:

```shell
:echo 'merhaba\n dünya'
" 'merhaba\n dünya' döner

:echo 'merhaba \"dünya\"'
" 'merhaba \"dünya\"' döner
```

Özel karakterler, kaçış karakteri ile farklı davranan özel dize karakterleridir. `\n` yeni satır gibi davranır. `\"` ise bir literal `"` gibi davranır. Diğer özel karakterlerin bir listesi için `:h expr-quote`'a bakın.

### Dize Prosedürleri

Bazı yerleşik dize prosedürlerine bakalım.

Bir dizenin uzunluğunu `strlen()` ile alabilirsiniz.

```shell
:echo strlen("çikolata")
" 5 döner
```

Dizeleri sayıya dönüştürmek için `str2nr()` kullanabilirsiniz:

```shell
:echo str2nr("12donut")
" 12 döner

:echo str2nr("donut12")
" 0 döner
```

Önceki dizi-sayı dönüşümünde olduğu gibi, eğer sayı ilk karakter değilse, Vim bunu yakalayamaz.

İyi haber şu ki, Vim'in bir dizeyi kesire dönüştüren bir yöntemi vardır: `str2float()`:

```shell
:echo str2float("12.5donut")
" 12.5 döner
```

Bir dizideki bir deseni `substitute()` yöntemi ile değiştirebilirsiniz:

```shell
:echo substitute("tatlı", "a", "o", "g")
" "totlı" döner
```

Son parametre "g" global bayraktır. Bununla, Vim tüm eşleşen durumları değiştirecektir. Olmadan, Vim yalnızca ilk eşleşmeyi değiştirecektir.

```shell
:echo substitute("tatlı", "a", "o", "")
" "totlı" döner
```

Substitute komutu `getline()` ile birleştirilebilir. `getline()` fonksiyonunun verilen satır numarasındaki metni aldığını hatırlayın. Diyelim ki 5. satırda "çikolata donut" metni var. Prosedürü kullanabilirsiniz:

```shell
:echo substitute(getline(5), "çikolata", "glazür", "g")
" "glazür donut" döner
```

Başka birçok dize prosedürü vardır. `:h string-functions`'a bakın.

## Liste

Bir Vimscript listesi, Javascript'teki Array veya Python'daki Liste gibidir. Bu, *sıralı* bir öğe dizisidir. Farklı veri türleri ile içeriği karıştırabilirsiniz:

```shell
[1,2,3]
['a', 'b', 'c']
[1,'a', 3.14]
[1,2,[3,4]]
```

### Alt Listeler

Vim listesi sıfır indekslidir. Bir listede belirli bir öğeye `[n]` ile erişebilirsiniz, burada n indeksi temsil eder.

```shell
:echo ["a", "tatlı", "tatlılık"][0]
" "a" döner

:echo ["a", "tatlı", "tatlılık"][2]
" "tatlılık" döner
```

Maksimum indeks numarasını aşarsanız, Vim bir hata verir ve indeksin aralık dışı olduğunu söyler:

```shell
:echo ["a", "tatlı", "tatlılık"][999]
" bir hata döner
```

Sıfırın altına giderseniz, Vim indeksi son öğeden başlatır. Minimum indeks numarasını aşmak da size bir hata verir:

```shell
:echo ["a", "tatlı", "tatlılık"][-1]
" "tatlılık" döner

:echo ["a", "tatlı", "tatlılık"][-3]
" "a" döner

:echo ["a", "tatlı", "tatlılık"][-999]
" bir hata döner
```

Bir listeden birkaç öğeyi `[n:m]` ile "dilimleyebilirsiniz", burada `n` başlangıç indeksi ve `m` bitiş indeksidir.

```shell
:echo ["çikolata", "glazür", "düz", "çilek", "limon", "şeker", "krema"][2:4]
" ["düz", "çilek", "limon"] döner
```

Eğer `m`'yi geçmezseniz (`[n:]`), Vim n'inci öğeden itibaren geri kalan öğeleri döner. Eğer `n`'yi geçmezseniz (`[:m]`), Vim ilk öğeden m'inci öğeye kadar olanları döner.

```shell
:echo ["çikolata", "glazür", "düz", "çilek", "limon", "şeker", "krema"][2:]
" ['düz', 'çilek', 'limon', 'şeker', 'krema'] döner

:echo ["çikolata", "glazür", "düz", "çilek", "limon", "şeker", "krema"][:4]
" ['çikolata', 'glazür', 'düz', 'çilek', 'limon'] döner
```

Bir dizinin maksimum öğelerini aşan bir indeks geçebilirsiniz.

```viml
:echo ["çikolata", "glazür", "düz", "çilek", "limon", "şeker", "krema"][2:999]
" ['düz', 'çilek', 'limon', 'şeker', 'krema'] döner
```
### Dize Dilimleme

Dizeleri, listeler gibi dilimleyebilir ve hedefleyebilirsiniz:

```viml
:echo "choco"[0]
" "c" döner

:echo "choco"[1:3]
" "hoc" döner

:echo "choco"[:3]
" choc döner

:echo "choco"[1:]
" hoco döner
```

### Liste Aritmetiği

Bir listeyi birleştirmek ve değiştirmek için `+` kullanabilirsiniz:

```viml
:let sweetList = ["çikolata", "çilek"]
:let sweetList += ["şeker"]
:echo sweetList
" ["çikolata", "çilek", "şeker"] döner
```

### Liste Fonksiyonları

Vim'in yerleşik liste fonksiyonlarını keşfedelim.

Bir listenin uzunluğunu almak için `len()` kullanın:

```shell
:echo len(["çikolata", "çilek"])
" 2 döner
```

Bir öğeyi bir listeye eklemek için `insert()` kullanabilirsiniz:

```shell
:let sweetList = ["çikolata", "çilek"]
:call insert(sweetList, "glazürlü")

:echo sweetList
" ["glazürlü", "çikolata", "çilek"] döner
```

Ayrıca `insert()`'e öğeyi eklemek istediğiniz indeksi de verebilirsiniz. İkinci öğeden (indeks 1) önce bir öğe eklemek istiyorsanız:

```shell
:let sweeterList = ["glazürlü", "çikolata", "çilek"]
:call insert(sweeterList, "krema", 1)

:echo sweeterList
" ['glazürlü', 'krema', 'çikolata', 'çilek'] döner
```

Bir liste öğesini kaldırmak için `remove()` kullanın. Bu, bir liste ve kaldırmak istediğiniz öğe indeksini alır.

```shell
:let sweeterList = ["glazürlü", "çikolata", "çilek"]
:call remove(sweeterList, 1)

:echo sweeterList
" ['glazürlü', 'çilek'] döner
```

Bir liste üzerinde `map()` ve `filter()` kullanabilirsiniz. "choco" ifadesini içeren öğeleri filtrelemek için:

```shell
:let sweeterList = ["glazürlü", "çikolata", "çilek"]
:call filter(sweeterList, 'v:val !~ "choco"')
:echo sweeterList
" ["glazürlü", "çilek"]

:let sweetestList = ["çikolata", "glazürlü", "şeker"]
:call map(sweetestList, 'v:val . " donut"')
:echo sweetestList
" ['çikolata donut', 'glazürlü donut', 'şeker donut'] döner
```

`v:val` değişkeni, bir Vim özel değişkenidir. `map()` veya `filter()` kullanarak bir liste veya sözlük üzerinde dönerken mevcuttur. Her döngüdeki öğeyi temsil eder.

Daha fazlası için `:h list-functions`'a bakın.

### Liste Açma

Bir listeyi açabilir ve değişkenleri liste öğelerine atayabilirsiniz:

```shell
:let favoriteFlavor = ["çikolata", "glazürlü", "sade"]
:let [flavor1, flavor2, flavor3] = favoriteFlavor

:echo flavor1
" "çikolata" döner

:echo flavor2
" "glazürlü" döner
```

Liste öğelerinin geri kalanını atamak için `;` ile bir değişken adı kullanabilirsiniz:

```shell
:let favoriteFruits = ["elma", "muz", "limon", "yaban mersini", "ahududu"]
:let [fruit1, fruit2; restFruits] = favoriteFruits

:echo fruit1
" "elma" döner

:echo restFruits
" ['limon', 'yaban mersini', 'ahududu'] döner
```

### Listeyi Değiştirme

Bir liste öğesini doğrudan değiştirebilirsiniz:

```shell
:let favoriteFlavor = ["çikolata", "glazürlü", "sade"]
:let favoriteFlavor[0] = "şeker"
:echo favoriteFlavor
" ['şeker', 'glazürlü', 'sade'] döner
```

Birden fazla liste öğesini doğrudan değiştirebilirsiniz:

```shell
:let favoriteFlavor = ["çikolata", "glazürlü", "sade"]
:let favoriteFlavor[2:] = ["çilek", "çikolata"]
:echo favoriteFlavor
" ['çikolata', 'glazürlü', 'çilek', 'çikolata'] döner
```

## Sözlük

Bir Vimscript sözlüğü, ilişkisel, sırasız bir listedir. Boş olmayan bir sözlük en az bir anahtar-değer çiftinden oluşur.

```shell
{"kahvaltı": "waffle", "öğle": "pankek"}
{"öğün": ["kahvaltı", "ikinci kahvaltı", "üçüncü kahvaltı"]}
{"akşam": 1, "tatlı": 2}
```

Bir Vim sözlük veri nesnesi anahtar için dize kullanır. Bir sayı kullanmaya çalışırsanız, Vim bunu bir dizeye dönüştürür.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}

:echo breakfastNo
" {'1': '7am', '2': '9am', '11ses': '11am'} döner
```

Her anahtar etrafında tırnak işareti koymak için çok tembel iseniz, `#{}` notasyonunu kullanabilirsiniz:

```shell
:let mealPlans = #{kahvaltı: "waffle", öğle: "pankek", akşam: "donut"}

:echo mealPlans
" {'öğle': 'pankek', 'kahvaltı': 'waffle', 'akşam': 'donut'} döner
```

`#{}` sözdizimini kullanmanın tek gerekliliği, her anahtarın ya:

- ASCII karakteri.
- Rakam.
- Bir alt çizgi (`_`).
- Bir tire (`-`) olmasıdır.

Liste gibi, değerler için herhangi bir veri türünü kullanabilirsiniz.

```shell
:let mealPlan = {"kahvaltı": ["pankek", "waffle", "kızarmış patates"], "öğle": WhatsForLunch(), "akşam": {"meze": "sulu yemek", "ana yemek": "daha fazla sulu yemek"}}
```

### Sözlüğe Erişim

Bir sözlükten bir değere erişmek için, anahtarı ya köşeli parantezlerle (`['anahtar']`) ya da nokta notasyonu (`.anahtar`) ile çağırabilirsiniz.

```shell
:let meal = {"kahvaltı": "sulu omlet", "öğle": "sulu sandviç", "akşam": "daha fazla sulu yemek"}

:let breakfast = meal['kahvaltı']
:let lunch = meal.öğle

:echo breakfast
" "sulu omlet" döner

:echo lunch
" "sulu sandviç" döner
```

### Sözlüğü Değiştirme

Bir sözlük içeriğini değiştirebilir veya hatta ekleyebilirsiniz:

```shell
:let meal = {"kahvaltı": "sulu omlet", "öğle": "sulu sandviç"}

:let meal.kahvaltı = "kahvaltı tacos"
:let meal["öğle"] = "tacos al pastor"
:let meal["akşam"] = "quesadilla"

:echo meal
" {'öğle': 'tacos al pastor', 'kahvaltı': 'kahvaltı tacos', 'akşam': 'quesadilla'} döner
```

### Sözlük Fonksiyonları

Sözlükleri yönetmek için Vim'in yerleşik bazı fonksiyonlarını keşfedelim.

Bir sözlüğün uzunluğunu kontrol etmek için `len()` kullanın.

```shell
:let mealPlans = #{kahvaltı: "waffle", öğle: "pankek", akşam: "donut"}

:echo len(mealPlans)
" 3 döner
```

Bir sözlüğün belirli bir anahtarı içerip içermediğini görmek için `has_key()` kullanın.

```shell
:let mealPlans = #{kahvaltı: "waffle", öğle: "pankek", akşam: "donut"}

:echo has_key(mealPlans, "kahvaltı")
" 1 döner

:echo has_key(mealPlans, "tatlı")
" 0 döner
```

Bir sözlüğün herhangi bir öğesi olup olmadığını görmek için `empty()` kullanın. `empty()` prosedürü, tüm veri türleriyle çalışır: liste, sözlük, dize, sayı, float, vb.

```shell
:let mealPlans = #{kahvaltı: "waffle", öğle: "pankek", akşam: "donut"}
:let noMealPlan = {}

:echo empty(noMealPlan)
" 1 döner

:echo empty(mealPlans)
" 0 döner
```

Bir sözlükten bir girişi kaldırmak için `remove()` kullanın.

```shell
:let mealPlans = #{kahvaltı: "waffle", öğle: "pankek", akşam: "donut"}

:echo "kahvaltıyı kaldırma: " . remove(mealPlans, "kahvaltı")
" "kahvaltıyı kaldırma: 'waffle'" döner

:echo mealPlans
" {'öğle': 'pankek', 'akşam': 'donut'} döner
```

Bir sözlüğü liste listesine dönüştürmek için `items()` kullanın:

```shell
:let mealPlans = #{kahvaltı: "waffle", öğle: "pankek", akşam: "donut"}

:echo items(mealPlans)
" [['öğle', 'pankek'], ['kahvaltı', 'waffle'], ['akşam', 'donut']] döner
```

`filter()` ve `map()` de mevcuttur.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}
:call filter(breakfastNo, 'v:key > 1')

:echo breakfastNo
" {'2': '9am', '11ses': '11am'} döner
```

Bir sözlük anahtar-değer çiftleri içerdiğinden, Vim `v:key` özel değişkenini sağlar; bu, `v:val` ile benzer şekilde çalışır. Bir sözlükte dönerken, `v:key` mevcut döngüdeki anahtarın değerini tutar.

Eğer bir `mealPlans` sözlüğünüz varsa, bunu `v:key` kullanarak eşleyebilirsiniz.

```shell
:let mealPlans = #{kahvaltı: "waffle", öğle: "pankek", akşam: "donut"}
:call map(mealPlans, 'v:key . " ve süt"')

:echo mealPlans
" {'öğle': 'öğle ve süt', 'kahvaltı': 'kahvaltı ve süt', 'akşam': 'akşam ve süt'} döner
```

Benzer şekilde, bunu `v:val` kullanarak eşleyebilirsiniz:

```shell
:let mealPlans = #{kahvaltı: "waffle", öğle: "pankek", akşam: "donut"}
:call map(mealPlans, 'v:val . " ve süt"')

:echo mealPlans
" {'öğle': 'pankek ve süt', 'kahvaltı': 'waffle ve süt', 'akşam': 'donut ve süt'} döner
```

Daha fazla sözlük fonksiyonu görmek için `:h dict-functions`'a bakın.

## Özel Primitifler

Vim'in özel primitifleri vardır:

- `v:false`
- `v:true`
- `v:none`
- `v:null`

Bu arada, `v:` Vim'in yerleşik değişkenidir. Bunlar daha sonraki bir bölümde daha fazla ele alınacaktır.

Deneyimlerime göre, bu özel primitifleri sık kullanmayacaksınız. Eğer bir doğru / yanlış değere ihtiyacınız varsa, sadece 0 (yanlış) ve 0 olmayan (doğru) kullanabilirsiniz. Eğer boş bir dizeye ihtiyacınız varsa, sadece `""` kullanın. Ama yine de bilmek iyi, bu yüzden hızlıca üzerinden geçelim.

### Doğru

Bu, `true` ile eşdeğerdir. 0 olmayan bir değere sahip bir sayıya eşdeğerdir. `json_encode()` ile json çözümlerken "doğru" olarak yorumlanır.

```shell
:echo json_encode({"test": v:true})
" {"test": true} döner
```

### Yanlış

Bu, `false` ile eşdeğerdir. 0 değerine sahip bir sayıya eşdeğerdir. `json_encode()` ile json çözümlerken "yanlış" olarak yorumlanır.

```shell
:echo json_encode({"test": v:false})
" {"test": false} döner
```

### Yok

Boş bir dizeye eşdeğerdir. `json_encode()` ile json çözümlerken boş bir öğe (`null`) olarak yorumlanır.

```shell
:echo json_encode({"test": v:none})
" {"test": null} döner
```

### Null

`v:none` ile benzerdir.

```shell
:echo json_encode({"test": v:null})
" {"test": null} döner
```

## Veri Türlerini Akıllıca Öğrenin

Bu bölümde, Vimscript'in temel veri türlerini öğrendiniz: sayı, float, dize, liste, sözlük ve özel. Bunları öğrenmek, Vimscript programlamaya başlamak için ilk adımdır.

Bir sonraki bölümde, bunları eşitlikler, koşullu ifadeler ve döngüler gibi ifadeler yazmak için nasıl birleştireceğinizi öğreneceksiniz.