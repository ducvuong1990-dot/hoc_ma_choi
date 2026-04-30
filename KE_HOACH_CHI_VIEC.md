# KẾ HOẠCH TRIỂN KHAI & PHÂN CHIA NHIỆM VỤ (GEMINI & CODEX)

Tài liệu này xác định danh sách các bài học cần làm mới và phân chia công việc giữa **Gemini** (Tôi - Chuyên gia nội dung/Kịch bản) và **Codex** (Chuyên gia lập trình/Hệ thống).

---

## 1. DANH SÁCH BÀI HỌC TRỌNG TÂM (Priority 1)

### Khối Lớp 1 (Làm quen & Đánh vần)
1.  **Chữ cái lấp lánh (A, B, C)**: Giới thiệu nhân vật Capybara và bảng chữ cái.
2.  **Gia đình dấu thanh**: Câu chuyện về các chiếc mũ (Sắc, Huyền, Hỏi, Ngã, Nặng).
3.  **Vườn thú âm vần (an, am, ap)**: Ghép vần thông qua tên các con vật.
4.  **Toán vui 0-10**: Đếm số cùng Nhện Nhí (Tương tác tơ nhện).
5.  **Kỹ năng: Bé đi đường an toàn**: Bài học về đèn giao thông và vạch kẻ đường.

### Khối Lớp 5 (Ôn tập & Tư duy)
1.  **Vương quốc Số thập phân**: Cách đọc, viết và ứng dụng khi đi siêu thị.
2.  **Đua xe cùng Rùa máy**: Bài toán về vận tốc, quãng đường, thời gian.
3.  **Tháp Hình học của Dơi Đêm**: Diện tích hình thang, hình tròn (Sử dụng hiệu ứng đèn pin).
4.  **Hào khí Việt Nam**: Ôn tập các mốc lịch sử 1930, 1945, 1954, 1975 bằng thơ lục bát.
5.  **Địa lý: Dải chữ S thân yêu**: Đặc sản và danh thắng 3 miền.

---

## 2. PHÂN CHIA NHIỆM VỤ

### 🤖 NHIỆM VỤ CỦA GEMINI (Tôi thực hiện)
*Chủ đạo về Kịch bản, Ngôn ngữ và Trí tuệ nội dung.*
- **Soạn kịch bản chi tiết**: Viết lời dẫn (Intro/Outro) theo giọng Bắc chuẩn Kinh Bắc.
- **Thiết kế Prompt hình ảnh**: Tạo Prompt cho NanoBanana (Ảnh Bento Grid, có text tiếng Việt, phong cách vector cao cấp).
- **Soạn bộ câu hỏi Quiz**: Thiết kế 3-5 câu hỏi trắc nghiệm tương tác cho mỗi bài.
- **Làm sạch văn bản Audio**: Xử lý dấu câu để gTTS đọc mượt mà, không bị vấp.
- **Cập nhật PRD**: Ghi lại lịch sử thay đổi và các quyết định thiết kế mới.

### 💻 NHIỆM VỤ CỦA CODEX (Công cụ lập trình thực hiện)
*Chủ đạo về Code, Automation và Hiệu ứng.*
- **Nâng cấp viewer.html**: Viết code cho hệ thống Quiz (hiển thị câu hỏi, chấm điểm, pháo hoa khi thắng).
- **Tối ưu hóa generate_audio.py**: Hoàn thiện thuật toán bôi màu Karaoke word-level.
- **Automation Script**: Cập nhật `auto_generate_lesson.js` để tự động đẩy bài mới vào thư viện và catalog.
- **Xử lý Font chữ**: Đảm bảo toàn bộ CSS hiển thị đúng font giáo dục tiếng Việt trên ảnh và giao diện.
- **Hệ thống Backup**: Viết lệnh tự động phân loại và sao lưu ảnh vào các folder `lop_1`, `lop_5`.

---

## 3. PHƯƠNG THỨC PHỐI HỢP
1.  **Gemini** tạo file `lesson_config.json` chứa kịch bản và câu hỏi.
2.  **Codex** đọc file này để generate ra các file `.html`, `.mp3` và `.png` tương ứng.
3.  **Gemini** kiểm tra lại (Review) chất lượng audio và hình ảnh cuối cùng.

---
**Ghi chú:** Tôi đã sẵn sàng bắt đầu với bài **"Chữ cái lấp lánh (A, B, C)"** cho Lớp 1. Bạn có muốn Codex bắt đầu nâng cấp hệ thống Quiz trước không?
