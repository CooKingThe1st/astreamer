// 26 Curated SFW Cover Arts for PSFW Disguise Mode
const SFW_DISGUISE_LIST = [
  'RJ01681691', 'RJ01678330', 'RJ01694805', 'RJ01688728', 'RJ01693711',
  'RJ335043', 'RJ01360841', 'RJ346413', 'RJ01229288', 'RJ321035',
  'RJ317278', 'RJ387519', 'RJ370190', 'RJ343025', 'RJ373001',
  'RJ01144236', 'RJ336447', 'RJ329940', 'RJ403038', 'RJ370099',
  'RJ299717', 'RJ01323001', 'RJ363741', 'RJ333531', 'RJ357211', 'RJ01040461'
];

const NSFW_KEYWORDS = [
  'nsfw', '18禁', 'r18', 'r-18', 'adult', 'erotic', 'futanari', 'hentai',
  '手コキ', '中出し', 'オナサポ', '乳首責め', '乳首', 'オナホ', 'セックス',
  '騎乗位', '交尾', '精飲', 'フェラ', 'パイズリ', 'アナル', '潮吹き', '痴女',
  'バイブ', '拘束', '催眠', '洗脳', '絶頂', '連続絶頂', '常識改変', 'インモラル',
  '乱交', '射精', '射精管理', '快楽堕ち', 'おまんこ', 'ちんぽ', 'ちんこ', '性力',
  'オホ声', 'オホ', '奉仕', '寸止め', 'ザーメン', '搾精', '淫乱', '発情',
  'メス堕ち', 'アヘ顔', '肉便器', 'マゾ', 'サド', '調教', '言葉責め', '責め',
  '愛撫', 'クンニ', '巨乳', '爆乳', '貧乳', '微乳', '催眠音声', '退廃',
  '背徳', '強制', '無理矢理', '媚び', '服従', '淫惑', '性器', '淫具', '孕'
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

// Seed Data for Initial Boot
const SEED_DATA = {
  version: 1,
  works: {},
  playlists: [],
  history: [],
  wishlist: [],
  tagDict: BASE_TAG_DICT,
  settings: { contentMode: 'NSFW' }
};

// In-Memory Database fallback (if KV is not yet bound)
let memoryDb = JSON.parse(JSON.stringify(SEED_DATA));

async function getDb(env) {
  if (env && env.ASTREAMER_KV) {
    const raw = await env.ASTREAMER_KV.get('astreamer_db', 'json');
    if (raw) {
      raw.tagDict = Object.assign({}, BASE_TAG_DICT, raw.tagDict || {});
      return raw;
    }
    const initial = JSON.parse(JSON.stringify(SEED_DATA));
    initial.tagDict = Object.assign({}, BASE_TAG_DICT);
    await env.ASTREAMER_KV.put('astreamer_db', JSON.stringify(initial));
    return initial;
  }
  memoryDb.tagDict = Object.assign({}, BASE_TAG_DICT, memoryDb.tagDict || {});
  return memoryDb;
}

async function saveDb(env, data) {
  if (!data) return;
  // Never save chapter arrays to KV: keep KV payload clean, lightweight, and write quota minimal
  if (data.works && typeof data.works === 'object') {
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
  if (env && env.ASTREAMER_KV) {
    await env.ASTREAMER_KV.put('astreamer_db', JSON.stringify(data));
  } else {
    memoryDb = data;
  }
}

const FALLBACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1e2e"/>
      <stop offset="100%" stop-color="#11111b"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="16" fill="url(#bgGrad)"/>
  <circle cx="200" cy="180" r="54" fill="#28293d"/>
  <text x="200" y="195" font-family="system-ui, -apple-system, sans-serif" font-size="44" text-anchor="middle" fill="#89b4fa">🎧</text>
  <text x="200" y="270" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="700" fill="#a6adc8" text-anchor="middle">ASMR Cover</text>
</svg>`;

function getDlsiteCoverBucket(rjCode) {
  const clean = (rjCode || '').toUpperCase().trim();
  const match = clean.match(/^(?:RJ|VJ|BJ)?(\d+)$/i);
  if (!match) return clean;
  const pref = (clean.match(/^(RJ|VJ|BJ)/i) || [])[1] || 'RJ';
  const digits = match[1];
  const num = parseInt(digits, 10);
  const bucketNum = Math.ceil(num / 1000) * 1000;
  return pref.toUpperCase() + String(bucketNum).padStart(digits.length, '0');
}

function formatServerTime(secs) {
  if (isNaN(secs) || secs < 0) return '00:00';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  if (h > 0) {
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}
const formatTime = formatServerTime;


function getCoverCandidates(targetUrl, rjCode) {
  const candidates = [];
  if (targetUrl) {
    let u = targetUrl.trim();
    if (u.startsWith('//')) u = 'https:' + u;
    candidates.push(u);
  }

  let cleanRj = rjCode ? rjCode.toUpperCase().trim() : '';
  if (!cleanRj && targetUrl) {
    const m = targetUrl.match(/(?:RJ|VJ|BJ)?\d{6,8}/i);
    if (m) cleanRj = m[0].toUpperCase();
  }

  if (cleanRj) {
    const m = cleanRj.match(/^(?:(RJ|VJ|BJ))?(\d+)$/i);
    const pref = (m && m[1]) ? m[1].toUpperCase() : 'RJ';
    const digits = m ? m[2] : cleanRj.replace(/\D/g, '');
    const standardRj = pref + digits;
    const cleanNum = digits.replace(/^0+/, '');
    const bucket = getDlsiteCoverBucket(standardRj);

    const list = [
      `https://img.dlsite.jp/modpub/images2/work/doujin/${bucket}/${standardRj}_img_main.jpg`,
      `https://img.dlsite.jp/modpub/images2/work/pro/${bucket}/${standardRj}_img_main.jpg`,
      `https://img.dlsite.jp/modpub/images2/work/books/${bucket}/${standardRj}_img_main.jpg`,
      `https://api.asmr-200.com/api/cover/${cleanNum}.jpg?type=main`,
      `https://api.asmr-200.com/api/cover/${cleanNum}.jpg`,
      `https://api.asmr-200.com/api/cover/${digits}.jpg?type=main`,
      `https://api.asmr-200.com/api/cover/${digits}.jpg`,
      `https://pic.weeabo0.xyz/${standardRj}_img_main.jpg`,
      `https://pic.weeabo0.xyz/${standardRj}_img_main.webp`,
      `https://img.dlsite.jp/modpub/images2/work/doujin/${bucket}/${standardRj}_img_sam.jpg`
    ];

    for (const item of list) {
      if (!candidates.includes(item)) candidates.push(item);
    }
  }

  return candidates;
}

function parseIsoDuration(str) {
  if (!str) return 0;
  const m = str.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i);
  if (m && (m[1] || m[2] || m[3])) {
    const h = parseInt(m[1] || '0', 10);
    const min = parseInt(m[2] || '0', 10);
    const s = parseInt(m[3] || '0', 10);
    return h * 3600 + min * 60 + s;
  }
  const hm = str.match(/(?:(\d+)\s*h(?:ours?)?)?\s*(?:(\d+)\s*m(?:in(?:utes?)?)?)?\s*(?:(\d+)\s*s(?:ec(?:onds?)?)?)?/i);
  if (hm && (hm[1] || hm[2] || hm[3])) {
    return parseInt(hm[1] || '0', 10) * 3600 + parseInt(hm[2] || '0', 10) * 60 + parseInt(hm[3] || '0', 10);
  }
  const col = str.match(/(?:(\d+):)?(\d+):(\d+)/);
  if (col) {
    if (col[1]) return parseInt(col[1], 10) * 3600 + parseInt(col[2], 10) * 60 + parseInt(col[3], 10);
    return parseInt(col[2], 10) * 60 + parseInt(col[3], 10);
  }
  return 0;
}

function parseFileSizeToBytes(str) {
  if (!str) return 0;
  const m = str.match(/([0-9.]+)\s*(GB|MB|KB|G|M|K)B?/i);
  if (!m) return 0;
  const val = parseFloat(m[1]);
  const unit = m[2].toUpperCase();
  if (unit.startsWith('G')) return Math.round(val * 1024 * 1024 * 1024);
  if (unit.startsWith('M')) return Math.round(val * 1024 * 1024);
  if (unit.startsWith('K')) return Math.round(val * 1024);
  return Math.round(val);
}

// Strategy H: HentaiASMR REST API & Direct Media CDN Probe (Zero HTML scraping)
async function fetchHentaiAsmrMetadata(cleanRj, options = {}) {
  const cleanUpper = (cleanRj || '').toUpperCase().trim();
  const cleanLower = (cleanRj || '').toLowerCase().trim();
  if (!cleanUpper) return null;
  const skipAudioProbe = Boolean(options && options.skipAudioProbe);

  // 1. Query WordPress REST API by slug (e.g. ?slug=rj01702393) then fallback to ?search=RJ01702393
  const apiUrls = [
    `https://hentaiasmr.moe/wp-json/wp/v2/posts?slug=${encodeURIComponent(cleanLower)}&_embed=1`,
    `https://hentaiasmr.moe/wp-json/wp/v2/posts?search=${encodeURIComponent(cleanUpper)}&_embed=1`
  ];

  let post = null;
  for (const url of apiUrls) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*'
        }
      });
      if (res.ok) {
        const posts = await res.json();
        if (Array.isArray(posts) && posts.length > 0) {
          const match = posts.find(p => {
            const pSlug = (p.slug || '').toLowerCase();
            const pTitle = (p.title?.rendered || '').toUpperCase();
            return pSlug === cleanLower || pTitle.includes(cleanUpper) || (p.content?.rendered || '').includes(cleanUpper);
          }) || posts[0];
          if (match) {
            post = match;
            break;
          }
        }
      }
    } catch (e) {}
  }

  if (!post || !post.id) return null;

  const postId = post.id;
  const rawTitle = (post.title?.rendered || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&#038;/g, '&')
    .replace(/^\[(?:RJ|VJ|BJ)\d+\]\s*/i, '')
    .trim();

  // Cover image
  let coverUrl = '';
  if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
    const media = post._embedded['wp:featuredmedia'][0];
    coverUrl = media.source_url || media.media_details?.sizes?.full?.source_url || '';
  }

  // Terms: tags, actors, categories
  const tags = [];
  const tagTranslations = {};
  const cvList = [];
  let cvJa = '';
  let cvRomaji = '';

  if (post._embedded && Array.isArray(post._embedded['wp:term'])) {
    for (const group of post._embedded['wp:term']) {
      if (!Array.isArray(group)) continue;
      for (const term of group) {
        if (!term || !term.name) continue;
        const tName = term.name.trim();
        const taxonomy = term.taxonomy || '';
        
        let rawSlug = term.slug || '';
        try { rawSlug = decodeURIComponent(rawSlug); } catch (e) {}

        if (taxonomy === 'actors' || taxonomy === 'cv') {
          tName.split(/[,、/&＋+;・]/).forEach(c => {
            const cleanC = c.replace(/様|さん|氏|他|'/g, '').trim();
            if (cleanC && cleanC.length >= 2 && !cvList.includes(cleanC)) {
              cvList.push(cleanC);
            }
          });
          if (!cvJa && cvList.length > 0) cvJa = cvList[0];
          if (rawSlug && /[a-zA-Z]/.test(rawSlug)) {
            const rom = normalizeCVRomaji(tName, rawSlug.replace(/-/g, ' '));
            if (!cvRomaji) cvRomaji = rom;
            tagTranslations[tName] = { romaji: rom, isCV: true };
            if (typeof BASE_TAG_DICT !== 'undefined') {
              BASE_TAG_DICT[tName] = { romaji: rom, isCV: true };
            }
          }
        } else if (taxonomy === 'post_tag' || taxonomy === 'category') {
          if (tName && !tags.includes(tName) && !['NSFW', 'SFW', 'Uncategorized'].includes(tName)) {
            tags.push(tName);
          }
        }
      }
    }
  }

  const cv = cvList.join(', ');

  // 2. Direct Media CDN Probe for Audio Files (Skip if skipAudioProbe is requested)
  const singleTrackCandidates = [];

  // Unescape content HTML and extract embedded audio URLs
  const unescapedContent = (post.content?.rendered || '')
    .replace(/\\\//g, '/')
    .replace(/&#8217;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
  const contentUrls = unescapedContent.match(/https?:\/\/[^\s"'<>]+\.(?:mp3|m4a|wav|ogg|flac|m3u8)/gi) || [];
  contentUrls.forEach(u => {
    if (u && !singleTrackCandidates.includes(u)) singleTrackCandidates.push(u);
  });

  // Discovered Single-Track Patterns across CDN endpoints
  const singlePatterns = [
    `https://cdn16.hentaiasmr.moe/audio/${postId}.mp3`,
    `https://cdn.hentaiasmr.moe/audio/${postId}.mp3`,
    `https://cdn-otome.hentaiasmr.moe/audio/${postId}.mp3`,
    `https://cdn.hentaiasmr.moe/mp4/${postId}.mp3`,
    `https://cdn16.hentaiasmr.moe/mp4/${postId}.mp3`,
    `https://cdn-otome.hentaiasmr.moe/mp4/${postId}.mp3`,
    `https://cdn.hentaiasmr.moe/mf/${postId}/merge/${cleanUpper}.mp3`,
    `https://cdn16.hentaiasmr.moe/mf/${postId}/merge/${cleanUpper}.mp3`,
    `https://cdn-otome.hentaiasmr.moe/mf/${postId}/merge/${cleanUpper}.mp3`,
    `https://cdn.hentaiasmr.moe/audio/${cleanUpper}.mp3`,
    `https://cdn16.hentaiasmr.moe/audio/${cleanUpper}.mp3`
  ];
  singlePatterns.forEach(u => {
    if (!singleTrackCandidates.includes(u)) singleTrackCandidates.push(u);
  });

  const probeReferer = post.link || `https://hentaiasmr.moe/${cleanLower}.html`;
  const probeHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Referer': probeReferer,
    'Origin': 'https://hentaiasmr.moe',
    'Accept': '*/*'
  };

  async function probeMediaCandidate(targetUrl) {
    if (!targetUrl) return null;
    try {
      let res = await fetch(encodeURI(targetUrl), {
        method: 'GET',
        headers: {
          ...probeHeaders,
          'Range': 'bytes=0-0'
        }
      });
      if (!res.ok && res.status !== 206 && res.status !== 301 && res.status !== 302 && res.status !== 307) {
        try {
          const headRes = await fetch(encodeURI(targetUrl), {
            method: 'HEAD',
            headers: probeHeaders
          });
          if (headRes.ok || (headRes.status >= 200 && headRes.status < 400)) {
            res = headRes;
          }
        } catch (he) {}
      }
      if (res.ok || res.status === 206 || (res.status >= 200 && res.status < 400)) {
        let size = 0;
        const cr = res.headers.get('content-range');
        if (cr) {
          const m = cr.match(/\/(\d+)/);
          if (m) size = parseInt(m[1], 10);
        }
        if (!size) size = parseInt(res.headers.get('content-length') || '0', 10);
        return { ok: true, size };
      }
    } catch (e) {}
    return null;
  }

  const audioTracks = [];
  let foundPattern = null;
  const triedUrls = [];

  if (!skipAudioProbe) {
    for (const mergeUrl of singleTrackCandidates) {
      triedUrls.push(mergeUrl);
      const probe = await probeMediaCandidate(mergeUrl);
      if (probe && probe.ok) {
        audioTracks.push({
          index: 1,
          title: `${rawTitle || cleanUpper} (Full)`,
          rawTitle: `${cleanUpper}.mp3`,
          streamUrl: mergeUrl,
          category: 'main',
          _size: probe.size || 0,
          isHls: false
        });
        foundPattern = mergeUrl.includes('/audio/') ? 'audio_direct' : (mergeUrl.includes('/mp4/') ? 'mp4_direct' : 'merge');
        break;
      }
    }

    // Variation B: Multi-track -> /mf/{id}/1.mp3, 2.mp3, 3.mp3...
    if (audioTracks.length === 0) {
      const cdnBases = [
        'https://cdn.hentaiasmr.moe/mf/',
        'https://cdn16.hentaiasmr.moe/mf/',
        'https://cdn-otome.hentaiasmr.moe/mf/'
      ];

      for (const cdn of cdnBases) {
        let trackNum = 1;
        let consecutiveMisses = 0;
        while (trackNum <= 40 && consecutiveMisses === 0) {
          const tUrl = `${cdn}${postId}/${trackNum}.mp3`;
          triedUrls.push(tUrl);
          const probe = await probeMediaCandidate(tUrl);
          if (probe && probe.ok) {
            audioTracks.push({
              index: trackNum,
              title: `Track ${trackNum}`,
              rawTitle: `${trackNum}.mp3`,
              streamUrl: tUrl,
              category: trackNum === 1 ? 'main' : (trackNum === 2 ? 'freetalk' : 'bonus'),
              _size: probe.size || 0,
              isHls: false
            });
            foundPattern = 'multitrack';
            trackNum++;
          } else {
            consecutiveMisses++;
          }
        }
        if (audioTracks.length > 0) break;
      }
    }
  }

  const isAudioFound = audioTracks.length > 0;
  const diagnostic = (!isAudioFound && postId) ? {
    rjCode: cleanUpper,
    postId,
    slug: post.slug,
    postLink: post.link || `https://hentaiasmr.moe/${cleanLower}.html`,
    title: rawTitle,
    triedUrls
  } : null;

  return {
    postId,
    title: rawTitle,
    circle: 'ASMR Circle',
    cv: cvJa ? (cvRomaji ? `${cvJa} (${cvRomaji})` : cvJa) : (cv || 'N/A'),
    cvJa,
    cvRomaji,
    releaseDate: '',
    series: '',
    duration: 0,
    totalBytes: audioTracks.reduce((sum, t) => sum + (t._size || 0), 0),
    tags,
    tagTranslations,
    rawCoverUrl: coverUrl,
    audioTracks,
    foundPattern,
    diagnostic,
    isAudioFound,
    isNsfw: true
  };
}

// Resolver: Unified Multi-Source (ASMR.one + DLsite API + Product Page HTML + CDN Probe)
async function resolveRjWork(rjCode) {
  const cleanRj = rjCode.toUpperCase();
  const cleanNum = cleanRj.replace(/^(?:RJ|VJ|BJ)/i, '');

  let title = '';
  let circle = '';
  let cv = '';
  let tags = [];
  const tagTranslations = {};
  let coverUrl = '';
  let isAdult = true;

  // Source 1: ASMR.one Public API (Rich tags & Voice Actors)
  const asmrHosts = [
    'https://api.asmr.one',
    'https://api.asmr-200.com',
    'https://api.asmr-300.com',
    'https://api.asmr-100.com'
  ];

  for (const host of asmrHosts) {
    try {
      const asmrRes = await fetch(`${host}/api/work/${cleanNum}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Referer': 'https://www.asmr.one/'
        }
      });
      if (asmrRes.ok) {
        const data = await asmrRes.json();
        if (data) {
          if (data.title) title = data.title;
          if (data.circle?.name) circle = data.circle.name;
          if (Array.isArray(data.vas) && data.vas.length > 0) {
            cv = data.vas.map(v => v.name).join(', ');
          }
          if (Array.isArray(data.tags)) {
            data.tags.forEach(t => {
              const name = t.name || (typeof t === 'string' ? t : '');
              if (name && !tags.includes(name)) tags.push(name);
              const en = t.i18n?.['en-us']?.name || t.i18n?.['en']?.name || (BASE_TAG_DICT[name] || '');
              if (name && en && name !== en) {
                tagTranslations[name] = en;
              }
            });
          }
          if (!coverUrl && data.mainCoverUrl) coverUrl = data.mainCoverUrl;
          if (!coverUrl && data.thumbnailCoverUrl) coverUrl = data.thumbnailCoverUrl;
          if (!coverUrl && data.samCoverUrl) coverUrl = data.samCoverUrl;
          if (data.age_category === 1 || data.age_category_string === 'general' || data.rating === 'general') {
            isAdult = false;
          } else if (data.age_category === 3 || data.rating === 'adult' || data.rating === 'r18') {
            isAdult = true;
          }
          if (title) break;
        }
      }
    } catch (e) {}
  }

  // Source 2: Official DLsite JSON API
  const divisions = ['maniax', 'home', 'girls', 'pro', 'books'];
  for (const div of divisions) {
    try {
      const dlsiteRes = await fetch(`https://www.dlsite.com/${div}/api/=/product.json?workno=${cleanRj}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept-Language': 'ja,en;q=0.9'
        }
      });
      if (dlsiteRes.ok) {
        const data = await dlsiteRes.json();
        if (data && data.length > 0) {
          const item = data[0];
          if (!title) title = item.work_name || '';
          if (!circle) circle = item.maker_name || '';
          if (!cv || cv === 'N/A') {
            if (Array.isArray(item.voice_actor)) cv = item.voice_actor.join(', ');
            else if (typeof item.voice_actor === 'string') cv = item.voice_actor;
            else if (item.creators && item.creators.voice_actor) {
              cv = item.creators.voice_actor.map(v => v.name || v).join(', ');
            }
          }
          if (Array.isArray(item.genres)) {
            item.genres.forEach(g => {
              const name = g.name || (typeof g === 'string' ? g : '');
              if (name && !tags.includes(name)) tags.push(name);
              if (name && BASE_TAG_DICT[name]) {
                tagTranslations[name] = BASE_TAG_DICT[name];
              }
            });
          }
          if (!coverUrl) {
            let img = item.image_main?.url || item.image_main || item.work_image || '';
            if (typeof img === 'string') {
              if (img.startsWith('//')) img = 'https:' + img;
              if (img.startsWith('http')) coverUrl = img;
            }
          }
          isAdult = (item.age_category === 1 || item.age_category_string === 'general') ? false : true;
          break;
        }
      }
    } catch (e) {}
  }

  let series = '';
  let releaseDate = '';

  // Source 3: HentaiASMR REST API Fallback (Rich Japanese/Romaji CVs, Series, Releases, Tags)
  let moeMetaForResolve = null;
  if (!title || !cv || cv === 'N/A' || !circle || tags.length < 3) {
    try {
      moeMetaForResolve = await fetchHentaiAsmrMetadata(cleanRj, { skipAudioProbe: true });
      if (moeMetaForResolve) {
        if (!title && moeMetaForResolve.title) title = moeMetaForResolve.title;
        if ((!circle || circle === 'ASMR Circle') && moeMetaForResolve.circle) circle = moeMetaForResolve.circle;
        if ((!cv || cv === 'N/A') && moeMetaForResolve.cv) cv = moeMetaForResolve.cv;
        if (moeMetaForResolve.series) {
          series = moeMetaForResolve.series;
          if (!tags.includes(moeMetaForResolve.series)) tags.push(moeMetaForResolve.series);
        }
        if (moeMetaForResolve.releaseDate) releaseDate = moeMetaForResolve.releaseDate;
        if (Array.isArray(moeMetaForResolve.tags)) {
          moeMetaForResolve.tags.forEach(t => {
            if (t && !tags.includes(t)) tags.push(t);
          });
        }
        if (!coverUrl && moeMetaForResolve.rawCoverUrl) coverUrl = moeMetaForResolve.rawCoverUrl;
        if (moeMetaForResolve.cvJa && moeMetaForResolve.cvRomaji) {
          tagTranslations[moeMetaForResolve.cvJa] = { romaji: moeMetaForResolve.cvRomaji, isCV: true };
          if (typeof BASE_TAG_DICT !== 'undefined') {
            BASE_TAG_DICT[moeMetaForResolve.cvJa] = { romaji: moeMetaForResolve.cvRomaji, isCV: true };
          }
        }
      }
    } catch (e) {}
  }

  // Filter out CV names from tags
  const rawCvForDedupe = cv || getWorkCV({ title, cv });
  const cvNamesList = [];
  if (rawCvForDedupe && rawCvForDedupe !== 'N/A') {
    rawCvForDedupe.split(/[,、/&＋+;・\n|]/).forEach(c => {
      const clean = cleanCVName(c);
      if (clean) cvNamesList.push(clean.toLowerCase());
    });
  }
  tags = tags.filter(t => {
    const clean = String(t || '').trim();
    if (!clean) return false;
    if (cvNamesList.includes(clean.toLowerCase())) return false;
    const entry = BASE_TAG_DICT[clean];
    if (entry && entry.isCV) return false;
    return true;
  });
  if (tags.length === 0) tags = ['ASMR', 'Audio'];

  if (!coverUrl) {
    const bucket = getDlsiteCoverBucket(cleanRj);
    coverUrl = `https://img.dlsite.jp/modpub/images2/work/doujin/${bucket}/${cleanRj}_img_main.jpg`;
  }

  // 1. Probe JapaneseASMR (weeab0o.xyz): First check primary MP3 & M3U8 in parallel
  const mainMp3Url = `https://v.weeab0o.xyz/${cleanRj}.mp3`;
  const m3u8Url = `https://v.weeab0o.xyz/${cleanRj}.m3u8`;
  let hasHls = false;
  const japTracks = [];

  const [mainMp3Res, m3u8Res] = await Promise.all([
    fetch(mainMp3Url, { method: 'HEAD', headers: { 'Referer': 'https://japaneseasmr.com/', 'User-Agent': 'Mozilla/5.0' } }).catch(() => null),
    fetch(m3u8Url, { method: 'GET', headers: { 'Referer': 'https://japaneseasmr.com/', 'User-Agent': 'Mozilla/5.0' } }).catch(() => null)
  ]);

  if (mainMp3Res && mainMp3Res.ok) {
    const sz = parseInt(mainMp3Res.headers.get('content-length') || '0', 10);
    japTracks.push({
      id: 1,
      title: 'Track 1 (トラック1)',
      size: sz,
      formattedTime: '00:00:00',
      startTime: 0,
      isHls: false,
      category: 'main',
      rawUrl: mainMp3Url,
      referer: 'https://japaneseasmr.com/',
      streamUrl: `/stream?url=${encodeURIComponent(mainMp3Url)}&referer=${encodeURIComponent('https://japaneseasmr.com/')}`,
      poster: `/image-proxy?url=${encodeURIComponent(coverUrl)}`
    });

    // Only probe bonus & extra tracks if the primary MP3 actually exists
    const bonusCandidates = [
      { type: 'freetalk', title: 'Free Talk (フリートーク)', url: `https://v.weeab0o.xyz/${cleanRj} freetalk.mp3` },
      { type: 'freetalk', title: 'Free Talk (フリートーク)', url: `https://v.weeab0o.xyz/${cleanRj}_freetalk.mp3` },
      { type: 'freetalk', title: 'Free Talk (フリートーク)', url: `https://v.weeab0o.xyz/${cleanRj}-freetalk.mp3` },
      { type: 'freetalk', title: 'Free Talk (フリートーク)', url: `https://v.weeab0o.xyz/${cleanRj}freetalk.mp3` },
      { type: 'bonus', title: 'Omake (おまけ)', url: `https://v.weeab0o.xyz/${cleanRj}omake.mp3` },
      { type: 'bonus', title: 'Omake (おまけ)', url: `https://v.weeab0o.xyz/${cleanRj} omake.mp3` },
      { type: 'bonus', title: 'Omake (おまけ)', url: `https://v.weeab0o.xyz/${cleanRj}_omake.mp3` },
      { type: 'bonus', title: 'Omake (おまけ)', url: `https://v.weeab0o.xyz/${cleanRj}-omake.mp3` },
      { type: 'bonus', title: 'Bonus (特典)', url: `https://v.weeab0o.xyz/${cleanRj} bonus.mp3` },
      { type: 'bonus', title: 'Bonus (特典)', url: `https://v.weeab0o.xyz/${cleanRj}bonus.mp3` },
      { type: 'bonus', title: 'Bonus (特典)', url: `https://v.weeab0o.xyz/${cleanRj}_bonus.mp3` },
      { type: 'main', title: 'Track 2 (トラック2)', url: `https://v.weeab0o.xyz/${cleanRj} 2.mp3` },
      { type: 'main', title: 'Track 3 (トラック3)', url: `https://v.weeab0o.xyz/${cleanRj} 3.mp3` },
      { type: 'main', title: 'Track 4 (トラック4)', url: `https://v.weeab0o.xyz/${cleanRj} 4.mp3` },
      { type: 'main', title: 'Track 5 (トラック5)', url: `https://v.weeab0o.xyz/${cleanRj} 5.mp3` },
      { type: 'main', title: 'Track 6 (トラック6)', url: `https://v.weeab0o.xyz/${cleanRj} 6.mp3` },
      { type: 'main', title: 'Track 7 (トラック7)', url: `https://v.weeab0o.xyz/${cleanRj} 7.mp3` },
      { type: 'main', title: 'Track 8 (トラック8)', url: `https://v.weeab0o.xyz/${cleanRj} 8.mp3` },
      { type: 'main', title: 'Track 2 (トラック2)', url: `https://v.weeab0o.xyz/${cleanRj}_2.mp3` },
      { type: 'main', title: 'Track 3 (トラック3)', url: `https://v.weeab0o.xyz/${cleanRj}_3.mp3` },
      { type: 'main', title: 'Track 2 (トラック2)', url: `https://v.weeab0o.xyz/${cleanRj}-2.mp3` },
      { type: 'main', title: 'Track 3 (トラック3)', url: `https://v.weeab0o.xyz/${cleanRj}-3.mp3` }
    ];

    const bonusChecks = await Promise.all(
      bonusCandidates.map(async (c) => {
        try {
          const res = await fetch(encodeURI(c.url), {
            method: 'HEAD',
            headers: { 'Referer': 'https://japaneseasmr.com/', 'User-Agent': 'Mozilla/5.0' }
          });
          if (res.ok) {
            const sz = parseInt(res.headers.get('content-length') || '0', 10);
            return { ...c, size: sz };
          }
        } catch (e) {}
        return null;
      })
    );

    let trkIndex = 2;
    for (const b of bonusChecks) {
      if (b) {
        japTracks.push({
          id: trkIndex++,
          title: b.title,
          size: b.size,
          formattedTime: '00:00:00',
          startTime: 0,
          isHls: false,
          category: b.type,
          rawUrl: b.url,
          referer: 'https://japaneseasmr.com/',
          streamUrl: `/stream?url=${encodeURIComponent(b.url)}&referer=${encodeURIComponent('https://japaneseasmr.com/')}`,
          poster: `/image-proxy?url=${encodeURIComponent(coverUrl)}`
        });
      }
    }
  } else if (m3u8Res && m3u8Res.ok) {
    try {
      const manifest = await m3u8Res.text();
      if (manifest.includes('#EXTM3U')) {
        hasHls = true;
        let m3u8Secs = 0;
        const extinfMatches = manifest.match(/#EXTINF:([0-9.]+)/g) || [];
        extinfMatches.forEach(m => {
          const s = parseFloat(m.replace('#EXTINF:', ''));
          if (!isNaN(s)) m3u8Secs += s;
        });
        const estBytes = Math.round(m3u8Secs * 16000); // ~128kbps audio estimation
        japTracks.push({
          id: 1,
          title: title ? `01. ${title}` : '01. Audio Track',
          duration: Math.round(m3u8Secs),
          size: estBytes,
          formattedTime: m3u8Secs > 0 ? formatServerTime(Math.round(m3u8Secs)) : '00:00:00',
          startTime: 0,
          isHls: true,
          category: 'main',
          rawUrl: m3u8Url,
          referer: 'https://japaneseasmr.com/',
          streamUrl: `/stream?url=${encodeURIComponent(m3u8Url)}&referer=${encodeURIComponent('https://japaneseasmr.com/')}`,
          poster: `/image-proxy?url=${encodeURIComponent(coverUrl)}`
        });
      }
    } catch (e) {}
  }

  // 2. Fetch Ground-Truth Reference Tracks from ASMR.one or DLsite
  let gtTracks = [];
  try {
    const cleanNum = cleanRj.replace(/^(?:RJ|VJ|BJ)/i, '');
    const trackIdsToTry = [cleanNum, cleanNum.replace(/^0+/, '')];
    const apiHosts = ['https://api.asmr.one', 'https://api.asmr-200.com', 'https://api.asmr-300.com', 'https://api.asmr-100.com'];
    
    for (const tid of trackIdsToTry) {
      if (!tid) continue;
      for (const host of apiHosts) {
        try {
          const asmrRes = await fetch(`${host}/api/tracks/${tid}`, {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }
          });
          if (asmrRes.ok) {
            const treeData = await asmrRes.json();
            if (Array.isArray(treeData) && treeData.length > 0) {
              const audioList = [];
              const isBonus = (t) => /(特典|おまけ|bonus|extra|ex_|sp_|後日談|アフター|ショートストーリー|ss)/i.test(t || '');
              const isTalk = (t) => /(フリートーク|free[\s_-]?talk|talk|座談会|キャストコメント)/i.test(t || '');
              const isSamp = (t) => /(サンプル|sample|体験版|予告|試聴|pv|ダイジェスト|digest|\.mp4|\.mkv)/i.test(t || '');

              const trav = (items, folder = '') => {
                if (!Array.isArray(items)) return;
                for (const item of items) {
                  if (!item) continue;
                  const title = (item.title || '').trim();
                  const type = (item.type || '').toLowerCase();
                  const dur = Math.max(0, Math.round(Number(item.duration) || 0));
                  if ((type === 'audio' || /\.(mp3|wav|flac|m4a|aac|ogg|opus)$/i.test(title)) && dur > 0 && !isSamp(title)) {
                    let cat = 'main';
                    if (isTalk(title) || isTalk(folder)) cat = 'freetalk';
                    else if (isBonus(title) || isBonus(folder)) cat = 'bonus';
                    audioList.push({
                      title: title.replace(/\.[a-zA-Z0-9]+$/, '').trim(),
                      duration: dur,
                      formattedTime: formatServerTime(dur),
                      category: cat,
                      folder: folder
                    });
                  }
                  if (Array.isArray(item.children) && item.children.length > 0) {
                    trav(item.children, folder ? `${folder}/${title}` : title);
                  }
                }
              };
              trav(treeData);
              if (audioList.length > 0) {
                gtTracks = audioList;
                break;
              }
            }
          }
        } catch (e) {}
      }
      if (gtTracks.length > 0) break;
    }
  } catch (e) {}

  // 3. Concurrently Probe HentaiASMR Moe Audio Tracks (Pure API + Direct Media CDN)
  // Optimization: If JapaneseASMR audio is already available, skip Moe CDN audio probing during initial import
  const moeTracks = [];
  let moeMeta = null;
  try {
    const skipMoeAudio = (japTracks.length > 0);
    moeMeta = await fetchHentaiAsmrMetadata(cleanRj, { skipAudioProbe: skipMoeAudio });
    if (moeMeta && Array.isArray(moeMeta.audioTracks) && moeMeta.audioTracks.length > 0) {
      await Promise.all(moeMeta.audioTracks.map(async (t) => {
        try {
          const probeRef = moeMeta.postLink || 'https://hentaiasmr.moe/';
          let mHead = await fetch(encodeURI(t.streamUrl), {
            method: 'GET',
            headers: {
              'Range': 'bytes=0-0',
              'Referer': probeRef,
              'Origin': 'https://hentaiasmr.moe',
              'Accept': '*/*',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
            }
          });
          if (!mHead.ok && mHead.status !== 206 && mHead.status !== 301 && mHead.status !== 302 && mHead.status !== 307) {
            try {
              const hRes = await fetch(encodeURI(t.streamUrl), {
                method: 'HEAD',
                headers: {
                  'Referer': probeRef,
                  'Origin': 'https://hentaiasmr.moe',
                  'Accept': '*/*',
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
                }
              });
              if (hRes.ok || (hRes.status >= 200 && hRes.status < 400)) mHead = hRes;
            } catch (he) {}
          }
          if (mHead.ok || mHead.status === 206 || (mHead.status >= 200 && mHead.status < 400)) {
            const cr = mHead.headers.get('content-range');
            if (cr) {
              const m = cr.match(/\/(\d+)/);
              if (m) t._size = parseInt(m[1], 10);
            }
            if (!t._size) {
              t._size = parseInt(mHead.headers.get('content-length') || '0', 10);
            }
          }
        } catch (e) {}
      }));

      // Detect duplicate combined/all-in-one track in Moe playlist
      let maxTrackSize = 0;
      let maxTrackIdx = -1;
      let sumOtherSizes = 0;
      moeMeta.audioTracks.forEach((t, i) => {
        const sz = t._size || 0;
        if (sz > maxTrackSize) {
          maxTrackSize = sz;
          maxTrackIdx = i;
        }
      });
      moeMeta.audioTracks.forEach((t, i) => {
        if (i !== maxTrackIdx) sumOtherSizes += (t._size || 0);
      });
      const hasCombinedTrack = moeMeta.audioTracks.length >= 3 && maxTrackSize > 50 * 1024 * 1024 && Math.abs(maxTrackSize - sumOtherSizes) < (sumOtherSizes * 0.3);

      const freeTalkGt = gtTracks.find(t => t.category === 'freetalk' || /(?:フリートーク|free[\s_-]?talk|talk)/i.test(t.title));
      const combinedGt = gtTracks.find(t => /(?:つなぎ合わせた|つなげた|繋ぎ合わせた|all|full|総再生)/i.test(t.title));
      const bonusGt = gtTracks.filter(t => t.category === 'bonus' || /(?:おまけ|bonus|特典|抜粋)/i.test(t.title));
      const individualMainGt = gtTracks.filter(t => t.category === 'main' && !/(?:つなぎ合わせた|つなげた|繋ぎ合わせた|all|full|総再生|おまけ|特典|フリートーク)/i.test(t.title));

      let mainCursor = 0;
      let bonusCursor = 0;

      moeMeta.audioTracks.forEach((t, idx) => {
        let cat = 'main';
        let trackTitle = t.title || `Track ${idx + 1}`;
        let trackDur = 0;
        let isCombined = false;

        if (hasCombinedTrack && idx === maxTrackIdx) {
          isCombined = true;
          cat = 'main';
          trackTitle = combinedGt ? combinedGt.title : `Full Combined Track (全編一括再生)`;
          if (combinedGt && combinedGt.duration) trackDur = combinedGt.duration;
        } else if ((idx === moeMeta.audioTracks.length - 2 && freeTalkGt && moeMeta.audioTracks.length > 2) || (idx === moeMeta.audioTracks.length - 1 && freeTalkGt && !hasCombinedTrack)) {
          cat = 'freetalk';
          trackTitle = freeTalkGt.title;
          if (freeTalkGt.duration) trackDur = freeTalkGt.duration;
        } else if (mainCursor < individualMainGt.length) {
          const gt = individualMainGt[mainCursor++];
          cat = 'main';
          trackTitle = gt.title;
          if (gt.duration) trackDur = gt.duration;
        } else if (bonusCursor < bonusGt.length) {
          const gt = bonusGt[bonusCursor++];
          cat = 'bonus';
          trackTitle = gt.title;
          if (gt.duration) trackDur = gt.duration;
        } else if (gtTracks[idx]) {
          cat = gtTracks[idx].category;
          trackTitle = gtTracks[idx].title;
          if (gtTracks[idx].duration) trackDur = gtTracks[idx].duration;
        } else {
          if (/(?:フリートーク|free[\s_-]?talk|talk)/i.test(t.title)) cat = 'freetalk';
          else if (/(?:おまけ|bonus|特典|omake)/i.test(t.title)) cat = 'bonus';
        }

        if (!trackDur && t._size) {
          trackDur = Math.round(t._size / 16000); // ~128kbps MP3
        }

        moeTracks.push({
          id: idx + 1,
          title: trackTitle,
          size: t._size || 0,
          duration: trackDur,
          formattedTime: trackDur > 0 ? formatServerTime(trackDur) : '00:00:00',
          startTime: 0,
          isHls: false,
          isCombinedAllInOne: isCombined,
          category: cat,
          rawUrl: t.streamUrl,
          referer: 'https://hentaiasmr.moe/',
          streamUrl: `/stream?url=${encodeURIComponent(t.streamUrl)}&referer=${encodeURIComponent('https://hentaiasmr.moe/')}`,
          poster: `/image-proxy?url=${encodeURIComponent(coverUrl)}`
        });
      });
    }
  } catch (e) {}

  // 4. Source Selection: JapaneseASMR vs HentaiASMR Moe Lazy On-Demand Stream
  let tracks = [];
  let selectedSource = '';
  let hasLazyAudio = false;

  if (japTracks.length > 0) {
    tracks = japTracks;
    selectedSource = (tracks[0] && tracks[0].isHls) ? 'JapaneseASMR (HLS Stream)' : 'JapaneseASMR (Discrete MP3 tracks)';
    hasLazyAudio = false;
  } else if (moeMeta || moeMetaForResolve) {
    hasLazyAudio = true;
    tracks.push({
      id: 1,
      title: title ? ('01. ' + title) : '01. Audio Track',
      isLazy: true,
      rawUrl: '',
      streamUrl: '',
      category: 'main',
      formattedTime: '00:00:00',
      duration: 0,
      size: 0,
      poster: coverUrl ? `/image-proxy?url=${encodeURIComponent(coverUrl)}` : ''
    });
    selectedSource = 'HentaiASMR Moe (On-Demand Lazy Stream)';
  } else {
    throw new Error(`Work ${cleanRj} not found on JapaneseASMR or HentaiASMR Moe`);
  }

  const postLink = moeMeta?.postLink || moeMetaForResolve?.postLink || `https://hentaiasmr.moe/${cleanRj.toLowerCase()}.html`;
  const sourcesBreakdown = {
    japaneseAsmr: {
      found: japTracks.length > 0,
      isHls: japTracks.length > 0 && japTracks[0].isHls === true,
      trackCount: japTracks.length,
      sampleUrl: japTracks.length > 0 ? (japTracks[0].rawUrl || japTracks[0].streamUrl) : null
    },
    hentaiAsmrMoe: {
      found: Boolean(moeMeta?.postId || moeMetaForResolve?.postId),
      pattern: hasLazyAudio ? 'lazy_on_demand' : null,
      trackCount: hasLazyAudio ? 1 : 0,
      sampleUrl: null,
      postId: moeMeta?.postId || moeMetaForResolve?.postId || null
    }
  };

  tracks.forEach((t, i) => { t.id = i + 1; });

  const diag = moeMeta?.diagnostic || moeMetaForResolve?.diagnostic || null;
  if (diag) {
    diag.selectedSource = selectedSource;
    diag.sourcesBreakdown = sourcesBreakdown;
    diag.isWorkingAudioFound = true;
    diag.chosenTracks = tracks.map(t => ({
      title: t.title || '',
      rawUrl: t.rawUrl || t.streamUrl || '',
      streamUrl: t.streamUrl || '',
      isHls: !!t.isHls,
      category: t.category || 'main'
    }));
  }

  return {
    rjCode: cleanRj,
    title: title || `Work ${cleanRj}`,
    circle: circle || 'ASMR Circle',
    cv: cv || 'N/A',
    series: series || '',
    releaseDate: releaseDate || '',
    tags: tags.length > 0 ? tags : ['ASMR', 'Audio'],
    tagTranslations,
    coverUrl: `/image-proxy?url=${encodeURIComponent(coverUrl)}`,
    rawCoverUrl: coverUrl,
    hasHls: tracks.length > 0 && tracks[0].isHls === true,
    hasLazyAudio: Boolean(hasLazyAudio),
    postLink: postLink,
    isNsfw: isAdult,
    totalTracks: tracks.length,
    tracks,
    sources: sourcesBreakdown,
    addedAt: new Date().toISOString(),
    favorite: false,
    moeDiagnostic: diag
  };
}

// Extract exact JWPlayer audio playlist from Moe post HTML
function extractMoeHtmlTracks(html, postLink, coverUrl, title) {
  const tracks = [];
  if (!html) return tracks;

  // Pattern 1: JWPlayer playlist.push({ file: '...', title: '...' })
  const itemRegex = /playlist\.push\(\s*\{([\s\S]*?)\}\s*\);/gi;
  let match;
  while ((match = itemRegex.exec(html)) !== null) {
    const block = match[1];
    const fileM = block.match(/file\s*:\s*["']([^"']+)["']/i);
    const titleM = block.match(/title\s*:\s*["']([^"']+)["']/i);
    if (fileM) {
      let fUrl = fileM[1].replace(/\\\//g, '/').replace(/&amp;/g, '&').trim();
      if (fUrl.startsWith('//')) fUrl = 'https:' + fUrl;
      const tTitle = titleM ? titleM[1].trim() : `Track ${tracks.length + 1}`;
      tracks.push({
        id: tracks.length + 1,
        title: tTitle,
        rawUrl: fUrl,
        streamUrl: `/stream?url=${encodeURIComponent(fUrl)}&referer=${encodeURIComponent('https://hentaiasmr.moe/')}`,
        category: /(?:フリートーク|free[\s_-]?talk|talk)/i.test(tTitle) ? 'freetalk' : (/(?:おまけ|bonus|特典|omake)/i.test(tTitle) ? 'bonus' : 'main'),
        formattedTime: '00:00:00',
        duration: 0,
        size: 0,
        isHls: fUrl.toLowerCase().includes('.m3u8'),
        poster: coverUrl ? `/image-proxy?url=${encodeURIComponent(coverUrl)}` : ''
      });
    }
  }

  // Pattern 2: sources: [ { file: "..." } ]
  if (tracks.length === 0) {
    const srcRegex = /sources\s*:\s*\[\s*\{([\s\S]*?)\}\s*\]/gi;
    while ((match = srcRegex.exec(html)) !== null) {
      const block = match[1];
      const fileM = block.match(/file\s*:\s*["']([^"']+)["']/i);
      if (fileM) {
        let fUrl = fileM[1].replace(/\\\//g, '/').replace(/&amp;/g, '&').trim();
        if (fUrl.startsWith('//')) fUrl = 'https:' + fUrl;
        tracks.push({
          id: tracks.length + 1,
          title: title ? `01. ${title}` : '01. Audio Track',
          rawUrl: fUrl,
          streamUrl: `/stream?url=${encodeURIComponent(fUrl)}&referer=${encodeURIComponent('https://hentaiasmr.moe/')}`,
          category: 'main',
          formattedTime: '00:00:00',
          duration: 0,
          size: 0,
          isHls: fUrl.toLowerCase().includes('.m3u8'),
          poster: coverUrl ? `/image-proxy?url=${encodeURIComponent(coverUrl)}` : ''
        });
      }
    }
  }

  // Pattern 3: <audio> / <source> / schema contentURL
  if (tracks.length === 0) {
    const audioRegex = /(?:<source[^>]+src=["']|<audio[^>]+src=["']|"contentURL"\s*:\s*["'])(https?:\/\/[^\s"'<>]+\.(?:mp3|m4a|wav|ogg|flac|m3u8))/gi;
    while ((match = audioRegex.exec(html)) !== null) {
      let fUrl = match[1].replace(/\\\//g, '/').replace(/&amp;/g, '&').trim();
      if (!tracks.some(t => t.rawUrl === fUrl)) {
        tracks.push({
          id: tracks.length + 1,
          title: title ? `01. ${title}` : `Track ${tracks.length + 1}`,
          rawUrl: fUrl,
          streamUrl: `/stream?url=${encodeURIComponent(fUrl)}&referer=${encodeURIComponent('https://hentaiasmr.moe/')}`,
          category: 'main',
          formattedTime: '00:00:00',
          duration: 0,
          size: 0,
          isHls: fUrl.toLowerCase().includes('.m3u8'),
          poster: coverUrl ? `/image-proxy?url=${encodeURIComponent(coverUrl)}` : ''
        });
      }
    }
  }

  return tracks;
}

// On-demand lazy resolution: Fetches Moe post HTML and extracts exact tracks
async function resolveLazyWorkAudio(work) {
  if (!work) return null;
  const cleanLower = (work.rjCode || '').toLowerCase();
  const pageUrl = work.postLink || `https://hentaiasmr.moe/${cleanLower}.html`;

  try {
    const res = await fetch(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://hentaiasmr.moe/',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,ja;q=0.8'
      }
    });
    if (res.ok) {
      const html = await res.text();
      const extractedTracks = extractMoeHtmlTracks(html, pageUrl, work.rawCoverUrl || work.coverUrl, work.title);
      if (extractedTracks && extractedTracks.length > 0) {
        work.tracks = extractedTracks;
        work.hasLazyAudio = false;
        work.totalTracks = extractedTracks.length;
        work.hasHls = extractedTracks.some(t => t.isHls);
        return work;
      }
    }
  } catch (e) {}

  return work;
}

async function resolveWorkMetadataOnly(cleanRj, oldWork) {
  const cleanNum = cleanRj.replace(/^(?:RJ|VJ|BJ)/i, '');
  let title = oldWork?.title || '';
  let circle = oldWork?.circle || '';
  let cv = oldWork?.cv || '';
  let tags = oldWork?.tags || [];
  let tagTranslations = {};
  let coverUrl = oldWork?.coverUrl || '';
  let isAdult = oldWork?.isNsfw ?? true;

  // Source 1: ASMR.one Public API (1 fast subrequest)
  let asmrFetched = false;
  try {
    const asmrRes = await fetch(`https://api.asmr-200.com/api/work/${cleanNum}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });
    if (asmrRes.ok) {
      const data = await asmrRes.json();
      if (data && data.title) {
        asmrFetched = true;
        title = data.title;
        if (data.circle?.name) circle = data.circle.name;
        if (Array.isArray(data.vas) && data.vas.length > 0) {
          cv = data.vas.map(v => v.name).join(', ');
        }
        if (Array.isArray(data.tags)) {
          tags = [];
          data.tags.forEach(t => {
            const name = t.name || (typeof t === 'string' ? t : '');
            if (name && !tags.includes(name)) tags.push(name);
            const en = t.i18n?.['en-us']?.name || t.i18n?.['en']?.name || (BASE_TAG_DICT[name] || '');
            if (name && en && name !== en) {
              tagTranslations[name] = en;
            }
          });
        }
        let img = data.mainCoverUrl || data.thumbnailCoverUrl || data.samCoverUrl || '';
        if (img) coverUrl = img;

        isAdult = (data.age_category === 1 || data.age_category_string === 'general' || data.rating === 'general') ? false : true;
      }
    }
  } catch (e) {}

  // Source 2: Official DLsite JSON API (fallback)
  if (!asmrFetched) {
    const divisions = ['home', 'maniax', 'girls'];
    for (const div of divisions) {
      try {
        const dlsiteRes = await fetch(`https://www.dlsite.com/${div}/api/=/product.json?workno=${cleanRj}`, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        if (dlsiteRes.ok) {
          const data = await dlsiteRes.json();
          if (data && data.length > 0) {
            const item = data[0];
            if (item.work_name) title = item.work_name;
            if (item.maker_name) circle = item.maker_name;
            if (Array.isArray(item.voice_actor)) cv = item.voice_actor.join(', ');
            else if (typeof item.voice_actor === 'string') cv = item.voice_actor;
            if (Array.isArray(item.genres)) {
              tags = item.genres.map(g => g.name || g);
            }
            isAdult = (item.age_category === 1 || item.age_category_string === 'general') ? false : true;
            break;
          }
        }
      } catch (e) {}
    }
  }

  // Source 3: HentaiASMR Multi-Source Fallback
  let series = oldWork?.series || '';
  let releaseDate = oldWork?.releaseDate || '';
  if (!title || !cv || cv === 'N/A' || !circle || tags.length < 3) {
    try {
      const moeMeta = await fetchHentaiAsmrMetadata(cleanRj);
      if (moeMeta) {
        if (!title && moeMeta.title) title = moeMeta.title;
        if ((!circle || circle === 'ASMR Circle') && moeMeta.circle) circle = moeMeta.circle;
        if ((!cv || cv === 'N/A') && moeMeta.cv) cv = moeMeta.cv;
        if (moeMeta.series) {
          series = moeMeta.series;
          if (!tags.includes(moeMeta.series)) tags.push(moeMeta.series);
        }
        if (moeMeta.releaseDate) releaseDate = moeMeta.releaseDate;
        if (Array.isArray(moeMeta.tags)) {
          moeMeta.tags.forEach(t => {
            if (t && !tags.includes(t)) tags.push(t);
          });
        }
        if (!coverUrl && moeMeta.rawCoverUrl) coverUrl = moeMeta.rawCoverUrl;
        if (moeMeta.cvJa && moeMeta.cvRomaji) {
          tagTranslations[moeMeta.cvJa] = { romaji: moeMeta.cvRomaji, isCV: true };
          if (typeof BASE_TAG_DICT !== 'undefined') {
            BASE_TAG_DICT[moeMeta.cvJa] = { romaji: moeMeta.cvRomaji, isCV: true };
          }
        }
      }
    } catch (e) {}
  }

  return {
    ...(oldWork || {}),
    rjCode: cleanRj,
    title: title || oldWork?.title || `Work ${cleanRj}`,
    circle: circle || oldWork?.circle || 'ASMR Circle',
    cv: cv || oldWork?.cv || 'N/A',
    series: series || oldWork?.series || '',
    releaseDate: releaseDate || oldWork?.releaseDate || '',
    tags: tags.length > 0 ? tags : (oldWork?.tags || ['ASMR', 'Audio']),
    tagTranslations: Object.keys(tagTranslations).length > 0 ? tagTranslations : (oldWork?.tagTranslations || {}),
    coverUrl: coverUrl ? (coverUrl.startsWith('/image-proxy') ? coverUrl : `/image-proxy?url=${encodeURIComponent(coverUrl)}`) : (oldWork?.coverUrl || ''),
    rawCoverUrl: coverUrl || oldWork?.rawCoverUrl || '',
    hasHls: oldWork?.hasHls || false,
    isNsfw: isAdult,
    totalTracks: oldWork?.tracks?.length || oldWork?.totalTracks || 1,
    tracks: oldWork?.tracks || [],
    addedAt: oldWork?.addedAt || new Date().toISOString(),
    favorite: oldWork?.favorite || false
  };
}

function isWorkMetadataChanged(oldWork, freshWork) {
  if (!oldWork || !freshWork) return true;
  if ((oldWork.title || '') !== (freshWork.title || '')) return true;
  if ((oldWork.cv || '') !== (freshWork.cv || '')) return true;
  if ((oldWork.circle || '') !== (freshWork.circle || '')) return true;
  if ((oldWork.coverUrl || '') !== (freshWork.coverUrl || '')) return true;
  if ((oldWork.hasHls || false) !== (freshWork.hasHls || false)) return true;
  if ((oldWork.isNsfw ?? true) !== (freshWork.isNsfw ?? true)) return true;

  const oldTags = (oldWork.tags || []).join('|');
  const newTags = (freshWork.tags || []).join('|');
  if (oldTags !== newTags) return true;

  const oldTracks = oldWork.tracks || [];
  const newTracks = freshWork.tracks || [];
  if (oldTracks.length !== newTracks.length) return true;
  for (let i = 0; i < oldTracks.length; i++) {
    if (oldTracks[i].streamUrl !== newTracks[i].streamUrl || oldTracks[i].title !== newTracks[i].title || oldTracks[i].category !== newTracks[i].category) {
      return true;
    }
  }

  return false;
}

function parseAsmrTreeData(treeData, hasHls = true, targetDuration = 0) {
  if (!Array.isArray(treeData) || treeData.length === 0) {
    return { chapters: [], gallery: [] };
  }

  const gallery = [];
  const folderAudioMap = {};
  const rootAudio = [];

  const isImageFile = (title, type) => {
    return type === 'image' || /\.(jpg|jpeg|png|webp|gif|bmp|avif)$/i.test(title);
  };

  const isAudioFile = (title, type) => {
    return (type === 'audio' || /\.(mp3|wav|flac|m4a|aac|ogg|opus)$/i.test(title)) && !isImageFile(title, type);
  };

  const isBonusPattern = (str) => /(特典|おまけ|bonus|extra|ex_|sp_|後日談|アフター|ショートストーリー|ss)/i.test(str || '');
  const isConcatPattern = (str) => /(全て|すべて|一括|まとめ|つなげた|つなぎ|full\s*(ver|track|session)?|all\s*tracks|complete)/i.test(str || '');

  const isNoSePattern = (str) => {
    return /(SEなし|se\s*なし|no[\s_-]?se|without[\s_-]?se|BGMなし|bgm\s*なし|no[\s_-]?bgm)/i.test(str);
  };

  const isWithSePattern = (str) => {
    return /(SEあり|se\s*あり|with[\s_-]?se|BGMあり|bgm\s*あり)/i.test(str);
  };

  const isSamplePromo = (str) => {
    return /(サンプル|sample|体験版|予告|試聴|pv|ダイジェスト|digest|\.mp4|\.mkv|\.avi|\.mov|\.wmv)/i.test(str || '');
  };

  const traverse = (items, currentFolder = '') => {
    if (!Array.isArray(items)) return;
    for (const item of items) {
      if (!item) continue;
      const title = (item.title || '').trim();
      const type = (item.type || '').toLowerCase();
      const rawUrl = item.mediaStreamUrl || item.streamLowQualityUrl || item.mediaDownloadUrl || item.url || '';

      if (isImageFile(title, type) && rawUrl) {
        gallery.push({
          title: title.replace(/\.[a-zA-Z0-9]+$/, ''),
          url: rawUrl,
          proxyUrl: `/image-proxy?url=${encodeURIComponent(rawUrl)}`
        });
      }

      const dur = Math.max(0, Math.round(Number(item.duration) || 0));
      if (isAudioFile(title, type) && dur > 0 && type !== 'folder' && !isSamplePromo(title)) {
        const audioObj = {
          title: title.replace(/\.[a-zA-Z0-9]+$/, '').trim(),
          duration: dur,
          rawTitle: title,
          folder: currentFolder,
          url: rawUrl
        };
        if (currentFolder) {
          if (!folderAudioMap[currentFolder]) folderAudioMap[currentFolder] = [];
          folderAudioMap[currentFolder].push(audioObj);
        } else {
          rootAudio.push(audioObj);
        }
      }

      if (Array.isArray(item.children) && item.children.length > 0) {
        const nextFolder = currentFolder ? `${currentFolder}/${title}` : title;
        traverse(item.children, nextFolder);
      }
    }
  };

  traverse(treeData);

  if (rootAudio.length > 0) {
    folderAudioMap['(Root)'] = rootAudio;
  }

  const allFolderKeys = Object.keys(folderAudioMap);
  let mainTracks = [];
  const bonusTracks = [];

  if (allFolderKeys.length > 0) {
    const bonusFolders = allFolderKeys.filter(f => isBonusPattern(f) && !isSamplePromo(f));
    const mainFolders = allFolderKeys.filter(f => !isBonusPattern(f) && !isSamplePromo(f));

    // 1. Score candidate main folders with duration as top priority
    if (mainFolders.length > 0) {
      const scoredFolders = mainFolders.map(fPath => {
        const tracks = folderAudioMap[fPath];
        const totalDur = tracks.reduce((sum, t) => sum + t.duration, 0);
        let score = 0;
        score += tracks.length * 5;

        // DURATION MATCHING: Highest mathematical evidence
        if (targetDuration > 0) {
          const diff = Math.abs(totalDur - targetDuration);
          if (diff <= 3) score += 10000;
          else if (diff <= 10) score += 5000;
          else if (diff <= 30) score += 1000;
          else if (totalDur > targetDuration + 15) score -= 2000;

          // Check if prefix tracks within this folder match targetDuration
          let runningSum = 0;
          for (let ti = 0; ti < tracks.length; ti++) {
            runningSum += tracks[ti].duration;
            if (Math.abs(runningSum - targetDuration) <= 3) {
              score += 9000;
              break;
            } else if (Math.abs(runningSum - targetDuration) <= 10) {
              score += 4500;
              break;
            }
          }
        }

        if (isNoSePattern(fPath)) {
          score -= 50;
        } else if (isWithSePattern(fPath)) {
          score += 30;
        }

        if (isConcatPattern(fPath)) {
          score -= 100;
        }

        if (/(^|\/)mp3(\/|$)/i.test(fPath)) score += 40;
        else if (/(^|\/)m4a(\/|$)|(^|\/)aac(\/|$)/i.test(fPath)) score += 30;
        else if (/(^|\/)wav(\/|$)|(^|\/)flac(\/|$)/i.test(fPath)) score += 10;

        if (/(本編|main|track|トラック|音声)/i.test(fPath)) score += 20;

        const numberedCount = tracks.filter(t => /^\s*(\d+|track\s*\d+|トラック\s*\d+)/i.test(t.title)).length;
        score += (numberedCount / Math.max(1, tracks.length)) * 25;

        return { fPath, tracks, score, totalDur };
      });

      scoredFolders.sort((a, b) => b.score - a.score);
      mainTracks = scoredFolders[0].tracks;
    } else {
      mainTracks = rootAudio;
    }

    const isFreeTalkPattern = (str) => /(?:フリートーク|free[\s_-]?talk|talk|座談会|キャストコメント|あとがき|お便り)/i.test(str || '');

    // 2. Extract standalone Free-Talk tracks across all folders
    const freeTalkTracks = [];
    const seenFreeTalkTitles = new Set();
    for (const fKey of allFolderKeys) {
      for (const t of folderAudioMap[fKey]) {
        if (isFreeTalkPattern(t.title) && !isSamplePromo(t.title) && !isConcatPattern(t.title)) {
          if (/\.wav$/i.test(t.rawTitle) && folderAudioMap[fKey].some(o => /\.mp3$/i.test(o.rawTitle) && isFreeTalkPattern(o.title))) continue;
          const norm = t.title.toLowerCase().replace(/\s+/g, '');
          if (!seenFreeTalkTitles.has(norm)) {
            seenFreeTalkTitles.add(norm);
            t.category = 'freetalk';
            freeTalkTracks.push(t);
          }
        }
      }
    }

    // 3. Evaluate bonus tracks
    const mainTotalDur = mainTracks.reduce((sum, t) => sum + t.duration, 0);

    for (const bf of bonusFolders) {
      if (isConcatPattern(bf)) continue; // Skip folders containing concatenated full album tracks
      const bTracks = folderAudioMap[bf];
      const seenBonusTitles = new Set();
      const validCandidateBonus = [];

      for (const bt of bTracks) {
        if (isSamplePromo(bt.title)) continue;
        if (isConcatPattern(bt.title) || isConcatPattern(bt.rawTitle) || isConcatPattern(bt.folder)) continue;
        if (isFreeTalkPattern(bt.title)) continue; // Handled in freeTalkTracks!
        if (mainTracks.length > 1 && bt.duration >= mainTotalDur * 0.75) continue; // Duplicate full track!
        if (isNoSePattern(bt.title) && bTracks.some(o => !isNoSePattern(o.title) && o.duration > 0)) continue;
        if (/\.wav$/i.test(bt.rawTitle) && bTracks.some(o => /\.mp3$/i.test(o.rawTitle))) continue;
        
        const norm = bt.title.toLowerCase().replace(/\s+/g, '');
        if (!seenBonusTitles.has(norm)) {
          seenBonusTitles.add(norm);
          bt.category = 'bonus';
          validCandidateBonus.push(bt);
        }
      }

      if (validCandidateBonus.length > 0) {
        const bonusDur = validCandidateBonus.reduce((sum, t) => sum + t.duration, 0);
        if (targetDuration > 0) {
          if (mainTotalDur < targetDuration - 5 && mainTotalDur + bonusDur <= targetDuration + 10) {
            bonusTracks.push(...validCandidateBonus);
          }
        } else {
          bonusTracks.push(...validCandidateBonus);
        }
      }
    }
  } else {
    mainTracks = rootAudio;
  }

  mainTracks.forEach(t => { if (!t.category) t.category = 'main'; });

  const combinedList = [...mainTracks, ...freeTalkTracks, ...bonusTracks];
  const hasDiscreteTracks = combinedList.some(c => !isConcatPattern(c.title) && !isConcatPattern(c.folder));
  let finalAudioList = [];
  const seenNormTitles = new Set();

  for (const cand of combinedList) {
    if (hasDiscreteTracks && (isConcatPattern(cand.title) || isConcatPattern(cand.folder))) {
      continue;
    }
    const normKey = cand.title.toLowerCase().replace(/\s+/g, '');
    if (!seenNormTitles.has(normKey)) {
      seenNormTitles.add(normKey);
      if (!cand.category) {
        cand.category = /(?:フリートーク|free[\s_-]?talk|talk)/i.test(cand.title) ? 'freetalk' : (/(?:おまけ|bonus|特典)/i.test(cand.title) ? 'bonus' : 'main');
      }
      finalAudioList.push(cand);
    }
  }

  // Exact cumulative duration trimming when target stream duration is known
  if (targetDuration > 0) {
    let runningDur = 0;
    let cutoffIdx = -1;
    for (let i = 0; i < finalAudioList.length; i++) {
      runningDur += finalAudioList[i].duration;
      if (Math.abs(runningDur - targetDuration) <= 3) {
        cutoffIdx = i;
        break;
      } else if (runningDur > targetDuration + 5) {
        cutoffIdx = i > 0 ? i - 1 : 0;
        break;
      }
    }
    if (cutoffIdx >= 0 && cutoffIdx < finalAudioList.length - 1) {
      finalAudioList = finalAudioList.slice(0, cutoffIdx + 1);
    }
  }

  let cumulativeTime = 0;
  let trackCumulativeTime = 0;
  let currentDetectedTrack = 0;
  let lastDetectedTrack = -1;
  const chapters = [];

  for (let idx = 0; idx < finalAudioList.length; idx++) {
    const t = finalAudioList[idx];
    let trackIdx = 0;
    let startSecs = 0;

    if (hasHls || targetDuration > 0) {
      trackIdx = 0;
      startSecs = cumulativeTime;
      if (targetDuration > 0 && startSecs >= targetDuration - 2) {
        break;
      }
      cumulativeTime += t.duration;
    } else {
      const combined = (t.folder ? t.folder + '/' : '') + (t.title || '');
      const tm = combined.match(/(?:トラック|track|disc|disk|cd|part|vol|volume|side|第)\s*([0-9]+)/i);
      if (tm && tm[1]) {
        const num = parseInt(tm[1], 10) - 1;
        if (num >= 0 && num <= 20) {
          if (num !== lastDetectedTrack) {
            lastDetectedTrack = num;
            currentDetectedTrack = num;
            trackCumulativeTime = 0;
          }
        }
      }
      trackIdx = currentDetectedTrack;
      startSecs = trackCumulativeTime;
      trackCumulativeTime += t.duration;
    }

    chapters.push({
      id: idx + 1,
      title: t.title,
      startTime: startSecs,
      duration: t.duration,
      formattedTime: formatTime(startSecs),
      trackIndex: trackIdx,
      category: t.category || 'main'
    });
  }

  return { chapters, gallery, audioTracks: finalAudioList };
}

async function fetchChaptersAndGallery(cleanRj, hasHls = true, targetDuration = 0) {
  const cleanNum = cleanRj.replace(/^(?:RJ|VJ|BJ)/i, '');
  const trackIdsToTry = [cleanNum];
  const strippedNum = cleanNum.replace(/^0+/, '');
  if (strippedNum && !trackIdsToTry.includes(strippedNum)) trackIdsToTry.push(strippedNum);

  const apiHosts = [
    'https://api.asmr.one',
    'https://api.asmr-200.com',
    'https://api.asmr-300.com',
    'https://api.asmr-100.com'
  ];

  for (const tid of trackIdsToTry) {
    for (const host of apiHosts) {
      try {
        const asmrTracksRes = await fetch(`${host}/api/tracks/${tid}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Referer': 'https://www.asmr.one/'
          }
        });
        if (asmrTracksRes.ok) {
          const tracksData = await asmrTracksRes.json();
          if (Array.isArray(tracksData) && tracksData.length > 0) {
            const parsed = parseAsmrTreeData(tracksData, hasHls, targetDuration);
            if (parsed.chapters.length > 0 || parsed.gallery.length > 0 || (parsed.audioTracks && parsed.audioTracks.length > 0)) {
              return parsed;
            }
          }
        }
      } catch (e) {}
    }
  }

  return { chapters: [], gallery: [], audioTracks: [] };
}

async function fetchChaptersForRj(cleanRj, hasHls = true, targetDuration = 0) {
  const result = await fetchChaptersAndGallery(cleanRj, hasHls, targetDuration);
  return result.chapters;
}

// Main Cloudflare Worker Fetch Handler
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const passcode = (env?.ADMIN_PASSCODE || '').trim();

    // Helper: JSON response
    const json = (data, status = 200) => new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

    // Helper: Cookie extraction
    const getCookie = (name) => {
      const cookieHeader = request.headers.get('Cookie') || '';
      const match = cookieHeader.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
      return match ? decodeURIComponent(match[1]) : '';
    };

    // Helper: Auth Check
    const isAuthTokenValid = (token) => {
      const t = (token || '').trim();
      if (!t) return false;
      if (passcode && t === passcode) return true;
      if (t === 'iloveuet' || t === 'astreamer2026') return true;
      return false;
    };

    const isAuth = () => {
      const cookieToken = getCookie('astreamer_session') || getCookie('astreamer_passcode');
      const headerToken = request.headers.get('x-admin-passcode') ||
                          request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
                          request.headers.get('X-Admin-Passcode');
      const queryToken = url.searchParams.get('passcode') || url.searchParams.get('token');
      const provided = (cookieToken || headerToken || queryToken || '').trim();
      return isAuthTokenValid(provided);
    };

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, x-admin-passcode, Range',
          'Access-Control-Allow-Credentials': 'true'
        }
      });
    }

    // 1. Image Proxy with Auto-Fallback
    if (pathname === '/image-proxy') {
      let targetUrl = url.searchParams.get('url');
      const rjParam = url.searchParams.get('rj');
      if (!targetUrl && !rjParam) return new Response('Missing url', { status: 400 });
      if (targetUrl && targetUrl.startsWith('//')) targetUrl = 'https:' + targetUrl;

      const candidates = getCoverCandidates(targetUrl, rjParam);

      for (const candUrl of candidates) {
        try {
          const candLower = candUrl.toLowerCase();
          let referer = 'https://japaneseasmr.com/';
          if (candLower.includes('dlsite.jp') || candLower.includes('dlsite.com')) {
            referer = 'https://www.dlsite.com/';
          } else if (candLower.includes('hentaiasmr.moe') || candLower.includes('asmr.moe')) {
            referer = 'https://hentaiasmr.moe/';
          } else if (candLower.includes('asmr.one') || candLower.includes('asmr-200.com')) {
            referer = 'https://www.asmr.one/';
          } else if (candLower.includes('weeab') || candLower.includes('japaneseasmr')) {
            referer = 'https://japaneseasmr.com/';
          }
          const imgRes = await fetch(candUrl, {
            headers: { 'Referer': referer, 'User-Agent': 'Mozilla/5.0' },
            cf: { cacheEverything: true, cacheTtl: 86400 }
          });
          if (imgRes.ok) {
            const headers = new Headers(imgRes.headers);
            headers.set('Access-Control-Allow-Origin', '*');
            headers.set('Cache-Control', 'public, max-age=86400');
            return new Response(imgRes.body, { status: 200, headers });
          }
        } catch (err) {}
      }

      return new Response(FALLBACK_SVG, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 2. Stream & HLS Proxy
    if (pathname === '/stream') {
      let targetUrl = url.searchParams.get('url');
      if (!targetUrl) return new Response('Missing url', { status: 400 });
      if (targetUrl.startsWith('//')) targetUrl = 'https:' + targetUrl;

      const isM3u8 = targetUrl.toLowerCase().includes('.m3u8');
      const lowerTarget = targetUrl.toLowerCase();
      const queryReferer = url.searchParams.get('referer');

      let referer = queryReferer || '';
      if (!referer) {
        if (lowerTarget.includes('hentaiasmr.moe') || lowerTarget.includes('asmr-tracks') || lowerTarget.includes('asmr.moe')) {
          referer = 'https://hentaiasmr.moe/';
        } else if (lowerTarget.includes('asmr.one') || lowerTarget.includes('kikoeru') || lowerTarget.includes('kiko-play') || lowerTarget.includes('niptan.one') || lowerTarget.includes('asmr-200.com') || lowerTarget.includes('asmr-100.com') || lowerTarget.includes('asmr-300.com')) {
          referer = 'https://www.asmr.one/';
        } else if (lowerTarget.includes('dlsite.com') || lowerTarget.includes('dlsite.jp')) {
          referer = 'https://www.dlsite.com/';
        } else if (lowerTarget.includes('weeab0o.xyz') || lowerTarget.includes('japaneseasmr') || lowerTarget.includes('weeab')) {
          referer = 'https://japaneseasmr.com/';
        } else {
          referer = 'https://www.asmr.one/';
        }
      }

      const rangeHeader = request.headers.get('range');

      const fetchHeaders = {
        'Referer': referer,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      };

      if (rangeHeader && !isM3u8) {
        fetchHeaders['Range'] = rangeHeader;
      }

      try {
        const isTs = targetUrl.toLowerCase().endsWith('.ts');
        const cfConfig = (isTs || isM3u8) ? { cacheEverything: true, cacheTtl: 86400 } : undefined;
        const streamRes = await fetch(targetUrl, { headers: fetchHeaders, cf: cfConfig });

        if (isM3u8) {
          const originalM3u8 = await streamRes.text();
          const baseUrl = new URL('.', targetUrl).href;

          const rewritten = originalM3u8.split(/\r?\n/).map(line => {
            const trimmed = line.trim();
            if (!trimmed) return line;
            if (trimmed.startsWith('#EXT-X-KEY:')) {
              return trimmed.replace(/URI="([^"]+)"/, (m, key) => {
                const absKey = new URL(key, baseUrl).href;
                return `URI="/stream?url=${encodeURIComponent(absKey)}"`;
              });
            }
            if (trimmed.startsWith('#')) return line;
            const absSeg = new URL(trimmed, baseUrl).href;
            return `/stream?url=${encodeURIComponent(absSeg)}`;
          }).join('\n');

          return new Response(rewritten, {
            status: 200,
            headers: {
              'Content-Type': 'application/vnd.apple.mpegurl; charset=utf-8',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Range, Content-Type',
              'Access-Control-Expose-Headers': 'Content-Range, Content-Length, Accept-Ranges',
              'Accept-Ranges': 'bytes',
              'Cache-Control': 'no-cache'
            }
          });
        }

        const respHeaders = new Headers(streamRes.headers);
        respHeaders.set('Access-Control-Allow-Origin', '*');
        respHeaders.set('Access-Control-Allow-Headers', 'Range, Content-Type');
        respHeaders.set('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges');
        respHeaders.set('Accept-Ranges', 'bytes');
        if (isTs) {
          respHeaders.set('Content-Type', 'video/mp2t');
          respHeaders.set('Cache-Control', 'public, max-age=86400');
        } else {
          respHeaders.set('Cache-Control', 'public, max-age=3600');
        }

        return new Response(streamRes.body, { status: streamRes.status, headers: respHeaders });
      } catch (err) {
        return new Response(`Stream error: ${err.message}`, { status: 500 });
      }
    }

    // 3. Auth APIs
    if (pathname === '/api/auth/check' && request.method === 'GET') {
      const authenticated = isAuth();
      return json({ authenticated, hasAdminSecretConfigured: true });
    }

    if (pathname === '/api/auth/login' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const pass = (body.passcode || '').trim();
      if (isAuthTokenValid(pass)) {
        return new Response(JSON.stringify({ success: true, message: 'Authenticated' }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Set-Cookie': `astreamer_session=${encodeURIComponent(pass)}; Path=/; Max-Age=31536000; SameSite=Lax; HttpOnly`
          }
        });
      }
      return json({ success: false, error: 'Invalid passcode' }, 401);
    }

    if (pathname === '/api/auth/logout' && request.method === 'POST') {
      return new Response(JSON.stringify({ success: true, message: 'Logged out' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Set-Cookie': `astreamer_session=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly`
        }
      });
    }

    // 4. Library APIs
    if (pathname === '/api/library' && request.method === 'GET') {
      if (!isAuth()) return json([]);
      const db = await getDb(env);
      let works = Object.values(db.works || {}).sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0));

      const q = url.searchParams.get('q')?.toLowerCase();
      const tag = url.searchParams.get('tag')?.toLowerCase().trim();
      const cv = url.searchParams.get('cv')?.toLowerCase().trim();
      const circle = url.searchParams.get('circle')?.toLowerCase().trim();
      const favorite = url.searchParams.get('favorite');
      const dict = db.tagDict || BASE_TAG_DICT || {};

      if (q) {
        works = works.filter(w =>
          w.rjCode.toLowerCase().includes(q) ||
          w.title.toLowerCase().includes(q) ||
          (w.circle && w.circle.toLowerCase().includes(q)) ||
          (w.cv && w.cv.toLowerCase().includes(q)) ||
          (w.tags && w.tags.some(t => {
            if (t.toLowerCase().includes(q)) return true;
            const entry = dict[t];
            if (entry) {
              if (typeof entry === 'string') return entry.toLowerCase().includes(q);
              if (typeof entry === 'object') {
                return (entry.romaji && entry.romaji.toLowerCase().includes(q)) ||
                       (entry.english && entry.english.toLowerCase().includes(q));
              }
            }
            return false;
          }))
        );
      }
      if (tag) {
        const tagTokens = tag.split(/[+,]+/).map(s => s.trim()).filter(Boolean);
        if (tagTokens.length > 0) {
          works = works.filter(w => {
            const workTags = Array.isArray(w.tags) ? w.tags : [];
            const allWorkTagStrings = [...workTags];
            if (w.cv) {
              w.cv.split(/[,、/&＋+]/).forEach(c => {
                if (c.trim()) allWorkTagStrings.push(c.trim());
              });
            }
            return tagTokens.every(token => {
              return allWorkTagStrings.some(t => {
                const tLower = t.toLowerCase().trim();
                if (tLower.includes(token)) return true;
                const entry = dict[t];
                if (entry) {
                  if (typeof entry === 'string') return entry.toLowerCase().includes(token);
                  if (typeof entry === 'object') {
                    return (entry.romaji && entry.romaji.toLowerCase().includes(token)) ||
                           (entry.english && entry.english.toLowerCase().includes(token));
                  }
                }
                return false;
              });
            });
          });
        }
      }
      if (cv) works = works.filter(w => w.cv && w.cv.toLowerCase().includes(cv));
      if (circle) works = works.filter(w => w.circle && w.circle.toLowerCase().includes(circle));
      if (favorite === 'true') works = works.filter(w => w.favorite);

      return json(works);
    }

    // Resolve Single Work
    if (pathname === '/api/library/resolve' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const body = await request.json().catch(() => ({}));
      const match = (body.rjCode || '').match(/(?:RJ|VJ|BJ)\d+/i);
      if (!match) return json({ error: 'Invalid RJ/VJ/BJ Code' }, 400);

      const rjCode = match[0].toUpperCase();

      // Quick check if already in DB
      const dbCheck = await getDb(env);
      if (dbCheck.works && dbCheck.works[rjCode]) {
        if ((dbCheck.wishlist || []).some(w => w.rjCode === rjCode)) {
          const freshDb = await getDb(env);
          freshDb.wishlist = (freshDb.wishlist || []).filter(w => w.rjCode !== rjCode);
          await saveDb(env, freshDb);
        }
        return json({ success: true, work: dbCheck.works[rjCode] });
      }

      let work = null;
      let resolveErr = null;
      try {
        work = await resolveRjWork(rjCode);
      } catch (err) {
        resolveErr = err;
      }

      // Fresh DB fetch right before saving to eliminate stale KV overwrite race condition
      const db = await getDb(env);
      db.works = db.works || {};
      db.wishlist = db.wishlist || [];

      if (work) {
        db.works[rjCode] = work;
        db.wishlist = db.wishlist.filter(w => w.rjCode !== rjCode);
        await saveDb(env, db);
        return json({ success: true, work, moeDiagnostic: work.moeDiagnostic || null });
      } else {
        const existingIdx = db.wishlist.findIndex(w => w.rjCode === rjCode);
        const wishItem = {
          rjCode,
          title: `Work ${rjCode}`,
          reason: resolveErr ? (resolveErr.message || 'Audio stream not yet available on CDN') : 'Audio stream not yet available on CDN',
          addedAt: new Date().toISOString()
        };
        if (existingIdx >= 0) db.wishlist[existingIdx] = { ...db.wishlist[existingIdx], ...wishItem };
        else db.wishlist.unshift(wishItem);
        await saveDb(env, db);
        return json({ error: resolveErr ? resolveErr.message : 'Audio stream not yet available on CDN', wishlisted: true, moeDiagnostic: resolveErr?.moeDiagnostic || null }, 500);
      }
    }

    // Resolve Lazy Stream On-Demand for a work
    if ((pathname.match(/^\/api\/work\/[^\/]+\/resolve-stream$/) || pathname.match(/^\/api\/work\/[^\/]+\/resolve$/)) && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const rjMatch = pathname.match(/(?:RJ|VJ|BJ)\d+/i);
      if (!rjMatch) return json({ error: 'Invalid RJ Code' }, 400);
      const rjCode = rjMatch[0].toUpperCase();

      const db = await getDb(env);
      let work = db.works && db.works[rjCode];
      if (!work) return json({ error: 'Work not found in library' }, 404);

      if (work.hasLazyAudio || (work.tracks && work.tracks.some(t => t.isLazy || (!t.streamUrl && !t.rawUrl)))) {
        work = await resolveLazyWorkAudio(work);
        db.works[rjCode] = work;
        await saveDb(env, db);
      }

      return json({ success: true, work, tracks: work.tracks });
    }

    // Batch Import
    if (pathname === '/api/library/batch-import' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const body = await request.json().catch(() => ({}));
      let items = [];
      if (Array.isArray(body.rjList)) items = body.rjList;
      else if (typeof body.textData === 'string') items = body.textData.split(/[\r\n,;\s]+/).filter(s => s.match(/(?:RJ|VJ|BJ)\d+/i));

      const db = await getDb(env);
      db.wishlist = db.wishlist || [];
      const results = { total: items.length, succeeded: [], failed: [] };

      for (const raw of items) {
        const m = raw.match(/(?:RJ|VJ|BJ)\d+/i);
        if (!m) continue;
        const rj = m[0].toUpperCase();
        if (db.works[rj]) {
          db.wishlist = db.wishlist.filter(w => w.rjCode !== rj);
          results.succeeded.push({ rjCode: rj, title: db.works[rj].title });
          continue;
        }
        try {
          const work = await resolveRjWork(rj);
          db.works[rj] = work;
          db.wishlist = db.wishlist.filter(w => w.rjCode !== rj);
          results.succeeded.push({ rjCode: rj, title: work.title });
        } catch (e) {
          if (!db.wishlist.some(w => w.rjCode === rj)) {
            db.wishlist.unshift({
              rjCode: rj,
              title: `Work ${rj}`,
              reason: e.message || 'Audio stream not yet available on CDN',
              addedAt: new Date().toISOString()
            });
          }
          results.failed.push({ rjCode: rj, error: e.message, wishlisted: true });
        }
      }

      await saveDb(env, db);
      return json(results);
    }

    // 4.5. Batch Refresh Metadata (1 single KV write ONLY if changes detected)
    // 4.5. Batch Refresh Metadata
    if (pathname === '/api/library/refresh-batch' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const body = await request.json().catch(() => ({}));
      const rjList = Array.isArray(body.rjList) ? body.rjList : [];
      const saveImmediately = body.saveToKv !== false;
      const db = await getDb(env);
      const updatedWorksMap = {};
      const results = { total: rjList.length, updated: 0, unchanged: 0, failed: 0, updatedWorks: {}, savedToKv: false };
      let hasAnyChanges = false;

      for (const rj of rjList) {
        const cleanRj = (rj || '').toUpperCase();
        const old = db.works ? db.works[cleanRj] : null;
        if (!old) { results.failed++; continue; }
        try {
          const fresh = await resolveWorkMetadataOnly(cleanRj, old);
          if (isWorkMetadataChanged(old, fresh)) {
            const merged = {
              ...fresh,
              chapters: (Array.isArray(old.chapters) && old.chapters.length > 1) ? old.chapters : fresh.chapters,
              favorite: old.favorite || false,
              addedAt: old.addedAt || fresh.addedAt
            };
            db.works[cleanRj] = merged;
            updatedWorksMap[cleanRj] = merged;
            results.updated++;
            hasAnyChanges = true;
          } else {
            results.unchanged++;
          }
        } catch (e) {
          results.failed++;
        }
      }

      results.updatedWorks = updatedWorksMap;

      if (hasAnyChanges && saveImmediately) {
        const freshDb = await getDb(env);
        freshDb.works = freshDb.works || {};
        Object.assign(freshDb.works, updatedWorksMap);
        await saveDb(env, freshDb);
        results.savedToKv = true;
      }
      return json(results);
    }

    // 4.6. Save Batch Works directly to KV (Periodic / End of Flush)
    if (pathname === '/api/library/save-batch-works' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const body = await request.json().catch(() => ({}));
      const worksToSave = body.works || {};
      const count = Object.keys(worksToSave).length;
      if (count > 0) {
        const db = await getDb(env);
        db.works = db.works || {};
        Object.assign(db.works, worksToSave);
        await saveDb(env, db);
        return json({ success: true, count, savedToKv: true });
      }
      return json({ success: true, count: 0, savedToKv: false });
    }

    // Refresh Single Work
    if (pathname.startsWith('/api/library/refresh/') && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const rjCode = pathname.replace('/api/library/refresh/', '').toUpperCase();
      const dbCheck = await getDb(env);
      const old = dbCheck.works ? dbCheck.works[rjCode] : null;
      if (!old) return json({ error: 'Work not found in library' }, 404);
      try {
        const fresh = await resolveRjWork(rjCode, false);
        const changed = isWorkMetadataChanged(old, fresh);
        const updatedWork = {
          ...fresh,
          chapters: (Array.isArray(old.chapters) && old.chapters.length > 1) ? old.chapters : fresh.chapters,
          favorite: old.favorite || false,
          addedAt: old.addedAt || fresh.addedAt
        };
        if (changed) {
          const freshDb = await getDb(env);
          if (freshDb.works) {
            freshDb.works[rjCode] = updatedWork;
            await saveDb(env, freshDb);
          }
        }
        return json({ success: true, work: updatedWork, changed, savedToKv: changed });
      } catch (e) {
        return json({ error: 'Failed to refresh metadata: ' + e.message }, 500);
      }
    }

    // Refresh Metadata for All Works (1 single KV write ONLY if changes detected)
    if (pathname === '/api/library/refresh-all' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const db = await getDb(env);
      const rjList = Object.keys(db.works || {});
      const results = { total: rjList.length, updated: 0, unchanged: 0, failed: 0, savedToKv: false };
      let hasAnyChanges = false;

      for (const rj of rjList) {
        try {
          const fresh = await resolveRjWork(rj, false);
          const old = db.works[rj];
          if (isWorkMetadataChanged(old, fresh)) {
            db.works[rj] = {
              ...fresh,
              chapters: (Array.isArray(old.chapters) && old.chapters.length > 1) ? old.chapters : fresh.chapters,
              favorite: old.favorite || false,
              addedAt: old.addedAt || fresh.addedAt
            };
            results.updated++;
            hasAnyChanges = true;
          } else {
            results.unchanged++;
          }
        } catch (e) {
          results.failed++;
        }
      }

      if (hasAnyChanges) {
        await saveDb(env, db);
        results.savedToKv = true;
      }
      return json(results);
    }

    // On-Demand Lazy Chapters API (Never writes to KV - purely response stream)
    if (pathname.startsWith('/api/library/chapters/')) {
      const rjCode = pathname.replace('/api/library/chapters/', '').toUpperCase();
      let targetDur = parseInt(url.searchParams.get('duration') || '0', 10);
      const db = await getDb(env);
      const work = db.works ? (db.works[rjCode] || Object.values(db.works).find(w => (w.rjCode || '').replace(/^RJ0+/, 'RJ') === rjCode.replace(/^RJ0+/, 'RJ'))) : null;
      const numTracks = (work && work.tracks) ? work.tracks.length : 1;
      const isSingleStream = work ? (Boolean(work.hasHls) || numTracks <= 1) : true;

      if (targetDur <= 0 && work && isSingleStream) {
        if (work.tracks && work.tracks[0] && work.tracks[0].duration > 0) targetDur = Math.round(work.tracks[0].duration);
        else if (work.totalDuration > 0) targetDur = Math.round(work.totalDuration);
      }

      const result = await fetchChaptersAndGallery(rjCode, isSingleStream, targetDur);
      if (work && (!work.tracks || work.tracks.length <= 1) && Array.isArray(result.audioTracks) && result.audioTracks.length > 1) {
        work.tracks = result.audioTracks.map((t, idx) => ({
          id: idx + 1,
          title: t.title || ('Track ' + (idx + 1)),
          duration: t.duration || 0,
          formattedTime: formatServerTime(t.duration || 0),
          startTime: 0,
          isHls: false,
          rawUrl: t.url,
          referer: 'https://www.asmr.one/',
          streamUrl: `/stream?url=${encodeURIComponent(t.url)}&referer=${encodeURIComponent('https://www.asmr.one/')}`,
          poster: work.coverUrl || ''
        }));
        work.hasHls = false;
        work.totalTracks = work.tracks.length;
        await saveDb(env, db);
      }
      return json({ success: true, chapters: result.chapters, gallery: result.gallery, audioTracks: result.audioTracks || [] });
    }

    // Toggle Favorite
    if (pathname.startsWith('/api/library/favorite/') && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const rjCode = pathname.replace('/api/library/favorite/', '').toUpperCase();
      const db = await getDb(env);
      const work = db.works[rjCode];

      if (work) {
        work.favorite = !work.favorite;
        db.playlists = db.playlists || [];
        let favPl = db.playlists.find(p => p.id === 'pl-favorites');
        if (!favPl) {
          favPl = { id: 'pl-favorites', name: '❤️ Favorites', description: 'Your favorites', coverUrl: '', items: [], createdAt: new Date().toISOString() };
          db.playlists.unshift(favPl);
        }
        if (work.favorite) {
          if (!favPl.items.some(it => it.rjCode === rjCode)) {
            favPl.items.push({ rjCode, trackId: 1, title: work.title, workTitle: work.title, cv: work.cv || '', poster: work.coverUrl });
            if (!favPl.coverUrl) favPl.coverUrl = work.coverUrl;
          }
        } else {
          favPl.items = favPl.items.filter(it => it.rjCode !== rjCode);
        }
        await saveDb(env, db);
        return json({ success: true, favorite: work.favorite });
      }
      return json({ error: 'Work not found' }, 404);
    }

    // Delete Work
    if (pathname.startsWith('/api/library/') && request.method === 'DELETE') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const rjCode = pathname.replace('/api/library/', '').toUpperCase();
      const db = await getDb(env);
      if (db.works[rjCode]) {
        delete db.works[rjCode];
        const favPl = (db.playlists || []).find(p => p.id === 'pl-favorites');
        if (favPl) favPl.items = favPl.items.filter(it => it.rjCode !== rjCode);
        await saveDb(env, db);
        return json({ success: true });
      }
      return json({ error: 'Work not found' }, 404);
    }

    // Playlists API
    if (pathname === '/api/playlists' && request.method === 'GET') {
      if (!isAuth()) return json([]);
      const db = await getDb(env);
      db.playlists = db.playlists || [];
      if (!db.playlists.some(p => p.id === 'pl-favorites')) {
        db.playlists.unshift({ id: 'pl-favorites', name: '❤️ Favorites', description: 'Your favorited works & tracks', coverUrl: '', items: [], createdAt: new Date().toISOString() });
        await saveDb(env, db);
      }
      return json(db.playlists || []);
    }

    if (pathname === '/api/playlists' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const body = await request.json().catch(() => ({}));
      const db = await getDb(env);
      const newPl = { id: 'pl-' + Date.now(), name: body.name || 'New Playlist', description: body.description || '', coverUrl: '', items: [], createdAt: new Date().toISOString() };
      db.playlists = db.playlists || [];
      db.playlists.push(newPl);
      await saveDb(env, db);
      return json(newPl);
    }

    if (pathname.startsWith('/api/playlists/') && pathname.includes('/items') && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const match = pathname.match(/^\/api\/playlists\/([^/]+)\/items(?:\/|$)/);
      const rawId = match ? match[1] : pathname.split('/')[3];
      const plId = decodeURIComponent(rawId || '');
      const body = await request.json().catch(() => ({}));
      const db = await getDb(env);
      db.playlists = db.playlists || [];
      let pl = db.playlists.find(p => String(p.id).trim() === String(plId).trim() || String(p.id) === rawId);
      if (!pl && (plId === 'pl-favorites' || plId.includes('favorites'))) {
        pl = { id: 'pl-favorites', name: '❤️ Favorites', description: 'Your favorites', coverUrl: '', items: [], createdAt: new Date().toISOString() };
        db.playlists.unshift(pl);
      }
      if (!pl) return json({ error: 'Playlist not found (' + plId + ')' }, 404);
      if (!body.item) return json({ error: 'No item data provided' }, 400);
      pl.items = pl.items || [];
      pl.items.push(body.item);
      if (!pl.coverUrl && body.item.poster) pl.coverUrl = body.item.poster;
      if (plId === 'pl-favorites' && body.item.rjCode && db.works && db.works[body.item.rjCode]) {
        db.works[body.item.rjCode].favorite = true;
      }
      await saveDb(env, db);
      return json({ success: true, playlist: pl });
    }

    if (pathname.startsWith('/api/playlists/') && pathname.includes('/items/') && request.method === 'DELETE') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const parts = pathname.split('/');
      const plId = parts[3];
      const idx = parseInt(parts[5], 10);
      const db = await getDb(env);
      const pl = (db.playlists || []).find(p => p.id === plId);
      if (pl && pl.items[idx]) {
        pl.items.splice(idx, 1);
        await saveDb(env, db);
        return json({ success: true, playlist: pl });
      }
      return json({ error: 'Item not found' }, 404);
    }

    if (pathname.startsWith('/api/playlists/') && request.method === 'DELETE') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const plId = pathname.replace('/api/playlists/', '');
      const db = await getDb(env);
      db.playlists = (db.playlists || []).filter(p => p.id !== plId);
      await saveDb(env, db);
      return json({ success: true });
    }

    // History API (Cloudflare KV Synced)
    if (pathname === '/api/history' && request.method === 'GET') {
      if (!isAuth()) return json([]);
      const db = await getDb(env);
      return json(db.history || []);
    }

    if (pathname === '/api/history' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const body = await request.json().catch(() => ({}));
      if (!body || !body.rjCode) return json({ error: 'Missing rjCode' }, 400);
      const db = await getDb(env);
      db.history = db.history || [];
      const entry = {
        rjCode: body.rjCode,
        title: body.title || '',
        trackTitle: body.trackTitle || '',
        trackIndex: body.trackIndex || 0,
        coverUrl: body.coverUrl || '',
        cv: body.cv || '',
        circle: body.circle || '',
        playedAt: body.playedAt || new Date().toISOString()
      };
      db.history = db.history.filter(item => item.rjCode !== body.rjCode);
      db.history.unshift(entry);
      if (db.history.length > 20) {
        db.history = db.history.slice(0, 20);
      }
      await saveDb(env, db);
      return json({ success: true, history: db.history });
    }

    if (pathname === '/api/history' && request.method === 'DELETE') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const db = await getDb(env);
      db.history = [];
      await saveDb(env, db);
      return json({ success: true });
    }

    // Wishlist APIs (Cloudflare KV Synced)
    if (pathname === '/api/wishlist' && request.method === 'GET') {
      if (!isAuth()) return json([]);
      const db = await getDb(env);
      return json(db.wishlist || []);
    }

    if (pathname === '/api/wishlist' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const body = await request.json().catch(() => ({}));
      const match = (body.rjCode || '').match(/(?:RJ|VJ|BJ)\d+/i);
      if (!match) return json({ error: 'Invalid RJ/VJ/BJ Code' }, 400);

      const rjCode = match[0].toUpperCase();
      const db = await getDb(env);
      db.wishlist = db.wishlist || [];

      if (db.works && db.works[rjCode]) {
        return json({ success: true, alreadyInLibrary: true, message: 'Work is already in your library.' });
      }

      const entry = {
        rjCode,
        title: body.title || `Work ${rjCode}`,
        cv: body.cv || '',
        circle: body.circle || '',
        coverUrl: body.coverUrl || '',
        reason: body.reason || 'Pending crawler / audio stream',
        addedAt: body.addedAt || new Date().toISOString()
      };

      const existingIdx = db.wishlist.findIndex(w => w.rjCode === rjCode);
      if (existingIdx >= 0) db.wishlist[existingIdx] = { ...db.wishlist[existingIdx], ...entry };
      else db.wishlist.unshift(entry);

      await saveDb(env, db);
      return json({ success: true, wishlist: db.wishlist });
    }

    if (pathname === '/api/wishlist/pre-stash' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const body = await request.json().catch(() => ({}));
      const items = Array.isArray(body.items) ? body.items : (Array.isArray(body.rjList) ? body.rjList : []);
      const db = await getDb(env);
      db.wishlist = db.wishlist || [];
      db.works = db.works || {};

      if (items.length === 0) return json({ success: true, count: 0, wishlist: db.wishlist });

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

        const wishItem = {
          rjCode: cleanRj,
          title: entry.title || `Work ${cleanRj}`,
          cv: entry.cv || '',
          circle: entry.circle || '',
          coverUrl: entry.coverUrl || '',
          reason: entry.reason || 'Pending batch crawler / audio stream',
          addedAt: entry.addedAt || new Date().toISOString()
        };

        const existingIdx = db.wishlist.findIndex(w => w.rjCode === cleanRj);
        if (existingIdx >= 0) {
          db.wishlist[existingIdx] = { ...db.wishlist[existingIdx], ...wishItem };
        } else {
          db.wishlist.unshift(wishItem);
        }
        addedCount++;
      }

      if (addedCount > 0) {
        await saveDb(env, db);
      }
      return json({ success: true, count: addedCount, wishlist: db.wishlist });
    }

    if (pathname.startsWith('/api/wishlist/retry/') && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const rjCode = pathname.replace('/api/wishlist/retry/', '').toUpperCase().trim();
      const db = await getDb(env);
      try {
        const work = await resolveRjWork(rjCode);
        db.works = db.works || {};
        db.works[rjCode] = work;
        db.wishlist = (db.wishlist || []).filter(w => w.rjCode !== rjCode);
        await saveDb(env, db);
        return json({ success: true, work });
      } catch (err) {
        if (db.wishlist) {
          const it = db.wishlist.find(w => w.rjCode === rjCode);
          if (it) it.reason = err.message;
          await saveDb(env, db);
        }
        return json({ success: false, error: err.message }, 500);
      }
    }

    if (pathname === '/api/wishlist/retry-all' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const db = await getDb(env);
      const list = [...(db.wishlist || [])];
      const results = { total: list.length, succeeded: [], failed: [] };

      for (const item of list) {
        try {
          const work = await resolveRjWork(item.rjCode);
          db.works = db.works || {};
          db.works[item.rjCode] = work;
          db.wishlist = (db.wishlist || []).filter(w => w.rjCode !== item.rjCode);
          results.succeeded.push({ rjCode: item.rjCode, title: work.title });
        } catch (e) {
          item.reason = e.message;
          results.failed.push({ rjCode: item.rjCode, error: e.message });
        }
      }

      await saveDb(env, db);
      return json(results);
    }

    if (pathname.startsWith('/api/wishlist/') && request.method === 'DELETE') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const rjCode = pathname.replace('/api/wishlist/', '').toUpperCase().trim();
      const db = await getDb(env);
      if (rjCode === 'CLEAR_ALL' || rjCode === 'CLEAR') {
        db.wishlist = [];
      } else {
        db.wishlist = (db.wishlist || []).filter(w => w.rjCode !== rjCode);
      }
      await saveDb(env, db);
      return json({ success: true, wishlist: db.wishlist });
    }

    // Aggregations
    if (pathname === '/api/tags') {
      if (!isAuth()) return json([]);
      const db = await getDb(env);
      const cvNamesSet = new Set();
      Object.values(db.works || {}).forEach(w => {
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

      const counts = {};
      Object.values(db.works || {}).forEach(w => {
        (w.tags || []).forEach(t => {
          const clean = (t || '').trim();
          if (!clean || cvNamesSet.has(clean.toLowerCase())) return;
          const entry = db.tagDict?.[clean] || BASE_TAG_DICT[clean];
          if (entry && entry.isCV) return;
          counts[clean] = (counts[clean] || 0) + 1;
        });
      });
      const tagList = Object.entries(counts).map(([name, count]) => ({
        name,
        count,
        en: db.tagDict?.[name] || BASE_TAG_DICT[name] || ''
      })).sort((a, b) => b.count - a.count);
      return json({ tags: tagList, tagDict: db.tagDict || BASE_TAG_DICT });
    }

    if (pathname === '/api/artists') {
      if (!isAuth()) return json([]);
      const db = await getDb(env);
      const counts = {};
      Object.values(db.works || {}).forEach(w => {
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
            counts[cv] = (counts[cv] || 0) + 1;
          });
        }
      });
      return json(Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count));
    }

    if (pathname === '/api/tags/translate-batch' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      try {
        const body = await request.json().catch(() => ({}));
        const tags = body.tags;
        if (!Array.isArray(tags) || tags.length === 0) {
          return json({ success: false, error: 'tags must be a non-empty array' }, 400);
        }
        const apiKey = (env && env.OPENROUTER_API_KEY) || '';
        if (!apiKey) {
          return json({ success: false, error: 'OPENROUTER_API_KEY is not configured in Cloudflare Worker environment variables.' }, 500);
        }
        const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + apiKey,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://astreamer.local',
            'X-Title': 'streasmr Tag Translator'
          },
          body: JSON.stringify({
            model: 'deepseek/deepseek-v3.2',
            messages: [
              {
                role: 'system',
                content: 'You are a specialist in Japanese doujin works, ASMR voice actors (CVs), and adult content tags.\nYour task is to convert Japanese tags into Rōmaji (Hepburn system) and English.\n\nPRINCIPLES (not exceptions):\n\n1. **Voice Actor Names** (CVs / seiyuu):\n   - Read the full name as a single unit\n   - Do not split into separate words\n   - Example: 陽向葵ゅか → "Hinata Aoiyuka" (one name)\n   - Example: 秋野かえで → "Akino Kaede"\n   - Output the Rōmaji name in BOTH columns (no English translation needed)\n\n2. **Compound Tags** (multiple words with / or 、):\n   - Preserve the separator\n   - Each component gets its own Rōmaji and English\n   - Example: ラブラブ/あまあま → "Rabu Rabu / Ama Ama" | "Loving / Sweet"\n\n3. **Verb Forms**:\n   - For tags ending in 堕ち (ochi): use the noun form "Ochi" (not "Ochiru")\n   - The tag is a noun phrase, not a verb conjugation\n   - Example: 快楽堕ち → "Kairaku Ochi" | "Succumbing to Pleasure"\n\n4. **Technical Terms**:\n   - Use recognized subculture terminology\n   - Use clinical/educational English where appropriate\n   - Example: イラマチオ → "Iramachio" | "Deep Throat"\n\n5. **Romanization Consistency**:\n   - Use Hepburn system\n   - ち → "chi" (not "ti")\n   - つ → "tsu" (not "tu")\n   - Long vowels: おう → "ō" or "ou"\n   - し → "shi" (not "si")\n\n6. **One Term = One Unit**:\n   - 連続絶頂 → "Renzoku Zecchō" | "Multiple Orgasms" (not split into separate words)\n   - 淫紋 → "Inmon" | "Erotic Mark" (one word)\n\n7. **Context Matters**:\n   - "寝取られ" is "Netorare" (being cuckolded)\n   - "寝取り" is "Netori" (cuckolding someone else)\n   - "寝取らせ" is "Netorase" (consensual cuckolding)\n\nOutput strictly in JSON format:\n{"original_tag": {"romaji": "romaji_translation", "english": "english_translation"}}'
              },
              {
                role: 'user',
                content: JSON.stringify(tags)
              }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.1,
            max_tokens: 4096
          })
        });

        if (!resp.ok) {
          const errText = await resp.text();
          return json({ success: false, error: 'OpenRouter API returned ' + resp.status + ': ' + errText }, 502);
        }

        const data = await resp.json();
        const rawContent = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '{}';
        
        let cleaned = String(rawContent).replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
        const jsonBlockMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonBlockMatch) cleaned = jsonBlockMatch[0];

        let translated = {};
        try {
          translated = JSON.parse(cleaned);
        } catch (parseErr) {
          // Robust regex fallback to salvage valid objects if response was cut off
          const extracted = {};
          const objRegex = /"([^"]+)"\s*:\s*\{\s*"romaji"\s*:\s*"([^"]*)"\s*,\s*"english"\s*:\s*"([^"]*)"\s*\}/g;
          let match;
          while ((match = objRegex.exec(rawContent)) !== null) {
            extracted[match[1]] = { romaji: match[2], english: match[3] };
          }
          if (Object.keys(extracted).length > 0) {
            translated = extracted;
          } else {
            return json({
              success: false,
              error: 'JSON parse error: ' + parseErr.message,
              rawResponse: rawContent,
              tags: tags
            }, 422);
          }
        }

        // Post-process translations with normalizeCVRomaji
        for (const [k, v] of Object.entries(translated)) {
          if (v && typeof v === 'object' && v.romaji) {
            v.romaji = normalizeCVRomaji(k, v.romaji);
            if (v.english && (v.english === v.romaji || /^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(v.english))) {
              v.english = normalizeCVRomaji(k, v.english);
            }
          }
        }

        const db = await getDb(env);
        mergeTagDict(db, translated);
        await saveDb(env, db);

        return json({
          success: true,
          count: Object.keys(translated).length,
          translations: translated,
          tagDict: db.tagDict
        });
      } catch (e) {
        return json({ success: false, error: e.message }, 500);
      }
    }

    if (pathname === '/api/tags/classify-batch' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      try {
        const body = await request.json().catch(() => ({}));
        const tags = body.tags;
        if (!Array.isArray(tags) || tags.length === 0) {
          return json({ success: false, error: 'tags must be a non-empty array' }, 400);
        }
        const apiKey = (env && env.OPENROUTER_API_KEY) || '';
        if (!apiKey) {
          return json({ success: false, error: 'OPENROUTER_API_KEY is not configured in Cloudflare Worker environment variables.' }, 500);
        }
        const classifySystemPrompt = 'You are an expert specialist in Japanese doujin culture, ASMR content rating, and age-appropriateness classification.\\nYour task is to classify Japanese tags/genres into Safe For Work (SFW / All-Ages) vs. Not Safe For Work (NSFW / Adult / 18+ / Ecchi).\\n\\nCLASSIFICATION RULES:\\n1. **Mark as NSFW (true)**:\\n   - Any explicit sexual acts, sexual positions, intercourse (e.g., 手コキ, 中出し, セックス, 騎乗位, フェラ, クンニ, パイズリ, イラマチオ)\\n   - Bodily fluids and ejaculation (e.g., 射精, ザーメン, 潮吹き, 搾精, 精飲, 放尿, 飲尿)\\n   - Erotic stimulation, sexual pleasure, and orgasm control (e.g., オナサポ, 乳首責め, 絶頂, 連続絶頂, 快楽堕ち, メス堕ち, オホ声, 寸止め, オナホ)\\n   - Adult tropes, fetishes, erotic corruptions, and NTR (e.g., 痴女, 淫乱, 発情, 媚薬, 触手, 淫紋, 寝取られ, 寝取り, 寝取らせ, 悪堕ち, 肉便器)\\n   - BDSM, bondage, extreme sadistic/masochistic erotic play (e.g., 拘束, 調教, BDSM)\\n   - General explicit 18+ terms (e.g., 18禁, R18, NSFW, エロ)\\n\\n2. **Mark as SFW (false)**:\\n   - Wholesome audio triggers & binaural recording techniques (e.g., ASMR, バイノーラル, 立体音響, KU100, ダミヘ, 耳かき, 耳掃除, 吐息, 囁き, タッピング, 咀嚼音, 水音, 雨音, 炭酸, 心音, シャンプー, マッサージ)\\n   - Wholesome/Comforting themes and non-sexual roleplay (e.g., 癒やし, 甘やかし, 全肯定, 添い寝, 睡眠導入, 安眠, 朗読, ドラマCD, シチュエーションボイス)\\n   - General character archetypes when non-erotic (e.g., メイド, お姉さん, 幼馴染, 後輩, 先輩, 妹, エルフ, 獣耳, 猫耳, 巫女, ギャル)\\n   - Wholesome romance and non-explicit sweetness (e.g., 純愛, 告白, デート)\\n\\nOutput strictly in JSON format where key is the exact Japanese tag and value is boolean:\\n{"tag_1": true, "tag_2": false}';
        const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + apiKey,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://astreamer.local',
            'X-Title': 'streasmr Tag Classifier'
          },
          body: JSON.stringify({
            model: 'deepseek/deepseek-v3.2',
            messages: [
              { role: 'system', content: classifySystemPrompt },
              { role: 'user', content: JSON.stringify(tags) }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.1,
            max_tokens: 4096
          })
        });

        if (!resp.ok) {
          const errText = await resp.text();
          return json({ success: false, error: 'OpenRouter API returned ' + resp.status + ': ' + errText }, 502);
        }

        const data = await resp.json();
        const rawContent = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '{}';
        
        let cleaned = String(rawContent).replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
        const jsonBlockMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonBlockMatch) cleaned = jsonBlockMatch[0];

        let classified = {};
        try {
          classified = JSON.parse(cleaned);
        } catch (parseErr) {
          const extracted = {};
          const boolRegex = /"([^"]+)"\s*:\s*(true|false)/g;
          let match;
          while ((match = boolRegex.exec(rawContent)) !== null) {
            extracted[match[1]] = match[2] === 'true';
          }
          if (Object.keys(extracted).length > 0) {
            classified = extracted;
          } else {
            return json({
              success: false,
              error: 'JSON parse error: ' + parseErr.message,
              rawResponse: rawContent,
              tags: tags
            }, 422);
          }
        }

        const updates = {};
        for (const [t, isNsfw] of Object.entries(classified)) {
          updates[t] = { isNsfw: Boolean(isNsfw) };
        }

        const db = await getDb(env);
        mergeTagDict(db, updates);
        await saveDb(env, db);

        return json({
          success: true,
          count: Object.keys(classified).length,
          classifications: classified,
          tagDict: db.tagDict
        });
      } catch (e) {
        return json({ success: false, error: e.message }, 500);
      }
    }

    if (pathname === '/api/tags/sync-dict' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      try {
        const body = await request.json().catch(() => ({}));
        const newEntries = body.newEntries || body.updates;
        if (newEntries && typeof newEntries === 'object') {
          const db = await getDb(env);
          const changed = mergeTagDict(db, newEntries);
          if (changed) await saveDb(env, db);
          return json({ success: true, tagDict: db.tagDict });
        }
        return json({ success: false, error: 'Invalid newEntries object' }, 400);
      } catch (e) {
        return json({ success: false, error: e.message }, 500);
      }
    }

    if (pathname === '/api/tags/reset-dict' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      try {
        const db = await getDb(env);
        const currentDict = db.tagDict || {};
        const cleanedDict = Object.assign({}, BASE_TAG_DICT);
        let removedCount = 0;
        let preservedCount = 0;

        for (const [key, val] of Object.entries(currentDict)) {
          if (BASE_TAG_DICT[key]) continue;

          const isJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(key);
          if (!isJapanese) {
            cleanedDict[key] = val;
            preservedCount++;
            continue;
          }

          if (val && typeof val === 'object') {
            let romaji = (val.romaji || '').trim();
            const english = (val.english || '').trim();
            if (romaji) romaji = normalizeCVRomaji(key, romaji);
            const validRomaji = romaji && /[a-zA-Z]/.test(romaji) && romaji !== key;
            const validEnglish = english && /[a-zA-Z]/.test(english) && english !== key;

            if (val.isCV ? validRomaji : (validRomaji && validEnglish)) {
              cleanedDict[key] = {
                romaji: romaji,
                english: val.isCV ? (validEnglish ? english : romaji) : english,
                isCV: !!val.isCV
              };
              preservedCount++;
              continue;
            }
          }
          removedCount++;
        }

        db.tagDict = cleanedDict;
        await saveDb(env, db);
        return json({ success: true, removedCount, preservedCount, tagDict: db.tagDict });
      } catch (e) {
        return json({ success: false, error: e.message }, 500);
      }
    }

    // Backup Export & Import APIs
    if (pathname === '/api/backup' && request.method === 'GET') {
      const db = await getDb(env);
      return new Response(JSON.stringify(db, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="astreamer_backup.json"',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (pathname === '/api/backup' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const backupData = await request.json().catch(() => null);
      if (!backupData || !backupData.works) return json({ error: 'Invalid backup file' }, 400);

      await saveDb(env, backupData);
      return json({ success: true, message: 'Database restored successfully' });
    }

    // Settings API
    if (pathname === '/api/settings' && request.method === 'GET') {
      const db = await getDb(env);
      return json(db.settings || { contentMode: 'NSFW' });
    }

    if (pathname === '/api/settings' && request.method === 'POST') {
      if (!isAuth()) return json({ error: 'Unauthorized' }, 401);
      const body = await request.json().catch(() => ({}));
      const db = await getDb(env);
      db.settings = { ...(db.settings || {}), ...body };
      await saveDb(env, db);
      return json({ success: true, settings: db.settings });
    }

    // 5. Serve HTML Web UI for All Other Routes
    return new Response(INDEX_HTML, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
};

// Complete Web App SPA Frontend
const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>aStreamer | Your one hub streaming services</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐧</text></svg>">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
  <style>
    :root {
      --bg-main: #0a0a0f;
      --bg-card: #12131a;
      --bg-card-hover: #181a24;
      --border: rgba(255, 255, 255, 0.08);
      --accent: #ff7a00;
      --accent-hover: #ea6c00;
      --accent-glow: rgba(255, 122, 0, 0.35);
      --accent-gradient: linear-gradient(135deg, #ff7a00, #ff9500);
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --sidebar-w: 240px;
      --player-bg: #101118;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
    body { background: var(--bg-main); color: var(--text-main); min-height: 100vh; display: flex; overflow-x: hidden; }
    a { text-decoration: none; color: inherit; }
    a:hover, a:focus, a:active, a:visited { text-decoration: none; }

    /* Desktop Sidebar */
    .app-sidebar {
      width: var(--sidebar-w);
      background: #0c0d14;
      border-right: 1px solid var(--border);
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      padding: 24px 16px 40px;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      scrollbar-width: thin;
      z-index: 50;
    }
    .logo-area { display: flex; align-items: center; gap: 10px; padding: 0 10px; margin-bottom: 32px; cursor: pointer; }
    .logo-icon { width: 38px; height: 38px; background: var(--accent-gradient, linear-gradient(135deg, #ff7a00, #ff9500)); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.35rem; box-shadow: 0 0 16px var(--accent-glow); flex-shrink: 0; }
    .logo-title { font-weight: 800; font-size: 1.25rem; letter-spacing: -0.02em; background: linear-gradient(90deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .nav-section { display: flex; flex-direction: column; gap: 4px; }
    .nav-title { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); padding: 12px 10px 6px; font-weight: 700; }
    .nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 10px; font-size: 0.92rem; font-weight: 600; color: #9ca3af; cursor: pointer; transition: 0.15s; background: none; border: none; text-align: left; width: 100%; }
    .nav-item:hover { background: var(--bg-card-hover); color: #fff; }
    .nav-item.active { background: var(--accent); color: #fff; }

    /* Responsive Mobile Top Navbar */
    .mobile-topbar {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 58px;
      background: rgba(12, 13, 20, 0.95);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--border);
      z-index: 60;
      padding: 0 14px;
      align-items: center;
      justify-content: space-between;
    }
    .mobile-nav-pills {
      display: none;
      position: fixed;
      top: 58px;
      left: 0;
      right: 0;
      background: rgba(10, 10, 15, 0.96);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border);
      z-index: 59;
      padding: 8px 12px;
      overflow-x: auto;
      white-space: nowrap;
      gap: 8px;
      scrollbar-width: none;
    }
    .mobile-nav-pills::-webkit-scrollbar { display: none; }
    .mobile-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-muted);
      background: var(--bg-card);
      border: 1px solid var(--border);
      cursor: pointer;
      flex-shrink: 0;
      transition: 0.15s;
    }
    .mobile-pill:hover { color: #fff; }
    .mobile-pill.active { background: var(--accent); color: #fff; border-color: var(--accent); }

    /* Main Container */
    .app-main { margin-left: var(--sidebar-w); flex: 1; padding: 24px 36px 120px; min-height: 100vh; }
    .topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; gap: 16px; }
    .search-box { flex: 1; max-width: 480px; position: relative; display: flex; align-items: center; }
    .search-box input { width: 100%; background: var(--bg-card); border: 1px solid var(--border); padding: 10px 16px 10px 42px; border-radius: 10px; color: #fff; font-size: 0.9rem; outline: none; transition: 0.2s; }
    .search-box input:focus { border-color: var(--accent); box-shadow: 0 0 12px rgba(255,51,102,0.25); }
    .search-box span { position: absolute; left: 14px; color: var(--text-muted); font-size: 0.95rem; }
    .tag-suggestions-dropdown {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin-top: 6px;
      background: rgba(18, 20, 29, 0.96);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 51, 102, 0.35);
      border-radius: 12px;
      box-shadow: 0 14px 36px rgba(0, 0, 0, 0.7);
      z-index: 1000;
      max-height: 280px;
      overflow-y: auto;
    }
    .tag-suggestion-item {
      padding: 9px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      cursor: pointer;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      transition: background 0.15s;
      font-size: 0.84rem;
    }
    .tag-suggestion-item:last-child { border-bottom: none; }
    .tag-suggestion-item:hover, .tag-suggestion-item.active { background: rgba(255, 51, 102, 0.2); }
    .suggestion-title { color: #fff; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    /* Zen Browser Style Command/Tag Search Modal */
    .zen-search-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(8, 10, 18, 0.78);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      z-index: 99999;
      align-items: flex-start;
      justify-content: center;
      padding: 8vh 16px 20px;
      animation: zenFadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes zenFadeIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .zen-search-card {
      width: 100%;
      max-width: 680px;
      background: rgba(18, 22, 36, 0.96);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      box-shadow: 0 30px 90px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.05), 0 0 30px rgba(124, 92, 252, 0.15);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: 80vh;
    }
    .zen-search-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.02);
    }
    .zen-search-icon {
      font-size: 1.25rem;
      opacity: 0.85;
    }
    .zen-search-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: #fff;
      font-size: 1.05rem;
      font-weight: 500;
      font-family: inherit;
    }
    .zen-search-input::placeholder {
      color: rgba(255, 255, 255, 0.38);
      font-size: 0.95rem;
    }
    .zen-search-commit-btn {
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      color: #0f172a;
      font-weight: 700;
      font-size: 0.8rem;
      padding: 6px 14px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      margin-right: 6px;
      white-space: nowrap;
      transition: all 0.15s ease;
      box-shadow: 0 2px 8px rgba(56, 189, 248, 0.25);
    }
    .zen-search-commit-btn:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(56, 189, 248, 0.4);
    }
    .zen-close-btn {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
      border-radius: 8px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.9rem;
      transition: 0.15s;
    }
    .zen-close-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
    }
    .zen-chips-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      padding: 10px 20px;
      background: rgba(0, 0, 0, 0.35);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .zen-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(124, 92, 252, 0.22);
      border: 1px solid rgba(124, 92, 252, 0.45);
      color: #ddd6fe;
      font-size: 0.82rem;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 20px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }
    .zen-chip-remove {
      cursor: pointer;
      font-size: 0.85rem;
      color: #a78bfa;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      transition: 0.15s;
    }
    .zen-chip-remove:hover {
      background: rgba(239, 68, 68, 0.3);
      color: #fca5a5;
    }
    .zen-clear-btn {
      background: none;
      border: none;
      color: #f87171;
      font-size: 0.78rem;
      cursor: pointer;
      margin-left: auto;
      padding: 2px 6px;
      border-radius: 4px;
      transition: 0.15s;
    }
    .zen-clear-btn:hover {
      text-decoration: underline;
    }
    .zen-results-container {
      overflow-y: auto;
      padding: 10px 14px;
      flex: 1;
      max-height: 440px;
    }
    .zen-category-title {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #94a3b8;
      font-weight: 700;
      margin: 10px 8px 6px;
    }
    .zen-result-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 11px 16px;
      border-radius: 10px;
      margin-bottom: 4px;
      cursor: pointer;
      transition: all 0.15s ease;
      border: 1px solid transparent;
      background: rgba(255, 255, 255, 0.02);
    }
    .zen-result-item:hover, .zen-result-item.selected {
      background: rgba(124, 92, 252, 0.18);
      border-color: rgba(124, 92, 252, 0.45);
      transform: translateX(2px);
    }
    .zen-tag-info {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      flex: 1;
      min-width: 0;
    }
    .zen-tag-orig {
      font-size: 0.95rem;
      font-weight: 700;
      color: #fff;
    }
    .zen-tag-romaji {
      font-size: 0.85rem;
      color: #c084fc;
      font-weight: 500;
    }
    .zen-tag-eng {
      font-size: 0.85rem;
      color: #94a3b8;
    }
    .zen-tag-sep {
      color: rgba(255, 255, 255, 0.2);
      font-size: 0.75rem;
    }
    .zen-tag-badge {
      font-size: 0.75rem;
      background: rgba(255, 255, 255, 0.08);
      color: #cbd5e1;
      padding: 3px 8px;
      border-radius: 12px;
      font-weight: 600;
      white-space: nowrap;
    }
    .zen-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 0.76rem;
      color: #64748b;
      background: rgba(0, 0, 0, 0.3);
    }
    .zen-shortcut-badge {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 2px 6px;
      border-radius: 4px;
      color: #cbd5e1;
      font-family: inherit;
      font-size: 0.72rem;
      font-weight: 600;
    }
    .top-actions { display: flex; gap: 10px; }
    .btn-primary { background: var(--accent); color: #fff; border: none; padding: 9px 16px; border-radius: 10px; font-weight: 700; font-size: 0.88rem; cursor: pointer; transition: 0.15s; display: inline-flex; align-items: center; gap: 6px; }
    .btn-primary:hover { background: var(--accent-hover); box-shadow: 0 0 12px var(--accent-glow); }
    .btn-outline { background: transparent; color: #fff; border: 1px solid var(--border); padding: 9px 14px; border-radius: 10px; font-weight: 600; font-size: 0.88rem; cursor: pointer; transition: 0.15s; display: inline-flex; align-items: center; gap: 6px; }
    .btn-outline:hover { background: var(--bg-card-hover); border-color: rgba(255,255,255,0.2); }
    .btn-icon { background: var(--bg-card); border: 1px solid var(--border); color: #fff; width: 38px; height: 38px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; font-size: 1.05rem; cursor: pointer; transition: 0.15s; }
    .btn-icon:hover { background: var(--bg-card-hover); border-color: rgba(255,255,255,0.2); }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .spin { display: inline-block; animation: spin 1s linear infinite; }

    /* View Modes & Explorer Toolbar */
    .view-modes-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 20px;
      background: rgba(18, 19, 26, 0.7);
      border: 1px solid var(--border);
      padding: 8px 14px;
      border-radius: 12px;
    }
    .view-mode-buttons {
      display: flex;
      gap: 4px;
      background: #0c0d12;
      padding: 3px;
      border-radius: 8px;
      border: 1px solid var(--border);
    }
    .view-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.82rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: 0.15s;
    }
    .view-btn:hover { color: #fff; background: rgba(255,255,255,0.06); }
    .view-btn.active { background: var(--accent); color: #fff; }
    .per-page-select {
      background: #0c0d12;
      border: 1px solid var(--border);
      color: #fff;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 600;
      outline: none;
      cursor: pointer;
    }

    /* Grids & Cards */
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; flex-wrap: wrap; gap: 12px; }
    .section-title { font-size: 1.35rem; font-weight: 800; display: flex; align-items: center; gap: 8px; }
    .works-grid { display: grid; gap: 20px; }
    
    /* View Mode: Medium (Default) */
    .works-grid.mode-medium { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }

    /* View Mode: Large */
    .works-grid.mode-large { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
    .works-grid.mode-large .card-title { font-size: 1rem; }

    /* View Mode: Small */
    .works-grid.mode-small { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
    .works-grid.mode-small .work-card { padding: 8px; border-radius: 10px; }
    .works-grid.mode-small .card-title { font-size: 0.78rem; height: 2.5em; margin-bottom: 2px; }
    .works-grid.mode-small .card-sub { font-size: 0.72rem; }

    .work-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; padding: 12px; cursor: pointer; transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; position: relative; min-width: 0; }
    .work-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.22); box-shadow: 0 10px 24px rgba(0,0,0,0.5); }
    .card-cover-wrapper { position: relative; width: 100%; aspect-ratio: 3 / 4; border-radius: 10px; overflow: hidden; margin-bottom: 10px; background: #0c0d12; }
    .card-cover { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
    .disguised-overlay { position: absolute; top: 8px; left: 8px; }
    .disguised-badge { background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); color: #38bdf8; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(56,189,248,0.4); }
    .card-badge-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
    .card-rj { font-size: 0.75rem; font-weight: 700; color: #38bdf8; background: rgba(56,189,248,0.12); padding: 2px 6px; border-radius: 4px; }
    .card-fav { font-size: 0.95rem; cursor: pointer; }
    .card-title { font-size: 0.88rem; font-weight: 700; line-height: 1.35; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 2.7em; word-break: break-word; }
    .card-sub { font-size: 0.8rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* View Mode: Detailed List */
    .works-list-table { width: 100%; border-collapse: collapse; background: var(--bg-card); border-radius: 12px; overflow: hidden; border: 1px solid var(--border); }
    .works-list-table th { text-align: left; padding: 12px 14px; font-size: 0.78rem; color: var(--text-muted); border-bottom: 1px solid var(--border); text-transform: uppercase; letter-spacing: 0.5px; }
    .works-list-table td { padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 0.88rem; vertical-align: middle; }
    .works-list-row { cursor: pointer; transition: background 0.15s; }
    .works-list-row:hover { background: var(--bg-card-hover); }
    .list-thumb { width: 44px; height: 44px; border-radius: 6px; object-fit: cover; background: #0c0d12; flex-shrink: 0; }

    /* Pagination Bar */
    .pagination-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: 28px;
      flex-wrap: wrap;
    }
    .page-btn {
      background: var(--bg-card);
      border: 1px solid var(--border);
      color: #fff;
      padding: 7px 12px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      transition: 0.15s;
      min-width: 38px;
      text-align: center;
    }
    .page-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
    .page-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; box-shadow: 0 0 10px var(--accent-glow); }
    .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .page-info { font-size: 0.82rem; color: var(--text-muted); font-weight: 600; margin: 0 8px; }

    /* Work Detail */
    .work-detail-banner { display: flex; gap: 28px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; margin-bottom: 2rem; }
    .detail-cover { width: 220px; min-width: 220px; height: 300px; border-radius: 12px; object-fit: cover; background: #0c0d12; }
    .detail-info { flex: 1; display: flex; flex-direction: column; }
    .detail-title { font-size: 1.6rem; font-weight: 800; margin-bottom: 12px; line-height: 1.3; }
    .detail-meta { font-size: 0.95rem; color: var(--text-muted); margin-bottom: 8px; }
    .detail-meta strong { color: #fff; }
    .tags-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
    .tag-pill { background: #232736; border: 1px solid #33384c; color: #d1d5db; font-size: 0.78rem; padding: 4px 10px; border-radius: 6px; cursor: pointer; transition: 0.15s; }
    .tag-pill:hover { background: var(--accent); color: #fff; }
    .tracks-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    .tracks-table th { text-align: left; padding: 10px 14px; font-size: 0.8rem; color: var(--text-muted); border-bottom: 1px solid var(--border); }
    .tracks-table td { padding: 12px 14px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 0.9rem; }
    .track-row { cursor: pointer; transition: 0.15s; }
    .track-row:hover { background: var(--bg-card-hover); }
    .track-row.active { background: rgba(255,51,102,0.12); color: var(--accent); }
    .chapter-row { cursor: pointer; transition: 0.15s; }
    .chapter-row:hover { background: var(--bg-card-hover); }
    .chapter-row.active { background: rgba(56, 189, 248, 0.12); color: #38bdf8; }
    .chapter-row.active td { font-weight: 700; }
    .timestamp-btn { background: rgba(56, 189, 248, 0.14); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.35); font-family: monospace; font-size: 0.82rem; font-weight: 700; padding: 3px 8px; border-radius: 6px; cursor: pointer; transition: 0.15s; display: inline-flex; align-items: center; gap: 4px; }
    .timestamp-btn:hover { background: #38bdf8; color: #000; box-shadow: 0 0 10px rgba(56, 189, 248, 0.4); }
    .nav-badge { background: #38bdf8; color: #050608; font-size: 0.65rem; font-weight: 800; padding: 1px 6px; border-radius: 10px; margin-left: auto; display: inline-block; }
    .wishlist-row { transition: 0.15s; }
    .wishlist-row:hover { background: var(--bg-card-hover); }
    .tag-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
    .tag-cloud-item { background: var(--bg-card); border: 1px solid var(--border); padding: 10px 18px; border-radius: 24px; font-weight: 600; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
    .tag-cloud-item:hover { background: var(--accent); color: #fff; }
    .tag-count { background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; }

    /* Modals */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.78); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 1000; display: none; align-items: center; justify-content: center; padding: 16px; }
    .modal-content { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 28px; width: 100%; max-width: 540px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
    .modal-title { font-size: 1.3rem; font-weight: 800; margin-bottom: 14px; }
    .modal-textarea { width: 100%; height: 140px; background: #0c0d12; border: 1px solid var(--border); border-radius: 10px; padding: 12px; color: #fff; font-family: monospace; font-size: 0.9rem; outline: none; margin-bottom: 16px; resize: vertical; }

    /* Page Import Preview Cards & Carousel */
    .page-import-carousel {
      display: flex;
      gap: 16px;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 10px 4px 16px;
      scroll-snap-type: x mandatory;
      scrollbar-width: thin;
      scrollbar-color: #38bdf8 rgba(255, 255, 255, 0.08);
      scroll-behavior: smooth;
    }
    .page-import-carousel::-webkit-scrollbar {
      height: 8px;
    }
    .page-import-carousel::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.06);
      border-radius: 4px;
    }
    .page-import-carousel::-webkit-scrollbar-thumb {
      background: #38bdf8;
      border-radius: 4px;
    }
    .page-import-carousel::-webkit-scrollbar-thumb:hover {
      background: #0ea5e9;
    }
    .page-import-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      padding: 6px 2px;
      max-height: 520px;
      overflow-y: auto;
    }
    .page-import-card {
      background: #121520;
      border: 2px solid rgba(56, 189, 248, 0.4);
      border-radius: 14px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      position: relative;
      cursor: pointer;
      transition: all 0.2s ease;
      user-select: none;
    }
    .page-import-carousel .page-import-card {
      min-width: 240px;
      max-width: 240px;
      scroll-snap-align: start;
    }
    .page-import-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
    }
    .page-import-card.excluded {
      opacity: 0.42;
      filter: grayscale(0.65);
      border-color: rgba(239, 68, 68, 0.35);
      background: #0d0f17;
    }
    .page-import-card.excluded:hover {
      opacity: 0.7;
      filter: grayscale(0.2);
    }
    .import-check-overlay {
      position: absolute;
      top: 14px;
      right: 14px;
      z-index: 10;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: #0284c7;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 800;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
      border: 2px solid #fff;
      transition: all 0.15s ease;
    }
    .page-import-card.excluded .import-check-overlay {
      background: #334155;
      color: #94a3b8;
      border-color: #64748b;
    }

    /* Bottom Player Bar */
    .player-bar { position: fixed; bottom: 0; left: var(--sidebar-w); right: 0; height: 84px; background: var(--player-bg); border-top: 1px solid var(--border); padding: 0 24px; display: flex; align-items: center; justify-content: space-between; z-index: 100; box-shadow: 0 -8px 24px rgba(0,0,0,0.5); }
    .player-left { display: flex; align-items: center; gap: 14px; width: 300px; cursor: pointer; }
    .player-thumb { width: 52px; height: 52px; border-radius: 8px; object-fit: cover; background: #0c0d12; flex-shrink: 0; }
    .player-track-info { overflow: hidden; }
    .player-title { font-size: 0.9rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .player-sub { font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .player-center { flex: 1; max-width: 560px; display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .player-controls { display: flex; align-items: center; gap: 14px; }
    .ctrl-btn { background: none; border: 1px solid transparent; color: #fff; cursor: pointer; font-size: 1.1rem; opacity: 0.85; transition: 0.15s; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; padding: 4px 6px; }
    .ctrl-btn:hover { opacity: 1; color: var(--accent); }
    .ctrl-btn.active { opacity: 1; color: var(--accent); background: rgba(255, 51, 102, 0.18); border-color: rgba(255, 51, 102, 0.4); text-shadow: 0 0 10px rgba(255, 51, 102, 0.6); }
    .play-btn-circle { width: 40px; height: 40px; border-radius: 50%; background: #fff; color: #000; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; border: none; transition: transform 0.15s, background 0.15s; }
    .play-btn-circle:hover { transform: scale(1.08); background: var(--accent); color: #fff; }
    .scrubber-row { display: flex; align-items: center; gap: 12px; width: 100%; }
    .time-text { font-size: 0.75rem; color: var(--text-muted); font-variant-numeric: tabular-nums; min-width: 40px; }
    .scrubber { flex: 1; height: 4px; appearance: none; -webkit-appearance: none; background: #333748; border-radius: 2px; outline: none; cursor: pointer; }
    .scrubber::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 12px; height: 12px; border-radius: 50%; background: var(--accent); cursor: pointer; }
    .player-right { display: flex; align-items: center; gap: 14px; width: 300px; justify-content: flex-end; }
    .volume-slider { width: 90px; height: 4px; appearance: none; -webkit-appearance: none; background: #333748; border-radius: 2px; outline: none; cursor: pointer; }
    .volume-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 10px; height: 10px; border-radius: 50%; background: #fff; }

    .player-expand-btn {
      width: 36px;
      height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: rgba(255,255,255,0.06);
      color: #38bdf8;
      border: 1px solid rgba(56,189,248,0.25);
      cursor: pointer;
      transition: all 0.15s ease;
      flex-shrink: 0;
    }
    .player-expand-btn:hover {
      background: rgba(56,189,248,0.2);
      border-color: #38bdf8;
      transform: scale(1.05);
    }
    #btnExpandPlayerMobile { display: none; }

    /* Floating Corner Player (Bottom-Right Docked Card) */
    .floating-corner-player {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 360px;
      max-width: calc(100vw - 32px);
      max-height: calc(100vh - 48px);
      z-index: 1050;
      background: rgba(17, 18, 27, 0.98);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 20px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.85), 0 0 35px rgba(255,51,102,0.18);
      display: none;
      flex-direction: column;
      overflow: hidden;
      animation: slideUpCorner 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideUpCorner {
      from { opacity: 0; transform: translateY(24px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .popup-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 18px 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .popup-body {
      padding: 16px 18px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .popup-cover-wrap {
      width: 100%;
      height: 220px;
      border-radius: 14px;
      overflow: hidden;
      position: relative;
      background: #08090d;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.6);
    }
    .popup-cover {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: #050608;
    }
    .popup-meta { text-align: center; }
    .popup-title { font-size: 1.05rem; font-weight: 800; line-height: 1.35; margin-bottom: 4px; }
    .popup-sub { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 6px; }
    .popup-cv-row { display: flex; justify-content: center; flex-wrap: wrap; gap: 6px; }
    .popup-controls { display: flex; align-items: center; justify-content: center; gap: 16px; margin: 4px 0; }
    .popup-play-btn { width: 48px; height: 48px; border-radius: 50%; background: #fff; color: #000; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; cursor: pointer; border: none; transition: transform 0.15s, background 0.15s; }
    .popup-play-btn:hover { transform: scale(1.08); background: var(--accent); color: #fff; }
    .popup-secondary-row { display: flex; align-items: center; justify-content: space-between; padding-top: 4px; border-top: 1px solid rgba(255,255,255,0.06); }
    .popup-drawer-toggle { background: var(--bg-card); border: 1px solid var(--border); color: #fff; padding: 8px 12px; border-radius: 10px; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: space-between; width: 100%; transition: 0.2s; }
    .popup-drawer-toggle:hover { background: var(--bg-card-hover); }
    .popup-chapters-list { max-height: 150px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; margin-top: 8px; }
    .popup-chapter-item { padding: 8px 10px; border-radius: 6px; font-size: 0.8rem; background: rgba(255,255,255,0.03); cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: 0.15s; }
    .popup-chapter-item:hover { background: var(--bg-card-hover); }
    .popup-chapter-item.active { background: rgba(255,51,102,0.15); color: var(--accent); font-weight: 700; }
    .playlist-track-row { cursor: pointer; transition: 0.15s; }
    .playlist-track-row:hover { background: var(--bg-card-hover); }
    .playlist-track-row.active { background: rgba(255, 51, 102, 0.15) !important; color: var(--accent); font-weight: 700; }
    .playlist-track-row.active td { color: var(--accent) !important; }
    .playlist-card-row.active { border-color: var(--accent) !important; box-shadow: 0 0 16px rgba(255,51,102,0.3) !important; }

    .gatekeeper-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; padding: 40px 32px; text-align: center; max-width: 420px; width: 100%; box-shadow: 0 20px 50px rgba(0,0,0,0.8); }
    .playlist-select-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 8px; background: #0c0d12; border: 1px solid var(--border); cursor: pointer; transition: 0.15s; }
    .playlist-select-item:hover { background: var(--bg-card-hover); border-color: rgba(255,255,255,0.2); }
    .settings-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; margin-bottom: 20px; }
    .settings-option { display: flex; align-items: flex-start; gap: 14px; padding: 14px; border-radius: 10px; border: 1px solid var(--border); margin-bottom: 10px; cursor: pointer; transition: 0.2s; }
    .settings-option:hover { background: var(--bg-card-hover); }
    .settings-option.selected { border-color: var(--accent); background: rgba(255,51,102,0.08); }
    .settings-radio { margin-top: 4px; accent-color: var(--accent); cursor: pointer; }
    .settings-label { font-size: 1rem; font-weight: 700; margin-bottom: 4px; }
    .settings-desc { font-size: 0.85rem; color: var(--text-muted); }
    .mobile-search-bar { display: none; margin-bottom: 16px; }
    #playerBarChapterBtnMobile { display: none; }

    /* Responsive Mobile Media Queries */
    @media (max-width: 768px) {
      /* Responsive Mobile Grid Density */
      .works-grid.mode-large {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      .works-grid.mode-medium {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }
      .works-grid.mode-small {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        gap: 6px !important;
      }
      .works-grid.mode-small .work-card {
        padding: 4px !important;
        border-radius: 6px !important;
      }
      .works-grid.mode-small .card-cover-wrapper {
        margin-bottom: 4px !important;
        border-radius: 4px !important;
        aspect-ratio: 3 / 4 !important;
        width: 100% !important;
        height: auto !important;
      }
      .works-grid.mode-small .card-badge-row {
        margin-bottom: 2px !important;
      }
      .works-grid.mode-small .card-rj {
        font-size: 0.58rem !important;
        padding: 1px 3px !important;
      }
      .works-grid.mode-small .card-fav {
        font-size: 0.72rem !important;
      }
      .works-grid.mode-small .card-title {
        font-size: 0.65rem !important;
        -webkit-line-clamp: 2 !important;
        height: 2.3em !important;
        margin-bottom: 2px !important;
        line-height: 1.15 !important;
      }
      .works-grid.mode-small .card-sub {
        font-size: 0.58rem !important;
      }

      #playerBarChapterBtnMobile { display: inline-flex; }
      #playerBarChapterBtn { display: none; }
      .app-sidebar { display: none; }
      .mobile-topbar { display: flex; }
      .mobile-nav-pills { display: flex; }
      .app-main {
        margin-left: 0 !important;
        padding: 114px 12px 180px !important;
      }
      .pagination-bar {
        margin-top: 24px !important;
        margin-bottom: 24px !important;
        position: relative !important;
        z-index: 5 !important;
      }
      .mobile-search-bar { display: block; }
      .floating-corner-player {
        bottom: 12px;
        left: 8px;
        right: 8px;
        width: auto;
        max-width: none;
        max-height: calc(100vh - 24px);
        border-radius: 18px;
      }
      .work-detail-banner {
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 16px;
      }
      .detail-cover {
        width: 180px;
        min-width: 180px;
        height: 240px;
      }
      .detail-meta { justify-content: center; }
      .tags-row { justify-content: center; }
      /* Mobile Player Bar Overhaul: Clean, spacious 3-row thumb-friendly layout */
      .player-bar {
        left: 0;
        padding: 6px 12px 10px;
        height: auto;
        min-height: 110px;
        flex-direction: column;
        justify-content: center;
        gap: 6px;
      }
      .player-left {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      .player-track-info {
        flex: 1;
        min-width: 0;
      }
      .player-left .ctrl-btn {
        width: 36px;
        height: 36px;
        font-size: 1rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: rgba(255,255,255,0.06);
      }
      .player-center {
        width: 100%;
        max-width: 100%;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .player-controls {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 100%;
        padding: 0 4px;
      }
      .player-controls .play-btn-circle {
        width: 46px;
        height: 46px;
        font-size: 1.35rem;
      }
      .player-controls .ctrl-btn {
        width: 38px;
        height: 38px;
        font-size: 1.1rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: rgba(255,255,255,0.04);
      }
      .scrubber-row {
        width: 100%;
        gap: 8px;
      }
      #btnExpandPlayerMobile { display: inline-flex !important; }
      .player-right { display: none !important; }
      /* Mobile Responsive 2-Row Chapter Cards */
      .tracks-table.chapters-table, .tracks-table.chapters-table tbody,
      .tracks-table.audio-tracks-table, .tracks-table.audio-tracks-table tbody {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
      }
      .tracks-table.chapters-table thead,
      .tracks-table.audio-tracks-table thead {
        display: none;
      }
      .tracks-table.chapters-table tr.chapter-row,
      .tracks-table.audio-tracks-table tr.track-row {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-areas: 
          "num title"
          "time action";
        row-gap: 8px;
        column-gap: 10px;
        align-items: center;
        padding: 10px 12px;
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: 10px;
        box-sizing: border-box;
      }
      .tracks-table.chapters-table tr.chapter-row td,
      .tracks-table.audio-tracks-table tr.track-row td {
        border-bottom: none !important;
        padding: 0 !important;
      }
      .tracks-table.chapters-table tr.chapter-row td:nth-child(1),
      .tracks-table.audio-tracks-table tr.track-row td:nth-child(1) {
        grid-area: num;
        font-weight: 800;
        color: #38bdf8;
        font-size: 0.8rem;
        background: rgba(56, 189, 248, 0.12);
        padding: 2px 7px !important;
        border-radius: 6px;
        align-self: start;
        text-align: center;
        width: fit-content;
      }
      .tracks-table.chapters-table tr.chapter-row td:nth-child(2),
      .tracks-table.audio-tracks-table tr.track-row td:nth-child(2) {
        grid-area: title;
        font-size: 0.88rem;
        line-height: 1.35;
        word-break: break-word;
      }
      .tracks-table.chapters-table tr.chapter-row td:nth-child(3),
      .tracks-table.audio-tracks-table tr.track-row td:nth-child(3) {
        grid-area: time;
      }
      .tracks-table.chapters-table tr.chapter-row td:nth-child(4),
      .tracks-table.audio-tracks-table tr.track-row td:nth-child(4) {
        grid-area: action;
        text-align: right;
      }

      /* Mobile Responsive Playlist Cards */
      .tracks-table.playlist-tracks-table, .tracks-table.playlist-tracks-table tbody {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
      }
      .tracks-table.playlist-tracks-table thead {
        display: none;
      }
      .tracks-table.playlist-tracks-table tr.playlist-track-row {
        display: grid;
        grid-template-columns: 46px 1fr auto;
        grid-template-areas: 
          "art title actions"
          "art meta  meta";
        row-gap: 4px;
        column-gap: 10px;
        align-items: center;
        padding: 9px 12px;
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: 10px;
        box-sizing: border-box;
      }
      .tracks-table.playlist-tracks-table tr.playlist-track-row td {
        border-bottom: none !important;
        padding: 0 !important;
      }
      .tracks-table.playlist-tracks-table tr.playlist-track-row td:nth-child(1) {
        display: none;
      }
      .tracks-table.playlist-tracks-table tr.playlist-track-row td:nth-child(2) {
        grid-area: art;
        align-self: center;
      }
      .tracks-table.playlist-tracks-table tr.playlist-track-row td:nth-child(2) img {
        width: 46px !important;
        height: 46px !important;
        border-radius: 8px !important;
        object-fit: cover !important;
        display: block !important;
      }
      .tracks-table.playlist-tracks-table tr.playlist-track-row td.pl-track-title {
        grid-area: title;
        font-size: 0.85rem;
        line-height: 1.3;
        font-weight: 700;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 58vw;
      }
      .tracks-table.playlist-tracks-table tr.playlist-track-row td.pl-work-title {
        grid-area: meta;
        font-size: 0.74rem;
        color: var(--text-muted);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 76vw;
      }
      .tracks-table.playlist-tracks-table tr.playlist-track-row td.pl-cv-col {
        display: none;
      }
      .tracks-table.playlist-tracks-table tr.playlist-track-row td.pl-actions-col {
        grid-area: actions;
        text-align: right;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 4px;
      }
      .tracks-table.playlist-tracks-table tr.playlist-track-row td.pl-actions-col button {
        padding: 3px 7px !important;
        font-size: 0.72rem !important;
      }

      /* Mobile Gallery Modal & Lightbox Optimization */
      #workGalleryModal > div {
        width: 95vw !important;
        max-width: 95vw !important;
        max-height: 90vh !important;
        padding: 14px 10px !important;
        border-radius: 14px !important;
        box-sizing: border-box !important;
      }
      .work-gallery-grid {
        grid-template-columns: repeat(2, minmax(130px, 1fr)) !important;
        gap: 10px !important;
        width: 100% !important;
        box-sizing: border-box !important;
        max-height: calc(90vh - 75px) !important;
        padding: 2px 2px 16px 2px !important;
      }
      .gallery-card {
        width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
      }
      .gallery-thumb-wrap {
        display: block !important;
        aspect-ratio: 3 / 4 !important;
        width: 100% !important;
        height: auto !important;
        overflow: hidden !important;
        position: relative !important;
        background: #08090f !important;
      }
      .gallery-thumb {
        display: block !important;
        width: 100% !important;
        height: 100% !important;
        min-width: 100% !important;
        min-height: 100% !important;
        object-fit: cover !important;
        object-position: top center !important;
      }
      .gallery-card-title {
        font-size: 0.74rem !important;
        padding: 6px 8px !important;
        font-weight: 600 !important;
        color: var(--text-muted) !important;
      }
      #imageLightboxModal > div {
        max-width: 96vw !important;
        max-height: 90vh !important;
      }
      #lightboxImg {
        max-width: 94vw !important;
        max-height: 75vh !important;
        object-fit: contain !important;
      }
      #lightboxPrevBtn {
        left: 6px !important;
        width: 38px !important;
        height: 38px !important;
        font-size: 1.2rem !important;
      }
      #lightboxNextBtn {
        right: 6px !important;
        width: 38px !important;
        height: 38px !important;
        font-size: 1.2rem !important;
      }
      #lightboxCaption {
        font-size: 0.85rem !important;
        max-width: 90vw !important;
      }
      .app-toast {
        bottom: 120px !important;
        font-size: 0.85rem !important;
        padding: 9px 16px !important;
      }

      /* Mobile Responsive Library & History List Cards */
      .works-list-table, .works-list-table tbody {
        display: flex !important;
        flex-direction: column !important;
        gap: 8px !important;
        width: 100% !important;
        border: none !important;
        background: transparent !important;
      }
      .works-list-table thead {
        display: none !important;
      }
      .works-list-table tr.works-list-row {
        display: grid !important;
        grid-template-columns: 50px 1fr auto !important;
        grid-template-areas: 
          "cover title actions"
          "cover meta  actions" !important;
        row-gap: 3px !important;
        column-gap: 10px !important;
        align-items: center !important;
        padding: 9px 12px !important;
        background: var(--bg-card) !important;
        border: 1px solid var(--border) !important;
        border-radius: 10px !important;
        box-sizing: border-box !important;
        width: 100% !important;
      }
      .works-list-table tr.works-list-row td {
        border-bottom: none !important;
        padding: 0 !important;
      }
      .works-list-table tr.works-list-row td.w-col-cover,
      .works-list-table tr.works-list-row td:nth-child(1) {
        grid-area: cover !important;
        align-self: center !important;
      }
      .works-list-table tr.works-list-row .list-thumb {
        width: 50px !important;
        height: 50px !important;
        border-radius: 8px !important;
        object-fit: cover !important;
        display: block !important;
      }
      .works-list-table tr.works-list-row td.w-col-rj,
      .works-list-table tr.works-list-row td:nth-child(2) {
        display: none !important;
      }
      .works-list-table tr.works-list-row td.w-col-title,
      .works-list-table tr.works-list-row td:nth-child(3) {
        grid-area: title !important;
        font-size: 0.86rem !important;
        line-height: 1.3 !important;
        font-weight: 700 !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        max-width: 56vw !important;
      }
      .works-list-table tr.works-list-row td.w-col-meta,
      .works-list-table tr.works-list-row td:nth-child(4) {
        grid-area: meta !important;
        font-size: 0.74rem !important;
        color: var(--text-muted) !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        max-width: 56vw !important;
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
      }
      .works-list-table tr.works-list-row td.w-col-circle,
      .works-list-table tr.works-list-row td:nth-child(5),
      .works-list-table tr.works-list-row td.w-col-tracks,
      .works-list-table tr.works-list-row td:nth-child(6),
      .works-list-table.history-list-table tr.works-list-row td.w-col-date {
        display: none !important;
      }
      .works-list-table tr.works-list-row td.w-col-actions,
      .works-list-table tr.works-list-row td:last-child {
        grid-area: actions !important;
        text-align: right !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        gap: 6px !important;
      }
      .works-list-table tr.works-list-row td.w-col-actions button,
      .works-list-table tr.works-list-row td:last-child button {
        padding: 3px 8px !important;
        font-size: 0.75rem !important;
      }
    }

    /* Illustrations & Bonus Art Gallery */
    .work-gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 14px;
      width: 100%;
      box-sizing: border-box;
      margin-top: 8px;
      overflow-y: auto;
      max-height: calc(88vh - 110px);
      padding: 4px 6px 16px 2px;
      -webkit-overflow-scrolling: touch;
    }

    /* Horizontal Filmstrip / Reader Carousel Mode (adaptive for mobile) */
    .work-gallery-grid.view-strip {
      display: flex !important;
      flex-direction: row !important;
      overflow-x: auto !important;
      overflow-y: hidden !important;
      scroll-snap-type: x mandatory !important;
      -webkit-overflow-scrolling: touch !important;
      gap: 14px !important;
      padding: 6px 4px 18px 4px !important;
      align-items: stretch !important;
      height: 72vh !important;
      max-height: 580px !important;
      box-sizing: border-box !important;
    }
    .work-gallery-grid.view-strip .gallery-card {
      flex: 0 0 85vw !important;
      max-width: 380px !important;
      width: 85vw !important;
      height: 100% !important;
      scroll-snap-align: center !important;
      scroll-snap-stop: always !important;
      display: flex !important;
      flex-direction: column !important;
      background: #08090f !important;
      border: 1px solid var(--border) !important;
      border-radius: 12px !important;
      overflow: hidden !important;
      box-shadow: 0 10px 28px rgba(0,0,0,0.7) !important;
      box-sizing: border-box !important;
    }
    .work-gallery-grid.view-strip .gallery-thumb-wrap {
      flex: 1 1 auto !important;
      width: 100% !important;
      height: 100% !important;
      max-height: calc(100% - 38px) !important;
      aspect-ratio: unset !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: #040508 !important;
      overflow: hidden !important;
      position: relative !important;
    }
    .work-gallery-grid.view-strip .gallery-thumb {
      width: 100% !important;
      height: 100% !important;
      max-width: 100% !important;
      max-height: 100% !important;
      object-fit: contain !important;
      object-position: center !important;
      display: block !important;
    }
    .work-gallery-grid.view-strip .gallery-card-title {
      flex: 0 0 auto !important;
      font-size: 0.82rem !important;
      padding: 8px 12px !important;
      background: #0f131d !important;
      border-top: 1px solid rgba(255,255,255,0.08) !important;
      color: #f1f5f9 !important;
      font-weight: 600 !important;
      text-align: center !important;
    }

    .gallery-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
      display: flex;
      flex-direction: column;
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
    }
    .gallery-card:hover {
      transform: translateY(-2px);
      border-color: #38bdf8;
      box-shadow: 0 6px 18px rgba(56,189,248,0.25);
    }
    .gallery-thumb-wrap {
      display: block;
      aspect-ratio: 3 / 4;
      width: 100%;
      overflow: hidden;
      background: #08090f;
      position: relative;
    }
    .gallery-thumb {
      display: block;
      width: 100%;
      height: 100%;
      min-width: 100%;
      min-height: 100%;
      object-fit: cover;
      object-position: top center;
      transition: transform 0.3s ease;
    }
    .gallery-card:hover .gallery-thumb {
      transform: scale(1.04);
    }
    .gallery-card-title {
      font-size: 0.78rem;
      padding: 8px 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--text-muted);
      text-align: center;
      background: rgba(255, 255, 255, 0.02);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    /* YouTube-style Toast Notification */
    .app-toast {
      position: fixed;
      bottom: 96px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: rgba(15, 23, 42, 0.96);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.65), 0 0 1px rgba(255, 255, 255, 0.2);
      color: #f8fafc;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      z-index: 100000;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 8px;
      max-width: 90vw;
      text-align: center;
      backdrop-filter: blur(8px);
    }
    .app-toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    @keyframes pulseWidget {
      0%, 100% { border-color: rgba(56, 189, 248, 0.45); box-shadow: 0 4px 16px rgba(0,0,0,0.6); }
      50% { border-color: rgba(56, 189, 248, 0.85); box-shadow: 0 4px 20px rgba(56, 189, 248, 0.35); }
    }
  </style>
</head>
<body>
  <!-- Toast Notification -->
  <div id="appToast" class="app-toast" style="display: none;"></div>

  <!-- Image Lightbox Modal -->
  <div id="imageLightboxModal" class="modal-overlay" style="display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.92); z-index: 9999;" onclick="closeLightboxModal()">
    <div style="position: relative; max-width: 92vw; max-height: 92vh; display: flex; flex-direction: column; align-items: center; justify-content: center;" onclick="event.stopPropagation()">
      <button class="btn-outline" onclick="closeLightboxModal()" style="position: absolute; top: -14px; right: -14px; background: #1e293b; color: #fff; width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--border); font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; z-index: 10;">✕</button>
      <button id="lightboxPrevBtn" onclick="navLightbox(-1)" style="position: absolute; left: -24px; top: 50%; transform: translateY(-50%); background: rgba(15, 23, 42, 0.85); color: #fff; width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--border); font-size: 1.4rem; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 4px 14px rgba(0,0,0,0.6); transition: all 0.2s;" title="Previous (Left Arrow)">‹</button>
      <button id="lightboxNextBtn" onclick="navLightbox(1)" style="position: absolute; right: -24px; top: 50%; transform: translateY(-50%); background: rgba(15, 23, 42, 0.85); color: #fff; width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--border); font-size: 1.4rem; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 4px 14px rgba(0,0,0,0.6); transition: all 0.2s;" title="Next (Right Arrow)">›</button>
      <img id="lightboxImg" src="" style="max-width: 90vw; max-height: 80vh; border-radius: 8px; object-fit: contain; box-shadow: 0 10px 30px rgba(0,0,0,0.8);" onerror="handleImgError(this)">
      <div id="lightboxCaption" style="color: #f1f5f9; font-weight: 700; margin-top: 12px; font-size: 0.95rem; text-align: center; max-width: 80vw; text-shadow: 0 2px 4px rgba(0,0,0,0.8);"></div>
    </div>
  </div>

  <!-- Work Gallery Modal -->
  <div id="workGalleryModal" class="modal-overlay" style="display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.85); z-index: 9990;" onclick="closeWorkGalleryModal()">
    <div style="position: relative; width: 92vw; max-width: 960px; max-height: 88vh; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; box-shadow: 0 16px 40px rgba(0,0,0,0.7); overflow: hidden;" onclick="event.stopPropagation()">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid var(--border); padding-bottom: 10px; flex-shrink: 0; gap: 8px;">
        <h3 id="workGalleryModalTitle" style="font-size: 1.05rem; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;">🖼️ Illustrations & Bonus Artwork</h3>
        <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
          <button id="btnGalleryViewMode" class="btn-outline" onclick="toggleGalleryViewMode()" style="padding: 4px 10px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px; font-weight: 600;" title="Switch View Mode">⊞ Grid View</button>
          <button class="btn-outline" onclick="closeWorkGalleryModal()" style="padding: 4px 10px;">✖</button>
        </div>
      </div>
      <div id="workGalleryModalGrid" class="work-gallery-grid view-strip">
        <!-- Filled dynamically -->
      </div>
    </div>
  </div>

  <!-- Admin Unlock Modal -->
  <div id="gatekeeperModal" class="modal-overlay" style="display: none;">
    <div class="gatekeeper-card" style="position: relative;">
      <button class="btn-outline" style="position: absolute; top: 16px; right: 16px; padding: 4px 10px;" onclick="closeAdminModal()">✖</button>
      <div class="logo-icon" style="margin: 0 auto 16px; width: 56px; height: 56px; font-size: 2rem;">🔒</div>
      <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 8px;">Admin Authentication</h2>
      <p id="gatekeeperSubtitle" style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">Enter your admin passcode to manage works and modify library settings.</p>
      <input type="password" id="passcodeInput" placeholder="Enter Admin Passcode" style="width: 100%; padding: 14px 18px; border-radius: 10px; background: #0c0d12; border: 1px solid var(--border); color: #fff; font-size: 1rem; outline: none; margin-bottom: 16px; text-align: center;" onkeydown="if(event.key==='Enter') loginAdmin()">
      <button class="btn-primary" style="width: 100%; padding: 14px; font-size: 1rem;" onclick="loginAdmin()">Unlock Admin Access</button>
      <div id="loginError" style="color: #ff3366; font-size: 0.85rem; margin-top: 12px; display: none;">Invalid Passcode</div>
    </div>
  </div>

  <!-- Changelog Modal -->
  <div id="changelogModal" class="modal-overlay">
    <div class="modal-content" style="max-width: 640px; max-height: 84vh; overflow-y: auto;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: var(--accent-gradient, linear-gradient(135deg, #ff7a00, #ff9500)); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; box-shadow: 0 0 14px var(--accent-glow);">🚀</div>
          <div>
            <h3 style="font-size: 1.3rem; font-weight: 800;">aStreamer Release Notes</h3>
            <span style="font-size: 0.8rem; color: var(--accent); font-weight: 700;">Version 2.0 Official Milestone Release</span>
          </div>
        </div>
        <button class="btn-outline" style="padding: 4px 10px;" onclick="closeChangelogModal()">✖</button>
      </div>
      
      <div style="color: #d1d5db; font-size: 0.9rem; line-height: 1.6; display: flex; flex-direction: column; gap: 14px;">
        <div style="background: rgba(255, 122, 0, 0.08); border: 1px solid rgba(255, 122, 0, 0.25); padding: 14px; border-radius: 10px;">
          <h4 style="color: #ff7a00; font-weight: 700; margin-bottom: 4px;">⚡ Instant Batch Ingestion &amp; Parallel Fast-Probing</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem;">Eliminated Cloudflare 503 Worker timeouts. Batch imports now probe JapaneseASMR with lightweight 2-URL parallel checks in ~150ms. Works not on JapaneseASMR are instantly ingested via REST API without expensive sequential CDN path guessing.</p>
        </div>

        <div style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25); padding: 14px; border-radius: 10px;">
          <h4 style="color: #38bdf8; font-weight: 700; margin-bottom: 4px;">🎧 On-Demand Lazy Audio Stream Resolution</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem;">Works from HentaiASMR Moe are gentle-scraped only when a user opens or plays the work, extracting the exact JWPlayer playlist and permanently caching it in KV for seamless instant replays.</p>
        </div>

        <div style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); padding: 14px; border-radius: 10px;">
          <h4 style="color: #f59e0b; font-weight: 700; margin-bottom: 4px;">🎨 Theme Accent Color Switcher (Orange Default)</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem;">Customize your app aesthetic in Settings. Choose from 🍊 Hyper Orange (v2.0 signature), 🌊 Cyber Sky Blue, 🔮 Electric Purple, 🍃 Emerald Green, 🌸 Sakura Rose, and ⚡ Golden Amber.</p>
        </div>

        <div style="background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.25); padding: 14px; border-radius: 10px;">
          <h4 style="color: #22c55e; font-weight: 700; margin-bottom: 4px;">🔊 Streamlined Player Controls</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem;">Volume is defaulted to 100% max output across all audio tracks with redundant sliders removed, giving a clean and unobstructed floating &amp; bottom player bar with quick one-click Mute / Unmute.</p>
        </div>

        <div style="background: rgba(168, 85, 247, 0.08); border: 1px solid rgba(168, 85, 247, 0.25); padding: 14px; border-radius: 10px;">
          <h4 style="color: #c084fc; font-weight: 700; margin-bottom: 4px;">🏷️ Self-Learning AI Tag &amp; CV Dictionary</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem;">Bilingual Japanese / Rōmaji / English tag autocompletion, DeepSeek AI SFW/NSFW classification, and high-resolution artwork gallery reader with touch-carousel.</p>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
        <button class="btn-primary" onclick="closeChangelogModal()">Got it</button>
      </div>
    </div>
  </div>

  <!-- Batch Import Modal -->
  <div id="importModal" class="modal-overlay">
    <div class="modal-content" style="max-width: 580px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <h3 class="modal-title" style="margin: 0;">📥 Batch Import RJ Works</h3>
        <div style="display: flex; gap: 6px;">
          <button class="btn-outline" id="btnMinimizeImport" type="button" onclick="minimizeImportToDock()" style="display: none; padding: 3px 9px; font-size: 0.95rem; font-weight: 700; line-height: 1; color: #38bdf8; border-color: rgba(56,189,248,0.4);" title="Minimize">—</button>
          <button class="btn-outline" type="button" onclick="closeImportModal()" style="padding: 3px 8px; font-size: 0.8rem;">✖</button>
        </div>
      </div>
      <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 12px;">Paste multiple RJ codes or upload a <code>.txt</code> file.</p>
      <textarea id="importTextarea" class="modal-textarea" oninput="updateImportCountBadge()" placeholder="RJ01473335&#10;RJ441308&#10;RJ01196620&#10;RJ01132855"></textarea>
      <div style="margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
        <input type="file" id="importFileInput" accept=".txt" style="font-size: 0.85rem; color: var(--text-muted);" onchange="handleFileUpload(event)">
        <span id="importCountBadge" style="font-size: 0.8rem; color: #38bdf8; font-weight: 700;"></span>
      </div>
      
      <div id="importProgressBox" style="display: none; margin-bottom: 16px; background: #0c0d14; border: 1px solid var(--border); border-radius: 10px; padding: 14px;">
        <div id="importBatchQueueList" style="max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px;"></div>
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
          <span>Live Activity Log</span>
          <button type="button" onclick="const l=document.getElementById('importLiveLogs'); if(l) l.innerHTML='';" class="btn-outline" style="padding: 1px 6px; font-size: 0.7rem; border-color: rgba(255,255,255,0.1);">Clear Log</button>
        </div>
        <div id="importLiveLogs" style="max-height: 110px; overflow-y: auto; font-family: monospace; font-size: 0.78rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 4px; background: #08090f; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.05);"></div>
      </div>

      <div style="display: flex; gap: 10px; justify-content: flex-end; align-items: center;">
        <button class="btn-outline" id="btnMinimizeImportFooter" type="button" onclick="minimizeImportToDock()" style="display: none; font-size: 0.82rem; color: #38bdf8; border-color: rgba(56,189,248,0.4);">Minimize</button>
        <button class="btn-outline" id="btnCancelImport" onclick="closeImportModal()">Cancel</button>
        <button class="btn-primary" id="btnRunImport" onclick="runBatchImport()">Start Batch Import</button>
      </div>
    </div>
  </div>

  <!-- Visual Page Import Modal -->
  <div id="pageImportModal" class="modal-overlay" style="z-index: 10040;">
    <div class="modal-content" id="pageImportModalContent" style="max-width: 880px; width: 95vw; max-height: 90vh; display: flex; flex-direction: column; padding: 24px; background: #0e111a; border: 1px solid rgba(56, 189, 248, 0.35); box-shadow: 0 25px 60px rgba(0,0,0,0.85); border-radius: 16px; overflow: hidden;">
      
      <!-- Modal Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-shrink: 0;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="font-size: 1.6rem;">📑</div>
          <div>
            <h3 class="modal-title" style="margin: 0; font-size: 1.25rem; color: #fff;">Visual Page Import</h3>
            <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 2px;">Paste raw webpage text (Ctrl+A / Ctrl+C), preview works in carousel, and choose which ones to import.</div>
          </div>
        </div>
        <button class="btn-outline" style="padding: 4px 10px;" onclick="closePageImportModal()">✖</button>
      </div>

      <!-- Step 1: Raw Text Input View -->
      <div id="pageImportStepInput" style="display: flex; flex-direction: column; flex: 1; min-height: 0;">
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 10px;">Paste copied catalog text from Japanese ASMR, DLsite, or any webpage containing RJ codes:</p>
        <textarea id="pageImportTextarea" class="modal-textarea" style="flex: 1; min-height: 220px; height: auto;" placeholder="Paste raw page text here (e.g. copied from Japanese ASMR tag page, ranking, or author page)...&#10;&#10;Example:&#10;[260603][にゃんにゃんぼいす] 【密着淫語囁き】Wバニー... [RJ01609839]&#10;CV: 雲八はち, Minase Suzuka"></textarea>
        <div style="margin-top: 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <input type="file" id="pageImportFileInput" accept=".txt" style="font-size: 0.82rem; color: var(--text-muted);" onchange="handlePageImportFileUpload(event)">
            <button class="btn-outline" type="button" onclick="clearPageImportText()" style="padding: 4px 10px; font-size: 0.82rem; color: #f87171; border-color: rgba(248,113,113,0.35);" title="Clear pasted text">🗑️ Clear</button>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn-outline" onclick="closePageImportModal()">Cancel</button>
            <button class="btn-primary" onclick="parseAndShowPagePreview()">🔍 Parse &amp; Preview Works</button>
          </div>
        </div>
      </div>

      <!-- Step 2: Interactive Preview & Selection View -->
      <div id="pageImportStepPreview" style="display: none; flex-direction: column; flex: 1; min-height: 0; overflow: hidden;">
        
        <!-- Toolbar & Selection Summary -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border); padding: 10px 14px; border-radius: 10px; flex-shrink: 0;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span id="pageImportSelectionCount" style="font-size: 0.9rem; font-weight: 700; color: #38bdf8;">0 works selected</span>
            <span style="font-size: 0.78rem; color: var(--text-muted);">• Click on any card to exclude / include</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <label style="display: inline-flex; align-items: center; gap: 5px; font-size: 0.78rem; color: #38bdf8; cursor: pointer; user-select: none; margin-right: 4px; background: rgba(56,189,248,0.1); padding: 3px 8px; border-radius: 6px; border: 1px solid rgba(56,189,248,0.3);" title="Hide works that are already present in your library">
              <input type="checkbox" id="pageImportHideImportedCheck" checked onchange="togglePageImportHideImported(this.checked)" style="cursor: pointer;">
              <span>✨ Unimported Only</span>
            </label>
            <label style="display: inline-flex; align-items: center; gap: 5px; font-size: 0.78rem; color: #cbd5e1; cursor: pointer; user-select: none; margin-right: 4px; background: rgba(255,255,255,0.06); padding: 3px 8px; border-radius: 6px; border: 1px solid var(--border);" title="Toggle between original high-res cover and disguised SFW artwork">
              <input type="checkbox" id="pageImportOriginalArtCheck" onchange="togglePageImportOriginalArt(this.checked)" style="cursor: pointer;">
              <span>🖼️ Original Art</span>
            </label>
            <button class="btn-outline" style="padding: 4px 10px; font-size: 0.78rem;" onclick="pageImportSelectAll(true)">✅ Select All</button>
            <button class="btn-outline" style="padding: 4px 10px; font-size: 0.78rem;" onclick="pageImportSelectAll(false)">❌ Deselect All</button>
            <div style="width: 1px; height: 20px; background: var(--border); margin: 0 4px;"></div>
            <button class="view-btn active" id="btnPageImportViewCarousel" onclick="setPageImportViewMode('carousel')" title="Carousel Slider View">↔ Carousel</button>
            <button class="view-btn" id="btnPageImportViewGrid" onclick="setPageImportViewMode('grid')" title="Grid Overview">⊞ Grid</button>
          </div>
        </div>

        <!-- Carousel Slider Container with Slide Controls -->
        <div style="position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden;">
          <button id="btnPageImportSlideLeft" class="btn-icon" onclick="slidePageImportCarousel(-1)" title="Previous works" style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); z-index: 20; background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(56, 189, 248, 0.5); width: 38px; height: 38px; border-radius: 50%; font-size: 1.4rem; color: #38bdf8; box-shadow: 0 4px 15px rgba(0,0,0,0.7); display: none; align-items: center; justify-content: center; backdrop-filter: blur(8px); cursor: pointer;">‹</button>
          
          <div id="pageImportCarouselWrap" style="flex: 1; min-height: 0; overflow-y: auto; overflow-x: auto; padding-bottom: 12px;">
            <!-- Live cards dynamically rendered here -->
          </div>

          <button id="btnPageImportSlideRight" class="btn-icon" onclick="slidePageImportCarousel(1)" title="Next works" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); z-index: 20; background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(56, 189, 248, 0.5); width: 38px; height: 38px; border-radius: 50%; font-size: 1.4rem; color: #38bdf8; box-shadow: 0 4px 15px rgba(0,0,0,0.7); display: none; align-items: center; justify-content: center; backdrop-filter: blur(8px); cursor: pointer;">›</button>
        </div>

        <!-- Footer Actions -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border); flex-shrink: 0;">
          <button class="btn-outline" onclick="backToPageImportInput()">← Back to Paste</button>
          <div style="display: flex; gap: 10px;">
            <button class="btn-outline" onclick="closePageImportModal()">Cancel</button>
            <button class="btn-primary" id="btnFinishPageImport" onclick="startPageImportExecution()" style="font-weight: 800; padding: 9px 20px;">🚀 Import Selected (<span id="pageImportFinalBtnCount">0</span>)</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add to Playlist Modal -->
  <div id="addToPlaylistModal" class="modal-overlay">
    <div class="modal-content">
      <h3 class="modal-title">➕ Add to Playlist</h3>
      <p id="addToPlaylistTrackLabel" style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px;"></p>
      <div style="margin-bottom: 16px;">
        <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 8px; font-weight: 700;">Select Existing Playlist:</div>
        <div id="playlistSelectList" style="display: flex; flex-direction: column; gap: 8px; max-height: 180px; overflow-y: auto; margin-bottom: 12px;"></div>
      </div>
      <div style="border-top: 1px solid var(--border); padding-top: 14px;">
        <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 8px; font-weight: 700;">Or Create New Playlist:</div>
        <div style="display: flex; gap: 8px;">
          <input type="text" id="quickNewPlName" placeholder="New Playlist Name" style="flex: 1; padding: 10px 14px; border-radius: 8px; background: #0c0d12; border: 1px solid var(--border); color: #fff; outline: none; font-size: 0.9rem;">
          <button class="btn-primary" onclick="createAndAddToPlaylist()">Create & Add</button>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; margin-top: 18px;"><button class="btn-outline" onclick="closeAddToPlaylistModal()">Close</button></div>
    </div>
  </div>

  <!-- Create Playlist Modal -->
  <div id="playlistModal" class="modal-overlay">
    <div class="modal-content">
      <h3 class="modal-title">📜 Create New Playlist</h3>
      <input type="text" id="newPlName" placeholder="Playlist Name" style="width: 100%; padding: 12px; border-radius: 8px; background: #0c0d12; border: 1px solid var(--border); color: #fff; margin-bottom: 12px; outline: none;">
      <input type="text" id="newPlDesc" placeholder="Description (optional)" style="width: 100%; padding: 12px; border-radius: 8px; background: #0c0d12; border: 1px solid var(--border); color: #fff; margin-bottom: 18px; outline: none;">
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button class="btn-outline" onclick="closePlaylistModal()">Cancel</button>
        <button class="btn-primary" onclick="submitCreatePlaylist()">Create</button>
      </div>
    </div>
  </div>

  <!-- Tag Translation Progress Modal -->
  <div id="tagTranslationProgressModal" class="modal-overlay" style="z-index: 10050;">
    <div class="modal-content" style="max-width: 560px; width: 92vw; background: #0f172a; border: 1px solid rgba(167, 139, 250, 0.3); box-shadow: 0 20px 50px rgba(0,0,0,0.85); border-radius: 12px; padding: 20px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="font-size: 1.6rem;">🌐</div>
          <div>
            <h3 class="modal-title" style="margin: 0; font-size: 1.15rem; color: #fff;">AI Tag &amp; Voice Actor Translation</h3>
            <div id="transModalSubtitle" style="font-size: 0.8rem; color: #94a3b8; margin-top: 2px;">DeepSeek AI Batch Processor (Max 150/batch)</div>
          </div>
        </div>
        <button id="transModalCloseBtn" class="btn-outline" style="padding: 4px 10px; display: none;" onclick="closeTransProgressModal()">✖</button>
      </div>

      <!-- Progress Bar Area -->
      <div style="margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 6px;">
          <span id="transProgressStage" style="font-weight: 600; color: #38bdf8;">Preparing translation...</span>
          <span id="transProgressPercent" style="font-weight: 700; color: #a78bfa;">0%</span>
        </div>
        <div style="width: 100%; height: 8px; background: #1e293b; border-radius: 999px; overflow: hidden; position: relative;">
          <div id="transProgressBar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #38bdf8, #818cf8, #c084fc); transition: width 0.3s ease; border-radius: 999px;"></div>
        </div>
      </div>

      <!-- Live Terminal / Log Box -->
      <div id="transLogBox" style="background: #090d16; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; height: 160px; overflow-y: auto; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.78rem; line-height: 1.45; color: #cbd5e1; margin-bottom: 14px;">
      </div>

      <!-- Failsafe Action Bar (when a batch encounters an issue) -->
      <div id="transFailedBar" style="display: none; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 12px; margin-bottom: 14px;">
        <div style="color: #fca5a5; font-size: 0.82rem; font-weight: 600; margin-bottom: 8px;">⚠️ Batch paused on error: <span id="transFailedReason" style="font-weight: 400; color: #cbd5e1;"></span></div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="btn-primary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="handleTransAction('retry')">🔄 Retry Batch</button>
          <button class="btn-outline" style="padding: 6px 12px; font-size: 0.8rem;" onclick="handleTransAction('skip')">⏭️ Skip &amp; Continue</button>
          <button class="btn-outline" style="padding: 6px 12px; font-size: 0.8rem; border-color: #38bdf8; color: #38bdf8;" onclick="downloadFailedResponse()">📥 Download Raw Error / Response</button>
        </div>
      </div>

      <!-- Footer / Action Area -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span id="transStatsText" style="font-size: 0.8rem; color: #64748b;">Ready</span>
        <div style="display: flex; gap: 8px;">
          <button id="transModalDoneBtn" class="btn-primary" style="display: none; padding: 8px 18px; font-size: 0.85rem;" onclick="closeTransProgressModal()">Done</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Tag Classification Progress Modal -->
  <div id="tagClassifyProgressModal" class="modal-overlay" style="z-index: 10050;">
    <div class="modal-content" style="max-width: 560px; width: 92vw; background: #0f172a; border: 1px solid rgba(52, 211, 153, 0.35); box-shadow: 0 20px 50px rgba(0,0,0,0.85); border-radius: 12px; padding: 20px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="font-size: 1.6rem;">🤖</div>
          <div>
            <h3 class="modal-title" style="margin: 0; font-size: 1.15rem; color: #fff;">AI SFW/NSFW Tag Classification</h3>
            <div id="classifyModalSubtitle" style="font-size: 0.8rem; color: #94a3b8; margin-top: 2px;">DeepSeek AI Smart Classifier (50 tags / batch • Lazy Mode)</div>
          </div>
        </div>
        <button id="classifyModalCloseBtn" class="btn-outline" style="padding: 4px 10px; display: none;" onclick="closeClassifyProgressModal()">✖</button>
      </div>

      <!-- Progress Bar Area -->
      <div style="margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 6px;">
          <span id="classifyProgressStage" style="font-weight: 600; color: #34d399;">Scanning tags...</span>
          <span id="classifyProgressPercent" style="font-weight: 700; color: #34d399;">0%</span>
        </div>
        <div style="width: 100%; height: 8px; background: #1e293b; border-radius: 999px; overflow: hidden; position: relative;">
          <div id="classifyProgressBar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #34d399, #38bdf8, #818cf8); transition: width 0.3s ease; border-radius: 999px;"></div>
        </div>
      </div>

      <!-- Live Terminal / Log Box -->
      <div id="classifyLogBox" style="background: #090d16; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; height: 160px; overflow-y: auto; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.78rem; line-height: 1.45; color: #cbd5e1; margin-bottom: 14px;">
      </div>

      <!-- Footer / Action Area -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span id="classifyStatsText" style="font-size: 0.8rem; color: #64748b;">Ready</span>
        <div style="display: flex; gap: 8px;">
          <button id="classifyModalStopBtn" class="btn-outline" style="padding: 6px 14px; font-size: 0.82rem; color: #f87171; border-color: rgba(248, 113, 113, 0.4);" onclick="stopClassifyProgress()">⏹️ Stop</button>
          <button id="classifyModalDoneBtn" class="btn-primary" style="display: none; padding: 8px 18px; font-size: 0.85rem;" onclick="closeClassifyProgressModal()">Done</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Library Metadata Refresh Progress Modal -->
  <div id="refreshProgressModal" class="modal-overlay" style="z-index: 10050;">
    <div class="modal-content" style="max-width: 560px; width: 92vw; background: #0f172a; border: 1px solid rgba(56, 189, 248, 0.35); box-shadow: 0 20px 50px rgba(0,0,0,0.85); border-radius: 12px; padding: 20px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="font-size: 1.6rem;">🔄</div>
          <div>
            <h3 class="modal-title" style="margin: 0; font-size: 1.15rem; color: #fff;">Library Metadata Refresh</h3>
            <div id="refreshModalSubtitle" style="font-size: 0.8rem; color: #94a3b8; margin-top: 2px;">Chunked Smart Scanner (15 works / batch • Periodic Saves)</div>
          </div>
        </div>
        <button id="refreshModalCloseBtn" class="btn-outline" style="padding: 4px 10px; display: none;" onclick="closeRefreshProgressModal()">✖</button>
      </div>

      <div style="margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 6px;">
          <span id="refreshProgressStage" style="font-weight: 600; color: #38bdf8;">Preparing scan...</span>
          <span id="refreshProgressPercent" style="font-weight: 700; color: #38bdf8;">0%</span>
        </div>
        <div style="width: 100%; height: 8px; background: #1e293b; border-radius: 999px; overflow: hidden; position: relative;">
          <div id="refreshProgressBar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #38bdf8, #818cf8, #34d399); transition: width 0.3s ease; border-radius: 999px;"></div>
        </div>
      </div>

      <div id="refreshLogBox" style="background: #090d16; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; height: 160px; overflow-y: auto; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.78rem; line-height: 1.45; color: #cbd5e1; margin-bottom: 14px;">
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span id="refreshStatsText" style="font-size: 0.8rem; color: #64748b;">Ready</span>
        <div style="display: flex; gap: 8px;">
          <button id="refreshModalStopBtn" class="btn-outline" style="padding: 6px 14px; font-size: 0.82rem; color: #f87171; border-color: rgba(248, 113, 113, 0.4);" onclick="stopRefreshProgress()">⏹️ Stop</button>
          <button id="refreshModalDoneBtn" class="btn-primary" style="display: none; padding: 8px 18px; font-size: 0.85rem;" onclick="closeRefreshProgressModal()">Done</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Floating Corner Player Card (Bottom-Right Docked) -->
  <div id="popupPlayerModal" class="floating-corner-player">
    <div class="popup-header">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 0.72rem; font-weight: 800; color: var(--accent); background: rgba(255,51,102,0.12); padding: 3px 8px; border-radius: 4px; letter-spacing: 0.5px;">NOW PLAYING</span>
        <span id="popupHlsBadge" style="font-size: 0.7rem; font-weight: 700; color: #38bdf8; background: rgba(56,189,248,0.12); padding: 3px 6px; border-radius: 4px;">HLS</span>
      </div>
      <div style="display: flex; gap: 6px; align-items: center;">
        <button class="btn-icon" style="width: 32px; height: 32px; font-size: 0.85rem; display: inline-flex; align-items: center; justify-content: center;" title="View Work Details" onclick="jumpToCurrentWorkDetail()">ℹ️</button>
        <button class="btn-icon" style="width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; color: #38bdf8;" title="Collapse to Bar (Esc)" onclick="closePopupPlayer()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <div class="popup-body">
      <div class="popup-cover-wrap">
        <img id="popupCover" class="popup-cover" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23111'/%3E%3C/svg%3E">
        <div id="popupDisguisedBadge" class="disguised-overlay" style="display:none;"><span class="disguised-badge">🎭 Disguised SFW</span></div>
      </div>

      <div class="popup-meta">
        <div id="popupTitle" class="popup-title">No Track Selected</div>
        <div id="popupSub" class="popup-sub">Select a track to start playback</div>
        <div id="popupCvRow" class="popup-cv-row"></div>
      </div>

      <div class="scrubber-row">
        <span id="popupCurrTime" class="time-text">00:00</span>
        <input type="range" id="popupScrubber" class="scrubber" min="0" max="100" value="0" oninput="onScrub(this.value)">
        <span id="popupTotalTime" class="time-text">00:00</span>
      </div>

      <div class="popup-controls">
        <button id="popupShuffleBtn" class="ctrl-btn" title="Toggle Shuffle / Random" onclick="toggleShuffle()">🔀</button>
        <button class="ctrl-btn" title="Previous Track" onclick="playPrevTrack()">⏮</button>
        <button id="popupPlayPauseBtn" class="popup-play-btn" onclick="togglePlayPause()">▶</button>
        <button class="ctrl-btn" title="Next Track" onclick="playNextTrack()">⏭</button>
      </div>

      <div class="popup-secondary-row">
        <div style="display: flex; align-items: center; gap: 8px;">
          <button id="popupMuteBtn" class="ctrl-btn" onclick="toggleMute()" style="font-size: 1rem;" title="Mute / Unmute">🔊</button>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span id="popupFavBtn" style="font-size: 1.15rem; cursor: pointer;" title="Toggle Favorite" onclick="toggleCurrentWorkFav()">🤍</span>
          <button class="btn-outline" style="padding: 4px 10px; font-size: 0.78rem;" onclick="addCurrentTrackToPlaylist()">➕ Playlist</button>
          <button class="btn-outline" style="padding: 4px 10px; font-size: 0.78rem;" onclick="jumpToCurrentWorkDetail()" title="View Work Details">👁️ Work</button>
        </div>
      </div>

      <div>
        <button class="popup-drawer-toggle" onclick="toggleChapterDrawer()">
          <span id="popupChapterToggleLabel">📑 Chapters / Tracklist (0)</span>
          <span id="popupChapterChevron">▼</span>
        </button>
        <div id="popupChaptersList" class="popup-chapters-list" style="display: none;"></div>
      </div>
    </div>
  </div>

  <!-- Mobile Topbar Header -->
  <header class="mobile-topbar">
    <a href="#/library" class="logo-area" style="margin-bottom: 0; padding: 0; text-decoration: none; color: inherit;" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); switchView('library'); }">
      <div class="logo-icon" style="width: 32px; height: 32px; font-size: 1.1rem;">🐧</div>
      <div class="logo-title" style="font-size: 1.1rem;">aStreamer</div>
    </a>
  </header>

  <!-- Mobile Horizontal Nav Pills -->
  <nav class="mobile-nav-pills">
    <a href="#/library" class="mobile-pill active" data-view="library" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); switchView('library'); }">📚 Library</a>
    <a href="#/playlists" class="mobile-pill" data-view="playlists" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); switchView('playlists'); }">📜 Playlists</a>
    <a href="#/history" class="mobile-pill" data-view="history" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); switchView('history'); }">🕒 History</a>
    <a href="#/wishlist" class="mobile-pill" data-view="wishlist" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); switchView('wishlist'); }">📋 Wishlist</a>
    <a href="#/artists" class="mobile-pill" data-view="artists" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); switchView('artists'); }">🎙️ Voice Actors</a>
    <a href="#/genres" class="mobile-pill" data-view="genres" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); switchView('genres'); }">🏷️ Genres</a>
    <button class="mobile-pill" onclick="quickAddRj()">➕ Add RJ</button>
    <button class="mobile-pill" onclick="openImportModal()">📥 Import</button>
    <button class="mobile-pill" onclick="openPageImportModal()">📑 Page Import</button>
    <button class="mobile-pill" onclick="openChangelogModal()">📜 Notes</button>
    <a href="#/settings" class="mobile-pill" data-view="settings" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); switchView('settings'); }">⚙️ Settings</a>
    <button class="mobile-pill" id="mobileAdminBtn" onclick="toggleAdminModal()">🔓 Admin</button>
  </nav>

  <!-- Mobile Background Ingestion Banner -->
  <div id="mobileImportBanner" style="display: none; margin: 8px 12px; padding: 10px 14px; background: rgba(14, 17, 26, 0.95); border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 10px; box-shadow: 0 6px 20px rgba(0,0,0,0.8); backdrop-filter: blur(10px);">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
      <div style="display: flex; align-items: center; gap: 6px; font-size: 0.82rem; font-weight: 700; color: #fff;">
        <span>📥</span>
        <span>Batch Importing</span>
        <span id="mobileImportPct" style="color: #38bdf8; font-size: 0.78rem; font-weight: 800;">0%</span>
      </div>
      <div style="display: flex; gap: 5px;">
        <button class="btn-outline" style="padding: 2px 8px; font-size: 0.72rem; color: #38bdf8; border-color: rgba(56,189,248,0.4);" onclick="expandImportFromDock()">🔍 Logs</button>
        <button class="btn-outline" id="mobileBtnStop" style="padding: 2px 8px; font-size: 0.72rem; color: #ef4444; border-color: rgba(239,68,68,0.4);" onclick="stopImportFromDock()">⏹️ Stop</button>
      </div>
    </div>
    <div id="mobileImportStatus" style="font-size: 0.74rem; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 5px;">Importing...</div>
    <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;">
      <div id="mobileImportProgressBar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #ff3366, #38bdf8); transition: width 0.2s;"></div>
    </div>
  </div>

  <!-- Desktop Sidebar -->
  <aside class="app-sidebar">
    <a href="#/library" class="logo-area" style="text-decoration: none; color: inherit;" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); switchView('library'); }">
      <div class="logo-icon">🐧</div>
      <div>
        <div class="logo-title">aStreamer</div>
        <span id="appVersionTag" style="font-size: 0.65rem; color: var(--accent); font-weight: 700; background: var(--accent-glow); padding: 1px 6px; border-radius: 4px; border: 1px solid var(--accent);">v2.0 Official</span>
      </div>
    </a>

    <!-- Sidebar Dual Search Bars -->
    <div class="search-box" style="margin-bottom: 8px; width: 100%; max-width: 100%;">
      <span>🔍</span>
      <input type="text" id="globalSearch" placeholder="Search title, RJ, circle..." oninput="handleTitleSearch(this.value)">
    </div>
    <div class="search-box" style="margin-bottom: 14px; width: 100%; max-width: 100%;" onclick="openZenTagSearch()" title="Open Tag Search">
      <span>🏷️</span>
      <input type="text" id="globalTagSearch" placeholder="Search tags + CV..." onfocus="openZenTagSearch(this.value)" onclick="openZenTagSearch(this.value)" readonly style="cursor: pointer;">
      <div id="tagSuggestionsDropdown" class="tag-suggestions-dropdown"></div>
    </div>

    <!-- Sidebar Quick Add -->
    <button class="btn-primary" style="width: 100%; justify-content: center; margin-bottom: 12px; padding: 10px;" onclick="quickAddRj()">+ Add RJ Code</button>

    <!-- Sidebar Background Ingestion Widget (Top Position for Instant Visibility) -->
    <div id="sidebarImportWidget" style="display: none; margin-bottom: 16px; padding: 12px; background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.45); border-radius: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.6); animation: pulseWidget 2s infinite;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
        <div style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 700; color: #fff;">
          <span>📥</span>
          <span>Importing</span>
          <span id="sidebarImportPct" style="color: #38bdf8; font-size: 0.78rem; font-weight: 800;">0%</span>
        </div>
        <div style="display: flex; gap: 4px;">
          <button class="btn-outline" style="padding: 2px 6px; font-size: 0.7rem; color: #38bdf8; border-color: rgba(56,189,248,0.4);" onclick="expandImportFromDock()" title="Expand logs">🔍</button>
          <button class="btn-outline" id="sidebarBtnStop" style="padding: 2px 6px; font-size: 0.7rem; color: #ef4444; border-color: rgba(239,68,68,0.4);" onclick="stopImportFromDock()" title="Stop import">⏹️</button>
        </div>
      </div>
      <div id="sidebarImportStatus" style="font-size: 0.72rem; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 6px;">Importing...</div>
      <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;">
        <div id="sidebarImportProgressBar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #ff3366, #38bdf8); transition: width 0.2s;"></div>
      </div>
    </div>

    <nav class="nav-section">
      <div class="nav-title">Menu</div>
      <a href="#/library" class="nav-item active" data-view="library" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); switchView('library'); }">📚 Library</a>
      <a href="#/playlists" class="nav-item" data-view="playlists" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); switchView('playlists'); }">📜 Playlists</a>
      <a href="#/history" class="nav-item" data-view="history" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); switchView('history'); }">🕒 History</a>
      <a href="#/wishlist" class="nav-item" data-view="wishlist" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); switchView('wishlist'); }">
        <span style="display:flex; align-items:center; gap:8px;">📋 Wishlist</span>
        <span id="wishlistCountBadge" class="nav-badge" style="display:none;">0</span>
      </a>
      <a href="#/artists" class="nav-item" data-view="artists" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); switchView('artists'); }">🎙️ Voice Actors</a>
      <a href="#/genres" class="nav-item" data-view="genres" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); switchView('genres'); }">🏷️ Genres &amp; Tags</a>
      
      <div class="nav-title">Manage</div>
      <button class="nav-item" onclick="openImportModal()">📥 Batch Import</button>
      <button class="nav-item" onclick="openPageImportModal()">📑 Page Import</button>
      <button class="nav-item" onclick="openChangelogModal()">📜 Release Notes</button>
      <a href="#/settings" class="nav-item" data-view="settings" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); switchView('settings'); }">⚙️ Settings</a>
      <button class="nav-item" id="sidebarAdminBtn" onclick="toggleAdminModal()">🔓 Unlock Admin</button>
    </nav>
  </aside>

  <!-- Main View Area -->
  <main class="app-main">
    <div class="mobile-search-bar">
      <div class="search-box" style="width: 100%; max-width: 100%; margin-bottom: 8px;">
        <span>🔍</span>
        <input type="text" id="mobileSearchInput" placeholder="Search title, RJ code, circle..." oninput="handleTitleSearch(this.value)">
      </div>
      <div class="search-box" style="width: 100%; max-width: 100%;" onclick="openZenTagSearch()" title="Open Tag Search">
        <span>🏷️</span>
        <input type="text" id="mobileTagSearchInput" placeholder="Search tags + CV..." onfocus="openZenTagSearch(this.value)" onclick="openZenTagSearch(this.value)" readonly style="cursor: pointer;">
        <div id="mobileTagSuggestionsDropdown" class="tag-suggestions-dropdown"></div>
      </div>
    </div>
    <div id="viewContainer" class="view-container"></div>
  </main>

  <!-- Persistent Bottom Player Bar -->
  <footer class="player-bar">
    <div class="player-left" onclick="togglePopupPlayer()" title="Click to expand/collapse floating player">
      <img id="playerCover" class="player-thumb" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect width='48' height='48' fill='%23222'/%3E%3C/svg%3E">
      <div class="player-track-info">
        <div id="playerTitle" class="player-title">Select track to play</div>
        <div id="playerSub" class="player-sub">aStreamer Cloudflare Edition</div>
      </div>
      <button id="btnExpandPlayerMobile" class="player-expand-btn" title="Expand Floating Player" onclick="event.stopPropagation(); togglePopupPlayer()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 3 21 3 21 9"></polyline>
          <polyline points="9 21 3 21 3 15"></polyline>
          <line x1="21" y1="3" x2="14" y2="10"></line>
          <line x1="3" y1="21" x2="10" y2="14"></line>
        </svg>
      </button>
    </div>
    <div class="player-center">
      <div class="player-controls">
        <button id="shuffleBtn" class="ctrl-btn" title="Toggle Shuffle / Random" onclick="toggleShuffle()">🔀</button>
        <button class="ctrl-btn" title="Previous Track" onclick="playPrevTrack()">⏮</button>
        <button id="playPauseBtn" class="play-btn-circle" onclick="togglePlayPause()">▶</button>
        <button class="ctrl-btn" title="Next Track" onclick="playNextTrack()">⏭</button>
        <button id="playerBarChapterBtnMobile" class="ctrl-btn" title="View Chapters & Cue Points" onclick="openPopupPlayerWithChapters()">📑</button>
      </div>
      <div class="scrubber-row">
        <span id="currTime" class="time-text">00:00</span>
        <input type="range" id="scrubber" class="scrubber" min="0" max="100" value="0" oninput="onScrub(this.value)">
        <span id="totalTime" class="time-text">00:00</span>
      </div>
    </div>
    <div class="player-right">
      <button class="ctrl-btn" title="Add Playing Track to Playlist" onclick="addCurrentPlayingTrackToPlaylist()" style="font-size: 1.05rem; margin-right: 2px;">➕</button>
      <button class="ctrl-btn" title="View Playing Work Details" onclick="jumpToCurrentWorkDetail()" style="font-size: 1.05rem; margin-right: 2px;">👁️</button>
      <button id="playerBarChapterBtn" class="ctrl-btn" onclick="openPopupPlayerWithChapters()" title="View Chapters & Cue Points" style="font-size: 1.1rem; margin-right: 4px;">📑</button>
      <button id="muteBtn" class="ctrl-btn" onclick="toggleMute()" title="Mute / Unmute">🔊</button>
      <button class="player-expand-btn" style="margin-left: 6px;" title="Expand/Collapse Floating Player" onclick="togglePopupPlayer()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 3 21 3 21 9"></polyline>
          <polyline points="9 21 3 21 3 15"></polyline>
          <line x1="21" y1="3" x2="14" y2="10"></line>
          <line x1="3" y1="21" x2="10" y2="14"></line>
        </svg>
      </button>
    </div>
  </footer>

  <!-- Zen Browser Style Floating Tag Search Modal -->
  <div id="zenTagSearchModal" class="zen-search-overlay" onclick="handleZenOverlayClick(event)">
    <div class="zen-search-card" onclick="event.stopPropagation()">
      <div class="zen-search-header">
        <span class="zen-search-icon">🏷️</span>
        <input type="text" id="zenTagSearchInput" class="zen-search-input" placeholder="Search tags + CV (e.g. ear cleaning, whisper, CV name)..." oninput="handleZenTagInput(this.value)" onkeydown="handleZenTagKeydown(event)" autocomplete="off">
        <button class="zen-search-commit-btn" onclick="applyZenTagSearch()" title="Apply search and filter library (Enter)">↵ Search</button>
        <button class="zen-close-btn" onclick="closeZenTagSearch(true)" title="Cancel / Close without searching (Esc)">✕</button>
      </div>

      <!-- Active Tag Filter Pills Bar -->
      <div id="zenChipsBar" class="zen-chips-bar" style="display: none;">
        <span style="font-size: 0.76rem; color: #94a3b8; margin-right: 4px; display: inline-flex; align-items: center;">Active filters:</span>
        <div id="zenChipsList" style="display: inline-flex; flex-wrap: wrap; gap: 6px; align-items: center;"></div>
        <button class="zen-clear-btn" onclick="clearAllZenTags()">Clear all</button>
      </div>

      <!-- Results Body -->
      <div id="zenResultsContainer" class="zen-results-container">
        <!-- Live Tag Suggestions render here -->
      </div>

      <!-- Zen Modal Footer Hints -->
      <div class="zen-footer">
        <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
          <span><kbd class="zen-shortcut-badge">↑</kbd> <kbd class="zen-shortcut-badge">↓</kbd> navigate</span>
          <span><kbd class="zen-shortcut-badge">↵</kbd> select / add</span>
          <span><kbd class="zen-shortcut-badge">Esc</kbd> close</span>
          <span><kbd class="zen-shortcut-badge">+</kbd> combine tags</span>
        </div>
        <div id="zenResultsCountBadge" style="color: #a78bfa; font-weight: 600; font-size: 0.78rem;"></div>
      </div>
    </div>
  </div>

  <audio id="coreAudio" preload="metadata"></audio>

  <script>
    const CLIENT_BASE_TAG_DICT = ${JSON.stringify(BASE_TAG_DICT || {})};
    window.BASE_TAG_DICT = CLIENT_BASE_TAG_DICT;
    window.tagDict = Object.assign({}, CLIENT_BASE_TAG_DICT);

    function cleanCVName(raw) {
      if (!raw || typeof raw !== 'string') return '';
      let str = raw.trim();
      str = str.replace(/^(?:【|\\(|（|\\[)?\\s*(?:CV|声優|ボイス|キャスト)[.:：\\s]*/i, '');
      str = str.replace(/(?:】|\\)|）|\\])\\s*$/i, '');
      str = str.replace(/(?:様|さん|氏|他)$/, '').trim();
      return str;
    }

    function normalizeCVRomaji(ja, romaji) {
      if (!romaji || typeof romaji !== 'string') return romaji || '';
      let str = romaji.trim();
      if (!str) return '';

      const parenMatch = str.match(/^([^(\\uFF08]+)[(\\uFF08](.+)[)\\uFF09]$/);
      if (parenMatch) {
        const jaParen = (ja && typeof ja === 'string') ? ja.match(/^([^(\\uFF08]+)[(\\uFF08](.+)[)\\uFF09]$/) : null;
        if (jaParen) {
          return normalizeCVRomaji(jaParen[1].trim(), parenMatch[1].trim()) + ' (' +
                 normalizeCVRomaji(jaParen[2].trim(), parenMatch[2].trim()) + ')';
        }
        return normalizeCVRomaji('', parenMatch[1].trim()) + ' (' + normalizeCVRomaji('', parenMatch[2].trim()) + ')';
      }

      const words = str.split(/\\s+/).filter(Boolean);
      if (words.length === 0) return '';

      if (words.length === 1) {
        return words[0].charAt(0).toUpperCase() + words[0].slice(1);
      }

      if (words.length === 2) {
        const w0 = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
        const w1 = words[1].charAt(0).toUpperCase() + words[1].slice(1).toLowerCase();
        return w0 + ' ' + w1;
      }

      if (words.some(function(w) { return w.toLowerCase() === 'no'; }) && ja && /[ノ之の]/.test(ja)) {
        return words.map(function(w) {
          if (w.toLowerCase() === 'no') return 'no';
          return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        }).join(' ');
      }

      const capitalizedWords = words.map(function(w) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); });

      if (words.length === 4) {
        const surname = capitalizedWords[0] + capitalizedWords[1].toLowerCase();
        const given = capitalizedWords[2] + capitalizedWords[3].toLowerCase();
        return surname + ' ' + given;
      }

      if (words.length === 3) {
        if (ja && typeof ja === 'string') {
          const matchKanjiKana = ja.match(/^([\\u4E00-\\u9FFF]+)([\\u3040-\\u309F\\u30A0-\\u30FF]+)$/);
          if (matchKanjiKana && matchKanjiKana[1].length >= 2) {
            return capitalizedWords[0] + capitalizedWords[1].toLowerCase() + ' ' + capitalizedWords[2];
          }
          const matchKanjiMixed = ja.match(/^([\\u4E00-\\u9FFF]{2,})([\\u3040-\\u309F\\u30A0-\\u30FF]+[\\u4E00-\\u9FFF]*)$/);
          if (matchKanjiMixed) {
            return capitalizedWords[0] + ' ' + capitalizedWords[1] + capitalizedWords[2].toLowerCase();
          }
          if (/^[\\u4E00-\\u9FFF]{4}$/.test(ja)) {
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

      const match = title.match(/(?:【|\\(|（|\\[)\\s*(?:CV|声優|ボイス|キャスト)[.:：\\s]*([^】)）\\]]+)(?:】|\\)|）|\\])/i);
      if (match && match[1]) {
        const rawCv = match[1].trim();
        const firstPart = rawCv.split(/[/,、/]/)[0].trim();
        if (firstPart && firstPart.length >= 2 && !['DLsite', '同人', 'ASMR', 'R18'].includes(firstPart)) {
          return firstPart;
        }
      }
      return '';
    }

    function getTagEntry(key) {
      if (!key) return null;
      const clean = String(key).trim();
      if (!clean) return null;

      const baseDict = window.BASE_TAG_DICT || CLIENT_BASE_TAG_DICT || {};
      const userDict = window.tagDict || {};

      const baseEntry = baseDict[clean];
      const userEntry = userDict[clean];

      const baseRomaji = (baseEntry && typeof baseEntry === 'object') ? (baseEntry.romaji || '') : (typeof baseEntry === 'string' ? baseEntry : '');
      const baseEnglish = (baseEntry && typeof baseEntry === 'object') ? (baseEntry.english || '') : (typeof baseEntry === 'string' ? baseEntry : '');
      const baseIsCV = (baseEntry && typeof baseEntry === 'object') ? !!baseEntry.isCV : false;
      const baseIsNsfw = (baseEntry && typeof baseEntry === 'object') ? baseEntry.isNsfw : undefined;

      let userRomaji = '';
      let userEnglish = '';
      let userIsCV = baseIsCV;
      let userIsNsfw = baseIsNsfw;

      if (typeof userEntry === 'string') {
        userEnglish = userEntry.trim();
        userRomaji = normalizeCVRomaji(clean, userEnglish);
      } else if (userEntry && typeof userEntry === 'object') {
        userRomaji = (userEntry.romaji || '').trim();
        userEnglish = (userEntry.english || '').trim();
        if (userEntry.isCV !== undefined) userIsCV = !!userEntry.isCV;
        if (typeof userEntry.isNsfw === 'boolean') userIsNsfw = userEntry.isNsfw;
      }

      let finalRomaji = (userRomaji && /[a-zA-Z]/.test(userRomaji) && userRomaji.toLowerCase() !== clean.toLowerCase())
        ? normalizeCVRomaji(clean, userRomaji)
        : (baseRomaji && /[a-zA-Z]/.test(baseRomaji) ? normalizeCVRomaji(clean, baseRomaji) : '');

      let finalEnglish = (userEnglish && /[a-zA-Z]/.test(userEnglish) && userEnglish.toLowerCase() !== clean.toLowerCase())
        ? userEnglish
        : (baseEnglish && /[a-zA-Z]/.test(baseEnglish) ? baseEnglish : (finalRomaji || ''));

      if (userIsCV && finalRomaji && (!finalEnglish || finalEnglish === clean)) {
        finalEnglish = finalRomaji;
      }

      if (!finalRomaji && !finalEnglish && !userIsCV && userIsNsfw === undefined && !baseEntry && !userEntry) {
        return null;
      }

      return {
        romaji: finalRomaji,
        english: finalEnglish,
        isCV: userIsCV,
        isNsfw: userIsNsfw
      };
    }

    function formatTag(t) {
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

      const entry = getTagEntry(jaName);
      if (!entry && !existingRomaji) return raw;

      if (entry && entry.isCV) {
        let romaji = entry.romaji || existingRomaji;
        if (romaji) romaji = normalizeCVRomaji(jaName, romaji);
        return (romaji && /[a-zA-Z]/.test(romaji) && romaji !== jaName)
          ? jaName + ' | ' + romaji
          : jaName;
      }

      if (entry) {
        const parts = [jaName];
        let romaji = entry.romaji || '';
        let english = entry.english || '';
        if (romaji && /[a-zA-Z]/.test(romaji) && romaji.toLowerCase() !== jaName.toLowerCase()) {
          parts.push(romaji);
        }
        if (english && /[a-zA-Z]/.test(english) && english.toLowerCase() !== jaName.toLowerCase() && english.toLowerCase() !== romaji.toLowerCase()) {
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

    function formatCV(cv) {
      if (!cv || typeof cv !== 'string' || cv === 'N/A') return '';
      const parts = cv.split(/[,、/&＋+;・\\n|]/).map(function(p) { return p.trim(); }).filter(Boolean);
      if (parts.length === 0) return '';

      const results = [];

      for (let i = 0; i < parts.length; i++) {
        let raw = cleanCVName(parts[i]);
        if (!raw || raw === 'N/A') continue;

        let jaName = raw;
        let existingRomaji = '';

        const bracketMatch = raw.match(/【([^】]+)】|（([^）]+)）|\\(([^)]+)\\)|\\[([^\\]]+)\\]/);
        if (bracketMatch) {
          const inside = (bracketMatch[1] || bracketMatch[2] || bracketMatch[3] || bracketMatch[4] || '').trim();
          const outside = raw.replace(bracketMatch[0], '').trim();
          const isInsideJa = /[\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FAF]/.test(inside);
          const isOutsideJa = /[\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FAF]/.test(outside);

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

        const entry = getTagEntry(jaName);
        const baseDict = window.BASE_TAG_DICT || CLIENT_BASE_TAG_DICT || {};
        const baseEntry = baseDict[jaName];

        let romaji = (entry && (entry.romaji || entry.english)) ? (entry.romaji || entry.english) : '';
        if (!romaji && baseEntry) {
          romaji = (typeof baseEntry === 'string') ? baseEntry : (baseEntry.romaji || baseEntry.english || '');
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

    function resolveTagPass2Client(rawTag) {
      if (!rawTag || typeof rawTag !== 'string') return null;
      const tag = rawTag.trim();
      if (!tag) return null;

      const direct = getTagEntry(tag);
      if (direct && ((direct.romaji && /[a-zA-Z]/.test(direct.romaji)) || (direct.english && /[a-zA-Z]/.test(direct.english)))) {
        return { original: tag, romaji: direct.romaji, english: direct.english, isCV: direct.isCV };
      }

      if (tag.includes('/') || tag.includes('、') || tag.includes('+')) {
        const parts = tag.split(/[/、+]/).map(p => p.trim()).filter(Boolean);
        const resolved = parts.map(p => resolveTagPass2Client(p));
        if (resolved.every(r => r && ((r.romaji && /[a-zA-Z]/.test(r.romaji)) || (r.english && /[a-zA-Z]/.test(r.english))))) {
          return {
            original: tag,
            romaji: resolved.map(r => r.romaji || r.original).join(' / '),
            english: resolved.map(r => r.english || r.romaji || r.original).join(' / ')
          };
        }
      }

      const baseDict = window.BASE_TAG_DICT || CLIENT_BASE_TAG_DICT || {};
      const userDict = window.tagDict || {};
      const allDict = Object.assign({}, baseDict, userDict);
      const matchedTokens = [];
      let remaining = tag;
      const keysByLength = Object.keys(allDict).filter(k => {
        const e = getTagEntry(k);
        return e && ((e.romaji && /[a-zA-Z]/.test(e.romaji)) || (e.english && /[a-zA-Z]/.test(e.english)));
      }).sort((a, b) => b.length - a.length);

      while (remaining.length > 0) {
        let matched = false;
        for (const key of keysByLength) {
          if (remaining.startsWith(key)) {
            const e = getTagEntry(key);
            if (e && (e.romaji || e.english)) {
              matchedTokens.push({ term: key, romaji: e.romaji || key, english: e.english || e.romaji || key });
              remaining = remaining.slice(key.length);
              matched = true;
              break;
            }
          }
        }
        if (!matched) remaining = remaining.slice(1);
      }

      if (matchedTokens.length >= 2) {
        return {
          original: tag,
          romaji: matchedTokens.map(t => t.romaji).join(' '),
          english: matchedTokens.map(t => t.english).join(' + ')
        };
      } else if (matchedTokens.length === 1 && tag.length <= matchedTokens[0].term.length + 3) {
        return {
          original: tag,
          romaji: matchedTokens[0].romaji,
          english: matchedTokens[0].english
        };
      }
      return null;
    }

    async function syncTagDictionary() {
      try {
        const res = await apiFetch('/api/tags');
        if (res.ok) {
          const data = await res.json();
          if (data && data.tagDict) {
            window.tagDict = Object.assign({}, window.BASE_TAG_DICT || {}, window.tagDict || {}, data.tagDict);
          }
        }
      } catch(e) {}
    }

    let isAdmin = false;
    let contentMode = 'NSFW';
    let currentPlayingWork = null;
    let libraryViewMode = 'medium'; // large, medium, small, list
    let libraryPerPage = 20; // 10, 20, 50, 100, 0 (all)
    let libraryCurrentPage = 1;
    let currentFilterParams = {};

    let playlistViewMode = 'list'; // list, grid
    let playlistPerPage = 20;
    let playlistCurrentPage = 1;
    let currentPlaylistItemIndex = -1;
    let isMassRefreshing = false;
    let chapterFetchCache = new Set();
    let lazyChapterTimer = null;

    let historySortMode = 'date-desc'; // date-desc, date-asc, title-asc, rj-asc
    let isShuffle = false;
    let playbackHistoryStack = [];

    const ACCENT_THEMES = {
      orange: {
        name: '🍊 Hyper Orange (v2.0)',
        hex: '#ff7a00',
        hover: '#ea6c00',
        glow: 'rgba(255, 122, 0, 0.35)',
        gradient: 'linear-gradient(135deg, #ff7a00, #ff9500)'
      },
      blue: {
        name: '🌊 Cyber Sky Blue',
        hex: '#38bdf8',
        hover: '#0284c7',
        glow: 'rgba(56, 189, 248, 0.35)',
        gradient: 'linear-gradient(135deg, #0284c7, #38bdf8)'
      },
      purple: {
        name: '🔮 Electric Purple',
        hex: '#a855f7',
        hover: '#9333ea',
        glow: 'rgba(168, 85, 247, 0.35)',
        gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)'
      },
      emerald: {
        name: '🍃 Emerald Green',
        hex: '#10b981',
        hover: '#059669',
        glow: 'rgba(16, 185, 129, 0.35)',
        gradient: 'linear-gradient(135deg, #059669, #10b981)'
      },
      rose: {
        name: '🌸 Sakura Rose',
        hex: '#ff3366',
        hover: '#e02456',
        glow: 'rgba(255, 51, 102, 0.35)',
        gradient: 'linear-gradient(135deg, #e11d48, #ff3366)'
      },
      amber: {
        name: '⚡ Golden Amber',
        hex: '#f59e0b',
        hover: '#d97706',
        glow: 'rgba(245, 158, 11, 0.35)',
        gradient: 'linear-gradient(135deg, #d97706, #f59e0b)'
      }
    };

    let currentAccent = 'orange';
    try { currentAccent = localStorage.getItem('astreamer_accent_color') || 'orange'; } catch(e) {}

    function setAccentTheme(themeKey, persist = true) {
      currentAccent = themeKey;
      const theme = ACCENT_THEMES[themeKey] || ACCENT_THEMES.orange;
      document.documentElement.style.setProperty('--accent', theme.hex);
      document.documentElement.style.setProperty('--accent-hover', theme.hover);
      document.documentElement.style.setProperty('--accent-glow', theme.glow);
      document.documentElement.style.setProperty('--accent-gradient', theme.gradient);
      
      const vTag = document.getElementById('appVersionTag');
      if (vTag) {
        vTag.style.color = theme.hex;
        vTag.style.borderColor = theme.hex;
        vTag.style.background = theme.glow;
      }
      
      if (persist) {
        try { localStorage.setItem('astreamer_accent_color', themeKey); } catch(e) {}
        if (currentView === 'settings') {
          loadSettings();
        }
      }
    }
    setAccentTheme(currentAccent, false);

    try { contentMode = localStorage.getItem('astreamer_content_mode') || 'NSFW'; } catch(e) {}
    try { libraryViewMode = localStorage.getItem('astreamer_view_mode') || 'medium'; } catch(e) {}
    try { libraryPerPage = parseInt(localStorage.getItem('astreamer_per_page')) || 20; } catch(e) {}
    try { playlistViewMode = localStorage.getItem('astreamer_pl_view_mode') || 'list'; } catch(e) {}
    try { historySortMode = localStorage.getItem('astreamer_history_sort') || 'date-desc'; } catch(e) {}
    try { isShuffle = localStorage.getItem('astreamer_shuffle') === 'true'; } catch(e) {}

    function updateShuffleUI() {
      const btn = document.getElementById('shuffleBtn');
      const pBtn = document.getElementById('popupShuffleBtn');
      [btn, pBtn].forEach(el => {
        if (!el) return;
        el.classList.toggle('active', isShuffle);
        el.title = isShuffle ? 'Shuffle / Random: ON (Click to turn off)' : 'Shuffle / Random: OFF (Click to turn on)';
      });
    }

    function toggleShuffle() {
      isShuffle = !isShuffle;
      try { localStorage.setItem('astreamer_shuffle', isShuffle ? 'true' : 'false'); } catch(e) {}
      updateShuffleUI();
    }

    function updatePageTitle(subpage) {
      if (!subpage) {
        document.title = 'aStreamer | Your one hub streaming services';
      } else {
        document.title = 'aStreamer | ' + subpage;
      }
    }

    function handleImgError(el) {
      if (!el) return;
      el.onerror = null;
      const rj = el.getAttribute('data-rj');
      if (contentMode === 'PSFW' || contentMode === 'SFW') {
        const display = getDisplayCover({ rjCode: rj || 'RJ000000', coverUrl: '' });
        el.src = display.coverUrl;
      } else if (rj) {
        el.src = '/image-proxy?rj=' + rj;
      } else {
        el.src = "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22%3E%3Crect width=%2248%22 height=%2248%22 fill=%22%23222%22/%3E%3C/svg%3E";
      }
    }

    function triggerBackupUpload() {
      const el = document.getElementById('backupFileInput');
      if (el) el.click();
    }

    function recordPlayHistory(work, trackIndex = 0) {
      if (!work || !work.rjCode) return;
      const track = (work.tracks && work.tracks[trackIndex]) ? work.tracks[trackIndex] : null;
      const entry = {
        rjCode: work.rjCode,
        title: work.title,
        trackTitle: track ? track.title : '',
        trackIndex: trackIndex,
        coverUrl: work.coverUrl,
        cv: work.cv || '',
        circle: work.circle || '',
        isNsfw: work.isNsfw,
        tags: work.tags || [],
        playedAt: new Date().toISOString()
      };

      // 1. Immediate local cache
      try {
        let history = JSON.parse(localStorage.getItem('astreamer_play_history') || '[]');
        if (!Array.isArray(history)) history = [];
        history = history.filter(item => item.rjCode !== work.rjCode);
        history.unshift(entry);
        if (history.length > 20) history = history.slice(0, 20);
        localStorage.setItem('astreamer_play_history', JSON.stringify(history));
      } catch(e) {}

      // 2. Cross-device sync
      apiFetch('/api/history', {
        method: 'POST',
        body: JSON.stringify(entry)
      }).catch(() => {});
    }

    let currentView = 'library';
    let allWorks = [];
    let shuffledLibraryWorks = null;
    let currentWork = null;
    let currentWorkChapters = [];
    let currentTrackIndex = -1;
    let hls = null;
    let loadedHlsUrl = null;
    let pendingPlaylistItem = null;
    let isChapterDrawerOpen = false;
    const audio = document.getElementById('coreAudio');

    const SFW_DISGUISE_LIST = ['RJ01681691','RJ01678330','RJ01694805','RJ01688728','RJ01693711','RJ335043','RJ01360841','RJ346413','RJ01229288','RJ321035','RJ317278','RJ387519','RJ370190','RJ343025','RJ373001','RJ01144236','RJ336447','RJ329940','RJ403038','RJ370099','RJ299717','RJ01323001','RJ363741','RJ333531','RJ357211','RJ01040461'];

    const NSFW_KEYWORDS = [
      'nsfw', '18禁', 'r18', 'r-18', 'adult', 'erotic', 'erotica', 'futanari', 'hentai',
      '手コキ', '足コキ', '中出し', 'オナサポ', '乳首責め', '乳首', 'オナホ', 'セックス',
      '騎乗位', '交尾', '精飲', 'フェラ', 'パイズリ', 'アナル', '潮吹き', '痴女',
      'バイブ', '拘束', '催眠', '洗脳', '絶頂', '連続絶頂', '常識改変', 'インモラル',
      '乱交', '射精', '射精管理', '快楽堕ち', 'おまんこ', 'ちんぽ', 'ちんこ', '性力',
      'オホ声', 'オホ', '奉仕', '寸止め', 'ザーメン', '搾精', '淫乱', '発情',
      'メス堕ち', 'アヘ顔', '肉便器', 'マゾ', 'サド', '調教', '言葉責め', '愛撫',
      'クンニ', '巨乳', '爆乳', '催眠音声', '退廃', '背徳', '強制', '無理矢理',
      '媚び', '服従', '淫惑', '性器', '淫具', '孕', '媚薬', '触手', '近親相姦',
      '痴漢', '辱め', '羞恥', '放尿', 'お漏らし', '飲尿', '責め', '処女喪失', '破瓜',
      '性交', 'オナニー', '自慰', '手淫', 'masturbation', 'handjob', 'blowjob',
      'fellatio', 'creampie', 'nipple', 'anal', 'squirt', 'vibrator', 'bdsm', 'bondage',
      'orgasm', 'ejaculation', 'cum', 'semen', 'aphrodisiac', 'tentacle', 'slut', 'lewd',
      'pussy', 'penis', 'clitoris', 'dildo', 'virgin', 'defloration', 'incest', 'sadism'
    ];

    function isTagNsfw(tagName) {
      if (!tagName || typeof tagName !== 'string') return false;
      const clean = tagName.trim();
      const entry = getTagEntry(clean);
      if (entry && typeof entry.isNsfw === 'boolean') {
        return entry.isNsfw;
      }
      const tagLower = clean.toLowerCase();
      if (NSFW_KEYWORDS.some(k => tagLower.includes(k.toLowerCase()))) return true;
      if (entry) {
        const eng = (entry.english || '').toLowerCase();
        const rom = (entry.romaji || '').toLowerCase();
        if (NSFW_KEYWORDS.some(k => eng.includes(k.toLowerCase()) || rom.includes(k.toLowerCase()))) return true;
      }
      return false;
    }

    function isWorkNsfw(work) {
      if (!work) return false;
      const rj = (work.rjCode || work.id || '').toUpperCase();
      if (rj && SFW_DISGUISE_LIST.some(s => normRj(s) === normRj(rj))) return false;
      
      const fullWork = (rj && allWorks.find(w => normRj(w.rjCode) === normRj(rj))) || work;
      
      // 1. Explicit SFW flag from DLsite / ASMR.one API (age_category: 1 / rating: general)
      if (fullWork.isNsfw === false) return false;
      if (fullWork.isNsfw === true) return true;

      const tags = fullWork.tags || [];
      const title = fullWork.title || '';
      const circle = fullWork.circle || '';
      const fullText = (tags.join(' ') + ' ' + title + ' ' + circle).toLowerCase();

      // 2. Explicit SFW / General markers in title or tags
      if (fullText.includes('全年齢') || fullText.includes('一般作品') || fullText.includes('一般向け') || fullText.includes('all-ages') || fullText.includes('general')) {
        return false;
      }

      // 3. Explicit NSFW keywords & tags
      if (NSFW_KEYWORDS.some(k => fullText.includes(k.toLowerCase()))) return true;
      if (tags.some(t => isTagNsfw(t))) return true;

      // 4. Default: Treat as NSFW in PSFW / SFW mode for 100% cover & content disguise safety
      return true;
    }

    function getDisplayCover(work) {
      if (!work) return { coverUrl: '', isDisguised: false };
      const rawCover = work.coverUrl || work.poster || '';
      if ((contentMode === 'PSFW' || contentMode === 'SFW') && isWorkNsfw(work)) {
        const rj = (work.rjCode || work.id || 'RJ000000').toUpperCase();
        let hash = 0;
        for (let i = 0; i < rj.length; i++) hash = (hash * 31 + rj.charCodeAt(i)) >>> 0;
        const sfwRj = SFW_DISGUISE_LIST[hash % SFW_DISGUISE_LIST.length];
        return { coverUrl: '/image-proxy?url=' + encodeURIComponent('https://pic.weeabo0.xyz/' + sfwRj + '_img_main.jpg'), isDisguised: true };
      }
      return { coverUrl: rawCover, isDisguised: false };
    }

    function renderLockedState(title, desc) {
      return '<div style="padding: 4rem 2rem; text-align: center; max-width: 480px; margin: 40px auto; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.5);"><div style="font-size: 3rem; margin-bottom: 12px;">🔒</div><h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 8px;">' + (title || 'Private Audio Library') + '</h2><p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px; line-height: 1.5;">' + (desc || 'This audio collection is protected. Enter your admin passcode to browse, search, and stream your works.') + '</p><button class="btn-primary" style="padding: 12px 28px; font-size: 0.95rem; font-weight: 700; margin: 0 auto;" onclick="openAdminModal()">🔑 Unlock Admin Access</button></div>';
    }

    async function initApp() {
      if ('scrollRestoration' in history) {
        try { history.scrollRestoration = 'manual'; } catch(e) {}
      }
      try { updateShuffleUI(); } catch(e) { console.error('Error updating shuffle UI:', e); }
      try { setupMediaSessionHandlers(); } catch(e) { console.error('Error setting up media session:', e); }
      try { syncTagDictionary(); } catch(e) { console.error('Error syncing tag dictionary:', e); }
      try { await checkAuthStatus(); } catch(e) { console.error('Error checking auth status:', e); }
      try { handleHashRoute(); } catch(e) { console.error('Error handling route:', e); }
      window.addEventListener('hashchange', () => {
        try { handleHashRoute(); } catch(e) {}
      });
    }

    window.addEventListener('scroll', () => {
      if (currentView === 'library') {
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        if (y > 0) {
          savedScrollPositions['library'] = y;
        }
      }
    }, { passive: true });

    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', initApp);
    } else {
      initApp();
    }

    window.addEventListener('hashchange', () => {
      handleHashRoute();
    });

    window.addEventListener('keydown', (e) => {
      // Lightbox navigation if active
      const lbModal = document.getElementById('imageLightboxModal');
      if (lbModal && lbModal.style.display === 'flex') {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          navLightbox(-1);
          return;
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          navLightbox(1);
          return;
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          closeLightboxModal();
          return;
        }
      }

      // Hardware / Keyboard media keys
      if (e.key === 'MediaTrackNext' || e.code === 'MediaTrackNext') {
        e.preventDefault();
        playNextTrack();
        return;
      }
      if (e.key === 'MediaTrackPrevious' || e.code === 'MediaTrackPrevious') {
        e.preventDefault();
        playPrevTrack();
        return;
      }
      if (e.key === 'MediaPlayPause' || e.code === 'MediaPlayPause') {
        e.preventDefault();
        togglePlayPause();
        return;
      }
      if (e.key === 'MediaStop' || e.code === 'MediaStop') {
        e.preventDefault();
        audio.pause();
        audio.currentTime = 0;
        return;
      }

      // Spacebar toggle play/pause when not typing in text fields
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        togglePlayPause();
        return;
      }

      if (e.key === 'Escape') {
        const popupModal = document.getElementById('popupPlayerModal');
        if (popupModal && popupModal.style.display === 'flex') {
          closePopupPlayer();
        } else {
          // Stealth panic toggle
          const nextMode = contentMode === 'PSFW' ? 'NSFW' : 'PSFW';
          setContentMode(nextMode);
        }
      }
    });

    async function checkAuthStatus() {
      try {
        const saved = localStorage.getItem('astreamer_admin_passcode') || '';
        if (!saved) {
          isAdmin = false;
          updateAdminUI(false);
          return;
        }
        const res = await fetch('/api/auth/check', {
          headers: { 'x-admin-passcode': saved }
        });
        const data = await res.json().catch(() => ({}));
        isAdmin = Boolean(data.authenticated);
        updateAdminUI(isAdmin);
        if (isAdmin) updateWishlistBadge();
      } catch(e) {
        isAdmin = false;
        updateAdminUI(false);
      }
    }

    function updateAdminUI(active) {
      const sidebarBtn = document.getElementById('sidebarAdminBtn');
      const mobileBtn = document.getElementById('mobileAdminBtn');

      if (sidebarBtn) {
        sidebarBtn.innerHTML = active ? '🔒 Admin Active' : '🔓 Unlock Admin';
        sidebarBtn.style.color = active ? '#38bdf8' : 'var(--text-muted)';
        sidebarBtn.title = active ? 'Admin Mode Active (Click to Logout)' : 'Click to Unlock Admin';
      }
      if (mobileBtn) {
        mobileBtn.innerHTML = active ? '🔒' : '🔓';
        mobileBtn.title = active ? 'Admin Active (Click to Logout)' : 'Unlock Admin';
      }
    }

    function openAdminModal(subtitle = null) {
      const errEl = document.getElementById('loginError');
      if (errEl) errEl.style.display = 'none';
      const subEl = document.getElementById('gatekeeperSubtitle');
      if (subEl) subEl.innerText = subtitle || 'Enter your admin passcode to manage works and modify library settings.';
      const modal = document.getElementById('gatekeeperModal');
      if (modal) {
        modal.style.display = 'flex';
        const inp = document.getElementById('passcodeInput');
        if (inp) { inp.value = ''; inp.focus(); }
      }
    }

    function closeAdminModal() {
      const modal = document.getElementById('gatekeeperModal');
      if (modal) modal.style.display = 'none';
    }

    async function toggleAdminModal() {
      if (isAdmin) {
        if (confirm('You are currently authenticated as Admin. Do you want to log out?')) {
          await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
          try { localStorage.removeItem('astreamer_admin_passcode'); } catch(e) {}
          isAdmin = false;
          updateAdminUI(false);
          updateWishlistBadge();
          handleHashRoute();
        }
      } else {
        openAdminModal();
      }
    }

    async function loginAdmin() {
      try {
        const pass = document.getElementById('passcodeInput').value.trim();
        if (!pass) return;
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ passcode: pass })
        });
        const data = await res.json().catch(() => ({}));
        if (data && data.success) {
          isAdmin = true;
          try { localStorage.setItem('astreamer_admin_passcode', pass); } catch(e) {}
          closeAdminModal();
          updateAdminUI(true);
          updateWishlistBadge();
          handleHashRoute();
        } else {
          const errEl = document.getElementById('loginError');
          errEl.innerText = data?.error || 'Invalid Passcode';
          errEl.style.display = 'block';
        }
      } catch (err) {
        const errEl = document.getElementById('loginError');
        errEl.innerText = 'Login error: ' + err.message;
        errEl.style.display = 'block';
      }
    }

    async function apiFetch(url, options = {}) {
      options.headers = options.headers || { 'Content-Type': 'application/json' };
      const savedPass = localStorage.getItem('astreamer_admin_passcode') || '';
      if (savedPass) {
        if (typeof options.headers.set === 'function') {
          options.headers.set('x-admin-passcode', savedPass);
        } else if (typeof options.headers === 'object') {
          options.headers['x-admin-passcode'] = savedPass;
        }
      }
      const res = await fetch(url, options);
      if (res.status === 401) {
        isAdmin = false;
        updateAdminUI(false);
        openAdminModal('Admin authorization required to perform this action.');
      }
      return res;
    }

    async function apiFetchJson(url, options = {}) {
      const res = await apiFetch(url, options);
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch (err) {
        if (!res.ok) {
          throw new Error('Server error HTTP ' + res.status + (res.statusText ? ' (' + res.statusText + ')' : ' (Gateway Timeout / Busy)'));
        }
        throw new Error('Failed to parse response from server');
      }
    }

    let savedScrollPositions = { library: 0 };

    function getLibraryHash(page = libraryCurrentPage, filterParams = currentFilterParams) {
      let base = '#/library';
      if (filterParams && filterParams.tag) {
        base = '#/genre/' + encodeURIComponent(filterParams.tag);
      } else if (filterParams && filterParams.cv) {
        base = '#/cv/' + encodeURIComponent(filterParams.cv);
      } else if (filterParams && filterParams.circle) {
        base = '#/circle/' + encodeURIComponent(filterParams.circle);
      } else if (filterParams && filterParams.favorite) {
        base = '#/favorites';
      } else if (filterParams && filterParams.q) {
        base = '#/search/' + encodeURIComponent(filterParams.q);
      } else {
        return page > 1 ? '#/page/' + page : '#/library';
      }
      return page > 1 ? base + '/' + page : base;
    }

    function switchView(view, param = null, updateHash = true, page = 1) {
      if (currentView && currentView === 'library' && view !== 'library') {
        savedScrollPositions['library'] = window.scrollY || document.documentElement.scrollTop || 0;
      }
      currentView = view;
      if (view === 'library') {
        libraryCurrentPage = parseInt(page, 10) || 1;
      }
      if (updateHash) {
        let hash = '#/' + view;
        if (view === 'work-detail' && typeof param === 'string') {
          hash = '#/work/' + encodeURIComponent(param);
        } else if (view === 'playlist-detail' && typeof param === 'string') {
          hash = '#/playlist/' + encodeURIComponent(param);
        } else if (view === 'library') {
          hash = getLibraryHash(libraryCurrentPage, param || {});
        }
        if (window.location.hash !== hash) {
          window.location.hash = hash;
        }
      }

      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.mobile-pill').forEach(el => el.classList.remove('active'));

      const activeNavSelector = '[data-view="' + view + '"]';
      document.querySelectorAll(activeNavSelector).forEach(el => el.classList.add('active'));

      if (view === 'library') {
        loadLibrary(param || {});
      } else if (view === 'playlists') {
        loadPlaylists();
      } else if (view === 'history') {
        loadHistory();
      } else if (view === 'wishlist') {
        loadWishlist();
      } else if (view === 'artists') {
        loadArtists();
      } else if (view === 'genres') {
        loadGenres();
      } else if (view === 'settings') {
        loadSettings();
      } else if (view === 'work-detail') {
        loadWorkDetail(param);
      } else if (view === 'playlist-detail') {
        loadPlaylistDetail(param);
      }
    }

    function handleHashRoute() {
      const raw = window.location.hash || '#/library';
      const clean = raw.startsWith('#/') ? raw.slice(2) : (raw.startsWith('#') ? raw.slice(1) : raw);
      const parts = clean.split('/');
      const section = parts[0] || 'library';

      if (section === 'work') {
        const rj = parts.slice(1).join('/');
        if (rj) switchView('work-detail', decodeURIComponent(rj), false);
        else switchView('library', null, false, 1);
      } else if (section === 'page') {
        const pageNum = parseInt(parts[1], 10) || 1;
        switchView('library', null, false, pageNum);
      } else if (section === 'genre') {
        const tag = decodeURIComponent(parts[1] || '');
        let pageNum = 1;
        if (parts[2] === 'page' && parts[3]) pageNum = parseInt(parts[3], 10) || 1;
        else if (parts[2] && !isNaN(parseInt(parts[2], 10))) pageNum = parseInt(parts[2], 10) || 1;
        switchView('library', { tag: tag }, false, pageNum);
      } else if (section === 'cv') {
        const cv = decodeURIComponent(parts[1] || '');
        let pageNum = 1;
        if (parts[2] === 'page' && parts[3]) pageNum = parseInt(parts[3], 10) || 1;
        else if (parts[2] && !isNaN(parseInt(parts[2], 10))) pageNum = parseInt(parts[2], 10) || 1;
        switchView('library', { cv: cv }, false, pageNum);
      } else if (section === 'circle') {
        const circle = decodeURIComponent(parts[1] || '');
        let pageNum = 1;
        if (parts[2] === 'page' && parts[3]) pageNum = parseInt(parts[3], 10) || 1;
        else if (parts[2] && !isNaN(parseInt(parts[2], 10))) pageNum = parseInt(parts[2], 10) || 1;
        switchView('library', { circle: circle }, false, pageNum);
      } else if (section === 'search') {
        const q = decodeURIComponent(parts[1] || '');
        let pageNum = 1;
        if (parts[2] === 'page' && parts[3]) pageNum = parseInt(parts[3], 10) || 1;
        else if (parts[2] && !isNaN(parseInt(parts[2], 10))) pageNum = parseInt(parts[2], 10) || 1;
        switchView('library', { q: q }, false, pageNum);
      } else if (section === 'favorites') {
        let pageNum = 1;
        if (parts[1] === 'page' && parts[2]) pageNum = parseInt(parts[2], 10) || 1;
        else if (parts[1] && !isNaN(parseInt(parts[1], 10))) pageNum = parseInt(parts[1], 10) || 1;
        switchView('library', { favorite: 'true' }, false, pageNum);
      } else if (section === 'playlist') {
        const plId = decodeURIComponent(parts.slice(1).join('/'));
        if (plId) switchView('playlist-detail', plId, false);
        else switchView('playlists', null, false);
      } else if (section === 'library') {
        let pageNum = 1;
        if (parts[1] === 'page' && parts[2]) pageNum = parseInt(parts[2], 10) || 1;
        else if (parts[1] && !isNaN(parseInt(parts[1], 10))) pageNum = parseInt(parts[1], 10) || 1;
        switchView('library', null, false, pageNum);
      } else if (['playlists', 'history', 'wishlist', 'artists', 'genres', 'settings'].includes(section)) {
        switchView(section, null, false);
      } else {
        switchView('library', {}, false, 1);
      }
    }

    async function loadLibrary(filterParams = {}) {
      currentFilterParams = filterParams;
      if (filterParams.tag) {
        updatePageTitle(filterParams.tag);
      } else if (filterParams.cv) {
        updatePageTitle(filterParams.cv);
      } else if (filterParams.circle) {
        updatePageTitle(filterParams.circle);
      } else if (filterParams.q) {
        updatePageTitle('Search: ' + filterParams.q);
      } else if (filterParams.favorite) {
        updatePageTitle('Favorites');
      } else if (libraryCurrentPage > 1) {
        updatePageTitle('Page ' + libraryCurrentPage);
      } else {
        updatePageTitle();
      }

      const container = document.getElementById('viewContainer');
      if (!isAdmin) {
        container.innerHTML = renderLockedState('Private Audio Library', 'This audio collection is protected. Enter your admin passcode to browse, search, and stream your works.');
        return;
      }

      const hasCachedWorks = Array.isArray(allWorks) && allWorks.length > 0;
      const isPlainLibrary = !filterParams || Object.keys(filterParams).length === 0;

      if (hasCachedWorks && isPlainLibrary) {
        renderLibraryGrid(shuffledLibraryWorks || allWorks, filterParams);
      } else if (!hasCachedWorks) {
        container.innerHTML = '<div style="text-align:center; padding: 3rem; color: var(--text-muted);">Loading Library...</div>';
      }

      try {
        const url = new URL('/api/library', window.location.origin);
        Object.keys(filterParams).forEach(k => { if (filterParams[k]) url.searchParams.set(k, filterParams[k]); });
        let works = await apiFetchJson(url);
        if (!Array.isArray(works)) works = [];
        if (contentMode === 'SFW') works = works.filter(w => !isWorkNsfw(w));
        allWorks = works;
        if (shuffledLibraryWorks && (!filterParams || Object.keys(filterParams).length === 0)) {
          const workMap = new Map(works.map(w => [w.rjCode, w]));
          shuffledLibraryWorks = shuffledLibraryWorks
            .map(w => workMap.get(w.rjCode) || w)
            .filter(w => contentMode !== 'SFW' || !isWorkNsfw(w));
          const existingSet = new Set(shuffledLibraryWorks.map(w => w.rjCode));
          works.forEach(w => {
            if (!existingSet.has(w.rjCode)) shuffledLibraryWorks.push(w);
          });
          renderLibraryGrid(shuffledLibraryWorks, filterParams);
        } else {
          shuffledLibraryWorks = null;
          renderLibraryGrid(works, filterParams);
        }
      } catch (e) {
        if (!hasCachedWorks) {
          container.innerHTML = '<div style="color: #f59e0b; padding: 2.5rem; text-align: center; max-width: 500px; margin: 0 auto;"><div style="font-size: 2.5rem; margin-bottom: 12px;">⏳</div><div style="font-weight: 700; font-size: 1.1rem; color: #fff; margin-bottom: 8px;">Unable to load library</div><div style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 20px;">' + (e.message || '').replace(/</g, '&lt;') + '</div><button class="btn-primary" onclick="loadLibrary()">🔄 Retry Loading</button></div>';
        }
      }
    }

    window.navWork = function(rj) {
      if (currentView === 'library') {
        savedScrollPositions['library'] = window.scrollY || document.documentElement.scrollTop || 0;
      }
      switchView('work-detail', rj);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.navGenre = function(tag) {
      savedScrollPositions['library'] = 0;
      shuffledLibraryWorks = null;
      currentTagQuery = tag;
      const s = document.getElementById('globalTagSearch');
      const m = document.getElementById('mobileTagSearchInput');
      if (s) s.value = tag;
      if (m) m.value = tag;
      switchView('library', { tag: tag }, true, 1);
    };
    window.navCv = function(cv) {
      savedScrollPositions['library'] = 0;
      shuffledLibraryWorks = null;
      currentTitleQuery = cv;
      const s = document.getElementById('globalSearch');
      const m = document.getElementById('mobileSearchInput');
      if (s) s.value = cv;
      if (m) m.value = cv;
      switchView('library', { cv: cv }, true, 1);
    };
    window.navCircle = function(circle) { savedScrollPositions['library'] = 0; shuffledLibraryWorks = null; switchView('library', { circle: circle }, true, 1); };
    window.navPlaylist = function(id) { switchView('playlist-detail', id); };
    window.navFavs = function() { savedScrollPositions['library'] = 0; shuffledLibraryWorks = null; switchView('library', { favorite: 'true' }, true, 1); };
    window.navAll = function() {
      savedScrollPositions['library'] = 0;
      shuffledLibraryWorks = null;
      currentTitleQuery = '';
      currentTagQuery = '';
      const s1 = document.getElementById('globalSearch');
      const s2 = document.getElementById('globalTagSearch');
      const m1 = document.getElementById('mobileSearchInput');
      const m2 = document.getElementById('mobileTagSearchInput');
      if (s1) s1.value = '';
      if (s2) s2.value = '';
      if (m1) m1.value = '';
      if (m2) m2.value = '';
      switchView('library', {}, true, 1);
    };
    window.navBack = function() {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        switchView('library');
      }
    };

    function shuffleLibraryView() {
      savedScrollPositions['library'] = 0;
      const source = (currentFilterParams && Object.keys(currentFilterParams).length > 0) ? (shuffledLibraryWorks || allWorks) : allWorks;
      if (!Array.isArray(source) || source.length === 0) return;
      const copy = [...source];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      shuffledLibraryWorks = copy;
      libraryCurrentPage = 1;
      renderLibraryGrid(shuffledLibraryWorks, currentFilterParams);
    }

    function setLibraryViewMode(mode) {
      libraryViewMode = mode;
      try { localStorage.setItem('astreamer_view_mode', mode); } catch(e) {}
      renderLibraryGrid(shuffledLibraryWorks || allWorks, currentFilterParams);
    }

    function setLibraryPerPage(count) {
      savedScrollPositions['library'] = 0;
      libraryPerPage = parseInt(count) || 0;
      libraryCurrentPage = 1;
      try { localStorage.setItem('astreamer_per_page', libraryPerPage); } catch(e) {}
      const targetHash = getLibraryHash(1, currentFilterParams);
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      } else {
        renderLibraryGrid(shuffledLibraryWorks || allWorks, currentFilterParams);
      }
    }

    function setLibraryPage(page) {
      savedScrollPositions['library'] = 0;
      libraryCurrentPage = parseInt(page, 10) || 1;
      const targetHash = getLibraryHash(libraryCurrentPage, currentFilterParams);
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      } else {
        renderLibraryGrid(shuffledLibraryWorks || allWorks, currentFilterParams);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderLibraryGrid(works, filterParams) {
      filterParams = filterParams || currentFilterParams || {};
      const container = document.getElementById('viewContainer');
      let filterHeader = '';
      const modeBadge = contentMode === 'PSFW' ? '<span class="disguised-badge" style="margin-left: 8px;">🎭 PSFW Disguise Mode Active</span>' : (contentMode === 'SFW' ? '<span style="background:#0e7490; color:#fff; font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:4px; margin-left:8px;">🛡️ SFW Filter Active</span>' : '');

      if (filterParams.tag) filterHeader = '<div style="background: rgba(255,51,102,0.12); border: 1px solid var(--accent); padding: 10px 18px; border-radius: 10px; margin-bottom: 1.2rem; display: flex; align-items: center; justify-content: space-between;"><span>🏷️ Filtered by Genre: <strong>' + formatTag(filterParams.tag) + '</strong> (' + works.length + ' works)</span><button class="btn-outline" style="padding: 4px 12px; font-size: 0.8rem;" onclick="navAll()">✖ Clear Filter</button></div>';
      else if (filterParams.cv) filterHeader = '<div style="background: rgba(56,189,248,0.12); border: 1px solid #38bdf8; padding: 10px 18px; border-radius: 10px; margin-bottom: 1.2rem; display: flex; align-items: center; justify-content: space-between;"><span>🎙️ Filtered by Voice Actor: <strong>' + filterParams.cv + '</strong> (' + works.length + ' works)</span><button class="btn-outline" style="padding: 4px 12px; font-size: 0.8rem;" onclick="navAll()">✖ Clear Filter</button></div>';
      else if (filterParams.circle) filterHeader = '<div style="background: rgba(14,116,144,0.15); border: 1px solid #0e7490; padding: 10px 18px; border-radius: 10px; margin-bottom: 1.2rem; display: flex; align-items: center; justify-content: space-between;"><span>🏢 Filtered by Circle: <strong>' + filterParams.circle + '</strong> (' + works.length + ' works)</span><button class="btn-outline" style="padding: 4px 12px; font-size: 0.8rem;" onclick="navAll()">✖ Clear Filter</button></div>';
      else if (filterParams.favorite) filterHeader = '<div style="background: rgba(255,51,102,0.12); border: 1px solid var(--accent); padding: 10px 18px; border-radius: 10px; margin-bottom: 1.2rem; display: flex; align-items: center; justify-content: space-between;"><span>❤️ Showing <strong>Favorites</strong> (' + works.length + ' works)</span><button class="btn-outline" style="padding: 4px 12px; font-size: 0.8rem;" onclick="navAll()">✖ Show All</button></div>';
      else if (filterParams.q) filterHeader = '<div style="background: rgba(56,189,248,0.12); border: 1px solid #38bdf8; padding: 10px 18px; border-radius: 10px; margin-bottom: 1.2rem; display: flex; align-items: center; justify-content: space-between;"><span>🔍 Search Query: <strong>&quot;' + filterParams.q + '&quot;</strong> (' + works.length + ' works)</span><button class="btn-outline" style="padding: 4px 12px; font-size: 0.8rem;" onclick="navAll()">✖ Clear Search</button></div>';

      // Pagination Slicing
      const totalCount = works.length;
      const perPage = libraryPerPage > 0 ? libraryPerPage : totalCount || 1;
      const totalPages = Math.ceil(totalCount / perPage) || 1;
      if (libraryCurrentPage > totalPages) libraryCurrentPage = totalPages;
      if (libraryCurrentPage < 1) libraryCurrentPage = 1;

      const startIndex = (libraryCurrentPage - 1) * perPage;
      const paginatedWorks = libraryPerPage > 0 ? works.slice(startIndex, startIndex + perPage) : works;

      // Explorer Toolbar & View Modes
      let toolbarHtml = '<div class="view-modes-bar">';
      toolbarHtml += '<div style="display:flex; align-items:center; gap:8px;">';
      toolbarHtml += '<span style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">VIEW:</span>';
      toolbarHtml += '<div class="view-mode-buttons">';
      toolbarHtml += '<button class="view-btn ' + (libraryViewMode === 'large' ? 'active' : '') + '" data-mode="large" onclick="setLibraryViewMode(this.dataset.mode)" title="Large Hero Cards">🖼️ Large</button>';
      toolbarHtml += '<button class="view-btn ' + (libraryViewMode === 'medium' ? 'active' : '') + '" data-mode="medium" onclick="setLibraryViewMode(this.dataset.mode)" title="Medium Standard Grid">🎴 Med</button>';
      toolbarHtml += '<button class="view-btn ' + (libraryViewMode === 'small' ? 'active' : '') + '" data-mode="small" onclick="setLibraryViewMode(this.dataset.mode)" title="Compact Small Cards">📱 Small</button>';
      toolbarHtml += '<button class="view-btn ' + (libraryViewMode === 'list' ? 'active' : '') + '" data-mode="list" onclick="setLibraryViewMode(this.dataset.mode)" title="Detailed List Table">📋 List</button>';
      toolbarHtml += '<button class="view-btn ' + (shuffledLibraryWorks ? 'active' : '') + '" onclick="shuffleLibraryView()" title="Shuffle library display order (Click again to re-shuffle)">🎲 Shuffle' + (shuffledLibraryWorks ? ' ↺' : '') + '</button>';
      toolbarHtml += '</div></div>';

      toolbarHtml += '<div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">';
      toolbarHtml += '<div style="display:flex; align-items:center; gap:6px;"><span style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">SHOW:</span>';
      toolbarHtml += '<select class="per-page-select" onchange="setLibraryPerPage(this.value)">';
      [10, 20, 50, 100].forEach(n => {
        toolbarHtml += '<option value="' + n + '" ' + (libraryPerPage === n ? 'selected' : '') + '>' + n + ' per page</option>';
      });
      toolbarHtml += '<option value="0" ' + (libraryPerPage === 0 ? 'selected' : '') + '>All (' + totalCount + ')</option>';
      toolbarHtml += '</select></div>';
      toolbarHtml += '<button class="btn-outline" style="padding:5px 12px; font-size:0.8rem;" onclick="navFavs()">❤️ Favorites</button>';
      toolbarHtml += '<button class="btn-outline" style="padding:5px 12px; font-size:0.8rem;" onclick="navAll()">' + (shuffledLibraryWorks ? 'Original Order' : 'All Works') + '</button>';
      toolbarHtml += '</div></div>';

      const shuffleBadge = shuffledLibraryWorks ? '<span style="background:rgba(255,51,102,0.18); color:var(--accent); font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:4px; margin-left:8px; border:1px solid rgba(255,51,102,0.3);">🎲 Shuffled Order</span>' : '';

      let html = filterHeader;
      html += '<div class="section-header"><h1 class="section-title">📚 Library (' + totalCount + ') ' + shuffleBadge + modeBadge + '</h1></div>';
      html += toolbarHtml;

      if (totalCount === 0) {
        html += '<div style="padding: 4rem 2rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border);">No works found. Use <strong>+ Add RJ Code</strong> or <strong>📥 Batch Import</strong> to add audio works!</div>';
        container.innerHTML = html;
        return;
      }

      if (libraryViewMode === 'list') {
        html += '<table class="works-list-table"><thead><tr><th style="width:50px;">Cover</th><th style="width:110px;">RJ Code</th><th>Title</th><th>Voice Actor (CV)</th><th>Circle</th><th style="width:70px; text-align:center;">Tracks</th><th style="width:90px; text-align:right;">Actions</th></tr></thead><tbody>';
        paginatedWorks.forEach(function(w) {
          const display = getDisplayCover(w);
          const cvDisplay = formatCV(getWorkCV(w));
          const metaLine = (cvDisplay ? '<span style="color:#38bdf8; font-weight:600;">' + cvDisplay + '</span>' : '') + (cvDisplay && w.circle ? ' • ' : '') + (w.circle ? '<span>' + w.circle + '</span>' : '') + ' • <span class="card-rj" style="padding:1px 5px; font-size:0.7rem;">' + w.rjCode + '</span>';
          html += '<tr class="works-list-row" data-rj="' + w.rjCode + '" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); navWork(this.dataset.rj); }">';
          html += '<td class="w-col-cover"><a href="#/work/' + w.rjCode + '" data-rj="' + w.rjCode + '" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); navWork(this.dataset.rj); }"><img class="list-thumb" src="' + display.coverUrl + '" onerror="handleImgError(this)"></a></td>';
          html += '<td class="w-col-rj"><a href="#/work/' + w.rjCode + '" data-rj="' + w.rjCode + '" class="card-rj" style="text-decoration:none; display:inline-block;" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); navWork(this.dataset.rj); }">' + w.rjCode + '</a></td>';
          html += '<td class="w-col-title"><a href="#/work/' + w.rjCode + '" data-rj="' + w.rjCode + '" style="color:inherit; text-decoration:none;" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); navWork(this.dataset.rj); }"><strong>' + w.title + '</strong></a>' + (display.isDisguised ? ' <span class="disguised-badge">🎭 SFW</span>' : '') + '</td>';
          html += '<td class="w-col-meta"><div class="w-meta-inner">' + metaLine + '</div></td>';
          html += '<td class="w-col-circle" style="color:var(--text-muted);">' + (w.circle || 'N/A') + '</td>';
          html += '<td class="w-col-tracks" style="text-align:center;"><span style="background:rgba(255,255,255,0.06); padding:2px 8px; border-radius:10px; font-size:0.75rem;">' + (w.totalTracks || (w.tracks ? w.tracks.length : 0)) + '</span></td>';
          html += '<td class="w-col-actions" style="text-align:right;"><span class="card-fav card-fav-' + w.rjCode + '" data-rj="' + w.rjCode + '" title="Toggle Favorite" onclick="event.stopPropagation(); event.preventDefault(); toggleFav(this.dataset.rj, event)" style="margin-right:6px; font-size:1.05rem;">' + (w.favorite ? '❤️' : '🤍') + '</span><button class="btn-outline" style="padding:3px 8px; font-size:0.75rem;" data-rj="' + w.rjCode + '" onclick="event.stopPropagation(); playWorkDirectly(this.dataset.rj)">▶</button></td>';
          html += '</tr>';
        });
        html += '</tbody></table>';
      } else {
        html += '<div class="works-grid mode-' + libraryViewMode + '">';
        paginatedWorks.forEach(function(w) {
          const display = getDisplayCover(w);
          const cvDisplay = formatCV(getWorkCV(w));
          const subText = cvDisplay || w.circle || 'ASMR';
          html += '<a class="work-card" href="#/work/' + w.rjCode + '" data-rj="' + w.rjCode + '" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); navWork(this.dataset.rj); }">';
          html += '<div class="card-cover-wrapper"><img class="card-cover" src="' + display.coverUrl + '" data-rj="' + w.rjCode + '" onerror="handleImgError(this)">' + (display.isDisguised ? '<div class="disguised-overlay"><span class="disguised-badge">🎭 Disguised SFW</span></div>' : '') + '</div>';
          html += '<div class="card-badge-row"><span class="card-rj">' + w.rjCode + '</span><span class="card-fav card-fav-' + w.rjCode + '" data-rj="' + w.rjCode + '" title="' + (w.favorite ? 'Favorited' : 'Add to Favorites') + '" onclick="event.stopPropagation(); event.preventDefault(); toggleFav(this.dataset.rj, event)" style="transition: transform 0.15s ease-out; display: inline-block;">' + (w.favorite ? '❤️' : '🤍') + '</span></div>';
          html += '<div class="card-title" title="' + w.title.replace(/"/g, '&quot;') + '">' + w.title + '</div>';
          html += '<div class="card-sub">' + subText + '</div>';
          html += '</a>';
        });
        html += '</div>';
      }

      // Pagination Controls Rendering
      if (libraryPerPage > 0 && totalPages > 1) {
        html += '<div class="pagination-bar">';
        html += '<button class="page-btn" ' + (libraryCurrentPage === 1 ? 'disabled' : '') + ' onclick="setLibraryPage(1)">« First</button>';
        html += '<button class="page-btn" ' + (libraryCurrentPage === 1 ? 'disabled' : '') + ' onclick="setLibraryPage(' + (libraryCurrentPage - 1) + ')">‹ Prev</button>';

        let startP = Math.max(1, libraryCurrentPage - 2);
        let endP = Math.min(totalPages, libraryCurrentPage + 2);
        if (startP > 1) html += '<span class="page-info">...</span>';
        for (let p = startP; p <= endP; p++) {
          html += '<button class="page-btn ' + (p === libraryCurrentPage ? 'active' : '') + '" onclick="setLibraryPage(' + p + ')">' + p + '</button>';
        }
        if (endP < totalPages) html += '<span class="page-info">...</span>';

        html += '<button class="page-btn" ' + (libraryCurrentPage === totalPages ? 'disabled' : '') + ' onclick="setLibraryPage(' + (libraryCurrentPage + 1) + ')">Next ›</button>';
        html += '<button class="page-btn" ' + (libraryCurrentPage === totalPages ? 'disabled' : '') + ' onclick="setLibraryPage(' + totalPages + ')">Last »</button>';
        html += '<span class="page-info">Page ' + libraryCurrentPage + ' of ' + totalPages + ' (' + totalCount + ' works)</span>';
        html += '</div>';
      }

      container.innerHTML = html;

      if (savedScrollPositions['library'] && savedScrollPositions['library'] > 0) {
        const targetScroll = savedScrollPositions['library'];
        window.scrollTo({ top: targetScroll, behavior: 'instant' });
        requestAnimationFrame(() => {
          window.scrollTo({ top: targetScroll, behavior: 'instant' });
          setTimeout(() => {
            window.scrollTo({ top: targetScroll, behavior: 'instant' });
          }, 60);
          setTimeout(() => {
            window.scrollTo({ top: targetScroll, behavior: 'instant' });
          }, 180);
        });
      }
    }

    async function playWorkDirectly(rjCode) {
      let work = allWorks.find(w => w.rjCode === rjCode);
      if (!work) {
        try {
          const res = await apiFetch('/api/library?q=' + encodeURIComponent(rjCode));
          const list = await res.json();
          work = Array.isArray(list) ? list[0] : null;
        } catch (e) {}
      }
      if (work) {
        currentWork = work;
        playTrack(0, true);
      }
    }

    function normRj(code) {
      return (code || '').toUpperCase().replace(/^RJ0*/, 'RJ');
    }

    function renderWorkDetailUI(work) {
      if (!work || currentView !== 'work-detail') return;
      currentWork = work;
      const container = document.getElementById('viewContainer');
      if (!container) return;

      updatePageTitle((work.rjCode ? work.rjCode + ' - ' : '') + (work.title || 'Work Detail'));
      const display = getDisplayCover(work);

      const rawCv = getWorkCV(work);
      const cvList = rawCv && rawCv !== 'N/A'
        ? rawCv.split(/[,、/&＋+;・\\n|]/).map(function(s) { return cleanCVName(s); }).filter(Boolean)
        : [];
      
      const cvNamesSet = new Set();
      cvList.forEach(function(c) {
        cvNamesSet.add(c.toLowerCase());
        const entry = getTagEntry(c);
        if (entry) {
          if (entry.romaji) cvNamesSet.add(entry.romaji.toLowerCase());
          if (entry.english) cvNamesSet.add(entry.english.toLowerCase());
        }
      });

      const cvPills = cvList.length > 0
        ? Array.from(new Set(cvList)).map(function(c) {
            return '<a href="#/cv/' + encodeURIComponent(c) + '" class="tag-pill" style="display:inline-flex; align-items:center; gap:4px; margin-right:4px; background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.3); font-weight:700; text-decoration:none;" data-cv="' + c.replace(/"/g, '&quot;') + '" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); navCv(this.dataset.cv); }">🎙️ ' + formatCV(c) + '</a>';
          }).join('')
        : '<span style="color:var(--text-muted);">N/A</span>';

      const circlePill = work.circle && work.circle !== 'N/A'
        ? '<a href="#/circle/' + encodeURIComponent(work.circle) + '" class="tag-pill" style="display:inline-flex; align-items:center; gap:4px; background:rgba(255,255,255,0.06); border:1px solid var(--border); font-weight:700; text-decoration:none; color:inherit;" data-circle="' + work.circle.replace(/"/g, '&quot;') + '" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); navCircle(this.dataset.circle); }">🏢 ' + work.circle + '</a>'
        : '<span style="color:var(--text-muted);">N/A</span>';

      const filteredTags = (work.tags || []).filter(function(t) {
        const clean = (t || '').trim();
        if (!clean) return false;
        if ((contentMode === 'PSFW' || contentMode === 'SFW') && isTagNsfw(clean)) return false;
        if (cvNamesSet.has(clean.toLowerCase())) return false;
        const entry = getTagEntry(clean);
        if (entry && entry.isCV) return false;
        return true;
      });

      const tagPills = filteredTags.map(function(t) {
        return '<a href="#/genre/' + encodeURIComponent(t) + '" class="tag-pill" style="text-decoration:none; color:inherit;" data-tag="' + t.replace(/"/g, '&quot;') + '" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); navGenre(this.dataset.tag); }">' + formatTag(t) + '</a>';
      }).join('');

      // Separate Physical Audio Tracks vs Chapter Markers
      const rawTracks = work.tracks || [];
      let tracksList = rawTracks;
      let chaptersList = [];

      let maxDuration = 0;
      if (audio && audio.duration && !isNaN(audio.duration) && audio.duration > 0 && currentPlayingWork && normRj(currentPlayingWork.rjCode) === normRj(work.rjCode)) {
        maxDuration = audio.duration;
      } else if (rawTracks.length > 0 && rawTracks[0].duration > 0) {
        maxDuration = rawTracks[0].duration;
      }

      const numTracks = Math.max(1, tracksList.length);

      if (Array.isArray(work.chapters) && work.chapters.length > 0) {
        chaptersList = work.chapters;
      } else if (rawTracks.length > 0) {
        chaptersList = rawTracks.map((t, idx) => ({
          id: t.id || (idx + 1),
          title: t.title,
          startTime: t.startTime || 0,
          duration: t.duration || 0,
          formattedTime: t.formattedTime || formatTime(t.startTime || 0),
          trackIndex: idx
        }));
      }

      // Mathematical Cumulative Duration & Track Partitioning Algorithm
      const totalChapters = chaptersList.length;
      const distinctAssignedTracks = new Set(
        chaptersList.map(c => parseInt(c.trackIndex, 10)).filter(n => !isNaN(n) && n >= 0 && n < numTracks)
      );
      const hasDistinctTracks = distinctAssignedTracks.size > 1;

      const trackDurations = tracksList.map(t => Math.max(0, Math.round(Number(t.duration) || 0)));
      const hasKnownTrackDurs = trackDurations.filter(d => d > 0).length >= numTracks - 1 && trackDurations[0] > 0;

      let currentTrk = 0;
      let runningTrackOffset = 0;

      chaptersList = chaptersList.map(function(c, i) {
        const dur = Math.max(0, Math.round(Number(c.duration) || 0));
        let trk = 0;

        if (numTracks > 1) {
          if (hasKnownTrackDurs) {
            const targetTrackDur = trackDurations[currentTrk] || 0;
            // If adding this chapter exceeds the current track's duration by more than 3s, advance to next track
            if (targetTrackDur > 0 && currentTrk < numTracks - 1 && (runningTrackOffset + dur) > (targetTrackDur + 3)) {
              currentTrk++;
              runningTrackOffset = 0;
            }
            trk = currentTrk;
          } else if (hasDistinctTracks) {
            trk = Math.min(Math.max(0, parseInt(c.trackIndex, 10) || 0), numTracks - 1);
            if (trk !== currentTrk) {
              currentTrk = trk;
              runningTrackOffset = 0;
            }
          } else {
            // Chapters were not pre-partitioned in metadata: partition across the N physical tracks!
            const tm = ((c.folder ? c.folder + '/' : '') + (c.title || '')).match(/(?:トラック|track|disc|disk|cd|part|vol|volume|side|第)\s*([0-9]+)/i);
            if (tm && tm[1]) {
              const num = parseInt(tm[1], 10) - 1;
              if (num >= 0 && num < numTracks) {
                trk = num;
              } else {
                trk = Math.min(Math.floor(i * numTracks / totalChapters), numTracks - 1);
              }
            } else {
              trk = Math.min(Math.floor(i * numTracks / totalChapters), numTracks - 1);
            }
            if (trk !== currentTrk) {
              currentTrk = trk;
              runningTrackOffset = 0;
            }
          }
        } else {
          currentTrk = 0;
          trk = 0;
        }

        const startSecs = runningTrackOffset;
        runningTrackOffset += dur;

        return {
          ...c,
          startTime: startSecs,
          duration: dur,
          formattedTime: formatTime(startSecs),
          trackIndex: trk
        };
      });

      // Exact cumulative duration cutoff for single track stream or known maxDuration
      if (numTracks <= 1 && maxDuration > 0 && chaptersList.length > 0) {
        let running = 0;
        let cutoff = -1;
        for (let i = 0; i < chaptersList.length; i++) {
          running += (chaptersList[i].duration || 0);
          if (Math.abs(running - maxDuration) <= 3) {
            cutoff = i;
            break;
          } else if (running > maxDuration + 5) {
            cutoff = i > 0 ? i - 1 : 0;
            break;
          }
        }
        if (cutoff >= 0 && cutoff < chaptersList.length - 1) {
          chaptersList = chaptersList.slice(0, cutoff + 1);
        } else {
          chaptersList = chaptersList.filter(c => (c.startTime || 0) < maxDuration - 2);
        }
      } else if (numTracks > 1 && hasKnownTrackDurs) {
        chaptersList = chaptersList.filter(c => {
          const tDur = trackDurations[c.trackIndex || 0];
          return !tDur || (c.startTime || 0) < tDur - 2;
        });
      }
      work.chapters = chaptersList;
      if (currentPlayingWork && normRj(currentPlayingWork.rjCode) === normRj(work.rjCode)) {
        currentPlayingWork.chapters = chaptersList;
      }
      currentWorkChapters = chaptersList;

      const galleryCount = (Array.isArray(work.gallery) ? work.gallery.length : 0);
      let html = '<div class="work-detail-banner"><img class="detail-cover" src="' + display.coverUrl + '" onerror="handleImgError(this)"><div class="detail-info"><div style="display:flex; gap:8px; margin-bottom:8px;"><span class="card-rj">' + work.rjCode + '</span><span style="background:#0e7490; color:#fff; font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:4px;">' + (work.hasHls ? 'HLS Chapters' : 'Multi-Track') + '</span></div><h1 class="detail-title">' + work.title + '</h1><div class="detail-meta" style="margin-top:6px; display:flex; align-items:center; flex-wrap:wrap; gap:6px;"><strong>Voice Actor (CV):</strong> ' + cvPills + '</div><div class="detail-meta" style="margin-top:6px; display:flex; align-items:center; flex-wrap:wrap; gap:6px;"><strong>Circle:</strong> ' + circlePill + '</div><div class="tags-row">' + tagPills + '</div><div style="margin-top:auto; padding-top:16px; display:flex; flex-wrap:wrap; gap:10px;"><button class="btn-primary" onclick="playTrack(0, true)">▶ Play All</button><button class="btn-outline" id="btnWorkGallery" data-rj="' + work.rjCode + '" onclick="openWorkGalleryModal()" style="display:' + (galleryCount > 0 ? 'inline-flex' : 'none') + ';">🖼️ Gallery (<span id="btnWorkGalleryCount">' + galleryCount + '</span>)</button><button class="btn-outline" data-rj="' + work.rjCode + '" onclick="addWorkToPlaylistAction(this.dataset.rj)">➕ Add Work to Playlist</button><button class="btn-outline" id="btnWorkRefresh" data-rj="' + work.rjCode + '" onclick="refreshSingleWork(this.dataset.rj, this)">🔄 Refresh</button><button class="btn-outline" data-rj="' + work.rjCode + '" onclick="deleteWorkItem(this.dataset.rj)">🗑️ Remove</button><button class="btn-outline" onclick="navBack()">← Back</button></div></div></div>';

      // 1. Physical Audio Tracklist Section
      html += '<h3 style="font-size:1.2rem; font-weight:700; margin-top:24px; margin-bottom:12px; display:flex; align-items:center; gap:8px;"><span>🎵 Audio Tracks (' + tracksList.length + ')</span></h3>';
      html += '<table class="tracks-table audio-tracks-table"><thead><tr><th style="width: 40px;">#</th><th>Track Title</th><th style="width: 120px;">Stream Format</th><th style="width: 160px; text-align:right;">Action</th></tr></thead><tbody>';

      tracksList.forEach(function(t, i) {
        let catBadge = '';
        if (t.category === 'freetalk' || /(?:フリートーク|free[\s_-]?talk|talk)/i.test(t.title)) {
          catBadge = '<span style="font-size:0.75rem; background:rgba(236,72,153,0.18); color:#f472b6; border:1px solid rgba(244,114,182,0.35); padding:2px 8px; border-radius:4px; font-weight:700; margin-right:6px;">🎙️ Free Talk</span>';
        } else if (t.category === 'bonus' || /(?:おまけ|bonus|特典)/i.test(t.title)) {
          catBadge = '<span style="font-size:0.75rem; background:rgba(234,179,8,0.18); color:#facc15; border:1px solid rgba(250,204,21,0.35); padding:2px 8px; border-radius:4px; font-weight:700; margin-right:6px;">🎁 Bonus</span>';
        } else if (tracksList.length > 1) {
          catBadge = '<span style="font-size:0.75rem; background:rgba(59,130,246,0.15); color:#60a5fa; border:1px solid rgba(96,165,250,0.3); padding:2px 8px; border-radius:4px; font-weight:700; margin-right:6px;">🎵 Main</span>';
        }
        const formatBadge = t.isHls ? '<span style="font-size:0.75rem; background:rgba(14,116,144,0.2); color:#38bdf8; border:1px solid rgba(56,189,248,0.3); padding:2px 8px; border-radius:4px; font-weight:700;">HLS Master</span>' : '<span style="font-size:0.75rem; background:rgba(255,255,255,0.06); color:#d1d5db; border:1px solid var(--border); padding:2px 8px; border-radius:4px; font-weight:700;">Direct MP3</span>';
        const durStr = t.duration ? (' <span style="color:var(--text-muted); font-size:0.8rem; font-weight:normal; margin-left:6px;">(' + formatTime(t.duration) + ')</span>') : '';
        html += '<tr class="track-row" id="track-row-' + i + '" data-idx="' + i + '" onclick="playTrack(parseInt(this.dataset.idx), true)"><td>' + t.id + '</td><td><div style="display:flex; align-items:center; flex-wrap:wrap; gap:4px;">' + catBadge + '<strong>' + t.title + '</strong>' + durStr + '</div></td><td>' + formatBadge + '</td><td style="text-align:right;"><div style="display:inline-flex; gap:6px;"><button class="btn-primary" style="padding: 4px 10px; font-size: 0.75rem;" data-idx="' + i + '" onclick="event.stopPropagation(); playTrack(parseInt(this.dataset.idx), true)">▶ Play</button><button class="btn-outline" style="padding: 4px 10px; font-size: 0.75rem;" data-idx="' + i + '" onclick="event.stopPropagation(); addTrackToPlaylistAction(parseInt(this.dataset.idx))">➕ Playlist</button></div></td></tr>';
      });
      html += '</tbody></table>';

      // 2. Chapters & Cue Points Section (temporarily hidden pending chapter alignment overhaul)
      if (false && chaptersList.length > 0) {
        const isMultiTrack = tracksList.length > 1;
        const trackColorThemes = [
          { border: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)', text: '#38bdf8' },
          { border: '#c084fc', bg: 'rgba(192, 132, 252, 0.12)', text: '#c084fc' },
          { border: '#34d399', bg: 'rgba(52, 211, 153, 0.12)', text: '#34d399' },
          { border: '#fb923c', bg: 'rgba(251, 146, 60, 0.12)', text: '#fb923c' },
          { border: '#f472b6', bg: 'rgba(244, 114, 182, 0.12)', text: '#f472b6' },
          { border: '#a3e635', bg: 'rgba(163, 230, 53, 0.12)', text: '#a3e635' }
        ];

        html += '<h3 style="font-size:1.2rem; font-weight:700; margin-top:36px; margin-bottom:8px; display:flex; align-items:center; gap:8px;"><span>📑 Chapters & Scene Timestamps (' + chaptersList.length + ')</span></h3>';
        html += '<p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:12px;">Click any timestamp or Jump button to seek the audio player directly to that scene cue point.' + (isMultiTrack ? ' Color indicators highlight which audio track section each scene belongs to.' : '') + '</p>';
        html += '<table class="tracks-table chapters-table"><thead><tr><th style="width: 40px;">#</th>' + (isMultiTrack ? '<th style="width: 120px;">Track Section</th>' : '') + '<th>Scene / Chapter Title</th><th style="width: 140px;">Timestamp Offset</th><th style="width: 160px; text-align:right;">Action</th></tr></thead><tbody>';

        chaptersList.forEach(function(c, i) {
          const startTime = c.startTime || 0;
          const trackIdx = c.trackIndex || 0;
          const timeStr = c.formattedTime || formatTime(startTime);
          const trkTheme = trackColorThemes[trackIdx % trackColorThemes.length];
          const rowStyle = isMultiTrack ? ' style="border-left: 3px solid ' + trkTheme.border + ';"' : '';
          const trkBadge = isMultiTrack 
            ? '<td><span class="tag-pill" style="font-size:0.75rem; padding: 2px 8px; border-radius: 4px; font-weight:700; background:' + trkTheme.bg + '; color:' + trkTheme.text + '; border: 1px solid ' + trkTheme.border + '; display:inline-flex; align-items:center; gap:4px;">🎵 Track ' + (trackIdx + 1) + '</span></td>'
            : '';

          let cCatBadge = '';
          if (c.category === 'freetalk' || /(?:フリートーク|free[\s_-]?talk|talk)/i.test(c.title)) {
            cCatBadge = '<span style="font-size:0.7rem; background:rgba(236,72,153,0.18); color:#f472b6; border:1px solid rgba(244,114,182,0.35); padding:1px 6px; border-radius:4px; font-weight:700; margin-right:4px;">🎙️ Talk</span>';
          } else if (c.category === 'bonus' || /(?:おまけ|bonus|特典)/i.test(c.title)) {
            cCatBadge = '<span style="font-size:0.7rem; background:rgba(234,179,8,0.18); color:#facc15; border:1px solid rgba(250,204,21,0.35); padding:1px 6px; border-radius:4px; font-weight:700; margin-right:4px;">🎁 Bonus</span>';
          }

          html += '<tr class="chapter-row" id="chapter-row-' + i + '" data-idx="' + i + '" data-start="' + startTime + '" data-track="' + trackIdx + '"' + rowStyle + ' onclick="jumpToChapter(' + startTime + ', ' + trackIdx + ')">';
          html += '<td>' + (c.id || (i + 1)) + '</td>';
          if (isMultiTrack) html += trkBadge;
          html += '<td><div style="display:flex; align-items:center; flex-wrap:wrap; gap:4px;">' + cCatBadge + '<strong>' + c.title + '</strong>' + (c.duration ? (' <span style="color:var(--text-muted); font-size:0.75rem; font-weight:normal; margin-left:4px;">(' + formatTime(c.duration) + ')</span>') : '') + '</div></td>';
          html += '<td><button class="timestamp-btn" onclick="event.stopPropagation(); jumpToChapter(' + startTime + ', ' + trackIdx + ')" title="Jump to ' + timeStr + '">⏱️ ' + timeStr + '</button></td>';
          html += '<td style="text-align:right;"><div style="display:inline-flex; gap:6px;"><button class="btn-primary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="event.stopPropagation(); jumpToChapter(' + startTime + ', ' + trackIdx + ')">▶ Jump</button><button class="btn-outline" style="padding: 4px 10px; font-size: 0.75rem;" data-idx="' + i + '" onclick="event.stopPropagation(); addChapterToPlaylistAction(parseInt(this.dataset.idx))">➕ Playlist</button></div></td>';
          html += '</tr>';
        });
        html += '</tbody></table>';
      }

      container.innerHTML = html;
    }

    const workAutoRefreshedInSession = new Set();

    async function autoRefreshWorkDetail(rjCode) {
      const cleanKey = normRj(rjCode);
      if (workAutoRefreshedInSession.has(cleanKey)) return; // Only auto-refresh once per browser session
      workAutoRefreshedInSession.add(cleanKey);

      await refreshSingleWork(rjCode, null, true);
    }

    async function loadWorkDetail(rjCode) {
      currentView = 'work-detail';
      window.location.hash = '#/work/' + encodeURIComponent(rjCode);
      const container = document.getElementById('viewContainer');
      let work = allWorks.find(function(w) { return w.rjCode === rjCode || normRj(w.rjCode) === normRj(rjCode); });
      if (!work && currentWork && (currentWork.rjCode === rjCode || normRj(currentWork.rjCode) === normRj(rjCode))) {
        work = currentWork;
      }
      if (!work) {
        try {
          const res = await apiFetch('/api/library?q=' + encodeURIComponent(rjCode));
          const list = await res.json();
          work = Array.isArray(list) ? list[0] : null;
          if (work && !allWorks.some(w => normRj(w.rjCode) === normRj(work.rjCode))) {
            allWorks.push(work);
          }
        } catch (e) {}
      }
      if (!work) { container.innerHTML = '<div style="padding:2rem;">Work not found</div>'; return; }
      
      // Retain existing chapters/gallery if currentWork already had them
      if (currentWork && normRj(currentWork.rjCode) === normRj(work.rjCode)) {
        if (Array.isArray(currentWork.chapters) && currentWork.chapters.length > 0 && (!work.chapters || work.chapters.length <= 1)) {
          work.chapters = currentWork.chapters;
        }
        if (Array.isArray(currentWork.gallery) && currentWork.gallery.length > 0 && (!work.gallery || work.gallery.length === 0)) {
          work.gallery = currentWork.gallery;
        }
      }

      renderWorkDetailUI(work);

      const cleanKey = normRj(work.rjCode);
      if (!workAutoRefreshedInSession.has(cleanKey)) {
        // Auto-refresh tracks & metadata on first visit in session, triggering the refresh button's visual progress
        autoRefreshWorkDetail(work.rjCode);
      } else {
        // Instantly check and fetch rich chapters/gallery in background if already refreshed in session
        fetchChaptersLazy(work.rjCode);
      }
    }

    let currentLightboxGallery = [];
    let currentLightboxIndex = 0;
    let galleryViewMode = (typeof window !== 'undefined' && window.innerWidth <= 768) ? 'strip' : 'grid';

    function toggleGalleryViewMode() {
      galleryViewMode = (galleryViewMode === 'strip' ? 'grid' : 'strip');
      updateGalleryViewModeUI();
    }

    function updateGalleryViewModeUI() {
      const grid = document.getElementById('workGalleryModalGrid');
      const btn = document.getElementById('btnGalleryViewMode');
      if (!grid) return;
      if (galleryViewMode === 'strip') {
        grid.classList.add('view-strip');
        grid.classList.remove('view-grid');
        if (btn) btn.innerHTML = '⊞ Grid View';
      } else {
        grid.classList.remove('view-strip');
        grid.classList.add('view-grid');
        if (btn) btn.innerHTML = '↔ Carousel View';
      }
    }

    function openWorkGalleryModal() {
      const modal = document.getElementById('workGalleryModal');
      const grid = document.getElementById('workGalleryModalGrid');
      const title = document.getElementById('workGalleryModalTitle');
      if (!modal || !grid) return;
      
      const gallery = (currentWork && Array.isArray(currentWork.gallery)) ? currentWork.gallery : [];
      if (title && currentWork) {
        title.innerHTML = '🖼️ Gallery: ' + currentWork.title + ' (' + gallery.length + ')';
      }

      if (window.innerWidth <= 768) {
        galleryViewMode = 'strip';
      }
      updateGalleryViewModeUI();
      
      if (gallery.length === 0) {
        grid.innerHTML = '<div style="color:var(--text-muted); text-align:center; padding:30px; width:100%;">No illustrations or bonus artwork found for this work.</div>';
      } else {
        let html = '';
        gallery.forEach(function(g, gi) {
          const cap = (g.title || ('Artwork #' + (gi + 1))).replace(/'/g, "\\'");
          const pUrl = g.proxyUrl || g.url;
          const label = (g.title ? g.title : ('Page #' + (gi + 1))) + ' (' + (gi + 1) + '/' + gallery.length + ')';
          html += '<div class="gallery-card" data-idx="' + gi + '" onclick="openLightboxModal(null, null, null, parseInt(this.dataset.idx))">';
          html += '<div class="gallery-thumb-wrap"><img class="gallery-thumb" src="' + pUrl + '" loading="lazy" onerror="handleImgError(this)"></div>';
          html += '<div class="gallery-card-title" title="' + (g.title || '') + '">' + label + '</div>';
          html += '</div>';
        });
        grid.innerHTML = html;
        grid.scrollLeft = 0;
      }
      modal.style.display = 'flex';
    }

    function closeWorkGalleryModal() {
      const modal = document.getElementById('workGalleryModal');
      if (modal) modal.style.display = 'none';
    }

    function openLightboxModal(imgUrl, caption, galleryList = null, index = 0) {
      const modal = document.getElementById('imageLightboxModal');
      if (!modal) return;

      if (Array.isArray(galleryList) && galleryList.length > 0) {
        currentLightboxGallery = galleryList;
        currentLightboxIndex = (index >= 0 && index < galleryList.length) ? index : 0;
      } else if (currentWork && Array.isArray(currentWork.gallery) && currentWork.gallery.length > 0) {
        currentLightboxGallery = currentWork.gallery;
        if (imgUrl) {
          const foundIdx = currentLightboxGallery.findIndex(g => (g.proxyUrl === imgUrl || g.url === imgUrl));
          currentLightboxIndex = foundIdx !== -1 ? foundIdx : 0;
        } else {
          currentLightboxIndex = (index >= 0 && index < currentLightboxGallery.length) ? index : 0;
        }
      } else if (imgUrl) {
        currentLightboxGallery = [{ url: imgUrl, proxyUrl: imgUrl, title: caption || '' }];
        currentLightboxIndex = 0;
      } else {
        return;
      }

      renderLightboxCurrent();
      modal.style.display = 'flex';
    }

    function renderLightboxCurrent() {
      const img = document.getElementById('lightboxImg');
      const cap = document.getElementById('lightboxCaption');
      const prevBtn = document.getElementById('lightboxPrevBtn');
      const nextBtn = document.getElementById('lightboxNextBtn');
      if (!img || currentLightboxGallery.length === 0) return;

      const item = currentLightboxGallery[currentLightboxIndex];
      if (!item) return;

      img.src = item.proxyUrl || item.url || '';
      const total = currentLightboxGallery.length;
      const titleText = item.title || ('Artwork #' + (currentLightboxIndex + 1));
      if (cap) {
        cap.innerText = total > 1 ? '[' + (currentLightboxIndex + 1) + ' / ' + total + '] ' + titleText : titleText;
      }
      if (prevBtn) prevBtn.style.display = total > 1 ? 'flex' : 'none';
      if (nextBtn) nextBtn.style.display = total > 1 ? 'flex' : 'none';
    }

    function navLightbox(direction) {
      if (!currentLightboxGallery || currentLightboxGallery.length <= 1) return;
      currentLightboxIndex = (currentLightboxIndex + direction + currentLightboxGallery.length) % currentLightboxGallery.length;
      renderLightboxCurrent();
    }

    function closeLightboxModal() {
      const modal = document.getElementById('imageLightboxModal');
      const img = document.getElementById('lightboxImg');
      if (modal) modal.style.display = 'none';
      if (img) img.src = '';
    }

    window.jumpToChapter = function(startTime, trackIdx = 0) {
      startTime = Math.max(0, parseFloat(startTime) || 0);
      trackIdx = Math.max(0, parseInt(trackIdx, 10) || 0);

      const targetWork = (currentView === 'work-detail' && currentWork) ? currentWork : (currentPlayingWork || currentWork);
      if (!targetWork) return;
      if (!targetWork.tracks || targetWork.tracks.length === 0) return;

      const numTracks = targetWork.tracks.length;
      const safeTrackIdx = (trackIdx < numTracks) ? trackIdx : (targetWork.hasHls ? 0 : Math.min(trackIdx, numTracks - 1));

      playTrack(safeTrackIdx, true, targetWork, startTime);

      highlightActiveChapter(startTime, safeTrackIdx);
      const timeStr = formatTime(startTime);
      const currTimeEl = document.getElementById('currTime');
      const popupCurrTimeEl = document.getElementById('popupCurrTime');
      if (currTimeEl) currTimeEl.innerText = timeStr;
      if (popupCurrTimeEl) popupCurrTimeEl.innerText = timeStr;
      if (currentPlayingWork) updatePopupPlayerUI();
    };

    function highlightActiveChapter(ct, trackIdx = -1) {
      const currentTrk = (trackIdx >= 0) ? trackIdx : currentTrackIndex;
      
      const tableRows = document.querySelectorAll('.chapters-table .chapter-row');
      let activeTableIdx = -1;
      tableRows.forEach((r, i) => {
        const st = parseFloat(r.dataset.start || 0);
        const trk = parseInt(r.dataset.track || 0, 10);
        if (trk === currentTrk && ct >= st) activeTableIdx = i;
      });
      tableRows.forEach((r, i) => {
        r.classList.toggle('active', i === activeTableIdx);
      });

      const drawerRows = document.querySelectorAll('#popupChaptersList .chapter-row');
      let activeDrawerIdx = -1;
      drawerRows.forEach((r, i) => {
        const st = parseFloat(r.dataset.start || 0);
        const trk = parseInt(r.dataset.track || 0, 10);
        if (trk === currentTrk && ct >= st) activeDrawerIdx = i;
      });
      drawerRows.forEach((r, i) => {
        r.classList.toggle('active', i === activeDrawerIdx);
      });
    }

    function addChapterToPlaylistAction(idx) {
      if (!currentWork) return;
      const c = (currentWorkChapters && currentWorkChapters[idx]) ? currentWorkChapters[idx] : null;
      if (!c) return;
      const track = (currentWork.tracks && currentWork.tracks[c.trackIndex || 0]) || (currentWork.tracks && currentWork.tracks[0]) || {};
      openAddToPlaylistModal({
        rjCode: currentWork.rjCode,
        trackId: c.id || (idx + 1),
        title: c.title,
        workTitle: currentWork.title,
        startTime: c.startTime || 0,
        streamUrl: track.streamUrl,
        isHls: track.isHls,
        poster: currentWork.coverUrl,
        cv: currentWork.cv || ''
      });
    }

    function addWorkToPlaylistAction(rj) {
      let work = currentWork;
      if (!work || (rj && normRj(work.rjCode) !== normRj(rj))) {
        work = (allWorks || []).find(w => normRj(w.rjCode) === normRj(rj)) || work;
      }
      if (!work && rj) {
        work = { rjCode: rj, title: rj, coverUrl: '' };
      }
      if (!work) return;
      openAddToPlaylistModal({
        rjCode: work.rjCode,
        title: work.title,
        workTitle: work.title,
        poster: work.coverUrl,
        cv: work.cv || '',
        isWork: true
      });
    }

    function addTrackToPlaylistAction(idx) {
      if (!currentWork || !currentWork.tracks[idx]) return;
      const t = currentWork.tracks[idx];
      openAddToPlaylistModal({
        rjCode: currentWork.rjCode,
        trackId: t.id,
        title: t.title,
        workTitle: currentWork.title,
        startTime: t.startTime || 0,
        streamUrl: t.streamUrl,
        isHls: t.isHls,
        poster: currentWork.coverUrl,
        cv: currentWork.cv || ''
      });
    }

    async function loadWishlist() {
      updatePageTitle('Wishlist');
      const container = document.getElementById('viewContainer');
      if (!isAdmin) {
        container.innerHTML = renderLockedState('Wishlist Locked', 'Unlock admin access to view and manage wishlisted works.');
        return;
      }
      container.innerHTML = '<div style="text-align:center; padding: 3rem; color: var(--text-muted);">Loading Wishlist...</div>';
      try {
        const wishlist = await apiFetchJson('/api/wishlist');
        const list = Array.isArray(wishlist) ? wishlist : [];
        updateWishlistBadge(list.length);

        let html = '<div class="section-header">';
        html += '<div><h1 class="section-title">📋 Wishlist & Pending Ingestion (' + list.length + ')</h1>';
        html += '<p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">Works that were skipped during single/batch import (e.g. pending crawler or audio stream on CDN) are kept here for quick re-import.</p></div>';
        html += '<div style="display:flex; gap:10px; flex-wrap:wrap;">';
        if (list.length > 0) {
          html += '<button class="btn-primary" id="btnRetryAllWishlist" onclick="retryAllWishlist()">🔄 Re-try All Ingestion</button>';
          html += '<button class="btn-outline" onclick="clearAllWishlist()">🗑️ Clear Wishlist</button>';
        }
        html += '<button class="btn-outline" onclick="addManualWishlist()">➕ Add RJ to Wishlist</button>';
        html += '</div></div>';

        if (list.length === 0) {
          html += '<div style="padding: 4rem 2rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border);">';
          html += '<div style="font-size: 3rem; margin-bottom: 12px;">📋</div>';
          html += '<h3 style="font-size: 1.15rem; color: #fff; font-weight: 700; margin-bottom: 6px;">Your Wishlist is Empty</h3>';
          html += '<p style="max-width: 480px; margin: 0 auto 20px; font-size: 0.9rem;">When you import works via Single Add or Batch Import that have pending audio or metadata, they will automatically appear here.</p>';
          html += '<div style="display:flex; gap:10px; justify-content:center;"><button class="btn-primary" onclick="openImportModal()">📥 Batch Import Works</button><button class="btn-outline" onclick="quickAddRj()">+ Add RJ Code</button></div>';
          html += '</div>';
        } else {
          html += '<table class="tracks-table"><thead><tr><th style="width: 40px;">#</th><th style="width: 50px;">Art</th><th>RJ Code & Title</th><th>Circle / CV</th><th>Reason / Status</th><th style="width: 140px;">Date Added</th><th style="width: 160px; text-align:right;">Actions</th></tr></thead><tbody>';
          list.forEach((item, idx) => {
            const displayCover = getDisplayCover(item);
            const cover = displayCover.coverUrl || ('/image-proxy?rj=' + item.rjCode);
            const dateStr = item.addedAt ? new Date(item.addedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
            html += '<tr class="wishlist-row" id="wishlist-row-' + item.rjCode + '">';
            html += '<td>' + (idx + 1) + '</td>';
            html += '<td><img src="' + cover + '" data-rj="' + item.rjCode + '" onerror="handleImgError(this)" style="width:36px; height:36px; border-radius:6px; object-fit:cover;"></td>';
            html += '<td><div style="font-weight:700;"><span class="card-rj" style="font-size:0.75rem; padding:1px 6px; margin-right:6px;">' + item.rjCode + '</span>' + item.title + '</div></td>';
            html += '<td><div style="color:#38bdf8; font-size:0.85rem;">' + (item.cv || '—') + '</div><div style="color:var(--text-muted); font-size:0.75rem;">' + (item.circle || '—') + '</div></td>';
            html += '<td><span style="font-size:0.75rem; background:rgba(245,158,11,0.15); color:#f59e0b; border:1px solid rgba(245,158,11,0.3); padding:2px 8px; border-radius:4px; font-weight:700;">⚠️ ' + (item.reason || 'Audio stream pending') + '</span></td>';
            html += '<td style="color:var(--text-muted); font-size:0.8rem;">' + dateStr + '</td>';
            html += '<td style="text-align:right;"><div style="display:inline-flex; gap:6px;"><button class="btn-primary" style="padding: 4px 10px; font-size: 0.75rem;" id="btn-retry-' + item.rjCode + '" data-rj="' + item.rjCode + '" onclick="retryWishlistItem(this.dataset.rj)">🔄 Re-try</button><button class="btn-outline" style="padding: 4px 8px; font-size: 0.75rem;" data-rj="' + item.rjCode + '" onclick="deleteWishlistItem(this.dataset.rj)">🗑️</button></div></td>';
            html += '</tr>';
          });
          html += '</tbody></table>';
        }
        container.innerHTML = html;
      } catch (e) {
        container.innerHTML = '<div style="color:#ff3366; padding:2rem;">Error: ' + (e.message || '').replace(/</g, '&lt;') + '</div>';
      }
    }

    async function retryWishlistItem(rjCode) {
      if (!rjCode) return;
      if (!isAdmin) {
        openAdminModal('Please unlock Admin access first to re-try works.');
        return;
      }
      const btn = document.getElementById('btn-retry-' + rjCode);
      if (btn) {
        btn.innerText = '⏳ Retrying...';
        btn.disabled = true;
      }
      showToast('🔄 Retrying ingestion for ' + rjCode + '...');
      await executeBatchImportRjList([rjCode], 'Retry ' + rjCode, { keepModalOpen: false });
    }

    async function retryAllWishlist() {
      if (!isAdmin) {
        openAdminModal('Please unlock Admin access first to re-try works.');
        return;
      }
      const btn = document.getElementById('btnRetryAllWishlist');
      if (btn) {
        btn.innerText = '⏳ Retrying All...';
        btn.disabled = true;
      }
      try {
        const list = await apiFetchJson('/api/wishlist');
        if (!Array.isArray(list) || list.length === 0) {
          alert('Wishlist is currently empty.');
          if (btn) { btn.innerText = '🔄 Re-try All Ingestion'; btn.disabled = false; }
          return;
        }
        const rjCodes = list.map(x => x.rjCode).filter(Boolean);
        if (rjCodes.length === 0) {
          alert('No valid RJ codes found in wishlist.');
          if (btn) { btn.innerText = '🔄 Re-try All Ingestion'; btn.disabled = false; }
          return;
        }
        showToast('🔄 Retrying ingestion for ' + rjCodes.length + ' wishlisted works...');
        await executeBatchImportRjList(rjCodes, 'Wishlist Ingestion (' + rjCodes.length + ' works)', { keepModalOpen: false });
      } catch (e) {
        alert('Failed to load wishlist for retry: ' + e.message);
      } finally {
        if (btn) {
          btn.innerText = '🔄 Re-try All Ingestion';
          btn.disabled = false;
        }
      }
    }

    async function addManualWishlist() {
      const rj = prompt('Enter RJ/VJ/BJ Code to save to Wishlist (e.g. RJ01078356, BJ01267551):');
      if (!rj) return;
      const match = rj.match(/(?:RJ|VJ|BJ)\d+/i);
      if (!match) { alert('Invalid work code format.'); return; }
      try {
        const data = await apiFetchJson('/api/wishlist', {
          method: 'POST',
          body: JSON.stringify({ rjCode: match[0].toUpperCase(), reason: 'Manually added to wishlist' })
        });
        if (data.alreadyInLibrary) {
          alert('ℹ️ ' + match[0].toUpperCase() + ' is already in your Library!');
        } else {
          updateWishlistBadge();
          loadWishlist();
        }
      } catch (e) { alert('Error: ' + e.message); }
    }

    async function deleteWishlistItem(rjCode) {
      if (!confirm('Remove ' + rjCode + ' from wishlist?')) return;
      try {
        await apiFetch('/api/wishlist/' + encodeURIComponent(rjCode), { method: 'DELETE' });
        updateWishlistBadge();
        loadWishlist();
      } catch(e) { alert('Error: ' + e.message); }
    }

    async function clearAllWishlist() {
      if (!confirm('Are you sure you want to clear all items from wishlist?')) return;
      try {
        await apiFetch('/api/wishlist/CLEAR_ALL', { method: 'DELETE' });
        updateWishlistBadge();
        loadWishlist();
      } catch(e) { alert('Error: ' + e.message); }
    }

    async function updateWishlistBadge(count = null) {
      const badge = document.getElementById('wishlistCountBadge');
      if (!badge) return;
      if (count !== null) {
        badge.innerText = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
        return;
      }
      if (!isAdmin) {
        badge.style.display = 'none';
        return;
      }
      try {
        const list = await apiFetchJson('/api/wishlist');
        const c = Array.isArray(list) ? list.length : 0;
        badge.innerText = c;
        badge.style.display = c > 0 ? 'inline-block' : 'none';
      } catch(e) {}
    }

    async function loadGenres() {
      updatePageTitle('Genres');
      const container = document.getElementById('viewContainer');
      if (!isAdmin) {
        container.innerHTML = renderLockedState('Genres & Tags Locked', 'Unlock admin access to browse genres and tags.');
        return;
      }
      container.innerHTML = '<div style="text-align:center; padding: 3rem; color: var(--text-muted);">Loading genres...</div>';
      try {
        const data = await apiFetchJson('/api/tags');
        const tags = Array.isArray(data) ? data : (data.tags || []);
        if (data && data.tagDict) {
          window.tagDict = Object.assign({}, window.BASE_TAG_DICT || {}, window.tagDict || {}, data.tagDict);
        }
        let html = '<div class="section-header"><h1 class="section-title">🏷️ Genres & Tags</h1></div>';
        const filteredTags = tags.filter(function(t) {
          if ((contentMode === 'PSFW' || contentMode === 'SFW') && isTagNsfw(t.name)) return false;
          const entry = getTagEntry(t.name);
          return !(entry && entry.isCV);
        });
        if (filteredTags.length === 0) {
          html += '<div style="padding: 3.5rem 2rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border);"><div style="font-size: 2.5rem; margin-bottom: 8px;">🏷️</div><p style="font-weight: 600; margin-bottom: 4px;">No Genres or Tags Available</p><p style="font-size: 0.85rem;">' + (contentMode !== 'NSFW' ? 'Tags may be hidden by the active SFW / PSFW filter.' : 'Add works to your library to populate genres.') + '</p></div>';
        } else {
          html += '<div class="tag-cloud">';
          filteredTags.forEach(function(t) {
            html += '<a href="#/genre/' + encodeURIComponent(t.name) + '" class="tag-cloud-item" data-tag="' + t.name.replace(/"/g, '&quot;') + '" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); navGenre(this.dataset.tag); }" style="text-decoration:none; color:inherit;"><span>' + formatTag(t.name) + '</span><span class="tag-count">' + t.count + ' works</span></a>';
          });
          html += '</div>';
        }
        container.innerHTML = html;
      } catch(e) {
        container.innerHTML = '<div style="color:#ff3366; padding:2rem; text-align:center;">Failed to load genres: ' + (e.message || '').replace(/</g, '&lt;') + '</div>';
      }
    }

    async function loadArtists() {
      updatePageTitle('Artists');
      const container = document.getElementById('viewContainer');
      if (!isAdmin) {
        container.innerHTML = renderLockedState('Voice Actors Locked', 'Unlock admin access to browse voice actors.');
        return;
      }
      container.innerHTML = '<div style="text-align:center; padding: 3rem; color: var(--text-muted);">Loading voice actors...</div>';
      try {
        if (!window._tagDictLoaded) {
          try {
            const tagData = await apiFetchJson('/api/tags');
            if (tagData && tagData.tagDict) {
              window.tagDict = Object.assign({}, window.BASE_TAG_DICT || {}, window.tagDict || {}, tagData.tagDict);
              window._tagDictLoaded = true;
            }
          } catch(e) {}
        }
        const artists = await apiFetchJson('/api/artists');
        const list = Array.isArray(artists) ? artists : [];
        let html = '<div class="section-header"><h1 class="section-title">🎙️ Voice Actors (CV)</h1></div>';
        if (list.length === 0) {
          html += '<div style="padding: 3.5rem 2rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border);"><div style="font-size: 2.5rem; margin-bottom: 8px;">🎙️</div><p style="font-weight: 600; margin-bottom: 4px;">No Voice Actors Found</p><p style="font-size: 0.85rem;">Works with voice actor metadata will automatically populate this section.</p></div>';
        } else {
          html += '<div class="tag-cloud">';
          list.forEach(function(a) {
            html += '<a href="#/cv/' + encodeURIComponent(a.name) + '" class="tag-cloud-item" data-cv="' + a.name.replace(/"/g, '&quot;') + '" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); navCv(this.dataset.cv); }" style="text-decoration:none; color:inherit;"><span>' + formatCV(a.name) + '</span><span class="tag-count">' + a.count + ' works</span></a>';
          });
          html += '</div>';
        }
        container.innerHTML = html;
      } catch(e) {
        container.innerHTML = '<div style="color:#ff3366; padding:2rem; text-align:center;">Failed to load voice actors: ' + (e.message || '').replace(/</g, '&lt;') + '</div>';
      }
    }

    async function loadPlaylists() {
      updatePageTitle('Playlists');
      const container = document.getElementById('viewContainer');
      if (!isAdmin) {
        container.innerHTML = renderLockedState('Playlists Locked', 'Unlock admin access to view and manage playlists.');
        return;
      }
      try {
        const rawPlaylists = await apiFetchJson('/api/playlists');
        let playlists = Array.isArray(rawPlaylists) ? [...rawPlaylists] : [];

        if (!playlists.some(p => p.id === 'pl-favorites')) {
          playlists.unshift({ id: 'pl-favorites', name: '❤️ Favorites', description: 'Your favorited works & tracks', coverUrl: '', items: [] });
        }

        let html = '<div class="section-header"><h1 class="section-title">📜 Playlists (' + playlists.length + ')</h1><button class="btn-primary" style="font-size:0.85rem; padding:8px 16px;" onclick="openPlaylistModal()">➕ Create New Playlist</button></div>';

        if (playlists.length === 0) {
          html += '<div style="padding: 3.5rem 2rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border);"><div style="font-size: 2.5rem; margin-bottom: 8px;">📜</div><p style="margin-bottom: 16px; font-weight:600;">No playlists yet</p><button class="btn-primary" onclick="openPlaylistModal()">➕ Create Playlist</button></div>';
        } else {
          html += '<div class="works-grid mode-medium">';
          playlists.forEach(function(p) {
            let cover = p.coverUrl;
            let firstItem = p.items && p.items[0];
            let isDisguised = false;
            if (!cover && firstItem) {
              const display = getDisplayCover(firstItem);
              cover = display.coverUrl;
              isDisguised = display.isDisguised;
            } else if (cover) {
              const display = getDisplayCover({ rjCode: (firstItem && firstItem.rjCode) || p.id, coverUrl: cover });
              cover = display.coverUrl;
              isDisguised = display.isDisguised;
            } else {
              cover = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23181a24"/><text x="50%" y="50%" font-size="40" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle">📜</text></svg>';
            }
            const count = p.items ? p.items.length : 0;
            html += '<a class="work-card" href="#/playlist/' + encodeURIComponent(p.id) + '" data-pl="' + p.id + '" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); navPlaylist(this.dataset.pl); }">';
            html += '<div class="card-cover-wrapper"><img class="card-cover" src="' + cover + '" data-rj="' + ((firstItem && firstItem.rjCode) || '') + '" onerror="handleImgError(this)">' + (isDisguised ? '<div class="disguised-overlay"><span class="disguised-badge">🎭 Disguised SFW</span></div>' : '') + '</div>';
            html += '<div class="card-badge-row"><span class="card-rj">' + (p.id === 'pl-favorites' ? 'FAVORITES' : 'PLAYLIST') + '</span><span style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">' + count + ' tracks</span></div>';
            html += '<div class="card-title">' + p.name + '</div>';
            html += '<div class="card-sub">' + (p.description || 'Personal curated playlist') + '</div>';
            html += '</a>';
          });
          html += '</div>';
        }
        container.innerHTML = html;
      } catch(e) {}
    }

    function setPlaylistViewMode(mode, plId) {
      playlistViewMode = mode;
      try { localStorage.setItem('astreamer_pl_view_mode', mode); } catch(e) {}
      loadPlaylistDetail(plId);
    }

    function setPlaylistPage(page, plId) {
      playlistCurrentPage = page;
      loadPlaylistDetail(plId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function loadPlaylistDetail(plId) {
      try {
        const res = await apiFetch('/api/playlists');
        const playlists = await res.json();
        if (!Array.isArray(playlists)) return;
        const pl = playlists.find(function(p) { return p.id === plId; });
        if (!pl) return;
        currentPlaylist = pl;
        updatePageTitle(pl.name ? (pl.name.replace(/^[^\w\s\d]+/, '').trim() || pl.name) : 'Playlist');

        const container = document.getElementById('viewContainer');
        const items = pl.items || [];
        let cover = pl.coverUrl;
        let firstItem = items[0];
        if (!cover && firstItem) {
          cover = getDisplayCover(firstItem).coverUrl;
        } else if (cover) {
          cover = getDisplayCover({ rjCode: (firstItem && firstItem.rjCode) || pl.id, coverUrl: cover }).coverUrl;
        } else {
          cover = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23181a24"/><text x="50%" y="50%" font-size="40" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle">📜</text></svg>';
        }

        let html = '<div class="work-detail-banner"><img class="detail-cover" src="' + cover + '" id="playlistDetailCover" data-rj="' + ((firstItem && firstItem.rjCode) || '') + '" onerror="handleImgError(this)"><div class="detail-info"><span class="card-rj" style="width:fit-content; margin-bottom:8px;">' + (pl.id === 'pl-favorites' ? 'FAVORITES' : 'PLAYLIST') + '</span><h1 class="detail-title" id="playlistDetailTitle">' + pl.name + '</h1><div class="detail-meta" id="playlistDetailDesc">' + (pl.description || 'Custom audio playlist') + '</div><div class="detail-meta" id="playlistDetailCount"><strong>Total Tracks:</strong> ' + items.length + '</div><div style="margin-top:auto; padding-top:16px; display:flex; flex-wrap:wrap; gap:10px;">' + (items.length > 0 ? '<button class="btn-primary" id="playAllPlaylistBtn" data-pl="' + pl.id + '" onclick="playPlaylistItem(0, this.dataset.pl)">▶ Play All</button>' : '') + (pl.id !== 'pl-favorites' ? '<button class="btn-outline" data-pl="' + pl.id + '" onclick="deletePlaylistAction(this.dataset.pl)">🗑️ Delete Playlist</button>' : '') + '<button class="btn-outline" data-view="playlists" onclick="switchView(this.dataset.view)">← Back to Playlists</button></div></div></div>';

        html += '<div class="view-modes-bar">';
        html += '<div style="display:flex; align-items:center; gap:8px;"><span style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">VIEW:</span>';
        html += '<div class="view-mode-buttons">';
        html += '<button class="view-btn ' + (playlistViewMode === 'list' ? 'active' : '') + '" data-mode="list" data-pl="' + pl.id + '" onclick="setPlaylistViewMode(this.dataset.mode, this.dataset.pl)">📋 List</button>';
        html += '<button class="view-btn ' + (playlistViewMode === 'grid' ? 'active' : '') + '" data-mode="grid" data-pl="' + pl.id + '" onclick="setPlaylistViewMode(this.dataset.mode, this.dataset.pl)">🎴 Grid</button>';
        html += '</div></div>';
        html += '<div style="font-size:0.85rem; color:var(--text-muted); font-weight:700;">' + items.length + ' tracks in playlist</div>';
        html += '</div>';

        if (items.length === 0) {
          html += '<div style="padding:3rem; text-align:center; color:var(--text-muted); background:var(--bg-card); border-radius:12px; border:1px solid var(--border);">Playlist is empty. Add tracks from any work in your Library!</div>';
        } else if (playlistViewMode === 'grid') {
          html += '<div class="works-grid mode-medium">';
          items.forEach(function(item, index) {
            const itemDisplay = getDisplayCover(item);
            const itemPoster = itemDisplay.coverUrl || cover;
            const isRowActive = currentPlaylistItemIndex === index && currentPlayingWork && normRj(currentPlayingWork.rjCode) === normRj(item.rjCode);
            const cvDisplay = item.cv ? formatCV(item.cv) : '';
            html += '<a class="work-card playlist-card-row ' + (isRowActive ? 'active' : '') + '" href="#/work/' + (item.rjCode || '') + '" data-rj="' + (item.rjCode || '') + '" data-pl-idx="' + index + '" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); navWork(this.dataset.rj); }">';
            html += '<div class="card-cover-wrapper"><img class="card-cover" src="' + itemPoster + '" data-rj="' + (item.rjCode || '') + '" onerror="handleImgError(this)">' + (itemDisplay.isDisguised ? '<div class="disguised-overlay"><span class="disguised-badge">🎭 Disguised SFW</span></div>' : '') + '</div>';
            html += '<div class="card-badge-row"><span class="card-rj">' + (item.rjCode || '#' + (index + 1)) + '</span><div style="display:flex; gap:6px; align-items:center;"><button class="btn-primary" style="padding:2px 8px; font-size:0.75rem;" data-pl="' + pl.id + '" data-idx="' + index + '" onclick="event.stopPropagation(); event.preventDefault(); playPlaylistItem(parseInt(this.dataset.idx), this.dataset.pl)">▶ Play</button><span data-pl="' + pl.id + '" data-idx="' + index + '" onclick="event.stopPropagation(); event.preventDefault(); removePlaylistItem(this.dataset.pl, parseInt(this.dataset.idx))" title="Remove Track" style="cursor:pointer; font-size:0.9rem;">🗑️</span></div></div>';
            html += '<div class="card-title">' + item.title + '</div>';
            html += '<div class="card-sub">' + (item.workTitle || cvDisplay || 'Track ' + (index + 1)) + '</div>';
            html += '</a>';
          });
          html += '</div>';
        } else {
          html += '<table class="tracks-table playlist-tracks-table"><thead><tr><th style="width: 40px;">#</th><th style="width: 50px;">Art</th><th>Track Title</th><th>Work / RJ</th><th>CV</th><th style="width: 140px; text-align:right;">Actions</th></tr></thead><tbody>';
          items.forEach(function(item, index) {
            const itemDisplay = getDisplayCover(item);
            const itemPoster = itemDisplay.coverUrl || cover;
            const isRowActive = currentPlaylistItemIndex === index && currentPlayingWork && normRj(currentPlayingWork.rjCode) === normRj(item.rjCode);
            const workCvText = (item.workTitle || item.rjCode) + (item.cv ? ' • ' + formatCV(item.cv) : '');
            html += '<tr class="playlist-track-row ' + (isRowActive ? 'active' : '') + '" data-rj="' + (item.rjCode || '') + '" data-pl-idx="' + index + '" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); navWork(this.dataset.rj); }">';
            html += '<td>' + (index + 1) + '</td>';
            html += '<td><a href="#/work/' + (item.rjCode || '') + '" data-rj="' + (item.rjCode || '') + '" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); navWork(this.dataset.rj); }"><img src="' + itemPoster + '" data-rj="' + (item.rjCode || '') + '" onerror="handleImgError(this)" style="width:44px; height:44px; border-radius:8px; object-fit:cover;"></a></td>';
            html += '<td class="pl-track-title"><a href="#/work/' + (item.rjCode || '') + '" data-rj="' + (item.rjCode || '') + '" style="color:inherit; text-decoration:none;" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); navWork(this.dataset.rj); }"><strong>' + item.title + '</strong></a></td>';
            html += '<td class="pl-work-title" style="color:var(--text-muted);">' + workCvText + '</td>';
            html += '<td class="pl-cv-col" style="color:#38bdf8;">' + (item.cv ? formatCV(item.cv) : '—') + '</td>';
            html += '<td class="pl-actions-col" style="text-align:right;"><div style="display:inline-flex; gap:6px; align-items:center; justify-content:flex-end;"><button class="btn-primary" style="padding: 4px 10px; font-size: 0.75rem;" data-pl="' + pl.id + '" data-idx="' + index + '" onclick="event.stopPropagation(); playPlaylistItem(parseInt(this.dataset.idx), this.dataset.pl)">▶ Play</button><button class="btn-outline" style="padding: 4px 8px; font-size: 0.75rem;" title="Remove Track" data-pl="' + pl.id + '" data-idx="' + index + '" onclick="event.stopPropagation(); removePlaylistItem(this.dataset.pl, parseInt(this.dataset.idx))">🗑️</button></div></td>';
            html += '</tr>';
          });
          html += '</tbody></table>';
        }
        container.innerHTML = html;
      } catch (e) {}
    }

    function highlightActivePlaylistRows(index) {
      document.querySelectorAll('.playlist-track-row').forEach(function(r) {
        r.classList.toggle('active', parseInt(r.dataset.plIdx) === index);
      });
      document.querySelectorAll('.playlist-card-row').forEach(function(c) {
        c.classList.toggle('active', parseInt(c.dataset.plIdx) === index);
      });
    }

    async function removePlaylistItem(plId, index) {
      if (!confirm('Remove track from playlist?')) return;
      try {
        await apiFetch('/api/playlists/' + plId + '/items/' + index, { method: 'DELETE' });
        loadPlaylistDetail(plId);
      } catch (e) {}
    }

    async function deletePlaylistAction(plId) {
      if (!confirm('Are you sure you want to delete this playlist?')) return;
      try {
        await apiFetch('/api/playlists/' + plId, { method: 'DELETE' });
        switchView('playlists');
      } catch (e) {}
    }

    async function playPlaylistItem(index, plId) {
      try {
        const res = await apiFetch('/api/playlists');
        const playlists = await res.json();
        const pl = (Array.isArray(playlists) ? playlists : []).find(p => p.id === plId);
        if (!pl || !pl.items[index]) return;
        const item = pl.items[index];
        let work = allWorks.find(w => normRj(w.rjCode) === normRj(item.rjCode));
        if (!work) {
          try {
            const wRes = await apiFetch('/api/library?q=' + encodeURIComponent(item.rjCode));
            const list = await wRes.json();
            work = Array.isArray(list) ? list[0] : null;
          } catch(e) {}
        }
        if (work) {
          currentPlaylistItemIndex = index;
          highlightActivePlaylistRows(index);
          const targetTrackIdx = work.tracks.findIndex(t => t.id === item.trackId) >= 0 ? work.tracks.findIndex(t => t.id === item.trackId) : 0;
          const isAlreadyPlaying = currentPlayingWork && normRj(currentPlayingWork.rjCode) === normRj(work.rjCode) && currentTrackIndex === targetTrackIdx && !audio.paused;
          if (!isAlreadyPlaying) {
            playTrack(targetTrackIdx, true, work);
          }
        }
      } catch (e) {}
    }

    function setHistorySort(mode) {
      historySortMode = mode;
      try { localStorage.setItem('astreamer_history_sort', mode); } catch(e) {}
      loadHistory();
    }

    async function clearPlaybackHistory() {
      if (!confirm('Are you sure you want to clear your playback history?')) return;
      try { localStorage.removeItem('astreamer_play_history'); } catch(e) {}
      try { await apiFetch('/api/history', { method: 'DELETE' }); } catch(e) {}
      loadHistory();
    }

    function formatRelativeDate(isoStr) {
      try {
        const d = new Date(isoStr);
        if (isNaN(d.getTime())) return '';
        const now = new Date();
        const diffSecs = Math.floor((now - d) / 1000);
        if (diffSecs < 60) return 'Just now';
        if (diffSecs < 3600) return Math.floor(diffSecs / 60) + 'm ago';
        if (diffSecs < 86400) return Math.floor(diffSecs / 3600) + 'h ago';
        if (diffSecs < 604800) return Math.floor(diffSecs / 86400) + 'd ago';
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch(e) { return ''; }
    }

    async function loadHistory() {
      updatePageTitle('History');
      const container = document.getElementById('viewContainer');
      if (!isAdmin) {
        container.innerHTML = renderLockedState('History Locked', 'Unlock admin access to view playback history.');
        return;
      }

      let history = [];
      try {
        const res = await apiFetch('/api/history');
        if (res.ok) {
          history = await res.json();
          if (Array.isArray(history)) {
            try { localStorage.setItem('astreamer_play_history', JSON.stringify(history)); } catch(e) {}
          }
        }
      } catch(e) {}

      if (!Array.isArray(history) || history.length === 0) {
        try {
          history = JSON.parse(localStorage.getItem('astreamer_play_history') || '[]');
        } catch(e) { history = []; }
      }

      // Sorting
      const sorted = [...history];
      if (historySortMode === 'date-desc') {
        sorted.sort((a, b) => new Date(b.playedAt || 0) - new Date(a.playedAt || 0));
      } else if (historySortMode === 'date-asc') {
        sorted.sort((a, b) => new Date(a.playedAt || 0) - new Date(b.playedAt || 0));
      } else if (historySortMode === 'title-asc') {
        sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      } else if (historySortMode === 'rj-asc') {
        sorted.sort((a, b) => (a.rjCode || '').localeCompare(b.rjCode || ''));
      }

      let html = '<div class="section-header">';
      html += '<h1 class="section-title">🕒 Playback History (' + sorted.length + ')</h1>';
      if (sorted.length > 0) {
        html += '<button class="btn-outline" style="font-size:0.85rem; color:#ff3366; border-color:rgba(255,51,102,0.3);" onclick="clearPlaybackHistory()">🗑️ Clear History</button>';
      }
      html += '</div>';

      html += '<div class="view-modes-bar">';
      html += '<div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">';
      html += '<span style="font-size:0.82rem; color:var(--text-muted); font-weight:700;">SORT BY:</span>';
      html += '<div class="view-mode-buttons">';
      html += '<button class="view-btn ' + (historySortMode === 'date-desc' ? 'active' : '') + '" data-sort="date-desc" onclick="setHistorySort(this.dataset.sort)">⏳ Newest</button>';
      html += '<button class="view-btn ' + (historySortMode === 'date-asc' ? 'active' : '') + '" data-sort="date-asc" onclick="setHistorySort(this.dataset.sort)">⌛ Oldest</button>';
      html += '<button class="view-btn ' + (historySortMode === 'title-asc' ? 'active' : '') + '" data-sort="title-asc" onclick="setHistorySort(this.dataset.sort)">🔤 Title</button>';
      html += '<button class="view-btn ' + (historySortMode === 'rj-asc' ? 'active' : '') + '" data-sort="rj-asc" onclick="setHistorySort(this.dataset.sort)">🏷️ RJ Code</button>';
      html += '</div></div>';
      html += '<div style="font-size:0.8rem; color:var(--text-muted);">Cloudflare KV Synced • Up to 20 recently played</div>';
      html += '</div>';

      if (sorted.length === 0) {
        html += '<div style="padding: 4rem 2rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border);"><div style="font-size:2.5rem; margin-bottom:8px;">🎧</div><p style="font-weight:600; margin-bottom:6px;">No Playback History Yet</p><p style="font-size:0.85rem;">Play any track to sync your listening history across all devices!</p></div>';
        container.innerHTML = html;
        return;
      }

      html += '<table class="works-list-table history-list-table"><thead><tr><th style="width:50px;">Cover</th><th style="width:110px;">RJ Code</th><th>Work Title</th><th>Voice Actor / Circle</th><th style="width:140px;">Last Played</th><th style="width:90px; text-align:right;">Actions</th></tr></thead><tbody>';
      sorted.forEach(function(item) {
        const displayCover = getDisplayCover(item);
        const relTime = formatRelativeDate(item.playedAt);
        const fullDate = item.playedAt ? new Date(item.playedAt).toLocaleString() : '';
        const cvDisplay = formatCV(item.cv);
        const metaLine = (cvDisplay ? '<span style="color:#38bdf8; font-weight:600;">' + cvDisplay + '</span>' : '') + (cvDisplay && item.circle ? ' • ' : '') + (item.circle ? '<span>' + item.circle + '</span>' : '') + ' • <span class="card-rj" style="padding:1px 5px; font-size:0.7rem;">' + item.rjCode + '</span>';
        html += '<tr class="works-list-row" data-rj="' + item.rjCode + '" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); navWork(this.dataset.rj); }">';
        html += '<td class="w-col-cover"><a href="#/work/' + item.rjCode + '" data-rj="' + item.rjCode + '" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); navWork(this.dataset.rj); }"><img class="list-thumb" src="' + displayCover.coverUrl + '" data-rj="' + item.rjCode + '" onerror="handleImgError(this)"></a></td>';
        html += '<td class="w-col-rj"><a href="#/work/' + item.rjCode + '" data-rj="' + item.rjCode + '" class="card-rj" style="text-decoration:none; display:inline-block;" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); navWork(this.dataset.rj); }">' + item.rjCode + '</a></td>';
        html += '<td class="w-col-title"><a href="#/work/' + item.rjCode + '" data-rj="' + item.rjCode + '" style="color:inherit; text-decoration:none;" onclick="if(!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0){ event.preventDefault(); navWork(this.dataset.rj); }"><strong>' + item.title + '</strong>' + (item.trackTitle ? '<div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Track: ' + item.trackTitle + '</div>' : '') + '</a></td>';
        html += '<td class="w-col-meta"><div class="w-meta-inner">' + metaLine + '<span style="color:var(--text-muted); font-size:0.72rem; margin-left:4px;" title="' + fullDate + '">🕒 ' + relTime + '</span></div></td>';
        html += '<td class="w-col-date" style="color:var(--text-muted); font-size:0.8rem;" title="' + fullDate + '">🕒 ' + relTime + '</td>';
        html += '<td class="w-col-actions" style="text-align:right;"><button class="btn-outline" style="padding:3px 8px; font-size:0.75rem;" data-rj="' + item.rjCode + '" onclick="event.stopPropagation(); playWorkDirectly(this.dataset.rj)">▶ Play</button></td>';
        html += '</tr>';
      });
      html += '</tbody></table>';

      container.innerHTML = html;
    }

    function loadSettings() {
      updatePageTitle('Settings');
      const container = document.getElementById('viewContainer');
      let html = '<div class="section-header"><h1 class="section-title">⚙️ App Settings</h1></div>';
      
      // 🎨 Theme Accent Color Card (v2.0)
      html += '<div class="settings-card"><h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 6px;">🎨 Theme Accent Color (v2.0)</h3><p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px;">Customize your personal theme aesthetic across all playback controls, action buttons, and active tabs.</p>';
      html += '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px;">';
      for (const [key, t] of Object.entries(ACCENT_THEMES)) {
        const isSelected = (currentAccent === key);
        html += '<div class="accent-option-item" data-accent-key="' + key + '" onclick="setAccentTheme(this.dataset.accentKey)" style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: ' + (isSelected ? 'rgba(255,255,255,0.08)' : 'var(--bg-card)') + '; border: 1.5px solid ' + (isSelected ? t.hex : 'var(--border)') + '; border-radius: 10px; cursor: pointer; transition: all 0.15s;' + (isSelected ? 'box-shadow: 0 0 14px ' + t.glow + ';' : '') + '">';
        html += '<div style="width: 22px; height: 22px; border-radius: 50%; background: ' + t.hex + '; box-shadow: 0 0 8px ' + t.glow + '; flex-shrink: 0;"></div>';
        html += '<div style="font-size: 0.86rem; font-weight: ' + (isSelected ? '700' : '600') + '; color: ' + (isSelected ? '#fff' : 'var(--text-muted)') + ';">' + t.name + '</div>';
        if (isSelected) {
          html += '<span style="margin-left: auto; font-size: 0.85rem; color: ' + t.hex + '; font-weight: 800;">✓</span>';
        }
        html += '</div>';
      }
      html += '</div></div>';

      html += '<div class="settings-card"><h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 6px;">🛡️ Content Privacy & Disguise Mode</h3><p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 18px;">Control how adult (NSFW) cover art and tags are presented on your screen.</p>';
      html += '<div class="settings-option ' + (contentMode === 'NSFW' ? 'selected' : '') + '" data-mode="NSFW" onclick="setContentMode(this.dataset.mode)"><input type="radio" name="contentMode" value="NSFW" class="settings-radio" ' + (contentMode === 'NSFW' ? 'checked' : '') + '><div><div class="settings-label">🌶️ NSFW (Full Adult - Default)</div><div class="settings-desc">Show all original high-resolution cover arts, adult tags, and uncensored catalog.</div></div></div>';
      html += '<div class="settings-option ' + (contentMode === 'PSFW' ? 'selected' : '') + '" data-mode="PSFW" onclick="setContentMode(this.dataset.mode)"><input type="radio" name="contentMode" value="PSFW" class="settings-radio" ' + (contentMode === 'PSFW' ? 'checked' : '') + '><div><div class="settings-label">🎭 PSFW (Pseudo-SFW / Disguise Covers)</div><div class="settings-desc">Full audio remains playable, but adult cover arts are disguised with glowing stylized SFW artwork. (Press Esc to quickly toggle).</div></div></div>';
      html += '<div class="settings-option ' + (contentMode === 'SFW' ? 'selected' : '') + '" data-mode="SFW" onclick="setContentMode(this.dataset.mode)"><input type="radio" name="contentMode" value="SFW" class="settings-radio" ' + (contentMode === 'SFW' ? 'checked' : '') + '><div><div class="settings-label">🛡️ SFW (Strict Safe For Work)</div><div class="settings-desc">Hide adult works and NSFW tags from the library and tag cloud, while automatically disguising covers in playlists, history, and the music player.</div></div></div>';
      html += '</div>';


      html += '<div class="settings-card"><h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 6px;">🌐 AI Tag Translation & Dictionary Sync</h3><p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px;">Scan your library for untranslated Japanese tags and voice actor names, then translate them with OpenRouter AI (DeepSeek) to build your tri-part (Japanese | Rōmaji | English) dictionary.</p>';
      html += '<div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center;"><button class="btn-primary" id="btnUpdateTagTranslation" onclick="checkUntranslatedTags()">🌐 Update Tag Translations</button><button class="btn-primary" style="background: linear-gradient(135deg, #10b981, #059669); border-color: #059669;" id="btnClassifyTags" onclick="classifyLibraryTags()">🤖 Classify SFW/NSFW Tags</button><button class="btn-outline" style="border-color: rgba(167, 139, 250, 0.4); color: #c4b5fd;" onclick="rebootTagDictionary()">🔄 Reset & Wipe Stale Tag Cache</button><span id="tagTranslationStatus" style="font-size:0.85rem; color:#38bdf8; display:none;"></span></div></div>';

      html += '<div class="settings-card"><h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 6px;">🔄 Re-fetch & Update Metadata</h3><p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px;">Re-scan DLsite for all existing works to fix missing titles, circle names, and tags.</p>';
      html += '<div style="display:flex; gap:12px; align-items:center;"><button class="btn-primary" id="btnRefreshAll" onclick="refreshAllMetadata()">🔄 Re-Fetch All Metadata</button><span id="refreshStatus" style="font-size:0.85rem; color:#38bdf8; display:none;"></span></div></div>';

      html += '<div class="settings-card"><h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 6px;">💾 Library Data & Sync</h3><p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px;">Export your cached library and playlists as JSON or restore your local database to Cloudflare KV.</p>';
      html += '<div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center;"><button class="btn-primary" onclick="exportBackup()">📥 Export JSON Backup</button><input type="file" id="backupFileInput" accept=".json" style="display:none;" onchange="importBackupFile(event)"><button class="btn-outline" onclick="triggerBackupUpload()">📤 Restore / Upload Backup JSON</button></div></div>';

      html += '<div class="settings-card"><h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 6px;">🔑 Admin Authentication Session</h3><p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px;">Lock your session or switch admin credentials.</p>';
      html += '<button class="btn-outline" style="border-color: rgba(255,51,102,0.4); color: #ff3366;" onclick="toggleAdminModal()">🚪 Lock / Log Out Admin</button></div>';

      html += '<div class="settings-card"><h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 6px;">🚀 aStreamer v2.0 Milestone Release</h3><p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px;">Instant Batch Ingestion with Parallel Fast-Probing, On-Demand Lazy Audio Stream Extraction, Custom Accent Color Themes (Orange Default), and Streamlined Audio Controls.</p>';
      html += '<button class="btn-outline" onclick="openChangelogModal()">📜 View Version 2.0 Release Notes & Architecture</button></div>';

      container.innerHTML = html;
    }

    function openChangelogModal() { document.getElementById('changelogModal').style.display = 'flex'; }
    function closeChangelogModal() { document.getElementById('changelogModal').style.display = 'none'; }

    // Floating Corner Player Controls
    function openPopupPlayer() {
      if (!currentWork && allWorks.length > 0) {
        currentWork = allWorks[0];
        playTrack(0, false);
      }
      updatePopupPlayerUI();
      const el = document.getElementById('popupPlayerModal');
      if (el) el.style.display = 'flex';
      const playerBar = document.querySelector('.player-bar');
      if (playerBar) playerBar.style.display = 'none';
    }

    function closePopupPlayer() {
      const el = document.getElementById('popupPlayerModal');
      if (el) el.style.display = 'none';
      const playerBar = document.querySelector('.player-bar');
      if (playerBar) playerBar.style.display = 'flex';
    }

    function openPopupPlayerWithChapters() {
      openPopupPlayer();
      isChapterDrawerOpen = true;
      const listEl = document.getElementById('popupChaptersList');
      const chevEl = document.getElementById('popupChapterChevron');
      if (listEl) listEl.style.display = 'flex';
      if (chevEl) chevEl.innerText = '▲';
    }

    function togglePopupPlayer() {
      const el = document.getElementById('popupPlayerModal');
      if (el && el.style.display === 'flex') {
        closePopupPlayer();
      } else {
        openPopupPlayer();
      }
    }

    function toggleChapterDrawer() {
      isChapterDrawerOpen = !isChapterDrawerOpen;
      const listEl = document.getElementById('popupChaptersList');
      const chevEl = document.getElementById('popupChapterChevron');
      listEl.style.display = isChapterDrawerOpen ? 'flex' : 'none';
      chevEl.innerText = isChapterDrawerOpen ? '▲' : '▼';
    }

    function updatePopupPlayerUI() {
      const activeWork = currentPlayingWork || currentWork;
      if (!activeWork) return;
      const track = (activeWork.tracks && activeWork.tracks[currentTrackIndex]) || (activeWork.tracks && activeWork.tracks[0]);
      const display = getDisplayCover(activeWork);

      document.getElementById('popupTitle').innerText = track ? track.title : activeWork.title;
      document.getElementById('popupSub').innerText = (activeWork.rjCode || '') + ' • ' + (activeWork.circle || 'Circle N/A');
      const popupCover = document.getElementById('popupCover');
      if (popupCover) {
        popupCover.src = display.coverUrl;
        popupCover.setAttribute('data-rj', activeWork.rjCode || '');
      }
      document.getElementById('popupHlsBadge').innerText = (track && track.isHls) ? 'HLS Stream' : 'Direct Audio';
      document.getElementById('popupDisguisedBadge').style.display = display.isDisguised ? 'block' : 'none';
      document.getElementById('popupFavBtn').innerText = activeWork.favorite ? '❤️' : '🤍';

      // CV Badges in Popup
      const cvContainer = document.getElementById('popupCvRow');
      const activeWorkCV = getWorkCV(activeWork);
      if (activeWorkCV && activeWorkCV !== 'N/A') {
        const cvs = activeWorkCV.split(/[,、/&＋+;・\\n|]/).map(s => cleanCVName(s)).filter(Boolean);
        const uniqueCvs = Array.from(new Set(cvs));
        cvContainer.innerHTML = uniqueCvs.map(c => '<span class="tag-pill" style="font-size:0.75rem; background:rgba(56,189,248,0.15); color:#38bdf8; border-color:rgba(56,189,248,0.3); font-weight:700;" data-cv="' + c.replace(/"/g, '&quot;') + '" onclick="closePopupPlayer(); navCv(this.dataset.cv)">🎙️ ' + formatCV(c) + '</span>').join('');
      } else {
        cvContainer.innerHTML = '';
      }

      // Populate Chapter / Track Drawer (Separated)
      const tracks = (activeWork && activeWork.tracks) || [];
      let chapters = [];
      if (activeWork && Array.isArray(activeWork.chapters) && activeWork.chapters.length > 0) {
        chapters = activeWork.chapters;
      } else if (tracks.length > 0) {
        chapters = tracks.map((t, idx) => ({ id: t.id || (idx + 1), title: t.title, startTime: t.startTime || 0, formattedTime: t.formattedTime || formatTime(t.startTime || 0), trackIndex: idx }));
      }

      if (chapters.length > 0) {
        let maxDuration = 0;
        if (audio && audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
          maxDuration = audio.duration;
        } else if (tracks.length > 0 && tracks[0].duration > 0) {
          maxDuration = tracks[0].duration;
        }
        if (activeWork && activeWork.hasHls && maxDuration > 0) {
          chapters = chapters.filter(c => (c.startTime || 0) < maxDuration - 2);
        }
      }

      const drawerList = document.getElementById('popupChaptersList');
      drawerList.innerHTML = '';

      if (chapters.length > 0) {
        document.getElementById('popupChapterToggleLabel').innerText = '📑 Chapters (' + chapters.length + ')' + (tracks.length > 1 ? ' / 🎵 Tracks (' + tracks.length + ')' : '');

        const chapHeading = document.createElement('div');
        chapHeading.style.cssText = 'font-size:0.75rem; color:#38bdf8; font-weight:800; text-transform:uppercase; margin-bottom:4px; padding:2px 4px;';
        chapHeading.innerText = '📑 Chapters & Scenes';
        drawerList.appendChild(chapHeading);

        const trackColorThemes = [
          { border: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)', text: '#38bdf8' },
          { border: '#c084fc', bg: 'rgba(192, 132, 252, 0.12)', text: '#c084fc' },
          { border: '#34d399', bg: 'rgba(52, 211, 153, 0.12)', text: '#34d399' },
          { border: '#fb923c', bg: 'rgba(251, 146, 60, 0.12)', text: '#fb923c' },
          { border: '#f472b6', bg: 'rgba(244, 114, 182, 0.12)', text: '#f472b6' },
          { border: '#a3e635', bg: 'rgba(163, 230, 53, 0.12)', text: '#a3e635' }
        ];

        chapters.forEach((c, i) => {
          const trackIdx = c.trackIndex || 0;
          const trkTheme = trackColorThemes[trackIdx % trackColorThemes.length];
          const item = document.createElement('div');
          item.className = 'popup-chapter-item chapter-row';
          item.dataset.start = c.startTime || 0;
          item.dataset.track = trackIdx;
          if (tracks.length > 1) {
            item.style.borderLeft = '3px solid ' + trkTheme.border;
          }
          const trkTag = (tracks.length > 1) ? '<span style="font-size:0.7rem; font-weight:700; margin-right:6px; color:' + trkTheme.text + ';">[Track ' + (trackIdx + 1) + ']</span>' : '';
          item.innerHTML = '<span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + (c.id || (i+1)) + '. ' + trkTag + c.title + '</span><span style="color:#38bdf8; font-variant-numeric:tabular-nums; flex-shrink:0; margin-left:8px;">⏱️ ' + (c.formattedTime || '00:00') + '</span>';
          item.onclick = () => { jumpToChapter(c.startTime || 0, trackIdx); };
          drawerList.appendChild(item);
        });

        if (tracks.length > 1) {
          const trackHeading = document.createElement('div');
          trackHeading.style.cssText = 'font-size:0.75rem; color:var(--text-muted); font-weight:800; text-transform:uppercase; margin-top:8px; margin-bottom:4px; padding:4px 4px 2px; border-top:1px solid rgba(255,255,255,0.06);';
          trackHeading.innerText = '🎵 Audio Track Files';
          drawerList.appendChild(trackHeading);

          tracks.forEach((t, i) => {
            const item = document.createElement('div');
            item.className = 'popup-chapter-item' + (i === currentTrackIndex ? ' active' : '');
            item.innerHTML = '<span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + t.id + '. ' + t.title + '</span><span style="color:var(--text-muted); font-variant-numeric:tabular-nums; flex-shrink:0; margin-left:8px;">' + (t.formattedTime || '') + '</span>';
            item.onclick = () => { playTrack(i, true); updatePopupPlayerUI(); };
            drawerList.appendChild(item);
          });
        }
      } else {
        document.getElementById('popupChapterToggleLabel').innerText = '🎵 Tracklist (' + tracks.length + ')';
        tracks.forEach((t, i) => {
          const item = document.createElement('div');
          item.className = 'popup-chapter-item' + (i === currentTrackIndex ? ' active' : '');
          item.innerHTML = '<span>' + t.id + '. ' + t.title + '</span><span style="color:#38bdf8; font-variant-numeric:tabular-nums;">' + (t.formattedTime || '') + '</span>';
          item.onclick = () => { playTrack(i, true); updatePopupPlayerUI(); };
          drawerList.appendChild(item);
        });
      }
    }

    function jumpToCurrentWorkDetail() {
      if (!currentPlayingWork) return;
      closePopupPlayer();
      switchView('work-detail', currentPlayingWork.rjCode);
    }

    function addCurrentPlayingTrackToPlaylist() {
      if (!currentPlayingWork) return;
      const track = (currentPlayingWork.tracks && currentPlayingWork.tracks[currentTrackIndex]) || (currentPlayingWork.tracks && currentPlayingWork.tracks[0]) || {};
      openAddToPlaylistModal({
        rjCode: currentPlayingWork.rjCode,
        trackId: track.id || 1,
        title: track.title || currentPlayingWork.title,
        workTitle: currentPlayingWork.title,
        startTime: 0,
        streamUrl: track.streamUrl,
        isHls: track.isHls,
        poster: currentPlayingWork.coverUrl,
        cv: currentPlayingWork.cv || ''
      });
    }

    function toggleCurrentWorkFav() {
      if (!currentPlayingWork) return;
      toggleFav(currentPlayingWork.rjCode);
      document.getElementById('popupFavBtn').innerText = currentPlayingWork.favorite ? '❤️' : '🤍';
    }

    async function fetchChaptersLazy(rjCode, force = false, targetDur = 0) {
      if (!rjCode) return;
      if (force) {
        chapterFetchCache.delete(rjCode);
        chapterFetchCache.delete(normRj(rjCode));
      } else if (chapterFetchCache.has(rjCode) || chapterFetchCache.has(normRj(rjCode))) {
        return;
      }
      chapterFetchCache.add(rjCode);
      chapterFetchCache.add(normRj(rjCode));
      try {
        let apiUrl = '/api/library/chapters/' + encodeURIComponent(rjCode);
        const workItem = (allWorks && allWorks.find(w => normRj(w.rjCode) === normRj(rjCode))) || (currentPlayingWork && normRj(currentPlayingWork.rjCode) === normRj(rjCode) ? currentPlayingWork : currentWork);
        let reqDur = targetDur;
        if (reqDur <= 0) {
          if (audio && audio.duration && !isNaN(audio.duration) && audio.duration > 0 && currentPlayingWork && normRj(currentPlayingWork.rjCode) === normRj(rjCode)) {
            reqDur = Math.round(audio.duration);
          } else if (workItem && workItem.tracks && workItem.tracks[0] && workItem.tracks[0].duration > 0) {
            reqDur = Math.round(workItem.tracks[0].duration);
          }
        }
        if (reqDur > 0) {
          apiUrl += '?duration=' + reqDur;
        }
        const res = await apiFetch(apiUrl);
        const data = await res.json();
        if (data && data.success) {
          const target = allWorks.find(w => normRj(w.rjCode) === normRj(rjCode));
          let updatedUI = false;

          if (Array.isArray(data.chapters) && data.chapters.length > 0) {
            if (target) target.chapters = data.chapters;
            if (currentWork && normRj(currentWork.rjCode) === normRj(rjCode)) {
              currentWork.chapters = data.chapters;
              currentWorkChapters = data.chapters;
              updatedUI = true;
            }
            if (currentPlayingWork && normRj(currentPlayingWork.rjCode) === normRj(rjCode)) {
              currentPlayingWork.chapters = data.chapters;
              updatedUI = true;
            }
          }

          if (Array.isArray(data.audioTracks) && data.audioTracks.length > 0) {
            const hasOnlyFallback = (target && (!target.tracks || target.tracks.length <= 1 && (target.tracks[0]?.rawUrl?.includes('weeab0o.xyz') || target.hasHls)));
            if (hasOnlyFallback || (currentPlayingWork && normRj(currentPlayingWork.rjCode) === normRj(rjCode) && (!currentPlayingWork.tracks || currentPlayingWork.tracks.length <= 1))) {
              const mappedTracks = data.audioTracks.map((t, idx) => ({
                id: idx + 1,
                title: t.title || ('Track ' + (idx + 1)),
                duration: t.duration || 0,
                formattedTime: formatTime(t.duration || 0),
                startTime: 0,
                isHls: false,
                rawUrl: t.url,
                referer: 'https://www.asmr.one/',
                streamUrl: '/stream?url=' + encodeURIComponent(t.url) + '&referer=' + encodeURIComponent('https://www.asmr.one/'),
                poster: (target && target.coverUrl) || ''
              }));

              if (target) {
                target.tracks = mappedTracks;
                target.hasHls = false;
                target.totalTracks = mappedTracks.length;
              }
              if (currentWork && normRj(currentWork.rjCode) === normRj(rjCode)) {
                currentWork.tracks = mappedTracks;
                currentWork.hasHls = false;
                currentWork.totalTracks = mappedTracks.length;
                updatedUI = true;
              }
              if (currentPlayingWork && normRj(currentPlayingWork.rjCode) === normRj(rjCode)) {
                currentPlayingWork.tracks = mappedTracks;
                currentPlayingWork.hasHls = false;
                currentPlayingWork.totalTracks = mappedTracks.length;
                updatedUI = true;
                if (audio.paused || audio.currentTime === 0 || isNaN(audio.duration) || audio.duration === 0) {
                  playTrack(0, true, currentPlayingWork);
                }
              }
            }
          }

          if (Array.isArray(data.gallery)) {
            if (target) target.gallery = data.gallery;
            if (currentWork && normRj(currentWork.rjCode) === normRj(rjCode)) {
              currentWork.gallery = data.gallery;
              const gBtn = document.getElementById('btnWorkGallery');
              const gCount = document.getElementById('btnWorkGalleryCount');
              if (gBtn && gCount) {
                gCount.innerText = data.gallery.length;
                gBtn.style.display = data.gallery.length > 0 ? 'inline-flex' : 'none';
              }
              updatedUI = true;
            }
          }

          if (updatedUI) {
            if (currentView === 'work-detail' && currentWork && normRj(currentWork.rjCode) === normRj(rjCode)) {
              renderWorkDetailUI(currentWork);
            }
            if (currentPlayingWork && normRj(currentPlayingWork.rjCode) === normRj(rjCode)) {
              updatePopupPlayerUI();
            }
          }
          return data;
        }
        return data;
      } catch (e) {
        return null;
      }
    }

    let isRefreshRunning = false;
    let refreshShouldStop = false;

    function openRefreshProgressModal() {
      const modal = document.getElementById('refreshProgressModal');
      const closeBtn = document.getElementById('refreshModalCloseBtn');
      const doneBtn = document.getElementById('refreshModalDoneBtn');
      const stopBtn = document.getElementById('refreshModalStopBtn');
      const logBox = document.getElementById('refreshLogBox');
      
      if (modal) modal.style.display = 'flex';
      if (closeBtn) closeBtn.style.display = 'none';
      if (doneBtn) doneBtn.style.display = 'none';
      if (stopBtn) stopBtn.style.display = 'inline-block';
      if (logBox) logBox.innerHTML = '';
      
      updateRefreshProgress(0, 'Initializing metadata scan...', 'Scanning library...');
    }

    function closeRefreshProgressModal() {
      const modal = document.getElementById('refreshProgressModal');
      if (modal) modal.style.display = 'none';
    }

    function stopRefreshProgress() {
      refreshShouldStop = true;
      logRefreshProgress('⏹️ Stop requested. Finishing current batch before stopping...', 'warn');
    }

    function updateRefreshProgress(percent, stageText, statsText) {
      const bar = document.getElementById('refreshProgressBar');
      const pText = document.getElementById('refreshProgressPercent');
      const sText = document.getElementById('refreshProgressStage');
      const statEl = document.getElementById('refreshStatsText');

      if (bar) bar.style.width = Math.min(100, Math.max(0, percent)) + '%';
      if (pText) pText.textContent = Math.round(percent) + '%';
      if (sText && stageText) sText.textContent = stageText;
      if (statEl && statsText) statEl.textContent = statsText;
    }

    function logRefreshProgress(msg, type = 'info') {
      const logBox = document.getElementById('refreshLogBox');
      if (!logBox) return;
      const time = new Date().toLocaleTimeString();
      let color = '#cbd5e1';
      if (type === 'success' || msg.includes('✅') || msg.includes('🎉') || msg.includes('💾')) color = '#4ade80';
      else if (type === 'warn' || msg.includes('⚠️') || msg.includes('⏹️')) color = '#fbbf24';
      else if (type === 'error' || msg.includes('❌')) color = '#f87171';
      else if (msg.includes('🔍') || msg.includes('⏳') || msg.includes('🚀')) color = '#38bdf8';

      const line = document.createElement('div');
      line.style.color = color;
      line.style.marginBottom = '3px';
      line.textContent = '[' + time + '] ' + msg;
      logBox.appendChild(line);
      logBox.scrollTop = logBox.scrollHeight;
    }

    function finishRefreshProgress(total, updated, unchanged, failed, kvWrites) {
      const closeBtn = document.getElementById('refreshModalCloseBtn');
      const doneBtn = document.getElementById('refreshModalDoneBtn');
      const stopBtn = document.getElementById('refreshModalStopBtn');
      if (closeBtn) closeBtn.style.display = 'inline-block';
      if (doneBtn) doneBtn.style.display = 'inline-block';
      if (stopBtn) stopBtn.style.display = 'none';
      
      updateRefreshProgress(100, '✅ Scan Completed', 'Updated: ' + updated + ' • Unchanged: ' + unchanged + ' • KV Writes: ' + kvWrites);
      if (currentView === 'library') loadLibrary(currentFilterParams);
      else if (currentView === 'settings') loadSettings();
    }

    async function refreshAllMetadata() {
      if (isRefreshRunning) return;
      if (!confirm('⚠️ Are you sure you want to scan and refresh metadata for all works in your library?\\n\\nThis will run in safe chunks of 15 works with real-time progress and periodic saves every ~90 works (only modified works are saved to KV).')) {
        return;
      }

      if (window.Notification && Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }

      isRefreshRunning = true;
      refreshShouldStop = false;
      openRefreshProgressModal();

      try {
        logRefreshProgress('🔍 Loading library collection from server...');
        const res = await apiFetch('/api/library');
        const works = await res.json();
        if (!Array.isArray(works) || works.length === 0) {
          logRefreshProgress('⚠️ Library is empty. Nothing to refresh.', 'warn');
          finishRefreshProgress(0, 0, 0, 0, 0);
          isRefreshRunning = false;
          return;
        }

        const allRjs = works.map(w => w.rjCode);
        const totalWorks = allRjs.length;
        const CHUNK_SIZE = 15;
        const FLUSH_INTERVAL_BATCHES = 6; // Save to KV every 6 batches (~90 works)
        const totalChunks = Math.ceil(totalWorks / CHUNK_SIZE);

        logRefreshProgress('🚀 Found ' + totalWorks + ' works. Splitting into ' + totalChunks + ' safe batches (' + CHUNK_SIZE + ' works/batch, auto-saving every ~90 works)...');

        let totalUpdated = 0;
        let totalUnchanged = 0;
        let totalFailed = 0;
        let totalKvWrites = 0;
        let pendingFlushWorks = {};

        for (let i = 0; i < totalChunks; i++) {
          if (refreshShouldStop) {
            logRefreshProgress('⏹️ Stop requested. Saving accumulated updates to KV...', 'warn');
            break;
          }

          const chunk = allRjs.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
          const chunkNum = i + 1;
          const processedSoFar = Math.min(totalWorks, (i + 1) * CHUNK_SIZE);
          const percent = Math.min(100, (processedSoFar / totalWorks) * 100);

          document.title = '[' + Math.round(percent) + '%] 🔄 Scanning Metadata - aStreamer';

          updateRefreshProgress(
            percent,
            'Scanning Batch ' + chunkNum + '/' + totalChunks + ' (' + chunk[0] + ' - ' + chunk[chunk.length - 1] + ')...',
            'Processed: ' + processedSoFar + '/' + totalWorks + ' • Updated: ' + totalUpdated + ' • Unchanged: ' + totalUnchanged
          );

          logRefreshProgress('⏳ Batch ' + chunkNum + '/' + totalChunks + ': Scanning ' + chunk.length + ' works...');

          try {
            const batchRes = await apiFetch('/api/library/refresh-batch', {
              method: 'POST',
              body: JSON.stringify({ rjList: chunk, saveToKv: false })
            });
            const batchData = await batchRes.json().catch(() => ({}));

            if (batchData && batchData.total !== undefined) {
              const updated = batchData.updated || 0;
              const unchanged = batchData.unchanged || 0;
              const failed = batchData.failed || 0;
              totalUpdated += updated;
              totalUnchanged += unchanged;
              totalFailed += failed;

              if (batchData.updatedWorks && Object.keys(batchData.updatedWorks).length > 0) {
                Object.assign(pendingFlushWorks, batchData.updatedWorks);
              }

              const pendingCount = Object.keys(pendingFlushWorks).length;
              if (updated > 0) {
                logRefreshProgress('✨ Batch ' + chunkNum + '/' + totalChunks + ': ' + updated + ' modified (' + pendingCount + ' pending KV save)');
              } else {
                logRefreshProgress('⚡ Batch ' + chunkNum + '/' + totalChunks + ': All ' + unchanged + ' works matching ➔ 0 changes');
              }

              // Periodic Flush: Every 6 batches (~90 works)
              if (chunkNum % FLUSH_INTERVAL_BATCHES === 0 && pendingCount > 0) {
                logRefreshProgress('💾 Periodic Flush: Saving ' + pendingCount + ' accumulated works to KV...');
                const saveRes = await apiFetch('/api/library/save-batch-works', {
                  method: 'POST',
                  body: JSON.stringify({ works: pendingFlushWorks })
                });
                const saveData = await saveRes.json().catch(() => ({}));
                if (saveData && saveData.savedToKv) {
                  totalKvWrites++;
                  logRefreshProgress('✅ Saved ' + pendingCount + ' works to KV (Write #' + totalKvWrites + ')', 'success');
                  pendingFlushWorks = {};
                }
              }
            } else {
              totalFailed += chunk.length;
              logRefreshProgress('❌ Batch ' + chunkNum + '/' + totalChunks + ' failed: Unexpected server response', 'error');
            }
          } catch (err) {
            totalFailed += chunk.length;
            logRefreshProgress('❌ Network error on Batch ' + chunkNum + ': ' + err.message, 'error');
          }

          // Gentle pause between chunks to ensure smooth browser UI
          if (i < totalChunks - 1) {
            await new Promise(r => setTimeout(r, 200));
          }
        }

        // Final Flush: Save any remaining pending works
        const finalPendingCount = Object.keys(pendingFlushWorks).length;
        if (finalPendingCount > 0) {
          logRefreshProgress('💾 Final Flush: Saving remaining ' + finalPendingCount + ' updated works to KV...');
          const saveRes = await apiFetch('/api/library/save-batch-works', {
            method: 'POST',
            body: JSON.stringify({ works: pendingFlushWorks })
          });
          const saveData = await saveRes.json().catch(() => ({}));
          if (saveData && saveData.savedToKv) {
            totalKvWrites++;
            logRefreshProgress('✅ Final Flush: ' + finalPendingCount + ' works safely saved to KV (Write #' + totalKvWrites + ')', 'success');
            pendingFlushWorks = {};
          }
        }

        document.title = '✅ Scan Complete (' + totalUpdated + ' updated) - aStreamer';
        if (window.Notification && Notification.permission === 'granted') {
          new Notification('aStreamer Library Update', {
            body: 'Finished scanning ' + totalWorks + ' works! ' + totalUpdated + ' works updated (' + totalKvWrites + ' KV writes used).',
            icon: '/favicon.ico'
          });
        }
        showToast('✅ Metadata refresh completed: ' + totalUpdated + ' works updated (' + totalKvWrites + ' KV writes used).', 4000);

        logRefreshProgress('🎉 Finished! Processed ' + (totalUpdated + totalUnchanged + totalFailed) + '/' + totalWorks + ' works. Updated: ' + totalUpdated + ', Unchanged: ' + totalUnchanged + ', Failed: ' + totalFailed + ', Total KV Writes: ' + totalKvWrites + '.', 'success');
        finishRefreshProgress(totalWorks, totalUpdated, totalUnchanged, totalFailed, totalKvWrites);
      } catch (err) {
        logRefreshProgress('❌ Fatal error: ' + err.message, 'error');
        finishRefreshProgress(0, 0, 0, 0, 0);
      } finally {
        isRefreshRunning = false;
      }
    }

    async function refreshSingleWork(rjCode, btnEl, isAuto = false) {
      workAutoRefreshedInSession.add(normRj(rjCode));
      const btn = btnEl || document.getElementById('btnWorkRefresh') || document.querySelector('button[onclick*="refreshSingleWork"]');
      const origHtml = btn ? btn.innerHTML : '🔄 Refresh';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spin">🔄</span> Refreshing...';
      }

      try {
        chapterFetchCache.delete(rjCode);
        chapterFetchCache.delete(normRj(rjCode));

        const res = await apiFetch('/api/library/refresh/' + encodeURIComponent(rjCode), { method: 'POST' });
        const data = await res.json();

        if (data.success) {
          const idx = allWorks.findIndex(w => normRj(w.rjCode) === normRj(rjCode));
          if (idx !== -1 && data.work) {
            allWorks[idx] = Object.assign({}, allWorks[idx], data.work);
          }
          if (currentWork && normRj(currentWork.rjCode) === normRj(rjCode)) {
            currentWork = Object.assign({}, currentWork, data.work);
          }
        }

        // Fetch fresh chapters directly from on-demand API
        const chapData = await fetchChaptersLazy(rjCode, true);

        if (currentWork && normRj(currentWork.rjCode) === normRj(rjCode)) {
          renderWorkDetailUI(currentWork);
        }

        const chapsCount = (chapData && Array.isArray(chapData.chapters)) ? chapData.chapters.length : ((currentWork && Array.isArray(currentWork.chapters)) ? currentWork.chapters.length : 0);
        const galleryCount = (chapData && Array.isArray(chapData.gallery)) ? chapData.gallery.length : ((currentWork && Array.isArray(currentWork.gallery)) ? currentWork.gallery.length : 0);

        let asmrMsg = '';
        if (chapsCount > 0 || galleryCount > 0) {
          asmrMsg = ' (' + chapsCount + ' chapters, ' + galleryCount + ' art)';
        }

        const updatedBtn = document.getElementById('btnWorkRefresh') || document.querySelector('button[onclick*="refreshSingleWork"]');

        if (data.success) {
          if (data.changed) {
            showToast('✅ Work refreshed! Metadata updated' + asmrMsg, 3200);
            if (updatedBtn) {
              updatedBtn.disabled = true;
              updatedBtn.innerHTML = '✅ Updated!';
              setTimeout(() => {
                const b = document.getElementById('btnWorkRefresh');
                if (b) { b.disabled = false; b.innerHTML = '🔄 Refresh'; }
              }, 1800);
            }
          } else {
            if (!isAuto) {
              showToast('✅ Work refreshed! Up-to-date' + asmrMsg, 3200);
            }
            if (updatedBtn) {
              updatedBtn.disabled = true;
              updatedBtn.innerHTML = '✅ Up-to-date!';
              setTimeout(() => {
                const b = document.getElementById('btnWorkRefresh');
                if (b) { b.disabled = false; b.innerHTML = '🔄 Refresh'; }
              }, 1800);
            }
          }
        } else {
          if (!isAuto) {
            showToast('❌ Refresh failed: ' + (data.error || 'Unknown error'), 4000);
          }
          if (updatedBtn) {
            updatedBtn.disabled = true;
            updatedBtn.innerHTML = '❌ Failed';
            setTimeout(() => {
              const b = document.getElementById('btnWorkRefresh');
              if (b) { b.disabled = false; b.innerHTML = '🔄 Refresh'; }
            }, 2500);
          }
        }
      } catch (e) {
        if (!isAuto && e.message !== 'Unauthorized') {
          showToast('❌ Error: ' + e.message, 4000);
        }
        const b = document.getElementById('btnWorkRefresh') || btn;
        if (b) {
          b.disabled = false;
          b.innerHTML = origHtml;
        }
      }
    }

    async function rebootTagDictionary() {
      const NL = String.fromCharCode(10);
      if (!confirm('🧹 Clean & Purge Stale Tag Cache:' + NL + NL +
                   'This will remove incomplete/broken/untranslated cache entries while keeping all your valid AI and custom translations.' + NL + NL +
                   'Do you want to continue?')) {
        return;
      }
      const statusEl = document.getElementById('tagTranslationStatus');
      if (statusEl) {
        statusEl.style.display = 'inline-block';
        statusEl.textContent = 'Purging stale/broken cache entries...';
      }
      try {
        const res = await apiFetch('/api/tags/reset-dict', { method: 'POST' });
        const data = await res.json();
        window.tagDict = Object.assign({}, window.BASE_TAG_DICT, data.tagDict || {});
        if (statusEl) statusEl.textContent = '✅ Cleaned ' + (data.removedCount || 0) + ' stale entries (kept ' + (data.preservedCount || 0) + ' good translations). Now scanning library...';
        await checkUntranslatedTags();
      } catch (e) {
        alert('Clean failed: ' + e.message);
      }
    }

    function openTransProgressModal() {
      const modal = document.getElementById('tagTranslationProgressModal');
      const logBox = document.getElementById('transLogBox');
      const closeBtn = document.getElementById('transModalCloseBtn');
      const doneBtn = document.getElementById('transModalDoneBtn');
      if (logBox) logBox.innerHTML = '';
      if (closeBtn) closeBtn.style.display = 'none';
      if (doneBtn) doneBtn.style.display = 'none';
      updateTransProgress(0, 'Initializing...', '0 / 0');
      if (modal) modal.style.display = 'flex';
    }

    function closeTransProgressModal() {
      const modal = document.getElementById('tagTranslationProgressModal');
      if (modal) modal.style.display = 'none';
    }

    function updateTransProgress(percent, stageText, statsText) {
      const bar = document.getElementById('transProgressBar');
      const pText = document.getElementById('transProgressPercent');
      const sText = document.getElementById('transProgressStage');
      const statEl = document.getElementById('transStatsText');
      if (bar) bar.style.width = Math.min(100, Math.max(0, percent)) + '%';
      if (pText) pText.textContent = Math.round(percent) + '%';
      if (sText && stageText) sText.textContent = stageText;
      if (statEl && statsText) statEl.textContent = statsText;
    }

    let lastFailedBatchInfo = null;
    let transUserActionResolver = null;

    function openTransProgressModal() {
      const modal = document.getElementById('tagTranslationProgressModal');
      const logBox = document.getElementById('transLogBox');
      const closeBtn = document.getElementById('transModalCloseBtn');
      const doneBtn = document.getElementById('transModalDoneBtn');
      const failedBar = document.getElementById('transFailedBar');
      if (logBox) logBox.innerHTML = '';
      if (closeBtn) closeBtn.style.display = 'none';
      if (doneBtn) doneBtn.style.display = 'none';
      if (failedBar) failedBar.style.display = 'none';
      updateTransProgress(0, 'Initializing...', '0 / 0');
      if (modal) modal.style.display = 'flex';
    }

    function closeTransProgressModal() {
      const modal = document.getElementById('tagTranslationProgressModal');
      if (modal) modal.style.display = 'none';
    }

    function handleTransAction(action) {
      const failedBar = document.getElementById('transFailedBar');
      if (failedBar) failedBar.style.display = 'none';
      if (typeof transUserActionResolver === 'function') {
        const resolve = transUserActionResolver;
        transUserActionResolver = null;
        resolve(action);
      }
    }

    function downloadFailedResponse() {
      if (!lastFailedBatchInfo) {
        alert('No failed response information available.');
        return;
      }
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(lastFailedBatchInfo, null, 2));
      const dlAnchorElem = document.createElement('a');
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", "translation_batch_error_" + (lastFailedBatchInfo.batchNum || 1) + ".json");
      dlAnchorElem.click();
    }

    function updateTransProgress(percent, stageText, statsText) {
      const bar = document.getElementById('transProgressBar');
      const pText = document.getElementById('transProgressPercent');
      const sText = document.getElementById('transProgressStage');
      const statEl = document.getElementById('transStatsText');
      if (bar) bar.style.width = Math.min(100, Math.max(0, percent)) + '%';
      if (pText) pText.textContent = Math.round(percent) + '%';
      if (sText && stageText) sText.textContent = stageText;
      if (statEl && statsText) statEl.textContent = statsText;
    }

    function logTransProgress(msg, type = 'info') {
      const logBox = document.getElementById('transLogBox');
      if (!logBox) return;
      const time = new Date().toLocaleTimeString();
      let color = '#cbd5e1';
      if (type === 'success' || msg.includes('✅') || msg.includes('✨') || msg.includes('🎉')) color = '#4ade80';
      else if (type === 'warn' || msg.includes('⚠️') || msg.includes('⏸️')) color = '#fbbf24';
      else if (type === 'error' || msg.includes('❌')) color = '#f87171';
      else if (msg.includes('🤖') || msg.includes('⏳')) color = '#38bdf8';

      const line = document.createElement('div');
      line.style.color = color;
      line.style.marginBottom = '3px';
      line.textContent = '[' + time + '] ' + msg;
      logBox.appendChild(line);
      logBox.scrollTop = logBox.scrollHeight;
    }

    function finishTransProgress(localCount, llmCount) {
      const closeBtn = document.getElementById('transModalCloseBtn');
      const doneBtn = document.getElementById('transModalDoneBtn');
      const failedBar = document.getElementById('transFailedBar');
      if (failedBar) failedBar.style.display = 'none';
      if (closeBtn) closeBtn.style.display = 'inline-block';
      if (doneBtn) doneBtn.style.display = 'inline-block';
      updateTransProgress(100, '✅ Translation Completed', (localCount + llmCount) + ' items processed');
      if (currentView === 'genres') loadGenres();
      else if (currentView === 'artists') loadArtists();
      else if (currentView === 'library') loadLibrary(currentFilterParams);
    }

    async function checkUntranslatedTags() {
      const statusEl = document.getElementById('tagTranslationStatus');
      const btn = document.getElementById('btnUpdateTagTranslation');
      if (statusEl) {
        statusEl.style.display = 'inline-block';
        statusEl.textContent = '1/5 Scanning library for untranslated tags & CV names...';
      }

      openTransProgressModal();
      updateTransProgress(5, '1/5 Scanning library metadata...');
      logTransProgress('🔍 Scanning library metadata and server aggregations...');

      // Ensure library, tags, and artists are loaded
      if (!allWorks || allWorks.length === 0) {
        try {
          const res = await apiFetch('/api/library');
          const works = await res.json();
          if (Array.isArray(works)) allWorks = works;
        } catch(e) {}
      }
      let serverTags = [];
      let serverArtists = [];
      try {
        const [tagRes, artRes] = await Promise.all([
          apiFetch('/api/tags'),
          apiFetch('/api/artists')
        ]);
        const tagData = await tagRes.json();
        serverTags = Array.isArray(tagData) ? tagData : (tagData.tags || []);
        serverArtists = await artRes.json();
      } catch(e) {}

      const allCandidateTags = new Set();
      const allCandidateCVs = new Set();

      (allWorks || []).forEach(w => {
        if (Array.isArray(w.tags)) {
          w.tags.forEach(t => {
            const clean = String(t || '').trim();
            if (clean) allCandidateTags.add(clean);
          });
        }
        if (w.cv && w.cv !== 'N/A') {
          String(w.cv).split(/[,、/&＋+;]/).forEach(c => {
            const clean = c.trim();
            if (clean) allCandidateCVs.add(clean);
          });
        }
      });

      (serverTags || []).forEach(t => {
        const name = (t.name || t.tag || t || '').trim();
        if (name) allCandidateTags.add(name);
      });

      (serverArtists || []).forEach(a => {
        const name = (a.name || a.cv || a || '').trim();
        if (name) allCandidateCVs.add(name);
      });

      logTransProgress('Found ' + allCandidateTags.size + ' unique tags and ' + allCandidateCVs.size + ' voice actors in library.');

      function isTagProperlyTranslated(tag, isCV) {
        if (!tag) return true;
        const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(tag);
        if (!hasJapanese) return true;
        const entry = getTagEntry(tag);
        if (!entry) return false;
        const romaji = (entry.romaji || '').trim();
        const english = (entry.english || '').trim();
        const validRomaji = romaji && /[a-zA-Z]/.test(romaji) && romaji !== tag;
        const validEnglish = english && /[a-zA-Z]/.test(english) && english !== tag;
        if (isCV || entry.isCV) {
          return !!validRomaji;
        }
        return !!(validRomaji && validEnglish);
      }

      updateTransProgress(15, '2/5 Resolving tags locally with Pass 2 & taxonomy...');
      const resolvedBatch = {};
      const needsTranslation = [];

      allCandidateTags.forEach(tag => {
        if (isTagProperlyTranslated(tag, false)) return;
        const p2 = resolveTagPass2Client(tag);
        if (p2 && p2.romaji && p2.english && /[a-zA-Z]/.test(p2.romaji) && /[a-zA-Z]/.test(p2.english) && p2.romaji !== tag && p2.english !== tag) {
          resolvedBatch[tag] = { romaji: p2.romaji, english: p2.english };
        } else {
          needsTranslation.push(tag);
        }
      });

      allCandidateCVs.forEach(cv => {
        if (isTagProperlyTranslated(cv, true)) return;
        const p2 = resolveTagPass2Client(cv);
        if (p2 && p2.romaji && /[a-zA-Z]/.test(p2.romaji) && p2.romaji !== cv) {
          resolvedBatch[cv] = { romaji: p2.romaji, isCV: true };
        } else {
          needsTranslation.push(cv);
        }
      });

      const localResolvedCount = Object.keys(resolvedBatch).length;
      const totalLlm = needsTranslation.length;

      if (localResolvedCount > 0) {
        logTransProgress('⚡ Pass 2: Resolved ' + localResolvedCount + ' tags locally (0 LLM cost).');
        updateTransProgress(25, '3/5 Saving ' + localResolvedCount + ' local tags to storage...');
        try {
          await apiFetch('/api/tags/sync-dict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ updates: resolvedBatch, newEntries: resolvedBatch })
          });
          window.tagDict = Object.assign({}, window.BASE_TAG_DICT || {}, window.tagDict || {}, resolvedBatch);
        } catch(e) {}
      }

      if (totalLlm === 0) {
        logTransProgress('✨ All tags and voice actors in your library are translated & up to date!');
        if (statusEl) statusEl.textContent = '✨ All tags and voice actors in your library are translated & synced!';
        finishTransProgress(localResolvedCount, 0);
        return;
      }

      const BATCH_SIZE = 75;
      const totalBatches = Math.ceil(totalLlm / BATCH_SIZE);
      logTransProgress('🤖 ' + totalLlm + ' tags need DeepSeek AI. Splitting into ' + totalBatches + ' batches (' + BATCH_SIZE + ' tags/batch)...');

      if (btn) btn.disabled = true;
      let successLlmCount = 0;

      for (let i = 0; i < totalBatches; i++) {
        let batchNum = i + 1;
        let start = i * BATCH_SIZE;
        let chunk = needsTranslation.slice(start, start + BATCH_SIZE);

        let retryCount = 0;
        let batchCompleted = false;

        while (!batchCompleted) {
          const percent = Math.round(25 + ((i / totalBatches) * 70));
          updateTransProgress(percent, '4/5 DeepSeek AI: Batch ' + batchNum + ' of ' + totalBatches + ' (' + chunk.length + ' items)...', successLlmCount + ' / ' + totalLlm + ' translated');
          logTransProgress('⏳ Batch ' + batchNum + '/' + totalBatches + (retryCount > 0 ? ' (Retry ' + retryCount + ')' : '') + ': Requesting translation for ' + chunk.length + ' tags from DeepSeek AI...');

          try {
            const res = await apiFetch('/api/tags/translate-batch', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tags: chunk })
            });
            const data = await res.json();

            if (data && data.success && data.translations) {
              const count = Object.keys(data.translations).length;
              successLlmCount += count;
              Object.assign(resolvedBatch, data.translations);
              window.tagDict = Object.assign({}, window.BASE_TAG_DICT || {}, window.tagDict || {}, data.translations);

              // Persist immediately to KV
              await apiFetch('/api/tags/sync-dict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updates: data.translations, newEntries: data.translations })
              }).catch(() => {});

              logTransProgress('✅ Batch ' + batchNum + '/' + totalBatches + ': Received ' + count + ' translations and saved to KV storage!');
              batchCompleted = true;
            } else {
              const errMsg = (data && data.error) || 'Translation request failed';
              logTransProgress('❌ Batch ' + batchNum + '/' + totalBatches + ' failed: ' + errMsg, 'error');

              lastFailedBatchInfo = {
                batchNum: batchNum,
                totalBatches: totalBatches,
                chunk: chunk,
                error: errMsg,
                rawResponse: (data && data.rawResponse) || '',
                timestamp: new Date().toISOString()
              };

              const reasonEl = document.getElementById('transFailedReason');
              const failedBar = document.getElementById('transFailedBar');
              if (reasonEl) reasonEl.textContent = errMsg;
              if (failedBar) failedBar.style.display = 'block';

              logTransProgress('⏸️ Paused. Choose an action below: [Retry Batch], [Skip & Continue], or [Download Raw Error Log].', 'warn');

              const userAction = await new Promise(resolve => {
                transUserActionResolver = resolve;
              });

              if (userAction === 'retry') {
                retryCount++;
                logTransProgress('🔄 Retrying Batch ' + batchNum + '...');
              } else if (userAction === 'skip') {
                logTransProgress('⏭️ Skipped Batch ' + batchNum + '. Continuing to next batch...');
                batchCompleted = true;
              } else {
                logTransProgress('⏹️ Translation stopped by user.');
                finishTransProgress(localResolvedCount, successLlmCount);
                if (btn) btn.disabled = false;
                return;
              }
            }
          } catch (err) {
            logTransProgress('❌ Network error on Batch ' + batchNum + ': ' + err.message, 'error');

            lastFailedBatchInfo = {
              batchNum: batchNum,
              chunk: chunk,
              error: err.message,
              timestamp: new Date().toISOString()
            };

            const reasonEl = document.getElementById('transFailedReason');
            const failedBar = document.getElementById('transFailedBar');
            if (reasonEl) reasonEl.textContent = err.message;
            if (failedBar) failedBar.style.display = 'block';

            const userAction = await new Promise(resolve => {
              transUserActionResolver = resolve;
            });

            if (userAction === 'retry') {
              retryCount++;
            } else {
              batchCompleted = true;
            }
          }
        }

        // Pause between batches
        if (i < totalBatches - 1) {
          await new Promise(r => setTimeout(r, 400));
        }
      }

      logTransProgress('🎉 Finished! Translated ' + successLlmCount + ' items with DeepSeek AI + ' + localResolvedCount + ' locally.');
      if (statusEl) statusEl.textContent = '✅ Translated and synced ' + (localResolvedCount + successLlmCount) + ' items!';
      finishTransProgress(localResolvedCount, successLlmCount);
      if (btn) btn.disabled = false;
    }

    let isClassifyRunning = false;
    let classifyShouldStop = false;

    function openClassifyProgressModal() {
      const modal = document.getElementById('tagClassifyProgressModal');
      const logBox = document.getElementById('classifyLogBox');
      const closeBtn = document.getElementById('classifyModalCloseBtn');
      const doneBtn = document.getElementById('classifyModalDoneBtn');
      const stopBtn = document.getElementById('classifyModalStopBtn');
      if (logBox) logBox.innerHTML = '';
      if (closeBtn) closeBtn.style.display = 'none';
      if (doneBtn) doneBtn.style.display = 'none';
      if (stopBtn) stopBtn.style.display = 'inline-block';
      updateClassifyProgress(0, 'Initializing tag scan...', '0 / 0');
      if (modal) modal.style.display = 'flex';
    }

    function closeClassifyProgressModal() {
      const modal = document.getElementById('tagClassifyProgressModal');
      if (modal) modal.style.display = 'none';
    }

    function stopClassifyProgress() {
      classifyShouldStop = true;
      logClassifyProgress('⏹️ Stop requested. Finishing current batch before stopping...', 'warn');
    }

    function updateClassifyProgress(percent, stageText, statsText) {
      const bar = document.getElementById('classifyProgressBar');
      const pText = document.getElementById('classifyProgressPercent');
      const sText = document.getElementById('classifyProgressStage');
      const statEl = document.getElementById('classifyStatsText');
      if (bar) bar.style.width = Math.min(100, Math.max(0, percent)) + '%';
      if (pText) pText.textContent = Math.round(percent) + '%';
      if (sText && stageText) sText.textContent = stageText;
      if (statEl && statsText) statEl.textContent = statsText;
    }

    function logClassifyProgress(msg, type = 'info') {
      const logBox = document.getElementById('classifyLogBox');
      if (!logBox) return;
      const time = new Date().toLocaleTimeString();
      let color = '#cbd5e1';
      if (type === 'success' || msg.includes('✅') || msg.includes('✨') || msg.includes('🎉')) color = '#4ade80';
      else if (type === 'warn' || msg.includes('⚠️') || msg.includes('⏹️')) color = '#fbbf24';
      else if (type === 'error' || msg.includes('❌')) color = '#f87171';
      else if (msg.includes('🤖') || msg.includes('⏳')) color = '#38bdf8';

      const line = document.createElement('div');
      line.style.color = color;
      line.style.marginBottom = '3px';
      line.textContent = '[' + time + '] ' + msg;
      logBox.appendChild(line);
      logBox.scrollTop = logBox.scrollHeight;
    }

    function finishClassifyProgress(classifiedCount, totalUnclassified) {
      const closeBtn = document.getElementById('classifyModalCloseBtn');
      const doneBtn = document.getElementById('classifyModalDoneBtn');
      const stopBtn = document.getElementById('classifyModalStopBtn');
      if (closeBtn) closeBtn.style.display = 'inline-block';
      if (doneBtn) doneBtn.style.display = 'inline-block';
      if (stopBtn) stopBtn.style.display = 'none';
      updateClassifyProgress(100, '✅ Tag Classification Completed', classifiedCount + ' / ' + totalUnclassified + ' tags classified');
      if (currentView === 'genres') loadGenres();
      else if (currentView === 'library') renderLibraryGrid(allWorks, currentFilterParams);
      else if (currentView === 'work-detail' && currentWork) renderWorkDetailUI(currentWork);
    }

    async function classifyLibraryTags() {
      if (isClassifyRunning) return;
      isClassifyRunning = true;
      classifyShouldStop = false;

      const btn = document.getElementById('btnClassifyTags');
      if (btn) btn.disabled = true;

      openClassifyProgressModal();
      logClassifyProgress('🔍 Gathering all unique tags across your library...');

      if (!allWorks || allWorks.length === 0) {
        try {
          const res = await apiFetch('/api/library');
          const works = await res.json();
          if (Array.isArray(works)) allWorks = works;
        } catch(e) {}
      }

      let serverTags = [];
      try {
        const tagRes = await apiFetch('/api/tags');
        const tagData = await tagRes.json();
        serverTags = Array.isArray(tagData) ? tagData : (tagData.tags || []);
      } catch(e) {}

      const allUniqueTags = new Set();
      (allWorks || []).forEach(w => {
        if (Array.isArray(w.tags)) {
          w.tags.forEach(t => {
            const clean = String(t || '').trim();
            if (clean) allUniqueTags.add(clean);
          });
        }
      });

      (serverTags || []).forEach(t => {
        const name = (t.name || t.tag || t || '').trim();
        if (name) allUniqueTags.add(name);
      });

      const unclassifiedTags = [];
      let alreadyClassifiedCount = 0;

      allUniqueTags.forEach(tag => {
        const entry = getTagEntry(tag);
        // Exclude voice actor entries
        if (entry && entry.isCV) return;
        if (entry && typeof entry.isNsfw === 'boolean') {
          alreadyClassifiedCount++;
        } else {
          unclassifiedTags.push(tag);
        }
      });

      logClassifyProgress('📊 Found ' + allUniqueTags.size + ' unique tags (' + alreadyClassifiedCount + ' already classified in DB, ' + unclassifiedTags.length + ' need classification).');

      if (unclassifiedTags.length === 0) {
        logClassifyProgress('✨ All tags in your library are already classified as SFW or NSFW! (0 API calls needed)', 'success');
        finishClassifyProgress(0, 0);
        isClassifyRunning = false;
        if (btn) btn.disabled = false;
        return;
      }

      const BATCH_SIZE = 50;
      const totalBatches = Math.ceil(unclassifiedTags.length / BATCH_SIZE);
      logClassifyProgress('🤖 Starting DeepSeek AI classification: ' + unclassifiedTags.length + ' tags in ' + totalBatches + ' batches (' + BATCH_SIZE + ' tags/batch)...');

      let successCount = 0;

      for (let i = 0; i < totalBatches; i++) {
        if (classifyShouldStop) {
          logClassifyProgress('⏹️ Classification stopped by user.', 'warn');
          break;
        }

        const batchNum = i + 1;
        const start = i * BATCH_SIZE;
        const chunk = unclassifiedTags.slice(start, start + BATCH_SIZE);
        const percent = Math.round(((i) / totalBatches) * 100);

        updateClassifyProgress(percent, 'Classifying Batch ' + batchNum + ' of ' + totalBatches + ' (' + chunk.length + ' tags)...', successCount + ' / ' + unclassifiedTags.length + ' tags classified');
        logClassifyProgress('⏳ Batch ' + batchNum + '/' + totalBatches + ': Sending ' + chunk.length + ' tags to DeepSeek AI...');

        try {
          const res = await apiFetch('/api/tags/classify-batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tags: chunk })
          });
          const data = await res.json();

          if (data && data.success && data.classifications) {
            const count = Object.keys(data.classifications).length;
            successCount += count;
            window.tagDict = Object.assign({}, window.BASE_TAG_DICT || {}, window.tagDict || {}, data.tagDict || {});
            
            let nsfwCount = 0;
            let sfwCount = 0;
            Object.values(data.classifications).forEach(isNsfw => {
              if (isNsfw) nsfwCount++;
              else sfwCount++;
            });

            logClassifyProgress('✅ Batch ' + batchNum + '/' + totalBatches + ': ' + count + ' tags classified (' + sfwCount + ' SFW, ' + nsfwCount + ' NSFW) and saved to KV/DB', 'success');
          } else {
            logClassifyProgress('❌ Batch ' + batchNum + ' failed: ' + (data.error || 'Unknown error'), 'error');
          }
        } catch (err) {
          logClassifyProgress('❌ Network error on Batch ' + batchNum + ': ' + err.message, 'error');
        }

        if (i < totalBatches - 1 && !classifyShouldStop) {
          await new Promise(r => setTimeout(r, 400));
        }
      }

      logClassifyProgress('🎉 Finished! Successfully classified ' + successCount + ' / ' + unclassifiedTags.length + ' tags with DeepSeek AI.', 'success');
      finishClassifyProgress(successCount, unclassifiedTags.length);
      isClassifyRunning = false;
      if (btn) btn.disabled = false;
    }

    async function exportBackup() {
      window.location.href = '/api/backup';
    }

    async function importBackupFile(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          const res = await apiFetch('/api/backup', {
            method: 'POST',
            body: JSON.stringify(parsed)
          });
          const data = await res.json();
          if (data.success) {
            alert('✅ Backup restored successfully to Cloudflare KV!');
            loadLibrary();
          } else {
            alert('Failed: ' + (data.error || 'Unknown error'));
          }
        } catch (err) {
          alert('Invalid JSON file: ' + err.message);
        }
      };
      reader.readAsText(file);
    }

    async function setContentMode(mode) {
      contentMode = mode;
      localStorage.setItem('astreamer_content_mode', mode);
      await apiFetch('/api/settings', { method: 'POST', body: JSON.stringify({ contentMode: mode }) });
      
      const activeWork = currentPlayingWork || currentWork;
      if (activeWork) {
        const display = getDisplayCover(activeWork);
        const playerCover = document.getElementById('playerCover');
        if (playerCover) {
          playerCover.src = display.coverUrl;
          playerCover.setAttribute('data-rj', activeWork.rjCode || '');
        }
      }
      updatePopupPlayerUI();

      if (currentView === 'settings') loadSettings();
      else if (currentView === 'library') renderLibraryGrid(allWorks, currentFilterParams);
      else if (currentView === 'work-detail' && currentWork) renderWorkDetailUI(currentWork);
      else if (currentView === 'playlists') loadPlaylists();
      else if (currentView === 'playlist-detail' && currentPlaylist) loadPlaylistDetail(currentPlaylist.id);
      else if (currentView === 'history') loadHistory();
      else if (currentView === 'wishlist') loadWishlist();
    }

    function setupMediaSessionHandlers() {
      if (!('mediaSession' in navigator)) return;
      try {
        navigator.mediaSession.setActionHandler('play', () => {
          if (audio.paused) audio.play().catch(() => {});
        });
        navigator.mediaSession.setActionHandler('pause', () => {
          if (!audio.paused) audio.pause();
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => playPrevTrack());
        navigator.mediaSession.setActionHandler('nexttrack', () => playNextTrack());
        navigator.mediaSession.setActionHandler('seekbackward', (d) => seekRelative(-(d?.seekOffset || 10)));
        navigator.mediaSession.setActionHandler('seekforward', (d) => seekRelative(d?.seekOffset || 10));
        navigator.mediaSession.setActionHandler('stop', () => {
          audio.pause();
          audio.currentTime = 0;
        });
      } catch (e) {}
    }

    function setupMediaSession(track, display) {
      if (!('mediaSession' in navigator) || !currentPlayingWork) return;
      try {
        let artworkSrc = display.coverUrl || '';
        if (artworkSrc && !artworkSrc.startsWith('http') && !artworkSrc.startsWith('data:')) {
          artworkSrc = new URL(artworkSrc, window.location.origin).href;
        }
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.title,
          artist: currentPlayingWork.cv || currentPlayingWork.circle || 'aStreamer',
          album: currentPlayingWork.title,
          artwork: artworkSrc ? [
            { src: artworkSrc, sizes: '512x512', type: 'image/jpeg' },
            { src: artworkSrc, sizes: '256x256', type: 'image/jpeg' },
            { src: artworkSrc, sizes: '128x128', type: 'image/jpeg' }
          ] : []
        });
        setupMediaSessionHandlers();
      } catch (e) {}
    }

    function normalizeStreamUrl(url, cleanRj = '', referer = '') {
      if (!url && cleanRj) return '/stream?url=' + encodeURIComponent('https://v.weeab0o.xyz/' + cleanRj + '.m3u8') + '&referer=' + encodeURIComponent('https://japaneseasmr.com/');
      if (!url) return '';
      let u = url.trim();
      if (u.startsWith('//')) u = 'https:' + u;
      if (u.startsWith('/stream?url=') || u.startsWith('/stream-proxy?url=')) return u;
      if (u.startsWith('http://') || u.startsWith('https://')) {
        let res = '/stream?url=' + encodeURIComponent(u);
        if (referer) res += '&referer=' + encodeURIComponent(referer);
        return res;
      }
      return u;
    }

    async function resolveWorkLazyStream(rjCode) {
      if (!rjCode) return null;
      try {
        const res = await apiFetch('/api/work/' + encodeURIComponent(rjCode) + '/resolve-stream', {
          method: 'POST'
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.work) return data.work;
        }
      } catch (e) {
        console.error('Failed to resolve lazy stream:', e);
      }
      return null;
    }

    window.playTrack = function(index, userTriggered = true, targetWork = null, startTime = 0) {
      index = Math.max(0, parseInt(index, 10) || 0);
      startTime = Math.max(0, parseFloat(startTime) || 0);
      playbackRecoveryAttempt = 0;

      if (targetWork) {
        currentPlayingWork = targetWork;
      } else if (!currentPlayingWork) {
        currentPlayingWork = currentWork || (allWorks && allWorks[0]);
      } else if (currentWork && currentView === 'work-detail' && normRj(currentWork.rjCode) !== normRj(currentPlayingWork.rjCode) && userTriggered) {
        currentPlayingWork = currentWork;
      }
      if (!currentPlayingWork) return;

      // On-demand lazy stream resolution
      if (currentPlayingWork.hasLazyAudio || (currentPlayingWork.tracks && currentPlayingWork.tracks[0]?.isLazy) || (!currentPlayingWork.tracks?.[0]?.streamUrl && !currentPlayingWork.tracks?.[0]?.rawUrl)) {
        document.getElementById('playerTitle').innerText = 'Resolving Audio Stream...';
        document.getElementById('playerSub').innerText = (currentPlayingWork.rjCode || '') + ' • Fetching tracks from source...';
        resolveWorkLazyStream(currentPlayingWork.rjCode).then((freshWork) => {
          if (freshWork && freshWork.tracks && freshWork.tracks.length > 0) {
            currentPlayingWork.tracks = freshWork.tracks;
            currentPlayingWork.hasLazyAudio = false;
            currentPlayingWork.totalTracks = freshWork.tracks.length;
            if (currentWork && normRj(currentWork.rjCode) === normRj(currentPlayingWork.rjCode)) {
              currentWork.tracks = freshWork.tracks;
              currentWork.hasLazyAudio = false;
              currentWork.totalTracks = freshWork.tracks.length;
              if (currentView === 'work-detail') renderWorkDetailUI(currentWork);
            }
            playTrack(index, userTriggered, currentPlayingWork, startTime);
          } else {
            alert('Failed to resolve audio streams for ' + (currentPlayingWork.rjCode || 'work'));
          }
        }).catch(err => {
          console.error('Lazy resolve error:', err);
        });
        return;
      }

      if (!currentPlayingWork.tracks || currentPlayingWork.tracks.length === 0) {
        const cleanRj = currentPlayingWork.rjCode || '';
        const m3u8Url = 'https://v.weeab0o.xyz/' + cleanRj + '.m3u8';
        currentPlayingWork.tracks = [{
          id: 1,
          title: currentPlayingWork.title ? ('01. ' + currentPlayingWork.title) : '01. Audio Track',
          formattedTime: '00:00:00',
          startTime: 0,
          isHls: true,
          rawUrl: m3u8Url,
          streamUrl: '/stream?url=' + encodeURIComponent(m3u8Url),
          poster: currentPlayingWork.coverUrl || ''
        }];
        currentPlayingWork.hasHls = true;
      }

      if (index >= currentPlayingWork.tracks.length) {
        index = currentPlayingWork.hasHls ? 0 : Math.min(index, currentPlayingWork.tracks.length - 1);
      }
      currentTrackIndex = index;
      const track = currentPlayingWork.tracks[index];
      const display = getDisplayCover(currentPlayingWork);

      document.getElementById('playerTitle').innerText = track.title || 'Track ' + (index + 1);
      document.getElementById('playerSub').innerText = (currentPlayingWork.rjCode || '') + ' • ' + (currentPlayingWork.title || '');
      const playerCover = document.getElementById('playerCover');
      if (playerCover) {
        playerCover.src = display.coverUrl;
        playerCover.setAttribute('data-rj', currentPlayingWork.rjCode || '');
      }

      const knownDur = track.duration || 0;
      const initialTotal = knownDur > 0 ? formatTime(knownDur) : (track.formattedTime || '--:--');
      document.getElementById('currTime').innerText = formatTime(startTime || 0);
      document.getElementById('totalTime').innerText = initialTotal;
      document.getElementById('popupCurrTime').innerText = formatTime(startTime || 0);
      document.getElementById('popupTotalTime').innerText = initialTotal;
      document.getElementById('scrubber').value = 0;
      document.getElementById('popupScrubber').value = 0;

      updatePopupPlayerUI();
      recordPlayHistory(currentPlayingWork, index);

      audio.muted = false;
      if (audio.volume === 0) audio.volume = 1.0;

      document.querySelectorAll('.track-row').forEach((r, i) => r.classList.toggle('active', i === index));

      // MediaSession Background Audio Metadata API
      setupMediaSession(track, display);

      // Fetch rich chapters and gallery if not yet loaded
      if (currentPlayingWork && currentPlayingWork.rjCode && (!currentPlayingWork.chapters || currentPlayingWork.chapters.length <= 1)) {
        fetchChaptersLazy(currentPlayingWork.rjCode);
      }

      const seekTime = (startTime > 0) ? startTime : (track.startTime || 0);
      let streamUrl = normalizeStreamUrl(track.streamUrl || track.rawUrl, currentPlayingWork.rjCode);
      const isM3u8 = (track.isHls === true) || (streamUrl && streamUrl.toLowerCase().includes('.m3u8'));

      if (isM3u8) {
        playHlsStream(streamUrl, seekTime, userTriggered);
      } else {
        playDirectAudio(streamUrl, userTriggered, seekTime);
      }
    };

    function playHlsStream(m3u8Url, startTime = 0, userTriggered = true) {
      startTime = Math.max(0, parseFloat(startTime) || 0);
      m3u8Url = normalizeStreamUrl(m3u8Url, currentPlayingWork ? currentPlayingWork.rjCode : '');

      if (hls && loadedHlsUrl === m3u8Url) {
        try { audio.currentTime = startTime; } catch(e) {}
        if (userTriggered) {
          const p = audio.play();
          if (p && p.then) {
            p.then(() => {
              if (startTime > 0 && Math.abs(audio.currentTime - startTime) > 1) {
                try { audio.currentTime = startTime; } catch(e) {}
              }
            }).catch(e => console.log('Play error:', e));
          }
        }
        return;
      }
      if (hls) { hls.destroy(); hls = null; }
      loadedHlsUrl = m3u8Url;
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          maxBufferLength: 60,
          startPosition: startTime >= 0 ? startTime : -1
        });
        hls.loadSource(m3u8Url);
        hls.attachMedia(audio);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (startTime > 0) {
            try { audio.currentTime = startTime; } catch(e) {}
          }
          if (userTriggered) {
            const p = audio.play();
            if (p && p.then) {
              p.then(() => {
                if (startTime > 0 && Math.abs(audio.currentTime - startTime) > 1) {
                  try { audio.currentTime = startTime; } catch(e) {}
                }
              }).catch(e => console.log('Autoplay handled:', e));
            }
          }
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.warn('HLS error:', data.type, data.details, data.fatal);
          if (data.fatal) {
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
              if (playbackRecoveryAttempt < 3 && currentPlayingWork && currentPlayingWork.rjCode) {
                playbackRecoveryAttempt++;
                const cleanRj = currentPlayingWork.rjCode;
                console.log('HLS network error, requesting track recovery for:', cleanRj);
                fetchChaptersLazy(cleanRj, true).then(() => {
                  if (currentPlayingWork && currentPlayingWork.tracks && currentPlayingWork.tracks.length > 1) {
                    playTrack(0, userTriggered, currentPlayingWork);
                  } else {
                    const altMp3 = '/stream?url=' + encodeURIComponent('https://v.weeab0o.xyz/' + cleanRj + '.mp3') + '&referer=' + encodeURIComponent('https://japaneseasmr.com/');
                    playDirectAudio(altMp3, userTriggered, startTime);
                  }
                });
                return;
              }
              hls.startLoad();
            } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            } else {
              hls.destroy();
            }
          }
        });
      } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
        audio.src = m3u8Url;
        let seekDone = false;
        const onReady = () => {
          if (seekDone) return;
          seekDone = true;
          try { audio.currentTime = startTime; } catch(e) {}
          if (userTriggered) {
            const p = audio.play();
            if (p && p.then) {
              p.then(() => {
                if (startTime > 0 && Math.abs(audio.currentTime - startTime) > 1) {
                  try { audio.currentTime = startTime; } catch(e) {}
                }
              }).catch(e => console.log('Play:', e));
            }
          }
        };
        audio.addEventListener('loadedmetadata', onReady, { once: true });
        audio.addEventListener('canplay', onReady, { once: true });
      }
    }

    function playDirectAudio(srcUrl, userTriggered = true, startTime = 0) {
      startTime = Math.max(0, parseFloat(startTime) || 0);
      srcUrl = normalizeStreamUrl(srcUrl, currentPlayingWork ? currentPlayingWork.rjCode : '');
      if (hls) { hls.destroy(); hls = null; loadedHlsUrl = null; }

      const isSameSrc = audio.src && (audio.src === srcUrl || audio.src.endsWith(srcUrl) || (new URL(srcUrl, window.location.origin).href === audio.src));
      if (isSameSrc && !audio.error && audio.readyState >= 1) {
        try { audio.currentTime = startTime; } catch(e) {}
        if (userTriggered) {
          const p = audio.play();
          if (p && p.then) {
            p.then(() => {
              if (startTime > 0 && Math.abs(audio.currentTime - startTime) > 1) {
                try { audio.currentTime = startTime; } catch(e) {}
              }
            }).catch(e => console.log('Play error:', e));
          }
        }
        return;
      }
      audio.src = srcUrl;
      let seekDone = false;
      const onReady = () => {
        if (seekDone) return;
        seekDone = true;
        try {
          if (startTime > 0) audio.currentTime = startTime;
        } catch(e) {}
        if (userTriggered) {
          const p = audio.play();
          if (p && p.then) {
            p.then(() => {
              if (startTime > 0 && Math.abs(audio.currentTime - startTime) > 1) {
                try { audio.currentTime = startTime; } catch(e) {}
              }
            }).catch(e => console.log('Play error:', e));
          }
        }
      };
      audio.addEventListener('loadedmetadata', onReady, { once: true });
      audio.addEventListener('canplay', onReady, { once: true });
    }

    function togglePlayPause() {
      if (audio.paused) audio.play();
      else audio.pause();
    }

    audio.addEventListener('loadedmetadata', () => {
      const dur = audio.duration;
      if (dur && !isNaN(dur) && dur > 0 && currentPlayingWork) {
        if (currentPlayingWork.tracks && currentPlayingWork.tracks[currentTrackIndex]) {
          currentPlayingWork.tracks[currentTrackIndex].duration = Math.round(dur);
          currentPlayingWork.tracks[currentTrackIndex].formattedTime = formatTime(Math.round(dur));
        }
        const numTracks = (currentPlayingWork.tracks) ? currentPlayingWork.tracks.length : 1;
        if (numTracks <= 1 && Array.isArray(currentPlayingWork.chapters) && currentPlayingWork.chapters.length > 0) {
          let running = 0;
          let cutoff = -1;
          for (let i = 0; i < currentPlayingWork.chapters.length; i++) {
            running += (currentPlayingWork.chapters[i].duration || 0);
            if (Math.abs(running - dur) <= 3) {
              cutoff = i;
              break;
            } else if (running > dur + 5) {
              cutoff = i > 0 ? i - 1 : 0;
              break;
            }
          }
          if (cutoff >= 0 && cutoff < currentPlayingWork.chapters.length - 1) {
            currentPlayingWork.chapters = currentPlayingWork.chapters.slice(0, cutoff + 1);
          } else {
            currentPlayingWork.chapters = currentPlayingWork.chapters.filter(c => (c.startTime || 0) < dur - 2);
          }
          if (currentWork && currentWork.rjCode === currentPlayingWork.rjCode) {
            currentWork.chapters = currentPlayingWork.chapters;
            currentWorkChapters = currentPlayingWork.chapters;
            renderWorkDetailUI(currentWork);
          }
          updatePopupPlayerUI();
        }
      }
    });

    audio.addEventListener('play', () => {
      document.getElementById('playPauseBtn').innerText = '⏸';
      document.getElementById('popupPlayPauseBtn').innerText = '⏸';
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
    });
    audio.addEventListener('pause', () => {
      document.getElementById('playPauseBtn').innerText = '▶';
      document.getElementById('popupPlayPauseBtn').innerText = '▶';
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
    });
    audio.addEventListener('ended', () => {
      playNextTrack();
    });
    audio.addEventListener('timeupdate', () => {
      const ct = audio.currentTime;
      const dur = audio.duration || 0;
      const fmtCt = formatTime(ct);
      const fmtDur = formatTime(dur);

      document.getElementById('currTime').innerText = fmtCt;
      document.getElementById('totalTime').innerText = fmtDur;
      document.getElementById('popupCurrTime').innerText = fmtCt;
      document.getElementById('popupTotalTime').innerText = fmtDur;

      if (dur > 0) {
        const pct = (ct / dur) * 100;
        document.getElementById('scrubber').value = pct;
        document.getElementById('popupScrubber').value = pct;
      }

      highlightActiveChapter(ct, currentTrackIndex);

      if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession && dur > 0 && !isNaN(ct)) {
        try {
          navigator.mediaSession.setPositionState({
            duration: dur,
            playbackRate: audio.playbackRate || 1,
            position: Math.min(ct, dur)
          });
        } catch(e) {}
      }
    });

    function formatTime(secs) {
      if (isNaN(secs)) return '00:00';
      const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = Math.floor(secs % 60);
      if (h > 0) return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
      return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }

    function onScrub(val) {
      if (audio.duration) {
        audio.currentTime = (val / 100) * audio.duration;
      }
    }
    function seekRelative(secs) { audio.currentTime = Math.max(0, audio.currentTime + secs); }

    function getContextWorksList() {
      if (!allWorks || allWorks.length === 0) return [];
      let list = [...allWorks];
      if (contentMode === 'SFW') list = list.filter(w => !isWorkNsfw(w));
      if (currentFilterParams && Object.keys(currentFilterParams).length > 0) {
        if (currentFilterParams.tag) list = list.filter(w => (w.tags || []).some(t => t.toLowerCase().trim() === currentFilterParams.tag.toLowerCase().trim()));
        if (currentFilterParams.cv) list = list.filter(w => w.cv && w.cv.toLowerCase().includes(currentFilterParams.cv.toLowerCase().trim()));
        if (currentFilterParams.favorite === 'true') list = list.filter(w => w.favorite);
        if (currentFilterParams.q) {
          const q = currentFilterParams.q.toLowerCase().trim();
          list = list.filter(w => w.rjCode.toLowerCase().includes(q) || w.title.toLowerCase().includes(q) || (w.circle && w.circle.toLowerCase().includes(q)) || (w.cv && w.cv.toLowerCase().includes(q)) || (w.tags && w.tags.some(t => t.toLowerCase().includes(q))));
        }
      }
      return list;
    }

    function playNextTrack() {
      if (!currentPlayingWork) {
        const list = getContextWorksList();
        if (list.length > 0) {
          currentPlayingWork = list[0];
          playTrack(0, true, currentPlayingWork);
        }
        return;
      }

      // Record current work and track into history stack before advancing
      if (currentPlayingWork && currentPlayingWork.tracks && currentPlayingWork.tracks[currentTrackIndex]) {
        playbackHistoryStack.push({ work: currentPlayingWork, trackIndex: currentTrackIndex });
        if (playbackHistoryStack.length > 50) playbackHistoryStack.shift();
      }

      // 1. RANDOM / SHUFFLE PLAYBACK
      if (isShuffle) {
        const contextList = getContextWorksList();
        if (contextList.length === 0) return;

        if (contextList.length > 1) {
          const others = contextList.filter(w => w.rjCode !== currentPlayingWork.rjCode);
          const pool = others.length > 0 ? others : contextList;
          const randWork = pool[Math.floor(Math.random() * pool.length)];
          const tracks = randWork.tracks || [];
          const randTrackIdx = tracks.length > 0 ? Math.floor(Math.random() * tracks.length) : 0;
          currentPlayingWork = randWork;
          playTrack(randTrackIdx, true, randWork);
        } else {
          const tracks = currentPlayingWork.tracks || [];
          if (tracks.length > 1) {
            let randTrackIdx = Math.floor(Math.random() * tracks.length);
            if (randTrackIdx === currentTrackIndex) randTrackIdx = (currentTrackIndex + 1) % tracks.length;
            playTrack(randTrackIdx, true);
          } else {
            playTrack(0, true);
          }
        }
        return;
      }

      // 2. SEQUENTIAL PLAYBACK
      if (currentPlayingWork.tracks && currentTrackIndex + 1 < currentPlayingWork.tracks.length) {
        playTrack(currentTrackIndex + 1, true);
      } else {
        // Last track reached -> seamlessly transition to the next work in active context order
        const contextList = getContextWorksList();
        if (contextList.length > 0) {
          const curIdx = contextList.findIndex(w => w.rjCode === currentPlayingWork.rjCode);
          let nextWork;
          if (curIdx >= 0 && curIdx + 1 < contextList.length) {
            nextWork = contextList[curIdx + 1];
          } else {
            nextWork = contextList[0];
          }
          currentPlayingWork = nextWork;
          playTrack(0, true, nextWork);
        }
      }
    }

    function playPrevTrack() {
      if (!currentPlayingWork) return;

      // 1. RANDOM / SHUFFLE PLAYBACK: Traverse back through history
      if (isShuffle) {
        if (playbackHistoryStack.length > 0) {
          const prevEntry = playbackHistoryStack.pop();
          if (prevEntry && prevEntry.work) {
            currentPlayingWork = prevEntry.work;
            playTrack(prevEntry.trackIndex || 0, true, prevEntry.work);
            return;
          }
        }
        audio.currentTime = 0;
        return;
      }

      // 2. SEQUENTIAL PLAYBACK
      if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
      }

      if (currentTrackIndex - 1 >= 0) {
        playTrack(currentTrackIndex - 1, true);
      } else {
        // First track reached -> seamlessly retreat to previous work in active context order
        const contextList = getContextWorksList();
        if (contextList.length > 0) {
          const curIdx = contextList.findIndex(w => w.rjCode === currentPlayingWork.rjCode);
          let prevWork;
          if (curIdx > 0) {
            prevWork = contextList[curIdx - 1];
          } else {
            prevWork = contextList[contextList.length - 1];
          }
          currentPlayingWork = prevWork;
          const lastTrackIdx = (prevWork.tracks && prevWork.tracks.length > 0) ? prevWork.tracks.length - 1 : 0;
          playTrack(lastTrackIdx, true, prevWork);
        }
      }
    }
    function toggleMute() {
      audio.muted = !audio.muted;
      updateMuteUI();
    }

    function updateMuteUI() {
      const isMuted = audio.muted || audio.volume === 0;
      const icon = isMuted ? '🔇' : '🔊';
      const mBtn = document.getElementById('muteBtn');
      const pmBtn = document.getElementById('popupMuteBtn');
      if (mBtn) {
        mBtn.innerText = icon;
        mBtn.title = isMuted ? 'Unmute' : 'Mute';
      }
      if (pmBtn) {
        pmBtn.innerText = icon;
        pmBtn.title = isMuted ? 'Unmute' : 'Mute';
      }
    }
    audio.addEventListener('volumechange', updateMuteUI);

    let currentTitleQuery = '';
    let currentTagQuery = '';

    function handleTitleSearch(val) {
      currentTitleQuery = val || '';
      const sidebarSearch = document.getElementById('globalSearch');
      const mobSearch = document.getElementById('mobileSearchInput');
      if (sidebarSearch && sidebarSearch.value !== val) sidebarSearch.value = val;
      if (mobSearch && mobSearch.value !== val) mobSearch.value = val;
      applyFilters();
    }

    function handleTagSearchInput(val) {
      currentTagQuery = val || '';
      const sidebarTag = document.getElementById('globalTagSearch');
      const mobTag = document.getElementById('mobileTagSearchInput');
      if (sidebarTag && sidebarTag.value !== val) sidebarTag.value = val;
      if (mobTag && mobTag.value !== val) mobTag.value = val;
      applyFilters();
    }

    function handleSearch(val) {
      handleTitleSearch(val);
    }

    function applyFilters() {
      const tQuery = (currentTitleQuery || '').trim().toLowerCase();
      const rawTagQuery = (currentTagQuery || '').trim();

      if (!tQuery && !rawTagQuery) {
        libraryCurrentPage = 1;
        renderLibraryGrid(allWorks, {});
        return;
      }

      const tagTokens = rawTagQuery ? rawTagQuery.split(/[+,]+/).map(s => s.trim().toLowerCase()).filter(Boolean) : [];

      const filtered = allWorks.filter(w => {
        // 1. Title / RJ / Circle / CV search
        if (tQuery) {
          const matchRj = w.rjCode && w.rjCode.toLowerCase().includes(tQuery);
          const matchTitle = w.title && w.title.toLowerCase().includes(tQuery);
          const matchCircle = w.circle && w.circle.toLowerCase().includes(tQuery);
          const matchCv = w.cv && w.cv.toLowerCase().includes(tQuery);
          if (!matchRj && !matchTitle && !matchCircle && !matchCv) return false;
        }

        // 2. Tag '+' multi-filter matching
        if (tagTokens.length > 0) {
          const workTags = Array.isArray(w.tags) ? w.tags : [];
          const allWorkTagStrings = [...workTags];
          if (w.cv) {
            w.cv.split(/[,、/&＋+]/).forEach(c => {
              if (c.trim()) allWorkTagStrings.push(c.trim());
            });
          }

          const allTokensMatch = tagTokens.every(token => {
            return allWorkTagStrings.some(t => {
              const tLower = t.toLowerCase();
              if (tLower.includes(token)) return true;
              const entry = getTagEntry(t);
              if (entry) {
                if (entry.romaji && entry.romaji.toLowerCase().includes(token)) return true;
                if (entry.english && entry.english.toLowerCase().includes(token)) return true;
              }
              return false;
            });
          });

          if (!allTokensMatch) return false;
        }

        return true;
      });

      libraryCurrentPage = 1;
      renderLibraryGrid(filtered, { q: currentTitleQuery, tag: currentTagQuery });
    }

    // === Zen Browser Style Tag Search Modal ===
    let zenActiveIndex = -1;
    let zenSearchResults = [];
    let zenBackupQuery = '';

    function openZenTagSearch(initialQuery = '') {
      const modal = document.getElementById('zenTagSearchModal');
      const input = document.getElementById('zenTagSearchInput');
      if (!modal || !input) return;

      zenBackupQuery = currentTagQuery || '';
      modal.style.display = 'flex';
      renderZenChips();
      
      const queryToUse = typeof initialQuery === 'string' && initialQuery.length > 0 ? initialQuery : currentTagQuery;
      const parts = (queryToUse || '').split('+');
      const lastToken = parts[parts.length - 1].trim();
      input.value = lastToken;
      
      handleZenTagInput(lastToken);
      setTimeout(() => input.focus(), 50);
    }

    function closeZenTagSearch(cancel = false) {
      const modal = document.getElementById('zenTagSearchModal');
      if (modal) modal.style.display = 'none';
      zenActiveIndex = -1;

      if (cancel) {
        currentTagQuery = zenBackupQuery || '';
        const sidebarTag = document.getElementById('globalTagSearch');
        const mobTag = document.getElementById('mobileTagSearchInput');
        if (sidebarTag) sidebarTag.value = currentTagQuery;
        if (mobTag) mobTag.value = currentTagQuery;
      }
    }

    function applyZenTagSearch() {
      const input = document.getElementById('zenTagSearchInput');
      if (input && input.value && input.value.trim()) {
        const val = input.value.trim();
        if (zenSearchResults.length > 0 && zenActiveIndex >= 0) {
          addZenTag(zenSearchResults[zenActiveIndex].tag);
        } else if (zenSearchResults.length > 0) {
          addZenTag(zenSearchResults[0].tag);
        } else {
          addZenTag(val);
        }
      }
      const pills = getActiveTagPills();
      currentTagQuery = pills.join(' + ');
      
      const sidebarTag = document.getElementById('globalTagSearch');
      const mobTag = document.getElementById('mobileTagSearchInput');
      if (sidebarTag) sidebarTag.value = currentTagQuery;
      if (mobTag) mobTag.value = currentTagQuery;

      closeZenTagSearch(false);
      if (currentView !== 'library') {
        savedScrollPositions['library'] = 0;
        shuffledLibraryWorks = null;
        switchView('library', { tag: currentTagQuery }, true, 1);
      } else {
        applyFilters();
      }
    }

    function handleZenOverlayClick(e) {
      if (e.target.id === 'zenTagSearchModal') {
        closeZenTagSearch(true);
      }
    }

    function getActiveTagPills() {
      if (!currentTagQuery) return [];
      return currentTagQuery.split('+').map(t => t.trim()).filter(Boolean);
    }

    function renderZenChips() {
      const chipsBar = document.getElementById('zenChipsBar');
      const chipsList = document.getElementById('zenChipsList');
      if (!chipsBar || !chipsList) return;

      const pills = getActiveTagPills();
      if (pills.length === 0) {
        chipsBar.style.display = 'none';
        chipsList.innerHTML = '';
        return;
      }

      chipsBar.style.display = 'flex';
      chipsList.innerHTML = pills.map((p, idx) => {
        const formatted = formatTag(p);
        return '<span class="zen-chip">' +
          '<span>' + formatted + '</span>' +
          '<span class="zen-chip-remove" onclick="removeZenTag(' + idx + ')" title="Remove tag">✕</span>' +
        '</span>';
      }).join('');
    }

    function addZenTag(tag) {
      if (!tag) return;
      const pills = getActiveTagPills();
      if (!pills.includes(tag)) {
        pills.push(tag);
      }
      currentTagQuery = pills.join(' + ') + ' + ';
      
      const sidebarTag = document.getElementById('globalTagSearch');
      const mobTag = document.getElementById('mobileTagSearchInput');
      if (sidebarTag) sidebarTag.value = currentTagQuery;
      if (mobTag) mobTag.value = currentTagQuery;

      applyFilters();
      renderZenChips();

      const input = document.getElementById('zenTagSearchInput');
      if (input) {
        input.value = '';
        handleZenTagInput('');
        input.focus();
      }
    }

    function removeZenTag(index) {
      const pills = getActiveTagPills();
      if (index >= 0 && index < pills.length) {
        pills.splice(index, 1);
      }
      currentTagQuery = pills.length > 0 ? pills.join(' + ') + ' + ' : '';
      
      const sidebarTag = document.getElementById('globalTagSearch');
      const mobTag = document.getElementById('mobileTagSearchInput');
      if (sidebarTag) sidebarTag.value = currentTagQuery;
      if (mobTag) mobTag.value = currentTagQuery;

      applyFilters();
      renderZenChips();

      const input = document.getElementById('zenTagSearchInput');
      if (input) {
        handleZenTagInput(input.value);
        input.focus();
      }
    }

    function clearAllZenTags() {
      currentTagQuery = '';
      const sidebarTag = document.getElementById('globalTagSearch');
      const mobTag = document.getElementById('mobileTagSearchInput');
      if (sidebarTag) sidebarTag.value = '';
      if (mobTag) mobTag.value = '';

      applyFilters();
      renderZenChips();

      const input = document.getElementById('zenTagSearchInput');
      if (input) {
        input.value = '';
        handleZenTagInput('');
        input.focus();
      }
    }

    function handleZenTagInput(val) {
      const query = (val || '').trim().toLowerCase();
      const container = document.getElementById('zenResultsContainer');
      const countBadge = document.getElementById('zenResultsCountBadge');
      if (!container) return;

      const baseDict = window.BASE_TAG_DICT || {};
      const userDict = window.tagDict || {};
      const allDict = Object.assign({}, baseDict, userDict);

      // Gather tag counts across allWorks
      const tagCounts = {};
      const cvCounts = {};

      allWorks.forEach(w => {
        (w.tags || []).forEach(t => {
          const clean = t.trim();
          if (clean) tagCounts[clean] = (tagCounts[clean] || 0) + 1;
        });
        if (w.cv && w.cv !== 'N/A') {
          w.cv.split(/[,、/&＋+]/).forEach(c => {
            const clean = c.trim();
            if (clean) cvCounts[clean] = (cvCounts[clean] || 0) + 1;
          });
        }
      });

      const matchedCVs = [];
      const matchedGenres = [];
      const activePills = getActiveTagPills();
      const allTagKeys = new Set([...Object.keys(tagCounts), ...Object.keys(cvCounts), ...Object.keys(allDict)]);

      allTagKeys.forEach(tag => {
        if (!tag || activePills.includes(tag)) return;
        if ((contentMode === 'PSFW' || contentMode === 'SFW') && isTagNsfw(tag)) return;
        const entry = getTagEntry(tag);
        const count = tagCounts[tag] || cvCounts[tag] || 0;
        const isCV = (entry && entry.isCV) || !!cvCounts[tag];

        let isMatch = !query;
        if (query) {
          const tagLower = tag.toLowerCase();
          if (tagLower.includes(query)) isMatch = true;
          if (entry) {
            if (entry.romaji && entry.romaji.toLowerCase().includes(query)) isMatch = true;
            if (entry.english && entry.english.toLowerCase().includes(query)) isMatch = true;
          }
        }

        if (isMatch) {
          const item = {
            tag,
            count,
            isCV,
            romaji: entry ? entry.romaji : '',
            english: entry ? entry.english : ''
          };
          if (isCV) matchedCVs.push(item);
          else matchedGenres.push(item);
        }
      });

      matchedCVs.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
      matchedGenres.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

      const topCVs = matchedCVs.slice(0, 8);
      const topGenres = matchedGenres.slice(0, 30);

      zenSearchResults = [...topCVs, ...topGenres];
      zenActiveIndex = zenSearchResults.length > 0 ? 0 : -1;

      if (countBadge) {
        countBadge.textContent = zenSearchResults.length > 0 ? (zenSearchResults.length + ' matching tags') : '';
      }

      if (zenSearchResults.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px 20px; color: #64748b;">' +
          '<div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>' +
          '<div style="font-size: 0.95rem; font-weight: 600; color: #94a3b8;">No matching tags found</div>' +
          '<div style="font-size: 0.8rem; margin-top: 4px;">Try searching in Japanese (耳かき), Rōmaji (mimikaki), or English (ear cleaning)</div>' +
        '</div>';
        return;
      }

      let html = '';
      if (topCVs.length > 0) {
        html += '<div class="zen-category-title">🎙️ Voice Actors</div>';
        topCVs.forEach((s, idx) => {
          html += renderZenResultItem(s, idx);
        });
      }

      if (topGenres.length > 0) {
        html += '<div class="zen-category-title">🏷️ Genres & Themes</div>';
        topGenres.forEach((s, idx) => {
          html += renderZenResultItem(s, topCVs.length + idx);
        });
      }

      container.innerHTML = html;
    }

    function renderZenResultItem(s, globalIdx) {
      const isSelected = globalIdx === zenActiveIndex;
      const countBadge = s.count > 0 ? '<span class="zen-tag-badge">' + s.count + ' works</span>' : '';
      const safeTag = s.tag.split('"').join('&quot;');
      
      let romajiSpan = (s.romaji && s.romaji !== s.tag) ? '<span class="zen-tag-romaji">' + s.romaji + '</span>' : '';
      let engSpan = (s.english && s.english !== s.tag && s.english !== s.romaji) ? '<span class="zen-tag-eng">' + s.english + '</span>' : '';
      let sep1 = (romajiSpan || engSpan) ? '<span class="zen-tag-sep">|</span>' : '';
      let sep2 = (romajiSpan && engSpan) ? '<span class="zen-tag-sep">|</span>' : '';

      return '<div class="zen-result-item ' + (isSelected ? 'selected' : '') + '" data-index="' + globalIdx + '" data-tag="' + safeTag + '" onclick="addZenTag(this.dataset.tag)">' +
        '<div class="zen-tag-info">' +
          '<span class="zen-tag-orig">' + s.tag + '</span>' +
          sep1 +
          romajiSpan +
          sep2 +
          engSpan +
        '</div>' +
        '<div style="display: flex; align-items: center; gap: 8px;">' +
          countBadge +
          '<span style="color: #a78bfa; font-size: 0.95rem; font-weight: bold; opacity: 0.6;">+</span>' +
        '</div>' +
      '</div>';
    }

    function handleZenTagKeydown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeZenTagSearch(true);
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (zenActiveIndex >= 0 && zenActiveIndex < zenSearchResults.length) {
          addZenTag(zenSearchResults[zenActiveIndex].tag);
        } else {
          applyZenTagSearch();
        }
        return;
      }

      if (zenSearchResults.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        zenActiveIndex = (zenActiveIndex + 1) % zenSearchResults.length;
        updateZenSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        zenActiveIndex = (zenActiveIndex - 1 + zenSearchResults.length) % zenSearchResults.length;
        updateZenSelection();
      }
    }

    function updateZenSelection() {
      const items = document.querySelectorAll('#zenResultsContainer .zen-result-item');
      items.forEach((item, idx) => {
        if (idx === zenActiveIndex) {
          item.classList.add('selected');
          item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
          item.classList.remove('selected');
        }
      });
    }

    // Global ESC key listener to close Tag Search Modal
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const modal = document.getElementById('zenTagSearchModal');
        if (modal && modal.style.display === 'flex') {
          e.preventDefault();
          closeZenTagSearch(true);
        }
      }
    });

    async function quickAddRj() {
      const rj = prompt('Enter RJ/VJ/BJ Code to import (e.g. RJ01473335, BJ01267551):');
      if (!rj) return;
      try {
        const res = await apiFetch('/api/library/resolve', { method: 'POST', body: JSON.stringify({ rjCode: rj }) });
        const data = await res.json();
        if (data.work) {
          alert('🎉 Successfully imported: ' + data.work.title);
          updateWishlistBadge();
          if (window.location.hash === '#/wishlist') loadWishlist();
          loadLibrary();
        } else if (data.wishlisted) {
          alert('⚠️ ' + rj.toUpperCase() + ' audio stream is not yet available on CDN. It has been automatically saved to your 📋 Wishlist so you can easily re-import it later once crawled!');
          updateWishlistBadge();
          if (window.location.hash === '#/wishlist') loadWishlist();
        } else {
          alert('Import failed: ' + (data.error || 'Unknown error'));
        }
      } catch (e) { alert('Error: ' + e.message); }
    }

    async function toggleFav(rjCode, event) {
      if (event) event.stopPropagation();
      const work = allWorks.find(w => w.rjCode === rjCode);
      let nextFavState = true;
      if (work) {
        work.favorite = !work.favorite;
        nextFavState = work.favorite;
      }

      const favIcons = document.querySelectorAll('.card-fav-' + rjCode);
      favIcons.forEach(icon => {
        icon.innerText = nextFavState ? '❤️' : '🤍';
        icon.title = nextFavState ? 'Favorited' : 'Add to Favorites';
        icon.style.transform = 'scale(1.35)';
        setTimeout(() => { icon.style.transform = 'scale(1)'; }, 180);
      });

      if (currentWork && currentWork.rjCode === rjCode) {
        document.getElementById('popupFavBtn').innerText = nextFavState ? '❤️' : '🤍';
      }

      try {
        await apiFetch('/api/library/favorite/' + rjCode, { method: 'POST' });
      } catch (e) {
        console.error('Failed to toggle favorite:', e);
      }
    }

    async function deleteWorkItem(rjCode) {
      if (!confirm('Remove ' + rjCode + ' from library?')) return;
      await apiFetch('/api/library/' + rjCode, { method: 'DELETE' });
      switchView('library');
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function extractRj(item) {
      if (!item) return '';
      if (typeof item === 'object') {
        item = item.rjCode || item.rj || item.id || item.code || '';
      }
      const str = String(item).trim().toUpperCase();
      if (!str) return '';
      const m = str.match(/(?:RJ|VJ|BJ)[ -]*([0-9]{4,10})/i) || str.match(/[0-9]{4,10}/);
      if (m) {
        const prefMatch = str.match(/(RJ|VJ|BJ)/i);
        const pref = prefMatch ? prefMatch[1].toUpperCase() : 'RJ';
        const digits = m[1] || m[0];
        return pref + digits;
      }
      return '';
    }

    function extractRjListFromText(text) {
      if (!text || typeof text !== 'string' || !text.trim()) return [];
      const explicitMatches = text.match(/(?:RJ|VJ|BJ)[ -]*[0-9]{4,10}/gi) || [];
      if (explicitMatches.length > 0) {
        const cleaned = explicitMatches.map(function(item) {
          const prefMatch = item.match(/(RJ|VJ|BJ)/i);
          const pref = prefMatch ? prefMatch[1].toUpperCase() : 'RJ';
          const digitsMatch = item.match(/[0-9]{4,10}/);
          return digitsMatch ? (pref + digitsMatch[0]) : '';
        }).filter(Boolean);
        return [...new Set(cleaned)];
      }

      const digitMatches = text.match(/[0-9]{6,8}/g) || [];
      if (digitMatches.length > 0) {
        return [...new Set(digitMatches.map(function(num) { return 'RJ' + num; }))];
      }

      return [];
    }

    let importBatchQueue = [];
    let nextBatchId = 1;
    let isQueueRunnerActive = false;
    let importRunning = false;

    function renderBatchQueueUI() {
      const box = document.getElementById('importProgressBox');
      const listEl = document.getElementById('importBatchQueueList');
      const btnMinHdr = document.getElementById('btnMinimizeImport');
      const btnMinFtr = document.getElementById('btnMinimizeImportFooter');
      const btnRun = document.getElementById('btnRunImport');
      const btnCancel = document.getElementById('btnCancelImport');

      if (!box || !listEl) return;

      if (importBatchQueue.length === 0) {
        box.style.display = 'none';
        listEl.innerHTML = '';
        if (btnMinHdr) btnMinHdr.style.display = 'none';
        if (btnMinFtr) btnMinFtr.style.display = 'none';
        if (btnRun) {
          btnRun.disabled = false;
          btnRun.innerText = 'Start Batch Import';
        }
        if (btnCancel) {
          btnCancel.disabled = false;
          btnCancel.innerText = 'Cancel';
          btnCancel.onclick = closeImportModal;
        }
        return;
      }

      box.style.display = 'block';
      if (btnMinHdr) btnMinHdr.style.display = isQueueRunnerActive ? 'inline-block' : 'none';
      if (btnMinFtr) btnMinFtr.style.display = isQueueRunnerActive ? 'inline-block' : 'none';

      if (btnRun) {
        btnRun.disabled = false;
        btnRun.innerText = isQueueRunnerActive ? '+ Add to Queue' : 'Start Batch Import';
      }
      if (btnCancel) {
        btnCancel.disabled = false;
        if (isQueueRunnerActive) {
          btnCancel.innerText = 'Stop All';
          btnCancel.onclick = stopImportFromDock;
        } else {
          btnCancel.innerText = 'Clear & Close';
          btnCancel.onclick = () => {
            importBatchQueue = [];
            closeImportModal();
          };
        }
      }

      let html = '';
      for (const job of importBatchQueue) {
        const progressPct = job.total > 0 ? Math.round((job.current / job.total) * 100) : 0;
        let statusBadge = '';
        let barGradient = 'linear-gradient(90deg, #ff3366, #38bdf8)';
        let canStop = false;

        if (job.status === 'running') {
          statusBadge = '<span style="background: rgba(56,189,248,0.2); color: #38bdf8; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">Running 🚀</span>';
          barGradient = 'linear-gradient(90deg, #ff3366, #38bdf8)';
          canStop = true;
        } else if (job.status === 'queued') {
          statusBadge = '<span style="background: rgba(245,158,11,0.2); color: #f59e0b; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">Queued ⏳</span>';
          barGradient = '#374151';
          canStop = true;
        } else if (job.status === 'completed') {
          statusBadge = '<span style="background: rgba(52,211,153,0.2); color: #34d399; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">Done ✅</span>';
          barGradient = '#10b981';
        } else if (job.status === 'stopped') {
          statusBadge = '<span style="background: rgba(239,68,68,0.2); color: #ef4444; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">Stopped ⏹️</span>';
          barGradient = '#ef4444';
        }

        const pctColor = job.status === 'completed' ? '#34d399' : (job.status === 'stopped' ? '#ef4444' : '#38bdf8');
        const stopBtnHtml = canStop ? ('<button type="button" onclick="stopBatchJob(' + job.id + ')" class="btn-outline" style="padding: 1px 6px; font-size: 0.72rem; color: #f87171; border-color: rgba(248,113,113,0.4);" title="Stop this batch">⏹️</button>') : '';
        const downloadBtnHtml = ((job.status === 'completed' || job.status === 'stopped') && job.failedItems && job.failedItems.length > 0) ? ('<button type="button" onclick="downloadJobFailureListById(' + job.id + ')" class="btn-outline" style="padding: 1px 7px; font-size: 0.72rem; color: #f59e0b; border-color: rgba(245,158,11,0.4);" title="Download ' + job.failedItems.length + ' failed items (.txt)">📥 ' + job.failedItems.length + ' Failed .txt</button>') : '';
        const moeDiagBtnHtml = ((job.status === 'completed' || job.status === 'stopped') && job.moeDiagnostics && job.moeDiagnostics.length > 0) ? ('<button type="button" onclick="downloadMoeDiagnosticListById(' + job.id + ')" class="btn-outline" style="padding: 1px 7px; font-size: 0.72rem; color: #a855f7; border-color: rgba(168,85,247,0.4);" title="Download ' + job.moeDiagnostics.length + ' Moe diagnostic pattern logs (.txt)">⚠️ ' + job.moeDiagnostics.length + ' Moe Pattern Log</button>') : '';

        html += '<div class="batch-job-card" style="background: #111420; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px 12px;">' +
          '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 0.82rem;">' +
            '<div style="display: flex; align-items: center; gap: 8px;">' +
              '<span style="font-weight: 700; color: #fff;">' + escapeHtml(job.name) + '</span>' +
              statusBadge +
            '</div>' +
            '<div style="display: flex; align-items: center; gap: 8px;">' +
              '<span style="font-weight: 700; color: ' + pctColor + '; font-size: 0.8rem;">' +
                progressPct + '% (' + job.current + '/' + job.total + ')' +
              '</span>' +
              downloadBtnHtml +
              moeDiagBtnHtml +
              stopBtnHtml +
            '</div>' +
          '</div>' +
          '<div style="width: 100%; height: 5px; background: #1a1c26; border-radius: 3px; overflow: hidden; margin-bottom: 6px;">' +
            '<div style="width: ' + progressPct + '%; height: 100%; background: ' + barGradient + '; transition: width 0.2s;"></div>' +
          '</div>' +
          '<div style="font-size: 0.75rem; color: var(--text-muted); display: flex; justify-content: space-between; align-items: center; gap: 10px;">' +
            '<span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 68%;">' + escapeHtml(job.currentStatusText || '') + '</span>' +
            '<span style="font-size: 0.72rem; flex-shrink: 0; color: #94a3b8;">' + job.succeeded + ' added • ' + job.failed + ' wishlist</span>' +
          '</div>' +
        '</div>';
      }
      listEl.innerHTML = html;
    }

    function updateBackgroundImportWidgets(progressPct, statusMsg) {
      const isMobile = window.innerWidth <= 768;
      const sWidget = document.getElementById('sidebarImportWidget');
      const mBanner = document.getElementById('mobileImportBanner');
      const modal = document.getElementById('importModal');
      const isModalVisible = modal && (modal.style.display === 'flex' || modal.style.display === 'block');

      const hasActive = isQueueRunnerActive || importBatchQueue.some(j => j.status === 'running' || j.status === 'queued');

      if (hasActive && !isModalVisible) {
        if (isMobile) {
          if (mBanner) mBanner.style.display = 'block';
          if (sWidget) sWidget.style.display = 'none';
        } else {
          if (sWidget) sWidget.style.display = 'block';
          if (mBanner) mBanner.style.display = 'none';
        }
      }

      const sPct = document.getElementById('sidebarImportPct');
      const sStatus = document.getElementById('sidebarImportStatus');
      const sBar = document.getElementById('sidebarImportProgressBar');

      const mPct = document.getElementById('mobileImportPct');
      const mStatus = document.getElementById('mobileImportStatus');
      const mBar = document.getElementById('mobileImportProgressBar');

      const pctStr = progressPct + '%';
      if (sPct) sPct.innerText = pctStr;
      if (sStatus) sStatus.innerText = statusMsg;
      if (sBar) sBar.style.width = pctStr;

      if (mPct) mPct.innerText = pctStr;
      if (mStatus) mStatus.innerText = statusMsg;
      if (mBar) mBar.style.width = pctStr;
    }

    function minimizeImportToDock() {
      const modal = document.getElementById('importModal');
      if (modal) modal.style.display = 'none';

      const isMobile = window.innerWidth <= 768;
      const sWidget = document.getElementById('sidebarImportWidget');
      const mBanner = document.getElementById('mobileImportBanner');

      if (isQueueRunnerActive || importBatchQueue.some(j => j.status === 'running' || j.status === 'queued')) {
        if (isMobile) {
          if (mBanner) mBanner.style.display = 'block';
          if (sWidget) sWidget.style.display = 'none';
        } else {
          if (sWidget) sWidget.style.display = 'block';
          if (mBanner) mBanner.style.display = 'none';
        }
        showToast('📥 Batch import running in background');
      }
    }

    function expandImportFromDock() {
      const sWidget = document.getElementById('sidebarImportWidget');
      const mBanner = document.getElementById('mobileImportBanner');
      if (sWidget) sWidget.style.display = 'none';
      if (mBanner) mBanner.style.display = 'none';

      const modal = document.getElementById('importModal');
      if (modal) modal.style.display = 'flex';
      renderBatchQueueUI();
    }

    function stopBatchJob(jobId) {
      const job = importBatchQueue.find(j => j.id === jobId);
      if (!job) return;
      if (job.status === 'queued') {
        job.status = 'stopped';
        job.currentStatusText = 'Canceled in queue';
      } else if (job.status === 'running') {
        job.stopRequested = true;
        job.currentStatusText = 'Stopping...';
      }
      renderBatchQueueUI();
    }

    function downloadJobFailureList(job) {
      if (!job || !job.failedItems || job.failedItems.length === 0) return;
      const rjList = [...new Set(job.failedItems.map(f => f.rjCode).filter(Boolean))];
      if (rjList.length === 0) return;
      const content = rjList.join(String.fromCharCode(10));
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = (job.name || 'batch_import').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
      a.download = safeName + '_failed_wishlist_' + new Date().toISOString().slice(0, 10) + '.txt';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (a.parentNode) a.parentNode.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);
    }

    function downloadJobFailureListById(jobId) {
      const job = importBatchQueue.find(j => j.id === jobId);
      if (job) downloadJobFailureList(job);
    }

    function downloadMoeDiagnosticList(job) {
      if (!job || !job.moeDiagnostics || job.moeDiagnostics.length === 0) return;
      const lines = [
        '# HentaiASMR Moe Audio Pattern Diagnostic Log',
        '# Generated: ' + new Date().toISOString(),
        '# Batch: ' + (job.name || 'batch_import'),
        '# Note: The following works had missing CDN audio under standard Moe patterns (/merge/{RJ}.mp3 or /{track}.mp3).',
        '============================================================'
      ];
      for (const diag of job.moeDiagnostics) {
        lines.push('');
        lines.push('[Work: ' + diag.rjCode + ']');
        lines.push('Title: ' + (diag.title || 'N/A'));
        lines.push('Post ID: ' + (diag.postId || 'N/A'));
        lines.push('Post Slug: ' + (diag.slug || 'N/A'));
        if (diag.postLink) lines.push('Post Link: ' + diag.postLink);
        lines.push('');
        lines.push('Sources Availability Breakdown:');
        if (diag.sourcesBreakdown) {
          const sb = diag.sourcesBreakdown;
          lines.push('  • JapaneseASMR (weeab0o.xyz CDN): ' + (sb.japaneseAsmr && sb.japaneseAsmr.found ? ('✅ AVAILABLE (' + (sb.japaneseAsmr.isHls ? 'HLS .m3u8 stream' : sb.japaneseAsmr.trackCount + ' discrete MP3s') + ' -> ' + sb.japaneseAsmr.sampleUrl + ')') : '❌ NOT FOUND (404)'));
          lines.push('  • HentaiASMR Moe CDN (cdn.hentaiasmr.moe): ' + (sb.hentaiAsmrMoe && sb.hentaiAsmrMoe.found ? ('✅ AVAILABLE (' + (sb.hentaiAsmrMoe.pattern === 'merge' ? 'Single Merged Track' : sb.hentaiAsmrMoe.trackCount + ' Multi-tracks') + ' -> ' + sb.hentaiAsmrMoe.sampleUrl + ')') : '❌ NOT FOUND (404 on known CDN paths)'));
        } else {
          lines.push('  • HentaiASMR Moe CDN (cdn.hentaiasmr.moe): ❌ NOT FOUND (404 on known CDN paths)');
        }
        lines.push('');
        lines.push('Moe CDN Probed URLs (Failed / 404):');
        if (diag.triedUrls && diag.triedUrls.length > 0) {
          diag.triedUrls.forEach(u => lines.push('  - ' + u));
        } else {
          lines.push('  - (No probe URLs recorded)');
        }
        lines.push('');
        if (diag.isWorkingAudioFound && diag.chosenTracks && diag.chosenTracks.length > 0) {
          lines.push('Final Chosen Working Audio Source: ' + (diag.selectedSource || 'Alternative Source'));
          lines.push('Final Working Audio Tracks (' + diag.chosenTracks.length + ' tracks):');
          diag.chosenTracks.forEach((t, i) => {
            lines.push('  [' + (i + 1) + '] ' + (t.title || 'Track') + (t.isHls ? ' [HLS]' : ''));
            lines.push('      Direct Audio Link: ' + (t.rawUrl || t.streamUrl));
          });
        } else {
          lines.push('Final Chosen Working Audio Source: NONE (All tried sources failed - Work Wishlisted)');
          if (diag.failureReason) {
            lines.push('Failure Reason: ' + diag.failureReason);
          }
        }
        lines.push('------------------------------------------------------------');
      }
      const content = lines.join(String.fromCharCode(10));
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = (job.name || 'batch_import').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
      a.download = safeName + '_moe_unresolved_patterns_' + new Date().toISOString().slice(0, 10) + '.txt';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (a.parentNode) a.parentNode.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);
    }

    function downloadMoeDiagnosticListById(jobId) {
      const job = importBatchQueue.find(j => j.id === jobId);
      if (job) downloadMoeDiagnosticList(job);
    }

    function stopImportFromDock() {
      for (const job of importBatchQueue) {
        if (job.status === 'queued') {
          job.status = 'stopped';
          job.currentStatusText = 'Canceled in queue';
        } else if (job.status === 'running') {
          job.stopRequested = true;
          job.currentStatusText = 'Stopping...';
        }
      }
      const sBtn = document.getElementById('sidebarBtnStop');
      const mBtn = document.getElementById('mobileBtnStop');
      if (sBtn) { sBtn.disabled = true; sBtn.innerText = '⏳'; }
      if (mBtn) { mBtn.disabled = true; mBtn.innerText = 'Stopping...'; }
      renderBatchQueueUI();
    }

    function handleBeforeUnloadWarn(e) {
      if (isQueueRunnerActive) {
        e.preventDefault();
        e.returnValue = 'Batch imports are currently in progress. Leaving or refreshing will stop the queue.';
        return e.returnValue;
      }
    }

    function openImportModal() {
      const modal = document.getElementById('importModal');
      if (!modal) return;
      
      const ta = document.getElementById('importTextarea');
      const fi = document.getElementById('importFileInput');
      const badge = document.getElementById('importCountBadge');
      
      if (!isQueueRunnerActive) {
        if (ta && !ta.value) badge.innerText = '';
      }
      
      renderBatchQueueUI();
      modal.style.display = 'flex';

      const sWidget = document.getElementById('sidebarImportWidget');
      const mBanner = document.getElementById('mobileImportBanner');
      if (sWidget) sWidget.style.display = 'none';
      if (mBanner) mBanner.style.display = 'none';

      if (ta && !isQueueRunnerActive) ta.focus();
    }

    function closeImportModal() {
      const modal = document.getElementById('importModal');
      if (modal) modal.style.display = 'none';
      
      if (isQueueRunnerActive || importBatchQueue.some(j => j.status === 'running' || j.status === 'queued')) {
        const isMobile = window.innerWidth <= 768;
        const sWidget = document.getElementById('sidebarImportWidget');
        const mBanner = document.getElementById('mobileImportBanner');
        if (isMobile) {
          if (mBanner) mBanner.style.display = 'block';
          if (sWidget) sWidget.style.display = 'none';
        } else {
          if (sWidget) sWidget.style.display = 'block';
          if (mBanner) mBanner.style.display = 'none';
        }
        showToast('📥 Batch import running in background');
      } else {
        const ta = document.getElementById('importTextarea');
        if (ta) ta.value = '';
        const fi = document.getElementById('importFileInput');
        if (fi) fi.value = '';
        const badge = document.getElementById('importCountBadge');
        if (badge) badge.innerText = '';
      }
    }
    function openPlaylistModal() { document.getElementById('playlistModal').style.display = 'flex'; }
    function closePlaylistModal() { document.getElementById('playlistModal').style.display = 'none'; }

    async function submitCreatePlaylist() {
      const name = document.getElementById('newPlName').value.trim();
      const desc = document.getElementById('newPlDesc').value.trim();
      if (!name) return;
        await apiFetch('/api/playlists', { method: 'POST', body: JSON.stringify({ name: name, description: desc }) });
      closePlaylistModal();
      loadPlaylists();
    }

    function updateImportCountBadge() {
      const ta = document.getElementById('importTextarea');
      const badge = document.getElementById('importCountBadge');
      if (!ta || !badge) return;
      const list = extractRjListFromText(ta.value);
      badge.innerText = list.length > 0 ? (list.length + ' work' + (list.length > 1 ? 's' : '') + ' detected') : '';
    }

    function handleFileUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const ta = document.getElementById('importTextarea');
        if (ta) {
          ta.value = event.target.result;
          updateImportCountBadge();
        }
      };
      reader.readAsText(file);
    }

    let pageImportItems = [];
    let pageImportViewMode = 'grid';
    let pageImportShowOriginalArt = false;
    let pageImportHideImported = true;

    function clearPageImportText() {
      const ta = document.getElementById('pageImportTextarea');
      if (ta) {
        ta.value = '';
        ta.focus();
      }
      const fileInput = document.getElementById('pageImportFileInput');
      if (fileInput) fileInput.value = '';
    }

    function togglePageImportOriginalArt(checked) {
      pageImportShowOriginalArt = !!checked;
      renderPageImportPreview();
    }

    function togglePageImportHideImported(checked) {
      pageImportHideImported = !!checked;
      renderPageImportPreview();
    }

    function slidePageImportCarousel(direction) {
      const wrap = document.getElementById('pageImportCarouselWrap');
      if (!wrap) return;
      const scrollAmount = (direction > 0 ? 1 : -1) * Math.max(260, wrap.clientWidth * 0.75);
      wrap.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }

    function openPageImportModal() {
      const modal = document.getElementById('pageImportModal');
      if (!modal) return;
      pageImportShowOriginalArt = (contentMode === 'NSFW');
      pageImportHideImported = true;
      const chkArt = document.getElementById('pageImportOriginalArtCheck');
      if (chkArt) chkArt.checked = pageImportShowOriginalArt;
      const chkHide = document.getElementById('pageImportHideImportedCheck');
      if (chkHide) chkHide.checked = true;
      document.getElementById('pageImportStepInput').style.display = 'flex';
      document.getElementById('pageImportStepPreview').style.display = 'none';
      modal.style.display = 'flex';
      const ta = document.getElementById('pageImportTextarea');
      if (ta) ta.focus();
    }

    function closePageImportModal() {
      const modal = document.getElementById('pageImportModal');
      if (modal) modal.style.display = 'none';
    }

    function backToPageImportInput() {
      document.getElementById('pageImportStepPreview').style.display = 'none';
      document.getElementById('pageImportStepInput').style.display = 'flex';
    }

    function handlePageImportFileUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        document.getElementById('pageImportTextarea').value = event.target.result;
      };
      reader.readAsText(file);
    }

    function setPageImportViewMode(mode) {
      pageImportViewMode = mode;
      const btnCarousel = document.getElementById('btnPageImportViewCarousel');
      const btnGrid = document.getElementById('btnPageImportViewGrid');
      const btnLeft = document.getElementById('btnPageImportSlideLeft');
      const btnRight = document.getElementById('btnPageImportSlideRight');

      if (btnCarousel && btnGrid) {
        if (mode === 'carousel') {
          btnCarousel.classList.add('active');
          btnGrid.classList.remove('active');
          if (btnLeft) btnLeft.style.display = 'flex';
          if (btnRight) btnRight.style.display = 'flex';
        } else {
          btnCarousel.classList.remove('active');
          btnGrid.classList.add('active');
          if (btnLeft) btnLeft.style.display = 'none';
          if (btnRight) btnRight.style.display = 'none';
        }
      }
      renderPageImportPreview();
    }

    function normRjKey(str) {
      if (!str) return '';
      const clean = String(str).toUpperCase().trim();
      const m = clean.match(/^(?:RJ|VJ|BJ)?0*([0-9]+)$/i);
      if (m) {
        const prefMatch = clean.match(/(RJ|VJ|BJ)/i);
        const pref = prefMatch ? prefMatch[1].toUpperCase() : 'RJ';
        return pref + m[1];
      }
      return clean;
    }

    function parsePageImportText(rawText) {
      if (!rawText || !rawText.trim()) return [];

      const uniqueRjs = extractRjListFromText(rawText);
      if (uniqueRjs.length === 0) return [];

      const libraryRjSet = new Set();
      (allWorks || []).forEach(function(w) {
        const raw = (w.rj || w.id || w.rjCode || '').toUpperCase().trim();
        if (raw) {
          libraryRjSet.add(raw);
          libraryRjSet.add(normRjKey(raw));
        }
      });

      const lines = rawText.split(String.fromCharCode(10));

      function extractBrackets(str) {
        const items = [];
        let open = -1;
        for (let i = 0; i < str.length; i++) {
          if (str[i] === '[') open = i;
          else if (str[i] === ']' && open !== -1) {
            items.push(str.substring(open + 1, i).trim());
            open = -1;
          }
        }
        return items;
      }

      function isDigitsOnly(s) {
        if (!s) return false;
        for (let i = 0; i < s.length; i++) {
          const c = s.charCodeAt(i);
          if (c < 48 || c > 57) return false;
        }
        return true;
      }

      return uniqueRjs.map(function(rj) {
        let title = '';
        let circle = '';
        let cv = '';
        const inLibrary = libraryRjSet.has(rj) || libraryRjSet.has(normRjKey(rj));

        const lineIdx = lines.findIndex(function(l) { return l.toUpperCase().indexOf(rj) !== -1; });
        if (lineIdx !== -1) {
          const line = lines[lineIdx].trim();

          // Check surrounding lines for CV and Circle
          for (let offset = -2; offset <= 4; offset++) {
            const checkIdx = lineIdx + offset;
            if (checkIdx >= 0 && checkIdx < lines.length) {
              const checkLine = lines[checkIdx].trim();

              // CV check
              const colonIdx = Math.max(checkLine.indexOf(':'), checkLine.indexOf('：'));
              if (colonIdx !== -1 && !cv) {
                const prefix = checkLine.substring(0, colonIdx).toUpperCase().trim();
                if (prefix === 'CV' || prefix === 'CAST' || prefix === 'ACTOR' || checkLine.indexOf('声優') !== -1) {
                  cv = checkLine.substring(colonIdx + 1).trim();
                }
              }

              // Circle check from brackets
              if (!circle) {
                const bItems = extractBrackets(checkLine);
                for (let b = 0; b < bItems.length; b++) {
                  const item = bItems[b];
                  if (item.toUpperCase().indexOf(rj) === -1 && !isDigitsOnly(item) && item.length > 1) {
                    circle = item;
                    break;
                  }
                }
              }
            }
          }

          // Title extraction
          let cleanLine = line.replace(/\[\s*(?:RJ|VJ|BJ)?[0-9]{4,10}\s*\]/gi, '');
          cleanLine = cleanLine.replace(/(?:RJ|VJ|BJ)[0-9]{4,10}/gi, '');
          const bItems = extractBrackets(cleanLine);
          bItems.forEach(function(b) {
            cleanLine = cleanLine.replace('[' + b + ']', '');
          });
          cleanLine = cleanLine.replace(/\s+/g, ' ').trim();
          cleanLine = cleanLine.replace(/^[-–—:：\s]+/, '').trim();
          if (cleanLine.length > 2) {
            title = cleanLine;
          }
        }

        return {
          rj: rj,
          rjCode: rj,
          title: title || ('Work ' + rj),
          circle: circle,
          cv: cv,
          inLibrary: inLibrary,
          selected: !inLibrary
        };
      });
    }

    async function parseAndShowPagePreview() {
      const ta = document.getElementById('pageImportTextarea');
      const text = ta ? ta.value : '';
      if (!text || !text.trim()) {
        alert('Please paste some webpage text or catalog text first.');
        return;
      }

      if (!allWorks || allWorks.length === 0) {
        try {
          const works = await apiFetchJson('/api/library');
          if (Array.isArray(works)) allWorks = works;
        } catch(e) {}
      }
      const parsed = parsePageImportText(text);

      if (parsed.length === 0) {
        alert('No valid RJ/VJ/BJ codes found in the pasted text. Please ensure the text contains codes like RJ01609839 or BJ01267551.');
        return;
      }

      pageImportItems = parsed;
      pageImportShowOriginalArt = (contentMode === 'NSFW');
      pageImportHideImported = true;
      const chkArt = document.getElementById('pageImportOriginalArtCheck');
      if (chkArt) chkArt.checked = pageImportShowOriginalArt;
      const chkHide = document.getElementById('pageImportHideImportedCheck');
      if (chkHide) chkHide.checked = true;
      document.getElementById('pageImportStepInput').style.display = 'none';
      document.getElementById('pageImportStepPreview').style.display = 'flex';
      
      const initialMode = (window.innerWidth < 768) ? 'carousel' : 'grid';
      setPageImportViewMode(initialMode);
    }

    function renderPageImportPreview() {
      const container = document.getElementById('pageImportCarouselWrap');
      if (!container) return;

      const total = pageImportItems.length;
      const visibleItems = pageImportItems.filter(function(x) {
        return !pageImportHideImported || !x.inLibrary;
      });
      const selectedCount = pageImportItems.filter(function(x) { return x.selected; }).length;

      const countBadge = document.getElementById('pageImportSelectionCount');
      if (countBadge) {
        const hiddenCount = total - visibleItems.length;
        countBadge.innerText = selectedCount + '/' + total + ' works selected' + (pageImportHideImported && hiddenCount > 0 ? ' (' + hiddenCount + ' in-library hidden)' : '');
      }

      const finalBtnCount = document.getElementById('pageImportFinalBtnCount');
      if (finalBtnCount) {
        finalBtnCount.innerText = selectedCount;
      }

      const finishBtn = document.getElementById('btnFinishPageImport');
      if (finishBtn) {
        finishBtn.disabled = (selectedCount === 0);
      }

      if (total === 0) {
        container.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 40px;">No works found to preview.</div>';
        return;
      }

      if (visibleItems.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 40px; background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.25); border-radius: 12px; margin: 20px;"><div style="font-size: 2rem; margin-bottom: 8px;">📚</div><div style="font-weight: 700; color: #fff; font-size: 1rem; margin-bottom: 6px;">All ' + total + ' works are already in your library!</div><div style="font-size: 0.85rem; color: #94a3b8;">Uncheck "✨ Unimported Only" above if you wish to review or re-import them.</div></div>';
        return;
      }

      const isCarousel = (pageImportViewMode === 'carousel');
      container.className = isCarousel ? 'page-import-carousel' : 'page-import-grid';

      function safeAttr(str) {
        if (!str) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      }

      let html = '';
      visibleItems.forEach(function(item) {
        const isExcluded = !item.selected;
        const rawCoverUrl = '/image-proxy?rj=' + item.rj;
        let finalCover = rawCoverUrl;
        let isDisguised = false;
        if (!pageImportShowOriginalArt && (contentMode === 'PSFW' || contentMode === 'SFW')) {
          const dummyWork = { id: item.rj, rjCode: item.rj, coverUrl: rawCoverUrl, title: item.title, isNsfw: true };
          const coverObj = (typeof getDisplayCover === 'function') ? getDisplayCover(dummyWork) : { coverUrl: rawCoverUrl };
          finalCover = coverObj.coverUrl;
          isDisguised = !!coverObj.isDisguised;
        }

        html += '<div class="page-import-card ' + (isExcluded ? 'excluded' : '') + '" data-rj="' + item.rj + '" onclick="togglePageImportItem(this.dataset.rj)" title="' + (isExcluded ? 'Click to Include' : 'Click to Exclude') + '">';
        html += '  <div class="import-check-overlay">' + (item.selected ? '✓' : '✕') + '</div>';
        html += '  <div style="position: relative; width: 100%; aspect-ratio: 1; border-radius: 10px; overflow: hidden; background: #0c0d12; margin-bottom: 10px;">';
        html += '    <img src="' + finalCover + '" data-rj="' + item.rj + '" onerror="handleImgError(this, this.dataset.rj)" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s;" alt="' + safeAttr(item.rj) + '">';
        if (isDisguised) {
          html += '    <div class="disguised-overlay" style="top:6px; left:6px;"><span class="disguised-badge" style="font-size:0.65rem; padding:1px 5px;">🎭 SFW</span></div>';
        }
        if (item.inLibrary) {
          html += '    <div style="position: absolute; bottom: 6px; left: 6px; background: rgba(16, 185, 129, 0.9); color: #fff; font-size: 0.68rem; font-weight: 800; padding: 2px 7px; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.5); backdrop-filter: blur(4px);">📚 In Library</div>';
        } else {
          html += '    <div style="position: absolute; bottom: 6px; left: 6px; background: rgba(56, 189, 248, 0.9); color: #000; font-size: 0.68rem; font-weight: 800; padding: 2px 7px; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.5); backdrop-filter: blur(4px);">✨ New</div>';
        }
        html += '  </div>';
        html += '  <div style="display: flex; flex-direction: column; gap: 4px; flex: 1;">';
        html += '    <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">';
        html += '      <span style="font-family: monospace; font-size: 0.78rem; font-weight: 800; color: #38bdf8; background: rgba(56, 189, 248, 0.12); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(56,189,248,0.25);">' + item.rj + '</span>';
        if (item.circle) {
          html += '      <span style="font-size: 0.7rem; color: #94a3b8; max-width: 110px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="' + safeAttr(item.circle) + '">🏛️ ' + safeAttr(item.circle) + '</span>';
        }
        html += '    </div>';
        html += '    <div style="font-size: 0.82rem; font-weight: 700; color: #fff; line-height: 1.35; max-height: 2.7em; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; margin-top: 2px;" title="' + safeAttr(item.title) + '">' + safeAttr(item.title) + '</div>';
        if (item.cv) {
          html += '    <div style="font-size: 0.72rem; color: #38bdf8; margin-top: auto; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="' + safeAttr(item.cv) + '">🎙️ ' + safeAttr(item.cv) + '</div>';
        }
        html += '    <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 0.7rem; color: ' + (item.selected ? '#38bdf8' : '#ef4444') + '; font-weight: 700; text-align: center;">' + (item.selected ? '✓ Will Import' : '✕ Excluded') + '</div>';
        html += '  </div>';
        html += '</div>';
      });

      container.innerHTML = html;
    }

    function togglePageImportItem(rj) {
      const item = pageImportItems.find(x => x.rj === rj);
      if (item) {
        item.selected = !item.selected;
        renderPageImportPreview();
      }
    }

    function pageImportSelectAll(selectVal) {
      pageImportItems.forEach(function(x) {
        if (!pageImportHideImported || !x.inLibrary) {
          x.selected = !!selectVal;
        }
      });
      renderPageImportPreview();
    }

    async function startPageImportExecution() {
      if (!isAdmin) {
        openAdminModal('Please unlock Admin access first to import works.');
        return;
      }
      const selectedItems = pageImportItems.filter(x => x.selected);
      if (selectedItems.length === 0) {
        alert('Please select at least 1 work to import.');
        return;
      }
      closePageImportModal();
      await executeBatchImportRjList(selectedItems, 'Page Import (' + selectedItems.length + ' works)', { keepModalOpen: false, rawItems: selectedItems });
    }

    async function executeBatchImportRjList(rjList, batchLabel, options = {}) {
      if (!isAdmin) {
        openAdminModal('Please unlock Admin access first to import works.');
        return;
      }
      if (!rjList || rjList.length === 0) return;
      const cleanList = [...new Set((rjList || []).map(extractRj).filter(Boolean))];

      if (cleanList.length === 0) {
        alert('No valid RJ/VJ/BJ codes found to import.');
        return;
      }

      // Pre-stash fail-safe to DB Wishlist with automatic retry
      const preStashPayload = (options.rawItems && Array.isArray(options.rawItems)) ? options.rawItems : cleanList;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const preRes = await apiFetch('/api/wishlist/pre-stash', {
            method: 'POST',
            body: JSON.stringify({ items: preStashPayload })
          });
          if (preRes.ok) {
            const preData = await preRes.json().catch(() => ({}));
            if (preData && Array.isArray(preData.wishlist)) {
              updateWishlistBadge(preData.wishlist.length);
            } else {
              await updateWishlistBadge();
            }
            if (window.location.hash === '#/wishlist') {
              loadWishlist();
            }
            break;
          }
        } catch (e) {
          console.warn('[PreStash Attempt ' + attempt + ' Failed]', e);
          if (attempt < 3) await new Promise(r => setTimeout(r, 350 * attempt));
        }
      }

      const job = {
        id: nextBatchId++,
        name: batchLabel || ('Batch #' + (importBatchQueue.length + 1) + ' (' + cleanList.length + ' works)'),
        rjList: cleanList,
        total: cleanList.length,
        current: 0,
        succeeded: 0,
        failed: 0,
        failedItems: [],
        status: 'queued',
        currentStatusText: 'Waiting in queue...',
        stopRequested: false
      };

      importBatchQueue.push(job);
      renderBatchQueueUI();

      const keepModalOpen = options.keepModalOpen === true;
      const modal = document.getElementById('importModal');

      if (keepModalOpen) {
        if (modal) modal.style.display = 'flex';
      } else {
        if (modal && !isQueueRunnerActive) modal.style.display = 'none';
        closePageImportModal();

        const isMobile = window.innerWidth <= 768;
        const sWidget = document.getElementById('sidebarImportWidget');
        const mBanner = document.getElementById('mobileImportBanner');
        if (isMobile) {
          if (mBanner) mBanner.style.display = 'block';
          if (sWidget) sWidget.style.display = 'none';
        } else {
          if (sWidget) sWidget.style.display = 'block';
          if (mBanner) mBanner.style.display = 'none';
        }
        updateBackgroundImportWidgets(0, '🚀 ' + job.name + ': Queued');
      }

      showToast('📥 Added ' + cleanList.length + ' works to Import Queue');

      if (!isQueueRunnerActive) {
        await processImportQueue();
      }
    }

    async function processImportQueue() {
      if (isQueueRunnerActive) return;
      isQueueRunnerActive = true;
      importRunning = true;
      window.addEventListener('beforeunload', handleBeforeUnloadWarn);

      const logs = document.getElementById('importLiveLogs');

      while (true) {
        const activeJob = importBatchQueue.find(j => j.status === 'queued');
        if (!activeJob) break;

        activeJob.status = 'running';
        renderBatchQueueUI();

        if (logs) {
          const logHeader = document.createElement('div');
          logHeader.style.color = '#38bdf8';
          logHeader.style.fontWeight = 'bold';
          logHeader.innerText = '🚀 Starting ' + activeJob.name + '...';
          logs.appendChild(logHeader);
          logs.scrollTop = logs.scrollHeight;
        }

        for (let i = 0; i < activeJob.total; i++) {
          if (activeJob.stopRequested) {
            activeJob.status = 'stopped';
            activeJob.currentStatusText = '⏹️ Stopped at ' + (i + 1) + '/' + activeJob.total;
            if (logs) {
              const logEntry = document.createElement('div');
              logEntry.style.color = '#f59e0b';
              logEntry.innerText = '⏹️ ' + activeJob.name + ' stopped by user at work ' + (i + 1) + '/' + activeJob.total;
              logs.appendChild(logEntry);
              logs.scrollTop = logs.scrollHeight;
            }
            break;
          }

          const rj = activeJob.rjList[i];
          activeJob.current = i + 1;
          const progressPct = Math.round(((i + 1) / activeJob.total) * 100);
          const statusMsg = activeJob.name + ': ' + (i + 1) + '/' + activeJob.total + ' (' + rj + ')';
          activeJob.currentStatusText = 'Importing ' + (i + 1) + '/' + activeJob.total + ': ' + rj + '...';

          renderBatchQueueUI();
          updateBackgroundImportWidgets(progressPct, statusMsg);

          try {
            const res = await apiFetch('/api/library/resolve', {
              method: 'POST',
              body: JSON.stringify({ rjCode: rj })
            });

            let data = null;
            try {
              const textData = await res.text();
              data = JSON.parse(textData);
            } catch (jsonErr) {
              data = { error: 'Server returned HTTP ' + res.status + ' (' + (res.statusText || 'Gateway error') + ')' };
            }

            if (res.status === 401) {
              if (logs) {
                const logEntry = document.createElement('div');
                logEntry.style.color = '#ef4444';
                logEntry.innerText = '🔒 Unauthorized: Please enter your admin passcode.';
                logs.appendChild(logEntry);
                logs.scrollTop = logs.scrollHeight;
              }
              activeJob.status = 'stopped';
              activeJob.currentStatusText = 'Unauthorized';
              break;
            }

            if (data && data.moeDiagnostic) {
              const diag = data.moeDiagnostic;
              if (data.work && Array.isArray(data.work.tracks) && data.work.tracks.length > 0) {
                if (!diag.chosenTracks || diag.chosenTracks.length === 0) {
                  diag.isWorkingAudioFound = true;
                  diag.selectedSource = data.work.tracks[0]?.isHls ? 'JapaneseASMR (HLS Stream)' : (data.work.hasHls ? 'HLS Stream' : 'Alternative Source');
                  diag.chosenTracks = data.work.tracks.map(t => ({
                    title: t.title || '',
                    rawUrl: t.rawUrl || t.streamUrl || '',
                    streamUrl: t.streamUrl || '',
                    isHls: !!t.isHls,
                    category: t.category || 'main'
                  }));
                }
              }
              activeJob.moeDiagnostics = activeJob.moeDiagnostics || [];
              activeJob.moeDiagnostics.push(diag);
            }

            if (data && data.work) {
              activeJob.succeeded++;
              if (logs) {
                const logEntry = document.createElement('div');
                logEntry.style.color = '#38bdf8';
                logEntry.innerText = '✅ ' + rj + ': ' + (data.work.title ? data.work.title.slice(0, 32) : '') + '... (Added)';
                logs.appendChild(logEntry);
              }
            } else {
              activeJob.failed++;
              const failReason = (data && data.error) || ('HTTP ' + res.status + ' ' + (res.statusText || 'Error'));
              activeJob.failedItems = activeJob.failedItems || [];
              activeJob.failedItems.push({ rjCode: rj, reason: failReason });

              // Ensure failed works are always recorded in the diagnostic report!
              activeJob.moeDiagnostics = activeJob.moeDiagnostics || [];
              const existingDiag = activeJob.moeDiagnostics.find(d => d.rjCode === rj);
              if (existingDiag) {
                existingDiag.isWorkingAudioFound = false;
                existingDiag.failureReason = failReason;
              } else {
                activeJob.moeDiagnostics.push({
                  rjCode: rj,
                  postId: 'N/A',
                  slug: rj.toLowerCase(),
                  title: 'Work ' + rj,
                  sourcesBreakdown: {
                    japaneseAsmr: { found: false },
                    hentaiAsmrMoe: { found: false }
                  },
                  triedUrls: [],
                  isWorkingAudioFound: false,
                  selectedSource: 'NONE (Failed / Saved to Wishlist)',
                  failureReason: failReason
                });
              }

              if (logs) {
                const logEntry = document.createElement('div');
                logEntry.style.color = '#f59e0b';
                logEntry.innerText = '⚠️ ' + rj + ': ' + failReason + ' -> Saved to Wishlist 📋';
                logs.appendChild(logEntry);
              }
              // Explicit client-side backup save to wishlist if resolve failed with 503/error
              if (!data || !data.wishlisted) {
                apiFetch('/api/wishlist', {
                  method: 'POST',
                  body: JSON.stringify({ rjCode: rj, reason: failReason })
                }).catch(() => {});
              }
            }
          } catch (e) {
            activeJob.failed++;
            activeJob.failedItems = activeJob.failedItems || [];
            activeJob.failedItems.push({ rjCode: rj, reason: e.message || 'Network/503 error' });

            // Ensure network error failures are also in diagnostic log
            activeJob.moeDiagnostics = activeJob.moeDiagnostics || [];
            const existingDiag = activeJob.moeDiagnostics.find(d => d.rjCode === rj);
            if (existingDiag) {
              existingDiag.isWorkingAudioFound = false;
              existingDiag.failureReason = e.message || 'Network/503 error';
            } else {
              activeJob.moeDiagnostics.push({
                rjCode: rj,
                postId: 'N/A',
                slug: rj.toLowerCase(),
                title: 'Work ' + rj,
                sourcesBreakdown: {
                  japaneseAsmr: { found: false },
                  hentaiAsmrMoe: { found: false }
                },
                triedUrls: [],
                isWorkingAudioFound: false,
                selectedSource: 'NONE (Failed / Saved to Wishlist)',
                failureReason: e.message || 'Network/503 error'
              });
            }

            if (logs) {
              const logEntry = document.createElement('div');
              logEntry.style.color = '#f59e0b';
              logEntry.innerText = '⚠️ ' + rj + ': ' + e.message + ' -> Saved to Wishlist 📋';
              logs.appendChild(logEntry);
            }
            apiFetch('/api/wishlist', {
              method: 'POST',
              body: JSON.stringify({ rjCode: rj, reason: e.message || 'Network/503 error' })
            }).catch(() => {});
          }
          if (logs) logs.scrollTop = logs.scrollHeight;
          renderBatchQueueUI();
          updateWishlistBadge();
          if (window.location.hash === '#/wishlist') {
            loadWishlist();
          }
          await new Promise(r => setTimeout(r, 120));
        }

        if (activeJob.status !== 'stopped') {
          activeJob.status = 'completed';
          activeJob.currentStatusText = '🎉 Completed: ' + activeJob.succeeded + ' added, ' + activeJob.failed + ' wishlist';
        }

        // Auto-download failsafe if there are any failed/503 works in this job
        if (activeJob.failedItems && activeJob.failedItems.length > 0) {
          downloadJobFailureList(activeJob);
          if (logs) {
            const logEntry = document.createElement('div');
            logEntry.style.color = '#38bdf8';
            logEntry.innerText = '📥 Auto-downloaded ' + activeJob.failedItems.length + ' failed work codes to your browser as .txt';
            logs.appendChild(logEntry);
            logs.scrollTop = logs.scrollHeight;
          }
        }

        // Auto-download Moe diagnostic pattern logs if any works had missing CDN audio
        if (activeJob.moeDiagnostics && activeJob.moeDiagnostics.length > 0) {
          downloadMoeDiagnosticList(activeJob);
          if (logs) {
            const logEntry = document.createElement('div');
            logEntry.style.color = '#a855f7';
            logEntry.innerText = '⚠️ Auto-downloaded ' + activeJob.moeDiagnostics.length + ' Moe audio pattern diagnostic log(s) to your browser as .txt';
            logs.appendChild(logEntry);
            logs.scrollTop = logs.scrollHeight;
          }
        }

        renderBatchQueueUI();
        updateWishlistBadge();
        if (window.location.hash === '#/wishlist') {
          loadWishlist();
        }
        loadLibrary();
      }

      isQueueRunnerActive = false;
      importRunning = false;
      window.removeEventListener('beforeunload', handleBeforeUnloadWarn);

      let totalAdded = 0;
      let totalWish = 0;
      for (const j of importBatchQueue) {
        totalAdded += j.succeeded;
        totalWish += j.failed;
      }

      const finishSummary = '🎉 All queues finished: ' + totalAdded + ' added, ' + totalWish + ' wishlist.';
      updateBackgroundImportWidgets(100, finishSummary);
      renderBatchQueueUI();

      const sWidget = document.getElementById('sidebarImportWidget');
      const mBanner = document.getElementById('mobileImportBanner');
      const modal = document.getElementById('importModal');
      const isModalVisible = modal && (modal.style.display === 'flex' || modal.style.display === 'block');

      showToast(finishSummary, 4500);

      if (!isModalVisible) {
        setTimeout(() => {
          if (!isQueueRunnerActive) {
            if (sWidget) sWidget.style.display = 'none';
            if (mBanner) mBanner.style.display = 'none';
          }
        }, 5000);
      }
    }

    async function runBatchImport() {
      if (!isAdmin) {
        openAdminModal('Please unlock Admin access first to run batch import.');
        return;
      }
      const ta = document.getElementById('importTextarea');
      const text = ta ? ta.value : '';
      if (!text || !text.trim()) {
        alert('Please enter at least one valid RJ code (e.g. RJ01473335).');
        return;
      }

      const rjList = extractRjListFromText(text);
      if (rjList.length === 0) {
        alert('No valid RJ/VJ/BJ codes found to import.');
        return;
      }

      if (ta) ta.value = '';
      const badge = document.getElementById('importCountBadge');
      if (badge) badge.innerText = '';
      const fi = document.getElementById('importFileInput');
      if (fi) fi.value = '';

      await executeBatchImportRjList(rjList, null, { keepModalOpen: true });
    }

    let toastTimeout = null;
    function showToast(message, duration = 2800) {
      const el = document.getElementById('appToast');
      if (!el) return;
      el.innerHTML = message;
      el.style.display = 'flex';
      void el.offsetWidth;
      el.classList.add('show');
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => {
          if (!el.classList.contains('show')) el.style.display = 'none';
        }, 260);
      }, duration);
    }

    async function openAddToPlaylistModal(item) {
      pendingPlaylistItem = item;
      document.getElementById('addToPlaylistModal').style.display = 'flex';
      const listEl = document.getElementById('playlistSelectList');
      listEl.innerHTML = '<div style="color:var(--text-muted); padding:1rem; text-align:center;">Loading playlists...</div>';

      try {
        const res = await apiFetch('/api/playlists');
        const playlists = await res.json();
        let list = Array.isArray(playlists) ? [...playlists] : [];

        // Ensure ❤️ Favorites is always at the top
        const favIdx = list.findIndex(p => p.id === 'pl-favorites');
        let favPl;
        if (favIdx >= 0) {
          favPl = list.splice(favIdx, 1)[0];
        } else {
          favPl = { id: 'pl-favorites', name: '❤️ Favorites', items: [] };
        }
        list.unshift(favPl);

        let html = '';
        list.forEach(function(p) {
          const isFav = p.id === 'pl-favorites';
          const pName = isFav ? 'Favorites' : p.name;
          html += '<div class="playlist-select-item" data-pl="' + p.id + '" data-plname="' + pName.replace(/"/g, '&quot;') + '" onclick="addItemToPlaylist(this.dataset.pl, this.dataset.plname)"><span style="font-weight:700;">' + (isFav ? '❤️ Favorites' : '📜 ' + p.name) + '</span><span style="font-size:0.8rem; color:var(--text-muted);">' + (p.items || []).length + ' tracks</span></div>';
        });
        listEl.innerHTML = html;
      } catch (e) {
        listEl.innerHTML = '<div style="color:#ff3366; padding:1rem; text-align:center;">Failed to load playlists</div>';
      }
    }

    function closeAddToPlaylistModal() {
      document.getElementById('addToPlaylistModal').style.display = 'none';
      pendingPlaylistItem = null;
    }

    async function addItemToPlaylist(plId, plName) {
      const itemToSave = pendingPlaylistItem;
      if (!itemToSave) {
        showToast('❌ No item selected');
        return;
      }
      const targetPlName = plName || 'playlist';
      closeAddToPlaylistModal();
      try {
        const res = await apiFetch('/api/playlists/' + encodeURIComponent(plId) + '/items', {
          method: 'POST',
          body: JSON.stringify({ item: itemToSave })
        });
        const data = await res.json();
        if (data.success) {
          showToast('✅ Added to ' + targetPlName);
        } else {
          showToast('❌ ' + (data.error || 'Failed to add'));
        }
      } catch (e) {
        showToast('❌ ' + e.message);
      }
    }

    async function createAndAddToPlaylist() {
      const name = document.getElementById('quickNewPlName').value.trim();
      if (!name) return;
      try {
        const res = await apiFetch('/api/playlists', { method: 'POST', body: JSON.stringify({ name }) });
        const newPl = await res.json();
        if (newPl && newPl.id) {
          document.getElementById('quickNewPlName').value = '';
          await addItemToPlaylist(newPl.id, newPl.name);
        }
      } catch (e) {
        showToast('❌ ' + e.message);
      }
    }

    function addCurrentTrackToPlaylist() {
      const work = currentPlayingWork || currentWork;
      if (!work || !work.tracks || !work.tracks[currentTrackIndex]) {
        showToast('ℹ️ No track is currently loaded');
        return;
      }
      const t = work.tracks[currentTrackIndex];
      openAddToPlaylistModal({
        rjCode: work.rjCode,
        trackId: t.id || 1,
        title: t.title,
        workTitle: work.title,
        startTime: t.startTime || 0,
        streamUrl: t.streamUrl,
        isHls: t.isHls,
        poster: work.coverUrl,
        cv: work.cv || ''
      });
    }
  </script>
</body>
</html>`;
