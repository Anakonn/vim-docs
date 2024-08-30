---
description: Vim'in geri alma sistemi, basit hatalardan farklı metin durumlarına erişim
  sağlayarak, yazdığınız tüm metinler üzerinde kontrol sunar.
title: Ch10. Undo
---

Hepimiz her türlü yazım hatası yaparız. Bu yüzden geri alma, modern yazılımlardaki temel bir özelliktir. Vim'in geri alma sistemi yalnızca basit hataları geri alıp yeniden yapabilmekle kalmaz, aynı zamanda farklı metin durumlarına erişim sağlayarak, daha önce yazdığınız tüm metinler üzerinde kontrol sağlar. Bu bölümde geri almayı, yeniden yapmayı, geri alma dalında gezinmeyi, geri almayı kalıcı hale getirmeyi ve zamanda yolculuk etmeyi öğreneceksiniz.

## Geri Alma, Yeniden Yapma ve GERI AL

Temel bir geri alma işlemi yapmak için `u` tuşunu kullanabilir veya `:undo` komutunu çalıştırabilirsiniz.

Eğer bu metne sahipseniz (aşağıdaki "bir" satırının boş olduğunu unutmayın):

```shell
bir

```

Sonra başka bir metin ekleyin:

```shell
bir
iki
```

`u` tuşuna basarsanız, Vim "iki" metnini geri alır.

Vim geri almanın ne kadarını yapacağını nasıl bilir? Vim, bir seferde tek bir "değişiklik" geri alır; bu, bir nokta komutunun değişikliğiyle benzerlik gösterir (nokta komutunun aksine, komut satırı komutları da bir değişiklik olarak sayılır).

Son değişikliği yeniden yapmak için `Ctrl-R` tuşuna basın veya `:redo` komutunu çalıştırın. Yukarıdaki metni "iki"yi kaldırmak için geri aldığınızda, `Ctrl-R` çalıştırmak kaldırılan metni geri getirecektir.

Vim ayrıca `U` ile çalıştırabileceğiniz GERI AL özelliğine sahiptir. Bu, en son değişikliklerin hepsini geri alır.

`U`, `u`'dan nasıl farklıdır? Öncelikle, `U` en son değiştirilen satırdaki *tüm* değişiklikleri kaldırırken, `u` yalnızca bir değişikliği bir seferde kaldırır. İkincisi, `u` yapmak bir değişiklik olarak sayılmazken, `U` yapmak bir değişiklik olarak sayılır.

Bu örneğe geri dönelim:

```shell
bir
iki
```

İkinci satırı "üç" olarak değiştirin:

```shell
bir
üç
```

İkinci satırı tekrar değiştirin ve "dört" ile değiştirin:

```shell
bir
dört
```

`u` tuşuna basarsanız, "üç"ü göreceksiniz. `u`'ya tekrar basarsanız, "iki"yi göreceksiniz. Eğer "dört" metniniz varken `u` yerine `U` tuşuna basmış olsaydınız, şunu görecektiniz:

```shell
bir

```

`U`, tüm ara değişiklikleri atlayarak başladığınız orijinal duruma (boş bir satır) geri döner. Ayrıca, GERI AL işlemi aslında Vim'de yeni bir değişiklik oluşturduğundan, GERI AL'ınızı geri alabilirsiniz. `U` ardından `U` yapmak kendisini geri alır. `U`, sonra `U`, sonra `U` tuşlarına basabilirsiniz. Aynı iki metin durumu ileri geri geçiş yaparak göreceksiniz.

Kişisel olarak `U` kullanmıyorum çünkü orijinal durumu hatırlamak zor (nadiren ihtiyacım oluyor).

Vim, `undolevels` seçenek değişkeninde geri alma işlemini ne kadar yapabileceğinize dair bir maksimum sayı belirler. Bunu `:echo &undolevels` ile kontrol edebilirsiniz. Benim ayarım 1000 olarak belirlenmiş. Sizin ayarınızı 1000 yapmak için `:set undolevels=1000` komutunu çalıştırın. Dilediğiniz herhangi bir sayıya ayarlayabilirsiniz.

## Blokları Kırmak

Daha önce `u`'nun nokta komutunun değişikliğiyle benzer şekilde tek bir "değişikliği" geri aldığını belirtmiştim: ekleme moduna girdiğiniz andan çıkana kadar eklenen metinler bir değişiklik olarak sayılır.

Eğer `ione iki üç<Esc>` yaparsanız ve ardından `u` tuşuna basarsanız, Vim "bir iki üç" metninin tamamını kaldırır çünkü tümü bir değişiklik olarak sayılır. Kısa metinler yazdıysanız bu büyük bir sorun değildir, ancak bir ekleme modu oturumu içinde birkaç paragraf yazdıysanız ve daha sonra bir hata yaptığınızı fark ettiyseniz? Eğer `u` tuşuna basarsanız, yazdığınız her şey kaldırılacaktır. Metninizin yalnızca bir bölümünü kaldırmak için `u` tuşuna basmanın faydalı olmaz mıydı?

Neyse ki, geri alma bloklarını kırabilirsiniz. Ekleme modunda yazarken, `Ctrl-G u` tuşuna basmak bir geri alma kesme noktası oluşturur. Örneğin, `ione <Ctrl-G u>iki <Ctrl-G u>üç<Esc>` yaparsanız, ardından `u` tuşuna basarsanız yalnızca "üç" metnini kaybedersiniz (bir kez daha `u` tuşuna basarak "iki"yi kaldırabilirsiniz). Uzun bir metin yazarken, `Ctrl-G u`'yu stratejik olarak kullanın. Her cümlenin sonu, iki paragraf arasında veya her kod satırından sonra geri alma kesme noktaları eklemek için ideal yerlerdir; böylece bir hata yaptığınızda geri almayı kolaylaştırır.

Ayrıca, ekleme modunda `Ctrl-W` (imlecin önündeki kelimeyi sil) ve `Ctrl-U` (imlecin önündeki tüm metni sil) ile parçaları silerken bir geri alma kesme noktası oluşturmak da faydalıdır. Bir arkadaşım aşağıdaki haritaları kullanmayı önerdi:

```shell
inoremap <c-u> <c-g>u<c-u>
inoremap <c-w> <c-g>u<c-w>
```

Bunlarla, silinen metinleri kolayca geri alabilirsiniz.

## Geri Alma Ağacı

Vim, yazılan her değişikliği bir geri alma ağacında saklar. Yeni boş bir dosya açın. Sonra yeni bir metin ekleyin:

```shell
bir

```

Yeni bir metin ekleyin:

```shell
bir
iki
```

Bir kez geri alın:

```shell
bir

```

Farklı bir metin ekleyin:

```shell
bir
üç
```

Tekrar geri alın:

```shell
bir

```

Ve başka bir farklı metin ekleyin:

```shell
bir
dört
```

Artık geri alırsanız, yeni eklediğiniz "dört" metnini kaybedersiniz:

```shell
bir

```

Bir kez daha geri alırsanız:

```shell

```

"bir" metnini kaybedersiniz. Çoğu metin editöründe "iki" ve "üç" metinlerini geri almak imkansız olurdu, ama Vim ile değil! `g+` tuşuna basın ve "bir" metninizi geri alırsınız:

```shell
bir

```

`g+` tuşuna tekrar basın ve eski bir dostunuzu göreceksiniz:

```shell
bir
iki
```

Devam edelim. `g+` tuşuna tekrar basın:

```shell
bir
üç
```

`g+` tuşuna bir kez daha basın:

```shell
bir
dört
```

Vim'de her `u` tuşuna bastığınızda ve ardından farklı bir değişiklik yaptığınızda, Vim önceki durumun metnini "geri alma dalı" oluşturarak saklar. Bu örnekte, "iki" yazdıktan sonra `u` tuşuna bastığınızda, "üç" metnini içeren durumu saklayan bir yaprak dalı oluşturmuş olursunuz. O anda geri alma ağacı en az iki yaprak düğümü içeriyordu: "üç" metnini içeren ana düğüm (en son) ve "iki" metnini içeren geri alma dalı düğümü. Eğer başka bir geri alma işlemi yapıp "dört" metnini yazsaydınız, üç düğümünüz olurdu: "dört" metnini içeren bir ana düğüm ve "üç" ve "iki" metinlerini içeren iki düğüm.

Her geri alma ağacı düğümünde gezinmek için `g+` tuşunu kullanarak daha yeni bir duruma gidebilir ve `g-` tuşunu kullanarak daha eski bir duruma gidebilirsiniz. `u`, `Ctrl-R`, `g+` ve `g-` arasındaki fark, `u` ve `Ctrl-R`'nin yalnızca geri alma ağacındaki *ana* düğümleri geçerken, `g+` ve `g-`'nin geri alma ağacındaki *tüm* düğümleri geçmesidir.

Geri alma ağacını görselleştirmek kolay değildir. Vim'in geri alma ağacını görselleştirmeye yardımcı olmak için [vim-mundo](https://github.com/simnalamburt/vim-mundo) eklentisini çok faydalı buluyorum. Onunla oynamak için biraz zaman ayırın.

## Kalıcı Geri Alma

Eğer Vim'i başlatır, bir dosya açar ve hemen `u` tuşuna basarsanız, Vim muhtemelen "*Zaten en eski değişiklikte*" uyarısını gösterir. Geri alınacak hiçbir şey yoktur çünkü hiçbir değişiklik yapmamışsınızdır.

Son düzenleme oturumundan geri alma geçmişini döndürmek için, Vim geri alma geçmişinizi bir geri alma dosyası ile koruyabilir: `:wundo`.

Bir `mynumbers.txt` dosyası oluşturun. Yazın:

```shell
bir
```

Sonra başka bir satır yazın (her satırın bir değişiklik olarak sayıldığından emin olun):

```shell
bir
iki
```

Başka bir satır yazın:

```shell
bir
iki
üç
```

Artık geri alma dosyanızı `:wundo {my-undo-file}` ile oluşturun. Mevcut bir geri alma dosyasını üzerine yazmanız gerekiyorsa, `wundo`'dan sonra `!` ekleyebilirsiniz.

```shell
:wundo! mynumbers.undo
```

Sonra Vim'den çıkın.

Artık dizininizde `mynumbers.txt` ve `mynumbers.undo` dosyalarınız olmalıdır. `mynumbers.txt` dosyasını tekrar açın ve `u` tuşuna basmayı deneyin. Yapamazsınız. Dosyayı açtığınızdan beri hiçbir değişiklik yapmadınız. Şimdi geri alma geçmişinizi geri alma dosyasını okuyarak yükleyin: `:rundo`:

```shell
:rundo mynumbers.undo
```

Artık `u` tuşuna basarsanız, Vim "üç"ü kaldırır. `u` tuşuna tekrar basarak "iki"yi kaldırın. Sanki Vim'i hiç kapatmamışsınız gibi!

Otomatik bir geri alma kalıcılığı istiyorsanız, bunu yapmanın bir yolu vimrc'ye şunları eklemektir:

```shell
set undodir=~/.vim/undo_dir
set undofile
```

Yukarıdaki ayar, tüm geri alma dosyalarını tek bir merkezi dizinde, `~/.vim` dizininde tutacaktır. `undo_dir` adı keyfi bir isimdir. `set undofile`, Vim'e `undofile` özelliğini açmasını söyler çünkü varsayılan olarak kapalıdır. Artık her kaydettiğinizde, Vim otomatik olarak `undo_dir` dizininde ilgili dosyayı oluşturur ve günceller (bunu çalıştırmadan önce `~/.vim` dizini içinde gerçek `undo_dir` dizinini oluşturduğunuzdan emin olun).

## Zaman Yolculuğu

Zaman yolculuğunun var olmadığını kim söylüyor? Vim, geçmişteki bir metin durumuna `:earlier` komut satırı komutuyla gidebilir.

Eğer bu metne sahipseniz:

```shell
bir

```
Sonra daha sonra ekliyorsunuz:

```shell
bir
iki
```

Eğer "iki"yi on saniyeden daha kısa bir süre önce yazdıysanız, on saniye önce "iki"nin olmadığı duruma geri dönebilirsiniz:

```shell
:earlier 10s
```

Son değişikliğin ne zaman yapıldığını görmek için `:undolist` komutunu kullanabilirsiniz. `:earlier` ayrıca farklı argümanlar da kabul eder:

```shell
:earlier 10s    10 saniye önceki duruma git
:earlier 10m    10 dakika önceki duruma git
:earlier 10h    10 saat önceki duruma git
:earlier 10d    10 gün önceki duruma git
```

Ayrıca, Vim'e daha eski bir duruma `count` kadar gitmesini söylemek için düzenli bir `count` argümanı da kabul eder. Örneğin, `:earlier 2` yaparsanız, Vim iki değişiklik önceki daha eski metin durumuna geri döner. Bu, `g-` tuşuna iki kez basmakla aynıdır. Ayrıca, daha eski bir metin durumuna 10 kayıttan önce gitmesini de söyleyebilirsiniz: `:earlier 10f`.

Aynı argüman seti `:earlier` karşılığı olan `:later` için de geçerlidir:

```shell
:later 10s    10 saniye sonra duruma git
:later 10m    10 dakika sonra duruma git
:later 10h    10 saat sonra duruma git
:later 10d    10 gün sonra duruma git
:later 10     daha yeni duruma 10 kez git
:later 10f    10 kayıttan sonra duruma git
```

## Akıllı Bir Şekilde Geri Almaya Öğrenin

`u` ve `Ctrl-R`, hataları düzeltmek için iki vazgeçilmez Vim komutudur. Öncelikle bunları öğrenin. Sonra, zaman argümanlarını kullanarak `:earlier` ve `:later` komutlarını nasıl kullanacağınızı öğrenin. Ardından, geri alma ağacını anlamak için zaman ayırın. [vim-mundo](https://github.com/simnalamburt/vim-mundo) eklentisi bana çok yardımcı oldu. Bu bölümdeki metinlerle birlikte yazın ve her değişiklik yaptığınızda geri alma ağacını kontrol edin. Bunu kavradığınızda, geri alma sistemine bir daha asla aynı şekilde bakmayacaksınız.

Bu bölümden önce, bir proje alanında herhangi bir metni bulmayı öğrendiniz, şimdi geri alma ile herhangi bir metni zaman boyutunda bulabilirsiniz. Artık herhangi bir metni yazıldığı yer ve zaman ile arayabilirsiniz. Vim-omnipresence'ye ulaştınız.