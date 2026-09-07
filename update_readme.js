const fs = require('fs');
const path = require('path');

const readmePath = path.join(__dirname, 'README.md');
let content = fs.readFileSync(readmePath, 'utf8');

// Replace badge
content = content.replace(
  'badge/Version-1.1%20Official-38bdf8',
  'badge/Version-1.5%20Official-38bdf8'
);

// Add Version 1.5 Highlights if not present
if (!content.includes('## 🚀 Version 1.5 Milestone Highlights')) {
  const v15Section = `## 🚀 Version 1.5 Milestone Highlights

* **🏷️ Self-Learning Bilingual Tag Dictionary**:
  * **JapaneseASMR-Style Formatting**: Dynamic on-the-fly bilingual rendering (e.g. \`耳かき (Ear Cleaning)\`, \`添い寝 (Sleeping Together)\`).
  * **Autonomous Vocabulary Learning**: Automatically fetches and accumulates English translations from the ASMR.one API into Cloudflare KV with zero-write diff protection.
  * **Bilingual Search Engine**: Full keyword querying and genre filtering across English and Japanese terms simultaneously.
* **🖼️ Adaptive Artwork & Illustration Gallery**:
  * **Horizontal Swipe Reader Carousel**: Mobile-optimized full-height card strip (\`.view-strip\`) with snap-to-card scrolling and centered uncropped view for 100+ manga/doujin scans.
  * **One-Tap Mode Switcher**: Easily toggle between the \`⊞ Grid View\` and \`↔ Carousel View\`.
  * **Immersive Lightbox Popup**: Full-screen high-resolution preview with keyboard/touch navigation.
* **📱 Comprehensive Mobile Card Overhaul**:
  * Transformed all desktop tables (Playlist Tracks, Library List View, Playback History, Chapters) into compact **2-row responsive mobile cards** (~58px height), preventing long Japanese titles from creating multi-line wrapping sprawl.
* **🔔 Floating YouTube-Style Toast Notifications**:
  * Minimal, unobtrusive auto-dismissing bottom floating toasts for playlist actions and metadata refreshes.

---

## ✨ Version 1.1 Quality-of-Life (QoL) Features`;

  content = content.replace('## ✨ Version 1.1 Quality-of-Life (QoL) Features', v15Section);
}

fs.writeFileSync(readmePath, content, 'utf8');
console.log('README.md successfully updated to Version 1.5 with UTF-8 encoding!');
