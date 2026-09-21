import os
import json
import time
import requests

def get_seiyuu_romaji(japanese_name, delay_sec=0.5):
    """
    Search for the seiyuu on MyAnimeList via Jikan API v4
    """
    if not japanese_name or japanese_name == "N/A":
        return None

    url = "https://api.jikan.moe/v4/people"
    params = {"q": japanese_name.strip(), "limit": 1}
    headers = {"User-Agent": "Mozilla/5.0 aStreamer/1.5"}

    try:
        response = requests.get(url, params=params, headers=headers, timeout=10)
        if delay_sec > 0:
            time.sleep(delay_sec)

        if response.status_code == 200:
            data = response.json()
            if data.get("data") and len(data["data"]) > 0:
                person = data["data"][0]
                name = person.get("name", "")
                # Normalize "Last, First" -> "Last First"
                if "," in name:
                    parts = [p.strip() for p in name.split(",")]
                    return f"{parts[0]} {parts[1]}"
                return name.strip()
        elif response.status_code == 429:
            # Rate limited -> sleep and retry once
            time.sleep(2.0)
            return get_seiyuu_romaji(japanese_name, delay_sec)
    except Exception as e:
        pass
    return None

if __name__ == "__main__":
    print("====================================================")
    print("    PASS 1: JIKAN (MYANIMELIST) CV RESOLUTION TEST   ")
    print("====================================================\n")

    # Load local database CVs
    db_path = os.path.join(os.path.dirname(__file__), "data", "astreamer_db.json")
    all_cvs = set()

    if os.path.exists(db_path):
        try:
            with open(db_path, "r", encoding="utf-8") as f:
                db_data = json.load(f)
                for w in db_data.get("works", {}).values():
                    cv_field = w.get("cv", "")
                    if cv_field and cv_field != "N/A":
                        for c in cv_field.replace("/", ",").replace("、", ",").split(","):
                            clean = c.strip()
                            if len(clean) >= 2:
                                all_cvs.add(clean)
        except Exception as e:
            print(f"Note reading db: {e}")

    # Add curated test CVs
    curated = [
        "秋野かえで", "民安ともえ", "たみやすともえ", "陽向葵ゅか", "音霊魂子",
        "猫舐つな", "こまる", "逢真井もこ", "桃山いおん", "藤咲ウサ",
        "くすはらゆい", "歩サラ", "杏子御津", "北大路ゆき", "御苑生メイ",
        "花園めい", "月野きいろ", "門脇舞以", "伊藤かな恵", "悠木碧",
        "佐倉綾音", "水瀬いのり", "能登麻美子", "種﨑敦美", "東山奈央",
        "上坂すみれ", "小倉唯", "鬼頭明里", "高橋李依", "早見沙織",
        "雨宮天", "竹達彩奈", "内田真礼", "茅野愛衣", "花澤香菜"
    ]
    for c in curated:
        all_cvs.add(c)

    test_list = sorted(list(all_cvs))
    print(f"Testing {len(test_list)} Voice Actor names against Jikan API...\n")

    hits = 0
    misses = 0
    results = {}

    for idx, cv in enumerate(test_list, 1):
        print(f"[{idx}/{len(test_list)}] Searching \"{cv}\"...", end=" ", flush=True)
        romaji = get_seiyuu_romaji(cv)
        if romaji:
            hits += 1
            results[cv] = romaji
            print(f"✅ HIT -> \"{romaji}\"")
        else:
            misses += 1
            print("❌ MISS")

    print("\n====================================================")
    print(f"PASS 1 SUMMARY:")
    print(f"Total CVs: {len(test_list)}")
    print(f"Hits:      {hits} ({hits / len(test_list) * 100:.1f}%)")
    print(f"Misses:    {misses} ({misses / len(test_list) * 100:.1f}%)")
    print("====================================================")
