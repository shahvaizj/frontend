# Unity WebGL Deployment Notes

Date: March 9, 2026
Project: `D:\Workspace AI Agents\MyPortfolio\frontend`

## Goal
Run Unity WebGL build in React portfolio without `bad token` / `Unable to parse ...` errors.

## What We Tried
1. Initial build run:
- Error: `EPERM: operation not permitted, lstat 'C:\Users\shahv'`
- Cause: temp/cache path access issue in this environment.

2. First Unity fix approach:
- Decompressed `.br` files to uncompressed `.data/.wasm/.framework.js`
- Updated Unity `index.html` to load uncompressed files
- This worked functionally, but build size became much larger because both compressed and uncompressed files existed.

3. Switched back to compressed hosting:
- Unity export now uses `.unityweb` files (`.data.unityweb`, `.wasm.unityweb`, `.framework.js.unityweb`)
- Parse error appeared because server headers for `.unityweb` were missing.

## Final Working Setup
### 1) Build script uses local temp/cache
File: `scripts/build-frontend.js`

Set:
- `TEMP`, `TMP`, `TMPDIR` -> `frontend/.tmp`
- `npm_config_cache` -> `frontend/.cache`

This avoids `EPERM` build failure.

### 2) Unity file references use `.unityweb`
File: `public/portfolio-app/index.html`

Unity config points to:
- `Portfolio App.data.unityweb`
- `Portfolio App.framework.js.unityweb`
- `Portfolio App.wasm.unityweb`

### 3) Apache headers configured for Unity compressed files
File: `public/.htaccess`

Required rules:
- `AddEncoding br .unityweb`
- `Header set Content-Encoding br` for `.unityweb`
- Correct content types:
  - `.framework.js.unityweb` -> `application/javascript`
  - `.wasm.unityweb` -> `application/wasm`
  - `.data.unityweb` -> `application/octet-stream`

### 4) Build command
Use:
```bash
npm run build
```

Output:
- `build/` folder is deploy-ready.

## Why This Works
Unity compressed artifacts (`.unityweb`) are Brotli-compressed. Browser can parse them only when server sends:
- correct `Content-Encoding: br`
- correct `Content-Type`

Without these headers, browser reports file parse/corruption errors.

## Quick Verification Checklist
1. In deployed `portfolio-app/index.html`, confirm URLs end with `.unityweb`.
2. In browser Network tab, confirm response headers for `.unityweb` files include:
- `Content-Encoding: br`
3. Confirm `Content-Type` values:
- JS framework: `application/javascript`
- WASM: `application/wasm`
- Data: `application/octet-stream`
4. Hard refresh or clear CDN cache after deployment.

