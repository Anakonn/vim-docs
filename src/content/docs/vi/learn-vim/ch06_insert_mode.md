---
description: Tài liệu này hướng dẫn cách sử dụng chế độ chèn trong Vim, bao gồm các
  phím tắt và tính năng hữu ích để nâng cao hiệu suất gõ văn bản.
title: Ch06. Insert Mode
---

Chế độ chèn là chế độ mặc định của nhiều trình soạn thảo văn bản. Trong chế độ này, những gì bạn gõ là những gì bạn nhận được.

Tuy nhiên, điều đó không có nghĩa là không có nhiều điều để học. Chế độ chèn của Vim chứa nhiều tính năng hữu ích. Trong chương này, bạn sẽ học cách sử dụng những tính năng chế độ chèn này trong Vim để cải thiện hiệu suất gõ của bạn.

## Cách vào chế độ chèn

Có nhiều cách để vào chế độ chèn từ chế độ bình thường. Dưới đây là một số cách:

```shell
i    Chèn văn bản trước con trỏ
I    Chèn văn bản trước ký tự không trắng đầu tiên của dòng
a    Thêm văn bản sau con trỏ
A    Thêm văn bản ở cuối dòng
o    Bắt đầu một dòng mới bên dưới con trỏ và chèn văn bản
O    Bắt đầu một dòng mới bên trên con trỏ và chèn văn bản
s    Xóa ký tự dưới con trỏ và chèn văn bản
S    Xóa dòng hiện tại và chèn văn bản, đồng nghĩa với "cc"
gi   Chèn văn bản ở cùng vị trí nơi chế độ chèn cuối cùng dừng lại
gI   Chèn văn bản ở đầu dòng (cột 1)
```

Lưu ý về mẫu chữ thường / chữ hoa. Đối với mỗi lệnh chữ thường, có một lệnh chữ hoa tương ứng. Nếu bạn mới, đừng lo lắng nếu bạn không nhớ toàn bộ danh sách ở trên. Bắt đầu với `i` và `o`. Chúng sẽ đủ để giúp bạn bắt đầu. Dần dần học thêm theo thời gian.

## Các cách khác nhau để thoát chế độ chèn

Có một vài cách khác nhau để quay lại chế độ bình thường trong khi ở chế độ chèn:

```shell
<Esc>     Thoát chế độ chèn và quay lại chế độ bình thường
Ctrl-[    Thoát chế độ chèn và quay lại chế độ bình thường
Ctrl-C    Giống như Ctrl-[ và <Esc>, nhưng không kiểm tra viết tắt
```

Tôi thấy phím `<Esc>` quá xa để với tới, vì vậy tôi ánh xạ phím `<Caps-Lock>` của máy tính của tôi để hoạt động như `<Esc>`. Nếu bạn tìm kiếm bàn phím ADM-3A của Bill Joy (người tạo Vi), bạn sẽ thấy rằng phím `<Esc>` không nằm ở góc trên bên trái xa như các bàn phím hiện đại, mà nằm bên trái phím `q`. Đó là lý do tại sao tôi nghĩ rằng việc ánh xạ `<Caps lock>` thành `<Esc>` là hợp lý.

Một quy ước phổ biến khác mà tôi thấy người dùng Vim thực hiện là ánh xạ `<Esc>` thành `jj` hoặc `jk` trong chế độ chèn. Nếu bạn thích tùy chọn này, hãy thêm một trong những dòng đó (hoặc cả hai) vào tệp vimrc của bạn.

```shell
inoremap jj <Esc>
inoremap jk <Esc>
```

## Lặp lại chế độ chèn

Bạn có thể truyền một tham số đếm trước khi vào chế độ chèn. Ví dụ:

```shell
10i
```

Nếu bạn gõ "hello world!" và thoát chế độ chèn, Vim sẽ lặp lại văn bản 10 lần. Điều này sẽ hoạt động với bất kỳ phương pháp chế độ chèn nào (ví dụ: `10I`, `11a`, `12o`).

## Xóa các khối trong chế độ chèn

Khi bạn mắc lỗi gõ, việc gõ `<Backspace>` liên tục có thể rất phiền phức. Có thể hợp lý hơn khi quay lại chế độ bình thường và xóa lỗi của bạn. Bạn cũng có thể xóa nhiều ký tự cùng một lúc trong khi ở chế độ chèn.

```shell
Ctrl-h    Xóa một ký tự
Ctrl-w    Xóa một từ
Ctrl-u    Xóa toàn bộ dòng
```

## Chèn từ thanh ghi

Các thanh ghi của Vim có thể lưu trữ văn bản để sử dụng trong tương lai. Để chèn một văn bản từ bất kỳ thanh ghi nào trong khi ở chế độ chèn, hãy gõ `Ctrl-R` cộng với ký hiệu thanh ghi. Có nhiều ký hiệu bạn có thể sử dụng, nhưng cho phần này, hãy chỉ đề cập đến các thanh ghi được đặt tên (a-z).

Để xem nó hoạt động, trước tiên bạn cần lấy một từ vào thanh ghi a. Di chuyển con trỏ của bạn đến bất kỳ từ nào. Sau đó gõ:

```shell
"ayiw
```

- `"a` cho Vim biết rằng mục tiêu của hành động tiếp theo của bạn sẽ đi vào thanh ghi a.
- `yiw` lấy từ bên trong. Xem lại chương về ngữ pháp Vim để làm quen.

Thanh ghi a bây giờ chứa từ bạn vừa lấy. Trong khi ở chế độ chèn, để dán văn bản được lưu trong thanh ghi a:

```shell
Ctrl-R a
```

Có nhiều loại thanh ghi trong Vim. Tôi sẽ đề cập đến chúng chi tiết hơn trong một chương sau.

## Cuộn

Bạn có biết rằng bạn có thể cuộn trong khi ở chế độ chèn không? Trong khi ở chế độ chèn, nếu bạn vào chế độ phụ `Ctrl-X`, bạn có thể thực hiện các thao tác bổ sung. Cuộn là một trong số đó.

```shell
Ctrl-X Ctrl-Y    Cuộn lên
Ctrl-X Ctrl-E    Cuộn xuống
```

## Tự động hoàn thành

Như đã đề cập ở trên, nếu bạn nhấn `Ctrl-X` từ chế độ chèn, Vim sẽ vào một chế độ phụ. Bạn có thể thực hiện tự động hoàn thành văn bản trong khi ở chế độ phụ này. Mặc dù nó không tốt bằng [intellisense](https://code.visualstudio.com/docs/editor/intellisense) hoặc bất kỳ Giao thức Máy chủ Ngôn ngữ (LSP) nào khác, nhưng đối với một thứ có sẵn ngay từ đầu, đây là một tính năng rất khả thi.

Dưới đây là một số lệnh tự động hoàn thành hữu ích để bắt đầu:

```shell
Ctrl-X Ctrl-L	   Chèn một dòng hoàn chỉnh
Ctrl-X Ctrl-N	   Chèn một văn bản từ tệp hiện tại
Ctrl-X Ctrl-I	   Chèn một văn bản từ các tệp đã bao gồm
Ctrl-X Ctrl-F	   Chèn một tên tệp
```

Khi bạn kích hoạt tự động hoàn thành, Vim sẽ hiển thị một cửa sổ pop-up. Để điều hướng lên và xuống cửa sổ pop-up, sử dụng `Ctrl-N` và `Ctrl-P`.

Vim cũng có hai phím tắt tự động hoàn thành không liên quan đến chế độ phụ `Ctrl-X`:

```shell
Ctrl-N             Tìm kiếm từ khớp tiếp theo
Ctrl-P             Tìm kiếm từ khớp trước đó
```

Nói chung, Vim xem xét văn bản trong tất cả các bộ đệm có sẵn để tìm nguồn tự động hoàn thành. Nếu bạn có một bộ đệm mở với một dòng nói rằng "Bánh donut sô cô la là tốt nhất":
- Khi bạn gõ "Choco" và thực hiện `Ctrl-X Ctrl-L`, nó sẽ khớp và in toàn bộ dòng.
- Khi bạn gõ "Choco" và thực hiện `Ctrl-P`, nó sẽ khớp và in từ "Chocolate".

Tự động hoàn thành là một chủ đề rộng lớn trong Vim. Đây chỉ là phần nổi của tảng băng chìm. Để tìm hiểu thêm, hãy kiểm tra `:h ins-completion`.

## Thực hiện lệnh chế độ bình thường

Bạn có biết Vim có thể thực hiện một lệnh chế độ bình thường trong khi ở chế độ chèn không?

Trong khi ở chế độ chèn, nếu bạn nhấn `Ctrl-O`, bạn sẽ vào chế độ phụ chế độ chèn-bình thường. Nếu bạn nhìn vào chỉ báo chế độ ở góc dưới bên trái, thông thường bạn sẽ thấy `-- INSERT --`, nhưng nhấn `Ctrl-O` sẽ thay đổi nó thành `-- (insert) --`. Trong chế độ này, bạn có thể thực hiện *một* lệnh chế độ bình thường. Một số điều bạn có thể làm:

**Căn giữa và nhảy**

```shell
Ctrl-O zz       Căn giữa cửa sổ
Ctrl-O H/M/L    Nhảy đến đầu/giữa/cuối cửa sổ
Ctrl-O 'a       Nhảy đến đánh dấu a
```

**Lặp lại văn bản**

```shell
Ctrl-O 100ihello    Chèn "hello" 100 lần
```

**Thực hiện lệnh terminal**

```shell
Ctrl-O !! curl https://google.com    Chạy curl
Ctrl-O !! pwd                        Chạy pwd
```

**Xóa nhanh hơn**

```shell
Ctrl-O dtz    Xóa từ vị trí hiện tại đến chữ "z"
Ctrl-O D      Xóa từ vị trí hiện tại đến cuối dòng
```

## Học chế độ chèn theo cách thông minh

Nếu bạn giống tôi và đến từ một trình soạn thảo văn bản khác, có thể bạn sẽ bị cám dỗ để ở lại chế độ chèn. Tuy nhiên, ở lại chế độ chèn khi bạn không nhập văn bản là một mẫu hành vi không tốt. Hãy phát triển thói quen quay lại chế độ bình thường khi ngón tay của bạn không gõ văn bản mới.

Khi bạn cần chèn một văn bản, trước tiên hãy tự hỏi liệu văn bản đó đã tồn tại chưa. Nếu có, hãy cố gắng lấy hoặc di chuyển văn bản đó thay vì gõ lại. Nếu bạn phải sử dụng chế độ chèn, hãy xem liệu bạn có thể tự động hoàn thành văn bản đó bất cứ khi nào có thể. Tránh gõ cùng một từ nhiều hơn một lần nếu bạn có thể.