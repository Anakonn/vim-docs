---
description: Bu bölümde, Vim kullanarak derleme yapmayı ve Vim'in `:make` komutunun
  avantajlarını keşfetmeyi öğreneceksiniz.
title: Ch19. Compile
---

Derleme, birçok dil için önemli bir konudur. Bu bölümde, Vim'den nasıl derleme yapacağınızı öğreneceksiniz. Ayrıca, Vim'in `:make` komutundan nasıl yararlanabileceğinizi de göreceksiniz.

## Komut Satırından Derleme

Derlemek için bang operatörünü (`!`) kullanabilirsiniz. Eğer `.cpp` dosyanızı `g++` ile derlemeniz gerekiyorsa, şu komutu çalıştırın:

```shell
:!g++ hello.cpp -o hello
```

Ancak, her seferinde dosya adını ve çıktı dosya adını manuel olarak yazmak hata yapmaya açık ve sıkıcıdır. Bir makefile kullanmak en iyi yoldur.

## Make Komutu

Vim, bir makefile'ı çalıştırmak için `:make` komutuna sahiptir. Çalıştırdığınızda, Vim mevcut dizinde bir makefile arar.

Mevcut dizinde `makefile` adında bir dosya oluşturun ve içine şunları koyun:

```shell
all:
	echo "Hello all"
foo:
	echo "Hello foo"
list_pls:
	ls
```

Bunu Vim'den çalıştırın:

```shell
:make
```

Vim, bunu terminalden çalıştırdığınız gibi aynı şekilde yürütür. `:make` komutu, terminaldeki make komutu gibi parametre kabul eder. Şunu çalıştırın:

```shell
:make foo
" Çıktı "Hello foo"

:make list_pls
" ls komutunun sonucunu verir
```

`:make` komutu, kötü bir komut çalıştırırsanız herhangi bir hatayı saklamak için Vim'in quickfix'ini kullanır. Mevcut olmayan bir hedefi çalıştıralım:

```shell
:make dontexist
```

Bu komutu çalıştırırken bir hata görmelisiniz. O hatayı görmek için quickfix komutunu `:copen` çalıştırarak quickfix penceresini açın:

```shell
|| make: *** No rule to make target `dontexist'.  Stop.
```

## Make ile Derleme

Temel bir `.cpp` programını derlemek için makefile'ı kullanalım. Öncelikle, bir `hello.cpp` dosyası oluşturalım:

```shell
#include <iostream>

int main() {
    std::cout << "Hello!\n";
    return 0;
}
```

Makefile'ınızı bir `.cpp` dosyasını derleyip çalıştıracak şekilde güncelleyin:

```shell
all:
	echo "build, run"
build:
	g++ hello.cpp -o hello
run:
	./hello
```

Şimdi şunu çalıştırın:

```shell
:make build
```

`g++`, `./hello.cpp` dosyasını derler ve `./hello` oluşturur. Ardından şunu çalıştırın:

```shell
:make run
```

Terminalde `"Hello!"` yazısını görmelisiniz.

## Farklı Make Programı

`:make` komutunu çalıştırdığınızda, Vim aslında `makeprg` seçeneği altında ayarlanmış olan komutu çalıştırır. `:set makeprg?` komutunu çalıştırırsanız, şunu göreceksiniz:

```shell
makeprg=make
```

Varsayılan `:make` komutu, `make` dış komutudur. `:make` komutunu her çalıştırdığınızda `g++ {dosya-adınız}` komutunu çalıştıracak şekilde değiştirmek için şunu çalıştırın:

```shell
:set makeprg=g++\ %
```

`g++`'den sonraki boşluğu kaçırmak için `\` kullanılır. `%` sembolü Vim'de mevcut dosyayı temsil eder. `g++\\ %` komutu, `g++ hello.cpp` çalıştırmaya eşdeğerdir.

`./hello.cpp` dosyasına gidin ve ardından `:make` komutunu çalıştırın. Vim, `hello.cpp` dosyasını derler ve çıktı belirtmediğiniz için `a.out` oluşturur. Bunu, derlenmiş çıktıyı orijinal dosya adının uzantısı olmadan adlandıracak şekilde yeniden yapılandıralım. Bunu vimrc'ye ekleyin veya çalıştırın:

```shell
set makeprg=g++\ %\ -o\ %<
```

Açıklama:
- `g++\ %` yukarıdakiyle aynıdır. `<your-file>` dosyasını çalıştırmaya eşdeğerdir.
- `-o` çıktı seçeneğidir.
- `%<` Vim'de uzantısı olmayan mevcut dosya adını temsil eder (`hello.cpp` `hello` olur).

`./hello.cpp` içinden `:make` komutunu çalıştırdığınızda, `./hello` olarak derlenir. `./hello.cpp` içinden `./hello`'yu hızlıca çalıştırmak için `:!./%<` komutunu çalıştırın. Bu, `:!./{uzantısı çıkarılmış mevcut dosya adı}` çalıştırmaya eşdeğerdir.

Daha fazlası için `:h :compiler` ve `:h write-compiler-plugin`'a bakın.

## Kaydettiğinizde Otomatik Derleme

Hayatı daha da kolaylaştırmak için derlemeyi otomatikleştirebilirsiniz. Vim'in `autocmd` komutunu belirli olaylara dayalı otomatik eylemleri tetiklemek için kullanabileceğinizi hatırlayın. Her kaydettiğinizde `.cpp` dosyalarını otomatik olarak derlemek için vimrc'nize şunu ekleyin:

```shell
autocmd BufWritePost *.cpp make
```

Her seferinde bir `.cpp` dosyasında kaydettiğinizde, Vim `make` komutunu çalıştırır.

## Derleyici Değiştirme

Vim, derleyicileri hızlıca değiştirmek için `:compiler` komutuna sahiptir. Vim derlemeniz muhtemelen birkaç önceden oluşturulmuş derleyici yapılandırması ile birlikte gelir. Hangi derleyicilerin mevcut olduğunu kontrol etmek için şunu çalıştırın:

```shell
:e $VIMRUNTIME/compiler/<Tab>
```

Farklı programlama dilleri için bir derleyici listesi görmelisiniz.

`:compiler` komutunu kullanmak için, bir ruby dosyanız olduğunu varsayalım, `hello.rb` ve içinde:

```shell
puts "Hello ruby"
```

Eğer `:make` komutunu çalıştırırsanız, Vim `makeprg`'ye atanmış olan komutu çalıştırır (varsayılan `make`'dir). Eğer şunu çalıştırırsanız:

```shell
:compiler ruby
```

Vim, `$VIMRUNTIME/compiler/ruby.vim` betiğini çalıştırır ve `makeprg`'yi `ruby` komutunu kullanacak şekilde değiştirir. Artık `:set makeprg?` komutunu çalıştırdığınızda `makeprg=ruby` demelidir (bu, `$VIMRUNTIME/compiler/ruby.vim` dosyanızda ne olduğuna veya başka özel ruby derleyicileriniz olup olmadığına bağlıdır. Sizin farklı olabilir). `:compiler {diliniz}` komutu, farklı derleyicilere hızlıca geçiş yapmanızı sağlar. Bu, projenizin birden fazla dili kullanması durumunda faydalıdır.

Bir programı derlemek için `:compiler` ve `makeprg` kullanmak zorunda değilsiniz. Bir test betiği çalıştırabilir, bir dosyayı lintleyebilir, bir sinyal gönderebilir veya istediğiniz herhangi bir şeyi yapabilirsiniz.

## Özel Bir Derleyici Oluşturma

Basit bir Typescript derleyicisi oluşturalım. Makinenize Typescript'i (`npm install -g typescript`) yükleyin. Artık `tsc` komutuna sahip olmalısınız. Daha önce typescript ile oynamadıysanız, `tsc` bir Typescript dosyasını bir Javascript dosyasına derler. Diyelim ki, `hello.ts` adında bir dosyanız var:

```shell
const hello = "hello";
console.log(hello);
```

Eğer `tsc hello.ts` komutunu çalıştırırsanız, `hello.js` olarak derlenecektir. Ancak, `hello.ts` içinde aşağıdaki ifadeler varsa:

```shell
const hello = "hello";
hello = "hello again";
console.log(hello);
```

Bu bir hata verecektir çünkü `const` değişkenini değiştiremezsiniz. `tsc hello.ts` çalıştırmak bir hata verecektir:

```shell
hello.ts:2:1 - error TS2588: Cannot assign to 'person' because it is a constant.

2 person = "hello again";
  ~~~~~~


Found 1 error.
```

Basit bir Typescript derleyicisi oluşturmak için, `~/.vim/` dizininde bir `compiler` dizini oluşturun (`~/.vim/compiler/`), ardından `typescript.vim` dosyasını oluşturun (`~/.vim/compiler/typescript.vim`). İçine şunları koyun:

```shell
CompilerSet makeprg=tsc
CompilerSet errorformat=%f:\ %m
```

İlk satır, `makeprg`'yi `tsc` komutunu çalıştıracak şekilde ayarlar. İkinci satır, hata formatını dosyayı (`%f`), ardından bir literal iki nokta (`:`) ve kaçırılmış bir boşluk (`\ `), ardından hata mesajını (`%m`) gösterecek şekilde ayarlar. Hata formatlama hakkında daha fazla bilgi için `:h errorformat`'a bakın.

Diğerlerinin nasıl yaptığını görmek için bazı önceden yapılmış derleyicileri de okumalısınız. `:e $VIMRUNTIME/compiler/<bazı-dil>.vim`'e göz atın.

Bazı eklentiler Typescript dosyasıyla çakışabileceğinden, `--noplugin` bayrağını kullanarak `hello.ts` dosyasını herhangi bir eklenti olmadan açalım:

```shell
vim --noplugin hello.ts
```

`makeprg`'yi kontrol edin:

```shell
:set makeprg?
```

Varsayılan `make` programını göstermelidir. Yeni Typescript derleyicisini kullanmak için şunu çalıştırın:

```shell
:compiler typescript
```

`:set makeprg?` komutunu çalıştırdığınızda, artık `tsc` demelidir. Bunu test edelim. Şunu çalıştırın:

```shell
:make %
```

`%` sembolünün mevcut dosyayı temsil ettiğini hatırlayın. Typescript derleyicinizin beklenildiği gibi çalıştığını görün! Hata(lar) listesini görmek için `:copen` komutunu çalıştırın.

## Asenkron Derleyici

Bazen derleme uzun sürebilir. Derleme işleminiz tamamlanana kadar donmuş bir Vim'e bakmak istemezsiniz. Derlemeyi asenkron olarak yapabilseydiniz, derleme sırasında Vim'i kullanmaya devam edebilmek harika olmaz mıydı?

Neyse ki asenkron işlemleri çalıştırmak için eklentiler vardır. İki büyük eklenti şunlardır:

- [vim-dispatch](https://github.com/tpope/vim-dispatch)
- [asyncrun.vim](https://github.com/skywind3000/asyncrun.vim)

Bu bölümün geri kalanında vim-dispatch'ı ele alacağım, ancak orada bulunan tüm eklentileri denemenizi şiddetle tavsiye ederim.

*Vim ve NeoVim aslında asenkron işleri destekler, ancak bu bölümün kapsamının dışındadır. Merak ediyorsanız, `:h job-channel-overview.txt`'a göz atın.*

## Eklenti: Vim-dispatch

Vim-dispatch birkaç komuta sahiptir, ancak iki ana komut `:Make` ve `:Dispatch` komutlarıdır.

### Asenkron Make

Vim-dispatch'ın `:Make` komutu, Vim'in `:make` komutuna benzer, ancak asenkron olarak çalışır. Eğer bir Javascript projesindeyseniz ve `npm t` çalıştırmanız gerekiyorsa, makeprg'nizi şöyle ayarlamaya çalışabilirsiniz:

```shell
:set makeprg=npm\\ t
```

Eğer şunu çalıştırırsanız:

```shell
:make
```

Vim `npm t` komutunu çalıştırır, ancak JavaScript testiniz çalışırken donmuş bir ekranla karşı karşıya kalırsınız. Vim-dispatch ile sadece şunu çalıştırabilirsiniz:

```shell
:Make
```

Vim, `npm t`'yi asenkron olarak çalıştırır. Bu şekilde, `npm t` arka planda çalışırken, yaptığınız her şeyi yapmaya devam edebilirsiniz. Harika!

### Asenkron Dispatch

`:Dispatch` komutu, `:compiler` ve `:!` komutuna benzer. Vim'de herhangi bir dış komutu asenkron olarak çalıştırabilir.

Bir ruby spec dosyasının içindeyseniz ve bir testi çalıştırmanız gerekiyorsa, şunu çalıştırın:

```shell
:Dispatch bundle exec rspec %
```

Vim, mevcut dosya (`%`) üzerinde `rspec` komutunu asenkron olarak çalıştırır.

### Dispatch'i Otomatikleştirme

Vim-dispatch, belirli bir komutu otomatik olarak değerlendirmek için yapılandırabileceğiniz `b:dispatch` tampon değişkenine sahiptir. Bunu `autocmd` ile kullanabilirsiniz. Eğer vimrc'nize şunu eklerseniz:

```shell
autocmd BufEnter *_spec.rb let b:dispatch = 'bundle exec rspec %'
```

Artık `_spec.rb` ile biten bir dosyaya her girdiğinizde (`BufEnter`), `:Dispatch` çalıştırmak otomatik olarak `bundle exec rspec {mevcut-ruby-spec-dosyanız}` komutunu çalıştırır.

## Akıllı Bir Şekilde Derlemeyi Öğrenin

Bu bölümde, `make` ve `compiler` komutlarını kullanarak Vim içinden *herhangi* bir işlemi asenkron olarak çalıştırabileceğinizi öğrendiniz. Vim'in kendisini diğer programlarla genişletme yeteneği onu güçlü kılar.