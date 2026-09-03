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
      totalTracks: 6,
      tracks: [
        { id: 1, title: '01.よわよわおちんぽ強化訓練寸止め手コキ', formattedTime: '00:00:00', startTime: 0, isHls: true, rawUrl: 'https://v.weeab0o.xyz/RJ01473335.m3u8', streamUrl: '/stream?url=https%3A%2F%2Fv.weeab0o.xyz%2FRJ01473335.m3u8', poster: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ01473335_img_main.jpg' },
        { id: 2, title: '02.交尾想像訓練オナサポ', formattedTime: '00:20:04', startTime: 1204, isHls: true, rawUrl: 'https://v.weeab0o.xyz/RJ01473335.m3u8', streamUrl: '/stream?url=https%3A%2F%2Fv.weeab0o.xyz%2FRJ01473335.m3u8', poster: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ01473335_img_main.jpg' },
        { id: 3, title: '03.雑魚オス弱点克服訓練、ねっとり乳首いじめオナホコキ', formattedTime: '00:36:49', startTime: 2209, isHls: true, rawUrl: 'https://v.weeab0o.xyz/RJ01473335.m3u8', streamUrl: '/stream?url=https%3A%2F%2Fv.weeab0o.xyz%2FRJ01473335.m3u8', poster: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ01473335_img_main.jpg' },
        { id: 4, title: '04.ナマハメ交尾訓練、メス優位ドスケベ暴走騎乗位搾精', formattedTime: '00:59:04', startTime: 3544, isHls: true, rawUrl: 'https://v.weeab0o.xyz/RJ01473335.m3u8', streamUrl: '/stream?url=https%3A%2F%2Fv.weeab0o.xyz%2FRJ01473335.m3u8', poster: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ01473335_img_main.jpg' },
        { id: 5, title: '05.ナマハメ交尾訓練、オス優位いちゃらぶすきすき対面座位セックス', formattedTime: '01:18:06', startTime: 4686, isHls: true, rawUrl: 'https://v.weeab0o.xyz/RJ01473335.m3u8', streamUrl: '/stream?url=https%3A%2F%2Fv.weeab0o.xyz%2FRJ01473335.m3u8', poster: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ01473335_img_main.jpg' },
        { id: 6, title: '早期購入特典フリートーク_事務的メイドの好意だだ漏れよわよわマゾオス克服訓練', formattedTime: '01:37:39', startTime: 5859, isHls: true, rawUrl: 'https://v.weeab0o.xyz/RJ01473335.m3u8', streamUrl: '/stream?url=https%3A%2F%2Fv.weeab0o.xyz%2FRJ01473335.m3u8', poster: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ01473335_img_main.jpg' }
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
        { id: 2, title: 'Track 2 (トラック2)', formattedTime: '00:00:00', startTime: 0, isHls: false, rawUrl: 'https://v.weeab0o.xyz/RJ441308 2.mp3', streamUrl: '/stream?url=https%3A%2F%2Fv.weeab0o.xyz%2FRJ441308%202.mp3', poster: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ441308_img_main.jpg' },
        { id: 3, title: 'Track 3 (トラック3)', formattedTime: '00:00:00', startTime: 0, isHls: false, rawUrl: 'https://v.weeab0o.xyz/RJ441308 3.mp3', streamUrl: '/stream?url=https%3A%2F%2Fv.weeab0o.xyz%2FRJ441308%203.mp3', poster: '/image-proxy?url=https%3A%2F%2Fpic.weeabo0.xyz%2FRJ441308_img_main.jpg' }
      ],
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
    data.works = data.works || {};
    return data;
  } catch (err) {
    console.error('[DB Read Error]', err.message);
    return DEFAULT_DB;
  }
}

function writeDb(data) {
  try {
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
  db.works[cleanRj] = {
    ...work,
    rjCode: cleanRj,
    addedAt: db.works[cleanRj]?.addedAt || new Date().toISOString(),
    favorite: db.works[cleanRj]?.favorite || false
  };
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
  const pl = (db.playlists || []).find(p => p.id === playlistId);
  if (pl) {
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
  const works = getAllWorks();
  const tagCounts = {};
  works.forEach(w => {
    (w.tags || []).forEach(t => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });
  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
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

module.exports = {
  getAllWorks,
  getWorkByRj,
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
  readDb,
  writeDb,
  SFW_DISGUISE_RJ_LIST
};
