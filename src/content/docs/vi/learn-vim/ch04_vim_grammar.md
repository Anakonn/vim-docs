---
description: Hướng dẫn này giúp bạn hiểu cấu trúc ngữ pháp của lệnh Vim, từ đó dễ
  dàng sử dụng và thực hành các lệnh trong Vim một cách hiệu quả.
title: Ch04. Vim Grammar
---

Thật dễ dàng để cảm thấy bị áp lực bởi sự phức tạp của các lệnh Vim. Nếu bạn thấy một người dùng Vim thực hiện `gUfV` hoặc `1GdG`, bạn có thể không ngay lập tức biết những lệnh này làm gì. Trong chương này, tôi sẽ phân tích cấu trúc tổng quát của các lệnh Vim thành một quy tắc ngữ pháp đơn giản.

Đây là chương quan trọng nhất trong toàn bộ hướng dẫn. Khi bạn hiểu cấu trúc ngữ pháp cơ bản, bạn sẽ có thể "nói" với Vim. Nhân tiện, khi tôi nói *ngôn ngữ Vim* trong chương này, tôi không nói về ngôn ngữ Vimscript (ngôn ngữ lập trình tích hợp của Vim, bạn sẽ học điều đó trong các chương sau).

## Cách Học Một Ngôn Ngữ

Tôi không phải là người nói tiếng Anh bản ngữ. Tôi đã học tiếng Anh khi tôi 13 tuổi khi tôi chuyển đến Mỹ. Có ba điều bạn cần làm để học nói một ngôn ngữ mới:

1. Học quy tắc ngữ pháp.
2. Tăng cường từ vựng.
3. Thực hành, thực hành, thực hành.

Tương tự, để nói ngôn ngữ Vim, bạn cần học các quy tắc ngữ pháp, tăng cường từ vựng và thực hành cho đến khi bạn có thể chạy các lệnh mà không cần suy nghĩ.

## Quy Tắc Ngữ Pháp

Chỉ có một quy tắc ngữ pháp trong ngôn ngữ Vim:

```shell
động từ + danh từ
```

Chỉ vậy thôi!

Điều này giống như nói những cụm từ tiếng Anh này:

- *"Ăn (động từ) một cái bánh donut (danh từ)"*
- *"Đá (động từ) một quả bóng (danh từ)"*
- *"Học (động từ) trình soạn thảo Vim (danh từ)"*

Bây giờ bạn cần xây dựng từ vựng của mình với các động từ và danh từ cơ bản của Vim.

## Danh Từ (Chuyển Động)

Danh từ là các chuyển động trong Vim. Các chuyển động được sử dụng để di chuyển xung quanh trong Vim. Dưới đây là danh sách một số chuyển động của Vim:

```shell
h    Trái
j    Xuống
k    Lên
l    Phải
w    Di chuyển về phía trước đến đầu của từ tiếp theo
}    Nhảy đến đoạn văn tiếp theo
$    Đi đến cuối dòng
```

Bạn sẽ học thêm về các chuyển động trong chương tiếp theo, vì vậy đừng lo lắng quá nếu bạn không hiểu một số trong số chúng.

## Động Từ (Toán Tử)

Theo `:h operator`, Vim có 16 toán tử. Tuy nhiên, theo kinh nghiệm của tôi, học 3 toán tử này là đủ cho 80% nhu cầu chỉnh sửa của tôi:

```shell
y    Sao chép văn bản (copy)
d    Xóa văn bản và lưu vào thanh ghi
c    Xóa văn bản, lưu vào thanh ghi và bắt đầu chế độ chèn
```

Nhân tiện, sau khi bạn sao chép một văn bản, bạn có thể dán nó bằng `p` (sau con trỏ) hoặc `P` (trước con trỏ).

## Động Từ và Danh Từ

Bây giờ bạn đã biết các danh từ và động từ cơ bản, hãy áp dụng quy tắc ngữ pháp, động từ + danh từ! Giả sử bạn có biểu thức này:

```javascript
const learn = "vim";
```

- Để sao chép mọi thứ từ vị trí hiện tại của bạn đến cuối dòng: `y$`.
- Để xóa từ vị trí hiện tại của bạn đến đầu của từ tiếp theo: `dw`.
- Để thay đổi từ vị trí hiện tại của bạn đến cuối đoạn văn hiện tại, nói `c}`.

Các chuyển động cũng chấp nhận số đếm như các đối số (tôi sẽ thảo luận về điều này trong chương tiếp theo). Nếu bạn cần đi lên 3 dòng, thay vì nhấn `k` 3 lần, bạn có thể làm `3k`. Số đếm hoạt động với ngữ pháp Vim.
- Để sao chép hai ký tự sang trái: `y2h`.
- Để xóa hai từ tiếp theo: `d2w`.
- Để thay đổi hai dòng tiếp theo: `c2j`.

Bây giờ, bạn có thể phải suy nghĩ lâu và khó để thực hiện ngay cả một lệnh đơn giản. Bạn không đơn độc. Khi tôi mới bắt đầu, tôi cũng gặp phải những khó khăn tương tự nhưng tôi đã nhanh hơn theo thời gian. Bạn cũng sẽ như vậy. Lặp đi lặp lại, lặp đi lặp lại, lặp đi lặp lại.

Lưu ý rằng, các thao tác theo dòng (các thao tác ảnh hưởng đến toàn bộ dòng) là các thao tác phổ biến trong chỉnh sửa văn bản. Nói chung, bằng cách gõ một lệnh toán tử hai lần, Vim thực hiện một thao tác theo dòng cho hành động đó. Ví dụ, `dd`, `yy`, và `cc` thực hiện **xóa**, **sao chép**, và **thay đổi** trên toàn bộ dòng. Hãy thử điều này với các toán tử khác!

Điều này thật tuyệt. Tôi thấy một mẫu ở đây. Nhưng tôi chưa hoàn thành. Vim có một loại danh từ nữa: các đối tượng văn bản.

## Nhiều Danh Từ Hơn (Đối Tượng Văn Bản)

Hãy tưởng tượng bạn đang ở đâu đó bên trong một cặp dấu ngoặc đơn như `(hello Vim)` và bạn cần xóa toàn bộ cụm từ bên trong dấu ngoặc. Làm thế nào bạn có thể nhanh chóng làm điều đó? Có cách nào để xóa "nhóm" mà bạn đang ở bên trong không?

Câu trả lời là có. Các văn bản thường có cấu trúc. Chúng thường chứa dấu ngoặc đơn, dấu ngoặc kép, dấu ngoặc vuông, dấu ngoặc nhọn, và nhiều hơn nữa. Vim có cách để nắm bắt cấu trúc này bằng các đối tượng văn bản.

Các đối tượng văn bản được sử dụng với các toán tử. Có hai loại đối tượng văn bản: đối tượng văn bản bên trong và bên ngoài.

```shell
i + đối tượng    Đối tượng văn bản bên trong
a + đối tượng    Đối tượng văn bản bên ngoài
```

Đối tượng văn bản bên trong chọn đối tượng bên trong *mà không có* khoảng trắng hoặc các đối tượng xung quanh. Đối tượng văn bản bên ngoài chọn đối tượng bên trong *bao gồm* khoảng trắng hoặc các đối tượng xung quanh. Nói chung, một đối tượng văn bản bên ngoài luôn chọn nhiều văn bản hơn một đối tượng văn bản bên trong. Nếu con trỏ của bạn ở đâu đó bên trong dấu ngoặc trong biểu thức `(hello Vim)`:
- Để xóa văn bản bên trong dấu ngoặc mà không xóa dấu ngoặc: `di(`.
- Để xóa dấu ngoặc và văn bản bên trong: `da(`.

Hãy xem một ví dụ khác. Giả sử bạn có hàm Javascript này và con trỏ của bạn đang ở chữ "H" trong "Hello":

```javascript
const hello = function() {
  console.log("Hello Vim");
  return true;
}
```

- Để xóa toàn bộ "Hello Vim": `di(`.
- Để xóa nội dung của hàm (được bao quanh bởi `{}`): `di{`.
- Để xóa chuỗi "Hello": `diw`.

Các đối tượng văn bản rất mạnh mẽ vì bạn có thể nhắm mục tiêu đến các đối tượng khác nhau từ một vị trí. Bạn có thể xóa các đối tượng bên trong dấu ngoặc, khối hàm, hoặc từ hiện tại. Nhớ rằng, khi bạn thấy `di(`, `di{`, và `diw`, bạn có một ý tưởng khá tốt về các đối tượng văn bản mà chúng đại diện: một cặp dấu ngoặc đơn, một cặp dấu ngoặc nhọn, và một từ.

Hãy xem một ví dụ cuối cùng. Giả sử bạn có các thẻ HTML này:

```html
<div>
  <h1>Header1</h1>
  <p>Paragraph1</p>
  <p>Paragraph2</p>
</div>
```

Nếu con trỏ của bạn đang ở văn bản "Header1":
- Để xóa "Header1": `dit`.
- Để xóa `<h1>Header1</h1>`: `dat`.

Nếu con trỏ của bạn đang ở "div":
- Để xóa `h1` và cả hai dòng `p`: `dit`.
- Để xóa mọi thứ: `dat`.
- Để xóa "div": `di<`.

Dưới đây là danh sách các đối tượng văn bản phổ biến:

```shell
w         Một từ
p         Một đoạn văn
s         Một câu
( hoặc )  Một cặp ( )
{ hoặc }  Một cặp { }
[ hoặc ]  Một cặp [ ]
< hoặc >  Một cặp < >
t         Thẻ XML
"         Một cặp " "
'         Một cặp ' '
`         Một cặp ` `
```

Để tìm hiểu thêm, hãy kiểm tra `:h text-objects`.

## Tính Khả Năng Kết Hợp và Ngữ Pháp

Ngữ pháp Vim là một tập con của tính năng khả năng kết hợp của Vim. Hãy thảo luận về khả năng kết hợp trong Vim và tại sao đây là một tính năng tuyệt vời để có trong một trình soạn thảo văn bản.

Khả năng kết hợp có nghĩa là có một tập hợp các lệnh tổng quát có thể được kết hợp (kết hợp) để thực hiện các lệnh phức tạp hơn. Giống như trong lập trình, nơi bạn có thể tạo ra các trừu tượng phức tạp hơn từ các trừu tượng đơn giản hơn, trong Vim bạn có thể thực hiện các lệnh phức tạp từ các lệnh đơn giản hơn. Ngữ pháp Vim là sự thể hiện của bản chất có thể kết hợp của Vim.

Sức mạnh thực sự của khả năng kết hợp của Vim tỏa sáng khi nó tích hợp với các chương trình bên ngoài. Vim có một toán tử lọc (`!`) để sử dụng các chương trình bên ngoài làm bộ lọc cho văn bản của chúng ta. Giả sử bạn có văn bản lộn xộn dưới đây và bạn muốn định dạng nó thành bảng:

```shell
Id|Name|Cuteness
01|Puppy|Very
02|Kitten|Ok
03|Bunny|Ok
```

Điều này không thể dễ dàng thực hiện bằng các lệnh Vim, nhưng bạn có thể thực hiện nhanh chóng với lệnh `column` trong terminal (giả sử terminal của bạn có lệnh `column`). Với con trỏ của bạn trên "Id", chạy `!}column -t -s "|"`. Voilà! Bây giờ bạn có dữ liệu bảng đẹp mắt này chỉ với một lệnh nhanh chóng.

```shell
Id  Name    Cuteness
01  Puppy   Very
02  Kitten  Ok
03  Bunny   Ok
```

Hãy phân tích lệnh. Động từ là `!` (toán tử lọc) và danh từ là `}` (đi đến đoạn văn tiếp theo). Toán tử lọc `!` chấp nhận một đối số khác, một lệnh terminal, vì vậy tôi đã đưa vào `column -t -s "|"`. Tôi sẽ không đi qua cách `column` hoạt động, nhưng thực tế, nó đã định dạng văn bản thành bảng.

Giả sử bạn không chỉ muốn định dạng văn bản của mình thành bảng, mà còn muốn hiển thị chỉ các hàng có "Ok". Bạn biết rằng `awk` có thể làm điều đó dễ dàng. Bạn có thể làm điều này thay vào đó:

```shell
!}column -t -s "|" | awk 'NR > 1 && /Ok/ {print $0}'
```

Kết quả:

```shell
02  Kitten  Ok
03  Bunny   Ok
```

Tuyệt vời! Toán tử lệnh bên ngoài cũng có thể sử dụng ống (`|`).

Đây là sức mạnh của khả năng kết hợp của Vim. Càng biết nhiều toán tử, chuyển động và lệnh terminal, khả năng kết hợp các hành động phức tạp của bạn sẽ *tăng lên*.

Giả sử bạn chỉ biết bốn chuyển động, `w, $, }, G` và chỉ một toán tử, `d`. Bạn có thể thực hiện 8 hành động: *di chuyển* 4 cách khác nhau (`w, $, }, G`) và *xóa* 4 mục tiêu khác nhau (`dw, d$, d}, dG`). Rồi một ngày bạn học về toán tử viết hoa (`gU`). Bạn không chỉ thêm một khả năng mới vào bộ công cụ Vim của mình, mà còn *bốn*: `gUw, gU$, gU}, gUG`. Điều này tạo ra 12 công cụ trong bộ công cụ Vim của bạn. Mỗi kiến thức mới là một yếu tố nhân cho khả năng hiện tại của bạn. Nếu bạn biết 10 chuyển động và 5 toán tử, bạn có 60 động tác (50 thao tác + 10 chuyển động) trong kho vũ khí của mình. Vim có một chuyển động số dòng (`nG`) cho phép bạn có `n` chuyển động, trong đó `n` là số dòng bạn có trong tệp của mình (để đi đến dòng 5, chạy `5G`). Chuyển động tìm kiếm (`/`) thực tế cho bạn gần như số lượng chuyển động không giới hạn vì bạn có thể tìm kiếm bất cứ điều gì. Toán tử lệnh bên ngoài (`!`) cung cấp cho bạn nhiều công cụ lọc như số lượng lệnh terminal bạn biết. Sử dụng một công cụ có thể kết hợp như Vim, mọi thứ bạn biết có thể được liên kết với nhau để thực hiện các thao tác với độ phức tạp ngày càng tăng. Càng biết nhiều, bạn càng trở nên mạnh mẽ hơn.

Hành vi có thể kết hợp này phản ánh triết lý Unix: *làm một việc tốt*. Một toán tử có một công việc: làm Y. Một chuyển động có một công việc: đi đến X. Bằng cách kết hợp một toán tử với một chuyển động, bạn dự đoán được YX: làm Y trên X.

Các chuyển động và toán tử có thể mở rộng. Bạn có thể tạo các chuyển động và toán tử tùy chỉnh để thêm vào bộ công cụ Vim của bạn. Plugin [`vim-textobj-user`](https://github.com/kana/vim-textobj-user) cho phép bạn tạo các đối tượng văn bản của riêng mình. Nó cũng chứa một [danh sách](https://github.com/kana/vim-textobj-user/wiki) các đối tượng văn bản tùy chỉnh do người dùng tạo.

## Học Ngữ Pháp Vim Một Cách Thông Minh

Bạn vừa học về quy tắc ngữ pháp của Vim: `động từ + danh từ`. Một trong những khoảnh khắc "AHA!" lớn nhất của tôi với Vim là khi tôi vừa học về toán tử viết hoa (`gU`) và muốn viết hoa từ hiện tại, tôi *bản năng* chạy `gUiw` và nó đã hoạt động! Từ đã được viết hoa. Vào lúc đó, tôi cuối cùng đã bắt đầu hiểu Vim. Hy vọng của tôi là bạn sẽ có khoảnh khắc "AHA!" của riêng bạn sớm, nếu chưa phải rồi.

Mục tiêu của chương này là cho bạn thấy mẫu `động từ + danh từ` trong Vim để bạn sẽ tiếp cận việc học Vim như học một ngôn ngữ mới thay vì ghi nhớ từng kết hợp lệnh. 

Hãy học mẫu và hiểu các hệ quả. Đó là cách học thông minh.