# "Clean Ledger": the channel style from Episode 2 on

Goal: clean, clear, professional. Bright and easy to read, nothing that looks like
cheap AI or like every other faceless channel. Built so YouTube sees a real, original,
researched show, not "mass-produced" content.

Based on the research in `reports/US finance YouTube styles.md` (Nov 2026).

---

## 1. What we stop doing (and why)

| Stop | Why |
|------|-----|
| Robot / AI-avatar / mascot narrator or host | YouTube's July 2026 rules name "AI personas giving financial tips" as demonetizable. Tyler is a **person in a story**, never a presenter giving advice. |
| Black or dark empty backgrounds, neon-on-black | Looks like the thousands of template channels; hard to read on phones; feels cheap. |
| Neon glow on everything, glitch, shake, whoosh on every cut | Reads as "AI slop". Use motion only when it explains something. |
| Letterbox black bars + heavy dark teal grade | Makes everything dark and small. Full 16:9 frame, natural bright grade. |
| Stock-photo slideshows, Ken Burns on every still | Named "image slideshow" pattern in the inauthentic-content policy. |
| Tyler losing the same way every episode | Policy: "characters put in the same situation with the same outcome". Vary the ending. |
| Same script template with only the numbers swapped | Same policy. Each episode needs its own research, twist and structure tweaks. |
| Robotic monotone voice | Hurts retention; reads as AI. Direct the narration (pauses, emphasis). |
| Shock thumbnails that lie (fake police, fake prison) | Misleading metadata = strikes / limited ads. The thumbnail must happen in the video. |
| Copyrighted music, news clips, logos of real banks | Copyright claims, ad limits. Use our own score, fictional brands. |
| Daily uploads of near-identical videos | Channel-wide review looks at the last ~30 uploads. Fewer, better episodes. |

## 2. The look

**One sentence:** a bright, premium explainer, half cinematic story (Tyler's real-looking
world in daylight) and half clean "paper" infographic boards, like a Netflix money
documentary crossed with a Vox / Bloomberg graphic.

- **Story scenes (about 55%)**: Tyler's world, mostly **daytime, golden hour, warm interiors**.
  Night scenes only when the story needs them (the repo, the gas station), max ~15% of runtime.
  Natural bright grade, light film grain, no crushed blacks.
- **Explainer boards (about 35%)**: warm off-white "paper" background, navy ink, flat clean
  shapes, real-looking documents (summons, statement, 1099-C) laid on a desk from above.
  This is where all rules and numbers live.
- **Proof moments (about 10%)**: "Receipt Cards" quoting a real rule or statistic with the
  source written on screen (CFPB, FTC, NY Fed, state law). This is what makes us look
  researched, not generated.

### Palette

| Token | Hex | Use |
|-------|-----|-----|
| Paper | `#F6F1E7` | board backgrounds (never pure black or pure white) |
| Ink | `#1B2A41` | text, outlines |
| Slate | `#5B6B7F` | secondary text, gridlines |
| Money in | `#1F9D6B` | payments, savings, wins |
| Money out | `#D64545` | debt, fees, losses (use sparingly) |
| Deadline | `#E8A33D` | day stamps, warnings, timers |
| Brand gold | `#C9A227` | logo, "The Money Trail" mark, end cards |

### Type

- Headlines: a strong condensed sans (e.g. *Oswald* / *Bebas Neue*, already in the project).
- Body, numbers, captions: a clean sans (e.g. *Inter*). Numbers always tabular.
- Max ~6 words on screen at once; captions at the bottom, high contrast.

### Motion

- Smooth eased moves (slide, scale, draw-on lines). No glitch, no RGB split, no shaking.
- A visual change every **3–4 seconds**, a bigger "pattern interrupt" every 20–40 seconds
  (new scene, board, Receipt Card, the Fork).
- Kling clips only for 3–5 s character beats; everything with numbers is Remotion.

## 3. Recurring elements (the show's identity; content changes, these stay)

1. **Tyler's Ledger** (top-right, light card): Day · Cash · Debt · Credit score. Ticks on every money event.
2. **The Trail** (bottom bar): Day 1 → Day 30 → Day 180 → Court → Year 7, filling as the story moves.
3. **Receipt Cards**: rule + plain-English meaning + source.
4. **The Fork**: at the key decision, split screen of both paths ("What would you do?").
5. **Point of No Return** stamp: where it becomes legally serious. Also the Shorts cut point.
6. **Exit Ramps** end board: what could have been done at each stage (general info, not advice).
7. **Continuity**: Tyler's past episodes show on his Ledger (Ep1 repo hit on his score).

## 4. Tyler (human, consistent, never a host)

- Same face and outfit sheet as Episode 1 (`channel/images/tyler-reference.png`), so the 24
  paid scenes stay reusable. Generate new scenes with that reference, **daylight first**.
- He never looks at the camera to give advice. He lives the story; the narrator tells it.
- Outcomes change: Ep1 he ignored everything and lost the truck. Ep2 he fights back and
  partly wins. Some later episodes end well (windfall, recovery).

## 5. Upload safety checklist (every episode)

- [ ] Original script, new research, at least 3 Receipt Cards with named sources.
- [ ] Ending is different from the previous 2 episodes.
- [ ] Narrator = storyteller. Disclaimer: "general information, not financial or legal advice".
- [ ] No real bank logos, no copyrighted music or clips.
- [ ] Thumbnail and title show something that really happens in the video.
- [ ] YouTube Studio: "Altered or synthetic content" = **Yes** (realistic AI scenes).
- [ ] Watch the full render once: no warped hands, garbled text or face drift in any AI shot.
- [ ] 2–4 Shorts cut from the Fork and the Point of No Return, not re-uploads of the long video.
