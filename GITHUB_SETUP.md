# 🚀 Hướng dẫn tạo GitHub Repository

## Bước 1: Tạo repository trên GitHub

### Cách 1: Dùng GitHub CLI (Nếu đã cài gh)
```bash
# Cài GitHub CLI nếu chưa có
# Windows: winget install --id GitHub.cli

# Login
gh auth login

# Tạo repo public
gh repo create hoc-ma-choi --public --source=. --remote=origin --push

# Hoặc tạo repo private
gh repo create hoc-ma-choi --private --source=. --remote=origin --push
```

### Cách 2: Tạo thủ công trên GitHub.com

1. **Truy cập:** https://github.com/new
2. **Điền thông tin:**
   - Repository name: `hoc-ma-choi`
   - Description: `Nền tảng Edutech cho học sinh tiểu học với AI và Gamification`
   - Visibility: Public hoặc Private
   - ⚠️ **KHÔNG** chọn "Add a README file" (đã có sẵn)
   - ⚠️ **KHÔNG** chọn "Add .gitignore" (đã có sẵn)
   - ⚠️ **KHÔNG** chọn "Choose a license" (đã có sẵn)
3. **Click:** "Create repository"

## Bước 2: Kết nối local repo với GitHub

Sau khi tạo repo trên GitHub, chạy các lệnh sau:

```bash
# Thêm remote origin (thay YOUR_USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/hoc-ma-choi.git

# Hoặc dùng SSH (nếu đã setup SSH key)
git remote add origin git@github.com:YOUR_USERNAME/hoc-ma-choi.git

# Kiểm tra remote
git remote -v

# Push code lên GitHub
git push -u origin main
```

## Bước 3: Xác minh

Truy cập: `https://github.com/YOUR_USERNAME/hoc-ma-choi`

Bạn sẽ thấy:
- ✅ README.md hiển thị đẹp với badges
- ✅ 62 files đã được commit
- ✅ LICENSE file
- ✅ .gitignore đang hoạt động

## Bước 4: Setup GitHub Pages (Tùy chọn)

Nếu muốn host ứng dụng trên GitHub Pages:

1. Vào **Settings** → **Pages**
2. Source: Deploy from a branch
3. Branch: `main` / `root`
4. Click **Save**
5. Truy cập: `https://YOUR_USERNAME.github.io/hoc-ma-choi/`

## Bước 5: Bảo vệ API Keys

⚠️ **QUAN TRỌNG:** Đảm bảo không commit API keys

```bash
# Tạo file .env (đã có trong .gitignore)
echo "GEMINI_API_KEY=your_actual_key_here" > .env

# Kiểm tra .env không bị track
git status

# Nếu .env xuất hiện, thêm vào .gitignore
echo ".env" >> .gitignore
```

## Bước 6: Setup GitHub Actions (Tùy chọn)

Tạo file `.github/workflows/ci.yml` để tự động test:

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

## Các lệnh Git hữu ích

```bash
# Xem trạng thái
git status

# Xem lịch sử commit
git log --oneline --graph

# Tạo branch mới
git checkout -b feature/new-feature

# Push branch mới
git push -u origin feature/new-feature

# Xem các remote
git remote -v

# Pull code mới nhất
git pull origin main

# Xem thay đổi chưa commit
git diff
```

## Troubleshooting

### Lỗi: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/hoc-ma-choi.git
```

### Lỗi: "failed to push some refs"
```bash
# Pull trước khi push
git pull origin main --rebase
git push -u origin main
```

### Lỗi: "Permission denied (publickey)"
```bash
# Dùng HTTPS thay vì SSH
git remote set-url origin https://github.com/YOUR_USERNAME/hoc-ma-choi.git
```

## Next Steps

1. ✅ Thêm GitHub Topics: `edutech`, `vietnam`, `ai`, `gamification`, `education`
2. ✅ Tạo GitHub Project board để track issues
3. ✅ Setup branch protection rules cho `main`
4. ✅ Invite collaborators nếu làm team
5. ✅ Tạo CONTRIBUTING.md cho contributors

---

**Lưu ý:** Repository này đã sẵn sàng để push lên GitHub. Tất cả file cần thiết đã được commit.
