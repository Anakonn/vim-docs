---
description: 'Hướng dẫn sử dụng chế độ trực quan trong Vim để thao tác văn bản hiệu
  quả, bao gồm ba chế độ: ký tự, dòng và khối.'
title: Ch11. Visual Mode
---

Việc làm nổi bật và áp dụng thay đổi cho một đoạn văn bản là một tính năng phổ biến trong nhiều trình soạn thảo văn bản và bộ xử lý văn bản. Vim có thể làm điều này bằng cách sử dụng chế độ hình ảnh. Trong chương này, bạn sẽ học cách sử dụng chế độ hình ảnh để thao tác văn bản một cách hiệu quả.

## Ba loại chế độ hình ảnh

Vim có ba chế độ hình ảnh khác nhau. Chúng là:

```shell
v         Chế độ hình ảnh theo ký tự
V         Chế độ hình ảnh theo dòng
Ctrl-V    Chế độ hình ảnh theo khối
```

Nếu bạn có văn bản:

```shell
one
two
three
```

Chế độ hình ảnh theo ký tự hoạt động với các ký tự riêng lẻ. Nhấn `v` trên ký tự đầu tiên. Sau đó, đi xuống dòng tiếp theo với `j`. Nó sẽ làm nổi bật tất cả văn bản từ "one" đến vị trí con trỏ của bạn. Nếu bạn nhấn `gU`, Vim sẽ chuyển đổi các ký tự được làm nổi bật thành chữ hoa.

Chế độ hình ảnh theo dòng hoạt động với các dòng. Nhấn `V` và xem Vim chọn toàn bộ dòng mà con trỏ của bạn đang ở. Giống như chế độ hình ảnh theo ký tự, nếu bạn chạy `gU`, Vim sẽ chuyển đổi các ký tự được làm nổi bật thành chữ hoa.

Chế độ hình ảnh theo khối hoạt động với các hàng và cột. Nó cho bạn nhiều tự do di chuyển hơn hai chế độ còn lại. Nếu bạn nhấn `Ctrl-V`, Vim sẽ làm nổi bật ký tự dưới con trỏ giống như chế độ hình ảnh theo ký tự, ngoại trừ việc thay vì làm nổi bật từng ký tự cho đến cuối dòng trước khi đi xuống dòng tiếp theo, nó sẽ đi xuống dòng tiếp theo với việc làm nổi bật tối thiểu. Hãy thử di chuyển xung quanh với `h/j/k/l` và xem con trỏ di chuyển.

Ở góc dưới bên trái của cửa sổ Vim, bạn sẽ thấy `-- VISUAL --`, `-- VISUAL LINE --`, hoặc `-- VISUAL BLOCK --` được hiển thị để chỉ ra chế độ hình ảnh mà bạn đang ở.

Khi bạn đang ở trong một chế độ hình ảnh, bạn có thể chuyển sang chế độ hình ảnh khác bằng cách nhấn `v`, `V`, hoặc `Ctrl-V`. Ví dụ, nếu bạn đang ở chế độ hình ảnh theo dòng và bạn muốn chuyển sang chế độ hình ảnh theo khối, hãy chạy `Ctrl-V`. Hãy thử nó!

Có ba cách để thoát khỏi chế độ hình ảnh: `<Esc>`, `Ctrl-C`, và phím giống như chế độ hình ảnh hiện tại của bạn. Điều này có nghĩa là nếu bạn hiện đang ở chế độ hình ảnh theo dòng (`V`), bạn có thể thoát khỏi nó bằng cách nhấn `V` một lần nữa. Nếu bạn đang ở chế độ hình ảnh theo ký tự, bạn có thể thoát khỏi nó bằng cách nhấn `v`.

Thực tế có một cách khác để vào chế độ hình ảnh:

```shell
gv    Quay lại chế độ hình ảnh trước đó
```

Nó sẽ bắt đầu cùng một chế độ hình ảnh trên cùng một khối văn bản được làm nổi bật như lần trước.

## Điều hướng trong chế độ hình ảnh

Khi ở trong chế độ hình ảnh, bạn có thể mở rộng khối văn bản được làm nổi bật bằng các chuyển động của Vim.

Hãy sử dụng cùng một văn bản mà bạn đã sử dụng trước đó:

```shell
one
two
three
```

Lần này hãy bắt đầu từ dòng "two". Nhấn `v` để vào chế độ hình ảnh theo ký tự (ở đây các dấu ngoặc vuông `[]` đại diện cho các ký tự được làm nổi bật):

```shell
one
[t]wo
three
```

Nhấn `j` và Vim sẽ làm nổi bật tất cả văn bản từ dòng "two" xuống ký tự đầu tiên của dòng "three".

```shell
one
[two
t]hree
```

Giả sử từ vị trí này, bạn muốn thêm dòng "one" nữa. Nếu bạn nhấn `k`, thật không may, phần làm nổi bật sẽ di chuyển ra khỏi dòng "three". 

```shell
one
[t]wo
three
```

Có cách nào để mở rộng lựa chọn hình ảnh một cách tự do để di chuyển theo bất kỳ hướng nào bạn muốn không? Chắc chắn rồi. Hãy quay lại một chút nơi bạn đã làm nổi bật dòng "two" và "three".

```shell
one
[two
t]hree    <-- con trỏ
```

Phần làm nổi bật theo hình ảnh sẽ theo chuyển động của con trỏ. Nếu bạn muốn mở rộng nó lên trên dòng "one", bạn cần di chuyển con trỏ lên dòng "two". Hiện tại con trỏ đang ở trên dòng "three". Bạn có thể chuyển đổi vị trí con trỏ bằng cách sử dụng `o` hoặc `O`.

```shell
one
[two     <-- con trỏ
t]hree
```

Bây giờ khi bạn nhấn `k`, nó không còn giảm lựa chọn nữa, mà mở rộng nó lên trên.

```shell
[one
two
t]hree
```

Với `o` hoặc `O` trong chế độ hình ảnh, con trỏ nhảy từ đầu đến cuối của khối được làm nổi bật, cho phép bạn mở rộng khu vực làm nổi bật.

## Ngữ pháp chế độ hình ảnh

Chế độ hình ảnh chia sẻ nhiều thao tác với chế độ bình thường.

Ví dụ, nếu bạn có văn bản sau và bạn muốn xóa hai dòng đầu tiên từ chế độ hình ảnh:

```shell
one
two
three
```

Làm nổi bật các dòng "one" và "two" với chế độ hình ảnh theo dòng (`V`):

```shell
[one
two]
three
```

Nhấn `d` sẽ xóa lựa chọn, tương tự như chế độ bình thường. Lưu ý quy tắc ngữ pháp từ chế độ bình thường, động từ + danh từ, không áp dụng. Động từ giống nhau vẫn ở đó (`d`), nhưng không có danh từ trong chế độ hình ảnh. Quy tắc ngữ pháp trong chế độ hình ảnh là danh từ + động từ, trong đó danh từ là văn bản được làm nổi bật. Chọn khối văn bản trước, sau đó lệnh theo sau.

Trong chế độ bình thường, có một số lệnh không yêu cầu chuyển động, như `x` để xóa một ký tự duy nhất dưới con trỏ và `r` để thay thế ký tự dưới con trỏ (`rx` thay thế ký tự dưới con trỏ bằng "x"). Trong chế độ hình ảnh, những lệnh này bây giờ được áp dụng cho toàn bộ văn bản được làm nổi bật thay vì một ký tự duy nhất. Quay lại văn bản được làm nổi bật:

```shell
[one
two]
three
```

Chạy `x` sẽ xóa tất cả văn bản được làm nổi bật.

Bạn có thể sử dụng hành vi này để nhanh chóng tạo tiêu đề trong văn bản markdown. Giả sử bạn cần nhanh chóng biến văn bản sau thành tiêu đề markdown cấp một ("==="):

```shell
Chapter One
```

Đầu tiên, sao chép văn bản với `yy`, sau đó dán nó với `p`:

```shell
Chapter One
Chapter One
```

Bây giờ, đi đến dòng thứ hai và chọn nó với chế độ hình ảnh theo dòng:

```shell
Chapter One
[Chapter One]
```

Một tiêu đề cấp một là một chuỗi "=" bên dưới một văn bản. Chạy `r=`, voila! Điều này giúp bạn không phải gõ "=" một cách thủ công.

```shell
Chapter One
===========
```

Để tìm hiểu thêm về các toán tử trong chế độ hình ảnh, hãy kiểm tra `:h visual-operators`.

## Chế độ hình ảnh và lệnh dòng lệnh

Bạn có thể áp dụng có chọn lọc các lệnh dòng lệnh trên một khối văn bản được làm nổi bật. Nếu bạn có những câu lệnh này và bạn muốn thay thế "const" bằng "let" chỉ trên hai dòng đầu tiên:

```shell
const one = "one";
const two = "two";
const three = "three";
```

Làm nổi bật hai dòng đầu tiên với *bất kỳ* chế độ hình ảnh nào và chạy lệnh thay thế `:s/const/let/g`:

```shell
let one = "one";
let two = "two";
const three = "three";
```

Lưu ý rằng tôi đã nói bạn có thể làm điều này với *bất kỳ* chế độ hình ảnh nào. Bạn không cần phải làm nổi bật toàn bộ dòng để chạy lệnh trên dòng đó. Miễn là bạn chọn ít nhất một ký tự trên mỗi dòng, lệnh sẽ được áp dụng.

## Thêm văn bản trên nhiều dòng

Bạn có thể thêm văn bản trên nhiều dòng trong Vim bằng cách sử dụng chế độ hình ảnh theo khối. Nếu bạn cần thêm dấu chấm phẩy ở cuối mỗi dòng:

```shell
const one = "one"
const two = "two"
const three = "three"
```

Với con trỏ của bạn trên dòng đầu tiên:
- Chạy chế độ hình ảnh theo khối và đi xuống hai dòng (`Ctrl-V jj`).
- Làm nổi bật đến cuối dòng (`$`).
- Thêm (`A`) sau đó gõ ";".
- Thoát khỏi chế độ hình ảnh (`<Esc>`).

Bạn sẽ thấy dấu ";" đã được thêm vào mỗi dòng bây giờ. Thật tuyệt! Có hai cách để vào chế độ chèn từ chế độ hình ảnh theo khối: `A` để nhập văn bản sau con trỏ hoặc `I` để nhập văn bản trước con trỏ. Đừng nhầm lẫn chúng với `A` (thêm văn bản ở cuối dòng) và `I` (chèn văn bản trước dòng không trắng đầu tiên) từ chế độ bình thường.

Ngoài ra, bạn cũng có thể sử dụng lệnh `:normal` để thêm văn bản trên nhiều dòng:
- Làm nổi bật cả 3 dòng (`vjj`).
- Gõ `:normal! A;`.

Nhớ rằng, lệnh `:normal` thực thi các lệnh trong chế độ bình thường. Bạn có thể hướng dẫn nó chạy `A;` để thêm văn bản ";" ở cuối dòng.

## Tăng số

Vim có các lệnh `Ctrl-X` và `Ctrl-A` để giảm và tăng số. Khi sử dụng với chế độ hình ảnh, bạn có thể tăng số trên nhiều dòng.

Nếu bạn có những phần tử HTML này:

```shell
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
```

Thật không tốt khi có nhiều id có cùng tên, vì vậy hãy tăng chúng để làm cho chúng trở nên duy nhất:
- Di chuyển con trỏ của bạn đến "1" trên dòng thứ hai.
- Bắt đầu chế độ hình ảnh theo khối và đi xuống 3 dòng (`Ctrl-V 3j`). Điều này làm nổi bật các "1" còn lại. Bây giờ tất cả "1" nên được làm nổi bật (trừ dòng đầu tiên).
- Chạy `g Ctrl-A`.

Bạn sẽ thấy kết quả này:

```shell
<div id="app-1"></div>
<div id="app-2"></div>
<div id="app-3"></div>
<div id="app-4"></div>
<div id="app-5"></div>
```

`g Ctrl-A` tăng số trên nhiều dòng. `Ctrl-X/Ctrl-A` cũng có thể tăng chữ cái, với tùy chọn định dạng số:

```shell
set nrformats+=alpha
```

Tùy chọn `nrformats` hướng dẫn Vim các cơ sở nào được coi là "số" để `Ctrl-A` và `Ctrl-X` tăng và giảm. Bằng cách thêm `alpha`, một ký tự chữ cái bây giờ được coi là một số. Nếu bạn có các phần tử HTML sau:

```shell
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
```

Đặt con trỏ của bạn trên "app-a" thứ hai. Sử dụng cùng một kỹ thuật như trên (`Ctrl-V 3j` sau đó `g Ctrl-A`) để tăng các id.

```shell
<div id="app-a"></div>
<div id="app-b"></div>
<div id="app-c"></div>
<div id="app-d"></div>
<div id="app-e"></div>
```

## Chọn khu vực hình ảnh cuối cùng

Trước đó trong chương này, tôi đã đề cập rằng `gv` có thể nhanh chóng làm nổi bật lần làm nổi bật chế độ hình ảnh cuối cùng. Bạn cũng có thể đến vị trí bắt đầu và kết thúc của lần làm nổi bật chế độ hình ảnh cuối cùng với hai dấu hiệu đặc biệt này:

```shell
`<    Đi đến vị trí đầu tiên của lần làm nổi bật chế độ hình ảnh trước đó
`>    Đi đến vị trí cuối cùng của lần làm nổi bật chế độ hình ảnh trước đó
```

Trước đó, tôi cũng đã đề cập rằng bạn có thể thực hiện có chọn lọc các lệnh dòng lệnh trên một văn bản được làm nổi bật, như `:s/const/let/g`. Khi bạn làm điều đó, bạn sẽ thấy điều này bên dưới:

```shell
:`<,`>s/const/let/g
```

Bạn thực sự đang thực thi một lệnh `s/const/let/g` *có phạm vi* (với hai dấu hiệu làm địa chỉ). Thú vị!

Bạn luôn có thể chỉnh sửa những dấu hiệu này bất cứ khi nào bạn muốn. Nếu thay vào đó bạn cần thay thế từ đầu văn bản được làm nổi bật đến cuối tệp, bạn chỉ cần thay đổi lệnh thành:

```shell
:`<,$s/const/let/g
```

## Vào chế độ hình ảnh từ chế độ chèn

Bạn cũng có thể vào chế độ hình ảnh từ chế độ chèn. Để vào chế độ hình ảnh theo ký tự trong khi bạn đang ở chế độ chèn:

```shell
Ctrl-O v
```

Nhớ rằng việc chạy `Ctrl-O` trong chế độ chèn cho phép bạn thực thi một lệnh trong chế độ bình thường. Khi ở chế độ chờ lệnh trong chế độ bình thường này, hãy chạy `v` để vào chế độ hình ảnh theo ký tự. Lưu ý rằng ở góc dưới bên trái của màn hình, nó nói `--(insert) VISUAL--`. Mẹo này hoạt động với bất kỳ toán tử chế độ hình ảnh nào: `v`, `V`, và `Ctrl-V`.

## Chế độ chọn

Vim có một chế độ tương tự như chế độ hình ảnh gọi là chế độ chọn. Giống như chế độ hình ảnh, nó cũng có ba chế độ khác nhau:

```shell
gh         Chế độ chọn theo ký tự
gH         Chế độ chọn theo dòng
gCtrl-h    Chế độ chọn theo khối
```

Chế độ chọn mô phỏng hành vi làm nổi bật văn bản của một trình soạn thảo thông thường gần hơn so với chế độ hình ảnh của Vim.

Trong một trình soạn thảo thông thường, sau khi bạn làm nổi bật một khối văn bản và gõ một chữ cái, chẳng hạn như chữ cái "y", nó sẽ xóa văn bản được làm nổi bật và chèn chữ cái "y". Nếu bạn làm nổi bật một dòng với chế độ chọn theo dòng (`gH`) và gõ "y", nó sẽ xóa văn bản được làm nổi bật và chèn chữ cái "y".

So sánh chế độ chọn này với chế độ hình ảnh: nếu bạn làm nổi bật một dòng văn bản với chế độ hình ảnh theo dòng (`V`) và gõ "y", văn bản được làm nổi bật sẽ không bị xóa và thay thế bằng chữ cái "y", mà sẽ được sao chép. Bạn không thể thực hiện các lệnh trong chế độ bình thường trên văn bản được làm nổi bật trong chế độ chọn.

Tôi cá nhân chưa bao giờ sử dụng chế độ chọn, nhưng thật tốt khi biết rằng nó tồn tại.

## Học chế độ hình ảnh một cách thông minh

Chế độ hình ảnh là đại diện của Vim cho quy trình làm nổi bật văn bản.

Nếu bạn thấy mình sử dụng thao tác chế độ hình ảnh thường xuyên hơn thao tác chế độ bình thường, hãy cẩn thận. Đây là một mẫu chống lại. Nó tốn nhiều phím bấm hơn để thực hiện một thao tác chế độ hình ảnh so với thao tác chế độ bình thường tương ứng của nó. Ví dụ, nếu bạn cần xóa một từ bên trong, tại sao lại sử dụng bốn phím bấm, `viwd` (làm nổi bật một từ bên trong rồi xóa), nếu bạn có thể hoàn thành chỉ với ba phím bấm (`diw`)? Cái sau trực tiếp và ngắn gọn hơn. Tất nhiên, sẽ có những lúc mà chế độ hình ảnh là phù hợp, nhưng nhìn chung, hãy ưu tiên một cách tiếp cận trực tiếp hơn.