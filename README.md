# 🎓 Học mà chơi - Vũ trụ Kinh Bắc

> Nền tảng Edutech cá nhân hóa sử dụng AI và Gamification để biến việc học thành hành trình thám hiểm không áp lực.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)

## 📋 Tổng quan

**Học mà chơi** là nền tảng học tập tương tác dành cho học sinh tiểu học (Lớp 1 và Lớp 5), đặc biệt tập trung vào:
- 🗣️ **Giọng Bắc chuẩn Kinh Bắc** - Giao tiếp hoàn toàn bằng giọng địa phương
- 🤖 **AI tương tác** - Gemini API đánh giá và tạo nội dung động
- 🎮 **Gamification** - Hệ thống xu, sticker, avatar 3D
- 📚 **180+ bài học** - Nội dung phong phú với audio, quiz, karaoke

## ✨ Tính năng chính

### 🎯 Cho học sinh
- **Lớp 1:** Đánh vần, tập viết, nhận diện âm thanh
- **Lớp 5:** Toán học, Tiếng Việt, Lịch sử, Địa lý, Khoa học
- **Luyện đọc AI:** Chấm điểm theo độ chính xác, tốc độ, ngữ điệu
- **Quiz tương tác:** Câu hỏi trắc nghiệm với feedback chi tiết
- **Bách hóa Kinh Bắc:** Đổi xu lấy trang phục, avatar, sticker

### 🛠️ Cho giáo viên/phụ huynh
- **Dashboard phụ huynh:** Theo dõi tiến độ học tập
- **Tạo bài học tự động:** Nhập chủ đề → AI tạo slide + quiz + audio
- **Catalog động:** Quản lý 180+ bài học không cần code

## 🚀 Bắt đầu nhanh

### Yêu cầu hệ thống
- Node.js 18+
- Python 3.8+
- GEMINI_API_KEY (tùy chọn, có fallback local)

### Cài đặt

```bash
# Clone repository
git clone https://github.com/your-username/hoc-ma-choi.git
cd hoc-ma-choi

# Cài đặt dependencies
npm install
pip install -r requirements.txt

# Thiết lập API key (tùy chọn)
echo "GEMINI_API_KEY=your_key_here" > .env

# Chạy ứng dụng
npm start
# hoặc mở index.html trong trình duyệt
```

### Tạo bài học mới

```bash
# Tạo bài từ chủ đề
node auto_generate_lesson.js "Vòng đời của cây đậu"

# Hoặc từ file JSON
node auto_generate_lesson.js pending_scripts/script_abc_grade1.json

# Sync catalog sau khi tạo bài
python sync_catalog.py
```

## 📁 Cấu trúc dự án

```
hoc-ma-choi/
├── app.js                      # Frontend chính (47k+ dòng)
├── auto_generate_lesson.js     # Pipeline tạo bài học tự động
├── sync_catalog.py             # Đồng bộ catalog bài học
├── generate_audio.py           # Tạo audio + karaoke timestamps
├── lessons/                    # 180+ bài học HTML
│   ├── catalog.json           # Metadata tất cả bài học
│   └── lesson_*/              # Từng bài học
│       ├── index.html
│       ├── images/
│       ├── audio/
│       └── prompts.json
├── NanoBanana/                # Image generation pipeline
├── tools/                     # Utilities
├── assets/                    # Characters, icons
└── docs/
    ├── PRD.md                 # Product Requirements
    ├── PRD_STATUS.md          # Tiến độ thực hiện
    └── KE_HOACH_CHI_VIEC.md   # Phân công Gemini/Codex
```

## 🎨 Tech Stack

### Frontend
- HTML5 / CSS3 / Vanilla JavaScript
- Canvas Confetti (hiệu ứng)
- Anime.js (animations)
- Web Speech API (STT/TTS fallback)

### Backend / Generation
- **Node.js:** Automation pipeline
- **Python:** Image generation, audio processing
- **Gemini API:** Content generation, scoring
- **gTTS:** Text-to-speech (fallback)

### Planned
- React/Next.js migration
- Faster-Whisper (local STT)
- Piper/VITS (local TTS)

## 📊 Tiến độ dự án

Xem chi tiết trong [PRD_STATUS.md](PRD_STATUS.md)

**Đã hoàn thành:**
- ✅ 181 bài học HTML
- ✅ Catalog động
- ✅ Quiz validation
- ✅ Luyện đọc AI (Gemini scoring)
- ✅ Reward system
- ✅ Avatar 3D (.glb)

**Đang phát triển:**
- 🚧 Canvas tracing cho tập viết
- 🚧 Lộ trình học tập riêng lớp 1/5
- 🚧 Backend STT/TTS local
- 🚧 Audio-aware scoring

## 🤝 Đóng góp

Xem [COLLABORATION_LOG.md](COLLABORATION_LOG.md) để biết cách phối hợp giữa Gemini (nội dung) và Codex (lập trình).

### Quy trình đóng góp
1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📝 License

MIT License - xem [LICENSE](LICENSE) để biết chi tiết.

## 👥 Team

- **Gemini AI:** Content creation, kịch bản, prompt design
- **Codex:** Automation, pipeline, system architecture
- **R&D Group - Bắc Ninh:** Product vision

## 📞 Liên hệ

- Issues: [GitHub Issues](https://github.com/your-username/hoc-ma-choi/issues)
- Discussions: [GitHub Discussions](https://github.com/your-username/hoc-ma-choi/discussions)

---

**Lưu ý:** Dự án này đang trong giai đoạn phát triển tích cực. API keys và credentials không được commit vào repository.
