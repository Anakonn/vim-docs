---
description: Vim'de temel hareketleri öğrenerek dosyalar içinde daha hızlı gezinmeyi
  sağlayan bir kılavuz. Klavye ile verimli hareket etmenin yollarını keşfedin.
title: Ch05. Moving in a File
---

Başlangıçta, bir klavye ile hareket etmek yavaş ve garip hissettirebilir ama pes etmeyin! Alıştığınızda, bir dosyada fare kullanmaktan daha hızlı bir şekilde her yere gidebilirsiniz.

Bu bölümde, temel hareketleri ve bunları nasıl verimli bir şekilde kullanacağınızı öğreneceksiniz. Unutmayın ki bu, Vim'in sunduğu tüm hareketler değildir. Buradaki amaç, hızlı bir şekilde verimli hale gelmek için faydalı hareketleri tanıtmaktır. Daha fazla öğrenmek isterseniz, `:h motion.txt`'ye göz atın.

## Karakter Navigasyonu

En temel hareket bir karakteri sola, aşağı, yukarı ve sağa hareket ettirmektir.

```shell
h   Sola
j   Aşağı
k   Yukarı
l   Sağa
gj  Yumuşak sarılmış bir satırda aşağı
gk  Yumuşak sarılmış bir satırda yukarı
```

Yön okları ile de hareket edebilirsiniz. Eğer yeni başlıyorsanız, en rahat hissettiğiniz yöntemi kullanmaktan çekinmeyin.

Ben `hjkl`'yi tercih ediyorum çünkü sağ elim ev satırında kalabiliyor. Bunu yapmak, çevredeki tuşlara daha kısa bir erişim sağlıyor. `hjkl`'ye alışmak için, başlangıçta `~/.vimrc` dosyama şunları ekleyerek ok tuşlarını devre dışı bıraktım:

```shell
noremap <Up> <NOP>
noremap <Down> <NOP>
noremap <Left> <NOP>
noremap <Right> <NOP>
```

Bu kötü alışkanlığı kırmaya yardımcı olacak eklentiler de var. Bunlardan biri [vim-hardtime](https://github.com/takac/vim-hardtime). Şaşırtıcı bir şekilde, `hjkl`'ye alışmam bir haftadan az sürdü.

Vim'in neden `hjkl` kullandığını merak ediyorsanız, bunun nedeni Bill Joy'un Vi'yi yazdığı Lear-Siegler ADM-3A terminalinin ok tuşlarının olmaması ve `hjkl`'yi sola/aşağı/yukarı/sağa hareket etmek için kullanmasıdır.*

## Göreli Numaralandırma

`number` ve `relativenumber` ayarlarının olması faydalı olduğunu düşünüyorum. Bunu `.vimrc` dosyanıza şunları ekleyerek yapabilirsiniz:

```shell
set relativenumber number
```

Bu, mevcut satır numaramı ve göreli satır numaralarını gösterir.

Sol sütunda bir numara olmasının neden faydalı olduğunu anlamak kolaydır, ancak bazıları sol sütunda göreli numaraların olmasının nasıl faydalı olabileceğini sorabilir. Göreli bir numara, imleçimin hedef metne ne kadar uzak olduğunu hızlıca görmemi sağlar. Böylece, hedef metnimin 12 satır aşağıda olduğunu kolayca görebilir ve onları silmek için `d12j` yapabilirim. Aksi takdirde, 69. satırdaysam ve hedefim 81. satırdaysa, zihinsel hesaplama yapmam gerekir (81 - 69 = 12). Düzenleme yaparken matematik yapmak çok fazla zihinsel kaynak alır. Nereye gitmem gerektiğini düşünmem gereken durumların azalması daha iyidir.

Bu tamamen kişisel bir tercihtir. `relativenumber` / `norelativenumber`, `number` / `nonumber` ile denemeler yapın ve en faydalı bulduğunuzu kullanın!

## Hareketlerinizi Sayın

"count" argümanından bahsedelim. Vim hareketleri, önceden gelen bir sayısal argümanı kabul eder. Yukarıda `12j` ile 12 satır aşağı gidebileceğinizi belirttim. `12j`'deki 12, sayım numarasıdır.

Hareketinizle sayıyı kullanmanın sözdizimi:

```shell
[count] + motion
```

Bunu tüm hareketlere uygulayabilirsiniz. Eğer sağa 9 karakter hareket etmek istiyorsanız, `l` tuşuna 9 kez basmak yerine `9l` yapabilirsiniz.

## Kelime Navigasyonu

Daha büyük bir hareket birimine geçelim: *kelime*. Bir sonraki kelimenin başına (`w`), bir sonraki kelimenin sonuna (`e`), bir önceki kelimenin başına (`b`) ve bir önceki kelimenin sonuna (`ge`) gidebilirsiniz.

Ayrıca, kelimeden farklı olan *WORD* vardır. Bir sonraki WORD'ün başına (`W`), bir sonraki WORD'ün sonuna (`E`), bir önceki WORD'ün başına (`B`) ve bir önceki WORD'ün sonuna (`gE`) gidebilirsiniz. Hatırlamayı kolaylaştırmak için, WORD kelime ile aynı harfleri kullanır, sadece büyük harfle yazılır.

```shell
w     Bir sonraki kelimenin başına doğru ilerle
W     Bir sonraki WORD'ün başına doğru ilerle
e     Bir sonraki kelimenin sonuna doğru bir kelime ilerle
E     Bir sonraki WORD'ün sonuna doğru bir kelime ilerle
b     Bir önceki kelimenin başına doğru geri git
B     Bir önceki WORD'ün başına doğru geri git
ge    Bir önceki kelimenin sonuna doğru geri git
gE    Bir önceki WORD'ün sonuna doğru geri git
```

Peki, kelime ile WORD arasındaki benzerlikler ve farklılıklar nelerdir? Hem kelime hem de WORD boş karakterlerle ayrılır. Bir kelime, *sadece* `a-zA-Z0-9_` karakterlerini içeren bir karakter dizisidir. Bir WORD, boşluk dışındaki tüm karakterlerin bir dizisidir (boşluk, boşluk, sekme ve EOL anlamına gelir). Daha fazla bilgi için `:h word` ve `:h WORD`'e göz atın.

Örneğin, şöyle bir kodunuz olduğunu varsayalım:

```shell
const hello = "world";
```

İmleciniz satırın başındayken, `l` ile satırın sonuna gitmek 21 tuş vuruşu alır. `w` kullanarak 6 tuş vuruşu alır. `W` kullanarak ise sadece 4 tuş vuruşu alır. Hem kelime hem de WORD, kısa mesafelerde seyahat etmek için iyi seçeneklerdir.

Ancak, "c" harfinden ";" ye bir tuş vuruşuyla geçebilirsiniz.

## Mevcut Satır Navigasyonu

Düzenleme yaparken, genellikle bir satırda yatay olarak gezinmeniz gerekir. Mevcut satırdaki ilk karaktere atlamak için `0` kullanın. Mevcut satırdaki son karaktere gitmek için `$` kullanın. Ayrıca, mevcut satırdaki ilk boş olmayan karaktere gitmek için `^` ve mevcut satırdaki son boş olmayan karaktere gitmek için `g_` kullanabilirsiniz. Mevcut satırdaki `n` sütununa gitmek istiyorsanız, `n|` kullanabilirsiniz.

```shell
0     Mevcut satırdaki ilk karaktere git
^     Mevcut satırdaki ilk boş olmayan karaktere git
g_    Mevcut satırdaki son boş olmayan karaktere git
$     Mevcut satırdaki son karaktere git
n|    Mevcut satırdaki n sütununa git
```

Mevcut satırda arama yapmak için `f` ve `t` kullanabilirsiniz. `f` ve `t` arasındaki fark, `f`'nin eşleşmenin ilk harfine gitmesi ve `t`'nin eşleşmenin ilk harfine kadar (eşleşmenin hemen öncesine kadar) gitmesidir. Yani "h" aramak ve "h" üzerine gelmek istiyorsanız `fh` kullanın. İlk "h" aramak ve eşleşmenin hemen öncesine gelmek istiyorsanız `th` kullanın. Son mevcut satır aramasının *sonraki* eşleşmesine gitmek için `;` kullanın. Son mevcut satır eşleşmesinin önceki eşleşmesine gitmek için `,` kullanın.

`F` ve `T`, `f` ve `t`'nin geri yönlü karşıtlarıdır. "h" için geriye arama yapmak istiyorsanız `Fh` yazın. Aynı yönde "h" aramaya devam etmek için `;` kullanın. Not edin ki `Fh` sonrasında `;` geriye arama yapar ve `,` sonrasında ileriye arama yapar.

```shell
f    Aynı satırda bir eşleşme için ileriye arama yap
F    Aynı satırda bir eşleşme için geriye arama yap
t    Aynı satırda bir eşleşme için ileriye arama yap, eşleşmeden önce dur
T    Aynı satırda bir eşleşme için geriye arama yap, eşleşmeden önce dur
;    Aynı satırda son aramayı aynı yönde tekrarla
,    Aynı satırda son aramayı zıt yönde tekrarla
```

Önceki örneğe dönersek:

```shell
const hello = "world";
```

İmleciniz satırın başındayken, mevcut satırdaki son karaktere (";") bir tuş vuruşuyla gidebilirsiniz: `$`. "world" içindeki "w" harfine gitmek istiyorsanız `fw` kullanabilirsiniz. Bir satırda her yere gitmek için iyi bir ipucu, hedefinize yakın en az yaygın harfleri (örneğin "j", "x", "z") aramaktır.

## Cümle ve Paragraf Navigasyonu

Sonraki iki navigasyon birimi cümle ve paragraftır.

Öncelikle bir cümlenin ne olduğunu konuşalım. Bir cümle, bir EOL, bir boşluk veya bir sekme ile takip edilen `. ! ?` ile biter. Bir sonraki cümleye `)` ile, bir önceki cümleye `(` ile atlayabilirsiniz.

```shell
(    Önceki cümleye atla
)    Sonraki cümleye atla
```

Bazı örneklere bakalım. Hangi ifadelerin cümle olduğunu ve hangilerinin olmadığını düşünüyorsunuz? Vim'de `(` ve `)` ile gezinmeyi deneyin!

```shell
Ben bir cümleyim. Ben başka bir cümleyim çünkü bir nokta ile bitiyorum. Bir ünlem işareti ile bitince hala bir cümleyim! Peki ya soru işareti? Ben bir cümle değilim çünkü tire - ve ne noktalı virgül ; ne de iki nokta : var.

Üzerimde boş bir satır var.
```

Bu arada, eğer Vim'in `.` ile ayrılmış ifadeleri cümle olarak saymadığı bir sorun yaşıyorsanız, `'compatible'` modunda olabilirsiniz. `vimrc` dosyanıza `set nocompatible` ekleyin. Vi'de, bir cümle bir `.` ile **iki** boşluk ile takip edilir. Her zaman `nocompatible` ayarını yapmalısınız.

Bir paragrafın ne olduğunu konuşalım. Bir paragraf, her boş satırdan sonra başlar ve ayrıca paragraflar seçeneğindeki karakter çiftleriyle belirtilen her paragraf makrosunda başlar.

```shell
{    Önceki paragrafa atla
}    Sonraki paragrafa atla
```

Bir paragraf makrosunun ne olduğunu bilmiyorsanız endişelenmeyin. Önemli olan, bir paragrafın boş bir satırdan sonra başlar ve biter. Bu çoğu zaman doğru olmalıdır.

Bu örneğe bakalım. `}` ve `{` ile gezinmeyi deneyin (ayrıca, etrafta hareket etmek için cümle navigasyonları `( )` ile de oynayın!)

```shell
Merhaba. Nasılsınız? Ben harikayım, teşekkürler!
Vim harika.
Öğrenmek başlangıçta kolay olmayabilir... ama bu işte birlikteyiz. İyi şanslar!

Yine merhaba.

), (, }, ve { ile etrafta hareket etmeyi deneyin. Nasıl çalıştıklarını hissedin.
Bunu başardınız.
```

Daha fazla bilgi için `:h sentence` ve `:h paragraph`'a göz atın.

## Eşleşme Navigasyonu

Programcılar kod yazar ve düzenler. Kodlar genellikle parantez, süslü parantez ve köşeli parantez kullanır. İçinde kaybolmak kolaydır. Eğer birinin içindeyseniz, diğer çiftine (varsa) `%` ile atlayabilirsiniz. Ayrıca, eşleşen parantez, süslü parantez ve köşeli parantezlerinizin olup olmadığını kontrol etmek için bunu kullanabilirsiniz.

```shell
%    Diğer eşleşmeye git, genellikle () [] {}
```

Parantezleri yaygın olarak kullanan bir Scheme kod örneğine bakalım. Farklı parantezler içinde `%` ile hareket edin.

```shell
(define (fib n)
  (cond ((= n 0) 0)
        ((= n 1) 1)
        (else
          (+ (fib (- n 1)) (fib (- n 2)))
        )))
```

Ben kişisel olarak `%`'yi [vim-rainbow](https://github.com/frazrepo/vim-rainbow) gibi görsel göstergeler eklentileri ile tamamlamayı seviyorum. Daha fazla bilgi için `:h %`'ye göz atın.

## Satır Numarası Navigasyonu

`n` satır numarasına `nG` ile atlayabilirsiniz. Örneğin, 7. satıra atlamak istiyorsanız `7G` kullanın. İlk satıra atlamak için `1G` veya `gg` kullanabilirsiniz. Son satıra atlamak için `G` kullanın.

Çoğu zaman hedefinizin tam olarak hangi satır numarasını bilmezsiniz, ancak yaklaşık olarak dosyanın %70'inde olduğunu bilirsiniz. Bu durumda `70%` yapabilirsiniz. Dosyanın ortasına atlamak için `50%` yapabilirsiniz.

```shell
gg    İlk satıra git
G     Son satıra git
nG    n satırına git
n%    dosyada n% git
```

Bu arada, bir dosyadaki toplam satırları görmek istiyorsanız `Ctrl-g` kullanabilirsiniz.

## Pencere Navigasyonu

Hızla *pencerenizin* üstüne, ortasına veya altına gitmek için `H`, `M` ve `L` kullanabilirsiniz.

`H` ve `L`'ye bir sayı da verebilirsiniz. Eğer `10H` kullanırsanız, pencerenin üstünden 10 satır aşağı gidersiniz. `3L` kullanırsanız, pencerenin son satırından 3 satır yukarı gidersiniz.

```shell
H     Ekranın üstüne git
M     Ekranın ortasına git
L     Ekranın altına git
nH    Üstten n satır git
nL    Alttan n satır git
```

## Kaydırma

Kaydırmak için 3 hız artışınız vardır: tam ekran (`Ctrl-F/Ctrl-B`), yarım ekran (`Ctrl-D/Ctrl-U`) ve satır (`Ctrl-E/Ctrl-Y`).

```shell
Ctrl-E    Bir satır aşağı kaydır
Ctrl-D    Yarım ekran aşağı kaydır
Ctrl-F    Tam ekran aşağı kaydır
Ctrl-Y    Bir satır yukarı kaydır
Ctrl-U    Yarım ekran yukarı kaydır
Ctrl-B    Tam ekran yukarı kaydır
```

Ayrıca mevcut satıra göre göreli olarak kaydırabilirsiniz (ekran görünümünü yakınlaştırma):

```shell
zt    Mevcut satırı ekranınızın üstüne yakınlaştır
zz    Mevcut satırı ekranınızın ortasına yakınlaştır
zb    Mevcut satırı ekranınızın altına yakınlaştır
```
## Arama Navigasyonu

Genellikle bir ifadenin bir dosya içinde bulunduğunu bilirsiniz. Hedefinize çok hızlı bir şekilde ulaşmak için arama navigasyonunu kullanabilirsiniz. Bir ifadeyi aramak için `/` ile ileri arama yapabilir ve `?` ile geri arama yapabilirsiniz. Son aramayı tekrarlamak için `n` kullanabilirsiniz. Son aramayı ters yönde tekrarlamak için `N` kullanabilirsiniz.

```shell
/    Eşleşme için ileri ara
?    Eşleşme için geri ara
n    Önceki aramanın aynı yönünde son aramayı tekrarla
N    Önceki aramanın ters yönünde son aramayı tekrarla
```

Diyelim ki bu metne sahipsiniz:

```shell
let one = 1;
let two = 2;
one = "01";
one = "one";
let onetwo = 12;
```

Eğer "let" arıyorsanız, `/let` komutunu çalıştırın. "let"i tekrar hızlıca aramak için sadece `n` yapabilirsiniz. "let"i ters yönde tekrar aramak için `N` komutunu çalıştırın. Eğer `?let` komutunu çalıştırırsanız, "let"i geriye doğru arar. Eğer `n` kullanırsanız, şimdi "let"i geriye doğru arayacaktır (`N` şimdi "let"i ileri arayacaktır).

Arama vurgusunu `set hlsearch` ile etkinleştirebilirsiniz. Artık `/let` aradığınızda, dosyadaki *tüm* eşleşen ifadeleri vurgulayacaktır. Ayrıca, artan arama ayarlamak için `set incsearch` kullanabilirsiniz. Bu, yazarken deseni vurgular. Varsayılan olarak, eşleşen ifadeler başka bir ifadeyi arayana kadar vurgulanmış kalır. Bu hızlıca rahatsız edici hale gelebilir. Vurguyu devre dışı bırakmak için `:nohlsearch` veya basitçe `:noh` komutunu çalıştırabilirsiniz. Bu vurgusuz özelliği sıkça kullandığım için vimrc'de bir harita oluşturdum:

```shell
nnoremap <esc><esc> :noh<return><esc>
```

İmlecin altındaki metni hızlıca aramak için `*` ile ileri ve `#` ile geri arama yapabilirsiniz. İmleciniz "one" dizesindeyse, `*` tuşuna basmak, `/\<one\>` yapmışsınız gibi olacaktır.

`\<` ve `\>` her ikisi de `/\<one\>` içinde tam kelime aramasını ifade eder. Daha büyük bir kelimenin parçasıysa "one" ile eşleşmez. "one" kelimesi ile eşleşir ama "onetwo" ile eşleşmez. Eğer imleciniz "one" üzerindeyse ve "one" ve "onetwo" gibi tam veya kısmi kelimeleri eşleştirmek için ileri aramak istiyorsanız, `*` yerine `g*` kullanmalısınız.

```shell
*     İmlecin altındaki tam kelimeyi ileri ara
#     İmlecin altındaki tam kelimeyi geri ara
g*    İmlecin altındaki kelimeyi ileri ara
g#    İmlecin altındaki kelimeyi geri ara
```

## Pozisyonu İşaretleme

Mevcut pozisyonunuzu kaydetmek ve daha sonra bu pozisyona geri dönmek için işaretleri kullanabilirsiniz. Bu, metin düzenleme için bir yer imi gibidir. `mx` ile bir işaret ayarlayabilirsiniz; burada `x` herhangi bir alfabetik harf `a-zA-Z` olabilir. İşarete geri dönmenin iki yolu vardır: tam (satır ve sütun) ile `` `x`` ve satır bazında (`'x`).

```shell
ma    "a" işareti ile pozisyonu işaretle
`a    "a" işaretine satır ve sütuna atla
'a    "a" işaretine satıra atla
```

Küçük harflerle (a-z) ve büyük harflerle (A-Z) işaretleme arasında bir fark vardır. Küçük harfler yerel işaretlerdir ve büyük harfler küresel işaretlerdir (bazen dosya işaretleri olarak bilinir).

Yerel işaretlerden bahsedelim. Her tamponun kendi yerel işaret seti olabilir. Eğer iki dosya açtıysam, birinci dosyada "a" işareti (`ma`) koyabilir ve ikinci dosyada başka bir "a" işareti (`ma`) koyabilirim.

Yerel işaretlerin aksine, her tamponda bir işaret setine sahip olabileceğiniz küresel işaretler yalnızca bir set alırsınız. `myFile.txt` içinde `mA` ayarlarsanız, farklı bir dosyada `mA` çalıştırdığınızda, ilk "A" işaretini üzerine yazar. Küresel işaretlerin bir avantajı, tamamen farklı bir proje içinde olsanız bile herhangi bir küresel işarete atlayabilmenizdir. Küresel işaretler dosyalar arasında geçiş yapabilir.

Tüm işaretleri görüntülemek için `:marks` komutunu kullanın. İşaretler listesinden `a-zA-Z` dışında daha fazla işaret olduğunu fark edebilirsiniz. Bunlardan bazıları şunlardır:

```shell
''    Atlamadan önceki mevcut tamponun son satırına geri dön
``    Atlamadan önceki mevcut tamponun son pozisyonuna geri dön
`[    Daha önce değiştirilmiş / kopyalanmış metnin başlangıcına atla
`]    Daha önce değiştirilmiş / kopyalanmış metnin sonuna atla
`<    Son görsel seçimin başlangıcına atla
`>    Son görsel seçimin sonuna atla
`0    Vim'den çıkarken son düzenlenmiş dosyaya geri dön
```

Yukarıda listelenenlerden daha fazla işaret vardır. Bunları burada ele almayacağım çünkü nadiren kullanıldıklarını düşünüyorum, ama merak ediyorsanız `:h marks` kısmına bakabilirsiniz.

## Atlama

Vim'de, bazı hareketlerle farklı bir dosyaya veya dosyanın farklı bir kısmına "atlayabilirsiniz". Ancak tüm hareketler atlama olarak sayılmaz. `j` ile aşağı gitmek atlama olarak sayılmaz. `10G` ile 10. satıra gitmek atlama olarak sayılır.

Vim'in "atlama" komutları olarak kabul ettiği komutlar şunlardır:

```shell
'       İşaretli satıra git
`       İşaretli pozisyona git
G       Satıra git
 /      İleri ara
?       Geri ara
n       Son aramayı tekrarla, aynı yön
N       Son aramayı tekrarla, ters yön
%       Eşleşmeyi bul
(       Son cümleye git
)       Sonraki cümleye git
{       Son paragrafa git
}       Sonraki paragrafa git
L       Görüntülenen pencerenin son satırına git
M       Görüntülenen pencerenin orta satırına git
H       Görüntülenen pencerenin üst satırına git
[[      Önceki bölüme git
]]      Sonraki bölüme git
:s      Yerine koy
:tag    Etiket tanımına atla
```

Bu listeyi ezberlemenizi önermiyorum. İyi bir kural, bir kelimeden ve mevcut satır navigasyonundan daha uzak hareket eden herhangi bir hareketin muhtemelen bir atlama olduğu. Vim, etrafta hareket ettiğinizde nerede olduğunuzu takip eder ve bu listeyi `:jumps` içinde görebilirsiniz.

Daha fazla bilgi için `:h jump-motions` kısmına bakın.

Atlamalar neden faydalıdır? Çünkü atlama listesini yukarı hareket etmek için `Ctrl-O` ve aşağı hareket etmek için `Ctrl-I` ile gezinebilirsiniz. `hjkl` "atlama" komutları değildir, ancak hareketten önce mevcut konumu atlama listesine eklemek için `m'` kullanabilirsiniz. Örneğin, `m'5j` mevcut konumu atlama listesine ekler ve 5 satır aşağı gider, ve `Ctrl-O` ile geri dönebilirsiniz. Farklı dosyalar arasında atlayabilirsiniz, bunu bir sonraki bölümde daha fazla tartışacağım.

## Akıllı Bir Şekilde Navigasyonu Öğrenin

Eğer Vim'e yeniyseniz, öğrenilecek çok şey var. Kimsenin her şeyi hemen hatırlamasını beklemiyorum. Düşünmeden bunları uygulayabilmeniz için zaman alır.

Başlamak için birkaç temel hareketi ezberlemenin en iyi yol olduğunu düşünüyorum. Başlamak için bu 10 hareketle başlamanızı öneririm: `h, j, k, l, w, b, G, /, ?, n`. Bunları yeterince tekrar edin ki düşünmeden kullanabilirsiniz.

Navigasyon becerinizi geliştirmek için önerilerim şunlardır:
1. Tekrar eden eylemlere dikkat edin. Eğer kendinizi sürekli `l` yaparken buluyorsanız, sizi daha hızlı ileri götürecek bir hareket arayın. `w` kullanabileceğinizi göreceksiniz. Eğer kendinizi sürekli `w` yaparken buluyorsanız, mevcut satırda hızlıca geçiş yapacak bir hareket olup olmadığını kontrol edin. `f` kullanabileceğinizi göreceksiniz. İhtiyacınızı kısaca tanımlayabiliyorsanız, Vim'in bunu yapmanın bir yolunu bulma olasılığı yüksektir.
2. Yeni bir hareket öğrendiğinizde, düşünmeden yapana kadar biraz zaman harcayın.

Son olarak, üretken olmak için her bir Vim komutunu bilmeniz gerekmediğini anlayın. Çoğu Vim kullanıcısı bilmez. Ben de bilmiyorum. O anki görevinizi yerine getirmenize yardımcı olacak komutları öğrenin.

Zamanınızı alın. Navigasyon becerisi Vim'de çok önemli bir beceridir. Her gün bir küçük şeyi öğrenin ve bunu iyi öğrenin.