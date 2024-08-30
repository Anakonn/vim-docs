---
description: Bu belge, Vim'de arama ve değiştirme işlemlerini, düzenli ifadelerle
  nasıl etkili bir şekilde kullanacağınızı anlatmaktadır.
title: Ch12. Search and Substitute
---

Bu bölüm, ayrı ama ilgili iki kavramı kapsar: arama ve değiştirme. Düzenleme yaparken, genellikle en az ortak payda desenlerine dayalı olarak birden fazla metni aramanız gerekir. Düzenli ifadeleri arama ve değiştirme işlemlerinde literal dizeler yerine kullanmayı öğrenerek, herhangi bir metni hızlı bir şekilde hedefleyebilirsiniz.

Bir yan not olarak, bu bölümde arama yaparken `/` kullanacağım. `/` ile yapabileceğiniz her şeyi `?` ile de yapabilirsiniz.

## Akıllı Büyük/Küçük Harf Duyarlılığı

Arama teriminin büyük/küçük harf duyarlılığını eşleştirmek zor olabilir. "Learn Vim" metnini arıyorsanız, bir harfin büyük/küçük harfini yanlış yazmanız durumunda yanlış bir arama sonucu alabilirsiniz. Herhangi bir durumu eşleştirmenin daha kolay ve güvenli olacağını düşünmüyor musunuz? İşte burada `ignorecase` seçeneği devreye giriyor. Vimrc dosyanıza `set ignorecase` ekleyin ve tüm arama terimleriniz büyük/küçük harf duyarsız hale gelir. Artık `/Learn Vim` yazmanıza gerek yok, `/learn vim` de çalışacaktır.

Ancak, bazen belirli bir büyük/küçük harf ile arama yapmanız gerekir. Bunu yapmanın bir yolu, `set noignorecase` komutunu çalıştırarak `ignorecase` seçeneğini kapatmaktır, ancak bu, büyük/küçük harf duyarlı bir ifadeyi aramanız gerektiğinde her seferinde açıp kapatmak için çok fazla iş demektir.

`ignorecase`'i açıp kapatmak zorunda kalmamak için, Vim, arama deseni *en az bir büyük harf içeriyorsa* büyük/küçük harf duyarsız dize aramak için `smartcase` seçeneğine sahiptir. Tüm küçük harf karakterleri girdiğinizde büyük/küçük harf duyarsız bir arama, bir veya daha fazla büyük harf karakteri girdiğinizde ise büyük/küçük harf duyarlı bir arama gerçekleştirmek için `ignorecase` ve `smartcase` seçeneklerini birleştirebilirsiniz.

Vimrc dosyanıza şunu ekleyin:

```shell
set ignorecase smartcase
```

Bu metinlere sahipseniz:

```shell
hello
HELLO
Hello
```

- `/hello` "hello", "HELLO" ve "Hello" ile eşleşir.
- `/HELLO` yalnızca "HELLO" ile eşleşir.
- `/Hello` yalnızca "Hello" ile eşleşir.

Bir dezavantaj var. Peki ya yalnızca küçük harfli bir dize aramanız gerekiyorsa? `/hello` yaptığınızda, Vim artık büyük/küçük harf duyarsız bir arama yapar. Vim'e sonraki arama teriminin büyük/küçük harf duyarlı olacağını belirtmek için arama teriminizde herhangi bir yere `\C` desenini kullanabilirsiniz. Eğer `/\Chello` yaparsanız, bu "hello" ile kesin olarak eşleşir, "HELLO" veya "Hello" ile değil.

## Bir Satırdaki İlk ve Son Karakter

Bir satırdaki ilk karakteri eşleştirmek için `^` ve son karakteri eşleştirmek için `$` kullanabilirsiniz.

Eğer bu metne sahipseniz:

```shell
hello hello
```

İlk "hello"yu hedeflemek için `/^hello` kullanabilirsiniz. `^`'den sonra gelen karakter, bir satırdaki ilk karakter olmalıdır. Son "hello"yu hedeflemek için `/hello$` komutunu çalıştırın. `$`'den önceki karakter, bir satırdaki son karakter olmalıdır.

Eğer bu metne sahipseniz:

```shell
hello hello friend
```

`/hello$` çalıştırdığınızda hiçbir şey eşleşmeyecektir çünkü "friend" o satırdaki son terimdir, "hello" değil.

## Aramayı Tekrar Etme

Önceki aramayı `//` ile tekrarlayabilirsiniz. Eğer `/hello` araması yaptıysanız, `//` çalıştırmak `/hello` çalıştırmaya eşdeğerdir. Bu kısayol, özellikle uzun bir dize aradıysanız bazı tuş vuruşlarından tasarruf etmenizi sağlar. Ayrıca, son aramayı aynı yönde ve ters yönde tekrar etmek için `n` ve `N` kullanabileceğinizi unutmayın.

Peki ya son *n* arama terimini hızlıca hatırlamak isterseniz? Arama geçmişini hızlıca geçmek için önce `/` tuşuna basın, ardından aradığınız terimi bulana kadar `yukarı`/`aşağı` ok tuşlarına (veya `Ctrl-N`/`Ctrl-P`) basın. Tüm arama geçmişinizi görmek için `:history /` komutunu çalıştırabilirsiniz.

Bir dosyanın sonuna ulaştığınızda, Vim bir hata verir: `"Search hit the BOTTOM without match for: {your-search}"`. Bazen bu, aşırı aramadan korunmak için iyi bir önlem olabilir, ancak diğer zamanlarda aramayı tekrar başa döndürmek isteyebilirsiniz. Dosyanın sonuna ulaştığınızda Vim'in dosyanın en üstüne geri arama yapmasını sağlamak için `set wrapscan` seçeneğini kullanabilirsiniz. Bu özelliği kapatmak için `set nowrapscan` yapın.

## Alternatif Kelimeleri Arama

Birden fazla kelimeyi aynı anda aramak yaygındır. Eğer "hello vim" veya "hola vim" aramak istiyorsanız, ancak "salve vim" veya "bonjour vim" aramak istemiyorsanız, `|` desenini kullanabilirsiniz.

Bu metin verildiğinde:

```shell
hello vim
hola vim
salve vim
bonjour vim
```

Hem "hello" hem de "hola" ile eşleşmek için `/hello\|hola` yapabilirsiniz. `|` operatörünü kaçırmalısınız (`\`), aksi takdirde Vim literal olarak "|" dizesini arar.

Her seferinde `\|` yazmak istemiyorsanız, aramanın başında `magic` sözdizimini (`\v`) kullanabilirsiniz: `/\vhello|hola`. Bu kılavuzda `magic` konusunu ele almayacağım, ancak `\v` ile özel karakterleri artık kaçırmanıza gerek yok. `\v` hakkında daha fazla bilgi edinmek isterseniz, `:h \v`'yi kontrol edebilirsiniz.

## Eşleşmenin Başını ve Sonunu Ayarlama

Belki de bir bileşik kelimenin parçası olan bir metni aramanız gerekiyor. Eğer bu metinlere sahipseniz:

```shell
11vim22
vim22
11vim
vim
```

"vim"i yalnızca "11" ile başladığında ve "22" ile bittiğinde seçmek istiyorsanız, `\zs` (başlangıç eşleşmesi) ve `\ze` (bitiş eşleşmesi) operatörlerini kullanabilirsiniz. Şunu çalıştırın:

```shell
/11\zsvim\ze22
```

Vim hala "11vim22" deseninin tamamını eşleştirmek zorundadır, ancak yalnızca `\zs` ve `\ze` arasında sıkışmış deseni vurgular. Başka bir örnek:

```shell
foobar
foobaz
```

"foobar"da "foo"yu eşleştirmek, ancak "foobaz"da eşleştirmek istiyorsanız, şunu çalıştırın:

```shell
/foo\zebaz
```

## Karakter Aralıklarını Arama

Şu ana kadar tüm arama terimleriniz literal bir kelime aramasıydı. Gerçek hayatta, metninizi bulmak için genel bir desen kullanmanız gerekebilir. En temel desen, karakter aralığıdır, `[ ]`.

Herhangi bir rakamı aramak istiyorsanız, her seferinde `/0\|1\|2\|3\|4\|5\|6\|7\|8\|9\|0` yazmak istemezsiniz. Bunun yerine, tek bir rakamı eşleştirmek için `/[0-9]` kullanın. `0-9` ifadesi, Vim'in eşleştirmeye çalışacağı 0-9 aralığını temsil eder, bu nedenle 1 ile 5 arasındaki rakamları arıyorsanız, `/[1-5]` kullanın.

Rakamlar, Vim'in arayabileceği tek veri türü değildir. Küçük harfli alfabeyi aramak için `/[a-z]` ve büyük harfli alfabeyi aramak için `/[A-Z]` kullanabilirsiniz.

Bu aralıkları birleştirebilirsiniz. Eğer 0-9 rakamlarını ve "a" ile "f" arasındaki hem küçük hem de büyük harfleri aramak istiyorsanız (hex gibi), `/[0-9a-fA-F]` yapabilirsiniz.

Negatif bir arama yapmak için, karakter aralığı parantezlerinin içine `^` ekleyebilirsiniz. Bir rakam olmayanı aramak için `/[^0-9]` çalıştırın. Vim, bir karakterin rakam olmaması koşuluyla herhangi bir karakteri eşleştirecektir. Dikkat edin ki, aralık parantezlerinin içindeki caret (`^`), bir satırın başındaki caret'ten farklıdır (örneğin: `/^hello`). Eğer bir caret, bir çift parantez dışında ve arama teriminde ilk karakter olarak yer alıyorsa, "bir satırdaki ilk karakter" anlamına gelir. Eğer bir caret, bir çift parantez içinde ve parantezlerin içindeki ilk karakter olarak yer alıyorsa, bu bir negatif arama operatörüdür. `/^abc` bir satırdaki ilk "abc" ile eşleşir ve `/[^abc]` "a", "b" veya "c" dışında herhangi bir karakterle eşleşir.

## Tekrarlayan Karakterleri Arama

Eğer bu metinde çift rakamları aramanız gerekiyorsa:

```shell
1aa
11a
111
```

İki basamaklı bir karakteri eşleştirmek için `/[0-9][0-9]` kullanabilirsiniz, ancak bu yöntem ölçeklenebilir değildir. Yirmi rakamı eşleştirmek istiyorsanız, `[0-9]`'u yirmi kez yazmak eğlenceli bir deneyim değildir. Bu yüzden bir `count` argümanı kullanmanız gerekir.

Aramanıza `count` geçirebilirsiniz. Aşağıdaki sözdizimine sahiptir:

```shell
{n,m}
```

Bu arada, bu `count` parantezleri Vim'de kullanırken kaçırılmalıdır. `count` operatörü, artırmak istediğiniz tek bir karakterin arkasına yerleştirilir.

`count` sözdiziminin dört farklı varyasyonu vardır:
- `{n}` kesin eşleşmedir. `/[0-9]\{2\}` iki basamaklı sayıları eşleştirir: "11" ve "111" içindeki "11".
- `{n,m}` bir aralık eşleşmesidir. `/[0-9]\{2,3\}` 2 ile 3 basamaklı sayılar arasında eşleşir: "11" ve "111".
- `{,m}` bir üst eşleşmedir. `/[0-9]\{,3\}` 3 basamaklı sayılara kadar eşleşir: "1", "11" ve "111".
- `{n,}` en az eşleşmedir. `/[0-9]\{2,\}` en az 2 veya daha fazla basamaklı sayıları eşleştirir: "11" ve "111".

`count` argümanları `\{0,\}` (sıfır veya daha fazla) ve `\{1,\}` (bir veya daha fazla) yaygın arama desenleridir ve Vim'in bunlar için özel operatörleri vardır: `*` ve `+` (`+` kaçırılmalıdır, ancak `*` kaçırılmadan çalışır). Eğer `/[0-9]*` yaparsanız, bu `/[0-9]\{0,\}` ile aynıdır. Sıfır veya daha fazla rakamı arar. "", "1", "123" ile eşleşir. Bu arada, "a" harfinde teknik olarak sıfır rakam olduğu için "a" gibi rakam olmayanları da eşleştirir. `*` kullanmadan önce dikkatlice düşünün. Eğer `/[0-9]\+` yaparsanız, bu `/[0-9]\{1,\}` ile aynıdır. Bir veya daha fazla rakamı arar. "1" ve "12" ile eşleşir.

## Ön Tanımlı Karakter Aralıkları

Vim, rakamlar ve alfabedeki yaygın karakterler için ön tanımlı aralıklara sahiptir. Burada her birini ele almayacağım, ancak tam listeyi `:h /character-classes` içinde bulabilirsiniz. İşte faydalı olanlar:

```shell
\d    Rakam [0-9]
\D    Rakam olmayan [^0-9]
\s    Boşluk karakteri (boşluk ve sekme)
\S    Boşluk olmayan karakter (boşluk ve sekme hariç her şey)
\w    Kelime karakteri [0-9A-Za-z_]
\l    Küçük harfli alfabeyi [a-z]
\u    Büyük harfli karakter [A-Z]
```

Bunları karakter aralıkları gibi kullanabilirsiniz. Herhangi bir tek rakamı aramak için `/[0-9]` yerine `/\d` kullanabilirsiniz.

## Arama Örneği: Benzer Karakterler Arasındaki Metni Yakalama

Bir çift tırnak içinde çevrelenmiş bir ifadeyi aramak istiyorsanız:

```shell
"Vim harika!"
```

Şunu çalıştırın:

```shell
/"[^"]\+"
```

Bunu parçalayalım:
- `"` bir literal çift tırnaktır. İlk çift tırnağı eşleştirir.
- `[^"]` bir çift tırnak hariç herhangi bir karakter anlamına gelir. Bir çift tırnak olmayan her alfanümerik ve boşluk karakterini eşleştirir.
- `\+` bir veya daha fazladır. `[^"]`'den önce geldiği için, Vim bir veya daha fazla çift tırnak olmayan karakter arar.
- `"` bir literal çift tırnaktır. Kapanış çift tırnağı eşleştirir.

Vim ilk `"`'yi gördüğünde, desen yakalamaya başlar. Bir satırda ikinci çift tırnağı gördüğü anda, ikinci `"` desenini eşleştirir ve desen yakalamayı durdurur. Bu arada, aradaki tüm çift tırnak olmayan karakterler `[^"]\+` deseni tarafından yakalanır; bu durumda, ifade `Vim harika!` olur. Bu, benzer sınırlayıcılar arasında çevrelenmiş bir ifadeyi yakalamak için yaygın bir desendir.

- Tek tırnaklar arasında çevrelenmiş bir ifadeyi yakalamak için `/'[^']\+'` kullanabilirsiniz.
- Sıfırlar arasında çevrelenmiş bir ifadeyi yakalamak için `/0[^0]\+0` kullanabilirsiniz.

## Arama Örneği: Telefon Numarasını Yakalama

Bir tire (`-`) ile ayrılmış bir ABD telefon numarasını eşleştirmek istiyorsanız, örneğin `123-456-7890`, şunu kullanabilirsiniz:

```shell
/\d\{3\}-\d\{3\}-\d\{4\}
```

ABD telefon numarası, üç basamaklı bir rakam seti, ardından başka üç rakam ve sonunda dört rakamdan oluşur. Bunu parçalayalım:
- `\d\{3\}` tam olarak üç kez tekrarlanan bir rakamı eşleştirir.
- `-` bir literal tire.

Kaçırmaları önlemek için `\v` ile kullanabilirsiniz:

```shell
/\v\d{3}-\d{3}-\d{4}
```

Bu desen, IP adresleri ve posta kodları gibi tekrarlayan rakamları yakalamak için de faydalıdır.

Bu bölümün arama kısmını kapsar. Şimdi değiştirme kısmına geçelim.

## Temel Değiştirme

Vim'in değiştirme komutu, herhangi bir deseni hızlı bir şekilde bulup değiştirmek için kullanışlı bir komuttur. Değiştirme sözdizimi:

```shell
:s/{eski-desen}/{yeni-desen}/
```

Temel bir kullanım ile başlayalım. Eğer bu metne sahipseniz:

```shell
vim iyidir
```

"iyidir"i "harika" ile değiştirelim çünkü Vim harika. `:s/iyidir/harika/` komutunu çalıştırın. Şunu görmelisiniz:

```shell
vim harika
```
## Son Değiştirmeyi Tekrar Etme

Son değiştirme komutunu normal komut `&` veya `:s` ile tekrar edebilirsiniz. Eğer `:s/good/awesome/` komutunu çalıştırdıysanız, `&` veya `:s` komutunu çalıştırmak bunu tekrar eder.

Ayrıca, bu bölümün başında, önceki arama desenini tekrar etmek için `//` kullanabileceğinizi belirtmiştim. Bu hile, değiştirme komutuyla da çalışır. Eğer `/good` yakın zamanda yapıldıysa ve ilk değiştirme desen argümanını boş bırakırsanız, `:s//awesome/` gibi, bu `:s/good/awesome/` komutunu çalıştırmakla aynı şekilde çalışır.

## Değiştirme Aralığı

Birçok Ex komutunda olduğu gibi, değiştirme komutuna bir aralık argümanı geçirebilirsiniz. Söz dizimi:

```shell
:[aralık]s/eski/yeni/
```

Eğer bu ifadeleriniz varsa:

```shell
let one = 1;
let two = 2;
let three = 3;
let four = 4;
let five = 5;
```

Üçüncü ile beşinci satırlardaki "let" ifadesini "const" ile değiştirmek için şunu yapabilirsiniz:

```shell
:3,5s/let/const/
```

Geçirebileceğiniz bazı aralık varyasyonları:

- `:,3s/let/const/` - virgülden önce hiçbir şey verilmezse, mevcut satırı temsil eder. Mevcut satırdan satır 3'e kadar değiştirir.
- `:1,s/let/const/` - virgülden sonra hiçbir şey verilmezse, bu da mevcut satırı temsil eder. Satır 1'den mevcut satıra kadar değiştirir.
- `:3s/let/const/` - yalnızca bir değer aralık olarak verilirse (virgül yoksa), yalnızca o satırda değişiklik yapar.

Vim'de, `%` genellikle tüm dosyayı ifade eder. Eğer `:%s/let/const/` komutunu çalıştırırsanız, tüm satırlarda değişiklik yapar. Bu aralık söz dizimini aklınızda bulundurun. Önümüzdeki bölümlerde öğreneceğiniz birçok komut satırı komutu bu biçimi takip edecektir.

## Desen Eşleştirme

Sonraki birkaç bölüm temel düzenli ifadeleri kapsayacaktır. Güçlü bir desen bilgisi, değiştirme komutunu ustaca kullanmak için gereklidir.

Eğer şu ifadeleriniz varsa:

```shell
let one = 1;
let two = 2;
let three = 3;
let four = 4;
let five = 5;
```

Sayılara çift tırnak eklemek için:

```shell
:%s/\d/"\0"/
```

Sonuç:

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Komutu inceleyelim:
- `:%s` tüm dosyayı hedef alarak değiştirme işlemi yapar.
- `\d` Vim'in sayılar için önceden tanımlanmış aralığıdır ( `[0-9]` kullanmaya benzer).
- `"\0"` burada çift tırnaklar, literal çift tırnaklardır. `\0`, "tüm eşleşen deseni" temsil eden özel bir karakterdir. Buradaki eşleşen desen, tek bir basamaklı sayıdır, `\d`.

Alternatif olarak, `&` de `\0` gibi tüm eşleşen deseni temsil eder. `:s/\d/"&"/` komutu da çalışırdı.

Başka bir örneği düşünelim. Bu ifadeler verildiğinde ve "let" ifadelerini değişken adlarıyla değiştirmek gerektiğinde:

```shell
one let = "1";
two let = "2";
three let = "3";
four let = "4";
five let = "5";
```

Bunu yapmak için, şunu çalıştırın:

```shell
:%s/\(\w\+\) \(\w\+\)/\2 \1/
```

Yukarıdaki komut çok fazla ters eğik çizgi içeriyor ve okunması zor. Bu durumda `\v` operatörünü kullanmak daha uygundur:

```shell
:%s/\v(\w+) (\w+)/\2 \1/
```

Sonuç:

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Harika! O komutu inceleyelim:
- `:%s` dosyadaki tüm satırları hedef alarak değiştirme işlemi yapar.
- `(\w+) (\w+)` bir grup eşleşmesidir. `\w`, Vim'in kelime karakterleri için önceden tanımlanmış aralıklardan biridir (`[0-9A-Za-z_]`). `( )` onu çevreleyerek bir grup içinde bir kelime karakteri eşleşmesini yakalar. İki grup arasındaki boşluğu gözlemleyin. `(\w+) (\w+)` iki grubu yakalar. İlk grup "one" ve ikinci grup "two"yu yakalar.
- `\2 \1`, yakalanan grubu ters sırayla döndürür. `\2` "let" ifadesini ve `\1` "one" ifadesini içerir. `\2 \1` ifadesi "let one" döndürür.

` \0` ifadesinin tüm eşleşen deseni temsil ettiğini unutmayın. Eşleşen dizeyi daha küçük gruplara ayırmak için `( )` kullanabilirsiniz. Her grup `\1`, `\2`, `\3` vb. ile temsil edilir.

Bu grup eşleşme kavramını pekiştirmek için bir örnek daha yapalım. Eğer şu sayılarınız varsa:

```shell
123
456
789
```

Sıralarını tersine çevirmek için şunu çalıştırın:

```shell
:%s/\v(\d)(\d)(\d)/\3\2\1/
```

Sonuç:

```shell
321
654
987
```

Her `(\d)` her bir basamağı eşleştirir ve bir grup oluşturur. İlk satırda, ilk `(\d)` 1 değerine, ikinci `(\d)` 2 değerine ve üçüncü `(\d)` 3 değerine sahiptir. Bunlar `\1`, `\2` ve `\3` değişkenlerinde saklanır. Değiştirmenin ikinci kısmında, yeni desen `\3\2\1` birinci satırda "321" değerini sonuçlandırır.

Eğer bunun yerine şunu çalıştırmış olsaydınız:

```shell
:%s/\v(\d\d)(\d)/\2\1/
```
Farklı bir sonuç alırdınız:

```shell
312
645
978
```

Bu, artık yalnızca iki grubunuz olduğu içindir. İlk grup, `(\d\d)` ile yakalanır ve `\1` içinde 12 değerini saklar. İkinci grup, `(\d)` ile yakalanır ve `\2` içinde 3 değerini saklar. `\2\1` ifadesi ise 312 döndürür.

## Değiştirme Bayrakları

Eğer şu cümleye sahipseniz:

```shell
çikolata krep, çilekli krep, yaban mersinli krep
```

Tüm krepleri donut ile değiştirmek için, sadece şunu çalıştıramazsınız:

```shell
:s/krep/donut
```

Yukarıdaki komut yalnızca ilk eşleşmeyi değiştirecek ve size:

```shell
çikolata donut, çilekli krep, yaban mersinli krep
```

Sonuç verecektir.

Bunu çözmenin iki yolu vardır. Ya değiştirme komutunu iki kez daha çalıştırabilirsiniz ya da bir global (`g`) bayrağı geçerek bir satırdaki tüm eşleşmeleri değiştirebilirsiniz.

Global bayraktan bahsedelim. Şunu çalıştırın:

```shell
:s/krep/donut/g
```

Vim, tek bir komutla tüm krepleri donut ile değiştirir. Global komut, değiştirme komutunun kabul ettiği birkaç bayraktan biridir. Bayrakları değiştirme komutunun sonuna eklersiniz. İşte yararlı bayrakların bir listesi:

```shell
&    Önceki değiştirme komutunun bayraklarını yeniden kullanır.
g    Satırdaki tüm eşleşmeleri değiştirir.
c    Değiştirme onayı ister.
e    Değiştirme başarısız olduğunda hata mesajının görüntülenmesini engeller.
i    Küçük/büyük harf duyarsız değiştirme yapar.
I    Küçük/büyük harf duyarlı değiştirme yapar.
```

Yukarıda listelemediğim daha fazla bayrak var. Tüm bayraklar hakkında bilgi almak için `:h s_flags` komutuna bakabilirsiniz.

Bu arada, tekrar değiştirme komutları (`&` ve `:s`) bayrakları saklamaz. `&` çalıştırmak, yalnızca `:s/krep/donut/` komutunu `g` olmadan tekrar eder. Son değiştirme komutunu tüm bayraklarla hızlı bir şekilde tekrar etmek için `:&&` komutunu çalıştırın.

## Ayırıcıyı Değiştirme

Bir URL'yi uzun bir yol ile değiştirmek gerekiyorsa:

```shell
https://mysite.com/a/b/c/d/e
```

Bunu "merhaba" kelimesi ile değiştirmek için, şunu çalıştırın:

```shell
:s/https:\/\/mysite.com\/a\/b\/c\/d\/e/merhaba/
```

Ancak, hangi ileri eğik çizgilerin (`/`) değiştirme deseninin bir parçası olduğunu ve hangilerinin ayırıcı olduğunu ayırt etmek zordur. Ayırıcıyı, alfabeler, sayılar veya `"`, `|`, ve `\` dışındaki herhangi bir tek bayt karakteri ile değiştirebilirsiniz. Bunları `+` ile değiştirelim. Yukarıdaki değiştirme komutu şu şekilde yeniden yazılabilir:

```shell
:s+https:\/\/mysite.com\/a\/b\/c\/d\/e+merhaba+
```

Artık ayırıcıların nerede olduğunu görmek daha kolay.

## Özel Değiştirme

Ayrıca değiştirdiğiniz metnin durumunu da değiştirebilirsiniz. Aşağıdaki ifadeler verildiğinde ve "one", "two", "three" gibi değişkenleri büyük harfe çevirmek gerektiğinde:

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Şunu çalıştırın:

```shell
:%s/\v(\w+) (\w+)/\1 \U\2/
```

Aldığınız sonuç:

```shell
let ONE = "1";
let TWO = "2";
let THREE = "3";
let FOUR = "4";
let FIVE = "5";
```

Açıklama:
- `(\w+) (\w+)` ilk iki eşleşen grubu yakalar, örneğin "let" ve "one".
- `\1` ilk grubun değerini, "let" döndürür.
- `\U\2` ikinci grubu (`\2`) büyük harfe çevirir.

Bu komutun hilesi `\U\2` ifadesidir. `\U`, sonraki karakterin büyük harfle yazılmasını sağlar.

Bir örnek daha yapalım. Diyelim ki bir Vim kılavuzu yazıyorsunuz ve bir satırdaki her kelimenin ilk harfini büyük yapmak istiyorsunuz.

```shell
vim evrensel metin düzenleyicisidir
```

Şunu çalıştırabilirsiniz:

```shell
:s/\<./\U&/g
```

Sonuç:

```shell
Vim Evrensel Metin Düzenleyicisidir
```

İşte açıklamalar:
- `:s` mevcut satırı değiştirir.
- `\<.` iki bölümden oluşur: `\<` bir kelimenin başlangıcını eşleştirir ve `.` herhangi bir karakteri eşleştirir. `\<` operatörü, sonraki karakterin bir kelimenin ilk karakteri olmasını sağlar. `.` bir sonraki karakter olduğundan, herhangi bir kelimenin ilk karakterini eşleştirecektir.
- `\U&` sonraki sembolü, `&` büyük harfle yazar. Unutmayın ki `&` (veya `\0`) tüm eşleşmeyi temsil eder. Herhangi bir kelimenin ilk karakterini eşleştirir.
- `g` global bayrağı. Olmadan, bu komut yalnızca ilk eşleşmeyi değiştirir. Bu satırdaki her eşleşmeyi değiştirmek için gereklidir.

Değiştirmenin özel değiştirme sembolleri hakkında daha fazla bilgi almak için `:h sub-replace-special` komutuna bakın.

## Alternatif Desenler

Bazen birden fazla deseni aynı anda eşleştirmeniz gerekir. Eğer şu selamlamalarınız varsa:

```shell
merhaba vim
hola vim
salve vim
bonjour vim
```

"vim" kelimesini "arkadaş" ile değiştirmek istiyorsunuz ancak yalnızca "merhaba" veya "hola" kelimesini içeren satırlarda. Bu bölümdeki önceki bilgileri hatırlayın, birden fazla alternatif desen için `|` kullanabilirsiniz.

```shell
:%s/\v(merhaba|hola) vim/\1 arkadaş/g
```

Sonuç:

```shell
merhaba arkadaş
hola arkadaş
salve vim
bonjour vim
```

İşte açıklama:
- `%s` dosyadaki her satırda değiştirme komutunu çalıştırır.
- `(merhaba|hola)` *ya "merhaba" ya da "hola"yı* eşleştirir ve bunu bir grup olarak kabul eder.
- `vim` kelimesi, literal "vim" kelimesidir.
- `\1` birinci grubu, yani "merhaba" veya "hola"yı döndürür.
- `arkadaş` literal "arkadaş" kelimesidir.

## Desenin Başını ve Sonunu Değiştirme

Hatırlayın ki `\zs` ve `\ze` kullanarak bir eşleşmenin başlangıcını ve sonunu tanımlayabilirsiniz. Bu teknik, değiştirmede de çalışır. Eğer şu ifadeleriniz varsa:

```shell
çikolata krep
çilekli tatlı krep
yaban mersinli krep
```

"hotcake" içindeki "cake" kelimesini "dog" ile değiştirmek için, "hotdog" elde etmek amacıyla:

```shell
:%s/hot\zscake/dog/g
```

Sonuç:

```shell
çikolata krep
çilekli tatlı krep
yaban mersinli hotdog
```
## Açgözlü ve Açgözsüz

Bir satırdaki n'inci eşleşmeyi bu hile ile değiştirebilirsiniz:

```shell
One Mississippi, two Mississippi, three Mississippi, four Mississippi, five Mississippi.
```

Üçüncü "Mississippi"yi "Arkansas" ile değiştirmek için şunu çalıştırın:

```shell
:s/\v(.{-}\zsMississippi){3}/Arkansas/g
```

Açıklama:
- `:s/` değiştirme komutu.
- `\v` özel anahtar kelimeleri kaçırmanıza gerek kalmadan kullanmanızı sağlar.
- `.` herhangi bir tek karakterle eşleşir.
- `{-}` önceden gelen atomun 0 veya daha fazlasının açgözsüz olmayan eşleşmesini gerçekleştirir.
- `\zsMississippi` "Mississippi"yi eşleşmenin başlangıcı yapar.
- `(...){3}` üçüncü eşleşmeyi arar.

Bu bölümde `{3}` sözdizimini daha önce görmüştünüz. Bu durumda, `{3}` tam olarak üçüncü eşleşmeyi bulur. Buradaki yeni hile `{-}`. Bu, açgözsüz olmayan bir eşleşmedir. Verilen kalıbın en kısa eşleşmesini bulur. Bu durumda, `(.{-}Mississippi)` herhangi bir karakterden önce gelen en az "Mississippi" miktarını eşleştirir. Bunu `(.*Mississippi)` ile karşılaştırın; burada verilen kalıbın en uzun eşleşmesini bulur.

Eğer `(.{-}Mississippi)` kullanırsanız, beş eşleşme alırsınız: "One Mississippi", "Two Mississippi", vb. Eğer `(.*Mississippi)` kullanırsanız, bir eşleşme alırsınız: son "Mississippi". `*` açgözlü bir eşleştiricidir ve `{-}` açgözsüz bir eşleştiricidir. Daha fazla bilgi için `:h /\{-` ve `:h non-greedy`'ye bakın.

Daha basit bir örnek yapalım. Eğer aşağıdaki dizeye sahipseniz:

```shell
abc1de1
```

"abc1de1" (açgözlü) ile eşleşmek için:

```shell
/a.*1
```

"abc1" (açgözsüz) ile eşleşmek için:

```shell
/a.\{-}1
```

En uzun eşleşmeyi büyük harfe çevirmek için (açgözlü), şunu çalıştırın:

```shell
:s/a.*1/\U&/g
```

Şunu elde etmek için:

```shell
ABC1DEFG1
```

En kısa eşleşmeyi büyük harfe çevirmek için (açgözsüz), şunu çalıştırın:

```shell
:s/a.\{-}1/\U&/g
```

Şunu elde etmek için:

```shell
ABC1defg1
```

Açgözlü ve açgözsüz kavramlarına yeniyseniz, bunu anlamak zor olabilir. Anlayana kadar farklı kombinasyonlarla denemeler yapın.

## Birden Fazla Dosya Üzerinde Değiştirme

Son olarak, birden fazla dosya üzerinde ifadeleri nasıl değiştireceğimizi öğrenelim. Bu bölüm için iki dosyaya sahip olduğunuzu varsayın: `food.txt` ve `animal.txt`.

`food.txt` içinde:

```shell
corndog
hotdog
chilidog
```

`animal.txt` içinde:

```shell
large dog
medium dog
small dog
```

Dizin yapınızın şöyle olduğunu varsayın:

```shell
- food.txt
- animal.txt
```

Öncelikle, hem `food.txt` hem de `animal.txt` dosyalarını `:args` içine alın. Önceki bölümlerden hatırlayın ki `:args`, dosya adları listesi oluşturmak için kullanılabilir. Vim içinde bunu yapmanın birkaç yolu vardır, bunlardan biri şudur:

```shell
:args *.txt                  mevcut konumdaki tüm txt dosyalarını alır
```

Bunu test etmek için, `:args` çalıştırdığınızda şunu görmelisiniz:

```shell
[food.txt] animal.txt
```

Artık tüm ilgili dosyalar argüman listesinde saklandığına göre, `:argdo` komutu ile çoklu dosya değiştirme işlemi gerçekleştirebilirsiniz. Şunu çalıştırın:

```shell
:argdo %s/dog/chicken/
```

Bu, `:args` listesindeki tüm dosyalar üzerinde değiştirme işlemi gerçekleştirir. Son olarak, değiştirilen dosyaları kaydetmek için:

```shell
:argdo update
```

`:args` ve `:argdo` birden fazla dosya üzerinde komut satırı komutlarını uygulamak için yararlı araçlardır. Diğer komutlarla da deneyin!

## Makrolarla Birden Fazla Dosya Üzerinde Değiştirme

Alternatif olarak, makrolar ile birden fazla dosya üzerinde değiştirme komutunu da çalıştırabilirsiniz. Şunu çalıştırın:

```shell
:args *.txt
qq
:%s/dog/chicken/g
:wnext
q
99@q
```

Açıklama:
- `:args *.txt` tüm metin dosyalarını `:args` listesine ekler.
- `qq` "q" kaydedicisinde makroyu başlatır.
- `:%s/dog/chicken/g` mevcut dosyadaki tüm satırlarda "dog"u "chicken" ile değiştirir.
- `:wnext` dosyayı kaydeder ve ardından `args` listesindeki bir sonraki dosyaya geçer.
- `q` makro kaydını durdurur.
- `99@q` makroyu doksan dokuz kez çalıştırır. Vim, ilk hata ile karşılaştığında makro çalıştırmayı durdurur, bu nedenle Vim aslında makroyu doksan dokuz kez çalıştırmaz.

## Akıllı Bir Şekilde Arama ve Değiştirme Öğrenmek

İyi bir arama yapabilme yeteneği, düzenleme için gerekli bir beceridir. Aramayı ustalaşmak, dosyada herhangi bir kalıbı aramak için düzenli ifadelerin esnekliğini kullanmanızı sağlar. Bunları öğrenmek için zaman ayırın. Düzenli ifadelerle daha iyi olmak için düzenli ifadeleri aktif olarak kullanmalısınız. Bir zamanlar düzenli ifadeler hakkında bir kitap okudum ama bunu uygulamadan ve sonrasında okuduğum her şeyi unuttum. Aktif kodlama, herhangi bir beceriyi ustalaşmanın en iyi yoludur.

Bir kalıp eşleştirme becerinizi geliştirmek için, bir kalıbı aramanız gerektiğinde (örneğin "hello 123"), kelime arama terimini (`/hello 123`) sorgulamak yerine bunun için bir kalıp oluşturmaya çalışın (şöyle bir şey: `/\v(\l+) (\d+)`). Bu düzenli ifade kavramlarının çoğu, yalnızca Vim kullanırken değil, genel programlamada da geçerlidir.

Artık Vim'de gelişmiş arama ve değiştirme hakkında bilgi edindiğinize göre, en çok yönlü komutlardan birini, global komutu öğrenelim.