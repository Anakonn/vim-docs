---
description: Vim'in ekleme modunda yazma verimliliğinizi artırmak için kullanabileceğiniz
  çeşitli özellikler ve ekleme moduna geçiş yollarını öğrenin.
title: Ch06. Insert Mode
---

Insert modu, birçok metin düzenleyicinin varsayılan modudur. Bu modda, yazdığınız şey, aldığınız şeydir.

Ancak bu, öğrenilecek çok şey olmadığı anlamına gelmez. Vim'in insert modu birçok kullanışlı özelliği içerir. Bu bölümde, yazma verimliliğinizi artırmak için Vim'deki bu insert modu özelliklerini nasıl kullanacağınızı öğreneceksiniz.

## Insert Moduna Geçmenin Yolları

Normal moddan insert moduna geçmenin birçok yolu vardır. İşte bunlardan bazıları:

```shell
i    İmlecin önüne metin ekle
I    Satırın ilk boş olmayan karakterinin önüne metin ekle
a    İmlecin arkasına metin ekle
A    Satırın sonuna metin ekle
o    İmlecin altına yeni bir satır başlat ve metin ekle
O    İmlecin üstüne yeni bir satır başlat ve metin ekle
s    İmlecin altındaki karakteri sil ve metin ekle
S    Mevcut satırı sil ve metin ekle, "cc" için eşanlamlı
gi   Son insert modunun durduğu aynı konuma metin ekle
gI   Satırın başına metin ekle (sütun 1)
```

Küçük harf / büyük harf desenine dikkat edin. Her küçük harfli komutun bir büyük harf karşılığı vardır. Eğer yeniseniz, yukarıdaki tüm listeyi hatırlayamıyorsanız endişelenmeyin. `i` ve `o` ile başlayın. Bunlar sizi başlatmak için yeterli olmalıdır. Zamanla daha fazlasını öğrenin.

## Insert Modundan Çıkmanın Farklı Yolları

Insert modundayken normal moda dönmenin birkaç farklı yolu vardır:

```shell
<Esc>     Insert modundan çıkar ve normal moda geç
Ctrl-[    Insert modundan çıkar ve normal moda geç
Ctrl-C    Ctrl-[ ve <Esc> gibi, ancak kısaltma kontrolü yapmaz
```

`<Esc>` tuşunun ulaşması zor olduğunu düşünüyorum, bu yüzden bilgisayarımda `<Caps-Lock>` tuşunu `<Esc>` gibi davranacak şekilde ayarladım. Bill Joy'un ADM-3A klavyesini (Vi yaratıcısı) ararsanız, `<Esc>` tuşunun modern klavyeler gibi en üst sol köşede değil, `q` tuşunun solunda yer aldığını göreceksiniz. Bu yüzden `<Caps lock>` tuşunu `<Esc>`'ye eşlemek mantıklı geliyor.

Vim kullanıcılarının yaptığı başka bir yaygın gelenek, insert modunda `<Esc>`'yi `jj` veya `jk` ile eşlemektir. Bu seçeneği tercih ediyorsanız, vimrc dosyanıza bu satırlardan birini (veya her ikisini) ekleyin.

```shell
inoremap jj <Esc>
inoremap jk <Esc>
```

## Insert Modunu Tekrar Etme

Insert moduna girmeden önce bir sayı parametresi geçebilirsiniz. Örneğin:

```shell
10i
```

"hello world!" yazıp insert modundan çıkarsanız, Vim metni 10 kez tekrarlar. Bu, herhangi bir insert modu yöntemiyle çalışır (örneğin: `10I`, `11a`, `12o`).

## Insert Modunda Parçaları Silme

Yazım hatası yaptığınızda, `<Backspace>` tuşuna tekrar tekrar basmak zahmetli olabilir. Hatanızı silmek için normal moda geçmek daha mantıklı olabilir. Insert modundayken bir seferde birkaç karakteri de silebilirsiniz.

```shell
Ctrl-h    Bir karakter sil
Ctrl-w    Bir kelime sil
Ctrl-u    Tüm satırı sil
```

## Kayıttan Ekleme

Vim kayıtları, metinleri gelecekteki kullanım için saklayabilir. Insert modundayken herhangi bir adlandırılmış kayıttan metin eklemek için `Ctrl-R` artı kayıt sembolünü yazın. Kullanabileceğiniz birçok sembol vardır, ancak bu bölümde yalnızca adlandırılmış kayıtları (a-z) ele alalım.

Bunu uygulamada görmek için önce bir kelimeyi `a` kaydına yankelemeniz gerekir. İmlecinizi herhangi bir kelimenin üzerine getirin. Ardından yazın:

```shell
"ayiw
```

- `"a` Vim'e bir sonraki eyleminizin hedefinin `a` kaydına gideceğini söyler.
- `yiw` iç kelimeyi yankeler. Yeniden hatırlamak için Vim dilbilgisi bölümüne göz atın.

Kayıt `a`, az önce yankelenen kelimeyi içerir. Insert modundayken, `a` kaydında saklanan metni yapıştırmak için:

```shell
Ctrl-R a
```

Vim'de birden fazla kayıt türü vardır. Bunları daha sonraki bir bölümde daha ayrıntılı olarak ele alacağım.

## Kaydırma

Insert modundayken kaydırabileceğinizi biliyor muydunuz? Insert modundayken `Ctrl-X` alt moduna giderseniz, ek işlemler yapabilirsiniz. Kaydırma bunlardan biridir.

```shell
Ctrl-X Ctrl-Y    Yukarı kaydır
Ctrl-X Ctrl-E    Aşağı kaydır
```

## Otomatik Tamamlama

Yukarıda belirtildiği gibi, insert modundan `Ctrl-X` tuşuna basarsanız, Vim bir alt moda geçer. Bu insert mod alt modundayken metin otomatik tamamlama yapabilirsiniz. [intellisense](https://code.visualstudio.com/docs/editor/intellisense) veya başka bir Dil Sunucu Protokolü (LSP) kadar iyi olmasa da, kutudan çıkar çıkmaz mevcut olan bir şey için oldukça yetenekli bir özelliktir.

Başlamak için bazı yararlı otomatik tamamlama komutları:

```shell
Ctrl-X Ctrl-L	   Tüm satırı ekle
Ctrl-X Ctrl-N	   Geçerli dosyadan metin ekle
Ctrl-X Ctrl-I	   Dahil edilen dosyalardan metin ekle
Ctrl-X Ctrl-F	   Dosya adı ekle
```

Otomatik tamamlama tetiklendiğinde, Vim bir açılır pencere gösterir. Açılır pencerede yukarı ve aşağı gezinmek için `Ctrl-N` ve `Ctrl-P` kullanın.

Vim ayrıca `Ctrl-X` alt modunu içermeyen iki otomatik tamamlama kısayolu sunar:

```shell
Ctrl-N             Bir sonraki kelime eşleşmesini bul
Ctrl-P             Önceki kelime eşleşmesini bul
```

Genel olarak, Vim otomatik tamamlama kaynağı için tüm mevcut tamponlardaki metne bakar. "Chocolate donuts are the best" diyen bir satır içeren açık bir tamponunuz varsa:
- "Choco" yazıp `Ctrl-X Ctrl-L` yaparsanız, tüm satırı eşleştirir ve yazdırır.
- "Choco" yazıp `Ctrl-P` yaparsanız, "Chocolate" kelimesini eşleştirir ve yazdırır.

Otomatik tamamlama, Vim'de geniş bir konudur. Bu sadece buzdağının görünen kısmıdır. Daha fazla bilgi için `:h ins-completion` kısmına bakın.

## Normal Mod Komutunu Çalıştırma

Vim'in insert modundayken normal mod komutunu çalıştırabileceğini biliyor muydunuz?

Insert modundayken `Ctrl-O` tuşuna basarsanız, insert-normal alt moduna geçersiniz. Sol alt köşedeki mod göstergesine bakarsanız, normalde `-- INSERT --` görürsünüz, ancak `Ctrl-O` tuşuna basmak bunu `-- (insert) --` olarak değiştirir. Bu modda, *bir* normal mod komutu yapabilirsiniz. Yapabileceğiniz bazı şeyler:

**Ortalamak ve atlamak**

```shell
Ctrl-O zz       Pencereyi ortala
Ctrl-O H/M/L    Pencerenin üstüne/orta/kısmına atla
Ctrl-O 'a       Mark 'a'ya atla
```

**Metni tekrarlama**

```shell
Ctrl-O 100ihello    "hello" kelimesini 100 kez ekle
```

**Terminal komutlarını çalıştırma**

```shell
Ctrl-O !! curl https://google.com    curl komutunu çalıştır
Ctrl-O !! pwd                        pwd komutunu çalıştır
```

**Daha hızlı silme**

```shell
Ctrl-O dtz    Mevcut konumdan "z" harfine kadar sil
Ctrl-O D      Mevcut konumdan satırın sonuna kadar sil
```

## Insert Modunu Akıllıca Öğrenin

Eğer benim gibi başka bir metin düzenleyicisinden geldiyseniz, insert modunda kalmak cazip olabilir. Ancak, yeni bir metin girmediğinizde insert modunda kalmak bir anti-patern'dir. Parmaklarınız yeni metin yazmadığında normal moda geçme alışkanlığı geliştirin.

Bir metin eklemeniz gerektiğinde, önce o metnin zaten var olup olmadığını kendinize sorun. Eğer varsa, o metni yazmak yerine yankelemeyi veya taşımayı deneyin. Insert modunu kullanmanız gerekiyorsa, mümkün olduğunca o metni otomatik tamamlama ile tamamlayıp tamamlayamayacağınıza bakın. Eğer mümkünse, aynı kelimeyi birden fazla kez yazmaktan kaçının.