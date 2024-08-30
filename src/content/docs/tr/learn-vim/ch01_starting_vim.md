---
description: Bu belgede, terminalden Vim'i başlatmanın farklı yollarını öğreneceksiniz.
  Vim 8.2 sürümü üzerinden örnekler verilecektir.
title: Ch01. Starting Vim
---

Bu bölümde, terminalden Vim'i başlatmanın farklı yollarını öğreneceksiniz. Bu kılavuzu yazarken Vim 8.2 kullanıyordum. Neovim veya daha eski bir Vim sürümü kullanıyorsanız, çoğunlukla sorun yaşamazsınız, ancak bazı komutların mevcut olmayabileceğini unutmayın.

## Kurulum

Vim'i belirli bir makineye nasıl kuracağınızla ilgili ayrıntılı talimatları geçmeyeceğim. İyi haber şu ki, çoğu Unix tabanlı bilgisayarın Vim ile birlikte gelmesi gerekir. Eğer gelmediyse, çoğu dağıtımın Vim'i kurmak için bazı talimatları olmalıdır.

Vim kurulum süreci hakkında daha fazla bilgi almak için Vim'in resmi indirme web sitesine veya Vim'in resmi github deposuna göz atın:
- [Vim web sitesi](https://www.vim.org/download.php)
- [Vim github](https://github.com/vim/vim)

## Vim Komutu

Artık Vim'i kurduğunuza göre, terminalden bunu çalıştırın:

```bash
vim
```

Bir tanıtım ekranı görmelisiniz. Bu, yeni dosyanız üzerinde çalışacağınız yerdir. Çoğu metin editörü ve IDE'nin aksine, Vim bir modal editördür. "hello" yazmak istiyorsanız, `i` ile ekleme moduna geçmeniz gerekir. "hello" metnini eklemek için `ihello<Esc>` tuşlayın.

## Vim'den Çıkma

Vim'den çıkmanın birkaç yolu vardır. En yaygın olanı şudur:

```shell
:quit
```

Kısa olarak `:q` yazabilirsiniz. Bu komut, komut satırı modu komutudur (Vim modlarından bir diğeri). Normal modda `:` yazarsanız, imleç ekranın altına hareket eder ve burada bazı komutlar yazabilirsiniz. Komut satırı modunu 15. bölümde öğreneceksiniz. Eğer ekleme modundaysanız, `:` yazmak ekranda ":" karakterini üretir. Bu durumda, normal moda geri dönmeniz gerekir. Normal moda geçmek için `<Esc>` tuşlayın. Bu arada, komut satırı modundan normal moda geri dönmek için de `<Esc>` tuşlayabilirsiniz. Birçok Vim modundan normal moda "kaçabileceğinizi" göreceksiniz.

## Dosyayı Kaydetme

Değişikliklerinizi kaydetmek için şunu yazın:

```shell
:write
```

Kısa olarak `:w` yazabilirsiniz. Eğer bu yeni bir dosya ise, kaydetmeden önce ona bir isim vermeniz gerekir. Ona `file.txt` adını verelim. Şunu çalıştırın:

```shell
:w file.txt
```

Kaydedip çıkmak için `:w` ve `:q` komutlarını birleştirebilirsiniz:

```shell
:wq
```

Herhangi bir değişiklik kaydetmeden çıkmak için `:q` komutunun sonuna `!` ekleyerek zorla çıkabilirsiniz:

```shell
:q!
```

Vim'den çıkmanın başka yolları da vardır, ancak bunlar günlük olarak kullanacağınız yollardır.

## Yardım

Bu kılavuz boyunca, sizi çeşitli Vim yardım sayfalarına yönlendireceğim. Yardım sayfasına gitmek için `:help {bazı-komut}` yazabilirsiniz (`:h` kısayolu ile). `:h` komutuna bir konu veya komut adı argümanı geçebilirsiniz. Örneğin, Vim'den çıkmanın farklı yollarını öğrenmek için şunu yazın:

```shell
:h write-quit
```

"write-quit" için neden aradığımı nasıl biliyordum? Aslında bilmiyordum. Sadece `:h` yazdım, ardından "quit" yazdım, sonra `<Tab>` tuşladım. Vim, seçebileceğiniz ilgili anahtar kelimeleri gösterdi. Eğer bir şey aramanız gerekirse ("Vim bunu yapabilseydi..."), sadece `:h` yazın ve bazı anahtar kelimeleri deneyin, ardından `<Tab>` tuşlayın.

## Dosya Açma

Terminalden Vim'de bir dosya (`hello1.txt`) açmak için şunu çalıştırın:

```bash
vim hello1.txt
```

Aynı anda birden fazla dosya da açabilirsiniz:

```bash
vim hello1.txt hello2.txt hello3.txt
```

Vim, `hello1.txt`, `hello2.txt` ve `hello3.txt` dosyalarını ayrı tamponlarda açar. Tamponlar hakkında bir sonraki bölümde bilgi alacaksınız.

## Argümanlar

`vim` terminal komutuna farklı bayraklar ve seçenekler geçebilirsiniz.

Mevcut Vim sürümünü kontrol etmek için şunu çalıştırın:

```bash
vim --version
```

Bu, mevcut Vim sürümünü ve `+` veya `-` ile işaretlenmiş tüm mevcut özellikleri gösterir. Bu kılavuzdaki bazı özelliklerin belirli özelliklerin mevcut olmasını gerektirdiğini unutmayın. Örneğin, `:history` komutuyla Vim'in komut satırı geçmişini daha sonraki bir bölümde keşfedeceksiniz. Komutun çalışması için Vim'in `+cmdline_history` özelliğine sahip olması gerekir. Yeni kurduğunuz Vim'in gerekli tüm özelliklere sahip olma olasılığı yüksektir, özellikle popüler bir indirme kaynağından geldiyse.

Terminalden yaptığınız birçok şeyi Vim'in içinde de yapabilirsiniz. *İçeriden* sürümü görmek için bunu çalıştırabilirsiniz:

```shell
:version
```

`hello.txt` dosyasını açmak ve hemen bir Vim komutu yürütmek istiyorsanız, `vim` komutuna `+{cmd}` seçeneğini geçebilirsiniz.

Vim'de, `:s` komutuyla (kısaca `:substitute`) dizeleri değiştirebilirsiniz. `hello.txt` dosyasını açıp "pancake" kelimesini "bagel" ile değiştirmek istiyorsanız, şunu çalıştırın:

```bash
vim +%s/pancake/bagel/g hello.txt
```

Bu Vim komutları birleştirilebilir:

```bash
vim +%s/pancake/bagel/g +%s/bagel/egg/g +%s/egg/donut/g hello.txt
```

Vim, "pancake" kelimesinin tüm örneklerini "bagel" ile, ardından "bagel"i "egg" ile ve son olarak "egg"i "donut" ile değiştirecektir (değiştirme işlemini daha sonraki bir bölümde öğreneceksiniz).

Ayrıca `+` sözdizimi yerine bir Vim komutunu takip eden `-c` seçeneğini de geçebilirsiniz:

```bash
vim -c %s/pancake/bagel/g hello.txt
vim -c %s/pancake/bagel/g -c %s/bagel/egg/g -c %s/egg/donut/g hello.txt
```

## Birden Fazla Pencere Açma

Vim'i yatay ve dikey bölünmüş pencerelerde başlatmak için sırasıyla `-o` ve `-O` seçeneklerini kullanabilirsiniz.

İki yatay pencere ile Vim açmak için şunu çalıştırın:

```bash
vim -o2
```

5 yatay pencere ile Vim açmak için şunu çalıştırın:

```bash
vim -o5
```

5 yatay pencere açıp ilk iki pencereyi `hello1.txt` ve `hello2.txt` ile doldurmak için şunu çalıştırın:

```bash
vim -o5 hello1.txt hello2.txt
```

İki dikey pencere, 5 dikey pencere ve 2 dosya ile 5 dikey pencere açmak için:

```bash
vim -O2
vim -O5
vim -O5 hello1.txt hello2.txt
```

## Askıya Alma

Düzenleme sırasında Vim'i askıya almanız gerekiyorsa, `Ctrl-z` tuşuna basabilirsiniz. Ayrıca `:stop` veya `:suspend` komutunu da çalıştırabilirsiniz. Askıya alınan Vim'e geri dönmek için terminalden `fg` yazın.

## Vim'i Akıllıca Başlatma

`vim` komutu, diğer terminal komutları gibi birçok farklı seçenek alabilir. İki seçenek, bir Vim komutunu parametre olarak geçirmenize olanak tanır: `+{cmd}` ve `-c cmd`. Bu kılavuz boyunca daha fazla komut öğrendikçe, Vim'i başlatırken bunu uygulayıp uygulayamayacağınızı görün. Ayrıca bir terminal komutu olduğundan, `vim`'i birçok diğer terminal komutuyla birleştirebilirsiniz. Örneğin, `ls` komutunun çıktısını Vim'de düzenlenmek üzere yönlendirebilirsiniz: `ls -l | vim -`.

Terminalde `vim` komutu hakkında daha fazla bilgi almak için `man vim` komutuna göz atın. Vim editörü hakkında daha fazla bilgi almak için bu kılavuzu okumaya devam edin ve `:help` komutunu kullanın.