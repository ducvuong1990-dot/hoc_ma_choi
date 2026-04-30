from __future__ import annotations

from generate_grade5_quizzes import rewrite_catalog, write_quiz


SUBJECTS = {
    "toan": ("Toán", ["phân số", "số thập phân", "tỉ số phần trăm", "hình học"]),
    "tieng_viet": ("Tiếng Việt", ["đọc hiểu", "từ loại", "câu ghép", "dấu câu"]),
    "tieng_anh": ("Tiếng Anh", ["vocabulary", "grammar", "reading", "communication"]),
    "khoa_hoc": ("Khoa học", ["cơ thể", "năng lượng", "vật chất", "môi trường"]),
    "lich_su": ("Lịch sử", ["mốc thời gian", "nhân vật", "sự kiện", "ý nghĩa"]),
    "dia_li": ("Địa lí", ["bản đồ", "khí hậu", "sông ngòi", "kinh tế"]),
    "cong_nghe": ("Công nghệ", ["thiết kế", "an toàn", "vật liệu", "quy trình"]),
}


BASIC_QUESTIONS = {
    "toan": [
        {"q": "Phân số 4/10 viết dưới dạng số thập phân là:", "choices": ["0,04", "0,4", "4,0", "40,0"], "answer": 1, "explain": "4/10 bằng 0,4."},
        {"q": "15% của 300 là:", "choices": ["30", "45", "60", "150"], "answer": 1, "explain": "10% của 300 là 30, 5% là 15, tổng là 45."},
        {"q": "Một hình tam giác có đáy 8 cm, chiều cao 5 cm. Diện tích là:", "choices": ["13 cm2", "20 cm2", "40 cm2", "80 cm2"], "answer": 1, "explain": "Diện tích tam giác bằng đáy nhân chiều cao rồi chia 2: 8 x 5 : 2 = 20."},
        {"q": "Kết quả của 7,2 - 3,45 là:", "choices": ["3,75", "4,25", "4,75", "10,65"], "answer": 0, "explain": "Viết 7,20 - 3,45 = 3,75."},
        {"q": "Số lớn nhất trong các số sau là:", "choices": ["6,09", "6,9", "6,099", "6,19"], "answer": 1, "explain": "6,9 bằng 6,900 nên lớn nhất."},
        {"q": "Chu vi hình tròn bán kính 3 cm xấp xỉ là:", "choices": ["9,42 cm", "18,84 cm", "28,26 cm", "36 cm"], "answer": 1, "explain": "Chu vi hình tròn bằng 2 x 3,14 x r = 18,84 cm."},
        {"q": "2 giờ 15 phút bằng bao nhiêu phút?", "choices": ["125 phút", "135 phút", "145 phút", "215 phút"], "answer": 1, "explain": "2 giờ bằng 120 phút, thêm 15 phút là 135 phút."},
        {"q": "Một xe đi 90 km trong 2 giờ. Vận tốc trung bình là:", "choices": ["30 km/giờ", "45 km/giờ", "60 km/giờ", "180 km/giờ"], "answer": 1, "explain": "Vận tốc bằng quãng đường chia thời gian: 90 : 2 = 45."},
    ],
    "tieng_viet": [
        {"q": "Từ nào là danh từ?", "choices": ["bầu trời", "xanh", "chạy", "rất"], "answer": 0, "explain": "Bầu trời là từ chỉ sự vật."},
        {"q": "Từ nào là động từ?", "choices": ["dịu dàng", "đọc", "cao", "một"], "answer": 1, "explain": "Đọc là từ chỉ hoạt động."},
        {"q": "Cặp từ nào trái nghĩa?", "choices": ["sáng - tối", "nhanh - mau", "to - lớn", "hiền - lành"], "answer": 0, "explain": "Sáng và tối có nghĩa trái ngược nhau."},
        {"q": "Trong câu 'Mẹ em đang nấu bữa tối', vị ngữ là:", "choices": ["Mẹ em", "đang nấu bữa tối", "bữa tối", "đang"], "answer": 1, "explain": "Vị ngữ nêu hoạt động của chủ ngữ."},
        {"q": "Dấu phẩy trong câu thường dùng để:", "choices": ["ngăn cách bộ phận câu", "kết thúc câu hỏi", "thay mọi dấu câu", "viết tên riêng"], "answer": 0, "explain": "Dấu phẩy giúp tách các bộ phận trong câu."},
        {"q": "Câu nào là câu hỏi?", "choices": ["Bạn đã làm bài chưa?", "Em đi học.", "Trời đẹp quá!", "Lan đọc sách."], "answer": 0, "explain": "Câu có dấu hỏi và dùng để hỏi."},
        {"q": "Từ 'chúng em' là:", "choices": ["đại từ xưng hô", "tính từ", "quan hệ từ", "từ láy"], "answer": 0, "explain": "Chúng em dùng để xưng hô."},
        {"q": "Mở bài trong bài văn tả người thường:", "choices": ["giới thiệu người được tả", "nêu kết quả phép tính", "kể chuyện khác", "liệt kê dấu câu"], "answer": 0, "explain": "Mở bài giới thiệu đối tượng sẽ tả."},
    ],
    "tieng_anh": [
        {"q": "Choose the correct word: I have ____ orange.", "choices": ["a", "an", "the", "many"], "answer": 1, "explain": "Use 'an' before a vowel sound."},
        {"q": "What does 'usually' mean?", "choices": ["thường thường", "không bao giờ", "ngày mai", "ở đâu"], "answer": 0, "explain": "'Usually' means 'thường thường'."},
        {"q": "Complete: They ____ football after school.", "choices": ["plays", "play", "playing", "is play"], "answer": 1, "explain": "Use 'play' with 'they' in the present simple."},
        {"q": "Which word is an animal?", "choices": ["tiger", "pencil", "market", "cloudy"], "answer": 0, "explain": "A tiger is an animal."},
        {"q": "Choose the correct answer: How old are you?", "choices": ["I am eleven.", "I am fine.", "I am from Ha Noi.", "I like rice."], "answer": 0, "explain": "The question asks about age."},
        {"q": "The past form of 'see' is:", "choices": ["seed", "saw", "seen", "sees"], "answer": 1, "explain": "The simple past form is 'saw'."},
        {"q": "Complete: There is a book ____ the desk.", "choices": ["on", "many", "go", "blue"], "answer": 0, "explain": "'On the desk' means on top of the desk."},
        {"q": "Which sentence is correct?", "choices": ["He can swim.", "He can swims.", "He cans swim.", "He can swimming."], "answer": 0, "explain": "After 'can', use the base verb."},
    ],
    "khoa_hoc": [
        {"q": "Thức ăn cung cấp cho cơ thể:", "choices": ["năng lượng và chất dinh dưỡng", "chỉ màu sắc", "âm thanh", "khói bụi"], "answer": 0, "explain": "Cơ thể cần năng lượng và chất dinh dưỡng để hoạt động."},
        {"q": "Nguồn năng lượng nào sạch và tái tạo?", "choices": ["mặt trời", "than đá", "dầu mỏ", "rác thải"], "answer": 0, "explain": "Năng lượng mặt trời là nguồn tái tạo."},
        {"q": "Vật nào cách điện tốt?", "choices": ["cao su", "đồng", "sắt", "nhôm"], "answer": 0, "explain": "Cao su thường được dùng để bọc dây điện."},
        {"q": "Nước đá chuyển thành nước lỏng khi:", "choices": ["tan chảy", "đông đặc", "bay hơi", "ngưng tụ"], "answer": 0, "explain": "Khi nóng lên, nước đá tan chảy thành nước lỏng."},
        {"q": "Cây xanh giúp môi trường vì:", "choices": ["tạo ô-xi và làm mát", "tạo khói", "làm bẩn nước", "gây ồn"], "answer": 0, "explain": "Cây xanh quang hợp, tạo ô-xi và làm mát không khí."},
        {"q": "Việc nào giúp phòng bệnh?", "choices": ["rửa tay bằng xà phòng", "ăn đồ ôi", "uống nước chưa đun", "không ngủ"], "answer": 0, "explain": "Rửa tay giúp giảm mầm bệnh."},
        {"q": "Âm thanh phát ra khi vật:", "choices": ["rung động", "đứng yên tuyệt đối", "mất màu", "tan biến"], "answer": 0, "explain": "Nguồn âm thường là vật đang rung động."},
        {"q": "Không khí cần cho:", "choices": ["sự sống và sự cháy", "viết chữ", "đo độ dài", "tô màu"], "answer": 0, "explain": "Không khí có ô-xi cần cho sự sống và sự cháy."},
    ],
    "lich_su": [
        {"q": "Dòng thời gian dùng để:", "choices": ["sắp xếp sự kiện theo thứ tự", "đo chiều cao", "tính tiền", "vẽ hình tròn"], "answer": 0, "explain": "Dòng thời gian thể hiện trước sau của sự kiện."},
        {"q": "Khi tìm hiểu một nhân vật lịch sử, cần chú ý:", "choices": ["vai trò và đóng góp", "màu áo yêu thích", "món ăn hôm qua", "số bút chì"], "answer": 0, "explain": "Vai trò và đóng góp giúp hiểu ý nghĩa của nhân vật."},
        {"q": "Tư liệu lịch sử cần được:", "choices": ["kiểm tra nguồn", "tin ngay", "bỏ qua", "đổi tùy ý"], "answer": 0, "explain": "Kiểm tra nguồn giúp tránh thông tin sai."},
        {"q": "Kết quả của sự kiện là:", "choices": ["điều xảy ra sau sự kiện", "tên màu nền", "độ dài bút", "số ô ly"], "answer": 0, "explain": "Kết quả nêu tác động trực tiếp sau sự kiện."},
        {"q": "Câu hỏi 'Vì sao?' giúp tìm:", "choices": ["nguyên nhân", "màu sắc", "chiều dài", "số trang"], "answer": 0, "explain": "Câu hỏi vì sao hướng tới nguyên nhân."},
        {"q": "Bản đồ trong lịch sử giúp hiểu:", "choices": ["không gian sự kiện", "giọng đọc", "cân nặng", "mùi vị"], "answer": 0, "explain": "Bản đồ cho biết sự kiện diễn ra ở đâu."},
        {"q": "Khi kể sự kiện, nên kể theo:", "choices": ["trình tự rõ ràng", "ý nhớ đâu kể đó", "chỉ kết thúc", "không cần bối cảnh"], "answer": 0, "explain": "Trình tự rõ ràng giúp người nghe hiểu."},
        {"q": "Ý nghĩa lịch sử là:", "choices": ["tác động và bài học của sự kiện", "số chữ trong bài", "màu bìa sách", "tên đồ dùng"], "answer": 0, "explain": "Ý nghĩa nói về tác động, giá trị và bài học."},
    ],
    "dia_li": [
        {"q": "Bản đồ dùng để:", "choices": ["xác định vị trí", "nghe nhạc", "nấu cơm", "đo cân nặng"], "answer": 0, "explain": "Bản đồ giúp xác định vị trí và phương hướng."},
        {"q": "Đồng bằng thường thuận lợi cho:", "choices": ["trồng lúa", "khai thác băng tuyết", "leo núi cao", "nuôi cá đại dương xa bờ"], "answer": 0, "explain": "Đồng bằng bằng phẳng và đất phù sa thuận lợi cho trồng lúa."},
        {"q": "Khí hậu gồm các yếu tố như:", "choices": ["nhiệt độ, mưa, gió", "màu bút, cặp sách", "chiều cao bàn", "số trang vở"], "answer": 0, "explain": "Khí hậu thể hiện qua nhiệt độ, lượng mưa, gió và độ ẩm."},
        {"q": "Sông ngòi có vai trò:", "choices": ["cung cấp nước và phù sa", "làm mất đất", "tạo tiếng chuông", "thay sách vở"], "answer": 0, "explain": "Sông cung cấp nước, phù sa và giao thông ở một số nơi."},
        {"q": "Vùng ven biển thuận lợi phát triển:", "choices": ["đánh bắt và du lịch biển", "trồng cây xứ lạnh", "khai thác tuyết", "nuôi bò trên đỉnh núi"], "answer": 0, "explain": "Biển tạo điều kiện cho thủy sản, giao thông và du lịch."},
        {"q": "Khi đọc bản đồ, cần xem:", "choices": ["chú giải", "màu áo người đọc", "bìa vở", "giờ ra chơi"], "answer": 0, "explain": "Chú giải giải thích kí hiệu trên bản đồ."},
        {"q": "Miền núi thường có địa hình:", "choices": ["cao, dốc", "rất bằng phẳng", "toàn biển", "toàn sa mạc"], "answer": 0, "explain": "Miền núi có nhiều núi, đồi và sườn dốc."},
        {"q": "Hoạt động kinh tế là:", "choices": ["sản xuất, trao đổi, dịch vụ", "ngủ trưa", "tô màu tùy ý", "đếm mây"], "answer": 0, "explain": "Kinh tế gồm sản xuất, trao đổi hàng hóa và dịch vụ."},
    ],
    "cong_nghe": [
        {"q": "Khi sử dụng kéo, cần:", "choices": ["cầm đúng cách và không đùa nghịch", "chạy quanh lớp", "ném cho bạn", "để sát mắt"], "answer": 0, "explain": "Dụng cụ sắc nhọn cần dùng cẩn thận."},
        {"q": "Quy trình làm sản phẩm thường bắt đầu bằng:", "choices": ["xác định yêu cầu", "vứt vật liệu", "bỏ qua kiểm tra", "trang trí ngay"], "answer": 0, "explain": "Cần biết sản phẩm dùng để làm gì trước khi thiết kế."},
        {"q": "Vật liệu giấy có đặc điểm:", "choices": ["nhẹ, dễ gấp cắt", "dẫn điện rất tốt", "rất nặng", "không thể vẽ lên"], "answer": 0, "explain": "Giấy nhẹ, dễ tạo hình và dễ trang trí."},
        {"q": "Khi sản phẩm chưa chắc, ta nên:", "choices": ["kiểm tra và cải tiến", "bỏ luôn", "đổ nước vào", "giấu đi"], "answer": 0, "explain": "Cải tiến giúp sản phẩm tốt hơn."},
        {"q": "An toàn điện là:", "choices": ["không chạm ổ điện khi tay ướt", "tự sửa ổ điện", "cắm quá nhiều thiết bị", "kéo dây điện mạnh"], "answer": 0, "explain": "Tay ướt làm tăng nguy cơ điện giật."},
        {"q": "Bản phác thảo giúp:", "choices": ["hình dung sản phẩm trước khi làm", "thay cho mọi vật liệu", "làm mất ý tưởng", "không cần đo"], "answer": 0, "explain": "Phác thảo giúp lên kế hoạch hình dáng và chi tiết."},
        {"q": "Dụng cụ sau khi dùng nên:", "choices": ["cất đúng nơi", "để dưới sàn", "ném vào góc", "giấu trong cặp bạn"], "answer": 0, "explain": "Cất đúng nơi giúp an toàn và dễ tìm."},
        {"q": "Làm việc nhóm tốt là:", "choices": ["phân công và lắng nghe nhau", "tranh nói một mình", "không chia sẻ dụng cụ", "bỏ phần việc"], "answer": 0, "explain": "Phân công và lắng nghe giúp nhóm hoàn thành sản phẩm."},
    ],
}


ADVANCED_QUESTIONS = {
    "toan": [
        {"q": "Một lớp có 40 học sinh, 60% là nữ. Số học sinh nam là:", "choices": ["16", "20", "24", "30"], "answer": 0, "explain": "Nữ có 24 bạn, nam có 40 - 24 = 16 bạn."},
        {"q": "Tìm x: x : 2,5 = 4.", "choices": ["1,6", "6,5", "10", "12,5"], "answer": 2, "explain": "x = 4 x 2,5 = 10."},
        {"q": "Một bể dạng hộp dài 2 m, rộng 1,5 m, cao 1 m. Thể tích là:", "choices": ["3 m3", "4,5 m3", "5 m3", "6 m3"], "answer": 0, "explain": "Thể tích = 2 x 1,5 x 1 = 3 m3."},
        {"q": "Trung bình cộng của 12, 18, 21 là:", "choices": ["15", "17", "18", "51"], "answer": 1, "explain": "Tổng là 51, chia 3 được 17."},
        {"q": "Một người đi 12 km trong 30 phút. Vận tốc là:", "choices": ["12 km/giờ", "18 km/giờ", "24 km/giờ", "30 km/giờ"], "answer": 2, "explain": "30 phút là 0,5 giờ; 12 : 0,5 = 24."},
        {"q": "Phân số 7/8 lớn hơn phân số nào?", "choices": ["9/10", "3/4", "15/16", "1"], "answer": 1, "explain": "7/8 = 0,875, còn 3/4 = 0,75."},
        {"q": "Một món hàng tăng từ 200 000 đồng lên 220 000 đồng. Tăng bao nhiêu phần trăm?", "choices": ["5%", "10%", "20%", "22%"], "answer": 1, "explain": "Tăng 20 000 trên 200 000 là 10%."},
        {"q": "Diện tích hình thang có hai đáy 6 cm và 10 cm, chiều cao 5 cm là:", "choices": ["30 cm2", "40 cm2", "50 cm2", "80 cm2"], "answer": 1, "explain": "Diện tích = (6 + 10) x 5 : 2 = 40."},
    ],
    "tieng_viet": [
        {"q": "Câu nào dùng cặp quan hệ từ chỉ tương phản?", "choices": ["Tuy trời mưa nhưng em vẫn đến lớp.", "Vì trời mưa nên đường ướt.", "Nếu chăm học thì em tiến bộ.", "Không những Lan học giỏi mà Lan còn hát hay."], "answer": 0, "explain": "Tuy... nhưng biểu thị sự tương phản."},
        {"q": "Trong câu ghép, các vế câu thường có:", "choices": ["chủ ngữ và vị ngữ riêng", "chỉ một từ", "không cần nghĩa", "chỉ dấu phẩy"], "answer": 0, "explain": "Mỗi vế câu thường có cấu tạo như một câu đơn."},
        {"q": "Cách liên kết câu bằng thay thế từ ngữ là:", "choices": ["dùng từ khác để tránh lặp", "bỏ hết chủ ngữ", "viết không dấu", "đổi trật tự tùy ý"], "answer": 0, "explain": "Thay thế giúp đoạn văn mạch lạc và tránh lặp."},
        {"q": "Từ 'lấp lánh' là:", "choices": ["từ láy", "quan hệ từ", "đại từ", "số từ"], "answer": 0, "explain": "Lấp lánh là từ láy gợi hình ảnh ánh sáng."},
        {"q": "Dấu ngoặc kép có thể dùng để:", "choices": ["đánh dấu lời nói trực tiếp", "kết thúc câu hỏi", "ngăn cách ngày tháng", "thay dấu phẩy"], "answer": 0, "explain": "Dấu ngoặc kép thường đánh dấu lời nói hoặc từ được dẫn."},
        {"q": "Ý chính của đoạn văn là:", "choices": ["điều quan trọng nhất đoạn muốn nói", "câu dài nhất", "từ khó nhất", "tên tác giả"], "answer": 0, "explain": "Ý chính khái quát nội dung trọng tâm."},
        {"q": "Trong văn miêu tả, chi tiết tiêu biểu là chi tiết:", "choices": ["giúp nổi bật đối tượng", "không liên quan", "lặp lại nhiều lần", "chỉ để đủ dòng"], "answer": 0, "explain": "Chi tiết tiêu biểu làm đối tượng hiện rõ hơn."},
        {"q": "Câu 'Gió thổi, mây bay' có mấy vế câu?", "choices": ["1", "2", "3", "4"], "answer": 1, "explain": "Có hai vế: gió thổi và mây bay."},
    ],
    "tieng_anh": [
        {"q": "Choose the best answer: If it rains, I ____ at home.", "choices": ["stay", "stays", "stayed", "staying"], "answer": 0, "explain": "Use the base verb with 'I' in the present simple."},
        {"q": "Which sentence is in the past simple?", "choices": ["I visited my grandparents yesterday.", "I visit my grandparents every week.", "I am visiting now.", "I will visit tomorrow."], "answer": 0, "explain": "'Visited' and 'yesterday' show the past simple."},
        {"q": "Complete: My bag is heavier ____ your bag.", "choices": ["than", "then", "that", "this"], "answer": 0, "explain": "Use 'than' for comparison."},
        {"q": "What is the question for: 'I go to school by bike'?", "choices": ["How do you go to school?", "Where are you from?", "What time is it?", "How old are you?"], "answer": 0, "explain": "The answer gives the means of transport."},
        {"q": "Choose the odd one out.", "choices": ["doctor", "teacher", "hospital", "farmer"], "answer": 2, "explain": "Hospital is a place; the others are jobs."},
        {"q": "Complete: There aren't ____ apples left.", "choices": ["some", "any", "a", "an"], "answer": 1, "explain": "Use 'any' in negative plural sentences."},
        {"q": "Which word means 'thư giãn'?", "choices": ["relax", "repair", "repeat", "remember"], "answer": 0, "explain": "'Relax' means 'thư giãn'."},
        {"q": "Choose the correct sentence.", "choices": ["What did you do yesterday?", "What do you did yesterday?", "What did you yesterday do?", "What you did yesterday?"], "answer": 0, "explain": "Use 'did' plus base verb in past questions."},
    ],
    "khoa_hoc": [
        {"q": "Vì sao không nên nhìn trực tiếp vào Mặt Trời?", "choices": ["có thể hại mắt", "vì làm trời tối", "vì gây mưa", "vì mất âm thanh"], "answer": 0, "explain": "Ánh sáng mạnh có thể làm tổn thương mắt."},
        {"q": "Hiện tượng nước bốc hơi rồi gặp lạnh thành giọt là:", "choices": ["ngưng tụ", "tan chảy", "đông đặc", "cháy"], "answer": 0, "explain": "Hơi nước gặp lạnh chuyển thành giọt nước là ngưng tụ."},
        {"q": "Chuỗi thức ăn thể hiện:", "choices": ["mối quan hệ ăn và bị ăn", "số trang sách", "màu đồ vật", "đường đi học"], "answer": 0, "explain": "Chuỗi thức ăn cho thấy năng lượng truyền qua sinh vật."},
        {"q": "Lạm dụng túi ni-lông gây hại vì:", "choices": ["khó phân hủy", "làm cây lớn nhanh", "tạo nhiều ô-xi", "làm nước sạch hơn"], "answer": 0, "explain": "Túi ni-lông khó phân hủy và gây ô nhiễm."},
        {"q": "Máu trong cơ thể có vai trò:", "choices": ["vận chuyển chất", "tạo ánh sáng", "làm cứng xương ngay lập tức", "thay không khí"], "answer": 0, "explain": "Máu vận chuyển khí và chất dinh dưỡng."},
        {"q": "Năng lượng điện có thể chuyển thành:", "choices": ["ánh sáng, nhiệt, chuyển động", "chỉ mùi vị", "chỉ màu xanh", "không dạng nào"], "answer": 0, "explain": "Đèn, quạt, nồi cơm điện là ví dụ chuyển hóa điện năng."},
        {"q": "Muốn thí nghiệm công bằng, cần:", "choices": ["chỉ thay đổi một yếu tố cần kiểm tra", "thay đổi mọi thứ", "không ghi kết quả", "đoán kết luận trước"], "answer": 0, "explain": "Giữ các yếu tố khác giống nhau giúp kết quả đáng tin hơn."},
        {"q": "Vắc-xin giúp cơ thể:", "choices": ["tạo miễn dịch phòng bệnh", "nhìn xa hơn", "cao ngay lập tức", "không cần ăn"], "answer": 0, "explain": "Vắc-xin giúp cơ thể nhận biết và chống tác nhân gây bệnh."},
    ],
    "lich_su": [
        {"q": "Nguyên nhân và kết quả khác nhau vì:", "choices": ["nguyên nhân xảy ra trước, kết quả xảy ra sau", "đều là tên người", "đều là màu sắc", "không liên quan thời gian"], "answer": 0, "explain": "Nguyên nhân dẫn tới sự kiện, kết quả là điều xảy ra sau."},
        {"q": "Một nhận xét lịch sử tốt cần:", "choices": ["dựa trên tư liệu", "dựa vào đoán mò", "chỉ nhìn tranh", "bỏ qua mốc thời gian"], "answer": 0, "explain": "Nhận xét cần có bằng chứng từ tư liệu."},
        {"q": "Sắp xếp sự kiện theo thời gian giúp:", "choices": ["thấy quá trình phát triển", "làm mất ý nghĩa", "đổi ngày tháng", "không cần học"], "answer": 0, "explain": "Thứ tự thời gian cho thấy sự việc diễn tiến như thế nào."},
        {"q": "Khi hai nguồn tư liệu khác nhau, em nên:", "choices": ["đối chiếu thêm nguồn đáng tin", "chọn nguồn vui hơn", "bỏ hết", "tin nguồn dài hơn"], "answer": 0, "explain": "Đối chiếu giúp kiểm chứng thông tin."},
        {"q": "Bối cảnh lịch sử là:", "choices": ["hoàn cảnh diễn ra sự kiện", "tên một dụng cụ", "kết quả phép chia", "màu của bản đồ"], "answer": 0, "explain": "Bối cảnh gồm điều kiện thời gian, không gian, xã hội liên quan."},
        {"q": "Khi thuyết trình sự kiện, nên nêu:", "choices": ["thời gian, địa điểm, diễn biến, ý nghĩa", "chỉ tên người", "chỉ một bức tranh", "chỉ cảm xúc"], "answer": 0, "explain": "Các thông tin này giúp bài trình bày đầy đủ."},
        {"q": "Bài học lịch sử có ích vì:", "choices": ["giúp hiểu hiện tại và hành động tốt hơn", "để chép dài hơn", "để bỏ qua tư liệu", "để không cần hỏi vì sao"], "answer": 0, "explain": "Lịch sử giúp rút kinh nghiệm và trân trọng giá trị tốt đẹp."},
        {"q": "Mốc thời gian chính trong bài nên được:", "choices": ["ghi rõ và kiểm tra lại", "thay bằng dấu hỏi", "bỏ qua", "viết tùy nhớ"], "answer": 0, "explain": "Mốc thời gian là thông tin cần chính xác."},
    ],
    "dia_li": [
        {"q": "Khi phân tích một vùng, cần xem:", "choices": ["vị trí, tự nhiên, dân cư, kinh tế", "chỉ màu bản đồ", "chỉ số trang", "chỉ tên trường"], "answer": 0, "explain": "Các yếu tố này giúp hiểu đặc điểm vùng."},
        {"q": "Tài nguyên thiên nhiên cần được khai thác:", "choices": ["hợp lý và tiết kiệm", "càng nhanh càng tốt", "không cần bảo vệ", "chỉ để trang trí"], "answer": 0, "explain": "Khai thác hợp lý giúp phát triển lâu dài."},
        {"q": "Đô thị thường có:", "choices": ["dân cư đông và nhiều dịch vụ", "toàn rừng rậm", "không có đường", "chỉ có ruộng lúa"], "answer": 0, "explain": "Đô thị tập trung dân cư, dịch vụ và hoạt động kinh tế."},
        {"q": "Vùng núi cần chú ý phòng tránh:", "choices": ["sạt lở và lũ quét", "sóng thần mỗi ngày", "bão tuyết quanh năm", "khô hạn tuyệt đối"], "answer": 0, "explain": "Địa hình dốc làm tăng nguy cơ sạt lở và lũ quét."},
        {"q": "Giao thông thuận lợi giúp:", "choices": ["trao đổi hàng hóa và đi lại dễ hơn", "làm cây ngừng lớn", "làm bản đồ mất ý nghĩa", "không cần sản xuất"], "answer": 0, "explain": "Giao thông kết nối vùng và thúc đẩy kinh tế."},
        {"q": "Khi đọc biểu đồ cột, cần xem:", "choices": ["tên biểu đồ, trục, đơn vị", "chỉ màu đẹp", "số trang sách", "bút đang dùng"], "answer": 0, "explain": "Các thông tin này giúp đọc số liệu đúng."},
        {"q": "Biến đổi khí hậu có thể gây:", "choices": ["thời tiết cực đoan hơn", "mọi nơi mát giống nhau", "không ảnh hưởng gì", "mất trọng lực"], "answer": 0, "explain": "Biến đổi khí hậu làm nhiều hiện tượng thời tiết cực đoan hơn."},
        {"q": "Bảo vệ môi trường địa phương có thể bắt đầu bằng:", "choices": ["giảm rác và tiết kiệm nước", "xả rác xuống kênh", "đốt nhựa", "bẻ cây"], "answer": 0, "explain": "Hành động nhỏ hằng ngày góp phần bảo vệ môi trường."},
    ],
    "cong_nghe": [
        {"q": "Khi thiết kế một cây cầu giấy, tiêu chí quan trọng là:", "choices": ["chịu lực và ổn định", "càng nhiều màu càng tốt", "không cần đo", "chỉ làm thật nhanh"], "answer": 0, "explain": "Sản phẩm cần đáp ứng yêu cầu sử dụng."},
        {"q": "Thử nghiệm sản phẩm giúp:", "choices": ["phát hiện điểm cần cải tiến", "làm mất sản phẩm", "không có ích", "bỏ qua an toàn"], "answer": 0, "explain": "Thử nghiệm cho biết sản phẩm hoạt động ra sao."},
        {"q": "Khi chọn vật liệu, cần cân nhắc:", "choices": ["độ bền, an toàn, mục đích sử dụng", "chỉ màu yêu thích", "chỉ giá rẻ", "không cần tính năng"], "answer": 0, "explain": "Vật liệu phải phù hợp với yêu cầu sản phẩm."},
        {"q": "Sơ đồ quy trình giúp:", "choices": ["theo dõi các bước làm", "làm việc không cần kế hoạch", "thay thế dụng cụ", "không cần kiểm tra"], "answer": 0, "explain": "Sơ đồ quy trình giúp làm đúng thứ tự."},
        {"q": "Khi làm mô hình có nhiều chi tiết nhỏ, nên:", "choices": ["sắp xếp vật liệu gọn gàng", "để lẫn trên sàn", "vứt bao bì bừa bãi", "không kiểm đếm"], "answer": 0, "explain": "Gọn gàng giúp an toàn và tránh mất chi tiết."},
        {"q": "Một sản phẩm thân thiện môi trường nên:", "choices": ["tiết kiệm vật liệu và dễ tái sử dụng", "dùng thật nhiều nhựa một lần", "khó sửa", "khó phân loại"], "answer": 0, "explain": "Tiết kiệm và tái sử dụng giúp giảm rác."},
        {"q": "Khi nhận góp ý, nhóm nên:", "choices": ["lắng nghe và chọn ý phù hợp để sửa", "bỏ qua mọi ý kiến", "tranh cãi", "dừng làm"], "answer": 0, "explain": "Góp ý giúp sản phẩm tốt hơn."},
        {"q": "An toàn lao động trong lớp học nghĩa là:", "choices": ["dùng dụng cụ đúng cách và giữ trật tự", "chạy khi cầm kéo", "đùa với keo nóng", "không nghe hướng dẫn"], "answer": 0, "explain": "Dùng đúng cách giúp tránh tai nạn."},
    ],
}


def make_quiz(slug: str, level: str, questions: list[dict]) -> dict:
    name, keywords = SUBJECTS[slug]
    suffix = "cơ bản" if level == "co_ban" else "nâng cao"
    return {
        "id": f"grade5_trac_nghiem_{slug}_{level}",
        "title": f"Trắc nghiệm ôn tập {name} lớp 5 - {suffix}",
        "subject": f"Trắc nghiệm cuối năm - {name}",
        "keywords": keywords + [suffix],
        "questions": questions,
    }


def main() -> None:
    catalog: list[dict] = []
    for slug in SUBJECTS:
        write_quiz(make_quiz(slug, "co_ban", BASIC_QUESTIONS[slug]), catalog)
        write_quiz(make_quiz(slug, "nang_cao", ADVANCED_QUESTIONS[slug]), catalog)
    rewrite_catalog(catalog)
    total_questions = sum(item["question_count"] for item in catalog)
    print(f"Generated {len(catalog)} extra grade 5 review quiz sets with {total_questions} questions.")


if __name__ == "__main__":
    main()
