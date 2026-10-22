## Deduplicate text keys

At the start, 185 texts were stored under more than one key (325 extra copies, counted in Hebrew). Today: 155 texts, 210 extra copies in Hebrew (`npm run dups` prints the table). The `text_name` language shows them as `key ×N`.

**Rule:** one meaning — one key. Shared UI labels live in `i18n/ui`, station words in `parent/texts` stages, procedure words in `parent/texts` procedures and `child/procedures`. The same words in different flows (worlds, encyclopedia, adult flow) may keep separate keys, because they may drift apart. Pairs are merged only when the text matches in he, en and ru, so nothing on the screen changes.

### TODO
- [ ] **Step 1 — section labels, one set per flow.**
  - [x] Encyclopedia: `ui.labels.book` (the copies in the three book info files are gone).
  - [x] Adult flow: `ui.labels.adult` (trail and the parent info sheet).
  - [ ] Worlds: "We are here / What happens here / What may be hard / How to prepare the child / What you can ask for". "How to prepare the child" has no he/en wording yet.
- [x] **Step 2 — merge `parent/ui` into `i18n/ui`.** 242 texts moved as they are; `parent/ui.json` is gone.
- [x] **Step 3 — station and procedure words.** `journey.ts`, `procedures.ts`, `paths.ts`, `map.ts` and `support.ts` keep ids, emoji and logic only; their words are in JSON. The unused `i18n/journey`, `i18n/paths` and `i18n/procedures` are removed. Encyclopedia station names stay separate (a different flow). There is no Hebrew left in the code outside JSON.
- [ ] **Step 4 — duplicates inside one file.**
  - [x] G: care card suggestions point at the asks (`adaptationFor`).
  - [x] A: 14 pairs with the same text in all languages (close button, message title, dead copies).
  - [ ] 22 pairs whose en/ru text differs (e.g. tile names vs page titles, `storyFeedback.help` vs `team.help`): pick the wording to keep.
  - [ ] "Back" ×3 (`i18n/book:ui.back`, `i18n/ui:shell.back`, `parent/home:wait.back`).
  - [ ] Repeated procedure values ("A nurse" ×6, "about a minute" ×3) and route stop names: need a shared structure, not just one key.
  - [ ] `celebrate.admission.0.title` (read by kind in `blocksFor`).
- [x] **Step 5 — guard.** `npm run dups` prints the table; `npm run build` fails when a key holds a duplicate that is not in `scripts/dups-allowed.json`. Removing a duplicate needs no update; a copy kept on purpose is added with `npm run dups -- --update`.

### Checks after every step
- `text_name`: no `!` on the screens, `×N` goes down.
- `npm run build` passes (it runs the duplicate check).
- he/en/ru screens show the same texts as before.

### Checked in the browser
- Talk with Roni (ru): all 16 procedures, a procedure's text and asks, the calm tips (the pause tip is found by id), the ready sentences (shown to the staff in Hebrew), the staff requests.
- Worlds' "when it's hard" page: the tip icons show in he, en and ru; the ready sentence shown to the staff is Hebrew.
- Story calm page: the overlay's close button reads `ui.buttons.close`; the ready sentence on the big screen is now Hebrew for the staff, like in the worlds and the talk (the button stays in the parent's language).

### Out of scope
- No rewording and no new translations — only moving keys.
- Staff texts stay Hebrew.

### TODO: Hebrew without slash forms (not started)
- Remove the gendered slash forms (הרופא/ה, מחזיק/ה, הילד/ה) from the Hebrew texts. Use impersonal or neutral wording.
- Count: 146 Hebrew texts. Child texts: 44. Parent and staff texts: 102; these include medical wording, so they need MLR approval first.
  - parent/texts: 32
  - i18n/ui: 27
  - i18n/careCard: 12
  - child/book/real-info: 11
  - i18n/book: 7
  - parent/talk: 7
  - child/book/roni: 6
  - child/procedures/texts: 5
  - child/worlds/ocean/texts: 5
  - i18n/support: 5
  - parent/paths: 5
  - child/worlds/knight/texts: 4
  - parent/map: 4
  - child/worlds/dino/texts: 3
  - child/worlds/safari/texts: 3
  - child/worlds/space/texts: 3
  - parent/home: 3
  - child/book/encyclopedia: 2
  - child/book/measure-info: 1
  - child/book/tests-info: 1
- Keep the station names in each world separate. Do not replace them with shared labels.
- Also check the grammar of "הרופא/ה יבואו" (shared child texts: doctor-exam.story.3, waiting-results.story.3): plural verb with a singular subject.
