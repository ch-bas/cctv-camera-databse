#!/usr/bin/env node
/**
 * Aggregates all per-camera JSON files under /cameras into:
 *   - data/cameras.json  (array of all entries)
 *   - data/cameras.csv   (flattened, for spreadsheets)
 * Validates each entry against schema/camera.schema.json.
 *
 * Usage: node scripts/build.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CAMERAS_DIR = path.join(ROOT, "cameras");
const DATA_DIR = path.join(ROOT, "data");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return e.name.endsWith(".json") ? [p] : [];
  });
}

function loadCameras() {
  return walk(CAMERAS_DIR)
    .map((f) => {
      try {
        return JSON.parse(fs.readFileSync(f, "utf8"));
      } catch (err) {
        console.error(`Failed to parse ${f}: ${err.message}`);
        process.exit(1);
      }
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

function validate(cameras) {
  const seen = new Set();
  const required = ["id", "brand", "model", "type", "resolution"];
  let ok = true;
  for (const cam of cameras) {
    for (const key of required) {
      if (!(key in cam)) {
        console.error(`✗ ${cam.id || "?"}: missing required field "${key}"`);
        ok = false;
      }
    }
    if (cam.id && seen.has(cam.id)) {
      console.error(`✗ duplicate id "${cam.id}"`);
      ok = false;
    }
    seen.add(cam.id);
    if (cam.id && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(cam.id)) {
      console.error(`✗ ${cam.id}: id must be a lowercase slug`);
      ok = false;
    }
  }
  if (!ok) process.exit(1);
}

function toCsv(cameras) {
  const cols = [
    "id", "brand", "model", "type",
    "resolution_label", "megapixels", "sensor",
    "field_of_view_deg", "night_vision_type", "ip_rating",
    "two_way_audio", "release_year",
  ];
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = cameras.map((c) =>
    [
      c.id, c.brand, c.model, c.type,
      c.resolution?.label, c.resolution?.megapixels, c.sensor,
      c.field_of_view_deg, c.night_vision?.type, c.ip_rating,
      c.audio?.two_way, c.release_year,
    ].map(esc).join(",")
  );
  return [cols.join(","), ...rows].join("\n") + "\n";
}

function main() {
  const cameras = loadCameras();
  validate(cameras);
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(DATA_DIR, "cameras.json"),
    JSON.stringify(cameras, null, 2) + "\n"
  );
  fs.writeFileSync(path.join(DATA_DIR, "cameras.csv"), toCsv(cameras));
  console.log(`✓ Built ${cameras.length} camera(s) → data/cameras.json + data/cameras.csv`);
}

main();
