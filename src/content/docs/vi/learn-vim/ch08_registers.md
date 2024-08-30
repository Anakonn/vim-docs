---
description: Tìm hiểu về các loại thanh ghi trong Vim và cách sử dụng chúng hiệu quả
  để tiết kiệm thời gian và giảm thiểu việc gõ lại văn bản.
title: Ch08. Registers
---

Học cách sử dụng các thanh ghi trong Vim giống như học đại số lần đầu tiên. Bạn không nghĩ rằng mình cần nó cho đến khi bạn cần nó.

Có lẽ bạn đã sử dụng các thanh ghi trong Vim khi bạn đã sao chép hoặc xóa một đoạn văn bản rồi dán nó bằng `p` hoặc `P`. Tuy nhiên, bạn có biết rằng Vim có 10 loại thanh ghi khác nhau không? Nếu được sử dụng đúng cách, các thanh ghi trong Vim có thể giúp bạn tránh việc gõ lặp lại.

Trong chương này, tôi sẽ đi qua tất cả các loại thanh ghi trong Vim và cách sử dụng chúng một cách hiệu quả.

## Mười loại thanh ghi

Dưới đây là 10 loại thanh ghi trong Vim:

1. Thanh ghi không tên (`""`).
2. Các thanh ghi số (`"0-9`).
3. Thanh ghi xóa nhỏ (`"-`).
4. Các thanh ghi có tên (`"a-z`).
5. Các thanh ghi chỉ đọc (`":`, `".`, và `"%`).
6. Thanh ghi tệp thay thế (`"#`).
7. Thanh ghi biểu thức (`"=`).
8. Các thanh ghi chọn lựa (`"*` và `"+`).
9. Thanh ghi hố đen (`"_`).
10. Thanh ghi mẫu tìm kiếm cuối cùng (`"/`).

## Các toán tử thanh ghi

Để sử dụng các thanh ghi, trước tiên bạn cần lưu chúng bằng các toán tử. Dưới đây là một số toán tử lưu giá trị vào các thanh ghi:

```shell
y    Sao chép (yank)
c    Xóa văn bản và bắt đầu chế độ chèn
d    Xóa văn bản
```

Còn nhiều toán tử khác (như `s` hoặc `x`), nhưng những cái trên là hữu ích. Quy tắc chung là, nếu một toán tử có thể xóa một văn bản, nó có thể lưu văn bản vào các thanh ghi.

Để dán một văn bản từ các thanh ghi, bạn có thể sử dụng:

```shell
p    Dán văn bản sau con trỏ
P    Dán văn bản trước con trỏ
```

Cả `p` và `P` đều chấp nhận một số đếm và một ký hiệu thanh ghi làm đối số. Ví dụ, để dán mười lần, hãy làm `10p`. Để dán văn bản từ thanh ghi a, hãy làm `"ap`. Để dán văn bản từ thanh ghi a mười lần, hãy làm `10"ap`. Nhân tiện, `p` thực sự về mặt kỹ thuật có nghĩa là "đặt", không phải "dán", nhưng tôi nghĩ rằng "dán" là một từ thông dụng hơn.

Cú pháp chung để lấy nội dung từ một thanh ghi cụ thể là `"a`, trong đó `a` là ký hiệu thanh ghi.

## Gọi thanh ghi từ chế độ chèn

Mọi thứ bạn học trong chương này cũng có thể được thực hiện trong chế độ chèn. Để lấy văn bản từ thanh ghi a, thông thường bạn làm `"ap`. Nhưng nếu bạn đang ở chế độ chèn, hãy chạy `Ctrl-R a`. Cú pháp để gọi thanh ghi từ chế độ chèn là:

```shell
Ctrl-R a
```

Trong đó `a` là ký hiệu thanh ghi. Bây giờ bạn đã biết cách lưu và lấy thanh ghi, hãy cùng khám phá!

## Thanh ghi không tên

Để lấy văn bản từ thanh ghi không tên, hãy làm `""p`. Nó lưu văn bản cuối cùng bạn đã sao chép, thay đổi hoặc xóa. Nếu bạn thực hiện một thao tác sao chép, thay đổi hoặc xóa khác, Vim sẽ tự động thay thế văn bản cũ. Thanh ghi không tên giống như thao tác sao chép / dán tiêu chuẩn của máy tính.

Theo mặc định, `p` (hoặc `P`) được kết nối với thanh ghi không tên (từ bây giờ tôi sẽ gọi thanh ghi không tên bằng `p` thay vì `""p`).

## Các thanh ghi số

Các thanh ghi số tự động được lấp đầy theo thứ tự tăng dần. Có 2 loại thanh ghi số khác nhau: thanh ghi đã sao chép (`0`) và các thanh ghi số (`1-9`). Hãy thảo luận về thanh ghi đã sao chép trước.

### Thanh ghi đã sao chép

Nếu bạn sao chép một dòng văn bản hoàn chỉnh (`yy`), Vim thực sự lưu văn bản đó trong hai thanh ghi:

1. Thanh ghi không tên (`p`).
2. Thanh ghi đã sao chép (`"0p`).

Khi bạn sao chép một văn bản khác, Vim sẽ cập nhật cả thanh ghi đã sao chép và thanh ghi không tên. Bất kỳ thao tác nào khác (như xóa) sẽ không được lưu vào thanh ghi 0. Điều này có thể được sử dụng để bạn có lợi, vì trừ khi bạn thực hiện một thao tác sao chép khác, văn bản đã sao chép sẽ luôn ở đó, bất kể bạn thực hiện bao nhiêu thay đổi và xóa.

Ví dụ, nếu bạn:
1. Sao chép một dòng (`yy`)
2. Xóa một dòng (`dd`)
3. Xóa một dòng khác (`dd`)

Thanh ghi đã sao chép sẽ có văn bản từ bước một.

Nếu bạn:
1. Sao chép một dòng (`yy`)
2. Xóa một dòng (`dd`)
3. Sao chép một dòng khác (`yy`)

Thanh ghi đã sao chép sẽ có văn bản từ bước ba.

Một mẹo cuối cùng, khi ở chế độ chèn, bạn có thể nhanh chóng dán văn bản vừa sao chép bằng cách sử dụng `Ctrl-R 0`.

### Các thanh ghi số không bằng không

Khi bạn thay đổi hoặc xóa một văn bản có độ dài ít nhất một dòng, văn bản đó sẽ được lưu vào các thanh ghi số 1-9 theo thứ tự gần nhất.

Ví dụ, nếu bạn có những dòng này:

```shell
dòng ba
dòng hai
dòng một
```

Với con trỏ của bạn trên "dòng ba", hãy xóa chúng từng cái một bằng `dd`. Khi tất cả các dòng đã bị xóa, thanh ghi 1 sẽ chứa "dòng một" (gần nhất), thanh ghi hai "dòng hai" (thứ hai gần nhất), và thanh ghi ba "dòng ba" (cũ nhất). Để lấy nội dung từ thanh ghi một, hãy làm `"1p`.

Như một lưu ý bên, các thanh ghi số này tự động được tăng lên khi sử dụng lệnh chấm. Nếu thanh ghi số một của bạn (`"1`) chứa "dòng một", thanh ghi hai (`"2`) chứa "dòng hai", và thanh ghi ba (`"3`) chứa "dòng ba", bạn có thể dán chúng theo thứ tự với mẹo này:
- Làm `"1P` để dán nội dung từ thanh ghi số một ("1).
- Làm `.` để dán nội dung từ thanh ghi số hai ("2).
- Làm `.` để dán nội dung từ thanh ghi số ba ("3).

Mẹo này hoạt động với bất kỳ thanh ghi số nào. Nếu bạn bắt đầu với `"5P`,  `.`  sẽ thực hiện `"6P`, `.` lại sẽ thực hiện `"7P`, và cứ thế.

Các xóa nhỏ như xóa một từ (`dw`) hoặc thay đổi một từ (`cw`) không được lưu vào các thanh ghi số. Chúng được lưu vào thanh ghi xóa nhỏ (`"-`), mà tôi sẽ thảo luận tiếp theo.

## Thanh ghi xóa nhỏ

Các thay đổi hoặc xóa ít hơn một dòng không được lưu vào các thanh ghi số 0-9, mà được lưu vào thanh ghi xóa nhỏ (`"-`).

Ví dụ:
1. Xóa một từ (`diw`)
2. Xóa một dòng (`dd`)
3. Xóa một dòng (`dd`)

`"-p` sẽ cho bạn từ đã xóa từ bước một.

Một ví dụ khác:
1. Tôi xóa một từ (`diw`)
2. Tôi xóa một dòng (`dd`)
3. Tôi xóa một từ (`diw`)

`"-p` sẽ cho bạn từ đã xóa từ bước ba. `"1p` sẽ cho bạn dòng đã xóa từ bước hai. Thật không may, không có cách nào để lấy lại từ đã xóa từ bước một vì thanh ghi xóa nhỏ chỉ lưu một mục. Tuy nhiên, nếu bạn muốn bảo tồn văn bản từ bước một, bạn có thể làm điều đó với các thanh ghi có tên.

## Thanh ghi có tên

Các thanh ghi có tên là thanh ghi linh hoạt nhất của Vim. Nó có thể lưu các văn bản đã sao chép, thay đổi và xóa vào các thanh ghi a-z. Không giống như 3 loại thanh ghi trước đó mà bạn đã thấy tự động lưu văn bản vào các thanh ghi, bạn phải chỉ định rõ ràng cho Vim sử dụng thanh ghi có tên, cho bạn toàn quyền kiểm soát.

Để sao chép một từ vào thanh ghi a, bạn có thể làm điều đó với `"ayiw`.
- `"a` cho Vim biết rằng hành động tiếp theo (xóa / thay đổi / sao chép) sẽ được lưu vào thanh ghi a.
- `yiw` sao chép từ.

Để lấy văn bản từ thanh ghi a, hãy chạy `"ap`. Bạn có thể sử dụng tất cả hai mươi sáu ký tự chữ cái để lưu hai mươi sáu văn bản khác nhau với các thanh ghi có tên.

Đôi khi bạn có thể muốn thêm vào thanh ghi có tên hiện tại của bạn. Trong trường hợp này, bạn có thể thêm văn bản của mình thay vì bắt đầu lại từ đầu. Để làm điều đó, bạn có thể sử dụng phiên bản viết hoa của thanh ghi đó. Ví dụ, giả sử bạn đã lưu từ "Hello " trong thanh ghi a. Nếu bạn muốn thêm "world" vào thanh ghi a, bạn có thể tìm văn bản "world" và sao chép nó bằng cách sử dụng thanh ghi A (`"Ayiw`).

## Các thanh ghi chỉ đọc

Vim có ba thanh ghi chỉ đọc: `.`, `:`, và `%`. Chúng khá đơn giản để sử dụng:

```shell
.    Lưu văn bản đã chèn cuối cùng
:    Lưu lệnh dòng lệnh đã thực hiện cuối cùng
%    Lưu tên tệp hiện tại
```

Nếu văn bản cuối cùng bạn viết là "Hello Vim", chạy `".p` sẽ in ra văn bản "Hello Vim". Nếu bạn muốn lấy tên tệp hiện tại, hãy chạy `"%p`. Nếu bạn chạy lệnh `:s/foo/bar/g`, chạy `":p` sẽ in ra văn bản "s/foo/bar/g".

## Thanh ghi tệp thay thế

Trong Vim, `#` thường đại diện cho tệp thay thế. Một tệp thay thế là tệp cuối cùng bạn đã mở. Để chèn tên của tệp thay thế, bạn có thể sử dụng `"#p`.

## Thanh ghi biểu thức

Vim có một thanh ghi biểu thức, `"=`, để đánh giá các biểu thức.

Để đánh giá các biểu thức toán học `1 + 1`, hãy chạy:

```shell
"=1+1<Enter>p
```

Ở đây, bạn đang nói với Vim rằng bạn đang sử dụng thanh ghi biểu thức với `"=`. Biểu thức của bạn là (`1 + 1`). Bạn cần gõ `p` để nhận kết quả. Như đã đề cập trước đó, bạn cũng có thể truy cập thanh ghi từ chế độ chèn. Để đánh giá biểu thức toán học từ chế độ chèn, bạn có thể làm:

```shell
Ctrl-R =1+1
```

Bạn cũng có thể lấy giá trị từ bất kỳ thanh ghi nào thông qua thanh ghi biểu thức khi được thêm với `@`. Nếu bạn muốn lấy văn bản từ thanh ghi a:

```shell
"=@a
```

Sau đó nhấn `<Enter>`, rồi `p`. Tương tự, để lấy giá trị từ thanh ghi a trong chế độ chèn:

```shell
Ctrl-r =@a
```

Biểu thức là một chủ đề rộng lớn trong Vim, vì vậy tôi sẽ chỉ đề cập đến những điều cơ bản ở đây. Tôi sẽ đề cập đến các biểu thức chi tiết hơn trong các chương Vimscript sau.

## Các thanh ghi chọn lựa

Bạn có bao giờ ước rằng bạn có thể sao chép một văn bản từ các chương trình bên ngoài và dán nó vào Vim, và ngược lại? Với các thanh ghi chọn lựa của Vim, bạn có thể. Vim có hai thanh ghi chọn lựa: `quotestar` (`"*`) và `quoteplus` (`"+`). Bạn có thể sử dụng chúng để truy cập văn bản đã sao chép từ các chương trình bên ngoài.

Nếu bạn đang ở một chương trình bên ngoài (như trình duyệt Chrome) và bạn sao chép một khối văn bản bằng `Ctrl-C` (hoặc `Cmd-C`, tùy thuộc vào hệ điều hành của bạn), thông thường bạn sẽ không thể sử dụng `p` để dán văn bản trong Vim. Tuy nhiên, cả `"+` và `"*` của Vim đều được kết nối với clipboard của bạn, vì vậy bạn thực sự có thể dán văn bản với `"+p` hoặc `"*p`. Ngược lại, nếu bạn sao chép một từ từ Vim với `"+yiw` hoặc `"*yiw`, bạn có thể dán văn bản đó vào chương trình bên ngoài với `Ctrl-V` (hoặc `Cmd-V`). Lưu ý rằng điều này chỉ hoạt động nếu chương trình Vim của bạn đi kèm với tùy chọn `+clipboard` (để kiểm tra, hãy chạy `:version`).

Bạn có thể tự hỏi nếu `"*` và `"+` làm cùng một việc, tại sao Vim lại có hai thanh ghi khác nhau? Một số máy sử dụng hệ thống cửa sổ X11. Hệ thống này có 3 loại lựa chọn: chính, thứ cấp và clipboard. Nếu máy của bạn sử dụng X11, Vim sử dụng lựa chọn *chính* của X11 với thanh ghi `quotestar` (`"*`) và lựa chọn *clipboard* của X11 với thanh ghi `quoteplus` (`"+`). Điều này chỉ áp dụng nếu bạn có tùy chọn `+xterm_clipboard` trong bản dựng Vim của bạn. Nếu Vim của bạn không có `xterm_clipboard`, không sao cả. Điều đó chỉ có nghĩa là cả `quotestar` và `quoteplus` đều có thể thay thế cho nhau (của tôi cũng không có).

Tôi thấy việc thực hiện `=*p` hoặc `=+p` (hoặc `"*p` hoặc `"+p`) khá cồng kềnh. Để làm cho Vim dán văn bản đã sao chép từ chương trình bên ngoài chỉ với `p`, bạn có thể thêm điều này vào vimrc của bạn:

```shell
set clipboard=unnamed
```

Bây giờ khi tôi sao chép một văn bản từ một chương trình bên ngoài, tôi có thể dán nó bằng thanh ghi không tên, `p`. Tôi cũng có thể sao chép một văn bản từ Vim và dán nó vào một chương trình bên ngoài. Nếu bạn có `+xterm_clipboard`, bạn có thể muốn sử dụng cả hai tùy chọn clipboard `unnamed` và `unnamedplus`.

## Thanh ghi hố đen

Mỗi lần bạn xóa hoặc thay đổi một văn bản, văn bản đó sẽ được lưu vào thanh ghi Vim tự động. Sẽ có những lúc bạn không muốn lưu bất kỳ thứ gì vào thanh ghi. Làm thế nào bạn có thể làm điều đó?

Bạn có thể sử dụng thanh ghi hố đen (`"_`). Để xóa một dòng và không để Vim lưu dòng đã xóa vào bất kỳ thanh ghi nào, hãy sử dụng `"_dd`.

Thanh ghi hố đen giống như `/dev/null` của các thanh ghi.

## Thanh ghi mẫu tìm kiếm cuối cùng

Để dán tìm kiếm cuối cùng của bạn (`/` hoặc `?`), bạn có thể sử dụng thanh ghi mẫu tìm kiếm cuối cùng (`"/`). Để dán thuật ngữ tìm kiếm cuối cùng, hãy sử dụng `"/p`.

## Xem các thanh ghi

Để xem tất cả các thanh ghi của bạn, hãy sử dụng lệnh `:register`. Để chỉ xem các thanh ghi "a, "1, và "-, hãy sử dụng `:register a 1 -`.

Có một plugin gọi là [vim-peekaboo](https://github.com/junegunn/vim-peekaboo) cho phép bạn xem nội dung của các thanh ghi khi bạn nhấn `"` hoặc `@` trong chế độ bình thường và `Ctrl-R` trong chế độ chèn. Tôi thấy plugin này rất hữu ích vì hầu hết thời gian, tôi không thể nhớ nội dung trong các thanh ghi của mình. Hãy thử nó!

## Thực thi một thanh ghi

Các thanh ghi có tên không chỉ để lưu trữ văn bản. Chúng cũng có thể thực thi các macro với `@`. Tôi sẽ đề cập đến các macro trong chương tiếp theo.

Hãy nhớ rằng vì các macro được lưu trữ bên trong các thanh ghi Vim, bạn có thể vô tình ghi đè văn bản đã lưu trữ bằng các macro. Nếu bạn lưu văn bản "Hello Vim" trong thanh ghi a và sau đó bạn ghi lại một macro trong cùng một thanh ghi (`qa{chuỗi-macro}q`), macro đó sẽ ghi đè văn bản "Hello Vim" mà bạn đã lưu trước đó.
## Xóa một Register

Về mặt kỹ thuật, không cần phải xóa bất kỳ register nào vì văn bản tiếp theo mà bạn lưu dưới cùng một tên register sẽ ghi đè lên nó. Tuy nhiên, bạn có thể nhanh chóng xóa bất kỳ register nào bằng cách ghi lại một macro rỗng. Ví dụ, nếu bạn chạy `qaq`, Vim sẽ ghi lại một macro rỗng trong register a.

Một lựa chọn khác là chạy lệnh `:call setreg('a', 'hello register a')` trong đó a là register a và "hello register a" là văn bản mà bạn muốn lưu.

Một cách nữa để xóa register là đặt nội dung của "register a" thành một chuỗi rỗng với biểu thức `:let @a = ''`.

## Đưa Nội Dung của một Register

Bạn có thể sử dụng lệnh `:put` để dán nội dung của bất kỳ register nào. Ví dụ, nếu bạn chạy `:put a`, Vim sẽ in nội dung của register a bên dưới dòng hiện tại. Điều này hoạt động giống như `"ap`, với sự khác biệt là lệnh chế độ bình thường `p` in nội dung register sau con trỏ và lệnh `:put` in nội dung register ở dòng mới.

Vì `:put` là một lệnh dòng lệnh, bạn có thể truyền cho nó một địa chỉ. `:10put a` sẽ dán văn bản từ register a xuống dưới dòng 10.

Một mẹo hay để truyền `:put` với register hố đen (`"_`). Vì register hố đen không lưu trữ bất kỳ văn bản nào, `:put _` sẽ chèn một dòng trống thay vào đó. Bạn có thể kết hợp điều này với lệnh toàn cục để chèn nhiều dòng trống. Ví dụ, để chèn dòng trống dưới tất cả các dòng chứa văn bản "end", chạy `:g/end/put _`. Bạn sẽ học về lệnh toàn cục sau.

## Học Register theo Cách Thông Minh

Bạn đã đến cuối. Chúc mừng! Nếu bạn cảm thấy choáng ngợp bởi lượng thông tin, bạn không đơn độc. Khi tôi lần đầu tiên bắt đầu tìm hiểu về các register của Vim, có quá nhiều thông tin để tiếp nhận cùng một lúc.

Tôi không nghĩ bạn nên ghi nhớ tất cả các register ngay lập tức. Để trở nên hiệu quả, bạn có thể bắt đầu bằng cách chỉ sử dụng 3 register này:
1. Register không tên (`""`).
2. Các register có tên (`"a-z`).
3. Các register số (`"0-9`).

Vì register không tên mặc định là `p` và `P`, bạn chỉ cần học hai register: các register có tên và các register số. Dần dần học thêm các register khi bạn cần. Hãy dành thời gian của bạn.

Con người trung bình có khả năng ghi nhớ ngắn hạn hạn chế, khoảng 5 - 7 mục cùng một lúc. Đó là lý do tại sao trong việc chỉnh sửa hàng ngày của tôi, tôi chỉ sử dụng khoảng 5 - 7 register có tên. Không có cách nào tôi có thể nhớ tất cả hai mươi sáu register trong đầu. Tôi thường bắt đầu với register a, sau đó là b, theo thứ tự chữ cái. Hãy thử và thực nghiệm để xem kỹ thuật nào hoạt động tốt nhất cho bạn.

Các register của Vim rất mạnh mẽ. Nếu được sử dụng một cách chiến lược, nó có thể giúp bạn tiết kiệm việc gõ lại vô số văn bản lặp lại. Tiếp theo, hãy cùng tìm hiểu về các macro.