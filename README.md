# 🐧 aStreamer (v1.0)
> **Zero-Cost, Serverless, Edge-Accelerated Audio Streaming & ASMR Library Suite**

[![Deploy to Cloudflare Workers](https://img.shields.io/badge/Deploy-Cloudflare%20Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Version](https://img.shields.io/badge/Version-1.0%20Official-38bdf8?style=for-the-badge)](https://github.com/CooKingThe1st/astreamer)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🌟 Overview

**aStreamer** is a lightweight, edge-native audio streaming web application and library manager. It operates with **zero origin servers**, runs entirely on **Cloudflare Workers + KV Storage**, and streams multi-chapter audio sessions, ASMR works, and voice dramas with blazing fast global CDN caching.

---

## ⚡ Core Architecture

```
                    ┌──────────────────────────────┐
                    │       User Browser           │
                    │  (Embedded Dark SPA UI)      │
                    └──────────────┬───────────────┘
                                   │ HTTPS
                                   ▼
                    ┌──────────────────────────────┐
                    │   Cloudflare Worker Edge     │
                    │         (worker.js)          │
                    └──┬───────────┬────────────┬──┘
                       │           │            │
       ┌───────────────┘           │            └───────────────┐
       ▼                           ▼                            ▼
┌──────────────┐          ┌───────────────────┐        ┌──────────────────┐
│ Cloudflare   │          │  Streaming Proxy  │        │ Unified Metadata │
│ KV Database  │          │   (Audio & Img)   │        │     Pipeline     │
│ (Persistence)│          │ (M3U8 / MP3 / JPG)│        │ (DLsite+ASMR.one)│
└──────────────┘          └───────────────────┘        └──────────────────┘
```

* **100% Serverless Edge**: Runs globally across 300+ Cloudflare data centers with zero server maintenance costs.
* **Persistent KV Storage**: Saves imported RJ works, playlists, favorite states, and settings in **Cloudflare KV**.
* **Edge Streaming Proxy**: Seamlessly proxies HLS (`.m3u8`) manifests, audio segments (`.ts`/`.aac`), and multi-track `.mp3` files with proper range requests (`206 Partial Content`) and referer spoofing.
* **Image Proxy & Caching**: Bypasses external image hotlink protections and optimizes cover art delivery.

---

## 🎵 Adaptive Dual-Engine Audio Player

aStreamer dynamically probes CDN endpoints for each work and automatically adapts:

1. **HLS Multi-Chapter Master (`.m3u8`)**:
   * Auto-parses `#EXT-X-DISCONTINUITY` and `#EXTINF` markers into discrete, titled chapters with accurate timestamps.
   * Chapter seeking, live track jumping, and background playback via `Hls.js`.
2. **Multi-Track MP3 Collection (`.mp3`)**:
   * Probes track sequences (`Track 1`, `Track 2`, `Track 3...`) for classic multi-part releases.
3. **Playback Features**:
   * 10-second fast-forward / rewind.
   * Seekable waveform scrubber.
   * Smooth volume slider & mute toggle.
   * Lockscreen / MediaSession background audio metadata.

---

## 🔍 Multi-Source Deep Metadata Pipeline

The scraper uses a resilient 3-layer extraction architecture that resolves titles, circle names, and complete voice actor tags even for discounted, promotional, or legacy works:

```
[RJ Code Input]
       │
       ├─► Layer 1: ASMR.one / Kikoeru Public API (Bilingual tags, VA roster)
       │
       ├─► Layer 2: Official DLsite JSON API (Across maniax, home, girls, pro)
       │
       └─► Layer 3: Deep DLsite Product Page HTML Parser
                    ├─ Outline Table (<th>声優</th>, <th>ジャンル</th>, <th>シリーズ名</th>)
                    ├─ Schema.org JSON-LD Breadcrumb List (Circle extraction)
                    └─ Bracketed CV RegEx (【CV: ...】, (CV: ...))
```

* **Interactive Voice Actor Badges**: All voice actors (`CV`) are automatically converted into clickable badge pills in the work detail view and indexed into filterable genre clouds.

---

## 🛡️ Stealth Privacy & Disguise System

Designed with privacy and security in mind:

* **SFW Mode**: Strictly filters out all adult works and NSFW tags from the library grid and tag cloud.
* **PSFW (Pseudo-SFW) Disguise Mode**: Audio remains fully playable, but adult cover arts are disguised with stylized, glowing SFW artwork.
* **Emergency Panic Key (`Esc`)**: Pressing the `Escape` key immediately toggles SFW disguise mode on the fly.
* **Gatekeeper Passcode Security**: Protects access to the library with custom passcode authentication.

---

## 🧭 Deep-Linking URL Hash Routing

Every view, work, and filter state generates a unique, shareable, and reloadable URL:

| Route | View Description |
| :--- | :--- |
| `/#/library` | Main library catalog |
| `/#/work/:rjCode` | Deep-link directly to a specific work's player & tracklist |
| `/#/genre/:tagName` | Filter library by a specific genre or tag |
| `/#/cv/:actorName` | Filter library by a specific Voice Actor |
| `/#/favorites` | View favorited collection |
| `/#/playlists` | Playlists overview |
| `/#/playlist/:plId` | View & play a custom playlist |
| `/#/settings` | App settings & data management |

* **Optimistic In-Place Actions**: Favoriting works (`🤍` $\leftrightarrow$ `❤️`) updates instantly in-place without reloading the grid or resetting scroll positions.
* **Full Browser History Support**: Seamless `Back` (`←`) and `Forward` (`→`) navigation.

---

## 🚀 Deployment Guide

### Option A: Cloudflare Workers (Recommended - Free & Serverless)

#### 1. Clone & Install Dependencies
```bash
git clone https://github.com/CooKingThe1st/astreamer.git
cd astreamer
npm install
```

#### 2. Create Cloudflare KV Namespace
```bash
npx wrangler kv namespace create ASTREAMER_KV
```
Copy the output `id` and update `wrangler.toml`:
```toml
name = "astreamer"
main = "worker.js"
compatibility_date = "2024-04-01"

[[kv_namespaces]]
binding = "ASTREAMER_KV"
id = "<YOUR_KV_NAMESPACE_ID>"
```

#### 3. Set Your Admin Passcode
Set your private admin passcode securely via Cloudflare Secrets:
```bash
npx wrangler secret put ADMIN_PASSCODE
```
*(Enter your desired passcode when prompted)*

#### 4. Deploy to Cloudflare
```bash
npx wrangler deploy
```

---

### Option B: Automated GitHub Actions CI/CD

Deploy automatically on every `git push`:

1. In Cloudflare Dashboard: **My Profile $\rightarrow$ API Tokens $\rightarrow$ Create Token** using the **Edit Cloudflare Workers** template.
2. In your GitHub Repository: **Settings $\rightarrow$ Secrets and variables $\rightarrow$ Actions $\rightarrow$ New repository secret**:
   * **Name:** `CLOUDFLARE_API_TOKEN`
   * **Value:** *[Paste your Cloudflare API Token]*
3. Every commit pushed to `main` will automatically build and deploy your live site!

---

### Option C: Run Locally (Node.js)

```bash
# Start local development server
npm start
```
Open **`http://localhost:3001`** in your browser.

---

## 📁 Repository Structure

```
astreamer/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions automated deployment workflow
├── data/
│   └── astreamer_db.json       # Local database store (gitignored)
├── scraper.js                  # Standalone Node.js scraper & metadata resolver
├── server.js                   # Node.js local Express server
├── worker.js                   # Pure Cloudflare Worker (Backend + Embedded SPA UI)
├── wrangler.toml               # Cloudflare Worker configuration & KV bindings
├── package.json                # Project dependencies & scripts
├── .gitignore                  # Gitignore rules for secrets and local data
└── README.md                   # Project documentation
```

---

## 🔒 Security Best Practices

* Never commit `.env`, `.dev.vars`, or real passcodes to public repositories.
* Use `npx wrangler secret put ADMIN_PASSCODE` for production Cloudflare deployments.
* Export and backup your library regularly via **`⚙️ Settings $\rightarrow$ 📥 Export JSON Backup`**.

---

## 📜 License
MIT License. Developed for personal audio organization and streaming.
