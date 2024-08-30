---
description: Vim makroları ile tekrarlayan işlemleri kaydedip otomatikleştirerek dosya
  düzenleme sürecinizi hızlandırın ve daha verimli hale getirin.
title: Ch09. Macros
---

Dosyaları düzenlerken, aynı eylemleri tekrar tekrar yaptığınızı görebilirsiniz. Bu eylemleri bir kez yapıp, ihtiyaç duyduğunuzda tekrar oynatabilseydiniz harika olmaz mıydı? Vim makroları ile eylemleri kaydedebilir ve bunları ihtiyaç duyduğunuzda çalıştırılmak üzere Vim kayıtlarına depolayabilirsiniz.

Bu bölümde, makroları sıradan görevleri otomatikleştirmek için nasıl kullanacağınızı öğreneceksiniz (üstelik dosyanızın kendini düzenlemesini izlemek de oldukça havalı).

## Temel Makrolar

İşte bir Vim makrosunun temel sözdizimi:

```shell
qa                     Makro kaydını a kaydında başlat
q (kayıt sırasında)    Makro kaydını durdur
```

Makroları depolamak için herhangi bir küçük harf (a-z) seçebilirsiniz. İşte bir makroyu nasıl çalıştırabileceğiniz:

```shell
@a    a kaydından makroyu çalıştır
@@    Son çalıştırılan makroları çalıştır
```

Diyelim ki bu metne sahipsiniz ve her satırdaki her şeyi büyük harfe çevirmek istiyorsunuz:

```shell
hello
vim
macros
are
awesome
```

İmleciniz "hello" satırının başında iken, şunu çalıştırın:

```shell
qa0gU$jq
```

Açıklama:
- `qa` a kaydında bir makro kaydını başlatır.
- `0` satırın başına gider.
- `gU$` mevcut konumunuzdan satırın sonuna kadar metni büyük harfe çevirir.
- `j` bir satır aşağı gider.
- `q` kaydı durdurur.

Tekrar oynatmak için `@a` komutunu çalıştırın. Diğer birçok Vim komutunda olduğu gibi, makrolara bir sayı argümanı geçebilirsiniz. Örneğin, `3@a` çalıştırmak makroyu üç kez çalıştırır.

## Güvenlik Koruması

Makro çalıştırma, bir hata ile karşılaştığında otomatik olarak sona erer. Diyelim ki bu metne sahipsiniz:

```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

Her satırdaki ilk kelimeyi büyük harfe çevirmek istiyorsanız, bu makro işe yarayacaktır:

```shell
qa0W~jq
```

Yukarıdaki komutun açıklaması:
- `qa` a kaydında bir makro kaydını başlatır.
- `0` satırın başına gider.
- `W` bir sonraki KELİME'ye gider.
- `~` imlecin altındaki karakterin durumunu değiştirir.
- `j` bir satır aşağı gider.
- `q` kaydı durdurur.

Makro çalıştırmamı saymaktan çok saymayı tercih ederim, bu yüzden genellikle bunu doksan dokuz kez çağırırım (`99@a`). Bu komutla, Vim aslında bu makroyu doksan dokuz kez çalıştırmaz. Vim son satıra ulaştığında ve `j` hareketini çalıştırdığında, aşağı gidecek daha fazla satır bulamaz, bir hata fırlatır ve makro çalıştırmasını durdurur.

Makro çalıştırmasının ilk hata ile karşılaştığında durması iyi bir özelliktir, aksi takdirde Vim bu makroyu doksan dokuz kez çalıştırmaya devam eder, oysa zaten satırın sonuna ulaşmıştır.

## Komut Satırı Makrosu

Normal modda `@a` çalıştırmak, Vim'de makroları çalıştırmanın tek yolu değildir. Ayrıca `:normal @a` komut satırını da çalıştırabilirsiniz. `:normal`, kullanıcıya argüman olarak verilen herhangi bir normal mod komutunu çalıştırma imkanı tanır. Yukarıdaki durumda, bu normal moddan `@a` çalıştırmakla aynıdır.

`:normal` komutu aralıkları argüman olarak kabul eder. Bunu belirli aralıklarda makro çalıştırmak için kullanabilirsiniz. Eğer makronuzu 2 ile 3 arasındaki satırlarda çalıştırmak istiyorsanız, `:2,3 normal @a` komutunu çalıştırabilirsiniz.

## Birden Fazla Dosya Üzerinde Makro Çalıştırma

Diyelim ki birkaç `.txt` dosyanız var, her biri bazı metinler içeriyor. Göreviniz yalnızca "donut" kelimesini içeren satırlardaki ilk kelimeyi büyük harfe çevirmek. `0W~j` a kaydında (önceki makro ile aynı) olduğunu varsayalım. Bunu hızlı bir şekilde nasıl başarabilirsiniz?

İlk dosya:

```shell
## savory.txt
a. cheddar jalapeno donut
b. mac n cheese donut
c. fried dumpling
```

İkinci dosya:

```shell
## sweet.txt
a. chocolate donut
b. chocolate pancake
c. powdered sugar donut
```

Üçüncü dosya:

```shell
## plain.txt
a. wheat bread
b. plain donut
```

Bunu şöyle yapabilirsiniz:
- `:args *.txt` mevcut dizininizdeki tüm `.txt` dosyalarını bulmak için.
- `:argdo g/donut/normal @a` her dosya içinde `:args` komutunu çalıştırır.
- `:argdo update` tampon değiştirilmiş olduğunda, `:args` içindeki her dosyayı kaydetmek için `update` komutunu çalıştırır.

Eğer `:g/donut/normal @a` global komutunu bilmiyorsanız, bu, verdiğiniz komutu (`normal @a`) kalıpla eşleşen satırlarda çalıştırır (`/donut/`). Global komutu daha sonraki bir bölümde ele alacağım.

## Rekürsif Makro

Bir makroyu kaydederken aynı makro kaydını çağırarak rekürsif olarak çalıştırabilirsiniz. Diyelim ki bu listeye tekrar sahipsiniz ve ilk kelimenin durumunu değiştirmek istiyorsunuz:

```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

Bu sefer, bunu rekürsif olarak yapalım. Şunu çalıştırın:

```shell
qaqqa0W~j@aq
```

Adımların açıklaması:
- `qaq` boş bir makro a kaydeder. Rekürsif olarak makroyu çağırdığınızda, o kayıtta ne varsa çalıştırılacağı için boş bir kayıttan başlamak gereklidir.
- `qa` a kaydında kayda başlar.
- `0` mevcut satırın ilk karakterine gider.
- `W` bir sonraki KELİME'ye gider.
- `~` imlecin altındaki karakterin durumunu değiştirir.
- `j` bir satır aşağı gider.
- `@a` a makrosunu çalıştırır.
- `q` kaydı durdurur.

Artık sadece `@a` çalıştırarak Vim'in makroyu rekürsif olarak çalıştırmasını izleyebilirsiniz.

Makro ne zaman duracağını nasıl biliyordu? Makro son satıra geldiğinde, `j` çalıştırmaya çalıştı, aşağı gidecek daha fazla satır olmadığında, makro çalıştırmasını durdurdu.

## Bir Makroya Ekleme

Mevcut bir makroya eylemler eklemeniz gerektiğinde, makroyu sıfırdan yeniden oluşturmak yerine, mevcut birine eylemler ekleyebilirsiniz. Kayıt bölümünde, adlandırılmış bir kaydı büyük harfli sembolü kullanarak ekleyebileceğinizi öğrendiniz. Aynı kural geçerlidir. A makro kaydına eylemler eklemek için, A kaydını kullanın.

A kaydında bir makro kaydedin: `qa0W~q` (bu dizideki bir sonraki KELİME'nin durumunu değiştirir). Satırın sonuna bir nokta eklemek için yeni bir diziyi eklemek istiyorsanız, şunu çalıştırın:

```shell
qAA.<Esc>q
```

Açıklama:
- `qA` A kaydında makro kaydını başlatır.
- `A.<Esc>` satırın sonuna (burada `A` ekleme modu komutudur, makro A ile karıştırılmamalıdır) bir nokta ekler, ardından ekleme modundan çıkar.
- `q` makro kaydını durdurur.

Artık `@a` çalıştırdığınızda, yalnızca bir sonraki KELİME'nin durumunu değiştirmekle kalmaz, aynı zamanda satırın sonuna bir nokta ekler.

## Bir Makroyu Değiştirme

Bir makronun ortasına yeni eylemler eklemeniz gerektiğinde ne olur?

Diyelim ki ilk gerçek kelimeyi değiştiren ve satırın sonuna bir nokta ekleyen bir makronuz var, `0W~A.<Esc>` a kaydında. İlk kelimeyi büyük harfe çevirip satırın sonuna bir nokta eklemeden önce "deep fried" kelimesini "donut" kelimesinin önüne eklemeniz gerektiğini varsayalım *(çünkü normal donutlardan daha iyi olan tek şey derin yağda kızartılmış donutlardır)*.

Önceki bölümden metni yeniden kullanacağım:
```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

Öncelikle mevcut makroyu çağırın (önceki bölümden makroyu a kaydında tuttuğunuzu varsayalım) `:put a` ile:

```shell
0W~A.^[
```

Bu `^[` nedir? `0W~A.<Esc>` yapmadınız mı? `<Esc>` nerede? `^[`, Vim'in `<Esc>`'nin *içsel kod* temsilidir. Belirli özel tuşlarla, Vim bu tuşların temsilini içsel kodlar biçiminde yazdırır. `<Esc>`, `<Backspace>` ve `<Enter>` gibi bazı yaygın tuşların içsel kod temsilleri vardır. Daha fazla özel tuş vardır, ancak bunlar bu bölümün kapsamı dışındadır.

Makroya geri dönersek, durum değiştirme operatöründen (`~`) hemen sonra, satırın sonuna gitmek için (`$`), bir kelime geri gitmek için (`b`), ekleme moduna geçmek için (`i`), "deep fried " yazmak için ( "fried " kelimesinden sonra boşluğu unutmayın) ve ekleme modundan çıkmak için (`<Esc>`) talimatları ekleyelim.

Sonunda şu şekilde olacaksınız:

```shell
0W~$bideep fried <Esc>A.^[
```

Küçük bir sorun var. Vim `<Esc>`'yi anlamıyor. `<Esc>`'yi kelime anlamıyla yazamazsınız. `<Esc>` tuşunun içsel kod temsilini yazmanız gerekecek. Ekleme modundayken, `Ctrl-V` tuşuna basıp ardından `<Esc>` tuşuna basmalısınız. Vim `^[` yazdıracaktır. `Ctrl-V`, bir sonraki sayısal olmayan karakteri *kelime anlamıyla* eklemek için bir ekleme modu operatörüdür. Makro kodunuz şimdi şöyle görünmelidir:

```shell
0W~$bideep fried ^[A.^[
```

Değiştirilen talimatı a kaydına eklemek için, adlandırılmış bir kayda yeni bir giriş eklerken yaptığınız gibi yapabilirsiniz. Satırın başında `“ay$` çalıştırarak yıpranmış metni a kaydına depolayın.

Artık `@a` çalıştırdığınızda, makronuz ilk kelimenin durumunu değiştirir, "deep fried " kelimesini "donut" kelimesinin önüne ekler ve satırın sonuna bir "." ekler. Afiyet olsun!

Bir makroyu değiştirmek için alternatif bir yol, bir komut satırı ifadesi kullanmaktır. `:let @a="` yazın, ardından `Ctrl-R a` yapın, bu, a kaydının içeriğini kelime anlamıyla yapıştırır. Son olarak, çift tırnakları (`"`) kapatmayı unutmayın. Şöyle bir şeyiniz olabilir: `:let @a="0W~$bideep fried ^[A.^["`.

## Makro Redundansı

Bir makroyu bir kayıttan diğerine kolayca kopyalayabilirsiniz. Örneğin, a kaydındaki bir makroyu z kaydına kopyalamak için `:let @z = @a` yapabilirsiniz. `@a`, a kaydının içeriğini temsil eder. Artık `@z` çalıştırdığınızda, tam olarak `@a` ile aynı eylemleri gerçekleştirir.

En sık kullandığım makrolarda bir redunansı oluşturmanın yararlı olduğunu düşünüyorum. İş akışımda genellikle makroları ilk yedi alfabetik harfte (a-g) kaydediyorum ve çoğu zaman bunları fazla düşünmeden değiştiriyorum. Kullanışlı makroları alfabetik sıranın sonuna doğru taşımak, onları değiştirme konusunda endişelenmeden korumamı sağlar.

## Seri vs Paralel Makro

Vim, makroları seri ve paralel olarak çalıştırabilir. Diyelim ki bu metne sahipsiniz:

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

Tüm büyük harfli "FUNC" ifadelerini küçük harfe çevirmek için bir makro kaydetmek istiyorsanız, bu makro işe yarayacaktır:

```shell
qa0f{gui{jq
```

Açıklama:
- `qa` a kaydında kayda başlar.
- `0` ilk satıra gider.
- `f{` "{" ifadesinin ilk örneğini bulur.
- `gui{` parantez içindeki metni küçük harfe çevirir (`gu`).
- `j` bir satır aşağı gider.
- `q` makro kaydını durdurur.

Artık kalan satırlarda çalıştırmak için `99@a` çalıştırabilirsiniz. Ancak, dosyanızda bu import ifadesi varsa ne olur?

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import foo from "bar";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

`99@a` çalıştırmak, yalnızca makroyu üç kez çalıştırır. "foo" satırında `f{` çalıştırma hatası nedeniyle son iki satırda makroyu çalıştırmaz. Bu, makroyu seri olarak çalıştırdığınızda beklenen bir durumdur. "FUNC4" satırına gidebilir ve o makroyu tekrar oynatabilirsiniz. Ancak her şeyi tek seferde halletmek istiyorsanız?

Makroyu paralel olarak çalıştırın.

Önceki bölümden hatırlayacağınız gibi, makrolar `:normal` komut satırı komutu kullanılarak çalıştırılabilir (örneğin: `:3,5 normal @a`, 3-5 satırlarında a makrosunu çalıştırır). `:1,$ normal @a` çalıştırırsanız, makronun "foo" satırı hariç tüm satırlarda çalıştırıldığını göreceksiniz. İşe yarıyor!

Vim içsel olarak makroları gerçekten paralel olarak çalıştırmasa da, dışarıdan böyle davranır. Vim, `@a`'yı *bağımsız* olarak her satırda ilk satırdan son satıra kadar (`1,$`) çalıştırır. Vim bu makroları bağımsız olarak çalıştırdığından, her satır, makro çalıştırmalarından birinin "foo" satırında başarısız olduğunu bilmez.
## Makroları Akıllı Bir Şekilde Öğrenin

Düzenleme sırasında yaptığınız birçok şey tekrarlayıcıdır. Düzenlemede daha iyi olmak için tekrarlayıcı eylemleri tespit etme alışkanlığı edinin. Aynı eylemi iki kez gerçekleştirmek zorunda kalmamak için makroları (veya nokta komutunu) kullanın. Vim'de yapabileceğiniz hemen hemen her şey makrolarla tekrar edilebilir.

Başlangıçta makro yazmak benim için çok garipti, ama pes etmeyin. Yeterince pratikle, her şeyi otomatikleştirme alışkanlığı edineceksiniz.

Makrolarınızı hatırlamanıza yardımcı olması için mnemonikler kullanmanın faydalı olabileceğini düşünebilirsiniz. Bir fonksiyon oluşturan bir makronuz varsa, "f kaydını (`qf`) kullanın. Sayısal işlemler için bir makronuz varsa, "n kaydı işe yarayacaktır (`qn`). O işlemi düşündüğünüzde aklınıza gelen *ilk adlandırılmış kayıt* ile adlandırın. Ayrıca, "q kaydının iyi bir varsayılan makro kaydı olduğunu düşünüyorum çünkü `qq` üretmek için daha az beyin gücü gerektiriyor. Son olarak, makrolarımı `qa`, sonra `qb`, sonra `qc` şeklinde alfabetik sırayla artırmayı da seviyorum.

Sizin için en iyi çalışan bir yöntem bulun.