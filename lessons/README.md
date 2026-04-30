# Thư viện học liệu - Học mà chơi

Bộ học liệu này được tạo cho lớp 1, nội dung tự soạn theo các mạch năng lực phổ biến ở tiểu học:

- Tiếng Việt
- Toán
- Tự nhiên và Xã hội
- Đạo đức - kỹ năng
- Mỹ thuật
- Âm nhạc
- Tiếng Anh làm quen

## Cấu trúc

- `index.html`: trang thư viện tổng hợp.
- `catalog.json`: danh sách toàn bộ bài học.
- `grade1_*/index.html`: viewer dạng PPT nền HTML.
- `grade1_*/images/slide-*.svg`: slide 16:9, giữ font tiếng Việt rõ.
- `grade1_*/audio/slide-*.mp3`: lời dẫn tiếng Việt nếu đã chạy script tạo audio.
- `grade1_*/manifest.json`: dữ liệu bài học, lời dẫn audio `vi-VN`, hoạt động.
- `grade1_*/prompts.json`: prompt sẵn để dùng với NanoBanana/Gemini tạo ảnh slide raster sau này.

## Tạo lại bộ học liệu

Chạy từ thư mục gốc dự án:

```powershell
python tools\generate_grade1_materials.py
```

Script sẽ tạo lại các thư mục `grade1_*`, `catalog.json` và `index.html`.

## Tạo ảnh slide bằng NanoBanana

Hiện tại slide đang dùng SVG nội bộ để đảm bảo không lỗi font tiếng Việt và không cần API key.
Khi có `GEMINI_API_KEY`, có thể dùng dữ liệu trong từng `prompts.json` để sinh ảnh PNG bằng workflow NanoBanana.

## Tạo ảnh slide bằng OpenAI Images 2

Chỉ dùng OpenAI Images 2 để tạo hình minh họa không chữ. Không dùng ảnh bitmap làm slide chính vì AI có thể làm sai dấu tiếng Việt. Viewer luôn giữ `images/slide-*.svg` làm nguồn chính để chữ được trình duyệt render đúng.

```powershell
$env:OPENAI_API_KEY="your_api_key"
python tools\generate_images2_slides.py --lesson grade1_tieng_viet_a_a_aa --limit 1
```

Tạo hình minh họa cho một bài:

```powershell
python tools\generate_images2_slides.py --lesson grade1_tieng_viet_a_a_aa
```

Tạo hình minh họa cho toàn bộ học liệu lớp 1:

```powershell
python tools\generate_images2_slides.py --sleep 1
```

Ảnh được lưu vào `grade1_*/images2/slide-*.png`. Prompt đã yêu cầu không có chữ, số, nhãn, watermark trong ảnh.

## Tạo audio tiếng Việt

Viewer sẽ ưu tiên phát `grade1_*/audio/slide-*.mp3`. Nếu chưa có file audio, nút `Nghe` sẽ dùng giọng đọc `vi-VN` của trình duyệt.
Script mặc định dùng `vi-VN-NamMinhNeural` để ưu tiên giọng miền Bắc/giọng chuẩn.

Tạo thử một file:

```powershell
python tools\generate_lesson_audio.py --lesson grade1_tieng_viet_a_a_aa --limit 1
```

Tạo toàn bộ audio lớp 1:

```powershell
python tools\generate_lesson_audio.py
```

Đổi voice nếu cần:

```powershell
python tools\generate_lesson_audio.py --voice vi-VN-NamMinhNeural --overwrite
```

Lưu ý: không sao chép nguyên văn sách giáo khoa hoặc sách tham khảo. Nội dung trong thư viện là bản tự soạn, bám năng lực phù hợp lớp 1.
