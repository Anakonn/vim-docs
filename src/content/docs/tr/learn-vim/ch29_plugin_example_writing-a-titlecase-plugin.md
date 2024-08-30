---
description: Vim ile kendi eklentilerinizi yazmayı öğrenin. Bu belgede, ilk eklentim
  olan totitle-vim'in ayrıntılarını ve geliştirme sürecini keşfedin.
title: 'Ch29. Write a Plugin: Creating a Titlecase Operator'
---

Vim'de iyi olmaya başladığınızda, kendi eklentilerinizi yazmak isteyebilirsiniz. Yakın zamanda ilk Vim eklentimi, [totitle-vim](https://github.com/iggredible/totitle-vim) yazdım. Bu, Vim'in büyük harf `gU`, küçük harf `gu` ve değiştirme `g~` operatörlerine benzer bir başlık büyük harf operatörü eklentisidir.

Bu bölümde, `totitle-vim` eklentisinin ayrıntılarını sunacağım. Süreci biraz aydınlatmayı ve belki de kendi benzersiz eklentinizi oluşturmanız için ilham vermeyi umuyorum!

## Problem

Bu kılavuz da dahil olmak üzere makalelerimi yazmak için Vim kullanıyorum.

Ana sorun, başlıklar için uygun bir başlık büyük harf oluşturmak oldu. Bunu otomatikleştirmenin bir yolu, başlıktaki her kelimeyi `g/^#/ s/\<./\u\0/g` ile büyük harfle yazmaktır. Temel kullanım için bu komut yeterliydi, ancak gerçek bir başlık büyük harfi elde etmek kadar iyi değil. "Capitalize The First Letter Of Each Word" ifrasındaki "The" ve "Of" kelimeleri büyük harfle yazılmalıdır. Uygun bir büyük harfle yazma olmadan, cümle biraz garip görünüyor.

Başlangıçta bir eklenti yazmayı planlamıyordum. Ayrıca, zaten bir başlık büyük harf eklentisi olduğunu öğrendim: [vim-titlecase](https://github.com/christoomey/vim-titlecase). Ancak, istediğim gibi çalışmayan birkaç şey vardı. Ana sorun, blok görsel mod davranışıydı. Eğer şu ifadeye sahipsem:

```shell
test title one
test title two
test title three
```

"Eşit" üzerinde blok görsel vurgulama kullanırsam:

```shell
test ti[tle] one
test ti[tle] two
test ti[tle] three
```

Eğer `gt` tuşuna basarsam, eklenti bunu büyük harfle yazmayacak. Bunu `gu`, `gU` ve `g~` davranışlarıyla tutarsız buluyorum. Bu yüzden o başlık büyük harf eklentisi deposundan çalışmaya karar verdim ve `gu`, `gU` ve `g~` ile tutarlı bir başlık büyük harf eklentisi oluşturmak için bunu kullandım! Yine, vim-titlecase eklentisi mükemmel bir eklenti ve kendi başına kullanılmaya değer (gerçek şu ki, belki derinlerde sadece kendi Vim eklentimi yazmak istedim. Gerçek hayatta blok büyük harf özelliğinin sık kullanılacağını pek göremiyorum, yalnızca kenar durumları dışında).

### Eklenti İçin Planlama

İlk kod satırını yazmadan önce, başlık büyük harf kurallarının ne olduğunu belirlemem gerekiyor. [titlecaseconverter sitesi](https://titlecaseconverter.com/rules/) üzerinden farklı büyük harf kurallarının güzel bir tablosunu buldum. İngilizce dilinde en az 8 farklı büyük harf kuralı olduğunu biliyor muydunuz? *Ah!*

Sonunda, bu listedeki ortak paydaları kullanarak eklenti için yeterince iyi bir temel kural oluşturmayı başardım. Ayrıca insanların, "Hey dostum, AMA kullanıyorsun, neden APA kullanmıyorsun?" diye şikayet edeceğinden şüpheliyim. İşte temel kurallar:
- İlk kelime her zaman büyük harfle yazılır.
- Bazı zarflar, bağlaçlar ve edatlar küçük harfle yazılır.
- Eğer giriş kelimesi tamamen büyük harfle yazılmışsa, o zaman hiçbir şey yapmayın (bu bir kısaltma olabilir).

Hangi kelimelerin küçük harfle yazılacağına gelince, farklı kuralların farklı listeleri var. `a an and at but by en for in nor of off on or out per so the to up yet vs via` ile devam etmeye karar verdim.

### Kullanıcı Arayüzü İçin Planlama

Eklentinin, Vim'in mevcut büyük harf operatörlerini tamamlayan bir operatör olmasını istiyorum: `gu`, `gU` ve `g~`. Bir operatör olarak, ya bir hareket ya da bir metin nesnesi kabul etmelidir (`gtw` bir sonraki kelimeyi başlık büyük harf yapmalı, `gtiw` iç kelimeyi başlık büyük harf yapmalı, `gt$` mevcut konumdan satır sonuna kadar kelimeleri başlık büyük harf yapmalı, `gtt` mevcut satırı başlık büyük harf yapmalı, `gti(` parantez içindeki kelimeleri başlık büyük harf yapmalı, vb.). Ayrıca, kolay hatırlama için `gt` ile eşleştirilmesini istiyorum. Dahası, tüm görsel modlarla da çalışmalıdır: `v`, `V` ve `Ctrl-V`. Herhangi bir görsel modda vurgulama yapabilmeli, `gt` tuşuna basmalı ve ardından tüm vurgulanan metinler başlık büyük harf yapılmalıdır.

## Vim Çalışma Zamanı

Repo'ya baktığınızda gördüğünüz ilk şey, iki dizin olduğudur: `plugin/` ve `doc/`. Vim'i başlattığınızda, `~/.vim` dizininde özel dosyalar ve dizinler arar ve o dizindeki tüm betik dosyalarını çalıştırır. Daha fazla bilgi için, Vim Çalışma Zamanı bölümünü gözden geçirin.

Eklenti, iki Vim çalışma zamanı dizinini kullanır: `doc/` ve `plugin/`. `doc/`, yardım belgelerini koymak için bir yerdir (böylece daha sonra anahtar kelimeleri arayabilirsiniz, örneğin `:h totitle`). Daha sonra bir yardım sayfası oluşturmayı geçeceğim. Şimdi, `plugin/` üzerine odaklanalım. `plugin/` dizini, Vim açıldığında bir kez çalıştırılır. Bu dizinde bir dosya vardır: `totitle.vim`. İsim önemli değildir (bunu `whatever.vim` olarak adlandırabilirdim ve yine de çalışırdı). Eklentinin çalışmasını sağlayan tüm kod bu dosyanın içindedir.

## Eşlemeler

Hadi kodu inceleyelim!

Dosyanın başında şunu bulursunuz:

```shell
if !exists('g:totitle_default_keys')
  let g:totitle_default_keys = 1
endif
```

Vim'i başlattığınızda, `g:totitle_default_keys` henüz mevcut olmayacak, bu yüzden `!exists(...)` true döner. Bu durumda, `g:totitle_default_keys` değerini 1 olarak tanımlayın. Vim'de, 0 yanlış ve sıfırdan farklı olan her şey doğrudur (doğruyu belirtmek için 1 kullanın).

Dosyanın en altına atlayalım. Şunu göreceksiniz:

```shell
if g:totitle_default_keys
  nnoremap <expr> gt ToTitle()
  xnoremap <expr> gt ToTitle()
  nnoremap <expr> gtt ToTitle() .. '_'
endif
```

Burada ana `gt` eşlemesi tanımlanıyor. Bu durumda, dosyanın altındaki `if` koşullarına geldiğinizde, `if g:totitle_default_keys` 1 (doğru) dönecektir, bu yüzden Vim aşağıdaki eşlemeleri gerçekleştirir:
- `nnoremap <expr> gt ToTitle()` normal mod *operatörünü* eşler. Bu, `gtw` ile bir sonraki kelimeyi veya `gtiw` ile iç kelimeyi başlık büyük harf yapmanıza olanak tanır. Operatör eşlemesinin nasıl çalıştığına dair ayrıntılara daha sonra geçeceğim.
- `xnoremap <expr> gt ToTitle()` görsel mod operatörlerini eşler. Bu, görsel olarak vurgulanan metinleri başlık büyük harf yapmanıza olanak tanır.
- `nnoremap <expr> gtt ToTitle() .. '_'` normal mod satır düzeyindeki operatörü eşler (bu, `guu` ve `gUU` ile benzer). Sonundaki `.. '_'` ne yapıyor diye merak edebilirsiniz. `..`, Vim'in dize birleştirme operatörüdür. `_`, bir operatörle birlikte bir hareket olarak kullanılır. `:help _`'ye bakarsanız, alt çizginin 1 satır aşağıya saymak için kullanıldığını göreceksiniz. Bu, mevcut satırda bir operatör gerçekleştirir (diğer operatörlerle deneyin, `gU_` veya `d_` çalıştırmayı deneyin, bunun `gUU` veya `dd` ile aynı olduğunu göreceksiniz).
- Son olarak, `<expr>` argümanı, sayıyı belirtmenizi sağlar, böylece `3gtw` ile sonraki 3 kelimeyi başlık büyük harf yapabilirsiniz.

Varsayılan `gt` eşlemesini kullanmak istemiyorsanız ne olur? Sonuçta, Vim'in varsayılan `gt` (bir sonraki sekme) eşlemesini geçersiz kılıyorsunuz. `gt` yerine `gz` kullanmak isterseniz ne olur? Daha önce `if !exists('g:totitle_default_keys')` ve `if g:totitle_default_keys` kontrolü yaparken çektiğiniz zahmeti hatırlayın. Eğer vimrc'nize `let g:totitle_default_keys = 0` eklerseniz, o zaman `g:totitle_default_keys` eklenti çalıştırıldığında zaten mevcut olacaktır (vimrc'nizdeki kodlar `plugin/` çalışma zamanı dosyalarından önce çalıştırılır), bu yüzden `!exists('g:totitle_default_keys')` yanlış döner. Dahası, `if g:totitle_default_keys` yanlış olacaktır (çünkü 0 değerine sahip olacaktır), bu yüzden `gt` eşlemesini de gerçekleştirmeyecektir! Bu, kendi özel eşlemenizi Vimrc'de tanımlamanıza olanak tanır.

Kendi başlık büyük harf eşlemenizi `gz` olarak tanımlamak için, vimrc'nize şunu ekleyin:

```shell
let g:totitle_default_keys = 0

nnoremap <expr> gz ToTitle()
xnoremap <expr> gz ToTitle()
nnoremap <expr> gzz ToTitle() .. '_'
```

Kolay iş.

## ToTitle Fonksiyonu

`ToTitle()` fonksiyonu, bu dosyadaki en uzun fonksiyondur.

```shell
 function! ToTitle(type = '')
  if a:type ==# ''
    set opfunc=ToTitle
    return 'g@'
  endif

  " ToTitle() fonksiyonu çağrıldığında bunu tetikleyin
  if a:type != 'block' && a:type != 'line' && a:type != 'char'
    let l:words = a:type
    let l:wordsArr = trim(l:words)->split('\s\+')
    call map(l:wordsArr, 's:capitalize(v:val)')
    return l:wordsArr->join(' ')
  endif

  " mevcut ayarları kaydet
  let l:sel_save = &selection
  let l:reg_save = getreginfo('"')
  let l:cb_save = &clipboard
  let l:visual_marks_save = [getpos("'<"), getpos("'>")]

  try
    set clipboard= selection=inclusive
    let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}

    silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
    let l:selected_phrase = getreg('"')
    let l:WORD_PATTERN = '\<\k*\>'
    let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'

    let l:startLine = line("'<")
    let l:startCol = virtcol(".")

    " kullanıcı bir blok işlemi çağırdığında
    if a:type ==# "block"
      sil! keepj norm! gv"ad
      keepj $
      keepj pu_

      let l:lastLine = line("$")

      sil! keepj norm "ap

      let l:curLine = line(".")

      sil! keepj norm! VGg@
      exe "keepj norm! 0\<c-v>G$h\"ad"
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
      exe "keepj " . l:lastLine
      sil! keepj norm! "_dG
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>"

    " kullanıcı bir karakter veya satır işlemi çağırdığında
    else
      let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
      let l:titlecased = s:capitalizeFirstWord(l:titlecased)
      call setreg('"', l:titlecased)
      let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
      silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>"
    endif
  finally

    " ayarları geri yükle
    call setreg('"', l:reg_save)
    call setpos("'<", l:visual_marks_save[0])
    call setpos("'>", l:visual_marks_save[1])
    let &clipboard = l:cb_save
    let &selection = l:sel_save
  endtry
  return
endfunction
```

Bu çok uzun, bu yüzden parçalayalım.

*Bunu daha küçük bölümlere ayırabilirdim, ancak bu bölümü tamamlamak adına olduğu gibi bıraktım.*
## Operatör Fonksiyonu

İşte kodun ilk kısmı:

```shell
if a:type ==# ''
  set opfunc=ToTitle
  return 'g@'
endif
```

`opfunc` nedir? Neden `g@` döndürüyor?

Vim'in özel bir operatörü vardır, operatör fonksiyonu, `g@`. Bu operatör, `opfunc` seçeneğine atanmış *herhangi* bir fonksiyonu kullanmanıza olanak tanır. Eğer `opfunc`'a `Foo()` fonksiyonunu atadıysam, `g@w` çalıştırdığımda, bir sonraki kelime üzerinde `Foo()`'yu çalıştırıyorum. Eğer `g@i(` çalıştırırsam, iç parantezler üzerinde `Foo()`'yu çalıştırıyorum. Bu operatör fonksiyonu, kendi Vim operatörünüzü oluşturmak için kritik öneme sahiptir.

Aşağıdaki satır, `opfunc`'ı `ToTitle` fonksiyonuna atar.

```shell
set opfunc=ToTitle
```

Sonraki satır kelimenin tam anlamıyla `g@` döndürüyor:

```shell
return g@
```

Peki bu iki satır tam olarak nasıl çalışıyor ve neden `g@` döndürüyor?

Aşağıdaki gibi bir harita olduğunu varsayalım:

```shell
nnoremap <expr> gt ToTitle()`
```

Sonra `gtw` tuşuna basıyorsunuz (bir sonraki kelimeyi baş harfleri büyük yap). `gtw`'yi ilk çalıştırdığınızda, Vim `ToTitle()` metodunu çağırır. Ama şu anda `opfunc` hala boş. Ayrıca `ToTitle()`'a herhangi bir argüman da geçmiyorsunuz, bu nedenle `a:type` değeri `''` olacaktır. Bu, koşullu ifadenin argümanı `a:type`, `if a:type ==# ''`, doğru olmasını sağlar. İçeride, `opfunc`'ı `ToTitle` fonksiyonuna `set opfunc=ToTitle` ile atıyorsunuz. Artık `opfunc` `ToTitle`'a atanmış durumda. Son olarak, `opfunc`'ı `ToTitle` fonksiyonuna atadıktan sonra, `g@` döndürüyorsunuz. Neden `g@` döndüğünü aşağıda açıklayacağım.

Henüz işiniz bitmedi. Unutmayın, henüz `gtw` tuşuna bastınız. `gt` tuşuna basmak yukarıdaki tüm işlemleri gerçekleştirdi, ancak hala işlenmesi gereken `w` var. `g@` döndürerek, bu noktada teknik olarak `g@w`'ye sahip oluyorsunuz (bu yüzden `return g@` var). `g@` fonksiyon operatörü olduğundan, ona `w` hareketini geçiriyorsunuz. Bu nedenle Vim, `g@w`'yi aldığında, `ToTitle`'ı *bir kez daha* çağırıyor (merak etmeyin, birazdan göreceğiniz gibi sonsuz döngüye girmeyeceksiniz).

Özetlemek gerekirse, `gtw` tuşuna basarak Vim, `opfunc`'ın boş olup olmadığını kontrol eder. Eğer boşsa, Vim bunu `ToTitle` ile atayacaktır. Sonra `g@` döndürür, bu da aslında `ToTitle`'ı bir kez daha çağırarak onu bir operatör olarak kullanabilmenizi sağlar. Bu, özel bir operatör oluşturmanın en karmaşık kısmıdır ve bunu başardınız! Şimdi, `ToTitle()` için girişi gerçekten baş harfleri büyük yapacak mantığı oluşturmanız gerekiyor.

## Girişi İşleme

Artık `gt` operatör olarak `ToTitle()`'ı çalıştırıyor. Ama sonraki adım ne? Metni nasıl baş harfleri büyük yapıyorsunuz?

Vim'de herhangi bir operatörü çalıştırdığınızda, üç farklı hareket türü vardır: karakter, satır ve blok. `g@w` (kelime) bir karakter işlemi örneğidir. `g@j` (bir satır aşağı) bir satır işlemi örneğidir. Blok işlemi nadirdir, ancak genellikle `Ctrl-V` (görsel blok) işlemi yapıldığında blok işlemi olarak sayılır. Birkaç karakter ileri / geri hedefleyen işlemler genellikle karakter işlemleri olarak kabul edilir (`b`, `e`, `w`, `ge`, vb.). Birkaç satırı aşağı / yukarı hedefleyen işlemler genellikle satır işlemleri olarak kabul edilir (`j`, `k`). Sütunları ileri, geri, yukarı veya aşağı hedefleyen işlemler genellikle blok işlemleri olarak kabul edilir (genellikle ya bir sütun zorunlu hareketi ya da blok görsel modu; daha fazla bilgi için: `:h forced-motion`).

Bu, `g@w` tuşuna bastığınızda, `g@`'nın `ToTitle()`'a bir literal dize `"char"` geçeceği anlamına gelir. Eğer `g@j` yaparsanız, `g@` `ToTitle()`'a bir literal dize `"line"` geçecektir. Bu dize, `ToTitle` fonksiyonuna `type` argümanı olarak geçecektir.

## Kendi Özel Fonksiyon Operatörünüzü Oluşturma

Bir duralım ve `g@` ile oynamak için bir sahte fonksiyon yazalım:

```shell
function! Test(some_arg)
  echom a:some_arg 
endfunction
```

Şimdi bu fonksiyonu `opfunc`'a atamak için:

```shell
:set opfunc=Test
```

`g@` operatörü `Test(some_arg)`'ı çalıştıracak ve `"char"`, `"line"` veya `"block"`'tan birini argüman olarak geçecektir. `g@iw` (iç kelime), `g@j` (bir satır aşağı), `g@$` (satır sonuna) gibi farklı işlemler yapın. Hangi farklı değerlerin yankılandığını görün. Blok işlemini test etmek için, Vim'in blok işlemleri için zorunlu hareketini kullanabilirsiniz: `g@Ctrl-Vj` (blok işlemi bir sütun aşağı).

Ayrıca bunu görsel modda da kullanabilirsiniz. `v`, `V` ve `Ctrl-V` gibi çeşitli görsel vurguları kullanın, ardından `g@` tuşuna basın (uyarı, çıktı yankısı çok hızlı bir şekilde yanıp sönecek, bu yüzden hızlı bir gözünüz olmalı - ama yankı kesinlikle orada. Ayrıca, `echom` kullandığınız için, kaydedilen yankı mesajlarını `:messages` ile kontrol edebilirsiniz).

Oldukça havalı, değil mi? Vim ile programlayabileceğiniz şeyler! Bunu okulda neden öğretmediler? Eklentimize devam edelim.

## ToTitle Fonksiyonu Olarak

Sonraki birkaç satıra geçelim:

```shell
if a:type != 'block' && a:type != 'line' && a:type != 'char'
  let l:words = a:type
  let l:wordsArr = trim(l:words)->split('\s\+')
  call map(l:wordsArr, 's:capitalize(v:val)')
  return l:wordsArr->join(' ')
endif
```

Bu satır aslında `ToTitle()`'ın bir operatör olarak davranışıyla ilgili değildir, ancak onu çağrılabilir bir TitleCase fonksiyonu haline getirmek içindir (evet, Tek Sorumluluk Prensibi'ni ihlal ettiğimin farkındayım). Motivasyon, Vim'in herhangi bir verilen dizeyi büyük harfe ve küçük harfe dönüştüren yerel `toupper()` ve `tolower()` fonksiyonlarına sahip olmasıdır. Örnek: `:echo toupper('hello')` `'HELLO'` döndürür ve `:echo tolower('HELLO')` `'hello'` döndürür. Bu eklentinin `ToTitle`'ı çalıştırabilme yeteneğine sahip olmasını istiyorum, böylece `:echo ToTitle('bir zamanlar')` yazdığınızda `'Bir Zamanlar'` döndürmesini sağlayabilirsiniz.

Artık, `g@` ile `ToTitle(type)` çağırdığınızda, `type` argümanının ya `'block'`, ya `'line'`, ya da `'char'` değerine sahip olacağını biliyorsunuz. Eğer argüman ne `'block'`, ne `'line'`, ne de `'char'` ise, `ToTitle()`'ın `g@` dışında çağrıldığını güvenle varsayabilirsiniz. Bu durumda, onları boşluklara göre (`\s\+`) ayırırsınız:

```shell
let l:wordsArr = trim(l:words)->split('\s\+')
```

Sonra her bir öğeyi büyük harf yaparsınız:

```shell
call map(l:wordsArr, 's:capitalize(v:val)')
```

Sonra onları tekrar bir araya getirirsiniz:

```shell
l:wordsArr->join(' ')
```

`capitalize()` fonksiyonu daha sonra ele alınacaktır.

## Geçici Değişkenler

Sonraki birkaç satır:

```shell
let l:sel_save = &selection
let l:reg_save = getreginfo('"')
let l:cb_save = &clipboard
let l:visual_marks_save = [getpos("'<"), getpos("'>")]
```

Bu satırlar, çeşitli mevcut durumları geçici değişkenlere kaydeder. Daha sonra görsel modlar, işaretler ve kayıtlar kullanacaksınız. Bunu yapmak, bazı durumlarla oynamaya neden olacaktır. Geçmişi revize etmek istemediğiniz için, bunları geçici değişkenlere kaydetmeniz gerekir, böylece durumları daha sonra geri yükleyebilirsiniz.
## Seçimleri Büyük Harfle Başlatma

Sonraki satırlar önemlidir:

```shell
try
  set clipboard= selection=inclusive
  let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}

  silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
  let l:selected_phrase = getreg('"')
  let l:WORD_PATTERN = '\<\k*\>'
  let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'

  let l:startLine = line("'<")
  let l:startCol = virtcol(".")
```
Bunları küçük parçalar halinde inceleyelim. Bu satır:

```shell
set clipboard= selection=inclusive
```

Öncelikle `selection` seçeneğini kapsayıcı olarak ayarlıyorsunuz ve `clipboard`'ı boş bırakıyorsunuz. Seçim niteliği genellikle görsel mod ile kullanılır ve üç olası değeri vardır: `old`, `inclusive` ve `exclusive`. Kapsayıcı olarak ayarlamak, seçimin son karakterinin dahil olduğu anlamına gelir. Burada bunları ele almayacağım, ancak kapsayıcı olarak seçmek, görsel modda tutarlı bir şekilde davranmasını sağlar. Varsayılan olarak Vim bunu kapsayıcı olarak ayarlar, ancak burada yine de bir eklentinizin farklı bir değere ayarlaması durumunda bunu ayarlıyorsunuz. Gerçekten ne yaptıklarını merak ediyorsanız `:h 'clipboard'` ve `:h 'selection'`'a göz atabilirsiniz.

Sonraki satırda garip görünen bir hash ve ardından bir execute komutu var:

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
```

Öncelikle, `#{}` sözdizimi Vim'in sözlük veri tipidir. Yerel değişken `l:commands`, 'lines', 'char' ve 'block' anahtarlarına sahip bir hash'tir. `silent exe '...'` komutu, string içindeki herhangi bir komutu sessizce çalıştırır (aksi takdirde ekranınızın altına bildirimler gösterir).

İkincisi, yürütülen komutlar `'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')` şeklindedir. İlk komut, `noautocmd`, sonraki komutu herhangi bir otomatik komut tetiklenmeden çalıştırır. İkincisi, `keepjumps`, hareket ederken imleç hareketini kaydetmemek içindir. Vim'de belirli hareketler otomatik olarak değişiklik listesinde, atlama listesinde ve işaret listesinde kaydedilir. Bu, bunu engeller. `noautocmd` ve `keepjumps` kullanmanın amacı yan etkileri önlemektir. Son olarak, `normal` komutu stringleri normal komutlar olarak yürütür. `..` Vim'in string interpolasyon sözdizimidir. `get()` bir liste, blob veya sözlük kabul eden bir getter yöntemidir. Bu durumda, sözlük `l:commands`'ı geçiriyorsunuz. Anahtar `a:type`'dir. Daha önce öğrendiğiniz gibi `a:type` ya 'char', 'line' ya da 'block' değerlerinden biridir. Yani, eğer `a:type` 'line' ise, `"noautocmd keepjumps normal! '[V']y"` komutunu çalıştıracaksınız (daha fazlası için `:h silent`, `:h :exe`, `:h :noautocmd`, `:h :keepjumps`, `:h :normal` ve `:h get()`'e göz atın).

`'[V']y` komutunun ne yaptığını inceleyelim. Öncelikle, şu metin parçasına sahip olduğunuzu varsayın:

```shell
the second breakfast
is better than the first breakfast
```
Kursörünüzün ilk satırda olduğunu varsayalım. Sonra `g@j` tuşuna basıyorsunuz (operatör fonksiyonunu, `g@`, bir satır aşağıda `j` ile çalıştırıyorsunuz). `'[` kursörü daha önce değiştirilmiş veya yankılanmış metnin başlangıcına taşır. Teknik olarak `g@j` ile herhangi bir metni değiştirmediğiniz veya yankılamadığınız halde, Vim `g@` komutunun başlangıç ve bitiş hareketlerinin konumlarını `'[` ve `']` ile hatırlar (daha fazlası için `:h g@`'ya göz atın). Sizin durumunuzda, `'[` tuşuna basmak kursörünüzü ilk satıra taşır çünkü `g@`'yi çalıştırdığınızda orada başladınız. `V` bir satır bazında görsel mod komutudur. Son olarak, `']` kursörünüzü önceki değiştirilmiş veya yankılanmış metnin sonuna taşır, ancak bu durumda son `g@` işleminizin sonuna taşır. Son olarak, `y` seçilen metni yankılar.

Yaptığınız şey, `g@` üzerinde gerçekleştirdiğiniz aynı metin parçasını yankılamaktı.

Buradaki diğer iki komuta bakalım:

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
```

Hepsi benzer işlemler gerçekleştirir, ancak satır bazında eylemler yerine karakter bazında veya blok bazında eylemler kullanırsınız. Tekrar etmekten sıkılacağım ama her üç durumda da aslında `g@` üzerinde gerçekleştirdiğiniz aynı metin parçasını yankılıyorsunuz.

Sonraki satıra bakalım:

```shell
let l:selected_phrase = getreg('"')
```

Bu satır, isimsiz kaydın (`"`) içeriğini alır ve `l:selected_phrase` değişkenine kaydeder. Bir dakika... az önce bir metin parçasını yankılamadınız mı? İsimlendirilmemiş kayıt şu anda az önce yankıladığınız metni içeriyor. Bu, bu eklentinin metnin bir kopyasını alabilmesinin yoludur.

Sonraki satır, bir düzenli ifade desenidir:

```shell
let l:WORD_PATTERN = '\<\k*\>'
```

`\<` ve `\>` kelime sınırı desenleridir. `\<` karakterinden sonraki karakter bir kelimenin başlangıcını, `\>` karakterinden önceki karakter ise bir kelimenin sonunu eşleştirir. `\k` anahtar kelime desenidir. Vim'in hangi karakterleri anahtar kelime olarak kabul ettiğini görmek için `:set iskeyword?` komutunu kullanabilirsiniz. Vim'deki `w` hareketinin kursörü kelime bazında hareket ettirdiğini hatırlayın. Vim, "anahtar kelime" kavramına dair önceden belirlenmiş bir anlayışa sahiptir (bunları `iskeyword` seçeneğini değiştirerek bile düzenleyebilirsiniz). Daha fazlası için `:h /\<`, `:h /\>`, `:h /\k` ve `:h 'iskeyword'`'e göz atın. Son olarak, `*` sonraki desenin sıfır veya daha fazlasını ifade eder.

Büyük resimde, `'\<\k*\>'` bir kelimeyi eşleştirir. Eğer bir stringiniz varsa:

```shell
one two three
```

Desenle eşleştirmek üç eşleşme verir: "one", "two" ve "three".

Son olarak, başka bir desen var:

```shell
let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'
```

Vim'in değiştirme komutunun `\={your-expression}` ile bir ifade ile kullanılabileceğini hatırlayın. Örneğin, mevcut satırda "donut" stringini büyük harfle başlatmak istiyorsanız, Vim'in `toupper()` fonksiyonunu kullanabilirsiniz. Bunu `:%s/donut/\=toupper(submatch(0))/g` komutunu çalıştırarak başarabilirsiniz. `submatch(0)` değiştirme komutunda kullanılan özel bir ifadedir. Eşleşen metnin tamamını döndürür.

Sonraki iki satır:

```shell
let l:startLine = line("'<")
let l:startCol = virtcol(".")
```

`line()` ifadesi bir satır numarası döndürür. Burada, son seçilen görsel alanın ilk satırını temsil eden `'<` işareti ile geçiriyorsunuz. Görsel modda metni yankıladığınızı hatırlayın. `'<` o görsel alan seçiminin başlangıç satır numarasını döndürür. `virtcol()` ifadesi mevcut kursörün sütun numarasını döndürür. Birazdan kursörünüzü her yere hareket ettireceksiniz, bu yüzden daha sonra buraya dönebilmek için kursör konumunuzu kaydetmeniz gerekiyor.

Burada bir ara verin ve şimdiye kadar her şeyi gözden geçirin. Hala takip ettiğinizden emin olun. Hazır olduğunuzda, devam edelim.
## Bir Blok İşlemi Yönetimi

Bu bölümü inceleyelim:

```shell
if a:type ==# "block"
  sil! keepj norm! gv"ad
  keepj $
  keepj pu_

  let l:lastLine = line("$")

  sil! keepj norm "ap

  let l:curLine = line(".")

  sil! keepj norm! VGg@
  exe "keepj norm! 0\<c-v>G$h\"ad" 
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
  exe "keepj " . l:lastLine
  sil! keepj norm! "_dG
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Artık metninizi büyük harfle başlatma zamanı. `a:type`'in ya 'char', ya 'line' ya da 'block' olduğunu hatırlayın. Çoğu durumda muhtemelen 'char' ve 'line' alacaksınız. Ama ara sıra bir blok alabilirsiniz. Bu nadirdir ama yine de ele alınmalıdır. Ne yazık ki, bir bloğu yönetmek, karakter ve satır yönetmek kadar kolay değildir. Biraz ekstra çaba gerektirecek, ama yapılabilir.

Başlamadan önce, bir bloğu nasıl alabileceğinize dair bir örnek alalım. Bu metne sahip olduğunuzu varsayalım:

```shell
kahvaltıda krep
öğle yemeğinde krep
akşam yemeğinde krep
```

Kursörünüzün ilk satırdaki "k" harfinin üzerinde olduğunu varsayın. Ardından, görsel blok (`Ctrl-V`) kullanarak aşağıya ve ileriye doğru "krep" kelimesini üç satırda seçmek için seçersiniz:

```shell
ka[kre]p için kahvaltı
ka[kre]p için öğle yemeği
ka[kre]p için akşam yemeği
```

`gt` tuşuna bastığınızda, şunu almak istersiniz:

```shell
kaKrep için kahvaltı
kaKrep için öğle yemeği
kaKrep için akşam yemeği

```
Temel varsayımlarınız şunlardır: "krep" kelimelerinin üçünü vurguladığınızda, Vim'e vurgulamak istediğiniz üç satır kelimeniz olduğunu söylüyorsunuz. Bu kelimeler "krep", "krep" ve "krep". "Krep", "Krep" ve "Krep" almayı bekliyorsunuz.

Uygulama detaylarına geçelim. Aşağıdaki birkaç satırda:

```shell
sil! keepj norm! gv"ad
keepj $
keepj pu_
let l:lastLine = line("$")
sil! keepj norm "ap
let l:curLine = line(".")
```

İlk satır:

```shell
sil! keepj norm! gv"ad
```

`sil!`'in sessiz çalıştığını ve `keepj`'in hareket ederken atlama geçmişini koruduğunu hatırlayın. Ardından normal komut `gv"ad`'yi yürütüyorsunuz. `gv`, son görsel olarak vurgulanan metni seçer (krep örneğinde, üç 'krep'i yeniden vurgulayacaktır). `"ad` görsel olarak vurgulanan metinleri siler ve bunları a kaydına kaydeder. Sonuç olarak, şimdi şunları elde edersiniz:

```shell
ka için kahvaltı
ka için öğle yemeği
ka için akşam yemeği
```

Artık a kaydında 3 *blok* (satır değil) 'krep' var. Bu ayrım önemlidir. Bir metni satır bazında görsel mod ile almak, bir metni blok bazında görsel mod ile almaktan farklıdır. Bunu aklınızda bulundurun çünkü bunu daha sonra tekrar göreceksiniz.

Sonraki satırlarda:

```shell
keepj $
keepj pu_
```

`$`, sizi dosyanızdaki son satıra taşır. `pu_`, kursörünüzün olduğu yerin bir satır altına ekler. Atlama geçmişini değiştirmemek için bunları `keepj` ile çalıştırmak istersiniz.

Sonra son satır numaranızı (`line("$")`) yerel değişken `lastLine`'de saklarsınız.

```shell
let l:lastLine = line("$")
```

Ardından, kayıttan içeriği `norm "ap` ile yapıştırırsınız.

```shell
sil! keepj norm "ap
```

Bunun, dosyanın sonundaki yeni satırda gerçekleştiğini unutmayın - şu anda dosyanın en altındasınız. Yapıştırma, size bu *blok* metinleri verir:

```shell
krep
krep
krep
```

Sonraki adımda, kursörünüzün bulunduğu mevcut satırın konumunu saklarsınız.

```shell
let l:curLine = line(".")
```

Şimdi bir sonraki birkaç satıra geçelim:

```shell
sil! keepj norm! VGg@
exe "keepj norm! 0\<c-v>G$h\"ad"
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
exe "keepj " . l:lastLine
sil! keepj norm! "_dG
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Bu satır:

```shell
sil! keepj norm! VGg@
```

`VG`, mevcut satırdan dosyanın sonuna kadar satır görsel moduyla vurgular. Yani burada üç 'krep' metnini satır bazında vurguluyorsunuz (blok ile satır arasındaki ayrımı hatırlayın). Üç "krep" metnini ilk yapıştırdığınızda, bunları blok olarak yapıştırıyordunuz. Şimdi bunları satır olarak vurguluyorsunuz. Dışarıdan aynı görünebilirler, ancak içsel olarak Vim, metin bloklarını yapıştırmak ile satırları yapıştırmak arasındaki farkı bilir.

```shell
krep
krep
krep
```

`g@` işlev operatörüdür, bu nedenle aslında kendisine özyinelemeli bir çağrı yapıyorsunuz. Ama neden? Bu neyi başarır?

`g@`'ye özyinelemeli bir çağrı yapıyorsunuz ve ona üç satır 'krep' metnini geçiriyorsunuz (bunu `V` ile çalıştırdıktan sonra artık satırlarınız var, bloklar değil) böylece kodun diğer kısmı tarafından işlenecektir (bunu daha sonra geçeceksiniz). `g@`'yi çalıştırmanın sonucu, düzgün bir şekilde baş harfleri büyük olan üç satır metin olacaktır:

```shell
Krep
Krep
Krep
```

Sonraki satır:

```shell
exe "keepj norm! 0\<c-v>G$h\"ad"
```

Bu, normal mod komutunu kullanarak satırın başına gitmek (`0`), blok görsel vurgusunu kullanarak son satıra ve o satırdaki son karaktere gitmek (`<c-v>G$`) için çalıştırılır. `h`, kursörü ayarlamak içindir (Vim `$` yaptığında bir ekstra satıra sağa kayar). Son olarak, vurgulanan metni siler ve a kaydına kaydeder (`"ad`).

Sonraki satır:

```shell
exe "keepj " . l:startLine
```

Kursörünüzü `startLine`'in olduğu yere geri getirirsiniz.

Sonra:

```shell
exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
```

`startLine` konumunda iken, şimdi `startCol` ile işaretlenmiş sütuna atlayın. `\<bar>\` çubuğu `|` hareketidir. Vim'deki çubuk hareketi, kursörünüzü n'inci sütuna taşır (örneğin, `startCol` 4 ise, `4|` çalıştırmak kursörünüzü 4 sütun konumuna atlayacaktır). `startCol`'un, baş harflerini büyük yapmak istediğiniz metnin sütun konumunu sakladığı yer olduğunu hatırlayın. Son olarak, `"aP` kaydında saklanan metinleri yapıştırır. Bu, metni daha önce silindiği yere geri koyar.

Sonraki 4 satıra bakalım:

```shell
exe "keepj " . l:lastLine
sil! keepj norm! "_dG
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

`exe "keepj " . l:lastLine` kursörünüzü daha önceki `lastLine` konumuna geri getirir. `sil! keepj norm! "_dG` ekstra boşlukları siler (`"_dG`) böylece isimsiz kaydınız temiz kalır. `exe "keepj " . l:startLine` kursörünüzü `startLine`'e geri getirir. Son olarak, `exe "sil! keepj norm! " . l:startCol . "\<bar>"` kursörünüzü `startCol` sütununa taşır.

Bunlar, Vim'de manuel olarak yapabileceğiniz tüm eylemlerdir. Ancak, bu eylemleri yeniden kullanılabilir işlevlere dönüştürmenin avantajı, her seferinde baş harflerini büyük yapmak için 30'dan fazla talimat çalıştırmaktan kurtulmanızdır. Buradan çıkarılacak ders, Vim'de manuel olarak yapabileceğiniz her şeyi yeniden kullanılabilir bir işlev haline getirebilirsiniz, dolayısıyla bir eklenti!

İşte böyle görünecek.

Bazı metinler verildiğinde:

```shell
kahvaltıda krep
öğle yemeğinde krep
akşam yemeğinde krep

... bazı metinler
```

Öncelikle, blok bazında görsel olarak vurgularsınız:

```shell
ka[kre]p için kahvaltı
ka[kre]p için öğle yemeği
ka[kre]p için akşam yemeği

... bazı metinler
```

Sonra bunu siler ve o metni a kaydına kaydedersiniz:

```shell
ka için kahvaltı
ka için öğle yemeği
ka için akşam yemeği

... bazı metinler
```

Ardından, dosyanın en altına yapıştırırsınız:

```shell
ka için kahvaltı
ka için öğle yemeği
ka için akşam yemeği

... bazı metinler
krep
krep
krep
```

Sonra bunu büyük harfle başlatırsınız:

```shell
ka için kahvaltı
ka için öğle yemeği
ka için akşam yemeği

... bazı metinler
Krep
Krep
Krep
```

Son olarak, büyük harfle başlatılan metni geri koyarsınız:

```shell
kaKrep için kahvaltı
kaKrep için öğle yemeği
kaKrep için akşam yemeği

... bazı metinler
```

## Satır ve Karakter İşlemlerini Yönetme

Henüz işiniz bitmedi. Sadece blok metinlerde `gt` çalıştırdığınızda kenar durumunu ele aldınız. Hala 'satır' ve 'karakter' işlemlerini ele almanız gerekiyor. Bunu nasıl yapıldığını görmek için `else` koduna bakalım.

Kodlar şunlardır:

```shell
if a:type ==# "block"
  # ... 
else
  let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
  let l:titlecased = s:capitalizeFirstWord(l:titlecased)
  call setreg('"', l:titlecased)
  let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
  silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>"
endif
```

Satır satır inceleyelim. Bu eklentinin gizli sırrı aslında bu satırda:

```shell
let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
```

`@@`, baş harfleri büyük yapılacak metni içerir. `l:WORD_PATTERN`, bireysel anahtar kelime eşleşmesidir. `l:UPCASE_REPLACEMENT`, `capitalize()` komutuna yapılan çağrıdır (bunu daha sonra göreceksiniz). `'g'`, verilen tüm kelimeleri değiştirmek için değiştirme komutuna global bayrak olarak talimat verir, sadece ilk kelimeyi değil.

Sonraki satır:

```shell
let l:titlecased = s:capitalizeFirstWord(l:titlecased)
```

Bu, ilk kelimenin her zaman büyük harfle başlamasını garanti eder. "Bir elma bir gün doktoru uzak tutar" gibi bir ifadeniz varsa, ilk kelime "bir" özel bir kelimedir, bu nedenle değiştirme komutunuz onu büyük harfle başlatmayacaktır. Her durumda ilk karakteri büyük harfle başlatan bir yönteme ihtiyacınız var. Bu işlev tam olarak bunu yapar (bu işlevin detaylarını daha sonra göreceksiniz). Bu büyük harflerle başlatma yöntemlerinin sonucu yerel değişken `l:titlecased`'de saklanır.

Sonraki satır:

```shell
call setreg('"', l:titlecased)
```

Bu, büyük harfle başlatılan dizeyi isimsiz kayda (`"`) koyar.

Sonra, aşağıdaki iki satır:

```shell
let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
```

Hey, bu tanıdık görünüyor! Daha önce `l:commands` ile benzer bir desen görmüştünüz. Burada yankeleme yerine yapıştırma (`p`) kullanıyorsunuz. Önceki bölümde `l:commands`'ı gözden geçirdiğimde bir hatırlatma yapın.

Son olarak, bu iki satır:

```shell
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Kursörünüzü başladığınız satır ve sütuna geri getiriyorsunuz. Hepsi bu!

Özetleyelim. Yukarıdaki değiştirme yöntemi, verilen metinleri büyük harfle başlatacak kadar akıllıdır ve özel kelimeleri atlar (bununla ilgili daha fazla bilgi daha sonra). Baş harfleri büyük bir dizeye sahip olduktan sonra, bunları isimsiz kayıtta saklarsınız. Ardından, daha önce `g@` ile çalıştırdığınız tam aynı metni görsel olarak vurgularsınız, ardından isimsiz kayıttan yapıştırırsınız (bu, etkili bir şekilde büyük harfle başlatılmamış metinleri büyük harfle başlatılmış versiyonla değiştirir). Son olarak, kursörünüzü başladığınız yere geri getirirsiniz.
## Temizlikler

Teknik olarak işiniz bitti. Metinler artık baş harfleri büyük yazılmış durumda. Geriye kalan tek şey, kayıtları ve ayarları geri yüklemek.

```shell
call setreg('"', l:reg_save)
call setpos("'<", l:visual_marks_save[0])
call setpos("'>", l:visual_marks_save[1])
let &clipboard = l:cb_save
let &selection = l:sel_save
```

Bunlar geri yükler:
- isimsiz kayıt.
- `<` ve `>` işaretleri.
- `'clipboard'` ve `'selection'` seçenekleri.

Uff, işiniz bitti. Uzun bir işlevdi. İşlevi daha kısa hale getirebilirdim, daha küçük parçalara ayırarak, ama şimdilik bu yeterli olacaktır. Şimdi baş harfleri büyük yapma işlevlerini kısaca gözden geçirelim.

## Baş Harfleri Büyük Yapma İşlevi

Bu bölümde, `s:capitalize()` işlevini gözden geçirelim. İşlevin görünümü şöyle:

```shell
function! s:capitalize(string)
    if(toupper(a:string) ==# a:string && a:string != 'A')
        return a:string
    endif

    let l:str = tolower(a:string)
    let l:exclusions = '^\(a\|an\|and\|at\|but\|by\|en\|for\|in\|nor\|of\|off\|on\|or\|out\|per\|so\|the\|to\|up\|yet\|v\.?\|vs\.?\|via\)$'
    if (match(l:str, l:exclusions) >= 0) || (index(s:local_exclusion_list, l:str) >= 0)
      return l:str
    endif

    return toupper(l:str[0]) . l:str[1:]
endfunction
```

`capitalize()` işlevinin argümanı `a:string`, `g@` operatörü tarafından geçirilen bireysel kelimedir. Yani "pankek kahvaltı için" metninde `gt` çalıştırıyorsam, `ToTitle`  `capitalize(string)` işlevini *üç* kez çağıracak, bir kez "pankek" için, bir kez "için" için ve bir kez "kahvaltı" için.

İşlevin ilk kısmı:

```shell
if(toupper(a:string) ==# a:string && a:string != 'A')
  return a:string
endif
```

İlk koşul (`toupper(a:string) ==# a:string`) argümanın büyük harfli versiyonunun aynı olup olmadığını ve kelimenin kendisinin "A" olup olmadığını kontrol eder. Eğer bunlar doğruysa, o kelimeyi döndür. Bu, belirli bir kelimenin tamamen büyük harfli olması durumunda, bunun bir kısaltma olduğu varsayımına dayanır. Örneğin, "CEO" kelimesi aksi takdirde "Ceo" olarak dönüştürülecektir. Hmm, CEO'nuz mutlu olmayacak. Bu nedenle, tamamen büyük harfli kelimeleri olduğu gibi bırakmak en iyisidir. İkinci koşul, `a:string != 'A'`, büyük "A" karakteri için bir kenar durumu ele alır. Eğer `a:string` zaten büyük bir "A" ise, bu yanlışlıkla `toupper(a:string) ==# a:string` testini geçmiş olur. Çünkü "a", İngilizce'de belirsiz bir makaledir ve küçük harfle yazılması gerekir.

Sonraki kısım, kelimeyi küçük harfe dönüştürmeyi zorlar:

```shell
let l:str = tolower(a:string)
```

Sonraki kısım, tüm kelime dışlamalarının bir regex listesidir. Bunları https://titlecaseconverter.com/rules/ adresinden aldım:

```shell
let l:exclusions = '^\(a\|an\|and\|at\|but\|by\|en\|for\|in\|nor\|of\|off\|on\|or\|out\|per\|so\|the\|to\|up\|yet\|v\.?\|vs\.?\|via\)$'
```

Sonraki kısım:

```shell
if (match(l:str, l:exclusions) >= 0) || (index(s:local_exclusion_list, l:str) >= 0)
  return l:str
endif
```

Öncelikle, kelimenizin dışlanan kelime listesinin bir parçası olup olmadığını kontrol edin (`l:exclusions`). Eğer öyleyse, büyük harf yapmayın. Daha sonra, kelimenizin yerel dışlama listesinin bir parçası olup olmadığını kontrol edin (`s:local_exclusion_list`). Bu dışlama listesi, kullanıcının vimrc dosyasına ekleyebileceği özel bir listedir (kullanıcının özel kelimeler için ek gereksinimleri varsa).

Son kısım, kelimenin büyük harfli versiyonunu döndürür. İlk karakter büyük harfle yazılırken, geri kalan olduğu gibi kalır.

```shell
return toupper(l:str[0]) . l:str[1:]
```

İkinci baş harfleri büyük yapma işlevine bakalım. İşlevin görünümü şöyle:

```shell
function! s:capitalizeFirstWord(string)
  if (a:string =~ "\n")
    let l:lineArr = trim(a:string)->split('\n')
    let l:lineArr = map(l:lineArr, 'toupper(v:val[0]) . v:val[1:]')
    return l:lineArr->join("\n")
  endif
  return toupper(a:string[0]) . a:string[1:]
endfunction
```

Bu işlev, "günde bir elma doktoru uzak tutar" gibi dışlanan bir kelimeyle başlayan bir cümleyi ele almak için oluşturulmuştur. İngilizce dilinin büyük harf kurallarına göre, bir cümledeki tüm ilk kelimeler, özel bir kelime olup olmadığına bakılmaksızın büyük harfle yazılmalıdır. Sadece `substitute()` komutunuzla, cümlenizdeki "bir" kelimesi küçük harfle yazılacaktır. İlk karakterin büyük harfle yazılmasını zorlamanız gerekir.

Bu `capitalizeFirstWord` işlevinde, `a:string` argümanı, `capitalize` işlevindeki `a:string` gibi bireysel bir kelime değil, tüm metindir. Yani "pankek kahvaltı için" varsa, `a:string`'in değeri "pankek kahvaltı için"dir. Tüm metin için sadece bir kez `capitalizeFirstWord` çalıştırır.

Dikkat etmeniz gereken bir senaryo, `"bir elma günde\ndoktoru uzak tutar"` gibi çok satırlı bir dizeye sahip olmanızdır. Tüm satırlardaki ilk karakterleri büyük harfle yazmak istersiniz. Eğer yeni satırlar yoksa, o zaman sadece ilk karakteri büyük harfle yazın.

```shell
return toupper(a:string[0]) . a:string[1:]
```

Eğer yeni satırlar varsa, her satırın ilk karakterini büyük harfle yazmanız gerekir, bu nedenle onları yeni satırlarla ayrılmış bir diziye ayırırsınız:

```shell
let l:lineArr = trim(a:string)->split('\n')
```

Ardından, dizideki her öğeyi harf büyük yaparak eşleştirirsiniz:

```shell
let l:lineArr = map(l:lineArr, 'toupper(v:val[0]) . v:val[1:]')
```

Son olarak, dizi öğelerini bir araya getirirsiniz:

```shell
return l:lineArr->join("\n")
```

Ve işiniz bitti!

## Belgeler

Depodaki ikinci dizin `docs/` dizinidir. Eklentiye kapsamlı bir belge sağlamak iyidir. Bu bölümde, kendi eklenti belgelerinizi nasıl oluşturacağınızı kısaca gözden geçireceğim.

`docs/` dizini, Vim'in özel çalışma yollarından biridir. Vim, `docs/` içindeki tüm dosyaları okur, bu nedenle özel bir anahtar kelime aradığınızda ve bu anahtar kelime `docs/` dizinindeki dosyalardan birinde bulunursa, yardım sayfasında görüntüler. Burada bir `totitle.txt` dosyanız var. Bunu bu şekilde adlandırdım çünkü bu eklentinin adı, ama istediğiniz gibi adlandırabilirsiniz.

Bir Vim belgeleri dosyası, esasen bir metin dosyasıdır. Bir normal metin dosyası ile bir Vim yardım dosyası arasındaki fark, ikincisinin özel "yardım" sözdizimlerini kullanmasıdır. Ama önce, Vim'e bunu bir metin dosyası türü olarak değil, bir `help` dosyası türü olarak ele almasını söylemelisiniz. Vim'e bu `totitle.txt` dosyasını *yardım* dosyası olarak yorumlaması için `:set ft=help` komutunu çalıştırın (`:h 'filetype'` için daha fazla bilgi). Bu arada, Vim'e bu `totitle.txt` dosyasını *normal* bir metin dosyası olarak yorumlatmak isterseniz, `:set ft=txt` komutunu çalıştırın.

### Yardım Dosyası Özel Sözdizimi

Bir anahtar kelimeyi keşfedilebilir hale getirmek için, o anahtar kelimeyi yıldızlarla çevreleyin. Kullanıcı `:h totitle` araması yaptığında `totitle` anahtar kelimesinin keşfedilebilir olması için, yardım dosyasında `*totitle*` olarak yazmalısınız.

Örneğin, içerik tablomun en üstünde bu satırlara sahibim:

```shell
İÇİNDEKİLER TABLOSU                                     *totitle*  *totitle-toc*

// daha fazla TOC bilgisi
```

İçerik tablosu bölümünü işaretlemek için iki anahtar kelime kullandığımı unutmayın: `*totitle*` ve `*totitle-toc*`. Bu, `:h totitle` veya `:h totitle-toc` aradığınızda, Vim'in sizi bu konuma götüreceği anlamına gelir.

İşte dosyanın daha aşağısında başka bir örnek:

```shell
2. Kullanım                                                       *totitle-usage*

// kullanım
```

Eğer `:h totitle-usage` ararsanız, Vim sizi bu bölüme götürür.

Ayrıca, yardım dosyasındaki başka bir bölüme atıfta bulunmak için iç bağlantılar da kullanabilirsiniz; bir anahtar kelimeyi çubuk sözdizimi `|` ile çevreleyerek. TOC bölümünde, çubuklarla çevrelenmiş anahtar kelimeleri görebilirsiniz, örneğin `|totitle-intro|`, `|totitle-usage|` vb.

```shell
İÇİNDEKİLER TABLOSU                                     *totitle*  *totitle-toc*

    1. Giriş ........................... |totitle-intro|
    2. Kullanım ........................... |totitle-usage|
    3. Büyük Harf Yapılacak Kelimeler ............. |totitle-words|
    4. Operatör ........................ |totitle-operator|
    5. Tuş Bağlama ..................... |totitle-keybinding|
    6. Hatalar ............................ |totitle-bug-report|
    7. Katkıda Bulunanlar .................... |totitle-contributing|
    8. Krediler ......................... |totitle-credits|

```
Bu, tanıma atlamanızı sağlar. `|totitle-intro|` üzerinde imlecinizi bir yere koyup `Ctrl-]` tuşuna basarsanız, Vim o kelimenin tanımına atlar. Bu durumda, `*totitle-intro*` konumuna atlayacaktır. Bu, yardım belgesindeki farklı anahtar kelimelere nasıl bağlantı verebileceğinizdir.

Vim'de bir belge dosyası yazmanın doğru veya yanlış bir yolu yoktur. Farklı yazarların farklı eklentilerine bakarsanız, birçoğunun farklı formatlar kullandığını göreceksiniz. Önemli olan, kullanıcılarınız için anlaşılması kolay bir yardım belgesi oluşturmaktır.

Son olarak, eğer kendi eklentinizi başlangıçta yerel olarak yazıyorsanız ve belge sayfasını test etmek istiyorsanız, `~/.vim/docs/` içine bir metin dosyası eklemek, anahtar kelimelerinizi otomatik olarak aranabilir hale getirmeyecektir. Vim'e belge sayfanızı eklemesini söylemelisiniz. Yeni etiket dosyaları oluşturmak için `:helptags ~/.vim/doc` komutunu çalıştırın. Artık anahtar kelimelerinizi aramaya başlayabilirsiniz.

## Sonuç

Sonuna geldiniz! Bu bölüm, tüm Vimscript bölümlerinin bir birleşimidir. Burada, şimdiye kadar öğrendiklerinizi pratiğe döküyorsunuz. Umarım bunu okuyarak, sadece Vim eklentileri oluşturmayı değil, aynı zamanda kendi eklentinizi yazmaya da teşvik edilmişsinizdir.

Aynı eylem dizisini birden fazla kez tekrarladığınızda, kendi eklentinizi yaratmayı denemelisiniz! Yeniden tekerlek icat etmemek gerektiği söylenir. Ancak, öğrenme amacıyla tekerleği yeniden icat etmenin faydalı olabileceğini düşünüyorum. Başkalarının eklentilerini okuyun. Onları yeniden oluşturun. Onlardan öğrenin. Kendi eklentinizi yazın! Kim bilir, belki de bunu okuduktan sonra bir sonraki harika, süper popüler eklentiyi yazacaksınız. Belki de bir sonraki efsanevi Tim Pope siz olacaksınız. O zaman bana haber verin!