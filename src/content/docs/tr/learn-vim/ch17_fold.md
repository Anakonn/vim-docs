---
description: Vim'de dosyaları daha iyi anlamak için gereksiz metinleri gizlemek amacıyla
  katlama (fold) yöntemlerini öğrenin. Manuel katlama ile başlayın.
title: Ch17. Fold
---

Bir dosyayı okuduğunuzda, genellikle o dosyanın ne yaptığını anlamanızı engelleyen birçok alakasız metin vardır. Gereksiz gürültüyü gizlemek için Vim katlama (fold) özelliğini kullanın.

Bu bölümde, bir dosyayı katlamanın farklı yollarını öğreneceksiniz.

## Manuel Katlama

Bir kağıt parçasını katlayarak bazı metinleri kapattığınızı hayal edin. Gerçek metin yok olmaz, hala oradadır. Vim katlama, aynı şekilde çalışır. Metin aralığını katlar, görüntüden gizler ancak aslında silmez.

Katlama operatörü `z`'dir (bir kağıt katlandığında, z harfi gibi şekil alır).

Bu metne sahip olduğunuzu varsayalım:

```shell
Katla beni
Tut beni
```

İmleci ilk satırda tutarak `zfj` yazın. Vim, her iki satırı birleştirir. Şöyle bir şey görmelisiniz:

```shell
+-- 2 satır: Katla beni -----
```

İşte ayrıntılar:
- `zf` katlama operatörüdür.
- `j` katlama operatörü için harekettir.

Katlanmış bir metni `zo` ile açabilirsiniz. Katlamayı kapatmak için `zc` kullanın.

Katlama bir operatördür, bu nedenle dilbilgisi kuralını (`fiil + isim`) takip eder. Katlama operatörünü bir hareket veya metin nesnesi ile geçirebilirsiniz. İçerik paragraflarını katlamak için `zfip` komutunu çalıştırın. Bir dosyanın sonuna kadar katlamak için `zfG` çalıştırın. `{` ve `}` arasındaki metinleri katlamak için `zfa{` komutunu çalıştırın.

Görsel moddan katlama yapabilirsiniz. Katlamak istediğiniz alanı vurgulayın (`v`, `V` veya `Ctrl-v`), ardından `zf` komutunu çalıştırın.

Komut satırı modundan katlama yapmak için `:fold` komutunu kullanabilirsiniz. Mevcut satırı ve sonrasındaki satırı katlamak için:

```shell
:,+1fold
```

`,+1` aralıktır. Eğer aralığa parametre geçmezseniz, varsayılan olarak mevcut satırı alır. `+1` bir sonraki satır için aralık göstergesidir. 5 ile 10 arasındaki satırları katlamak için `:5,10fold` komutunu çalıştırın. Mevcut konumdan satırın sonuna kadar katlamak için `:,$fold` komutunu çalıştırın.

Birçok başka katlama ve açma komutu vardır. Başlangıçta hatırlamak için çok fazla buluyorum. En kullanışlı olanlar:
- `zR` tüm katlamaları açar.
- `zM` tüm katlamaları kapatır.
- `za` bir katlamayı açıp kapatır.

`zR` ve `zM` komutlarını herhangi bir satırda çalıştırabilirsiniz, ancak `za` yalnızca katlanmış / açılmış bir satırda çalışır. Daha fazla katlama komutu öğrenmek için `:h fold-commands` kısmına bakın.

## Farklı Katlama Yöntemleri

Yukarıdaki bölüm Vim'in manuel katlamasını kapsar. Vim'de altı farklı katlama yöntemi vardır:
1. Manuel
2. Girinti
3. İfade
4. Söz dizimi
5. Fark
6. İşaretçi

Hangi katlama yöntemini kullandığınızı görmek için `:set foldmethod?` komutunu çalıştırın. Varsayılan olarak, Vim `manuel` yöntemini kullanır.

Bölümün geri kalanında, diğer beş katlama yöntemini öğreneceksiniz. Girinti katlaması ile başlayalım.

## Girinti Katlaması

Girinti katlaması kullanmak için `'foldmethod'` değerini girinti olarak değiştirin:

```shell
:set foldmethod=indent
```

Varsayalım ki şu metne sahipsiniz:

```shell
Bir
  İki
  Tekrar iki
```

`:set foldmethod=indent` komutunu çalıştırırsanız, şunu göreceksiniz:

```shell
Bir
+-- 2 satır: İki -----
```

Girinti katlaması ile Vim, her satırın başında kaç boşluk olduğunu kontrol eder ve bunu `'shiftwidth'` seçeneği ile karşılaştırarak katlanabilirliğini belirler. `'shiftwidth'`, her girinti adımı için gereken boşluk sayısını döndürür. Eğer:

```shell
:set shiftwidth?
```

komutunu çalıştırırsanız, Vim'in varsayılan `'shiftwidth'` değeri 2'dir. Yukarıdaki metinde, "İki" ve "Tekrar iki" metinlerinin başlangıcı ile arasındaki boşluk sayısı iki. Vim, boşluk sayısını gördüğünde ve `'shiftwidth'` değeri 2 olduğunda, o satırı bir girinti katlama seviyesine sahip olarak değerlendirir.

Bu sefer, satırın başlangıcı ile metin arasında yalnızca bir boşluk olduğunu varsayalım:

```shell
Bir
 İki
 Tekrar iki
```

Şu anda `:set foldmethod=indent` komutunu çalıştırdığınızda, Vim girintili satırı katlamaz çünkü her satırda yeterli boşluk yoktur. Bir boşluk, bir girinti olarak kabul edilmez. Ancak, `'shiftwidth'` değerini 1 olarak değiştirirseniz:

```shell
:set shiftwidth=1
```

Metin artık katlanabilir. Artık bir girinti olarak kabul edilir.

`shiftwidth` değerini tekrar 2'ye geri döndürün ve metinler arasındaki boşlukları tekrar iki yapın. Ayrıca, iki ek metin ekleyin:

```shell
Bir
  İki
  Tekrar iki
    Üç
    Tekrar üç
```

Katlama (`zM`) komutunu çalıştırdığınızda, şunu göreceksiniz:

```shell
Bir
+-- 4 satır: İki -----
```

Katlanmış satırları açın (`zR`), ardından imlecinizi "Üç" üzerine koyun ve metnin katlama durumunu değiştirin (`za`):

```shell
Bir
  İki
  Tekrar iki
+-- 2 satır: Üç -----
```

Bu ne? Bir katlama içinde bir katlama mı?

İç içe katlamalar geçerlidir. "İki" ve "Tekrar iki" metinleri bir katlama seviyesine sahiptir. "Üç" ve "Tekrar üç" metinleri ise iki katlama seviyesine sahiptir. Eğer katlanabilir bir metin içinde daha yüksek bir katlama seviyesine sahip bir metin varsa, birden fazla katlama katmanı elde edersiniz.

## İfade Katlaması

İfade katlaması, bir katlama için eşleşecek bir ifade tanımlamanıza olanak tanır. Katlama ifadelerini tanımladıktan sonra, Vim her satırı `'foldexpr'` değerine göre tarar. Bu, uygun değeri döndürmek için yapılandırmanız gereken değişkendir. Eğer `'foldexpr'` 0 dönerse, o satır katlanmaz. Eğer 1 dönerse, o satırın katlama seviyesi 1'dir. Eğer 2 dönerse, o satırın katlama seviyesi 2'dir. Tam sayılardan başka daha fazla değer vardır, ancak bunları geçmeyeceğim. Merak ediyorsanız, `:h fold-expr` kısmına bakın.

Öncelikle katlama yöntemini değiştirelim:

```shell
:set foldmethod=expr
```

Varsayalım ki bir kahvaltılık yiyecekler listesine sahipsiniz ve "p" ile başlayan tüm kahvaltılık yiyecekleri katlamak istiyorsunuz:

```shell
donut
pancake
pop-tarts
protein bar
salmon
scrambled eggs
```

Sonra, "p" ile başlayan ifadeleri yakalamak için `foldexpr` değerini değiştirin:

```shell
:set foldexpr=getline(v:lnum)[0]==\\"p\\"
```

Yukarıdaki ifade karmaşık görünüyor. Hadi bunu parçalara ayıralım:
- `:set foldexpr` `'foldexpr'` seçeneğini özel bir ifadeyi kabul edecek şekilde ayarlar.
- `getline()` bir Vimscript fonksiyonudur ve verilen herhangi bir satırın içeriğini döndürür. Eğer `:echo getline(5)` komutunu çalıştırırsanız, 5. satırın içeriğini döndürür.
- `v:lnum`, `'foldexpr'` ifadesi için Vim'in özel değişkenidir. Vim her satırı tarar ve o anda her satırın numarasını `v:lnum` değişkeninde saklar. 5. satırda `v:lnum` değeri 5'tir. 10. satırda `v:lnum` değeri 10'dur.
- `[0]` `getline(v:lnum)[0]` bağlamında her satırın ilk karakteridir. Vim bir satırı taradığında, `getline(v:lnum)` her satırın içeriğini döndürür. `getline(v:lnum)[0]` her satırın ilk karakterini döndürür. Listemizin ilk satırında, "donut", `getline(v:lnum)[0]` "d" döndürür. Listemizin ikinci satırında, "pancake", `getline(v:lnum)[0]` "p" döndürür.
- `==\\"p\\"` eşitlik ifadesinin ikinci yarısıdır. Değerlendirdiğiniz ifadenin "p" ile eşit olup olmadığını kontrol eder. Eğer doğruysa, 1 döner. Eğer yanlışsa, 0 döner. Vim'de 1 doğru, 0 yanlıştır. Yani "p" ile başlayan satırlarda 1 döner. Eğer bir `'foldexpr'` 1 değerine sahipse, o zaman katlama seviyesi 1'dir.

Bu ifadeyi çalıştırdıktan sonra şunu görmelisiniz:

```shell
donut
+-- 3 satır: pancake -----
salmon
scrambled eggs
```

## Söz Dizimi Katlaması

Söz dizimi katlaması, söz dizimi dil vurgulaması tarafından belirlenir. Eğer [vim-polyglot](https://github.com/sheerun/vim-polyglot) gibi bir dil söz dizimi eklentisi kullanıyorsanız, söz dizimi katlaması kutudan çıkar çıkmaz çalışır. Katlama yöntemini söz dizimi olarak değiştirmek yeterlidir:

```shell
:set foldmethod=syntax
```

Bir JavaScript dosyasını düzenlediğinizi ve vim-polyglot'un yüklü olduğunu varsayalım. Aşağıdaki gibi bir diziye sahipseniz:

```shell
const nums = [
  one,
  two,
  three,
  four
]
```

Bu, bir söz dizimi katlaması ile katlanır. Belirli bir dil için bir söz dizimi vurgulaması tanımladığınızda (genellikle `syntax/` dizini içinde), katlanabilir hale getirmek için bir `fold` niteliği ekleyebilirsiniz. Aşağıda, vim-polyglot JavaScript söz dizimi dosyasından bir kesit bulunmaktadır. Sonundaki `fold` anahtar kelimesine dikkat edin.

```shell
syntax region  jsBracket                      matchgroup=jsBrackets            start=/\[/ end=/\]/ contains=@jsExpression,jsSpreadExpression extend fold
```

Bu kılavuz `syntax` özelliğini kapsamayacaktır. Merak ediyorsanız, `:h syntax.txt` kısmına bakın.

## Fark Katlaması

Vim, iki veya daha fazla dosyayı karşılaştırmak için bir fark prosedürü gerçekleştirebilir.

Eğer `file1.txt` dosyanız varsa:

```shell
vim harika
vim harika
vim harika
vim harika
vim harika
vim harika
vim harika
vim harika
vim harika
```

Ve `file2.txt` dosyanız varsa:

```shell
vim harika
vim harika
vim harika
vim harika
vim harika
vim harika
vim harika
vim harika
emacs fena değil
```

`vimdiff file1.txt file2.txt` komutunu çalıştırın:

```shell
+-- 3 satır: vim harika -----
vim harika
vim harika
vim harika
vim harika
vim harika
vim harika
[vim harika] / [emacs fena değil]
```

Vim, bazı benzer satırları otomatik olarak katlar. `vimdiff` komutunu çalıştırdığınızda, Vim otomatik olarak `foldmethod=diff` kullanır. Eğer `:set foldmethod?` komutunu çalıştırırsanız, `diff` döner.

## İşaretçi Katlaması

Bir işaretçi katlaması kullanmak için:

```shell
:set foldmethod=marker
```

Varsayalım ki şu metne sahipsiniz:

```shell
Merhaba

{{{
dünya
vim
}}}
```

`zM` komutunu çalıştırdığınızda, şunu göreceksiniz:

```shell
merhaba

+-- 4 satır: -----
```

Vim, `{{{` ve `}}}`'yi katlama göstergeleri olarak görür ve aralarındaki metinleri katlar. İşaretçi katlaması ile Vim, katlama alanlarını işaretlemek için `'foldmarker'` seçeneği ile tanımlanan özel işaretçileri arar. Vim'in hangi işaretçileri kullandığını görmek için:

```shell
:set foldmarker?
```

komutunu çalıştırın.

Varsayılan olarak, Vim `{{{` ve `}}}`'yi gösterge olarak kullanır. Göstergeleri "coffee1" ve "coffee2" gibi başka metinlerle değiştirmek isterseniz:

```shell
:set foldmarker=coffee1,coffee2
```

Eğer şu metne sahipseniz:

```shell
merhaba

coffee1
dünya
vim
coffee2
```

Artık Vim, `coffee1` ve `coffee2`'yi yeni katlama işaretçileri olarak kullanır. Bir yan not olarak, bir gösterge bir literal dize olmalı ve regex olamaz.

## Katlamayı Kalıcı Hale Getirme

Vim oturumunu kapattığınızda tüm katlama bilgilerini kaybedersiniz. Eğer bu dosyaya sahipseniz, `count.txt`:

```shell
bir
iki
üç
dört
beş
```

Sonra "üç" satırından aşağıya manuel bir katlama yapın (`:3,$fold`):

```shell
bir
iki
+-- 3 satır: üç ---
```

Vim'den çıkıp `count.txt` dosyasını yeniden açtığınızda, katlamalar artık orada değildir!

Katlamaları korumak için, katladıktan sonra şunu çalıştırın:

```shell
:mkview
```

Sonra `count.txt` dosyasını açtığınızda, şunu çalıştırın:

```shell
:loadview
```

Katlamalarınız geri yüklenir. Ancak, `mkview` ve `loadview` komutlarını manuel olarak çalıştırmanız gerekir. Bir gün, dosyayı kapatmadan önce `mkview` komutunu çalıştırmayı unutacağım ve tüm katlamaları kaybedeceğim. Bu süreci nasıl otomatikleştirebiliriz?

Bir `.txt` dosyasını kapatırken otomatik olarak `mkview` çalıştırmak ve bir `.txt` dosyasını açarken `loadview` çalıştırmak için, vimrc dosyanıza şunu ekleyin:

```shell
autocmd BufWinLeave *.txt mkview
autocmd BufWinEnter *.txt silent loadview
```

Hatırlayın ki `autocmd`, bir olay tetiklendiğinde bir komut çalıştırmak için kullanılır. Buradaki iki olay:
- `BufWinLeave`, bir tamponu bir pencereden kaldırdığınızda.
- `BufWinEnter`, bir tamponu bir pencerede yüklediğinizde.

Artık bir `.txt` dosyası içinde katlama yaptıktan sonra Vim'den çıkıp dosyayı yeniden açtığınızda, katlama bilgileriniz geri yüklenecektir.

Varsayılan olarak, Vim `mkview` komutunu çalıştırdığında katlama bilgilerini `~/.vim/view` dizininde Unix sistemi için kaydeder. Daha fazla bilgi için `:h 'viewdir'` kısmına bakın.
## Akıllı Yöntemle Katlama Öğrenin

Vim'e ilk başladığımda, katlamayı öğrenmeyi ihmal ettim çünkü faydalı olduğunu düşünmüyordum. Ancak, kod yazdıkça katlamanın ne kadar faydalı olduğunu daha çok fark ettim. Stratejik olarak yerleştirilmiş katlamalar, metin yapısının daha iyi bir genel görünümünü sağlayabilir, tıpkı bir kitabın içindekiler tablosu gibi.

Katlamayı öğrenirken, öncelikle manuel katlamayla başlayın çünkü bu hareket halindeyken kullanılabilir. Ardından, girinti ve işaret katlamaları yapmak için farklı ipuçlarını yavaş yavaş öğrenin. Son olarak, sözdizimi ve ifade katlamalarını nasıl yapacağınızı öğrenin. Hatta son iki yöntemi kendi Vim eklentilerinizi yazmak için de kullanabilirsiniz.