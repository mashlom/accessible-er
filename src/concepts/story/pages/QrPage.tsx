import { keyed } from '../../../lib/keyed'
import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { useConceptBase } from '../../nav'
import { Scene, Note } from '../components/kit'
import shell from '../story.module.css'
import styles from '../pages.module.css'

import parentUi from '../../../data/parent/ui.json'

// the sign is for the team, so its texts are the same in every language
const staff = keyed((parentUi as unknown as { he: { staffSign: Record<string, string> } }).he, 'parent/ui').staffSign

/**
 * Staff-only page (reached directly at #/story/settings, deliberately not
 * linked from the family-facing UI): the quick-entry QR the team prints
 * and posts in the ER. No download, no signup.
 */
export function QrPage() {
  const [src, setSrc] = useState('')
  const base = useConceptBase()
  const url = `${window.location.origin}${window.location.pathname}#${base || '/'}`

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 320,
      margin: 2,
      color: { dark: '#33455c', light: '#ffffff' },
    })
      .then(setSrc)
      .catch(() => setSrc(''))
  }, [url])

  return (
    <Scene
      title={staff.title}
      subtitle={staff.subtitle}
    >
      <div className={`${styles.qrCard} print-area`}>
        <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>
          {staff.storyName}
        </p>
        {src ? (
          <img src={src} alt={`QR code to open the app: ${url}`} className={styles.qrImg} />
        ) : (
          <p>{staff.generating}</p>
        )}
        <p className={styles.qrUrl} dir="ltr">
          {url}
        </p>
        <p style={{ color: 'var(--s-ink-soft)' }}>{staff.scan}</p>
      </div>

      <div className={`${styles.actions} no-print`}>
        <button type="button" className={shell.bigBtn} onClick={() => window.print()}>
          🖨️ {staff.print}
        </button>
      </div>

      <div className="no-print" style={{ marginTop: 'var(--space-4)' }}>
        <Note>{staff.demoNote}</Note>
      </div>
    </Scene>
  )
}
