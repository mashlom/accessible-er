import { useEffect, useState } from 'react'

/** Required stage ids in order */
export const REQUIRED_STAGES = ['reception', 'wait-before-triage', 'triage', 'wait-doctor', 'doctor'] as const

/** Optional stage ids that can be inserted mid-visit */
export const OPTIONAL_STAGES = ['tests', 'consult', 'wait-results', 'treatment'] as const

export type StageId = typeof REQUIRED_STAGES[number] | typeof OPTIONAL_STAGES[number]

export interface StageState {
  id: StageId
  /** true = shown on the map (required always true; optional starts false) */
  visible: boolean
  /** 'locked' | 'active' | 'done' */
  status: 'locked' | 'active' | 'done'
  /** for optional stages: which required stage they belong to */
  parentId?: typeof REQUIRED_STAGES[number]
}

const KEY = 'quest-progress'
const PROC_KEY = 'quest-procedures-done'

export function loadProcs(): Set<string> {
  try {
    const raw = sessionStorage.getItem(PROC_KEY)
    if (raw) return new Set(JSON.parse(raw))
  } catch {}
  return new Set()
}

/** Tells every component using this hook that the done procedures changed (they each keep their own copy) */
const PROCS_EVENT = 'quest-procs-changed'

function saveProcs(procs: Set<string>) {
  try { sessionStorage.setItem(PROC_KEY, JSON.stringify([...procs])) } catch {}
  try { window.dispatchEvent(new Event(PROCS_EVENT)) } catch {}
}

function initialStages(): StageState[] {
  const required: StageState[] = REQUIRED_STAGES.map((id, i) => ({
    id,
    visible: true,
    status: i === 0 ? 'active' : 'locked',
  }))
  const optional: StageState[] = [
    { id: 'tests', visible: false, status: 'locked', parentId: 'doctor' },
    { id: 'consult', visible: false, status: 'locked', parentId: 'doctor' },
    { id: 'wait-results', visible: false, status: 'locked', parentId: 'doctor' },
    { id: 'treatment', visible: false, status: 'locked', parentId: 'doctor' },
  ]
  return [...required, ...optional]
}

function load(): StageState[] {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (raw) {
      // Saved progress may predate newly added stages — merge it into the current stage list
      const saved: StageState[] = JSON.parse(raw)
      const byId = new Map(saved.map((s) => [s.id, s]))
      const merged = initialStages().map((s) => byId.get(s.id) ?? { ...s, status: 'locked' as const })
      const activeIdx = merged.findIndex((s) => s.status === 'active')
      if (activeIdx !== -1) {
        const firstLocked = merged.findIndex((s) => s.visible && s.status === 'locked')
        if (firstLocked !== -1 && firstLocked < activeIdx) {
          merged[activeIdx] = { ...merged[activeIdx], status: 'locked' }
          merged[firstLocked] = { ...merged[firstLocked], status: 'active' }
        }
      }
      return merged
    }
  } catch {}
  return initialStages()
}

/** Tells every component using this hook that the stages changed (they each keep their own copy) */
const STAGES_EVENT = 'quest-stages-changed'

function save(stages: StageState[]) {
  try { sessionStorage.setItem(KEY, JSON.stringify(stages)) } catch {}
  try { window.dispatchEvent(new Event(STAGES_EVENT)) } catch {}
}

export function useQuestProgress() {
  const [stages, setStages] = useState<StageState[]>(load)
  const [doneProcedures, setDoneProcedures] = useState<Set<string>>(loadProcs)

  useEffect(() => {
    const on = () => setDoneProcedures(loadProcs())
    const onStages = () => setStages(load())
    window.addEventListener(PROCS_EVENT, on)
    window.addEventListener(STAGES_EVENT, onStages)
    return () => {
      window.removeEventListener(PROCS_EVENT, on)
      window.removeEventListener(STAGES_EVENT, onStages)
    }
  }, [])

  function update(next: StageState[]) {
    save(next)
    setStages(next)
  }

  /** Mark current active stage as done, unlock next */
  function completeActive() {
    // every change starts from the saved state, not from this component's copy: another page's copy (the map under
    // a sheet, an earlier visit) may be older, and writing it back would undo a station that was just finished
    const next = [...load()]
    const activeIdx = next.findIndex((s) => s.status === 'active')
    if (activeIdx === -1) return
    next[activeIdx] = { ...next[activeIdx], status: 'done' }
    // find next visible locked stage
    const nextLocked = next.findIndex((s, i) => i > activeIdx && s.visible && s.status === 'locked')
    if (nextLocked !== -1) next[nextLocked] = { ...next[nextLocked], status: 'active' }
    update(next)
  }

  /** Mark a specific stage as done (for optional stages where multiple can be active) */
  function completeStage(id: string) {
    const next = load().map((s) => s.id === id ? { ...s, status: 'done' as const } : s)
    update(next)
  }

  /** Reveal an optional stage (nurse decides rентgen needed etc.) */
  function revealOptional(id: StageId) {
    const next = load().map((s) =>
      s.id === id ? { ...s, visible: true, status: 'active' as const } : s
    )
    update(next)
  }

  /** Reveal multiple optional stages at once (avoids stale-closure bug in loops) */
  function revealMultiple(ids: StageId[]) {
    const idSet = new Set(ids)
    const next = load().map((s) =>
      idSet.has(s.id as StageId) ? { ...s, visible: true, status: 'active' as const } : s
    )
    update(next)
  }

  function completeProcedure(id: string) {
    const current = loadProcs()
    current.add(id)
    saveProcs(current)
    setDoneProcedures(new Set(current))
  }

  function resetProcs() {
    saveProcs(new Set())
    setDoneProcedures(new Set())
  }

  function reset() { update(initialStages()); resetProcs() }

  function resetOptionals() {
    const next = load().map((s) =>
      (OPTIONAL_STAGES as readonly string[]).includes(s.id)
        ? { ...s, visible: false, status: 'locked' as const }
        : s
    )
    update(next)
  }

  const visible = stages.filter((s) => s.visible)
  const active = stages.find((s) => s.status === 'active')
  const visibleOptionals = stages.filter((s) => !REQUIRED_STAGES.includes(s.id as typeof REQUIRED_STAGES[number]) && s.visible)
  const allOptionalsDone = visibleOptionals.length > 0 && visibleOptionals.every((s) => s.status === 'done')

  return { stages, visible, active, completeActive, completeStage, completeProcedure, doneProcedures, revealOptional, revealMultiple, reset, resetOptionals, visibleOptionals, allOptionalsDone }
}
