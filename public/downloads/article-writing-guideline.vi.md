# Hướng dẫn viết bài

Đây là hướng dẫn để viết và xuất bản ghi chú trên **ldchinh.vercel.app**. Mỗi
ghi chú là một bài viết ngắn, kể ở ngôi thứ nhất, về một việc mình đã học, đã
sửa, đã làm hoặc muốn chia sẻ. Bài nào cũng được xuất bản bằng cả tiếng Việt và
tiếng Anh.

## 1. Chọn chủ đề và slug

- Mỗi ghi chú chỉ nên có một ý. Nếu hai ý cần kết luận riêng, hãy viết thành hai
  ghi chú.
- Chọn slug trước khi viết: chỉ dùng chữ thường, số và dấu gạch nối (ví dụ
  `fix-hydration-mismatch`).
- Slug chính là URL công khai: `/notes/<slug>`. Đổi slug về sau sẽ làm hỏng mọi
  liên kết đã có.
- Chọn ngày một lần, theo định dạng `YYYY-MM-DD`. Hai tệp ngôn ngữ phải ghi cùng
  một ngày.

## 2. Tạo hai tệp

Mỗi ghi chú là một cặp tệp dùng chung slug:

```text
content/notes/<slug>.vi.md   →  /notes/<slug>  (tiếng Việt)
content/notes/<slug>.en.md   →  /notes/<slug>  (tiếng Anh)
```

- Bắt buộc phải có cả hai tệp. Thiếu một tệp thì bản build sẽ lỗi.
- Đuôi `.vi.md` / `.en.md` quyết định ngôn ngữ. Không có khóa `language` trong
  frontmatter.
- Thêm dấu `_` vào **cả hai** tên tệp để giữ bản nháp ngoài bản build
  (`_my-note.vi.md`, `_my-note.en.md`). Chỉ thêm vào một tệp vẫn làm cặp tệp bị
  lỗi.
- Không tạo thư mục theo ngày hay theo ngôn ngữ: trình đọc lấy trực tiếp từ
  `content/notes/`.

## 3. Điền frontmatter

Hai tệp mở đầu cùng một cấu trúc, mỗi tệp viết theo ngôn ngữ của mình:

```yaml
---
title: "Tiêu đề ngắn và cụ thể"
date: "2026-08-14"
summary: "Một câu nói rõ ghi chú này viết về gì và hữu ích ở đâu."
tags: ["Next.js", "AI"]
downloads:
  - label: "Tệp khởi đầu"
    href: "/downloads/starter-files.zip"
    meta: "ZIP"
---
```

| Khóa | Bắt buộc | Quy tắc |
| --- | --- | --- |
| `title` | có | Cụ thể, tránh "Ghi chú #3". Viết riêng cho từng ngôn ngữ. |
| `date` | có | `YYYY-MM-DD`; giống nhau ở cả hai tệp. Dùng để sắp xếp (mới nhất trước). |
| `summary` | nên có | Một câu, khoảng 12–25 từ. Hiển thị trên thẻ ghi chú và trong meta description. |
| `tags` | không bắt buộc | 2–5 tên chủ đề ngắn, viết trong mảng cùng dòng. |
| `downloads` | không bắt buộc | Danh sách `label` + `href`; `meta` tùy chọn. |

Chi tiết:

- Trình đọc frontmatter được viết tối giản: chỉ hỗ trợ `key: value` phẳng, mảng
  cùng dòng và danh sách thụt lề. Không dùng anchor, chuỗi nhiều dòng hay object
  lồng nhau.
- Tags được tách bằng dấu phẩy, nên không đặt dấu phẩy trong tên tag.
- `href` phải bắt đầu bằng `/` (tệp trong `public/`) hoặc `https://`. Tên tệp
  trần hoặc `//host` sẽ bị bỏ qua.
- Mục download thiếu `label` hoặc `href` sẽ bị bỏ qua. Chỉ trỏ tới tệp đã được
  commit.
- Không có trường thứ tự thủ công: ngày mới nhất đứng trước, cùng ngày thì xếp
  theo tiêu đề tiếng Việt.

## 4. Viết nội dung

- Bắt đầu từ `##`. Trang đã dùng `title` làm `h1`, nên không thêm tiêu đề `#`
  trong nội dung.
- Mở bằng một đoạn ngắn: vấn đề, điều đã thay đổi, hoặc điều người đọc sẽ nhận
  được. Tránh "Trong bài này tôi sẽ…".
- Dùng `##` cho từng mục, mỗi mục một ý. Chỉ dùng `###` khi mục thật sự có các
  phần con.
- Ưu tiên chi tiết cụ thể: nội dung lỗi, phiên bản, câu lệnh, đường dẫn tệp,
  đánh đổi. Ghi chú càng dễ làm lại càng hữu ích.
- Dùng danh sách cho các bước và lựa chọn, bảng để so sánh, `>` cho lưu ý hoặc
  ghi chú bên lề, và đường kẻ ngang một cách tiết chế.
- Ghi ngôn ngữ cho mỗi khối mã để người đọc biết đó là gì. Mã hiển thị trên nền
  tối và không có tô màu cú pháp, nên giữ đoạn mã ngắn và tập trung.
- Liên kết hoạt động như bình thường. Liên kết tương đối như `/notes/...` mở
  trong tab hiện tại; liên kết `http(s)://` mở tab mới với
  `rel="noopener noreferrer"`.
- Ảnh dùng Markdown chuẩn (`![mô tả](/images/example.png)`) và luôn có alt text
  thật. Đặt tệp trong `public/`.
- Độ dài: hướng tới 1–8 phút đọc (khoảng 200–1.600 từ). Thời gian đọc được tính
  tự động khoảng 200 từ/phút và không tính khối mã; không có trường để tự đặt.

### Giọng văn

- Ngôi thứ nhất, ngôn ngữ đơn giản, ví dụ cụ thể.
- Giải thích *vì sao*, không chỉ *làm gì*. Một câu lệnh thiếu bối cảnh sẽ khó
  dùng lại sau này.
- Viết bản tiếng Việt và tiếng Anh riêng. Không đăng bản dịch máy mà chưa biên
  tập.
- Giữ nguyên sự kiện, liên kết và con số ở cả hai bản.

## 5. Thêm tệp tải xuống

1. Đặt tệp thật trong `public/downloads/` (tạo thư mục nếu chưa có).
2. Nén thư mục thành `.zip` trước khi liên kết; không thể tải một thư mục.
3. Trỏ tới tệp bằng `/downloads/<file>` trong **cả hai** tệp ngôn ngữ.
4. Mỗi ngôn ngữ có `label` riêng (và `meta` nếu hữu ích). `href` thường trỏ tới
   cùng một tệp; chỉ trỏ tới tệp riêng khi bản thân tệp tải xuống cũng được
   dịch.
5. Liên kết `https://` mở tab mới; tệp nội bộ tải xuống ngay.

Thẻ tải xuống hiển thị sau nội dung và đổi theo ngôn ngữ của ghi chú.

## 6. Giữ hai bản khớp nhau

- Cùng slug, cùng ngày, cùng liên kết, cùng sự kiện.
- Dịch `title`, `summary`, `tags`, nhãn tải xuống và nội dung.
- Nếu một bản đổi con số, câu lệnh hoặc liên kết, cập nhật bản còn lại trong
  cùng một commit.
- Nút chuyển VI/EN trên trang ghi chú đổi bài viết và đồng thời đặt ngôn ngữ cho
  cả trang, nên navbar và danh sách Notes luôn khớp. Lựa chọn được ghi nhớ trong
  `localStorage`.

## 7. Xuất bản và kiểm tra

1. Tạo cả hai tệp và các tệp tải xuống.
2. Chạy `npm run build`. Bản build báo lỗi `[notes]` khi thiếu một tệp, thiếu
   `title`/`date`, ngày sai định dạng hoặc hai ngày khác nhau.
3. Kiểm tra `/notes` và `/notes/<slug>` với nút VI/EN theo cả hai chiều.
4. Commit hai tệp Markdown cùng các tệp tải xuống, push lên `master` và để
   Vercel build lại.
5. Mở URL thật và kiểm tra lại nút chuyển ngôn ngữ cùng các tệp tải xuống.

## 8. Danh sách kiểm tra

- [ ] Có đủ `<slug>.vi.md` và `<slug>.en.md`, cùng slug và cùng ngày.
- [ ] `title`, `summary`, `tags` và nội dung đã viết bằng cả hai ngôn ngữ.
- [ ] Nội dung bắt đầu từ `##` và có đoạn mở đầu rõ ràng.
- [ ] Khối mã ghi ngôn ngữ; liên kết và ảnh đều hoạt động.
- [ ] Mọi `downloads.href` đều có tệp trong `public/downloads/` và trả về 200.
- [ ] `npm run build` chạy thành công.
- [ ] Đã kiểm tra cả hai ngôn ngữ sau khi deploy; không có cuộn ngang ở 375px.
