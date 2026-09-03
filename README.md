# ✨ aStreamer

A personal, high-performance audio streaming web application with HLS & MP3 support, local database caching, batch ingestion, and content privacy modes.

![UI Dark Aesthetic](https://img.shields.io/badge/Style-Dark%20Aesthetic-ff3366)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![HLS.js](https://img.shields.io/badge/HLS.js-1.5.7-blue)

---

## 🌟 Features

- 🎵 **Universal Streaming Engine:** Native support for both segmented **HLS (`.m3u8` / `.ts`)** chapter-based streams and **Direct MP3** multi-track works.
- ⚡ **Stream Tunnel & Referer Proxy:** Bypasses hotlink protection and decodes MPEG-TS chunks synchronously with zero stalls.
- 📚 **Personal Library & Offline Cache:** Automatically saves work metadata, custom playlists, and favorite tags to local JSON disk storage (`data/astreamer_db.json`).
- 📥 **Batch Importer:** Ingest dozens of works at once by pasting a list of RJ codes or uploading a `.txt` file.
- 🔑 **Passcode Gatekeeper:** Protected by an `ADMIN_PASSCODE` environment variable so only you can access your personal library.
- 🛡️ **Privacy & Content Modes:**
  - **🌶️ NSFW (Default):** Full original catalog with high-resolution artwork and tags.
  - **🎭 PSFW (Disguise Mode):** Plays full audio while disguising adult cover arts with glowing, stylized SFW artwork.
  - **🛡️ SFW (Strict Safe Mode):** Filters out adult works and NSFW tags from the library and tag cloud.
- 📜 **Playlist Management:** Create custom playlists, add individual chapters or full works, and reorder/delete tracks.
- 🎙️ **Voice Actor & Genre Browsing:** Group and filter works by CV (artist) or genre tags with one click.
- 💾 **One-Click Backup:** Export and import full database backups as JSON.

---

## 🚀 Quick Start

### 1. Installation
```bash
git clone git@github.com:CooKingThe1st/astreamer.git
cd astreamer
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` and set your personal admin passcode:
```env
PORT=3001
ADMIN_PASSCODE=your_custom_passcode
```

### 3. Run Locally
```bash
npm start
```
Open **`http://localhost:3001`** in your browser and enter your passcode.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      aStreamer Web UI                       │
├──────────────────┬──────────────────────────────────────────┤
│    SIDEBAR       │               MAIN CONTENT               │
│  • Library       │  • Grid of Works with Artwork & Badges   │
│  • Playlists     │  • Work Detail & Chapter Quick-Seek      │
│  • Artists (CV)  │  • Filter by Genre / Tag / Voice Actor   │
│  • Genres / Tags │  • Batch Importer (File Upload & Paste)  │
│  • Batch Import  │  • Playlist Creation & Management        │
│  • Settings      │  • Passcode Gatekeeper Modal             │
├──────────────────┴──────────────────────────────────────────┤
│            PERSISTENT GLOBAL AUDIO PLAYER BAR               │
│  • Artwork & Title | Play/Pause/Skip | Scrubber | Volume    │
└─────────────────────────────────────────────────────────────┘
                               ▲
                               │ HTTP
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Express Backend Server                    │
├─────────────────────────────────────────────────────────────┤
│  • Auth Middleware (ADMIN_PASSCODE)                         │
│  • Persistent Local Database (data/astreamer_db.json)       │
│  • Metadata & Stream Resolver (DLsite API + CDN probe)      │
│  • HLS Manifest Rewriter & Stream Proxy                     │
│  • Batch Import Queue & Progress API                        │
│  • Playlists & Library CRUD API                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📄 License
MIT
