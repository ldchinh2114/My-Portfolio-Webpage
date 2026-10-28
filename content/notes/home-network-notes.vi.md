---
title: "Hai lỗi cấu hình router khiến trang không tải được"
date: "2026-10-28"
summary: "MSS trên PPPoE và IPv6 WAN mới cấu hình một nửa — mỗi lỗi đủ để phá duyệt web, và khi có cả hai thì chúng che nhau."
tags: ["Networking", "IPv6", "DNS", "MTU"]
---

Trang treo vài giây trước khi tải, hoặc không bao giờ tải xong. Có site vào được,
có site không. Speed test lúc nào chạy cũng ra số bình thường, nên lỗi trông như
ngẫu nhiên. Buổi tối thì tệ hơn.

Hai lỗi cấu hình độc lập nằm sau đó. Mỗi lỗi tự nó đã đủ phá duyệt web, và khi có
cả hai thì chúng che nhau.

## Trước khi đổi bất cứ thứ gì

- Đừng hạ MSS trên WAN IPoE/DHCP có MTU 1500. Clamp về 1432 ở đó chỉ mất
  throughput vô ích. Chỉ clamp khi đường là PPPoE (1492), hoặc khi đo được path
  MTU thấp hơn.
- Đừng bật IPv6 nếu ISP không delegate prefix. Router quảng bá một prefix mà nó
  không route được còn tệ hơn tắt IPv6: client ưu tiên IPv6, bị treo, rồi mới
  fallback.
- Đừng bật QoS trên đường có bufferbloat phẳng. Thêm policer vào một kết nối vốn
  đã giữ latency ổn dưới tải chỉ tạo thêm chỗ hỏng.
- Đừng tin mất gói ICMP khi chẩn đoán router nhà. Router rate-limit lưu lượng gửi
  đến chính nó, nên con số mất gói đo kiểu đó vô nghĩa.

## Lỗi một: lệch MTU và MSS

PPPoE tốn 8 byte overhead, nên path MTU thật là 1492. Máy client vẫn mặc định
1500 và gửi packet đầy đủ. Nếu MSS trên router để Auto và không clamp, packet quá
cỡ bị drop, gói ICMP "fragmentation needed" bị mất, và Path MTU Discovery hỏng
âm thầm.

Triệu chứng khá đặc trưng: TLS handshake không bao giờ xong. Request nhỏ chạy
được, response lớn thì treo.

| Kích thước packet | Kết quả |
| --- | --- |
| 1500 byte (payload 1472) | "Packet needs to be fragmented but DF set" |
| 1492 byte (payload 1464) | Trả lời bình thường |

Cách sửa: đặt MSS thành Custom, giá trị 1432 — 1492 trừ 40 byte header IPv6 và
20 byte header TCP.

## Lỗi hai: IPv6 cấu hình một nửa

Phía LAN đúng: bật RA, bật SLAAC, DHCPv6 stateless, cờ Other bật, cờ Managed
tắt. Đó là thiết kế chuẩn "địa chỉ do SLAAC, DNS do DHCPv6".

Phía WAN lại để SLAAC. SLAAC chỉ nghe router advertisement; nó không xin được
prefix delegation. Prefix Delegation có bật nhưng bị bỏ qua âm thầm.

Kết quả: một prefix ULA được quảng bá, không có global prefix, không có default
route — IPv6 ở trạng thái nửa bật. Chuyển WAN IPv6 sang DHCPv6 là xong.

## Quy tắc DNS quan trọng hơn nhà cung cấp

Hai quy tắc quan trọng hơn việc chọn ai.

**Dùng một nhà cung cấp cho cả hai stack.** Nếu IPv4 trỏ về một operator và IPv6
trỏ về operator khác, câu trả lời A và AAAA đến từ hai góc nhìn mạng khác nhau và
định tuyến CDN sẽ hỏng. Trên cùng một hostname, tôi đo được 25 ms từ một resolver
và 193 ms từ resolver khác, cùng domain, cùng thời điểm.

**Đánh giá định tuyến CDN, không phải tốc độ lookup.** Mọi resolver đều trả lời
trong 3–9 ms. Con số đó không nói lên gì. Điều quan trọng là câu trả lời trỏ đến
CDN node nào.

| Resolver | Apple | Shopee | Kết luận |
| --- | --- | --- | --- |
| Google | 85 ms | 27 ms | Cân bằng nhất |
| Resolver của ISP | 25 ms | 75 ms | Nhanh với Apple, yếu với Shopee |
| Cloudflare | 191 ms | 27 ms | Shopee tốt, Apple kém |
| Quad9 | 192 ms | 76 ms | Yếu cả hai |

Google chính, Cloudflare phụ, giữ nguyên thứ tự cho cả IPv4 và IPv6. Chỉ chọn
Cloudflare nếu riêng tư quan trọng hơn định tuyến, hoặc resolver của ISP nếu lưu
lượng chủ yếu là dịch vụ Apple.

## Làm cho IPv6 chạy thật

1. WAN connection, Get IPv6 Address: DHCPv6, không phải SLAAC.
2. Prefix Delegation: bật.
3. LAN, Enable RA: bật.
4. LAN, Enable SLAAC: bật.
5. DHCPv6 server: stateless, cờ Other bật, cờ Managed tắt.
6. Lưu, rồi reconnect WAN để prefix delegation được xin lại.

## Cách kiểm chứng

- **MSS:** request HTTPS lặp lại phải thành công mọi lần. Test bằng HTTPS, không
  phải ping — MSS chỉ ảnh hưởng TCP, ping sẽ vẫn fail.
- **IPv6:** có global address, `::/0` xuất hiện trong bảng routing, trạng thái
  neighbour của gateway là Reachable chứ không phải Incomplete hay Probe, và một
  địa chỉ IPv6 công cộng trả lời ping.
- **Sức khỏe chung:** latency lúc rảnh và lúc full load chỉ nên lệch vài mili
  giây, và bộ đếm TCP retransmission gần như không đổi qua một lần tải lớn.

## Thứ tôi để nguyên: trang QoS

Bảng DSCP class mặc định gần như không khớp với gì thật. Lưu lượng bình thường là
DSCP 0 cộng TCP, không khớp rule nào trong bốn rule mặc định. Băng thông uplink có
thể bị đặt thấp hơn tốc độ thật của đường. Và dồn toàn bộ lưu lượng vào một queue
trọng số thấp là chỉnh sửa duy nhất có thể phản tác dụng: nếu firmware không chia
lại trọng số queue chưa dùng, nó tự giới hạn kết nối mà không vì lý do gì.

Để trang ở mặc định trừ khi có một vấn đề đo được mà nó giải quyết.

## Còn gì chưa xong

Throughput vẫn tụt vào buổi tối. Traceroute cho 1 ms đến router, khoảng 25 ms đến
backbone của ISP và 37 ms đến phía bên kia, không mất gói và không
retransmission.

Mẫu đó là nghẽn bên trong ISP. Không gì trên mạng nhà gây ra nó, và không gì
trong nhà sửa được. Giữ log throughput và latency nếu cần báo cho nhà mạng.
