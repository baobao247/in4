# bari0xit Portfolio — Changelog & Architecture Report

## 1. Deep Audit & Bugs Fixed
- **Điều hướng Offline mượt mà (Smart Local Links)**: Tự động phát hiện môi trường chạy nội bộ (`file:///`, `localhost`, `127.0.0.1`) để chuyển đổi toàn bộ 9 liên kết dự án sang file cục bộ tương ứng (`../<project>/index.html`) thay vì mở ra ngoài GitHub Pages khi người dùng chạy offline.
- **Ảnh đại diện ngoại tuyến dự phòng**: Tích hợp trực tiếp file `1000183171.png` trong thư mục nội bộ kèm fallback onerror sang URL lưu trữ đám mây.
- **Đồng bộ hóa Theme Mode**: Khắc phục hiện tượng nháy sáng (FOUC) khi tải trang bằng cách đọc trạng thái theme từ LocalStorage trước khi render DOM.

---

## 2. Kiến trúc Tái Cấu Trúc (Architecture Refactoring)
Phân tách cấu trúc nguyên khối thành các module độc lập:
```
in4/
├── css/
│   └── style.css            # Toàn bộ biến theme, Glassmorphism, card showcase & ambient glow
├── js/
│   └── app.js               # Theme switch, bộ lọc dự án, hiệu ứng ambient orbs & smart local links
├── 1000183171.png           # Avatar cục bộ ngoại tuyến
├── index.html               # File HTML5 ngữ nghĩa, gọn gàng và tương thích cao
└── CHANGELOG.md             # Tài liệu kiểm toán và hướng dẫn sử dụng
```

---

## 3. Cải tiến UI/UX & Hiệu năng
- **Hiệu ứng Glassmorphism & Ambient Orbs**: Đèn nền mềm mại chuyển động nhẹ theo chuyển động cuộn trang.
- **Bộ lọc danh mục dự án tức thì**: Phân loại theo *Tất cả*, *Công cụ (Tools)*, *Học tập (Study)*, *Trò chơi (Games)*.
- **Nút điều hướng trung tâm Master Hub**: Dễ dàng quay lại trang chủ hệ sinh thái Bari Hub.

---

## 4. Tính năng mới bổ sung
1. **🧭 Tích hợp Master Hub Link**: Nút nổi quay về Master Hub ngay trên thanh công cụ góc trên.
2. **🔗 Smart Local Link Rewriter**: Trải nghiệm xem mượt mà cả online trên GitHub Pages lẫn offline trên máy tính cá nhân.
3. **✨ Thẻ tính năng V2 cho từng dự án**: Giới thiệu rõ nét các nâng cấp mới của 9 dự án vệ tinh.