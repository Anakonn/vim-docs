---
description: Vim'de tamponlar, pencereler ve sekmelerin nasıl çalıştığını öğrenin.
  Hızlı geçiş için `set hidden` seçeneğini ayarlamayı unutmayın.
title: Ch02. Buffers, Windows, and Tabs
---

Eğer daha önce modern bir metin editörü kullandıysanız, pencereler ve sekmeler ile tanışık olmalısınız. Vim, iki yerine üç görüntü soyutlaması kullanır: tamponlar, pencereler ve sekmeler. Bu bölümde, tamponların, pencerelerin ve sekmelerin ne olduğunu ve Vim'de nasıl çalıştıklarını açıklayacağım.

Başlamadan önce, vimrc dosyanızda `set hidden` seçeneğinin bulunduğundan emin olun. Bu olmadan, tamponlar arasında geçiş yaptığınızda ve mevcut tamponunuz kaydedilmemişse, Vim dosyayı kaydetmenizi isteyecektir (hızlı hareket etmek istiyorsanız bunu istemezsiniz). Henüz vimrc'yi ele almadım. Eğer bir vimrc'niz yoksa, bir tane oluşturun. Genellikle ana dizininizde yer alır ve adı `.vimrc`dir. Benimki `~/.vimrc` üzerinde. Vimrc'nizi nerede oluşturmanız gerektiğini görmek için `:h vimrc` komutuna bakın. İçine şunu ekleyin:

```shell
set hidden
```

Kaydedin, ardından kaynak dosyayı yükleyin (vimrc içinde `:source %` komutunu çalıştırın).

## Tamponlar

Bir *tampon* nedir?

Bir tampon, bazı metinleri yazıp düzenleyebileceğiniz bellek içindeki bir alandır. Vim'de bir dosya açtığınızda, veriler bir tampona bağlanır. Vim'de 3 dosya açtığınızda, 3 tamponunuz olur.

İki boş dosya, `file1.js` ve `file2.js` bulundurun (mümkünse, bunları Vim ile oluşturun). Terminalde bunu çalıştırın:

```bash
vim file1.js
```

Gördüğünüz şey `file1.js` *tamponu*. Her yeni dosya açtığınızda, Vim yeni bir tampon oluşturur.

Vim'den çıkın. Bu sefer, iki yeni dosya açın:

```bash
vim file1.js file2.js
```

Vim şu anda `file1.js` tamponunu gösteriyor, ancak aslında iki tampon oluşturuyor: `file1.js` tamponu ve `file2.js` tamponu. Tüm tamponları görmek için `:buffers` komutunu çalıştırın (alternatif olarak `:ls` veya `:files` komutlarını da kullanabilirsiniz). Hem `file1.js` hem de `file2.js`'nin listelendiğini görmelisiniz. `vim file1 file2 file3 ... filen` komutunu çalıştırmak n kadar tampon oluşturur. Her yeni dosya açtığınızda, Vim o dosya için yeni bir tampon oluşturur.

Tamponlar arasında geçiş yapmanın birkaç yolu vardır:
- Bir sonraki tampona gitmek için `:bnext` (`:bprevious` ile bir önceki tampona gidebilirsiniz).
- `:buffer` + dosya adı. Vim, dosya adını `<Tab>` ile otomatik tamamlayabilir.
- `:buffer` + `n`, burada `n` tampon numarasıdır. Örneğin, `:buffer 2` yazmak sizi #2 tamponuna götürecektir.
- Atlama listesinde daha eski bir konuma `Ctrl-O` ile ve daha yeni bir konuma `Ctrl-I` ile atlayın. Bunlar tamponlara özgü yöntemler değildir, ancak farklı tamponlar arasında atlamak için kullanılabilirler. Atlama işlemlerini daha ayrıntılı olarak Bölüm 5'te açıklayacağım.
- Önceki düzenlenen tampona `Ctrl-^` ile gidin.

Vim bir tampon oluşturduğunda, bu tampon sizin tamponlar listenizde kalır. Onu kaldırmak için `:bdelete` yazabilirsiniz. Ayrıca bir tampon numarasını parametre olarak kabul edebilir (`:bdelete 3` ile #3 tamponunu silmek için) veya bir dosya adı (`:bdelete` yazıp `<Tab>` ile otomatik tamamlayarak).

Tamponlar hakkında öğrenirken benim için en zor şey, nasıl çalıştıklarını görselleştirmekti çünkü aklım, yaygın bir metin editörü kullanırken pencerelere alışkındı. İyi bir benzetme, bir deste oyun kartıdır. Eğer 2 tamponum varsa, 2 kartlık bir deste var demektir. Üstteki kartı görebiliyorum, ancak altında başka kartların olduğunu biliyorum. Eğer `file1.js` tamponunun görüntülendiğini görüyorsam, o zaman `file1.js` kartı desteğin üstünde. Diğer kart olan `file2.js` burada görünmüyor, ama orada. Eğer tamponları `file2.js`'ye değiştirirsem, o zaman `file2.js` kartı artık desteğin üstünde ve `file1.js` kartı onun altında.

Eğer daha önce Vim kullanmadıysanız, bu yeni bir kavramdır. Anlamak için zaman ayırın.

## Vim'den Çıkma

Bu arada, birden fazla tampon açtıysanız, hepsini quit-all ile kapatabilirsiniz:

```shell
:qall
```

Değişikliklerinizi kaydetmeden kapatmak istiyorsanız, sonuna `!` ekleyin:

```shell
:qall!
```

Tümünü kaydedip çıkmak için:

```shell
:wqall
```

## Pencereler

Bir pencere, bir tampon üzerindeki görüntü alanıdır. Eğer yaygın bir editörden geliyorsanız, bu kavram size tanıdık gelebilir. Çoğu metin editörü birden fazla pencere gösterme yeteneğine sahiptir. Vim'de de birden fazla pencere açabilirsiniz.

Terminalden tekrar `file1.js` dosyasını açalım:

```bash
vim file1.js
```

Daha önce `file1.js` tamponunu gördüğünüzü yazdım. Bu doğruydu, ancak bu ifade eksikti. Siz, **bir pencere** aracılığıyla `file1.js` tamponunu görüyorsunuz. Bir pencere, bir tamponu görüntülemenin yoludur.

Henüz Vim'den çıkmayın. Şunu çalıştırın:

```shell
:split file2.js
```

Artık **iki pencere** aracılığıyla iki tamponu görüyorsunuz. Üstteki pencere `file2.js` tamponunu gösteriyor. Alttaki pencere `file1.js` tamponunu gösteriyor.

Pencereler arasında gezinmek istiyorsanız, bu kısayolları kullanın:

```shell
Ctrl-W H    Sol penceredeki imleci hareket ettirir
Ctrl-W J    Alttaki pencereye imleci hareket ettirir
Ctrl-W K    Üstteki pencereye imleci hareket ettirir
Ctrl-W L    Sağ penceredeki imleci hareket ettirir
```

Şimdi şunu çalıştırın:

```shell
:vsplit file3.js
```

Artık üç tamponu gösteren üç pencere görüyorsunuz. Bir pencere `file3.js` tamponunu, diğer pencere `file2.js` tamponunu ve diğer pencere `file1.js` tamponunu gösteriyor.

Aynı tamponu gösteren birden fazla pencere açabilirsiniz. Sol üst penceredesiniz, şunu yazın:

```shell
:buffer file2.js
```

Artık iki pencere de `file2.js` tamponunu gösteriyor. Eğer `file2.js` penceresinde yazmaya başlarsanız, `file2.js` tamponunu gösteren her iki pencerenin de gerçek zamanlı olarak güncellendiğini göreceksiniz.

Mevcut pencereyi kapatmak için `Ctrl-W C` çalıştırabilir veya `:quit` yazabilirsiniz. Bir pencereyi kapattığınızda, tampon hala orada kalır (bunu doğrulamak için `:buffers` çalıştırın).

İşte bazı yararlı normal mod pencere komutları:

```shell
Ctrl-W V    Yeni bir dikey bölme açar
Ctrl-W S    Yeni bir yatay bölme açar
Ctrl-W C    Bir pencereyi kapatır
Ctrl-W O    Mevcut pencereyi ekrandaki tek pencere yapar ve diğer pencereleri kapatır
```

Ve işte bazı yararlı pencere komut satırı komutları:

```shell
:vsplit filename    Pencereyi dikey olarak böler
:split filename     Pencereyi yatay olarak böler
:new filename       Yeni pencere oluşturur
```

Anlamak için zaman ayırın. Daha fazla bilgi için `:h window`'a bakın.

## Sekmeler

Bir sekme, pencerelerin bir koleksiyonudur. Bunu pencereler için bir düzen olarak düşünün. Çoğu modern metin editöründe (ve modern internet tarayıcılarında), bir sekme açık bir dosya / sayfa anlamına gelir ve kapattığınızda, o dosya / sayfa kaybolur. Vim'de bir sekme açılmış bir dosyayı temsil etmez. Vim'de bir sekmeyi kapattığınızda, bir dosyayı kapatmıyorsunuz. Sadece düzeni kapatıyorsunuz. O düzen içinde açılmış dosyalar hala kapatılmamış, hala tamponlarında açıktır.

Vim sekmelerini eylemde görelim. `file1.js` dosyasını açın:

```bash
vim file1.js
```

`file2.js` dosyasını yeni bir sekmede açmak için:

```shell
:tabnew file2.js
```

Ayrıca, açmak istediğiniz dosyayı *yeni bir sekmede* otomatik tamamlamak için `<Tab>` tuşuna basabilirsiniz (kelime oyunu yok).

Aşağıda yararlı sekme navigasyonlarının bir listesi bulunmaktadır:

```shell
:tabnew file.txt    file.txt dosyasını yeni bir sekmede açar
:tabclose           Mevcut sekmeyi kapatır
:tabnext            Sonraki sekmeye gider
:tabprevious        Önceki sekmeye gider
:tablast            Son sekmeye gider
:tabfirst           İlk sekmeye gider
```

Ayrıca `gt` komutunu çalıştırarak bir sonraki sekme sayfasına gidebilirsiniz (önceki sekmeye `gT` ile gidebilirsiniz). `gt` komutuna bir sayı argümanı geçirebilirsiniz; burada sayı sekme numarasıdır. Üçüncü sekmeye gitmek için `3gt` yapın.

Birden fazla sekmenin avantajlarından biri, farklı sekmelerde farklı pencere düzenlemeleri yapabilmenizdir. Belki ilk sekmenizin 3 dikey penceresi olmasını ve ikinci sekmenizin karışık yatay ve dikey pencere düzenine sahip olmasını istersiniz. Sekme, bu iş için mükemmel bir araçtır!

Vim'i birden fazla sekme ile başlatmak için terminalden bunu yapabilirsiniz:

```bash
vim -p file1.js file2.js file3.js
```

## 3D Hareket

Pencereler arasında hareket etmek, Kartezyen koordinat sisteminde X-Y ekseni boyunca iki boyutlu olarak seyahat etmek gibidir. `Ctrl-W H/J/K/L` ile üstteki, sağdaki, alttaki ve soldaki pencereye geçebilirsiniz.

Tamponlar arasında hareket etmek, Kartezyen koordinat sisteminde Z ekseni boyunca seyahat etmek gibidir. Tampon dosyalarınızın Z ekseni boyunca sıralandığını hayal edin. Z ekseninde bir tamponu bir seferde geçebilirsiniz `:bnext` ve `:bprevious` komutları ile. Z eksenindeki herhangi bir koordinata `:buffer filename/buffernumber` ile atlayabilirsiniz.

Pencere ve tampon hareketlerini birleştirerek *üç boyutlu alanda* hareket edebilirsiniz. Pencere hareketleri ile yukarı, sağa, aşağı veya sola (X-Y navigasyonları) hareket edebilirsiniz. Her pencere tamponlar içerdiğinden, tampon hareketleri ile ileri ve geri (Z navigasyonları) hareket edebilirsiniz.

## Tamponları, Pencereleri ve Sekmeleri Akıllıca Kullanma

Tamponların, pencerelerin ve sekmelerin ne olduğunu ve Vim'de nasıl çalıştıklarını öğrendiniz. Artık onları daha iyi anladığınıza göre, kendi iş akışınızda kullanabilirsiniz.

Herkesin farklı bir iş akışı vardır, işte benimki örneğin:
- Öncelikle, mevcut görev için gerekli tüm dosyaları depolamak için tamponları kullanıyorum. Vim, yavaşlamaya başlamadan önce birçok açık tamponu yönetebilir. Ayrıca birçok tamponun açık olması ekranımı kalabalıklaştırmaz. Her zaman yalnızca bir tampon görüyorum (bir pencere olduğunda varsayıyorum), bu da bana bir ekrana odaklanma imkanı tanıyor. Bir yere gitmem gerektiğinde, istediğim zaman açık olan herhangi bir tampona hızlıca geçebilirim.
- Birden fazla tamponu aynı anda görüntülemek için birden fazla pencere kullanıyorum, genellikle dosyaları karşılaştırırken, belgeleri okurken veya bir kod akışını takip ederken. Açık olan pencere sayısını üçten fazla tutmamaya çalışıyorum çünkü ekranım kalabalıklaşacak (küçük bir dizüstü bilgisayar kullanıyorum). İşim bittiğinde, fazla olan pencereleri kapatıyorum. Daha az pencere, daha az dikkat dağıtma anlamına gelir.
- Sekmeler yerine, [tmux](https://github.com/tmux/tmux/wiki) pencerelerini kullanıyorum. Genellikle birden fazla tmux penceresini aynı anda kullanıyorum. Örneğin, bir tmux penceresi istemci tarafı kodları için ve diğeri arka uç kodları için.

İş akışım, düzenleme tarzınıza bağlı olarak sizininkinden farklı görünebilir ve bu da sorun değil. Kendi akışınızı keşfetmek için denemeler yapın, kodlama tarzınıza uygun hale getirin.