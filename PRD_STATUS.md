# PRD Review Status - Học mà chơi

> Cập nhật: 2026-04-30  
> Phạm vi review: đối chiếu `PRD.md` với app hiện tại sau các lượt chỉnh fullstack.

## Đã làm được

- Ưu tiên lớp 1 và lớp 5:
  - Catalog động đang ưu tiên lớp 1/lớp 5.
  - `lessons/catalog.json` hiện có 180 bài; lớp 1 và lớp 5 là nhóm chính.
  - UI thư viện có badge ưu tiên và fallback tạo bài mới khi thiếu bài.
- Catalog bài học động:
  - `app.js` tải `lessons/catalog.json` runtime.
  - `sync_catalog.py` quét metadata, manifest, thumbnail, audio, quiz.
  - Không cần patch tay `app.js` mỗi khi có bài HTML mới.
- Tạo bài học mới theo lớp:
  - Custom lesson dùng ID dạng `custom-g{grade}-{topic-slug}`.
  - Cùng chủ đề/cùng lớp không tạo trùng, sẽ mở lại bài cũ.
  - Nếu catalog đã có bài cùng lớp/chủ đề, app mở bài tĩnh thay vì tạo trùng.
  - Gemini prompt có guard yêu cầu đúng lớp, không quá dễ/khó.
- Quiz Bank:
  - Bank offline đã có thêm nội dung cho lớp 3-5 ở các topic chuẩn.
  - Gemini output được validate: đủ câu hỏi, 4 đáp án khác nhau, đáp án đúng khớp chính xác, loại câu trùng.
- Hint Cost:
  - Bài quiz có nút mở gợi ý.
  - Lớp thấp trừ 5 xu, lớp 5 trừ 10 xu.
  - Gợi ý đã mở được cache để không trừ xu lặp lại cùng câu.
- Luyện đọc AI theo PRD:
  - Điểm đọc hiển thị theo thang `/10`.
  - Có metric: chính xác, tốc độ, ngữ điệu ước tính.
  - Gemini feedback nhận đủ metric `/10` và được yêu cầu giọng Bắc.
  - Có hướng phát âm L/N trong prompt/gift cho lớp 1.
- Reward Exchange:
  - Cửa hàng đổi tên thành `Bách hóa Kinh Bắc`.
  - Có vật phẩm Kinh Bắc/siêu anh hùng: áo tứ thân, nón quai thao, áo choàng siêu nhân, sticker/huy hiệu.
- Surprise Gifts:
  - Có `Hộp quà tri thức`.
  - Quà không trùng lặp, có mẹo tính nhanh, ghi chú Kinh Bắc, mốc lịch sử.
  - Phụ huynh xem được quà gần đây trong dashboard.
- Nhân vật/avatar:
  - Có nhiều avatar 3D `.glb` và fallback procedural.
  - GLB có trạng thái loading/fallback, browser check không lỗi request/console/exception.
- NanoBanana viewer:
  - Viewer hoạt động ngay cả khi thiếu MP3/timestamp.
  - Có fallback Web Speech API `vi-VN` và highlight ước lượng.
- UI dashboard:
  - Tiêu đề chính đã được chỉnh lại thành lời chào + câu hỏi ngắn, tránh vỡ dòng xấu.

## Chưa làm được / còn thiếu so với PRD

- Chưa chuyển stack sang React/Next.js:
  - App hiện vẫn là HTML/CSS/JS thuần.
  - Đây là khác biệt kiến trúc lớn, cần quyết định migration riêng.
- STT/TTS local chưa hoàn chỉnh:
  - Có cấu hình Faster-Whisper endpoint và TTS endpoint.
  - Chưa có backend local đóng gói sẵn để chạy Faster-Whisper/Piper/VITS trên RTX 3060.
  - TTS hiện chủ yếu dùng Web Speech hoặc endpoint nếu người dùng cấu hình.
- Chấm ngữ điệu mới là ước tính:
  - Vì chưa có phân tích audio thật, ngữ điệu đang suy từ transcript/tốc độ/dấu câu.
  - Muốn đúng PRD cần audio feature extraction hoặc Gemini/local model nhận audio.
- Tập viết chữ/số chưa có canvas tracing:
  - PRD yêu cầu tô nét đứt, tơ nhện làm sáng nét, morphing số thành đồ vật.
  - App hiện chưa có module handwriting/tracing riêng.
- Lộ trình lớp 1/lớp 5 còn ở mức catalog/quiz:
  - Đã ưu tiên nội dung lớp 1/5.
  - Chưa có màn hình lộ trình riêng tên `Khu rừng Âm thanh` và `Con đường Đỉnh cao` với milestone rõ.
- Nhân vật theo vai trò PRD chưa đủ sâu:
  - Có avatar và một phần tone gợi ý Nhện Nhí/Dơi Đêm.
  - Chưa có hệ thống hội thoại/voice line riêng cho từng vai trò: Thần linh Số học, Siêu Sao, Kuromi, Baby Three.
- PvP/Kuromi mới là mô phỏng nhẹ:
  - Có game đối kháng tốc độ với AI.
  - Chưa có chế độ Kuromi ra đề khó, lịch sử đấu, hoặc ladder.
- Phòng triển lãm chưa có:
  - Chưa có nơi trưng bày chữ viết đẹp/Baby Three lồng khung.
- VFX thắng/sai/hỗ trợ chưa đủ PRD:
  - Có toast, avatar mood, thưởng xu/sticker.
  - Chưa có pháo hoa hoa anh đào, vệt lửa siêu nhân, mũ chú hề lò xo, tơ nhện đứt, laser/đèn pin soi đáp án.
- Nội dung Bắc Ninh/Kinh Bắc còn mỏng:
  - Đã có một số fact/quà tri thức.
  - Cần mở rộng bài học hình ảnh về Chùa Dâu, Quan họ, đặc sản, lịch sử địa phương.

## Ưu tiên tiếp theo đề xuất

1. Làm màn hình lộ trình lớp 1/lớp 5 riêng, dùng catalog hiện có nhưng gom theo milestone PRD.
2. Thêm module tập viết canvas cho lớp 1.
3. Đóng gói backend local STT/TTS tối thiểu: Faster-Whisper `/transcribe`, Piper/VITS `/tts`.
4. Nâng luyện đọc từ transcript-only sang audio-aware scoring.
5. Bổ sung VFX đúng/sai/gợi ý và vai trò nhân vật rõ hơn.
