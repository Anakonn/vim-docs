---
description: Vim etiketlerini kullanarak kod tanımlarına hızlıca erişmeyi öğrenin.
  Bu bölümde, etiketlerin nasıl kullanılacağını keşfedeceksiniz.
title: Ch16. Tags
---

Bir metin düzenleme uygulamasında yararlı bir özellik, herhangi bir tanıma hızlıca gitmektir. Bu bölümde, Vim etiketlerini nasıl kullanacağınızı öğreneceksiniz.

## Etiket Genel Görünümü

Diyelim ki size yeni bir kod tabanı verildi:

```shell
one = One.new
one.donut
```

`One`? `donut`? Bu, kodu yazan geliştiriciler için o zamanlar belirgin olabilir, ancak şimdi o geliştiriciler burada değil ve bu belirsiz kodları anlamak sizin sorumluluğunuzda. Bunu anlamanın bir yolu, `One` ve `donut`'un tanımlandığı kaynak kodunu takip etmektir.

Onları `fzf` veya `grep` (veya `vimgrep`) ile arayabilirsiniz, ancak bu durumda etiketler daha hızlıdır.

Etiketleri bir adres defteri gibi düşünün:

```shell
İsim    Adres
Iggy1   1234 Cool St, 11111
Iggy2   9876 Awesome Ave, 2222
```

Bir isim-adres çifti yerine, etiketler tanımları adreslerle eşleştirerek saklar.

Aynı dizinde bu iki Ruby dosyasına sahip olduğunuzu varsayalım:

```shell
## one.rb
class One
  def initialize
    puts "Başlatıldı"
  end

  def donut
    puts "Bar"
  end
end
```

ve

```shell
## two.rb
require './one'

one = One.new
one.donut
```

Bir tanıma atlamak için normal modda `Ctrl-]` tuşunu kullanabilirsiniz. `two.rb` içinde `one.donut`'un bulunduğu satıra gidin ve imleci `donut` üzerine getirin. `Ctrl-]` tuşuna basın.

Aman Tanrım, Vim etiket dosyasını bulamadı. Öncelikle etiket dosyasını oluşturmanız gerekiyor.

## Etiket Üretici

Modern Vim, etiket üreticisi ile gelmez, bu yüzden harici bir etiket üreticisi indirmeniz gerekecek. Seçebileceğiniz birkaç seçenek var:

- ctags = Sadece C. Neredeyse her yerde mevcut.
- exuberant ctags = En popüler olanlardan biri. Birçok dil desteği var.
- universal ctags = Exuberant ctags'a benzer, ancak daha yenidir.
- etags = Emacs için. Hmm...
- JTags = Java
- ptags.py = Python
- ptags = Perl
- gnatxref = Ada

Çevrimiçi Vim eğitimlerine bakarsanız, birçok kişi [exuberant ctags](http://ctags.sourceforge.net/) önerir. [41 programlama dilini](http://ctags.sourceforge.net/languages.html) destekler. Ben bunu kullandım ve harika çalıştı. Ancak, 2009'dan beri bakım görmediği için Universal ctags daha iyi bir seçim olacaktır. Exuberant ctags ile benzer şekilde çalışır ve şu anda bakım altındadır.

Universal ctags'ı nasıl kuracağım konusunda ayrıntılara girmeyeceğim. Daha fazla talimat için [universal ctags](https://github.com/universal-ctags/ctags) deposuna göz atın.

Universal ctags'ın kurulu olduğunu varsayarak, temel bir etiket dosyası oluşturalım. Şunu çalıştırın:

```shell
ctags -R .
```

`R` seçeneği, ctags'a mevcut konumunuzdan (`.`) özyinelemeli bir tarama yapmasını söyler. Mevcut dizininizde bir `tags` dosyası görmelisiniz. İçinde şöyle bir şey göreceksiniz:

```shell
!_TAG_FILE_FORMAT	2	/extended format; --format=1 will not append ;" to lines/
!_TAG_FILE_SORTED	1	/0=unsorted, 1=sorted, 2=foldcase/
!_TAG_OUTPUT_FILESEP	slash	/slash or backslash/
!_TAG_OUTPUT_MODE	u-ctags	/u-ctags or e-ctags/
!_TAG_PATTERN_LENGTH_LIMIT	96	/0 for no limit/
!_TAG_PROGRAM_AUTHOR	Universal Ctags Team	//
!_TAG_PROGRAM_NAME	Universal Ctags	/Derived from Exuberant Ctags/
!_TAG_PROGRAM_URL	<https://ctags.io/>	/official site/
!_TAG_PROGRAM_VERSION	0.0.0	/b43eb39/
One	one.rb	/^class One$/;"	c
donut	one.rb	/^  def donut$/;"	f	class:One
initialize	one.rb	/^  def initialize$/;"	f	class:One
```

Sizin dosyanız, Vim ayarlarınıza ve ctags üreticisine bağlı olarak biraz farklı görünebilir. Bir etiket dosyası iki bölümden oluşur: etiket meta verisi ve etiket listesi. Bu meta veriler (`!TAG_FILE...`) genellikle ctags üreticisi tarafından kontrol edilir. Burada bunu tartışmayacağım, ancak daha fazla bilgi için belgelerine göz atabilirsiniz! Etiket listesi, ctags tarafından dizinlenmiş tüm tanımların bir listesidir.

Şimdi `two.rb` dosyasına gidin, imleci `donut` üzerine getirin ve `Ctrl-]` tuşuna basın. Vim sizi `def donut`'un bulunduğu `one.rb` dosyasına götürecektir. Başarılı! Ama Vim bunu nasıl yaptı?

## Etiket Anatomisi

`donut` etiket öğesine bakalım:

```shell
donut	one.rb	/^  def donut$/;"	f	class:One
```

Yukarıdaki etiket öğesi dört bileşenden oluşur: bir `tagname`, bir `tagfile`, bir `tagaddress` ve etiket seçenekleri.
- `donut` etiket adıdır. İmleciniz "donut" üzerinde olduğunda, Vim etiket dosyasında "donut" dizesini içeren bir satır arar.
- `one.rb` etiket dosyasıdır. Vim `one.rb` dosyasını arar.
- `/^ def donut$/` etiket adresidir. `/.../` bir desen göstergesidir. `^` bir satırdaki ilk öğe için bir desendir. Ardından iki boşluk gelir, sonra `def donut` dizesi. Son olarak, `$` bir satırdaki son öğe için bir desendir.
- `f class:One` etiket seçeneğidir ve Vim'e `donut` fonksiyonunun bir fonksiyon olduğunu (`f`) ve `One` sınıfının parçası olduğunu belirtir.

Etiket listesindeki başka bir öğeye bakalım:

```shell
One	one.rb	/^class One$/;"	c
```

Bu satır, `donut` deseninin aynı şekilde çalışır:

- `One` etiket adıdır. Etiketlerde, ilk tarama büyük/küçük harf duyarlıdır. Listede `One` ve `one` varsa, Vim `One`'ı `one`'dan öncelikli olarak seçer.
- `one.rb` etiket dosyasıdır. Vim `one.rb` dosyasını arar.
- `/^class One$/` etiket adresi desenidir. Vim, `class` ile başlayan (`^`) ve `One` ile biten (`$`) bir satır arar.
- `c` olası etiket seçeneklerinden biridir. `One` bir ruby sınıfı olduğu için ve bir prosedür olmadığı için, bunu `c` ile işaretler.

Kullandığınız etiket üreticisine bağlı olarak, etiket dosyanızın içeriği farklı görünebilir. En azından, bir etiket dosyası bu formatlardan birine sahip olmalıdır:

```shell
1.  {tagname} {TAB} {tagfile} {TAB} {tagaddress}
2.  {tagname} {TAB} {tagfile} {TAB} {tagaddress} {term} {field} ..
```

## Etiket Dosyası

`ctags -R .` komutunu çalıştırdıktan sonra yeni bir dosya olan `tags` dosyasının oluşturulduğunu öğrendiniz. Vim etiket dosyasını nerede arayacağını nasıl biliyor?

`:set tags?` komutunu çalıştırırsanız, `tags=./tags,tags` görebilirsiniz (Vim ayarlarınıza bağlı olarak farklı olabilir). Burada Vim, `./tags` durumunda mevcut dosyanın yolundaki tüm etiketleri ve `tags` durumunda mevcut dizinde (proje kökü) etiketleri arar.

Ayrıca `./tags` durumunda, Vim, mevcut dosyanızın yolunda bir etiket dosyası arar, ne kadar iç içe olursa olsun, ardından mevcut dizinde (proje kökü) bir etiket dosyası arar. Vim, ilk eşleşmeyi bulduğunda durur.

Eğer `'tags'` dosyanız `tags=./tags,tags,/user/iggy/mytags/tags` demiş olsaydı, o zaman Vim, `./tags` ve `tags` dizinlerini aradıktan sonra `/user/iggy/mytags` dizininde bir etiket dosyası arayacaktır. Etiket dosyanızı projenizin içinde saklamak zorunda değilsiniz, onları ayrı tutabilirsiniz.

Yeni bir etiket dosyası konumu eklemek için şu şekilde kullanın:

```shell
set tags+=path/to/my/tags/file
```

## Büyük Bir Proje için Etiket Üretimi

Eğer büyük bir projede ctags çalıştırmaya çalıştıysanız, bu uzun sürebilir çünkü Vim her iç içe dizinde de arama yapar. Eğer bir Javascript geliştiricisiyseniz, `node_modules`'ın çok büyük olabileceğini bilirsiniz. Beş alt projeye sahip olduğunuzu ve her birinin kendi `node_modules` dizinine sahip olduğunu hayal edin. Eğer `ctags -R .` komutunu çalıştırırsanız, ctags tüm 5 `node_modules`'ı taramaya çalışacaktır. Muhtemelen `node_modules` üzerinde ctags çalıştırmanıza gerek yoktur.

`node_modules`'ı hariç tutarak ctags çalıştırmak için şunu çalıştırın:

```shell
ctags -R --exclude=node_modules .
```

Bu sefer bir saniyeden az sürmelidir. Bu arada, `exclude` seçeneğini birden fazla kez kullanabilirsiniz:

```shell
ctags -R --exclude=.git --exclude=vendor --exclude=node_modules --exclude=db --exclude=log .
```

Önemli olan, bir dizini hariç tutmak istiyorsanız, `--exclude` en iyi arkadaşınızdır.

## Etiket Navigasyonu

Sadece `Ctrl-]` kullanarak iyi bir mesafe kat edebilirsiniz, ancak birkaç hile daha öğrenelim. Etiket atlama tuşu `Ctrl-]`'ın bir komut satırı modu alternatifi vardır: `:tag {tag-name}`. Eğer şunu çalıştırırsanız:

```shell
:tag donut
```

Vim, "donut" dizesinde `Ctrl-]` yapmış gibi `donut` metoduna atlayacaktır. Argümanı da `<Tab>` ile otomatik tamamlayabilirsiniz:

```shell
:tag d<Tab>
```

Vim, "d" ile başlayan tüm etiketleri listeler. Bu durumda, "donut".

Gerçek bir projede, aynı isimde birden fazla yöntemle karşılaşabilirsiniz. Önceki iki ruby dosyasını güncelleyelim. `one.rb` içinde:

```shell
## one.rb
class One
  def initialize
    puts "Başlatıldı"
  end

  def donut
    puts "bir donut"
  end

  def pancake
    puts "bir pancake"
  end
end
```

`two.rb` içinde:

```shell
## two.rb
require './one.rb'

def pancake
  "İki pancake"
end

one = One.new
one.donut
puts pancake
```

Eğer kod yazmaya devam ediyorsanız, şimdi birkaç yeni prosedürünüz olduğu için `ctags -R .` komutunu tekrar çalıştırmayı unutmayın. `pancake` prosedürünün iki örneği var. Eğer `two.rb` içindeyseniz ve `Ctrl-]` tuşuna basarsanız, ne olur?

Vim, `two.rb` içindeki `def pancake`'e atlayacaktır, `one.rb` içindeki `def pancake`'e değil. Bunun nedeni, Vim'in `two.rb` içindeki `pancake` prosedürünü diğer `pancake` prosedüründen daha yüksek öncelikli görmesidir.

## Etiket Önceliği

Tüm etiketler eşit değildir. Bazı etiketlerin daha yüksek öncelikleri vardır. Eğer Vim, yinelenen öğe adlarıyla karşılaşırsa, Vim anahtar kelimenin önceliğini kontrol eder. Sıralama şu şekildedir:

1. Mevcut dosyada tam eşleşen statik etiket.
2. Mevcut dosyada tam eşleşen global etiket.
3. Farklı bir dosyada tam eşleşen global etiket.
4. Başka bir dosyada tam eşleşen statik etiket.
5. Mevcut dosyada büyük/küçük harf duyarsız olarak eşleşen statik etiket.
6. Mevcut dosyada büyük/küçük harf duyarsız olarak eşleşen global etiket.
7. Farklı bir dosyada büyük/küçük harf duyarsız olarak eşleşen global etiket.
8. Mevcut dosyada büyük/küçük harf duyarsız olarak eşleşen statik etiket.

Öncelik listesine göre, Vim aynı dosyada bulunan tam eşleşmeyi önceliklendirir. Bu nedenle Vim, `two.rb` içindeki `pancake` prosedürünü `one.rb` içindeki `pancake` prosedürüne tercih eder. Yukarıdaki öncelik listesine bağlı olarak bazı istisnalar vardır, ancak bunları burada tartışmayacağım. Eğer ilgileniyorsanız, `:h tag-priority`'ye göz atın.

## Seçici Etiket Atlama

Her zaman en yüksek öncelikli etiket öğesine gitmek yerine hangi etiket öğelerine atlayacağınızı seçebilmek güzel olurdu. Belki de `two.rb`'deki `pancake` metoduna değil, `one.rb`'deki `pancake` metoduna atlamak istiyorsunuz. Bunu yapmak için `:tselect` kullanabilirsiniz. Şunu çalıştırın:

```shell
:tselect pancake
```

Ekranın alt kısmında şunu göreceksiniz:
## pri kind tag               dosya
1 F C f    pancake           iki.rb
             def pancake
2 F   f    pancake           bir.rb
             class:Bir
             def pancake
```

Eğer 2 yazarsanız, Vim `bir.rb` dosyasındaki prosedüre atlayacaktır. Eğer 1 yazarsanız, Vim `iki.rb` dosyasındaki prosedüre atlayacaktır.

`pri` sütununa dikkat edin. İlk eşleşmede `F C` ve ikinci eşleşmede `F` var. Vim, etiket önceliğini belirlemek için bunu kullanır. `F C`, mevcut (`C`) dosyada tam eşleşen (`F`) bir global etiketi ifade eder. `F`, yalnızca tam eşleşen (`F`) bir global etiketi ifade eder. `F C`, her zaman `F`'den daha yüksek bir önceliğe sahiptir.

`:tselect donut` komutunu çalıştırırsanız, Vim size hangi etiket öğesine atlamak istediğinizi seçmeniz için bir istemde bulunur, oysa yalnızca bir seçenek vardır. Vim'in etiket listesini yalnızca birden fazla eşleşme olduğunda istemesi ve yalnızca bir etiket bulunduğunda hemen atlaması için bir yol var mı?

Elbette! Vim'in `:tjump` yöntemi var. Şunu çalıştırın:

```shell
:tjump donut
```

Vim hemen `bir.rb` dosyasındaki `donut` prosedürüne atlayacaktır, tıpkı `:tag donut` komutunu çalıştırmak gibi. Şimdi şunu çalıştırın:

```shell
:tjump pancake
```

Vim, tıpkı `:tselect pancake` komutunu çalıştırmak gibi, seçmeniz için etiket seçeneklerini size sunacaktır. `tjump` ile her iki yöntemin en iyisini elde edersiniz.

Vim'in `tjump` için normal modda bir tuşu vardır: `g Ctrl-]`. Ben şahsen `g Ctrl-]`'yi `Ctrl-]`'den daha çok seviyorum.

## Etiketlerle Otomatik Tamamlama

Etiketler otomatik tamamlama işlemlerine yardımcı olabilir. 6. bölüm, Ekleme Modu'ndan hatırlayın ki, çeşitli otomatik tamamlama işlemleri yapmak için `Ctrl-X` alt modunu kullanabilirsiniz. Bahsetmediğim bir otomatik tamamlama alt modu `Ctrl-]` idi. Ekleme modundayken `Ctrl-X Ctrl-]` yaparsanız, Vim etiket dosyasını otomatik tamamlama için kullanacaktır.

Ekleme moduna geçip `Ctrl-x Ctrl-]` yazarsanız, şunları göreceksiniz:

```shell
Bir
donut
initialize
pancake
```

## Etiket Yığını

Vim, atladığınız tüm etiketlerin bir listesini etiket yığında tutar. Bu yığını `:tags` ile görebilirsiniz. İlk önce `pancake` etiketine atladıysanız, ardından `donut` etiketine atladıysanız ve `:tags` komutunu çalıştırırsanız, şunu göreceksiniz:

```shell
  # ETİKET         KAYNAK satır  dosya/yazı içinde
  1  1 pancake            10  ch16_tags/iki.rb
  2  1 donut               9  ch16_tags/iki.rb
>
```

Yukarıdaki `>` sembolüne dikkat edin. Bu, yığındaki mevcut konumunuzu gösterir. Yığını "pop" etmek için bir önceki yığına geri dönmek isterseniz, `:pop` komutunu çalıştırabilirsiniz. Bunu deneyin, ardından tekrar `:tags` komutunu çalıştırın:

```shell
  # ETİKET         KAYNAK satır  dosya/yazı içinde
  1  1 pancake            10  puts pancake
> 2  1 donut               9  bir.donut

```

`>` sembolünün artık ikinci satırda, `donut`'un bulunduğu yerde olduğunu unutmayın. Bir kez daha `pop` yapın, ardından tekrar `:tags` komutunu çalıştırın:

```shell
  # ETİKET         KAYNAK satır  dosya/yazı içinde
> 1  1 pancake            10  puts pancake
  2  1 donut               9  bir.donut
```

Normal modda `Ctrl-t` yazarak `:pop` ile aynı etkiyi elde edebilirsiniz.

## Otomatik Etiket Üretimi

Vim etiketlerinin en büyük dezavantajlarından biri, her önemli değişiklik yaptığınızda etiket dosyasını yeniden oluşturmanız gerektiğidir. Eğer `pancake` prosedürünü `waffle` prosedürü olarak yeniden adlandırdıysanız, etiket dosyası `pancake` prosedürünün yeniden adlandırıldığını bilmez. Hala etiketler listesinde `pancake`'i saklar. Güncellenmiş bir etiket dosyası oluşturmak için `ctags -R .` komutunu çalıştırmalısınız. Bu şekilde yeni bir etiket dosyası oluşturmak zahmetli olabilir.

Neyse ki, etiketleri otomatik olarak oluşturmak için kullanabileceğiniz birkaç yöntem var.

## Kaydettiğinizde Etiket Oluşturma

Vim, bir olay tetiklendiğinde herhangi bir komutu çalıştırmak için bir otomatik komut (`autocmd`) yöntemine sahiptir. Bunu her kaydettiğinizde etiket oluşturmak için kullanabilirsiniz. Şunu çalıştırın:

```shell
:autocmd BufWritePost *.rb silent !ctags -R .
```

Ayrıntılar:
- `autocmd`, bir komut satırı komutudur. Bir olay, dosya deseni ve bir komut kabul eder.
- `BufWritePost`, bir tamponu kaydetme olayıdır. Her dosyayı kaydettiğinizde, bir `BufWritePost` olayı tetiklenir.
- `.rb`, ruby dosyaları için bir dosya desenidir.
- `silent`, aslında geçirdiğiniz komutun bir parçasıdır. Bunu yapmazsanız, Vim her otomatik komutu tetiklediğinizde `devam etmek için ENTER'a basın veya komut yazın` mesajını gösterir.
- `!ctags -R .`, çalıştırılacak komuttur. Vim içinden `!cmd`'nin terminal komutunu çalıştırdığını hatırlayın.

Artık her ruby dosyasından kaydettiğinizde, Vim `ctags -R .` komutunu çalıştıracaktır.

## Eklentileri Kullanma

Otomatik olarak ctags oluşturmak için birkaç eklenti vardır:

- [vim-gutentags](https://github.com/ludovicchabant/vim-gutentags)
- [vim-tags](https://github.com/szw/vim-tags)
- [vim-easytags](https://github.com/xolox/vim-easytags)
- [vim-autotag](https://github.com/craigemery/vim-autotag)

Ben vim-gutentags kullanıyorum. Kullanımı basit ve kutudan çıkar çıkmaz çalışır.

## Ctags ve Git Hook'ları

Birçok harika Vim eklentisinin yazarı Tim Pope, git hook'larını kullanmayı öneren bir blog yazdı. [Göz atın](https://tbaggery.com/2011/08/08/effortless-ctags-with-git.html).

## Etiketleri Akıllı Bir Şekilde Öğrenin

Bir etiket, doğru yapılandırıldığında faydalıdır. Diyelim ki yeni bir kod tabanıyla karşı karşıyasınız ve `functionFood`'un ne yaptığını anlamak istiyorsunuz, tanımına atlayarak kolayca okuyabilirsiniz. İçinde, `functionBreakfast`'ı da çağırdığını öğrenirsiniz. Bunu takip edersiniz ve `functionPancake`'ı çağırdığını öğrenirsiniz. Fonksiyon çağrısı grafiğiniz şöyle görünür:

```shell
functionFood -> functionBreakfast -> functionPancake
```

Bu, bu kod akışının kahvaltıda pancake ile ilgili olduğunu anlamanızı sağlar.

Etiketler hakkında daha fazla bilgi edinmek için `:h tags` komutuna bakın. Artık etiketleri nasıl kullanacağınızı bildiğinize göre, farklı bir özelliği keşfedelim: katlama.