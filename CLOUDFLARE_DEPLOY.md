# ☁️ Deploying aStreamer on Cloudflare Workers (100% Free)

This guide walks you through deploying **aStreamer** directly to Cloudflare's global edge network with **0 server costs** and **100% uptime**.

---

## ⚡ Prerequisites

1. A [Cloudflare Account](https://dash.cloudflare.com/) (free).
2. [Node.js](https://nodejs.org/) installed on your machine.
3. Your domain added to Cloudflare (e.g. `yourdomain.com`).

---

## 🚀 2-Minute Deployment Steps

### 1. Log in to Cloudflare CLI
In your `streasmr` folder, run:
```powershell
npx wrangler login
```
*A browser window will open asking you to authorize Cloudflare Wrangler.*

---

### 2. Create the Cloudflare KV Database (1-Time Setup)
Run this command to create your personal persistent KV database on Cloudflare:
```powershell
npx wrangler kv namespace create ASTREAMER_KV
```

You will get an output that looks like this:
```toml
[[kv_namespaces]]
binding = "ASTREAMER_KV"
id = "a1b2c3d4e5f6..."
```

Open [wrangler.toml](file:///e:/VSCode_Latex/big_bangOCG_clone/streasmr/wrangler.toml) in your code editor and paste that block into it.

---

### 3. Deploy to Cloudflare Edge!
```powershell
npx wrangler deploy
```

That's it! Wrangler will give you a live production URL:
```
✨ Uploaded astreamer (1.2 sec)
Deployed astreamer to https://astreamer.<your-subdomain>.workers.dev
```

---

## 🌐 Bind Your Custom Domain (e.g. `astreamer.yourdomain.com`)

1. Open your **Cloudflare Dashboard**.
2. Go to **Workers & Pages** $\rightarrow$ Click on your **`astreamer`** Worker.
3. Go to the **Settings** tab $\rightarrow$ **Domains & Routes** $\rightarrow$ Click **Add Custom Domain**.
4. Type `astreamer.yourdomain.com` and click **Add Custom Domain**.
5. Cloudflare will automatically provision SSL and route all traffic to your Worker!

---

## 🔑 Changing Admin Passcode
To change your admin passcode on Cloudflare, either:
* Edit `[vars]` in `wrangler.toml` and re-deploy (`npx wrangler deploy`), or
* Run: `npx wrangler secret put ADMIN_PASSCODE` in your terminal.
