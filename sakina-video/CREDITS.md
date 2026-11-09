# Sakina — Episode 1 credits

- Narration voice: ElevenLabs ("Ahmed – Deep Arabic Documentary"), AI generated.
- Recitation of Al-Baqarah 261: Sheikh Yaser Salamah (Hafs), Dhikr Al-Huda app, CC BY 4.0 — https://archive.org/details/dhikr-alhuda-yaser-salamah-hafs
- Background plates and riyal photo: AI generated (ElevenLabs image models).
- Sound effects: Kenney.nl packs (CC0, see public/sfx/KENNEY-LICENSE.txt), remotion.media samples, and ElevenLabs sound effects.
- Icons: Lucide (ISC license).
- Fonts: Reem Kufi, Amiri, IBM Plex Sans Arabic (SIL Open Font License).

Render: `npx remotion render Episode1-Sanabil out/raw-episode1.mp4 --crf=18`
Master audio to YouTube loudness:
`ffmpeg -i out/raw-episode1.mp4 -c:v copy -af "acompressor=threshold=-18dB:ratio=2.5:attack=8:release=120:makeup=2,loudnorm=I=-14:TP=-1.0:LRA=9" -ar 48000 -c:a aac -b:a 256k out/sakina-ep1-sanabil-youtube.mp4`
