import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { PageHeader, Note } from '../components/ui'
import styles from './QrPage.module.css'

/**
 * Staff-only page (reached directly at /#/settings, deliberately not
 * linked from the parent-facing UI). Renders the quick-entry QR that
 * the team prints and posts in the ER — families scan and enter
 * instantly, no download and no signup.
 */
export function QrPage() {
  const [src, setSrc] = useState('')
  const url = window.location.origin + window.location.pathname + '#/'

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 320,
      margin: 2,
      color: { dark: '#2f6f6b', light: '#ffffff' },
    })
      .then(setSrc)
      .catch(() => setSrc(''))
  }, [url])

  return (
    <div className="container">
      <PageHeader
        eyebrow="לצוות המלר״ד"
        title="שילוט כניסה מהירה"
        subtitle="דף זה מיועד לצוות. הדפיסו את הקוד והציבו במזכירות, בטריאז׳ ובחדר ההמתנה — משפחות סורקות ונכנסות, ללא הורדה וללא הרשמה."
      />

      <div className={`${styles.qrCard} print-area`}>
        <p className={styles.qrTitle}>🧸 מה שלומי? · מסע במלר״ד ילדים</p>
        {src ? (
          <img src={src} alt={`קוד QR לכניסה לאפליקציה: ${url}`} className={styles.qrImg} />
        ) : (
          <p>יוצר קוד…</p>
        )}
        <p className={styles.qrUrl} dir="ltr">
          {url}
        </p>
        <p className={styles.qrHint}>סרקו עם מצלמת הטלפון · ללא הורדה</p>
      </div>

      <div className={`${styles.controls} no-print`}>
        <button type="button" className={styles.printBtn} onClick={() => window.print()}>
          🖨️ הדפסה כשילוט
        </button>
      </div>

      <div className="no-print" style={{ marginTop: 'var(--space-3)' }}>
        <Note>
          בדמו הקוד מצביע על הכתובת הנוכחית של האפליקציה. בפריסה אמיתית זה הקוד שיוצב
          בשילוט במלר״ד, במזכירות ובטריאז׳.
        </Note>
      </div>
    </div>
  )
}
