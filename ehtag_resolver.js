const fs = require('fs');
const path = require('path');

// Comprehensive Japanese -> Romaji + English ASMR & Doujin Taxonomy Dictionary
// Seeded with EhTag female/male/fetish namespaces + DLsite official genres + sound/roleplay keywords
const EHTAG_TAXONOMY = {
  // === Audio & ASMR Concepts ===
  "ASMR": { romaji: "ASMR", english: "ASMR" },
  "バイノーラル": { romaji: "Binaural", english: "Binaural" },
  "立体音響": { romaji: "Rittai Onkyou", english: "3D Audio" },
  "KU100": { romaji: "KU100", english: "KU100 Binaural Mic" },
  "ダミーヘッド": { romaji: "Damii Heddo", english: "Dummy Head Mic" },
  "ダミヘ": { romaji: "Damihe", english: "Dummy Head Mic" },
  "3Dio": { romaji: "3Dio", english: "3Dio Free Space Mic" },
  "耳かき": { romaji: "Mimikaki", english: "Ear Cleaning" },
  "耳掃除": { romaji: "Mimisouji", english: "Ear Cleaning" },
  "梵天": { romaji: "Bonten", english: "Feather Ear Pick" },
  "綿棒": { romaji: "Menbou", english: "Cotton Swab" },
  "耳舐め": { romaji: "Miminame", english: "Ear Licking" },
  "耳ふー": { romaji: "Mimi-fuu", english: "Ear Blowing" },
  "吐息": { romaji: "Toiki", english: "Breathing" },
  "囁き": { romaji: "Sasayaki", english: "Whispering" },
  "ささやき": { romaji: "Sasayaki", english: "Whispering" },
  "囁き声": { romaji: "Sasayakigoe", english: "Whispering Voice" },
  "密着": { romaji: "Mitchaku", english: "Close Contact" },
  "ゼロ距離": { romaji: "Zero Kyori", english: "Zero Distance" },
  "添い寝": { romaji: "Soine", english: "Co-sleeping" },
  "添寝": { romaji: "Soine", english: "Co-sleeping" },
  "安眠": { romaji: "Anmin", english: "Deep Sleep" },
  "睡眠導入": { romaji: "Suimin Dounyuu", english: "Sleep Induction" },
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
  "環境音": { romaji: "Kankyouon", english: "Ambient Sounds" },
  "焚き火": { romaji: "Takibi", english: "Campfire" },
  "スライム": { romaji: "Suraimu", english: "Slime Sounds" },
  "オノマトペ": { romaji: "Onomatope", english: "Onomatopoeia" },
  "ロールプレイ": { romaji: "Roorupurei", english: "Roleplay" },
  "シチュエーションボイス": { romaji: "Shichueeshon Boisu", english: "Situation Voice" },
  "ドラマCD": { romaji: "Dorama CD", english: "Drama CD" },
  "朗読": { romaji: "Roudoku", english: "Reading Aloud" },
  "ボイスドラマ": { romaji: "Boisu Dorama", english: "Voice Drama" },

  // === Tropes & Character Archetypes (EhTag female / male) ===
  "甘やかし": { romaji: "Amayakashi", english: "Pampering" },
  "癒やし": { romaji: "Iyashi", english: "Healing" },
  "癒し": { romaji: "Iyashi", english: "Healing" },
  "甘々": { romaji: "Ama-ama", english: "Sweet" },
  "あまあま": { romaji: "Ama-ama", english: "Sweet" },
  "ラブラブ": { romaji: "Rabu Rabu", english: "Loving" },
  "ご褒美": { romaji: "Gohoubi", english: "Reward" },
  "全肯定": { romaji: "Zen-koutei", english: "Affirmation" },
  "お姉さん": { romaji: "Oneesan", english: "Older Sister" },
  "姉": { romaji: "Ane", english: "Older Sister" },
  "妹": { romaji: "Imouto", english: "Little Sister" },
  "義妹": { romaji: "Gimai", english: "Step Sister" },
  "幼馴染": { romaji: "Osananajimi", english: "Childhood Friend" },
  "幼なじみ": { romaji: "Osananajimi", english: "Childhood Friend" },
  "同級生": { romaji: "Doukyuusei", english: "Classmate" },
  "先輩": { romaji: "Senpai", english: "Senior" },
  "後輩": { romaji: "Kouhai", english: "Junior" },
  "ママ": { romaji: "Mama", english: "Mom" },
  "お母さん": { romaji: "Okaasan", english: "Mother" },
  "母性": { romaji: "Bosei", english: "Maternal" },
  "人妻": { romaji: "Hitozuma", english: "Married Woman" },
  "団地妻": { romaji: "Danchizuma", english: "Apartment Wife" },
  "未亡人": { romaji: "Miboujin", english: "Widow" },
  "メイド": { romaji: "Meido", english: "Maid" },
  "メイド喫茶": { romaji: "Meido Kissa", english: "Maid Cafe" },
  "執事": { romaji: "Shitsuji", english: "Butler" },
  "従者": { romaji: "Juusha", english: "Servant" },
  "主従": { romaji: "Shujuu", english: "Master & Servant" },
  "お嬢様": { romaji: "Ojousama", english: "Rich Lady" },
  "ギャル": { romaji: "Gyaru", english: "Gyaru" },
  "ツンデレ": { romaji: "Tsundere", english: "Tsundere" },
  "クーデレ": { romaji: "Kuudere", english: "Kuudere" },
  "ヤンデレ": { romaji: "Yandere", english: "Yandere" },
  "デレデレ": { romaji: "Deredere", english: "Lovestruck" },
  "メスガキ": { romaji: "Mesugaki", english: "Cheeky Brat" },
  "ボクっ娘": { romaji: "Bokukko", english: "Tomboy" },
  "男の娘": { romaji: "Otokonoko", english: "Femboy" },
  "ショタ": { romaji: "Shota", english: "Shota" },
  "おねショタ": { romaji: "Onee Shota", english: "Older Woman Younger Boy" },
  "ロリ": { romaji: "Rori", english: "Loli" },
  "熟女": { romaji: "Jukujo", english: "Milf" },
  "JK": { romaji: "JK", english: "High School Girl" },
  "JC": { romaji: "JC", english: "Middle School Girl" },
  "JS": { romaji: "JS", english: "Elementary School Girl" },
  "女子大生": { romaji: "Joshidaisei", english: "College Girl" },
  "OL": { romaji: "OL", english: "Office Lady" },
  "女教師": { romaji: "Jokyoushi", english: "Female Teacher" },
  "教師": { romaji: "Kyoushi", english: "Teacher" },
  "生徒": { romaji: "Seito", english: "Student" },
  "学生": { romaji: "Gakusei", english: "Student" },
  "学校": { romaji: "Gakkou", english: "School" },
  "学園": { romaji: "Gakuen", english: "Academy / School" },
  "少女": { romaji: "Shoujo", english: "Young Girl" },
  "看護師": { romaji: "Kangoshi", english: "Nurse" },
  "ナース": { romaji: "Naasu", english: "Nurse" },
  "女医": { romaji: "Joi", english: "Female Doctor" },
  "巫女": { romaji: "Miko", english: "Shrine Maiden" },
  "シスター": { romaji: "Shisutaa", english: "Nun" },
  "エルフ": { romaji: "Erufu", english: "Elf" },
  "ダークエルフ": { romaji: "Daaku Erufu", english: "Dark Elf" },
  "獣耳": { romaji: "Kemonomimi", english: "Animal Ears" },
  "猫耳": { romaji: "Nekomimi", english: "Cat Ears" },
  "狐耳": { romaji: "Kitsunemimi", english: "Fox Ears" },
  "犬耳": { romaji: "Inumimi", english: "Dog Ears" },
  "うさ耳": { romaji: "Usamimi", english: "Bunny Ears" },
  "吸血鬼": { romaji: "Kyuuketsuki", english: "Vampire" },
  "淫魔": { romaji: "Inma", english: "Succubus" },
  "サキュバス": { romaji: "Sakyubasu", english: "Succubus" },
  "悪魔": { romaji: "Akuma", english: "Demon" },
  "天使": { romaji: "Tenshi", english: "Angel" },
  "幽霊": { romaji: "Yuurei", english: "Ghost" },
  "アンドロイド": { romaji: "Andoroido", english: "Android" },
  "ふたなり": { romaji: "Futanari", english: "Futanari" },
  "異種姦": { romaji: "Ishukan", english: "Interspecies Sex" },
  "人外娘": { romaji: "Jingaimusume", english: "Monster Girl" },
  "モンスター娘": { romaji: "Monsutaa Musume", english: "Monster Girl" },
  "人外": { romaji: "Jingai", english: "Non-Human" },
  "モンスター": { romaji: "Monsutaa", english: "Monster" },
  "王子様": { romaji: "Oujisama", english: "Prince" },
  "王子系": { romaji: "Ouji-kei", english: "Prince Type" },
  "変身ヒロイン": { romaji: "Henshin Hiroin", english: "Transforming Heroine" },
  "変身": { romaji: "Henshin", english: "Transformation" },

  // === Setting, Dynamics & Relationship ===
  "同居": { romaji: "Doukyo", english: "Living Together" },
  "同棲": { romaji: "Dousei", english: "Cohabitation" },
  "日常": { romaji: "Nichijou", english: "Daily Life" },
  "生活": { romaji: "Seikatsu", english: "Daily Life" },
  "恋人同士": { romaji: "Koibito Doushi", english: "Lovers" },
  "恋人": { romaji: "Koibito", english: "Lovers" },
  "ほのぼの": { romaji: "Honobono", english: "Heartwarming" },
  "健全": { romaji: "Kenzen", english: "Wholesome" },
  "ラブコメ": { romaji: "Rabu Kome", english: "Rom-Com" },
  "萌え": { romaji: "Moe", english: "Moe" },
  "オールハッピー": { romaji: "Ooru Happii", english: "All Happy Ending" },
  "ハーレム": { romaji: "Haaremu", english: "Harem" },
  "浮気": { romaji: "Uwaki", english: "Infidelity / Cheating" },
  "スワッピング": { romaji: "Suwappingu", english: "Swapping" },
  "マニアック": { romaji: "Maniakku", english: "Hardcore / Kinky" },
  "変態": { romaji: "Hentai", english: "Hentai / Kinky" },
  "ファンタジー": { romaji: "Fantajii", english: "Fantasy" },
  "東方Project": { romaji: "Touhou Project", english: "Touhou Project" },
  "東方": { romaji: "Touhou", english: "Touhou" },
  "鬱": { romaji: "Utsu", english: "Depression / Dark" },
  "退廃": { romaji: "Taihai", english: "Decadence" },
  "背徳": { romaji: "Haitoku", english: "Immoral" },
  "インモラル": { romaji: "Inmoraru", english: "Immoral" },
  "強制": { romaji: "Kyousei", english: "Forced" },
  "無理矢理": { romaji: "Muriyari", english: "Forced" },
  "逆転無し": { romaji: "Gyakuten Nashi", english: "No Reversal" },
  "色仕掛け": { romaji: "Irojikake", english: "Seduction" },
  "男性受け": { romaji: "Dansei Uke", english: "Male Bottom" },
  "18禁": { romaji: "18-kin", english: "R18 Adults Only" },

  // === Fetish & Sexual Expressions (EhTag fetish / female / male) ===
  "オナサポ": { romaji: "Onasapo", english: "Masturbation Support" },
  "オナニーサポート": { romaji: "Onanii Sapooto", english: "Masturbation Support" },
  "オナニー": { romaji: "Onanii", english: "Masturbation" },
  "射精管理": { romaji: "Shasei Kanri", english: "Ejaculation Control" },
  "寸止め": { romaji: "Sundome", english: "Edging" },
  "カウントダウン": { romaji: "Kauntodaun", english: "Countdown" },
  "淫語": { romaji: "Ingo", english: "Dirty Talk" },
  "言葉責め": { romaji: "Kotobazeme", english: "Verbal Degradation" },
  "主観視点": { romaji: "Shukan Shiten", english: "POV" },
  "一人称視点": { romaji: "Ichininshou Shiten", english: "First Person POV" },
  "催眠": { romaji: "Saimin", english: "Hypnosis" },
  "催眠音声": { romaji: "Saimin Onsei", english: "Hypnosis Voice" },
  "催眠導入": { romaji: "Saimin Dounyuu", english: "Hypnosis Induction" },
  "洗脳": { romaji: "Sennou", english: "Brainwashing" },
  "隷属": { romaji: "Reizoku", english: "Enslavement" },
  "常識改変": { romaji: "Joushiki Kaihen", english: "Common Sense Alteration" },
  "手コキ": { romaji: "Tekoki", english: "Handjob" },
  "フェラ": { romaji: "Fera", english: "Blowjob" },
  "フェラチオ": { romaji: "Ferachio", english: "Blowjob" },
  "パイズリ": { romaji: "Paizuri", english: "Paizuri" },
  "足コキ": { romaji: "Ashikoki", english: "Footjob" },
  "素股": { romaji: "Sumata", english: "Sumata" },
  "アナル": { romaji: "Anaru", english: "Anal" },
  "潮吹き": { romaji: "Shiofuki", english: "Squirting" },
  "中出し": { romaji: "Nakadashi", english: "Creampie" },
  "膣内射精": { romaji: "Chitsunai Shasei", english: "Creampie" },
  "キス": { romaji: "Kisu", english: "Kissing" },
  "ディープキス": { romaji: "Diipu Kisu", english: "Deep Kiss" },
  "リップ音": { romaji: "Rippuon", english: "Lip Sounds" },
  "首絞め": { romaji: "Kubishime", english: "Choking" },
  "拘束": { romaji: "Kousoku", english: "Restraint" },
  "緊縛": { romaji: "Kinbaku", english: "Bondage" },
  "目隠し": { romaji: "Mekakushi", english: "Blindfold" },
  "調教": { romaji: "Choukyou", english: "Training" },
  "痴女": { romaji: "Chijo", english: "Slutty Woman" },
  "逆レイプ": { romaji: "Gyaku Reipu", english: "Reverse Rape" },
  "寝取られ": { romaji: "Netorare", english: "Netorare" },
  "寝取り": { romaji: "Netori", english: "Netori" },
  "寝取らせ": { romaji: "Netorase", english: "Netorase" },
  "NTR": { romaji: "NTR", english: "NTR" },
  "純愛": { romaji: "Jun'ai", english: "Pure Love" },
  "ハッピーエンド": { romaji: "Happii Endo", english: "Happy Ending" },
  "バッドエンド": { romaji: "Baddo Endo", english: "Bad Ending" },
  "処女": { romaji: "Shojo", english: "Virgin" },
  "童貞": { romaji: "Doutei", english: "Virgin" },
  "処女喪失": { romaji: "Shojo Soushitsu", english: "Defloration" },
  "巨乳": { romaji: "Kyonyuu", english: "Big Breasts" },
  "爆乳": { romaji: "Bakunyuu", english: "Huge Breasts" },
  "貧乳": { romaji: "Hinnyuu", english: "Small Breasts" },
  "微乳": { romaji: "Binyuu", english: "Flat Chest" },
  "美乳": { romaji: "Binyuu", english: "Beautiful Breasts" },
  "おっぱい": { romaji: "Oppai", english: "Breasts" },
  "乳首責め": { romaji: "Chikubizeme", english: "Nipple Play" },
  "乳首舐め": { romaji: "Chikubiname", english: "Nipple Licking" },
  "乳首": { romaji: "Chikubi", english: "Nipples" },
  "陥没乳首": { romaji: "Kanbotsu Chikubi", english: "Inverted Nipples" },
  "お漏らし": { romaji: "Omorashi", english: "Omorashi" },
  "放尿": { romaji: "Hounyou", english: "Urination" },
  "露出": { romaji: "Roshutsu", english: "Exhibitionism" },
  "野外": { romaji: "Yagai", english: "Outdoors" },
  "女性優位": { romaji: "Josei Yuui", english: "Female Dominance" },
  "主導権": { romaji: "Shudouken", english: "Initiative" },
  "ドS": { romaji: "DoS", english: "Sadistic" },
  "ドM": { romaji: "DoM", english: "Masochistic" },
  "SM": { romaji: "SM", english: "S&M" },
  "イラマチオ": { romaji: "Iramachio", english: "Deep Throat" },
  "連続絶頂": { romaji: "Renzoku Zecchou", english: "Multiple Orgasms" },
  "快楽堕ち": { romaji: "Kairaku Ochi", english: "Succumbing to Pleasure" },
  "悪堕ち": { romaji: "Aku Ochi", english: "Corruption" },
  "メス堕ち": { romaji: "Mesu Ochi", english: "Feminization Fall" },
  "淫紋": { romaji: "Inmon", english: "Erotic Mark" },
  "焦らし": { romaji: "Jirashi", english: "Teasing" },
  "オホ声": { romaji: "Oho-goe", english: "Ahegao Voice" },
  "赤ちゃんプレイ": { romaji: "Akachan Purei", english: "Baby Play" },
  "スパンキング": { romaji: "Supankingu", english: "Spanking" },
  "フェチ": { romaji: "Fechi", english: "Fetish" },
  "複数プレイ": { romaji: "Fukusuu Purei", english: "Group Sex" },
  "乱交": { romaji: "Rankou", english: "Orgy" },

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
  "宠溺": { romaji: "Amayakashi", english: "Pampering" }
};

/**
 * Checks if a string is already in English / ASCII / Latin / Alphanumeric (no CJK characters)
 * @param {string} str
 * @returns {boolean}
 */
function isAlreadyEnglish(str) {
  if (!str || typeof str !== 'string') return false;
  const clean = str.trim();
  if (!clean) return false;
  // If it contains NO Hiragana, Katakana, or Kanji
  const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(clean);
  return !hasJapanese;
}

/**
 * Resolves a tag using Pass 2 (EhTag taxonomy & greedy compound tokenizer + ASCII filter)
 * @param {string} rawTag 
 * @returns {{ original: string, romaji: string, english: string, matchType: string, confidence: number } | null}
 */
function resolveTagPass2(rawTag) {
  if (!rawTag || typeof rawTag !== 'string') return null;
  const tag = rawTag.trim();
  if (!tag) return null;

  // 0. English / ASCII / Latin Passthrough Filter (e.g. "VTuber", "Audio", "Voice", "NSFW", "R18", "SF")
  if (isAlreadyEnglish(tag)) {
    return {
      original: tag,
      romaji: tag,
      english: tag,
      matchType: 'ascii_passthrough',
      confidence: 1.0
    };
  }

  // 1. Direct exact match in Taxonomy
  if (EHTAG_TAXONOMY[tag]) {
    const entry = EHTAG_TAXONOMY[tag];
    return {
      original: tag,
      romaji: entry.romaji || entry,
      english: entry.english || entry,
      matchType: 'exact',
      confidence: 1.0
    };
  }

  // 2. Check compound tags with separators (e.g. "ラブラブ/あまあま", "学校/学園", "日常/生活")
  if (tag.includes('/') || tag.includes('、') || tag.includes('+')) {
    const parts = tag.split(/[/、+]/).map(p => p.trim()).filter(Boolean);
    const resolvedParts = parts.map(p => resolveTagPass2(p));
    if (resolvedParts.every(r => r && r.romaji)) {
      return {
        original: tag,
        romaji: resolvedParts.map(r => r.romaji).join(' / '),
        english: resolvedParts.map(r => r.english).join(' / '),
        matchType: 'compound_separated',
        confidence: 0.95
      };
    }
  }

  // 3. Greedy Longest Substring Match (e.g. "密着耳かき" -> "密着" + "耳かき")
  const matchedTokens = [];
  let remaining = tag;
  const keysByLength = Object.keys(EHTAG_TAXONOMY).sort((a, b) => b.length - a.length);

  while (remaining.length > 0) {
    let matched = false;
    for (const key of keysByLength) {
      if (remaining.startsWith(key)) {
        matchedTokens.push({
          term: key,
          romaji: EHTAG_TAXONOMY[key].romaji,
          english: EHTAG_TAXONOMY[key].english
        });
        remaining = remaining.slice(key.length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      remaining = remaining.slice(1);
    }
  }

  if (matchedTokens.length >= 2) {
    return {
      original: tag,
      romaji: matchedTokens.map(t => t.romaji).join(' '),
      english: matchedTokens.map(t => t.english).join(' + '),
      tokens: matchedTokens,
      matchType: 'compound_decomp',
      confidence: 0.85
    };
  } else if (matchedTokens.length === 1 && tag.length <= matchedTokens[0].term.length + 3) {
    return {
      original: tag,
      romaji: matchedTokens[0].romaji,
      english: matchedTokens[0].english,
      tokens: matchedTokens,
      matchType: 'partial_root',
      confidence: 0.75
    };
  }

  return {
    original: tag,
    romaji: null,
    english: null,
    matchType: 'miss',
    confidence: 0.0
  };
}

module.exports = {
  EHTAG_TAXONOMY,
  isAlreadyEnglish,
  resolveTagPass2
};
