import { keyed } from '../../../lib/keyed'
import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { useConceptBase } from '../../nav'
import styles from '../talk.module.css'

import parentUi from '../../../data/parent/ui.json'

// the sign is for the team, so its texts are the same in every language
const staff = keyed((parentUi as unknown as { he: { staffSign: Record<string, string> } }).he, 'parent/ui').staffSign

/** Staff-only signage page, reached directly at #/talk/settings. */
export function QrPage() {
  const [src, setSrc] = useState('')
  const base = useConceptBase()
  const url = `${window.location.origin}${window.location.pathname}#${base || '/'}`

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 320,
      margin: 2,
      color: { dark: '#6b4b8f', light: '#ffffff' },
    })
      .then(setSrc)
      .catch(() => setSrc(''))
  }, [url])

  return (
    <div id="main" className={styles.doc}>
      <div className={styles.docInner}>
        <h1 className={styles.docTitle}>{staff.title}</h1>
        <p>{staff.subtitle}</p>

        <div className={`${styles.qrCard} print-area`}>
          <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>{staff.talkName}</p>
          {src ? (
            <img src={src} alt={`QR code to open the app: ${url}`} className={styles.qrImg} />
          ) : (
            <p>{staff.generating}</p>
          )}
          <p className={styles.qrUrl} dir="ltr">
            {url}
          </p>
          <p>{staff.scan}</p>
        </div>

        <div className="no-print" style={{ textAlign: 'center' }}>
          <button type="button" className={styles.docBtn} onClick={() => window.print()}>
            🖨️ {staff.print}
          </button>
        </div>

        <div className={`${styles.docNote} no-print`}>{staff.demoNote}</div>
      </div>
    </div>
  )
}
