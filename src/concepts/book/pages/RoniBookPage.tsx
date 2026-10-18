import { useEffect, useMemo, useRef, useState } from 'react'
import { useI18n } from '../../../hooks/useI18n'
import { Roni, type RoniMood } from '../../../components/Roni'
import { avatarEmojis, fileToAvatarDataUrl, useSessionAvatar } from '../../../hooks/useSessionAvatar'
import { parentJourney } from '../../../data/parent'
import parentUi from '../../../data/parent/ui.json'
import roniLines from '../../../data/child/book/roni.json'
import css from '../book.module.css'

/**
 * "A story with Roni" — the calm journey retold as a book (issue #10):
 * one stage per page, Roni telling the child's line, the horizontal rail of
 * stops on every child page, and the parent's stage text on a bottom sheet.
 * The child's lines live in src/data/child/book/roni.json (he, en, ru) —
 * a draft, to be reviewed like the other child texts.
 */
const INTRO_PAGE = 'intro'
const BASE_STAGES = ['reception', 'wait-before-triage', 'triage', 'wait-doctor', 'doctor'] as const
const OPTIONAL_STAGES = ['tests', 'treatment', 'consult', 'wait-results'] as const
const END_STAGES = ['decision'] as const
const SELECT_PAGE = 'parent-select'

/** Roni's mood follows the arc of the story: a wave hello → calm → proud. */
function moodFor(index: number, total: number): RoniMood {
  if (index <= 0) return 'wave'
  if (index === total - 1) return 'proud'
  return 'calm'
}

type AvatarTexts = { label: string; photo: string; remove: string; note: string }
type RealBookTexts = { parentBtn: string; close: string; whatHappens: string; challenge: string; canAsk: string; avatar: AvatarTexts }
type RoniLine = { text: string; sub: string }

export function RoniBookPage() {
  const { t, lang, dir } = useI18n()
  // the sheet texts are shared with the "how it works" book
  const tx = (parentUi as unknown as Record<'he' | 'en' | 'ru', { realBook: RealBookTexts }>)[lang].realBook
  const lines = (roniLines as Record<'he' | 'en' | 'ru', Record<string, RoniLine>>)[lang] ?? (roniLines as Record<'he', Record<string, RoniLine>>).he
  const [index, setIndex] = useState(0)
  const [parentOpen, setParentOpen] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [chosen, setChosen] = useState(false)
  const [avatar, setAvatar, resetAvatar] = useSessionAvatar()
  const fileRef = useRef<HTMLInputElement>(null)

  const journey = parentJourney(lang)
  const stageOf = (id: string) => journey.find((s) => s.id === id)

  const pages: string[] = useMemo(() => {
    const extras = chosen ? OPTIONAL_STAGES.filter((id) => selected.has(id)) : [SELECT_PAGE]
    return [INTRO_PAGE, ...BASE_STAGES, ...extras, ...END_STAGES]
  }, [chosen, selected])

  const stageId = pages[index]
  const isSelect = stageId === SELECT_PAGE
  const isIntro = stageId === INTRO_PAGE
  const line = isSelect ? undefined : lines[stageId]
  const parent = isSelect || isIntro ? undefined : stageOf(stageId)
  const isLast = index === pages.length - 1
  const stagePages = pages.filter((id) => id !== SELECT_PAGE && id !== INTRO_PAGE)

  useEffect(() => {
    setParentOpen(false)
  }, [index])

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      setAvatar({ kind: 'photo', value: await fileToAvatarDataUrl(file) })
    } catch {
      /* unreadable image — keep the current avatar */
    }
  }

  function restart() {
    setIndex(0)
    setSelected(new Set())
    setChosen(false)
  }

  /* the horizontal rail of stops, on every child page: where this page sits on the visit */
  const rail = (
    <div className={css.rail} aria-hidden>
      {stagePages.map((id) => {
        const stage = stageOf(id)
        const state = id === stageId ? css.railStopOn : stagePages.indexOf(id) < stagePages.indexOf(stageId) ? css.railStopDone : ''
        return (
          <span key={id} className={[css.railStop, state].join(' ')}>
            {id === stageId ? (
              avatar.kind === 'photo' ? (
                <img src={avatar.value} alt="" className={css.railAvatar} />
              ) : (
                avatar.value
              )
            ) : (
              stage?.emoji
            )}
          </span>
        )
      })}
    </div>
  )

  if (isSelect) {
    return (
      <div className={css.book} dir={dir} lang={lang}>
        <div className={css.parentSelect}>
          <p className={css.parentSelectTitle}>{t('book.pages.parent-select.text', 'להורים ולצוות')}</p>
          <p className={css.parentSelectSub}>{t('book.pages.parent-select.sub', 'בחרו את השלבים הבאים שהרופא/ה קבע/ה')}</p>
          <div className={css.procGrid}>
            {OPTIONAL_STAGES.map((id) => {
              const on = selected.has(id)
              return (
                <button
                  key={id}
                  className={[css.procCard, on ? css.procCardOn : ''].join(' ')}
                  onClick={() => toggle(id)}
                  aria-pressed={on}
                >
                  <span className={css.procEmoji}>{stageOf(id)?.emoji}</span>
                  <span className={css.procLabel}>{stageOf(id)?.title}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className={css.nav}>
          <button className={css.backBtn} onClick={() => setIndex((i) => Math.max(0, i - 1))}>
            {t('book.ui.back', 'אחורה')}
          </button>
          <button className={css.nextBtn} onClick={() => setChosen(true)}>
            {selected.size > 0 ? t('book.ui.continue', 'המשיכו') : t('book.ui.toEnd', 'לסיום')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={css.book} dir={dir} lang={lang}>
      {!isIntro && rail}

      <div className={css.pageContent}>
        <div className={css.roniFigure}>
          <Roni size={120} mood={moodFor(stagePages.indexOf(stageId), stagePages.length)} decorative />
        </div>
        <p className={css.mainText}>{line?.text}</p>
        <p className={css.subText}>{line?.sub}</p>
      </div>

      {!isIntro && (
        <button type="button" className={css.parentBtn} onClick={() => setParentOpen(true)} aria-haspopup="dialog">
          {tx.parentBtn}
        </button>
      )}

      {isIntro && (
        <div className={css.avatarPicker}>
          <span className={css.avatarLabel}>{tx.avatar.label}</span>
          <div className={css.avatarRow}>
            {avatarEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={[css.avatarChip, avatar.kind === 'emoji' && avatar.value === emoji ? css.avatarChipOn : ''].join(' ')}
                onClick={() => setAvatar({ kind: 'emoji', value: emoji })}
                aria-pressed={avatar.kind === 'emoji' && avatar.value === emoji}
              >
                {emoji}
              </button>
            ))}
            <button type="button" className={`${css.avatarChip} ${css.avatarChipWide}`} onClick={() => fileRef.current?.click()}>
              {tx.avatar.photo}
            </button>
            {avatar.kind === 'photo' && (
              <button type="button" className={`${css.avatarChip} ${css.avatarChipWide}`} onClick={resetAvatar}>
                {tx.avatar.remove}
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={onPickFile} style={{ display: 'none' }} />
          <span className={css.avatarNote}>{tx.avatar.note}</span>
        </div>
      )}

      <div className={css.nav}>
        {index > 0 && (
          <button className={css.backBtn} onClick={() => setIndex((i) => i - 1)}>
            {t('book.ui.back', 'אחורה')}
          </button>
        )}
        {!isLast ? (
          <button className={css.nextBtn} onClick={() => setIndex((i) => i + 1)}>
            {t('book.ui.next', 'הלאה')}
          </button>
        ) : (
          <button className={css.nextBtn} onClick={restart}>
            {t('book.ui.restart', 'מההתחלה ↺')}
          </button>
        )}
      </div>

      {parentOpen && parent && (
        <div className={css.sheetBackdrop} onClick={() => setParentOpen(false)}>
          <div className={css.sheet} role="dialog" aria-modal="true" aria-label={tx.parentBtn} onClick={(e) => e.stopPropagation()}>
            <h2 className={css.sheetTitle}>{parent.title}</h2>
            <p>{parent.meaning}</p>
            <h3 className={css.sheetLabel}>{tx.whatHappens}</h3>
            <p>{parent.whatHappens}</p>
            <h3 className={css.sheetLabel}>{tx.challenge}</h3>
            <p>{parent.challenge}</p>
            <h3 className={css.sheetLabel}>{tx.canAsk}</h3>
            <ul className={css.sheetList}>
              {parent.canAsk.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <button type="button" className={css.nextBtn} onClick={() => setParentOpen(false)}>
              {tx.close}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
