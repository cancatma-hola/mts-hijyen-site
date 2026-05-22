#!/usr/bin/env node
// Türkçe karakter içeren ama data-tr olmayan elementleri tara
import { readFileSync } from 'node:fs';

const TR_CHARS = /[ıİşŞğĞüÜöÖçÇ]/;
const FILES = ['index.html', 'iletisim.html', 'hakkimizda.html', 'urunler.html'];
const SKIP_PARENTS = /<(script|style|noscript|head)\b[^>]*>[\s\S]*?<\/\1>/gi;

// Greedy match all opening tags + their text content
const TAG_TEXT = /<([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>([^<]+)<\/\1>/g;

function isMeaningfulText(text) {
  const t = text.trim();
  if (!t) return false;
  if (!TR_CHARS.test(t)) return false;
  if (/^[\d\s.,%+\-→·•—–]+$/.test(t)) return false;
  if (t.length < 3) return false;
  return true;
}

function hasDataTr(attrs) {
  return /\bdata-tr\b/.test(attrs);
}

function findLineNumber(src, idx) {
  return src.slice(0, idx).split('\n').length;
}

for (const f of FILES) {
  const path = `C:/Users/Can/Documents/GitHub/mts-hijyen-site/${f}`;
  const raw = readFileSync(path, 'utf8');
  // Strip script/style/noscript blocks
  const clean = raw.replace(SKIP_PARENTS, m => ' '.repeat(m.length));

  const hits = [];
  let m;
  TAG_TEXT.lastIndex = 0;
  while ((m = TAG_TEXT.exec(clean))) {
    const [full, tag, attrs, text] = m;
    if (!isMeaningfulText(text)) continue;
    if (hasDataTr(attrs)) continue;
    const ln = findLineNumber(raw, m.index);
    const preview = text.trim().slice(0, 80);
    hits.push(`${f}:${ln}  <${tag}>  "${preview}"`);
  }

  // Also check placeholder= attrs
  const phRe = /<(input|textarea|select)\b([^>]*\bplaceholder\s*=\s*"([^"]+)"[^>]*)>/gi;
  while ((m = phRe.exec(clean))) {
    const [full, tag, attrs, ph] = m;
    if (!isMeaningfulText(ph)) continue;
    if (/\bdata-tr-ph\b/.test(attrs)) continue;
    const ln = findLineNumber(raw, m.index);
    hits.push(`${f}:${ln}  <${tag} placeholder>  "${ph.slice(0, 80)}"`);
  }

  // option text inside select
  const optRe = /<option\b([^>]*)>([^<]+)<\/option>/gi;
  while ((m = optRe.exec(clean))) {
    const [full, attrs, txt] = m;
    if (!isMeaningfulText(txt)) continue;
    if (/\bdata-tr-opt\b/.test(attrs) || /\bdata-tr\b/.test(attrs)) continue;
    const ln = findLineNumber(raw, m.index);
    hits.push(`${f}:${ln}  <option>  "${txt.trim().slice(0, 80)}"`);
  }

  console.log(`\n=== ${f} — ${hits.length} eksik ===`);
  hits.forEach(h => console.log(h));
}
