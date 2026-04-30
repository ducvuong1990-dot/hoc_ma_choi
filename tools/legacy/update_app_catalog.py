
import os

def update_app_js():
    app_path = "app.js"
    
    # Kich ban Catalog moi
    new_catalog_code = """const libraryCatalog = [
  // LOP 5
  { "id": "mega_toan_5", "grade": 5, "category": "Toán", "title": "SIEU ON TAP TOAN LOP 5", "desc": "12 Slide - Quiz", "path": "lessons/lesson_script_toan_mega_lop5_1777513672/index.html", "hasQuiz": true },
  { "id": "mega_dia_ly_5", "grade": 5, "category": "Địa lý", "title": "HANH TRINH VAN DAM DIA LY", "desc": "12 Slide - Quiz", "path": "lessons/lesson_script_dia_ly_mega_lop5_1777513602/index.html", "hasQuiz": true },
  { "id": "mega_khoa_hoc_5", "grade": 5, "category": "Khoa học", "title": "NHA KHOA HOC NHI LOP 5", "desc": "12 Slide - Quiz", "path": "lessons/lesson_script_khoa_hoc_mega_lop5_1777513623/index.html", "hasQuiz": true },
  { "id": "mega_lich_su_5", "grade": 5, "category": "Lịch sử", "title": "HAO KHI VIET NAM", "desc": "12 Slide - Quiz", "path": "lessons/lesson_script_lich_su_lop5_1777513644/index.html", "hasQuiz": true },
  
  // LOP 1
  { "id": "mega_tieng_viet_1", "grade": 1, "category": "Tiếng Việt", "title": "SIEU HANH TRINH CHU CAI", "desc": "12 Slide - Quiz", "path": "lessons/lesson_script_tieng_viet_mega_lop1_1777513650/index.html", "hasQuiz": true },
  { "id": "mega_dao_duc_1", "grade": 1, "category": "Đạo đức", "title": "BE NGOAN KINH BAC", "desc": "Hoc loi chao", "path": "lessons/lesson_script_dao_duc_lop1_1777513594/index.html", "hasQuiz": true },
  { "id": "abc_lop1", "grade": 1, "category": "Tiếng Việt", "title": "CHU CAI LAP LANH", "desc": "A, B, C", "path": "lessons/lesson_script_abc_grade1_1777513587/index.html", "hasQuiz": true }
];"""

    with open(app_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Tim diem bat dau va ket thuc cua mảng libraryCatalog
    start_marker = "const libraryCatalog = ["
    end_marker = "];"
    
    start_idx = content.find(start_marker)
    if start_idx != -1:
        # Tim dau ]; gan nhat ke tu start_idx
        end_idx = content.find(end_marker, start_idx)
        if end_idx != -1:
            # Thay the
            new_content = content[:start_idx] + new_catalog_code + content[end_idx + len(end_marker):]
            
            with open(app_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("SUCCESS: Updated libraryCatalog in app.js")
        else:
            print("ERROR: Could not find end marker ];")
    else:
        print("ERROR: Could not find start marker const libraryCatalog = [")

if __name__ == "__main__":
    update_app_js()
