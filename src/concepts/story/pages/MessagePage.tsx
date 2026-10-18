import { useState } from 'react'
import { Scene, Bubble, Note } from '../components/kit'
import shell from '../story.module.css'
import styles from '../pages.module.css'
import { useI18n } from '../../../hooks/useI18n'
import parentUi from '../../../data/parent/ui.json'

type MessageTexts = {
  title: string
  subtitle: string
  bubble: string
  templates: { label: string; starter: string }[]
  placeholder: string
  aria: string
  show: string
  mail: string
  note: string
  dialog: string
  close: string
}

/**
 * A short request or thank-you, delivered by the parent: shown large on
 * the screen, or opened in their own mail app. Nothing is sent automatically.
 */
export function MessagePage() {
  const { lang, dir } = useI18n()
  const tx = (parentUi as unknown as Record<'he' | 'en' | 'ru', { storyMessage: MessageTexts }>)[lang].storyMessage
  const [text, setText] = useState('')
  const [shown, setShown] = useState(false)

  const trimmed = text.trim()
  const mailto = `mailto:?subject=${encodeURIComponent('הודעה מההורים')}&body=${encodeURIComponent(trimmed)}`

  return (
    <div dir={dir} lang={lang} style={{ textAlign: 'start' }}>
    <Scene title={tx.title} subtitle={tx.subtitle}>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Bubble>{tx.bubble}</Bubble>
      </div>

      <div className={shell.chipRow} style={{ justifyContent: 'center' }}>
        {tx.templates.map((t) => (
          <button
            key={t.label}
            type="button"
            className={shell.pchip}
            onClick={() => setText(t.starter)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <textarea
        className={styles.textarea}
        style={{ marginTop: 'var(--space-3)' }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={tx.placeholder}
        rows={4}
        maxLength={400}
        aria-label={tx.aria}
      />

      <div className={styles.actions}>
        <button
          type="button"
          className={shell.bigBtn}
          disabled={!trimmed}
          onClick={() => setShown(true)}
        >
          {tx.show}
        </button>
        <a
          className={shell.ghostBtn}
          href={trimmed ? mailto : undefined}
          aria-disabled={!trimmed}
          style={!trimmed ? { pointerEvents: 'none', opacity: 0.5 } : undefined}
        >
          {tx.mail}
        </a>
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        <Note>{tx.note}</Note>
      </div>

      {shown && (
        <div
          className={shell.overlay}
          role="dialog"
          aria-modal="true"
          aria-label={tx.dialog}
          onClick={() => setShown(false)}
        >
          <p className={shell.overlayText}>{trimmed}</p>
          <button type="button" className={shell.bigBtn}>
            {tx.close}
          </button>
        </div>
      )}
    </Scene>
    </div>
  )
}
