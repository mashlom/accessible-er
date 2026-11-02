import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useI18n } from '../../hooks/useI18n'
import { TalkPage } from '../../concepts/talk/pages/TalkPage'
import talkStyles from '../../concepts/talk/talk.module.css'
import { closeHelper, useHelperOpen } from './helperStore'
import styles from './helper.module.css'

/**
 * Roni's conversation as a popup over the parent screens: the home's "let's
 * talk" tile opens it (no floating figure on the screens), and while it is
 * open the rest of the screen is dimmed. Closing: the handle, Escape, or a tap outside the sheet.
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

  // rendered on the body: an ancestor with a transform or an overflow would otherwise move the popup with the page
  return createPortal(
    open ? (
      <div className={styles.overlay} onClick={closeHelper}>
        <div
          className={styles.sheet}
          dir={dir}
          lang={lang}
          role="dialog"
          aria-modal="true"
          aria-label="Roni"
          onClick={(e) => e.stopPropagation()}
        >
          {/* the same sheet as on the world maps: a handle at the top closes it */}
          <button type="button" className={styles.handle} onClick={closeHelper} aria-label="Close">
            <span />
          </button>
          <div className={`${talkStyles.theme} ${talkStyles.light} ${styles.talkHost}`}>
            <div className={talkStyles.app} dir={dir} lang={lang}>
              <TalkPage />
            </div>
          </div>
        </div>
      </div>
    ) : null,
    document.body,
  )
}
