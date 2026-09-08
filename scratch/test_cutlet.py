import cutlet

katsu = cutlet.Cutlet()
katsu.use_foreign_spelling = False

# All names from user's screenshot
names = [
    ("桜音のん", "Sakura Ne Non"),
    ("水純なな歩", "Mizujun Nana Ho"),
    ("空峰羽奈", "Sora Mine Hana"),
    ("陽向葵ゅか", "Hinata Aoiyuka"),
    ("柚木つばめ", "Yuzuki Tsubame"),
    ("涼花みなせ", "Suzuka Minase"),
    ("藤宮せせき", "Fujimiya Kiseki"),
    ("大山チロル", "Ōyama Chiroru"),
    ("花杜めい", "Hanamori Mei"),
    ("加々美澪", "Kagami Mio"),
    ("剣崎葵", "Kenzaki Aoi"),
    ("浅木式", "Asagi Shiki"),
    ("みもりあいの", "Mimori Aino"),
    ("赤井リア", "Akai Ria"),
    ("山田じぇみ子", "Yamada Jiemiko"),
    ("秋野かえで", "Akino Kaede"),
    ("鵜飼ちよ", "Ukai Chiyo"),
    ("逢坂成美", "Ōsaka Narumi"),
    ("梵雪音", "Bon Yukine"),
    ("餅梨あむ", "Mochinashi Amu"),
    ("御子柴柴", "Mikoshiba Izumi"),
    ("狼ノ宮ヒナギク", "Ōkami no Miya Hinagiku"),
    ("空丸", "Soramaru"),
    ("百千るか", "Momochi Ruka"),
    ("乙倉ゆい", "Otokura Yui"),
    ("雲八はち", "Kumohachi Hachi"),
    ("中家志穂", "Nakake Shiho"),
    ("野上菜月", "Nogami Natsuki"),
    ("恋鈴桃歌", "Koisuzu Momoka"),
    ("兎月りりむ。", "Tsukizuki Ririmu."),
    ("皆月恋", "Minazuki Ren"),
    ("小花衣こっこ", "Kohaneko Koko"),
    ("涼貴涼", "Suzuki Ryō"),
    ("奏谷しはる", "Kanatani Shiharu"),
    ("一之瀬りと", "Ichinose Rito"),
    ("沢野ぽぷら", "Sawano Popura"),
    ("西瓜すいか", "Suika Suika"),
    ("こやまはる", "Koyama Haru"),
    ("かの仔", "Kano Ko")
]

print(f"{'Japanese':<15} | {'Original/LLM':<25} | {'Cutlet Output':<25}")
print("-" * 70)
for ja, orig in names:
    try:
        cutlet_romaji = katsu.romaji(ja).title()
        print(f"{ja:<15} | {orig:<25} | {cutlet_romaji:<25}")
    except Exception as e:
        print(f"{ja:<15} | {orig:<25} | ERROR: {e}")
