# 🎧 aStreamer — Universal ASMR & Doujin Audio Streaming Platform

[![Version](https://img.shields.io/badge/Version-2.1.0%20Official-38bdf8?style=for-the-badge)](https://github.com/CooKingThe1st/astreamer)
[![Deploy to Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare%20Workers-f38020?style=for-the-badge&logo=cloudflare)](https://workers.cloudflare.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🌟 Overview

**aStreamer** is a self-hosted, ultra-responsive, zero-dependency web application & streaming audio player for ASMR, Voice Drama, and Doujin audio works. Built from the ground up for seamless operation both as a **100% serverless Cloudflare Worker** (backed by Cloudflare KV) and as a **lightweight standalone Node.js server**.

---

## 🚀 Version 2.1.0 Official Milestone Release Highlights

* **🌐 Client-Assisted Moe Audio Stream Discovery & Zero-403 WAF Fallback**:
  * Seamlessly bypasses Cloudflare Bot Management / Datacenter IP blocking by querying public WordPress REST endpoints directly from the client browser.
  * Ingests confirmed Moe Post IDs and synthesizes merge streams (`/mf/{postId}/merge/{rjCode}.mp3`) with exact ground-truth duration.
* **🔬 Verbose Diagnostic Tracing & Log Filter Engine**:
  * Real-time `🔬 Verbose Tracing` toggle and dedicated `TRACE` filter in Dev Activity Log modal.
  * Live monitoring of network candidate probes, slug normalizations, and exact backend error responses.
* **⚡ High-Resilience Ingestion & Dynamic Multi-Slug Search**:
  * Automatic multi-slug candidate generation (`rj01653286`, `rj1653286`, `1653286`) with search fallback.
  * Enhanced single-work refetch and batch metadata synchronization with zero KV write wastage.

---

## 🚀 Version 1.5 Highlights

* **🏷️ Zen Tag & CV Command Search Modal**:
  * **Instant Bilingual Autocomplete**: Real-time suggestion dropdown with Japanese, Romaji, and English translations.
  * **Multi-Tag Combinations (`+`)**: Filter library seamlessly by compound keywords (e.g. `耳かき + 囁き + ASMR`).
  * **Keyboard Navigation & Esc Dismiss**: Full `↑`/`↓`/`↵` arrow-key browsing and instant, clean `Esc` key dismissal without view disruptions.
* **🎧 Intelligent Multi-Track & Chapter Tree Engine**:
  * **Hierarchy-Aware File Parser**: Automatically detects and isolates main master session tracks from bonus files, MP3 duplicates, and alt versions.
  * **Accurate Timestamps**: Chapter markers strictly mapped to physical track boundaries, preventing timestamp overflow and phantom tracks.
* **🖼️ Adaptive Artwork & Illustration Gallery**:
  * **Horizontal Swipe Reader Carousel**: Mobile-optimized full-height card strip (`.view-strip`) with snap-to-card scrolling and centered uncropped view for 100+ manga/doujin scans.
  * **One-Tap Mode Switcher**: Easily toggle between `⊞ Grid View` and `↔ Carousel View`.
  * **Immersive Lightbox Popup**: Full-screen high-resolution preview with keyboard/touch navigation.
* **📱 Comprehensive Mobile Card Overhaul**:
  * Transformed all desktop tables (Playlist Tracks, Library List View, Playback History, Chapters) into compact **2-row responsive mobile cards** (~58px height), preventing long Japanese titles from creating multi-line wrapping sprawl.
  * **Docked 3-Row Bottom Player**: Thumb-friendly mobile player bar with dedicated playback controls, scrubber, and a single chapter drawer button.
* **🔔 Floating YouTube-Style Toast Notifications**:
  * Minimal, unobtrusive auto-dismissing bottom floating toasts for playlist actions and metadata refreshes.
* **🛡️ Stealth SFW Disguise Mode**:
  * 3 privacy tiers (`🌶️ NSFW`, `🎭 PSFW`, `🛡️ SFW`) with instant discreet cover swapping for safe listening in public.

---

## ✨ Core Features & Highlights

* **🗖 Rectangle Floating Popup Player (Now Playing Card)**:
  * Click the glowing mini-album art or maximize button to pop open a sleek, cyberpunk-styled floating player.
  * Features high-resolution cover glow, integrated tracklist & chapter drawer, volume scrubbers, and playback controls.
  * **Escape Key Handling**: Press `Esc` to instantly minimize the popup player back to the bottom bar.
* **📱 Responsive Mobile Top Navbar**:
  * On mobile/tablets, the fixed sidebar smoothly collapses into a sleek top header with horizontal scrolling category tabs (`📚 Library`, `📜 Playlists`, `🕒 History`, `📋 Wishlist`, `🎙️ Voice Actors`, `🏷️ Genres`, `⚙️ Settings`).
* **🗂️ Explorer View Modes & Pagination**:
  * Switch on-the-fly between **Large Cards**, **Medium Grid**, **Compact Grid**, and **Detailed List** views.
  * Supports configurable items per page (`10`, `20`, `50`, `100`, or `All`) with responsive pagination controls.
* **📜 Playlist Management**:
  * Add individual tracks or entire works to custom playlists with one tap.
  * Play tracks directly from playlists without interrupting active sessions or reloading pages.
  * Built-in `❤️ Favorites` playlist automatically seeded and pinned to the top.
* **🏷️ Self-Learning Bilingual Tag Dictionary**:
  * JapaneseASMR-style dynamic tag formatting (e.g. `耳かき (Ear Cleaning)`).
  * Automatically fetches and accumulates English translations from the ASMR.one API into Cloudflare KV with zero-write diff protection.
* **🌐 Robust Multi-Source Metadata & Stream Pipeline**:
  * **Layered Extraction**: Cascades across **ASMR.one Public API** ➔ **DLsite Official Product APIs** ➔ **DLsite HTML Store Pages** ➔ **HentaiASMR (`hentaiasmr.moe`) Fallback Engine**.
  * **Adaptive Audio Resolving**: Supports both multi-track playlist arrays and single merged continuous session audio streams (e.g. `RJ01668482`).
  * **Automatic Bilingual Voice Actors**: Automatically extracts Japanese CV names with native English/Romaji romanizations (e.g. `雲八はち / Hachi Kumoya`), eliminating translation lookups.
  * **Series & Release Tracking**: Automatically indexes work series franchises (e.g. `しつけあい！`) and release dates into the tag explorer.
* **🖼️ Multi-Source Artwork & Gallery Prober**:
  * **Primary High-Resolution Artwork**: Directly resolved from DLsite's official CDNs (`img.dlsite.jp`) and ASMR.one track tree JSON, providing original, lossless package art and promotional illustrations.
  * **Byte-Size Deduplication (0.01% Tolerance)**: Eliminates mirror duplicates between DLsite, ASMR.one, and fallback sources.
* **📥 Background Batch Ingestion & Dock Mode**:
  * **Non-Blocking Ingestion**: Batch imports can be minimized to a floating background dock (`🗕 Background`), letting you browse the library, play audio, or manage playlists without interruption.
  * **Tab Protection**: Integrated `beforeunload` warning prevents accidental page refresh or tab closure while an import is in flight.

---

## 🎨 Note on Artwork Sources & Community Hashed CDNs

> [!NOTE]
> **Architectural Decision on Gallery Artwork Sources**:
> - **Official DLsite CDN & ASMR.one Track Trees**: aStreamer prioritizes DLsite's official master image repository (`img.dlsite.jp/modpub/images2/work/...`) and ASMR.one's track tree API. These sources provide authentic, uncompressed artwork with deterministic URL paths and reliable proxying.
> - **Omission of Community Hashed Image Mirrors (`img.weeabo0.xyz/images/<md5>.jpg`)**: Third-party community hosts (e.g. Weeab0o / JapaneseASMR) recently transitioned to randomized/content-hashed image paths behind aggressive anti-bot WAFs. Because scraping those non-deterministic hashes requires fragile HTML DOM parsing prone to Cloudflare rate-limits, and because DLsite already serves the original higher-resolution source artwork directly, third-party hashed image scraping is intentionally omitted in favor of fast, reliable official probers.

---

## 🎵 Adaptive Dual-Engine Audio Player

aStreamer dynamically detects and routes stream playback based on the work's internal asset structure:

| Stream Type | Description | Engine / Strategy |
| :--- | :--- | :--- |
| **HLS Multi-Track (Master M3U8)** | Master stream playlist containing segmented audio streams | Proxied through `/hls-proxy` with live TS segment rewrite for zero-buffering playback. |
| **Multi-Track Audio (Direct)** | Raw multi-file directory with individual track audio files | Direct proxy streaming through `/stream-proxy` with seamless track queueing and chapter jumps. |
| **Single Full Session Audio** | Long single continuous audio track | Integrated chapter timestamp jump parser with interactive chapter markers. |

> [!NOTE]
> **Secondary Stream & Download Provider Availability (Planned/Backup)**:
> The metadata ingestion layer on `hentaiasmr.moe` parses direct JWPlayer MP3 playlists (`https://cdn.hentaiasmr.moe/mf/{id}/{track}.mp3`) and direct Mega zip mirrors. These endpoints are verified and ready for future dual-CDN failover routing if primary HLS streams are ever unavailable.

---

## 🚀 Deployment Guide

### Option A: Cloudflare Workers (Recommended - Free & Serverless)

#### 1. Clone & Install Dependencies
```powershell
git clone https://github.com/CooKingThe1st/astreamer.git
cd astreamer/streasmr
npm install
```

#### 2. Create Cloudflare KV Namespace
```powershell
npx wrangler login
npx wrangler kv namespace create ASTREAMER_KV
```
Copy the returned `id` into [wrangler.toml](file:///e:/VSCode_Latex/big_bangOCG_clone/streasmr/wrangler.toml):
```toml
[[kv_namespaces]]
binding = "ASTREAMER_KV"
id = "your-kv-namespace-id"
```

#### 3. Deploy
```powershell
npx wrangler deploy
```

---

### Option B: Run Locally (Node.js)

```powershell
node server.js
```
Open `http://localhost:3000` in your web browser.

---

## 📌 Acknowledged Limitations

* **📱 Mobile Lockscreen & Background Auto-Play Interruption**:
  * On mobile operating systems (iOS Safari, Android Chrome/Samsung Internet), aggressive background power-saving and browser autoplay policies may occasionally prevent automated transitions between tracks when the screen is locked or the browser is in the background. If playback stops at the end of a track, waking the screen or tapping ⏭️ (`Next Track`) via the Lock Screen Media Controls (MediaSession API) resumes the playback sequence immediately.
* **🏷️ Upstream API Rating & Artwork Ambiguity**:
  * **SFW / NSFW Classification**: aStreamer relies strictly on the official publisher age category returned by DLsite / ASMR.one (`age_category === 1` or `age_category_string === 'general'`). Some works featuring suggestive or revealing cover illustrations (such as official game voice dramas like `RJ01551365`) may officially carry an all-ages / general rating, while works with relatively modest cover art containing sensual audio (like R-15 works e.g. `RJ296129`) are classified under adult divisions. The rating classifier faithfully follows the upstream platform's official registry rather than AI visual inspection.

---

## 📜 License

Distributed under the **MIT License**.

