---
description: Hướng dẫn này giúp người dùng nắm bắt các tính năng hữu ích của Vim một
  cách nhanh chóng, với nhiều ví dụ để củng cố kiến thức.
title: Ch00. Read This First
---

## Tại Sao Hướng Dẫn Này Được Viết

Có nhiều nơi để học Vim: `vimtutor` là một nơi tuyệt vời để bắt đầu và tài liệu `:help` có tất cả các tham chiếu mà bạn sẽ cần.

Tuy nhiên, người dùng trung bình cần một cái gì đó nhiều hơn `vimtutor` và ít hơn tài liệu `:help`. Hướng dẫn này cố gắng lấp đầy khoảng trống đó bằng cách chỉ ra những tính năng chính để học những phần hữu ích nhất của Vim trong thời gian ngắn nhất có thể.

Có khả năng bạn sẽ không cần đến 100% tính năng của Vim. Bạn có thể chỉ cần biết khoảng 20% trong số đó để trở thành một Vimmer mạnh mẽ. Hướng dẫn này sẽ chỉ cho bạn những tính năng Vim nào bạn sẽ thấy hữu ích nhất.

Đây là một hướng dẫn có quan điểm. Nó bao gồm các kỹ thuật mà tôi thường sử dụng khi sử dụng Vim. Các chương được sắp xếp dựa trên những gì tôi nghĩ sẽ hợp lý nhất cho một người mới bắt đầu học Vim.

Hướng dẫn này có nhiều ví dụ. Khi học một kỹ năng mới, ví dụ là điều không thể thiếu, có nhiều ví dụ sẽ củng cố các khái niệm này hiệu quả hơn.

Một số bạn có thể tự hỏi tại sao bạn cần học Vimscript? Trong năm đầu tiên sử dụng Vim, tôi hài lòng với việc chỉ biết cách sử dụng Vim. Thời gian trôi qua và tôi bắt đầu cần Vimscript ngày càng nhiều để viết các lệnh tùy chỉnh cho nhu cầu chỉnh sửa cụ thể của mình. Khi bạn thành thạo Vim, bạn sẽ sớm hoặc muộn cần học Vimscript. Vậy tại sao không sớm hơn? Vimscript là một ngôn ngữ nhỏ. Bạn có thể học các kiến thức cơ bản của nó chỉ trong bốn chương của hướng dẫn này.

Bạn có thể đi xa với Vim mà không cần biết bất kỳ Vimscript nào, nhưng biết nó sẽ giúp bạn tiến xa hơn nữa.

Hướng dẫn này được viết cho cả người mới bắt đầu và người dùng Vim nâng cao. Nó bắt đầu với các khái niệm rộng và đơn giản và kết thúc với các khái niệm cụ thể và nâng cao. Nếu bạn đã là một người dùng nâng cao, tôi khuyến khích bạn đọc hướng dẫn này từ đầu đến cuối, vì bạn sẽ học được điều gì đó mới!

## Cách Chuyển Đổi Sang Vim Từ Việc Sử Dụng Một Trình Soạn Thảo Văn Bản Khác

Học Vim là một trải nghiệm thỏa mãn, mặc dù khó khăn. Có hai cách tiếp cận chính để học Vim:

1. Ngừng ngay lập tức
2. Dần dần

Ngừng ngay lập tức có nghĩa là ngừng sử dụng bất kỳ trình soạn thảo / IDE nào mà bạn đang sử dụng và chỉ sử dụng Vim từ bây giờ. Nhược điểm của phương pháp này là bạn sẽ gặp phải sự mất năng suất nghiêm trọng trong tuần đầu tiên hoặc hai tuần. Nếu bạn là một lập trình viên toàn thời gian, phương pháp này có thể không khả thi. Đó là lý do tại sao đối với hầu hết mọi người, tôi tin rằng cách tốt nhất để chuyển sang Vim là sử dụng nó dần dần.

Để sử dụng Vim dần dần, trong hai tuần đầu tiên, hãy dành một giờ mỗi ngày sử dụng Vim làm trình soạn thảo của bạn trong khi thời gian còn lại bạn có thể sử dụng các trình soạn thảo khác. Nhiều trình soạn thảo hiện đại đi kèm với các plugin Vim. Khi tôi mới bắt đầu, tôi đã sử dụng plugin Vim phổ biến của VSCode trong một giờ mỗi ngày. Tôi đã dần dần tăng thời gian với plugin Vim cho đến khi cuối cùng tôi sử dụng nó cả ngày. Hãy nhớ rằng những plugin này chỉ có thể mô phỏng một phần nhỏ tính năng của Vim. Để trải nghiệm sức mạnh đầy đủ của Vim như Vimscript, Lệnh dòng (Ex) và tích hợp lệnh bên ngoài, bạn sẽ cần sử dụng chính Vim.

Có hai khoảnh khắc quan trọng đã khiến tôi bắt đầu sử dụng Vim 100%: khi tôi hiểu rằng Vim có một cấu trúc giống như ngữ pháp (xem chương 4) và plugin [fzf.vim](https://github.com/junegunn/fzf.vim) (xem chương 3).

Khoảnh khắc đầu tiên, khi tôi nhận ra cấu trúc giống như ngữ pháp của Vim, là khoảnh khắc quyết định mà tôi cuối cùng hiểu những người dùng Vim đang nói về điều gì. Tôi không cần phải học hàng trăm lệnh độc đáo. Tôi chỉ cần học một vài lệnh nhỏ và tôi có thể kết hợp chúng theo cách rất trực quan để làm nhiều việc.

Khoảnh khắc thứ hai, khả năng nhanh chóng thực hiện tìm kiếm tệp mờ là tính năng IDE mà tôi sử dụng nhiều nhất. Khi tôi học cách làm điều đó trong Vim, tôi đã có một cú sốc về tốc độ lớn và không bao giờ nhìn lại từ đó.

Mọi người lập trình khác nhau. Khi tự xem xét, bạn sẽ thấy rằng có một hoặc hai tính năng từ trình soạn thảo / IDE yêu thích của bạn mà bạn sử dụng mọi lúc. Có thể đó là tìm kiếm mờ, nhảy đến định nghĩa, hoặc biên dịch nhanh. Dù chúng là gì, hãy xác định chúng nhanh chóng và học cách triển khai chúng trong Vim (có khả năng Vim cũng có thể làm được). Tốc độ chỉnh sửa của bạn sẽ nhận được một cú sốc lớn.

Khi bạn có thể chỉnh sửa với 50% tốc độ ban đầu, đã đến lúc chuyển sang sử dụng Vim toàn thời gian.

## Cách Đọc Hướng Dẫn Này

Đây là một hướng dẫn thực tiễn. Để trở nên giỏi trong Vim, bạn cần phát triển trí nhớ cơ bắp của mình, không phải kiến thức lý thuyết.

Bạn không học cách đi xe đạp bằng cách đọc một hướng dẫn về cách đi xe đạp. Bạn cần thực sự đi xe đạp.

Bạn cần gõ từng lệnh được đề cập trong hướng dẫn này. Không chỉ vậy, bạn cần lặp lại chúng nhiều lần và thử các kết hợp khác nhau. Tìm hiểu những tính năng khác mà lệnh bạn vừa học có. Lệnh `:help` và các công cụ tìm kiếm là những người bạn tốt nhất của bạn. Mục tiêu của bạn không phải là biết mọi thứ về một lệnh, mà là có thể thực hiện lệnh đó một cách tự nhiên và bản năng.

Mặc dù tôi cố gắng sắp xếp hướng dẫn này theo thứ tự tuyến tính, một số khái niệm trong hướng dẫn này phải được trình bày không theo thứ tự. Ví dụ, trong chương 1, tôi đề cập đến lệnh thay thế (`:s`), mặc dù nó sẽ không được đề cập cho đến chương 12. Để khắc phục điều này, mỗi khi một khái niệm mới chưa được đề cập được đề cập sớm, tôi sẽ cung cấp một hướng dẫn nhanh mà không có giải thích chi tiết. Vì vậy, xin hãy kiên nhẫn với tôi :).

## Hỗ Trợ Thêm

Đây là một mẹo bổ sung để sử dụng tài liệu trợ giúp: giả sử bạn muốn tìm hiểu thêm về những gì `Ctrl-P` làm trong chế độ chèn. Nếu bạn chỉ tìm kiếm `:h CTRL-P`, bạn sẽ được chuyển đến `Ctrl-P` của chế độ bình thường. Đây không phải là trợ giúp `Ctrl-P` mà bạn đang tìm kiếm. Trong trường hợp này, hãy tìm kiếm thay vào đó là `:h i_CTRL-P`. Phần bổ sung `i_` đại diện cho chế độ chèn. Hãy chú ý đến chế độ mà nó thuộc về.

## Cú Pháp

Hầu hết các cụm từ liên quan đến lệnh hoặc mã đều ở dạng mã (`như thế này`).

Chuỗi được bao quanh bởi một cặp dấu ngoặc kép ("như thế này").

Các lệnh Vim có thể được viết tắt. Ví dụ, `:join` có thể được viết tắt là `:j`. Trong toàn bộ hướng dẫn, tôi sẽ kết hợp các mô tả viết tắt và mô tả dài. Đối với các lệnh không thường xuyên được sử dụng trong hướng dẫn này, tôi sẽ sử dụng phiên bản dài. Đối với các lệnh thường xuyên được sử dụng, tôi sẽ sử dụng phiên bản viết tắt. Tôi xin lỗi vì những sự không nhất quán. Nói chung, bất cứ khi nào bạn thấy một lệnh mới, hãy luôn kiểm tra nó trên `:help` để xem các viết tắt của nó.

## Vimrc

Tại nhiều điểm trong hướng dẫn, tôi sẽ đề cập đến các tùy chọn vimrc. Nếu bạn mới sử dụng Vim, vimrc giống như một tệp cấu hình.

Vimrc sẽ không được đề cập cho đến chương 21. Để làm rõ, tôi sẽ chỉ ra ngắn gọn ở đây cách thiết lập nó.

Giả sử bạn cần thiết lập tùy chọn số (`set number`). Nếu bạn chưa có vimrc, hãy tạo một cái. Nó thường được đặt trong thư mục chính của bạn và có tên là `.vimrc`. Tùy thuộc vào hệ điều hành của bạn, vị trí có thể khác nhau. Trong macOS, tôi có nó ở `~/.vimrc`. Để xem nơi bạn nên đặt của bạn, hãy kiểm tra `:h vimrc`.

Bên trong nó, thêm `set number`. Lưu lại (`:w`), sau đó nguồn nó (`:source %`). Bạn sẽ thấy số dòng hiển thị ở bên trái.

Ngoài ra, nếu bạn không muốn thay đổi cài đặt vĩnh viễn, bạn có thể luôn chạy lệnh `set` trực tiếp, bằng cách chạy `:set number`. Nhược điểm của phương pháp này là cài đặt này là tạm thời. Khi bạn đóng Vim, tùy chọn sẽ biến mất.

Vì chúng ta đang học về Vim chứ không phải Vi, một cài đặt mà bạn phải có là tùy chọn `nocompatible`. Thêm `set nocompatible` vào vimrc của bạn. Nhiều tính năng đặc trưng của Vim sẽ bị vô hiệu hóa khi nó chạy ở chế độ `compatible`.

Nói chung, bất cứ khi nào một đoạn văn đề cập đến một tùy chọn vimrc, chỉ cần thêm tùy chọn đó vào vimrc, lưu lại và nguồn nó.

## Tương Lai, Lỗi, Câu Hỏi

Hãy mong đợi nhiều cập nhật hơn trong tương lai. Nếu bạn tìm thấy bất kỳ lỗi nào hoặc có bất kỳ câu hỏi nào, hãy thoải mái liên hệ.

Tôi cũng đã lên kế hoạch cho một vài chương sắp tới, vì vậy hãy theo dõi nhé!

## Tôi Muốn Nhiều Mẹo Vim Hơn

Để tìm hiểu thêm về Vim, hãy theo dõi [@learnvim](https://twitter.com/learnvim).

## Lời Cảm Ơn

Hướng dẫn này sẽ không thể thực hiện được nếu không có Bram Moleenar vì đã tạo ra Vim, vợ tôi người đã rất kiên nhẫn và hỗ trợ trong suốt hành trình, tất cả các [nhà đóng góp](https://github.com/iggredible/Learn-Vim/graphs/contributors) của dự án learn-vim, cộng đồng Vim, và nhiều người khác mà không được đề cập.

Cảm ơn bạn. Tất cả các bạn đã giúp làm cho việc chỉnh sửa văn bản trở nên thú vị :)