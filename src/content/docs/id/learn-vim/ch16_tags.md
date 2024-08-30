---
description: Pelajari cara menggunakan tag di Vim untuk dengan cepat menemukan definisi
  dalam kode, memudahkan pemahaman kode yang kompleks dan tidak dikenal.
title: Ch16. Tags
---

Salah satu fitur berguna dalam pengeditan teks adalah kemampuan untuk cepat menuju ke definisi mana pun. Dalam bab ini, Anda akan belajar bagaimana menggunakan tag Vim untuk melakukan itu.

## Ikhtisar Tag

Misalkan seseorang memberikan Anda kode baru:

```shell
one = One.new
one.donut
```

`One`? `donut`? Nah, ini mungkin sudah jelas bagi para pengembang yang menulis kode itu dulu, tetapi sekarang para pengembang tersebut tidak ada lagi dan terserah Anda untuk memahami kode-kode yang tidak jelas ini. Salah satu cara untuk membantu memahami ini adalah dengan mengikuti kode sumber di mana `One` dan `donut` didefinisikan.

Anda dapat mencarinya dengan menggunakan `fzf` atau `grep` (atau `vimgrep`), tetapi dalam hal ini, tag lebih cepat.

Anggaplah tag seperti buku alamat:

```shell
Name    Address
Iggy1   1234 Cool St, 11111
Iggy2   9876 Awesome Ave, 2222
```

Alih-alih memiliki pasangan nama-alamat, tag menyimpan definisi yang dipasangkan dengan alamat.

Mari kita anggap Anda memiliki dua file Ruby di dalam direktori yang sama:

```shell
## one.rb
class One
  def initialize
    puts "Initialized"
  end

  def donut
    puts "Bar"
  end
end
```

dan

```shell
## two.rb
require './one'

one = One.new
one.donut
```

Untuk melompat ke definisi, Anda dapat menggunakan `Ctrl-]` dalam mode normal. Di dalam `two.rb`, pergi ke baris di mana `one.donut` berada dan gerakkan kursor ke `donut`. Tekan `Ctrl-]`.

Ups, Vim tidak dapat menemukan file tag. Anda perlu menghasilkan file tag terlebih dahulu.

## Generator Tag

Vim modern tidak dilengkapi dengan generator tag, jadi Anda harus mengunduh generator tag eksternal. Ada beberapa opsi yang bisa dipilih:

- ctags = Hanya C. Tersedia hampir di mana saja.
- exuberant ctags = Salah satu yang paling populer. Memiliki banyak dukungan bahasa.
- universal ctags = Mirip dengan exuberant ctags, tetapi lebih baru.
- etags = Untuk Emacs. Hmm...
- JTags = Java
- ptags.py = Python
- ptags = Perl
- gnatxref = Ada

Jika Anda melihat tutorial Vim secara online, banyak yang akan merekomendasikan [exuberant ctags](http://ctags.sourceforge.net/). Ini mendukung [41 bahasa pemrograman](http://ctags.sourceforge.net/languages.html). Saya menggunakannya dan itu bekerja dengan baik. Namun, karena tidak dipelihara sejak 2009, Universal ctags akan menjadi pilihan yang lebih baik. Ini bekerja mirip dengan exuberant ctags dan saat ini sedang dipelihara.

Saya tidak akan menjelaskan detail tentang cara menginstal universal ctags. Lihat repositori [universal ctags](https://github.com/universal-ctags/ctags) untuk instruksi lebih lanjut.

Asumsikan Anda telah menginstal universal ctags, mari kita hasilkan file tag dasar. Jalankan:

```shell
ctags -R .
```

Opsi `R` memberi tahu ctags untuk melakukan pemindaian rekursif dari lokasi Anda saat ini (`.`). Anda harus melihat file `tags` di direktori Anda saat ini. Di dalamnya Anda akan melihat sesuatu seperti ini:

```shell
!_TAG_FILE_FORMAT	2	/extended format; --format=1 will not append ;" to lines/
!_TAG_FILE_SORTED	1	/0=unsorted, 1=sorted, 2=foldcase/
!_TAG_OUTPUT_FILESEP	slash	/slash or backslash/
!_TAG_OUTPUT_MODE	u-ctags	/u-ctags or e-ctags/
!_TAG_PATTERN_LENGTH_LIMIT	96	/0 for no limit/
!_TAG_PROGRAM_AUTHOR	Universal Ctags Team	//
!_TAG_PROGRAM_NAME	Universal Ctags	/Derived from Exuberant Ctags/
!_TAG_PROGRAM_URL	<https://ctags.io/>	/official site/
!_TAG_PROGRAM_VERSION	0.0.0	/b43eb39/
One	one.rb	/^class One$/;"	c
donut	one.rb	/^  def donut$/;"	f	class:One
initialize	one.rb	/^  def initialize$/;"	f	class:One
```

Milik Anda mungkin terlihat sedikit berbeda tergantung pada pengaturan Vim Anda dan generator ctags. File tag terdiri dari dua bagian: metadata tag dan daftar tag. Metadata ini (`!TAG_FILE...`) biasanya dikendalikan oleh generator ctags. Saya tidak akan membahasnya di sini, tetapi silakan periksa dokumen mereka untuk lebih banyak informasi! Daftar tag adalah daftar semua definisi yang diindeks oleh ctags.

Sekarang pergi ke `two.rb`, letakkan kursor di `donut`, dan ketik `Ctrl-]`. Vim akan membawa Anda ke file `one.rb` di baris di mana `def donut` berada. Sukses! Tapi bagaimana Vim melakukan ini?

## Anatomi Tag

Mari kita lihat item tag `donut`:

```shell
donut	one.rb	/^  def donut$/;"	f	class:One
```

Item tag di atas terdiri dari empat komponen: `tagname`, `tagfile`, `tagaddress`, dan opsi tag.
- `donut` adalah `tagname`. Ketika kursor Anda berada di "donut", Vim mencari file tag untuk baris yang memiliki string "donut".
- `one.rb` adalah `tagfile`. Vim mencari file `one.rb`.
- `/^ def donut$/` adalah `tagaddress`. `/.../` adalah indikator pola. `^` adalah pola untuk elemen pertama di baris. Diikuti oleh dua spasi, kemudian string `def donut`. Akhirnya, `$` adalah pola untuk elemen terakhir di baris.
- `f class:One` adalah opsi tag yang memberi tahu Vim bahwa fungsi `donut` adalah fungsi (`f`) dan merupakan bagian dari kelas `One`.

Mari kita lihat item lain dalam daftar tag:

```shell
One	one.rb	/^class One$/;"	c
```

Baris ini bekerja dengan cara yang sama seperti pola `donut`:

- `One` adalah `tagname`. Perhatikan bahwa dengan tag, pemindaian pertama bersifat sensitif terhadap huruf besar. Jika Anda memiliki `One` dan `one` dalam daftar, Vim akan memprioritaskan `One` daripada `one`.
- `one.rb` adalah `tagfile`. Vim mencari file `one.rb`.
- `/^class One$/` adalah pola `tagaddress`. Vim mencari baris yang dimulai dengan (`^`) `class` dan diakhiri dengan (`$`) `One`.
- `c` adalah salah satu opsi tag yang mungkin. Karena `One` adalah kelas ruby dan bukan prosedur, itu ditandai dengan `c`.

Tergantung pada generator tag yang Anda gunakan, konten file tag Anda mungkin terlihat berbeda. Setidaknya, file tag harus memiliki salah satu dari format berikut:

```shell
1.  {tagname} {TAB} {tagfile} {TAB} {tagaddress}
2.  {tagname} {TAB} {tagfile} {TAB} {tagaddress} {term} {field} ..
```

## File Tag

Anda telah belajar bahwa file baru, `tags`, dibuat setelah menjalankan `ctags -R .`. Bagaimana Vim tahu di mana mencari file tag?

Jika Anda menjalankan `:set tags?`, Anda mungkin melihat `tags=./tags,tags` (tergantung pada pengaturan Vim Anda, mungkin berbeda). Di sini Vim mencari semua tag di jalur file saat ini dalam hal `./tags` dan direktori saat ini (akar proyek Anda) dalam hal `tags`.

Juga dalam hal `./tags`, Vim akan terlebih dahulu mencari file tag di dalam jalur file saat ini terlepas dari seberapa bersarangnya, kemudian akan mencari file tag di direktori saat ini (akar proyek). Vim berhenti setelah menemukan kecocokan pertama.

Jika file `'tags'` Anda mengatakan `tags=./tags,tags,/user/iggy/mytags/tags`, maka Vim juga akan melihat direktori `/user/iggy/mytags` untuk file tag setelah Vim selesai mencari direktori `./tags` dan `tags`. Anda tidak perlu menyimpan file tag Anda di dalam proyek Anda, Anda bisa menyimpannya terpisah.

Untuk menambahkan lokasi file tag baru, gunakan yang berikut:

```shell
set tags+=path/to/my/tags/file
```

## Menghasilkan Tag untuk Proyek Besar

Jika Anda mencoba menjalankan ctags di proyek besar, mungkin akan memakan waktu lama karena Vim juga melihat di setiap direktori bersarang. Jika Anda seorang pengembang Javascript, Anda tahu bahwa `node_modules` bisa sangat besar. Bayangkan jika Anda memiliki lima sub-proyek dan masing-masing memiliki direktori `node_modules` sendiri. Jika Anda menjalankan `ctags -R .`, ctags akan mencoba memindai semua 5 `node_modules`. Anda mungkin tidak perlu menjalankan ctags pada `node_modules`.

Untuk menjalankan ctags dengan mengecualikan `node_modules`, jalankan:

```shell
ctags -R --exclude=node_modules .
```

Kali ini seharusnya memakan waktu kurang dari satu detik. Ngomong-ngomong, Anda dapat menggunakan opsi `exclude` beberapa kali:

```shell
ctags -R --exclude=.git --exclude=vendor --exclude=node_modules --exclude=db --exclude=log .
```

Intinya, jika Anda ingin mengabaikan sebuah direktori, `--exclude` adalah teman terbaik Anda.

## Navigasi Tag

Anda dapat mendapatkan manfaat yang baik hanya dengan menggunakan `Ctrl-]`, tetapi mari kita pelajari beberapa trik lagi. Kunci lompat tag `Ctrl-]` memiliki alternatif mode baris perintah: `:tag {tag-name}`. Jika Anda menjalankan:

```shell
:tag donut
```

Vim akan melompat ke metode `donut`, sama seperti melakukan `Ctrl-]` pada string "donut". Anda juga dapat melengkapi argumen dengan `<Tab>`:

```shell
:tag d<Tab>
```

Vim akan mencantumkan semua tag yang dimulai dengan "d". Dalam hal ini, "donut".

Dalam proyek nyata, Anda mungkin menemui beberapa metode dengan nama yang sama. Mari kita perbarui dua file ruby dari sebelumnya. Di dalam `one.rb`:

```shell
## one.rb
class One
  def initialize
    puts "Initialized"
  end

  def donut
    puts "one donut"
  end

  def pancake
    puts "one pancake"
  end
end
```

Di dalam `two.rb`:

```shell
## two.rb
require './one.rb'

def pancake
  "Two pancakes"
end

one = One.new
one.donut
puts pancake
```

Jika Anda sedang mengetik, jangan lupa untuk menjalankan `ctags -R .` lagi karena sekarang Anda memiliki beberapa prosedur baru. Anda memiliki dua instance dari prosedur `pancake`. Jika Anda berada di dalam `two.rb` dan menekan `Ctrl-]`, apa yang akan terjadi?

Vim akan melompat ke `def pancake` di dalam `two.rb`, bukan `def pancake` di dalam `one.rb`. Ini karena Vim melihat prosedur `pancake` di dalam `two.rb` memiliki prioritas lebih tinggi daripada prosedur `pancake` lainnya.

## Prioritas Tag

Tidak semua tag sama. Beberapa tag memiliki prioritas lebih tinggi. Jika Vim dihadapkan dengan nama item duplikat, Vim memeriksa prioritas kata kunci. Urutannya adalah:

1. Tag statis yang cocok sepenuhnya di file saat ini.
2. Tag global yang cocok sepenuhnya di file saat ini.
3. Tag global yang cocok sepenuhnya di file yang berbeda.
4. Tag statis yang cocok sepenuhnya di file lain.
5. Tag statis yang cocok tanpa memperhatikan huruf besar di file saat ini.
6. Tag global yang cocok tanpa memperhatikan huruf besar di file saat ini.
7. Tag global yang cocok tanpa memperhatikan huruf besar di file yang berbeda.
8. Tag statis yang cocok tanpa memperhatikan huruf besar di file saat ini.

Menurut daftar prioritas, Vim memprioritaskan kecocokan tepat yang ditemukan di file yang sama. Itulah sebabnya Vim memilih prosedur `pancake` di dalam `two.rb` daripada prosedur `pancake` di dalam `one.rb`. Ada beberapa pengecualian terhadap daftar prioritas di atas tergantung pada pengaturan `'tagcase'`, `'ignorecase'`, dan `'smartcase'`, tetapi saya tidak akan membahasnya di sini. Jika Anda tertarik, silakan periksa `:h tag-priority`.

## Lompat Tag Selektif

Akan lebih baik jika Anda dapat memilih item tag mana yang akan dilompati daripada selalu pergi ke item tag dengan prioritas tertinggi. Mungkin Anda sebenarnya perlu melompat ke metode `pancake` di `one.rb` dan bukan yang di `two.rb`. Untuk melakukan itu, Anda dapat menggunakan `:tselect`. Jalankan:

```shell
:tselect pancake
```

Anda akan melihat, di bagian bawah layar:
## pri kind tag               file
1 F C f    pancake           two.rb
             def pancake
2 F   f    pancake           one.rb
             class:One
             def pancake
```

Jika Anda mengetik 2, Vim akan melompat ke prosedur di `one.rb`. Jika Anda mengetik 1, Vim akan melompat ke prosedur di `two.rb`.

Perhatikan kolom `pri`. Anda memiliki `F C` pada pencocokan pertama dan `F` pada pencocokan kedua. Ini adalah yang digunakan Vim untuk menentukan prioritas tag. `F C` berarti tag global yang sepenuhnya cocok (`F`) di file saat ini (`C`). `F` berarti hanya tag global yang sepenuhnya cocok (`F`). `F C` selalu memiliki prioritas lebih tinggi daripada `F`.

Jika Anda menjalankan `:tselect donut`, Vim juga meminta Anda untuk memilih item tag yang akan dilompat, meskipun hanya ada satu opsi untuk dipilih. Apakah ada cara bagi Vim untuk meminta daftar tag hanya jika ada beberapa pencocokan dan melompat segera jika hanya satu tag yang ditemukan?

Tentu saja! Vim memiliki metode `:tjump`. Jalankan:

```shell
:tjump donut
```

Vim akan segera melompat ke prosedur `donut` di `one.rb`, mirip dengan menjalankan `:tag donut`. Sekarang jalankan:

```shell
:tjump pancake
```

Vim akan meminta Anda untuk memilih opsi tag, mirip dengan menjalankan `:tselect pancake`. Dengan `tjump` Anda mendapatkan yang terbaik dari kedua metode.

Vim memiliki kunci mode normal untuk `tjump`: `g Ctrl-]`. Saya pribadi lebih suka `g Ctrl-]` daripada `Ctrl-]`.

## Autocompletion Dengan Tag

Tag dapat membantu autocompletion. Ingat dari bab 6, Mode Sisip, bahwa Anda dapat menggunakan sub-mode `Ctrl-X` untuk melakukan berbagai autocompletion. Salah satu sub-mode autocompletion yang tidak saya sebutkan adalah `Ctrl-]`. Jika Anda melakukan `Ctrl-X Ctrl-]` saat dalam mode sisip, Vim akan menggunakan file tag untuk autocompletion.

Jika Anda masuk ke mode sisip dan mengetik `Ctrl-x Ctrl-]`, Anda akan melihat:

```shell
One
donut
initialize
pancake
```

## Tumpukan Tag

Vim menyimpan daftar semua tag yang telah Anda lompati dan dari mana dalam tumpukan tag. Anda dapat melihat tumpukan ini dengan `:tags`. Jika Anda pertama kali melompat ke tag `pancake`, diikuti dengan `donut`, dan menjalankan `:tags`, Anda akan melihat:

```shell
  # TO tag         FROM line  in file/text
  1  1 pancake            10  ch16_tags/two.rb
  2  1 donut               9  ch16_tags/two.rb
>
```

Perhatikan simbol `>` di atas. Itu menunjukkan posisi Anda saat ini dalam tumpukan. Untuk "pop" tumpukan untuk kembali ke satu tumpukan sebelumnya, Anda dapat menjalankan `:pop`. Cobalah, lalu jalankan `:tags` lagi:

```shell
  # TO tag         FROM line  in file/text
  1  1 pancake            10  puts pancake
> 2  1 donut               9  one.donut

```

Perhatikan bahwa simbol `>` sekarang berada di baris dua, di mana `donut` berada. `pop` sekali lagi, lalu jalankan `:tags` lagi:

```shell
  # TO tag         FROM line  in file/text
> 1  1 pancake            10  puts pancake
  2  1 donut               9  one.donut
```

Dalam mode normal, Anda dapat menjalankan `Ctrl-t` untuk mencapai efek yang sama seperti `:pop`.

## Generasi Tag Otomatis

Salah satu kelemahan terbesar dari tag Vim adalah bahwa setiap kali Anda melakukan perubahan signifikan, Anda harus menghasilkan kembali file tag. Jika Anda baru-baru ini mengganti nama prosedur `pancake` menjadi prosedur `waffle`, file tag tidak tahu bahwa prosedur `pancake` telah diganti namanya. Itu masih menyimpan `pancake` dalam daftar tag. Anda harus menjalankan `ctags -R .` untuk membuat file tag yang diperbarui. Membuat file tag baru dengan cara ini bisa merepotkan.

Untungnya ada beberapa metode yang dapat Anda gunakan untuk menghasilkan tag secara otomatis.

## Menghasilkan Tag Saat Menyimpan

Vim memiliki metode autocommand (`autocmd`) untuk mengeksekusi perintah apa pun pada pemicu peristiwa. Anda dapat menggunakan ini untuk menghasilkan tag pada setiap penyimpanan. Jalankan:

```shell
:autocmd BufWritePost *.rb silent !ctags -R .
```

Rincian:
- `autocmd` adalah perintah baris perintah. Ini menerima peristiwa, pola file, dan perintah.
- `BufWritePost` adalah peristiwa untuk menyimpan buffer. Setiap kali Anda menyimpan file, Anda memicu peristiwa `BufWritePost`.
- `.rb` adalah pola file untuk file ruby.
- `silent` sebenarnya adalah bagian dari perintah yang Anda kirimkan. Tanpa ini, Vim akan menampilkan `tekan ENTER atau ketik perintah untuk melanjutkan` setiap kali Anda memicu autocommand.
- `!ctags -R .` adalah perintah yang akan dieksekusi. Ingat bahwa `!cmd` dari dalam Vim mengeksekusi perintah terminal.

Sekarang setiap kali Anda menyimpan dari dalam file ruby, Vim akan menjalankan `ctags -R .`.

## Menggunakan Plugin

Ada beberapa plugin untuk menghasilkan ctags secara otomatis:

- [vim-gutentags](https://github.com/ludovicchabant/vim-gutentags)
- [vim-tags](https://github.com/szw/vim-tags)
- [vim-easytags](https://github.com/xolox/vim-easytags)
- [vim-autotag](https://github.com/craigemery/vim-autotag)

Saya menggunakan vim-gutentags. Ini sederhana untuk digunakan dan akan bekerja langsung dari kotak.

## Ctags dan Git Hooks

Tim Pope, penulis banyak plugin Vim yang hebat, menulis blog yang menyarankan untuk menggunakan git hooks. [Lihat di sini](https://tbaggery.com/2011/08/08/effortless-ctags-with-git.html).

## Pelajari Tag dengan Cara Cerdas

Tag berguna setelah dikonfigurasi dengan benar. Misalkan Anda menghadapi basis kode baru dan ingin memahami apa yang dilakukan `functionFood`, Anda dapat dengan mudah membacanya dengan melompat ke definisinya. Di dalamnya, Anda belajar bahwa itu juga memanggil `functionBreakfast`. Anda mengikutinya dan Anda belajar bahwa itu memanggil `functionPancake`. Grafik panggilan fungsi Anda terlihat seperti ini:

```shell
functionFood -> functionBreakfast -> functionPancake
```

Ini memberi Anda wawasan bahwa aliran kode ini terkait dengan memiliki pancake untuk sarapan.

Untuk mempelajari lebih lanjut tentang tag, lihat `:h tags`. Sekarang Anda tahu cara menggunakan tag, mari kita jelajahi fitur berbeda: lipatan.