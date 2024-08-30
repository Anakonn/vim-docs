---
description: Bu belge, Vim'de komut satırı modunu kullanma, arama, değiştirme ve dış
  komutlar gibi çeşitli ipuçları ve püf noktalarını öğretmektedir.
title: Ch15. Command-line Mode
---

Son üç bölümde, arama komutlarını (`/`, `?`), yer değiştirme komutunu (`:s`), global komutu (`:g`) ve dış komutu (`!`) nasıl kullanacağınızı öğrendiniz. Bunlar, komut satırı modu komutlarına örneklerdir.

Bu bölümde, komut satırı modu için çeşitli ipuçları ve püf noktaları öğreneceksiniz.

## Komut Satırı Moduna Giriş ve Çıkış

Komut satırı modu, normal mod, ekleme modu ve görsel mod gibi kendine ait bir moddur. Bu modda olduğunuzda, imleç ekranın altına gider ve farklı komutlar yazabilirsiniz.

Komut satırı moduna girmek için kullanabileceğiniz 4 farklı komut vardır:
- Arama desenleri (`/`, `?`)
- Komut satırı komutları (`:`)
- Dış komutlar (`!`)

Komut satırı moduna normal moddan veya görsel moddan girebilirsiniz.

Komut satırı modundan çıkmak için `<Esc>`, `Ctrl-C` veya `Ctrl-[` kullanabilirsiniz.

*Diğer literatürler "Komut satırı komutu"nu "Ex komutu" ve "Dış komut"u "filtre komutu" veya "bang operatörü" olarak adlandırabilir.*

## Önceki Komutu Tekrar Etme

Önceki komut satırı komutunu veya dış komutu `@:` ile tekrarlayabilirsiniz.

Eğer `:s/foo/bar/g` komutunu çalıştırdıysanız, `@:` komutunu çalıştırmak o yer değiştirmeyi tekrarlar. Eğer `:.!tr '[a-z]' '[A-Z]'` komutunu çalıştırdıysanız, `@:` komutunu çalıştırmak son dış komut çeviri filtresini tekrarlar.

## Komut Satırı Modu Kısayolları

Komut satırı modundayken, `Sol` veya `Sağ` ok tuşlarıyla bir karakter sola veya sağa hareket edebilirsiniz.

Kelime bazında hareket etmeniz gerekiyorsa, `Shift-Sol` veya `Shift-Sağ` kullanın (bazı işletim sistemlerinde `Shift` yerine `Ctrl` kullanmanız gerekebilir).

Satırın başına gitmek için `Ctrl-B` kullanın. Satırın sonuna gitmek için `Ctrl-E` kullanın.

Ekleme moduna benzer şekilde, komut satırı modunda karakterleri silmek için üç yol vardır:

```shell
Ctrl-H    Bir karakter sil
Ctrl-W    Bir kelime sil
Ctrl-U    Tüm satırı sil
```
Son olarak, komutu normal bir metin dosyası gibi düzenlemek istiyorsanız `Ctrl-F` kullanın.

Bu, önceki komutlar arasında arama yapmanıza, düzenlemenize ve "komut satırı düzenleme normal modu"nda `<Enter>` tuşuna basarak yeniden çalıştırmanıza da olanak tanır.

## Kayıt ve Otomatik Tamamlama

Komut satırı modundayken, ekleme modundaki gibi `Ctrl-R` ile Vim kaydından metin ekleyebilirsiniz. Eğer "foo" dizesini a kaydında kaydettiyseniz, `Ctrl-R a` komutunu çalıştırarak ekleyebilirsiniz. Ekleme modunda kayıttan alabileceğiniz her şeyi, komut satırı modunda da yapabilirsiniz.

Ayrıca, imlecin altındaki kelimeyi `Ctrl-R Ctrl-W` ile alabilirsiniz (`Ctrl-R Ctrl-A` imlecin altındaki WORD için). İmlecin altındaki satırı almak için `Ctrl-R Ctrl-L` kullanın. İmlecin altındaki dosya adını almak için `Ctrl-R Ctrl-F` kullanın.

Mevcut komutları da otomatik tamamlayabilirsiniz. Komut satırı modundayken `echo` komutunu otomatik tamamlamak için "ec" yazın, ardından `<Tab>` tuşuna basın. Sol altta "ec" ile başlayan Vim komutlarını görmelisiniz (örnek: `echo echoerr echohl echomsg econ`). Sonraki seçeneğe gitmek için `<Tab>` veya `Ctrl-N` tuşuna basın. Önceki seçeneğe gitmek için `<Shift-Tab>` veya `Ctrl-P` tuşuna basın.

Bazı komut satırı komutları dosya adlarını argüman olarak kabul eder. Bir örnek `edit` komutudur. Burada da otomatik tamamlama yapabilirsiniz. Komutu yazdıktan sonra `:e ` (boşluğu unutmayın) yazın, ardından `<Tab>` tuşuna basın. Vim, seçebileceğiniz tüm ilgili dosya adlarını listeleyecektir, böylece sıfırdan yazmak zorunda kalmazsınız.

## Geçmiş Penceresi ve Komut Satırı Penceresi

Komut satırı komutlarının ve arama terimlerinin geçmişini görüntüleyebilirsiniz (bu, `+cmdline_hist` özelliğini gerektirir).

Komut satırı geçmişini açmak için `:his :` komutunu çalıştırın. Aşağıdakine benzer bir şey görmelisiniz:

```shell
## Cmd history
2  e file1.txt
3  g/foo/d
4  s/foo/bar/g
```

Vim, çalıştırdığınız tüm `:` komutlarının geçmişini listeler. Varsayılan olarak, Vim son 50 komutu saklar. Vim'in hatırladığı giriş sayısını 100'e değiştirmek için `set history=100` komutunu çalıştırın.

Komut satırı geçmişinin daha kullanışlı bir kullanımı, `q:` komutuyla komut satırı penceresidir. Bu, arama yapılabilir, düzenlenebilir bir geçmiş penceresi açar. Diyelim ki `q:` tuşuna bastığınızda geçmişte bu ifadeler var:

```shell
51  s/verylongsubstitutionpattern/pancake/g
52  his :
53  wq
```

Eğer mevcut göreviniz `s/verylongsubstitutionpattern/donut/g` yapmaksa, komutu sıfırdan yazmak yerine `s/verylongsubstitutionpattern/pancake/g` ifadesini yeniden kullanmayı düşünmez misiniz? Sonuçta, tek farklılık kelime yer değiştirmesi, "donut" ve "pancake". Diğer her şey aynı.

`q:` komutunu çalıştırdıktan sonra, geçmişte `s/verylongsubstitutionpattern/pancake/g` ifadesini bulun (bu ortamda Vim navigasyonunu kullanabilirsiniz) ve doğrudan düzenleyin! Geçmiş penceresinde "pancake" kelimesini "donut" olarak değiştirin, ardından `<Enter>` tuşuna basın. Boom! Vim sizin için `s/verylongsubstitutionpattern/donut/g` komutunu çalıştırır. Süper pratik!

Benzer şekilde, arama geçmişini görüntülemek için `:his /` veya `:his ?` komutunu çalıştırın. Geçmişi arayıp düzenleyebileceğiniz arama geçmişi penceresini açmak için `q/` veya `q?` komutunu çalıştırın.

Bu pencereden çıkmak için `Ctrl-C`, `Ctrl-W C` veya `:quit` yazın.

## Daha Fazla Komut Satırı Komutu

Vim'in yüzlerce yerleşik komutu vardır. Vim'in sahip olduğu tüm komutları görmek için `:h ex-cmd-index` veya `:h :index` komutuna bakın.

## Komut Satırı Modunu Akıllıca Öğrenin

Diğer üç modla karşılaştırıldığında, komut satırı modu metin düzenlemenin İsviçre çakısı gibidir. Metin düzenleyebilir, dosyaları değiştirebilir ve komutları çalıştırabilirsiniz, sadece birkaçını saymak gerekirse. Bu bölüm, komut satırı modunun çeşitli yönlerini bir araya getirir. Artık normal, ekleme, görsel ve komut satırı modunu nasıl kullanacağınızı bildiğinize göre, Vim ile metin düzenlemeyi daha önce hiç olmadığı kadar hızlı yapabilirsiniz.

Vim modlarından uzaklaşıp, Vim etiketleri ile daha hızlı bir navigasyon öğrenme zamanı.