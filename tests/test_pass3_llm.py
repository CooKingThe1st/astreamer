import os
import json
import requests
from dotenv import load_dotenv

# Load local .env
load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

SYSTEM_PROMPT = """
You are a specialist in Japanese doujin works, ASMR voice actors (CVs), and adult content tags.
Your task is to convert Japanese tags into Rōmaji (Hepburn system) and English.

PRINCIPLES (not exceptions):

1. **Voice Actor Names** (CVs / seiyuu):
   - Read the full name as a single unit
   - Do not split into separate words
   - Example: 陽向葵ゅか → "Hinata Yuka" (one name)
   - Example: 秋野かえで → "Akino Kaede"
   - Output the Rōmaji name in BOTH columns (no English translation needed)

2. **Compound Tags** (multiple words with / or 、):
   - Preserve the separator
   - Each component gets its own Rōmaji and English
   - Example: ラブラブ/あまあま → "Rabu Rabu / Ama Ama" | "Loving / Sweet"

3. **Verb Forms**:
   - For tags ending in 堕ち (ochi): use the noun form "Ochi" (not "Ochiru")
   - The tag is a noun phrase, not a verb conjugation
   - Example: 快楽堕ち → "Kairaku Ochi" | "Succumbing to Pleasure"

4. **Technical Terms**:
   - Use recognized subculture terminology
   - Use clinical/educational English where appropriate
   - Example: イラマチオ → "Iramachio" | "Deep Throat"

5. **Romanization Consistency**:
   - Use Hepburn system
   - ち → "chi" (not "ti")
   - つ → "tsu" (not "tu")
   - Long vowels: おう → "ō" or "ou"
   - し → "shi" (not "si")

6. **One Term = One Unit**:
   - 連続絶頂 → "Renzoku Zecchō" | "Multiple Orgasms" (not split into separate words)
   - 淫紋 → "Inmon" | "Erotic Mark" (one word)

7. **Context Matters**:
   - "寝取られ" is "Netorare" (being cuckolded)
   - "寝取り" is "Netori" (cuckolding someone else)
   - "寝取らせ" is "Netorase" (consensual cuckolding)

Output strictly in JSON format:
{"original_tag": {"romaji": "romaji_translation", "english": "english_translation"}}
"""

def translate_tags_to_romaji_english(tags, model="deepseek/deepseek-v3.2"):
    if not OPENROUTER_API_KEY:
        print("Error: OPENROUTER_API_KEY is not set in .env")
        return None

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://astreamer.local",
        "X-Title": "streasmr Tag Translator"
    }

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": json.dumps(tags, ensure_ascii=False)}
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.1
    }

    try:
        resp = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        raw_content = data["choices"][0]["message"]["content"]
        return json.loads(raw_content)
    except Exception as e:
        print(f"API Request Failed: {e}")
        return None

def format_as_csv(translation_dict):
    if not translation_dict:
        return "No translations available"
    
    csv_rows = ['"Japanese","Rōmaji","English"']
    for original, translations in translation_dict.items():
        romaji = translations.get("romaji", "")
        english = translations.get("english", "")
        csv_rows.append(f'"{original}","{romaji}","{english}"')
    
    return "\n".join(csv_rows)

if __name__ == "__main__":
    print("====================================================")
    print("       PASS 3: OPENROUTER LLM FALLBACK TEST (PYTHON)")
    print("====================================================\n")

    test_tags = [
        "おねショタ",           # Older woman × young boy
        "サキュバス",          # Succubus
        "ふたなり",            # Futanari
        "異種姦",              # Monster sex
        "常識改変",            # Common sense alteration
        "寝取られ",            # NTR (known, but checks consistency)
        "音霊魂子",            # Voice actor name
    ]
    
    print("====================================================")
    print("       PASS 3: OPENROUTER DEEPSEEK-V3.2 TEST        ")
    print("====================================================\n")
    print(f"Sending {len(test_tags)} items to OpenRouter (deepseek/deepseek-v3.2)...")
    
    result = translate_tags_to_romaji_english(test_tags)
    
    if result:
        print("\n=== Individual Translations ===")
        for idx, (original, translations) in enumerate(result.items(), 1):
            print(f"[{idx}] {original} -> Romaji: \"{translations.get('romaji')}\" | EN: \"{translations.get('english')}\"")
            
        print("\n=== CSV Format (Ready for Pass 4 Active Learning) ===")
        print(format_as_csv(result))
