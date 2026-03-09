/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const appDir = path.resolve(process.cwd(), 'public', 'portfolio-app');
const buildDir = path.join(appDir, 'Build');
const indexPath = path.join(appDir, 'index.html');

const compressedFiles = [
  'Portfolio App.data.br',
  'Portfolio App.framework.js.br',
  'Portfolio App.wasm.br',
];

function exists(p) {
  return fs.existsSync(p);
}

function decompressIfPresent(fileName) {
  const src = path.join(buildDir, fileName);
  if (!exists(src)) return false;

  const out = path.join(buildDir, fileName.replace(/\.br$/, ''));
  const input = fs.readFileSync(src);
  const output = zlib.brotliDecompressSync(input);
  fs.writeFileSync(out, output);
  console.log(`decompressed: ${path.basename(out)}`);
  return true;
}

function ensureIndexUpdates(html) {
  let next = html;

  next = next
    .replace(
      'dataUrl: buildUrl + "/Portfolio App.data.br",',
      'dataUrl: buildUrl + "/Portfolio App.data",'
    )
    .replace(
      'frameworkUrl: buildUrl + "/Portfolio App.framework.js.br",',
      'frameworkUrl: buildUrl + "/Portfolio App.framework.js",'
    )
    .replace(
      'codeUrl: buildUrl + "/Portfolio App.wasm.br",',
      'codeUrl: buildUrl + "/Portfolio App.wasm",'
    );

  const warningFilter = [
    "        if (",
    "          type === 'warning' &&",
    "          msg &&",
    "          msg.indexOf('Content-Type') !== -1 &&",
    "          msg.indexOf('application/wasm') !== -1",
    "        ) {",
    '          return;',
    '        }',
    '',
  ].join('\n');

  if (!next.includes("msg.indexOf('application/wasm') !== -1")) {
    const marker = '      function unityShowBanner(msg, type) {\n';
    if (next.includes(marker)) {
      next = next.replace(marker, marker + warningFilter);
      console.log('added wasm warning filter to unityShowBanner');
    } else {
      console.warn('unityShowBanner function signature not found; skipped warning filter injection');
    }
  }

  return next;
}

function main() {
  if (!exists(appDir) || !exists(buildDir) || !exists(indexPath)) {
    console.error('Unity build not found at public/portfolio-app. Expected index.html and Build/ folder.');
    process.exit(1);
  }

  let decompressedAny = false;
  for (const fileName of compressedFiles) {
    decompressedAny = decompressIfPresent(fileName) || decompressedAny;
  }

  if (!decompressedAny) {
    console.log('no .br files found; skipping decompression');
  }

  const html = fs.readFileSync(indexPath, 'utf8');
  const updated = ensureIndexUpdates(html);
  if (updated !== html) {
    fs.writeFileSync(indexPath, updated, 'utf8');
    console.log('updated index.html');
  } else {
    console.log('index.html already configured');
  }

  console.log('Unity build fix complete.');
}

main();
