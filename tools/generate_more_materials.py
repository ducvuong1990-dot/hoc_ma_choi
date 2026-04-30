from __future__ import annotations

import html
import json
import re
import textwrap
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LESSONS_DIR = ROOT / "lessons"


EXTRA_LESSONS = [
    {"grade": 1, "slug": "tieng_viet_van_en_et", "subject": "Tiếng Việt", "title": "Vần en, et", "keywords": ["en", "et", "sen", "kèn", "mẹt", "nét"], "examples": ["sen có vần en", "nét có vần et", "kèn phát ra âm thanh"], "practice": "Bé đọc en, et rồi tìm tiếng có vần giống nhau.", "game": "Đưa thẻ tiếng về đúng ngôi nhà en hoặc et."},
    {"grade": 1, "slug": "tieng_viet_van_on_ot", "subject": "Tiếng Việt", "title": "Vần on, ot", "keywords": ["on", "ot", "con", "hòn", "bọt", "ngọt"], "examples": ["con có vần on", "bọt có vần ot", "ngọt có vần ot"], "practice": "Bé đọc cặp tiếng con - bọt, hòn - ngọt.", "game": "Nghe tiếng và chọn thẻ on hoặc ot."},
    {"grade": 1, "slug": "tieng_viet_van_ong_oc", "subject": "Tiếng Việt", "title": "Vần ong, oc", "keywords": ["ong", "oc", "bông", "vòng", "óc", "cọc"], "examples": ["bông có vần ong", "cọc có vần oc"], "practice": "Bé đọc từng tiếng, kéo dài phần vần để nghe rõ.", "game": "Tìm tranh có tiếng mang vần ong hoặc oc."},
    {"grade": 1, "slug": "tieng_viet_van_anh_ach", "subject": "Tiếng Việt", "title": "Vần anh, ach", "keywords": ["anh", "ach", "xanh", "chanh", "sách", "bạch"], "examples": ["xanh có vần anh", "sách có vần ach"], "practice": "Bé đọc xanh, chanh, sách rồi nói câu ngắn.", "game": "Ghép tranh với tiếng đúng."},
    {"grade": 1, "slug": "tieng_viet_van_ieu_yeu", "subject": "Tiếng Việt", "title": "Vần iêu, yêu", "keywords": ["iêu", "yêu", "diều", "hiểu", "yêu", "yếu"], "examples": ["diều bay trên trời", "yêu là tình cảm tốt đẹp"], "practice": "Bé đọc chậm iêu và yêu, chú ý âm đầu.", "game": "Chọn bức tranh phù hợp với tiếng nghe được."},
    {"grade": 1, "slug": "tieng_viet_dau_cau", "subject": "Tiếng Việt", "title": "Dấu chấm, dấu hỏi, dấu cảm", "keywords": ["dấu chấm", "dấu hỏi", "dấu cảm", "câu kể", "câu hỏi"], "examples": ["Bé đi học.", "Bạn tên gì?", "Ôi, đẹp quá!"], "practice": "Bé đọc câu theo đúng giọng: kể, hỏi, vui.", "game": "Chọn dấu câu còn thiếu cho câu ngắn."},
    {"grade": 1, "slug": "tieng_viet_viet_cau_ve_ban_than", "subject": "Tiếng Việt", "title": "Viết câu về bản thân", "keywords": ["em", "tên", "tuổi", "thích", "học"], "examples": ["Em tên là An.", "Em thích đọc sách."], "practice": "Bé nói một câu về mình rồi tập viết lại.", "game": "Sắp xếp thẻ từ thành câu giới thiệu."},
    {"grade": 1, "slug": "tieng_viet_doc_hieu_tranh", "subject": "Tiếng Việt", "title": "Đọc hiểu qua tranh", "keywords": ["quan sát", "nhân vật", "việc làm", "cảm xúc"], "examples": ["Bạn nhỏ tưới cây.", "Bạn nhỏ vui vì cây xanh."], "practice": "Bé trả lời: ai, ở đâu, làm gì.", "game": "Chọn câu đúng với tranh."},
    {"grade": 1, "slug": "toan_so_11_20", "subject": "Toán", "title": "Các số từ 11 đến 20", "keywords": ["11", "12", "15", "20", "chục", "đơn vị"], "examples": ["11 gồm 1 chục và 1 đơn vị", "20 là 2 chục"], "practice": "Bé dùng que tính bó chục rồi đếm thêm.", "game": "Ghép số với nhóm đồ vật đúng."},
    {"grade": 1, "slug": "toan_cong_khong_nho_20", "subject": "Toán", "title": "Cộng không nhớ trong phạm vi 20", "keywords": ["12 + 3", "10 + 5", "gộp", "kết quả"], "examples": ["12 thêm 3 là 15", "10 thêm 5 là 15"], "practice": "Bé đếm tiếp từ số lớn hơn.", "game": "Bắn bóng mang kết quả đúng."},
    {"grade": 1, "slug": "toan_tru_khong_nho_20", "subject": "Toán", "title": "Trừ không nhớ trong phạm vi 20", "keywords": ["15 - 3", "18 - 5", "bớt", "còn lại"], "examples": ["15 bớt 3 còn 12", "18 bớt 5 còn 13"], "practice": "Bé dùng que tính để bớt rồi đọc kết quả.", "game": "Chọn rổ còn đúng số quả."},
    {"grade": 1, "slug": "toan_do_do_dai", "subject": "Toán", "title": "Đo độ dài bằng gang tay", "keywords": ["đo", "gang tay", "dài hơn", "ngắn hơn"], "examples": ["Bàn dài hơn quyển vở", "Bút ngắn hơn thước"], "practice": "Bé đo bàn học bằng gang tay.", "game": "Dự đoán vật dài hơn rồi kiểm tra."},
    {"grade": 1, "slug": "toan_dong_ho_gio_dung", "subject": "Toán", "title": "Xem giờ đúng", "keywords": ["đồng hồ", "kim giờ", "kim phút", "7 giờ"], "examples": ["Kim phút chỉ 12 là giờ đúng", "7 giờ em thức dậy"], "practice": "Bé xoay kim đồng hồ giấy theo giờ cô đọc.", "game": "Ghép đồng hồ với hoạt động trong ngày."},
    {"grade": 1, "slug": "toan_tien_viet_nam_lam_quen", "subject": "Toán", "title": "Làm quen tiền Việt Nam", "keywords": ["đồng", "tờ tiền", "mua", "trả tiền"], "examples": ["Mua bút cần trả tiền", "Cất tiền gọn gàng"], "practice": "Bé phân loại tờ tiền đồ chơi theo màu và số.", "game": "Chọn đủ tiền để mua món đồ."},
    {"grade": 1, "slug": "tnxh_bon_mua", "subject": "Tự nhiên và Xã hội", "title": "Bốn mùa quanh em", "keywords": ["xuân", "hạ", "thu", "đông", "thời tiết"], "examples": ["Mùa hè thường nóng", "Mùa xuân cây cối xanh tốt"], "practice": "Bé kể trang phục phù hợp từng mùa.", "game": "Kéo đồ vật về đúng mùa."},
    {"grade": 1, "slug": "tnxh_thoi_tiet_hom_nay", "subject": "Tự nhiên và Xã hội", "title": "Thời tiết hôm nay", "keywords": ["nắng", "mưa", "gió", "mây", "áo mưa"], "examples": ["Trời mưa cần áo mưa", "Trời nắng nên đội mũ"], "practice": "Bé nhìn ngoài trời và nói thời tiết.", "game": "Chọn vật dụng phù hợp với thời tiết."},
    {"grade": 1, "slug": "tnxh_an_uong_lanh_manh", "subject": "Tự nhiên và Xã hội", "title": "Ăn uống lành mạnh", "keywords": ["rau", "quả", "nước", "bữa ăn", "sạch"], "examples": ["Rửa tay trước khi ăn", "Ăn thêm rau giúp cơ thể khỏe"], "practice": "Bé chọn món ăn tốt cho bữa trưa.", "game": "Xếp mâm cơm cân bằng."},
    {"grade": 1, "slug": "dao_duc_noi_loi_cam_on_xin_loi", "subject": "Đạo đức - Kỹ năng", "title": "Nói lời cảm ơn, xin lỗi", "keywords": ["cảm ơn", "xin lỗi", "lịch sự", "biết nhận lỗi"], "examples": ["Bạn giúp em, em nói cảm ơn", "Làm rơi đồ của bạn, em xin lỗi"], "practice": "Bé đóng vai hai tình huống lịch sự.", "game": "Chọn lời nói đúng trong tình huống."},
    {"grade": 1, "slug": "dao_duc_tu_phuc_vu", "subject": "Đạo đức - Kỹ năng", "title": "Tự phục vụ bản thân", "keywords": ["tự mặc áo", "xếp dép", "cất đồ", "gọn gàng"], "examples": ["Em tự cất cặp sau khi học", "Em xếp dép ngay ngắn"], "practice": "Bé chọn một việc tự làm hôm nay.", "game": "Sắp xếp thứ tự việc buổi sáng."},
    {"grade": 1, "slug": "my_thuat_hinh_va_net", "subject": "Mỹ thuật", "title": "Hình và nét trong tranh", "keywords": ["nét thẳng", "nét cong", "chấm", "hình tròn"], "examples": ["Nét cong tạo cánh hoa", "Hình tròn tạo mặt trời"], "practice": "Bé vẽ bức tranh từ ba loại nét.", "game": "Tìm hình ẩn trong tranh."},
    {"grade": 1, "slug": "am_nhac_cao_thap", "subject": "Âm nhạc", "title": "Âm thanh cao và thấp", "keywords": ["cao", "thấp", "nghe", "hát", "nhạc cụ"], "examples": ["Tiếng chim thường cao", "Tiếng trống thường thấp"], "practice": "Bé nghe âm và giơ tay cao hoặc thấp.", "game": "Phân loại âm thanh cao, thấp."},
    {"grade": 1, "slug": "tieng_anh_mau_sac", "subject": "Tiếng Anh làm quen", "title": "Colors - Màu sắc", "keywords": ["red", "yellow", "blue", "green", "white"], "examples": ["red là màu đỏ", "blue là màu xanh dương"], "practice": "Bé nghe màu tiếng Anh rồi chỉ đồ vật đúng.", "game": "Tô màu theo hiệu lệnh tiếng Anh."},
    {"grade": 1, "slug": "tieng_anh_so_1_10", "subject": "Tiếng Anh làm quen", "title": "Numbers 1 to 10", "keywords": ["one", "two", "three", "five", "ten"], "examples": ["one là một", "ten là mười"], "practice": "Bé đếm đồ vật bằng tiếng Anh.", "game": "Ghép số với từ tiếng Anh."},
    {"grade": 1, "slug": "stem_thu_nghiem_noi_chim", "subject": "STEM lớp 1", "title": "Vật nổi, vật chìm", "keywords": ["nổi", "chìm", "nước", "dự đoán", "quan sát"], "examples": ["Lá thường nổi trên nước", "Viên đá thường chìm"], "practice": "Bé dự đoán rồi thử với đồ vật an toàn.", "game": "Chọn nhóm vật nổi hoặc chìm."},
    {"grade": 1, "slug": "stem_xay_thap_giay", "subject": "STEM lớp 1", "title": "Xây tháp giấy", "keywords": ["giấy", "cao", "vững", "gấp", "thử lại"], "examples": ["Gấp giấy giúp tháp vững hơn", "Đế rộng giúp tháp đứng chắc"], "practice": "Bé xây tháp bằng giấy và đo chiều cao.", "game": "Thử thách tháp đứng vững 10 giây."},
    {"grade": 5, "slug": "on_tap_tieng_viet_doc_hieu", "subject": "Ôn tập cuối năm - Tiếng Việt", "title": "Ôn đọc hiểu văn bản", "keywords": ["ý chính", "chi tiết", "nhân vật", "bối cảnh", "suy luận"], "examples": ["Tìm câu nêu ý chính", "Giải thích hành động của nhân vật"], "practice": "Học sinh đọc đoạn ngắn và trả lời 4 câu hỏi.", "game": "Chọn bằng chứng trong văn bản để bảo vệ đáp án."},
    {"grade": 5, "slug": "on_tap_tieng_viet_luyen_tu_cau", "subject": "Ôn tập cuối năm - Tiếng Việt", "title": "Ôn luyện từ và câu", "keywords": ["từ đồng nghĩa", "trái nghĩa", "chủ ngữ", "vị ngữ"], "examples": ["Tìm cặp từ trái nghĩa", "Xác định chủ ngữ trong câu"], "practice": "Học sinh phân tích 5 câu ngắn.", "game": "Bốc thẻ câu và sửa lỗi nhanh."},
    {"grade": 5, "slug": "on_tap_tieng_viet_viet_doan", "subject": "Ôn tập cuối năm - Tiếng Việt", "title": "Ôn viết đoạn văn", "keywords": ["mở đoạn", "ý chính", "dẫn chứng", "kết đoạn"], "examples": ["Viết đoạn tả cảnh sân trường", "Viết đoạn nêu cảm nghĩ về bạn"], "practice": "Học sinh lập dàn ý 4 ý rồi viết đoạn.", "game": "Sắp xếp câu thành đoạn văn mạch lạc."},
    {"grade": 5, "slug": "on_tap_toan_phan_so", "subject": "Ôn tập cuối năm - Toán", "title": "Ôn phân số", "keywords": ["rút gọn", "quy đồng", "so sánh", "cộng", "trừ"], "examples": ["Quy đồng trước khi cộng phân số khác mẫu", "Rút gọn để phân số đơn giản hơn"], "practice": "Học sinh làm 6 bài từ dễ đến khó.", "game": "Ghép phân số bằng nhau."},
    {"grade": 5, "slug": "on_tap_toan_so_thap_phan", "subject": "Ôn tập cuối năm - Toán", "title": "Ôn số thập phân", "keywords": ["hàng phần mười", "phần trăm", "so sánh", "làm tròn"], "examples": ["3,25 lớn hơn 3,2", "Làm tròn 4,68 đến hàng phần mười"], "practice": "Học sinh đọc, viết, so sánh số thập phân.", "game": "Đặt số thập phân lên trục số."},
    {"grade": 5, "slug": "on_tap_toan_ti_so_phan_tram", "subject": "Ôn tập cuối năm - Toán", "title": "Ôn tỉ số phần trăm", "keywords": ["phần trăm", "tỉ số", "giảm giá", "biểu đồ"], "examples": ["25% nghĩa là 25 phần trong 100 phần", "Tính 10% của 200"], "practice": "Học sinh giải bài toán mua bán đơn giản.", "game": "Chọn nhãn phần trăm đúng cho biểu đồ."},
    {"grade": 5, "slug": "on_tap_toan_chuyen_dong", "subject": "Ôn tập cuối năm - Toán", "title": "Ôn toán chuyển động", "keywords": ["quãng đường", "vận tốc", "thời gian", "đơn vị"], "examples": ["Quãng đường bằng vận tốc nhân thời gian", "Đổi giờ sang phút khi cần"], "practice": "Học sinh lập bảng 3 đại lượng.", "game": "Ghép công thức với tình huống."},
    {"grade": 5, "slug": "on_tap_toan_hinh_hoc", "subject": "Ôn tập cuối năm - Toán", "title": "Ôn diện tích, thể tích", "keywords": ["diện tích", "chu vi", "thể tích", "hình hộp", "hình lập phương"], "examples": ["Diện tích hình chữ nhật bằng dài nhân rộng", "Thể tích hình hộp bằng dài nhân rộng nhân cao"], "practice": "Học sinh nhận dạng công thức phù hợp.", "game": "Chọn công thức cho mỗi hình."},
    {"grade": 5, "slug": "on_tap_khoa_hoc_co_the", "subject": "Ôn tập cuối năm - Khoa học", "title": "Ôn cơ thể và sức khỏe", "keywords": ["dinh dưỡng", "vận động", "ngủ", "vệ sinh", "phòng bệnh"], "examples": ["Ăn đa dạng giúp cơ thể khỏe", "Rửa tay giúp phòng bệnh"], "practice": "Học sinh lập thực đơn một ngày cân bằng.", "game": "Phân loại thói quen tốt và chưa tốt."},
    {"grade": 5, "slug": "on_tap_khoa_hoc_vat_chat_nang_luong", "subject": "Ôn tập cuối năm - Khoa học", "title": "Ôn vật chất và năng lượng", "keywords": ["chất rắn", "chất lỏng", "nhiệt", "ánh sáng", "điện"], "examples": ["Ánh sáng giúp ta nhìn thấy vật", "Điện cần được dùng an toàn"], "practice": "Học sinh nêu ví dụ năng lượng trong đời sống.", "game": "Ghép nguồn năng lượng với công dụng."},
    {"grade": 5, "slug": "on_tap_lich_su_moc_su_kien", "subject": "Ôn tập cuối năm - Lịch sử", "title": "Ôn mốc sự kiện lịch sử", "keywords": ["mốc thời gian", "nhân vật", "sự kiện", "ý nghĩa"], "examples": ["Sắp xếp sự kiện theo thời gian", "Nêu ý nghĩa của một sự kiện"], "practice": "Học sinh hoàn thành dòng thời gian trống.", "game": "Ghép thẻ sự kiện với mốc thời gian."},
    {"grade": 5, "slug": "on_tap_dia_li_viet_nam", "subject": "Ôn tập cuối năm - Địa lí", "title": "Ôn địa lí Việt Nam", "keywords": ["đồng bằng", "miền núi", "sông", "biển", "khí hậu"], "examples": ["Việt Nam có đường bờ biển dài", "Đồng bằng thuận lợi trồng lúa"], "practice": "Học sinh đọc bản đồ đơn giản và trả lời câu hỏi.", "game": "Đưa biểu tượng về đúng vùng."},
    {"grade": 5, "slug": "on_tap_tieng_anh_vocab", "subject": "Ôn tập cuối năm - Tiếng Anh", "title": "Ôn từ vựng quen thuộc", "keywords": ["school", "family", "food", "weather", "hobby"], "examples": ["I like reading", "It is sunny today"], "practice": "Học sinh ghép từ với tranh và đọc câu.", "game": "Bingo từ vựng theo chủ đề."},
    {"grade": 5, "slug": "on_tap_tieng_anh_sentences", "subject": "Ôn tập cuối năm - Tiếng Anh", "title": "Ôn mẫu câu giao tiếp", "keywords": ["What", "Where", "How many", "I can", "I like"], "examples": ["What is your hobby?", "How many books do you have?"], "practice": "Học sinh hỏi đáp theo cặp 5 mẫu câu.", "game": "Rút thẻ câu hỏi và trả lời nhanh."},
    {"grade": 5, "slug": "on_tap_tin_hoc_an_toan", "subject": "Ôn tập cuối năm - Tin học", "title": "Ôn an toàn số", "keywords": ["mật khẩu", "thông tin cá nhân", "lịch sự", "kiểm chứng"], "examples": ["Không chia sẻ mật khẩu", "Kiểm tra nguồn tin trước khi tin"], "practice": "Học sinh chọn cách xử lý tình huống online.", "game": "Phân loại hành vi an toàn và rủi ro."},
    {"grade": 5, "slug": "on_tap_ki_nang_lap_ke_hoach", "subject": "Ôn tập cuối năm - Kỹ năng", "title": "Lập kế hoạch ôn tập", "keywords": ["mục tiêu", "thời gian", "ưu tiên", "nghỉ ngơi", "kiểm tra"], "examples": ["Chia bài khó thành phần nhỏ", "Nghỉ ngắn giúp học hiệu quả"], "practice": "Học sinh lập kế hoạch ôn 7 ngày.", "game": "Xếp nhiệm vụ vào thời khóa biểu."},
]


PALETTES = {
    "Tiếng Việt": ("#2fb8ff", "#e8f7ff", "#064d66"),
    "Toán": ("#82c97f", "#effbef", "#265f2b"),
    "Tự nhiên và Xã hội": ("#ffcf4a", "#fff8d7", "#705700"),
    "Đạo đức - Kỹ năng": ("#ff8aa5", "#fff0f4", "#7a1730"),
    "Mỹ thuật": ("#a98cff", "#f3eeff", "#49317a"),
    "Âm nhạc": ("#ffad4d", "#fff1df", "#7a3a00"),
    "Tiếng Anh làm quen": ("#5fd3c6", "#e9fbf9", "#0e5c55"),
    "STEM lớp 1": ("#58c7a7", "#e7fbf4", "#075a47"),
}


def slugify(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[^a-z0-9_]+", "_", value)
    return re.sub(r"_+", "_", value).strip("_")


def palette(subject: str) -> tuple[str, str, str]:
    if subject.startswith("Ôn tập cuối năm - Toán"):
        return "#82c97f", "#effbef", "#265f2b"
    if subject.startswith("Ôn tập cuối năm - Tiếng Việt"):
        return "#2fb8ff", "#e8f7ff", "#064d66"
    if subject.startswith("Ôn tập cuối năm - Khoa học"):
        return "#58c7a7", "#e7fbf4", "#075a47"
    if subject.startswith("Ôn tập cuối năm -"):
        return "#ffad4d", "#fff1df", "#7a3a00"
    return PALETTES.get(subject, ("#6fb7ff", "#eef7ff", "#113f67"))


def wrap(text: str, width: int) -> list[str]:
    lines: list[str] = []
    for paragraph in text.split("\n"):
        lines.extend(textwrap.wrap(paragraph, width=width, break_long_words=False) or [""])
    return lines


def text_block(lines: list[str], x: int, y: int, size: int, fill: str, weight: int = 800) -> str:
    out = []
    for i, line in enumerate(lines):
        out.append(
            f'<text x="{x}" y="{y + i * int(size * 1.32)}" fill="{fill}" '
            f'font-size="{size}" font-family="Be Vietnam Pro, Nunito, Arial, sans-serif" '
            f'font-weight="{weight}">{html.escape(line)}</text>'
        )
    return "\n".join(out)


def make_slides(lesson: dict) -> list[dict]:
    grade = lesson["grade"]
    title = lesson["title"]
    subject = lesson["subject"]
    return [
        {"page_type": "cover", "title": title, "body": f"{subject} lớp {grade}\nHọc bằng hình, luyện bằng trò chơi.", "activity": "Đọc tên bài, quan sát tranh và nêu điều đã biết."},
        {"page_type": "goal", "title": "Mục tiêu", "body": "Học sinh sẽ:\n- Nhận biết kiến thức trọng tâm.\n- Luyện bằng ví dụ ngắn.\n- Tự kiểm tra qua trò chơi.", "activity": "Nói lại mục tiêu bằng một câu ngắn."},
        {"page_type": "keywords", "title": "Từ khóa", "body": "\n".join(f"- {item}" for item in lesson["keywords"][:6]), "activity": "Đọc từng từ khóa, đánh dấu từ còn cần luyện."},
        {"page_type": "examples", "title": "Ví dụ", "body": "\n".join(f"- {item}" for item in lesson["examples"][:4]), "activity": "Chọn một ví dụ và giải thích bằng lời của mình."},
        {"page_type": "practice", "title": "Luyện tập", "body": lesson["practice"], "activity": "Làm chậm một lượt, sau đó thử làm nhanh hơn."},
        {"page_type": "game", "title": "Trò chơi", "body": lesson["game"], "activity": "Hoàn thành trò chơi để nhận xu và sticker ôn tập."},
        {"page_type": "summary", "title": "Tự kiểm tra", "body": f"Hôm nay đã học: {title.lower()}.\nNói lại 2 từ khóa và 1 điều còn muốn luyện.", "activity": "Tự chấm: chắc rồi, cần luyện thêm, hoặc muốn thử mức khó hơn."},
    ]


def write_svg(path: Path, lesson: dict, slide: dict, slide_no: int, total: int) -> None:
    accent, soft, dark = palette(lesson["subject"])
    title_lines = wrap(slide["title"], 28)
    body_lines = wrap(slide["body"], 42)
    activity_lines = wrap(slide["activity"], 58)
    grade = lesson["grade"]
    subject = html.escape(lesson["subject"])
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <rect width="1600" height="900" fill="#f8fbff"/>
  <circle cx="1460" cy="100" r="250" fill="{soft}"/>
  <circle cx="150" cy="790" r="230" fill="{soft}"/>
  <rect x="70" y="58" width="1460" height="784" rx="42" fill="#fff" stroke="#dfe9f0" stroke-width="6"/>
  <rect x="70" y="58" width="1460" height="96" rx="42" fill="{accent}"/>
  <rect x="70" y="112" width="1460" height="42" fill="{accent}"/>
  <text x="118" y="122" fill="#fff" font-size="34" font-family="Be Vietnam Pro, Nunito, Arial, sans-serif" font-weight="900">{subject} · Lớp {grade}</text>
  <text x="1430" y="122" fill="#fff" font-size="30" font-family="Be Vietnam Pro, Nunito, Arial, sans-serif" font-weight="800">{slide_no}/{total}</text>
  <rect x="1140" y="220" width="300" height="250" rx="44" fill="{soft}" stroke="{accent}" stroke-width="5"/>
  <circle cx="1235" cy="315" r="54" fill="{accent}" opacity=".9"/>
  <rect x="1300" y="284" width="74" height="116" rx="18" fill="#fff" opacity=".95"/>
  <path d="M1198 410c72-60 142-60 214 0" fill="none" stroke="{dark}" stroke-width="16" stroke-linecap="round"/>
  <rect x="118" y="206" width="945" height="158" rx="28" fill="{soft}"/>
  {text_block(title_lines, 154, 274, 58, dark, 900)}
  <rect x="118" y="400" width="945" height="286" rx="30" fill="#fff" stroke="#e5edf2" stroke-width="4"/>
  {text_block(body_lines, 154, 466, 38, "#17202a", 800)}
  <rect x="118" y="718" width="1282" height="82" rx="26" fill="{soft}" stroke="{accent}" stroke-width="4"/>
  <text x="154" y="770" fill="{dark}" font-size="28" font-family="Be Vietnam Pro, Nunito, Arial, sans-serif" font-weight="900">Hoạt động:</text>
  {text_block(activity_lines[:2], 330, 770, 26, "#24313b", 800)}
</svg>'''
    path.write_text(svg, encoding="utf-8")


def write_viewer(path: Path, lesson: dict, manifest_slides: list[dict]) -> None:
    grade = lesson["grade"]
    title = html.escape(lesson["title"])
    subject = html.escape(lesson["subject"])
    slide_count = len(manifest_slides)
    slides = [f"images/slide-{i:02d}.svg" for i in range(1, slide_count + 1)]
    notes = [slide["audio_script"] for slide in manifest_slides]
    html_doc = f'''<!doctype html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} - Học mà chơi</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@600;700;800;900&family=Nunito:wght@500;700;800;900&display=swap&subset=vietnamese" rel="stylesheet">
  <style>
    * {{ box-sizing: border-box; }}
    body {{ margin: 0; min-height: 100vh; background: #0f1720; color: #fff; font-family: "Nunito", "Be Vietnam Pro", Arial, sans-serif; }}
    .viewer {{ display: grid; grid-template-columns: minmax(0, 1fr) 300px; height: 100vh; }}
    .stage {{ display: grid; place-items: center; padding: 24px; }}
    .slide {{ width: min(100%, calc((100vh - 48px) * 16 / 9)); aspect-ratio: 16 / 9; border: 0; border-radius: 18px; background: #fff; box-shadow: 0 24px 70px rgba(0,0,0,.42); }}
    aside {{ border-left: 1px solid rgba(255,255,255,.12); background: #131e29; padding: 22px; overflow: auto; }}
    h1 {{ margin: 0 0 8px; font-family: "Be Vietnam Pro", sans-serif; font-size: 24px; line-height: 1.25; }}
    .tag {{ display: inline-flex; padding: 6px 10px; border-radius: 999px; background: #e8f7ff; color: #006688; font-weight: 900; margin-bottom: 16px; }}
    .controls {{ display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 18px 0; }}
    button, a.button {{ min-height: 44px; border: 0; border-radius: 14px; padding: 0 12px; background: #4fc3f7; color: #062536; font: inherit; font-weight: 900; cursor: pointer; text-decoration: none; display: grid; place-items: center; white-space: nowrap; }}
    button.secondary, a.secondary {{ background: #fdd34d; color: #5a4300; }}
    .note {{ padding: 12px; border-radius: 14px; background: rgba(255,255,255,.08); color: #dce7ee; line-height: 1.5; }}
    .thumbs {{ display: grid; gap: 8px; margin-top: 14px; }}
    .thumbs button {{ justify-content: start; background: rgba(255,255,255,.08); color: #fff; text-align: left; }}
    .thumbs button.active {{ background: #e8f7ff; color: #006688; }}
    @media (max-width: 900px) {{ .viewer {{ grid-template-columns: 1fr; height: auto; min-height: 100vh; }} aside {{ border-left: 0; border-top: 1px solid rgba(255,255,255,.12); }} .stage {{ padding: 12px; }} }}
  </style>
</head>
<body>
  <main class="viewer">
    <section class="stage"><img class="slide" id="slide" alt="Slide bài học" /></section>
    <aside>
      <span class="tag">{subject} · Lớp {grade}</span>
      <h1>{title}</h1>
      <div id="counter">1 / {slide_count}</div>
      <div class="controls">
        <button id="prev">Trước</button><button id="next">Tiếp</button><button class="secondary" id="speak">Nghe</button><a class="button secondary" href="../index.html">Thư viện</a>
      </div>
      <div class="note">Phím tắt: ← → để chuyển slide, phím cách để nghe hoặc dừng lời dẫn.</div>
      <div id="notes"></div><div class="thumbs" id="thumbs"></div>
    </aside>
  </main>
  <script>
    const slides = {json.dumps(slides, ensure_ascii=False)};
    const notes = {json.dumps(notes, ensure_ascii=False)};
    const audioFiles = slides.map((_, i) => `audio/slide-${{String(i + 1).padStart(2, "0")}}.mp3`);
    let current = 0, activeAudio = null;
    const slideEl = document.querySelector("#slide"), counter = document.querySelector("#counter"), notesEl = document.querySelector("#notes"), thumbsEl = document.querySelector("#thumbs"), speakBtn = document.querySelector("#speak");
    function setSpeakLabel(isPlaying) {{ speakBtn.textContent = isPlaying ? "Dừng" : "Nghe"; }}
    function stopAudio() {{ if (activeAudio) {{ activeAudio.pause(); activeAudio.currentTime = 0; activeAudio = null; }} setSpeakLabel(false); }}
    function show(index) {{ const next = Math.max(0, Math.min(slides.length - 1, index)); if (next !== current) stopAudio(); current = next; slideEl.src = slides[current]; counter.textContent = `${{current + 1}} / ${{slides.length}}`; notesEl.innerHTML = ""; const note = document.createElement("div"); note.className = "note"; note.textContent = notes[current] || "Quan sát slide và làm theo hướng dẫn."; notesEl.appendChild(note); [...thumbsEl.children].forEach((button, i) => button.classList.toggle("active", i === current)); }}
    function speakWithBrowser(text) {{ playGeneratedTts(text); return true; }}
    async function playGeneratedTts(text) {{
      try {{
        const response = await fetch("http://127.0.0.1:8000/tts", {{
          method: "POST",
          headers: {{ "Content-Type": "application/json" }},
          body: JSON.stringify({{ text }})
        }});
        if (!response.ok) throw new Error(`TTS ${{response.status}}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        activeAudio = audio;
        setSpeakLabel(true);
        audio.onended = () => {{ URL.revokeObjectURL(url); activeAudio = null; setSpeakLabel(false); }};
        audio.onerror = () => {{ URL.revokeObjectURL(url); activeAudio = null; setSpeakLabel(false); }};
        await audio.play();
      }} catch (error) {{
        console.warn("Server TTS failed", error);
        activeAudio = null;
        setSpeakLabel(false);
      }}
    }}
    function playOrStopCurrent() {{ if (activeAudio) {{ stopAudio(); return; }} const text = notes[current] || "{title}. Quan sát và đọc theo nhé."; const audio = new Audio(audioFiles[current]); activeAudio = audio; setSpeakLabel(true); audio.onended = () => {{ activeAudio = null; setSpeakLabel(false); }}; audio.onerror = () => {{ activeAudio = null; speakWithBrowser(text); }}; audio.play().catch(() => {{ activeAudio = null; speakWithBrowser(text); }}); }}
    document.querySelector("#prev").onclick = () => show(current - 1); document.querySelector("#next").onclick = () => show(current + 1); speakBtn.onclick = playOrStopCurrent;
    slides.forEach((_, i) => {{ const button = document.createElement("button"); button.textContent = `Slide ${{i + 1}}`; button.onclick = () => show(i); thumbsEl.appendChild(button); }});
    document.addEventListener("keydown", (event) => {{ if (event.key === "ArrowLeft") show(current - 1); if (event.key === "ArrowRight") show(current + 1); if (event.key === " ") {{ event.preventDefault(); playOrStopCurrent(); }} }});
    show(0);
  </script>
</body>
</html>'''
    path.write_text(html_doc, encoding="utf-8")


def make_prompt(lesson: dict, slide: dict, slide_no: int) -> str:
    grade = lesson["grade"]
    return (
        "Use case: scientific-educational\n"
        f"Asset type: 16:9 lesson illustration for Vietnamese grade {grade} students\n"
        f"Primary request: Create a child-friendly illustration for slide {slide_no} of lesson '{lesson['title']}' ({lesson['subject']}).\n"
        "Style: warm classroom vector illustration, expressive and concrete, no brand characters.\n"
        f"Lesson title context: {slide['title']}\n"
        f"Lesson content context: {slide['body']}\n"
        f"Teacher activity context: {slide['activity']}\n"
    )


def write_lesson(lesson: dict, catalog: list[dict]) -> None:
    grade = int(lesson["grade"])
    lesson_id = f"grade{grade}_{slugify(lesson['slug'])}"
    out_dir = LESSONS_DIR / lesson_id
    images_dir = out_dir / "images"
    images_dir.mkdir(parents=True, exist_ok=True)
    slides = make_slides(lesson)
    manifest_slides = []
    prompt_slides = []
    for idx, slide in enumerate(slides, start=1):
        image_rel = f"images/slide-{idx:02d}.svg"
        write_svg(images_dir / f"slide-{idx:02d}.svg", lesson, slide, idx, len(slides))
        audio_script = f"{slide['title']}. {slide['body'].replace(chr(10), ' ')} Hoạt động: {slide['activity']}"
        manifest_slides.append({"slide_number": idx, "page_type": slide["page_type"], "title": slide["title"], "content": slide["body"], "activity": slide["activity"], "audio_script": audio_script, "image": image_rel, "audio": f"audio/slide-{idx:02d}.mp3"})
        prompt_slides.append({"slide_number": idx, "page_type": slide["page_type"], "content": f"{slide['title']}\n{slide['body']}\nHoạt động: {slide['activity']}", "prompt": make_prompt(lesson, slide, idx), "image_path": str((out_dir / image_rel).resolve())})
    manifest = {"id": lesson_id, "title": lesson["title"], "grade": grade, "subject": lesson["subject"], "keywords": lesson["keywords"], "objectives": ["Nhận biết kiến thức trọng tâm.", "Luyện tập qua ví dụ và trò chơi.", "Tự kiểm tra mức độ chắc chắn."], "slides": manifest_slides, "created_at": datetime.now().isoformat(timespec="seconds"), "source_note": "Nội dung tự soạn theo năng lực phù hợp, không sao chép nguyên văn sách giáo khoa."}
    prompts = {"metadata": {"title": lesson["title"], "grade": grade, "subject": lesson["subject"], "total_slides": len(slides), "style": "vector-illustration-no-text", "generated_at": datetime.now().isoformat(timespec="seconds")}, "slides": prompt_slides}
    (out_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    (out_dir / "prompts.json").write_text(json.dumps(prompts, ensure_ascii=False, indent=2), encoding="utf-8")
    write_viewer(out_dir / "index.html", lesson, manifest_slides)
    catalog.append({"id": lesson_id, "title": lesson["title"], "grade": grade, "subject": lesson["subject"], "slide_count": len(slides), "path": f"{lesson_id}/index.html", "manifest": f"{lesson_id}/manifest.json", "keywords": lesson["keywords"]})


def write_catalog(catalog: list[dict]) -> None:
    merged = {item["id"]: item for item in catalog}
    existing_path = LESSONS_DIR / "catalog.json"
    if existing_path.exists():
        for item in json.loads(existing_path.read_text(encoding="utf-8")):
            merged.setdefault(item["id"], item)
    items = sorted(merged.values(), key=lambda item: (int(item.get("grade", 1)), item["subject"], item["title"]))
    existing_path.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
    cards = "\n".join(
        f'''<a class="card" href="{html.escape(item['path'])}" data-grade="{int(item.get('grade', 1))}">
  <span>{html.escape(item['subject'])} · Lớp {int(item.get('grade', 1))}</span>
  <strong>{html.escape(item['title'])}</strong>
  <small>{item['slide_count']} slide · {html.escape(", ".join(item.get('keywords', [])[:3]))}</small>
</a>'''
        for item in items
    )
    index = f'''<!doctype html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thư viện học liệu - Học mà chơi</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@600;700;800;900&family=Nunito:wght@500;700;800;900&display=swap&subset=vietnamese" rel="stylesheet">
  <style>
    * {{ box-sizing: border-box; }} body {{ margin: 0; min-height: 100vh; background: linear-gradient(135deg, #e8f7ff, #fff8d7); color: #17202a; font-family: "Nunito", "Be Vietnam Pro", Arial, sans-serif; }}
    main {{ width: min(1180px, calc(100% - 32px)); margin: 0 auto; padding: 42px 0; }} h1 {{ margin: 0; font-family: "Be Vietnam Pro", sans-serif; font-size: clamp(34px, 5vw, 62px); line-height: 1.05; }}
    .lead {{ max-width: 820px; font-size: 20px; line-height: 1.55; color: #31424d; }} .toolbar {{ display: flex; flex-wrap: wrap; gap: 10px; margin: 24px 0; }}
    .pill {{ border: 0; border-radius: 999px; padding: 10px 14px; background: #fff; font-weight: 900; box-shadow: 0 4px 0 #d9e4ea; }}
    .grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }} .card {{ display: grid; gap: 10px; min-height: 172px; padding: 20px; border: 3px solid #dfe8ee; border-radius: 22px; background: #fff; color: inherit; text-decoration: none; box-shadow: 0 8px 0 #dfe8ee; }}
    .card:hover {{ transform: translateY(-3px); }} .card span {{ color: #006688; font-weight: 900; }} .card strong {{ font-family: "Be Vietnam Pro", sans-serif; font-size: 23px; line-height: 1.2; }} .card small {{ color: #52616b; font-weight: 800; line-height: 1.45; }}
  </style>
</head>
<body><main><h1>Thư viện học liệu</h1><p class="lead">Bộ học liệu tự soạn cho dự án Học mà chơi: lớp 1 mở rộng và ôn tập cuối năm lớp 5. Chữ tiếng Việt được render bằng HTML/SVG để tránh lỗi font trong ảnh AI.</p>
<div class="toolbar"><span class="pill">{len(items)} bài học</span><span class="pill">{sum(int(item['slide_count']) for item in items)} slide</span><span class="pill">Lớp 1 + ôn tập lớp 5</span><span class="pill">Ảnh minh họa không chữ</span></div><section class="grid">{cards}</section></main></body></html>'''
    (LESSONS_DIR / "index.html").write_text(index, encoding="utf-8")


def main() -> None:
    LESSONS_DIR.mkdir(exist_ok=True)
    catalog: list[dict] = []
    for lesson in EXTRA_LESSONS:
        write_lesson(lesson, catalog)
    write_catalog(catalog)
    print(f"Generated {len(catalog)} extra lessons.")
    print(f"Generated {sum(item['slide_count'] for item in catalog)} extra slides.")


if __name__ == "__main__":
    main()
