---
description: Bu bölümde, Vim'de projelerinizi korumak için View, Session ve Viminfo
  kullanarak ayarları, katlamaları ve düzenleri nasıl saklayacağınızı öğreneceksiniz.
title: Ch20. Views, Sessions, and Viminfo
---

Bir projede bir süre çalıştıktan sonra, projenin kendi ayarları, katmanları, tamponları, düzenleri vb. ile şekil almaya başladığını görebilirsiniz. Bu, bir süre yaşadıktan sonra dairenizi dekore etmeye benziyor. Sorun şu ki, Vim'i kapattığınızda bu değişiklikleri kaybedersiniz. Bir dahaki sefere Vim'i açtığınızda, sanki hiç gitmemişsiniz gibi görünseydi güzel olmaz mıydı?

Bu bölümde, projelerinizin "anlık görüntüsünü" korumak için View, Session ve Viminfo'yu nasıl kullanacağınızı öğreneceksiniz.

## View

View, üç (View, Session, Viminfo) arasındaki en küçük alt kümedir. Bir pencere için ayarların bir koleksiyonudur. Bir pencerede uzun süre çalışıyorsanız ve haritaları ve katmanları korumak istiyorsanız, bir View kullanabilirsiniz.

`foo.txt` adında bir dosya oluşturalım:

```shell
foo1
foo2
foo3
foo4
foo5
foo6
foo7
foo8
foo9
foo10
```

Bu dosyada üç değişiklik yapın:
1. 1. satırda manuel bir katman oluşturun `zf4j` (sonraki 4 satırı katlayın).
2. `number` ayarını değiştirin: `setlocal nonumber norelativenumber`. Bu, pencerenin sol tarafındaki numara göstergelerini kaldıracaktır.
3. Her seferinde `j` tuşuna bastığınızda bir yerine iki satır aşağı inmek için yerel bir eşleme oluşturun: `:nnoremap <buffer> j jj`.

Dosyanız şöyle görünmelidir:

```shell
+-- 5 lines: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

### View Niteliklerini Yapılandırma

Çalıştırın:

```shell
:set viewoptions?
```

Varsayılan olarak şunu söylemelidir (sizin vimrc'niz farklı görünebilir):

```shell
viewoptions=folds,cursor,curdir
```

`viewoptions`'ı yapılandıralım. Korumak istediğiniz üç nitelik katmanlar, haritalar ve yerel ayar seçenekleridir. Ayarınız benimki gibi görünüyorsa, zaten `folds` seçeneğine sahipsiniz. View'a `localoptions`'ı hatırlamasını söylemelisiniz. Çalıştırın:

```shell
:set viewoptions+=localoptions
```

`viewoptions` için başka hangi seçeneklerin mevcut olduğunu öğrenmek için `:h viewoptions`'a bakın. Artık `:set viewoptions?` komutunu çalıştırdığınızda şunu görmelisiniz:

```shell
viewoptions=folds,cursor,curdir,localoptions
```

### View'i Kaydetme

`foo.txt` penceresi düzgün bir şekilde katlanmış ve `nonumber norelativenumber` seçeneklerine sahip olduğuna göre, View'i kaydedelim. Çalıştırın:

```shell
:mkview
```

Vim bir View dosyası oluşturur.

### View Dosyaları

Vim bu View dosyasını nereye kaydettiğini merak edebilirsiniz. Vim'in nereye kaydettiğini görmek için çalıştırın:

```shell
:set viewdir?
```

Unix tabanlı işletim sistemlerinde varsayılan olarak `~/.vim/view` demelidir (farklı bir işletim sisteminiz varsa, farklı bir yol gösterebilir. Daha fazla bilgi için `:h viewdir`'e bakın). Eğer Unix tabanlı bir işletim sistemi kullanıyorsanız ve bunu farklı bir yola değiştirmek istiyorsanız, vimrc'nize şunu ekleyin:

```shell
set viewdir=$HOME/else/where
```

### View Dosyasını Yükleme

Eğer `foo.txt` dosyasını kapatmadıysanız, kapatın ve tekrar açın. **Değişiklikler olmadan orijinal metni görmelisiniz.** Bu beklenen bir durumdur.

Durumu geri yüklemek için View dosyasını yüklemeniz gerekir. Çalıştırın:

```shell
:loadview
```

Artık şunu görmelisiniz:

```shell
+-- 5 lines: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

Katmanlar, yerel ayarlar ve yerel eşlemeler geri yüklendi. Eğer fark ederseniz, imleciniz `:mkview` komutunu çalıştırdığınızda bıraktığınız satırda olmalıdır. `cursor` seçeneğiniz olduğu sürece, View imleç konumunuzu da hatırlar.

### Birden Fazla View

Vim, 9 numaralı View (1-9) kaydetmenize izin verir.

Diyelim ki, ek bir katman oluşturmak istiyorsunuz (örneğin son iki satırı katlamak istiyorsunuz) `:9,10 fold` ile. Bunu View 1 olarak kaydedelim. Çalıştırın:

```shell
:mkview 1
```

Eğer `:6,7 fold` ile bir katman daha oluşturmak ve bunu farklı bir View olarak kaydetmek istiyorsanız, çalıştırın:

```shell
:mkview 2
```

Dosyayı kapatın. `foo.txt` dosyasını açtığınızda ve View 1'i yüklemek istediğinizde, çalıştırın:

```shell
:loadview 1
```

View 2'yi yüklemek için çalıştırın:

```shell
:loadview 2
```

Orijinal View'i yüklemek için çalıştırın:

```shell
:loadview
```

### View Oluşturmayı Otomatikleştirme

Başınıza gelebilecek en kötü şeylerden biri, katmanlarla büyük bir dosyayı düzenlemek için sayısız saat harcadıktan sonra, pencereyi yanlışlıkla kapatıp tüm katman bilgilerini kaybetmektir. Bunu önlemek için, her seferinde bir tampon kapattığınızda otomatik olarak bir View oluşturmak isteyebilirsiniz. Vimrc'nize şunu ekleyin:

```shell
autocmd BufWinLeave *.txt mkview
```

Ayrıca, bir tampon açtığınızda View'i yüklemek de güzel olabilir:

```shell
autocmd BufWinEnter *.txt silent loadview
```

Artık `txt` dosyalarıyla çalışırken View oluşturma ve yükleme konusunda endişelenmenize gerek kalmadı. Zamanla, `~/.vim/view` dizininiz View dosyalarıyla dolmaya başlayabilir. Bunu birkaç ayda bir temizlemek iyi bir fikirdir.

## Oturumlar

Eğer bir View bir pencerenin ayarlarını kaydediyorsa, bir Session tüm pencerelerin bilgilerini (düzen dahil) kaydeder.

### Yeni Bir Oturum Oluşturma

Diyelim ki `foobarbaz` projesinde bu 3 dosya ile çalışıyorsunuz:

`foo.txt` içinde:

```shell
foo1
foo2
foo3
foo4
foo5
foo6
foo7
foo8
foo9
foo10
```

`bar.txt` içinde:

```shell
bar1
bar2
bar3
bar4
bar5
bar6
bar7
bar8
bar9
bar10
```

`baz.txt` içinde:

```shell
baz1
baz2
baz3
baz4
baz5
baz6
baz7
baz8
baz9
baz10
```

Şimdi pencerelerinizi `:split` ve `:vsplit` ile böldüğünüzü varsayalım. Bu görünümü korumak için oturumu kaydetmeniz gerekir. Çalıştırın:

```shell
:mksession
```

Varsayılan olarak `mkview`'in `~/.vim/view`'e kaydettiği gibi, `mksession` mevcut dizinde bir Oturum dosyası (`Session.vim`) kaydeder. İçinde ne olduğunu merak ediyorsanız dosyayı kontrol edin.

Eğer Oturum dosyasını başka bir yere kaydetmek istiyorsanız, `mksession`'e bir argüman verebilirsiniz:

```shell
:mksession ~/some/where/else.vim
```

Mevcut Oturum dosyasını üzerine yazmak istiyorsanız, komutu `!` ile çağırın (`:mksession! ~/some/where/else.vim`).

### Oturum Yükleme

Bir Oturumu yüklemek için çalıştırın:

```shell
:source Session.vim
```

Artık Vim, bıraktığınız gibi görünecek, bölünmüş pencereler de dahil! Alternatif olarak, terminalden de bir Oturum dosyasını yükleyebilirsiniz:

```shell
vim -S Session.vim
```

### Oturum Niteliklerini Yapılandırma

Oturumun kaydettiği nitelikleri yapılandırabilirsiniz. Şu anda neyin kaydedildiğini görmek için çalıştırın:

```shell
:set sessionoptions?
```

Benimki şöyle diyor:

```shell
blank,buffers,curdir,folds,help,tabpages,winsize,terminal
```

Eğer bir Oturum kaydederken `terminal`'ı kaydetmek istemiyorsanız, onu oturum seçeneklerinden çıkarın. Çalıştırın:

```shell
:set sessionoptions-=terminal
```

Eğer bir Oturum kaydederken bir `options` eklemek istiyorsanız, çalıştırın:

```shell
:set sessionoptions+=options
```

`sessionoptions`'ın saklayabileceği bazı nitelikler şunlardır:
- `blank` boş pencereleri saklar
- `buffers` tamponları saklar
- `folds` katmanları saklar
- `globals` küresel değişkenleri saklar (büyük harfle başlamalı ve en az bir küçük harf içermelidir)
- `options` seçenekleri ve eşlemeleri saklar
- `resize` pencere satır ve sütunlarını saklar
- `winpos` pencere konumunu saklar
- `winsize` pencere boyutlarını saklar
- `tabpages` sekmeleri saklar
- `unix` dosyaları Unix formatında saklar

Tam liste için `:h 'sessionoptions'`'a bakın.

Oturum, projenizin dış niteliklerini korumak için yararlı bir araçtır. Ancak, bazı iç nitelikler Oturum tarafından kaydedilmez, örneğin yerel işaretler, kayıtlar, geçmişler vb. Bunları kaydetmek için Viminfo'yu kullanmalısınız!

## Viminfo

Bir kelimeyi a kaydına kopyaladıktan ve Vim'den çıktığınızda, bir sonraki sefer Vim'i açtığınızda hala o metnin a kaydında saklandığını fark ederseniz. Bu aslında Viminfo'nun bir eseridir. Olmadan, Vim, Vim'i kapattıktan sonra kaydı hatırlamaz.

Eğer Vim 8 veya daha yüksek bir sürüm kullanıyorsanız, Viminfo varsayılan olarak etkindir, bu nedenle bu süre boyunca Viminfo'yu kullanıyor olabilirsiniz, farkında olmadan!

Şunu sorabilirsiniz: "Viminfo neyi kaydeder? Session'dan nasıl farklıdır?"

Viminfo'yu kullanmak için önce `+viminfo` özelliğinin mevcut olması gerekir (`:version`). Viminfo şunları saklar:
- Komut satırı geçmişi.
- Arama dizesi geçmişi.
- Giriş satırı geçmişi.
- Boş olmayan kayıtların içeriği.
- Birkaç dosya için işaretler.
- Dosya işaretleri, dosyalardaki konumları gösterir.
- Son arama / değiştirme deseni (n ve & için).
- Tampon listesi.
- Küresel değişkenler.

Genel olarak, Oturum "dış" nitelikleri saklarken, Viminfo "iç" nitelikleri saklar.

Oturumda her proje için bir Oturum dosyası bulundururken, genellikle her bilgisayar için bir Viminfo dosyası kullanırsınız. Viminfo, proje bağımsızdır.

Unix için varsayılan Viminfo konumu `$HOME/.viminfo` (`~/.viminfo`) dir. Farklı bir işletim sistemi kullanıyorsanız, Viminfo konumunuz farklı olabilir. Daha fazla bilgi için `:h viminfo-file-name`'a bakın. Her "iç" değişiklik yaptığınızda, bir metni bir kayda kopyalamak gibi, Vim otomatik olarak Viminfo dosyasını günceller.

*`nocompatible` seçeneğinin ayarlandığından emin olun (`set nocompatible`), aksi takdirde Viminfo'nuz çalışmaz.*

### Viminfo Yazma ve Okuma

Sadece bir Viminfo dosyası kullanacak olsanız da, birden fazla Viminfo dosyası oluşturabilirsiniz. Bir Viminfo dosyası yazmak için `:wviminfo` komutunu kullanın (`:wv` kısaltması için).

```shell
:wv ~/.viminfo_extra
```

Mevcut bir Viminfo dosyasını üzerine yazmak için `wv` komutuna bir ünlem ekleyin:

```shell
:wv! ~/.viminfo_extra
```

Varsayılan olarak Vim `~/.viminfo` dosyasından okuyacaktır. Farklı bir Viminfo dosyasından okumak için `:rviminfo` çalıştırın veya kısaca `:rv` kullanın:

```shell
:rv ~/.viminfo_extra
```

Terminalden farklı bir Viminfo dosyası ile Vim başlatmak için `i` bayrağını kullanın:

```shell
vim -i viminfo_extra
```

Farklı görevler için Vim kullanıyorsanız, yazma için optimize edilmiş bir Viminfo ve kodlama için başka bir Viminfo oluşturabilirsiniz.

```shell
vim -i viminfo_writing

vim -i viminfo_coding
```

### Viminfo Olmadan Vim Başlatma

Vim'i Viminfo olmadan başlatmak için terminalden şunu çalıştırabilirsiniz:

```shell
vim -i NONE
```

Bunu kalıcı hale getirmek için vimrc dosyanıza şunu ekleyebilirsiniz:

```shell
set viminfo="NONE"
```

### Viminfo Niteliklerini Yapılandırma

`viewoptions` ve `sessionoptions`'a benzer şekilde, `viminfo` seçeneği ile hangi niteliklerin kaydedileceğini belirtebilirsiniz. Çalıştırın:

```shell
:set viminfo?
```

Şunu alacaksınız:

```shell
!,'100,<50,s10,h
```

Bu karmaşık görünüyor. Hadi bunu parçalayalım:
- `!` büyük harfle başlayan ve küçük harf içermeyen küresel değişkenleri kaydeder. `g:` bir küresel değişkeni gösterir. Örneğin, bir noktada `let g:FOO = "foo"` atamasını yaptıysanız, Viminfo küresel değişken `FOO`'yu kaydedecektir. Ancak `let g:Foo = "foo"` yaparsanız, Viminfo bu küresel değişkeni kaydetmeyecektir çünkü küçük harf içeriyor. `!` olmadan, Vim bu küresel değişkenleri kaydetmeyecektir.
- `'100` işaretleri temsil eder. Bu durumda, Viminfo son 100 dosyanın yerel işaretlerini (a-z) kaydedecektir. Eğer Viminfo'ya çok fazla dosya kaydetmesini söylerseniz, Vim yavaşlayabilir. 1000 iyi bir sayı.
- `<50` her kaydın kaydedilen maksimum satır sayısını belirtir (bu durumda 50). Eğer 100 satırlık metni a kaydına kopyalarsanız (`"ay99j`) ve Vim'i kapatırsanız, bir sonraki sefer Vim'i açtığınızda ve a kaydından yapıştırdığınızda (`"ap`), Vim yalnızca maksimum 50 satır yapıştıracaktır. Maksimum satır sayısı vermezseniz, *tüm* satırlar kaydedilir. Eğer 0 verirseniz, hiçbir şey kaydedilmez.
- `s10` bir kaydın boyutu için bir sınır belirler (kb cinsinden). Bu durumda, 10kb'den büyük herhangi bir kayıt hariç tutulacaktır.
- `h` Vim başladığında vurgulamayı (hlsearch'ten) devre dışı bırakır.

Geçirebileceğiniz başka seçenekler de vardır. Daha fazla bilgi için `:h 'viminfo'`'ya bakın.
## Görünümleri, Oturumları ve Viminfo'yu Akıllıca Kullanma

Vim, Vim ortamınızın farklı seviyelerde anlık görüntülerini almak için Görünüm, Oturum ve Viminfo'ya sahiptir. Mikro projeler için Görünümleri kullanın. Daha büyük projeler için Oturumları kullanın. Görünüm, Oturum ve Viminfo'nun sunduğu tüm seçenekleri kontrol etmek için zaman ayırmalısınız.

Kendi düzenleme stilinize uygun kendi Görünüm, Oturum ve Viminfo'nuzu oluşturun. Bilgisayarınızın dışında Vim kullanmanız gerektiğinde, ayarlarınızı yükleyebilir ve hemen kendinizi evinizde hissedebilirsiniz!