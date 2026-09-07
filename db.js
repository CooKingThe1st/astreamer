const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'astreamer_db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 26 SFW Cover Arts for Disguise (PSFW Mode)
const SFW_DISGUISE_RJ_LIST = [
  'RJ01681691', 'RJ01678330', 'RJ01694805', 'RJ01688728', 'RJ01693711',
  'RJ335043', 'RJ01360841', 'RJ346413', 'RJ01229288', 'RJ321035',
  'RJ317278', 'RJ387519', 'RJ370190', 'RJ343025', 'RJ373001',
  'RJ01144236', 'RJ336447', 'RJ329940', 'RJ403038', 'RJ370099',
  'RJ299717', 'RJ01323001', 'RJ363741', 'RJ333531', 'RJ357211', 'RJ01040461'
];

// Base Dictionary for Standard ASMR / DLsite Genre Translations
const BASE_TAG_DICT = {
  "耳かき": "Ear Cleaning",
  "耳舐め": "Ear Licking",
  "耳ふー": "Ear Blowing",
  "添い寝": "Sleeping Together",
  "囁き": "Whispering",
  "マッサージ": "Massage",
  "バイノーラル": "Binaural",
  "ダミーヘッドマイク": "Dummy Head Mic",
  "甘やかし": "Pampering",
  "癒やし": "Healing",
  "オナサポ": "Masturbation Support",
  "言葉責め": "Verbal Degradation",
  "催眠": "Hypnosis",
  "主従": "Master / Servant",
  "幼馴染": "Childhood Friend",
  "妹": "Little Sister",
  "姉": "Older Sister",
  "先輩": "Senior (Senpai)",
  "後輩": "Junior (Kouhai)",
  "同級生": "Classmate",
  "クーデレ": "Kuudere",
  "ツンデレ": "Tsundere",
  "ヤンデレ": "Yandere",
  "メイド": "Maid",
  "ギャル": "Gyaru",
  "お姉さん": "Older Woman",
  "母性": "Maternal",
  "ママ": "Mom",
  "人妻": "Married Woman",
  "淫語": "Dirty Talk",
  "射精管理": "Ejaculation Control",
  "寸止め": "Edging",
  "フェラ": "Blowjob",
  "手コキ": "Handjob",
  "パイズリ": "Paizuri (Breastjob)",
  "足コキ": "Footjob",
  "アナル": "Anal",
  "潮吹き": "Squirting",
  "中出し": "Creampie",
  "キス": "Kissing",
  "吐息": "Breathing",
  "咀嚼音": "Chewing Sounds",
  "タッピング": "Tapping",
  "スクラッチ": "Scratching",
  "心音": "Heartbeat",
  "ASMR": "ASMR",
  "ロールプレイ": "Roleplay",
  "シチュエーションボイス": "Situation Voice",
  "ドラマCD": "Drama CD",
  "朗読": "Reading Aloud",
  "お嬢様": "Rich Girl / Lady",
  "ボクっ娘": "Tomboy (Bokukko)",
  "メスガキ": "Cheeky Brat (Mesugaki)",
  "男の娘": "Femboy (Otokonoko)",
  "ショタ": "Shota",
  "ロリ": "Loli",
  "百合": "Yuri",
  "BL": "BL",
  "逆レイプ": "Reverse Rape",
  "痴女": "Slutty Woman",
  "淫魔": "Succubus",
  "エルフ": "Elf",
  "獣耳": "Animal Ears",
  "猫耳": "Cat Ears",
  "狐耳": "Fox Ears",
  "犬耳": "Dog Ears",
  "吸血鬼": "Vampire",
  "看護師": "Nurse",
  "女医": "Female Doctor",
  "教師": "Teacher",
  "生徒": "Student",
  "巫女": "Shrine Maiden",
  "温泉": "Hot Spring",
  "お風呂": "Bath",
  "雨音": "Rain Sound",
  "焚き火": "Campfire",
  "水音": "Water Sounds",
  "密着": "Close Contact",
  "密着耳かき": "Close-contact Ear Cleaning",
  "全裸": "Naked",
  "巨乳": "Big Breasts",
  "貧乳": "Small Breasts",
  "微乳": "Petite Breasts",
  "爆乳": "Huge Breasts",
  "ぽっちゃり": "Chubby",
  "スレンダー": "Slender",
  "拘束": "Restraint",
  "目隠し": "Blindfold",
  "調教": "Training / Discipline",
  "催眠音声": "Hypnosis Voice",
  "催眠導入": "Hypnosis Induction",
  "洗脳": "Brainwashing",
  "隷属": "Enslavement",
  "ASMR/音声": "ASMR / Voice"
};

function mergeTagDict(db, newTags) {
  if (!db) return false;
  db.tagDict = Object.assign({}, BASE_TAG_DICT, db.tagDict || {});
  let changed = false;
  const translations = (newTags && newTags.tagTranslations) ? newTags.tagTranslations : newTags;
  if (translations && typeof translations === 'object') {
    for (const [ja, en] of Object.entries(translations)) {
      if (ja && en && ja !== en && db.tagDict[ja] !== en) {
        db.tagDict[ja] = en;
        changed = true;
      }
    }
  }
  return changed;
}

const DEFAULT_DB = {
  version: 1,
  works: {
    'RJ01473335': {
      rjCode: 'RJ01473335',
      title: '事務的メイドの好意だだ漏れよわよわマゾオス克服訓練',
      circle: '裏あおぎり学園',
      cv: 'こまる',
      tags: ['メイド', 'ラブラブ/あまあま', '女性優位', '手コキ', '中出し', 'オナサポ', '耳舐め', '乳首責め', 'NSFW', 'R18'],
      coverUrl: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ01473335_img_main.jpg',
      rawCoverUrl: 'https://pic.weeabo0.xyz/RJ01473335_img_main.jpg',
      hasHls: true,
      totalTracks: 1,
      tracks: [
        { id: 1, title: '01. Full Audio Session (HLS Master)', formattedTime: '01:45:12', startTime: 0, isHls: true, rawUrl: 'https://v.weeab0o.xyz/RJ01473335.m3u8', streamUrl: '/stream?url=https%3A%2F%2Fv.weeab0o.xyz%2FRJ01473335.m3u8', poster: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ01473335_img_main.jpg' }
      ],
      chapters: [
        { id: 1, title: '01.よわよわおちんぽ強化訓練寸止め手コキ', formattedTime: '00:00:00', startTime: 0 },
        { id: 2, title: '02.交尾想像訓練オナサポ', formattedTime: '00:20:04', startTime: 1204 },
        { id: 3, title: '03.雑魚オス弱点克服訓練、ねっとり乳首いじめオナホコキ', formattedTime: '00:36:49', startTime: 2209 },
        { id: 4, title: '04.ナマハメ交尾訓練、メス優位ドスケベ暴走騎乗位搾精', formattedTime: '00:59:04', startTime: 3544 },
        { id: 5, title: '05.ナマハメ交尾訓練、オス優位いちゃらぶすきすき対面座位セックス', formattedTime: '01:18:06', startTime: 4686 },
        { id: 6, title: '早期購入特典フリートーク_事務的メイドの好意だだ漏れよわよわマゾオス克服訓練', formattedTime: '01:37:39', startTime: 5859 }
      ],
      addedAt: new Date().toISOString(),
      favorite: true
    },
    'RJ441308': {
      rjCode: 'RJ441308',
      title: '愛聖天使ラブメアリー ～堕ちた魔法少女たちの淫惑～',
      circle: 'Voice Unreal',
      cv: 'いねむりすやこ, Yuka Hinata 【陽向葵ゅか】, Kazari Hanashiro 【花城かざり】',
      tags: ['Futanari', 'NSFW', 'Magical Girl', 'Ear Licking', 'Whispering', '18禁'],
      coverUrl: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ441308_img_main.jpg',
      rawCoverUrl: 'https://pic.weeabo0.xyz/RJ441308_img_main.jpg',
      hasHls: false,
      totalTracks: 3,
      tracks: [
        { id: 1, title: 'Track 1 (トラック1)', formattedTime: '00:00:00', startTime: 0, isHls: false, rawUrl: 'https://v.weeab0o.xyz/RJ441308.mp3', streamUrl: '/stream?url=https%3A%2F%2Fv.weeab0o.xyz%2FRJ441308.mp3', poster: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ441308_img_main.jpg' },
        { id: 2, title: 'Track 2 (トラック2)', formattedTime: '00:00:00', startTime: 0, isHls: false, rawUrl: 'https://v.weeab0o.xyz/RJ441308 2.mp3', streamUrl: '/stream?url=https%3A%2F%2Fv.weeab0o.xyz%2FRJ441308 2.mp3', poster: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ441308_img_main.jpg' },
        { id: 3, title: 'Track 3 (トラック3)', formattedTime: '00:00:00', startTime: 0, isHls: false, rawUrl: 'https://v.weeab0o.xyz/RJ441308 3.mp3', streamUrl: '/stream?url=https%3A%2F%2Fv.weeab0o.xyz%2FRJ441308 3.mp3', poster: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ441308_img_main.jpg' }
      ],
      chapters: [],
      addedAt: new Date().toISOString(),
      favorite: false
    }
  },
  playlists: [
    {
      id: 'pl-favorites',
      name: '❤️ Favorites',
      description: 'Your favorited audio tracks and ASMR sessions',
      coverUrl: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ01473335_img_main.jpg',
      items: [
        { rjCode: 'RJ01473335', trackId: 1, title: '事務的メイドの好意だだ漏れよわよわマゾオス克服訓練', workTitle: '事務的メイドの好意だだ漏れよわよわマゾオス克服訓練', cv: 'こまる', poster: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ01473335_img_main.jpg' }
      ],
      createdAt: new Date().toISOString()
    }
  ],
  history: [],
  wishlist: [],
  tagDict: BASE_TAG_DICT,
  settings: {
    contentMode: 'NSFW' // 'SFW' | 'PSFW' | 'NSFW'
  }
};

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDb(DEFAULT_DB);
      return DEFAULT_DB;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    data.settings = data.settings || { contentMode: 'NSFW' };
    data.playlists = data.playlists || [];
    data.history = data.history || [];
    data.wishlist = data.wishlist || [];
    data.works = data.works || {};
    data.tagDict = Object.assign({}, BASE_TAG_DICT, data.tagDict || {});
    return data;
  } catch (err) {
    console.error('[DB Read Error]', err.message);
    return DEFAULT_DB;
  }
}

function writeDb(data) {
  try {
    if (data && data.works && typeof data.works === 'object') {
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
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB Write Error]', err.message);
  }
}

// Work Methods
function getAllWorks() {
  const db = readDb();
  return Object.values(db.works).sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0));
}

function getWorkByRj(rjCode) {
  const db = readDb();
  return db.works[rjCode.toUpperCase()] || null;
}

function saveWork(work) {
  const db = readDb();
  const cleanRj = work.rjCode.toUpperCase();
  const workCopy = { ...work };
  delete workCopy.chapters;
  db.works[cleanRj] = {
    ...workCopy,
    rjCode: cleanRj,
    addedAt: db.works[cleanRj]?.addedAt || new Date().toISOString(),
    favorite: db.works[cleanRj]?.favorite || false
  };
  delete db.works[cleanRj].chapters;
  writeDb(db);
  return db.works[cleanRj];
}

function deleteWork(rjCode) {
  const db = readDb();
  const cleanRj = rjCode.toUpperCase();
  if (db.works[cleanRj]) {
    delete db.works[cleanRj];
    // Also remove from favorites playlist if present
    const favPl = (db.playlists || []).find(p => p.id === 'pl-favorites');
    if (favPl) {
      favPl.items = favPl.items.filter(it => it.rjCode !== cleanRj);
    }
    writeDb(db);
    return true;
  }
  return false;
}

function toggleFavorite(rjCode) {
  const db = readDb();
  const cleanRj = rjCode.toUpperCase();
  const work = db.works[cleanRj];

  if (work) {
    const isFav = !work.favorite;
    work.favorite = isFav;

    db.playlists = db.playlists || [];
    let favPl = db.playlists.find(p => p.id === 'pl-favorites');
    if (!favPl) {
      favPl = {
        id: 'pl-favorites',
        name: '❤️ Favorites',
        description: 'Your favorited audio tracks and ASMR sessions',
        coverUrl: work.coverUrl || '',
        items: [],
        createdAt: new Date().toISOString()
      };
      db.playlists.unshift(favPl);
    }

    if (isFav) {
      const exists = favPl.items.some(it => it.rjCode === cleanRj);
      if (!exists) {
        favPl.items.push({
          rjCode: cleanRj,
          trackId: 1,
          title: work.title,
          workTitle: work.title,
          cv: work.cv || '',
          poster: work.coverUrl || ''
        });
        if (!favPl.coverUrl) favPl.coverUrl = work.coverUrl;
      }
    } else {
      favPl.items = favPl.items.filter(it => it.rjCode !== cleanRj);
    }

    writeDb(db);
    return isFav;
  }
  return false;
}

// Playlist Methods
function getAllPlaylists() {
  const db = readDb();
  return db.playlists || [];
}

function createPlaylist(name, description = '') {
  const db = readDb();
  const newPl = {
    id: 'pl-' + Date.now(),
    name,
    description,
    coverUrl: '',
    items: [],
    createdAt: new Date().toISOString()
  };
  db.playlists = db.playlists || [];
  db.playlists.push(newPl);
  writeDb(db);
  return newPl;
}

function deletePlaylist(id) {
  const db = readDb();
  db.playlists = (db.playlists || []).filter(p => p.id !== id);
  writeDb(db);
  return true;
}

function addToPlaylist(playlistId, item) {
  const db = readDb();
  const plId = decodeURIComponent(playlistId || '').trim();
  const pl = (db.playlists || []).find(p => String(p.id).trim() === plId || String(p.id) === String(playlistId).trim());
  if (pl) {
    pl.items = pl.items || [];
    pl.items.push(item);
    if (!pl.coverUrl && item.poster) pl.coverUrl = item.poster;
    writeDb(db);
    return pl;
  }
  return null;
}

function removeFromPlaylist(playlistId, index) {
  const db = readDb();
  const pl = (db.playlists || []).find(p => p.id === playlistId);
  if (pl && pl.items[index]) {
    pl.items.splice(index, 1);
    writeDb(db);
    return pl;
  }
  return null;
}

// Aggregation Methods (Artists & Genres)
function getAllTags() {
  const db = readDb();
  const works = getAllWorks();
  const tagCounts = {};
  works.forEach(w => {
    (w.tags || []).forEach(t => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });
  const tags = Object.entries(tagCounts)
    .map(([name, count]) => ({
      name,
      count,
      en: db.tagDict?.[name] || BASE_TAG_DICT[name] || ''
    }))
    .sort((a, b) => b.count - a.count);
  return { tags, tagDict: db.tagDict || BASE_TAG_DICT };
}

function getAllArtists() {
  const works = getAllWorks();
  const artistCounts = {};
  works.forEach(w => {
    if (w.cv && w.cv !== 'N/A') {
      const cvList = w.cv.split(/[,、/]/).map(s => s.trim()).filter(Boolean);
      cvList.forEach(cv => {
        artistCounts[cv] = (artistCounts[cv] || 0) + 1;
      });
    }
  });
  return Object.entries(artistCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

function getSettings() {
  const db = readDb();
  return db.settings || { contentMode: 'NSFW' };
}

function updateSettings(settings) {
  const db = readDb();
  db.settings = { ...(db.settings || {}), ...settings };
  writeDb(db);
  return db.settings;
}

function getHistory() {
  const db = readDb();
  return db.history || [];
}

function addHistoryEntry(entry) {
  if (!entry || !entry.rjCode) return getHistory();
  const db = readDb();
  db.history = db.history || [];
  const item = {
    rjCode: entry.rjCode,
    title: entry.title || '',
    trackTitle: entry.trackTitle || '',
    trackIndex: entry.trackIndex || 0,
    coverUrl: entry.coverUrl || '',
    cv: entry.cv || '',
    circle: entry.circle || '',
    playedAt: entry.playedAt || new Date().toISOString()
  };
  db.history = db.history.filter(h => h.rjCode !== entry.rjCode);
  db.history.unshift(item);
  if (db.history.length > 20) db.history = db.history.slice(0, 20);
  writeDb(db);
  return db.history;
}

function clearHistory() {
  const db = readDb();
  db.history = [];
  writeDb(db);
  return [];
}

function getWishlist() {
  const db = readDb();
  return db.wishlist || [];
}

function saveWishlistItem(entry) {
  if (!entry || !entry.rjCode) return getWishlist();
  const db = readDb();
  db.wishlist = db.wishlist || [];
  const cleanRj = entry.rjCode.toUpperCase().trim();
  
  // If already in works library, don't keep in wishlist
  if (db.works && db.works[cleanRj]) return db.wishlist;

  const item = {
    rjCode: cleanRj,
    title: entry.title || `Work ${cleanRj}`,
    coverUrl: entry.coverUrl || '',
    cv: entry.cv || '',
    circle: entry.circle || '',
    reason: entry.reason || 'Pending crawler / audio stream',
    addedAt: entry.addedAt || new Date().toISOString()
  };

  const idx = db.wishlist.findIndex(w => w.rjCode === cleanRj);
  if (idx >= 0) {
    db.wishlist[idx] = { ...db.wishlist[idx], ...item };
  } else {
    db.wishlist.unshift(item);
  }
  writeDb(db);
  return db.wishlist;
}

function removeWishlistItem(rjCode) {
  const db = readDb();
  const cleanRj = (rjCode || '').toUpperCase().trim();
  db.wishlist = (db.wishlist || []).filter(w => w.rjCode !== cleanRj);
  writeDb(db);
  return db.wishlist;
}

function clearWishlist() {
  const db = readDb();
  db.wishlist = [];
  writeDb(db);
  return [];
}

module.exports = {
  getAllWorks,
  getWorkByRj,
  getWork: getWorkByRj,
  saveWork,
  deleteWork,
  toggleFavorite,
  getAllPlaylists,
  createPlaylist,
  deletePlaylist,
  addToPlaylist,
  removeFromPlaylist,
  getAllTags,
  getAllArtists,
  getSettings,
  updateSettings,
  getHistory,
  addHistoryEntry,
  clearHistory,
  getWishlist,
  saveWishlistItem,
  removeWishlistItem,
  clearWishlist,
  readDb,
  writeDb,
  BASE_TAG_DICT,
  mergeTagDict,
  SFW_DISGUISE_RJ_LIST
};
