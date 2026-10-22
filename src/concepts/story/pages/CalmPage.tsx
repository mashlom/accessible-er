import { keyed } from '../../../lib/keyed'
import { useState } from 'react'
import { Link } from '../../nav'
import { Roni } from '../../../components/Roni'
import { Scene, Bubble } from '../components/kit'
import { distressTips, readySentences } from '../../../data/support'
import supportI18n from '../../../data/i18n/support.json'
import { useI18n } from '../../../hooks/useI18n'
import i18nUi from '../../../data/i18n/ui.json'
import shell from '../story.module.css'
import styles from '../pages.module.css'

type StoryCalmTexts = {
  title: string
  subtitle: string
  breathe: string
  circle: string
  tipsLabel: string
  sentencesLabel: string
  sentencesHint: string
  distract: string
  requests: string
  dialog: string
  close: string
  tips: { emoji: string; title: string; body: string }[]
}

/**
 * The hardest moment of the visit. Roni sits with the family, breathes
 * with them, and holds a set of ready sentences the parent can put on the
 * screen when talking is too much.
 */
export function CalmPage() {
  const [shown, setShown] = useState<string | null>(null)
  const { lang, dir, t } = useI18n()
  // the ready sentences in the chosen language; Hebrew is the source list
  const sentences = (keyed((supportI18n as unknown as Record<'en' | 'ru', { readySentences?: string[] }>)[lang as 'en' | 'ru'], 'i18n/support')?.readySentences) ?? readySentences
  const tx = keyed((i18nUi as unknown as Record<'he' | 'en' | 'ru', { storyCalm: StoryCalmTexts }>)[lang], 'i18n/ui').storyCalm

  // the tips: the emoji from the code, the words from the support source (the worlds' calm page uses the same)
  const tips = distressTips.map((d, i) => ({ ...d, ...(supportI18n as unknown as Record<string, { distressTips: { title: string; body: string }[] }>)[lang].distressTips[i] }))

  return (
    <div dir={dir} lang={lang} style={{ textAlign: 'start' }}>
    <Scene title={tx.title} subtitle={tx.subtitle}>
      <div className={styles.breathe}>
        <Roni size={120} mood="hug" float />
        <div className={styles.breatheCircle} aria-hidden>
          {tx.circle}
        </div>
        <p style={{ color: 'var(--s-ink-soft)', maxWidth: '30ch' }}>
          {tx.breathe}
        </p>
      </div>

      <h2 className={styles.sectionLabel}>{tx.tipsLabel}</h2>
      <div className={styles.tips}>
        {tips.map((tip) => (
          <div key={tip.title} className={styles.tip}>
            <span className={styles.tipEmoji} aria-hidden>
              {tip.emoji}
            </span>
            <div>
              <h3 className={styles.tipTitle}>{tip.title}</h3>
              <p className={styles.tipBody}>{tip.body}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className={styles.sectionLabel}>{tx.sentencesLabel}</h2>
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <Bubble>
          {tx.sentencesHint}
        </Bubble>
      </div>
      <div className={styles.sentences}>
        {sentences.map((s, i) => (
          // the button is in the parent's language; the big screen is for the staff, so it stays Hebrew
          <button key={s} type="button" className={styles.sentence} onClick={() => setShown(readySentences[i] ?? s)}>
            {s}
          </button>
        ))}
      </div>

      <Link to="/distract" className={styles.crossLink}>
        {tx.distract}
      </Link>
      <Link to="/requests" className={styles.crossLink}>
        {tx.requests}
      </Link>
      <Link to="/card/view" className={styles.crossLink}>
        {t('ui.buttons.showCard')}
      </Link>

      {shown && (
        <div
          className={shell.overlay}
          role="dialog"
          aria-modal="true"
          aria-label={tx.dialog}
          onClick={() => setShown(null)}
        >
          <p className={shell.overlayText}>{shown}</p>
          <button type="button" className={shell.bigBtn}>
            {t('ui.buttons.close')}
          </button>
        </div>
      )}
    </Scene>
    </div>
  )
}
