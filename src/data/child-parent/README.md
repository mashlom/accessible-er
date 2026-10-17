# child-parent: texts that are mixed in one screen

Texts here cannot be split yet, because a child and a parent read them on the same screen.
Once a text is split, it moves to `src/data/child/` or `src/data/parent/`, and the entry is removed here.

Not exhaustive yet: this is the first inventory (2026-10-17).

## 1. World narratives inside the parent sheet
- `procedureNarratives` in `src/concepts/quest/themes/index.ts` (one set per world).
- Shown in the parent sheet by `ProcedurePanel` in `src/concepts/quest/components/ParentInfo.tsx` (line ~279, ~294).
- The text is written for the child (a fairy-tale line), but it sits in the parent's sheet.
- Decision needed: move it out of the parent sheet, or keep it and mark it as child text.

## 2. The parent button on child screens
- `ParentInfo` is rendered inside child sheets: `OceanStageSheet` (station sheet, line ~116) and `OceanProcedureDetailSheet` (child procedure page).
- The button text is for the parent; the sheet around it is for the child.
- Decision needed: the parent button stays on the child sheet (as today), or it moves to a parent-only place.

## 3. Child steps shown next to parent text
- Steps of a procedure (`story`, `storyVariants`, `procedureSteps`, `procedureVariants`) are shown on the child sheet, next to the parent button (see item 2).
- `StagePage` shows `inlineProc.story` on the child station sheet.

## 4. UI strings used by both sides
- `src/data/i18n/ui.json` keys that appear on child screens and in parent sheets (for example `ui.text.estimated`, `ui.buttons.backToStation`). Not listed one by one yet; to be checked when the split starts.
