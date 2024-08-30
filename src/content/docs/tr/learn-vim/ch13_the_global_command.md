---
description: Bu belge, Vim'de global komutun nasıl kullanılacağını ve birden fazla
  satırda komut satırı komutlarını nasıl tekrarlayabileceğinizi öğretir.
title: Ch13. the Global Command
---

Şu ana kadar, son değişikliği nokta komutu (`.`) ile tekrarlamayı, makrolarla (`q`) eylemleri yeniden oynamayı ve metinleri kayıtlarına (`"`) kaydetmeyi öğrendiniz.

Bu bölümde, bir komut satırı komutunu global komut ile nasıl tekrarlayacağınızı öğreneceksiniz.

## Global Komut Genel Bakış

Vim'in global komutu, bir komut satırı komutunu aynı anda birden fazla satırda çalıştırmak için kullanılır.

Bu arada, "Ex Komutları" terimini daha önce duymuş olabilirsiniz. Bu kılavuzda, onlara komut satırı komutları olarak atıfta bulunuyorum. Hem Ex komutları hem de komut satırı komutları aynıdır. Bunlar, iki nokta (`:`) ile başlayan komutlardır. Son bölümdeki yerine geçme komutu bir Ex komutu örneğiydi. Ex olarak adlandırılırlar çünkü kökenleri Ex metin düzenleyicisinden gelmektedir. Bu kılavuzda onlara komut satırı komutları olarak atıfta bulunmaya devam edeceğim. Ex komutlarının tam listesi için `:h ex-cmd-index`'e bakın.

Global komutun aşağıdaki sözdizimi vardır:

```shell
:g/pattern/command
```

`pattern`, yerine geçme komutundaki desenle benzer şekilde, o deseni içeren tüm satırları eşleştirir. `command`, herhangi bir komut satırı komutu olabilir. Global komut, `pattern` ile eşleşen her satırda `command`'ı çalıştırarak çalışır.

Aşağıdaki ifadeleriniz varsa:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

"console" içeren tüm satırları kaldırmak için şu komutu çalıştırabilirsiniz:

```shell
:g/console/d
```

Sonuç:

```shell
const one = 1;

const two = 2;

const three = 3;
```

Global komut, "console" desenine uyan tüm satırlarda silme komutunu (`d`) çalıştırır.

`g` komutunu çalıştırdığınızda, Vim dosya üzerinde iki tarama yapar. İlk çalıştırmada, her satırı tarar ve `/console/` desenine uyan satırı işaretler. Tüm eşleşen satırlar işaretlendikten sonra, ikinci kez gider ve işaretli satırlarda `d` komutunu çalıştırır.

Bunun yerine "const" içeren tüm satırları silmek istiyorsanız, şu komutu çalıştırın:

```shell
:g/const/d
```

Sonuç:

```shell
console.log("one: ", one);

console.log("two: ", two);

console.log("three: ", three);
```

## Ters Eşleşme

Global komutu eşleşmeyen satırlarda çalıştırmak için şu komutu çalıştırabilirsiniz:

```shell
:g!/pattern/command
```

veya

```shell
:v/pattern/command
```

Eğer `:v/console/d` komutunu çalıştırırsanız, "console" içermeyen tüm satırları siler.

## Desen

Global komut, yerine geçme komutuyla aynı desen sistemini kullanır, bu nedenle bu bölüm bir tazeleme olarak hizmet edecektir. İsterseniz bir sonraki bölüme geçebilir veya devam edebilirsiniz!

Eğer bu ifadeleriniz varsa:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

"one" veya "two" içeren satırları silmek için şu komutu çalıştırın:

```shell
:g/one\|two/d
```

Herhangi bir tek haneli rakam içeren satırları silmek için şu komutlardan birini çalıştırın:

```shell
:g/[0-9]/d
```

veya

```shell
:g/\d/d
```

Eğer şu ifadeye sahipseniz:

```shell
const oneMillion = 1000000;
const oneThousand = 1000;
const one = 1;
```

Üç ile altı sıfır arasında olan satırları eşleştirmek için şu komutu çalıştırın:

```shell
:g/0\{3,6\}/d
```

## Bir Aralık Geçirme

`g` komutundan önce bir aralık geçirebilirsiniz. Bunu yapmanın bazı yolları şunlardır:
- `:1,5g/console/d`  "console" dizesini 1 ile 5 arasındaki satırlarda eşleştirir ve siler.
- `:,5g/console/d` virgülden önce bir adres yoksa, mevcut satırdan başlar. Mevcut satır ile 5. satır arasındaki "console" dizesini arar ve siler.
- `:3,g/console/d` virgülden sonra bir adres yoksa, mevcut satırda sona erer. 3. satır ile mevcut satır arasındaki "console" dizesini arar ve siler.
- `:3g/console/d` yalnızca bir adres geçerseniz, komutu yalnızca 3. satırda çalıştırır. 3. satırı kontrol eder ve "console" dizesine sahipse siler.

Sayıların yanı sıra, aralık olarak bu sembolleri de kullanabilirsiniz:
- `.` mevcut satırı ifade eder. `.,3` aralığı, mevcut satır ile 3. satır arasındadır.
- `$` dosyadaki son satırı ifade eder. `3,$` aralığı, 3. satır ile son satır arasındadır.
- `+n` mevcut satırdan sonraki n satırı ifade eder. Bunu `.` ile veya olmadan kullanabilirsiniz. `3,+1` veya `3,.+1` mevcut satırdan sonraki satır ile 3. satır arasındadır.

Herhangi bir aralık vermezseniz, varsayılan olarak tüm dosyayı etkiler. Bu aslında norm değildir. Vim'in komut satırı komutlarının çoğu, herhangi bir aralık geçmezseniz yalnızca mevcut satırda çalışır. İki önemli istisna, global (`:g`) ve kaydetme (`:w`) komutlarıdır.

## Normal Komut

Global komut ile normal bir komutu `:normal` komut satırı komutuyla çalıştırabilirsiniz.

Eğer bu metne sahipseniz:
```shell
const one = 1
console.log("one: ", one)

const two = 2
console.log("two: ", two)

const three = 3
console.log("three: ", three)
```

Her satırın sonuna ";" eklemek için şu komutu çalıştırın:

```shell
:g/./normal A;
```

Bunu parçalayalım:
- `:g` global komuttur.
- `/./` "boş olmayan satırlar" için bir desendir. En az bir karakter içeren satırları eşleştirir, bu nedenle "const" ve "console" içeren satırları eşleştirir ve boş satırları eşleştirmez.
- `normal A;` `:normal` komut satırı komutunu çalıştırır. `A;` satırın sonuna ";" eklemek için normal mod komutudur.

## Makro Çalıştırma

Global komut ile bir makroyu da çalıştırabilirsiniz. Bir makro, `normal` komutuyla çalıştırılabilir. Eğer şu ifadelere sahipseniz:

```shell
const one = 1
console.log("one: ", one);

const two = 2
console.log("two: ", two);

const three = 3
console.log("three: ", three);
```

"const" içeren satırların noktalı virgül içermediğini fark edin. O satırlara bir virgül eklemek için a kayıtında bir makro oluşturalım:

```shell
qaA;<Esc>q
```

Bir tazeleme ihtiyacınız varsa, makro bölümüne göz atın. Şimdi çalıştırın:

```shell
:g/const/normal @a
```

Artık "const" içeren tüm satırların sonuna ";" eklenecek.

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Bu adımları takip ettiyseniz, ilk satırda iki noktalı virgül olacak. Bunu önlemek için, ikinci satırdan itibaren global komutu çalıştırın, `:2,$g/const/normal @a`.

## Rekürsif Global Komut

Global komut kendisi bir komut satırı komutu türüdür, bu nedenle teknik olarak bir global komut içinde başka bir global komut çalıştırabilirsiniz.

Aşağıdaki ifadelere sahip olduğunuzda, ikinci `console.log` ifadesini silmek istiyorsanız:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Eğer şu komutu çalıştırırsanız:

```shell
:g/console/g/two/d
```

Öncelikle `g`, "console" desenini içeren satırları arayacak ve 3 eşleşme bulacaktır. Ardından ikinci `g`, bu üç eşleşmeden "two" desenini içeren satırı arayacaktır. Son olarak, o eşleşmeyi silecektir.

`g` ve `v`'yi pozitif ve negatif desenleri bulmak için de birleştirebilirsiniz. Örneğin:

```shell
:g/console/v/two/d
```

"two" desenini içeren satırı aramak yerine, "two" desenini *içermeyen* satırları arayacaktır.

## Ayırıcıyı Değiştirme

Global komutun ayırıcısını yerine geçme komutu gibi değiştirebilirsiniz. Kurallar aynıdır: alfabeler, sayılar, `"`, `|` ve `\` dışında herhangi bir tek bayt karakteri kullanabilirsiniz.

"console" içeren satırları silmek için:

```shell
:g@console@d
```

Global komut ile yerine geçme komutunu kullanıyorsanız, iki farklı ayırıcıya sahip olabilirsiniz:

```shell
g@one@s+const+let+g
```

Burada global komut, "one" içeren tüm satırları arayacaktır. Yerine geçme komutu, bu eşleşmelerden "const" dizesini "let" ile değiştirecektir.

## Varsayılan Komut

Global komut içinde herhangi bir komut satırı komutu belirtmezseniz ne olur?

Global komut, mevcut satırın metnini yazdırmak için print (`:p`) komutunu kullanır. Eğer şu komutu çalıştırırsanız:

```shell
:g/console
```

"console" içeren tüm satırları ekranın altında yazdırır.

Bu arada, burada ilginç bir gerçek var. Global komut tarafından kullanılan varsayılan komut `p` olduğundan, bu `g` sözdizimini:

```shell
:g/re/p
```

şeklinde yapar.

- `g` = global komut
- `re` = regex deseni
- `p` = yazdırma komutu

Bu *"grep"* olarak okunur, komut satırındaki aynı `grep`. Bu **bir tesadüf değil**. `g/re/p` komutu, orijinal satır metin düzenleyicilerinden biri olan Ed Editörü'nden gelmiştir. `grep` komutu adını Ed'den almıştır.

Bilgisayarınızda muhtemelen hala Ed editörü vardır. Terminalden `ed` komutunu çalıştırın (ipuç: çıkmak için `q` yazın).

## Tüm Tamponu Ters Çevirme

Tüm dosyayı ters çevirmek için:

```shell
:g/^/m 0
```

`^` bir satırın başı için bir desendir. Boş satırlar da dahil olmak üzere tüm satırları eşleştirmek için `^` kullanın.

Sadece birkaç satırı ters çevirmek istiyorsanız, bir aralık geçirin. Beşinci satırdan onuncu satıra kadar olan satırları ters çevirmek için:

```shell
:5,10g/^/m 0
```

Taşıma komutu hakkında daha fazla bilgi için `:h :move`'a bakın.

## Tüm TODO'ları Toplama

Kod yazarken, bazen düzenlediğim dosyaya TODO'lar yazardım:

```shell
const one = 1;
console.log("one: ", one);
// TODO: puppy'yi besle

const two = 2;
// TODO: puppy'yi otomatik olarak besle
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: otomatik puppy besleyici satan bir başlangıç oluştur
```

Oluşturulan tüm TODO'ları takip etmek zor olabilir. Vim, tüm eşleşmeleri bir adrese kopyalamak için `:t` (kopyala) yöntemine sahiptir. Kopyalama yöntemi hakkında daha fazla bilgi için `:h :copy`'ya bakın.

Tüm TODO'ları dosyanın sonuna daha kolay incelemek için kopyalamak için şu komutu çalıştırın:

```shell
:g/TODO/t $
```

Sonuç:

```shell
const one = 1;
console.log("one: ", one);
// TODO: puppy'yi besle

const two = 2;
// TODO: puppy'yi otomatik olarak besle
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: otomatik puppy besleyici satan bir başlangıç oluştur

// TODO: puppy'yi besle
// TODO: puppy'yi otomatik olarak besle
// TODO: otomatik puppy besleyici satan bir başlangıç oluştur
```

Artık oluşturduğum tüm TODO'ları gözden geçirebilir, bunları yapmak için bir zaman bulabilir veya bir başkasına devredebilir ve bir sonraki görevime devam edebilirim.

Bunları kopyalamak yerine tüm TODO'ları sona taşımak istiyorsanız, taşıma komutunu kullanın, `:m`:

```shell
:g/TODO/m $
```

Sonuç:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);

// TODO: puppy'yi besle
// TODO: puppy'yi otomatik olarak besle
// TODO: otomatik puppy besleyici satan bir başlangıç oluştur
```

## Siyah Delik Silme

Kayıtlar bölümünden hatırlayın ki silinen metinler numaralı kayıtlarda saklanır (yeterince büyük oldukları sürece). Herhangi bir `:g/console/d` komutunu çalıştırdığınızda, Vim silinen satırları numaralı kayıtlara kaydeder. Birçok satırı silerseniz, tüm numaralı kayıtları hızla doldurabilirsiniz. Bunu önlemek için, her zaman silinen satırlarınızı kayıtlara *kaydetmemek* için siyah delik kaydını (`"_`) kullanabilirsiniz. Şu komutu çalıştırın:

```shell
:g/console/d_
```

`d`'den sonra `_` geçirerek, Vim, geçici kayıtlarınızı kullanmayacaktır.
## Birden Fazla Boş Satırı Tek Boş Satıra İndirgeme

Birden fazla boş satır içeren bir metniniz varsa:

```shell
const one = 1;
console.log("one: ", one);


const two = 2;
console.log("two: ", two);





const three = 3;
console.log("three: ", three);
```

Boş satırları hızlıca tek bir boş satıra indirmek için:

```shell
:g/^$/,/./-1j
```

Sonuç:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Normalde global komut aşağıdaki biçimi kabul eder: `:g/pattern/command`. Ancak, global komutu aşağıdaki biçimle de çalıştırabilirsiniz: `:g/pattern1/,/pattern2/command`. Bu şekilde, Vim `command`'ı `pattern1` ve `pattern2` arasında uygular.

Bunu göz önünde bulundurarak, `:g/^$/,/./-1j` komutunu `:g/pattern1/,/pattern2/command` biçiminde inceleyelim:
- `/pattern1/` `/^$/`'dir. Bu, boş bir satırı (sıfır karakter içeren bir satır) temsil eder.
- `/pattern2/` `/./` ile `-1` satır değiştiricisidir. `/./` en az bir karakter içeren bir satırı temsil eder. `-1` bu satırın üstündeki satırı ifade eder.
- `command` `j`'dir, birleştirme komutu (`:j`). Bu bağlamda, bu global komut verilen tüm satırları birleştirir.

Bu arada, birden fazla boş satırı hiç satır olmadan indirmek isterseniz, bunun yerine şunu çalıştırın:

```shell
:g/^$/,/./j
```

Daha basit bir alternatif:

```shell
:g/^$/-j
```

Metniniz şimdi şu hale geldi:

```shell
const one = 1;
console.log("one: ", one);
const two = 2;
console.log("two: ", two);
const three = 3;
console.log("three: ", three);
```

## Gelişmiş Sıralama

Vim, bir aralıktaki satırları sıralamak için `:sort` komutuna sahiptir. Örneğin:

```shell
d
b
a
e
c
```

Bunları sıralamak için `:sort` komutunu çalıştırabilirsiniz. Eğer bir aralık verirseniz, yalnızca o aralıktaki satırları sıralar. Örneğin, `:3,5sort` yalnızca üçüncü ve beşinci satırları sıralar.

Aşağıdaki ifadeleriniz varsa:

```shell
const arrayB = [
  "i",
  "g",
  "h",
  "b",
  "f",
  "d",
  "e",
  "c",
  "a",
]

const arrayA = [
  "h",
  "b",
  "f",
  "d",
  "e",
  "a",
  "c",
]
```

Dizilerin içindeki elemanları sıralamak, ancak dizilerin kendilerini sıralamamak istiyorsanız, bunu çalıştırabilirsiniz:

```shell
:g/\[/+1,/\]/-1sort
```

Sonuç:

```shell
const arrayB = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
]

const arrayA = [
  "a"
  "b",
  "c",
  "d",
  "e",
  "f",
  "h",
]
```

Bu harika! Ama komut karmaşık görünüyor. Hadi bunu inceleyelim. Bu komut da `:g/pattern1/,/pattern2/command` biçimini takip eder.

- `:g` global komut desenidir.
- `/\[/+1` ilk desendir. Bu, bir sol köşeli parantez "[" ile eşleşir. `+1` bunun altındaki satırı ifade eder.
- `/\]/-1` ikinci desendir. Bu, bir sağ köşeli parantez "]" ile eşleşir. `-1` bunun üstündeki satırı ifade eder.
- `/\[/+1,/\]/-1` bu durumda "[" ve "]" arasındaki herhangi bir satırı ifade eder.
- `sort` sıralamak için bir komut satırı komutudur.

## Global Komutu Akıllıca Öğrenin

Global komut, komut satırı komutunu tüm eşleşen satırlara uygular. Bununla, yalnızca bir komut çalıştırmanız yeterlidir ve Vim geri kalanını sizin için yapar. Global komutta ustalaşmak için iki şey gereklidir: iyi bir komut satırı komutları bilgisi ve düzenli ifadeler bilgisi. Vim kullanırken daha fazla komut satırı komutu doğal olarak öğreneceksiniz. Düzenli ifadeler bilgisi daha aktif bir yaklaşım gerektirecektir. Ancak düzenli ifadelerle rahat hale geldiğinizde, birçok kişiden önde olacaksınız.

Buradaki bazı örnekler karmaşık. Korkmayın. Gerçekten anlamak için zaman ayırın. Desenleri okumayı öğrenin. Pes etmeyin.

Birden fazla komut çalıştırmanız gerektiğinde, durun ve `g` komutunu kullanıp kullanamayacağınıza bakın. İş için en iyi komutu belirleyin ve bir deseni bir kerede mümkün olduğunca çok şeyi hedeflemek için yazın.

Artık global komutun ne kadar güçlü olduğunu bildiğinize göre, dış komutları nasıl kullanacağınızı öğrenelim ve araç arsenalinizi artırın.