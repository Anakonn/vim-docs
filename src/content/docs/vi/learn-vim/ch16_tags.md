---
description: Tài liệu này hướng dẫn cách sử dụng Vim tags để nhanh chóng tìm kiếm
  định nghĩa trong mã nguồn, giúp hiểu rõ hơn về các đoạn mã.
title: Ch16. Tags
---

Một tính năng hữu ích trong việc chỉnh sửa văn bản là khả năng nhanh chóng đến bất kỳ định nghĩa nào. Trong chương này, bạn sẽ học cách sử dụng thẻ Vim để làm điều đó.

## Tổng quan về Thẻ

Giả sử ai đó đã đưa cho bạn một mã nguồn mới:

```shell
one = One.new
one.donut
```

`One`? `donut`? Chà, những điều này có thể đã rõ ràng đối với các nhà phát triển viết mã từ lâu, nhưng giờ đây những nhà phát triển đó không còn ở đây và bạn phải hiểu những mã khó hiểu này. Một cách để giúp hiểu điều này là theo dõi mã nguồn nơi `One` và `donut` được định nghĩa.

Bạn có thể tìm kiếm chúng bằng `fzf` hoặc `grep` (hoặc `vimgrep`), nhưng trong trường hợp này, thẻ nhanh hơn.

Hãy nghĩ về thẻ như một cuốn sổ địa chỉ:

```shell
Name    Address
Iggy1   1234 Cool St, 11111
Iggy2   9876 Awesome Ave, 2222
```

Thay vì có một cặp tên-địa chỉ, thẻ lưu trữ các định nghĩa kết hợp với địa chỉ.

Giả sử bạn có hai tệp Ruby này trong cùng một thư mục:

```shell
## one.rb
class One
  def initialize
    puts "Initialized"
  end

  def donut
    puts "Bar"
  end
end
```

và

```shell
## two.rb
require './one'

one = One.new
one.donut
```

Để nhảy đến một định nghĩa, bạn có thể sử dụng `Ctrl-]` trong chế độ bình thường. Trong `two.rb`, hãy đến dòng nơi có `one.donut` và di chuyển con trỏ qua `donut`. Nhấn `Ctrl-]`.

Ôi, Vim không thể tìm thấy tệp thẻ. Bạn cần tạo tệp thẻ trước.

## Trình tạo Thẻ

Vim hiện đại không đi kèm với trình tạo thẻ, vì vậy bạn sẽ phải tải xuống một trình tạo thẻ bên ngoài. Có một số tùy chọn để chọn:

- ctags = Chỉ C. Có sẵn hầu như ở mọi nơi.
- exuberant ctags = Một trong những cái phổ biến nhất. Có hỗ trợ nhiều ngôn ngữ.
- universal ctags = Tương tự như exuberant ctags, nhưng mới hơn.
- etags = Dành cho Emacs. Hmm...
- JTags = Java
- ptags.py = Python
- ptags = Perl
- gnatxref = Ada

Nếu bạn xem các hướng dẫn Vim trực tuyến, nhiều người sẽ khuyên dùng [exuberant ctags](http://ctags.sourceforge.net/). Nó hỗ trợ [41 ngôn ngữ lập trình](http://ctags.sourceforge.net/languages.html). Tôi đã sử dụng nó và nó hoạt động rất tốt. Tuy nhiên, vì nó không được duy trì từ năm 2009, Universal ctags sẽ là lựa chọn tốt hơn. Nó hoạt động tương tự như exuberant ctags và hiện đang được duy trì.

Tôi sẽ không đi vào chi tiết về cách cài đặt universal ctags. Hãy xem [universal ctags](https://github.com/universal-ctags/ctags) để biết thêm hướng dẫn.

Giả sử bạn đã cài đặt universal ctags, hãy tạo một tệp thẻ cơ bản. Chạy:

```shell
ctags -R .
```

Tùy chọn `R` cho ctags biết để thực hiện quét đệ quy từ vị trí hiện tại của bạn (`.`). Bạn sẽ thấy một tệp `tags` trong thư mục hiện tại của bạn. Bên trong bạn sẽ thấy điều gì đó như thế này:

```shell
!_TAG_FILE_FORMAT	2	/định dạng mở rộng; --format=1 sẽ không thêm ;" vào các dòng/
!_TAG_FILE_SORTED	1	/0=không sắp xếp, 1=sắp xếp, 2=không phân biệt chữ hoa chữ thường/
!_TAG_OUTPUT_FILESEP	slash	/slash hoặc backslash/
!_TAG_OUTPUT_MODE	u-ctags	/u-ctags hoặc e-ctags/
!_TAG_PATTERN_LENGTH_LIMIT	96	/0 không giới hạn/
!_TAG_PROGRAM_AUTHOR	Universal Ctags Team	//
!_TAG_PROGRAM_NAME	Universal Ctags	/Derived from Exuberant Ctags/
!_TAG_PROGRAM_URL	<https://ctags.io/>	/trang chính thức/
!_TAG_PROGRAM_VERSION	0.0.0	/b43eb39/
One	one.rb	/^class One$/;"	c
donut	one.rb	/^  def donut$/;"	f	class:One
initialize	one.rb	/^  def initialize$/;"	f	class:One
```

Của bạn có thể trông hơi khác một chút tùy thuộc vào cài đặt Vim của bạn và trình tạo ctags. Một tệp thẻ được cấu thành từ hai phần: siêu dữ liệu thẻ và danh sách thẻ. Các siêu dữ liệu này (`!TAG_FILE...`) thường được kiểm soát bởi trình tạo ctags. Tôi sẽ không thảo luận về điều đó ở đây, nhưng bạn có thể kiểm tra tài liệu của họ để biết thêm! Danh sách thẻ là danh sách tất cả các định nghĩa được lập chỉ mục bởi ctags.

Bây giờ hãy đến `two.rb`, đặt con trỏ trên `donut`, và gõ `Ctrl-]`. Vim sẽ đưa bạn đến tệp `one.rb` ở dòng nơi có `def donut`. Thành công! Nhưng làm thế nào Vim làm điều này?

## Cấu trúc Thẻ

Hãy xem mục thẻ `donut`:

```shell
donut	one.rb	/^  def donut$/;"	f	class:One
```

Mục thẻ trên được cấu thành từ bốn thành phần: một `tagname`, một `tagfile`, một `tagaddress`, và các tùy chọn thẻ.
- `donut` là `tagname`. Khi con trỏ của bạn ở trên "donut", Vim tìm kiếm tệp thẻ để tìm một dòng có chuỗi "donut".
- `one.rb` là `tagfile`. Vim tìm kiếm một tệp `one.rb`.
- `/^ def donut$/` là `tagaddress`. `/.../` là một chỉ báo mẫu. `^` là một mẫu cho phần tử đầu tiên trên một dòng. Nó được theo sau bởi hai khoảng trắng, sau đó là chuỗi `def donut`. Cuối cùng, `$` là một mẫu cho phần tử cuối cùng trên một dòng.
- `f class:One` là tùy chọn thẻ cho Vim biết rằng hàm `donut` là một hàm (`f`) và là một phần của lớp `One`.

Hãy xem một mục khác trong danh sách thẻ:

```shell
One	one.rb	/^class One$/;"	c
```

Dòng này hoạt động giống như mẫu `donut`:

- `One` là `tagname`. Lưu ý rằng với các thẻ, lần quét đầu tiên phân biệt chữ hoa chữ thường. Nếu bạn có `One` và `one` trong danh sách, Vim sẽ ưu tiên `One` hơn `one`.
- `one.rb` là `tagfile`. Vim tìm kiếm một tệp `one.rb`.
- `/^class One$/` là mẫu `tagaddress`. Vim tìm kiếm một dòng bắt đầu bằng (`^`) `class` và kết thúc bằng (`$`) `One`.
- `c` là một trong những tùy chọn thẻ có thể có. Vì `One` là một lớp ruby chứ không phải một quy trình, nó được đánh dấu bằng `c`.

Tùy thuộc vào trình tạo thẻ mà bạn sử dụng, nội dung của tệp thẻ của bạn có thể trông khác nhau. Tối thiểu, một tệp thẻ phải có một trong những định dạng này:

```shell
1.  {tagname} {TAB} {tagfile} {TAB} {tagaddress}
2.  {tagname} {TAB} {tagfile} {TAB} {tagaddress} {term} {field} ..
```

## Tệp Thẻ

Bạn đã học rằng một tệp mới, `tags`, được tạo ra sau khi chạy `ctags -R .`. Vim biết tìm tệp thẻ ở đâu?

Nếu bạn chạy `:set tags?`, bạn có thể thấy `tags=./tags,tags` (tùy thuộc vào cài đặt Vim của bạn, nó có thể khác). Ở đây Vim tìm kiếm tất cả các thẻ trong đường dẫn của tệp hiện tại trong trường hợp `./tags` và thư mục hiện tại (gốc dự án của bạn) trong trường hợp `tags`.

Cũng trong trường hợp `./tags`, Vim sẽ trước tiên tìm kiếm một tệp thẻ bên trong đường dẫn của tệp hiện tại của bạn bất kể nó được lồng ghép như thế nào, sau đó nó sẽ tìm kiếm một tệp thẻ của thư mục hiện tại (gốc dự án). Vim dừng lại sau khi tìm thấy lần khớp đầu tiên.

Nếu tệp `'tags'` của bạn nói `tags=./tags,tags,/user/iggy/mytags/tags`, thì Vim cũng sẽ tìm kiếm trong thư mục `/user/iggy/mytags` để tìm một tệp thẻ sau khi Vim hoàn thành việc tìm kiếm thư mục `./tags` và `tags`. Bạn không cần phải lưu tệp thẻ của mình bên trong dự án, bạn có thể giữ chúng tách biệt.

Để thêm một vị trí tệp thẻ mới, hãy sử dụng:

```shell
set tags+=path/to/my/tags/file
```

## Tạo Thẻ cho một Dự án Lớn

Nếu bạn cố gắng chạy ctags trong một dự án lớn, có thể mất nhiều thời gian vì Vim cũng tìm kiếm bên trong mọi thư mục lồng ghép. Nếu bạn là một nhà phát triển Javascript, bạn biết rằng `node_modules` có thể rất lớn. Hãy tưởng tượng nếu bạn có năm dự án con và mỗi cái chứa thư mục `node_modules` của riêng nó. Nếu bạn chạy `ctags -R .`, ctags sẽ cố gắng quét qua tất cả 5 `node_modules`. Bạn có thể không cần phải chạy ctags trên `node_modules`.

Để chạy ctags loại trừ `node_modules`, hãy chạy:

```shell
ctags -R --exclude=node_modules .
```

Lần này nó sẽ mất chưa đến một giây. Nhân tiện, bạn có thể sử dụng tùy chọn `exclude` nhiều lần:

```shell
ctags -R --exclude=.git --exclude=vendor --exclude=node_modules --exclude=db --exclude=log .
```

Điều quan trọng là, nếu bạn muốn bỏ qua một thư mục, `--exclude` là người bạn tốt nhất của bạn.

## Điều Hướng Thẻ

Bạn có thể sử dụng chỉ `Ctrl-]` để có được quãng đường tốt, nhưng hãy học một vài mẹo nữa. Phím nhảy thẻ `Ctrl-]` có một chế độ dòng lệnh thay thế: `:tag {tag-name}`. Nếu bạn chạy:

```shell
:tag donut
```

Vim sẽ nhảy đến phương thức `donut`, giống như việc thực hiện `Ctrl-]` trên chuỗi "donut". Bạn cũng có thể tự động hoàn thành đối số với `<Tab>`:

```shell
:tag d<Tab>
```

Vim liệt kê tất cả các thẻ bắt đầu bằng "d". Trong trường hợp này, "donut".

Trong một dự án thực tế, bạn có thể gặp nhiều phương thức có cùng tên. Hãy cập nhật hai tệp ruby từ trước. Trong `one.rb`:

```shell
## one.rb
class One
  def initialize
    puts "Initialized"
  end

  def donut
    puts "one donut"
  end

  def pancake
    puts "one pancake"
  end
end
```

Trong `two.rb`:

```shell
## two.rb
require './one.rb'

def pancake
  "Two pancakes"
end

one = One.new
one.donut
puts pancake
```

Nếu bạn đang lập trình theo, đừng quên chạy `ctags -R .` một lần nữa vì bây giờ bạn có một số quy trình mới. Bạn có hai thể hiện của quy trình `pancake`. Nếu bạn đang ở trong `two.rb` và bạn nhấn `Ctrl-]`, điều gì sẽ xảy ra?

Vim sẽ nhảy đến `def pancake` trong `two.rb`, không phải `def pancake` trong `one.rb`. Điều này là vì Vim xem quy trình `pancake` trong `two.rb` có độ ưu tiên cao hơn quy trình `pancake` khác.

## Độ Ưu Tiên của Thẻ

Không phải tất cả các thẻ đều bình đẳng. Một số thẻ có độ ưu tiên cao hơn. Nếu Vim gặp phải các tên mục trùng lặp, Vim kiểm tra độ ưu tiên của từ khóa. Thứ tự là:

1. Một thẻ tĩnh khớp hoàn toàn trong tệp hiện tại.
2. Một thẻ toàn cầu khớp hoàn toàn trong tệp hiện tại.
3. Một thẻ toàn cầu khớp hoàn toàn trong một tệp khác.
4. Một thẻ tĩnh khớp hoàn toàn trong một tệp khác.
5. Một thẻ tĩnh khớp không phân biệt chữ hoa chữ thường trong tệp hiện tại.
6. Một thẻ toàn cầu khớp không phân biệt chữ hoa chữ thường trong tệp hiện tại.
7. Một thẻ toàn cầu khớp không phân biệt chữ hoa chữ thường trong một tệp khác.
8. Một thẻ tĩnh khớp không phân biệt chữ hoa chữ thường trong tệp hiện tại.

Theo danh sách ưu tiên, Vim ưu tiên khớp chính xác được tìm thấy trên cùng một tệp. Đó là lý do tại sao Vim chọn quy trình `pancake` trong `two.rb` hơn quy trình `pancake` trong `one.rb`. Có một số ngoại lệ đối với danh sách ưu tiên trên tùy thuộc vào cài đặt `'tagcase'`, `'ignorecase'`, và `'smartcase'`, nhưng tôi sẽ không thảo luận về chúng ở đây. Nếu bạn quan tâm, hãy kiểm tra `:h tag-priority`.

## Nhảy Thẻ Chọn Lọc

Sẽ thật tuyệt nếu bạn có thể chọn mục thẻ nào để nhảy đến thay vì luôn đến mục thẻ có độ ưu tiên cao nhất. Có thể bạn thực sự cần nhảy đến phương thức `pancake` trong `one.rb` và không phải trong `two.rb`. Để làm điều đó, bạn có thể sử dụng `:tselect`. Chạy:

```shell
:tselect pancake
```

Bạn sẽ thấy, ở dưới cùng của màn hình:
## nhãn pri kind               tệp
1 F C f    pancake           two.rb
             def pancake
2 F   f    pancake           one.rb
             class:One
             def pancake
```

Nếu bạn gõ 2, Vim sẽ nhảy đến thủ tục trong `one.rb`. Nếu bạn gõ 1, Vim sẽ nhảy đến thủ tục trong `two.rb`.

Hãy chú ý đến cột `pri`. Bạn có `F C` ở lần khớp đầu tiên và `F` ở lần khớp thứ hai. Đây là cách Vim sử dụng để xác định độ ưu tiên của nhãn. `F C` có nghĩa là một nhãn toàn bộ khớp (`F`) trong tệp hiện tại (`C`). `F` có nghĩa là chỉ một nhãn toàn bộ khớp (`F`). `F C` luôn có độ ưu tiên cao hơn `F`.

Nếu bạn chạy `:tselect donut`, Vim cũng sẽ yêu cầu bạn chọn mục nhãn nào để nhảy đến, mặc dù chỉ có một tùy chọn để chọn. Có cách nào để Vim chỉ yêu cầu danh sách nhãn nếu có nhiều khớp và nhảy ngay lập tức nếu chỉ tìm thấy một nhãn không?

Tất nhiên! Vim có phương pháp `:tjump`. Chạy:

```shell
:tjump donut
```

Vim sẽ ngay lập tức nhảy đến thủ tục `donut` trong `one.rb`, giống như chạy `:tag donut`. Bây giờ chạy:

```shell
:tjump pancake
```

Vim sẽ yêu cầu bạn chọn tùy chọn nhãn, giống như chạy `:tselect pancake`. Với `tjump`, bạn có được những điều tốt nhất của cả hai phương pháp.

Vim có một phím chế độ bình thường cho `tjump`: `g Ctrl-]`. Cá nhân tôi thích `g Ctrl-]` hơn `Ctrl-]`.

## Tự động hoàn thành với Nhãn

Nhãn có thể hỗ trợ hoàn thành tự động. Nhớ lại từ chương 6, Chế độ Chèn, rằng bạn có thể sử dụng chế độ phụ `Ctrl-X` để thực hiện nhiều hoàn thành tự động khác nhau. Một chế độ phụ hoàn thành tự động mà tôi chưa đề cập là `Ctrl-]`. Nếu bạn thực hiện `Ctrl-X Ctrl-]` trong chế độ chèn, Vim sẽ sử dụng tệp nhãn để hoàn thành tự động.

Nếu bạn vào chế độ chèn và gõ `Ctrl-x Ctrl-]`, bạn sẽ thấy:

```shell
One
donut
initialize
pancake
```

## Ngăn xếp Nhãn

Vim giữ một danh sách tất cả các nhãn mà bạn đã nhảy đến và từ trong một ngăn xếp nhãn. Bạn có thể xem ngăn xếp này với `:tags`. Nếu bạn đã nhảy nhãn đầu tiên đến `pancake`, tiếp theo là `donut`, và chạy `:tags`, bạn sẽ thấy:

```shell
  # ĐẾN nhãn         TỪ dòng  trong tệp/văn bản
  1  1 pancake            10  ch16_tags/two.rb
  2  1 donut               9  ch16_tags/two.rb
>
```

Lưu ý ký hiệu `>` ở trên. Nó cho thấy vị trí hiện tại của bạn trong ngăn xếp. Để "pop" ngăn xếp để quay lại một ngăn xếp trước đó, bạn có thể chạy `:pop`. Thử nó, sau đó chạy `:tags` một lần nữa:

```shell
  # ĐẾN nhãn         TỪ dòng  trong tệp/văn bản
  1  1 pancake            10  puts pancake
> 2  1 donut               9  one.donut

```

Lưu ý rằng ký hiệu `>` hiện đang ở dòng hai, nơi có `donut`. `pop` thêm một lần nữa, sau đó chạy `:tags` một lần nữa:

```shell
  # ĐẾN nhãn         TỪ dòng  trong tệp/văn bản
> 1  1 pancake            10  puts pancake
  2  1 donut               9  one.donut
```

Trong chế độ bình thường, bạn có thể chạy `Ctrl-t` để đạt được hiệu ứng tương tự như `:pop`.

## Tạo Nhãn Tự Động

Một trong những nhược điểm lớn nhất của nhãn Vim là mỗi lần bạn thực hiện một thay đổi đáng kể, bạn phải tái tạo tệp nhãn. Nếu bạn gần đây đã đổi tên thủ tục `pancake` thành thủ tục `waffle`, tệp nhãn không biết rằng thủ tục `pancake` đã được đổi tên. Nó vẫn lưu trữ `pancake` trong danh sách nhãn. Bạn phải chạy `ctags -R .` để tạo một tệp nhãn cập nhật. Tạo lại một tệp nhãn mới theo cách này có thể rất phiền phức.

May mắn thay, có một số phương pháp bạn có thể sử dụng để tạo nhãn tự động.

## Tạo Nhãn Khi Lưu

Vim có một phương pháp lệnh tự động (`autocmd`) để thực hiện bất kỳ lệnh nào khi có sự kiện kích hoạt. Bạn có thể sử dụng điều này để tạo nhãn mỗi khi lưu. Chạy:

```shell
:autocmd BufWritePost *.rb silent !ctags -R .
```

Phân tích:
- `autocmd` là một lệnh dòng lệnh. Nó chấp nhận một sự kiện, mẫu tệp và một lệnh.
- `BufWritePost` là một sự kiện cho việc lưu một bộ đệm. Mỗi lần bạn lưu một tệp, bạn kích hoạt một sự kiện `BufWritePost`.
- `.rb` là một mẫu tệp cho các tệp ruby.
- `silent` thực sự là một phần của lệnh bạn đang truyền. Nếu không có điều này, Vim sẽ hiển thị `nhấn ENTER hoặc gõ lệnh để tiếp tục` mỗi lần bạn kích hoạt lệnh tự động.
- `!ctags -R .` là lệnh để thực hiện. Nhớ rằng `!cmd` từ bên trong Vim thực hiện lệnh terminal.

Bây giờ mỗi lần bạn lưu từ bên trong một tệp ruby, Vim sẽ chạy `ctags -R .`.

## Sử Dụng Plugin

Có một số plugin để tạo ctags tự động:

- [vim-gutentags](https://github.com/ludovicchabant/vim-gutentags)
- [vim-tags](https://github.com/szw/vim-tags)
- [vim-easytags](https://github.com/xolox/vim-easytags)
- [vim-autotag](https://github.com/craigemery/vim-autotag)

Tôi sử dụng vim-gutentags. Nó rất đơn giản để sử dụng và sẽ hoạt động ngay lập tức.

## Ctags và Git Hooks

Tim Pope, tác giả của nhiều plugin Vim tuyệt vời, đã viết một blog gợi ý sử dụng git hooks. [Xem nó](https://tbaggery.com/2011/08/08/effortless-ctags-with-git.html).

## Học Nhãn Một Cách Thông Minh

Một nhãn hữu ích khi được cấu hình đúng cách. Giả sử bạn đang đối mặt với một mã nguồn mới và bạn muốn hiểu `functionFood` làm gì, bạn có thể dễ dàng đọc nó bằng cách nhảy đến định nghĩa của nó. Bên trong, bạn học rằng nó cũng gọi `functionBreakfast`. Bạn theo dõi nó và bạn học rằng nó gọi `functionPancake`. Đồ thị gọi hàm của bạn trông như thế này:

```shell
functionFood -> functionBreakfast -> functionPancake
```

Điều này cho bạn cái nhìn rằng dòng mã này liên quan đến việc có một cái bánh pancake cho bữa sáng.

Để tìm hiểu thêm về nhãn, hãy kiểm tra `:h tags`. Bây giờ bạn đã biết cách sử dụng nhãn, hãy khám phá một tính năng khác: gập.