---
description: Bu belge, nokta komutunu kullanarak önceki değişiklikleri kolayca tekrar
  etmenin yollarını ve basit tekrarları azaltmanın ipuçlarını sunmaktadır.
title: Ch07. the Dot Command
---

Genel olarak, mümkün olduğunca yaptığınız şeyi yeniden yapmaktan kaçınmalısınız. Bu bölümde, önceki değişikliği kolayca yeniden yapmak için nokta komutunu nasıl kullanacağınızı öğreneceksiniz. Basit tekrarları azaltmak için çok yönlü bir komuttur.

## Kullanım

Adı gibi, nokta komutunu nokta tuşuna (`.`) basarak kullanabilirsiniz.

Örneğin, aşağıdaki ifadelerde tüm "let"leri "const" ile değiştirmek istiyorsanız:

```shell
let one = "1";
let two = "2";
let three = "3";
```

- Eşleşmeye gitmek için `/let` ile arama yapın.
- "let"i "const" ile değiştirmek için `cwconst<Esc>` ile değiştirin.
- Önceki aramayı kullanarak bir sonraki eşleşmeyi bulmak için `n` ile gezin.
- Nokta komutunu (`.`) kullanarak az önce yaptığınızı tekrarlayın.
- Her kelimeyi değiştirdiğinizdeye kadar `n . n .` tuşlamaya devam edin.

Burada nokta komutu `cwconst<Esc>` dizisini tekrarladı. Bu, sadece bir tuşlama karşılığında sekiz tuşlama yazmaktan sizi kurtardı.

## Değişiklik Nedir?

Nokta komutunun tanımına bakarsanız (`:h .`), nokta komutunun son değişikliği tekrar ettiğini söyler. Değişiklik nedir?

Mevcut tamponun içeriğini güncellediğiniz (eklediğiniz, değiştirdiğiniz veya sildiğiniz) her zaman bir değişiklik yapıyorsunuz. Komut satırı komutlarıyla ( `:` ile başlayan komutlar) yapılan güncellemeler değişiklik olarak sayılmaz.

İlk örnekte, `cwconst<Esc>` değişiklikti. Şimdi bu metne sahip olduğunuzu varsayalım:

```shell
pancake, potatoes, fruit-juice,
```

Bir satırın başından sonraki virgüle kadar olan metni silmek için önce virgüle kadar silin, ardından `df,..` ile iki kez tekrarlayın.

Başka bir örnek deneyelim:

```shell
pancake, potatoes, fruit-juice,
```

Bu sefer, göreviniz virgülü silmek, kahvaltı öğelerini değil. İmleç satırın başında iken, ilk virgüle gidin, silin, ardından `f,x..` ile iki kez tekrarlayın. Kolay, değil mi? Bir dakika, işe yaramadı! Neden?

Bir değişiklik, hareketleri hariç tutar çünkü tampon içeriğini güncellemez. `f,x` komutu iki eylemden oluşuyordu: imleci "," işaretine taşımak için `f,` komutu ve bir karakteri silmek için `x`. Sadece ikincisi, `x`, bir değişiklik yaptı. Bunu önceki örnekteki `df,` ile karşılaştırın. Orada, `f,` silme operatörü `d` için bir direktif, imleci hareket ettirmek için bir hareket değil. `df,` ve `f,x` içindeki `f,` iki çok farklı role sahiptir.

Son görevi bitirelim. `f,` ardından `x` komutunu çalıştırdıktan sonra, en son `f` ile tekrarlamak için bir sonraki virgüle `;` ile gidin. Son olarak, imlecin altındaki karakteri silmek için `.` kullanın. Her şey silinene kadar `; . ; .` tekrarlayın. Tam komut `f,x;.;.`.

Başka bir tane deneyelim:

```shell
pancake
potatoes
fruit-juice
```

Her satırın sonuna bir virgül ekleyelim. İlk satırdan başlayarak, `A,<Esc>j` yapın. Artık `j`'nin bir değişiklik yaratmadığını fark ettiniz. Buradaki değişiklik sadece `A,`dır. Değişikliği `j . j .` ile hareket ettirip tekrarlayabilirsiniz. Tam komut `A,<Esc>j.j.`.

Ekleme komut operatörüne (`A`) bastığınız andan itibaren ekleme komutundan çıkış yaptığınız ana kadar her eylem bir değişiklik olarak kabul edilir.

## Çok Satırlı Tekrar

Varsayalım ki bu metne sahipsiniz:

```shell
let one = "1";
let two = "2";
let three = "3";
const foo = "bar';
let four = "4";
let five = "5";
let six = "6";
let seven = "7";
let eight = "8";
let nine = "9";
```

Amacınız "foo" satırı dışındaki tüm satırları silmek. Öncelikle `d2j` ile ilk üç satırı silin, ardından "foo" satırının altındaki satıra gidin. Bir sonraki satırda, nokta komutunu iki kez kullanın. Tam komut `d2jj..`.

Burada değişiklik `d2j` idi. Bu bağlamda, `2j` bir hareket değil, silme operatörünün bir parçasıydı.

Başka bir örneğe bakalım:

```shell
zlet zzone = "1";
zlet zztwo = "2";
zlet zzthree = "3";
let four = "4";
```

Tüm z'leri silelim. İlk satırdaki ilk karakterden başlayarak, blok görsel modda (`Ctrl-Vjj`) ilk üç satırdan yalnızca ilk z'yi görsel olarak seçin. Blok görsel modunu bilmiyorsanız, bunu daha sonraki bir bölümde ele alacağım. Üç z'yi görsel olarak seçtikten sonra, silme operatörü (`d`) ile silin. Ardından bir sonraki z'ye (`w`) geçin. Değişikliği iki kez daha tekrarlayın (`..`). Tam komut `Ctrl-vjjdw..`.

Üç z'lik bir sütunu sildiğinizde (`Ctrl-vjjd`), bu bir değişiklik olarak sayıldı. Görsel mod işlemi, bir değişikliğin parçası olarak birden fazla satırı hedeflemek için kullanılabilir.

## Değişiklikte Bir Hareket Dahil Etme

Bu bölümdeki ilk örneğe geri dönelim. `/letcwconst<Esc>` komutunun ardından `n . n .` ile aşağıdaki ifadelerde tüm "let"leri "const" ile değiştirdiğinizi hatırlayın:

```shell
let one = "1";
let two = "2";
let three = "3";
```

Bunu başarmanın daha hızlı bir yolu var. `/let` ile arama yaptıktan sonra `cgnconst<Esc>` çalıştırın, ardından `. .` yapın.

`gn`, son arama desenini (bu durumda, `/let`) ileriye doğru arayan ve otomatik olarak görsel vurgulama yapan bir harekettir. Bir sonraki eşleşmeyi değiştirmek için artık hareket etmenize ve değişikliği tekrarlamanıza gerek yoktur (`n . n .`), sadece tekrar (`. .`) yapmanız yeterlidir. Artık arama hareketlerini kullanmanıza gerek yok çünkü bir sonraki eşleşmeyi aramak artık değişikliğin bir parçası!

Düzenleme yaparken, mümkün olduğunca birden fazla şeyi aynı anda yapabilen hareketlere dikkat edin, örneğin `gn`.

## Nokta Komutunu Akıllıca Öğrenin

Nokta komutunun gücü, birkaç tuşlamayı bir tuşlama ile değiştirmekten gelir. Tek tuşlu işlemler için nokta komutunu kullanmak muhtemelen karlı bir değişim değildir, örneğin `x`. Son değişikliğiniz karmaşık bir işlem gerektiriyorsa, örneğin `cgnconst<Esc>`, nokta komutu dokuz tuşlamayı bir tuşlamaya indirir, bu çok karlı bir takas.

Düzenleme yaparken, tekrar edilebilirliği düşünün. Örneğin, bir sonraki üç kelimeyi silmem gerekiyorsa, `d3w` kullanmak mı yoksa `dw` yapıp ardından iki kez `.` yapmak mı daha ekonomik? Yine bir kelime silecek misiniz? Eğer öyleyse, `d3w` yerine `dw` kullanmak ve birkaç kez tekrarlamak mantıklıdır çünkü `dw`, `d3w`'den daha yeniden kullanılabilir.

Nokta komutu, tek değişiklikleri otomatikleştirmek için çok yönlü bir komuttur. Daha sonraki bir bölümde, Vim makroları ile daha karmaşık eylemleri nasıl otomatikleştireceğinizi öğreneceksiniz. Ama önce, metni depolamak ve almak için kayıtları öğrenelim.