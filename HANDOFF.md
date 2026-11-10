Continue my YouTube project "The Money Trail" (English finance channel, "What happens if…?" stories with one American character, Tyler, in a cinematic style).

Repo: yamnaymna1212-sketch/arabic, branch `claude/intelligent-rubin-fnfk4p` (check it out; all work is there).
Read `channel/CHANNEL.md` first: episode structure, character, location library, workflow, and BUDGET RULES (my credits are limited: reuse assets, 1 take per generation, always run estimate_only and tell me the price before spending).

Current state, Episode 1 "What Happens If You Stop Paying Your Car Loan?":
- Script, narration, word timings, 24 scene images, music, thumbnails, logo and banner are done and committed.
- Video project: `money-trail-video/` (Remotion). Run `npm i` first.
- 10 animated key shots (Kling 2.6 Pro, already PAID). 5 are in `money-trail-video/public/clips/` (s01, s02, s17, s20, s27).
  The other 5 just need downloading (no new cost) from ElevenLabs flow `dDUVdUMGiRxC8cXuw8TE` with creative_get_flow_run_status:
  s05 = session vWtY7WaARHC4yyOEIxxD, s13 = Z6sjII7O03XI0lXMH8qN, s19 = 8eH5FwGgTJIenD3slCJO,
  s22 = N9kVVVhpT2lJS9abwYkq, s24 = EQMdw3TNKQ5x7iKvoWRV. Save as `public/clips/sXX.mp4`.
  If a download link has expired, check the flow nodes "vid s05", "vid s13" etc. for the generation. Do NOT re-generate.

Remaining steps:
1. Download the 5 clips above.
2. For all 10 clips, extract the last frame: `ffmpeg -sseof -0.1 -i sXX.mp4 -frames:v 1 -update 1 sXX-last.png` (the code uses `clips/sXX-last.png`).
3. `npx tsc`, then render 6–8 test stills to check the clips blend well.
4. Render: `npx remotion render Ep1-CarLoan out/raw-ep1.mp4 --crf=18` (about 35–45 min).
5. Master the audio (command in `money-trail-video/README.md`). Keep the final MP4 under 95 MB so it fits on GitHub (re-encode if needed).
6. Commit and push the final video to the same branch, then tell me (in Arabic) where it is.

Upload notes: on YouTube, tick "Altered or synthetic content = Yes". Title, description and tags are in `episodes/ep01-car-loan/youtube.md`.
