---
description: Tài liệu này hướng dẫn cách tích hợp Vim và Git, đặc biệt là cách sử
  dụng vimdiff để so sánh và chỉnh sửa các tệp tin khác nhau.
title: Ch18. Git
---

Vim và git là hai công cụ tuyệt vời cho hai việc khác nhau. Git là một công cụ kiểm soát phiên bản. Vim là một trình soạn thảo văn bản.

Trong chương này, bạn sẽ học các cách khác nhau để tích hợp Vim và git với nhau.

## So sánh

Nhớ lại trong chương trước, bạn có thể chạy lệnh `vimdiff` để hiển thị sự khác biệt giữa nhiều tệp.

Giả sử bạn có hai tệp, `file1.txt` và `file2.txt`.

Trong `file1.txt`:

```shell
bánh kếp
bánh quế
táo

sữa
nước táo

sữa chua
```

Trong `file2.txt`:

```shell
bánh kếp
bánh quế
cam

sữa
nước cam

sữa chua
```

Để xem sự khác biệt giữa hai tệp, chạy:

```shell
vimdiff file1.txt file2.txt
```

Ngoài ra, bạn có thể chạy:

```shell
vim -d file1.txt file2.txt
```

`vimdiff` hiển thị hai bộ đệm cạnh nhau. Bên trái là `file1.txt` và bên phải là `file2.txt`. Sự khác biệt đầu tiên (táo và cam) được làm nổi bật trên cả hai dòng.

Giả sử bạn muốn làm cho bộ đệm thứ hai có táo, không phải cam. Để chuyển nội dung từ vị trí hiện tại của bạn (bạn hiện đang ở `file1.txt`) sang `file2.txt`, trước tiên hãy đi đến sự khác biệt tiếp theo với `]c` (để nhảy đến cửa sổ khác biệt trước đó, sử dụng `[c`). Con trỏ của bạn bây giờ nên ở trên táo. Chạy `:diffput`. Cả hai tệp bây giờ nên có táo.

Nếu bạn cần chuyển văn bản từ bộ đệm khác (nước cam, `file2.txt`) để thay thế văn bản trên bộ đệm hiện tại (nước táo, `file1.txt`), với con trỏ của bạn vẫn ở cửa sổ `file1.txt`, trước tiên hãy đi đến sự khác biệt tiếp theo với `]c`. Con trỏ của bạn bây giờ nên ở trên nước táo. Chạy `:diffget` để lấy nước cam từ bộ đệm khác để thay thế nước táo trong bộ đệm của chúng ta.

`:diffput` *đưa ra* văn bản từ bộ đệm hiện tại sang bộ đệm khác. `:diffget` *lấy* văn bản từ bộ đệm khác sang bộ đệm hiện tại.

Nếu bạn có nhiều bộ đệm, bạn có thể chạy `:diffput fileN.txt` và `:diffget fileN.txt` để nhắm đến bộ đệm fileN.

## Vim Như Một Công Cụ Hợp Nhất

> "Tôi thích giải quyết xung đột hợp nhất!" - Không ai cả

Tôi không biết ai thích giải quyết xung đột hợp nhất. Tuy nhiên, chúng là điều không thể tránh khỏi. Trong phần này, bạn sẽ học cách tận dụng Vim như một công cụ giải quyết xung đột hợp nhất.

Đầu tiên, thay đổi công cụ hợp nhất mặc định để sử dụng `vimdiff` bằng cách chạy:

```shell
git config merge.tool vimdiff
git config merge.conflictstyle diff3
git config mergetool.prompt false
```

Ngoài ra, bạn có thể chỉnh sửa trực tiếp `~/.gitconfig` (theo mặc định nó nên ở thư mục gốc, nhưng của bạn có thể ở nơi khác). Các lệnh trên nên chỉnh sửa gitconfig của bạn để trông giống như cài đặt bên dưới, nếu bạn chưa chạy chúng, bạn cũng có thể chỉnh sửa thủ công gitconfig của mình.

```shell
[core]
  editor = vim
[merge]
  tool = vimdiff
  conflictstyle = diff3
[difftool]
  prompt = false
```

Hãy tạo một xung đột hợp nhất giả để thử nghiệm. Tạo một thư mục `/food` và biến nó thành một kho git:

```shell
git init
```

Thêm một tệp, `breakfast.txt`. Bên trong:

```shell
bánh kếp
bánh quế
cam
```

Thêm tệp và cam kết nó:

```shell
git add .
git commit -m "Cam sáng tạo ban đầu"
```

Tiếp theo, tạo một nhánh mới và gọi nó là nhánh táo:

```shell
git checkout -b apples
```

Thay đổi `breakfast.txt`:

```shell
bánh kếp
bánh quế
táo
```

Lưu tệp, sau đó thêm và cam kết thay đổi:

```shell
git add .
git commit -m "Táo không phải cam"
```

Tuyệt vời. Bây giờ bạn có cam trong nhánh chính và táo trong nhánh táo. Hãy quay lại nhánh chính:

```shell
git checkout master
```

Trong `breakfast.txt`, bạn sẽ thấy văn bản cơ sở, cam. Hãy thay đổi nó thành nho vì chúng đang vào mùa ngay bây giờ:

```shell
bánh kếp
bánh quế
nho
```

Lưu, thêm và cam kết:

```shell
git add .
git commit -m "Nho không phải cam"
```

Bây giờ bạn đã sẵn sàng để hợp nhất nhánh táo vào nhánh chính:

```shell
git merge apples
```

Bạn sẽ thấy một lỗi:

```shell
Tự động hợp nhất breakfast.txt
XUNG ĐỘT (nội dung): Xung đột hợp nhất trong breakfast.txt
Hợp nhất tự động thất bại; hãy sửa các xung đột và sau đó cam kết kết quả.
```

Một xung đột, tuyệt! Hãy giải quyết xung đột bằng cách sử dụng `mergetool` đã cấu hình mới của chúng ta. Chạy:

```shell
git mergetool
```

Vim hiển thị bốn cửa sổ. Hãy chú ý đến ba cửa sổ trên cùng:

- `LOCAL` chứa `nho`. Đây là thay đổi trong "cục bộ", điều mà bạn đang hợp nhất vào.
- `BASE` chứa `cam`. Đây là tổ tiên chung giữa `LOCAL` và `REMOTE` để so sánh cách chúng phân kỳ.
- `REMOTE` chứa `táo`. Đây là điều đang được hợp nhất vào.

Ở dưới cùng (cửa sổ thứ tư) bạn thấy:

```shell
bánh kếp
bánh quế
<<<<<<< HEAD
nho
||||||| db63958
cam
=======
táo
>>>>>>> apples
```

Cửa sổ thứ tư chứa các văn bản xung đột hợp nhất. Với thiết lập này, dễ dàng hơn để thấy thay đổi mà mỗi môi trường có. Bạn có thể thấy nội dung từ `LOCAL`, `BASE`, và `REMOTE` cùng một lúc.

Con trỏ của bạn nên ở trên cửa sổ thứ tư, trên khu vực được làm nổi bật. Để lấy thay đổi từ `LOCAL` (nho), chạy `:diffget LOCAL`. Để lấy thay đổi từ `BASE` (cam), chạy `:diffget BASE` và để lấy thay đổi từ `REMOTE` (táo), chạy `:diffget REMOTE`.

Trong trường hợp này, hãy lấy thay đổi từ `LOCAL`. Chạy `:diffget LOCAL`. Cửa sổ thứ tư bây giờ sẽ có nho. Lưu và thoát tất cả các tệp (`:wqall`) khi bạn hoàn tất. Điều đó không tệ, phải không?

Nếu bạn nhận thấy, bạn cũng có một tệp `breakfast.txt.orig` bây giờ. Git tạo một tệp sao lưu trong trường hợp mọi thứ không diễn ra tốt đẹp. Nếu bạn không muốn git tạo một bản sao lưu trong quá trình hợp nhất, hãy chạy:

```shell
git config --global mergetool.keepBackup false
```

## Git Trong Vim

Vim không có tính năng git tích hợp sẵn. Một cách để chạy các lệnh git từ Vim là sử dụng toán tử bang, `!`, trong chế độ dòng lệnh.

Bất kỳ lệnh git nào có thể được chạy với `!`:

```shell
:!git status
:!git commit
:!git diff
:!git push origin master
```

Bạn cũng có thể sử dụng quy ước `%` (bộ đệm hiện tại) hoặc `#` (bộ đệm khác):

```shell
:!git add %         " git thêm tệp hiện tại
:!git checkout #    " git kiểm tra tệp khác
```

Một mẹo Vim bạn có thể sử dụng để thêm nhiều tệp trong các cửa sổ Vim khác nhau là chạy:

```shell
:windo !git add %
```

Sau đó thực hiện một cam kết:

```shell
:!git commit "Chỉ vừa thêm mọi thứ trong cửa sổ Vim của tôi, thật tuyệt"
```

Lệnh `windo` là một trong những lệnh "thực hiện" của Vim, tương tự như `argdo` mà bạn đã thấy trước đó. `windo` thực hiện lệnh trên mỗi cửa sổ.

Ngoài ra, bạn cũng có thể sử dụng `bufdo !git add %` để git thêm tất cả các bộ đệm hoặc `argdo !git add %` để git thêm tất cả các đối số tệp, tùy thuộc vào quy trình làm việc của bạn.

## Các Plugin

Có nhiều plugin Vim hỗ trợ git. Dưới đây là danh sách một số plugin liên quan đến git phổ biến cho Vim (có thể có nhiều hơn vào thời điểm bạn đọc điều này):

- [vim-gitgutter](https://github.com/airblade/vim-gitgutter)
- [vim-signify](https://github.com/mhinz/vim-signify)
- [vim-fugitive](https://github.com/tpope/vim-fugitive)
- [gv.vim](https://github.com/junegunn/gv.vim)
- [vimagit](https://github.com/jreybert/vimagit)
- [vim-twiggy](https://github.com/sodapopcan/vim-twiggy)
- [rhubarb](https://github.com/tpope/vim-rhubarb)

Một trong những plugin phổ biến nhất là vim-fugitive. Trong phần còn lại của chương, tôi sẽ đi qua một số quy trình làm việc git sử dụng plugin này.

## Vim-fugitive

Plugin vim-fugitive cho phép bạn chạy CLI git mà không rời khỏi trình soạn thảo Vim. Bạn sẽ thấy rằng một số lệnh tốt hơn khi thực hiện từ bên trong Vim.

Để bắt đầu, hãy cài đặt vim-fugitive với một trình quản lý plugin Vim ([vim-plug](https://github.com/junegunn/vim-plug), [vundle](https://github.com/VundleVim/Vundle.vim), [dein.vim](https://github.com/Shougo/dein.vim), v.v.).

## Trạng Thái Git

Khi bạn chạy lệnh `:Git` mà không có tham số nào, vim-fugitive hiển thị một cửa sổ tóm tắt git. Nó hiển thị các tệp chưa được theo dõi, chưa được giai đoạn và đã được giai đoạn. Trong chế độ "`git status`" này, bạn có thể làm một số điều:
- `Ctrl-N` / `Ctrl-P` để di chuyển lên hoặc xuống danh sách tệp.
- `-` để giai đoạn hoặc bỏ giai đoạn tên tệp dưới con trỏ.
- `s` để giai đoạn tên tệp dưới con trỏ.
- `u` để bỏ giai đoạn tên tệp dưới con trỏ.
- `>` / `<` để hiển thị hoặc ẩn một sự khác biệt nội tuyến của tên tệp dưới con trỏ.

Để biết thêm, hãy kiểm tra `:h fugitive-staging-maps`.

## Git Blame

Khi bạn chạy lệnh `:Git blame` từ tệp hiện tại, vim-fugitive hiển thị một cửa sổ blame chia đôi. Điều này có thể hữu ích để tìm người chịu trách nhiệm viết dòng mã lỗi đó để bạn có thể la mắng họ (chỉ đùa thôi).

Một số điều bạn có thể làm trong chế độ `"git blame"` này:
- `q` để đóng cửa sổ blame.
- `A` để thay đổi kích thước cột tác giả.
- `C` để thay đổi kích thước cột cam kết.
- `D` để thay đổi kích thước cột ngày / giờ.

Để biết thêm, hãy kiểm tra `:h :Git_blame`.

## Gdiffsplit

Khi bạn chạy lệnh `:Gdiffsplit`, vim-fugitive chạy một `vimdiff` của các thay đổi mới nhất của tệp hiện tại so với chỉ mục hoặc cây làm việc. Nếu bạn chạy `:Gdiffsplit <commit>`, vim-fugitive chạy một `vimdiff` so với tệp đó bên trong `<commit>`.

Bởi vì bạn đang ở chế độ `vimdiff`, bạn có thể *lấy* hoặc *đưa* sự khác biệt với `:diffput` và `:diffget`.

## Gwrite và Gread

Khi bạn chạy lệnh `:Gwrite` trong một tệp sau khi bạn thực hiện thay đổi, vim-fugitive giai đoạn các thay đổi. Nó giống như chạy `git add <tệp-hiện-tại>`.

Khi bạn chạy lệnh `:Gread` trong một tệp sau khi bạn thực hiện thay đổi, vim-fugitive khôi phục tệp về trạng thái trước khi thay đổi. Nó giống như chạy `git checkout <tệp-hiện-tại>`. Một lợi thế của việc chạy `:Gread` là hành động này có thể hoàn tác. Nếu, sau khi bạn chạy `:Gread`, bạn thay đổi ý định và muốn giữ lại thay đổi cũ, bạn chỉ cần chạy hoàn tác (`u`) và Vim sẽ hoàn tác hành động `:Gread`. Điều này sẽ không thể xảy ra nếu bạn đã chạy `git checkout <tệp-hiện-tại>` từ CLI.

## Gclog

Khi bạn chạy lệnh `:Gclog`, vim-fugitive hiển thị lịch sử cam kết. Nó giống như chạy lệnh `git log`. Vim-fugitive sử dụng quickfix của Vim để thực hiện điều này, vì vậy bạn có thể sử dụng `:cnext` và `:cprevious` để di chuyển đến thông tin log tiếp theo hoặc trước đó. Bạn có thể mở và đóng danh sách log với `:copen` và `:cclose`.

Trong chế độ `"git log"` này, bạn có thể làm hai điều:
- Xem cây.
- Truy cập vào cha (cam kết trước đó).

Bạn có thể truyền cho `:Gclog` các tham số giống như lệnh `git log`. Nếu dự án của bạn có một lịch sử cam kết dài và bạn chỉ cần xem ba cam kết cuối cùng, bạn có thể chạy `:Gclog -3`. Nếu bạn cần lọc nó dựa trên ngày của người cam kết, bạn có thể chạy một cái gì đó như `:Gclog --after="Ngày 1" --before="Ngày 14 tháng 3"`.

## Thêm Vim-fugitive

Đây chỉ là một vài ví dụ về những gì vim-fugitive có thể làm. Để tìm hiểu thêm về vim-fugitive, hãy kiểm tra `:h fugitive.txt`. Hầu hết các lệnh git phổ biến có thể đã được tối ưu hóa với vim-fugitive. Bạn chỉ cần tìm kiếm chúng trong tài liệu.

Nếu bạn đang ở trong một trong những "chế độ đặc biệt" của vim-fugitive (ví dụ, trong chế độ `:Git` hoặc `:Git blame`) và bạn muốn tìm hiểu những phím tắt nào có sẵn, hãy nhấn `g?`. Vim-fugitive sẽ hiển thị cửa sổ `:help` thích hợp cho chế độ bạn đang ở. Thật tuyệt!
## Học Vim và Git theo cách thông minh

Bạn có thể thấy vim-fugitive là một bổ sung tốt cho quy trình làm việc của bạn (hoặc không). Dù sao đi nữa, tôi rất khuyến khích bạn kiểm tra tất cả các plugin được liệt kê ở trên. Có thể còn nhiều plugin khác mà tôi không liệt kê. Hãy thử chúng.

Một cách rõ ràng để cải thiện tích hợp Vim-git là đọc thêm về git. Git, tự nó, là một chủ đề rộng lớn và tôi chỉ đang trình bày một phần nhỏ của nó. Với điều đó, hãy *bắt đầu git* (xin lỗi vì trò đùa) và nói về cách sử dụng Vim để biên dịch mã của bạn!