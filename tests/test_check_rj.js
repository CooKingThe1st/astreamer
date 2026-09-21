const axios = require('axios');

async function check(rj) {
  try {
    const res = await axios.get(`https://www.dlsite.com/maniax/api/=/product.json?workno=${rj}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    console.log(`=== ${rj} ===`);
    if (res.data && res.data.length > 0) {
      const item = res.data[0];
      console.log('Title:', item.work_name);
      console.log('Circle:', item.maker_name);
      console.log('Age Category / Rating:', item.age_category, item.rate_average_2dp);
      console.log('Genres:', (item.genres || []).map(g => g.name || g));
    }
  } catch (e) {
    console.log(rj, e.message);
  }
}

check('RJ01196620');
