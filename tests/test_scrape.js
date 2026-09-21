const axios = require('axios');
const cheerio = require('cheerio');

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Referer': 'https://japaneseasmr.com/',
  'Accept-Language': 'en-US,en;q=0.9,ja;q=0.8',
};

async function searchRJ(query) {
  const isUrl = query.startsWith('http://') || query.startsWith('https://');
  let targetUrl = query;

  if (!isUrl) {
    // Format RJ query
    const rjCode = query.trim().toUpperCase();
    const searchUrl = `https://japaneseasmr.com/?s=${encodeURIComponent(rjCode)}`;
    console.log(`Searching: ${searchUrl}`);
    const res = await axios.get(searchUrl, { headers: HEADERS });
    const $ = cheerio.load(res.data);

    // Look for search results - typically articles/posts
    // Let's find first article link
    let firstPostLink = null;
    
    // WordPress search result selectors
    $('article h2 a, h2.entry-title a, .post a, .entry-title a, a[rel="bookmark"]').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.match(/japaneseasmr\.com\/\d+\/?/)) {
        if (!firstPostLink) firstPostLink = href;
      }
    });

    if (!firstPostLink) {
      // Fallback: any link with digits
      $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && href.match(/japaneseasmr\.com\/\d+\/?$/) && !firstPostLink) {
          firstPostLink = href;
        }
      });
    }

    if (!firstPostLink) {
      throw new Error(`No post found for query "${query}"`);
    }

    targetUrl = firstPostLink;
    console.log(`Found post URL: ${targetUrl}`);
  }

  // Now fetch and parse the target post
  console.log(`Fetching post HTML from: ${targetUrl}`);
  const postRes = await axios.get(targetUrl, { headers: HEADERS });
  const $ = cheerio.load(postRes.data);

  // 1. Extract Title
  const title = $('h1.page-title, h1.entry-title, h1').first().text().trim();

  // 2. Extract RJ Code from metadata or title or content
  let rjCode = '';
  const rjMatch = postRes.data.match(/RJ\d+/i) || targetUrl.match(/RJ\d+/i);
  if (rjMatch) rjCode = rjMatch[0].toUpperCase();

  // 3. Extract Cover Art
  let coverUrl = '';
  // Try fotorama or img_cover
  const imgCover = $('#img_cover, #img_cover_thumbnail img, .fotorama a').first().attr('href') ||
                   $('#img_cover_thumbnail img').attr('data-src') ||
                   $('video[poster]').first().attr('poster') ||
                   $('img.wp-post-image').attr('src');
  if (imgCover) coverUrl = imgCover;

  // 4. Extract CV (Voice Actors)
  let cv = '';
  const cvMatch = postRes.data.match(/cv\s*=\s*['"]([^'"]+)['"]/i) || 
                  postRes.data.match(/CV:\s*([^<\n]+)/i) ||
                  postRes.data.match(/DLSITE CV\s*=\s*([^\n]+)/i);
  if (cvMatch) {
    cv = cvMatch[1].trim();
  }

  // 5. Extract Tags
  const tags = [];
  $('.post-tags a, .entry-tags a, a[rel="tag"]').each((i, el) => {
    const tag = $(el).text().trim();
    if (tag && !tags.includes(tag)) tags.push(tag);
  });

  // 6. Extract Tracks from #cleanp_audio or fallback audioplayer
  const tracks = [];

  // Check #cleanp_audio <video> tags
  $('#cleanp_audio video').each((i, el) => {
    const videoTitle = $(el).attr('title') || $(el).attr('descr') || `Track ${i + 1}`;
    const descr = $(el).attr('descr') || '';
    const poster = $(el).attr('poster') || coverUrl;
    
    // Get sources (.mp3 or .m4a)
    let audioUrl = '';
    $(el).find('source').each((_, s) => {
      const src = $(s).attr('src');
      if (src && !audioUrl) {
        audioUrl = src;
      }
    });

    if (audioUrl) {
      tracks.push({
        index: i + 1,
        title: descr ? `${videoTitle} - ${descr}` : videoTitle,
        url: audioUrl,
        poster: poster
      });
    }
  });

  // Fallback if cleanp_audio is empty: check #audioplayer
  if (tracks.length === 0) {
    $('#audioplayer audio').each((i, el) => {
      const trackTitle = $(el).prev('p').text().trim() || `Track ${i + 1}`;
      let audioUrl = '';
      $(el).find('source').each((_, s) => {
        const src = $(s).attr('src');
        if (src && !audioUrl) audioUrl = src;
      });
      if (audioUrl) {
        tracks.push({
          index: i + 1,
          title: trackTitle,
          url: audioUrl,
          poster: coverUrl
        });
      }
    });
  }

  return {
    postUrl: targetUrl,
    rjCode,
    title,
    coverUrl,
    cv,
    tags,
    tracksCount: tracks.length,
    tracks
  };
}

// Test with RJ441308
searchRJ('RJ441308')
  .then(data => {
    console.log('\n--- Scraped Result ---');
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(err => {
    console.error('Scrape Error:', err.message);
  });
