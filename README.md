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
# Cách 1: Single-agent (đơn giản)
node auto_generate_lesson.js "Vòng đời của cây đậu"

# Cách 2: Multi-agent (nhanh hơn 35%)
node multi_agent_lesson_gen.js "Vòng đời của cây đậu" 1

# Hoặc từ file JSON
node auto_generate_lesson.js pending_scripts/script_abc_grade1.json

# Sync catalog sau khi tạo bài
python sync_catalog.py
```

### Development Tools

```bash
# Chạy development agents
node dev_agents.js test        # Tạo và chạy unit tests
node dev_agents.js refactor    # Phân tích code complexity
node dev_agents.js docs        # Generate documentation
node dev_agents.js optimize    # Tìm performance issues
node dev_agents.js security    # Scan vulnerabilities
node dev_agents.js review      # Code review
node dev_agents.js all         # Chạy tất cả agents
```

## 📁 Cấu trúc dự án

```
hoc-ma-choi/
├── app.js                      # Frontend chính (47k+ dòng)
├── auto_generate_lesson.js     # Single-agent lesson generation
├── multi_agent_lesson_gen.js   # Multi-agent system (35% faster)
├── dev_agents.js               # Development agents (test, refactor, etc.)
├── sync_catalog.py             # Đồng bộ catalog bài học
├── generate_audio.py           # Tạo audio + karaoke timestamps
├── test_multi_agent.js         # Test suite cho lesson generation
├── test_dev_agents.js          # Test suite cho dev agents
├── lessons/                    # 180+ bài học HTML
│   ├── catalog.json           # Metadata tất cả bài học
│   └── lesson_*/              # Từng bài học
│       ├── index.html
│       ├── images/
│       ├── audio/
│       └── prompts.json
├── NanoBanana/                # Image generation pipeline
├── .github/workflows/         # CI/CD automation
│   ├── ci.yml                # Automated testing
│   └── deploy.yml            # GitHub Pages deployment
├── tools/                     # Utilities
├── assets/                    # Characters, icons
└── docs/
    ├── PRD.md                 # Product Requirements
    ├── PRD_STATUS.md          # Tiến độ thực hiện
    ├── MULTI_AGENT_GUIDE.md   # Multi-agent documentation
    └── DEV_AGENTS_GUIDE.md    # Development agents guide
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

### Multi-Agent Systems
- **Lesson Generation:** 5 agents (Content, Image, Audio, QA, Deploy)
- **Development:** 6 agents (Testing, Refactoring, Docs, Optimization, Security, Review)
- **Performance:** 35% faster than single-agent approach

### CI/CD
- **GitHub Actions:** Automated testing and deployment
- **Security Scanning:** API key detection, vulnerability checks
- **Quality Gates:** Syntax validation, catalog integrity

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
