# Venda Culture Galaxy — Architecture

*v1 — static-first, no backend, accessibility built in from day one*

## Principles

- **Static-first.** No database, no API server, no user accounts in v1. Content is files in the repo, not rows in a table.
- **Accessibility is a parallel mode, not a retrofit.** The keyboard/screen-reader version is built from the same data, alongside the galaxy, from day one — not bolted on at the end.
- **One flagship category first.** Prove the interaction with placeholder data before any real content goes in.
- **Everything through Git**, editable from GitHub's web editor or any mobile browser. No tool that needs a local machine.

## Stack

| Layer | Choice | Skip |
|---|---|---|
| Framework | Astro | Next.js |
| 3D layer | Three.js (vanilla) | React Three Fiber |
| Animation | GSAP | — |
| Styling | Tailwind CSS | — |
| Language | JavaScript (v1) → TypeScript later | — |
| Data | JSON content files, Astro Content Collections | PostgreSQL / Prisma |
| Images | Repo + Astro image optimization; Cloudinary free tier if it outgrows the repo | Supabase Storage |
| Hosting | Netlify | Vercel |
| Backend | None | Node/Express, Render |

**Astro over Next.js** — Astro ships zero JS by default and only hydrates the interactive pieces, which here is just the galaxy canvas. Next.js assumes you want a server; you want a museum. Content Collections also double as your data schema, which lines up with "content as files" below, and it deploys to Netlify as static output — nothing new on the hosting side.

**Vanilla Three.js over React Three Fiber** — R3F wraps Three.js in a React reconciler. For hand-tuned shader/particle work (the nebula, the starfield), that's an extra layer to fight, especially without a full IDE to debug in. Direct Three.js is easier to build and reason about one scene at a time.

**GSAP** — built for exactly this animation language: timelines, easing, sequencing a camera move into a UI fade into a reveal. Hand-rolled `requestAnimationFrame` chains get messy fast.

**JS now, not TypeScript** — TypeScript's real value is the editor tooling (inline errors, autocomplete), which a phone browser won't give you well. The safety net matters more once the data shape has stabilized — add types in Phase 2.

**Correction from last message:** this project doesn't need Render. That's for TrustGuard's Flask backend. This is static content — GitHub + Netlify is the whole pipeline, one less moving part than your other project.

## Data model

Every entity is a JSON file, checked against an Astro content schema. No database — Git *is* the database, and every change is a reviewable commit.

```
src/content/
├── categories/
│   ├── royal-families.json
│   ├── legendary-musicians.json
│   ├── tshivenda-language.json
│   └── ...
├── figures/
│   └── <figure-id>.json
├── events/
└── locations/
```

Figure schema — every profile follows this shape:

```json
{
  "id": "",
  "name": "",
  "category": "",
  "subcategory": "",
  "birth": { "year": null, "note": "" },
  "death": { "year": null, "note": "" },
  "lineage": "",
  "bio": "",
  "achievements": [],
  "significance": "",
  "facts": [],
  "gallery": [
    {
      "src": "",
      "type": "portrait | historical | illustration",
      "caption": "",
      "source": "",
      "license": ""
    }
  ],
  "references": [{ "title": "", "url": "", "publisher": "" }],
  "location": { "name": "", "lat": null, "lng": null },
  "timeline": [{ "year": "", "event": "" }],
  "verified": false,
  "disputed": false,
  "disputeNote": ""
}
```

Two fields are doing real work:
- **`disputed` / `disputeNote`** — turns "clearly state when history is disputed" into something the UI can actually render as a visible flag, not just a writing reminder.
- **`gallery[].license`** — no image goes in without an answer to "what's the license." The sourcing plan from last message, enforced by the schema instead of memory.

## Repo structure

```
/
├── src/
│   ├── components/
│   │   ├── galaxy/        # Three.js scene, camera, nodes
│   │   ├── ui/             # overlays, mute toggle, controls
│   │   └── accessible/     # list-based parallel navigation
│   ├── content/            # the data — see above
│   ├── layouts/
│   ├── pages/               # real routes: /figures/[id], /categories/[id]
│   └── styles/
├── public/images/
├── astro.config.mjs
└── package.json
```

## How the galaxy actually works

Each planet maps 1:1 to a real page. Tapping a node animates the camera *and* changes the URL to that page's real route — every figure and category gets a shareable, bookmarkable link, the back button works, and a screen reader or search crawler hitting that URL directly gets real HTML, whether or not it ever touches the canvas.

The galaxy is one interactive "island" sitting on top of otherwise-static pages — it's the navigation, not the whole site.

## Accessible / reduced-motion mode

Same content, same data files, rendered as a real nested `<nav>` — categories → figures — fully keyboard-tabbable, real heading hierarchy, real `alt` text per image. Triggered automatically by `prefers-reduced-motion`, plus a visible toggle, not one buried in a footer. First-class way to experience the site, not a fallback.

## Images

Checklist before anything goes into a `gallery[]` entry:
1. Public domain or CC-licensed, source recorded — **or**
2. From a heritage institution/archive with explicit permission — **or**
3. Commissioned original art from a Venda artist — **or**
4. It doesn't go in.

Store optimized images in `public/images` — Astro handles responsive sizing at build time. Move to Cloudinary's free tier only if the repo gets too large. No backend either way.

## Explicitly out of scope for v1
- User accounts, comments, contributions
- Admin dashboard / CMS (edit JSON via GitHub directly)
- Search
- Any category beyond the flagship one

## Phased build

1. **Galaxy shell** — starfield, central node, 3 placeholder planets, tap-to-expand, zoom. No real content yet. Test on an actual low-end Android phone before going further.
2. **Accessible mode**, built against the same placeholder data — proven alongside the galaxy, not after it.
3. **One flagship category** — real researched content, real licensed images, full depth: category → subcategory → profile → gallery.
4. **Expand horizontally** to remaining categories, reusing the proven schema and components.
5. **Performance + accessibility pass** on real content.
6. **Launch.**

Royal Families stays last — ideally once there's a rhythm on lower-stakes categories and some path to community/cultural review.

## Open decisions
- **Flagship category** — Legendary Musicians, Traditional Dance, and Tshivenda Language are the strongest candidates: visually rich, well-documented, lower sensitivity than Royal Families. Tshivenda Language is also the one you could partly write yourself.
- **Image host at scale** — Cloudinary vs. alternatives, not a decision that needs making yet.