# DÀN Ý CHƯƠNG TRÌNH HỌC TẬP TRỰC QUAN - EDUPLAY

Dàn ý này được thiết kế để tối ưu cho việc tạo nội dung tự động bằng AI, chia làm 2 giai đoạn trọng tâm: Lớp 1 và Ôn tập Lớp 5.

---

## PHẦN 1: TIẾNG VIỆT LỚP 1 (GIAI ĐOẠN LÀM QUEN)

### Chủ đề 1: Thế giới Chữ cái vui nhộn
- **Slide 1: Nhận diện chữ cái (A, Ă, Â)**: Hình ảnh minh họa (Con cá, Con tắc kè, Con gấu).
- **Slide 2: Cách phát âm và dấu thanh**: Quy tắc dấu huyền, sắc, hỏi, ngã, nặng.
- **Slide 3: Ghép vần cơ bản**: Ghép âm đầu (B, C, D) với nguyên âm.
- **Slide 4: Từ ngữ quanh bé**: Các đồ vật trong nhà (Bàn, Ghế, Cửa).
- **Slide 5: Câu ngắn đầu tiên**: "Bé đi học", "Mẹ đi chợ".

### Chủ đề 2: Âm vần và Vần ghép
- **Slide 1: Vần xuôi**: an, am, ap.
- **Slide 2: Vần ngược**: na, ma, pa.
- **Slide 3: Vần khó**: uy, uya, oong.
- **Slide 4: Bài đọc ngắn**: Truyện ngụ ngôn ngắn 20-30 chữ.
- **Slide 5: Trò chơi tìm chữ**: Tìm từ chứa vần vừa học.

---

## PHẦN 2: ÔN TẬP TOÁN LỚP 5 (CUỐI CẤP)

### Chủ đề 1: Phân số và Số thập phân
- **Slide 1: Ôn tập 4 phép tính với phân số**: Quy đồng, rút gọn.
- **Slide 2: Số thập phân**: Cấu tạo, cách so sánh và làm tròn.
- **Slide 3: Chuyển đổi đơn vị**: Độ dài, khối lượng, diện tích (Số thập phân).
- **Slide 4: Bài toán tỷ số phần trăm**: Tính giá trị %, tìm số gốc.
- **Slide 5: Giải toán đố**: Toán chuyển động (v, t, s) và toán năng suất.

### Chủ đề 2: Hình học và Chu vi - Diện tích
- **Slide 1: Hình tam giác và Hình thang**: Công thức và ví dụ trực quan.
- **Slide 2: Hình tròn**: Tính chu vi (C) và diện tích (S) với số Pi.
- **Slide 3: Hình hộp chữ nhật & Hình lập phương**: Diện tích xung quanh, toàn phần.
- **Slide 4: Thể tích (V)**: Đơn vị đo m3, dm3, cm3 và cách quy đổi.
- **Slide 5: Tổng hợp toán thực tế**: Tính thể tích bể nước, sơn tường phòng.

---

## PHƯƠNG THỨC GIAO TIẾP VÀ TÍCH HỢP

Để sử dụng dàn ý này với các công cụ khác (như Stable Diffusion, Midjourney, hoặc TTS khác), hãy sử dụng cấu trúc JSON sau:

### 1. Script Giao tiếp (API/JSON Structure)
Mỗi slide nên có 3 trường dữ liệu chính:
```json
{
  "slide_id": "L1_C1_S1",
  "text": "Đây là âm A. Chữ A trong từ Con Cá.",
  "visual_prompt": "Vector illustration, cute fish, bright colors, classroom style, high resolution",
  "audio_config": {
    "speed": 1.1,
    "pause_after_comma": 0.3,
    "pause_after_period": 0.8
  }
}
```

### 2. Tích hợp dữ liệu
- **File đầu vào**: `prompts.json` (Dùng để điều khiển NanoBanana tạo ảnh).
- **File đầu ra Audio**: `audio_data.json` (Dùng để script `generate_audio.py` tạo Karaoke).
- **Frontend**: `viewer.html` sẽ tự động đọc các file này để hiển thị.

---

## HƯỚNG DẪN DÀNH CHO CÔNG CỤ KHÁC
1. **Dùng Stable Diffusion**: Lấy `visual_prompt` từ file này để generate ảnh 16:9.
2. **Dùng TTS cao cấp (Azure/ElevenLabs)**: Dùng trường `text` và xuất file `.mp3` kèm theo file timestamp dạng JSON (word-level timestamps).
3. **Copy vào EduPlay**: Đưa ảnh vào thư mục `images/`, audio vào `audio/`, hệ thống sẽ tự nhận diện.
