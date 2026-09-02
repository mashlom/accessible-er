import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { useConceptBase } from '../../nav'
import styles from '../talk.module.css'

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
        <h1 className={styles.docTitle}>שילוט כניסה מהירה</h1>
        <p>
          דף זה מיועד לצוות. הדפיסו את הקוד והציבו במזכירות, בטריאז׳ ובחדר ההמתנה —
          משפחות סורקות ונכנסות, ללא הורדה וללא הרשמה.
        </p>

        <div className={`${styles.qrCard} print-area`}>
          <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>💬 מה שלומי? · לדבר עם רוני</p>
          {src ? (
            <img src={src} alt={`קוד QR לכניסה לאפליקציה: ${url}`} className={styles.qrImg} />
          ) : (
            <p>יוצר קוד…</p>
          )}
          <p className={styles.qrUrl} dir="ltr">
            {url}
          </p>
          <p>סרקו עם מצלמת הטלפון · ללא הורדה</p>
        </div>

        <div className="no-print" style={{ textAlign: 'center' }}>
          <button type="button" className={styles.docBtn} onClick={() => window.print()}>
            🖨️ הדפסה כשילוט
          </button>
        </div>

        <div className={`${styles.docNote} no-print`}>
          בדמו הקוד מצביע על הכתובת הנוכחית של הקונספט. בפריסה אמיתית זה הקוד שיוצב
          בשילוט במלר״ד.
        </div>
      </div>
    </div>
  )
}
