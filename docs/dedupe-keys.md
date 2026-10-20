## Deduplicate text keys

Today 185 texts are stored under more than one key (325 extra copies, counted in Hebrew; en/ru look the same). The `text_name` language shows them as `key ×N`.

**Rule:** one meaning — one key. Shared UI labels live only in `i18n/ui`, station names only in `parent/texts` stages, procedure names only in `i18n/procedures`. Same text with a different meaning may keep two keys (listed as allowed duplicates).

### TODO
- [ ] **Step 1 — section labels.** One key each for "what happens / what may be hard / what you can ask" (`i18n/ui:labels.*`); drop the copies from the book info files, `parent/home`, `parent/ui`. (~30 copies)
- [ ] **Step 2 — merge `parent/ui` into `i18n/ui`.** Move the missing keys, delete the matching ones, read everything through `t('ui.…')`, delete `parent/ui.json`. (~35 copies)
- [ ] **Step 3 — station and procedure names.** `i18n/journey`, `i18n/paths`, `i18n/book` stop storing names and look them up by stage/procedure id. Separate commit, every world checked.
- [ ] **Step 4 — duplicates inside one file** (`i18n/procedures` 26, `parent/ui` 11, `parent/texts` 8, `i18n/careCard` 7): merge same-meaning ones one by one.
- [ ] **Step 5 — guard.** `npm run dups` prints the duplicate table; the build fails on a new duplicate that is not in the allowed list.

### Checks after every step
- `text_name`: no `!` on the screens, `×N` goes down.
- `npm run build` passes.
- he/en/ru screens show the same texts as before (page text snapshots before/after).

### Out of scope
- No rewording and no new translations — only moving keys.
- Staff texts stay Hebrew.

