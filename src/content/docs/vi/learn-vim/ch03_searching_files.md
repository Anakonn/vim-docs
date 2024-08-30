---
description: Tài liệu này giới thiệu cách tìm kiếm nhanh trong Vim, bao gồm cách tìm
  kiếm không cần plugin và sử dụng plugin fzf.vim để nâng cao năng suất.
title: Ch03. Searching Files
---

Mục tiêu của chương này là cung cấp cho bạn một giới thiệu về cách tìm kiếm nhanh chóng trong Vim. Có khả năng tìm kiếm nhanh là một cách tuyệt vời để khởi động năng suất của bạn trong Vim. Khi tôi tìm ra cách tìm kiếm tệp nhanh chóng, tôi đã chuyển sang sử dụng Vim toàn thời gian.

Chương này được chia thành hai phần: cách tìm kiếm mà không cần plugin và cách tìm kiếm với plugin [fzf.vim](https://github.com/junegunn/fzf.vim). Hãy bắt đầu nào!

## Mở và Chỉnh sửa Tệp

Để mở một tệp trong Vim, bạn có thể sử dụng `:edit`.

```shell
:edit file.txt
```

Nếu `file.txt` tồn tại, nó sẽ mở bộ đệm `file.txt`. Nếu `file.txt` không tồn tại, nó sẽ tạo một bộ đệm mới cho `file.txt`.

Tự động hoàn thành với `<Tab>` hoạt động với `:edit`. Ví dụ, nếu tệp của bạn nằm trong thư mục *a*pp *c*ontroller *u*sers controller của [Rails](https://rubyonrails.org/) `./app/controllers/users_controllers.rb`, bạn có thể sử dụng `<Tab>` để mở rộng các thuật ngữ nhanh chóng:

```shell
:edit a<Tab>c<Tab>u<Tab>
```

`:edit` chấp nhận các đối số ký tự đại diện. `*` khớp với bất kỳ tệp nào trong thư mục hiện tại. Nếu bạn chỉ đang tìm kiếm các tệp có phần mở rộng `.yml` trong thư mục hiện tại:

```shell
:edit *.yml<Tab>
```

Vim sẽ cung cấp cho bạn một danh sách tất cả các tệp `.yml` trong thư mục hiện tại để bạn chọn.

Bạn có thể sử dụng `**` để tìm kiếm đệ quy. Nếu bạn muốn tìm tất cả các tệp `*.md` trong dự án của mình, nhưng bạn không chắc chắn trong các thư mục nào, bạn có thể làm như sau:

```shell
:edit **/*.md<Tab>
```

`:edit` có thể được sử dụng để chạy `netrw`, trình khám phá tệp tích hợp của Vim. Để làm điều đó, hãy đưa một đối số thư mục vào `:edit` thay vì tệp:

```shell
:edit .
:edit test/unit/
```

## Tìm Tệp Với Find

Bạn có thể tìm tệp với `:find`. Ví dụ:

```shell
:find package.json
:find app/controllers/users_controller.rb
```

Tự động hoàn thành cũng hoạt động với `:find`:

```shell
:find p<Tab>                " để tìm package.json
:find a<Tab>c<Tab>u<Tab>    " để tìm app/controllers/users_controller.rb
```

Bạn có thể nhận thấy rằng `:find` trông giống như `:edit`. Sự khác biệt là gì?

## Find và Path

Sự khác biệt là `:find` tìm tệp trong `path`, `:edit` thì không. Hãy tìm hiểu một chút về `path`. Khi bạn học cách sửa đổi các đường dẫn của mình, `:find` có thể trở thành một công cụ tìm kiếm mạnh mẽ. Để kiểm tra các đường dẫn của bạn là gì, hãy làm:

```shell
:set path?
```

Theo mặc định, của bạn có thể trông như thế này:

```shell
path=.,/usr/include,,
```

- `.` có nghĩa là tìm kiếm trong thư mục của tệp hiện đang mở.
- `,` có nghĩa là tìm kiếm trong thư mục hiện tại.
- `/usr/include` là thư mục điển hình cho các tệp tiêu đề thư viện C.

Hai cái đầu tiên là quan trọng trong ngữ cảnh của chúng ta và cái thứ ba có thể bỏ qua tạm thời. Điều cần lưu ý ở đây là bạn có thể sửa đổi các đường dẫn của riêng mình, nơi Vim sẽ tìm kiếm các tệp. Giả sử đây là cấu trúc dự án của bạn:

```shell
app/
  assets/
  controllers/
    application_controller.rb
    comments_controller.rb
    users_controller.rb
    ...
```

Nếu bạn muốn đi đến `users_controller.rb` từ thư mục gốc, bạn phải đi qua một vài thư mục (và nhấn một số lượng tab đáng kể). Thường thì khi làm việc với một framework, bạn dành 90% thời gian của mình trong một thư mục cụ thể. Trong tình huống này, bạn chỉ quan tâm đến việc đi đến thư mục `controllers/` với số lần gõ phím ít nhất. Cài đặt `path` có thể rút ngắn hành trình đó.

Bạn cần thêm `app/controllers/` vào `path` hiện tại. Đây là cách bạn có thể làm điều đó:

```shell
:set path+=app/controllers/
```

Bây giờ mà đường dẫn của bạn đã được cập nhật, khi bạn gõ `:find u<Tab>`, Vim sẽ tìm kiếm bên trong thư mục `app/controllers/` cho các tệp bắt đầu bằng "u".

Nếu bạn có một thư mục `controllers/` lồng nhau, như `app/controllers/account/users_controller.rb`, Vim sẽ không tìm thấy `users_controllers`. Thay vào đó, bạn cần thêm `:set path+=app/controllers/**` để tự động hoàn thành sẽ tìm thấy `users_controller.rb`. Điều này thật tuyệt! Bây giờ bạn có thể tìm thấy controller người dùng với 1 lần nhấn tab thay vì 3.

Bạn có thể đang nghĩ đến việc thêm toàn bộ thư mục dự án để khi bạn nhấn `tab`, Vim sẽ tìm kiếm mọi nơi cho tệp đó, như thế này:

```shell
:set path+=$PWD/**
```

`$PWD` là thư mục làm việc hiện tại. Nếu bạn cố gắng thêm toàn bộ dự án của mình vào `path` hy vọng làm cho tất cả các tệp có thể truy cập được khi nhấn `tab`, mặc dù điều này có thể hoạt động cho một dự án nhỏ, nhưng làm như vậy sẽ làm chậm đáng kể quá trình tìm kiếm của bạn nếu bạn có một số lượng lớn các tệp trong dự án của mình. Tôi khuyên bạn nên chỉ thêm `path` của các tệp / thư mục mà bạn thường xuyên truy cập.

Bạn có thể thêm `set path+={your-path-here}` vào vimrc của bạn. Cập nhật `path` chỉ mất vài giây và làm như vậy có thể tiết kiệm cho bạn rất nhiều thời gian.

## Tìm Kiếm Trong Tệp Với Grep

Nếu bạn cần tìm trong các tệp (tìm cụm từ trong các tệp), bạn có thể sử dụng grep. Vim có hai cách để làm điều đó:

- Grep nội bộ (`:vim`. Vâng, nó được viết là `:vim`. Nó là viết tắt của `:vimgrep`).
- Grep bên ngoài (`:grep`).

Hãy cùng tìm hiểu grep nội bộ trước. `:vim` có cú pháp như sau:

```shell
:vim /pattern/ file
```

- `/pattern/` là một mẫu regex của thuật ngữ tìm kiếm của bạn.
- `file` là đối số tệp. Bạn có thể truyền nhiều đối số. Vim sẽ tìm kiếm mẫu bên trong đối số tệp. Tương tự như `:find`, bạn có thể truyền cho nó các ký tự đại diện `*` và `**`.

Ví dụ, để tìm tất cả các lần xuất hiện của chuỗi "breakfast" bên trong tất cả các tệp ruby (`.rb`) trong thư mục `app/controllers/`:

```shell
:vim /breakfast/ app/controllers/**/*.rb
```

Sau khi chạy lệnh đó, bạn sẽ được chuyển hướng đến kết quả đầu tiên. Lệnh tìm kiếm `vim` của Vim sử dụng thao tác `quickfix`. Để xem tất cả các kết quả tìm kiếm, hãy chạy `:copen`. Điều này mở một cửa sổ `quickfix`. Dưới đây là một số lệnh quickfix hữu ích để giúp bạn làm việc hiệu quả ngay lập tức:

```shell
:copen        Mở cửa sổ quickfix
:cclose       Đóng cửa sổ quickfix
:cnext        Đi đến lỗi tiếp theo
:cprevious    Đi đến lỗi trước đó
:colder       Đi đến danh sách lỗi cũ hơn
:cnewer       Đi đến danh sách lỗi mới hơn
```

Để tìm hiểu thêm về quickfix, hãy kiểm tra `:h quickfix`.

Bạn có thể nhận thấy rằng việc chạy grep nội bộ (`:vim`) có thể chậm nếu bạn có một số lượng lớn các kết quả khớp. Điều này là do Vim tải mỗi tệp khớp vào bộ nhớ, như thể nó đang được chỉnh sửa. Nếu Vim tìm thấy một số lượng lớn các tệp khớp với tìm kiếm của bạn, nó sẽ tải tất cả chúng và do đó tiêu tốn một lượng lớn bộ nhớ.

Hãy nói về grep bên ngoài. Theo mặc định, nó sử dụng lệnh `grep` trong terminal. Để tìm kiếm "lunch" bên trong một tệp ruby trong thư mục `app/controllers/`, bạn có thể làm như sau:

```shell
:grep -R "lunch" app/controllers/
```

Lưu ý rằng thay vì sử dụng `/pattern/`, nó theo cú pháp grep của terminal `"pattern"`. Nó cũng hiển thị tất cả các kết quả khớp bằng cách sử dụng `quickfix`.

Vim định nghĩa biến `grepprg` để xác định chương trình bên ngoài nào sẽ chạy khi thực hiện lệnh `:grep` của Vim để bạn không phải đóng Vim và gọi lệnh `grep` trong terminal. Sau này, tôi sẽ chỉ cho bạn cách thay đổi chương trình mặc định được gọi khi sử dụng lệnh `:grep` của Vim.

## Duyệt Tệp Với Netrw

`netrw` là trình khám phá tệp tích hợp của Vim. Nó hữu ích để xem cấu trúc của một dự án. Để chạy `netrw`, bạn cần hai cài đặt này trong `.vimrc` của bạn:

```shell
set nocp
filetype plugin on
```

Vì `netrw` là một chủ đề rộng lớn, tôi sẽ chỉ đề cập đến cách sử dụng cơ bản, nhưng điều đó sẽ đủ để giúp bạn bắt đầu. Bạn có thể khởi động `netrw` khi bạn khởi động Vim bằng cách truyền cho nó một thư mục như một tham số thay vì một tệp. Ví dụ:

```shell
vim .
vim src/client/
vim app/controllers/
```

Để khởi động `netrw` từ bên trong Vim, bạn có thể sử dụng lệnh `:edit` và truyền cho nó một tham số thư mục thay vì một tên tệp:

```shell
:edit .
:edit src/client/
:edit app/controllers/
```

Có những cách khác để khởi động cửa sổ `netrw` mà không cần truyền một thư mục:

```shell
:Explore     Khởi động netrw trên tệp hiện tại
:Sexplore    Không đùa đâu. Khởi động netrw trên nửa trên của màn hình
:Vexplore    Khởi động netrw trên nửa trái của màn hình
```

Bạn có thể điều hướng `netrw` bằng các chuyển động của Vim (các chuyển động sẽ được đề cập chi tiết trong chương sau). Nếu bạn cần tạo, xóa hoặc đổi tên một tệp hoặc thư mục, đây là danh sách các lệnh `netrw` hữu ích:

```shell
%    Tạo một tệp mới
d    Tạo một thư mục mới
R    Đổi tên một tệp hoặc thư mục
D    Xóa một tệp hoặc thư mục
```

`:h netrw` rất toàn diện. Hãy kiểm tra nếu bạn có thời gian.

Nếu bạn thấy `netrw` quá nhạt nhẽo và cần thêm hương vị, [vim-vinegar](https://github.com/tpope/vim-vinegar) là một plugin tốt để cải thiện `netrw`. Nếu bạn đang tìm kiếm một trình khám phá tệp khác, [NERDTree](https://github.com/preservim/nerdtree) là một sự thay thế tốt. Hãy kiểm tra chúng!

## Fzf

Bây giờ bạn đã học cách tìm kiếm tệp trong Vim với các công cụ tích hợp, hãy cùng tìm hiểu cách làm điều đó với các plugin.

Một điều mà các trình soạn thảo văn bản hiện đại làm đúng và Vim không làm được là cách dễ dàng để tìm kiếm tệp, đặc biệt là thông qua tìm kiếm mờ. Trong nửa sau của chương này, tôi sẽ chỉ cho bạn cách sử dụng [fzf.vim](https://github.com/junegunn/fzf.vim) để làm cho việc tìm kiếm trong Vim trở nên dễ dàng và mạnh mẽ.

## Cài Đặt

Đầu tiên, hãy đảm bảo rằng bạn đã tải xuống [fzf](https://github.com/junegunn/fzf) và [ripgrep](https://github.com/BurntSushi/ripgrep). Làm theo hướng dẫn trên kho github của họ. Các lệnh `fzf` và `rg` giờ đây nên có sẵn sau khi cài đặt thành công.

Ripgrep là một công cụ tìm kiếm giống như grep (do đó có tên). Nó thường nhanh hơn grep và có nhiều tính năng hữu ích. Fzf là một trình tìm kiếm mờ dòng lệnh đa năng. Bạn có thể sử dụng nó với bất kỳ lệnh nào, bao gồm cả ripgrep. Cùng nhau, chúng tạo thành một sự kết hợp công cụ tìm kiếm mạnh mẽ.

Fzf không sử dụng ripgrep theo mặc định, vì vậy chúng ta cần bảo cho fzf biết sử dụng ripgrep bằng cách định nghĩa biến `FZF_DEFAULT_COMMAND`. Trong `.zshrc` của tôi (`.bashrc` nếu bạn sử dụng bash), tôi có những dòng này:

```shell
if type rg &> /dev/null; then
  export FZF_DEFAULT_COMMAND='rg --files'
  export FZF_DEFAULT_OPTS='-m'
fi
```

Chú ý đến `-m` trong `FZF_DEFAULT_OPTS`. Tùy chọn này cho phép chúng ta thực hiện nhiều lựa chọn với `<Tab>` hoặc `<Shift-Tab>`. Bạn không cần dòng này để làm cho fzf hoạt động với Vim, nhưng tôi nghĩ đây là một tùy chọn hữu ích để có. Nó sẽ hữu ích khi bạn muốn thực hiện tìm kiếm và thay thế trong nhiều tệp mà tôi sẽ đề cập ngay sau đây. Lệnh fzf chấp nhận nhiều tùy chọn hơn, nhưng tôi sẽ không đề cập đến chúng ở đây. Để tìm hiểu thêm, hãy kiểm tra [kho fzf](https://github.com/junegunn/fzf#usage) hoặc `man fzf`. Tối thiểu bạn nên có `export FZF_DEFAULT_COMMAND='rg'`.

Sau khi cài đặt fzf và ripgrep, hãy thiết lập plugin fzf. Tôi đang sử dụng trình quản lý plugin [vim-plug](https://github.com/junegunn/vim-plug) trong ví dụ này, nhưng bạn có thể sử dụng bất kỳ trình quản lý plugin nào.

Thêm những dòng này vào các plugin trong `.vimrc` của bạn. Bạn cần sử dụng plugin [fzf.vim](https://github.com/junegunn/fzf.vim) (được tạo bởi cùng một tác giả fzf).

```shell
call plug#begin()
Plug 'junegunn/fzf.vim'
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
call plug#end()
```

Sau khi thêm những dòng này, bạn sẽ cần mở `vim` và chạy `:PlugInstall`. Nó sẽ cài đặt tất cả các plugin được định nghĩa trong tệp vimrc của bạn và chưa được cài đặt. Trong trường hợp của chúng ta, nó sẽ cài đặt `fzf.vim` và `fzf`.

Để biết thêm thông tin về plugin này, bạn có thể kiểm tra [kho fzf.vim](https://github.com/junegunn/fzf/blob/master/README-VIM.md).
## Cú Pháp Fzf

Để sử dụng fzf một cách hiệu quả, bạn nên học một số cú pháp cơ bản của fzf. May mắn thay, danh sách này ngắn gọn:

- `^` là một phép so khớp chính xác ở đầu. Để tìm kiếm một cụm từ bắt đầu bằng "welcome": `^welcome`.
- `$` là một phép so khớp chính xác ở cuối. Để tìm kiếm một cụm từ kết thúc bằng "my friends": `friends$`.
- `'` là một phép so khớp chính xác. Để tìm kiếm cụm từ "welcome my friends": `'welcome my friends`.
- `|` là một phép so khớp "hoặc". Để tìm kiếm "friends" hoặc "foes": `friends | foes`.
- `!` là một phép so khớp ngược. Để tìm kiếm cụm từ chứa "welcome" và không có "friends": `welcome !friends`

Bạn có thể kết hợp các tùy chọn này. Ví dụ, `^hello | ^welcome friends$` sẽ tìm kiếm cụm từ bắt đầu bằng "welcome" hoặc "hello" và kết thúc bằng "friends".

## Tìm Tập Tin

Để tìm kiếm tập tin bên trong Vim sử dụng plugin fzf.vim, bạn có thể sử dụng phương thức `:Files`. Chạy `:Files` từ Vim và bạn sẽ được nhắc với lời nhắc tìm kiếm fzf.

Vì bạn sẽ thường xuyên sử dụng lệnh này, nên tốt để ánh xạ nó đến một phím tắt. Tôi ánh xạ nó đến `Ctrl-f`. Trong vimrc của tôi, tôi có điều này:

```shell
nnoremap <silent> <C-f> :Files<CR>
```

## Tìm Kiếm Trong Tập Tin

Để tìm kiếm bên trong các tập tin, bạn có thể sử dụng lệnh `:Rg`.

Một lần nữa, vì bạn có thể sẽ sử dụng lệnh này thường xuyên, hãy ánh xạ nó đến một phím tắt. Tôi ánh xạ nó đến `<Leader>f`. Phím `<Leader>` được ánh xạ đến `\` theo mặc định.

```shell
nnoremap <silent> <Leader>f :Rg<CR>
```

## Các Tìm Kiếm Khác

Fzf.vim cung cấp nhiều lệnh tìm kiếm khác. Tôi sẽ không đi qua từng lệnh ở đây, nhưng bạn có thể xem chúng [tại đây](https://github.com/junegunn/fzf.vim#commands).

Đây là những gì các ánh xạ fzf của tôi trông như thế nào:

```shell
nnoremap <silent> <Leader>b :Buffers<CR>
nnoremap <silent> <C-f> :Files<CR>
nnoremap <silent> <Leader>f :Rg<CR>
nnoremap <silent> <Leader>/ :BLines<CR>
nnoremap <silent> <Leader>' :Marks<CR>
nnoremap <silent> <Leader>g :Commits<CR>
nnoremap <silent> <Leader>H :Helptags<CR>
nnoremap <silent> <Leader>hh :History<CR>
nnoremap <silent> <Leader>h: :History:<CR>
nnoremap <silent> <Leader>h/ :History/<CR>
```

## Thay Thế Grep Bằng Rg

Như đã đề cập trước đó, Vim có hai cách để tìm kiếm trong các tập tin: `:vim` và `:grep`. `:grep` sử dụng công cụ tìm kiếm bên ngoài mà bạn có thể gán lại bằng từ khóa `grepprg`. Tôi sẽ chỉ cho bạn cách cấu hình Vim để sử dụng ripgrep thay vì grep của terminal khi chạy lệnh `:grep`.

Bây giờ hãy thiết lập `grepprg` để lệnh `:grep` của Vim sử dụng ripgrep. Thêm điều này vào vimrc của bạn:

```shell
set grepprg=rg\ --vimgrep\ --smart-case\ --follow
```

Hãy thoải mái chỉnh sửa một số tùy chọn ở trên! Để biết thêm thông tin về ý nghĩa của các tùy chọn trên, hãy kiểm tra `man rg`.

Sau khi bạn cập nhật `grepprg`, bây giờ khi bạn chạy `:grep`, nó sẽ chạy `rg --vimgrep --smart-case --follow` thay vì `grep`. Nếu bạn muốn tìm kiếm "donut" bằng ripgrep, bạn có thể chạy lệnh ngắn gọn hơn `:grep "donut"` thay vì `:grep "donut" . -R`.

Giống như lệnh `:grep` cũ, lệnh `:grep` mới này cũng sử dụng quickfix để hiển thị kết quả.

Bạn có thể tự hỏi, "Chà, điều này thật tuyệt nhưng tôi chưa bao giờ sử dụng `:grep` trong Vim, hơn nữa tôi không thể chỉ sử dụng `:Rg` để tìm cụm từ trong các tập tin? Khi nào tôi cần sử dụng `:grep`?"

Đó là một câu hỏi rất hay. Bạn có thể cần sử dụng `:grep` trong Vim để thực hiện tìm kiếm và thay thế trong nhiều tập tin, điều này tôi sẽ đề cập tiếp theo.

## Tìm Kiếm và Thay Thế Trong Nhiều Tập Tin

Các trình soạn thảo văn bản hiện đại như VSCode làm cho việc tìm kiếm và thay thế một chuỗi trong nhiều tập tin trở nên rất dễ dàng. Trong phần này, tôi sẽ chỉ cho bạn hai phương pháp khác nhau để thực hiện điều đó một cách dễ dàng trong Vim.

Phương pháp đầu tiên là thay thế *tất cả* các cụm từ khớp trong dự án của bạn. Bạn sẽ cần sử dụng `:grep`. Nếu bạn muốn thay thế tất cả các trường hợp của "pizza" bằng "donut", đây là những gì bạn cần làm:

```shell
:grep "pizza"
:cfdo %s/pizza/donut/g | update
```

Hãy phân tích các lệnh:

1. `:grep pizza` sử dụng ripgrep để tìm kiếm tất cả các trường hợp của "pizza" (nhân tiện, điều này vẫn sẽ hoạt động ngay cả khi bạn không gán lại `grepprg` để sử dụng ripgrep. Bạn sẽ phải làm `:grep "pizza" . -R` thay vì `:grep "pizza"`).
2. `:cfdo` thực hiện bất kỳ lệnh nào bạn truyền cho tất cả các tập tin trong danh sách quickfix của bạn. Trong trường hợp này, lệnh của bạn là lệnh thay thế `%s/pizza/donut/g`. Dấu ống (`|`) là một toán tử chuỗi. Lệnh `update` lưu mỗi tập tin sau khi thay thế. Tôi sẽ đề cập đến lệnh thay thế một cách sâu sắc hơn trong một chương sau.

Phương pháp thứ hai là tìm kiếm và thay thế trong các tập tin được chọn. Với phương pháp này, bạn có thể chọn thủ công các tập tin mà bạn muốn thực hiện tìm và thay thế. Đây là những gì bạn cần làm:

1. Xóa các bộ đệm của bạn trước tiên. Điều quan trọng là danh sách bộ đệm của bạn chỉ chứa các tập tin mà bạn muốn thực hiện thay thế. Bạn có thể khởi động lại Vim hoặc chạy lệnh `:%bd | e#` (`%bd` xóa tất cả các bộ đệm và `e#` mở tập tin mà bạn vừa ở trên).
2. Chạy `:Files`.
3. Chọn tất cả các tập tin mà bạn muốn thực hiện tìm và thay thế. Để chọn nhiều tập tin, sử dụng `<Tab>` / `<Shift-Tab>`. Điều này chỉ khả thi nếu bạn có cờ nhiều (`-m`) trong `FZF_DEFAULT_OPTS`.
4. Chạy `:bufdo %s/pizza/donut/g | update`. Lệnh `:bufdo %s/pizza/donut/g | update` trông giống như lệnh trước đó `:cfdo %s/pizza/donut/g | update`. Sự khác biệt là thay vì thay thế tất cả các mục quickfix (`:cfdo`), bạn đang thay thế tất cả các mục bộ đệm (`:bufdo`).

## Học Tìm Kiếm Một Cách Thông Minh

Tìm kiếm là phần thiết yếu trong chỉnh sửa văn bản. Học cách tìm kiếm tốt trong Vim sẽ cải thiện quy trình làm việc chỉnh sửa văn bản của bạn một cách đáng kể.

Fzf.vim là một bước ngoặt. Tôi không thể tưởng tượng việc sử dụng Vim mà không có nó. Tôi nghĩ rằng rất quan trọng để có một công cụ tìm kiếm tốt khi bắt đầu với Vim. Tôi đã thấy nhiều người gặp khó khăn trong việc chuyển đổi sang Vim vì nó dường như thiếu những tính năng quan trọng mà các trình soạn thảo văn bản hiện đại có, như một tính năng tìm kiếm dễ dàng và mạnh mẽ. Tôi hy vọng chương này sẽ giúp bạn dễ dàng hơn trong việc chuyển đổi sang Vim.

Bạn cũng vừa thấy khả năng mở rộng của Vim trong hành động - khả năng mở rộng chức năng tìm kiếm với một plugin và một chương trình bên ngoài. Trong tương lai, hãy ghi nhớ những tính năng khác mà bạn muốn mở rộng Vim. Có khả năng, nó đã có trong Vim, ai đó đã tạo ra một plugin hoặc đã có một chương trình cho nó. Tiếp theo, bạn sẽ học về một chủ đề rất quan trọng trong Vim: ngữ pháp Vim.