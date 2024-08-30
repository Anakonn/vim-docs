---
description: Bu bölüm, Vim'de hızlı arama yapmanın yollarını ve fzf.vim eklentisi
  ile arama yöntemlerini tanıtarak verimliliğinizi artırmayı amaçlamaktadır.
title: Ch03. Searching Files
---

Bu bölümün amacı, Vim'de hızlı bir şekilde nasıl arama yapacağınızı tanıtmaktır. Hızlı arama yapabilmek, Vim verimliliğinizi artırmanın harika bir yoludur. Dosyaları hızlı bir şekilde aramayı öğrendiğimde, Vim'i tam zamanlı kullanmaya geçtim.

Bu bölüm iki kısma ayrılmıştır: eklentisiz nasıl arama yapılır ve [fzf.vim](https://github.com/junegunn/fzf.vim) eklentisi ile nasıl arama yapılır. Hadi başlayalım!

## Dosyaları Açma ve Düzenleme

Vim'de bir dosyayı açmak için `:edit` komutunu kullanabilirsiniz.

```shell
:edit file.txt
```

Eğer `file.txt` mevcutsa, `file.txt` tamponunu açar. Eğer `file.txt` mevcut değilse, `file.txt` için yeni bir tampon oluşturur.

`<Tab>` ile otomatik tamamlama `:edit` ile çalışır. Örneğin, dosyanız bir [Rails](https://rubyonrails.org/) *a*pp *c*ontroller *u*sers controller dizininde `./app/controllers/users_controllers.rb` içindeyse, terimleri hızlıca genişletmek için `<Tab>` kullanabilirsiniz:

```shell
:edit a<Tab>c<Tab>u<Tab>
```

`:edit` joker karakter argümanlarını kabul eder. `*` mevcut dizindeki herhangi bir dosya ile eşleşir. Eğer sadece mevcut dizindeki `.yml` uzantılı dosyaları arıyorsanız:

```shell
:edit *.yml<Tab>
```

Vim, mevcut dizindeki tüm `.yml` dosyalarının bir listesini seçmeniz için size sunacaktır.

`**` kullanarak rekürsif arama yapabilirsiniz. Projenizdeki tüm `*.md` dosyalarını aramak istiyorsanız, ancak hangi dizinlerde olduğunu bilmiyorsanız, bunu yapabilirsiniz:

```shell
:edit **/*.md<Tab>
```

`:edit`, Vim'in yerleşik dosya gezgini `netrw`'yi çalıştırmak için de kullanılabilir. Bunu yapmak için, dosya yerine bir dizin argümanı verin:

```shell
:edit .
:edit test/unit/
```

## Dosyaları Bulma

Dosyaları `:find` ile bulabilirsiniz. Örneğin:

```shell
:find package.json
:find app/controllers/users_controller.rb
```

Otomatik tamamlama `:find` ile de çalışır:

```shell
:find p<Tab>                " package.json bulmak için
:find a<Tab>c<Tab>u<Tab>    " app/controllers/users_controller.rb bulmak için
```

`:find` ile `:edit` arasında bir benzerlik fark edebilirsiniz. Fark nedir?

## Bul ve Yol

Fark, `:find`'in `path` içinde dosya bulmasıdır, `:edit` bunu yapmaz. Şimdi `path` hakkında biraz bilgi edinelim. Yollarınızı nasıl değiştireceğinizi öğrendiğinizde, `:find` güçlü bir arama aracı haline gelebilir. Yollarınızı kontrol etmek için:

```shell
:set path?
```

Varsayılan olarak, muhtemelen şöyle görünüyordur:

```shell
path=.,/usr/include,,
```

- `.` şu anda açık olan dosyanın bulunduğu dizinde arama yapar.
- `,` mevcut dizinde arama yapar.
- `/usr/include` C kütüphanelerinin başlık dosyaları için tipik bir dizindir.

İlk iki, bağlamımızda önemlidir ve üçüncüsü şimdilik göz ardı edilebilir. Burada önemli olan, Vim'in dosyaları arayacağı yolları değiştirebileceğinizdir. Diyelim ki bu sizin proje yapınız:

```shell
app/
  assets/
  controllers/
    application_controller.rb
    comments_controller.rb
    users_controller.rb
    ...
```

Kök dizinden `users_controller.rb`'ye gitmek istiyorsanız, birkaç dizinden geçmeniz gerekir (ve oldukça fazla sekme tuşuna basmanız gerekir). Genellikle bir çerçeve ile çalışırken, zamanınızın %90'ını belirli bir dizinde harcarsınız. Bu durumda, en az tuş vuruşu ile `controllers/` dizinine gitmekle ilgilenirsiniz. `path` ayarı bu yolculuğu kısaltabilir.

Mevcut `path`'e `app/controllers/` eklemeniz gerekir. Bunu nasıl yapacağınız:

```shell
:set path+=app/controllers/
```

Artık yolunuz güncellendi, `:find u<Tab>` yazdığınızda, Vim artık "u" ile başlayan dosyaları `app/controllers/` dizisinde arayacaktır.

Eğer `app/controllers/account/users_controller.rb` gibi iç içe bir `controllers/` dizininiz varsa, Vim `users_controllers` bulamayacaktır. Bunun yerine, otomatik tamamlama `users_controller.rb` bulabilmesi için `:set path+=app/controllers/**` eklemeniz gerekir. Bu harika! Artık `users_controller`'ı 3 yerine 1 sekme tuşu ile bulabilirsiniz.

Tüm proje dizinlerini eklemeyi düşünebilirsiniz, böylece sekmeye bastığınızda, Vim o dosya için her yeri arayacaktır, şöyle:

```shell
:set path+=$PWD/**
```

`$PWD` mevcut çalışma dizinidir. Tüm projenizi `path`'e eklemeye çalışırsanız, bu küçük bir proje için işe yarayabilir, ancak büyük bir projede çok sayıda dosya varsa, bu aramanızı önemli ölçüde yavaşlatır. En çok ziyaret ettiğiniz dosya/dizinlerin `path`'ini eklemenizi öneririm.

`set path+={your-path-here}`'yi vimrc dosyanıza ekleyebilirsiniz. `path`'i güncellemek sadece birkaç saniye alır ve bu, size çok zaman kazandırabilir.

## Dosyalarda Grep ile Arama

Eğer dosyalar içinde arama yapmanız gerekiyorsa (dosyalardaki ifadeleri bulmak için), grep kullanabilirsiniz. Vim bunu yapmanın iki yoluna sahiptir:

- Dahili grep (`:vim`. Evet, `:vim` olarak yazılır. `:vimgrep` için kısadır).
- Harici grep (`:grep`).

Önce dahili grepe bakalım. `:vim` aşağıdaki sözdizimine sahiptir:

```shell
:vim /pattern/ file
```

- `/pattern/` arama teriminizin regex desenidir.
- `file` dosya argümanıdır. Birden fazla argüman geçebilirsiniz. Vim, deseninizi dosya argümanının içinde arayacaktır. `:find` gibi, `*` ve `**` joker karakterlerini geçebilirsiniz.

Örneğin, `app/controllers/` dizinindeki tüm ruby dosyaları (`.rb`) içinde "breakfast" dizesinin tüm geçişlerini aramak için:

```shell
:vim /breakfast/ app/controllers/**/*.rb
```

Bunu çalıştırdıktan sonra, ilk sonuca yönlendirileceksiniz. Vim'in `vim` arama komutu `quickfix` işlemini kullanır. Tüm arama sonuçlarını görmek için `:copen` komutunu çalıştırın. Bu, bir `quickfix` penceresini açar. İşte sizi hemen verimli hale getirecek bazı yararlı quickfix komutları:

```shell
:copen        Quickfix penceresini aç
:cclose       Quickfix penceresini kapat
:cnext        Sonraki hataya git
:cprevious    Önceki hataya git
:colder       Daha eski hata listesini aç
:cnewer       Daha yeni hata listesini aç
```

Quickfix hakkında daha fazla bilgi edinmek için `:h quickfix`'e bakın.

Dahili grep (`:vim`) çalıştırmanın, çok sayıda eşleşme varsa yavaşlayabileceğini fark edebilirsiniz. Bunun nedeni, Vim'in her eşleşen dosyayı belleğe yüklemesidir, sanki düzenleniyormuş gibi. Eğer Vim aramanızla eşleşen çok sayıda dosya bulursa, hepsini yükleyecek ve dolayısıyla büyük miktarda bellek tüketecektir.

Şimdi harici grepten bahsedelim. Varsayılan olarak, `grep` terminal komutunu kullanır. `app/controllers/` dizinindeki bir ruby dosyası içinde "lunch" aramak için bunu yapabilirsiniz:

```shell
:grep -R "lunch" app/controllers/
```

`/pattern/` yerine `"pattern"` terminal grep sözdizimini izlediğini unutmayın. Ayrıca tüm eşleşmeleri `quickfix` ile görüntüler.

Vim, `:grep` Vim komutunu çalıştırırken hangi harici programın çalıştırılacağını belirlemek için `grepprg` değişkenini tanımlar, böylece Vim'i kapatıp terminal `grep` komutunu çağırmanıza gerek kalmaz. Daha sonra, `:grep` Vim komutunu kullanırken çağrılan varsayılan programı nasıl değiştireceğinizi göstereceğim.

## Netrw ile Dosyaları Gözden Geçirme

`netrw`, Vim'in yerleşik dosya gezginidir. Bir projenin hiyerarşisini görmek için faydalıdır. `netrw`'yi çalıştırmak için `.vimrc` dosyanızda bu iki ayara ihtiyacınız var:

```shell
set nocp
filetype plugin on
```

`netrw` geniş bir konu olduğundan, yalnızca temel kullanımı ele alacağım, ancak bu, başlamanız için yeterli olmalıdır. Vim'i başlattığınızda, bir dosya yerine bir dizin parametresi vererek `netrw`'yi başlatabilirsiniz. Örneğin:

```shell
vim .
vim src/client/
vim app/controllers/
```

Vim içinde `netrw`'yi başlatmak için `:edit` komutunu kullanabilir ve bir dosya adı yerine bir dizin parametresi geçebilirsiniz:

```shell
:edit .
:edit src/client/
:edit app/controllers/
```

Dizin geçmeden `netrw` penceresini başlatmanın başka yolları da vardır:

```shell
:Explore     Mevcut dosyada netrw'yi başlatır
:Sexplore    Şaka değil. Ekranın üst yarısında netrw'yi başlatır
:Vexplore    Ekranın sol yarısında netrw'yi başlatır
```

`netrw`'yi Vim hareketleri ile gezinebilirsiniz (hareketler daha sonraki bir bölümde derinlemesine ele alınacaktır). Bir dosya veya dizin oluşturmak, silmek veya yeniden adlandırmak istiyorsanız, işte bazı yararlı `netrw` komutları:

```shell
%    Yeni bir dosya oluştur
d    Yeni bir dizin oluştur
R    Bir dosya veya dizini yeniden adlandır
D    Bir dosya veya dizini sil
```

`:h netrw` çok kapsamlıdır. Eğer zamanınız varsa kontrol edin.

Eğer `netrw`'yi çok sıkıcı buluyorsanız ve daha fazla özellik istiyorsanız, [vim-vinegar](https://github.com/tpope/vim-vinegar) `netrw`'yi geliştirmek için iyi bir eklentidir. Farklı bir dosya gezgini arıyorsanız, [NERDTree](https://github.com/preservim/nerdtree) iyi bir alternatiftir. Onlara göz atın!

## Fzf

Artık Vim'de yerleşik araçlarla dosyaları nasıl arayacağınızı öğrendiğinize göre, bunu eklentilerle nasıl yapacağınızı öğrenelim.

Modern metin düzenleyicilerin doğru yaptığı ve Vim'in yapmadığı bir şey, dosyaları bulmanın ne kadar kolay olduğudur, özellikle bulanık arama yoluyla. Bu bölümün ikinci yarısında, Vim'de aramayı kolay ve güçlü hale getirmek için [fzf.vim](https://github.com/junegunn/fzf.vim) kullanmayı göstereceğim.

## Kurulum

Öncelikle [fzf](https://github.com/junegunn/fzf) ve [ripgrep](https://github.com/BurntSushi/ripgrep) indirdiğinizden emin olun. GitHub deposundaki talimatları izleyin. `fzf` ve `rg` komutları, başarılı kurulumlardan sonra kullanılabilir olmalıdır.

Ripgrep, grep'e çok benzeyen bir arama aracıdır (bu nedenle ismi). Genellikle grep'ten daha hızlıdır ve birçok yararlı özelliğe sahiptir. Fzf, genel amaçlı bir komut satırı bulanık bulucudur. Ripgrep dahil olmak üzere herhangi bir komutla kullanılabilir. Birlikte, güçlü bir arama aracı kombinasyonu oluştururlar.

Fzf varsayılan olarak ripgrep kullanmaz, bu nedenle fzf'ye ripgrep kullanmasını söylememiz gerekir; bu, `FZF_DEFAULT_COMMAND` değişkenini tanımlayarak yapılır. Benim `.zshrc` dosyamda (`bash kullanıyorsanız `.bashrc`), bunlar var:

```shell
if type rg &> /dev/null; then
  export FZF_DEFAULT_COMMAND='rg --files'
  export FZF_DEFAULT_OPTS='-m'
fi
```

`FZF_DEFAULT_OPTS` içindeki `-m` seçeneğine dikkat edin. Bu seçenek, `<Tab>` veya `<Shift-Tab>` ile birden fazla seçim yapmamıza olanak tanır. Fzf'nin Vim ile çalışması için bu satıra ihtiyacınız yok, ancak bence sahip olmak için yararlı bir seçenektir. Çoklu dosyalarda arama ve değiştirme yapmak istediğinizde işe yarayacaktır, bunu birazdan ele alacağım. Fzf komutu daha birçok seçeneği kabul eder, ancak burada bunları ele almayacağım. Daha fazla bilgi edinmek için [fzf'nin deposuna](https://github.com/junegunn/fzf#usage) veya `man fzf`'ye bakın. En azından `export FZF_DEFAULT_COMMAND='rg'` olmalıdır.

Fzf ve ripgrep'i kurduktan sonra, fzf eklentisini ayarlayalım. Bu örnekte [vim-plug](https://github.com/junegunn/vim-plug) eklenti yöneticisini kullanıyorum, ancak herhangi bir eklenti yöneticisini kullanabilirsiniz.

`.vimrc` dosyanıza bu eklentileri ekleyin. [fzf.vim](https://github.com/junegunn/fzf.vim) eklentisini (aynı fzf yazarından) kullanmanız gerekir.

```shell
call plug#begin()
Plug 'junegunn/fzf.vim'
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
call plug#end()
```

Bu satırları ekledikten sonra, `vim`'i açmanız ve `:PlugInstall` komutunu çalıştırmanız gerekecek. Bu, vimrc dosyanızda tanımlı olan ve henüz kurulmamış tüm eklentileri yükleyecektir. Bizim durumumuzda, `fzf.vim` ve `fzf`'yi yükleyecektir.

Bu eklenti hakkında daha fazla bilgi için [fzf.vim deposuna](https://github.com/junegunn/fzf/blob/master/README-VIM.md) göz atabilirsiniz.
## Fzf Söz Dizimi

Fzf'yi verimli bir şekilde kullanmak için bazı temel fzf söz dizimlerini öğrenmelisiniz. Neyse ki, liste kısadır:

- `^` bir ön ek tam eşleşmesidir. "welcome" ile başlayan bir ifadeyi aramak için: `^welcome`.
- `$` bir son ek tam eşleşmesidir. "my friends" ile biten bir ifadeyi aramak için: `friends$`.
- `'` bir tam eşleşmedir. "welcome my friends" ifadesini aramak için: `'welcome my friends`.
- `|` bir "veya" eşleşmesidir. "friends" veya "foes" aramak için: `friends | foes`.
- `!` ters eşleşmedir. "welcome" içeren ve "friends" içermeyen bir ifadeyi aramak için: `welcome !friends`.

Bu seçenekleri karıştırıp eşleştirebilirsiniz. Örneğin, `^hello | ^welcome friends$` ifadesi "welcome" veya "hello" ile başlayan ve "friends" ile biten ifadeleri arayacaktır.

## Dosyaları Bulma

Vim içinde fzf.vim eklentisini kullanarak dosyaları aramak için `:Files` yöntemini kullanabilirsiniz. Vim'den `:Files` komutunu çalıştırın ve fzf arama istemi ile karşılaşacaksınız.

Bu komutu sık kullanacağınız için, bir klavye kısayoluna atamak iyi bir fikirdir. Ben kendi kısayolumu `Ctrl-f` olarak atadım. Vimrc dosyamda şöyle:

```shell
nnoremap <silent> <C-f> :Files<CR>
```

## Dosyaların İçinde Bulma

Dosyaların içinde arama yapmak için `:Rg` komutunu kullanabilirsiniz.

Yine, muhtemelen bunu sık kullanacağınız için, bir klavye kısayoluna atayalım. Ben kendi kısayolumu `<Leader>f` olarak atadım. `<Leader>` tuşu varsayılan olarak `\` ile eşlenmiştir.

```shell
nnoremap <silent> <Leader>f :Rg<CR>
```

## Diğer Aramalar

Fzf.vim birçok başka arama komutu sunar. Burada her birini geçmeyeceğim, ancak [buradan](https://github.com/junegunn/fzf.vim#commands) kontrol edebilirsiniz.

İşte benim fzf eşlemelerim:

```shell
nnoremap <silent> <Leader>b :Buffers<CR>
nnoremap <silent> <C-f> :Files<CR>
nnoremap <silent> <Leader>f :Rg<CR>
nnoremap <silent> <Leader>/ :BLines<CR>
nnoremap <silent> <Leader>' :Marks<CR>
nnoremap <silent> <Leader>g :Commits<CR>
nnoremap <silent> <Leader>H :Helptags<CR>
nnoremap <silent> <Leader>hh :History<CR>
nnoremap <silent> <Leader>h: :History:<CR>
nnoremap <silent> <Leader>h/ :History/<CR>
```

## Grep'i Rg ile Değiştirme

Daha önce belirtildiği gibi, Vim'de dosyalarda arama yapmanın iki yolu vardır: `:vim` ve `:grep`. `:grep`, `grepprg` anahtar kelimesini kullanarak yeniden atayabileceğiniz harici bir arama aracı kullanır. `:grep` komutunu çalıştırırken Vim'in ripgrep kullanmasını nasıl yapılandıracağınızı göstereceğim.

Şimdi `grepprg`'yi ayarlayalım, böylece `:grep` Vim komutu ripgrep'i kullansın. Vimrc dosyanıza şunu ekleyin:

```shell
set grepprg=rg\ --vimgrep\ --smart-case\ --follow
```

Yukarıdaki seçeneklerden bazılarını değiştirmekten çekinmeyin! Yukarıdaki seçeneklerin ne anlama geldiği hakkında daha fazla bilgi için `man rg`'ye bakın.

`grepprg`'yi güncelledikten sonra, artık `:grep` komutunu çalıştırdığınızda `grep` yerine `rg --vimgrep --smart-case --follow` çalıştırılır. Ripgrep kullanarak "donut" aramak isterseniz, artık `:grep "donut"` komutunu daha kısa bir şekilde çalıştırabilirsiniz; `:grep "donut" . -R` yerine.

Eski `:grep` gibi, bu yeni `:grep` de sonuçları görüntülemek için quickfix kullanır.

"Bu güzel ama ben Vim'de hiç `:grep` kullanmadım, ayrıca dosyalarda ifadeleri bulmak için `:Rg` kullanamaz mıyım? Ne zaman `:grep` kullanmam gerekecek?" diye merak ediyor olabilirsiniz.

Bu çok iyi bir soru. Birden fazla dosyada arama ve değiştirme yapmak için Vim'de `:grep` kullanmanız gerekebilir, bunu bir sonraki bölümde ele alacağım.

## Birden Fazla Dosyada Arama ve Değiştirme

VSCode gibi modern metin editörleri, bir dizi dosya arasında bir dizeyi arayıp değiştirmeyi çok kolay hale getirir. Bu bölümde, Vim'de bunu kolayca yapmanın iki farklı yöntemini göstereceğim.

İlk yöntem, projenizdeki *tüm* eşleşen ifadeleri değiştirmektir. `:grep` kullanmanız gerekecek. "pizza" kelimesinin tüm örneklerini "donut" ile değiştirmek istiyorsanız, yapmanız gerekenler şunlardır:

```shell
:grep "pizza"
:cfdo %s/pizza/donut/g | update
```

Komutları inceleyelim:

1. `:grep pizza`, "pizza" kelimesinin tüm örneklerini aramak için ripgrep kullanır (bu arada, `grepprg`'yi ripgrep kullanacak şekilde yeniden atamamış olsanız bile bu çalışır. Bunun yerine `:grep "pizza" . -R` yapmanız gerekir).
2. `:cfdo`, geçici listeğinizdeki tüm dosyalara geçirdiğiniz herhangi bir komutu çalıştırır. Bu durumda, komutunuz yer değiştirme komutu `%s/pizza/donut/g`'dir. Boru (`|`) bir zincir operatörüdür. `update` komutu, yer değiştirmeden sonra her dosyayı kaydeder. Yer değiştirme komutunu daha derinlemesine bir sonraki bölümde ele alacağım.

İkinci yöntem, seçilen dosyalarda arama ve değiştirme yapmaktır. Bu yöntemle, hangi dosyalarda seçip değiştirme yapacağınızı manuel olarak seçebilirsiniz. Yapmanız gerekenler:

1. Öncelikle tamponlarınızı temizleyin. Tampon listenizin yalnızca değiştirme uygulamak istediğiniz dosyaları içermesi çok önemlidir. Vim'i yeniden başlatabilir veya `:%bd | e#` komutunu çalıştırabilirsiniz (`%bd` tüm tamponları siler ve `e#` en son açık olan dosyayı açar).
2. `:Files` komutunu çalıştırın.
3. Arama ve değiştirme yapmak istediğiniz tüm dosyaları seçin. Birden fazla dosya seçmek için `<Tab>` / `<Shift-Tab>` kullanın. Bu, yalnızca `FZF_DEFAULT_OPTS` içinde çoklu bayrak (`-m`) varsa mümkündür.
4. `:bufdo %s/pizza/donut/g | update` komutunu çalıştırın. `:bufdo %s/pizza/donut/g | update` komutu, önceki `:cfdo %s/pizza/donut/g | update` komutuna benzer görünmektedir. Fark, tüm quickfix girişlerini (`:cfdo`) değiştirmek yerine tüm tampon girişlerini (`:bufdo`) değiştiriyor olmanızdır.

## Akıllı Bir Şekilde Aramayı Öğrenin

Arama, metin düzenlemenin temelidir. Vim'de iyi arama yapmayı öğrenmek, metin düzenleme iş akışınızı önemli ölçüde geliştirecektir.

Fzf.vim bir oyun değiştiricidir. Onu olmadan Vim kullanmayı hayal edemiyorum. Vim'e başlarken iyi bir arama aracına sahip olmanın çok önemli olduğunu düşünüyorum. Modern metin editörlerinin sahip olduğu, kolay ve güçlü bir arama özelliği gibi kritik özellikleri eksik olduğu için Vim'e geçiş yaparken zorlanan insanları gördüm. Umarım bu bölüm, Vim'e geçişinizi kolaylaştırır.

Ayrıca, Vim'in eklentiler ve harici programlarla arama işlevselliğini genişletme yeteneğini de gördünüz. Gelecekte, Vim'i hangi diğer özelliklerle genişletmek istediğinizi aklınızda bulundurun. Muhtemelen, bu özellikler zaten Vim'de mevcuttur, birisi bir eklenti oluşturmuş ya da bunun için zaten bir program vardır. Sonraki bölümde, Vim'de çok önemli bir konuyu öğreneceksiniz: Vim dil bilgisi.