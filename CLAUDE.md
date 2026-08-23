# 汉字功夫 · Han Zi Gong Fu — Project Notes

Daily Chinese-character practice app for a 7-year-old (P1, Singapore), built as a
single-page React app. This file exists so a fresh Claude Code session has full
context without the person needing to re-explain the project.

## What this is

- Kung-fu themed: reviewing/learning characters = "battling spirits," a
  customizable hero avatar, a Chi currency, a monthly "boss battle," equipment
  shop. All built to make daily 10-15 min practice feel like a game, not drills.
- Content is sourced from the **real official MOE 2024 《欢乐伙伴2.0》Primary 1
  character list** (both 上册 and 下册), not invented vocabulary. This matters —
  the whole point is curriculum alignment, so any new words added should stay
  sourced from that syllabus, not made up.

## Stack

- Vite + React (no router — screens are managed via `useState`, not URL routes)
- Tailwind (utility classes inline, no design system file)
- `lucide-react` for icons, `recharts` for the Parent Dashboard chart
- Deploy target: **Vercel**, connected to GitHub for auto-deploy
- Storage: **Vercel Blob** via `api/progress.js` (see Storage section below)

## Key files

- `src/App.jsx` — the entire app. Single file by design (grew organically from
  a Claude.ai artifact). Worth considering splitting into modules if it keeps
  growing, but no urgency.
- `api/progress.js` — Vercel serverless function, stores/retrieves one JSON
  blob per "Family Code" using `@vercel/blob`.
- `WORDS` array near the top of `App.jsx` — the character data. Currently
  **Lessons 1–14 (256 characters)**. Lessons 15–19 exist in the real syllabus
  and haven't been added yet (lower-confidence source for 2.0 specifically —
  worth re-verifying against the actual MOE PDF before adding, the same way
  1–14 were sourced). MOE 2024 PDFs live at moe.gov.sg but block direct
  fetching (robots disallowed) — web search snippets from those exact PDF URLs
  worked as a source instead.

## Storage architecture (important — don't casually "simplify" this)

`HAS_CLAUDE_STORAGE` detects whether `window.storage` exists (true only inside
a Claude.ai artifact preview). Based on that:

1. **Inside Claude.ai artifact preview**: uses `window.storage` directly.
   `localStorage` is explicitly NOT allowed in that sandbox — don't add it as
   a "simpler" fallback for that context, it will silently fail.
2. **Deployed (Vercel)**: calls `/api/progress` (Vercel Blob), gated behind a
   "Family Code" the user enters once per device to link them.
3. **Function unreachable** (e.g. plain `vite dev` without `vercel dev`, or a
   network hiccup): falls back to plain `localStorage`, which is fine outside
   the Claude sandbox.

This three-tier design means the *same* `App.jsx` works unmodified both in
Claude.ai previews and once deployed — that's intentional, preserve it if
restructuring storage again.

We iterated through Supabase → Netlify Blobs → Vercel Blob for the backend.
Vercel Blob was chosen over "Vercel KV" because Vercel KV was discontinued as
a first-party product (moved to Marketplace-only, e.g. Upstash, which needs a
separate account) — Blob is the current first-party, zero-account option.

## Things already fixed once — don't reintroduce

- **Web Speech API quirks**: `speak()` caches the voice list (`onvoiceschanged`),
  avoids calling `speechSynthesis.cancel()` immediately before `speak()`
  (silently drops the utterance on some browsers), and primes the speech
  engine on first tap (`primeSpeechEngine()`) because iPad Safari commonly
  eats the very first `speak()` call on a page otherwise.
- **Hero avatar SVG draw order**: weapons must render *last* in the SVG
  (after the head), or they get visually clipped behind his head depending on
  rotation angle. Learned this the hard way — render and visually inspect
  (`cairosvg` + the `view` tool) before trusting any new SVG coordinates,
  rather than guessing coordinates blind.
- **ESM vs CJS in serverless functions**: `package.json` has `"type": "module"`
  project-wide (for Vite config), so `api/progress.js` must use `export default`,
  not `exports.handler =` — the CJS form silently no-ops here.

## Where things stand

- Deployed to GitHub, Vercel project set up, Blob storage connected as of the
  last session — but not yet confirmed working end-to-end on a real device
  (sandboxed testing can only confirm code correctness, not live
  cross-device sync — that needs a real test on the person's tablet + phone).

## Likely next steps (not committed to, just the natural backlog)

- Add Lessons 15–19 to `WORDS` (re-verify against the real 2.0 PDF first)
- Confirm real end-to-end sync between the tablet and a parent's phone
- Possibly split `App.jsx` into multiple files if it keeps growing
- More game-mode variety beyond Match / Listening Dash / Lightning Round
