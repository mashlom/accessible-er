import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { useConceptBase } from '../../nav'
import { Scene, Note } from '../components/kit'
import shell from '../story.module.css'
import styles from '../pages.module.css'

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
      title="שילוט כניסה מהירה"
      subtitle="דף זה מיועד לצוות. הדפיסו את הקוד והציבו במזכירות, בטריאז׳ ובחדר ההמתנה — משפחות סורקות ונכנסות, ללא הורדה וללא הרשמה."
    >
      <div className={`${styles.qrCard} print-area`}>
        <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>
          🌈 מה שלומי? · המסע של רוני
        </p>
        {src ? (
          <img src={src} alt={`קוד QR לכניסה לאפליקציה: ${url}`} className={styles.qrImg} />
        ) : (
          <p>יוצר קוד…</p>
        )}
        <p className={styles.qrUrl} dir="ltr">
          {url}
        </p>
        <p style={{ color: 'var(--s-ink-soft)' }}>סרקו עם מצלמת הטלפון · ללא הורדה</p>
      </div>

      <div className={`${styles.actions} no-print`}>
        <button type="button" className={shell.bigBtn} onClick={() => window.print()}>
          🖨️ הדפסה כשילוט
        </button>
      </div>

      <div className="no-print" style={{ marginTop: 'var(--space-4)' }}>
        <Note>
          בדמו הקוד מצביע על הכתובת הנוכחית של הקונספט. בפריסה אמיתית זה הקוד שיוצב
          בשילוט במלר״ד.
        </Note>
      </div>
    </Scene>
  )
}
