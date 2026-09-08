const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Local cache path
const CACHE_FILE = path.join(__dirname, 'data', 'cv_cache.json');

function loadCache() {
  if (fs.existsSync(CACHE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    } catch (e) {
      return {};
    }
  }
  return {};
}

function saveCache(cache) {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save CV cache:', e.message);
  }
}

/**
 * Resolves a Voice Actor / Staff name using VNDB Kana API
 * @param {string} rawName - Japanese Kanji/Kana or Romaji CV name
 * @param {Object} [cache] - Optional in-memory cache object
 * @returns {Promise<{found: boolean, name: string, original: string, aliases: string[], vndbId: string, raw: string}>}
 */
async function resolveVndbCV(rawName, cache = null) {
  const cleanName = rawName.trim();
  if (!cleanName) return { found: false, raw: rawName };

  const cvCache = cache || loadCache();
  if (cvCache[cleanName]) {
    return { ...cvCache[cleanName], cached: true };
  }

  // VNDB Kana API endpoint
  const url = 'https://api.vndb.org/kana/staff';

  // Request payload
  const body = {
    filters: ["search", "=", cleanName],
    fields: "id, name, original, gender, lang, aliases{name,original,latin,ismain}"
  };

  try {
    const res = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'streasmr-cv-resolver/1.0'
      },
      timeout: 8000
    });

    if (res.data && res.data.results && res.data.results.length > 0) {
      // Find the best match
      const results = res.data.results;
      
      // Look for exact original match or exact alias match (ignoring spaces)
      const normClean = cleanName.replace(/\s+/g, '');
      let match = results.find(r => {
        const normOrig = (r.original || '').replace(/\s+/g, '');
        return normOrig === normClean || r.name?.toLowerCase() === cleanName.toLowerCase();
      });
      
      if (!match) {
        // Look inside aliases
        match = results.find(r => {
          if (!r.aliases || !Array.isArray(r.aliases)) return false;
          return r.aliases.some(a => {
            const aName = (a.name || '').replace(/\s+/g, '');
            const aOrig = (a.original || '').replace(/\s+/g, '');
            const aLatin = (a.latin || '').toLowerCase();
            return aName === normClean || aOrig === normClean || aLatin === cleanName.toLowerCase();
          });
        });
      }

      // If still not matched, take the first search result if close
      if (!match && results.length > 0) {
        match = results[0];
      }

      if (match) {
        const aliasList = [];
        let matchedAliasLatin = null;

        if (match.aliases && Array.isArray(match.aliases)) {
          match.aliases.forEach(a => {
            if (a.name && !aliasList.includes(a.name)) aliasList.push(a.name);
            if (a.original && !aliasList.includes(a.original)) aliasList.push(a.original);
            if (a.latin && !aliasList.includes(a.latin)) aliasList.push(a.latin);

            const aName = (a.name || '').replace(/\s+/g, '');
            const aOrig = (a.original || '').replace(/\s+/g, '');
            if (aName === normClean || aOrig === normClean) {
              if (a.latin) matchedAliasLatin = a.latin;
            }
          });
        }

        const record = {
          found: true,
          raw: cleanName,
          name: matchedAliasLatin || match.name,              // Specific Romanized name for the queried alias/artist
          canonicalName: match.name,                         // Primary canonical name on VNDB
          original: match.original || '',                    // Original native name (e.g., "民安 ともえ")
          gender: match.gender || null,
          vndbId: match.id,
          aliases: aliasList
        };

        cvCache[cleanName] = record;
        if (!cache) saveCache(cvCache);

        return { ...record, cached: false };
      }
    }

    // Not found in VNDB
    const notFoundRecord = {
      found: false,
      raw: cleanName,
      name: cleanName,
      original: cleanName,
      aliases: [],
      vndbId: null
    };

    cvCache[cleanName] = notFoundRecord;
    if (!cache) saveCache(cvCache);

    return { ...notFoundRecord, cached: false };
  } catch (err) {
    // Return graceful error response without caching failure
    return {
      found: false,
      raw: cleanName,
      error: err.response?.data?.message || err.message
    };
  }
}

/**
 * Batch resolve with rate limit pacing (e.g. 100ms between requests)
 */
async function batchResolveVndb(nameList, delayMs = 150) {
  const cache = loadCache();
  const results = [];

  for (let i = 0; i < nameList.length; i++) {
    const name = nameList[i];
    const res = await resolveVndbCV(name, cache);
    results.push(res);
    
    // Save periodically
    if (i % 5 === 0) saveCache(cache);

    // Rate pacing if not cached
    if (!res.cached && i < nameList.length - 1) {
      await new Promise(r => setTimeout(r, delayMs));
    }
  }

  saveCache(cache);
  return results;
}

module.exports = {
  resolveVndbCV,
  batchResolveVndb,
  loadCache,
  saveCache
};
