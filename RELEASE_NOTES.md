# 📜 aStreamer Release Notes

## 🚀 Version 1.5.0 — Milestone Release

### 🏷️ 1. Self-Learning Bilingual Tag Dictionary System
- **JapaneseASMR-Style Tag Formatting**: Dynamic bilingual tag pills rendering (e.g. `耳かき (Ear Cleaning)`, `添い寝 (Sleeping Together)`).
- **Autonomous Vocabulary Learning**: Automatically extracts and learns translations from the ASMR.one API into Cloudflare KV with zero-write diff protection.
- **Bilingual Search Engine**: Full keyword querying and genre filtering across English and Japanese terms simultaneously.

### 🖼️ 2. Adaptive Artwork & Illustration Gallery
- **Horizontal Swipe Reader Carousel**: Mobile-optimized full-height card strip (`.view-strip`) with snap-to-card scrolling and centered uncropped view for 100+ manga/doujin scans.
- **One-Tap Mode Switcher**: Easily toggle between `⊞ Grid View` and `↔ Carousel View`.
- **Immersive Lightbox Popup**: Full-screen high-resolution preview with keyboard and touch navigation.

### 📱 3. Comprehensive Mobile UI Overhaul (Compact 2-Row Cards)
- **Playlist Track List**: Compact 2-row cards with square album art, single-line track title, and subtitle row (`Work Title • CV`), reducing row height from >150px down to ~58px.
- **Library List View**: 2-row cards with cover art, badges (`CV • Circle • RJ Code`), and quick action buttons.
- **Playback History View**: 2-row cards with track names, metadata pills, and relative timestamps.
- **Chapter / Multi-Track Cards**: 2-row cards with clear jump action and duration offsets.

### 🔔 4. Floating Toast Notifications & UI Polish
- Replaced browser alerts with clean YouTube-style floating bottom toasts for playlist additions and metadata refreshes.

---

## 🚀 Version 1.1.0 — Quality-of-Life (QoL) Upgrade
- **Now Playing Floating Popup Player**: Expandable floating card with large glowing cover art, tracklist/chapter drawer, and full playback controls.
- **Responsive Mobile Top Navbar**: Sidebar converts into top header with horizontal scrolling tabs.
- **Explorer View Modes**: Large Cards, Medium Grid, Compact Grid, and Detailed List with pagination.
- **Playlist Management**: Create, add, remove, and delete custom playlists.
- **Disguise / Stealth SFW Mode**: Disguises NSFW cover art with stylized SFW imagery (Press `Esc` to toggle).
