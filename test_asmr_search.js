const axios = require('axios');

async function searchAsmrApi(title) {
  try {
    const res = await axios.get(`https://api.asmr-200.com/api/search/${encodeURIComponent(title)}`, {
      timeout: 8000
    });
    if (res.data && res.data.works) {
      console.log('Found works in ASMR API:', res.data.works.slice(0, 3).map(w => ({ id: w.id, source_id: w.source_id, title: w.title })));
    }
  } catch (e) {
    console.log('ASMR API search:', e.message);
  }
}

searchAsmrApi('ささやきオナサポ');
