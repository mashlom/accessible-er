import { useEffect, useMemo, useState } from 'react'
import { ParentSheet } from '../../quest/components/ParentInfo'
import quest from '../../quest/quest.module.css'
import { useI18n } from '../../../hooks/useI18n'
import { Roni, type RoniMood } from '../../../components/Roni'
import { useSessionAvatar } from '../../../hooks/useSessionAvatar'
import { parentJourney } from '../../../data/parent'
import parentUi from '../../../data/parent/ui.json'
import roniLines from '../../../data/child/book/roni.json'
import css from '../book.module.css'
import { useStageProcedures } from '../useStageProcedures'

/**
 * "A story with Roni" — the calm journey retold as a book (issue #10):
 * one stage per page, Roni telling the child's line, the horizontal rail of
 * stops on every child page, and the parent's stage text on a bottom sheet.
 * The child's lines live in src/data/child/book/roni.json (he, en, ru) —
 * a draft, to be reviewed like the other child texts.
 */
/** Open-book icon from the ocean mockup (the same path as the quest's parent pill). */
const BOOK_PATH = 'M40.75 903C41.3553 903 41.9445 903.066 42.5176 903.197C43.0907 903.328 43.6606 903.525 44.2273 903.788V896.4C43.6992 896.1 43.139 895.875 42.5466 895.725C41.9542 895.575 41.3553 895.5 40.75 895.5C40.2864 895.5 39.8259 895.544 39.3688 895.631C38.9116 895.719 38.4705 895.85 38.0455 896.025V903.45C38.4962 903.3 38.9437 903.188 39.3881 903.113C39.8324 903.038 40.2864 903 40.75 903ZM45.7727 903.788C46.3394 903.525 46.9093 903.328 47.4824 903.197C48.0555 903.066 48.6447 903 49.25 903C49.7136 903 50.1676 903.038 50.6119 903.113C51.0563 903.188 51.5038 903.3 51.9545 903.45V896.025C51.5295 895.85 51.0884 895.719 50.6312 895.631C50.1741 895.544 49.7136 895.5 49.25 895.5C48.6447 895.5 48.0458 895.575 47.4534 895.725C46.861 895.875 46.3008 896.1 45.7727 896.4V903.788ZM45 906C44.3818 905.525 43.7121 905.156 42.9909 904.894C42.2697 904.631 41.5227 904.5 40.75 904.5C40.2091 904.5 39.6778 904.569 39.1562 904.706C38.6347 904.844 38.1356 905.038 37.6591 905.288C37.3886 905.425 37.1278 905.419 36.8767 905.269C36.6256 905.119 36.5 904.9 36.5 904.613V895.575C36.5 895.438 36.5354 895.306 36.6063 895.181C36.6771 895.056 36.7833 894.963 36.925 894.9C37.5174 894.6 38.1356 894.375 38.7795 894.225C39.4235 894.075 40.0803 894 40.75 894C41.497 894 42.2278 894.094 42.9426 894.281C43.6574 894.469 44.3432 894.75 45 895.125C45.6568 894.75 46.3426 894.469 47.0574 894.281C47.7722 894.094 48.503 894 49.25 894C49.9197 894 50.5765 894.075 51.2205 894.225C51.8644 894.375 52.4826 894.6 53.075 894.9C53.2167 894.963 53.3229 895.056 53.3938 895.181C53.4646 895.306 53.5 895.438 53.5 895.575V904.613C53.5 904.9 53.3744 905.119 53.1233 905.269C52.8722 905.419 52.6114 905.425 52.3409 905.288C51.8644 905.038 51.3653 904.844 50.8438 904.706C50.3222 904.569 49.7909 904.5 49.25 904.5C48.4773 904.5 47.7303 904.631 47.0091 904.894C46.2879 905.156 45.6182 905.525 45 906Z'

const INTRO_PAGE = 'intro'
const BASE_STAGES = ['reception', 'wait-before-triage', 'triage', 'wait-doctor', 'doctor'] as const
const OPTIONAL_STAGES = ['tests', 'treatment', 'consult', 'wait-results'] as const
const END_STAGES = ['decision'] as const
const SELECT_PAGE = 'parent-select'
/** After the decision: going home or staying in the hospital (the family chooses; the choice page is shown here). */
const DISPOSITION_PAGE = 'disposition'

/** Roni's mood follows the arc of the story: a wave hello → calm → proud. */
function moodFor(index: number, total: number): RoniMood {
  if (index <= 0) return 'wave'
  if (index === total - 1) return 'proud'
  return 'calm'
}

type RoniLine = { text: string; sub: string }

export function RoniBookPage() {
  const { t, lang, dir } = useI18n()
  const lines = (roniLines as Record<'he' | 'en' | 'ru', Record<string, RoniLine>>)[lang] ?? (roniLines as Record<'he', Record<string, RoniLine>>).he
  const [index, setIndex] = useState(0)
  const [parentOpen, setParentOpen] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [chosen, setChosen] = useState(false)
  const [disposition, setDisposition] = useState<'home' | 'hospital' | null>(null)
  const [avatar] = useSessionAvatar()

  const journey = parentJourney(lang)
  const stageOf = (id: string) => journey.find((s) => s.id === id)

  const pages: string[] = useMemo(() => {
    const extras = chosen ? OPTIONAL_STAGES.filter((id) => selected.has(id)) : [SELECT_PAGE]
    const outcome = disposition ? [disposition] : []
    return [INTRO_PAGE, ...BASE_STAGES, ...extras, ...END_STAGES, DISPOSITION_PAGE, ...outcome]
  }, [chosen, selected, disposition])

  const stageId = pages[index]
  // the stage's circles (measurements, tests, treatments, outcomes) and their sheets, as in "How it works"
  const procs = useStageProcedures(stageId, { withVideo: true, withInserts: false })
  const isSelect = stageId === SELECT_PAGE
  const isIntro = stageId === INTRO_PAGE
  const line = isSelect ? undefined : lines[stageId]
  const isLast = index === pages.length - 1
  const isDisposition = stageId === DISPOSITION_PAGE
  const isOutcome = stageId === 'home' || stageId === 'hospital'
  const stagePages = pages.filter((id) => id !== SELECT_PAGE && id !== INTRO_PAGE && id !== DISPOSITION_PAGE && id !== 'home' && id !== 'hospital')

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

  function restart() {
    setDisposition(null)
    setIndex(0)
    setSelected(new Set())
    setChosen(false)
  }


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
            {selected.size > 0 ? t('book.ui.continue', 'המשיכו') : t('book.ui.toEnd', 'אין הפניות')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={css.book} dir={dir} lang={lang}>

      <div className={css.pageContent}>
        <div className={css.roniFigure}>
          <Roni size={120} mood={moodFor(stagePages.indexOf(stageId), stagePages.length)} decorative />
          {/* the chosen figure stands beside Roni, so picking one answers "where am I?" at once */}
          {isIntro && (
            <span className={css.companion} aria-hidden>
              {avatar.kind === 'photo' ? <img src={avatar.value} alt="" /> : avatar.value}
            </span>
          )}
        </div>
        <p className={css.mainText}>{isIntro || isDisposition || isOutcome ? line?.text : `${stagePages.indexOf(stageId) + 1}. ${line?.text ?? ''}`}</p>
        <p className={css.subText}>{line?.sub}</p>
        {procs.circles}
        {/* the same placeholder as in the story's procedure pages: a filmed clip of this stage would sit here */}
        {!isIntro && !isSelect && !isDisposition && !isOutcome && stageOf(stageId) && (
          <div className={css.videoSlot}>
            <span className={css.videoSlotIcon} aria-hidden>🎬</span>
            <div>
              <strong>{(parentUi as unknown as Record<'he' | 'en' | 'ru', { procedurePage: { videoTitle: string; videoText: string } }>)[lang].procedurePage.videoTitle}</strong>
              <p>{(parentUi as unknown as Record<'he' | 'en' | 'ru', { procedurePage: { videoTitle: string; videoText: string } }>)[lang].procedurePage.videoText.replace('{title}', stageOf(stageId)?.title ?? '')}</p>
            </div>
          </div>
        )}
      </div>


      {isDisposition && !disposition && (
        <div className={css.procGrid}>
          <button className={css.procCard} onClick={() => { setDisposition('home'); setIndex((i) => i + 1) }}>
            <span className={css.procEmoji}>🏠</span>
            <span className={css.procLabel}>{t('book.ui.choiceHome', 'הביתה')}</span>
          </button>
          <button className={css.procCard} onClick={() => { setDisposition('hospital'); setIndex((i) => i + 1) }}>
            <span className={css.procEmoji}>🏥</span>
            <span className={css.procLabel}>{t('book.ui.choiceHospital', 'נשארים בבית החולים')}</span>
          </button>
        </div>
      )}

      {procs.footer}
      <div className={css.nav}>
        {index > 0 && (
          <button className={css.backBtn} onClick={() => setIndex((i) => i - 1)}>
            {t('book.ui.back', 'אחורה')}
          </button>
        )}
        {isDisposition && !disposition ? null : !isLast ? (
          <button className={css.nextBtn} onClick={() => setIndex((i) => i + 1)}>
            {t('book.ui.next', 'הלאה')}
          </button>
        ) : (
          <button className={css.nextBtn} onClick={restart}>
            {t('book.ui.restart', 'מההתחלה ↺')}
          </button>
        )}
      </div>

      {/* the ocean world's parent pill, under the whole child part */}
      {!isIntro && !isDisposition && !isOutcome && (
        <button
          type="button"
          className={`${quest.parentBtnOcean} ${quest.parentBtnOceanInline}`}
          style={{ ['--u' as string]: '1px', marginTop: '0.75rem' }}
          onClick={() => setParentOpen(true)}
          aria-haspopup="dialog"
        >
          <span className={quest.parentBtnOceanPill}>
            {t('ui.buttons.parentInfo', 'מידע נוסף להורה')}
            <svg viewBox="33 888 24 24" className={quest.parentBtnOceanIcon} aria-hidden>
              <rect x="33" y="888" width="24" height="24" rx="12" />
              <path d={BOOK_PATH} />
            </svg>
          </span>
        </button>
      )}
      {parentOpen && !isIntro && !isSelect && (
        <ParentSheet stageId={stageId} onClose={() => setParentOpen(false)} oceanLook questLinks={false} />
      )}
    </div>
  )
}
