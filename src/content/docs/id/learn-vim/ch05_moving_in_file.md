---
description: Panduan ini memperkenalkan gerakan dasar di Vim untuk navigasi cepat
  dalam file, membantu pengguna menjadi produktif dengan menggunakan keyboard.
title: Ch05. Moving in a File
---

Pada awalnya, bergerak dengan keyboard terasa lambat dan canggung, tetapi jangan menyerah! Setelah Anda terbiasa, Anda dapat pergi ke mana saja dalam sebuah file lebih cepat daripada menggunakan mouse.

Dalam bab ini, Anda akan belajar gerakan dasar dan cara menggunakannya secara efisien. Ingatlah bahwa ini **bukan** seluruh gerakan yang dimiliki Vim. Tujuannya di sini adalah untuk memperkenalkan gerakan yang berguna agar bisa produktif dengan cepat. Jika Anda perlu belajar lebih banyak, lihat `:h motion.txt`.

## Navigasi Karakter

Unit gerakan paling dasar adalah bergerak satu karakter ke kiri, bawah, atas, dan kanan.

```shell
h   Kiri
j   Bawah
k   Atas
l   Kanan
gj  Bawah dalam baris yang dibungkus lembut
gk  Atas dalam baris yang dibungkus lembut
```

Anda juga dapat bergerak dengan panah arah. Jika Anda baru mulai, silakan gunakan metode apa pun yang paling nyaman bagi Anda.

Saya lebih suka `hjkl` karena tangan kanan saya bisa tetap di baris rumah. Melakukan ini memberi saya jangkauan yang lebih pendek ke tombol-tombol di sekitarnya. Untuk terbiasa dengan `hjkl`, saya sebenarnya menonaktifkan tombol panah saat memulai dengan menambahkan ini di `~/.vimrc`:

```shell
noremap <Up> <NOP>
noremap <Down> <NOP>
noremap <Left> <NOP>
noremap <Right> <NOP>
```

Ada juga plugin untuk membantu mengatasi kebiasaan buruk ini. Salah satunya adalah [vim-hardtime](https://github.com/takac/vim-hardtime). Yang mengejutkan, saya membutuhkan waktu kurang dari seminggu untuk terbiasa dengan `hjkl`.

Jika Anda bertanya-tanya mengapa Vim menggunakan `hjkl` untuk bergerak, ini karena terminal Lear-Siegler ADM-3A tempat Bill Joy menulis Vi, tidak memiliki tombol panah dan menggunakan `hjkl` sebagai kiri/bawah/atas/kanan.*

## Penomoran Relatif

Saya rasa berguna untuk mengatur `number` dan `relativenumber`. Anda dapat melakukannya dengan menambahkan ini di `.vimrc`:

```shell
set relativenumber number
```

Ini menampilkan nomor baris saat ini dan nomor baris relatif.

Sangat mudah mengapa memiliki nomor di kolom kiri itu berguna, tetapi beberapa dari Anda mungkin bertanya bagaimana memiliki nomor relatif di kolom kiri bisa berguna. Memiliki nomor relatif memungkinkan saya untuk dengan cepat melihat berapa banyak baris jarak kursor saya dari teks target. Dengan ini, saya bisa dengan mudah melihat bahwa teks target saya berada 12 baris di bawah saya sehingga saya bisa melakukan `d12j` untuk menghapusnya. Jika tidak, jika saya berada di baris 69 dan target saya berada di baris 81, saya harus melakukan perhitungan mental (81 - 69 = 12). Melakukan perhitungan saat mengedit membutuhkan terlalu banyak sumber daya mental. Semakin sedikit yang perlu saya pikirkan tentang ke mana saya harus pergi, semakin baik.

Ini adalah 100% preferensi pribadi. Eksperimen dengan `relativenumber` / `norelativenumber`, `number` / `nonumber` dan gunakan apa pun yang Anda anggap paling berguna!

## Hitung Gerakan Anda

Mari kita bicarakan tentang argumen "hitungan". Gerakan Vim menerima argumen numerik yang mendahuluinya. Saya menyebutkan di atas bahwa Anda dapat turun 12 baris dengan `12j`. Angka 12 dalam `12j` adalah nomor hitungan.

Sintaks untuk menggunakan hitungan dengan gerakan Anda adalah:

```shell
[count] + motion
```

Anda dapat menerapkan ini ke semua gerakan. Jika Anda ingin bergerak 9 karakter ke kanan, alih-alih menekan `l` 9 kali, Anda bisa melakukan `9l`.

## Navigasi Kata

Mari kita pindah ke unit gerakan yang lebih besar: *kata*. Anda dapat bergerak ke awal kata berikutnya (`w`), ke akhir kata berikutnya (`e`), ke awal kata sebelumnya (`b`), dan ke akhir kata sebelumnya (`ge`).

Selain itu, ada *WORD*, yang berbeda dari kata. Anda dapat bergerak ke awal WORD berikutnya (`W`), ke akhir WORD berikutnya (`E`), ke awal WORD sebelumnya (`B`), dan ke akhir WORD sebelumnya (`gE`). Untuk memudahkan diingat, WORD menggunakan huruf yang sama dengan kata, hanya saja dalam huruf kapital.

```shell
w     Bergerak maju ke awal kata berikutnya
W     Bergerak maju ke awal WORD berikutnya
e     Bergerak maju satu kata ke akhir kata berikutnya
E     Bergerak maju satu kata ke akhir WORD berikutnya
b     Bergerak mundur ke awal kata sebelumnya
B     Bergerak mundur ke awal WORD sebelumnya
ge    Bergerak mundur ke akhir kata sebelumnya
gE    Bergerak mundur ke akhir WORD sebelumnya
```

Jadi apa kesamaan dan perbedaan antara kata dan WORD? Baik kata maupun WORD dipisahkan oleh karakter kosong. Sebuah kata adalah urutan karakter yang hanya mengandung *hanya* `a-zA-Z0-9_`. Sebuah WORD adalah urutan semua karakter kecuali spasi (spasi berarti baik spasi, tab, dan EOL). Untuk belajar lebih lanjut, lihat `:h word` dan `:h WORD`.

Sebagai contoh, anggap Anda memiliki:

```shell
const hello = "world";
```

Dengan kursor Anda di awal baris, untuk pergi ke akhir baris dengan `l`, itu akan memakan waktu 21 penekanan tombol. Menggunakan `w`, itu akan memakan waktu 6. Menggunakan `W`, itu hanya akan memakan waktu 4. Baik kata maupun WORD adalah pilihan yang baik untuk bepergian jarak pendek.

Namun, Anda dapat pergi dari "c" ke ";" dalam satu penekanan tombol dengan navigasi baris saat ini.

## Navigasi Baris Saat Ini

Saat mengedit, Anda sering perlu bernavigasi secara horizontal dalam satu baris. Untuk melompat ke karakter pertama di baris saat ini, gunakan `0`. Untuk pergi ke karakter terakhir di baris saat ini, gunakan `$`. Selain itu, Anda dapat menggunakan `^` untuk pergi ke karakter non-kosong pertama di baris saat ini dan `g_` untuk pergi ke karakter non-kosong terakhir di baris saat ini. Jika Anda ingin pergi ke kolom `n` di baris saat ini, Anda dapat menggunakan `n|`.

```shell
0     Pergi ke karakter pertama di baris saat ini
^     Pergi ke karakter non-kosong pertama di baris saat ini
g_    Pergi ke karakter non-kosong terakhir di baris saat ini
$     Pergi ke karakter terakhir di baris saat ini
n|    Pergi ke kolom n di baris saat ini
```

Anda dapat melakukan pencarian baris saat ini dengan `f` dan `t`. Perbedaan antara `f` dan `t` adalah bahwa `f` membawa Anda ke huruf pertama dari kecocokan dan `t` membawa Anda hingga (sebelum) huruf pertama dari kecocokan. Jadi jika Anda ingin mencari "h" dan mendarat di "h", gunakan `fh`. Jika Anda ingin mencari "h" pertama dan mendarat tepat sebelum kecocokan, gunakan `th`. Jika Anda ingin pergi ke kemunculan *selanjutnya* dari pencarian baris saat ini terakhir, gunakan `;`. Untuk pergi ke kemunculan sebelumnya dari kecocokan baris saat ini terakhir, gunakan `,`.

`F` dan `T` adalah pasangan mundur dari `f` dan `t`. Untuk mencari mundur untuk "h", jalankan `Fh`. Untuk terus mencari "h" dalam arah yang sama, gunakan `;`. Perhatikan bahwa `;` setelah `Fh` mencari mundur dan `,` setelah `Fh` mencari maju.

```shell
f    Cari maju untuk kecocokan di baris yang sama
F    Cari mundur untuk kecocokan di baris yang sama
t    Cari maju untuk kecocokan di baris yang sama, berhenti sebelum kecocokan
T    Cari mundur untuk kecocokan di baris yang sama, berhenti sebelum kecocokan
;    Ulangi pencarian terakhir di baris yang sama menggunakan arah yang sama
,    Ulangi pencarian terakhir di baris yang sama menggunakan arah yang berlawanan
```

Kembali ke contoh sebelumnya:

```shell
const hello = "world";
```

Dengan kursor Anda di awal baris, Anda dapat pergi ke karakter terakhir di baris saat ini (";") dengan satu penekanan tombol: `$`. Jika Anda ingin pergi ke "w" di "world", Anda dapat menggunakan `fw`. Sebuah tips baik untuk pergi ke mana saja dalam satu baris adalah mencari huruf-huruf yang jarang seperti "j", "x", "z" di dekat target Anda.

## Navigasi Kalimat dan Paragraf

Dua unit navigasi berikutnya adalah kalimat dan paragraf.

Mari kita bicarakan apa itu kalimat terlebih dahulu. Sebuah kalimat diakhiri dengan `. ! ?` diikuti oleh EOL, spasi, atau tab. Anda dapat melompat ke kalimat berikutnya dengan `)` dan kalimat sebelumnya dengan `(`.

```shell
(    Melompat ke kalimat sebelumnya
)    Melompat ke kalimat berikutnya
```

Mari kita lihat beberapa contoh. Menurut Anda, frasa mana yang merupakan kalimat dan mana yang bukan? Cobalah bernavigasi dengan `(` dan `)` di Vim!

```shell
Saya adalah sebuah kalimat. Saya adalah kalimat lain karena saya diakhiri dengan titik. Saya masih sebuah kalimat ketika diakhiri dengan tanda seru! Bagaimana dengan tanda tanya? Saya tidak sepenuhnya kalimat karena tanda hubung - dan juga titik koma ; maupun titik :

Ada baris kosong di atas saya.
```

Omong-omong, jika Anda mengalami masalah dengan Vim yang tidak menghitung kalimat untuk frasa yang dipisahkan oleh `.` diikuti oleh satu baris, Anda mungkin berada dalam mode `'compatible'`. Tambahkan `set nocompatible` ke vimrc. Di Vi, sebuah kalimat adalah `.` diikuti oleh **dua** spasi. Anda harus selalu mengatur `nocompatible`.

Mari kita bicarakan apa itu paragraf. Sebuah paragraf dimulai setelah setiap baris kosong dan juga di setiap set makro paragraf yang ditentukan oleh pasangan karakter dalam opsi paragraf.

```shell
{    Melompat ke paragraf sebelumnya
}    Melompat ke paragraf berikutnya
```

Jika Anda tidak yakin apa itu makro paragraf, jangan khawatir. Hal yang penting adalah bahwa sebuah paragraf dimulai dan diakhiri setelah baris kosong. Ini seharusnya benar sebagian besar waktu.

Mari kita lihat contoh ini. Cobalah bernavigasi dengan `}` dan `{` (juga, bermain-main dengan navigasi kalimat `( )` untuk bergerak juga!)

```shell
Halo. Apa kabar? Saya baik-baik saja, terima kasih!
Vim itu luar biasa.
Mungkin tidak mudah untuk mempelajarinya di awal...- tetapi kita bersama dalam hal ini. Semoga berhasil!

Halo lagi.

Cobalah untuk bergerak dengan ), (, }, dan {. Rasakan bagaimana cara kerjanya.
Anda bisa melakukannya.
```

Periksa `:h sentence` dan `:h paragraph` untuk belajar lebih lanjut.

## Navigasi Kecocokan

Programmer menulis dan mengedit kode. Kode biasanya menggunakan tanda kurung, kurung kurawal, dan tanda kurung siku. Anda bisa dengan mudah tersesat di dalamnya. Jika Anda berada di dalam satu, Anda dapat melompat ke pasangan lainnya (jika ada) dengan `%`. Anda juga dapat menggunakan ini untuk mengetahui apakah Anda memiliki tanda kurung, kurung kurawal, dan tanda kurung siku yang cocok.

```shell
%    Navigasi ke kecocokan lainnya, biasanya berfungsi untuk (), [], {}
```

Mari kita lihat contoh kode Scheme karena menggunakan tanda kurung secara ekstensif. Bergeraklah dengan `%` di dalam berbagai tanda kurung.

```shell
(define (fib n)
  (cond ((= n 0) 0)
        ((= n 1) 1)
        (else
          (+ (fib (- n 1)) (fib (- n 2)))
        )))
```

Saya pribadi suka melengkapi `%` dengan plugin indikator visual seperti [vim-rainbow](https://github.com/frazrepo/vim-rainbow). Untuk lebih lanjut, lihat `:h %`.

## Navigasi Nomor Baris

Anda dapat melompat ke nomor baris `n` dengan `nG`. Misalnya, jika Anda ingin melompat ke baris 7, gunakan `7G`. Untuk melompat ke baris pertama, gunakan `1G` atau `gg`. Untuk melompat ke baris terakhir, gunakan `G`.

Seringkali Anda tidak tahu dengan tepat nomor baris target Anda, tetapi Anda tahu itu kira-kira berada di 70% dari seluruh file. Dalam hal ini, Anda dapat melakukan `70%`. Untuk melompat setengah jalan melalui file, Anda dapat melakukan `50%`.

```shell
gg    Pergi ke baris pertama
G     Pergi ke baris terakhir
nG    Pergi ke baris n
n%    Pergi ke n% dalam file
```

Omong-omong, jika Anda ingin melihat total baris dalam sebuah file, Anda dapat menggunakan `Ctrl-g`.

## Navigasi Jendela

Untuk dengan cepat pergi ke atas, tengah, atau bawah *jendela* Anda, Anda dapat menggunakan `H`, `M`, dan `L`.

Anda juga dapat memberikan hitungan ke `H` dan `L`. Jika Anda menggunakan `10H`, Anda akan pergi 10 baris di bawah bagian atas jendela. Jika Anda menggunakan `3L`, Anda akan pergi 3 baris di atas baris terakhir jendela.

```shell
H     Pergi ke atas layar
M     Pergi ke layar tengah
L     Pergi ke bawah layar
nH    Pergi n baris dari atas
nL    Pergi n baris dari bawah
```

## Menggulir

Untuk menggulir, Anda memiliki 3 kecepatan peningkatan: layar penuh (`Ctrl-F/Ctrl-B`), setengah layar (`Ctrl-D/Ctrl-U`), dan baris (`Ctrl-E/Ctrl-Y`).

```shell
Ctrl-E    Gulir ke bawah satu baris
Ctrl-D    Gulir ke bawah setengah layar
Ctrl-F    Gulir ke bawah seluruh layar
Ctrl-Y    Gulir ke atas satu baris
Ctrl-U    Gulir ke atas setengah layar
Ctrl-B    Gulir ke atas seluruh layar
```

Anda juga dapat menggulir relatif terhadap baris saat ini (memperbesar tampilan layar):

```shell
zt    Bawa baris saat ini mendekati bagian atas layar Anda
zz    Bawa baris saat ini ke tengah layar Anda
zb    Bawa baris saat ini mendekati bagian bawah layar Anda
```
## Navigasi Pencarian

Seringkali Anda tahu bahwa sebuah frasa ada di dalam file. Anda dapat menggunakan navigasi pencarian untuk dengan cepat mencapai target Anda. Untuk mencari sebuah frasa, Anda dapat menggunakan `/` untuk mencari ke depan dan `?` untuk mencari ke belakang. Untuk mengulangi pencarian terakhir, Anda dapat menggunakan `n`. Untuk mengulangi pencarian terakhir ke arah yang berlawanan, Anda dapat menggunakan `N`.

```shell
/    Mencari ke depan untuk mencocokkan
?    Mencari ke belakang untuk mencocokkan
n    Mengulangi pencarian terakhir dalam arah yang sama dengan pencarian sebelumnya
N    Mengulangi pencarian terakhir dalam arah berlawanan dengan pencarian sebelumnya
```

Misalkan Anda memiliki teks ini:

```shell
let one = 1;
let two = 2;
one = "01";
one = "one";
let onetwo = 12;
```

Jika Anda mencari "let", jalankan `/let`. Untuk mencari "let" lagi dengan cepat, Anda dapat melakukan `n`. Untuk mencari "let" lagi ke arah yang berlawanan, jalankan `N`. Jika Anda menjalankan `?let`, itu akan mencari "let" ke belakang. Jika Anda menggunakan `n`, itu sekarang akan mencari "let" ke belakang (`N` akan mencari "let" ke depan sekarang).

Anda dapat mengaktifkan sorotan pencarian dengan `set hlsearch`. Sekarang ketika Anda mencari `/let`, itu akan menyoroti *semua* frasa yang cocok di dalam file. Selain itu, Anda dapat mengatur pencarian inkremental dengan `set incsearch`. Ini akan menyoroti pola saat mengetik. Secara default, frasa yang cocok akan tetap disorot sampai Anda mencari frasa lain. Ini bisa dengan cepat menjadi mengganggu. Untuk menonaktifkan sorotan, Anda dapat menjalankan `:nohlsearch` atau cukup `:noh`. Karena saya sering menggunakan fitur tanpa sorotan ini, saya membuat peta di vimrc:

```shell
nnoremap <esc><esc> :noh<return><esc>
```

Anda dapat dengan cepat mencari teks di bawah kursor dengan `*` untuk mencari ke depan dan `#` untuk mencari ke belakang. Jika kursor Anda berada di string "one", menekan `*` akan sama seperti jika Anda melakukan `/\<one\>`.

Baik `\<` dan `\>` dalam `/\<one\>` berarti pencarian kata utuh. Itu tidak cocok dengan "one" jika itu adalah bagian dari kata yang lebih besar. Itu akan cocok untuk kata "one" tetapi tidak "onetwo". Jika kursor Anda berada di "one" dan Anda ingin mencari ke depan untuk mencocokkan kata utuh atau sebagian seperti "one" dan "onetwo", Anda perlu menggunakan `g*` alih-alih `*`.

```shell
*     Mencari kata utuh di bawah kursor ke depan
#     Mencari kata utuh di bawah kursor ke belakang
g*    Mencari kata di bawah kursor ke depan
g#    Mencari kata di bawah kursor ke belakang
```

## Menandai Posisi

Anda dapat menggunakan tanda untuk menyimpan posisi Anda saat ini dan kembali ke posisi ini nanti. Ini seperti bookmark untuk pengeditan teks. Anda dapat menetapkan tanda dengan `mx`, di mana `x` dapat berupa huruf alfabetik apa pun `a-zA-Z`. Ada dua cara untuk kembali ke tanda: tepat (baris dan kolom) dengan `` `x `` dan berdasarkan baris (`'x`).

```shell
ma    Tandai posisi dengan tanda "a"
`a    Lompat ke baris dan kolom "a"
'a    Lompat ke baris "a"
```

Ada perbedaan antara menandai dengan huruf kecil (a-z) dan huruf besar (A-Z). Huruf kecil adalah tanda lokal dan huruf besar adalah tanda global (kadang-kadang dikenal sebagai tanda file).

Mari kita bicarakan tentang tanda lokal. Setiap buffer dapat memiliki set tanda lokalnya sendiri. Jika saya memiliki dua file terbuka, saya dapat menetapkan tanda "a" (`ma`) di file pertama dan tanda "a" lainnya (`ma`) di file kedua.

Berbeda dengan tanda lokal di mana Anda dapat memiliki satu set tanda di setiap buffer, Anda hanya mendapatkan satu set tanda global. Jika Anda menetapkan `mA` di dalam `myFile.txt`, kali berikutnya Anda menjalankan `mA` di file yang berbeda, itu akan menimpa tanda "A" pertama. Salah satu keuntungan dari tanda global adalah Anda dapat melompat ke tanda global mana pun bahkan jika Anda berada di proyek yang sama sekali berbeda. Tanda global dapat berpindah antar file.

Untuk melihat semua tanda, gunakan `:marks`. Anda mungkin memperhatikan dari daftar tanda ada lebih banyak tanda selain `a-zA-Z`. Beberapa di antaranya adalah:

```shell
''    Lompat kembali ke baris terakhir di buffer saat ini sebelum lompat
``    Lompat kembali ke posisi terakhir di buffer saat ini sebelum lompat
`[    Lompat ke awal teks yang sebelumnya diubah / disalin
`]    Lompat ke akhir teks yang sebelumnya diubah / disalin
`<    Lompat ke awal pilihan visual terakhir
`>    Lompat ke akhir pilihan visual terakhir
`0    Lompat kembali ke file terakhir yang diedit saat keluar dari vim
```

Ada lebih banyak tanda daripada yang terdaftar di atas. Saya tidak akan membahasnya di sini karena saya rasa mereka jarang digunakan, tetapi jika Anda penasaran, lihat `:h marks`.

## Lompat

Di Vim, Anda dapat "lompat" ke file yang berbeda atau bagian yang berbeda dari file dengan beberapa gerakan. Tidak semua gerakan dihitung sebagai lompat, meskipun. Pergi ke bawah dengan `j` tidak dihitung sebagai lompat. Pergi ke baris 10 dengan `10G` dihitung sebagai lompat.

Berikut adalah perintah yang dianggap Vim sebagai perintah "lompat":

```shell
'       Pergi ke baris yang ditandai
`       Pergi ke posisi yang ditandai
G       Pergi ke baris
/       Mencari ke depan
?       Mencari ke belakang
n       Mengulangi pencarian terakhir, arah yang sama
N       Mengulangi pencarian terakhir, arah berlawanan
%       Temukan kecocokan
(       Pergi ke kalimat terakhir
)       Pergi ke kalimat berikutnya
{       Pergi ke paragraf terakhir
}       Pergi ke paragraf berikutnya
L       Pergi ke baris terakhir dari jendela yang ditampilkan
M       Pergi ke baris tengah dari jendela yang ditampilkan
H       Pergi ke baris atas dari jendela yang ditampilkan
[[      Pergi ke bagian sebelumnya
]]      Pergi ke bagian berikutnya
:s      Ganti
:tag    Lompat ke definisi tag
```

Saya tidak merekomendasikan untuk menghafal daftar ini. Aturan praktis yang baik adalah, setiap gerakan yang bergerak lebih jauh dari satu kata dan navigasi baris saat ini kemungkinan besar adalah lompat. Vim melacak di mana Anda telah berada saat Anda bergerak dan Anda dapat melihat daftar ini di dalam `:jumps`.

Untuk lebih lanjut, lihat `:h jump-motions`.

Mengapa lompat berguna? Karena Anda dapat menavigasi daftar lompat dengan `Ctrl-O` untuk bergerak ke atas daftar lompat dan `Ctrl-I` untuk bergerak ke bawah daftar lompat. `hjkl` bukanlah perintah "lompat", tetapi Anda dapat secara manual menambahkan lokasi saat ini ke daftar lompat dengan `m'` sebelum gerakan. Misalnya, `m'5j` menambahkan lokasi saat ini ke daftar lompat dan bergerak ke bawah 5 baris, dan Anda dapat kembali dengan `Ctrl-O`. Anda dapat melompat antar file yang berbeda, yang akan saya bahas lebih lanjut di bagian berikutnya.

## Pelajari Navigasi dengan Cara Cerdas

Jika Anda baru di Vim, ini adalah banyak yang harus dipelajari. Saya tidak mengharapkan siapa pun untuk mengingat semuanya segera. Butuh waktu sebelum Anda dapat mengeksekusinya tanpa berpikir.

Saya pikir cara terbaik untuk memulai adalah menghafal beberapa gerakan penting. Saya merekomendasikan untuk memulai dengan 10 gerakan ini: `h, j, k, l, w, b, G, /, ?, n`. Ulangi mereka cukup sampai Anda dapat menggunakannya tanpa berpikir.

Untuk meningkatkan keterampilan navigasi Anda, berikut adalah saran saya:
1. Perhatikan tindakan yang berulang. Jika Anda menemukan diri Anda melakukan `l` berulang kali, cari gerakan yang akan membawa Anda maju lebih cepat. Anda akan menemukan bahwa Anda dapat menggunakan `w`. Jika Anda menangkap diri Anda melakukan `w` berulang kali, lihat apakah ada gerakan yang akan membawa Anda melintasi baris saat ini dengan cepat. Anda akan menemukan bahwa Anda dapat menggunakan `f`. Jika Anda dapat menggambarkan kebutuhan Anda dengan singkat, ada kemungkinan besar Vim memiliki cara untuk melakukannya.
2. Setiap kali Anda mempelajari gerakan baru, luangkan waktu sampai Anda dapat melakukannya tanpa berpikir.

Akhirnya, sadari bahwa Anda tidak perlu mengetahui setiap perintah Vim untuk menjadi produktif. Sebagian besar pengguna Vim tidak. Saya tidak. Pelajari perintah yang akan membantu Anda menyelesaikan tugas Anda saat itu.

Luangkan waktu Anda. Keterampilan navigasi adalah keterampilan yang sangat penting di Vim. Pelajari satu hal kecil setiap hari dan pelajari dengan baik.