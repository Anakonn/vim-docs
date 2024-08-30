---
description: Tài liệu này giải thích về các khái niệm buffer, window và tab trong
  Vim, cùng với cách cấu hình vimrc để tối ưu hóa trải nghiệm làm việc.
title: Ch02. Buffers, Windows, and Tabs
---

Nếu bạn đã sử dụng một trình soạn thảo văn bản hiện đại trước đây, bạn có thể quen thuộc với các cửa sổ và tab. Vim sử dụng ba trừu tượng hiển thị thay vì hai: bộ đệm, cửa sổ và tab. Trong chương này, tôi sẽ giải thích bộ đệm, cửa sổ và tab là gì và chúng hoạt động như thế nào trong Vim.

Trước khi bạn bắt đầu, hãy đảm bảo bạn có tùy chọn `set hidden` trong vimrc. Nếu không có, mỗi khi bạn chuyển đổi bộ đệm và bộ đệm hiện tại của bạn chưa được lưu, Vim sẽ nhắc bạn lưu tệp (bạn không muốn điều đó nếu bạn muốn di chuyển nhanh chóng). Tôi chưa đề cập đến vimrc. Nếu bạn không có vimrc, hãy tạo một cái. Nó thường được đặt trong thư mục chính của bạn và được đặt tên là `.vimrc`. Tôi có của tôi ở `~/.vimrc`. Để xem nơi bạn nên tạo vimrc, hãy kiểm tra `:h vimrc`. Bên trong nó, thêm:

```shell
set hidden
```

Lưu nó, sau đó nguồn nó (chạy `:source %` từ bên trong vimrc).

## Bộ đệm

Bộ đệm là gì?

Bộ đệm là một không gian trong bộ nhớ nơi bạn có thể viết và chỉnh sửa một số văn bản. Khi bạn mở một tệp trong Vim, dữ liệu được gán cho một bộ đệm. Khi bạn mở 3 tệp trong Vim, bạn có 3 bộ đệm.

Có hai tệp trống, `file1.js` và `file2.js` có sẵn (nếu có thể, hãy tạo chúng bằng Vim). Chạy lệnh này trong terminal:

```bash
vim file1.js
```

Những gì bạn đang thấy là *bộ đệm* `file1.js`. Mỗi khi bạn mở một tệp mới, Vim sẽ tạo một bộ đệm mới.

Thoát khỏi Vim. Lần này, mở hai tệp mới:

```bash
vim file1.js file2.js
```

Vim hiện đang hiển thị bộ đệm `file1.js`, nhưng thực tế nó tạo ra hai bộ đệm: bộ đệm `file1.js` và bộ đệm `file2.js`. Chạy `:buffers` để xem tất cả các bộ đệm (ngoài ra, bạn cũng có thể sử dụng `:ls` hoặc `:files`). Bạn nên thấy *cả hai* `file1.js` và `file2.js` được liệt kê. Chạy `vim file1 file2 file3 ... filen` tạo ra n số lượng bộ đệm. Mỗi lần bạn mở một tệp mới, Vim tạo một bộ đệm mới cho tệp đó.

Có một số cách bạn có thể duyệt bộ đệm:
- `:bnext` để đi đến bộ đệm tiếp theo (`:bprevious` để quay lại bộ đệm trước đó).
- `:buffer` + tên tệp. Vim có thể tự động hoàn thành tên tệp với `<Tab>`.
- `:buffer` + `n`, trong đó `n` là số bộ đệm. Ví dụ, gõ `:buffer 2` sẽ đưa bạn đến bộ đệm #2.
- Nhảy đến vị trí cũ hơn trong danh sách nhảy với `Ctrl-O` và đến vị trí mới hơn với `Ctrl-I`. Đây không phải là các phương pháp cụ thể cho bộ đệm, nhưng chúng có thể được sử dụng để nhảy giữa các bộ đệm khác nhau. Tôi sẽ giải thích về các bước nhảy chi tiết hơn trong Chương 5.
- Đi đến bộ đệm đã chỉnh sửa trước đó với `Ctrl-^`.

Khi Vim tạo ra một bộ đệm, nó sẽ vẫn ở trong danh sách bộ đệm của bạn. Để xóa nó, bạn có thể gõ `:bdelete`. Nó cũng có thể chấp nhận một số bộ đệm như một tham số (`:bdelete 3` để xóa bộ đệm #3) hoặc một tên tệp (`:bdelete` sau đó sử dụng `<Tab>` để tự động hoàn thành).

Điều khó khăn nhất đối với tôi khi học về bộ đệm là hình dung cách chúng hoạt động vì tâm trí tôi đã quen với các cửa sổ từ khi sử dụng một trình soạn thảo văn bản phổ biến. Một phép ẩn dụ tốt là một bộ bài. Nếu tôi có 2 bộ đệm, tôi có một chồng 2 lá bài. Lá bài ở trên cùng là lá bài duy nhất tôi thấy, nhưng tôi biết có những lá bài bên dưới nó. Nếu tôi thấy bộ đệm `file1.js` được hiển thị thì lá bài `file1.js` đang ở trên cùng của chồng. Tôi không thể thấy lá bài khác, `file2.js` ở đây, nhưng nó vẫn ở đó. Nếu tôi chuyển bộ đệm sang `file2.js`, thì lá bài `file2.js` bây giờ đang ở trên cùng của chồng và lá bài `file1.js` nằm bên dưới nó.

Nếu bạn chưa sử dụng Vim trước đây, đây là một khái niệm mới. Hãy dành thời gian để hiểu nó.

## Thoát khỏi Vim

Nhân tiện, nếu bạn có nhiều bộ đệm mở, bạn có thể đóng tất cả chúng bằng lệnh thoát tất cả:

```shell
:qall
```

Nếu bạn muốn đóng mà không lưu thay đổi của mình, chỉ cần thêm `!` ở cuối:

```shell
:qall!
```

Để lưu và thoát tất cả, chạy:

```shell
:wqall
```

## Cửa sổ

Một cửa sổ là một vùng nhìn trên một bộ đệm. Nếu bạn đến từ một trình soạn thảo phổ biến, khái niệm này có thể quen thuộc với bạn. Hầu hết các trình soạn thảo văn bản có khả năng hiển thị nhiều cửa sổ. Trong Vim, bạn cũng có thể có nhiều cửa sổ.

Hãy mở `file1.js` từ terminal một lần nữa:

```bash
vim file1.js
```

Trước đó tôi đã viết rằng bạn đang nhìn vào bộ đệm `file1.js`. Trong khi điều đó là đúng, tuyên bố đó chưa đầy đủ. Bạn đang nhìn vào bộ đệm `file1.js`, được hiển thị qua **một cửa sổ**. Một cửa sổ là cách bạn đang xem một bộ đệm.

Đừng thoát khỏi Vim ngay bây giờ. Chạy:

```shell
:split file2.js
```

Bây giờ bạn đang nhìn vào hai bộ đệm qua **hai cửa sổ**. Cửa sổ trên cùng hiển thị bộ đệm `file2.js`. Cửa sổ dưới cùng hiển thị bộ đệm `file1.js`.

Nếu bạn muốn điều hướng giữa các cửa sổ, hãy sử dụng các phím tắt sau:

```shell
Ctrl-W H    Di chuyển con trỏ đến cửa sổ bên trái
Ctrl-W J    Di chuyển con trỏ đến cửa sổ bên dưới
Ctrl-W K    Di chuyển con trỏ đến cửa sổ bên trên
Ctrl-W L    Di chuyển con trỏ đến cửa sổ bên phải
```

Bây giờ chạy:

```shell
:vsplit file3.js
```

Bạn hiện đang thấy ba cửa sổ hiển thị ba bộ đệm. Một cửa sổ hiển thị bộ đệm `file3.js`, một cửa sổ khác hiển thị bộ đệm `file2.js`, và một cửa sổ khác hiển thị bộ đệm `file1.js`.

Bạn có thể có nhiều cửa sổ hiển thị cùng một bộ đệm. Khi bạn đang ở cửa sổ trên cùng bên trái, gõ:

```shell
:buffer file2.js
```

Bây giờ cả hai cửa sổ đều hiển thị bộ đệm `file2.js`. Nếu bạn bắt đầu gõ trên một cửa sổ `file2.js`, bạn sẽ thấy rằng cả hai cửa sổ hiển thị bộ đệm `file2.js` đều được cập nhật theo thời gian thực.

Để đóng cửa sổ hiện tại, bạn có thể chạy `Ctrl-W C` hoặc gõ `:quit`. Khi bạn đóng một cửa sổ, bộ đệm vẫn sẽ ở đó (chạy `:buffers` để xác nhận điều này).

Dưới đây là một số lệnh cửa sổ hữu ích trong chế độ bình thường:

```shell
Ctrl-W V    Mở một phân chia dọc mới
Ctrl-W S    Mở một phân chia ngang mới
Ctrl-W C    Đóng một cửa sổ
Ctrl-W O    Làm cho cửa sổ hiện tại là cửa sổ duy nhất trên màn hình và đóng các cửa sổ khác
```

Và đây là danh sách các lệnh dòng lệnh cửa sổ hữu ích:

```shell
:vsplit filename    Chia cửa sổ theo chiều dọc
:split filename     Chia cửa sổ theo chiều ngang
:new filename       Tạo cửa sổ mới
```

Hãy dành thời gian để hiểu chúng. Để biết thêm thông tin, hãy kiểm tra `:h window`.

## Tab

Một tab là một tập hợp các cửa sổ. Hãy nghĩ về nó như một bố cục cho các cửa sổ. Trong hầu hết các trình soạn thảo văn bản hiện đại (và các trình duyệt internet hiện đại), một tab có nghĩa là một tệp / trang mở và khi bạn đóng nó, tệp / trang đó sẽ biến mất. Trong Vim, một tab không đại diện cho một tệp đã mở. Khi bạn đóng một tab trong Vim, bạn không đóng một tệp. Bạn chỉ đang đóng bố cục. Các tệp mở trong bố cục đó vẫn chưa bị đóng, chúng vẫn mở trong các bộ đệm của chúng.

Hãy xem các tab trong Vim hoạt động. Mở `file1.js`:

```bash
vim file1.js
```

Để mở `file2.js` trong một tab mới:

```shell
:tabnew file2.js
```

Bạn cũng có thể để Vim tự động hoàn thành tệp bạn muốn mở trong một *tab mới* bằng cách nhấn `<Tab>` (không có ý định chơi chữ).

Dưới đây là danh sách các điều hướng tab hữu ích:

```shell
:tabnew file.txt    Mở file.txt trong một tab mới
:tabclose           Đóng tab hiện tại
:tabnext            Đi đến tab tiếp theo
:tabprevious        Đi đến tab trước đó
:tablast            Đi đến tab cuối cùng
:tabfirst           Đi đến tab đầu tiên
```

Bạn cũng có thể chạy `gt` để đi đến trang tab tiếp theo (bạn có thể đi đến tab trước đó với `gT`). Bạn có thể truyền số lượng như một đối số cho `gt`, trong đó số lượng là số tab. Để đi đến tab thứ ba, hãy làm `3gt`.

Một lợi thế của việc có nhiều tab là bạn có thể có các sắp xếp cửa sổ khác nhau trong các tab khác nhau. Có thể bạn muốn tab đầu tiên của mình có 3 cửa sổ dọc và tab thứ hai có một bố cục cửa sổ ngang và dọc hỗn hợp. Tab là công cụ hoàn hảo cho công việc này!

Để bắt đầu Vim với nhiều tab, bạn có thể làm điều này từ terminal:

```bash
vim -p file1.js file2.js file3.js
```

## Di chuyển trong không gian 3D

Di chuyển giữa các cửa sổ giống như di chuyển hai chiều theo trục X-Y trong tọa độ Đề-các. Bạn có thể di chuyển đến cửa sổ trên, bên phải, bên dưới và bên trái với `Ctrl-W H/J/K/L`.

Di chuyển giữa các bộ đệm giống như di chuyển qua trục Z trong tọa độ Đề-các. Hãy tưởng tượng các tệp bộ đệm của bạn xếp hàng dọc theo trục Z. Bạn có thể duyệt trục Z một bộ đệm tại một thời điểm với `:bnext` và `:bprevious`. Bạn có thể nhảy đến bất kỳ tọa độ nào trong trục Z với `:buffer filename/buffernumber`.

Bạn có thể di chuyển trong *không gian ba chiều* bằng cách kết hợp các chuyển động cửa sổ và bộ đệm. Bạn có thể di chuyển đến cửa sổ trên, bên phải, bên dưới hoặc bên trái (điều hướng X-Y) với các chuyển động cửa sổ. Vì mỗi cửa sổ chứa các bộ đệm, bạn có thể di chuyển tới và lui (điều hướng Z) với các chuyển động bộ đệm.

## Sử dụng Bộ đệm, Cửa sổ và Tab một cách Thông minh

Bạn đã học được bộ đệm, cửa sổ và tab là gì và chúng hoạt động như thế nào trong Vim. Bây giờ bạn đã hiểu rõ hơn về chúng, bạn có thể sử dụng chúng trong quy trình làm việc của riêng mình.

Mọi người có một quy trình làm việc khác nhau, đây là quy trình của tôi chẳng hạn:
- Đầu tiên, tôi sử dụng bộ đệm để lưu trữ tất cả các tệp cần thiết cho nhiệm vụ hiện tại. Vim có thể xử lý nhiều bộ đệm mở trước khi bắt đầu chậm lại. Hơn nữa, việc có nhiều bộ đệm mở sẽ không làm chật màn hình của tôi. Tôi chỉ thấy một bộ đệm (giả sử tôi chỉ có một cửa sổ) tại bất kỳ thời điểm nào, cho phép tôi tập trung vào một màn hình. Khi tôi cần đi đâu đó, tôi có thể nhanh chóng bay đến bất kỳ bộ đệm mở nào bất cứ lúc nào.
- Tôi sử dụng nhiều cửa sổ để xem nhiều bộ đệm cùng một lúc, thường là khi so sánh các tệp, đọc tài liệu hoặc theo dõi một luồng mã. Tôi cố gắng giữ số lượng cửa sổ mở không quá ba vì màn hình của tôi sẽ bị chật (tôi sử dụng một chiếc laptop nhỏ). Khi tôi hoàn thành, tôi đóng bất kỳ cửa sổ thừa nào. Ít cửa sổ có nghĩa là ít phân tâm hơn.
- Thay vì tab, tôi sử dụng các cửa sổ [tmux](https://github.com/tmux/tmux/wiki). Tôi thường sử dụng nhiều cửa sổ tmux cùng một lúc. Ví dụ, một cửa sổ tmux cho mã phía client và một cửa sổ khác cho mã phía backend.

Quy trình làm việc của tôi có thể trông khác với quy trình của bạn dựa trên phong cách chỉnh sửa của bạn và điều đó là bình thường. Hãy thử nghiệm để khám phá quy trình của riêng bạn, phù hợp với phong cách lập trình của bạn.