import re
import sys
sys.stdout.reconfigure(encoding='utf-8')


def normalize_cv_romaji(ja, romaji):
    if not ja or not romaji:
        return romaji
    
    # 1. Handle parenthetical aliases e.g. "乙倉ゆい（乙倉由依）"
    paren_match = re.match(r"^([^(（]+)[(（](.+)[)）]$", romaji)
    if paren_match:
        ja_paren = re.match(r"^([^(（]+)[(（](.+)[)）]$", ja)
        if ja_paren:
            return normalize_cv_romaji(ja_paren.group(1).strip(), paren_match.group(1).strip()) + ' (' + \
                   normalize_cv_romaji(ja_paren.group(2).strip(), paren_match.group(2).strip()) + ')'

    words = romaji.strip().split()
    if len(words) <= 2:
        return romaji.strip()

    # 2. Preserve particle names like "狼ノ宮ヒナギク" -> "Ōkami no Miya Hinagiku" (has 'no' / 'ノ' / '之')
    if any(w.lower() == 'no' for w in words) and ('ノ' in ja or '之' in ja or 'の' in ja):
        return romaji.strip()

    # 3. Kanji surname + Kana given name (e.g. 桜音のん -> Sakura Ne Non => Sakurane Non)
    match_kanji_kana = re.match(r"^([\u4E00-\u9FFF]+)([\u3040-\u309F\u30A0-\u30FF]+)$", ja)
    if match_kanji_kana and len(words) == 3:
        return words[0] + words[1].lower() + ' ' + words[2]

    # 4. Kanji surname + Mixed given name (e.g. 水純なな歩 -> Mizujun Nana Ho => Mizujun Nanaho)
    match_kanji_mixed = re.match(r"^([\u4E00-\u9FFF]{2,})([\u3040-\u309F\u30A0-\u30FF]+[\u4E00-\u9FFF]*)$", ja)
    if match_kanji_mixed and len(words) == 3:
        return words[0] + ' ' + words[1] + words[2].lower()

    # 5. 4-Kanji names (e.g. 空峰羽奈 -> Sora Mine Hana => Soramine Hana)
    if re.match(r"^[\u4E00-\u9FFF]{4}$", ja) and len(words) == 3:
        return words[0] + words[1].lower() + ' ' + words[2]

    # 6. Common phonetic surname/given morpheme fallback
    surname_suffixes = r"^(ne|mine|saka|zaka|ta|da|kawa|gawa|hara|bara|shima|jima|mori|saki|zaki|no|ki|gi|mizu|tsuka|zuka|ba|ha|ya|tani|yama|kura|miya|hashi|bashi|fuji|se)$"
    if len(words) == 3 and re.match(surname_suffixes, words[1], re.IGNORECASE):
        return words[0] + words[1].lower() + ' ' + words[2]

    return words[0] + ' ' + words[1] + (words[2].lower() if len(words) > 2 else '')

# Test the edge case
print("狼ノ宮ヒナギク:", normalize_cv_romaji("狼ノ宮ヒナギク", "Ōkami no Miya Hinagiku"))
print("桜音のん:", normalize_cv_romaji("桜音のん", "Sakura Ne Non"))
print("水純なな歩:", normalize_cv_romaji("水純なな歩", "Mizujun Nana Ho"))
print("空峰羽奈:", normalize_cv_romaji("空峰羽奈", "Sora Mine Hana"))
