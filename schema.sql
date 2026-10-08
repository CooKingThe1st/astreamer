-- aStreamer Cloudflare D1 Database Schema

CREATE TABLE IF NOT EXISTS works (
  rj_code TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  circle TEXT,
  cv TEXT,
  tags TEXT,              -- JSON array of strings e.g. ["ASMR", "Voice Work"]
  cover_url TEXT,
  nsfw INTEGER DEFAULT 1,
  favorite INTEGER DEFAULT 0,
  rating REAL DEFAULT 0,
  release_date TEXT,
  added_at TEXT,
  tracks TEXT,            -- JSON array of track objects
  sample_tracks TEXT,     -- JSON array of sample preview track objects
  has_hls INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_works_added_at ON works(added_at DESC);
CREATE INDEX IF NOT EXISTS idx_works_favorite ON works(favorite);
CREATE INDEX IF NOT EXISTS idx_works_circle ON works(circle);
