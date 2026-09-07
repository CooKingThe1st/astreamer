const https = require('https');

https.get('https://astreamer.cookingthe1st.workers.dev/api/tracks/RJ01062702', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const d = JSON.parse(data);
      console.log('Chapters:', d.chapters ? d.chapters.length : 0);
      console.log('Gallery count:', d.gallery ? d.gallery.length : 0);
      if (d.gallery && d.gallery.length > 0) {
        console.log('First 3 items:', d.gallery.slice(0, 3));
      }
    } catch(e) {
      console.log('Error parsing:', e.message, data.slice(0, 200));
    }
  });
}).on('error', (err) => {
  console.error('Fetch error:', err);
});
