const axios = require('axios');

/**
 * Normalizes Jikan / MAL name formats (e.g. "Akino, Kaede" -> "Akino Kaede")
 * @param {string} name
 * @returns {string}
 */
function normalizeSeiyuuName(name) {
  if (!name) return '';
  if (name.includes(',')) {
    const parts = name.split(',').map(s => s.trim());
    return `${parts[0]} ${parts[1]}`;
  }
  return name.trim();
}

/**
 * Searches for a Japanese Voice Actor / Seiyuu name on MyAnimeList via Jikan API v4
 * @param {string} japaneseName 
 * @param {number} [delayMs=600] 
 * @returns {Promise<{ romaji: string, malId?: number, url?: string } | null>}
 */
async function getSeiyuuRomajiJikan(japaneseName, delayMs = 600) {
  if (!japaneseName || typeof japaneseName !== 'string') return null;
  const clean = japaneseName.trim();
  if (!clean || clean === 'N/A') return null;

  const url = 'https://api.jikan.moe/v4/people';
  try {
    const response = await axios.get(url, {
      params: { q: clean, limit: 1 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) aStreamer/1.5'
      },
      timeout: 8000
    });

    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    if (response.status === 200 && response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
      const person = response.data.data[0];
      const romaji = normalizeSeiyuuName(person.name);
      return {
        romaji: romaji,
        malId: person.mal_id,
        url: person.url,
        givenName: person.given_name,
        familyName: person.family_name
      };
    }
  } catch (error) {
    if (error.response && error.response.status === 429) {
      // Rate limit backoff
      await new Promise(resolve => setTimeout(resolve, 2000));
      return getSeiyuuRomajiJikan(japaneseName, delayMs);
    }
    // Quietly return null for misses
  }
  return null;
}

/**
 * Batch resolves an array of CV names with polite rate-limiting
 * @param {string[]} nameList 
 * @param {function} [onProgress]
 * @returns {Promise<Record<string, { romaji: string, english: string, isCV: boolean }>>}
 */
async function batchResolveJikan(nameList, onProgress) {
  const results = {};
  const unique = Array.from(new Set(nameList.filter(Boolean)));
  let completed = 0;

  for (const name of unique) {
    const res = await getSeiyuuRomajiJikan(name, 650);
    completed++;
    if (res && res.romaji) {
      results[name] = {
        romaji: res.romaji,
        english: res.romaji,
        isCV: true
      };
      if (onProgress) onProgress(name, res.romaji, true, completed, unique.length);
    } else {
      if (onProgress) onProgress(name, null, false, completed, unique.length);
    }
  }

  return results;
}

module.exports = {
  getSeiyuuRomajiJikan,
  normalizeSeiyuuName,
  batchResolveJikan
};
