---
description: Vim ve git'in entegrasyonunu öğrenin. Bu bölümde, dosyalar arasındaki
  farkları görüntülemek için vimdiff kullanımını keşfedeceksiniz.
title: Ch18. Git
---

Vim ve git, iki farklı şey için harika araçlardır. Git bir versiyon kontrol aracıdır. Vim ise bir metin editörüdür.

Bu bölümde, Vim ve git'i bir araya entegre etmenin farklı yollarını öğreneceksiniz.

## Farklılaştırma

Önceki bölümde, birden fazla dosya arasındaki farkları göstermek için `vimdiff` komutunu çalıştırabileceğinizi hatırlayın.

Diyelim ki iki dosyanız var, `file1.txt` ve `file2.txt`.

`file1.txt` içinde:

```shell
pancakes
waffles
apples

milk
apple juice

yogurt
```

`file2.txt` içinde:

```shell
pancakes
waffles
oranges

milk
orange juice

yogurt
```

Her iki dosya arasındaki farkları görmek için şunu çalıştırın:

```shell
vimdiff file1.txt file2.txt
```

Alternatif olarak şunu çalıştırabilirsiniz:

```shell
vim -d file1.txt file2.txt
```

`vimdiff`, iki tamponu yan yana gösterir. Solda `file1.txt`, sağda ise `file2.txt` vardır. İlk farklar (apples ve oranges) her iki satırda da vurgulanmıştır.

İkinci tamponda oranges yerine apples olmasını istiyorsanız, önce `]c` ile bir sonraki farka gidin (önceki fark penceresine atlamak için `[c` kullanın). İmleç şimdi apples üzerinde olmalıdır. `:diffput` komutunu çalıştırın. Her iki dosyada da artık apples olmalıdır.

Diğer tampondan (orange juice, `file2.txt`) metni mevcut tamponda (apple juice, `file1.txt`) değiştirmek için, imleciniz hala `file1.txt` penceresinde iken, önce `]c` ile bir sonraki farka gidin. İmleç şimdi apple juice üzerinde olmalıdır. `:diffget` komutunu çalıştırarak diğer tampondan orange juice'u alarak apple juice'u değiştirebilirsiniz.

`:diffput` *mevcut tampondan* diğer tampona metni aktarır. `:diffget` *diğer tampondan* mevcut tampona metni alır.

Birden fazla tamponunuz varsa, `:diffput fileN.txt` ve `:diffget fileN.txt` komutlarını çalıştırarak fileN tamponunu hedefleyebilirsiniz.

## Vim Bir Birleştirme Aracı Olarak

> "Birleştirme çatışmalarını çözmeyi seviyorum!" - Hiç kimse

Birleştirme çatışmalarını çözmeyi seven kimse tanımıyorum. Ancak, bunlar kaçınılmazdır. Bu bölümde, Vim'i bir birleştirme çatışması çözüm aracı olarak nasıl kullanacağınızı öğreneceksiniz.

Öncelikle, varsayılan birleştirme aracını `vimdiff` olarak ayarlamak için şunu çalıştırın:

```shell
git config merge.tool vimdiff
git config merge.conflictstyle diff3
git config mergetool.prompt false
```

Alternatif olarak, `~/.gitconfig` dosyasını doğrudan değiştirebilirsiniz (varsayılan olarak kök dizinde olmalıdır, ancak sizin farklı bir yerde olabilir). Yukarıdaki komutlar, gitconfig'unuzu aşağıdaki ayar gibi görünmesi için değiştirmelidir, eğer bunları zaten çalıştırmadıysanız, gitconfig'unuzu manuel olarak da düzenleyebilirsiniz.

```shell
[core]
  editor = vim
[merge]
  tool = vimdiff
  conflictstyle = diff3
[difftool]
  prompt = false
```

Bunu test etmek için sahte bir birleştirme çatışması oluşturalım. `/food` adında bir dizin oluşturun ve bunu bir git deposu yapın:

```shell
git init
```

`breakfast.txt` adında bir dosya ekleyin. İçinde:

```shell
pancakes
waffles
oranges
```

Dosyayı ekleyin ve taahhüt edin:

```shell
git add .
git commit -m "İlk kahvaltı taahhüdü"
```

Sonra yeni bir dal oluşturun ve ona apples dalı adını verin:

```shell
git checkout -b apples
```

`breakfast.txt` dosyasını değiştirin:

```shell
pancakes
waffles
apples
```

Dosyayı kaydedin, ardından değişikliği ekleyin ve taahhüt edin:

```shell
git add .
git commit -m "Apples not oranges"
```

Harika. Artık master dalında oranges ve apples dalında apples var. Master dalına geri dönelim:

```shell
git checkout master
```

`breakfast.txt` içinde, temel metni, oranges'ı görmelisiniz. Şimdi bunu üzüm olarak değiştirelim çünkü şu anda mevsimindeler:

```shell
pancakes
waffles
grapes
```

Kaydedin, ekleyin ve taahhüt edin:

```shell
git add .
git commit -m "Grapes not oranges"
```

Artık apples dalını master dalına birleştirmeye hazırsınız:

```shell
git merge apples
```

Bir hata görmelisiniz:

```shell
Auto-merging breakfast.txt
CONFLICT (content): Merge conflict in breakfast.txt
Automatic merge failed; fix conflicts and then commit the result.
```

Bir çatışma, harika! Çatışmayı yeni yapılandırılmış `mergetool`'ümüzü kullanarak çözelim. Şunu çalıştırın:

```shell
git mergetool
```

Vim dört pencere gösterir. Üstteki üçüne dikkat edin:

- `LOCAL` `grapes` içerir. Bu, "yerel" değişikliktir, birleştirdiğiniz şey.
- `BASE` `oranges` içerir. Bu, `LOCAL` ve `REMOTE` arasındaki ortak atadır, nasıl ayrıldıklarını karşılaştırmak için.
- `REMOTE` `apples` içerir. Bu, birleştirilen şeydir.

Altta (dördüncü pencerede) şunu görüyorsunuz:

```shell
pancakes
waffles
<<<<<<< HEAD
grapes
||||||| db63958
oranges
=======
apples
>>>>>>> apples
```

Dördüncü pencere, birleştirme çatışması metinlerini içerir. Bu ayar ile her ortamın hangi değişikliklere sahip olduğunu görmek daha kolaydır. `LOCAL`, `BASE` ve `REMOTE` içeriklerini aynı anda görebilirsiniz.

İmleciniz dördüncü pencerede, vurgulanan alanda olmalıdır. `LOCAL`'dan değişikliği almak için `:diffget LOCAL` komutunu çalıştırın. `BASE`'den değişikliği almak için `:diffget BASE` komutunu çalıştırın ve `REMOTE`'den değişikliği almak için `:diffget REMOTE` komutunu çalıştırın.

Bu durumda, `LOCAL`'dan değişikliği alalım. `:diffget LOCAL` komutunu çalıştırın. Dördüncü pencere artık grapes içerecek. İşiniz bittiğinde tüm dosyaları kaydedin ve çıkın (`:wqall`). Kötü değildi, değil mi?

Eğer fark ettiyseniz, artık `breakfast.txt.orig` adında bir dosyanız var. Git, işler iyi gitmezse bir yedek dosya oluşturur. Eğer git'in birleştirme sırasında yedek oluşturmasını istemiyorsanız, şunu çalıştırın:

```shell
git config --global mergetool.keepBackup false
```

## Vim İçinde Git

Vim'in yerleşik bir git özelliği yoktur. Vim'den git komutlarını çalıştırmanın bir yolu, komut satırı modunda bang operatörünü `!` kullanmaktır.

Herhangi bir git komutu `!` ile çalıştırılabilir:

```shell
:!git status
:!git commit
:!git diff
:!git push origin master
```

Ayrıca Vim'in `%` (mevcut tampon) veya `#` (diğer tampon) kavramlarını da kullanabilirsiniz:

```shell
:!git add %         " mevcut dosyayı git'e ekle
:!git checkout #    " diğer dosyayı git checkout yap
```

Farklı Vim pencerelerinde birden fazla dosyayı eklemek için kullanabileceğiniz bir Vim hilesi:

```shell
:windo !git add %
```

Sonra bir taahhüt yapın:

```shell
:!git commit "Vim penceremde her şeyi git'e ekledim, harika"
```

`windo` komutu, Vim'in "yap" komutlarından biridir, daha önce gördüğünüz `argdo`ya benzer. `windo`, komutu her pencerede çalıştırır.

Alternatif olarak, tüm tamponları git'e eklemek için `bufdo !git add %` veya tüm dosya argümanlarını git'e eklemek için `argdo !git add %` kullanabilirsiniz, bu sizin iş akışınıza bağlıdır.

## Eklentiler

Git desteği için birçok Vim eklentisi vardır. Aşağıda, Vim için bazı popüler git ile ilgili eklentilerin bir listesi bulunmaktadır (okuduğunuzda muhtemelen daha fazlası vardır):

- [vim-gitgutter](https://github.com/airblade/vim-gitgutter)
- [vim-signify](https://github.com/mhinz/vim-signify)
- [vim-fugitive](https://github.com/tpope/vim-fugitive)
- [gv.vim](https://github.com/junegunn/gv.vim)
- [vimagit](https://github.com/jreybert/vimagit)
- [vim-twiggy](https://github.com/sodapopcan/vim-twiggy)
- [rhubarb](https://github.com/tpope/vim-rhubarb)

En popüler olanlardan biri vim-fugitive'dir. Bölümün geri kalanında, bu eklentiyi kullanarak birkaç git iş akışını gözden geçireceğim.

## Vim-fugitive

vim-fugitive eklentisi, git CLI'sını Vim editöründen çıkmadan çalıştırmanıza olanak tanır. Bazı komutların, Vim içinde çalıştırıldığında daha iyi olduğunu göreceksiniz.

Başlamak için, vim-fugitive'yi bir Vim eklenti yöneticisi ile yükleyin ([vim-plug](https://github.com/junegunn/vim-plug), [vundle](https://github.com/VundleVim/Vundle.vim), [dein.vim](https://github.com/Shougo/dein.vim) vb.).

## Git Durumu

`:Git` komutunu herhangi bir parametre olmadan çalıştırdığınızda, vim-fugitive bir git özet penceresi gösterir. İzlenmeyen, sahnelenmemiş ve sahnelenmiş dosyaları gösterir. Bu "`git status`" modunda, birkaç şey yapabilirsiniz:
- Dosya listesinin yukarısına veya aşağısına gitmek için `Ctrl-N` / `Ctrl-P`.
- İmlecin altındaki dosya adını sahnelemek veya sahneden çıkarmak için `-`.
- İmlecin altındaki dosya adını sahnelemek için `s`.
- İmlecin altındaki dosya adını sahneden çıkarmak için `u`.
- İmlecin altındaki dosya adının satır içi farkını göstermek veya gizlemek için `>` / `<`.

Daha fazlası için `:h fugitive-staging-maps`'a bakın.

## Git Suçlama

Mevcut dosyadan `:Git blame` komutunu çalıştırdığınızda, vim-fugitive bir bölünmüş suçlama penceresi gösterir. Bu, o hatalı kod satırını yazmaktan sorumlu kişiyi bulmak için yararlı olabilir, böylece ona bağırabilirsiniz (şaka yapıyorum).

Bu `"git blame"` modundayken yapabileceğiniz bazı şeyler:
- Suçlama penceresini kapatmak için `q`.
- Yazar sütununu yeniden boyutlandırmak için `A`.
- Taahhüt sütununu yeniden boyutlandırmak için `C`.
- Tarih / saat sütununu yeniden boyutlandırmak için `D`.

Daha fazlası için `:h :Git_blame`'a bakın.

## Gdiffsplit

`:Gdiffsplit` komutunu çalıştırdığınızda, vim-fugitive mevcut dosyanın en son değişikliklerini dizin veya çalışma ağacına karşı bir `vimdiff` çalıştırır. `:Gdiffsplit <commit>` komutunu çalıştırdığınızda, vim-fugitive o dosya üzerinde `<commit>` içinde bir `vimdiff` çalıştırır.

`vimdiff` modunda olduğunuz için, `:diffput` ve `:diffget` ile farkı *alabilir* veya *verebilirsiniz*.

## Gwrite ve Gread

Bir dosyada değişiklik yaptıktan sonra `:Gwrite` komutunu çalıştırdığınızda, vim-fugitive değişiklikleri sahneye alır. Bu, `git add <current-file>` komutunu çalıştırmak gibidir.

Bir dosyada değişiklik yaptıktan sonra `:Gread` komutunu çalıştırdığınızda, vim-fugitive dosyayı değişikliklerden önceki duruma geri getirir. Bu, `git checkout <current-file>` komutunu çalıştırmak gibidir. `:Gread` komutunu çalıştırmanın bir avantajı, işlemin geri alınabilir olmasıdır. Eğer `:Gread` komutunu çalıştırdıktan sonra fikrinizi değiştirirseniz ve eski değişikliği saklamak isterseniz, sadece geri alma (`u`) komutunu çalıştırarak Vim, `:Gread` eylemini geri alacaktır. Bu, CLI'dan `git checkout <current-file>` komutunu çalıştırmış olsaydınız mümkün olmazdı.

## Gclog

`:Gclog` komutunu çalıştırdığınızda, vim-fugitive taahhüt geçmişini gösterir. Bu, `git log` komutunu çalıştırmak gibidir. Vim-fugitive, bunu başarmak için Vim'in hızlı düzeltmesini kullanır, böylece `:cnext` ve `:cprevious` ile bir sonraki veya önceki günlük bilgisine geçiş yapabilirsiniz. Günlük listesini `:copen` ve `:cclose` ile açıp kapatabilirsiniz.

Bu `"git log"` modundayken iki şey yapabilirsiniz:
- Ağaç görünümünü görüntüleyin.
- Üst ebeveyni (önceki taahhüt) ziyaret edin.

`:Gclog` komutuna, `git log` komutundaki gibi argümanlar geçirebilirsiniz. Projeniz uzun bir taahhüt geçmişine sahipse ve yalnızca son üç taahhüdü görüntülemek istiyorsanız, `:Gclog -3` komutunu çalıştırabilirsiniz. Eğer taahhüt edenin tarihine göre filtrelemek istiyorsanız, `:Gclog --after="January 1" --before="March 14"` gibi bir şey çalıştırabilirsiniz.

## Daha Fazla Vim-fugitive

Bunlar, vim-fugitive'nin yapabileceği yalnızca birkaç örnektir. Vim-fugitive hakkında daha fazla bilgi edinmek için `:h fugitive.txt`'ye bakın. Muhtemelen en popüler git komutlarının çoğu vim-fugitive ile optimize edilmiştir. Sadece belgelerde aramanız gerekiyor.

Eğer vim-fugitive'nin "özel modlarından" birinin içindeyseniz (örneğin, `:Git` veya `:Git blame` modunda) ve hangi kısayolların mevcut olduğunu öğrenmek istiyorsanız, `g?` tuşuna basın. Vim-fugitive, bulunduğunuz mod için uygun `:help` penceresini gösterecektir. Harika!
## Vim ve Git'i Akıllı Yolla Öğrenin

vim-fugitive'nin iş akışınıza iyi bir tamamlayıcı olabileceğini düşünebilirsiniz (ya da düşünmeyebilirsiniz). Her halükarda, yukarıda listelenen tüm eklentileri kontrol etmenizi şiddetle tavsiye ederim. Belki de listelemediğim başka eklentiler de vardır. Onları denemeye gidin.

Vim-git entegrasyonu ile daha iyi hale gelmenin bir yolu, git hakkında daha fazla okumaktır. Git, kendi başına, geniş bir konudur ve ben sadece bir kısmını gösteriyorum. Bununla birlikte, *git going* (espri için özür dilerim) diyelim ve kodunuzu derlemek için Vim'i nasıl kullanacağımızı konuşalım!