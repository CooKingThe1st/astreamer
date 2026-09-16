# 📜 aStreamer Release Notes

## 🌟 Version 2.1.0 (Stable) — Major Milestone Release

### 🖼️ 1. Multi-Source Bonus Illustration & Gallery Architecture
- **Direct ASMR.one Track Tree Extractor (`extractArtworkFromTree`)**: Recursively walks track trees to extract genuine high-resolution CGs, illustration booklets, and CD jackets (e.g., `02.イラスト / 01.イヴィルシスターズ.png`), preserving every bonus asset without audio duration cutoff filtering.
- **Intelligent Binary Deduplication (`Content-Length` & `ETag`)**: Automatically compares byte sizes and headers to prune duplicate sample banners (`_img_sam.jpg`) when they match the main package artwork (`_img_main.jpg`), while preserving genuine distinct banners.
- **ASMR.one Mirror Pruning**: Automatically skips duplicate ASMR.one cover mirrors when the authentic DLsite main package artwork is available, preventing redundant copies of the same cover while highlighting unique track tree CGs.
- **Distinct Color-Coded Source Attribution Badges**:
  - 🌿 **ASMR.one**: Emerald Mint (`#34d399`, soft background `rgba(16,185,129,0.15)`)
  - 💎 **DLsite Doujin / Pro**: Sapphire Blue (`#38bdf8`, soft background `rgba(56,189,248,0.15)`)
  - 💜 **Weeab0o**: Lavender Purple (`#c084fc`, soft background `rgba(192,132,252,0.15)`)
- **Dual-Mode Gallery Viewer**: Seamless switching between mobile-optimized horizontal swipe reader (`↔ Carousel View`) and desktop grid (`⊞ Grid View`) with responsive lightbox viewer.

### 🔄 2. Real-Time 4-Phase Progressive Refresh Pipeline
- **Stage-by-Stage Lower-Bottom Notification Bubble (`#appToast`)**:
  1. `🎵 [1/4] Resolving tracks for RJXXXX...`
  2. `🏷️ [2/4] Updating CV, Circle & Tags for RJXXXX...`
  3. `📑 [3/4] Aligning chapters & timestamps...`
  4. `🖼️ [4/4] Finalizing illustrations & artwork...`
  5. `✨ RJXXXX: Up-to-date (🎵 X tracks, 🏷️ Y tags, 📑 Z chapters, 🖼️ W artwork)`
- **Unified Completion UI Sync**: The Work Detail view and Gallery counter synchronize simultaneously at Phase 4 completion, preventing out-of-order UI jumps during early stages.
- **Smooth Button States**: The refresh button displays spinning stage status `[1/4]` through `[4/4]`, transitions to `✅ Up-to-date!`, and cleanly resets to `🔄 Refresh`.

### ⚡ 3. Cloudflare Workers & Node.js Runtime Parity
- **Safe Worker Subrequest Layer (`safeWorkerFetch`)**: Replaced non-standard abort timeouts with cross-platform `AbortController` + `setTimeout` management for zero runtime crashes on Cloudflare Workers.
- **Automated AST & Top-Level Syntax Verification**: Integrated `advance_validate_syntax.js` verifying 0 top-level symbol collisions, script template correctness, and ES module compatibility.
- **Failover Image & Stream Proxying**: Automated candidate resolution in `/image-proxy` and `/stream` with instant fallback between `/media/download/` and `/media/stream/` paths and proper `Referer: https://www.asmr.one/` header forwarding.

---

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
