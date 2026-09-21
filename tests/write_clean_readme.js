const fs = require('fs');
const path = require('path');

const readmeContent = `# 🎧 aStreamer — Universal ASMR & Doujin Audio Streaming Platform

[![Version](https://img.shields.io/badge/Version-1.5%20Official-38bdf8?style=for-the-badge)](https://github.com/CooKingThe1st/astreamer)
[![Deploy to Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare%20Workers-f38020?style=for-the-badge&logo=cloudflare)](https://workers.cloudflare.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🌟 Overview

**aStreamer** is a self-hosted, ultra-responsive, zero-dependency web application & streaming audio player for ASMR, Voice Drama, and Doujin audio works. Built from the ground up for seamless operation both as a **100% serverless Cloudflare Worker** (backed by Cloudflare KV) and as a **lightweight standalone Node.js server**.

---

## 🚀 Version 1.5 Milestone Highlights

* **🏷️ Self-Learning Bilingual Tag Dictionary**:
  * **JapaneseASMR-Style Formatting**: Dynamic on-the-fly bilingual rendering (e.g. \`耳かき (Ear Cleaning)\`, \`添い寝 (Sleeping Together)\`).
  * **Autonomous Vocabulary Learning**: Automatically fetches and accumulates English translations from the ASMR.one API into Cloudflare KV with zero-write diff protection.
  * **Bilingual Search Engine**: Full keyword querying and genre filtering across English and Japanese terms simultaneously.
* **🖼️ Adaptive Artwork & Illustration Gallery**:
  * **Horizontal Swipe Reader Carousel**: Mobile-optimized full-height card strip (\`.view-strip\`) with snap-to-card scrolling and centered uncropped view for 100+ manga/doujin scans.
  * **One-Tap Mode Switcher**: Easily toggle between \`⊞ Grid View\` and \`↔ Carousel View\`.
  * **Immersive Lightbox Popup**: Full-screen high-resolution preview with keyboard/touch navigation.
* **📱 Comprehensive Mobile Card Overhaul**:
  * Transformed all desktop tables (Playlist Tracks, Library List View, Playback History, Chapters) into compact **2-row responsive mobile cards** (~58px height), preventing long Japanese titles from creating multi-line wrapping sprawl.
* **🔔 Floating YouTube-Style Toast Notifications**:
  * Minimal, unobtrusive auto-dismissing bottom floating toasts for playlist actions and metadata refreshes.

---

## ✨ Core Features & Highlights

* **🗖 Rectangle Floating Popup Player (Now Playing Card)**:
  * Click the glowing mini-album art or maximize button to pop open a sleek, cyberpunk-styled floating player.
  * Features high-resolution cover glow, integrated tracklist & chapter drawer, volume scrubbers, and playback controls.
  * **Escape Key Handling**: Press \`Esc\` to instantly minimize the popup player back to the bottom bar (or toggle stealth disguise mode when closed).
* **📱 Responsive Mobile Top Navbar**:
  * On mobile/tablets, the fixed sidebar smoothly collapses into a sleek top header with horizontal scrolling category tabs (\`🎧 Library\`, \`📁 Folders\`, \`🏷️ Genres\`, \`📜 Playlists\`, \`🕒 History\`, \`⚙️ Settings\`).
* **🗂️ Explorer View Modes & Pagination**:
  * Switch on-the-fly between **Large Cards**, **Medium Grid**, **Compact Grid**, and **Detailed List** views.
  * Supports configurable items per page (\`10\`, \`20\`, \`50\`, \`100\`, or \`All\`) with responsive pagination controls.
* **📜 Playlist Management**:
  * Add individual tracks or entire works to custom playlists with one tap.
  * Built-in \`❤️ Favorites\` playlist automatically seeded and pinned to the top.
* **🛡️ Content Privacy & Stealth SFW Disguise Mode**:
  * **3 Privacy Modes**: \`🌶️ NSFW (Full Adult)\`, \`🎭 PSFW (Pseudo-SFW / Disguise Covers)\`, and \`🛡️ SFW (Strict Safe For Work)\`.
  * In PSFW mode, adult artwork is automatically swapped for glowing stylized SFW artwork so you can listen safely in public.

---

## 🎵 Adaptive Dual-Engine Audio Player

aStreamer dynamically detects and routes stream playback based on the work's internal asset structure:

| Stream Type | Description | Engine / Strategy |
| :--- | :--- | :--- |
| **HLS Multi-Track (Master M3U8)** | Master stream playlist containing segmented audio streams | Proxied through \`/hls-proxy\` with live TS segment rewrite for zero-buffering playback. |
| **Multi-Track Audio (Direct)** | Raw multi-file directory with individual track audio files | Direct proxy streaming through \`/stream-proxy\` with seamless track queueing and chapter jumps. |
| **Single Full Session Audio** | Long single continuous audio track | Integrated chapter timestamp jump parser with interactive chapter markers. |

---

## 🚀 Deployment Guide

### Option A: Cloudflare Workers (Recommended - Free & Serverless)

#### 1. Clone & Install Dependencies
\`\`\`powershell
git clone https://github.com/CooKingThe1st/astreamer.git
cd astreamer/streasmr
npm install
\`\`\`

#### 2. Create Cloudflare KV Namespace
\`\`\`powershell
npx wrangler login
npx wrangler kv namespace create ASTREAMER_KV
\`\`\`
Copy the returned \`id\` into [wrangler.toml](file:///e:/VSCode_Latex/big_bangOCG_clone/streasmr/wrangler.toml):
\`\`\`toml
[[kv_namespaces]]
binding = "ASTREAMER_KV"
id = "your-kv-namespace-id"
\`\`\`

#### 3. Deploy
\`\`\`powershell
npx wrangler deploy
\`\`\`

---

### Option B: Run Locally (Node.js)

\`\`\`powershell
node server.js
\`\`\`
Open \`http://localhost:3000\` in your web browser.

---

## 📜 License

Distributed under the **MIT License**.
`;

fs.writeFileSync(path.join(__dirname, 'README.md'), readmeContent, 'utf8');
console.log('README.md written successfully!');
