# Shader — 1:1 website clone

A local, self-hosted clone of [shader.se](https://www.shader.se) — the
WebGL/WebGPU scrollytelling site for **Shader Development Studio**.

The original renders its *entire* interface (navigation, typography, film-strip
carousel, page-peel transitions and all 3D scenes) into a single React Three
Fiber canvas. There is no HTML layout to rebuild — so the faithful route is to
self-host the production client bundle together with every model, texture,
font and prebaked media file it requests, and serve it from a local origin with
the same URL layout.

This is a study/reference clone. All design, copy, imagery, 3D models and fonts
belong to **Shader Sweden AB**. Do not use it commercially.

## Run it

```bash
node scripts/serve.mjs
# → http://127.0.0.1:3400
```

(Or `pnpm dev` / `npm run dev` where the package manager is available.)

No dependencies, Node.js 20+ only. `PORT` and `HOST` can be overridden:

```bash
PORT=5000 node scripts/serve.mjs
```

## What is included

| Path | Purpose |
| --- | --- |
| `index.html` | Home page (server-rendered shell the original hydrates) |
| `accessibility-statement/index.html` | `/accessibility-statement` page |
| `_next/static/chunks/` | Original client JS/CSS bundles (self-hosted) |
| `models/` | `computer`, `bank`, `deskbox`, `phones`, `shredder`, `tie` GLB models |
| `textures/` | Every texture, icon, photo cut-out and dashed frame used by the scenes |
| `fonts/` | STIX MSDF font atlases + glyph metrics |
| `videos/prebaked/` | Handshake AVIF sprite sheets + manifests (desktop and mobile) |
| `draco/` | Draco decoder for the compressed GLB models |
| `api/mux-image/` | Locally mirrored Mux video poster frames for the carousel |
| `scripts/serve.mjs` | Zero-dependency local server with clean URLs, range requests and correct MIME types |
| `scripts/build.mjs` | Copies the deployable site into `dist/` (static output) |
| `vercel.json` | Forces Vercel to deploy `dist/` as a static site instead of running the server as a function |
| `noop-analytics.js` | Empty local replacement for the removed analytics loader |
| `.nojekyll` | Written into `dist/` so GitHub Pages does not hide the `_next` folder |
| `reference/` | Local recon evidence (DOM dumps, screenshots, network manifest); git-ignored |

## Deployment

The repo is a static site, not a Node server. The custom server is only for
local development; running it on a serverless host makes the host trace only the
entry module, which is why an earlier Vercel deployment served HTML but 404'd
every asset.

`vercel.json` therefore runs `node scripts/build.mjs` and publishes `dist/`:

```bash
pnpm build          # or: node scripts/build.mjs
SERVE_DIR=dist PORT=3400 node scripts/serve.mjs
```

Vercel will rebuild automatically on push. The deployed site must be served from
the domain root, because the original bundle references assets with absolute
paths such as `/_next/...`.

## Fidelity notes

Reproduced:

- Full scroll experience from hero → selected-work carousel → about/manifesto →
  showcase → "Had enough reading?" shredder → golden tie → handshake → phones →
  contact/footer.
- Live WebGL scenes, camera moves, page-peel transitions, film-strip carousel,
  text effects, noise/grunge overlays, hover and keyboard interactions.
- Header nav anchors, "Book a call" link, announcement bar and its dismiss
  state, mobile layout, accessibility overlay and tab navigation.
- Original typography (STIX MSDF), colours, copy and responsive breakpoints.
- `/accessibility-statement` route.

Intentional changes:

- Analytics (`analytics.shader.build`) removed: the loader is pointed at a local
  no-op script (`noop-analytics.js`) and the tag was stripped from both pages.
- Remote Mux HLS project trailers are still streamed from Mux (the original
  behaviour). The poster frames are mirrored locally. With no internet the page
  still loads and scrolls, but the small CRT-screen videos stay blank/fall back
  to posters.
- Vercel deployment metadata and the original deployment query strings are left
  inert.

## Evidence

The `reference/` folder captures the recon used to build this clone:

- `reference/dom/full-page.html` — hydrated original DOM
- `reference/dom/facts.json` — tokens, fonts, resources, animation inventory
- `reference/screenshots/original-full.png` and `scroll-*.png` — original at 15
  scroll depths (1200×834)
- `reference/screenshots/mirror-scroll-*.png` — same depths on this clone
- `reference/resources-all.json` — every network resource requested after a full
  scroll

## Attribution

Original site: <https://www.shader.se> — © Shader Sweden AB. This clone is for
learning and private study only.
