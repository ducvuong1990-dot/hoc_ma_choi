from __future__ import annotations

import html
import json
import textwrap
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LESSONS_DIR = ROOT / "lessons"


QUIZZES = [
    {
        "id": "grade5_trac_nghiem_toan",
        "title": "Trắc nghiệm ôn tập Toán lớp 5",
        "subject": "Trắc nghiệm cuối năm - Toán",
        "keywords": ["phân số", "số thập phân", "phần trăm", "hình học", "chuyển động"],
        "questions": [
            {"q": "Phân số nào bằng 3/4?", "choices": ["6/8", "4/6", "9/16", "12/20"], "answer": 0, "explain": "Nhân cả tử và mẫu của 3/4 với 2 được 6/8."},
            {"q": "Số thập phân 4,75 đọc là gì?", "choices": ["Bốn phẩy bảy mươi lăm", "Bốn phẩy bảy năm", "Bốn trăm bảy mươi lăm", "Bốn và bảy phần năm"], "answer": 0, "explain": "4,75 đọc là bốn phẩy bảy mươi lăm."},
            {"q": "25% của 200 là bao nhiêu?", "choices": ["25", "40", "50", "75"], "answer": 2, "explain": "25% là một phần tư; một phần tư của 200 là 50."},
            {"q": "Diện tích hình chữ nhật có chiều dài 8 cm, chiều rộng 5 cm là:", "choices": ["13 cm2", "26 cm2", "40 cm2", "80 cm2"], "answer": 2, "explain": "Diện tích hình chữ nhật bằng dài nhân rộng: 8 x 5 = 40."},
            {"q": "Một xe đi 120 km trong 3 giờ. Vận tốc trung bình là:", "choices": ["30 km/giờ", "40 km/giờ", "60 km/giờ", "360 km/giờ"], "answer": 1, "explain": "Vận tốc bằng quãng đường chia thời gian: 120 : 3 = 40."},
            {"q": "Số 7,08 có chữ số 8 ở hàng nào?", "choices": ["Hàng đơn vị", "Hàng phần mười", "Hàng phần trăm", "Hàng phần nghìn"], "answer": 2, "explain": "Trong 7,08, chữ số 8 đứng ở hàng phần trăm."},
            {"q": "Chu vi hình vuông cạnh 9 cm là:", "choices": ["18 cm", "27 cm", "36 cm", "81 cm"], "answer": 2, "explain": "Chu vi hình vuông bằng cạnh nhân 4: 9 x 4 = 36."},
            {"q": "Kết quả của 2,5 + 0,75 là:", "choices": ["2,575", "3,25", "3,75", "25,75"], "answer": 1, "explain": "Cộng thẳng hàng dấu phẩy: 2,50 + 0,75 = 3,25."},
            {"q": "Rút gọn phân số 12/18 được:", "choices": ["2/3", "3/2", "6/9", "4/8"], "answer": 0, "explain": "Chia cả tử và mẫu cho 6 được 2/3."},
            {"q": "Thể tích hình hộp chữ nhật dài 5 cm, rộng 4 cm, cao 3 cm là:", "choices": ["12 cm3", "20 cm3", "60 cm3", "120 cm3"], "answer": 2, "explain": "Thể tích bằng dài x rộng x cao: 5 x 4 x 3 = 60."},
            {"q": "3/5 viết dưới dạng số thập phân là:", "choices": ["0,3", "0,5", "0,6", "3,5"], "answer": 2, "explain": "3 : 5 = 0,6."},
            {"q": "Một món đồ 80 000 đồng giảm 10%. Số tiền giảm là:", "choices": ["800 đồng", "4 000 đồng", "8 000 đồng", "10 000 đồng"], "answer": 2, "explain": "10% của 80 000 là 8 000."},
        ],
    },
    {
        "id": "grade5_trac_nghiem_tieng_viet",
        "title": "Trắc nghiệm ôn tập Tiếng Việt lớp 5",
        "subject": "Trắc nghiệm cuối năm - Tiếng Việt",
        "keywords": ["đọc hiểu", "từ loại", "câu ghép", "dấu câu", "liên kết câu"],
        "questions": [
            {"q": "Trong câu 'Những bông hoa nở rực rỡ trong nắng', chủ ngữ là:", "choices": ["Những bông hoa", "nở rực rỡ", "trong nắng", "rực rỡ trong nắng"], "answer": 0, "explain": "Chủ ngữ trả lời câu hỏi Ai? Cái gì? Ở đây là 'Những bông hoa'."},
            {"q": "Từ nào là từ đồng nghĩa với 'chăm chỉ'?", "choices": ["siêng năng", "vội vàng", "lặng lẽ", "rộng rãi"], "answer": 0, "explain": "'Siêng năng' gần nghĩa với 'chăm chỉ'."},
            {"q": "Cặp từ nào là từ trái nghĩa?", "choices": ["cao - thấp", "xinh - đẹp", "nhanh - mau", "to - lớn"], "answer": 0, "explain": "Cao và thấp có nghĩa trái ngược nhau."},
            {"q": "Câu nào là câu ghép?", "choices": ["Trời mưa to và gió thổi mạnh.", "Em học bài.", "Hoa nở trong vườn.", "Bạn Nam đọc sách rất hay."], "answer": 0, "explain": "Câu có hai vế nêu hai sự việc: trời mưa to, gió thổi mạnh."},
            {"q": "Dấu hai chấm thường dùng để:", "choices": ["Báo hiệu lời nói trực tiếp hoặc phần giải thích", "Kết thúc câu hỏi", "Ngăn cách các tiếng trong từ", "Thay cho dấu chấm hết"], "answer": 0, "explain": "Dấu hai chấm có thể báo hiệu lời nói trực tiếp hoặc phần giải thích, liệt kê."},
            {"q": "Từ 'xanh biếc' thuộc kiểu từ nào?", "choices": ["Từ ghép phân loại", "Từ láy", "Đại từ", "Quan hệ từ"], "answer": 0, "explain": "'Xanh biếc' là từ ghép chỉ sắc xanh cụ thể."},
            {"q": "Quan hệ từ trong câu 'Em học bài vì ngày mai kiểm tra' là:", "choices": ["Em", "học", "vì", "kiểm tra"], "answer": 2, "explain": "'Vì' nối nguyên nhân với sự việc."},
            {"q": "Câu 'Bạn Lan vừa hát vừa múa' dùng cặp quan hệ từ nào?", "choices": ["vừa...vừa", "nếu...thì", "tuy...nhưng", "không những...mà còn"], "answer": 0, "explain": "Cặp từ thể hiện hai hoạt động diễn ra cùng lúc."},
            {"q": "Để liên kết câu, có thể dùng cách nào?", "choices": ["Lặp từ ngữ, thay thế từ ngữ, dùng từ nối", "Viết câu thật dài", "Bỏ dấu câu", "Chỉ dùng một kiểu câu"], "answer": 0, "explain": "Đây là ba cách liên kết câu thường gặp."},
            {"q": "Trong bài văn tả cảnh, phần mở bài thường có nhiệm vụ:", "choices": ["Giới thiệu cảnh được tả", "Nêu kết quả phép tính", "Kể toàn bộ câu chuyện", "Liệt kê từ đồng nghĩa"], "answer": 0, "explain": "Mở bài giới thiệu đối tượng hoặc cảnh được tả."},
            {"q": "Từ nào là đại từ xưng hô?", "choices": ["tôi", "đẹp", "chạy", "xanh"], "answer": 0, "explain": "'Tôi' dùng để xưng hô."},
            {"q": "Câu hỏi thường kết thúc bằng dấu:", "choices": ["dấu hỏi", "dấu chấm", "dấu phẩy", "dấu gạch ngang"], "answer": 0, "explain": "Câu hỏi kết thúc bằng dấu hỏi."},
        ],
    },
    {
        "id": "grade5_trac_nghiem_tieng_anh",
        "title": "Trắc nghiệm ôn tập Tiếng Anh lớp 5",
        "subject": "Trắc nghiệm cuối năm - Tiếng Anh",
        "keywords": ["vocabulary", "sentences", "grammar", "reading", "daily routines"],
        "questions": [
            {"q": "Choose the correct sentence.", "choices": ["She like apples.", "She likes apples.", "She liking apples.", "She liked apple everyday."], "answer": 1, "explain": "With 'she', use 'likes' in the present simple."},
            {"q": "What is the opposite of 'hot'?", "choices": ["cold", "warm", "sunny", "rainy"], "answer": 0, "explain": "'Cold' is the opposite of 'hot'."},
            {"q": "Complete: I go to school ____ Monday.", "choices": ["in", "on", "at", "for"], "answer": 1, "explain": "Use 'on' with days of the week."},
            {"q": "Which word is a food?", "choices": ["banana", "pencil", "chair", "river"], "answer": 0, "explain": "A banana is a food."},
            {"q": "Question: 'Where are you from?' Correct answer:", "choices": ["I am ten.", "I am from Viet Nam.", "I like football.", "It is sunny."], "answer": 1, "explain": "The question asks about country or hometown."},
            {"q": "Complete: There ____ two books on the table.", "choices": ["is", "are", "am", "be"], "answer": 1, "explain": "Use 'are' for plural nouns."},
            {"q": "What time is '7:30'?", "choices": ["seven thirty", "seven thirteen", "half seven o'clock", "thirty seven"], "answer": 0, "explain": "7:30 is read as seven thirty."},
            {"q": "Choose the correct past form: 'go'", "choices": ["goed", "went", "goes", "going"], "answer": 1, "explain": "The past form of 'go' is 'went'."},
            {"q": "Which sentence asks about hobby?", "choices": ["What is your hobby?", "Where is the book?", "How old are you?", "What color is it?"], "answer": 0, "explain": "It directly asks about hobby."},
            {"q": "Complete: He is ____ than me.", "choices": ["tall", "taller", "tallest", "more tall"], "answer": 1, "explain": "Use comparative form 'taller'."},
            {"q": "What does 'library' mean?", "choices": ["thư viện", "sân chơi", "nhà bếp", "bệnh viện"], "answer": 0, "explain": "'Library' means 'thư viện'."},
            {"q": "Choose the correct answer: Can you swim?", "choices": ["Yes, I can.", "Yes, I do.", "Yes, I am.", "Yes, I was."], "answer": 0, "explain": "Answer 'Can you...?' with 'can'."},
        ],
    },
    {
        "id": "grade5_trac_nghiem_khoa_hoc",
        "title": "Trắc nghiệm ôn tập Khoa học lớp 5",
        "subject": "Trắc nghiệm cuối năm - Khoa học",
        "keywords": ["cơ thể", "năng lượng", "vật chất", "môi trường", "an toàn"],
        "questions": [
            {"q": "Cơ thể cần chất dinh dưỡng để:", "choices": ["lớn lên và hoạt động", "làm đồ chơi", "tạo ra mưa", "đổi màu quần áo"], "answer": 0, "explain": "Dinh dưỡng giúp cơ thể phát triển và có năng lượng."},
            {"q": "Nguồn năng lượng nào là năng lượng tái tạo?", "choices": ["mặt trời", "than đá", "dầu mỏ", "khí đốt"], "answer": 0, "explain": "Năng lượng mặt trời là nguồn tái tạo."},
            {"q": "Khi dùng điện, việc nào an toàn?", "choices": ["Lau tay khô trước khi cắm điện", "Chạm tay ướt vào ổ điện", "Kéo dây điện mạnh", "Tự sửa thiết bị đang cắm điện"], "answer": 0, "explain": "Tay khô giúp giảm nguy cơ điện giật."},
            {"q": "Chất lỏng có đặc điểm:", "choices": ["có hình dạng theo vật chứa", "luôn có hình dạng cố định", "không chảy được", "không có khối lượng"], "answer": 0, "explain": "Chất lỏng lấy hình dạng của vật chứa."},
            {"q": "Cây xanh cần gì để quang hợp?", "choices": ["ánh sáng", "bóng tối hoàn toàn", "khói bụi", "muối ăn"], "answer": 0, "explain": "Cây cần ánh sáng để quang hợp."},
            {"q": "Việc nào giúp bảo vệ môi trường?", "choices": ["phân loại rác", "xả rác xuống sông", "đốt rác nhựa bừa bãi", "lãng phí nước"], "answer": 0, "explain": "Phân loại rác giúp tái chế và xử lý tốt hơn."},
            {"q": "Âm thanh truyền qua môi trường nào?", "choices": ["không khí, nước, chất rắn", "chỉ chân không", "chỉ ánh sáng", "chỉ màu sắc"], "answer": 0, "explain": "Âm thanh cần môi trường vật chất để truyền."},
            {"q": "Để phòng bệnh lây qua đường hô hấp, nên:", "choices": ["che miệng khi ho", "dùng chung ly với người bệnh", "không rửa tay", "ở nơi quá đông khi đang bệnh"], "answer": 0, "explain": "Che miệng khi ho giúp giảm phát tán mầm bệnh."},
            {"q": "Vật nào dẫn điện tốt?", "choices": ["đồng", "nhựa", "gỗ khô", "cao su"], "answer": 0, "explain": "Đồng là kim loại dẫn điện tốt."},
            {"q": "Nước có thể chuyển từ lỏng sang hơi khi:", "choices": ["được đun nóng", "được tô màu", "được đặt trong hộp kín lạnh", "được trộn với cát"], "answer": 0, "explain": "Đun nóng làm nước bay hơi."},
            {"q": "Thói quen nào tốt cho sức khỏe?", "choices": ["ngủ đủ giấc", "bỏ bữa sáng thường xuyên", "ít vận động", "uống ít nước"], "answer": 0, "explain": "Ngủ đủ giấc giúp cơ thể phục hồi."},
            {"q": "Nam châm hút được vật nào?", "choices": ["đinh sắt", "cốc nhựa", "giấy", "gỗ"], "answer": 0, "explain": "Nam châm hút các vật bằng sắt, thép."},
        ],
    },
    {
        "id": "grade5_trac_nghiem_lich_su",
        "title": "Trắc nghiệm ôn tập Lịch sử lớp 5",
        "subject": "Trắc nghiệm cuối năm - Lịch sử",
        "keywords": ["mốc thời gian", "nhân vật", "sự kiện", "ý nghĩa", "dòng thời gian"],
        "questions": [
            {"q": "Khi học lịch sử, dòng thời gian giúp ta:", "choices": ["sắp xếp sự kiện theo thứ tự", "tính diện tích", "đọc bản đồ thời tiết", "đo khối lượng"], "answer": 0, "explain": "Dòng thời gian thể hiện thứ tự trước sau của sự kiện."},
            {"q": "Một sự kiện lịch sử thường cần tìm hiểu:", "choices": ["thời gian, địa điểm, nhân vật, ý nghĩa", "màu áo yêu thích", "số trang vở", "độ dài bút chì"], "answer": 0, "explain": "Đó là các thông tin cốt lõi khi tìm hiểu sự kiện."},
            {"q": "Khi đọc tư liệu lịch sử, nên:", "choices": ["kiểm tra nguồn và đối chiếu thông tin", "tin ngay mọi thông tin", "chỉ nhìn hình", "bỏ qua mốc thời gian"], "answer": 0, "explain": "Kiểm tra nguồn giúp học lịch sử chính xác hơn."},
            {"q": "Câu hỏi 'Vì sao sự kiện này quan trọng?' giúp tìm:", "choices": ["ý nghĩa lịch sử", "màu sắc bức tranh", "số chữ trong đoạn", "độ cao ngọn núi"], "answer": 0, "explain": "Câu hỏi đó hướng đến ý nghĩa của sự kiện."},
            {"q": "Nhân vật lịch sử là:", "choices": ["người có vai trò trong sự kiện, giai đoạn lịch sử", "nhân vật trong trò chơi bất kỳ", "tên một đồ vật", "một phép tính"], "answer": 0, "explain": "Nhân vật lịch sử gắn với sự kiện hoặc giai đoạn lịch sử."},
            {"q": "Khi kể lại một sự kiện, trình tự hợp lý là:", "choices": ["bối cảnh - diễn biến - kết quả - ý nghĩa", "kết quả - màu sắc - trò chơi", "ý nghĩa - bỏ diễn biến", "chỉ nêu một chi tiết"], "answer": 0, "explain": "Trình tự này giúp câu chuyện lịch sử rõ ràng."},
            {"q": "Bản đồ lịch sử thường dùng để:", "choices": ["xác định địa điểm, phạm vi sự kiện", "nghe âm thanh", "đo cân nặng", "tô màu tùy ý"], "answer": 0, "explain": "Bản đồ giúp hiểu không gian của sự kiện."},
            {"q": "Mốc thời gian là:", "choices": ["thời điểm xảy ra sự kiện", "tên một con vật", "một kiểu hình học", "một loại thức ăn"], "answer": 0, "explain": "Mốc thời gian cho biết khi nào sự kiện xảy ra."},
            {"q": "Việc so sánh hai sự kiện giúp:", "choices": ["nhận ra điểm giống và khác", "làm mất thông tin", "không cần đọc bài", "thay thế mọi bằng chứng"], "answer": 0, "explain": "So sánh giúp hiểu sâu hơn về sự kiện."},
            {"q": "Kết quả của một sự kiện lịch sử là:", "choices": ["điều xảy ra sau sự kiện", "tên người kể chuyện", "màu nền của trang", "số trang sách"], "answer": 0, "explain": "Kết quả cho biết sự kiện dẫn đến điều gì."},
            {"q": "Khi ôn lịch sử, cách học hiệu quả là:", "choices": ["lập sơ đồ sự kiện và mốc thời gian", "học thuộc rời rạc từng chữ", "bỏ qua câu hỏi vì sao", "không xem lại bài"], "answer": 0, "explain": "Sơ đồ giúp hệ thống kiến thức."},
            {"q": "Ý nghĩa lịch sử thường trả lời câu hỏi:", "choices": ["Sự kiện để lại bài học hoặc tác động gì?", "Bút dài bao nhiêu?", "Bài có mấy màu?", "Hôm nay ăn gì?"], "answer": 0, "explain": "Ý nghĩa nói về tác động và bài học của sự kiện."},
        ],
    },
    {
        "id": "grade5_trac_nghiem_dia_li",
        "title": "Trắc nghiệm ôn tập Địa lí lớp 5",
        "subject": "Trắc nghiệm cuối năm - Địa lí",
        "keywords": ["bản đồ", "khí hậu", "sông ngòi", "địa hình", "kinh tế"],
        "questions": [
            {"q": "Bản đồ giúp chúng ta:", "choices": ["xác định vị trí địa lí", "nghe nhạc", "đo nhiệt độ cơ thể", "viết đoạn văn"], "answer": 0, "explain": "Bản đồ thể hiện vị trí và phân bố không gian."},
            {"q": "Việt Nam có đặc điểm nổi bật là:", "choices": ["có đường bờ biển dài", "không có sông", "chỉ toàn sa mạc", "không có đồng bằng"], "answer": 0, "explain": "Việt Nam có đường bờ biển dài, thuận lợi cho kinh tế biển."},
            {"q": "Đồng bằng thường thuận lợi cho:", "choices": ["trồng lúa", "khai thác băng tuyết", "nuôi tuần lộc", "trồng cây xương rồng trên cát"], "answer": 0, "explain": "Đồng bằng bằng phẳng, đất phù sa thuận lợi trồng lúa."},
            {"q": "Khí hậu nước ta có tính chất:", "choices": ["nhiệt đới gió mùa", "hàn đới quanh năm", "hoang mạc khô nóng toàn bộ", "ôn đới lạnh"], "answer": 0, "explain": "Việt Nam nằm trong vùng nhiệt đới gió mùa."},
            {"q": "Sông ngòi có vai trò:", "choices": ["cung cấp nước, phù sa, giao thông một số nơi", "làm mất hoàn toàn đất đai", "không có ích", "chỉ dùng để trang trí bản đồ"], "answer": 0, "explain": "Sông ngòi có nhiều vai trò trong tự nhiên và đời sống."},
            {"q": "Miền núi thuận lợi cho:", "choices": ["trồng cây công nghiệp, phát triển thủy điện ở nơi phù hợp", "trồng lúa nước mọi nơi", "nuôi cá biển", "làm cảng biển trên núi"], "answer": 0, "explain": "Địa hình miền núi có tiềm năng rừng, cây công nghiệp và thủy điện."},
            {"q": "Khi đọc bản đồ, cần chú ý:", "choices": ["tên bản đồ, kí hiệu, tỉ lệ, phương hướng", "chỉ màu đẹp", "bỏ phần chú giải", "không cần phương hướng"], "answer": 0, "explain": "Các yếu tố đó giúp đọc bản đồ chính xác."},
            {"q": "Biển có thể cung cấp:", "choices": ["hải sản, muối, giao thông biển, du lịch", "than trong mọi con sóng", "lúa nước", "tuyết quanh năm"], "answer": 0, "explain": "Biển có nhiều tài nguyên và điều kiện phát triển kinh tế."},
            {"q": "Dân cư thường tập trung đông ở:", "choices": ["đồng bằng và đô thị", "đỉnh núi rất cao", "vùng hoang mạc không nước", "giữa biển xa bờ"], "answer": 0, "explain": "Đồng bằng và đô thị thuận lợi sinh sống, sản xuất."},
            {"q": "Kí hiệu bản đồ dùng để:", "choices": ["thể hiện đối tượng địa lí", "thay thế toàn bộ bài học", "trang trí không có nghĩa", "đo thời gian"], "answer": 0, "explain": "Kí hiệu giúp biểu diễn sông, núi, thành phố, đường giao thông."},
            {"q": "Lũ lụt có thể giảm thiệt hại nếu:", "choices": ["theo dõi dự báo, chuẩn bị và sơ tán khi cần", "không nghe thông tin", "chơi gần dòng nước xiết", "vứt rác xuống cống"], "answer": 0, "explain": "Chuẩn bị và làm theo hướng dẫn giúp an toàn hơn."},
            {"q": "Hoạt động nào góp phần bảo vệ tài nguyên?", "choices": ["tiết kiệm nước và không xả rác", "chặt phá rừng bừa bãi", "lãng phí điện", "đổ rác xuống sông"], "answer": 0, "explain": "Tiết kiệm và giữ sạch môi trường bảo vệ tài nguyên."},
        ],
    },
    {
        "id": "grade5_trac_nghiem_cong_nghe",
        "title": "Trắc nghiệm ôn tập Công nghệ lớp 5",
        "subject": "Trắc nghiệm cuối năm - Công nghệ",
        "keywords": ["thiết kế", "an toàn", "vật liệu", "dụng cụ", "sản phẩm"],
        "questions": [
            {"q": "Khi làm sản phẩm thủ công, bước đầu tiên nên là:", "choices": ["xác định yêu cầu và lập kế hoạch", "cắt vật liệu ngay", "bỏ qua dụng cụ", "dọn dẹp sau cùng trước khi làm"], "answer": 0, "explain": "Lập kế hoạch giúp chọn vật liệu và thao tác an toàn."},
            {"q": "Dụng cụ sắc nhọn cần được sử dụng:", "choices": ["cẩn thận, đúng cách, có người lớn hướng dẫn khi cần", "đùa nghịch với bạn", "cầm chạy trong lớp", "để dưới sàn"], "answer": 0, "explain": "Dụng cụ sắc nhọn cần dùng an toàn."},
            {"q": "Vật liệu tái chế có lợi vì:", "choices": ["giảm rác thải và tiết kiệm tài nguyên", "luôn đắt hơn", "không cần làm sạch", "không dùng được"], "answer": 0, "explain": "Tái chế giúp bảo vệ môi trường và tiết kiệm."},
            {"q": "Khi sản phẩm chưa chắc chắn, em nên:", "choices": ["kiểm tra, điều chỉnh và thử lại", "bỏ qua lỗi", "giấu đi", "đổ lỗi cho vật liệu"], "answer": 0, "explain": "Thiết kế công nghệ cần thử nghiệm và cải tiến."},
            {"q": "Để dán hai mảnh giấy chắc hơn, cần:", "choices": ["bôi keo vừa đủ và ép nhẹ", "bôi quá nhiều keo", "không chờ keo khô", "dán vào bụi bẩn"], "answer": 0, "explain": "Keo vừa đủ và bề mặt sạch giúp dán chắc."},
            {"q": "Khi dùng thiết bị điện đơn giản, em cần:", "choices": ["đọc hướng dẫn và giữ tay khô", "cắm rút bằng tay ướt", "tháo thiết bị đang hoạt động", "kéo mạnh dây điện"], "answer": 0, "explain": "Đọc hướng dẫn và tay khô giúp an toàn."},
            {"q": "Tiêu chí đánh giá sản phẩm có thể gồm:", "choices": ["đúng yêu cầu, chắc chắn, đẹp, an toàn", "chỉ màu sắc", "chỉ kích thước", "không cần kiểm tra"], "answer": 0, "explain": "Sản phẩm cần đạt nhiều tiêu chí, không chỉ đẹp."},
            {"q": "Khi làm việc nhóm, việc nên làm là:", "choices": ["phân công, lắng nghe, hỗ trợ nhau", "tranh giành dụng cụ", "không trao đổi", "làm hỏng phần của bạn"], "answer": 0, "explain": "Làm việc nhóm cần phối hợp và tôn trọng."},
            {"q": "Bản phác thảo giúp:", "choices": ["hình dung sản phẩm trước khi làm", "thay thế mọi vật liệu", "không cần đo đạc", "làm sản phẩm tự hoàn thành"], "answer": 0, "explain": "Phác thảo giúp lên ý tưởng và kiểm tra bố cục."},
            {"q": "Nếu cần làm mô hình cây cầu giấy, yếu tố quan trọng là:", "choices": ["độ vững và cách gấp, nối", "màu bút duy nhất", "dán càng nhiều keo càng tốt", "không thử tải"], "answer": 0, "explain": "Cầu cần vững, các mối nối và cách gấp rất quan trọng."},
            {"q": "Sau khi hoàn thành sản phẩm, nên:", "choices": ["dọn dụng cụ và ghi nhận điều cần cải tiến", "vứt vật liệu còn dùng được", "để kéo dưới đất", "không kiểm tra sản phẩm"], "answer": 0, "explain": "Dọn dẹp và rút kinh nghiệm là thói quen tốt."},
            {"q": "Chọn vật liệu cho sản phẩm cần dựa vào:", "choices": ["mục đích sử dụng, độ bền, an toàn", "chọn ngẫu nhiên", "chỉ chọn vật nặng nhất", "chỉ chọn vật đắt nhất"], "answer": 0, "explain": "Vật liệu phù hợp giúp sản phẩm dùng tốt và an toàn."},
        ],
    },
]


def wrap_text(text: str, width: int) -> list[str]:
    return textwrap.wrap(text, width=width, break_long_words=False) or [text]


def write_cover_svg(path: Path, quiz: dict) -> None:
    title_lines = wrap_text(quiz["title"], 30)
    keywords = " · ".join(quiz["keywords"][:4])
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <rect width="1600" height="900" fill="#f8fbff"/>
  <circle cx="1420" cy="110" r="260" fill="#e8f7ff"/>
  <circle cx="160" cy="770" r="240" fill="#fff4cf"/>
  <rect x="70" y="58" width="1460" height="784" rx="46" fill="#ffffff" stroke="#dfe8ee" stroke-width="6"/>
  <rect x="110" y="100" width="1380" height="110" rx="32" fill="#2fb8ff"/>
  <text x="150" y="168" fill="#fff" font-size="38" font-family="Be Vietnam Pro, Nunito, Arial, sans-serif" font-weight="900">Trắc nghiệm ôn tập cuối năm · Lớp 5</text>
  <rect x="150" y="270" width="820" height="250" rx="34" fill="#e8f7ff"/>
  {''.join(f'<text x="190" y="{350 + i * 68}" fill="#064d66" font-size="56" font-family="Be Vietnam Pro, Nunito, Arial, sans-serif" font-weight="900">{html.escape(line)}</text>' for i, line in enumerate(title_lines))}
  <rect x="150" y="580" width="1040" height="96" rx="28" fill="#fff4cf" stroke="#f4c34f" stroke-width="4"/>
  <text x="190" y="640" fill="#5a4300" font-size="30" font-family="Be Vietnam Pro, Nunito, Arial, sans-serif" font-weight="800">{html.escape(keywords)}</text>
  <g transform="translate(1120 285)">
    <rect x="0" y="0" width="270" height="330" rx="36" fill="#fff" stroke="#2fb8ff" stroke-width="8"/>
    <circle cx="74" cy="82" r="28" fill="#82c97f"/>
    <circle cx="74" cy="166" r="28" fill="#fdd34d"/>
    <circle cx="74" cy="250" r="28" fill="#ff8aa5"/>
    <path d="M132 78h82M132 162h82M132 246h82" stroke="#17202a" stroke-width="18" stroke-linecap="round"/>
  </g>
</svg>'''
    path.write_text(svg, encoding="utf-8")


def write_quiz_html(path: Path, quiz: dict) -> None:
    data = json.dumps(quiz["questions"], ensure_ascii=False)
    title = html.escape(quiz["title"])
    subject = html.escape(quiz["subject"])
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
    body {{ margin: 0; min-height: 100vh; background: #f5fbff; color: #17202a; font-family: "Nunito", "Be Vietnam Pro", Arial, sans-serif; }}
    main {{ width: min(1120px, calc(100% - 28px)); margin: 0 auto; padding: 28px 0; }}
    header {{ display: flex; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 18px; }}
    h1 {{ margin: 0; font-family: "Be Vietnam Pro", sans-serif; font-size: clamp(28px, 4vw, 46px); line-height: 1.08; }}
    .pill {{ display: inline-flex; align-items: center; min-height: 34px; padding: 6px 12px; border-radius: 999px; background: #e8f7ff; color: #006688; font-weight: 900; white-space: nowrap; }}
    .quiz {{ display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 18px; align-items: start; }}
    .panel, .side {{ background: #fff; border: 3px solid #dfe8ee; border-radius: 18px; box-shadow: 0 8px 0 #dfe8ee; }}
    .panel {{ padding: 24px; }}
    .side {{ padding: 18px; display: grid; gap: 12px; }}
    .progress {{ height: 12px; border-radius: 999px; background: #edf3f7; overflow: hidden; margin: 14px 0 20px; }}
    .bar {{ height: 100%; width: 0; background: #2fb8ff; transition: width .2s ease; }}
    .question {{ font-family: "Be Vietnam Pro", sans-serif; font-size: clamp(24px, 3vw, 34px); font-weight: 900; line-height: 1.22; margin: 0 0 18px; }}
    .choices {{ display: grid; gap: 12px; }}
    button {{ border: 0; min-height: 48px; border-radius: 14px; padding: 12px 14px; font: inherit; font-weight: 900; cursor: pointer; }}
    .choice {{ text-align: left; background: #f4f8fb; color: #17202a; border: 2px solid #dce8ef; }}
    .choice.correct {{ background: #e9fbef; border-color: #55bd70; color: #14552a; }}
    .choice.wrong {{ background: #fff0f3; border-color: #ff8aa5; color: #7a1730; }}
    .actions {{ display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }}
    .primary {{ background: #2fb8ff; color: #06364c; }}
    .secondary {{ background: #fdd34d; color: #5a4300; }}
    .feedback {{ min-height: 58px; margin-top: 16px; padding: 12px 14px; border-radius: 14px; background: #f8fbff; border: 2px solid #dfe8ee; font-weight: 800; line-height: 1.45; }}
    .score {{ font-family: "Be Vietnam Pro", sans-serif; font-size: 34px; font-weight: 900; color: #006688; }}
    .mini {{ color: #52616b; font-weight: 800; line-height: 1.45; }}
    .result {{ display: none; padding: 22px; border-radius: 18px; background: #fff8d7; border: 3px solid #f4c34f; margin-top: 18px; }}
    @media (max-width: 860px) {{ header, .quiz {{ grid-template-columns: 1fr; display: grid; }} header {{ align-items: start; }} }}
  </style>
</head>
<body>
  <main>
    <header>
      <div><span class="pill">{subject}</span><h1>{title}</h1></div>
      <a class="pill" href="../index.html">Thư viện</a>
    </header>
    <section class="quiz">
      <article class="panel">
        <div id="counter">Câu 1 / 12</div>
        <div class="progress"><div class="bar" id="bar"></div></div>
        <p class="question" id="question"></p>
        <div class="choices" id="choices"></div>
        <div class="feedback" id="feedback">Chọn một đáp án để xem giải thích.</div>
        <div class="actions"><button class="primary" id="next">Câu tiếp</button><button class="secondary" id="restart">Làm lại</button></div>
        <div class="result" id="result"></div>
      </article>
      <aside class="side">
        <div class="score" id="score">0 xu</div>
        <div class="mini">Mỗi câu đúng nhận 8 xu. Hoàn thành bài nhận thêm 20 xu. Từ 9 câu đúng trở lên nhận sticker ôn tập.</div>
        <div class="mini" id="best"></div>
      </aside>
    </section>
  </main>
  <script>
    const questions = {data};
    const storageKey = "{quiz['id']}-best";
    let index = 0, score = 0, answered = false;
    const counter = document.querySelector("#counter"), bar = document.querySelector("#bar"), questionEl = document.querySelector("#question"), choicesEl = document.querySelector("#choices"), feedback = document.querySelector("#feedback"), scoreEl = document.querySelector("#score"), result = document.querySelector("#result"), bestEl = document.querySelector("#best");
    function updateBest() {{ const best = Number(localStorage.getItem(storageKey) || 0); bestEl.textContent = best ? `Kỷ lục: ${{best}}/${{questions.length}} câu đúng.` : "Chưa có kỷ lục cho bài này."; }}
    function render() {{
      answered = false; result.style.display = "none"; const item = questions[index];
      counter.textContent = `Câu ${{index + 1}} / ${{questions.length}}`; bar.style.width = `${{(index / questions.length) * 100}}%`; questionEl.textContent = item.q; feedback.textContent = "Chọn một đáp án để xem giải thích."; choicesEl.innerHTML = "";
      item.choices.forEach((choice, choiceIndex) => {{ const button = document.createElement("button"); button.className = "choice"; button.textContent = `${{String.fromCharCode(65 + choiceIndex)}}. ${{choice}}`; button.onclick = () => answer(choiceIndex, button); choicesEl.appendChild(button); }});
      scoreEl.textContent = `${{score * 8}} xu`;
    }}
    function answer(choiceIndex) {{
      if (answered) return; answered = true; const item = questions[index]; const buttons = [...choicesEl.children];
      buttons.forEach((button, i) => {{ if (i === item.answer) button.classList.add("correct"); if (i === choiceIndex && i !== item.answer) button.classList.add("wrong"); }});
      if (choiceIndex === item.answer) {{ score += 1; feedback.textContent = `Đúng. ${{item.explain}}`; }} else {{ feedback.textContent = `Chưa đúng. Đáp án đúng là ${{String.fromCharCode(65 + item.answer)}}. ${{item.explain}}`; }}
      scoreEl.textContent = `${{score * 8}} xu`;
    }}
    function finish() {{
      bar.style.width = "100%"; const bonus = 20; const coins = score * 8 + bonus; const sticker = score >= 9 ? " Có sticker ôn tập." : " Luyện thêm để nhận sticker.";
      const best = Math.max(Number(localStorage.getItem(storageKey) || 0), score); localStorage.setItem(storageKey, String(best)); updateBest();
      result.style.display = "block"; result.innerHTML = `<strong>Hoàn thành: ${{score}}/${{questions.length}} câu đúng.</strong><br>Nhận ${{coins}} xu.${{sticker}}`;
    }}
    document.querySelector("#next").onclick = () => {{ if (!answered) {{ feedback.textContent = "Hãy chọn đáp án trước khi sang câu tiếp."; return; }} if (index < questions.length - 1) {{ index += 1; render(); }} else finish(); }};
    document.querySelector("#restart").onclick = () => {{ index = 0; score = 0; render(); }};
    updateBest(); render();
  </script>
</body>
</html>'''
    path.write_text(html_doc, encoding="utf-8")


def write_quiz(quiz: dict, catalog: list[dict]) -> None:
    out_dir = LESSONS_DIR / quiz["id"]
    images_dir = out_dir / "images"
    images_dir.mkdir(parents=True, exist_ok=True)
    write_cover_svg(images_dir / "slide-01.svg", quiz)
    write_quiz_html(out_dir / "index.html", quiz)
    manifest = {
        "id": quiz["id"],
        "title": quiz["title"],
        "grade": 5,
        "subject": quiz["subject"],
        "type": "multiple_choice_quiz",
        "keywords": quiz["keywords"],
        "question_count": len(quiz["questions"]),
        "questions": quiz["questions"],
        "slides": [
            {
                "slide_number": 1,
                "page_type": "quiz_cover",
                "title": quiz["title"],
                "content": f"{quiz['subject']}. {len(quiz['questions'])} câu trắc nghiệm.",
                "activity": "Làm bài, xem giải thích và ghi lại phần cần ôn thêm.",
                "audio_script": f"{quiz['title']}. Bài có {len(quiz['questions'])} câu trắc nghiệm. Hãy đọc kỹ câu hỏi rồi chọn đáp án đúng nhất.",
                "image": "images/slide-01.svg",
                "audio": "audio/slide-01.mp3",
            }
        ],
        "created_at": datetime.now().isoformat(timespec="seconds"),
        "source_note": "Bộ câu hỏi tự soạn để ôn tập cuối năm lớp 5, không sao chép nguyên văn sách giáo khoa.",
    }
    prompts = {
        "metadata": {"title": quiz["title"], "grade": 5, "subject": quiz["subject"], "total_slides": 1, "style": "quiz-cover-illustration-no-text", "generated_at": datetime.now().isoformat(timespec="seconds")},
        "slides": [
            {
                "slide_number": 1,
                "page_type": "quiz_cover",
                "content": f"{quiz['title']} - {quiz['subject']}",
                "prompt": (
                    "Use case: scientific-educational\n"
                    "Asset type: 16:9 quiz cover illustration for Vietnamese grade 5 students\n"
                    f"Primary request: Create a warm classroom illustration for a final-year multiple-choice review quiz: {quiz['title']}.\n"
                    f"Subject context: {quiz['subject']}. Keywords: {', '.join(quiz['keywords'])}.\n"
                    "Important: no letters, words, numbers, captions, labels, UI text, handwriting, watermark, or logo in the image. Text is rendered separately by HTML/SVG."
                ),
                "image_path": str((out_dir / "images" / "slide-01.svg").resolve()),
            }
        ],
    }
    (out_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    (out_dir / "prompts.json").write_text(json.dumps(prompts, ensure_ascii=False, indent=2), encoding="utf-8")
    catalog.append({"id": quiz["id"], "title": quiz["title"], "grade": 5, "subject": quiz["subject"], "type": "multiple_choice_quiz", "slide_count": 1, "question_count": len(quiz["questions"]), "path": f"{quiz['id']}/index.html", "manifest": f"{quiz['id']}/manifest.json", "keywords": quiz["keywords"]})


def rewrite_catalog(new_items: list[dict]) -> None:
    catalog_path = LESSONS_DIR / "catalog.json"
    items = json.loads(catalog_path.read_text(encoding="utf-8")) if catalog_path.exists() else []
    merged = {item["id"]: item for item in items}
    for item in new_items:
        merged[item["id"]] = item
    items = sorted(merged.values(), key=lambda item: (int(item.get("grade", 1)), item.get("subject", ""), item.get("title", "")))
    catalog_path.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
    cards = "\n".join(
        f'''<a class="card" href="{html.escape(item['path'])}" data-grade="{int(item.get('grade', 1))}">
  <span>{html.escape(item['subject'])} · Lớp {int(item.get('grade', 1))}</span>
  <strong>{html.escape(item['title'])}</strong>
  <small>{int(item.get('question_count', item.get('slide_count', 0)))} {'câu trắc nghiệm' if item.get('type') == 'multiple_choice_quiz' else 'slide'} · {html.escape(", ".join(item.get('keywords', [])[:3]))}</small>
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
<body><main><h1>Thư viện học liệu</h1><p class="lead">Bộ học liệu tự soạn cho dự án Học mà chơi: lớp 1, ôn tập cuối năm lớp 5 và các bài trắc nghiệm tương tác. Chữ tiếng Việt được render bằng HTML/SVG để tránh lỗi font trong ảnh AI.</p>
<div class="toolbar"><span class="pill">{len(items)} bài học</span><span class="pill">{sum(int(item.get('slide_count', 0)) for item in items)} slide/cover</span><span class="pill">{sum(int(item.get('question_count', 0)) for item in items)} câu trắc nghiệm</span><span class="pill">Ảnh minh họa không chữ</span></div><section class="grid">{cards}</section></main></body></html>'''
    (LESSONS_DIR / "index.html").write_text(index, encoding="utf-8")


def main() -> None:
    LESSONS_DIR.mkdir(exist_ok=True)
    catalog: list[dict] = []
    for quiz in QUIZZES:
        write_quiz(quiz, catalog)
    rewrite_catalog(catalog)
    print(f"Generated {len(catalog)} grade 5 quiz lessons with {sum(len(q['questions']) for q in QUIZZES)} questions.")


if __name__ == "__main__":
    main()
