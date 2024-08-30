---
description: Hướng dẫn cách tổ chức và cấu hình tệp vimrc trong Vim, bao gồm cách
  Vim tìm kiếm tệp vimrc và các vị trí kiểm tra.
title: Ch22. Vimrc
---

Trong các chương trước, bạn đã học cách sử dụng Vim. Trong chương này, bạn sẽ học cách tổ chức và cấu hình vimrc.

## Cách Vim Tìm Vimrc

Tri thức thông thường cho vimrc là thêm một tệp dotfile `.vimrc` trong thư mục chính `~/.vimrc` (nó có thể khác tùy thuộc vào hệ điều hành của bạn).

Đằng sau, Vim sẽ xem xét nhiều vị trí để tìm tệp vimrc. Dưới đây là các vị trí mà Vim kiểm tra:
- `$VIMINIT`
- `$HOME/.vimrc`
- `$HOME/.vim/vimrc`
- `$EXINIT`
- `$HOME/.exrc`
- `$VIMRUNTIME/defaults.vim`

Khi bạn khởi động Vim, nó sẽ kiểm tra sáu vị trí trên theo thứ tự đó để tìm tệp vimrc. Tệp vimrc đầu tiên được tìm thấy sẽ được sử dụng và các tệp còn lại sẽ bị bỏ qua.

Đầu tiên, Vim sẽ tìm kiếm `$VIMINIT`. Nếu không có gì ở đó, Vim sẽ kiểm tra `$HOME/.vimrc`. Nếu không có gì ở đó, Vim sẽ kiểm tra `$HOME/.vim/vimrc`. Nếu Vim tìm thấy, nó sẽ dừng tìm kiếm và sử dụng `$HOME/.vim/vimrc`.

Vị trí đầu tiên, `$VIMINIT`, là một biến môi trường. Mặc định nó không được định nghĩa. Nếu bạn muốn sử dụng `~/dotfiles/testvimrc` làm giá trị `$VIMINIT`, bạn có thể tạo một biến môi trường chứa đường dẫn của vimrc đó. Sau khi bạn chạy `export VIMINIT='let $MYVIMRC="$HOME/dotfiles/testvimrc" | source $MYVIMRC'`, Vim sẽ sử dụng `~/dotfiles/testvimrc` làm tệp vimrc của bạn.

Vị trí thứ hai, `$HOME/.vimrc`, là đường dẫn thông thường cho nhiều người dùng Vim. `$HOME` trong nhiều trường hợp là thư mục chính của bạn (`~`). Nếu bạn có tệp `~/.vimrc`, Vim sẽ sử dụng tệp này làm tệp vimrc của bạn.

Vị trí thứ ba, `$HOME/.vim/vimrc`, nằm trong thư mục `~/.vim`. Bạn có thể đã có thư mục `~/.vim` cho các plugin, kịch bản tùy chỉnh hoặc tệp View. Lưu ý rằng không có dấu chấm trong tên tệp vimrc (`$HOME/.vim/.vimrc` sẽ không hoạt động, nhưng `$HOME/.vim/vimrc` sẽ hoạt động).

Vị trí thứ tư, `$EXINIT`, hoạt động tương tự như `$VIMINIT`.

Vị trí thứ năm, `$HOME/.exrc`, hoạt động tương tự như `$HOME/.vimrc`.

Vị trí thứ sáu, `$VIMRUNTIME/defaults.vim` là vimrc mặc định đi kèm với bản dựng Vim của bạn. Trong trường hợp của tôi, tôi đã cài đặt Vim 8.2 bằng Homebrew, vì vậy đường dẫn của tôi là (`/usr/local/share/vim/vim82`). Nếu Vim không tìm thấy bất kỳ tệp vimrc nào trong sáu tệp trước đó, nó sẽ sử dụng tệp này.

Trong phần còn lại của chương này, tôi giả định rằng vimrc sử dụng đường dẫn `~/.vimrc`.

## Tôi Nên Đặt Gì Vào Vimrc Của Mình?

Một câu hỏi tôi đã đặt ra khi tôi bắt đầu là, "Tôi nên đặt gì vào vimrc của mình?"

Câu trả lời là, "bất cứ điều gì bạn muốn". Cám dỗ để sao chép-và-dán vimrc của người khác là có thật, nhưng bạn nên kiềm chế. Nếu bạn khăng khăng muốn sử dụng vimrc của người khác, hãy chắc chắn rằng bạn biết nó làm gì, tại sao và cách mà họ sử dụng nó, và quan trọng nhất, nếu nó có liên quan đến bạn. Chỉ vì ai đó sử dụng nó không có nghĩa là bạn cũng sẽ sử dụng nó.

## Nội Dung Vimrc Cơ Bản

Tóm lại, một vimrc là một tập hợp của:
- Plugins
- Cài đặt
- Hàm Tùy Chỉnh
- Lệnh Tùy Chỉnh
- Ánh Xạ

Có những thứ khác không được đề cập ở trên, nhưng nhìn chung, điều này bao phủ hầu hết các trường hợp sử dụng.

### Plugins

Trong các chương trước, tôi đã đề cập đến các plugin khác nhau, như [fzf.vim](https://github.com/junegunn/fzf.vim), [vim-mundo](https://github.com/simnalamburt/vim-mundo), và [vim-fugitive](https://github.com/tpope/vim-fugitive).

Mười năm trước, việc quản lý plugin là một cơn ác mộng. Tuy nhiên, với sự gia tăng của các trình quản lý plugin hiện đại, việc cài đặt plugin giờ đây có thể được thực hiện trong vài giây. Hiện tại tôi đang sử dụng [vim-plug](https://github.com/junegunn/vim-plug) làm trình quản lý plugin của mình, vì vậy tôi sẽ sử dụng nó trong phần này. Khái niệm này sẽ tương tự với các trình quản lý plugin phổ biến khác. Tôi rất khuyến khích bạn kiểm tra các trình quản lý khác nhau, chẳng hạn như:
- [vundle.vim](https://github.com/VundleVim/Vundle.vim)
- [vim-pathogen](https://github.com/tpope/vim-pathogen)
- [dein.vim](https://github.com/Shougo/dein.vim)

Có nhiều trình quản lý plugin hơn những cái được liệt kê ở trên, hãy thoải mái tìm kiếm. Để cài đặt vim-plug, nếu bạn có máy Unix, hãy chạy:

```shell
curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

Để thêm plugin mới, hãy đặt tên plugin của bạn (`Plug 'github-username/repository-name'`) giữa các dòng `call plug#begin()` và `call plug#end()`. Vì vậy, nếu bạn muốn cài đặt `emmet-vim` và `nerdtree`, hãy thêm đoạn mã sau vào vimrc của bạn:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

Lưu các thay đổi, tải lại (`:source %`), và chạy `:PlugInstall` để cài đặt chúng.

Trong tương lai, nếu bạn cần loại bỏ các plugin không sử dụng, bạn chỉ cần xóa tên plugin khỏi khối `call`, lưu và tải lại, và chạy lệnh `:PlugClean` để loại bỏ nó khỏi máy của bạn.

Vim 8 có các trình quản lý gói tích hợp sẵn. Bạn có thể kiểm tra `:h packages` để biết thêm thông tin. Trong chương tiếp theo, tôi sẽ chỉ cho bạn cách sử dụng nó.

### Cài Đặt

Thường thấy nhiều tùy chọn `set` trong bất kỳ vimrc nào. Nếu bạn chạy lệnh set từ chế độ dòng lệnh, nó sẽ không vĩnh viễn. Bạn sẽ mất nó khi đóng Vim. Ví dụ, thay vì chạy `:set relativenumber number` từ chế độ dòng lệnh mỗi lần bạn chạy Vim, bạn có thể chỉ cần đặt những điều này vào trong vimrc:

```shell
set relativenumber number
```

Một số cài đặt yêu cầu bạn phải truyền cho nó một giá trị, như `set tabstop=2`. Kiểm tra trang trợ giúp cho mỗi cài đặt để tìm hiểu loại giá trị nào nó chấp nhận.

Bạn cũng có thể sử dụng `let` thay vì `set` (hãy chắc chắn thêm `&` trước). Với `let`, bạn có thể sử dụng một biểu thức làm giá trị. Ví dụ, để đặt tùy chọn `'dictionary'` thành một đường dẫn chỉ khi đường dẫn tồn tại:

```shell
let s:english_dict = "/usr/share/dict/words"

if filereadable(s:english_dict)
  let &dictionary=s:english_dict
endif
```

Bạn sẽ học về các phép gán và điều kiện Vimscript trong các chương sau.

Để có danh sách tất cả các tùy chọn có thể có trong Vim, hãy kiểm tra `:h E355`.

### Hàm Tùy Chỉnh

Vimrc là một nơi tốt để đặt các hàm tùy chỉnh. Bạn sẽ học cách viết các hàm Vimscript của riêng mình trong một chương sau.

### Lệnh Tùy Chỉnh

Bạn có thể tạo một lệnh dòng lệnh tùy chỉnh với `command`.

Để tạo một lệnh cơ bản `GimmeDate` để hiển thị ngày hôm nay:

```shell
:command! GimmeDate echo call("strftime", ["%F"])
```

Khi bạn chạy `:GimmeDate`, Vim sẽ hiển thị một ngày như "2021-01-1".

Để tạo một lệnh cơ bản với một đầu vào, bạn có thể sử dụng `<args>`. Nếu bạn muốn truyền cho `GimmeDate` một định dạng thời gian/ngày cụ thể:

```shell
:command! GimmeDate echo call("strftime", [<args>])

:GimmeDate "%F"
" 2020-01-01

:GimmeDate "%H:%M"
" 11:30
```

Nếu bạn muốn hạn chế số lượng đối số, bạn có thể truyền cờ `-nargs`. Sử dụng `-nargs=0` để không truyền đối số nào, `-nargs=1` để truyền một đối số, `-nargs=+` để truyền ít nhất một đối số, `-nargs=*` để truyền bất kỳ số lượng đối số nào, và `-nargs=?` để truyền 0 hoặc một đối số. Nếu bạn muốn truyền đối số thứ n, hãy sử dụng `-nargs=n` (nơi `n` là bất kỳ số nguyên nào).

`<args>` có hai biến thể: `<f-args>` và `<q-args>`. Biến thể đầu tiên được sử dụng để truyền đối số cho các hàm Vimscript. Biến thể thứ hai được sử dụng để tự động chuyển đổi đầu vào của người dùng thành chuỗi.

Sử dụng `args`:

```shell
:command! -nargs=1 Hello echo "Hello " . <args>
:Hello "Iggy"
" trả về 'Hello Iggy'

:Hello Iggy
" Lỗi biến không xác định
```

Sử dụng `q-args`:

```shell
:command! -nargs=1 Hello echo "Hello " . <q-args>
:Hello Iggy
" trả về 'Hello Iggy'
```

Sử dụng `f-args`:

```shell
:function! PrintHello(person1, person2)
:  echo "Hello " . a:person1 . " and " . a:person2
:endfunction

:command! -nargs=* Hello call PrintHello(<f-args>)

:Hello Iggy1 Iggy2
" trả về "Hello Iggy1 and Iggy2"
```

Các hàm ở trên sẽ trở nên có ý nghĩa hơn khi bạn đến chương về các hàm Vimscript.

Để tìm hiểu thêm về lệnh và args, hãy kiểm tra `:h command` và `:args`.
### Bản đồ

Nếu bạn thấy mình thường xuyên thực hiện cùng một tác vụ phức tạp, đó là dấu hiệu tốt cho thấy bạn nên tạo một bản đồ cho tác vụ đó.

Ví dụ, tôi có hai bản đồ này trong vimrc của tôi:

```shell
nnoremap <silent> <C-f> :GFiles<CR>

nnoremap <Leader>tn :call ToggleNumber()<CR>
```

Trong bản đồ đầu tiên, tôi ánh xạ `Ctrl-F` đến lệnh `:Gfiles` của plugin [fzf.vim](https://github.com/junegunn/fzf.vim) (tìm kiếm nhanh các tệp Git). Trong bản đồ thứ hai, tôi ánh xạ `<Leader>tn` để gọi một hàm tùy chỉnh `ToggleNumber` (chuyển đổi giữa các tùy chọn `norelativenumber` và `relativenumber`). Bản đồ `Ctrl-F` ghi đè lên chức năng cuộn trang gốc của Vim. Bản đồ của bạn sẽ ghi đè lên các điều khiển của Vim nếu chúng va chạm. Bởi vì tôi gần như không bao giờ sử dụng tính năng đó, tôi quyết định rằng việc ghi đè là an toàn.

Nhân tiện, phím "leader" trong `<Leader>tn` là gì?

Vim có một phím leader để giúp với các bản đồ. Ví dụ, tôi đã ánh xạ `<Leader>tn` để chạy hàm `ToggleNumber()`. Nếu không có phím leader, tôi sẽ sử dụng `tn`, nhưng Vim đã có `t` (tìm kiếm điều hướng "till"). Với phím leader, tôi có thể nhấn phím được chỉ định là leader, sau đó là `tn` mà không làm gián đoạn các lệnh hiện có. Phím leader là một phím mà bạn có thể thiết lập để bắt đầu tổ hợp bản đồ của bạn. Theo mặc định, Vim sử dụng dấu gạch chéo ngược làm phím leader (vì vậy `<Leader>tn` trở thành "dấu gạch chéo ngược-t-n").

Tôi cá nhân thích sử dụng `<Space>` làm phím leader thay vì mặc định là dấu gạch chéo ngược. Để thay đổi phím leader của bạn, thêm điều này vào vimrc của bạn:

```shell
let mapleader = "\<space>"
```

Lệnh `nnoremap` được sử dụng ở trên có thể được phân tích thành ba phần:
- `n` đại diện cho chế độ bình thường.
- `nore` có nghĩa là không đệ quy.
- `map` là lệnh ánh xạ.

Tối thiểu, bạn có thể đã sử dụng `nmap` thay vì `nnoremap` (`nmap <silent> <C-f> :Gfiles<CR>`). Tuy nhiên, đó là một thực tiễn tốt để sử dụng biến thể không đệ quy để tránh vòng lặp vô hạn tiềm ẩn.

Đây là những gì có thể xảy ra nếu bạn không ánh xạ không đệ quy. Giả sử bạn muốn thêm một bản đồ cho `B` để thêm dấu chấm phẩy ở cuối dòng, sau đó quay lại một WORD (nhớ rằng `B` trong Vim là phím điều hướng chế độ bình thường để quay lại một WORD).

```shell
nmap B A;<esc>B
```

Khi bạn nhấn `B`... ôi không! Vim thêm `;` một cách không kiểm soát (ngắt nó bằng `Ctrl-C`). Tại sao điều đó lại xảy ra? Bởi vì trong bản đồ `A;<esc>B`, `B` không tham chiếu đến chức năng gốc `B` của Vim (quay lại một WORD), mà nó tham chiếu đến chức năng đã ánh xạ. Những gì bạn có thực sự là:

```shell
A;<esc>A;<esc>A;<esc>A;esc>...
```

Để giải quyết vấn đề này, bạn cần thêm một bản đồ không đệ quy:

```shell
nnoremap B A;<esc>B
```

Bây giờ hãy thử gọi `B` một lần nữa. Lần này nó thành công thêm một `;` ở cuối dòng và quay lại một WORD. `B` trong bản đồ này đại diện cho chức năng gốc `B` của Vim.

Vim có các bản đồ khác nhau cho các chế độ khác nhau. Nếu bạn muốn tạo một bản đồ cho chế độ chèn để thoát chế độ chèn khi bạn nhấn `jk`:

```shell
inoremap jk <esc>
```

Các chế độ bản đồ khác là: `map` (Bình thường, Hình ảnh, Chọn và Chờ thao tác), `vmap` (Hình ảnh và Chọn), `smap` (Chọn), `xmap` (Hình ảnh), `omap` (Chờ thao tác), `map!` (Chèn và Dòng lệnh), `lmap` (Chèn, Dòng lệnh, Lang-arg), `cmap` (Dòng lệnh), và `tmap` (công việc terminal). Tôi sẽ không đề cập đến chúng chi tiết. Để tìm hiểu thêm, hãy kiểm tra `:h map.txt`.

Tạo một bản đồ mà trực quan nhất, nhất quán và dễ nhớ.

## Tổ chức Vimrc

Theo thời gian, vimrc của bạn sẽ trở nên lớn và phức tạp. Có hai cách để giữ cho vimrc của bạn trông sạch sẽ:
- Chia vimrc của bạn thành nhiều tệp.
- Gấp tệp vimrc của bạn.

### Chia Vimrc của Bạn

Bạn có thể chia vimrc của mình thành nhiều tệp bằng cách sử dụng lệnh `source` của Vim. Lệnh này đọc các lệnh dòng lệnh từ đối số tệp đã cho.

Hãy tạo một tệp trong thư mục `~/.vim` và đặt tên là `/settings` (`~/.vim/settings`). Tên gọi tự nó là tùy ý và bạn có thể đặt tên bất kỳ gì bạn thích.

Bạn sẽ chia nó thành bốn thành phần:
- Các plugin bên thứ ba (`~/.vim/settings/plugins.vim`).
- Cài đặt chung (`~/.vim/settings/configs.vim`).
- Các hàm tùy chỉnh (`~/.vim/settings/functions.vim`).
- Các ánh xạ phím (`~/.vim/settings/mappings.vim`).

Bên trong `~/.vimrc`:

```shell
source $HOME/.vim/settings/plugins.vim
source $HOME/.vim/settings/configs.vim
source $HOME/.vim/settings/functions.vim
source $HOME/.vim/settings/mappings.vim
```

Bạn có thể chỉnh sửa các tệp này bằng cách đặt con trỏ của bạn dưới đường dẫn và nhấn `gf`.

Bên trong `~/.vim/settings/plugins.vim`:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

Bên trong `~/.vim/settings/configs.vim`:

```shell
set nocompatible
set relativenumber
set number
```

Bên trong `~/.vim/settings/functions.vim`:

```shell
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
```

Bên trong `~/.vim/settings/mappings.vim`:

```shell
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
```

Vimrc của bạn sẽ hoạt động như thường lệ, nhưng bây giờ chỉ còn bốn dòng!

Với thiết lập này, bạn dễ dàng biết nơi để đi. Nếu bạn cần thêm nhiều ánh xạ hơn, hãy thêm chúng vào tệp `/mappings.vim`. Trong tương lai, bạn luôn có thể thêm nhiều thư mục hơn khi vimrc của bạn phát triển. Ví dụ, nếu bạn cần tạo một cài đặt cho các màu sắc của bạn, bạn có thể thêm một `~/.vim/settings/themes.vim`.

### Giữ Một Tệp Vimrc

Nếu bạn thích giữ một tệp vimrc để giữ cho nó di động, bạn có thể sử dụng các gấp dấu để giữ cho nó được tổ chức. Thêm điều này vào đầu vimrc của bạn:

```shell
" thiết lập gấp {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}
```

Vim có thể phát hiện loại filetype nào mà bộ đệm hiện tại có (`:set filetype?`). Nếu đó là một filetype `vim`, bạn có thể sử dụng phương pháp gấp dấu. Nhớ rằng một gấp dấu sử dụng `{{{` và `}}}` để chỉ định các gấp bắt đầu và kết thúc.

Thêm các gấp `{{{` và `}}}` vào phần còn lại của vimrc của bạn (đừng quên chú thích chúng bằng `"`):

```shell
" thiết lập gấp {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}

" plugin {{{
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
" }}}

" cài đặt {{{
set nocompatible
set relativenumber
set number
" }}}

" hàm {{{
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
" }}}

" ánh xạ {{{
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
" }}}
```

Vimrc của bạn sẽ trông như thế này:

```shell
+-- 6 dòng: thiết lập gấp -----

+-- 6 dòng: plugin ---------

+-- 5 dòng: cài đặt ---------

+-- 9 dòng: hàm -------

+-- 5 dòng: ánh xạ --------
```

## Chạy Vim Với hoặc Không Có Vimrc và Plugin

Nếu bạn cần chạy Vim mà không có cả vimrc và plugin, hãy chạy:

```shell
vim -u NONE
```

Nếu bạn cần khởi động Vim mà không có vimrc nhưng có plugin, hãy chạy:

```shell
vim -u NORC
```

Nếu bạn cần chạy Vim với vimrc nhưng không có plugin, hãy chạy:

```shell
vim --noplugin
```

Nếu bạn cần chạy Vim với một vimrc *khác*, chẳng hạn như `~/.vimrc-backup`, hãy chạy:

```shell
vim -u ~/.vimrc-backup
```

Nếu bạn cần chạy Vim chỉ với `defaults.vim` và không có plugin, điều này hữu ích để sửa vimrc bị hỏng, hãy chạy:

```shell
vim --clean
```

## Cấu hình Vimrc Một Cách Thông Minh

Vimrc là một thành phần quan trọng của việc tùy chỉnh Vim. Một cách tốt để bắt đầu xây dựng vimrc của bạn là đọc vimrc của người khác và dần dần xây dựng nó theo thời gian. Vimrc tốt nhất không phải là cái mà nhà phát triển X sử dụng, mà là cái được thiết kế chính xác để phù hợp với khung tư duy và phong cách chỉnh sửa của bạn.