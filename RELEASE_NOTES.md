# 📜 aStreamer Release Notes

## 🌟 Version 2.1.0 (Stable) — Major Milestone Release

### 🖼️ 1. Multi-Source Bonus Illustration & Gallery Architecture
- **Direct ASMR.one Track Tree Extractor (`extractArtworkFromTree`)**: Recursively walks track trees to extract genuine high-resolution CGs, illustration booklets, and CD jackets (e.g., `02.イラスト / 01.イヴィルシスターズ.png`), preserving every bonus asset without audio duration cutoff filtering.
- **Intelligent Binary Deduplication (`Content-Length` & `ETag`)**: Automatically compares byte sizes and headers to prune duplicate sample banners (`_img_sam.jpg`) when they match the main package artwork (`_img_main.jpg`), while preserving genuine distinct banners.
- **ASMR.one Mirror Pruning**: Automatically skips duplicate ASMR.one cover mirrors when the authentic DLsite main package artwork is available, preventing redundant copies of the same cover while highlighting unique track tree CGs.
- **Automatic Cover Art Back-Update (Self-Healing Promotion)**: In rare cases where a work originally imported with a missing or placeholder cover art, discovering valid artwork during chapter/gallery probing automatically promotes the authentic DLsite package artwork to `work.coverUrl`, saves it to KV/DB, and updates the frontend library grid live.
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

### 📚 4. Multi-Criteria Library Sorting System
- **Comprehensive Sort Dropdown**: Added interactive sorting dropdown on the Library main page with default set to **🚀 Release Date (Latest)** and persistent preference storage (`localStorage`):
  - 🚀 **Release Date**: Latest / Newest First (Default) / Oldest First
  - 📅 **Date Added**: Latest First / Oldest First
  - 🔢 **RJ Code**: Ascending / Oldest Catalog First (`RJ000001` → `RJ999999`)
  - 🎙️ **Voice Actor (CV)**: Alphabetical A → Z
  - ❤️ **Favorites First**: Pinned favorite works at the top
- **Seamless Shuffle & Search Interoperability**: Automatic sort option state preservation when clearing shuffle mode, searching queries, or browsing by genres/circles.

### ⏯️ 5. Local Browser Playback Continuity ("Pick up where you left off")
- **Settings Toggle (Default ON)**: Added a dedicated card under `⚙️ Settings` allowing users to toggle browser-local playback continuity.
- **Local Session Caching**: Throttled every 2 seconds during playback and triggered on pause/track change/beforeunload, storing the current work, track index, audio stream, and precise playback position in browser `localStorage` (`astreamer_last_playback_session`).
- **Instant Paused-State Restoration**: On page reload or fresh visit, the active work and track immediately load into the player bar at the exact timestamp with progress scrubber set, ready to resume immediately on Play without loud unwanted autoplay.

### 🔄 6. Configurable Work Detail Auto-Refresh (Default: OFF)
- **Manual by Default**: Work detail pages only perform full metadata and stream refresh when the user clicks the `🔄 Refresh` button.
- **Settings Toggle (`⚙️ Settings`)**: Added "Auto-refresh on visit" (default: OFF). When enabled, navigating to a work detail page triggers the 4-stage refresh automatically once per browser session.

### 🕒 7. Robust Playback History Synchronization & De-duplication
- **Normalized RJ Code Matching**: Ensures `RJ01142278` and `RJ1142278` format variations deduplicate seamlessly across SQLite and Cloudflare KV.
- **True Playback Registration**: History only registers on actual user-initiated playback or `audio.play()` trigger, preventing paused restoration sessions from hijacking the history queue.

### 🎛️ 8. Bottom Player Bar Thumb-Friendly Layout Inversion & Mobile Show Work Button
- **Progress Scrubber Swapped to Top Row**: Swapped the positions of the progress bar scrubber and control buttons across mobile and desktop. Placing the time/scrubber on the top row and action buttons on the bottom row prevents accidental track seeking or timeline scrubbing during thumb taps or swipes.
- **Mobile Show Work Button (`👁️`)**: Added the quick-jump Show Work button (`#playerBarWorkBtnMobile`) directly into the mobile bottom control strip next to chapters (`📑`), allowing mobile users to jump to the full work detail view with one tap.

### 🛡️ 9. Strict Audio Source Resolution & False-Positive Elimination
- **Eliminated Fuzzy Post Fallback**: Fixed an issue where WordPress full-text search for non-existent works returned fuzzy keywords and fell back to `posts[0]`.
- **Guaranteed Match Verification**: Audio sources now strictly require the exact RJ code in post slug, title, or body before flagging a work as available with on-demand lazy audio. Works with no audio on either mirror are now correctly rejected or sent to wishlist.

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
