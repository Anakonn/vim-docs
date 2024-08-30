---
description: Tài liệu này hướng dẫn cách sử dụng tính năng gập (fold) trong Vim để
  ẩn văn bản không cần thiết, giúp dễ dàng hiểu nội dung tệp hơn.
title: Ch17. Fold
---

Khi bạn đọc một tệp, thường có nhiều văn bản không liên quan cản trở bạn hiểu tệp đó làm gì. Để ẩn đi những tiếng ồn không cần thiết, hãy sử dụng Vim fold.

Trong chương này, bạn sẽ học các cách khác nhau để gập một tệp.

## Gập Thủ Công

Hãy tưởng tượng rằng bạn đang gập một tờ giấy để che một số văn bản. Văn bản thực tế không biến mất, nó vẫn còn đó. Vim fold hoạt động theo cách tương tự. Nó gập một khoảng văn bản, ẩn nó khỏi hiển thị mà không thực sự xóa nó.

Toán tử gập là `z` (khi một tờ giấy được gập lại, nó có hình dạng giống như chữ z).

Giả sử bạn có văn bản này:

```shell
Gập tôi
Giữ tôi
```

Với con trỏ ở dòng đầu tiên, gõ `zfj`. Vim gập cả hai dòng thành một. Bạn sẽ thấy điều gì đó như thế này:

```shell
+-- 2 dòng: Gập tôi -----
```

Dưới đây là phân tích:
- `zf` là toán tử gập.
- `j` là động từ cho toán tử gập.

Bạn có thể mở một văn bản đã gập bằng `zo`. Để đóng gập, sử dụng `zc`.

Gập là một toán tử, vì vậy nó tuân theo quy tắc ngữ pháp (`động từ + danh từ`). Bạn có thể truyền toán tử gập với một động từ hoặc đối tượng văn bản. Để gập một đoạn văn bên trong, chạy `zfip`. Để gập đến cuối tệp, chạy `zfG`. Để gập các văn bản giữa `{` và `}`, chạy `zfa{`.

Bạn có thể gập từ chế độ trực quan. Làm nổi bật khu vực bạn muốn gập (`v`, `V`, hoặc `Ctrl-v`), sau đó chạy `zf`.

Bạn có thể thực hiện một gập từ chế độ dòng lệnh với lệnh `:fold`. Để gập dòng hiện tại và dòng sau nó, chạy:

```shell
:,+1fold
```

`,+1` là phạm vi. Nếu bạn không truyền tham số cho phạm vi, nó mặc định là dòng hiện tại. `+1` là chỉ báo phạm vi cho dòng tiếp theo. Để gập các dòng từ 5 đến 10, chạy `:5,10fold`. Để gập từ vị trí hiện tại đến cuối dòng, chạy `:,$fold`.

Có nhiều lệnh gập và mở gập khác. Tôi thấy chúng quá nhiều để nhớ khi mới bắt đầu. Những lệnh hữu ích nhất là:
- `zR` để mở tất cả các gập.
- `zM` để đóng tất cả các gập.
- `za` chuyển đổi trạng thái gập của một gập.

Bạn có thể chạy `zR` và `zM` trên bất kỳ dòng nào, nhưng `za` chỉ hoạt động khi bạn đang ở trên một dòng đã gập / mở gập. Để tìm hiểu thêm về các lệnh gập, hãy kiểm tra `:h fold-commands`.

## Các Phương Pháp Gập Khác Nhau

Phần trên đề cập đến gập thủ công của Vim. Có sáu phương pháp gập khác nhau trong Vim:
1. Thủ công
2. Thụt lề
3. Biểu thức
4. Cú pháp
5. So sánh
6. Đánh dấu

Để xem phương pháp gập nào bạn đang sử dụng, chạy `:set foldmethod?`. Theo mặc định, Vim sử dụng phương pháp `thủ công`.

Trong phần còn lại của chương, bạn sẽ học năm phương pháp gập còn lại. Hãy bắt đầu với gập thụt lề.

## Gập Thụt Lề

Để sử dụng gập thụt lề, thay đổi `'foldmethod'` thành thụt lề:

```shell
:set foldmethod=indent
```

Giả sử bạn có văn bản:

```shell
Một
  Hai
  Hai lần nữa
```

Nếu bạn chạy `:set foldmethod=indent`, bạn sẽ thấy:

```shell
Một
+-- 2 dòng: Hai -----
```

Với gập thụt lề, Vim nhìn vào số lượng khoảng trắng mỗi dòng có ở đầu và so sánh với tùy chọn `'shiftwidth'` để xác định khả năng gập của nó. `'shiftwidth'` trả về số lượng khoảng trắng cần thiết cho mỗi bước thụt lề. Nếu bạn chạy:

```shell
:set shiftwidth?
```

Giá trị mặc định `'shiftwidth'` của Vim là 2. Trên văn bản ở trên, có hai khoảng trắng giữa đầu dòng và văn bản "Hai" và "Hai lần nữa". Khi Vim thấy số lượng khoảng trắng và giá trị `'shiftwidth'` là 2, Vim coi dòng đó có mức thụt lề gập là một.

Giả sử lần này bạn chỉ có một khoảng trắng giữa đầu dòng và văn bản:

```shell
Một
 Hai
 Hai lần nữa
```

Bây giờ nếu bạn chạy `:set foldmethod=indent`, Vim không gập dòng thụt lề vì không có đủ khoảng trắng trên mỗi dòng. Một khoảng trắng không được coi là một thụt lề. Tuy nhiên, nếu bạn thay đổi `'shiftwidth'` thành 1:

```shell
:set shiftwidth=1
```

Văn bản bây giờ có thể gập. Nó bây giờ được coi là một thụt lề.

Khôi phục `shiftwidth` trở lại 2 và khoảng trắng giữa các văn bản trở lại hai lần nữa. Ngoài ra, thêm hai văn bản bổ sung:

```shell
Một
  Hai
  Hai lần nữa
    Ba
    Ba lần nữa
```

Chạy gập (`zM`), bạn sẽ thấy:

```shell
Một
+-- 4 dòng: Hai -----
```

Mở gập các dòng đã gập (`zR`), sau đó đặt con trỏ của bạn trên "Ba" và chuyển đổi trạng thái gập của văn bản (`za`):

```shell
Một
  Hai
  Hai lần nữa
+-- 2 dòng: Ba -----
```

Điều gì đây? Một gập bên trong một gập?

Các gập lồng nhau là hợp lệ. Văn bản "Hai" và "Hai lần nữa" có mức gập là một. Văn bản "Ba" và "Ba lần nữa" có mức gập là hai. Nếu bạn có một văn bản có thể gập với mức gập cao hơn bên trong một văn bản có thể gập, bạn sẽ có nhiều lớp gập.

## Gập Biểu Thức

Gập biểu thức cho phép bạn định nghĩa một biểu thức để khớp cho một gập. Sau khi bạn định nghĩa các biểu thức gập, Vim quét từng dòng để tìm giá trị của `'foldexpr'`. Đây là biến mà bạn phải cấu hình để trả về giá trị phù hợp. Nếu `'foldexpr'` trả về 0, thì dòng đó không được gập. Nếu nó trả về 1, thì dòng đó có mức gập là 1. Nếu nó trả về 2, thì dòng đó có mức gập là 2. Có nhiều giá trị khác ngoài số nguyên, nhưng tôi sẽ không đi qua chúng. Nếu bạn tò mò, hãy kiểm tra `:h fold-expr`.

Đầu tiên, hãy thay đổi phương pháp gập:

```shell
:set foldmethod=expr
```

Giả sử bạn có một danh sách các món ăn sáng và bạn muốn gập tất cả các món ăn sáng bắt đầu bằng "p":

```shell
bánh donut
bánh pancake
bánh pop-tarts
thanh protein
cá hồi
trứng bác
```

Tiếp theo, thay đổi `foldexpr` để bắt các biểu thức bắt đầu bằng "p":

```shell
:set foldexpr=getline(v:lnum)[0]==\\"p\\"
```

Biểu thức trên có vẻ phức tạp. Hãy phân tích nó:
- `:set foldexpr` thiết lập tùy chọn `'foldexpr'` để chấp nhận một biểu thức tùy chỉnh.
- `getline()` là một hàm Vimscript trả về nội dung của bất kỳ dòng nào. Nếu bạn chạy `:echo getline(5)`, nó sẽ trả về nội dung của dòng 5.
- `v:lnum` là biến đặc biệt của Vim cho biểu thức `'foldexpr'`. Vim quét từng dòng và vào thời điểm đó lưu số của từng dòng trong biến `v:lnum`. Trên dòng 5, `v:lnum` có giá trị là 5. Trên dòng 10, `v:lnum` có giá trị là 10.
- `[0]` trong ngữ cảnh của `getline(v:lnum)[0]` là ký tự đầu tiên của mỗi dòng. Khi Vim quét một dòng, `getline(v:lnum)` trả về nội dung của mỗi dòng. `getline(v:lnum)[0]` trả về ký tự đầu tiên của mỗi dòng. Trên dòng đầu tiên của danh sách của chúng ta, "bánh donut", `getline(v:lnum)[0]` trả về "d". Trên dòng thứ hai của danh sách của chúng ta, "bánh pancake", `getline(v:lnum)[0]` trả về "p".
- `==\\"p\\"` là nửa thứ hai của biểu thức so sánh. Nó kiểm tra xem biểu thức bạn vừa đánh giá có bằng "p" không. Nếu đúng, nó trả về 1. Nếu sai, nó trả về 0. Trong Vim, 1 là đúng và 0 là sai. Vì vậy, trên các dòng bắt đầu bằng "p", nó trả về 1. Nhớ rằng nếu một `'foldexpr'` có giá trị là 1, thì nó có mức gập là 1.

Sau khi chạy biểu thức này, bạn sẽ thấy:

```shell
bánh donut
+-- 3 dòng: bánh pancake -----
cá hồi
trứng bác
```

## Gập Cú Pháp

Gập cú pháp được xác định bởi cú pháp tô màu ngôn ngữ. Nếu bạn sử dụng một plugin cú pháp ngôn ngữ như [vim-polyglot](https://github.com/sheerun/vim-polyglot), gập cú pháp sẽ hoạt động ngay lập tức. Chỉ cần thay đổi phương pháp gập thành cú pháp:

```shell
:set foldmethod=syntax
```

Giả sử bạn đang chỉnh sửa một tệp JavaScript và bạn đã cài đặt vim-polyglot. Nếu bạn có một mảng như sau:

```shell
const nums = [
  một,
  hai,
  ba,
  bốn
]
```

Nó sẽ được gập với một gập cú pháp. Khi bạn định nghĩa một cú pháp tô màu cho một ngôn ngữ cụ thể (thường bên trong thư mục `syntax/`), bạn có thể thêm một thuộc tính `fold` để làm cho nó có thể gập. Dưới đây là một đoạn mã từ tệp cú pháp JavaScript của vim-polyglot. Lưu ý từ khóa `fold` ở cuối.

```shell
syntax region  jsBracket                      matchgroup=jsBrackets            start=/\[/ end=/\]/ contains=@jsExpression,jsSpreadExpression extend fold
```

Hướng dẫn này sẽ không đề cập đến tính năng `cú pháp`. Nếu bạn tò mò, hãy kiểm tra `:h syntax.txt`.

## Gập So Sánh

Vim có thể thực hiện một quy trình so sánh để so sánh hai hoặc nhiều tệp.

Nếu bạn có `file1.txt`:

```shell
vim thật tuyệt
vim thật tuyệt
vim thật tuyệt
vim thật tuyệt
vim thật tuyệt
vim thật tuyệt
vim thật tuyệt
vim thật tuyệt
vim thật tuyệt
vim thật tuyệt
```

Và `file2.txt`:

```shell
vim thật tuyệt
vim thật tuyệt
vim thật tuyệt
vim thật tuyệt
vim thật tuyệt
vim thật tuyệt
vim thật tuyệt
vim thật tuyệt
emacs thì ổn
```

Chạy `vimdiff file1.txt file2.txt`:

```shell
+-- 3 dòng: vim thật tuyệt -----
vim thật tuyệt
vim thật tuyệt
vim thật tuyệt
vim thật tuyệt
vim thật tuyệt
vim thật tuyệt
[vim thật tuyệt] / [emacs thì ổn]
```

Vim tự động gập một số dòng giống hệt nhau. Khi bạn chạy lệnh `vimdiff`, Vim tự động sử dụng `foldmethod=diff`. Nếu bạn chạy `:set foldmethod?`, nó sẽ trả về `diff`.

## Gập Đánh Dấu

Để sử dụng gập đánh dấu, chạy:

```shell
:set foldmethod=marker
```

Giả sử bạn có văn bản:

```shell
Xin chào

{{{
thế giới
vim
}}}
```

Chạy `zM`, bạn sẽ thấy:

```shell
xin chào

+-- 4 dòng: -----
```

Vim coi `{{{` và `}}}` là các chỉ báo gập và gập các văn bản giữa chúng. Với gập đánh dấu, Vim tìm kiếm các chỉ báo đặc biệt, được xác định bởi tùy chọn `'foldmarker'`, để đánh dấu các khu vực gập. Để xem các chỉ báo mà Vim sử dụng, chạy:

```shell
:set foldmarker?
```

Theo mặc định, Vim sử dụng `{{{` và `}}}` làm chỉ báo. Nếu bạn muốn thay đổi chỉ báo thành các văn bản khác, như "coffee1" và "coffee2":

```shell
:set foldmarker=coffee1,coffee2
```

Nếu bạn có văn bản:

```shell
xin chào

coffee1
thế giới
vim
coffee2
```

Bây giờ Vim sử dụng `coffee1` và `coffee2` làm các chỉ báo gập mới. Như một lưu ý, một chỉ báo phải là một chuỗi nguyên văn và không thể là một regex.

## Giữ Lại Gập

Bạn sẽ mất tất cả thông tin gập khi đóng phiên Vim. Nếu bạn có tệp này, `count.txt`:

```shell
một
hai
ba
bốn
năm
```

Sau đó thực hiện một gập thủ công từ dòng "ba" trở xuống (`:3,$fold`):

```shell
một
hai
+-- 3 dòng: ba ---
```

Khi bạn thoát Vim và mở lại `count.txt`, các gập không còn ở đó nữa!

Để giữ lại các gập, sau khi gập, chạy:

```shell
:mkview
```

Sau đó khi bạn mở `count.txt`, chạy:

```shell
:loadview
```

Các gập của bạn được khôi phục. Tuy nhiên, bạn phải chạy thủ công `mkview` và `loadview`. Tôi biết rằng một ngày nào đó, tôi sẽ quên chạy `mkview` trước khi đóng tệp và tôi sẽ mất tất cả các gập. Làm thế nào để chúng ta tự động hóa quá trình này?

Để tự động chạy `mkview` khi bạn đóng một tệp `.txt` và chạy `loadview` khi bạn mở một tệp `.txt`, hãy thêm điều này vào vimrc của bạn:

```shell
autocmd BufWinLeave *.txt mkview
autocmd BufWinEnter *.txt silent loadview
```

Nhớ rằng `autocmd` được sử dụng để thực hiện một lệnh khi một sự kiện xảy ra. Hai sự kiện ở đây là:
- `BufWinLeave` cho khi bạn loại bỏ một bộ đệm khỏi một cửa sổ.
- `BufWinEnter` cho khi bạn tải một bộ đệm trong một cửa sổ.

Bây giờ sau khi bạn gập bên trong một tệp `.txt` và thoát Vim, lần tiếp theo bạn mở tệp đó, thông tin gập của bạn sẽ được khôi phục.

Theo mặc định, Vim lưu thông tin gập khi chạy `mkview` bên trong `~/.vim/view` cho hệ thống Unix. Để biết thêm thông tin, hãy kiểm tra `:h 'viewdir'`.
## Học Gập Một Cách Thông Minh

Khi tôi mới bắt đầu với Vim, tôi đã bỏ qua việc học gập vì tôi không nghĩ rằng nó hữu ích. Tuy nhiên, càng lập trình lâu, tôi càng thấy việc gập là rất hữu ích. Những gập được đặt một cách chiến lược có thể giúp bạn có cái nhìn tổng quan hơn về cấu trúc văn bản, giống như mục lục của một cuốn sách.

Khi bạn học gập, hãy bắt đầu với gập thủ công vì điều đó có thể được sử dụng khi di chuyển. Sau đó, từ từ học các mẹo khác nhau để thực hiện gập thụt lề và gập đánh dấu. Cuối cùng, học cách thực hiện gập cú pháp và gập biểu thức. Bạn thậm chí có thể sử dụng hai cái sau để viết các plugin Vim của riêng bạn.