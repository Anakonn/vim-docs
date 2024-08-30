---
description: Bu bölümde, Vim'i nasıl organize edeceğiniz ve vimrc dosyasını nasıl
  yapılandıracağınız hakkında bilgi edineceksiniz.
title: Ch22. Vimrc
---

Önceki bölümlerde, Vim kullanmayı öğrendiniz. Bu bölümde, vimrc'yi nasıl düzenleyeceğinizi ve yapılandıracağınızı öğreneceksiniz.

## Vim'in Vimrc'yi Bulması

vimrc için geleneksel bilgi, ana dizinde bir `.vimrc` nokta dosyası eklemektir `~/.vimrc` (bu, işletim sisteminize bağlı olarak farklı olabilir).

Arka planda, Vim bir vimrc dosyası için birden fazla yeri kontrol eder. Vim'in kontrol ettiği yerler şunlardır:
- `$VIMINIT`
- `$HOME/.vimrc`
- `$HOME/.vim/vimrc`
- `$EXINIT`
- `$HOME/.exrc`
- `$VIMRUNTIME/defaults.vim`

Vim'i başlattığınızda, yukarıdaki altı konumu bu sırayla bir vimrc dosyası için kontrol edecektir. İlk bulunan vimrc dosyası kullanılacak ve diğerleri göz ardı edilecektir.

Öncelikle Vim, `$VIMINIT`'i kontrol edecektir. Eğer orada bir şey yoksa, Vim `$HOME/.vimrc`'yi kontrol edecektir. Eğer orada da bir şey yoksa, Vim `$HOME/.vim/vimrc`'yi kontrol edecektir. Eğer Vim bunu bulursa, aramayı durduracak ve `$HOME/.vim/vimrc`'yi kullanacaktır.

İlk konum, `$VIMINIT`, bir ortam değişkenidir. Varsayılan olarak tanımsızdır. Eğer `~/dotfiles/testvimrc`'yi `$VIMINIT` değeri olarak kullanmak istiyorsanız, o vimrc'nin yolunu içeren bir ortam değişkeni oluşturabilirsiniz. `export VIMINIT='let $MYVIMRC="$HOME/dotfiles/testvimrc" | source $MYVIMRC'` komutunu çalıştırdıktan sonra, Vim artık `~/dotfiles/testvimrc`'yi vimrc dosyanız olarak kullanacaktır.

İkinci konum, `$HOME/.vimrc`, birçok Vim kullanıcısı için geleneksel yoldur. `$HOME`, birçok durumda ev dizininizdir (`~`). Eğer bir `~/.vimrc` dosyanız varsa, Vim bunu vimrc dosyanız olarak kullanacaktır.

Üçüncü konum, `$HOME/.vim/vimrc`, `~/.vim` dizininin içindedir. Eklentileriniz, özel betikleriniz veya Görünüm dosyalarınız için zaten `~/.vim` dizinine sahip olabilirsiniz. Vimrc dosya adında nokta olmadığını unutmayın (`$HOME/.vim/.vimrc` çalışmaz, ancak `$HOME/.vim/vimrc` çalışır).

Dördüncü konum, `$EXINIT`, `$VIMINIT` ile benzer şekilde çalışır.

Beşinci konum, `$HOME/.exrc`, `$HOME/.vimrc` ile benzer şekilde çalışır.

Altıncı konum, `$VIMRUNTIME/defaults.vim`, Vim kurulumunuzla birlikte gelen varsayılan vimrc'dir. Benim durumumda, Homebrew kullanarak Vim 8.2 kurulu, bu yüzden yolum (`/usr/local/share/vim/vim82`). Eğer Vim, önceki altı vimrc dosyasından hiçbirini bulamazsa, bu dosyayı kullanacaktır.

Bu bölümün geri kalanında, vimrc'nin `~/.vimrc` yolunu kullandığını varsayıyorum.

## Vimrc'me Ne Koymalıyım?

Başlarken sorduğum bir soru şuydu: "Vimrc'me ne koymalıyım?"

Cevap, "istediğin her şey". Başkalarının vimrc'sini kopyalayıp yapıştırma isteği gerçektir, ancak buna karşı koymalısınız. Eğer bir başkasının vimrc'sini kullanmaya kararlıysanız, ne yaptığını, neden ve nasıl kullandığını ve en önemlisi, sizin için uygun olup olmadığını bildiğinizden emin olun. Birisi bunu kullanıyor diye, sizin de kullanacağınız anlamına gelmez.

## Temel Vimrc İçeriği

Kısacası, bir vimrc, şunların bir koleksiyonudur:
- Eklentiler
- Ayarlar
- Özel Fonksiyonlar
- Özel Komutlar
- Haritalar

Yukarıda bahsedilmeyen başka şeyler de vardır, ancak genel olarak, bu çoğu kullanım durumunu kapsar.

### Eklentiler

Önceki bölümlerde, [fzf.vim](https://github.com/junegunn/fzf.vim), [vim-mundo](https://github.com/simnalamburt/vim-mundo) ve [vim-fugitive](https://github.com/tpope/vim-fugitive) gibi farklı eklentilerden bahsettim.

On yıl önce, eklentileri yönetmek bir kabustu. Ancak, modern eklenti yöneticilerinin yükselişi ile, eklenti yüklemek artık saniyeler içinde yapılabiliyor. Şu anda eklenti yöneticim olarak [vim-plug](https://github.com/junegunn/vim-plug) kullanıyorum, bu yüzden bu bölümde bunu kullanacağım. Diğer popüler eklenti yöneticileri ile kavram benzer olmalıdır. Farklılarını denemenizi şiddetle öneririm, örneğin:
- [vundle.vim](https://github.com/VundleVim/Vundle.vim)
- [vim-pathogen](https://github.com/tpope/vim-pathogen)
- [dein.vim](https://github.com/Shougo/dein.vim)

Yukarıda listelenenlerden daha fazla eklenti yöneticisi var, etrafa bakmaktan çekinmeyin. vim-plug'ı yüklemek için, bir Unix makineniz varsa, şu komutu çalıştırın:

```shell
curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

Yeni eklentiler eklemek için, eklenti adlarınızı (`Plug 'github-username/repository-name'`) `call plug#begin()` ve `call plug#end()` satırları arasına yerleştirin. Yani `emmet-vim` ve `nerdtree` yüklemek istiyorsanız, vimrc'nize aşağıdaki kodu ekleyin:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

Değişiklikleri kaydedin, kaynak dosyayı (`:source %`) çalıştırın ve `:PlugInstall` komutunu çalıştırarak yükleyin.

Gelecekte kullanılmayan eklentileri kaldırmanız gerektiğinde, sadece `call` bloğundan eklenti adlarını kaldırmanız, kaydetmeniz ve kaynak dosyayı çalıştırmanız ve `:PlugClean` komutunu çalıştırarak makinenizden kaldırmanız yeterlidir.

Vim 8'in kendi yerleşik paket yöneticileri vardır. Daha fazla bilgi için `:h packages`'ı kontrol edebilirsiniz. Bir sonraki bölümde, bunu nasıl kullanacağınızı göstereceğim.

### Ayarlar

Herhangi bir vimrc'de birçok `set` seçeneği görmek yaygındır. Komut satırı modundan set komutunu çalıştırırsanız, bu kalıcı değildir. Vim'i kapattığınızda kaybolur. Örneğin, her seferinde Vim'i çalıştırdığınızda `:set relativenumber number` komutunu çalıştırmak yerine, bunları vimrc'ye koyabilirsiniz:

```shell
set relativenumber number
```

Bazı ayarlar, bir değer geçirmenizi gerektirir, örneğin `set tabstop=2`. Her ayar için hangi tür değerleri kabul ettiğini öğrenmek için yardım sayfasına bakın.

Ayrıca `set` yerine `let` kullanabilirsiniz (önüne `&` eklemeyi unutmayın). `let` ile bir ifadeyi değer olarak kullanabilirsiniz. Örneğin, `'dictionary'` seçeneğini yalnızca yol mevcutsa bir yola ayarlamak için:

```shell
let s:english_dict = "/usr/share/dict/words"

if filereadable(s:english_dict)
  let &dictionary=s:english_dict
endif
```

Vimscript atamaları ve koşulları hakkında daha fazla bilgi edineceksiniz. 

Vim'deki tüm olası seçeneklerin bir listesi için `:h E355`'i kontrol edin.

### Özel Fonksiyonlar

Vimrc, özel fonksiyonlar için iyi bir yerdir. Kendi Vimscript fonksiyonlarınızı nasıl yazacağınızı daha sonraki bir bölümde öğreneceksiniz.

### Özel Komutlar

`command` ile özel bir Komut satırı komutu oluşturabilirsiniz.

Bugünün tarihini görüntülemek için temel bir `GimmeDate` komutu oluşturmak için:

```shell
:command! GimmeDate echo call("strftime", ["%F"])
```

`:GimmeDate` komutunu çalıştırdığınızda, Vim "2021-01-1" gibi bir tarih gösterecektir.

Bir girdi ile temel bir komut oluşturmak için `<args>` kullanabilirsiniz. `GimmeDate`'ye belirli bir zaman/tarih formatı geçirmek istiyorsanız:

```shell
:command! GimmeDate echo call("strftime", [<args>])

:GimmeDate "%F"
" 2020-01-01

:GimmeDate "%H:%M"
" 11:30
```

Argüman sayısını sınırlamak istiyorsanız, `-nargs` bayrağını geçirebilirsiniz. Hiç argüman geçmemek için `-nargs=0`, bir argüman geçirmek için `-nargs=1`, en az bir argüman geçirmek için `-nargs=+`, herhangi bir sayıda argüman geçirmek için `-nargs=*` ve 0 veya bir argüman geçirmek için `-nargs=?` kullanın. n'inci argümanı geçirmek istiyorsanız, `-nargs=n` kullanın (burada `n` herhangi bir tam sayıdır).

`<args>`'in iki varyantı vardır: `<f-args>` ve `<q-args>`. İlki, argümanları Vimscript fonksiyonlarına geçirmek için kullanılır. İkincisi, kullanıcı girişini otomatik olarak dizeye dönüştürmek için kullanılır.

`args` kullanarak:

```shell
:command! -nargs=1 Hello echo "Hello " . <args>
:Hello "Iggy"
" 'Hello Iggy' döner

:Hello Iggy
" Tanımsız değişken hatası
```

`q-args` kullanarak:

```shell
:command! -nargs=1 Hello echo "Hello " . <q-args>
:Hello Iggy
" 'Hello Iggy' döner
```

`f-args` kullanarak:

```shell
:function! PrintHello(person1, person2)
:  echo "Hello " . a:person1 . " and " . a:person2
:endfunction

:command! -nargs=* Hello call PrintHello(<f-args>)

:Hello Iggy1 Iggy2
" "Hello Iggy1 and Iggy2" döner
```

Yukarıdaki fonksiyonlar, Vimscript fonksiyonları bölümüne geldiğinizde çok daha anlamlı hale gelecektir.

Komut ve argümanlar hakkında daha fazla bilgi edinmek için `:h command` ve `:args`'ı kontrol edin.
### Haritalar

Eğer kendinizi sürekli olarak aynı karmaşık görevi tekrar tekrar yaparken buluyorsanız, bu görevi haritalamak için iyi bir gösterge olabilir.

Örneğin, vimrc'imde bu iki haritalama var:

```shell
nnoremap <silent> <C-f> :GFiles<CR>

nnoremap <Leader>tn :call ToggleNumber()<CR>
```

İlkinde, `Ctrl-F` tuşunu [fzf.vim](https://github.com/junegunn/fzf.vim) eklentisinin `:Gfiles` komutuna (Git dosyalarını hızlıca aramak için) haritalıyorum. İkincisinde, `<Leader>tn` tuşunu özel bir fonksiyon olan `ToggleNumber`'ı çağırmak için haritalıyorum (norelativenumber ve relativenumber seçeneklerini değiştirir). `Ctrl-F` haritalaması, Vim'in yerel sayfa kaydırmasını geçersiz kılar. Haritalamanız çakışırsa, Vim kontrollerini geçersiz kılacaktır. Bu özelliği neredeyse hiç kullanmadığım için, onu geçersiz kılmanın güvenli olduğuna karar verdim.

Bu arada, `<Leader>tn` içindeki "lider" tuşu nedir?

Vim, haritalamalar için bir lider tuşuna sahiptir. Örneğin, `<Leader>tn` tuşunu `ToggleNumber()` fonksiyonunu çalıştırmak için haritaladım. Lider tuşu olmadan `tn` kullanırdım, ancak Vim zaten `t` (till arama navigasyonu) tuşuna sahiptir. Lider tuşu ile şimdi lider olarak atanmış tuşa basabilir, ardından mevcut komutlarla çakışmadan `tn` tuşuna basabilirim. Lider tuşu, haritalama kombinasyonunu başlatmak için ayarlayabileceğiniz bir tuştur. Varsayılan olarak Vim, lider tuşu olarak ters eğik çizgi kullanır (yani `<Leader>tn` "ters-eğik-çizgi-t-n" olur).

Ben şahsen, varsayılan ters eğik çizgi yerine `<Space>`'i lider tuşu olarak kullanmayı tercih ediyorum. Lider tuşunuzu değiştirmek için vimrc'nize şunu ekleyin:

```shell
let mapleader = "\<space>"
```

Yukarıda kullanılan `nnoremap` komutu üç parçaya ayrılabilir:
- `n` normal modu temsil eder.
- `nore` yinelemeli olmayan anlamına gelir.
- `map` haritalama komutudur.

En azından `nnoremap` yerine `nmap` kullanabilirsiniz (`nmap <silent> <C-f> :Gfiles<CR>`). Ancak, olası sonsuz döngüleri önlemek için yinelemeli olmayan varyantı kullanmak iyi bir uygulamadır.

Eğer yinelemeli olarak haritalama yapmazsanız, şu olabilir. Diyelim ki `B` tuşuna bir haritalama eklemek istiyorsunuz, bu da satırın sonuna bir noktalı virgül ekleyip bir KELİME geri dönmek istiyorsunuz (Vim'de `B` tuşunun bir KELİME geri gitmek için normal mod navigasyon tuşu olduğunu hatırlayın).

```shell
nmap B A;<esc>B
```

`B` tuşuna bastığınızda... oh hayır! Vim, `;` ekliyor (bunu `Ctrl-C` ile durdurun). Neden böyle oldu? Çünkü haritalama `A;<esc>B` içinde, `B` Vim'in yerel `B` fonksiyonunu (bir KELİME geri gitmek) değil, haritalanmış fonksiyonu ifade eder. Gerçekte sahip olduğunuz şey şudur:

```shell
A;<esc>A;<esc>A;<esc>A;esc>...
```

Bu sorunu çözmek için, yinelemeli olmayan bir haritalama eklemeniz gerekir:

```shell
nnoremap B A;<esc>B
```

Şimdi `B`'yi tekrar çağırmayı deneyin. Bu sefer, satırın sonuna bir `;` ekleyip bir KELİME geri dönüyor. Bu haritalamadaki `B`, Vim'in orijinal `B` işlevselliğini temsil eder.

Vim'in farklı modlar için farklı haritaları vardır. Eğer ekleme modunda `jk` tuşuna bastığınızda ekleme modundan çıkmak için bir harita oluşturmak istiyorsanız:

```shell
inoremap jk <esc>
```

Diğer harita modları: `map` (Normal, Görsel, Seçim ve Operatör bekleyen), `vmap` (Görsel ve Seçim), `smap` (Seçim), `xmap` (Görsel), `omap` (Operatör bekleyen), `map!` (Ekleme ve Komut satırı), `lmap` (Ekleme, Komut satırı, Lang-arg), `cmap` (Komut satırı) ve `tmap` (terminal-iş). Bunları detaylı olarak ele almayacağım. Daha fazla bilgi için `:h map.txt`'yi kontrol edin.

En sezgisel, tutarlı ve hatırlaması kolay bir harita oluşturun.

## Vimrc'yi Düzenleme

Zamanla, vimrc'niz büyüyecek ve karmaşık hale gelecektir. Vimrc'nizi temiz tutmanın iki yolu vardır:
- Vimrc'nizi birkaç dosyaya ayırın.
- Vimrc dosyanızı katlayın.

### Vimrc'nizi Ayırma

Vimrc'nizi birden fazla dosyaya ayırmak için Vim'in `source` komutunu kullanabilirsiniz. Bu komut, verilen dosya argümanından komut satırı komutlarını okur.

`~/.vim` dizininde bir dosya oluşturalım ve adını `/settings` koysun (`~/.vim/settings`). İsim kendiliğinden olup istediğiniz gibi adlandırabilirsiniz.

Bunu dört bileşene ayıracaksınız:
- Üçüncü taraf eklentiler (`~/.vim/settings/plugins.vim`).
- Genel ayarlar (`~/.vim/settings/configs.vim`).
- Özel fonksiyonlar (`~/.vim/settings/functions.vim`).
- Tuş haritaları (`~/.vim/settings/mappings.vim`).

`~/.vimrc` içinde:

```shell
source $HOME/.vim/settings/plugins.vim
source $HOME/.vim/settings/configs.vim
source $HOME/.vim/settings/functions.vim
source $HOME/.vim/settings/mappings.vim
```

Bu dosyaları düzenlemek için imlecinizi yolun altına koyun ve `gf` tuşuna basın.

`~/.vim/settings/plugins.vim` içinde:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

`~/.vim/settings/configs.vim` içinde:

```shell
set nocompatible
set relativenumber
set number
```

`~/.vim/settings/functions.vim` içinde:

```shell
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
```

`~/.vim/settings/mappings.vim` içinde:

```shell
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
```

Vimrc'niz her zamanki gibi çalışmalıdır, ancak şimdi sadece dört satır uzunluğundadır!

Bu yapılandırma ile nereye gitmeniz gerektiğini kolayca bilirsiniz. Daha fazla haritalama eklemeniz gerektiğinde, bunları `/mappings.vim` dosyasına ekleyin. Gelecekte, vimrc'niz büyüdükçe daha fazla dizin ekleyebilirsiniz. Örneğin, renk şemalarınız için bir ayar oluşturmanız gerektiğinde, `~/.vim/settings/themes.vim` ekleyebilirsiniz.

### Tek Bir Vimrc Dosyası Tutma

Eğer taşınabilirliği sağlamak için tek bir vimrc dosyası tutmayı tercih ediyorsanız, işlerinizi düzenli tutmak için işaretçi katlamalarını kullanabilirsiniz. Vimrc'nizin en üstüne şunu ekleyin:

```shell
" setup folds {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}
```

Vim, mevcut tamponun hangi tür dosya türüne sahip olduğunu tespit edebilir (`:set filetype?`). Eğer bir `vim` dosya türü ise, işaretçi katlama yöntemini kullanabilirsiniz. İşaretçi katlamanın başlangıç ve bitiş katlamalarını belirtmek için `{{{` ve `}}}` kullanıldığını hatırlayın.

Vimrc'nizin geri kalanına `{{{` ve `}}}` katlamalarını ekleyin (unutmayın, bunları `"` ile yorumlayın):

```shell
" setup folds {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}

" eklentiler {{{
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
" }}}

" ayarlar {{{
set nocompatible
set relativenumber
set number
" }}}

" fonksiyonlar {{{
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
" }}}

" haritalar {{{
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
" }}}
```

Vimrc'niz şöyle görünmelidir:

```shell
+-- 6 satır: katlama ayarları -----

+-- 6 satır: eklentiler ---------

+-- 5 satır: ayarlar ---------

+-- 9 satır: fonksiyonlar -------

+-- 5 satır: haritalar --------
```

## Vim'i Vimrc ve Eklentilerle veya Eklentisiz Çalıştırma

Eğer Vim'i hem vimrc hem de eklentiler olmadan çalıştırmanız gerekiyorsa, şunu çalıştırın:

```shell
vim -u NONE
```

Eğer Vim'i vimrc olmadan ama eklentilerle başlatmanız gerekiyorsa, şunu çalıştırın:

```shell
vim -u NORC
```

Eğer Vim'i vimrc ile ama eklentisiz çalıştırmanız gerekiyorsa, şunu çalıştırın:

```shell
vim --noplugin
```

Eğer Vim'i farklı bir vimrc ile çalıştırmanız gerekiyorsa, örneğin `~/.vimrc-backup`, şunu çalıştırın:

```shell
vim -u ~/.vimrc-backup
```

Eğer Vim'i yalnızca `defaults.vim` ile ve eklentisiz çalıştırmanız gerekiyorsa, bu bozuk vimrc'yi düzeltmek için faydalıdır:

```shell
vim --clean
```

## Vimrc'yi Akıllı Bir Şekilde Yapılandırma

Vimrc, Vim özelleştirmenin önemli bir bileşenidir. Vimrc'nizi oluşturmaya başlamak için diğer insanların vimrc'lerini okumak ve zamanla inşa etmek iyi bir yoldur. En iyi vimrc, geliştirici X'in kullandığı değil, düşünce çerçevenize ve düzenleme stilinize tam olarak uyan vimrc'dir.