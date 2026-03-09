/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: true,
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

function main() {
  const rootDir = path.resolve(__dirname, '..');
  const tempDir = path.join(rootDir, '.tmp');
  const cacheDir = path.join(rootDir, '.cache');
  ensureDir(tempDir);
  ensureDir(cacheDir);

  const env = {
    ...process.env,
    TEMP: tempDir,
    TMP: tempDir,
    TMPDIR: tempDir,
    npm_config_cache: cacheDir,
  };

  console.log(`Using TEMP directory: ${tempDir}`);
  run('react-scripts', ['build'], { cwd: rootDir, env });
}

main();
