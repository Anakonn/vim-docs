---
description: Tài liệu này hướng dẫn cách sử dụng View, Session và Viminfo trong Vim
  để lưu giữ cài đặt và trạng thái của dự án, giúp tái tạo môi trường làm việc.
title: Ch20. Views, Sessions, and Viminfo
---

Sau khi bạn làm việc trên một dự án trong một thời gian, bạn có thể thấy dự án dần dần hình thành với các cài đặt, gập, bộ đệm, bố cục riêng của nó, v.v. Nó giống như việc trang trí căn hộ của bạn sau khi sống trong đó một thời gian. Vấn đề là, khi bạn đóng Vim, bạn sẽ mất những thay đổi đó. Liệu có phải sẽ thật tuyệt nếu bạn có thể giữ lại những thay đổi đó để lần sau khi mở Vim, nó trông giống như bạn chưa bao giờ rời đi?

Trong chương này, bạn sẽ học cách sử dụng View, Session và Viminfo để bảo tồn một "bức ảnh" của các dự án của bạn.

## View

Một View là tập con nhỏ nhất trong ba (View, Session, Viminfo). Nó là một tập hợp các cài đặt cho một cửa sổ. Nếu bạn dành nhiều thời gian làm việc trên một cửa sổ và bạn muốn bảo tồn các bản đồ và gập, bạn có thể sử dụng một View.

Hãy tạo một tệp có tên `foo.txt`:

```shell
foo1
foo2
foo3
foo4
foo5
foo6
foo7
foo8
foo9
foo10
```

Trong tệp này, tạo ba thay đổi:
1. Trên dòng 1, tạo một gập thủ công `zf4j` (gập 4 dòng tiếp theo).
2. Thay đổi cài đặt `number`: `setlocal nonumber norelativenumber`. Điều này sẽ xóa các chỉ báo số ở bên trái của cửa sổ.
3. Tạo một ánh xạ cục bộ để đi xuống hai dòng mỗi khi bạn nhấn `j` thay vì một: `:nnoremap <buffer> j jj`.

Tệp của bạn sẽ trông như thế này:

```shell
+-- 5 lines: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

### Cấu hình Thuộc tính View

Chạy:

```shell
:set viewoptions?
```

Theo mặc định, nó sẽ nói (có thể của bạn trông khác tùy thuộc vào vimrc của bạn):

```shell
viewoptions=folds,cursor,curdir
```

Hãy cấu hình `viewoptions`. Ba thuộc tính bạn muốn bảo tồn là các gập, các bản đồ và các tùy chọn cục bộ. Nếu cài đặt của bạn trông giống như của tôi, bạn đã có tùy chọn `folds`. Bạn cần cho View biết để nhớ `localoptions`. Chạy:

```shell
:set viewoptions+=localoptions
```

Để tìm hiểu những tùy chọn khác có sẵn cho `viewoptions`, hãy kiểm tra `:h viewoptions`. Bây giờ nếu bạn chạy `:set viewoptions?`, bạn sẽ thấy:

```shell
viewoptions=folds,cursor,curdir,localoptions
```

### Lưu View

Với cửa sổ `foo.txt` đã được gập đúng cách và có các tùy chọn `nonumber norelativenumber`, hãy lưu View. Chạy:

```shell
:mkview
```

Vim tạo một tệp View.

### Tệp View

Bạn có thể tự hỏi, "Vim đã lưu tệp View này ở đâu?" Để xem Vim lưu ở đâu, chạy:

```shell
:set viewdir?
```

Trong hệ điều hành dựa trên Unix, mặc định sẽ nói `~/.vim/view` (nếu bạn có hệ điều hành khác, nó có thể hiển thị một đường dẫn khác. Kiểm tra `:h viewdir` để biết thêm). Nếu bạn đang chạy hệ điều hành dựa trên Unix và muốn thay đổi nó thành một đường dẫn khác, hãy thêm điều này vào vimrc của bạn:

```shell
set viewdir=$HOME/else/where
```

### Tải Tệp View

Đóng `foo.txt` nếu bạn chưa làm, sau đó mở lại `foo.txt`. **Bạn sẽ thấy văn bản gốc mà không có các thay đổi.** Điều đó là điều mong đợi.

Để khôi phục trạng thái, bạn cần tải tệp View. Chạy:

```shell
:loadview
```

Bây giờ bạn sẽ thấy:

```shell
+-- 5 lines: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

Các gập, cài đặt cục bộ và ánh xạ cục bộ đã được khôi phục. Nếu bạn để ý, con trỏ của bạn cũng nên ở trên dòng mà bạn đã để lại khi bạn chạy `:mkview`. Miễn là bạn có tùy chọn `cursor`, View cũng nhớ vị trí con trỏ của bạn.

### Nhiều Views

Vim cho phép bạn lưu 9 Views được đánh số (1-9).

Giả sử bạn muốn tạo một gập bổ sung (giả sử bạn muốn gập hai dòng cuối cùng) với `:9,10 fold`. Hãy lưu điều này là View 1. Chạy:

```shell
:mkview 1
```

Nếu bạn muốn tạo một gập nữa với `:6,7 fold` và lưu nó như một View khác, chạy:

```shell
:mkview 2
```

Đóng tệp. Khi bạn mở `foo.txt` và bạn muốn tải View 1, chạy:

```shell
:loadview 1
```

Để tải View 2, chạy:

```shell
:loadview 2
```

Để tải View gốc, chạy:

```shell
:loadview
```

### Tự động Tạo View

Một trong những điều tồi tệ nhất có thể xảy ra là, sau khi dành hàng giờ để tổ chức một tệp lớn với các gập, bạn vô tình đóng cửa sổ và mất tất cả thông tin gập. Để ngăn chặn điều này, bạn có thể muốn tự động tạo một View mỗi khi bạn đóng một bộ đệm. Thêm điều này vào vimrc của bạn:

```shell
autocmd BufWinLeave *.txt mkview
```

Ngoài ra, có thể sẽ tốt nếu tải View khi bạn mở một bộ đệm:

```shell
autocmd BufWinEnter *.txt silent loadview
```

Bây giờ bạn không cần phải lo lắng về việc tạo và tải View nữa khi bạn làm việc với các tệp `txt`. Hãy nhớ rằng theo thời gian, `~/.vim/view` của bạn có thể bắt đầu tích lũy các tệp View. Thật tốt để dọn dẹp nó một lần mỗi vài tháng.

## Sessions

Nếu một View lưu cài đặt của một cửa sổ, một Session lưu thông tin của tất cả các cửa sổ (bao gồm cả bố cục).

### Tạo một Session Mới

Giả sử bạn đang làm việc với 3 tệp này trong một dự án `foobarbaz`:

Trong `foo.txt`:

```shell
foo1
foo2
foo3
foo4
foo5
foo6
foo7
foo8
foo9
foo10
```

Trong `bar.txt`:

```shell
bar1
bar2
bar3
bar4
bar5
bar6
bar7
bar8
bar9
bar10
```

Trong `baz.txt`:

```shell
baz1
baz2
baz3
baz4
baz5
baz6
baz7
baz8
baz9
baz10
```

Bây giờ giả sử rằng bạn chia các cửa sổ của mình với `:split` và `:vsplit`. Để bảo tồn cái nhìn này, bạn cần lưu Session. Chạy:

```shell
:mksession
```

Khác với `mkview`, nơi nó lưu vào `~/.vim/view` theo mặc định, `mksession` lưu một tệp Session (`Session.vim`) trong thư mục hiện tại. Kiểm tra tệp nếu bạn tò mò bên trong.

Nếu bạn muốn lưu tệp Session ở nơi khác, bạn có thể truyền một đối số cho `mksession`:

```shell
:mksession ~/some/where/else.vim
```

Nếu bạn muốn ghi đè tệp Session hiện có, hãy gọi lệnh với một dấu `!` (`:mksession! ~/some/where/else.vim`).

### Tải một Session

Để tải một Session, chạy:

```shell
:source Session.vim
```

Bây giờ Vim trông giống như cách bạn đã để lại, bao gồm cả các cửa sổ chia! Ngoài ra, bạn cũng có thể tải một tệp Session từ terminal:

```shell
vim -S Session.vim
```

### Cấu hình Thuộc tính Session

Bạn có thể cấu hình các thuộc tính mà Session lưu. Để xem những gì hiện đang được lưu, chạy:

```shell
:set sessionoptions?
```

Của tôi nói:

```shell
blank,buffers,curdir,folds,help,tabpages,winsize,terminal
```

Nếu bạn không muốn lưu `terminal` khi lưu một Session, hãy xóa nó khỏi các tùy chọn session. Chạy:

```shell
:set sessionoptions-=terminal
```

Nếu bạn muốn thêm một `options` khi lưu một Session, chạy:

```shell
:set sessionoptions+=options
```

Dưới đây là một số thuộc tính mà `sessionoptions` có thể lưu trữ:
- `blank` lưu các cửa sổ trống
- `buffers` lưu các bộ đệm
- `folds` lưu các gập
- `globals` lưu các biến toàn cục (phải bắt đầu bằng chữ cái hoa và chứa ít nhất một chữ cái thường)
- `options` lưu các tùy chọn và ánh xạ
- `resize` lưu số dòng và cột của cửa sổ
- `winpos` lưu vị trí cửa sổ
- `winsize` lưu kích thước cửa sổ
- `tabpages` lưu các tab
- `unix` lưu các tệp ở định dạng Unix

Để có danh sách đầy đủ, hãy kiểm tra `:h 'sessionoptions'`.

Session là một công cụ hữu ích để bảo tồn các thuộc tính bên ngoài của dự án của bạn. Tuy nhiên, một số thuộc tính bên trong không được Session lưu, như đánh dấu cục bộ, thanh ghi, lịch sử, v.v. Để lưu chúng, bạn cần sử dụng Viminfo!

## Viminfo

Nếu bạn để ý, sau khi sao chép một từ vào thanh ghi a và thoát khỏi Vim, lần sau khi bạn mở Vim, bạn vẫn có văn bản đó được lưu trong thanh ghi a. Đây thực sự là một công việc của Viminfo. Nếu không có nó, Vim sẽ không nhớ thanh ghi sau khi bạn đóng Vim.

Nếu bạn sử dụng Vim 8 hoặc cao hơn, Vim sẽ bật Viminfo theo mặc định, vì vậy bạn có thể đã sử dụng Viminfo suốt thời gian này mà không biết!

Bạn có thể hỏi: "Viminfo lưu gì? Nó khác gì so với Session?"

Để sử dụng Viminfo, trước tiên bạn cần có tính năng `+viminfo` khả dụng (`:version`). Viminfo lưu trữ:
- Lịch sử dòng lệnh.
- Lịch sử chuỗi tìm kiếm.
- Lịch sử dòng nhập.
- Nội dung của các thanh ghi không rỗng.
- Đánh dấu cho nhiều tệp.
- Đánh dấu tệp, chỉ đến các vị trí trong các tệp.
- Mẫu tìm kiếm / thay thế cuối cùng (cho 'n' và '&').
- Danh sách bộ đệm.
- Các biến toàn cục.

Nói chung, Session lưu trữ các thuộc tính "bên ngoài" và Viminfo lưu trữ các thuộc tính "bên trong".

Khác với Session, nơi bạn có thể có một tệp Session cho mỗi dự án, bạn thường sẽ sử dụng một tệp Viminfo cho mỗi máy tính. Viminfo không phụ thuộc vào dự án.

Vị trí Viminfo mặc định cho Unix là `$HOME/.viminfo` (`~/.viminfo`). Nếu bạn sử dụng hệ điều hành khác, vị trí Viminfo của bạn có thể khác. Kiểm tra `:h viminfo-file-name`. Mỗi lần bạn thực hiện các thay đổi "nội bộ", như sao chép một văn bản vào một thanh ghi, Vim tự động cập nhật tệp Viminfo.

*Hãy chắc chắn rằng bạn đã đặt tùy chọn `nocompatible` (`set nocompatible`), nếu không thì Viminfo của bạn sẽ không hoạt động.*

### Ghi và Đọc Viminfo

Mặc dù bạn sẽ chỉ sử dụng một tệp Viminfo, bạn có thể tạo nhiều tệp Viminfo. Để ghi một tệp Viminfo, sử dụng lệnh `:wviminfo` (`:wv` cho ngắn gọn).

```shell
:wv ~/.viminfo_extra
```

Để ghi đè một tệp Viminfo hiện có, thêm một dấu chấm than vào lệnh `wv`:

```shell
:wv! ~/.viminfo_extra
```

Theo mặc định, Vim sẽ đọc từ tệp `~/.viminfo`. Để đọc từ một tệp Viminfo khác, chạy `:rviminfo`, hoặc `:rv` cho ngắn gọn:

```shell
:rv ~/.viminfo_extra
```

Để bắt đầu Vim với một tệp Viminfo khác từ terminal, sử dụng cờ `i`:

```shell
vim -i viminfo_extra
```

Nếu bạn sử dụng Vim cho các nhiệm vụ khác nhau, như lập trình và viết lách, bạn có thể tạo một Viminfo tối ưu cho việc viết và một cái khác cho lập trình.

```shell
vim -i viminfo_writing

vim -i viminfo_coding
```

### Bắt đầu Vim Không Có Viminfo

Để bắt đầu Vim mà không có Viminfo, bạn có thể chạy từ terminal:

```shell
vim -i NONE
```

Để làm cho điều này trở thành vĩnh viễn, bạn có thể thêm điều này vào tệp vimrc của bạn:

```shell
set viminfo="NONE"
```

### Cấu hình Thuộc tính Viminfo

Tương tự như `viewoptions` và `sessionoptions`, bạn có thể chỉ định các thuộc tính nào để lưu với tùy chọn `viminfo`. Chạy:

```shell
:set viminfo?
```

Bạn sẽ nhận được:

```shell
!,'100,<50,s10,h
```

Điều này trông có vẻ bí ẩn. Hãy phân tích nó:
- `!` lưu các biến toàn cục bắt đầu bằng chữ cái hoa và không chứa chữ cái thường. Nhớ rằng `g:` chỉ ra một biến toàn cục. Ví dụ, nếu vào một thời điểm nào đó bạn đã viết gán `let g:FOO = "foo"`, Viminfo sẽ lưu biến toàn cục `FOO`. Tuy nhiên, nếu bạn đã làm `let g:Foo = "foo"`, Viminfo sẽ không lưu biến toàn cục này vì nó chứa chữ cái thường. Nếu không có `!`, Vim sẽ không lưu những biến toàn cục đó.
- `'100` đại diện cho các đánh dấu. Trong trường hợp này, Viminfo sẽ lưu các đánh dấu cục bộ (a-z) của 100 tệp cuối cùng. Hãy lưu ý rằng nếu bạn yêu cầu Viminfo lưu quá nhiều tệp, Vim có thể bắt đầu chậm lại. 1000 là một con số tốt để có.
- `<50` cho Viminfo biết số dòng tối đa được lưu cho mỗi thanh ghi (50 trong trường hợp này). Nếu tôi sao chép 100 dòng văn bản vào thanh ghi a (`"ay99j`) và đóng Vim, lần sau khi tôi mở Vim và dán từ thanh ghi a (`"ap`), Vim chỉ dán tối đa 50 dòng. Nếu bạn không đưa ra số dòng tối đa, *tất cả* các dòng sẽ được lưu. Nếu bạn đưa ra 0, sẽ không có gì được lưu.
- `s10` đặt giới hạn kích thước (tính bằng kb) cho một thanh ghi. Trong trường hợp này, bất kỳ thanh ghi nào lớn hơn 10kb sẽ bị loại trừ.
- `h` vô hiệu hóa đánh dấu (từ `hlsearch`) khi Vim khởi động.

Có những tùy chọn khác mà bạn có thể truyền. Để tìm hiểu thêm, hãy kiểm tra `:h 'viminfo'`.
## Sử Dụng Views, Sessions, và Viminfo Một Cách Thông Minh

Vim có View, Session, và Viminfo để chụp lại các trạng thái khác nhau của môi trường Vim của bạn. Đối với các dự án nhỏ, hãy sử dụng Views. Đối với các dự án lớn hơn, hãy sử dụng Sessions. Bạn nên dành thời gian để kiểm tra tất cả các tùy chọn mà View, Session, và Viminfo cung cấp.

Tạo View, Session, và Viminfo của riêng bạn cho phong cách chỉnh sửa của bạn. Nếu bạn cần sử dụng Vim bên ngoài máy tính của mình, bạn chỉ cần tải cài đặt của mình và bạn sẽ ngay lập tức cảm thấy như ở nhà!