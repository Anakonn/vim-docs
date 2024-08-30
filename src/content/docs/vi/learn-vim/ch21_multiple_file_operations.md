---
description: Hướng dẫn cách chỉnh sửa nhiều tệp trong Vim với các lệnh như `argdo`,
  `bufdo`, `windo`, và nhiều lệnh khác để tối ưu hóa quy trình làm việc.
title: Ch21. Multiple File Operations
---

Có khả năng cập nhật trong nhiều tệp là một công cụ chỉnh sửa hữu ích khác để có. Trước đó, bạn đã học cách cập nhật nhiều văn bản với `cfdo`. Trong chương này, bạn sẽ học các cách khác nhau để chỉnh sửa nhiều tệp trong Vim.

## Các Cách Khác Nhau Để Thực Hiện Một Lệnh Trong Nhiều Tệp

Vim có tám cách để thực hiện các lệnh trên nhiều tệp:
- danh sách đối số (`argdo`)
- danh sách bộ đệm (`bufdo`)
- danh sách cửa sổ (`windo`)
- danh sách tab (`tabdo`)
- danh sách quickfix (`cdo`)
- danh sách quickfix theo tệp (`cfdo`)
- danh sách vị trí (`ldo`)
- danh sách vị trí theo tệp (`lfdo`)

Nói một cách thực tế, bạn có thể chỉ sử dụng một hoặc hai trong hầu hết thời gian (cá nhân tôi sử dụng `cdo` và `argdo` nhiều hơn những cái khác), nhưng tốt để tìm hiểu về tất cả các tùy chọn có sẵn và sử dụng những cái phù hợp với phong cách chỉnh sửa của bạn.

Học tám lệnh có thể nghe có vẻ đáng sợ. Nhưng trên thực tế, các lệnh này hoạt động tương tự. Sau khi học một lệnh, việc học các lệnh còn lại sẽ dễ dàng hơn. Tất cả chúng đều chia sẻ cùng một ý tưởng lớn: tạo một danh sách các danh mục tương ứng của chúng rồi truyền cho chúng lệnh mà bạn muốn chạy.

## Danh Sách Đối Số

Danh sách đối số là danh sách cơ bản nhất. Nó tạo ra một danh sách các tệp. Để tạo một danh sách file1, file2 và file3, bạn có thể chạy:

```shell
:args file1 file2 file3
```

Bạn cũng có thể truyền cho nó một ký tự đại diện (`*`), vì vậy nếu bạn muốn tạo một danh sách tất cả các tệp `.js` trong thư mục hiện tại, hãy chạy:

```shell
:args *.js
```

Nếu bạn muốn tạo một danh sách tất cả các tệp Javascript bắt đầu bằng "a" trong thư mục hiện tại, hãy chạy:

```shell
:args a*.js
```

Ký tự đại diện khớp với một hoặc nhiều ký tự tên tệp trong thư mục hiện tại, nhưng nếu bạn cần tìm kiếm đệ quy trong bất kỳ thư mục nào thì sao? Bạn có thể sử dụng ký tự đại diện đôi (`**`). Để lấy tất cả các tệp Javascript bên trong các thư mục trong vị trí hiện tại của bạn, hãy chạy:

```shell
:args **/*.js
```

Khi bạn chạy lệnh `args`, bộ đệm hiện tại của bạn sẽ chuyển sang mục đầu tiên trong danh sách. Để xem danh sách các tệp bạn vừa tạo, hãy chạy `:args`. Khi bạn đã tạo danh sách của mình, bạn có thể duyệt qua chúng. `:first` sẽ đưa bạn đến mục đầu tiên trong danh sách. `:last` sẽ đưa bạn đến mục cuối cùng. Để di chuyển danh sách tiến lên một tệp tại một thời điểm, hãy chạy `:next`. Để di chuyển danh sách lùi lại một tệp tại một thời điểm, hãy chạy `:prev`. Để di chuyển tiến lên / lùi lại một tệp tại một thời điểm và lưu các thay đổi, hãy chạy `:wnext` và `:wprev`. Còn nhiều lệnh điều hướng khác. Kiểm tra `:h arglist` để biết thêm.

Danh sách đối số rất hữu ích nếu bạn cần nhắm đến một loại tệp cụ thể hoặc một vài tệp. Có thể bạn cần cập nhật tất cả "donut" thành "pancake" trong tất cả các tệp `yml`, bạn có thể làm:

```shell
:args **/*.yml
:argdo %s/donut/pancake/g | update
```

Nếu bạn chạy lại lệnh `args`, nó sẽ thay thế danh sách trước đó. Ví dụ, nếu bạn đã chạy trước đó:

```shell
:args file1 file2 file3
```

Giả sử các tệp này tồn tại, bạn hiện có một danh sách `file1`, `file2` và `file3`. Sau đó bạn chạy lệnh này:

```shell
:args file4 file5
```

Danh sách ban đầu của bạn `file1`, `file2` và `file3` được thay thế bằng `file4` và `file5`. Nếu bạn có `file1`, `file2` và `file3` trong danh sách đối số của bạn và bạn muốn *thêm* `file4` và `file5` vào danh sách tệp ban đầu của bạn, hãy sử dụng lệnh `:arga`. Chạy:

```shell
:arga file4 file5
```

Bây giờ bạn có `file1`, `file2`, `file3`, `file4` và `file5` trong danh sách đối số của bạn.

Nếu bạn chạy `:arga` mà không có bất kỳ đối số nào, Vim sẽ thêm bộ đệm hiện tại của bạn vào danh sách đối số hiện tại. Nếu bạn đã có `file1`, `file2` và `file3` trong danh sách đối số và bộ đệm hiện tại của bạn đang ở `file5`, chạy `:arga` sẽ thêm `file5` vào danh sách.

Khi bạn đã có danh sách, bạn có thể truyền nó với bất kỳ lệnh dòng lệnh nào mà bạn chọn. Bạn đã thấy điều này được thực hiện với thay thế (`:argdo %s/donut/pancake/g`). Một số ví dụ khác:
- Để xóa tất cả các dòng chứa "dessert" trong danh sách đối số, hãy chạy `:argdo g/dessert/d`.
- Để thực hiện macro a (giả sử bạn đã ghi lại điều gì đó trong macro a) trong danh sách đối số, hãy chạy `:argdo norm @a`.
- Để viết "hello " theo sau là tên tệp trên dòng đầu tiên, hãy chạy `:argdo 0put='hello ' .. @:`.

Khi bạn đã xong, đừng quên lưu chúng với `:update`.

Đôi khi bạn cần chạy các lệnh chỉ trên n mục đầu tiên của danh sách đối số. Nếu đó là trường hợp, chỉ cần truyền cho lệnh `argdo` một địa chỉ. Ví dụ, để chạy lệnh thay thế chỉ trên 3 mục đầu tiên từ danh sách, hãy chạy `:1,3argdo %s/donut/pancake/g`.

## Danh Sách Bộ Đệm

Danh sách bộ đệm sẽ được tạo ra một cách tự nhiên khi bạn chỉnh sửa các tệp mới vì mỗi khi bạn tạo một tệp mới / mở một tệp, Vim sẽ lưu nó trong một bộ đệm (trừ khi bạn xóa nó một cách rõ ràng). Vì vậy, nếu bạn đã mở 3 tệp: `file1.rb file2.rb file3.rb`, bạn đã có 3 mục trong danh sách bộ đệm của mình. Để hiển thị danh sách bộ đệm, hãy chạy `:buffers` (hoặc: `:ls` hoặc `:files`). Để duyệt qua lại, sử dụng `:bnext` và `:bprev`. Để đi đến bộ đệm đầu tiên và cuối cùng từ danh sách, sử dụng `:bfirst` và `:blast` (có vui không? :D).

Nhân tiện, đây là một mẹo bộ đệm thú vị không liên quan đến chương này: nếu bạn có một số mục trong danh sách bộ đệm của bạn, bạn có thể hiển thị tất cả chúng với `:ball` (tất cả bộ đệm). Lệnh `ball` hiển thị tất cả các bộ đệm theo chiều ngang. Để hiển thị chúng theo chiều dọc, hãy chạy `:vertical ball`.

Quay lại chủ đề, cơ chế để thực hiện hoạt động trên tất cả các bộ đệm tương tự như danh sách đối số. Khi bạn đã tạo danh sách bộ đệm của mình, bạn chỉ cần thêm lệnh mà bạn muốn chạy với `:bufdo` thay vì `:argdo`. Vì vậy, nếu bạn muốn thay thế tất cả "donut" bằng "pancake" trên tất cả các bộ đệm và sau đó lưu các thay đổi, hãy chạy `:bufdo %s/donut/pancake/g | update`.

## Danh Sách Cửa Sổ và Tab

Danh sách cửa sổ và tab cũng tương tự như danh sách đối số và danh sách bộ đệm. Sự khác biệt duy nhất là ngữ cảnh và cú pháp của chúng.

Các thao tác trên cửa sổ được thực hiện trên mỗi cửa sổ mở và được thực hiện với `:windo`. Các thao tác trên tab được thực hiện trên mỗi tab mà bạn đã mở và được thực hiện với `:tabdo`. Để biết thêm, hãy kiểm tra `:h list-repeat`, `:h :windo`, và `:h :tabdo`.

Ví dụ, nếu bạn có ba cửa sổ mở (bạn có thể mở cửa sổ mới với `Ctrl-W v` cho cửa sổ dọc và `Ctrl-W s` cho cửa sổ ngang) và bạn chạy `:windo 0put ='hello' . @%`, Vim sẽ xuất "hello" + tên tệp đến tất cả các cửa sổ mở.

## Danh Sách Quickfix

Trong các chương trước (Ch3 và Ch19), tôi đã nói về quickfixes. Quickfix có nhiều công dụng. Nhiều plugin phổ biến sử dụng quickfixes, vì vậy tốt để dành thêm thời gian để hiểu chúng.

Nếu bạn mới với Vim, quickfix có thể là một khái niệm mới. Trở lại những ngày xưa khi bạn thực sự phải biên dịch mã của mình một cách rõ ràng, trong quá trình biên dịch, bạn sẽ gặp lỗi. Để hiển thị những lỗi này, bạn cần một cửa sổ đặc biệt. Đó là nơi quickfix xuất hiện. Khi bạn biên dịch mã của mình, Vim hiển thị thông báo lỗi trong cửa sổ quickfix để bạn có thể sửa chúng sau. Nhiều ngôn ngữ hiện đại không yêu cầu biên dịch rõ ràng nữa, nhưng điều đó không làm cho quickfix trở nên lỗi thời. Ngày nay, mọi người sử dụng quickfix cho đủ loại thứ, như hiển thị đầu ra của một terminal ảo và lưu trữ kết quả tìm kiếm. Hãy tập trung vào cái sau, lưu trữ kết quả tìm kiếm.

Ngoài các lệnh biên dịch, một số lệnh Vim phụ thuộc vào giao diện quickfix. Một loại lệnh sử dụng quickfixes rất nhiều là các lệnh tìm kiếm. Cả `:vimgrep` và `:grep` đều sử dụng quickfixes theo mặc định.

Ví dụ, nếu bạn cần tìm kiếm "donut" trong tất cả các tệp Javascript một cách đệ quy, bạn có thể chạy:

```shell
:vimgrep /donut/ **/*.js
```

Kết quả cho tìm kiếm "donut" được lưu trữ trong cửa sổ quickfix. Để xem các kết quả khớp trong cửa sổ quickfix, hãy chạy:

```shell
:copen
```

Để đóng nó, hãy chạy:

```shell
:cclose
```

Để duyệt danh sách quickfix tiến lên và lùi lại, hãy chạy:

```shell
:cnext
:cprev
```

Để đi đến mục đầu tiên và cuối cùng trong kết quả khớp, hãy chạy:

```shell
:cfirst
:clast
```

Trước đó, tôi đã đề cập rằng có hai lệnh quickfix: `cdo` và `cfdo`. Chúng khác nhau như thế nào? `cdo` thực hiện lệnh cho mỗi mục trong danh sách quickfix trong khi `cfdo` thực hiện lệnh cho mỗi *tệp* trong danh sách quickfix.

Để tôi làm rõ. Giả sử rằng sau khi chạy lệnh `vimgrep` ở trên, bạn tìm thấy:
- 1 kết quả trong `file1.js`
- 10 kết quả trong `file2.js`

Nếu bạn chạy `:cfdo %s/donut/pancake/g`, điều này sẽ thực sự chạy `%s/donut/pancake/g` một lần trong `file1.js` và một lần trong `file2.js`. Nó chạy *bằng số lần có tệp trong kết quả.* Vì có hai tệp trong kết quả, Vim thực hiện lệnh thay thế một lần trên `file1.js` và một lần nữa trên `file2.js`, mặc dù có 10 kết quả khớp trong tệp thứ hai. `cfdo` chỉ quan tâm đến số lượng tệp tổng cộng trong danh sách quickfix.

Nếu bạn chạy `:cdo %s/donut/pancake/g`, điều này sẽ thực sự chạy `%s/donut/pancake/g` một lần trong `file1.js` và *mười lần* trong `file2.js`. Nó chạy bằng số lần có các mục thực tế trong danh sách quickfix. Vì chỉ có một kết quả khớp trong `file1.js` và 10 kết quả khớp trong `file2.js`, nó sẽ chạy tổng cộng 11 lần.

Vì bạn đã chạy `%s/donut/pancake/g`, sẽ hợp lý hơn khi sử dụng `cfdo`. Không hợp lý khi sử dụng `cdo` vì nó sẽ chạy `%s/donut/pancake/g` mười lần trong `file2.js` (`%s` là một thay thế toàn bộ tệp). Chạy `%s` một lần cho mỗi tệp là đủ. Nếu bạn sử dụng `cdo`, sẽ hợp lý hơn khi truyền nó với `s/donut/pancake/g` thay vì.

Khi quyết định xem có nên sử dụng `cfdo` hay `cdo`, hãy nghĩ về phạm vi lệnh mà bạn đang truyền cho nó. Đây có phải là một lệnh toàn bộ tệp (như `:%s` hoặc `:g`) hay là một lệnh theo dòng (như `:s` hoặc `:!`)?

## Danh Sách Vị Trí

Danh sách vị trí tương tự như danh sách quickfix ở chỗ Vim cũng sử dụng một cửa sổ đặc biệt để hiển thị thông điệp. Sự khác biệt giữa danh sách quickfix và danh sách vị trí là tại bất kỳ thời điểm nào, bạn chỉ có thể có một danh sách quickfix, trong khi bạn có thể có nhiều danh sách vị trí như số cửa sổ.

Giả sử rằng bạn có hai cửa sổ mở, một cửa sổ hiển thị `food.txt` và một cửa sổ khác hiển thị `drinks.txt`. Từ bên trong `food.txt`, bạn chạy một lệnh tìm kiếm danh sách vị trí `:lvimgrep` (biến thể vị trí cho lệnh `:vimgrep`):

```shell
:lvim /bagel/ **/*.md
```

Vim sẽ tạo một danh sách vị trí của tất cả các kết quả tìm kiếm bagel cho *cửa sổ food.txt* đó. Bạn có thể xem danh sách vị trí với `:lopen`. Bây giờ hãy chuyển đến cửa sổ khác `drinks.txt` và chạy:

```shell
:lvimgrep /milk/ **/*.md
```

Vim sẽ tạo một danh sách vị trí *tách biệt* với tất cả các kết quả tìm kiếm milk cho *cửa sổ drinks.txt* đó.

Đối với mỗi lệnh danh sách vị trí mà bạn chạy trong mỗi cửa sổ, Vim tạo ra một danh sách vị trí riêng biệt. Nếu bạn có 10 cửa sổ khác nhau, bạn có thể có tối đa 10 danh sách vị trí khác nhau. So sánh điều này với danh sách quickfix, nơi bạn chỉ có thể có một danh sách tại bất kỳ thời điểm nào. Nếu bạn có 10 cửa sổ khác nhau, bạn vẫn chỉ có một danh sách quickfix.

Hầu hết các lệnh danh sách vị trí tương tự như các lệnh quickfix ngoại trừ việc chúng được tiền tố bằng `l-`. Ví dụ: `:lvimgrep`, `:lgrep`, và `:lmake` so với `:vimgrep`, `:grep`, và `:make`. Để thao tác với cửa sổ danh sách vị trí, một lần nữa, các lệnh trông giống như các lệnh quickfix `:lopen`, `:lclose`, `:lfirst`, `:llast`, `:lnext`, và `:lprev` so với `:copen`, `:cclose`, `:cfirst`, `:clast`, `:cnext`, và `:cprev`.

Hai lệnh đa tệp danh sách vị trí cũng tương tự như các lệnh đa tệp quickfix: `:ldo` và `:lfdo`. `:ldo` thực hiện lệnh vị trí trong mỗi danh sách vị trí trong khi `:lfdo` thực hiện lệnh danh sách vị trí cho mỗi tệp trong danh sách vị trí. Để biết thêm, hãy kiểm tra `:h location-list`.
## Thực hiện các thao tác với nhiều tệp trong Vim

Biết cách thực hiện thao tác với nhiều tệp là một kỹ năng hữu ích trong việc chỉnh sửa. Mỗi khi bạn cần thay đổi tên biến trong nhiều tệp, bạn muốn thực hiện chúng trong một lần. Vim có tám cách khác nhau để bạn có thể làm điều này.

Nói một cách thực tế, bạn có thể sẽ không sử dụng tất cả tám cách một cách đồng đều. Bạn sẽ nghiêng về một hoặc hai cách. Khi bạn mới bắt đầu, hãy chọn một cách (tôi cá nhân gợi ý bắt đầu với danh sách arg `:argdo`) và làm chủ nó. Khi bạn đã thoải mái với một cách, hãy học cách tiếp theo. Bạn sẽ thấy rằng việc học cách thứ hai, thứ ba, thứ tư trở nên dễ dàng hơn. Hãy sáng tạo. Sử dụng nó với các kết hợp khác nhau. Tiếp tục luyện tập cho đến khi bạn có thể làm điều này một cách dễ dàng và không cần suy nghĩ nhiều. Biến nó thành một phần của trí nhớ cơ bắp của bạn.

Với điều đó đã nói, bạn đã làm chủ việc chỉnh sửa trong Vim. Chúc mừng bạn!