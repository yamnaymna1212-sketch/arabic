# The Money Trail: video project (Remotion)

```console
npm i
npm run dev        # preview in Remotion Studio
```

## Render Episode 1

```console
npx remotion render Ep1-CarLoan out/raw-ep1.mp4 --crf=18
ffmpeg -i out/raw-ep1.mp4 -c:v copy -af "acompressor=threshold=-18dB:ratio=2.5:attack=8:release=120:makeup=2,loudnorm=I=-14:TP=-1.0:LRA=9" -ar 48000 -c:a aac -b:a 256k out/money-trail-ep1-car-loan.mp4
```

Thumbnails and brand: `npx remotion still Thumb-A out/thumb-A.png` (also `Thumb-B`, `Logo`, `Banner`).

## Files

- `src/Episode.tsx`: shot list (which scene when), overlays, sound effects, music
- `src/overlays.tsx`: motion-graphics components (stamps, cards, gauge, math, timeline…)
- `src/lib.tsx`: camera moves, film grain, letterbox, captions, fonts
- `src/words.json`: narration word timings (ElevenLabs Scribe); `W(i)` = start of word i
- `public/scenes/`: AI-generated scene plates (ElevenLabs, Nano Banana Pro)
- `public/vo/narration.mp3`, `public/music/score.mp3`: voice and score

See `CREDITS.md`.
