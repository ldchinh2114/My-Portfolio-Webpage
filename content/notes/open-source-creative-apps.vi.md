---
title: "Bảy repo sáng tạo mã nguồn mở, cái nào tận dụng được"
date: "2026-10-29"
summary: "Bảy app sáng tạo mã nguồn mở kèm license và tình trạng thật: bốn cái dùng được ngay, hai cái phải cân nhắc, một cái đã chết."
tags: ["Open source", "License", "Công cụ"]
---

Một thread trên X giới thiệu bảy "open source creative apps". Mình mở cả bảy để xem license và repo còn sống hay không, vì hai thứ đó quyết định có tận dụng được hay chỉ để ngắm.

## Tổng hợp

| Repo | Dùng để làm gì | License | Tình trạng |
| --- | --- | --- | --- |
| [Motion Canvas](https://github.com/motion-canvas/motion-canvas) | Dựng animation bằng TypeScript, có editor xem trước | MIT | Chậm lại từ 2/2025 |
| [Blockbench](https://github.com/JannisX11/blockbench) | Model 3D low-poly, chạy trên web và desktop | GPL-3.0 | Đang phát triển, v5.2.2 (10/2026) |
| [Material Maker](https://github.com/RodZill4/material-maker) | Texture procedural bằng node graph, xuất PBR | MIT | Đang phát triển, v1.8 (10/2026) |
| [MyPaint](https://github.com/mypaint/mypaint) | Vẽ tranh, engine cọ cho bảng vẽ | GPL | Còn dùng |
| [Redlamp](https://github.com/pdcgomes/redlamp) | Sửa ảnh RAW native trên macOS | MPL-2.0 | Alpha 0.3.4 |
| [Powermove](https://trypowermove.com) | Motion editor có agent viết thêm extension | Chưa rõ | Không xác nhận được |
| [Haiku Animator](https://github.com/HaikuTeam/animator) | Figma/Sketch → animation code | AGPL | Ngừng từ 10/2021 |

## Tận dụng được gì

- **Motion Canvas (MIT)** — giấy phép thoáng nhất nhóm: nhúng vào sản phẩm thương mại không phải mở source. Package `player` là custom element nên gắn animation vào một trang web rất gọn. Đổi lại, repo gần như đứng yên từ 2/2025, lỗi phát sinh thì tự sửa.
- **Material Maker (MIT)** — dùng được cả code lẫn ý tưởng. Toàn bộ editor node graph viết bằng GDScript trên Godot; đọc để học cách dựng graph editor có lẽ là hướng thực tế hơn là fork cả app.
- **Blockbench (GPL-3.0)** — dùng làm công cụ thì tự do, chỉ khi phát hành bản fork mới phải mở source. Plugin cắm vào API thì được phép đóng.
- **Redlamp (MPL-2.0)** — MPL chỉ buộc mở những file đã sửa, phần còn lại giữ kín được, nên dễ tận dụng hơn GPL. Đây là app Swift/Metal chạy macOS, giá trị nằm ở tầng kỹ thuật: pipeline RAW tự viết, color science, mask AI chạy on-device.
- **MyPaint (GPL)** — engine cọ tốt, nhưng GPL lan sang toàn bộ sản phẩm nếu nhúng. Chỉ nên dùng như app độc lập hoặc đọc thuật toán rồi tự viết lại.

## Không nên tính vào

- **Haiku Animator** — AGPL, và đã chết: Haiku đóng cửa 8/2021, commit cuối 13/10/2021, README tự nhận *"in its current state it has deep flaws"*.
- **Powermove** — trang chủ không nhắc license hay repo nào. Chưa có bằng chứng mở mã nguồn, nên chưa xếp vào danh sách tận dụng được.
