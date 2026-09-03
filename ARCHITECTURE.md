# StreASMR - System Architecture & Technical Specification

## 1. Overview
StreASMR is a lightweight, responsive ASMR streaming web application designed to catalog and stream multi-track audio works directly from third-party media hosts without storing heavy audio files on local disk.

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
```
