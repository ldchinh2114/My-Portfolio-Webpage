---
title: "Chín DNS resolver, một lần benchmark, bốn cấu hình"
date: "2026-10-27"
summary: "Đo DNS cold-cache trên chín resolver và tám domain, kiểm chứng end to end, rồi rút ra bốn cấu hình theo nhu cầu."
tags: ["DNS", "Networking", "Benchmark"]
---

DNS là thứ dễ đổi nhất trong cấu hình mạng — mất một phút — nên cũng là chỗ dễ
đoán mò nhất. Tôi muốn số liệu thay vì cảm giác: cache lạnh, nhiều domain, và
một bước kiểm tra rằng resolver nhanh thật sự làm việc duyệt web nhanh hơn, chứ
không chỉ trả lời nhanh.

## Cách đo

Chín resolver, tám domain — bốn trong nước, bốn quốc tế — sáu mẫu cold-cache mỗi
ô, xoá cache resolver trước mỗi truy vấn.

Thời gian DNS thô là cần nhưng chưa đủ. Một resolver có thể trả lời trong 4 ms
rồi vẫn đẩy bạn đến một CDN edge tồi, nên các ứng viên mạnh nhất được đo lại end
to end: resolve rồi fetch qua HTTPS, ba lần mỗi site, tính cả TCP, TLS và byte
đầu tiên.

Độ trễ ICMP được ghi lại rồi bỏ qua. AliDNS trả lời ping 110 ms nhưng resolve
trong 4 ms; Cloudflare ping 25 ms mà resolve không ổn định. Ping đo sai chặng.

## Bảng xếp hạng

| Hạng | Resolver | Địa chỉ | Median trung bình |
| --- | --- | --- | --- |
| 1 | Google IPv6 | `2001:4860:4860::8888` | 5.8 ms |
| 2 | DNSPod IPv4 | `119.29.29.29` | 7.5 ms |
| 3 | 114DNS IPv4 | `114.114.114.114` | 7.9 ms |
| 4 | Cloudflare IPv6 | `2606:4700:4700::1111` | 8.6 ms |
| 5 | Cloudflare IPv4 | `1.1.1.1` | 9.3 ms |
| 6 | AliDNS IPv4 | `223.5.5.5` | 9.4 ms |
| 7 | DNSPod IPv6 | `2402:4e00::` | 9.6 ms |
| 8 | Google IPv4 | `8.8.8.8` | 11.9 ms |
| 9 | AliDNS IPv6 | `2400:3200::1` | 12.3 ms |

Sáu vị trí đầu chỉ cách nhau từ 5.8 đến 9.4 ms. Ở ngưỡng đó không ai cảm nhận
được, nên bảng xếp hạng một mình chưa đủ để đổi cấu hình. Nó chỉ thành quyết
định khi đo cả lượt fetch.

## Đo end to end thì bức tranh đổi

Năm tổ hợp, ba lần mỗi site, đơn vị mili giây:

| Tổ hợp | baidu | bilibili | github | youtube | Trung bình |
| --- | --- | --- | --- | --- | --- |
| Google IPv6 | 177 | 129 | 165 | 793 | 316 |
| Cloudflare IPv6 | 141 | 123 | 163 | 867 | 324 |
| Cloudflare IPv4 | 374 | 385 | 652 | 694 | 526 |
| 114DNS IPv4 | 337 | 389 | 658 | 735 | 530 |
| AliDNS IPv4 | 581 | 4,916 | 628 | 674 | 1,700 |

Hai kết luận. Các tổ hợp IPv6 nhanh gấp đôi IPv4 khi đo end to end — đường IPv6
của ISP ít nghẽn hơn, và lợi thế đó đáng giá hơn thời gian lookup thô của bất kỳ
resolver nào. Còn AliDNS, dù rất tốt khi đo thô, mất 4.9 giây trong một lần tải
bilibili: một cú hiccup định tuyến CDN kéo trung bình từ mức cạnh tranh lên
1,700 ms. Đó là lý do nên ghép một resolver nhanh cho mỗi họ địa chỉ thay vì tin
vào một cái duy nhất.

## Hai vòng đo lệch nhau, và đó mới là phần hữu ích

Vòng đầu, Cloudflare IPv4 trung bình 46.8 ms với đuôi 239 ms ở baidu.com, có lần
trả về địa chỉ cũ — kết nối vào địa chỉ đó mất 286 ms để resolve, so với 3–9 ms
cho phần còn lại.

Vòng sau, mọi nhà cung cấp đều nhiễu hơn: Cloudflare IPv4 trung bình 59–71 ms,
đuôi tới 295 ms; AliDNS 21–46 ms. Kiểu đó nói lên rằng lúc đo đường truyền đang
nhiễu, không phải một resolver bị xuống cấp. Một lần benchmark đo cả đường truyền
lẫn server, nên phải lặp lại thì con số mới có nghĩa. Điều giữ nguyên qua cả hai
vòng: Cloudflare IPv4 là lựa chọn yếu nhất trên đường của ISP này.

## Những gì DNS không sửa được

Cùng buổi đo có đo luôn đường truyền: Wi-Fi 216 Mbps, throughput tải thực tế
khoảng 36 Mbps, không mất gói, gateway 1 ms thấp nhất, 31 ms trung bình, 97 ms
cao nhất.

Link 216 Mbps mà chỉ đạt 36 Mbps là trần nằm ở phía WAN — gói cước, nghẽn giờ
cao điểm, hoặc giới hạn QoS. Chỉnh DNS đáng giá vài mili giây; gói cước đáng giá
vài chục megabit. Giữ đúng tỉ lệ đó là cách để một lần benchmark không biến thành
chỉnh mãi không thôi.

## Bốn cấu hình

| Nhu cầu | IPv4 chính / phụ | IPv6 chính / phụ | Lý do |
| --- | --- | --- | --- |
| Nhanh nhất tổng thể | `223.5.5.5` / `223.6.6.6` | `2001:4860:4860::8888` / `2606:4700:4700::1111` | Median thấp nhất ở cả hai họ; nhanh nhất khi đo end to end |
| Chủ yếu trong nước | `223.5.5.5` / `119.29.29.29` | `2400:3200::1` / `2606:4700:4700::1111` | Câu trả lời tối ưu CDN cho site trong nước |
| Chủ yếu quốc tế | `1.1.1.1` / `8.8.8.8` | `2001:4860:4860::8888` / `2606:4700:4700::1111` | Kết quả sạch hơn cho dịch vụ nước ngoài |
| Riêng tư, chống ô nhiễm | `1.1.1.1` / `9.9.9.9` | `2606:4700:4700::1111` / `2620:fe::fe` | Resolver không log kèm chặn malware |
| Cấu hình hiện tại | `223.5.5.5` / `223.6.6.6` | `2606:4700:4700::1111` / `2606:4700:4700::1001` | Đã tốt; chỉ có IPv6 chính là có thể nâng cấp |

Một ràng buộc cho mọi cấu hình: mỗi họ địa chỉ không khai báo quá hai resolver.
Windows hỏi song song và lấy câu trả lời đầu tiên, nên resolver thứ ba chậm chỉ
thêm nhiễu, không thêm dự phòng.

## Cấu hình tôi đang dùng

Hiện tại đã là cặp IPv4 "nhanh nhất tổng thể" với Cloudflare ở IPv6, nên thay
đổi duy nhất đáng làm là IPv6 chính: Google `2001:4860:4860::8888` đo được
5.8 ms so với 8.6 ms của Cloudflare. Khoảng cách đủ nhỏ để cả hai đều hợp lý;
tôi sẽ chọn Google và dừng ở đó.

Một lần benchmark kết thúc khi nó bảo bạn dừng. Lần này đã làm được việc đó: DNS
giờ là bài toán 10 mili giây đã xử lý xong, còn 30 Mbps thiếu hụt là câu chuyện
với nhà mạng, không phải với trang cài đặt.
