---
description: Hướng dẫn sử dụng trình quản lý gói tích hợp trong Vim để cài đặt và
  quản lý các plugin một cách hiệu quả và tự động.
title: Ch23. Vim Packages
---

Trong chương trước, tôi đã đề cập đến việc sử dụng một trình quản lý plugin bên ngoài để cài đặt các plugin. Kể từ phiên bản 8, Vim đi kèm với trình quản lý plugin tích hợp sẵn của riêng mình gọi là *packages*. Trong chương này, bạn sẽ học cách sử dụng các gói Vim để cài đặt plugin.

Để xem liệu bản Vim của bạn có khả năng sử dụng gói hay không, hãy chạy `:version` và tìm thuộc tính `+packages`. Ngoài ra, bạn cũng có thể chạy `:echo has('packages')` (nếu nó trả về 1, thì nó có khả năng gói).

## Thư Mục Gói

Kiểm tra xem bạn có thư mục `~/.vim/` trong đường dẫn gốc hay không. Nếu không, hãy tạo một cái. Bên trong nó, tạo một thư mục có tên `pack` (`~/.vim/pack/)`. Vim tự động biết để tìm kiếm bên trong thư mục này cho các gói.

## Hai Loại Tải

Gói Vim có hai cơ chế tải: tải tự động và tải thủ công.

### Tải Tự Động

Để tải các plugin tự động khi Vim khởi động, bạn cần đặt chúng vào thư mục `start/`. Đường dẫn trông như thế này:

```shell
~/.vim/pack/*/start/
```

Bây giờ bạn có thể hỏi, "Cái gì là `*` giữa `pack/` và `start/`?" `*` là một tên tùy ý và có thể là bất cứ điều gì bạn muốn. Hãy đặt tên nó là `packdemo/`:

```shell
~/.vim/pack/packdemo/start/
```

Hãy nhớ rằng nếu bạn bỏ qua nó và làm điều gì đó như thế này thay vào đó:

```shell
~/.vim/pack/start/
```

Hệ thống gói sẽ không hoạt động. Việc đặt một tên giữa `pack/` và `start/` là rất quan trọng.

Để thử nghiệm này, hãy cố gắng cài đặt plugin [NERDTree](https://github.com/preservim/nerdtree). Đi đến thư mục `start/` (`cd ~/.vim/pack/packdemo/start/`) và clone kho lưu trữ NERDTree:

```shell
git clone https://github.com/preservim/nerdtree.git
```

Chỉ vậy thôi! Bạn đã sẵn sàng. Lần tới khi bạn khởi động Vim, bạn có thể ngay lập tức thực hiện các lệnh NERDTree như `:NERDTreeToggle`.

Bạn có thể clone bao nhiêu kho lưu trữ plugin tùy ý bên trong đường dẫn `~/.vim/pack/*/start/`. Vim sẽ tự động tải từng cái. Nếu bạn xóa kho lưu trữ đã clone (`rm -rf nerdtree/`), plugin đó sẽ không còn khả dụng nữa.

### Tải Thủ Công

Để tải các plugin thủ công khi Vim khởi động, bạn cần đặt chúng vào thư mục `opt/`. Tương tự như tải tự động, đường dẫn trông như thế này:

```shell
~/.vim/pack/*/opt/
```

Hãy sử dụng cùng thư mục `packdemo/` từ trước:

```shell
~/.vim/pack/packdemo/opt/
```

Lần này, hãy cài đặt trò chơi [killersheep](https://github.com/vim/killersheep) (điều này yêu cầu Vim 8.2). Đi đến thư mục `opt/` (`cd ~/.vim/pack/packdemo/opt/`) và clone kho lưu trữ:

```shell
git clone https://github.com/vim/killersheep.git
```

Khởi động Vim. Lệnh để thực hiện trò chơi là `:KillKillKill`. Hãy thử chạy nó. Vim sẽ phàn nàn rằng đó không phải là một lệnh trình soạn thảo hợp lệ. Bạn cần *tải thủ công* plugin trước. Hãy làm điều đó:

```shell
:packadd killersheep
```

Bây giờ hãy thử chạy lệnh một lần nữa `:KillKillKill`. Lệnh sẽ hoạt động bây giờ.

Bạn có thể tự hỏi, "Tại sao tôi lại muốn tải thủ công các gói? Không phải tốt hơn khi tự động tải mọi thứ ngay từ đầu sao?"

Câu hỏi hay. Đôi khi có những plugin mà bạn không sử dụng mọi lúc, như trò chơi KillerSheep đó. Bạn có thể không cần tải 10 trò chơi khác nhau và làm chậm thời gian khởi động của Vim. Tuy nhiên, thỉnh thoảng, khi bạn cảm thấy chán, bạn có thể muốn chơi một vài trò chơi. Sử dụng tải thủ công cho các plugin không thiết yếu.

Bạn cũng có thể sử dụng điều này để thêm các plugin có điều kiện. Có thể bạn sử dụng cả Neovim và Vim và có những plugin được tối ưu hóa cho Neovim. Bạn có thể thêm điều gì đó như thế này vào vimrc của bạn:

```shell
if has('nvim')
  packadd! neovim-only-plugin
else
  packadd! generic-vim-plugin
endif
```

## Tổ Chức Các Gói

Nhớ rằng yêu cầu để sử dụng hệ thống gói của Vim là phải có một trong hai:

```shell
~/.vim/pack/*/start/
```

Hoặc:

```shell
~/.vim/pack/*/opt/
```

Thực tế rằng `*` có thể là *bất kỳ* tên nào có thể được sử dụng để tổ chức các gói của bạn. Giả sử bạn muốn nhóm các plugin của mình dựa trên các danh mục (màu sắc, cú pháp và trò chơi):

```shell
~/.vim/pack/colors/
~/.vim/pack/syntax/
~/.vim/pack/games/
```

Bạn vẫn có thể sử dụng `start/` và `opt/` bên trong mỗi thư mục.

```shell
~/.vim/pack/colors/start/
~/.vim/pack/colors/opt/

~/.vim/pack/syntax/start/
~/.vim/pack/syntax/opt/

~/.vim/pack/games/start/
~/.vim/pack/games/opt/
```

## Thêm Gói Một Cách Thông Minh

Bạn có thể tự hỏi liệu gói Vim có làm cho các trình quản lý plugin phổ biến như vim-pathogen, vundle.vim, dein.vim và vim-plug trở nên lỗi thời hay không.

Câu trả lời là, như thường lệ, "nó phụ thuộc".

Tôi vẫn sử dụng vim-plug vì nó giúp dễ dàng thêm, xóa hoặc cập nhật các plugin. Nếu bạn sử dụng nhiều plugin, có thể thuận tiện hơn khi sử dụng các trình quản lý plugin vì dễ dàng cập nhật nhiều cái cùng một lúc. Một số trình quản lý plugin cũng cung cấp các chức năng bất đồng bộ.

Nếu bạn là một người tối giản, hãy thử gói Vim. Nếu bạn là một người sử dụng plugin nặng, bạn có thể muốn xem xét việc sử dụng một trình quản lý plugin.