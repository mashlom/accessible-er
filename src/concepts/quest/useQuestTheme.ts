import { useState } from 'react'
import { getTheme, type QuestTheme } from './themes'

const KEY = 'quest-theme'

function readId(): string {
  try { return sessionStorage.getItem(KEY) ?? '' } catch { return '' }
}
function writeId(id: string) {
  try { sessionStorage.setItem(KEY, id) } catch {}
}

export function useQuestTheme(): { theme: QuestTheme; setThemeId: (id: string) => void } {
  const [id, setId] = useState<string>(readId)

  function setThemeId(newId: string) {
    writeId(newId)
    setId(newId)
  }

  return { theme: getTheme(id), setThemeId }
}
