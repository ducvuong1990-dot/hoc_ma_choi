
import os
import json
import re

def update_app_js():
    app_path = "app.js"
    catalog_path = "lessons/catalog.json"
    
    if not os.path.exists(catalog_path):
        print(f"ERROR: {catalog_path} not found.")
        return

    with open(catalog_path, 'r', encoding='utf-8') as f:
        catalog_data = json.load(f)

    # Filter for the newest Mega lessons (those generated recently with timestamps)
    # We'll take the latest ones for each major category to keep the featured list clean
    featured_categories = ["Toán", "Địa lý", "Khoa học", "Lịch sử", "Tiếng Việt", "Đạo đức"]
    featured_lessons = []
    
    # Simple logic: find lessons with 'lesson_script' in path (the ones we just built)
    mega_lessons = [l for l in catalog_data if "lesson_script" in l['path']]
    
    # Group by category and take the most recent (highest timestamp in ID)
    for cat in featured_categories:
        cat_lessons = [l for l in mega_lessons if l.get('subject') == cat or l.get('category') == cat]
        if cat_lessons:
            # Sort by ID descending (which has timestamp)
            cat_lessons.sort(key=lambda x: x['id'], reverse=True)
            l = cat_lessons[0]
            
            # Format for libraryCatalog
            featured_lessons.append({
                "id": l['id'],
                "grade": int(l['grade']),
                "category": l.get('subject', l.get('category', 'Khác')),
                "title": l['title'].upper(),
                "desc": "12 Slide - Quiz" if "trac_nghiem" not in l['id'] else "Bộ đề trắc nghiệm",
                "path": l['path'],
                "hasQuiz": True
            })

    if not featured_lessons:
        print("ERROR: No mega lessons found to update.")
        return

    new_catalog_code = "const libraryCatalog = " + json.dumps(featured_lessons, indent=2, ensure_ascii=False) + ";"

    with open(app_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Improved regex to find the libraryCatalog assignment
    pattern = r"const libraryCatalog\s*=\s*\[[\s\S]*?\];"
    if re.search(pattern, content):
        new_content = re.sub(pattern, new_catalog_code, content)
        with open(app_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"SUCCESS: Updated libraryCatalog in app.js with {len(featured_lessons)} lessons.")
    else:
        print("ERROR: Could not find libraryCatalog pattern in app.js")

if __name__ == "__main__":
    update_app_js()
