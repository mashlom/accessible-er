# Child texts

Everything a child reads or hears in the app lives here. Parent texts are kept apart in `parent/` (not yet created).
Texts that are mixed on one screen (a child and a parent read them together) are listed in `child-parent/`.

## Layout

```
child/
  book/          the book for the youngest children (page by page)
  procedures/    the steps a child hears before each procedure, shared by all worlds
  worlds/
    ocean/       texts.json: station names and hints, stories about procedures, steps, calm lines (ocean world)
                 world.json: the world's look (not texts) — see worlds/README.md
    knight/      (to be moved)
    dino/        (to be moved)
    fairy/       (to be moved)
    space/       (to be moved)
    safari/      (to be moved)
    dollhouse/   (to be moved)
```

## Rules

- **One file per section, with all languages in it.** Each `texts.json` has the top-level keys `he`, `en` and `ru`. The Hebrew original is always in the file, next to its translations.
- **Keys follow the code.** A key path in the JSON matches the way the code reads it, as in `ocean.json`.
- **Shared vs per world.** Procedure steps are the same in every world, so they stay in `procedures/`. Station names, hints, stories and the steps of a world are per world, so they go into `worlds/<world>/`.
- **Only logic stays in code.** Icons, pictures and which step to show are code; the words are in `texts.json`.
- **No medical content is invented here.** New or changed medical wording goes to the MLR team for review.

## Status

- `book/`, `procedures/`: not moved yet.
- `worlds/ocean/`: next to move (station names, hints, stories, steps and calm lines).
