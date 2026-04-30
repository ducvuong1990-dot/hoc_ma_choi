# Hướng dẫn Tạo Bài học EduPlay Tự động (Update 2026)

Tài liệu này hướng dẫn cách sử dụng bộ công cụ EduPlay để tạo ra các bài giảng tương tác có âm thanh thuyết minh và hiệu ứng Karaoke khớp 100%.

## 1. Chuẩn bị Môi trường
Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt:
- **Node.js**: Để chạy script điều hướng chính.
- **Python 3.10+**: Để tạo âm thanh và Slide.
- **Thư viện cần thiết**:
  ```powershell
  pip install gtts mutagen mutagen
  npm install
  ```

## 2. Các bước tạo Bài học Mới

### Bước 1: Thiết lập API Key
Bạn cần có Gemini API Key để khởi tạo nội dung.
```powershell
$env:GEMINI_API_KEY="AIzaSy..."
```

### Bước 2: Chạy lệnh tạo tự động
Sử dụng script `auto_generate_lesson.js` kèm theo chủ đề bạn muốn. Hệ thống sẽ tự động làm 3 việc:
1. Dùng Gemini để soạn nội dung (5 slide).
2. Dùng NanoBanana để vẽ hình ảnh 2K phong cách Bento Grid.
3. Dùng gTTS & Mutagen để tạo audio và dữ liệu Karaoke khớp nhịp nghỉ dấu câu.

**Ví dụ:**
```powershell
node auto_generate_lesson.js "Vòng đời của chú Bướm xinh"
```

## 3. Các điểm lưu ý quan trọng (New Update)

### Hiệu ứng Karaoke & Audio
- **Tốc độ đọc**: Mặc định là `1.1x` (tự nhiên nhất cho trẻ em).
- **Ngắt nghỉ dấu câu**: Chữ sẽ tự động dừng lại một nhịp ở dấu chấm (.), dấu phẩy (,), giúp trẻ kịp theo dõi.
- **Khớp nhịp điệu**: Nếu bạn thấy chữ chạy hơi chậm hoặc nhanh, hãy kiểm tra file `generate_audio.py` phần `get_word_complexity`.

### Giao diện & Hình ảnh
- **Phong cách Bento**: Mặc định các slide nội dung sẽ sử dụng ô lưới kính mờ (Frosted Glass).
- **Làm mới dữ liệu**: Sau khi tạo xong, hãy mở trình duyệt và nhấn **Ctrl + F5** để nạp lại toàn bộ dữ liệu mới nhất.

## 4. Cấu trúc Thư mục Bài học
Mỗi bài học sau khi tạo sẽ nằm trong thư mục `lessons/lesson_[Tên_Bài]_[ID]/`:
- `index.html`: Trình xem bài giảng chính.
- `images/`: Chứa 5 ảnh Slide 2K.
- `audio/`: Chứa 5 file âm thanh (.mp3) và 5 file mốc thời gian Karaoke (.json).
- `prompts.json`: Chứa nội dung kịch bản và prompt hình ảnh.

## 5. Xử lý sự cố
- **Lỗi audio bị ngắt quãng**: Hệ thống đã tự động lọc các dấu phẩy gây ngắt nhịp vô lý. Đảm bảo bạn đang sử dụng phiên bản `generate_audio.py` mới nhất.
- **Chưa có âm thanh**: Kiểm tra kết nối Internet (vì gTTS cần kết nối để tạo file lần đầu) và đảm bảo file `.mp3` đã tồn tại trong thư mục `audio/`.
