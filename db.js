const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'astreamer_db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 26 SFW Cover Arts for Disguise (PSFW Mode)
const SFW_DISGUISE_RJ_LIST = [
  'RJ01681691', 'RJ01678330', 'RJ01694805', 'RJ01688728', 'RJ01693711',
  'RJ335043', 'RJ01360841', 'RJ346413', 'RJ01229288', 'RJ321035',
  'RJ317278', 'RJ387519', 'RJ370190', 'RJ343025', 'RJ373001',
  'RJ01144236', 'RJ336447', 'RJ329940', 'RJ403038', 'RJ370099',
  'RJ299717', 'RJ01323001', 'RJ363741', 'RJ333531', 'RJ357211', 'RJ01040461'
];

// Base Dictionary for Standard ASMR / DLsite Genre Translations & Voice Actors
// Tri-part format: { romaji, english, isCV }
const BASE_TAG_DICT = {
  // === Audio & ASMR ===
  "ASMR": { romaji: "ASMR", english: "ASMR" },
  "バイノーラル": { romaji: "Binaural", english: "Binaural" },
  "立体音響": { romaji: "Rittai Onkyou", english: "3D Audio" },
  "KU100": { romaji: "KU100", english: "KU100 Binaural" },
  "ダミーヘッドマイク": { romaji: "Damii Heddo Maiku", english: "Dummy Head Mic" },
  "ダミヘ": { romaji: "Damihe", english: "Dummy Head Mic" },
  "耳かき": { romaji: "Mimikaki", english: "Ear Cleaning" },
  "耳掃除": { romaji: "Mimisouji", english: "Ear Cleaning" },
  "耳舐め": { romaji: "Miminame", english: "Ear Licking" },
  "耳ふー": { romaji: "Mimi-fuu", english: "Ear Blowing" },
  "吐息": { romaji: "Toiki", english: "Breathing" },
  "囁き": { romaji: "Sasayaki", english: "Whispering" },
  "ささやき": { romaji: "Sasayaki", english: "Whispering" },
  "密着": { romaji: "Mitchaku", english: "Close Contact" },
  "密着耳かき": { romaji: "Mitchaku Mimikaki", english: "Close-Contact Ear Cleaning" },
  "添い寝": { romaji: "Soine", english: "Co-Sleeping" },
  "睡眠導入": { romaji: "Suimin Dounyuu", english: "Sleep Induction" },
  "安眠": { romaji: "Anmin", english: "Deep Sleep" },
  "マッサージ": { romaji: "Massaaji", english: "Massage" },
  "オイルマッサージ": { romaji: "Oiru Massaaji", english: "Oil Massage" },
  "シャンプー": { romaji: "Shanpuu", english: "Hair Wash" },
  "炭酸": { romaji: "Tansan", english: "Carbonated Bubbles" },
  "心音": { romaji: "Shin'on", english: "Heartbeat" },
  "タッピング": { romaji: "Tappingu", english: "Tapping" },
  "スクラッチ": { romaji: "Sukuratchi", english: "Scratching" },
  "咀嚼音": { romaji: "Soshakuon", english: "Chewing Sounds" },
  "水音": { romaji: "Mizuoto", english: "Water Sounds" },
  "雨音": { romaji: "Amaoto", english: "Rain Sounds" },
  "焚き火": { romaji: "Takibi", english: "Campfire" },
  "ロールプレイ": { romaji: "Roorupurei", english: "Roleplay" },
  "シチュエーションボイス": { romaji: "Shichueeshon Boisu", english: "Situation Voice" },
  "ドラマCD": { romaji: "Dorama CD", english: "Drama CD" },
  "朗読": { romaji: "Roudoku", english: "Reading Aloud" },

  // === Tropes & Character Archetypes ===
  "甘やかし": { romaji: "Amayakashi", english: "Pampering" },
  "癒やし": { romaji: "Iyashi", english: "Healing" },
  "癒し": { romaji: "Iyashi", english: "Healing" },
  "甘々": { romaji: "Ama-ama", english: "Sweet" },
  "全肯定": { romaji: "Zen-koutei", english: "Affirmation" },
  "お姉さん": { romaji: "Oneesan", english: "Older Sister" },
  "姉": { romaji: "Ane", english: "Older Sister" },
  "妹": { romaji: "Imouto", english: "Little Sister" },
  "義妹": { romaji: "Gimai", english: "Step Sister" },
  "幼馴染": { romaji: "Osananajimi", english: "Childhood Friend" },
  "幼なじみ": { romaji: "Osananajimi", english: "Childhood Friend" },
  "同級生": { romaji: "Doukyuusei", english: "Classmate" },
  "先輩": { romaji: "Senpai", english: "Senpai" },
  "後輩": { romaji: "Kouhai", english: "Kouhai" },
  "ママ": { romaji: "Mama", english: "Mom" },
  "母性": { romaji: "Bosei", english: "Maternal" },
  "人妻": { romaji: "Hitozuma", english: "Married Woman" },
  "団地妻": { romaji: "Danchizuma", english: "Apartment Wife" },
  "メイド": { romaji: "Meido", english: "Maid" },
  "お嬢様": { romaji: "Ojousama", english: "Rich Lady" },
  "ギャル": { romaji: "Gyaru", english: "Gyaru" },
  "ツンデレ": { romaji: "Tsundere", english: "Tsundere" },
  "クーデレ": { romaji: "Kuudere", english: "Kuudere" },
  "ヤンデレ": { romaji: "Yandere", english: "Yandere" },
  "メスガキ": { romaji: "Mesugaki", english: "Cheeky Brat" },
  "ボクっ娘": { romaji: "Bokukko", english: "Tomboy" },
  "男の娘": { romaji: "Otokonoko", english: "Femboy" },
  "ショタ": { romaji: "Shota", english: "Shota" },
  "ロリ": { romaji: "Rori", english: "Loli" },
  "熟女": { romaji: "Jukujo", english: "Milf" },
  "JK": { romaji: "JK", english: "High School Girl" },
  "JC": { romaji: "JC", english: "Middle School Girl" },
  "JS": { romaji: "JS", english: "Elementary Girl" },
  "OL": { romaji: "OL", english: "Office Lady" },
  "女教師": { romaji: "Onna Kyoushi", english: "Female Teacher" },
  "教師": { romaji: "Kyoushi", english: "Teacher" },
  "生徒": { romaji: "Seito", english: "Student" },
  "看護師": { romaji: "Kangoshi", english: "Nurse" },
  "ナース": { romaji: "Naasu", english: "Nurse" },
  "女医": { romaji: "Joi", english: "Female Doctor" },
  "巫女": { romaji: "Miko", english: "Shrine Maiden" },
  "エルフ": { romaji: "Erufu", english: "Elf" },
  "ダークエルフ": { romaji: "Daaku Erufu", english: "Dark Elf" },
  "獣耳": { romaji: "Kemonomimi", english: "Animal Ears" },
  "猫耳": { romaji: "Nekomimi", english: "Cat Ears" },
  "狐耳": { romaji: "Kitsunemimi", english: "Fox Ears" },
  "犬耳": { romaji: "Inumimi", english: "Dog Ears" },
  "吸血鬼": { romaji: "Kyuuketsuki", english: "Vampire" },
  "淫魔": { romaji: "Inma", english: "Succubus" },
  "サキュバス": { romaji: "Sakyubasu", english: "Succubus" },
  "悪魔": { romaji: "Akuma", english: "Demon" },
  "天使": { romaji: "Tenshi", english: "Angel" },

  // === Fetish & Erotic Keywords ===
  "オナサポ": { romaji: "Onasapo", english: "Masturbation Support" },
  "射精管理": { romaji: "Shasei Kanri", english: "Ejaculation Control" },
  "寸止め": { romaji: "Sundome", english: "Edging" },
  "焦らし": { romaji: "Jirashi", english: "Teasing" },
  "淫語": { romaji: "Ingo", english: "Dirty Talk" },
  "言葉責め": { romaji: "Kotoba Zeme", english: "Verbal Degradation" },
  "主観視点": { romaji: "Shukan Shiten", english: "POV" },
  "催眠": { romaji: "Saimin", english: "Hypnosis" },
  "催眠音声": { romaji: "Saimin Onsei", english: "Hypnosis Voice" },
  "洗脳": { romaji: "Sennou", english: "Brainwashing" },
  "隷属": { romaji: "Reizoku", english: "Enslavement" },
  "常識改変": { romaji: "Joushiki Kaihen", english: "Common Sense Alteration" },
  "乳首責め": { romaji: "Chikubi Zeme", english: "Nipple Stimulation" },
  "連続絶頂": { romaji: "Renzoku Zecchou", english: "Multiple Orgasms" },
  "快楽堕ち": { romaji: "Kairaku Ochi", english: "Succumbing to Pleasure" },
  "悪堕ち": { romaji: "Aku Ochi", english: "Corruption" },
  "メス堕ち": { romaji: "Mesu Ochi", english: "Feminization" },
  "オホ声": { romaji: "Oho-goe", english: "Ahegao Voice" },
  "淫紋": { romaji: "Inmon", english: "Erotic Tattoo" },
  "手コキ": { romaji: "Tekoki", english: "Handjob" },
  "フェラ": { romaji: "Fera", english: "Blowjob" },
  "フェラチオ": { romaji: "Ferachio", english: "Blowjob" },
  "イラマチオ": { romaji: "Iramachio", english: "Deep Throat" },
  "パイズリ": { romaji: "Paizuri", english: "Breastjob" },
  "足コキ": { romaji: "Ashikoki", english: "Footjob" },
  "アナル": { romaji: "Anaru", english: "Anal" },
  "潮吹き": { romaji: "Shiofuki", english: "Squirting" },
  "中出し": { romaji: "Nakadashi", english: "Creampie" },
  "キス": { romaji: "Kisu", english: "Kissing" },
  "拘束": { romaji: "Kousoku", english: "Restraint" },
  "目隠し": { romaji: "Mekakushi", english: "Blindfold" },
  "調教": { romaji: "Choukyou", english: "Discipline" },
  "痴女": { romaji: "Chijo", english: "Slutty Woman" },
  "逆レイプ": { romaji: "Gyaku Reipu", english: "Reverse Rape" },
  "寝取られ": { romaji: "Netorare", english: "NTR" },
  "寝取り": { romaji: "Netori", english: "Partner Poaching" },
  "寝取らせ": { romaji: "Netorase", english: "Cuckolding" },
  "純愛": { romaji: "Jun'ai", english: "Pure Love" },
  "女性優位": { romaji: "Josei Yuui", english: "Female Dominance" },
  "赤ちゃんプレイ": { romaji: "Akachan Purei", english: "Age Play" },
  "巨乳": { romaji: "Kyonyuu", english: "Big Breasts" },
  "爆乳": { romaji: "Bakunyuu", english: "Huge Breasts" },
  "貧乳": { romaji: "Hinnyuu", english: "Small Breasts" },
  "微乳": { romaji: "Binyuu", english: "Petite Breasts" },
  "全裸": { romaji: "Zenra", english: "Naked" },
  "百合": { romaji: "Yuri", english: "Yuri" },
  "BL": { romaji: "BL", english: "Boys Love" },
  "ハーレム": { romaji: "Haaremu", english: "Harem" },
  "浮気": { romaji: "Uwaki", english: "Affair" },

  // === EhTag Chinese Synonyms (Mirror tags) ===
  "手交": { romaji: "Tekoki", english: "Handjob" },
  "内射": { romaji: "Nakadashi", english: "Creampie" },
  "中出": { romaji: "Nakadashi", english: "Creampie" },
  "口交": { romaji: "Ferachio", english: "Blowjob" },
  "姐姐": { romaji: "Oneesan", english: "Older Sister" },
  "妹妹": { romaji: "Imouto", english: "Little Sister" },
  "环绕音": { romaji: "Rittai Onkyou", english: "3D Audio" },
  "舔耳": { romaji: "Miminame", english: "Ear Licking" },
  "挖耳": { romaji: "Mimikaki", english: "Ear Cleaning" },
  "采耳": { romaji: "Mimikaki", english: "Ear Cleaning" },
  "睡眠引导": { romaji: "Suimin Dounyuu", english: "Sleep Induction" },
  "纯爱": { romaji: "Jun'ai", english: "Pure Love" },
  "同栖": { romaji: "Dousei", english: "Cohabitation" },
  "幼驯染": { romaji: "Osananajimi", english: "Childhood Friend" },
  "女仆": { romaji: "Meido", english: "Maid" },
  "傲娇": { romaji: "Tsundere", english: "Tsundere" },
  "病娇": { romaji: "Yandere", english: "Yandere" },
  "萝莉": { romaji: "Rori", english: "Loli" },
  "正太": { romaji: "Shota", english: "Shota" },
  "乳交": { romaji: "Paizuri", english: "Breastjob" },
  "足交": { romaji: "Ashikoki", english: "Footjob" },
  "后庭": { romaji: "Anaru", english: "Anal" },
  "喷水": { romaji: "Shiofuki", english: "Squirting" },
  "潮吹": { romaji: "Shiofuki", english: "Squirting" },
  "调教": { romaji: "Choukyou", english: "Training" },
  "紧缚": { romaji: "Kinbaku", english: "Bondage" },
  "蒙眼": { romaji: "Mekakushi", english: "Blindfold" },
  "逆推": { romaji: "Gyaku Reipu", english: "Reverse Rape" },
  "御姐": { romaji: "Oneesan", english: "Older Sister" },
  "兽耳": { romaji: "Kemonomimi", english: "Animal Ears" },
  "魅魔": { romaji: "Sakyubasu", english: "Succubus" },
  "精灵": { romaji: "Erufu", english: "Elf" },
  "暗精灵": { romaji: "Daaku Erufu", english: "Dark Elf" },
  "寸止": { romaji: "Sundome", english: "Edging" },
  "自慰支援": { romaji: "Onasapo", english: "Masturbation Support" },
  "耳语": { romaji: "Sasayaki", english: "Whispering" },
  "贴近": { romaji: "Mitchaku", english: "Close Contact" },
  "零距离": { romaji: "Zero Kyori", english: "Zero Distance" },
  "治愈": { romaji: "Iyashi", english: "Healing" },
  "宠溺": { romaji: "Amayakashi", english: "Pampering" },

  // === Voice Actors (CV) ===
  "民安ともえ": { romaji: "Tamiyasu Tomoe", isCV: true },
  "たみやすともえ": { romaji: "Tamiyasu Tomoe", isCV: true },
  "秋野花": { romaji: "Akino Hana", isCV: true },
  "秋野かえで": { romaji: "Akino Kaede", isCV: true },
  "陽向葵ゅか": { romaji: "Hinata Yuka", isCV: true },
  "柚木つばめ": { romaji: "Yuzuki Tsubame", isCV: true },
  "大山チロル": { romaji: "Oyama Chiroru", isCV: true },
  "涼花みなせ": { romaji: "Suzuka Minase", isCV: true },
  "御子柴泉": { romaji: "Mikoshiba Izumi", isCV: true },
  "餅梨あむ": { romaji: "Mochinashi Amu", isCV: true },
  "逢坂成美": { romaji: "Osaka Narumi", isCV: true },
  "桜音のん": { romaji: "Sakurane Non", isCV: true },
  "山田じぇみ子": { romaji: "Yamada Jemiko", isCV: true },
  "分倍河原シホ": { romaji: "Bubaigawara Shiho", isCV: true },
  "みもりあいの": { romaji: "Mimori Aino", isCV: true },
  "秋山はるる": { romaji: "Akiyama Haruru", isCV: true },
  "浅木式": { romaji: "Asagi Shiki", isCV: true },
  "コミック": { romaji: "Komikku", isCV: true },
  "藤宮きせき": { romaji: "Fujimiya Kiseki", isCV: true },
  "涼貴涼": { romaji: "Suzuki Ryou", isCV: true },
  "天知遥": { romaji: "Amachi Haruka", isCV: true },
  "雲八はち": { romaji: "Kumoya Hachi", isCV: true },
  "藤村莉央": { romaji: "Fujimura Rio", isCV: true },
  "西瓜すいか": { romaji: "Suika Suika", isCV: true },
  "恋鈴桃歌": { romaji: "Koisuzu Momoka", isCV: true },
  "花杜めい": { romaji: "Hanamori Mei", isCV: true },
  "空峰羽奈": { romaji: "Soramine Hana", isCV: true },
  "加々美澪": { romaji: "Kagami Mio", isCV: true },
  "高梨はなみ": { romaji: "Takanashi Hanami", isCV: true },
  "剣崎葵": { romaji: "Kenzaki Aoi", isCV: true },
  "乙倉ゆい": { romaji: "Otokura Yui", isCV: true },
  "赤井リア": { romaji: "Akai Ria", isCV: true },
  "野上菜月": { romaji: "Nogami Natsuki", isCV: true },
  "琴音有波": { romaji: "Kotone Arina", isCV: true },
  "鵜飼ちよ": { romaji: "Ukai Chiyo", isCV: true },
  "篠守ゆきこ": { romaji: "Shinomori Yukiko", isCV: true },
  "葉山真紘": { romaji: "Hayama Mahiro", isCV: true },
  "沢野ぽぷら": { romaji: "Sawano Popura", isCV: true },
  "小花衣こっこ": { romaji: "Kohaneko Koko", isCV: true },
  "ありのりあ": { romaji: "Arino Ria", isCV: true },
  "小波すず": { romaji: "Sazanami Suzu", isCV: true },
  "夏和小": { romaji: "Natsukawako", isCV: true },
  "美空なつひ": { romaji: "Misora Natsuhi", isCV: true },
  "春乃いろは": { romaji: "Haruno Iroha", isCV: true },
  "和央きりか": { romaji: "Wao Kirika", isCV: true },
  "猫村ゆき": { romaji: "Nekomura Yuki", isCV: true },
  "白砂沙帆": { romaji: "Shirasu Saho", isCV: true },
  "陽月ひかり": { romaji: "Hizuki Hikari", isCV: true },
  "羽鳥まりえ": { romaji: "Hatori Marie", isCV: true },
  "星咲イリア": { romaji: "Hoshizaki Iria", isCV: true },
  "有栖川みや美": { romaji: "Arisugawa Miyabi", isCV: true },
  "百千るか": { romaji: "Momochi Ruka", isCV: true },
  "犬飼あお": { romaji: "Inukai Ao", isCV: true },
  "水瀬沙季": { romaji: "Minase Saki", isCV: true },
  "伊ヶ崎綾香": { romaji: "Igasaki Ayaka", isCV: true },
  "餅月ひまり": { romaji: "Mochizuki Himari", isCV: true },
  "藍沢夏癒": { romaji: "Aizawa Natsu", isCV: true },
  "八ッ橋しなもん": { romaji: "Yatsuhashi Shinamon", isCV: true },
  "夜乃ネネ": { romaji: "Yoruno Nene", isCV: true },
  "天海あずさ": { romaji: "Amami Azusa", isCV: true },
  "七海こころ": { romaji: "Nanami Kokoro", isCV: true },
  "恋羽ひより": { romaji: "Koihane Hiyori", isCV: true },
  "綾瀬あかり": { romaji: "Ayase Akari", isCV: true },
  "葵ゆり": { romaji: "Aoi Yuri", isCV: true },
  "神代麻耶": { romaji: "Kamishiro Maya", isCV: true },
  "真宮ゆず": { romaji: "Mamiya Yuzu", isCV: true },
  "音霊魂子": { romaji: "Onrei Tamako", isCV: true },
  "猫舐つな": { romaji: "Nekoname Tsuna", isCV: true },
  "桃山いおん": { romaji: "Momoyama Ion", isCV: true },
  "逢真井もこ": { romaji: "Aimai Moko", isCV: true },
  "小鳥遊結衣": { romaji: "Takanashi Yui", isCV: true },
  "くすはらゆい": { romaji: "Kusuhara Yui", isCV: true },
  "歩サラ": { romaji: "Ayumi Sara", isCV: true },
  "杏子御津": { romaji: "Anzu Mitsu", isCV: true },
  "藤咲ウサ": { romaji: "Fujisaki Usa", isCV: true },
  "花園めい": { romaji: "Hanazono Mei", isCV: true },
  "北大路ゆき": { romaji: "Kitaooji Yuki", isCV: true },
  "御苑生メイ": { romaji: "Misonoo Mei", isCV: true },
  "悠木碧": { romaji: "Yuuki Aoi", isCV: true },
  "種﨑敦美": { romaji: "Tanezaki Atsumi", isCV: true },
  "いねむりすやこ": { romaji: "Inemuri Suyako", isCV: true },
  "花城かざり": { romaji: "Hanashiro Kazari", isCV: true },
  "黒木ほの香": { romaji: "Kuroki Honoka", isCV: true },
  "飯田ヒカル": { romaji: "Iida Hikaru", isCV: true },
  "七瀬つむぎ": { romaji: "Nanase Tsumugi", isCV: true },
  "薄井友里": { romaji: "Usui Yuri", isCV: true },
  "小原好美": { romaji: "Kohara Konomi", isCV: true },
  "竹達彩奈": { romaji: "Taketatsu Ayana", isCV: true },
  "水純なな歩": { romaji: "Mizujun Nanaho", isCV: true },
  "こまる": { romaji: "Komaru", isCV: true },
  "佐倉綾音": { romaji: "Sakura Ayane", isCV: true },
  "鬼頭明里": { romaji: "Kitou Akari", isCV: true },
  "伊藤美来": { romaji: "Itou Miku", isCV: true },
  "雨宮天": { romaji: "Amamiya Sora", isCV: true },
  "高橋李依": { romaji: "Takahashi Rie", isCV: true },
  "上坂すみれ": { romaji: "Uesaka Sumire", isCV: true },
  "東山奈央": { romaji: "Touyama Nao", isCV: true },
  "茅野愛衣": { romaji: "Kayano Ai", isCV: true },
  "花澤香菜": { romaji: "Hanazawa Kana", isCV: true },
  "早見沙織": { romaji: "Hayami Saori", isCV: true },
  "水瀬いのり": { romaji: "Minase Inori", isCV: true },
  "大西沙織": { romaji: "Oonishi Saori", isCV: true },
  "内田真礼": { romaji: "Uchida Maaya", isCV: true },
  "小倉唯": { romaji: "Ogura Yui", isCV: true },
  "日高里菜": { romaji: "Hidaka Rina", isCV: true },
  "瀬戸麻沙美": { romaji: "Seto Asami", isCV: true },
  "阿澄佳奈": { romaji: "Asumi Kana", isCV: true },
  "井澤詩織": { romaji: "Izawa Shiori", isCV: true },
  "M・A・O": { romaji: "M・A・O", isCV: true },
  "市ノ瀬加那": { romaji: "Ichinose Kana", isCV: true },
  "鈴代紗弓": { romaji: "Suzushiro Sayumi", isCV: true },
  "会沢紗弥": { romaji: "Aizawa Saya", isCV: true },
  "羊宮妃那": { romaji: "Youmiya Hina", isCV: true },
  "長谷川育美": { romaji: "Hasegawa Ikumi", isCV: true },
  "富田美憂": { romaji: "Tomita Miyu", isCV: true },
  "楠木ともり": { romaji: "Kusunoki Tomori", isCV: true },
  "和氣あず未": { romaji: "Waki Azumi", isCV: true },
  "ファイルーズあい": { romaji: "Fairouz Ai", isCV: true },
  "石見舞菜香": { romaji: "Iwami Manaka", isCV: true },
  "指出毬亜": { romaji: "Sashide Maria", isCV: true },
  "ペペロンチーノ": { romaji: "Peperoncino", isCV: true },
  "かの仔": { romaji: "Kanoko", isCV: true },
  "秋野こぎく": { romaji: "Akino Kogiku", isCV: true },
  "月野きいろ": { romaji: "Tsukino Kiiro", isCV: true },
  "飴川紫乃": { romaji: "Amekawa Shino", isCV: true },
  "御手洗かりん": { romaji: "Mitarai Karin", isCV: true },
  "柚原みう": { romaji: "Yuzuhara Miu", isCV: true },
  "恋羽ここ": { romaji: "Kohane Koko", isCV: true },
  "羽高なる": { romaji: "Hadaka Naru", isCV: true },
  "月城まひる": { romaji: "Tsukishiro Mahiru", isCV: true },
  "蒼乃むすび": { romaji: "Aono Musubi", isCV: true },
  "shizuku": { romaji: "Shizuku", isCV: true },
  "犬塚いちご": { romaji: "Inuzuka Ichigo", isCV: true },
  "みる": { romaji: "Miru", isCV: true },
  "北見六花": { romaji: "Kitami Rikka", isCV: true },
  "波野夏花": { romaji: "Namano Natsuka", isCV: true },
  "風音": { romaji: "Kazane", isCV: true },
  "夏野こおり": { romaji: "Natsuno Koori", isCV: true },
  "五行なずな": { romaji: "Gogyou Nazuna", isCV: true },
  "青山ゆかり": { romaji: "Aoyama Yukari", isCV: true },
  "かわしまりの": { romaji: "Kawashima Rino", isCV: true },
  "一色ヒカル": { romaji: "Isshiki Hikaru", isCV: true }
};

function cleanCVName(raw) {
  if (!raw || typeof raw !== 'string') return '';
  let str = raw.trim();
  str = str.replace(/^(?:【|\(|（|\[)?\s*(?:CV|声優|ボイス|キャスト)[.:：\s]*/i, '');
  str = str.replace(/(?:】|\)|）|\])\s*$/i, '');
  str = str.replace(/(?:様|さん|氏|他)$/, '').trim();
  return str;
}

function normalizeCVRomaji(ja, romaji) {
  if (!romaji || typeof romaji !== 'string') return romaji || '';
  let str = romaji.trim();
  if (!str) return '';

  const parenMatch = str.match(/^([^(（]+)[(（](.+)[)）]$/);
  if (parenMatch) {
    const jaParen = (ja && typeof ja === 'string') ? ja.match(/^([^(（]+)[(（](.+)[)）]$/) : null;
    if (jaParen) {
      return normalizeCVRomaji(jaParen[1].trim(), parenMatch[1].trim()) + ' (' +
             normalizeCVRomaji(jaParen[2].trim(), parenMatch[2].trim()) + ')';
    }
    return normalizeCVRomaji('', parenMatch[1].trim()) + ' (' + normalizeCVRomaji('', parenMatch[2].trim()) + ')';
  }

  const words = str.split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase() + words[0].slice(1);
  }

  if (words.length === 2) {
    const w0 = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
    const w1 = words[1].charAt(0).toUpperCase() + words[1].slice(1).toLowerCase();
    return w0 + ' ' + w1;
  }

  if (words.some(w => w.toLowerCase() === 'no') && ja && /[ノ之の]/.test(ja)) {
    return words.map((w) => {
      if (w.toLowerCase() === 'no') return 'no';
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    }).join(' ');
  }

  const capitalizedWords = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

  if (words.length === 4) {
    const surname = capitalizedWords[0] + capitalizedWords[1].toLowerCase();
    const given = capitalizedWords[2] + capitalizedWords[3].toLowerCase();
    return surname + ' ' + given;
  }

  if (words.length === 3) {
    if (ja && typeof ja === 'string') {
      const matchKanjiKana = ja.match(/^([\u4E00-\u9FFF]+)([\u3040-\u309F\u30A0-\u30FF]+)$/);
      if (matchKanjiKana && matchKanjiKana[1].length >= 2) {
        return capitalizedWords[0] + capitalizedWords[1].toLowerCase() + ' ' + capitalizedWords[2];
      }
      const matchKanjiMixed = ja.match(/^([\u4E00-\u9FFF]{2,})([\u3040-\u309F\u30A0-\u30FF]+[\u4E00-\u9FFF]*)$/);
      if (matchKanjiMixed) {
        return capitalizedWords[0] + ' ' + capitalizedWords[1] + capitalizedWords[2].toLowerCase();
      }
      if (/^[\u4E00-\u9FFF]{4}$/.test(ja)) {
        return capitalizedWords[0] + capitalizedWords[1].toLowerCase() + ' ' + capitalizedWords[2];
      }
    }

    const surnameSuffixes = /^(ne|mine|saka|zaka|ta|da|kawa|gawa|hara|bara|shima|jima|mori|saki|zaki|no|ki|gi|mizu|tsuka|zuka|ba|ha|ya|tani|yama|kura|miya|hashi|bashi|fuji|se|ko|to|no)$/i;
    if (surnameSuffixes.test(words[1])) {
      return capitalizedWords[0] + capitalizedWords[1].toLowerCase() + ' ' + capitalizedWords[2];
    }

    return capitalizedWords[0] + capitalizedWords[1].toLowerCase() + ' ' + capitalizedWords[2];
  }

  return capitalizedWords.join(' ');
}

function getWorkCV(work) {
  if (!work) return '';
  let cv = (work.cv || '').trim();
  if (cv && cv !== 'N/A') return cv;

  const title = (work.title || '');
  if (!title) return '';

  const match = title.match(/(?:【|\(|（|\[)\s*(?:CV|声優|ボイス|キャスト)[.:：\s]*([^】)）\]]+)(?:】|\)|）|\])/i);
  if (match && match[1]) {
    const rawCv = match[1].trim();
    const firstPart = rawCv.split(/[/,、/]/)[0].trim();
    if (firstPart && firstPart.length >= 2 && !['DLsite', '同人', 'ASMR', 'R18'].includes(firstPart)) {
      return firstPart;
    }
  }
  return '';
}

function formatTag(t, tagDict = BASE_TAG_DICT) {
  if (!t || typeof t !== 'string') return '';
  const raw = t.trim();
  if (!raw) return '';

  let jaName = raw;
  let existingRomaji = '';
  if (raw.includes('|')) {
    const pipeIdx = raw.indexOf('|');
    jaName = raw.slice(0, pipeIdx).trim();
    existingRomaji = raw.slice(pipeIdx + 1).trim();
  }

  let entry = (tagDict && tagDict[jaName]);
  if (!entry || typeof entry === 'string') {
    if (BASE_TAG_DICT[jaName]) {
      entry = BASE_TAG_DICT[jaName];
    } else if (typeof entry === 'string') {
      entry = { romaji: jaName, english: entry };
    }
  }

  if (!entry && !existingRomaji) return raw;

  if (entry && entry.isCV) {
    let romaji = entry.romaji || existingRomaji;
    if (romaji) romaji = normalizeCVRomaji(jaName, romaji);
    return (romaji && romaji !== jaName) ? jaName + ' | ' + romaji : jaName;
  }

  if (entry) {
    const parts = [jaName];
    let romaji = entry.romaji || '';
    let english = entry.english || '';
    if (romaji && romaji.toLowerCase() !== jaName.toLowerCase()) {
      parts.push(romaji);
    }
    if (english && english.toLowerCase() !== jaName.toLowerCase() && english.toLowerCase() !== romaji.toLowerCase()) {
      parts.push(english);
    }
    return parts.join(' | ');
  }

  if (existingRomaji) {
    const norm = normalizeCVRomaji(jaName, existingRomaji);
    return jaName + ' | ' + norm;
  }

  return raw;
}

function formatCV(cv, tagDict = BASE_TAG_DICT) {
  if (!cv || typeof cv !== 'string' || cv === 'N/A') return '';
  const parts = cv.split(/[,、/&＋+;・\n|]/).map(p => p.trim()).filter(Boolean);
  if (parts.length === 0) return '';

  const results = [];

  for (let part of parts) {
    let raw = cleanCVName(part);
    if (!raw || raw === 'N/A') continue;

    let jaName = raw;
    let existingRomaji = '';

    const bracketMatch = raw.match(/【([^】]+)】|（([^）]+)）|\(([^)]+)\)|\[([^\]]+)\]/);
    if (bracketMatch) {
      const inside = (bracketMatch[1] || bracketMatch[2] || bracketMatch[3] || bracketMatch[4] || '').trim();
      const outside = raw.replace(bracketMatch[0], '').trim();
      const isInsideJa = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(inside);
      const isOutsideJa = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(outside);

      if (isInsideJa && !isOutsideJa && outside) {
        jaName = inside;
        existingRomaji = outside;
      } else if (isOutsideJa && !isInsideJa && inside) {
        jaName = outside;
        existingRomaji = inside;
      } else if (isInsideJa) {
        jaName = inside;
      }
    }

    let entry = (tagDict && tagDict[jaName]);
    const baseEntry = (BASE_TAG_DICT && BASE_TAG_DICT[jaName]);

    let romaji = '';
    if (entry) {
      if (typeof entry === 'string') {
        if (/[a-zA-Z]/.test(entry) && entry.toLowerCase() !== jaName.toLowerCase()) {
          romaji = entry;
        }
      } else if (typeof entry === 'object') {
        const r = entry.romaji || entry.english || '';
        if (r && /[a-zA-Z]/.test(r) && r.toLowerCase() !== jaName.toLowerCase()) {
          romaji = r;
        }
      }
    }

    if (!romaji && baseEntry) {
      if (typeof baseEntry === 'string') {
        romaji = baseEntry;
      } else if (typeof baseEntry === 'object') {
        romaji = baseEntry.romaji || baseEntry.english || '';
      }
    }

    if (!romaji && existingRomaji) {
      romaji = existingRomaji;
    }

    if (romaji) {
      romaji = normalizeCVRomaji(jaName, romaji);
    }

    if (romaji && /[a-zA-Z]/.test(romaji) && romaji.toLowerCase() !== jaName.toLowerCase()) {
      results.push(jaName + ' | ' + romaji);
    } else {
      results.push(jaName);
    }
  }

  return Array.from(new Set(results)).join(', ');
}

function mergeTagDict(db, newTags) {
  if (!db) return false;
  db.tagDict = Object.assign({}, BASE_TAG_DICT, db.tagDict || {});
  let changed = false;
  const translations = (newTags && newTags.tagTranslations) ? newTags.tagTranslations : newTags;
  if (translations && typeof translations === 'object') {
    for (const [ja, val] of Object.entries(translations)) {
      if (!ja || !val) continue;
      const cleanJa = ja.trim();
      if (!cleanJa) continue;

      const base = BASE_TAG_DICT[cleanJa];
      const existing = db.tagDict[cleanJa] || base || {};

      if (typeof val === 'string') {
        const cleanVal = val.trim();
        if (!cleanVal) continue;
        const isValLatin = /[a-zA-Z]/.test(cleanVal);
        if (!isValLatin && (existing.english || existing.romaji)) {
          continue; // Don't overwrite existing latin translation with non-latin text
        }
        const updated = Object.assign({}, existing, { english: cleanVal });
        if (JSON.stringify(db.tagDict[cleanJa]) !== JSON.stringify(updated)) {
          db.tagDict[cleanJa] = updated;
          changed = true;
        }
      } else if (typeof val === 'object') {
        const item = Object.assign({}, existing);
        if (val.isCV !== undefined) item.isCV = !!val.isCV;
        if (typeof val.isNsfw === 'boolean') item.isNsfw = val.isNsfw;
        
        if (val.romaji && typeof val.romaji === 'string' && val.romaji.trim() && /[a-zA-Z]/.test(val.romaji)) {
          item.romaji = normalizeCVRomaji(cleanJa, val.romaji.trim());
        }
        if (val.english && typeof val.english === 'string' && val.english.trim() && /[a-zA-Z]/.test(val.english)) {
          item.english = val.english.trim();
        }
        if (item.isCV && item.romaji && (!item.english || item.english === cleanJa)) {
          item.english = item.romaji;
        }

        if (JSON.stringify(db.tagDict[cleanJa]) !== JSON.stringify(item)) {
          db.tagDict[cleanJa] = item;
          changed = true;
        }
      }
    }
  }
  return changed;
}

const DEFAULT_DB = {
  version: 1,
  works: {
    'RJ01473335': {
      rjCode: 'RJ01473335',
      title: '事務的メイドの好意だだ漏れよわよわマゾオス克服訓練',
      circle: '裏あおぎり学園',
      cv: 'こまる',
      tags: ['メイド', 'ラブラブ/あまあま', '女性優位', '手コキ', '中出し', 'オナサポ', '耳舐め', '乳首責め', 'NSFW', 'R18'],
      coverUrl: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ01473335_img_main.jpg',
      rawCoverUrl: 'https://pic.weeabo0.xyz/RJ01473335_img_main.jpg',
      hasHls: true,
      totalTracks: 1,
      tracks: [
        { id: 1, title: '01. Full Audio Session (HLS Master)', formattedTime: '01:45:12', startTime: 0, isHls: true, rawUrl: 'https://v.weeab0o.xyz/RJ01473335.m3u8', streamUrl: '/stream?url=https%3A%2F%2Fv.weeab0o.xyz%2FRJ01473335.m3u8', poster: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ01473335_img_main.jpg' }
      ],
      chapters: [
        { id: 1, title: '01.よわよわおちんぽ強化訓練寸止め手コキ', formattedTime: '00:00:00', startTime: 0 },
        { id: 2, title: '02.交尾想像訓練オナサポ', formattedTime: '00:20:04', startTime: 1204 },
        { id: 3, title: '03.雑魚オス弱点克服訓練、ねっとり乳首いじめオナホコキ', formattedTime: '00:36:49', startTime: 2209 },
        { id: 4, title: '04.ナマハメ交尾訓練、メス優位ドスケベ暴走騎乗位搾精', formattedTime: '00:59:04', startTime: 3544 },
        { id: 5, title: '05.ナマハメ交尾訓練、オス優位いちゃらぶすきすき対面座位セックス', formattedTime: '01:18:06', startTime: 4686 },
        { id: 6, title: '早期購入特典フリートーク_事務的メイドの好意だだ漏れよわよわマゾオス克服訓練', formattedTime: '01:37:39', startTime: 5859 }
      ],
      addedAt: new Date().toISOString(),
      favorite: true
    },
    'RJ441308': {
      rjCode: 'RJ441308',
      title: '愛聖天使ラブメアリー ～堕ちた魔法少女たちの淫惑～',
      circle: 'Voice Unreal',
      cv: 'いねむりすやこ, Yuka Hinata 【陽向葵ゅか】, Kazari Hanashiro 【花城かざり】',
      tags: ['Futanari', 'NSFW', 'Magical Girl', 'Ear Licking', 'Whispering', '18禁'],
      coverUrl: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ441308_img_main.jpg',
      rawCoverUrl: 'https://pic.weeabo0.xyz/RJ441308_img_main.jpg',
      hasHls: false,
      totalTracks: 3,
      tracks: [
        { id: 1, title: 'Track 1 (トラック1)', formattedTime: '00:00:00', startTime: 0, isHls: false, rawUrl: 'https://v.weeab0o.xyz/RJ441308.mp3', streamUrl: '/stream?url=https%3A%2F%2Fv.weeab0o.xyz%2FRJ441308.mp3', poster: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ441308_img_main.jpg' },
        { id: 2, title: 'Track 2 (トラック2)', formattedTime: '00:00:00', startTime: 0, isHls: false, rawUrl: 'https://v.weeab0o.xyz/RJ441308 2.mp3', streamUrl: '/stream?url=https%3A%2F%2Fv.weeab0o.xyz%2FRJ441308 2.mp3', poster: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ441308_img_main.jpg' },
        { id: 3, title: 'Track 3 (トラック3)', formattedTime: '00:00:00', startTime: 0, isHls: false, rawUrl: 'https://v.weeab0o.xyz/RJ441308 3.mp3', streamUrl: '/stream?url=https%3A%2F%2Fv.weeab0o.xyz%2FRJ441308 3.mp3', poster: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ441308_img_main.jpg' }
      ],
      chapters: [],
      addedAt: new Date().toISOString(),
      favorite: false
    }
  },
  playlists: [
    {
      id: 'pl-favorites',
      name: '❤️ Favorites',
      description: 'Your favorited audio tracks and ASMR sessions',
      coverUrl: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ01473335_img_main.jpg',
      items: [
        { rjCode: 'RJ01473335', trackId: 1, title: '事務的メイドの好意だだ漏れよわよわマゾオス克服訓練', workTitle: '事務的メイドの好意だだ漏れよわよわマゾオス克服訓練', cv: 'こまる', poster: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ01473335_img_main.jpg' }
      ],
      createdAt: new Date().toISOString()
    }
  ],
  history: [],
  wishlist: [],
  tagDict: BASE_TAG_DICT,
  settings: {
    contentMode: 'NSFW' // 'SFW' | 'PSFW' | 'NSFW'
  }
};

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDb(DEFAULT_DB);
      return DEFAULT_DB;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    data.settings = data.settings || { contentMode: 'NSFW' };
    data.playlists = data.playlists || [];
    data.history = data.history || [];
    data.wishlist = data.wishlist || [];
    data.works = data.works || {};
    data.tagDict = Object.assign({}, BASE_TAG_DICT, data.tagDict || {});
    return data;
  } catch (err) {
    console.error('[DB Read Error]', err.message);
    return DEFAULT_DB;
  }
}

function writeDb(data) {
  try {
    if (data && data.works && typeof data.works === 'object') {
      for (const k of Object.keys(data.works)) {
        if (data.works[k]) {
          if (data.works[k].chapters) delete data.works[k].chapters;
          if (data.works[k].tagTranslations) {
            mergeTagDict(data, data.works[k].tagTranslations);
            delete data.works[k].tagTranslations;
          }
        }
      }
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB Write Error]', err.message);
  }
}

// Work Methods
function getAllWorks() {
  const db = readDb();
  return Object.values(db.works).sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0));
}

function getWorkByRj(rjCode) {
  const db = readDb();
  return db.works[rjCode.toUpperCase()] || null;
}

function saveWork(work) {
  const db = readDb();
  const cleanRj = work.rjCode.toUpperCase();
  const workCopy = { ...work };
  delete workCopy.chapters;
  db.works[cleanRj] = {
    ...workCopy,
    rjCode: cleanRj,
    addedAt: db.works[cleanRj]?.addedAt || new Date().toISOString(),
    favorite: db.works[cleanRj]?.favorite || false
  };
  delete db.works[cleanRj].chapters;
  if (db.wishlist) {
    db.wishlist = db.wishlist.filter(w => w.rjCode !== cleanRj);
  }
  writeDb(db);
  return db.works[cleanRj];
}

function deleteWork(rjCode) {
  const db = readDb();
  const cleanRj = rjCode.toUpperCase();
  if (db.works[cleanRj]) {
    delete db.works[cleanRj];
    // Also remove from favorites playlist if present
    const favPl = (db.playlists || []).find(p => p.id === 'pl-favorites');
    if (favPl) {
      favPl.items = favPl.items.filter(it => it.rjCode !== cleanRj);
    }
    writeDb(db);
    return true;
  }
  return false;
}

function toggleFavorite(rjCode) {
  const db = readDb();
  const cleanRj = rjCode.toUpperCase();
  const work = db.works[cleanRj];

  if (work) {
    const isFav = !work.favorite;
    work.favorite = isFav;

    db.playlists = db.playlists || [];
    let favPl = db.playlists.find(p => p.id === 'pl-favorites');
    if (!favPl) {
      favPl = {
        id: 'pl-favorites',
        name: '❤️ Favorites',
        description: 'Your favorited audio tracks and ASMR sessions',
        coverUrl: work.coverUrl || '',
        items: [],
        createdAt: new Date().toISOString()
      };
      db.playlists.unshift(favPl);
    }

    if (isFav) {
      const exists = favPl.items.some(it => it.rjCode === cleanRj);
      if (!exists) {
        favPl.items.push({
          rjCode: cleanRj,
          trackId: 1,
          title: work.title,
          workTitle: work.title,
          cv: work.cv || '',
          poster: work.coverUrl || ''
        });
        if (!favPl.coverUrl) favPl.coverUrl = work.coverUrl;
      }
    } else {
      favPl.items = favPl.items.filter(it => it.rjCode !== cleanRj);
    }

    writeDb(db);
    return isFav;
  }
  return false;
}

// Playlist Methods
function getAllPlaylists() {
  const db = readDb();
  return db.playlists || [];
}

function createPlaylist(name, description = '') {
  const db = readDb();
  const newPl = {
    id: 'pl-' + Date.now(),
    name,
    description,
    coverUrl: '',
    items: [],
    createdAt: new Date().toISOString()
  };
  db.playlists = db.playlists || [];
  db.playlists.push(newPl);
  writeDb(db);
  return newPl;
}

function deletePlaylist(id) {
  const db = readDb();
  db.playlists = (db.playlists || []).filter(p => p.id !== id);
  writeDb(db);
  return true;
}

function addToPlaylist(playlistId, item) {
  const db = readDb();
  const plId = decodeURIComponent(playlistId || '').trim();
  const pl = (db.playlists || []).find(p => String(p.id).trim() === plId || String(p.id) === String(playlistId).trim());
  if (pl) {
    pl.items = pl.items || [];
    pl.items.push(item);
    if (!pl.coverUrl && item.poster) pl.coverUrl = item.poster;
    writeDb(db);
    return pl;
  }
  return null;
}

function removeFromPlaylist(playlistId, index) {
  const db = readDb();
  const pl = (db.playlists || []).find(p => p.id === playlistId);
  if (pl && pl.items[index]) {
    pl.items.splice(index, 1);
    writeDb(db);
    return pl;
  }
  return null;
}

// Aggregation Methods (Artists & Genres)
function getAllTags() {
  const db = readDb();
  const works = getAllWorks();
  const cvNamesSet = new Set();
  
  works.forEach(w => {
    const rawCv = getWorkCV(w);
    if (rawCv && rawCv !== 'N/A') {
      rawCv.split(/[,、/&＋+;・\n|]/).forEach(c => {
        const clean = cleanCVName(c);
        if (clean) cvNamesSet.add(clean.toLowerCase());
      });
    }
  });
  Object.entries(db.tagDict || BASE_TAG_DICT || {}).forEach(([k, v]) => {
    if (v && v.isCV) {
      cvNamesSet.add(k.toLowerCase());
      if (v.romaji) cvNamesSet.add(v.romaji.toLowerCase());
    }
  });

  const tagCounts = {};
  works.forEach(w => {
    (w.tags || []).forEach(t => {
      const clean = (t || '').trim();
      if (!clean || cvNamesSet.has(clean.toLowerCase())) return;
      const entry = db.tagDict?.[clean] || BASE_TAG_DICT[clean];
      if (entry && entry.isCV) return;
      tagCounts[clean] = (tagCounts[clean] || 0) + 1;
    });
  });
  const tags = Object.entries(tagCounts)
    .map(([name, count]) => ({
      name,
      count,
      en: db.tagDict?.[name] || BASE_TAG_DICT[name] || ''
    }))
    .sort((a, b) => b.count - a.count);
  return { tags, tagDict: db.tagDict || BASE_TAG_DICT };
}

function getAllArtists() {
  const works = getAllWorks();
  const artistCounts = {};
  works.forEach(w => {
    const rawCv = getWorkCV(w);
    if (rawCv && rawCv !== 'N/A') {
      const cvParts = rawCv.split(/[,、;&\n]/).map(s => s.trim()).filter(Boolean);
      const extractedCvs = [];
      for (const part of cvParts) {
        let ja = '';
        const bracketMatch = part.match(/【([^】]+)】|（([^）]+)）|\(([^)]+)\)|\[([^\]]+)\]/);
        if (bracketMatch) {
          const inside = (bracketMatch[1] || bracketMatch[2] || bracketMatch[3] || bracketMatch[4] || '').trim();
          const outside = part.replace(bracketMatch[0], '').trim();
          const isInsideJa = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(inside);
          if (isInsideJa) ja = inside;
          else ja = outside || inside;
        } else if (part.includes('/')) {
          const sub = part.split('/').map(x => x.trim()).filter(Boolean);
          const jaSub = sub.find(x => /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(x));
          ja = jaSub || sub[0];
        } else {
          ja = part;
        }
        ja = cleanCVName(ja);
        if (ja && ja !== 'N/A') extractedCvs.push(ja);
      }
      Array.from(new Set(extractedCvs)).forEach(cv => {
        artistCounts[cv] = (artistCounts[cv] || 0) + 1;
      });
    }
  });
  return Object.entries(artistCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

function getSettings() {
  const db = readDb();
  return db.settings || { contentMode: 'NSFW' };
}

function updateSettings(settings) {
  const db = readDb();
  db.settings = { ...(db.settings || {}), ...settings };
  writeDb(db);
  return db.settings;
}

function getHistory() {
  const db = readDb();
  return db.history || [];
}

function addHistoryEntry(entry) {
  if (!entry || !entry.rjCode) return getHistory();
  const db = readDb();
  db.history = db.history || [];
  const item = {
    rjCode: entry.rjCode,
    title: entry.title || '',
    trackTitle: entry.trackTitle || '',
    trackIndex: entry.trackIndex || 0,
    coverUrl: entry.coverUrl || '',
    cv: entry.cv || '',
    circle: entry.circle || '',
    playedAt: entry.playedAt || new Date().toISOString()
  };
  db.history = db.history.filter(h => h.rjCode !== entry.rjCode);
  db.history.unshift(item);
  if (db.history.length > 20) db.history = db.history.slice(0, 20);
  writeDb(db);
  return db.history;
}

function clearHistory() {
  const db = readDb();
  db.history = [];
  writeDb(db);
  return [];
}

function getWishlist() {
  const db = readDb();
  return db.wishlist || [];
}

function saveWishlistItem(entry) {
  if (!entry || !entry.rjCode) return getWishlist();
  const db = readDb();
  db.wishlist = db.wishlist || [];
  const cleanRj = entry.rjCode.toUpperCase().trim();
  
  // If already in works library, don't keep in wishlist
  if (db.works && db.works[cleanRj]) return db.wishlist;

  const item = {
    rjCode: cleanRj,
    title: entry.title || `Work ${cleanRj}`,
    coverUrl: entry.coverUrl || '',
    cv: entry.cv || '',
    circle: entry.circle || '',
    reason: entry.reason || 'Pending crawler / audio stream',
    addedAt: entry.addedAt || new Date().toISOString()
  };

  const idx = db.wishlist.findIndex(w => w.rjCode === cleanRj);
  if (idx >= 0) {
    db.wishlist[idx] = { ...db.wishlist[idx], ...item };
  } else {
    db.wishlist.unshift(item);
  }
  writeDb(db);
  return db.wishlist;
}

function removeWishlistItem(rjCode) {
  const db = readDb();
  const cleanRj = (rjCode || '').toUpperCase().trim();
  db.wishlist = (db.wishlist || []).filter(w => w.rjCode !== cleanRj);
  writeDb(db);
  return db.wishlist;
}

function cleanWishlistDuplicates() {
  const db = readDb();
  const initialCount = (db.wishlist || []).length;
  const works = db.works || {};
  db.wishlist = (db.wishlist || []).filter(item => !works[item.rjCode]);
  const removedCount = initialCount - db.wishlist.length;
  writeDb(db);
  return { removedCount, remaining: db.wishlist.length, wishlist: db.wishlist };
}

function preStashWishlistItems(items) {
  const db = readDb();
  if (!db.wishlist) db.wishlist = [];
  if (!db.works) db.works = {};
  if (!Array.isArray(items) || items.length === 0) return db.wishlist;

  let addedCount = 0;
  for (const it of items) {
    if (!it) continue;
    let cleanRj = '';
    let entry = {};
    if (typeof it === 'string') {
      const match = it.match(/(?:RJ|VJ|BJ)[ -]*([0-9]{4,10})/i) || it.match(/[0-9]{4,10}/);
      if (match) {
        const prefMatch = it.match(/(RJ|VJ|BJ)/i);
        const pref = prefMatch ? prefMatch[1].toUpperCase() : 'RJ';
        cleanRj = pref + (match[1] || match[0]);
      }
    } else if (typeof it === 'object') {
      cleanRj = (it.rjCode || it.rj || it.id || '').toUpperCase().trim();
      entry = it;
    }

    if (!cleanRj) continue;
    if (db.works[cleanRj]) continue;

    const item = {
      rjCode: cleanRj,
      title: entry.title || `Work ${cleanRj}`,
      coverUrl: entry.coverUrl || '',
      cv: entry.cv || '',
      circle: entry.circle || '',
      reason: entry.reason || 'Pending batch crawler / audio stream',
      addedAt: entry.addedAt || new Date().toISOString()
    };

    const idx = db.wishlist.findIndex(w => w.rjCode === cleanRj);
    if (idx >= 0) {
      db.wishlist[idx] = { ...db.wishlist[idx], ...item };
    } else {
      db.wishlist.unshift(item);
    }
    addedCount++;
  }

  if (addedCount > 0) {
    writeDb(db);
  }
  return db.wishlist;
}

function clearWishlist() {
  const db = readDb();
  db.wishlist = [];
  writeDb(db);
  return [];
}

module.exports = {
  getAllWorks,
  getWorkByRj,
  getWork: getWorkByRj,
  saveWork,
  deleteWork,
  toggleFavorite,
  getAllPlaylists,
  createPlaylist,
  deletePlaylist,
  addToPlaylist,
  removeFromPlaylist,
  getAllTags,
  getAllArtists,
  getSettings,
  updateSettings,
  getHistory,
  addHistoryEntry,
  clearHistory,
  getWishlist,
  saveWishlistItem,
  preStashWishlistItems,
  removeWishlistItem,
  cleanWishlistDuplicates,
  clearWishlist,
  readDb,
  BASE_TAG_DICT,
  mergeTagDict,
  cleanCVName,
  normalizeCVRomaji,
  getWorkCV,
  formatTag,
  formatCV,
  SFW_DISGUISE_RJ_LIST
};
