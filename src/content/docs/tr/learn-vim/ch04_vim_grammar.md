---
description: Vim komutlarının yapısını anlamak için dil bilgisi kurallarını öğrenin,
  kelime dağarcığınızı artırın ve pratik yaparak Vim dilini konuşmayı öğrenin.
title: Ch04. Vim Grammar
---

Vim komutlarının karmaşıklığı karşısında korkmak kolaydır. Bir Vim kullanıcısının `gUfV` veya `1GdG` yaptığını gördüğünüzde, bu komutların ne yaptığını hemen bilemeyebilirsiniz. Bu bölümde, Vim komutlarının genel yapısını basit bir dilbilgisi kuralına ayıracağım.

Bu, tüm kılavuzdaki en önemli bölümdür. Temel dilbilgisi yapısını anladığınızda, Vim ile "konuşabileceksiniz". Bu arada, bu bölümde *Vim dili* dediğimde, Vimscript dilinden (Vim'in yerleşik programlama dili, bunu sonraki bölümlerde öğreneceksiniz) bahsetmiyorum.

## Bir Dili Nasıl Öğrenirsiniz

Ben ana dili İngilizce olmayan biriyim. 13 yaşındayken ABD'ye taşındığımda İngilizce öğrendim. Yeni bir dil konuşmayı öğrenmek için yapmanız gereken üç şey var:

1. Dilbilgisi kurallarını öğrenin.
2. Kelime dağarcığını artırın.
3. Pratik yapın, pratik yapın, pratik yapın.

Aynı şekilde, Vim dilini konuşmak için dilbilgisi kurallarını öğrenmeniz, kelime dağarcığınızı artırmanız ve komutları düşünmeden çalıştırabilene kadar pratik yapmanız gerekiyor.

## Dilbilgisi Kuralı

Vim dilinde yalnızca bir dilbilgisi kuralı vardır:

```shell
fiil + isim
```

Hepsi bu!

Bu, bu İngilizce ifadeleri söylemek gibidir:

- *"Bir donut (isim) ye (fiil)"*
- *"Bir topa (isim) tekme at (fiil)"*
- *"Vim editörünü (isim) öğren (fiil)"*

Artık temel Vim fiilleri ve isimleri ile kelime dağarcığınızı oluşturmanız gerekiyor.

## İsimler (Hareketler)

İsimler, Vim hareketleridir. Hareketler, Vim'de dolaşmak için kullanılır. Aşağıda bazı Vim hareketlerinin bir listesi bulunmaktadır:

```shell
h    Sol
j    Aşağı
k    Yukarı
l    Sağa
w    Bir sonraki kelimenin başına ilerle
}    Bir sonraki paragrafa atla
$    Satırın sonuna git
```

Hareketler hakkında daha fazla bilgi edineceksiniz, bu yüzden bazılarını anlamıyorsanız çok endişelenmeyin.

## Fiiller (Operatörler)

`:h operator`'a göre, Vim'in 16 operatörü vardır. Ancak, deneyimlerime göre, bu 3 operatörü öğrenmek, düzenleme ihtiyaçlarımın %80'i için yeterlidir:

```shell
y    Metni yankele (kopyala)
d    Metni sil ve kaydet
c    Metni sil, kaydet ve ekleme modunu başlat
```

Bu arada, bir metni yankeledikten sonra, `p` (imlecin arkasına) veya `P` (imlecin önüne) ile yapıştırabilirsiniz.

## Fiil ve İsim

Artık temel isimleri ve fiilleri bildiğinize göre, dilbilgisi kuralını, fiil + isim uygulayalım! Diyelim ki bu ifadeye sahipsiniz:

```javascript
const learn = "vim";
```

- Mevcut konumunuzdan satırın sonuna kadar her şeyi yankelemek için: `y$`.
- Mevcut konumunuzdan bir sonraki kelimenin başına kadar silmek için: `dw`.
- Mevcut konumunuzdan mevcut paragrafın sonuna kadar değiştirmek için, `c}` deyin.

Hareketler, argüman olarak sayıyı da kabul eder (bunu bir sonraki bölümde tartışacağım). Eğer 3 satır yukarı çıkmanız gerekiyorsa, `k` tuşuna 3 kez basmak yerine `3k` yapabilirsiniz. Sayı, Vim dilbilgisi ile çalışır.
- Soldaki iki karakteri yankelemek için: `y2h`.
- Bir sonraki iki kelimeyi silmek için: `d2w`.
- Bir sonraki iki satırı değiştirmek için: `c2j`.

Şu anda, basit bir komutu bile yürütmek için uzun ve dikkatli düşünmek zorunda kalabilirsiniz. Yalnız değilsiniz. Ben ilk başladığımda benzer zorluklar yaşadım ama zamanla daha hızlı hale geldim. Siz de öyle olacaksınız. Tekrar, tekrar, tekrar.

Bir yan not olarak, satır bazında işlemler (tüm satırı etkileyen işlemler) metin düzenlemede yaygın işlemlerdir. Genel olarak, bir operatör komutunu iki kez yazarak, Vim o eylem için satır bazında bir işlem gerçekleştirir. Örneğin, `dd`, `yy` ve `cc` tüm satır üzerinde **silme**, **yankeleme** ve **değiştirme** işlemleri yapar. Bunu diğer operatörlerle deneyin!

Bu gerçekten harika. Burada bir desen görüyorum. Ama henüz işim bitmedi. Vim'in bir tür ismi daha var: metin nesneleri.

## Daha Fazla İsim (Metin Nesneleri)

Bir parantez çiftinin içinde `(hello Vim)` bir yerde olduğunuzu ve parantez içindeki tüm ifadeyi silmeniz gerektiğini hayal edin. Bunu hızlı bir şekilde nasıl yapabilirsiniz? İçinde bulunduğunuz "grubu" silmenin bir yolu var mı?

Cevap evet. Metinler genellikle yapılandırılmış gelir. Genellikle parantezler, alıntılar, köşeli parantezler, süslü parantezler ve daha fazlasını içerir. Vim, bu yapıyı metin nesneleri ile yakalamanın bir yoluna sahiptir.

Metin nesneleri operatörlerle birlikte kullanılır. İki tür metin nesnesi vardır: iç ve dış metin nesneleri.

```shell
i + nesne    İç metin nesnesi
a + nesne    Dış metin nesnesi
```

İç metin nesnesi, nesneyi *boşluk* veya çevresindeki nesneler olmadan seçer. Dış metin nesnesi, nesneyi *boşluk* veya çevresindeki nesneler dahil olmak üzere seçer. Genel olarak, bir dış metin nesnesi her zaman bir iç metin nesnesinden daha fazla metin seçer. Eğer imleciniz `(hello Vim)` ifadesindeki parantezlerin içinde bir yerdeyse:
- Parantezleri silmeden parantez içindeki metni silmek için: `di(`.
- Parantezleri ve içindeki metni silmek için: `da(`.

Farklı bir örneğe bakalım. Diyelim ki bu Javascript fonksiyonuna sahipsiniz ve imleciniz "H" harfinde:

```javascript
const hello = function() {
  console.log("Hello Vim");
  return true;
}
```

- Tüm "Hello Vim" ifadesini silmek için: `di(`.
- Fonksiyonun içeriğini ( `{}` ile çevrili) silmek için: `di{`.
- "Hello" dizesini silmek için: `diw`.

Metin nesneleri güçlüdür çünkü bir konumdan farklı nesneleri hedefleyebilirsiniz. Parantezler içindeki nesneleri, fonksiyon bloğunu veya mevcut kelimeyi silebilirsiniz. Mnemonik olarak, `di(`, `di{` ve `diw` gördüğünüzde, hangi metin nesnelerini temsil ettiklerine dair oldukça iyi bir fikir edinebilirsiniz: bir çift parantez, bir çift süslü parantez ve bir kelime.

Son bir örneğe bakalım. Diyelim ki bu HTML etiketlerine sahipsiniz:

```html
<div>
  <h1>Header1</h1>
  <p>Paragraph1</p>
  <p>Paragraph2</p>
</div>
```

Eğer imleciniz "Header1" metnindeyse:
- "Header1" silmek için: `dit`.
- `<h1>Header1</h1>` silmek için: `dat`.

Eğer imleciniz "div" üzerindeyse:
- `h1` ve her iki `p` satırını silmek için: `dit`.
- Her şeyi silmek için: `dat`.
- "div" silmek için: `di<`.

Aşağıda yaygın metin nesnelerinin bir listesi bulunmaktadır:

```shell
w         Bir kelime
p         Bir paragraf
s         Bir cümle
( veya )  Bir çift ( )
{ veya }  Bir çift { }
[ veya ]  Bir çift [ ]
< veya >  Bir çift < >
t         XML etiketleri
"         Bir çift " "
'         Bir çift ' '
`         Bir çift ` `
```

Daha fazla bilgi için `:h text-objects`'a bakın.

## Bileşenlik ve Dilbilgisi

Vim dilbilgisi, Vim'in bileşenlik özelliğinin bir alt kümesidir. Vim'deki bileşenliği ve bunun metin düzenleyicide neden harika bir özellik olduğunu tartışalım.

Bileşenlik, daha karmaşık komutlar gerçekleştirmek için bir araya getirilebilen (bileşen) genel komutlar setine sahip olmayı ifade eder. Programlamada daha basit soyutlamalardan daha karmaşık soyutlamalar oluşturabileceğiniz gibi, Vim'de de basit komutlardan karmaşık komutlar çalıştırabilirsiniz. Vim dilbilgisi, Vim'in bileşen doğasının tezahürüdür.

Vim'in bileşenliğinin gerçek gücü, dış programlarla entegre olduğunda parlıyor. Vim, metinlerimiz için dış programları filtre olarak kullanmak için bir filtre operatörüne (`!`) sahiptir. Diyelim ki aşağıdaki dağınık metne sahipsiniz ve bunu tablo haline getirmek istiyorsunuz:

```shell
Id|Name|Cuteness
01|Puppy|Very
02|Kitten|Ok
03|Bunny|Ok
```

Bu, Vim komutlarıyla kolayca yapılamaz, ancak bunu hızlıca `column` terminal komutuyla yapabilirsiniz (terminalinizde `column` komutu olduğunu varsayıyoruz). İmleciniz "Id" üzerindeyken, `!}column -t -s "|"` komutunu çalıştırın. Voila! Artık sadece bir hızlı komutla bu güzel tablo verisine sahipsiniz.

```shell
Id  Name    Cuteness
01  Puppy   Very
02  Kitten  Ok
03  Bunny   Ok
```

Komutu inceleyelim. Fiil `!` (filtre operatörü) ve isim `}` (bir sonraki paragrafa git). Filtre operatörü `!`, başka bir argümanı, bir terminal komutunu kabul etti, bu yüzden ona `column -t -s "|"` verdim. `column`'ın nasıl çalıştığını anlatmayacağım, ama etkili olarak metni tablo haline getirdi.

Diyelim ki metninizi sadece tablo haline getirmekle kalmayıp, "Ok" olan satırları göstermek istiyorsunuz. `awk`'ın bu işi kolayca yapabileceğini biliyorsunuz. Bunu şöyle yapabilirsiniz:

```shell
!}column -t -s "|" | awk 'NR > 1 && /Ok/ {print $0}'
```

Sonuç:

```shell
02  Kitten  Ok
03  Bunny   Ok
```

Harika! Dış komut operatörü ayrıca pipe (`|`) kullanabilir.

Bu, Vim'in bileşenliğinin gücüdür. Operatörlerinizi, hareketlerinizi ve terminal komutlarınızı ne kadar iyi bilirseniz, karmaşık eylemleri bir araya getirme yeteneğiniz *katlanır*.

Diyelim ki sadece dört hareketi, `w, $, }, G` biliyorsunuz ve yalnızca bir operatör, `d` var. 8 eylem yapabilirsiniz: *hareket* 4 farklı şekilde (`w, $, }, G`) ve *silme* 4 farklı hedef (`dw, d$, d}, dG`). Sonra bir gün büyük harfli (`gU`) operatörünü öğreniyorsunuz. Vim alet çantanıza sadece bir yeni yetenek eklemekle kalmaz, *dört* eklemiş olursunuz: `gUw, gU$, gU}, gUG`. Bu, Vim alet çantanızda 12 araç yapar. Her yeni bilgi, mevcut yeteneklerinizi çarpan bir etkidir. Eğer 10 hareket ve 5 operatör biliyorsanız, 60 hareket (50 işlem + 10 hareket) arsenalinizde vardır. Vim, dosyanızdaki satır sayısı kadar hareket veren bir satır numarası hareketine (`nG`) sahiptir (5. satıra gitmek için `5G` çalıştırın). Arama hareketi (`/`), neredeyse sınırsız sayıda hareket sağlar çünkü her şeyi arayabilirsiniz. Dış komut operatörü (`!`), bildiğiniz terminal komutları kadar filtreleme aracı sağlar. Vim gibi bileşenli bir aracı kullanarak, bildiğiniz her şeyi bir araya getirerek artan karmaşıklıkta işlemler yapabilirsiniz. Ne kadar çok şey bilirseniz, o kadar güçlü olursunuz.

Bu bileşenli davranış, Unix felsefesini yankılar: *bir şeyi iyi yap*. Bir operatörün bir görevi vardır: Y yapmak. Bir hareketin bir görevi vardır: X'e gitmek. Bir operatörü bir hareketle birleştirerek, öngörülebilir bir şekilde YX elde edersiniz: Y'yi X üzerinde yapın.

Hareketler ve operatörler genişletilebilir. Kendi Vim alet çantanıza eklemek için özel hareketler ve operatörler oluşturabilirsiniz. [`vim-textobj-user`](https://github.com/kana/vim-textobj-user) eklentisi, kendi metin nesnelerinizi oluşturmanıza olanak tanır. Ayrıca, kullanıcı tarafından oluşturulan özel metin nesnelerinin bir [listesini](https://github.com/kana/vim-textobj-user/wiki) içerir.

## Vim Dilbilgisini Akıllı Bir Şekilde Öğrenin

Vim dilbilgisi kuralını öğrendiniz: `fiil + isim`. En büyük Vim "AHA!" anlarımdan biri, büyük harfli (`gU`) operatörünü yeni öğrendiğimde ve mevcut kelimeyi büyük harfe dönüştürmek istediğimde, *içgüdüsel olarak* `gUiw` çalıştırdım ve işe yaradı! Kelime büyük harfe dönüştürüldü. O anda, sonunda Vim'i anlamaya başladım. Umarım, siz de kısa süre içinde, belki de zaten, kendi "AHA!" anınızı yaşarsınız.

Bu bölümün amacı, Vim'deki `fiil + isim` desenini göstermek, böylece Vim'i yeni bir dil öğrenir gibi öğrenmeye yaklaşmanızdır; her komut kombinasyonunu ezberlemek yerine.

Deseni öğrenin ve sonuçlarını anlayın. Bu, akıllı bir öğrenme yoludur.