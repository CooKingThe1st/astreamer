# StreASMR - System Architecture & Technical Specification

## 1. Overview
StreASMR / aStreamer is a lightweight, high-performance ASMR streaming web application (Cloudflare Workers + Express) designed to catalog and stream multi-track and HLS audio works directly from media hosts without storing heavy audio files on local disk.

---

## 🚫 CORE ARCHITECTURAL INVARIANT: NO JAPANESEASMR HTML SCRAPING

> **STRICT POLICY**: Never attempt to scrape, probe, or fetch HTML pages from `japaneseasmr.com` directly.
> 
> 1. **Why HTML scraping is banned**:
>    - `japaneseasmr.com` is protected by Cloudflare WAF and bot-mitigation, leading to frequent 403 Forbidden / Captcha failures.
>    - WordPress HTML structures, permalinks, and CSS class names frequently shift, leading to silent regex failures and fragile code.
>    - HTML scraping requires multiple slow HTTP requests (search -> post -> parse).
> 
> 2. **Official Data Pipeline (Pure Structured JSON APIs Only)**:
>    - **Work Metadata & Actors**: ASMR.one API (`https://api.asmr-200.com/api/work/{cleanNum}`) + DLsite JSON API (`https://www.dlsite.com/{div}/api/=/product.json?workno={cleanRj}`).
>    - **Tracks & Chapter Cue Points**: ASMR.one Track Tree API (`https://api.asmr-200.com/api/tracks/{cleanNum}`).
>      - The audio tree is flattened recursively.
>      - Start times are calculated cumulatively: `startTime[i] = startTime[i-1] + duration[i-1]`.
>      - Produces 100% mathematically accurate chapter timestamps (`00:00:00`, `00:04:50`, `00:17:42`, etc.) in a single fast JSON GET request.
>    - **Audio Streaming**: Direct CDN probe on `https://v.weeab0o.xyz/{cleanRj}.m3u8` or `.mp3`.

---

## 2. Key Technical Discoveries & Supported Formats

The source sites use **two distinct audio distribution architectures** depending on the age/format of the release:

### Format A: Direct Multi-Track Files (`.mp3` / `.m4a`)
* **Example:** `RJ441308` (`愛聖天使ラブメアリー`)
* **Structure:** Multiple `<video>` or `<audio>` tags containing discrete file URLs (`RJ441308.mp3`, `RJ441308 2.mp3`, `RJ441308 3.mp3`).
* **Streaming Strategy:**
  - Forward client HTTP `Range` requests to origin server.
  - Return `206 Partial Content` with `Content-Range` and `Accept-Ranges: bytes`.
  - Browser HTML5 `<audio>` tag plays and seeks natively.

### Format B: Single-Stream HLS with Chapters (`.m3u8` + `.ts` segments)
* **Example:** `RJ01473335` (`事務的メイドの好意だだ漏れよわよわマゾオス克服訓練`)
* **Structure:**
  - Single master audio stream: `https://v.weeab0o.xyz/RJ01473335.m3u8`.
  - Chapter playlist in HTML: `<table id="plyr-chapter-playlist">` with track names and chapter timestamps (`data-value="1204"` for 00:20:04, `data-value="2209"` for 00:36:49, etc.).
* **Streaming Strategy:**
  1. **Manifest Rewriting Proxy:** The proxy fetches the raw `.m3u8` text and dynamically rewrites all relative `.ts` segment chunk URLs into proxied endpoints (`/stream?url=https://v.weeab0o.xyz/RJ01473335/segment_0001.ts`).
  2. **Segment Chunk Tunnel:** As the player requests each `.ts` audio chunk, the proxy spoofs `Referer: https://japaneseasmr.com/` and streams the binary segments seamlessly.
  3. **Frontend Player Integration:** Uses `hls.js` attached to the HTML5 audio element.
  4. **Instant Chapter Seeking:** Clicking any chapter in the tracklist performs an instant chapter seek (`audio.currentTime = startTime`) without re-downloading or restarting the stream.

---

## 3. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Frontend                        │
│  - Persistent Global Player with HLS.js + HTML5 Audio       │
│  - Dynamic Tracklist & Timestamped Chapter Navigation       │
│  - Real-time active chapter tracker & waveform scrubbing    │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            │ Audio / M3U8 Stream                 │ Metadata & Scrape
            │ (/stream?url=...)                   │ (/api/scrape?query=...)
            ▼                                     ▼
┌─────────────────────────────────────────────────────────────┐
│                     Node.js / Express API                   │
│                                                             │
│  1. /stream                                                 │
│     - M3U8 Manifest Rewriter (.ts URLs -> Proxied URLs)     │
│     - Binary Stream Tunnel (Injects Referer & UA)           │
│     - HTTP Range & 206 Partial Content handler              │
│                                                             │
│  2. /image-proxy                                            │
│     - Bypasses hotlink protection for cover images          │
│                                                             │
│  3. /api/scrape                                             │
│     - Fast Cheerio parsing for RJ code / URL search         │
│     - Extracts Multi-track MP3s & HLS Chapter tables        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     Third-Party Origin                      │
│     - Audio / Segments: https://v.weeab0o.xyz/...           │
│     - Covers: https://pic.weeabo0.xyz/...                   │
└─────────────────────────────────────────────────────────────┘
```---

## 4. Frontend & Player UI Architecture (v1.1 QoL)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        aStreamer Frontend Core                             │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  [Desktop Navigation]                [Mobile Navigation (<= 768px)]        │
│  - 240px Fixed Left Sidebar          - Sticky Topbar + Horizontal Pills    │
│                                                                            │
│  [Explorer View Engine]                                                    │
│  - 4 Modes: Large Hero (🖼️) | Med Grid (🎴) | Small (📱) | Table List (📋) │
│  - Pagination: 10 | 20 | 50 | 100 | All with localStorage persistence      │
│                                                                            │
│  [Unified Dual Player Architecture]                                        │
│  ├── Bottom Bar Player (Persistent Mini-Player)                            │
│  │   └── Track Info, Mini-Scrubber, Controls, Expand Button (🗖)          │
│  └── Rectangle Floating Popup Player (Now Playing Modal)                  │
│      ├── High-Res Glowing Album Art & Stream Type Badges                  │
│      ├── Clickable CV Pill Badges -> Instant Actor Filter                 │
│      ├── Waveform Scrubber with Tabular Timestamp Counters                │
│      ├── Full Controls (Play/Pause, Prev/Next, +-10s, Volume, Favorite)  │
│      └── Collapsible Tracklist/Chapter Drawer with Instant Chapter Seeks   │
│                                                                            │
│  [State Engine & MediaSession]                                             │
│  - Unified HTML5 <audio id="coreAudio"> (Zero interruption when toggling)  │
│  - Background Audio Metadata API (MediaSession Lockscreen/Notif controls)  │
│  - Deep-link URL hash routing (/#/library, /#/work/:rj, /#/playlist/:id)   │
└────────────────────────────────────────────────────────────────────────────┘
```
