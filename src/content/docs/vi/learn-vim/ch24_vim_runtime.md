---
description: Tài liệu này cung cấp cái nhìn tổng quan về các đường dẫn runtime trong
  Vim, giúp người dùng hiểu và tùy chỉnh Vim hiệu quả hơn.
title: Ch24. Vim Runtime
---

Trong các chương trước, tôi đã đề cập rằng Vim tự động tìm kiếm các đường dẫn đặc biệt như `pack/` (Ch. 22) và `compiler/` (Ch. 19) bên trong thư mục `~/.vim/`. Đây là những ví dụ về các đường dẫn thời gian chạy của Vim.

Vim có nhiều đường dẫn thời gian chạy hơn hai đường dẫn này. Trong chương này, bạn sẽ học một cái nhìn tổng quan về các đường dẫn thời gian chạy này. Mục tiêu của chương này là cho bạn thấy khi nào chúng được gọi. Biết điều này sẽ cho phép bạn hiểu và tùy chỉnh Vim thêm.

## Đường Dẫn Thời Gian Chạy

Trên một máy Unix, một trong những đường dẫn thời gian chạy của Vim là `$HOME/.vim/` (nếu bạn có một hệ điều hành khác như Windows, đường dẫn của bạn có thể khác). Để xem các đường dẫn thời gian chạy cho các hệ điều hành khác nhau, hãy kiểm tra `:h 'runtimepath'`. Trong chương này, tôi sẽ sử dụng `~/.vim/` làm đường dẫn thời gian chạy mặc định.

## Kịch Bản Plugin

Vim có một đường dẫn thời gian chạy plugin mà thực thi bất kỳ kịch bản nào trong thư mục này mỗi lần Vim khởi động. Đừng nhầm lẫn tên "plugin" với các plugin bên ngoài của Vim (như NERDTree, fzf.vim, v.v.).

Đi đến thư mục `~/.vim/` và tạo một thư mục `plugin/`. Tạo hai tệp: `donut.vim` và `chocolate.vim`.

Bên trong `~/.vim/plugin/donut.vim`:

```shell
echo "donut!"
```

Bên trong `~/.vim/plugin/chocolate.vim`:

```shell
echo "chocolate!"
```

Bây giờ đóng Vim. Lần tới khi bạn khởi động Vim, bạn sẽ thấy cả `"donut!"` và `"chocolate!"` được in ra. Đường dẫn thời gian chạy plugin có thể được sử dụng cho các kịch bản khởi tạo.

## Phát Hiện Kiểu Tệp

Trước khi bạn bắt đầu, để đảm bảo rằng các phát hiện này hoạt động, hãy chắc chắn rằng vimrc của bạn chứa ít nhất dòng sau:

```shell
filetype plugin indent on
```

Kiểm tra `:h filetype-overview` để biết thêm ngữ cảnh. Về cơ bản, điều này bật tính năng phát hiện kiểu tệp của Vim.

Khi bạn mở một tệp mới, Vim thường biết loại tệp đó là gì. Nếu bạn có một tệp `hello.rb`, chạy `:set filetype?` sẽ trả về phản hồi chính xác `filetype=ruby`.

Vim biết cách phát hiện các loại tệp "thông thường" (Ruby, Python, Javascript, v.v.). Nhưng nếu bạn có một tệp tùy chỉnh? Bạn cần dạy Vim phát hiện nó và gán nó với kiểu tệp chính xác.

Có hai phương pháp phát hiện: sử dụng tên tệp và nội dung tệp.

### Phát Hiện Tên Tệp

Phát hiện tên tệp phát hiện một loại tệp bằng cách sử dụng tên của tệp đó. Khi bạn mở tệp `hello.rb`, Vim biết đó là một tệp Ruby từ phần mở rộng `.rb`.

Có hai cách bạn có thể thực hiện phát hiện tên tệp: sử dụng thư mục thời gian chạy `ftdetect/` và sử dụng tệp thời gian chạy `filetype.vim`. Hãy khám phá cả hai.

#### `ftdetect/`

Hãy tạo một tệp mờ mịt (nhưng ngon miệng), `hello.chocodonut`. Khi bạn mở nó và chạy `:set filetype?`, vì nó không phải là một phần mở rộng tên tệp thông thường, Vim không biết phải làm gì với nó. Nó trả về `filetype=`.

Bạn cần hướng dẫn Vim đặt tất cả các tệp kết thúc bằng `.chocodonut` là loại tệp "chocodonut". Tạo một thư mục có tên `ftdetect/` trong thư mục gốc thời gian chạy (`~/.vim/`). Bên trong, tạo một tệp và đặt tên là `chocodonut.vim` (`~/.vim/ftdetect/chocodonut.vim`). Bên trong tệp này, thêm:

```shell
autocmd BufNewFile,BufRead *.chocodonut set filetype=chocodonut
```

`BufNewFile` và `BufRead` được kích hoạt mỗi khi bạn tạo một bộ đệm mới và mở một bộ đệm mới. `*.chocodonut` có nghĩa là sự kiện này chỉ được kích hoạt nếu bộ đệm mở có phần mở rộng tên tệp `.chocodonut`. Cuối cùng, lệnh `set filetype=chocodonut` đặt kiểu tệp thành loại chocodonut.

Khởi động lại Vim. Bây giờ mở tệp `hello.chocodonut` và chạy `:set filetype?`. Nó trả về `filetype=chocodonut`.

Ngon miệng! Bạn có thể đặt bao nhiêu tệp tùy thích bên trong `ftdetect/`. Trong tương lai, bạn có thể thêm `ftdetect/strawberrydonut.vim`, `ftdetect/plaindonut.vim`, v.v., nếu bạn quyết định mở rộng các loại tệp donut của mình.

Thực tế có hai cách để đặt một kiểu tệp trong Vim. Một là những gì bạn vừa sử dụng `set filetype=chocodonut`. Cách khác là chạy `setfiletype chocodonut`. Lệnh trước `set filetype=chocodonut` sẽ *luôn* đặt kiểu tệp thành loại chocodonut, trong khi lệnh sau `setfiletype chocodonut` chỉ đặt kiểu tệp nếu chưa có kiểu tệp nào được đặt.

#### Tệp Kiểu Tệp

Phương pháp phát hiện tệp thứ hai yêu cầu bạn tạo một tệp `filetype.vim` trong thư mục gốc (`~/.vim/filetype.vim`). Thêm điều này vào bên trong:

```shell
autocmd BufNewFile,BufRead *.plaindonut set filetype=plaindonut
```

Tạo một tệp `hello.plaindonut`. Khi bạn mở nó và chạy `:set filetype?`, Vim hiển thị kiểu tệp tùy chỉnh chính xác `filetype=plaindonut`.

Ôi bánh ngọt, nó hoạt động! Nhân tiện, nếu bạn chơi xung quanh với `filetype.vim`, bạn có thể nhận thấy rằng tệp này đang được chạy nhiều lần khi bạn mở `hello.plaindonut`. Để ngăn điều này, bạn có thể thêm một bảo vệ để kịch bản chính chỉ chạy một lần. Cập nhật `filetype.vim`:

```shell
if exists("did_load_filetypes")
  finish
endif

augroup donutfiletypedetection
  autocmd! BufRead,BufNewFile *.plaindonut setfiletype plaindonut
augroup END
```

`finish` là một lệnh Vim để dừng việc chạy phần còn lại của kịch bản. Biểu thức `"did_load_filetypes"` *không* phải là một hàm tích hợp sẵn của Vim. Nó thực sự là một biến toàn cục bên trong `$VIMRUNTIME/filetype.vim`. Nếu bạn tò mò, hãy chạy `:e $VIMRUNTIME/filetype.vim`. Bạn sẽ tìm thấy những dòng này bên trong:

```shell
if exists("did_load_filetypes")
  finish
endif

let did_load_filetypes = 1
```

Khi Vim gọi tệp này, nó định nghĩa biến `did_load_filetypes` và đặt nó thành 1. 1 là giá trị đúng trong Vim. Bạn nên đọc phần còn lại của `filetype.vim` nữa. Xem nếu bạn có thể hiểu những gì nó làm khi Vim gọi nó.

### Kịch Bản Kiểu Tệp

Hãy học cách phát hiện và gán một kiểu tệp dựa trên nội dung tệp.

Giả sử bạn có một bộ sưu tập các tệp mà không có phần mở rộng đồng ý. Điều duy nhất mà các tệp này có điểm chung là chúng đều bắt đầu bằng từ "donutify" trên dòng đầu tiên. Bạn muốn gán các tệp này vào một kiểu tệp `donut`. Tạo các tệp mới có tên `sugardonut`, `glazeddonut`, và `frieddonut` (không có phần mở rộng). Bên trong mỗi tệp, thêm dòng này:

```shell
donutify
```

Khi bạn chạy `:set filetype?` từ bên trong `sugardonut`, Vim không biết kiểu tệp nào để gán cho tệp này. Nó trả về `filetype=`.

Trong đường dẫn gốc thời gian chạy, thêm một tệp `scripts.vim` (`~/.vim/scripts.vim`). Bên trong nó, thêm những điều này:

```shell
if did_filetype()
  finish
endif

if getline(1) =~ '^\\<donutify\\>'
  setfiletype donut
endif
```

Hàm `getline(1)` trả về văn bản trên dòng đầu tiên. Nó kiểm tra xem dòng đầu tiên có bắt đầu bằng từ "donutify" hay không. Hàm `did_filetype()` là một hàm tích hợp sẵn của Vim. Nó sẽ trả về true khi một sự kiện liên quan đến kiểu tệp được kích hoạt ít nhất một lần. Nó được sử dụng như một bảo vệ để ngăn chặn việc chạy lại sự kiện kiểu tệp.

Mở tệp `sugardonut` và chạy `:set filetype?`, Vim bây giờ trả về `filetype=donut`. Nếu bạn mở các tệp donut khác (`glazeddonut` và `frieddonut`), Vim cũng xác định kiểu tệp của chúng là loại `donut`.

Lưu ý rằng `scripts.vim` chỉ được chạy khi Vim mở một tệp với kiểu tệp không xác định. Nếu Vim mở một tệp với kiểu tệp đã biết, `scripts.vim` sẽ không chạy.

## Plugin Kiểu Tệp

Điều gì sẽ xảy ra nếu bạn muốn Vim chạy các kịch bản cụ thể cho chocodonut khi bạn mở một tệp chocodonut và không chạy các kịch bản đó khi mở tệp plaindonut?

Bạn có thể làm điều này với đường dẫn thời gian chạy plugin kiểu tệp (`~/.vim/ftplugin/`). Vim tìm kiếm bên trong thư mục này để tìm một tệp có cùng tên với kiểu tệp mà bạn vừa mở. Tạo một tệp `chocodonut.vim` (`~/.vim/ftplugin/chocodonut.vim`):

```shell
echo "Calling from chocodonut ftplugin"
```

Tạo một tệp ftplugin khác, `plaindonut.vim` (`~/.vim/ftplugin/plaindonut.vim`):

```shell
echo "Calling from plaindonut ftplugin"
```

Bây giờ mỗi lần bạn mở một tệp kiểu chocodonut, Vim sẽ chạy các kịch bản từ `~/.vim/ftplugin/chocodonut.vim`. Mỗi lần bạn mở một tệp kiểu plaindonut, Vim sẽ chạy các kịch bản từ `~/.vim/ftplugin/plaindonut.vim`.

Một cảnh báo: những tệp này sẽ được chạy mỗi lần kiểu tệp bộ đệm được đặt (`set filetype=chocodonut` chẳng hạn). Nếu bạn mở 3 tệp chocodonut khác nhau, các kịch bản sẽ được chạy *tổng* cộng ba lần.

## Tệp Indent

Vim có một đường dẫn thời gian chạy indent hoạt động tương tự như ftplugin, nơi Vim tìm kiếm một tệp có tên giống như kiểu tệp đang mở. Mục đích của các đường dẫn thời gian chạy indent này là để lưu trữ mã liên quan đến indent. Nếu bạn có tệp `~/.vim/indent/chocodonut.vim`, nó sẽ chỉ được thực thi khi bạn mở một tệp kiểu chocodonut. Bạn có thể lưu trữ mã liên quan đến indent cho các tệp chocodonut ở đây.

## Màu Sắc

Vim có một đường dẫn thời gian chạy màu sắc (`~/.vim/colors/`) để lưu trữ các chủ đề màu sắc. Bất kỳ tệp nào nằm bên trong thư mục sẽ được hiển thị trong lệnh dòng lệnh `:color`.

Nếu bạn có một tệp `~/.vim/colors/beautifulprettycolors.vim`, khi bạn chạy `:color` và nhấn Tab, bạn sẽ thấy `beautifulprettycolors` là một trong những tùy chọn màu sắc. Nếu bạn muốn thêm chủ đề màu sắc của riêng mình, đây là nơi để làm điều đó.

Nếu bạn muốn kiểm tra các chủ đề màu sắc mà người khác đã tạo, một nơi tốt để ghé thăm là [vimcolors](https://vimcolors.com/).

## Đánh Dấu Cú Pháp

Vim có một đường dẫn thời gian chạy cú pháp (`~/.vim/syntax/`) để định nghĩa đánh dấu cú pháp.

Giả sử bạn có một tệp `hello.chocodonut`, bên trong nó bạn có các biểu thức sau:

```shell
(donut "tasty")
(donut "savory")
```

Mặc dù Vim bây giờ biết kiểu tệp chính xác, tất cả các văn bản đều có cùng một màu. Hãy thêm một quy tắc đánh dấu cú pháp để làm nổi bật từ khóa "donut". Tạo một tệp cú pháp chocodonut mới, `~/.vim/syntax/chocodonut.vim`. Bên trong nó thêm:

```shell
syntax keyword donutKeyword donut

highlight link donutKeyword Keyword
```

Bây giờ mở lại tệp `hello.chocodonut`. Các từ khóa `donut` bây giờ đã được đánh dấu.

Chương này sẽ không đi sâu vào đánh dấu cú pháp. Đây là một chủ đề rộng lớn. Nếu bạn tò mò, hãy kiểm tra `:h syntax.txt`.

Plugin [vim-polyglot](https://github.com/sheerun/vim-polyglot) là một plugin tuyệt vời cung cấp đánh dấu cho nhiều ngôn ngữ lập trình phổ biến.

## Tài Liệu

Nếu bạn tạo một plugin, bạn sẽ phải tạo tài liệu của riêng mình. Bạn sử dụng đường dẫn thời gian chạy doc cho điều đó.

Hãy tạo một tài liệu cơ bản cho các từ khóa chocodonut và plaindonut. Tạo một tệp `donut.txt` (`~/.vim/doc/donut.txt`). Bên trong, thêm các văn bản sau:

```shell
*chocodonut* Bánh donut sô cô la ngon lành

*plaindonut* Không có sự tốt lành của sô cô la nhưng vẫn ngon
```

Nếu bạn cố gắng tìm kiếm `chocodonut` và `plaindonut` (`:h chocodonut` và `:h plaindonut`), bạn sẽ không tìm thấy gì.

Đầu tiên, bạn cần chạy `:helptags` để tạo các mục trợ giúp mới. Chạy `:helptags ~/.vim/doc/`

Bây giờ nếu bạn chạy `:h chocodonut` và `:h plaindonut`, bạn sẽ tìm thấy các mục trợ giúp mới này. Lưu ý rằng tệp bây giờ là chỉ đọc và có kiểu tệp "trợ giúp".
## Tải Lười Các Tập Tin

Tất cả các đường dẫn thời gian chạy mà bạn đã học trong chương này được chạy tự động. Nếu bạn muốn tải một tập tin kịch bản một cách thủ công, hãy sử dụng đường dẫn thời gian chạy autoload.

Tạo một thư mục autoload (`~/.vim/autoload/`). Bên trong thư mục đó, tạo một tập tin mới và đặt tên là `tasty.vim` (`~/.vim/autoload/tasty.vim`). Bên trong nó:

```shell
echo "tasty.vim global"

function tasty#donut()
  echo "tasty#donut"
endfunction
```

Lưu ý rằng tên hàm là `tasty#donut`, không phải `donut()`. Dấu thăng (`#`) là cần thiết khi sử dụng tính năng autoload. Quy tắc đặt tên hàm cho tính năng autoload là:

```shell
function fileName#functionName()
  ...
endfunction
```

Trong trường hợp này, tên tập tin là `tasty.vim` và tên hàm là (về mặt kỹ thuật) `donut`.

Để gọi một hàm, bạn cần lệnh `call`. Hãy gọi hàm đó với `:call tasty#donut()`.

Lần đầu tiên bạn gọi hàm, bạn sẽ thấy *cả hai* thông điệp echo ("tasty.vim global" và "tasty#donut"). Các lần gọi tiếp theo đến hàm `tasty#donut` sẽ chỉ hiển thị thông điệp echo "testy#donut".

Khi bạn mở một tập tin trong Vim, không giống như các đường dẫn thời gian chạy trước đó, các tập tin kịch bản autoload không được tải tự động. Chỉ khi bạn gọi rõ ràng `tasty#donut()`, Vim mới tìm kiếm tập tin `tasty.vim` và tải mọi thứ bên trong nó, bao gồm cả hàm `tasty#donut()`. Autoload là cơ chế hoàn hảo cho các hàm sử dụng tài nguyên lớn nhưng bạn không sử dụng thường xuyên.

Bạn có thể thêm nhiều thư mục lồng nhau với autoload như bạn muốn. Nếu bạn có đường dẫn thời gian chạy `~/.vim/autoload/one/two/three/tasty.vim`, bạn có thể gọi hàm với `:call one#two#three#tasty#donut()`.

## Tập Tin Sau

Vim có một đường dẫn thời gian chạy sau (`~/.vim/after/`) phản ánh cấu trúc của `~/.vim/`. Bất cứ điều gì trong đường dẫn này sẽ được thực thi cuối cùng, vì vậy các nhà phát triển thường sử dụng những đường dẫn này để ghi đè kịch bản.

Ví dụ, nếu bạn muốn ghi đè các tập tin kịch bản từ `plugin/chocolate.vim`, bạn có thể tạo `~/.vim/after/plugin/chocolate.vim` để đặt các kịch bản ghi đè. Vim sẽ chạy `~/.vim/after/plugin/chocolate.vim` *sau* `~/.vim/plugin/chocolate.vim`.

## $VIMRUNTIME

Vim có một biến môi trường `$VIMRUNTIME` cho các tập tin kịch bản mặc định và các tập tin hỗ trợ. Bạn có thể kiểm tra nó bằng cách chạy `:e $VIMRUNTIME`.

Cấu trúc nên trông quen thuộc. Nó chứa nhiều đường dẫn thời gian chạy mà bạn đã học trong chương này.

Nhớ lại trong Chương 21, bạn đã học rằng khi bạn mở Vim, nó tìm kiếm các tập tin vimrc ở bảy vị trí khác nhau. Tôi đã nói rằng vị trí cuối cùng mà Vim kiểm tra là `$VIMRUNTIME/defaults.vim`. Nếu Vim không tìm thấy bất kỳ tập tin vimrc nào của người dùng, Vim sẽ sử dụng `defaults.vim` làm vimrc.

Bạn đã bao giờ thử chạy Vim mà không có plugin cú pháp như vim-polyglot và tập tin của bạn vẫn được tô sáng cú pháp chưa? Đó là vì khi Vim không tìm thấy một tập tin cú pháp từ đường dẫn thời gian chạy, Vim sẽ tìm kiếm một tập tin cú pháp từ thư mục cú pháp `$VIMRUNTIME`.

Để tìm hiểu thêm, hãy kiểm tra `:h $VIMRUNTIME`.

## Tùy Chọn Runtimepath

Để kiểm tra đường dẫn thời gian chạy của bạn, hãy chạy `:set runtimepath?`

Nếu bạn sử dụng Vim-Plug hoặc các trình quản lý plugin bên ngoài phổ biến, nó sẽ hiển thị một danh sách các thư mục. Ví dụ, của tôi hiển thị:

```shell
runtimepath=~/.vim,~/.vim/plugged/vim-signify,~/.vim/plugged/base16-vim,~/.vim/plugged/fzf.vim,~/.vim/plugged/fzf,~/.vim/plugged/vim-gutentags,~/.vim/plugged/tcomment_vim,~/.vim/plugged/emmet-vim,~/.vim/plugged/vim-fugitive,~/.vim/plugged/vim-sensible,~/.vim/plugged/lightline.vim, ...
```

Một trong những điều mà các trình quản lý plugin làm là thêm mỗi plugin vào đường dẫn thời gian chạy. Mỗi đường dẫn thời gian chạy có thể có cấu trúc thư mục riêng tương tự như `~/.vim/`.

Nếu bạn có một thư mục `~/box/of/donuts/` và bạn muốn thêm thư mục đó vào đường dẫn thời gian chạy của bạn, bạn có thể thêm điều này vào vimrc của bạn:

```shell
set rtp+=$HOME/box/of/donuts/
```

Nếu bên trong `~/box/of/donuts/`, bạn có một thư mục plugin (`~/box/of/donuts/plugin/hello.vim`) và một ftplugin (`~/box/of/donuts/ftplugin/chocodonut.vim`), Vim sẽ chạy tất cả các kịch bản từ `plugin/hello.vim` khi bạn mở Vim. Vim cũng sẽ chạy `ftplugin/chocodonut.vim` khi bạn mở một tập tin chocodonut.

Hãy thử điều này: tạo một đường dẫn tùy ý và thêm nó vào đường dẫn thời gian chạy của bạn. Thêm một số đường dẫn thời gian chạy mà bạn đã học từ chương này. Đảm bảo chúng hoạt động như mong đợi.

## Học Runtime Một Cách Thông Minh

Hãy dành thời gian đọc và chơi với những đường dẫn thời gian chạy này. Để xem cách các đường dẫn thời gian chạy được sử dụng trong thực tế, hãy đến kho lưu trữ của một trong những plugin Vim yêu thích của bạn và nghiên cứu cấu trúc thư mục của nó. Bạn nên có thể hiểu hầu hết chúng bây giờ. Hãy cố gắng theo dõi và nhận thức được bức tranh lớn. Bây giờ bạn đã hiểu cấu trúc thư mục của Vim, bạn đã sẵn sàng để học Vimscript.