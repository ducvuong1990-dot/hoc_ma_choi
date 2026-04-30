const STORAGE_KEY = "hoc_ma_choi_state_v2";
const PRIORITY_LESSON_GRADES = [1, 5];

const now = () => Date.now();
const todayKey = (date = new Date()) => date.toISOString().slice(0, 10);

const defaultState = {
  isLoggedIn: false,
  route: "dashboard",
  name: "Alex",
  grade: 1,
  coins: 500,
  streak: 12,
  level: 1,
  avatar: "🚀",
  avatarPhoto: "",
  avatarFrame: "rainbow",
  avatarId: "capy",
  avatarLv: 1,
  avatarMood: "idle",
  avatarCosmetics: { hat: "none", outfit: "none", shoes: "none", hair: "none", bag: "none", toy: "none" },
  currentQuestionIndex: 0,
  lessonHints: {},
  stickerAwards: [],
  knowledgeGifts: [],
  stickers: ["Cánh tay robot"],
  activeLesson: "letters",
  activeGame: "letter-hunt",
  contentDifficulty: 1,
  lessonStartedAt: now(),
  studyTimerStartedAt: now(),
  levelPrompt: null,
  recording: false,
  chatListening: false,
  chatModel: "Gemini",
  musicEnabled: false,
  currentMelody: "",
  transcript: "",
  readingStartedAt: 0,
  readingDeadline: 0,
  readingAudioBlob: null,
  lastReadingScore: 0,
  lastReadingScore10: 0,
  lastReadingMetrics: null,
  readFeedback: "Bấm micro và đọc đoạn văn. Nếu trình duyệt chưa hỗ trợ nhận giọng nói, bé có thể nhập lại câu đã đọc.",
  chatMessages: [
    { role: "ai", model: "Gemini", text: "Chào bé, mình là Gemini. Hôm nay mình học mà chơi thật vui nhé!" }
  ],
  lessons: {
    letters: { progress: 30, stars: 1, completed: 1 },
    vocabulary: { progress: 10, stars: 0, completed: 0 },
    numbers: { progress: 20, stars: 1, completed: 1 },
    colors: { progress: 0, stars: 0, completed: 0 },
    reading: { progress: 15, stars: 0, completed: 0 }
  },
  lessonAttempts: {},
  games: {
    letterHunt: { progress: 10, stars: 0, completed: 0, wins: 0, losses: 0 },
    speedDuel: { progress: 0, stars: 0, completed: 0, wins: 0, losses: 0, reactionAvg: 2600 },
    numberMatch: { progress: 10, stars: 0, completed: 0, wins: 0, losses: 0 },
    picturePuzzle: { progress: 0, stars: 0, completed: 0, wins: 0, losses: 0 },
    memoryFriends: { progress: 0, stars: 0, completed: 0, wins: 0, losses: 0 }
  },
  assetLibrary: {},
  contentLibrary: {},
  studyLog: {},
  categoryLog: {},
  characterProgress: { capybara: { xp: 45, level: 1, title: "Bạn đọc ấm áp" } },
  readingAiEnabled: false,
  whisperEndpoint: "http://127.0.0.1:8000/transcribe",
  ttsEndpoint: "http://127.0.0.1:8000/tts",
  ttsVoice: "vi-VN-HoaiMyNeural",
  purchases: [],
  geminiApiKey: "",
  dynamicQuote: null,
  dynamicFact: null,
  lastDynamicFetch: "",
  achievements: [],
  completedLessons: {} // Map of lessonId -> boolean
};

const fallbackLibraryCatalog = [
  {
    "id": "gen_Vong_doi_cua_cay_dau_1777524933652",
    "grade": 1,
    "category": "Tự nhiên",
    "title": "Vòng đời của cây đậu",
    "desc": "6 slide · Audio · Karaoke · Quiz",
    "path": "lessons/lesson_Vong_doi_cua_cay_dau_1777524933652/index.html",
    "thumbnail": "lessons/lesson_Vong_doi_cua_cay_dau_1777524933652/images/slide-01.png",
    "hasQuiz": true
  },
  {
    "id": "lesson_script_toan_mega_lop5_1777515606",
    "grade": 5,
    "category": "Toán",
    "title": "TOAN MEGA LOP5",
    "desc": "12 Slide - Quiz",
    "path": "lessons/lesson_script_toan_mega_lop5_1777515606/index.html",
    "hasQuiz": true
  },
  {
    "id": "lesson_script_dia_ly_mega_lop5_1777515446",
    "grade": 5,
    "category": "Địa lý",
    "title": "DIA LY MEGA LOP5",
    "desc": "12 Slide - Quiz",
    "path": "lessons/lesson_script_dia_ly_mega_lop5_1777515446/index.html",
    "hasQuiz": true
  },
  {
    "id": "lesson_script_khoa_hoc_mega_lop5_1777515484",
    "grade": 5,
    "category": "Khoa học",
    "title": "KHOA HOC MEGA LOP5",
    "desc": "12 Slide - Quiz",
    "path": "lessons/lesson_script_khoa_hoc_mega_lop5_1777515484/index.html",
    "hasQuiz": true
  },
  {
    "id": "lesson_script_lich_su_lop5_1777515536",
    "grade": 5,
    "category": "Lịch sử",
    "title": "LICH SU LOP5",
    "desc": "12 Slide - Quiz",
    "path": "lessons/lesson_script_lich_su_lop5_1777515536/index.html",
    "hasQuiz": true
  },
  {
    "id": "lesson_script_tieng_viet_mega_lop1_1777515553",
    "grade": 1,
    "category": "Tiếng Việt",
    "title": "TIENG VIET MEGA LOP1",
    "desc": "12 Slide - Quiz",
    "path": "lessons/lesson_script_tieng_viet_mega_lop1_1777515553/index.html",
    "hasQuiz": true
  },
  {
    "id": "lesson_script_dao_duc_lop1_1777515439",
    "grade": 1,
    "category": "Đạo đức",
    "title": "DAO DUC LOP1",
    "desc": "12 Slide - Quiz",
    "path": "lessons/lesson_script_dao_duc_lop1_1777515439/index.html",
    "hasQuiz": true
  }
];

const lessonCatalog = [
  { id: "letters", title: "Chữ cái vui nhộn", icon: "menu_book", color: "#81c784", dark: "#286b33", reward: 28, kind: "letters" },
  { id: "vocabulary", title: "Kiểm tra từ vựng", icon: "quiz", color: "#ff6b8a", dark: "#9f1730", reward: 34, kind: "vocabulary" },
  { id: "numbers", title: "Con số kỳ diệu", icon: "calculate", color: "#4fc3f7", dark: "#006688", reward: 30, kind: "numbers" },
  { id: "colors", title: "Sắc màu quanh em", icon: "palette", color: "#ff9f43", dark: "#a35400", reward: 26, kind: "colors" },
  { id: "reading", title: "Gemini Đọc", icon: "mic", color: "#fdd34d", dark: "#735c00", reward: 22, kind: "book" }
];

const gameCatalog = [
  { id: "letter-hunt", stateKey: "letterHunt", title: "Tìm chữ siêu tốc", subtitle: "Lớp 1 · Tìm đúng chữ cái.", age: "5-6 tuổi", icon: "travel_explore", color: "#81c784", dark: "#286b33", reward: 28, kind: "letter-hunt" },
  { id: "speed-duel", stateKey: "speedDuel", title: "Ai nhanh tay hơn?", subtitle: "Đấu với bạn ảo Miko.", age: "5-7 tuổi", icon: "bolt", color: "#ff9f43", dark: "#8a3c00", reward: 32, kind: "speed-duel" },
  { id: "number-match", stateKey: "numberMatch", title: "Ghép hình và số", subtitle: "Đếm hình, ghép kết quả.", age: "5-8 tuổi", icon: "widgets", color: "#4fc3f7", dark: "#006688", reward: 30, kind: "number-match" },
  { id: "picture-puzzle", stateKey: "picturePuzzle", title: "Mảnh ghép bí mật", subtitle: "Chọn mảnh còn thiếu.", age: "6-8 tuổi", icon: "extension", color: "#fdd34d", dark: "#735c00", reward: 28, kind: "picture-puzzle" },
  { id: "memory-friends", stateKey: "memoryFriends", title: "Nhớ bạn thân", subtitle: "Tìm cặp hình giống nhau.", age: "6-9 tuổi", icon: "diversity_1", color: "#ff6b8a", dark: "#9f1730", reward: 30, kind: "memory-friends" }
];

const stickerCatalog = [
  { id: "cloud-bunny", title: "Thỏ mây quế", icon: "🐰", theme: "Mascot cute" },
  { id: "calm-capybara", title: "Capybara thư giãn", icon: "🦫", theme: "Thú cưng" },
  { id: "rocket-bus", title: "Xe buýt tên lửa", icon: "🚍", theme: "Xe cộ" },
  { id: "tiny-train", title: "Tàu hỏa mini", icon: "🚂", theme: "Xe cộ" },
  { id: "vietnam-flag", title: "Lá cờ Việt Nam", icon: "🇻🇳", theme: "Đất nước" },
  { id: "lotus-friend", title: "Hoa sen bạn bè", icon: "🪷", theme: "Đất nước" },
  { id: "friendship-heart", title: "Trái tim tình bạn", icon: "💞", theme: "Tình bạn" },
  { id: "high-five", title: "Đập tay thật vui", icon: "🙌", theme: "Tình bạn" },
  { id: "rainbow-pencil", title: "Bút chì cầu vồng", icon: "✏️", theme: "Học tập" },
  { id: "story-crown", title: "Vương miện kể chuyện", icon: "👑", theme: "Học tập" }
];

const knowledgeGiftCatalog = [
  { id: "math-half", title: "Mẹo nhân 0,5", kind: "Mẹo tính nhanh", grade: 5, text: "Nhân với 0,5 chính là chia số đó cho 2. Ví dụ 48 x 0,5 = 24." },
  { id: "math-eleven", title: "Mẹo nhân 11", kind: "Mẹo tính nhanh", grade: 5, text: "Với số có hai chữ số, nhân 11 bằng cách chèn tổng hai chữ số vào giữa khi tổng nhỏ hơn 10. Ví dụ 23 x 11 = 253." },
  { id: "history-years", title: "Mốc nhớ nhanh", kind: "Thần chú lịch sử", grade: 5, text: "1930 thành lập Đảng, 1945 Cách mạng tháng Tám, 1954 Điện Biên Phủ, 1975 thống nhất đất nước." },
  { id: "bac-ninh-cake", title: "Bánh đa Kế", kind: "Ghi chú Kinh Bắc", grade: 1, text: "Bánh đa Kế là đặc sản nổi tiếng của Bắc Ninh, giòn thơm và thường được nướng vàng." },
  { id: "quan-ho", title: "Quan họ Bắc Ninh", kind: "Ghi chú Kinh Bắc", grade: 5, text: "Dân ca Quan họ Bắc Ninh là di sản văn hóa phi vật thể, nổi bật với lối hát đối đáp liền anh liền chị." },
  { id: "grade1-ln", title: "L và N rõ tiếng", kind: "Mẹo tập đọc", grade: 1, text: "Khi đọc tiếng bắt đầu bằng L, đặt đầu lưỡi nhẹ lên lợi trên rồi bật âm rõ: lá, lan, long lanh." }
];

const shopItems = [
  { id: "kinh-bac-outfit", type: "badge", title: "Áo tứ thân Kinh Bắc", icon: "styler", price: 220, desc: "Trang phục truyền thống để trưng trong bộ sưu tập của bé." },
  { id: "quan-ho-hat", type: "badge", title: "Nón quai thao", icon: "editor_choice", price: 180, desc: "Món đồ kỷ niệm Quan họ Bắc Ninh cho bạn học chăm." },
  { id: "super-cape", type: "badge", title: "Áo choàng siêu nhân", icon: "flight_takeoff", price: 260, desc: "Phần thưởng cho những lượt học nhanh và chắc kiến thức." },
  { id: "space-dog", type: "avatar", title: "Chó Vũ Trụ", icon: "🚀", price: 200, desc: "Ảnh đại diện khám phá bầu trời sao." },
  { id: "hello-kitty", type: "avatar", title: "Hello Kitty 3D", icon: "🐱", price: 300, desc: "Bạn mèo dễ thương từ thế giới Sanrio." },
  { id: "my-melody", type: "avatar", title: "My Melody", icon: "🐰", price: 300, desc: "Bạn thỏ dịu dàng với chiếc nơ hồng." },
  { id: "kuromi", type: "avatar", title: "Kuromi", icon: "😈", price: 350, desc: "Bạn nhỏ tinh nghịch và cá tính." },
  { id: "spiderman", type: "avatar", title: "Spider-Man", icon: "🕷️", price: 350, desc: "Anh hùng nhện bảo vệ thành phố tri thức." },
  { id: "ironman", type: "avatar", title: "Iron Man", icon: "🤖", price: 450, desc: "Siêu anh hùng công nghệ với bộ giáp lấp lánh." },
  { id: "captain-america", type: "avatar", title: "Captain America", icon: "🛡️", price: 400, desc: "Đội trưởng dũng cảm và chính trực." },
  { id: "sticker-space", type: "sticker", title: "Bộ Sticker Vũ Trụ", icon: "🚀", price: 100, desc: "Khám phá các hành tinh và phi thuyền." },
  { id: "sticker-ocean", type: "sticker", title: "Bộ Sticker Đại Dương", icon: "🐙", price: 100, desc: "Gặp gỡ bạn cá voi và bạch tuộc tinh nghịch." },
  { id: "sticker-sanrio", type: "sticker", title: "Sticker Sanrio", icon: "🎀", price: 150, desc: "Những hình dán dễ thương nhất quả đất." },
  { id: "badge-reader", type: "badge", title: "Huy hiệu Mọt Sách", icon: "📖", price: 250, desc: "Dành cho bé chăm đọc sách mỗi ngày." },
  { id: "badge-speed", type: "badge", title: "Huy hiệu Tia Chớp", icon: "⚡", price: 300, desc: "Dành cho bé phản xạ nhanh trong trò chơi." },
  { id: "badge-master", type: "badge", title: "Huy hiệu Bậc Thầy", icon: "👑", price: 500, desc: "Danh hiệu cao quý nhất vũ trụ học tập." },
  { id: "avatar-knight", type: "avatar", title: "Avatar Hiệp Sĩ", icon: "🛡️", price: 400, desc: "Hóa thân thành hiệp sĩ bảo vệ tri thức." }
];

const readingPassageLibrary = {
  1: [
    "Bé An đi học. An chào cô. Cô khen An ngoan.",
    "Bé Lan có bút đỏ. Lan tô lá cờ. Lá cờ bay trong gió.",
    "Mẹ nấu cơm. Bé Bi nhặt rau. Cả nhà ăn cơm vui.",
    "Con mèo nằm ngủ. Bé gọi mèo dậy. Mèo kêu meo meo.",
    "Trời nắng đẹp. Nam đội mũ. Nam đi bộ cùng bố."
  ],
  2: [
    "Buổi sáng, Nam tưới cây trong vườn. Cây có nhiều lá xanh. Nam rất vui khi cây lớn lên.",
    "Bạn Mai có ba quả cam. Mai biếu bà một quả. Mai còn lại hai quả cam.",
    "Cả lớp xếp hàng vào lớp. Cô giáo mỉm cười chào các bạn. Chúng em bắt đầu bài học mới.",
    "Lan đọc sách dưới gốc cây. Lan gặp một từ mới. Lan hỏi cô để hiểu nghĩa của từ.",
    "Bố đưa bé đến trường. Bé chào bố rồi vào lớp. Hôm nay bé học chữ và học số."
  ],
  3: [
    "Sáng thứ hai, sân trường rất sạch. Cả lớp xếp hàng ngay ngắn. Tiếng trống báo hiệu giờ học bắt đầu.",
    "Minh nhặt được chiếc bút màu xanh ở hành lang. Bạn mang bút lên bàn cô giáo. Cô giúp Minh tìm người đánh rơi.",
    "Trong giờ thủ công, Hà cắt giấy thành bông hoa nhỏ. Cả nhóm cùng dán hoa lên tấm thiệp. Tấm thiệp được gửi tặng mẹ.",
    "Sau giờ ra chơi, các bạn rửa tay rồi vào lớp. Cô nhắc cả lớp ngồi ngay ngắn. Chúng em mở sách và đọc bài."
  ],
  4: [
    "Sau cơn mưa, con đường trước nhà sạch và mát hơn. Những giọt nước còn đọng trên lá. Lá cây lấp lánh dưới ánh nắng.",
    "Bảo thích đọc sách khoa học. Mỗi trang sách giúp bạn biết thêm một điều mới. Hôm nay, Bảo tìm hiểu vì sao cầu vồng có nhiều màu.",
    "Khi làm việc nhóm, mỗi bạn nhận một nhiệm vụ nhỏ. Các bạn biết lắng nghe ý kiến của nhau. Nhờ vậy, cả nhóm hoàn thành bài đúng giờ.",
    "Ở thư viện, chúng em nói nhỏ để không làm phiền người khác. Mỗi bạn chọn một cuốn sách phù hợp. Sau đó, chúng em kể lại điều mình thích nhất."
  ],
  5: [
    "Thư viện trường em có nhiều góc đọc yên tĩnh. Mỗi tuần, em chọn một cuốn sách mới. Em ghi lại điều thú vị nhất vào sổ tay đọc sách.",
    "Một thói quen tốt được hình thành từ những việc nhỏ lặp lại hằng ngày. Nếu chăm chỉ luyện đọc, em sẽ hiểu bài nhanh hơn. Em cũng tự tin hơn khi trình bày trước lớp.",
    "Trong chuyến tham quan bảo tàng, chúng em nghe câu chuyện về trống đồng Đông Sơn. Những hoa văn trên mặt trống kể về đời sống của người Việt xưa. Em thấy lịch sử thật gần gũi.",
    "Khi gặp một bài đọc khó, em đọc chậm từng câu. Em gạch chân từ chưa hiểu và hỏi thầy cô. Nhờ vậy, em hiểu nội dung bài rõ hơn."
  ]
};

const funQuotes = [
  "Học chậm mà chắc vẫn là siêu năng lực.",
  "Sai một lần là thêm một manh mối để đúng lần sau.",
  "Một từ mới hôm nay có thể mở ra một câu chuyện ngày mai.",
  "Bạn tốt là người cùng mình cố gắng thêm một chút."
];

const todayFacts = [
  { title: "Ngày này năm xưa", text: "Những chiếc tem đầu tiên từng giúp thư đi xa hơn và nhanh hơn.", kind: "stamp" },
  { title: "Góc khám phá Việt Nam", text: "Trống đồng Đông Sơn có hoa văn kể chuyện đời sống và thiên nhiên.", kind: "drum" },
  { title: "Bạn nhỏ khoa học", text: "Kính hiển vi giúp con người nhìn thấy những thứ rất nhỏ.", kind: "science" },
  { title: "Tình bạn bốn phương", text: "Nhiều bạn nhỏ trao thiệp để nói lời cảm ơn và động viên nhau.", kind: "friendship" }
];

const speechPacks = {
  greeting: [
    () => `Chào ${state.name}. Hôm nay mình cùng học mà chơi nhé. Bé học từng chút một, trả lời thật bình tĩnh và nhận xu sau mỗi nhiệm vụ.`,
    () => `Xin chào ${state.name}. Chúc bé có một buổi học vui. Nếu gặp câu khó, bé cứ chậm rãi suy nghĩ rồi chọn đáp án.`
  ],
  lessonStart: [
    () => `Bài học bắt đầu. Bé hãy nhìn kỹ hình minh họa, nghe câu hỏi, rồi chọn đáp án đúng nhất. Không cần vội, đọc kỹ trước khi bấm nhé.`,
    () => `Mình cùng học bài mới nào. Bé quan sát hình, đọc câu hỏi thật chậm, sau đó chọn một đáp án mà bé thấy đúng.`
  ],
  quizStart: [
    () => `Đến phần kiểm tra nhỏ rồi. Bé hãy ngồi thẳng, nhìn kỹ màn hình và chọn đáp án. Trả lời đúng sẽ nhận xu và có thể nhận sticker bất ngờ.`,
    () => `Bài kiểm tra bắt đầu. Bé cứ bình tĩnh nhé. Mỗi câu là một cơ hội để luyện trí nhớ và học thêm điều mới.`
  ],
  readingGuide: [
    () => `Đây là phần luyện đọc tiếng Việt. Bé hãy nhìn từng dòng, đọc từ trái sang phải. Đọc rõ từng tiếng, nghỉ một chút sau dấu chấm.`,
    () => `Trước khi ghi âm, bé có thể bấm nghe đọc mẫu. Sau đó bấm bắt đầu đọc, đọc to vừa đủ và chậm rãi từng câu.`
  ],
  readingStart: [
    () => `Micro đã sẵn sàng. Bé bắt đầu đọc nhé. Hãy đọc rõ từng tiếng và nghỉ nhẹ sau mỗi câu.`,
    () => `Bé đọc bài trong ba mươi giây. Nếu đọc xong sớm, bé bấm dừng và chấm để nhận nhận xét.`
  ],
  readingFinish: [
    () => `Đã ghi âm xong. Gemini sẽ xem bé đọc rõ được bao nhiêu tiếng và đưa nhận xét nhẹ nhàng.`,
    () => `Tốt rồi. Bây giờ mình cùng xem kết quả luyện đọc nhé.`
  ],
  gameStart: [
    () => `Trò chơi bắt đầu. Bé nhìn thật kỹ, chọn nhanh nhưng vẫn phải chính xác nhé.`,
    () => `Mình vào khu trò chơi nào. Mỗi lượt chơi giúp bé luyện mắt, luyện tay và luyện trí nhớ.`
  ],
  praise: [
    () => `Tuyệt vời, ${state.name} đang tiến bộ từng chút một.`,
    () => `Làm tốt lắm. Một chiến thắng nhỏ cũng rất đáng khen.`,
    () => `Giỏi quá. Bé vừa hoàn thành thêm một nhiệm vụ học tập.`
  ]
};

const melodyPresets = [
  { name: "Ngôi sao nhỏ", notes: [262, 262, 392, 392, 440, 440, 392, 349, 349, 330, 330, 294, 294, 262] },
  { name: "Anh em vui", notes: [262, 294, 330, 262, 262, 294, 330, 262, 330, 349, 392] },
  { name: "Cừu nhỏ đến lớp", notes: [330, 294, 262, 294, 330, 330, 330, 294, 294, 294, 330, 392, 392] }
];

let libraryCatalog = fallbackLibraryCatalog.map(normalizeLibraryCatalogItem);
let libraryCatalogStatus = "loading";
let libraryCatalogMessage = "";

const CHARACTER_ASSET_DIR = "assets/characters";

function characterAsset(fileName) {
  return `${CHARACTER_ASSET_DIR}/${encodeURIComponent(fileName)}`;
}

const avatarCharacters = [
  { id: "capy", name: "Capybara", emoji: "🦫", role: "Mascot hiền lành", base: 0x8a5a34, belly: 0xcda27a, accent: 0x48d5ff, image: characterAsset("capy-lv1.png"), glb: characterAsset("capybara.glb") },
  { id: "miko", name: "Miko Robot", emoji: "🤖", role: "Trợ lý công nghệ", base: 0x89cff0, belly: 0xe8f7ff, accent: 0xffd34d },
  { id: "nam", name: "Bé Nam", emoji: "🧒", role: "Bạn học tập", base: 0xf0b48a, belly: 0xffe0c2, accent: 0x4fc3f7, image: characterAsset("nam-lv1.png") },
  { id: "lan", name: "Bé Lan", emoji: "👧", role: "Bạn đồng hành", base: 0xf2b38f, belly: 0xffdebd, accent: 0xff7aa8, image: characterAsset("lan-lv1.png") },
  { id: "cinnamoroll", name: "Cinnamoroll", emoji: "🐶", role: "Bạn dễ thương", base: 0xffffff, belly: 0xffffff, accent: 0xb3e5fc, glb: characterAsset("cinnamoroll.glb") },
  { id: "spiderman", name: "Spider-Man", emoji: "🕷️", role: "Siêu anh hùng", base: 0xe63946, belly: 0x1d3557, accent: 0xffffff, glb: characterAsset("spider-man_spider-man_no_way_home.glb") },
  { id: "hello-kitty", name: "Hello Kitty", emoji: "🐱", role: "Bạn mèo nhỏ", base: 0xffffff, belly: 0xffffff, accent: 0xff7aa8, image: characterAsset("hello-kitty-lv2.png"), glb: characterAsset("hello_kitty.glb") },
  { id: "my-melody", name: "My Melody", emoji: "🐰", role: "Bạn thỏ hồng", base: 0xffffff, belly: 0xffffff, accent: 0xff7aa8, image: characterAsset("my-melody-lv2.png"), glb: characterAsset("my_melody.glb") },
  { id: "kuromi", name: "Kuromi", emoji: "😈", role: "Bạn tinh nghịch", base: 0x6b5a86, belly: 0xffd4e8, accent: 0xff7aa8, image: characterAsset("kuromi-lv2.png") },
  { id: "pompompurin", name: "Pompom", emoji: "🐶", role: "Bạn bánh pudding", base: 0xf4c96a, belly: 0xffe6a8, accent: 0x8b5cf6, image: characterAsset("pompompurin-lv2.png"), glb: characterAsset("pompompurin.glb") },
  { id: "ironman", name: "Iron Man", emoji: "🤖", role: "Siêu anh hùng", base: 0xd62828, belly: 0xf77f00, accent: 0xfcbf49, image: characterAsset("ironman-lv2.png"), glb: characterAsset("iron_man.glb") },
  { id: "pochacco", name: "Pochacco", emoji: "🐶", role: "Bạn năng động", base: 0xffffff, belly: 0xffffff, accent: 0x4fc3f7, glb: characterAsset("pochacco_sanrio_3d.glb") },
  { id: "captain-america", name: "Captain America", emoji: "🛡️", role: "Đội trưởng dũng cảm", base: 0x003049, belly: 0xd62828, accent: 0xeae2b7, image: characterAsset("captain-america-lv2.png") },
  { id: "wonder-woman", name: "Wonder Woman", emoji: "⭐", role: "Nữ anh hùng", base: 0xd62828, belly: 0xffd34d, accent: 0x1d4ed8, image: characterAsset("wonder-woman-lv2.png") },
  { id: "mystery-char", name: "Bạn Bí Ẩn", emoji: "✨", role: "Nhân vật đặc biệt", base: 0xffffff, belly: 0xffffff, accent: 0xffd34d, glb: characterAsset("14c1ac1045fd4fc7a91f53be03310cf7.glb") }
];

const avatarLevelStages = [
  { level: 1, name: "Mini", xp: 0, scale: 0.78 },
  { level: 2, name: "Nhanh nhen", xp: 100, scale: 0.92 },
  { level: 3, name: "Tu tin", xp: 200, scale: 1.06 },
  { level: 4, name: "Ruc ro", xp: 300, scale: 1.18 },
  { level: 5, name: "Sieu sao", xp: 400, scale: 1.32 }
];

const avatarCosmeticCatalog = [
  { id: "none", type: "hat", label: "Khong mu", icon: "block", unlock: 1 },
  { id: "cap", type: "hat", label: "Mu hoc sinh", icon: "school", unlock: 1 },
  { id: "crown", type: "hat", label: "Vuong mien", icon: "workspace_premium", unlock: 3 },
  { id: "hero", type: "hat", label: "Mu sieu nhan", icon: "rocket_launch", unlock: 4 },
  { id: "none", type: "outfit", label: "Ao mac dinh", icon: "checkroom", unlock: 1 },
  { id: "uniform", type: "outfit", label: "Dong phuc", icon: "checkroom", unlock: 1 },
  { id: "quan-ho", type: "outfit", label: "Ao tu than", icon: "theater_comedy", unlock: 3 },
  { id: "hero-cape", type: "outfit", label: "Ao choang", icon: "bolt", unlock: 4 },
  { id: "none", type: "shoes", label: "Chan tran", icon: "block", unlock: 1 },
  { id: "sneakers", type: "shoes", label: "Giay the thao", icon: "directions_run", unlock: 2 },
  { id: "boots", type: "shoes", label: "Ung anh hung", icon: "hiking", unlock: 4 },
  { id: "none", type: "hair", label: "Kieu co ban", icon: "face", unlock: 1 },
  { id: "tuft", type: "hair", label: "Toc chom", icon: "auto_awesome", unlock: 2 },
  { id: "star", type: "hair", label: "Kep sao", icon: "star", unlock: 3 },
  { id: "none", type: "bag", label: "Khong cap", icon: "block", unlock: 1 },
  { id: "school-bag", type: "bag", label: "Cap sach", icon: "backpack", unlock: 1 },
  { id: "space-bag", type: "bag", label: "Cap vu tru", icon: "rocket_launch", unlock: 4 },
  { id: "none", type: "toy", label: "Khong do choi", icon: "block", unlock: 1 },
  { id: "pencil", type: "toy", label: "But chi", icon: "edit", unlock: 1 },
  { id: "kite", type: "toy", label: "Dieu giay", icon: "near_me", unlock: 3 }
];

const frameLabels = {
  rainbow: "Cầu vồng",
  rocket: "Tên lửa",
  flower: "Hoa nhỏ",
  pet: "Thú cưng",
  star: "Ngôi sao"
};

let state = loadState();
normalizeAvatarState();
let currentPassage = getReadingPassageList()[0];
let recognition = null;
let audioContext = null;
let musicTimer = null;
let avatarStream = null;
let readingTimeout = null;
let readingCountdown = null;
let readingStopRequested = false;
let readingRecorder = null;
let readingAudioChunks = [];
let readingAudioStream = null;
let appMicStream = null;
let chatRecorder = null;
let chatAudioChunks = [];
let chatVoiceTimer = null;
let avatarStageInstances = [];
let pendingLoginAvatarId = state.avatarId;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || localStorage.getItem("eduplay_state_v1"));
    if (!saved) return structuredClone(defaultState);
    return {
      ...structuredClone(defaultState),
      ...saved,
      lessons: { ...structuredClone(defaultState.lessons), ...(saved.lessons || {}) },
      games: { ...structuredClone(defaultState.games), ...(saved.games || {}) },
      lessonHints: { ...(saved.lessonHints || {}) },
      stickerAwards: saved.stickerAwards || structuredClone(defaultState.stickerAwards),
      knowledgeGifts: saved.knowledgeGifts || structuredClone(defaultState.knowledgeGifts),
      stickers: saved.stickers || structuredClone(defaultState.stickers),
      assetLibrary: saved.assetLibrary || {},
      contentLibrary: saved.contentLibrary || {},
      lessonAttempts: { ...(saved.lessonAttempts || {}) },
      studyLog: saved.studyLog || {},
      categoryLog: saved.categoryLog || {},
      characterProgress: { ...structuredClone(defaultState.characterProgress), ...(saved.characterProgress || {}) },
      readingAiEnabled: Boolean(saved.readingAiEnabled),
      readingAudioBlob: null,
      lastReadingMetrics: saved.lastReadingMetrics || null,
      whisperEndpoint: saved.whisperEndpoint || defaultState.whisperEndpoint,
      ttsEndpoint: saved.ttsEndpoint || defaultState.ttsEndpoint,
      studyTimerStartedAt: now(),
      lessonStartedAt: now(),
      musicEnabled: false
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function normalizeAvatarState() {
  state.avatarId = avatarCharacters.some((item) => item.id === state.avatarId) ? state.avatarId : "capy";
  state.avatarFrame = frameLabels[state.avatarFrame] ? state.avatarFrame : "rainbow";
  state.avatarMood = state.avatarMood || "idle";
  state.avatarCosmetics = { ...structuredClone(defaultState.avatarCosmetics), ...(state.avatarCosmetics || {}) };
  state.characterProgress = state.characterProgress || {};
  if (state.characterProgress.capybara && !state.characterProgress.capy) {
    state.characterProgress.capy = { ...state.characterProgress.capybara };
  }
  avatarCharacters.forEach((character) => ensureCharacterProgress(character.id));
  state.avatarLv = getAvatarMilestone(state.avatarId).level;
  if (!state.avatarPhoto || String(state.avatarPhoto).includes("assets/characters/")) {
    state.avatarPhoto = "";
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function commitStudyTime() {
  if (!state.isLoggedIn) return;
  const elapsed = Math.max(0, now() - (state.studyTimerStartedAt || now()));
  if (elapsed < 1000) return;
  const key = todayKey();
  const category = getRouteStudyCategory(state.route);
  state.studyLog[key] = (state.studyLog[key] || 0) + elapsed;
  state.categoryLog[key] = state.categoryLog[key] || {};
  state.categoryLog[key][category] = (state.categoryLog[key][category] || 0) + elapsed;
  state.studyTimerStartedAt = now();
  saveState();
}

function getRouteStudyCategory(route = state.route) {
  if (["lesson", "lessons", "read"].includes(route)) return "Bài học";
  if (["game", "games"].includes(route)) return "Trò chơi";
  if (route === "chat") return "Gemini Live";
  if (route === "parent") return "Phụ huynh";
  return "Trang chủ";
}

function setRoute(route, data = {}) {
  if (state.route === route && !data.force) return;
  commitStudyTime();
  state.route = route;
  state.activeLesson = data.lessonId || state.activeLesson;
  state.currentQuestionIndex = 0;
  state.activeGame = data.gameId || state.activeGame;
  state.lessonStartedAt = now();
  saveState();
  render();
  if (route === "lesson") {
    const lesson = getActiveLesson();
    if (lesson && lesson.questions && state.currentQuestionIndex < lesson.questions.length) {
      renderQuestion();
    }
  } else if (route === "game") {
    startGame();
  } else if (route === "learning-path") {
    // Initialize learning path view
  }
}

function render() {
  commitStudyTime();
  const app = document.querySelector("#app");
  teardownAvatarStages();
  if (!state.isLoggedIn) {
    app.innerHTML = renderLogin();
    bindLogin();
    hydrateAvatarStages();
    return;
  }
  app.innerHTML = `
    <div class="page">
      ${renderTopbar()}
      <main class="main"><div class="container route-stage ${state.route === "parent" ? "parent-route-container" : ""}">${renderRoute()}</div></main>
      ${renderBottomNav()}
      ${renderLevelPrompt()}
    </div>
  `;
  bindGlobal();
  bindRoute();
  hydrateAvatarStages();
}

function renderLogin() {
  return `
    <main class="login-page page">
      <div class="login-card">
        <div class="mascot" aria-hidden="true">🤖</div>
        <h1 class="title">Học mà chơi</h1>
        <p class="subtitle">Đăng nhập nhanh để bé vào bài học. Avatar sẽ do phụ huynh chọn ở bước đầu.</p>
        <form class="form-stack" id="login-form">
          <label class="field"><span class="material-symbols-outlined">face</span><input id="name-input" type="text" autocomplete="name" placeholder="Tên của bé" value="${escapeHtml(state.name)}" /></label>
          <label class="field"><span class="material-symbols-outlined">school</span><select id="grade-input" aria-label="Lớp học">${[1, 2, 3, 4, 5].map((grade) => `<option value="${grade}" ${state.grade === grade ? "selected" : ""}>Lớp ${grade}</option>`).join("")}</select></label>
          <button class="primary-button" type="submit">Bắt đầu thôi <span class="material-symbols-outlined">rocket_launch</span></button>
        </form>
        <div class="split-actions">
          <button class="ghost-button" data-route-login="parent" type="button"><span class="material-symbols-outlined">supervisor_account</span> Phụ huynh</button>
          <button class="ghost-button" id="sample-login" type="button"><span class="material-symbols-outlined">auto_awesome</span> Dùng thử</button>
        </div>
      </div>
    </main>
  `;
}

function renderTopbar() {
  return `
    <header class="topbar">
      <div class="container topbar-inner">
        <button class="brand" data-route="dashboard" aria-label="Về trang chủ"><span class="brand-mark"><span class="material-symbols-outlined">school</span></span>Học mà chơi</button>
        <nav class="nav" aria-label="Điều hướng chính">
          ${navButton("dashboard", "home", "Trang chủ")}
          ${navButton("lessons", "extension", "Bài học")}
          ${navButton("games", "sports_esports", "Trò chơi")}
          ${navButton("read", "mic", "Gemini Đọc")}
          ${navButton("chat", "forum", "Gemini Live")}
          ${navButton("shop", "storefront", "Cửa hàng")}
          ${navButton("parent", "monitoring", "Phụ huynh")}
        </nav>
        <div class="user-strip">
          <div class="streak-pill"><span class="material-symbols-outlined">local_fire_department</span>${state.streak} ngày</div>
          <div class="coin-pill"><span class="material-symbols-outlined">monetization_on</span><span>${state.coins} Xu</span></div>
          <button class="icon-button" id="toggle-voice" title="Đổi giọng Nam/Nữ (Miền Bắc)">
            <span class="material-symbols-outlined">${state.ttsVoice === "vi-VN-HoaiMyNeural" ? "record_voice_over" : "voice_over_off"}</span>
          </button>
          <button class="icon-button ${state.musicEnabled ? "active" : ""}" id="toggle-music" title="Nhạc nền"><span class="material-symbols-outlined">music_note</span></button>
          <button class="avatar-chip topbar-avatar-chip" data-route="parent">${renderAvatarVisual("avatar")}<span>${escapeHtml(state.name)}</span>${renderTopbarAvatarPreview()}</button>
          <button class="icon-button" id="logout" title="Đăng xuất"><span class="material-symbols-outlined">logout</span></button>
        </div>
      </div>
    </header>
  `;
}

function renderTopbarAvatarPreview() {
  const character = getAvatarCharacter(state.avatarId);
  const milestone = getAvatarMilestone(state.avatarId);
  const fallback = character.image
    ? `<img src="${character.image}" alt="${escapeHtml(character.name)}" />`
    : `<span>${character.emoji}</span>`;
  const visual = character.glb
    ? `<span class="avatar-3d-stage topbar-preview-stage" data-avatar-stage data-avatar-context="topbar-preview" data-avatar-id="${character.id}" data-avatar-level="${milestone.level}" data-avatar-mood="${state.avatarMood || "idle"}" data-avatar-interactive="false" data-avatar-size="mini" data-avatar-zoom="1.16" style="--avatar-scale:${milestone.scale}"><span class="avatar-3d-fallback">${fallback}<b>Lv.${milestone.level}</b></span></span>`
    : `<span class="preview-visual">${fallback}</span>`;
  return `
    <span class="topbar-avatar-preview" aria-hidden="true">
      ${visual}
      <span class="preview-copy">
        <strong>${escapeHtml(character.name)} Lv.${milestone.level}</strong>
        <small>${escapeHtml(milestone.title)}</small>
      </span>
    </span>
  `;
}

function navButton(route, icon, label) {
  return `<button class="nav-button ${state.route === route ? "active" : ""}" data-route="${route}" data-label="${escapeHtml(label)}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}"><span class="material-symbols-outlined">${icon}</span></button>`;
}

function renderBottomNav() {
  const items = [["dashboard", "home", "Nhà"], ["lessons", "school", "Học"], ["games", "sports_esports", "Game"], ["read", "mic", "Đọc"], ["chat", "forum", "Chat"], ["shop", "storefront", "Quà"]];
  return `<nav class="bottom-nav" aria-label="Điều hướng di động">${items.map(([route, icon, label]) => `<button class="${state.route === route ? "active" : ""}" data-route="${route}"><span class="material-symbols-outlined">${icon}</span><span>${label}</span></button>`).join("")}</nav>`;
}

function renderRoute() {
  if (state.route === "lessons") return renderLessons();
  if (state.route === "lesson") return renderLesson();
  if (state.route === "games") return renderGames();
  if (state.route === "game") return renderGame();
  if (state.route === "read") return renderRead();
  if (state.route === "chat") return renderChat();
  if (state.route === "shop") return renderShop();
  if (state.route === "parent") return renderParent();
  if (state.route === "learning-path") return renderLearningPath();

  setTimeout(fetchDynamicContent, 100);
  return renderDashboard();
}

async function fetchDynamicContent() {
  if (!state.geminiApiKey) return;
  const today = new Date().toISOString().slice(0, 10);
  if (state.lastDynamicFetch === today && state.dynamicQuote && state.dynamicFact) return;

  try {
    const prompt = `Bạn là một trợ lý giáo dục cho trẻ em lớp 1. Hãy sinh ra một câu châm ngôn ngắn, vui vẻ, tạo động lực học tập cho học sinh lớp 1. Sau đó, sinh ra một sự kiện "Ngày này năm xưa" lịch sử hoặc khoa học thú vị, ngắn gọn, dễ hiểu cho trẻ em. Trả về dưới định dạng JSON: {"quote": "câu châm ngôn", "fact_title": "tiêu đề sự kiện", "fact_text": "nội dung sự kiện"}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${state.geminiApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" }
      })
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const result = JSON.parse(data.candidates[0].content.parts[0].text);
      state.dynamicQuote = result.quote;
      state.dynamicFact = { title: result.fact_title, text: result.fact_text, kind: "science" };
      state.lastDynamicFetch = today;
      saveState();
      if (state.route === "dashboard") render();
    }
  } catch (error) {
    console.error("Lỗi khi gọi LLM:", error);
  }
}

function renderDashboard() {
  const capybara = getCharacterMilestone();
  const lessonCount = Object.keys(state.lessons).length;
  const totalProgress = lessonCount > 0 ? Math.round(Object.values(state.lessons).reduce((sum, item) => sum + item.progress, 0) / lessonCount) : 0;
  const fact = state.dynamicFact || pickDaily(todayFacts, "fact");
  const quote = state.dynamicQuote || pickDaily(funQuotes, "quote");
  return `
    <section class="hero premium-hero">
      <div>
        <h1 class="title dashboard-title">
          <span>Chào ${escapeHtml(state.name)}!</span>
          <strong>Hôm nay mình học gì?</strong>
        </h1>
        <p class="subtitle dashboard-subtitle">Chọn một nhiệm vụ vui, luyện đúng lớp ${state.grade}, nhận xu và mở quà tri thức sau mỗi chặng.</p>
        <div class="stats-row">
          <div class="stat-card"><span class="material-symbols-outlined">trending_up</span><div><span>Tiến độ</span><strong>${totalProgress}%</strong></div></div>
          <div class="stat-card"><span class="material-symbols-outlined">timer</span><div><span>Hôm nay</span><strong>${formatDuration(getPeriodStudyMs("day"))}</strong></div></div>
          <div class="stat-card"><span class="material-symbols-outlined">calendar_month</span><div><span>Tuần này</span><strong>${formatDuration(getPeriodStudyMs("week"))}</strong></div></div>
          <div class="stat-card"><span class="material-symbols-outlined">workspace_premium</span><div><span>Level</span><strong>${state.contentDifficulty}</strong></div></div>
        </div>
        <div class="audio-panel">
          <button class="secondary-button" data-speech="greeting"><span class="material-symbols-outlined">volume_up</span> Nghe lời chào</button>
          <button class="primary-button" data-route="lessons"><span class="material-symbols-outlined">library_books</span> Thư viện học liệu</button>
          <button class="ghost-button" data-route="learning-path"><span class="material-symbols-outlined">map</span> Lộ trình học tập</button>
          <button class="ghost-button" id="toggle-music-hero"><span class="material-symbols-outlined">music_note</span> ${state.musicEnabled ? "Tắt nhạc nền" : "Bật nhạc nền"}</button>
          ${state.currentMelody ? `<span class="mini-pill"><span class="material-symbols-outlined">library_music</span>${escapeHtml(state.currentMelody)}</span>` : ""}
        </div>
      </div>
      <div class="hero-visual">
        ${renderAvatarStage("dashboard", "hero-avatar-stage")}
        <div class="milestone-card"><strong>${capybara.name} Lv.${capybara.level}</strong><span>${capybara.title}</span><div class="progress"><div class="progress-fill" style="width:${capybara.percent}%"></div></div></div>
      </div>
    </section>
    ${renderLearningConstellation()}
    <section class="daily-grid">
      <article class="surface-card quote-card"><span class="tag"><span class="material-symbols-outlined">format_quote</span> Câu nói vui</span><p>${escapeHtml(quote)}</p></article>
      <article class="surface-card fact-card"><img src="${getOrCreateAsset(`today-${fact.kind}`, fact.kind, fact.title)}" alt="Minh họa ${escapeHtml(fact.title)}" /><div><span class="tag"><span class="material-symbols-outlined">history_edu</span>${escapeHtml(fact.title)}</span><p>${escapeHtml(fact.text)}</p></div></article>
    </section>
    <section style="margin-top:30px"><h2 class="section-title"><span class="material-symbols-outlined">route</span> Bài học hôm nay</h2><div class="grid three">${lessonCatalog.map(renderLessonTile).join("")}</div></section>
    <section style="margin-top:30px"><h2 class="section-title"><span class="material-symbols-outlined">sports_esports</span> Trò chơi đề xuất</h2><div class="grid three">${gameCatalog.slice(0, 3).map(renderGameTile).join("")}</div></section>
  `;
}

function renderLearningConstellation() {
  const capybara = getCharacterMilestone();
  const weekTotals = getCategoryStudyTotals("week");
  const topCategory = Object.entries(weekTotals).sort((a, b) => b[1] - a[1])[0];
  return `
    <section class="learning-constellation" aria-label="Bảng tiến bộ nâng cao">
      <article class="orbit-card capybara-orbit"><span>${getAvatarCharacter(state.avatarId).emoji}</span><div><strong>${escapeHtml(capybara.name)} Lv.${capybara.level}</strong><p>${escapeHtml(capybara.title)} · ${capybara.xp || 0} XP</p><div class="progress"><div class="progress-fill" style="width:${capybara.percent}%"></div></div></div></article>
      <article class="orbit-card"><span class="material-symbols-outlined">calendar_view_week</span><div><strong>${formatDuration(getPeriodStudyMs("week"))}</strong><p>Thời gian học tuần này</p></div></article>
      <article class="orbit-card"><span class="material-symbols-outlined">auto_graph</span><div><strong>${topCategory ? escapeHtml(topCategory[0]) : "Khởi động"}</strong><p>Nhóm học nổi bật tuần này</p></div></article>
    </section>
  `;
}

function getLibraryItemGrade(item) {
  const explicit = Number(item.grade);
  if (Number.isFinite(explicit) && explicit > 0) return explicit;
  const source = `${item.id || ""} ${item.path || ""} ${item.title || ""}`;
  const match = source.match(/(?:grade|lop|lớp)[_\s-]*(\d+)/i);
  return match ? Number(match[1]) : 0;
}

function slugifyTopic(value) {
  const slug = normalizeText(value).replace(/\s+/g, "-").replace(/^-+|-+$/g, "");
  return slug || `chu-de-${now()}`;
}

function getCustomLessonId(topic, grade = state.grade) {
  const safeGrade = Math.max(1, Math.min(5, Number(grade) || 1));
  return `custom-g${safeGrade}-${slugifyTopic(topic)}`;
}

function getCustomLessonTopic(lessonId) {
  return String(lessonId || "")
    .replace(/^custom-g\d+-/, "")
    .replace(/^custom-/, "")
    .replace(/-/g, " ")
    .trim();
}

function findExistingLibraryLesson(topic, grade = state.grade) {
  const target = normalizeText(topic);
  const currentGrade = Math.max(1, Math.min(5, Number(grade) || 1));
  if (!target) return null;
  return libraryCatalog.find((item) => {
    const itemGrade = getLibraryItemGrade(item);
    if (itemGrade && itemGrade !== currentGrade) return false;
    const searchable = normalizeText([
      item.title,
      item.subject,
      item.category,
      item.desc,
      ...(Array.isArray(item.keywords) ? item.keywords : [])
    ].filter(Boolean).join(" "));
    return searchable === target || searchable.includes(target);
  }) || null;
}

function isPriorityLessonGrade(grade) {
  return PRIORITY_LESSON_GRADES.includes(Number(grade));
}

function normalizeLessonAssetPath(path, fallback = "") {
  const value = String(path || fallback || "").trim().replace(/\\/g, "/");
  if (!value) return "";
  if (/^(https?:|data:|blob:|\/)/i.test(value)) return value;
  if (value.startsWith("lessons/") || value.startsWith("assets/")) return value;
  return `lessons/${value.replace(/^\/+/, "")}`;
}

function buildLibraryItemDescription(item) {
  if (item.desc || item.description) return item.desc || item.description;
  const parts = [];
  const slideCount = Number(item.slide_count || item.slideCount || item.slides);
  if (Number.isFinite(slideCount) && slideCount > 0) parts.push(`${slideCount} slide`);
  if (item.hasAudio) parts.push("Audio");
  if (item.hasQuiz) parts.push("Quiz");
  return parts.length ? parts.join(" · ") : "Bài học HTML tương tác";
}

function normalizeLibraryCatalogItem(item = {}) {
  const id = String(item.id || item.path || item.title || "").trim();
  return {
    ...item,
    id,
    grade: getLibraryItemGrade(item),
    category: item.category || item.subject || "Khác",
    title: item.title || id.replace(/[_-]+/g, " ").trim() || "Bài học",
    desc: buildLibraryItemDescription(item),
    path: normalizeLessonAssetPath(item.path || `${id}/index.html`),
    thumbnail: normalizeLessonAssetPath(item.thumbnail || ""),
    hasAudio: Boolean(item.hasAudio),
    hasQuiz: Boolean(item.hasQuiz),
    priority: Boolean(item.priority || isPriorityLessonGrade(getLibraryItemGrade(item)))
  };
}

async function loadLibraryCatalog() {
  libraryCatalogStatus = "loading";
  libraryCatalogMessage = "Đang tải catalog bài học...";
  try {
    const response = await fetch("lessons/catalog.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const rawCatalog = await response.json();
    if (!Array.isArray(rawCatalog)) throw new Error("Catalog must be an array");
    const normalized = rawCatalog
      .map(normalizeLibraryCatalogItem)
      .filter((item) => item.id && item.path);
    if (!normalized.length) throw new Error("Catalog is empty");
    libraryCatalog = normalized;
    libraryCatalogStatus = "ready";
    libraryCatalogMessage = "";
  } catch (error) {
    console.warn("Cannot load lessons/catalog.json; using fallback catalog.", error);
    libraryCatalog = fallbackLibraryCatalog.map(normalizeLibraryCatalogItem);
    libraryCatalogStatus = "fallback";
    libraryCatalogMessage = "Không tải được lessons/catalog.json, đang dùng catalog dự phòng.";
  }
  if (state.route === "lessons") render();
}

function getGradeLibraryItems() {
  const currentGrade = Math.max(1, Math.min(5, Number(state.grade) || 1));
  const exactGradeCount = libraryCatalog.filter((item) => getLibraryItemGrade(item) === currentGrade).length;
  const includePriorityGrades = !isPriorityLessonGrade(currentGrade) && exactGradeCount < 6;
  return [...libraryCatalog]
    .filter((item) => {
      const grade = getLibraryItemGrade(item);
      return grade === currentGrade || grade === 0 || (includePriorityGrades && isPriorityLessonGrade(grade));
    })
    .sort((a, b) => {
      const aGrade = getLibraryItemGrade(a);
      const bGrade = getLibraryItemGrade(b);
      const score = (grade) => {
        if (grade === currentGrade) return 0;
        if (includePriorityGrades && isPriorityLessonGrade(grade)) return 1 + PRIORITY_LESSON_GRADES.indexOf(grade);
        if (grade === 0) return 4;
        return 5;
      };
      const scoreDiff = score(aGrade) - score(bGrade);
      if (scoreDiff) return scoreDiff;
      return (a.title || "").localeCompare(b.title || "", "vi");
    });
}

function renderLessons() {
  const gradeItems = getGradeLibraryItems();
  const catalogNotice = libraryCatalogMessage
    ? `<div class="catalog-status ${libraryCatalogStatus === "fallback" ? "warning" : ""}"><span class="material-symbols-outlined">${libraryCatalogStatus === "fallback" ? "warning" : "sync"}</span>${escapeHtml(libraryCatalogMessage)}</div>`
    : "";
  return `
    <section class="library-section">
      <header class="library-header">
        <div class="info">
          <h1 class="section-title" style="margin-bottom:8px"><span class="material-symbols-outlined">local_library</span> Thư viện học liệu lớp ${state.grade}</h1>
          <p class="subtitle">Hơn 30 bài học được thiết kế thủ công, tích hợp audio và hình ảnh sinh động.</p>
        </div>
        <button class="secondary-button" data-route="dashboard"><span class="material-symbols-outlined">arrow_back</span> Về trang chủ</button>
      </header>
      
      ${catalogNotice}
      <div class="library-grid">
        <button class="library-card ai-card" data-action="generate-custom-quiz">
          <div class="ai-glow"></div>
          <span class="cat" style="background:var(--accent);color:white">AI Đặc biệt</span>
          <h3>Tạo bài học mới</h3>
          <p>Bé muốn học về chủ đề gì? Gemini sẽ soạn riêng một bài học cho bé ngay lập tức.</p>
          <div class="visual-badge" style="position:absolute;bottom:12px;right:12px;font-size:32px">✨</div>
        </button>
        ${gradeItems.length ? gradeItems.map(renderLibraryItem).join("") : `<div class="empty library-empty">Chưa có bài học phù hợp với lớp ${state.grade} trong catalog.</div>`}
      </div>

      <div style="margin-top:60px">
        <h2 class="section-title"><span class="material-symbols-outlined">bolt</span> Bài học Gemini (Tự động)</h2>
        <p class="subtitle" style="margin-bottom:22px">Nếu nội dung chưa có trong DB, Gemini sẽ mô phỏng tạo mới theo cấp độ hiện tại.</p>
        <div class="grid three">
          ${lessonCatalog.map(renderLessonTile).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderLibraryItem(item) {
  item = normalizeLibraryCatalogItem(item);
  const thumbnail = item.thumbnail ? `<img class="library-thumb" src="${item.thumbnail}" alt="Minh họa ${escapeHtml(item.title)}" loading="lazy" />` : "";
  const quizBadge = item.hasQuiz ? `<span class="cat"><span class="material-symbols-outlined" style="font-size:16px;vertical-align:-3px">quiz</span> Quiz</span>` : "";
  const priorityBadge = item.priority ? `<span class="cat priority-cat"><span class="material-symbols-outlined" style="font-size:16px;vertical-align:-3px">priority_high</span> Ưu tiên</span>` : "";
  return `
    <a class="library-card" href="${item.path}">
      ${thumbnail}
      <span class="cat">${escapeHtml(item.category)}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.desc)}</p>
      ${priorityBadge}
      ${quizBadge}
      ${thumbnail ? "" : `<div class="visual-badge" style="position:absolute;bottom:12px;right:12px;opacity:0.2;font-size:32px">📚</div>`}
    </a>
  `;
}

function renderLessonTile(lesson) {
  const progress = state.lessons[lesson.id] || { progress: 0, stars: 0 };
  const route = lesson.id === "reading" ? "read" : "lesson";
  return `
    <button class="tile" data-lesson="${lesson.id}" data-action-route="${route}">
      <div class="stripe" style="background:${lesson.color}"></div>
      <div class="tile-body">
        <div class="tile-top"><span class="tag"><span class="material-symbols-outlined">${lesson.icon}</span>${lesson.title}</span><span>${"★".repeat(progress.stars)}${"☆".repeat(3 - progress.stars)}</span></div>
        <div class="tile-art" style="background:${lesson.color}22;color:${lesson.dark}"><img class="lesson-thumb" src="${getOrCreateAsset(`tile-${lesson.id}`, lesson.kind, lesson.title)}" alt="Minh họa ${escapeHtml(lesson.title)}" /></div>
        <h3>${lesson.title}</h3><p>${lesson.id === "reading" ? "Luyện đọc và nhận góp ý." : "Bài học ngắn có thưởng xu."}</p>
        <div><div style="display:flex;justify-content:space-between;margin-bottom:8px;color:var(--muted);font-size:14px"><span>Tiến độ</span><strong>${progress.progress}%</strong></div><div class="progress"><div class="progress-fill" style="width:${progress.progress}%;background-color:${lesson.color}"></div></div></div>
      </div>
    </button>
  `;
}

function renderLesson() {
  const lesson = getActiveLesson();
  const progress = ensureLessonProgress(lesson.id);

  let lessonData = getOrCreateGeneratedContent(lesson.id, state.contentDifficulty);

  // If content is placeholder or not specifically for this grade/difficulty, trigger async fetch
  if (lessonData.questions[0].question === "Đang tải bài học..." || lessonData.isPlaceholder) {
    fetchGeminiQuiz(lesson.id.replace("custom-", ""), state.grade, state.contentDifficulty).then(newData => {
      if (newData) {
        const attempt = state.lessonAttempts?.[lesson.id] || 0;
        const key = `${lesson.id}-grade-${state.grade}-level-${state.contentDifficulty}-attempt-${attempt}`;
        state.contentLibrary[key] = { ...newData, isPlaceholder: false };
        saveState();
        render();
      }
    });
  }

  const isCompleted = state.completedLessons[lesson.id];
  const content = lessonData.questions[state.currentQuestionIndex] || lessonData.questions[0];
  const hintCost = getLessonHintCost();
  const hintEntry = state.lessonHints?.[getLessonHintKey(lesson, content)];
  const coachFeedback = hintEntry?.text || `Bé hãy nhìn kỹ hình và chọn đáp án đúng nhé. Câu này là thử thách thứ ${state.currentQuestionIndex + 1} của bé đó!`;
  const capybara = getCharacterMilestone();
  const illustration = getQuestionIllustration(content, lesson);
  return `
    <div class="decorative-bg" aria-hidden="true">${renderFloatingDecor()}</div>
    <section class="lesson-layout lesson-enhanced">
      <div class="game-board">
        <div class="board-header">
          <button class="ghost-button" data-route="lessons"><span class="material-symbols-outlined">arrow_back</span> Quay lại</button>
          <div class="lesson-mini-stats">
            ${isCompleted ? `<button class="mini-pill success-btn" data-action="skip-lesson"><span class="material-symbols-outlined">double_arrow</span> Bỏ qua</button>` : ""}
            <div class="mini-pill"><span class="material-symbols-outlined">auto_awesome</span> Câu ${state.currentQuestionIndex + 1}/${lessonData.questions.length}</div>
            <div class="mini-pill"><span class="material-symbols-outlined">stars</span> ${progress.stars} Sao</div>
          </div>
        </div>
        <div class="prompt-card premium-card">
          <div class="study-prompt-content">
            <div class="prompt-text">
              <span class="tag" style="background:${lesson.color}22; color:${lesson.dark}">
                <span class="material-symbols-outlined">${lesson.icon}</span>${lesson.title}
              </span>
              <h1 class="title">${content.question}</h1>
              <p class="subtitle">${content.prompt}</p>
            </div>
            <div class="prompt-visual">
              <img class="study-image" src="${getOrCreateAsset(illustration.key, illustration.kind, illustration.title)}" alt="Minh họa ${escapeHtml(illustration.title)}" />
              <div class="visual-halo"></div>
            </div>
          </div>
        </div>
        <div class="answer-grid multi-choice">${content.answers.map((answer) => `<button class="answer premium-answer" data-answer="${escapeHtml(answer)}"><span>${answer}</span></button>`).join("")}</div>
      </div>
      <aside class="lesson-sidebar">
        <div class="surface-card coach-card">
          ${renderAvatarStage("lesson", "coach-avatar-stage")}
          <div class="coach-speech">
            <strong>${escapeHtml(state.name)} ơi!</strong>
            <p id="lesson-feedback">${escapeHtml(coachFeedback)}</p>
          </div>
          <button class="secondary-button" data-action="lesson-hint" style="width:100%"><span class="material-symbols-outlined">${hintEntry ? "tips_and_updates" : "auto_fix_high"}</span> ${hintEntry ? "Nghe lại gợi ý" : `Mở gợi ý -${hintCost} xu`}</button>
          <button class="ghost-button" data-speech="lessonStart" style="width:100%;margin-top:10px"><span class="material-symbols-outlined">record_voice_over</span> Nghe lời nhắc</button>
        </div>
        <div class="surface-card reward-preview">
          <h3 class="section-title" style="font-size:18px"><span class="material-symbols-outlined">card_giftcard</span> Quà hoàn thành</h3>
          <div class="coin-pill large-coin"><span class="material-symbols-outlined">monetization_on</span> +${lesson.reward} Xu</div>
          <div class="sticker-strip">${sampleStickerPreview(4).map(renderStickerChip).join("")}</div>
        </div>
      </aside>
    </section>
  `;
}

function renderGames() {
  const recommended = gameCatalog.filter(isGameRecommended);
  const others = gameCatalog.filter((game) => !isGameRecommended(game));
  return `
    <section class="hero" style="margin-bottom:28px"><div><h1 class="title">Khu trò chơi chinh phục</h1><p class="subtitle">Game phù hợp theo lớp ${state.grade}; nhân vật ảo tự điều chỉnh tốc độ theo thói quen của bé.</p></div><div class="hero-visual"><div class="buddy">🎮</div></div></section>
    <section><h2 class="section-title"><span class="material-symbols-outlined">kid_star</span> Phù hợp nhất hôm nay</h2><div class="grid three">${recommended.map(renderGameTile).join("")}</div></section>
    <section style="margin-top:30px"><h2 class="section-title"><span class="material-symbols-outlined">explore</span> Thử thách thêm</h2><div class="grid three">${others.map(renderGameTile).join("")}</div></section>
  `;
}

function renderGameTile(game) {
  const progress = state.games[game.stateKey] || { progress: 0, stars: 0, wins: 0 };
  return `
    <button class="tile game-tile" data-game="${game.id}">
      <div class="stripe" style="background:${game.color}"></div>
      <div class="tile-body">
        <div class="tile-top"><span class="tag"><span class="material-symbols-outlined">${game.icon}</span>${game.age}</span><span>${"★".repeat(progress.stars)}${"☆".repeat(3 - progress.stars)}</span></div>
        <div class="tile-art" style="background:${game.color}22;color:${game.dark}"><img class="lesson-thumb" src="${getOrCreateAsset(`game-${game.id}`, game.kind, game.title)}" alt="Minh họa ${escapeHtml(game.title)}" /></div>
        <h3>${game.title}</h3><p>${game.subtitle}</p>
        <div><div style="display:flex;justify-content:space-between;margin-bottom:8px;color:var(--muted);font-size:14px"><span>Thắng ${progress.wins || 0} lần</span><strong>+${game.reward} Xu</strong></div><div class="progress"><div class="progress-fill" style="width:${progress.progress}%;background-color:${game.color}"></div></div></div>
      </div>
    </button>
  `;
}

function renderGame() {
  const game = gameCatalog.find((item) => item.id === state.activeGame) || gameCatalog[0];
  const session = ensureGameSession(game);
  return `
    <section class="lesson-layout game-layout">
      <div class="game-board">
        <button class="ghost-button" data-route="games" style="justify-self:start"><span class="material-symbols-outlined">arrow_back</span> Về khu trò chơi</button>
        <div class="prompt-card game-prompt"><div><span class="tag"><span class="material-symbols-outlined">${game.icon}</span>${game.title}</span><h1 class="title" style="margin-top:16px">${session.prompt}</h1><p class="subtitle">${game.id === "speed-duel" ? `Miko sẽ chọn sau ${Math.round(session.aiDelay / 100) / 10} giây.` : "Quan sát kỹ rồi chọn đáp án."}</p></div><img class="study-image" src="${getOrCreateAsset(`play-${game.id}-${session.seed}`, game.kind, game.title)}" alt="Minh họa trò chơi" /></div>
        ${renderGamePlay(game, session)}
      </div>
      <aside class="surface-card">
        <h2 class="section-title" style="font-size:26px"><span class="material-symbols-outlined">emoji_events</span> Thử thách</h2>
        <p class="subtitle">${game.id === "speed-duel" ? "Miko nhanh hơn khi bé thắng nhiều và chậm lại nếu bé cần thêm thời gian." : "Hoàn thành lượt chơi để nhận xu và cơ hội mở sticker."}</p>
        <div style="margin:22px 0" class="coin-pill"><span class="material-symbols-outlined">monetization_on</span> +${game.reward} Xu</div>
        <div class="feedback">${session.feedback || "Bé hãy chọn đáp án nhé."}</div>
        ${session.result ? `<button class="primary-button" data-next-game="${game.id}" style="width:100%;margin-top:16px"><span class="material-symbols-outlined">refresh</span> Lượt mới</button>` : ""}
      </aside>
    </section>
  `;
}

function renderGamePlay(game, session) {
  if (game.id === "letter-hunt") return `<div class="letter-grid">${session.options.map((item) => `<button class="letter-cell" data-game-answer="${escapeHtml(item)}">${item}</button>`).join("")}</div>`;
  if (game.id === "speed-duel") {
    return `<div class="duel-arena"><div class="duel-player ${session.userAnswer ? "picked" : ""}"><div>🧑‍🚀</div><strong>${escapeHtml(state.name)}</strong><span>${session.userAnswer || "Đang chọn..."}</span></div><div class="duel-vs">VS</div><div class="duel-player ${session.aiAnswer ? "picked" : ""}"><div>🤖</div><strong>Miko</strong><span>${session.aiAnswer || "Đang chờ..."}</span></div></div><div class="answer-grid">${session.options.map((item) => `<button class="answer" data-speed-answer="${escapeHtml(item)}" ${session.result ? "disabled" : ""}>${item}</button>`).join("")}</div>`;
  }
  return `<div class="puzzle-visual">${session.visual}</div><div class="answer-grid">${session.options.map((item) => `<button class="answer" data-game-answer="${escapeHtml(item)}">${item}</button>`).join("")}</div>`;
}

function renderRead() {
  const passageMeta = getReadingPassageMeta();
  const aiStatus = state.readingAiEnabled ? "Faster-Whisper + Gemini" : "Chấm nhanh trên máy";
  const secondsLeft = Math.max(0, Math.ceil(((state.readingDeadline || now()) - now()) / 1000));
  const elapsed = state.recording ? Math.max(0, 30 - secondsLeft) : 0;
  const readingScore10 = state.lastReadingScore10 || 0;
  const readingPercent = Math.max(0, Math.min(100, Math.round(readingScore10 * 10)));
  const metrics = state.lastReadingMetrics;
  const metricChips = metrics
    ? `<div class="reading-metrics">
        <span><strong>${metrics.accuracy10}/10</strong> Chính xác</span>
        <span><strong>${metrics.speed10}/10</strong> Tốc độ</span>
        <span><strong>${metrics.intonation10}/10</strong> Ngữ điệu</span>
        <span><strong>${metrics.wpm}</strong> từ/phút</span>
      </div>`
    : `<div class="reading-metrics muted"><span>Điểm sẽ tính theo chính xác, tốc độ và ngữ điệu.</span></div>`;
  return `
    <section class="read-layout read-lab">
      <div><h1 class="section-title"><span class="material-symbols-outlined">auto_awesome</span> Gemini Đọc</h1><article class="reading-card ai-reading-card"><div class="read-head"><span class="tag"><span class="material-symbols-outlined">menu_book</span> Đoạn đọc lớp ${passageMeta.grade} · ${aiStatus}</span><span class="tag"><span class="material-symbols-outlined">timer</span> 30 giây luyện đọc</span></div>${renderReadingText(currentPassage)}<div class="mic-stage ${state.recording ? "is-recording" : ""}"><button class="primary-button mic-button ${state.recording ? "listening" : ""}" id="record-read"><span class="material-symbols-outlined">${state.recording ? "stop" : "mic"}</span>${state.recording ? "Dừng và chấm" : "Bắt đầu đọc"}</button><div class="countdown-ring" style="--progress:${elapsed / 30}"><strong id="reading-countdown">${secondsLeft}</strong><span>giây</span></div><div class="voice-wave"><span></span><span></span><span></span><span></span><strong>${state.recording ? "Micro đang thu âm" : "Sẵn sàng nghe giọng bé"}</strong></div></div><div class="split-actions"><button class="secondary-button" id="new-passage"><span class="material-symbols-outlined">refresh</span> Đổi đoạn</button><button class="secondary-button" id="listen-passage"><span class="material-symbols-outlined">volume_up</span> Nghe đọc mẫu</button><button class="ghost-button" id="analyze-read"><span class="material-symbols-outlined">analytics</span> Chấm lại</button></div><img class="reading-illustration" src="${getOrCreateAsset("reading-current", "book", "Gemini Đọc")}" alt="Minh họa đoạn đọc" /><label class="field" style="margin-top:16px"><span class="material-symbols-outlined">edit_note</span><textarea id="transcript-input" rows="3" lang="vi" placeholder="Transcript sẽ tự điền nếu Faster-Whisper trả kết quả; hoặc nhập câu bé đã đọc ở đây">${escapeHtml(state.transcript)}</textarea></label><p class="ai-note">Faster-Whisper: ${escapeHtml(state.whisperEndpoint)}. Gemini góp ý sâu chỉ chạy khi bật trong Góc phụ huynh.</p></article></div>
      <aside class="surface-card read-coach">${renderAvatarStage("reading", "reading-avatar-stage")}<h2 class="section-title" style="font-size:26px"><span class="material-symbols-outlined">smart_toy</span> Nhận xét</h2><div class="meter"><div style="display:flex;justify-content:space-between"><strong>Điểm đọc</strong><strong>${readingScore10}/10</strong></div><div class="progress"><div class="progress-fill" style="width:${readingPercent}%"></div></div></div>${metricChips}<div class="feedback">${escapeHtml(state.readFeedback)}</div><button class="secondary-button" data-speech="readingGuide" style="width:100%;margin-top:14px"><span class="material-symbols-outlined">record_voice_over</span> Đọc hướng dẫn</button></aside>
    </section>
  `;
}

function renderReadingText(passage) {
  const sentences = splitVietnameseSentences(passage);
  return `<div class="reading-text" lang="vi">${sentences.map((sentence) => `<span>${escapeHtml(sentence)}</span>`).join("")}</div>`;
}

function renderChat() {
  return `
    <section class="chat-panel">
      <div class="chat-header"><div class="avatar">🤖</div><div><h1 class="section-title" style="margin:0;font-size:28px">${state.chatModel} Live</h1><p class="empty">Bạn học ảo trả lời bằng tiếng Việt dễ hiểu.</p></div><label class="model-picker"><span>Mô hình</span><select id="model-select">${["Gemini", "ChatGPT", "Claude"].map((name) => `<option value="${name}" ${state.chatModel === name ? "selected" : ""}>${name}</option>`).join("")}</select></label></div>
      <div class="chat-log" id="chat-log">${state.chatMessages.map(renderMessage).join("")}</div>
      <div><div class="suggestions">${["Tại sao bầu trời màu xanh?", "Kể chuyện toán học", "Từ apple nghĩa là gì?", "Giúp mình tập đọc"].map((text) => `<button data-suggestion="${text}">${text}</button>`).join("")}</div><form class="chat-input" id="chat-form"><textarea id="chat-input" rows="1" placeholder="Nhập câu hỏi của bé..."></textarea><button class="secondary-button mic-button ${state.chatListening ? "listening" : ""}" id="chat-mic" type="button"><span class="material-symbols-outlined">${state.chatListening ? "stop" : "mic"}</span></button><button class="primary-button" type="submit"><span class="material-symbols-outlined">send</span> Gửi</button></form></div>
    </section>
  `;
}

function renderMessage(message) {
  return `<div class="message ${message.role}">${message.image ? `<img class="chat-illustration" src="${message.image}" alt="Minh họa câu trả lời" />` : ""}<div>${escapeHtml(message.text)}</div>${message.model ? `<small>${escapeHtml(message.model)}</small>` : ""}</div>`;
}

function renderShop() {
  return `<section class="hero" style="margin-bottom:28px"><div><h1 class="title">Bách hóa Kinh Bắc</h1><p class="subtitle">Cinnamoroll và Kuromi đổi xu lấy trang phục, sticker và huy hiệu cho bé.</p><div class="stats-row"><div class="coin-pill"><span class="material-symbols-outlined">monetization_on</span>${state.coins} Xu</div></div></div><div class="hero-visual"><div class="buddy">🎁</div></div></section><div class="grid three">${shopItems.map(renderShopItem).join("")}</div>`;
}

function renderShopItem(item) {
  const owned = state.purchases.includes(item.id);
  const icon = /^[a-z_]+$/.test(item.icon) ? `<span class="material-symbols-outlined">${item.icon}</span>` : item.icon;
  return `<article class="reward-card"><div class="reward-art">${icon}</div><h3>${item.title}</h3><p>${item.desc}</p><button class="${owned ? "ghost-button" : "primary-button"}" data-shop="${item.id}"><span class="material-symbols-outlined">${owned ? "check_circle" : "monetization_on"}</span>${owned ? "Đã sở hữu" : `${item.price} Xu`}</button></article>`;
}

function renderParent() {
  const summaries = [["Ngày", "day"], ["Tuần", "week"], ["Tháng", "month"]];
  const lessonRows = lessonCatalog.map((item) => row(item.title, state.lessons[item.id])).join("");
  const gameRows = gameCatalog.map((item) => row(item.title, state.games[item.stateKey], true)).join("");
  const categoryBars = renderCategoryBars();
  const capybara = getCharacterMilestone();
  return `
    <section class="parent-hero-section">
      <div class="hero-content">
        <span class="tag premium-tag"><span class="material-symbols-outlined">family_restroom</span> Góc dành cho Phụ huynh</span>
        <h1 class="hero-title">Chào ba mẹ của ${escapeHtml(state.name)}!</h1>
        <p class="hero-subtitle">Cùng theo dõi tiến trình và khuyến khích con mỗi ngày nhé.</p>
        <div class="quick-stats-row">
          ${summaries.map(([label, key]) => `
            <div class="quick-stat">
              <span>Học ${label}</span>
              <strong>${formatDuration(getPeriodStudyMs(key))}</strong>
            </div>
          `).join("")}
          <div class="quick-stat highlight">
            <span>Tích lũy</span>
            <strong>${state.coins} Xu</strong>
          </div>
        </div>
        <div class="sync-actions">
          <button class="secondary-button" id="export-data"><span class="material-symbols-outlined">download</span> Xuất dữ liệu (Lưu máy)</button>
          <button class="secondary-button" id="import-data-trigger"><span class="material-symbols-outlined">upload</span> Nhập dữ liệu (Đổi máy)</button>
          <input type="file" id="import-data-file" hidden accept=".json" />
        </div>
      </div>
      <div class="hero-illustration">
        <div class="mascot-badge">
          <div class="badge-icon">🦫</div>
          <div class="badge-text">
            <strong>${capybara.title}</strong>
            <span>Level ${capybara.level} · ${capybara.xp} XP</span>
          </div>
        </div>
      </div>
    </section>

    <div class="parent-grid-layout">
      <div class="main-column">
        <section class="surface-card parent-child-setup">
          <div class="card-header">
            <h2 class="section-title"><span class="material-symbols-outlined">child_care</span> Tài khoản & avatar của bé</h2>
            <span class="tag">Phụ huynh chọn ban đầu</span>
          </div>
          <div class="parent-config-grid">
            <div class="config-form">
              <div class="input-group"><label>Tên bé</label><div class="field"><span class="material-symbols-outlined">face</span><input id="parent-child-name" type="text" value="${escapeHtml(state.name)}" /></div></div>
              <div class="input-group"><label>Lớp</label><div class="field"><span class="material-symbols-outlined">school</span><select id="parent-child-grade">${[1, 2, 3, 4, 5].map((grade) => `<option value="${grade}" ${state.grade === grade ? "selected" : ""}>Lớp ${grade}</option>`).join("")}</select></div></div>
              <button class="primary-button" id="save-child-account" style="width:100%"><span class="material-symbols-outlined">person_add</span> Tạo / lưu tài khoản bé</button>
            </div>
            <div class="camera-panel">
              <h3>Ảnh tự chụp có khung</h3>
              <div class="frame-picker">${["rainbow", "rocket", "flower", "pet", "star"].map((frame) => `<button class="${state.avatarFrame === frame ? "active" : ""}" data-frame="${frame}">${frameLabels[frame]}</button>`).join("")}</div>
              <div class="camera-view avatar-frame frame-${state.avatarFrame}"><video id="avatar-video" playsinline muted></video><div class="camera-placeholder"><span class="material-symbols-outlined">photo_camera</span><strong>Chụp ảnh bé</strong><small>Ảnh sẽ được bo tròn và thêm khung ngộ nghĩnh.</small></div></div>
              <canvas id="avatar-canvas" hidden></canvas>
              <div class="camera-actions"><button class="secondary-button" id="start-camera"><span class="material-symbols-outlined">videocam</span> Mở camera</button><button class="primary-button" id="capture-avatar"><span class="material-symbols-outlined">camera</span> Chụp & lưu</button><label class="ghost-button"><span class="material-symbols-outlined">upload</span> Tải ảnh<input id="avatar-upload" type="file" accept="image/*" hidden /></label><button class="ghost-button" id="reset-avatar"><span class="material-symbols-outlined">view_in_ar</span> Dùng avatar 3D</button></div>
            </div>
          </div>
        </section>

        <section class="surface-card activity-overview">
          <div class="card-header">
            <h2 class="section-title"><span class="material-symbols-outlined">insights</span> Hoạt động của bé</h2>
            <div class="header-actions"><span class="tag active">Tuần này</span></div>
          </div>
          <div class="activity-content">
            <div class="chart-container">
              <h3>Thời lượng theo môn học</h3>
              ${categoryBars}
            </div>
            <div class="recent-rewards">
              <h3>Sticker mới đạt được</h3>
              <div class="sticker-mini-grid">
                ${state.stickerAwards.slice(-4).reverse().map(renderStickerCard).join("") || "<p class='empty'>Bé đang nỗ lực để nhận sticker đầu tiên!</p>"}
              </div>
              <h3 style="margin-top:18px">Hộp quà tri thức</h3>
              <div class="knowledge-gift-list">
                ${(state.knowledgeGifts || []).slice(-3).reverse().map(renderKnowledgeGiftCard).join("") || "<p class='empty'>Hoàn thành bài học để mở hộp quà tri thức.</p>"}
              </div>
            </div>
          </div>
        </section>

        <section class="surface-card">
          <h2 class="section-title"><span class="material-symbols-outlined">school</span> Chi tiết bài học</h2>
          <div class="table-container">
            <table class="parent-table">
              <thead><tr><th>Tên bài học</th><th>Tiến độ</th><th>Số sao</th><th>Trạng thái</th></tr></thead>
              <tbody>${lessonRows}</tbody>
            </table>
          </div>
        </section>

        <section class="surface-card">
          <h2 class="section-title"><span class="material-symbols-outlined">emoji_events</span> Lịch sử thành tích</h2>
          ${state.achievements && state.achievements.length > 0
      ? `<div class="achievement-list">${state.achievements.slice(0, 20).map(a => `<div class="achievement-row"><span class="material-symbols-outlined" style="color:#ffd700">star</span><div><strong>${escapeHtml(a.title)}</strong><span>Lớp ${a.grade} · +${a.xp} XP · +${a.coins} Xu</span></div><time>${escapeHtml(a.date)}</time></div>`).join('')}</div>`
      : `<p class='empty'>Bé chưa hoàn thành bài học nào. Cùng cố gắng nhé!</p>`
    }
        </section>
      </div>

      <aside class="side-column">
        <section class="surface-card ai-settings-card">
          <h2 class="section-title"><span class="material-symbols-outlined">settings_suggest</span> Cấu hình AI</h2>
          <div class="config-form">
            <div class="input-group">
              <label>Gemini API Key</label>
              <div class="field"><span class="material-symbols-outlined">key</span><input type="password" id="gemini-api-key" value="${escapeHtml(state.geminiApiKey || "")}" /></div>
            </div>
            <div class="input-group">
              <label>Whisper Endpoint</label>
              <div class="field"><span class="material-symbols-outlined">mic</span><input type="url" id="whisper-endpoint" value="${escapeHtml(state.whisperEndpoint || "")}" /></div>
            </div>
            <div class="input-group">
              <label>TTS Endpoint</label>
              <div class="field"><span class="material-symbols-outlined">campaign</span><input type="url" id="tts-endpoint" value="${escapeHtml(state.ttsEndpoint || "")}" /></div>
            </div>
            <div class="toggle-group">
              <label class="toggle-switch">
                <input type="checkbox" id="reading-ai-enabled" ${state.readingAiEnabled ? "checked" : ""} />
                <span class="slider"></span>
                <span class="label">Chấm điểm bằng AI</span>
              </label>
            </div>
            <button class="primary-button" id="save-api-key" style="width:100%">Lưu cấu hình</button>
          </div>
        </section>

        <section class="surface-card quick-links">
          <h2 class="section-title"><span class="material-symbols-outlined">stars</span> Quà tặng đề xuất</h2>
          <div class="shop-preview">
            ${shopItems.slice(0, 3).map(item => `
              <div class="preview-item">
                <span class="item-icon">${item.icon}</span>
                <div class="item-info">
                  <strong>${item.title}</strong>
                  <span>${item.price} Xu</span>
                </div>
              </div>
            `).join("")}
          </div>
        </section>
      </aside>
    </div>

    ${renderAvatarStudio()}
  `;
}

function renderCategoryBars() {
  const totals = getCategoryStudyTotals("week");
  const max = Math.max(1, ...Object.values(totals));
  return Object.entries(totals).map(([name, value]) => `
    <div class="chart-row">
      <div class="chart-label"><span>${escapeHtml(name)}</span><strong>${formatDuration(value)}</strong></div>
      <div class="chart-track"><i style="width:${Math.max(8, Math.round(value / max * 100))}%"></i></div>
    </div>
  `).join("") || "<span class='empty'>Chưa có dữ liệu tuần này.</span>";
}

function getAvatarCharacter(id = state.avatarId) {
  return avatarCharacters.find((character) => character.id === id) || avatarCharacters[0];
}

function ensureCharacterProgress(id = state.avatarId) {
  state.characterProgress = state.characterProgress || {};
  if (!state.characterProgress[id]) {
    const inherited = id === "capy" ? state.characterProgress.capybara : null;
    state.characterProgress[id] = { xp: inherited?.xp || 0, level: inherited?.level || 1, title: "Bạn đồng hành nhỏ" };
  }
  return state.characterProgress[id];
}

function getAvatarMilestone(id = state.avatarId) {
  const character = getAvatarCharacter(id);
  const progress = ensureCharacterProgress(id);
  const xp = Math.max(0, progress.xp || 0);
  const level = Math.max(1, Math.min(5, Math.floor(xp / 100) + 1));
  const stage = avatarLevelStages[level - 1] || avatarLevelStages[0];
  const title = level >= 5 ? "Sẵn sàng chinh phục mọi thử thách" : `${stage.name} · ${character.role}`;
  progress.level = level;
  progress.title = title;
  return { ...progress, name: character.name, character, level, title, percent: level >= 5 ? 100 : xp % 100, scale: stage.scale, xp };
}

function getCharacterMilestone() {
  return getAvatarMilestone(state.avatarId);
}

function getLegacyCharacterMilestone() {
  const capybara = state.characterProgress?.capybara || { xp: 0, level: 1, title: "Bạn đọc ấm áp" };
  const level = Math.max(1, Math.floor((capybara.xp || 0) / 100) + 1);
  return { ...capybara, name: "Capybara", level, percent: (capybara.xp || 0) % 100 };
}

function getCategoryStudyTotals(period = "week") {
  const start = periodStart(new Date(), period);
  return Object.entries(state.categoryLog || {}).reduce((totals, [date, categories]) => {
    if (new Date(date) < start) return totals;
    Object.entries(categories || {}).forEach(([name, value]) => {
      totals[name] = (totals[name] || 0) + value;
    });
    return totals;
  }, {});
}

function startLessonAttempt(lessonId) {
  state.activeLesson = lessonId;
  state.lessonStartedAt = now();
  state.currentQuestionIndex = 0;
  state.lessonAttempts = state.lessonAttempts || {};
  state.lessonAttempts[lessonId] = (state.lessonAttempts[lessonId] || 0) + 1;
  ensureLessonProgress(lessonId);
}

function getLessonHintCost() {
  return Number(state.grade) >= 5 ? 10 : 5;
}

function getLessonHintKey(lesson, content) {
  const questionSeed = normalizeText(content?.question || state.currentQuestionIndex);
  return `${lesson.id}|g${state.grade}|d${state.contentDifficulty}|q${state.currentQuestionIndex}|${questionSeed}`;
}

function buildLessonHintText(content) {
  const wrongAnswer = (content.answers || []).find((answer) => answer !== content.correct);
  const baseHint = content.explanation || content.prompt || "Hãy đọc kỹ từng đáp án rồi so với câu hỏi.";
  const guideName = Number(state.grade) >= 5 ? "Dơi Đêm" : "Nhện Nhí";
  const removeText = wrongAnswer ? ` Có thể loại trước đáp án "${wrongAnswer}".` : "";
  return `${guideName} gợi ý: ${baseHint}${removeText}`;
}

function requestLessonHint() {
  const lesson = getActiveLesson();
  const lessonData = getOrCreateGeneratedContent(lesson.id, state.contentDifficulty);
  const content = lessonData.questions[state.currentQuestionIndex] || lessonData.questions[0];
  if (!content) return;

  state.lessonHints = state.lessonHints || {};
  const hintKey = getLessonHintKey(lesson, content);
  const existing = state.lessonHints[hintKey];
  const hintText = existing?.text || buildLessonHintText(content);
  const feedback = document.querySelector("#lesson-feedback");

  if (!existing) {
    const cost = getLessonHintCost();
    if ((state.coins || 0) < cost) {
      showToast(`Cần ${cost} xu để mở gợi ý.`);
      return;
    }
    state.coins -= cost;
    state.lessonHints[hintKey] = { text: hintText, cost, at: now() };
    saveState();
    showToast(`Đã mở gợi ý, trừ ${cost} xu.`);
    render();
  }

  if (feedback) feedback.textContent = hintText;
  speak(hintText);
}

function buildCustomLesson(lessonId) {
  if (!lessonId || !lessonId.startsWith("custom-")) return null;
  const topicName = getCustomLessonTopic(lessonId);
  const gradeMatch = lessonId.match(/^custom-g(\d+)-/);
  const grade = gradeMatch ? Number(gradeMatch[1]) : state.grade;
  return {
    id: lessonId,
    title: topicName.charAt(0).toUpperCase() + topicName.slice(1),
    icon: "auto_awesome",
    color: "#8b5cf6",
    dark: "#4c1d95",
    reward: 50,
    kind: "custom",
    grade
  };
}

function ensureLessonProgress(lessonId) {
  state.lessons = state.lessons || {};
  if (!state.lessons[lessonId]) {
    state.lessons[lessonId] = { completed: 0, progress: 0, stars: 0, lastPlayed: 0 };
  }
  return state.lessons[lessonId];
}

function getActiveLesson() {
  return lessonCatalog.find((item) => item.id === state.activeLesson)
    || buildCustomLesson(state.activeLesson)
    || lessonCatalog[0];
}

function getPlayableLessons() {
  const standardLessons = lessonCatalog.filter((item) => item.id !== "reading");
  const customLessons = Object.keys(state.lessons || {})
    .filter((id) => id.startsWith("custom-"))
    .map(buildCustomLesson)
    .filter(Boolean);
  return [...standardLessons, ...customLessons];
}

function createCustomLessonFromPrompt() {
  const topic = window.prompt(`Bé đang học lớp ${state.grade}. Muốn tạo bài học về chủ đề gì?`)?.trim();
  if (!topic) return;

  const existingLibraryLesson = findExistingLibraryLesson(topic);
  if (existingLibraryLesson) {
    showToast("Chủ đề này đã có trong thư viện. Đang mở bài có sẵn.");
    window.location.href = existingLibraryLesson.path;
    return;
  }

  const lessonId = getCustomLessonId(topic);
  const alreadyCreated = Boolean(state.lessons?.[lessonId]);
  ensureLessonProgress(lessonId);
  startLessonAttempt(lessonId);
  saveState();
  showToast(alreadyCreated ? "Bài này đã có, mở lại để học tiếp." : `Đang tạo bài lớp ${state.grade}, không trùng chủ đề cũ.`);
  setRoute("lesson");
}

function getNextLesson(currentId) {
  const playable = getPlayableLessons();
  const index = playable.findIndex((item) => item.id === currentId);
  return playable[(index + 1 + playable.length) % playable.length] || playable[0];
}

function addCharacterXp(amount) {
  const activeProgress = ensureCharacterProgress(state.avatarId);
  activeProgress.xp = Math.max(0, (activeProgress.xp || 0) + amount);
  state.avatarLv = getAvatarMilestone(state.avatarId).level;
}

function row(title, progress = {}, game = false) {
  return `<tr><td>${title}</td><td>${progress.progress || 0}%</td><td>${game ? `${progress.wins || 0}/${progress.completed || 0}` : progress.completed || 0}</td><td>${"★".repeat(progress.stars || 0)}${"☆".repeat(3 - (progress.stars || 0))}</td></tr>`;
}

function renderAvatarStudio() {
  const activeAvatarId = state.avatarId || "capy";
  const milestone = getAvatarMilestone(activeAvatarId);
  const cosmetics = { ...defaultState.avatarCosmetics, ...(state.avatarCosmetics || {}) };
  const groups = ["hat", "outfit", "shoes", "hair", "bag", "toy"];
  return `
    <section class="surface-card avatar-studio" style="margin-top:24px">
      <div class="studio-header">
        <h2 class="section-title" style="margin-bottom:8px"><span class="material-symbols-outlined">face_6</span> Xưởng Avatar 3D</h2>
        <p class="subtitle">Nhân vật đi cùng bé suốt hành trình học. Hoàn thành bài học để tăng XP, lớn dần và mở khóa đồ mới.</p>
      </div>
      <div class="studio-layout">
        <div class="character-gallery">
          ${avatarCharacters.map((char) => {
    const progress = getAvatarMilestone(char.id);
    const preview = char.glb
      ? renderAvatarStage("card", "char-avatar-stage", char.id, { lazy: true, mini: true, interactive: false })
      : char.image
        ? `<img class="char-thumb" src="${char.image}" alt="${escapeHtml(char.name)}" loading="lazy" />`
        : `<span class="char-emoji">${char.emoji}</span>`;
    return `<button class="char-card ${activeAvatarId === char.id ? "active" : ""}" data-select-char="${char.id}">${char.glb ? `<span class="badge-3d">3D</span>` : ""}${preview}<strong>${escapeHtml(char.name)}</strong><small>Lv.${progress.level} · ${progress.xp || 0} XP</small></button>`;
  }).join("")}
        </div>
        <aside class="selection-preview">
          ${renderAvatarStage("studio", "studio-avatar-stage")}
          <div class="level-meter">
            <div><strong>${escapeHtml(milestone.name)} Lv.${milestone.level}</strong><span>${escapeHtml(milestone.title)}</span></div>
            <div class="progress"><div class="progress-fill" style="width:${milestone.percent}%"></div></div>
            <small>${milestone.level >= 5 ? "Đã đạt cấp cao nhất" : `${100 - milestone.percent} XP nữa lên cấp tiếp theo`}</small>
          </div>
          <div class="avatar-action-row">
            ${["idle", "wave", "happy", "thinking"].map((mood) => `<button class="icon-button ${state.avatarMood === mood ? "active" : ""}" data-avatar-mood="${mood}" title="${mood}"><span class="material-symbols-outlined">${mood === "wave" ? "waving_hand" : mood === "happy" ? "celebration" : mood === "thinking" ? "psychology" : "self_improvement"}</span></button>`).join("")}
          </div>
          <button class="primary-button" id="save-avatar-choice" style="width:100%; margin-top:20px"><span class="material-symbols-outlined">check_circle</span> Đồng ý chọn</button>
        </aside>
      </div>
      <div class="cosmetic-workbench">
        ${groups.map((type) => `
          <div class="cosmetic-group">
            <h3>${renderCosmeticTypeLabel(type)}</h3>
            <div class="cosmetic-options">
              ${avatarCosmeticCatalog.filter((item) => item.type === type).map((item) => {
    const locked = milestone.level < item.unlock;
    return `<button class="cosmetic-chip ${cosmetics[type] === item.id ? "active" : ""}" data-cosmetic-type="${type}" data-cosmetic-id="${item.id}" ${locked ? "disabled" : ""}><span class="material-symbols-outlined">${item.icon}</span><span>${escapeHtml(item.label)}</span>${locked ? `<small>Lv.${item.unlock}</small>` : ""}</button>`;
  }).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderAvatarVisual(className = "avatar") {
  const character = getAvatarCharacter(state.avatarId);
  const milestone = getAvatarMilestone(state.avatarId);
  if (!state.avatarPhoto) {
    const visual = character.image ? `<img src="${character.image}" alt="${escapeHtml(character.name)}" />` : `<span>${character.emoji}</span>`;
    return `<span class="${className} avatar-token">${visual}<b>Lv.${milestone.level}</b></span>`;
  }
  return `<span class="${className} avatar-frame frame-${state.avatarFrame}"><img src="${state.avatarPhoto}" alt="Avatar của ${escapeHtml(state.name)}" /></span>`;
}

function renderAvatarStage(context = "dashboard", className = "", avatarId = state.avatarId, options = {}) {
  const milestone = getAvatarMilestone(avatarId);
  const character = getAvatarCharacter(avatarId);
  const lazyAttr = options.lazy ? ` data-avatar-lazy="true"` : "";
  const sizeAttr = options.mini ? ` data-avatar-size="mini"` : "";
  const interactiveAttr = options.interactive === false ? ` data-avatar-interactive="false"` : "";
  return `
    <div class="avatar-3d-stage ${className}" data-avatar-stage${lazyAttr}${sizeAttr}${interactiveAttr} data-avatar-context="${context}" data-avatar-id="${character.id}" data-avatar-level="${milestone.level}" data-avatar-mood="${state.avatarMood || "idle"}" style="--avatar-scale:${milestone.scale}">
      <div class="avatar-3d-fallback">${character.image ? `<img src="${character.image}" alt="${escapeHtml(character.name)}" />` : `<span>${character.emoji}</span>`}<b>Lv.${milestone.level}</b></div>
    </div>
  `;
}

function renderCosmeticTypeLabel(type) {
  return ({ hat: "Mũ", outfit: "Trang phục", shoes: "Giày dép", hair: "Tóc", bag: "Cặp sách", toy: "Đồ chơi" }[type] || type);
}

function teardownAvatarStages() {
  avatarStageInstances.forEach((instance) => {
    cancelAnimationFrame(instance.frame);
    instance.resizeObserver?.disconnect();
    instance.renderer?.dispose();
    instance.scene?.traverse((item) => {
      item.geometry?.dispose?.();
      if (Array.isArray(item.material)) item.material.forEach((material) => material.dispose?.());
      else item.material?.dispose?.();
    });
  });
  avatarStageInstances = [];
}

function hydrateAvatarStages() {
  document.querySelectorAll("[data-avatar-stage]").forEach((element) => {
    if (!window.THREE) {
      element.classList.add("fallback-only");
      return;
    }
    element.classList.remove("fallback-only");
    if (element.dataset.avatarLazy === "true" && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        if (!element.dataset.avatarHydrated) {
          avatarStageInstances.push(createAvatarStage(element));
        }
      }, { rootMargin: "220px" });
      observer.observe(element);
      avatarStageInstances.push({ observer, frame: 0 });
      return;
    }
    avatarStageInstances.push(createAvatarStage(element));
  });
}

function createAvatarStage(element) {
  element.dataset.avatarHydrated = "true";
  const THREE = window.THREE;
  const scene = new THREE.Scene();
  const isMini = element.dataset.avatarSize === "mini";
  const isInteractive = element.dataset.avatarInteractive !== "false";
  const width = Math.max(isMini ? 88 : 180, element.clientWidth || (isMini ? 100 : 240));
  const height = Math.max(isMini ? 88 : 180, element.clientHeight || (isMini ? 100 : 240));
  const avatarId = element.dataset.avatarId || state.avatarId;
  const character = getAvatarCharacter(avatarId);
  const milestone = getAvatarMilestone(avatarId);
  const fallbackHtml = element.querySelector(".avatar-3d-fallback")?.outerHTML || "";
  const expectsRemoteModel = Boolean(character.glb && THREE.GLTFLoader);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(isMini ? 1.5 : 2, window.devicePixelRatio || 1));
  renderer.setSize(width, height, false);
  element.classList.toggle("is-loading", expectsRemoteModel);
  element.classList.remove("is-loaded", "load-failed");
  element.textContent = "";
  element.appendChild(renderer.domElement);
  if (expectsRemoteModel && fallbackHtml) {
    const loading = document.createElement("div");
    loading.className = "avatar-load-status";
    loading.innerHTML = `${fallbackHtml}<span class="avatar-spinner" aria-hidden="true"></span>`;
    element.appendChild(loading);
  }

  const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
  let resizeObserver = null;
  const instance = { renderer, scene, camera, element, frame: 0, mixers: [] };
  camera.position.set(0, isMini ? 1.05 : 1.2, isMini ? 5.5 : 6);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xa8d8ff, isMini ? 2.8 : 2.2));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(3, 4, 5);
  scene.add(key);

  const group = buildAvatarModel(THREE, character, milestone, state.avatarCosmetics || {}, (mixer, status = "loaded") => {
    if (mixer) instance.mixers.push(mixer);
    element.classList.remove("is-loading");
    element.classList.add(status === "fallback" ? "load-failed" : "is-loaded");
  });
  const stageZoom = Number(element.dataset.avatarZoom || 1);
  if (Number.isFinite(stageZoom) && stageZoom > 0) group.scale.multiplyScalar(stageZoom);
  scene.add(group);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.35, 0.035, 12, 80),
    new THREE.MeshStandardMaterial({ color: 0x48d5ff, transparent: true, opacity: 0.36 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -1.35;
  if (!isMini) scene.add(ring);
  const contactShadow = new THREE.Mesh(
    new THREE.CircleGeometry(1.45, 64),
    new THREE.MeshBasicMaterial({ color: 0x23485a, transparent: true, opacity: 0.12 })
  );
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = -1.42;
  contactShadow.position.z = -0.02;
  if (!isMini) scene.add(contactShadow);

  let dragging = false;
  let lastX = 0;
  let targetY = 0;
  const onDown = (event) => {
    dragging = true;
    lastX = event.clientX || event.touches?.[0]?.clientX || 0;
    element.setPointerCapture?.(event.pointerId);
  };
  const onMove = (event) => {
    if (!dragging) return;
    const x = event.clientX || event.touches?.[0]?.clientX || 0;
    targetY += (x - lastX) * 0.012;
    lastX = x;
  };
  const onUp = () => { dragging = false; };
  if (isInteractive) {
    element.addEventListener("pointerdown", onDown);
    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerup", onUp);
    element.addEventListener("pointerleave", onUp);
    element.addEventListener("dblclick", () => {
      state.avatarMood = state.avatarMood === "happy" ? "wave" : "happy";
      saveState();
    });
  }

  resizeObserver = new ResizeObserver(() => {
    const nextWidth = Math.max(isMini ? 88 : 180, element.clientWidth || width);
    const nextHeight = Math.max(isMini ? 88 : 180, element.clientHeight || height);
    camera.aspect = nextWidth / nextHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(nextWidth, nextHeight, false);
  });
  resizeObserver.observe(element);
  instance.resizeObserver = resizeObserver;

  const clock = new THREE.Clock();
  let ambientMood = "idle";
  let ambientUntil = 0;
  let nextAmbientAt = 3 + Math.random() * 4;
  const ambientMoods = ["wave", "happy", "thinking"];
  const animate = () => {
    const t = clock.getElapsedTime();
    const delta = clock.getDelta();

    if (instance.mixers) {
      instance.mixers.forEach((mixer) => mixer.update(delta));
    }

    if (!dragging && t > nextAmbientAt) {
      ambientMood = ambientMoods[Math.floor(Math.random() * ambientMoods.length)];
      ambientUntil = t + (isMini ? 1.15 : 1.8);
      nextAmbientAt = t + 6 + Math.random() * 9;
    }

    const baseMood = element.dataset.avatarMood || state.avatarMood || "idle";
    const mood = t < ambientUntil ? ambientMood : baseMood;
    const idleSpin = dragging ? 0 : Math.sin(t * 0.45) * 0.3;
    group.rotation.y += (targetY + idleSpin - group.rotation.y) * (isMini ? 0.08 : 0.06);
    group.position.y = Math.sin(t * (mood === "happy" ? 4 : 1.8)) * (mood === "happy" ? (isMini ? 0.06 : 0.1) : (isMini ? 0.025 : 0.04));
    group.rotation.z = mood === "thinking" ? Math.sin(t * 1.4) * 0.12 : 0;
    if (mood === "wave") group.rotation.x = Math.sin(t * 5) * (isMini ? 0.035 : 0.055);
    else group.rotation.x *= 0.88;
    const leftArm = group.getObjectByName("leftArm");
    const rightArm = group.getObjectByName("rightArm");
    if (rightArm) rightArm.rotation.z = mood === "wave" ? -0.8 + Math.sin(t * 8) * 0.35 : -0.18;
    if (leftArm) leftArm.rotation.z = mood === "happy" ? 0.45 + Math.sin(t * 7) * 0.2 : 0.18;
    renderer.render(scene, camera);
    instance.frame = requestAnimationFrame(animate);
  };
  animate();
  return instance;
}

function buildAvatarModel(THREE, character, milestone, cosmetics, onModelLoaded) {
  const root = new THREE.Group();
  const scale = milestone.scale || 1;
  root.scale.setScalar(scale);

  if (character.glb && THREE.GLTFLoader) {
    const loader = new THREE.GLTFLoader();
    loader.setCrossOrigin?.("anonymous");
    loader.load(character.glb, (gltf) => {
      const model = gltf.scene;

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetScale = 2.4 / maxDim;
      model.scale.setScalar(targetScale);
      model.position.sub(center.multiplyScalar(targetScale));
      model.position.y += 0.2;

      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      root.add(model);

      let mixer = null;
      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
      }
      onModelLoaded?.(mixer, "loaded");
    }, undefined, (err) => {
      console.error(`GLB Load Error: ${character.glb}`, err);
      root.add(buildProceduralModel(THREE, character, milestone, cosmetics));
      onModelLoaded?.(null, "fallback");
    });
  } else {
    root.add(buildProceduralModel(THREE, character, milestone, cosmetics));
    onModelLoaded?.(null, "fallback");
  }

  return root;
}

function buildProceduralModel(THREE, character, milestone, cosmetics) {
  if (character.id === "capy") return buildCapybaraModel(THREE, character, milestone, cosmetics);

  const root = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: character.base, roughness: 0.62, metalness: character.id === "miko" ? 0.12 : 0.02 });
  const belly = new THREE.MeshStandardMaterial({ color: character.belly, roughness: 0.7 });
  const accent = new THREE.MeshStandardMaterial({ color: character.accent, roughness: 0.45 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x182434, roughness: 0.5 });
  const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });

  const body = makeMesh(THREE, new THREE.SphereGeometry(0.92, 36, 28), skin, [0, -0.25, 0], [0.82, 1.05, 0.62]);
  root.add(body);
  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.48, 32, 24), belly, [0, -0.28, 0.48], [0.9, 0.78, 0.18]));
  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.72, 36, 28), skin, [0, 0.86, 0.05], [0.95, 0.82, 0.82]));
  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.32, 24, 18), belly, [0, 0.74, 0.62], [1.18, 0.55, 0.45]));
  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.08, 16, 12), dark, [-0.23, 0.93, 0.64]));
  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.08, 16, 12), dark, [0.23, 0.93, 0.64]));
  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.035, 12, 8), white, [-0.205, 0.96, 0.695]));
  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.035, 12, 8), white, [0.255, 0.96, 0.695]));
  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.055, 14, 10), dark, [0, 0.75, 0.91]));
  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.18, 24, 16), skin, [-0.46, 1.35, 0.02], [0.75, 0.95, 0.55]));
  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.18, 24, 16), skin, [0.46, 1.35, 0.02], [0.75, 0.95, 0.55]));

  const leftArm = makeMesh(THREE, new THREE.CapsuleGeometry(0.12, 0.62, 8, 18), skin, [-0.78, -0.2, 0.1], [1, 1, 1], [0, 0, 0.18]);
  const rightArm = makeMesh(THREE, new THREE.CapsuleGeometry(0.12, 0.62, 8, 18), skin, [0.78, -0.2, 0.1], [1, 1, 1], [0, 0, -0.18]);
  leftArm.name = "leftArm";
  rightArm.name = "rightArm";
  root.add(leftArm, rightArm);
  root.add(makeMesh(THREE, new THREE.CapsuleGeometry(0.16, 0.35, 8, 18), skin, [-0.34, -1.2, 0.12], [1, 1, 1], [0.08, 0, 0]));
  root.add(makeMesh(THREE, new THREE.CapsuleGeometry(0.16, 0.35, 8, 18), skin, [0.34, -1.2, 0.12], [1, 1, 1], [0.08, 0, 0]));

  addAvatarCosmetics(THREE, root, cosmetics, accent, dark, white);
  return root;
}

function buildCapybaraModel(THREE, character, milestone, cosmetics) {
  const root = new THREE.Group();
  const scale = milestone.scale || 1;
  root.scale.setScalar(scale);

  const fur = new THREE.MeshStandardMaterial({ color: character.base, roughness: 0.86, metalness: 0.01 });
  const furLight = new THREE.MeshStandardMaterial({ color: character.belly, roughness: 0.88 });
  const muzzleMat = new THREE.MeshStandardMaterial({ color: 0xb98658, roughness: 0.9 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1b1410, roughness: 0.62 });
  const eyeWet = new THREE.MeshStandardMaterial({ color: 0x090605, roughness: 0.18, metalness: 0.02 });
  const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.48 });
  const accent = new THREE.MeshStandardMaterial({ color: character.accent, roughness: 0.46 });

  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.88, 48, 32), fur, [0, -0.28, -0.06], [0.98, 1.02, 0.72]));
  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.62, 40, 24), furLight, [0, -0.36, 0.45], [0.9, 0.72, 0.2]));

  const head = makeMesh(THREE, new THREE.SphereGeometry(0.74, 48, 32), fur, [0, 0.78, 0.08], [1.02, 0.86, 0.82]);
  root.add(head);
  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.43, 36, 24), muzzleMat, [0, 0.62, 0.68], [1.3, 0.62, 0.74]));
  root.add(makeMesh(THREE, new THREE.BoxGeometry(0.74, 0.32, 0.24), muzzleMat, [0, 0.53, 0.88], [1, 1, 1]));
  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.13, 20, 14), dark, [0, 0.61, 1.04], [1.45, 0.7, 0.42]));
  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.024, 10, 8), white, [-0.055, 0.64, 1.13]));
  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.024, 10, 8), white, [0.055, 0.64, 1.13]));
  root.add(makeMesh(THREE, new THREE.BoxGeometry(0.26, 0.025, 0.025), dark, [0, 0.43, 1.04]));

  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.088, 18, 14), eyeWet, [-0.29, 0.88, 0.67]));
  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.088, 18, 14), eyeWet, [0.29, 0.88, 0.67]));
  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.032, 10, 8), white, [-0.26, 0.91, 0.72]));
  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.032, 10, 8), white, [0.32, 0.91, 0.72]));

  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.16, 24, 16), fur, [-0.43, 1.3, -0.02], [0.75, 0.92, 0.45], [0, 0, -0.2]));
  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.16, 24, 16), fur, [0.43, 1.3, -0.02], [0.75, 0.92, 0.45], [0, 0, 0.2]));
  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.08, 18, 12), furLight, [-0.43, 1.29, 0.03], [0.72, 0.8, 0.28]));
  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.08, 18, 12), furLight, [0.43, 1.29, 0.03], [0.72, 0.8, 0.28]));

  const leftArm = makeMesh(THREE, new THREE.CapsuleGeometry(0.13, 0.58, 10, 20), fur, [-0.72, -0.22, 0.24], [1, 1, 1], [0.05, 0, 0.18]);
  const rightArm = makeMesh(THREE, new THREE.CapsuleGeometry(0.13, 0.58, 10, 20), fur, [0.72, -0.22, 0.24], [1, 1, 1], [0.05, 0, -0.18]);
  leftArm.name = "leftArm";
  rightArm.name = "rightArm";
  root.add(leftArm, rightArm);

  root.add(makeMesh(THREE, new THREE.CapsuleGeometry(0.17, 0.36, 10, 20), fur, [-0.36, -1.18, 0.18], [1.15, 1, 1.15], [0.08, 0, 0]));
  root.add(makeMesh(THREE, new THREE.CapsuleGeometry(0.17, 0.36, 10, 20), fur, [0.36, -1.18, 0.18], [1.15, 1, 1.15], [0.08, 0, 0]));
  root.add(makeMesh(THREE, new THREE.BoxGeometry(0.34, 0.055, 0.03), dark, [-0.36, -1.45, 0.38]));
  root.add(makeMesh(THREE, new THREE.BoxGeometry(0.34, 0.055, 0.03), dark, [0.36, -1.45, 0.38]));

  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.025, 8, 6), dark, [-0.44, 0.5, 0.94]));
  root.add(makeMesh(THREE, new THREE.SphereGeometry(0.025, 8, 6), dark, [0.44, 0.5, 0.94]));

  addAvatarCosmetics(THREE, root, cosmetics, accent, dark, white);
  return root;
}

function makeMesh(THREE, geometry, material, position, scale = [1, 1, 1], rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addAvatarCosmetics(THREE, root, cosmetics, accent, dark, white) {
  if (cosmetics.outfit === "uniform") root.add(makeMesh(THREE, new THREE.SphereGeometry(0.62, 32, 18), accent, [0, -0.36, 0.34], [1.04, 0.55, 0.16]));
  if (cosmetics.outfit === "quan-ho") root.add(makeMesh(THREE, new THREE.TorusGeometry(0.58, 0.08, 12, 60), white, [0, -0.2, 0.5], [1.1, 0.72, 0.22], [0, 0, 0]));
  if (cosmetics.outfit === "hero-cape") root.add(makeMesh(THREE, new THREE.BoxGeometry(1.12, 1.05, 0.08), new THREE.MeshStandardMaterial({ color: 0xff4d6d, roughness: 0.5 }), [0, -0.28, -0.58], [1, 1, 1], [0.15, 0, 0]));
  if (cosmetics.hat === "cap") root.add(makeMesh(THREE, new THREE.CylinderGeometry(0.5, 0.55, 0.2, 32), accent, [0, 1.48, 0.05]));
  if (cosmetics.hat === "crown") root.add(makeMesh(THREE, new THREE.ConeGeometry(0.52, 0.38, 5), new THREE.MeshStandardMaterial({ color: 0xffd34d, roughness: 0.35 }), [0, 1.62, 0.02]));
  if (cosmetics.hat === "hero") root.add(makeMesh(THREE, new THREE.SphereGeometry(0.56, 32, 16), new THREE.MeshStandardMaterial({ color: 0x3366ff, roughness: 0.5 }), [0, 1.47, 0.03], [1, 0.34, 0.82]));
  if (cosmetics.hair === "tuft") root.add(makeMesh(THREE, new THREE.ConeGeometry(0.15, 0.38, 14), dark, [0, 1.6, 0.28], [1, 1, 1], [-0.2, 0, 0]));
  if (cosmetics.hair === "star") root.add(makeMesh(THREE, new THREE.TorusKnotGeometry(0.12, 0.035, 36, 8), new THREE.MeshStandardMaterial({ color: 0xffd34d, roughness: 0.38 }), [0.32, 1.43, 0.3]));
  if (cosmetics.bag === "school-bag") root.add(makeMesh(THREE, new THREE.BoxGeometry(0.36, 0.55, 0.2), new THREE.MeshStandardMaterial({ color: 0x2f80ed, roughness: 0.6 }), [-0.74, -0.3, -0.2]));
  if (cosmetics.bag === "space-bag") root.add(makeMesh(THREE, new THREE.SphereGeometry(0.25, 24, 18), new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.45 }), [-0.75, -0.28, -0.2], [1, 1.22, 0.72]));
  if (cosmetics.shoes === "sneakers" || cosmetics.shoes === "boots") {
    const mat = new THREE.MeshStandardMaterial({ color: cosmetics.shoes === "boots" ? 0x243044 : 0xffffff, roughness: 0.52 });
    root.add(makeMesh(THREE, new THREE.BoxGeometry(0.34, 0.16, 0.45), mat, [-0.34, -1.48, 0.21]));
    root.add(makeMesh(THREE, new THREE.BoxGeometry(0.34, 0.16, 0.45), mat, [0.34, -1.48, 0.21]));
  }
  if (cosmetics.toy === "pencil") root.add(makeMesh(THREE, new THREE.CylinderGeometry(0.045, 0.045, 0.95, 12), new THREE.MeshStandardMaterial({ color: 0xffb35c, roughness: 0.45 }), [0.98, -0.2, 0.34], [1, 1, 1], [0, 0, 0.95]));
  if (cosmetics.toy === "kite") root.add(makeMesh(THREE, new THREE.ConeGeometry(0.22, 0.45, 4), new THREE.MeshStandardMaterial({ color: 0xff7aa8, roughness: 0.42 }), [1.0, 0.08, 0.24], [1, 1, 1], [0, 0, 0.78]));
}

function renderStickerChip(sticker) {
  return `<span class="sticker-chip" title="${escapeHtml(sticker.theme)}"><span>${sticker.icon}</span>${escapeHtml(sticker.title)}</span>`;
}

function renderStickerCard(sticker) {
  return `<article class="sticker-card"><div>${sticker.icon}</div><strong>${escapeHtml(sticker.title)}</strong><span>${escapeHtml(sticker.theme)} · ${escapeHtml(sticker.source || "Học tập")}</span></article>`;
}

function renderLevelPrompt() {
  if (!state.levelPrompt) return "";
  return `<div class="level-modal" role="dialog" aria-live="polite"><div class="level-card"><div class="buddy" style="width:96px;font-size:48px">🚀</div><div><h2 class="section-title" style="font-size:24px;margin-bottom:8px">Bé làm rất nhanh!</h2><p>${escapeHtml(state.levelPrompt.message)}</p><div class="split-actions" style="margin-top:16px"><button class="primary-button" id="accept-level"><span class="material-symbols-outlined">trending_up</span> Thử level cao hơn</button><button class="ghost-button" id="skip-level">Để sau</button></div></div></div></div>`;
}

function bindLogin() {
  document.querySelector("#login-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    state.name = document.querySelector("#name-input").value.trim() || "Bạn nhỏ";
    state.grade = Number(document.querySelector("#grade-input").value);
    state.avatarId = pendingLoginAvatarId;
    state.avatarPhoto = "";
    normalizeAvatarState();
    currentPassage = getReadingPassageList()[0];
    state.isLoggedIn = true;
    state.route = "dashboard";
    state.studyTimerStartedAt = now();
    saveState();
    speakRandom("greeting");
    render();
  });
  document.querySelector("#sample-login")?.addEventListener("click", () => {
    state.isLoggedIn = true;
    currentPassage = getReadingPassageList()[0];
    state.studyTimerStartedAt = now();
    saveState();
    speakRandom("greeting");
    render();
  });
  document.querySelectorAll("[data-login-avatar]").forEach((button) => button.addEventListener("click", () => {
    pendingLoginAvatarId = button.dataset.loginAvatar;
    document.querySelectorAll("[data-login-avatar]").forEach((item) => item.classList.toggle("active", item === button));
  }));
  document.querySelector("[data-route-login='parent']")?.addEventListener("click", () => {
    state.isLoggedIn = true;
    state.route = "parent";
    state.studyTimerStartedAt = now();
    saveState();
    render();
  });
}

function bindGlobal() {
  document.querySelectorAll("[data-route]").forEach((button) => button.addEventListener("click", () => setRoute(button.dataset.route)));
  document.querySelector("#logout")?.addEventListener("click", () => {
    commitStudyTime();
    stopBackgroundMusic();
    state.isLoggedIn = false;
    saveState();
    render();
  });
  document.querySelector("#toggle-music")?.addEventListener("click", toggleBackgroundMusic);
  document.querySelector("#toggle-voice")?.addEventListener("click", toggleVoice);
  document.querySelector("#toggle-music-hero")?.addEventListener("click", toggleBackgroundMusic);
  document.querySelectorAll("[data-speech]").forEach((button) => button.addEventListener("click", () => speakRandom(button.dataset.speech)));
  document.querySelector("#accept-level")?.addEventListener("click", () => {
    state.contentDifficulty = Math.min(5, state.contentDifficulty + 1);
    state.level = Math.max(state.level, state.contentDifficulty);
    state.levelPrompt = null;
    saveState();
    showToast(`Đã mở nội dung level ${state.contentDifficulty}`);
    render();
  });
  document.querySelector("#skip-level")?.addEventListener("click", () => {
    state.levelPrompt = null;
    saveState();
    render();
  });
}

function bindRoute() {
  document.querySelectorAll("[data-action-route]").forEach((tile) => {
    tile.addEventListener("click", () => {
      startLessonAttempt(tile.dataset.lesson);
      setRoute(tile.dataset.actionRoute);
    });
  });
  document.querySelectorAll("[data-game]").forEach((tile) => tile.addEventListener("click", () => startGame(tile.dataset.game)));
  document.querySelectorAll("[data-answer]").forEach((button) => button.addEventListener("click", () => checkLessonAnswer(button.dataset.answer)));
  document.querySelector("[data-action='lesson-hint']")?.addEventListener("click", requestLessonHint);
  document.querySelectorAll("[data-game-answer]").forEach((button) => button.addEventListener("click", () => checkGameAnswer(button.dataset.gameAnswer)));
  document.querySelectorAll("[data-speed-answer]").forEach((button) => button.addEventListener("click", () => checkSpeedDuel(button.dataset.speedAnswer, "user")));
  document.querySelectorAll("[data-next-game]").forEach((button) => button.addEventListener("click", () => { startGame(button.dataset.nextGame, false); render(); }));
  document.querySelector("[data-action='generate-custom-quiz']")?.addEventListener("click", createCustomLessonFromPrompt);
  document.querySelector("#record-read")?.addEventListener("click", toggleReadingRecognition);
  document.querySelector("#analyze-read")?.addEventListener("click", () => {
    state.transcript = document.querySelector("#transcript-input")?.value.trim() || "";
    analyzeReading(state.transcript);
  });
  document.querySelector("#listen-passage")?.addEventListener("click", () => speak(currentPassage));
  document.querySelector("#new-passage")?.addEventListener("click", () => {
    currentPassage = getNextReadingPassage();
    state.transcript = "";
    state.lastReadingScore = 0;
    state.lastReadingScore10 = 0;
    state.lastReadingMetrics = null;
    state.readingStartedAt = 0;
    state.readFeedback = "Bấm micro và đọc đoạn văn. Bé có thể nghe mẫu trước rồi tự đọc lại.";
    state.lessonStartedAt = now();
    render();
  });
  document.querySelector("#chat-form")?.addEventListener("submit", submitChat);
  document.querySelector("#chat-mic")?.addEventListener("click", startChatVoice);
  document.querySelector("#model-select")?.addEventListener("change", (event) => {
    state.chatModel = event.target.value;
    saveState();
    render();
  });
  document.querySelectorAll("[data-suggestion]").forEach((button) => button.addEventListener("click", () => sendChat(button.dataset.suggestion)));
  document.querySelectorAll("[data-shop]").forEach((button) => button.addEventListener("click", () => buyItem(button.dataset.shop)));
  document.querySelectorAll("[data-frame]").forEach((button) => button.addEventListener("click", () => selectAvatarFrame(button.dataset.frame)));
  document.querySelector("#save-child-account")?.addEventListener("click", () => {
    state.name = document.querySelector("#parent-child-name")?.value.trim() || "Bạn nhỏ";
    state.grade = Number(document.querySelector("#parent-child-grade")?.value || state.grade || 1);
    state.isLoggedIn = true;
    saveState();
    showToast("Đã lưu tài khoản của bé!");
    render();
  });
  document.querySelector("#start-camera")?.addEventListener("click", startAvatarCamera);
  document.querySelector("#capture-avatar")?.addEventListener("click", captureAvatar);
  document.querySelector("#avatar-upload")?.addEventListener("change", handleAvatarUpload);
  document.querySelector("#reset-avatar")?.addEventListener("click", resetAvatarPhoto);
  document.querySelector("#save-api-key")?.addEventListener("click", () => {
    state.geminiApiKey = document.querySelector("#gemini-api-key").value.trim();
    state.whisperEndpoint = document.querySelector("#whisper-endpoint")?.value.trim() || state.whisperEndpoint;
    state.ttsEndpoint = document.querySelector("#tts-endpoint")?.value.trim() || state.ttsEndpoint;
    state.readingAiEnabled = Boolean(document.querySelector("#reading-ai-enabled")?.checked);
    state.lastDynamicFetch = "";
    saveState();
    showToast("Đã lưu cấu hình AI!");
    fetchDynamicContent();
  });

  // Sync actions
  document.querySelector("#export-data")?.addEventListener("click", () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `hoc_chu_data_${state.name}_${todayKey()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  });
  document.querySelector("#import-data-trigger")?.addEventListener("click", () => {
    document.querySelector("#import-data-file")?.click();
  });
  document.querySelector("#import-data-file")?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const newState = JSON.parse(event.target.result);
        if (newState && typeof newState === 'object') {
          Object.keys(newState).forEach(key => { state[key] = newState[key]; });
          saveState();
          showToast("Đã đồng bộ dữ liệu thành công!");
          render();
        }
      } catch (err) { showToast("Lỗi khi đọc tệp tin!"); }
    };
    reader.readAsText(file);
  });
  document.querySelectorAll("[data-select-char]").forEach((button) => button.addEventListener("click", () => {
    state.avatarId = button.dataset.selectChar;
    state.avatarLv = getAvatarMilestone(state.avatarId).level;
    state.avatarPhoto = "";
    saveState();
    render();
  }));
  document.querySelectorAll("[data-select-lv]").forEach((button) => button.addEventListener("click", () => {
    state.avatarLv = Number(button.dataset.selectLv);
    state.avatarPhoto = "";
    saveState();
    render();
  }));
  document.querySelectorAll("[data-avatar-mood]").forEach((button) => button.addEventListener("click", () => {
    state.avatarMood = button.dataset.avatarMood;
    saveState();
    render();
  }));
  document.querySelectorAll("[data-cosmetic-type]").forEach((button) => button.addEventListener("click", () => {
    const type = button.dataset.cosmeticType;
    const id = button.dataset.cosmeticId;
    state.avatarCosmetics = { ...defaultState.avatarCosmetics, ...(state.avatarCosmetics || {}), [type]: id };
    saveState();
    render();
  }));
  document.querySelector("#save-avatar-choice")?.addEventListener("click", () => {
    showToast("Đã lưu Avatar mới của bé!");
    setRoute("dashboard");
  });
  scheduleSpeedDuelAi();
}

function checkLessonAnswer(answer) {
  const lesson = getActiveLesson();
  const progress = ensureLessonProgress(lesson.id);
  const lessonData = getOrCreateGeneratedContent(lesson.id, state.contentDifficulty);
  const currentQ = lessonData.questions[state.currentQuestionIndex];
  const correct = answer === currentQ.correct;
  const feedback = document.querySelector("#lesson-feedback");

  if (!correct) {
    state.avatarMood = "thinking";
    saveState();
    if (feedback) feedback.textContent = `Gần đúng rồi. Đáp án đúng là ${currentQ.correct}. Bé thử lại câu này nhé!`;
    speak(`Bé ơi, đáp án đúng là ${currentQ.correct}.`);
    return;
  }

  // Correct answer - Move to next or finish
  if (state.currentQuestionIndex < lessonData.questions.length - 1) {
    state.currentQuestionIndex += 1;
    state.avatarMood = "wave";
    saveState();
    showToast("Tuyệt vời! Tiếp tục thôi!");
    speak("Đúng rồi! Câu tiếp theo nhé.");
    render();
    return;
  }

  // Lesson finished
  const elapsed = now() - state.lessonStartedAt;
  progress.completed += 1;
  progress.progress = Math.min(100, progress.progress + 20);
  progress.stars = Math.min(3, Math.max(progress.stars, progress.progress >= 90 ? 3 : progress.progress >= 60 ? 2 : 1));

  // Mark as fully completed for skip logic
  state.completedLessons[lesson.id] = true;

  const xpAwarded = state.grade >= 5 ? 50 : 25;
  const coinsAwarded = state.grade >= 5 ? lesson.reward * 2 : lesson.reward;

  state.coins += coinsAwarded;
  addCharacterXp(xpAwarded);

  // Add to achievements
  const achievement = {
    date: todayKey(),
    title: `Hoàn thành ${lesson.title}`,
    grade: state.grade,
    xp: xpAwarded,
    coins: coinsAwarded
  };
  state.achievements.unshift(achievement);
  if (state.achievements.length > 50) state.achievements.pop();

  state.avatarMood = "happy";
  const bonus = maybeAwardSticker(`Hoàn thành ${lesson.title}`);
  const knowledgeGift = maybeAwardKnowledgeGift(`Hoàn thành ${lesson.title}`);
  maybeSuggestHigherLevel(elapsed, lesson.title);
  saveState();
  showToast(`Chúc mừng! +${coinsAwarded} Xu${bonus ? ` & ${bonus.icon} ${bonus.title}` : ""}${knowledgeGift ? ` & Hộp quà: ${knowledgeGift.title}` : ""}`);
  speakRandom("praise");
  setTimeout(() => {
    const nextLesson = getNextLesson(lesson.id);
    startLessonAttempt(nextLesson.id);
    setRoute("lesson");
  }, 1500);
}

function startGame(gameId, navigate = true) {
  state.activeGame = gameId;
  state.gameSession = state.gameSession || {};
  state.gameSession[gameId] = createGameSession(gameId);
  saveState();
  speakRandom("gameStart");
  if (navigate) setRoute("game");
}

function ensureGameSession(game) {
  state.gameSession = state.gameSession || {};
  if (!state.gameSession[game.id]) state.gameSession[game.id] = createGameSession(game.id);
  return state.gameSession[game.id];
}

function createGameSession(gameId) {
  const progressKey = gameCatalog.find((item) => item.id === gameId)?.stateKey;
  const stats = progressKey ? state.games?.[progressKey] || {} : {};
  const level = getGameChallengeLevel(stats);
  const round = (stats.completed || 0) + 1;
  const seed = `${gameId}-level-${level}-round-${round}-${now()}-${Math.floor(Math.random() * 999)}`;
  const challenge = pickGameChallenge(gameId, level, seed);
  return {
    seed,
    level,
    round,
    prompt: challenge.prompt,
    visual: challenge.visual || "",
    options: shuffle(challenge.options),
    correct: challenge.correct,
    aiDelay: gameId === "speed-duel" ? getAdaptiveAiDelay(level) : undefined,
    aiAnswer: "",
    userAnswer: "",
    feedback: "",
    startedAt: now()
  };
}

function getGameChallengeLevel(stats = {}) {
  const base = Math.max(1, Math.min(5, Number(state.contentDifficulty) || 1));
  const winBoost = (stats.wins || 0) >= 10 ? 3 : (stats.wins || 0) >= 6 ? 2 : (stats.wins || 0) >= 3 ? 1 : 0;
  const playBoost = (stats.completed || 0) >= 12 ? 2 : (stats.completed || 0) >= 5 ? 1 : 0;
  const gradeBoost = state.grade >= 5 ? 2 : state.grade >= 3 ? 1 : 0;
  return Math.max(1, Math.min(5, base + winBoost + playBoost + gradeBoost));
}

function getGradeGameBanks(grade) {
  const g = Math.max(1, Math.min(5, Number(grade) || 1));
  return {
    "letter-hunt": [
      g <= 2
        ? { prompt: "Tìm chữ có dấu mũ", options: ["a", "ă", "â", "e", "i", "u"], correct: "â" }
        : g <= 3
          ? { prompt: "Từ nào viết đúng chính tả?", options: ["giành giật", "dành dật", "giành dật", "dành giật"], correct: "giành giật" }
          : g <= 4
            ? { prompt: "Từ nào là tính từ?", options: ["chạy", "đẹp", "học", "viết"], correct: "đẹp" }
            : { prompt: "Câu nào dùng quan hệ từ đúng?", options: ["Vì trời mưa nên tôi nghỉ học", "Vì tôi nghỉ học mưa trời", "Trời mưa tôi vì nghỉ học", "Nên tôi nghỉ học vì mưa"], correct: "Vì trời mưa nên tôi nghỉ học" },
      g <= 2
        ? { prompt: "Từ nào có vần 'an'?", options: ["bàn", "bút", "mèo", "gà", "xe", "lá"], correct: "bàn" }
        : g <= 3
          ? { prompt: "Từ nào là danh từ?", options: ["sách", "đọc", "nhanh", "viết"], correct: "sách" }
          : g <= 4
            ? { prompt: "Chọn từ đồng nghĩa với 'to lớn'", options: ["khổng lồ", "nhỏ bé", "thấp bé", "gầy yếu"], correct: "khổng lồ" }
            : { prompt: "Biện pháp tu từ nào được dùng: 'Mặt trời như quả cầu lửa'?", options: ["So sánh", "Nhân hóa", "Ẩn dụ", "Hoán dụ"], correct: "So sánh" },
      g <= 2
        ? { prompt: "Chọn cặp cùng âm đầu", options: ["bà - bóng", "cá - lá", "mẹ - xe", "hoa - thỏ"], correct: "bà - bóng" }
        : { prompt: "Từ nào là trái nghĩa với 'siêng năng'?", options: ["lười biếng", "chăm chỉ", "cần cù", "chịu khó"], correct: "lười biếng" },
    ],
    "speed-duel": [
      g <= 2
        ? { prompt: "Chọn phép tính bằng 8", options: ["4+4", "5+1", "9-2", "3+3"], correct: "4+4" }
        : g <= 3
          ? { prompt: "Chọn số còn thiếu: 12, 15, 18, ?", options: ["19", "20", "21", "22"], correct: "21" }
          : g <= 4
            ? { prompt: "Kết quả 125 × 4 = ?", options: ["400", "450", "500", "600"], correct: "500" }
            : { prompt: "30% của 200 là?", options: ["50", "60", "70", "80"], correct: "60" },
      g <= 2
        ? { prompt: "Chọn từ bắt đầu bằng chữ B", options: ["bóng", "áo", "cá", "mũ"], correct: "bóng" }
        : g <= 3
          ? { prompt: "Diện tích hình chữ nhật dài 6, rộng 4?", options: ["20", "22", "24", "26"], correct: "24" }
          : g <= 4
            ? { prompt: "Số nào chia hết cho cả 2 và 5?", options: ["25", "30", "35", "45"], correct: "30" }
            : { prompt: "Tỉ số của 3 và 4 viết là?", options: ["3:4", "4:3", "3/4", "4/3"], correct: "3:4" },
      g <= 2
        ? { prompt: "Chọn số còn thiếu: 3, 5, 7, ?", options: ["8", "9", "10", "11"], correct: "9" }
        : g <= 3
          ? { prompt: "Chu vi hình vuông cạnh 7cm?", options: ["21", "28", "35", "42"], correct: "28" }
          : g <= 4
            ? { prompt: "Trung bình cộng của 8, 10, 12 là?", options: ["9", "10", "11", "12"], correct: "10" }
            : { prompt: "2,5 × 4 = ?", options: ["8", "9", "10", "12"], correct: "10" },
    ],
    "number-match": [
      g <= 2
        ? { prompt: "Có mấy ngôi sao?", visual: "⭐ ⭐ ⭐ ⭐", options: ["3", "4", "5", "6"], correct: "4" }
        : g <= 3
          ? { prompt: "7 × 8 = ?", visual: "7 nhóm × 8 phần tử", options: ["54", "56", "58", "60"], correct: "56" }
          : g <= 4
            ? { prompt: "Phân số nào bằng 3/4?", visual: "□/8 = 3/4", options: ["4/8", "5/8", "6/8", "7/8"], correct: "6/8" }
            : { prompt: "0,75 = ?", visual: "Số thập phân → phân số", options: ["3/4", "7/10", "7/5", "3/5"], correct: "3/4" },
      g <= 2
        ? { prompt: "Một nửa của 18 là mấy?", visual: "18 chia đều 2 phần", options: ["6", "8", "9", "10"], correct: "9" }
        : g <= 3
          ? { prompt: "1/4 của 40 là?", visual: "40 ÷ 4", options: ["8", "10", "12", "15"], correct: "10" }
          : g <= 4
            ? { prompt: "Tìm x: 3x = 36", visual: "3 × x = 36", options: ["9", "10", "11", "12"], correct: "12" }
            : { prompt: "Diện tích hình tròn r=7 (lấy π≈3,14)?", visual: "π × r²", options: ["143,54", "153,86", "163,54", "173,86"], correct: "153,86" },
      g <= 2
        ? { prompt: "Số nào lớn hơn 36?", visual: "36 < ?", options: ["35", "37", "36", "34"], correct: "37" }
        : { prompt: "3/4 của 20 là mấy?", visual: "20 ÷ 4 × 3", options: ["12", "15", "16", "18"], correct: "15" },
    ],
    "picture-puzzle": [
      g <= 2
        ? { prompt: "Hình nào tiếp theo?", visual: "▲ ■ ▲ ■ ?", options: ["▲", "■", "●", "◆"], correct: "▲" }
        : g <= 3
          ? { prompt: "Quy luật là gì? 2, 4, 8, 16, ?", visual: "×2 mỗi bước", options: ["24", "28", "32", "36"], correct: "32" }
          : g <= 4
            ? { prompt: "Hình nào có diện tích bằng 16cm²?", visual: "HCN 4×4, HCN 2×7, HCN 3×5, HCN 5×4", options: ["HCN 4×4", "HCN 2×7", "HCN 3×5", "HCN 5×4"], correct: "HCN 4×4" }
            : { prompt: "Biểu đồ cột: tháng nào có doanh thu cao nhất?", visual: "T1:50, T2:80, T3:60, T4:90", options: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4"], correct: "Tháng 4" },
      g <= 2
        ? { prompt: "Chọn mảnh còn thiếu", visual: "🔴 🟡 🔴 🟡 ?", options: ["🔴", "🟢", "🔵", "⭐"], correct: "🔴" }
        : { prompt: "Vật nào dùng để đo thời gian?", visual: "🕰️  📚  ✏️  📐", options: ["đồng hồ", "sách", "bút chì", "thước"], correct: "đồng hồ" },
    ],
    "memory-friends": [
      g <= 2
        ? { prompt: "Biểu tượng nào xuất hiện hai lần?", visual: "🍎 🐱 🚀 🍎 🌙", options: ["🍎", "🐱", "🚀", "🌙"], correct: "🍎" }
        : g <= 3
          ? { prompt: "Thủ đô của Việt Nam là?", visual: "Bản đồ Việt Nam", options: ["Hà Nội", "Huế", "Đà Nẵng", "TP.HCM"], correct: "Hà Nội" }
          : g <= 4
            ? { prompt: "Sông nào dài nhất Việt Nam?", visual: "🗺️ Bản đồ sông ngòi", options: ["Sông Hồng", "Sông Mê Kông", "Sông Đà", "Sông Cửu Long"], correct: "Sông Mê Kông" }
            : { prompt: "Chiến dịch Điện Biên Phủ năm nào?", visual: "📅 Lịch sử Việt Nam", options: ["1952", "1953", "1954", "1955"], correct: "1954" },
      g <= 2
        ? { prompt: "Con vật nào đứng giữa?", visual: "🐢 🐸 🐦 🐱 🐶", options: ["🐦", "🐸", "🐱", "🐶"], correct: "🐦" }
        : { prompt: "Chọn thứ tự đúng đã thấy", visual: "Nhớ: A - 3 - B", options: ["A - 3 - B", "3 - A - B", "A - B - 3", "B - 3 - A"], correct: "A - 3 - B" },
    ],
  };
}

function pickGameChallenge(gameId, level, seed) {
  const banks = getGradeGameBanks(state.grade);
  const list = banks[gameId] || banks["memory-friends"];
  const available = list.slice(0, Math.max(1, Math.min(level, list.length)));
  return rotateQuestions(available, seed)[0];
}

function checkGameAnswer(answer) {
  const game = gameCatalog.find((item) => item.id === state.activeGame);
  const session = state.gameSession?.[game?.id];
  if (!game || !session || session.result) return;
  finishGameRound(game, answer === session.correct, answer === session.correct ? "Đúng rồi! Bé hoàn thành thử thách." : `Gần đúng rồi. Đáp án là ${session.correct}.`);
}

function checkSpeedDuel(answer, actor) {
  const game = gameCatalog.find((item) => item.id === "speed-duel");
  const session = state.gameSession?.["speed-duel"];
  if (!game || !session || session.result) return;
  if (actor === "ai") {
    session.aiAnswer = answer;
    if (!session.userAnswer) finishGameRound(game, false, `Miko nhanh hơn và chọn "${answer}".`);
    return;
  }
  session.userAnswer = answer;
  state.games.speedDuel.reactionAvg = Math.round(((state.games.speedDuel.reactionAvg || 2600) * 0.7) + ((now() - session.startedAt) * 0.3));
  finishGameRound(game, answer === session.correct, answer === session.correct ? "Bé nhanh hơn Miko!" : `Bé bấm nhanh rồi, nhưng đáp án đúng là ${session.correct}.`);
}

function finishGameRound(game, isWin, feedback) {
  const session = state.gameSession[game.id];
  const progress = state.games[game.stateKey];
  const elapsed = now() - session.startedAt;
  session.result = isWin ? "win" : "lose";
  session.feedback = feedback;
  state.avatarMood = isWin ? "happy" : "thinking";
  progress.completed += 1;
  if (isWin) {
    progress.wins += 1;
    progress.progress = Math.min(100, progress.progress + 16);
    progress.stars = Math.min(3, Math.max(progress.stars, progress.progress >= 90 ? 3 : progress.progress >= 55 ? 2 : 1));
    state.coins += game.reward;
    addCharacterXp(10);
    maybeSuggestHigherLevel(elapsed, game.title);
    const bonus = maybeAwardSticker(`Thắng ${game.title}`);
    const knowledgeGift = maybeAwardKnowledgeGift(`Thắng ${game.title}`);
    session.feedback = `${feedback} Bé nhận ${game.reward} xu.${bonus ? ` Sticker mới: ${bonus.title}!` : ""}${knowledgeGift ? ` Hộp quà tri thức: ${knowledgeGift.title}!` : ""}`;
  } else {
    progress.losses += 1;
    progress.progress = Math.min(100, progress.progress + 5);
  }
  saveState();
  render();
}

function scheduleSpeedDuelAi() {
  if (state.route !== "game" || state.activeGame !== "speed-duel") return;
  const session = state.gameSession?.["speed-duel"];
  if (!session || session.result || session.aiTimerSet) return;
  session.aiTimerSet = true;
  saveState();
  setTimeout(() => {
    const latest = state.gameSession?.["speed-duel"];
    if (!latest || latest.result || latest.aiAnswer || state.route !== "game") return;
    checkSpeedDuel(Math.random() > 0.18 ? latest.correct : pickRandom(latest.options.filter((item) => item !== latest.correct)), "ai");
  }, session.aiDelay);
}

async function analyzeReading(transcript) {
  const target = tokenizeVietnameseReading(currentPassage);
  const spoken = tokenizeVietnameseReading(transcript);
  const orderedMatched = longestCommonSubsequenceLength(target, spoken);
  const coverageMatched = countTokenCoverage(target, spoken);
  const accuracyPercent = transcript ? Math.round(((orderedMatched / target.length) * 0.7 + (coverageMatched / target.length) * 0.3) * 100) : 0;
  const durationSeconds = state.readingStartedAt ? Math.max(5, Math.min(30, (now() - state.readingStartedAt) / 1000)) : 30;
  const metrics = calculateReadingMetrics({ accuracyPercent, spokenCount: spoken.length, durationSeconds });
  const score = Math.round(metrics.overall10 * 10);
  const earned = score >= 90 ? 25 : score >= 70 ? 16 : score >= 40 ? 8 : 0;
  const missingWords = getMissingReadingWords(target, spoken).slice(0, 4).join(", ");
  state.lastReadingScore = score;
  state.lastReadingScore10 = metrics.overall10;
  state.lastReadingMetrics = metrics;
  state.recording = false;
  state.readingStartedAt = 0;
  state.avatarMood = score >= 70 ? "happy" : "thinking";
  if (earned) state.coins += earned;
  if (score >= 40) addCharacterXp(score >= 90 ? 18 : score >= 70 ? 12 : 6);
  state.lessons.reading.progress = Math.min(100, state.lessons.reading.progress + (score >= 70 ? 12 : 5));
  state.lessons.reading.completed += score >= 70 ? 1 : 0;
  state.lessons.reading.stars = Math.max(state.lessons.reading.stars, score >= 90 ? 3 : score >= 70 ? 2 : score >= 40 ? 1 : 0);
  if (score >= 85) maybeSuggestHigherLevel(now() - state.lessonStartedAt, "Gemini Đọc");
  if (score >= 70) maybeAwardKnowledgeGift("Luyện đọc");
  maybeAwardSticker("Luyện đọc");
  state.readFeedback = buildReadingFeedback(score, earned, missingWords, metrics);
  if (state.readingAiEnabled && state.geminiApiKey && transcript) {
    state.readFeedback = `${state.readFeedback} Đang hỏi Gemini để góp ý sâu hơn...`;
    saveState();
    render();
    const aiFeedback = await getGeminiFeedback(transcript, currentPassage, metrics);
    if (aiFeedback) state.readFeedback = aiFeedback;
  }
  saveState();
  render();
  speak(state.readFeedback);
}

async function getSpeechTranscript(audioBlob) {
  if (!state.whisperEndpoint || !audioBlob) return "";
  const form = new FormData();
  form.append("audio", audioBlob, "reading.webm");
  form.append("language", "vi");
  const response = await fetch(state.whisperEndpoint, { method: "POST", body: form });
  if (!response.ok) throw new Error(`Faster-Whisper lỗi ${response.status}`);
  const data = await response.json();
  return data.text || data.transcript || "";
}

async function getGeminiFeedback(transcript, targetText, metrics) {
  try {
    const prompt = `Bạn là giám khảo luyện đọc tiếng Việt lớp ${state.grade}, giọng Bắc chuẩn, dịu dàng. Hãy góp ý thật ngắn cho trẻ. Văn bản mục tiêu: "${targetText}". Transcript bé đọc: "${transcript}". Điểm sơ bộ theo thang 10: tổng ${metrics.overall10}/10, chính xác ${metrics.accuracy10}/10, tốc độ ${metrics.speed10}/10 (${metrics.wpm}/${metrics.targetWpm} từ/phút), ngữ điệu ước tính ${metrics.intonation10}/10. Nhận xét độ chính xác, nhịp đọc, ngữ điệu và mẹo phát âm L/N nếu cần. Trả lời 2-3 câu tiếng Việt, có khen trước.`;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${state.geminiApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    if (!response.ok) throw new Error(`Gemini lỗi ${response.status}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
  } catch (error) {
    console.error("Lỗi khi lấy góp ý đọc từ Gemini:", error);
    return "";
  }
}

async function fetchGeminiQuiz(topicId, grade, difficulty) {
  if (!state.geminiApiKey) {
    showToast("Cần lưu Gemini API key trong Góc phụ huynh để tạo bài học mới.");
    return null;
  }
  const normalizedTopic = getCustomLessonTopic(topicId) || topicId;
  topicId = normalizedTopic;
  const prompt = `Bạn là một chuyên gia giáo dục. Hãy tạo bộ 5 câu hỏi trắc nghiệm cho học sinh lớp ${grade}, chủ đề "${topicId}", độ khó ${difficulty}/5.
Trả về kết quả duy nhất dưới dạng JSON mảng các đối tượng question, mỗi đối tượng có:
- question: Câu hỏi (tiếng Việt)
- prompt: Gợi ý/mô tả ngắn (tiếng Việt)
- answers: Mảng 4 lựa chọn (tiếng Việt)
- correct: Đáp án đúng (phải trùng khớp chính xác với 1 trong các answers)
- explanation: Giải thích ngắn gọn (tiếng Việt)
- imagePrompt: Mô tả hình ảnh để minh họa (tiếng Anh)

Lưu ý: Nội dung phải phù hợp lứa tuổi, chính xác kiến thức và thú vị.`;

  try {
    const gradeGuardPrompt = `Bat buoc: noi dung phai dung chuan lop ${grade}, khong trung cau hoi, khong trung dap an, khong vuot chuong trinh lop cao hon, khong qua de nhu lop thap hon.`;
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${state.geminiApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: gradeGuardPrompt }, { text: prompt }] }] })
    });
    const data = await resp.json();
    let text = data.candidates[0].content.parts[0].text;
    // Clean JSON markdown if present
    text = text.replace(/```json|```/g, "").trim();
    const questions = JSON.parse(text);
    const seen = new Set();
    const validQuestions = questions
      .filter((q) => q && q.question && Array.isArray(q.answers) && q.answers.length >= 4 && q.correct)
      .map((q) => ({ ...q, answers: [...new Set(q.answers.map(String))].slice(0, 4), correct: String(q.correct) }))
      .filter((q) => q.answers.length === 4 && q.answers.includes(q.correct))
      .filter((q) => {
        const signature = normalizeText(q.question);
        if (seen.has(signature)) return false;
        seen.add(signature);
        return true;
      })
      .slice(0, 5);
    if (!validQuestions.length) throw new Error("Gemini returned no valid questions");
    return {
      id: topicId,
      difficulty,
      questions: validQuestions.map((q, i) => ({
        ...q,
        id: `${topicId}_gen_${Date.now()}_${i}`
      }))
    };
  } catch (err) {
    console.error("Gemini Quiz Fetch Error:", err);
    return null;
  }
}

function getOrCreateGeneratedContent(topic, difficulty) {
  state.contentLibrary = state.contentLibrary || {};
  const attempt = state.lessonAttempts?.[topic] || 0;
  const key = `${topic}-grade-${state.grade}-level-${difficulty}-attempt-${attempt}`;

  if (state.contentLibrary[key]) return state.contentLibrary[key];

  // Try the local quiz bank for standard topics before calling Gemini.
  const bank = generateGeminiContent(topic, difficulty, key);
  if (bank && bank.questions.length > 0 && !topic.startsWith("custom-")) {
    state.contentLibrary[key] = bank;
    saveState();
    return bank;
  }

  // Placeholder for custom or missing content to trigger fetchGeminiQuiz in renderLesson.
  return {
    isPlaceholder: true,
    questions: [{
      question: "Đang tải bài học...",
      prompt: "Gemini đang chuẩn bị kiến thức cho bé, đợi một chút nhé...",
      answers: ["Đang tải..."],
      correct: "Đang tải..."
    }]
  };
}

function getReadingPassageList() {
  const grade = Math.max(1, Math.min(5, Number(state.grade) || 1));
  return readingPassageLibrary[grade] || readingPassageLibrary[1];
}

function getReadingPassageMeta() {
  return {
    grade: Math.max(1, Math.min(5, Number(state.grade) || 1)),
    level: Math.max(1, Math.min(5, Number(state.contentDifficulty) || 1))
  };
}

function getNextReadingPassage() {
  const list = getReadingPassageList();
  const currentIndex = list.indexOf(currentPassage);
  return list[(currentIndex + 1 + list.length) % list.length];
}

function splitVietnameseSentences(passage) {
  return String(passage)
    .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
    ?.map((sentence) => sentence.trim())
    .filter(Boolean) || [];
}

function tokenizeVietnameseReading(value) {
  return normalizeText(value)
    .replace(/\bmot\b/g, "mot")
    .replace(/\bhai\b/g, "hai")
    .split(/\s+/)
    .filter(Boolean);
}

function longestCommonSubsequenceLength(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

function countTokenCoverage(target, spoken) {
  const counts = new Map();
  spoken.forEach((word) => counts.set(word, (counts.get(word) || 0) + 1));
  return target.reduce((total, word) => {
    const count = counts.get(word) || 0;
    if (!count) return total;
    counts.set(word, count - 1);
    return total + 1;
  }, 0);
}

function getMissingReadingWords(target, spoken) {
  const spokenSet = new Set(spoken);
  return [...new Set(target.filter((word) => !spokenSet.has(word)))];
}

function getReadingTargetWpm() {
  const grade = Math.max(1, Math.min(5, Number(state.grade) || 1));
  if (grade <= 1) return 35;
  if (grade === 2) return 50;
  if (grade === 3) return 65;
  if (grade === 4) return 75;
  return 85;
}

function scoreReadingSpeed(wpm, targetWpm) {
  if (!wpm) return 0;
  const ratio = wpm / targetWpm;
  if (ratio <= 1) return Math.max(1, Math.min(10, ratio * 10));
  return Math.max(5, 10 - ((ratio - 1) * 8));
}

function scoreReadingIntonation(transcript, accuracy10, speed10) {
  if (!transcript) return 0;
  const punctuationBonus = /[,.!?;:]/.test(transcript) ? 1 : 0;
  const balancePenalty = speed10 < 5 ? 1.2 : speed10 < 7 ? 0.6 : 0;
  return Math.max(1, Math.min(10, accuracy10 - balancePenalty + punctuationBonus));
}

function calculateReadingMetrics({ accuracyPercent, spokenCount, durationSeconds }) {
  const targetWpm = getReadingTargetWpm();
  const wpm = durationSeconds > 0 ? (spokenCount / durationSeconds) * 60 : 0;
  const accuracy10 = accuracyPercent / 10;
  const speed10 = scoreReadingSpeed(wpm, targetWpm);
  const intonation10 = scoreReadingIntonation(state.transcript, accuracy10, speed10);
  const overall10 = (accuracy10 * 0.65) + (speed10 * 0.2) + (intonation10 * 0.15);
  return {
    overall10: Math.round(overall10 * 10) / 10,
    accuracy10: Math.round(accuracy10 * 10) / 10,
    speed10: Math.round(speed10 * 10) / 10,
    intonation10: Math.round(intonation10 * 10) / 10,
    wpm: Math.round(wpm),
    targetWpm,
    durationSeconds: Math.round(durationSeconds)
  };
}

function buildReadingFeedback(score, earned, missingWords, metrics = state.lastReadingMetrics) {
  const displayScore = metrics?.overall10 ?? Math.round(score / 10);
  if (score >= 90) return `Tuyệt vời! Bé đạt ${displayScore}/10, đọc rất rõ tiếng Việt và nhận ${earned} xu.`;
  if (score >= 70) return `Làm tốt lắm! Bé đạt ${displayScore}/10 và nhận ${earned} xu. Hãy đọc chậm hơn một chút để rõ từng tiếng.`;
  if (missingWords) return `Gemini chưa nghe rõ vài tiếng: ${missingWords}. Bé thử đọc chậm, tròn tiếng hơn nhé.`;
  return "Gemini chưa nghe đủ rõ. Bé thử đọc to, chậm và rõ từng tiếng nhé.";
}

function submitChat(event) {
  event.preventDefault();
  const input = document.querySelector("#chat-input");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  sendChat(text);
}

function sendChat(text) {
  state.chatMessages.push({ role: "user", text });
  state.chatMessages.push({ role: "ai", model: state.chatModel, text: modelReply(text), image: illustrationForText(text) });
  saveState();
  render();
}

function modelReply(text) {
  const prefix = state.chatModel === "ChatGPT" ? "ChatGPT giải thích: " : state.chatModel === "Claude" ? "Claude nói nhẹ nhàng: " : "Gemini gợi ý: ";
  const normalized = normalizeText(text);
  if (normalized.includes("apple")) return `${prefix}"Apple" nghĩa là "quả táo". Bé có thể nói: I eat an apple.`;
  if (normalized.includes("bau troi")) return `${prefix}Bầu trời có màu xanh vì ánh sáng bị không khí tán xạ.`;
  if (normalized.includes("toan")) return `${prefix}Lan có 4 viên bi, Minh tặng 2 viên. 4 cộng 2 bằng 6.`;
  return `${prefix}Bé có thể hỏi về chữ cái, con số, từ vựng hoặc bài tập đọc nhé.`;
}

async function startChatVoice() {
  if (state.chatListening) {
    stopChatVoiceRecording();
    return;
  }
  if (await canUseWhisperTranscription()) {
    await startChatVoiceRecording();
    return;
  }
  await startChatSpeechRecognition();
}

async function startChatVoiceRecording() {
  try {
    const stream = await ensureMicrophoneAccess();
    const mimeType = getSupportedAudioMimeType();
    chatAudioChunks = [];
    chatRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    chatRecorder.ondataavailable = (event) => {
      if (event.data?.size) chatAudioChunks.push(event.data);
    };
    chatRecorder.onstop = transcribeChatRecording;
    state.chatListening = true;
    saveState();
    render();
    chatRecorder.start();
    chatVoiceTimer = window.setTimeout(stopChatVoiceRecording, 15000);
    showToast("Dang nghe. Bam micro lan nua de gui.");
  } catch (error) {
    state.chatListening = false;
    saveState();
    render();
    showToast(describeMicrophoneError(error));
  }
}

function stopChatVoiceRecording() {
  clearTimeout(chatVoiceTimer);
  chatVoiceTimer = null;
  if (chatRecorder?.state === "recording") chatRecorder.stop();
}

async function transcribeChatRecording() {
  const mimeType = chatRecorder?.mimeType || "audio/webm";
  const blob = new Blob(chatAudioChunks, { type: mimeType });
  chatRecorder = null;
  chatAudioChunks = [];
  state.chatListening = false;
  saveState();
  render();
  if (!blob.size) {
    showToast("Micro chua thu duoc am thanh.");
    return;
  }
  try {
    const transcript = (await getSpeechTranscript(blob)).trim();
    if (transcript) sendChat(transcript);
    else showToast("Whisper chua nghe ro. Hay noi lai cham hon.");
  } catch (error) {
    console.warn("Chat transcription failed", error);
    showToast("Khong ket noi duoc Faster-Whisper. Kiem tra tts_server.py.");
  }
}

async function startChatSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return showToast("Trình duyệt chưa hỗ trợ nhập bằng giọng nói.");
  try {
    await ensureMicrophoneAccess();
  } catch (error) {
    showToast(describeMicrophoneError(error));
    return;
  }
  const chatRecognition = new SpeechRecognition();
  chatRecognition.lang = "vi-VN";
  state.chatListening = true;
  saveState();
  render();
  chatRecognition.onresult = (event) => {
    state.chatListening = false;
    sendChat(event.results[0][0].transcript);
  };
  chatRecognition.onend = () => {
    state.chatListening = false;
    saveState();
    render();
  };
  chatRecognition.onerror = (event) => {
    state.chatListening = false;
    saveState();
    render();
    showToast(describeMicrophoneError(event?.error ? new Error(event.error) : event));
  };
  try {
    chatRecognition.start();
  } catch (error) {
    state.chatListening = false;
    saveState();
    render();
    showToast(describeMicrophoneError(error));
  }
}

function buyItem(id) {
  const item = shopItems.find((entry) => entry.id === id);
  if (!item) return;
  if (state.purchases.includes(id)) return showToast("Bé đã sở hữu vật phẩm này rồi!");
  if (state.coins < item.price) return showToast("Chưa đủ xu. Bé hãy hoàn thành thêm bài học nhé.");

  state.coins -= item.price;
  state.purchases.push(id);

  if (item.type === "avatar") {
    state.avatar = item.icon;
    showToast(`Đã thay đổi ảnh đại diện thành ${item.title}!`);
  } else if (item.type === "badge" || item.type === "sticker") {
    addStickerAward({ id: item.id, title: item.title, icon: item.icon, theme: item.type === "badge" ? "Huy hiệu" : "Sticker" }, "Cửa hàng");
    showToast(`Đã nhận ${item.title} mới!`);
  } else if (item.type === "title") {
    addStickerAward({ id: item.id, title: item.title, icon: item.icon, theme: "Danh hiệu" }, "Cửa hàng");
    showToast(`Đã nhận danh hiệu ${item.title}!`);
  }

  saveState();
  render();
}

function selectAvatarFrame(frame) {
  state.avatarFrame = frame;
  saveState();
  document.querySelectorAll("[data-frame]").forEach((button) => button.classList.toggle("active", button.dataset.frame === frame));
  document.querySelectorAll(".avatar-frame").forEach((element) => {
    element.classList.remove("frame-rainbow", "frame-rocket", "frame-flower", "frame-pet", "frame-star");
    element.classList.add(`frame-${frame}`);
  });
}

async function startAvatarCamera() {
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      showToast("Trình duyệt chưa hỗ trợ camera. Bé có thể tải ảnh lên.");
      return;
    }
    stopAvatarCamera();
    avatarStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
    const video = document.querySelector("#avatar-video");
    video.srcObject = avatarStream;
    video.parentElement.classList.add("camera-on");
    await video.play();
  } catch {
    showToast("Camera bị chặn. Hãy mở app bằng localhost hoặc dùng nút Tải ảnh.");
  }
}

function stopAvatarCamera() {
  avatarStream?.getTracks().forEach((track) => track.stop());
  avatarStream = null;
}

function captureAvatar() {
  const video = document.querySelector("#avatar-video");
  if (!video || !video.videoWidth) {
    showToast("Camera chưa sẵn sàng. Bé hãy mở camera hoặc tải ảnh lên.");
    return;
  }
  const canvas = document.querySelector("#avatar-canvas");
  drawAvatarToCanvas(canvas, video);
  state.avatarPhoto = canvas.toDataURL("image/png");
  saveState();
  stopAvatarCamera();
  showToast("Đã lưu avatar mới!");
  render();
}

function handleAvatarUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.querySelector("#avatar-canvas") || document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      drawAvatarToCanvas(canvas, image);
      state.avatarPhoto = canvas.toDataURL("image/png");
      saveState();
      showToast("Đã tạo avatar từ ảnh tải lên!");
      render();
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function drawAvatarToCanvas(canvas, source) {
  const ctx = canvas.getContext("2d");
  const size = 512;
  canvas.width = size;
  canvas.height = size;
  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, 214, 0, Math.PI * 2);
  ctx.clip();
  const sourceWidth = source.videoWidth || source.naturalWidth || source.width;
  const sourceHeight = source.videoHeight || source.naturalHeight || source.height;
  const scale = Math.max(size / sourceWidth, size / sourceHeight);
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;
  ctx.drawImage(source, (size - width) / 2, (size - height) / 2, width, height);
  ctx.restore();
  drawAvatarFrame(ctx, state.avatarFrame, size);
}

function drawAvatarFrame(ctx, frame, size) {
  ctx.lineWidth = 28;
  const colors = {
    rainbow: ["#ff6b8a", "#fdd34d", "#81c784", "#4fc3f7"],
    rocket: ["#4fc3f7", "#fdd34d", "#ff9f43"],
    flower: ["#ff6b8a", "#81c784", "#fdd34d"],
    pet: ["#c2e8ff", "#fdd34d", "#81c784"],
    star: ["#fdd34d", "#ff9f43", "#4fc3f7"]
  }[frame] || ["#4fc3f7"];
  colors.forEach((color, index) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 226 - index * 13, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.font = "48px Arial";
  const icons = frame === "rocket" ? ["🚀", "⭐"] : frame === "flower" ? ["🌸", "🌼"] : frame === "pet" ? ["🐱", "🐶"] : frame === "star" ? ["⭐", "🌟"] : ["🌈", "✨"];
  ctx.fillText(icons[0], 58, 92);
  ctx.fillText(icons[1], 400, 432);
}

function resetAvatarPhoto() {
  state.avatarPhoto = "";
  state.avatar = "🚀";
  saveState();
  stopAvatarCamera();
  render();
}

// Function was moved and unified above.

function generateGeminiContent(topic, difficulty, key) {
  const bank = {
    letters: [
      { q: "Từ nào bắt đầu bằng chữ A?", a: ["áo", "bút", "cá", "mũ"], c: "áo", p: "Nhìn hình và nhớ âm đầu của từ." },
      { q: "Chữ 'e' nằm trong từ nào?", a: ["mẹ", "lá", "xe", "cá"], c: "xe", p: "Tìm chữ e trong các từ này nhé." },
      { q: "Từ nào có vần 'an'?", a: ["bàn", "bút", "mèo", "gà"], c: "bàn", p: "Vần 'an' nghe như thế nào nhỉ?" },
      { q: "Tiếng nào có âm 'ă'?", a: ["ăn", "ca", "xe", "bố"], c: "ăn", p: "Âm ă đọc ngắn, bật nhanh." },
      { q: "Chữ nào còn thiếu trong từ 'c...'", a: ["á", "ê", "ô", "u"], c: "á", p: "Con vật bơi dưới nước: cá." },
      { q: "Từ nào có âm đầu là 'm'?", a: ["mẹ", "lá", "gà", "xe"], c: "mẹ", p: "Mờ - mẹ, miệng khép nhẹ rồi mở ra." },
      { q: "Từ nào có vần 'at'?", a: ["mát", "mèo", "bút", "hoa"], c: "mát", p: "Nghe phần cuối của tiếng: at." },
      { q: "Cặp nào cùng bắt đầu bằng chữ b?", a: ["bà - bút", "cá - cò", "mẹ - mũ", "lá - lê"], c: "bà - bút", p: "Tìm hai tiếng cùng âm đầu." }
    ],
    vocabulary: [
      { q: "\"book\" nghĩa là gì?", a: ["quyển sách", "mặt trời", "cái cây", "quả táo"], c: "quyển sách", p: "Từ vựng tiếng Anh về đồ dùng học tập." },
      { q: "\"apple\" là quả gì?", a: ["quả táo", "quả lê", "quả cam", "quả chuối"], c: "quả táo", p: "Trái cây này có màu đỏ rất đẹp." },
      { q: "\"cat\" là con vật nào?", a: ["con mèo", "con chó", "con thỏ", "con hổ"], c: "con mèo", p: "Con vật này kêu meo meo." },
      { q: "\"pen\" là đồ vật nào?", a: ["cái bút", "cái bàn", "quả bóng", "cái mũ"], c: "cái bút", p: "Đồ dùng để viết trong lớp." },
      { q: "\"red\" là màu gì?", a: ["màu đỏ", "màu xanh", "màu vàng", "màu đen"], c: "màu đỏ", p: "Màu của quả táo chín." },
      { q: "\"dog\" là con vật nào?", a: ["con chó", "con mèo", "con cá", "con chim"], c: "con chó", p: "Con vật thường sủa gâu gâu." },
      { q: "\"school\" nghĩa là gì?", a: ["trường học", "nhà bếp", "sân chơi", "cửa hàng"], c: "trường học", p: "Nơi bé học cùng cô và bạn." },
      { q: "\"bag\" là gì?", a: ["cái cặp", "cái ghế", "quả cam", "bông hoa"], c: "cái cặp", p: "Bé đựng sách vở trong đó." }
    ],
    numbers: [
      { q: "2 + 3 bằng mấy?", a: ["4", "5", "6", "7"], c: "5", p: "Đếm bằng ngón tay hoặc hình tròn." },
      { q: "Có 5 quả táo, ăn 2 quả còn mấy?", a: ["2", "3", "4", "5"], c: "3", p: "Phép trừ đơn giản cho bé." },
      { q: "Số nào lớn nhất?", a: ["3", "7", "5", "1"], c: "7", p: "So sánh các con số nhé." },
      { q: "1 + 4 bằng mấy?", a: ["3", "4", "5", "6"], c: "5", p: "Gộp một với bốn." },
      { q: "Số nào đứng sau số 8?", a: ["7", "8", "9", "10"], c: "9", p: "Đếm tiếp: 8, 9." },
      { q: "Có 4 ngôi sao, thêm 1 ngôi sao là mấy?", a: ["3", "4", "5", "6"], c: "5", p: "Thêm một là số kế tiếp." },
      { q: "Số nào bé nhất?", a: ["0", "2", "5", "9"], c: "0", p: "Số 0 là ít nhất trong các lựa chọn." },
      { q: "10 - 3 bằng mấy?", a: ["6", "7", "8", "9"], c: "7", p: "Bớt đi 3 từ 10." }
    ],
    colors: [
      { q: "Lá cây thường có màu gì?", a: ["xanh lá", "tím", "đen", "hồng"], c: "xanh lá", p: "Nhìn màu trong thiên nhiên." },
      { q: "Quả chuối chín màu gì?", a: ["vàng", "đỏ", "xanh", "tím"], c: "vàng", p: "Màu của nắng rực rỡ." },
      { q: "Bầu trời ban ngày màu gì?", a: ["xanh da trời", "đen", "trắng", "đỏ"], c: "xanh da trời", p: "Màu sắc của sự tự do." },
      { q: "Quả dâu thường có màu gì?", a: ["đỏ", "xanh", "nâu", "đen"], c: "đỏ", p: "Màu nổi bật và rực rỡ." },
      { q: "Đám mây thường có màu gì?", a: ["trắng", "đỏ", "tím", "cam"], c: "trắng", p: "Mây nhẹ bay trên trời." },
      { q: "Cỏ non có màu gì?", a: ["xanh lá", "vàng", "hồng", "đen"], c: "xanh lá", p: "Màu của cây cỏ." },
      { q: "Màu nào giống mặt trời?", a: ["vàng", "xanh", "tím", "nâu"], c: "vàng", p: "Mặt trời tỏa ánh sáng ấm áp." },
      { q: "Màu nào thường dùng để tô biển?", a: ["xanh dương", "đỏ", "vàng", "hồng"], c: "xanh dương", p: "Nước biển thường được tô màu xanh." }
    ]
  };
  const advancedBank = {
    3: {
      letters: [
        { q: "Trong câu 'Bạn Lan chăm đọc sách', từ nào chỉ hoạt động?", a: ["đọc", "Lan", "sách", "chăm"], c: "đọc", p: "Từ chỉ hoạt động thường trả lời câu hỏi làm gì." },
        { q: "Từ nào là từ chỉ đặc điểm?", a: ["xanh", "chạy", "bàn", "bạn"], c: "xanh", p: "Từ chỉ đặc điểm nói màu sắc, hình dáng hoặc tính chất." },
        { q: "Câu nào dùng dấu chấm hỏi đúng?", a: ["Bạn đi đâu?", "Bạn đi đâu.", "Bạn đi đâu!", "Bạn đi đâu,"], c: "Bạn đi đâu?", p: "Câu hỏi cần dấu chấm hỏi ở cuối câu." },
        { q: "Từ nào cùng nghĩa gần với 'siêng năng'?", a: ["chăm chỉ", "lười biếng", "vội vàng", "ồn ào"], c: "chăm chỉ", p: "Từ đồng nghĩa có nghĩa giống hoặc gần giống nhau." },
        { q: "Bộ phận nào trả lời câu hỏi 'Ai?' trong câu 'Minh tưới cây'?", a: ["Minh", "tưới", "cây", "tưới cây"], c: "Minh", p: "Chủ ngữ thường cho biết ai hoặc cái gì." },
        { q: "Từ nào viết đúng chính tả?", a: ["chăm ngoan", "trăm ngoan", "chăm ngoang", "trăm ngoang"], c: "chăm ngoan", p: "Đọc chậm từng tiếng để phân biệt ch/tr." }
      ],
      vocabulary: [
        { q: "'Library' nghĩa là gì?", a: ["thư viện", "sân chơi", "nhà bếp", "bệnh viện"], c: "thư viện", p: "Nơi có nhiều sách để đọc và mượn." },
        { q: "Câu nào giới thiệu sở thích đúng?", a: ["I like reading.", "I reading like.", "Like I reading.", "Reading like I."], c: "I like reading.", p: "Mẫu câu: I like + hoạt động." },
        { q: "'Science' là môn học nào?", a: ["Khoa học", "Âm nhạc", "Mỹ thuật", "Thể dục"], c: "Khoa học", p: "Science giúp tìm hiểu tự nhiên và đời sống." },
        { q: "Từ trái nghĩa với 'big' là gì?", a: ["small", "tall", "long", "fast"], c: "small", p: "Big là to, small là nhỏ." },
        { q: "'Good morning' dùng khi nào?", a: ["buổi sáng", "buổi tối", "khi tạm biệt", "khi xin lỗi"], c: "buổi sáng", p: "Morning là buổi sáng." }
      ],
      numbers: [
        { q: "125 + 236 bằng bao nhiêu?", a: ["361", "351", "461", "359"], c: "361", p: "Cộng theo hàng đơn vị, chục, trăm." },
        { q: "Một hình chữ nhật có chiều dài 8 cm, chiều rộng 5 cm. Chu vi là bao nhiêu?", a: ["26 cm", "40 cm", "13 cm", "30 cm"], c: "26 cm", p: "Chu vi hình chữ nhật = (dài + rộng) x 2." },
        { q: "Số liền sau của 999 là số nào?", a: ["1000", "998", "990", "1099"], c: "1000", p: "Đếm thêm 1 đơn vị." },
        { q: "6 x 7 bằng bao nhiêu?", a: ["42", "36", "48", "40"], c: "42", p: "Ôn bảng nhân 6 hoặc 7." },
        { q: "1/2 của 18 là bao nhiêu?", a: ["9", "8", "10", "12"], c: "9", p: "Một nửa là chia cho 2." }
      ],
      colors: [
        { q: "Pha màu đỏ với màu vàng thường tạo ra màu gì?", a: ["cam", "tím", "xanh lá", "đen"], c: "cam", p: "Đỏ và vàng là hai màu nóng." },
        { q: "Màu nào thường gợi cảm giác mát mẻ?", a: ["xanh dương", "đỏ", "cam", "vàng đậm"], c: "xanh dương", p: "Xanh dương liên tưởng tới nước và bầu trời." },
        { q: "Trong mỹ thuật, màu đậm nhạt giúp bức tranh như thế nào?", a: ["có chiều sâu", "mất hình", "không rõ nét", "chỉ còn một màu"], c: "có chiều sâu", p: "Đậm nhạt giúp phân biệt gần xa, sáng tối." },
        { q: "Màu bổ sung giúp hình ảnh thường trở nên thế nào?", a: ["nổi bật hơn", "mờ đi", "nhỏ lại", "biến mất"], c: "nổi bật hơn", p: "Các màu tương phản làm nhau rõ hơn." }
      ]
    },
    4: {
      letters: [
        { q: "Câu 'Dòng sông uốn lượn như dải lụa' dùng biện pháp gì?", a: ["so sánh", "nhân hóa", "liệt kê", "đảo ngữ"], c: "so sánh", p: "Từ 'như' thường xuất hiện trong phép so sánh." },
        { q: "Từ nào là danh từ?", a: ["ngôi trường", "nhanh", "chạy", "rực rỡ"], c: "ngôi trường", p: "Danh từ chỉ sự vật, người, nơi chốn, hiện tượng." },
        { q: "Trạng ngữ trong câu thường bổ sung ý gì?", a: ["thời gian, nơi chốn, nguyên nhân", "chỉ đáp án đúng", "chỉ dấu câu", "chỉ tên riêng"], c: "thời gian, nơi chốn, nguyên nhân", p: "Trạng ngữ làm rõ hoàn cảnh của sự việc." },
        { q: "Từ nào trái nghĩa với 'dũng cảm'?", a: ["nhút nhát", "can đảm", "gan dạ", "mạnh mẽ"], c: "nhút nhát", p: "Trái nghĩa là nghĩa đối lập." },
        { q: "Câu nào có hình ảnh nhân hóa?", a: ["Gió hát trên cành cây.", "Cây cao ba mét.", "Bút chì màu đỏ.", "Em đọc sách."], c: "Gió hát trên cành cây.", p: "Nhân hóa làm sự vật có hoạt động như con người." }
      ],
      vocabulary: [
        { q: "'Environment' nghĩa là gì?", a: ["môi trường", "thời khóa biểu", "thư viện", "bài kiểm tra"], c: "môi trường", p: "Từ này thường đi với chủ đề bảo vệ thiên nhiên." },
        { q: "Câu nào nói về thời tiết đúng?", a: ["It is cloudy today.", "Cloudy it today is.", "Today cloudy is it.", "It cloudy today."], c: "It is cloudy today.", p: "Mẫu câu: It is + tính từ thời tiết." },
        { q: "'Recycle' nghĩa là gì?", a: ["tái chế", "vứt bỏ", "đốt cháy", "lãng phí"], c: "tái chế", p: "Hành động dùng lại vật liệu để giảm rác." },
        { q: "Từ nào là động từ chỉ hoạt động học tập?", a: ["practice", "green", "chair", "short"], c: "practice", p: "Practice nghĩa là luyện tập." },
        { q: "'How often...?' dùng để hỏi về điều gì?", a: ["tần suất", "màu sắc", "giá tiền", "địa điểm"], c: "tần suất", p: "Ví dụ: How often do you read?" }
      ],
      numbers: [
        { q: "3/4 của 40 là bao nhiêu?", a: ["30", "20", "25", "35"], c: "30", p: "Tính 40 chia 4 rồi nhân 3." },
        { q: "Diện tích hình chữ nhật dài 12 cm, rộng 5 cm là bao nhiêu?", a: ["60 cm²", "34 cm²", "17 cm²", "120 cm²"], c: "60 cm²", p: "Diện tích = dài x rộng." },
        { q: "Số 45 608 đọc là gì?", a: ["bốn mươi lăm nghìn sáu trăm linh tám", "bốn nghìn năm trăm sáu mươi tám", "bốn mươi lăm nghìn sáu mươi tám", "bốn trăm năm mươi sáu nghìn tám"], c: "bốn mươi lăm nghìn sáu trăm linh tám", p: "Tách lớp nghìn và lớp đơn vị." },
        { q: "2 giờ 15 phút bằng bao nhiêu phút?", a: ["135 phút", "125 phút", "115 phút", "150 phút"], c: "135 phút", p: "1 giờ = 60 phút." },
        { q: "Số nào chia hết cho 5?", a: ["235", "232", "234", "236"], c: "235", p: "Số chia hết cho 5 có chữ số tận cùng là 0 hoặc 5." }
      ],
      colors: [
        { q: "Màu nóng thường gồm nhóm nào?", a: ["đỏ, cam, vàng", "xanh, tím, đen", "trắng, xám, xanh", "nâu, đen, trắng"], c: "đỏ, cam, vàng", p: "Màu nóng gợi cảm giác ấm áp, rực rỡ." },
        { q: "Muốn vẽ vật ở xa, màu sắc thường nên như thế nào?", a: ["nhạt và ít chi tiết hơn", "đậm nhất bức tranh", "to hơn vật gần", "chỉ dùng màu đen"], c: "nhạt và ít chi tiết hơn", p: "Xa gần trong tranh liên quan đến độ đậm nhạt và chi tiết." },
        { q: "Sắc độ là gì?", a: ["độ đậm nhạt của màu", "tên của màu", "kích thước hình", "chất liệu giấy"], c: "độ đậm nhạt của màu", p: "Cùng một màu có thể đậm hoặc nhạt." },
        { q: "Màu xanh lá thường liên tưởng tới điều gì?", a: ["thiên nhiên", "lửa", "kim loại", "bóng tối"], c: "thiên nhiên", p: "Xanh lá xuất hiện nhiều ở cây cỏ." }
      ]
    },
    5: {
      letters: [
        { q: "Trong câu ghép, các vế câu thường nối với nhau bằng gì?", a: ["quan hệ từ hoặc dấu câu", "chỉ danh từ", "chỉ số đếm", "chỉ màu sắc"], c: "quan hệ từ hoặc dấu câu", p: "Câu ghép có từ hai cụm chủ vị trở lên." },
        { q: "Cặp quan hệ từ nào biểu thị nguyên nhân - kết quả?", a: ["vì... nên...", "tuy... nhưng...", "nếu... thì...", "không những... mà còn..."], c: "vì... nên...", p: "Nguyên nhân thường đứng sau 'vì'." },
        { q: "Từ 'truyền thống' gần nghĩa nhất với từ nào?", a: ["nếp tốt đẹp lâu đời", "đồ vật mới mua", "cơn mưa lớn", "một trò chơi"], c: "nếp tốt đẹp lâu đời", p: "Truyền thống được giữ gìn qua nhiều thế hệ." },
        { q: "Câu nào dùng dấu phẩy để ngăn cách trạng ngữ?", a: ["Sáng nay, chúng em đi tham quan.", "Sáng nay chúng, em đi tham quan.", "Sáng, nay chúng em đi tham quan.", "Sáng nay chúng em, đi tham quan."], c: "Sáng nay, chúng em đi tham quan.", p: "Trạng ngữ đầu câu thường được ngăn bằng dấu phẩy." },
        { q: "Biện pháp nào làm câu 'Mặt trời mỉm cười sau rặng núi' sinh động?", a: ["nhân hóa", "so sánh", "liệt kê", "nói quá"], c: "nhân hóa", p: "Mặt trời được gán hành động của con người." }
      ],
      vocabulary: [
        { q: "'Population' nghĩa là gì?", a: ["dân số", "nhiệt độ", "năng lượng", "bản đồ"], c: "dân số", p: "Từ này thường dùng trong địa lí." },
        { q: "Câu nào hỏi đường đúng?", a: ["How can I get to the museum?", "How I can get museum?", "Can how get to museum?", "I how get to museum?"], c: "How can I get to the museum?", p: "Mẫu hỏi đường: How can I get to...?" },
        { q: "'Energy' nghĩa là gì?", a: ["năng lượng", "lịch sử", "thói quen", "thư viện"], c: "năng lượng", p: "Energy liên quan đến điện, nhiệt, ánh sáng, chuyển động." },
        { q: "Từ nào phù hợp với chủ đề bảo vệ môi trường?", a: ["reduce", "forget", "borrow", "decorate"], c: "reduce", p: "Reduce nghĩa là giảm bớt." },
        { q: "'Past simple' thường dùng để nói về điều gì?", a: ["việc đã xảy ra", "việc đang xảy ra", "màu sắc", "sở hữu"], c: "việc đã xảy ra", p: "Quá khứ đơn thường đi với yesterday, last week..." }
      ],
      numbers: [
        { q: "15% của 200 là bao nhiêu?", a: ["30", "15", "20", "45"], c: "30", p: "15% = 15/100, lấy 200 x 15/100." },
        { q: "0,75 viết dưới dạng phân số tối giản là gì?", a: ["3/4", "1/2", "7/5", "75/10"], c: "3/4", p: "0,75 = 75/100 = 3/4." },
        { q: "Một ô tô đi 150 km trong 3 giờ. Vận tốc là bao nhiêu?", a: ["50 km/giờ", "45 km/giờ", "150 km/giờ", "30 km/giờ"], c: "50 km/giờ", p: "Vận tốc = quãng đường : thời gian." },
        { q: "Diện tích hình tam giác có đáy 10 cm, chiều cao 6 cm là bao nhiêu?", a: ["30 cm²", "60 cm²", "16 cm²", "20 cm²"], c: "30 cm²", p: "Diện tích tam giác = đáy x chiều cao : 2." },
        { q: "2,4 + 3,75 bằng bao nhiêu?", a: ["6,15", "5,79", "6,05", "5,15"], c: "6,15", p: "Đặt thẳng hàng dấu phẩy khi cộng số thập phân." }
      ],
      colors: [
        { q: "Trong thiết kế, tương phản màu giúp điều gì?", a: ["làm nội dung nổi bật", "xóa hết bố cục", "làm chữ nhỏ đi", "biến tranh thành đen trắng"], c: "làm nội dung nổi bật", p: "Tương phản giúp người xem dễ nhận ra điểm chính." },
        { q: "Bảng màu hài hòa nên được chọn như thế nào?", a: ["có màu chủ đạo và màu nhấn hợp lý", "dùng thật nhiều màu ngẫu nhiên", "chỉ dùng một màu cho mọi thứ", "không cần xét mục đích"], c: "có màu chủ đạo và màu nhấn hợp lý", p: "Màu chủ đạo tạo sự thống nhất, màu nhấn tạo điểm nhìn." },
        { q: "Màu trung tính gồm nhóm nào?", a: ["trắng, đen, xám", "đỏ, cam, vàng", "xanh, tím, lục", "hồng, đỏ, cam"], c: "trắng, đen, xám", p: "Màu trung tính dễ phối với các màu khác." },
        { q: "Khi làm poster học tập, màu chữ cần như thế nào so với nền?", a: ["đủ tương phản để dễ đọc", "giống hệt màu nền", "luôn thật nhạt", "luôn dùng màu vàng"], c: "đủ tương phản để dễ đọc", p: "Mục tiêu chính của poster là đọc rõ thông tin." }
      ]
    }
  };
  const grade = Math.max(1, Math.min(5, Number(state.grade) || 1));
  const rawQuestions = advancedBank[grade]?.[topic] || bank[topic] || bank.letters;
  const questionCount = Math.min(5, rawQuestions.length);
  const questions = rotateQuestions(rawQuestions, key).slice(0, questionCount).map((item, idx) => ({
    question: item.q,
    answers: shuffle(item.a),
    correct: item.c,
    prompt: item.p,
    assetKey: `content-${key}-q${idx}`,
    kind: topic
  }));

  return { id: key, title: topic, kind: topic, difficulty, questions };
}

function maybeSuggestHigherLevel(elapsed, title) {
  if (elapsed > 14000 || state.contentDifficulty >= 5 || state.levelPrompt) return;
  state.levelPrompt = { message: `Bé hoàn thành "${title}" rất nhanh. Bé có muốn thử nội dung level ${state.contentDifficulty + 1} khó hơn một chút không?` };
}

function addStickerAward(sticker, source) {
  if (state.stickerAwards.some((entry) => entry.id === sticker.id)) return null;
  const award = { ...sticker, source };
  state.stickerAwards.push(award);
  if (!state.stickers.includes(sticker.title)) state.stickers.push(sticker.title);
  return award;
}

function maybeAwardSticker(source) {
  const owned = new Set(state.stickerAwards.map((item) => item.id));
  const available = stickerCatalog.filter((item) => !owned.has(item.id));
  if (!available.length || Math.random() > 0.32) return null;
  return addStickerAward(pickRandom(available), source);
}

function addKnowledgeGift(gift, source) {
  state.knowledgeGifts = state.knowledgeGifts || [];
  if (state.knowledgeGifts.some((entry) => entry.id === gift.id)) return null;
  const award = { ...gift, source, date: todayKey() };
  state.knowledgeGifts.push(award);
  return award;
}

function maybeAwardKnowledgeGift(source) {
  state.knowledgeGifts = state.knowledgeGifts || [];
  const owned = new Set(state.knowledgeGifts.map((item) => item.id));
  const grade = Math.max(1, Math.min(5, Number(state.grade) || 1));
  const available = knowledgeGiftCatalog.filter((item) => !owned.has(item.id) && (!item.grade || item.grade === grade || (grade >= 5 && item.grade <= 5)));
  if (!available.length || Math.random() > 0.38) return null;
  const sameGrade = available.filter((item) => item.grade === grade);
  return addKnowledgeGift(pickRandom(sameGrade.length ? sameGrade : available), source);
}

function renderKnowledgeGiftCard(gift) {
  return `
    <article class="knowledge-gift">
      <span class="material-symbols-outlined">redeem</span>
      <div>
        <strong>${escapeHtml(gift.title)}</strong>
        <small>${escapeHtml(gift.kind)} · ${escapeHtml(gift.source || "Hộp quà tri thức")}</small>
        <p>${escapeHtml(gift.text)}</p>
      </div>
    </article>
  `;
}

function sampleStickerPreview(count = 5) {
  const start = Math.floor(Math.random() * stickerCatalog.length);
  return Array.from({ length: count }, (_, index) => stickerCatalog[(start + index) % stickerCatalog.length]);
}

function renderStickerCard(sticker) {
  return `
    <div class="sticker-card surface-card">
      <div class="sticker-emoji" style="font-size:40px;margin-bottom:10px">${sticker.icon}</div>
      <div class="sticker-info">
        <strong>${sticker.title}</strong>
        <p style="font-size:12px;color:var(--text-muted)">${sticker.source || "Phần thưởng"}</p>
      </div>
    </div>
  `;
}

function renderStickerChip(sticker) {
  return `
    <div class="sticker-chip" title="${sticker.title}">
      <span class="sticker-icon">${sticker.icon}</span>
    </div>
  `;
}

function getPeriodStudyMs(period) {
  const entries = Object.entries(state.studyLog || {});
  const current = state.isLoggedIn ? now() - (state.studyTimerStartedAt || now()) : 0;
  const today = new Date();
  const start = periodStart(today, period);
  let total = entries.reduce((sum, [date, value]) => new Date(date) >= start ? sum + value : sum, 0);
  if (new Date(todayKey()) >= start) total += current;
  return total;
}

function periodStart(date, period) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  if (period === "day") return d;
  if (period === "week") {
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d;
  }
  if (period === "month") return new Date(d.getFullYear(), d.getMonth(), 1);
  if (period === "quarter") return new Date(d.getFullYear(), Math.floor(d.getMonth() / 3) * 3, 1);
  return new Date(d.getFullYear(), 0, 1);
}

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return "0p";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours ? `${hours}g ${rest}p` : `${rest}p`;
}

function speakRandom(type) {
  const line = pickRandom(speechPacks[type] || speechPacks.greeting);
  speak(typeof line === "function" ? line() : line);
}

async function speak(text) {
  const message = String(text || "").trim();
  if (!message) return;

  if (state.ttsEndpoint) {
    try {
      const audioUrl = await getVietnameseTtsAudio(message);
      await playTtsAudio(audioUrl);
      return;
    } catch (error) {
      console.warn("Server TTS failed", error);
      showToast("Không thể kết nối Server TTS. Hãy đảm bảo tts_server.py đang chạy.");
    }
  } else {
    showToast("Vui lòng cấu hình TTS Endpoint trong Góc phụ huynh.");
  }
}

async function getVietnameseTtsAudio(text) {
  const response = await fetch(state.ttsEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language: "vi", voice: state.ttsVoice || "vi-VN-HoaiMyNeural" })
  });
  if (!response.ok) throw new Error(`TTS error ${response.status}`);
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const data = await response.json();
    if (!data.audioUrl && !data.url) throw new Error("TTS response missing audioUrl");
    return data.audioUrl || data.url;
  }
  return URL.createObjectURL(await response.blob());
}

async function playTtsAudio(src) {
  if (window.currentTtsAudio) window.currentTtsAudio.pause();
  window.currentTtsAudio = new Audio(src);
  await window.currentTtsAudio.play();
}

function toggleVoice() {
  if (state.ttsVoice === "vi-VN-HoaiMyNeural") {
    state.ttsVoice = "vi-VN-NamMinhNeural";
    showToast("Đã đổi sang giọng Nam miền Bắc (Nam Minh)");
  } else {
    state.ttsVoice = "vi-VN-HoaiMyNeural";
    showToast("Đã đổi sang giọng Nữ miền Bắc (Hoài My)");
  }
  saveState();
  render();
}

function toggleBackgroundMusic() {
  if (state.musicEnabled) {
    stopBackgroundMusic();
    state.musicEnabled = false;
    saveState();
    render();
    return;
  }
  state.musicEnabled = true;
  playBackgroundMusic();
  saveState();
  render();
}

function playBackgroundMusic() {
  stopBackgroundMusic();
  const melody = pickRandom(melodyPresets);
  state.currentMelody = melody.name;
  audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
  let index = 0;
  const playNote = () => {
    if (!state.musicEnabled || !audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = melody.notes[index % melody.notes.length];
    gain.gain.setValueAtTime(0.035, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.35);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.38);
    index += 1;
    musicTimer = setTimeout(playNote, 430);
  };
  playNote();
}

function stopBackgroundMusic() {
  clearTimeout(musicTimer);
  musicTimer = null;
}

function getOrCreateAsset(key, kind, title) {
  state.assetLibrary = state.assetLibrary || {};
  if (!state.assetLibrary[key]) {
    state.assetLibrary[key] = { key, kind, title, src: illustrationSvg(kind, key), createdAt: new Date().toISOString() };
    saveState();
  }
  return state.assetLibrary[key].src;
}

function getQuestionIllustration(content, lesson) {
  const text = normalizeText([
    content?.question || "",
    content?.prompt || "",
    content?.correct || "",
    ...(content?.answers || [])
  ].join(" "));
  const rules = [
    [/chuoi/, "banana", "Quả chuối chín"],
    [/(qua\s+)?dau|strawberry/, "strawberry", "Quả dâu"],
    [/la cay|cay xanh|co non|xanh la/, "leaf", "Lá cây xanh"],
    [/bau troi|troi xanh|xanh da troi/, "sky", "Bầu trời ban ngày"],
    [/dam may|may nhe|mau trang/, "cloud", "Đám mây trắng"],
    [/mat troi|nang|mau vang/, "sun", "Mặt trời"],
    [/bien|dai duong|xanh duong/, "sea", "Biển xanh"],
    [/qua tao|apple|tao chin/, "apple", "Quả táo"],
    [/book|quyen sach|sach/, "book", "Quyển sách"],
    [/cat|con meo|meo meo/, "cat", "Con mèo"],
    [/dog|con cho|gau gau/, "dog", "Con chó"],
    [/pen|cai but|but/, "pen", "Cái bút"],
    [/bag|cai cap|cap sach/, "bag", "Cặp sách"],
    [/school|truong hoc/, "school", "Trường học"]
  ];
  const matched = rules.find(([pattern]) => pattern.test(text));
  const kind = matched ? matched[1] : content?.kind || lesson.kind;
  const title = matched ? matched[2] : content?.question || lesson.title;
  return {
    kind,
    title,
    key: `${content.assetKey || lesson.id}-${kind}-${hashText(content?.question || title)}`
  };
}

function illustrationForText(text) {
  const normalized = normalizeText(text);
  if (normalized.includes("apple") || normalized.includes("tao")) return getOrCreateAsset(`chat-apple-${hashText(text)}`, "apple", "Apple");
  if (normalized.includes("troi") || normalized.includes("xanh")) return getOrCreateAsset(`chat-sun-${hashText(text)}`, "sun", "Bầu trời");
  if (normalized.includes("toan")) return getOrCreateAsset(`chat-math-${hashText(text)}`, "math", "Toán học");
  return getOrCreateAsset(`chat-robot-${hashText(text)}`, "robot", "Bạn học ảo");
}

function renderFloatingDecor() {
  const icons = ["✨", "🌈", "⭐", "🎨", "🚀", "🍎", "🧸"];
  return Array.from({ length: 12 }, (_, i) => {
    const icon = icons[i % icons.length];
    const top = Math.random() * 90;
    const left = Math.random() * 90;
    const size = 20 + Math.random() * 30;
    const delay = Math.random() * 5;
    return `<span class="floating-icon" style="top:${top}%; left:${left}%; font-size:${size}px; animation-delay:${delay}s">${icon}</span>`;
  }).join("");
}

function illustrationSvg(kind, seed = "") {
  const accent = ["#4fc3f7", "#81c784", "#fdd34d", "#ff9f43", "#ff6b8a"][hashText(seed + kind) % 5];
  const scenes = {
    apple: `<circle cx="160" cy="150" r="62" fill="#ff6b8a"/><circle cx="210" cy="150" r="62" fill="#ef476f"/><rect x="181" y="70" width="18" height="42" rx="9" fill="#7a4a20"/><text x="188" y="248" text-anchor="middle" font-size="34" font-weight="800" fill="#9f1730">apple</text>`,
    banana: `<path d="M100 176c58 58 172 70 238-36 8 74-74 142-170 118-42-10-74-34-96-66 10-4 18-9 28-16z" fill="#f8c318"/><path d="M102 176c58 34 142 40 214-28-44 88-160 98-244 44 10-4 20-10 30-16z" fill="#ffe46b"/><path d="M72 190c-14 2-26-8-28-22 18 4 34 0 48-10l18 20c-12 6-24 10-38 12z" fill="#8a5a00"/><path d="M334 126c10-14 26-18 42-12-12 14-22 28-24 46l-34-8c4-8 10-18 16-26z" fill="#8a5a00"/>`,
    book: `<path d="M82 88h112c24 0 42 18 42 42v122H112c-18 0-30-12-30-30V88z" fill="#4fc3f7"/><path d="M236 88h112v134c0 18-12 30-30 30H236V88z" fill="#81c784"/><text x="215" y="292" text-anchor="middle" font-size="34" font-weight="800" fill="#004e69">book</text>`,
    cat: `<circle cx="210" cy="158" r="72" fill="#f8b86a"/><path d="M154 110l-18-44 48 24M266 110l18-44-48 24" fill="#f8b86a" stroke="#8a5a00" stroke-width="8" stroke-linejoin="round"/><circle cx="184" cy="150" r="10" fill="#102033"/><circle cx="236" cy="150" r="10" fill="#102033"/><path d="M210 168v18m-32 8c20 18 44 18 64 0" fill="none" stroke="#102033" stroke-width="8" stroke-linecap="round"/>`,
    dog: `<circle cx="210" cy="158" r="70" fill="#d69a5b"/><ellipse cx="146" cy="142" rx="26" ry="52" fill="#8a5a00"/><ellipse cx="274" cy="142" rx="26" ry="52" fill="#8a5a00"/><circle cx="184" cy="152" r="9" fill="#102033"/><circle cx="236" cy="152" r="9" fill="#102033"/><ellipse cx="210" cy="176" rx="20" ry="14" fill="#102033"/><path d="M188 204c16 14 28 14 44 0" fill="none" stroke="#102033" stroke-width="8" stroke-linecap="round"/>`,
    pen: `<path d="M120 238l42-18 126-126 30 30-126 126-42 18z" fill="#48d5ff"/><path d="M288 94l22-22c8-8 20-8 28 0s8 20 0 28l-22 22z" fill="#ff7aa8"/><path d="M120 238l30-12 18 18-30 12z" fill="#102033"/>`,
    bag: `<rect x="122" y="112" width="176" height="140" rx="26" fill="#48d5ff"/><path d="M166 116v-18c0-26 88-26 88 0v18" fill="none" stroke="#0f5c78" stroke-width="14" stroke-linecap="round"/><rect x="158" y="158" width="104" height="58" rx="16" fill="#fff" opacity=".72"/>`,
    school: `<path d="M88 252h244V126L210 62 88 126z" fill="#fff2bd" stroke="#0f5c78" stroke-width="8"/><rect x="174" y="176" width="72" height="76" rx="10" fill="#48d5ff"/><rect x="112" y="150" width="42" height="36" rx="8" fill="#fff"/><rect x="266" y="150" width="42" height="36" rx="8" fill="#fff"/><text x="210" y="124" text-anchor="middle" font-size="32" font-weight="900" fill="#0f5c78">ABC</text>`,
    sun: `<circle cx="210" cy="150" r="66" fill="#fdd34d"/><text x="210" y="292" text-anchor="middle" font-size="34" font-weight="800" fill="#735c00">sun</text>`,
    sky: `<rect x="70" y="70" width="280" height="170" rx="30" fill="#bdefff"/><circle cx="294" cy="112" r="34" fill="#ffe46b"/><path d="M96 204c34-46 62-46 96 0 36-64 86-66 132 0z" fill="#81c784"/><path d="M120 126c12-20 42-18 50 4 18-8 42 4 42 26H94c0-18 12-28 26-30z" fill="#fff"/>`,
    cloud: `<path d="M118 186c0-28 22-50 50-50 10-34 62-44 90-16 26-4 58 16 58 50 0 32-26 56-60 56H170c-30 0-52-16-52-40z" fill="#fff" stroke="#dbeafe" stroke-width="10"/><rect x="80" y="234" width="260" height="16" rx="8" fill="#e5eef8"/>`,
    leaf: `<path d="M86 212c104-132 222-142 256-124-12 112-118 182-250 140 70-8 130-40 188-104-62 54-126 78-194 88z" fill="#74f19c"/><path d="M86 212c82-18 142-48 194-88" fill="none" stroke="#166534" stroke-width="12" stroke-linecap="round"/>`,
    sea: `<rect x="70" y="84" width="280" height="166" rx="28" fill="#bdefff"/><path d="M70 184c34-20 62-20 96 0s62 20 96 0 62-20 88-4v70H70z" fill="#48d5ff"/><path d="M94 214c34-18 62-18 96 0s62 18 96 0" fill="none" stroke="#0f5c78" stroke-width="10" stroke-linecap="round"/><circle cx="296" cy="118" r="28" fill="#ffe46b"/>`,
    strawberry: `<path d="M210 104c58 0 92 40 78 94-10 44-46 74-78 92-32-18-68-48-78-92-14-54 20-94 78-94z" fill="#ef4444"/><path d="M164 104l46-38 46 38-46 20z" fill="#22c55e"/><g fill="#fff2bd"><circle cx="184" cy="150" r="6"/><circle cx="220" cy="156" r="6"/><circle cx="246" cy="190" r="6"/><circle cx="190" cy="214" r="6"/><circle cx="216" cy="238" r="6"/></g>`,
    letters: `<text x="145" y="190" text-anchor="middle" font-size="120" font-weight="900" fill="#8b5cf6">A</text><text x="255" y="190" text-anchor="middle" font-size="96" font-weight="900" fill="#ff6b8a">a</text>`,
    numbers: `<text x="210" y="126" text-anchor="middle" font-size="58" font-weight="900" fill="#006688">2 + 3</text><text x="210" y="236" text-anchor="middle" font-size="76" font-weight="900" fill="#286b33">5</text>`,
    colors: `<circle cx="130" cy="140" r="50" fill="#ef4444"/><circle cx="210" cy="140" r="50" fill="#3b82f6"/><circle cx="290" cy="140" r="50" fill="#eab308"/>`,
    vocabulary: `<rect x="96" y="82" width="228" height="150" rx="26" fill="#fff" stroke="#ff6b8a" stroke-width="8"/><text x="210" y="170" text-anchor="middle" font-size="52" font-weight="900" fill="#9f1730">word</text>`,
    "letter-hunt": `<circle cx="122" cy="124" r="46" fill="#81c784"/><circle cx="214" cy="124" r="46" fill="#fdd34d"/><circle cx="302" cy="124" r="46" fill="#4fc3f7"/><text x="122" y="146" text-anchor="middle" font-size="62" font-weight="900">A</text><text x="214" y="146" text-anchor="middle" font-size="62" font-weight="900">B</text><text x="302" y="146" text-anchor="middle" font-size="62" font-weight="900">C</text>`,
    "speed-duel": `<circle cx="136" cy="142" r="52" fill="#c2e8ff"/><circle cx="284" cy="142" r="52" fill="#ffe087"/><text x="136" y="160" text-anchor="middle" font-size="42" font-weight="900">bé</text><text x="284" y="160" text-anchor="middle" font-size="42" font-weight="900">AI</text><text x="210" y="230" text-anchor="middle" font-size="42" font-weight="900" fill="#ff9f43">VS</text>`,
    "number-match": `<text x="210" y="126" text-anchor="middle" font-size="58" font-weight="900" fill="#006688">2 + 3</text><text x="210" y="236" text-anchor="middle" font-size="76" font-weight="900" fill="#286b33">5</text>`,
    "picture-puzzle": `<rect x="96" y="82" width="96" height="96" rx="20" fill="#4fc3f7"/><rect x="208" y="82" width="96" height="96" rx="20" fill="#81c784"/><rect x="208" y="194" width="96" height="60" rx="20" fill="#fff" stroke="#735c00" stroke-width="8" stroke-dasharray="10 8"/><text x="256" y="238" text-anchor="middle" font-size="40" font-weight="900">?</text>`,
    "memory-friends": `<text x="130" y="146" text-anchor="middle" font-size="52">🐰</text><text x="210" y="146" text-anchor="middle" font-size="52">🐶</text><text x="290" y="146" text-anchor="middle" font-size="52">🐰</text>`,
    stamp: `<rect x="110" y="72" width="200" height="180" rx="18" fill="#fff" stroke="#4fc3f7" stroke-width="10" stroke-dasharray="14 10"/><circle cx="210" cy="150" r="48" fill="#fdd34d"/>`,
    drum: `<ellipse cx="210" cy="106" rx="92" ry="34" fill="#d97706"/><path d="M118 106h184l-24 130H142z" fill="#f59e0b"/>`,
    science: `<rect x="184" y="72" width="38" height="120" rx="16" fill="#4fc3f7"/><circle cx="202" cy="78" r="26" fill="#c2e8ff" stroke="#006688" stroke-width="8"/>`,
    friendship: `<circle cx="158" cy="132" r="38" fill="#fdd34d"/><circle cx="262" cy="132" r="38" fill="#81c784"/><path d="M126 224c12-48 52-68 84-32 32-36 72-16 84 32" fill="#ff6b8a"/>`,
    math: `<text x="210" y="170" text-anchor="middle" font-size="66" font-weight="900" fill="#006688">4 + 2</text><text x="210" y="228" text-anchor="middle" font-size="48" font-weight="900" fill="#286b33">= 6</text>`,
    robot: `<rect x="126" y="94" width="168" height="132" rx="36" fill="#c2e8ff" stroke="#4fc3f7" stroke-width="10"/><circle cx="178" cy="154" r="14" fill="#006688"/><circle cx="242" cy="154" r="14" fill="#006688"/>`
  };
  const body = scenes[kind] || scenes.robot;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="320" viewBox="0 0 420 320"><rect width="420" height="320" rx="34" fill="#f7fbff"/><circle cx="70" cy="58" r="24" fill="${accent}" opacity="0.18"/><circle cx="340" cy="252" r="28" fill="${accent}" opacity="0.16"/><g font-family="Plus Jakarta Sans, Arial, sans-serif">${body}</g></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getAdaptiveAiDelay() {
  const game = state.games.speedDuel;
  const winRate = (game.wins || 0) / Math.max(1, (game.wins || 0) + (game.losses || 0));
  const gradeAdjust = state.grade <= 1 ? 450 : state.grade >= 4 ? -250 : 0;
  return Math.max(1300, Math.min(5200, Math.round((game.reactionAvg || 2600) + (winRate > 0.65 ? -350 : 350) + gradeAdjust + randomBetween(-300, 300))));
}

function isGameRecommended(game) {
  if (state.grade <= 1) return ["letter-hunt", "speed-duel", "number-match"].includes(game.id);
  if (state.grade === 2) return ["speed-duel", "number-match", "picture-puzzle"].includes(game.id);
  return ["speed-duel", "picture-puzzle", "memory-friends"].includes(game.id);
}

function pickDaily(list, salt) {
  const day = Math.floor(now() / 86400000);
  const offset = salt.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return list[(day + offset) % list.length];
}

function showToast(text) {
  const toast = document.querySelector("#toast");
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function hasLiveAudioTrack(stream) {
  return Boolean(stream?.getAudioTracks?.().some((track) => track.readyState === "live"));
}

async function ensureMicrophoneAccess() {
  if (hasLiveAudioTrack(appMicStream)) return appMicStream;
  if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
  if (!window.isSecureContext && !["localhost", "127.0.0.1"].includes(location.hostname)) {
    throw new Error("insecure-context");
  }
  appMicStream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    video: false
  });
  return appMicStream;
}

function describeMicrophoneError(error) {
  const name = error?.name || error?.message || "";
  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    return "Trinh duyet dang chan micro. Hay cap quyen mic cho trang nay trong Site settings.";
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return "Khong tim thay micro. Hay kiem tra thiet bi dau vao.";
  }
  if (name === "insecure-context") {
    return "Micro chi hoat dong tren localhost hoac HTTPS. Hay mo app qua http://127.0.0.1:3000.";
  }
  if (name === "unsupported") {
    return "Trinh duyet nay chua ho tro mo micro.";
  }
  return "Khong mo duoc micro. Hay kiem tra quyen mic cua trinh duyet.";
}

function getSupportedAudioMimeType() {
  if (!window.MediaRecorder?.isTypeSupported) return "";
  return ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

async function canUseWhisperTranscription() {
  if (!state.whisperEndpoint || !window.MediaRecorder) return false;
  try {
    const healthUrl = new URL(state.whisperEndpoint, location.href);
    healthUrl.pathname = "/health";
    healthUrl.search = "";
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 800);
    const response = await fetch(healthUrl.toString(), { signal: controller.signal });
    window.clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
}

function normalizeText(value) {
  return String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\p{L}\p{N}\s]/gu, "").trim();
}

function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function rotateQuestions(items, seed) {
  const list = [...items];
  const offset = hashText(seed) % Math.max(1, list.length);
  return [...list.slice(offset), ...list.slice(0, offset)];
}

function hashText(value) {
  return String(value).split("").reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) >>> 0, 2166136261);
}

async function toggleReadingRecognition() {
  if (state.recording) {
    finishReadingRecording("manual");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast("Trình duyệt chưa hỗ trợ nhận giọng nói. Bé có thể nhập câu đã đọc.");
    document.querySelector("#transcript-input")?.focus();
    return;
  }
  try {
    await ensureMicrophoneAccess();
  } catch (error) {
    state.recording = false;
    state.readFeedback = describeMicrophoneError(error);
    saveState();
    render();
    return;
  }

  clearReadingTimers();
  readingStopRequested = false;
  state.transcript = "";
  state.recording = true;
  state.readingStartedAt = now();
  state.readingDeadline = now() + 30000;
  state.readFeedback = "Micro đang nghe trong 30 giây. Bé có thể bấm Dừng và chấm bất cứ lúc nào.";
  saveState();
  render();
  startReadingCountdown();

  recognition = new SpeechRecognition();
  recognition.lang = "vi-VN";
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    let finalText = "";
    let interimText = "";
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const text = event.results[i][0].transcript.trim();
      if (event.results[i].isFinal) finalText += ` ${text}`;
      else interimText += ` ${text}`;
    }
    if (finalText.trim()) {
      state.transcript = `${state.transcript} ${finalText}`.replace(/\s+/g, " ").trim();
      saveState();
    }
    const input = document.querySelector("#transcript-input");
    if (input) input.value = `${state.transcript}${interimText ? ` ${interimText.trim()}` : ""}`.trim();
  };

  recognition.onerror = () => {
    if (!state.recording) return;
    state.readFeedback = "Micro chưa nghe rõ. Bé cứ đọc tiếp, hệ thống sẽ thử nghe lại trong 30 giây.";
    saveState();
  };

  recognition.onend = () => {
    if (!state.recording || readingStopRequested) return;
    if (now() < state.readingDeadline) {
      try {
        recognition.start();
      } catch {
        window.setTimeout(() => {
          if (state.recording && now() < state.readingDeadline) {
            try { recognition.start(); } catch { }
          }
        }, 250);
      }
      return;
    }
    finishReadingRecording("timeout");
  };

  try {
    recognition.start();
  } catch {
    state.recording = false;
    state.readFeedback = "Không mở được micro. Bé có thể nhập câu đã đọc rồi bấm Chấm lại.";
    saveState();
    render();
  }

  readingTimeout = window.setTimeout(() => finishReadingRecording("timeout"), 30000);
}

function finishReadingRecording(reason) {
  if (!state.recording && reason !== "manual") return;
  readingStopRequested = true;
  clearReadingTimers();
  const inputText = document.querySelector("#transcript-input")?.value.trim();
  if (inputText) state.transcript = inputText;
  state.recording = false;
  state.readingDeadline = 0;
  try { recognition?.stop(); } catch { }
  saveState();
  analyzeReading(state.transcript);
}

function startReadingCountdown() {
  const button = document.querySelector("#record-read");
  if (button) {
    button.innerHTML = `<span class="material-symbols-outlined">stop</span>Dừng và chấm`;
  }
  const label = document.querySelector(".voice-wave strong");
  const update = () => {
    const left = Math.max(0, Math.ceil(((state.readingDeadline || now()) - now()) / 1000));
    if (label) label.innerHTML = `Micro đang nghe trong <b id="reading-countdown">${left}</b>s`;
    if (left <= 0) clearInterval(readingCountdown);
  };
  update();
  readingCountdown = window.setInterval(update, 250);
}

function clearReadingTimers() {
  clearTimeout(readingTimeout);
  clearInterval(readingCountdown);
  readingTimeout = null;
  readingCountdown = null;
}

window.addEventListener("beforeunload", () => {
  commitStudyTime();
  clearTimeout(chatVoiceTimer);
  if (chatRecorder?.state === "recording") chatRecorder.stop();
  appMicStream?.getTracks?.().forEach((track) => track.stop());
});
window.addEventListener("three-ready", () => {
  teardownAvatarStages();
  hydrateAvatarStages();
});
render();
loadLibraryCatalog();
