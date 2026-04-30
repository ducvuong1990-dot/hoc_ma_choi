#!/bin/bash

# Script để push repository lên GitHub
# Chạy: bash push_to_github.sh

echo "🚀 Đang chuẩn bị push repository lên GitHub..."
echo ""

# Kiểm tra git remote
if git remote get-url origin &> /dev/null; then
    echo "✅ Remote origin đã được cấu hình:"
    git remote -v
    echo ""
    read -p "Bạn có muốn push lên remote này không? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        echo "❌ Hủy push."
        exit 1
    fi
else
    echo "⚠️  Chưa có remote origin. Vui lòng nhập URL của GitHub repository:"
    echo "Ví dụ: https://github.com/ducvuong/hoc-ma-choi.git"
    read -p "GitHub URL: " github_url

    if [ -z "$github_url" ]; then
        echo "❌ URL không được để trống."
        exit 1
    fi

    git remote add origin "$github_url"
    echo "✅ Đã thêm remote origin: $github_url"
fi

echo ""
echo "📊 Thông tin repository:"
echo "- Branch: main"
echo "- Commits: $(git rev-list --count HEAD)"
echo "- Files: $(git ls-files | wc -l)"
echo ""

# Push lên GitHub
echo "🔄 Đang push lên GitHub..."
if git push -u origin main; then
    echo ""
    echo "✅ THÀNH CÔNG! Repository đã được push lên GitHub."
    echo ""
    echo "🎉 Bạn có thể xem repository tại:"
    git remote get-url origin | sed 's/\.git$//'
    echo ""
    echo "📝 Next steps:"
    echo "1. Thêm GitHub Topics: edutech, vietnam, ai, gamification, education"
    echo "2. Tạo GitHub Project board để track issues"
    echo "3. Setup branch protection rules cho main"
    echo "4. Invite collaborators nếu làm team"
else
    echo ""
    echo "❌ Push thất bại. Vui lòng kiểm tra:"
    echo "1. GitHub repository đã được tạo chưa?"
    echo "2. Bạn có quyền push không?"
    echo "3. URL có đúng không?"
    echo ""
    echo "Để tạo repository trên GitHub:"
    echo "1. Truy cập: https://github.com/new"
    echo "2. Repository name: hoc-ma-choi"
    echo "3. KHÔNG chọn 'Add a README file'"
    echo "4. Click 'Create repository'"
    echo "5. Chạy lại script này"
fi
