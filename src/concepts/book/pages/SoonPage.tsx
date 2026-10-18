import { useI18n } from '../../../hooks/useI18n'
import parentUi from '../../../data/parent/ui.json'
import css from '../book.module.css'

/** A friendly placeholder for a book that is still in preparation (issue #10). */
export function SoonPage({ which }: { which: 'roni' | 'real' }) {
  const { lang, dir } = useI18n()
  const tx = (parentUi as unknown as Record<'he' | 'en' | 'ru', { books: { soonRoni: string; soonReal: string } }>)[
    lang
  ].books

  return (
    <div className={css.soon} dir={dir} lang={lang}>
      <span className={css.soonIcon} aria-hidden>
        {which === 'roni' ? '🧸' : '📷'}
      </span>
      <p>{which === 'roni' ? tx.soonRoni : tx.soonReal}</p>
    </div>
  )
}
