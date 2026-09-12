/* Build step (runs on Netlify): reads content/stories/*.json and
   content/publications/*.json, optimizes every referenced image
   (max 2048px, JPEG q82) into img/opt/, and writes content/bundle.json.
   If sharp is unavailable, files are copied as-is and paths kept. */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

let sharp = null;
try { sharp = require('sharp'); } catch (e) {
  console.log('sharp not installed — copying images without resizing');
}

function readJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

async function optimizeImage(rel) {
  if (!rel || !/\.(jpe?g|png|webp|tiff?)$/i.test(rel)) return rel; // pdf etc: unchanged
  const src = path.join(ROOT, rel);
  if (!fs.existsSync(src)) return rel;
  const destRel = 'img/opt/' + rel.replace(/^img\//, '').replace(/\.[^.]+$/, '.jpg');
  const dest = path.join(ROOT, destRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try {
    if (sharp) {
      await sharp(src).rotate().flatten({ background: '#ffffff' })
        .resize(2048, 2048, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(dest);
    } else {
      fs.copyFileSync(src, dest);
    }
    return destRel;
  } catch (e) {
    console.log('image failed, using original: ' + rel);
    return rel;
  }
}

async function optimizeStory(s) {
  if (s.cover) s.cover = await optimizeImage(s.cover);
  if (Array.isArray(s.items)) {
    for (const it of s.items) {
      if (it.image) it.image = await optimizeImage(it.image);
    }
  }
  return s;
}

async function optimizePub(p) {
  if (p.file && !/\.pdf$/i.test(p.file)) p.file = await optimizeImage(p.file);
  return p;
}

function loadFolder(dir) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full)
    .filter(f => f.endsWith('.json'))
    .map(f => readJson(path.join(full, f)));
}

(async function () {
  try {
    let stories = loadFolder('content/stories');
    for (const s of stories) await optimizeStory(s);
    stories.sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));

    let pubs = loadFolder('content/publications');
    for (const p of pubs) await optimizePub(p);
    pubs.sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));

    fs.mkdirSync(path.join(ROOT, 'content'), { recursive: true });
    fs.writeFileSync(path.join(ROOT, 'content/bundle.json'),
      JSON.stringify({ stories, publications: pubs }));

    console.log('bundle.json written: ' + stories.length + ' stories, ' + pubs.length + ' publications');
  } catch (e) {
    /* never break the deploy: fall back to unoptimized content */
    console.error('build.js error (using raw content): ' + e.message);
    try {
      const stories = loadFolder('content/stories');
      const pubs = loadFolder('content/publications');
      fs.writeFileSync(path.join(ROOT, 'content/bundle.json'),
        JSON.stringify({ stories, publications: pubs }));
    } catch (e2) { console.error(e2.message); }
  }
})();
