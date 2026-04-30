from __future__ import annotations

import html
import json
import re
import textwrap
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LESSONS_DIR = ROOT / "lessons"


LESSONS = [
    {
        "slug": "tieng_viet_net_co_ban",
        "subject": "Tiếng Việt",
        "title": "Làm quen nét cơ bản",
        "keywords": ["nét thẳng", "nét cong", "nét xiên", "nét móc"],
        "examples": ["Nét thẳng giống thân cây.", "Nét cong giống miệng cười.", "Nét xiên giống mái nhà."],
        "practice": "Bé dùng ngón tay vẽ nét trên không rồi đọc tên nét.",
        "game": "Tìm trong tranh đồ vật có nét thẳng, nét cong.",
    },
    {
        "slug": "tieng_viet_a_a_aa",
        "subject": "Tiếng Việt",
        "title": "Chữ a, ă, â",
        "keywords": ["a", "ă", "â", "cá", "ăn", "ấm"],
        "examples": ["a trong cá", "ă trong ăn", "â trong ấm"],
        "practice": "Bé đọc to: a, ă, â. Sau đó tìm tiếng có âm vừa học.",
        "game": "Giơ thẻ đúng khi nghe cô đọc a, ă hoặc â.",
    },
    {
        "slug": "tieng_viet_o_oo_ooo",
        "subject": "Tiếng Việt",
        "title": "Chữ o, ô, ơ",
        "keywords": ["o", "ô", "ơ", "bò", "cô", "cờ"],
        "examples": ["o trong bò", "ô trong cô", "ơ trong cờ"],
        "practice": "Bé nhìn miệng đọc tròn tiếng: o, ô, ơ.",
        "game": "Chọn đúng bông hoa mang chữ cô vừa đọc.",
    },
    {
        "slug": "tieng_viet_e_ee_i",
        "subject": "Tiếng Việt",
        "title": "Chữ e, ê, i",
        "keywords": ["e", "ê", "i", "me", "bê", "bi"],
        "examples": ["e trong me", "ê trong bê", "i trong bi"],
        "practice": "Bé đọc từng tiếng rồi vỗ tay theo nhịp.",
        "game": "Nối chữ với tranh: me, bê, bi.",
    },
    {
        "slug": "tieng_viet_u_uu_y",
        "subject": "Tiếng Việt",
        "title": "Chữ u, ư, y",
        "keywords": ["u", "ư", "y", "đu", "tư", "ly"],
        "examples": ["u trong đu", "ư trong tư", "y trong ly"],
        "practice": "Bé đọc chậm từng chữ, chú ý phân biệt u và ư.",
        "game": "Nghe âm và đặt quân cờ vào ô chữ đúng.",
    },
    {
        "slug": "tieng_viet_b_c_d_d",
        "subject": "Tiếng Việt",
        "title": "Chữ b, c, d, đ",
        "keywords": ["b", "c", "d", "đ", "ba", "cá", "da", "đi"],
        "examples": ["b trong ba", "c trong cá", "d trong da", "đ trong đi"],
        "practice": "Bé đọc âm đầu rồi ghép với a: ba, ca, da, đa.",
        "game": "Tìm tiếng bắt đầu bằng b, c, d, đ trong lớp học.",
    },
    {
        "slug": "tieng_viet_m_n_l_h",
        "subject": "Tiếng Việt",
        "title": "Chữ m, n, l, h",
        "keywords": ["m", "n", "l", "h", "mẹ", "na", "lá", "hoa"],
        "examples": ["m trong mẹ", "n trong na", "l trong lá", "h trong hoa"],
        "practice": "Bé đọc từng tiếng: mẹ, na, lá, hoa.",
        "game": "Bốc thẻ tranh rồi nói âm đầu của từ.",
    },
    {
        "slug": "tieng_viet_dau_thanh",
        "subject": "Tiếng Việt",
        "title": "Dấu thanh trong tiếng Việt",
        "keywords": ["ba", "bà", "bá", "bả", "bã", "bạ"],
        "examples": ["ba không dấu", "bà có dấu huyền", "bá có dấu sắc"],
        "practice": "Bé đọc một tiếng với nhiều dấu thanh khác nhau.",
        "game": "Nghe cô đọc và chọn đúng dấu thanh.",
    },
    {
        "slug": "tieng_viet_van_an_at",
        "subject": "Tiếng Việt",
        "title": "Vần an, at",
        "keywords": ["an", "at", "lan", "bạn", "hát", "mát"],
        "examples": ["lan có vần an", "hát có vần at", "mát có vần at"],
        "practice": "Bé đọc: an, lan, bạn. Bé đọc: at, hát, mát.",
        "game": "Đưa từ về đúng ngôi nhà an hoặc at.",
    },
    {
        "slug": "tieng_viet_van_ai_ay",
        "subject": "Tiếng Việt",
        "title": "Vần ai, ay",
        "keywords": ["ai", "ay", "mai", "tai", "tay", "bay"],
        "examples": ["mai có vần ai", "tay có vần ay", "bay có vần ay"],
        "practice": "Bé đọc cặp tiếng: tai - tay, mai - bay.",
        "game": "Nghe tiếng và giơ thẻ ai hoặc ay.",
    },
    {
        "slug": "tieng_viet_doc_cau_ngan",
        "subject": "Tiếng Việt",
        "title": "Tập đọc câu ngắn",
        "keywords": ["Bé đi học.", "Mẹ nấu cơm.", "Cô khen bé."],
        "examples": ["Bé đi học.", "Mẹ nấu cơm.", "Cô khen bé ngoan."],
        "practice": "Bé đọc từng câu, nghỉ nhẹ sau dấu chấm.",
        "game": "Xếp thẻ từ thành câu đúng rồi đọc lại.",
    },
    {
        "slug": "tieng_viet_ke_chuyen_tranh",
        "subject": "Tiếng Việt",
        "title": "Kể chuyện theo tranh",
        "keywords": ["ai", "ở đâu", "làm gì", "kết quả"],
        "examples": ["Bạn nhỏ tưới cây.", "Cây xanh tốt.", "Bạn nhỏ vui cười."],
        "practice": "Bé nhìn tranh và nói một câu ngắn.",
        "game": "Sắp xếp 3 tranh theo đúng thứ tự câu chuyện.",
    },
    {
        "slug": "toan_so_0_5",
        "subject": "Toán",
        "title": "Các số từ 0 đến 5",
        "keywords": ["0", "1", "2", "3", "4", "5"],
        "examples": ["1 quả táo", "2 chiếc bút", "5 ngôi sao"],
        "practice": "Bé đếm đồ vật rồi đọc số tương ứng.",
        "game": "Kéo số vào nhóm đồ vật có số lượng đúng.",
    },
    {
        "slug": "toan_so_6_10",
        "subject": "Toán",
        "title": "Các số từ 6 đến 10",
        "keywords": ["6", "7", "8", "9", "10"],
        "examples": ["6 bông hoa", "8 con cá", "10 que tính"],
        "practice": "Bé đếm chậm từ 1 đến 10 và đếm ngược từ 10 đến 1.",
        "game": "Tìm rổ có đúng số quả theo yêu cầu.",
    },
    {
        "slug": "toan_nhieu_it_bang_nhau",
        "subject": "Toán",
        "title": "Nhiều hơn, ít hơn, bằng nhau",
        "keywords": ["nhiều hơn", "ít hơn", "bằng nhau"],
        "examples": ["3 quả bóng nhiều hơn 2 quả bóng.", "4 cái kẹo bằng 4 cái kẹo."],
        "practice": "Bé so sánh hai nhóm đồ vật bằng cách ghép đôi.",
        "game": "Chọn nhóm nhiều hơn trong 5 giây.",
    },
    {
        "slug": "toan_cong_trong_5",
        "subject": "Toán",
        "title": "Cộng trong phạm vi 5",
        "keywords": ["1 + 1", "2 + 1", "3 + 2", "bằng"],
        "examples": ["2 quả cam thêm 1 quả cam là 3 quả cam.", "1 bông hoa thêm 4 bông hoa là 5 bông hoa."],
        "practice": "Bé dùng que tính để gộp hai nhóm.",
        "game": "Bắt cặp phép cộng với kết quả đúng.",
    },
    {
        "slug": "toan_tru_trong_5",
        "subject": "Toán",
        "title": "Trừ trong phạm vi 5",
        "keywords": ["5 - 1", "4 - 2", "còn lại"],
        "examples": ["5 cái kẹo ăn 1 cái còn 4 cái.", "4 con chim bay đi 2 con còn 2 con."],
        "practice": "Bé bớt đồ vật rồi đếm số còn lại.",
        "game": "Chọn kết quả đúng cho phép trừ.",
    },
    {
        "slug": "toan_hinh_co_ban",
        "subject": "Toán",
        "title": "Hình vuông, tròn, tam giác, chữ nhật",
        "keywords": ["hình vuông", "hình tròn", "hình tam giác", "hình chữ nhật"],
        "examples": ["Bánh xe giống hình tròn.", "Cửa sổ giống hình vuông.", "Mái nhà giống hình tam giác."],
        "practice": "Bé tìm đồ vật quanh lớp có hình đã học.",
        "game": "Ghép hình để tạo ngôi nhà nhỏ.",
    },
    {
        "slug": "toan_dai_ngan_cao_thap",
        "subject": "Toán",
        "title": "Dài, ngắn, cao, thấp",
        "keywords": ["dài", "ngắn", "cao", "thấp"],
        "examples": ["Cây thước dài hơn chiếc bút.", "Cái cây cao hơn bụi hoa."],
        "practice": "Bé đặt hai vật cạnh nhau để so sánh.",
        "game": "Chọn vật dài hơn hoặc cao hơn theo hiệu lệnh.",
    },
    {
        "slug": "toan_ngay_trong_tuan",
        "subject": "Toán",
        "title": "Các ngày trong tuần",
        "keywords": ["thứ hai", "thứ ba", "thứ tư", "cuối tuần"],
        "examples": ["Thứ hai em đi học.", "Thứ bảy em nghỉ ngơi cùng gia đình."],
        "practice": "Bé đọc thứ tự các ngày trong tuần.",
        "game": "Sắp xếp thẻ ngày theo đúng thứ tự.",
    },
    {
        "slug": "tnxh_co_the_em",
        "subject": "Tự nhiên và Xã hội",
        "title": "Cơ thể em",
        "keywords": ["mắt", "tai", "mũi", "miệng", "tay", "chân"],
        "examples": ["Mắt giúp em nhìn.", "Tai giúp em nghe.", "Tay giúp em cầm bút."],
        "practice": "Bé chỉ vào bộ phận cơ thể và nói công dụng.",
        "game": "Nghe tên bộ phận và chạm đúng vị trí.",
    },
    {
        "slug": "tnxh_gia_dinh_em",
        "subject": "Tự nhiên và Xã hội",
        "title": "Gia đình em",
        "keywords": ["ông", "bà", "bố", "mẹ", "anh", "chị", "em"],
        "examples": ["Gia đình yêu thương nhau.", "Mỗi người có việc phù hợp trong nhà."],
        "practice": "Bé kể tên các thành viên trong gia đình.",
        "game": "Ghép việc làm với thành viên phù hợp.",
    },
    {
        "slug": "tnxh_lop_hoc_em",
        "subject": "Tự nhiên và Xã hội",
        "title": "Lớp học của em",
        "keywords": ["bàn", "ghế", "bảng", "sách", "bút"],
        "examples": ["Bảng ở phía trước lớp.", "Sách vở cần được giữ sạch."],
        "practice": "Bé gọi tên đồ vật trong lớp học.",
        "game": "Tìm nhanh đồ vật theo lời cô.",
    },
    {
        "slug": "tnxh_cay_va_con_vat",
        "subject": "Tự nhiên và Xã hội",
        "title": "Cây và con vật quanh em",
        "keywords": ["cây", "lá", "hoa", "mèo", "chó", "chim"],
        "examples": ["Cây cần nước và ánh sáng.", "Con vật cần được chăm sóc nhẹ nhàng."],
        "practice": "Bé phân loại tranh cây và tranh con vật.",
        "game": "Đưa cây về vườn, đưa con vật về nhà.",
    },
    {
        "slug": "dao_duc_an_toan_duong",
        "subject": "Đạo đức - Kỹ năng",
        "title": "An toàn khi đi đường",
        "keywords": ["vỉa hè", "đèn đỏ", "đèn xanh", "qua đường"],
        "examples": ["Đèn đỏ dừng lại.", "Đèn xanh mới đi.", "Qua đường cần có người lớn đi cùng."],
        "practice": "Bé nói việc nên làm khi gặp đèn giao thông.",
        "game": "Chọn đúng hành động an toàn.",
    },
    {
        "slug": "dao_duc_ve_sinh_ca_nhan",
        "subject": "Đạo đức - Kỹ năng",
        "title": "Giữ vệ sinh cá nhân",
        "keywords": ["rửa tay", "đánh răng", "tắm", "khăn sạch"],
        "examples": ["Rửa tay trước khi ăn.", "Đánh răng sau khi ăn và trước khi ngủ."],
        "practice": "Bé nêu các bước rửa tay.",
        "game": "Sắp xếp tranh theo thứ tự rửa tay đúng.",
    },
    {
        "slug": "dao_duc_chia_se_voi_ban",
        "subject": "Đạo đức - Kỹ năng",
        "title": "Chia sẻ với bạn",
        "keywords": ["chia sẻ", "lắng nghe", "giúp đỡ", "cảm ơn"],
        "examples": ["Bạn quên bút, em có thể cho bạn mượn.", "Khi nhận giúp đỡ, em nói cảm ơn."],
        "practice": "Bé đóng vai tình huống chia sẻ đồ dùng.",
        "game": "Chọn lời nói lịch sự trong từng tình huống.",
    },
    {
        "slug": "dao_duc_giu_do_dung",
        "subject": "Đạo đức - Kỹ năng",
        "title": "Giữ gìn đồ dùng học tập",
        "keywords": ["sách", "vở", "bút", "cặp", "gọn gàng"],
        "examples": ["Bọc sách để sách sạch hơn.", "Cất bút vào hộp sau khi dùng."],
        "practice": "Bé sắp xếp cặp sách gọn gàng.",
        "game": "Tìm đồ dùng đặt sai chỗ trong tranh.",
    },
    {
        "slug": "my_thuat_mau_sac",
        "subject": "Mỹ thuật",
        "title": "Màu sắc cơ bản",
        "keywords": ["đỏ", "vàng", "xanh", "trắng", "đen"],
        "examples": ["Quả cà chua màu đỏ.", "Lá cây màu xanh.", "Mặt trời màu vàng."],
        "practice": "Bé gọi tên màu và tô hình đơn giản.",
        "game": "Tìm đồ vật có màu cô yêu cầu.",
    },
    {
        "slug": "am_nhac_nhip_vo",
        "subject": "Âm nhạc",
        "title": "Nhịp vỗ vui",
        "keywords": ["nhịp", "vỗ tay", "nhanh", "chậm"],
        "examples": ["Vỗ tay đều theo nhịp 1 - 2.", "Nghe nhạc nhanh thì vỗ nhanh hơn."],
        "practice": "Bé vỗ tay theo nhịp chậm rồi nhịp nhanh.",
        "game": "Nghe tiếng trống và lặp lại số lần vỗ.",
    },
    {
        "slug": "tieng_anh_do_vat_lop_hoc",
        "subject": "Tiếng Anh làm quen",
        "title": "Đồ vật trong lớp học",
        "keywords": ["book", "pen", "bag", "desk", "chair"],
        "examples": ["book là quyển sách", "pen là cây bút", "bag là cái cặp"],
        "practice": "Bé nghe từ tiếng Anh rồi chỉ vào đồ vật đúng.",
        "game": "Ghép thẻ tiếng Anh với tranh đồ vật.",
    },
]


PALETTES = {
    "Tiếng Việt": ("#2fb8ff", "#e8f7ff", "#064d66"),
    "Toán": ("#82c97f", "#effbef", "#265f2b"),
    "Tự nhiên và Xã hội": ("#ffcf4a", "#fff8d7", "#705700"),
    "Đạo đức - Kỹ năng": ("#ff8aa5", "#fff0f4", "#7a1730"),
    "Mỹ thuật": ("#a98cff", "#f3eeff", "#49317a"),
    "Âm nhạc": ("#ffad4d", "#fff1df", "#7a3a00"),
    "Tiếng Anh làm quen": ("#5fd3c6", "#e9fbf9", "#0e5c55"),
}


def slugify(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[^a-z0-9_]+", "_", value)
    return re.sub(r"_+", "_", value).strip("_")


def wrap_text(text: str, width: int) -> list[str]:
    lines: list[str] = []
    for paragraph in str(text).split("\n"):
        wrapped = textwrap.wrap(paragraph, width=width, break_long_words=False)
        lines.extend(wrapped or [""])
    return lines


def svg_text_block(lines: list[str], x: int, y: int, size: int, fill: str, weight: int = 700, line_gap: int = 1) -> str:
    chunks = []
    dy = 0
    for line in lines:
        safe = html.escape(line)
        chunks.append(
            f'<text x="{x}" y="{y + dy}" fill="{fill}" font-size="{size}" '
            f'font-family="Be Vietnam Pro, Nunito, Arial, sans-serif" font-weight="{weight}">{safe}</text>'
        )
        dy += int(size * (1.2 + line_gap * 0.1))
    return "\n".join(chunks)


def subject_icon(subject: str, accent: str) -> str:
    if subject == "Tiếng Việt":
        return f'<path d="M0 0h170a44 44 0 0 1 44 44v124H44A44 44 0 0 1 0 124Z" fill="{accent}"/><text x="58" y="102" font-size="72" font-weight="900" fill="#fff" font-family="Arial">A</text>'
    if subject == "Toán":
        return f'<rect x="0" y="0" width="214" height="168" rx="42" fill="{accent}"/><circle cx="68" cy="84" r="28" fill="#fff"/><text x="114" y="108" font-size="72" font-weight="900" fill="#fff" font-family="Arial">5</text>'
    if subject == "Tự nhiên và Xã hội":
        return f'<circle cx="92" cy="76" r="54" fill="{accent}"/><path d="M104 116c54 8 86 38 94 88-54-2-90-26-94-88Z" fill="#75c979"/><path d="M86 116c-52 8-84 38-92 88 54-2 88-26 92-88Z" fill="#5ebd67"/>'
    if subject == "Đạo đức - Kỹ năng":
        return f'<path d="M107 184S10 126 10 62C10 24 56 8 88 38l19 18 19-18c32-30 78-14 78 24 0 64-97 122-97 122Z" fill="{accent}"/>'
    if subject == "Mỹ thuật":
        return f'<circle cx="108" cy="84" r="74" fill="{accent}"/><circle cx="70" cy="58" r="14" fill="#fff"/><circle cx="116" cy="42" r="14" fill="#fff"/><circle cx="150" cy="76" r="14" fill="#fff"/><path d="M98 142c24 4 40-6 44-24 6-28-32-28-44 24Z" fill="#fff"/>'
    if subject == "Âm nhạc":
        return f'<path d="M136 20v116a42 42 0 1 1-24-38V42l82-20v94a42 42 0 1 1-24-38V0Z" fill="{accent}"/>'
    return f'<rect x="0" y="0" width="214" height="168" rx="42" fill="{accent}"/><text x="40" y="104" font-size="56" font-weight="900" fill="#fff" font-family="Arial">EN</text>'


def make_slides(lesson: dict) -> list[dict]:
    title = lesson["title"]
    subject = lesson["subject"]
    keywords = lesson["keywords"]
    examples = lesson["examples"]
    return [
        {
            "page_type": "cover",
            "title": title,
            "body": f"{subject} lớp 1\nHọc bằng hình, nói bằng lời, chơi để nhớ lâu.",
            "activity": "Giáo viên hoặc phụ huynh đọc tên bài, bé nhắc lại chủ đề.",
        },
        {
            "page_type": "content",
            "title": "Mục tiêu hôm nay",
            "body": "Bé sẽ biết:\n- Nhận ra nội dung chính của bài.\n- Nói được từ khóa quan trọng.\n- Làm một nhiệm vụ nhỏ để kiểm tra.",
            "activity": "Bé giơ tay khi nghe từ khóa quen thuộc.",
        },
        {
            "page_type": "content",
            "title": "Từ khóa cần nhớ",
            "body": "\n".join(f"- {item}" for item in keywords[:6]),
            "activity": "Bé đọc từng từ khóa. Nếu từ khó, đọc chậm từng tiếng.",
        },
        {
            "page_type": "content",
            "title": "Ví dụ dễ hiểu",
            "body": "\n".join(f"- {item}" for item in examples[:4]),
            "activity": "Bé chọn một ví dụ và nói lại bằng lời của mình.",
        },
        {
            "page_type": "practice",
            "title": "Bé cùng luyện tập",
            "body": lesson["practice"],
            "activity": "Làm mẫu một lần, sau đó để bé tự làm lại.",
        },
        {
            "page_type": "game",
            "title": "Trò chơi củng cố",
            "body": lesson["game"],
            "activity": "Hoàn thành trò chơi, bé nhận 20-35 xu tùy mức độ cố gắng.",
        },
        {
            "page_type": "summary",
            "title": "Con đã học được gì?",
            "body": f"Hôm nay bé đã học: {title.lower()}.\nBé nói lại 2 từ khóa và 1 điều bé thích nhất.",
            "activity": "Phụ huynh ghi nhận xét ngắn: rõ, cần luyện thêm, hoặc rất tự tin.",
        },
    ]


def write_slide_svg(path: Path, lesson: dict, slide: dict, slide_no: int, total: int) -> None:
    accent, soft, dark = PALETTES.get(lesson["subject"], PALETTES["Tiếng Việt"])
    title_lines = wrap_text(slide["title"], 26)
    body_lines = wrap_text(slide["body"], 40)
    activity_lines = wrap_text(slide["activity"], 54)
    icon = subject_icon(lesson["subject"], accent)
    page = f"{slide_no}/{total}"
    safe_subject = html.escape(lesson["subject"])

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <rect width="1600" height="900" fill="#f8fbff"/>
  <circle cx="1480" cy="80" r="240" fill="{soft}"/>
  <circle cx="120" cy="790" r="240" fill="{soft}"/>
  <rect x="70" y="58" width="1460" height="784" rx="48" fill="#ffffff" stroke="#dde8ef" stroke-width="6"/>
  <rect x="70" y="58" width="1460" height="96" rx="48" fill="{accent}"/>
  <rect x="70" y="112" width="1460" height="42" fill="{accent}"/>
  <text x="118" y="122" fill="#ffffff" font-size="34" font-family="Be Vietnam Pro, Nunito, Arial, sans-serif" font-weight="900">{safe_subject}</text>
  <text x="1430" y="122" fill="#ffffff" font-size="30" font-family="Be Vietnam Pro, Nunito, Arial, sans-serif" font-weight="800">{page}</text>
  <g transform="translate(1200 248)">{icon}</g>
  <rect x="1140" y="210" width="300" height="260" rx="44" fill="{soft}" opacity="0.86"/>
  <rect x="118" y="206" width="945" height="158" rx="28" fill="{soft}"/>
  {svg_text_block(title_lines, 154, 274, 58, dark, 900)}
  <rect x="118" y="400" width="945" height="286" rx="30" fill="#ffffff" stroke="#e5edf2" stroke-width="4"/>
  {svg_text_block(body_lines, 154, 466, 38, "#17202a", 800, 1)}
  <rect x="118" y="718" width="1282" height="82" rx="26" fill="{soft}" stroke="{accent}" stroke-width="4"/>
  <text x="154" y="770" fill="{dark}" font-size="28" font-family="Be Vietnam Pro, Nunito, Arial, sans-serif" font-weight="900">Hoạt động:</text>
  {svg_text_block(activity_lines[:2], 330, 770, 26, "#24313b", 800, 0)}
</svg>'''
    path.write_text(svg, encoding="utf-8")


def write_viewer(path: Path, lesson: dict, manifest_slides: list[dict]) -> None:
    title = html.escape(lesson["title"])
    subject = html.escape(lesson["subject"])
    slide_count = len(manifest_slides)
    slides = [
        f"images2/slide-{i:02d}.png" if (path.parent / f"images2/slide-{i:02d}.png").exists() else f"images/slide-{i:02d}.svg"
        for i in range(1, slide_count + 1)
    ]
    slides_json = json.dumps(slides, ensure_ascii=False)
    notes = [slide["audio_script"] for slide in manifest_slides]
    notes_json = json.dumps(notes, ensure_ascii=False)
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
    :root {{ --ink: #f8fbff; --sky: #7dd3fc; --sun: #ffd166; }}
    body {{ margin: 0; min-height: 100vh; background: radial-gradient(circle at 12% 12%, rgba(125,211,252,.28), transparent 30%), radial-gradient(circle at 88% 18%, rgba(255,209,102,.22), transparent 26%), linear-gradient(135deg, #07111f 0%, #102033 52%, #18324a 100%); color: var(--ink); font-family: "Nunito", "Be Vietnam Pro", Arial, sans-serif; text-rendering: optimizeLegibility; }}
    .viewer {{ display: grid; grid-template-columns: minmax(0, 1fr) 320px; height: 100vh; }}
    .stage {{ display: grid; place-items: center; padding: clamp(12px, 3vw, 32px); }}
    .slide {{ width: min(100%, calc((100vh - 64px) * 16 / 9)); aspect-ratio: 16 / 9; object-fit: contain; border: 0; border-radius: 24px; background: #fff; box-shadow: 0 28px 80px rgba(0,0,0,.46), 0 0 0 1px rgba(255,255,255,.18); }}
    aside {{ border-left: 1px solid rgba(255,255,255,.14); background: linear-gradient(180deg, rgba(23,43,66,.96), rgba(9,22,36,.98)); padding: 24px; overflow: auto; }}
    h1 {{ margin: 0 0 10px; font-family: "Be Vietnam Pro", sans-serif; font-size: clamp(24px, 2.4vw, 32px); line-height: 1.16; letter-spacing: -.02em; }}
    .tag {{ display: inline-flex; padding: 7px 11px; border-radius: 999px; background: #e8f7ff; color: #005b7a; font-weight: 900; margin-bottom: 16px; box-shadow: 0 8px 20px rgba(125,211,252,.2); }}
    .controls {{ display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 18px 0; }}
    button, a.button {{ min-height: 46px; border: 0; border-radius: 16px; padding: 0 14px; background: var(--sky); color: #062536; font: inherit; font-weight: 900; cursor: pointer; text-decoration: none; display: grid; place-items: center; box-shadow: 0 10px 24px rgba(125,211,252,.18); }}
    button, a.button {{ white-space: nowrap; }}
    button.secondary, a.secondary {{ background: var(--sun); color: #503900; }}
    button:hover, a.button:hover {{ transform: translateY(-1px); filter: brightness(1.03); }}
    .notes {{ display: grid; gap: 10px; margin-top: 14px; }}
    .note {{ padding: 14px; border-radius: 16px; background: rgba(255,255,255,.1); color: #eef7ff; line-height: 1.58; font-size: 16px; }}
    .thumbs {{ display: grid; gap: 8px; margin-top: 14px; }}
    .thumbs button {{ justify-content: start; background: rgba(255,255,255,.08); color: #fff; text-align: left; }}
    .thumbs button.active {{ background: #e8f7ff; color: #005b7a; }}
    @media (max-width: 900px) {{ .viewer {{ grid-template-columns: 1fr; height: auto; min-height: 100vh; }} aside {{ border-left: 0; border-top: 1px solid rgba(255,255,255,.12); }} .stage {{ padding: 12px; }} .slide {{ width: 100%; border-radius: 18px; }} }}
  </style>
</head>
<body>
  <main class="viewer">
    <section class="stage">
      <img class="slide" id="slide" alt="Slide bài học" />
    </section>
    <aside>
      <span class="tag">{subject} · Lớp 1</span>
      <h1>{title}</h1>
      <div id="counter">1 / {slide_count}</div>
      <div class="controls">
        <button id="prev">Trước</button>
        <button id="next">Tiếp</button>
        <button class="secondary" id="speak">Nghe</button>
        <a class="button secondary" href="../index.html">Thư viện</a>
      </div>
      <div class="note">Phím tắt: ← → để chuyển slide, phím cách để nghe hoặc dừng lời dẫn.</div>
      <div class="notes" id="notes"></div>
      <div class="thumbs" id="thumbs"></div>
    </aside>
  </main>
  <script>
    const slides = {slides_json};
    const notes = {notes_json};
    const audioFiles = slides.map((_, i) => `audio/slide-${{String(i + 1).padStart(2, "0")}}.mp3`);
    let current = 0;
    let activeAudio = null;
    const slideEl = document.querySelector("#slide");
    const counter = document.querySelector("#counter");
    const notesEl = document.querySelector("#notes");
    const thumbsEl = document.querySelector("#thumbs");
    const speakBtn = document.querySelector("#speak");
    function setSpeakLabel(isPlaying) {{
      speakBtn.textContent = isPlaying ? "Dừng" : "Nghe";
    }}
    function stopAudio() {{
      if (activeAudio) {{
        activeAudio.pause();
        activeAudio.currentTime = 0;
        activeAudio = null;
      }}
      setSpeakLabel(false);
    }}
    function show(index) {{
      const next = Math.max(0, Math.min(slides.length - 1, index));
      if (next !== current) stopAudio();
      current = next;
      slideEl.src = slides[current];
      counter.textContent = `${{current + 1}} / ${{slides.length}}`;
      notesEl.textContent = "";
      const note = document.createElement("div");
      note.className = "note";
      note.textContent = notes[current] || "Bé quan sát slide và làm theo hướng dẫn.";
      notesEl.appendChild(note);
      [...thumbsEl.children].forEach((button, i) => button.classList.toggle("active", i === current));
    }}
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
    function playOrStopCurrent() {{
      if (activeAudio) {{
        stopAudio();
        return;
      }}
      const text = notes[current] || "{title}. Bé quan sát và đọc theo cô nhé.";
      const audio = new Audio(audioFiles[current]);
      audio.preload = "metadata";
      activeAudio = audio;
      setSpeakLabel(true);
      audio.onended = () => {{ activeAudio = null; setSpeakLabel(false); }};
      audio.onerror = () => {{ activeAudio = null; speakWithBrowser(text); }};
      audio.play().catch(() => {{ activeAudio = null; speakWithBrowser(text); }});
    }}
    document.querySelector("#prev").onclick = () => show(current - 1);
    document.querySelector("#next").onclick = () => show(current + 1);
    speakBtn.onclick = playOrStopCurrent;
    slides.forEach((_, i) => {{
      const button = document.createElement("button");
      button.textContent = `Slide ${{i + 1}}`;
      button.onclick = () => show(i);
      thumbsEl.appendChild(button);
    }});
    document.addEventListener("keydown", (event) => {{
      if (event.key === "ArrowLeft") show(current - 1);
      if (event.key === "ArrowRight") show(current + 1);
      if (event.key === " ") {{ event.preventDefault(); playOrStopCurrent(); }}
    }});
    show(0);
  </script>
</body>
</html>'''
    path.write_text(html_doc, encoding="utf-8")


def make_prompt(lesson: dict, slide: dict, slide_no: int) -> str:
    return (
        "Use case: scientific-educational\n"
        "Asset type: 16:9 HTML PPT slide image for Vietnamese grade 1 children\n"
        f"Primary request: Create slide {slide_no} for lesson '{lesson['title']}' ({lesson['subject']}).\n"
        "Style: warm vector illustration, large readable Vietnamese text, child-friendly, no brand characters, no watermark.\n"
        f"Exact Vietnamese slide title: {slide['title']}\n"
        f"Exact Vietnamese content: {slide['body']}\n"
        f"Teacher activity note: {slide['activity']}\n"
    )


def write_lesson(lesson: dict, catalog: list[dict]) -> None:
    lesson_id = f"grade1_{slugify(lesson['slug'])}"
    out_dir = LESSONS_DIR / lesson_id
    images_dir = out_dir / "images"
    images_dir.mkdir(parents=True, exist_ok=True)

    slides = make_slides(lesson)
    total = len(slides)
    manifest_slides = []
    prompt_slides = []
    for idx, slide in enumerate(slides, start=1):
        image_rel = f"images/slide-{idx:02d}.svg"
        write_slide_svg(images_dir / f"slide-{idx:02d}.svg", lesson, slide, idx, total)
        audio_script = (
            f"{slide['title']}. {slide['body'].replace(chr(10), ' ')} "
            f"Hoạt động: {slide['activity']}"
        )
        manifest_slides.append({
            "slide_number": idx,
            "page_type": slide["page_type"],
            "title": slide["title"],
            "content": slide["body"],
            "activity": slide["activity"],
            "audio_script": audio_script,
            "image": image_rel,
            "audio": f"audio/slide-{idx:02d}.mp3",
        })
        prompt_slides.append({
            "slide_number": idx,
            "page_type": slide["page_type"],
            "content": f"{slide['title']}\n{slide['body']}\nHoạt động: {slide['activity']}",
            "prompt": make_prompt(lesson, slide, idx),
            "image_path": str((out_dir / image_rel).resolve()),
        })

    manifest = {
        "id": lesson_id,
        "title": lesson["title"],
        "grade": 1,
        "subject": lesson["subject"],
        "keywords": lesson["keywords"],
        "objectives": [
            "Nhận biết nội dung chính của bài.",
            "Đọc hoặc nói được các từ khóa quan trọng.",
            "Hoàn thành một hoạt động luyện tập ngắn.",
        ],
        "slides": manifest_slides,
        "created_at": datetime.now().isoformat(timespec="seconds"),
        "source_note": "Nội dung tự soạn theo năng lực lớp 1, không sao chép nguyên văn sách giáo khoa.",
    }
    prompts = {
        "metadata": {
            "title": lesson["title"],
            "grade": 1,
            "subject": lesson["subject"],
            "total_slides": total,
            "style": "vector-illustration",
            "generated_at": datetime.now().isoformat(timespec="seconds"),
            "nano_banana_ready": True,
        },
        "slides": prompt_slides,
    }
    (out_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    (out_dir / "prompts.json").write_text(json.dumps(prompts, ensure_ascii=False, indent=2), encoding="utf-8")
    write_viewer(out_dir / "index.html", lesson, manifest_slides)

    catalog.append({
        "id": lesson_id,
        "title": lesson["title"],
        "grade": 1,
        "subject": lesson["subject"],
        "slide_count": total,
        "path": f"{lesson_id}/index.html",
        "manifest": f"{lesson_id}/manifest.json",
        "keywords": lesson["keywords"],
    })


def write_catalog(catalog: list[dict]) -> None:
    catalog = sorted(catalog, key=lambda item: (item["subject"], item["title"]))
    (LESSONS_DIR / "catalog.json").write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding="utf-8")
    cards = "\n".join(
        f'''<a class="card" href="{html.escape(item['path'])}">
  <span>{html.escape(item['subject'])} · Lớp 1</span>
  <strong>{html.escape(item['title'])}</strong>
  <small>{item['slide_count']} slide · {html.escape(", ".join(item['keywords'][:3]))}</small>
</a>'''
        for item in catalog
    )
    index = f'''<!doctype html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thư viện học liệu lớp 1 - Học mà chơi</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@600;700;800;900&family=Nunito:wght@500;700;800;900&display=swap&subset=vietnamese" rel="stylesheet">
  <style>
    * {{ box-sizing: border-box; }}
    body {{ margin: 0; min-height: 100vh; background: linear-gradient(135deg, #e8f7ff, #fff8d7); color: #17202a; font-family: "Nunito", "Be Vietnam Pro", Arial, sans-serif; }}
    main {{ width: min(1180px, calc(100% - 32px)); margin: 0 auto; padding: 42px 0; }}
    h1 {{ margin: 0; font-family: "Be Vietnam Pro", sans-serif; font-size: clamp(34px, 5vw, 62px); line-height: 1.05; }}
    .lead {{ max-width: 760px; font-size: 20px; line-height: 1.55; color: #31424d; }}
    .toolbar {{ display: flex; flex-wrap: wrap; gap: 10px; margin: 24px 0; }}
    .pill {{ border: 0; border-radius: 999px; padding: 10px 14px; background: #fff; font-weight: 900; box-shadow: 0 4px 0 #d9e4ea; }}
    .grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }}
    .card {{ display: grid; gap: 10px; min-height: 172px; padding: 20px; border: 3px solid #dfe8ee; border-radius: 22px; background: #fff; color: inherit; text-decoration: none; box-shadow: 0 8px 0 #dfe8ee; }}
    .card:hover {{ transform: translateY(-3px); }}
    .card span {{ color: #006688; font-weight: 900; }}
    .card strong {{ font-family: "Be Vietnam Pro", sans-serif; font-size: 23px; line-height: 1.2; }}
    .card small {{ color: #52616b; font-weight: 800; line-height: 1.45; }}
  </style>
</head>
<body>
  <main>
    <h1>Thư viện học liệu lớp 1</h1>
    <p class="lead">Bộ học liệu tự soạn cho dự án Học mà chơi, bám các mạch năng lực thường gặp ở lớp 1: Tiếng Việt, Toán, Tự nhiên và Xã hội, Đạo đức - kỹ năng, Mỹ thuật, Âm nhạc và tiếng Anh làm quen.</p>
    <div class="toolbar">
      <span class="pill">{len(catalog)} bài học</span>
      <span class="pill">{sum(item['slide_count'] for item in catalog)} slide</span>
      <span class="pill">HTML + SVG 16:9</span>
      <span class="pill">Có lời dẫn audio vi-VN</span>
    </div>
    <section class="grid">
      {cards}
    </section>
  </main>
</body>
</html>'''
    (LESSONS_DIR / "index.html").write_text(index, encoding="utf-8")


def main() -> None:
    LESSONS_DIR.mkdir(exist_ok=True)
    catalog: list[dict] = []
    for lesson in LESSONS:
        write_lesson(lesson, catalog)
    write_catalog(catalog)
    print(f"Generated {len(catalog)} lessons in {LESSONS_DIR}")
    print(f"Generated {sum(item['slide_count'] for item in catalog)} slides")


if __name__ == "__main__":
    main()
