---
description: Vim'de dış komutları kullanarak verimliliğinizi artırın. Bu bölümde,
  bang komutunu ve dış komutlarla etkileşimi öğrenin.
title: Ch14. External Commands
---

Unix sisteminde, bir şeyi (ve bunu iyi bir şekilde) yapan birçok küçük, hiper-özel komut bulacaksınız. Bu komutları bir araya getirerek karmaşık bir problemi çözmek için birlikte çalıştırabilirsiniz. Bu komutları Vim içinden kullanabilseydiniz harika olmaz mıydı?

Kesinlikle. Bu bölümde, Vim'i harici komutlarla sorunsuz bir şekilde çalışacak şekilde nasıl genişleteceğinizi öğreneceksiniz.

## Bang Komutu

Vim'in üç şey yapabilen bir bang (`!`) komutu vardır:

1. Harici bir komutun STDOUT'unu mevcut tampon içine okumak.
2. Tamponunuzun içeriğini bir harici komuta STDIN olarak yazmak.
3. Vim içinden bir harici komutu çalıştırmak.

Her birini inceleyelim.

## Bir Komutun STDOUT'unu Vim'e Okuma

Bir harici komutun STDOUT'unu mevcut tampon içine okumanın sözdizimi:

```shell
:r !cmd
```

`:r`, Vim'in okuma komutudur. `!` olmadan kullanırsanız, bir dosyanın içeriğini almak için kullanabilirsiniz. Mevcut dizinde `file1.txt` adında bir dosyanız varsa ve şunu çalıştırırsanız:

```shell
:r file1.txt
```

Vim, `file1.txt` dosyasının içeriğini mevcut tampon içine koyacaktır.

Bir `!` ve bir harici komut ile takip edilen `:r` komutunu çalıştırırsanız, o komutun çıktısı mevcut tampon içine eklenecektir. `ls` komutunun sonucunu almak için şunu çalıştırın:

```shell
:r !ls
```

Şu gibi bir şey döner:

```shell
file1.txt
file2.txt
file3.txt
```

`curl` komutundan verileri okuyabilirsiniz:

```shell
:r !curl -s 'https://jsonplaceholder.typicode.com/todos/1'
```

`r` komutu ayrıca bir adres kabul eder:

```shell
:10r !cat file1.txt
```

Artık `cat file1.txt` komutunun STDOUT'u 10. satırdan sonra eklenecektir.

## Tampon İçeriğini Bir Harici Komuta Yazma

`:w` komutu, bir dosyayı kaydetmenin yanı sıra, mevcut tampondaki metni bir harici komut için STDIN olarak geçmek için de kullanılabilir. Sözdizimi:

```shell
:w !cmd
```

Bu ifadeleriniz varsa:

```shell
console.log("Hello Vim");
console.log("Vim is awesome");
```

Bilgisayarınızda [node](https://nodejs.org/en/) yüklü olduğundan emin olun, ardından şunu çalıştırın:

```shell
:w !node
```

Vim, "Hello Vim" ve "Vim is awesome" yazdırmak için JavaScript ifadelerini çalıştırmak için `node` kullanacaktır.

`:w` komutunu kullanırken, Vim mevcut tampondaki tüm metinleri kullanır, bu, global komutla benzerdir (çoğu komut satırı komutu, bir aralık geçmezseniz yalnızca mevcut satırda komutu çalıştırır). Eğer `:w` komutuna belirli bir adres verirseniz:

```shell
:2w !node
```

Vim yalnızca ikinci satırdaki metni `node` yorumlayıcısına kullanır.

`:w !node` ile `:w! node` arasında ince ama önemli bir fark vardır. `:w !node` ile mevcut tampondaki metni harici komut `node`'a "yazıyorsunuz". `:w! node` ile bir dosyayı zorla kaydediyorsunuz ve dosyaya "node" adını veriyorsunuz.

## Bir Harici Komutu Çalıştırma

Bang komutunu kullanarak Vim içinden bir harici komutu çalıştırabilirsiniz. Sözdizimi:

```shell
:!cmd
```

Mevcut dizinin içeriğini uzun formatta görmek için şunu çalıştırın:

```shell
:!ls -ls
```

PID 3456'da çalışan bir süreci öldürmek için şunu çalıştırabilirsiniz:

```shell
:!kill -9 3456
```

Vim'den çıkmadan herhangi bir harici komutu çalıştırabilirsiniz, böylece görevlerinize odaklanmaya devam edebilirsiniz.

## Metinleri Filtreleme

Eğer `!`'ya bir aralık verirseniz, metinleri filtrelemek için kullanılabilir. Diyelim ki aşağıdaki metinleriniz var:

```shell
hello vim
hello vim
```

Mevcut satırı `tr` (çevir) komutunu kullanarak büyük harfe çevirelim. Şunu çalıştırın:

```shell
:.!tr '[:lower:]' '[:upper:]'
```

Sonuç:

```shell
HELLO VIM
hello vim
```

Açıklama:
- `.!` mevcut satırda filtre komutunu çalıştırır.
- `tr '[:lower:]' '[:upper:]'` tüm küçük harfleri büyük harflerle değiştirmek için `tr` komutunu çağırır.

Harici komutu filtre olarak çalıştırmak için bir aralık vermek önemlidir. Yukarıdaki komutu `.` olmadan çalıştırmaya çalışırsanız (`:!tr '[:lower:]' '[:upper:]'`), bir hata alırsınız.

Diyelim ki `awk` komutuyla her iki satırdaki ikinci sütunu kaldırmanız gerekiyor:

```shell
:%!awk "{print $1}"
```

Sonuç:

```shell
hello
hello
```

Açıklama:
- `:%!` tüm satırlarda filtre komutunu çalıştırır (`%`).
- `awk "{print $1}"` yalnızca eşleşmenin ilk sütununu yazdırır.

Terminalde olduğu gibi zincir operatörü (`|`) ile birden fazla komutu birleştirebilirsiniz. Diyelim ki bu lezzetli kahvaltı ürünlerini içeren bir dosyanız var:

```shell
name price
chocolate pancake 10
buttermilk pancake 9
blueberry pancake 12
```

Fiyatlara göre sıralayıp yalnızca menüyü eşit aralıklarla görüntülemek istiyorsanız, şunu çalıştırabilirsiniz:

```shell
:%!awk 'NR > 1' | sort -nk 3 | column -t
```

Sonuç:
```shell
buttermilk pancake 9
chocolate pancake 10
blueberry pancake 12
```

Açıklama:
- `:%!` filtreyi tüm satırlara (`%`) uygular.
- `awk 'NR > 1'` yalnızca ikinci satırdan itibaren metinleri görüntüler.
- `|` bir sonraki komutu zincirler.
- `sort -nk 3` sayısal olarak (`n`) 3. sütundaki değerleri kullanarak sıralar (`k 3`).
- `column -t` metni eşit aralıklarla düzenler.

## Normal Mod Komutu

Vim'in normal modda bir filtre operatörü (`!`) vardır. Aşağıdaki selamlamalarınız varsa:

```shell
hello vim
hola vim
bonjour vim
salve vim
```

Mevcut satırı ve altındaki satırı büyük harfe çevirmek için şunu çalıştırabilirsiniz:
```shell
!jtr '[a-z]' '[A-Z]'
```

Açıklama:
- `!j` mevcut satırı ve altındaki satırı hedef alarak normal komut filtre operatörünü (`!`) çalıştırır. Normal mod operatörü olduğu için, dilbilgisi kuralı `fiil + nesne` uygulanır. `!` fiil ve `j` nesnedir.
- `tr '[a-z]' '[A-Z]'` küçük harfleri büyük harflerle değiştirir.

Filtre normal komutu, en az bir satır veya daha uzun olan hareketler / metin nesneleri üzerinde çalışır. Eğer `!iwtr '[a-z]' '[A-Z]'` (iç kelime üzerinde `tr` çalıştırmak) çalıştırmaya çalışırsanız, `tr` komutunun tüm satıra uygulandığını, imlecinizin üzerinde olduğu kelimeye değil, göreceksiniz.

## Harici Komutları Akıllıca Öğrenin

Vim bir IDE değildir. Tasarım gereği son derece genişletilebilir hafif bir modüler editördür. Bu genişletilebilirlik sayesinde, sisteminizdeki herhangi bir harici komuta kolay erişim sağlarsınız. Bu harici komutlarla, Vim bir IDE olma yolunda bir adım daha atmış olur. Birisi Unix sisteminin şimdiye kadar yapılmış ilk IDE olduğunu söyledi.

Bang komutu, bildiğiniz harici komutlar kadar faydalıdır. Harici komut bilginiz sınırlıysa endişelenmeyin. Benim de öğrenmem gereken çok şey var. Bunu sürekli öğrenme için bir motivasyon olarak alın. Metni değiştirmeye ihtiyacınız olduğunda, probleminizi çözebilecek bir harici komut olup olmadığını kontrol edin. Her şeyi ustalaşmakla ilgili endişelenmeyin, sadece mevcut görevi tamamlamak için ihtiyaç duyduğunuz şeyleri öğrenin.