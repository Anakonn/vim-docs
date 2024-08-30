---
description: Tài liệu này hướng dẫn các thao tác cơ bản trong Vim, giúp bạn di chuyển
  nhanh chóng trong tệp mà không cần sử dụng chuột.
title: Ch05. Moving in a File
---

Bắt đầu, việc di chuyển bằng bàn phím cảm thấy chậm và vụng về nhưng đừng từ bỏ! Khi bạn đã quen, bạn có thể di chuyển đến bất kỳ đâu trong một tệp nhanh hơn so với việc sử dụng chuột.

Trong chương này, bạn sẽ học các động tác cơ bản và cách sử dụng chúng một cách hiệu quả. Hãy nhớ rằng đây **không** phải là toàn bộ động tác mà Vim có. Mục tiêu ở đây là giới thiệu các động tác hữu ích để trở nên năng suất nhanh chóng. Nếu bạn cần học thêm, hãy kiểm tra `:h motion.txt`.

## Điều Hướng Ký Tự

Đơn vị động tác cơ bản nhất là di chuyển một ký tự sang trái, xuống, lên và sang phải.

```shell
h   Trái
j   Xuống
k   Lên
l   Phải
gj  Xuống trong một dòng được bọc mềm
gk  Lên trong một dòng được bọc mềm
```

Bạn cũng có thể di chuyển bằng các phím mũi tên. Nếu bạn mới bắt đầu, hãy thoải mái sử dụng bất kỳ phương pháp nào mà bạn cảm thấy thoải mái nhất.

Tôi thích `hjkl` vì tay phải của tôi có thể giữ ở hàng chính. Làm như vậy giúp tôi với tới các phím xung quanh ngắn hơn. Để làm quen với `hjkl`, tôi thực sự đã vô hiệu hóa các nút mũi tên khi bắt đầu bằng cách thêm những dòng này vào `~/.vimrc`:

```shell
noremap <Up> <NOP>
noremap <Down> <NOP>
noremap <Left> <NOP>
noremap <Right> <NOP>
```

Cũng có các plugin để giúp phá vỡ thói quen xấu này. Một trong số đó là [vim-hardtime](https://github.com/takac/vim-hardtime). Thật ngạc nhiên, tôi mất chưa đến một tuần để làm quen với `hjkl`.

Nếu bạn tự hỏi tại sao Vim sử dụng `hjkl` để di chuyển, đó là vì terminal Lear-Siegler ADM-3A nơi Bill Joy viết Vi, không có phím mũi tên và sử dụng `hjkl` làm trái/xuống/lên/phải.*

## Đánh Số Tương Đối

Tôi nghĩ rằng việc có `number` và `relativenumber` được thiết lập là hữu ích. Bạn có thể làm điều này bằng cách thêm dòng này vào `.vimrc`:

```shell
set relativenumber number
```

Điều này hiển thị số dòng hiện tại của tôi và các số dòng tương đối.

Thật dễ hiểu tại sao việc có một số ở cột bên trái là hữu ích, nhưng một số bạn có thể hỏi việc có số tương đối ở cột bên trái có thể hữu ích như thế nào. Có một số tương đối cho phép tôi nhanh chóng thấy có bao nhiêu dòng cách xa con trỏ của tôi so với văn bản mục tiêu. Với điều này, tôi có thể dễ dàng nhận thấy rằng văn bản mục tiêu của tôi cách tôi 12 dòng, vì vậy tôi có thể thực hiện `d12j` để xóa chúng. Ngược lại, nếu tôi đang ở dòng 69 và mục tiêu của tôi ở dòng 81, tôi phải thực hiện phép tính tâm lý (81 - 69 = 12). Làm toán trong khi chỉnh sửa tốn quá nhiều tài nguyên tinh thần. Càng ít phải suy nghĩ về nơi tôi cần đến, càng tốt.

Điều này hoàn toàn là sở thích cá nhân. Hãy thử nghiệm với `relativenumber` / `norelativenumber`, `number` / `nonumber` và sử dụng bất cứ điều gì bạn thấy hữu ích nhất!

## Đếm Di Chuyển

Hãy nói về tham số "đếm". Các động tác của Vim chấp nhận một tham số số trước. Tôi đã đề cập ở trên rằng bạn có thể xuống 12 dòng với `12j`. Số 12 trong `12j` là số đếm.

Cú pháp để sử dụng số đếm với động tác của bạn là:

```shell
[count] + motion
```

Bạn có thể áp dụng điều này cho tất cả các động tác. Nếu bạn muốn di chuyển 9 ký tự sang phải, thay vì nhấn `l` 9 lần, bạn có thể làm `9l`.

## Điều Hướng Từ

Hãy chuyển sang một đơn vị động tác lớn hơn: *từ*. Bạn có thể di chuyển đến đầu của từ tiếp theo (`w`), đến cuối của từ tiếp theo (`e`), đến đầu của từ trước đó (`b`), và đến cuối của từ trước đó (`ge`).

Ngoài ra, có *WORD*, khác với từ. Bạn có thể di chuyển đến đầu của WORD tiếp theo (`W`), đến cuối của WORD tiếp theo (`E`), đến đầu của WORD trước đó (`B`), và đến cuối của WORD trước đó (`gE`). Để dễ nhớ, WORD sử dụng cùng các chữ cái như từ, chỉ khác là viết hoa.

```shell
w     Di chuyển về phía trước đến đầu của từ tiếp theo
W     Di chuyển về phía trước đến đầu của WORD tiếp theo
e     Di chuyển về phía trước một từ đến cuối của từ tiếp theo
E     Di chuyển về phía trước một từ đến cuối của WORD tiếp theo
b     Di chuyển lùi lại đến đầu của từ trước đó
B     Di chuyển lùi lại đến đầu của WORD trước đó
ge    Di chuyển lùi lại đến cuối của từ trước đó
gE    Di chuyển lùi lại đến cuối của WORD trước đó
```

Vậy sự tương đồng và khác biệt giữa một từ và một WORD là gì? Cả từ và WORD đều được phân tách bởi các ký tự trắng. Một từ là một chuỗi ký tự chỉ chứa *chữ cái a-zA-Z0-9_*. Một WORD là một chuỗi tất cả các ký tự ngoại trừ khoảng trắng (khoảng trắng có nghĩa là khoảng trống, tab và EOL). Để tìm hiểu thêm, hãy kiểm tra `:h word` và `:h WORD`.

Ví dụ, giả sử bạn có:

```shell
const hello = "world";
```

Với con trỏ của bạn ở đầu dòng, để đi đến cuối dòng với `l`, bạn sẽ mất 21 lần nhấn phím. Sử dụng `w`, bạn sẽ mất 6. Sử dụng `W`, bạn chỉ mất 4. Cả từ và WORD đều là những lựa chọn tốt để di chuyển khoảng cách ngắn.

Tuy nhiên, bạn có thể đi từ "c" đến ";" trong một lần nhấn phím với điều hướng dòng hiện tại.

## Điều Hướng Dòng Hiện Tại

Khi chỉnh sửa, bạn thường cần điều hướng theo chiều ngang trong một dòng. Để nhảy đến ký tự đầu tiên trong dòng hiện tại, sử dụng `0`. Để đi đến ký tự cuối cùng trong dòng hiện tại, sử dụng `$`. Ngoài ra, bạn có thể sử dụng `^` để đi đến ký tự không trắng đầu tiên trong dòng hiện tại và `g_` để đi đến ký tự không trắng cuối cùng trong dòng hiện tại. Nếu bạn muốn đi đến cột `n` trong dòng hiện tại, bạn có thể sử dụng `n|`.

```shell
0     Đi đến ký tự đầu tiên trong dòng hiện tại
^     Đi đến ký tự không trắng đầu tiên trong dòng hiện tại
g_    Đi đến ký tự không trắng cuối cùng trong dòng hiện tại
$     Đi đến ký tự cuối cùng trong dòng hiện tại
n|    Đi đến cột n trong dòng hiện tại
```

Bạn có thể tìm kiếm dòng hiện tại với `f` và `t`. Sự khác biệt giữa `f` và `t` là `f` đưa bạn đến chữ cái đầu tiên của kết quả và `t` đưa bạn đến (ngay trước) chữ cái đầu tiên của kết quả. Vì vậy, nếu bạn muốn tìm kiếm "h" và dừng lại ở "h", hãy sử dụng `fh`. Nếu bạn muốn tìm kiếm "h" đầu tiên và dừng lại ngay trước kết quả, hãy sử dụng `th`. Nếu bạn muốn đi đến sự xuất hiện *tiếp theo* của tìm kiếm dòng hiện tại cuối cùng, hãy sử dụng `;`. Để đi đến sự xuất hiện trước đó của kết quả dòng hiện tại cuối cùng, hãy sử dụng `,`.

`F` và `T` là các đối tác lùi lại của `f` và `t`. Để tìm kiếm ngược lại cho "h", chạy `Fh`. Để tiếp tục tìm kiếm "h" theo cùng một hướng, sử dụng `;`. Lưu ý rằng `;` sau một `Fh` tìm kiếm ngược lại và `,` sau `Fh` tìm kiếm về phía trước.

```shell
f    Tìm kiếm về phía trước cho một kết quả trong cùng một dòng
F    Tìm kiếm ngược lại cho một kết quả trong cùng một dòng
t    Tìm kiếm về phía trước cho một kết quả trong cùng một dòng, dừng lại trước kết quả
T    Tìm kiếm ngược lại cho một kết quả trong cùng một dòng, dừng lại trước kết quả
;    Lặp lại tìm kiếm cuối cùng trong cùng một dòng theo cùng một hướng
,    Lặp lại tìm kiếm cuối cùng trong cùng một dòng theo hướng ngược lại
```

Quay lại ví dụ trước:

```shell
const hello = "world";
```

Với con trỏ của bạn ở đầu dòng, bạn có thể đi đến ký tự cuối cùng trong dòng hiện tại (";") với một lần nhấn phím: `$`. Nếu bạn muốn đến "w" trong "world", bạn có thể sử dụng `fw`. Một mẹo tốt để đi bất kỳ đâu trong một dòng là tìm kiếm các chữ cái ít phổ biến như "j", "x", "z" gần mục tiêu của bạn.

## Điều Hướng Câu và Đoạn

Hai đơn vị điều hướng tiếp theo là câu và đoạn.

Hãy nói về câu trước. Một câu kết thúc bằng `. ! ?` theo sau là một EOL, một khoảng trắng, hoặc một tab. Bạn có thể nhảy đến câu tiếp theo với `)` và câu trước đó với `(`.

```shell
(    Nhảy đến câu trước đó
)    Nhảy đến câu tiếp theo
```

Hãy xem một số ví dụ. Những cụm từ nào bạn nghĩ là câu và những cụm nào không phải? Hãy thử điều hướng với `(` và `)` trong Vim!

```shell
Tôi là một câu. Tôi là một câu khác vì tôi kết thúc bằng một dấu chấm. Tôi vẫn là một câu khi kết thúc bằng dấu chấm than! Còn dấu hỏi thì sao? Tôi không hoàn toàn là một câu vì có dấu gạch ngang - và cũng không phải dấu chấm phẩy ; hay dấu hai chấm :

Có một dòng trống ở trên tôi.
```

Nhân tiện, nếu bạn gặp vấn đề với Vim không đếm một câu cho các cụm từ được phân tách bởi `.` theo sau là một dòng đơn, bạn có thể đang ở chế độ `'compatible'`. Thêm `set nocompatible` vào vimrc. Trong Vi, một câu là một `.` theo sau bởi **hai** khoảng trắng. Bạn nên luôn thiết lập `nocompatible`.

Hãy nói về đoạn. Một đoạn bắt đầu sau mỗi dòng trống và cũng tại mỗi tập hợp của một macro đoạn được chỉ định bởi các cặp ký tự trong tùy chọn đoạn.

```shell
{    Nhảy đến đoạn trước đó
}    Nhảy đến đoạn tiếp theo
```

Nếu bạn không chắc macro đoạn là gì, đừng lo lắng. Điều quan trọng là một đoạn bắt đầu và kết thúc sau một dòng trống. Điều này thường đúng.

Hãy xem ví dụ này. Hãy thử điều hướng xung quanh với `}` và `{` (cũng như, hãy thử nghiệm với các điều hướng câu `( )` để di chuyển xung quanh nữa!)

```shell
Xin chào. Bạn khỏe không? Tôi rất tốt, cảm ơn!
Vim thật tuyệt vời.
Có thể không dễ để học nó lúc đầu...- nhưng chúng ta cùng nhau vượt qua. Chúc bạn may mắn!

Xin chào lần nữa.

Hãy thử di chuyển xung quanh với ), (, }, và {. Cảm nhận cách chúng hoạt động.
Bạn làm được điều này.
```

Kiểm tra `:h sentence` và `:h paragraph` để tìm hiểu thêm.

## Điều Hướng Khớp

Các lập trình viên viết và chỉnh sửa mã. Mã thường sử dụng dấu ngoặc đơn, dấu ngoặc nhọn, và dấu ngoặc vuông. Bạn có thể dễ dàng bị lạc trong chúng. Nếu bạn đang ở trong một cặp, bạn có thể nhảy đến cặp khác (nếu nó tồn tại) với `%`. Bạn cũng có thể sử dụng điều này để tìm hiểu xem bạn có dấu ngoặc đơn, dấu ngoặc nhọn và dấu ngoặc vuông khớp hay không.

```shell
%    Điều hướng đến một khớp khác, thường hoạt động cho (), [], {}
```

Hãy xem một ví dụ mã Scheme vì nó sử dụng dấu ngoặc đơn rất nhiều. Di chuyển xung quanh với `%` bên trong các dấu ngoặc đơn khác nhau.

```shell
(define (fib n)
  (cond ((= n 0) 0)
        ((= n 1) 1)
        (else
          (+ (fib (- n 1)) (fib (- n 2)))
        )))
```

Tôi cá nhân thích bổ sung `%` với các plugin chỉ báo trực quan như [vim-rainbow](https://github.com/frazrepo/vim-rainbow). Để biết thêm, hãy kiểm tra `:h %`.

## Điều Hướng Số Dòng

Bạn có thể nhảy đến số dòng `n` với `nG`. Ví dụ, nếu bạn muốn nhảy đến dòng 7, hãy sử dụng `7G`. Để nhảy đến dòng đầu tiên, sử dụng `1G` hoặc `gg`. Để nhảy đến dòng cuối cùng, sử dụng `G`.

Thường thì bạn không biết chính xác số dòng mà mục tiêu của bạn là gì, nhưng bạn biết nó khoảng 70% của toàn bộ tệp. Trong trường hợp này, bạn có thể làm `70%`. Để nhảy giữa tệp, bạn có thể làm `50%`.

```shell
gg    Đi đến dòng đầu tiên
G     Đi đến dòng cuối cùng
nG    Đi đến dòng n
n%    Đi đến n% trong tệp
```

Nhân tiện, nếu bạn muốn xem tổng số dòng trong một tệp, bạn có thể sử dụng `Ctrl-g`.

## Điều Hướng Cửa Sổ

Để nhanh chóng đi đến đầu, giữa, hoặc cuối của *cửa sổ* của bạn, bạn có thể sử dụng `H`, `M`, và `L`.

Bạn cũng có thể truyền một số đến `H` và `L`. Nếu bạn sử dụng `10H`, bạn sẽ đi xuống 10 dòng từ đầu cửa sổ. Nếu bạn sử dụng `3L`, bạn sẽ đi lên 3 dòng từ dòng cuối cùng của cửa sổ.

```shell
H     Đi đến đầu màn hình
M     Đi đến giữa màn hình
L     Đi đến cuối màn hình
nH    Đi n dòng từ đầu
nL    Đi n dòng từ cuối
```

## Cuộn

Để cuộn, bạn có 3 mức tốc độ: toàn màn hình (`Ctrl-F/Ctrl-B`), nửa màn hình (`Ctrl-D/Ctrl-U`), và dòng (`Ctrl-E/Ctrl-Y`).

```shell
Ctrl-E    Cuộn xuống một dòng
Ctrl-D    Cuộn xuống nửa màn hình
Ctrl-F    Cuộn xuống toàn màn hình
Ctrl-Y    Cuộn lên một dòng
Ctrl-U    Cuộn lên nửa màn hình
Ctrl-B    Cuộn lên toàn màn hình
```

Bạn cũng có thể cuộn tương đối với dòng hiện tại (phóng to tầm nhìn màn hình):

```shell
zt    Đưa dòng hiện tại gần đầu màn hình của bạn
zz    Đưa dòng hiện tại đến giữa màn hình của bạn
zb    Đưa dòng hiện tại gần cuối màn hình của bạn
```
## Tìm Kiếm Điều Hướng

Thường thì bạn biết rằng một cụm từ tồn tại bên trong một tệp. Bạn có thể sử dụng điều hướng tìm kiếm để nhanh chóng đến mục tiêu của mình. Để tìm kiếm một cụm từ, bạn có thể sử dụng `/` để tìm kiếm về phía trước và `?` để tìm kiếm ngược lại. Để lặp lại tìm kiếm cuối cùng, bạn có thể sử dụng `n`. Để lặp lại tìm kiếm cuối cùng theo hướng ngược lại, bạn có thể sử dụng `N`.

```shell
/    Tìm kiếm về phía trước cho một kết quả
?    Tìm kiếm ngược lại cho một kết quả
n    Lặp lại tìm kiếm cuối cùng theo cùng hướng với tìm kiếm trước
N    Lặp lại tìm kiếm cuối cùng theo hướng ngược lại với tìm kiếm trước
```

Giả sử bạn có văn bản này:

```shell
let one = 1;
let two = 2;
one = "01";
one = "one";
let onetwo = 12;
```

Nếu bạn đang tìm kiếm "let", chạy `/let`. Để nhanh chóng tìm kiếm "let" một lần nữa, bạn chỉ cần làm `n`. Để tìm kiếm "let" một lần nữa theo hướng ngược lại, chạy `N`. Nếu bạn chạy `?let`, nó sẽ tìm kiếm "let" ngược lại. Nếu bạn sử dụng `n`, nó sẽ tìm kiếm "let" ngược lại (`N` sẽ tìm kiếm "let" về phía trước bây giờ).

Bạn có thể bật đánh dấu tìm kiếm với `set hlsearch`. Bây giờ khi bạn tìm kiếm `/let`, nó sẽ đánh dấu *tất cả* các cụm từ khớp trong tệp. Ngoài ra, bạn có thể thiết lập tìm kiếm gia tăng với `set incsearch`. Điều này sẽ đánh dấu mẫu trong khi gõ. Theo mặc định, các cụm từ khớp của bạn sẽ vẫn được đánh dấu cho đến khi bạn tìm kiếm một cụm từ khác. Điều này có thể nhanh chóng trở thành một sự phiền toái. Để tắt đánh dấu, bạn có thể chạy `:nohlsearch` hoặc đơn giản là `:noh`. Bởi vì tôi thường sử dụng tính năng không đánh dấu này, tôi đã tạo một bản đồ trong vimrc:

```shell
nnoremap <esc><esc> :noh<return><esc>
```

Bạn có thể nhanh chóng tìm kiếm văn bản dưới con trỏ với `*` để tìm kiếm về phía trước và `#` để tìm kiếm ngược lại. Nếu con trỏ của bạn nằm trên chuỗi "one", nhấn `*` sẽ giống như bạn đã làm `/\<one\>`.

Cả `\<` và `\>` trong `/\<one\>` có nghĩa là tìm kiếm toàn bộ từ. Nó không khớp với "one" nếu nó là một phần của một từ lớn hơn. Nó sẽ khớp với từ "one" nhưng không phải "onetwo". Nếu con trỏ của bạn nằm trên "one" và bạn muốn tìm kiếm về phía trước để khớp với các từ toàn bộ hoặc một phần như "one" và "onetwo", bạn cần sử dụng `g*` thay vì `*`.

```shell
*     Tìm kiếm từ toàn bộ dưới con trỏ về phía trước
#     Tìm kiếm từ toàn bộ dưới con trỏ ngược lại
g*    Tìm kiếm từ dưới con trỏ về phía trước
g#    Tìm kiếm từ dưới con trỏ ngược lại
```

## Đánh Dấu Vị Trí

Bạn có thể sử dụng dấu để lưu vị trí hiện tại của mình và quay lại vị trí này sau. Nó giống như một dấu trang cho việc chỉnh sửa văn bản. Bạn có thể đặt một dấu với `mx`, trong đó `x` có thể là bất kỳ chữ cái nào từ `a-zA-Z`. Có hai cách để quay lại dấu: chính xác (dòng và cột) với `` `x `` và theo dòng (`'x`).

```shell
ma    Đánh dấu vị trí với dấu "a"
`a    Nhảy đến dòng và cột "a"
'a    Nhảy đến dòng "a"
```

Có sự khác biệt giữa việc đánh dấu bằng chữ cái thường (a-z) và chữ cái hoa (A-Z). Các chữ cái thường là dấu cục bộ và các chữ cái hoa là dấu toàn cục (đôi khi được gọi là dấu tệp).

Hãy nói về các dấu cục bộ. Mỗi bộ đệm có thể có bộ dấu cục bộ riêng của nó. Nếu tôi có hai tệp mở, tôi có thể đặt một dấu "a" (`ma`) trong tệp đầu tiên và một dấu "a" khác (`ma`) trong tệp thứ hai.

Khác với các dấu cục bộ, nơi bạn có thể có một bộ dấu trong mỗi bộ đệm, bạn chỉ có một bộ dấu toàn cục. Nếu bạn đặt `mA` bên trong `myFile.txt`, lần tiếp theo bạn chạy `mA` trong một tệp khác, nó sẽ ghi đè dấu "A" đầu tiên. Một lợi thế của các dấu toàn cục là bạn có thể nhảy đến bất kỳ dấu toàn cục nào ngay cả khi bạn đang ở trong một dự án hoàn toàn khác. Các dấu toàn cục có thể di chuyển qua các tệp.

Để xem tất cả các dấu, sử dụng `:marks`. Bạn có thể nhận thấy từ danh sách dấu có nhiều dấu hơn ngoài `a-zA-Z`. Một số trong số đó là:

```shell
''    Nhảy lại dòng cuối cùng trong bộ đệm hiện tại trước khi nhảy
``    Nhảy lại vị trí cuối cùng trong bộ đệm hiện tại trước khi nhảy
`[    Nhảy đến đầu văn bản đã thay đổi / đã sao chép trước đó
`]    Nhảy đến cuối văn bản đã thay đổi / đã sao chép trước đó
`<    Nhảy đến đầu lựa chọn trực quan cuối cùng
`>    Nhảy đến cuối lựa chọn trực quan cuối cùng
`0    Nhảy lại tệp đã chỉnh sửa cuối cùng khi thoát vim
```

Có nhiều dấu hơn những dấu được liệt kê ở trên. Tôi sẽ không đề cập đến chúng ở đây vì tôi nghĩ chúng hiếm khi được sử dụng, nhưng nếu bạn tò mò, hãy kiểm tra `:h marks`.

## Nhảy

Trong Vim, bạn có thể "nhảy" đến một tệp khác hoặc một phần khác của một tệp với một số chuyển động. Không phải tất cả các chuyển động đều được tính là một cú nhảy. Đi xuống với `j` không được tính là một cú nhảy. Đi đến dòng 10 với `10G` được tính là một cú nhảy.

Dưới đây là các lệnh mà Vim coi là lệnh "nhảy":

```shell
'       Đi đến dòng đã đánh dấu
`       Đi đến vị trí đã đánh dấu
G       Đi đến dòng
/       Tìm kiếm về phía trước
?       Tìm kiếm ngược lại
n       Lặp lại tìm kiếm cuối cùng, cùng hướng
N       Lặp lại tìm kiếm cuối cùng, hướng ngược lại
%       Tìm kiếm khớp
(       Đi đến câu cuối cùng
)       Đi đến câu tiếp theo
{       Đi đến đoạn cuối cùng
}       Đi đến đoạn tiếp theo
L       Đi đến dòng cuối cùng của cửa sổ hiển thị
M       Đi đến dòng giữa của cửa sổ hiển thị
H       Đi đến dòng đầu tiên của cửa sổ hiển thị
[[      Đi đến phần trước đó
]]      Đi đến phần tiếp theo
:s      Thay thế
:tag    Nhảy đến định nghĩa thẻ
```

Tôi không khuyên bạn nên ghi nhớ danh sách này. Một quy tắc tốt là, bất kỳ chuyển động nào di chuyển xa hơn một từ và điều hướng dòng hiện tại có thể là một cú nhảy. Vim theo dõi nơi bạn đã đi khi bạn di chuyển xung quanh và bạn có thể thấy danh sách này bên trong `:jumps`.

Để biết thêm, hãy kiểm tra `:h jump-motions`.

Tại sao các cú nhảy lại hữu ích? Bởi vì bạn có thể điều hướng danh sách nhảy với `Ctrl-O` để di chuyển lên danh sách nhảy và `Ctrl-I` để di chuyển xuống danh sách nhảy. `hjkl` không phải là các lệnh "nhảy", nhưng bạn có thể thêm vị trí hiện tại vào danh sách nhảy với `m'` trước khi di chuyển. Ví dụ, `m'5j` thêm vị trí hiện tại vào danh sách nhảy và đi xuống 5 dòng, và bạn có thể quay lại với `Ctrl-O`. Bạn có thể nhảy qua các tệp khác nhau, điều này tôi sẽ thảo luận thêm trong phần tiếp theo.

## Học Điều Hướng Một Cách Thông Minh

Nếu bạn mới làm quen với Vim, đây là rất nhiều điều để học. Tôi không mong đợi ai đó nhớ tất cả ngay lập tức. Cần thời gian trước khi bạn có thể thực hiện chúng mà không cần suy nghĩ.

Tôi nghĩ cách tốt nhất để bắt đầu là ghi nhớ một vài chuyển động thiết yếu. Tôi khuyên bạn nên bắt đầu với 10 chuyển động này: `h, j, k, l, w, b, G, /, ?, n`. Lặp lại chúng đủ để bạn có thể sử dụng chúng mà không cần suy nghĩ.

Để cải thiện kỹ năng điều hướng của bạn, đây là một số gợi ý của tôi:
1. Theo dõi các hành động lặp lại. Nếu bạn thấy mình làm `l` lặp đi lặp lại, hãy tìm một chuyển động sẽ đưa bạn về phía trước nhanh hơn. Bạn sẽ thấy rằng bạn có thể sử dụng `w`. Nếu bạn bắt gặp mình làm `w` lặp đi lặp lại, hãy xem có chuyển động nào sẽ đưa bạn qua dòng hiện tại nhanh chóng. Bạn sẽ thấy rằng bạn có thể sử dụng `f`. Nếu bạn có thể mô tả nhu cầu của mình một cách ngắn gọn, có khả năng cao là Vim có cách để thực hiện điều đó.
2. Mỗi khi bạn học một động tác mới, hãy dành một chút thời gian cho đến khi bạn có thể thực hiện nó mà không cần suy nghĩ.

Cuối cùng, hãy nhận ra rằng bạn không cần phải biết từng lệnh Vim để có hiệu quả. Hầu hết người dùng Vim không biết. Tôi cũng vậy. Hãy học các lệnh sẽ giúp bạn hoàn thành nhiệm vụ của mình vào thời điểm đó.

Hãy dành thời gian của bạn. Kỹ năng điều hướng là một kỹ năng rất quan trọng trong Vim. Học một điều nhỏ mỗi ngày và học nó thật tốt.