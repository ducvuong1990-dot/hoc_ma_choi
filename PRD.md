# 📄 TÀI LIỆU YÊU CẦU SẢN PHẨM (PRD): HỌC MÀ CHƠI (VŨ TRỤ KINH BẮC)

## 1. TỔNG QUAN DỰ ÁN
* **Tên dự án:** Học mà chơi.
* **Tầm nhìn:** Nền tảng Edutech cá nhân hóa, sử dụng AI và Gamification để biến việc học thành hành trình thám hiểm không áp lực.
* **Đối tượng:** Học sinh Lớp 1 (Đánh vần, Tập viết) và Lớp 5 (Ôn thi cuối cấp).
* **Đặc trưng:** Giao tiếp hoàn toàn bằng **Giọng Bắc chuẩn (Kinh Bắc - Hà Nội)**, tích hợp AI tương tác thời gian thực.

---

## 2. KIẾN TRÚC KỸ THUẬT (TECH STACK)
* **Nền tảng:** Web Application (React/Next.js).
* **Xử lý AI (Tối ưu cho NVIDIA RTX 3060):**
    * **STT (Speech-to-Text):** Faster-Whisper (Local) để nhận diện giọng đọc của bé.
    * **TTS (Text-to-Speech):** VITS hoặc Piper (Local) chạy trên GPU để phản hồi giọng Bắc tự nhiên.
    * **LLM:** Gemini API đóng vai trò "Giám khảo thông thái" đánh giá phong cách đọc và gợi ý nội dung.
* **Cơ chế đặc biệt:** * **Adaptive Difficulty:** AI tự điều chỉnh tốc độ đua/độ khó dựa trên năng lực của bé.
    * **Local Processing:** Đảm bảo quyền riêng tư và tốc độ phản hồi giọng nói tức thì.

---

## 3. HỆ THỐNG NHÂN VẬT & TƯƠNG TÁC

| Nhân vật | Hình mẫu | Vai trò | Phong cách giao tiếp |
| :--- | :--- | :--- | :--- |
| **Capybara** | Mascot | Người chơi (Avatar của bé) | Hiền lành, biểu cảm hài hước khi bị phạt (đội mũ chú hề). |
| **Thần linh Số học** | Fairy | Người hướng dẫn (Guide) | Dịu dàng, mẫu mực, dùng gậy phép vẽ bài giảng. |
| **Nhện Nhí** | Spider-Man | Hỗ trợ Toán học & Tập viết | Năng động, dùng tơ dẫn đường, dạy mẹo tính nhẩm. |
| **Dơi Đêm** | Batman | Hỗ trợ Hình học & Logic | Trầm tĩnh, soi đèn pin tìm chi tiết ẩn, giải mã bài toán khó. |
| **Siêu Sao** | Superman | Ăn mừng & Khích lệ | Hào sảng, bế Mascot bay lượn khi bé hoàn thành nhiệm vụ. |
| **Kuromi** | Rival | Đối thủ lém lỉnh | Nghịch ngợm, thách đấu PvP, hay ra đề khó nhằn. |
| **Sanrio/Baby Three** | Companion | Tặng quà & Ghi chú | Đáng yêu, thì thầm bí mật, tặng sticker hiếm. |

---

## 4. CẤU TRÚC NỘI DUNG CHI TIẾT

### 4.1. Lộ trình Lớp 1: "Khu rừng Âm thanh"
* **Đánh vần:** Nhận diện âm qua bong bóng xà phòng. Ghép vần bằng tơ nhện của Nhện Nhí.
* **Tập viết chữ & số:**
    * Bé tô theo nét đứt, tơ nhện dính chặt và làm sáng nét chữ.
    * Viết xong số, con số biến hình (Morphing) thành đồ vật (Số 3 -> 3 cái khiên siêu nhân).
* **Sân khấu Tập đọc:** AI nhận xét giọng đọc, sửa lỗi phát âm L/N đặc trưng của vùng Kinh Bắc.

### 4.2. Lộ trình Lớp 5: "Con đường Đỉnh cao"
* **Toán học:** Số thập phân, Tỉ số %, Hình học (Tháp của Dơi Đêm), Toán chuyển động (Đua cùng Rùa máy).
* **Tiếng Việt:** Từ đồng nghĩa/trái nghĩa, Câu ghép, Đọc hiểu văn bản nghệ thuật.
* **Khám phá (Sử - Địa - Khoa):** Trắc nghiệm hình ảnh lồng ghép văn hóa Bắc Ninh (Chùa Dâu, Quan họ).

---

## 5. TÍNH NĂNG ĐỘC ĐÁO

### 5.0. Cửa hàng Bách hóa Kinh Bắc (Reward Exchange)
* **Chủ tiệm:** Cinnamoroll (hiền lành) & Kuromi (lém lỉnh).
* **Vật phẩm:** Trang phục truyền thống Kinh Bắc, đồ siêu nhân, sticker hiếm.

### 5.1. Hệ thống Chọn Nhân vật (Character Selection)
* **Phân loại:** Nhóm Đáng yêu, Nhóm Tinh nghịch, Nhóm Anh hùng.
* **Tính năng:** Nghe thử giọng nói Bắc trước khi chọn, thay đổi bạn đồng hành trong Phòng thay đồ.
* **Giao tiếp:** 'Bạn hãy chọn một người bạn để cùng thám hiểm nhé!'

### 5.2. Món quà bất ngờ (Surprise Gifts)
* Xuất hiện dưới dạng "Hộp quà tri thức" hoặc "Cuộn tơ bí mật".
* **Nội dung:**
    * **Mẹo tính nhanh:** Nhân 0,5 (chia 2), nhân 11 (nhét tổng vào giữa).
    * **Ghi chú liên quan:** Sự thật thú vị về Bác Hồ, đặc sản Bắc Ninh (Bánh đa kế, tương Đình Tổ).
    * **Thần chú ghi nhớ:** Các bài thơ lục bát về diện tích hình thang, các mốc lịch sử (1930, 1945, 1954, 1975).

### 5.3. Sân khấu Tập đọc AI (Gemini Scoring)
* **Giao tiếp:** Giám khảo Gemini dùng giọng Bắc khích lệ.
* **Chấm điểm:** Thang điểm 10 dựa trên: Độ chính xác, Tốc độ, và Ngữ điệu (Phong cách).
* **Phản hồi:** *"Giọng bạn vang thế nhỉ! Nhấn nhá thêm tí nữa là thành nghệ sĩ Quan họ nhí luôn!"*

### 5.4. Hệ thống Kinh tế & PvP
* **Tích lũy:** Hoàn thành bài học, thắng đua với Kuromi.
* **Chi phí hỗ trợ (Hint Cost):** Trừ xu khi yêu cầu Thần linh hoặc Siêu anh hùng gợi ý (5-10 xu).
* **Phòng triển lãm:** Trưng bày chữ viết đẹp được Baby Three lồng khung trang trọng.

---

## 6. KỊCH BẢN GIAO TIẾP MẪU (GIỌNG BẮC CHUẨN)

* **Giới thiệu:** *"Chào bạn nhỏ nhé! Tớ là Cinnamoroll đây. Chúng mình cùng đi tìm chữ A lấp lánh nhé!"*
* **Khích lệ:** *"Siêu thế cơ chứ! Đúng là bạn của Nhện Nhí có khác, tặng bạn 10 điểm này!"*
* **Sửa lỗi L/N:** *"Bạn chú ý một tí tẹo thôi này: từ 'lấp lánh', bạn đừng đọc thành 'nấp nánh' nhé. Thử uốn lưỡi lên một chút xem nào!"*
* **Thần chú Lịch sử:** *"Ba mươi Đảng gốc ra đời / Bốn lăm Cách mạng rạng ngời trời Thu..."*

---

## 7. YÊU CẦU HIỆU ỨNG (VFX)
* **Thắng:** Pháo hoa hoa anh đào, vệt lửa siêu nhân, bão xu rơi.
* **Sai:** Mũ chú hề lò xo, tơ nhện đứt (xoẹt), Kuromi cười lém lỉnh.
* **Hỗ trợ:** Tia laser của Robo-X, đèn pin của Dơi Đêm soi sáng đáp án đúng.

---
**Người soạn thảo:** Gemini AI
**Dành cho:** Developer (R&D Group - Bắc Ninh)