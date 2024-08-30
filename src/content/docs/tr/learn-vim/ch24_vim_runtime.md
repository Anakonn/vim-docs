---
description: Vim'in çalışma yollarını ve eklenti betiklerini anlamak için yüksek düzeyde
  bir genel bakış sunan bu bölüm, özelleştirme için ipuçları içerir.
title: Ch24. Vim Runtime
---

Önceki bölümlerde, Vim'in `~/.vim/` dizininde `pack/` (Bölüm 22) ve `compiler/` (Bölüm 19) gibi özel yolları otomatik olarak aradığını belirtmiştim. Bunlar, Vim çalışma yollarına örneklerdir.

Vim'in bu iki yoldan daha fazla çalışma yolu vardır. Bu bölümde, bu çalışma yollarının yüksek seviyeli bir genel görünümünü öğreneceksiniz. Bu bölümün amacı, bunların ne zaman çağrıldığını göstermek. Bunu bilmek, Vim'i daha iyi anlamanızı ve özelleştirmenizi sağlayacaktır.

## Çalışma Yolu

Bir Unix makinesinde, Vim çalışma yollarınızdan biri `$HOME/.vim/`'dir (Windows gibi farklı bir işletim sistemine sahipseniz, yolunuz farklı olabilir). Farklı işletim sistemleri için çalışma yollarını görmek için `:h 'runtimepath'` komutunu kontrol edin. Bu bölümde, varsayılan çalışma yolu olarak `~/.vim/` kullanacağım.

## Eklenti Betikleri

Vim, bu dizindeki herhangi bir betiği her seferinde Vim başladığında bir kez çalıştıran bir eklenti çalışma yoluna sahiptir. "Eklenti" adını Vim dışı eklentilerle (NERDTree, fzf.vim vb. gibi) karıştırmayın.

`~/.vim/` dizinine gidin ve bir `plugin/` dizini oluşturun. İki dosya oluşturun: `donut.vim` ve `chocolate.vim`.

`~/.vim/plugin/donut.vim` dosyasının içine:

```shell
echo "donut!"
```

`~/.vim/plugin/chocolate.vim` dosyasının içine:

```shell
echo "chocolate!"
```

Şimdi Vim'i kapatın. Bir sonraki sefer Vim'i başlattığınızda, hem `"donut!"` hem de `"chocolate!"` çıktısını göreceksiniz. Eklenti çalışma yolu, başlangıç betikleri için kullanılabilir.

## Dosya Türü Tespiti

Başlamadan önce, bu tespitlerin çalıştığından emin olmak için vimrc'nizin en azından aşağıdaki satırı içerdiğinden emin olun:

```shell
filetype plugin indent on
```

Daha fazla bağlam için `:h filetype-overview`'a göz atın. Temelde bu, Vim'in dosya türü tespitini açar.

Yeni bir dosya açtığınızda, Vim genellikle bunun ne tür bir dosya olduğunu bilir. Eğer bir `hello.rb` dosyanız varsa, `:set filetype?` komutunu çalıştırmak doğru yanıtı `filetype=ruby` olarak döndürür.

Vim, "yaygın" dosya türlerini (Ruby, Python, Javascript vb.) tespit etmeyi bilir. Ama ya özel bir dosyanız varsa? Vim'e bunu tespit etmeyi ve doğru dosya türü ile atamayı öğretmeniz gerekir.

İki tespit yöntemi vardır: dosya adı kullanarak ve dosya içeriği kullanarak.

### Dosya Adı Tespiti

Dosya adı tespiti, bir dosya türünü o dosyanın adı kullanarak tespit eder. `hello.rb` dosyasını açtığınızda, Vim `.rb` uzantısından bunun bir Ruby dosyası olduğunu bilir.

Dosya adı tespiti yapmak için iki yol vardır: `ftdetect/` çalışma dizinini kullanmak ve `filetype.vim` çalışma dosyasını kullanmak. Her ikisini de keşfedelim.

#### `ftdetect/`

Gizli (ama lezzetli) bir dosya oluşturalım, `hello.chocodonut`. Bunu açtığınızda ve `:set filetype?` komutunu çalıştırdığınızda, yaygın bir dosya adı uzantısı olmadığından Vim bununla ne yapacağını bilemez. `filetype=` döndürür.

Vim'e `.chocodonut` ile biten tüm dosyaları "chocodonut" dosya türü olarak ayarlamasını talimat vermeniz gerekir. Çalışma kök dizininde (`~/.vim/`) `ftdetect/` adında bir dizin oluşturun. İçine bir dosya oluşturun ve adını `chocodonut.vim` koyun (`~/.vim/ftdetect/chocodonut.vim`). Bu dosyanın içine ekleyin:

```shell
autocmd BufNewFile,BufRead *.chocodonut set filetype=chocodonut
```

`BufNewFile` ve `BufRead`, yeni bir tampon oluşturduğunuzda ve yeni bir tampon açtığınızda tetiklenir. `*.chocodonut` ifadesi, bu olayın yalnızca açılan tamponun `.chocodonut` dosya adı uzantısına sahip olması durumunda tetikleneceği anlamına gelir. Son olarak, `set filetype=chocodonut` komutu dosya türünü chocodonut türü olarak ayarlar.

Vim'i yeniden başlatın. Şimdi `hello.chocodonut` dosyasını açın ve `:set filetype?` komutunu çalıştırın. `filetype=chocodonut` döndürür.

Ağzı sulandıran! `ftdetect/` dizinine istediğiniz kadar dosya koyabilirsiniz. Gelecekte, belki `ftdetect/strawberrydonut.vim`, `ftdetect/plaindonut.vim` vb. ekleyebilirsiniz, eğer donut dosya türlerinizi genişletmeye karar verirseniz.

Aslında Vim'de bir dosya türünü ayarlamanın iki yolu vardır. Biri, az önce kullandığınız `set filetype=chocodonut`. Diğer yol ise `setfiletype chocodonut` komutunu çalıştırmaktır. İlk komut `set filetype=chocodonut` her zaman dosya türünü chocodonut türü olarak ayarlarken, ikinci komut `setfiletype chocodonut` yalnızca daha önce bir dosya türü ayarlanmamışsa dosya türünü ayarlar.

#### Dosya Türü Dosyası

İkinci dosya tespit yöntemi, kök dizininde (`~/.vim/filetype.vim`) bir `filetype.vim` oluşturmanızı gerektirir. Bunun içine şunu ekleyin:

```shell
autocmd BufNewFile,BufRead *.plaindonut set filetype=plaindonut
```

Bir `hello.plaindonut` dosyası oluşturun. Bunu açtığınızda ve `:set filetype?` komutunu çalıştırdığınızda, Vim doğru özel dosya türünü `filetype=plaindonut` olarak gösterir.

Aman Tanrım, çalışıyor! Bu arada, `filetype.vim` ile oynarsanız, bu dosyanın `hello.plaindonut` dosyasını açtığınızda birden fazla kez çalıştırıldığını fark edebilirsiniz. Bunu önlemek için, ana betiğin yalnızca bir kez çalıştırılması için bir koruma ekleyebilirsiniz. `filetype.vim` dosyasını güncelleyin:

```shell
if exists("did_load_filetypes")
  finish
endif

augroup donutfiletypedetection
  autocmd! BufRead,BufNewFile *.plaindonut setfiletype plaindonut
augroup END
```

`finish`, geri kalan betiği çalıştırmayı durdurmak için bir Vim komutudur. `"did_load_filetypes"` ifadesi, *yerleşik* bir Vim işlevi değildir. Aslında, `$VIMRUNTIME/filetype.vim` içindeki bir global değişkendir. Merak ediyorsanız, `:e $VIMRUNTIME/filetype.vim` komutunu çalıştırın. İçinde bu satırları bulacaksınız:

```shell
if exists("did_load_filetypes")
  finish
endif

let did_load_filetypes = 1
```

Vim bu dosyayı çağırdığında, `did_load_filetypes` değişkenini tanımlar ve 1 olarak ayarlar. 1, Vim'de doğru kabul edilir. `filetype.vim` dosyasının geri kalanını da okumalısınız. Vim bunu çağırdığında ne yaptığını anlamaya çalışın.

### Dosya Türü Betiği

Bir dosya türünü dosya içeriğine göre nasıl tespit edip atayacağımızı öğrenelim.

Diyelim ki, kabul edilebilir bir uzantıya sahip olmayan bir dosya koleksiyonunuz var. Bu dosyaların ortak noktası, hepsinin ilk satırında "donutify" kelimesi ile başlamasıdır. Bu dosyaları `donut` dosya türüne atamak istiyorsunuz. `sugardonut`, `glazeddonut` ve `frieddonut` (uzantısız) adında yeni dosyalar oluşturun. Her dosyanın içine bu satırı ekleyin:

```shell
donutify
```

`sugardonut` dosyasının içindeyken `:set filetype?` komutunu çalıştırdığınızda, Vim bu dosyaya hangi dosya türünü atayacağını bilmez. `filetype=` döndürür.

Çalışma kök yolunda, bir `scripts.vim` dosyası ekleyin (`~/.vim/scripts.vim`). İçine şunları ekleyin:

```shell
if did_filetype()
  finish
endif

if getline(1) =~ '^\\<donutify\\>'
  setfiletype donut
endif
```

`getline(1)` fonksiyonu, ilk satırdaki metni döndürür. İlk satırın "donutify" kelimesi ile başlayıp başlamadığını kontrol eder. `did_filetype()` ise bir Vim yerleşik fonksiyonudur. En az bir kez bir dosya türü ile ilgili bir olay tetiklendiğinde doğru dönecektir. Bu, dosya türü olayının yeniden çalıştırılmasını durdurmak için bir koruma olarak kullanılır.

`sugardonut` dosyasını açın ve `:set filetype?` komutunu çalıştırın, Vim şimdi `filetype=donut` döndürür. Başka donut dosyalarını (`glazeddonut` ve `frieddonut`) açarsanız, Vim bunların dosya türlerini de `donut` türü olarak tanır.

Not edin ki `scripts.vim`, yalnızca Vim bilinmeyen bir dosya türü ile bir dosya açtığında çalıştırılır. Eğer Vim bilinen bir dosya türü ile bir dosya açarsa, `scripts.vim` çalışmaz.

## Dosya Türü Eklentisi

Eğer Vim'in bir chocodonut dosyası açtığınızda chocodonut'a özel betikleri çalıştırmasını ve plaindonut dosyası açarken bu betikleri çalıştırmamasını istiyorsanız ne olur?

Bunu dosya türü eklenti çalışma yolu (`~/.vim/ftplugin/`) ile yapabilirsiniz. Vim, açtığınız dosya türü ile aynı adı taşıyan bir dosyayı bu dizinde arar. Bir `chocodonut.vim` dosyası oluşturun (`~/.vim/ftplugin/chocodonut.vim`):

```shell
echo "Calling from chocodonut ftplugin"
```

Başka bir ftplugin dosyası oluşturun, `plaindonut.vim` (`~/.vim/ftplugin/plaindonut.vim`):

```shell
echo "Calling from plaindonut ftplugin"
```

Artık her seferinde bir chocodonut dosya türü açtığınızda, Vim `~/.vim/ftplugin/chocodonut.vim` dosyasındaki betikleri çalıştırır. Her seferinde bir plaindonut dosya türü açtığınızda, Vim `~/.vim/ftplugin/plaindonut.vim` dosyasındaki betikleri çalıştırır.

Bir uyarı: bu dosyalar, her dosya türü ayarlandığında (`set filetype=chocodonut` gibi) çalıştırılır. Eğer 3 farklı chocodonut dosyası açarsanız, betikler toplamda üç kez çalıştırılacaktır.

## Girinti Dosyaları

Vim, açılan dosya türü ile aynı adı taşıyan bir dosyayı arayan bir girinti çalışma yoluna sahiptir. Bu girinti çalışma yollarının amacı, girinti ile ilgili kodları saklamaktır. Eğer `~/.vim/indent/chocodonut.vim` dosyanız varsa, yalnızca bir chocodonut dosya türü açtığınızda çalıştırılacaktır. Burada chocodonut dosyaları için girinti ile ilgili kodları saklayabilirsiniz.

## Renkler

Vim, renk şemalarını saklamak için bir renk çalışma yolu (`~/.vim/colors/`) vardır. Dizin içine girecek herhangi bir dosya, `:color` komut satırı komutunda görüntülenecektir.

Eğer `~/.vim/colors/beautifulprettycolors.vim` dosyanız varsa, `:color` komutunu çalıştırdığınızda ve Tab tuşuna bastığınızda, `beautifulprettycolors` renk seçeneklerinden biri olarak görünecektir. Kendi renk şemanızı eklemek istiyorsanız, burası gitmeniz gereken yerdir.

Başka insanların yaptığı renk şemalarını kontrol etmek istiyorsanız, ziyaret edilecek iyi bir yer [vimcolors](https://vimcolors.com/)dir.

## Sözdizimi Vurgulama

Vim, sözdizimi vurgulama tanımlamak için bir sözdizimi çalışma yolu (`~/.vim/syntax/`) vardır.

Diyelim ki bir `hello.chocodonut` dosyanız var, içinde şu ifadeler var:

```shell
(donut "tasty")
(donut "savory")
```

Vim şimdi doğru dosya türünü biliyor olsa da, tüm metinler aynı renkte. "donut" anahtar kelimesini vurgulamak için bir sözdizimi vurgulama kuralı ekleyelim. Yeni bir chocodonut sözdizimi dosyası oluşturun, `~/.vim/syntax/chocodonut.vim`. İçine şunu ekleyin:

```shell
syntax keyword donutKeyword donut

highlight link donutKeyword Keyword
```

Artık `hello.chocodonut` dosyasını yeniden açın. `donut` anahtar kelimeleri artık vurgulanıyor.

Bu bölüm, sözdizimi vurgulamayı derinlemesine ele almayacak. Bu geniş bir konudur. Merak ediyorsanız, `:h syntax.txt`'e göz atın.

[vim-polyglot](https://github.com/sheerun/vim-polyglot) eklentisi, birçok popüler programlama dili için vurgular sağlayan harika bir eklentidir.

## Belgeler

Bir eklenti oluşturursanız, kendi belgenizi oluşturmanız gerekecektir. Bunun için doc çalışma yolunu kullanırsınız.

Chocodonut ve plaindonut anahtar kelimeleri için temel bir belge oluşturalım. Bir `donut.txt` dosyası oluşturun (`~/.vim/doc/donut.txt`). İçine bu metinleri ekleyin:

```shell
*chocodonut* Lezzetli çikolatalı donut

*plaindonut* Çikolata tadı yok ama yine de lezzetli
```

Eğer `chocodonut` ve `plaindonut` için arama yapmaya çalışırsanız (`:h chocodonut` ve `:h plaindonut`), hiçbir şey bulamazsınız.

Öncelikle yeni yardım girişleri oluşturmak için `:helptags` komutunu çalıştırmalısınız. `:helptags ~/.vim/doc/` komutunu çalıştırın.

Artık `:h chocodonut` ve `:h plaindonut` komutlarını çalıştırdığınızda, bu yeni yardım girişlerini bulacaksınız. Dosyanın artık salt okunur olduğunu ve "yardım" dosya türüne sahip olduğunu unutmayın.
## Tembel Yükleme Betikleri

Bu bölümde öğrendiğiniz tüm çalışma zamanı yolları otomatik olarak çalıştırıldı. Eğer bir betiği manuel olarak yüklemek istiyorsanız, otomatik yükleme çalışma zamanı yolunu kullanın.

Bir otomatik yükleme dizini oluşturun (`~/.vim/autoload/`). Bu dizinin içinde yeni bir dosya oluşturun ve adını `tasty.vim` olarak belirleyin (`~/.vim/autoload/tasty.vim`). İçine:

```shell
echo "tasty.vim global"

function tasty#donut()
  echo "tasty#donut"
endfunction
```

Fonksiyon adının `tasty#donut` olduğunu, `donut()` olmadığını unutmayın. Otomatik yükleme özelliğini kullanırken, kesir işareti (`#`) gereklidir. Otomatik yükleme özelliği için fonksiyon adlandırma kuralı:

```shell
function fileName#functionName()
  ...
endfunction
```

Bu durumda, dosya adı `tasty.vim` ve fonksiyon adı (teknik olarak) `donut`'tur.

Bir fonksiyonu çağırmak için `call` komutuna ihtiyacınız var. O fonksiyonu `:call tasty#donut()` ile çağıralım.

Fonksiyonu ilk kez çağırdığınızda, *her iki* echo mesajını ("tasty.vim global" ve "tasty#donut") görmelisiniz. Sonraki `tasty#donut` fonksiyonu çağrıları yalnızca "testy#donut" echo'sunu gösterecektir.

Vim'de bir dosya açtığınızda, önceki çalışma zamanı yollarının aksine, otomatik yükleme betikleri otomatik olarak yüklenmez. Sadece `tasty#donut()`'u açıkça çağırdığınızda, Vim `tasty.vim` dosyasını arar ve içindeki her şeyi, `tasty#donut()` fonksiyonu da dahil olmak üzere yükler. Otomatik yükleme, geniş kaynaklar kullanan ancak sık kullanılmayan fonksiyonlar için mükemmel bir mekanizmadır.

İstediğiniz kadar iç içe dizin ekleyebilirsiniz. Eğer çalışma zamanı yolunuz `~/.vim/autoload/one/two/three/tasty.vim` ise, fonksiyonu `:call one#two#three#tasty#donut()` ile çağırabilirsiniz.

## Sonrası Betikler

Vim'in `~/.vim/after/` adlı bir sonrası çalışma zamanı yolu vardır ve bu yol `~/.vim/` yapısını yansıtır. Bu yoldaki her şey en son çalıştırılır, bu nedenle geliştiriciler genellikle bu yolları betik geçersiz kılmaları için kullanır.

Örneğin, `plugin/chocolate.vim` dosyasındaki betikleri geçersiz kılmak istiyorsanız, geçersiz kılma betiklerini koymak için `~/.vim/after/plugin/chocolate.vim` oluşturabilirsiniz. Vim, `~/.vim/after/plugin/chocolate.vim` dosyasını `~/.vim/plugin/chocolate.vim`'den *sonra* çalıştıracaktır.

## $VIMRUNTIME

Vim'in varsayılan betikler ve destek dosyaları için bir ortam değişkeni olan `$VIMRUNTIME` vardır. Bunu `:e $VIMRUNTIME` komutunu çalıştırarak kontrol edebilirsiniz.

Yapı tanıdık görünmelidir. Bu bölüm, bu bölümde öğrendiğiniz birçok çalışma zamanı yolunu içerir.

21. Bölümde, Vim'i açtığınızda yedi farklı konumda vimrc dosyalarını aradığını öğrenmiştiniz. Vim'in kontrol ettiği son konumun `$VIMRUNTIME/defaults.vim` olduğunu söyledim. Eğer Vim herhangi bir kullanıcı vimrc dosyası bulamazsa, Vim bir `defaults.vim` dosyasını vimrc olarak kullanır.

Hiç vim-polyglot gibi bir sözdizimi eklentisi olmadan Vim'i çalıştırmayı denediniz mi ve yine de dosyanız sözdizimsel olarak vurgulanıyor mu? Bunun nedeni, Vim çalışma zamanı yolundan bir sözdizimi dosyası bulamazsa, `$VIMRUNTIME` sözdizimi dizininden bir sözdizimi dosyası aramasıdır.

Daha fazla bilgi için `:h $VIMRUNTIME`'a bakın.

## Çalışma Yolu Seçeneği

Çalışma yolunuzu kontrol etmek için `:set runtimepath?` komutunu çalıştırın.

Eğer Vim-Plug veya popüler harici eklenti yöneticileri kullanıyorsanız, bir dizi dizin göstermelidir. Örneğin, benim gösterdiğim:

```shell
runtimepath=~/.vim,~/.vim/plugged/vim-signify,~/.vim/plugged/base16-vim,~/.vim/plugged/fzf.vim,~/.vim/plugged/fzf,~/.vim/plugged/vim-gutentags,~/.vim/plugged/tcomment_vim,~/.vim/plugged/emmet-vim,~/.vim/plugged/vim-fugitive,~/.vim/plugged/vim-sensible,~/.vim/plugged/lightline.vim, ...
```

Eklenti yöneticilerinin yaptığı şeylerden biri, her eklentiyi çalışma yoluna eklemektir. Her çalışma yolu, `~/.vim/`'e benzer kendi dizin yapısına sahip olabilir.

Eğer `~/box/of/donuts/` adlı bir dizininiz varsa ve bu dizini çalışma yolunuza eklemek istiyorsanız, vimrc'nize şunu ekleyebilirsiniz:

```shell
set rtp+=$HOME/box/of/donuts/
```

Eğer `~/box/of/donuts/` içinde bir eklenti dizini (`~/box/of/donuts/plugin/hello.vim`) ve bir ftplugin (`~/box/of/donuts/ftplugin/chocodonut.vim`) varsa, Vim, Vim'i açtığınızda `plugin/hello.vim` dosyasındaki tüm betikleri çalıştıracaktır. Ayrıca, bir chocodonut dosyası açtığınızda `ftplugin/chocodonut.vim` dosyasını da çalıştıracaktır.

Bunu kendiniz deneyin: rastgele bir yol oluşturun ve bunu çalışma yolunuza ekleyin. Bu bölümde öğrendiğiniz bazı çalışma yollarını ekleyin. Beklendiği gibi çalıştıklarından emin olun.

## Akıllı Bir Şekilde Çalışma Zamanını Öğrenin

Bunu okumak için zaman ayırın ve bu çalışma yollarıyla oynamaya başlayın. Çalışma yollarının gerçek hayatta nasıl kullanıldığını görmek için, en sevdiğiniz Vim eklentilerinden birinin deposuna gidin ve dizin yapısını inceleyin. Şimdi çoğunu anlamış olmalısınız. Takip etmeye çalışın ve büyük resmi ayırt edin. Artık Vim dizin yapısını anladığınıza göre, Vimscript öğrenmeye hazırsınız.