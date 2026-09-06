import { useState } from 'react'

/** Required stage ids in order */
export const REQUIRED_STAGES = ['reception', 'triage', 'wait-doctor', 'doctor'] as const

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
    if (raw) return JSON.parse(raw)
  } catch {}
  return initialStages()
}

function save(stages: StageState[]) {
  try { sessionStorage.setItem(KEY, JSON.stringify(stages)) } catch {}
}

export function useQuestProgress() {
  const [stages, setStages] = useState<StageState[]>(load)

  function update(next: StageState[]) {
    save(next)
    setStages(next)
  }

  /** Mark current active stage as done, unlock next */
  function completeActive() {
    const next = [...stages]
    const activeIdx = next.findIndex((s) => s.status === 'active')
    if (activeIdx === -1) return
    next[activeIdx] = { ...next[activeIdx], status: 'done' }
    // find next visible locked stage
    const nextLocked = next.findIndex((s, i) => i > activeIdx && s.visible && s.status === 'locked')
    if (nextLocked !== -1) next[nextLocked] = { ...next[nextLocked], status: 'active' }
    update(next)
  }

  /** Reveal an optional stage (nurse decides rентgen needed etc.) */
  function revealOptional(id: StageId) {
    const next = stages.map((s) =>
      s.id === id ? { ...s, visible: true, status: 'active' as const } : s
    )
    update(next)
  }

  function reset() { update(initialStages()) }

  function resetOptionals() {
    const next = stages.map((s) =>
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

  return { stages, visible, active, completeActive, revealOptional, reset, resetOptionals, visibleOptionals, allOptionalsDone }
}
