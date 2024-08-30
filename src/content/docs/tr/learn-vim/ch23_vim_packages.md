---
description: Vim'in yerleşik eklenti yöneticisi olan paketleri kullanarak eklenti
  yükleme yöntemlerini öğrenin ve otomatik ve manuel yükleme mekanizmalarını keşfedin.
title: Ch23. Vim Packages
---

Önceki bölümde, eklentileri yüklemek için harici bir eklenti yöneticisi kullanmaktan bahsetmiştim. 8. sürümden itibaren, Vim kendi yerleşik eklenti yöneticisi olan *packages* ile birlikte gelir. Bu bölümde, Vim paketlerini kullanarak eklentileri nasıl yükleyeceğinizi öğreneceksiniz.

Vim derlemenizin paketleri kullanma yeteneğine sahip olup olmadığını görmek için `:version` komutunu çalıştırın ve `+packages` niteliğini arayın. Alternatif olarak, `:echo has('packages')` komutunu da çalıştırabilirsiniz (eğer 1 dönerse, o zaman paket yeteneğine sahiptir).

## Paket Dizini

Kök dizininde `~/.vim/` dizininizin olup olmadığını kontrol edin. Eğer yoksa, bir tane oluşturun. İçinde `pack` adında bir dizin oluşturun (`~/.vim/pack/`). Vim otomatik olarak bu dizinde paketleri aramayı bilir.

## İki Yükleme Türü

Vim paketinin iki yükleme mekanizması vardır: otomatik ve manuel yükleme.

### Otomatik Yükleme

Vim başladığında eklentileri otomatik olarak yüklemek için, onları `start/` dizinine koymanız gerekir. Yol şu şekilde görünür:

```shell
~/.vim/pack/*/start/
```

Şimdi sorabilirsiniz, "pack/ ile start/ arasındaki `*` nedir?" `*` rastgele bir isimdir ve istediğiniz herhangi bir şey olabilir. Bunu `packdemo/` olarak adlandıralım:

```shell
~/.vim/pack/packdemo/start/
```

Eğer bunu atlayıp bunun yerine şöyle bir şey yaparsanız:

```shell
~/.vim/pack/start/
```

Paket sistemi çalışmayacaktır. `pack/` ile `start/` arasında bir isim koymak zorunludur.

Bu demo için, [NERDTree](https://github.com/preservim/nerdtree) eklentisini yüklemeyi deneyelim. `start/` dizinine gidin (`cd ~/.vim/pack/packdemo/start/`) ve NERDTree deposunu klonlayın:

```shell
git clone https://github.com/preservim/nerdtree.git
```

Hepsi bu kadar! Artık hazırsınız. Bir sonraki Vim başlatışınızda, hemen `:NERDTreeToggle` gibi NERDTree komutlarını çalıştırabilirsiniz.

`~/.vim/pack/*/start/` yolunun içinde istediğiniz kadar eklenti deposunu klonlayabilirsiniz. Vim her birini otomatik olarak yükleyecektir. Klonladığınız depoyu kaldırırsanız (`rm -rf nerdtree/`), o eklenti artık mevcut olmayacaktır.

### Manuel Yükleme

Vim başladığında eklentileri manuel olarak yüklemek için, onları `opt/` dizinine koymanız gerekir. Otomatik yüklemeye benzer şekilde, yol şu şekilde görünür:

```shell
~/.vim/pack/*/opt/
```

Daha önceki `packdemo/` dizinini kullanalım:

```shell
~/.vim/pack/packdemo/opt/
```

Bu sefer, [killersheep](https://github.com/vim/killersheep) oyununu yükleyelim (bu, Vim 8.2 gerektirir). `opt/` dizinine gidin (`cd ~/.vim/pack/packdemo/opt/`) ve depoyu klonlayın:

```shell
git clone https://github.com/vim/killersheep.git
```

Vim'i başlatın. Oyunu çalıştırmak için komut `:KillKillKill`'dir. Bunu çalıştırmayı deneyin. Vim, bunun geçerli bir editör komutu olmadığını söyleyecektir. Önce eklentiyi *manuel* olarak yüklemeniz gerekir. Bunu yapalım:

```shell
:packadd killersheep
```

Şimdi komutu tekrar çalıştırmayı deneyin `:KillKillKill`. Komut şimdi çalışmalıdır.

"Manuel olarak paketleri neden yüklemek isteyeyim? Her şeyi başlangıçta otomatik olarak yüklemek daha iyi değil mi?" diye merak edebilirsiniz.

Harika bir soru. Bazen, sürekli kullanmayacağınız eklentiler vardır, örneğin o KillerSheep oyunu. Muhtemelen 10 farklı oyunu yüklemenize ve Vim'in başlangıç süresini yavaşlatmanıza gerek yoktur. Ancak, ara sıra sıkıldığınızda birkaç oyun oynamak isteyebilirsiniz. Gereksiz eklentiler için manuel yüklemeyi kullanın.

Ayrıca, bu yöntemi koşullu olarak eklenti eklemek için de kullanabilirsiniz. Belki hem Neovim hem de Vim kullanıyorsunuz ve Neovim için optimize edilmiş eklentiler var. Vimrc'nize şöyle bir şey ekleyebilirsiniz:

```shell
if has('nvim')
  packadd! neovim-only-plugin
else
  packadd! generic-vim-plugin
endif
```

## Paketleri Düzenleme

Vim'in paket sistemini kullanmak için gereksinimlerin ya şunlardan biri olması gerektiğini unutmayın:

```shell
~/.vim/pack/*/start/
```

Ya da:

```shell
~/.vim/pack/*/opt/
```

`*`'nin *herhangi bir* isim olabileceği gerçeği, paketlerinizi düzenlemek için kullanılabilir. Eklentilerinizi kategorilere (renkler, sözdizimi ve oyunlar) göre gruplamak istediğinizi varsayalım:

```shell
~/.vim/pack/colors/
~/.vim/pack/syntax/
~/.vim/pack/games/
```

Her bir dizin içinde hala `start/` ve `opt/` kullanabilirsiniz.

```shell
~/.vim/pack/colors/start/
~/.vim/pack/colors/opt/

~/.vim/pack/syntax/start/
~/.vim/pack/syntax/opt/

~/.vim/pack/games/start/
~/.vim/pack/games/opt/
```

## Paketleri Akıllıca Ekleme

Vim paketinin, vim-pathogen, vundle.vim, dein.vim ve vim-plug gibi popüler eklenti yöneticilerini gereksiz hale getirip getirmeyeceğini merak edebilirsiniz.

Cevap her zaman olduğu gibi "bu, duruma bağlı".

Ben hala vim-plug kullanıyorum çünkü eklentileri eklemeyi, kaldırmayı veya güncellemeyi kolaylaştırıyor. Eğer birçok eklenti kullanıyorsanız, birçok eklentiyi aynı anda güncellemek kolay olduğu için eklenti yöneticilerini kullanmak daha pratik olabilir. Bazı eklenti yöneticileri ayrıca asenkron işlevsellikler de sunar.

Eğer minimalistseniz, Vim paketlerini deneyin. Eğer yoğun bir eklenti kullanıcısıysanız, bir eklenti yöneticisi kullanmayı düşünebilirsiniz.