---
description: Vim'de metinleri verimli bir şekilde manipüle etmek için görsel modun
  nasıl kullanılacağını öğrenin. Üç farklı görsel mod hakkında bilgi edinin.
title: Ch11. Visual Mode
---

Metin vurgulama ve değişiklik uygulama, birçok metin düzenleyici ve kelime işlemci için yaygın bir özelliktir. Vim, bunu görsel mod kullanarak yapabilir. Bu bölümde, metinleri verimli bir şekilde manipüle etmek için görsel modu nasıl kullanacağınızı öğreneceksiniz.

## Üç Tür Görsel Mod

Vim'in üç farklı görsel modu vardır. Bunlar:

```shell
v         Karakter bazlı görsel mod
V         Satır bazlı görsel mod
Ctrl-V    Blok bazlı görsel mod
```

Eğer metniniz şu ise:

```shell
bir
iki
üç
```

Karakter bazlı görsel mod, bireysel karakterlerle çalışır. İlk karaktere `v` tuşuna basın. Ardından `j` ile bir sonraki satıra inin. "bir"den imleç konumunuza kadar olan tüm metinleri vurgular. `gU` tuşuna basarsanız, Vim vurgulanan karakterleri büyük harfe çevirir.

Satır bazlı görsel mod, satırlarla çalışır. `V` tuşuna basın ve Vim'in imlecinizin bulunduğu tüm satırı seçtiğini görün. Karakter bazlı görsel modda olduğu gibi, `gU` komutunu çalıştırırsanız, Vim vurgulanan karakterleri büyük harfe çevirir.

Blok bazlı görsel mod, satır ve sütunlarla çalışır. Diğer iki moddan daha fazla hareket özgürlüğü sağlar. `Ctrl-V` tuşuna basarsanız, Vim, karakter bazlı görsel modda olduğu gibi imlecin altındaki karakteri vurgular, ancak her karakteri vurgulamak yerine, bir sonraki satıra geçerken minimum vurgulama ile hareket eder. `h/j/k/l` ile hareket etmeyi deneyin ve imlecin nasıl hareket ettiğini izleyin.

Vim penceresinin sol alt köşesinde, hangi görsel modda olduğunuzu belirtmek için `-- GÖRSEL --`, `-- GÖRSEL SATIR --` veya `-- GÖRSEL BLOK --` görüntülenecektir.

Görsel moddayken, başka bir görsel moda geçmek için `v`, `V` veya `Ctrl-V` tuşlarına basabilirsiniz. Örneğin, satır bazlı görsel moddaysanız ve blok bazlı görsel moda geçmek istiyorsanız, `Ctrl-V` tuşuna basın. Deneyin!

Görsel moddan çıkmanın üç yolu vardır: `<Esc>`, `Ctrl-C` ve mevcut görsel modunuzla aynı tuş. İkincisi, eğer şu anda satır bazlı görsel moddaysanız (`V`), tekrar `V` tuşuna basarak çıkabileceğiniz anlamına gelir. Eğer karakter bazlı görsel moddaysanız, `v` tuşuna basarak çıkabilirsiniz.

Aslında görsel moda girmek için bir yol daha vardır:

```shell
gv    Önceki görsel moda git
```

Bu, son sefer yaptığınız gibi aynı vurgulanan metin bloğunda aynı görsel modu başlatır.

## Görsel Mod Navigasyonu

Görsel moddayken, vurgulanan metin bloğunu Vim hareketleri ile genişletebilirsiniz.

Daha önce kullandığınız aynı metni kullanalım:

```shell
bir
iki
üç
```

Bu sefer "iki" satırından başlayalım. Karakter bazlı görsel moda geçmek için `v` tuşuna basın (burada köşeli parantezler `[]` karakter vurgularını temsil eder):

```shell
bir
[i]ki
üç
```

`j` tuşuna basın ve Vim, "iki" satırından "üç" satırının ilk karakterine kadar olan tüm metni vurgular.

```shell
bir
[iki
i]ç
```

Bu konumdan "bir" satırını da eklemek istiyorsanız, `k` tuşuna basarsanız, vurgunun "üç" satırından uzaklaştığını göreceksiniz.

```shell
bir
[i]ki
üç
```

Görsel seçimi istediğiniz yönde serbestçe genişletmenin bir yolu var mı? Kesinlikle. "iki" ve "üç" satırlarının vurgulandığı yere biraz geri gidelim.

```shell
bir
[iki
i]ç    <-- imleç
```

Görsel vurgulama, imleç hareketini takip eder. Yukarı doğru "bir" satırına genişletmek istiyorsanız, imleci "iki" satırına yukarı hareket ettirmeniz gerekir. Şu anda imleç "üç" satırında. İmleç konumunu `o` veya `O` ile değiştirebilirsiniz.

```shell
bir
[iki     <-- imleç
i]ç
```

Artık `k` tuşuna bastığınızda, seçimi azaltmak yerine yukarı doğru genişletir.

```shell
[bir
iki
i]ç
```

Görsel modda `o` veya `O` ile imleç, vurgulanan bloğun başından sonuna atlar ve vurgulama alanını genişletmenizi sağlar.

## Görsel Mod Grameri

Görsel mod, normal mod ile birçok işlemi paylaşır.

Örneğin, aşağıdaki metne sahipseniz ve görsel moddan ilk iki satırı silmek istiyorsanız:

```shell
bir
iki
üç
```

"bir" ve "iki" satırlarını satır bazlı görsel mod ile vurgulayın (`V`):

```shell
[bir
iki]
üç
```

`d` tuşuna basmak, normal modda olduğu gibi seçimi siler. Normal moddan gelen gramer kuralının, fiil + isim, geçerli olmadığını unutmayın. Aynı fiil hala orada (`d`), ancak görsel modda bir isim yoktur. Görsel moddaki gramer kuralı isim + fiil şeklindedir; burada isim vurgulanan metindir. Önce metin bloğunu seçin, ardından komut gelir.

Normal modda, imlecin altındaki tek bir karakteri silmek için `x` gibi hareket gerektirmeyen bazı komutlar vardır ve `r` imlecin altındaki karakteri değiştirmek için kullanılır (`rx`, imlecin altındaki karakteri "x" ile değiştirir). Görsel modda, bu komutlar artık tek bir karakter yerine tüm vurgulanan metne uygulanır. Vurgulanan metne geri dönersek:

```shell
[bir
iki]
üç
```

`x` çalıştırmak, tüm vurgulanan metinleri siler.

Bu davranışı, markdown metninde hızlıca bir başlık oluşturmak için kullanabilirsiniz. Diyelim ki aşağıdaki metni birinci seviye markdown başlığına ("===") hızlıca dönüştürmek istiyorsunuz:

```shell
Bölüm Bir
```

Önce metni `yy` ile kopyalayın, ardından `p` ile yapıştırın:

```shell
Bölüm Bir
Bölüm Bir
```

Şimdi, ikinci satıra gidin ve satır bazlı görsel mod ile seçin:

```shell
Bölüm Bir
[Bölüm Bir]
```

Birinci seviye başlık, bir metnin altında bir dizi "=" ile oluşturulur. `r=` tuşuna basın, işte bu kadar! Bu, "=" karakterini manuel olarak yazmaktan sizi kurtarır.

```shell
Bölüm Bir
===========
```

Görsel modda operatörler hakkında daha fazla bilgi için `:h visual-operators` komutuna göz atın.

## Görsel Mod ve Komut Satırı Komutları

Vurgulanan metin bloğuna komut satırı komutlarını seçerek uygulayabilirsiniz. Eğer bu ifadeleriniz varsa ve "const" kelimesini yalnızca ilk iki satırda "let" ile değiştirmek istiyorsanız:

```shell
const bir = "bir";
const iki = "iki";
const üç = "üç";
```

İlk iki satırı *herhangi* bir görsel mod ile vurgulayın ve `:s/const/let/g` değiştirme komutunu çalıştırın:

```shell
let bir = "bir";
let iki = "iki";
const üç = "üç";
```

Bunu *herhangi* bir görsel modda yapabileceğinizi belirttim. O satırda komutu çalıştırmak için tüm satırı vurgulamanıza gerek yok. Her satırda en az bir karakter seçtiğiniz sürece, komut uygulanır.

## Birden Fazla Satıra Metin Ekleme

Vim'de blok bazlı görsel mod kullanarak birden fazla satıra metin ekleyebilirsiniz. Her satırın sonuna bir noktalı virgül eklemek istiyorsanız:

```shell
const bir = "bir"
const iki = "iki"
const üç = "üç"
```

İmlecinizi ilk satıra yerleştirin:
- Blok bazlı görsel modda çalıştırın ve iki satıra inin (`Ctrl-V jj`).
- Satırın sonuna kadar vurgulayın (`$`).
- Ekleyin (`A`) ve ardından ";" yazın.
- Görsel moddan çıkın (`<Esc>`).

Artık her satırda eklenen ";" karakterini görmelisiniz. Oldukça havalı! Blok bazlı görsel moddan ekleme moduna girmek için iki yol vardır: `A` imlecin ardından metin girmek için veya `I` imlecin önüne metin girmek için. Bunları normal moddan `A` (satırın sonuna metin eklemek) ve `I` (ilk boş olmayan satırdan önce metin eklemek) ile karıştırmayın.

Alternatif olarak, birden fazla satıra metin eklemek için `:normal` komutunu da kullanabilirsiniz:
- Tüm 3 satırı vurgulayın (`vjj`).
- `:normal! A;` yazın.

Unutmayın, `:normal` komutu normal mod komutlarını çalıştırır. `A;` komutunu çalıştırarak satırın sonuna ";" metnini eklemesini sağlayabilirsiniz.

## Sayıları Artırma

Vim, sayıları azaltmak ve artırmak için `Ctrl-X` ve `Ctrl-A` komutlarına sahiptir. Görsel mod ile kullanıldığında, birden fazla satırdaki sayıları artırabilirsiniz.

Eğer şu HTML elemanlarına sahipseniz:

```shell
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
```

Aynı ada sahip birkaç id'ye sahip olmak kötü bir uygulamadır, bu yüzden bunları artırarak benzersiz hale getirelim:
- İmlecinizi ikinci satırdaki "1" üzerine getirin.
- Blok bazlı görsel modda başlayın ve 3 satıra inin (`Ctrl-V 3j`). Bu, kalan "1"leri vurgular. Artık tüm "1"ler vurgulanmış olmalıdır (ilk satır hariç).
- `g Ctrl-A` komutunu çalıştırın.

Aşağıdaki sonucu görmelisiniz:

```shell
<div id="app-1"></div>
<div id="app-2"></div>
<div id="app-3"></div>
<div id="app-4"></div>
<div id="app-5"></div>
```

`g Ctrl-A`, birden fazla satırdaki sayıları artırır. `Ctrl-X/Ctrl-A`, harfleri de artırabilir, sayı formatları seçeneği ile:

```shell
set nrformats+=alpha
```

`nrformats` seçeneği, Vim'e `Ctrl-A` ve `Ctrl-X` ile artırılıp azaltılacak "sayılara" hangi tabanların dahil edileceğini belirtir. `alpha` ekleyerek, bir alfabetik karakter artık bir sayı olarak kabul edilir. Eğer şu HTML elemanlarına sahipseniz:

```shell
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
```

İkinci "app-a" üzerine imlecinizi yerleştirin. Yukarıdaki gibi aynı tekniği kullanarak (`Ctrl-V 3j` ardından `g Ctrl-A`) id'leri artırın.

```shell
<div id="app-a"></div>
<div id="app-b"></div>
<div id="app-c"></div>
<div id="app-d"></div>
<div id="app-e"></div>
```

## Son Görsel Mod Alanını Seçme

Bu bölümde daha önce `gv` komutunun son görsel mod vurgusunu hızlıca vurgulayabileceğini belirtmiştim. Ayrıca son görsel modun başlangıç ve bitiş konumuna bu iki özel işaret ile gidebilirsiniz:

```shell
`<    Önceki görsel mod vurgusunun ilk yerine git
`>    Önceki görsel mod vurgusunun son yerine git
```

Daha önce, vurgulanan metin üzerinde `:s/const/let/g` gibi komut satırı komutlarını seçerek çalıştırabileceğinizi de belirtmiştim. Bunu yaptığınızda, aşağıdakini göreceksiniz:

```shell
:`<,`>s/const/let/g
```

Aslında, *aralıklı* `s/const/let/g` komutunu (iki işaret adres olarak) çalıştırıyordunuz. İlginç!

Bu işaretleri istediğiniz zaman düzenleyebilirsiniz. Eğer vurgulanan metnin başlangıcından dosyanın sonuna kadar değiştirmek istiyorsanız, komutu şu şekilde değiştirebilirsiniz:

```shell
:`<,$s/const/let/g
```

## Ekleme Modundan Görsel Moda Geçiş

Ayrıca ekleme modundan görsel moda geçebilirsiniz. Ekleme modundayken karakter bazlı görsel moda geçmek için:

```shell
Ctrl-O v
```

Ekleme modundayken `Ctrl-O` çalıştırmanın, normal mod komutunu çalıştırmanıza izin verdiğini hatırlayın. Bu normal-mod-komutu-bekleyen moddayken, karakter bazlı görsel moda girmek için `v` tuşuna basın. Ekranın sol alt köşesinde `--(ekleme) GÖRSEL--` yazdığını göreceksiniz. Bu hile, herhangi bir görsel mod operatörü ile çalışır: `v`, `V` ve `Ctrl-V`.

## Seçim Modu

Vim'in, görsel moda benzer bir modu olan seçim modu vardır. Görsel mod gibi, üç farklı modu da vardır:

```shell
gh         Karakter bazlı seçim modu
gH         Satır bazlı seçim modu
gCtrl-h    Blok bazlı seçim modu
```

Seçim modu, bir düzenleyicinin metin vurgulama davranışını, Vim'in görsel moduna göre daha yakın bir şekilde taklit eder.

Normal bir düzenleyicide, bir metin bloğunu vurguladıktan sonra bir harf yazdığınızda, örneğin "y" harfi, vurgulanan metni siler ve "y" harfini ekler. Eğer satır bazlı seçim modunda (`gH`) bir satırı vurgularsanız ve "y" yazarsanız, vurgulanan metni siler ve "y" harfini ekler.

Bu seçim modunu görsel mod ile karşılaştırın: Eğer satır bazlı görsel modda (`V`) bir metin satırını vurgularsanız ve "y" yazarsanız, vurgulanan metin silinmez ve "y" harfi ile değiştirilmez, yankılanır. Seçim modunda vurgulanan metin üzerinde normal mod komutlarını çalıştıramazsınız.

Ben şahsen seçim modunu hiç kullanmadım, ama var olduğunu bilmek iyi.

## Görsel Modu Akıllıca Öğrenin

Görsel mod, Vim'in metin vurgulama prosedürünün temsilidir.

Eğer kendinizi görsel mod işlemlerini normal mod işlemlerinden çok daha sık kullanırken buluyorsanız, dikkatli olun. Bu bir anti-patern. Görsel mod işlemini çalıştırmak, normal mod karşılığına göre daha fazla tuş vuruşu gerektirir. Örneğin, iç bir kelimeyi silmeniz gerekiyorsa, neden dört tuş vuruşu kullanıyorsunuz, `viwd` (görsel olarak iç bir kelimeyi vurgulayıp sonra silmek) yerine sadece üç tuş vuruşu ile (`diw`) bunu başaramıyorsunuz? İkincisi daha doğrudan ve özlüdür. Elbette, görsel modların uygun olduğu zamanlar olacaktır, ancak genel olarak daha doğrudan bir yaklaşımı tercih edin.