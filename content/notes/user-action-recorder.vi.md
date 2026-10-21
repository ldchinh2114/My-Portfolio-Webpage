---
title: "Một công cụ nhỏ để ghi và phát lại thao tác chuột, bàn phím"
date: "2026-10-21"
summary: "CopyUserAction ghi lại thao tác chuột và bàn phím, rồi phát lại đúng nhịp độ — không cần viết script."
tags: ["C#", "Avalonia", "Desktop"]
downloads:
  - label: "CopyUserAction cho Windows (x64)"
    href: "/downloads/copyuseraction.exe"
    meta: "EXE · 19.7 MB"
---

**CopyUserAction** là một ứng dụng Windows nhỏ — cửa sổ có tên *User Action
Recorder*. Bấm **Record**, thao tác như bình thường, bấm **Stop**, rồi bấm
**Replay** để ứng dụng lặp lại đúng chuỗi chuột và bàn phím với nhịp độ gần như
ban đầu.

Nó ghi lại:

- di chuyển chuột
- nhấn và nhả chuột trái, phải, giữa
- cuộn chuột
- nhấn và nhả phím
- khoảng dừng giữa các thao tác

Dữ liệu chỉ nằm trong bộ nhớ. Công cụ dành cho những việc mà viết script còn tốn
công hơn làm tay một lần: điền lại một biểu mẫu, đi qua một luồng kiểm thử, dựng
lại một demo, hoặc lặp một chuỗi thao tác ngắn trong game.

## Cửa sổ làm việc

| Nút / trường | Tác dụng |
| --- | --- |
| Record / Stop | Bắt đầu và dừng ghi. |
| Replay / Stop Replay | Phát lại chuỗi đã ghi một lần hoặc nhiều lần. |
| Repeat iterations | Số lần lặp khi không bật Infinite. Tối thiểu 1, mặc định 1. |
| Infinite Replay | Lặp đến khi bấm phím dừng. |
| Stop Hotkey | Một phím đơn để huỷ phát lại. Mặc định `P`; `F1`, `Esc`, `Enter`, `Ctrl`, `Alt`, `Shift` cũng dùng được. |
| Always on Top | Giữ cửa sổ nổi trên các ứng dụng khác. |
| Timer | Hiển thị thời gian ghi hoặc phát lại. |
| Total Replays | Đếm số lần phát lại đã hoàn tất trong phiên. |

## Cách dùng

1. Tải và chạy `CopyUserAction.exe`. Bản này tự chứa runtime nên không cần cài
   .NET.
2. Bấm **Record**. Đồng hồ bắt đầu chạy và nút đổi thành **Stop**.
3. Làm việc một lần. Giữ nguyên những khoảng dừng bạn muốn — chúng cũng được ghi
   lại.
4. Quay lại cửa sổ và bấm **Stop**.
5. Đặt **Repeat iterations**, hoặc tick **Infinite Replay**.
6. Chọn **Stop Hotkey** mà chuỗi thao tác không dùng tới.
7. Bấm **Replay** và để nó chạy. Bấm phím dừng bất cứ lúc nào để huỷ.
8. Tick **Always on Top** nếu cửa sổ có thể bị che trong lúc phát lại.

## Những điều cần biết

- Bản ghi **không được lưu**. Đóng ứng dụng là mất; hiện chưa có tệp dự án, xuất
  hay nhập.
- Phát lại dùng toạ độ màn hình tuyệt đối. Đổi độ phân giải, tỉ lệ hiển thị, bố
  trí màn hình hoặc vị trí cửa sổ có thể làm cú click rơi sai chỗ.
- Không có trình sửa. Muốn đổi một bước, hãy ghi lại chuỗi.
- Phím dừng là **một phím đơn**, không phải tổ hợp, và có hiệu lực toàn cục
  trong lúc phát lại. Đừng chọn phím mà chuỗi thao tác cần dùng.
- Một số cửa sổ chạy quyền cao sẽ bỏ qua input mô phỏng trừ khi CopyUserAction
  cũng chạy bằng quyền quản trị.
- Tệp thực thi chưa ký số, nên Windows SmartScreen hoặc phần mềm diệt virus có
  thể hỏi xác nhận. Chỉ chạy bản bạn tin tưởng.
- Công cụ gửi input chuột và bàn phím thật. Đừng phát lại bản ghi không phải do
  bạn tạo.

## Bên trong

Ứng dụng viết bằng C# trên .NET 10, giao diện Avalonia. Phần ghi và mô phỏng
input toàn cục dùng [SharpHook](https://github.com/TolikPylypchuk/SharpHook), bọc
libuiohook. Bản phát hành là single-file, self-contained cho Windows x64, nên tệp
tải xuống khoảng 19,7 MB.

Tệp chạy nằm trong phần tải xuống bên dưới. Hãy thử với một chuỗi ngắn và vô hại
trước.
