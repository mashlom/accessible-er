import { useEffect } from 'react'
import { useI18n } from '../../hooks/useI18n'
import { Roni } from '../Roni'
import { TalkPage } from '../../concepts/talk/pages/TalkPage'
import talkStyles from '../../concepts/talk/talk.module.css'
import { closeHelper, openHelper, useHelperOpen } from './helperStore'
import styles from './helper.module.css'

/**
 * Roni's conversation as a popup, for every parent screen: a floating button
 * in the bottom-left corner opens it, and while it is open the rest of the
 * screen is dimmed. Closing: the ✕, Escape, or a tap outside the sheet.
 * The conversation itself is the same one as on the talk route.
 */
export function HelperChat() {
  const open = useHelperOpen()
  const { dir, lang } = useI18n()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeHelper()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) {
    return (
      <button
        type="button"
        className={styles.fab}
        onClick={openHelper}
        aria-label="רוני"
        aria-haspopup="dialog"
      >
        <Roni size={40} mood="calm" decorative />
      </button>
    )
  }

  return (
    <div className={styles.overlay} onClick={closeHelper}>
      <div
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-label="רוני"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={closeHelper} aria-label="סגירה">
          ✕
        </button>
        <div className={`${talkStyles.theme} ${styles.talkHost}`}>
          <div className={talkStyles.app} dir={dir} lang={lang}>
            <TalkPage />
          </div>
        </div>
      </div>
    </div>
  )
}
