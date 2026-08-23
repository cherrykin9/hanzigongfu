# 汉字功夫 · Han Zi Gong Fu

A daily Chinese character practice app aligned to the MOE Primary 1 (欢乐伙伴2.0) syllabus.

## Storage: one dashboard click, no keys to paste

Cross-device sync uses **Vercel Blob** (plain JSON, one file per Family Code). No database account elsewhere, no SQL, no copying keys into the code — you connect it from the Vercel dashboard and it auto-injects what the function needs.

## 1. Push this to GitHub

```bash
git init
git add .
git commit -m "Han Zi Gong Fu"
```
Create a new repo on [github.com/new](https://github.com/new), then follow its instructions to push this folder to it.

## 2. Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo you just created.
2. Vercel auto-detects this as a Vite project — no config needed. Click **Deploy**.
3. Once deployed, open the project in the Vercel dashboard → **Storage** tab → **Create Database** → choose **Blob**. Connect it to this project (one click; it's the default option).

That's it — no keys to copy anywhere. Every future push to GitHub auto-deploys.

## 3. Test locally (optional)

You'll need [Node.js](https://nodejs.org) (v18+) and the Vercel CLI (`npm i -g vercel`).

```bash
npm install
vercel link      # connects this folder to your Vercel project (one-time)
vercel env pull  # downloads the Blob token so it works locally too
vercel dev       # runs the app AND the /api/progress function together
```

Plain `npm run dev` also works for everything except cross-device sync — the Family Code screen will still appear, but it'll just save to that one browser instead, which is expected without `vercel dev`.

## 4. Using it on two devices

1. Open the deployed site on his tablet, create a Family Code, start practicing.
2. Open the same site on your phone, choose "I Already Have a Code," enter the same code.
3. Your phone now shows the same Parent Dashboard data his tablet does. The code is also always visible at the top of the Parent Dashboard if you need it again.

## Notes

- Word list: currently Lessons 1–14 (256 characters) from the official 2024 MOE 《欢乐伙伴2.0》Primary 1 character list, covering both 上册 and 下册.
- All audio uses the device's built-in text-to-speech (no API key needed).
- To add more lessons later, edit the `WORDS` array near the top of `src/App.jsx`.
- The Blob store is set to `access: "public"`, meaning the JSON file could technically be read by someone who already had both your Vercel store's hostname and guessed a Family Code — the Family Code itself is what keeps it practically private, similar to the earlier Supabase/Netlify setups. Fine for a low-stakes kids' app; not meant as real authentication.
- The storage calls are isolated in `blobsGet`/`blobsSet` in `src/App.jsx` and `api/progress.js` — swapping providers again later only touches those two files.
