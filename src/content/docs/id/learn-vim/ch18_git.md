---
description: Dokumen ini membahas cara mengintegrasikan Vim dan Git, termasuk penggunaan
  perintah `vimdiff` untuk membandingkan perbedaan antara dua file.
title: Ch18. Git
---

Vim dan git adalah dua alat hebat untuk dua hal yang berbeda. Git adalah alat kontrol versi. Vim adalah editor teks.

Dalam bab ini, Anda akan belajar berbagai cara untuk mengintegrasikan Vim dan git bersama-sama.

## Diffing

Ingat di bab sebelumnya, Anda dapat menjalankan perintah `vimdiff` untuk menunjukkan perbedaan antara beberapa file.

Misalkan Anda memiliki dua file, `file1.txt` dan `file2.txt`.

Di dalam `file1.txt`:

```shell
pancakes
waffles
apples

milk
apple juice

yogurt
```

Di dalam `file2.txt`:

```shell
pancakes
waffles
oranges

milk
orange juice

yogurt
```

Untuk melihat perbedaan antara kedua file, jalankan:

```shell
vimdiff file1.txt file2.txt
```

Sebagai alternatif, Anda bisa menjalankan:

```shell
vim -d file1.txt file2.txt
```

`vimdiff` menampilkan dua buffer berdampingan. Di sebelah kiri adalah `file1.txt` dan di sebelah kanan adalah `file2.txt`. Perbedaan pertama (apples dan oranges) disorot di kedua baris.

Misalkan Anda ingin membuat buffer kedua memiliki apples, bukan oranges. Untuk mentransfer konten dari posisi Anda saat ini (Anda saat ini berada di `file1.txt`) ke `file2.txt`, pertama pergi ke diff berikutnya dengan `]c` (untuk melompat ke jendela diff sebelumnya, gunakan `[c`). Kursor Anda sekarang harus berada di apples. Jalankan `:diffput`. Kedua file sekarang harus memiliki apples.

Jika Anda perlu mentransfer teks dari buffer lain (orange juice, `file2.txt`) untuk mengganti teks di buffer saat ini (apple juice, `file1.txt`), dengan kursor Anda masih di jendela `file1.txt`, pertama pergi ke diff berikutnya dengan `]c`. Kursor Anda sekarang harus berada di apple juice. Jalankan `:diffget` untuk mendapatkan orange juice dari buffer lain untuk mengganti apple juice di buffer kami.

`:diffput` *mengeluarkan* teks dari buffer saat ini ke buffer lain. `:diffget` *mengambil* teks dari buffer lain ke buffer saat ini.

Jika Anda memiliki beberapa buffer, Anda dapat menjalankan `:diffput fileN.txt` dan `:diffget fileN.txt` untuk menargetkan buffer fileN.

## Vim Sebagai Alat Penggabungan

> "Saya suka menyelesaikan konflik penggabungan!" - Tidak ada

Saya tidak tahu siapa pun yang suka menyelesaikan konflik penggabungan. Namun, mereka tidak dapat dihindari. Dalam bagian ini, Anda akan belajar bagaimana memanfaatkan Vim sebagai alat penyelesaian konflik penggabungan.

Pertama, ubah alat penggabungan default untuk menggunakan `vimdiff` dengan menjalankan:

```shell
git config merge.tool vimdiff
git config merge.conflictstyle diff3
git config mergetool.prompt false
```

Sebagai alternatif, Anda dapat mengubah `~/.gitconfig` secara langsung (secara default seharusnya berada di root, tetapi milik Anda mungkin berada di tempat yang berbeda). Perintah di atas harus mengubah gitconfig Anda agar terlihat seperti pengaturan di bawah ini, jika Anda belum menjalankannya, Anda juga dapat mengedit gitconfig Anda secara manual.

```shell
[core]
  editor = vim
[merge]
  tool = vimdiff
  conflictstyle = diff3
[difftool]
  prompt = false
```

Mari kita buat konflik penggabungan palsu untuk menguji ini. Buat direktori `/food` dan jadikan sebagai repositori git:

```shell
git init
```

Tambahkan file, `breakfast.txt`. Di dalam:

```shell
pancakes
waffles
oranges
```

Tambahkan file dan komit:

```shell
git add .
git commit -m "Initial breakfast commit"
```

Selanjutnya, buat cabang baru dan beri nama cabang apples:

```shell
git checkout -b apples
```

Ubah `breakfast.txt`:

```shell
pancakes
waffles
apples
```

Simpan file, lalu tambahkan dan komit perubahan:

```shell
git add .
git commit -m "Apples not oranges"
```

Bagus. Sekarang Anda memiliki oranges di cabang master dan apples di cabang apples. Mari kita kembali ke cabang master:

```shell
git checkout master
```

Di dalam `breakfast.txt`, Anda harus melihat teks dasar, oranges. Mari kita ubah menjadi grapes karena mereka sedang musim sekarang:

```shell
pancakes
waffles
grapes
```

Simpan, tambahkan, dan komit:

```shell
git add .
git commit -m "Grapes not oranges"
```

Sekarang Anda siap untuk menggabungkan cabang apples ke dalam cabang master:

```shell
git merge apples
```

Anda harus melihat kesalahan:

```shell
Auto-merging breakfast.txt
CONFLICT (content): Merge conflict in breakfast.txt
Automatic merge failed; fix conflicts and then commit the result.
```

Sebuah konflik, hebat! Mari kita selesaikan konflik menggunakan `mergetool` yang baru dikonfigurasi. Jalankan:

```shell
git mergetool
```

Vim menampilkan empat jendela. Perhatikan tiga jendela di atas:

- `LOCAL` berisi `grapes`. Ini adalah perubahan di "lokal", yang Anda gabungkan.
- `BASE` berisi `oranges`. Ini adalah nenek moyang umum antara `LOCAL` dan `REMOTE` untuk membandingkan bagaimana mereka menyimpang.
- `REMOTE` berisi `apples`. Ini adalah apa yang sedang digabungkan.

Di bagian bawah (jendela keempat) Anda melihat:

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

Jendela keempat berisi teks konflik penggabungan. Dengan pengaturan ini, lebih mudah untuk melihat perubahan yang dimiliki setiap lingkungan. Anda dapat melihat konten dari `LOCAL`, `BASE`, dan `REMOTE` sekaligus.

Kursor Anda harus berada di jendela keempat, di area yang disorot. Untuk mendapatkan perubahan dari `LOCAL` (grapes), jalankan `:diffget LOCAL`. Untuk mendapatkan perubahan dari `BASE` (oranges), jalankan `:diffget BASE` dan untuk mendapatkan perubahan dari `REMOTE` (apples), jalankan `:diffget REMOTE`.

Dalam hal ini, mari kita ambil perubahan dari `LOCAL`. Jalankan `:diffget LOCAL`. Jendela keempat sekarang akan memiliki grapes. Simpan dan keluar dari semua file (`:wqall`) ketika Anda selesai. Itu tidak buruk, kan?

Jika Anda perhatikan, Anda juga memiliki file `breakfast.txt.orig` sekarang. Git membuat file cadangan jika ada yang tidak berjalan dengan baik. Jika Anda tidak ingin git membuat cadangan selama penggabungan, jalankan:

```shell
git config --global mergetool.keepBackup false
```

## Git Di Dalam Vim

Vim tidak memiliki fitur git bawaan. Salah satu cara untuk menjalankan perintah git dari Vim adalah dengan menggunakan operator bang, `!`, di mode baris perintah.

Perintah git apa pun dapat dijalankan dengan `!`:

```shell
:!git status
:!git commit
:!git diff
:!git push origin master
```

Anda juga dapat menggunakan konvensi Vim `%` (buffer saat ini) atau `#` (buffer lain):

```shell
:!git add %         " git add file saat ini
:!git checkout #    " git checkout file lain
```

Salah satu trik Vim yang dapat Anda gunakan untuk menambahkan beberapa file di jendela Vim yang berbeda adalah dengan menjalankan:

```shell
:windo !git add %
```

Kemudian buat komit:

```shell
:!git commit "Just git-added everything in my Vim window, cool"
```

Perintah `windo` adalah salah satu perintah "lakukan" di Vim, mirip dengan `argdo` yang Anda lihat sebelumnya. `windo` mengeksekusi perintah di setiap jendela.

Sebagai alternatif, Anda juga dapat menggunakan `bufdo !git add %` untuk git add semua buffer atau `argdo !git add %` untuk git add semua argumen file, tergantung pada alur kerja Anda.

## Plugin

Ada banyak plugin Vim untuk dukungan git. Di bawah ini adalah daftar beberapa plugin terkait git yang populer untuk Vim (mungkin ada lebih banyak saat Anda membaca ini):

- [vim-gitgutter](https://github.com/airblade/vim-gitgutter)
- [vim-signify](https://github.com/mhinz/vim-signify)
- [vim-fugitive](https://github.com/tpope/vim-fugitive)
- [gv.vim](https://github.com/junegunn/gv.vim)
- [vimagit](https://github.com/jreybert/vimagit)
- [vim-twiggy](https://github.com/sodapopcan/vim-twiggy)
- [rhubarb](https://github.com/tpope/vim-rhubarb)

Salah satu yang paling populer adalah vim-fugitive. Untuk sisa bab ini, saya akan membahas beberapa alur kerja git menggunakan plugin ini.

## Vim-fugitive

Plugin vim-fugitive memungkinkan Anda menjalankan CLI git tanpa meninggalkan editor Vim. Anda akan menemukan bahwa beberapa perintah lebih baik dieksekusi dari dalam Vim.

Untuk memulai, instal vim-fugitive dengan manajer plugin Vim ([vim-plug](https://github.com/junegunn/vim-plug), [vundle](https://github.com/VundleVim/Vundle.vim), [dein.vim](https://github.com/Shougo/dein.vim), dll).

## Status Git

Ketika Anda menjalankan perintah `:Git` tanpa parameter, vim-fugitive menampilkan jendela ringkasan git. Ini menunjukkan file yang tidak terlacak, tidak dipentaskan, dan dipentaskan. Saat dalam mode "`git status`", Anda dapat melakukan beberapa hal:
- `Ctrl-N` / `Ctrl-P` untuk naik atau turun daftar file.
- `-` untuk mementaskan atau membatalkan pentas nama file di bawah kursor.
- `s` untuk mementaskan nama file di bawah kursor.
- `u` untuk membatalkan pentas nama file di bawah kursor.
- `>` / `<` untuk menampilkan atau menyembunyikan diff inline dari nama file di bawah kursor.

Untuk lebih lanjut, lihat `:h fugitive-staging-maps`.

## Git Blame

Ketika Anda menjalankan perintah `:Git blame` dari file saat ini, vim-fugitive menampilkan jendela blame terpisah. Ini bisa berguna untuk menemukan orang yang bertanggung jawab menulis baris kode yang bermasalah sehingga Anda bisa berteriak padanya / dia (hanya bercanda).

Beberapa hal yang dapat Anda lakukan saat dalam mode `"git blame"`:
- `q` untuk menutup jendela blame.
- `A` untuk mengubah ukuran kolom penulis.
- `C` untuk mengubah ukuran kolom komit.
- `D` untuk mengubah ukuran kolom tanggal / waktu.

Untuk lebih lanjut, lihat `:h :Git_blame`.

## Gdiffsplit

Ketika Anda menjalankan perintah `:Gdiffsplit`, vim-fugitive menjalankan `vimdiff` dari perubahan terbaru file saat ini terhadap indeks atau pohon kerja. Jika Anda menjalankan `:Gdiffsplit <commit>`, vim-fugitive menjalankan `vimdiff` terhadap file tersebut di dalam `<commit>`.

Karena Anda berada dalam mode `vimdiff`, Anda dapat *mengambil* atau *mengeluarkan* diff dengan `:diffput` dan `:diffget`.

## Gwrite dan Gread

Ketika Anda menjalankan perintah `:Gwrite` di sebuah file setelah Anda membuat perubahan, vim-fugitive mementaskan perubahan tersebut. Ini seperti menjalankan `git add <current-file>`.

Ketika Anda menjalankan perintah `:Gread` di sebuah file setelah Anda membuat perubahan, vim-fugitive mengembalikan file ke keadaan sebelum perubahan. Ini seperti menjalankan `git checkout <current-file>`. Salah satu keuntungan menjalankan `:Gread` adalah tindakan ini dapat dibatalkan. Jika, setelah Anda menjalankan `:Gread`, Anda berubah pikiran dan ingin menyimpan perubahan lama, Anda dapat menjalankan undo (`u`) dan Vim akan membatalkan tindakan `:Gread`. Ini tidak akan mungkin jika Anda menjalankan `git checkout <current-file>` dari CLI.

## Gclog

Ketika Anda menjalankan perintah `:Gclog`, vim-fugitive menampilkan riwayat komit. Ini seperti menjalankan perintah `git log`. Vim-fugitive menggunakan quickfix Vim untuk mencapai ini, sehingga Anda dapat menggunakan `:cnext` dan `:cprevious` untuk menjelajahi informasi log berikutnya atau sebelumnya. Anda dapat membuka dan menutup daftar log dengan `:copen` dan `:cclose`.

Saat dalam mode `"git log"` ini, Anda dapat melakukan dua hal:
- Melihat pohon.
- Mengunjungi induk (komit sebelumnya).

Anda dapat meneruskan argumen ke `:Gclog` sama seperti perintah `git log`. Jika proyek Anda memiliki riwayat komit yang panjang dan Anda hanya perlu melihat tiga komit terakhir, Anda dapat menjalankan `:Gclog -3`. Jika Anda perlu menyaringnya berdasarkan tanggal pengirim, Anda dapat menjalankan sesuatu seperti `:Gclog --after="January 1" --before="March 14"`.

## Lebih Banyak Vim-fugitive

Ini hanya beberapa contoh dari apa yang dapat dilakukan vim-fugitive. Untuk mempelajari lebih lanjut tentang vim-fugitive, lihat `:h fugitive.txt`. Sebagian besar perintah git yang populer mungkin telah dioptimalkan dengan vim-fugitive. Anda hanya perlu mencarinya di dokumentasi.

Jika Anda berada di salah satu "mode khusus" vim-fugitive (misalnya, di dalam mode `:Git` atau `:Git blame`) dan Anda ingin mengetahui pintasan apa yang tersedia, tekan `g?`. Vim-fugitive akan menampilkan jendela `:help` yang sesuai untuk mode yang Anda masuki. Keren!
## Pelajari Vim dan Git dengan Cara Cerdas

Anda mungkin menemukan vim-fugitive sebagai pelengkap yang baik untuk alur kerja Anda (atau tidak). Terlepas dari itu, saya sangat mendorong Anda untuk memeriksa semua plugin yang terdaftar di atas. Mungkin ada yang lain yang tidak saya sebutkan. Cobalah.

Salah satu cara yang jelas untuk menjadi lebih baik dengan integrasi Vim-git adalah dengan membaca lebih banyak tentang git. Git, dengan sendirinya, adalah topik yang luas dan saya hanya menunjukkan sebagian kecil darinya. Dengan itu, mari kita *git going* (maafkan permainan kata ini) dan bicarakan tentang bagaimana menggunakan Vim untuk mengompilasi kode Anda!