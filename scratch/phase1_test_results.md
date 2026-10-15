# Phase 1 Test Results: WaitList Source Connectivity & Data Extraction

**Date**: 2026-10-14  
**Target Feature**: Automated Twice-Daily Ingestion to 'WaitList' Queue (Human Review Pending)

---

## 🎯 Objective
Determine whether the frontend/first page of our audio sources can be retrieved programmatically to harvest the latest releases without being blocked by Cloudflare WAF, and extract the work metadata (RJ codes, titles, circle, CV).

---

## 🔬 Test Findings

### 1. Source 1: HentaiASMR Moe (`hentaiasmr.moe`) — **100% SUCCESS ✅**

We tested querying the WordPress REST API:
`GET https://hentaiasmr.moe/wp-json/wp/v2/posts?page=1&per_page=15`

* **HTTP Status**: `200 OK`
* **Response Format**: Clean structured JSON array
* **Cloudflare Interception**: None! No Turnstile challenge, no 403 Forbidden.
* **Payload Details**:
  * Each post provides:
    * `slug`: e.g., `"rj01595728"`, `"rj01487378"`, `"video-houkago-cinderella-..."`
    * `title.rendered`: Japanese / English title (e.g., `〈母〉私と息子の過ち`)
    * `content.rendered`: Full post body containing:
      * RJ code (`RJ01595728`)
      * Circle (e.g. `Raspberry Tart`, `Braintrigger`)
      * Voice Actor / CV (e.g. `餅梨あむ / Amu Mochiri`, `秋野かえで / Kaede Akino`)
      * Release Date
    * `featured_media`: ID linkable to cover art
    * `categories` & `tags`: WordPress taxonomy IDs
* **Extraction Feasibility**: Extremely fast and reliable. A simple regex or JSON parser can cleanly extract the RJ code and work details without fragile DOM scraping.

---

### 2. Source 2: JapaneseASMR (`japaneseasmr.com`) — **SURPRISING VIABILITY ⚠️/✅**

* **Feed Endpoint (`/feed/`)**: Returns `500` / WAF error.
* **Frontpage HTML (`https://japaneseasmr.com/`)**:
  * Successfully accessible via standard HTTP GET!
  * **Payload Details**:
    * Frontpage contains cleanly structured posts formatted in markdown/HTML blocks:
      ```text
      [261004][うこんちゃん☆かんぱにぃ] 低音クールな猫耳執事の淡々事務的性処理のハズが… [RJ01732047]
      CV: China Mugisawa
      
      [261003][バタリンコちゃん] 【ママみ全肯定】甘えさせてくれるママ系彼女のとろとろ添い寝 [RJ01728924]
      CV: 田中
      
      [261003][M屋] 【ガチ恋確定】塩対応な推しアイドルがキミにだけデレてくれる秘密のオフパコ [RJ01728876]
      CV: 未想可みいろ
      ```
    * Regex directly matches `parsePageImportText` specifications (`[YYMMDD][Circle] Title [RJxxxxxx]\nCV: Name`).
  * **Caveat**: JapaneseASMR's Cloudflare security fluctuates depending on datacenter IP reputation. In production Workers, HentaiASMR Moe API is practically bulletproof, while JapaneseASMR frontpage can serve as a secondary source (with graceful error handling if Cloudflare triggers).

---

## 📋 Recommended Data Schema for WaitList Item

When fetched from the sources, items will be stored as:

```json
{
  "rjCode": "RJ01595728",
  "title": "〈母〉私と息子の過ち",
  "circle": "Raspberry Tart",
  "cv": "餅梨あむ / Amu Mochiri",
  "source": "hentaiasmr.moe",
  "discoveredAt": 1728950400000,
  "status": "pending", // "pending" | "imported" | "dismissed"
  "coverUrl": "/image-proxy?rj=RJ01595728"
}
```

---

## 🚀 Readiness for Phase 2 (Implementation)

Phase 1 testing confirms that:
1. **`hentaiasmr.moe` WordPress REST API is completely open, zero-WAF, and returns rich metadata**.
2. **`japaneseasmr.com` frontpage HTML is also extractable using our existing `parsePageImportText` regex**, and can be queried with a fallback try/catch.
3. We are ready to proceed to **Phase 2**:
   - Setting up the cron trigger (`0 0,12 * * *`).
   - Adding the WaitList store (KV/D1/JSON) and REST endpoints (`/api/waitlist`).
   - Building the interactive "Pick & Discard" UI modal / tab.
