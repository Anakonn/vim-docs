---
description: Bu kılavuz, Vim kullanıcıları için temel özellikleri vurgulayarak hızlı
  ve etkili bir öğrenme deneyimi sunmayı amaçlamaktadır.
title: Ch00. Read This First
---

## Bu Kılavuz Neden Yazıldı

Vim öğrenmek için birçok yer var: `vimtutor` başlamak için harika bir yer ve `:help` kılavuzu, ihtiyaç duyacağınız tüm referansları içeriyor.

Ancak, ortalama bir kullanıcının `vimtutor`dan daha fazlasına ve `:help` kılavuzundan daha azına ihtiyacı var. Bu kılavuz, en az zamanda Vim'in en kullanışlı kısımlarını öğrenmek için yalnızca anahtar özellikleri vurgulayarak bu boşluğu doldurmaya çalışıyor.

Vim'in tüm özelliklerinin %100'üne ihtiyacınız olmayabilir. Güçlü bir Vimmer olmak için muhtemelen sadece bunların %20'sini bilmeniz yeterlidir. Bu kılavuz, en yararlı bulacağınız Vim özelliklerini gösterecek.

Bu, görüş bildiren bir kılavuzdur. Vim kullanırken sıkça kullandığım teknikleri kapsar. Bölümler, bir başlangıç seviyesinin Vim öğrenmesi için en mantıklı sıraya göre dizilmiştir.

Bu kılavuz, örnekler açısından zengindir. Yeni bir beceri öğrenirken, örnekler vazgeçilmezdir; çok sayıda örnek, bu kavramları daha etkili bir şekilde pekiştirecektir.

Bazılarınız neden Vimscript öğrenmeniz gerektiğini merak edebilir? Vim'i kullandığım ilk yıl, sadece Vim'i nasıl kullanacağımı bilmekle yetindim. Zaman geçti ve özel düzenleme ihtiyaçlarım için özel komutlar yazmak için Vimscript'e daha fazla ihtiyaç duymaya başladım. Vim'i ustalaşırken, er ya da geç Vimscript öğrenmeniz gerekecek. O halde neden daha erken değil? Vimscript küçük bir dildir. Bu kılavuzun sadece dört bölümünde temel bilgilerini öğrenebilirsiniz.

Vim'i bilmeden de oldukça ilerleyebilirsiniz, ancak bunu bilmek sizi daha da ileriye taşıyacaktır.

Bu kılavuz hem yeni başlayanlar hem de ileri düzey Vimmerlar için yazılmıştır. Geniş ve basit kavramlarla başlar ve belirli ve ileri düzey kavramlarla sona erer. Zaten ileri düzey bir kullanıcıysanız, yine de bu kılavuzu baştan sona okumanızı öneririm, çünkü yeni bir şey öğreneceksiniz!

## Farklı Bir Metin Düzenleyicisinden Vim'e Geçiş Nasıl Yapılır

Vim öğrenmek tatmin edici bir deneyimdir, ancak zordur. Vim öğrenmenin iki ana yaklaşımı vardır:

1. Soğuk hindistan cevizi
2. Aşamalı

Soğuk hindistan cevizi, kullandığınız herhangi bir düzenleyiciyi / IDE'yi kullanmayı bırakmak ve şimdi itibarıyla yalnızca Vim kullanmaya başlamaktır. Bu yöntemin dezavantajı, ilk bir veya iki hafta boyunca ciddi bir verim kaybı yaşayacak olmanızdır. Eğer tam zamanlı bir programcıysanız, bu yöntem uygulanabilir olmayabilir. Bu yüzden çoğu insan için Vim'e geçişin en iyi yolu, onu aşamalı olarak kullanmaktır.

Vim'i aşamalı olarak kullanmak için, ilk iki hafta boyunca günde bir saat Vim'i düzenleyici olarak kullanarak, geri kalan zamanınızı diğer düzenleyicilerle geçirebilirsiniz. Birçok modern düzenleyici, Vim eklentileri ile birlikte gelir. Ben ilk başladığımda, günde bir saat VSCode'un popüler Vim eklentisini kullandım. Vim eklentisi ile geçirdiğim süreyi kademeli olarak artırdım ve sonunda tüm gün kullandım. Bu eklentilerin yalnızca Vim özelliklerinin bir kısmını taklit edebileceğini unutmayın. Vimscript, Komut satırı (Ex) Komutları ve harici komut entegrasyonu gibi Vim'in tam gücünü deneyimlemek için Vim'i kendisini kullanmanız gerekecek.

Vim'i %100 kullanmaya başlamamı sağlayan iki dönüm noktası vardı: Vim'in dil bilgisi benzeri bir yapıya sahip olduğunu kavradığımda (bkz. bölüm 4) ve [fzf.vim](https://github.com/junegunn/fzf.vim) eklentisi (bkz. bölüm 3).

İlki, Vim'in dil bilgisi benzeri yapısını fark ettiğimde, bu Vim kullanıcılarının ne hakkında konuştuklarını nihayet anladığım belirleyici bir andı. Yüzlerce benzersiz komut öğrenmeme gerek yoktu. Sadece küçük bir avuç komut öğrenmem yeterliydi ve birçok şeyi çok sezgisel bir şekilde zincirleyerek yapabiliyordum.

İkincisi, hızlı bir bulanık dosya araması yapabilme yeteneği, en çok kullandığım IDE özelliğiydi. Bunu Vim'de nasıl yapacağımı öğrendiğimde, büyük bir hız artışı kazandım ve o zamandan beri geri dönmedim.

Herkes farklı programlar. İçsel bir bakışla, favori düzenleyicinizden / IDE'nizden sürekli kullandığınız bir veya iki özellik bulacaksınız. Belki bulanık arama, tanıma atlama veya hızlı derleme olmuştur. Ne olursa olsun, bunları hızlıca belirleyin ve Vim'de nasıl uygulanacağını öğrenin (Vim'in muhtemelen bunları da yapabileceği ihtimali var). Düzenleme hızınız büyük bir artış alacaktır.

Orijinal hızın %50'sinde düzenleme yapabildiğinizde, tam zamanlı Vim'e geçme zamanı gelmiştir.

## Bu Kılavuzu Nasıl Okumalıyım

Bu pratik bir kılavuzdur. Vim'de iyi olmak için kas hafızanızı geliştirmeniz gerekir, baş bilgi değil.

Bir bisiklet sürmeyi, bisiklet sürme kılavuzunu okuyarak öğrenemezsiniz. Gerçekten bisiklet sürmeniz gerekir.

Bu kılavuzda bahsedilen her komutu yazmalısınız. Sadece bu değil, aynı zamanda bunları birkaç kez tekrarlamalı ve farklı kombinasyonlar denemelisiniz. Yeni öğrendiğiniz komutun diğer özelliklerini araştırın. `:help` komutu ve arama motorları en iyi arkadaşlarınızdır. Amacınız bir komut hakkında her şeyi bilmek değil, o komutu doğal ve içgüdüsel bir şekilde uygulayabilmektir.

Bu kılavuzu lineer hale getirmeye çalışsam da, bu kılavuzdaki bazı kavramların sırasının dışına çıkarılması gerekiyor. Örneğin, bölüm 1'de, `:s` değiştirme komutundan bahsediyorum, oysa bu bölüm 12'de ele alınacak. Bunu düzeltmek için, henüz ele alınmamış yeni bir kavram erken bahsedildiğinde, detaylı bir açıklama olmadan hızlı bir nasıl yapılır kılavuzu sağlayacağım. Bu yüzden lütfen benimle sabırlı olun :).

## Daha Fazla Yardım

Yardım kılavuzunu kullanmak için bir ekstra ipucu: diyelim ki, ekleme modunda `Ctrl-P`'nin ne yaptığını daha fazla öğrenmek istiyorsunuz. Eğer sadece `:h CTRL-P` araması yaparsanız, normal modun `Ctrl-P`'sine yönlendirilirsiniz. Bu, aradığınız `Ctrl-P` yardımı değildir. Bu durumda, bunun yerine `:h i_CTRL-P` araması yapın. Eklenen `i_`, ekleme modunu temsil eder. Hangi moda ait olduğuna dikkat edin.

## Söz Dizimi

Komut veya kod ile ilgili çoğu ifade kod biçimindedir (`böyle`). 

Dizeler çift tırnak ("böyle") ile çevrelenmiştir.

Vim komutları kısaltılabilir. Örneğin, `:join` `:j` olarak kısaltılabilir. Kılavuz boyunca, kısayol ve uzun açıklamaları karıştıracağım. Bu kılavuzda sık kullanılmayan komutlar için uzun versiyonu kullanacağım. Sık kullanılan komutlar için ise kısayol versiyonunu kullanacağım. Tutarsızlıklar için özür dilerim. Genel olarak, yeni bir komut gördüğünüzde, her zaman `:help`'te kısaltmalarını kontrol edin.

## Vimrc

Kılavuzun çeşitli noktalarında vimrc seçeneklerine atıfta bulunacağım. Eğer Vim'e yeniyseniz, vimrc bir yapılandırma dosyası gibidir.

Vimrc, bölüm 21'e kadar ele alınmayacak. Açıklık adına, burada nasıl ayarlanacağını kısaca göstereceğim.

Diyelim ki, numara seçeneklerini ayarlamanız gerekiyor (`set number`). Eğer zaten bir vimrc'niz yoksa, bir tane oluşturun. Genellikle ev dizininizde yer alır ve adı `.vimrc`'dir. İşletim sisteminize bağlı olarak, konum farklılık gösterebilir. macOS'ta, `~/.vimrc` üzerinde bulunuyor. Kendi vimrc'nizi nereye koymanız gerektiğini görmek için `:h vimrc`'ye bakın.

İçine `set number` ekleyin. Kaydedin (`:w`), ardından kaynak dosyasını (`:source %`) çalıştırın. Artık sol tarafta satır numaralarının görüntülendiğini görmelisiniz.

Alternatif olarak, kalıcı bir ayar değişikliği yapmak istemiyorsanız, her zaman `set` komutunu satır içi olarak çalıştırarak `:set number` komutunu çalıştırabilirsiniz. Bu yaklaşımın dezavantajı, bu ayarın geçici olmasıdır. Vim'i kapattığınızda, seçenek kaybolur.

Vim'i öğrenirken Vi'yi değil, `nocompatible` seçeneğinin olması gereken bir ayar olduğunu unutmayın. Vimrc'nize `set nocompatible` ekleyin. `compatible` seçeneği çalışırken birçok Vim'e özgü özellik devre dışı bırakılır.

Genel olarak, bir pasaj vimrc seçeneğinden bahsettiğinde, sadece o seçeneği vimrc'ye ekleyin, kaydedin ve kaynak dosyasını çalıştırın.

## Gelecek, Hatalar, Sorular

Gelecekte daha fazla güncelleme bekleyin. Herhangi bir hata bulursanız veya sorularınız varsa, lütfen benimle iletişime geçmekten çekinmeyin.

Ayrıca, birkaç yeni bölüm planladım, bu yüzden takipte kalın!

## Daha Fazla Vim Hilesi İstiyorum

Vim hakkında daha fazla bilgi edinmek için lütfen [@learnvim](https://twitter.com/learnvim) hesabını takip edin.

## Teşekkürler

Bu kılavuz, Vim'i yaratan Bram Moleenar, yolculuk boyunca çok sabırlı ve destekleyici olan eşim, learn-vim projesinin tüm [katkıda bulunanları](https://github.com/iggredible/Learn-Vim/graphs/contributors), Vim topluluğu ve adı geçmeyen birçok kişi olmadan mümkün olamazdı.

Teşekkür ederim. Hepiniz metin düzenlemeyi eğlenceli hale getiriyorsunuz :)