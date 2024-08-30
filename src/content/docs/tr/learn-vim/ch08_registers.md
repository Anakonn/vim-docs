---
description: Vim kayıtları, metin düzenlemede verimliliği artıran önemli araçlardır.
  Bu bölümde, Vim'in on farklı kayıt türü ve kullanımları ele alınacaktır.
title: Ch08. Registers
---

Vim kayıtlarını öğrenmek, cebir öğrenmek gibidir. İhtiyacınız olduğunu düşünmediniz, ta ki ihtiyacınız olana kadar.

Muhtemelen bir metni yıktığınızda veya sildiğinizde Vim kayıtlarını kullandınız ve ardından `p` veya `P` ile yapıştırdınız. Ancak, Vim'in 10 farklı kayıt türü olduğunu biliyor muydunuz? Doğru kullanıldığında, Vim kayıtları sizi tekrarlayan yazım işlemlerinden kurtarabilir.

Bu bölümde, tüm Vim kayıt türlerini ve bunları verimli bir şekilde nasıl kullanacağınızı gözden geçireceğim.

## On Kayıt Türü

İşte 10 Vim kayıt türü:

1. İsimlendirilmemiş kayıt (`""`).
2. Numara kayıtları (`"0-9`).
3. Küçük silme kaydı (`"-`).
4. İsimli kayıtlar (`"a-z`).
5. Salt okunur kayıtlar (`":`, `".`, ve `"%`).
6. Alternatif dosya kaydı (`"#`).
7. İfade kaydı (`"=`).
8. Seçim kayıtları (`"*` ve `"+`).
9. Kara delik kaydı (`"_`).
10. Son arama deseni kaydı (`"/`).

## Kayıt Operatörleri

Kayıtları kullanmak için önce onları operatörlerle saklamanız gerekir. İşte kayıtlara değerleri saklayan bazı operatörler:

```shell
y    Yank (kopyala)
c    Metni sil ve ekleme modunu başlat
d    Metni sil
```

Daha fazla operatör vardır (örneğin `s` veya `x`), ancak yukarıdakiler faydalı olanlardır. Genel kural, bir operatör bir metni kaldırabiliyorsa, muhtemelen metni kayıtlara saklar.

Kayıtlardan bir metni yapıştırmak için şunları kullanabilirsiniz:

```shell
p    İmlecin ardından metni yapıştır
P    İmlecin önüne metni yapıştır
```

Hem `p` hem de `P` bir sayı ve bir kayıt sembolü argümanı alır. Örneğin, on kez yapıştırmak için `10p` yapın. a kaydından metni yapıştırmak için `"ap` yapın. a kaydından metni on kez yapıştırmak için `10"ap` yapın. Bu arada, `p` aslında teknik olarak "put" anlamına gelir, "paste" değil, ama "paste" daha yaygın bir kelime.

Belirli bir kayıttan içeriği almak için genel sözdizimi `"a`'dır; burada `a` kayıt sembolüdür.

## Ekleme Modundan Kayıt Çağırma

Bu bölümde öğrendiğiniz her şey ekleme modunda da uygulanabilir. a kaydından metni almak için normalde `"ap` yaparsınız. Ancak ekleme modundaysanız, `Ctrl-R a` çalıştırın. Ekleme modundan kayıtları çağırmanın sözdizimi:

```shell
Ctrl-R a
```

Burada `a` kayıt sembolüdür. Kayıtları nasıl saklayıp alacağınızı bildiğinize göre, derinlemesine dalalım!

## İsimlendirilmemiş Kayıt

İsimlendirilmemiş kayıttan metni almak için `""p` yapın. Bu, son yıktığınız, değiştirdiğiniz veya sildiğiniz metni saklar. Başka bir yankı, değişiklik veya silme yaparsanız, Vim otomatik olarak eski metni değiştirecektir. İsimlendirilmemiş kayıt, bir bilgisayarın standart kopyala / yapıştır işlemi gibidir.

Varsayılan olarak, `p` (veya `P`) isimlendirilmemiş kayda bağlıdır (bundan sonra isimlendirilmemiş kaydı `p` olarak anacağım, `""p` yerine).

## Numara Kayıtları

Numara kayıtları otomatik olarak artan sırayla kendilerini doldurur. İki farklı numara kaydı vardır: yıktığınız kayıt (`0`) ve numaralı kayıtlar (`1-9`). Önce yıktığınız kaydı tartışalım.

### Yıktığınız Kayıt

Bir metin satırını yıktığınızda (`yy`), Vim aslında o metni iki kayıtta saklar:

1. İsimlendirilmemiş kayıt (`p`).
2. Yıktığınız kayıt (`"0p`).

Farklı bir metni yıktığınızda, Vim hem yıktığınız kaydı hem de isimlendirilmemiş kaydı günceller. Diğer işlemler (silme gibi) kayıt 0'da saklanmaz. Bu, sizin avantajınıza kullanılabilir, çünkü başka bir yankı yapmadığınız sürece, yıktığınız metin her zaman orada olacaktır; ne kadar çok değişiklik ve silme yaparsanız yapın.

Örneğin, eğer:
1. Bir satırı yankılarsanız (`yy`)
2. Bir satırı silerseniz (`dd`)
3. Başka bir satırı silerseniz (`dd`)

Yıktığınız kayıt birinci adımdaki metni içerecektir.

Eğer:
1. Bir satırı yankılarsanız (`yy`)
2. Bir satırı silerseniz (`dd`)
3. Başka bir satırı yankılarsanız (`yy`)

Yıktığınız kayıt üçüncü adımdaki metni içerecektir.

Son bir ipucu, ekleme modundayken, yeni yankıladığınız metni hızlıca `Ctrl-R 0` ile yapıştırabilirsiniz.

### Sıfır Olmayan Numaralı Kayıtlar

En az bir satır uzunluğunda bir metni değiştirdiğinizde veya sildiğinizde, o metin en son güncellenen sıraya göre numaralı kayıtlara 1-9 saklanır.

Örneğin, bu satırlara sahipseniz:

```shell
üçüncü satır
ikinci satır
birinci satır
```

İmleciniz "üçüncü satır" üzerinde iken, bunları `dd` ile birer birer silin. Tüm satırlar silindikten sonra, kayıt 1 "birinci satır" (en son), kayıt 2 "ikinci satır" (ikinci en son) ve kayıt 3 "üçüncü satır" (en eski) içermelidir. Kayıt birin içeriğini almak için `"1p` yapın.

Bir yan not olarak, bu numaralı kayıtlar nokta komutu kullanıldığında otomatik olarak artırılır. Eğer numaralı kayıt bir (`"1`) "birinci satır" içeriyorsa, kayıt iki (`"2`) "ikinci satır" ve kayıt üç (`"3`) "üçüncü satır" içeriyorsa, bunları sırasıyla bu numara ile yapıştırabilirsiniz:
- Kayıt birin içeriğini yapıştırmak için `"1P` yapın.
- Kayıt ikinin içeriğini yapıştırmak için `.` yapın.
- Kayıt üçün içeriğini yapıştırmak için `.` yapın.

Bu numara ile her kayıt için geçerlidir. Eğer `"5P` ile başladıysanız, `.` `"6P` yapar, bir kez daha `.` `"7P` yapar, ve böyle devam eder.

Küçük silmeler, bir kelime silme (`dw`) veya kelime değiştirme (`cw`) gibi, numaralı kayıtlara kaydedilmez. Bunlar küçük silme kaydında (`"-`) saklanır, bunu bir sonraki bölümde tartışacağım.

## Küçük Silme Kaydı

Bir satırdan daha az değişiklikler veya silmeler, numaralı kayıtlara 0-9 değil, küçük silme kaydına (`"-`) saklanır.

Örneğin:
1. Bir kelime silin (`diw`)
2. Bir satırı silin (`dd`)
3. Bir satırı silin (`dd`)

`"-p` size birinci adımdaki silinen kelimeyi verir.

Başka bir örnek:
1. Bir kelime silin (`diw`)
2. Bir satırı silin (`dd`)
3. Bir kelime silin (`diw`)

`"-p` size üçüncü adımdaki silinen kelimeyi verir. `"1p` size ikinci adımdaki silinen satırı verir. Ne yazık ki, birinci adımdaki silinen kelimeyi geri almak için bir yol yoktur çünkü küçük silme kaydı yalnızca bir öğeyi saklar. Ancak, birinci adımdaki metni korumak istiyorsanız, bunu isimli kayıtlarla yapabilirsiniz.

## İsimli Kayıt

İsimli kayıtlar, Vim'in en çok yönlü kaydıdır. a-z kayıtlarına yıktığınız, değiştirdiğiniz ve sildiğiniz metinleri saklayabilir. Daha önce gördüğünüz diğer 3 kayıt türünün otomatik olarak metinleri kaydettiği gibi, isimli kaydı kullanmak için Vim'e açıkça söylemeniz gerekir; bu da size tam kontrol sağlar.

Bir kelimeyi a kaydına yankılamak için `"ayiw` yapabilirsiniz.
- `"a` Vim'e bir sonraki eylemin (silme / değiştirme / yankılama) a kaydında saklanacağını söyler.
- `yiw` kelimeyi yankılar.

a kaydından metni almak için `"ap` çalıştırın. İsimli kayıtlarla yirmi altı farklı metni saklamak için yirmi altı alfabetik karakter kullanabilirsiniz.

Bazen mevcut isimli kaydınıza ekleme yapmak isteyebilirsiniz. Bu durumda, metninizi baştan başlamaktansa ekleyebilirsiniz. Bunu yapmak için, o kaydın büyük harfli versiyonunu kullanabilirsiniz. Örneğin, eğer a kaydında "Merhaba " kelimesini zaten saklıyorsanız. Eğer "dünya" kelimesini a kaydına eklemek istiyorsanız, "dünya" kelimesini bulup A kaydı ile yankılayabilirsiniz (`"Ayiw`).

## Salt Okunur Kayıtlar

Vim'in üç salt okunur kaydı vardır: `.`, `:`, ve `%`. Kullanımları oldukça basittir:

```shell
.    Son eklenen metni saklar
:    Son çalıştırılan komut satırını saklar
%    Geçerli dosyanın adını saklar
```

Son yazdığınız metin "Merhaba Vim" ise, `".p` çalıştırmak "Merhaba Vim" metnini yazdırır. Geçerli dosyanın adını almak istiyorsanız, `"%p` çalıştırın. `:s/foo/bar/g` komutunu çalıştırırsanız, `":p` çalıştırmak "s/foo/bar/g" metnini yazdırır.

## Alternatif Dosya Kaydı

Vim'de `#` genellikle alternatif dosyayı temsil eder. Alternatif bir dosya, en son açtığınız dosyadır. Alternatif dosyanın adını eklemek için `"#p` kullanabilirsiniz.

## İfade Kaydı

Vim'in bir ifade kaydı vardır, `"=`, ifadeleri değerlendirmek için.

Matematiksel ifadeleri `1 + 1` değerlendirmek için:

```shell
"=1+1<Enter>p
```

Burada, Vim'e `"=` ile ifade kaydını kullandığınızı söylüyorsunuz. İfadeniz (`1 + 1`). Sonucu almak için `p` yazmanız gerekir. Daha önce belirtildiği gibi, ekleme modundan da kayda erişebilirsiniz. Ekleme modundan matematiksel ifadeyi değerlendirmek için:

```shell
Ctrl-R =1+1
```

Herhangi bir kaydın değerlerini ifade kaydı ile `@` ekleyerek de alabilirsiniz. Eğer a kaydındaki metni almak istiyorsanız:

```shell
"=@a
```

Sonra `<Enter>` tuşuna basın, ardından `p` yapın. Benzer şekilde, ekleme modundayken a kaydından değerleri almak için:

```shell
Ctrl-r =@a
```

İfade, Vim'de geniş bir konudur, bu yüzden burada yalnızca temel bilgileri kapsayacağım. İfadeleri daha ayrıntılı olarak sonraki Vimscript bölümlerinde ele alacağım.

## Seçim Kayıtları

Bazen dış programlardan bir metni kopyalayıp Vim'e yapıştırmak, ve tersine yapıştırmak istediğinizi düşünmüyor musunuz? Vim'in seçim kayıtları ile bunu yapabilirsiniz. Vim'in iki seçim kaydı vardır: `quotestar` (`"*`) ve `quoteplus` (`"+`). Bunları dış programlardan kopyalanan metne erişmek için kullanabilirsiniz.

Bir dış programda (örneğin Chrome tarayıcısı) iken bir metin bloğunu `Ctrl-C` (veya işletim sisteminize bağlı olarak `Cmd-C`) ile kopyalarsanız, normalde Vim'de metni yapıştırmak için `p` kullanamazsınız. Ancak, hem Vim'in `"+` hem de `"*` panonuza bağlıdır, bu yüzden metni aslında `"+p` veya `"*p` ile yapıştırabilirsiniz. Tersine, eğer Vim'den bir kelimeyi `"+yiw` veya `"*yiw` ile yankılarsanız, o metni dış programda `Ctrl-V` (veya `Cmd-V`) ile yapıştırabilirsiniz. Bunun yalnızca Vim programınızın `+clipboard` seçeneği ile birlikte gelmesi durumunda çalıştığını unutmayın (bunu kontrol etmek için `:version` çalıştırın).

Eğer `"*` ve `"+` aynı şeyi yapıyorsa, neden Vim'in iki farklı kaydı var diye merak edebilirsiniz? Bazı makineler X11 pencere sistemini kullanır. Bu sistemin 3 tür seçimi vardır: birincil, ikincil ve pano. Eğer makineniz X11 kullanıyorsa, Vim X11'in *birincil* seçimini `quotestar` (`"*`) kaydı ile ve X11'in *panosunu* `quoteplus` (`"+`) kaydı ile kullanır. Bu yalnızca Vim derlemenizde `+xterm_clipboard` seçeneği varsa geçerlidir. Eğer Vim'inizde `xterm_clipboard` yoksa, bu büyük bir sorun değildir. Bu, yalnızca `quotestar` ve `quoteplus`'ın değiştirilebilir olduğu anlamına gelir (benimki de yok).

`=*p` veya `=+p` (veya `"*p` veya `"+p`) yapmanın zahmetli olduğunu düşünüyorum. Dış programdan kopyalanan metni sadece `p` ile yapıştırmak için vimrc dosyanıza şunu ekleyebilirsiniz:

```shell
set clipboard=unnamed
```

Artık dış bir programdan bir metni kopyaladığımda, onu isimlendirilmemiş kayıt ile `p` ile yapıştırabilirim. Ayrıca Vim'den bir metni kopyalayıp dış bir programa yapıştırabilirim. Eğer `+xterm_clipboard` varsa, hem `unnamed` hem de `unnamedplus` pano seçeneklerini kullanmak isteyebilirsiniz.

## Kara Delik Kaydı

Her seferinde bir metni sildiğinizde veya değiştirdiğinizde, o metin otomatik olarak Vim kaydına saklanır. Bazen hiçbir şeyi kaydetmek istemediğiniz zamanlar olacaktır. Bunu nasıl yapabilirsiniz?

Kara delik kaydını (`"_`) kullanabilirsiniz. Bir satırı silmek ve Vim'in silinen satırı herhangi bir kayda saklamamasını sağlamak için `"_dd` kullanın.

Kara delik kaydı, kayıtların `/dev/null` gibidir.

## Son Arama Deseni Kaydı

Son aramanızı yapıştırmak için (`/` veya `?`), son arama deseni kaydını (`"/`) kullanabilirsiniz. Son arama terimini yapıştırmak için `"/p` kullanın.

## Kayıtları Görüntüleme

Tüm kayıtlarınızı görüntülemek için `:register` komutunu kullanın. Sadece "a, "1 ve "-" kayıtlarını görüntülemek için `:register a 1 -` kullanın.

Kayıtların içeriğine göz atmanızı sağlayan bir eklenti olan [vim-peekaboo](https://github.com/junegunn/vim-peekaboo) vardır; normal modda `"` veya `@` tuşuna ve ekleme modunda `Ctrl-R` tuşuna bastığınızda kayıtların içeriğine bakmanızı sağlar. Bu eklentiyi çok faydalı buluyorum çünkü çoğu zaman kayıtlarımdaki içeriği hatırlayamıyorum. Denemeye değer!

## Bir Kaydı Çalıştırma

İsimli kayıtlar yalnızca metin saklamak için değildir. Ayrıca `@` ile makroları çalıştırabilirler. Makroları bir sonraki bölümde ele alacağım.

Unutmayın ki makrolar Vim kayıtlarının içinde saklandığı için, saklanan metni makrolarla yanlışlıkla üzerine yazabilirsiniz. Eğer "Merhaba Vim" metnini a kaydına saklarsanız ve daha sonra aynı kayıtta bir makro kaydederseniz (`qa{makro-dizisi}q`), o makro daha önce sakladığınız "Merhaba Vim" metninin üzerine yazacaktır.
## Bir Kaydı Temizleme

Teknik olarak, herhangi bir kaydı temizlemek için bir ihtiyaç yoktur çünkü aynı kayıt adı altında depoladığınız sonraki metin onu üzerine yazacaktır. Ancak, boş bir makro kaydederek herhangi bir adlandırılmış kaydı hızlıca temizleyebilirsiniz. Örneğin, `qaq` komutunu çalıştırırsanız, Vim a kaydında boş bir makro kaydedecektir.

Bir diğer alternatif, `:call setreg('a', 'hello register a')` komutunu çalıştırmaktır; burada a, a kaydıdır ve "hello register a" depolamak istediğiniz metindir.

Kaydı temizlemenin bir başka yolu da "a kaydının içeriğini boş bir dize ile ayarlamak için `:let @a = ''` ifadesini kullanmaktır.

## Bir Kaydın İçeriğini Yapıştırma

Herhangi bir kaydın içeriğini yapıştırmak için `:put` komutunu kullanabilirsiniz. Örneğin, `:put a` komutunu çalıştırırsanız, Vim a kaydının içeriğini mevcut satırın altına yazdıracaktır. Bu, `"ap` ile çok benzer bir davranış sergiler; farkı ise normal mod komutu `p` kaydın içeriğini imlecin ardından yazdırırken, `:put` komutu kaydın içeriğini yeni bir satıra yazdırır.

`:put` bir komut satırı komutu olduğundan, ona bir adres geçirebilirsiniz. `:10put a` komutu, a kaydından metni 10. satırın altına yapıştıracaktır.

`:put` komutunu siyah delik kaydı (`"_`) ile geçmenin havalı bir yolu vardır. Siyah delik kaydı herhangi bir metni depolamadığı için, `:put _` boş bir satır ekleyecektir. Bunu, birden fazla boş satır eklemek için global komutla birleştirebilirsiniz. Örneğin, "end" metnini içeren tüm satırların altına boş satırlar eklemek için `:g/end/put _` komutunu çalıştırın. Global komutu daha sonra öğreneceksiniz.

## Kayıtları Akıllı Bir Şekilde Öğrenme

Sonuna geldiniz. Tebrikler! Eğer bu kadar çok bilgiyle bunalmış hissediyorsanız, yalnız değilsiniz. Vim kayıtları hakkında öğrenmeye ilk başladığımda, bir anda alınacak çok fazla bilgi vardı.

Tüm kayıtları hemen ezberlemenizi düşünmüyorum. Verimli olmak için, yalnızca bu 3 kaydı kullanmaya başlayabilirsiniz:
1. İsimlendirilmemiş kayıt (`""`).
2. İsimlendirilmiş kayıtlar (`"a-z`).
3. Numaralı kayıtlar (`"0-9`).

İsimlendirilmemiş kayıt varsayılan olarak `p` ve `P` ile kullanıldığından, yalnızca iki kaydı öğrenmeniz gerekir: isimlendirilmiş kayıtlar ve numaralı kayıtlar. İhtiyacınız oldukça daha fazla kaydı yavaş yavaş öğrenin. Acele etmeyin.

Ortalama bir insanın sınırlı kısa süreli hafıza kapasitesi vardır, bu da bir seferde yaklaşık 5 - 7 öğedir. Bu nedenle, günlük düzenlememde yalnızca yaklaşık 5 - 7 isimlendirilmiş kayıt kullanıyorum. Hepsini aklımda tutmam mümkün değil. Genellikle a kaydından başlarım, ardından b kaydına geçerim, alfabetik sırayı takip ederim. Bunu deneyin ve sizin için en iyi hangi tekniğin işe yaradığını görmek için deney yapın.

Vim kayıtları güçlüdür. Stratejik olarak kullanıldığında, sayısız tekrar eden metinleri yazmaktan sizi kurtarabilir. Şimdi, makroları öğrenelim.