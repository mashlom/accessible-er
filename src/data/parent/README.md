# Parent texts

Everything an adult (a parent or a staff member) reads in the app lives here. Child texts are in `child/`.
Texts that are mixed on one screen are listed in `child-parent/`.

## Layout

```
parent/
  texts.json    he / en / ru: what happens at each station, what may be hard, what to ask,
                how to prepare, waiting times, and for each procedure: who does it, what it is,
                what the child may feel, how to prepare, adaptations, duration
```

## Rules

- **One file, all languages.** Top-level keys are `he`, `en` and `ru`; the Hebrew original sits next to its translations.
- **Shared by all worlds.** Parent texts do not depend on a world, so there is no per-world folder here.
- **Medical wording goes to the MLR team for review.** Do not change or invent medical content here.
- **Code only reads the file.** Logic (which station, which procedure) stays in code.

## Status

- `texts.json` holds the parent words for the stations and procedures, in he, en and ru.
- Done: `journey.ts` keeps only ids, icons, sensory levels and procedure ids. Its words come from this file. The unused `i18n/journey.json`, `i18n/paths.json` and `i18n/procedures.json` are removed.
- Not yet: `procedures.ts` still holds Hebrew text. `ShowPage` and `talk/script.ts` read it. The next step moves that text here and removes the copy.
