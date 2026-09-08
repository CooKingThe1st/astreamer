const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env if present
function getApiKey() {
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY;
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const l of lines) {
      const trimmed = l.trim();
      if (trimmed.startsWith('OPENROUTER_API_KEY=')) {
        return trimmed.replace('OPENROUTER_API_KEY=', '').trim();
      }
    }
  }
  return null;
}

const SYSTEM_PROMPT = `You are a specialist in Japanese doujin works, ASMR voice actors (CVs), and adult content tags.
Your task is to convert Japanese tags into Rōmaji (Hepburn system) and English.

PRINCIPLES (not exceptions):
1. **Voice Actor Names** (CVs / seiyuu):
   - Read the full name as a single unit
   - Do NOT split into separate words
   - Use the CORRECT reading (not obvious on'yomi/kun'yomi)
   - Example: 音霊魂子 → "Onrei Tamako" (NOT "Otodama Tamako")
   - Example: 陽向葵ゅか → "Hinata Aoiyuka" (one full name)
   - Example: 秋野かえで → "Akino Kaede"
   - Output the Rōmaji name in BOTH columns

2. **Compound Tags** (multiple words with / or 、):
   - Preserve the separator
   - Each component gets its own Rōmaji and English
   - Example: ラブラブ/あまあま → "Rabu Rabu / Ama Ama" | "Loving / Sweet"

3. **Verb Forms**:
   - For tags ending in 堕ち (ochi): use the noun form "Ochi" (not "Ochiru")
   - Example: 快楽堕ち → "Kairaku Ochi" | "Succumbing to Pleasure"

4. **Technical Terms**:
   - Use recognized subculture terminology
   - Example: ふたなり → "Futanari" (NOT "Hermaphrodite")
   - Example: イラマチオ → "Iramachio" | "Deep Throat"

5. **Romanization Consistency**:
   - Use Hepburn system
   - ち → "chi" (not "ti")
   - つ → "tsu" (not "tu")
   - し → "shi" (not "si")
   - じ → "ji" (not "zi")

6. **One Term = One Unit**:
   - Do NOT split compounds unnecessarily
   - Example: 連続絶頂 → "Renzoku Zecchō" | "Multiple Orgasms"

7. **Context Matters**:
   - 寝取られ → "Netorare" (being cuckolded)
   - 寝取り → "Netori" (cuckolding someone else)
   - 寝取らせ → "Netorase" (consensual cuckolding)

Output strictly in JSON format:
{"original_tag": {"romaji": "romaji_translation", "english": "english_translation"}}`;

/**
 * Translates a list of Japanese tags / CV names using OpenRouter (DeepSeek / Dolphin-Mistral)
 * @param {string[]} tags - Array of Japanese strings
 * @param {string} [model] - OpenRouter model ID
 * @returns {Promise<Object>} Dictionary of { tag: { romaji, english } }
 */
async function translateTagsWithLLM(tags, model = "deepseek/deepseek-v3.2") {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set. Please set it in your .env file or environment.');
  }

  if (!Array.isArray(tags) || tags.length === 0) return {};

  const payload = {
    model: model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify(tags) }
    ],
    response_format: { type: "json_object" },
    temperature: 0.1
  };

  try {
    const res = await axios.post("https://openrouter.ai/api/v1/chat/completions", payload, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://astreamer.local",
        "X-Title": "streasmr Tag Translator"
      },
      timeout: 30000
    });

    const content = res.data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response received from OpenRouter LLM");
    }

    // Parse JSON with robust fence stripping and regex fallback
    let cleaned = String(content).replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const jsonBlockMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonBlockMatch) cleaned = jsonBlockMatch[0];

    let parsed = {};
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      const extracted = {};
      const objRegex = /"([^"]+)"\s*:\s*\{\s*"romaji"\s*:\s*"([^"]*)"\s*,\s*"english"\s*:\s*"([^"]*)"\s*\}/g;
      let match;
      while ((match = objRegex.exec(content)) !== null) {
        extracted[match[1]] = { romaji: match[2], english: match[3] };
      }
      if (Object.keys(extracted).length > 0) {
        parsed = extracted;
      } else {
        throw new Error(`Invalid JSON: ${e.message}\nRaw content: ${content.slice(0, 300)}`);
      }
    }

    // Post-process Voice Actor and Tag romanization
    for (const [k, v] of Object.entries(parsed)) {
      if (v && typeof v === 'object' && v.romaji) {
        v.romaji = normalizeCVRomaji(k, v.romaji);
        if (v.english && (v.english === v.romaji || /^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(v.english))) {
          v.english = normalizeCVRomaji(k, v.english);
        }
      }
    }
    return parsed;
  } catch (err) {
    const errorMsg = err.response?.data?.error?.message || err.message;
    console.error(`[Pass 3 LLM Error] ${errorMsg}`);
    throw new Error(errorMsg);
  }
}

/**
 * Normalizes Voice Actor (CV) and Japanese name Romanization
 * Merges over-split surname/given name compounds (e.g. "Sakura Ne Non" -> "Sakurane Non", "Aki No Kae De" -> "Akino Kaede")
 */
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


/**
 * Format translation dictionary as CSV string
 */
function formatAsCsv(translationDict) {
  if (!translationDict || Object.keys(translationDict).length === 0) {
    return "No translations available";
  }

  const csvRows = ['"Japanese","Rōmaji","English"'];
  for (const [original, trans] of Object.entries(translationDict)) {
    const romaji = trans.romaji || "";
    const english = trans.english || "";
    csvRows.push(`"${original.replace(/"/g, '""')}","${romaji.replace(/"/g, '""')}","${english.replace(/"/g, '""')}"`);
  }

  return csvRows.join('\n');
}

module.exports = {
  translateTagsWithLLM,
  formatAsCsv,
  getApiKey
};
