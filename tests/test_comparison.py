import sys
import cutlet
import re

sys.stdout.reconfigure(encoding='utf-8')

katsu = cutlet.Cutlet()
katsu.use_foreign_spelling = False

def normalize_cv_romaji(ja, romaji):
    if not ja or not romaji:
        return romaji
    
    # Handle parenthetical aliases
    paren_match = re.match(r"^([^(（]+)[(（](.+)[)）]$", romaji)
    if paren_match:
        ja_paren = re.match(r"^([^(（]+)[(（](.+)[)）]$", ja)
        if ja_paren:
            return normalize_cv_romaji(ja_paren.group(1).strip(), paren_match.group(1).strip()) + ' (' + \
                   normalize_cv_romaji(ja_paren.group(2).strip(), paren_match.group(2).strip()) + ')'

    words = romaji.strip().split()
    if len(words) <= 2:
        return romaji.strip()

    # 1. Kanji surname + Kana given name (e.g. 桜音のん -> Sakura Ne Non)
    match_kanji_kana = re.match(r"^([\u4E00-\u9FFF]+)([\u3040-\u309F\u30A0-\u30FF]+)$", ja)
    if match_kanji_kana and len(words) == 3:
        return words[0] + words[1].lower() + ' ' + words[2]

    # 2. Kanji surname + Mixed given name (e.g. 水純なな歩 -> Mizujun Nana Ho)
    match_kanji_mixed = re.match(r"^([\u4E00-\u9FFF]{2,})([\u3040-\u309F\u30A0-\u30FF]+[\u4E00-\u9FFF]*)$", ja)
    if match_kanji_mixed and len(words) == 3:
        return words[0] + ' ' + words[1] + words[2].lower()

    # 3. 4-Kanji names (e.g. 空峰羽奈 -> Sora Mine Hana)
    if re.match(r"^[\u4E00-\u9FFF]{4}$", ja) and len(words) == 3:
        return words[0] + words[1].lower() + ' ' + words[2]

    # 4. Common phonetic surname/given morpheme fallback
    surname_suffixes = r"^(ne|mine|saka|zaka|ta|da|kawa|gawa|hara|bara|shima|jima|mori|saki|zaki|no|ki|gi|mizu|tsuka|zuka|ba|ha|ya|tani|yama|kura|miya|hashi|bashi|fuji|se)$"
    if len(words) == 3 and re.match(surname_suffixes, words[1], re.IGNORECASE):
        return words[0] + words[1].lower() + ' ' + words[2]

    return words[0] + ' ' + words[1] + (words[2].lower() if len(words) > 2 else '')

# Names from user's screenshot
names = [
    ("桜音のん", "Sakura Ne Non", "Sakurane Non"),
    ("水純なな歩", "Mizujun Nana Ho", "Mizujun Nanaho"),
    ("空峰羽奈", "Sora Mine Hana", "Soramine Hana"),
    ("陽向葵ゅか", "Hinata Aoiyuka", "Hinata Aoiyuka"),
    ("柚木つばめ", "Yuzuki Tsubame", "Yuzuki Tsubame"),
    ("涼花みなせ", "Suzuka Minase", "Suzuka Minase"),
    ("藤宮せせき", "Fujimiya Kiseki", "Fujimiya Kiseki"),
    ("大山チロル", "Ōyama Chiroru", "Ōyama Chiroru"),
    ("花杜めい", "Hanamori Mei", "Hanamori Mei"),
    ("加々美澪", "Kagami Mio", "Kagami Mio"),
    ("剣崎葵", "Kenzaki Aoi", "Kenzaki Aoi"),
    ("浅木式", "Asagi Shiki", "Asagi Shiki"),
    ("みもりあいの", "Mimori Aino", "Mimori Aino"),
    ("赤井リア", "Akai Ria", "Akai Ria"),
    ("山田じぇみ子", "Yamada Jiemiko", "Yamada Jiemiko"),
    ("秋野かえで", "Akino Kaede", "Akino Kaede"),
    ("鵜飼ちよ", "Ukai Chiyo", "Ukai Chiyo"),
    ("逢坂成美", "Ōsaka Narumi", "Ōsaka Narumi"),
    ("梵雪音", "Bon Yukine", "Bon Yukine"),
    ("餅梨あむ", "Mochinashi Amu", "Mochinashi Amu"),
    ("御子柴柴", "Mikoshiba Izumi", "Mikoshiba Izumi"),
    ("狼ノ宮ヒナギク", "Ōkami no Miya Hinagiku", "Ōkami no Miya Hinagiku"),
    ("空丸", "Soramaru", "Soramaru"),
    ("百千るか", "Momochi Ruka", "Momochi Ruka"),
    ("乙倉ゆい", "Otokura Yui", "Otokura Yui"),
    ("雲八はち", "Kumohachi Hachi", "Kumohachi Hachi"),
    ("中家志穂", "Nakake Shiho", "Nakake Shiho"),
    ("野上菜月", "Nogami Natsuki", "Nogami Natsuki"),
    ("恋鈴桃歌", "Koisuzu Momoka", "Koisuzu Momoka"),
    ("兎月りりむ。", "Tsukizuki Ririmu.", "Tsukizuki Ririmu."),
    ("皆月恋", "Minazuki Ren", "Minazuki Ren"),
    ("小花衣こっこ", "Kohaneko Koko", "Kohaneko Koko"),
    ("涼貴涼", "Suzuki Ryō", "Suzuki Ryō"),
    ("奏谷しはる", "Kanatani Shiharu", "Kanatani Shiharu"),
    ("一之瀬りと", "Ichinose Rito", "Ichinose Rito"),
    ("沢野ぽぷら", "Sawano Popura", "Sawano Popura"),
    ("西瓜すいか", "Suika Suika", "Suika Suika"),
    ("こやまはる", "Koyama Haru", "Koyama Haru"),
    ("かの仔", "Kano Ko", "Kano Ko")
]

print(f"{'Japanese':<15} | {'Original (LLM)':<22} | {'Post-Processed':<20} | {'Cutlet (UniDic)':<22}")
print("=" * 86)
for ja, orig, target in names:
    post = normalize_cv_romaji(ja, orig)
    try:
        cutlet_out = katsu.romaji(ja).title()
    except Exception as e:
        cutlet_out = f"ERR: {e}"
    
    print(f"{ja:<15} | {orig:<22} | {post:<20} | {cutlet_out:<22}")
